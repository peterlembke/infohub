<?php
declare(strict_types=1);
/*
 Copyright (C) 2010- Peter Lembke, CharZam soft
 the program is distributed under the terms of the GNU General Public License

 InfoHub is free software: you can redistribute it and/or modify
 it under the terms of the GNU General Public License as published by
 the Free Software Foundation, either version 3 of the License, or
 (at your option) any later version.

 InfoHub is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 GNU General Public License for more details.

 You should have received a copy of the GNU General Public License
 along with InfoHub.  If not, see <https://www.gnu.org/licenses/>.'
 */

/**
 * Kick out tests that will be run in index.php
 * Class kickOut
 */
class kickOut
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
     * Delete all other cookies
     */
    protected function validCookies(): void
    {
        $validCookies = array('INFOHUB_SESSION' => '');
        if (($_SERVER['REMOTE_ADDR'] == $_SERVER['SERVER_ADDR']) and $_SERVER['SERVER_ADDR'] === '127.0.0.1') {
            $validCookies = array('XDEBUG_PROFILE' => '', 'XDEBUG_SESSION' => '', 'INFOHUB_SESSION' => '');
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
        if (isset($_SERVER['REQUEST_SCHEME'])) {
            $requestScheme = $_SERVER['REQUEST_SCHEME'];
        }
        if ($requestScheme === 'http') {
            if (isset($_SERVER['HTTPS'])) {
                if ($_SERVER['HTTPS'] === 'on') {
                    $requestScheme = 'https';
                }
            }
        }

        $url = '';
        if (isset($_SERVER['SERVER_NAME']) and isset($_SERVER['REQUEST_URI'])) {
            $fileName = $this->getFileName();
            $url = $requestScheme . '://' . $_SERVER['SERVER_NAME'] . str_replace($fileName, '', $_SERVER['REQUEST_URI']);
        }

        if (isset($_SERVER['HTTP_REFERER']) === false) {
            $this->GetOut('infohub.php can not be called directly');
        }

        /* This test have no practical meaning. I will probably delete it
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
        $content = file_get_contents('php://input');

        $maxContentLength = 1024 * 1024;

        $contentLength = ceil(strlen($content));
        if ($contentLength > $maxContentLength) {
            $this->GetOut('Length of content max ' . abs(floor($maxContentLength / 1024)) . 'Kb, you sent ' . abs(floor($contentLength / 1024)) . 'Kb'  );
        }
        if (strlen($content) < 18) {
            $this->GetOut('Length of content must be minimum 18 bytes');
        }

        $package = json_decode($content, true);

        if (empty($package)) {
            $this->GetOut('Server says: The incoming package failed to convert from JSON to array. There might be something wrong with the JSON you sent');
        }

        $requiredPropertyNameArray = array(
            'session_id' => 1,
            'sign_code' => 1,
            'sign_code_created_at' => 1,
            'messages_encoded' => 1,
            'messages_encoded_length' => 1,
            'package_type' => 1,
            'messages' => 2 // for debug purposes. Set in infohub_transfer.json
        );

        foreach ($package as $name => $data) {
            if (isset($requiredPropertyNameArray[$name]) === true) {
                continue;
            }
            $this->GetOut('Server says: Package parameter not allowed: ' . $name);
        }

        foreach ($requiredPropertyNameArray as $requiredPropertyName => $dummyValue) {
            if (isset($package[$requiredPropertyName]) === false) {
                if ($dummyValue === 2) {
                    continue; // A property we only use some times for debug purposes
                }
                $this->GetOut('Server says: Package parameter missing: ' . $requiredPropertyName);
            }
        }

        if ($package['package_type'] !== '2020') {
            $this->GetOut('Server says: Expect package_type to be "2020"');
        }
        unset($package['package_type']);

        $diff = microtime(true) - (float) $package['sign_code_created_at'];
        if ($diff < 0.0 or $diff > 4.0) {
            $this->GetOut('Server says: Package sign_code_created_at is older than 4.0 seconds');
        }

        $checksum = md5($package['messages_encoded']);
        $package['messages_checksum'] = $checksum;

        if ($package['messages_encoded'] === 'W10=') { // W10= encoded for []
            $this->GetOut('Server says: Package messages missing');
        }

        $messagesJson = base64_decode($package['messages_encoded'], $strict = true);
        $messagesJson = utf8_encode($messagesJson); // Try saving åäö in a form and you see that this is needed
        $messages = json_decode($messagesJson, true);

        if (empty($messages)) {
            $messages = array();
        }

        $messageCount = count($messages);
        if (empty($messageCount)) {
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
     * @param $message | A message to display to the user
     */
    public function GetOut(string $message = ''): void
    {
        $messageOut = array(
            'to' => array(
                'node' => 'client',
                'plugin' => 'infohub_transfer',
                'function' => 'ban_seconds'
            ),
            'data' => array(
                'answer' => 'false',
                'data' => 0,
                'banned_until' => 0.0,
                'ban_seconds' => 0.0,
                'message' => $message
            )
        );
        $package = array('to_node' => 'client', 'messages' => array($messageOut));
        $messageOut = json_encode($package, JSON_PRETTY_PRINT & JSON_PRESERVE_ZERO_FRACTION);
        // header($_SERVER["SERVER_PROTOCOL"]." 404 Not Found");
        // echo $messageOut;
        exit($messageOut);
    }

}

/** @var kickOut $kick */
$kick = new kickOut();
$package = $kick->tests();
