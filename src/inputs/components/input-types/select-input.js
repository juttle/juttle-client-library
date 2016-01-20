import React, { Component } from 'react';
import Select from 'react-select';
class SelectInput extends Component {
    handleChange(chosenOption) {
        this.props.inputUpdate(chosenOption.value);
    }

    render() {
        let { value, options } = this.props.input;

        return (
            <div className="form-group">
                <Select
                    name="form-field-name"
                    value={value}
                    options={options.items}
                    clearable={false}
                    onChange={this.handleChange.bind(this)}
                />
            </div>
        );
    }
}

export default SelectInput;
