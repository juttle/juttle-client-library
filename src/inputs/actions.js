import JuttleServiceHttp from '../utils/http-api';
import Promise from 'bluebird';
import _ from 'underscore';

export const CLEAR_INPUTS = 'CLEAR_INPUTS';
export const INPUT_DEFS_UPDATE = 'INPUT_DEFS_UPDATE';
export const INPUT_VALUE_UPDATE = 'INPUT_VALUE_UPDATE';

export const UPDATE_BUNDLE = 'UPDATE_BUNDLE';
export const UPDATE_JUTTLE_SERVICE_URL = 'UPDATE_JUTTLE_SERVICE_URL';

export const BEGIN_UPDATE_INPUT_VALUE = 'BEGIN_UPDATE_INPUT_VALUE';
export const END_UPDATE_INPUT_VALUE = 'END_UPDATE_INPUT_VALUE';

export function updateBundle(bundle) {
    return {
        type: UPDATE_BUNDLE,
        payload: bundle
    };
}

export function updateJuttleServiceUrl(url) {
    return {
        type: UPDATE_JUTTLE_SERVICE_URL,
        payload: url
    };
}

export let clearInputs = () => {
    return {
        type: CLEAR_INPUTS
    };
};

export let updateInputDefs = (inputs) => {
    return {
        type: INPUT_DEFS_UPDATE,
        payload: inputs
    };
};

export let beginUpdateInputValue = () => {
    return {
        type: 'BEGIN_UPDATE_INPUT_VALUE'
    };
};

export let endUpdateInputValue = () => {
    return {
        type: 'END_UPDATE_INPUT_VALUE'
    };
};

export function updateInputValue(input_id, value) {
    return (dispatch, getState) => {
        return Promise.try(() => {
            let currentInput = _.findWhere(getState().inputs, { id: input_id });

            if (currentInput.value === value) {
                return;
            }

            dispatch(beginUpdateInputValue());

            let api = new JuttleServiceHttp(getState().juttleServiceUrl);
            return api.getInputs(getState().bundle, Object.assign({}, getValuesFromInputs(getState().inputs), {
                [input_id]: value
            }))
            .then((inputs) => {
                dispatch(updateInputDefs(inputs));
                dispatch(endUpdateInputValue());
            });
        });
    };
}

function getValuesFromInputs(inputs) {
    let inputValues = {};
    inputs.forEach((input) => {
        inputValues[input.id] = input.value;
    });
    return inputValues;
}
