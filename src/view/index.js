import React from 'react';
import * as ReactDOM from 'react-dom';
import EventEmitter from 'eventemitter3';

import errors from '../utils/errors';
import ViewLayout from './view-layout';
import OutriggerAPI from '../utils/api';
import JobSocket from '../utils/job-socket';
import viewLayoutGen from './view-layout-gen';
import juttleViewGen from './juttle-view-gen';

export default class View {
    constructor(outriggerUrl, el) {
        this.el = el;
        this.outriggerUrl = outriggerUrl;
        this.api = new OutriggerAPI(`http://${outriggerUrl}`);
        this.jobEvents = new EventEmitter();

        ReactDOM.render(
            <ViewLayout jobEvents={this.jobEvents}/>,
            this.el
        );
    }

    run(bundle, inputValues) {
        // prevent rerunning until current run is complete
        if (this._starting) {
            return;
        }

        this._starting = true;
        let self = this;

        // incase we're currently running a job, stop the old one
        return this.stop()
        .then(() => {
            return self.api.runJob(bundle, inputValues);
        })
        .then(job => {
            if (!job.job_id) {
                let e = new Error(job.code || job.message || 'runJob error');
                e.info = job.info;
                throw e;
            }
            this.job_id = job.job_id;
            self._jobSocket = new JobSocket(`ws://${self.outriggerUrl}/api/v0/jobs/${job.job_id}`);

            return new Promise((resolve, reject) => {
                self._jobSocket.once('message', (msg) => {
                    try {
                        if (msg.type !== 'job_start') {
                            throw new errors.JobStartError();
                        }

                        self._instantiateViews(msg.sinks);

                        self._jobSocket.on('message', self._onMessage, self);
                        self._jobSocket.on('close', self._onClose, self);
                        self._starting = false;
                        resolve(self.jobEvents);
                    } catch (err) {
                        // if there was an error in this step, abort job
                        this.stop();
                        reject(err);
                    }
                }, this);
            });
        });
    }

    clear() {
        return this.stop()
        .then(() => {
            ReactDOM.render(
                <ViewLayout />,
                this.el
            );
        });
    }

    _instantiateViews(views) {
        let juttleViews = juttleViewGen(views);
        let viewLayout = viewLayoutGen(views);

        ReactDOM.render(
            <ViewLayout
                key={this.job_id}
                jobEvents={this.jobEvents}
                viewLayout={viewLayout}
                juttleViews={juttleViews} />,
            this.el
        );
    }

    _onMessage(msg) {
        if (msg.type === 'warning' || msg.type === 'error') {
            this.jobEvents.emit(msg.type, msg[msg.type]);
        } else {
            this.jobEvents.emit(msg.sink_id, msg);
        }
    }

    _onClose() {
        this._jobSocket.removeListener('message', this._onMessage, this);
        this._jobSocket.removeListener('close', this._onClose, this);
        this._jobSocket = null;
    }

    stop() {
        if (this._jobSocket) {
            return this._jobSocket.close();
        }

        return Promise.resolve();
    }
}
