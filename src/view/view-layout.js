import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'underscore';

import View from './view';
import viewLayoutGen from './view-layout-gen';

class ViewLayoutWrapper extends Component {
    render() {
        if (this.props.job_id) {
            return (
                <ViewLayout {...this.props} key={this.props.job_id} />
            );
        }

        return false;
    }
}

class ViewLayout extends Component {
    componentWillMount() {
        this.componentCharts = [];
    }

    addComponentChart(componentChart) {
        this.componentCharts.push(componentChart);
    }

    generateViewColumns(viewCols) {
        let self = this;
        let { jobEvents, views } = this.props;

        return viewCols.map(view_id => {
            let view = views[view_id];
            return (
                <View
                    view={view}
                    views={views}
                    width={100 / viewCols.length}
                    jobEvents={jobEvents}
                    addComponentChart={self.addComponentChart.bind(self)}
                    componentCharts={self.componentCharts}
                    key={view.sink_id}/>
            );
        });
    }

    render() {
        let { viewLayout } = this.props;
        let rows = viewLayout.map((viewRow, index) => {
            return (
                <div className="flex-row" key={index}>
                    {this.generateViewColumns(viewRow)}
                </div>
            );
        });

        return (
            <div className="juttle-client-library sink-views">
                {rows}
            </div>
        );

    }
}

export default connect(
    state => {
        return {
            views: state.views,
            viewLayout: viewLayoutGen(_.values(state.views)),
            job_id: state.job_id
        };
    }
)(ViewLayoutWrapper);
