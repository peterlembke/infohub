# Infohub Tree Backup
Backup your personal data to one or many files that are downloaded to your computer/device.

## Introduction
You can backup ALL data from the server for ONE plugin.
You can backup a selection of paths from the server for ONE plugin.

## GUI - backup plugins
There is a list with plugin names found in the paths, "__Plugin names__". Mark the plugins you want to backup.

Click on button "__Backup plugins__". You will get a file for each plugin

File name: `infohub-backup-infohub_training-full-{paths md5 checksum}-20200726:140000.backup`

## GUI - backup paths
List with "__All paths__" from server database. 

Each path consist of:
`infohub_tree_storage/{user_name}/plugin_name/anything/the/plugin/uses`

The first `infohub_tree_storage/{user_name}/` are removed from the paths before you see them.

The paths are sorted alphabetically.

There is also an empty list: "__Paths to backup__".

When you click on a path in "__All paths__" it will appear in "__Paths to backup__" if not already there.

When you click on a path in "__Paths to backup__" it will be removed.

Click on button "__Backup paths__". You will get one file.

File name: `infohub-backup-infohub_training-partial-{paths md5 checksum}-20200726:140000.backup`

## Functions
* backup_full - Backup all data for one plugin
* backup_partial - Packup some paths for a plugin


## License
This documentation is copyright (C) 2020 Peter Lembke.
 Permission is granted to copy, distribute and/or modify this document under the terms of the GNU Free Documentation License, Version 1.3 or any later version published by the Free Software Foundation; with no Invariant Sections, no Front-Cover Texts, and no Back-Cover Texts.
 You should have received a copy of the GNU Free Documentation License along with this documentation. If not, see [https://www.gnu.org/licenses/](https://www.gnu.org/licenses/).

## footer
Created 2020-07-25 by Peter Lembke  
Updated 2020-07-26 by Peter Lembke
