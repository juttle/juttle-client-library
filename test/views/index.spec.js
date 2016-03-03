import Promise from 'bluebird';
import chai from 'chai';
import sinon from 'sinon';

import JobManager, { JobStatus } from '../../src/utils/job-manager';
import Views, { ViewStatus } from '../../src/views';

const { expect } = chai;

describe('view object', () => {
    describe('status property', () => {
        it('status is stopped on init', () => {
            let view = new Views('localhost:8080', document.getElementById('app'));

            expect(view.getStatus()).to.equal(ViewStatus.STOPPED);
        });

        it('status is running while jobManager status is running', () => {
            // override JobManager start
            sinon.stub(JobManager.prototype, 'start', function() {
                this.status = JobStatus.RUNNING;
                return Promise.resolve({ views: [] });
            });

            let view = new Views('localhost:8080', document.getElementById('app'));

            return view.run({ bundle: 'emit', modules: {} }, [])
            .then(() => {
                expect(view.getStatus()).to.equal(ViewStatus.RUNNING);
            });
        });
    });
});
