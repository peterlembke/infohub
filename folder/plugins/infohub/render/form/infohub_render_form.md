# Infohub Render Form

Render frontend form objects

# Introduction

With the form elements you can input data. You can write and edit text, set/unset checkboxes, select none/one/more
alternatives from lists, select date and color, select one option from many alternatives (radio buttons).  
Your plugin can render form elements, you can give data to display in the form elements, you can get data from the form
elements.

# Render form elements

You render all form elements in one go to a box.  
All form elements are usually in the same box but you can render them in separate boxes if you want to as long as they
have the same parent.

# Render one form element

The form element first has a div box that works as a wrapper around the rest of the html elements. This wrapper has the
alias and a class. The contents of the wrapper is:

- input - the actual form element. Can be a list, collection of radio buttons, one checkbox, a textbox/textarea and so
  on.

These are the html elements that exist in all form elements. There might be more html elements in some types of form
elements, but never less than this.  
During rendering you set the alternatives in selects. You can NOT set any data during rendering. That must be done
separately.  
If you want to change a select list or add more radio buttons, then you need to render that element again, you can not
just add an option.

# Supporting functions

Render_Form has supporting functions to handle the form elements

- update_data - sets and gets data from one form.

## The data object

The data object you give to update_data look like the example below.

- type - The type of the input. Needed to determine how the data should be set on that type of form element
- get_data - If you provide get_data then that data will be returned from the form element
- get_original_data - If you provide get_original_data then that data will be returned from the form element
- set_data - If you provide set_data then that data will be set on the form element

```    
{
    "to": { "node": "client", "plugin": "infohub_view", "function": "set_form_data" },
    "data": {
        "parent_box_id": "",
        "aliases": {
            "first_name": {
                "type": "text",
                "set_data": "Beth",
                "get_data": "",
                "get_original_data": ""
            },
            "last_name": {
                "type": "text",
                "set_data": "Ruth",
                "get_data": "",
                "get_original_data": ""
            },
            "email": {
                "type": "text",
                "set_data": "beth.ruth@hotmail.com",
                "get_data": "",
                "get_original_data": ""
            },
            "female": {
                "type": "checkbox",
                "set_data": "true",
                "get_data": "",
                "get_original_data": ""
            }
        }
    },
    "data_back": {}
}
```

## update_data

With update_data you both get and set data for one or many form elements in one call.  
You can either call this function manually or you can let a button do this for you. For example a button for "Clear",
or "Set Example", or "Submit", or "Next".  
You provide the object as described previously. If you omit set_data then data will not be set. If you omit get_data
then you get no data. If you omit get_original_data then you will not get the original data.  
update_data will first get_data and get_original_data for you, and then set_data. When setting data, both input and
original_data are set.  
Render_Form call Infohub View for the actual setting/getting of data in the DOM.

# events

The form elements have some events, they all reach Render_Form.

## click

A button click event reach render form. It checks to_node, to_plugin, to_function and send the message further.  
This button can still have affected_aliases, if it does then you get a data_object.

## submit

A button submit event reach render form. In the data there is a list of affected_aliases. Render form put together an
object and send it to View. View read all original_data and input data, then return the object to render form. Render
form then send the object to the final destination in to_node, to_plugin, to_function.

## changed

The data in an form element has changed due to user input. The event message is sent to render form.

# Common properties

There is a set of properties that all form elements will have when it is created.

- alias - Unique alias among the form elements
- type - type of form element
- subtype - subtype of form element. Used in case there are variations of the type
- visible - If the wrapper div should be set visible or not
- enabled - If the input should be enabled or disabled
- required - Specifies that an input field is required (must be filled out)
- class - A css class to set on the wrapper div.
- css_data - object with css data for the wrapper class and the child HTML div boxes

# button

The button makes things happen. It has all the properties like any other form element and some of its own

- button_label - Shown on the button
- to_plugin - Plugin name that will receive the button click event, or the submit data after it is assembled into an
  object
- mode - reset, submit, click
- data - Some data you want to add in the event
- affected_aliases - a string with comma separated aliases that are affected by the submit or the clear

__Mode__

- Mode "submit" is used when you want to assemble the data from the affected_aliases into an object and send it
  to_plugin as an event message.
    - The receiving plugin can now do whatever it like with the data, like storing it. And perhaps load the next post
      and show that data on the form elements.
    - The event comes to Render_Form. An object is created and sent to View. View read the DOM and send back the data to
      Render_Form. Render_Form send the object to_plugin.
- Mode "reset" is used when you want to set no data. The event comes to Render_Form. An object is created and sent to
  View. View update the DOM with the data.
- Mode "click" send the event message to Render_Form that then send the message to to_plugin.

```
"my_event_button": {
    "type": "form",
    "subtype": "button",
    "to_plugin": "infohub_myplugin",
    "button_label": "Start",
    "mode": "click",
    "data": "start"
}

"my_submit_button": {
    "type": "form",
    "subtype": "button",
    "to_plugin": "infohub_myplugin",
    "button_label": "Submit",
    "mode": "submit",
    "data": "submit",
    "affected_aliases": "firstname,lastname,email"
}
```

# text

The text form element is used to write text. You can set a maxlength. There are several subtype of the text element.
They all use 'value'=data, max, min.  
It is up to you to handle the properties found
here: <a href="https://www.w3schools.com/html/html_form_input_types.asp" target="_blank">w3schools form input types</a>
.  
Input types: text, color, date, datetime-local, email, month, number, range, search, tel, time, url, week  
The common properties described earlier are of course there. In addition to those there are some text-specific
properties.

- maxlength - Specifies the maximum number of character for an input field
- min - Specifies the minimum value for an input field
- step - Specifies the legal number intervals for an input field
- max - Specifies the maximum value for an input field
- pattern - Specifies a regular expression to check the input value against
- value - Specifies the default value for an input field
- input_type - Input type

The default is to omit the property and not render a property if it contains no value.

```
"my_textbox": {
    "type": "form",
    "subtype": "text",
    "input_type": "text"
}
```

## events

If maxlength is used then .information should show chars count/max.  
If input_type = range, then the value should be shown in .information.

# textarea

Purpose of the textarea is to edit larger texts. It is rendered slightly different from a text box.  
The textarea have the common properties and in addition:

- maxlength - (number) Specifies the maximum number of characters allowed in the text area
- placeholder - Specifies a short hint that describes the expected value of a text area

There is an area between the textarea and the decsription called 'info'. It is used for statistics.

Characters xxx / maxlength (infinite), Words xxx, Lines xxx

The change event send a message to Render_Form with the data. Render_Form produce the information and ask View to put it
in DOM.

# checkbox

The checkbox show boolean values. You send "true" as data in set_data, and the checkbox show a check mark.  
It has no special attributes. The label is rendered to the right of the checkbox.

```
"my_checkbox": {
    "plugin": "infohub_render_form",
    "type": "checkbox",
    "label": "My label",
    "value": "my_value",
    "group_name": "my_values"
}
```

# file

With the file selector you can select a file from your hard drive and it gets accessible from Javascript. This is useful
if you as an end user want to use images, film clips, data files in infohub.  
It has no special attributes. The data is base64 encoded.

```
"my_list": {
    "plugin": "infohub_render_form",
    "type": "file"
}
```

# select

The select is a list with values. In addition to the common properties it also has:

- size - (number) number of lines to show
- multiple - (true/false) If you want to select multiple rows
- options - Array with objects that has 'value', 'label', 'type'

If you want a dropdown then do not set size and multiple.  
If you want a list then set size.  
If you want a multi select list then set size and multiple.  
You use set_data to set 'selected_value'. It is a comma separated string with 'value' to be set.

## options

Array with objects that has 'value', 'label', 'type'. The type can be 'option' (default) or 'optgroup' or '/optgroup'.

```
'my_select': {
    'type': 'form',
    'subtype': 'select',
    'alias': 'my_select',
    "size": "10",
    "multiple": "true",
    "options": [
        { "type": "optgroup", "label": "Bread" },
        { "type": "option", "value": "bread_normal", "label": "Normal bread" },
        { "type": "option", "value": "bread_full", "label": "Fiber bread" },
        { "type": "/optgroup" },
        { "type": "optgroup", "label": "Burger" },
        { "type": "option", "value": "green_burger", "label": "Green burger" },
        { "type": "option", "value": "boar_burger", "label": "Boar burger" },
        { "type": "/optgroup" },
        { "type": "optgroup", "label": "Extras" },
        { "type": "option", "value": "cheese", "label": "Cheese" },
        { "type": "option", "value": "salad", "label": "Salad" },
        { "type": "option", "value": "mustard", "label": "Mustard" },
        { "type": "option", "value": "union", "label": "Union" },
        { "type": "/optgroup" }
    ]
}
```

## custom_variables

The variables with values you add here will be added to the rendered select box and follow when you read the form.  
You can see an example on this in infohub_tools - checksum, where the node select box have custom_variables so it knows
what other select boxes to update.  
For now only select have custom_variables, but other form elements might get that in the future.

# datalist

This is a text input but with option values that you can use if you want to.

## options

Array with objects that has 'value'.

```
"my_datalist": {
    "plugin": "infohub_render_form",
    "type": "datalist",
    "options": [
        { "value": "Adidas" },
        { "value": "Nike" },
        { "value": "Saucony" },
        { "value": "Puma" },
        { "value": "Hoka" }
    ]
}
```

# radiobutton

The radio button element has several options. You use set_data to set 'selected_value'.

## options

Array with objects that has 'value', 'label'.

```
"my_radio_group": {
    'type': 'form',
    'subtype': 'radios',
    'group_name': 'bread',
    "options": [
        { "group_name": "bread", "value": "bread_normal", "label": "Normal bread" },
        { "group_name": "bread", "value": "bread_full", "label": "Fiber bread" }
    ]
}
```

# License

This documentation is copyright (C) 2018 Peter Lembke.  
Permission is granted to copy, distribute and/or modify this document under the terms of the GNU Free Documentation
License, Version 1.3 or any later version published by the Free Software Foundation; with no Invariant Sections, no
Front-Cover Texts, and no Back-Cover Texts.  
You should have received a copy of the GNU Free Documentation License along with this documentation. If not,
see [https://www.gnu.org/licenses/](https://www.gnu.org/licenses/). SPDX-License-Identifier: GFDL-1.3-or-later

Since 2018-05-26 by Peter Lembke  
Updated 2018-05-26 by Peter Lembke  
