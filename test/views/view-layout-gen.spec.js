import { expect } from 'chai';

import viewLayoutGen from '../../src/view/view-layout-gen';

describe('test view-layout generator', () => {
    it('place views in same row', () => {
        let layout = viewLayoutGen([
            {
                options: { row: 1 },
                sink_id: 'view_1'
            },
            {
                options: { row: 1 },
                sink_id: 'view_2'
            }
        ]);

        expect(layout).to.deep.equal([
            ['view_1', 'view_2']
        ]);
    });

    it('properly orders columns for views in the same row', () => {
        let layout = viewLayoutGen([
            {
                options: { row: 1 },
                sink_id: 'view_3'
            },
            {
                options: { row: 1, col: 2 },
                sink_id: 'view_2'
            },
            {
                options: { row: 1, col: 1},
                sink_id: 'view_1'
            }
        ]);

        expect(layout).to.deep.equal([
            ['view_1', 'view_2', 'view_3']
        ]);
    });

    it('unspecified views should render in default order', () => {
        let layout = viewLayoutGen([
            { sink_id: 'view_1' },
            { sink_id: 'view_2' },
            { sink_id: 'view_3' }
        ]);

        expect(layout).to.deep.equal([
            ['view_1'],
            ['view_2'],
            ['view_3']
        ]);
    });

    it('undefined views should return empty array', () => {
        expect(viewLayoutGen()).to.deep.equal([]);
    });
});
