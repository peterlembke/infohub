# Infohub Render Audio
Renders a link to an audio service

# Introduction
The renderer can create a link to Jameno, Sound cloud, Spotify that you can click to open the audio in a new tab.

# Jamendo
You can create a link that goes directly to Jamendo and opens in a new tab.
Jameno has very few trackers.  

```
'my_audio_link': {
    'type': 'audio',
    'subtype': 'jamendolink',
    'data': 'album/152029'
}
```

Note that you can use the same data for the embedded content and for the link. You can either have a full album playing "album/152029" or a single track "track/1273394".  

# Soundcloud
You can create a link that goes directly to soundcloud.  
Soundcloud have trackers (Javascript) that are downloaded and run in your browser.
```
'my_audio_link': {
    'type': 'audio',
    'subtype': 'soundcloudlink',
    'data': '138295056'
}
```

# Spotify
With Spotify you only get a sample of the music you want to display. Spotify download trackers to the browser. 
You can make a link that opens at Spotify.  

```
'my_audio_link': {
    'type': 'audio',
    'subtype': 'spotifylink',
    'data': '7rklm17yoayxw45lpzv5uv'
}
```

# Self hosting
Plugins like Infohub_Audio, Infohub_RenderAudioPlayer are on the todo list. It will help you to host the audio yourself on your server without making the audio public. Then you do not need public services.

# License
This documentation is copyright (C) 2017 Peter Lembke.  
Permission is granted to copy, distribute and/or modify this document under the terms of the GNU Free Documentation License, Version 1.3 or any later version published by the Free Software Foundation; with no Invariant Sections, no Front-Cover Texts, and no Back-Cover Texts.  
You should have received a copy of the GNU Free Documentation License along with this documentation. If not, see [https://www.gnu.org/licenses/](https://www.gnu.org/licenses/).  SPDX-License-Identifier: GFDL-1.3-or-later  

Since 2017-02-14 by Peter Lembke  
Updated 2020-03-11 by Peter Lembke  
