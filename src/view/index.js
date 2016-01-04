import React from 'react'
import { render } from 'react-dom'
import { compose, createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import thunk from 'redux-thunk' // allows for async actions

import ViewLayout from './view-layout';
import reducers from './reducers';
import * as api from '../utils/api';
import JobSocket from '../utils/job-socket';
import EventEmitter from 'eventemitter3';
import { jobCreated, jobStart } from './actions';

export default class View {
    constructor(outriggerUrl, el) {
        this.el = el;
        this.outriggerUrl = outriggerUrl;
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

        return api.runJob(bundle, inputValues)
        .then(job => {
            dispatch(jobCreated(job.job_id));

            let jobSocket = new JobSocket(`ws://${self.outriggerUrl}/api/v0/jobs/${job.job_id}`)
            jobSocket.on('message', msg => {
                if (msg.type === 'job_start') {
                    dispatch(jobStart(msg.sinks));
                } else {
                    self.jobEvents.emit(msg.sink_id, msg);
                }
            });
        });
    }
}
