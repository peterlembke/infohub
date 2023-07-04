# [1.3.10] - 2023-07-04

You can now download all documentation to the browser. That is one step in preparing for going offline.

The year since the last release I have got my foot operated and finally I can run again.
Have had full focus on running and training to get back to running marathons. And finally I am on the tracks again.

* [Release notes](main,release_v1_v1v3_v1v3v10)
* [GitHub release notes](https://github.com/peterlembke/infohub/releases/tag/v1.3.10)

## Added - new features
* HUB-1654, document_list, client check valid_until and avoid asking the server if list is still valid.
* HUB-1653, document_list, if server see that your checksum is valid then asks you to reuse the list you have.
* HUB-1638, document_list, added valid_until. Server caches the list. Client caches the list.
* HUB-1651, infohub_doc_get now provide the local document even if it is old and update the old document in the background.
* HUB-1636, Added setting on the server how long a document is valid. Added valid_until on all documents. 
* HUB-1603, infohub_doc_get have get_all_documents that get 256Kb of asked documents until all are downloaded and saved. 
* HUB-1629, infohub_doc_get have a new function: store_document that store the document and update the local_documents_list
* HUB-1630, client, infohub_doc_get have a new function: build_local_documents_list connected to the refresh button. Needed if we manually delete documents from the storage.
* HUB-1627, client, infohub_doc_get - New function get_local_documents_list
* HUB-1628, client, infohub_doc_get - New function get_wanted_documents_list - Missing local documents that the server have.
* HUB-1648, added security headers in settings_and_errors.php that lock down the browser to be more secure
* flush_cache - To flush the opcache. A better solution will come later

## Changed - changes in existing functionality
* HUB-1633, Renamed Infohub to InfoHub in all Markdown documentation
* infohub_file, Changed _GetUserRole and _GetPluginStatus to not have to decode the file content before pulling out the data. Reduces memory consumption and increases speed.
* infohub_file, Now only pulls out the user role when reading JS or PHP files.
* Trigger, updated PHPDOC. Minor refactoring.
* Trigger, fixed bug when filtering the data JSON
* HUB-1639, Trigger, Now allowed to send message to any JS plugin on any level. PHP will remain restricted.
* HUB-1641, Trigger, Now preserves data manually written
* kick_out_tests_for_infohub.php, On error it now sends to the alert function instead of the none existing ban_seconds function. 
* kick_out_tests_for_index.php, now allow the folders: blog, demo, doc, private and file flush_cache.php
* define_folders.php - If your ROOT folder has an `infohub` folder then that is used as MAIN folder. The parent to public_html is the root folder. 

## Deprecated - soon-to-be removed features

## Removed - now removed features

## Fixed - bug fixes
* HUB-1650, Error when using infohub_doc and click on the root document. root.md was missing
* PHPStan level 9 found a minor that is now fixed
* Increased memory from 12Mb to 16Mb in folder/include/settings_and_errors.php so that plugin Trigger works again.
* HUB-1652, infohub_storage - Write with merge did not work. Now it does.

## Security - in case of vulnerabilities

## Tested

## Investigated
* HUB-1647 (HUB-1466), infohub_transfer.js - Missing function ban_seconds. Can not reproduce
