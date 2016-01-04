import _ from 'underscore';
import React, { Component } from 'react';
import { connect } from 'react-redux';

import Sink from './sink';
import sinkLayoutGen from './sink-layout-gen';

class ViewLayout extends Component {
    generateViewColumns(sinkCols) {
        let { jobEvents, sinks } = this.props;

        return sinkCols.map(sinkCol => {
            let sink = sinks.get(sinkCol);
            return (
                <Sink
                    sink={sink}
                    sinks={sinks}
                    width={100 / sinkCols.length}
                    jobEvents={jobEvents}
                    key={sink.sink_id}/>
            )
        });
    }

    render() {
        let { sinks, sinkLayout, job_id } = this.props;
        let rows = sinkLayout.map((sinkRow, index) => {
            return (
                <div className="flex-row" key={index}>
                    {this.generateViewColumns(sinkRow)}
                </div>
            )
        })

        if (!job_id) {
            return (
                <div className="juttle-view sink-views">
                    <p>Nothing to see here</p>
                </div>
            );
        }

        return (
            <div className="juttle-view sink-views" key={job_id}>
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
            job: state.job
        };
    }
)(ViewLayout)
