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
function infohub_tools_package() {

    "use strict";

// include "infohub_base.js"

    const _Version = function() {
        return {
            'date': '2020-04-18',
            'since': '2020-04-18',
            'version': '1.0.0',
            'time': '{{time}}',
            'class_name': 'infohub_tools_package',
            'note': 'The messages_encoded data can be unpacked and viewed here',
            'status': 'normal',
            'SPDX-License-Identifier': 'GPL-3.0-or-later'
        };
    };

    const _GetCmdFunctions = function() {
        return {
            'create': 'normal',
            'click_handle_package': 'normal'
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
                        'my_text': {
                            'type': 'text',
                            'text': "[h1][titel][/h1]\n [i][ingress][/i]\n"
                        },
                        'titel': {
                            'type': 'common',
                            'subtype': 'value',
                            'data': _Translate('View data from messages_encoded')
                        },
                        'ingress': {
                            'type': 'common',
                            'subtype': 'value',
                            'data': _Translate('With this tool you can view data from the package property messages_encoded. See your browser network tab in developer tools.')
                        },
                        'my_form': {
                            'plugin': 'infohub_renderform',
                            'type': 'form',
                            'content': '[my_textbox_input]<br>[my_package_button][my_textbox_output]',
                            'label': _Translate('messages_encoded'),
                            'description': _Translate('Paste a string from messages_encoded')
                        },
                        'my_textbox_input': {
                            'type': 'form',
                            'subtype': 'textarea',
                            'input_type': 'text',
                            'placeholder': _Translate('Paste a string from messages_encoded'),
                            'class': 'textarea',
                            'value': '',
                            'css_data': {}
                        },
                        'my_package_button': {
                            'plugin': 'infohub_renderform',
                            'type': 'button',
                            'mode': 'submit',
                            'button_label': _Translate('Decode'),
                            'event_data': 'package|handle_package|get_current_package',
                            'to_plugin': 'infohub_tools',
                            'to_function': 'click'
                        },
                        'my_textbox_output': {
                            'type': 'form',
                            'subtype': 'textarea',
                            'input_type': 'text',
                            'placeholder': _Translate('Will show the decoded pretty json'),
                            'class': 'textarea',
                            'css_data': {
                                '.textarea':
                                    'width: 100%;'+
                                    'box-sizing:border-box;'+
                                    'margin: 10px 0px 0px 0px;'+
                                    'padding: 4px 4px 4px 10px;'+
                                    'border-radius: 20px;'+
                                    'background-color: rgba(32, 250, 10, 0.04);'+
                                    'border: 1px solid #bdbdbd;'+
                                    'resize: both;'+
                                    'font-size: 16px;'+
                                    '-webkit-appearance: none;'
                            },
                            'rows': 100
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
                    },
                    'cache_key': 'package'
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
     * Handle package
     * @version 2018-08-04
     * @since   2018-08-04
     * @author  Peter Lembke
     */
    $functions.push('click_handle_package');
    const click_handle_package = function ($in)
    {
        const $default = {
            'step': 'step_start',
            'box_id': '',
            'form_data': {},
            'response': {
                'answer': 'false',
                'message': '',
                'data': null
            },
            'event_data': '',
            'data_back': {},
            'ok': 'true'
        };
        $in = _Default($default, $in);

        let $formData = {};

        if ($in.step === 'step_start') {
            $in.step = 'step_get_package';
            if ($in.event_data === 'clear_my_textbox_output') {
                $formData =  {
                    'my_textbox_output': { 'value': '', 'type': 'textarea' }
                };
                $in.step = 'step_display_data';
            }
        }

        if ($in.step === 'step_get_package') {

            const $messagesEncoded = _GetData({'name': 'form_data/my_textbox_input/value', 'default': '', 'data': $in });
            const $messagesJson = atob($messagesEncoded);
            const $messages = JSON.parse($messagesJson);
            const $prettyJson = _JsonEncode($messages);
            $in.data_back.ok = 'true';
            const $responseMessage = 'Here are the data';
            $in.data_back.response_message = $responseMessage;
            

            $formData =  {
                'my_textbox_output': { 'value': $prettyJson, 'type': 'textarea' },
            };
            
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
                    'box_id': $in.box_id,
                    'ok': $in.data_back.ok,
                    'response_message': $in.data_back.response_message,
                    'step': 'step_display_message'
                }
            });
        }

        if ($in.step === 'step_display_message') {
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_view',
                    'function': 'set_text'
                },
                'data': {
                    'id': $in.box_id + '_my_message',
                    'text': $in.data_back.response_message
                },
                'data_back': {
                    'box_id': $in.box_id,
                    'ok': $in.data_back.ok,
                    'step': 'step_end'
                }
            });
        }

        return {
            'answer': 'true',
            'message': 'Finished handle_package',
            'ok': $in.ok
        };
    };
}
//# sourceURL=infohub_tools_package.js