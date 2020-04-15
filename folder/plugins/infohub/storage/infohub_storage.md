# Infohub Storage
Where all data is stored  

# Introduction
All data are stored in Storage. Storage supports different storage solutions as child plugins.  
The data are stored as key-value data and you can store any data.  
There is a [Storage Demo](plugin,infohub_demo_storage) where you can see how it works.  

# Path
The path is where you can write/read/delete/search data.  
A path is a string that looks like this "plugin_name/whatever/you/like/and/so/on". You can continue the path as deep as you want.  
You can read more about paths here [Storage Data](plugin,infohub_storage_data)  
The plugin_name is the name of the level 1 plugin that stores the data. The plugin_name is used as the table name in a database.  
You can also use * in the path. When you read you get data from all matching paths. When you write then the data are stored in all matching paths.  

## Write data
Give a string path and the array data to write.  
You can read more about writing data here [Storage Data](plugin,infohub_storage_data)  

## Delete data
Use the write function to delete data by Give a string path and an empty array to write.  
You can read more about deleting data here [Storage Data](plugin,infohub_storage_data)  

## Read data
The path will be read and an array will be delivered to you.  
You can read more about reading data here [Storage Data](plugin,infohub_storage_data)  

## Read many paths
With the normal read function you can read a path or a path with a pattern. With read_many you can read many different paths at once.  
The answer is an array with the answers from multiple read.  

## Write many paths
With the normal write function you can write to one path or to a path with a pattern. With write_many you can write to many different paths at once.  
The answer is an array with the answers from multiple writes.  

# Index data and search
If you want your data to be indexed then you have top do this yourself by sending the data to infohub_index. This feature is not provided by storage.  
You can read more about indexing here [Index](plugin,infohub_index)  

# Data Security
There are some security features built in.  

- Protected node. Only level 1 plugins on the same node are allowed to send messages to Storage
- Protected connections. Only storagemanager are allowed to manage sensitive data about database server connections
- Protected paths. It is up to the plugin that want to save data to give a path. That path can be a checksum. That makes pattern search impossible but is more secure.
- Separated data. Each plugin have its own table where it stores all its data as key-value.
- Protected data. Only the plugin that saved the data will be able to read/update/delete the data. All other plugins will be refused
- Encryption. Each plugin can use single point encryption/decryption on its data before sending the data to Storage.
- Access rights. General access rights apply on the whole system.
- Data manipulation detection with salted checksums.

## Protected paths
If you want to store data more secure you should use checksums instead of paths in your plugin. If you do then it is not possible to use pattern search.  
With plain text paths like my/secret/document then it is easy to figure out where your secret document is stored. If you instead run that path trough a checksum generator and use the checksum as path, then it is much harder for an intruder.  
    
## Protected data
Only the plugin that saved the data will be able to read/update/delete the data. All other plugins will be refused.  
The path start with the plugin name. The plugin name is an alias for a server, database, table. The table name must be the same as the plugin name.  
    
## Encryption
You should encrypt your data before sending it to Storage. The encryption string can be in your plugin configuration.  
    
## Access rights
Access rights are not part of Storage, they are part of InfoHub in general.  
Each user is logged in (user_id) and are a member of one or more groups (group_id). Each group have a member list and a list with plugins they are allowed to use in the node.  
The messages will only reach plugins that the logged in user is allowed to use.   
Then it is up to the plugin to segment the data. It might very well have its own list with more detailed rights.  
    
## Data manipulation detection
Salted checksums of the data are saved together with the data. If the data are decrypted then it can be stolen, but with the checksum it can at least not be manipulated without you knowing.  
You have a secret salt. You take your data and the salt and run everything trough a checksum function. The checksum are added to the data, you encrypt everything and store it in the Storage.  
Later you fetch your data. Decrypt the data. Take your sected salt and teh data, run it trough the checksum function and compare with the checksum. If anyone managed to decrypt your data and tried to manipulate the data, then the checksum will not match.  
    
# License
This documentation is copyright (C) 2016 Peter Lembke.  
Permission is granted to copy, distribute and/or modify this document under the terms of the GNU Free Documentation License, Version 1.3 or any later version published by the Free Software Foundation; with no Invariant Sections, no Front-Cover Texts, and no Back-Cover Texts.  
You should have received a copy of the GNU Free Documentation License along with this documentation. If not, see [https://www.gnu.org/licenses/](https://www.gnu.org/licenses/).  SPDX-License-Identifier: GFDL-1.3-or-later  

Created 2016-08-14 by Peter Lembke  
Updated 2018-09-28 by Peter Lembke  
