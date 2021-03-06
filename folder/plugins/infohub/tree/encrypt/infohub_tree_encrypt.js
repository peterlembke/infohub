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
function infohub_tree_encrypt() {

    'use strict';

    const $KEY = 'infohub_tree_encrypt/key';

// include "infohub_base.js"

    const _Version = function() {
        return {
            'date': '2020-08-23',
            'since': '2020-07-25',
            'version': '1.0.0',
            'checksum': '{{checksum}}',
            'class_name': 'infohub_tree_encrypt',
            'note': 'Makes sure no one else can read your personal data',
            'status': 'normal',
            'SPDX-License-Identifier': 'GPL-3.0-or-later',
        };
    };

    const _GetCmdFunctions = function() {
        const $list = {
            'create': 'normal',
            'click_import_key_data': 'normal',
            'click_forget_key_data': 'normal',
            'click_create_key_data': 'normal',
            'create_secret': 'normal',
            'encrypt': 'normal',
            'decrypt': 'normal',
        };

        return _GetCmdFunctionsBase($list);
    };

    /**
     * Internal functions must start with a capital letter
     * Used by renderers to get a proper function name
     * @version 2016-10-16
     * @since   2016-10-16
     * @author  Peter Lembke
     * @param $text
     * @return string
     */
    const _GetFuncName = function($text) {
        let $response = '';
        const $parts = $text.split('_');

        for (let $key in $parts) {
            if ($parts.hasOwnProperty($key) === false) {
                continue;
            }
            $response = $response + $parts[$key].charAt(0).toUpperCase() +
                $parts[$key].substr(1);
        }
        return $response;
    };

    let $classTranslations = {};

    let $classGlobalKeyData = {}; // Object with default key and plugin specific keys

    // ***********************************************************
    // * your class functions below, only declare with var
    // * Can only be reached trough cmd()
    // ***********************************************************

    /**
     * The GUI. Create the message to InfoHub View
     * @version 2020-08-24
     * @since   2020-08-24
     * @author  Peter Lembke
     */
    $functions.push('create');
    const create = function($in) {
        const $default = {
            'subtype': 'menu',
            'parent_box_id': '',
            'translations': {},
            'step': 'step_render',
            'response': {
                'answer': 'false',
                'message': '',
            },
        };
        $in = _Default($default, $in);

        if ($in.step === 'step_render') {
            $classTranslations = $in.translations;
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_render',
                    'function': 'create',
                },
                'data': {
                    'what': {
                        'container_encrypt': {
                            'type': 'common',
                            'subtype': 'container',
                            'tag': 'div',
                            'data': '[button_import_key][button_forget_key][button_create_key]',
                            'class': 'container-small',
                        },
                        'button_import_key': {
                            'plugin': 'infohub_renderform',
                            'type': 'file',
                            'button_label': _Translate('IMPORT_KEY_FILE'),
                            'button_left_icon': '[import_icon]',
                            'accept': 'application/json,.json', // https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/file#Unique_file_type_specifiers
                            'event_data': 'encrypt|import_key_data',
                            'to_node': 'client',
                            'to_plugin': 'infohub_tree',
                            'to_function': 'click',
                        },
                        'import_icon': {
                            'type': 'common',
                            'subtype': 'svg',
                            'data': '[import_asset]',
                        },
                        'import_asset': {
                            'plugin': 'infohub_asset',
                            'type': 'icon',
                            'asset_name': 'encrypt/import',
                            'plugin_name': 'infohub_tree',
                        },
                        'button_forget_key': {
                            'plugin': 'infohub_renderform',
                            'type': 'button',
                            'mode': 'button',
                            'button_label': _Translate('FORGET_KEY_FROM_MEMORY_AND_STORAGE'),
                            'button_left_icon': '[delete_icon]',
                            'event_data': 'encrypt|forget_key_data',
                            'to_plugin': 'infohub_tree',
                            'to_function': 'click',
                        },
                        'delete_icon': {
                            'type': 'common',
                            'subtype': 'svg',
                            'data': '[delete_asset]',
                        },
                        'delete_asset': {
                            'plugin': 'infohub_asset',
                            'type': 'icon',
                            'asset_name': 'encrypt/delete',
                            'plugin_name': 'infohub_tree',
                        },
                        'button_create_key': {
                            'plugin': 'infohub_renderform',
                            'type': 'button',
                            'mode': 'button',
                            'button_label': _Translate('CREATE_KEY_FILE'),
                            'button_left_icon': '[create_icon]',
                            'event_data': 'encrypt|create_key_data',
                            'to_plugin': 'infohub_tree',
                            'to_function': 'click',
                        },
                        'create_icon': {
                            'type': 'common',
                            'subtype': 'svg',
                            'data': '[create_asset]',
                        },
                        'create_asset': {
                            'plugin': 'infohub_asset',
                            'type': 'icon',
                            'asset_name': 'encrypt/ping',
                            'plugin_name': 'infohub_tree',
                        }
                    },
                    'how': {
                        'mode': 'one box',
                        'text': '[container_encrypt]',
                    },
                    'where': {
                        'box_id': 'main.body.infohub_tree.form', // 'box_id': $in.parent_box_id + '.form',
                        'max_width': 100,
                        'scroll_to_box_id': 'true',
                    },
                    'cache_key': 'encrypt',
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
     * When you have selected a key file you come here
     * Reads the file and puts the key in a class variable
     * @version 2020-08-23
     * @since 2020-08-23
     * @author Peter Lembke
     */
    $functions.push('click_import_key_data');
    const click_import_key_data = function($in) {
        const $default = {
            'step': 'step_file_read_response',
            'answer': '',
            'message': '',
            'files_data': [],
        };
        $in = _Default($default, $in);

        let $keyData = {},
            $ok = 'false';

        if ($in.step === 'step_file_read_response') {
            $in.step = 'step_check_if_json';
            if ($in.files_data.length !== 1) {
                $in.message = 'One file must be selected';
                $in.step = 'step_end';
            }
        }

        if ($in.step === 'step_check_if_json') {
            $keyData = $in.files_data[0].content;
            $in.step = 'step_store_data';
            if (typeof $keyData !== 'object') {
                $in.message = 'This is not a json file';
                $in.step = 'step_end';
            }

            const $privateObject = {
                "system": '',
                "url": "",
                "user_name": '',
                "created_at": '',
                "note": "",
                "has_password": "false",
                "private_secret": ''
            };
            $keyData = _Default($privateObject, $keyData);

            if ($keyData['system'] !== 'Infohub') {
                $in.message = 'This is not a valid Infohub file';
                $in.step = 'step_end';
            }
        }

        if ($in.step === 'step_store_data') {

            $classGlobalKeyData = $keyData;

            return _SubCall({
                to: {
                    node: 'client',
                    plugin: 'infohub_storage',
                    function: 'write'
                },
                data: {
                    'path': $KEY,
                    'data': $keyData
                },
                data_back: {
                    step: 'step_store_data_response'
                }
            })
        }

        if ($in.step === 'step_store_data_response') {
            if ($in.answer === 'true') {
                $in.message = 'File imported';
                $ok = 'true';
            };
        }

        return {
            'answer': $in.answer,
            'message': $in.message,
            'ok': $ok,
        };
    };

    /**
     * Forget the key data in the $classGlobalKeyData variable.
     * @version 2020-08-23
     * @since 2020-08-23
     * @author Peter Lembke
     */
    $functions.push('click_forget_key_data');
    const click_forget_key_data = function($in) {
        const $default = {
            'answer': 'false',
            'message': 'Nothing to report from infohub_tree_encrypt -> click_forget_key_data',
            'step': 'step_forget'
        };
        $in = _Default($default, $in);

        let $ok = 'false';

        if ($in.step === 'step_forget') {
            $classGlobalKeyData = {};

            return _SubCall({
                to: {
                    node: 'client',
                    plugin: 'infohub_storage',
                    function: 'write'
                },
                data: {
                    'path': $KEY,
                    'data': []
                },
                data_back: {
                    step: 'step_forget_response'
                }
            })
        }

        if ($in.step === 'step_forget_response') {
            if ($in.answer === 'true') {
                $in.message = 'Key data is now forgotten';
                $ok = 'true';
            };
        }

        return {
            'answer': $in.answer,
            'message': $in.message,
            'ok': $ok,
        };
    };

    /**
     * Create the key data file and download it.
     * @version 2020-09-03
     * @since 2020-09-03
     * @author Peter Lembke
     */
    $functions.push('click_create_key_data');
    const click_create_key_data = function($in) {
        const $default = {
            'config': {
                'user_name': ''
            },
            'step': 'step_create_secret',
            'answer': 'false',
            'message': '',
            'response': {}
        };
        $in = _Default($default, $in);

        let $privateSecret = '';

        if ($in.step === 'step_create_secret')
        {
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_tree_encrypt',
                    'function': 'create_secret'
                },
                'data': {},
                'data_back': {
                    'step': 'step_create_secret_response'
                }
            });
        }

        if ($in.step === 'step_create_secret_response')
        {
            const $default = {
                'answer': '',
                'message': '',
                'private_secret': ''
            };
            $in.response = _Default($default, $in.response);

            $in.step = 'step_end';
            if ($in.response.answer === 'true') {
                $in.step = 'step_file_write';
                $privateSecret = $in.response.private_secret;
            }
            if ($privateSecret === '') {
                $in.message = 'Could not create the private secret';
                $in.step = 'step_end';
            }
        }

        if ($in.step === 'step_file_write') {
            const $privateObject = {
                "system": "Infohub",
                "url": "https://github.com/peterlembke/infohub",
                "user_name": $in.config.user_name,
                "created_at": _TimeStamp(),
                "note": "Private encryption key for the Tree plugin to encrypt/decrypt your data before they are sent to the server",
                "has_password": "false",
                "private_secret": $privateSecret
            };

            const $privateJson = _JsonEncode($privateObject);
            const $fileName = 'private_secret.json';

            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_view',
                    'function': 'file_write',
                },
                'data': {
                    'file_name': $fileName,
                    'content': $privateJson,
                },
                'data_back': {
                    'step': 'step_file_write_response',
                },
            });
        }

        if ($in.step === 'step_file_write_response') {
            $in.step = 'step_end';
            if ($in.answer === 'true') {
                $in.message = 'File exported';
            }
        }

        return {
            'answer': $in.answer,
            'message': $in.message,
            'ok': $in.answer
        };
    };

    /**
     * Create private secret
     * The private secret is your encryption key for all your private data
     * The secret is only used by Tree to encrypt/decrypt your Tree data in your
     * browser.
     * @version 2021-04-03
     * @since 2021-04-03
     * @author Peter Lembke
     */
    $functions.push('create_secret');
    const create_secret = function($in) {
        const $default = {
            'step': 'step_create_secret',
            'response': {
                'answer': '',
                'message': 'Nothing to report from ' + _GetClassName() + ' -> create_secret',
                'data': ''
            }
        };
        $in = _Default($default, $in);

        const $secretLength = 2048;

        if ($in.step === 'step_create_secret')
        {
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_random',
                    'function': 'random_byte_string'
                },
                'data': {
                    'count': $secretLength,
                },
                'data_back': {
                    'step': 'step_create_secret_response'
                }
            });
        }

        return {
            'answer': $in.response.answer,
            'message': $in.response.message,
            'private_secret': $in.response.data
        };
    };

    /**
     * Storage send the plain text data to here for encryption
     * You get back a PGP encrypted data that use the $classGlobalKeyData
     * @version 2020-08-29
     * @since 2020-08-29
     * @author Peter Lembke
     */
    $functions.push('encrypt');
    const encrypt = function($in) {
        const $default = {
            'step': 'step_call_server',
            'box_id': '',
            'response': {},
            'data_back': {},
        };
        $in = _Default($default, $in);

        let $out = {
            'answer': 'false',
            'message': 'Nothing to report from ' + _GetClassName() +
                ' -> click_button_backup_all',
        };

        if ($in.step === 'step_call_server') {
        }

        if ($in.step === 'step_call_server_response') {
        }

        return {
            'answer': $out.answer,
            'message': $out.message,
            'ok': $out.answer,
        };
    };

    /**
     * Storage send the encrypted data to here for decryption with the use of $classGlobalKeyData
     * You get back the plain text data.
     * @version 2020-08-29
     * @since 2020-08-29
     * @author Peter Lembke
     */
    $functions.push('decrypt');
    const decrypt = function($in) {
        const $default = {
            'step': 'step_call_server',
            'box_id': '',
            'response': {},
            'data_back': {},
        };
        $in = _Default($default, $in);

        let $out = {
            'answer': 'false',
            'message': 'Nothing to report from ' + _GetClassName() +
                ' -> click_button_backup_all',
        };

        if ($in.step === 'step_call_server') {
        }

        if ($in.step === 'step_call_server_response') {
        }

        return {
            'answer': $out.answer,
            'message': $out.message,
            'ok': $out.answer,
        };
    };

}

//# sourceURL=infohub_tree_encrypt.js