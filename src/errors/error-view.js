import React from 'react';
import { connect } from 'react-redux';

var ErrorView = ({error}) => (
    <div className="juttle-client-library error-view">
        <div>
            {error.title}
        </div>
        {error.message}
    </div>
);

export default connect(
    state => {
        return {
            error: state.error
        };
    }
)(ErrorView);
