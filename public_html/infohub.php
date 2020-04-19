<?php
/**
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
include_once INCLUDES . DS . 'kick_out_tests_for_infohub.php'; // we get $package

$corePlugins = array('infohub_base', 'infohub_exchange', 'infohub_plugin', 'infohub_transfer');
foreach ($corePlugins as $pluginName) {
    $path = PLUGINS . DS . str_replace('_', DS, $pluginName) . DS . $pluginName . '.php';
    if (file_exists($path) === true) {
        include_once $path;
        continue;
    }
    $kick->GetOut('Could not start server core plugin:' . $pluginName);
}

$infoHubExchange = new infohub_exchange($corePlugins);

$myPackage = array(
    'messages' => array(
        array(
            'to' => array(
                'node' => 'server',
                'plugin' => 'infohub_exchange',
                'function' => 'responder_verify_sign_code'
            ),
            'data' => array(
                'package' => $package
            ),
            'callstack' => array(
                array(
                    'data_back' => array(),
                    'data_request' => array(),
                    'to' => array(
                        'node' => 'client',
                        'plugin' => 'infohub_exchange',
                        'function' => 'event_message'
                    )
                )
            )
        )
    )
);

$in = array(
    'to' => array(
        'node' => 'server',
        'plugin' => 'infohub_exchange',
        'function' => 'main'
    ),
    'callstack' => array(
        array(
            'to' => array(
                'node' => 'client',
                'plugin' => 'infohub_exchange',
                'function' => 'event_message'
            ),
            'data_back' => array()
        )
    ),
    'data' => array(
        'package' => $myPackage
    )
);
$response = $infoHubExchange->cmd($in);

$signCodeValid = $infoHubExchange->getSignCodeValid();
$guestValid = $infoHubExchange->getGuestValid();

if ($signCodeValid === 'false' and $guestValid === 'false') {
    $kick->GetOut('sign_code invalid and your messages are not OK for a guest to send');
}

$in = array(
    'to' => array(
        'node' => 'server',
        'plugin' => 'infohub_exchange',
        'function' => 'main'
    ),
    'callstack' => array(
        array(
            'to' => array(
                'node' => 'client',
                'plugin' => 'infohub_exchange',
                'function' => 'event_message'
            ),
            'data_back' => array()
        )
    ),
    'data' => array(
        'package' => $package
    )
);
$response = $infoHubExchange->cmd($in);

if (isset($response['answer']) and $response['answer'] === 'false') {
    $kick->GetOut($response['message']);
}
