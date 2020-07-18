# Infohub Keyboard
Handles the keyboard. You can subscribe to key combinations and get a message.  

# Introduction
You can subscribe to keyboard key combinations and get a message when that combination happens.  
Infohub Keyboard has a keyup observer that starts as soon as anyone subscribe.  
When you write on your keyboard and use combinations of special keys then an event are triggered and the key data are sent to infohub_keybard.  
This module check if the combination of key + special keys are OK and create an event_key for that combination.  
The event_key are checked against subscribers. The subscribers wanted messages are sent.  

# GUI
In the graphical user interface you can test different keyboard combinations. This is useful when you test InfoHub on different operating systems like Windows, Linux and MaxOS.  
You will see the resulting key combination string.  

# subscribe
You send a message to the subscribe function. Parameter:  

```
"subscriptions": {
    "key_combination_string_1": { the message you want},
    "key_combination_string_2": { the message you want},
    "key_combination_string_3": { },
}
```

In this case you now subscribe to combination 1 and 2. You also unsubscribed to combination 3.  
Many plugins can subscribe to the same key combination.  

# index

```
$key = {
    "key_combination_string_1": {
        "client|infohub_debug": { the message to send },
        "client|infohub_demo": { the message to send},
    }
}
```

The index is where all subscriptions are stored. It is used for quickly looking up all messages to send for a key combination.  
When you unsubscribe to a key combination then the index are updated.  
When you unsubscribe to all then the index are looped trough all key_combinations and your plugin are removed.  
The index are stored in session storage. When the session ends then the session storage are cleared.  

# event_message
When a keyboard combination are pressed, then a message comes to this function. We create a key combination string and check the index for a match.  
All subscribers with this key combination will have their messages sent out.  

# Special keys
The three special keys are CTRL, ALT, SHIFT. You can subscribe to combinations of special keys + a key code.  
Shift is special. You often use SHIFT when you write text so it would produce a lot of event messages.
To avoid this there is a filter in place in the GO function so you can not use just SHIFT + keycode.  
You can have ALT, ALT + SHIFT, CTRL, CTRL + ALT, CTRL + ALT + SHIFT, CTRL + SHIFT  

# Hard coded subscribers
Will be removed from the plugin. NO EXCEPTIONS. These have to be in Infohub_Debug instead.  
shift_alt_ctrl_49 ("1") - Refresh the page when the ban time has ended.  
shift_alt_ctrl_49 ("2") - Updates the local plugins and refresh the page when the ban time has ended.  
shift_alt_ctrl_50 ("3") - Removes the local plugins and refresh the page when the ban time has ended.  
shift_alt_ctrl_51 ("4") - Removes the local plugins and all data and refresh the page when the ban time has ended.  
shift_alt_ctrl_57 ("9") - Silently delete all render cache for the logged in user  
shift_alt_ctrl_48 ("0") - Triggers a logout and refresh  
The data in the local database are not touched.  

# License
This documentation is copyright (C) 2018 Peter Lembke.  
Permission is granted to copy, distribute and/or modify this document under the terms of the GNU Free Documentation License, Version 1.3 or any later version published by the Free Software Foundation; with no Invariant Sections, no Front-Cover Texts, and no Back-Cover Texts.  
You should have received a copy of the GNU Free Documentation License along with this documentation. If not, see [https://www.gnu.org/licenses/](https://www.gnu.org/licenses/).  SPDX-License-Identifier: GFDL-1.3-or-later  

Created 2018-07-11 by Peter Lembke  
Updated 2020-07-17 by Peter Lembke  
