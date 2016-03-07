import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import DatePicker from 'react-datepicker';
import moment from 'moment';

class DateInput extends Component {
    constructor(props) {
        super(props);

        this.state = {
            componentRootDOMNode: null
        };
    }

    handleChange(date) {
        // null values are passed if/when a user is editing
        // the text version of the date and it is invalid.
        // Ignore these.
        if (date !== null) {
            this.props.inputUpdate(date.toDate());
        }
    }

    componentDidMount() {
        this.setState({
            componentRootDOMNode: ReactDOM.findDOMNode(this)
        });
    }

    render() {
        let { value } = this.props.input;

        return (
            <div className='form-group'>
                <DatePicker
                    dateFormat='YYYY-MM-DD'
                    selected={moment.utc(value)}
                    renderCalendarTo={this.state.componentRootDOMNode}
                    onChange={this.handleChange.bind(this)} />
            </div>
        );
    }
}

export default DateInput;
