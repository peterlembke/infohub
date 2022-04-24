# [1.3.8] - 2022-04-24

Worked on the Tree plugin. The plugin that keeps your data private.
The developer tool Trigger is now improved. Fixed bugs in the infohub_view.
With get_call_schema you can see what server plugin functions you can call.

* [Release notes](main,release_v1_v1v3_v1v3v8)
* [GitHub release notes](https://github.com/peterlembke/infohub/releases/tag/v1.3.8)

## Added - new features
* HUB-1495, Tree - Encrypt - Create new key file
* HUB-1502, Tree - Encrypt - Add password checksum to help the user. Less secure but practical
* HUB-1514, infohub_trigger - Also put default in hidden textarea
* HUB-1515, infohub_trigger - Also put result in hidden textarea
* HUB-1508, infohub_trigger - Remember the selections in local Storage
* HUB-1518, infohub_trigger - Handle no answer from server
* HUB-1519, Main loop count now as a global setting of 500. Was 150. Prevent never ending messages. Will exit even if there are messages left to process
* HUB-1503, infohub_plugin, get_call_schema - Get a list with plugins and functions YOU can call with your logged in account
* HUB-1516, infohub_trigger - Click filter radios to filter the default and result message

## Changed - changes in existing functionality
* HUB-1491, prepared documents for version 1.3.8
* HUB-1491, Added date and since to package.json. 
* HUB-1491, Updated gitignore and hgignore
* HUB-1495, Tree - Encrypt - Create new key file now works, including setting a password
* Composer, changed to work with PHP 8.0
* HUB-1498, PHP: Use === in all comparison
* HUB-1499, JS: Use === in all comparison
* HUB-1497, JS - Remove more .substr and add a _SubString function
* HUB-1505, infohub_trigger - Can now send message to any plugin, not just emerging plugins. Great dev tool
* HUB-1506, infohub_trigger - Sort the plugin list
* HUB-1511, infohub_trigger - Show failed responses too
* HUB-1510, infohub_trigger - Radio buttons now filter the default array
* HUB-1509, infohub_trigger - Radio buttons now filter the result. Removed the filter dropdown.
* HUB-1513, infohub_trigger - populate gui with your previous selections
* HUB-1526, infohub_trigger - run filters after buttons pressed

## Deprecated - soon-to-be removed features

## Removed - now removed features
 
## Fixed - bug fixes
* HUB-1512, infohub_plugin - plugin_request now check in-parameters
* HUB-1523, infohub_view - get_text fixed bug when getting text from a textarea
* HUB-1524, infohub_view - form_write Radio - Change to trigger event only when value = true
* HUB-1525, infohub_view - form_write - collect all events to after all boxes got values
* 

## Security - in case of vulnerabilities.

## Tested

## Investigated
* HUB-1500, PHPStan, check all code
* HUB-1507, infohub_trigger - Remember the latest list I got from the server. Was already implemented.
* HUB-1531, Pre study - GUI designer
* HUB-1531, Pre study - Item container with drag and drop
* HUB-1531, Pre study - Quickform that render items from a key-value object
