# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]
- infohub_audio - Using Howler to play sound.
- Client login + GUI
- Server login
- Sessions

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
