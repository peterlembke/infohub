# [1.3.3] - 2021-12-26

PHPStorm have tests. Many are fixed in this release.

* [Release notes](main,release_v1_v1v3_v1v3v3)
* [GitHub release notes](https://github.com/peterlembke/infohub/releases/tag/v1.3.3)

## Added

## Changed

## Removed
 
## Fixed
* HUB-1420, PHPStorm problems - CSS - Removed invalid flags. Removed duplicate tags.
* HUB-1421, PHPStorm problems - HTML - Removed/changed deprecated tags. Added required parameters.
* HUB-1423, PHPStorm problems - Javascript - Fixed js bugs
* HUB-1424, PHPStorm problems - PHP - Fixed issues in 33 files
* HUB-1429, PHPStorm problems - Round 2 - More fixes for CSS, PHP, JS and Markdown. Fixed issues in 14 files
* HUB-1425, a lot of spelling errors corrected. Fixed issues in 89 files
* HUB-1430, PHPStorm grammar issues, 334 files changed, 1432 insertions(+), 1439 deletions(-)
* HUB-1428, PHPStorm problems - SVG - Fixed 46 SVG by adding a title on each. Many more left.

## Tested

## Investigated
* HUB-1419, PHPStorm problems - Markdown - Can not resolve links. But that is no problem for infohub_doc
* HUB-1422, PHPStorm problems - JSON - No real problems
* HUB-1423, PHPStorm problems - Javascript - I can not refactor 3rd party code. I do not agree with redundant variables due to debug purposes
* HUB-1426, PHPStorm problems - RegExp - A warning is in the 3rd party PGP code. I can't fix that.
* HUB-1427, PHPStorm problems - ShellScript - I am not good enough to fix the issues in here.
