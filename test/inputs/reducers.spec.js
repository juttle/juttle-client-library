import sinon from 'sinon';
import inputTransformers from '../../src/inputs/input-transformers';
import { expect } from 'chai';

import * as reducers from '../../src/inputs/reducers';

import { INPUT_DEFS_UPDATE } from '../../src/inputs/actions';

describe('reducers', () => {
    describe('input', () => {
        it('inputs are run through transformers', () => {
            let transformInputSpy = sinon.spy(inputTransformers, 'transformInput');

            const inputDefs = [
                {
                    type: 'select',
                    options: {
                        items: [1,2,3]
                    }
                },
                {
                    type: 'select',
                    options: {
                        items: [4,5,6]
                    }
                }
            ];

            reducers.inputs(null, {
                type: INPUT_DEFS_UPDATE,
                payload: inputDefs
            });

            expect(transformInputSpy.calledTwice).to.be.true;
            expect(transformInputSpy.args[0][0]).to.deep.equal(inputDefs[0]);
            expect(transformInputSpy.args[1][0]).to.deep.equal(inputDefs[1]);

            transformInputSpy.reset();
        });
    });
});
