import React from "react";
import { render } from "react-dom";
import { Provider } from "react-redux";
import { compose, createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";

import reducers from "./reducers";
import { errorInfo } from "./actions";
import ErrorView from "./error-view";

export default class Errors {
    constructor(el) {
        this.el = el;

        const store = compose(
            applyMiddleware(thunk)
        )(createStore)(reducers);

        this.store = store;

        render(
            <Provider store={this.store}>
                <ErrorView />
            </Provider>,
            this.el
        );
    }

    render(err) {
        let { dispatch } = this.store;
        dispatch(errorInfo(err));
    }
}
