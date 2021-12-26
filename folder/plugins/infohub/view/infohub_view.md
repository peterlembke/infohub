# Infohub View

Manages display areas (boxes) on the screen

# Introduction

You start with one box "main". A box can contain data OR boxes. You set that with box_mode.  
The boxes are created as DIV tags in HTML and are styled with some simple CSS. The boxes are for dynamic structure only.

Boxes that will contain data can have a max_width set if you want to. It is 0=no width set , 100=100%, all other widths
are rounded down to the closest division of 160px. Meaning that you can have 160px, 320px, 480px, 640px and so on.

# Boxes in boxes

Let's divide the main box into two data boxes under each other. First change mode on main to "under", then add two boxes
with main as parent. The boxes are in mode "data" and can now be used to show rendered data. In the sections below you
can read more in detail how you do this.

You can now create your own box structure and hide parts of the structure.

# How to reference boxes

In many of the functions you are supposed to give a box ID. You probably do not have that information. Instead, you can
give a relative path as the box_id.

- If the id is just a number then it is used.
- If the box_id contain a dot then we explode the string and treat each part as an alias.

Here are some examples:

```
main.body.infohub_doc.doc
1204.doc (This is a mix of id and aliases)
1204.parent.parent.body.doc (Use of parent as a way to get the parent box)
main.body.infohub_launcher.my_list.[my_list_box_content] (This example give 12011_my_list_box_content)
```

You see that you can use parent as an alias for the parent box. You can use [ and ] to add some string to the end of the
id.  
All functions in Infohub View that need to handle IDs call the parser and get the calculated ID.

## Use of Workbench

If you use the Workbench to show boxes then the path to your plugin is main.body.your_plugin

# CMD functions

Infohub View have a lot of functions. All functions that need to manipulate the DOM must be here.

# init

Sets the View CSS. Used by Infohub_Workbench in its startup function.

# get_box_id

You can reference all boxes with their absolute path like this: 'main.body.infohub_doc.index'. That will give you the
box_id for that specific box.  
When ever you are supposed to give a box_id you can instead give an absolute path, each CMD function use the direct
function _GetBoxId to get the real box_id.

# Example

```
return _SubCall({
    'to': {
        'node': 'client',
        'plugin': 'infohub_view',
        'function': 'get_box_id'
    },
    'data': {
        'box_id': 'main.body.infohub_doc.index'
    },
    'data_back': {
        'step': 'step_next_step'
    }
});
```

# scroll_to_box_id

Give a box_id and the screen will scroll so that the box upper edge will be at the top of the viewport. If the page is
not long enough then it scrolls as far as it can.

```
return _SubCall({
    'to': {
        'node': 'client',
        'plugin': 'infohub_view',
        'function': 'scroll_to_box_id'
    },
    'data': {
        'box_id': $in.box_id
    },
    'data_back': {
        'step': 'step_end'
    }
});
```

You can also add a command in your rendering data so that it scrolls when the rendering is done.

```
        'where': {
            'box_id': 'main.body.infohub_launcher.information',
            'max_width': 320,
            'scroll_to_box_id': 'true'
        },
```

# scroll_to_bottom_box_id

Give a box_id and the screen will scroll so that the box lower edge will be at the bottom of the viewport. If the page
is not long enough then it scrolls as far as it can.

Reason I created this function was that iPhone SE 2016 has a small screen and when I clicked on an icon in Launcher I
did not see the Run button. (Task HUB-1020).

```
return _SubCall({
    'to': {
        'node': 'client',
        'plugin': 'infohub_view',
        'function': 'scroll_to_bottom_box_id'
    },
    'data': {
        'box_id': $in.box_id
    },
    'data_back': {
        'step': 'step_end'
    }
});
```

You can also add a command in your rendering data so that it scrolls when the rendering is done.

```
        'where': {
            'box_id': 'main.body.infohub_launcher.information',
            'max_width': 320,
            'scroll_to_bottom_box_id': 'true'
        },
```

You can see an example of this in infohub_launcher.js when the plugin_information is rendered.

# box_mode

By changing box_mode on a box means that the children will get that class name.

Changes the div “box_mode”. You can change to “data”, “side”, “under”. You can only switch to a different mode than the
current mode. When you switch mode then the box are cleared.

- data - the box will now contain data.
- side - the box will contain boxes that will be ordered side by side.
- under - the box will contain boxes that will be ordered under each other.  
  In mode "side" and "under" there will be an auto created hidden end-box that will always be at the end of the boxes
  you create in a box. You can see it if you inspect the html

## box mode css

In infohub_view.css you find four classes:

- data - Rarely used since you almost always have a parent with box_mode = side or under.
- side - This box will be side by side with the siblings
- under - This box will be under the siblings
- end - Used by the last box in a series of boxes. Hidden and does not contain anything.

A box will always have the class set to the same name as parent box_mode. If the parent box has box_mode = "under" then
all its children have class="under". If the parent box has box_mode = "side" then all its children have class="side".

# Example

Uses box_mode to empty box with id "main.body.infohub_doc.index" and change its mode to "side", preparing it for
containing up to 99 boxes. The digits tell how many boxes that can be created. 1=9, 2=99, 3=999

```
return _SubCall({
    'to': {
        'node': 'client',
        'plugin': 'infohub_view',
        'function': 'box_mode'
    },
    'data': {
        'box_id': 'main.body.infohub_doc.index',
        'box_mode': 'side',
        'digits': 2
    },
    'data_back': {
        'step': 'step_next_step'
    }
});
```

# box_delete

You can delete a box if it is not an “end”-box.

# Example

Delete the box "body"

```
return _SubCall({
    'to': {
        'node': 'client',
        'plugin': 'infohub_view',
        'function': 'box_delete'
    },
    'data': {
        'box_id': 'main.body.infohub_doc.index',
    },
    'data_back': {
        'step': 'step_next_step'
    }
});
```

# box_clear

Clear the contents of a data box. Removes all child boxes except the end-box in side/under-boxes.  
You can reference the box by its box_id or its box_alias. If you provide an alias then "box_find" will be run to find
the box_id.  
If you clear a "data"-box then it is just cleared, and we are done.  
If you clear a "side"-, or "under"-box then all boxes in that box are deleted except the "end"-box.

# Example

Uses box_clear to empty the box with alias "main.body.infohub_doc.index"

```
return _SubCall({
    'to': {
        'node': 'client',
        'plugin': 'infohub_view',
        'function': 'box_clear'
    },
    'data': {
        'box_id': 'main.body.infohub_doc.index',
    },
    'data_back': {
        'step': 'step_next_step'
    }
});
```

# box_insert

You can insert a new box before another box. This implies that the parent box is in mode: "side" or "under".

```
return _SubCall({
    'to': {
        'node': 'client',
        'plugin': 'infohub_view',
        'function': 'box_clear'
    },
    'data': {
        'parent_box_id': 'main.body.infohub_doc', // Parent box id.
        'before_box_id': 'main.body.infohub_doc.index', // Where to place your new box (optional)
        'box_position': 'first', // If before_box_id='' then we use box_position to find it.
        'box_mode': 'data',
        'box_data': '', // The data you want in your box
        'box_alias': 'a_new_box', // The alias you want on your new box
        'box_class': 'box', // An extra class to the box, example: box
        'max_width': 0, // The maximum width on a box with mode=data
    },
    'data_back': {
        'step': 'step_next_step'
    }
});
```

View need the parent_box_id.    
View need to know where you want the new box to be inserted in the parent box. You give the before_box_id, or you can
give the box_position. "first" (default), "last", "middle". Even if you select "first" your box will still be before
the "end"-box.  
Now View want to know more about the new box. box_mode, you can read more about box_mode in another section.

- box_data, string with data. Can be used if box_mode = "data", else you ignore this.
- box_alias, the alias of the box. This parameter "box_alias" is set on the box. It is used by box_find to find a box.
  The "name" parameter is also set to this value.
- box_class, A box will have class = its parent box_mode. Box children will have class = its parent box_mode. In
  addition to that, box_class can add an extra class to the box.
- max_width, if the box_mode = "data" then you can set a max-width on the box. A more flexible solution is that you set
  the max-width on your data instead.

# boxes_insert

This is almost the same as box_insert except that it creates a lot of boxes with the same configuration and fill each
box with its own data.  
This is useful if you have an array with data and want each data to be in its own box. For example viewing a list of
thumb images with detailed information.  
Everything is the same as box_insert except "boxes_data" where you have key-value data that will be looped, and each
data will get its own box inserted.

# Example

This example come from infohub_workbench

```
return _SubCall({
    'to': {
        'node': 'client',
        'plugin': 'infohub_view',
        'function': 'boxes_insert'
    },
    'data': {
        'parent_box_id': $in.box_id,
        'box_position': 'last',
        'box_mode': 'data',
        'box_alias': 'alias_not_used',
        'boxes_data': {
            'welcome': 'Welcome text',
            'extra': 'Extra box'
        }
    },
    'data_back': {
        'box_id': $in.box_id,
        'step': 'step_get_icon'
    }
});
```

# function: boxes_insert_detailed

Almost the same as boxes_insert except that you can have full details on each box you insert.

# Example

This example comes from Infohub_Demo

```
return _SubCall({
    'to': {
        'node': 'client',
        'plugin': 'infohub_view',
        'function': 'boxes_insert_detailed'
    },
    'data': {
        'items': [
            {
                'parent_box_id': $in.box_id,
                'box_position': 'last',
                'box_mode': 'data',
                'box_alias': 'menu',
                'max_width': 640,
                'box_data': 'The menu will render here'
            },
            {
                'parent_box_id': $in.box_id,
                'box_position': 'last',
                'box_mode': 'data',
                'box_alias': 'demo',
                'max_width': 100, // 100 will be translated to 100%
                'box_data': 'Use the menu'
            }
        ]
    },
    'data_back': {
        'box_id': $in.box_id,
        'step': 'step_menu'
    }
});
```

# box_view

Show “1” or hide “0” a box and its contents. You can not change the view on an “end”-div. They will remain hidden.

```
return _SubCall({
    'to': {
        'node': 'client',
        'plugin': 'infohub_view',
        'function': 'box_view'
    },
    'data': {
        'box_id': 'main.body.infohub_doc.index',
        'box_view': '1'
    },
    'data_back': {
        'step': 'step_next_step'
    }
});
```

box_id, the ID of the box that you want to show/hide. 1=show, 0=hide.

## siblings_box_view

Here you can set a specific box to show or hide, and in the same call you can set the box siblings to show/hide or
opposite to what you set on the box.

```
const $default = {
    'box_id': '1', // Can be the box_id or the full friendly name box id
    'box_view': '1', // 0 = hide, 1= show
    'siblings_box_view': '' // All the siblings to box_id can be set to 0 or 1 or nothing.
};
```

You give the box_id to a box. the box_view = "1" or "0". And then siblings_box_view = "1" or "0".  
If you leave siblings_box_view empty then it will be the opposite to box_view. box_view "1" becomes siblings_box_view "
0".

## Example

This example come from the tab system. You click on a tab and that tab become visible, the others become hidden.  
The example do not set box_view because it is default to "1". Also, no need to set siblings_box_view because it will
become the opposite to box_view (default).

```
return _SubCall({
    'to': {
        'node': 'client',
        'plugin': 'infohub_view',
        'function': 'siblings_box_view'
    },
    'data': {
        'box_id': $in.box_id
    },
    'data_back': {
        'step': 'step_end'
    }
});
```

# box_list

Gives you an array with all child Ids to the box_id you provide. You will also get the end-box id. You can only get a
list from boxes that have box_mode = “side” or “under”.

```
return _SubCall({
    'to': {
        'node': 'client',
        'plugin': 'infohub_view',
        'function': 'box_list'
    },
    'data': {
        'box_id': 'main.body.infohub_doc.index'
    },
    'data_back': {
        'step': 'step_next_step'
    }
});
```

box_id, the parent box ID. You will get all child box IDs.

# box_data

Store data in a data box. You can only save data in boxes that have `box_mode="data"`.  
It will also substitute all "{box_id}" and "{parent_box_id}" to their correct values.  
And finally it will add an anchor to the box, so it is easier to scroll to the right section.

```
return _SubCall({
    'to': {
        'node': 'client',
        'plugin': 'infohub_view',
        'function': 'box_data'
    },
    'data': {
        'box_id': 'main.body.infohub_doc.index',
        'box_data': 'My {testing} for box_id {box_id} and for parent_box_id {parent_box_id}',
        'variables': {
            'testing': 'test data'
        },
        'mode': 'substitute' // add_first, add_last, substitute (default)
    },
    'data_back': {
        'step': 'step_next_step'
    }
});
```

With 'variables' you can insert more values into the box_data. {my_variable}  
With 'mode' you can 'substitute' (default) the data in the box, or data can be 'add_last' or 'add_first' to create a
form of logging.

# box_copy

Copy content from one box to another. You can only copy data between boxes that have box_mode = “data”.

```
return _SubCall({
    'to': {
        'node': 'client',
        'plugin': 'infohub_view',
        'function': 'box_data'
    },
    'data': {
        'from_box_id': 'main.body.infohub_hello',
        'to_box_id': 'main.body.infohub_world'
    },
    'data_back': {
        'step': 'step_next_step'
    }
});
```

The boxes must already exist, and you must know each box_id.

# modify_class

You can add/remove a class name from an object. You can also use 'switch', if the class exist it will be removed, if
class do not exist it will be added.

## Example

The closest example I could find is in infohub_tabs but that is using a mass_update.  
In the example below the object with id will lose class: 'yes'.

```
return _SubCall({
    'to': {
        'node': 'client',
        'plugin': 'infohub_view',
        'function': 'modify_class'
    },
    'data': {
        'id': 'main.head.infohub_doc',
        'class': 'yes',
        'cmd': 'remove'
    },
    'data_back': {
        'step': 'step_end'
    }
});
```

# set_favicon

Since you can have many domain names and serve totally different content, then it is also important to set the right
favicon for each occasion.

## Example

You can use a service online to convert your PNG image into base64 data. Do not add 'data:image/png;base64,' to the data
because this function do that for you.

```
return _SubCall({
    'to': {
        'node': 'client',
        'plugin': 'infohub_view',
        'function': 'set_favicon'
    },
    'data': {
        'image_data': 'base64 image data of a png 32x32 pixels'
    },
    'data_back': {
        'step': 'step_end'
    }
});
```

You should use infohub_asset instead of adding the BASE64 data directly to the call.

# set_text

Used to set the visible text on for example a button.  
Set value or innerText on an object. Give the id and the text. The function figure out if value or innerText should be
set depending on the object type.  
If the found object is NOT an input object and the type is unknown then innerText is set.  
If the found object is a ['text', 'textarea', 'button', 'submit', 'reset'] then value is set.

## Example

This function will be used more with translations and forms.

```
return _SubCall({
    'to': {
        'node': 'client',
        'plugin': 'infohub_view',
        'function': 'set_text'
    },
    'data': {
        'id': 'main.body.infohub_demo.my_button',
        'text': 'Send the email'
    },
    'data_back': {
        'step': 'step_end'
    }
});
```

# get_text

Get value or innerHTML from an object. This is the opposite to set_text. Returns the text on for example a button.  
Returns the text and also the type if it exists. Only input tags have type.

## Example

```
return _SubCall({
    'to': {
        'node': 'client',
        'plugin': 'infohub_view',
        'function': 'get_text'
    },
    'data': {
        'id': 'main.body.infohub_demo.my_button',
    },
    'data_back': {
        'step': 'step_end'
    }
});
```

# zoom_level

Sets the zoom level on everything. The built-in zoom in the browser is preferred but on tablets and phones you can not
press CTRL + and CTRL -, there it is better to have on screen buttons.  
You can set a zoom level, or you can increase/decrease the zoom level.

## Example

This snippet comes from infohub_configlocal_zoom. It displays buttons that send the custom_variables to infohub_view.

```
'button_text_smaller': {
    'type': 'form',
    'subtype': 'button',
    'mode': 'button',
    'button_label': 'Make things smaller',
    'data': 'zoom_level',
    'to_plugin': 'infohub_render',
    'to_function': 'click_and_scroll',
    'custom_variables': {
        'final_plugin': 'infohub_view',
        'final_function': 'zoom_level',
        'multiplier': '0.8'
    }
},
'button_text_normal': {
    'type': 'form',
    'subtype': 'button',
    'mode': 'button',
    'button_label': 'Normal size (Size 1)',
    'data': 'zoom_level',
    'to_plugin': 'infohub_render',
    'to_function': 'click_and_scroll',
    'custom_variables': {
        'final_plugin': 'infohub_view',
        'final_function': 'zoom_level',
        'zoom_level': '1.0'
    }
},
```

The example show buttons, but you can send the data directly if you want to.

```
return _SubCall({
    'to': {
        'node': 'client',
        'plugin': 'infohub_view',
        'function': 'zoom_level'
    },
    'data': {
        'zoom_level': '1.2',
    },
    'data_back': {
        'step': 'step_end'
    }
});
```

# function: is_visible

Get visible = 'true' or 'false' if object with id is visible.

## Example

```
return _SubCall({
    'to': {
        'node': 'client',
        'plugin': 'infohub_view',
        'function': 'is_visible'
    },
    'data': {
        'id': 'main.body.infohub_demo.my_button'
    },
    'data_back': {
        'step': 'step_end'
    }
});
```

Returns

```
return {
    'answer': 'true',
    'message': $message,
    'id': $in.id,
    'visible': $visible
}
```

# function: set_visible

Sets visibility on any object. If you want to show/hide boxes then use box_view instead. That is better suited for
boxes.  
Use set_visible for things inside boxes. You can set visible true / false / switch. With switch, you switch between
true/false.

## Example

```
return _SubCall({
    'to': {
        'node': 'client',
        'plugin': 'infohub_view',
        'function': 'set_visible'
    },
    'data': {
        'id': 'main.body.infohub_demo.my_button',
        'set_visible': 'switch'
    },
    'data_back': {
        'step': 'step_end'
    }
});
```

# is_enabled

Check if an object is enabled. You get true / false. You have probably seen disabled objects, like buttons that are
visible but grayed out and can not be clicked, they are then disabled.  
You get id and is_enabled = 'true' or 'false'.

## Example

```
return _SubCall({
    'to': {
        'node': 'client',
        'plugin': 'infohub_view',
        'function': 'is_enabled'
    },
    'data': {
        'id': 'main.body.infohub_demo.my_button'
    },
    'data_back': {
        'step': 'step_end'
    }
});
```

# set_enabled

Set if an object should be enabled with 'true' or 'false' or 'switch' between enabled/disabled.

## Example

```
return _SubCall({
    'to': {
        'node': 'client',
        'plugin': 'infohub_view',
        'function': 'set_enabled'
    },
    'data': {
        'id': 'main.body.infohub_demo.my_button',
        'set_enabled': 'true'
    },
    'data_back': {
        'step': 'step_end'
    }
});
```

# toggle

Switch visibility for an object. Use "set_visible" instead if you can. It can do the same thing. Used by
infohub_render_link when creating toggle links.

## Example

No, use set_visible instead.

# mass_update

You can send a lot of commands in one request to View. The function mass_update will use the View internal functions.
That is much quicker than doing a lot of requests to View, and it is also easier to debug if something unexpected
happens.  
In Infohub_Tabs I use mass_update to unselect all tabs except the selected tab that will be marked.  
This is also a way to get access to the internal_ functions of View.

## Example

```
for ($pluginName in $in.response.index)
{
    $doItem = {
        'func': 'ModifyClass',
        'id': $in.response.index[$pluginName],
        'class': 'yes',
        'cmd': 'remove'
    };

    if ($pluginName === $in.plugin_name) {
        $doItem = {
            'func': 'ModifyClass',
            'id': $in.response.index[$pluginName],
            'class': 'yes',
            'cmd': 'add'
        };
    }

    $do.push($doItem);
}

return _SubCall({
    'to': {
        'node': 'client',
        'plugin': 'infohub_view',
        'function': 'mass_update'
    },
    'data': {
        'do': $do
    },
    'data_back': {
        'parent_box_id': $in.parent_box_id,
        'plugin_name': $in.plugin_name,
        'step': 'step_end'
    }
});
```

# id_exist

Check if ID exist in the DOM. Returns exist = 'true' or 'false'.

## Example

```
return _SubCall({
    'to': {
        'node': 'client',
        'plugin': 'infohub_view',
        'function': 'id_exist'
    },
    'data': {
        'id': 'main.head.' + $in.plugin_name
    },
    'data_back': {
        'plugin_name': $in.plugin_name,
        'step': 'step_is_plugin_started_response'
    }
});
```

# mark_object

You can make an object become highlighted, or marked in some way so the user will notice. You give an id to an object,
and mark = 'true' or 'false' or 'switch'.  
One note about checkboxes. Here the parent object will be marked instead.

## Example

This code snippet comes from infohub_render

```
if ($isValid === 'false') {
    return _SubCall({
        'to': {
            'node': 'client',
            'plugin': 'infohub_view',
            'function': 'mark_object'
        },
        'data': {
            'id': $in.validated_item.id,
            'mark': 'true'
        },
        'data_back': _ByVal($in)
    });
}
```

# form_read

Read a form, get data from all form elements. Give an ID to a form, you get form_data back.

## Example

This example come from infohub_render

```
return _SubCall({
    'to': {
        'node': 'client',
        'plugin': 'infohub_view',
        'function': 'form_read'
    },
    'data': {
        'id': $in.box_id
    },
    'data_back': {
        'step': 'step_validate_form_data',
    }
});
```

# form_write

Write data to a form. You can not set data while you render form elements, instead you must use form_write. The reason
is simple, the rendering would be complicated if all the validators had to be triggered during rendering.

## Example

Here is an example from infohub_demo_form2

```
$formData = {
    'my_checkboxes_extras.cheese': {'value': 'true'},
    'my_checkboxes_extras.mustard': {'value': 'true'},
    'my_checkboxes_extras.pickles': {'value': 'true'},
    'my_checkboxes_extras.salad': {'value': 'true'},
    'my_checkboxes_extras.union': {'value': 'true'},
    'my_colour_select': {'value': '#fff600'},
    'my_radios_bread.bread_sesam': {'value': 'true'},
    'my_radios_burger.beetroot_burger': {'value': 'true'},
    'my_range': {'value': '150'},
    'my_select': {'value': ['cutlery_knife', 'cutlery_fork', 'porcelain_plait', 'porcelain_glass', 'fabric_napkin', 'fabric_cloth']},
    'my_textarea': {'value': 'I want to go all in with this dinner. Dion mustard and Romani salad!!'},
    'my_textbox': {'value': 'Dinner burger'},
    'of_age.of_age': {'value': 'false'}
};
return _SubCall({
    'to': {
        'node': 'client',
        'plugin': 'infohub_view',
        'function': 'form_write'
    },
    'data': {
        'id': 'main.body.infohub_demo.demo',
        'form_data': $formData
    },
    'data_back': {
        'step': 'step_end'
    }
});
```

# event_message

The go() function send events further. Some end up in View event_message.

The event_message function handle events where we can have a generic response to the event. For example expanding
embedded data. Toggle visibility.

If you set send = 'true' in your data that trigger the event, then this event will also be forwarded to your plugin.

View event_message are triggered by render_link for toggle links and embedded links.
See [InfoHub Render Link](plugin,infohub_render_link). The toggle link can toggle visibility on two objects at the same
time.

View event_message are triggered by renderadvancedlist.
See [InfoHub Render Advanced List](plugin,infohub_renderadvancedlist)

# License

This documentation is copyright (C) 2017 Peter Lembke.  
Permission is granted to copy, distribute and/or modify this document under the terms of the GNU Free Documentation
License, Version 1.3 or any later version published by the Free Software Foundation; with no Invariant Sections, no
Front-Cover Texts, and no Back-Cover Texts.  
You should have received a copy of the GNU Free Documentation License along with this documentation. If not,
see<a href="https://www.gnu.org/licenses/" target="_blank">https://www.gnu.org/licenses/</a>.

Since 2017-02-04 by Peter Lembke  
Updated 2018-10-13 by Peter Lembke  
