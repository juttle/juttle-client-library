import { combineReducers } from 'redux';

import { JOB_START } from './actions';

function sinks(state = new Map(), action) {
    switch (action.type)    {
        case JOB_START:
            let sinks = new Map()

            action.sinks.forEach(sink => {
                sinks.set(sink.sink_id, sink)
            })

            return sinks
    }

    return state
}

export default combineReducers({
    sinks
});
