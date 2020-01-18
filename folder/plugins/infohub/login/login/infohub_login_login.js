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
function infohub_login_login() {

// include "infohub_base.js"

    // ***********************************************************
    // * jshint.com options to suppress some warnings
    // ***********************************************************

    /*jshint evil:true */
    /*jshint devel:true */
    /*jslint browser: true, evil: true, plusplus: true, todo: true */

    // ***********************************************************
    // * your private class variables below, only declare with var
    // ***********************************************************

    var _Version = function() {
        return {
            'date': '2020-01-12',
            'since': '2019-09-02',
            'version': '1.0.0',
            'checksum': '{{checksum}}',
            'class_name': 'infohub_login_login',
            'note': 'Login to the server with the imported contact data',
            'status': 'normal',
            'license_name': 'GNU GPL 3 or later'
        };
    };

    var _GetCmdFunctions = function() {
        return {
            'create': 'normal',
            'click_login': 'normal'
        };
    };

    var $classTranslations = {};

    /**
     * Translate - Substitute a string for another string using a class local object
     * @param {type} $string
     * @returns string
     */
    $functions.push('_Translate');
    var _Translate = function ($string)
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
     * @version 2019-09-03
     * @since   2019-09-03
     * @author  Peter Lembke
     */
    $functions.push('create');
    var create = function ($in)
    {
        "use strict";

        const $default = {
            'subtype': 'menu',
            'parent_box_id': '',
            'translations': {},
            'step': 'step_render',
            'response': {
                'answer': 'false',
                'message': ''
            }
        };
        $in = _Default($default, $in);

        if ($in.step === 'step_render') {
            $classTranslations = $in.translations;
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_render',
                    'function': 'create'
                },
                'data': {
                    'what': {
                        'container_login': {
                            'type': 'common',
                            'subtype': 'container',
                            'tag': 'div',
                            'data': '[form_password]',
                            'class': 'container-small'
                        },
                        'form_password': {
                            'plugin': 'infohub_renderform',
                            'type': 'form',
                            'content': '[text_password][button_login][status_message]',
                            'label': _Translate('Login'),
                            'description': _Translate('Here you can use the contact data you imported and login to the server')
                        },
                        'text_password': {
                            'plugin': 'infohub_renderform',
                            'type': 'text',
                            'label': _Translate('Password'),
                            'description': 'The password you need to decode the shared_secret',
                            'maxlength': '30',
                            'validator_plugin': 'infohub_validate',
                            'validator_function': 'validate_has_data',
                            'show_characters_left': 'false'
                        },
                        'button_login': {
                            'plugin': 'infohub_renderform',
                            'type': 'button',
                            'mode': 'button',
                            'button_label': _Translate('Login'),
                            'event_data': 'login|login',
                            'to_plugin': 'infohub_login',
                            'to_function': 'click'
                        },
                        'status_message': {
                            'type': 'common',
                            'subtype': 'container',
                            'tag': 'span',
                            'data': 'login result:',
                            'class': 'container-pretty',
                            'display': 'inline-block'
                        }
                    },
                    'how': {
                        'mode': 'one box',
                        'text': '[container_login]'
                    },
                    'where': {
                        'box_id': 'main.body.infohub_login.form', // 'box_id': $in.parent_box_id + '.form',
                        'max_width': 100,
                        'scroll_to_box_id': 'true'
                    }
                },
                'data_back': {
                    'step': 'step_end'
                }
            });
        }

        return {
            'answer': $in.response.answer,
            'message': $in.response.message
        };
    };

    /**
     * You clicked the button to login to the server
     * @version 2019-09-03
     * @since 2019-09-03
     * @author Peter Lembke
     */
    $functions.push("click_login");
    var click_login = function ($in)
    {
        "use strict";

        const $default = {
            'box_id': '',
            'step': 'step_get_password',
            'response': {
                'answer': 'false',
                'message': 'Nothing to report',
                'data': {},
                'checksum': '',
                'initiator_user_name': '', // Your Hub-UUID username from the contact details
                'session_id': '',
                'session_created_at': 0.0,
                'logged_in': 'false',
                'text': '',
                'shared_secret_modified': ''
            },
            'data_back': {
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
                'session_created_at': 0.0,
                'left_overs_value': '',
                'left_overs': '',
                'password': '',
                'answer': 'false',
                'message': 'false',
                'ok': 'false'
            }
        };
        $in = _Default($default, $in);

        let $answer = $in.response.answer,
            $message = $in.response.message,
            $ok = 'false',
            $messages = [],
            $password = '';

        if ($in.step === 'step_get_password')
        {
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_view',
                    'function': 'get_text'
                },
                'data': {
                    'id': $in.box_id + '_text_password_form_element'
                },
                'data_back': {
                    'step': 'step_get_password_response',
                    'box_id': $in.box_id
                }
            });
        }

        if ($in.step === 'step_get_password_response')
        {
            $password = $in.response.text;
            $in.step = 'step_get_contact_data';
        }

        if ($in.step === 'step_get_contact_data')
        {
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_login_contact',
                    'function': 'storage_read_contact_data'
                },
                'data': {},
                'data_back': {
                    'step': 'step_get_contact_data_response',
                    'box_id': $in.box_id,
                    'password': $password
                }
            });
        }

        if ($in.step === 'step_get_contact_data_response')
        {
            $in.step = 'step_show_result';

            if ($in.response.answer === 'true')
            {
                let $contact = _GetData({
                    'name': 'response/data',
                    'default': {},
                    'data': $in,
                });
                $in.data_back.contact = $contact;

                $in.step = 'step_shared_secret_restore';
            }
        }

        if ($in.step === 'step_shared_secret_restore')
        {
            let $sharedSecret = _GetData({
                'name': 'data_back/contact/shared_secret',
                'default': '',
                'data': $in,
            });

            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_login_password',
                    'function': 'shared_secret_restore'
                },
                'data': {
                    'password': $in.data_back.password,
                    'shared_secret': $sharedSecret
                },
                'data_back': {
                    'step': 'step_shared_secret_restore_response',
                    'box_id': $in.box_id,
                    'contact': $in.data_back.contact // Will not be transferred outside this node
                }
            });
        }

        if ($in.step === 'step_shared_secret_restore_response')
        {
            $in.step = 'step_show_result';
            if ($in.response.answer === 'true') {

                let $sharedSecret = $in.response.shared_secret_modified;
                $in.data_back.contact.shared_secret = $sharedSecret;

                $in.step = 'step_login_request';
            }
        }

        if ($in.step === 'step_login_request')
        {
            let $response = internal_Cmd({
                'func': 'CreateRandomCode',
                'length': 256
            });

            let $userName = _GetData({
                'name': 'data_back/contact/user_name',
                'default': '',
                'data': $in,
            });

            $message = _Translate('Missing user name');
            if ($userName !== '') {
                $message = _Translate('Missing random code');
                if ($response.answer === 'true') {

                    const $currentTime = _MicroTime();

                    return _SubCall({
                        'to': {
                            'node': 'client',
                            'plugin': 'infohub_login',
                            'function': 'call_server'
                        },
                        'data': {
                            'to': {
                                'function': 'login_request'
                            },
                            'data': {
                                'initiator_user_name': $userName, // Your Hub-UUID username
                                'initiator_random_code': $response.random_code, // BASE64 string with 256 bytes of random binary data
                                'initiator_seconds_since_epoc': $currentTime
                            },
                        },
                        'data_back': {
                            'step': 'step_login_request_response',
                            'box_id': $in.box_id,
                            'contact': $in.data_back.contact, // Will not be transferred outside this node
                            'initiator_user_name': $userName, // Your Hub-UUID username
                            'initiator_random_code': $response.random_code, // BASE64 string with 256 bytes of random binary data
                            'initiator_seconds_since_epoc': $currentTime
                        }
                    });

                }
            }
        }

        if ($in.step === 'step_login_request_response')
        {
            $in['step'] = 'step_show_result';
            if ($in.response.answer === 'true') {
                $in.step = 'step_prepare_login_challenge';

                const $defaultResponse = {
                    'login_request_valid': 'false',
                    'responder_random_code': '',
                    'responder_seconds_since_epoc': 0.0
                };
                $in.response.data = _Default($defaultResponse, $in.response.data);
                $in.data_back = _Merge($in.data_back, $in.response.data);

                let $diff = _MicroTime() - $in.data_back.initiator_seconds_since_epoc;
                if ($diff < 0.0 || $diff > 2.0) {
                    $message = _Translate('The answer from the server took too long time. I will abandon the login attempt');
                    $in['step'] = 'step_show_result';
                }
            }
        }

        if ($in.step === 'step_prepare_login_challenge')
        {
            // Merge the both random codes into one random_code
            const $randomCode = _MergeBase64Strings($in.data_back.initiator_random_code, $in.data_back.responder_random_code);

            // Subtract the shared_secret from the random_code and get the diff.
            const $diff = _DeductBase64Strings($randomCode, $in.data_back.contact.shared_secret);

            // Rotate the diff 128 steps
            let $steps = 128;
            let $rotatedDiff = _RotateBase64String($diff, $steps);

            // Merge rotated diff and shared_secret
            const $rotatedResult = _MergeBase64Strings($rotatedDiff, $in.data_back.contact.shared_secret);

            // Do an md5 of the rotatedResult. That is the initiator_calculated_id_code
            const $toMd5Checksum = $in.data_back.initiator_seconds_since_epoc + $rotatedResult + $in.data_back.responder_seconds_since_epoc;

            $steps = 64;
            $rotatedDiff = _RotateBase64String($diff, $steps);

            // Merge rotated diff and shared_secret
            let $leftOversValue = _MergeBase64Strings($rotatedDiff, $in.data_back.contact.shared_secret);

            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_checksum',
                    'function': 'calculate_checksum'
                },
                'data': {
                    'value': $toMd5Checksum
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
                    'left_overs_value': $leftOversValue
                }
            });

        }

        if ($in.step === 'step_prepare_login_challenge_response')
        {
            $in['step'] = 'step_show_result';
            if ($in.response.answer === 'true') {
                $in.data_back.initiator_calculated_id_code = $in.response.checksum;
                $in.step = 'step_left_overs';
            }
        }

        if ($in.step === 'step_left_overs')
        {
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_checksum',
                    'function': 'calculate_checksum'
                },
                'data': {
                    'value': $in.data_back.left_overs_value
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
                    'step': 'step_left_overs_response'
                }
            });
        }

        if ($in.step === 'step_left_overs_response')
        {
            $in['step'] = 'step_show_result';
            if ($in.response.answer === 'true') {
                $in.data_back.left_overs = $in.response.checksum;
                $in.step = 'step_login_challenge';
            }
        }

        if ($in.step === 'step_login_challenge')
        {
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_login',
                    'function': 'call_server'
                },
                'data': {
                    'to': {'function': 'login_challenge' },
                    'data': {
                        'initiator_user_name': $in.data_back.initiator_user_name,
                        'initiator_random_code': $in.data_back.initiator_random_code,
                        'initiator_seconds_since_epoc': $in.data_back.initiator_seconds_since_epoc,
                        'initiator_calculated_id_code': $in.data_back.initiator_calculated_id_code
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
                    'left_overs': $in.data_back.left_overs
                }
            });

        }

        if ($in.step === 'step_login_challenge_response')
        {
            $in.step = 'step_show_result';
            if ($in.response.logged_in === 'true')
            {
                $in.data_back.session_id = $in.response.session_id;
                $in.data_back.session_created_at = $in.response.session_created_at;
                $in.step = 'step_initiator_store_session_data';
                $ok = 'true';
            }
        }

        if ($in.step === 'step_initiator_store_session_data')
        {
            let $pluginNames = _GetData({
                'name': 'data_back/contact/plugin_names',
                'default': [],
                'data': $in
            });

            let $subCall = _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_session',
                    'function': 'initiator_store_session_data'
                },
                'data': {
                    'node': 'server', // name of the node the initiator use to send data to the responder. The client only have server
                    'initiator_user_name': $in.data_back.initiator_user_name,
                    'session_id': $in.data_back.session_id, //session_{hub_id}
                    'session_created_at': $in.data_back.session_created_at, // micro time with 3 decimals
                    'left_overs': $in.data_back.left_overs, // Left overs from the login. Never exposed outside this plugin
                    'plugin_names': $pluginNames
                },
                'data_back': {
                    'step': 'step_end',
                    'box_id': $in.box_id
                }
            });
            $messages.push($subCall);

            $in.step = 'step_show_result';
        }

        if ($in.step === 'step_show_result')
        {
            $message = _Translate('Failed to login') + ': ' + $message;
            if ($ok === 'true') {
                $message = _Translate('Success logging in');
            }

            let $subCall = _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_view',
                    'function': 'set_text'
                },
                'data': {
                    'id': $in.box_id + '.[status_message]',
                    'text': $message
                },
                'data_back': {
                    'step': 'step_end',
                    'answer': $answer,
                    'message': $message,
                    'ok': $ok
                }
            });
            $messages.push($subCall);
        }

        return {
            'answer': $answer,
            'message': $message,
            'messages': $messages,
            'ok': $ok
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
    var internal_CreateRandomCode = function($in)
    {
        const $default = {
            'length':  256
        };
        $in = _Default($default, $in);

        let $verified = 'false',
            $randomCodeBase64Encoded = '';

        while ($verified === 'false')
        {
            let $randomCodeString = '';
            for (let $i = 0; $i < $in.length; $i++) {
                let $randomNumber = _Random(0,255);
                $randomCodeString = $randomCodeString + String.fromCharCode($randomNumber);
            }

            $randomCodeBase64Encoded = btoa($randomCodeString);

            let $response = internal_Cmd({
                'func': 'VerifyRandomCode',
                'length': 256,
                'random_code': $randomCodeBase64Encoded
            });

            if ($response['verified'] === 'true') {
                $verified = 'true';
            }
        }

        return {
            'answer': 'true',
            'message': 'Here are the random_code',
            'random_code': $randomCodeBase64Encoded,
            'verified': $verified
        };
    };

    /**
     * Gives you the best random number that your version of PHP can offer
     * @param $min
     * @param $max
     * @returns {number}
     * @private
     */
    var _Random = function($min = 0, $max = 0)
    {
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
    var internal_VerifyRandomCode = function($in)
    {
        const $default = {
            'random_code': '',
            'length': 256
        };
        $in = _Default($default, $in);

        let $verified = 'false',
            $message = 'Nothing to report';

        leave: {
            const $binary = atob($in.random_code);
            const $length = $binary.length;
            if ($length !== $in.length) {
                $message = _Translate('The random code do not have the correct length');
                break leave;
            }

            let $average = [];
            const $spread = [2,3,5,7,11,13];

            for (let $i=0; $i < $length; $i++)
            {
                for (let $position=0; $position < $spread.length; $position++)
                {

                    if (_IsSet($average[$position]) === 'false') {
                        $average[$position] = $binary.charCodeAt($i);
                        continue;
                    }

                    const $number = $spread[$position];

                    if ($i % $number === 0) {
                        $average[$position] = $average[$position] + $binary.charCodeAt($i) / 2;
                    }
                }
            }

            let $sum = 0;
            for (let $pos = 0; $pos < $average.length; $pos++) {
                $sum = $sum + $average[$pos];
            }

            let $totalAverage = $sum / $spread.length;

            if ($totalAverage === Math.round($totalAverage)) {
                $message = _Translate('Unlikely that the total average has no decimals');
                break leave;
            }

            for (let $position in $spread)
            {
                let $number = $spread[$position];

                if ($average[$position] === $totalAverage) {
                    $message = _Translate('Unlikely that the average is equal to the total average');
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
            $message = _Translate('These simple tests show that the random_code at least is not a flatline of numbers.');
        }

        return {
            'answer': 'true', // No exceptions occurred
            'message': $message,
            'verified': $verified
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
    var _MergeBase64Strings = function($string1, $string2)
    {
        let $data1 = atob($string1),
            $data2 = atob($string2),
            $result = '';

        for (let $position = 0; $position < $data1.length; $position++) {
            const $value = ($data1.charCodeAt($position) + $data2.charCodeAt($position)) % 256;
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
    var _DeductBase64Strings = function($string1, $string2)
    {
        let $data1 = atob($string1),
            $data2 = atob($string2),
            $result = '';

        for (let $position = 0; $position < $data1.length; $position++) {
            let $value = $data1.charCodeAt($position) - $data2.charCodeAt($position);
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
    var _RotateBase64String = function($string1, $steps)
    {
        let $data1 = atob($string1);

        const $result = $data1.substr($steps +1) + $data1.substr(0,$steps);

        const $base64Result = btoa($result);

        return $base64Result;
    };

}
//# sourceURL=infohub_login_login.js