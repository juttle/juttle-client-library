export const INPUT_DEFS_UPDATE = 'INPUT_DEFS_UPDATE'
export const INPUT_VALUE_UPDATE = 'INPUT_VALUE_UPDATE'

export function updateInput(input_id, value) {
    return {
        type: INPUT_VALUE_UPDATE,
        input_id,
        value
    };
}

export let updateInputDefs = (inputs) => {
    return {
        type: INPUT_DEFS_UPDATE,
        inputs
    };
};
