import nock from 'nock';
import { expect } from 'chai';

import JuttleServiceHttp, * as http from '../../src/utils/http-api';

const API_PREFIX = '/api/v0';
const juttleServiceUrl = 'http://localhost:3000';

describe('http-api', () => {
    afterEach(() => {
        nock.cleanAll();
    });

    describe('instantiating class', () => {
        it('without http:// https:// throws error', () => {
            let errorMsg = 'Url scheme must be \'http\' or \'https\'';
            
            expect(() => {
                new JuttleServiceHttp('localhost:8080');
            }).to.throw(errorMsg);
        });

        it('instantiate class with https:// http:// throws no error', () => {
            new JuttleServiceHttp('http://localhost:8080');
            new JuttleServiceHttp('https://localhost:8080');
        });
    });

    it('successfully call getBundle endpoint with no slash', () => {
        let bundle = {
            program: 'emit',
            modules: []
        };

        nock(`${juttleServiceUrl}${API_PREFIX}`)
            .get('/paths/example.juttle')
            .reply(200, bundle);

        return http.getBundle(juttleServiceUrl, 'example.juttle')
        .then(res => {
            expect(res).to.deep.equal(bundle);
        });
    });

    it('successfully getBundle endpoint with slash from class', () => {
        let bundle = {
            program: 'emit',
            modules: []
        };

        nock(`${juttleServiceUrl}${API_PREFIX}`)
            .get('/paths/example.juttle')
            .reply(200, bundle);

        let service = new JuttleServiceHttp(juttleServiceUrl);

        return service.getBundle('/example.juttle')
        .then(res => {
            expect(res).to.deep.equal(bundle);
        });
    });

    it('non 200 responses throw errors', (done) => {
        nock(`${juttleServiceUrl}${API_PREFIX}`)
            .post('/jobs', {})
            .reply(400, {
                code: 'JS-BUNDLE-ERR',
                message: 'Malformed bundle',
                info: { 'info': 'info' }
            });

        http.runJob(juttleServiceUrl, {})
        .then(() => {
            done(new Error('error expected'));
        })
        .catch((err) => {
            expect(err.message).to.equal('Malformed bundle');
            expect(err.code).to.equal('JS-BUNDLE-ERR');
            expect(err.info).to.deep.equal({ info: 'info' });
            done();
        });
    });
});
