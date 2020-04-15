<?php
declare(strict_types=1);
if (basename(__FILE__) == basename($_SERVER["SCRIPT_FILENAME"])) {
    exit; // This file must be included, not called directly
}

/**
 * @category InfoHub
 * @package InfoHub Transfer
 * @copyright Copyright (c) 2010-2015, Peter Lembke, CharZam soft (CharZam.com / InfoHub.se)
 * @since 2012-01-01
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
class infohub_transfer extends infohub_base {

    protected final function _Version(): array
    {
        return array(
            'date' => '2015-09-20',
            'version' => '1.0.0',
            'class_name' => 'infohub_transfer',
            'checksum' => '{{checksum}}',
            'note' => 'Transfer messages to the client and to other servers on the internet',
            'status' => 'normal',
            'SPDX-License-Identifier' => 'GPL-3.0-or-later'
        );
    }

    protected function _GetCmdFunctions(): array
    {
        return array(
            'send' => 'normal',
            'receive' => 'normal',
            'download' => 'emerging'
        );
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
     * @version 2013-11-21
     * @since 2013-11-21
     * @author Peter Lembke
     * @param array $in
     * @return array
     * @uses
     */
    final protected function send(array $in = array()): array
    {
        $default = array(
            'to_node' => array()
        );
        $in = $this->_Default($default, $in);

        foreach ($in['to_node'] as $nodeName => $messages)
        {
            foreach ($messages as $nr => $oneMessage) {
                $messages[$nr] = $this->_CleanMessage($oneMessage);
            }

            $package = array( // to_node and messages must be first or the kick out tests will kick in.
                'to_node' => $nodeName,
                'messages' => $messages
            );

            $bannedSecondsLeft = 0; // $_SESSION['banned_until'] - microtime(true);
            $package['ban_seconds'] = $bannedSecondsLeft;

            $package['banned_until'] = microtime(true); // $_SESSION['banned_until'];

            $packageJson = $this->_JsonEncode($package);

            if ($packageJson === false) {
                $packageJson = 'error: Server could not json encode the data.';
            }

            if ($nodeName === 'client') {
                echo $packageJson;
            }
            if ($nodeName === 'callback') {
                echo $packageJson;
            }
        }

        return array(
            'answer' => 'true',
            'message' => 'Finished with sending messages'
        );
    }

    /**
     * We get an incoming package that we expect would be from a logged in user:
     * If to_node is not "server" then kick out.
     * If messages is empty then kick out.
     * If messages_checksum is wrong then kick out.
     * if session_id is empty then kick out
     * If sign_code is empty then kick out.
     * If sign_code_created_at is empty then kick out.
     * If sign_code is wrong then kick out.
     * If you still are here then your package are let in.
     * More tests will be conducted later.
     * @version 2020-04-13
     * @since 2020-04-13
     * @author Peter Lembke
     * @param array $in
     * @return array
     * @uses
     */
    final protected function receive(array $in = array()): array
    {
        $default = array(
            'package' => array(
                'to_node' => '',
                'messages' => array(),
                'messages_checksum' => '',
                'session_id' => '',
                'sign_code' => '',
                'sign_code_created_at' => ''
            ),
            'answer' => 'false',
            'message' => '',
            'step' => 'step_simple_tests',
            'response' => array(
                'answer' => 'false',
                'message' => '',
                'sign_code_valid' => 'false'
            )
        );
        $in = $this->_Default($default, $in);

        $out = array(
            'answer' => 'false',
            'message' => 'Nothing to report',
            'package' => array()
        );

        if ($in['step'] === 'step_simple_tests') {
            if ($in['package']['to_node'] !== 'server') {
                $out['message'] = 'I only allow packages that goes to_node server';
                goto leave;
            }
            if ($this->_Empty($in['package']['messages']) === 'true') {
                $out['message'] = 'There are no messages in the package';
                goto leave;
            }

            // Javascript encode empty objects as [], we need to do that too
            $messagesJson = json_encode($in['package']['messages'], JSON_OBJECT_AS_ARRAY);

            $checksum = md5($messagesJson);
            if ($in['package']['messages_checksum'] !== $checksum) {
                $out['message'] = 'The messages_checksum was not correct';
                goto leave;
            }
            $diff = $this->_MicroTime() - (float) $in['package']['sign_code_created_at'];
            if ($diff > 3.0 or $diff < 0.0) {
                $out['message'] = 'The sign_code_created_at is too old. Always provide this time stamp';
                goto leave;
            }
            if ($this->_Empty($in['package']['session_id']) === 'true') {
                $out['message'] = 'session_id is empty';
                goto leave;
            }
            if ($this->_Empty($in['package']['sign_code']) === 'true') {
                $out['message'] = 'sign_code is empty';
                goto leave;
            }

            return $this->_SubCall(array(
                'to' => array(
                    'node' => 'server',
                    'plugin' => 'infohub_session',
                    'function' => 'responder_verify_sign_code'
                ),
                'data' => array(
                    'session_id' => $in['package']['session_id'],
                    'messages_checksum' => $in['package']['messages_checksum'],
                    'sign_code' => $in['package']['sign_code'],
                    'sign_code_created_at' => $in['package']['sign_code_created_at']
                ),
                'data_back' => array(
                    'package' => $in['package'],
                    'step' => 'step_verify_sign_code_response'
                )
            ));
        }

        if ($in['step'] === 'step_verify_sign_code_response') {
            if ($in['response']['sign_code_valid'] === 'false') {
                $out['message'] = 'The sign_code_created_at is too old. Always provide this time stamp';
                goto leave;
            }

            $out = array(
                'answer' => 'true',
                'message' => 'Sign code is OK',
                'package' => $in['package']
            );
        }

        leave:
        return $out;
    }

    /**
     * Remove unneeded data from the message to make it smaller before sending
     * @version 2018-03-30
     * @since 2018-03-30
     * @author Peter Lembke
     * @param array $in
     * @return array
     */
    final protected function _CleanMessage(array $in = array()): array
    {
        $default = array(
            'to' => array(),
            'callstack' => array(),
            'data' => array(),
        );
        $oneMessage = $this->_Default($default, $in);

        if (isset($oneMessage['data']['data_back']))
        {
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

        if (isset($oneMessage['data']['response']))
        {
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
     * @param array $in
     * @return array
     */
    final protected function download(array $in = array()): array
    {
        return $this->internal_Download($in);
    }

    /**
     * Download file with cUrl
     * https://www.jonasjohn.de/snippets/php/curl-example.htm
     * Deprecated: http://www.smooka.com/blog/2009/07/24/maintaining-php-session-when-using-curl/
     * @since 2013-05-30
     * @version 2016-02-12
     * @author Peter Lembke
     * @param array $in
     * @return array
     */
    final protected function internal_Download(array $in = array()): array
    {
        $default = array(
            'url' => '',
            'session_id' => '',
            'post_data' => ''
        );
        $in = $this->_Default($default, $in);

        if (!function_exists('curl_init')) {
            return array(
                'answer' => 'false',
                'message' => 'cURL is not installed on the server, can not continue'
            );
        }

        $cookies = array();
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
            $refererUrl = $requestScheme . '://' . $_SERVER['SERVER_NAME'] . str_replace($scriptFileName, '', $_SERVER['SCRIPT_NAME']);
        }

        $curlOptArray = array(
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
        );

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

        return array(
            'answer' => $answer,
            'message' => $message,
            'data' => $incomingData,
            'http_code' => $httpCode,
            'url' => $in['url']
        );
    }

    /**
     * Get the name of the php file in the url.
     * @return string
     */
    final protected function _getScriptFileName(): string
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
    final protected function _Hash(string $dataString = ''): string
    {
        return 'crc32-' . crc32($dataString);
    }

}
