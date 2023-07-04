# [1.2.30] - 2021-01-24

Focus on updating the development environment with vagrant.

* [Release notes](main,release_v1_v1v2_v1v2v30)
* [GitHub release notes](https://github.com/peterlembke/infohub/releases/tag/v1.2.30)

## Known issues

## Added

## Changed
* HUB-1168, Vagrant now run xdebug 3.0.x
* HUB-1203, infohub_log in: Cannot read property 'enable' of undefined
* HUB-1201, Bug on Safari: null is not an object (evaluating '$sheet.cssRules.length')
* HUB-1205, updated the vagrant installation script to use sudo while setting rights on folders to avoid issues later.

## Removed

## Fixed

## Tested

## Investigated
* HUB-1202, macOS: https and Firefox gives QuotaExceededError for localStorage
  After cleaning out web data for all InfoHub sites it works again.
  I will close this task for now and see if it comes back.
  