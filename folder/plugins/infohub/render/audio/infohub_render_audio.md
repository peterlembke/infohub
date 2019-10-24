# Infohub Render Audio
Plays audio  

# Introduction
You can play audio by embedding external services into the page. You can read more about each of them below. It is not endorsed to use external services since they break your personal security.  

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
                'head_label': 'This is a Spotify audio',
                'foot_text': 'The information text below the video can be as large as you want and the video will scale up to the size of the rest of the contents',
                'content_data': '[my_image]',
                'content_embed': '[my_audio]',
                'content_embed_new_tab': '[my_audio_link]'
            },
            'my_image': {
                'type': 'common',
                'subtype': 'image',
                'data': '/9j/4AAQSkZJRgAB....'
            },
            'my_audio': {
                'type': 'audio',
                'subtype': 'spotify',
                'data': '7rklm17yoayxw45lpzv5uv'
            },
            'my_audio_link': {
                'type': 'audio',
                'subtype': 'spotifylink',
                'data': '7rklm17yoayxw45lpzv5uv'
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
            'box_alias': 'infohub_render_audio_spotify',
            'max_width': 320
        }
    },
    'data_back': {'step': 'step_end'}
};
```

# Jamendo
With Jamendo you can embed an audio that are hosted on Jamendo. Jamendo have Zero trackers!! It is a great alternative for playing music with a graphical interface.  

```
'my_audio': {
    'type': 'audio',
    'subtype': 'jamendo',
    'data': 'album/152029'
},
```

You can also create a link that goes directly to Jamendo and opens in a new tab.  

```
'my_audio_link': {
    'type': 'audio',
    'subtype': 'jamendolink',
    'data': 'album/152029'
}
```

Note that you can use the same data for the embedded content and for the link. You can either have a full album playing "album/152029" or a single track "track/1273394".  

# Soundcloud
With Soundcloud you can embed an audio that are hosted on Soundcloud. Soundcloud have trackers (Javascript) that are download and run in your browser. Obviously it is fair to give the user a chance to not have this. Therefore you should embed this in a "major box" that gives more context with a title, description, an image.  

```
'my_audio': {
    'type': 'audio',
    'subtype': 'soundcloud',
    'data': '138295056'
},
```

You can create a link that goes directly to soundcloud.  

```
'my_audio_link': {
    'type': 'audio',
    'subtype': 'soundcloudlink',
    'data': '138295056'
}
```

It is the same data in both the embedded content and for the link.  

# Spotify
With Spotify you only get a sample of the music you want to display. Spotify download trackers to the browser. Play fair, use a presentation box and let the user decide if they want this or not.  

```
'my_audio': {
    'type': 'audio',
    'subtype': 'spotify',
    'data': '7rklm17yoayxw45lpzv5uv'
},
```

You can also make a link that opens at Spotify  

```
'my_audio_link': {
    'type': 'audio',
    'subtype': 'spotifylink',
    'data': '7rklm17yoayxw45lpzv5uv'
}
```

Note that it is the same data string for embedding and for creating a link.  

# Self hosting
A plugin called Infohub_RenderAudioPlayer are on the todo list. It will help you to host the audio yourself on your server without making the audio public.  

# License
This documentation is copyright (C) 2017 Peter Lembke.  
Permission is granted to copy, distribute and/or modify this document under the terms of the GNU Free Documentation License, Version 1.3 or any later version published by the Free Software Foundation; with no Invariant Sections, no Front-Cover Texts, and no Back-Cover Texts.  
You should have received a copy of the GNU Free Documentation License along with this documentation. If not, see [https://www.gnu.org/licenses/](https://www.gnu.org/licenses/).  

Since 2017-02-14 by Peter Lembke  
