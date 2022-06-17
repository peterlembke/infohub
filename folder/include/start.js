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
// Retrieve and start the core plugins
// See bottom of this plugin for the command that trigger this start class
function infohub_start($progress) {

    'use strict';

    let $globalOnline = 'true', // Indicate if the server have answered or not
        $globalOnlineTimer = 0; // When server have not answered then $globalOnline is 'false' for 30 seconds

    this.start = function() {
        _SetBackground();

        $progress.whatArea('start', 0, 'START');

        if (_LocalStorageExist() === 'false') {
            const $text = 'localStorage is not available when you have disabled all cookies. Infohub do not use cookies but use localStorage to store plugins for performance and to store number of failed startup attempts so it can automatically correct the issues and start Infohub';
            $progress.whatArea('start', 0, $text);
            window.alert($text);
            return;
        }

        if ($globalOnline === 'true') {
            _ColdStart();
        }

        $progress.whatArea('start', 0, 'Get core plugin names');
        const $neededPluginNames = _GetNeededPluginNames();
        $progress.whatArea('missing_plugins', 0, 'Get missing plugin names');
        const $missingPluginNames = _GetMissingPluginNames($neededPluginNames);

        if ($missingPluginNames.length > 0) {
            $progress.whatArea('get_package', 0,
                'Create a package with messages');
            const $package = _GetPackage($missingPluginNames);
            $progress.whatArea('call_server', 0, 'Call the server');
            _CallServer($package); // Ajax call, and it will run _StartCore later
        }

        if ($missingPluginNames.length === 0) {
            $progress.whatArea('start_core_plugin', 0, 'Start the core');
            const $corePluginNames = _GetCorePluginNames();
            _StartCore($corePluginNames);
        }
    };

    /**
     * My definition of an empty variable
     * @param $object
     * @returns {*}
     * @private
     */
    const _Empty = function($object) {
        if (typeof $object === 'undefined' || $object === null) {
            return 'true';
        }

        if (typeof $object === 'object' && _Count($object) === 0) {
            return 'true';
        }

        if (typeof $object === 'string' && $object === '') {
            return 'true';
        }

        return 'false';
    };

    /**
     * Check if local storage exist in the browser
     * @version 2015-09-20
     * @since   2015-04-24
     * @author  Peter Lembke
     */
    const _LocalStorageExist = function() {
        let $exist = 'false';

        try {
            $exist = 'localStorage' in window && window.localStorage !== null;
        } catch ($err) {
            return 'false';
        }

        if ($exist === true) {
            return 'true';
        }

        return 'false';
    };

    /**
     * Set/Check the cold_start flag in localStorage
     * Will be removed in the end of this file when the first message have been sent. See end of _SendFirstMessage
     *
     * @returns {boolean}
     * @private
     */
    const _ColdStart = function() {
        let $failedStarts = localStorage.getItem('cold_start');
        if (_Empty($failedStarts) === 'true') {
            $failedStarts = 0;
        }
        $failedStarts = parseInt($failedStarts);

        if ($failedStarts === 1) {
            $progress.whatArea('start', 0,
                'Failed start - Now cleared local storage and will trying again');
            localStorage.clear();
            localStorage.setItem('cold_start', '2');
            location.reload();
        }

        if ($failedStarts === 3) {
            $progress.whatArea('start', 0, 'Failed start - Now cleared local storage and unregistered service workers and will try again');
            _UnregisterServiceWorkers();
            localStorage.clear();
            localStorage.setItem('cold_start', '4');
            location.reload();
        }

        if ($failedStarts === 5) {
            $progress.whatArea('start', 0, 'Failed start - Now cleared local storage and database, unregistered service workers and will try again');
            _UnregisterServiceWorkers();
            localStorage.clear();
            indexedDB.deleteDatabase('localforage');
            indexedDB.deleteDatabase('keyval-store'); // idbkeyval
            localStorage.setItem('cold_start', '6');
            location.reload();
        }

        if ($failedStarts >= 7) {
            $progress.whatArea('start', 0, 'Failed start - Perhaps you are offline');
            window.alert('I have cleared the localStorage and then the indexedDb and still I can not start Infohub. Are you offline?');
            return false;
        }

        $progress.whatArea('start', 0, 'failed starts: ' + $failedStarts);

        $failedStarts = $failedStarts + 1;
        $failedStarts = $failedStarts.toString();
        localStorage.setItem('cold_start', $failedStarts);

        setTimeout(function() {
            let $failedStarts = localStorage.getItem('cold_start');
            if (_Empty($failedStarts) === 'true') {
                $failedStarts = 0;
            }
            $failedStarts = parseInt($failedStarts);

            if ($failedStarts > 0 && $failedStarts < 7) {
                $progress.whatArea('start', 0, 'Failed start - Took too long to start - I will reload the page');
                location.reload();
            }
        }, 10000); // If the cold_start flag is not gone in 10 seconds then I reload the page

        return true;
    };

    /**
     * Unregister all service workers for this site
     * @private
     */
    const _UnregisterServiceWorkers = function() {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.getRegistrations().
                then(function(registrations) {
                    for (let registration of registrations) {
                        registration.unregister();
                    }
                });
        }
    };

    /**
     * Plugins that must be started before you can send the first message
     * @returns {string[]}
     */
    const _GetCorePluginNames = function() {
        return [
            'infohub_cache',
            'infohub_exchange',
            'infohub_plugin',
            'infohub_transfer',
            'infohub_session',
            'infohub_keyboard',
            'infohub_offline',
            'infohub_checksum',
            'infohub_timer',

        ];
    };

    /**
     * Plugins that you need locally
     * @returns {string[]}
     */
    const _GetNeededPluginNames = function() {
        return [
            'infohub_asset',
            'infohub_base',
            'infohub_cache',
            'infohub_checksum',
            'infohub_checksum_md5',
            'infohub_compress',
            'infohub_compress_gzip',
            'infohub_configlocal',
            'infohub_configlocal_colour',
            'infohub_configlocal_image',
            'infohub_configlocal_language',
            'infohub_configlocal_zoom',
            'infohub_debug',
            'infohub_exchange',
            'infohub_keyboard',
            'infohub_launcher',
            'infohub_login',
            'infohub_login_contact',
            'infohub_login_login',
            'infohub_login_standalone',
            'infohub_offline',
            'infohub_plugin',
            'infohub_render',
            'infohub_render_common',
            'infohub_render_form',
            'infohub_render_link',
            'infohub_render_text',
            'infohub_renderdocument',
            'infohub_renderform',
            'infohub_rendermajor',
            'infohub_session',
            'infohub_standalone',
            'infohub_storage',
            // 'infohub_storage_data',
            // 'infohub_storage_data_idbkeyval',
            'infohub_tabs',
            'infohub_timer',
            'infohub_transfer',
            'infohub_translate',
            'infohub_view',
            'infohub_workbench',
        ];
    };

    /**
     * Gives a list of required plugins that you do not have in the local storage.
     * See _GetCorePluginNames above for a list of required plugins.
     * @param $corePluginNames
     * @returns {Array}
     * @private
     */
    const _GetMissingPluginNames = function($corePluginNames) {
        const $numberOfCorePluginNames = _Count($corePluginNames);
        let $missingCorePluginNames = [];
        let $number = 0;
        let $part = 0.0;
        const $areaCode = 'missing_plugins';

        for (let $pluginNameId in $corePluginNames) {
            if ($corePluginNames.hasOwnProperty($pluginNameId) === false) {
                continue;
            }

            $number = $number + 1;
            $part = $number / $numberOfCorePluginNames * 100.0;

            const $key = 'plugin_' + $corePluginNames[$pluginNameId];

            if ($key in localStorage) {
                $progress.whatArea($areaCode, $part, 'I have ' + $key);
            } else {
                $missingCorePluginNames.push($corePluginNames[$pluginNameId]);
                $progress.whatArea($areaCode, $part, 'Missing ' + $key);
            }
        }

        return $missingCorePluginNames;
    };

    /**
     * Count number of items in an array or an object
     * @param $object
     * @returns {*}
     * @private
     */
    const _Count = function($object) {
        if (Array.isArray($object) === true) {
            return $object.length;
        }

        if ($object) {
            return Object.getOwnPropertyNames($object).length;
        }

        return 0;
    };

    /**
     * Returns a package with one message requesting missing required plugins from the server node
     * @param $missingPluginNames
     * @returns {{sign_code: string, session_id: string, messages_encoded_length: number, sign_code_created_at: string, package_type: string, messages_encoded: string}}
     * @private
     */
    const _GetPackage = function($missingPluginNames) {
        const $message = {
            'to': {
                'node': 'server',
                'plugin': 'infohub_plugin',
                'function': 'plugins_request',
            },
            'callstack': [
                {
                    'to': {
                        'node': 'client',
                        'plugin': 'infohub_start',
                        'function': 'start',
                    },
                },
            ],
            'data': {
                'missing_plugin_names': $missingPluginNames,
            },
            'alias': 'Run plugins_request to get missing core client plugins',
            'wait': 0.0,
        };

        let $messages = [];
        $messages.push($message);

        const $messagesJson = JSON.stringify($messages); // _JsonEncode($package.messages); // avoid prettify
        const $messagesEncoded = btoa($messagesJson);

        const $timestamp = (new Date()).getTime() / 1000.0;

        const $package = {
            'sign_code': '',
            'sign_code_created_at': $timestamp.toString(),
            'session_id': '',
            'messages_encoded': $messagesEncoded,
            'messages_encoded_length': $messagesEncoded.length,
            'package_type': '2020',
        };

        return $package;
    };

    /**
     * An AJAX call to the server
     * @param $package
     * @private
     */
    const _CallServer = function($package) {

        if (_Empty($package) === 'true') {
            return;
        }

        let xmlHttp = new XMLHttpRequest();
        const $content = JSON.stringify($package);
        const $url = 'infohub.php';
        const $async = true;

        $progress.whatArea('call_server', 10, 'Call the server - will send');

        const $maxWaitTimeMS = 60000.0;

        const noResponseTimer = setTimeout(function() {
            xmlHttp.abort();
            _SetGlobalOnline('false');
        }, $maxWaitTimeMS);

        xmlHttp.open('POST', $url, $async);

        xmlHttp.onreadystatechange = function() {

            if (xmlHttp.readyState !== 4) {
                return;
            }

            if (xmlHttp.status !== 200) {
                return;
            }

            $progress.whatArea('call_server', 30, 'Call the server - got response');

            _SetGlobalOnline('true'); // We got a message, we are online
            clearTimeout(noResponseTimer); // We got a response before the timeout

            let $response = xmlHttp.responseText;
            const $isErrorMessage = _IsErrorMessage($response);

            if ($response !== '' && $response[0] === '{' && $isErrorMessage === 'false') {
                $response = JSON.parse($response);

                $response.messages = JSON.parse(atob($response.messages_encoded));
                delete ($response.messages_encoded);

                const $text = 'Call the server - Valid response, parsing...';
                $progress.whatArea('call_server', 40, $text);

                _HandleServerResponse($response);
                return;
            }

            if ($response[0] === '{') {
                const $length = $response.indexOf('}') + 1;
                $response = $response.substr(0, $length);
            }

            let $text = 'Call the server - Invalid response';
            $progress.whatArea('call_server', 40, $text);

            $text = 'Error from server<br>' + $response;
            document.getElementById('error').innerHTML = $text;
        };

        xmlHttp.setRequestHeader('Content-type', 'application/json');

        setTimeout(function() {
            $progress.whatArea('call_server', 20, 'Call the server - sending');
            xmlHttp.send($content);
        }, 1000);
    };

    /**
     * Set or clear the global variable $globalOnline.
     * The variable will go back to true after 30 seconds, so we can try again to reach the server.
     * @param $value
     * @private
     */
    const _SetGlobalOnline = function($value) {

        if ($value !== 'true' && $value !== 'false') {
            return;
        }

        if ($globalOnline === $value) {
            return;
        }

        if ($value === 'false') {
            $globalOnline = 'false';

            const $maxWaitTimeMSToSetGlobalOnlineBackToTrue = 30000.0;

            $globalOnlineTimer = setTimeout(function() {
                $globalOnline = 'true';
            }, $maxWaitTimeMSToSetGlobalOnlineBackToTrue);

            return;
        }

        $globalOnline = 'true';

        if ($globalOnlineTimer !== 0) {
            clearTimeout($globalOnlineTimer);
        }
    };

    /**
     * Loop through all types of error messages and return 'true' if an
     * error message is detected in the response.
     * @param $response
     * @returns {*}
     * @private
     */
    const _IsErrorMessage = function($response) {
        const $errorMessageArray = ['{"type":"exception",', '{"type":"error",'];

        for (let $key in $errorMessageArray) {
            if ($errorMessageArray.hasOwnProperty($key) === false) {
                continue;
            }

            const $errorMessage = $errorMessageArray[$key];
            const $startOfResponse = $response.substr(0, $errorMessage.length);

            if ($startOfResponse === $errorMessage) {
                return 'true';
            }

        }
        return 'false';
    };

    /**
     * Handles the AJAX response from the server
     * @param $serverResponse
     * @private
     */
    const _HandleServerResponse = function($serverResponse) {
        $progress.whatArea('server_response', 0,
            'Server response - handle the data');

        const $response = _GetMessagesFromResponse($serverResponse);

        if ($response.answer === 'false') {
            alert($response.message);
            return;
        }

        if ($response.items.plugins.length === 0) {
            alert('Did not get the missing plugins from the server');
            return;
        }

        _StorePlugins($response.items.plugins);

        let $neededPluginNames = _GetNeededPluginNames();
        let $missingPluginNames = _GetMissingPluginNames($neededPluginNames);

        if ($missingPluginNames.length > 0) {
            // We can not start the core yet
            const $package = _GetPackage($missingPluginNames);
            $progress.whatArea('call_server', 0, 'Call the server');
            _CallServer($package); // Ajax call, and it will run _StartCore later
        }

        if ($missingPluginNames.length === 0) {
            const $corePluginNames = _GetCorePluginNames();
            _StartCore($corePluginNames);
        }
    };

    /**
     * Pull out the missing plugins we got from the server
     * @param $response
     * @returns {{answer: string, message: string, items: {}}}
     * @private
     */
    const _GetMessagesFromResponse = function($response) {
        let $answer = 'false';
        let $message = '';

        const $messages = $response.messages;
        const $path = 'plugins';
        let $out = {};

        leave:
        {
            if ($messages.length === 0) {
                $message = 'Got no messages back from the server';
                break leave;
            }

            for (let $key in $messages) {
                if ($messages.hasOwnProperty($key) === false) {
                    continue;
                }

                let $item = $messages[$key];

                if (typeof $item.data.response === 'undefined') {
                    $item.data.response = $item.data;
                }

                if ($item.data.response.answer === 'false') {
                    $message = 'Server error: ' + $item.data.response.message;
                    break leave;
                }

                if (typeof $item.data.response.plugins !== 'undefined') {
                    $out[$path] = $item.data.response.plugins;
                }
            }

            $answer = 'true';
            $message = 'Here are the messages';
        }

        return {
            'answer': $answer,
            'message': $message,
            'items': $out,
        };
    };

    /**
     * Stores all new plugins in local storage and updates the plugin index in local storage.
     * @param $plugins
     * @private
     */
    const _StorePlugins = function($plugins) {
        const $areaCode = 'store_plugin';
        const $textPrefix = 'Store prefix - ';

        $progress.whatArea($areaCode, 0, $textPrefix + 'Initializing...');

        let $index = localStorage.getItem('plugin_index');

        if (_Empty($index) === 'true') {
            $index = {};
        } else {
            $index = JSON.parse($index);
        }

        const $numberOfPluginsToStore = _Count($plugins);
        let $number = 0;
        let $partPercent = 0.0;

        for (let $pluginName in $plugins) {
            if ($plugins.hasOwnProperty($pluginName) === false) {
                continue;
            }

            $number = $number + 1;
            $partPercent = $number / $numberOfPluginsToStore * 100;
            const $text = $textPrefix + $pluginName + '...';
            $progress.whatArea($areaCode, $partPercent, $text);

            const $pluginJsonData = JSON.stringify($plugins[$pluginName]);
            localStorage.setItem('plugin_' + $pluginName, $pluginJsonData);

            $index[$pluginName] = {
                'checksum': $plugins[$pluginName].plugin_checksum,
                'timestamp_added': _MicroTime(),
            };

        }

        $progress.whatArea($areaCode, 100, 'Store plugin Index...');
        localStorage.setItem('plugin_index', JSON.stringify($index));
    };

    /**
     * Returns seconds since EPOC, with decimals
     * @returns {number}
     * @private
     */
    const _MicroTime = function() {
        const $microtime = (new Date()).getTime() / 1000.0;

        return $microtime;
    };

    /**
     * Starts all core plugins in memory.
     * Then we start everything by sending the first message.
     * @param $corePluginNames
     * @private
     */
    const _StartCore = function($corePluginNames) {
        const $response = _StartPlugins($corePluginNames);

        if ($response.answer === 'true') {
            _SendFirstMessage();
            return;
        }

        const $messageOut = JSON.stringify($response, null, '\t');
        alert($messageOut);
    };

    /**
     * Start all core plugins
     * @param $corePluginNames
     * @returns {{answer: string, message: string, all_started: string, started: {}, not_started: {}}}
     * @private
     */
    const _StartPlugins = function($corePluginNames) {
        const $areaCode = 'start_core_plugin';

        let $out = {
            'answer': 'true',
            'message': 'All core plugins are started',
            'all_started': 'true',
            'started': {},
            'not_started': {},
        };

        $progress.whatArea('start_core_plugin', 0, 'Start the core');

        const $basePluginJson = localStorage.getItem('plugin_infohub_base');
        const $basePlugin = JSON.parse($basePluginJson);

        let $number = 0;
        const $numberOfCorePluginNames = _Count($corePluginNames);
        let $partPercent = 0.0;

        for (let $pluginKey in $corePluginNames) {
            if ($corePluginNames.hasOwnProperty($pluginKey) === false) {
                continue;
            }

            const $pluginName = $corePluginNames[$pluginKey];

            $number = $number + 1;
            $partPercent = $number / $numberOfCorePluginNames * 100.0;
            const $text = 'Start the core - plugin: ' + $pluginName;
            $progress.whatArea($areaCode, $partPercent, $text);

            if ($pluginName === 'infohub_base') {
                continue;
            }

            const $pluginJsonData = localStorage.getItem(
                'plugin_' + $pluginName);
            let $plugin = JSON.parse($pluginJsonData);

            if ($plugin === null) {
                $out.all_started = 'false';
                $out.not_started[$pluginName] = 'Could not get the plugin from local storage';
                break;
            }

            $plugin.plugin_code = $plugin.plugin_code.replace('{{base_checksum}}', $basePlugin.plugin_checksum);
            $plugin.plugin_code = $plugin.plugin_code.replace('\// include \"infohub_base.js\"', $basePlugin.plugin_code);

            const $response = _StartPlugin($plugin);
            if ($response.answer === 'false') {
                $out.all_started = 'false';
                $out.not_started[$pluginName] = $response.message;
                alert($response.message + ' ' + $pluginName);
                break;
            }

            $out.started[$pluginName] = $response.message;
        }

        if ($out.all_started === 'false') {
            $out.answer = 'false';
            $out.message = 'All core plugins could not be started';
        }

        return $out;
    };

    /**
     * Start one plugin
     * @param $in
     * @returns {{answer: string, message: string}}
     */
    const _StartPlugin = function($in = {}) {
        let $response = {
            'answer': 'false',
            'message': '',
        };

        block: {

            let $ok = 'true';

            try {
                eval.call(window, $in.plugin_code);
            } catch ($err) {
                $response.message = 'Can not evaluate the plugin class:"' + $in.plugin_name + '", error:"' + $err.message + '"';
                break block;
            }

            // Check that the plugin class are available
            try {
                const $row = 'if (typeof ' + $in.plugin_name + ' === \'undefined\') { $ok = \'false\'; }';
                eval($row);
            } catch ($err) {
                $response.message = 'Can not check if the class:"' +
                    $in.plugin_name + '" exist. error:"' + $err.message + '"';
                break block;
            }

            if ($ok === 'false') {
                $response.message = 'Could not start plugin:' + $in.plugin_name;
                break block;
            }

            $response.answer = 'true';
            $response.message = 'Have started the plugin:' + $in.plugin_name;
        }

        return $response;
    };

    /**
     * Sends the first message as an event.
     * @private
     */
    const _SendFirstMessage = function() {
        $progress.whatArea('send_first_message', 0, 'Will send the first message');

        const $message = {
            'to': {
                'node': 'client',
                'plugin': 'infohub_exchange',
                'function': 'startup',
            },
            'callstack': [],
            'data': {},
            'alias': 'Run startup',
            'wait': 0.0,
        };

        let $package = {
            'to_node': 'server',
            'messages': [],
        };

        $package.messages.push($message);

        let $plugin;

        try {
            eval('$plugin = new infohub_exchange();');
        } catch ($err) {
            alert('Can not instantiate class:"infohub_exchange()", error:"' + $err.message + '"');
            return;
        }

        if (typeof $plugin === 'undefined' || $plugin === null) {
            alert('Class:"infohub_exchange()", are undefined');
            return;
        }

        setTimeout(function() {

            localStorage.removeItem('cold_start');

            const $event = new CustomEvent('infohub_call_main',
                {
                    detail: {'plugin': $plugin, 'package': $package},
                    bubbles: true,
                    cancelable: true,
                },
            );
            document.dispatchEvent($event);
            $progress.whatArea('clean_up', 0, 'Have sent first message');

            // The first command in start.js is to check this flag. We have gone so far now that it is time to reset the flag.

        }, 0.0);
    };

    /**
     * Set the background and text color depending on browser setting.
     * @private
     */
    const _SetBackground = function() {
        let $backgroundColor = 'white';
        let $color = 'black';

        if (_IsDarkModeEnabled() === true) {
            $backgroundColor = 'black';
            $color = 'white';
        }
        document.body.style['backgroundColor'] = $backgroundColor;
        document.body.style['color'] = $backgroundColor;
    };

    /**
     * Detects if dark mode is enabled or not
     * I will just test. This must be moved to infohub_view later
     * @returns {boolean}
     * @private
     */
    const _IsDarkModeEnabled = function() {

        const $matchMedia = '(prefers-color-scheme: dark)';
        const $wantDarkMode = window.matchMedia && window.matchMedia($matchMedia).matches;

        return $wantDarkMode;
    };
}

/**
 * Handler for event 'infohub_call_main'
 * See event listener below
 * @param $eventData
 */
function infohubCallMainHandler($eventData) {
    'use strict';

    const $in = $eventData.detail;

    /*
    const $default = {
        'plugin': null,
        'message': '',
        'package': {}
    };
    $in = _Default($default, $in);

    console.log('Event');
     */

    const $callMainMessage = {
        'to': {
            'node': 'client',
            'plugin': 'infohub_exchange',
            'function': 'main',
        },
        'callstack': [],
        'data': {'package': $in.package},
        'alias': 'First message',
        'wait': 0.0,
    };

    // console.dir($callMainMessage);

    if (typeof infohubCallMainHandler.plugin === 'undefined' ||
        infohubCallMainHandler.plugin === null) {
        infohubCallMainHandler.plugin = $in.plugin;
    }

    const $message = infohubCallMainHandler.plugin.cmd($callMainMessage);
}

document.addEventListener('infohub_call_main', infohubCallMainHandler, false);

const $infohub_start = new infohub_start($progress); // $progress are declared in another file
$infohub_start.start();
//# sourceURL=start.js
