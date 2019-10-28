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

    if (isset($_COOKIE['PHPSESSID']) === false) {
        GetOut(0.0, 'One <a href="https://en.wikipedia.org/wiki/HTTP_cookie" target="_blank">session cookie</a> must be stored in your browser.<br />And <a href="https://en.wikipedia.org/wiki/Web_storage" target="_blank">local storage</a> (if exist) will be used to store data that you can use when you are offline.<br /><br /><a href="javascript:window.location.reload()">Reload the page</a> if you accept this.<br /><br />If you got here again after pressing reload, then your web browser do not accept cookies. You can <a href="https://www.wikihow.com/Enable-Cookies-in-Your-Internet-Web-Browser" target="_blank">activate cookies</a>.<br /><br /><INPUT type="button" class="button" NAME="ok" id="ok" Value="Accept" onClick="window.location.reload()">');
    }
    if (isset($_SESSION['banned_until']) == false) {
        $_SESSION['banned_until'] = microtime(true);
    }
    $bannedSeconds = $_SESSION['banned_until'] - microtime(true);
    if ($bannedSeconds > 0.0) {
        $lastMessage = '';
        if (isset($_SESSION['last_message']) == true) {
            $lastMessage = $_SESSION['last_message'];
        }
        // GetOut(2.0, 'You were already banned ' . fine($bannedSeconds) . ' seconds, and now you got another %s seconds more ban time. Previous thing you did was: ' . $lastMessage);
    }
    if ($_SESSION['banned_until'] < microtime(true)) {
        $_SESSION['banned_until'] = microtime(true);
    }

    /* This test do not work well. See https://code-examples.net/en/q/10d2dad
    if ($_SERVER[ "SERVER_PROTOCOL" ] === 'HTTP/1.0') {
        GetOut(5.0, "I do not allow this old protocol HTTP/1.0. Upgrade your browser");
    }
     */

    if (($_SERVER['REMOTE_ADDR'] == $_SERVER['SERVER_ADDR']) and $_SERVER['SERVER_ADDR'] != '127.0.0.1' and $_SERVER['SERVER_ADDR'] != '::1') {
        GetOut(5.0, "Only a client can start this file.");
    }
    
    if($_SERVER['QUERY_STRING'] !== '') {
        GetOut(7.0, 'QUERY_STRING must be empty: ' . $_SERVER['QUERY_STRING']);
    }

    $fileName = getFileName();
    if ($fileName !== 'index.php' and $fileName !== 'infohub.php') {
        GetOut(4.0, 'The kick out tests are only available for index.php and infohub.php');
    }

    $parameters = array(
        'request_method' => 'POST',
        'post_count' => 1
    );
    if ($fileName === 'index.php') {
        $parameters = array(
            'request_method' => 'GET',
            'post_count' => 0
        );
    }

    if ($_SERVER['REQUEST_METHOD'] !== $parameters['request_method']) {
        GetOut(6.0, 'REQUEST_METHOD: ' . $_SERVER['REQUEST_METHOD'] . ' must be ' . $parameters['request_method']);
    }

    if (count($_POST) !== $parameters['post_count']) {
        GetOut(8.0, 'POST count: ' . count($_POST) . ' must be ' . $parameters['post_count']);
    }

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
        $url = $requestScheme . '://' . $_SERVER['SERVER_NAME'] . str_replace($fileName, '', $_SERVER['REQUEST_URI']);
    }

    if ($fileName === 'infohub.php') {
        if (isset($_SERVER['HTTP_REFERER']) === false) {
            GetOut(7,'infohub.php can not be called directly');
        }

        /* Prevents you from mentioning fight club, I mean Infohub in a link. Makes the link useless.
        if ($_SERVER['HTTP_REFERER'] !== $url) {
            GetOut(7,'infohub.php must be called from index.php. ' . $url . ', ' . $_SERVER['HTTP_REFERER']);
        }
        */

        if (isset($_POST['package']) === false) {
            GetOut(7.0, 'POST name must be "package"');
        }


        $loggedIn = isset($_SESSION['logged_in']); // @todo This need to be handled

        $maxPostLength = 1024 * 1024;
        if ($loggedIn === false) {
            $maxPostLength = 1024 * 1024; // @todo This should be 2Kb when login feature works
        }

        $postLength = ceil(strlen($_POST['package']));
        if ($postLength > $maxPostLength) {
            GetOut(7.0, 'Length of POST max ' . abs(floor($maxPostLength / 1024)) . 'Kb, you sent ' . abs(floor($postLength / 1024)) . 'Kb'  );
        }
        if (strlen($_POST['package']) < 18) {
            GetOut(3.0, 'Length of POST minimum 18 bytes');
        }
        $_POST['package'] = str_replace('\"', '"', $_POST['package']);
        $messageStart = '{"to_node":"server","messages":';
        if (substr($_POST['package'], 0, strlen($messageStart)) != $messageStart) {
            GetOut(3.0, 'POST must start with the right code');
        }
        $messageEnd = "}";
        if (substr($_POST['package'], -strlen($messageEnd)) != $messageEnd) {
            GetOut(3.0, 'POST must end with ' . $messageEnd);
        }
    }

    if ($fileName === 'index.php') {
        if (isset($_SERVER['HTTP_REFERER']) === true and $_SERVER['HTTP_REFERER'] !== $url) {
            $refererFileName = str_replace($url , '', $_SERVER['HTTP_REFERER']);
            if ($refererFileName !== 'serviceworker.js') {
                GetOut(7,"HTTP_REFERER must be empty or the same as the url. Open this page in a fresh browser. Right now you have:" . $_SERVER['HTTP_REFERER'] . ', and the urls is:' . $url);
            }
        }
    }

    $validCookies = array('PHPSESSID' => '');
    if (($_SERVER['REMOTE_ADDR'] == $_SERVER['SERVER_ADDR']) and $_SERVER['SERVER_ADDR'] === '127.0.0.1') {
        $validCookies = array('XDEBUG_PROFILE' => '', 'XDEBUG_SESSION' => '', 'PHPSESSID' => '');
    }

    $removeCookies = array_diff_key($_COOKIE, $validCookies);
    if (count($removeCookies) > 0) {
        $timeInThePast = time() - 3600;
        foreach ($removeCookies as $cookieName => $value) {
            setcookie($cookieName, '', $timeInThePast);
            unset($_COOKIE[$cookieName]);
        }
    }

    $foundFiles = scandir('.');
    $acceptedFiles = array('.', '..', 'callback.php', 'index.php', 'infohub.php', 'phpinfo.php', 'test.php', 'testmenu.php', 'define_folders.php', '.htaccess', 'fullstop.flag', 'manifest.json', 'infohub.png', 'infohub-512.png', 'serviceworker.js');
    $removeFiles = array_diff($foundFiles, $acceptedFiles);
    if (count($removeFiles) > 0) {
        foreach ($removeFiles as $file) {
            if (is_file($file) === true) {
                unlink($file); // Remove files that are not on the accepted list
                continue;
            }
            if (is_dir($file) === true) {
                rmdir($file); // Remove folders that are not on the accepted list
                continue;
            }
        }
        GetOut(4.0, 'Found files that are not accepted in the server root folder:' . implode(',', $removeFiles));
    }

    $_SESSION['banned_until'] = microtime(true) + 1.0; // Every request give 1 sec ban

    function fine(float $bannedSeconds = 0.0) {
        return number_format($bannedSeconds, 4);
    }

    /**
     * If you end up here you will be thrown out
     * @param $bannedSeconds | Number of second to add to the user ban time
     * @param $message | A message to display to the user
     */
    function GetOut(float $bannedSeconds = 10.0, string $message = '') {

        $bannedSecondsLeft = 0.0;

        if (isset($_SESSION['banned_until']) === true and $bannedSeconds > 0.0) {
            if ($_SESSION['banned_until'] < microtime(true)) {
                $_SESSION['banned_until'] = microtime(true) + $bannedSeconds;
            } else {
                $_SESSION['banned_until'] = $_SESSION['banned_until'] + $bannedSeconds;
            }
            $bannedSecondsLeft = $_SESSION['banned_until'] - microtime(true);
        }

        if ($bannedSecondsLeft <= 0.0) {
            return;
        }

        $messageOut = '';
        if ($message !== '') {

            $message = str_replace('%s', $bannedSeconds, $message);

            $_SESSION['last_message'] = $message;
            
            $fileName = getFileName();
            if ($fileName === 'index.php' and $bannedSecondsLeft > 0.0) {
                $messageOut = $message . '<br>You are banned for another ' . fine($bannedSecondsLeft) . ' seconds.';
                $messageOut = '</head><body><div class="form" id="info"><h1>Information</h1><div id="alert" class="label">' . $messageOut . '</div><br /></div></body></html>';
            }
            if ($fileName === 'infohub.php') {
                $messageOut = array(
                    'to' => array('node' => 'client', 'plugin' => 'infohub_transfer', 'function' => 'ban_seconds'),
                    'data' => array(
                        'answer' => 'false',
                        'data' => $_SESSION['banned_until'],
                        'banned_until' => $_SESSION['banned_until'],
                        'ban_seconds' => $bannedSecondsLeft,
                        'message' => $message
                    )
                );
                $package = array('to_node' => 'client', 'messages' => array($messageOut));
                $messageOut = json_encode($package, JSON_PRETTY_PRINT & JSON_PRESERVE_ZERO_FRACTION);
            }
        }
        // header($_SERVER["SERVER_PROTOCOL"]." 404 Not Found");
        echo $messageOut;
        exit();
    }

    /**
     * Get the filename in the url
     * @return string
     */
    function getFileName() {
        $fileNameArray = explode('/', $_SERVER['SCRIPT_NAME']);
        $fileName = end($fileNameArray);
        return $fileName;
    }