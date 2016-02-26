import _ from 'underscore';
import { expect } from 'chai';

import juttleViewGen from '../../src/view/juttle-view-gen';

window.Event = undefined;

describe('test view component generator', () => {


    it('instantiate two components with valid params', () => {
        let components = juttleViewGen([
            {
                type: 'timechart',
                view_id: 'view0',
                options: {
                    'row': 0,
                    '_jut_time_bounds': []
                }
            },
            {
                type: 'table',
                view_id: 'view1',
                options: {
                    'row': 0,
                    '_jut_time_bounds': []
                }
            }
        ]);

        expect(_.values(components).length).to.equal(2);
    });

    it('one invalid component throws error', () => {
        try {
            juttleViewGen([{
                type: 'timechart',
                view_id: 'view0',
                options: {
                    'unknown_option': true
                }
            }]);
        } catch (err) {
            expect(err.code).to.equal('JUTTLE-VIEW-PARAMS-INVALID');
            expect(err.message).to.have.string('"timechart" has invalid parameters:');
            expect(err.message).to.have.string('unknown_option');
            return;
        }

        throw new Error('Expected error here');
    });

    it('two invalid views throw error on first juttleView', () => {
        try {
            juttleViewGen([
                {
                    type: 'barchart',
                    view_id: 'view0',
                    options: {
                        'unknown_option': true
                    }
                },
                {
                    type: 'timechart',
                    view_id: 'view1',
                    options: {
                        'unknown_option': true
                    }
                }
            ]);
        } catch (err) {
            expect(err.code).to.equal('JUTTLE-VIEW-PARAMS-INVALID');
            expect(err.message).to.have.string('"barchart" has invalid parameters:');
            expect(err.message).to.have.string('unknown_option');
            return;
        }

        throw new Error('Expected error here');
    });

    it('unknown view throws error', () => {
        try {
            juttleViewGen([{
                type: 'does_not_exist',
                view_id: 'view0',
                options: {}
            }]);
        } catch (err) {
            expect(err.code).to.equal('JUTTLE-VIEW-UNKNOWN-ERROR');
            expect(err.message).to.equal('Unknown/Unsupported view type: does_not_exist');
            return;
        }

        throw new Error('Expected error here');
    });
});
