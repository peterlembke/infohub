# Investigate - GUI designer

It would be easier to design the user interface with a GUI designer.
Drag and drop objects from a list and fill in the properties.
The result is rendered.

## List of renderers

* infohub_render_audio
* infohub_render_common
* infohub_render_form
* infohub_render_frog
* infohub_render_images
* infohub_render_link
* infohub_render_map
* infohub_render_svg
* infohub_render_table
* infohub_render_text
* infohub_render_video
* infohub_renderadvancedlist
* infohub_renderdocument
* infohub_renderform
* infohub_rendermajor
* infohub_rendermenu
* infohub_renderstatus

Each renderer can render one or more different objects.
Select a renderer to see a list with objects it can render.

## Drag and drop
Drag an object to the assembly area.
The object is added last in the list.
You can rearrange the list.
Click on an object to see its properties. Change the properties.
The name is always visible on the object. The name must always be unique in the list.

Some objects are only containers. For example: form, common container.
Most objects are partly containers. For example: major, advanced list, audio, video, link, map, text, video and many more.

The objects that can contain other objects have drop areas where you can drag and drop objects to create a binding.
In your list with objects you select an object to see its properties. A smaller icon appear that you can drag to another objects drop area.
The drop area then show the icon. You can rearrange the icons and remove an icon.

## Render the result

Button to render the result.

## See the finished array

Button to see the finished JSON.

## Components needed

* [Item container](main,investigate_itemcontainer) for drag and drop
* [quickform](main,investigate_quickform) for displaying properties

# License
This documentation is copyright (C) 2022 Peter Lembke.  
Permission is granted to copy, distribute and/or modify this document under the terms of the GNU Free Documentation License, Version 1.3 or any later version published by the Free Software Foundation; with no Invariant Sections, no Front-Cover Texts, and no Back-Cover Texts.  
You should have received a copy of the GNU Free Documentation License along with this documentation. If not, see [https://www.gnu.org/licenses/](https://www.gnu.org/licenses/).  SPDX-License-Identifier: GFDL-1.3-or-later

Created 2022-04-13 by Peter Lembke  
Updated 2022-04-13 by Peter Lembke  
