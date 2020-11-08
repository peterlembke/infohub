# [1.2.7] - 2020-02-16
Main focus in this release was to finish the login and sessions but I got side tracked and fixed a lot of other things. TERMS and jshint took my attention this time.

* [Release notes](main,release_v1_v1v2_v1v2v7)
* [Github release notes](https://github.com/peterlembke/infohub/releases/tag/v1.2.7)

## Added
- TERMS.md - To follow if you want to display the Infohub TOS logo (future feature)
- folder/doc/design/ added documentation about design decisions.
- infohub_encrypt_none.md - New documentation
- infohub_encrypt_pgp.md - New documentation
- package.json - With parameters for JS hint
- infohub_login_login.js - Check if we already have a valid session before trying to login.
- infohub_session.js - Added initiator_check_session_valid
- infohub_session.php - Added responder_check_session_valid

## Changed
- folder/plugins/plugin/plugin.md - Improved documentation
- Infohub Login - Improved Swedish translations
- Infohub Contact - Improved Swedish translations
- On all JS plugins: Removed the usage of all ++ and --.
/jshint and put them in package.json instead.
- Added missing ; on rows in JS plugins. jshint helped me find them.
- On all JS plugins: Loops. Added check for hasOwnProperty 
- Changed to dot notation ($withHeader['data'] to $withHeader.data) wherever jshint found them.
- jshint found and I removed initialization values that are never used.
- jshint found and I removed return value variables that are never used.
- Loop key variables should not be $i. I renamed some of them but there are many more to change later.
- There were still some "var" left that I changed to let or const.
- Refactored Infohub JS files: uuid, transfer, template, asset, base, render, markdown, launcher, markdown_own, demo_form2, checksum_personnummer, contact_client, compress, configlocal_allow, checksum_md5, cache, view, 

## Removed
- On all JS plugins: Removed inline options for jslint
- On all JS plugins: Removed "use strict" from each function and set it on class level instead.
- Removed deprecated parameters on iframe: render_video, 

## Fixed
- asset, Assigned a variable with === instead of =.
