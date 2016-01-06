import React, { Component } from "react";
import { connect } from "react-redux";

import Sink from "./sink";
import sinkLayoutGen from "./sink-layout-gen";

class View extends Component {
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

    generateViewColumns(sinkCols) {
        let self = this;
        let { jobEvents, sinks } = this.props;

        return sinkCols.map(sinkCol => {
            let sink = sinks.get(sinkCol);
            return (
                <Sink
                    sink={sink}
                    sinks={sinks}
                    width={100 / sinkCols.length}
                    jobEvents={jobEvents}
                    addComponentChart={self.addComponentChart.bind(self)}
                    componentCharts={self.componentCharts}
                    key={sink.sink_id}/>
            );
        });
    }

    render() {
        let { sinkLayout } = this.props;
        let rows = sinkLayout.map((sinkRow, index) => {
            return (
                <div className="flex-row" key={index}>
                    {this.generateViewColumns(sinkRow)}
                </div>
            );
        });

        return (
            <div className="juttle-view sink-views">
                {rows}
            </div>
        );

    }
}

export default connect(
    state => {
        return {
            sinks: state.sinks,
            sinkLayout: sinkLayoutGen(state.sinks),
            job_id: state.job_id
        };
    }
)(View);
