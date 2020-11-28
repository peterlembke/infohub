<?php
/**
 * Used by the client ajax
 *
 * @package     Infohub
 * @subpackage  root
 */

declare(strict_types=1);
if (file_exists('fullstop.flag') == true) {
    exit('The site have gone into a full stop.');
}

/**
 * Used by the client ajax
 *
 * @author      Peter Lembke <info@infohub.se>
 * @version     2020-11-21
 * @since       2015-11-15
 * @copyright   Copyright (c) 2010, Peter Lembke
 * @license     https://opensource.org/licenses/gpl-license.php GPL-3.0-or-later
 * @see         https://github.com/peterlembke/infohub/blob/master/folder/doc/core/root/infohub/core_root_infohub.md Documentation
 * @link        https://infohub.se/ InfoHub main page
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

$banned = $infoHubExchange->getBanned();
if ($banned === 'true') {
    $kick->GetOut('You already had ban time when you called the server again');
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
