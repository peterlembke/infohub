# [1.2.14] - 2020-05-16
Focused on the communication with messages_encoded, login procedure, rights, prepared security group tags, localization to swedish, english, spanish. Regressions fixed. Communication Packages from server are now formatted the same way as the client packages and the sign_code are verified.

* [Release notes](main,release_v1v2v14)
* [Github release notes](https://github.com/peterlembke/infohub/releases/tag/v1.2.14)

## Added
- HUB-702, Client. Set button OK/FAIL icon
- HUB-703, Client: Login, "Select file": If json is already imported then have an OK icon
- HUB-701, Client. Config. Settings. Add icons
- HUB-695, Client. Contact. Menu add icons
- HUB-656, Client: Contact, new option to set allowed client GUI plugins for a user. Had to change infohub_contant, infohub_file
- HUB-623, Server: launcher, get_full_list - Now only give plugins you have rights to
- HUB-623a, Server, Client: Contact, Added support for client_plugin_names
- HUB-623b, Server, Client: Login, Added support for client_plugin_names
- HUB-623c, Server, Client: Session, Added support for client_plugin_names
- HUB-623d, Server: Exchange, Added support for client_plugin_names and moved allowed guest client plugins to here
- HUB-623e, Server: Plugin, Added support for client_plugin_names and moved allowed guest client plugins to Exchange
- HUB-706, Server: Plugin, plugin_request - Only get JS plugins you have rights to
- HUB-605, Client: Session, Validate - Get allowed server and client plugin names
- HUB-624, Client: Exchange - Check messages that I am allowed to send to that plugins
- HUB-707, Client: Group tag in each plugin: admin,user,guest,core,developer
- HUB-625, Server: Server: Response package. add messages_encoded
- HUB-708, Client: Response package. unpack messages_encoded
- HUB-600, Server. Response package. Calculate sign_code
- HUB-727, Server: Transfer response_package. Remove messages array
- HUB-628, Client: Incoming response. Verify sign_code
- HUB-728, Client: Make config.session_id available to all plugins

## Changed
- HUB-697, Client. Login. Password. Change to password input
- HUB-693, Client. Menu and button text size too large. Changed from 1.5em to 1.0em
- HUB-663, Client: Login, standalone improvements
- Refactored infohub_transfer.js

## Removed
- Deprecated autoload.php - infohub_plugin handle loading of classes.
- HUB-690, Client plugin title with -. Removed that

## Fixed
- HUB-692, Client. Contact. Group. Dropdown show failure message
- HUB-688, Client. Login not localized
- HUB-698, Client. Tools. Message tool not localized
- HUB-705, Client: Translate, Create - Select plugin give infinite loop. Fixed in infohub_renderform
- Client. Launcher icon titles in Firefox too wide. Added word-wrap:break-word to avoid side scrolling 
- HUB-730, Client: Keyboard refresh buttons do not work

## Tested
- HUB-700, Client. Offline. Download plugins fail. No error. It was just a lot of plugins.
