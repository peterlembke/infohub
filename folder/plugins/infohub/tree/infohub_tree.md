# InfoHub Tree

Handle all private data. Makes sure it gets encrypted and synced to the server. You can back up/restore your data.

## Version

Shows version information for the parent plugin and all child plugins.

## Doc

Show buttons to view all documentation in this plugin.

## Encrypt

GUI where you can manage your encryption file that will be used to encrypt/decrypt your data. Single point
encrypt/decrypt.

Used only by Storage.

## Storage

Load/save data to local Storage.

Uses: __Encrypt__ always before save and optionally after load.  
Storage is used by: __Sync__, __Restore__, __Backup__, and by the parent __infohub_tree__.

## Sync

The __Sync__ handle synchronisation of local data to/from the server. Only locally stored encrypted data are synced to
the server.

Uses: __Storage__. Is not used by anyone.

## Backup

Here you can select all or part of your locally stored data and download it in files to your computer. You can download
the data encrypted or in plain text.

Only local data will be backed up.  
Uses: __Storage. Is not used by anyone.

## Restore

Here you select data files you want to restore. Files you have created with __Backup__.

You can import files that are encrypted or in plain text. Data will be restored to local storage.

Uses: __Storage. Is not used by anyone.

## InfoHub Tree (client)

Other client plugins can use InfoHub Tree to read/write personal data with the same syntax as the Storage uses.

* read
* write
* read_many
* write_many
* read_pattern
* write_pattern

The path will be: infohub_tree_storage/{user_name}/other_plugin/{whatever the other plugin wants}

The other plugin give a path like: {whatever the other plugin wants} and we
add `infohub_tree_storage/{user_name}/other_plugin/` to the path.

## InfoHub Tree (server)

The infohub_tree (server) handle sync and storage.

We will configure so infohub_tree get its own database. A user get its own table. The table name is the username. In
this table the user store the personal encrypted data.

If one table is not enough for the user data then we could configure so infohub_tree get one database for each user.   
The tables in the database are the client plugin names that use the data for the user.

## Tree usage

A client plugin that handle personal data use the Tree to store the data and ask for the data.  
By using the Tree the client plugin do not have to care about encryption, storage, sync to the server, backup/restore.
That is handled by the Tree.

Another benefit is that backup can be on all data stored with the Tree. Then it is easier to take backup.

## License

This documentation is copyright (C) 2020 Peter Lembke.  
Permission is granted to copy, distribute and/or modify this document under the terms of the GNU Free Documentation
License, Version 1.3 or any later version published by the Free Software Foundation; with no Invariant Sections, no
Front-Cover Texts, and no Back-Cover Texts.  
You should have received a copy of the GNU Free Documentation License along with this documentation. If not,
see [https://www.gnu.org/licenses/](https://www.gnu.org/licenses/).

Created 2020-07-25 by Peter Lembke  
Updated 2021-02-12 by Peter Lembke
