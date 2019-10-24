# v1.0.0- PHP Core

The first version ever. The release was for myself to mark a milestone that the PHP Core is working.  
I did not make this release public.

# Introduction
Core PHP is the bare bone code that is the minimum you need to start writing your own plugins in php.  

# Files
infohub.php - the file that receive your request.  
define_folders.php - make sure you have the right folder structure. Used by infohub.php  
folder/include/kick_out_tests.php - If your request do not fulfill these rules then you are kicked out. Used by infohub.php  
folder/include/settings_and_errors.php - Handles exceptions and errors. Used by infohub.php  

# Callback
The callback system was designed to receive callbacks from payment services. But it has also proven to be a good tool for easy input to the infohub system.  
Callback are included i this release for your convenience when you want to trigger the documentation and the demos.  
.htaccess - Instruct the Apache web server that all URLs that do not go to infohub.php will end up in callback.php  
callback.php - this file just start the plugin infohub_callback and echo the response from that plugin.  

# Plugins
infohub_base - The base class that ALL plugins are extended from.  
infohub_exchange - Handles messages between plugins.  
infohub_transfer - Transfers data in and out from this node.  
infohub_plugin - Loads and starts plugins.  
infohub_template - Your bare bone plugin that you can copy and make your own plugins from.  
infohub_callback - Convert url requests into messages that infohub can understand  
infohub_doc - Documentation viewer. All plugins have a documentation that you can study.  
infohub_demo - Demo code that you can study.  
infohub_callback - verifies the message and uses cURL to call infohub.php. Now your data comes into the system the proper way.  

# Demo
The demo plugin and the documentation will show you how to do common things like creating a plugin, making a subcall within the plugin and making subcalls to other plugins.  
You will also be able to debug and see what happens in the plugins.  

# License
This documentation is copyright (C) 2016 Peter Lembke.  
Permission is granted to copy, distribute and/or modify this document under the terms of the GNU Free Documentation License, Version 1.3 or any later version published by the Free Software Foundation; with no Invariant Sections, no Front-Cover Texts, and no Back-Cover Texts.  
You should have received a copy of the GNU Free Documentation License along with this documentation. If not, see [https://www.gnu.org/licenses/](https://www.gnu.org/licenses/).  

Updated 2016-03-31 by Peter Lembke  
Created 2016-03-31 by Peter Lembke  
