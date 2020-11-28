# Infohub Tree Sync
Sync data between the browser Storage and the server Storage. If in doubt then the GUI will ask the human what version to keep.

## Information
Infohub_Tree_Storage keep an index for each plugin with path, old checksum, new checksum, status.

status = new, changed, deleted, synced

The server has the same kind of index for each plugin, for each user.

The Sync can ask the client and the server for one or more of these indexes.  
Sync can then take a decision.

* Keep - Client and Server already have the same data - we skip this item.
* Upload - The client has a newer version based on the server version. Or it is missing on the server.
* Download - The server has a newer version based on the client version. Or it is missing on the client.
* Conflict - The versions are not based on each other. A human need to help out here.

Sync add the decision to three lists: upload, download, conflict.

Button to run the list "upload" and then delete the handled items list.   
Button to run the list "download" and then delete the handled items on list.  

You need to fix the list "conflict" trough the GUI yourself. When you fix an item it is removed from the list.

## GUI
This plugin has a GUI.

* Button "Sync" - start a sync with the Server.
* sync decision progress bar - value = how many plugins have been handled. max = number of Tree plugins.

* Area with list items count
    * Number of items on the upload list
    * Number of items on the download list
    * Number of items on the conflict list

* Button "Upload" - handles the upload list
* Upload progress bar - max = number of items on the upload list when starting. value = number of items handled.

* Button "Download" - handles the download list
* Download progress bar - max = number of items on the download list when starting. value = number of items handled.

* Button "Refresh conflict list" - Updates the list with all paths that are in conflict
* conflict_list - Shows max 20 conflicting paths

* Show Local copy - form rendered by the plugin that handle that tyupe of data
* Button "Keep local copy"

* Show Server copy - form rendered by the plugin that handle that tyupe of data
* Button "Keep server copy"

## Public functions

* click_sync
* click_refresh_conflict_list
* click_conflict_list
* click_keep_local_copy
* click_keep_server_copy

## License
This documentation is copyright (C) 2020 Peter Lembke.
 Permission is granted to copy, distribute and/or modify this document under the terms of the GNU Free Documentation License, Version 1.3 or any later version published by the Free Software Foundation; with no Invariant Sections, no Front-Cover Texts, and no Back-Cover Texts.
 You should have received a copy of the GNU Free Documentation License along with this documentation. If not, see [https://www.gnu.org/licenses/](https://www.gnu.org/licenses/).

## footer
Created 2020-07-25 by Peter Lembke  
Updated 2020-08-30 by Peter Lembke
