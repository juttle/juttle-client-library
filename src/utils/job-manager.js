import Promise from 'bluebird';
import JSDP from 'juttle-jsdp';

import EventTarget from './event-target';
import errors from './errors';
import * as http from './http-api';

const API_PREFIX = '/api/v0';

export let JobStatus = {
    CONNECTING: 0, // from https://developer.mozilla.org/en-US/docs/Web/API/WebSocket#Ready_state_constants
    OPEN: 1,
    CLOSING: 2,
    CLOSED: 3
};

export default class JobSocket extends EventTarget {
    constructor(host, opts) {
        super();

        opts = opts || {};

        this.host = host;
        this.secure = opts.secure || false;
    }

    start(bundle, inputValues) {
        let self = this;

        return this.close()
        .then(() => {
            return http.runJob(`http://${this.host}`, bundle, inputValues);
        })
        .then(job => {
            return new Promise((resolve, reject) => {
                let socketUrl = `ws://${this.host}${API_PREFIX}/jobs/${job.job_id}`;
                self._socket = new WebSocket(socketUrl);
                self._socket.onclose = (event) => { this._emitter.emit('close'); };
                self._socket.onerror = this._onError.bind(this);

                // make sure first message is job_start
                self._socket.onmessage = (event) => {
                    let msg = JSDP.deserialize(event.data);

                    if (msg.type !== 'job_start') {
                        reject(new errors.JobStartError());
                    }

                    self._socket.onmessage = self._onMessage.bind(this);
                    resolve({
                        job_id: job.job_id,
                        views: msg.sinks
                    });
                };
            });
        });
    }

    getStatus() {
        if (!this._socket) {
            return JobStatus.CLOSED;
        } else {
            return this._socket.readyState;
        }
    }

    send(msg) {
        this._socket.send(JSON.stringify(msg));
    }

    _onError(event) {
        this._emitter.emit('error', JSON.parse(event.data));
    }

    _onMessage(event) {
        let msg = JSDP.deserialize(event.data);


        // manage pings so the rest of the app doesn't have to
        if (msg.type === 'ping') {
            this.send({
                type: 'pong'
            });

            return;
        }

        this._emitter.emit('message', msg);
    }

    close() {
        let self = this;
        return new Promise((resolve, reject) => {
            if (self.getStatus() === JobStatus.CLOSED) {
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
