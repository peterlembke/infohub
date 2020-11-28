/**
 Copyright (C) 2018- Peter Lembke, CharZam soft
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
function infohub_offline() {

    "use strict";

// include "infohub_base.js"

    $functions.push('_Version');
    const _Version = function() {
        return {
            'date': '2019-11-14',
            'since': '2018-10-26',
            'version': '1.0.1',
            'class_name': 'infohub_offline',
            'checksum': '{{checksum}}',
            'note': 'Download features to prepare going offline. Also accept subscriptions to the offline event.',
            'SPDX-License-Identifier': 'GPL-3.0-or-later',
            'user_role': 'user',
            'web_worker': 'false',
            'core_plugin': 'true'
        };
    };

    $functions.push('_GetCmdFunctions');
    const _GetCmdFunctions = function() {
        const $list = {
            'setup_gui': 'normal',
            'subscribe': 'normal',
            'unsubscribe': 'normal',
            'unsubscribe_all': 'normal',
            'gui_download_plugins': 'normal',
            'gui_download_assets': 'normal',
            'gui_download_documentation': 'normal',
            'gui_show_subscribers': 'normal',
            'update_indicator': 'normal',
            'update_service_worker': 'normal',
            'event_message': 'normal'
        };

        return _GetCmdFunctionsBase($list);
    };
    
    let $classTranslations = {};

    /**
     * Translate - Substitute a string for another string using a class local object
     * @param {type} $string
     * @returns string
     */
    $functions.push('_Translate');
    const _Translate = function ($string)
    {
        if (typeof $classTranslations !== 'object') { return $string; }
        return _GetData({
            'name': _GetClassName() + '|' + $string, 
            'default': $string, 'data': $classTranslations, 'split': '|'
        });
    };

    // *****************************************************************************
    // * The private functions, add your own in your plugin
    // * These functions can be used directly in your functions.
    // * Name: _CamelCaseData
    // *****************************************************************************

    /**
     * Are we online; "true" or "false"
     * @version 2018-10-26
     * @since   2018-10-26
     * @author  Peter Lembke
     */
    $functions.push('_GetOnline');
    const _GetOnline = function ()
    {
        const $online = navigator.onLine ? "true" : "false";

        return $online;
    };

    /**
     * Get a status string if we are online, offline or unknown
     * @version 2018-10-26
     * @since   2018-10-26
     * @author  Peter Lembke
     */
    $functions.push('_GetStatus');
    const _GetStatus = function ($online)
    {
        let $status = "unknown";

        if ($online === 'false') {
            $status = 'offline';
        }

        if ($online === 'true') {
            $status = 'online';
        }

        return $status;
    };

    /**
     * You can subscribe to offline combinations
     * @version 2018-07-11
     * @since   2018-07-11
     * @author  Peter Lembke
     */
    $functions.push('_GetSubscribersMessages');
    const _GetSubscribersMessages = function ($key)
    {
        let $messages = [];
        const $data = _LoadData();
        const $realKey = $key;

        $messages = _AddMessages($key, $realKey, $data,$messages);
        $messages = _AddMessages('all', $realKey, $data, $messages);

        return $messages;
    };

    /**
     * Collect all outgoing messages that matches the key
     * @version 2018-10-16
     * @since   2018-10-16
     * @author  Peter Lembke
     */
    $functions.push('_AddMessages');
    const _AddMessages = function ($key, $realKey, $data, $messages)
    {
        if (_IsSet($data[$key]) === 'false') {
            return $messages;
        }

        for (let $from in $data[$key])
        {
            if ($data[$key].hasOwnProperty($from) === false) {
                continue;
            }

            let $message = $data[$key][$from];
            $message = _SubCall($message); // Make sure the message contain all that is needed for a sub call.
            $message.data_back = {
                'step': 'step_end',
                'key': $key
            };
            $message.data.key = $realKey;

            $messages.push($message);
        }

        return $messages;
    };

    /**
     * Loads the subscription data
     * @version 2018-10-16
     * @since   2018-10-16
     * @author  Peter Lembke
     */
    $functions.push('_LoadData');
    const _LoadData = function ()
    {
        let $jsonData = sessionStorage.getItem('infohub_offline');

        let $data = JSON.parse($jsonData);
        if (_Empty($data) === 'true') {
            $data = {};
        }

        let $staticSubscriptions = {};

        /*
        $staticSubscriptions = {
            'online': {
                'client|infohub_transfer': {
                    'to': {'node': 'client', 'plugin': 'infohub_transfer', 'function': 'event_online'}
                }
            },
            'offline': {
                'client|infohub_transfer': {
                    'to': {'node': 'client', 'plugin': 'infohub_transfer', 'function': 'event_offline'}
                }
            }
        };
        */

        $data = _Merge($data, $staticSubscriptions);

        return $data;
    };

    /**
     * Saves the subscription data
     * @version 2018-10-16
     * @since   2018-10-16
     * @author  Peter Lembke
     */
    $functions.push('_SaveData');
    const _SaveData = function ($data)
    {
        if (_Empty($data) === 'true') {
            $data = {};
        }
        const $jsonData = JSON.stringify($data);
        sessionStorage.setItem('infohub_offline', $jsonData);
    };

    // *****************************************************************************
    // * Functions you only can reach with CMD()
    // * Observe! function names are lower_case
    // *****************************************************************************

    /**
     * Setup the Config Graphical User Interface
     * @version 2018-09-09
     * @since   2018-09-09
     * @author  Peter Lembke
     */
    $functions.push('setup_gui');
    const setup_gui = function ($in)
    {
        const $default = {
            'box_id': '',
            'step': 'step_get_translations'
        };
        $in = _Merge($default, $in);

        if ($in.step === 'step_get_translations')
        {
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_translate',
                    'function': 'get_translate_data'
                },
                'data': {},
                'data_back': {
                    'box_id': $in.box_id,
                    'step': 'step_get_translations_response'
                }
            });
        }

        if ($in.step === 'step_get_translations_response')
        {
            $classTranslations = _ByVal($in.response.data);
            $in.step = 'step_start';
        }

        if ($in.step === 'step_start')
        {
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_render',
                    'function': 'create'
                },
                'data': {
                    'what': {
                        'my_presentation_box': {
                            'plugin': 'infohub_rendermajor',
                            'type': 'presentation_box',
                            'head_label': _Translate('Offline tools'),
                            'content_data': '[my_form]',
                            'foot_text': _Translate('Tools to see if you are online/offline. See what plugins are subscribing to that event. Buttons to download and store data to prepare for offline usage.')
                        },
                        'my_form': {
                            'type': 'form',
                            'subtype': 'form',
                            'content': '[my_indicator][button_download_plugins][button_download_assets][button_download_documentation][button_show_subscribers][my_container]'
                        },
                        'my_indicator': {
                            'type': 'common',
                            'subtype': 'container'
                        },
                        'button_download_plugins': {
                            'plugin': 'infohub_renderform',
                            'type': 'button',
                            'mode': 'button',
                            'button_label': _Translate('Download plugins'),
                            'event_data': 'offline',
                            'to_plugin': 'infohub_offline',
                            'to_function': 'gui_download_plugins'
                        },
                        'button_download_assets': {
                            'plugin': 'infohub_renderform',
                            'type': 'button',
                            'mode': 'button',
                            'button_label': _Translate('Download assets'),
                            'event_data': 'offline',
                            'to_plugin': 'infohub_offline',
                            'to_function': 'gui_download_assets'
                        },
                        'button_download_documentation': {
                            'plugin': 'infohub_renderform',
                            'type': 'button',
                            'mode': 'button',
                            'button_label': _Translate('Download documentation'),
                            'event_data': 'offline',
                            'to_plugin': 'infohub_offline',
                            'to_function': 'gui_download_documentation'
                        },
                        'button_show_subscribers': {
                            'plugin': 'infohub_renderform',
                            'type': 'button',
                            'mode': 'button',
                            'button_label': _Translate('Show subscribers'),
                            'event_data': 'offline',
                            'to_plugin': 'infohub_offline',
                            'to_function': 'gui_show_subscribers'
                        },
                        'my_container': {
                            'type': 'common',
                            'subtype': 'codecontainer'
                        }
                    },
                    'how': {
                        'mode': 'one box',
                        'text': '[my_presentation_box]'
                    },
                    'where': {
                        'box_id': $in.box_id,
                        'max_width': 320,
                        'scroll_to_box_id': 'true'
                    },
                    'cache_key': 'offline'
                },
                'data_back': {
                    'step': 'step_subscribe'
                }
            });
        }

        if ($in.step === 'step_subscribe')
        {
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_offline',
                    'function': 'subscribe'
                },
                'data': {
                    'subscriptions': {
                        'all': {
                            'to': {'node': 'client', 'plugin': 'infohub_offline', 'function': 'update_indicator'}
                        }
                    }
                },
                'data_back': {
                    'step': 'step_update_indicator'
                }
            });
        }

        if ($in.step === 'step_update_indicator')
        {
            const $online = _GetOnline();
            const $status = _GetStatus($online);

            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_offline',
                    'function': 'update_indicator'
                },
                'data': {
                    'key': $status
                },
                'data_back': {
                    'step': 'step_end'
                }
            });
        }

        return {
            'answer': 'true',
            'message': 'plugin GUI is done'
        };
    };

    /**
     * You can subscribe to many offline combinations in one call.
     * In "subscriptions" you put your key-strings and each key-strings message.
     * @version 2018-10-16
     * @since   2018-09-09
     * @author  Peter Lembke
     * @param $in
     * @returns {{answer: string, message: string}}
     */
    $functions.push('subscribe');
    const subscribe = function ($in)
    {
        const $default = {
            'subscriptions': {}, // Add the key_combination string and the message you want.
            'from_plugin': {'node': '', 'plugin': '', 'function': '' }
        };
        $in = _Default($default, $in);

        const $from = $in.from_plugin.node + '|' + $in.from_plugin.plugin;

        let $messageOut = {};
        let $answer = 'true';
        let $message = 'Now you subscribe to the combinations you want';

        let $key = '';

        let $messageOutDefault = {
            'to': {'node': '', 'plugin': '', 'function': '' },
            'data': {}
        };

        leave: {
            for ($key in $in.subscriptions) {
                if ($in.subscriptions.hasOwnProperty($key) === false) {
                    continue;
                }

                $messageOut = _Default($messageOutDefault, $in.subscriptions[$key]);

                if ($messageOut.to.node !== $in.from_plugin.node) {
                    $answer = 'false';
                    $message = 'Your subscription message must go to the plugin you subscribe from';
                    break leave;
                }

                if ($messageOut.to.plugin !== $in.from_plugin.plugin) {
                    $answer = 'false';
                    $message = 'Your subscription message must go to the plugin you subscribe from';
                    break leave;
                }
            }

            for ($key in $in.subscriptions) {
                if ($in.subscriptions.hasOwnProperty($key) === false) {
                    continue;
                }

                $messageOut = _Default($messageOutDefault, $in.subscriptions[$key]);

                const $response = internal_Cmd({
                    'func': 'Subscribe',
                    'from': $from,
                    'key': $key,
                    'message': $messageOut
                });

                if ($response.answer === 'false') {
                    $answer = 'false';
                    $message = $response.message;
                    break leave;
                }
            }
        }

        return {
            'answer': $answer,
            'message': $message,
            'key': $key,
            'from': $from,
            'message_out': $messageOut
        };
    };

    /**
     * You can unsubscribe to many offline combinations in one call.
     * In "subscriptions" you put your key-strings and each key-strings empty message.
     * @version 2018-10-16
     * @since   2018-10-16
     * @author  Peter Lembke
     * @param $in
     * @returns {{answer: string, message: string}}
     */
    $functions.push('unsubscribe');
    const unsubscribe = function ($in)
    {
        const $default = {
            'subscriptions': {}, // Add the key_combination string and and empty message
            'from_plugin': {'node': '', 'plugin': '', 'function': '' }
        };
        $in = _Default($default, $in);

        const $from = $in.from_plugin.node + '|' + $in.from_plugin.plugin;

        for (let $key in $in.subscriptions) {
            if ($in.subscriptions.hasOwnProperty($key) === true) {
                const $response = internal_Cmd({'func': 'Unsubscribe', 'from': $from, 'key': $key});
            }
        }

        return {
            'answer': 'true',
            'message': 'Done with unsubscribing'
        };
    };

    /**
     * You can unsubscribe to all combinations in one call.
     * @version 2018-10-16
     * @since   2018-10-16
     * @author  Peter Lembke
     * @param $in
     * @returns {{answer: string, message: string}}
     */
    $functions.push('unsubscribe_all');
    const unsubscribe_all = function ($in)
    {
        const $default = {
            'from_plugin': {'node': '', 'plugin': '', 'function': '' }
        };
        $in = _Default($default, $in);

        const $from = $in.from_plugin.node + '|' + $in.from_plugin.plugin;

        return internal_Cmd({
            'func': 'UnsubscribeAll',
            'from': $from
        });
    };

    /**
     * You can subscribe to offline combinations
     * @version 2018-09-29
     * @since   2018-07-11
     * @author  Peter Lembke
     */
    $functions.push('internal_Subscribe');
    const internal_Subscribe = function ($in)
    {
        const $default = {
            'from': '', // "node|plugin_name"
            'key': '', // example: "shift_alt_ctrl_49"
            'message': {} // The message you want to send when key combination is pressed
        };
        $in = _Default($default, $in);

        let $data = _LoadData();
        if (_IsSet($data[$in.key]) === 'false') {
            $data[$in.key] = {};
        }
        $data[$in.key][$in.from] = _ByVal($in.message);
        _SaveData($data);

        return {
            'answer': 'true',
            'message': 'Done storing subscription'
        };
    };

    /**
     * You can unsubscribe to offline combinations
     * @version 2018-10-14
     * @since   2018-10-14
     * @author  Peter Lembke
     */
    $functions.push('internal_Unsubscribe');
    const internal_Unsubscribe = function ($in)
    {
        let $changed = 'false',
            $message = 'Could not find that key';

        const $default = {
            'from': '',
            'key': ''
        };
        $in = _Default($default, $in);

        let $data = _LoadData();

        if (_IsSet($data[$in.key]) === 'true') {
            if (_IsSet($data[$in.key][$in.from]) === 'true') {
                delete $data[$in.key][$in.from];

                if (_Empty($data[$in.key]) === 'true') {
                    delete $data[$in.key];
                }

                _SaveData($data);
                $changed = 'true';
                $message = 'Removed your key';
            }
        }

        return {
            'answer': 'true',
            'message': $message,
            'key': $in.key,
            'changed': $changed
        };
    };

    /**
     * Here you can unsubscribe to all your offline combinations
     * @version 2018-10-16
     * @since   2018-10-16
     * @author  Peter Lembke
     */
    $functions.push('internal_UnsubscribeAll');
    const internal_UnsubscribeAll = function ($in)
    {
        let $changed = 'false',
            $message = 'Could not find any keys';

        const $default = {
            'from': ''
        };
        $in = _Default($default, $in);

        let $data = _LoadData();

        for (let $key in $data) {
            if ($data.hasOwnProperty($key) === false) {
                continue;
            }
            if (_IsSet($data[$key][$in.from]) === 'false') {
                continue;
            }
            delete $data[$key][$in.from];
            $changed = 'true';
            $message = 'Deleted all your keys';
        }

        if ($changed === 'true') {
            _SaveData($data);
        }

        return {
            'answer': 'true',
            'message': $message,
            'changed': $changed
        };
    };

    /**
     * Download all plugins
     * @version 2018-10-26
     * @since   2018-10-26
     * @author  Peter Lembke
     */
    $functions.push('gui_download_plugins');
    const gui_download_plugins = function ($in)
    {
        const $default = {
            'step': 'step_start',
            'response': {}
        };
        $in = _Default($default, $in);

        if ($in.step === 'step_start')
        {
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_plugin',
                    'function': 'download_all_plugins'
                },
                'data': {},
                'data_back': {
                    'step': 'step_end'
                }
            });
        }

        return {
            'answer': $in.response.answer,
            'message': $in.response.message
        };
    };

    /**
     * Download all assets
     * @version 2018-10-26
     * @since   2018-10-26
     * @author  Peter Lembke
     */
    $functions.push('gui_download_assets');
    const gui_download_assets = function ($in)
    {
        const $default = {
            'step': 'step_get_all_plugin_names_that_has_assets',
            'response': {
                'answer': 'false',
                'message': 'No response from subcall',
                'data': {}
            }
        };
        $in = _Default($default, $in);

        if ($in.step === 'step_get_all_plugin_names_that_has_assets')
        {
            return _SubCall({
                'to': {
                    'node': 'server',
                    'plugin': 'infohub_file',
                    'function': 'get_all_plugin_names_that_has_assets'
                },
                'data': {},
                'data_back': {
                    'step': 'step_get_full_list_response'
                }
            });
        }

        let $list;

        if ($in.step === 'step_get_full_list_response') {
            $list = $in.response.data;
            $in.step = 'step_update_all_assets';
        }
        
        if ($in.step === 'step_update_all_assets') {
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_asset',
                    'function': 'update_all_assets'
                },
                'data': {
                    'list': $list
                },
                'data_back': {
                    'step': 'step_update_all_assets_response'
                }
            });
        }

        if ($in.step === 'step_update_all_assets_response') {
            
        }

        return {
            'answer': $in.response.answer,
            'message': $in.response.message
        };
    };

    /**
     * Download all documentation
     * @version 2018-10-26
     * @since   2018-10-26
     * @author  Peter Lembke
     */
    $functions.push('gui_download_documentation');
    const gui_download_documentation = function ($in)
    {
        const $default = {
            'step': 'step_start',
            'response': {}
        };
        $in = _Default($default, $in);

        if ($in.step === 'step_start')
        {
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_doc',
                    'function': 'get_all_documents'
                },
                'data': {},
                'data_back': {
                    'step': 'step_end'
                }
            });
        }

        return {
            'answer': $in.response.answer,
            'message': $in.response.message
        };
    };

    /**
     * Show all offline subscribers
     * @version 2018-10-18
     * @since   2018-10-18
     * @author  Peter Lembke
     */
    $functions.push('gui_show_subscribers');
    const gui_show_subscribers = function ($in)
    {
        const $default = {
            'step': 'step_start',
            'response': {
                'answer': '',
                'message': ''
            }
        };
        $in = _Default($default, $in);

        if ($in.step === 'step_start') {

            const $data = _LoadData();

            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_view',
                    'function': 'set_text'
                },
                'data': {
                    'id': 'main.body.infohub_offline.[my_container]',
                    'text': JSON.stringify($data, null, 2)
                },
                'data_back': {
                    'step': 'step_end',
                    'key': $in.key
                }
            });
        }

        return {
            'answer': $in.response.answer,
            'message': $in.response.message,
            'key': $in.key
        };
    };

    /**
     * The indicator will be updated
     * Renders the right icon in the container: main.body.infohub_offline.[my_indicator]
     * that were set up in function setup_gui
     * @version 2018-10-26
     * @since   2018-10-26
     * @author  Peter Lembke
     */
    $functions.push('update_indicator');
    const update_indicator = function ($in)
    {
        const $default = {
            'step': 'step_start',
            'key': '',
            'data_back': {},
            'response': {
                'answer': 'false',
                'message': 'Done'
            }
        };
        $in = _Default($default, $in);

        if ($in.step === 'step_start')
        {
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_render',
                    'function': 'create'
                },
                'data': {
                    'what': {
                        'my_indicator': {
                            'type': 'common',
                            'subtype': 'svg',
                            'data': '[my_indicator_asset]',
                            'alias': 'my_indicator',
                            'class': 'svg',
                            'css_data': {
                                '.svg': 'width:60px;height:60px;padding:4px;'
                            }
                        },
                        'my_indicator_asset': {
                            'plugin': 'infohub_asset',
                            'type': 'icon',
                            'asset_name': $in.key,
                            'plugin_name': 'infohub_offline'
                        },
                        'my_text': {
                            'type': 'common',
                            'subtype': 'label_data',
                            'label': _Translate('Status'),
                            'data': $in.key
                        }
                    },
                    'how': {
                        'mode': 'one box',
                        'text': '[my_indicator][my_text]',
                        'css_data': {}
                    },
                    'where': {
                        'box_id': 'main.body.infohub_offline.[my_indicator]',
                        'max_width': 640,
                        'scroll_to_box_id': 'false'
                    }

                },
                'data_back': {
                    'step': 'step_end',
                    'key': $in.key
                }
            });
        }

        return {
            'answer': $in.response.answer,
            'message': $in.response.message,
            'key': $in.key
        };
    };

    /**
     * If our copy of index.php is old and our last check is old then
     * Asks the server for the checksum of all files that are included in index.php
     * Compares with the checksum that is in our cached copy of index.php
     * If the answer is valid and the checksums are different then unregister all service workers
     * @version 2019-11-14
     * @since   2019-11-14
     * @author  Peter Lembke
     */
    $functions.push('update_service_worker');
    const update_service_worker = function ($in)
    {
        const $cacheLifeTimeSeconds = 10 * 60.0;
        const $path = 'infohub_offline/service_worker';

        const $default = {
            'step': 'step_load_data',
            'answer': 'true',
            'message': 'Nothing to report',
            'data_back': {

            },
            'response': {
                'answer': 'false',
                'message': 'Done',
                'checksum': '',
                'valid': '',
                'data': {
                    'time_epoc': 0.0,
                    'time_stamp': '',
                    'checksum': ''
                }
            }
        };
        $in = _Default($default, $in);

        if ('serviceWorker' in navigator) {
        } else {
            $in.step = 'step_end';
        }

        let $localRenderedTime = 0.0;
        if ('$renderedTime' in window) {
            $localRenderedTime = $renderedTime;
        } else {
            $in.step = 'step_end';
        }

        let $localRenderedChecksum = '';
        if ('$renderedChecksum' in window) {
            $localRenderedChecksum = $renderedTime;
        } else {
            $in.step = 'step_end';
        }

        let $time = $localRenderedTime;

        if ($in.step === 'step_load_data') {

            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_storage',
                    'function': 'read'
                },
                'data': {
                    'path': $path,
                },
                'data_back': {
                    'step': 'step_load_data_response'
                }
            });
        }

        if ($in.step === 'step_load_data_response')
        {
            $in.message = 'Could not read from Storage';

            if ($in.answer === 'true') {
                if ($in.response.data.time_epoc > 0.0) {
                    if ($in.response.data.time_epoc > $localRenderedTime) {
                        $time = $in.response.data.time_epoc;
                    }
                }

                $in.message = 'Not enough time since last check. Perhaps next refresh';

                let $diff = _MicroTime() - $time;
                if ($diff > $cacheLifeTimeSeconds) {
                    $in.step = 'step_server';
                }
            }
        }

        if ($in.step === 'step_server')
        {
            return _SubCall({
                'to': {
                    'node': 'server',
                    'plugin': 'infohub_offline',
                    'function': 'index_checksum'
                },
                'data': {
                    'rendered_checksum': $localRenderedChecksum
                },
                'data_back': {
                    'step': 'step_server_response'
                }
            });
        }

        if ($in.step === 'step_server_response')
        {
            $in.step = 'step_end';
            if ($in.answer === 'true') {

                if ($in.response.valid === 'false')
                {
                    // The checksum we have is not valid. Lets unregister all service workers and reload the page.
                    // That will cache a new index.php
                    navigator.serviceWorker.getRegistrations().then(function(registrations) {

                        for(let $i = 0; $i < registrations.length; $i = $i + 1)
                        {
                            let $registration = registrations[$i];
                            $registration.unregister();
                        }

                        $in.step = 'step_reload_page';
                    });

                }

                if ($in.response.valid === 'true') {

                    return _SubCall({
                        'to': {
                            'node': 'client',
                            'plugin': 'infohub_storage',
                            'function': 'write'
                        },
                        'data': {
                            'path': $path,
                            'data': {
                                'time_epoc': _MicroTime(),
                                'time_stamp': _TimeStamp(),
                                'checksum': $localRenderedChecksum
                            }
                        },
                        'data_back': {
                            'message': 'Cache is still valid',
                            'step': 'step_write_response'
                        }
                    });
                }
            }
        }

        if ($in.step === 'step_write_response') {
            $in.answer = $in.response.answer;
            $in.message = $in.response.message;
        }

        if ($in.step === 'step_reload_page') {
            return _SubCall({
                'to': {
                    'node': 'server',
                    'plugin': 'infohub_dummy',
                    'function': 'reload_page'
                },
                'data': {},
                'data_back': {
                    'step': 'step_end'
                }
            });
        }

        return {
            'answer': $in.answer,
            'message': $in.message
        };
    };

    /**
     * Event message coming from the go() function.
     * @version 2018-10-26
     * @since   2018-10-26
     * @author  Peter Lembke
     */
    $functions.push('event_message');
    const event_message = function ($in)
    {
        const $default = {
            'from_plugin': {'node': '', 'plugin': '', 'function': '' },
            'event_type': '',
            'step': 'step_start',
            'data_back': {
                'key': ''
            },
            'response': {
                'answer': '',
                'message': ''
            }
        };
        $in = _Default($default, $in);

        let $answer = 'true',
            $message = 'Nothing to report';

        $in.online = _GetOnline();
        $in.status = _GetStatus($in.online);

        if ($in.step === 'step_start')
        {
            if ($in.event_type === 'online')
            {
                $in.data_back.key = $in.status;
                const $messagesOut = _GetSubscribersMessages($in.status);

                if (_Empty($messagesOut) === 'false')
                {
                    if (Array.isArray($messagesOut))
                    {
                        return  {
                            'answer': 'true',
                            'message': 'Here comes a multi message',
                            'messages': $messagesOut
                        };
                    }
                }

                $answer = 'true';
                $message = 'No subscriber to key';
            }
        }

        if ($in.step === 'step_end') {
            $answer = $in.response.answer;
            $message = $in.response.message;
        }

        return {
            'answer': $answer,
            'message': $message,
            'key': $in.data_back.key
        };
    };

}

// See folder/include/the_go_function.js
function updateOnlineStatus(event) {
    sendMessage('infohub_offline', {'event_type': 'online' });
    // You can subscribe to these messages, see the documentation
}
window.addEventListener('online',  updateOnlineStatus);
window.addEventListener('offline', updateOnlineStatus);

//# sourceURL=infohub_offline.js
