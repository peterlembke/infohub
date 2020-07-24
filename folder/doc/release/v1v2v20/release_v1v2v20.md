# [1.2.20] - 2020-07-24
Files with .txt extension can now act as json files. URL redirect function. Improved error messages and more messages. Tested server debugging tools. Added logos. Public accounts got better rights. tested sites on computer, ipad, iphone. Support slow 3G. Service worker now updates. Vagrant development environment added.

* [Release notes](main,release_v1v2v20)
* [Github release notes](https://github.com/peterlembke/infohub/releases/tag/v1.2.20)

## Added
* HUB-924, Client: Form File, Allow JSON files with .txt extension
* HUB-926, htaccess, Add mime type json to Apache
* HUB-927, Server: File, Usage of get folder structure did not check response answer
* Server: File, now test the response from GetFolderStructure. Also removes end slash on paths
* Server: Launcher, get_full_list now has better response messages and tests to guide what is wrong
* Client: Redirect is now a new function in infohub_exchange.js. Used in infohub_exchange.json to redirect a url.
* Logo SVGs in folder/doc/images/logotype
* serviceworker.js - added version date. That will clear the cached index.php
* Support for slow 3G - Increased the time out from 4 to 60 seconds until Infohub think we are offline. Now the page loads on slower broad band.
* Vagrant development environment added. See vagrant/README.md for details how to use
* Vagrant VirtualBox clock gets out of sync. Added commands that sync the clock with the host.

## Changed
* Startup, Enlarged the logo and progress. Was to small on phone
* Server: Launcher, improved error message when you have the same account in database and in infohub_contact.json
* Public login accounts improved with rights. Tested on iphone and ipad and computer.
* LOG folder is now moved out of the "folder" because I can then take a file backup much easier and the vagrant environment works better
* Mercurial ignore and Git ignore updated to avoid the log folder and vagrant files
* Doc, moved some documents into correct folders

## Removed
* Referer Kick out tests removed. They mess with the redirect function. I commented them out and will probably delete them.

## Fixed

## Tested
* Redirect now works for www.infohub.se to infohub.se

## Investigated
* HUB-925, Client: iPhone, remote debug why old startup remains in the phone
    The debugging in Safari is good but it was not possible do set break points and debug this specific javascript
