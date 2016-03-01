import '../sass/main.scss';

import { Views, Inputs, Errors} from '../src';
import program from './example.juttle';

const JUTTLE_SERVICE_HOST = 'localhost:8080';

let bundle = {
    program
};

let view = new Views(JUTTLE_SERVICE_HOST, document.getElementById('views'));
let inputs = new Inputs(JUTTLE_SERVICE_HOST, document.getElementById('inputs'));
let error = new Errors(document.getElementById('error'));

// handle runtime errors
view.on('error', runtimeError.bind(null, 'error'));
view.on('warning', runtimeError.bind(null, 'warning'));

function runtimeError(type, err) {
    error.render(err);
}

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
