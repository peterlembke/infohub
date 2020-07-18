# [1.2.19] - 2020-07-18
You can have an icon in the form/presentation box. Different users can have different config. Improved "More" in Launcher. Updated screen shot images. Different render cache for each logged in user. You can clear your render cache. Removed texts during start.

* [Release notes](main,release_v1v2v19)
* [Github release notes](https://github.com/peterlembke/infohub/releases/tag/v1.2.19)

## Added
* Client: infohub_rendermajor, added support for head_label_icon
* Client: infohub_renderform, added support for label_icon
* HUB-910, Client: Store config with user_name last in path
* HUB-915, Client: Render, function to clear render cache for user_name
    Function to be used when changing language in config 
* HUB-914, Client: Config, language - Add button to clear render cache
    Clear the render cache for one user_name so you get the GUI in your chosen language
* HUB-917, Client: Show progress bar just until the GUI shows
* HUB-912, Client: Keyboard, button to clear all render cache
    Keyboard combination to quickly clear the render cache for the logged in user_name
    SHIFT + CTRL + ALT + 9
* HUB-913, Client: Debug, add logout and clear render cache as icons
    Debug has the quick buttons as icons for touch devices

## Changed
* HUB-907, Put user name, logout and refresh in a clickable More box and add an icon
* README and release notes updated
* HUB-906, .gitignore, .hgignore - update them
* HUB-905, folder/doc/images - update them
    Did new screen shots and scaled them down
* HUB-911, Client: Render, Store render cache with user_name last in path
    I can have different login accounts on teh same device with different language setting
* package.json, added the release version. Changed the license code to SPDX-License-Identifier. Updated the main web address.
* HUB-918, Client: Start.js, show logo and progress without text

## Removed

## Fixed

## Tested

## Investigated
