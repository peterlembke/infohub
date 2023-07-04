# InfoHub Tree Sync

Sync data between the browser local Storage and the server Storage. If in doubt then the GUI will ask the human what
version to keep.

## Information

InfoHub_Tree_Storage keep a path_index in browser local Storage for each plugin.   
The index contain:
path, current_checksum, server_checksum, updated_at, synced_at, delete

The local Sync can ask the local Tree Storage and the server Tree for one of these plugin path indexes.  
Local Sync can then take a decision on each path.

* Keep - Client and Server already have the same checksum - we skip this item.
* Upload - The path is missing on the server
* Upload - The server_checksum match, the local_checksum is different.
* Delete - The server_checksum match, locally marked for deletion.
* Conflict - The server_checksum do not match, the local_checksum is different. A human need to help out here.
* Conflict - The server_checksum do not match, locally marked for deletion. A human need to help out here.
* Download - The local server_checksum = local_checksum (data have never changed locally), server has a different
  checksum

We can also ask Sync to download missing paths.

## GUI

This plugin has a GUI.

* Button "Review" - start a review of what need to be done. Walk through the list of plugin index Show a progress bar
  value = how many plugin index have been handled. max = number of plugin index that we will handle. Walk through all the
  plugin index lists and make action lists what to do before starting the sync.

* Show items count based on all plugin indexes Number of items to: keep, upload, delete, conflict, download, missing
  Click on an action title to see the list of paths. Click on a path to see the data if available.

If you view a conflict list you will see both the local and the server version of the data, and you can pick one of them.

- If you click to keep the server version then it is immediately overwriting the local version.
- If you click to keep the local version then it is immediately overwriting the server version.

* Button "Upload" - handles the upload-list and shows a progress bar.
* Button "Delete" - handles the delete-list and shows a progress bar.
* Button "Download" - handles the download list and shows a progress bar.
* Button "Download missing" - handles the download missing list and shows a progress bar.

## Public functions

* click_review
* click_action_title
* click_path
* click_sync_upload
* click_sync_delete
* click_sync_download
* click_sync_delete_missing
* click_keep_this_version

## Private functions

* getServerPluginIndex($pluginName)
* getLocalPluginIndex($pluginName)
* review($localPluginIndex, $serverPluginIndex)
* sync($pluginName, $syncType, $syncDataArray)

## License

This documentation is copyright (C) 2020 Peter Lembke. Permission is granted to copy, distribute and/or modify this
document under the terms of the GNU Free Documentation License, Version 1.3 or any later version published by the Free
Software Foundation; with no Invariant Sections, no Front-Cover Texts, and no Back-Cover Texts. You should have received
a copy of the GNU Free Documentation License along with this documentation. If not,
see [https://www.gnu.org/licenses/](https://www.gnu.org/licenses/).

## footer

Created 2020-07-25 by Peter Lembke  
Updated 2021-02-14 by Peter Lembke
