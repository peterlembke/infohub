# InfoHub Render Map

Shows a link to a map.

# Introduction

A map is useful by showing a pinpointed place, so you can orient yourself. You can render a link and open the map in a
new tab. Then you have all features the 3rd party map provider offers.

# Open streetmap

Open street map is an open source map service. I recommend that you use OpenStreetMap because it has no trackers and
only uses [Piwik](https://en.wikipedia.org/wiki/) for the site analytics.

```
'my_map_link': {
    'type': 'map',
    'subtype': 'openstreetmaplink',
    'point_latitude': '59.294597',
    'point_longitude': '18.156281'
}
```

# Google Maps

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
Permission is granted to copy, distribute and/or modify this document under the terms of the GNU Free Documentation
License, Version 1.3 or any later version published by the Free Software Foundation; with no Invariant Sections, no
Front-Cover Texts, and no Back-Cover Texts.  
You should have received a copy of the GNU Free Documentation License along with this documentation. If not,
see [https://www.gnu.org/licenses/](https://www.gnu.org/licenses/). SPDX-License-Identifier: GFDL-1.3-or-later

Since 2017-02-11 by Peter Lembke  
Updated 2020-03-11 by Peter Lembke  
