import fetch from 'isomorphic-fetch';

const API_PREFIX = "/api/v0";

export default class OutriggerHttp {
    constructor(outriggerUrl) {
        if (!outriggerUrl.startsWith('http')) {
            throw new Error('Url scheme must be \'http\' or \'https\'');
        }

        this.outriggerUrl = outriggerUrl;
    }

    getInputs(bundle, inputs) {
        return fetch(`${this.outriggerUrl}${API_PREFIX}/prepare`, {
            method: "post",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                bundle,
                inputs
            })
        })
        .then(res => res.json());
    }

    runJob(bundle, inputs) {
        return fetch(`${this.outriggerUrl}${API_PREFIX}/jobs`, {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                bundle,
                inputs
            })
        })
        .then(res => res.json());
    };

    getJob(jobId) {
        return fetch(`${this.outriggerUrl}${API_PREFIX}/jobs/${jobId}`)
        .then(res => res.json());
    };

    getBundle(path) {
        return fetch(`${this.outriggerUrl}${API_PREFIX}/paths${path}`)
        .then(res => res.json());
    };
}
