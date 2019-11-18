# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/). Currently this project does not adhere to [Semantic Versioning](http://semver.org/spec/v2.0.0.html). The major version is fixed to 0 and the minor version is used for breaking or non-breaking changes. We also use the patch version for the build number. Once this becomes a more mature project, we'll start using the major version for breaking changes. For now, you should fix your version to the minor version. e.g. `0.4.x`

> **Tags:**
> - :boom:       [Breaking Change]
> - :rocket:     [New Feature]
> - :bug:        [Bug Fix]
> - :memo:       [Documentation]
> - :house:      [Internal]
> - :nail_care:  [Polish]

## [0.8.0]
#### :bug: Bug Fix
- Inject reducer/saga on construct instead of mount, fixing a bug where reducers/sagas could not be loaded in time for actions to be dispatched

## [0.6.0]
#### :rocket: New Feature
- Support passing props from container to saga as the first argument
