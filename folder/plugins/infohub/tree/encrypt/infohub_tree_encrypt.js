/**
 * Protects your data with encryption before sending it to storage.
 *
 * @author      Peter Lembke <info@infohub.se>
 * @version     2022-03-13
 * @since       2020-07-25
 * @copyright   Copyright (c) 2020, Peter Lembke, CharZam soft
 * @license     https://opensource.org/licenses/gpl-license.php GPL-3.0-or-later
 * @see         https://github.com/peterlembke/infohub/blob/master/folder/plugins/infohub/tree/storage/infohub_tree_storage.md Documentation
 * @link        https://infohub.se/ InfoHub main page
 */
function infohub_tree_encrypt() {

    'use strict';

    const $KEY = 'infohub_tree_encrypt/key';

// include "infohub_base.js"

    const _Version = function() {
        return {
            'date': '2022-03-13',
            'since': '2020-07-25',
            'version': '1.0.1',
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
            'click_export_key_data': 'normal',
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
    const _GetFuncName = function($text = '') {
        let $response = '';
        const $parts = $text.split('_');

        for (let $key in $parts) {
            if ($parts.hasOwnProperty($key) === false) {
                continue;
            }
            $response = $response + $parts[$key].charAt(0).toUpperCase() +
                $parts[$key].substring(1);
        }
        return $response;
    };

    let $classTranslations = {};

    let $classGlobalKeyData = {}; // Object with default key and plugin specific keys

    // ***********************************************************
    // * your class functions below, only declare with var
    // * Can only be reached through cmd()
    // ***********************************************************

    /**
     * The GUI. Create the message to InfoHub View
     * @version 2020-08-24
     * @since   2020-08-24
     * @author  Peter Lembke
     */
    $functions.push('create');
    const create = function($in = {}) {
        const $default = {
            'subtype': 'menu',
            'parent_box_id': '',
            'translations': {},
            'step': 'step_get_box_list',
            'response': {
                'answer': 'false',
                'message': '',
                'responses': []
            },
        };
        $in = _Default($default, $in);

        if ($in.step === 'step_get_box_list') {
            $classTranslations = $in.translations;

            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_view',
                    'function': 'mass_update',
                },
                'data': {
                    'do': [
                        {
                            'func': 'BoxMode',
                            'box_id': $in.parent_box_id + '.form',
                            'box_mode': 'side',
                            'digits': '1',
                        },
                        {
                            'func': 'BoxList',
                            'box_id': $in.parent_box_id + '.form',
                        },
                    ],
                },
                'data_back': {
                    'parent_box_id': $in.parent_box_id,
                    'step': 'step_get_box_list_response',
                },
            });
        }

        if ($in.step === 'step_get_box_list_response') {
            $in.step = 'step_render_boxes';

            let $id = _GetData({'name': 'responses/1/index/import', 'default': '', 'data': $in.response});
            if ($id !== '') {
                $in.step = 'step_end';
            }
        }

        if ($in.step === 'step_render_boxes') {
            $classTranslations = $in.translations;

            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_view',
                    'function': 'mass_update',
                },
                'data': {
                    'do': [
                        {
                            'func': 'BoxMode',
                            'box_id': $in.parent_box_id + '.form',
                            'box_mode': 'side',
                            'digits': '1',
                        },
                        {
                            'func': 'BoxesInsert',
                            'parent_box_id': $in.parent_box_id + '.form',
                            'box_position': 'last',
                            'box_mode': 'data',
                            'box_alias': 'parts',
                            'boxes_data': {
                                'import': 'Import private_key',
                                'forget': 'Forget private_key',
                                'export': 'Export private_key',
                                'create': 'Create new private_key'
                            },
                        },
                    ],
                },
                'data_back': {
                    'parent_box_id': $in.parent_box_id,
                    'step': 'step_render',
                },
            });
        }

        if ($in.step === 'step_render') {

            let $messagesArray = [];

            let $messageOut = _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_render',
                    'function': 'create',
                },
                'data': {
                    'what': {
                        'presentation_import_key': {
                            'plugin': 'infohub_rendermajor',
                            'type': 'presentation_box',
                            'head_label': _Translate('IMPORT_KEY_FILE'),
                            'content_data': '[form_import]',
                        },
                        'form_import': {
                            'plugin': 'infohub_renderform',
                            'type': 'form',
                            'content': '[text_import_password][button_import_key]',
                            'label': '', //_Translate('ONE_CONTACT'),
                            'description': '' // _Translate('THIS_IS_THE_DATA_FORM_FOR_ONE_CONTACT')
                        },
                        'text_import_password': {
                            'plugin': 'infohub_renderform',
                            'type': 'password',
                            'label': '', // _Translate('IMPORT_PASSWORD'),
                            'description': _Translate('YOUR_PASSWORD_FOR_THE_FILE'),
                            'maxlength': '32',
                            'show_characters_left': 'false',
                            'show_generate_password': 'false',
                            'css_data': {
                                'fieldset': 'border: 0px;'
                            }
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
                    },
                    'how': {
                        'mode': 'one box',
                        'text': '[presentation_import_key]',
                    },
                    'where': {
                        'box_id': 'main.body.infohub_tree.form.import', // 'box_id': $in.parent_box_id + '.form',
                        'max_width': 100,
                        'scroll_to_box_id': 'false',
                    },
                    'cache_key': 'import',
                },
                'data_back': {
                    'step': 'step_end',
                },
            });
            $messagesArray.push($messageOut);

            $messageOut = _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_render',
                    'function': 'create',
                },
                'data': {
                    'what': {
                        'button_forget_key': {
                            'plugin': 'infohub_renderform',
                            'type': 'button',
                            'mode': 'button',
                            'button_label': _Translate('FORGET_IMPORTED_KEY'),
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
                    },
                    'how': {
                        'mode': 'one box',
                        'text': '[button_forget_key]',
                    },
                    'where': {
                        'box_id': 'main.body.infohub_tree.form.forget', // 'box_id': $in.parent_box_id + '.form',
                        'max_width': 100,
                        'scroll_to_box_id': 'false',
                    },
                    'cache_key': 'forget',
                },
                'data_back': {
                    'step': 'step_end',
                },
            });
            $messagesArray.push($messageOut);

            $messageOut = _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_render',
                    'function': 'create',
                },
                'data': {
                    'what': {
                        'presentation_export_key': {
                            'plugin': 'infohub_rendermajor',
                            'type': 'presentation_box',
                            'head_label': _Translate('EXPORT_KEY_FILE'),
                            'head_text': _Translate('EXPORT_THE_IMPORTED_KEY_WITH_NEW_PASSWORD'),
                            'content_data': '[form_export]',
                        },
                        'form_export': {
                            'plugin': 'infohub_renderform',
                            'type': 'form',
                            'content': '[text_export_password][button_create_key]',
                            'label': '', //_Translate('ONE_CONTACT'),
                            'description': '' // _Translate('THIS_IS_THE_DATA_FORM_FOR_ONE_CONTACT')
                        },
                        'text_export_password': {
                            'plugin': 'infohub_renderform',
                            'type': 'password',
                            'label': '', //_Translate('EXPORT_PASSWORD'),
                            'description': _Translate('YOUR_PASSWORD_FOR_THE_FILE'),
                            'maxlength': '32',
                            'show_characters_left': 'true',
                            'css_data': {
                                'fieldset': 'border: 0px;'
                            }
                        },
                        'button_create_key': {
                            'plugin': 'infohub_renderform',
                            'type': 'button',
                            'mode': 'submit',
                            'button_label': _Translate('CREATE_KEY_FILE'),
                            'button_left_icon': '[create_icon]',
                            'event_data': 'encrypt|export_key_data',
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
                        'text': '[presentation_export_key]',
                    },
                    'where': {
                        'box_id': 'main.body.infohub_tree.form.export', // 'box_id': $in.parent_box_id + '.form',
                        'max_width': 100,
                        'scroll_to_box_id': 'true',
                    },
                    'cache_key': 'export_existing',
                },
                'data_back': {
                    'step': 'step_end',
                },
            });
            $messagesArray.push($messageOut);

            $messageOut = _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_render',
                    'function': 'create',
                },
                'data': {
                    'what': {
                        'presentation_create_key': {
                            'plugin': 'infohub_rendermajor',
                            'type': 'presentation_box',
                            'head_label': _Translate('CREATE_NEW_KEY_FILE'),
                            'head_text': _Translate('CREATE_NEW_KEY_WITH_NEW_PASSWORD'),
                            'content_data': '[form_create]',
                        },
                        'form_create': {
                            'plugin': 'infohub_renderform',
                            'type': 'form',
                            'content': '[text_create_password][button_create_key]',
                            'label': '', //_Translate('ONE_CONTACT'),
                            'description': '' // _Translate('THIS_IS_THE_DATA_FORM_FOR_ONE_CONTACT')
                        },
                        'text_create_password': {
                            'plugin': 'infohub_renderform',
                            'type': 'password',
                            'label': '', //_Translate('EXPORT_PASSWORD'),
                            'description': _Translate('YOUR_PASSWORD_FOR_THE_FILE'),
                            'maxlength': '32',
                            'show_characters_left': 'true',
                            'css_data': {
                                'fieldset': 'border: 0px;'
                            }
                        },
                        'button_create_key': {
                            'plugin': 'infohub_renderform',
                            'type': 'button',
                            'mode': 'submit',
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
                        'text': '[presentation_create_key]',
                    },
                    'where': {
                        'box_id': 'main.body.infohub_tree.form.create', // 'box_id': $in.parent_box_id + '.form',
                        'max_width': 100,
                        'scroll_to_box_id': 'true',
                    },
                    'cache_key': 'export_new',
                },
                'data_back': {
                    'step': 'step_end',
                },
            });
            $messagesArray.push($messageOut);

            return {
                'answer': 'true',
                'message': 'Sending all rendering messages',
                'messages': $messagesArray,
            };
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
    const click_import_key_data = function($in = {}) {
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
            }
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
    const click_forget_key_data = function($in = {}) {
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
            }
        }

        return {
            'answer': $in.answer,
            'message': $in.message,
            'ok': $ok,
        };
    };

    /**
     * Export the key data in memory with a new password to a file and download it.
     * @version 2021-07-10
     * @since 2021-07-10
     * @author Peter Lembke
     */
    $functions.push('click_export_key_data');
    const click_export_key_data = function($in = {}) {
        const $default = {
            'config': {
                'user_name': ''
            },
            'step': 'step_get_secret',
            'answer': 'false',
            'message': '',
            'response': {}
        };
        $in = _Default($default, $in);

        let $privateSecret = '';

        if ($in.step === 'step_get_secret')
        {
            if (_IsSet($classGlobalKeyData.private_secret) === 'true') {
                $privateSecret = $classGlobalKeyData.private_secret;
                $in.step = 'step_get_password';
            }

            if ($privateSecret === '') {
                $in.message = 'Could not get the private secret from memory';
                $in.step = 'step_end';
            }
        }

        if ($in.step === 'step_get_password') {
            $in.step = 'step_get_password_response';
        }

        if ($in.step === 'step_get_password_response') {

            // Scramble the key with the password

            $in.step = 'step_file_write';
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
     * Create the key data file and download it.
     * @version 2020-09-03
     * @since 2020-09-03
     * @author Peter Lembke
     */
    $functions.push('click_create_key_data');
    const click_create_key_data = function($in = {}) {
        const $default = {
            'config': {
                'user_name': ''
            },
            'form_data': {},
            'step': 'step_get_password',
            'answer': 'false',
            'message': '',
            'response': {},
            'data_back': {
                'has_password': 'false'
            }
        };
        $in = _Default($default, $in);

        let $privateSecret = '';
        let $password = '';

        if ($in.step === 'step_get_password') {
            $password = _GetData({
                'name': 'form_data/text_create_password/value', // example: "response/data/checksum"
                'default': '',
                'data': $in,
            });

            if ($password !== '') {
                $in.data_back.has_password = 'true';
            }

            $in.step = 'step_create_secret';
        }

        if ($in.step === 'step_create_secret')
        {
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_tree_encrypt',
                    'function': 'create_secret'
                },
                'data': {
                    'password': $password
                },
                'data_back': {
                    'has_password': $in.data_back.has_password,
                    'step': 'step_create_secret_response'
                }
            });
        }

        if ($in.step === 'step_create_secret_response')
        {
            const $default = {
                'answer': '',
                'message': '',
                'private_secret': '',
                'password_checksum': ''
            };
            $in.response = _Default($default, $in.response);

            $in.step = 'step_file_write';
            if ($in.response.answer === 'false') {
                $in.response.private_secret = '';
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
                "has_password": $in.data_back.has_password,
                'password_checksum': $in.response.password_checksum,
                "private_secret": $in.response.private_secret
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
     * If you provide a password then the secret is scrambled with that password.-
     * @version 2022-03-13
     * @since 2021-04-03
     * @author Peter Lembke
     */
    $functions.push('create_secret');
    const create_secret = function($in = {}) {
        const $default = {
            'password': '',
            'step': 'step_create_secret',
            'response': {
                'answer': '',
                'message': 'Nothing to report from ' + _GetClassName() + ' -> create_secret',
                'data': '',
                'private_secret_modified': ''
            },
            'data_back': {
                'private_secret_modified': '',
                'password_checksum': ''
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
                    'password': $in.password,
                    'step': 'step_create_secret_response'
                }
            });
        }

        if ($in.step === 'step_create_secret_response')
        {
            $in.step = 'step_private_secret_scramble';
        }

        if ($in.step === 'step_private_secret_scramble')
        {
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_tree_encrypt_password',
                    'function': 'private_secret_scramble'
                },
                'data': {
                    'password': $in.password, // in plain text
                    'private_secret': $in.response.data, // base64 encoded
                },
                'data_back': {
                    'password': $in.password,
                    'step': 'step_private_secret_scramble_response'
                }
            });
        }

        if ($in.step === 'step_private_secret_scramble_response')
        {
            $in.step = 'step_password_checksum';
            $in.data_back.private_secret_modified = $in.response.private_secret_modified;

            if ($in.response.answer === 'false') {
                $in.data_back.private_secret_modified = '';
                $in.step = 'step_end';
            }
        }

        if ($in.step === 'step_password_checksum')
        {
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_checksum',
                    'function': 'password_checksum'
                },
                'data': {
                    'password': $in.password, // in plain text
                    'salt': $in.response.private_secret_modified.substring(0,16),
                    'iterations': 200
                },
                'data_back': {
                    'private_secret_modified': $in.data_back.private_secret_modified,
                    'step': 'step_password_checksum_response'
                }
            });
        }

        if ($in.step === 'step_password_checksum_response')
        {
            $in.data_back.password_checksum = $in.response.data;
        }

        return {
            'answer': $in.response.answer,
            'message': $in.response.message,
            'private_secret': $in.data_back.private_secret_modified,
            'password_checksum': $in.data_back.password_checksum
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
    const encrypt = function($in = {}) {
        const $default = {
            'step': 'step_call_server',
            'box_id': '',
            'response': {},
            'data_back': {},
        };
        $in = _Default($default, $in);

        let $out = {
            'answer': 'false',
            'message': 'Nothing to report from ' + _GetClassName() + ' -> click_button_backup_all',
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
    const decrypt = function($in = {}) {
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