# Infohub
You are now among the plugins and in the Infohub domain. Here you will find the core plugins and the main supporting plugins that are part if the infohub system.
There is a mix of PHP server side plugins and Javascript browser plugins.

## Core plugins
You need at least the core plugins to start a minimal Infohub core.

The core plugins are:
* [infohub_base](plugin,infohub_base)
* [infohub_cache](plugin,infohub_cache)
* [infohub_exchange](plugin,infohub_exchange)
* [infohub_plugin](plugin,infohub_plugin)
* [infohub_transfer](plugin,infohub_transfer)

They are started by [folder/include/start.js](main,core_include_start)

If you want to create a new Infohub core in another language then start with these five core plugins.

## Support plugins
In [folder/include/start.js](main,core_include_start) you find a list with support plugins that are needed to start up the rest of the Infohub system on the browser.

The support plugins list can change. 
* [infohub_asset](plugin,infohub_asset) - The image and icon system
* [infohub_compress](plugin,infohub_compress)
* [infohub_compress_gzip](plugin,infohub_compress_gzip)
* [infohub_configlocal](plugin,infohub_configlocal)
* [infohub_keyboard](plugin,infohub_keyboard)
* [infohub_launcher](plugin,infohub_launcher) - GUI for launching plugins 
* [infohub_offline](plugin,infohub_offline) - Prepare your data for offline
* [infohub_render](plugin,infohub_render) - The GUI rendering system
* [infohub_render_common](plugin,infohub_render_common)
* [infohub_render_form](plugin,infohub_render_form)
* [infohub_render_link](plugin,infohub_render_link)
* [infohub_render_text](plugin,infohub_render_text)
* [infohub_renderform](plugin,infohub_renderform)
* [infohub_rendermajor](plugin,infohub_rendermajor)
* [infohub_storage](plugin,infohub_storage) - The data storage system
* [infohub_storage_data](plugin,infohub_storage_data)
* [infohub_storage_data_idbkeyval](plugin,infohub_storage_data_idbkeyval)
* [infohub_tabs](plugin,infohub_tabs)
* [infohub_translate](plugin,infohub_translate) - Translation system
* [infohub_view](plugin,infohub_view) - GUI system with boxes. Owns the DOM
* [infohub_workbench](plugin,infohub_workbench) - GUI, the main GUI that calls plugin GUIs.

### GUI
[infohub_workbench](plugin,infohub_workbench) is the main GUI that show the main boxes and starts [infohub_launcher](plugin,infohub_launcher).
infohub_launcher is a plugin with a GUI that can start other plugins that has a GUI.

### Assets
[infohub_asset](plugin,infohub_asset) handle download of images, icons, launch information and possible other media in the future.
Also handle licenses for the media. A GUI where you can see used assets and their license information.

### Render
The render system is purely Javascript and renders HTML.
[infohub_render](plugin,infohub_render) is the main renderer. Everything that start with render relay on infohub_render. 
infohub_render relay on [infohub_view](plugin,infohub_view), who is the only plugin that can modify the DOM.
[infohub_tabs](plugin,infohub_tabs) is also a renderer.

### Storage
Infohub support many backend storage solutions but all your storage need to go trough [infohub_storage](plugin,infohub_storage).

### Localization
[infohub_translate](plugin,infohub_translate) handle translations. It is also a GUI for handling translation files.

### Compress and Encrypt
Compression and later also Encryption are there if you need them before you send data to another node or save data in Storage.

### Offline
The [infohub_offline](plugin,infohub_offline) plugin prepare you for working offline with your browser. You can download all plugins, all documentation, all assets.
You can also see if you have an internet connection or not.
Your plugin can also subscribe to a message that comes when you go offline or online.

### Keyboard
Use [infohub_keyboard](plugin,infohub_keyboard) to subscribe to keyboard combinations. The plugin has a GUI where you can see the subscribers.

### Configuration
The configuration are handled in [infohub_configlocal](plugin,infohub_configlocal). It has a GUI and you can pick your languages, set zoom level and font size.

## Other systems
Other systems that are good to have but not vital for running Infohub. 

### Login and sessions
There is a system for defining rights (infohub_contact), logging in persons and other servers (infohub_contact) and keep track of their presence (infohub_session).
* [infohub_contact](plugin,infohub_contact)
* [infohub_login](plugin,infohub_login)
* [infohub_session](plugin,infohub_session)
These could have been labeled "support plugins" but you can run infohub without them.
 
### Documentation
All documentation is written in Markdown but a slightly simplified modified version.
The documentation system depend on these plugins:
* [infohub_doc](plugin,infohub_doc) - Find and view documents here 
* [infohub_renderdocument](plugin,infohub_renderdocument) - Renders the document
And you can also download documents with infohub_offline.

### Callbacks
The world as we know it is not filled with Infohub servers that politely login to another node to communicate.
Instead you see servers doing REST calls directly to a URL.
With infohub_callback you can set up URLs and get data on them. The data are put in a message and sent into the infohub system.  
* [infohub_callback](plugin,infohub_callback)

### Features
Plugins that add features to Infohub but are not a system by its own. 
* [infohub_checksum](plugin,infohub_checksum)
* [infohub_random](plugin,infohub_random)
* [infohub_standalone](plugin,infohub_standalone)
* [infohub_storagemanager](plugin,infohub_storagemanager)
* [infohub_template](plugin,infohub_template)
* [infohub_time](plugin,infohub_time)
* [infohub_tools](plugin,infohub_tools)
* [infohub_uuid](plugin,infohub_uuid)
* [infohub_validate](plugin,infohub_validate) - Validate data
* [infohub_welcome](plugin,infohub_welcome) - Demo to welcome you and introduce Infohub 

# License
This documentation is copyright (C) 2016 Peter Lembke.  
Permission is granted to copy, distribute and/or modify this document under the terms of the GNU Free Documentation License, Version 1.3 or any later version published by the Free Software Foundation; with no Invariant Sections, no Front-Cover Texts, and no Back-Cover Texts.  
You should have received a copy of the GNU Free Documentation License along with this documentation. If not, see [https://www.gnu.org/licenses/](https://www.gnu.org/licenses/).  SPDX-License-Identifier: GFDL-1.3-or-later  

Updated 2019-10-17 by Peter Lembke  
Created 2016-04-02 by Peter Lembke  
