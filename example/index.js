import Juttle from '../src';

let client = new Juttle('localhost:8080');
let bundle = {
    program: "const name = 'hi'; emit -limit 1000 | put name=name;"
};


let view = new client.View(document.getElementById('views'));
let inputs = new client.Input(document.getElementById('inputs'));
inputs.render(bundle);

document.getElementById('btn-run').addEventListener('click', e => {
    view.run(bundle);
});

// client.describe(bundle)
// .then(res => {
//     console.log(res);
//     if (res.inputs.length > 0) {
//     }
// });
