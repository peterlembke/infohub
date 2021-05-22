/**
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
function infohub_tools_menu() {

    'use strict';

// include "infohub_base.js"

    const _Version = function() {
        return {
            'date': '2019-07-07',
            'since': '2018-04-15',
            'version': '2.0.0',
            'checksum': '{{checksum}}',
            'class_name': 'infohub_tools_menu',
            'note': 'Render a menu for infohub_tools',
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

    let $classTranslations = {};

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
    const create = function($in) {
        const $default = {
            'subtype': 'menu',
            'parent_box_id': '',
            'translations': {},
            'step': 'step_start',
            'response': {
                'answer': 'false',
                'message': 'Nothing to report from tools_encrypt',
            },
        };
        $in = _Default($default, $in);

        if ($in.step === 'step_start') {
            $classTranslations = $in.translations;
            return _SubCall({
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
                            'data': 'Demo Collection',
                        },
                        'my_menu': {
                            'plugin': 'infohub_rendermenu',
                            'type': 'menu',
                            'head_label': '[titel]',
                            'options': {
                                'uuid': {
                                    'alias': 'uuid_link',
                                    'event_data': 'uuid',
                                    'button_label': _Translate('GET_A_UNIQUE_IDENTIFIER_UUID'),
                                    'to_plugin': 'infohub_tools',
                                    'to_function': 'click_menu',
                                },
                                'checksum': {
                                    'alias': 'checksum_link',
                                    'event_data': 'checksum',
                                    'button_label': _Translate('CALCULATE_CHECKSUM'),
                                    'to_plugin': 'infohub_tools',
                                    'to_function': 'click_menu',
                                },
                                'compress': {
                                    'alias': 'compress_link',
                                    'event_data': 'compress',
                                    'button_label': _Translate('COMPRESS_DATA'),
                                    'to_plugin': 'infohub_tools',
                                    'to_function': 'click_menu',
                                },
                                'encrypt': {
                                    'alias': 'encrypt_link',
                                    'event_data': 'encrypt',
                                    'button_label': _Translate('ENCRYPT/DECRYPT_TEXT'),
                                    'to_plugin': 'infohub_tools',
                                    'to_function': 'click_menu',
                                },
                                'package': {
                                    'alias': 'package_link',
                                    'event_data': 'package',
                                    'button_label': _Translate('MESSAGES_TOOL'),
                                    'to_plugin': 'infohub_tools',
                                    'to_function': 'click_menu',
                                },
                                'time': {
                                    'alias': 'time_link',
                                    'event_data': 'time',
                                    'button_label': _Translate('GET_CURRENT_TIME'),
                                    'to_plugin': 'infohub_tools',
                                    'to_function': 'click_menu',
                                },
                                'random': {
                                    'alias': 'random_link',
                                    'event_data': 'random',
                                    'button_label': _Translate('GET_RANDOM_NUMBERS'),
                                    'to_plugin': 'infohub_tools',
                                    'to_function': 'click_menu',
                                },
                                'password': {
                                    'alias': 'password_link',
                                    'event_data': 'password',
                                    'button_label': _Translate('GET_PASSWORDS'),
                                    'to_plugin': 'infohub_tools',
                                    'to_function': 'click_menu',
                                },
                                'testcall': {
                                    'alias': 'testcall_link',
                                    'event_data': 'testcall',
                                    'button_label': _Translate('RUN_TEST_CALLS'),
                                    'to_plugin': 'infohub_tools',
                                    'to_function': 'click_menu',
                                },
                            },
                        },
                    },
                    'how': {
                        'mode': 'one box',
                        'text': '[my_menu]',
                    },
                    'where': {
                        'box_id': $in.parent_box_id + '.menu',
                        'max_width': 320,
                        'scroll_to_box_id': 'true',
                    },
                    'cache_key': 'menu',
                },
                'data_back': {'step': 'step_end'},
            });
        }

        return {
            'answer': $in.response.answer,
            'message': $in.response.message,
        };
    };
}

//# sourceURL=infohub_tools_menu.js