import Promise from 'bluebird';
import JSDP from 'juttle-jsdp';

import EventTarget from './event-target';
import errors from './errors';
import * as http from './http-api';

const API_PREFIX = '/api/v0';

export let JobStatus = {
    STARTING: 'STARTING',
    RUNNING: 'RUNNING',
    STOPPED: 'STOPPED'
};

export default class JobSocket extends EventTarget {
    constructor(host, opts) {
        super();

        opts = opts || {};

        this.host = host;
        this.secure = opts.secure || false;

        this.status = JobStatus.STOPPED;
    }

    start(bundle, inputValues) {
        let self = this;

        this._setStatus(JobStatus.STARTING);

        return this.close()
        .then(() => {
            return http.runJob(`http://${this.host}`, bundle, inputValues);
        })
        .then(job => {
            return new Promise((resolve, reject) => {
                let socketUrl = `ws://${this.host}${API_PREFIX}/jobs/${job.job_id}`;
                self._socket = new WebSocket(socketUrl);
                self._socket.onopen = this._onOpen;
                self._socket.onclose = this._onClose;
                self._socket.onerror = this._onError;

                // make sure first message is job_start
                self._socket.onmessage = (event) => {
                    let msg = JSDP.deserialize(event.data);

                    if (msg.type !== 'job_start') {
                        reject(new errors.JobStartError());
                    }

                    self._socket.onmessage = self._onMessage;
                    resolve({
                        job_id: job.job_id,
                        views: msg.views
                    });
                };
            });
        });
    }

    _setStatus(newStatus) {
        if (this.status !== newStatus) {
            this.status = newStatus;
            this._emitter.emit('job-status', this.status);
        }
    }

    send(msg) {
        this._socket.send(JSON.stringify(msg));
    }

    _onOpen = (event) => {
        this._setStatus(JobStatus.RUNNING);
        this._emitter.emit('open', event);
    };

    _onClose = (event) => {
        this._setStatus(JobStatus.STOPPED);
        this._emitter.emit('close', event);
    };

    _onError = (event) => {
        this._emitter.emit('error', JSON.parse(event.data));
    };

    _onMessage = (event) => {
        let msg = JSDP.deserialize(event.data);

        // manage pings so the rest of the app doesn't have to
        if (msg.type === 'ping') {
            this.send({
                type: 'pong'
            });

            return;
        }

        this._emitter.emit('message', msg);
    };

    close() {
        let self = this;
        return new Promise((resolve, reject) => {
            if (!self._socket || self._socket.readyState === WebSocket.CLOSED) {
                resolve();
                return;
            }

            self.once('close', () => {
                resolve();
            });

            self._socket.close();
        });
    }

}
