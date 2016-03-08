# Juttle Client Library

Juttle Client Library is a set of frontend building blocks for
creating applications that interact with outputs from
[juttle](https://github.com/juttle/juttle) programs via
[juttle-service](https://github.com/juttle/juttle-service).

[![Build Status](https://travis-ci.org/juttle/juttle-client-library.svg)](https://travis-ci.org/juttle/juttle-client-library)

## Introduction

Juttle Client Library consists of 5 distinct components: Views, Inputs, Errors,
JobManager, and HttpApi.

| Component | Description |
| --------- | ----------- |
| Views | The `Views` class is used to run a bundle (a juttle program with its modules) against an instance of Juttle Service and render its output onto a provided DOM node. |
| Inputs | Given a bundle, an inputs instance will render the bundle's inputs to specified DOM node. |
| Errors | Given an error object returned from either juttle-service or juttle-viz, an Errors instance will render a user-friendly error message. |
| JobManager | Interacts with the Juttle Service api to run and manage the lifecycle of a running Juttle Program. Emits events received from the [Juttle Service streaming api](https://github.com/juttle/juttle-service/blob/master/docs/jsdp-api.md). |
| HttpApi | Client functions for interacting with the Juttle Service http api. |

Additionally Juttle Client Library also exports these enums:

| Enum | Description |
| --------- | ----------- |
| `JobStatus` | An enum used to described the status of a given `JobManager` instance. Returned from the `getStatus()` method of `JobManager`. Possible values can be `STOPPED`, `STARTING`, `RUNNING` |
| `ViewStatus` | Exactly the same as `JobStatus` only returned from the `getStatus()` of a `Views` instance.

## Getting Started

`npm install --save juttle-client-library`

A quick example:

```javascript
import { Views, Inputs } from 'juttle-client-library';

let views = new Views(JUTTLE_SERVICE_HOST, document.getElementById('views'));
let inputs = new Inputs(JUTTLE_SERVICE_HOST, document.getElementById('inputs'));

let bundle = {
    program: 'input person:text; emit | put greeting = "hello " + person'    
};


inputs.render(bundle);

document.getElementById('btn-run').addEventListener('click', () => {
    inputs.getValues()
    .then(values => views.run(bundle, values));
});
```

## API

See the `example` and `test` directory for how this library should be used. A
more complete implementation can be see in
[juttle/juttle-viewer](https://github.com/juttle/juttle-viewer)

## Running Example

*Prerequisite* - Have a locally running instance of Juttle Service (or
[Juttle Engine](https://github.com/juttle/juttle-engine)) on port 8080 (you
can adjust the location by changing line 6 of `example/index.js`).

Here's how to run this library locally from this repo (also used for
    development purposes):

```bash
$ git clone https://github.com/juttle/juttle-client-library.git
$ cd juttle-client-library
$ npm install
$ cd example
$ ./server.js
```
