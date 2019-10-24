# Infohub RenderForm
Adds features to the basic form elements that infohub_render_form can render.  

# Introduction
RenderForm uses render_form and add features on top of render_form.  
RenderForm adds label, description, original_data, symbol for required, symbol for changed, counts characters, shows max length, counts words and paragraphs.  
RenderForm is also the receiver of all events regarding the form elements. Mostly onchange and click.  
RenderForm also handle the form data by reading and writing data. It does not however update lists and options, that need to be rerendered to be updated.  

# infohub render form
The plugin infohub_render_form is a child to infohub_render and handle the render for the basic form elements, it handle the actual HTML that DOM needs to display the element.
infohub_renderform on the other hand is a level 1 plugin that can receive events. It uses infohub_render_form for the rendering and adds extended features.  

# Form
All forms should be encapsulated with the form tag. You get a fieldset container at the same time.  

# Fieldset
All form elements and the form itself will all be encapsulated with fieldsets. The reason is simple. There are a lot of components on each form element, like flags: required, valid, info icon.
And then you have the title, the description, error message from the validation,
Character count, word count, line count, max length, selected range value. There is a lot of information for each form element.
So to keep everything together I have decided to use fieldset as a wrapper round each form element when you render them with infohub_renderform. There is no way to avoid the fieldset wrapper.  

# Label
The fieldset can show a legend label.  

# Description
You get a toggle SVG image (i) that shows the description within the fieldset. So if the label and the placeholder is not enough information to you then you can click the (i) SVG and see the descripton.  

# Original data
This hidden div box contain the orignal data as it was before the user changed the form element. The information is used to show the right SVG. SVG for Unchanged/Changed.  

# changed
There are two SVG icons, one is a symbol for "unchanged", the other is a symbol for "Changed". You will see if the form element is considered to be changed by your input.  

# required
There are two SVG icons, one is a symbol for "optional", the other is a symbol for "required". If you have a required text box then you can not save until the text box got some data.
Some form elements like check boxes that only have two states can be set as required but both values true/false are valid.  

# maxlength
If a form element have maxlength set then there will be a number showing the remaining characters you can write. For example if you are allowed to write 120 characters,
then you see 120 when the text box is empty. When you have filled the box with 50 characters the number will say 70.  

# value
Form elements like colour picker and range, they do not show their values. We have to copy the value to a box to see it.  

# event: changed
When the user change something in a form element then an event message are sent to renderform. Now the icon for changed data can be updated.  

# event: onclick
The click event is just for buttons. The event ends up in renderform. Now we can get the button mode and the affected_aliases to read or update the form fields.
Then the assembled data are sent to your plugin so you can act on it. Perhaps save the data.  

# CSS
The form elements are made pretty with CSS. The default CSS is to have round borders and grey/white relief so it looks like the forms are engraved in metal.  
When you render a form you can provide your own CSS. renderform will provide CSS as a standard set up. You can provide your own if you want to.  

# How to use
This is an example how you can use the renderform.  

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
                'plugin': 'infohub_renderform',
                'type': 'presentation_box',
                'head_label': 'Video from Istanbul marathon',
                'foot_text': 'The information text below the video can be as large as you want and the video will scale up to the size of the rest of the contents',
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

# License
This documentation is copyright (C) 2018 Peter Lembke.  
Permission is granted to copy, distribute and/or modify this document under the terms of the GNU Free Documentation License, Version 1.3 or any later version published by the Free Software Foundation; with no Invariant Sections, no Front-Cover Texts, and no Back-Cover Texts.  
You should have received a copy of the GNU Free Documentation License along with this documentation. If not, see [https://www.gnu.org/licenses/](https://www.gnu.org/licenses/).  

Since 2018-05-30 by Peter Lembke  
Updated 2018-05-30 by Peter Lembke  
