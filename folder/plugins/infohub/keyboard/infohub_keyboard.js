/*
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
function infohub_keyboard() {

    "use strict";

// include "infohub_base.js"

    $functions.push('_Version');
    const _Version = function() {
        return {
            'date': '2018-10-18',
            'version': '1.0.0',
            'class_name': 'infohub_keyboard',
            'checksum': '{{checksum}}',
            'note': 'When you use the keyboard then an event message come here. You can subscribe to key strokes',
            'SPDX-License-Identifier': 'GPL-3.0-or-later',
            'recommended_security_group': 'user'
        };
    };

    $functions.push('_GetCmdFunctions');
    const _GetCmdFunctions = function() {
        return {
            'setup_gui': 'normal',
            'subscribe': 'normal',
            'unsubscribe': 'normal',
            'unsubscribe_all': 'normal',
            'gui_subscribe': 'normal',
            'gui_unsubscribe': 'normal',
            'gui_show_subscribers': 'normal',
            'demo_popup': 'normal',
            'all_keys_to_gui': 'normal',
            'event_message': 'normal'
        };
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
     * You can subscribe to keyboard combinations
     * @version 2018-07-11
     * @since   2018-07-11
     * @author  Peter Lembke
     */
    $functions.push('_ConvertToKey');
    const _ConvertToKey = function ($in)
    {
        const $default = {
            'alt_key': 'false',
            'ctrl_key': 'false',
            'shift_key': 'false',
            'key_code': 0
        };
        $in = _Default($default, $in);

        let $shift = '';
        if ($in.shift_key === 'true') {
            $shift = 'shift_';
        }

        let $alt = '';
        if ($in.alt_key === 'true') {
            $alt = 'alt_';
        }

        let $ctrl = '';
        if ($in.ctrl_key === 'true') {
            $ctrl = 'ctrl_';
        }

        let $dataKey = $shift + $alt + $ctrl;

        if ($dataKey !== '') {
            $dataKey = $dataKey + $in.key_code;
        }

        return $dataKey;
    };

    /**
     * You can subscribe to keyboard combinations
     * @version 2018-07-11
     * @since   2018-07-11
     * @author  Peter Lembke
     */
    $functions.push('_GetSubscribersMessages');
    const _GetSubscribersMessages = function ($key)
    {
        const $data = _LoadData();
        const $realKey = $key;

        let $messages = [];
        $messages = _AddMessages($key, $realKey, $data, $messages);
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
        const $jsonData = sessionStorage.getItem('infohub_keyboard');
        let $data = JSON.parse($jsonData);
        if (_Empty($data) === 'true') {
            $data = {};
        }

        const $staticSubscriptions = {
            'shift_alt_ctrl_49': { // 49 = "1"
                'client|infohub_debug': {
                    'to': {'node': 'client', 'plugin': 'infohub_debug', 'function': 'reload_page'}
                }
            },
            'shift_alt_ctrl_50': { // 50 = "2"
                'client|infohub_debug': {
                    'to': {'node': 'client', 'plugin': 'infohub_debug', 'function': 'refresh_plugins_and_reload_page'}
                }
            },
            'shift_alt_ctrl_51': { // 51 = "3"
                'client|infohub_debug': {
                    'to': {'node': 'client', 'plugin': 'infohub_debug', 'function': 'clear_storage_and_reload_page'}
                }
            },
            'shift_alt_ctrl_52': { // 52 = "4"
                'client|infohub_debug': {
                    'to': {'node': 'client', 'plugin': 'infohub_debug', 'function': 'set_cold_start_and_reload_page'}
                }
            },
            'shift_alt_ctrl_57': { // 57 = "9"
                'client|infohub_login': {
                    'to': {'node': 'client', 'plugin': 'infohub_render', 'function': 'delete_render_cache_for_user_name'}
                }
            },
            'shift_alt_ctrl_48': { // 48 = "0"
                'client|infohub_login': {
                    'to': {'node': 'client', 'plugin': 'infohub_login', 'function': 'logout'}
                }
            }
        };
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
        sessionStorage.setItem('infohub_keyboard', $jsonData);
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

        if ($in.step === 'step_get_translations') {
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

        if ($in.step === 'step_get_translations_response') {            
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
                            'head_label': _Translate('Keyboard tests'),
                            'content_data': '[my_form]',
                            'foot_text': _Translate('Try combinations on your keyboard for SHIFT + CTRL + ALT and another key. The combination form a string above.')
                        },
                        'my_form': {
                            'type': 'form',
                            'subtype': 'form',
                            'content': '[my_textbox][button_subscribe][button_unsubscribe][button_show_subscribers][my_container]'
                        },
                        'my_textbox': {
                            'type': 'form',
                            'subtype': 'text',
                            'input_type': 'text'
                        },
                        'button_subscribe': {
                            'plugin': 'infohub_renderform',
                            'type': 'button',
                            'mode': 'button',
                            'button_label': _Translate('Subscribe'),
                            'event_data': 'keyboard',
                            'to_plugin': 'infohub_keyboard',
                            'to_function': 'gui_subscribe'
                        },
                        'button_unsubscribe': {
                            'plugin': 'infohub_renderform',
                            'type': 'button',
                            'mode': 'button',
                            'button_label': _Translate('Unsubscribe'),
                            'event_data': 'keyboard',
                            'to_plugin': 'infohub_keyboard',
                            'to_function': 'gui_unsubscribe'
                        },
                        'button_show_subscribers': {
                            'plugin': 'infohub_renderform',
                            'type': 'button',
                            'mode': 'button',
                            'button_label': _Translate('Show subscribers'),
                            'event_data': 'keyboard',
                            'to_plugin': 'infohub_keyboard',
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
                    'cache_key': 'keyboard'
                },
                'data_back': {'step': 'step_subscribe'}
            });
        }

        if ($in.step === 'step_subscribe')
        {
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_keyboard',
                    'function': 'subscribe'
                },
                'data': {
                    'subscriptions': {
                        'all': {
                            'to': {'node': 'client', 'plugin': 'infohub_keyboard', 'function': 'all_keys_to_gui'}
                        }
                    }
                },
                'data_back': {'step': 'step_end'}
            });
        }

        return {
            'answer': 'true',
            'message': 'plugin GUI is done'
        };

    };

    /**
     * You can subscribe to many keyboard combinations in one call.
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

        const $messageOutDefault = {
            'to': {'node': '', 'plugin': '', 'function': '' },
            'data': {}
        };

        let $key= '', // If the loop break then I want to return $key
            $messageOut = {}, // If the loop break then I want to return $messageOut
            $answer = 'true',
            $message = 'Now you subscribe to the combinations you want';

        leave: {
            for ($key in $in.subscriptions)
            {
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

            for ($key in $in.subscriptions)
            {
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
     * You can unsubscribe to many keyboard combinations in one call.
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
                internal_Cmd({
                    'func': 'Unsubscribe',
                    'from': $from,
                    'key': $key
                });
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
     * You can subscribe to keyboard combinations
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
     * You can unsubscribe to keyboard combinations
     * @version 2018-10-14
     * @since   2018-10-14
     * @author  Peter Lembke
     */
    $functions.push('internal_Unsubscribe');
    const internal_Unsubscribe = function ($in)
    {
        const $default = {
            'from': '',
            'key': ''
        };
        $in = _Default($default, $in);

        let $changed = 'false',
            $message = 'Could not find that key';

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
     * Here you can unsubscribe to all your keyboard combinations
     * @version 2018-10-16
     * @since   2018-10-16
     * @author  Peter Lembke
     */
    $functions.push('internal_UnsubscribeAll');
    const internal_UnsubscribeAll = function ($in)
    {
        const $default = {
            'from': ''
        };
        $in = _Default($default, $in);

        let $changed = 'false',
            $message = 'Could not find any keys';

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
     * Subscribe to the string in the text box
     * @version 2018-10-18
     * @since   2018-10-18
     * @author  Peter Lembke
     */
    $functions.push('gui_subscribe');
    const gui_subscribe = function ($in)
    {
        const $default = {
            'step': 'step_start',
            'response': {}
        };
        $in = _Default($default, $in);

        let $subscribe = {};

        if ($in.step === 'step_start') {
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_view',
                    'function': 'get_text'
                },
                'data': {
                    'id': 'main.body.infohub_keyboard.[my_textbox]'
                },
                'data_back': {
                    'step': 'step_start_response'
                }
            });
        }

        if ($in.step === 'step_start_response') {
            $in.step = 'step_subscribe';
            if (_Empty($in.response.text) === 'true') {
                $in.step = 'step_end';
            }
        }

        if ($in.step === 'step_subscribe') {

            $subscribe[$in.response.text] = {
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_keyboard',
                    'function': 'demo_popup'
                }
            };

            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_keyboard',
                    'function': 'subscribe'
                },
                'data': {
                    'subscriptions': $subscribe
                },
                'data_back': {'step': 'step_end'}
            });
        }

        return {
            'answer': $in.response.answer,
            'message': $in.response.message,
            'key': $in.response.text
        };
    };

    /**
     * Unsubscribe to the string in the text box
     * @version 2018-10-18
     * @since   2018-10-18
     * @author  Peter Lembke
     */
    $functions.push('gui_unsubscribe');
    const gui_unsubscribe = function ($in)
    {
        const $default = {
            'step': 'step_start',
            'response': {}
        };
        $in = _Default($default, $in);

        let $subscribe = {};

        if ($in.step === 'step_start') {
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_view',
                    'function': 'get_text'
                },
                'data': {
                    'id': 'main.body.infohub_keyboard.[my_textbox]'
                },
                'data_back': {
                    'step': 'step_subscribe'
                }
            });
        }

        if ($in.step === 'step_subscribe') {

            $subscribe[$in.response.text] = {};

            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_keyboard',
                    'function': 'unsubscribe'
                },
                'data': {
                    'subscriptions': $subscribe
                },
                'data_back': {'step': 'step_end'}
            });
        }

        return {
            'answer': $in.response.answer,
            'message': $in.response.message,
            'key': $in.response.text
        };
    };

    /**
     * Show all keyboard subscribers
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
                    'id': 'main.body.infohub_keyboard.[my_container]',
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
     * Show a popup
     * @version 2018-10-18
     * @since   2018-10-18
     * @author  Peter Lembke
     */
    $functions.push('demo_popup');
    const demo_popup = function ($in)
    {
        const $default = {
            'step': 'step_start'
        };
        $in = _Default($default, $in);

        if ($in.step === 'step_start') {
            window.alert(_Translate('Keyboard Demo popup'));
        }

        return {
            'answer': 'true',
            'message': 'done'
        };
    };

    /**
     * In setup_gui we subscribe to all key strokes, they will come to event_message and then here.
     * @version 2018-10-18
     * @since   2018-10-18
     * @author  Peter Lembke
     */
    $functions.push('all_keys_to_gui');
    const all_keys_to_gui = function ($in)
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

        if ($in.step === 'step_start') {
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_view',
                    'function': 'form_write'
                },
                'data': {
                    'id': 'main.body.infohub_keyboard',
                    'form_data': {
                        'my_textbox': {'value': $in.key }
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
     * Event message coming from the go() function.
     * Not all combinations of shift,alt,ctrl, keycode come here.
     * @version 2018-10-18
     * @since   2018-07-11
     * @author  Peter Lembke
     */
    $functions.push('event_message');
    const event_message = function ($in)
    {
        const $default = {
            'from_plugin': {'node': '', 'plugin': '', 'function': '' },
            'alt_key': 'false',
            'ctrl_key': 'false',
            'shift_key': 'false',
            'key_code': 0,
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

        if ($in.step === 'step_start') {

            const $key = _ConvertToKey($in);

            $in.data_back.key = $key;
            const $messagesOut = _GetSubscribersMessages($key);
            if (_Empty($messagesOut) === 'false') {
                if (Array.isArray($messagesOut)) {
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

function keyUp(event) {

    "use strict";

    event = event || window.event;
    if (event.keyCode < 16 || event.keyCode > 18) { // 16=shift, 17=ctrl, 18=alt
        const $alt = event.altKey, $ctrl= event.ctrlKey, $shift = event.shiftKey;
        if ($alt || $shift || $ctrl) {
            // If shift is used then it can not be alone, must be in a combination with ctrl or alt or both.
            if (($alt && !$shift && !$ctrl) || (!$alt && !$shift && $ctrl) || ($alt && !$shift && $ctrl) || ($alt && $shift && !$ctrl) || ($alt && $shift && $ctrl) || (!$alt && $shift && $ctrl)) {
                sendMessage('infohub_keyboard', {
                    'event_type': 'key_up',
                    'ctrl_key': $ctrl ? 'true' : 'false',
                    'alt_key': $alt ? 'true' : 'false',
                    'shift_key': $shift ? 'true' : 'false',
                    'key_code': event.keyCode
                });
            }
        }
    }
}
window.addEventListener('keyup',  keyUp);

//# sourceURL=infohub_keyboard.js
