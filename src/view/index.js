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
        let self = this;
        let { dispatch } = this.store;

        // incase we're currently running a job, stop the old one
        this.stop();

        return this.api.runJob(bundle, inputValues)
        .then(job => {
            dispatch(jobCreated(job.job_id));

            self._jobSocket = new JobSocket(`ws://${self.outriggerUrl}/api/v0/jobs/${job.job_id}`);
            self._jobSocket.on("message", self._onMessage, self);
        });
    }

    _onMessage(msg) {
        let { dispatch } = this.store;

        if (msg.type === "job_start") {
            dispatch(jobStart(msg.sinks));
        } else {
            this.jobEvents.emit(msg.sink_id, msg);
        }
    }

    stop() {
        if (this._jobSocket) {
            this._jobSocket.close();
            this._jobSocket.removeListener("message", this._onMessage, this);
            this._jobSocket = null;
        }
    }
}
