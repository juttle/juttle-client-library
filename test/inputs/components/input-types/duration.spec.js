import { getBestNumValueAndUnit } from '../../../../src/inputs/components/input-types/duration-input';
import moment from 'moment';
import { expect } from 'chai';

describe('duration input', () => {
    describe('getBestNumValueAndUnit', () => {
        it('1 second', () => {
            expect(getBestNumValueAndUnit(moment.duration(1, 'seconds'))).to.deep.equal({ numValue: 1, unit: 'seconds'});
        });

        it('60 seconds', () => {
            expect(getBestNumValueAndUnit(moment.duration(60, 'seconds'))).to.deep.equal({ numValue: 1, unit: 'minutes'});
        });

        it('61 seconds', () => {
            expect(getBestNumValueAndUnit(moment.duration(61, 'seconds'))).to.deep.equal({ numValue: 61, unit: 'seconds'});
        });

        it('60 minutes', () => {
            expect(getBestNumValueAndUnit(moment.duration(60, 'minutes'))).to.deep.equal({ numValue: 1, unit: 'hours'});
        });

        it('61 minutes', () => {
            expect(getBestNumValueAndUnit(moment.duration(61, 'minutes'))).to.deep.equal({ numValue: 61, unit: 'minutes'});
        });

        it('24 hours', () => {
            expect(getBestNumValueAndUnit(moment.duration(24, 'hours'))).to.deep.equal({ numValue: 1, unit: 'days'});
        });

        it('25 hours', () => {
            expect(getBestNumValueAndUnit(moment.duration(25, 'hours'))).to.deep.equal({ numValue: 25, unit: 'hours'});
        });

        it('7 days', () => {
            expect(getBestNumValueAndUnit(moment.duration(7, 'days'))).to.deep.equal({ numValue: 1, unit: 'weeks'});
        });

        it('8 days', () => {
            expect(getBestNumValueAndUnit(moment.duration(8, 'days'))).to.deep.equal({ numValue: 8, unit: 'days'});
        });

        it('1 month', () => {
            expect(getBestNumValueAndUnit(moment.duration(1, 'months'))).to.deep.equal({ numValue: 1, unit: 'months'});
        });

        it('12 months', () => {
            expect(getBestNumValueAndUnit(moment.duration(12, 'months'))).to.deep.equal({ numValue: 1, unit: 'years'});
        });

        it('13 months', () => {
            expect(getBestNumValueAndUnit(moment.duration(13, 'months'))).to.deep.equal({ numValue: 13, unit: 'months'});
        });
    });
});
