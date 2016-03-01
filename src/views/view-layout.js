import React, { Component } from 'react';

import View from './view';

class ViewLayout extends Component {
    componentWillMount() {
        this.componentCharts = [];
    }

    addComponentChart(componentChart) {
        this.componentCharts.push(componentChart);
    }

    generateViewColumns(viewCols) {
        let { jobEvents, juttleViews } = this.props;

        return viewCols.map(view_id => {
            return (
                <View
                    key={view_id}
                    view_id={view_id}
                    juttleView={juttleViews[view_id]}
                    width={100 / viewCols.length}
                    jobEvents={jobEvents} />
            );
        });
    }

    render() {
        let { viewLayout } = this.props;
        if (!viewLayout) {
            return false;
        }

        let rows = viewLayout.map((viewRow, index) => {
            return (
                <div className="flex-row" key={index}>
                    {this.generateViewColumns(viewRow)}
                </div>
            );
        });

        return (
            <div className="juttle-client-library views-layout">
                {rows}
            </div>
        );

    }
}

export default ViewLayout;
