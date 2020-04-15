# Infohub Validate
Used for validating a value and return true or false.  

# Introduction
Validators are mainly used in form data to quickly determine if an input is valid or not. The user of the form will be noted while they type.  
This usage makes it important that the validator is small quick and effective so it can be run many times without the user noticing any lag.  

# Usage in forms
You provide a validator_plugin and a validator_function. For speed purposes it is a must that we keep the traffic within the node so validator_node can not be set, it is assumed it is the client node.  

```
    'my_textbox_min': {
        'type': 'form',
        'subtype': 'text',
        'input_type': 'text',
        'placeholder': 'Set your minimum integer number',
        'class': 'text',
        'value': '1',
        'css_data': {},
        'validator_plugin': 'infohub_render',
        'validator_function': 'validate_is_integer'
    },
```

This text box will validate the input data to digits only. Your field will get a green frame when you enter only digits.  

# infohub_validate
I have moved the functions from infohub_render to infohub_validate. You can now find these validators:  

```
    'validate_has_data': 'normal',
    'validate_is_true': 'normal',
    'validate_is_false': 'normal',
    'validate_is_integer': 'normal'
```

# Usage in infohub
Infohub Tool - Random, have two input boxes, both have validators.  

# License
This documentation is copyright (C) 2018 Peter Lembke.  
Permission is granted to copy, distribute and/or modify this document under the terms of the GNU Free Documentation License, Version 1.3 or any later version published by the Free Software Foundation; with no Invariant Sections, no Front-Cover Texts, and no Back-Cover Texts.  
You should have received a copy of the GNU Free Documentation License along with this documentation. If not, see [https://www.gnu.org/licenses/](https://www.gnu.org/licenses/).  SPDX-License-Identifier: GFDL-1.3-or-later  

Created 2018-08-13 by Peter Lembke  
Updated 2018-08-13 by Peter Lembke  
