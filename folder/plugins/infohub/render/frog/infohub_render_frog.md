# InfoHub Render Frog

Fallback render plugin that render a frog where you make a mistake

# Introduction

To make a frog is a swedish expression for speaking first and thinking afterwards. In InfoHub you can render things on
the screen. If you make a mistake and have the wrong syntax then an image of a grog are shown instead. It is this plugin
that are the fallback in those cases.

# Demo

The [InfoHub Demo Frog](plugin,infohub_demo_frog) show you in detail how this works.

```
$data = {
    'to': {
        'node': 'client',
        'plugin': 'infohub_render',
        'function': 'create'
    },
    'data': {
        'what': {
            'my_text': {
            'type': 'text',
            'text': 'I made a frog is a Swedish expression for making a mistake. Jag gjorde en groda. [my_frog_text][my_frog][my_mistake1_text][my_mistake1][my_mistake2_text][my_mistake2]'
        },
        'my_frog_text': {
            'type': 'common',
            'subtype': 'value',
            'data': 'Correct, The frog below is rendered by calling the render_frog plugin.'
        },
        'my_frog': {
            'type': 'frog'
        },
        'my_mistake1_text': {
            'type': 'common',
            'subtype': 'value',
            'data': 'Mistake #1, The frog below were rendered by calling render_common with the none existing subtype fizbaz. That gives a frog and an error message on top.'
        },
        'my_mistake1': {
            'type': 'common',
            'subtype': 'fizbaz',
            'data': 'My mistake #1'
        },
        'my_mistake2_text': {
            'type': 'common',
            'subtype': 'value',
            'data': 'Mistake #2, The frog below were rendered by calling the none existing plugin foobar. That gives a frog and an error message on top.'
        },
        'my_mistake2': {
            'type': 'foobar',
            'data': 'My mistake #2'
        }
        },
        'how': {
            'mode': 'one box',
            'text': '[my_text]'
        },
        'where': {
            'box_id': $in.parent_box_id + '.demo',
            'max_width': 320,
            'scroll_to_box_id': 'true'
        }
    },
    'data_back': {
        'step': 'step_end'
    }
};
```

# License

This documentation is copyright (C) 2017 Peter Lembke.  
Permission is granted to copy, distribute and/or modify this document under the terms of the GNU Free Documentation
License, Version 1.3 or any later version published by the Free Software Foundation; with no Invariant Sections, no
Front-Cover Texts, and no Back-Cover Texts.  
You should have received a copy of the GNU Free Documentation License along with this documentation. If not,
see [https://www.gnu.org/licenses/](https://www.gnu.org/licenses/). SPDX-License-Identifier: GFDL-1.3-or-later

Since 2017-02-11 by Peter Lembke  
