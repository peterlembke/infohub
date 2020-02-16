# Plugins - Installed
Here you can find documentation for all installed plugins. Each plugin must have its own Markdown documentation.

If you instead want to know how to make plugins then read here: [Make plugins](main,plugin). 

# Domains
In the plugin folder you find domain folders. Each plugin producer have their own domain. In a domain folder you find folders with plugin names.

A domain name is one single word/name with low case letters.

# Review the plugins you want to use
If you want to use a plugin in your system then you must review it first so you are sure there are no strange behaviours.  

Do ^^not^^ use the plugin code if:
- the code is encrypted/obscured so you can not read all code.
- the code uses another programming languages than the rest of the core.
- the code has named variables or functions that do not describe their contents and purpose.
- the code have a lot of comments - that means the code is poorly written.
- the flow in the functions is hard to understand.
- the documentation is bad then probably the plugin is too.
- the test file is missing.

# Two languages
In this distribution you have php plugins and javascript plugins. The web browser run javascript plugins and the server run the php plugins. The browser can not get hold of the javascript plugins without the help of the php plugins so they live a symbiotic relationship.

# Plugin type

- Core plugin
- Application plugin
- Support plugin

## Core plugin
The bare minimum to start Infohub. These plugins do not use any other plugins.  

Example: base, plugin, exchange, transfer

## Application plugin
Application plugins have its own graphical user interface and can be started from the workbench.  
If the plugin has the file asset/launcher.json then it is an application plugin.

Example: contact, demo, democall, language, welcome, workbench, launcher, tools, doc, offline.

## Support plugin
Plugins that can be used by other plugins and provide some service. The plugin has no graphical user interface.

If the plugin is not one of the core plugins and has no asset/launcher.json then it is a support plugin.

Example: asset, cache, callback, configlocal, render, session, storage, view, audio, file, markdown, password, random, renderadvancedlist, renderdocument, renderform, rendermajor, rendermenu, tabs, time, validate, uuid.

# License
This documentation is copyright (C) 2017 Peter Lembke.  
Permission is granted to copy, distribute and/or modify this document under the terms of the GNU Free Documentation License, Version 1.3 or any later version published by the Free Software Foundation; with no Invariant Sections, no Front-Cover Texts, and no Back-Cover Texts.  
You should have received a copy of the GNU Free Documentation License along with this documentation. If not, see [https://www.gnu.org/licenses/](https://www.gnu.org/licenses/).  

Since 2017-07-10 by Peter Lembke
Updated 2020-01-26 by Peter Lembke
