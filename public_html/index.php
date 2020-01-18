<?php
/**
 * index.php are the first file you read when you arrive to the site.
 * index.php will prepare the client with infohub_exchange.js and leave the control to that class.
 * @category InfoHub
 * @package Infohub
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
    if (basename(__FILE__) !== basename($_SERVER['SCRIPT_FILENAME'])) {
        exit('This file must be executed, not included.');
    }
    include_once 'define_folders.php';
    include_once INCLUDES . DS . 'settings_and_errors.php';
    include_once INCLUDES . DS . 'kick_out_tests_for_index.php';
?>
<!DOCTYPE HTML>
<html>
    <title>InfoHub is for your private data</title>
    <head>
        <meta charset="UTF-8">
        <meta name="robots" content="noindex,nofollow,noarchive,nocache,nosnippet,notranslate" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <meta name="description" content="Run InfoHub on your server or your friends server so you can store your private data and keep them away from every one else. Away from social networks and away from sharing." />
        <meta name="keywords" content="InfoHub" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black">
        <meta name="apple-mobile-web-app-title" content="Infohub">
        <meta name="allowed-outgoing-urls" content="origin">
        <?php
            $globalCss = base64_encode(file_get_contents(INCLUDES . '/infohub_global.css'));
            $faviconPng = base64_encode(file_get_contents(MAIN . '/favicon.png'));
            $infohubPng = base64_encode(file_get_contents(MAIN . '/infohub.png'));

            $checksum = md5($globalCss) . md5($faviconPng) . md5($infohubPng);
        ?>
        <link rel="stylesheet" type="text/css" id="infohub_global" href="data:text/css;base64,<?php echo $globalCss; ?>">
        <link rel="shortcut icon" id="favicon" href="data:image/png;base64,<?php echo $faviconPng; ?>" />
        <link rel="apple-touch-icon" href="data:image/png;base64,<?php echo $infohubPng; ?>">
        <link rel="manifest" href="manifest.json">
    </head>
    <body style="zoom: 100%;">
        <div id="error" class="error" box_alias="error"></div>
        <div id="sanity" class="sanity" box_alias="sanity"></div>
        <div id="log" class="log" box_alias="log">
            <progress id="progress" value="0" max="100" style="width: 100%; height: 32px; border: solid 2px;"></progress>
            <div id="progress_text"></div>
        </div>
        <div id="1" box_mode="data" class="main" box_alias="main">
            Loading InfoHub...
            <noscript>
                <legend>Information</legend>
                <br/>
                This site is built entirely on
                <a href="https://en.wikipedia.org/wiki/JavaScript" target="_blank">JavaScript</a>.<br/>
                Your web browser do not allow JavaScript.<br/>
                If you want to login you can
                <a href="https://enablejavascript.co/" target="_blank"> enable</a> JavaScript and reload the page.<br/>
            </noscript>
        </div>
        <?php
            $files = ['progress.js', 'error_handler_and_frame_breakout.js', 'the_go_function.js', 'sanity_check.js', 'start.js', 'install_service_worker.js'];
            foreach ($files as $fileName) {
                $fileContents = file_get_contents(INCLUDES . DS . $fileName);
                echo "<script>$fileContents</script>";
                $checksum = $checksum . md5($fileContents);
            }
        ?>
        <script>
            var $renderedTime = "<?php echo microtime(true); ?>";
            var $renderedChecksum = "<?php echo md5($checksum); ?>";
        </script>
    </body>
</html>
