import DateInput from '../../../../src/inputs/components/input-types/date-input';
import React from 'react';
import ReactDOM from 'react-dom';
import { expect } from 'chai';

describe('date input', () => {
    it('renders in utc', () => {
        let input = {
            value: new Date('2012-01-02T00:00:00.000Z')
        };

        let container = document.createElement('div');

        ReactDOM.render(<DateInput input={input} />, container);

        expect(container.querySelector('input').value).to.equal('2012-01-02');
    });
});
