# Core
InfoHub Core are the bare-bone set up needed to run InfoHub on the web server and in the browser.
  
# Introduction
You can download a core for your favourite programming language, copy a plugin template and fill it with code.  
You do not have to learn a new language. You can work together with other programmers, and they bring their languages to the project.  
The core handle all traffic between plugins and nodes (cores) in a loosely coupled manner.  

# Cores
I have developed a core for PHP [core-php](main,core_php), it is in the first release, and I have created one for JavaScript (core-js), it will be in a later release. It runs in the web browser, and you can create offline applications.  
I would like to see cores for other programming languages and systems. I am fond of solutions that can run on several systems, like PHP, Javascript, Ruby, Python, Java.  
A core in ANSI-C that can be compiled to different systems would also be practical. Or a Swift core. Swift exist for Linux and macOS. Kotlin is also interesting.  

## Other Cores - ["There is another system"](https://en.wikipedia.org/wiki/Colossus:_The_Forbin_Project)
The InfoHub Core can be implemented in any language.
The PHP/JS cores are template implementations how the systems work. If you implement an InfoHub core in another language you might have to modify the systems to suite that platform. The important thing is that as a developer you can recognize the inner workings of the system when you jump between implementations.

The core concepts are:

* Level 1
    * Communication between nodes in the InfoHub format
    * Kick out tests
* Level 2
    * Message queues system
    * Plugin system
* Level 3 - Pick what you need
    * Login and sessions
    * Storage system
    * Rendering system for Graphical User Interface

You could have a static software that implement Level 1 so other InfoHub cores can communicate with it.
You could implement Level 2 so other developers more easily can get started with the core and write plugins.
You could implement what you need from Level 3. An internet service core, like the PHP core is, could need the storage system and log in & sessions but do not need a GUI.
A Python Core that aim to be a desktop solution might implement all levels.
A Node Core that aim to be a service only need Level 1 and perhaps Level 2.

# Root files
The files you can find in the InfoHub root folder.  
- [.htaccess](main,core_root_htaccess) - Restricts browser access
- [cache.manifest](main,core_root_cachemanifest) - Enables offline use in the browser
- [define_folders.php](main,core_root_definefolders) - Aliases to all used folders
- [index.php](main,core_root_index) - Starts the core on the client
- [infohub.php](main,core_root_infohub) - Starts the core on the server
[infohub.php](main,core_root_infohub)

# Core plugins
The plugins that build up the bare-bone core  
- [Base](plugin,infohub_base) - Base class are inherited by all plugins
- [Exchange](plugin,infohub_exchange) - Message queuing. This is the main plugin that keeps track of the other plugins.
- [Transfer](plugin,infohub_transfer) - Client communicate with the server. The server communicate with Client and other servers.
- [Plugin](plugin,infohub_plugin) - Handles request to start a plugin. It finds the plugin and starts it.

# License
This documentation is copyright (C) 2016 Peter Lembke.  
Permission is granted to copy, distribute and/or modify this document under the terms of the GNU Free Documentation License, Version 1.3 or any later version published by the Free Software Foundation; with no Invariant Sections, no Front-Cover Texts, and no Back-Cover Texts.  
You should have received a copy of the GNU Free Documentation License along with this documentation. If not, see [https://www.gnu.org/licenses/](https://www.gnu.org/licenses/).  SPDX-License-Identifier: GFDL-1.3-or-later  

Created 2016-03-31 by Peter Lembke  
