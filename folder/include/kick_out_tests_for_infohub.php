<?php

/**
 * Kick out tests that will be run in infohub.php
 *
 * @package     Infohub
 * @subpackage  kick_out_tests_for_infohub
 */
declare(strict_types=1);

include_once PLUGINS . DS . 'infohub' . DS . 'base' . DS . 'infohub_base.php';

/**
 * Kick out tests that will be run in infohub.php
 *
 * @author      Peter Lembke <info@infohub.se>
 * @version     2020-04-17
 * @since       2015-11-15
 * @copyright   Copyright (c) 2015, Peter Lembke
 * @license     https://opensource.org/licenses/gpl-license.php GPL-3.0-or-later
 * @see         https://github.com/peterlembke/infohub/blob/master/folder/plugins/infohub/storage/data/infohub_storage_data.md Documentation
 * @link        https://infohub.se/ InfoHub main page
 */
class kick_out_tests_for_infohub extends infohub_base
{
    /**
     * Main function that run all tests
     */
    public function tests(): array
    {
        $this->quickTests();
        $this->httpRefererTest();
        $this->validCookies();
        $package = $this->checkAndUpdatePackageParameters();

        return $package;
    }

    /**
     * Quick tests to start with
     */
    protected function quickTests(): void
    {
        $fileName = $this->getFileName();
        if ($fileName !== 'infohub.php') {
            $this->GetOut('The kick out tests are only available for infohub.php');
        }

        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            $this->GetOut('REQUEST_METHOD: ' . $_SERVER['REQUEST_METHOD'] . ' must be POST');
        }

        if ($_SERVER['QUERY_STRING'] !== '') {
            $this->GetOut('QUERY_STRING must be empty: ' . $_SERVER['QUERY_STRING']);
        }

        if ($_SERVER['CONTENT_TYPE'] !== 'application/json') {
            $this->GetOut('CONTENT_TYPE must be application/json: ' . $_SERVER['CONTENT_TYPE']);
        }

        if (count($_POST) > 0) {
            $this->GetOut('POST count: ' . count($_POST) . ' must be 0');
        }

        if (($_SERVER['REMOTE_ADDR'] == $_SERVER['SERVER_ADDR']) and $_SERVER['SERVER_ADDR'] != '127.0.0.1' and $_SERVER['SERVER_ADDR'] != '::1') {
            $this->GetOut("Only a client can start this file.");
        }
    }

    /**
     * Check that we only have valid cookies.
     * Delete all others cookies
     */
    protected function validCookies(): void
    {
        $validCookies = ['INFOHUB_SESSION' => ''];
        if (($_SERVER['REMOTE_ADDR'] == $_SERVER['SERVER_ADDR']) and $_SERVER['SERVER_ADDR'] === '127.0.0.1') {
            $validCookies = ['XDEBUG_PROFILE' => '', 'XDEBUG_SESSION' => '', 'INFOHUB_SESSION' => ''];
        }

        $removeCookies = array_diff_key($_COOKIE, $validCookies);
        if (count($removeCookies) > 0) {
            $timeInThePast = time() - 3600;
            foreach ($removeCookies as $cookieName => $value) {
                setcookie($cookieName, '', $timeInThePast);
                unset($_COOKIE[$cookieName]);
            }
        }
    }

    /**
     * Referer logging is used to allow websites and web servers to identify where people are visiting them from,
     * for promotional or statistical purposes. InfoHub do not want that information.
     * That is why I ask you to start the URL directly and not from a link.
     * https://en.wikipedia.org/wiki/HTTP_referer
     */
    protected function httpRefererTest(): void
    {
        $requestScheme = 'http';
        if (isset($_SERVER['REQUEST_SCHEME']) === true) {
            $requestScheme = $_SERVER['REQUEST_SCHEME'];
        }
        if ($requestScheme === 'http') {
            if (isset($_SERVER['HTTPS']) === true) {
                if ($_SERVER['HTTPS'] === 'on') {
                    $requestScheme = 'https';
                }
            }
        }

        $url = '';
        if (isset($_SERVER['SERVER_NAME']) === true and isset($_SERVER['REQUEST_URI']) === true) {
            $fileName = $this->getFileName();
            $url = $requestScheme . '://' . $_SERVER['SERVER_NAME'] . str_replace(
                    $fileName,
                    '',
                    $_SERVER['REQUEST_URI']
                );
        }

        if (isset($_SERVER['HTTP_REFERER']) === false) {
            $this->GetOut('infohub.php can not be called directly');
        }
        /* This test has no practical meaning. I will probably delete it
        if ($_SERVER['HTTP_REFERER'] !== $url) {
            $refererFileName = str_replace($url , '', $_SERVER['HTTP_REFERER']);
            $message = "HTTP_REFERER must be empty or the same as the url. Open this page in a fresh browser. Right now you have:" . $_SERVER['HTTP_REFERER'] . ', and the urls is:' . $url;
            $this->GetOut($message);
        }
        */
    }

    /**
     * Basic tests that the package is valid
     */
    protected function checkAndUpdatePackageParameters(): array
    {
        $contentString = file_get_contents('php://input');
        if ($contentString === false) {
            $contentString = '';
        }

        $maxContentLength = 1024 * 1024;

        $contentLength = (int) ceil(strlen($contentString));
        if ($contentLength > $maxContentLength) {
            $message = 'Length of content max ' . $this->getKb($maxContentLength) . ', you sent ' . $this->getKb($contentLength);
            $this->GetOut($message);
        }
        if (strlen($contentString) < 18) {
            $this->GetOut('Length of content must be minimum 18 bytes');
        }

        $package = $this->_JsonDecode($contentString);

        if (empty($package) === true) {
            $this->GetOut(
                'Server says: The incoming package failed to convert from JSON to array. There might be something wrong with the JSON you sent'
            );
        }

        $requiredPropertyNameArray = [
            'session_id' => 1,
            'sign_code' => 1,
            'sign_code_created_at' => 1,
            'messages_encoded' => 1,
            'messages_encoded_length' => 1,
            'package_type' => 1,
            'messages' => 2 // for debug purposes. Set in infohub_transfer.json
        ];

        foreach ($package as $name => $data) {
            if (isset($requiredPropertyNameArray[$name]) === true) {
                continue;
            }
            $this->GetOut('Server says: Package parameter not allowed: ' . $name);
        }

        foreach ($requiredPropertyNameArray as $requiredPropertyName => $dummyValue) {
            if (isset($package[$requiredPropertyName]) === false) {
                if ($dummyValue === 2) {
                    continue; // A property we only use sometimes for debug purposes
                }
                $this->GetOut('Server says: Package parameter missing: ' . $requiredPropertyName);
            }
        }

        if ($package['package_type'] !== '2020') {
            $this->GetOut('Server says: Expect package_type to be "2020"');
        }
        unset($package['package_type']);

        $diff = microtime(true) - (float)$package['sign_code_created_at'];
        if ($diff < 0.0 or $diff > 4.0) {
            $this->GetOut('Server says: Package sign_code_created_at is older than 4.0 seconds');
        }

        $checksum = md5($package['messages_encoded']);
        $package['messages_checksum'] = $checksum;

        if ($package['messages_encoded'] === 'W10=') { // W10= encoded for []
            $this->GetOut('Server says: Package messages missing');
        }

        $messagesJson = base64_decode($package['messages_encoded'], $strict = true);
        if ($messagesJson === false) {
            $messagesJson = '{}';
        }

        $messagesJson = utf8_encode($messagesJson); // Try saving åäö in a form, and you see that this is needed
        $messages = $this->_JsonDecode($messagesJson);

        if (empty($messages) === true) {
            $messages = [];
        }

        $messageCount = count($messages);
        if (empty($messageCount) === true) {
            $this->GetOut('Server says: Package messages missing');
        }
        if ($messageCount > 100) {
            $this->GetOut('Server says: Package messages too many');
        }

        $package['messages'] = $messages;
        unset($package['messages_encoded']);

        return $package;
    }

    /**
     * Convert a value to a string with Kb
     *
     * @param  int  $byteCount
     * @return string
     */
    protected function getKb(int $byteCount = 0): string {
        $bytesInKb = '' . abs(floor($byteCount / 1024)) . 'Kb';
        return $bytesInKb;
    }

    /**
     * Get the filename in the url
     * @return string
     */
    protected function getFileName(): string
    {
        $fileNameArray = explode('/', $_SERVER['SCRIPT_NAME']);
        $fileName = end($fileNameArray);

        return $fileName;
    }

    /**
     * If you end up here you will be thrown out
     * @param  string  $message A message to display to the user
     * @return void
     */
    public function GetOut(string $message = ''): void
    {
        $messageOut = [
            'to' => [
                'node' => 'client',
                'plugin' => 'infohub_transfer',
                'function' => 'ban_seconds'
            ],
            'data' => [
                'answer' => 'false',
                'data' => 0,
                'banned_until' => 0.0,
                'ban_seconds' => 0.0,
                'message' => $message
            ]
        ];
        $package = ['to_node' => 'client', 'messages' => [$messageOut]];
        $messageOut = $this->_JsonEncode($package);
        // header($_SERVER["SERVER_PROTOCOL"]." 404 Not Found");
        // echo $messageOut;
        exit($messageOut);
    }

}

$kick = new kick_out_tests_for_infohub();
$package = $kick->tests();
