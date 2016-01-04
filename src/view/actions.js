export const JOB_START = 'JOB_START'

export function jobStart(sinks) {
    return {
        type: JOB_START,
        sinks
    };
}
