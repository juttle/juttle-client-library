import _ from 'underscore';

import ViewRegistry from './view-registry';
import errors from '../utils/errors';

export default (views) => {
    let juttleViews = {};
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
            juttleViews[view.view_id] = new ViewConstructor(
                juttleViewConstructorOptions,
                _.values(juttleViews)
            );
        }
        catch (err) {
            let flattenedError = ViewConstructor.getFlattenedParamValidationErrors(err.info.errors);
            let errorMessages = _.chain(flattenedError)
               .values()
               .pluck(0)
               .pluck('message')
               .value();

            throw new errors.JuttleViewParamsError({
                juttleView: err.info.sinkName,
                errorMessages: errorMessages.join(' '),
                detail: flattenedError
            });
        }
    });

    return juttleViews;
};
