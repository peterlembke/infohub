<?php

/**
 * ALL ini_set is here. Time zone is set here. Error and Exception handler is here
 *
 * @package     Infohub
 * @subpackage  infohub_exchange
 * @author      Peter Lembke <info@infohub.se>
 * @version     2020-11-26
 * @since       2010-01-01
 * @copyright   Copyright (c) 2010, Peter Lembke
 * @license     https://opensource.org/licenses/gpl-license.php GPL-3.0-or-later
 * @see         https://github.com/peterlembke/infohub/blob/master/folder/plugins/infohub/checksum/infohub_checksum.md Documentation
 * @link        https://infohub.se/ InfoHub main page
 */
declare(strict_types=1);
ini_set('zlib.output_compression', '4096');
ini_set('memory_limit', '16M');
ini_set('max_execution_time', '5'); // seconds
ini_set('default_socket_timeout', '4'); // seconds

ini_set('post_max_size', '2M');
ini_set('upload_max_filesize', '2M');

// Set a default time zone. If you exclude this row then you will get an error
// See: https://www.php.net/manual/en/timezones.php
date_default_timezone_set('Europe/Stockholm');

error_reporting(E_ALL); // Yes, report every error and warning, always
ini_set('display_errors', '1'); // Yes, display the errors always
ini_set('display_startup_errors', '1'); // Yes, let every error show in the browser, always
ini_set('log_errors', '1');
ini_set('error_log', LOG . DS . 'php-error.log');

set_error_handler('myErrorHandler');
set_exception_handler('myExceptionHandler');
register_shutdown_function('shutdownFunction');

// Turn off cache for ajax calls
header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
header("Cache-Control: post-check=0, pre-check=0", false);
header("Pragma: no-cache");

$GLOBALS['infohub_error_message'] = ''; // // Only used by infohub_base::test
$GLOBALS['infohub_minimum_error_level'] = 'error'; // error (default), write 'log' if you want to debug in general.

/**
 * Execution errors end up here
 * @param $code
 * @param $message
 * @param $file
 * @param $line
 */
function myErrorHandler($code, $message, $file, $line)
{
    $toErrorLog = [
        'type' => 'error',
        'code' => $code,
        'message' => $message,
        'file' => $file,
        'line' => $line
    ];
    $jsonMessage = json_encode($toErrorLog, JSON_PRETTY_PRINT & JSON_PRESERVE_ZERO_FRACTION);
    error_log($jsonMessage);
    $GLOBALS['infohub_error_message'] = $jsonMessage; // Only used by infohub_base::test
    echo $jsonMessage;
}

/**
 * You end up here on all unhandled PHP exceptions
 * @param $exception
 */
function myExceptionHandler($exception)
{
    $toErrorLog = [
        'type' => 'exception',
        'code' => $exception->getCode(),
        'message' => $exception->getMessage(),
        'file' => $exception->getFile(),
        'line' => $exception->getLine()
    ];
    $jsonMessage = json_encode($toErrorLog, JSON_PRETTY_PRINT & JSON_PRESERVE_ZERO_FRACTION);
    error_log($jsonMessage);
    $GLOBALS['infohub_error_message'] = $jsonMessage; // Only used by infohub_base::test
    echo $jsonMessage;
}

/**
 * Function called when the normal execution have stopped. We are out of script or an exit are called.
 * Will also be called if there are an error.
 */
function shutdownFunction()
{
    $lastError = error_get_last();
    if (isset($lastError['type'])) {
        if ($lastError['type'] === E_ERROR or $lastError['type'] === E_WARNING) {
            myErrorHandler($lastError['type'], $lastError['message'], $lastError['file'], $lastError['line']);
        }
    }
    // No error.
}
