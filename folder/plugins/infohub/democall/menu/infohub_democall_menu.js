/**
 * infohub_democall_menu
 * Render a menu for infohub_democall
 *
 * @package     Infohub
 * @subpackage  infohub_democall_menu
 * @since       
 * @author      Peter Lembke <info@infohub.se>
 * @license     GPL-3.0-or-later
 * @copyright   Copyright (C) 2010- Peter Lembke
 */
function infohub_democall_menu() {

    'use strict';

// include "infohub_base.js"

    const _Version = function() {
        return {
            'date': '2018-05-19',
            'version': '2.0.0',
            'checksum': '{{checksum}}',
            'class_name': 'infohub_democall_menu',
            'note': 'Render a menu for infohub_democall',
            'status': 'normal',
            'SPDX-License-Identifier': 'GPL-3.0-or-later',
        };
    };

    const _GetCmdFunctions = function() {
        const $list = {
            'create': 'normal',
        };

        return _GetCmdFunctionsBase($list);
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
    const _GetFuncName = function($text) {
        let $response = '';
        let $parts = $text.split('_');
        for (let $key in $parts) {
            if ($parts.hasOwnProperty($key) === false) {
                continue;
            }
            $response = $response + $parts[$key].charAt(0).toUpperCase() +
                $parts[$key].substring(1);
        }
        return $response;
    };

    let $classTranslations = {};

    // ***********************************************************
    // * your class functions below, only declare with var
    // * Can only be reached through cmd()
    // ***********************************************************

    /**
     * Get instructions and create the message to InfoHub View
     * @version 2016-10-16
     * @since   2016-10-16
     * @author  Peter Lembke
     */
    $functions.push('create');
    const create = function($in = {}) {
        const $default = {
            'subtype': 'menu',
            'parent_box_id': '',
            'translations': {},
        };
        $in = _Default($default, $in);

        $classTranslations = $in.translations;

        $in.func = _GetFuncName($in.subtype);
        const $response = internal_Cmd($in);

        return {
            'answer': $response.answer,
            'message': $response.message,
            'data': $response.data,
        };
    };

    /**
     * Gives you a menu where you can click on a row to see a demo
     * @param $in
     * @returns {*}
     */
    $functions.push('internal_Menu');
    const internal_Menu = function($in = {}) {
        const $default = {
            'subtype': 'menu',
            'parent_box_id': '',
        };
        $in = _Default($default, $in);

        const $data = {
            'to': {
                'node': 'client',
                'plugin': 'infohub_render',
                'function': 'create',
            },
            'data': {
                'what': {
                    'titel': {
                        'type': 'common',
                        'subtype': 'value',
                        'data': _Translate('DEMO_CALL')
                    },
                    'ingress': {
                        'type': 'common',
                        'subtype': 'value',
                        'data': '[i]' + _Translate('HERE_YOU_CAN_EXPLORE_WHAT_HAPPENS_IF_YOU_CALL_A_PLUGIN_THAT_IS_MISSING,_OR_A_MISSING_FUNCTION') + '.[/i]'
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
                                'button_label': _Translate('CLIENT_-_CORRECT_CALL._PLUGIN_AND_FUNCTION_EXIST'),
                                'to_plugin': 'infohub_democall'
                            },
                            'client_missing_cmd_function': { // Fail
                                'alias': 'client_missing_cmd_function_link',
                                'event_data': 'client_missing_cmd_function',
                                'button_label': _Translate('CLIENT_-_PLUGIN_EXIST,_CMD_FUNCTION_DO_NOT_EXIST'),
                                'to_plugin': 'infohub_democall'
                            },
                            'client_missing_plugin': { // Fail
                                'alias': 'client_missing_plugin_link',
                                'event_data': 'client_missing_plugin',
                                'button_label': _Translate('CLIENT_-_PLUGIN_IS_MISSING'),
                                'to_plugin': 'infohub_democall'
                            },
                            'server_correct': {
                                'alias': 'server_correct_link',
                                'event_data': 'server_correct',
                                'button_label': _Translate('SERVER_-_CORRECT_CALL._PLUGIN_AND_FUNCTION_EXIST'),
                                'to_plugin': 'infohub_democall'
                            },
                            'server_missing_cmd_function': { // Fail
                                'alias': 'server_missing_cmd_function_link',
                                'event_data': 'server_missing_cmd_function',
                                'button_label': _Translate('SERVER_-_PLUGIN_EXIST,_CMD_FUNCTION_DO_NOT_EXIST'),
                                'to_plugin': 'infohub_democall'
                            },
                            'server_missing_plugin': { // Fail
                                'alias': 'server_missing_plugin_link',
                                'event_data': 'server_missing_plugin',
                                'button_label': _Translate('SERVER_-_PLUGIN_IS_MISSING'),
                                'to_plugin': 'infohub_democall'
                            },
                            'client_child_valid': { // Would be OK with the new rules
                                'alias': 'client_child_to_level1_link',
                                'event_data': 'client_child_valid',
                                'button_label': _Translate('CLIENT_-_CHILD_TALK_TO_VALID_RESPONDERS'),
                                'to_plugin': 'infohub_democall'
                            },
                            'client_invalid_call_to_sibling_grandchild': {
                                'alias': 'client_invalid_call_to_sibling_grandchild_link',
                                'event_data': 'client_invalid_call_to_sibling_grandchild',
                                'button_label': _Translate('CLIENT_-_INVALID_CALL_TO_SIBLING_CHILD'),
                                'to_plugin': 'infohub_democall'
                            },
                            'client_invalid_call_from_child_to_parent': {
                                'alias': 'client_invalid_call_from_child_to_parent',
                                'event_data': 'client_invalid_call_from_child_to_parent',
                                'button_label': _Translate('CLIENT_-_INVALID_CALL_FROM_CHILD_TO_PARENT'),
                                'to_plugin': 'infohub_democall'
                            },
                            'server_run_all_tests': {
                                'alias': 'server_run_all_tests_link',
                                'event_data': 'server_run_all_tests',
                                'button_label': _Translate('SERVER_-_RUN_ALL_SERVER_TESTS'),
                                'to_plugin': 'infohub_democall'
                            }
                        }
                    }
                },
                'how': {
                    'mode': 'one box',
                    'text': '[my_menu]',
                },
                'where': {
                    'box_id': $in.parent_box_id + '.menu',
                    'max_width': 640,
                },
            },
            'data_back': {'step': 'step_end'},
        };

        return {
            'answer': 'true',
            'message': 'Here are the render data that will create a menu',
            'data': $data,
        };
    };
}

//# sourceURL=infohub_democall_menu.js