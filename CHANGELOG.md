# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Fixed
### Added
### Changed
### Removed


## [2.0.1] - 2023-03-29

### Fixed
- Corrected reporting on the configurabilty of the PropertyDescriptor (configurable: true)


## [2.0.0] - 2023-03-24

### Added
- `Trap.commit` and `Trap.rollback` now support an optional search argument to select a subset of mutations to be committed or rolled back.
- New `Trap.count` method, allowing to count the number of mutations, optionally matching a subset of mutation options (e.g. target and/or key)
- Support for IIFE, CJS, ESM and TypeScript

### Changed
- Migration to Typescript
- **BREAKING** There is no more default export

### Removed
- **BREAKING** The Trap no longer exposes the collected mutations, this was introduced mainly to make unit testing possible and was no longer needed, there is now a `count` method on `Trap` which allows for counting all/specific mutations.


## [1.2.7] - 2020-01-16

### Changed
- mutations are now stored in a much stricter checked MutationCollection (extend of Array)
- refactored the internal structure


## [1.2.6] - 2019-08-26

### Changed
- updated dependencies


## [1.2.5] - 2019-07-15

### Changed
- updated dependencies
- added auto publication to npm


## [1.2.4] - 2019-06-05

### Changed
- updated dependencies
- added Node v11 and v12 to versions to test

## [1.2.3] - 2019-02-08

### Changed
- updated dependencies
- restored test coverage to 100%


## [1.2.2] - 2018-07-08

### Fixed
- fixed issue where a `get` of a `false` values would improperly return `undefined`

### Changed
- updated dependencies


## [1.2.1] - 2018-04-27

### Changed
- updated dependencies
- added Node v10 to the versions to test


## [1.2.0] - 2018-04-17

### Added
- added constructor flag to enable "last mutation only" mode, reduces the number of mutations in memory and to perform on commit


## [1.1.3] - 2017-12-22

### Changed
- exclude specific files form publication


## [1.1.2] - 2017-12-06

### Changed
- increased test script verbosity
- added missing package repository and bugs links


## [1.1.1] - 2017-12-05

### Changed
- added `deleteProperty` return value
- `defineProperty` return value now uses the same mechanics as `set` and `deleteProperty`


## [1.1.0] - 2017-12-04

### Added
- added `toString` and `toJSON` methods to Value-, Property- and DeletionMutations


## [1.0.1] - 2017-12-04

### Fixed
- fixed issue where `set` did not return a boolean true


## [1.0.0] - 2017-12-03

Initial release.


[Unreleased]: https://github.com/konfirm/node-trap/compare/v2.0.1...HEAD
[2.0.1]: https://github.com/konfirm/node-trap/compare/v2.0.0...v2.0.1
[2.0.0]: https://github.com/konfirm/node-trap/compare/v1.2.7...v2.0.0
[1.2.7]: https://github.com/konfirm/node-trap/compare/v1.2.6...v1.2.7
[1.2.6]: https://github.com/konfirm/node-trap/compare/v1.2.5...v1.2.6
[1.2.5]: https://github.com/konfirm/node-trap/compare/v1.2.4...v1.2.5
[1.2.4]: https://github.com/konfirm/node-trap/compare/v1.2.3...v1.2.4
[1.2.3]: https://github.com/konfirm/node-trap/compare/v1.2.2...v1.2.3
[1.2.2]: https://github.com/konfirm/node-trap/compare/v1.2.1...v1.2.2
[1.2.1]: https://github.com/konfirm/node-trap/compare/v1.2.0...v1.2.1
[1.2.0]: https://github.com/konfirm/node-trap/compare/v1.1.3...v1.2.0
[1.1.3]: https://github.com/konfirm/node-trap/compare/v1.1.2...v1.1.3
[1.1.2]: https://github.com/konfirm/node-trap/compare/v1.1.1...v1.1.2
[1.1.1]: https://github.com/konfirm/node-trap/compare/v1.1.0...v1.1.1
[1.1.0]: https://github.com/konfirm/node-trap/compare/v1.0.1...v1.1.0
[1.0.1]: https://github.com/konfirm/node-trap/compare/v1.0.0...v1.0.1
[1.0.0]: https://github.com/konfirm/node-trap/releases/tag/v1.0.0


