/**
 * Render a table demo for infohub_demo
 *
 * @author      Peter Lembke <info@infohub.se>
 * @version     2019-12-31
 * @since       2019-12-31
 * @copyright   Copyright (c) 2019, Peter Lembke
 * @license     https://opensource.org/licenses/gpl-license.php GPL-3.0-or-later
 * @see         https://github.com/peterlembke/infohub/blob/master/folder/plugins/infohub/demo/table/infohub_demo_table.md Documentation
 * @link        https://infohub.se/ InfoHub main page
 */
function infohub_demo_table() {

    "use strict";

// include "infohub_base.js"

    $functions.push('_Version');
    /**
     * Version information, used by the version function
     * @returns {{date: string, note: string, 'SPDX-License-Identifier': string, checksum: string, version: string, class_name: string, since: string, status: string}}
     * @private
     */
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

    $functions.push('_GetCmdFunctions');
    /**
     * List with all public functions you can call
     * @returns {*}
     * @private
     */
    const _GetCmdFunctions = function () {
        const $list = {
            'create': 'normal',
            'click_row': 'normal'
        };

        return _GetCmdFunctionsBase($list);
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
        const $default = {
            'event_data': '',
            'step': 'step_start'
        }
        $in = _Default($default, $in);

        let $messageArray = [];

        if ($in.step === 'step_start') {
            const $text = _Translate('Clicked row with ID:') + ' ' + $in.event_data;
            const $messageOut = _Alert($text);
            $messageArray.push($messageOut);
        }

        return {
            'answer': 'true',
            'message': 'The row was clicked',
            'messages': $messageArray
        };
    };
}
//# sourceURL=infohub_demo_table.js