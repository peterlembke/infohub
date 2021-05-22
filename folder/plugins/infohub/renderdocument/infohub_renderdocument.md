# Infohub RenderDocument

This is a traditional infohub renderer that render documents written in Markdown.   
Links can be internal or external. Images can be assets or what you provide.

[columns]

## Introduction

Infohub uses a simple text format called Markdown. The text format is readable by both humans and computers, and is
rendered good in a web browser.  
When a plugin need a Markdown document to be rendered it can reference infohub_renderdocument in the rendering
procedure. You can see examples of this later in this text.

Possible uses of renderdocument in:

* Documentation
* Blogs
* Stories
* Instructions
* Messages

## Markdown

The markdown format used in the documents are easy to learn. It is used on Github and on many other places. Read
more [here](https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet).

### Section

Sections are internal links in the document so you can navigate to different sections within the document.  
The markdown format has titles and each title will get an `a` tag and an id based on the title name.  
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

- Bold text. Start and end with a `**` **Like this**
- Underline text. Start and end with a `__` __Like this__
- Italic text. Start and end with a `//`. //Like this//
- Strike trough text. Start and end with a `~~`. ~~Like this~~
- Or you can [light]highlight some text[/light] whenever you want.

### Link

Links are part of the Markdown format. If you link to external pages then they will open in a separate tab/window.

#### External links

This example will open an external link in a new tab.

```
Read more [here](https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet).
```

##### How external links are rendered

The example above will translate into `[link_external_1]` in the text and in the rendering array you will see:

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
[Yes I want to participate](infohub_demo|click_link|i_say_yes).
[No I do not want to participate](infohub_demo|click_link|i_say_no).
```

The format is level 1 plugin name | public function name | data to send.  
Divider is a pipe sign |.

##### How internal links are rendered

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
    'final_plugin': 'infohub_demo',
    'final_function': 'click_link',
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
    'final_plugin': 'infohub_demo',
    'final_function': 'click_link',
    'class': 'link'
},
```

The result:
[Yes I want to participate](infohub_demo|click_link|i_say_yes).
[No I do not want to participate](infohub_demo|click_link|i_say_no).

### Image

You can have images in your markdown.  
This is how an image are shown in Markdown. It is the same format as a link plus a ! at the beginning.

```
![Alternative text](my-image-name)
```

The image can be stored as an asset to a level 1 plugin. That is suitable for images that are part of a plugin and set
during development of the plugin.

You can also provide images yourself to the rendering array. That is suitable for images that the user have uploaded and
that you perhaps have stored in the database.

#### external images

Normally when you write a markdown text and want an image then you need a reference to that image.  
Infohub do not allow references. Instead Infohub insert data where it is needed.

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

The result:
![Alternative text](infohub_demo/asset/image/common/con00004.jpeg)

##### How asset image jpeg are rendered

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

#### asset image svg

If your image is an asset SVG it can look like this:

```
![Alternative text](infohub_demo/asset/icon/common/duckduckgo-v107.svg)
```

The result:
![My alternative text](infohub_demo/asset/icon/common/duckduckgo-v107.svg)

#### How asset image svg are rendered

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

This: `![Alternative text](my_icon)`  
Is the same as: `[my_icon]`

## Examples

Here are examples of how you can render a markdown document.

### Basic example

In this example we show a markdown document.

```
return _SubCall({
    'to': {
        'node': 'client',
        'plugin': 'infohub_render',
        'function': 'create'
    },
    'data': {
        'what': {
            'my_document': {
                'plugin': 'infohub_renderdocument',
                'type': 'document',
                'text': $in.text
            }
        },
        'how': {
            'mode': 'one box',
            'text': '[my_document]'
        },
        'where': {
            'box_id': $in.box_id + '_my_result_box',
            'max_width': 100,
            'scroll_to_box_id': 'true'
        }
    },
    'data_back': {
        'step': 'step_render_html_response'
    }
});
```

### Render anything in the document

In this example we provide an image and it will be inserted in the Markdown text everywhere you write `[my_icon]`.  
You realize now that you can render anything in your Markdown texts as long as you provide how to render it in the
subcall. If a tag is `[missing]` data then it will be removed.

```
return _SubCall({
    'to': {
        'node': 'client',
        'plugin': 'infohub_render',
        'function': 'create'
    },
    'data': {
        'what': {
            'my_document': {
                'plugin': 'infohub_renderdocument',
                'type': 'document',
                'text': $in.text,
                'what': {
                    'my_icon': {
                        'type': 'common',
                        'subtype': 'svg',
                        'alias': 'my_icon',
                        'data': '[my_icon_asset]'
                    },
                    'my_icon_asset': {
                        'plugin': 'infohub_asset',
                        'type': 'icon',
                        'subtype': 'svg',
                        'asset_name': 'link/infohub-logo-mini-done',
                        'plugin_name': 'infohub_demo'
                    }
                }
            }
        },
        'how': {
            'mode': 'one box',
            'text': '[my_document]'
        },
        'where': {
            'box_id': $in.box_id + '_my_result_box',
            'max_width': 100,
            'scroll_to_box_id': 'true'
        }
    },
    'data_back': {
        'step': 'step_render_html_response'
    }
});
```

## Plugin functions

### Public functions

* create - render document
* event_message - click events for the internal links come here and are sent to the final plugin.

### Internal functions

#### internal_Document

Render the document. Will divide the document in smaller parts and add those parts to the array. Code segments, links
and images are handled.

[/columns]

# License

This documentation is copyright (C) 2019 Peter Lembke.  
Permission is granted to copy, distribute and/or modify this document under the terms of the GNU Free Documentation
License,   
Version 1.3 or any later version published by the Free Software Foundation; with no Invariant Sections, no Front-Cover
Texts, and no Back-Cover Texts.  
You should have received a copy of the GNU Free Documentation License along with this documentation.   
If not, see [https://www.gnu.org/licenses/](https://www.gnu.org/licenses/). SPDX-License-Identifier: GFDL-1.3-or-later

Created 2019-08-09 by Peter Lembke  
Updated 2020-01-24 by Peter Lembke
