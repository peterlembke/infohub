/**
 * infohub_login_login
 * Login to the server with the imported contact data
 *
 * @package     Infohub
 * @subpackage  infohub_login_login
 * @since       2019-09-02
 * @author      Peter Lembke <info@infohub.se>
 * @license     GPL-3.0-or-later
 * @copyright   Copyright (C) 2010- Peter Lembke
 * @see         https://github.com/peterlembke/infohub/blob/main/folder/plugins/infohub/login/login/infohub_login_login.md Documentation
 * @link        https://infohub.se/ InfoHub main page
 */
function infohub_login_login() {

    'use strict';

// include "infohub_base.js"

    const _Version = function() {
        return {
            'date': '2020-01-12',
            'since': '2019-09-02',
            'version': '1.0.0',
            'checksum': '{{checksum}}',
            'class_name': 'infohub_login_login',
            'note': 'Login to the server with the imported contact data',
            'status': 'normal',
            'SPDX-License-Identifier': 'GPL-3.0-or-later',
        };
    };

    const _GetCmdFunctions = function() {
        const $list = {
            'create': 'normal',
            'set_boxes': 'normal',
            'click_login': 'normal',
            'click_import': 'normal',
            'click_export': 'normal',
        };

        return _GetCmdFunctionsBase($list);
    };

    let $classTranslations = {};

    // ***********************************************************
    // * your class functions below, only declare with const
    // * Can only be reached through cmd()
    // ***********************************************************

    /**
     * Get instructions and create the message to InfoHub View
     * @version 2019-09-03
     * @since   2019-09-03
     * @author  Peter Lembke
     */
    $functions.push('create');
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
            'desktop_environment': '',
            'download_account': {},
        };
        $in = _Default($default, $in);

        if ($in.step === 'step_render') {
            $classTranslations = $in.translations;

            $in.step = 'step_render_for_workbench';
        }

        if ($in.step === 'step_render_for_workbench') {
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_render',
                    'function': 'create',
                },
                'data': {
                    'what': {
                        'container_login': {
                            'type': 'common',
                            'subtype': 'container',
                            'tag': 'div',
                            'data': '[form_password]',
                            'class': 'container-small',
                        },
                        'form_password': {
                            'plugin': 'infohub_renderform',
                            'type': 'form',
                            'content': '[text_password][button_login][status_message][button_refresh]',
                            'label': _Translate('LOG_IN'),
                            'description': _Translate('HERE_YOU_CAN_USE_THE_CONTACT_INFORMATION_YOU_IMPORTED_AND_LOGIN_TO_THE_SERVER')
                        },
                        'text_password': {
                            'plugin': 'infohub_renderform',
                            'type': 'password',
                            'label': _Translate('PASSWORD'),
                            'description': _Translate('IF_YOU_HAVE_SET_A_PASSWORD_TO_DECODE_THE_SHARED_SECRET_THEN_ENTER_IT_HERE'),
                            'maxlength': '30',
                            'validator_plugin': 'infohub_validate',
                            'validator_function': 'validate_has_data',
                            'show_characters_left': 'false',
                            'css_data': {
                                'fieldset': 'border: 0px;'
                            }
                        },
                        'button_login': {
                            'plugin': 'infohub_renderform',
                            'type': 'button',
                            'mode': 'button',
                            'button_label': _Translate('LOG_IN'),
                            'event_data': 'login|login',
                            'to_plugin': 'infohub_login',
                            'to_function': 'click',
                            'custom_variables': {
                                'desktop_environment': $in.desktop_environment,
                            },
                        },
                        'status_message': {
                            'type': 'common',
                            'subtype': 'container',
                            'tag': 'span',
                            'data': _Translate('RESULT_FROM_LOG_IN') + ':',
                            'class': 'container-pretty',
                            'display': 'inline-block',
                        },
                        'button_refresh': {
                            'plugin': 'infohub_renderform',
                            'type': 'button',
                            'mode': 'button',
                            'button_label': _Translate('UPDATE_THE_PAGE_AFTER_LOGIN'),
                            'event_data': 'login|reload',
                            'to_plugin': 'infohub_debug',
                            'to_function': 'reload_page',
                        },
                    },
                    'how': {
                        'mode': 'one box',
                        'text': '[container_login]',
                    },
                    'where': {
                        'box_id': 'main.body.infohub_login.form', // 'box_id': $in.parent_box_id + '.form',
                        'max_width': 100,
                        'scroll_to_box_id': 'true',
                    },
                    'cache_key': 'login',
                },
                'data_back': {
                    'step': 'step_end',
                },
            });
        }

        if ($in.step === 'step_render_for_standalone_response') {
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_login_login',
                    'function': 'set_boxes',
                },
                'data': {
                    'box_id': 'main.body.infohub_login.form',
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
     * Sets file button to red fail or green OK
     * Sets password visibility
     * @version 2020-04-30
     * @since 2020-04-30
     * @author Peter Lembke
     */
    $functions.push('set_boxes');
    const set_boxes = function($in = {}) {
        const $default = {
            'step': 'step_load_contact',
            'box_id': '',
            'data': {},
            'answer': 'false',
            'message': '',
            'post_exist': 'false',
            'password_visible': 'false',
            'translations': {}
        };

        $in = _Default($default, $in);

        if ($in.step === 'step_load_contact') {

            if (_Empty($classTranslations) === 'true') {
                if (_Empty($in.translations) === 'false') {
                    $classTranslations = $in.translations;
                    // infohub_login_standalone never call create() to leave the translations, but calls this function
                }
            }

            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_login_contact',
                    'function': 'storage_read_contact_data',
                },
                'data': {},
                'data_back': {
                    'box_id': $in.box_id,
                    'step': 'step_set_button_icon',
                },
            });
        }

        if ($in.step === 'step_set_button_icon') {

            let $buttonIcon = $in.post_exist;

            let $passwordVisible = 'false';
            if ($in.post_exist === 'true') {
                if (_IsSet($in.data.has_password) === 'true') {
                    if ($in.data.has_password === 'true') {
                        $passwordVisible = 'true';
                    }
                }
            }

            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_renderform',
                    'function': 'set_button_icon',
                },
                'data': {
                    'box_id': $in.box_id + '.[my_file_selector_button_icon]',
                    'ok': $buttonIcon,
                },
                'data_back': {
                    'box_id': $in.box_id,
                    'data': $in.data,
                    'password_visible': $passwordVisible,
                    'step': 'step_set_password_visible',
                },
            });
        }

        if ($in.step === 'step_set_password_visible') {
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_view',
                    'function': 'set_visible',
                },
                'data': {
                    'id': $in.box_id + '.[text_password]',
                    'set_visible': $in.password_visible,
                },
                'data_back': {
                    'step': 'step_end',
                },
            });
        }

        return {
            'answer': $in.answer,
            'message': $in.message,
        };
    };

    /**
     * You clicked the button to log in to the server
     * @version 2019-09-03
     * @since 2019-09-03
     * @author Peter Lembke
     */
    $functions.push('click_login');
    const click_login = function($in = {}) {
        const $default = {
            'box_id': '',
            'step': 'step_do_we_already_have_a_valid_session',
            'desktop_environment': '',
            'response': {
                'answer': 'false',
                'message': 'Nothing to report',
                'data': {},
                'checksum': '',
                'initiator_user_name': '', // Your Hub-UUID username from the contact details
                'session_id': '',
                'session_created_at': '',
                'logged_in': 'false',
                'text': '',
                'shared_secret_modified': '',
                'session_valid': 'false',
            },
            'data_back': {
                'box_id': '',
                'contact': {}, // All contact details including shared_secret
                'initiator_user_name': '', // Your Hub-UUID username from the contact details
                'initiator_random_code': '', // BASE64 string with 256 bytes of random binary data
                'initiator_seconds_since_epoc': 0.0,
                'initiator_calculated_id_code': '',
                'login_request_valid': 'false',
                'responder_random_code': '', // BASE64 string with 256 bytes of random binary data
                'responder_seconds_since_epoc': 0.0,
                'responder_calculated_id_code': '',
                'session_id': '',
                'session_created_at': '',
                'left_overs_value': '',
                'left_overs': '',
                'password': '',
                'answer': 'false',
                'message': 'false',
                'ok': 'false',
                'login_message': '',
                'login_ok': 'false',
            },
        };
        $in = _Default($default, $in);

        let $answer = $in.response.answer,
            $message = $in.response.message,
            $ok = 'false',
            $password = '';

        if ($in.step === 'step_do_we_already_have_a_valid_session') {
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_session',
                    'function': 'initiator_check_session_valid',
                },
                'data': {
                    'node': 'server',
                },
                'data_back': {
                    'step': 'step_do_we_already_have_a_valid_session_response',
                    'desktop_environment': $in.desktop_environment,
                    'box_id': $in.box_id,
                },
            });
        }

        if ($in.step === 'step_do_we_already_have_a_valid_session_response') {
            $in.step = 'step_get_password';
            if ($in.response.session_valid === 'true') {
                $answer = 'true';
                $message = _Translate('YOU_ARE_ALREADY_LOGGED_IN');
                $ok = 'true';
                $in.step = 'step_show_result';
            }
        }

        if ($in.step === 'step_get_password') {
            let $id = $in.box_id + '_text_password_form_element';
            if ($in.desktop_environment === 'standalone') {
                $id = $in.box_id + '_text_password';
            }

            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_view',
                    'function': 'get_text',
                },
                'data': {
                    'id': $id,
                },
                'data_back': {
                    'step': 'step_get_password_response',
                    'box_id': $in.box_id,
                },
            });
        }

        if ($in.step === 'step_get_password_response') {
            $password = $in.response.text;
            $in.step = 'step_get_contact_data';
        }

        if ($in.step === 'step_get_contact_data') {
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_login_contact',
                    'function': 'storage_read_contact_data',
                },
                'data': {},
                'data_back': {
                    'step': 'step_get_contact_data_response',
                    'box_id': $in.box_id,
                    'password': $password,
                },
            });
        }

        if ($in.step === 'step_get_contact_data_response') {
            $in.step = 'step_show_result';

            if ($in.response.answer === 'true') {
                let $contact = _GetData({
                    'name': 'response/data',
                    'default': {},
                    'data': $in,
                });
                $in.data_back.contact = $contact;

                $in.step = 'step_shared_secret_restore';
                if ($in.data_back.password === '') {
                    $in.step = 'step_login_request';
                }
                if ($contact.user_name === '') {
                    $in.response.answer = 'false';
                    $in.response.message = 'No user file imported';
                    $in.response.ok = 'false';
                    $in.step = 'step_end';
                }
            }
        }

        if ($in.step === 'step_shared_secret_restore') {
            let $sharedSecret = _GetData({
                'name': 'data_back/contact/shared_secret',
                'default': '',
                'data': $in,
            });

            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_login_password',
                    'function': 'shared_secret_restore',
                },
                'data': {
                    'password': $in.data_back.password,
                    'shared_secret': $sharedSecret,
                },
                'data_back': {
                    'step': 'step_shared_secret_restore_response',
                    'box_id': $in.box_id,
                    'contact': $in.data_back.contact, // Will not be transferred outside this node
                },
            });
        }

        if ($in.step === 'step_shared_secret_restore_response') {
            $in.step = 'step_show_result';
            if ($in.response.answer === 'true') {

                const $sharedSecret = $in.response.shared_secret_modified;
                $in.data_back.contact.shared_secret = $sharedSecret;

                $in.step = 'step_login_request';
            }
        }

        if ($in.step === 'step_login_request') {
            let $response = internal_Cmd({
                'func': 'CreateRandomCode',
                'length': 256,
            });

            let $userName = _GetData({
                'name': 'data_back/contact/user_name',
                'default': '',
                'data': $in,
            });

            $message = _Translate('MISSING_USER_NAME');
            if ($userName !== '') {
                $message = _Translate('MISSING_RANDOM_CODE');
                if ($response.answer === 'true') {

                    const $currentTime = _MicroTime();

                    return _SubCall({
                        'to': {
                            'node': 'client',
                            'plugin': 'infohub_login',
                            'function': 'call_server',
                        },
                        'data': {
                            'to': {
                                'function': 'login_request',
                            },
                            'data': {
                                'initiator_user_name': $userName, // Your Hub-UUID username
                                'initiator_random_code': $response.random_code, // BASE64 string with 256 bytes of random binary data
                                'initiator_seconds_since_epoc': $currentTime,
                            },
                        },
                        'data_back': {
                            'step': 'step_login_request_response',
                            'box_id': $in.box_id,
                            'contact': $in.data_back.contact, // Will not be transferred outside this node
                            'initiator_user_name': $userName, // Your Hub-UUID username
                            'initiator_random_code': $response.random_code, // BASE64 string with 256 bytes of random binary data
                            'initiator_seconds_since_epoc': $currentTime,
                        },
                    });

                }
            }
        }

        if ($in.step === 'step_login_request_response') {
            $in.step = 'step_show_result';

            if ($in.response.answer === 'true') {

                $in.step = 'step_prepare_login_challenge';

                const $defaultResponse = {
                    'login_request_valid': 'false',
                    'responder_random_code': '',
                    'responder_seconds_since_epoc': 0.0,
                };
                $in.response.data = _Default($defaultResponse,
                    $in.response.data);
                $in.data_back = _Merge($in.data_back, $in.response.data);

                let $diff = _MicroTime() -
                    $in.data_back.initiator_seconds_since_epoc;
                if ($diff < 0.0 || $diff > 2.0) {
                    $message = _Translate('THE_ANSWER_FROM_THE_SERVER_TOOK_TOO_LONG_TIME.') + ' ' +
                        _Translate('I_WILL_ABANDON_THE_LOGIN_ATTEMPT');
                    $in.step = 'step_show_result';
                }
            }
        }

        if ($in.step === 'step_prepare_login_challenge') {
            // Merge the both random codes into one random_code
            const $randomCode = _MergeBase64Strings(
                $in.data_back.initiator_random_code,
                $in.data_back.responder_random_code);

            // Subtract the shared_secret from the random_code and get the diff.
            const $diff = _DeductBase64Strings($randomCode,
                $in.data_back.contact.shared_secret);

            // Rotate the diff 128 steps
            let $steps = 128;
            let $rotatedDiff = _RotateBase64String($diff, $steps);

            // Merge rotated diff and shared_secret
            const $rotatedResult = _MergeBase64Strings($rotatedDiff,
                $in.data_back.contact.shared_secret);

            // Do a MD5 of the rotatedResult. That is the initiator_calculated_id_code
            const $toMd5Checksum = $in.data_back.initiator_seconds_since_epoc +
                $rotatedResult + $in.data_back.responder_seconds_since_epoc;

            /** For debug purposes
             console.log('$randomCode: ' + $randomCode);
             console.log('$in.data_back.contact.shared_secret: ' + $in.data_back.contact.shared_secret);
             console.log('$diff: ' + $diff);
             console.log('$rotatedDiff: ' + $rotatedDiff);
             console.log('$rotatedResult: ' + $rotatedResult);
             console.log('$toMd5Checksum: ' + $toMd5Checksum);
             */

            $steps = 64;
            $rotatedDiff = _RotateBase64String($diff, $steps);

            // Merge rotated diff and shared_secret
            let $leftOversValue = _MergeBase64Strings($rotatedDiff,
                $in.data_back.contact.shared_secret);

            /** For debug purposes
             console.log('$rotatedDiff: ' + $rotatedDiff);
             console.log('$leftOversValue: ' + $leftOversValue);
             */

            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_checksum',
                    'function': 'calculate_checksum',
                },
                'data': {
                    'value': $toMd5Checksum,
                },
                'data_back': {
                    'step': 'step_prepare_login_challenge_response',
                    'box_id': $in.box_id,
                    'contact': $in.data_back.contact,
                    'initiator_user_name': $in.data_back.initiator_user_name,
                    'initiator_random_code': $in.data_back.initiator_random_code,
                    'initiator_seconds_since_epoc': $in.data_back.initiator_seconds_since_epoc,
                    'initiator_calculated_id_code': $in.data_back.initiator_calculated_id_code,
                    'responder_random_code': $in.data_back.responder_random_code,
                    'responder_seconds_since_epoc': $in.data_back.responder_seconds_since_epoc,
                    'responder_calculated_id_code': $in.data_back.responder_calculated_id_code,
                    'left_overs_value': $leftOversValue,
                },
            });

        }

        if ($in.step === 'step_prepare_login_challenge_response') {
            $in.step = 'step_show_result';
            if ($in.response.answer === 'true') {
                $in.data_back.initiator_calculated_id_code = $in.response.checksum;
                $in.step = 'step_left_overs';
            }
        }

        if ($in.step === 'step_left_overs') {
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_checksum',
                    'function': 'calculate_checksum',
                },
                'data': {
                    'value': $in.data_back.left_overs_value,
                },
                'data_back': {
                    'box_id': $in.box_id,
                    'contact': $in.data_back.contact,
                    'initiator_user_name': $in.data_back.initiator_user_name,
                    'initiator_random_code': $in.data_back.initiator_random_code,
                    'initiator_seconds_since_epoc': $in.data_back.initiator_seconds_since_epoc,
                    'initiator_calculated_id_code': $in.data_back.initiator_calculated_id_code,
                    'responder_random_code': $in.data_back.responder_random_code,
                    'responder_seconds_since_epoc': $in.data_back.responder_seconds_since_epoc,
                    'responder_calculated_id_code': $in.data_back.responder_calculated_id_code,
                    'step': 'step_left_overs_response',
                },
            });
        }

        if ($in.step === 'step_left_overs_response') {
            $in.step = 'step_show_result';
            if ($in.response.answer === 'true') {
                $in.data_back.left_overs = $in.response.checksum;
                $in.step = 'step_login_challenge';
            }
        }

        if ($in.step === 'step_login_challenge') {
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_login',
                    'function': 'call_server',
                },
                'data': {
                    'to': {'function': 'login_challenge'},
                    'data': {
                        'initiator_user_name': $in.data_back.initiator_user_name,
                        'initiator_random_code': $in.data_back.initiator_random_code,
                        'initiator_seconds_since_epoc': $in.data_back.initiator_seconds_since_epoc,
                        'initiator_calculated_id_code': $in.data_back.initiator_calculated_id_code,
                    },
                },
                'data_back': {
                    'step': 'step_login_challenge_response',
                    'box_id': $in.box_id,
                    'contact': $in.data_back.contact,
                    'initiator_user_name': $in.data_back.initiator_user_name,
                    'initiator_random_code': $in.data_back.initiator_random_code,
                    'initiator_seconds_since_epoc': $in.data_back.initiator_seconds_since_epoc,
                    'initiator_calculated_id_code': $in.data_back.initiator_calculated_id_code,
                    'responder_random_code': $in.data_back.responder_random_code,
                    'responder_seconds_since_epoc': $in.data_back.responder_seconds_since_epoc,
                    'responder_calculated_id_code': $in.data_back.responder_calculated_id_code,
                    'left_overs': $in.data_back.left_overs,
                },
            });
        }

        if ($in.step === 'step_login_challenge_response') {
            $in.step = 'step_show_result';
            $in.data_back.login_message = _Translate('FAILED_TO_LOGIN') + ': ' + $message;
            if ($in.response.logged_in === 'true')
            {
                $in.data_back.session_id = $in.response.session_id;
                $in.data_back.session_created_at = $in.response.session_created_at;
                $in.step = 'step_initiator_store_session_data';
                $in.data_back.login_ok = 'true';
                $in.data_back.login_message = _Translate('SUCCESS_LOGGING_IN');
            }
        }

        if ($in.step === 'step_initiator_store_session_data') {
            let $roleList = _GetData({
                'name': 'data_back/contact/role_list',
                'default': [],
                'data': $in,
            });

            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_session',
                    'function': 'initiator_store_session_data',
                },
                'data': {
                    'node': 'server', // name of the node the initiator use to send data to the responder. The client only have server
                    'initiator_user_name': $in.data_back.initiator_user_name,
                    'session_id': $in.data_back.session_id, //session_{hub_id}
                    'session_created_at': $in.data_back.session_created_at, // micro time with 3 decimals
                    'left_overs': $in.data_back.left_overs, // Left-overs from the login. Never exposed outside this plugin
                    'role_list': $roleList,
                },
                'data_back': {
                    'step': 'step_initiator_store_session_data_response',
                    'login_message': $in.data_back.login_message,
                    'login_ok': $in.data_back.login_ok,
                    'box_id': $in.box_id,
                },
            });
        }

        if ($in.step === 'step_initiator_store_session_data_response') {
            $in.step = 'step_end';
            if ($in.response.answer === 'true') {
                $in.step = 'step_show_result';
            }
        }

        if ($in.step === 'step_show_result') {
            let $text = $in.data_back.login_message;
            if ($in.response.answer === 'false') {
                $text = $in.response.message;
            }

            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_view',
                    'function': 'set_text',
                },
                'data': {
                    'id': $in.box_id + '.[status_message]',
                    'text': $text,
                },
                'data_back': {
                    'step': 'step_show_result_response',
                    'login_message': $in.data_back.login_message,
                    'login_ok': $in.data_back.login_ok,
                },
            });
        }

        if ($in.step === 'step_show_result_response') {
            $in.step = 'step_end';

            if ($in.response.answer === 'true') {
                if ($in.data_back.login_ok === 'true') {
                    $in.step = 'step_refresh';
                }
                if ($in.data_back.login_ok === 'false') {
                    $in.response.answer = 'false';
                    $in.response.message = '';
                }
            }
        }

        if ($in.step === 'step_refresh') {
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_login',
                    'function': 'call_server',
                },
                'data': {
                    'to': {
                        'node': 'server',
                        'plugin': 'infohub_dummy',
                        'function': 'reload_page',
                    },
                    'data': {},
                },
                'data_back': {
                    'login_message': $in.data_back.login_message,
                    'login_ok': $in.data_back.login_ok,
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
     * Create a 256 byte random code and encode it with base64
     * Used in login_request for responder_random_code
     * Used in login for initiator_random_code
     * @version 2019-09-22
     * @since   2019-09-22
     * @author  Peter Lembke
     * @param $in
     * @returns {{answer: string, verified: string, message: string, random_code: string}}
     */
    const internal_CreateRandomCode = function($in = {}) {
        const $default = {
            'length': 256,
        };
        $in = _Default($default, $in);

        let $verified = 'false',
            $randomCodeBase64Encoded = '';

        while ($verified === 'false') {
            let $randomCodeString = '';
            for (let $position = 0; $position <
            $in.length; $position = $position + 1) {
                let $randomNumber = _Random(0, 255);
                $randomCodeString = $randomCodeString +
                    String.fromCharCode($randomNumber);
            }

            $randomCodeBase64Encoded = btoa($randomCodeString);

            let $response = internal_Cmd({
                'func': 'VerifyRandomCode',
                'length': 256,
                'random_code': $randomCodeBase64Encoded,
            });

            if ($response.verified === 'true') {
                $verified = 'true';
            }
        }

        return {
            'answer': 'true',
            'message': 'Here are the random_code',
            'random_code': $randomCodeBase64Encoded,
            'verified': $verified,
        };
    };

    /**
     * Gives you the best random number that your version of PHP can offer
     * @param $min
     * @param $max
     * @returns {number}
     * @private
     */
    const _Random = function($min = 0, $max = 0) {
        const $diff = $max - $min + 1;
        let $randomNumber = Math.floor((Math.random() * $diff) + $min);
        return $randomNumber;
    };

    /**
     * Verify random code that it is the right length and has some spread
     * Used in login_request for initiator_random_code
     * Used in login for responder_random_code
     * For advanced tests: https://www.random.org/analysis/
     * @version 2019-09-22
     * @since   2019-09-22
     * @author  Peter Lembke
     * @param $in
     * @returns {{answer: string, verified: string, message: string}}
     */
    const internal_VerifyRandomCode = function($in = {}) {
        const $default = {
            'random_code': '',
            'length': 256,
        };
        $in = _Default($default, $in);

        let $verified = 'false',
            $message = 'Nothing to report';

        leave: {
            const $binary = atob($in.random_code);
            const $length = $binary.length;
            if ($length !== $in.length) {
                $message = _Translate('THE_RANDOM_CODE_DO_NOT_HAVE_THE_CORRECT_LENGTH');
                break leave;
            }

            let $average = [];
            const $spread = [2, 3, 5, 7, 11, 13];

            for (let $i = 0; $i < $length; $i = $i + 1) {
                for (let $position = 0; $position <
                $spread.length; $position = $position + 1) {

                    if (_IsSet($average[$position]) === 'false') {
                        $average[$position] = $binary.charCodeAt($i);
                        continue;
                    }

                    const $number = $spread[$position];

                    if ($i % $number === 0) {
                        $average[$position] = $average[$position] +
                            $binary.charCodeAt($i) / 2;
                    }
                }
            }

            let $sum = 0;
            for (let $position = 0; $position <
            $average.length; $position = $position + 1) {
                $sum = $sum + $average[$position];
            }

            let $totalAverage = $sum / $spread.length;

            if ($totalAverage === Math.round($totalAverage)) {
                $message = _Translate('UNLIKELY_THAT_THE_TOTAL_AVERAGE_HAS_NO_DECIMALS');
                break leave;
            }

            for (let $position in $spread) {
                let $number = $spread[$position];

                if ($average[$position] === $totalAverage) {
                    $message = _Translate('UNLIKELY_THAT_THE_AVERAGE_IS_EQUAL_TO_THE_TOTAL_AVERAGE');
                    break leave;
                }

                /*
                if ($average[$position] === Math.round($average[$position])) {
                    $message = 'Unlikely that the average has no decimals';
                    break leave;
                }
                */
            }

            $verified = 'true';
            $message = _Translate('THESE_SIMPLE_TESTS_SHOW_THAT_THE_RANDOM_CODE_AT_LEAST_IS_NOT_A_FLAT_LINE_OF_NUMBERS.');
        }

        return {
            'answer': 'true', // No exceptions occurred
            'message': $message,
            'verified': $verified,
        };
    };

    /**
     * Merge byte arrays
     * @version 2020-01-04
     * @since   2020-01-04
     * @author  Peter Lembke
     * @param $string1 | Base64 byte array
     * @param $string2 | Base64 byte array
     * @returns string | Base 64 byte array
     * @private
     */
    const _MergeBase64Strings = function($string1 = '', $string2 = '') {
        let $data1 = atob($string1),
            $data2 = atob($string2),
            $result = '';

        for (let $position = 0; $position <
        $data1.length; $position = $position + 1) {
            const $value = ($data1.charCodeAt($position) +
                $data2.charCodeAt($position)) % 256;
            $result = $result + String.fromCharCode($value);
        }

        const $base64Result = btoa($result);

        return $base64Result;
    };

    /**
     * Deduct one byte array from the other
     * @version 2020-01-04
     * @since   2020-01-04
     * @author  Peter Lembke
     * @param $string1 | Base64 byte array
     * @param $string2 | Base64 byte array
     * @returns string | Base 64 byte array
     * @private
     */
    const _DeductBase64Strings = function($string1 = '', $string2 = '') {
        let $data1 = atob($string1),
            $data2 = atob($string2),
            $result = '';

        for (let $position = 0; $position <
        $data1.length; $position = $position + 1) {
            let $value = $data1.charCodeAt($position) -
                $data2.charCodeAt($position);

            if ($value < 0) {
                $value = $value + 256;
            }

            $result = $result + String.fromCharCode($value);
        }

        const $base64Result = btoa($result);

        return $base64Result;
    };

    /**
     * Rotate a base64 encoded string with byte array
     * @version 2020-01-04
     * @since   2020-01-04
     * @author  Peter Lembke
     * @param $string1 | Base64 byte array
     * @param $steps | integer
     * @returns string | Base 64 byte array
     * @private
     */
    const _RotateBase64String = function($string1 = '', $steps = 0) {
        let $data1 = atob($string1);

        const $result = $data1.substring($steps + 1) + $data1.substring(0, $steps);

        const $base64Result = btoa($result);

        return $base64Result;
    };

    /**
     * You clicked the button to import contact data on the stand-alone version
     * @version 2019-09-03
     * @since 2019-09-03
     * @author Peter Lembke
     */
    $functions.push('click_import');
    const click_import = function($in = {}) {
        const $default = {
            'box_id': '',
            'step': 'step_file_read_response',
            'answer': 'true',
            'message': 'Done',
            'files_data': [],
            'ok': 'false',
            'node_data': {},
        };
        $in = _Default($default, $in);

        let $nodeData = {};

        if ($in.step === 'step_file_read_response') {
            $in.step = 'step_check_if_json';
            if ($in.files_data.length !== 1) {
                $in.message = 'One file must be selected';
                $in.step = 'step_end';
            }
        }

        if ($in.step === 'step_check_if_json') {
            $in.step = 'step_check_host';

            $nodeData = $in.files_data[0].content;

            if (typeof $nodeData !== 'object') {
                $in.message = 'This is not a json file';
                $in.step = 'step_end';
            }
        }

        if ($in.step === 'step_check_host') {
            $in.step = 'step_save_data_in_storage';

            const $fileHost = $nodeData.domain_address;
            const $browserHost = location.hostname;

            if ($fileHost !== $browserHost) {
                const $message = 'The file host "%s" is not the same as the browser host "%s"';
                $in.message = _SprintF($message, [$fileHost, $browserHost]);
                $in.step = 'step_end';
            }
        }

        if ($in.step === 'step_save_data_in_storage') {
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_login_contact',
                    'function': 'storage_write_contact_data',
                },
                'data': {
                    'data': $nodeData,
                },
                'data_back': {
                    'step': 'step_save_data_in_storage_response',
                    'box_id': $in.box_id,
                    'node_data': $nodeData,
                },
            });

        }

        if ($in.step === 'step_save_data_in_storage_response') {
            $in.step = 'step_end';
            if ($in.answer === 'true') {
                $in.ok = 'true';
                $in.step = 'step_set_boxes';
            }
        }

        if ($in.step === 'step_set_boxes') {
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_login_login',
                    'function': 'set_boxes',
                },
                'data': {
                    'box_id': $in.box_id,
                },
                'data_back': {
                    'box_id': $in.box_id,
                    'step': 'step_set_boxes_response',
                },
            });
        }

        if ($in.step === 'step_set_boxes_response') {
            $in.step = 'step_end';
            if ($in.answer === 'true') {
                $in.ok = 'true';
            }
        }

        return {
            'answer': $in.answer,
            'message': $in.message,
            'ok': $in.ok,
        };
    };

    /**
     * Export the contact data you defined in the infohub_login.json config file
     * @version 2020-07-07
     * @since   2020-07-07
     * @author  Peter Lembke
     */
    $functions.push('click_export');
    const click_export = function($in = {}) {
        const $default = {
            'download_account': {},
            'step': 'step_get_file_name',
            'answer': 'false',
            'message': 'Nothing',
            'response': {},
        };
        $in = _Default($default, $in);

        if ($in.step === 'step_get_file_name') {
            const $url = location.hostname;
            if (_IsSet($in.download_account[$url]) === 'true') {
                $in.step = 'step_file_read';
            }
        }

        if ($in.step === 'step_file_read') {
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_login',
                    'function': 'call_server',
                },
                'data': {
                    'to': {
                        'function': 'read_login_file',
                    },
                    'data': {},
                },
                'data_back': {
                    'step': 'step_file_read_response',
                },
            });
        }

        if ($in.step === 'step_file_read_response') {
            const $default = {
                'answer': 'false',
                'message': '',
                'file_name': '',
                'contents': '',
                'file_exist': 'false',
            };
            $in.response = _Default($default, $in.response);

            $in.step = 'step_end';
            if ($in.answer === 'true' && $in.response.file_exist === 'true') {
                $in.step = 'step_file_write';
            }
        }

        if ($in.step === 'step_file_write') {
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_view',
                    'function': 'file_write',
                },
                'data': {
                    'file_name': $in.response.file_name,
                    'content': $in.response.contents,
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
            'ok': $in.answer,
        };
    };
}

//# sourceURL=infohub_login_login.js