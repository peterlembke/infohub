# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

I have moved all release log details to the [documentation](folder/doc/release/release.md)

## [Unreleased]
**Below is the aim for version 1.3.0**

- Full login and rights system.

**Below is the aim for version 1.2.14**
A bit unclear task right now.

HUB-619 - start.js should check if we have a stored session or else request single page login plugin.

**Below is the aim for version 1.2.13**
To do from top to bottom:

- HUB-616 - Client: Text and textarea - åäö can not be sent to server
- HUB-621 - Server: Send user_name to the plugins so they can act
- HUB-604 - Server: Infohub Session - Get allowed plugins list
- HUB-620 - Server: Check incoming messages against the session allowed plugins list
- HUB-622 - Server: plugin_request - guests get reduced list
- HUB-623 - Server: launcher, get_full_list - Only get plugins you have rights to
- HUB-605 - Client: Infohub Session - Get allowed plugins list
- HUB-624 - Client: Check outgoing messages that I am allowed to send to those plugins
- HUB-625 - Server: Outgoing messages. send messages_encoded
- HUB-626 - Server: Outgoing messages. Comply to package_type = "2020"
- HUB-627 - Client: Receive packages with type "2020"
- HUB-628 - Client: Incoming response. Verify sign_code


## [1.2.12] - 2020-04-19

* [Release notes](folder/doc/release/v1v2v12/release_v1v2v12.md)
* [Github release notes](https://github.com/peterlembke/infohub/releases/tag/v1.2.12)

Focused on deprecating test system and callback. Doc now read root files. New traffic package type. Now renders SVG. Login and sessions got some features so we get one step closer to v1.3.0. Reduced number of calls to the server.

## [1.2.11] - 2020-04-15

* [Release notes](folder/doc/release/v1v2v11/release_v1v2v11.md)
* [Github release notes](https://github.com/peterlembke/infohub/releases/tag/v1.2.11)

Main focus in this release was to improve the plugin icons. Introcuce SPDX-License-Identifier. Refactor Infohub Transfer so it can call Infohub Session and get one step closer to v1.3.0. Fix bugs in Infohub Asset. 
  
## [1.2.10] - 2020-03-28

* [Release notes](folder/doc/release/v1v2v10/release_v1v2v10.md)
* [Github release notes](https://github.com/peterlembke/infohub/releases/tag/v1.2.10)

Main focus in this release was to Deprecate iframes. Improve graphics with nicer plugin icon and icons in GUI. Remove bugs in existing plugins. Improve existing documentation. Show asset licenses. Fix fonts on iPad. Optimize SVG images and fix SVG image view bug. Move detailed release logs to the documentation.  

## [1.2.9] - 2020-03-10

* [Release notes](folder/doc/release/v1v2v9/release_v1v2v9.md)
* [Github release notes](https://github.com/peterlembke/infohub/releases/tag/v1.2.9)

Main focus in this release was to spice up the icons and to separate the timer from the advanced Transfer plugin. I have done that.

## [1.2.8] - 2020-03-01

* [Release notes](folder/doc/release/v1v2v8/release_v1v2v8.md)
* [Github release notes](https://github.com/peterlembke/infohub/releases/tag/v1.2.8)

Main focus in this release was to finish the login and sessions but I got side tracked and fixed a lot of other things. Speed optimization, bug fixes and a timer + demo.

## [1.2.7] - 2020-02-16

* [Release notes](folder/doc/release/v1v2v7/release_v1v2v7.md)
* [Github release notes](https://github.com/peterlembke/infohub/releases/tag/v1.2.7)

Main focus in this release was to finish the login and sessions but I got side tracked and fixed a lot of other things. TERMS and jshint took my attention this time.

## [1.2.6] - 2020-02-02

* [Release notes](folder/doc/release/v1v2v6/release_v1v2v6.md)
* [Github release notes](https://github.com/peterlembke/infohub/releases/tag/v1.2.6)

Main focus in this release was to finish the login and sessions but I got side tracked and fixed a lot of other things.

## [1.2.5] - 2020-01-19

* [Release notes](folder/doc/release/v1v2v5/release_v1v2v5.md)
* [Github release notes](https://github.com/peterlembke/infohub/releases/tag/v1.2.5)

Main focus in this release are login and session. Many features are still missing, see Unreleased.

## [1.2.4] - 2020-01-01

* [Release notes](folder/doc/release/v1v2v4/release_v1v2v4.md)
* [Github release notes](https://github.com/peterlembke/infohub/releases/tag/v1.2.4)

I started developing Infohub at 2010-01-01 and today 10 years later I give you this release.   

This is a service release with a lot of small changes but also a new feature with the table renderer and my view on doc/accessibility.

## [1.2.3] - 2019-12-05

* [Release notes](folder/doc/release/v1v2v3/release_v1v2v3.md)
* [Github release notes](https://github.com/peterlembke/infohub/releases/tag/v1.2.3)

## [1.2.2] - 2019-11-14
Service worker update.
 
* [Release notes](folder/doc/release/v1v2v2/release_v1v2v2.md)
* [Github release notes](https://github.com/peterlembke/infohub/releases/tag/v1.2.2)

## [1.2.1] - 2019-11-01
Translate icon titles and descriptions.
 
* [Release notes](folder/doc/release/v1v2v1/release_v1v2v1.md)
* [Github release notes](https://github.com/peterlembke/infohub/releases/tag/v1.2.1)

## [1.2.0] - 2019-10-28
Translations.
 
* [Release notes](folder/doc/release/v1v2v0/release_v1v2v0.md)
* [Github release notes](https://github.com/peterlembke/infohub/releases/tag/v1.2.0)

## [1.1.0] - 2019-10-24
First public release.

* [Release notes](folder/doc/release/v1v1v0/release_v1v1v0.md)
* [Github release notes](https://github.com/peterlembke/infohub/releases/tag/v1.1.0)
