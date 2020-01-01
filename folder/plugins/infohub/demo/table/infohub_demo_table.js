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

// include "infohub_base.js"

    // ***********************************************************
    // * jshint.com options to suppress some warnings
    // ***********************************************************

    /*jshint evil:true */
    /*jshint devel:true */
    /*jslint browser: true, evil: true, plusplus: true, todo: true */

    // ***********************************************************
    // * your private class variables below, only declare with var
    // ***********************************************************

    var _Version = function () {
        return {
            'date': '2019-12-31',
            'since': '2019-12-31',
            'version': '1.0.0',
            'checksum': '{{checksum}}',
            'class_name': 'infohub_demo_table',
            'note': 'Render a table demo for infohub_demo',
            'status': 'normal',
            'license_name': 'GNU GPL 3 or later'
        };
    };

    var _GetCmdFunctions = function () {
        return {
            'create': 'normal',
            'click_row': 'normal'
        };
    };

    var $classTranslations = {};

    /**
     * Translate - Substitute a string for another string using a class local object
     * @param {type} $string
     * @returns string
     */
    $functions.push('_Translate');
    var _Translate = function ($string) {
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
    var create = function ($in) {
        "use strict";

        var $default = {
            'parent_box_id': '',
            'translations': {},
            'step': 'step_start',
            'response': {
                'answer': 'false',
                'message': 'Nothing to report from infohub_demo_table'
            }
        };
        $in = _Default($default, $in);

        if ($in.step === 'step_start') {
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
                            'id_field_name': 'id', // Name of the field that has the ID number
                            'to_node': 'client',
                            'to_plugin': 'infohub_demo',
                            'to_function': 'click',
                            'event_data': 'table|row', // infohub_demo parse this and call infohub_demo_table -> click_row
                            'height': 120,
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
        }

        return {
            'answer': $in.response.answer,
            'message': $in.response.message
        };
    };

    $functions.push('click_row');
    /**
     * You come here when you click one row in this demo
     * @param $in
     */
    var click_row = function ($in)
    {
        "use strict";
        window.alert('Clicked row with ID: ' + $in.event_data);

        return {
            'answer': 'true',
            'message': 'The row was clicked'
        };
    };

}
//# sourceURL=infohub_demo_table.js