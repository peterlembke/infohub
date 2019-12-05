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
    public function tests(): void
    {
        $this->quickTests();
        $this->httpRefererTest();
        $this->validCookies();
        $this->removeUnknownFilesAndFolders();
    }

    /**
     * Quick tests to start with
     */
    protected function quickTests(): void
    {
        $fileName = $this->getFileName();
        if ($fileName !== 'index.php') {
            $this->GetOut('The kick out tests are only available for index.php');
        }

        if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
            $this->GetOut('REQUEST_METHOD: ' . $_SERVER['REQUEST_METHOD'] . ' must be GET');
        }

        if($_SERVER['QUERY_STRING'] !== '') {
            $this->GetOut('QUERY_STRING must be empty: ' . $_SERVER['QUERY_STRING']);
        }

        if (count($_POST) !== 0) {
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

        if (isset($_SERVER['HTTP_REFERER']) === true and $_SERVER['HTTP_REFERER'] !== $url) {
            $refererFileName = str_replace($url , '', $_SERVER['HTTP_REFERER']);
            if ($refererFileName !== 'serviceworker.js') {
                $message = "HTTP_REFERER must be empty or the same as the url. Open this page in a fresh browser. Right now you have:" . $_SERVER['HTTP_REFERER'] . ', and the urls is:' . $url;
                $this->GetOut($message);
            }
        }
    }

    /**
     * I have a list of what files should be in the public folder. The rest will be deleted here
     */
    protected function removeUnknownFilesAndFolders(): void
    {
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
            $this->GetOut('Found files that are not accepted in the server root folder:' . implode(',', $removeFiles));
        }
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
    protected function GetOut(string $message = ''): void
    {
        $messageOut = '<html><head></head><body><div class="form" id="info"><h1>Information</h1><div id="alert" class="label">' . $message . '</div><br /></div></body></html>';
        // header($_SERVER["SERVER_PROTOCOL"]." 404 Not Found");
        echo $messageOut;
        exit();
    }

}

/** @var kickOut $kick */
$kick = new kickOut();
$kick->tests();
