import { combineReducers } from 'redux';
import { ERROR } from './actions';

function error(state = {}, action) {
    switch (action.type) {
        case ERROR:
            return action.error;
        default:
            return state;
    }
}

export default combineReducers({
    error
});
