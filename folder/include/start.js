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
function infohub_start() {

    var $globalOnline = 'true', // Indicate if the server have answered or not
        $globalOnlineTimer = 0; // When server have not answered then $globalOnline is 'false' for 30 seconds

    this.start = function ()
    {
        "use strict";

        $progress.whatArea('start',0, 'START');

        if ($globalOnline === 'true') {
            _ColdStart();
        }

        $progress.whatArea('start',0, 'Get core plugin names');
        const $neededPluginNames = _GetNeededPluginNames();
        $progress.whatArea('missing_plugins',0, 'Get list with missing plugins');
        const $missingPluginNames = _GetMissingPluginNames($neededPluginNames);

        if ($missingPluginNames.length > 0) {
            $progress.whatArea('get_package', 0, 'Create a package with messages');
            const $package = _GetPackage($missingPluginNames);
            $progress.whatArea('call_server', 0, 'Call the server');
            _CallServer($package); // Ajax call, and it will run _StartCore later
        }

        if ($missingPluginNames.length === 0) {
            $progress.whatArea('start_core_plugins',0, 'Start the core');
            const $corePluginNames = _GetCorePluginNames();
            _StartCore($corePluginNames);
        }
    };

    /**
     * Set/Check the cold_start flag in localStorage
     * Will be removed in the end of this file when the first message have been sent. See end of _SendFirstMessage
     * @param {type} $in
     * @returns {Boolean}
     */
    var _ColdStart = function ()
    {
        "use strict";

        let $failedStarts = localStorage.getItem('cold_start');
        if ($failedStarts == null) {
            $failedStarts = 0;
        }
        $failedStarts = parseInt($failedStarts);

        if ($failedStarts === 1) {
            $progress.whatArea('start',0, 'Failed start - Clearing local storage and trying again');
            localStorage.clear();
            localStorage.setItem('cold_start', '2');
            location.reload();
        }

        if ($failedStarts === 3) {
            $progress.whatArea('start',0, 'Failed start - Clearing local storage and database and trying again');
            if ('serviceWorker' in navigator) {
                navigator.serviceWorker.getRegistrations().then(function(registrations) {
                    for(let registration of registrations) {
                        registration.unregister();
                    }
                });
            }
            localStorage.clear();
            indexedDB.deleteDatabase("localforage");
            indexedDB.deleteDatabase("keyval-store"); // idbkeyval
            localStorage.setItem('cold_start', '4');
            location.reload();
        }

        if ($failedStarts >= 5) {
            $progress.whatArea('start',0, 'Failed start - Perhaps you are offline');
            window.alert('I have cleared the localStorage and then the indexedDb and still I can not start Infohub. Are you offline?');
            return false;
        }

        $failedStarts++;
        $failedStarts = $failedStarts.toString();
        localStorage.setItem('cold_start', $failedStarts);

        setTimeout(function() {
            let $failedStarts = localStorage.getItem('cold_start');
            if ($failedStarts == null) {
                $failedStarts = 0;
            }
            $failedStarts = parseInt($failedStarts);

            if ($failedStarts > 0 && $failedStarts < 5) {
                $progress.whatArea('start',0, 'Failed start - Took too long to start - I will reload the page');
                location.reload();
            }
        }, 10000); // If the cold_start flag is not gone in 10 seconds then I reload the page

        return true;
    };

    /**
     * Plugins that must be started before you can send the first message
     * @returns {string[]}
     */
    var _GetCorePluginNames = function ()
    {
        "use strict";

        return [
            'infohub_cache',
            'infohub_exchange',
            'infohub_plugin',
            'infohub_transfer'
        ];
    };

    /**
     * Plugins that you need locally
     * @returns {string[]}
     */
    var _GetNeededPluginNames = function ()
    {
        "use strict";

        return [
            'infohub_asset',
            'infohub_base',
            'infohub_cache',
            'infohub_compress',
            'infohub_compress_gzip',
            'infohub_configlocal',
            'infohub_exchange',
            'infohub_keyboard',
            'infohub_launcher',
            'infohub_offline',
            'infohub_plugin',
            'infohub_render',
            'infohub_render_common',
            'infohub_render_form',
            'infohub_render_link',
            'infohub_render_text',
            'infohub_renderform',
            'infohub_rendermajor',
            'infohub_storage',
            'infohub_storage_data',
            'infohub_storage_data_idbkeyval',
            'infohub_tabs',
            'infohub_transfer',
            'infohub_translate',
            'infohub_view',
            'infohub_workbench'
        ];
    };

    /**
     * Gives a list of required plugins that you do not have in the local storage.
     * See _GetCorePluginNames above for a list of required plugins.
     * @param $corePluginNames
     * @returns {Array}
     * @private
     */
    var _GetMissingPluginNames = function ($corePluginNames)
    {
        "use strict";

        const $numberOfCorePluginNames = _Count($corePluginNames);
        let $missingCorePluginNames = [];
        let $number = 0;
        let $part = 0.0;
        const $areaCode = 'missing_plugins';

        for (let $pluginNameId in $corePluginNames)
        {
            if ($corePluginNames.hasOwnProperty($pluginNameId))
            {
                $number++;
                $part = $number / $numberOfCorePluginNames * 100.0;
                $progress.whatArea($areaCode, $part, 'Get list with missing plugins');

                const $key = 'plugin_' + $corePluginNames[$pluginNameId];

                if ($key in localStorage) {
                } else {
                    $missingCorePluginNames.push($corePluginNames[$pluginNameId]);
                }
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
    var _Count = function ($object)
    {
        "use strict";

        if (Array.isArray($object)) {
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
     * @returns {}
     * @private
     */
    var _GetPackage = function ($missingPluginNames)
    {
        "use strict";

        let $package = {
            'to_node' : 'server',
            'messages' : []
        };

        const $message = {
            'to': {'node': 'server', 'plugin': 'infohub_plugin', 'function': 'plugins_request'},
            'callstack': [
                {
                    'to': {'node': 'client', 'plugin': 'infohub_start', 'function': 'start'}
                }
            ],
            'data': {'missing_plugin_names': $missingPluginNames},
            'alias': 'Run plugins_request to get missing core client plugins',
            'wait': 0.0
        };

        $package.messages.push($message);

        return $package;
    };

    /**
     * AJAX call to the server
     * @param $package
     */
    var _CallServer = function ($package)
    {
        "use strict";

        let xmlHttp = new XMLHttpRequest();
        const $parameters = 'package=' + JSON.stringify($package);
        const $url = 'infohub.php';
        const $async = true;

        $progress.whatArea('call_server',10, 'Call the server - will send');

        const $maxWaitTimeMS = 4000.0;

        var noResponseTimer = setTimeout(function() {
            xmlHttp.abort();
            _SetGlobalOnline('false');
        }, $maxWaitTimeMS);

        xmlHttp.open('POST', $url, $async);

        xmlHttp.onreadystatechange = function ()
        {
            if (xmlHttp.readyState === 4)
            {
                if (xmlHttp.status === 200)
                {
                    $progress.whatArea('call_server',30, 'Call the server - got response');

                    _SetGlobalOnline('true'); // We got a message, we are online
                    clearTimeout(noResponseTimer); // We got a response before the timeout

                    let $response =  xmlHttp.responseText;
                    const $isErrorMessage = _IsErrorMessage($response);

                    if ($response !== '' && $response[0] === '{' && $isErrorMessage === 'false') {
                        $response = JSON.parse($response);

                        $progress.whatArea('call_server',40, 'Call the server - Valid response, parsing...');

                        _HandleServerResponse($response);
                        return;
                    }

                    if ($response[0] === '{') {
                        $response = $response.substr(0, $response.indexOf('}') +1 );
                    }

                    $progress.whatArea('call_server',40, 'Call the server - Invalid response');
                    document.getElementById('error').innerHTML = 'Error from server<br>' + $response;
                }
            }
        };

        xmlHttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        setTimeout(function(){
            $progress.whatArea('call_server',20, 'Call the server - sending');
            xmlHttp.send($parameters);
        }, 1000);
    };

    /**
     * Set or clear the global variable $globalOnline.
     * The variable will go back to true after 30 seconds so we can try again to reach the server.
     * @param $value
     * @private
     */
    var _SetGlobalOnline = function ($value)
    {
        "use strict";

        if ($value !== 'true' && $value !== 'false') {
            return;
        }

        if ($globalOnline === $value) {
            return;
        }

        if ($value === 'false')
        {
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
     * Loop trough all types of error messages and return 'true' if an
     * error message is detected in the response.
     * @param $response
     * @returns {*}
     * @private
     */
    var _IsErrorMessage = function ($response)
    {
        const $errorMessageArray = ['{"type":"exception",', '{"type":"error",'];

        for (let $key in $errorMessageArray)
        {
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
     */
    var _HandleServerResponse = function ($serverResponse)
    {
        "use strict";

        $progress.whatArea('server_response',0, 'Server response - handle the data');

        const $response = _GetMessagesFromResponse($serverResponse);

        if ($response.answer === 'false') {
            alert($response.message);
            return;
        }

        if ($response.items.plugins.length == 0) {
            alert('Did not get the missing plugins from the server');
            return;
        }

        _StorePlugins($response.items.plugins);
        const $corePluginNames = _GetCorePluginNames();
        _StartCore($corePluginNames);
    };

    /**
     * Pull out the missing plugins we got from the server
     * @param $response
     * @returns {{answer: string, message: string, items: {}}}
     * @private
     */
    var _GetMessagesFromResponse = function ($response)
    {
        "use strict";

        let $answer = 'false';
        let $message = '';

        const $messages = $response.messages;
        const $path = 'plugins';
        let $out = {};

        leave:
        {
            if ($messages.length == 0) {
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
            'items': $out
        };
    };

    /**
     * Stores all new plugins in local storage and updates the plugin index in local storage.
     * @param $plugins
     * @private
     */
    var _StorePlugins = function ($plugins)
    {
        "use strict";

        const $areaCode = 'store_plugin';
        const $textPrefix = 'Store prefix - ';

        $progress.whatArea($areaCode,0, $textPrefix + 'Initializing...');

        let $index = localStorage.getItem('plugin_index');

        if ($index == null) {
            $index = {};
        } else {
            $index = JSON.parse($index);
        }

        const $numberOfPluginsToStore = _Count($plugins);
        let $number = 0;
        let $partPercent = 0.0;

        for (let $pluginName in $plugins)
        {
            if ($plugins.hasOwnProperty($pluginName) === false) {
                continue;
            }

            $number++;
            $partPercent = $number / $numberOfPluginsToStore * 100;
            const $text = $textPrefix + $pluginName + '...';
            $progress.whatArea($areaCode, $partPercent, $text);

            const $pluginJsonData = JSON.stringify($plugins[$pluginName]);
            localStorage.setItem('plugin_' + $pluginName, $pluginJsonData);

            $index[$pluginName] = {
                'checksum': $plugins[$pluginName]['plugin_checksum'],
                'timestamp_added': _MicroTime()
            };

        }

        $progress.whatArea($areaCode,100, 'Store plugin Index...');
        localStorage.setItem('plugin_index', JSON.stringify($index));
    };

    /**
     * Returns seconds since EPOC, with decimals
     * @returns {number}
     * @private
     */
    var _MicroTime = function ()
    {
        "use strict";

        const $microtime = (new Date()).getTime() / 1000.0;

        return $microtime;
    };

    /**
     * Starts all core plugins in memory.
     * Then we start everything by sending the first message.
     * @param $corePluginNames
     * @private
     */
    var _StartCore = function ($corePluginNames)
    {
        "use strict";

        const $response = _StartPlugins($corePluginNames);

        if ($response.answer === 'true') {
            _SendFirstMessage();
            return;
        }

        const $messageOut = JSON.stringify($response,null,'\t');
        alert($messageOut);
    };

    /**
     * Start all core plugins
     * @param $corePluginNames
     * @returns {{answer: string, message: string, all_started: string, started: {}, not_started: {}}}
     * @private
     */
    var _StartPlugins = function ($corePluginNames)
    {
        "use strict";

        const $areaCode = 'start_core_plugin';

        let $out = {
            'answer': 'true',
            'message': 'All core plugins are started',
            'all_started': 'true',
            'started': {},
            'not_started': {}
        };

        $progress.whatArea('start_core_plugin',0, 'Start the core');

        const $basePluginJson = localStorage.getItem('plugin_infohub_base');
        const $basePlugin = JSON.parse($basePluginJson);

        let $number = 0;
        const $numberOfCorePluginNames = _Count($corePluginNames);
        let $partPercent = 0.0;

        for (let $pluginKey in $corePluginNames)
        {
            if ($corePluginNames.hasOwnProperty($pluginKey) === false) {
                continue;
            }

            const $pluginName = $corePluginNames[$pluginKey];

            $number++;
            $partPercent = $number / $numberOfCorePluginNames * 100.0;
            const $text = 'Start the core - plugin: ' + $pluginName;
            $progress.whatArea($areaCode, $partPercent, $text);

            if ($pluginName === 'infohub_base') {
                continue;
            }

            const $pluginJsonData = localStorage.getItem('plugin_' + $pluginName);
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
    var _StartPlugin = function ($in)
    {
        let $response = {
            'answer': 'false',
            'message': ''
        };

        block: {

            let $ok = 'true';

            try {
                eval.call(window,$in.plugin_code);
            } catch ($err) {
                $response.message = 'Can not evaluate the plugin class:"' + $in.plugin_name + '", error:"' + $err.message + '"';
                break block;
            }

            // Check that the plugin class are available
            try {
                eval("if (typeof " + $in.plugin_name + " === 'undefined') { $ok = 'false'; }");
            } catch ($err) {
                $response.message = 'Can not check if the class:"' + $in.plugin_name + '" exist. error:"' + $err.message + '"';
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
    var _SendFirstMessage = function ()
    {
        "use strict";

        $progress.whatArea('send_first_message',0, 'Will send the first message');

        const $message = {
                'to': {'node': 'client', 'plugin': 'infohub_exchange', 'function': 'startup'},
                'callstack': [],
                'data': {},
                'alias': 'Run startup',
                'wait': 0.0
            };

        let $package = {
            'to_node' : 'server',
            'messages' : []
        };

        $package.messages.push($message);

        let $plugin;

        try {
            eval("$plugin = new infohub_exchange();");
        } catch ($err) {
            alert('Can not instantiate class:"infohub_exchange()", error:"' + $err.message + '"');
            return;
        }

        if (typeof $plugin === 'undefined' || $plugin === null) {
            alert('Class:"infohub_exchange()", are undefined');
            return;
        }

        setTimeout(function(){
            const $event = new CustomEvent('infohub_call_main',
                { detail: {'plugin': $plugin, 'package': $package}, bubbles: true, cancelable: true }
            );
            document.dispatchEvent($event);
            $progress.whatArea('clean_up',0, 'Have sent first message');

            // The first command in start.js is to check this flag. We have gone so far now that it is time to reset the flag.
            localStorage.removeItem('cold_start');

        }, 0.0);

    };
}

/**
 * Handler for event 'infohub_call_main'
 * See event listener below
 * @param $eventData
 */
function infohubCallMainHandler($eventData)
{
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
        'to': {'node': 'client', 'plugin': 'infohub_exchange', 'function': 'main' },
        'callstack': [],
        'data': {'package': $in.package },
        'alias': 'First message',
        'wait': 0.0
    };

    // console.dir($callMainMessage);

    if (typeof infohubCallMainHandler.plugin === 'undefined' || infohubCallMainHandler.plugin === null) {
        infohubCallMainHandler.plugin = $in.plugin;
    }

    const $message = infohubCallMainHandler.plugin.cmd($callMainMessage);
}
document.addEventListener("infohub_call_main", infohubCallMainHandler, false);

var $infohub_start = new infohub_start();
$infohub_start.start();
//# sourceURL=start.js
