# [1.3.11] - 2023-08-19

Focused on bug fixes on the client. Improved the built-in JS minifier.
Added a progress bar plugin. Removed the use of .substr() from all JS code

* [Release notes](main,release_v1_v1v3_v1v3v11)
* [GitHub release notes](https://github.com/peterlembke/infohub/releases/tag/v1.3.11)

## Added - new features
* HUB-1659, render common, added possibility to add custom variables on all rendered elements
* HUB-1659, render progress, A new progress bar that can also show additional values
* HUB-1659, demo progress, A new demo for the new progress bar
* HUB-1667, added event system to the bad ideas. An intercept system will be used instead

## Changed - changes in existing functionality
* HUB-1658, doc, index now uses rendered navigation links
* HUB-1558, doc, document is now rendered in a major box
* HUB-1557, doc, render document index when clicking on a document
* HUB-1556, doc, render navigation tree on start
* HUB-1555, doc navigation expand/contract is now more to the right away from the label. Easier to click on phone
* HUB-1657, doc navigation is now rendered with real links
* HUB-1656, The built-in JS minifier now remove comments that is after the command. Changed to a simple linefeed.
* HUB-1667, Refactored keyboard detection of special keys 
* HUB-1663, infohub_timer.md, updated the documentation

## Deprecated - soon-to-be removed features

## Removed - now removed features
* HUB-1661, infohub_base.js, _DecodeUtf8 and _EncodeUtf8 is deprecated and is not used anywhere. Removed.
* HUB-1662, removed the use of .substr() from all JS code. Not touching 3rd party code: PGP, double-metaphone, md5 

## Fixed - bug fixes
* HUB-1659, base _Translate(), Translation key conversion to english is improved when you have no translation files.

## Security - in case of vulnerabilities

## Tested

## Investigated
* HUB-1660, jshint parameters are in the wrong place. I will not put them in each plugin. Closing this task.
