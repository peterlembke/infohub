# Infohub RenderMajor

Render a content box with a top title, footer text, content with optional embedded content.

[columns]

# Introduction

The major box is a box you can use to show content. It has a lot of optional features:

- head_label - An optional title.
- content_data - The content area where your stuff is
- foot_text - An optional text below the content_area. Used for explaining the content.
- If you have a title you can show/hide the content_data
- You decide if the content should show/hide from start with "open" = "true" or "false".
- content_embed, (optional) The content_data is clickable and the embedded content show instead.
- content_embed_new_tab, (optional) You can add a link in the footer. You can show the video at YouTube.com in a new
  tab.

# How to use

This is an example how you can use the rendermajor.

```
return _SubCall({
    'to': {
        'node': 'client',
        'plugin': 'infohub_render',
        'function': 'create'
    },
    'data': {
        'what': {
            'nike_video_presentation': {
                'plugin': 'infohub_rendermajor',
                'type': 'presentation_box',
                'head_label': 'Video from Istanbul marathon',
                'foot_text': 'The information text below the video can be' . 
                    ' as large as you want and the video will scale up to' . 
                    ' the size of the rest of the contents',
                'content_data': '[my_image]',
                'content_embed': '[nike_video]',
                'content_embed_new_tab': '[nike_video_link]',
                'open': 'false'
            },
            'my_image': {
                'type': 'common',
                'subtype': 'image',
                'data': '/9j/4AAQSkZJRgABAQEASABIAAD and so on...'
            },
            'nike_video': {
                'type': 'video',
                'subtype': 'vimeo',
                'data': '54003514'
            },
            'nike_video_link': {
                'type': 'video',
                'subtype': 'vimeolink',
                'data': '54003514',
                'class': 'right'
            },
        },
        'how': {
            'mode': 'one box',
            'text': '[nike_video_presentation]'
        },
        'where': {
            'parent_box_id': 'main.body.infohub_demo',
            'box_position': 'last',
            'box_alias': 'infohub_common_video_vimeo',
            'max_width': 320
        }
    },
    'data_back': {
        'step': 'demo_head_2'
    }
});
```

# head_label

The head_label can be empty, a text or anything you can render. If you have anything in head_label then it will be
clickable, and you can show/hide the content_data area. The foot_text is not affected.
![Click the head label to show/hide the content_data area](major-image.png)
![The content_data is now hidden](major-content-data-folded.png)

# content_data

The content data can be empty, a text or anything you can render. In the initial example above the content_data is an
image 'my_image'.  
You put the image in your plugin folder in folder "asset". You give it a license json file. Then in your plugin you ask
infohub_asset for the image. In the example above I inserted the base64 image directly, you can do that for testing
purposes but use asset as the proper solution.

# content_embed

The content_embed can be empty, a text or anything you can render. If you use content_embed then your content_data area
will be clickable. If you click then the content_data will be overwritten with the data from content_embed.  
content_embed can be anything you can render. The rendered data will be BASE64 encoded and inserted in the rendermajor
box. When you click the content_data an event will decode the content_embed and overwrite content_data.  
This is useful if you want to give the user an option to say no to use for example an iframe with a YouTube video in
it.  
Once you click you can not undo.
![The image is clickable](major-embed.png)
![After clicking you see the embedded content](major-embed-show.png)

# content_embed_new_tab

The content_embed_new_tab can be empty, a text or anything you can render. The thought is that you render a link in this
area to external contents.  
The purpose of the link is to provide external information about the content. It can also be a way to show a YouTube
video at YouTube so those that do not want to use 3rd party embedded services have a choice to press the link instead.  
In the images you see the link label "New tab", you decide what to show here because you set the label when you render
the link.

# External services

Infohub do not endorse the use of 3rd party services directly. That means you should not link to 3rd party scripts,
images, iframe links etc. Reason is performance, security, privacy, bandwidth, stability.  
The reality is that most people do not think about privacy, they want to see the YouTube video instead. As a middle way
you can offer that video embedded in a major box with an option to click a link to see the video at YouTube instead.  
Use the renderers for YouTube, Vimeo, Spotify and so on - they all use a restricted iframe renderer and only give the
rights needed by the 3rd party to work.  
But optional is always to not use 3rd party at all. In the future there will be an individual setting "allow embedded
3rd party content", default to "false". That setting will be used in the renderers to avoid rendering unwanted material
that compromise security and privacy.

# show

If you use a head_label then it is clickable, and you can show/hide the content_data. You can also say if the
content_data should start visible och hidden with the "open" option. See the example above. You set to "true" or "false"
.

# HTML generated

The above example will generate some HTML. If you click the image then the embedded base64 encoded html will take its
place and show the iframe. In the below example I have clicked the image, this is the result.

```
<span name="legend" class="a120420102_nike_video_presentation_legend">
    <style scoped="">
        .a120420102_nike_video_presentation_legend fieldset {
        border: 1px solid #bcdebc;
        margin: 8px 4px 8px 4px;
        padding: 4px 4px 4px 4px;
        border-radius: 10px;
        }

        .a120420102_nike_video_presentation_legend fieldset .legend {
        color: #000;
        border: 1px solid #a6c8a6;
        padding: 2px 13px;
        font-size: 1.0em;
        font-weight: bold;
        box-shadow: 0 0 0 0px #ddd;
        margin-left: 20px;
        border-radius: 20px;
        }
    </style>
    <fieldset class="fieldset">
        <legend class="legend">
            <span name="head" class="a120420102_nike_video_presentation_head">
                <style scoped="">
                    .a120420102_nike_video_presentation_head .link {
                    color: rgba(68, 69, 166, 0.89);
                    }
                </style>
                <a id="120420102_nike_video_presentation_head" name="head" class="link" renderer="infohub_render_link"
                   type="toggle" alias="head" toggle_id="120420102_nike_video_presentation_content" to_node="client"
                   to_plugin="infohub_view" to_function="toggle"
                   onclick="go('infohub_view', 'toggle', '120420102_nike_video_presentation_head')">
                    <span id="120420102_nike_video_presentation_head_data" name="head_data" class="container">
                        Video from Istanbul marathon
                    </span>
                </a>
            </span>
        </legend>
        <span id="120420102_nike_video_presentation_content" name="content" class="container">
            <span name="content_data_link" class="a120420102_nike_video_presentation_content_data_link">
                <span name="nike_video" class="a120420102_nike_video">
                    <style scoped="">
                        .a120420102_nike_video .video {
                        width: 100%;
                        clear: both;
                        display: inline-block;
                        box-sizing: border-box;
                        border-radius: 15px 15px 15px 15px;
                        }
                    </style>
                    <iframe
                            id="120420102_nike_video"
                            name="nike_video"
                            class="video"
                            src="https://player.vimeo.com/video/54003514?title=0&amp;byline=0&amp;portrait=0&amp;badge=0&amp;color=d4cfcf"
                            height="100%"
                            frameborder="0"
                            webkitallowfullscreen=""
                            mozallowfullscreen=""
                            allowfullscreen="">
                    </iframe>
                </span>
            </span>
        </span>
        <span id="120420102_nike_video_presentation_foot" name="foot" class="container">
            <span name="nike_video_link" class="a120420102_nike_video_link">
                <style scoped="">
                    .a120420102_nike_video_link .right {
                    position: relative;
                    float: right;
                    margin: 3px 3px 0px 3px;
                    }
                </style>
                <div id="120420102_nike_video_link" name="nike_video_link" class="right">
                    <a href="https://vimeo.com/54003514" target="_blank">New tab</a>
                </div>
            </span>
            The information text below the video can be as large as you want and the video will scale up to the size of the rest of the contents
        </span>
    </fieldset>
</span>
```

[/columns]

# License

This documentation is copyright (C) 2017 Peter Lembke.  
Permission is granted to copy, distribute and/or modify this document under the terms of the GNU Free Documentation
License, Version 1.3 or any later version published by the Free Software Foundation; with no Invariant Sections, no
Front-Cover Texts, and no Back-Cover Texts.  
You should have received a copy of the GNU Free Documentation License along with this documentation. If not,
see [https://www.gnu.org/licenses/](https://www.gnu.org/licenses/). SPDX-License-Identifier: GFDL-1.3-or-later

Since 2017-09-23 by Peter Lembke  
Updated 2018-04-11 by Peter Lembke  
