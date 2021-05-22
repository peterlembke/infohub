/**
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
function infohub_exchange() {

    'use strict';

// webworker=false
// include "infohub_base.js"

    let $classUserName = '';
    const _GetUserName = function() {
        return $classUserName;
    };

    let $classSessionId = '';
    const _GetSessionId = function() {
        return $classSessionId;
    };

    $functions.push('_Version');
    const _Version = function() {
        return {
            'date': '2015-04-24',
            'version': '1.0.0',
            'checksum': '{{checksum}}',
            'class_name': 'infohub_exchange',
            'note': 'Handle all messages so they come to the right plugin',
            'status': 'normal',
            'SPDX-License-Identifier': 'GPL-3.0-or-later',
            'user_role': 'user',
            'web_worker': 'false',
            'core_plugin': 'true',
        };
    };

    $functions.push('_GetCmdFunctions');
    const _GetCmdFunctions = function() {
        const $list = {
            'main': 'normal',
            'startup': 'normal',
            'event_message': 'normal',
            'plugin_started': 'normal',
            'initiator_verify_sign_code': 'normal',
            'redirect': 'normal',
        };

        return _GetCmdFunctionsBase($list);
    };

    let $that = this,// to reference cmd inside of infohub_exchange. Do not do this in other plugins.
        $Sort = [], // Array with all unsorted messages
        $ToPending = [], // Array with all messages going to Pending or will be discarded
        $Pending = {}, // Messages waiting for a plugin to be loaded, $Pending['pluginname']=array()
        $Plugin = {'infohub_exchange': {}}, // Object with all started plugins. $Plugin['pluginname']={}
        $PluginMissing = {}, // Object with all missing plugins. $PluginMissing['pluginname']={}
        $Stack = [], // Array with commands waiting to be executed in a loaded plugin
        $ToNode = {}, // Object with nodeName and arrays with all messages going to the nodes
        $coreStarted = 'false',
        $MainLoopRunning = 'false';

    // *****************************************************************************
    // * The private functions, add your own in your plugin
    // * These functions can be used directly in your functions.
    // * Name: _CamelCaseData
    // *****************************************************************************

    /**
     * Write error message to screen. Newest error highest.
     * @version 2014-01-17
     * @since   2014-01-17
     * @author  Peter Lembke
     * @param $message
     */
    $functions.push('_BoxError');
    const _BoxError = function($message, $doHtmlToText) {
        if (_IsSet($doHtmlToText) === 'false') {
            $doHtmlToText = 'true';
        }

        let $boxError = document.getElementById('error');
        $boxError.className = 'error';

        if (typeof $message === 'string') {
            if ($doHtmlToText === 'true') {
                $message = _HtmlToText($message);
            }
            $boxError.innerHTML = $message + '\n<br>' + $boxError.innerHTML;
            return;
        }

        if (Array.isArray($message) === false) {
            return;
        }

        const $messageLength = $message.length;
        for (let $messageNumber = 0; $messageNumber <
        $messageLength; $messageNumber = $messageNumber + 1) {
            $message[$messageNumber] = _HtmlToText($message[$messageNumber]);
            $boxError.innerHTML = $message[$messageNumber] + '\n<br>' +
                $boxError.innerHTML;
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
    const _HtmlToText = function($message) {
        $message = $message.replace(/&/g, '&amp;');
        $message = $message.replace(/</g, '&lt;');
        $message = $message.replace(/>/g, '&gt;');
        $message = $message.replace(/\n/g, '<br />\n');
        $message = $message.replace(/\r/g, '');

        return $message;
    };

    /**
     * Get current hostname from the url.
     * Used in the config to pull out where to send the first message
     * This means you can have the same code and display different content depending on the hostname
     * @version 2016-08-25
     * @since   2016-08-25
     * @author  Peter Lembke
     * @returns {string}
     * @private
     */
    $functions.push('_GetCurrentHostname');
    const _GetCurrentHostname = function() {
        const $hostname = window.location.hostname;

        return $hostname;
    };

    /**
     * Get plugin_name GET parameter from URL
     * If it is set then infohub_standalone is used with this plugin_name
     * @version 2021-04-30
     * @since   2021-04-30
     * @author  Peter Lembke
     * @returns {string}
     * @private
     */
    $functions.push('_GetUrlPluginName');
    const _GetUrlPluginName = function()
    {
        const $getParameter = window.location.search.substr(1);

        if (_Empty($getParameter) === 'true') {
            return '';
        }

        let $pluginName = '';

        let $parts = $getParameter.split('=');
        if (_IsSet($parts[1]) === 'true') {
            $pluginName = $parts[1];
        }

        return $pluginName;
    };

    // ***********************************************************
    // * your class functions below, only declare with var
    // * Can only be reached trough cmd()
    // ***********************************************************

    /**
     * Get the incoming package and sorts the messages in the package
     * Used by: index.php
     * @version 2014-10-08
     * @since 2012-12-20
     * @author Peter Lembke
     * @param $in
     * @return {{answer: string, message: string}}
     */
    $functions.push('main');
    const main = function($in) {
        const $default = {
            'package': {},
            'answer': 'false',
            'message': '',
        };
        $in = _Default($default, $in);

        if ($coreStarted === 'false') { // Class global
            internal_Cmd({'func': 'StartCore'});
        }

        internal_Cmd({
            'func': 'ToSort',
            'package': $in.package,
        });
        delete $in.package;

        let $addedTransferMessage = 'false';
        $MainLoopRunning = 'true'; // Class global
        let $loopCount = 0;
        let $moreToDo;

        do {
            $moreToDo = 'false';

            if ($Sort.length > 0) {
                $moreToDo = 'true';
                internal_Cmd({'func': 'Sort'});
            }

            if ($ToPending.length > 0) {
                $moreToDo = 'true';
                internal_Cmd({'func': 'ToPending'});
            }

            if ($Stack.length > 0) {
                $moreToDo = 'true';
                internal_Cmd({'func': 'Stack'});
            }

            if ($moreToDo === 'false' && $addedTransferMessage === 'false') {
                if (_Count($ToNode) > 0) {
                    _AddTransferMessage();
                    $addedTransferMessage = 'true';
                    $moreToDo = 'true';
                }
            }

            $loopCount = $loopCount + 1;

        } while ($moreToDo === 'true' && $loopCount < 400);

        $MainLoopRunning = 'false';

        $in.answer = 'true';
        $in.message = 'Have handled all messages in all queues';

        if ($moreToDo === 'true') {
            $in.answer = 'false';
            $in.message = 'There are more messages to handle but we have already ran 400 loops. Will continue later';

            internal_Log({
                'func': 'Log',
                'level': 'error',
                'message': $in.message,
                'function_name': 'main',
            });
        }

        // window.setTimeout(main, 2000);

        return {
            'answer': $in.answer,
            'message': $in.message,
        };
    };

    /**
     * If we have messages to other nodes then
     * add a message that will transfer them to their nodes
     * @returns {string}
     * @private
     */
    $functions.push('_AddTransferMessage');
    const _AddTransferMessage = function() {
        let $subCall = _SubCall({
            'to': {
                'node': 'client',
                'plugin': 'infohub_transfer',
                'function': 'send',
            },
            'data': {
                'to_node': $ToNode,
            },
        });

        $subCall.callstack = [];

        $subCall.callstack[0] = {
            'to': {
                'node': 'client',
                'plugin': 'infohub_exchange',
                'function': 'main',
            },
            'data_back': {},
        };

        $ToNode = {};
        _SortAdd({'message': $subCall});

        return 'true';
    };

    /**
     * First function to start
     * Verify the session data and get the user_name.
     * Get the current domain, then check the plugin settings for that domain,
     * In the settings you have the first message to send to that domain.
     * @version 2020-04-25
     * @since 2015-02-12
     * @author Peter Lembke
     */
    $functions.push('startup');
    const startup = function($in) {
        const $default = {
            'step': 'step_get_session_data',
            'parent_box_id': '1',
            'message': '',
            'answer': '',
            'execution_time': 0.0,
            'all_plugins': {},
            'plugin_index': {},
            'config': {},
            'response': {},
            'data_back': {
                'session_valid': 'false',
                'user_name': '',
                'role_list': [],
            },
        };
        $in = _Default($default, $in);

        if ($in.step === 'step_get_session_data') {

            $progress.whatArea('send_first_message', 20, 'Get session data');

            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_session',
                    'function': 'initiator_get_session_data',
                },
                'data': {
                    'node': 'server',
                },
                'data_back': {
                    'step': 'step_get_session_data_response',
                },
            });
        }

        if ($in.step === 'step_get_session_data_response') {

            $progress.whatArea('send_first_message', 40, 'Got session data');

            const $default = {
                'user_name': '',
                'session_id': '',
                'post_exist': 'false',
                'role_list': [],
            };
            $in.response = _Default($default, $in.response);

            $classSessionId = $in.response.session_id;
            $classUserName = $in.response.user_name;

            $in.step = 'step_check_session_valid'; // HUB-919
            if ($in.response.post_exist === 'false') {
                $in.step = 'step_prepare_first_message';
            }
        }

        if ($in.step === 'step_check_session_valid') {

            $progress.whatArea('send_first_message', 50, 'Check session valid');

            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_session',
                    'function': 'initiator_check_session_valid',
                },
                'data': {
                    'node': 'server',
                },
                'data_back': {
                    'step': 'step_check_session_valid_response',
                },
            });
        }

        if ($in.step === 'step_check_session_valid_response') {

            $progress.whatArea('send_first_message', 55,
                'Check session valid response');

            const $default = {
                'answer': '',
                'message': '',
                'session_valid': 'false',
                'user_name': '',
                'role_list': [],
            };
            $in.response = _Default($default, $in.response);

            $in.data_back.session_valid = $in.response.session_valid;
            $in.data_back.user_name = $in.response.user_name;
            $in.data_back.role_list = $in.response.role_list;

            $in.step = 'step_prepare_first_message';
            if ($in.data_back.session_valid === 'false') {
                $in.step = 'step_delete_session';
            }
        }

        if ($in.step === 'step_delete_session') {

            $progress.whatArea('send_first_message', 60, 'Deleting session');

            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_session',
                    'function': 'delete_session_data',
                },
                'data': {},
                'data_back': {
                    'session_valid': 'false',
                    'user_name': $in.data_back.user_name,
                    'role_list': $in.data_back.role_list,
                    'step': 'step_get_session_data', // We start over from the top with no session data this time
                },
            });
        }

        if ($in.step === 'step_prepare_first_message') {

            $progress.whatArea('send_first_message', 60,
                'Preparing first message');

            $classUserName = 'guest';
            if ($in.data_back.session_valid === 'true') {
                $classUserName = $in.data_back.user_name;
            }

            $in.step = 'step_send_first_message';
        }

        let $messages = [];

        if ($in.step === 'step_send_first_message') {
            $progress.whatArea('send_first_message', 90,
                'Send message depending on domain settings');

            let $name = 'domain';
            if ($classUserName === 'guest') {
                $name = 'domain_guest';
            }

            let $domain = _GetData({
                'name': $name,
                'default': '',
                'data': $in.config,
            });

            let $subCall = {};

            if (_IsSet($domain.default) === 'true') {
                $subCall = $domain.default;
            }

            const $currentHostname = _GetCurrentHostname();

            if (_IsSet($domain[$currentHostname]) === 'true') {
                $subCall = $domain[$currentHostname];
            }

            let $data = _GetData({
                'name': 'data',
                'default': {},
                'data': $subCall,
            });

            if ($name !== 'domain_guest') {
                const $urlPluginName = _GetUrlPluginName();
                if ($urlPluginName !== '') {
                    $subCall.node = 'client';
                    $subCall.plugin = 'infohub_standalone';
                    $subCall.functon = 'startup';
                    $data = {'plugin_name': $urlPluginName};
                }
            }

            let $messageOut = _SubCall({
                'to': {
                    'node': $subCall.node,
                    'plugin': $subCall.plugin,
                    'function': $subCall.function,
                },
                'data': $data,
                'data_back': {
                    'step': 'step_end',
                },
            });
            $messages.push($messageOut);

            $messageOut = _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_keyboard',
                    'function': 'event_message',
                },
                'data': {
                    'event_type': 'ping', // Just to wake up the plugin, it has event observers that must be run
                },
                'data_back': {
                    'step': 'step_end',
                },
            });
            $messages.push($messageOut);

            $messageOut = _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_offline',
                    'function': 'event_message',
                },
                'data': {
                    'event_type': 'ping', // Just to wake up the plugin, it has event observers that must be run
                },
                'data_back': {
                    'step': 'step_end',
                },
            });
            $messages.push($messageOut);

            $messageOut = _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_offline',
                    'function': 'update_service_worker',
                },
                'data': {},
                'data_back': {
                    'step': 'step_end',
                },
            });
            $messages.push($messageOut);

            $progress.whatArea('send_first_message', 100, 'Now we start');
        }

        return {
            'answer': 'true',
            'message': 'Leaving function infohub_exchange->startup()',
            'messages': $messages,
        };
    };

    /**
     * All event messages sent to infohub_exchange end up here
     * @version 2019-06-16
     * @since 2015-06-20
     * @author Peter Lembke
     */
    $functions.push('event_message');
    const event_message = function($in) {
        const $default = {
            'event_type': '',
            'message': '',
            'answer': '',
        };
        $in = _Default($default, $in);

        return {
            'answer': 'true',
            'message': 'Leaving function infohub_exchange->event_message',
        };
    };

    /**
     * Handle the queue messages for the started plugin
     * @version 2016-01-30
     * @since 2016-01-30
     * @author Peter Lembke
     * @param $in
     * @returns {{answer: string, message: string}}
     */
    $functions.push('plugin_started');
    const plugin_started = function($in) {
        const $default = {
            'plugin_name': '',
            'plugin_started': 'false',
        };
        $in = _Default($default, $in);

        let $answer = 'false';
        let $message;

        leave: {
            if (_IsSet($Pending[$in.plugin_name]) === false) {
                $message = 'We have not requested this plugin:' +
                    $in.plugin_name + ', skip it';
                break leave;
            }

            if (_Count($Pending[$in.plugin_name]) === 0) {
                $message = 'We have no pending messages to this plugin:' +
                    $in.plugin_name + ', skip it';
                break leave;
            }

            if ($in.plugin_started !== 'true') {
                // The plugin could not be started. We have some pending messages to handle.
                $message = 'Could not get the plugin from the server';

                internal_Log({
                    'function_name': 'plugin_started',
                    'message': $message,
                    'level': 'error',
                    'object': {'plugin': $in.plugin_name},
                });

                $PluginMissing[$in.plugin_name] = {};

                for (let $key in $Pending[$in.plugin_name]) {
                    if ($Pending[$in.plugin_name].hasOwnProperty($key)) {
                        const $dataMessage = $Pending[$in.plugin_name][$key];
                        _SendMessageBackPluginNotFound($dataMessage);
                    }
                }

                $Pending[$in.plugin_name] = [];

                break leave;
            }

            $Plugin[$in.plugin_name] = {};
            try {
                eval('$Plugin[$in.plugin_name] = new ' + $in.plugin_name +
                    '();');
            } catch ($err) {
                $message = 'Can not not instantiate class:' + $in.plugin_name +
                    ', error:' + $err.message();
                break leave;
            }

            // Move messages from Pending to Stack
            $Stack = $Stack.concat($Pending[$in.plugin_name]);
            delete $Pending[$in.plugin_name];
            $answer = 'true';
            $message = 'Plugin messages moved to stack';
        }

        return {
            'answer': $answer,
            'message': $message,
        };
    };

    /**
     * Check if the incoming data has a message to initiator_check_session_valid
     * that inform that the session is invalid. Then we go into guest mode.
     * @param $in
     * @returns {*}
     * @private
     */
    const _CheckIncomingMessagesIfSessionValid = function($in) {

        for (let $key in $in.package.messages) {
            if ($in.package.messages.hasOwnProperty($key) === false) {
                continue;
            }
            const $oneMessage = $in.package.messages[$key];
            if ($oneMessage.to.node !== 'client') {
                continue;
            }
            if ($oneMessage.to.plugin !== 'infohub_session') {
                continue;
            }
            if ($oneMessage.to.function !== 'initiator_check_session_valid') {
                continue;
            }
            if ($oneMessage.data.session_valid === 'true') {
                break;
            }
            $in.config.session_id = '';
            $in.config.user_name = 'guest';
            break;
        }

        return $in;
    };

    $functions.push('initiator_verify_sign_code');
    /**
     * Used by infohub_transfer -> internal_AjaxCall to get the package out of the internal function,
     * out of the ajax response and into a normal infohub function that can do sub calls.
     * Calculate $messages_checksum = md5(messages_encoded);
     * Call client infohub_session -> initiator_verify_sign_code
     * If package false then throw away
     * If package true then run some code and give messages to the main loop.
     * @param $in
     */
    const initiator_verify_sign_code = function($in) {
        const $default = {
            'step': 'step_check_incoming_data',
            'package': {
                'ban_seconds': 0.0,
                'banned_until': 0.0,
                'messages_encoded': '',
                'messages': [],
                'package_type': '',
                'session_id': '',
                'sign_code': '',
                'sign_code_created_at': '',
            },
            'config': {
                'session_id': '',
                'user_name': '',
            },
            'data_back': {},
            'response': {},
        };
        $in = _Default($default, $in);

        let $out = {
            'answer': 'false',
            'message': 'Nothing to report',
        };

        if ($in.step === 'step_check_incoming_data') {

            $in.step = 'step_messages_checksum';

            if ($in.package.session_id === '' || $in.package.sign_code === '') {
                $out.message = 'Package session_id or sign_code are empty';
                $in.step = 'step_end';

                $in = _CheckIncomingMessagesIfSessionValid($in);

                if ($in.config.session_id === '' && $in.config.user_name ===
                    'guest') {
                    $out.message = 'Package session_id or sign_code are empty but it is OK since we are guest';
                    $in.step = 'step_ok';
                }
            }
        }

        if ($in.step === 'step_messages_checksum') {
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_checksum',
                    'function': 'calculate_checksum',
                },
                'data': {
                    'value': $in.package.messages_encoded,
                },
                'data_back': {
                    'step': 'step_messages_checksum_response',
                    'package': $in.package,
                    'config': $in.config,
                },
            });
        }

        if ($in.step === 'step_messages_checksum_response') {

            $out.message = $in.response.message;
            $in.step = 'step_end';

            if ($in.response.answer === 'true') {
                $in.package.messages_checksum = $in.response.checksum;
                $in.step = 'step_initiator_verify_sign_code';
            }
        }

        if ($in.step === 'step_initiator_verify_sign_code') {
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_session',
                    'function': 'initiator_verify_sign_code',
                },
                'data': {
                    'node': 'server', // node name
                    'messages_checksum': $in.package.messages_checksum, // md5 checksum of all messages in the package
                    'sign_code': $in.package.sign_code,
                    'sign_code_created_at': $in.package.sign_code_created_at, // 3 decimals
                },
                'data_back': {
                    'step': 'step_initiator_verify_sign_code_response',
                    'package': $in.package,
                    'config': $in.config,
                },
            });
        }

        if ($in.step === 'step_initiator_verify_sign_code_response') {
            const $default = {
                'answer': 'false',
                'message': '',
                'ok': 'false',
            };
            $in.response = _Default($default, $in.response);

            $out.message = $in.response.message;
            $in.step = 'step_end';

            if ($in.response.answer === 'true' && $in.response.ok === 'true') {
                $in.step = 'step_ok';
            }
        }

        if ($in.step === 'step_ok') {

            if ($in.package.package_type === '2020') {
                delete ($in.package.messages_encoded);
            }

            let $event = new CustomEvent('infohub_call_main', {
                detail: {
                    'package': $in.package,
                    'message': 'Incoming ajax message',
                },
                bubbles: true,
                cancelable: true,
            });
            document.dispatchEvent($event);

            $out.answer = 'true';
            $out.message = 'Done handling the incoming package';
        }

        return {
            'answer': $out.answer,
            'message': $out.message,
        };
    };

    // *****************************************************************************
    // * Internal function that you only can reach from internal_Cmd
    // * Function name are in internal_CamelCase
    // * An internal function get all its data from the $in-array
    // * An internal function give its answer as an array, success or error
    // *****************************************************************************

    /**
     * The incoming package have messages, place them in array Sort.
     * If we have no package the we just continue. That can happen when the timer calls main function
     * Used by: main
     * @version 2015-01-25
     * @since 2013-11-21
     * @author Peter Lembke
     * @param $in
     * @returns {*}
     * @uses package | string | The incoming package as a JSON string
     */
    $functions.push('internal_ToSort');
    const internal_ToSort = function($in) {
        const $default = {
            'func': 'ToSort',
            'package': {},
        };
        $in = _Default($default, $in);

        const $package = $in.package;

        let $response = {
            'answer': 'true',
            'message': '',
        };

        block: {
            if (_IsSet($package.messages) === 'false' ||
                Array.isArray($package.messages) === false) {
                $response.message = 'There are no messages in the package to sort';
                break block;
            }

            // Copy all messages to array Sort if we have any
            for (let messageNumber = 0; messageNumber <
            $package.messages.length; messageNumber = messageNumber + 1) {
                if (_IsSet($package.messages[messageNumber].error_array) ===
                    'true') {
                    _BoxError($package.messages[messageNumber].error_array);
                    delete $package.messages[messageNumber].error_array;
                }

                $Sort.push($package.messages[messageNumber]);
            }

            $response.message = 'Placed messages in array $Sort';
        }

        return {
            'answer': $response.answer,
            'message': $response.message,
        };
    };

    /**
     * If the message passes the tests then it is added to queue Sort, else it is thrown away.
     * @param array $in
     */
    $functions.push('_SendMessageBackPluginNotFound');
    const _SendMessageBackPluginNotFound = function($in, $message) {
        const $default = {
            'callstack': [],
            'data': {},
            'data_back': {},
            'to': {
                'node': '', 'plugin': '', 'function': '',
            },
            'wait': 0.0,
            'execution_time': 0.0,
        };
        $in = _Default($default, $in);

        if (_Empty($message) === 'true') {
            $message = 'Plugin do not exist';
        }

        const $dataMessage = internal_Cmd({
            'func': 'ReturnCall',
            'variables': {
                'answer': 'false',
                'message': $message,
                'to': $in.to,
            },
            'original_message': $in,
        });

        if ($dataMessage.answer === 'true') {
            _SortAdd({'message': $dataMessage.return_call_data});
        }
    };

    /**
     * Some messages could be answered with the error. Others have no sender.
     * This function send back answers to those messages that has a sender.
     * @param array $in
     */
    $functions.push('_SendMessageBackMessageFailedTests');
    const _SendMessageBackMessageFailedTests = function($in) {
        const $default = {
            'callstack': [],
            'data': {},
            'data_back': {},
            'to': {
                'node': '', 'plugin': '', 'function': '',
            },
            'wait': 0.0,
            'execution_time': 0.0,
            'message': '',
        };
        $in = _Default($default, $in);

        const $dataMessage = internal_Cmd({
            'func': 'ReturnCall',
            'variables': {
                'answer': 'false',
                'message': $in.message,
                'to': $in.to,
            },
            'original_message': $in,
        });

        if ($dataMessage.answer === 'true') {
            _SortAdd({'message': $dataMessage.return_call_data});
        }
    };

    /**
     * If the message passes the tests then it is added to queue Sort, else it is thrown away.
     * @param array $in
     */
    $functions.push('_SortAdd');
    const _SortAdd = function($in) {
        const $default = {
            'test': 'true',
            'message': {},
        };
        $in = _Default($default, $in);

        let $dataMessage = $in.message;

        if ($in.test === 'true') {
            $dataMessage.func = 'MessageCheck';
            const $response = internal_Cmd($dataMessage);
            if ($response.ok === 'false') {
                return; // The message was not OK and will be skipped
            }

            $dataMessage = $response.data_message;
        }

        if (_IsSet($dataMessage.wait) === 'false') {
            $dataMessage.wait = 0.2;
        }

        $dataMessage.wait = _MicroTime() + $dataMessage.wait;

        if ($MainLoopRunning === 'true') {
            $Sort.push($dataMessage);
            return;
        }

        const $package = {
            'to_node': 'client',
            'messages': [$dataMessage],
        };

        const $event = new CustomEvent('infohub_call_main',
            {
                detail: {'plugin': null, 'package': $package},
                bubbles: true,
                cancelable: true,
            },
        );
        document.dispatchEvent($event);
    };

    /**
     * Checks message structure, node, and that it follows the rules for calling other plugins.
     * @param array $in
     * @return array
     */
    $functions.push('internal_MessageCheck');
    const internal_MessageCheck = function($in) {
        const $default = {
            'callstack': [],
            'data': {},
            'data_back': {},
            'to': {'node': '', 'plugin': '', 'function': ''},
            'wait': 0.0,
            'execution_time': 0.0,
        };
        $in = _Default($default, $in);

        const $defaultCallstackItem = {
            'data_back': {},
            'data_request': [],
            'to': {'node': '', 'plugin': '', 'function': ''},
        };

        // Set default values in all callstack items
        for (let $callstackItemNumber = 0; $callstackItemNumber <
        $in.callstack.length; $callstackItemNumber = $callstackItemNumber + 1) {
            $in.callstack[$callstackItemNumber] = _Default(
                $defaultCallstackItem, $in.callstack[$callstackItemNumber]);
        }

        let $response;

        leave: {
            $response = _CheckMessageStructure($in);
            if ($response.ok === 'false') {
                break leave;
            }

            $response = _CheckMessageNode($in);
            if ($response.ok === 'false') {
                break leave;
            }

            $response = _CheckMessageCalling($in);
            if ($response.ok === 'false') {
                break leave;
            }
        }

        if ($response.ok === 'false') {
        }

        return {
            'answer': $response.answer,
            'message': $response.message,
            'data_message': $response.data_message,
            'ok': $response.ok,
        };
    };

    /**
     * Makes sure the message have the right structure.
     * No more, no less.
     * @param $in
     * @returns {{answer: string, message: *, data_message: *}}
     * @private
     */
    $functions.push('_CheckMessageStructure');
    const _CheckMessageStructure = function($in) {
        $in = _ByVal($in);

        let $ok = 'false';
        let $message = '';

        leave: {
            $message = _CheckMessageStructureTo($in);
            if ($message !== '') {
                break leave;
            }

            if ($in.callstack.length === 0) {
                $message = 'Callstack is empty. That happens at some point.';
                $ok = 'true';
                break leave;
            }

            const $defaultBack = {
                'to': {'node': '', 'plugin': '', 'function': ''},
                'data_back': {},
            };
            $in.callstack[0] = _Default($defaultBack, $in.callstack[0]);

            $message = _CheckMessageStructureTo($in.callstack[0]);
            if ($message !== '') {
                break leave;
            }

            $ok = 'true';
            $message = 'Message is valid';
        }

        return {
            'answer': 'true',
            'message': $message,
            'data_message': $in,
            'ok': $ok,
        };
    };

    /**
     * Check that the 'to' array have the right structure and form on the data.
     * @param array $in
     * @return string
     */
    $functions.push('_CheckMessageStructureTo');
    const _CheckMessageStructureTo = function($in) {
        for (let $key in $in.to) {
            if ($in.to.hasOwnProperty($key) === false) {
                continue;
            }

            if (_Empty($in.to[$key]) === 'true') {
                return 'I want data in node, plugin and function';
            }

            if ($in.to[$key].toLowerCase() !== $in.to[$key]) {
                return 'I want lower case data in node, plugin and function';
            }
        }

        return '';
    };

    /**
     * Check that the message have a valid destination node.
     * @param array $in
     * @return array
     */
    $functions.push('_CheckMessageNode');
    const _CheckMessageNode = function($in) {
        $in = _ByVal($in);

        let $ok = 'true',
            $message = 'Node is known, I am OK with this';

        leave: {
            if (_Empty($in) === 'true') {
                $ok = 'false';
                $message = 'The message is empty. Something is wrong';
                break leave;
            }

            if (_Empty($in.callstack) === 'true') {
                $message = 'The message will soon reach its origin. I am OK with this';
                break leave;
            }

            const $validNodesArray = ['client', 'server', 'cron', 'callback'];
            if ($validNodesArray.indexOf($in.callstack[0].to.node) === -1) {
                $ok = 'false';
                $message = 'I only send back the answer to a node that I know';
            }
        }

        return {
            'answer': 'true',
            'message': $message,
            'data_message': $in,
            'ok': $ok,
        };
    };

    /**
     * Check that the message follow the rules for whom it is allowed to talk to / answer to.
     * @param array $in
     * @return array
     */
    $functions.push('_CheckMessageCalling');
    const _CheckMessageCalling = function($in) {
        $in = _ByVal($in);

        let $answer = 'true';
        let $message = 'I am OK with how you communicate in this message.';
        let $ok = 'true';

        // If different from/to node then...
        // OK if both plugins are level 1
        // If same from/to node then...
        // OK if plugins are level 1
        // OK if plugins are identical, to: infohub_storage_mysql, back: infohub_storage_mysql
        // OK if answer goes to parent, to: infohub_storage_mysql, back: infohub_storage
        // OK if query goes to a level 1 plugin. to: infohub_storage, back: infohub_contact_client
        // OK if you call a sibling. to: infohub_democall_sibling, back: infohub_democall_child

        leave: {
            if (_Empty($in) === 'true') {
                $ok = 'false';
                $answer = 'false';
                $message = 'The message is empty. Something is wrong';
                break leave;
            }

            const $to = $in.to;
            const $toPart = $to.plugin.split('_');

            if ($in.callstack.length === 0) {
                $message = $message +
                    ' OK to arrive at a plugin with an empty callstack. Means you used a multi message with a short tail';
                break leave;
            }

            let $back = $in.callstack[$in.callstack.length - 1];
            $back = $back.to;
            const $backPart = $back.plugin.split('_');

            if ($toPart.length === 2 && $backPart.length === 2) {
                $message = $message +
                    ' OK, communication on level 1 is OK, even between nodes';
                break leave;
            }

            if ($to.node !== $back.node) { // Different nodes
                $ok = 'false';
                $answer = 'false';
                $message = 'You send a message to a different node. Then both the caller and the called plugin must be on level 1. Now they were not';
                break leave;
            }

            if ($to.plugin === $back.plugin) {
                $message = $message + ' OK, plugins are identical';
                break leave;
            }

            if ($toPart.length === 2 && $backPart.length > 2) {
                $message = $message +
                    ' OK, the destination is a level 1 plugin on the same node';
                break leave;
            }

            if ($back.plugin === 'infohub_workbench') {
                break leave; // Workbench pings all plugins mentioned in launcher.json "uses" array.
                // Plugin requests end up in the same package. Reducing the calls and ban times.
                // Plugins launch faster. Test plugins: Tools, Welcome, Demo, Contact. Much quicker.
            }

            if ($toPart.length - $backPart.length === 1) {
                let $toPartCopy = _ByVal($toPart);
                $toPartCopy.pop(); // Remove the child name from the end of the array
                if (JSON.stringify($toPartCopy) === JSON.stringify($backPart)) {
                    $message = $message + ' OK, the destination is a child';
                    break leave;
                }
            }

            if ($toPart.length === $backPart.length) {
                let $toPartCopy = _ByVal($toPart);
                $toPartCopy.pop(); // Remove the child name from the end of the array
                let $backPartCopy = _ByVal($backPart);
                $backPartCopy.pop(); // Remove the child name from the end of the array
                if (JSON.stringify($toPartCopy) ===
                    JSON.stringify($backPartCopy)) {
                    $message = $message + ' OK, the destination is a sibling';
                    break leave;
                }
            }

            $answer = 'false';
            $message = 'I am not happy with how you communicate in this message. Check the documentation to see what I will let you pass';
            $ok = 'false';

            $in.message = $message;
            _SendMessageBackMessageFailedTests($in);
        }

        return {
            'answer': $answer,
            'message': $message,
            'data_message': $in,
            'ok': $ok,
        };
    };

    /**
     * Sort all messages in ToSort array => Stack, ToPending, ToNode
     * Used by: main
     * @version 2015-09-20
     * @since 2013-08-18
     * @author Peter Lembke
     * @param $in
     * @returns {*}
     */
    $functions.push('internal_Sort');
    const internal_Sort = function($in) {
        const $default = {};
        $in = _Default($default, $in);

        while ($Sort.length > 0) {
            const $dataMessage = $Sort.pop(); // Move the last message from the array Sort

            if (_IsSet($dataMessage.to) === 'false' ||
                _IsSet($dataMessage.to.node) === 'false') {
                continue;
            }

            const $nodeName = $dataMessage.to.node;

            if ($nodeName !== 'client') {
                if (_IsSet($ToNode[$nodeName]) === 'false') {
                    $ToNode[$nodeName] = [];
                }

                $ToNode[$nodeName].push($dataMessage);
                continue;
            }

            const $pluginName = $dataMessage.to.plugin;

            if (_IsSet($PluginMissing[$pluginName]) === 'true') {
                _SendMessageBackPluginNotFound($dataMessage);
                continue;
            }

            if (_IsSet($Plugin[$pluginName]) === 'false') {
                $ToPending.push($dataMessage);
                continue;
            }

            $Stack.push($dataMessage);
        }

        return {
            'answer': 'true',
            'message': 'Sorted the messages in Sort',
        };
    };

    /**
     * Messages in array ToPending either go to array Pending or are thrown away
     * Used by: main
     * @version 2016-09-16
     * @since 2013-08-18
     * @author Peter Lembke
     * @param $in
     * @return object
     */
    $functions.push('internal_ToPending');
    const internal_ToPending = function($in) {
        const $default = {};
        $in = _Default($default, $in);

        while ($ToPending.length > 0) {
            const $dataMessage = $ToPending.pop();
            const $pluginName = $dataMessage.to.plugin;

            if (_IsSet($Pending[$pluginName]) === 'true' &&
                Array.isArray($Pending[$pluginName]) === true) {
                // We have got messages to this pending plugin before
                if ($Pending[$pluginName].length === 0) {
                    // We earlier got information that the plugin could not be found.

                    const $message = 'Could not get the plugin from the server';

                    internal_Log({
                        'function_name': 'internal_ToPending',
                        'message': $message,
                        'level': 'error',
                        'object': {'plugin': $pluginName},
                    });

                    $PluginMissing[$pluginName] = {};
                    _SendMessageBackPluginNotFound($dataMessage);

                    continue;
                }

                // There are already messages here, add our message
                $Pending[$pluginName].push($dataMessage);
                continue;
            }

            // This message are the first to come to this plugin name
            $Pending[$pluginName] = [];
            $Pending[$pluginName].push($dataMessage);

            let $subCall = _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_plugin',
                    'function': 'plugin_request',
                },
                'data': {
                    'plugin_name': $pluginName,
                    'plugin_node': $dataMessage.to.node,
                },
            });

            $subCall.callstack = [];

            $subCall.callstack[0] = {
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_exchange',
                    'function': 'main',
                },
                'data_back': {},
            };

            _SortAdd({'message': $subCall});
        }

        return {
            'answer': 'true',
            'message': 'Sorted the messages in ToPending',
        };
    };

    /**
     * Execute all messages in the array:Stack, and move the answer to array:Sort
     * We know that the messages in Stack can be run and that the plugins needed are already started
     * @version 2014-10-16
     * @since 2013-11-21
     * @author Peter Lembke
     * @param $in
     * @returns {{answer: string, message}}
     */
    $functions.push('internal_Stack');
    const internal_Stack = function($in) {
        const $default = {};
        $in = _Default($default, $in);

        while ($Stack.length > 0) {
            let $dataMessage = $Stack.pop();
            const $pluginName = $dataMessage.to.plugin;

            if (_IsSet($Plugin[$pluginName]) === 'false') {
                internal_Log({
                    'level': 'error',
                    'message': 'The plugin do not exist. Too late to do something about that now.',
                    'function_name': 'internal_Stack',
                    'object': {'plugin': $pluginName},
                });

                $PluginMissing[$pluginName] = {};
                continue;
            }

            const $responseConfig = internal_GetConfigFromLocalStorage(
                $pluginName);
            if ($responseConfig.answer === 'false') {
                // you as a developer deleted the plugin from browser after infohub had loaded it
                internal_Log({
                    'level': 'error',
                    'message': $responseConfig.message,
                    'function_name': 'internal_Stack',
                    'object': {'plugin': $pluginName},
                });

                // $PluginMissing[$pluginName] = {}; // Do not set as missing, just try again instead.
                delete $Plugin[$pluginName];
                continue;
            }

            $dataMessage.data.config = $responseConfig.plugin_config;
            $dataMessage.data.config.user_name = _GetUserName();
            $dataMessage.data.config.session_id = _GetSessionId();

            let $run = $Plugin[$pluginName];
            if ($pluginName === 'infohub_exchange') {
                $run = $that;
            }

            $dataMessage.callback_function = function($response) {
                _SortAdd({
                    'message': $response,
                });
            };

            $run.cmd($dataMessage); // callback_function is always used by cmd(). see above.
        }

        return {
            'answer': 'true',
            'message': 'Have run all messages in the Stack, have put the responses in Sort',
        };
    };

    /**
     * Read the locally stored plugin data and pull out the config for the plugin.
     * If the plugin is missing from local storage then it means that the user have manually
     * deleted the plugin from localstorage.
     * @param $pluginName
     * @returns {*}
     * @private
     */
    $functions.push('internal_GetConfigFromLocalStorage');
    const internal_GetConfigFromLocalStorage = function($pluginName) {
        let $pluginConfig = {},
            $answer = 'false',
            $message = 'Plugin do not exist in local storage';

        const $pluginJson = localStorage.getItem('plugin_' + $pluginName);

        if (_Empty($pluginJson) === 'false') {
            const $pluginData = JSON.parse($pluginJson);
            $pluginConfig = $pluginData.plugin_config;
            $answer = 'true';
            $message = 'Here are the config for the plugin';
        }

        if (_Empty($pluginConfig) === 'true') {
            $pluginConfig = {};
        }

        return {
            'answer': $answer,
            'message': $message,
            'plugin_config': $pluginConfig,
            'plugin_name': $pluginName,
        };
    };

    /**
     * Start the core plugins that must exist for anything to work
     * @returns {{answer: string, message: string}}
     */
    $functions.push('internal_StartCore');
    const internal_StartCore = function() {
        const $corePluginNames = [
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

        let $out = {
            'answer': 'true',
            'message': 'Started the core plugins',
        };

        while ($corePluginNames.length > 0) {
            const $name = $corePluginNames.pop();
            if (_IsSet($Plugin[$name]) === 'true') {
                continue;
            }

            $Plugin[$name] = {};

            try {
                eval('$Plugin[$name] = new ' + $name + '();');
            } catch ($err) {
                $out.answer = 'false';
                $out.message = 'Can not instantiate class:"' + $name +
                    '", error:"' + $err.message + '"';
                break;
            }
        }

        $coreStarted = $out.answer;
        return $out;
    };

    $functions.push('redirect');
    /**
     * Redirect infohub to another url
     * @param $in
     * @returns {{new_url: string, answer: string, message: string}}
     */
    const redirect = function($in) {
        const $default = {
            'new_url': '',
        };
        $in = _Default($default, $in);

        window.location.replace($in.new_url);

        return {
            'answer': 'true',
            'message': 'Rerouting to another url',
            'new_url': $in.new_url,
        };
    };
}

//# sourceURL=infohub_exchange.js