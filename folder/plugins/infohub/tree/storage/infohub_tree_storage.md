# Infohub Tree Storage

Handle the storage of the personal data to browser Storage. Makes sure all data are encrypted before stored. Makes sure
data get decrypted after read if you want it to be.

infohub_tree_storage is used by Backup/Restore/Sync/Tree. infohub_tree_storage is the only plugin that uses
infohub_tree_encrypt.

Does not handle sync of data to the server. That is a job for infohub_tree_sync.

Used by Tree, Backup, Restore, Sync Uses: Encrypt

## GUI

This plugin has no GUI.

## Public functions

    'read': 'normal', // Read one item from local storage
    'write': 'normal', // Write to one item in local storage
    'get_plugin_list': 'normal', // Get a list with all existing plugin_indexes
    'get_plugin_index': 'normal', // Get one plugin_index

## write

* When Tree save plain data to local Storage it will be encrypted by Storage before stored in local storage.
* When Restore, Sync save plain data to local Storage it will be rejected.
* When saving encrypted data to local Storage it will be stored as it is. (Restore, Sync, Tree)

## read

* When reading data from local Storage it will be delivered encrypted (Sync, Backup).
* Only decrypts the data if it is Tree that ask for the data and want it decrypted.
* If Tree request data that do not exist in local Storage then we ask Sync for the data.
* If Backup, Restore, Sync request data do not exist in local Storage then we say no data.

## get_plugin_list

You get an array with all plugin names that has a plugin_index.

## get_plugin_index

Give a plugin_name, and you get an object with paths that have been saved by the plugin.  
The plugin_index are managed by Storage. The plugin_index are used by Storage, Backup, Restore, Sync.

## The plugin index

Purpose of the index is to help Sync when it is time to sync data to the server. And to help restore when it is time to
restore data to the storage.

Storage operate in your browser and only handle your data.  
Storage handle one index for each plugin that use Tree for storing data.  
A tree-plugin-list has the path to the item stored. The current_checksum, server_checksum.

When a path is added/deleted/updated then the index is updated.

File format for a plugin index. Path: infohub_tree/{user_id}/infohub_weight/index

```json5
{
    "{hub_id1}": {"server_checksum": "234123", "local_checksum": "123456", "remove":  "true"},
    "{hub_id2}": {"server_checksum": "234123", "local_checksum": "123456"}
}
```

If both checksums are equal it means that you have not saved any changes locally, or you have successfully synced your
version with the server. If the checksums are different, then you have stored a change locally and that need to be synced
to the server.

### Add

If a path do not exist in the index then it is added. The local_checksum is calculated. The known_server_checksum is
empty.

### Delete locally

Remove the path from the index.

### Delete

If server_checksum is empty then the path is removed. If server_checksum has data then the path is marked for removal.

### Update

If a path exist in the index then it is updated. The local_checksum is calculated. The server_checksum is untouched.

## Read

When you read an existing path from local Storage then you get the data + current checksum, if data exist locally. If
the path do not exist then Storage ask Sync for help. Sync will either return the data or say that it does not exist on
the server or that we are offline and sync can not check.

## Write

When you store data for a path then you must provide the previous local_checksum or an empty checksum for new paths. The
local Storage are read, and the checksum are compared. Then the new data and new current_checksum are written.

## get_plugin_list

Function used by Sync to get a list with all plugin indexes that Sync can ask for. The list are updated by Storage when
the write function are used.

## get_plugin_index

Function used by Sync to get one plugin index. The index is used by Sync to send the right data to the server. The
plugin index are updated by Storage when the write function are used. Storage save data like:
path, current_checksum, server_checksum, updated_at, synced_at, delete

## License

This documentation is copyright (C) 2020 Peter Lembke. Permission is granted to copy, distribute and/or modify this
document under the terms of the GNU Free Documentation License, Version 1.3 or any later version published by the Free
Software Foundation; with no Invariant Sections, no Front-Cover Texts, and no Back-Cover Texts. You should have received
a copy of the GNU Free Documentation License along with this documentation. If not,
see [https://www.gnu.org/licenses/](https://www.gnu.org/licenses/).

## footer

Created 2020-07-25 by Peter Lembke  
Updated 2021-02-17 by Peter Lembke
