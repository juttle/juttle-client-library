import _ from "underscore";
import React, { Component } from "react";
import ViewRegistry from "./view-registry";

class View extends Component {
    handleViewMsg(msg) {
        switch (msg.type) {

            case "points":
                this.componentChart.consume(msg.points);
                break;
            case "mark":
                this.componentChart.consume_mark(msg.time);
                break;
            case "tick":
                this.componentChart.consume_tick(msg.time);
                break;
            case "sink_end":
                this.componentChart.consume_eof();
                break;

        }
    }

    componentWillMount() {
        var viewConstructorOptions = {
            params: _.omit(this.props.view.options, "_jut_time_bounds"),
            _jut_time_bounds: this.props.view.options._jut_time_bounds,
            type: this.props.view.type,
            juttleEnv: {
                now: new Date()
            }
        };
        let ViewConstructor = ViewRegistry[this.props.view.type];

        if (ViewConstructor) {
            this.componentChart = new ViewConstructor(viewConstructorOptions, this.props.componentCharts);
        }
        else {
            this.componentChart = null;
        }

        if (this.componentChart) {
            this.props.addComponentChart(this.componentChart);
        }

        this.props.jobEvents.on(this.props.view.sink_id, this.handleViewMsg, this);
    }

    componentDidMount() {
        window.addEventListener("resize", this._setChartDimensions.bind(this));

        setTimeout(() => {
            if (this.componentChart.visuals) {
                this.refs.chartParent.appendChild(this.componentChart.visuals[0]);
            }
            this._setChartDimensions();
        });
    }

    componentWillUnmount() {
        // remove event listeners
        this.props.jobEvents.off(this.props.view.sink_id, this.handleViewMsg, this);
        window.removeEventListener("resize", this._setChartDimensions);

        // destry chart
        this.componentChart.destroy();
    }

    _setChartDimensions() {
        this.componentChart.setDimensions(null, this.refs.chartParent.offsetWidth, 500);
    }

    render() {
        let style = { width: this.props.width + "%" };

        return (
            <div className="flex-col" style={style} ref="chartParent"></div>
        );
    }
}

export default View;
