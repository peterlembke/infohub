# InfoHub RenderForm

Add features to the basic form elements that infohub_render_form can render.

# Introduction

RenderForm uses render_form and add features on top of render_form.  
RenderForm adds label, description, original_data, symbol for required, symbol for changed, counts characters, shows max
length, counts words and paragraphs.  
RenderForm is also the receiver of all events regarding the form elements. Mostly onchange and click.  
RenderForm also handle the form data by reading and writing data. It does not however update lists and options, that
need to be re-rendered to be updated.

# Demo

You can see a full demo here [InfoHub Demo Form2](plugin,infohub_demo_form2). That demo will show you all aspects of
renderform.

# infohub_render_form

The plugin infohub_render_form is a child to infohub_render and handle the render for the basic form elements, it handles
the actual HTML that DOM needs to display the element. infohub_renderform on the other hand is a level 1 plugin that can
receive events. It uses infohub_render_form for the rendering and adds extended features upon that.

# Form

All forms should be encapsulated with the form tag. You get a fieldset container at the same time.

```
'my_form': {
    'plugin': 'infohub_renderform',
    'type': 'form',
    'content': '[button_fill_data_quick_burger][button_fill_data_lunch_burger][button_fill_data_dinner_burger][of_age][my_textbox][my_datalist][my_select][my_radios_bread][my_radios_burger][my_range][my_checkboxes_extras][my_colour_select][my_textarea][my_button]',
    'label': 'Your burger meal',
    'description': 'Please select the details for your burger meal.'
},
```

# Fieldset

All form elements and the form itself will all be encapsulated with fieldsets. The reason is simple. There are a lot of
components on each form element, like flags: required, valid, info icon. And then you have the title, the description,
error message from the validation, Character count, word count, line count, max length, selected range value. There is a
lot of information for each form element. So to keep everything together I have decided to use fieldset as a wrapper
round each form element when you render them with infohub_renderform. There is no way to avoid the fieldset wrapper.  
You can see in the HTML below how it looks like on then rendered page when we render radio buttons. The example is from
the InfoHub Demo Form Advanced.

```
<span name="presentation_box" class="a120202_my_radios_bread_presentation_box">
    <style scoped="">
        .a120202_my_radios_bread_presentation_box fieldset .head { display: block; }
        .a120202_my_radios_bread_presentation_box fieldset .content {  }
        .a120202_my_radios_bread_presentation_box fieldset .foot { display: block; }
    </style>
    <span name="legend" class="a120202_my_radios_bread_presentation_box_legend">
        <style scoped="">
            .a120202_my_radios_bread_presentation_box_legend  { break-inside: avoid; }
            .a120202_my_radios_bread_presentation_box_legend fieldset { border: 1px solid #bcdebc; margin: 8px 4px 8px 4px; padding: 4px 4px 4px 4px; border-radius:10px; }
            .a120202_my_radios_bread_presentation_box_legend fieldset .legend { color: #000; border: 1px solid #a6c8a6; padding: 2px 13px; font-size: 1.0em; font-weight: bold; box-shadow: 0 0 0 0px #ddd; margin-left: 20px; border-radius: 20px; }
        </style>
        <fieldset class="fieldset">
            <legend class="legend">
                <span name="head_label" class="a120202_my_radios_bread_presentation_box_head_label">
                    <style scoped="">
                        .a120202_my_radios_bread_presentation_box_head_label .link { color: rgba(68, 69, 166, 0.89); }
                    </style>
                    <a id="120202_my_radios_bread_presentation_box_head_label" name="head_label" class="link" renderer="infohub_render_link" type="toggle" alias="head_label" toggle_id="120202_my_radios_bread_presentation_box_content" to_node="client" to_plugin="infohub_view" to_function="toggle" onclick="go('infohub_view', 'toggle', '120202_my_radios_bread_presentation_box_head_label')">
                        <span id="120202_my_radios_bread_presentation_box_head_label_data" name="head_label_data" class="container">Bread</span>
                    </a>
                </span>
            </legend>
            <span id="120202_my_radios_bread_presentation_box_head" name="head" class="head">What kind of bread do you want?</span>
            <span id="120202_my_radios_bread_presentation_box_content" name="content" class="content" style="display:block">
                <span name="form_element" class="a120202_my_radios_bread_form_element">
                    <style scoped="">
                        .a120202_my_radios_bread_form_element .radio {  }
                        .a120202_my_radios_bread_form_element label {  }
                        .a120202_my_radios_bread_form_element span { display:inline-block; }
                    </style>
                    <span>
                        <input id="120202_my_radios_bread_form_element_bread_plain" name="bread" class="radio" type="radio" alias="form_element_bread_plain" option_alias="bread_plain" renderer="infohub_render_form" value="bread_plain" form_alias="my_radios_bread" to_node="client" to_function="event_message" to_plugin="infohub_renderform" onchange="go('infohub_render','change','120202_my_radios_bread_form_element_bread_plain')" checked="">
                            <label for="120202_my_radios_bread_form_element_bread_plain">Plain bread</label>
                    </span>
                    <span>
                        <input id="120202_my_radios_bread_form_element_bread_full" name="bread" class="radio" type="radio" alias="form_element_bread_full" option_alias="bread_full" renderer="infohub_render_form" value="bread_full" form_alias="my_radios_bread" to_node="client" to_function="event_message" to_plugin="infohub_renderform" onchange="go('infohub_render','change','120202_my_radios_bread_form_element_bread_full')">
                        <label for="120202_my_radios_bread_form_element_bread_full">Fiber bread</label>
                    </span>
                    <span>
                        <input id="120202_my_radios_bread_form_element_bread_sesam" name="bread" class="radio" type="radio" alias="form_element_bread_sesam" option_alias="bread_sesam" renderer="infohub_render_form" value="bread_sesam" form_alias="my_radios_bread" to_node="client" to_function="event_message" to_plugin="infohub_renderform" onchange="go('infohub_render','change','120202_my_radios_bread_form_element_bread_sesam')">
                        <label for="120202_my_radios_bread_form_element_bread_sesam">Sesam bread</label>
                    </span>
                </span>
            </span>
        </fieldset>
    </span>
</span>
```

The above example are the rendered result from the code below:

```
'my_radios_bread': {
    'plugin': 'infohub_renderform',
    'type': 'radios',
    "label": "Bread",
    "description": "What kind of bread do you want?",
    'group_name': 'testing',
    "options": [
        { "group_name": "bread", "value": "bread_plain", "label": "Plain bread", 'selected': 'true' },
        { "group_name": "bread", "value": "bread_full", "label": "Fiber bread" },
        { "group_name": "bread", "value": "bread_sesam", "label": "Sesam bread" }
    ]
},
```

# Label

Each fieldset can show a legend label. It is the top label and it is clickable. The label is just a normal text.

# Description

Description is a normal text, and you know what you can do with texts. You can add any rendered objects you like into
that text.

# Text

Text input in one row. You can not set a start text.

```
$default = {
    'label': '', // The clickable text at the top
    'description': '', // Optional descriptive text
    'maxlength': '', // Optional number of characters until the text are cut off
    'datalist_id': '', // Optional dropdown list. Rendered separately
    'placeholder': '', // Optional text that show when the text box is empty
    'to_node': 'client', // node, plugin, function that will get the change event after validation
    'to_plugin': 'infohub_renderform',
    'to_function': 'event_message',
    'validator_plugin': '', // Validator plugin, function. Node is always client
    'validator_function': '',
    'class': 'text', // Optional class name
    'css_data': {}, // Optional CSS data
    'original_alias': '' // The alias you used for this object. for example "my_text". Will be used as a container when you read/write data to the form
};
```

You do not need to set the original_alias. It will be populated.  
Usage: Here is an example.

```
'my_textbox': {
    'plugin': 'infohub_renderform',
    'type': 'text',
    'label': 'Alias',
    'description': 'Your alias for this burger order, so you can easily reorder at a later time',
    'maxlength': '30',
    'validator_plugin': 'infohub_validate',
    'validator_function': 'validate_has_data',
    'datalist_id': 'my_datalist',
    'placeholder': 'Any alias'
},
```

# Range

Here you get a drag bar to set the value you want. You can not set a start value.

```
$default = {
    'label': '',
    'description': '',
    'min_value': '', // Left side value
    'max_value': '', // Right side value
    'step_value': '',
    'to_node': 'client',
    'to_plugin': 'infohub_renderform',
    'to_function': 'event_message',
    'class': 'range',
    'css_data': {},
    'original_alias': '',
    'show_min': 'true',
    'show_value': 'true',
    'show_max': 'true'
};
```

Usage: Here is an example.

```
'my_range': {
    'plugin': 'infohub_renderform',
    'type': 'range',
    'min_value': '50',
    'max_value': '250',
    'step_value': '25',
    'label': 'Frying the burger',
    'description': 'How much du you want us to fry the burger, from lightly touching the pan up to meteorite'
},
```

# Color

On all major platforms you will get a colour selector. On the rest of the platforms you get an ordinary input field.  
The default values are here. You can not set a default value when you render the colour selector, instead you write the
value in a separate call.

```
$default = {
    'label': '',
    'description': '',
    'to_node': 'client', // Where to send the changed value
    'to_plugin': 'infohub_renderform',
    'to_function': 'event_message',
    'class': 'color',
    'css_data': {},
    'original_alias': ''
};
```

Usage: Here is an example.

```
'my_colour_select': {
    'plugin': 'infohub_renderform',
    'type': 'color',
    'label': 'Flower',
    'description': 'You get a flower on the table. Select a colour and we will do a close match with the flowers we have.'
}
```

# Select

Creates a select box. You can set it to be a multi select if you want to. You can set the number of rows to display.

```
$default = {
    'enabled': 'true',
    'alias': '',
    "size": "10", // Number of rows to show
    "multiple": "true",
    "options": [], // See separate default structure
    'source_node': '',
    'source_plugin': '', // Plugin that has the options. Called only if the options are empty.
    'source_function': '',
    'to_node': 'client',
    'to_plugin': 'infohub_renderform',
    'to_function': 'event_message',
    'class': 'select',
    'css_data': {},
    'label': '', // Label on the rendermajor
    'description': '', // Description shown in the rendermajor
    'validator_plugin': '',
    'validator_function': '',
    'original_alias': '',
    'event_handler': 'infohub_renderform',
    'event_data': '',
    'show_error_text': 'true', // Show the message below the select on error
    'show_success_text': 'false', // Show the message below the select on success
    'custom_variables': {} // Added to the HTML as parameters
};
```

Here is an example of a select box

```
'my_select': {
    'plugin': 'infohub_renderform',
    'type': 'select',
    "label": "Side dish",
    "description": "What do you want to make your meal even better",
    "size": "10",
    "multiple": "true",
    'validator_plugin': 'infohub_validate',
    'validator_function': 'validate_has_data',
    "options": [
        { "type": "option", "value": "nothing", "label": "Nothing" },
        { "type": "optgroup", "label": "Cutlery" },
        { "type": "option", "value": "cutlery_knife", "label": "Knife" },
        { "type": "option", "value": "cutlery_fork", "label": "Fork" },
        { "type": "/optgroup" },
        { "type": "optgroup", "label": "Porcelain" },
        { "type": "option", "value": "porcelain_plait", "label": "Plait" },
        { "type": "option", "value": "porcelain_glass", "label": "Glass" },
        { "type": "/optgroup" },
        { "type": "optgroup", "label": "Fabric" },
        { "type": "option", "value": "fabric_napkin", "label": "Napkin" },
        { "type": "option", "value": "fabric_cloth", "label": "Table Cloth" },
        { "type": "/optgroup" }
    ]
},
```

# Textarea

The text area are for larger texts. renderform give you some extra features like word, character count.

```
const $default = {
    'enabled': 'true', // Visible. If set to enable false you can not write in the textarea
    'placeholder': '', // Shown in the textarea before you start writing
    'to_node': 'client', // plugin that should have the data after the event_handler have processed the event
    'to_plugin': 'infohub_renderform',
    'to_function': 'event_message',
    'class': 'textarea', // Standard class is textarea.
    'css_data': {}, // Leave empty to get the standard css
    'label': '', // Box label - What this textarea is about
    'description': '', // Box description - More details about this textarea
    'validator_plugin': '',  // plugin that validate the input and return 'valid' = 'true' or 'false'
    'validator_function': '', // used by infohub_render -> submit
    'original_alias': '', // Leave empty. Shown as form_alias in HTML. Has your render name 
    'show_characters': 'true', // Character count
    'show_words': 'true', // Word count
    'show_rows': 'true', // Row count
    'show_paragraphs': 'true', // Paragraph count
    'event_data': '', // Any string. Are given to_function onKeyup
    'custom_variables': $in.custom_variables,
    'rows': 4, // Number of rows. Can be changed manually with resize
    'cols': 0, // Number of columns. Can be changed manually with resize
    'resize': 'vertical', // vertical, both, none, horizontal
};
```

Usage: Here is an example.

```
'my_textarea': {
    'plugin': 'infohub_renderform',
    'type': 'textarea',
    'placeholder': 'Your special requests',
    "label": "Special requests",
    "description": "If you have some special requests for your meal then write them here.",
    'validator_plugin': 'infohub_validate',
    'validator_function': 'validate_has_data'
},
```

# Radios

Renders a collection of radio buttons. More advanced AM/FM radio receivers had buttons where you could set a frequency
for quicker change of radio channel. When you pressed in one button the others popped out, so you could listen you the
selected radio station.  
The GUI elements "radio buttons" were invented while those radios were very popular.

```
$default = {
    'group_name': '',
    "options": [],
    'to_node': 'client',
    'to_plugin': 'infohub_renderform',
    'to_function': 'event_message',
    'class': 'radio',
    'css_data': {},
    'label': '',
    'description': '',
    'original_alias': ''
};
```

Usage: Here is an example.

```
'my_radios_bread': {
    'plugin': 'infohub_renderform',
    'type': 'radios',
    "label": "Bread",
    "description": "What kind of bread do you want?",
    'group_name': 'testing',
    "options": [
        { "group_name": "bread", "value": "bread_plain", "label": "Plain bread", 'selected': 'true' },
        { "group_name": "bread", "value": "bread_full", "label": "Fiber bread" },
        { "group_name": "bread", "value": "bread_sesam", "label": "Sesam bread" }
    ]
},
```

# Checkboxes

Render a set of check boxes. You can not set any checkboxes during rendering. That must be done in a separate call.

```
$default = {
    "options": [],
    'to_node': 'client',
    'to_plugin': 'infohub_renderform',
    'to_function': 'event_message',
    'class': 'checkbox',
    'css_data': {},
    'label': '',
    'description': '',
    'original_alias': ''
};
```

Usage: Here is an example.

```
'of_age': {
    'plugin': 'infohub_renderform',
    'type': 'checkboxes',
    "label": "Of age",
    "description": "I can only sell to you if you are of age",
    "options": [
        { "value": "of_age", "label": "I am 18 years or older", 'validator_plugin': 'infohub_validate', 'validator_function': 'validate_is_true'}
    ]
},
```

# Button

The buttons and submit buttons are also rendered with renderform.

```
const $default = {
    'enabled': 'true', // You can disable the button so it does not react on click
    'alias': '',
    'class': 'button',
    'button_label': 'Submit',
    'mode': 'submit', // submit or button
    'event_data': 'submit',
    'event_handler': 'infohub_renderform', // Where the events are handled first and then sent to to_plugin
    'to_node': 'client',
    'to_plugin': '', // plugin that should have the data after the event_handler have processed the event,
    'to_function': 'event_message',
    'custom_variables': {}, // Added to the html element as parameters
    'css_data': {},
    'button_icon': '',
    'button_left_icon': '',
    'show_error_text': 'true', // Show the message below the select on error
    'show_success_text': 'false' // Show the message below the select on success
};
```

Usage: Here is an example.

```
'my_submit_button': {
    'plugin': 'infohub_renderform',
    'type': 'button',
    'mode': 'submit',
    'button_label': _Translate('Get UUID'),
    'event_data': 'uuid|handle_uuid|get_uuid',
    'to_plugin': 'infohub_tools',
    'to_function': 'click'
},
```

# Events

Some objects trigger events. Those events come to the module function event_message and are handled there.  
text, textarea, range, color, button, select are objects that have logic in this function.

# License

This documentation is copyright (C) 2018 Peter Lembke.  
Permission is granted to copy, distribute and/or modify this document under the terms of the GNU Free Documentation
License, Version 1.3 or any later version published by the Free Software Foundation; with no Invariant Sections, no
Front-Cover Texts, and no Back-Cover Texts.  
You should have received a copy of the GNU Free Documentation License along with this documentation. If not,
see [https://www.gnu.org/licenses/](https://www.gnu.org/licenses/). SPDX-License-Identifier: GFDL-1.3-or-later

Since 2018-05-30 by Peter Lembke  
Updated 2020-04-26 by Peter Lembke  
