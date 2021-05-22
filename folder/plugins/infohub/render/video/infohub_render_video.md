# Infohub Render Video

Render links to video services

# Introduction

Video is a nice way to relay information. Unfortunately all 3rd party video services uses iframes and they are a
security breach. You can render a link to the service.

This documentation is about how to use youtube, vimeo, daily_motion.

# Youtube

Youtube is the most famous of the platforms where you can upload your own movies. It is easy to use and it is also easy
to rendera link to Youtube so the video can be opened in a new tab.

```
'my_video_link': {
    'type': 'video',
    'subtype': 'youtubelink',
    'data': '_RCBYe7pcmA',
    'label': 'In new tab'
}
```

# Vimeo

You can render a vimeo link that goes directly to Vimeo

```
'my_video_link': {
    'type': 'video',
    'subtype': 'vimeolink',
    'data': '54003514',
    'label': 'Show in new tab'
}
```

# Daily motion

You can create a link that goes directly to daily motion.

```
'my_video_link': {
    'type': 'video',
    'subtype': 'daily_motionlink',
    'data': 'x3icv6a',
    'label': 'Show in new tab'
}
```

# Self hosting

Plugins like Infohub_RenderVideoPlayer are on the todo list. It will help you to host the video yourself on your server
without making the video public.

# License

This documentation is copyright (C) 2017 Peter Lembke.  
Permission is granted to copy, distribute and/or modify this document under the terms of the GNU Free Documentation
License, Version 1.3 or any later version published by the Free Software Foundation; with no Invariant Sections, no
Front-Cover Texts, and no Back-Cover Texts.  
You should have received a copy of the GNU Free Documentation License along with this documentation. If not,
see [https://www.gnu.org/licenses/](https://www.gnu.org/licenses/). SPDX-License-Identifier: GFDL-1.3-or-later

Since 2017-02-11 by Peter Lembke  
Updated 2020-03-11 by Peter Lembke  
