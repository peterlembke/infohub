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
function infohub_tools_time() {

    "use strict";

// include "infohub_base.js"

    const _Version = function() {
        return {
            'date': '2019-03-31',
            'since': '2018-08-04',
            'version': '1.0.0',
            'time': '{{time}}',
            'class_name': 'infohub_tools_time',
            'note': 'Render a form for generating times in different formats',
            'status': 'normal',
            'SPDX-License-Identifier': 'GPL-3.0-or-later'
        };
    };

    const _GetCmdFunctions = function() {
        return {
            'create': 'normal',
            'click_handle_time': 'normal',
            'click_handle_node_select': 'normal'
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

        const $size = '1';

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
                            'data': _Translate('Current time in different formats')
                        },
                        'ingress': {
                            'type': 'common',
                            'subtype': 'value',
                            'data': _Translate('<p>With this tool you can get the current time in different formats.</p><p>Observe that the server PHP plugin must know about your time zone. See the documentation for Infohub_Time how to change that.</p>')
                        },
                        'my_form': {
                            'plugin': 'infohub_renderform',
                            'type': 'form',
                            'content': '[my_select_node][my_select_time_format]<br>[my_time_button][my_textbox_output][my_clear_button]',
                            'label': _Translate('Time format'),
                            'description': _Translate('Select what time format you want to use')
                        },
                        'my_select_node': {
                            'plugin': 'infohub_renderform',
                            'type': 'select',
                            "label": _Translate("Node"),
                            "description": _Translate("What node plugin do you want to produce the checksum?"),
                            "size": $size,
                            "multiple": "false",
                            "options": [
                                { "type": "option", "value": "client", "label": _Translate("Client"), 'selected': 'true' },
                                { "type": "option", "value": "server", "label": _Translate("Server") }
                            ],
                            'event_data': 'time|handle_node_select',
                            'to_plugin': 'infohub_tools',
                            'to_function': 'click',
                            'custom_variables': {
                                'affect_alias': 'my_select_time_format',
                                'affect_plugin': 'infohub_time',
                                'affect_function': 'get_available_options'
                            }
                        },
                        'my_select_time_format': {
                            'type': 'form',
                            'subtype': 'select',
                            "label": _Translate("Time format"),
                            "description": _Translate("What time format do you want?"),
                            "size": $size,
                            "multiple": "false",
                            "options": [],
                            'source_node': 'client',
                            'source_plugin': 'infohub_time',
                            'source_function': 'get_available_options'
                        },
                        'my_time_button': {
                            'plugin': 'infohub_renderform',
                            'type': 'button',
                            'mode': 'submit',
                            'button_label': _Translate('Get the time'),
                            'event_data': 'time|handle_time|get_current_time',
                            'to_plugin': 'infohub_tools',
                            'to_function': 'click'
                        },
                        'my_textbox_output': {
                            'type': 'form',
                            'subtype': 'textarea',
                            'input_type': 'text',
                            'placeholder': _Translate('Will show the time in the right format'),
                            'class': 'textarea',
                            'css_data': {}
                        },
                        'my_clear_button': {
                            'plugin': 'infohub_renderform',
                            'type': 'button',
                            'mode': 'button',
                            'button_label': _Translate('Clear'),
                            'event_data': 'time|handle_time|clear_my_textbox_output',
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
                'data_back': {'step': 'step_end'}
            });
        }

        return {
            'answer': $in.response.answer,
            'message': $in.response.message
        };
    };

    /**
     * Handle time
     * @version 2018-08-04
     * @since   2018-08-04
     * @author  Peter Lembke
     */
    $functions.push('click_handle_time');
    const click_handle_time = function ($in)
    {
        const $default = {
            'step': 'step_start',
            'form_data': {},
            'response': {
                'answer': 'false',
                'message': '',
                'data': null
            },
            'event_data': ''
        };
        $in = _Default($default, $in);

        let $formData = {};

        if ($in.step === 'step_start') {
            $in.step = 'step_get_time';
            if ($in.event_data === 'clear_my_textbox_output') {
                $formData =  {
                    'my_textbox_output': { 'value': '', 'type': 'textarea' }
                };
                $in.step = 'step_display_data';
            }
        }

        if ($in.step === 'step_get_time') {

            const $node = _GetData({'name': 'form_data/my_select_node/value/0', 'default': 'server', 'data': $in });
            const $timeFormat = _GetData({'name': 'form_data/my_select_time_format/value/0', 'default': 'timestamp', 'data': $in });

            const $callServer = {
                'to': {
                    'node': $node,
                    'plugin': 'infohub_time',
                    'function': 'time'
                },
                'data': {
                    'type': $timeFormat
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
                    'step': 'step_get_time_response'
                }
            });
        }

        if ($in.step === 'step_get_time_response') {
            $formData =  {
                'my_textbox_output': { 'value': $in.response.data, 'type': 'textarea', 'mode': 'add_left' }
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

    /**
     * In Encrypt when you select a node then one of the select boxes should be hidden
     * @version 2018-08-08
     * @since   2018-08-08
     * @author  Peter Lembke
     */
    $functions.push('click_handle_node_select');
    const click_handle_node_select = function ($in)
    {
        const $default = {
            'step': 'step_start',
            'value': '',
            'box_id': '',
            'affect_alias': '',
            'affect_plugin': '',
            'affect_function': '',
            'response': {
                'answer': 'false',
                'message': '',
                'data': ''
            }
        };
        $in = _Default($default, $in);

        if ($in.step === 'step_start')
        {
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_render',
                    'function': 'render_options'
                },
                'data': {
                    'id': $in.box_id + '_' + $in.affect_alias,
                    'source_node': $in.value,
                    'source_plugin': $in.affect_plugin,
                    'source_function': $in.affect_function
                },
                'data_back': {
                    'step': 'step_end',
                    'value': $in.value
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
//# sourceURL=infohub_tools_time.js