# InfoHub Render Table

You can render a table with columns and rows.

## Demo

You can see a [demo](plugin,infohub_demo_table).

## Usage

```
return _SubCall({
    'to': {
        'node': 'client',
        'plugin': 'infohub_render',
        'function': 'create'
    },
    'data': {
        'what': {
            'my_table': {
                'type': 'table',
                'id_field_name': 'id', // Name of the field that has the ID number
                'to_node': 'client',
                'to_plugin': 'infohub_demo',
                'to_function': 'click',
                'event_data': 'table|row', // infohub_demo parse this and call infohub_demo_table -> click_row
                'definition': {
                    'id': {
                        'name': 'id',
                        'label': _Translate('Id'),
                        'default': 0,
                        'class': 'right',
                        'show': 'false'
                    },
                    'view': {
                        'name': 'view',
                        'label': _Translate('View'),
                        'view_button': 'true'
                    },
                    'name': {
                        'name': 'name',
                        'label': _Translate('Name'),
                        'default': '',
                        'min_width': 120
                    },
                    'year': {
                        'name': 'year',
                        'label': _Translate('Year'),
                        'default': '',
                        'class': 'right',
                        'min_width': 120
                    },
                    'score': {
                        'name': 'score',
                        'label': _Translate('Score'),
                        'default': 0,
                        'mark_negative': 'true',
                        'class': 'right',
                        'min_width': 120
                    },
                    'email': {
                        'name': 'email',
                        'label': _Translate('E-mail'),
                        'default': '',
                        'min_width': 120,
                        'max-width': 180
                    },
                    'image': {
                        'name': 'image',
                        'label': _Translate('Image'),
                        'default': '',
                        'min_width': 50,
                        'max-width': 80
                    },
                }, // Define each column here
                'data': [
                    {'id': 1, 'name': 'Ab', 'year': '2000', 'score': 10, 'email': 'ab@email.com'},
                    {'id': 2, 'name': 'Ba', 'year': '1999', 'score': -5, 'email': 'ba@email.com'},
                    {'id': 3, 'name': 'Ce', 'year': '1997', 'score': 3, 'email': 'ce@email.com'},
                    {'id': 4, 'name': 'Du', 'year': '2005', 'score': 7, 'email': 'du@email.com', 'image': '[svg_example]'},
                    {'id': 5, 'name': 'Fe', 'year': '1997', 'score': -8, 'email': 'fe@email.com'},
                    {'id': 6, 'name': 'Go', 'year': '1997', 'score': 3, 'email': 'go@email.com'}
                ] // The rows with data that will be in the table
            },
            'svg_example': {
                'type': 'common',
                'subtype': 'svg',
                'data': '[svg_example_asset]'
            },
            'svg_example_asset': {
                'plugin': 'infohub_asset',
                'type': 'icon',
                'subtype': 'svg',
                'asset_name': 'common/duckduckgo-v107',
                'plugin_name': 'infohub_demo'
            },
            'a_legend': {
                'type': 'common',
                'subtype': 'legend',
                'alias': 'a_legend',
                'label': _Translate('This is a legend'),
                'data': '[my_table]',
                'class': 'fieldset'
            }
        },
        'how': {
            'mode': 'one box',
            'text': '[a_legend]'
        },
        'where': {
            'box_id': $in.parent_box_id + '.demo',
            'max_width': 100, // means 100% so that the columns show properly
            'scroll_to_box_id': 'true'
        }
    },
    'data_back': {'step': 'step_end'}
});
```

## Definition

Give a definition for each column how it should appear.

* name - The HTML name of the element
* label - Displayed in the column header
* class - optional left, right, center. default is left
* min width - optional minimum width in px.
* max width - optional maximum width in px.
* default - Default value to use in a _Default
* show - Show this column. default is "true"
* view_button - render a view button instead of the value. Default is "false".

## Data

And also provide the data to show. The table will be rendered with all data. It will not be updated in any way. Each
time anything should be changed then the table must be rendered in full. That is the fastest way to just insert a pre-built HTML.

## Rendered table

Renders the header `<thead>`, `<tbody>` and an
empty [`<tfoot>`](https://www.w3schools.com/jsref/tryit.asp?filename=tryjsref_table_tfoot).

The head contain all column titles. The body has all rows. HTML makes it possible to have more than one body. I render
only one . The foot is empty. No rows.

The data in "definition" has the default values for each row. All data are validated.

# Todo

* Side scroll if too wide
* Set max height on the table body
* up/down scroll if table body is too high

# License

This documentation is copyright (C) 2019 Peter Lembke.  
Permission is granted to copy, distribute and/or modify this document under the terms of the GNU Free Documentation
License, Version 1.3 or any later version published by the Free Software Foundation; with no Invariant Sections, no
Front-Cover Texts, and no Back-Cover Texts.  
You should have received a copy of the GNU Free Documentation License along with this documentation. If not,
see [https://www.gnu.org/licenses/](https://www.gnu.org/licenses/). SPDX-License-Identifier: GFDL-1.3-or-later

Created 2019-12-28 by Peter Lembke  
Updated 2020-01-01 by Peter Lembke  
