import { combineReducers } from 'redux';

import { INPUT_DEFS_UPDATE, INPUT_VALUE_UPDATE } from './actions';

function inputs(state = [], action) {
    switch (action.type) {
        case INPUT_DEFS_UPDATE:
            return action.inputs;

        case INPUT_VALUE_UPDATE:
            return state.map((input) => {
                if (input.id === action.input_id) {
                    return Object.assign({}, input, {
                        value: action.value
                    });
                }
                else {
                    return input;
                }
            });
        default:
            return state;
    }
}

export default combineReducers({
    inputs    
});
