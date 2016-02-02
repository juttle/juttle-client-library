import { combineReducers } from 'redux';

import * as Actions from './actions';

function inputs(state = [], action) {
    switch (action.type) {
        case Actions.INPUT_DEFS_UPDATE:
            return action.payload;
        case Actions.CLEAR_INPUTS:
            return [];
        default:
            return state;
    }
}

function bundle(state = {}, action) {
    switch(action.type) {
        case Actions.UPDATE_BUNDLE:
            return action.payload;
        case Actions.CLEAR_INPUTS:
            return {};
    }

    return state;
}

function outriggerUrl(state = '', action) {
    switch(action.type) {
        case Actions.UPDATE_OUTRIGGER_URL:
            return action.payload;
    }

    return state;
}

export default combineReducers({
    inputs,
    bundle,
    outriggerUrl
});
