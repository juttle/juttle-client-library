import React, { Component } from 'react';

class TextInput extends Component {
    constructor(props) {
        super(props);

        this.state = {
            value: props.input.value
        };
    }

    getType() { return 'text'; }

    _onChange(event) {
        this.setState({ value: event.target.value});
    }

    _onBlur(event) {
        this.props.inputUpdate(event.target.value);
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            value: nextProps.input.value
        });
    }

    render() {
        let { value } = this.state;
        let currentValue = value ? value : '';

        return (
            <div className="form-group">
                <input
                    type={this.getType()}
                    className="form-control"
                    onBlur={this._onBlur.bind(this)}
                    onChange={this._onChange.bind(this)}
                    value={currentValue} />
            </div>
        );
    }
}

export default TextInput;
