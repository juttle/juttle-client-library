import React, { Component } from "react";

class TextInput extends Component {
    getType() { return "text"; }

    handleChange(event) {
        this.props.inputUpdate(event.target.value);
    }

    render() {
        let { value } = this.props.input;
        let currentValue = value ? value : "";

        return (
            <div className="form-group">
                <input
                    type={this.getType()}
                    className="form-control"
                    onChange={this.handleChange.bind(this)}
                    value={currentValue} />
            </div>
        );
    }
}

export default TextInput;
