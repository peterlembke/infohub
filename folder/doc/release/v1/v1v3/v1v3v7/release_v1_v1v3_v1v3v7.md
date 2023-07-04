# [1.3.7] - 2022-03-04

InfoHub is much faster now on all browsers.
Client Storage is now one plugin. Added a Storage memory cache.
Launcher render the full list faster. Some plugins start faster. Removed many slow _ByVal and _Merge that was not needed.
Used step_void in some places to avoid getting an answer I do not need.

* [Release notes](main,release_v1_v1v3_v1v3v7)
* [GitHub release notes](https://github.com/peterlembke/infohub/releases/tag/v1.3.7)

## Added - new features
* HUB-1465, Client Storage - Memory cache makes read and write faster
* HUB-1464, infohub_asset, update_specific_assets, copy step_save_to_storage to a new function save_assets_to_storage
* HUB-1462, infohub_launcher, refresh full list is faster now. If we send no checksum then we assume the client need both the full list and all its assets. Reducing the calls from 2 to 1. Reducing rendering time from 11 to 9. 

## Changed - changes in existing functionality
* esversion from 6 to 11. More modern Javascript
* Speed improvement for messages with short tail, In the cases I throw away the response I have changed to step_void to save time
* Updated JS Docs from Example: to @example
* Rows that had been cut into two rows have now been mended to one row
* Minor refactoring to more easily debug the code
* HUB-1478, infohub_storage.js - Simplified to one level1 always storing with idb-KeyVal. Much faster now
* HUB-1484, infohub_storage.js - read_pattern and write_pattern now use read_paths in the same level. Making execution faster
* HUB-1475, infohub_storage.js - Not using infohub_storage_data.js any more so that reduces number of _ByVal and _Merge
* HUB-1474, infohub_storage.js - Reduced number of _ByVal and _Merge by reducing the level of plugins
* HUB-1471, infohub_launcher.js - Changed some step_end to step_void. Removed some _ByVal
* HUB-1471, infohub_workbench.js - Changed one step_end to step_void
* HUB-1472, infohub_asset.js - Changed four step_end to step_void to gain speed. Removed one _ByVal
* HUB-1460, infohub_transfer.js - _LeaveCallStack now preserve the to.function and add the callstack_hubid to the data_back. Easier to debug server responses now
* HUB-1461, infohub_session.js - initiator_check_session_valid. Client startup stopped when asking server to check if the session data is valid. Now we assume it is valid if we have data. The check is done async in the background
* HUB-1485, infohub_base.js - Changed default waiting time a message waits before being sent to the server from 0.2 seconds to 1.0 seconds. Benefit is that more messages have time to join the request. We get fewer requests.
* HUB-1488, Lowered wait time for some messages from client to server from 1.0 to 0.2 seconds to respond faster to user interactions
* HUB-1488, Added missing plugins to the startup of infohub_doc and infohuh_demo. Those start faster now
* HUB-1488, Added missing plugins to the startup of infohub_login and infohub_tools. Those start faster now

## Deprecated - soon-to-be removed features

## Removed - now removed features
 
## Fixed - bug fixes
* HUB-1483, infohub_view: Fixed if _GetNode get no box. In file_read and modify_class.

## Security - in case of vulnerabilities.

## Tested

## Investigated
* HUB-1462, infohub_view.js - internal_ModifyClass return false if box can not be found. It should remain like that.
* HUB-1486, infohub_welcome - Exception ModifyClass in Welcome. Can not reproduce. Closing task
* HUB-1487, Remove unnecessary messages to update all assets. Can not reproduce. It works
* HUB-1489, Detect Dark mode in Brave Browser - Changed Fingerprint protection from strict to standard. Click the adress bar right hand Brave-shield
* HUB-1466, infohub_transfer.js - Missing function ban_seconds. Can not reproduce
