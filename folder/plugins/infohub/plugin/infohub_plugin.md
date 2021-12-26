# Infohub Plugin

Finds and starts your plugin

# Introduction

Purpose of Infohub Plugin is to find and start plugins. The plugin is part of the core and exist in a server version (
PHP) and in a client version (Javascript).

# Infohub Plugin on the server

The server version are started by infohub.php as one of the core plugins that need to be started before Infohub can
function properly.  
When we get a plugin_request then we check if there is a plugin file in the plugin folder with the right extension. We
can handle plugins for other nodes too.  
If the file was not found then we send a request to the Storage. If the Storage do not have the plugin then we return
a "sorry, the plugin was not found".  
If the found plugin will be used on this node then we start the plugin. If the found plugin will be used on another node
then we return the plugin code to that node can start the plugin.

# Infohub Plugin on the client

The client version are started by start.js as one of the core plugins that need to be started before Infohub can
function properly.  
When we get a plugin_request then we check in local storage if the plugin is here. If it is not too old then it is
started.  
If we do not have the plugin, or it is too old, and we do have access to a network, then we do a plugin_request to the
server. The server can say that the plugin we already have is just fine or the server can send us a newer version of the
plugin, or the server can say that we should just throw away the plugin. We update the local storage and start the
plugin if it still exists.  
The client will only handle one version of the plugin, the one that we got from the server. The server decide what
version we should have.

# Plugin files or plugins in the Storage

You can store plugins as files on the web server, or you can store plugins as data in the server Storage.  
While you develop plugins it is practical to use files since all development tools use files. You probably use xdebug
for PHP development and that need the plugin to be a file.  
When the plugin is finished then it is easier to transfer it to the Storage because then you will be able to have
different versions of the plugin and dynamically load the right version.  
You can also easily set up more nodes that share the same Storage. Then they will all have access to the same plugins in
the Storage.

# CSS file

Each plugin can have a CSS file. Having a CSS file is very much discouraged, and I urgently promote using no CSS at all,
or second best use the existing CSS in the rendered components.  
infohub_view has a global css file for the boxes to work. In Infohub View you find the string "{infohub_view.css}" that
will be substituted with the content from the css file.  
The render plugins all use segmented CSS that are built into the code. So they do not use global CSS. Segmented CSS in
the code is the preferred way to use CSS. Affect things globally is bad.  
There is also a CSS file in infohub_exchange.css. That file is included in index.php. This file has a @TODO to be moved
and updated.

# Configuration

You can have a configuration file for each plugin. It can look like this:

```
{
    "client": {
        "domain": {
            "default": {
                "node": "client",
                "plugin": "infohub_workbench",
                "function": "startup"
            },
            "www.infohub.se": {
                "node": "client",
                "plugin": "infohub_workbench",
                "function": "startup"
            },
            "local.infohub.workbench": {
                "node": "client",
                "plugin": "infohub_workbench",
                "function": "startup"
            },
            "local.pi3.workbench": {
                "node": "client",
                "plugin": "infohub_workbench",
                "function": "startup"
            },
            "local.infohub.demo": {
                "node": "client",
                "plugin": "infohub_standalone",
                "function": "startup",
                "data": {
                    "plugin_name": "infohub_demo"
                }
            },
            "local.infohub.welcome": {
                "node": "server",
                "plugin": "infohub_random",
                "function": "random"
            }
        }
    },
    "server": {}
}
```

This example come from infohub_exchange.json. The client part will be bundled with the plugin and the server part will
only be visible and used on the server.

You place the json file together with your plugin file. You can place a config in `folder/config` if you want to have
custom settings for your site. For example `folder/config/infohub_exchange.json`.

* The config file in folder/config will be used.
* If no file exist in folder/config then the config file with the plugin will be used.
* If there are no config file then you get an empty config.

# Assets, has_assets

A plugin can have assets. See [infohub_asset](plugin,infohub_asset).
Normally the assets are downloaded by [infohub_workbench](plugin,infohub_workbench) when you start a plugin from the Workbench.
If a plugin is standalone then you can add a flag: has_assets, in the Version data.  
```
const _Version = function() {
    return {
        'date': '2021-06-06',
        'since': '2018-05-30',
        'version': '1.0.1',
        'checksum': '{{checksum}}',
        'class_name': 'infohub_renderform',
        'note': 'Adds more features to the basic render form elements',
        'status': 'normal',
        'SPDX-License-Identifier': 'GPL-3.0-or-later',
        'user_role': 'user',
        'web_worker': 'true',
        'core_plugin': 'false',
        'has_assets': 'true'
    };
};
```
Then the assets are downloaded using the function infohub_asset->update_all_plugin_assets. 

# License

This documentation is copyright (C) 2016 Peter Lembke.  
Permission is granted to copy, distribute and/or modify this document under the terms of the GNU Free Documentation
License, Version 1.3 or any later version published by the Free Software Foundation; with no Invariant Sections, no
Front-Cover Texts, and no Back-Cover Texts.  
You should have received a copy of the GNU Free Documentation License along with this documentation. If not,
see [https://www.gnu.org/licenses/](https://www.gnu.org/licenses/). SPDX-License-Identifier: GFDL-1.3-or-later

Updated 2021-08-03 by Peter Lembke  
Since 2016-04-01 by Peter Lembke  
