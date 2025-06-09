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
// error_handler_and_frame_breakout

var $GLOBALS = {};
$GLOBALS.infohub_error_message = '';
$GLOBALS.infohub_minimum_error_level = 'warn'; // debug, log, info, warn or error

window.onerror = function($msg, $url, $line) {
    'use strict';

    const $suppressErrorAlert = true;
    const $toErrorLog = {
        'code': '',
        'message': $msg,
        'file': $url,
        'line': $line,
    };
    const $jsonMessage = JSON.stringify($toErrorLog);

    $GLOBALS.infohub_error_message = $jsonMessage; // Only used by infohub_base::test
    window.alert($jsonMessage);

    return $suppressErrorAlert;
};

if (top !== self) {
    const $error = 'Error: I am in a frame, that is not right. Check the web address. I will not continue.';
    window.alert($error);
    parent.document.body.innerHTML = '';
    throw new Error($error);
}
//# sourceURL=error_handler_and_frame_breakout.js