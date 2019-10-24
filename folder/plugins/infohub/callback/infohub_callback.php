<?php
declare(strict_types=1);
if (basename(__FILE__) == basename($_SERVER["SCRIPT_FILENAME"])) {
    exit; // This file must be included, not called directly
}

/**
 * infohub_callback.php manage the infohub_callback.json config file used by callback.php
 * The config file contain what urls are valid, what passphrase to use and what destination to send the message.
 * And also the valid senders.
 * @category InfoHub
 * @package Plugin
 * @copyright Copyright (c) 2010-, Peter Lembke, CharZam soft
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
class infohub_callback extends infohub_base
{

    final protected function _Version(): array
    {
        return array(
            'date' => '2016-02-12',
            'version' => '1.0.0',
            'class_name' => 'infohub_callback',
            'checksum' => '{{checksum}}',
            'note' => 'Handles incoming URL requests with parameters',
            'status' => 'normal',
            'license_name' => 'GNU GPL 3 or later'
        );
    }

    protected function _GetCmdFunctions(): array
    {
        return array(
            'main' => 'normal'
        );
    }

    /**
     * Main function.
     * http://localhost/infohub/myvar1/hello/myvar2/world
     * @since 2013-05-31
     * @version 2016-03-19
     * @author Peter Lembke
     * @param array $in
     * @return array
     */
    public function main(array $in = array()): array
    {
        $default = array();
        $in = $this->_Default($default, $in);

        $this->internal_Cmd(array(
            'func' => 'CheckBanTime'
        ));

        $response = $this->internal_Cmd(array(
            'func' => 'GetAllInputData'
        ));
        if ($response['answer'] === 'false') {
            goto leave;
        }
        $inputData = $response['data'];

        $response = $this->internal_Cmd(array(
            'func' => 'GetPatterns'
        ));
        if ($response['answer'] === 'false') {
            goto leave;
        }
        $patterns = $response['data'];

        $response = $this->internal_Cmd(array(
            'func' => 'CheckAgainstPatterns',
            'input_data' => $inputData,
            'patterns' => $patterns
        ));
        if ($response['answer'] === 'false') {
            goto leave;
        }

        $response = $this->internal_Cmd(array(
            'func' => 'GetPostData',
            'out' => $response['data']
        ));
        if ($response['answer'] === 'false') {
            goto leave;
        }
        $postData = $response['post_data'];

        $response = $this->internal_Cmd(array(
            'func' => 'GetUrl',
            'file' => 'infohub.php'
        ));
        if ($response['answer'] === 'false') {
            goto leave;
        }
        $url = $response['url'];

        $sessionId = '';
        if (isset($_COOKIE['PHPSESSID'])) {
            $sessionId = $_COOKIE['PHPSESSID'];
        }

        $response = $this->internal_Cmd(array(
            'func' => 'Download',
            'url' => $url,
            'session_id' => $sessionId,
            'post_data' => $postData
        ));
        if ($response['answer'] === 'false') {
            goto leave;
        }

        $response = $this->internal_Cmd(array(
            'func' => 'MessageDecode',
            'message' => $response['data']
        ));

        leave:

        if ($response['answer'] === 'false') {
            $ip = $this->getVisitorIPAddress();
            if (empty($ip) === false) {
                $response['data']['data']['remote_addr'] = $ip;
            }
            return array(
                'answer' => 'false',
                'message' => $response['message'],
                'data' => $response
            );
        }

        $response = $this->internal_Cmd(array(
            'func' => 'GetWantedData',
            'data' => $response['data']
        ));

        if (substr($response['data'], 0, 1) === '{') {
            $response['data'] = json_decode($response['data'], true);
        }

        return $response;
    }

    final protected function internal_CheckBanTime(): array
    {
        $answer = 'true';
        $message = '';

        if (isset($_SESSION['banned_until']) === false) {
            $_SESSION['banned_until'] = time();
            $message = 'First visit, added the current timestamp';
        }

        if ($_SESSION['banned_until'] > time()) {
            $message = 'You are still banned';
            echo $message;
            die();
        }

        $_SESSION['banned_until'] = $_SESSION['banned_until'] + 1;
        $message = 'Added a second ban time';

        return array(
            'answer' => $answer,
            'message' => $message
        );
    }

    final protected function internal_GetPatterns(): array
    {
        $patterns = array();
        $response = $this->internal_Cmd(array(
            'func' => 'GetConfig',
        ));
        if ($response['answer'] === 'false') {
            goto leave;
        }
        $patterns = $response['data'];

        if (empty($patterns)) {

            $response = $this->internal_Cmd(array(
                'func' => 'GetDefaultConfig'
            ));
            if ($response['answer'] === 'false') {
                goto leave;
            }
            $patterns = $response['data'];

            $response = $this->internal_Cmd(array(
                'func' => 'PutConfig',
                'data' => $patterns
            ));

        }

        leave:
        $response['data'] = $patterns;
        return $response;
    }

    /**
     * Get all parameters from GET, POST, URL and construct a message to send into infohub
     * @since 2013-05-30
     * @version 2015-03-04
     * @author Peter Lembke
     * @param array $in
     * @return array
     */
    final protected function internal_GetAllInputData(array $in = array()): array
    {
        $default = array();
        $in = $this->_Default($default, $in);

        $pathParts = explode("/", strtolower($_SERVER["REDIRECT_URL"]));
        array_shift($pathParts); // Remove the first item from the array

        $excludeParts = explode('/', strtolower($_SERVER["SCRIPT_NAME"]));
        array_shift($excludeParts); // Remove the first item from the array
        array_pop($excludeParts); // Remove the last item from the array
        foreach ($excludeParts as $partName) {
            if ($partName === $pathParts[0]) {
                array_shift($pathParts);
            }
        }

        $response = array();
        $partName = '';
        $index = 0;
        foreach ($pathParts as $index => $data) {
            if ($index % 2 === 0) {
                $partName = $data;
            }
            if ($index % 2 === 1) {
                $response['url_' . $partName] = $data;
            }
        }
        if ($index % 2 === 0) {
            $response['url_' . $partName] = "";
        }
        foreach ($_GET as $partName => $data) {
            if ($partName !== 'param') {
                $response['get_' . $partName] = $data;
            }
        }
        foreach ($_POST as $partName => $data) {
            $response['post_' . $partName] = $data;
        }

        return array(
            'answer' => 'true',
            'message' => 'Here are the data',
            'data' => $response
        );
    }

    /**
     * Read and parse config files
     * @param array $in
     * @return array
     */
    final protected function internal_GetConfig(array $in = array()): array
    {
        $default = array();
        $in = $this->_Default($default, $in);

        $data = array();
        $fileName = $this->_GetFileName();

        if (file_exists($fileName) === true) {
            $data = file_get_contents($fileName);
            if (empty($data) === false) {
                $data = json_decode($data, true);
            }
            if (is_array($data) === false) {
                $data = array();
            }
        }

        return array(
            'answer' => 'true',
            'message' => 'Here are the data from the config file',
            'data' => $data
        );
    }

    /**
     * Calculates the file name to the configuration file that hold connection information to the data base.
     * The use of configuration files is very mush discouraged. Always place all data in the database.
     * @version 2016-02-27
     * @since   2016-01-30
     * @author  Peter Lembke
     * @return string
     */
    final protected function _GetFileName(): string
    {
        $class = get_class();
        $fileName = PLUGINS . DS . str_replace('_', DS, $class) . DS . $class . '.json';
        return $fileName;
    }

    /**
     * Read default config
     * @param array $in
     * @return array|mixed|string
     */
    final protected function internal_GetDefaultConfig(array $in = array()): array
    {
        $default = array();
        $in = $this->_Default($default, $in);

        $data = array(
            "demo1" => array(
                "enabled" => "true",
                "ip_valid" => array(
                    "*.*.*.*"
                ),
                "pattern" => array(
                    "url_demo" => "1"
                ),
                "data" => array(
                    "my_variable" => "the fox jump over the fence"
                ),
                "data_back" => array(
                    "read_return_parameter" => "data"
                ),
                "to" => array(
                    "node" => "server",
                    "plugin" => "infohub_demo",
                    "function" => "demo1"
                )
            ),
            "demo2" => array(
                "enabled" => "true",
                "ip_valid" => array(
                    "*.*.*.*"
                ),
                "pattern" => array(
                    "url_demo" => "2"
                ),
                "data" => array(
                    "my_variable" => "the rabbit dig a hole"
                ),
                "data_back" => array(
                    "read_return_parameter" => "data"
                ),
                "to" => array(
                    "node" => "server",
                    "plugin" => "infohub_demo",
                    "function" => "demo2"
                )
            ),
            "demo3" => array(
                "enabled" => "true",
                "ip_valid" => array(
                    "*.*.*.*"
                ),
                "pattern" => array(
                    "url_demo" => "3"
                ),
                "data" => array(
                    "my_variable" => "I'll be back"
                ),
                "data_back" => array(
                    "read_return_parameter" => "data"
                ),
                "to" => array(
                    "node" => "server",
                    "plugin" => "infohub_demo",
                    "function" => "demo3"
                )
            ),
            "demo4" => array(
                "enabled" => "true",
                "ip_valid" => array(
                    "*.*.*.*"
                ),
                "pattern" => array(
                    "url_demo" => "4"
                ),
                "data" => array(),
                "data_back" => array(
                    "read_return_parameter" => "data"
                ),
                "to" => array(
                    "node" => "server",
                    "plugin" => "infohub_demo",
                    "function" => "demo4"
                )
            ),
            "demo5" => array(
                "enabled" => "true",
                "ip_valid" => array(
                    "*.*.*.*"
                ),
                "pattern" => array(
                    "url_demo" => "5"
                ),
                "data" => array(),
                "data_back" => array(
                    "read_return_parameter" => "data"
                ),
                "to" => array(
                    "node" => "server",
                    "plugin" => "infohub_demo",
                    "function" => "demo5"
                )
            ),
            "demo6" => array(
                "enabled" => "true",
                "ip_valid" => array(
                    "*.*.*.*"
                ),
                "pattern" => array(
                    "url_demo" => "6"
                ),
                "data" => array(),
                "data_back" => array(),
                "to" => array(
                    "node" => "server",
                    "plugin" => "infohub_demo",
                    "function" => "demo6"
                )
            ),
            "storage" => array(
                "enabled" => "true",
                "ip_valid" => array(
                    "*.*.*.*"
                ),
                "pattern" => array(
                    "url_storagedemo" => "run"
                ),
                "data" => array(),
                "data_back" => array(),
                "to" => array(
                    "node" => "server",
                    "plugin" => "infohub_storagedemo",
                    "function" => "run"
                )
            ),
            "file" => array(
                "enabled" => "true",
                "ip_valid" => array(
                    "*.*.*.*"
                ),
                "pattern" => array(
                    "url_demo" => "file"
                ),
                "data" => array(),
                "data_back" => array(),
                "to" => array(
                    "node" => "server",
                    "plugin" => "infohub_demo",
                    "function" => "demo_file"
                )
            ),
            "demo_test" => array(
                "enabled" => "true",
                "ip_valid" => array(
                    "*.*.*.*"
                ),
                "pattern" => array(
                    "url_demo" => "test"
                ),
                "data" => array(),
                "data_back" => array(),
                "to" => array(
                    "node" => "server",
                    "plugin" => "infohub_demo",
                    "function" => "demo_test"
                )
            ),
            "doc_plugins" => array(
                "enabled" => "true",
                "ip_valid" => array(
                    "*.*.*.*"
                ),
                "pattern" => array(
                    "url_doc" => "plugin"
                ),
                "data" => array(),
                "data_back" => array(
                    "read_return_parameter" => "data"
                ),
                "to" => array(
                    "node" => "server",
                    "plugin" => "infohub_doc",
                    "function" => "get_html"
                )
            ),
            "doc_main" => array(
                "enabled" => "true",
                "ip_valid" => array(
                    "*.*.*.*"
                ),
                "pattern" => array(
                    "url_doc" => "main"
                ),
                "data" => array(),
                "data_back" => array(
                    "read_return_parameter" => "data"
                ),
                "to" => array(
                    "node" => "server",
                    "plugin" => "infohub_doc",
                    "function" => "get_html"
                )
            )
        );

        return array(
            'answer' => 'true',
            'message' => 'Here are the default demo data',
            'data' => $data
        );
    }

    /**
     * Save to config files
     * @param array $in
     * @return array
     */
    final protected function internal_PutConfig(array $in = array()): array
    {
        $default = array(
            'data' => array(),
            'overwrite' => 'false'
        );
        $in = $this->_Default($default, $in);

        $answer = 'false';
        $message = 'Nothing to report';

        $data = json_encode($in['data'], JSON_PRETTY_PRINT);
        $fileName = $this->_GetFileName();

        if ($in['overwrite'] === 'false') {
            $response = $this->internal_GetConfig();
            $currentData = $response['data'];
            if (empty($currentData) === false) {
                $message = 'There are already data stored and you do not allow me to overwrite it';
                goto leave;
            }
        }

        $response = file_put_contents($fileName, $data);
        if ($response === false) {
            $message = 'Could not save the config to file with the new data';
            goto leave;
        }

        $response = chmod($fileName, 0755);
        if ($response === false) {
            $message = 'Have updated the config file but could not set rights on the file';
            goto leave;
        }

        $answer = 'true';
        $message = 'Have saved the data to the config file';

        leave:
        return array(
            'answer' => $answer,
            'message' => $message,
            'data' => $data
        );
    }

    /**
     * Check if the sender are white listed with IP and URL requested
     * @since 2013-05-30
     * @version 2015-03-06
     * @author Peter Lembke
     * @param array $in
     * @return array
     * @uses message | string | the array to check for matching pattern against the arrays in config
     */
    final protected function internal_CheckAgainstPatterns(array $in = array()): array
    {
        $default = array(
            'input_data' => array(),
            'patterns' => array()
        );
        $in = $this->_Default($default, $in);

        $answer = 'false';
        $message = 'Did not find a matching pattern';
        $match = '';
        $response = array(
            'data' => array(),
            'data_back' => array(),
            'to' => array()
        );

        $ipAddress = $this->getVisitorIPAddress();
        if (empty($ipAddress) === true) {
            $answer = 'false';
            $message = 'You have no IP in REMOTE_ADDR, then we can not return the answer to you';
            goto leave;
        }

        foreach ($in['patterns'] as $patternName => $data) {

            if (isset($data['enabled']) === 'false') {
                continue;
            }

            $result = array_intersect_key($data['pattern'], $in['input_data']);
            if (count($result) !== count($data['pattern'])) {
                continue;
            }

            $ok = true;
            foreach ($result as $variableKey => $variableData) {
                if ($data['pattern'][$variableKey] !== $in['input_data'][$variableKey]) {
                    $ok = false;
                    break;
                }
            }
            if ($ok === false) {
                continue;
            }

            if (in_array($ipAddress, $data['ip_valid']) === true) {
                $message = 'Found a pattern and a valid IP';
                $match = $patternName;
                break;
            }

            if (in_array('*.*.*.*', $data['ip_valid']) === true) {
                $message = 'Found a pattern. Any IP is valid';
                $match = $patternName;
                break;
            }

        }

        if ($match === '') {
            goto leave;
        }

        $returnData = array_merge($in['input_data'], $in['patterns'][$match]['data']);
        $response = array(
            'data' => $returnData,
            'data_back' => $in['patterns'][$match]['data_back'],
            'to' => $in['patterns'][$match]['to']
        );
        $answer = 'true';
        $message = 'Found a matching pattern';

        leave:

        return array(
            'answer' => $answer,
            'message' => $message,
            'data' => $response
        );
    }

    /**
     * Get the visitor IP address.
     * We do this to be sure that the answer can be sent somewhere.
     * @return string
     */
    final protected  function getVisitorIPAddress(): string
    {
        $ip = $_SERVER['REMOTE_ADDR'];
        if (empty($ip) === false) {
            return $ip;
        }

        $ips = $_SERVER['HTTP_X_FORWARDED_FOR'];
        $parts = explode(',', $ips);
        if (is_array($parts)) {
            $ip = trim(array_pop($parts));
        }

        return $ip;
    }

    /**
     * Send the message to infohub. This is node "callback".
     * All messages will go to infohub_callback, server/callback/incoming
     * @since 2013-05-30
     * @version 2013-05-30
     * @author Peter Lembke
     * @param array $in
     * @return array
     */
    final protected function internal_GetPostData(array $in = array()): array
    {
        $default = array('out' => array());
        $in = $this->_Default($default, $in);

        $postDataArray = array(
            "to_node" => "server",
            "messages" => array(
                0 => array(
                    'to' => $in['out']['to'],
                    'data' => $in['out']['data'],
                    'callstack' => array(
                        0 => array(
                            'to' => array(
                                'node' => 'callback',
                                'plugin' => 'infohub_callback',
                                'function' => 'main'
                            ),
                            'data_back' => $in['out']['data_back'],
                        )
                    ),
                    'from' => array(
                        'node' => 'client',
                        'plugin' => 'infohub_callback',
                        'function' => 'main'
                    )
                )
            )
        );
        $postData = json_encode($postDataArray);

        return array(
            'answer' => 'true',
            'message' => 'Here are the post data you can send to infohub.php',
            'post_data' => $postData
        );
    }

    /**
     * Get url string to the file we will call
     * @since 2013-05-30
     * @version 2013-05-30
     * @author Peter Lembke
     * @param array $in
     * @return array
     */
    final protected function internal_GetUrl($in = array()): array
    {
        $default = array(
            'file' => ''
        );
        $in = $this->_Default($default, $in);

        $includeParts = explode('/', $_SERVER["SCRIPT_NAME"]);
        array_shift($includeParts);
        array_pop($includeParts);

        $pathParts = implode('/', $includeParts);
        if (empty($pathParts) === false) {
            $pathParts = $pathParts . '/';
        }

        $url = 'http://' . $_SERVER["SERVER_NAME"] . '/' . $pathParts . $in['file'];

        return array(
            'answer' => 'true',
            'message' => 'Here are the url',
            'url' => $url
        );
    }

    /**
     * Download file with cUrl
     * http://www.jonasjohn.de/snippets/php/curl-example.htm
     * http://www.smooka.com/blog/2009/07/24/maintaining-php-session-when-using-curl/
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

        $fileName = LOG . DS . 'infohub_callback_curl.log';
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

        $answer = 'true';
        $message = 'Here are the data';
        if ($curlError !== '') {
            $answer = 'false';
            $message = 'Got an error back:' . $curlError. PHP_EOL;
            fwrite($fileHandle, $message);
        }

        fclose($fileHandle);

        return array(
            'answer' => $answer,
            'message' => $message,
            'data' => $incomingData,
            'http_code' => $httpCode,
            'url' => $in['url']
        );
    }

    final protected function _getScriptFileName(): string
    {
        $fileNameArray = explode('/', $_SERVER['SCRIPT_NAME']);
        $fileName = end($fileNameArray);
        return $fileName;
    }

    /**
     * Decode and fresh up the incoming message before presenting it on screen as a pretty json.
     * @since 2016-01-28
     * @version 2016-01-28
     * @author Peter Lembke
     * @param array $in
     * @return array
     */
    final protected function internal_MessageDecode(array $in = array()): array
    {
        $default = array(
            'message' => ''
        );
        $in = $this->_Default($default, $in);

        $startCharacter = substr($in['message'],0,1);

        if ($startCharacter === '{') {
            $data = json_decode($in['message'], true);
        } else {
            $data = $in['message'];
        }

        $oneMessage = $data;
        if (is_array($data)) {
            if (isset($data['messages'][0])) {
                $oneMessage = $data['messages'][0];
            }
        }

        return array(
            'answer' => 'true',
            'message' => 'Here are the parsed data',
            'data' => $oneMessage
        );
    }

    /**
     * Extract the actual answer from the returned data.
     * @since 2016-02-07
     * @version 2016-02-07
     * @author Peter Lembke
     * @param array $in
     * @return array
     */
    final protected function internal_GetWantedData(array $in = array()): array
    {
        $default = array(
            'data' => null
        );
        $in = $this->_Default($default, $in);

        $data = $in['data'];
        if (empty($in['data']['data']) === false) {
            $data = $in['data']['data'];
        }
        $result = $data;
        if (isset($data['read_return_parameter'])) {
            $parameter = $data['read_return_parameter'];
            if (isset($data[$parameter])) {
                $result = $data[$parameter];
            }
        }

        if (empty($result)) {
            $result = ''; // Remove empty arrays
        }

        if (is_array($result)) {
            $result = json_encode($result, JSON_PRETTY_PRINT);
        }

        return array(
            'answer' => 'true',
            'message' => 'Here are the wanted data',
            'data' => $result
        );
    }

    /**
     * Add a pattern
     * @version 2016-02-09
     * @since   2013-05-29
     * @author  Peter Lembke
     * @param array $in
     * @return array
     */
    final protected function pattern_add(array $in = array()): array
    {
        $default = array();
        $in = $this->_Default($default, $in);

        return array(
            'answer' => '',
            'message' => ''
        );
    }

    /**
     * Remove a pattern
     * @version 2016-02-09
     * @since   2013-05-29
     * @author  Peter Lembke
     * @param array $in
     * @return array
     */
    final protected function pattern_remove(array $in = array()): array
    {
        $default = array();
        $in = $this->_Default($default, $in);

        return array(
            'answer' => '',
            'message' => ''
        );
    }

}
