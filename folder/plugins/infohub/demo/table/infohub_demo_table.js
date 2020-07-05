/*
 Copyright (C) 2010- Peter Lembke, CharZam soft
 the program is distributed under the terms of the GNU General Public License

 InfoHub is free software: you can redistribute it and/or modify
 it under the terms of the GNU General Public License as published by
 the Free Software Foundation, either version 3 of the License, or
 (at your option) any later version.

 InfoHub is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 GNU General Public License for more details.

 You should have received a copy of the GNU General Public License
 along with InfoHub.  If not, see <https://www.gnu.org/licenses/>.'
 */
function infohub_demo_table() {

    "use strict";

// include "infohub_base.js"

    const _Version = function () {
        return {
            'date': '2019-12-31',
            'since': '2019-12-31',
            'version': '1.0.0',
            'checksum': '{{checksum}}',
            'class_name': 'infohub_demo_table',
            'note': 'Render a table demo for infohub_demo',
            'status': 'normal',
            'SPDX-License-Identifier': 'GPL-3.0-or-later'
        };
    };

    const _GetCmdFunctions = function () {
        return {
            'create': 'normal',
            'click_row': 'normal'
        };
    };

    let $classTranslations = {};

    /**
     * Translate - Substitute a string for another string using a class local object
     * @param {type} $string
     * @returns string
     */
    $functions.push('_Translate');
    const _Translate = function ($string)
    {
        if (typeof $classTranslations !== 'object') {
            return $string;
        }

        return _GetData({
            'name': _GetClassName() + '|' + $string,
            'default': $string, 'data': $classTranslations, 'split': '|'
        });
    };

    // ***********************************************************
    // * your class functions below, only declare with var
    // * Can only be reached trough cmd()
    // ***********************************************************

    /**
     * Get instructions and create the message to InfoHub View
     * @version 2016-10-16
     * @since   2016-10-16
     * @author  Peter Lembke
     */
    $functions.push('create');
    const create = function ($in)
    {
        const $default = {
            'parent_box_id': '',
            'translations': {},
            'step': 'step_start',
            'response': {
                'answer': 'false',
                'message': 'Nothing to report from infohub_demo_table'
            }
        };
        $in = _Default($default, $in);

        if ($in.step === 'step_start')
        {
            $classTranslations = $in.translations;

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
                            'id_field_name': 'hub_id', // Name of the field that has the ID number
                            'to_node': 'client',
                            'to_plugin': 'infohub_demo',
                            'to_function': 'click',
                            'event_data': 'table|row', // infohub_demo parse this and call infohub_demo_table -> click_row
                            'height': 120,
                            'definition': {
                                'hub_id': {
                                    'name': 'hub_id',
                                    'label': _Translate('Id'),
                                    'default': '',
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
                                {'hub_id': '1578031402.443:588342714995535' , 'name': 'Ab', 'year': '2000', 'score': 10, 'email': 'ab@email.com'},
                                {'hub_id': '1578031501.037:8282858282167634', 'name': 'Ba', 'year': '1999', 'score': -5, 'email': 'ba@email.com'},
                                {'hub_id': '1578031519.928:5102017188330457', 'name': 'Ce', 'year': '1997', 'score': 3, 'email': 'ce@email.com'},
                                {'hub_id': '1578031537.655:80290150987442', 'name': 'Du', 'year': '2005', 'score': 7, 'email': 'du@email.com', 'image': '[svg_example]'},
                                {'hub_id': '1578031557.069:9570541949382424', 'name': 'Fe', 'year': '1997', 'score': -8, 'email': 'fe@email.com'},
                                {'hub_id': '1578031571.334:12142242923887636', 'name': 'Go', 'year': '1997', 'score': 3, 'email': 'go@email.com'}
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
                    },
                    'cache_key': 'table'
                },
                'data_back': {'step': 'step_end'}
            });
        }

        return {
            'answer': $in.response.answer,
            'message': $in.response.message
        };
    };

    /**
     * You come here when you click one row in this demo
     * @param $in
     */
    $functions.push('click_row');
    const click_row = function ($in)
    {
        window.alert(_Translate('Clicked row with ID:') + ' ' + $in.event_data);

        return {
            'answer': 'true',
            'message': 'The row was clicked'
        };
    };
}
//# sourceURL=infohub_demo_table.js