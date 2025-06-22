/**
 * infohub_login_password
 * Change local password on the shared_secret and private_secret
 *
 * @package     Infohub
 * @subpackage  infohub_login_password
 * @since       2019-09-02
 * @author      Peter Lembke <info@infohub.se>
 * @license     GPL-3.0-or-later
 * @copyright   Copyright (C) 2010- Peter Lembke
 * @see         https://github.com/peterlembke/infohub/blob/main/folder/plugins/infohub/login/password/infohub_login_password.md Documentation
 * @link        https://infohub.se/ InfoHub main page
 */
function infohub_login_password() {

    'use strict';

// include "infohub_base.js"

    const _Version = function() {
        return {
            'date': '2020-04-26',
            'since': '2019-09-02',
            'version': '1.0.1',
            'checksum': '{{checksum}}',
            'class_name': 'infohub_login_password',
            'note': 'Change local password on the shared_secret and private_secret',
            'status': 'normal',
            'SPDX-License-Identifier': 'GPL-3.0-or-later',
        };
    };

    const _GetCmdFunctions = function() {
        const $list = {
            'create': 'normal',
            'click_password_change': 'normal',
            'shared_secret_scramble': 'normal',
            'shared_secret_restore': 'normal',
        };

        return _GetCmdFunctionsBase($list);
    };

    let $classTranslations = {};

    // ***********************************************************
    // * your class functions below, only declare with var
    // * Can only be reached through cmd()
    // ***********************************************************

    $functions.push('create');
    /**
     * Get instructions and create the message to InfoHub View
     * @version 2019-09-03
     * @since   2019-09-03
     * @author  Peter Lembke
     * @param $in
     * @returns {{answer: *, message: *}|{}}
     */
    const create = function($in = {}) {
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
                        'container_password': {
                            'type': 'common',
                            'subtype': 'container',
                            'tag': 'div',
                            'data': '[form_password]',
                            'class': 'container-small',
                        },
                        'form_password': {
                            'plugin': 'infohub_renderform',
                            'type': 'form',
                            'content': '[text_current_password][text_new_password][button_change]',
                            'label': _Translate('SET_A_PASSWORD'),
                            'description': _Translate('WHEN_YOU_SET_A_LOCAL_PASSWORD_THEN_YOU_SCRAMBLE_THE_SHARED_SECRET_SO_THAT_IT_REQUIRES_YOUR_PASSWORD_TO_WORK')
                        },
                        'text_current_password': {
                            'plugin': 'infohub_renderform',
                            'type': 'password',
                            'label': _Translate('YOUR_CURRENT_PASSWORD'),
                            'description': _Translate('LEAVE_BLANK_IF_YOU_HAVE_NOT_SET_ANY_PASSWORD'),
                            'maxlength': '30',
                            'show_characters_left': 'false',
                            'show_generate_password': 'false',
                            'css_data': {
                                'fieldset': 'border: 0px;'
                            }
                        },
                        'text_new_password': {
                            'plugin': 'infohub_renderform',
                            'type': 'password',
                            'label': _Translate('YOUR_NEW_PASSWORD'),
                            'description': _Translate('YOU_CAN_LEAVE_THIS_BLANK_IF_YOU_WANT_TO_REMOVE_THE_PASSWORD'),
                            'maxlength': '30',
                            'show_characters_left': 'true',
                            'show_generate_password': 'true',
                            'show_view_password': 'true',
                            'css_data': {
                                'fieldset': 'border: 0px;'
                            }
                        },
                        'button_change': {
                            'plugin': 'infohub_renderform',
                            'type': 'button',
                            'mode': 'button',
                            'button_label': _Translate('CHANGE_THE_PASSWORD'),
                            'event_data': 'password|password_change',
                            'to_plugin': 'infohub_login',
                            'to_function': 'click',
                        },
                    },
                    'how': {
                        'mode': 'one box',
                        'text': '[container_password]',
                    },
                    'where': {
                        'box_id': 'main.body.infohub_login.form', // 'box_id': $in.parent_box_id + '.form',
                        'max_width': 100,
                        'scroll_to_box_id': 'true',
                    },
                    'cache_key': 'password',
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

    $functions.push('click_password_change');
    /**
     * You clicked the button to change local_password on your shared_secret
     * @version 2019-09-12
     * @since 2019-09-03
     * @author Peter Lembke
     * @param $in
     * @returns {{answer: *, message: *, ok: (string)}}
     */
    const click_password_change = function($in = {}) {
        const $default = {
            'box_id': '',
            'step': 'step_get_contact',
            'response': {
                'answer': 'true',
                'message': 'Done',
                'data': {},
                'form_data': {},
                'ok': 'true',
            },
            'data_back': {
                'contact': {},
                'form_data': {},
            },
        };
        $in = _Default($default, $in);

        let $sharedSecret = '';

        if ($in.step === 'step_get_contact') {
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_login_contact',
                    'function': 'storage_read_contact_data',
                },
                'data': {},
                'data_back': {
                    'box_id': $in.box_id,
                    'step': 'step_get_contact_response',
                    'contact': $in.data_back.contact,
                    'form_data': $in.data_back.form_data,
                },
            });
        }

        if ($in.step === 'step_get_contact_response') {
            $in.step = 'step_end';
            if ($in.response.answer === 'true') {
                $in.data_back.contact = $in.response.data;
                $in.step = 'step_form_read';
            }
        }

        if ($in.step === 'step_form_read') {
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_view',
                    'function': 'form_read',
                },
                'data': {
                    'id': $in.box_id + '_form_password_form',
                },
                'data_back': {
                    'box_id': $in.box_id,
                    'step': 'step_form_read_response',
                    'contact': $in.data_back.contact,
                    'form_data': $in.data_back.form_data,
                },
            });
        }

        if ($in.step === 'step_form_read_response') {
            $in.step = 'step_end';

            if ($in.response.answer === 'true') {
                $in.step = 'step_modify_shared_secret';

                $in.data_back.form_data = $in.response.form_data;

                $sharedSecret = _GetData({
                    'name': 'data_back/contact/shared_secret',
                    'default': '',
                    'data': $in,
                });

                if (_Empty($sharedSecret) === 'true') {
                    $in.response.message = 'Shared secret is empty. Please first import a contact';
                    $in.response.ok = 'false';
                    $in.step = 'step_end';
                }
            }
        }

        if ($in.step === 'step_modify_shared_secret') {
            const $currentPassword = _GetData({
                'name': 'data_back/form_data/text_current_password/value',
                'default': '',
                'data': $in,
            });

            if (_Empty($currentPassword) === 'false') {
                let $response = internal_Cmd({
                    'func': 'ModifySharedSecret',
                    'password': $currentPassword,
                    'shared_secret': $sharedSecret,
                    'mode': 'restore',
                });
                $sharedSecret = $response.data;
            }

            const $newPassword = _GetData({
                'name': 'data_back/form_data/text_new_password/value',
                'default': '',
                'data': $in,
            });

            let $hasPassword = 'false';
            if (_Empty($newPassword) === 'false') {
                let $response = internal_Cmd({
                    'func': 'ModifySharedSecret',
                    'password': $newPassword,
                    'shared_secret': $sharedSecret,
                    'mode': 'scramble',
                });
                $sharedSecret = $response.data;
                $hasPassword = 'true';
            }

            $in.data_back.contact.shared_secret = $sharedSecret;
            $in.data_back.contact.has_password = $hasPassword;

            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_login_contact',
                    'function': 'storage_write_contact_data',
                },
                'data': {
                    'data': $in.data_back.contact,
                },
                'data_back': {
                    'box_id': $in.box_id,
                    'step': 'step_modify_shared_secret_response',
                    'contact': $in.data_back.contact,
                    'form_data': $in.data_back.form_data,
                },
            });
        }

        if ($in.step === 'step_modify_shared_secret_response') {
            $in.step = 'step_end';
            if ($in.response.answer === 'true') {
                $in.response.ok = 'true';
                $in.step = 'step_refresh_contact_view';
            }
        }

        if ($in.step === 'step_refresh_contact_view') {
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_login_contact',
                    'function': 'view_contact',
                },
                'data': {},
                'data_back': {
                    'step': 'step_refresh_contact_view_response',
                },
            });
        }

        if ($in.step === 'step_refresh_contact_view_response') {
            $in.step = 'step_end';
            if ($in.response.answer === 'true') {
                $in.response.ok = 'true';
            }
        }

        return {
            'answer': $in.response.answer,
            'message': $in.response.message,
            'ok': $in.response.ok,
        };
    };

    $functions.push('shared_secret_scramble');
    /**
     * Add the password, so we get a shared_secret that we can store
     * @version 2019-09-11
     * @since 2019-09-09
     * @author Peter Lembke
     * @param $in
     * @returns {{answer: string, message: string, shared_secret_modified: *, ok: string}}
     */
    const shared_secret_scramble = function($in = {}) {
        const $default = {
            'password': '', // in plain text
            'shared_secret': '', // base64 encoded
        };
        $in = _Default($default, $in);

        let $response = internal_Cmd({
            'func': 'ModifySharedSecret',
            'password': $in.password,
            'shared_secret': $in.shared_secret,
            'mode': 'scramble',
        });

        return {
            'answer': $response.answer,
            'message': $response.message,
            'shared_secret_modified': $response.data,
            'ok': 'true',
        };
    };

    $functions.push('shared_secret_restore');
    /**
     * Remove the password, so we get a shared_secret that we can use
     * @version 2019-09-11
     * @since 2019-09-09
     * @author Peter Lembke
     * @param $in
     * @returns {{answer: string, message: string, shared_secret_modified: *, ok: string}}
     */
    const shared_secret_restore = function($in = {}) {
        const $default = {
            'password': '', // in plain text
            'shared_secret': '', // base64 encoded
        };
        $in = _Default($default, $in);

        let $response = internal_Cmd({
            'func': 'ModifySharedSecret',
            'password': $in.password,
            'shared_secret': $in.shared_secret,
            'mode': 'restore',
        });

        return {
            'answer': $response.answer,
            'message': $response.message,
            'shared_secret_modified': $response.data,
            'ok': 'true',
        };
    };

    /**
     * Scramble or restore the shared_secret
     * @param $in
     * @returns {{answer: *, shared_secret_scrambled: *, message: *, ok: *}}
     */
    const internal_ModifySharedSecret = function($in = {}) {
        const $default = {
            'password': '', // in plain text
            'shared_secret': '', // base64 encoded
            'mode': 'scramble', // scramble or restore
        };
        $in = _Default($default, $in);

        let $sharedSecretArrayBuffer = _Base64ToArrayBuffer($in.shared_secret),
            $code = 0,
            $resultUint8Array = new Uint8Array($sharedSecretArrayBuffer),
            $length = $resultUint8Array.length,
            $passwordLength = $in.password.length,
            $passwordCharacterPosition = 0,
            $passwordCharCode = 0;

        for (let $i = 0; $i < $length; $i = $i + 1) {
            $code = $resultUint8Array[$i];
            $passwordCharacterPosition = $i % $passwordLength;
            $passwordCharCode = $in.password.charCodeAt($passwordCharacterPosition);

            if ($in.mode === 'restore') {
                $passwordCharCode = -$passwordCharCode;
            }

            $code = ($code + $passwordCharCode) % 256;
            $resultUint8Array[$i] = $code;
        }

        const $sharedSecretModified = _ArrayBufferToBase64($resultUint8Array);

        return {
            'answer': 'true',
            'message': 'shared secret modified',
            'data': $sharedSecretModified,
        };
    };

    /**
     * Convert a base64 string with binary data to an array buffer.
     * The binary data in the array buffer can then be manipulated.
     * https://stackoverflow.com/questions/21797299/convert-base64-string-to-arraybuffer
     * @param $base64String
     * @returns {ArrayBufferLike}
     * @private
     */
    const _Base64ToArrayBuffer = function($base64String) {
        const $binaryString = window.atob($base64String);
        const $length = $binaryString.length;
        let $binaryIntegerArray = new Uint8Array($length);

        for (let $i = 0; $i < $length; $i = $i + 1) {
            $binaryIntegerArray[$i] = $binaryString.charCodeAt($i);
        }

        return $binaryIntegerArray.buffer;
    };

    /**
     * Convert an array buffer with binary data to a base64 string that can be stored in a database or transferred in a message.
     * https://stackoverflow.com/questions/9267899/arraybuffer-to-base64-encoded-string
     * @param $arrayBuffer
     * @returns string
     * @private
     */
    const _ArrayBufferToBase64 = function($arrayBuffer) {
        let $stringWithBinaryData = '';
        const $binaryIntegerArray = new Uint8Array($arrayBuffer);
        const $length = $binaryIntegerArray.byteLength;

        for (let $i = 0; $i < $length; $i = $i + 1) {
            $stringWithBinaryData = $stringWithBinaryData + String.fromCharCode($binaryIntegerArray[$i]);
        }

        const $base64String = btoa($stringWithBinaryData);

        return $base64String;
    };
}

//# sourceURL=infohub_login_password.js