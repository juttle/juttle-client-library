import { combineReducers } from "redux";

import { JOB_START, JOB_CREATED } from "./actions";

function sinks(state = new Map(), action) {
    switch (action.type) {

        case JOB_START:
            let sinks = new Map();
    
            action.sinks.forEach(sink => {
                sinks.set(sink.sink_id, sink);
            });
    
            return sinks;
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
    sinks,
    job_id
});
