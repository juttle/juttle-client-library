import _ from 'underscore';
import messages from './error-messages';


class BaseError extends Error {
    constructor(info, code) {
        super();

        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, this.constructor);
        }

        // this.code = this.code;
        this.info = info;
        this.code = code;

        let template = _.template(messages[this.code], {
            interpolate: /\{\{([^}]*)\}\}/g,
            variable: 'info'
        });

        this.message = template(info);
    }
}

class JobStartError extends BaseError {
    constructor(info) {
        super(info, 'JOB-START-ERROR');
    }
}

class JuttleViewParamsError extends BaseError {
    constructor(info) {
        super(info, 'JUTTLE-VIEW-PARAMS-INVALID');
    }
}

class JuttleViewUnknownError extends BaseError {
    constructor(info) {
        super(info, 'JUTTLE-VIEW-UNKNOWN-ERROR');
    }
}

export default {
    JobStartError,
    JuttleViewParamsError,
    JuttleViewUnknownError
};
