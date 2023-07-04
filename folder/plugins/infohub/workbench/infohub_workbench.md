# InfoHub Workbench

Handles the screen set up for your plugins.

# Introduction

InfoHub Workbench handle what you see on the screen. It sets up the basic graphical user interface. And it
starts [infohub_launcher](plugin,infohub_launcher).

InfoHub Workbench gives you the possibility to start your plugins and switch between started plugins.

# Function startup

The function "startup" has nothing to do with Workbench. The very first message sent by include/start.js send the
message to infohub_exchange->startup.

Then startup reads infohub_exchange.json to determine where the next message should go by looking at the URL domain you
used.

So startup really has nothing to do with Workbench. You will usually not use any function called "startup" in your
plugins. You can read more about the startup procedure at: [Node Client](main,node_client)

# Function set up_gui

You can set up your graphical user interface with this function. Workbench has already prepared an area for you. You will
get a box_id that you can fill with whatever you like.

This box_id is the one and only box_id you get. You need to create the boxes you need within this box_id. I suggest you
start by changing box_mode on this box to "side" or "under" so you can create more boxes.

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

Now you have some boxes to start with, and you can continue creating more boxes in those.

# Boxes

Workbench set up a lot of boxes, here is a list of them

- Box "main" contain child boxes "head" and "body" under each other.
- Box "main.head" contain child boxes side by side with icon+title of started plugins.
- Box "main.head.{plugin_name}" one box for each started plugin. Shows plugin icon and title.
- Box "main.body" contain one child box for each started plugin.
- Box "main.body.{plugin_name}" This is your box.

From the example above I created three boxes: first_box, second_box, third_box. The full path for the first_box is:
main.body.{plugin_name}.first_box  
When you want to reference the "first_box" in your plugin you use: `_GetBoxId() + '.first_box',`.  
To learn more about how to use the boxes I recommend reading: [InfoHub_View](plugin,infohub_view)

# Launcher

The plugin InfoHub_Launcher is auto started by Workbench. Launcher show two lists. One is "Available plugins", that
is a list of plugins that can be started from Workbench. The list come from the server and is the same for every
visitor.

You can click an icon and add it to "My list". The other list is "My list". That list show all plugins you want in your
list. This list is personal and stored in your browser cache.

You can "Remove" and icon from "My list" and you can "Run" a plugin from "My list".

Read more about: [InfoHub_Launcher](plugin,infohub_launcher)

# License

This documentation is copyright (C) 2016 Peter Lembke.  
Permission is granted to copy, distribute and/or modify this document under the terms of the GNU Free Documentation
License, Version 1.3 or any later version published by the Free Software Foundation; with no Invariant Sections, no
Front-Cover Texts, and no Back-Cover Texts.  
You should have received a copy of the GNU Free Documentation License along with this documentation. If not,
see [https://www.gnu.org/licenses/](https://www.gnu.org/licenses/). SPDX-License-Identifier: GFDL-1.3-or-later

Created 2016-04-01 by Peter Lembke  
Updated 2020-03-28 by Peter Lembke  
