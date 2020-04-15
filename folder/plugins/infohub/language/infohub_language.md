# Infohub Language
Plugin that can give your select box a list of languages.
You can get all language names or just the main language group names.  

# As option source
You can use this plugin as option source to a select list. It can look like this:

Example:
```
'select_language_code': {
    'plugin': 'infohub_renderform',
    'type': 'select',
    "label": $in.label,
    "description": $in.description,
    "size": "6",
    "multiple": "false",
    "options": [],
    'source_node': 'client',
    'source_plugin': 'infohub_language',
    'source_function': $sourceFunction,
    'css_data': {
        '.select': 'max-width: 200px;'
    }
}
```

# As component
This plugin is also a renderer. It will render a select box.

Example:
```
```
  
# License
This documentation is copyright (C) 2019 Peter Lembke.  
Permission is granted to copy, distribute and/or modify this document under the terms of the GNU Free Documentation License, Version 1.3 or any later version published by the Free Software Foundation; with no Invariant Sections, no Front-Cover Texts, and no Back-Cover Texts.  
You should have received a copy of the GNU Free Documentation License along with this documentation. If not, see [https://www.gnu.org/licenses/](https://www.gnu.org/licenses/).  SPDX-License-Identifier: GFDL-1.3-or-later  

Since 2019-09-29 by Peter Lembke  
Updated 2019-09-29 by Peter Lembke  
