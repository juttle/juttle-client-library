import React from 'react';
import * as ReactDOM from 'react-dom';
import EventEmitter from 'eventemitter3';

import ViewLayout from './view-layout';
import JobManager from '../utils/job-manager';
import viewLayoutGen from './view-layout-gen';
import juttleViewGen from './juttle-view-gen';

export default class View {
    constructor(outriggerUrl, el) {
        this.el = el;
        this.outriggerUrl = outriggerUrl;
        this.jobEvents = new EventEmitter();

        // setup _jobManager
        this._jobManager = new JobManager(outriggerUrl);
        this._jobManager.on('message', this._onMessage, this);

        ReactDOM.render(
            <ViewLayout jobEvents={this.jobEvents}/>,
            this.el
        );
    }

    run(bundle, inputValues) {
        let self = this;

        return this._jobManager.start(bundle, inputValues)
        .then(res => {
            let juttleViews = juttleViewGen(res.views);
            let viewLayout = viewLayoutGen(res.views);

            ReactDOM.render(
                <ViewLayout
                    key={res.job_id}
                    jobEvents={this.jobEvents}
                    viewLayout={viewLayout}
                    juttleViews={juttleViews} />,
                this.el
            );

            // return this.jobEvents;
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
            this.jobEvents.emit(msg.type, msg[msg.type]);
        } else {
            this.jobEvents.emit(msg.sink_id, msg);
        }
    }

    stop() {
        return this._jobManager.close();
    }
}
