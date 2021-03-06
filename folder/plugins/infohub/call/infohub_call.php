<?php
/**
 * infohub_call calls a web address and fetches an answer.
 *
 * @package     Infohub
 * @subpackage  infohub_call
 */

declare(strict_types=1);
if (basename(__FILE__) == basename($_SERVER["SCRIPT_FILENAME"])) {
    exit; // This file must be included, not called directly
}

/**
 * infohub_call calls a web address and fetches an answer.
 *
 * @author      Peter Lembke <info@infohub.se>
 * @version     2020-10-04
 * @since       2020-10-04
 * @copyright   Copyright (c) 2020, Peter Lembke
 * @license     https://opensource.org/licenses/gpl-license.php GPL-3.0-or-later
 * @see         https://github.com/peterlembke/infohub/blob/master/folder/plugins/infohub/call/infohub_call.md Documentation
 * @link        https://infohub.se/ InfoHub main page
 */
class infohub_call extends infohub_base
{
    /**
     * Version information for this plugin
     * @return array
     * @since   2020-10-04
     * @author  Peter Lembke
     * @version 2020-10-04
     */
    protected function _Version(): array
    {
        return [
            'date' => '2020-10-04',
            'version' => '1.0.0',
            'class_name' => 'infohub_call',
            'checksum' => '{{checksum}}',
            'note' => 'Does a HTTPS call to a URL and GET/POST data',
            'status' => 'normal',
            'SPDX-License-Identifier' => 'GPL-3.0-or-later',
            'user_role' => 'user'
        ];
    }

    /**
     * Public functions in this plugin
     * @return mixed
     * @since   2020-10-04
     * @author  Peter Lembke
     * @version 2020-10-04
     */
    protected function _GetCmdFunctions(): array
    {
        $list = [
            'call' => 'normal'
        ];

        return parent::_GetCmdFunctionsBase($list);
    }

    // ***********************************************************
    // * your class functions below, only use protected functions
    // ***********************************************************

    /**
     * Calls a web address and fetches an answer
     * Can pass GET-parameters and POST-data to that server
     * Supports certificates
     * @param array $in
     * @return array
     * @author  Peter Lembke
     * @version 2020-10-04
     * @since   2020-10-04
     */
    protected function call(array $in = []): array
    {
        $requirementsResponse = $this->_AreRequirementsFulfilled();
        if ($requirementsResponse['answer'] === 'false') {
            return [
                'answer' => 'false',
                'message' => $requirementsResponse['message']
            ];
        }

        $default = [
            'port' => 443,      // default SSL port
            'url' => '',        // URL to call
            'mode' => 'post',   // get or post
            'data' => [],  // Data to send, Used by GET if post_data is empty
            'post_data' => '',  // Same data but in a string. Used by POST and GET
            'certificate_pem' => '', // Path to the .pem file, used for SSL
            'certificate_pem_password' => '',
            'certificate_key' => '', // path to the .key file, used for SSL
            'certificate_key_password' => '',
            'certificate_ca' => '',
            'curl_logging' => 'false'
        ];
        $in = $this->_Default($default, $in);

        if ($in['port'] !== 80 && $requirementsResponse['ssl'] === 'false') {
            return [
                'answer' => 'false',
                'message' => 'You try to do an SSL call but SSL is not installed'
            ];
        }

        if ($in['mode'] === 'get') {
            if ($in['post_data'] === '' and count($in['data']) > 0) {
                $in['post_data'] = http_build_query($in['data']);
            }
            if ($in['post_data'] !== '') {
                $in['url'] = $in['url'] . '?' . $in['post_data'];
            }
        }

        $curlOptArray = $this->_GetCurlOptArray($in);

        if ($in['curl_logging'] === true) {
            $fileHandle = $this->getStdErrFileHandle();
            $curlOptArray[CURLOPT_STDERR] = $fileHandle;
            $curlOptArray[CURLOPT_VERBOSE] = true;
            $curlOptArray[CURLOPT_CERTINFO] = true;
            $curlOptArray[CURLOPT_FOLLOWLOCATION] = true;
        }

        $curlHandle = curl_init();
        curl_setopt_array($curlHandle, $curlOptArray);
        $responseString = (string)curl_exec($curlHandle);
        $curlInfo = curl_getinfo($curlHandle);
        $code = (string)$curlInfo['http_code'];
        $curlError = (string)curl_error($curlHandle);
        curl_close($curlHandle);

        $curlLog = '';
        if ($in['curl_logging'] === 'true') {
            $curlLog = $this->_GetVerboseLogging($fileHandle);
            fclose($fileHandle);
        }

        $out = [
            'answer' => 'true',
            'message' => 'Got response',
            'error' => $curlError,
            'request_array' => $in,
            'response_string' => $responseString,
            'curl_info' => $curlInfo,
            'code' => $code,
            'curl_log' => $curlLog
        ];

        if ($code !== '200' && $code !== '201' && empty($responseString) === true) {
            $out['answer'] = 'false';
            $out['message'] = 'Transfer failed';
        }

        return $out;
    }

    /**
     * Check if Curl and SSL are active in PHP
     * @return array
     */
    protected function _AreRequirementsFulfilled(): array
    {
        $answer = 'false';
        $curl = 'false';
        $ssl = 'false';
        $message = 'We do not have curl installed';

        if (function_exists('curl_init') === true) {
            $answer = 'true';
            $message = 'Good. We have curl installed';
            $curl = 'true';
        }

        $info = curl_version();
        if (is_string($info) === true) {
            if (strpos($info, 'OpenSSL') !== false) {
                $ssl = 'true';
            }
        }
        if (is_array($info) === true) {
            if (isset($info['ssl_version']) === true) {
                $ssl = 'true';
            }
        }

        return [
            'answer' => $answer,
            'message' => $message,
            'curl' => $curl,
            'ssl' => $ssl
        ];
    }

    /**
     * Get all parameters used in the call
     * @see http://php.net/manual/en/function.curl-setopt.php PHP manual for CURL
     * @param array $in
     * @return array
     */
    protected function _GetCurlOptArray($in = [])
    {
        $default = [
            'port' => 443,      // default SSL port
            'url' => '',        // URL to call
            'mode' => 'post',   // get or post
            'post_data' => '',   // Used by POST
            'certificate_pem' => '', // Path to the .pem file, used for SSL
            'certificate_pem_password' => '',
            'certificate_key' => '', // path to the .key file, used for SSL
            'certificate_key_password' => '',
            'certificate_ca' => ''
        ];
        $in = $this->_Default($default, $in);

        $curlOptArray = [
            CURLOPT_URL => $in['url'],
            CURLOPT_PORT => $in['port'],
            CURLOPT_FRESH_CONNECT => 1,
            CURLOPT_RETURNTRANSFER => 1,
            CURLOPT_FORBID_REUSE => 1,
            CURLOPT_TIMEOUT => 4,
            CURLOPT_HEADER => 1
        ];

        if ($in['mode'] === 'post') {
            $curlOptArrayPost = [
                CURLOPT_POST => 1,
                CURLOPT_HTTPHEADER => ['Content-Type: application/json'],
                CURLOPT_POSTFIELDS => $in['post_data'],
            ];
            $curlOptArray = $curlOptArrayPost + $curlOptArray;
        }

        if ($in['mode'] === 'get') {
            $curlOptArrayGet = [
            ];
            $curlOptArray = $curlOptArrayGet + $curlOptArray;
        }

        if ($in['port'] !== 80) {
            $curlOptArraySsl = [
                CURLOPT_SSLCERT => $in['certificate_pem'],
                CURLOPT_SSLCERTPASSWD => $in['certificate_pem_password'],
                CURLOPT_SSLKEY => $in['certificate_key'],
                CURLOPT_SSLKEYPASSWD => $in['certificate_key_password'],
                CURLOPT_CAINFO => $in['certificate_ca'],
                CURLOPT_SSL_VERIFYHOST => 2,
                CURLOPT_SSL_VERIFYPEER => true
            ];
            $curlOptArray = $curlOptArraySsl + $curlOptArray;
        }

        return $curlOptArray;
    }

    /**
     * Get a file handler
     * @return false|resource
     */
    protected function _GetStdErrFileHandle()
    {
        $fileName = 'php://temp';
        $fileHandle = fopen($fileName, 'a+');

        return $fileHandle;
    }

    /**
     * Get the verbose curl logging for this call.
     * @see https://stackoverflow.com/questions/9550319/bad-request-connecting-to-sites-via-curl-on-host-and-system/62453208#62453208 stackoverflow
     * @param $fileHandle
     * @return string
     */
    protected function _GetVerboseLogging($fileHandle): string
    {
        rewind($fileHandle);
        $verboseLog = stream_get_contents($fileHandle);

        $safeLog = htmlspecialchars($verboseLog);

        return $safeLog;
    }
}
