import React from 'react'
import { render } from 'react-dom'
import { compose, createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import thunk from 'redux-thunk' // allows for async actions

import Input from './inputs';
import View from './view';
import reducers from './reducers';
import jobMiddleware from './middleware/job-socket';
import * as api from './utils/api';

import {
    updateProgram,
    updateModules,
    runBundle,
    updateInputDefs
} from './actions';

import './sass/main.scss'

export default function Juttle(outriggerUrl) {
    this.outriggerUrl = outriggerUrl;

    /*
     * Describe the views and inputs for a bundle
     */
    this.describe = (bundle) => {
        return api.getInputs(bundle)
        .then(inputs => {
            return { inputs: inputs };
        })
    }

    this.Input = Input.bind(null, this.outriggerUrl);
    this.View = View.bind(null, this.outriggerUrl);
}
