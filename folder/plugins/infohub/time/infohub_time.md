# Infohub Time

Get the current time stamp in different formats

# Introduction

Time and timestamps are used for tracking when something happened. There are human readable formats and there are time
formats suitable for computer calculations.  
This time plugin is small. If you use this time plugin instead of the time functions in the base class then you can make
your plugin truly testable because the answers from your plugin is always predictable.  
This plugin will get more time related features later.

# Time formats

There might be more time formats later. I want to add: date, short_time, epoc

## Normal timestamp

The local time where you are now.  
This format gives Year, Month, Day. Space. 24 hours. Minutes, Seconds. All with leading zeros if needed.  
Time format: timestamp  
Plugin: JS, PHP  
Example: 2018-08-11 19:51:50

## Timestamp with offset

The time is the local time where you are now.  
Variation of the normal time stamp. This has a T instead of a space. And +02:00 in the end. I am in the time zone for
Sweden. That is +2 hours compared to Greenwich mean time.  
Time format: timestamp_c  
Plugin: JS, PHP  
Example: 2018-08-11T19:53:34+02:00

## Normal timestamp with fraction of second

The time is the local time where you are now. It has the same format as a normal timestamp except that you also have
fractions of a second.  
This format only exist on the PHP version of the plugin. You can also see that PHP can give you 6 decimals. Javascript
usually give you three decimals.  
Time format: timestampmicro  
Plugin: PHP  
Example: 2018-08-11 17:54:53.823657

## Seconds since EPOC and fractions of a second

EPOC happened 1080-01-01 at 00.00.00 in time zone +0. Seconds since EPOC is as it says, the number of seconds that have
counted since that timestamp.  
This time format is easy to use when you want to compare times in computer programs.  
This format is a variation of seconds since EPOC since it also have fraction of seconds.  
If you get the timestamp from Javascript then you get three decimals. From PHP you get six decimals.  
Time format: microtime  
Plugin: JS, PHP  
Example: 1534010067.592

# Time tool

Start the plugin: Tools Collection. Here you can see what time formats exist and you can select a format and see the
result.  
The tool is made as a demo and a tool. Showing how a tool can be built and how it can update lists and call a plugin and
show the result.

# Time zones

There is a place called Greenwich. There you have the date line. Greenwitch Mean Time (GMT) have time zone +0.  
The more west you go the more behind you are, up to -12 hours from Greenwich mean time.  
The more east you go the more ahead you are, up to +12 hours from Greenwich mean time.  
If your computer clock is showing the local time where you are then you will see the right time when you ask the
Javascript plugin.  
The PHP plugin on the other hand might show you the GMT time with time cone +0. You have to configure your time zone in
PHP.

## Time zone in PHP

In file folder/include/settings_and_errors.php you have an option:

```
// Set a default time zone. If you exclude this row then you will get an error
date_default_timezone_set('UTC');
```

The code: UTC is the same as GMT. A time zone of +0. You need a code for your time zone. All codes are found
here <a href="http://php.net/manual/en/timezones.php">PHP Time zones</a>  
Since I am in Sweden I will use Europe/Stockholm. Before the change I got: 2018-08-11T18:27:49+00:00. After the change I
got: 2018-08-11T20:28:32+02:00. Now the time is accurate from PHP.

# Usage

This is how you call the plugin

```
return _SubCall({
    'to': {
        'node': $node,
        'plugin': 'infohub_time',
        'function': 'time'
    },
    'data': {
        'type': $timeFormat
    },
    'data_back': {
        'step': 'step_response'
    }
});
```

# License

This documentation is copyright (C) 2018 Peter Lembke.  
Permission is granted to copy, distribute and/or modify this document under the terms of the GNU Free Documentation
License, Version 1.3 or any later version published by the Free Software Foundation; with no Invariant Sections, no
Front-Cover Texts, and no Back-Cover Texts.  
You should have received a copy of the GNU Free Documentation License along with this documentation. If not,
see [https://www.gnu.org/licenses/](https://www.gnu.org/licenses/). SPDX-License-Identifier: GFDL-1.3-or-later

Since 2018-08-11 by Peter Lembke  
Updated 2018-08-11 by Peter Lembke  
