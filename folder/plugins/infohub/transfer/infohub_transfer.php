<?php
/**
 * Transfer data to other nodes
 *
 * Handles the login and transfer of data to other nodes.
 * Checks that the package are signed.
 *
 * @package     Infohub
 * @subpackage  infohub_transfer
 */

declare(strict_types=1);
if (basename(__FILE__) == basename($_SERVER["SCRIPT_FILENAME"])) {
    exit; // This file must be included, not called directly
}

/**
 * Transfer data to other nodes
 *
 * Handles the login and transfer of data to other nodes.
 * Checks that the package are signed.
 *
 * @author      Peter Lembke <info@infohub.se>
 * @version     2015-09-20
 * @since       2012-01-01
 * @copyright   Copyright (c) 2012, Peter Lembke
 * @license     https://opensource.org/licenses/gpl-license.php GPL-3.0-or-later
 * @see         https://github.com/peterlembke/infohub/blob/master/folder/plugins/infohub/transfer/infohub_transfer.md Documentation
 * @link        https://infohub.se/ InfoHub main page
 */
class infohub_transfer extends infohub_base
{

    const PACKAGE_SIZE_GETTING_LARGE_IN_BYTES = 1024 * 1024;

    /**
     * Version information for this plugin
     * @return  string[]
     * @since   2012-01-01
     * @author  Peter Lembke
     * @version 2015-09-20
     */
    protected function _Version(): array
    {
        return [
            'date' => '2015-09-20',
            'since' => '2012-01-01',
            'version' => '1.0.0',
            'class_name' => 'infohub_transfer',
            'checksum' => '{{checksum}}',
            'note' => 'Transfer messages to the client and to other servers on the internet',
            'status' => 'normal',
            'SPDX-License-Identifier' => 'GPL-3.0-or-later',
            'user_role' => 'user'
        ];
    }

    /**
     * Public functions in this plugin
     * @return mixed
     * @since   2012-01-01
     * @author  Peter Lembke
     * @version 2015-09-20
     */
    protected function _GetCmdFunctions(): array
    {
        $list = [
            'send' => 'normal',
            'download' => 'emerging'
        ];

        return parent::_GetCmdFunctionsBase($list);
    }

    // *****************************************************************************
    // * The private functions, add your own in your plugin
    // * These functions can be used directly in your functions.
    // * Name: _CamelCaseData
    // *****************************************************************************

    // *****************************************************************************
    // * Functions you only can reach with CMD()
    // * Observe! function names are lower_case
    // *****************************************************************************

    /**
     * Send everything in to_node as a JSON to each node
     * @param array $in
     * @return array
     * @author Peter Lembke
     * @version 2013-11-21
     * @since 2013-11-21
     * @uses
     */
    protected function send(array $in = []): array
    {
        $default = [
            'step' => 'step_sign_code',
            'to_node' => [],
            'config' => [
                'session_id' => '',
                'add_clear_text_messages' => 'false' // for debug purposes
            ],
            'data_back' => [
                'package' => []
            ],
            'response' => []
        ];
        $in = $this->_Default($default, $in);

        $out = [
            'answer' => 'true',
            'message' => 'Nothing to report',
            'wait_milliseconds' => 0,
            'message_count' => 0,
            'messages' => []
        ];

        if ($in['step'] === 'step_sign_code') {
            $messagesArray = [];

            foreach ($in['to_node'] as $nodeName => $messages) {
                foreach ($messages as $nr => $oneMessage) {
                    $messages[$nr] = $this->_CleanMessage($oneMessage);
                }

                $messagesJson = $this->_JsonEncode($messages);
                $messagesEncoded = base64_encode($messagesJson);
                $messagesChecksum = md5($messagesEncoded);

                $package = [ // to_node and messages must be first or the kick out tests will kick in.
                    'to_node' => $nodeName,
                    'messages' => $messages,
                    'messages_encoded' => $messagesEncoded,
                    'messages_encoded_length' => strlen($messagesEncoded),
                    'messages_checksum' => $messagesChecksum,
                    'package_type' => '2020',
                    'session_id' => $in['config']['session_id'],
                    'sign_code' => '',
                    'sign_code_created_at' => '',
                    'banned_seconds' => 0.0,
                    'banned_until' => 0.0
                ];

                $messageOut = $this->_SubCall(
                    [
                        'to' => [
                            'node' => 'server',
                            'plugin' => 'infohub_session',
                            'function' => 'get_banned_until'
                        ],
                        'data' => [],
                        'data_back' => [
                            'package' => $package,
                            'step' => 'step_get_banned_until_response'
                        ],
                    ]
                );

                $messagesArray[] = $messageOut;
            }

            $out['messages'] = $messagesArray;
            $in['step'] = 'step_end';
        }

        if ($in['step'] === 'step_get_banned_until_response') {
            $default = [
                'answer' => 'false',
                'message' => '',
                'banned_until' => 0.0,
                'banned_seconds' => 0.0,
                'banned' => 'true'
            ];
            $in['response'] = $this->_Default($default, $in['response']);

            $in['data_back']['package']['banned_seconds'] = $in['response']['banned_seconds'];
            $in['data_back']['package']['banned_until'] = $in['response']['banned_until'];

            $in['step'] = 'step_sign_code';
            if ($in['config']['session_id'] === '') {
                $in['step'] = 'step_respond';
            }
        }

        if ($in['step'] === 'step_sign_code') {
            return $this->_SubCall(
                [
                    'to' => [
                        'node' => 'server',
                        'plugin' => 'infohub_session',
                        'function' => 'responder_calculate_sign_code'
                    ],
                    'data' => [
                        'session_id' => $in['config']['session_id'],
                        'messages_checksum' => $in['data_back']['package']['messages_checksum'],
                        // md5 checksum of all messages in the package
                    ],
                    'data_back' => [
                        'package' => $in['data_back']['package'],
                        'step' => 'step_sign_code_response'
                    ],
                ]
            );
        }

        if ($in['step'] === 'step_sign_code_response') {
            $default = [
                'answer' => 'false',
                'message' => 'Nothing to report',
                'sign_code' => '',
                'sign_code_created_at' => '',
                'session_id' => ''
            ];
            $in['response'] = $this->_Default($default, $in['response']);

            $in['data_back']['package']['sign_code'] = $in['response']['sign_code'];
            $in['data_back']['package']['sign_code_created_at'] = $in['response']['sign_code_created_at'];
            $in['data_back']['package']['session_id'] = $in['response']['session_id'];

            $in['step'] = 'step_respond';
        }

        if ($in['step'] === 'step_respond') {
            $nodeName = $in['data_back']['package']['to_node'];
            unset($in['data_back']['package']['to_node']);

            unset($in['data_back']['package']['messages_checksum']);

            if ($in['config']['add_clear_text_messages'] === 'false') {
                unset($in['data_back']['package']['messages']); // Can be kept for debug purposes
            }
            if ($in['data_back']['package']['messages_encoded_length'] > self::PACKAGE_SIZE_GETTING_LARGE_IN_BYTES) {
                unset($in['data_back']['package']['messages']); // We need to reduce the package size
            }

            $packageJson = $this->_JsonEncode($in['data_back']['package']);
            if ($packageJson === false) {
                $packageJson = 'error: Server could not json encode the data.';
            }

            if ($nodeName === 'client') {
                $chunks = str_split($packageJson, 64 * 1024);
                if (count($chunks) > 1) {
                    $debug = 1;
                }
                foreach ($chunks as $chunk) {
                    print $chunk; // Print does not support unlimited lengths
                }
            }

            $out['answer'] = 'true';
            $out['message'] = 'Sent message to node:' . $nodeName . ', with ' . strlen(
                    $packageJson
                ) . ' bytes of data.';
        }

        return [
            'answer' => $out['answer'],
            'message' => $out['message'],
            'wait_milliseconds' => $out['wait_milliseconds'],
            'message_count' => $out['message_count'],
            'messages' => $out['messages']
        ];
    }

    /**
     * Remove unneeded data from the message to make it smaller before sending
     * @param array $in
     * @return array
     * @author Peter Lembke
     * @version 2018-03-30
     * @since 2018-03-30
     */
    protected function _CleanMessage(array $in = []): array
    {
        $default = [
            'to' => [],
            'callstack' => [],
            'data' => [],
        ];
        $oneMessage = $this->_Default($default, $in);

        if (isset($oneMessage['data']['data_back'])) {
            if (isset($oneMessage['data']['data_back']['data_back'])) {
                unset($oneMessage['data']['data_back']['data_back']);
            }
            if (isset($oneMessage['data']['data_back']['response'])) {
                unset($oneMessage['data']['data_back']['response']);
            }
            foreach ($oneMessage['data']['data_back'] as $key => $data) {
                unset($oneMessage['data'][$key]);
            }
        }

        if (isset($oneMessage['data']['response'])) {
            if (isset($oneMessage['data']['response']['data_back'])) {
                unset($oneMessage['data']['response']['data_back']);
            }
            if (isset($oneMessage['data']['response']['response'])) {
                unset($oneMessage['data']['response']['response']);
            }
            foreach ($oneMessage['data']['response'] as $key => $data) {
                unset($oneMessage['data'][$key]);
            }
        }

        // We will not try to upset the other node by manipulate the step parameter in the function we call.
        if (isset($oneMessage['data']['step'])) {
            unset($oneMessage['data']['step']);
        }

        return $oneMessage;
    }

    /**
     * Download file with cUrl
     * @param array $in
     * @return array
     */
    protected function download(array $in = []): array
    {
        return $this->internal_Download($in);
    }

    /**
     * Download file with cUrl
     * https://www.jonasjohn.de/snippets/php/curl-example.htm
     * Deprecated: http://www.smooka.com/blog/2009/07/24/maintaining-php-session-when-using-curl/
     * @param array $in
     * @return array
     * @author Peter Lembke
     * @since 2013-05-30
     * @version 2016-02-12
     */
    protected function internal_Download(array $in = []): array
    {
        $default = [
            'url' => '',
            'session_id' => '',
            'post_data' => ''
        ];
        $in = $this->_Default($default, $in);

        if (!function_exists('curl_init')) {
            return [
                'answer' => 'false',
                'message' => 'cURL is not installed on the server, can not continue'
            ];
        }

        $cookies = [];
        if ($in['session_id'] !== '') {
            $cookies[] = 'PHPSESSID=' . $in['session_id'];
        }
        $cookies[] = 'XDEBUG_SESSION=netbeans-xdebug';
        $cookieString = implode(';', $cookies);

        $fileName = LOG . DS . 'infohub_transfer_curl.log';
        $fileHandle = fopen($fileName, 'a+');

        $requestScheme = 'http';
        if (isset($_SERVER['REQUEST_SCHEME'])) {
            $requestScheme = $_SERVER['REQUEST_SCHEME'];
        }

        $refererUrl = '';
        $scriptFileName = $this->_getScriptFileName();
        if (isset($_SERVER['SERVER_NAME']) and isset($_SERVER['REQUEST_URI'])) {
            $refererUrl = $requestScheme . '://' . $_SERVER['SERVER_NAME'] . str_replace(
                    $scriptFileName,
                    '',
                    $_SERVER['SCRIPT_NAME']
                );
        }

        $curlOptArray = [
            CURLOPT_URL => $in['url'],
            CURLOPT_COOKIE => $cookieString,
            CURLOPT_REFERER => $refererUrl,
            CURLOPT_USERAGENT => $_SERVER['HTTP_USER_AGENT'],
            CURLOPT_RETURNTRANSFER => 1,
            CURLOPT_TIMEOUT => 6,
            CURLOPT_HEADER => false,
            CURLOPT_POST => 1,
            CURLOPT_POSTFIELDS => 'package=' . $in['post_data'],
            CURLOPT_STDERR => $fileHandle,
        ];

        $curlHandle = curl_init();
        curl_setopt_array($curlHandle, $curlOptArray);

        session_write_close();
        $incomingData = curl_exec($curlHandle);
        session_start();

        $curlInfo = curl_getinfo($curlHandle);
        $httpCode = (string)$curlInfo['http_code'];
        $curlError = (string)curl_error($curlHandle);
        curl_close($curlHandle);
        fclose($fileHandle);

        $answer = 'true';
        $message = 'Here are the data';
        if ($curlError !== '') {
            $answer = 'false';
            $message = 'Got an error back:' . $curlError . PHP_EOL;
        }

        return [
            'answer' => $answer,
            'message' => $message,
            'data' => $incomingData,
            'http_code' => $httpCode,
            'url' => $in['url']
        ];
    }

    /**
     * Get the name of the php file in the url.
     * @return string
     */
    protected function _getScriptFileName(): string
    {
        $fileNameArray = explode('/', $_SERVER['SCRIPT_NAME']);
        $fileName = end($fileNameArray);

        return $fileName;
    }

    /**
     * The checksum function to use. By wrapping in a function, we can easily change
     * the hash function for a better one if needed.
     * https://en.wikipedia.org/wiki/List_of_hash_functions
     * @param string $dataString
     * @return string
     */
    protected function _Hash(string $dataString = ''): string
    {
        return 'crc32-' . crc32($dataString);
    }

}
