import Promise from 'bluebird';
import fetch from 'isomorphic-fetch';
import JSDP from 'juttle-jsdp';

const API_PREFIX = '/api/v0';

function makeRequest(uri, options) {
    // override fetch's use of es6 promises with Bluebird
    return new Promise((resolve, reject) => {
        fetch(uri, options)
        .then(res => {
            return res.json()
            .then(body => {
                resolve([res, body]);
            });
        });
    })
    .spread((res, body) => {
        if (res.status >= 200 && res.status < 300) {
            return body;
        } else {
            let error = new Error(body.message);
            error.code = body.code;
            error.info = body.info;
            throw error;
        }
    });
}

export function getInputs (url, bundle, inputs = {}) {
    return makeRequest(`${url}${API_PREFIX}/prepare`, {
        method: 'post',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            bundle,
            inputs: JSDP.serialize(inputs, { toObject: true })
        })
    })
    .then(parsedBody => JSDP.deserialize(parsedBody));
}

export function runJob(url, bundle, inputs = {}) {
    return makeRequest(`${url}${API_PREFIX}/jobs`, {
        method: 'post',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            bundle,
            inputs: JSDP.serialize(inputs, { toObject: true })
        })
    });
}

export function getJob(url, jobId) {
    return makeRequest(`${url}${API_PREFIX}/jobs/${jobId}`);
}

export function getBundle(url, path) {
    if (path[0] !== '/') {
        path = '/' + path;
    }

    return makeRequest(`${url}${API_PREFIX}/paths${path}`);
}

export default class JuttleServiceHttp {
    constructor(serviceUrl) {
        if (!serviceUrl.startsWith('http')) {
            throw new Error('Url scheme must be \'http\' or \'https\'');
        }
        this.url = serviceUrl;
    }

    getInputs(bundle, inputs = {}) {
        return getInputs(this.url, bundle, inputs);
    }

    runJob(bundle, inputs = {}) {
        return runJob(this.url, bundle, inputs);
    }

    getJob(jobId) {
        return getJob(this.url, jobId);
    }

    getBundle(path) {
        return getBundle(this.url, path);
    }
}
