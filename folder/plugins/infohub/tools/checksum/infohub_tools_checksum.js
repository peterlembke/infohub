/**
 * infohub_tools_checksum
 * Render a form for generating checksums
 *
 * @package     Infohub
 * @subpackage  infohub_tools_checksum
 * @since       2018-07-29
 * @author      Peter Lembke <info@infohub.se>
 * @license     GPL-3.0-or-later
 * @copyright   Copyright (C) 2010- Peter Lembke
 */
function infohub_tools_checksum() {

    'use strict';

// include "infohub_base.js"

    const _Version = function() {
        return {
            'date': '2019-03-31',
            'since': '2018-07-29',
            'version': '1.0.0',
            'checksum': '{{checksum}}',
            'class_name': 'infohub_tools_checksum',
            'note': 'Render a form for generating checksums',
            'status': 'normal',
            'SPDX-License-Identifier': 'GPL-3.0-or-later',
        };
    };

    const _GetCmdFunctions = function() {
        const $list = {
            'create': 'normal',
            'click_handle_node_select': 'normal',
            'click_handle_checksum': 'normal',
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
                'message': 'Nothing to report from tools_checksum',
            },
        };
        $in = _Default($default, $in);

        const $size = '1';
        let $text = [];

        if ($in.step === 'step_start') {
            $classTranslations = $in.translations;

            $text[0] = _Translate('YOU_CAN_GENERATE_A_CHECKSUM_FROM_THE_DATA_YOU_ENTER.');
            $text[1] = _Translate('YOU_CAN_SELECT_WHAT_NODE_WILL_GENERATE_THE_CHECKSUM.');
            $text[2] = _Translate('YOU_CAN_SELECT_WHAT_TYPE_OF_CHECKSUM_YOU_WANT.');
            $text[3] = '<a href="https://en.wikipedia.org/wiki/National_identification_number#Sweden" target="_blank">Personnummer</a> ' + _Translate('IS_USED_IN_SWEDEN_AS_A_PERSONAL_IDENTIFIER_OR_A_COMPANY_IDENTIFIER.');
            $text[4] = _Translate('YOU_CAN_ENTER_A_PERSONNUMMER_IN_THIS_FORMAT:') + ' "YYMMDD-NNN".';
            $text[5] = _Translate('YY_=_TWO_DIGIT_YEAR,_MM_=_TWO_DIGIT_MONTH,_DD_=_TWO_DIGIT_DAY_OF_MONTH,');
            $text[6] = _Translate('NNN_=_ANY_THREE_DIGIT_NUMBER.');
            $text[7] = _Translate('THE_CHECKSUM_WILL_CALCULATE_THE_FOURTH_(LAST)_DIGIT.');

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
                            'data': _Translate('CHECKSUM')
                        },
                        'my_presentation_box': {
                            'plugin': 'infohub_rendermajor',
                            'type': 'presentation_box',
                            'head_label': _Translate('CLICK_FOR_INSTRUCTIONS...'),
                            'content_data': '[i][ingress][/i]',
                            'open': 'false',
                        },
                        'ingress': {
                            'type': 'common',
                            'subtype': 'value',
                            'data': $text.join('<br>'),
                        },
                        'my_form': {
                            'plugin': 'infohub_renderform',
                            'type': 'form',
                            'content': '[my_select_node][my_select_method]<br>[my_textbox_input]<br>[my_submit_button]<br>[my_textbox_output]',
                            'label': _Translate('CHECKSUM'),
                            'description': _Translate('SELECT_WHAT_CHECKSUM_METHOD_YOU_WANT_TO_USE')
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
                            'to_plugin': 'infohub_tools',
                            'to_function': 'click',
                            'event_data': 'checksum|handle_node_select',
                            'custom_variables': {
                                'affect_alias': 'my_select_method',
                                'affect_plugin': 'infohub_checksum',
                                'affect_function': 'get_available_options',
                            },
                        },
                        'my_select_method': {
                            'type': 'form',
                            'subtype': 'select',
                            "label": _Translate("CHECKSUM_METHOD"),
                            "description": _Translate("WHAT_TYPE_OF_CHECKSUM_DO_YOU_WANT_TO_CREATE?"),
                            "size": $size,
                            "multiple": "false",
                            'source_node': 'client',
                            'source_plugin': 'infohub_checksum',
                            'source_function': 'get_available_options',
                            'options': [],
                        },
                        'my_textbox_input': {
                            'type': 'form',
                            'subtype': 'text',
                            'input_type': 'text',
                            'placeholder': _Translate('YOUR_DATA_YOU_WANT_A_CHECKSUM_FOR'),
                            'class': 'text',
                            'css_data': {},
                            'validator_plugin': 'infohub_validate',
                            'validator_function': 'validate_has_data',
                        },
                        'my_submit_button': {
                            'plugin': 'infohub_renderform',
                            'type': 'button',
                            'mode': 'submit',
                            'button_label': _Translate('GET_CHECKSUM'),
                            'event_data': 'checksum|handle_checksum',
                            'to_plugin': 'infohub_tools',
                            'to_function': 'click',
                        },
                        'my_textbox_output': {
                            'type': 'form',
                            'subtype': 'text',
                            'input_type': 'text',
                            'placeholder': _Translate('WILL_SHOW_THE_CHECKSUM'),
                            'class': 'text',
                            'css_data': {},
                        },
                    },
                    'how': {
                        'mode': 'one box',
                        'text': '[h1][titel][/h1][my_presentation_box][my_form]',
                    },
                    'where': {
                        'box_id': $in.parent_box_id + '.tools',
                        'max_width': 100,
                        'scroll_to_box_id': 'true',
                    },
                    'cache_key': 'checksum',
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
     * In Encrypt when you select a node then one of the select boxes should be hidden
     * @version 2018-08-08
     * @since   2018-08-08
     * @author  Peter Lembke
     */
    $functions.push('click_handle_node_select');
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

    /**
     * Handle checksum
     * @version 2020-05-17
     * @since   2018-08-04
     * @author  Peter Lembke
     */
    $functions.push('click_handle_checksum');
    const click_handle_checksum = function($in = {}) {
        let $formData = {};

        const $default = {
            'step': 'step_start',
            'form_data': {},
            'response': {
                'answer': 'false',
                'message': '',
                'checksum': '',
            },
        };
        $in = _Default($default, $in);

        if ($in.step === 'step_start') {

            const $node = _GetData({
                'name': 'form_data/my_select_node/value/0',
                'default': 'client',
                'data': $in,
            });

            const $method = _GetData({
                'name': 'form_data/my_select_method/value/0',
                'default': 'md5',
                'data': $in,
            });

            const $input = _GetData({
                'name': 'form_data/my_textbox_input/value',
                'default': '',
                'data': $in,
            });

            const $callServer = {
                'to': {
                    'node': $node,
                    'plugin': 'infohub_checksum',
                    'function': 'calculate_checksum',
                },
                'data': {
                    'type': $method,
                    'value': $input,
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
                    'step': 'step_response',
                },
            });

        }

        if ($in.step === 'step_response') {
            $formData = {
                'my_textbox_output': {'value': $in.response.checksum},
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

//# sourceURL=infohub_tools_checksum.js