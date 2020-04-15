# Infohub File
Owns the file system. Read and write file data.  

# Introduction
Infohub_File.php OWNS the file system on the server. Other plugins on the server use Infohub_File to read and write data to and from files.  
Infohub_File only handle with files as the names says. It will not read/write data anywhere else than in files.  
The usage of this plugin are locked to server plugins. There are no infohub_file on the client.  

# Folders in general
When you read or write a file then you provide a path to the file. The path starts from the web root and it includes the file you want to read/write. Example: folder/plugin/infohub/callback/infohub_callback.json  
The path will be converted to lower case. This is important to know on case sensitive file systems. You are not allowed to use .. in the path to get one level up. That will be removed from the path.  
The only characters that will be left in the path is: `a-z (letters), 0-9 (numbers) _ (underscore) - (hyphen) / (slash) . (dot)`  
On Windows systems a path contain backslash. Use slash instead, that works.  

# Used by
The file plugin is locked to server plugins and to folder: folder/file/{plugin_name} for read and write.  
In addition to this there are special functions that are locked to one plugin called: infohub_asset  
The plugin infohub_file is NOT used by infohub_plugin because that plugin is close to the core and need to handle its business on its own without depending on infohub_file.  
## Data on the client side
When infohub_asset have synced down the files and stored the data in Storage then other plugins on the client side can ask Asset for data.  
infohub_doc - can ask infohub_asset for files from folder/doc and folder/plugin/{plugin_name}/asset/doc. Doc wants the doc xml, images, css file, html template.  
infohub_launcher - Uses all launcher.json files. They contain title, note, and start message. Also uses the plugin icon and license.  
All plugins can ask Asset for files that are part of their own plugin, like icons, translations, config etc.  

# Miss use
Config data are provided by infohub_exchange to the plugin. No need for the plugin to read the config data.  
Today two modules read their own config file. That dependency will be removed completely.  
infohub_callback - to read config data.  
infohub_storage_data.php - reads the config data. That config will instead be read by infohub_exchange and passed to infohub_storage.  
infohub_doc.php - Reads doc files, that will be totally handled by infohub_asset and this plugin can be removed.  

# Read from file
Locked to server plugins.  
You provide a path. The path is the last part of the path. folder/file/{plugin_name} will be added in the beginning of the path.  
## Example read

```
$out = array(
    'to' => array(
        'node' => 'server',
        'plugin' => 'infohub_file',
        'function' => 'read'
    ),
    'data' => array(
        'path' => 'my/path/and/file.jpg',
    ),
    'data_back' => array(
        'step' => 'step_response'
    )
);
```

## Returned data
Observe: The returned path is the cleaned up path that then was used to find the file.  

```
$response = array(
    'answer' => 'true',
    'message' => 'Here are the file contents',
    'path' => 'folder/file/mydomain_myplugin/my/path/and/file.jpg',
    'path_info' => array(
        'dirname' => 'folder/file/mydomain_myplugin/my/path/and',
        'basename' => 'file.jpg',
        'filename' => 'file',
        'extension' => 'jpg'
    ),
    'file_info' => array(
        'folder_exist' => 'true',
        'is_dir' => 'false',
        'is_file' => 'true',
        'is_link' => 'false',
        'file_exist' => 'true',
        'is_readable' => 'true'
    ),
    'contents' => 'Long string with file content data',
    'checksum' => 'crc32 checksum code',
    'file_size' => 123445
);
```

# Write to file
Locked to server plugins.  
You provide a path. The path will get folder/file/{plugin_name} before your provided path  
The data are written to the file and the meta data are returned to you.  

## Example write

```
$out = array(
    'to' => array(
        'node' => 'server',
        'plugin' => 'infohub_file',
        'function' => 'write'
    ),
    'data' => array(
        'path' => 'my/path/and/file.jpg',
        'contents' => 'Long string with data to write. You must convert binary files to BASE64 format',
        'allow_overwrite' => 'true'
    ),
    'data_back' => array(
        'step' => 'step_response'
    )
);
```

## Returned data
Observe: The returned path is the cleaned up path that then was used to find the file.  

```
$response = array(
    'answer' => 'true',
    'message' => 'File is written',
    'path' => 'folder/file/mydomain_myplugin/my',
    'created_path' => 'false',
    'path_info' => array(
        'dirname' => 'folder/file/mydomain_myplugin/my/path/and/file.jpg',
        'basename' => 'file.jpg',
        'filename' => 'file',
        'extension' => 'jpg'
    ),
    'file_info' => array(
        'folder_exist' => 'true',
        'is_dir' => 'false',
        'is_file' => 'true',
        'is_link' => 'false',
        'file_exist' => 'true',
        'is_readable' => 'true'
    ),
    'checksum' => 'crc32 checksum code',
    'file_size' => 123445
);
```

# get_folder_structure
Locked to server plugins.  
You can get the folder structure for a path. This is useful if you do not know what folders and files exist and want to navigate trough them.  

## Example how to get folder structure
You get a list of all files that are in folder/file/{mydomain_myplugin}  

```
$out = array(
    'to' => array(
        'node' => 'server',
        'plugin' => 'infohub_file',
        'function' => 'get_folder_structure'
    ),
    'data' => array(),
    'data_back' => array(
        'step' => 'step_response'
    )
);
```

## Returned data

```
$response = array(
    'answer' => 'true',
    'message' => 'File is written',
    'path' => 'folder/file/mydomain_myplugin',
    'pattern' => '*.xml',
    'data' => array(
        'filename.xml' => 'checksum'
        'anotherfile.xml' => 'checksum',
    )
);
```

The server will cache the result for one hour. Any requests within that hour will just get the cached response from the Storage.  

# launcher_get_data
Locked to server plugins infohub_launcher (soon to be deprecated) and infohub_asset.  
You get a list with plugin names that all have the file asset/launcher.json  
This list is saved in the client by infohub_asset and used in infohub_launcher to show what plugins you can start in the workbench.  

```
$out = array(
    'to' => array(
        'node' => 'server',
        'plugin' => 'infohub_file',
        'function' => 'launcher_get_data'
    ),
    'data' => array()
    'data_back' => array(
        'step' => 'step_response'
    )
);
```

## Returned data
Here is what you get  

```
$response = array(
    'answer' => 'true',
    'message' => 'Here are the list of plugin names that can be started in Workbench',
    'data' => array(
        'infohub_demo' => array(),
        'infohub_doc' => array(),
        'infohub_welcome' => array(),
    )
);
```

# asset_get_data
Infohub Asset is used to sync asset files from the server to the client. infohub_asset uses the special function asset_get_data to get the data from infohub_file.  

```
$out = array(
    'to' => array(
        'node' => 'server',
        'plugin' => 'infohub_file',
        'function' => 'asset_get_data'
    ),
    'data' => array(
        'plugin_name' => 'infohub_demo'
    ),
    'data_back' => array(
        'step' => 'step_response'
    )
);
```

## Returned data
The file that do not exist will be in the list but the data is empty, data_size = 0.  

```
$response = array(
    'answer' => 'true',
    'message' => 'Here are the files data',
    'data' => array(
        'infohub_demo/icon/launcher.json' => array(
            'asset_name' => 'icon/launcher.json',
            'contents' => 'Contents of the file',
            'checksum' => 'the data checksum'
        ),
        'infohub_demo/icon/launcher.xml' => array(
            'asset_name' => 'icon/launcher.xml',
            'contents' => 'Contents of the file',
            'checksum' => 'the data checksum'
        ),
        'infohub_demo/config.json' => array(
            'asset_name' => 'config.json',
            'contents' => 'Contents of the file',
            'checksum' => 'the data checksum'
        )
    )
);
```

Now the data are sent to infohub_asset.php on the server. infohub_asset.php then return the data to infohub_asset.js  

# License
This documentation is copyright (C) 2017 Peter Lembke.  
Permission is granted to copy, distribute and/or modify this document under the terms of the GNU Free Documentation License, Version 1.3 or any later version published by the Free Software Foundation; with no Invariant Sections, no Front-Cover Texts, and no Back-Cover Texts.  
You should have received a copy of the GNU Free Documentation License along with this documentation. If not, see [https://www.gnu.org/licenses/](https://www.gnu.org/licenses/).  SPDX-License-Identifier: GFDL-1.3-or-later  

Since 2017-11-05 by Peter Lembke  
Updated 2018-01-22 by Peter Lembke  
