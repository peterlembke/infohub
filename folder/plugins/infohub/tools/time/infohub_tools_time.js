/**
 * infohub_tools_time
 * Render a form for generating times in different formats
 *
 * @package     Infohub
 * @subpackage  infohub_tools_time
 * @since       2018-08-04
 * @author      Peter Lembke <info@infohub.se>
 * @license     GPL-3.0-or-later
 * @copyright   Copyright (C) 2010- Peter Lembke
 */
function infohub_tools_time() {

    'use strict';

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
            'SPDX-License-Identifier': 'GPL-3.0-or-later',
        };
    };

    const _GetCmdFunctions = function() {
        const $list = {
            'create': 'normal',
            'click_handle_time': 'normal',
            'click_handle_node_select': 'normal',
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
                            'data': _Translate('CURRENT_TIME_IN_DIFFERENT_FORMATS')
                        },
                        'ingress': {
                            'type': 'common',
                            'subtype': 'join',
                            'data0': '<p>' + _Translate('WITH_THIS_TOOL_YOU_CAN_GET_THE_CURRENT_TIME_IN_DIFFERENT_FORMATS') + '.</p><p>',
                            'data1': _Translate('OBSERVE_THAT_THE_SERVER_PHP_PLUGIN_MUST_KNOW_ABOUT_YOUR_TIME_ZONE.'),
                            'data2': _Translate('SEE_THE_DOCUMENTATION_FOR_INFOHUB_TIME_HOW_TO_CHANGE_THAT') + '.</p>'
                        },
                        'my_form': {
                            'plugin': 'infohub_renderform',
                            'type': 'form',
                            'content': '[my_select_node][my_select_time_format]<br>[my_time_button][my_textbox_output][my_clear_button]',
                            'label': _Translate('TIME_FORMAT'),
                            'description': _Translate('SELECT_WHAT_TIME_FORMAT_YOU_WANT_TO_USE')
                        },
                        'my_select_node': {
                            'plugin': 'infohub_renderform',
                            'type': 'select',
                            "label": _Translate("NODE"),
                            "description": _Translate("WHAT_NODE_PLUGIN_DO_YOU_WANT_TO_PRODUCE_THE_CHECKSUM?"),
                            "size": $size,
                            "multiple": "false",
                            "options": [
                                { "type": "option", "value": "client", "label": _Translate("CLIENT"), 'selected': 'true' },
                                { "type": "option", "value": "server", "label": _Translate("SERVER") }
                            ],
                            'event_data': 'time|handle_node_select',
                            'to_plugin': 'infohub_tools',
                            'to_function': 'click',
                            'custom_variables': {
                                'affect_alias': 'my_select_time_format',
                                'affect_plugin': 'infohub_time',
                                'affect_function': 'get_available_options',
                            },
                        },
                        'my_select_time_format': {
                            'type': 'form',
                            'subtype': 'select',
                            "label": _Translate("TIME_FORMAT"),
                            "description": _Translate("WHAT_TIME_FORMAT_DO_YOU_WANT?"),
                            "size": $size,
                            "multiple": "false",
                            "options": [],
                            'source_node': 'client',
                            'source_plugin': 'infohub_time',
                            'source_function': 'get_available_options',
                        },
                        'my_time_button': {
                            'plugin': 'infohub_renderform',
                            'type': 'button',
                            'mode': 'submit',
                            'button_label': _Translate('GET_THE_TIME'),
                            'event_data': 'time|handle_time|get_current_time',
                            'to_plugin': 'infohub_tools',
                            'to_function': 'click',
                        },
                        'my_textbox_output': {
                            'type': 'form',
                            'subtype': 'textarea',
                            'input_type': 'text',
                            'placeholder': _Translate('WILL_SHOW_THE_TIME_IN_THE_RIGHT_FORMAT'),
                            'class': 'textarea',
                            'css_data': {},
                        },
                        'my_clear_button': {
                            'plugin': 'infohub_renderform',
                            'type': 'button',
                            'mode': 'button',
                            'button_label': _Translate('CLEAR'),
                            'event_data': 'time|handle_time|clear_my_textbox_output',
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
                    'cache_key': 'time',
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
     * Handle time
     * @version 2018-08-04
     * @since   2018-08-04
     * @author  Peter Lembke
     */
    $functions.push('click_handle_time');
    const click_handle_time = function($in = {}) {
        const $default = {
            'step': 'step_start',
            'form_data': {},
            'response': {
                'answer': 'false',
                'message': '',
                'data': null,
            },
            'event_data': '',
        };
        $in = _Default($default, $in);

        let $formData = {};

        if ($in.step === 'step_start') {
            $in.step = 'step_get_time';
            if ($in.event_data === 'clear_my_textbox_output') {
                $formData = {
                    'my_textbox_output': {'value': '', 'type': 'textarea'},
                };
                $in.step = 'step_display_data';
            }
        }

        if ($in.step === 'step_get_time') {

            const $node = _GetData({
                'name': 'form_data/my_select_node/value/0',
                'default': 'server',
                'data': $in,
            });
            const $timeFormat = _GetData({
                'name': 'form_data/my_select_time_format/value/0',
                'default': 'timestamp',
                'data': $in,
            });

            const $callServer = {
                'to': {
                    'node': $node,
                    'plugin': 'infohub_time',
                    'function': 'time',
                },
                'data': {
                    'type': $timeFormat,
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
                    'step': 'step_get_time_response',
                },
            });
        }

        if ($in.step === 'step_get_time_response') {
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

    $functions.push('click_handle_node_select');
    /**
     * In Encrypt when you select a node then one of the select boxes should be hidden
     * @version 2018-08-08
     * @since   2018-08-08
     * @author  Peter Lembke
     */
    const click_handle_node_select = function($in = {}) {
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

//# sourceURL=infohub_tools_time.js