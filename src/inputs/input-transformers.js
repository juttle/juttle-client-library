import _ from 'underscore';

let normalizeItemsOption = (input) => {
    if (!input.options.items) {
        return input;
    }

    let options = Object.assign({}, input.options, {
        items: input.options.items.map((item) => {
            return _.isString(item) ? { value: item, label: item } : item;
        })
    });

    return Object.assign({}, input, {
        options: options
    });

};

let transformers = {
    normalizeItemsOption
};

let transformInput = (input) => {
    return _.reduce(_.values(transformers), (input, transformer) => {
        return transformer(input);
    }, input);
};

export default {
    transformers,
    transformInput
};
