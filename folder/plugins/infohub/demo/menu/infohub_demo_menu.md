# Infohub Demo Menu
Displays a menu with all demos  

# Introduction
This plugin renders a menu with all the demos.  
Read more about menus here: [Infohub Render Menu](plugin,infohub_rendermenu)  

# Click the menu
The menu are rendered in this plugin. You see that the to_plugin is infohub_demo. This is because only level 1 plugins can receive an event messages.  
You also see that to_function is menu_click. But how does the event come to that function?  

```
<button id="120201_my_menu_map_demo"
        name="map_demo" class="button" type="button"
        renderer="infohub_render_form" data="map_demo"
        alias="map_demo" mode="button"
        to_node="client"
        to_function="menu_click"
        to_plugin="infohub_demo"
        onclick="go('infohub_render','click','120201_my_menu_map_demo')
        ">
    Map services
</button>
```

The onClick event run the go() function that you can find in folder/include/the_go_function.js  
The go() function will collect all parameters in the button and send them to plugin infohub_render and its function: event_message. The reason for that is because infohub_render_form rendered the button and the parent want to handle the event for the button.  
Infohub Render send a message with all data it has to to_node, to_plugin, to_function. Now the event ends up in menu_click.  
Why can I not say that the event should go to infohub_demo_menu and handle it there? That is because of the rules who is allowed to talk to who. A plugin can answer its parent, get answers from its children and talk to its siblings. It is a security thing.  

# License
This documentation is copyright (C) 2018 Peter Lembke.  
Permission is granted to copy, distribute and/or modify this document under the terms of the GNU Free Documentation License, Version 1.3 or any later version published by the Free Software Foundation; with no Invariant Sections, no Front-Cover Links, and no Back-Cover Links.  
You should have received a copy of the GNU Free Documentation License along with this documentation. If not, see [https://www.gnu.org/licenses/](https://www.gnu.org/licenses/).  

Since 2018-09-18 by Peter Lembke  
Updated 2018-09-18 by Peter Lembke  
