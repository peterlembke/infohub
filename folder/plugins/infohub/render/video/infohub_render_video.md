# Infohub Render Video
Render different kind of video on the screen  

# Introduction
This renderer only renders video playback from 3rd party companies. You should be avare of the privacy risks regarding that.  
There are special challenges with hosting video. A simple way is to let a 3rd party host the video and then you present that video in an iframe. Examples of this is YouTube, Vimeo, dailymotion.com  
In the Infohub concept you should not use 3rd party services from the browser and instead let the server handle them. In the case with audio and video from 3rd parties, everything is made for iframes in the browser.  
This documentation is about how to use youtube, vimeo, daily_motion.  

# Presentation box
Youtube is the most famous of the platforms where you can upload your own movies. It is easy to use. Rendering a youtube iframe is very easy. Unfortunately you get more than your movie, you are also inviting trackers into your browser.  
You must give the visitor a choice to ignore the video or open it in another tab in the browser. I recommend that you always render the video embedded in a presentation box.  

```
$data = {
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
                'head_label': 'This is a Youtube video',
                'foot_text': 'My really long footer text on several rows to check how the link to the right looks like among all this text.',
                'content_data': '[my_image]',
                'content_embed': '[my_video]',
                'content_embed_new_tab': '[my_video_link]'
            },
            'my_image': {
                'type': 'common',
                'subtype': 'image',
                'data': '/9j/4AAQSkZJRgABAQE...'
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
            'parent_box_id': $in.parent_box_id,
            'parent_box_alias': 'infohub_demo',
            'box_position': 'last',
            'box_alias': 'infohub_common_video_youtube',
            'max_width': 320
        }
    },
    'data_back': {'step': 'demo_head_2'}
};
```

# Youtube
Youtube is the most famous of the platforms where you can upload your own movies. It is easy to use and it is also easy to render in Infohub.  

```
'my_video': {
    'type': 'video',
    'subtype': 'youtube',
    'data': '_RCBYe7pcmA'
}
```

You can also render a link to Youtube so the video can be opened in a new tab.  

```
'my_video_link': {
    'type': 'video',
    'subtype': 'youtubelink',
    'data': '_RCBYe7pcmA',
    'label': 'In new tab'
}
```

# Vimeo
This is how you render Vimeo.  

```
'my_video': {
    'type': 'video',
    'subtype': 'vimeo',
    'data': '54003514'
},
```

You can also render a vimeo link that goes directly to Vimeo  

```
'my_video_link': {
    'type': 'video',
    'subtype': 'vimeolink',
    'data': '54003514',
    'label': 'Show in new tab'
}
```

# Daily motion
This is how you render daily motion. It is the same as for Youtube and Vimeo.  

```
'my_video': {
    'type': 'video',
    'subtype': 'daily_motion',
    'data': 'x3icv6a'
},
```

And you can create a link that goes directly to daily motion.  

```
'my_video_link': {
    'type': 'video',
    'subtype': 'daily_motionlink',
    'data': 'x3icv6a',
    'label': 'Show in new tab'
}
```

# Self hosting
A plugin called Infohub_RenderVideoPlayer are on the todo list. It will help you to host the video yourself on your server without making the video public.  

# License
This documentation is copyright (C) 2017 Peter Lembke.  
Permission is granted to copy, distribute and/or modify this document under the terms of the GNU Free Documentation License, Version 1.3 or any later version published by the Free Software Foundation; with no Invariant Sections, no Front-Cover Texts, and no Back-Cover Texts.  
You should have received a copy of the GNU Free Documentation License along with this documentation. If not, see [https://www.gnu.org/licenses/](https://www.gnu.org/licenses/).  

Since 2017-02-11 by Peter Lembke  
Updated 2018-04-14 by Peter Lembke  
