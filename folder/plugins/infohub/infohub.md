# Infohub
You are now among the plugins and in the Infohub domain. Here you will find the core plugins and the main supporting plugins that are part if the infohub system.
There is a mix of PHP server side plugins and Javascript browser plugins.

## Core plugins
You need at least the core plugins to start a minimal Infohub core.

The core plugins are:
* infohub_base
* infohub_cache
* infohub_exchange
* infohub_plugin
* infohub_transfer
They are started by folder/include/start.js

If you want to create a new Infohub core in another language then start with these five core plugins.

## Support plugins
In folder/include/start.js you find a list with support plugins that are needed to start up the rest of the Infohub system on the browser.

The support plugins list can change. 
* infohub_asset - The image and icon system
* infohub_compress
* infohub_compress_gzip
* infohub_configlocal
* infohub_keyboard
* infohub_launcher - GUI for launching plugins 
* infohub_offline
* infohub_render - The GUI rendering system
* infohub_render_common
* infohub_render_form
* infohub_render_link
* infohub_render_text
* infohub_renderform
* infohub_rendermajor
* infohub_storage - The data storage system
* infohub_storage_data
* infohub_storage_data_idbkeyval
* infohub_tabs
* infohub_translate - Translation system
* infohub_view - GUI system with boxes. Owns the DOM
* infohub_workbench - GUI, the main GUI that calls plugin GUIs.

### GUI
infohub_workbench is the main GUI that show the main boxes and starts infohub_launcher.
infohub_launcher is a plugin with a GUI that can start other plugins that has a GUI.

### Assets
infohub_asset handle download of images, icons, launch information and possible other media in the future.
Also handle licenses for the media.

### Render
The render system is purely Javascript and renders HTML.
infohub_render is the main renderer. Everything that start with render relay on infohub_render. 
infohub_render relay on infohub_view, who is the only plugin that can modify the DOM.
infohub_tabs is also a renderer.

### Storage
Infohub support many backend storage solutions but all your storage needs go trough infohub_storage.

### Localization
infohub_translate handle translations. It is also a GUI for handling translation files.

### Compress and Encrypt
Compression and later also Encryption are there if you need them before you send data to another node or save data in Storage.

### Offline
This plugin prepare you for working offline with your browser. You can download all plugins, all documentation, all assets.
You can also see if you have an internet connection or not.
Your plugin can also subscribe to a message that comes when you go offline or online.

### Keyboard
Your plugin can subscribe to keyboard combinations. The plugin has a GUI where you can see the subscribers.

### Configuration
The configuration are handled in infohub_config. It has a GUI and you can pick your languages, set zoom level and font size.

## Other systems
Other systems that are good to have but not vital for running Infohub. 

### Login and sessions
There is a system for defining rights (infohub_contact), logging in persons and other servers (infohub_contact) and keep track of their presence (infohub_session).
* infohub_contact
* infohub_login
* infohub_session
These could have been labeled "support plugins" but you can run infohub without them.
 
### Documentation
All documentation is written in Markdown but a slightly simplified modified version.
The documentation system depend on these plugins:
* infohub_doc
* infohub_renderdocument
And you can also download documents with infohub_offline.

### Callbacks
The world as we know it is not filled with Infohub servers that politely login to another node to communicate.
Instead you see servers doing REST calls directly to a URL.
With infohub_callback you can set up URLs and get data on them. The data are put in a message and sent into the infohub system.  
* infohub_callback

### Features
Plugins that add features to Infohub but are not a system by its own. 
* infohub_checksum
* infohub_random
* infohub_standalone
* infohub_storagemanager
* infohub_template
* infohub_time
* infohub_tools
* infohub_uuid
* infohub_validate
* infohub_welcome

# License
This documentation is copyright (C) 2016 Peter Lembke.  
Permission is granted to copy, distribute and/or modify this document under the terms of the GNU Free Documentation License, Version 1.3 or any later version published by the Free Software Foundation; with no Invariant Sections, no Front-Cover Texts, and no Back-Cover Texts.  
You should have received a copy of the GNU Free Documentation License along with this documentation. If not, see [https://www.gnu.org/licenses/](https://www.gnu.org/licenses/).  

Updated 2019-10-17 by Peter Lembke  
Created 2016-04-02 by Peter Lembke  
