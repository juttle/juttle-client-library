import Juttle from '../src';

let client = new Juttle('http://localhost:8080');
let bundle = {
    program: "input name: text; emit | put name=name;"
};


let view = new client.View(document.getElementById('views'));
let inputs = new client.Input(document.getElementById('inputs'));
inputs.render(bundle);

// client.describe(bundle)
// .then(res => {
//     console.log(res);
//     if (res.inputs.length > 0) {
//     }
// });
