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
function infohub_transfer() {

    "use strict";

// include "infohub_base.js"

    const _Version = function() {
        return {
            'date': '2015-09-20',
            'version': '1.0.0',
            'checksum': '{{checksum}}',
            'class_name': 'infohub_transfer',
            'note': 'Transfer data to other nodes',
            'status': 'normal',
            'license_name': 'GNU GPL 3 or later'
        };
    };

    const _GetCmdFunctions = function() {
        return {
            'send': 'normal',
            'ban_seconds': 'normal'
        };
    };

    let $globalOnline = 'true', // Indicate if the server have answered or not
        $globalOnlineTimer = 0, // When server have not answered then $globalOnline is 'false' for 30 seconds
        $globalBannedUntil = _MicroTime() + 1.0, // Seconds since EPOC when the ban time is over
        $globalSendToNode = {}, // All messages that will be sent, key is node name
        $globalSendAtTimeStamp = 0, // Seconds since EPOC when we can send all pending messages
        $globalTimer = 0, // A timer that will send the mesages when it is time
        $globalCallStack = {}; // Outgoing subcall messages leave their callstack here and pick it up when coming back. Used in _LeaveCallStack and _PickUpCallStack.

    // *****************************************************************************
    // * The private functions, add your own in your plugin
    // * These functions can be used directly in your functions.
    // * Name: _CamelCaseData
    // *****************************************************************************

    /**
     * If the browser is in online mode then "true" is returned
     * Let Infohub_Transfer handle online/offline. Do NOT use this function anywhere else.
     * The only interesting fact is if the server will respond or not. This function can not tell that.
     * Also you can be offline (have no internet) and still reach infohub on a local network.
     * So again, let infohub handle online/offline.
     * @returns {string}
     * @private
     */
    const _IsOnline = function ()
    {
        const $online = navigator.onLine ? "true" : "false";

        return $online;
    };

    /**
     * Set or clear the global variable $globalOnline.
     * The variable will go back to true after 30 seconds so we can try again to reach the server.
     * @param $value
     * @private
     */
    const _SetGlobalOnline = function ($value)
    {
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

    // ***********************************************************
    // * your class functions below, only declare with var
    // * Can only be reached trough cmd()
    // ***********************************************************

    $functions.push('send');
    /**
     * Cmd function that will send the messages to the server when the ban time is up
     * @param {type} $in
     * @returns {{wait_milliseconds: *, answer: *, message: *, message_count: *}}
     */
    const send = function ($in)
    {
        const $default = {
            'to_node': {}, // node name as key and an array with messages to that node
            'config': {},
            'from_plugin': {},
            'step': 'step_start'
        };

        $in = _Default($default, $in);

        let $out = {
            'answer': 'true',
            'message': 'Nothing to report',
            'wait_milliseconds': 0,
            'message_count': 0
        };

        leave: {
            const $response = internal_GetWaitMilliseconds({'to_node': $in.to_node });

            if ($response.message_count === 0) {
                $out.message = 'I have no messages to send';
                break leave;
            }

            $out.message_count = $response.message_count;
            $out.wait_milliseconds = $response.wait_milliseconds;

            internal_AddMessagesToGlobalSendToNode($in);

            if ($globalSendAtTimeStamp === 0.0) {
                $globalSendAtTimeStamp = $response.timestamp;
            }

            if ($response.timestamp < $globalSendAtTimeStamp)
            {
                if ($globalTimer !== 0) {
                    clearTimeout($globalTimer);
                }
                $globalTimer = 0;
                $globalSendAtTimeStamp = $response.timestamp;
            }

            if ($response.timestamp >= $globalSendAtTimeStamp) {
                if ($globalTimer !== 0) {
                    $out.message = 'Messages added to be sent';
                    break leave;
                }
            }

            $globalTimer = setTimeout(function() {
                internal_Send($in);
                $globalTimer = 0;
            }, $response.wait_milliseconds);

            $out.message = 'Have started a timer so messages will be sent when it is time';
        }

        return {
            'answer': $out.answer,
            'message': $out.message,
            'wait_milliseconds': $out.wait_milliseconds,
            'message_count': $out.message_count
        };
    };

    /**
     * Calculate the timestamp when we no longer are banned
     * If we send more data to the server before the ban have ended we just end up with a lot more ban time.
     * @version 2013-11-30
     * @since 2013-11-30
     * @author Peter Lembke
     * @param $in
     */
    $functions.push('internal_AddMessagesToGlobalSendToNode');
    const internal_AddMessagesToGlobalSendToNode = function ($in)
    {
        const $default = {
            'to_node': {} // Node name as key and data as an array with messages
        };
        $in = _Default($default, $in);

        for (let $nodeName in $in.to_node) {
            if ($in.to_node.hasOwnProperty($nodeName) === false) {
                continue;
            }
            if (_IsSet($globalSendToNode[$nodeName]) === 'false') {
                $globalSendToNode[$nodeName] = [];
            }
            $globalSendToNode[$nodeName] = _ByVal($globalSendToNode[$nodeName].concat($in.to_node[$nodeName]));
        }

        return {
            'answer': 'true',
            'message': 'Done adding messages to the global variable'
        };
    };

    /**
     * Calculate the timestamp when we no longer are banned
     * If we send more data to the server before the ban have ended we just end up with a lot more ban time.
     * @version 2013-11-30
     * @since 2013-11-30
     * @author Peter Lembke
     * @param $in
     */
    $functions.push('ban_seconds');
    const ban_seconds = function ($in)
    {
        const $default = {
            'banned_until': 0.0,
            'ban_seconds': 10.0,
            'message': ''
        };
        $in = _Default($default,$in);

        if ($in.message !== '') {
            internal_Log({
                'level': 'error',
                'message': 'Got an error message:' + $in.message,
                'function_name': $in.func
            });
        }

        const $bannedUntil = _MicroTime(true) + $in.ban_seconds;

        if ($globalBannedUntil < $bannedUntil) {
            $globalBannedUntil = $bannedUntil;
        }

        return {
            'answer': 'true',
            'message': 'Banned until: ' + parseInt($globalBannedUntil,10),
            'banned_until': $globalBannedUntil
        };
    };

    // *****************************************************************************
    // * Internal function that you only can reach from internal_Cmd
    // *****************************************************************************

    /**
     * Calculate the timestamp when the message can be sent
     * Save the timestamp for the message that are in the most hurry to get to the server
     * This timestamp are used to postpone the sending of data,
     * piling upp messages to reducing the number of requests to the server
     * That is important since the server give a 1 second ban after each request
     * @version 2015-01-18
     * @since 2013-11-30
     * @author Peter Lembke
     * @param $in
     */
    $functions.push('internal_GetWaitMilliseconds');
    const internal_GetWaitMilliseconds = function ($in)
    {
        const $default = {
            'func': 'internal_GetWaitMilliseconds',
            'to_node': { }
        };
        $in = _Default($default,$in);

        let $timestamp = _MicroTime() + 600.0;
        let $messageCount = 0;

        for (let $nodeName in $in.to_node)
        {
            if ($in.to_node.hasOwnProperty($nodeName) === false) {
                continue;
            }

            for (let $messageId = 0; $messageId < $in.to_node[$nodeName].length; $messageId = $messageId + 1)
            {
                $messageCount = $messageCount + 1;
                const $messageData = $in.to_node[$nodeName][$messageId];

                if (_IsSet($messageData.wait) === 'false') {
                    continue;
                }

                if ($timestamp > $messageData.wait) {
                    $timestamp = $messageData.wait;
                }
            }
        }

        if ($globalBannedUntil === 0.0) {
            $globalBannedUntil = _MicroTime() + 1.0;
        }

        if ($timestamp < $globalBannedUntil) {
            $timestamp = $globalBannedUntil;
        }

        let $waitMilliseconds = ($timestamp - _MicroTime({})) * 1000.0;
        if ($waitMilliseconds <= 0.0) {
            $waitMilliseconds = 0.0;
        }

        $waitMilliseconds = $waitMilliseconds + 0.05; // I get banned over very small times by the server.

        return {
            'answer': 'true',
            'message': 'Found out how long we must wait until we can send the messages',
            'wait_milliseconds': $waitMilliseconds,
            'timestamp': $timestamp,
            'message_count': $messageCount
        };
    };

    /**
     * Send everything in ToNode as a JSON to each node
     * @version 2018-09-01
     * @since 2013-11-21
     * @author Peter Lembke
     * @param $in
     * @returns {*}
     * @uses
     */
    $functions.push('internal_Send');
    const internal_Send = function ($in)
    {
        const $default = {};
        $in = _Default($default, $in);

        let $answer = 'false';
        let $message = 'Finished with internal_Send';
        const $isOnline = _IsOnline();

        leave:
        {
            if (_Count($globalSendToNode) === 0) {
                $answer = 'true';
                $message = 'I have no messages to send';
                break leave;
            }

            if ($isOnline === 'false') {
                $message = 'We are offline, I can not send anything.  Your subcalls will be returned to you now.';
                internal_Cmd({'func': 'HandleOffline' });
                break leave;
            }

            if ($globalOnline === 'false') {
                $message = 'The server did not answer the last time I tried. I am waiting a while to try again. Your subcalls will be returned to you now.';
                internal_Cmd({'func': 'HandleOffline' });
                break leave;
            }

            for (let $nodeName in $globalSendToNode)
            {
                if ($globalSendToNode.hasOwnProperty($nodeName) === false) {
                    continue;
                }

                if (_Count($globalSendToNode[$nodeName]) === 0) {
                    continue;
                }

                if ($nodeName !== 'server') {
                    continue;
                }

                // @todo HUB-560, add session_id, sign_code, sign_code_created_at, user_id

                let $package = {
                    'to_node': $nodeName,
                    'session_id': '',
                    'sign_code': '',
                    'user_id': '',
                    'messages': _ByVal($globalSendToNode[$nodeName])
                };

                delete ($globalSendToNode[$nodeName]);

                $package = _SendingMessagesClean($package);
                const $packageJson = JSON.stringify($package);

                internal_Cmd({
                    'func': 'AjaxCall',
                    'package': $packageJson
                });

                $message = 'Sent message to node:' + $nodeName + ', with ' + $packageJson.length + ' bytes of data.';
                internal_Log({
                    'level': 'log',
                    'message': $message,
                    'object': $package
                });
            }

            $globalBannedUntil = _MicroTime(true) + 5.0; // (was 1.2) Set a high ban time in seconds. Server will return with the real ban timestamp.
            $answer = 'true';
            $message = 'Done sending packages to nodes';
        }

        return {
            'answer': $answer,
            'message': $message
        };
    };

    /**
     * We just discovered that the server we want to communicate with do not answer.
     * The package we sent with messages in them must be unpacked and the messages will go back to
     * the $globalSendToNode variable so that internal_HandleOffline can handle them.
     * @version 2019-06-21
     * @since 2019-06-21
     * @author Peter Lembke
     * @param $in
     * @returns {*}
     * @uses
     */
    $functions.push('internal_PutPackageBack');
    const internal_PutPackageBack = function ($in)
    {
        const $default = {
            'package': ''
        };
        $in = _Default($default, $in);

        const $packageObject = JSON.parse($in.package);

        const $messagesArray = _GetData({
            'name': 'messages',
            'default': [],
            'data': $packageObject,
            'split': '/'
        });

        leave:
        {
            if (_Count($messagesArray) === 0) {
                break leave;
            }

            const $nodeName = 'server';

            if (_IsSet($globalSendToNode[$nodeName]) === 'false') {
                $globalSendToNode[$nodeName] = [];
            }

            for (let $messageNumber = 0; $messageNumber < $messagesArray.length; $messageNumber = $messageNumber + 1) {
                const $message = _PickUpCallStack($messagesArray[$messageNumber]);
                $globalSendToNode[$nodeName].push($message);
            }
        }

        return {
            'answer': true,
            'message': 'Have handled the package. Extracted messages and put them in the global variable',
            'messages_count': $messagesArray.length
        };
    };

    /**
     * The requests we have to the server can not be sent because we are offline.
     * Answer them so the client can continue execution. All answers to the server can remain untouched.
     * @version 2019-06-15
     * @since 2019-06-15
     * @author Peter Lembke
     * @param $in
     * @returns {*}
     * @uses
     */
    $functions.push('internal_HandleOffline');
    const internal_HandleOffline = function ($in)
    {
        const $default = {};
        $in = _Default($default, $in);

        leave:
        {
            const $nodeName = 'server';

            if (_IsSet($globalSendToNode[$nodeName]) === 'false') {
                break leave;
            }

            if (_Count($globalSendToNode[$nodeName]) === 0) {
                break leave;
            }

            let $messagesToAnswerArray = [];
            let $messagesToKeepArray = [];

            for (let $messageNumber in $globalSendToNode[$nodeName])
            {
                if ($globalSendToNode[$nodeName].hasOwnProperty($messageNumber) === false) {
                    continue;
                }

                const $messageOut = _ByVal($globalSendToNode[$nodeName][$messageNumber]);
                const $lastItem = $messageOut.callstack.pop();
                const $returnToNode = $lastItem.to.node;

                if ($returnToNode !== 'client') {
                    $messagesToKeepArray.push($messageOut);
                    continue; // This message is a keeper.
                }

                let $response = {
                    'answer': 'false',
                    'message': 'Offline. Can not reach the server'
                };

                let $dataBack = $lastItem.data_back;

                let $data =_Merge($response, $dataBack); // Data is first the response and then the untouched data_back variables on top of that

                $data = _Merge($data, { // Then we mix in the response and data_back. Now we have a full data
                    'response': $response,
                    'data_back': $dataBack
                });

                const $returnMessage = {
                    'to': {
                        'node': $lastItem.to.node,
                        'plugin': $lastItem.to.plugin,
                        'function': $lastItem.to.function
                    },
                    'callstack': $messageOut.callstack,
                    'data': $data
                };

                $messagesToAnswerArray.push($returnMessage);
            }

            if ($messagesToKeepArray.length > 0)
            {
                $globalSendToNode[$nodeName] = _ByVal($messagesToKeepArray);
            }

            if ($messagesToAnswerArray.length > 0)
            {
                const $package = {
                    'to_node': 'client',
                    'messages': _ByVal($messagesToAnswerArray)
                };

                const $event = new CustomEvent('infohub_call_main', {
                    detail: {'package': $package, 'message': 'Offline answers'},
                    bubbles: true, cancelable: true
                });
                document.dispatchEvent($event);
            }

        }

        return {
            'answer': true,
            'message': 'Handled offline messages'
        };
    };

    /**
     * Does an ajax call to the server.
     * Sends the ready made package string.
     * handles the response, cleans up the messages and send them in an event to the main loop.
     * @param $in
     * @returns {{answer: string, message: string}}
     */
    $functions.push('internal_AjaxCall');
    const internal_AjaxCall = function ($in)
    {
        const $default = {
            'package': ''
        };
        $in = _Default($default, $in);

        internal_Log({
            'level': 'log',
            'message': 'Sending package with Ajax',
            'object': JSON.parse($in.package)
        });

        const xmlHttp = new XMLHttpRequest();
        const $maxWaitTimeMS = 4000.0;

        var noResponseTimer = setTimeout(function() {
            xmlHttp.abort();
            _SetGlobalOnline('false');
            internal_Cmd({'func': 'PutPackageBack', 'package': $in.package });
            internal_Cmd({'func': 'HandleOffline' });
        }, $maxWaitTimeMS);

        const $parameters = 'package=' + encodeURIComponent($in.package);
        const $url = 'infohub.php';
        const $async = true;
        xmlHttp.open('POST', $url, $async);

        xmlHttp.onreadystatechange = function () {
            if (xmlHttp.readyState === 4) {
                if (xmlHttp.status === 200) {
                    const $myTime = _MicroTime(true);
                    let $package = {};
                    let $event;
                    let $incomingData = xmlHttp.responseText;

                    internal_Log({
                        'message': 'Incoming ajax message',
                        'function_name': '*onreadystatechange',
                        'start_time': $myTime,
                        'depth': 1
                    });
                    internal_Log({
                        'message': 'Incoming package',
                        'function_name': '*onreadystatechange',
                        'object': {'package': $incomingData }
                    });

                    _SetGlobalOnline('true'); // We got a message, we are online
                    clearTimeout(noResponseTimer); // We got a response before the timeout

                    if ($incomingData.substr(0, 7) === 'error: ') {
                        _BoxError('Got server ' + $incomingData);
                        return;
                    }

                    if ($incomingData !== '') {
                        try {
                            $package = JSON.parse($incomingData);
                        } catch ($err) {

                            internal_Log({
                                'level': 'error',
                                'message': 'Can not parse JSON. error: "' + $err.message + '"',
                                'function_name': '*onreadystatechange',
                                'object': {'package': $incomingData }
                            });

                            _BoxError($incomingData, 'false');

                            return;
                            // $package = {};
                        }
                    }

                    internal_Log({
                        'function_name': '*onreadystatechange',
                        'message': 'Parsed data',
                        'object': $package
                    });

                    if (_IsSet($package.error_array) === 'true') {
                        if (Array.isArray($package.error_array) === true) {
                            if ($package.error_array.length > 0) {
                                _BoxError($package.error_array, 'true');
                            }
                        }
                    }

                    const $dataType = _GetData({
                        'name': 'type',
                        'default': '',
                        'data': $package
                    });

                    if ($dataType === 'exception') {
                        _BoxError($package, 'true');
                    }

                    if (_IsSet($package.ban_seconds) === 'true') {
                        $globalBannedUntil = $package.ban_seconds + _MicroTime();
                    }

                    internal_Log({
                        'function_name': '*onreadystatechange',
                        'message': 'Leaving Incoming ajax message',
                        'start_time': $myTime,
                        'depth': -1
                    });

                    $package = _ReceivedMessagesCleanAndExpand($package);

                    $event = new CustomEvent('infohub_call_main', {
                        detail: {'package': $package, 'message': 'Incoming ajax message'},
                        bubbles: true, cancelable: true
                    });
                    document.dispatchEvent($event);

                } else {
                    _SetGlobalOnline('false'); // We should have got a message but it never arrived.
                }
            }
        };

        xmlHttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xmlHttp.send($parameters);

        return {
            'answer': 'true',
            'message': 'Sent message with ' + $parameters.length + ' bytes of data'
        };
    };

    /**
     * Get a package object with messages
     * clean out all unneeded and unexpected parameters
     * expand the message so variables exist in data
     * @param $package
     */
    const _ReceivedMessagesCleanAndExpand = function ($package)
    {
        const $default = {
            'to_node': '',
            'messages': []
        };
        $package = _Default($default, $package);

        let $oneMessage;

        for (let $key in $package.messages)
        {
            if ($package.messages.hasOwnProperty($key) === false) {
                continue;
            }

            $oneMessage = _ByVal($package.messages[$key]);
            $oneMessage = _CleanMessage($oneMessage);
            $oneMessage = _PickUpCallStack($oneMessage);
            $oneMessage = _ExpandMessage($oneMessage);
            $package.messages[$key] = _ByVal($oneMessage);
        }

        return $package;
    };

    /**
     * Get a package object with messages
     * clean out all unneeded and unexpected parameters
     * @param $package
     */
    const _SendingMessagesClean = function ($package)
    {
        const $default = {
                'to_node': '',
                'messages': []
            };
        $package = _Default($default, $package);

        let $oneMessage;
        for (let $key in $package.messages)
        {
            if ($package.messages.hasOwnProperty($key) === false) {
                continue;
            }

            $oneMessage = _ByVal($package.messages[$key]);
            $oneMessage = _CleanMessage($oneMessage);
            $oneMessage = _LeaveCallStack($oneMessage);

            if ($oneMessage.to.node === 'server') {
                if ($oneMessage.to.plugin === 'infohub_dummy') {
                    if ($oneMessage.to.function === 'reload_page') {
                        $package.messages = [];
                        location.reload();
                        break; // Break the for loop
                    }
                    if ($oneMessage.to.function === 'clear_storage_and_reload_page') {
                        $package.messages = [];
                        localStorage.clear();
                        location.reload();
                        break; // Break the for loop
                    }
                    if ($oneMessage.to.function === 'set_cold_start_and_reload_page') {
                        $package.messages = [];
                        localStorage.setItem('cold_start', '3');
                        location.reload();
                        break; // Break the for loop
                    }
                }
            }

            $package.messages[$key] = _ByVal($oneMessage);
        }

        return $package;
    };

    /**
     * Clean up the outgoing message so it has no duplicate data
     * and no variables that can interfere.
     * @param $message
     * @returns {{}|{answer: string, data: [], message: string}}
     * @private
     */
    const _CleanMessage = function ($message)
    {
        const $default = {
            'to': {},
            'callstack': [],
            'data': {}
        };
        $message = _Default($default, $message);

        if (_IsSet($message.data.data_back) === 'true') {
            if (_IsSet($message.data.data_back.data_back) === 'true') {
                delete $message.data.data_back.data_back;
            }
            if (_IsSet($message.data.data_back.response) === 'true') {
                delete $message.data.data_back.response;
            }

            // Remove duplicates. These will expand on the other side anyhow. See _ExpandMessage
            for (let $key in $message.data.data_back) {
                if ($message.data.data_back.hasOwnProperty($key)) {
                    delete $message.data[$key];
                }
            }
        }

        if (_IsSet($message.data.response) === 'true')
        {
            if (_IsSet($message.data.response.data_back) === 'true') {
                delete $message.data.response.data_back;
            }
            if (_IsSet($message.data.response.response) === 'true') {
                delete $message.data.response.response;
            }

            // Remove duplicates. These will expand on the other side anyhow. See _ExpandMessage
            for (let $key in $message.data.response) {
                delete $message.data[$key];
            }
        }

        // We will not try to upset the other node by manipulate the step parameter in the function we call.
        if (_IsSet($message.data.step) === 'true') {
            delete $message.data.step;
        }

        return $message;
    };

    /**
     * Expands the incoming message so the response data are merged in to the data
     * And last the data_back data are merged into the data
     * @param $message
     * @returns {{}|{answer: string, data: [], message: string}}
     * @private
     */
    const _ExpandMessage = function ($message)
    {
        const $default = {
            'to': {},
            'callstack': [],
            'data': {}
        };
        $message = _Default($default, $message);

        if (_IsSet($message.data.response) === 'true') {
            $message.data = _Merge($message.data, $message.data.response);
        }

        if (_IsSet($message.data.data_back) === 'true') {
            $message.data = _Merge($message.data, $message.data.data_back);
        }

        return $message;
    };

    /**
     * A message that is a sub call to the server will leave its callstack
     * and the rest of the message will continue to the server
     *
     * @version 2019-06-26
     * @since 2019-06-26
     * @author Peter Lembke
     * @param $message
     * @returns {{}}
     * @private
     */
    const _LeaveCallStack = function ($message)
    {
        const $default = {
            'to': {'node': '', 'plugin': '', 'function': ''},
            'callstack': [],
            'data': {}
        };
        $message = _Default($default, $message);

        leave:
        {
            if (_Count($message.callstack) === 0) {
                break leave;
            }

            let $lastItem = $message.callstack[$message.callstack.length -1];
            if ($lastItem.to.node !== 'client') {
                break leave;
            }

            let $hubId = _GetUniqueIdentiferHubId(); // Get unique identifier
            $globalCallStack[$hubId] = _ByVal($message.callstack);

            $message.callstack = [{
                'data_back': {},
                'data_request': $lastItem.data_request, // Since the server need this to answer properly
                'to': {
                    'node': 'client',
                    'plugin': $lastItem.to.plugin,
                    'function': $hubId
                }
            }];
        }

        return $message;
    };

    /**
     * A message that goes to a function name that start with a digit
     * will get that function name matched with a call stack that have been left here before.
     *
     * @version 2019-06-26
     * @since 2019-06-26
     * @author Peter Lembke
     * @param $message
     * @returns {{}}
     * @private
     */
    const _PickUpCallStack = function ($message)
    {
        const $default = {
            'to': {'node': '', 'plugin': '', 'function': ''},
            'callstack': [],
            'data': {}
        };
        $message = _Default($default, $message);

        leave:
        {
            if ($message.to.node !== 'client') {
                break leave;
            }
            let $hubId = $message.to.function;
            if (_IsSet($globalCallStack[$hubId]) === 'false') {
                break leave;
            }

            let $lastItem = $globalCallStack[$hubId].pop();

            $message.to = _ByVal($lastItem.to);
            $message.callstack = _ByVal($globalCallStack[$hubId]);
            $message.data.data_back = _ByVal($lastItem.data_back);

            delete $globalCallStack[$hubId];
        }

        return $message;
    };

    /**
     * Get a hub id. Unique string
     *
     * @version 2018-07-28
     * @since 2018-07-28
     * @author Peter Lembke
     * @return string
     */
    const _GetUniqueIdentiferHubId = function()
    {
        const $result = _MicroTime() + ':' + Math.random().toString().substring(2);
        // math.random produce a float between 0 and 1, example 0.4568548654
        // substring(2) remove the 0. and leave 4568548654

        return $result;
    };


    /**
     * Write error message to screen. Newest error highest.
     * @version 2014-01-17
     * @since   2014-01-17
     * @author  Peter Lembke
     * @param $message
     */
    $functions.push('_BoxError');
    const _BoxError = function ($message, $doHtmlToText)
    {
        if (typeof $doHtmlToText === 'undefined') {
            $doHtmlToText = 'true';
        }

        let $boxError = document.getElementById('error');
        $boxError.className = 'error';

        if (typeof $message === 'string') {
            if ($doHtmlToText === 'true') {
                $message = _HtmlToText($message);
            }
            $boxError.innerHTML = $message + "\n<br>" + $boxError.innerHTML;
            return;
        }

        if (Array.isArray($message) === true) {
            const $messageLength = $message.length;
            for (let $i = 0; $i < $messageLength; $i=$i+1) {
                $message[$i] = _HtmlToText($message[$i]);
                $boxError.innerHTML = $message[$i] + "\n<br>" + $boxError.innerHTML;
            }
        }

        if (typeof $message === 'object') {
            $message = JSON.stringify($message);
            $boxError.innerHTML = $message + "\n<br>" + $boxError.innerHTML;
        }
    };

    /**
     * Convert HTML to text to be shown on screen without harm
     * http://www.freebits.co.uk/convert-html-code-to-text.html
     * @version 2015-05-10
     * @since   2015-05-10
     * @author  Peter Lembke
     * @param $message
     */
    $functions.push('_HtmlToText');
    const _HtmlToText = function ($message)
    {
        $message = $message.replace(/&/g, '&amp;');
        $message = $message.replace(/</g, '&lt;');
        $message = $message.replace(/>/g, '&gt;');
        $message = $message.replace(/\n/g, '<br />\n');
        $message = $message.replace(/\r/g, '');

        return $message;
    };
}
//# sourceURL=infohub_transfer.js