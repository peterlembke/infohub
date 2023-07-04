# InfoHub Render Link

Render different kind of links on the screen

# Introduction

You can render different kind of links. The user cam click on a link to make something happen.  
A triggered link produces a message that goes into the normal message queues.  
You can create different types: link, toggle, external, embed

# type: link

Creates an event link that will send a message. It will be sent to the same node (Node: client), to the plugin you state
in to_plugin, to function: event_message.  
In the example below the message will goto plugin infohub_demo. The link will get a unique ID but also an alias.

```
'demo_head': {
    'type': 'link',
    'subtype': 'link',
    'alias': 'demo_head_link',
    'data': 'demo_head',
    'show': 'Head, add demo boxes',
    'to_plugin': 'infohub_demo'
}
```

The HTML look like this

```
<div name="demo_head" class="a1201_demo_head" style="display: inline;">
    <style scoped="">
        .a1201_demo_head .link { color: rgba(68, 69, 166, 0.89); }
    </style>
    <a id="1201_demo_head" name="demo_head" class="link"
       renderer="infohub_render_link" type="link" data="demo_head" alias="demo_head"
       to_node="client" to_plugin="infohub_demo" to_function="event_message"
       onclick="go('infohub_demo','click','1201_demo_head')">
        Head, add demo boxes
    </a>
</div>
```

When you click the link you trigger the go() function.  
The definition is go($pluginName, $eventType, $boxId); The first parameter 'infohub_demo' is what plugin should have
this message. eventType is a string. boxId is the ID of the "a"-tag.  
go() pull out every piece of information from the "a" tag and send the message to the plugin: infohub_demo. The message
look like this:

```
{
    "callstack": [],
    "data": {
        "alias": "demo_head",
        "box_id": "1201_demo_head",
        "class": "link",
        "data": "demo_head",
        "event_type": "click",
        "id": "1201_demo_head",
        "name": "demo_head",
        "onclick": "go('infohub_demo','click','1201_demo_head')"
        "parent_id": "",
        "renderer": "infohub_render_link",
        "to_function": "event_message",
        "to_plugin": "infohub_demo",
        "to_node": "client",
        "type": "link"
    },
    "to": {
        "node": "client",
        "plugin": "infohub_demo",
        "function": "event_message"
    }
}
```

Now it is up to the plugin infohub_demo in its event_message function to handle this message.

# type: toggle

Toggle visibility for the item alias you set in 'data'. The item alias must exist in the same box as the link.  
You create a toggle link like this:

```
{
    'type': 'link',
    'subtype': 'toggle',
    'show': 'Link text',
    'toggle_alias': 'content'
};
```

The toggle_alias is to the item you want to toggle. Must be within the same box as the link.  
The HTML look like this

```
<a id="1202_my_presentation_box_head" name="head" class="link"
   renderer="infohub_render_link" type="toggle"
   data="eyJ0b2dnbGVfaWQiOiJ7Ym94X2lkfV9jb250ZW50In0=" alias="head"
   to_node="client" to_plugin="infohub_view" to_function="toggle"
   onclick="go('infohub_view', 'toggle', '1202_my_presentation_box_content')">
    <div id="1202_my_presentation_box_head_data" name="head_data" class="container" style="display: block">
        This is a Google Map
    </div>
</a>
```

When you click the link you trigger the go() function.  
The definition is go($pluginName, $eventType, $boxId); The first parameter 'infohub_view' is what plugin should have
this message. eventType is a string. boxId is the ID of the "a"-tag.  
As you can see the boxId point to another object that I have omitted in this example. It is that object that will be
toggled visible/invisible.  
The data tag have some base64 encoded data. Decoded it is {"toggle_id":"{box_id}_content"}. That data is actually not
used. Later versions will probably remove it.  
go() pull out every piece of information from the "a" tag and send the message to the plugin: infohub_view. The message
look like this:

```
{
    'callstack': [],
    'data': {
        'box_id': '1202_my_presentation_box_content',
        'class': 'container',
        'event_type': 'toggle',
        'id': '1202_my_presentation_box_content',
        'name': 'content',
        'parent_id': '',
        'style': 'display: block;'
    },
    'to': {
        'node': 'client',
        'plugin': 'infohub_view',
        'function': 'event_message'
    }
}
```

InfoHub View get the event_message, read the box_id and check if it is visible or not. Then sets the other state. Done.

# type: external

Creates an external link that will open in a new tab.   
You create an external link like this:

```
'istanbul_marathon': {
    'type': 'link',
    'subtype': 'external',
    'show': 'Istanbul marathon',
    'url': 'http://www.istanbulmarathon.org/'
},
```

The HTML look like this

```
<div name="istanbul_marathon" class="a1202_istanbul_marathon" style="display: inline;">
    <style scoped="">
        .a1202_istanbul_marathon .link { color: rgba(68, 69, 166, 0.89); }
    </style>
    <i>
        <a id="1202_istanbul_marathon" name="istanbul_marathon"
           class="link" renderer="infohub_render_link" type="external"
           data="aHR0cDovL3d3dy5pc3RhbmJ1bG1hcmF0aG9uLm9yZy8=" alias="istanbul_marathon"
           onclick="go('infohub_render','external','1202_istanbul_marathon')">
            Istanbul marathon
        </a>
    </i>
</div>
```

Take special notice of the display: inline used on the div box. That makes the link a part of the text it is in.  
The URL have been base64 encoded into data.  
When you click the link you trigger the go() function.  
The definition is go($pluginName, $eventType, $boxId); The first parameter 'infohub_render' is what plugin should have
this message. eventType is a string. boxId is the ID of the "a"-tag.  
go() pull out every piece of information from the "a" tag and send the message to the plugin: infohub_render. The
message look like this:

```
{
    "callstack": [],
    "data": {
        "alias": "istanbul_marathon",
        "box_id": "1202_istanbul_marathon",
        "class": "link",
        "data": "aHR0cDovL3d3dy5pc3RhbmJ1bG1hcmF0aG9uLm9yZy8=",
        "event_type": "external",
        "id": ""1202_istanbul_marathon"",
        "name": ""istanbul_marathon"",
        "onclick": "go('infohub_render','external','1202_istanbul_marathon')",
        "parent_id": "",
        "renderer": "infohub_render_link",
        "type": "external"
    },
    "to": {
        "node": "client",
        "plugin": "infohub_render",
        "function": "event_message"
    }
}
```

When infohub_render get the event message it check the type=external, decode the data and open a new tab/windows with
the URL.

# type: embed

Creates an embedded link that will show embedded html. You add normal HTML in $htmlToEmbed. It will be base64 encoded
later so the HTML is not active.  
You can see a usage example of this in plugin: infohub_rendermajor.

```
{
    'type': 'link',
    'subtype': 'embed',
    'show': $htmlToShow,
    'embed': $htmlToEmbed
};
```

The code generated look something like this

```
<a id="1203_my_presentation_box_content_data_link"
    name="content_data_link" class="link"
    renderer="infohub_render_link" type="embed"
    data="PGRpdiBuYW1lPSJteV9tYXAiIGNsYXN and so on..."
    alias="content_data_link"
    onclick="go('infohub_view','embed','1203_my_presentation_box_content_data_link')">
    <div name="my_image" class="a1203_my_image">
        <style scoped="">
            .a1203_my_image .image {
                border-radius: 15px 15px 15px 15px;
                width: 100%; clear: both; display: block;
                box-sizing: border-box;
            }
        </style>
        <img id="1203_my_image" name="my_image" class="image"
             src="data:image/png;base64,/9j/4AAQSkZJRgABAQEASABI and so on...">
    </div>
</a>
```

When you click the link you trigger the go() function.  
The definition is go($pluginName, $eventType, $boxId); The first parameter 'infohub_view' is what plugin should have
this message. eventType is a string. boxId is the ID of the "a"-tag.  
go() pull out every piece of information from the "a" tag and send the message to the plugin: infohub_view. The message
look like this:

```
{
    'callstack': [],
    'data': {
        'alias': '"content_data_link"',
        'box_id': '1202_my_presentation_box_content_data_link',
        'class': 'link',
        'data': 'PGRpdiBuYW1lPSJteV9tYXAiIGNsYXN and so on...',
        'event_type': 'embed',
        'id': '1202_my_presentation_box_content_data_link',
        'name': 'content_data_link',
        'onclick': 'go('infohub_view','embed','1202_my_presentation_box_content_data_link')',
        'parent_id': '',
        'renderer': 'infohub_render_link',
        'type': 'enbed'
    },
    'to': {
        'node': 'client',
        'plugin': 'infohub_view',
        'function': 'event_message'
    }
}
```

Why are this message sent to infohub_view? Because this action is generic and InfoHub View is the owner of the screen
manipulations. No other plugin is allowed to do this on the screen.  
View decode the base64 data. Pulls out the main box id (in this case 1202) and insert that number in the embedded html.
Then substitute the existing HTML in the "a" tag. The div-tag with "my_image" is now gone, and we instead have a Google
Map here.

# License

This documentation is copyright (C) 2017 Peter Lembke.  
Permission is granted to copy, distribute and/or modify this document under the terms of the GNU Free Documentation
License, Version 1.3 or any later version published by the Free Software Foundation; with no Invariant Sections, no
Front-Cover Texts, and no Back-Cover Texts.  
You should have received a copy of the GNU Free Documentation License along with this documentation. If not,
see [https://www.gnu.org/licenses/](https://www.gnu.org/licenses/). SPDX-License-Identifier: GFDL-1.3-or-later

Created 2017-02-11 by Peter Lembke  
Updated 2017-09-23 by Peter Lembke  
