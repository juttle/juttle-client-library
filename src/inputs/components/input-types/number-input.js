import TextInput from './text-input';

class NumberInput extends TextInput {
    getType() { return 'number'; }

    _submitValueFromInputEl(value) {
        value = parseInt(value, 10);
        if (value !== value) {
            return false;
        }
        this.props.inputUpdate(value);
    }
}

export default NumberInput;
