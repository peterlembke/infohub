# [1.2.23] - 2020-11-08

Support for the excellent AVIF image format. Speed improvements. Bug fixes. Cleaned up code. Prepared for future features.

* [Release notes](main,release_v1_v1v2_v1v2v23)
* [GitHub release notes](https://github.com/peterlembke/infohub/releases/tag/v1.2.23)

## Added
* Base JS got _UcFirst as a complement to _UcWords
* Render, Common Progress - Can now render progress bar
* View, Progress - Can now modify value and max in progress bar
* Demo, Common got a demo for Progress. Press the button to affect the progress.
* Welcome, got AVIF images, and they are now rendered OK if you have selected you can see avif in ConfigLocal.
* folder/doc/images got avif images
* HUB-468, Infohub ConfigLocal Image - Select what image types you can see
* HUB-468, Infohub ConfigLocal Image - Updated documentation
* HUB-1017, Infohub ConfigLocal Image - Save config / Load config
* HUB-1019, Infohub ConfigLocal - Apply config to the infohub_asset plugin_config 
* infohub_asset, added more image types: webp, avif, gif 
* infohub_plugin.js - added function set_plugin_config to set new base configuration for one plugin
* HUB-1026, Translate configLocal - Image. Also set max width to 640 and made all config look the same.
* HUB-1020, Launcher - Click icon, see Run button on small screen. 
    iPhone SE 2016 have a small screen and the run button did not show. Now it scrolls so the Run button is at the bottom of screen. 
* infohub_call.php -> Added a curl plugin that will be used later to reach CouchDb servers, Infohub servers, REST APIs. And documentation of course.
* GnuPG added to the Vagrant environment. Preparing for adding pgp to infohub_encrypt.php
* HUB-1034, infohub_color can now render three different color bars and handle events to select a color
* HUB-1034, infohub_color can now render ColorSelector and ColorReader
* infohub_view -> data_copy - Function that copy data from one element to another and replace all IDs, so they do not interfere
* infohub_render_form -> Added "display" to Button, File, Text, Textarea, Range, Select. If you want this on checkboxes and radios you need to wrap them in a common container.

## Changed
* Go function now read properties: multiple and selected correct
* Progress CSS, rounded the right corners, so it does not look strange when on maximum
* Moved all release notes to v1 and there I now have v1.1, v1.2, v1.3 and so on. Easier to find.
* ConfigLocal_Image, Apply config, If we have no config then we skip this
* Plugin, set_plugin_config - If we have no plugin then we skip this
* infohub_transfer, if we want messages in clear text but the package is too large then messages are now dropped to avoid an error
* HUB-1023, infohub_file.php -> asset_get_all_assets_for_one_plugin now skip assets that have no license file
* HUB-1023, infohub_asset.php -> update_all_plugin_assets now picks the bitmap image type with the lowest Kb that you have said you can see in ConfigLocal.
* HUB-1023, infohub_asset.js -> get_asset_and_license now picks bitmap image assets without extension and displays correct mime type. SUCCESS: Full support for AVIF, JPEG, WEBP, PNG, GIF. You win by downloading less Kb for the same image content.
* infohub_base.php -> Improved _JsonEncode and _JsonDecode. Added PHPDOC to _GetData.
* infohub_base.js - JSDOCs, added default values, removed var
* infohub_asset.js - JSDOCs, added default values
* index.php and infohub_file both calculate the front page checksums - now in the same way

## Removed
* infohub_render, removed two unused functions: internal_AssembleHTML, internal_GetExtraTags. This is done by infohub_render_text since way back.
 
## Fixed
* HUB-1014, Startup stuck. Old sessions get stuck. Issue was it tries to verify possible old plugins and failed. Now it does that in the background and gives you the plugin it has. Quicker and none blocking.
* HUB-1015, Startup stuck. Debug why no ajax call when plugin is old. The core use some more plugins, and I have added them to the core. Now the plugin are updated in the background.
    Original: infohub_cache, infohub_exchange, infohub_plugin, infohub_transfer. 
    Added to Core: infohub_session, infohub_keyboard, infohub_offline, infohub_checksum, infohub_timer.
* Xdebug now write logs to the log folder outside "folder".
* HUB-1027, Now shows warning popup during start if cookies are disabled. localStorage is not available when you have disabled all cookies. Infohub do not use cookies but use localStorage to store plugins for performance and to store number of failed startup attempt, so it can automatically correct the issues and start Infohub.  
* HUB-1030, Scroll to bottom does not work on cached blocks. Now it does
* HUB-1025, Client: Asset, event_message - Read bitmap asset without extension
* infohub_asset.php -> update_all_plugin_assets, added a test for empty file data (Found during Brave browser tests)
* HUB-1037, infohub_tabs, fixed two issues where wrong variable was returned

## Tested
* infohub_color -> color_bar: Tried to render html directly to speed it up but that failed. I will try WebWorkers in another task 

## Investigated
* WebWorkers: I will probably introduce that. I have written a lab example that pull down code with Ajax and start it as a blob
