# Infohub Render SVG
Render SVG images with this plugin.  

[columns]
# Introduction
This plugin is a normal renderer that can render the basic shapes in SVG. The purpose of this instead of just using a pre made SVG is the IDs that will be available in the rendered SVG in the DOM. They can be manipulated with infohub_view.

If you want to show already existing SVG files then use [infohub_render_common](plugin,infohub_render_common).

# Render tags
The source information is from [w3schools.com](https://www.w3schools.com/graphics/svg_intro.asp).  
More examples on [wikimedia.org](https://commons.wikimedia.org/wiki/SVG_examples).  
Advanced SVG examples from [creativebloq.com](https://www.creativebloq.com/design/examples-svg-7112785).    

## start
The start tag
```
<svg id="the-id" width="100%" height="100%" viewBox="0 0 169.36133 169.36133">
```

## end
The end tag
```
</svg>
```

## rectangle
The [rectangle tag](https://www.w3schools.com/graphics/svg_rect.asp)
```
<rect id="the-id" x="50" y="20" rx="20" ry="20" width="150" height="150"
  style="fill:red;stroke:black;stroke-width:5;opacity:0.5" />
```

## circle
The [circle tag](https://www.w3schools.com/graphics/svg_circle.asp)
```
<circle
     id="the-id"
     cx="84.08712"
     cy="87.850548"
     style="display:inline;fill:#ffffff;fill-opacity:0;stroke:#faffff;stroke-width:9.61628342;stroke-opacity:1"
     r="49.283451" />
```

## ellipse
The [ellipse tag](https://www.w3schools.com/graphics/svg_ellipse.asp)
```
<ellipse id="the-id" cx="200" cy="80" rx="100" ry="50"
  style="fill:yellow;stroke:purple;stroke-width:2" />
```

## line
The [line tag](https://www.w3schools.com/graphics/svg_line.asp)
```
<line id="the-id" x1="0" y1="0" x2="200" y2="200" style="stroke:rgb(255,0,0);stroke-width:2" />
```

## polygon
The [polygon tag](https://www.w3schools.com/graphics/svg_polygon.asp)
```
<polygon id="the-id" points="220,10 300,210 170,250 123,234" style="fill:lime;stroke:purple;stroke-width:1" />
```

## polyline
The [polyline tag](https://www.w3schools.com/graphics/svg_polyline.asp)
```
<polyline id="the-id" points="0,40 40,40 40,80 80,80 80,120 120,120 120,160"
  style="fill:white;stroke:red;stroke-width:4" />
```

## path
The [path tag](https://www.w3schools.com/graphics/svg_path.asp)
```
  <path id="the-id" d="M 100 350 q 150 -300 300 0" stroke="blue"
  stroke-width="5" fill="none" />
```

## text
The [text tag](https://www.w3schools.com/graphics/svg_text.asp)
```
<text x="0" y="15" fill="red" transform="rotate(30 20,40)">I love SVG</text>
```

# How it works
The rendering you do start with a start tag and end with an end tag.
In the middle you can add any shapes you want. The rendering engine will put unique IDs on all elements.

## Demo
In [infohub_demo_svg](plugin,infohub_demo_svg) you see the SVG renderer in action.

[/columns]
# License
This documentation is copyright (C) 2020 Peter Lembke.  
Permission is granted to copy, distribute and/or modify this document under the terms of the GNU Free Documentation License, Version 1.3 or any later version published by the Free Software Foundation; with no Invariant Sections, no Front-Cover Texts, and no Back-Cover Texts.  
You should have received a copy of the GNU Free Documentation License along with this documentation. If not, see [https://www.gnu.org/licenses/](https://www.gnu.org/licenses/).  SPDX-License-Identifier: GFDL-1.3-or-later  

Since 2020-04-18 by Peter Lembke  
Updated 2020-04-18 by Peter Lembke  
