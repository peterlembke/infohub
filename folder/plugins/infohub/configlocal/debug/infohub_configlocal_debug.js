/**
 * infohub_configlocal_debug
 * Here you can set the debug level
 *
 * @package     Infohub
 * @subpackage  infohub_configlocal_debug
 * @since       2018-05-25
 * @author      Peter Lembke <info@infohub.se>
 * @license     GPL-3.0-or-later
 * @copyright   Copyright (C) 2010- Peter Lembke
 */
function infohub_configlocal_debug() {

    'use strict';

// include "infohub_base.js"

    const _Version = function() {
        return {
            'date': '2018-05-25',
            'since': '2018-05-25',
            'version': '2.0.0',
            'checksum': '{{checksum}}',
            'class_name': 'infohub_configlocal_debug',
            'note': 'Here you can set the debug level',
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
        const $parts = $text.split('_');
        let $response = '';

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

        $classTranslations = _ByVal($in.translations);
        $in.func = _GetFuncName($in.subtype);
        const $response = internal_Cmd($in);

        return {
            'answer': $response.answer,
            'message': $response.message,
            'data': $response.data,
        };
    };

    /**
     * Show the debug buttons
     * @param $in
     * @returns {*}
     */
    $functions.push('internal_debug');
    const internal_debug = function($in = {}) {
        const $default = {
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
                        'type': 'text',
                        'text': '[h1]'+_Translate('DEBUG_LEVEL')+'[/h1]'
                    },
                    // @todo checkbox enable quick buttons in launcher
                    // @todo checkbox enable logging
                    // @todo textbox, only log for this plugin name
                    'button_text_larger': {
                        'type': 'form',
                        'subtype': 'button',
                        'mode': 'button',
                        'button_label': _Translate('MAKE_THINGS_LARGER.'),
                        'data': 'debug_level',
                        'to_plugin': 'infohub_view',
                        'to_function': 'debug_level',
                        'custom_variables': {
                            'multiplier': '1.2',
                        },
                    },
                    'button_text_smaller': {
                        'type': 'form',
                        'subtype': 'button',
                        'mode': 'button',
                        'button_label': _Translate('MAKE_THINGS_SMALLER'),
                        'data': 'debug_level',
                        'to_plugin': 'infohub_view',
                        'to_function': 'debug_level',
                        'custom_variables': {
                            'multiplier': '0.8',
                        },
                    },
                    'button_text_normal': {
                        'type': 'form',
                        'subtype': 'button',
                        'mode': 'button',
                        'button_label': _Translate('NORMAL_SIZE_(SIZE_1)'),
                        'data': 'debug_level',
                        'to_plugin': 'infohub_view',
                        'to_function': 'debug_level',
                        'custom_variables': {
                            'debug_level': '1.0',
                        },
                    },
                    'button_text_2': {
                        'type': 'form',
                        'subtype': 'button',
                        'mode': 'button',
                        'button_label': _Translate('SIZE_2'),
                        'data': 'debug_level',
                        'to_plugin': 'infohub_view',
                        'to_function': 'debug_level',
                        'custom_variables': {
                            'debug_level': '2.0',
                        },
                    },
                    'button_text_3': {
                        'type': 'form',
                        'subtype': 'button',
                        'mode': 'button',
                        'button_label':_Translate('SIZE_3'),
                        'data': 'debug_level',
                        'to_plugin': 'infohub_view',
                        'to_function': 'debug_level',
                        'custom_variables': {
                            'debug_level': '3.0',
                        },
                    },
                    'button_text_4': {
                        'type': 'form',
                        'subtype': 'button',
                        'mode': 'button',
                        'button_label': _Translate('SIZE_4'),
                        'data': 'debug_level',
                        'to_plugin': 'infohub_view',
                        'to_function': 'debug_level',
                        'custom_variables': {
                            'debug_level': '4.0',
                        },
                    },
                    'button_text_max': {
                        'type': 'form',
                        'subtype': 'button',
                        'mode': 'button',
                        'button_label': _Translate('MAX_SIZE_(SIZE_5)'),
                        'data': 'debug_level',
                        'to_plugin': 'infohub_view',
                        'to_function': 'debug_level',
                        'custom_variables': {
                            'debug_level': '5.0',
                        },
                    },
                },
                'how': {
                    'mode': 'one box',
                    'text': '[titel][button_text_larger][button_text_smaller][button_text_normal][button_text_2][button_text_3][button_text_4][button_text_max]',
                },
                'where': {
                    'box_id': $in.parent_box_id + '.form',
                    'max_width': 100,
                    'scroll_to_box_id': 'true',
                },
            },
            'data_back': {'step': 'step_end'},
        };

        return {
            'answer': 'true',
            'message': 'Here are the render data',
            'data': $data,
        };

    };

}

//# sourceURL=infohub_configlocal_debug.js