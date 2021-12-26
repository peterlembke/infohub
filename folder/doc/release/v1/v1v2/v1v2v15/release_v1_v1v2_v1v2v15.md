# [1.2.15] - 2020-05-17
Focused on support for large responses. Regression issues. Installation documentation. Configuration files.

* [Release notes](main,release_v1_v1v2_v1v2v15)
* [GitHub release notes](https://github.com/peterlembke/infohub/releases/tag/v1.2.15)

## Added
* Client, Server: package messages_encoded_length added in infohub_transfer js and php
* Server: Refactored kick_out_tests_for_infohub.php and added messages_encoded_length
* Server: infohub_exchange calls infohub_plugin directly and now adds config
* start.js, added messages_encoded_length
* define_folders.php - added folder `file` for future backup/restore of data
* HUB-734, Doc added: installation requirements, plugin config
* HUB-733, Added config-example files with log in account, db connection and domain config

## Changed
* Client: Refactored infohub_welcome + children
* Server: infohub_storage.php children and infohub_transfer.php now use _JsonEncode instead of json_encode
* Server: Minor refactor of infohub_plugin.php
* HUB-735, Client: infohub_launcher.js changed cache time on full plugin list from 8 sec to 24 hours
* Infohub_tools launcher.json now include validate and tools_package to reduce the number of server calls
* HUB-734, Doc changes: installation, core_root_definefolders, main_about, plugin_debug

## Removed
* Client: Deprecated infohub_welcome -> workbench.svg 
* HUB-736, Server: Only check rights on incoming messages

## Fixed
* HUB-732, Client: Can not run the Welcome plugin
    It was the size of the assets. PHP echo could not handle it.
    I split the string into 64K parts and print them. 
    Now it works.
* HUB-738, Server: Checksum crc32 should return string
    Now it does. I also refactored infohub_checksum_crc32.js and infohub_checksum.php and infohub_tools_checksum.js
* HUB-739, Client: Doc, can not see the doc index. It was missing rights to infohub_renderadvancedlist

## Tested
