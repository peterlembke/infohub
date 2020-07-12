# [1.2.17] - 2020-07-
Added a rendering cache. Improved Storage and a demo. Some @todo fixed. Assets cached better. Improved login.  Client transfer with banned_until now works. Translations added. Improved icons. Style added.  

* [Release notes](main,release_v1v2v17)
* [Github release notes](https://github.com/peterlembke/infohub/releases/tag/v1.2.17)

## Added
* HUB-880, Styled select options to be light blue
* HUB-881, Client: Transfer - Set $globalWaitingForResponse = 'false' if no response
* HUB-882, Server: Contact - Plugin rights tighter. Also refactored some code. Tested OK.
* HUB-883, Server: Login - Plugin rights tighter 
    Any node except server can use login_request and login_challenge. 
    Only node server can use login.
* HUB-884, Server: Session - Plugin rights tighter.
* HUB-885, Client: start.js - If session not valid then throw it away and try again
* HUB-879, Client: Login, Download pre made account file
    The standalone login page can be configured to show a download button so the user can get a prepared login file.
    See infohub_login.md

## Changed

## Removed

## Fixed
* HUB-880, Client: Contact - Can not refresh lists. It was missing read_pattern

## Tested

## Investigated
