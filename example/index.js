import "../sass/main.scss";

import Juttle from "../src";

import program from "./example.juttle";

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
