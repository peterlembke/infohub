# [1.3.30] - 2024-05-20

Focus on batch messages. Send messages and get a flag on the lastly returned message.
Storage: Added flag for 'delete_after_reading'.

* [Release notes](main,release_v1_v1v3_v1v3v30)
* [GitHub release notes](https://github.com/peterlembke/infohub/releases/tag/v1.3.30)

## Added - new features
* HUB-1711, PHP/JS Added GMT as a time format you can ask for. You can test it with InfoHub Tools -> Time
* HUB-1721, added beating heart to renderprogress that pulsate every time data is updated. The visible progress bar only update every second.
* HUB-1707, PHP - You can do a batch call and get a flag on the lastly returned message. See the Demo plugin.
* HUB-1724, JS - You can do a batch call and get a flag on the lastly returned message. See the Demo plugin.
* HUB-1707, PHP - Added a demo for the batch call in the Demo plugin.
* HUB-1730, JS - Added a demo for the batch call in the Demo plugin.
* HUB-1725, PHP - infohub_storage - added support for delete_after_reading 
* HUB-1726, JS - infohub_storage - added support for delete_after_reading
* HUB-1736, PHP/JS - infohub_batch - You now have a helper to send batch messages. See the Demo plugin "Batch".   
* HUB-1741, JS - infohub_exchange - Added statistics how many messages were processed in each step in the main loop. Makes debugging the core slightly easier.
* HUB-1737, JS/PHP - infohub_batch - data_back is now supported in batch messages.
* HUB-1740, JS/PHP - infohub_batch - You can add data_back.sort_order (int). Sorts the data ascending.
* HUB-1739, JS/PHP - infohub_batch - Added send_batch_messages_in_memory to send messages in memory. Use with few messages that require speed.

## Changed - changes in existing functionality
* HUB-1706, you can now download the login file for localhost
* HUB-1723, infohub_base.php - declare some functions as private
* HUB-1707, infohub_compress - Renamed uncompress -> decompress everywhere
* HUB-1707, infohub_base.php - Refactored the cmd() function to have a more modern code style
* HUB-1707, error box now got CSS to show properly in light and dark mode
* HUB-1707, Changed double quotes to single quotes in PHP, where possible
* HUB-1724, JS - Base Cmd(), Now aligned row by row with PHP Base Cmd() 
* HUB-1724, Support for PHP 8.2, minor changes in the code
* HUB-1729, PHP Stan level 9 - fixed all issues
* HUB-1741, JS - infohub_base, infohub_exchange - Added log level debug and corrected the log levels on all log messages. Makes debugging the core mush easier.

## Deprecated - soon-to-be removed features

## Removed - now removed features
* HUB-1710, infohub_storage.js have for long merged with idb-keyval. Moved files to a backup folder and [added a README](../../../../../plugins/infohub/storage/backup/README.md)

## Fixed - bug fixes
* HUB-1707, PHP _Default now add the key to answer if not existing instead of throwing an error
* HUB-1730, infohub_doc_get.js - Bug when old document is still valid
* HUB-1727, JS - data_request now works - You can specify what data you want back, see infohub_demo_batch for example
* HUB-1736, PHP - data_request now works - You can specify what data you want back, see infohub_demo_batch for example
* HUB-1736, PHP - from_plugin now works - You can now see what plugin the message came from
* HUB-1741, JS - could not start - did not recognize the node: client
* HUB-1743, Failure to start. HUB-1726 works, HUB-1727 does not. I removed changes in base and exchange. Now it works. 

## Security - in case of vulnerabilities
* HUB-1704, Improved message: `Server says: Package sign_code_created_at is older than 4.0 seconds. Check your computer clock`

## Tested

## Investigated

* HUB-1738, Batch Require data_request - Not possible. The function do not have access to the data_request parameter. 

Things I have looked into.

* MongoDb - Support for the Storage plugin will come. I have worked a lot with MongoDb.
* Lottie animation files - Interesting
* MongoDb Geo location data - Interesting
* Turtle Graphics rendered by the SVG plugin - Might come later. Great for measuring up apartments.
* A-frame - VR/AR - Might come later.
* Audio sprites - This will come. Probably with Three.js or another code I have.
* Notification API - Have done labs and it works well
* PHP 8.3 - I have looked into it. It will be supported soon. Might already work.
* Passkeys - Investigated how to make a passkey system. It will come in the future. I have no working lab yet.
