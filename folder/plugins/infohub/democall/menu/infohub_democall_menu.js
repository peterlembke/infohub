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
function infohub_democall_menu() {

// include "infohub_base.js"

    /*jshint evil:true */
    /*jshint devel:true */
    /*jslint browser: true, evil: true, plusplus: true, todo: true */

    const _Version = function() {
        return {
            'date': '2018-05-19',
            'version': '2.0.0',
            'checksum': '{{checksum}}',
            'class_name': 'infohub_democall_menu',
            'note': 'Render a menu for infohub_democall',
            'status': 'normal',
            'license_name': 'GNU GPL 3 or later'
        };
    };

    const _GetCmdFunctions = function() {
        return {
            'create': 'normal'
        };
    };

    /**
     * Internal functions must start with a capital letter
     * Used by renderers to get a proper function name
     * @version 2016-10-16
     * @since   2016-10-16
     * @author  Peter Lembke
     * @param $text
     * @return string
     */
    const _GetFuncName = function($text)
    {
        "use strict";

        let $response = '';
        let $parts = $text.split('_');
        for (let $key in $parts) {
            if ($parts.hasOwnProperty($key) === false) {
                continue;
            }
            $response = $response + $parts[$key].charAt(0).toUpperCase() + $parts[$key].substr(1);
        }
        return $response;
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
        if (typeof $classTranslations !== 'object') { return $string; }
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
        "use strict";

        const $default = {
            'subtype': 'menu',
            'parent_box_id': '',
            'translations': {}
        };
        $in = _Default($default, $in);

        $classTranslations = $in.translations;

        $in.func = _GetFuncName($in.subtype);
        const $response = internal_Cmd($in);

        return {
            'answer': $response.answer,
            'message': $response.message,
            'data': $response.data
        };
    };

    /**
     * Gives you a menu where you can click on a row to see a demo
     * @param $in
     * @returns {*}
     */
    $functions.push("internal_Menu");
    const internal_Menu = function ($in)
    {
        "use strict";

        const $default = {
            'subtype': 'menu',
            'parent_box_id': ''
        };
        $in = _Default($default, $in);

        const $data = {
            'to': {
                'node': 'client',
                'plugin': 'infohub_render',
                'function': 'create'
            },
            'data': {
                'what': {
                    'titel': {
                        'type': 'common',
                        'subtype': 'value',
                        'data': _Translate('Demo Call')
                    },
                    'ingress': {
                        'type': 'common',
                        'subtype': 'value',
                        'data': _Translate('[i]Here you can explore what happens if you call a plugin that is missing, or a missing function.[/i]')
                    },
                    'my_menu': {
                        'plugin': 'infohub_rendermenu',
                        'type': 'menu',
                        'head_label': '[titel]',
                        'head_text': '[ingress]',
                        'options': {
                            'client_correct': {
                                'alias': 'client_correct_link',
                                'event_data': 'client_correct',
                                'button_label': _Translate('Client - Correct call. Plugin and function exist'),
                                'to_plugin': 'infohub_democall'
                            },
                            'client_missing_cmd_function': { // Fail
                                'alias': 'client_missing_cmd_function_link',
                                'event_data': 'client_missing_cmd_function',
                                'button_label': _Translate('Client - Plugin exist, cmd function do not exist'),
                                'to_plugin': 'infohub_democall'
                            },
                            'client_missing_plugin': { // Fail
                                'alias': 'client_missing_plugin_link',
                                'event_data': 'client_missing_plugin',
                                'button_label': _Translate('Client - Plugin is missing'),
                                'to_plugin': 'infohub_democall'
                            },
                            'server_correct': {
                                'alias': 'server_correct_link',
                                'event_data': 'server_correct',
                                'button_label': _Translate('Server - Correct call. Plugin and function exist'),
                                'to_plugin': 'infohub_democall'
                            },
                            'server_missing_cmd_function': { // Fail
                                'alias': 'server_missing_cmd_function_link',
                                'event_data': 'server_missing_cmd_function',
                                'button_label': _Translate('Server - Plugin exist, cmd function do not exist'),
                                'to_plugin': 'infohub_democall'
                            },
                            'server_missing_plugin': { // Fail
                                'alias': 'server_missing_plugin_link',
                                'event_data': 'server_missing_plugin',
                                'button_label': _Translate('Server - Plugin is missing'),
                                'to_plugin': 'infohub_democall'
                            },
                            'client_child_valid': { // Would be OK with the new rules
                                'alias': 'client_child_to_level1_link',
                                'event_data': 'client_child_valid',
                                'button_label': _Translate('Client - Child talk to valid responders'),
                                'to_plugin': 'infohub_democall'
                            },
                            'client_invalid_call_to_sibling_grandchild': {
                                'alias': 'client_invalid_call_to_sibling_grandchild_link',
                                'event_data': 'client_invalid_call_to_sibling_grandchild',
                                'button_label': _Translate('Client - Invalid call to sibling child'),
                                'to_plugin': 'infohub_democall'
                            },
                            'client_invalid_call_from_child_to_parent': {
                                'alias': 'client_invalid_call_from_child_to_parent',
                                'event_data': 'client_invalid_call_from_child_to_parent',
                                'button_label': _Translate('Client - Invalid call from child to parent'),
                                'to_plugin': 'infohub_democall'
                            },
                            'server_run_all_tests': {
                                'alias': 'server_run_all_tests_link',
                                'event_data': 'server_run_all_tests',
                                'button_label': _Translate('Server - Run all server tests'),
                                'to_plugin': 'infohub_democall'
                            }
                        }
                    }
                },
                'how': {
                    'mode': 'one box',
                    'text': '[my_menu]'
                },
                'where': {
                    'box_id': $in.parent_box_id + '.menu',
                    'max_width': 640
                }
            },
            'data_back': {'step': 'step_end'}
        };

        return {
            'answer': 'true',
            'message': 'Here are the render data that will create a menu',
            'data': $data
        };
    };
}
//# sourceURL=infohub_democall_menu.js