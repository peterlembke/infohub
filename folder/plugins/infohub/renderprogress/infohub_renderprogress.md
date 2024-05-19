# InfoHub RenderProgress

Render a progress bar and percent and shows value/max and elapsed time and estimated time left.
Also shows a heart that pulsate once every time there is an update of the values.

[columns]

# Introduction

The progress bar is built upon the common progress.

All values are set by infohub_view -> progress

- value and max value on the progress bar
- value/max values
- percent - Show the percent completed 0 to 100.
- elapsed time (seconds) - should be updating itself until it is stopped by infohub_view -> progress
- time left (seconds) - should be updating itself until it counts down to zero. Is set by infohub_view -> progress

The elapsed time and time left is updated from rendertime, it is a component that renderprogress uses.

# How to use

This is an example how you can use the renderprogress

```
return _SubCall({
    'to': {
        'node': 'client',
        'plugin': 'infohub_render',
        'function': 'create'
    },
    'data': {
        'what': {
            'my_progress': {
                'plugin': 'infohub_renderprogress',
                'type': 'progress',
                'max': 1000,
                'value': 0,
                'view_value_of_max': 'true',
                'view_percent': 'true,
                'view_elapsed_time': 'true',
                'view_time_left': 'true'
            }
        },
        'how': {
            'mode': 'one box',
            'text': '[my_progress]'
        },
        'where': {
            'parent_box_id': 'main.body.infohub_demo',
            'box_position': 'last',
            'box_alias': 'infohub_renderprogress_demo',
            'max_width': 320
        }
    },
    'data_back': {
        'step': 'step_end'
    }
});
```

NOTE: This plugin is not started from Workbench. It does not have its icons preloaded.
You must add the plugin to the launcher.json where it will be used.
See [infohub_plugin](plugin,infohub_plugin) for more information about `has_assets`.
See [infohub_asset](plugin,infohub_asset) for more information about this and everything about assets.

## max

You can set a max value during rendering. 
You can at any time change the max value by calling infohub_view -> progress.
Then all values are recalculated and updated.

## value

You can set a value during rendering.
You can at any time change the value by calling infohub_view -> progress.
Then all values are recalculated and updated.

## view_value_of_max

Show/hide the text about value/max.
You set this during rendering, and you can not change it later.
The value/max text is updated when you change value or max value.

## view_percent

Show/hide the text about percent.
You set this during rendering, and you can not change it later.
The value/max text is updated when you change value or max value.

The percent is calculated with int(value / maxValue * 100). It gives a value between 0 and 100.

## view_elapsed_time (Later)

Show/hide the text about elapsed time.
You set this during rendering, and you can not change it later.
The value/max text is updated when you change value or max value.

The elapsed time is a timer that update its own text every second through an event.

This feature will be added later.

## view_time_left (Later)

Show/hide the text about time left.
You set this during rendering, and you can not change it later.
The value/max text is updated when you change value or max value.

This feature will be added later.

# How the event works

The event_message function get an event with:
* box_id (required)
* value (required)
* max (optional)

Finds the box. Does a multi call to update each type of textbox/bar/heart individually.
It is OK to call all the components. If a component is not rendered it will be detected and skipped.
Each component have its own update-function in this plugin.

## update_bar

Function that receive box_id, value, max (optional). Calculates the new data. Calls infohub_view to update the component.

## update_value_of_max

Function that receive box_id, value, max (optional). Calculates the new data. Calls infohub_view to update the component.

## update_percent

Function that receive box_id, value, max (optional). Calculates the new data. Calls infohub_view to update the component.

## update_heart

Function that receive box_id, value, max (optional). Calculates the new data. Calls infohub_view to update the component.

## update_elapsed_time

Function that receive box_id, value, max (optional). Calculates the new data. Calls infohub_view to update the component.

## update_time_left

Function that receive box_id, value, max (optional). Calculates the new data. Calls infohub_view to update the component.

[/columns]

# License

This documentation is copyright (C) 2023 Peter Lembke.  
Permission is granted to copy, distribute and/or modify this document under the terms of the GNU Free Documentation
License, Version 1.3 or any later version published by the Free Software Foundation; with no Invariant Sections, no
Front-Cover Texts, and no Back-Cover Texts.  
You should have received a copy of the GNU Free Documentation License along with this documentation. If not,
see [https://www.gnu.org/licenses/](https://www.gnu.org/licenses/). SPDX-License-Identifier: GFDL-1.3-or-later

Since 2023-07-09 by Peter Lembke  
Updated 2023-09-02 by Peter Lembke  
