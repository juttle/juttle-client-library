import React, { Component } from 'react';

class View extends Component {
    handleViewMsg(msg) {
        switch (msg.type) {

            case 'points':
                this.props.juttleView.consume(msg.points);
                break;
            case 'mark':
                this.props.juttleView.consume_mark(msg.time);
                break;
            case 'tick':
                this.props.juttleView.consume_tick(msg.time);
                break;
            case 'view_end':
                this.props.juttleView.consume_eof();
                break;

        }
    }

    componentWillMount() {
        this.props.jobEvents.on(this.props.view_id, this.handleViewMsg, this);
    }

    componentDidMount() {
        window.addEventListener('resize', this._setChartDimensions);

        setTimeout(() => {
            if (this.props.juttleView.visuals) {
                this.refs.chartParent.appendChild(this.props.juttleView.visuals[0]);
            }
            this._setChartDimensions();
        });
    }

    componentWillUnmount() {
        // remove event listeners
        this.props.jobEvents.off(this.props.view_id, this.handleViewMsg, this);
        window.removeEventListener('resize', this._setChartDimensions);

        // destry chart
        this.props.juttleView.destroy();
    }

    _setChartDimensions = () => {
        this.props.juttleView.setDimensions(null, this.refs.chartParent.offsetWidth, 500);
    };

    render() {
        let style = { width: this.props.width + '%' };

        return (
            <div className="flex-col" style={style} ref="chartParent"></div>
        );
    }
}

export default View;
