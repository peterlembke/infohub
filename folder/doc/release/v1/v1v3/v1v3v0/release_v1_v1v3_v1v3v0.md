# [1.3.0] - 2021-05-22

InfoHub Tree got new features but is not finished. All code is auto refactored. opcache prefilled. All plugins can now be run standalone as their own applications. This is a large service release with things I want to get out on the sites. It was so long ago since the last release and today is my 50th birthday.

* [Release notes](main,release_v1_v1v3_v1v3v0)
* [GitHub release notes](https://github.com/peterlembke/infohub/releases/tag/v1.3)

## Added
* Tree, Doc - displays documentation for each part of Tree
* Tree, Menu - Has all parts now and is finished
* HUB-1006, Tree - Added read and write
* robots.txt added to instruct crawlers to crawl away. Added file to allowed root files
* HUB-1222, Now preloads all php at server start into the opcache. Only 49 files. No fail if opcache disabled
* HUB-1000, Tree Encrypt GUI now working with create key file, import key file, forget key from browser 
* HUB-1234, Recreated the square InfoHub logo in SVG
* HUB-1232, Let URL pass with ?plugin_name=infohub_asset
* HUB-1238, Show standalone plugin from GET parameter plugin_name
* HUB-1236, All plugins get an icon.png so apple-touch-icon can use it in another task
* HUB-1239, Set apple-touch-icon from URL plugin_name
* HUB-1235, Set favicon as SVG from URL plugin_name
* HUB-1242, index.php - Set title and description from launcher.json
* HUB-1247, Add an icon to launcher - New window
* HUB-1240, Launcher button - Run in new window. Starts plugin in new tab
* HUB-1248, launcher.json - add keywords to describe the plugin
* HUB-1249, index.php now uses keywords from launcher.json
* HUB-1246, Config - Change icon from the wheel SVG to this preference panel SVG
* HUB-1237, manifest.php - from json to php
* HUB-1243, manifest.php - Set title and description from launcher.json
* HUB-1250, manifest.php - use keywords from launcher.json
* HUB-1241, manifest.php - Set icons from URL plugin_name
* HUB-1252, sanity_check - allow manifest.php?plugin_name=
* HUB-1269, If plugin_name not found in URL then checks config for the domain. Changed include/application_data.php 
* HUB-1277 (HUB-1099), Many translation keys are now CAPS_KEY. _Translate handle both sentences and CAPS.
    Loading a translation array now converts all keys to CAPS_KEY. CAPS_KEY makes it easier to build translation files and shows to the developer that these keys can not just be changed.

## Changed
* HUB-1214, Tree - Updated documentation
* HUB-1220, Auto refactored all JS, PHP, SVG, Markdown in the folder
* manifest.json got description, categories
* HUB-1221, Markdown code - wrong background. Changed transparency from 0.9 to 0.1
* HUB-1266, Launcher - translate "Run in new window"
* HUB-1268, IOS Safari css cross-origin error. Changed from link-tags with base64 css data to style-tags with plain text
* HUB-1269, Change default branch from master to main on Bitbucket and GitHub

## Removed
 
## Fixed
* HUB-1219, Tree - Documentation did not show. The Tree doc renderer now support the new item_index, and render cache now added
* HUB-1223, Client Storage Write - Now returns written data and mode
* HUB-1226, file select button now show progress/ok/fail icon
* HUB-1244, BUG: Scrolling with JS removed the plugin_name from the URL
* HUB-1262, iPad/iPhone - does not open in new tab. Solved with a normal link
* HUB-1271, BUG: client.infohub_tools.call_server, Can not call: call_server, error:Cannot set property 'step' of undefined
* HUB-1272, BUG: The get parameter plugin_name avoided the login. Now it works. I need this on all plugins because a plugin might not be installed locally, and then it needs to be downloaded from the server. We need to be logged in for that.

## Tested

## Investigated
* HUB-1215, updated the Trello tasks for this release
* HUB-1264, Investigate: Login guide. I want the Login shared_secret and the Tree private_secret to be in the same log in file for convenience. But that is not logically sane to mix different features. Some might not even use the Tree. I will do this in steps instead and provide two file selectors and two password text boxes. Then you can ignore or reuse a private_secret. Created HUB-1280, 1281, 1282 to handle this.
* HUB-1263, Investigate if the IOS start icon has GET parameters. They do. I connected the iPhone to Safari and saw the URLs on the desktop icons I started. But for InfoHub it does not work. I now know it is at least not an IOS problem. Closing this task. Created HUB-1279 to handel this.
