# InfoHub Offline

Prepares you for going offline. Also handles the online/offline event, so you can subscribe to it.

# Introduction

This plugin does two things, download data, so you can go offline, and handle subscriptions for the online/offline
event.  
You can download all client plugins, all assets and finally all documentation.  
You can also see in this plugin if you are online or offline.  
This plugin also handle if others want to subscribe to online/offline events.

# GUI

In the graphical user interface you see if you are online or offline on an indicator.  
You have a button for downloading all plugins, a button for downloading all assets, a button for downloading all
documentation.  
A button that will show you data about all subscribers to the online/offline event.

# Indicator

The indicator is two images with a text on each.

# Download plugins

Normally a missing plugin is downloaded automatically and stored in local storage for repeated use. This works really
well but requires that you have a connection to the server.  
After you have used most of the functions you also have most of the plugins. But still some plugins can be missing. If a
plugin is missing then nothing special happens, you just can't use that function.  
By downloading all plugins with this function you prepare yourself for working offline.  
The function always download all plugins regardless of what you already have stored locally. This will change in future
releases so only the new/changed plugins will be downloaded.

# Download assets

Plugins that have a GUI (Graphical User Interface) also have assets (icons, images etc.). When these assets are needed
but are missing in the Storage then they are downloaded and stored locally. This requires that you have a working
connection to your server. If you are offline then the asset are not downloaded and in best case you will see a
substitute image, a blue circle.  
With this function you can download all assets and store then locally. Then you know you are prepared for going
offline.  
The function always download all assets regardless of what you already have stored locally. This will change in future
releases so only the new/changed assets will be downloaded.

# Download documentation

The infohub_doc plugin do a great job displaying the xml doc files. If a documentation is missing in the local Storage
then it is downloaded automatically. This requires that you have a working connection to the server.  
In infohub_doc there is already a button for downloading all the documentation. The button in this plugin simply use the
already working feature in infohub_doc.

# subscribe

You send a message to the subscribe function. Parameter:

```
"subscriptions": {
    "online": { the message you want},
    "offline": { },
}
```

In this case you now subscribe to the online event. You also unsubscribed to the offline event.  
Many plugins can subscribe to the same key.

# index

```
$key = {
    "key_combination_string_1": {
        "client|infohub_debug": { the message to send },
        "client|infohub_demo": { the message to send},
    }
}
```

The index is where all subscriptions are stored. It is used for quickly looking up all messages to send for a key.  
When you unsubscribe to a key then the index are updated.  
When you unsubscribe to all then the index are looped through all key combinations and your plugin are removed.  
The index is stored in session storage. When the session ends then the session storage are cleared.

# event_message

When an offline event occur, then a message comes to this function. We create a key string and check the index for a
match.  
All subscribers with this key will have their messages sent out.

# Hard coded subscribers

DEPRECATED: online and offline - Always sent to InfoHub_Transfer.

# Service worker - update

Service worker is now updated during refresh if the last check is at least 10 minutes old, and you get a response from
the server and the checksum are different compared to what you have - then the service worker are unregistered and the
page is refreshed when the ban time is up.

# License

This documentation is copyright (C) 2018 Peter Lembke.  
Permission is granted to copy, distribute and/or modify this document under the terms of the GNU Free Documentation
License, Version 1.3 or any later version published by the Free Software Foundation; with no Invariant Sections, no
Front-Cover Texts, and no Back-Cover Texts.  
You should have received a copy of the GNU Free Documentation License along with this documentation. If not,
see [https://www.gnu.org/licenses/](https://www.gnu.org/licenses/). SPDX-License-Identifier: GFDL-1.3-or-later

Created 2018-10-26 by Peter Lembke  
Updated 2019-11-14 by Peter Lembke  
