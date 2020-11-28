# Infohub Tree
Handle all private data. 

## Version
Shows version information for the parent plugin and all child plugins.

## Doc
Shows buttons to view all documentation in this plugin.

## Encrypt
GUI where you can select your encryption file.  
Used only by Storage

## Storage
Load/save data to local Storage and server Storage.  
Uses __Encrypt__ before save and after load.  

Used by __manage__, __restore__, __backup__, and by the parent __infohub_tree__.

## Backup
Here you can select all or part of your data and download it in files to your computer.
You can download the data encrypted or in plain text.

## Restore
Here you select data files you want to restore. Files you have created with __Backup__.

You can import files that are encrypted or in plain text.

## Infohub Tree
Other plugins can use Infohub Tree to read/write personal data with the same syntax as the Storage uses.

* read
* write
* read_many
* write_many
* read_pattern
* write_pattern

The path will be: infohub_tree_storage/{user_name}/other_plugin/{whatever the other plugin wants}

The other plugin give a path like: {whatever the other plugin wants}
and we add `infohub_tree_storage/{user_name}/other_plugin/` to the path.

We will configure so infohub_tree_storage get its own database. Then each table will be the user_name and each user has its data in each table.

## Required functions
Each tree plugin must implement two rendering functions

* view - Renders data for a path. Three sizes. small, medium, large. 
    * Small - to be used in lists. 
    * Medium - to be used when you show badges. 
    * Large - with all data you want to show. 
* edit - To edit data for an existing path. All fields.

And in addition to that they also need to have a full GUI and use their own rendering functions view and edit.

## License
This documentation is copyright (C) 2020 Peter Lembke.  
Permission is granted to copy, distribute and/or modify this document under the terms of the GNU Free Documentation License, Version 1.3 or any later version published by the Free Software Foundation; with no Invariant Sections, no Front-Cover Texts, and no Back-Cover Texts.  
You should have received a copy of the GNU Free Documentation License along with this documentation. If not, see [https://www.gnu.org/licenses/](https://www.gnu.org/licenses/).

Created 2020-07-25 by Peter Lembke  
Updated 2020-08-25 by Peter Lembke
