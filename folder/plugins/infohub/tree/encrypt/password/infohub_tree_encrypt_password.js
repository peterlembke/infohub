/**
 * You can add a password to the private secret. The password are added on top of the private secret.
 * When you restore your secret the password are removed from the top of the private secret.
 *
 * @author      Peter Lembke <info@infohub.se>
 * @version     2022-03-13
 * @since       2022-03-13
 * @copyright   Copyright (c) 2022, Peter Lembke, CharZam soft
 * @license     https://opensource.org/licenses/gpl-license.php GPL-3.0-or-later
 * @see         https://github.com/peterlembke/infohub/blob/master/folder/plugins/infohub/tree/encrypt/password/infohub_tree_encrypt_password.md Documentation
 * @link        https://infohub.se/ InfoHub main page
 */
function infohub_tree_encrypt_password() {

    'use strict';

// include "infohub_base.js"

    const _Version = function() {
        return {
            'date': '2022-03-13',
            'since': '2020-07-25',
            'version': '1.0.1',
            'checksum': '{{checksum}}',
            'class_name': 'infohub_tree_encrypt',
            'note': 'Add a password to the private secret',
            'status': 'normal',
            'SPDX-License-Identifier': 'GPL-3.0-or-later',
        };
    };

    const _GetCmdFunctions = function() {
        const $list = {
            'private_secret_scramble': 'normal',
            'private_secret_restore': 'normal'
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
            $response = $response + $parts[$key].charAt(0).toUpperCase() + $parts[$key].substring(1);
        }
        return $response;
    };

    let $classTranslations = {};

    let $classGlobalKeyData = {}; // Object with default key and plugin specific keys

    // ***********************************************************
    // * your class functions below, only declare with var
    // * Can only be reached through cmd()
    // ***********************************************************

    $functions.push('private_secret_scramble');
    /**
     * Add the password, so we get a private_secret that we can store
     * @version 2019-09-11
     * @since 2019-09-09
     * @author Peter Lembke
     * @param $in
     * @returns {{answer: string, message: string, private_secret_modified: *, ok: string}}
     */
    const private_secret_scramble = function($in = {}) {
        const $default = {
            'password': '', // in plain text
            'private_secret': '', // base64 encoded
        };
        $in = _Default($default, $in);

        let $response = internal_Cmd({
            'func': 'ModifyPrivateSecret',
            'password': $in.password,
            'private_secret': $in.private_secret,
            'mode': 'scramble',
        });

        return {
            'answer': $response.answer,
            'message': $response.message,
            'private_secret_modified': $response.data,
            'ok': 'true',
        };
    };

    $functions.push('private_secret_restore');
    /**
     * Remove the password, so we get a private_secret that we can use
     * @version 2019-09-11
     * @since 2019-09-09
     * @author Peter Lembke
     * @param $in
     * @returns {{answer: string, message: string, private_secret_modified: *, ok: string}}
     */
    const private_secret_restore = function($in = {}) {
        const $default = {
            'password': '', // in plain text
            'private_secret': '', // base64 encoded
        };
        $in = _Default($default, $in);

        let $response = internal_Cmd({
            'func': 'ModifyPrivateSecret',
            'password': $in.password,
            'private_secret': $in.private_secret,
            'mode': 'restore',
        });

        return {
            'answer': $response.answer,
            'message': $response.message,
            'private_secret_modified': $response.data,
            'ok': 'true',
        };
    };

    /**
     * Scramble or restore the private_secret
     *
     * @param $in
     * @returns {{answer: *, private_secret_scrambled: *, message: *, ok: *}}
     */
    const internal_ModifyPrivateSecret = function($in = {}) {
        const $default = {
            'password': '', // in plain text
            'private_secret': '', // base64 encoded
            'mode': 'scramble', // scramble or restore
        };
        $in = _Default($default, $in);

        let $privateSecretArrayBuffer = _Base64ToArrayBuffer($in.private_secret),
            $code = 0,
            $resultUint8Array = new Uint8Array($privateSecretArrayBuffer),
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

        const $privateSecretModified = _ArrayBufferToBase64($resultUint8Array);

        return {
            'answer': 'true',
            'message': 'private secret modified',
            'data': $privateSecretModified,
        };
    };

    /**
     * Convert a base64 string with binary data to an array buffer.
     * The binary data in the array buffer can then be manipulated.
     *
     * @link https://stackoverflow.com/questions/21797299/convert-base64-string-to-arraybuffer
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
     * Convert an array buffer with binary data to a base64 string.
     * The base64 string can be stored in a database or transferred in a message.
     *
     * @link https://stackoverflow.com/questions/9267899/arraybuffer-to-base64-encoded-string
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

//# sourceURL=infohub_tree_encrypt_password.js