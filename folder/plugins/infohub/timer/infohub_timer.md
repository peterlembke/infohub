# InfoHub Timer

This is a Client plugin only.  
The timer allow you to get a delayed response. This means your message return after a time delay that you specify.
The timer triggers ONCE. You need to start it again if you want another trigger. 

You can se a demo of this
in [infohub_demo_timer](plugin,infohub_demo_timer).

You can also see how the timer is used in [infohub_renderprogress](plugin,infohub_renderprogress) where it updates elapsed time and time left.

## Features

The plugin has three functions

* start_timer - uses a delay time - Triggers after tiome have passed
* start_timer_advanced - uses time stamp ranges - Triggers when the clock has the right time
* stop_timer

Only plugins on the same node can start/stop a timer. The restriction is set because a timer takes up computer resources
over time, so we must have some control over this function.

You can have several timers active. They are separated by plugin_name and an alias that you set.

## Start a timer

This example code comes from the infohub_demo_timer. In this case we use a [multi message](plugin,infohub_base), but you
can use a normal _SubCall if you want to.

* The call goes to infohub_timer -> start_timer. The name is any name you like.
* name = Your plugin have to keep track of the names it uses.
* milliseconds = One second is 1000 milliseconds. In this case we use a calculation.
* update = how the timer should be updated.

The data_back can contain anything you need back.

```javascript
const $name = $in.event_data + '-' + $number;

let $messageOut = _SubCall({
    'to': {
        'node': 'client',
        'plugin': 'infohub_timer',
        'function': 'start_timer'
    },
    'data': {
        'name': $name,
        'milliseconds': 1000 + $number * 400,
        'update': 'yes', // no, yes, lower, higher
    },
    'data_back': {
        'box_id':  $in.box_id + '.[svg_example]',
        'element_path': 'svg.circle.' + $number,
        'style_name': 'fill',
        'style_value': '#' + $colour[$in.event_data][$number],
        'step': 'step_set_style'
    }
});

$messageArray.push($messageOut);
```

Note that you get the response back to the SAME function you called from.   
You can NOT send a time delayed message to some other function.

## Minimum and maximum value

If you provide no minimum value then your milliseconds just need to be higher than zero.

    minimum: 1000 

If you provide no maximum value then you can have as large value as the browser allow.

    maximum: 24 * 60 * 60 * 1000 // a full 24 hours.

The minimum and maximum are stored with the timer and can only be set when you start the timer the first time.

## Update a timer

The parameter `update` can have one of four alternatives.

| Value  | Start timer | Update if lower | Update if higher |
|:------:|:-----------:|:---------------:|:----------------:|
|   no   |      x      |                 |                  |
|  yes   |      x      |        x        |        x         |
| lower  |      x      |        x        |                  |
| higher |      x      |                 |        x         |

Update if provided time is lower than what is left on the timer but still higher than the minimum allowed value.

Update if provided time is higher than what is left on the timer but still lower than the maximum allowed value.

## Stop a timer

You can stop a timer that you have started. The timers are divided by plugin name, so you can not stop a timer started by
another plugin.

```javascript
let $messageOut = _SubCall({
    'to': {
        'node': 'client',
        'plugin': 'infohub_timer',
        'function': 'stop_timer'
    },
    'data': {
        'name': $name
    },
    'data_back': {
    }
});
```

## Usage in infohub_transfer

The core plugin infohub_transfer uses infohub_timer and therefore this plugin is also a core plugin.

Everything about timing that was previously in infohub_transfer is now handled by infohub_timer.

infohub_transfer has a ban time, that is the minimum time.

The messages have a wait time how long they can wait. The one that can wait the least will be used to set the timer.

Messages come to infohub_transfer after the timer has started. If a message is in more hurry, then the timer are updated
as long as it does not go below the minimum time.

## License

This documentation is copyright (C) 2020 Peter Lembke.  
Permission is granted to copy, distribute and/or modify this document under the terms of the GNU Free Documentation
License, Version 1.3 or any later version published by the Free Software Foundation; with no Invariant Sections, no
Front-Cover Texts, and no Back-Cover Texts.  
You should have received a copy of the GNU Free Documentation License along with this documentation. If not,
see [https://www.gnu.org/licenses/](https://www.gnu.org/licenses/). SPDX-License-Identifier: GFDL-1.3-or-later

Since 2020-02-28 by Peter Lembke  
Updated 2023-08-19 by Peter Lembke  
