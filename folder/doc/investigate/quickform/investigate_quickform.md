# Investigate - Quickform

A form with text boxes and checkboxes that can be created quickly from a simple key value object.
The key become the label.

## Useful

When displaying properties for an object. Different objects have different properties.

## Advanced renderer

This can be added to the existing infohub_renderform

## How it works

Render the quickform.

Function that take an id and a key value object.
The new items are rendered, overwriting the content of the form.
The data is populated in the form elements.

Read the form as usual with form_read.
Or use the read function that first call form_read and then use the convert function to restore the original key-value object.

## Key value object

In the key value object the value can be a text string, a number, a boolean.
Display textbox for text strings and numbers.
Display a checkbox for booleans.
Display a colour picker for strings that start with #
Display a date picker for strings that start with year-

## Implementation

This can not be done in the lab area.
Create the plugin and add make it work.

# License
This documentation is copyright (C) 2022 Peter Lembke.  
Permission is granted to copy, distribute and/or modify this document under the terms of the GNU Free Documentation License, Version 1.3 or any later version published by the Free Software Foundation; with no Invariant Sections, no Front-Cover Texts, and no Back-Cover Texts.  
You should have received a copy of the GNU Free Documentation License along with this documentation. If not, see [https://www.gnu.org/licenses/](https://www.gnu.org/licenses/).  SPDX-License-Identifier: GFDL-1.3-or-later

Created 2022-04-14 by Peter Lembke  
Updated 2022-04-15 by Peter Lembke  
