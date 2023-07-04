# [1.3.6] - 2022-01-09

Created a blog. Speed improvements in InfoHub.

* [Release notes](main,release_v1_v1v3_v1v3v6)
* [GitHub release notes](https://github.com/peterlembke/infohub/releases/tag/v1.3.6)

## Added
* HUB-1452, Created blog.infohub.se with WordPress
* HUB-1467, start.js - Added missing plugins that are required at startup to speed up startup

## Changed
* HUB-1469, Improved _Default in Javascript. Much faster now according to performance measures in Brave.
* HUB-1476, infohub_storage_data_idbkeyval: Improved the MemoryCache and the NotInCache lists. Makes read and write faster to the browser database.
* HUB-1477, minor refactoring in storage and storage_data

## Removed
* HUB-1468, infohub_view - Removed all _ByVal
* HUB-1470, infohub_base - Have removed four _ByVal and one _Merge. Minor refactoring
* HUB-1473, infohub_exchange - Have removed seven _Default and one _ByVal. Minor refactoring
 
## Fixed
* HUB-1434, Updated infohub.se to the latest version v1.3.5
* HUB-1456, Created a InfoHub blog theme based on the theme: Story Book

## Tested

## Investigated
* HUB-1463, Investigate: What takes time with refresh_list. It is _MiniClone that is run in _ByVal. It is run many times. Object.assign does not always work.
