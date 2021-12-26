# Infohub Tree Backup

Backup your personal data to one or many files that are downloaded to your computer/device.

## Introduction

You can only back up/restore data:

* that have been stored by the Tree.
* that exist in local storage.
* that are encrypted.

You can:

* Backup all plugins to separate files
* Backup selected plugins to separate files
* Backup plugin keys to one file

You can not: (Might come in later version)

* backup changed data since last backup
* get an automatic backup regularly

You can not: (Will probably not come in later versions)

* backup everything to one file
* backup more than one plugin to one file

## File name

File name: `infohub_tree-{plugin_name}-{date}-{time}-{number}.backup`
File name: `infohub_tree-infohub_training-20200726-142113-0001.backup`

Date is year month date yyyymmdd Time is 24h clock hour 00-23 minute 00-59 second 00-59 hhmmss Number is the order
number in the backup series. All backup files in the same number series have the same date and time.

## File format

The file will be files with max 1 Mb of data. The data format is JSON. Each file is independent and can be restored by
its own.

```json5
{
    "path1": {"server_checksum":  "123345", "local_checksum":  "234234", "encrypted_data_bytes": 1234, "encrypted_data": "" },
    "path2": {"server_checksum":  "123245", "local_checksum":  "231234", "encrypted_data_bytes": 321, "encrypted_data": "" },
}
```

The encrypted_data_bytes is the size of the encrypted data string.  
server_checksum is a direct copy from the local server_checksum. It is the checksum of the decrypted json data we got
from the server when we synced.  
local_checksum is a direct copy from the local `local_checksum`. It is the checksum of the decrypted json data we had in
the local Storage.

## GUI - Backup all

A button to back up all Tree data. A file for each plugin will be downloaded.

## GUI - backup selected plugins

There is a list with plugin names found in the paths, "__Plugin names__". Mark the plugins you want to back up.

Button "__Backup plugins__". You will get a file for each plugin Button to refresh the plugin list.

## GUI - backup paths

* Button: Refresh plugins
* Selector: Plugin list
* List: Paths in selected plugin
* Button: Backup selected keys

## License

This documentation is copyright (C) 2020 Peter Lembke. Permission is granted to copy, distribute and/or modify this
document under the terms of the GNU Free Documentation License, Version 1.3 or any later version published by the Free
Software Foundation; with no Invariant Sections, no Front-Cover Texts, and no Back-Cover Texts. You should have received
a copy of the GNU Free Documentation License along with this documentation. If not,
see [https://www.gnu.org/licenses/](https://www.gnu.org/licenses/).

## footer

Created 2020-07-25 by Peter Lembke  
Updated 2021-02-18 by Peter Lembke
