/**
 * infohub_tools_compress
 * Render a form for testing compression of data
 *
 * @package     Infohub
 * @subpackage  infohub_tools_compress
 * @since       2019-07-03
 * @author      Peter Lembke <info@infohub.se>
 * @license     GPL-3.0-or-later
 * @copyright   Copyright (C) 2010- Peter Lembke
 */
function infohub_tools_compress() {

    'use strict';

// include "infohub_base.js"

    const _Version = function() {
        return {
            'date': '2019-07-08',
            'since': '2019-07-03',
            'version': '1.0.0',
            'checksum': '{{checksum}}',
            'class_name': 'infohub_tools_compress',
            'note': 'Render a form for testing compression of data',
            'status': 'normal',
            'SPDX-License-Identifier': 'GPL-3.0-or-later',
        };
    };

    const _GetCmdFunctions = function() {
        const $list = {
            'create': 'normal',
            'click_handle_node_select': 'normal',
            'click_button_compress': 'normal',
            'click_button_decompress': 'normal',
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

            $text[0] = _Translate('YOU_CAN_WRITE_YOUR_TEXT_IN_THE_TEXT_BOX_:_COMPRESS_THE_DATA.');
            $text[1] = _Translate('YOU_CAN_SELECT_WHAT_NODE_AND_METHOD_YOU_WANT_TO_USE_TO_COMPRESS_THE_DATA.');
            $text[2] = _Translate('CLICK_THE_BUTTON:_COMPRESS._CLICK_ON:_DECOMPRESS,_TO_SEE_THE_RESULT.');
            $text[3] = _Translate('REMOVE_THE_TEXT_YOU_WROTE._NOW_CLICK_THE_BUTTON:_DECOMPRESS.');

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
                            'data': _Translate('COMPRESS')
                        },
                        'box_instructions': {
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
                        'form_compress': {
                            'plugin': 'infohub_renderform',
                            'type': 'form',
                            'content': '[text_decompressed_data]<br>[select_compression_node][select_compression_method][button_compress]<br>[text_compress_output]',
                            'label': _Translate('COMPRESS'),
                            'description': _Translate('COMPRESS_THE_DATA')
                        },
                        'text_decompressed_data': {
                            'type': 'form',
                            'subtype': 'textarea',
                            'input_type': 'text',
                            'placeholder': _Translate('YOUR_DECOMPRESSED_DATA'),
                            'class': 'textarea',
                            'css_data': {},
                        },
                        'select_compression_node': {
                            'plugin': 'infohub_renderform',
                            'type': 'select',
                            "label": _Translate("COMPRESSION_NODE"),
                            "description": _Translate("WHAT_NODE_SHOULD_COMPRESS_YOUR_DATA?"),
                            "size": $size,
                            "multiple": "false",
                            "options": [
                                { "type": "option", "value": "client", "label": _Translate("CLIENT"), 'selected': 'true' },
                                { "type": "option", "value": "server", "label": _Translate("SERVER") }
                            ],
                            'to_plugin': 'infohub_tools',
                            'to_function': 'click',
                            'event_data': 'compress|handle_node_select',
                            'custom_variables': {
                                'affect_alias': 'select_compression_method',
                                'affect_plugin': 'infohub_compress',
                                'affect_function': 'get_available_options',
                            },
                        },
                        'select_compression_method': {
                            'plugin': 'infohub_renderform',
                            'type': 'select',
                            "label": _Translate("COMPRESSION_METHOD"),
                            "description": _Translate("WHAT_COMPRESSION_METHOD_DO_YOU_WANT_TO_USE?"),
                            "size": $size,
                            "multiple": "false",
                            'source_node': 'client',
                            'source_plugin': 'infohub_compress',
                            'source_function': 'get_available_options',
                            'options': [],
                        },
                        'button_compress': {
                            'plugin': 'infohub_renderform',
                            'type': 'button',
                            'mode': 'submit',
                            'button_label': _Translate('COMPRESS'),
                            'event_data': 'compress|button_compress',
                            'to_plugin': 'infohub_tools',
                            'to_function': 'click',
                        },
                        'text_compress_output': {
                            'type': 'form',
                            'subtype': 'textarea',
                            'input_type': 'text',
                            'placeholder': _Translate('WILL_SHOW_THE_RESULT'),
                            'class': 'textarea',
                            'css_data': {},
                        },
                        'form_decompress': {
                            'plugin': 'infohub_renderform',
                            'type': 'form',
                            'content': '[text_compressed_data]<br>[select_decompression_node][select_decompression_method][button_decompress]<br>[text_decompress_output]',
                            'label': _Translate('DECOMPRESS'),
                            'description': _Translate('DECOMPRESS_THE_DATA'),
                            'open': 'false'
                        },
                        'text_compressed_data': {
                            'type': 'form',
                            'subtype': 'textarea',
                            'input_type': 'text',
                            'placeholder': _Translate('YOUR_COMPRESSED_DATA'),
                            'class': 'textarea',
                            'css_data': {},
                        },
                        'select_decompression_node': {
                            'plugin': 'infohub_renderform',
                            'type': 'select',
                            "label": _Translate("DECOMPRESSION_NODE"),
                            "description": _Translate("WHAT_NODE_SHOULD_DECOMPRESS_YOUR_DATA?"),
                            "size": $size,
                            "multiple": "false",
                            "options": [
                                { "type": "option", "value": "client", "label": _Translate("CLIENT"), 'selected': 'true' },
                                { "type": "option", "value": "server", "label": _Translate("SERVER") }
                            ],
                            'to_plugin': 'infohub_tools',
                            'to_function': 'click',
                            'event_data': 'compress|handle_node_select',
                            'custom_variables': {
                                'affect_alias': 'select_decompression_method',
                                'affect_plugin': 'infohub_compress',
                                'affect_function': 'get_available_options',
                            },
                        },
                        'select_decompression_method': {
                            'plugin': 'infohub_renderform',
                            'type': 'select',
                            "label": _Translate("DECOMPRESSION_METHOD"),
                            "description": _Translate("WHAT_DECOMPRESSION_METHOD_DO_YOU_WANT_TO_USE?"),
                            "size": $size,
                            "multiple": "false",
                            'source_node': 'client',
                            'source_plugin': 'infohub_compress',
                            'source_function': 'get_available_options',
                            'options': [],
                        },
                        'button_decompress': {
                            'plugin': 'infohub_renderform',
                            'type': 'button',
                            'mode': 'submit',
                            'button_label': _Translate('DECOMPRESS'),
                            'event_data': 'compress|button_decompress',
                            'to_plugin': 'infohub_tools',
                            'to_function': 'click',
                        },
                        'text_decompress_output': {
                            'type': 'form',
                            'subtype': 'textarea',
                            'input_type': 'text',
                            'placeholder': _Translate('WILL_SHOW_THE_RESULT'),
                            'class': 'textarea',
                            'css_data': {},
                        },
                    },
                    'how': {
                        'mode': 'one box',
                        'text': '[h1][titel][/h1][box_instructions][form_compress][form_decompress]',
                    },
                    'where': {
                        'box_id': $in.parent_box_id + '.tools',
                        'max_width': 100,
                        'scroll_to_box_id': 'true',
                    },
                    'cache_key': 'compress',
                },
                'data_back': {
                    'step': 'step_form_data',
                },
            });
        }

        if ($in.step === 'step_form_data') {
            const $formData = {
                'text_decompressed_data': {'value': 'hello'},
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
            'answer': $in.response.answer,
            'message': $in.response.message,
        };
    };

    /**
     * When you select a node then the method select box should be updated
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
                    'id': $in.box_id + '_' + $in.affect_alias + '_form_element',
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
     * In Encrypt when you select a node then one of the select boxes should be hidden
     * @version 2018-08-08
     * @since   2018-08-08
     * @author  Peter Lembke
     */
    $functions.push('click_button_compress');
    const click_button_compress = function($in = {}) {
        const $default = {
            'step': 'step_start',
            'box_id': '',
            'form_data': {},
            'response': {
                'answer': 'false',
                'message': '',
                'compressed_data': '',
            },
        };
        $in = _Default($default, $in);

        let $formData = {};

        if ($in.step === 'step_start') {
            const $node = _GetData({
                'name': 'form_data/select_compression_node/value/0',
                'default': 'client',
                'data': $in,
            });
            const $method = _GetData({
                'name': 'form_data/select_compression_method/value/0',
                'default': 'gzip',
                'data': $in,
            });
            const $input = _GetData({
                'name': 'form_data/text_decompressed_data/value',
                'default': '',
                'data': $in,
            });

            const $callServer = {
                'to': {
                    'node': $node,
                    'plugin': 'infohub_compress',
                    'function': 'compress',
                },
                'data': {
                    'compression_method': $method,
                    'decompressed_data': $input,
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

            const $compressedData = $in.response.compressed_data;
            delete ($in.response.compressed_data);
            delete ($in.response.func);
            const $value = _JsonEncode($in.response);

            $formData = {
                'text_compress_output': {'value': $value},
                'text_compressed_data': {'value': $compressedData},
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
     * Handle checksum
     * @version 2018-08-04
     * @since   2018-08-04
     * @author  Peter Lembke
     */
    $functions.push('click_button_decompress');
    const click_button_decompress = function($in = {}) {
        const $default = {
            'step': 'step_start',
            'box_id': '',
            'form_data': {},
            'response': {
                'answer': 'false',
                'message': '',
                'decompressed_data': '',
            },
        };
        $in = _Default($default, $in);

        let $formData = {};

        if ($in.step === 'step_start') {
            const $node = _GetData({
                'name': 'form_data/select_decompression_node/value/0',
                'default': 'client',
                'data': $in,
            });
            const $method = _GetData({
                'name': 'form_data/select_decompression_method/value/0',
                'default': 'gzip',
                'data': $in,
            });
            const $input = _GetData({
                'name': 'form_data/text_compressed_data/value',
                'default': '',
                'data': $in,
            });

            const $callServer = {
                'to': {
                    'node': $node,
                    'plugin': 'infohub_compress',
                    'function': 'decompress',
                },
                'data': {
                    'compression_method': $method,
                    'compressed_data': $input,
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

            const $decompressedData = $in.response.decompressed_data;
            delete ($in.response.decompressed_data);
            delete ($in.response.func);
            const $value = _JsonEncode($in.response);

            $formData = {
                'text_decompress_output': {'value': $value},
                'text_decompressed_data': {'value': $decompressedData},
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

//# sourceURL=infohub_tools_compress.js