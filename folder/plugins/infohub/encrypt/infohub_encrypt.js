/**
 * Class infohub_encrypt
 * To keep your data secret and pointless to steal you can encrypt your data.
 * Encryption hide your data in a data mess. Decryption restores your data.
 * You need to provide a random and long encryption_key
 * @category InfoHub
 * @package Encrypt
 * @copyright Copyright (c) 2018, Peter Lembke, CharZam soft
 * @since 2018-08-07
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
 * Based on infohub_encrypt.php and on
 * https://github.com/diafygi/webcrypto-examples/#aes-cbc
 */
function infohub_encrypt() {

// include "infohub_base.js"

    $functions.push('_Version');
    var _Version = function() {
        return {
            'date': '2018-08-07',
            'since': '2018-08-07',
            'version': '1.0.0',
            'checksum': '{{checksum}}',
            'class_name': 'infohub_plugin',
            'note': 'You can encrypt/decrypt your data keep the contents secret',
            'status': 'normal',
            'license_name': 'GNU GPL 3 or later'
        };
    };

    $functions.push('_GetCmdFunctions');
    var _GetCmdFunctions = function() {
        return {
            'encrypt': 'normal',
            'decrypt': 'normal',
            'get_available_options': 'normal',
            'is_method_valid': 'normal',
            'create_encryption_key': ''
        };
    };

    // *****************************************************************************
    // * Functions you only can reach with CMD()
    // * Observe! function names are lower_case
    // *****************************************************************************

    /**
     * Plain text to encrypted text
     * Encrypt SSL - Encrypts the plain text into encrypted text
     * https://secure.php.net/manual/en/function.openssl-encrypt.php
     * @version 2017-06-24
     * @since   2017-06-24
     * @author  Peter Lembke
     * @param array $in
     * @return array|bool
     */
    $functions.push('encrypt');
    var encrypt = function ($in)
    {
        "use strict";
        var $answer, $message, $encryptedText, $response, $key, $ivLength, $iv, $cipherText,
            $default = {
                'plain_text': '',
                'encryption_key': 'infohub2010',
                'method': 'AES-128-CBC'
            };
        $in = _Default($default, $in);

        $answer = 'false';
        $message = 'Nothing to report';
        $encryptedText = '';

        $in['method'] = 'AES-128-CBC';

        leave: {

            if (_Empty($in['encryption_key']) === 'true') {
                $message = 'encryption_key is empty';
                break leave;
            }

            $key = _GetKey($in['encryption_key']);
            if (_Empty($key) === 'true') {
                $message = 'Key is empty';
                break leave;
            }

            $ivLength = _GetCipherIvLength($in['method']);
            if (_Empty($ivLength) === 'true') {
                $message = 'The ivLength is zero';
                break leave;
            }

            $iv = _GenerateIv($in['method']);
            if (_Empty($iv) === 'true') {
                $message = 'The IV could not be generated';
                break leave;
            }

            window.crypto.subtle.encrypt(
                { name: "AES-CBC", iv: $iv},
                $key, //from generateKey or importKey above
                $in['plain_text'] //ArrayBuffer of data you want to encrypt
            )
            .then(function($cipherText){
                //returns an ArrayBuffer containing the encrypted data
                console.log($cipherText);

                if (_Empty($cipherText) === 'true') {
                    $message = 'The cipher text could not be generated';
                } else {
                    $encryptedText = btoa($iv + new Uint8Array($cipherText));
                    $answer = 'true';
                    $message = 'Here are the encrypted text';
                }

                $in.callback_function({
                    'answer': $answer,
                    'message': $message,
                    'encrypted_text': $encryptedText,
                    'method': $in['method']
                });
            })
            .catch(function(err){
                console.error(err);
                $in.callback_function({
                    'answer': $answer,
                    'message': err,
                    'encrypted_text': $encryptedText,
                    'method': $in['method']
                });
            });

        }

        return {};
    };

    $functions.push('_GetCipherIvLength');
    var _GetCipherIvLength = function ($method)
    {
        "use strict";
        var $methods = {
            'AES-128-CBC': 16,
            'AES-256-CBC': 32
        };

        if (_IsSet($methods[$method]) === 'true') {
            return parseInt($methods[$method]);
        }
        return 0;
    };


    /**
     * Encrypted text to plain text
     * Decrypt SSL - Decrypts an encrypted text into readable text.
     * https://secure.php.net/manual/en/function.openssl-decrypt.php
     * @version 2017-06-24
     * @since   2017-06-24
     * @author  Peter Lembke and ?
     * @param array $in
     * @return array|bool
     */
    $functions.push('decrypt');
    var decrypt = function ($in)
    {
        "use strict";
        var $answer, $message, $plainTextDecrypted, $ivLength, $iv, $cipherText, $key, $response,
            $default = {
            'encrypted_text': '', // Base 64 encoded cipher text
            'encryption_key': 'infohub2010',
            'method': 'AES-128-CBC'
        };
        $in = _Default($default, $in);

        $answer = 'false';
        $message = 'Nothing to report';
        $plainTextDecrypted = '';

        $in['method'] = 'AES-128-CBC';

        // Some how + signs have been exchanged with spaces during the transfer to here
        $in['encrypted_text'] = $in['encrypted_text'].replace(' ', '+');

        leave: {
            $cipherText = atob($in['encrypted_text']);
            if (_Empty($cipherText)) {
                $message = 'Could not base64 decode the encrypted text';
                break leave;
            }

            $ivLength = _GetCipherIvLength($in['method']);
            if (_Empty($ivLength)) {
                $message = 'The ivLength is zero';
                break leave;
            }

            // retrieves the IV that we attached first to the encoded data.
            $iv = $cipherText.substr(0, $ivLength);
            if (_Empty($iv)) {
                $message = 'The iv is empty';
                break leave;
            }

            // retrieves the cipher text by removing the iv we attached at the beginning
            $cipherText = $cipherText.substr($ivLength);
            if (_Empty($cipherText)) {
                $message = 'The encrypted text is empty';
                break leave;
            }

            $key = _GetKey($in['encryption_key']);
            if (_Empty($key)) {
                $message = 'The key is empty';
                break leave;
            }

            window.crypto.subtle.decrypt(
                { name: "AES-CBC", iv: $iv },
                $key, //from generateKey or importKey above
                $cipherText //ArrayBuffer of the data
            )
            .then(function($plainTextDecrypted){
                //returns an ArrayBuffer containing the decrypted data
                $plainTextDecrypted =  new Uint8Array($plainTextDecrypted);
                console.log($plainTextDecrypted);

                    if ($plainTextDecrypted === false) {
                        $message = 'Could not decrypt the encrypted data';
                    } else {
                        $plainTextDecrypted = $plainTextDecrypted.trim();
                        $answer = 'true';
                        $message = 'Here are the plain text';
                    }

                    $response = {
                        'answer': $answer,
                        'message': $message,
                        'plain_text': $plainTextDecrypted
                    };
                    $in.callback_function($response);

                })
            .catch(function(err){
                console.error(err);
                $response = {
                    'answer': 'false',
                    'message': err,
                    'plain_text': ''
                };
                $in.callback_function($response);
            });

        }

        return {};
    };

    /**
     * Get list with encryption methods you can use on this server
     * https://secure.php.net/manual/en/function.openssl-get-cipher-methods.php
     * @version 2018-03-15
     * @since   2018-03-15
     * @author  From PHP documentation
     * @param array $in
     * @return array|bool
     */
    $functions.push('get_available_options');
    var get_available_options = function ($in)
    {
        "use strict";
        var $key,
            $method,
            $methods = _GetCipherMethods(),
            $options = [];

        for ($key in $methods) {
            if ($methods.hasOwnProperty($key)) {
                $method = $methods[$key];
                $options.push({"type": "option", "value": $method, "label": $method });
            }
        }

        return {
            'answer': 'true',
            'message': 'List of valid encoding methods. I have removed the weak ones',
            'options': $options
        };
    };

    $functions.push('_GetCipherMethods');
    var _GetCipherMethods = function ($in)
    {
        "use strict";
        var $ciphers = ['AES-128-CBC', 'AES-256-CBC'];
        return $ciphers;
    };

    /**
     * Get list with encryption methods you can use on this server
     * https://secure.php.net/manual/en/function.openssl-get-cipher-methods.php
     * @version 2018-03-15
     * @since   2018-03-15
     * @author  From PHP documentation
     * @param array $in
     * @return array|bool
     */
    $functions.push('is_method_valid');
    var is_method_valid = function ($in)
    {
        "use strict";
        var $valid, $message, $ciphers,
        $default = {
            'method': 'AES-128-CBC'
        };
        $in = _Default($default, $in);

        $ciphers = _GetCipherMethods();

        $valid = 'false';
        $message = 'This encryption method is not valid';

        if ($ciphers.indexOf($in['method']) !== false) {
            $valid = 'true';
            $message = 'This encryption method is valid';
        }

        return {
            'answer': 'true',
            'message': $message,
            'cipher': $in['method'],
            'valid': $valid
        };
    };

    /**
     * Read the encryption string from the configuration.
     * @version 2018-03-15
     * @since   2016-01-30
     * @author  ?
     * @param string $encryptionKey | Plain text encryption key
     * @return string | Hashed encryption string
     */
    $functions.push('_GetKey');
    var _GetKey = function ($encryptionKey)
    {
        "use strict";
        // the key should be random binary, use scrypt, bcrypt or PBKDF2 to
        // convert a string into a key
        // key is specified using hexadecimal

        if (_Empty($encryptionKey)) {
            return false;
        }

        // $hashedEncryptionKey = password_hash($encryptionKey, PASSWORD_BCRYPT, array('cost' => 12));
        // $key = pack('H*', $hashedEncryptionKey);
        // $key = $hashedEncryptionKey;
        return $encryptionKey;
    };

    /**
     * Generates IV
     * @version 2018-03-15
     * @since   2016-01-30
     * @author  ?
     * @param string $method
     * @return string
     */
    $functions.push('_GenerateIv');
    var _GenerateIv = function ($method)
    {
        "use strict";
        var $ivLength, $iv;
        $ivLength = _GetCipherIvLength($method);
        $iv = window.crypto.getRandomValues(new Uint8Array($ivLength));
        return $iv;
    };

    /**
     * Returns a random binary encryption key
     * @param $length
     * @return string
     */
    $functions.push('create_encryption_key');
    var create_encryption_key = function ($in)
    {
        "use strict";
        var $default = {
            'method': 'AES-CBC',
            'length_in_bytes': 16
        };
        $in = _Default($default, $in);

        window.crypto.subtle.generateKey(
            {name: "AES-CBC", length: $in.length_in_bytes * 8 }, //can be  128, 192, or 256
            false, //whether the key is extractable (i.e. can be used in exportKey)
            ["encrypt", "decrypt"] //can be "encrypt", "decrypt", "wrapKey", or "unwrapKey"
        )
        .then(function($data){
                $in.callback_function({
                    'answer': 'true',
                    'message': 'Here are the random key',
                    'key': $data
                });
            })
        .catch(function(err){
                $in.callback_function({
                    'answer': 'false',
                    'message': 'Could not generate a random key',
                    'key': ''
                });
        });

        return {};
    };

}
//# sourceURL=infohub_encrypt.js
