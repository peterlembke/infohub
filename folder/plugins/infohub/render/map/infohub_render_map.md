# Infohub Render Map
Render different kind of maps on the screen  

# Introduction
A map is useful on its own just by showing a pin pointed place so you can orient yourself. That is the only thing you can do for now with the renderers that are included.
If you want to do other things then click on the link and open the map in a new tab. Then you have all features the 3rd party map provider offers.  

# Presentation box
You must give the visitor a choice to ignore the map or open it in another tab in the browser. The reason could be slow internet connection or low data quota. Regardless you must let the user choose.
I recommend that you always render the map embedded in a presentation box.  

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
                'head_label': 'This is an openstreetmap map',
                'foot_text': 'The information text below the map can be as large as you want and the video will scale up to the size of the rest of the contents',
                'content_data': '[my_image]',
                'content_embed': '[my_map]',
                'content_embed_new_tab': '[my_map_link]'
            },
            'my_image': {
                'type': 'common',
                'subtype': 'image',
                'data': '/9j/4AAQSkZJR....'
            },
            'my_map': {
                'type': 'map',
                'subtype': 'openstreetmap',
                'point_latitude': '59.294597',
                'point_longitude': '18.156281'
            },
            'my_map_link': {
                'type': 'map',
                'subtype': 'openstreetmaplink',
                'point_latitude': '59.294597',
                'point_longitude': '18.156281'
            }
        },
        'how': {
            'mode': 'one box',
            'text': '[my_presentation_box]'
        },
        'where': {
            'parent_box_id': 'main.body',
            'box_position': 'last',
            'box_alias': 'demo_left_2',
            'max_width': 320
        }
    },
    'data_back': {'step': 'demo_left_2'}
};
```

# Open streetmap
Open street map is an open source map service. You can embed the maps to your web page.  
I recommend that you use OpenStreetMap because it has no trackers and only uses <a href="https://en.wikipedia.org/wiki/Matomo_(software)" target="_blank">Piwik</a> for the site analytics.  

```
'my_map': {
    'type': 'map',
    'subtype': 'openstreetmap',
    'point_latitude': '59.294597',
    'point_longitude': '18.156281'
},
```

You can create a link to a map that opens in a new tab.  

```
'my_map_link': {
    'type': 'map',
    'subtype': 'openstreetmaplink',
    'point_latitude': '59.294597',
    'point_longitude': '18.156281'
}
```

# Google maps
You can embed Google maps to your web page.  

```
'my_map': {
    'type': 'map',
    'subtype': 'googlemaps',
    'point_latitude': '59.294597',
    'point_longitude': '18.156281'
},
```

You can create a link to a map that opens in a new tab.  

```
'my_map_link': {
    'type': 'map',
    'subtype': 'googlemapslink',
    'point_latitude': '59.294597',
    'point_longitude': '18.156281'
}
```

# License
This documentation is copyright (C) 2017 Peter Lembke.  
Permission is granted to copy, distribute and/or modify this document under the terms of the GNU Free Documentation License, Version 1.3 or any later version published by the Free Software Foundation; with no Invariant Sections, no Front-Cover Texts, and no Back-Cover Texts.  
You should have received a copy of the GNU Free Documentation License along with this documentation. If not, see [https://www.gnu.org/licenses/](https://www.gnu.org/licenses/).  

Since 2017-02-11 by Peter Lembke  
Updated 2018-04-14 by Peter Lembke  
