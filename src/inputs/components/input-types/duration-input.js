import React, { Component } from 'react';
import Select from 'react-select';
import moment from 'moment';

const UNITS = [
    'seconds',
    'minutes',
    'hours',
    'days',
    'weeks',
    'months',
    'years'
];

const UNITS_FOR_SELECT = UNITS.map((unit) => {
    return { value: unit, label: unit };
});

// Do a best effort converting a moment.duration
// into a numeric value and unit value.
// Start with the largest unit and down
// until the duration is a multiple of the unit.
export function getBestNumValueAndUnit(duration) {
    let bestUnit = 'minutes';
    if (duration === null) {
        return {
            numValue: null,
            unit: bestUnit
        };
    }

    for (let i = UNITS.length - 1; i >= 0; i--) {
        if (duration.as(UNITS[i]) % 1 === 0) {
            bestUnit = UNITS[i];
            break;
        }
    }

    return {
        numValue : duration.as(bestUnit),
        unit : bestUnit
    };
}

// Returns whether two simple duration objects (containing a numValue and unit)
// are equivalent. For example, { numValue: 1, unit: "days" } is equivalent
// to { numValue: 24, unit: "hours" }.
function areSimpleDurationsEquivalent(value1, value2) {
    return moment.duration(value1.numValue, value1.unit).asSeconds() === moment.duration(value2.numValue, value2.unit).asSeconds();
}

class DurationInput extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: getBestNumValueAndUnit(props.input.value)
        };
    }

    handleUnitChange(value) {
        this.setState({
            value: {
                numValue: this.state.value.numValue,
                unit: value.value
            }
        });

        this.props.inputUpdate(moment.duration(this.state.value.numValue, value.value));
    }

    handleNumValueChange(event) {
        let value = parseInt(event.target.value, 10);

        if (value !== value) {
            return false;
        }

        this.setState({
            value: {
                numValue: value,
                unit: this.state.value.unit
            }
        });

        this.props.inputUpdate(moment.duration(value, this.state.value.unit));
    }

    componentWillReceiveProps({ input }) {
        let newValue = getBestNumValueAndUnit(input.value);

        // If the new value is equal to the old value, keep the old value
        // so we don't unnecessarily change the numeric value and unit for the user.
        if (areSimpleDurationsEquivalent(newValue, this.state.value)) {
            return;
        }

        this.setState({
            value: newValue
        });
    }

    render() {
        let { numValue, unit } = this.state.value;

        return (
            <div className='form-group'>
                <input
                    type={'number'}
                    value={numValue}
                    onChange={this.handleNumValueChange.bind(this)}
                />
                <Select
                    name='form-field-name'
                    value={unit}
                    options={UNITS_FOR_SELECT}
                    clearable={false}
                    onChange={this.handleUnitChange.bind(this)}
                />
            </div>
        );
    }
}

export default DurationInput;
