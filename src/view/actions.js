export const JOB_START = "JOB_START";
export const JOB_CREATED = "JOB_CREATED";

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
