<?php
declare(strict_types=1);
if (basename(__FILE__) == basename($_SERVER["SCRIPT_FILENAME"])) {
    exit; // This file must be included, not called directly
}

/**
 * infohub_call calls a web address and fetches an answer.
 * @category InfoHub
 * @package Call
 * @copyright Copyright (c) 2020, Peter Lembke, CharZam soft
 * @since 2020-10-04
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
class infohub_call extends infohub_base
{

    protected final function _Version(): array
    {
        return array(
            'date' => '2020-10-04',
            'version' => '1.0.0',
            'class_name' => 'infohub_call',
            'checksum' => '{{checksum}}',
            'note' => 'Does a HTTPS call to a URL and GET/POST data',
            'status' => 'normal',
            'SPDX-License-Identifier' => 'GPL-3.0-or-later',
            'user_role' => 'user'
        );
    }

    protected function _GetCmdFunctions(): array
    {
        $list = array(
            'call' => 'normal'
        );

        return parent::_GetCmdFunctionsBase($list);
    }

    // ***********************************************************
    // * your class functions below, only use protected functions
    // ***********************************************************

    /**
     * Calls a web address and fetches an answer
     * Can pass GET-parameters and POST-data to that server
     * Supports certificates
     * @version 2020-10-04
     * @since   2020-10-04
     * @author  Peter Lembke
     * @param array $in
     * @return array
     */
    protected function call(array $in = array()): array
    {
        $requirementsResponse = $this->_AreRequirementsFulfilled();
        if ($requirementsResponse['answer'] === 'false') {
            return array(
                'answer' => 'false',
                'message' => $requirementsResponse['message']
            );
        }

        $default = array(
            'port' => 443,      // default SSL port
            'url' => '',        // URL to call
            'mode' => 'post',   // get or post
            'data' => array(),  // Data to send, Used by GET if post_data is empty
            'post_data' => '',  // Same data but in a string. Used by POST and GET
            'certificate_pem' => '', // Path to the .pem file, used for SSL
            'certificate_pem_password' => '',
            'certificate_key' => '', // path to the .key file, used for SSL
            'certificate_key_password' => '',
            'certificate_ca' => '',
            'curl_logging' => 'false'
        );
        $in = $this->_Default($default, $in);

        if ($in['port'] !== 80 && $requirementsResponse['ssl'] === 'false') {
            return array(
                'answer' => 'false',
                'message' => 'You try to do an SSL call but SSL is not installed'
            );
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
        $responseString = (string) curl_exec($curlHandle);
        $curlInfo = curl_getinfo($curlHandle);
        $code = (string) $curlInfo['http_code'];
        $curlError = (string) curl_error($curlHandle);
        curl_close($curlHandle);

        $curlLog = '';
        if ($in['curl_logging'] === 'true') {
            $curlLog = $this->_GetVerboseLogging($fileHandle);
            fclose($fileHandle);
        }

        $out = array(
            'answer' => 'true',
            'message' => 'Got response',
            'error' => $curlError,
            'request_array' => $in,
            'response_string' => $responseString,
            'curl_info' => $curlInfo,
            'code' => $code,
            'curl_log' => $curlLog
        );

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

        return array(
            'answer' => $answer,
            'message' => $message,
            'curl' => $curl,
            'ssl' => $ssl
        );
    }

    /**
     * Get all parameters used in the call
     * http://php.net/manual/en/function.curl-setopt.php
     * @param array $in
     * @return array
     */
    protected function _GetCurlOptArray($in = array())
    {
        $default = array(
            'port' => 443,      // default SSL port
            'url' => '',        // URL to call
            'mode' => 'post',   // get or post
            'post_data' => '',   // Used by POST
            'certificate_pem' => '', // Path to the .pem file, used for SSL
            'certificate_pem_password' => '',
            'certificate_key' => '', // path to the .key file, used for SSL
            'certificate_key_password' => '',
            'certificate_ca' => ''
        );
        $in = $this->_Default($default, $in);

        $curlOptArray = array(
            CURLOPT_URL => $in['url'],
            CURLOPT_PORT => $in['port'],
            CURLOPT_FRESH_CONNECT => 1,
            CURLOPT_RETURNTRANSFER => 1,
            CURLOPT_FORBID_REUSE => 1,
            CURLOPT_TIMEOUT => 4,
            CURLOPT_HEADER => 1
        );

        if ($in['mode'] === 'post') {
            $curlOptArrayPost = array(
                CURLOPT_POST => 1,
                CURLOPT_HTTPHEADER => array('Content-Type: application/json'),
                CURLOPT_POSTFIELDS => $in['post_data'],
            );
            $curlOptArray = $curlOptArrayPost + $curlOptArray;
        }

        if ($in['mode'] === 'get') {
            $curlOptArrayGet = array(
            );
            $curlOptArray = $curlOptArrayGet + $curlOptArray;
        }

        if ($in['port'] !== 80) {
            $curlOptArraySsl = array(
                CURLOPT_SSLCERT => $in['certificate_pem'],
                CURLOPT_SSLCERTPASSWD => $in['certificate_pem_password'],
                CURLOPT_SSLKEY => $in['certificate_key'],
                CURLOPT_SSLKEYPASSWD => $in['certificate_key_password'],
                CURLOPT_CAINFO => $in['certificate_ca'],
                CURLOPT_SSL_VERIFYHOST => 2,
                CURLOPT_SSL_VERIFYPEER => true
            );
            $curlOptArray = $curlOptArraySsl + $curlOptArray;
        }

        return $curlOptArray;
    }

    /**
     * Get a file handler
     * @return false|resource
     */
    protected function _GetStdErrFileHandle() {
        $fileName = 'php://temp';
        $fileHandle = fopen($fileName, 'a+');

        return $fileHandle;
    }

    /**
     * Get the verbose curl logging for this call.
     * @see https://stackoverflow.com/questions/9550319/bad-request-connecting-to-sites-via-curl-on-host-and-system/62453208#62453208
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
