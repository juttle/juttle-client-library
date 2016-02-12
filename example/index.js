import '../sass/main.scss';

import Juttle from '../src';

import program from './example.juttle';

let client = new Juttle('localhost:8080');
let bundle = {
    program
};


let view = new client.View(document.getElementById('views'));
let inputs = new client.Input(document.getElementById('inputs'));
let error = new client.Errors(document.getElementById('error'));

inputs.render(bundle)
.catch(err => {
    error.render(err);
});


document.getElementById('btn-run').addEventListener('click', () => {
    inputs.getValues()
    .then((values) => {
        return view.run(bundle, values);
    })
    .catch(err => {
        error.render(err);
    });
});

document.getElementById('btn-stop').addEventListener('click', () => {
    view.stop();
});

document.getElementById('btn-clear-errors').addEventListener('click', () => {
    error.clear();
});

document.getElementById('btn-clear-view').addEventListener('click', () => {
    view.clear();
});

document.getElementById('btn-clear-inputs').addEventListener('click', () => {
    inputs.clear();
});
