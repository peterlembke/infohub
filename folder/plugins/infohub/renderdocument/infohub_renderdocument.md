# Infohub RenderDocument
This is a traditional renderer that render documents written in Markdown.   
Links can be internal or external. Images can be assets or what you provide.

[columns]

## Introduction
Infohub uses a simple text format called Markdown. The text format is readable by both humans and computers, and is rendered good in a web browser.  
When a plugin need a Markdown document to be rendered it can reference infohub_renderdocument in the rendering procedure. You can see examples of this later in this text.

Possible uses of renderdocument in:
* Documentation
* Blogs
* Stories
* Instructions
* Messages

## Markdown
The markdown format used in the documents are easy to learn. It is used on Github and on many other places.
Read more [here](https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet).

### Section
Sections are internal links in the document so you can navigate to different sections within the document.  
The markdown format has titles and each title will get an a tag and an id based on the title name.  
The index can then scroll to each title.

```
# Main title
Text here
## Sub title
Text here
### Sub sub title
text here
and so on
```

### Style
Styles can be used to make text fatter, underlined, slant or scrapped.
Bold text. Start and end with a `**` **Like this** 
Underline text. Start and end with a `__` __Like this__ 
Italic text. Start and end with a `//`. //Like this// 
Strike trough text. Start and end with a `~~`. ~~Like this~~  
Or you can [light]highlight some text[/light] whenever you want.

### Link
Links are part of the Markdown format. If you link to external pages then they will open in a separate tab/window.

#### External links
This example will open an external link in a new tab.  
```
Read more [here](https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet).
```

If the link for some reason is not rendered with a target=_blank then a warning will show in the top of the screen.  
The warning comes from the sanity check scanner. One of the markdown renderers are missing support for target=_blank.

The example will translate into `[link_external_1]` in the text and in the array you will see:
```
'link_external_1': {
    'type': 'link',
    'subtype': 'external',
    'alias': 'link_external_1',
    'show': 'here',
    'url': 'https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet'
},
```
The result:
Read more [here](https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet).

#### Internal links
This example will send data back to plugin infohub_signup, function click_participate.
```
[Yes I want to participate](infohub_signup|click_participate|i_say_yes).
[No I do not want to participate](infohub_signup|click_participate|i_say_no).
```
The format is level 1 plugin name | public function name | data to send.  
Divider is a pipe sign |.

The example will translate into `[link_event_1]` and `[link_event_2]` in the text and in the array you will see:
```
'link_event_1': {
    'type': 'link',
    'subtype': 'link',
    'alias': 'link_event_1',
    'data': 'i_say_yes',
    'show': 'Yes I want to participate',
    'to_node': 'client',
    'to_plugin': 'infohub_renderdocument',
    'to_function': 'click_link',
    'final_node': 'client',
    'final_plugin': 'infohub_signup',
    'final_function': 'click_participate',
    'class': 'link'
},
'link_event_2': {
    'type': 'link',
    'subtype': 'link',
    'alias': 'link_event_2',
    'data': 'i_say_no',
    'show': 'No I do not want to participate',
    'to_node': 'client',
    'to_plugin': 'infohub_renderdocument',
    'to_function': 'click_link',
    'final_node': 'client',
    'final_plugin': 'infohub_signup',
    'final_function': 'click_participate',
    'class': 'link'
},
```
The result:
[Yes I want to participate](infohub_signup|click_participate|i_say_yes).
[No I do not want to participate](infohub_signup|click_participate|i_say_no).

### Image
You can have images in your markdown.  
This is how an image are shown in Markdown. It is the same format as a link plus a ! at the beginning.
```
![Alternative text](my-image-name)
```

The image can be stored as an asset to a level 1 plugin. That is suitable for images that are part of a plugin and set during development of the plugin. 

You can also provide images yourself to the rendering array. That is suitable for images that the user have uploaded and that you perhaps have stored in the database.

#### external images
Normally when you write a markdown text and want an image then you need a reference to that image.  
Infohub do not have ANY files you can reference. Infohub insert data where it is needed.  

You can NOT reference an image from the internet. If you use an url like this:
```
![Alternative text](https://www.aaaa.com/image.jpeg)
```
That will just be removed from the markdown and you will see no image.

The result:
![Alternative text](https://www.aaaa.com/image.jpeg)
 
Instead you have to use assets or provide image data. See below.

#### asset image jpeg
If your image is an asset jpeg then it can look like this.
```
![Alternative text](infohub_demo/asset/image/common/con00004.jpeg)
```
That would substitute to a `[image_1]` in the text and in the array you will see:
```
'image_1': {
    'type': 'common',
    'subtype': 'image',
    'data': '[image_asset_1]',
    'class': 'image'
},
'image_asset_1': {
    'plugin': 'infohub_asset',
    'type': 'image',
    'subtype': 'jpeg',
    'asset_name': 'common/con00004',
    'plugin_name': 'infohub_demo'
},
```
The result:
![Alternative text](infohub_demo/asset/image/common/con00004.jpeg)

#### asset image svg
If your image is an asset SVG it can look like this:
```
![Alternative text](infohub_demo/asset/icon/common/duckduckgo-v107.svg)
```
That would substitute to a `[svg_1]` and in the array you will see:
```
'svg_1': {
    'type': 'common',
    'subtype': 'svg',
    'data': '[svg_asset_1]'
},
'svg_asset_1': {
    'plugin': 'infohub_asset',
    'type': 'icon',
    'subtype': 'svg',
    'asset_name': 'common/duckduckgo-v107',
    'plugin_name': 'infohub_demo'
},
```
The result:
![My alternative text](infohub_demo/asset/icon/common/duckduckgo-v107.svg)

#### provide own image
If you write a plain image name without any `/` in it:
```
![Alternative text](my-image-name)
```
That would translate to [my-image-name] in the text.  
 
You need to provide the image details yourself in the rendering array. 
```
'my-image-name': {
    'type': 'common',
    'subtype': 'image',
    'data': 'the base64 encoded data from the image will be inserted here',
    'class': 'image'
},
```
This:
![Alternative text](my_icon)
Is the same as:
[my_icon]

## Examples
Here are examples of how you can render a markdown document.

### Basic example with image assets
In this example we show a markdown document with image assets.
```

```

### example with provided images
In this example we provide an image ourself.
```

```

### example with other objects provided
In this example we have added rendering commands in the text and provided entries in the array to what we want to be rendered.
```

```
 
## Plugin functions

### Public functions
* create - render document
* click_link - click events for the internal links come here

### Internal functions

#### internal_Document   
Render the document. Will divide the document in smaller parts and add those parts to the array.
Code segments, links and images are handled.

[/columns]

# License
This documentation is copyright (C) 2019 Peter Lembke.  
Permission is granted to copy, distribute and/or modify this document under the terms of the GNU Free Documentation License,   
Version 1.3 or any later version published by the Free Software Foundation; with no Invariant Sections, no Front-Cover Texts, and no Back-Cover Texts.  
You should have received a copy of the GNU Free Documentation License along with this documentation.   
If not, see [https://www.gnu.org/licenses/](https://www.gnu.org/licenses/).  

Created 2019-08-09 by Peter Lembke  
Updated 2019-08-10 by Peter Lembke
