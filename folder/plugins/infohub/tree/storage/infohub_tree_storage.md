# Infohub Tree Storage
Handle the storage of the personal data to local Storage and server Storage.

## Introduction
Is the only plugin that uses infohub_tree_encrypt.

Used by the child plugins in this plugin to read/write data.

Used by the parent plugin to read/write data.

Uses infohub_tree_sync to trigger a sync of data.

__Storage__  
Always encrypts the data after if has been received from another module.
Always decrypts the data before it is returned to another module.
Internally in the plugin the data stays encrypted.

## GUI
This plugin has no GUI.

## Workings

## Download "path index"
You first need to download the "path index" for the plugin you want to work with and store it in local Storage.
Each user has its own path index for each plugin.
The user get a message that the "path index" need to be downloaded and can manually trigger the download.

Each path in the path index has the previous_checksum and the current_checksum.
Now you can read/add/update/delete paths for the plugin.

## Read path
When you read an existing path from local Storage then you get the data if it exist.
If the path do not exist locally then it is read from server Storage, handed to you and saved to local Storage in the background. The previous_checksum and the current_checksum might have changed on the server. If that is the case then the local "path index" are updated.

## Add new path
When you add a new path to local Storage the path is added to the local "path changed index".
The local "path changed index" has the previous_checksum (empty) and the current_checksum.

## Edit existing path
When you edit an existing path and save it to local Storage the path is added to the local "path changed index".
The local "path changed index" has the previous_checksum and the current_checksum.

## Delete path
When you delete an existing path and save it to local Storage the path is added to the local "path changed index".
The local "path changed index" has the previous_checksum and the current_checksum (empty).

## Undo change
When you undo a change then the path are removed from local Storage and from the local "path changed index".

The user always know what is in "path changed index" and can manually trigger a sync with the server.

## Sync with server
Send the "path changed index" to the server.

The server delete the paths it can delete.
where local current_checksum is empty and local previous_checksum = server current_checksum. 
The server "path index" keep the path with the local previous_checksum and current_checksum (empty) so we know it has been deleted. 
The server respond with a path list what paths it has deleted.

The server respond with a path list what paths it can update if you send the data.
where the local previous_checksum = server current_checksum.

The server respond with a path list what paths a human must handle.
where the local previous_checksum is not found on the server path.

### Client sync response
The client can update the local "path index" with all paths the server have deleted and remove them from the "path changed index".

The client can send a chunk with some of the data the server wanted.
The server will respond with a list what paths was updated and what paths a human must handle. 
You can remove the paths from "path changed index".

### Human interaction
The client can work trough the paths a human must handle by downloading data from the server.  
Show both the local data and the server data to the user.

* If the user chose the server version then remove the path from the human list and show an OK.
* If the user chose the local version then send the local version to the server for update. Set previous_checksum and current_checksum so the server will accept the version.
* If the user modify the local version and select that version then it is saved to local Storage and to server Storage with the previous_checksum and current_checksum so the server will accept the version.

## Functions - local

* download_path_index
    Download the path_changed_index for a plugin and save it in local storage.
    Overwriting the existing path_changed_index.
    Only downloads if "path_changed_index" is empty.
* write - Write to one path
    Use PGP encrypt.
    Write to local storage with short tail message
    Update the "paths changed list".
* read - Read from one path
    Read from local storage.
    Use PGP decrypt.
    If post exist then give data to user. 
    If post do not exist then read from server Storage.
    Give data to user 
    Save data to local Storage 
* undo_change - Remove a change
    Can be done if path is in "path changed index"
    Remove the path in "path changed index"
    Remove the local data
* get_path_changed_index
    Return the current "path changed index" for a plugin.
* send_path_changed_index
    Send the "path_changed_index" to the server.
    We will get back three lists.
    * What paths to delete locally
    * What paths the server can store if you give the data to the server
    * What paths have a conflict and need a human to compare
* delete - Delete one path locally
* send_one_path_data_to_server
    Send a path and its data to the server.
* get_human_compare_index
    Get the "human_compare_index", an array with paths for one plugin. 
* get_one_path_data_for_human_compare
    Give a path and get data from locally and from the server.
* get_path_index
    Get the path_index for one plugin. An array with all paths.
    
## Data

## License
This documentation is copyright (C) 2020 Peter Lembke.
 Permission is granted to copy, distribute and/or modify this document under the terms of the GNU Free Documentation License, Version 1.3 or any later version published by the Free Software Foundation; with no Invariant Sections, no Front-Cover Texts, and no Back-Cover Texts.
 You should have received a copy of the GNU Free Documentation License along with this documentation. If not, see [https://www.gnu.org/licenses/](https://www.gnu.org/licenses/).

## footer
Created 2020-07-25 by Peter Lembke  
Updated 2020-07-30 by Peter Lembke
