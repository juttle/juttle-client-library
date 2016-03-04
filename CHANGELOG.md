# Change Log
This file documents all notable changes to juttle-client-library. The release numbering uses [semantic versioning](http://semver.org).

## Unreleased Changes

### Major Changes
- Removed outside Juttle class from api. Now you have to pass juttleServiceHost to view and index when you instantiate them. Also remove describe method from base import (use `describe` inside JuttleServiceHttp). [#64](https://github.com/juttle/juttle-client-library/pull/64)

### Minor Changes
- Change job-manager status to `CONNECTING`, `RUNNING` and `STOPPED`. Add subscribable `job-status` event to `job-manager` and `View` class. [#62](https://github.com/juttle/juttle-client-library/pull/62)
- `job-manager`- close websocket when `job_end` message is received from juttle-service [#67](https://github.com/juttle/juttle-client-library/pull/67)
- Add `getStatus` function to Views Class exported from `Views`. `ViewStatus` is exactly the same thing as `JobStatus` and is exported from `Views`.
[#70](https://github.com/juttle/juttle-client-library/pull/70)

### Bug Fixes
- Fix offsetWidth undefined error on window resize.
[#71](https://github.com/juttle/juttle-client-library/pull/71)

## 0.6.0

### Minor Changes
- expect websocket messages to contain view* instead of sink* properties [[#55](https://github.com/juttle/juttle-client-library/pull/55)]
- package.json: bump juttle-viz to 0.5.0 [[#60](https://github.com/juttle/juttle-client-library/pull/60)]
- package.json: bump juttle-jsdp to 0.3.0 [[#59](https://github.com/juttle/juttle-client-library/pull/59)]

### Bug Fixes
- Fix module export so it works properly with commonjs [[#57](https://github.com/juttle/juttle-client-library/pull/57)]
- date input: display time in utc [[#58](https://github.com/juttle/juttle-client-library/pull/58)]

## 0.5.0

### Major Changes
- Rework of job-manager api. Includes start function that returns a promise when a job has been created and the `job_start` event has been received
over the websocket [[#50](https://github.com/juttle/juttle-client-library/pull/50)]
- Make View object subscribable. Can now listen to events from `job-manager` by subscribing with `on`. [[#53](https://github.com/juttle/juttle-client-library/pull/53)]

## 0.4.0

Released 2016-02-12

### Major Changes
- change input.getValues to return a promise and text/number input to update onBlur [[#43](https://github.com/juttle/juttle-client-library/pull/43)]

## 0.3.0

### Major Changes
- Add error reporting for invalid JuttleView parameters.

## 0.2.1

Released 2016-01-22

### Bug Fixes
- Bump juttle-viz version to 0.3.1 [[#32](https://github.com/juttle/juttle-client-library/pull/32)]

## 0.2.0

Released 2016-01-21

### Major Changes

- Use JSDP to communicate with juttled [[#20](https://github.com/juttle/juttle-client-library/pull/20)]
- Add date input [[#27](https://github.com/juttle/juttle-client-library/pull/27)]

### Minor Changes

- Bump juttle-viz version to 0.3.0 [[75a5790](https://github.com/juttle/juttle-client-library/commit/75a5790ac7fb7ed7db9ea157f3b8909069ce4152)]

## 0.1.6

### Bug Fixes

- fix how react-select css is imported [[#25](https://github.com/juttle/juttle-client-library/pull/25)]
- Better cleanup when unmounting views [[#23](https://github.com/juttle/juttle-client-library/pull/23)]
- Clear views array on job_create event [[#24](https://github.com/juttle/juttle-client-library/pull/24)]

## 0.1.5

- add error handling [[#19](https://github.com/juttle/juttle-client-library/pull/19)]

## 0.1.4

### Major Changes

- Refetch input definitions when an input value changes [[#11](https://github.com/juttle/juttle-client-library/pull/11)]

### Minor Changes

- Add `stop` function to `View` class

### Bug Fixes

- Fix issue with old Jobs not getting stopped on View rerun.
