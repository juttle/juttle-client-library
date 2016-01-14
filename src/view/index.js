import React from "react";
import { render } from "react-dom";
import { compose, createStore, applyMiddleware } from "redux";
import { Provider } from "react-redux";
import thunk from "redux-thunk"; // allows for async actions

import ViewLayout from "./view-layout";
import reducers from "./reducers";
import OutriggerAPI from "../utils/api";
import JobSocket from "../utils/job-socket";
import EventEmitter from "eventemitter3";
import { jobCreated, jobStart } from "./actions";

export default class View {
    constructor(outriggerUrl, el) {
        this.el = el;
        this.outriggerUrl = outriggerUrl;
        this.api = new OutriggerAPI(`http://${outriggerUrl}`);
        this.jobEvents = new EventEmitter();

        const store = compose(
            applyMiddleware(thunk)
        )(createStore)(reducers);

        this.store = store;

        render(
            <Provider store={this.store}>
                <ViewLayout jobEvents={this.jobEvents}/>
            </Provider>,
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
        let { dispatch } = this.store;

        // incase we're currently running a job, stop the old one
        return this.stop()
        .then(() => {
            return self.api.runJob(bundle, inputValues);
        })
        .then(job => {
            if (!job.job_id) {
                let e = new Error(job.code || job.message || "runJob error");
                e.info = job.info;
                throw e;
            }
            dispatch(jobCreated(job.job_id));

            self._jobSocket = new JobSocket(`ws://${self.outriggerUrl}/api/v0/jobs/${job.job_id}`);
            self._jobSocket.on("message", self._onMessage, self);
            self._jobSocket.on("close", self._onClose, self);

            self._starting = false;

            return self.jobEvents;
        });
    }

    _onMessage(msg) {
        let { dispatch } = this.store;

        if (msg.type === "job_start") {
            dispatch(jobStart(msg.sinks));
        } else if (msg.type === "warning" || msg.type === "error") {
            this.jobEvents.emit(msg.type, msg[msg.type]);
        } else {
            this.jobEvents.emit(msg.sink_id, msg);
        }
    }

    _onClose() {
        this._jobSocket.removeListener("message", this._onMessage, this);
        this._jobSocket.removeListener("close", this._onClose, this);
        this._jobSocket = null;
    }

    stop() {
        if (this._jobSocket) {
            return this._jobSocket.close();
        }

        return Promise.resolve();
    }
}
