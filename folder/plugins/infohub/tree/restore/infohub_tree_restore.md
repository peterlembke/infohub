# InfoHub Tree Restore

Restore your personal data from selected files that are then restored to your local storage.

## GUI

* File selector where you can select one or more backup files.
* They show up in a list.
* Mark the ones you want to restore
* Button to Clear the list.
* Button to Restore all marked backups in the list.
* Each file will get a result OK/FAIL icon.
* You get a Restore log on screen.

## Public functions

* click_file_selector
* click_clear_list
* click_restore_marked

## How it works

The data in the backup is already encrypted. We ask Storage for the plugin_index, so we can compare checksums. We have
the plugin name. We have the server_checksum (BS), local_checksum (BL) in the plugin index We have the server_checksum (
LS), local_checksum (LL) in the backup file.

Below is the rules. The must be done in this order:

* $restore = empty(LS) && empty(LL); // Restore paths that do not exist locally
* $skip = BL === LL; // Same checksum in the backup and locally
* $skip = BS === BL && BS === LS; // Our local version is more recent
* $restore = BS === LS && LS === LL; // The backup version is more recent
* $ask = true; // In all other cases we must ask the user if they want to restore or skip

## Future features

* Use another encryption key during the restore so data are decrypted with that key and encrypted with your key when
  stored in local storage.

## License

This documentation is copyright (C) 2020 Peter Lembke.  
Permission is granted to copy, distribute and/or modify this document under the terms of the GNU Free Documentation
License, Version 1.3 or any later version published by the Free Software Foundation; with no Invariant Sections, no
Front-Cover Texts, and no Back-Cover Texts.  
You should have received a copy of the GNU Free Documentation License along with this documentation. If not,
see [https://www.gnu.org/licenses/](https://www.gnu.org/licenses/).

## footer

Created 2020-07-25 by Peter Lembke  
Updated 2021-02-18 by Peter Lembke
