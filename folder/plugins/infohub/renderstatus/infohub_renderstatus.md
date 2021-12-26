# Infohub RenderStatus

Infohub RenderStatus will render an icon and a text. Click toggle on it to get a description. You render it with all statuses but only one is visible.
You can then change what status should be visible.

This will be used in a lot of places.

* Login to see if the file have been imported or not
* Tree to see if the secret have been imported or not
* Online indicator - To see if we are online
* Traffic indicator - To see when we talk with the server
*

# Infohub render status

The plugin is a level 1 renderer that need other renderers to render the smaller pieces.
You define all statuses you want the status box to show. Then one of them can be displayed.
You can change what status to display with a message to the renderer.

# How to use

This is an example how you can use the renderstatus.
The example comes from infohub_demo_status. 

```
return _SubCall({
    'to': {
        'node': 'client',
        'plugin': 'infohub_render',
        'function': 'create',
    },
    'data': {
        'what': {
            'title': {
                'type': 'common',
                'subtype': 'value',
                'data': _Translate('DEMO_STATUS')
            },
            'my_status': {
                'plugin': 'infohub_renderstatus',
                'type': 'status',
                'head_label': '[title]',
                'show': 'file_loaded',
                'options': {
                    'file_loaded': {
                        'icon': '[yes_icon]',
                        'label': _Translate('FILE_LOADED'),
                        'description': _Translate('FILE_LOADED_DESCRIPTION'),
                    },
                    'file_not_loaded': {
                        'icon': '[no_icon]',
                        'label': _Translate('FILE_NOT_LOADED'),
                        'description': _Translate('FILE_NOT_LOADED_DESCRIPTION'),
                    },
                    'unknown': {
                        'icon': '[unknown_icon]',
                        'label': _Translate('UNKNOWN'),
                        'description': _Translate('UNKNOWN_DESCRIPTION'),
                    },
                },
            },
            'yes_icon': {
                'type': 'common',
                'subtype': 'svg',
                'data': '[yes_asset]',
            },
            'yes_asset': {
                'plugin': 'infohub_asset',
                'type': 'icon',
                'asset_name': 'status/yes',
                'plugin_name': 'infohub_demo',
            },
            'no_icon': {
                'type': 'common',
                'subtype': 'svg',
                'data': '[no_asset]',
            },
            'no_asset': {
                'plugin': 'infohub_asset',
                'type': 'icon',
                'asset_name': 'status/no',
                'plugin_name': 'infohub_demo',
            },
            'unknown_icon': {
                'type': 'common',
                'subtype': 'svg',
                'data': '[unknown_asset]',
            },
            'unknown_asset': {
                'plugin': 'infohub_asset',
                'type': 'icon',
                'asset_name': 'status/unknown',
                'plugin_name': 'infohub_demo',
            },
        },
        'how': {
            'mode': 'one box',
            'text': '[my_status]',
        },
        'where': {
            'box_id': $in.parent_box_id + '.demo',
            'max_width': 320,
            'scroll_to_box_id': 'true',
        },
        'cache_key': 'status',
    },
    'data_back': {
        'step': 'step_end',
    },
});
```

# License

This documentation is copyright (C) 2018 Peter Lembke.  
Permission is granted to copy, distribute and/or modify this document under the terms of the GNU Free Documentation
License, Version 1.3 or any later version published by the Free Software Foundation; with no Invariant Sections, no
Front-Cover Texts, and no Back-Cover Texts.  
You should have received a copy of the GNU Free Documentation License along with this documentation. If not,
see [https://www.gnu.org/licenses/](https://www.gnu.org/licenses/). SPDX-License-Identifier: GFDL-1.3-or-later

Since 2021-08-03 by Peter Lembke  
Updated 2021-08-03 by Peter Lembke  
