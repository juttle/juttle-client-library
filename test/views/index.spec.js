import Promise from 'bluebird';
import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import EventEmitter from 'eventemitter3';

import JobManager, { JobStatus } from '../../src/utils/job-manager';
import Views, { ViewStatus } from '../../src/views';

chai.use(sinonChai);
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

        it.only('view-status event', () => {
            let jobEvent = new EventEmitter();

            // override JobManager start
            sinon.stub(JobManager.prototype, 'on', function(event, fn) {
                jobEvent.on(event, fn);
            });


            let view = new Views('localhost:8080', document.getElementById('app'));

            let viewStatusCb = sinon.stub();
            view.on('view-status', viewStatusCb);

            jobEvent.emit('job-status', JobStatus.STARTING);
            jobEvent.emit('job-status', JobStatus.RUNNING);

            expect(viewStatusCb).to.have.been.calledTwice;
            expect(viewStatusCb.args).to.deep.equal([
                [ViewStatus.STARTING], [ViewStatus.RUNNING]
            ]);
        });
    });

});
