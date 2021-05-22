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
function infohub_tools_uuid() {

    'use strict';

// include "infohub_base.js"

    const _Version = function() {
        return {
            'date': '2019-03-31',
            'since': '2018-07-26',
            'version': '1.0.0',
            'checksum': '{{checksum}}',
            'class_name': 'infohub_tools_uuid',
            'note': 'Render a form for testing UUID',
            'status': 'normal',
            'SPDX-License-Identifier': 'GPL-3.0-or-later',
        };
    };

    const _GetCmdFunctions = function() {
        const $list = {
            'create': 'normal',
            'click_handle_uuid': 'normal',
            'click_handle_node_select': 'normal',
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

        const $size = '1';

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
                        'my_text': {
                            'type': 'text',
                            'text': '[h1][titel][/h1]\n [i][ingress][/i]\n',
                        },
                        'titel': {
                            'type': 'common',
                            'subtype': 'value',
                            'data': _Translate('UNIQUE_UNIVERSAL_IDENTIFIER')
                        },
                        'ingress': {
                            'type': 'common',
                            'subtype': 'value',
                            'data': _Translate('YOU_CAN_GENERATE_A_UUID4_FROM_THE_CLIENT_PLUGIN_OR_FROM_THE_SERVER_PLUGIN')
                        },
                        'my_form': {
                            'plugin': 'infohub_renderform',
                            'type': 'form',
                            'content': '[my_select_node][my_select_version]<br>[my_submit_button]<br>[my_textbox_output]<br>[my_clear_button]',
                            'label': 'UUID',
                            'description': _Translate('YOU_CAN_GET_A_UUID4')
                        },
                        'my_select_node': {
                            'plugin': 'infohub_renderform',
                            'type': 'select',
                            "label": "Node",
                            "description": _Translate("WHAT_NODE_PLUGIN_DO_YOU_WANT_TO_PRODUCE_THE_UUIDS?"),
                            'size': $size,
                            'multiple': 'false',
                            'options': [
                                {
                                    'type': 'option',
                                    'value': 'client',
                                    'label': _Translate('CLIENT'),
                                    'selected': 'true',
                                },
                                {
                                    'type': 'option',
                                    'value': 'server',
                                    'label': _Translate('SERVER'),
                                },
                            ],
                            'event_data': 'uuid|handle_node_select',
                            'to_plugin': 'infohub_tools',
                            'to_function': 'click',
                            'custom_variables': {
                                'affect_alias': 'my_select_version',
                                'affect_plugin': 'infohub_uuid',
                                'affect_function': 'get_available_options',
                            },
                        },
                        'my_select_version': {
                            'type': 'form',
                            'subtype': 'select',
                            "label": _Translate("VERSION"),
                            "description": _Translate("WHAT_VERSION_(FLAVOUR)_OF_THE_UUID_DO_YOU_WANT?"),
                            "size": $size,
                            "multiple": "false",
                            'source_node': 'client',
                            'source_plugin': 'infohub_uuid',
                            'source_function': 'get_available_options',
                            'options': [],
                        },
                        'my_submit_button': {
                            'plugin': 'infohub_renderform',
                            'type': 'button',
                            'mode': 'submit',
                            'button_label': _Translate('GET_UUID'),
                            'event_data': 'uuid|handle_uuid|get_uuid',
                            'to_plugin': 'infohub_tools',
                            'to_function': 'click',
                        },
                        'my_textbox_output': {
                            'type': 'form',
                            'subtype': 'textarea',
                            'input_type': 'text',
                            'placeholder': _Translate('WILL_SHOW_THE_UUID'),
                            'class': 'textarea',
                            'css_data': {},
                        },
                        'my_clear_button': {
                            'plugin': 'infohub_renderform',
                            'type': 'button',
                            'mode': 'button',
                            'button_label': _Translate('CLEAR'),
                            'event_data': 'uuid|handle_uuid|clear_my_textbox_output',
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
                    'cache_key': 'uuid',
                },
                'data_back': {'step': 'step_end'},
            });
        }

        return {
            'answer': $in.response.answer,
            'message': $in.response.message,
        };

    };

    /**
     * Handle uuid
     * @version 2018-08-04
     * @since   2018-08-04
     * @author  Peter Lembke
     */
    $functions.push('click_handle_uuid');
    const click_handle_uuid = function($in) {
        const $default = {
            'step': 'step_start',
            'form_data': {},
            'response': {
                'answer': 'false',
                'message': '',
                'data': '',
            },
            'event_data': '',
        };
        $in = _Default($default, $in);

        let $formData = {};

        if ($in.step === 'step_start') {
            $in.step = 'step_get_uuid';
            if ($in.event_data === 'clear_my_textbox_output') {
                $formData = {
                    'my_textbox_output': {'value': '', 'type': 'textarea'},
                };
                $in.step = 'step_display_data';
            }
        }

        if ($in.step === 'step_get_uuid') {
            const $node = _GetData({
                'name': 'form_data/my_select_node/value/0',
                'default': 'client',
                'data': $in,
            });
            const $version = _GetData({
                'name': 'form_data/my_select_version/value/0',
                'default': '100',
                'data': $in,
            });

            const $callServer = {
                'to': {
                    'node': $node,
                    'plugin': 'infohub_uuid',
                    'function': 'uuid',
                },
                'data': {
                    'version': $version,
                    'count': 1,
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
                    'step': 'step_get_uuid_response',
                },
            });

        }

        if ($in.step === 'step_get_uuid_response') {

            $formData = {
                'my_textbox_output': {
                    'value': $in.response.data,
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

    /**
     * In Encrypt when you select a node then one of the select boxes should be hidden
     * @version 2018-08-08
     * @since   2018-08-08
     * @author  Peter Lembke
     */
    $functions.push('click_handle_node_select');
    const click_handle_node_select = function($in) {
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
                'data': '',
            },
        };
        $in = _Default($default, $in);

        if ($in.step === 'step_start') {
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_render',
                    'function': 'render_options',
                },
                'data': {
                    'id': $in.box_id + '_' + $in.affect_alias,
                    'source_node': $in.value,
                    'source_plugin': $in.affect_plugin,
                    'source_function': $in.affect_function,
                },
                'data_back': {
                    'step': 'step_end',
                    'value': $in.value,
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

//# sourceURL=infohub_tools_uuid.js