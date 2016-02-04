import React, { Component } from 'react';
import Select from 'react-select';
import _ from 'underscore';
class SelectInput extends Component {
    handleChange(chosenOptions) {
        this.props.inputUpdate(_.pluck(chosenOptions, 'value'));
    }

    render() {
        let { value, options } = this.props.input;

        return (
            <div className="form-group">
                <Select
                    name="form-field-name"
                    value={value}
                    multi={true}
                    options={options.items}
                    clearable={false}
                    onChange={this.handleChange.bind(this)}
                />
            </div>
        );
    }
}

export default SelectInput;
