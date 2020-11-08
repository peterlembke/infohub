# [1.2.5] - 2020-01-19
Main focus in this release are login and session. Many features are still missing, see Unreleased.

* [Release notes](main,release_v1_v1v2_v1v2v5)
* [Github release notes](https://github.com/peterlembke/infohub/releases/tag/v1.2.5)

## Added
- infohub_login - GUI for using a contact file and login to the server
- infohub_session - Used by infohub_login to register a session
- infohub_checksum_doublemetaphone.js - Found a good JS code and implemented that. 
- infohub_base.php - Now support messages with short tail. (Messages that have a short callstack) 

## Changed
- CHANGELOG - Updated this document
- Progress bar - Standard HTML5 progress bar
- phpinfo.php - Now accessible. changed .htaccess
- Table - Now tables use strings as ID instead of integers.
- Table demo - Updated the demo to use hub_id
- Debug, updated the documentation and the debug module doc how to debug infohub.
- Infohub_cache - Updated the documentation
- infohub_contact - the user_id is now a hub_id with prefix `user_`
- infohub_renderform - Removed the alert box on submit buttons that fails. You can handle that in your event function instead.
- infohub_storage_data_idbkeyval.js - Now give accurate post_exist back
- on File, MySQL, PGSQL, SQLite: Change to PDO::ATTR_PERSISTENT => false, and also return post_exist on PostInsert.
- infohub_base.js - Some refactoring to use const and let

## Removed

## Fixed
- start.js - Bug that made the progress fail
- Icon translation "programstartare" was too long. Changed to "Program startare" and it became two rows.
- Icon translation "Dokumentation" was too long. Changed to "Dokumen- tation" and it became two rows.
