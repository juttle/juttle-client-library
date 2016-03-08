import { combineReducers } from 'redux';
import inputTransformers from './input-transformers';

import * as Actions from './actions';

export function inputs(state = [], action) {
    switch (action.type) {
        case Actions.INPUT_DEFS_UPDATE:
            return action.payload.map(inputTransformers.transformInput);
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

function juttleServiceUrl(state = '', action) {
    switch(action.type) {
        case Actions.UPDATE_JUTTLE_SERVICE_URL:
            return action.payload;
    }

    return state;
}

function updatingValueState(state = 'COMPLETED', action) {
    switch(action.type) {
        case Actions.BEGIN_UPDATE_INPUT_VALUE:
            return 'PENDING';
        case Actions.END_UPDATE_INPUT_VALUE:
            return 'COMPLETED';
    }

    return state;
}

export default combineReducers({
    inputs,
    bundle,
    updatingValueState,
    juttleServiceUrl
});
