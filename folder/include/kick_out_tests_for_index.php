<?php
/**
 * Kick out tests that will be run in index.php
 *
 * @package     Infohub
 * @subpackage  kick_out_tests_for_index
 */

declare(strict_types=1);

/**
 * Kick out tests that will be run in index.php
 *
 * @author      Peter Lembke <info@infohub.se>
 * @version     2019-12-03
 * @since       2019-03-09
 * @copyright   Copyright (c) 2019, Peter Lembke
 * @license     https://opensource.org/licenses/gpl-license.php GPL-3.0-or-later
 * @see         https://github.com/peterlembke/infohub/blob/master/folder/plugins/infohub/storage/data/infohub_storage_data.md Documentation
 * @link        https://infohub.se/ InfoHub main page
 */
class kick_out_tests_for_index
{

    /**
     * Main the function that runs all tests
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

        if ($_SERVER['QUERY_STRING'] !== '') {
            $pluginNameExist = str_starts_with($_SERVER['QUERY_STRING'], 'plugin_name=');
            $pluginNameIsAlone = str_contains($_SERVER['QUERY_STRING'], '&') === false;
            if ($pluginNameExist === false || $pluginNameIsAlone === false) {
                $this->GetOut('QUERY_STRING must contain plugin_name=infohub_asset or be empty: ' . $_SERVER['QUERY_STRING']);
            }
        }

        if (count($_POST) !== 0) {
            $this->GetOut('POST count: ' . count($_POST) . ' must be 0');
        }

        if ($_SERVER['REMOTE_ADDR'] == $_SERVER['SERVER_ADDR']) {
            if ($_SERVER['SERVER_ADDR'] != '127.0.0.1' and $_SERVER['SERVER_ADDR'] != '::1') {
                $this->GetOut("Only a client can start this file.");
            }
        }
    }

    /**
     * Check that we only have valid cookies.
     * Delete all other cookies
     */
    protected function validCookies(): void
    {
        $validCookies = [];
        if (($_SERVER['REMOTE_ADDR'] == $_SERVER['SERVER_ADDR']) and $_SERVER['SERVER_ADDR'] === '127.0.0.1') {
            $validCookies = ['XDEBUG_PROFILE' => '', 'XDEBUG_SESSION' => ''];
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
     * for promotional or statistical purposes. InfoHub does not want access to that information.
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
        /* This test has no practical meaning. I will probably delete it
        if (isset($_SERVER['HTTP_REFERER']) === true and $_SERVER['HTTP_REFERER'] !== $url) {
            $refererFileName = str_replace($url , '', $_SERVER['HTTP_REFERER']);
            if ($refererFileName !== 'serviceworker.js') {
                $message = "HTTP_REFERER must be empty or the same as the url. '.
                    'Open this page in a fresh browser. '.
                    'Right now you have:" . $_SERVER['HTTP_REFERER'] . ', and the urls is:' . $url;
                $this->GetOut($message);
            }
        }
        */
    }

    /**
     * I have a list of what files should be in the public folder. The rest will be deleted here
     */
    protected function removeUnknownFilesAndFolders(): void
    {
        $foundFiles = scandir('.');
        if ($foundFiles === false) {
            $foundFiles = [];
        }

        $acceptedFiles = [
            '.',
            '..',
            'index.php',
            'infohub.php',
            'phpinfo.php',
            'privacy.php',
            'define_folders.php',
            '.htaccess',
            'fullstop.flag',
            'manifest.json',
            'manifest.php',
            'images',
            'images/infohub-72.png',
            'images/infohub-96.png',
            'images/infohub-128.png',
            'images/infohub-144.png',
            'images/infohub-152.png',
            'images/infohub-192.png',
            'infohub.svg',
            'images/infohub-384.png',
            'images/infohub-512.png',
            'robots.txt',
            'serviceworker.js',
            'blog',
            'demo',
            'doc',
            'private',
            'flush_cache.php'
        ];

        $removeFiles = array_diff($foundFiles, $acceptedFiles);
        if (count($removeFiles) === 0) {
            return;
        }

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
     * If you end up here, you will be thrown out
     * @param  string  $message A message to display to the user
     * @return void
     */
    protected function GetOut(string $message = ''): void
    {
        $messageOut = '<html lang="en"><head><title>Get out</title></head><body><div class="form" id="info">' .
            '<h1>Information</h1>' .
            '<div id="alert" class="label">' . $message . '</div><br />' .
            '</div></body></html>';
        // header($_SERVER["SERVER_PROTOCOL"]." 404 Not Found");
        echo $messageOut;

        exit();
    }

}