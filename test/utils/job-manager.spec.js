import { WebSocket, Server } from 'mock-socket';
import nock from 'nock';
import chai from 'chai';
import sinon from 'sinon'   ;
import sinonChai from 'sinon-chai';
import { JobManager, JobStatus } from '../../src';
import JSDP from 'juttle-jsdp';

let expect = chai.expect;
chai.use(sinonChai);

const API_PREFIX = '/api/v0';

const testJobId = 'job-id';
const testBundle = {
    program: 'emit',
    modules: []
};
const testJobStart = {
    type: 'job_start',
    views: [{
        type: 'logger',
        view_id: 'view0'
    }]
};

function createSocketServer(jobStart, jobId) {
    jobId = jobId || testJobId;
    jobStart = jobStart || testJobStart;

    let mockSocketServer = new Server(`ws://localhost:8080${API_PREFIX}/jobs/${testJobId}`);
    mockSocketServer.on('connection', () => {
        mockSocketServer.send(testJobStart);
    });

    return mockSocketServer;
}

describe('job-socket', function() {

    let _origWebSocket = global.WebSocket;
    let mockSocketServer;
    let jobManager = new JobManager('localhost:8080');

    before(() => {
        global.WebSocket = WebSocket;
    });

    after(() => {
        global.WebSocket = _origWebSocket;
    });

    beforeEach(() => {
        nock(`http://localhost:8080${API_PREFIX}`)
            .post('/jobs', { bundle: testBundle })
            .reply(200, { job_id: testJobId });
    });

    afterEach(() => {
        // for some reason WebSocket needs to be close before Server
        return jobManager.close()
        .then(() => {
            nock.cleanAll();
            mockSocketServer.close();
        });
    });

    describe('admin functionality', () => {
        it('actually closes socket on stop', () => {
            mockSocketServer = createSocketServer();

            return jobManager.start(testBundle)
            .then(() => {
                expect(jobManager.status).to.equal(JobStatus.RUNNING);
                return jobManager.close();
            })
            .then(() => {
                expect(jobManager.status).to.equal(JobStatus.STOPPED);
            });
        });

        it('sends back pong on ping', (done) => {
            mockSocketServer = createSocketServer();

            jobManager.start(testBundle)
            .then(() => {
                mockSocketServer.on('message', (event) => {
                    expect(JSON.parse(event)).to.deep.equal({
                        type: 'pong'
                    });
                    done();
                });

                mockSocketServer.send({ type: 'ping' });
            });
        });

        it('closes socket on job_end event', () => {
            mockSocketServer = createSocketServer();

            return jobManager.start(testBundle)
            .then(() => {
                expect(jobManager.status).to.equal(JobStatus.RUNNING);

                let statusStub = sinon.stub();
                let closeStub = sinon.stub();
                jobManager.once('job-status', statusStub);
                jobManager.once('close', closeStub);

                mockSocketServer.send({
                    'type': 'job_end'
                });

                expect(statusStub).to.have.been.calledWith(JobStatus.STOPPED);
                expect(closeStub).to.have.been.called;
                expect(jobManager._socket.readyState).to.equal(WebSocket.CLOSED);
            });
        });
    });

    describe('status-change events', () => {
        // disable until thoov/mock-socket#74 is resolved
        it.skip('receive proper job-status events on job closed from server', () => {
            mockSocketServer = createSocketServer();

            let cb = sinon.spy();
            jobManager.on('job-status', cb);

            return jobManager.start(testBundle)
            .then(() => {
                // send a bogus messages
                mockSocketServer.send(JSDP.serialize({
                    time: new Date(2000),
                    type: 'mark',
                    view: 'view0'
                }));

                return new Promise(resolve => {
                    jobManager.on('close', resolve);
                    mockSocketServer.close();
                });
            })
            .then(() => {
                expect(cb).to.have.callCount(3);
                expect(cb.args).to.deep.equal([
                    [JobStatus.STARTING],
                    [JobStatus.RUNNING],
                    [JobStatus.STOPPED]
                ]);
            });
        });

        it('receive proper job-status events on job terminated from client', () => {
            mockSocketServer = createSocketServer();

            let cb = sinon.spy();
            jobManager.on('job-status', cb);

            return jobManager.start(testBundle)
            .then(() => {
                // send a bogus messages
                mockSocketServer.send(JSDP.serialize({
                    time: new Date(2000),
                    type: 'mark',
                    view: 'view0'
                }));

                return jobManager.close();
            })
            .then(() => {
                expect(cb.args).to.deep.equal([
                    [JobStatus.STARTING],
                    [JobStatus.RUNNING],
                    [JobStatus.STOPPED]
                ]);
                expect(cb).to.have.callCount(3);
            });
        });
    });

    describe('converts time strings to dates', () => {
        it('time field', (done) => {
            let sampleDate = new Date(2000);

            mockSocketServer = createSocketServer();

            jobManager.start(testBundle)
            .then((views) => {
                jobManager.once('message', (payload) => {
                    expect(payload.time).to.be.a('date');
                    expect(payload.time.getTime()).to.equal(sampleDate.getTime());
                    done();
                });

                mockSocketServer.send(JSDP.serialize({
                    time: sampleDate,
                    type: 'mark',
                    view: 'view0'
                }));
            });
        });

        it('time field in points', (done) => {
            let time1 = new Date(1000);
            let time2 = new Date(2000);

            const points = [
                {
                    time: time1,
                    value: 1
                },
                {
                    time: time2,
                    value: 2
                }
            ];

            mockSocketServer = createSocketServer();

            jobManager.start(testBundle)
            .then((views) => {
                jobManager.once('message', (payload) => {
                    expect(payload.points).to.deep.equal(points);
                    done();
                });

                mockSocketServer.send(JSDP.serialize({
                    view_id: 'view0',
                    points: points
                }));
            });
        });

        it('from and to in _jut_time_bounds in views', (done) => {
            let time1 = new Date(1000);
            let time2 = new Date(2000);

            const views = [
                {
                    type: 'logger',
                    view_id: 'view0',
                    options: {
                        _jut_time_bounds: [
                            {
                                from: time1,
                                to: time2
                            },
                            {
                                from: time1
                            },
                            {
                                to: time2
                            }
                        ]
                    }
                },
                {
                    type: 'table',
                    view_id: 'view1',
                    options: {
                        _jut_time_bounds: [
                            {
                                from: time1
                            }
                        ]
                    }
                }
            ];

            mockSocketServer = createSocketServer(JSDP.serialize({
                type: 'job_start',
                views: views
            }));

            jobManager.start(testBundle)
            .then((views) => {
                expect(views).to.deep.equal(views);
                done();
            });

        });
    });


});
