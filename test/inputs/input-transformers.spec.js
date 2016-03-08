import inputTransformers from '../../src/inputs/input-transformers';
import { expect } from 'chai';
import sinon from 'sinon';

describe('input transformers', () => {
    describe('normalizeItemsOption', () => {
        it('converts string items to value, label', () => {
            const inputDef = {
                options: {
                    items: [ 'value1', 'value2' ]
                }
            };

            expect(inputTransformers.transformers.normalizeItemsOption(inputDef).options.items).to.deep.equal([
                {
                    value: 'value1',
                    label: 'value1'
                },
                {
                    value: 'value2',
                    label: 'value2'
                }
            ]);
        });

        it('doesn not fail when no items present', () => {
            const inputDef = {
                options: {
                }
            };

            expect(inputTransformers.transformers.normalizeItemsOption(inputDef).options.items).to.be.undefined;
        });
    });

    describe('transformInput', () => {
        it('uses the normalizeItemsOption transformer', () => {
            const inputDef = {
                options: {
                    items: [ 'value1', 'value2' ]
                }
            };

            let normalizeItemsOptionSpy = sinon.spy(inputTransformers.transformers, 'normalizeItemsOption');

            inputTransformers.transformInput(inputDef);

            expect(normalizeItemsOptionSpy.calledOnce).to.be.true;
            expect(normalizeItemsOptionSpy.args[0]).to.deep.equal([inputDef]);

            normalizeItemsOptionSpy.reset();
        });
    });
});
