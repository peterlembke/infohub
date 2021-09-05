/**
 * Class infohub_encrypt
 * To keep your data secret and pointless to steal you can encrypt your data.
 * Encryption hide your data in a data mess. Decryption restores your data.
 * You need to provide a random and long encryption_key
 * @category InfoHub
 * @package Encrypt
 * @copyright Copyright (c) 2019, Peter Lembke, CharZam soft
 * @since 2019-11-19
 * @author Peter Lembke <peter.lembke@infohub.se>
 * @link https://infohub.se/ InfoHub main page
 * @license InfoHub is distributed under the terms of the GNU General Public License
 * InfoHub is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * InfoHub is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 * You should have received a copy of the GNU General Public License
 * along with InfoHub.    If not, see <https://www.gnu.org/licenses/>.
 *
 * https://openpgpjs.org/
 * https://openpgpjs.org/openpgpjs/doc/#encrypt-and-decrypt-uint8array-data-with-a-password
 * https://github.com/openpgpjs/openpgpjs/tree/master/dist
 */
function infohub_encrypt() {

    'use strict';

// include "infohub_base.js"

    $functions.push('_Version');
    const _Version = function() {
        return {
            'date': '2019-11-19',
            'since': '2019-11-19',
            'version': '1.0.1',
            'checksum': '{{checksum}}',
            'class_name': 'infohub_encrypt',
            'note': 'You can encrypt/decrypt your data to keep the contents secret',
            'status': 'normal',
            'SPDX-License-Identifier': 'GPL-3.0-or-later',
            'user_role': 'user',
            'web_worker': 'true',
            'core_plugin': 'false',
        };
    };

    $functions.push('_GetCmdFunctions');
    const _GetCmdFunctions = function() {
        const $list = {
            'encrypt': 'normal',
            'decrypt': 'normal',
            'get_available_options': 'normal',
        };

        return _GetCmdFunctionsBase($list);
    };

    // *****************************************************************************
    // * Functions you only can reach with CMD()
    // * Observe! function names are lower_case
    // *****************************************************************************

    /**
     * text to encrypted text
     * @version 2019-11-19
     * @since 2019-11-19
     * @author Peter Lembke
     * @param array $in
     * @return array
     */
    $functions.push('encrypt');
    const encrypt = function($in = {}) {
        const $default = {
            'text': '',
            'password': '',
            'method': '',
            'step': 'step_start',
            'response': {
                'answer': 'false',
                'message': '-',
                'data': '',
            },
        };
        $in = _Default($default, $in);

        if ($in.step === 'step_start') {
            $in.step = 'step_call_child';

            if (_Empty($in.text) === 'true') {
                $in.response.message = 'text is empty';
                $in.step = 'step_exit';
            }

            if (_Empty($in.password) === 'true') {
                $in.response.message = 'password is empty';
                $in.step = 'step_exit';
            }

            if (_Empty($in.method) === 'true') {
                $in.response.message = 'method is empty';
                $in.step = 'step_exit';
            }

            let $methods = _GetAvailableMethods();
            if ($methods.indexOf($in.method) === -1) {
                $in.response.message = 'The method you gave is not valid';
                $in.step = 'step_exit';
            }
        }

        if ($in.step === 'step_call_child') {
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_encrypt_' + $in.method,
                    'function': 'encrypt',
                },
                'data': {
                    'text': $in.text,
                    'password': $in.password,
                },
                'data_back': {
                    'step': 'step_call_child_response',
                },
            });
        }

        if ($in.step === 'step_call_child_response') {
        }

        return {
            'answer': $in.response.answer,
            'message': $in.response.message,
            'data': $in.response.data,
        };
    };

    /**
     * Encrypted text to text
     * @version 2019-11-19
     * @since 2019-11-19
     * @author Peter Lembke
     * @param array $in
     * @return array
     */
    $functions.push('decrypt');
    const decrypt = function($in = {}) {
        const $default = {
            'encrypted_text': '',
            'password': '',
            'method': '',
            'step': 'step_start',
            'response': {
                'answer': 'false',
                'message': '-',
                'data': '',
            },
        };
        $in = _Default($default, $in);

        if ($in.step === 'step_start') {
            $in.step = 'step_call_child';

            if (_Empty($in.encrypted_text) === 'true') {
                $in.response.message = 'encrypted_text is empty';
                $in.step = 'step_exit';
            }

            if (_Empty($in.password) === 'true') {
                $in.response.message = 'password is empty';
                $in.step = 'step_exit';
            }

            if (_Empty($in.method) === 'true') {
                $in.response.message = 'method is empty';
                $in.step = 'step_exit';
            }

            let $methods = _GetAvailableMethods();
            if ($methods.indexOf($in.method) === -1) {
                $in.response.message = 'The method you gave is not valid';
                $in.step = 'step_exit';
            }
        }

        if ($in.step === 'step_call_child') {
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_encrypt_' + $in.method,
                    'function': 'decrypt',
                },
                'data': {
                    'encrypted_text': $in.encrypted_text,
                    'password': $in.password,
                },
                'data_back': {
                    'step': 'step_call_child_response',
                },
            });
        }

        if ($in.step === 'step_call_child_response') {
        }

        return {
            'answer': $in.response.answer,
            'message': $in.response.message,
            'data': $in.response.data,
        };
    };

    /**
     * Get list with encryption methods you can use on this node
     * https://secure.php.net/manual/en/function.openssl-get-cipher-methods.php
     * @version 2018-03-15
     * @since   2018-03-15
     * @author  From PHP documentation
     * @param array $in
     * @return array|bool
     */
    $functions.push('get_available_options');
    const get_available_options = function($in = {}) {
        const $methods = _GetAvailableMethods();
        let $options = [];

        for (let $key in $methods) {
            if ($methods.hasOwnProperty($key)) {
                const $method = $methods[$key];
                $options.push(
                    {'type': 'option', 'value': $method, 'label': $method});
            }
        }

        return {
            'answer': 'true',
            'message': 'List of valid encoding methods.',
            'options': $options,
        };
    };

    const _GetAvailableMethods = function($in = {}) {
        return ['pgp', 'none'];
    };

}

//# sourceURL=infohub_encrypt.js
