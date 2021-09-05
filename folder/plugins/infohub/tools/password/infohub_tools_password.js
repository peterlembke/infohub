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
function infohub_tools_password() {

    'use strict';

// include "infohub_base.js"

    const _Version = function() {
        return {
            'date': '2019-03-31',
            'since': '2018-08-04',
            'version': '1.0.0',
            'time': '{{time}}',
            'class_name': 'infohub_tools_password',
            'note': 'Render a form for generating passwords in different formats',
            'status': 'normal',
            'SPDX-License-Identifier': 'GPL-3.0-or-later',
        };
    };

    const _GetCmdFunctions = function() {
        const $list = {
            'create': 'normal',
            'click_handle_password': 'normal',
        };

        return _GetCmdFunctionsBase($list);
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
            'step': 'step_start',
            'response': {
                'answer': 'false',
                'message': 'Nothing to report from tools_encrypt',
            },
        };
        $in = _Default($default, $in);

        const $size = '1';
        let $text = [];

        if ($in.step === 'step_start') {
            $classTranslations = $in.translations;

            $text[0] = _Translate('PASSWORD_LENGTH_=_LENGTH_OF_THE_PASSWORDS_YOU_WANT.');
            $text[1] = _Translate('0_(DEFAULT)_GIVES_YOU_A_RANDOM_LENGTH_16-64_CHARACTERS.');
            $text[2] = _Translate('MAX_GROUP_NUMBER_=_NUMBERS_OF_GROUPS_TO_INCLUDE_IN_THE_PASSWORD.');
            $text[3] = '0 = abcdefghijklmnopqrstuvwxyz';
            $text[4] = '1 = ABCDEFGHIJKLMNOPQRSTUVWXYZ';
            $text[5] = '2 = 0123456789';
            $text[6] = '3 = !#%&()=?+-*:;,._';
            $text[7] = '4 = spaces';
            $text[8] = _Translate('DEFAULT_MAX_GROUP_NUMBER_=_4_(0-4)_SOME_SITES_DO_NOT_ALLOW_SPACES,_THEN_SET_MAX_GROUP_NUMBER_=_3.');
            $text[9] = _Translate('SOME_SITES_DO_NOT_ALLOW_SPECIAL_CHARACTERS,_THEN_SET_MAX_GROUP_NUMBER_=_2.');

            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_render',
                    'function': 'create',
                },
                'data': {
                    'what': {
                        'my_text': {
                            'type': 'text',
                            'text': '[h1][titel][/h1][my_presentation_box]',
                        },
                        'my_presentation_box': {
                            'plugin': 'infohub_rendermajor',
                            'type': 'presentation_box',
                            'head_label': _Translate('CLICK_FOR_INSTRUCTIONS...'),
                            'content_data': '[i][ingress][/i]',
                            'open': 'false',
                        },
                        'titel': {
                            'type': 'common',
                            'subtype': 'value',
                            'data': _Translate('PASSWORD_GENERATOR')
                        },
                        'ingress': {
                            'type': 'common',
                            'subtype': 'value',
                            'data': $text.join('<br>'),
                        },
                        'my_form': {
                            'plugin': 'infohub_renderform',
                            'type': 'form',
                            'content': '[my_select_node][my_select_max_group_number][my_select_length]<br>[my_password_button][my_textbox_output][my_clear_button]',
                            'label': _Translate('PASSWORD_FORMAT'),
                            'description': _Translate('SELECT_WHAT_PASSWORD_FORMAT_YOU_WANT_TO_USE')
                        },
                        'my_select_node': {
                            'type': 'form',
                            'subtype': 'select',
                            "label": _Translate("NODE"),
                            "description": _Translate("WHAT_NODE_PLUGIN_DO_YOU_WANT_TO_PRODUCE_THE_CHECKSUM?"),
                            "size": $size,
                            "multiple": "false",
                            "options": [
                                {"type": "option", "value": "client", "label": _Translate("CLIENT"), 'selected': 'true'},
                                {"type": "option", "value": "server", "label": _Translate("SERVER")}
                            ]
                        },
                        'my_select_max_group_number': {
                            'type': 'form',
                            'subtype': 'select',
                            "label": _Translate("PASSWORD_GROUPS"),
                            "description": _Translate("WHAT_GROUPS_DO_YOU_WANT_IN_YOUR_PASSWORD?"),
                            "size": $size,
                            "multiple": "false",
                            "options": [
                                {"type": "option", "value": "0", "label": _Translate("GROUP_0")},
                                {"type": "option", "value": "1", "label": _Translate("GROUP_0-1")},
                                {"type": "option", "value": "2", "label": _Translate("GROUP_0-2"), 'selected': 'true'},
                                {"type": "option", "value": "3", "label": _Translate("GROUP_0-3")},
                                {"type": "option", "value": "4", "label": _Translate("GROUP_0-4")}
                            ]
                        },
                        'my_select_length': {
                            'type': 'form',
                            'subtype': 'select',
                            "label": _Translate("PASSWORD_LENGTH"),
                            "description": _Translate("WHAT_PASSWORD_LENGTH_DO_YOU_WANT?"),
                            "size": $size,
                            "multiple": "false",
                            "options": [
                                {"type": "option", "value": "0", "label": _Translate("RANDOM_LENGTH_16-64_CHARACTERS")},
                                {"type": "option", "value": "16", "label": _Translate("16_CHARACTERS")},
                                {"type": "option", "value": "32", "label": _Translate("32_CHARACTERS"), 'selected': 'true'},
                                {"type": "option", "value": "48", "label": _Translate("48_CHARACTERS")},
                                {"type": "option", "value": "64", "label": _Translate("64_CHARACTERS")}
                            ]
                        },
                        'my_password_button': {
                            'plugin': 'infohub_renderform',
                            'type': 'button',
                            'mode': 'submit',
                            'button_label': _Translate('GENERATE_PASSWORD'),
                            'event_data': 'password|handle_password|get_current_password',
                            'to_plugin': 'infohub_tools',
                            'to_function': 'click',
                        },
                        'my_textbox_output': {
                            'type': 'form',
                            'subtype': 'textarea',
                            'input_type': 'text',
                            'placeholder': _Translate('WILL_SHOW_THE_PASSWORDS'),
                            'class': 'textarea',
                            'css_data': {},
                        },
                        'my_clear_button': {
                            'plugin': 'infohub_renderform',
                            'type': 'button',
                            'mode': 'button',
                            'button_label': _Translate('CLEAR'),
                            'event_data': 'password|handle_password|clear_my_textbox_output',
                            'to_plugin': 'infohub_tools',
                            'to_function': 'click',
                        },
                    },
                    'how': {
                        'mode': 'one box',
                        'text': '[my_text][my_form]',
                    },
                    'where': {
                        'box_id': $in.parent_box_id + '.tools',
                        'max_width': 100,
                        'scroll_to_box_id': 'true',
                    },
                    'cache_key': 'password',
                },
                'data_back': {
                    'step': 'step_end',
                },
            });
        }

        return {
            'answer': $in.response.answer,
            'message': $in.response.message,
        };
    };

    /**
     * Handle password
     * @version 2018-08-04
     * @since   2018-08-04
     * @author  Peter Lembke
     */
    $functions.push('click_handle_password');
    const click_handle_password = function($in = {}) {
        const $default = {
            'step': 'step_start',
            'form_data': {},
            'event_data': '',
            'response': {
                'answer': 'false',
                'message': '',
                'passwords': [],
            },
        };
        $in = _Default($default, $in);

        let $formData = {};

        if ($in.step === 'step_start') {
            $in.step = 'step_get_password';
            if ($in.event_data === 'clear_my_textbox_output') {
                $formData = {
                    'my_textbox_output': {'value': '', 'type': 'textarea'},
                };
                $in.step = 'step_display_data';
            }
        }

        if ($in.step === 'step_get_password') {

            const $node = _GetData({
                'name': 'form_data/my_select_node/value/0',
                'default': 'server',
                'data': $in,
            });
            const $passwordLength = _GetData({
                'name': 'form_data/my_select_length/value/0',
                'default': '2',
                'data': $in,
            });
            const $maxGroupNumber = _GetData({
                'name': 'form_data/my_select_max_group_number/value/0',
                'default': '2',
                'data': $in,
            });

            const $callServer = {
                'to': {
                    'node': $node,
                    'plugin': 'infohub_password',
                    'function': 'generate',
                },
                'data': {
                    'number_of_passwords': 1, // Number of passwords you want
                    'password_length': parseInt($passwordLength), // wanted password length, give 0 for a random length 16-64 characters
                    'max_group_number': parseInt($maxGroupNumber), // Gives a mix from 5 groups 0-4. Some sites accept only group 0-2.
                },
                'data_back': {},
            };

            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_tools',
                    'function': 'call_server',
                },
                'data': {
                    'send_data': $callServer,
                },
                'data_back': {
                    'step': 'step_get_password_response',
                },
            });
        }

        if ($in.step === 'step_get_password_response') {

            const $password = _GetData(
                {'name': 'response/passwords/0', 'default': '-', 'data': $in});

            $formData = {
                'my_textbox_output': {
                    'value': $password,
                    'type': 'textarea',
                    'mode': 'add_left',
                },
            };

            if ($in.response.answer === 'true') {
                $in.step = 'step_display_data';
            }
        }

        if ($in.step === 'step_display_data') {
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_view',
                    'function': 'form_write',
                },
                'data': {
                    'id': 'main.body.infohub_tools.tools',
                    'form_data': $formData,
                },
                'data_back': {
                    'step': 'step_end',
                },
            });
        }

        return {
            'answer': $in.response.answer,
            'message': $in.response.message,
            'ok': $in.response.answer,
        };
    };
}

//# sourceURL=infohub_tools_password.js