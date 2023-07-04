# InfoHub color

Configure dark mode and primary colors.

The rest of the colours are calculated by the plugin.

# Primary colours

Configure one or more primary colors. They are used to calculate all shades. I will have six colours you can configure.

* 0, Layer 0: Background
* 1, Layer 1: Normal
* 2, Layer 1: Highlight
* 3, Layer 1: Warning
* 4, Layer 2: Text normal
* 5, Layer 2: Text titles

Each layer has its own light percent. If you pick 10% on layer 0 then you have 50% on Layer 1 and 90% on layer 2.

## 0, Layer 0: Background

* body background

## 1, Layer 1: Normal

* Fieldset and Legend frame color
* Form elements color
* Form list row selected background color
* Selected icon text background
* Button background
* Bar background
* Table borders
* Table head row background

## 2, Layer 1: Highlight

* Legend area hover background
* Form elements hover color
* Form list row hover
* Icon hover background
* Button hover background
* Selected Text box border color
* Selected Text area border color
* Bar color
* Table row hover background
* Highlighted text
* Link hover background

## 3, Layer 1: Warning

* Top warning box background
* Form elements fail border color
*

## 4, Layer 2: Text normal

* Button texts on top of level 1
* Normal texts on top of level 0
* Table row text color

## 5, Layer 2: Text titles

* Legend text on top of level 0 and 1
* Table head row text color
* H1, H2, H3, H4 titles
* Link colour

# Light or dark side

You select a main light percent for the background. How dark or light you want the background to be. That will be the
light percent of layer 0.

Then layer 1 and layer 2 light percent are calculated, so they are a bit away from the background.

Example: You pick 10% (almost black) for the background color. You get a very dark shade of the colour you picked for
the background. Now layer 1 will be 50%. You get full pastel colors. Layer 2 will be 90% (almost white). You get a
bright shade of the text color you selected.

The Layer 2 text now shows with good contrast on top of both layer 0 and on layer 1.

I have tried to have as much of the background visible as possible. I have the body background in text boxes and text
areas. I highlight the border around them when selected.

# Basic colour schema

This rather ugly colour schema is the basic colour schema. I used it to set these colours everywhere in the code.

'layer-0-background': '#f76d6d',
'layer-1-normal': '#7df76d',
'layer-1-highlight': '#6d8df7',
'layer-1-warning': '#ff0000',
'layer-2-normal-text': '#0b1f00',
'layer-2-title-text': '#1b350a',

I removed all rgb() and all friendly names (blue, yellow and so on) and all other colours that are either hard coded or
in config files. No other systems than this schema system are allowed now.

# Plugins with colours

These plugins are the only ones right now that set colours:

* infohub_demo_common
* infohub_workbench
* infohub_render_common
* infohub_render_table
* infohub_render_form

I would like to only have infohub_render_ plugins to set colours.

# License

This documentation is copyright (C) 2020 Peter Lembke.  
Permission is granted to copy, distribute and/or modify this document under the terms of the GNU Free Documentation
License, Version 1.3 or any later version published by the Free Software Foundation; with no Invariant Sections, no
Front-Cover Links, and no Back-Cover Links.  
You should have received a copy of the GNU Free Documentation License along with this documentation. If not,
see [https://www.gnu.org/licenses/](https://www.gnu.org/licenses/). SPDX-License-Identifier: GFDL-1.3-or-later

Since 2020-10-19 by Peter Lembke  
Updated 2020-12-29 by Peter Lembke  
