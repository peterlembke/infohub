# InfoHub RenderAdvancedList

Renders an advanced list.

# Introduction

With InfoHub_AdvancedList you can show an advanced list with expandable nodes. The features are:

- HTML-list with optional indents (lists in lists)
- Each node can be default expanded or contracted
- Unicode-characters (default) or optional SVG images for the expand/contract buttons

# How to use

In this example you get a presentation box with a head label and in the contents of the box you have an advanced list.
The expand button and contract button are custom icons. If you omit them you get standard unicode characters instead. The
options in the list are in the $option variable.

```
'to': {
    'node': 'client',
    'plugin': 'infohub_render',
    'function': 'create'
},
'data': {
    'what': {
        'my_presentation_box': {
            'plugin': 'infohub_rendermajor',
            'type': 'presentation_box',
            'head_label': 'Navigation',
            'foot_text': '',
            'content_data': '[my_list]'
        },
        'my_list': {
            'plugin': 'infohub_renderadvancedlist',
            'type': 'advanced_list',
            'subtype': 'list',
            'label_expand': '[expand]', // Leave this out to get a standard unicode character instead
            'label_contract': '[contract]', // Leave this out to get a standard unicode character instead
            'option': $option,
            'separator': '_' // For the nodes in the $option array data
        },
        'expand': {
            'type': 'common',
            'subtype': 'image',
            'data': 'data:image/svg+xml;base64, BASE64 encoded data',
            'css_data': {
                '.image': 'width: 32px; height: 32px; display: inline-block; vertical-align: middle; padding: 0px 0px 0px 12px'
            }
        },
        'contract': {
            'type': 'common',
            'subtype': 'image',
            'data': 'data:image/svg+xml;base64, BASE64 encoded data',
            'css_data': {
                '.image': 'width: 32px; height: 32px; display: inline-block; vertical-align: middle; padding: 0px 0px 0px 12px'
            }
        }
    },
    'how': {
        'mode': 'one box',
        'text': '[my_presentation_box]'
    },
    'where': {
        'box_id': _GetBoxId() + '.navigation',
        'max_width': 320
    }
},
'data_back': {
    'step': 'step_end'
}
```

# The options variable

The option variable is an array (normal numbered) with stored objects. Each object has "label" = "Some text", "level"
= "some_level_depth". For example:

```
$option.push({
    'label': $html,
    'level': $area + '_' + $docName
});
```

Note in the "how" section that the example mention a "separator". It is that separator that chop up the "level" into
nodes that are then put together as lists in lists.

# HTML in the label

If you want the items in the list to be clickable then you can see how that is done in infohub_doc.  
This is a real example from the rendering of the navigator list in InfoHub Doc:  
Observe that the "label" is not a proper string. All " need to be \" inside the string.

```
{
    'label': "<a href="#header" onclick="go('infohub_doc','click','{box_id}_main_core_extended')" id="{box_id}_main_core_extended" area="main" document_name="core_extended" to_node="client" to_plugin="infohub_doc" to_function="event_message" class="link" renderer="infohub_doc" type="link">Additional InfoHub plugins</a>",
    'level': "main_core_extended"
}
```

# Event messages

There are event messages but they goto infohub_advancedlist when you expand/contract a level. If you use HTML links in
the labels then you probably also want an event_message function to handle them. Once again you can check infohub_doc
how this is done.

# License

This documentation is copyright (C) 2017 Peter Lembke.  
Permission is granted to copy, distribute and/or modify this document under the terms of the GNU Free Documentation
License, Version 1.3 or any later version published by the Free Software Foundation; with no Invariant Sections, no
Front-Cover Texts, and no Back-Cover Texts.  
You should have received a copy of the GNU Free Documentation License along with this documentation. If not,
see [https://www.gnu.org/licenses/](https://www.gnu.org/licenses/). SPDX-License-Identifier: GFDL-1.3-or-later

Since 2017-12-11 by Peter Lembke  
Updated 2018-04-10 by Peter Lembke  
