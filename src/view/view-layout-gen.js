import _ from 'underscore';

// handle undefined cols or rows
let compare = (a, b) => {
    if (a === b) {
        return 0;
    } else if (!_.isNumber(a)) {
        return 1;
    } else if (!_.isNumber(b)) {
        return -1;
    } else {
        return a - b;
    }
};

let getRow = (view) => {
    return view.options ? view.options.row : undefined;
};

export default (viewArr) => {
    // group by row number, concat unspecified at end of array
    let groupViews = _.groupBy(viewArr, view => {
        let row = getRow(view);
        return _.isNumber(row) ? row : 'noRowSpecified';
    });

    let noRow = groupViews['noRowSpecified'] || [];
    delete groupViews['noRowSpecified'];

    viewArr = _.values(groupViews);

    noRow.forEach(view => {
        viewArr.push([view]);
    });

    // order rows
    viewArr.sort((viewArrA, viewArrB) => {
        return compare(getRow(viewArrA[0]), getRow(viewArrB[0]));
    });

    // order columns
    return viewArr.map(views => {
        views.sort((viewA, viewB) => {
            return compare(viewA.options.col, viewB.options.col);
        });

        // clean this up a bit
        let arr = [];
        views.forEach((view) => {
            arr.push(view.view_id);
        });

        return arr;
    });
};
