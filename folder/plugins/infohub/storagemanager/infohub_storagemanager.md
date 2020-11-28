# Infohub Storagemanager
The assistant to Infohub_Storage  

# Introduction
Only users that are members of the administrators group are allowed to use this plugin.  
When you want to store data in other tables/database engines than the main one, then you need to store connections to those servers/tables into the main database. Infohub_Storagemanager is the only plugin that are allowed to stores those connections.  
You can read more about Storage here [Infohub_Storage](plugin,infohub_storage) and see a demo here [Infohub_Demo_Storage](plugin,infohub_demo_storage)  
StorageManager can also ask infohub_file to read binary files and then store them in Storages that a specific plugin can read.  

# Configuration file
Infohub_Storage use a configuration file with connection data to the main database table. With Infohub_Storagemanager you can instruct Infohub_Storage to save data in the config file.  
Only this plugin are allowed to write data to path "config" in Infohub_Storage.  
You have these functions for the configuration: 'read_config', 'write_config', 'delete_config'  

# Connection
You have two functions for connections: 'read_connection', 'write_connection'  
All connections are saved under this path: 'infohub_storagemanager/connection/{plugin_name}'  

# Binary files
If your plugin ask Infohub_StorageManager (SM) to run function read_file() then it will take your plugin name and send it to infohub file. Infohub file will then check if there is a folder with your plugin name and start reading the binary files there.  
SM will get an array with all meta data found about the files and start saving the data in a Storage under your plugin name.  
SM save the data in any storage-path you want, but your plugin name must be in that path. SM delete the binary files when it got affirmation that a file is saved in the database.  
 
# License
This documentation is copyright (C) 2016 Peter Lembke.  
Permission is granted to copy, distribute and/or modify this document under the terms of the GNU Free Documentation License, Version 1.3 or any later version published by the Free Software Foundation; with no Invariant Sections, no Front-Cover Texts, and no Back-Cover Texts.  
You should have received a copy of the GNU Free Documentation License along with this documentation. If not, see [https://www.gnu.org/licenses/](https://www.gnu.org/licenses/).  SPDX-License-Identifier: GFDL-1.3-or-later  

Created 2016-12-21 by Peter Lembke  
Updated 2017-07-26 by Peter Lembke  
