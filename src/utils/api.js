import fetch from 'isomorphic-fetch';
import JSDP from 'juttle-jsdp';

const API_PREFIX = '/api/v0';

export default class OutriggerHttp {
    constructor(outriggerUrl) {
        if (!outriggerUrl.startsWith('http')) {
            throw new Error('Url scheme must be \'http\' or \'https\'');
        }

        this.url = `${outriggerUrl}${API_PREFIX}/`;
    }

    getInputs(bundle, inputs = {}) {
        return fetch(`${this.url}prepare`, {
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                bundle,
                inputs: JSDP.serialize(inputs, { toObject: true })
            })
        })
        .then(res => res.json())
        .then(parsedBody => JSDP.deserialize(parsedBody));
    }

    runJob(bundle, inputs = {}) {
        return fetch(`${this.url}jobs`, {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                bundle,
                inputs: JSDP.serialize(inputs, { toObject: true })
            })
        })
        .then(res => res.json());
    }

    getJob(jobId) {
        return fetch(`${this.url}jobs/${jobId}`)
        .then(res => res.json());
    }

    getBundle(path) {
        return fetch(`${this.url}paths${path}`)
        .then(res => res.json());
    }
}
