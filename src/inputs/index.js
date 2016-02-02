import React from 'react';
import { render } from 'react-dom';
import { compose, createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk'; // allows for async actions

import * as ActionCreators from './actions';
import InputGroup from './input-group';
import reducers from './reducers';
import OutriggerAPI from '../utils/api';

export default class Input {
    constructor(outriggerUrl, el) {

        this.el = el;

        const store = compose(
            applyMiddleware(thunk)
        )(createStore)(reducers);

        this.store = store;

        store.dispatch(ActionCreators.updateOutriggerUrl(`http://${outriggerUrl}`));

        this.api = new OutriggerAPI(store.getState().outriggerUrl);

        render(
            <Provider store={this.store}>
                <InputGroup />
            </Provider>,
            this.el
        );
    }

    render(bundle) {
        this.store.dispatch(ActionCreators.updateBundle(bundle));
        return this.api.getInputs(bundle)
        .then(inputs => {
            if (!Array.isArray(inputs)) {
                let default_message = 'non-array reply from getInputs: ' + JSON.stringify(inputs);
                let e = new Error(inputs.code || inputs.message || default_message);
                e.info = inputs.info;
                throw e;
            }
            this.store.dispatch(ActionCreators.updateInputDefs(inputs));
        });
    }

    clear() {
        this.store.dispatch(ActionCreators.clearInputs());
    }

    getValues() {
        return this.store.getState().inputs.reduce((result, input) => {
            result[input.id] = input.value;
            return result;
        }, {});
    }
}
