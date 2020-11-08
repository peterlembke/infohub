# [1.2.11] - 2020-04-15
Main focus in this release was to improve the plugin icons. Introcuce SPDX-License-Identifier. Refactor Infohub Transfer so it can call Infohub Session and get one step closer to v1.3.0. Fix bugs in Infohub Asset. 

I want to release all these small changes now so that the next release will be easier to see the differences in.

* [Release notes](main,release_v1_v1v2_v1v2v11)
* [Github release notes](https://github.com/peterlembke/infohub/releases/tag/v1.2.11)

## Added
- Infohub Asset - got a new icon
- Infohub Doc - added a GFDL license icon
- Infohub Launcher - Got a new icon 
- README got links to TERMS and detailed license information
- Package.json - added tags

## Changed
- SPDX-License-Identifier: GFDL-1.3-or-later added to all documentation files.
- SPDX-License-Identifier: GPL-3.0-or-later added to all Javascript plugins. Removed "license_name".
- Asset license files. kept "license_name" but changed license names to SPDX-License-Identifier.
- folder/include/kick_out_tests_for_index.php - refactored.
- folder/include/kick_out_tests_for_index.php - now allow no cookies. Allow xdebug cookies during debugging.
- folder/include/start.js - added infohub_timer. Refactored all ++
- infohub_session - Worked on the functions.
- infohub_transfer - Refactored so the infohub_timer is used.
- infohub_transfer - internal_Send is now part of Send. 
- infohub_transfer - Removed global timers.
- infohub_transfer - Added emerging function "Received".
- infohub_exchange - Refactored _AddTransferMessage()
- doc/license/license.md - Wrote about SPDX identifiers.
- infohub Contact, improved the default array.
- Exchange.php, added PHPDOC and refactored
- Kick out and infohub.php got some refactoring
- Timer, bug fix. Checksum and Transfer got minor refactoring
- Swedish icon names that are too long are now on two rows

## Removed

## Fixed
- Infohub Asset - GUI Update now renders newly used icons to already rendered plugins.
- Infohub Asset - GUI now show all icons in the same size. There was a problem with the demo audio/video/map icons.
