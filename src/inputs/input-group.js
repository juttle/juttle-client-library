import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import InputContainer from './components/input-container';

class InputGroup extends Component {

    render() {
        const { inputs } = this.props;
        if (inputs.size === 0) {
            return false;
        }

        return (
            <div className="juttle-client-library inputs-view">
                {inputs.map((input) => <InputContainer key={input.id} input={input} />)}
            </div>
        );
    }
}

InputGroup.propTypes = {
    inputs: PropTypes.array.isRequired
};

export default connect(
    state => {
        return {
            inputs: state.inputs
        };
    }
)(InputGroup);
