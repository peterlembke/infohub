# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

I have moved all release log details to the [documentation](folder/doc/release/release.md)

# [1.3.5] - 2022-01-01

* [Release notes](main,release_v1_v1v3_v1v3v5)
* [GitHub release notes](https://github.com/peterlembke/infohub/releases/tag/v1.3.5)

Updated documentation about installation of Infohub. Investigated Composer. 

# [1.3.4] - 2021-12-26

* [Release notes](main,release_v1_v1v3_v1v3v4)
* [GitHub release notes](https://github.com/peterlembke/infohub/releases/tag/v1.3.4)

Updated documentation and articles. Added new screenshots.

# [1.3.3] - 2021-12-26

* [Release notes](main,release_v1_v1v3_v1v3v3)
* [GitHub release notes](https://github.com/peterlembke/infohub/releases/tag/v1.3.3)

PHPStorm have tests. Many are fixed in this release.

# [1.3.2] - 2021-12-24

* [Release notes](main,release_v1_v1v3_v1v3v2)
* [GitHub release notes](https://github.com/peterlembke/infohub/releases/tag/v1.3.2)

Requires PHP8. PHPStan level 9 pass OK. Bad ideas listed in documentation. LibreTranslate implemented.

# [1.3.1] - 2021-09-05

* [Release notes](main,release_v1_v1v3_v1v3v1)
* [GitHub release notes](https://github.com/peterlembke/infohub/releases/tag/v1.3.1)

You can now render password boxes with generate password, show/hide password. You can render status boxes. Improved translation tool that validate translation files. Bug fixes. Performance improvements. All plugins can now have assets. Added password to the Tree private secret

# [1.3.0] - 2021-05-22

* [Release notes](main,release_v1_v1v3_v1v3v0)
* [GitHub release notes](https://github.com/peterlembke/infohub/releases/tag/v1.3.0)

Infohub Tree got new features but is not finished. All code is auto refactored. opcache prefilled. All plugins can now be run standalone as their own applications. This is a large service release with things I want to get out on the sites. It was so long ago since the last release and today is my 50th birthday.

# [1.2.31] - 2021-01-24

* [Release notes](main,release_v1_v1v2_v1v2v31)
* [GitHub release notes](https://github.com/peterlembke/infohub/releases/tag/v1.2.31)

Development environment Vagrant now run xdebug 3.0.x. Fixed minor bugs.

# [1.2.30] - 2021-01-24

* [Release notes](main,release_v1_v1v2_v1v2v30)
* [GitHub release notes](https://github.com/peterlembke/infohub/releases/tag/v1.2.30)

Focus on updating the development environment with vagrant.

# [1.2.29] - 2021-01-09

* [Release notes](main,release_v1_v1v2_v1v2v29)
* [GitHub release notes](https://github.com/peterlembke/infohub/releases/tag/v1.2.29)

Colour schema configuration updated. You can now name, download, upload, apply colour schemas. You can now preview the colour schema. Created some colour schemas you can use. Your Css is now added at the end of the existing css if you use the same class name.

# [1.2.28] - 2020-12-31

* [Release notes](main,release_v1_v1v2_v1v2v28)
* [GitHub release notes](https://github.com/peterlembke/infohub/releases/tag/v1.2.28)

Colour schema configuration. Mocha chocolate default colour schema.

# [1.2.27] - 2020-12-25

* [Release notes](main,release_v1_v1v2_v1v2v27)
* [GitHub release notes](https://github.com/peterlembke/infohub/releases/tag/v1.2.27)

Improved rendering speeds by grouping items that will go to the same renderer.
This change breaks compatability with custom renderers. But since no one is reading this note, no one is using Infohub and certainly no one create their own renderers for Infohub then it does not matter.

# [1.2.26] - 2020-12-17

* [Release notes](main,release_v1_v1v2_v1v2v26)
* [GitHub release notes](https://github.com/peterlembke/infohub/releases/tag/v1.2.26)

This release focus on translations. A simpler system for translations. More translations.

# [1.2.25] - 2020-12-06

* [Release notes](main,release_v1_v1v2_v1v2v25)
* [GitHub release notes](https://github.com/peterlembke/infohub/releases/tag/v1.2.25)

New feature: step_void removes return calls for short tail messages. Removed the use of `window.alert` and `window.navigator` in the Javascript plugins. Improved PHPDOC in some JS files. Added welcome message in more languages.

# [1.2.24] - 2020-11-28

* [Release notes](main,release_v1_v1v2_v1v2v24)
* [GitHub release notes](https://github.com/peterlembke/infohub/releases/tag/v1.2.24)

This is a code update release with PHPDOC improvements. Added future flags for web_worker and code_plugin. Slimmer renderers to prepare for web workers. Improved PHP code to be more modern. Removed unnecessary files. Started removing the use of window in JS files to prepare for web workers. Bug fixes. Added on the fly minification of JS files + a config setting to disable it.

# [1.2.23] - 2020-11-08

* [Release notes](main,release_v1_v1v2_v1v2v23)
* [GitHub release notes](https://github.com/peterlembke/infohub/releases/tag/v1.2.23)

Support for the excellent AVIF image format. Speed improvements. Bug fixes. Cleaned up code. Prepared for future features.

# [1.2.22] - 2020-08-22

* [Release notes](main,release_v1v2v22)
* [GitHub release notes](https://github.com/peterlembke/infohub/releases/tag/v1.2.22)

Bugs found from last release. Added info about Infohub on Login page. Fixed rights. Added execution time and debug info. Added translations and translated Infohub Trigger. 

# [1.2.21] - 2020-08-18

* [Release notes](main,release_v1v2v21)
* [GitHub release notes](https://github.com/peterlembke/infohub/releases/tag/v1.2.21)

Security roles instead of lists with plugin names makes it easier to be an admin. Updated the template files for developers. New plugin "Infohub Trigger" for developers to trigger their plugin functions during development. Textarea improvements. Purge of render cache for developers. Mouse/VR hover effects everywhere. Security improvements in File and Base. Cleaned up CSS. Improved translations. Exchanged some icons to more glossy ones. 

# [1.2.20] - 2020-07-24

* [Release notes](main,release_v1v2v20)
* [GitHub release notes](https://github.com/peterlembke/infohub/releases/tag/v1.2.20)

Files with .txt extension can now act as json files. URL redirect function. Improved error messages and more messages. Tested server debugging tools. Added logos. Public accounts got better rights. tested sites on computer, ipad, iphone. Support slow 3G. Service worker now updates. Vagrant development environment added.

# [1.2.19] - 2020-07-18

* [Release notes](main,release_v1v2v19)
* [GitHub release notes](https://github.com/peterlembke/infohub/releases/tag/v1.2.19)

You can have an icon in the form/presentation box. Different users can have different config. Improved "More" in Launcher. Updated screenshot images. Different render cache for each logged-in user. You can clear your render cache. Removed texts during start.

# [1.2.18] - 2020-07-16

* [Release notes](main,release_v1v2v18)
* [GitHub release notes](https://github.com/peterlembke/infohub/releases/tag/v1.2.18)

Improved: the login/logout procedure. Missing rights shows on screen. Added ping function to the base class. Logged-in user shows in launcher with a logout button. Keyboard logout. Lists are now bound to user. Better reject messages. Added public log in accounts with base rights. Changed recommended security group on some plugins. Improved JS code. Changed Launcher title sizes to depend on title length. Bug fixes.

# [1.2.17] - 2020-07-12

* [Release notes](main,release_v1v2v17)
* [GitHub release notes](https://github.com/peterlembke/infohub/releases/tag/v1.2.17)

Improved the ban time. Enforced better rights protection on some plugins. Now server can single sided throw away a session. You can prepare a log in file for download with a button. Fixed bug in Contact.

## [1.2.16] - 2020-07-05

* [Release notes](main,release_v1v2v16)
* [GitHub release notes](https://github.com/peterlembke/infohub/releases/tag/v1.2.16)

Added a rendering cache. Improved Storage and a demo. Some @todo fixed. Assets cached better. Improved log in.  Client transfer with banned_until now works. Translations added. Improved icons. Style added.  

## [1.2.15] - 2020-05-17

* [Release notes](main,release_v1v2v15)
* [GitHub release notes](https://github.com/peterlembke/infohub/releases/tag/v1.2.15)

Focused on support for large responses. Regression issues. Installation documentation. Configuration files.

## [1.2.14] - 2020-05-16

* [Release notes](main,release_v1v2v14)
* [GitHub release notes](https://github.com/peterlembke/infohub/releases/tag/v1.2.14)

Focused on the communication with messages_encoded, log in procedure, rights, prepared security group tags, localization to swedish, english, spanish. Regressions fixed. Communication Packages from server are now formatted the same way as the client packages and the sign_code are verified.

## [1.2.13] - 2020-04-30

* [Release notes](main,release_v1v2v13)
* [GitHub release notes](https://github.com/peterlembke/infohub/releases/tag/v1.2.13)

Focused on deprecating test system and callback. Doc now read root files. New traffic package type, mime type and encoding. Now renders SVG. Login and sessions got some features, so we get one step closer to v1.3.0. Reduced number of calls to the server. Now shows message under button and select. User_name available to plugins. Login now mandatory. Any license allowed.

## [1.2.12] - 2020-04-19

* [Release notes](folder/doc/release/v1v2v12/release_v1v2v12.md)
* [GitHub release notes](https://github.com/peterlembke/infohub/releases/tag/v1.2.12)

Focused on deprecating test system and callback. Doc now read root files. New traffic package type. Now renders SVG. Login and sessions got some features, so we get one step closer to v1.3.0. Reduced number of calls to the server.

## [1.2.11] - 2020-04-15

* [Release notes](folder/doc/release/v1v2v11/release_v1v2v11.md)
* [GitHub release notes](https://github.com/peterlembke/infohub/releases/tag/v1.2.11)

Main focus in this release was to improve the plugin icons. Introduce SPDX-License-Identifier. Refactor Infohub Transfer, so it can call Infohub Session and get one step closer to v1.3.0. Fix bugs in Infohub Asset. 
  
## [1.2.10] - 2020-03-28

* [Release notes](folder/doc/release/v1v2v10/release_v1v2v10.md)
* [GitHub release notes](https://github.com/peterlembke/infohub/releases/tag/v1.2.10)

Main focus in this release was to Deprecate iframes. Improve graphics with nicer plugin icon and icons in GUI. Remove bugs in existing plugins. Improve existing documentation. Show asset licenses. Fix fonts on iPad. Optimize SVG images and fix SVG image view bug. Move detailed release logs to the documentation.  

## [1.2.9] - 2020-03-10

* [Release notes](folder/doc/release/v1v2v9/release_v1v2v9.md)
* [GitHub release notes](https://github.com/peterlembke/infohub/releases/tag/v1.2.9)

Main focus in this release was to spice up the icons and to separate the timer from the advanced Transfer plugin. I have done that.

## [1.2.8] - 2020-03-01

* [Release notes](folder/doc/release/v1v2v8/release_v1v2v8.md)
* [GitHub release notes](https://github.com/peterlembke/infohub/releases/tag/v1.2.8)

Main focus in this release was to finish the login and sessions, but I got side tracked and fixed a lot of other things. Speed optimization, bug fixes and a timer + demo.

## [1.2.7] - 2020-02-16

* [Release notes](folder/doc/release/v1v2v7/release_v1v2v7.md)
* [GitHub release notes](https://github.com/peterlembke/infohub/releases/tag/v1.2.7)

Main focus in this release was to finish the login and sessions, but I got side tracked and fixed a lot of other things. TERMS and jshint took my attention this time.

## [1.2.6] - 2020-02-02

* [Release notes](folder/doc/release/v1v2v6/release_v1v2v6.md)
* [GitHub release notes](https://github.com/peterlembke/infohub/releases/tag/v1.2.6)

Main focus in this release was to finish the login and sessions, but I got side tracked and fixed a lot of other things.

## [1.2.5] - 2020-01-19

* [Release notes](folder/doc/release/v1v2v5/release_v1v2v5.md)
* [GitHub release notes](https://github.com/peterlembke/infohub/releases/tag/v1.2.5)

Main focus in this release are log in and session. Many features are still missing, see Unreleased.

## [1.2.4] - 2020-01-01

* [Release notes](folder/doc/release/v1v2v4/release_v1v2v4.md)
* [GitHub release notes](https://github.com/peterlembke/infohub/releases/tag/v1.2.4)

I started developing Infohub at 2010-01-01 and today 10 years later I give you this release.   

This is a service release with a lot of small changes but also a new feature with the table renderer and my view on doc/accessibility.

## [1.2.3] - 2019-12-05

* [Release notes](folder/doc/release/v1v2v3/release_v1v2v3.md)
* [GitHub release notes](https://github.com/peterlembke/infohub/releases/tag/v1.2.3)

## [1.2.2] - 2019-11-14
Service worker update.
 
* [Release notes](folder/doc/release/v1v2v2/release_v1v2v2.md)
* [GitHub release notes](https://github.com/peterlembke/infohub/releases/tag/v1.2.2)

## [1.2.1] - 2019-11-01
Translate icon titles and descriptions.
 
* [Release notes](folder/doc/release/v1v2v1/release_v1v2v1.md)
* [GitHub release notes](https://github.com/peterlembke/infohub/releases/tag/v1.2.1)

## [1.2.0] - 2019-10-28
Translations.
 
* [Release notes](folder/doc/release/v1v2v0/release_v1v2v0.md)
* [GitHub release notes](https://github.com/peterlembke/infohub/releases/tag/v1.2.0)

## [1.1.0] - 2019-10-24
First public release.

* [Release notes](folder/doc/release/v1v1v0/release_v1v1v0.md)
* [GitHub release notes](https://github.com/peterlembke/infohub/releases/tag/v1.1.0)
