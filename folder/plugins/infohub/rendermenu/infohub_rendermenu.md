# Infohub RenderMenu

Renders a static menu list and handles the events.

See the demo [Infohub Demo Menu](plugin,infohub_demo_menu)

# Introduction

I have noticed that plugins that has a GUI often want to show a lot of different GUIs. With the menu you can have a list that then render the GUI you want to show.
You can see the menu in action in the plugins: tree, demo, log in, tools and many more.

The plugin infohub_rendermenu is a level 1 rendering plugin that depend on other plugins to build the smaller pieces.

# Events

Look at the demos below. You notice these properties on each menu alternative:
``` 
    'event_data': 'text',
    'to_plugin': 'infohub_demo',
    'to_function': 'click_menu',
```
Your parent plugin need to have the function that receive the event. You can have different to_function in each menu alternative if you want to.
The event_data will be available to the event function.

# Default values and CSS

When you render a menu you can provide your own CSS. rendermenu will provide CSS as a standard set up. You can provide
your own if you want to.
The default options look like this:

```
const $defaultOption = {
    'plugin': 'infohub_renderform',
    'type': 'button',
    'enabled': 'true',
    'alias': '',
    'class': '', // Leave empty for buttons to get the default css
    'button_left_icon': '',
    'button_label': 'Submit',
    'mode': 'button', // submit, button
    'event_data': 'menu button', // Your data
    'event_handler': 'infohub_renderform', // Normally leave as it is
    'to_node': 'client',
    'to_plugin': 'infohub_rendermenu',
    'to_function': 'event_message',
    'custom_variables': {}, // You can add more custom variables like the data variable above
    'css_data': {
        '.button':
            'font-size: 1.0em;' +
            'width: 100%;' +
            'box-sizing:border-box;' +
            'border-radius: 16px;' +
            'margin: 4px 0px 0px 0px;' +
            'padding: 2px 10px 2px 16px;' +
            'text-align: left;' +
            'border: 0px;',
        '.button-width':
            'width: 100%;',
    },
};
```

# How to use

This is part of the Infohub demo plugin how it shows its menu.

```
return _SubCall({
    'to': {
        'node': 'client',
        'plugin': 'infohub_render',
        'function': 'create',
    },
    'data': {
        'what': {
            'titel': {
                'type': 'common',
                'subtype': 'value',
                'data': _Translate('DEMO_COLLECTION')
            },
            'my_menu': {
                'plugin': 'infohub_rendermenu',
                'type': 'menu',
                'head_label': '[titel]',
                'options': {
                    'text_demo': {
                        'alias': 'text_demo_link',
                        'event_data': 'text',
                        'button_label': _Translate('TEXT_DEMO'),
                        'to_plugin': 'infohub_demo',
                        'to_function': 'click_menu',
                    },
                    'common_demo': {
                        'alias': 'common_demo_link',
                        'event_data': 'common',
                        'button_label': _Translate('COMMON_OBJECTS_DEMO'),
                        'to_plugin': 'infohub_demo',
                        'to_function': 'click_menu',
                    },
                    'svg_demo': {
                        'alias': 'svg_demo_link',
                        'event_data': 'svg',
                        'button_label': _Translate('SVG_RENDERING_DEMO'),
                        'to_plugin': 'infohub_demo',
                        'to_function': 'click_menu',
                    },
                },
            },
        },
        'how': {
            'mode': 'one box',
            'text': '[my_menu]',
        },
        'where': {
            'box_id': $in.parent_box_id + '.menu',
            'max_width': 320,
            'scroll_to_box_id': 'true',
        },
        'cache_key': 'menu',
    },
    'data_back': {
        'step': 'step_end',
    },
});
```

# Icons on the left side

In configlocal you see a menu with left side icons. This is how you do that.

``` 
return _SubCall({
    'to': {
        'node': 'client',
        'plugin': 'infohub_render',
        'function': 'create',
    },
    'data': {
        'what': {
            'titel': {
                'type': 'common',
                'subtype': 'value',
                'data': _Translate('CONFIGURATION_-_LOCAL_ON_THIS_DEVICE')
            },
            'my_menu': {
                'plugin': 'infohub_rendermenu',
                'type': 'menu',
                'head_label': '[titel]',
                'options': {
                    'zoom': {
                        'alias': 'zoom_link',
                        'event_data': 'zoom',
                        'button_label': _Translate('ZOOM_LEVEL'),
                        'button_left_icon': '[zoom_icon]',
                        'to_plugin': 'infohub_configlocal',
                        'to_function': 'click_menu',
                    },
                    'language': {
                        'alias': 'language_link',
                        'event_data': 'language',
                        'button_label': _Translate('LANGUAGE_PREFERRED'),
                        'button_left_icon': '[language_icon]',
                        'to_plugin': 'infohub_configlocal',
                        'to_function': 'click_menu',
                    },
                    'image': {
                        'alias': 'image_link',
                        'event_data': 'image',
                        'button_label': _Translate('IMAGES_YOU_SEE'),
                        'button_left_icon': '[image_icon]',
                        'to_plugin': 'infohub_configlocal',
                        'to_function': 'click_menu',
                    },
                    'colour': {
                        'alias': 'colour_link',
                        'event_data': 'colour',
                        'button_left_icon': '[colour_icon]',
                        'button_label': _Translate('COLOUR_SCHEMA'),
                        'to_plugin': 'infohub_configlocal',
                        'to_function': 'click_menu',
                        'custom_variables': {
                            'call_render_done': 'true',
                        },
                    },
                },
            },
            'zoom_icon': {
                'type': 'common',
                'subtype': 'svg',
                'data': '[zoom_asset]',
            },
            'zoom_asset': {
                'plugin': 'infohub_asset',
                'type': 'icon',
                'asset_name': 'zoom/magnifyingglass',
                'plugin_name': 'infohub_configlocal',
            },
            'language_icon': {
                'type': 'common',
                'subtype': 'svg',
                'data': '[language_asset]',
            },
            'language_asset': {
                'plugin': 'infohub_asset',
                'type': 'icon',
                'asset_name': 'language/language',
                'plugin_name': 'infohub_configlocal',
            },
            'image_icon': {
                'type': 'common',
                'subtype': 'svg',
                'data': '[image_asset]',
            },
            'image_asset': {
                'plugin': 'infohub_asset',
                'type': 'icon',
                'asset_name': 'classic-config-icon',
                'plugin_name': 'infohub_configlocal',
            },
            'colour_icon': {
                'type': 'common',
                'subtype': 'svg',
                'data': '[colour_asset]',
            },
            'colour_asset': {
                'plugin': 'infohub_asset',
                'type': 'icon',
                'asset_name': 'colour/colour-star',
                'plugin_name': 'infohub_configlocal',
            },
        },
        'how': {
            'mode': 'one box',
            'text': '[my_menu]',
        },
        'where': {
            'box_id': $in.parent_box_id + '.menu',
            'max_width': 320,
            'scroll_to_box_id': 'true',
        },
    },
    'data_back': {
        'step': 'step_end',
    },
});
```

# Additional button properties

In the example above you can see this
``` 
                    'colour': {
                        'alias': 'colour_link',
                        'event_data': 'colour',
                        'button_left_icon': '[colour_icon]',
                        'button_label': _Translate('COLOUR_SCHEMA'),
                        'to_plugin': 'infohub_configlocal',
                        'to_function': 'click_menu',
                        'custom_variables': {
                            'call_render_done': 'true',
                        },
                    },
```
The "call_render_done" property will be added to the button and will be available to the click_menu function.
This means you do not have to paste everything in "event_data". 

# Events to child plugins

You can study the Demo plugin how it does. There all events go to the parent plugin. The event_data then have the name of the child.
The function call the child and paste all parameters. Like this:

``` 
$functions.push('click_menu');
/**
 * Handle the menu clicks
 * @version 2019-03-13
 * @since 2018-09-26
 * @author Peter Lembke
 */
const click_menu = function($in = {}) {
    const $default = {
        'step': 'step_start',
        'event_data': '',
        'parent_box_id': '',
    };
    $in = _Default($default, $in);

    if ($in.step === 'step_start') {
        const $pluginName = _GetPluginName($in.event_data);

        return _SubCall({
            'to': {
                'node': 'client',
                'plugin': $pluginName,
                'function': 'create',
            },
            'data': {
                'subtype': $in.event_data,
                'parent_box_id': $in.parent_box_id,
                'translations': $classTranslations,
            },
            'data_back': {
                'step': 'step_end',
            },
        });
    }

    return {
        'answer': 'true',
        'message': 'Menu click done',
    };
};
```

# License

This documentation is copyright (C) 2021 Peter Lembke.  
Permission is granted to copy, distribute and/or modify this document under the terms of the GNU Free Documentation
License, Version 1.3 or any later version published by the Free Software Foundation; with no Invariant Sections, no
Front-Cover Texts, and no Back-Cover Texts.  
You should have received a copy of the GNU Free Documentation License along with this documentation. If not,
see [https://www.gnu.org/licenses/](https://www.gnu.org/licenses/). SPDX-License-Identifier: GFDL-1.3-or-later

Since 2021-07-25 by Peter Lembke  
Updated 2021-07-25 by Peter Lembke  
