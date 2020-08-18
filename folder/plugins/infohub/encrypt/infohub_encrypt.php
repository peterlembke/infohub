<?php
declare(strict_types=1);
if (basename(__FILE__) == basename($_SERVER["SCRIPT_FILENAME"])) {
    exit; // This file must be included, not called directly
}

/**
 * Class infohub_encrypt
 * To keep your data secret and pointless to steal you can encrypt your data.
 * Encryption hide your data in a data mess. Decryption restores your data.
 * You need to provide a random and long encryption_key
 * @category InfoHub
 * @package Encrypt
 * @copyright Copyright (c) 2016, Peter Lembke, CharZam soft
 * @since 2016-01-30
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
 */
class infohub_encrypt extends infohub_base
{
    Protected final function _Version(): array
    {
        return array(
            'date' => '2018-08-05',
            'since' => '2016-01-30',
            'version' => '1.0.0',
            'class_name' => 'infohub_encrypt',
            'checksum' => '{{checksum}}',
            'note' => 'You can encrypt/decrypt your data keep the contents secret',
            'status' => 'normal',
            'SPDX-License-Identifier' => 'GPL-3.0-or-later',
            'user_role' => 'user'
        );
    }

    protected function _GetCmdFunctions(): array
    {
        $list = array(
            'encrypt' => 'normal',
            'decrypt' => 'normal',
            'get_available_options' => 'normal',
            'is_method_valid' => 'normal',
            'create_encryption_key' => ''
        );

        return parent::_GetCmdFunctionsBase($list);
    }

    // *****************************************************************************
    // * Functions you only can reach with CMD(), add more in your class
    // * Observe function names are lower_case
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
    final protected function encrypt(array $in = array())
    {
        $default = array(
            'plain_text' => '',
            'encryption_key' => 'infohub2010',
            'method' => 'AES-128-CBC'
        );
        $in = $this->_Default($default, $in);

        $answer = 'false';
        $message = 'Nothing to report';
        $encryptedText = '';

        if (empty($in['encryption_key'])) {
            $message = 'encryption_key is empty';
            goto leave;
        }

        $key = $this->_GetKey($in['encryption_key']);
        if (empty($key)) {
            $message = 'Key is empty';
            goto leave;
        }

        $ivLength = openssl_cipher_iv_length($in['method']);
        if (empty($ivLength)) {
            $message = 'The ivLength is zero';
            goto leave;
        }

        $iv = $this->_GenerateIv($in['method']);
        if (empty($iv)) {
            $message = 'The IV could not be generated, probably because the method is not supported';
            goto leave;
        }

        $cipherText = openssl_encrypt($in['plain_text'],  $in['method'], $key, OPENSSL_RAW_DATA, $iv);
        if (empty($cipherText)) {
            $message = 'The cipher text could not be generated';
            goto leave;
        }

        $encryptedText = base64_encode($iv . $cipherText);

        $answer = 'true';
        $message = 'Here are the encrypted text';

        leave:
        $response = array(
            'answer' => $answer,
            'message' => $message,
            'encrypted_text' => $encryptedText,
            'method' => $in['method']
        );
        return $response;
    }

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
    final protected function decrypt(array $in = array())
    {
        $default = array(
            'encrypted_text' => '', // Base 64 encoded cipher text
            'encryption_key' => 'infohub2010',
            'method' => 'AES-128-CBC'
        );
        $in = $this->_Default($default, $in);

        $answer = 'false';
        $message = 'Nothing to report';
        $plainTextDecrypted = '';

        // Some how + signs have been exchanged with spaces during the transfer to here
        $in['encrypted_text'] = str_replace(' ', '+', $in['encrypted_text']);

        $cipherText = base64_decode($in['encrypted_text'], $strict = true);
        if (empty($cipherText)) {
            $message = 'Could not base64 decode the encrypted text';
            goto leave;
        }

        $ivLength = openssl_cipher_iv_length($in['method']);
        if (empty($ivLength)) {
            $message = 'The ivLength is zero';
            goto leave;
        }

        // retrieves the IV that we attached first to the encoded data.
        $iv = substr($cipherText, 0, $ivLength);
        if (empty($iv)) {
            $message = 'The iv is empty';
            goto leave;
        }

        // retrieves the cipher text by removing the iv we attached at the beginning
        $cipherText = substr($cipherText, $ivLength);
        if (empty($cipherText)) {
            $message = 'The encrypted text is empty';
            goto leave;
        }

        $key = $this->_GetKey($in['encryption_key']);
        if (empty($key)) {
            $message = 'The key is empty';
            goto leave;
        }

        $plainTextDecrypted  = openssl_decrypt($cipherText, $in['method'], $key, OPENSSL_RAW_DATA, $iv);
        if ($plainTextDecrypted === false) {
            $message = 'Could not decrypt the encrypted data';
            goto leave;
        }

        $plainTextDecrypted = trim($plainTextDecrypted);
        $answer = 'true';
        $message = 'Here are the plain text';

        leave:
        $response = array(
            'answer' => $answer,
            'message' => $message,
            'plain_text' => $plainTextDecrypted
        );
        return $response;
    }

    /**
     * Get list with encryption methods you can use on this server
     * @version 2018-03-15
     * @since   2018-03-15
     * @author  Peter Lembke
     * @param array $in
     * @return array|bool
     */
    final protected function get_available_options(array $in = array())
    {
        $methods = $this->_GetCipherMethods();
        $options = array();
        foreach ($methods as $method) {
            $options[] = array("type"=> "option", "value"=> $method, "label"=> $method );
        }

        return array(
            'answer' => 'true',
            'message' => 'List of valid encoding methods. I have removed the weak ones',
            'options' => $options
        );
    }

    /**
     * Get all cipher methods available except the most weak ones.
     * https://secure.php.net/manual/en/function.openssl-get-cipher-methods.php
     * @version 2018-03-15
     * @since   2018-03-15
     * @author  From PHP documentation
     * @param array $in
     * @return array
     */
    final protected function _GetCipherMethods(array $in = array())
    {
        $ciphers = openssl_get_cipher_methods();
        $ciphersAndAliases = openssl_get_cipher_methods(true);
        $cipherAliases = array_diff($ciphersAndAliases, $ciphers);

        //ECB mode should be avoided
        $ciphers = array_filter( $ciphers, function($n) { return stripos($n,"ecb") === false; } );

        //At least as early as Aug 2016, Openssl declared the following weak: RC2, RC4, DES, 3DES, MD5 based
        $ciphers = array_filter( $ciphers, function($c) { return stripos($c,"des") === false; } );
        $ciphers = array_filter( $ciphers, function($c) { return stripos($c,"rc2") === false; } );
        $ciphers = array_filter( $ciphers, function($c) { return stripos($c,"rc4") === false; } );
        $ciphers = array_filter( $ciphers, function($c) { return stripos($c,"md5") === false; } );

        // Remove short keys 2019-11-19
        $ciphers = array_filter( $ciphers, function($c) { return stripos($c,"128") === false; } );
        $ciphers = array_filter( $ciphers, function($c) { return stripos($c,"192") === false; } );

        $cipherAliases = array_filter($cipherAliases,function($c) { return stripos($c,"des") === false; } );
        $cipherAliases = array_filter($cipherAliases,function($c) { return stripos($c,"rc2") === false; } );

        return $ciphers;
    }

    /**
     * Get list with encryption methods you can use on this server
     * https://secure.php.net/manual/en/function.openssl-get-cipher-methods.php
     * @version 2018-03-15
     * @since   2018-03-15
     * @author  From PHP documentation
     * @param array $in
     * @return array|bool
     */
    final protected function is_method_valid(array $in = array())
    {
        $default = array(
            'method' => 'AES-128-CBC'
        );
        $in = $this->_Default($default, $in);

        $ciphers = $this->_GetCipherMethods();

        $valid = 'false';
        $message = 'This encryption method is not valid';

        if (in_array($in['method'], $ciphers) === true) {
            $valid = 'true';
            $message = 'This encryption method is valid';
        }

        return array(
            'answer' => 'true',
            'message' => $message,
            'cipher' => $in['method'],
            'valid' => $valid
        );
    }

    /**
     * Read the encryption string from the configuration.
     * @version 2018-03-15
     * @since   2016-01-30
     * @author  ?
     * @param string $encryptionKey | Plain text encryption key
     * @return string | Hashed encryption string
     */
    final protected function _GetKey($encryptionKey = '') {
        # the key should be random binary, use scrypt, bcrypt or PBKDF2 to
        # convert a string into a key
        # key is specified using hexadecimal

        if (empty($encryptionKey)) {
            return false;
        }

        // $hashedEncryptionKey = password_hash($encryptionKey, PASSWORD_BCRYPT, array('cost' => 12));
        // $key = pack('H*', $hashedEncryptionKey);
        // $key = $hashedEncryptionKey;
        return $encryptionKey;
    }

    /**
     * Generates IV
     * @version 2018-03-15
     * @since   2016-01-30
     * @author  ?
     * @param string $method
     * @return string
     */
    final protected function _GenerateIv(string $method = 'AES-128-CBC') {
        $ivLength = openssl_cipher_iv_length($method);
        $iv = str_repeat('0', $ivLength);
        $isStrong = false; // Will be set to true by the function if the algorithm used was cryptographically secure
        $try = 5;
        do {
            $iv = openssl_random_pseudo_bytes($ivLength, $isStrong);
            $try--;
        } while ($isStrong === false and $try > 0);

        return $iv;
    }

    /**
     * Returns a random binary encryption key
     *
     * @param array $in
     * @return array
     * @throws Exception
     */
    final protected function create_encryption_key(array $in = array())
    {
        $default = array(
            'length_in_bytes' => 255
        );
        $in = $this->_Default($default, $in);

        $data = '';
        if (function_exists('random_bytes')) {
            $data = random_bytes($in['length_in_bytes']); // PHP >= 7
        }
        else if (function_exists('openssl_random_pseudo_bytes')) {
            $data = openssl_random_pseudo_bytes($in['length_in_bytes']); // PHP < 7
        }

        return array(
            'answer' => 'true',
            'message' => 'Here are the random key',
            'key' => $data
        );
    }

}
