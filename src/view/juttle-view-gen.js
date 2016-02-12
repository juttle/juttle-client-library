import _ from 'underscore';

import ViewRegistry from './view-registry';
import errors from '../utils/errors';

export default (views) => {
    let juttleViews = {};
    let viewErrors = [];
    views.forEach(view => {
        var juttleViewConstructorOptions = {
            params: _.omit(view.options, '_jut_time_bounds'),
            _jut_time_bounds: view.options._jut_time_bounds,
            type: view.type,
            juttleEnv: {
                now: new Date()
            }
        };

        let ViewConstructor = ViewRegistry[view.type];

        if (!ViewConstructor) {
            throw new errors.JuttleViewUnknownError({
                type: view.type
            });
        }

        try {
            juttleViews[view.sink_id] = new ViewConstructor(
                juttleViewConstructorOptions,
                _.values(juttleViews)
            );
        }
        catch (err) {
            viewErrors.push(err.info);
        }
    });

    if (viewErrors.length > 0) {
        throw new errors.JuttleViewParamsError({
            detail: viewErrors,
            viewNames: _.pluck(viewErrors, 'sinkName').join(', ')
        });
    }

    return juttleViews;
};
