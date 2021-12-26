# Infohub Render

Render frontend objects  
[columns]

# Introduction

Infohub_Render is a client side (browser) javascript plugin that create HTML code. The HTML code are sent to
Infohub_View for presentation on the screen.  
Infohub_Render have child plugins that can render all common items that are used in a graphical user interface. If that
is not enough it can also call other render plugins. You have an example in infohub_rendermajor.  
The benefits are that the renderers can be improved without breaking any existing code. The rendered objects can have
more features. One example is the text box that have a lot of extra features you can use if you want.  
The objects can also be reused. You can just tell what you want and the renderer fix that.

# Basic rendering

When you call infohub_render the call always looks the same. Like this:

```
return {
    'to': {
        'node': 'client',
        'plugin': 'infohub_render',
        'function': 'create'
    },
    'data': {
        'what': {},
        'how': {
            'mode': 'one box',
            'text': '[my_menu]'
        },
        'where': {
            'parent_box_id': 'main.body',
            'box_position': 'first',
            'box_alias': 'menu',
            'max_width': 320
        }
    },
    'data_back': {
        'step': 'step_end'
    }
};
```

to - where you want to send this message. data - the data that render will use. data_back - data that will be returned
unchanged to you.  
what - What to render. how - how to render it. where - where to put the result.

# What

What to render. In the example below we render a presentation box with infohub_rendermajor.

```
'what': {
    'my_presentation_box': {
        'plugin': 'infohub_rendermajor',
        'type': 'presentation_box',
        'head_label': 'This is a YouTube video',
        'foot_text': 'My really long footer text on several rows to check how the link to the right looks like among all this text.',
        'content_data': '[my_image]',
        'content_embed': '[my_video]',
        'content_embed_new_tab': '[my_video_link]'
    },
    'my_image': {
        'type': 'common',
        'subtype': 'image',
        'data': 'some base 64 encoded image data'
    },
    'my_video': {
        'type': 'video',
        'subtype': 'youtube',
        'data': '_RCBYe7pcmA'
    },
    'my_video_link': {
        'type': 'video',
        'subtype': 'youtubelink',
        'data': '_RCBYe7pcmA',
        'label': 'In new tab'
    }
},
'how': {
    'mode': 'one box',
    'text': '[my_presentation_box]'
},
'where': {
    'parent_box_id': 'main.body',
    'box_position': 'last',
    'box_alias': 'infohub_common_video_youtube',
    'max_width': 320
}
```

![This is a YouTube video](rendermajor-1.png)
![This is also a YouTube video](rendermajor-2.png)

If we instead like to use the built-in child renderers then we can do this

```
'what': {
    'my_list': {
        'type': 'common',
        'subtype': 'list',
        'option': [
            {'label': 'Label 1'},
            {'label': 'Label 2'},
            {'label': 'Label 3 [my_second_list]'},
            {'label': 'Label 4'}
        ]
    },
    'my_second_list': {
        'type': 'common',
        'subtype': 'list',
        'option': [
            {'label': 'Label a'},
            {'label': 'Label b'},
            {'label': 'Label c'},
            {'label': 'Label d'}
        ]
    }
},
'how': {
    'mode': 'one box',
    'text': '[my_list]'
},
'where': {
    'parent_box_id': 'main.body',
    'box_position': 'last',
    'box_alias': 'infohub_render_list_demo',
    'max_width': 320
}
```

In the example above you get a list with a list in it.

# How

How to render the data in 'what'. You have two parameters: 'mode' and 'text'  
'mode' have two options. Either 'one_box' or 'separate boxes'. 'one_box' means that the resulting html will be put in
one box by infohub_view. 'separate_boxes' means that each section in 'what' will be put in separate boxes by
infohub_view.  
'text' is only used by mode=one_box. It contains a string where there are one or more string parameters. Like
this: "[my_menu]". The renderer find section "my_menu" in 'what' and substitute the parameter with the HTML. Then it
checks for more parameters [] and find them in 'what' until there are no parameters left.  
So mode=one_box uses the text parameter as a starting point for the rendering. And mode='separate boxes' render each
entry in 'what' as a separate object, but still it checks for parameters in the html and substitute them with code
from 'what'.

# Where

Here you state where you want the html to show. If the box_alias do not exist then it will be created (if the parent box
exist).

```
'box_id': 'main.head.infohub_demo'. This is your most important parameter.
'parent_box_id': 'main.body', // The name of the parent box
'box_position': 'last', // Where in the parent box you want your new box. first, middle, last
'box_alias': 'internal_demo_form', // Name of your new box.
'box_mode': 'under', // How child boxes in your new box will be ordered. 'under' each other or 'side' by side.
'box_view': '1', // '1' means that the new box is visible. '0' means that it is created but invisible.
'max_width': 480 // You can set the max with of the new box. Set a min_width on your box contents. Never set a width.
```

## box_id

The box_id tell where to put the rendered html. Read more in detail at [Infohub View](plugin,infohub_view) under "How to
reference boxes".

If you want to render something to your plugin GUI in Workbench then you need a function like the one below.

```
$functions.push("_GetBoxId");
var _GetBoxId = function() {
    return 'main.body.' + _GetClassName();
};
```

You can then use it like this:

```
'where': {
    'box_id': _GetBoxId() + '.index',
    'max_width': 320
}
```

See infohub_doc.js or any other plugin that works in Workbench how to use this.

# render_options

With the function render_options you can update an existing select box, substituting all options. Use it like this:

```
return _SubCall({
    'to': {
        'node': 'client',
        'plugin': 'infohub_render',
        'function': 'render_options'
    },
    'data': {
        'id': $in.box_id + '_' + $in.affect_alias,
        'source_node': $in.value,
        'source_plugin': $in.affect_plugin,
        'source_function': $in.affect_function
    },
    'data_back': {
        'step': 'step_end',
        'value': $in.value
    }
});
```

[/columns]

# License

This documentation is copyright (C) 2017 Peter Lembke.  
Permission is granted to copy, distribute and/or modify this document under the terms of the GNU Free Documentation
License, Version 1.3 or any later version published by the Free Software Foundation; with no Invariant Sections, no
Front-Cover Texts, and no Back-Cover Texts.  
You should have received a copy of the GNU Free Documentation License along with this documentation. If not,
see [https://www.gnu.org/licenses/](https://www.gnu.org/licenses/). SPDX-License-Identifier: GFDL-1.3-or-later

Since 2017-02-11 by Peter Lembke  
Updated 2018-08-13 by Peter Lembke  
