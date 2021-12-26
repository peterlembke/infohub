<?php
/**
 * First file to run
 *
 * @package     Infohub
 * @subpackage  root
 */

declare(strict_types=1);
if (file_exists('fullstop.flag') == true) {
    exit('The site have gone into a full stop.');
}

/**
 * First file to run
 *
 * @author      Peter Lembke <info@infohub.se>
 * @version     2020-11-21
 * @since       2015-11-15
 * @copyright   Copyright (c) 2010, Peter Lembke
 * @license     https://opensource.org/licenses/gpl-license.php GPL-3.0-or-later
 * @see         https://github.com/peterlembke/infohub/blob/master/folder/doc/core/root/index/core_root_index.md Documentation
 * @link        https://infohub.se/ InfoHub main page
 */
if (basename(__FILE__) !== basename($_SERVER['SCRIPT_FILENAME'])) {
    exit('This file must be executed, not included.');
}
include_once 'define_folders.php';
include_once INCLUDES.DS.'settings_and_errors.php';
include_once INCLUDES.DS.'kick_out_tests_for_index.php';
include_once INCLUDES.DS.'application_data.php';
?>
<!DOCTYPE HTML>
<html lang="en">
<head>
    <title><?php echo $appData->getTitle(); ?></title>
    <meta charset="UTF-8">
    <meta name="robots" content="noindex,nofollow,noarchive,nocache,nosnippet,notranslate"/>
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
    <meta name="description" content="<?php echo $appData->getDescription(); ?>"/>
    <meta name="keywords" content="<?php echo $appData->getKeyWords(); ?>"/>
    <meta name="mobile-web-app-capable" content="yes"/>
    <meta name="apple-mobile-web-app-capable" content="yes"/>
    <meta name="apple-mobile-web-app-status-bar-style" content="black">
    <meta name="application-name" content="<?php echo $appData->getTitle(); ?>"/>
    <meta name="apple-mobile-web-app-title" content="<?php echo $appData->getTitle(); ?>">
    <meta name="allowed-outgoing-urls" content="origin">
    <?php
    $globalCss = file_get_contents(INCLUDES.'/infohub_global.css');
    $faviconPng = $appData->getIconData('png');
    $infohubSvg = file_get_contents(PLUGINS.'/infohub/welcome/asset/icon/infohub-logo-done.svg');

    $checksum = md5($globalCss).md5($faviconPng);
    ?>
    <style id="infohub_global"><?php echo $globalCss; ?></style>
    <link rel="shortcut icon" id="favicon" href="<?php echo $faviconPng; ?>"/>
    <link rel="apple-touch-icon" href="<?php echo $faviconPng; ?>">
    <link rel="manifest" href="manifest.php?plugin_name=<?php echo $appData->getPluginNameFromUrl(); ?>">
</head>
<body style="zoom: 100%;">
<div id="error" class="error" box_alias="error"></div>
<div id="sanity" class="sanity" box_alias="sanity"></div>
<div id="log" class="log" box_alias="log"></div>
<div id="1" box_mode="data" class="main" box_alias="main">
    <div style="width:50%;display: block; margin-left: auto; margin-right: auto;"><?php echo $infohubSvg; ?></div>
    <progress id="progress" value="0" max="100"></progress>
    <div id="progress_text"></div>
    <noscript>
        <h1>Information</h1>
        <br/>
        This site is built entirely on
        <a href="https://en.wikipedia.org/wiki/JavaScript" target="_blank">JavaScript</a>.<br/>
        Your web browser do not allow JavaScript.<br/>
        If you want to log in you can
        <a href="https://enablejavascript.co/" target="_blank"> enable</a> JavaScript and reload the page.<br/>
    </noscript>
</div>
<?php
$files = [
    'progress.js',
    'error_handler_and_frame_breakout.js',
    'the_go_function.js',
    'sanity_check.js',
    'start.js',
    'install_service_worker.js'
];
foreach ($files as $fileName) {
    $fileContents = file_get_contents(INCLUDES.DS.$fileName);
    echo "<script>$fileContents</script>";
    $checksum = $checksum.md5($fileContents);
}
?>
<script>
    var $renderedTime = "<?php echo microtime(true); ?>";
    var $renderedChecksum = "<?php echo md5($checksum); ?>";
</script>
</body>
</html>
