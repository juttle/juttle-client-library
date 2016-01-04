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

        return api.runJob(bundle, inputValues)
        .then(job => {
            let jobSocket = new JobSocket(`${self.outriggerUrl}`)

            jobSocket.on('message', msg => {
                console.log(msg);
            });
        })
    }
}
