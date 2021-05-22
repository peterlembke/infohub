# Infohub Launcher

Used to show plugin icons that can be clicked to start the plugin.

# Introduction

Launcher let you see icons of plugins that can be started. When you click to start a plugin, then Workbench is the one
that actually start the plugin.  
Launcher is a plugin with a graphical user interface that runs in Workbench. Workbench auto start this plugin.  
You see two lists, one list with your plugins in the order you want them. And then you have a hidden list with plugins
that you can add to your list.  
You can click any icon and it will expand to show you a description, the icon license. If the icon is in my_list you
also see two buttons: start, remove.  
If the icon is in the full_list then you se one button: add to my_list.  
my_list are saved locally.  
full_list come from the server. It is also stored locally for speed.

# get_launch_information

Used by Workbench. Standard function that exist on all plugins that should show up in Workbench. Calls client->
infohub_asset->get_launch_information and returns the answer

# Setup the GUI

When Workbench have set up the basic boxes needed it will call this plugin and function: setup_gui.  
We change mode on the plugin box we got from Workbench so it can contain boxes that display under each other. Three
boxes are inserted in the box, under each other: switch_button, lists, information.  
switch_button - render a rendermajor with a form button that send a message to infohub_launcher->switch_button  
lists - Insert two boxes: my_list, full_list. Both get a rendermajor with no data in it. full_list are then hidden.  
Both lists are then rendered with infohub_launcher->render_list.  
Finally the instructions box get a rendermajor with instructions.

# switch_button

Switch between the two lists with icons  
The visibility on full_list are switched between visible/invidible. Same with local_list.

# render_list

Render my_list or full_list. Get the list data from Storage.  
We have the list, now we ask infohub_asset->get_launch_list to add all data we need. We need icon for each plugin.  
Get the refresh icon from the assets. Add the refresh icon render instructions. Add all the other icon render
instructions. Render the icons in my_list och in full_list.

# refresh_list

Call update_local_list and call render_list in a multi message.

# get_list

Give the list name and you will get the full_list or my_list.  
Used by any plugin that would like to read the lists.  
If you would try to read the Storage directly from your plugin you would will get:
"I only accept paths that start with the calling plugin name"

# update_full_list

Update the local copy of the full_list. The full_list lists all plugins that can be started from Launcher.  
If you already have a full_list then it is used regardless of how old it is. An update will be done in the background.
If you do not have a full_list then we wait for the updated list and then render it.

The full_list has a field "valid_at_epoc". If the valid_at_epoc is less than an hour ago then do nothing. We exit this
function. If the list is old then do an update by sending the checksum you have to the server, infohub_launcher,
update_local_list.

```
{
    "name": "full_list",
    "client_checksum": "dffdfdfgghh"
}
```

The server has its full_list cached too and can quickly compare the client_checksum you sent with the checksum of the
list. If the full_list is old then it will be updated and cached.  
You will get a response from the server that might look like this:

```
{
    "answer": "true",
    "message": ""Here are the list of plugin names that can be started in Launcher",
    "data": {
        "name": "full_list",
        "client_checksum": "dffdfdfgghh",
        "do": "update", // If checksum and client_checksum are the same then "keep", else "update"
        "micro_time": 1542134832.44233, // Current seconds since EPOC. Up to the client to decide when they feel that the list is old.
        "time_stamp": "2018-11-13 19:47:59", // Current date and time
        "list_checksum": "abc123def456", // MD5 checksum of the "list"
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
    }
}
```

Check "do" and see what to do with the list

- "keep", then we keep the list we already have
- "update", then we update the list we have. The full response are saved as it is in the Storage and the list are also
  sent to client -> infohub_asset -> update_specific_assets

# my_list_add

Adds the plugin to my_list. The my_list are saved in Storage.

# my_list_remove

Removes a plugin from my_list. The my_list are saved in Storage.

# plugin_information

Show information about a plugin

# event_message

Events for all the buttons

# License

This documentation is copyright (C) 2017 Peter Lembke.  
Permission is granted to copy, distribute and/or modify this document under the terms of the GNU Free Documentation
License, Version 1.3 or any later version published by the Free Software Foundation; with no Invariant Sections, no
Front-Cover Texts, and no Back-Cover Texts.  
You should have received a copy of the GNU Free Documentation License along with this documentation. If not,
see [https://www.gnu.org/licenses/](https://www.gnu.org/licenses/). SPDX-License-Identifier: GFDL-1.3-or-later

Since 2017-03-22 by Peter Lembke  
Updated 2018-11-11 by Peter Lembke  
