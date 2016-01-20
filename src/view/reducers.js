import { combineReducers } from 'redux';

import { JOB_START, JOB_CREATED } from './actions';

function views(state = {}, action) {
    switch (action.type) {
        // reset views on new job
        case JOB_CREATED:
            return {};

        case JOB_START:
            let views = {};

            // XXX need to change outrigger to return view_id instead of sink_id
            action.views.forEach(view => {
                views[view.sink_id] = view;
            });

            return views;

        default:
            return state;

    }
}

function job_id(state = null, action) {
    switch (action.type) {

        case JOB_CREATED:
            return action.job_id;
        default:
            return state;

    }
}

export default combineReducers({
    views,
    job_id
});
