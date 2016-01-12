import TextInput from "./text-input";

class NumberInput extends TextInput {
    getType() { return "number"; }

    handleChange(event) {
        let value = parseInt(event.target.value, 10);
        if (value !== value) {
            return false;
        }
        this.props.inputUpdate(value);
    }
}

export default NumberInput;
