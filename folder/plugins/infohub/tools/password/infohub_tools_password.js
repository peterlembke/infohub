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
function infohub_tools_password() {

    "use strict";

// include "infohub_base.js"

    const _Version = function () {
        return {
            'date': '2019-03-31',
            'since': '2018-08-04',
            'version': '1.0.0',
            'time': '{{time}}',
            'class_name': 'infohub_tools_password',
            'note': 'Render a form for generating passwords in different formats',
            'status': 'normal',
            'SPDX-License-Identifier': 'GPL-3.0-or-later'
        };
    };

    const _GetCmdFunctions = function () {
        return {
            'create': 'normal',
            'click_handle_password': 'normal'
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
            'subtype': 'menu',
            'parent_box_id': '',
            'translations': {},
            'step': 'step_start',
            'response': {
                'answer': 'false',
                'message': 'Nothing to report from tools_encrypt'
            }
        };
        $in = _Default($default, $in);

        const $size = '1';
        let $text = [];

        if ($in.step === 'step_start')
        {
            $classTranslations = $in.translations;

            $text[0] = _Translate('password_length = length of the passwords you want.');
            $text[1] = _Translate('0 (default) gives you a random length 16-64 characters.');
            $text[2] = _Translate('max_group_number = numbers of groups to include in the password.');
            $text[3] = '0 = abcdefghijklmnopqrstuvwxyz';
            $text[4] = '1 = ABCDEFGHIJKLMNOPQRSTUVWXYZ';
            $text[5] = '2 = 0123456789';
            $text[6] = '3 = !#%&()=?+-*:;,._';
            $text[7] = '4 = spaces';
            $text[8] = _Translate('Default max_group_number = 4 (0-4) Some sites do not allow spaces, then set max_group_number = 3.');
            $text[9] = _Translate('Some sites do not allow special chacaters, then set max_group_number = 2.');

            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_render',
                    'function': 'create'
                },
                'data': {
                    'what': {
                        'my_text': {
                            'type': 'text',
                            'text': "[h1][titel][/h1][my_presentation_box]"
                        },
                        'my_presentation_box': {
                            'plugin': 'infohub_rendermajor',
                            'type': 'presentation_box',
                            'head_label': _Translate('Click for instructions...'),
                            'content_data': '[i][ingress][/i]',
                            'open': 'false'
                        },
                        'titel': {
                            'type': 'common',
                            'subtype': 'value',
                            'data': _Translate('Password generator')
                        },
                        'ingress': {
                            'type': 'common',
                            'subtype': 'value',
                            'data': $text.join('<br>')
                        },
                        'my_form': {
                            'plugin': 'infohub_renderform',
                            'type': 'form',
                            'content': '[my_select_node][my_select_max_group_number][my_select_length]<br>[my_password_button][my_textbox_output][my_clear_button]',
                            'label': _Translate('Password format'),
                            'description': _Translate('Select what password format you want to use')
                        },
                        'my_select_node': {
                            'type': 'form',
                            'subtype': 'select',
                            "label": _Translate("Node"),
                            "description": _Translate("What node plugin do you want to produce the checksum?"),
                            "size": $size,
                            "multiple": "false",
                            "options": [
                                {"type": "option", "value": "client", "label": _Translate("Client"), 'selected': 'true'},
                                {"type": "option", "value": "server", "label": _Translate("Server")}
                            ]
                        },
                        'my_select_max_group_number': {
                            'type': 'form',
                            'subtype': 'select',
                            "label": _Translate("Password groups"),
                            "description": _Translate("What groups do you want in your password?"),
                            "size": $size,
                            "multiple": "false",
                            "options": [
                                {"type": "option", "value": "0", "label": _Translate("Group 0")},
                                {"type": "option", "value": "1", "label": _Translate("Group 0-1")},
                                {"type": "option", "value": "2", "label": _Translate("Group 0-2"), 'selected': 'true'},
                                {"type": "option", "value": "3", "label": _Translate("Group 0-3")},
                                {"type": "option", "value": "4", "label": _Translate("Group 0-4")}
                            ]
                        },
                        'my_select_length': {
                            'type': 'form',
                            'subtype': 'select',
                            "label": _Translate("Password length"),
                            "description": _Translate("What password length do you want?"),
                            "size": $size,
                            "multiple": "false",
                            "options": [
                                {"type": "option", "value": "0", "label": _Translate("random length 16-64 characters")},
                                {"type": "option", "value": "16", "label": _Translate("16 characters")},
                                {"type": "option", "value": "32", "label": _Translate("32 characters"), 'selected': 'true'},
                                {"type": "option", "value": "48", "label": _Translate("48 characters")},
                                {"type": "option", "value": "64", "label": _Translate("64 characters")}
                            ]
                        },
                        'my_password_button': {
                            'plugin': 'infohub_renderform',
                            'type': 'button',
                            'mode': 'submit',
                            'button_label': _Translate('Generate password'),
                            'event_data': 'password|handle_password|get_current_password',
                            'to_plugin': 'infohub_tools',
                            'to_function': 'click'
                        },
                        'my_textbox_output': {
                            'type': 'form',
                            'subtype': 'textarea',
                            'input_type': 'text',
                            'placeholder': _Translate('Will show the passwords'),
                            'class': 'textarea',
                            'css_data': {}
                        },
                        'my_clear_button': {
                            'plugin': 'infohub_renderform',
                            'type': 'button',
                            'mode': 'button',
                            'button_label': _Translate('Clear'),
                            'event_data': 'password|handle_password|clear_my_textbox_output',
                            'to_plugin': 'infohub_tools',
                            'to_function': 'click'
                        }
                    },
                    'how': {
                        'mode': 'one box',
                        'text': '[my_text][my_form]'
                    },
                    'where': {
                        'box_id': $in.parent_box_id + '.tools',
                        'max_width': 100,
                        'scroll_to_box_id': 'true'
                    }
                },
                'data_back': {
                    'step': 'step_end'
                }
            });
        }

        return {
            'answer': $in.response.answer,
            'message': $in.response.message
        };
    };

    /**
     * Handle password
     * @version 2018-08-04
     * @since   2018-08-04
     * @author  Peter Lembke
     */
    $functions.push('click_handle_password');
    const click_handle_password = function ($in)
    {
        const $default = {
            'step': 'step_start',
            'form_data': {},
            'event_data': '',
            'response': {
                'answer': 'false',
                'message': '',
                'passwords': []
            }
        };
        $in = _Default($default, $in);

        let $formData = {};

        if ($in.step === 'step_start') {
            $in.step = 'step_get_password';
            if ($in.event_data === 'clear_my_textbox_output') {
                $formData = {
                    'my_textbox_output': {'value': '', 'type': 'textarea'}
                };
                $in.step = 'step_display_data';
            }
        }

        if ($in.step === 'step_get_password') {

            const $node = _GetData({'name': 'form_data/my_select_node/value/0', 'default': 'server', 'data': $in});
            const $passwordLength = _GetData({'name': 'form_data/my_select_length/value/0', 'default': '2', 'data': $in});
            const $maxGroupNumber = _GetData({'name': 'form_data/my_select_max_group_number/value/0', 'default': '2', 'data': $in});

            const $callServer = {
                'to': {
                    'node': $node,
                    'plugin': 'infohub_password',
                    'function': 'generate'
                },
                'data': {
                    'number_of_passwords': 1, // Number of passwords you want
                    'password_length': parseInt($passwordLength), // wanted password length, give 0 for a random length 16-64 characters
                    'max_group_number': parseInt($maxGroupNumber) // Gives a mix from 5 groups 0-4. Some sites accept only group 0-2.
                },
                'data_back': {}
            };

            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_tools',
                    'function': 'call_server'
                },
                'data': {
                    'send_data': $callServer
                },
                'data_back': {
                    'step': 'step_get_password_response'
                }
            });
        }

        if ($in.step === 'step_get_password_response') {

            const $password = _GetData({'name': 'response/passwords/0', 'default': '-', 'data': $in});

            $formData = {
                'my_textbox_output': {'value': $password, 'type': 'textarea', 'mode': 'add_left'}
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
                    'function': 'form_write'
                },
                'data': {
                    'id': 'main.body.infohub_tools.tools',
                    'form_data': $formData
                },
                'data_back': {
                    'step': 'step_end'
                }
            });
        }

        return {
            'answer': $in.response.answer,
            'message': $in.response.message,
            'ok': $in.response.answer
        };
    };
}
//# sourceURL=infohub_tools_password.js