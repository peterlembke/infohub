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

set_error_handler('myErrorhandler');
set_exception_handler('myExceptionHandler');
register_shutdown_function('shutdownFunction');

// Turn off cache for ajax calls
header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');
header('Cache-Control: post-check=0, pre-check=0', false);
header('Pragma: no-cache');

// Security headers. https://securityheaders.com/?q=infohub.se&followRedirects=on
header('Strict-Transport-Security: max-age=31536000; includeSubDomains');

// https://scotthelme.co.uk/content-security-policy-an-introduction/
// https://content-security-policy.com/nonce/
// header("Content-Security-Policy-Report-Only: default-src 'self'; script-src 'unsafe-eval' 'unsafe-inline' 'self' ; style-src 'unsafe-inline' 'self'; img-src data: 'unsafe-inline' 'self';");
header("Content-Security-Policy: default-src 'self'; script-src 'unsafe-eval' 'unsafe-inline' 'self' ; style-src 'unsafe-inline' 'self'; img-src data: 'unsafe-inline' 'self';");

header('X-Frame-Options: SAMEORIGIN');
header('X-Content-Type-Options: nosniff');
header('Referrer-Policy: same-origin');

// https://www.permissionspolicy.com/
// Turn off features in your browser that could overstep your privacy or goes against the InfoHub purpose.
header('Permissions-Policy: accelerometer=(), autoplay=(), camera=(), cross-origin-isolated=(self), display-capture=(), document-domain=(), encrypted-media=(), fullscreen=(self), geolocation=(), gyroscope=(), keyboard-map=(self), magnetometer=(), microphone=(), midi=(self), payment=(), picture-in-picture=(), publickey-credentials-get=(self), screen-wake-lock=(), sync-xhr=(self), usb=(), xr-spatial-tracking=(self)');

$GLOBALS['infohub_error_message'] = ''; // // Only used by infohub_base::test
$GLOBALS['infohub_minimum_error_level'] = 'log'; // error (default). debug, log, info, error
$GLOBALS['main_loop_max_count'] = 500; // Number of runs in the main loop. To prevent jobs that will never finish.

/**
 * Execution errors end up here
 *
 * @param  int  $errorNumber
 * @param  string  $message
 * @param  string  $file
 * @param  int  $line
 * @return bool
 */
function myErrorHandler(
    int $errorNumber = 0,
    string $message = '',
    string $file = '',
    int $line = 0
): bool {

    $toErrorLog = [
        'type' => 'error',
        'code' => $errorNumber,
        'message' => $message,
        'file' => $file,
        'line' => $line
    ];
    $jsonMessage = json_encode($toErrorLog, JSON_PRETTY_PRINT & JSON_PRESERVE_ZERO_FRACTION);
    if (empty($jsonMessage) === true) {
        $jsonMessage = '{ "message": "Failed to json encode the real error message"}';
    }

    error_log($jsonMessage);
    $GLOBALS['infohub_error_message'] = $jsonMessage; // Only used by infohub_base::test
    echo $jsonMessage;

    return true;
}

/**
 * You end up here on all unhandled PHP exceptions
 * @param Throwable $exception
 */
function myExceptionHandler(Throwable $exception): void
{
    $toErrorLog = [
        'type' => 'exception',
        'code' => $exception->getCode(),
        'message' => $exception->getMessage(),
        'file' => $exception->getFile(),
        'line' => $exception->getLine()
    ];
    $jsonMessage = json_encode($toErrorLog, JSON_PRETTY_PRINT & JSON_PRESERVE_ZERO_FRACTION);
    if (empty($jsonMessage) === true) {
        $jsonMessage = '{ "message": "Failed to json encode the real error message"}';
    }
    error_log($jsonMessage);
    $GLOBALS['infohub_error_message'] = $jsonMessage; // Only used by infohub_base::test

    echo $jsonMessage;
}

/**
 * Function called when the normal execution have stopped. We are out of script or an exit are called.
 * Will also be called if there are an error.
 */
function shutdownFunction(): void
{
    $memory = memory_get_usage();
    $lastError = error_get_last();
    if (isset($lastError['type']) === true) {
        if ($lastError['type'] === E_ERROR or $lastError['type'] === E_WARNING) {
            myErrorHandler($lastError['type'], $lastError['message'], $lastError['file'], $lastError['line']);
        }
    }
    // No error.
}
