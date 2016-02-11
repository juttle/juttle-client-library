# Change Log
This file documents all notable changes to juttle-client-library. The release numbering uses [semantic versioning](http://semver.org).

## Unreleased Changes

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
