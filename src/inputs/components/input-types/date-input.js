import React, { Component } from 'react';
import DatePicker from 'react-datepicker';
import moment from 'moment';

class DateInput extends Component {
    handleChange(date) {
        // null values are passed if/when a user is editing
        // the text version of the date and it is invalid.
        // Ignore these.
        if (date !== null) {
            this.props.inputUpdate(date.toDate());
        }
    }

    render() {
        let { value } = this.props.input;

        return (
            <div className='form-group'>
                <DatePicker
                    selected={moment.utc(value)}
                    onChange={this.handleChange.bind(this)} />
            </div>
        );
    }
}

export default DateInput;
