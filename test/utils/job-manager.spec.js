import { WebSocket, Server } from 'mock-socket';
import nock from 'nock';
import { expect } from 'chai';
import JobManager, { JobStatus } from '../../src/utils/job-manager';
import JSDP from 'juttle-jsdp';


const API_PREFIX = '/api/v0';

const bogusJobId = 'job-id';
const bogusBundle = {
    program: 'emit',
    modules: []
};
const bogusJobStart = {
    type: 'job_start',
    views: [{
        type: 'logger',
        view_id: 'view0'
    }]
};

function createSocketServer(jobStart, jobId) {
    jobId = jobId || bogusJobId;
    jobStart = jobStart || bogusJobStart;

    let mockSocketServer = new Server(`ws://localhost:8080${API_PREFIX}/jobs/${bogusJobId}`);
    mockSocketServer.on('connection', () => {
        mockSocketServer.send(bogusJobStart);
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
            .post('/jobs', { bundle: bogusBundle })
            .reply(200, { job_id: bogusJobId });
    });

    afterEach(() => {
        // for some reason WebSocket needs to be close before Server
        return jobManager.close()
        .then(() => {
            nock.cleanAll();
            mockSocketServer.close();
        });
    });

    describe('admin functionality', (done) => {
        it('actually closes socket on stop', (done) => {
            mockSocketServer = createSocketServer();

            jobManager.start(bogusBundle)
            .then(() => {
                expect(jobManager.getStatus()).to.equal(JobStatus.OPEN);
                return jobManager.close();
            })
            .then(() => {
                expect(jobManager.getStatus()).to.equal(JobStatus.CLOSED);
                done();
            });
        });

        it('sends back pong on ping', (done) => {
            mockSocketServer = createSocketServer();

            jobManager.start(bogusBundle)
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
    });

    describe('converts time strings to dates', () => {
        it('time field', (done) => {
            let sampleDate = new Date(2000);

            mockSocketServer = createSocketServer();

            jobManager.start(bogusBundle)
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

            jobManager.start(bogusBundle)
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

            jobManager.start(bogusBundle)
            .then((views) => {
                expect(views).to.deep.equal(views);
                done();
            });

        });
    });


});
