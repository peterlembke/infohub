# v1.1.0 - First public
This is the first public release of InfoHub.
* Date: 2019-10-24
* Released on Github

I started development 2010-01-01 and now almost 10 years later I show this code.

* [Release notes](folder/doc/release/v1v1v0/release_v1v1v0.md)
* [Github release notes](https://github.com/peterlembke/infohub/releases/tag/v1.1.0)

## Capabilities
With this release you can see how it works with the message flows, you can run the plugins on the server side and on the browser side.

You can see everything in action here: [infohub.se](https://www.infohub.se).

## Parts done in this release

###  PHP Core
The plugins needed to get an Infohub core started on the server.

### PHP Storage
- Simple key-value storage system that relay on a traditional database for storage. 
- Many common database engines supported like MySQL, PostgreSQL, SQLite
- Also support the Redis storage engine for permanent storage
- And storage to file is also supported. In cases where you can not install a database engine

### JS Core
- The plugins needed to get an Infohub core started in the browser.
- Infohub run on the most common browser in their latest versions: Firefox, Chrome (Chromium), Opera.
- probably work well in the new Microsoft Edge that is based on Chromium.
- I have not tested Safari as much ob MacOS and will do that. Infohub run smooth on iPhone and iPad.
- Infohub run smooth on browsers run from: Ubuntu, MacOS, Windows, IOS (iPhone, iPad) and Android.

### JS Storage
- Simple key-value storage that uses IndexedDb. Used for all data in the browser.
- There are three implementations in Infohub that store in the IndexedDb, I have selected the fasted to be used.
- The browsers all support IndexedDb and there are no viable alternatives to that.

### Translation system
- User interface where you can generate language files and a method to translate them.
- All plugins that has a graphical user interface also has an asset folder where translation files can be placed.

### Assets system
- handle icons, images, sound data AND their licenses.
- Downloads the assets you need and stores them in the browser Storage
- Very important that all assets have their own license files

### Documentation system
- A Doc viewer for the Markdown manual. 
- Each plugin also has documentation.
- I started with an XML like system but Markdown is much easier to learn and nicer to look at so now I use that.
- Some Markdown renderers are included but none are used for the documentation system. Instead I found that the Infohub rendering system could handle Markdown without assistance.

### JS rendering system
- All HTML are rendered in the browser. You can render things like Forms, Lists, text, images, frames and so on.
- Infohub_View owns the screen. All rendered data goes to View for display on the screen. View has a box system that makes the viw scale smoothly on all screen sizes and also prevent ID colissions.
- Advanced rendering exist - based on the simple components. Builds things like presentation boxes, tabs, menus, advanced lists, advanced forms.

### Workbench
- The graphical user interface you see when you start InfoHub. Here you can start plugins.

### Stand alone
- If you want a more traditional web page then run standalone - Start ONE workbench plugin so you can run it without Workbench. Use with a unique domain URL and set it up in config/infohub_exchange.json

### Callback
- System for handling of incoming requests and turn them into messages.
- Useful in the real world where internet is filled with REST requests and common callbacks.

## Planned parts
Things I plan for the next release.

### PHP Login (Working on it)
- Be able to login to a PHP node. serve incoming logins but also login to other nodes.

### JS Login (Working on it)
- Be able to login to the home server.

### PHP Plugin test system (Working on it)
- Automated tests created automatically from real live data. No more writing unit tests. They write them self.

### JS Plugin test system (Working on it)
- Automated tests created automatically from real live data.

### Offline
- Not fully covered yet.
- Need an upgrade strategy and some issues ironed out.

### Translations
- Not fully covered yet.
- Working on full coverage for English, Spanish, Swedish to start with for all GUI
- Will not translate the documentation but will give some example in Swedish how it can be done.

# License
This documentation is copyright (C) 2019 Peter Lembke.  
Permission is granted to copy, distribute and/or modify this document under the terms of the GNU Free Documentation License, Version 1.3 or any later version published by the Free Software Foundation; with no Invariant Sections, no Front-Cover Texts, and no Back-Cover Texts.  
You should have received a copy of the GNU Free Documentation License along with this documentation. If not, see [https://www.gnu.org/licenses/](https://www.gnu.org/licenses/).  SPDX-License-Identifier: GFDL-1.3-or-later  

Updated 2019-10-24 by Peter Lembke  
Created 2019-10-24 by Peter Lembke
