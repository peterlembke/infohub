<?php
/**
 * Encrypt data
 *
 * To keep your data secret and pointless to steal you can encrypt your data.
 * Encryption hide your data in a data mess. Decryption restores your data.
 * You need to provide a random and long encryption_key
 *
 * @package     Infohub
 * @subpackage  infohub_encrypt
 */

declare(strict_types=1);
if (basename(__FILE__) == basename($_SERVER['SCRIPT_FILENAME'])) {
    exit; // This file must be included, not called directly
}

/**
 * Encrypt data
 *
 * To keep your data secret and pointless to steal you can encrypt your data.
 * Encryption hide your data in a data mess. Decryption restores your data.
 * You need to provide a random and long encryption_key
 *
 * @author      Peter Lembke <info@infohub.se>
 * @version     2018-08-05
 * @since       2016-01-30
 * @copyright   Copyright (c) 2016, Peter Lembke
 * @license     https://opensource.org/licenses/gpl-license.php GPL-3.0-or-later
 * @see         https://github.com/peterlembke/infohub/blob/master/folder/plugins/infohub/checksum/infohub_checksum.md Documentation
 * @link        https://infohub.se/ InfoHub main page
 */
class infohub_encrypt extends infohub_base
{
    /**
     * Version information for this plugin
     * @return string[]
     * @since   2016-01-30
     * @author  Peter Lembke
     * @version 2018-08-05
     */
    protected function _Version(): array
    {
        return [
            'date' => '2018-08-05',
            'since' => '2016-01-30',
            'version' => '1.0.0',
            'class_name' => 'infohub_encrypt',
            'checksum' => '{{checksum}}',
            'note' => 'You can encrypt/decrypt your data keep the contents secret',
            'status' => 'normal',
            'SPDX-License-Identifier' => 'GPL-3.0-or-later',
            'user_role' => 'user'
        ];
    }

    /**
     * Public functions in this plugin
     *
     * @return array
     * @author  Peter Lembke
     * @version 2018-08-05
     * @since   2016-01-30
     */
    protected function _GetCmdFunctions(): array
    {
        $list = [
            'encrypt' => 'normal',
            'decrypt' => 'normal',
            'get_available_options' => 'normal',
            'is_method_valid' => 'normal',
            'create_encryption_key' => ''
        ];

        return parent::_GetCmdFunctionsBase($list);
    }

    // *****************************************************************************
    // * Functions you only can reach with CMD(), add more in your class
    // * Observe function names are lower_case
    // *****************************************************************************

    /**
     * Plain text to encrypted text
     * Encrypt SSL - Encrypts the plain text into encrypted text
     * @see https://secure.php.net/manual/en/function.openssl-encrypt.php PHP manual OpenSSL
     * @version 2017-06-24
     * @since   2017-06-24
     * @author  Peter Lembke
     * @param array $in
     * @return array|bool
     */
    protected function encrypt(array $in = [])
    {
        $default = [
            'plain_text' => '',
            'encryption_key' => 'infohub2010',
            'method' => 'AES-128-CBC'
        ];
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

        $cipherText = openssl_encrypt($in['plain_text'], $in['method'], $key, OPENSSL_RAW_DATA, $iv);
        if (empty($cipherText)) {
            $message = 'The cipher text could not be generated';
            goto leave;
        }

        $encryptedText = base64_encode($iv . $cipherText);

        $answer = 'true';
        $message = 'Here are the encrypted text';

        leave:
        $response = [
            'answer' => $answer,
            'message' => $message,
            'encrypted_text' => $encryptedText,
            'method' => $in['method']
        ];

        return $response;
    }

    /**
     * Encrypted text to plain text
     * Decrypt SSL - Decrypts an encrypted text into readable text.
     * @see https://secure.php.net/manual/en/function.openssl-decrypt.php PHP manual Open SSL
     * @version 2017-06-24
     * @since   2017-06-24
     * @author  Peter Lembke and ?
     * @param array $in
     * @return array|bool
     */
    protected function decrypt(array $in = [])
    {
        $default = [
            'encrypted_text' => '', // Base 64 encoded cipher text
            'encryption_key' => 'infohub2010',
            'method' => 'AES-128-CBC'
        ];
        $in = $this->_Default($default, $in);

        $answer = 'false';
        $message = 'Nothing to report';
        $plainTextDecrypted = '';

        // Some how + signs have been exchanged with spaces during the transfer to here
        $in['encrypted_text'] = str_replace(' ', '+', $in['encrypted_text']);

        $cipherText = base64_decode($in['encrypted_text'], $strict = true);
        if ($cipherText === false) {
            $message = 'Could not get the cipherText';
            $cipherText = '';
            goto leave;
        }

        if (empty($cipherText) === true) {
            $message = 'Could not base64 decode the encrypted text';
            goto leave;
        }

        $ivLength = openssl_cipher_iv_length($in['method']);
        if ($ivLength === false) {
            $message = 'Could not get the ivLength';
            $ivLength = 0;
            goto leave;
        }

        if (empty($ivLength) === true) {
            $message = 'The ivLength is zero';
            goto leave;
        }

        // retrieves the IV that we attached first to the encoded data.
        $iv = substr($cipherText, 0, $ivLength);
        if (empty($iv) === true) {
            $message = 'The iv is empty';
            goto leave;
        }

        // retrieves the cipher text by removing the iv we attached at the beginning
        $cipherText = substr($cipherText, $ivLength);
        if (empty($cipherText) === true) {
            $message = 'The encrypted text is empty';
            goto leave;
        }

        $key = $this->_GetKey($in['encryption_key']);
        if (empty($key) === true) {
            $message = 'The key is empty';
            goto leave;
        }

        $plainTextDecrypted = openssl_decrypt($cipherText, $in['method'], $key, OPENSSL_RAW_DATA, $iv);
        if ($plainTextDecrypted === false) {
            $message = 'Could not decrypt the encrypted data';
            $plainTextDecrypted = '';
            goto leave;
        }

        $plainTextDecrypted = trim($plainTextDecrypted);
        $answer = 'true';
        $message = 'Here are the plain text';

        leave:
        $response = [
            'answer' => $answer,
            'message' => $message,
            'plain_text' => $plainTextDecrypted
        ];
        return $response;
    }

    /**
     * Get list with encryption methods you can use on this server
     * @param array $in
     * @return array
     * @author  Peter Lembke
     * @version 2018-03-15
     * @since   2018-03-15
     */
    protected function get_available_options(array $in = []): array
    {
        $methods = $this->_GetCipherMethods();
        $options = [];
        foreach ($methods as $method) {
            $options[] = [
                'type' => 'option',
                'value' => $method,
                'label' => $method
            ];
        }

        return [
            'answer' => 'true',
            'message' => 'List of valid encoding methods. I have removed the weak ones',
            'options' => $options
        ];
    }

    /**
     * Get all cipher methods available except the most weak ones.
     *
     * @see https://secure.php.net/manual/en/function.openssl-get-cipher-methods.php PHP manual OpenSSL
     * @version 2018-03-15
     * @since   2018-03-15
     * @author  From PHP documentation
     * @param array $in
     * @return array
     */
    protected function _GetCipherMethods(array $in = [])
    {
        $ciphers = openssl_get_cipher_methods();
        $ciphersAndAliases = openssl_get_cipher_methods(true);
        $cipherAliases = array_diff($ciphersAndAliases, $ciphers);

        //ECB mode should be avoided
        $ciphers = array_filter(
            $ciphers,
            function ($n) {
                return stripos($n, 'ecb') === false;
            }
        );

        //At least as early as Aug 2016, Openssl declared the following weak: RC2, RC4, DES, 3DES, MD5 based
        $ciphers = array_filter(
            $ciphers,
            function ($c) {
                return stripos($c, 'des') === false;
            }
        );
        $ciphers = array_filter(
            $ciphers,
            function ($c) {
                return stripos($c, 'rc2') === false;
            }
        );
        $ciphers = array_filter(
            $ciphers,
            function ($c) {
                return stripos($c, 'rc4') === false;
            }
        );
        $ciphers = array_filter(
            $ciphers,
            function ($c) {
                return stripos($c, 'md5') === false;
            }
        );

        // Remove short keys 2019-11-19
        $ciphers = array_filter(
            $ciphers,
            function ($c) {
                return stripos($c, '128') === false;
            }
        );
        $ciphers = array_filter(
            $ciphers,
            function ($c) {
                return stripos($c, '192') === false;
            }
        );

        $cipherAliases = array_filter(
            $cipherAliases,
            function ($c) {
                return stripos($c, 'des') === false;
            }
        );
        $cipherAliases = array_filter(
            $cipherAliases,
            function ($c) {
                return stripos($c, 'rc2') === false;
            }
        );

        return $ciphers;
    }

    /**
     * Get list with encryption methods you can use on this server
     *
     * @see https://secure.php.net/manual/en/function.openssl-get-cipher-methods.php PHP manual OpenSSL
     * @version 2018-03-15
     * @since   2018-03-15
     * @author  From PHP documentation
     * @param array $in
     * @return array|bool
     */
    protected function is_method_valid(array $in = [])
    {
        $default = [
            'method' => 'AES-128-CBC'
        ];
        $in = $this->_Default($default, $in);

        $ciphers = $this->_GetCipherMethods();

        $valid = 'false';
        $message = 'This encryption method is not valid';

        if (in_array($in['method'], $ciphers) === true) {
            $valid = 'true';
            $message = 'This encryption method is valid';
        }

        return [
            'answer' => 'true',
            'message' => $message,
            'cipher' => $in['method'],
            'valid' => $valid
        ];
    }

    /**
     * Read the encryption string from the configuration.
     *
     * @param  string  $encryptionKey  Plain text encryption key
     * @return string Hashed encryption string
     * @author  ?
     * @version 2018-03-15
     * @since   2016-01-30
     */
    protected function _GetKey(string $encryptionKey = ''): string
    {
        // the key should be random binary, use scrypt, bcrypt or PBKDF2 to
        // convert a string into a key
        // key is specified using hexadecimal

        if (empty($encryptionKey) === true) {
            return '';
        }

        // $hashedEncryptionKey = password_hash($encryptionKey, PASSWORD_BCRYPT, array('cost' => 12));
        // $key = pack('H*', $hashedEncryptionKey);
        // $key = $hashedEncryptionKey;

        return $encryptionKey;
    }

    /**
     * Generates IV
     *
     * @param string $method
     * @return string
     * @author  ?
     * @version 2021-12-23
     * @since   2016-01-30
     */
    protected function _GenerateIv(string $method = 'AES-128-CBC'): string
    {
        $ivLength = openssl_cipher_iv_length($method);
        if ($ivLength === false) {
            $ivLength = 0;
        }

        $iv = str_repeat($stringToRepeat ='0', $ivLength);
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
    protected function create_encryption_key(array $in = []): array
    {
        $default = [
            'length_in_bytes' => 255
        ];
        $in = $this->_Default($default, $in);

        $data = '';

        if (function_exists('random_bytes') === true) {
            $data = random_bytes($in['length_in_bytes']); // PHP >= 7
            goto leave;
        }

        if (function_exists('openssl_random_pseudo_bytes') === true) {
            $data = openssl_random_pseudo_bytes($in['length_in_bytes']); // PHP < 7
            goto leave;
        }

        leave:

        return [
            'answer' => 'true',
            'message' => 'Here are the random key',
            'key' => $data
        ];
    }
}
