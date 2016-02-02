export const ERROR = 'ERROR';
export const CLEAR_ERROR = 'CLEAR_ERROR';

export function errorInfo(err) {
    function get_nested_error(err) {
        let error = err.info && err.info.err;
        return error || err;
    }

    function location_str(location) {
        let start = location.start;
        return 'At line ' + start.line + ', column ' + start.column;
    }

    let error = get_nested_error(err);
    let location = error.info && error.info.location;
    let message = location ? location_str(location) + ': ' + error.message : error.message;
    let title = error.code || 'unexpected error';

    return {
        type: ERROR,
        error: {
            title,
            message
        }
    };
}

export function clearError() {
    return {
        type: CLEAR_ERROR
    };
}
