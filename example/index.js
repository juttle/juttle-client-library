import "../sass/main.scss";

import Juttle from "../src";

let program = `
    input name: text;

    emit -limit 1000
    | put val = Math.random()
    | put name = name
    | (
        view timechart -o {
            id: 'tim',
            valueField: 'val',
            row: 0
        };
        filter val > 0.5
        | view events -o {
            title: 'above .50',
            on: 'tim'
        };
        keep val
        | view table -row 0;
    )`;

let client = new Juttle("localhost:8080");
let bundle = {
    program
};


let view = new client.View(document.getElementById("views"));
let inputs = new client.Input(document.getElementById("inputs"));
let error = new client.Errors(document.getElementById("error"));

inputs.render(bundle)
.catch(err => {
    error.render(err);
});


document.getElementById("btn-run").addEventListener("click", () => {
    view.run(bundle, inputs.getValues());
});

document.getElementById("btn-stop").addEventListener("click", () => {
    view.stop();
});
