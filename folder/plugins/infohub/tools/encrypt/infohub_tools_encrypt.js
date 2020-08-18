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
function infohub_tools_encrypt() {

    "use strict";

// include "infohub_base.js"

    const _Version = function() {
        return {
            'date': '2019-03-31',
            'since': '2018-07-30',
            'version': '1.0.0',
            'encrypt': '{{encrypt}}',
            'class_name': 'infohub_tools_encrypt',
            'note': 'Render a form for generating encrypts',
            'status': 'normal',
            'SPDX-License-Identifier': 'GPL-3.0-or-later'
        };
    };

    const _GetCmdFunctions = function() {
        const $list = {
            'create': 'normal',
            'click_handle_encrypt': 'normal',
            'click_handle_decrypt': 'normal',
            'click_handle_node_select': 'normal'
        };

        return _GetCmdFunctionsBase($list);
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
     * @version 2019-03-31
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
                            'data': _Translate('Encrypt/decrypt')
                        },
                        'ingress': {
                            'type': 'common',
                            'subtype': 'value',
                            'data': _Translate('This tool can encrypt and decrypt your text')
                        },
                        'my_form': {
                            'plugin': 'infohub_renderform',
                            'type': 'form',
                            'content': '[my_select_node][my_select_method]<br>[my_encryption_key][my_plain_text][my_encrypted_text][my_encrypt_button][my_decrypt_button]',
                            'label': _Translate('Encrypt/Decrypt'),
                            'description': _Translate('Select what encrypt method you want to use')
                        },
                        'my_select_node': {
                            'plugin': 'infohub_renderform',
                            'type': 'select',
                            "label": _Translate("Node"),
                            "description": _Translate("What node plugin do you want to encrypt/decrypt on?"),
                            "size": $size,
                            "multiple": "false",
                            "options": [
                                { "type": "option", "value": "client", "label": _Translate("Client"), 'selected': 'true' },
                                { "type": "option", "value": "server", "label": _Translate("Server") }
                            ],
                            'event_data': 'encrypt|handle_node_select',
                            'to_plugin': 'infohub_tools',
                            'to_function': 'click',
                            'custom_variables': {
                                'affect_alias': 'my_select_method',
                                'affect_plugin': 'infohub_encrypt',
                                'affect_function': 'get_available_options'
                            }
                        },
                        'my_select_method': {
                            'type': 'form',
                            'subtype': 'select',
                            "label": _Translate("Encrypt/decrypt method"),
                            "description": _Translate("What type of encryption method do you want to use?"),
                            "size": $size,
                            "multiple": "false",
                            'source_node': 'client',
                            'source_plugin': 'infohub_encrypt',
                            'source_function': 'get_available_options',
                            "options": [],
                            'css_data': {}
                        },
                        'my_encryption_key': {
                            'type': 'form',
                            'subtype': 'text',
                            'input_type': 'text',
                            'placeholder': _Translate('Encryption key'),
                            'value': 'infohub2010',
                            'class': 'text',
                            'css_data': {},
                            'validator_plugin': 'infohub_validate',
                            'validator_function': 'validate_has_data'
                        },
                        'my_plain_text': {
                            'type': 'form',
                            'subtype': 'textarea',
                            'placeholder': _Translate('Plain text'),
                            'value': _Translate('My plain text')
                        },
                        'my_encrypted_text': {
                            'type': 'form',
                            'subtype': 'textarea',
                            'placeholder': _Translate('Encrypted text')
                        },
                        'my_encrypt_button': {
                            'plugin': 'infohub_renderform',
                            'type': 'button',
                            'mode': 'submit',
                            'button_label': _Translate('Encrypt text'),
                            'event_data': 'encrypt|handle_encrypt',
                            'to_plugin': 'infohub_tools',
                            'to_function': 'click'
                        },
                        'my_decrypt_button': {
                            'plugin': 'infohub_renderform',
                            'type': 'button',
                            'mode': 'submit',
                            'button_label': _Translate('Decrypt text'),
                            'event_data': 'encrypt|handle_decrypt',
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
                    },
                    'cache_key': 'encrypt'
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
     * Handle encrypt
     * @version 2018-08-04
     * @since   2018-08-04
     * @author  Peter Lembke
     */
    $functions.push('click_handle_encrypt');
    const click_handle_encrypt = function ($in)
    {
        const $default = {
            'step': 'step_start',
            'form_data': {},
            'response': {
                'answer': 'false',
                'message': '',
                'data': ''
            }
        };
        $in = _Default($default, $in);

        let $formData = {};

        if ($in.step === 'step_start')
        {
            const $node = _GetData({'name': 'form_data/my_select_node/value/0', 'default': 'server', 'data': $in });
            const $method = _GetData({'name': 'form_data/my_select_method/value/0', 'default': 'pgp', 'data': $in });
            const $plainText = _GetData({'name': 'form_data/my_plain_text/value', 'default': 'Hello friend', 'data': $in });
            const $encryptionKey = _GetData({'name': 'form_data/my_encryption_key/value', 'default': 'infohub2010', 'data': $in });

            const $callServer = {
                'to': {
                    'node': $node,
                    'plugin': 'infohub_encrypt',
                    'function': 'encrypt'
                },
                'data': {
                    'text': $plainText,
                    'password': $encryptionKey,
                    'method': $method
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
                    'step': 'step_response'
                }
            });

        }

        if ($in.step === 'step_response') {
            $formData =  {
                'my_encrypted_text': { 'value': $in.response.data }
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
     * Handle decrypt
     * @version 2018-08-04
     * @since   2018-08-04
     * @author  Peter Lembke
     */
    $functions.push('click_handle_decrypt');
    const click_handle_decrypt = function ($in)
    {
        const $default = {
            'step': 'step_start',
            'form_data': {},
            'response': {
                'answer': 'false',
                'message': '',
                'data': ''
            }
        };
        $in = _Default($default, $in);

        let $formData = {};

        if ($in.step === 'step_start')
        {
            const $node = _GetData({'name': 'form_data/my_select_node/value/0', 'default': 'server', 'data': $in });
            const $method = _GetData({'name': 'form_data/my_select_method/value/0', 'default': 'pgp', 'data': $in });
            const $encryptedText = _GetData({'name': 'form_data/my_encrypted_text/value', 'default': '', 'data': $in });
            const $encryptionKey = _GetData({'name': 'form_data/my_encryption_key/value', 'default': 'infohub2010', 'data': $in });

            const $callServer = {
                'to': {
                    'node': $node,
                    'plugin': 'infohub_encrypt',
                    'function': 'decrypt'
                },
                'data': {
                    'encrypted_text': $encryptedText,
                    'password': $encryptionKey,
                    'method': $method
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
                    'step': 'step_response'
                }
            });

        }

        if ($in.step === 'step_response') {
            $formData =  {
                'my_plain_text': { 'value': $in.response.data }
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
//# sourceURL=infohub_tools_encrypt.js