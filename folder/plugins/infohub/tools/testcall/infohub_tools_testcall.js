/**
 * infohub_tools_testcall
 * Write calls to trigger functions
 *
 * @package     Infohub
 * @subpackage  infohub_tools_testcall
 * @since       2019-07-10
 * @author      Peter Lembke <info@infohub.se>
 * @license     GPL-3.0-or-later
 * @copyright   Copyright (C) 2010- Peter Lembke
 */
function infohub_tools_testcall() {

    'use strict';

// include "infohub_base.js"

    const _Version = function() {
        return {
            'date': '2019-07-11',
            'since': '2019-07-10',
            'version': '1.0.0',
            'checksum': '{{checksum}}',
            'class_name': 'infohub_tools_testcall',
            'note': 'Write calls to trigger functions',
            'status': 'normal',
            'SPDX-License-Identifier': 'GPL-3.0-or-later',
        };
    };

    const _GetCmdFunctions = function() {
        const $list = {
            'create': 'normal',
            'click_select_template': 'normal',
            'click_button_send': 'normal',
            'get_available_options': 'normal',
            'click_select_demo': 'normal',
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
     * @version 2019-07-10
     * @since   2019-07-10
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
                'message': 'Nothing to report from tools_testcall',
            },
        };
        $in = _Default($default, $in);

        const $size = '1';
        let $text = [];

        if ($in.step === 'step_start') {
            $classTranslations = $in.translations;

            $text[0] = _Translate('WITH_THIS_TOOL_YOU_CAN_WRITE_TEST_CALLS_AND_TRIGGER_FUNCTIONS.');
            $text[1] = _Translate('PRACTICAL_IF_YOU_WANT_TO_DEBUG_A_SPECIFIC_FUNCTION.');

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
                            'data': _Translate('TEST_CALL')
                        },
                        'box_instructions': {
                            'plugin': 'infohub_rendermajor',
                            'type': 'presentation_box',
                            'head_label': _Translate('CLICK_FOR_INSTRUCTIONS...'),
                            'content_data': '[i][ingress][/i]',
                            'open': 'true',
                        },
                        'ingress': {
                            'type': 'common',
                            'subtype': 'value',
                            'data': $text.join('<br>'),
                        },
                        'form_testcall': {
                            'plugin': 'infohub_renderform',
                            'type': 'form',
                            'content': '[select_template]<br>[text_testcall]<br>[button_send]<br>[text_response]',
                            'label': _Translate('TEST_CALL'),
                            'description': _Translate('WRITE_YOUR_TEST_CALL_AND_SEND_IT'),
                            'css_data': {
                                // '.form': 'min-width:640px;'
                            },
                        },
                        'select_template': {
                            'plugin': 'infohub_renderform',
                            'type': 'select',
                            "label": _Translate("TEMPLATE_CALL"),
                            "description": _Translate("SELECT_A_TEMPLATE_FOR_THE_CALL_YOU_WANT"),
                            "size": $size,
                            "multiple": "false",
                            'source_node': 'client',
                            'source_plugin': 'infohub_tools',
                            'source_function': 'get_available_options',
                            'options': [],
                            'to_plugin': 'infohub_tools',
                            'to_function': 'click',
                            'event_data': 'testcall|select_template',
                        },
                        'text_testcall': {
                            'type': 'form',
                            'subtype': 'textarea',
                            'input_type': 'text',
                            'placeholder': _Translate('THE_CALL_YOU_WANT_TO_MAKE'),
                            'class': 'textarea',
                            'css_data': {},
                            'rows': 12,
                            'resize': 'both',
                        },
                        'button_send': {
                            'plugin': 'infohub_renderform',
                            'type': 'button',
                            'mode': 'submit',
                            'button_label': _Translate('SEND'),
                            'event_data': 'testcall|button_send',
                            'to_plugin': 'infohub_tools',
                            'to_function': 'click',
                        },
                        'text_response': {
                            'type': 'form',
                            'subtype': 'textarea',
                            'input_type': 'text',
                            'placeholder': _Translate('RESPONSE'),
                            'class': 'textarea',
                            'css_data': {},
                            'rows': 20,
                            'resize': 'both',
                        },
                        'demo': {
                            'type': 'common',
                            'subtype': 'container',
                            'tag': 'div',
                            'data': 'This is a place holder for the GUI demo',
                        },
                    },
                    'how': {
                        'mode': 'one box',
                        'text': '[h1][titel][/h1][box_instructions][form_testcall]<br>[demo]',
                    },
                    'where': {
                        'box_id': $in.parent_box_id + '.tools',
                        'max_width': 100,
                        'scroll_to_box_id': 'true',
                    },
                    'cache_key': 'testcall',
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
     * Select a template in the select box and end up here. The template will be shown in "text_testcall"
     * @version 2019-07-10
     * @since   2019-07-10
     * @author  Peter Lembke
     */
    $functions.push('click_select_template');
    const click_select_template = function($in = {}) {
        const $default = {
            'step': 'step_start',
            'value': '',
            'box_id': '',
            'config': {},
        };
        $in = _Default($default, $in);

        if ($in.step === 'step_start') {
            const $call = _JsonEncode(_GetData({
                'name': $in.value,
                'default': $in.config.client_call,
                'data': $in.config,
            }));

            const $formData = {
                'text_testcall': {'value': $call},
            };

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
            'answer': 'true',
            'message': 'Handled the template select',
            'ok': 'true',
        };
    };

    /**
     * Send the call
     * @version 2019-07-10
     * @since   2019-07-10
     * @author  Peter Lembke
     */
    $functions.push('click_button_send');
    const click_button_send = function($in = {}) {
        const $default = {
            'step': 'step_start',
            'box_id': '',
            'form_data': {},
            'response': {},
            'config': {},
        };
        $in = _Default($default, $in);

        let $formData = {};

        if ($in.step === 'step_start') {
            const $out = _GetData({
                'name': 'form_data/text_testcall/value',
                'default': $in.config.client_call,
                'data': $in,
            });

            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_tools',
                    'function': 'call_server',
                },
                'data': {
                    'send_data': _JsonDecode($out),
                },
                'data_back': {
                    'step': 'step_response',
                },
            });

        }

        if ($in.step === 'step_response') {

            const $value = _JsonEncode($in);

            $formData = {
                'text_response': {'value': $value},
            };

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

        let $ok = 'true';
        if ($in.step === 'step_end') {
            if ($in.response.answer === 'false') {
                $ok = 'false';
            }
        }

        return {
            'answer': 'true',
            'message': 'Finished click_button_compress',
            'ok': $ok,
        };
    };

    /**
     * Get list with config examples you can use
     * @version 2021-09-05
     * @since   2019-07-11
     * @author  Peter Lembke
     * @param array $in
     * @return array
     */
    $functions.push('get_available_options');
    const get_available_options = function($in = {}) {
        const $default = {
            'config': {},
        };
        $in = _Default($default, $in);

        let $options = [
            {'type': 'option', 'value': 'select', 'label': 'Select...'},
        ];

        for (let $key in $in.config) {
            if ($in.config.hasOwnProperty($key) === false) {
                continue;
            }

            let $to = _GetData({
                'name': 'config/' + $key + '/to', // example: "response/data/checksum"
                'default': {}, // example: ""
                'data': $in, // an object with data where you want to pull out a part of it
            });

            if (_Empty($to) === 'true') {
                continue;
            }

            const $option = {
                'type': 'option',
                'value': $key,
                'label': $key,
            };
            $options.push($option);
        }

        return {
            'answer': 'true',
            'message': 'List of valid compression methods.',
            'options': $options,
        };
    };

    /**
     * Select a demo and get at text box updated
     * @version 2019-07-11
     * @since   2019-07-11
     * @author  Peter Lembke
     */
    $functions.push('click_select_demo');
    const click_select_demo = function($in = {}) {
        const $default = {
            'step': 'step_start',
            'value': '',
            'box_id': '',
            'config': {},
        };
        $in = _Default($default, $in);

        if ($in.step === 'step_start') {
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_view',
                    'function': 'set_text',
                },
                'data': {
                    'id': 'main.body.infohub_tools.tools.[demo_text_demo]',
                    'text': $in.value,
                },
                'data_back': {
                    'step': 'step_end',
                },
            });
        }

        return {
            'answer': 'true',
            'message': 'Handled the demo select',
            'ok': 'true',
        };
    };
}

//# sourceURL=infohub_tools_testcall.js