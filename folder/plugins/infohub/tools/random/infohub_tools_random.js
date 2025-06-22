/**
 * infohub_tools_random
 * Render a form for generating randoms in different formats
 *
 * @package     Infohub
 * @subpackage  infohub_tools_random
 * @since       2018-08-04
 * @author      Peter Lembke <info@infohub.se>
 * @license     GPL-3.0-or-later
 * @copyright   Copyright (C) 2010- Peter Lembke
 */
function infohub_tools_random() {

    'use strict';

// include "infohub_base.js"

    const _Version = function() {
        return {
            'date': '2019-03-31',
            'since': '2018-08-04',
            'version': '1.0.0',
            'time': '{{time}}',
            'class_name': 'infohub_tools_random',
            'note': 'Render a form for generating randoms in different formats',
            'status': 'normal',
            'SPDX-License-Identifier': 'GPL-3.0-or-later',
        };
    };

    const _GetCmdFunctions = function() {
        const $list = {
            'create': 'normal',
            'click_handle_random': 'normal',
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
                            'data': _Translate('GENERATE_RANDOM_NUMBER')
                        },
                        'ingress': {
                            'type': 'common',
                            'subtype': 'value',
                            'data': _Translate('WITH_THIS_TOOL_YOU_CAN_GET_THE_CURRENT_RANDOM_IN_DIFFERENT_FORMATS')
                        },
                        'my_form': {
                            'plugin': 'infohub_renderform',
                            'type': 'form',
                            'content': '[my_select_node][my_textbox_min][my_textbox_max]<br>[my_random_button][my_textbox_output][my_clear_button]',
                            'label': _Translate('RANDOM_FORMAT'),
                            'description': _Translate('SELECT_WHAT_RANDOM_FORMAT_YOU_WANT_TO_USE')
                        },
                        'my_select_node': {
                            'type': 'form',
                            'subtype': 'select',
                            "label": _Translate("NODE"),
                            "description": _Translate("WHAT_NODE_PLUGIN_DO_YOU_WANT_TO_PRODUCE_THE_CHECKSUM?"),
                            "size": $size,
                            "multiple": "false",
                            "options": [
                                { "type": "option", "value": "client", "label": _Translate("CLIENT"), 'selected': 'true' },
                                { "type": "option", "value": "server", "label": _Translate("SERVER") }
                            ]
                        },
                        'my_textbox_min': {
                            'type': 'form',
                            'subtype': 'text',
                            'input_type': 'text',
                            'placeholder': _Translate('SET_YOUR_MINIMUM_INTEGER_NUMBER'),
                            'class': 'text',
                            'value': '1',
                            'css_data': {},
                            'validator_plugin': 'infohub_validate',
                            'validator_function': 'validate_is_integer',
                        },
                        'my_textbox_max': {
                            'type': 'form',
                            'subtype': 'text',
                            'input_type': 'text',
                            'placeholder': _Translate('SET_YOUR_MAXIMUM_INTEGER_NUMBER'),
                            'class': 'text',
                            'value': '100',
                            'css_data': {},
                            'validator_plugin': 'infohub_validate',
                            'validator_function': 'validate_is_integer',
                        },
                        'my_random_button': {
                            'plugin': 'infohub_renderform',
                            'type': 'button',
                            'mode': 'submit',
                            'button_label': _Translate('GENERATE_RANDOM_NUMBER'),
                            'event_data': 'random|handle_random|get_current_random',
                            'to_plugin': 'infohub_tools',
                            'to_function': 'click',
                        },
                        'my_textbox_output': {
                            'type': 'form',
                            'subtype': 'textarea',
                            'input_type': 'text',
                            'placeholder': _Translate('WILL_SHOW_THE_RANDOM_NUMBER'),
                            'class': 'textarea',
                            'css_data': {},
                        },
                        'my_clear_button': {
                            'plugin': 'infohub_renderform',
                            'type': 'button',
                            'mode': 'button',
                            'button_label': _Translate('CLEAR'),
                            'event_data': 'random|handle_random|clear_my_textbox_output',
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
                    'cache_key': 'random',
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
     * Handle random
     * @version 2018-08-04
     * @since   2018-08-04
     * @author  Peter Lembke
     */
    $functions.push('click_handle_random');
    const click_handle_random = function($in = {}) {
        const $default = {
            'step': 'step_start',
            'box_id': '',
            'form_data': {},
            'response': {
                'answer': 'false',
                'message': '',
                'data': 0.0,
            },
            'event_data': '',
            'data_back': {},
            'ok': 'true',
        };
        $in = _Default($default, $in);

        let $formData = {};

        if ($in.step === 'step_start') {
            $in.step = 'step_get_random';
            if ($in.event_data === 'clear_my_textbox_output') {
                $formData = {
                    'my_textbox_output': {'value': '', 'type': 'textarea'},
                };

                $in.step = 'step_display_data';
            }
        }

        if ($in.step === 'step_get_random') {

            const $node = _GetData({
                'name': 'form_data/my_select_node/value/0',
                'default': 'server',
                'data': $in,
            });
            const $minNumber = parseFloat(_GetData({
                'name': 'form_data/my_textbox_min/value',
                'default': 1.0,
                'data': $in,
            }));
            const $maxNumber = parseFloat(_GetData({
                'name': 'form_data/my_textbox_max/value',
                'default': 100.0,
                'data': $in,
            }));

            const $callServer = {
                'to': {
                    'node': $node,
                    'plugin': 'infohub_random',
                    'function': 'random_number',
                },
                'data': {
                    'min': $minNumber,
                    'max': $maxNumber,
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
                    'box_id': $in.box_id,
                    'step': 'step_get_random_response',
                },
            });

        }

        if ($in.step === 'step_get_random_response') {
            const $data = parseFloat($in.response.data);

            $formData = {
                'my_textbox_output': {
                    'value': $data,
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

//# sourceURL=infohub_tools_random.js