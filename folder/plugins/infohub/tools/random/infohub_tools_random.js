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
function infohub_tools_random() {

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

    var _Version = function() {
        return {
            'date': '2019-03-31',
            'since': '2018-08-04',
            'version': '1.0.0',
            'time': '{{time}}',
            'class_name': 'infohub_tools_random',
            'note': 'Render a form for generating randoms in different formats',
            'status': 'normal',
            'license_name': 'GNU GPL 3 or later'
        };
    };

    var _GetCmdFunctions = function() {
        return {
            'create': 'normal',
            'click_handle_random': 'normal'
        };
    };

    var $classTranslations = {};

    /**
     * Translate - Substitute a string for another string using a class local object
     * @param {type} $string
     * @returns string
     */
    $functions.push('_Translate');
    var _Translate = function ($string) 
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
    var create = function ($in)
    {
        "use strict";

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
                            'data': _Translate('Generate random number')
                        },
                        'ingress': {
                            'type': 'common',
                            'subtype': 'value',
                            'data': _Translate('With this tool you can get the current random in different formats')
                        },
                        'my_form': {
                            'plugin': 'infohub_renderform',
                            'type': 'form',
                            'content': '[my_select_node][my_textbox_min][my_textbox_max]<br>[my_random_button][my_message][my_textbox_output][my_clear_button]',
                            'label': _Translate('Random format'),
                            'description': _Translate('Select what random format you want to use')
                        },
                        'my_select_node': {
                            'type': 'form',
                            'subtype': 'select',
                            "label": _Translate("Node"),
                            "description": _Translate("What node plugin do you want to produce the checksum?"),
                            "size": $size,
                            "multiple": "false",
                            "options": [
                                { "type": "option", "value": "client", "label": _Translate("Client"), 'selected': 'true' },
                                { "type": "option", "value": "server", "label": _Translate("Server") }
                            ]
                        },
                        'my_textbox_min': {
                            'type': 'form',
                            'subtype': 'text',
                            'input_type': 'text',
                            'placeholder': _Translate('Set your minimum integer number'),
                            'class': 'text',
                            'value': '1',
                            'css_data': {},
                            'validator_plugin': 'infohub_validate',
                            'validator_function': 'validate_is_integer'
                        },
                        'my_textbox_max': {
                            'type': 'form',
                            'subtype': 'text',
                            'input_type': 'text',
                            'placeholder': _Translate('Set your maximum integer number'),
                            'class': 'text',
                            'value': '100',
                            'css_data': {},
                            'validator_plugin': 'infohub_validate',
                            'validator_function': 'validate_is_integer'
                        },
                        'my_random_button': {
                            'plugin': 'infohub_renderform',
                            'type': 'button',
                            'mode': 'submit',
                            'button_label': _Translate('Generate random number'),
                            'event_data': 'random|handle_random|get_current_random',
                            'to_plugin': 'infohub_tools',
                            'to_function': 'click'
                        },
                        'my_message': {
                            'type': 'common',
                            'subtype': 'container',
                            'tag': 'div',
                            'class': 'container-pretty',
                            'data': _Translate('Message here')
                        },
                        'my_textbox_output': {
                            'type': 'form',
                            'subtype': 'textarea',
                            'input_type': 'text',
                            'placeholder': _Translate('Will show the random number'),
                            'class': 'textarea',
                            'css_data': {}
                        },
                        'my_clear_button': {
                            'plugin': 'infohub_renderform',
                            'type': 'button',
                            'mode': 'button',
                            'button_label': _Translate('Clear'),
                            'event_data': 'random|handle_random|clear_my_textbox_output',
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
     * Handle random
     * @version 2018-08-04
     * @since   2018-08-04
     * @author  Peter Lembke
     */
    $functions.push('click_handle_random');
    var click_handle_random = function ($in)
    {
        "use strict";

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
            $in.step = 'step_get_random';
            if ($in.event_data === 'clear_my_textbox_output') {
                $formData =  {
                    'my_textbox_output': { 'value': '', 'type': 'textarea' }
                };
                $in.step = 'step_display_data';
            }
        }

        if ($in.step === 'step_get_random') {

            const $node = _GetData({'name': 'form_data/my_select_node/value/0', 'default': 'server', 'data': $in });
            const $minNumber = parseFloat(_GetData({'name': 'form_data/my_textbox_min/value', 'default': 1.0, 'data': $in }));
            const $maxNumber = parseFloat(_GetData({'name': 'form_data/my_textbox_max/value', 'default': 100.0, 'data': $in }));

            const $callServer = {
                'to': {
                    'node': $node,
                    'plugin': 'infohub_random',
                    'function': 'random_number'
                },
                'data': {
                    'min': $minNumber,
                    'max': $maxNumber
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
                    'box_id': $in.box_id,
                    'step': 'step_get_random_response'
                }
            });

        }

        if ($in.step === 'step_get_random_response')
        {
            const $data = parseFloat(_GetData({'name': 'response/data', 'default': 0.0, 'data': $in }));
            const $ok = _GetData({'name': 'response/ok', 'default': 'true', 'data': $in });
            $in.data_back.ok = $ok;
            const $responseMessage = _GetData({'name': 'response/message', 'default': '', 'data': $in });
            $in.data_back.response_message = $responseMessage;
            

            $formData =  {
                'my_textbox_output': { 'value': $data, 'type': 'textarea', 'mode': 'add_left' },
            };
            
            $in.step = 'step_display_data';
            if ($ok === 'false') {
                $in.step = 'step_display_message';
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
            'message': 'Finished handle_random',
            'ok': $in.ok
        };
    };


}
//# sourceURL=infohub_tools_random.js