export const JOB_START = 'JOB_START';
export const JOB_CREATED = 'JOB_CREATED';
export const CLEAR_JOB = 'CLEAR_JOB';

export function jobCreated(job_id) {
    return {
        type: JOB_CREATED,
        job_id
    };
}

export function jobStart(views) {
    return {
        type: JOB_START,
        views
    };
}

export function clearJob() {
    return {
        type: CLEAR_JOB
    };
}
