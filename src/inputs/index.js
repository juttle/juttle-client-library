import React from 'react'
import { render } from 'react-dom'
import { compose, createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import thunk from 'redux-thunk' // allows for async actions

import { updateInputDefs } from './actions';
import InputGroup from './input-group';
import reducers from './reducers';
import OutriggerAPI from '../utils/api';

export default class Input {
    constructor(outriggerUrl, el) {

        this.api = new OutriggerAPI(`http://${outriggerUrl}`);
        this.el = el;

        const store = compose(
            applyMiddleware(thunk)
        )(createStore)(reducers);

        this.store = store;

        render(
            <Provider store={this.store}>
                <InputGroup />
            </Provider>,
            this.el
        );
    }

    render(bundle) {
        return this.api.getInputs(bundle)
        .then(inputs => {
            this.store.dispatch(updateInputDefs(inputs));
        })
    }

    getValues() {
        return this.store.getState().inputs.reduce((result, input) => {
            result[input.id] = input.value;
            return result;
        }, {});
    }
}
