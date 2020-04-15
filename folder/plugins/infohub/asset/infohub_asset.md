# Infohub Asset
Syncs asset files from the server to the client. Provide asset to plugin tht owns it. Provide all assets to infohub_asset, infohub_launcher, infohub_translate.

Can also render an asset.

[columns]
# Introduction
Infohub_asset is both a server plugin and a client plugin. Assets are data files that a plugin owns. Like icons, translations, configuration and other data.

When you start a plugin from the Workbench, the plugin assets are synced down and stored in the local database. Now the client plugin can ask for its own specific assets.  

# Client side
Only plugins that can be started from workbench can have assets.  
When a plugin need one of its asset files it asks infohub_asset for the file data.
  
Infohub Launcher want launcher data from all plugins that have launcher data, and the start icon and icon license.  
Infohub Launcher can ask Infohub Asset for the data despite not being the owner of the assets.  

When a plugin want to use its translation files it asks Infohub Translate to merge together all translation files for the languages the user prefer. Infohub Translate is allowed to contact Infohub Asset to get all the wanted translation assets.

## create
Used by infohub_render to render an asset  
create uses get_asset_and_license to get the asset.  

## update_all_assets
Download all assets for all plugins  
Use by infohub_offline, infohub_asset  
Calls update_all_plugin_assets for each plugin name. The list of plugins come from infohub_launcher.  

## update_all_plugin_assets
Downloads all assets for ONE plugin.  
Use by owner, infohub_asset  
Calls the server -> update_all_plugin_assets and stores the assets in the Storage.  

## update_specific_assets
Download specific assets for specific plugins  
Use by infoub_launcher, infohub_asset.  
Calls the server -> update_specific_assets and stores the assets in the Storage.  

## get_plugin_assets
Give a list with assets you want for one plugin.  
Use by owner, infohub_asset.  
Calls get_asset_and_license for each asset  

## get_specific_assets
Get specific assets for several plugins  
Use by infohub_launcher, infohub_asset.  
Calls get_asset_and_license for each asset  

## get_asset_and_license
Get the asset data and the asset license data for the asset you mention.  
The plugin name is the callers plugin name. Infohub_asset can get assets from any plugin name.  
Use by owner, infohub_asset  

# Server side
Only infohub_asset.js can use infohub_asset.php  

## update_all_plugin_assets

- You give an array with asset names and checksums of the data you have for one plugin.
- You get an array with all asset names and data you are missing.
- Asset names that have its checksum mean that your data is accurate.
- Asset names that have no checksum mean that your data should be deleted.
- Asset names that have something in content should be updated/added on the client.

Used by client -> update_all_plugin_assets  

## update_specific_assets
Update specific assets for specific plugins  
The list you give is in the same format as the list that infohub_launcher have for the server_list  
Used by client -> update_specific_assets  

# Folder and files
In your plugin folder you create folder "asset". In that folder you put the file launcher.json. It contain information about the plugin  

```
{
    "plugin": "infohub_keyboard",
    "title": "Keyboard",
    "description": "Subscribe to key combinations.",
}
```

In asset you can have sub folders like icon and image. In icon you put all svg files and their license files. You can have sub folders.  
In image you put your images and license files. You can have sub folders.  
An icon is always in SVG format. The license file has the same file name as the icon but is a json data file.  
Example: asset/icon/video/icons8-vimeo.svg , and its license file asset/icon/video/icons8-vimeo.json  

```
{
    "publisher_name": "Icons8.com",
    "publisher_url": "https://icons8.com",
    "publisher_note": "",
    "publisher_video_url": "https://www.youtube.com/channel/UCRXYx6Qg7kgH0EAqa-Gl0HA/",
    "collection_name": "flat color icons",
    "collection_url": "https://icons8.com/color-icons/",
    "collection_note": " All the Flat Color Icons You Need. No doubt, we have social media icons like Facebook, Twitter, Youtube, and all kinds of arrows. Surely, we have basic ones like phone, home, and settings. However, if you are up for something more unorthodox, simply request it. No charge. Guaranteed.",
    "license_name": "Use for Free, but Please Set a Link",
    "license_url": "https://icons8.com/license",
    "license_note": "The icons, sounds, and photos are free for personal use and also free for commercial use, but we require linking to our web site. We distribute them under the license called Creative Commons Attribution-NoDerivs 3.0 Unported. Alternatively, you could buy a license that doesn't require any linking.",
    "file_name": "icons8-vimeo.svg",
    "creator_name": "",
    "creator_url": "",
    "creator_note": "",
    "asset_name": "Vimeo logo",
    "asset_url": "https://icons8.com/icon/21048/vimeo",
    "asset_note": "Vimeo logo",
    "asset_date": "",
    "asset_location": ""
}
```

You have the same setup for the images. You can use jpeg, png and any other image format.  

# infohub_file
Infohub Asset on the server depend on the plugin Infohub_File for reading the asset files on the server. The infohub_file plugin can read and write files.  
If the file extension is any of  
`'txt','csv','xml','json','svg'`
then the file is a text file. If the extension is not any of those then the file is treated as a binary file and will be encoded to base64 text.  
Base64 text takes more space but is needed if binary files are to be sent within Infohub.  

# Asset types
Not all file formats are suitable in the assets. Here is a list. Do remember that all assets for image, audio, video need a license file.  
The below formats work well in all supported browser.  
* svg - scalable vector graphics. Recommended for all icons and illustrations.  
* jpeg - old and common image format, lossy. Recommended for photos.  
* png - free and common image format for lossless images. Recommended when details are very important.  
* ogg/opus - open audio format with the best compression for all usage from low bit rate speech to high bit rate music. Recommended for all audio  
* ogg/vorbis - open audio format with similar compression as mp3. Use opus.  
* mp3 - old but common audio format. Use opus.  
There might be other asset types like video, but we will come to that in a revision of this document.  

# Client functions

## update_all_assets
Client function that ask infohub_launcher for the local server_list with all plugins that can be launched.  
Sends a message to update_plugin_assets for each plugin name on the list.  
    
## update_plugin_assets
Client function that update ALL assets for ONE plugin.  
Only the plugin that owns the assets can call this function to get the local assets updated in the database.  
Infohub Asset can call this function on behalf of a plugin.  
If the assets already have been recently updated within an hour then the request are ignored.  
If there exist a local checksum index for the existing local assets then it will be sent to the server->update_plugin_assets.  
The server create its own index by reading the files. The server compares the given checksum index with its own checksum index and send back a response with the files that have new data.  
The client side will update the data in the database and update the asset checksum index.  
Below is an example how it can look like when the client send its index to the server.  

```
$out = array(
    'to' => array(
        'node' => 'server',
        'plugin' => 'infohub_asset',
        'function' => 'update_plugin_assets'
    ),
    'data' => array(
        'filename.xml' => array(
            'checksum' => 'the data checksum',
            'data_size' => 43213, // Number of bytes
            'time_stamp' => 1234456 // Number of seconds since epoc
        ),
        'anotherfile.xml' => array(
            'checksum' => 'the data checksum',
            'data_size' => 43213, // Number of bytes
            'time_stamp' => 1234456 // Number of seconds since epoc
        ),
        'a_folder/a_no_longer_existing_file.png' => array(
            'checksum' => 'the data checksum',
            'data_size' => 43213, // Number of bytes
            'time_stamp' => 1234456 // Number of seconds since epoc
        )
    )
    'data_back' => array(
        'step' => 'step_response'
    )
);
```

## Response
Here is a response from the server and three examples of files to: keep, add, delete.  

```
$response = array(
    'answer' => 'true',
    'message' => 'Here are the files data',
    'plugin_name' => 'mydomain_myplugin',
    'data' => array(
        'filename.xml' => array( // Example of a file to keep on the client side
            'same' => 'true',
            'checksum' => 'the same data checksum',
        ),
        'anotherfile.xml' => array(
            'same' => false, // Example of a new file to save on the client side
            'checksum' => 'the new data checksum',
            'data' => 'Contents of the file',
            'data_size' => 43213, // Number of bytes
            'time_stamp' => 1234456 // Number of seconds since epoc
        ),
        'a_folder/a_no_longer_existing_file.png' => array(
            'same' => false, // Example of a file to delete on the client side
            'checksum' => ''
        )
    )
);
```

When the client get this answer it will add/update asset/{plugin_name}/anotherfile.xml with the new data in Storage.  
The "asset/{plugin_name}/index" will be updated in Storage by deleting 'a_folder/a_no_longer_existing_file.png', and adding/updating 'anotherfile.xml'.  

```
'anotherfile.xml' => array(
    'checksum' => 'the new data checksum',
    'data_size' => 43213, // Number of bytes
    'time_stamp' => 1234456 // Number of seconds since epoc
)
```
    
# update_specific_assets
Used by infohub_asset, infoub_launcher to update specific assets in multiple plugins. The list you send to this function is supposed to be accurate. 

The function will check the local storage for the assets. Missing assets. Assets exist with the wrong checksum. Assets exist with the right checksum. Assets that are correct are removed from the list. They will not be updated.

If the final list is empty then return control to the caller.  
If there are only assets left in the list that has the wrong checksum then send a short tail message to the server and return control to the caller. Answer will be handled when it arrive from the server.
  
If there are any missing asset in the list then call the server, handle the response and then return control to the caller.  

This is how you call the function:  
    
```
$out = array(
    'to' => array(
        'node' => 'client',
        'plugin' => 'infohub_asset',
        'function' => 'update_specific_assets'
    ),
    'data' => array(
        "list": {
            "infohub_configlocal": {
                "launcher.json": "ibyiy", // Each of the three assets has a checksum
                "icon/icon.svg": "ffo7vr0",
                "icon/icon.json": "ytv6r76gfih"
            }
            "infohub_debug": {
                "launcher.json": "ibyiy",
                "icon/icon.svg": "ffo7vr0",
                "icon/icon.json": "ytv6r76gfih"
            },
            "infohub_demo": {
                "launcher.json": "ibyiy",
                "icon/icon.svg": "ffo7vr0",
                "icon/icon.json": "ytv6r76gfih"
            },
            "infohub_democall": {
                "launcher.json": "ibyiy",
                "icon/icon.svg": "ffo7vr0",
                "icon/icon.json": "ytv6r76gfih"
            },
            "infohub_doc": {
                "launcher.json": "ibyiy",
                "icon/icon.svg": "ffo7vr0",
                "icon/icon.json": "ytv6r76gfih"
            },
            "infohub_keyboard": {
                "launcher.json": "ibyiy",
                "icon/icon.svg": "ffo7vr0",
                "icon/icon.json": "ytv6r76gfih"
            },
            "infohub_offline": {
                "launcher.json": "ibyiy",
                "icon/icon.svg": "ffo7vr0",
                "icon/icon.json": "ytv6r76gfih"
            },
            "infohub_tools": {
                "launcher.json": "ibyiy",
                "icon/icon.svg": "ffo7vr0",
                "icon/icon.json": "ytv6r76gfih"
            },
            "infohub_welcome": {
                "launcher.json": "ibyiy",
                "icon/icon.svg": "ffo7vr0",
                "icon/icon.json": "ytv6r76gfih"
            },
        }
    )
    'data_back' => array(
        'step' => 'step_response'
    )
);
```
   
# get_plugin_assets
Client function where a level 1 client side plugin can ask for any of its assets, including the index.  

In the example below the plugin ask for three files and the index.  
    
```
$out = array(
    'to' => array(
        'node' => 'client',
        'plugin' => 'infohub_asset',
        'function' => 'get_plugin_assets'
    ),
    'data' => array(
        'list': {
            'filename.xml' => array(),
            'anotherfile.xml' => array(),
            'a_folder/a_no_longer_existing_file.png' => array(),
            'index' => array()
        }
    )
    'data_back' => array(
        'step' => 'step_response'
    )
);
```


## Returned data

```
$response = array(
    'answer' => 'true',
    'message' => 'Here are the files data',
    'plugin_name' => 'mydomain_myplugin',
    'data' => array(
        'filename.xml' => array(
            'checksum' => 'the data checksum',
            'data' => 'Contents of the file',
            'data_size' => 43213, // Number of bytes
            'time_stamp' => 1234456 // Number of seconds since epoc
        ),
        'anotherfile.xml' => array(
            'checksum' => 'the data checksum',
            'data' => 'Contents of the file',
            'data_size' => 43213, // Number of bytes
            'time_stamp' => 1234456 // Number of seconds since epoc
        ),
        'a_folder/a_no_longer_existing_file.png' => array(
            'checksum' => '',
            'data' => '',
            'data_size' => 0,
            'time_stamp' => 0
        ),
        'index' => array(
            'checksum' => 'the data checksum',
            'data' => 'Content of the index',
            'data_size' => 2345,
            'time_stamp' => 1234456
        )
    )
);
```
    
# get_plugins_assets
Can be use by infohub_asset, infohub_launcher to get multiple assets for several plugins at once.  
    
# get_asset and license
Client function that get one asset. Can be used by the owner of the asset and by infohub_asset.  
Function get_plugin_assets uses get_asset.

# Graphical user interface
You can start the plugin from Workbench. You will see icons, images etc and their license information.

Button "Refresh" will render one Major box for each plugin name that do not already have a Major box. 

If a plugin name got a Major then a flag is set in the class global
```
$loadedAsset[$in.plugin_name]['rendered'] = 'true';
```
 
Title is the plugin name. Content are the svg/jpeg/png assets.
Footer show license information when you click on an asset.

## How it works
setup_gui -> render refresh button 
Render GUI will render 
* refresh
* plugin_list
* asset_list
* asset_data

Render the refresh button.

Functions
- click_refresh -> Render plugin list.
- click_plugin -> Render asset list.
- click_asset -> Render asset data-

[/columns]

# License
This documentation is copyright (C) 2017 Peter Lembke.  
Permission is granted to copy, distribute and/or modify this document under the terms of the GNU Free Documentation License, Version 1.3 or any later version published by the Free Software Foundation; with no Invariant Sections, no Front-Cover Texts, and no Back-Cover Texts.  
You should have received a copy of the GNU Free Documentation License along with this documentation. If not, see [https://www.gnu.org/licenses/](https://www.gnu.org/licenses/).  SPDX-License-Identifier: GFDL-1.3-or-later  

Since 2017-12-17 by Peter Lembke  
Updated 2020-03-24 by Peter Lembke  
