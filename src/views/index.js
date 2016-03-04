import React from 'react';
import * as ReactDOM from 'react-dom';

import EventTarget from '../utils/event-target';
import ViewLayout from './view-layout';
import JobManager from '../utils/job-manager';
import viewLayoutGen from './view-layout-gen';
import juttleViewGen from './juttle-view-gen';

export default class View extends EventTarget {
    constructor(juttleServiceUrl, el) {
        super();

        this.el = el;
        this.juttleServiceUrl = juttleServiceUrl;

        // setup _jobManager
        this._jobManager = new JobManager(juttleServiceUrl);
        this._jobManager.on('message', this._onMessage, this);
        this._jobManager.on('job-status', (status) => {
            this._emitter.emit('job-status', status);
        });

        ReactDOM.render(
            <ViewLayout jobEvents={this._emitter}/>,
            this.el
        );
    }

    run(bundle, inputValues, addDebugLogs) {
        let self = this;

        return this._jobManager.start(bundle, inputValues, addDebugLogs)
        .then(res => {
            let juttleViews = juttleViewGen(res.views);
            let viewLayout = viewLayoutGen(res.views);

            ReactDOM.render(
                <ViewLayout
                    key={res.job_id}
                    jobEvents={this._emitter}
                    viewLayout={viewLayout}
                    juttleViews={juttleViews} />,
                this.el
            );

            return res;
        })
        .catch(err => {
            return self._jobManager.close()
            .then(() => {
                throw err; });
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

    _onMessage(msg) {
        if (msg.type === 'warning' || msg.type === 'error') {
            this._emitter.emit(msg.type, msg[msg.type]);
        } else if (msg.type === 'log') {
            this._emitter.emit(msg.type, msg);
        } else {
            this._emitter.emit(msg.view_id, msg);
        }
    }

    stop() {
        return this._jobManager.close();
    }
}
