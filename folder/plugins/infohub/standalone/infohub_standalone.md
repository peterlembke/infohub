# Infohub Standalone

Starts ONE workbench plugin as stand alone without any Workbench.

# Introduction

You can start any workbench plugin as a stand alone app without Workbench. You use infohub_standalone and a
configuration in folder/config/infohub_exchange.json  
Example of usage is to have a domain URL with a specific app like: a blog, a bulletin board system, a product browser
and viewer.

# Function startup

The very first message sent by include/start.js send the message to infohub_exchange->startup. Then startup reads
infohub_exchange.json to determine where the next message should go by looking at the URL domain you used.  
You can copy the config file in folder/plugin/infohub/exchange/infohub_exchange.json to folder/config and modify it.

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

The domain name local.infohub.demo run infohub_standalone and that plugin will start infohub_demo.  
You can read more about the startup procedure at: [Node Client](main,node_client)

# Function setup_gui

You can setup your graphical user interface with this function. Standalone has already prepared an area for you. You
will get a box_id that you can fill with whatever you like.  
This box_id is the one and only box_id you get. You need to create the boxes you need within this box_id. I suggest you
start by changing box_mode on this box to "side" or "under"

```
if ($in.step === 'step_start')
{
    return _SubCall({
        'to': {
            'node': 'client',
            'plugin': 'infohub_view',
            'function': 'box_mode'
        },
        'data': {
            'box_id': $in.box_id,
            'box_mode': 'side',
            'digits': '2'
        },
        'data_back': {
            'box_id': $in.box_id,
            'step': 'step_boxes_insert'
        }
    });
}
```

And then start adding the boxes you need.

```
if ($in.step === 'step_boxes_insert')
{
    return _SubCall({
        'to': {
            'node': 'client',
            'plugin': 'infohub_view',
            'function': 'boxes_insert'
        },
        'data': {
            'parent_box_id': $in.box_id,
            'box_position': 'last',
            'box_mode': 'data',
            'box_alias': 'alias_not_used',
            'boxes_data': {
                'first_box': 'My first box',
                'second_box': 'My second box',
                'third_box': 'My third box',
            }
        },
        'data_back': {
            'box_id': $in.box_id,
            'step': 'step_get_icon'
        }
    });
}
```

Now you have some boxes to start with and you can continue creating more boxes in those.

# Boxes

Standalone set up fewer boxes than Workbench does, here is a list of them

* Box "main" contain child boxes "head" and "body" under each other.
* Box "main.head" contain child boxes side by side with icon+title of started plugins.
* Box "main.head.{plugin_name}" one box for each started plugin. Shows plugin icon and title.
* Box "main.body" contain one child box for each started plugin.
* Box "main.body.{plugin_name}" This is your box.

From the example above I created three boxes: first_box, second_box, third_box. The full path for the first_box
is: `main.body.{plugin_name}.first_box`  
When you want to reference "first_box" in you plugin you use: `_GetBoxId() + '.first_box'`,  
To learn more about how to use the boxes I recommend reading: [Infohub_View](plugin,infohub_view)

# License

This documentation is copyright (C) 2019 Peter Lembke.  
Permission is granted to copy, distribute and/or modify this document under the terms of the GNU Free Documentation
License, Version 1.3 or any later version published by the Free Software Foundation; with no Invariant Sections, no
Front-Cover Texts, and no Back-Cover Texts.  
You should have received a copy of the GNU Free Documentation License along with this documentation. If not,
see [https://www.gnu.org/licenses/](https://www.gnu.org/licenses/). SPDX-License-Identifier: GFDL-1.3-or-later

Created 2019-03-11 by Peter Lembke  
Updated 2019-03-11 by Peter Lembke  
