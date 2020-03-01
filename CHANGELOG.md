# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]
Below is the aim for version 1.3.0
- Exchange check messages - Refuse messages that goes to a plugin I do not have right to.
- Outgoing package - Sign the package
- Incoming response package - Check sign code. Refuse query messages.
- Incoming query package - Check sign code.

## [1.2.8] - 2020-03-01
Code on [Github](https://github.com/peterlembke/infohub/releases/tag/v1.2.8)
Main focus in this release was to finish the login and sessions but I got side tracked and fixed a lot of other things. Speed optimization, bug fixes and a timer + demo.

### Added
- Infohub_Base.js got a new function _Full()
- Infohub_Timer.js - New plugin to handel timers
- Infohub_Demo_Timer.js - Plugin to show the new timer plugin.
- Infohub_Demo_Menu.js - Menu option added for Timer.
- infohub_view.js - New function "set_style" can set a style on any element.

### Changed
Tested xdebug profiler in PHP Storm. Got some valuable insights.

- Infohub_Base.php - Cmd(), quicker check if function can be called.
- Infohub_Base.php - Cmd(), Use of debug_backtrace() much faster now.
- infohub_file.php - Speed improvements.

### Removed

### Fixed
- infohub_launcher.js - A padding caused Sony Z3+ to display the icons hooked in each other.
- infohub_plugin.php - Check of valid licenses had a bug.
- infohub_storage_data_file/mysql/pgsql/sqlite.php - All got the same speed improvement.

## [1.2.7] - 2020-02-16
Code on [Github](https://github.com/peterlembke/infohub/releases/tag/v1.2.7)
Main focus in this release was to finish the login and sessions but I got side tracked and fixed a lot of other things. TERMS and jshint took my attention this time.

### Added
- TERMS.md - To follow if you want to display the Infohub TOS logo (future feature)
- folder/doc/design/ added documentation about design decisions.
- infohub_encrypt_none.md - New documentation
- infohub_encrypt_pgp.md - New documentation
- package.json - With parameters for JS hint
- infohub_login_login.js - Check if we already have a valid session before trying to login.
- infohub_session.js - Added initiator_check_session_valid
- infohub_session.php - Added responder_check_session_valid

### Changed
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

### Removed
- On all JS plugins: Removed inline options for jslint
- On all JS plugins: Removed "use strict" from each function and set it on class level instead.
- Removed deprecated parameters on iframe: render_video, 

### Fixed
- asset, Assigned a variable with === instead of =.

## [1.2.6] - 2020-02-02
Code on [Github](https://github.com/peterlembke/infohub/releases/tag/v1.2.6)
Main focus in this release was to finish the login and sessions but I got side tracked and fixed a lot of other things.

### Added
- Infohub Demo Markdown - got a new doc file.
- Infohub Login - got translation fiels in English, Spanish, Swedish.

### Changed
- Documentation, general fixes with links. Updated the road map.
- settings_and_errors.php - Improved stability under PHP 7.4
- infohub demo document - Improved the demo and the documentation.
- JS `var` exchanged with `let` or `const` everywhere possible.
- Render Document - Plugin got updated documentation
- Infohub_View - Fixed bugs in _GetBoxId

### Removed
- Code contained a lot of blocks with comments. Removed most of them.

## [1.2.5] - 2020-01-19
Code on [Github](https://github.com/peterlembke/infohub/releases/tag/v1.2.5)
Main focus in this release are login and session. Many features are still missing, see Unreleased.

### Added
- infohub_login - GUI for using a contact file and login to the server
- infohub_session - Used by infohub_login to register a session
- infohub_checksum_doublemetaphone.js - Found a good JS code and implemented that. 
- infohub_base.php - Now support messages with short tail. (Messages that have a short callstack) 

### Changed
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

### Removed

### Fixed
- start.js - Bug that made the progress fail
- Icon translation "programstartare" was too long. Changed to "Program startare" and it became two rows.
- Icon translation "Dokumentation" was too long. Changed to "Dokumen- tation" and it became two rows.

## [1.2.4] - 2020-01-01
Code on [Github](https://github.com/peterlembke/infohub/releases/tag/v1.2.4)  
I started developing Infohub at 2010-01-01 and today 10 years later I give you this release.   

This is a service release with a lot of small changes but also a new feature with the table renderer and my view on doc/accessibility.

### Added
- infohub_render_table - Now you can use tables
- infohub_demo_table - Demo table
- doc/accessibility - My view on accessibility. A top priority to be implemented.

### Changed
- CHANGELOG - Updated this document
- README - Updated what I am working on
- infohub_contact_client - Now using user_name as ID for a user.
- infohub_launcher - Made the GUI tighter with max width on buttons and information box. Easier to get an overview on big screens.
- infohub_renderform - Button label get padding between text and indicator image. Also added support for css_data.
- infohub_transfer - Deleting the step parameter on outgoing messages from client and from server. We will not try to upset the other node by manipulate the step parameter in the function we call.
- infohub_transfer - Restore the call stack on messages that could not be sent to the server. Then the message can report that it can not be sent.
- infohub_view.js - Refactoring. Removed `var` and introduced `const` and `let`.
- infohu_workbench - Menu icons width/height from 80px to 64px to make the GUI tighter. Still finger friendly.
 
### Removed
- infohub_view.css - Removed word-break.

### Fixed
- infohub_compress.js - Undeclared variables
- infohub_contact - Language files spelling error
- infohub_uuid - refactored, improved stability from exceptions and added phpdoc.

## [1.2.3] - 2019-12-05
Code on [Github](https://github.com/peterlembke/infohub/releases/tag/v1.2.3)

### Added
- Encryption - See Infohub Tools Encrypt.
- infohub_encrypt - adds encryption methods: pgp and none. Use them with a password. encrypt + decrypt.
- Added a CHANGELOG

### Changed
- Kick out tests - Simplified them and made them into objects
- Sessions - Removed the traditional cookie session and the php session_start. Will have a new solution in the next release.
- progress - The variable are now defined and pasted into infohub_start($progress);
- infohub_render_form - Text Area - You can now paste a "value" to be shown in the text area as an initial value.
- infohub_tools - Now downloads all its children at the same call. Makes it faster to use.
- infohub_configlocal - Now downloads all its children at the same call. Makes it faster to use.
- infohub_welcome - Now has translations on all children from start

### Fixed
- cold_start - failed on Firefox. Moved the deletion of the cold_start flag to an earlier point and now it works.
- infohub_offline.js - used variables that not all service workers have yet. Now it checks if the variable is defined.

## [1.2.2] - 2019-11-14
Service worker update. Code on [Github](https://github.com/peterlembke/infohub/releases/tag/v1.2.2)

### Added
- Service worker update strategy.

## [1.2.1] - 2019-11-01
Translate icon titles and descriptions. Code on [Github](https://github.com/peterlembke/infohub/releases/tag/v1.2.1)

### Added
- This release is about translation of the icon title and description.
- Icon title and description added to all translation files in swedish, spanish and english.
- Updated documentation in Infohub_Translate about this.

## [1.2.0] - 2019-10-28
Translations. Code on [Github](https://github.com/peterlembke/infohub/releases/tag/v1.2.0)

### Added
- All plugins that has a user interface have been translated to swedish, spanish and english.
- Translations to infohub_language and sorting so you get the language names in alphabetical order.

## [1.1.1] - 2019-10-24
First public release. Code on [Github](https://github.com/peterlembke/infohub/releases/tag/v1.1.0)

### Added
- PHP & JS Core - 9 years 10 months of development. 
