import { combineReducers } from 'redux';
import { ERROR, CLEAR_ERROR } from './actions';

function error(state = {}, action) {
    switch (action.type) {
        case ERROR:
            return action.error;
        case CLEAR_ERROR:
            return {};
        default:
            return state;
    }
}

export default combineReducers({
    error
});
