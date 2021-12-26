# Infohub Tabs

Handle the windows so you can create tabs.

# Introduction

Creates two boxes under each other: head and a body. Tabs can add or remove a box in head and a box in body. Both boxes
have the same alias.  
You can add any content to the head and body box. You can tell what body box you want to show. That is all this plugin
does.

# How to use

Here are examples how you can use the tab's plugin.

## Initialize the tab system

```
'to': {
    'node': 'client',
    'plugin': 'infohub_tabs',
    'function': 'init'
},
'data': {
    'parent_box_id': 'main.body.my_plugin'
},
'data_back': {
    'step': 'step_end'
}
```

# Add a tab

In this example we want to add one tab to the already initialized boxes. A tab will only be added if the alias is unique
among the tabs.  
You will get results back how it went.

```
'to': {
    'node': 'client',
    'plugin': 'infohub_tabs',
    'function': 'add'
},
'data': {
    'parent_box_id': 'main.body.my_plugin'
    'tab_alias': 'my_new_tab2'
},
'data_back': {
    'step': 'step_end'
}
```

# Remove a tab

In this example we will remove a tab. You will get results back how it went.

```
'to': {
    'node': 'client',
    'plugin': 'infohub_tabs',
    'function': 'remove'
},
'data': {
    'parent_box_id': 'main.body.my_plugin'
    'tab_alias': 'my_new_tab2'
},
'data_back': {
    'step': 'step_end'
}
```

# Add data to tab

In this example we will add data to a tab box. You will get results back how it went.  
We will add a text with a highlight to 'my_tabs.body.my_new_tab'. As you can see this is a normal rendering to a box. In
this case it will find the box with alias 'my_new_tab' and insert the data in that box.

```
return {
    'to': {
        'node': 'client',
        'plugin': 'infohub_render',
        'function': 'create'
    },
    'data': {
        'what': {
            'my_text': {
                'type': 'text',
                'text': "This is the [light]highlighted part[/light] of the text."
            },
            'light': {
                'type': 'common',
                'subtype': 'containerStart',
                'class': 'light',
                'tag': 'span'
            },
            '/light': {
                'type': 'common',
                'subtype': 'containerStop',
                'tag': 'span'
            }
        },
        'how': {
            'mode': 'one box',
            'text': '[my_text]'
        },
        'where': {
            'box_id': 'main.body.my_plugin.my_new_tab2',
            'max_width': 960
        }
    },
    'data_back': {'step': 'step_end'}
};
```

# siblings_box_view

In this example we will hide all siblings to a specific box.

```
'to': {
    'node': 'client',
    'plugin': 'infohub_tabs',
    'function': 'siblings_box_view'
},
'data': {
    'box_id': 'main.body.my_plugin.my_new_tab2,
    'box_view': '1', // 1 is default.
    'siblings_box_view': '' // empty string is default. Leave empty to get opposite from box_view. '0' = hide, '1' = show.
},
'data_back': {
    'step': 'step_end'
}
```

# event_message

When you click on a tab then an event triggers. You can see the receiving function at the bottom of infohub_tabs. First
the data area made visible and all siblings are hidden. Then the tab is highlighted.

# Demo

Infohub Tabs are used in infohub_workbench.js , Search for "infohub_tabs" and you will see how tabs are used.

# License

This documentation is copyright (C) 2017 Peter Lembke.  
Permission is granted to copy, distribute and/or modify this document under the terms of the GNU Free Documentation
License, Version 1.3 or any later version published by the Free Software Foundation; with no Invariant Sections, no
Front-Cover Texts, and no Back-Cover Texts.  
You should have received a copy of the GNU Free Documentation License along with this documentation. If not,
see [https://www.gnu.org/licenses/](https://www.gnu.org/licenses/). SPDX-License-Identifier: GFDL-1.3-or-later

Since 2017-10-13 by Peter Lembke  
Updated 2018-01-28 by Peter Lembke  
