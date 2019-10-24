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

$mode = 'developer';

$opcacheRestricted = ini_get('opcache.restrict_api');
if (is_string($opcacheRestricted) === true) {
    $opcacheRestricted = ! trim(ini_get('opcache.restrict_api')) === '';
}

if ($mode === 'developer') {
    if (function_exists('opcache_reset') === true) {
        if ($opcacheRestricted == false) {
            // opcache_reset();
        }
    }
}

// ALL ini_set is here
ini_set('zlib.output_compression','4096');
ini_set('memory_limit', '16M');
ini_set('max_execution_time', '5'); // seconds
ini_set('default_socket_timeout', '4'); // seconds

ini_set('post_max_size', '2M');
ini_set('upload_max_filesize', '2M');

if ($opcacheRestricted == false) {
    // ini_set('opcache.enable', '1'); // set to '1' when in production
}

$week = 7.0 * 24.0 * 60.0 * 60.0;
$oneWeek = (string) floor($week);
ini_set('session.cookie_lifetime', $oneWeek);
ini_set('session.gc_maxlifetime', $oneWeek);
ini_set('session.save_path', SESSION);
// ini_set('session.hash_function', 'whirlpool');
session_start();

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

$GLOBALS['infohub_error_message'] = '';
$GLOBALS['infohub_minimum_error_level'] = 'error'; // log or error

function myErrorHandler($code, $message, $file, $line) {
    $toErrorLog = array(
        'type' => 'error',
        'code' => $code,
        'message' => $message,
        'file' => $file,
        'line' => $line
    );
    $jsonMessage = json_encode($toErrorLog, JSON_PRETTY_PRINT & JSON_PRESERVE_ZERO_FRACTION);
    error_log($jsonMessage);
    $GLOBALS['infohub_error_message'] = $jsonMessage; // Only used by infohub_base::test
    echo $jsonMessage;
}

function myExceptionHandler($exception) {
    $toErrorLog = array(
        'type' => 'exception',
        'code' => $exception->getCode(),
        'message' => $exception->getMessage(),
        'file' => $exception->getFile(),
        'line' => $exception->getLine()
    );
    $jsonMessage = json_encode($toErrorLog, JSON_PRETTY_PRINT & JSON_PRESERVE_ZERO_FRACTION);
    error_log($jsonMessage);
    $GLOBALS['infohub_error_message'] = $jsonMessage; // Only used by infohub_base::test
    echo $jsonMessage;
}

/**
 * Function called when the normal execution have stopped. We are out of script or an exit are called.
 * Will also be called if there are an error.
 */
function shutdownFunction() {
    $lastError = error_get_last();
    if ($lastError['type'] === E_ERROR or $lastError['type'] === E_WARNING) {
        myErrorHandler($lastError['type'], $lastError['message'], $lastError['file'], $lastError['line']);
    }
    // No error.
}
