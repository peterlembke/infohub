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
function infohub_encrypt_none() {

    "use strict";

// include "infohub_base.js"

    $functions.push('_Version');
    const _Version = function() {
        return {
            'date': '2019-11-19',
            'since': '2019-11-19',
            'version': '1.0.0',
            'checksum': '{{checksum}}',
            'class_name': 'infohub_encrypt_none',
            'note': 'This method does nothing with the data. Useful if you want to introduce encryption but see the result',
            'status': 'normal',
            'license_name': 'GNU GPL 3 or later'
        };
    };

    $functions.push('_GetCmdFunctions');
    const _GetCmdFunctions = function() {
        return {
            'encrypt': 'normal',
            'decrypt': 'normal'
        };
    };

    // *****************************************************************************
    // * Functions you only can reach with CMD()
    // * Observe! function names are lower_case
    // *****************************************************************************

    /**
     * This encryption does nothing with the text.
     * Used for getting encryption into your flow
     * @version 2019-11-19
     * @since 2019-11-19
     * @author Peter Lembke
     * @param array $in
     * @return array
     */
    $functions.push('encrypt');
    const encrypt = function ($in)
    {
        const $default = {
            'text': '',
            'password': ''
        };
        $in = _Default($default, $in);

        let $answer = 'false',
            $message = 'Nothing to report';

        leave: {

            if (_Empty($in.text) === 'true') {
                $message = 'Text is empty';
                break leave;
            }

            if (_Empty($in.password) === 'true') {
                $message = 'Password is empty';
                break leave;
            }

            $answer = 'true';
            $message = 'Here are the data';
        }

        return {
            'answer': $answer,
            'message': $message,
            'data': $in.text
        };
    };

    /**
     * This decryption does nothing with the text.
     * Used for getting decryption into your flow
     * @version 2019-11-19
     * @since 2019-11-19
     * @author Peter Lembke
     * @param array $in
     * @return array
     */
    $functions.push('decrypt');
    const decrypt = function ($in)
    {
        const $default = {
            'encrypted_text': '',
            'password': ''
        };
        $in = _Default($default, $in);

        let $answer = 'false';
        let $message = 'Nothing to report';

        leave: {

            if (_Empty($in.encrypted_text) === 'true') {
                $message = 'The encrypted text is empty';
                break leave;
            }

            if (_Empty($in.password) === 'true') {
                $message = 'The password is empty';
                break leave;
            }

            $answer = 'true';
            $message = 'Here are the text';
        }

        return {
            'answer': $answer,
            'message': $message,
            'data': $in.encrypted_text
        };
    };

}
//# sourceURL=infohub_encrypt_none.js
