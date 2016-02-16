import React from 'react';
import { render } from 'react-dom';
import { compose, createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk'; // allows for async actions

import * as ActionCreators from './actions';
import InputGroup from './input-group';
import reducers from './reducers';
import JuttleServiceHttp from '../utils/http-api';

export default class Input {
    constructor(outriggerUrl, el) {

        this.el = el;

        const store = compose(
            applyMiddleware(thunk)
        )(createStore)(reducers);

        this.store = store;

        store.dispatch(ActionCreators.updateOutriggerUrl(`http://${outriggerUrl}`));

        this.api = new JuttleServiceHttp(store.getState().outriggerUrl);

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

    _getValuesFromStore() {
        return this.store.getState().inputs.reduce((result, input) => {
            result[input.id] = input.value;
            return result;
        }, {});
    }

    getValues() {
        return new Promise((resolve, reject) => {
            if (this.store.getState().updatingValueState === 'COMPLETED') {
                resolve(this._getValuesFromStore());
            }
            else {
                let unsubscribe = this.store.subscribe(() => {
                    if (this.store.getState().updatingValueState === 'COMPLETED') {
                        unsubscribe();
                        resolve(this._getValuesFromStore());
                    }
                });
            }

        });
    }
}
