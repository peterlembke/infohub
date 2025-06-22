/**
 * infohub_demo_batch
 * Render a demo for batch messages in infohub_demo
 *
 * @package     Infohub
 * @subpackage  infohub_demo_batch
 * @since       2024-01-20
 * @author      Peter Lembke <info@infohub.se>
 * @license     GPL-3.0-or-later
 * @copyright   Copyright (C) 2010- Peter Lembke
 * @see         https://github.com/peterlembke/infohub/blob/main/folder/plugins/infohub/demo/batch/infohub_demo_batch.md Documentation
 * @link        https://infohub.se/ InfoHub main page
 */
function infohub_demo_batch() {

    'use strict';

// include "infohub_base.js"

    $functions.push('_Version');
    /**
     * Version information, used by the version function
     * @returns {{date: string, note: string, 'SPDX-License-Identifier': string, checksum: string, version: string, class_name: string, since: string, status: string}}
     * @private
     */
    const _Version = function () {
        return {
            'date': '2024-05-05',
            'since': '2024-01-20',
            'version': '1.0.0',
            'checksum': '{{checksum}}',
            'class_name': 'infohub_demo_batch',
            'note': 'Render a demo for batch messages in infohub_demo',
            'status': 'normal',
            'SPDX-License-Identifier': 'GPL-3.0-or-later',
        };
    };

    $functions.push('_GetCmdFunctions');
    /**
     * List with all public functions you can call
     * @returns {*}
     * @private
     */
    const _GetCmdFunctions = function () {
        const $list = {
            'create': 'normal',
            'click_button': 'normal',
            'click_plugin_button': 'normal',
            'click_plugin_in_memory_button': 'normal',
            'send_batch_messages': 'normal',
            'get_id': 'normal',
        };

        return _GetCmdFunctionsBase($list);
    };

    let $classTranslations = {};

    // ***********************************************************
    // * your class functions below, only declare with var
    // * Can only be reached through cmd()
    // ***********************************************************

    /**
     * Create a status indicator
     * @version 2024-05-05
     * @since   2021-07-25
     * @author  Peter Lembke
     */
    $functions.push('create');
    const create = function ($in = {}) {
        const $default = {
            'subtype': 'batch',
            'parent_box_id': '',
            'translations': {},
            'step': 'step_start',
            'response': {
                'answer': 'false',
                'message': 'Nothing to report from infohub_demo_batch',
            },
        };
        $in = _Default($default, $in);

        if ($in.step === 'step_start') {
            $classTranslations = $in.translations;

            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_render',
                    'function': 'create',
                },
                'data': {
                    'what': {
                        'title': {
                            'type': 'common',
                            'subtype': 'value',
                            'data': _Translate('DEMO_BATCH')
                        },
                        'information_box': {
                            'type': 'common',
                            'subtype': 'container',
                            'tag': 'div',
                            'class': 'container-medium',
                            'data': _Translate('THREE_MESSAGES_WILL_BE_SENT_TO_GET_HUB_ID') +
                                '. ' + _Translate('THE_LAST_MESSAGE_WILL_RETURN_THEM_ALL') +
                                '. ' + _Translate('THAT_IS_HOW_A_BATCH_CALL_WORKS')
                        },
                        'button_batch_server_major': {
                            'plugin': 'infohub_rendermajor',
                            'type': 'presentation_box',
                            'head_label': _Translate('BATCH_DEMO_ON_SERVER'),
                            'foot_text': _Translate('BATCH_DEMO_ON_SERVER_CUSTOM_CODE'),
                            'content_data': '[button_batch_server][response_box_server]',
                        },
                        'button_batch_server': {
                            'plugin': 'infohub_renderform',
                            'type': 'button',
                            'mode': 'button',
                            'button_label': _Translate('START_BATCH_DEMO_ON_SERVER'),
                            'event_data': 'batch|button|server',
                            'to_plugin': 'infohub_demo',
                            'to_function': 'click',
                        },
                        'response_box_server': {
                            'type': 'common',
                            'subtype': 'container',
                            'tag': 'div',
                            'class': 'container-pretty',
                            'data': _Translate('THE_RESPONSE_WILL_SHOW_HERE')
                        },
                        'button_batch_client_major': {
                            'plugin': 'infohub_rendermajor',
                            'type': 'presentation_box',
                            'head_label': _Translate('BATCH_DEMO_ON_CLIENT'),
                            'foot_text': _Translate('BATCH_DEMO_ON_CLIENT_CUSTOM_CODE'),
                            'content_data': '[button_batch_client][response_box_client]',
                        },
                        'button_batch_client': {
                            'plugin': 'infohub_renderform',
                            'type': 'button',
                            'mode': 'button',
                            'button_label': _Translate('START_BATCH_DEMO_HERE'),
                            'event_data': 'batch|button|client',
                            'to_plugin': 'infohub_demo',
                            'to_function': 'click',
                        },
                        'response_box_client': {
                            'type': 'common',
                            'subtype': 'container',
                            'tag': 'div',
                            'class': 'container-pretty',
                            'data': _Translate('THE_RESPONSE_WILL_SHOW_HERE')
                        },
                        'button_batch_plugin_client_major': {
                            'plugin': 'infohub_rendermajor',
                            'type': 'presentation_box',
                            'head_label': _Translate('BATCH_DEMO_ON_CLIENT_WITH_PLUGIN'),
                            'foot_text': _Translate('BATCH_DEMO_ON_CLIENT_WITH_PLUGIN'),
                            'content_data': '[button_batch_plugin_client][response_box_plugin_client]',
                        },
                        'button_batch_plugin_client': {
                            'plugin': 'infohub_renderform',
                            'type': 'button',
                            'mode': 'button',
                            'button_label': _Translate('USE_BATCH_PLUGIN_ON_CLIENT'),
                            'event_data': 'batch|plugin_button|plugin_client',
                            'to_plugin': 'infohub_demo',
                            'to_function': 'click',
                        },
                        'response_box_plugin_client': {
                            'type': 'common',
                            'subtype': 'container',
                            'tag': 'div',
                            'class': 'container-pretty',
                            'data': _Translate('THE_RESPONSE_WILL_SHOW_HERE')
                        },
                        'button_batch_plugin_server_major': {
                            'plugin': 'infohub_rendermajor',
                            'type': 'presentation_box',
                            'head_label': _Translate('BATCH_DEMO_ON_SERVER_WITH_PLUGIN'),
                            'foot_text': _Translate('BATCH_DEMO_ON_SERVER_WITH_PLUGIN'),
                            'content_data': '[button_batch_plugin_server][response_box_plugin_server]',
                        },
                        'button_batch_plugin_server': {
                            'plugin': 'infohub_renderform',
                            'type': 'button',
                            'mode': 'button',
                            'button_label': _Translate('USE_BATCH_PLUGIN_ON_SERVER'),
                            'event_data': 'batch|plugin_button|plugin_server',
                            'to_plugin': 'infohub_demo',
                            'to_function': 'click',
                        },
                        'response_box_plugin_server': {
                            'type': 'common',
                            'subtype': 'container',
                            'tag': 'div',
                            'class': 'container-pretty',
                            'data': _Translate('THE_RESPONSE_WILL_SHOW_HERE')
                        },
                        'button_batch_plugin_client_in_memory_major': {
                            'plugin': 'infohub_rendermajor',
                            'type': 'presentation_box',
                            'head_label': _Translate('BATCH_DEMO_ON_CLIENT_WITH_PLUGIN_THAT_USES_MEMORY_TO_STORE_THE_MESSAGES'),
                            'foot_text': _Translate('BATCH_DEMO_ON_CLIENT_WITH_PLUGIN_THAT_USES_MEMORY_TO_STORE_THE_MESSAGES'),
                            'content_data': '[button_batch_plugin_client_in_memory][response_box_plugin_client_in_memory]',
                        },
                        'button_batch_plugin_client_in_memory': {
                            'plugin': 'infohub_renderform',
                            'type': 'button',
                            'mode': 'button',
                            'button_label': _Translate('USE_BATCH_PLUGIN_ON_CLIENT_IN_MEMORY'),
                            'event_data': 'batch|plugin_in_memory_button|plugin_client',
                            'to_plugin': 'infohub_demo',
                            'to_function': 'click',
                        },
                        'response_box_plugin_client_in_memory': {
                            'type': 'common',
                            'subtype': 'container',
                            'tag': 'div',
                            'class': 'container-pretty',
                            'data': _Translate('THE_RESPONSE_WILL_SHOW_HERE')
                        },
                        'button_batch_plugin_server_in_memory_major': {
                            'plugin': 'infohub_rendermajor',
                            'type': 'presentation_box',
                            'head_label': _Translate('BATCH_DEMO_ON_SERVER_WITH_PLUGIN_THAT_USES_MEMORY_TO_STORE_THE_MESSAGES'),
                            'foot_text': _Translate('BATCH_DEMO_ON_SERVER_WITH_PLUGIN_THAT_USES_MEMORY_TO_STORE_THE_MESSAGES'),
                            'content_data': '[button_batch_plugin_server_in_memory][response_box_plugin_server_in_memory]',
                        },
                        'button_batch_plugin_server_in_memory': {
                            'plugin': 'infohub_renderform',
                            'type': 'button',
                            'mode': 'button',
                            'button_label': _Translate('USE_BATCH_PLUGIN_ON_SERVER_IN_MEMORY'),
                            'event_data': 'batch|plugin_in_memory_button|plugin_server',
                            'to_plugin': 'infohub_demo',
                            'to_function': 'click',
                        },
                        'response_box_plugin_server_in_memory': {
                            'type': 'common',
                            'subtype': 'container',
                            'tag': 'div',
                            'class': 'container-pretty',
                            'data': _Translate('THE_RESPONSE_WILL_SHOW_HERE')
                        }

                    },
                    'how': {
                        'mode': 'one box',
                        'text': '[information_box][button_batch_server_major][button_batch_client_major][button_batch_plugin_client_major][button_batch_plugin_server_major][button_batch_plugin_client_in_memory_major][button_batch_plugin_server_in_memory_major]',
                    },
                    'where': {
                        'box_id': $in.parent_box_id + '.demo',
                        'max_width': 1024,
                        'scroll_to_box_id': 'true',
                    },
                    'cache_key': 'status',
                },
                'data_back': {
                    'step': 'step_end',
                },
            });

        }

        return {
            'answer': $in.response.answer,
            'message': $in.response.message,
        };
    };

    /**
     * All button clicks come here
     * @version 2024-05-05
     * @since   2021-08-05
     * @author  Peter Lembke
     */
    $functions.push('click_button');
    const click_button = function ($in = {}) {
        const $default = {
            'type': '', // button
            'event_type': '', // click
            'event_data': '', // server or client
            'box_id': '', // example string: 120202
            'step': '',
            'response': {
                'answer': 'false',
                'message': '',
                'hub_id_array': []
            },
        };
        $in = _Default($default, $in);

        if ($in.step === '') {
            $in.step = 'step_call_' + $in.event_data;
        }

        if ($in.step === 'step_call_client') {

            const $boxId = $in.box_id;

            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_demo_batch',
                    'function': 'send_batch_messages'
                },
                'data': {
                    'box_id': $boxId,
                },
                'data_back': {
                    'box_id': $boxId,
                    'event_data': $in.event_data,
                    'step': 'step_call_response',                }
            });
        }

        if ($in.step === 'step_call_plugin_client') {

            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_batch',
                    'function': 'send_batch_messages'
                },
                'data': {
                    'batch_message_array': [
                        {
                            to: {node: 'client', plugin: 'infohub_checksum', function: 'calculate_checksum'},
                            data: {type: 'md5', data: 'Hello World 1'},
                        },
                        {
                            to: {node: 'client', plugin: 'infohub_checksum', function: 'calculate_checksum'},
                            data: {type: 'md5', data: 'Hello World 2'}
                        },
                        {
                            to: {node: 'client', plugin: 'infohub_checksum', function: 'calculate_checksum'},
                            data: {type: 'md5', data: 'Hello World 3'}
                        }
                    ]
                },
                'data_back': {
                    'box_id': $in.box_id,
                    'event_data': $in.event_data,
                    'step': 'step_call_response',
                }
            });
        }

        if ($in.step === 'step_call_server') {

            const $boxId = $in.box_id;

            let $callServer = _SubCall({
                'to': {
                    'node': 'server',
                    'plugin': 'infohub_demo',
                    'function': 'send_batch_messages'
                },
                'data': {
                    'box_id': $boxId,
                },
                'data_back': {
                    'step': 'step_end',
                }
            });

            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_demo',
                    'function': 'call_server',
                },
                'data': {
                    'send_data': $callServer,
                },
                'data_back': {
                    'box_id': $boxId,
                    'event_data': $in.event_data,
                    'step': 'step_call_response',
                },
            });
        }

        if ($in.step === 'step_call_response') {

            let $text = $in.response.hub_id_array.join('<br>');

            if ($in.response.answer === 'false') {
                $text = $in.response.message;
            }

            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_view',
                    'function': 'set_text',
                },
                'data': {
                    'id': $in.box_id + '_response_box_' + $in.event_data, // example: 120202_response_box_server
                    'text': $text,
                },
                'data_back': {
                    'step': 'step_end',
                },
            });
        }

        return {
            'answer': 'true',
            'message': 'Done'
        };
    };

    /**
     * Some button clicks come here
     * @version 2024-05-05
     * @since   2024-05-05
     * @author  Peter Lembke
     */
    $functions.push('click_plugin_button');
    const click_plugin_button = function ($in = {}) {
        const $default = {
            'type': '', // button
            'event_type': '', // click
            'event_data': '', // plugin_server or plugin_client
            'box_id': '', // example string: 120202
            'step': '',
            'response': {
                'answer': 'false',
                'message': '',
                'batch_response_array': []
            },
        };
        $in = _Default($default, $in);

        if ($in.step === '') {
            $in.step = 'step_call_' + $in.event_data;
        }

        if ($in.step === 'step_call_plugin_client') {

            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_batch',
                    'function': 'send_batch_messages_in_storage'
                },
                'data': {
                    'batch_message_array': [
                        {
                            to: {node: 'client', plugin: 'infohub_checksum', function: 'calculate_checksum'},
                            data: {
                                type: 'md5',
                                value: 'Hello World 1 - Batch'
                            },
                            data_request: ['answer', 'message', 'value', 'checksum'],
                            data_back: {
                                'sort_order': 1,
                                'my_message': 'Batch message #1'
                            }
                        },
                        {
                            to: {node: 'client', plugin: 'infohub_checksum', function: 'calculate_checksum'},
                            data: {
                                type: 'md5',
                                value: 'Hello World 2 - Batch',
                            },
                            data_request: ['answer', 'message', 'value', 'checksum'],
                            data_back: {
                                'sort_order': 2,
                                'my_message': 'Batch message #2'
                            }
                        },
                        {
                            to: {node: 'client', plugin: 'infohub_checksum', function: 'calculate_checksum'},
                            data: {
                                type: 'md5',
                                value: 'Hello World 3 - Batch',
                            },
                            data_request: ['answer', 'message', 'value', 'checksum'],
                            data_back: {
                                'sort_order': 3,
                                'my_message': 'Batch message #3'
                            }
                        }
                    ]
                },
                'data_back': {
                    'box_id': $in.box_id,
                    'event_data': $in.event_data,
                    'step': 'step_call_response',
                }
            });
        }

        if ($in.step === 'step_call_plugin_server') {

            let $callServer = _SubCall({
                'to': {
                    'node': 'server',
                    'plugin': 'infohub_demo',
                    'function': 'send_batch_messages_with_plugin'
                },
                'data': {},
                'data_back': {
                    'step': 'step_end',
                }
            });

            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_demo',
                    'function': 'call_server',
                },
                'data': {
                    'send_data': $callServer,
                },
                'data_back': {
                    'box_id': $in.box_id,
                    'event_data': $in.event_data,
                    'step': 'step_call_response',
                },
            });
        }

        if ($in.step === 'step_call_response') {

            const $batchResponseArray = $in.response.batch_response_array;

            let $dataArray = [];
            for (let $orderNumber in $batchResponseArray) {
                const $item = $batchResponseArray[$orderNumber];
                const $myTextString = $item.response.value + ' = ' + $item.response.checksum + ' (data_back: ' + $item.data_back.my_message + ' sort_order: '+$item.data_back.sort_order+')';
                $dataArray.push($myTextString);
            }

            let $text = $dataArray.join('<br>');

            if ($in.response.answer === 'false') {
                $text = $in.response.message;
            }

            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_view',
                    'function': 'set_text',
                },
                'data': {
                    'id': $in.box_id + '_response_box_' + $in.event_data, // example: 120202_response_box_server
                    'text': $text,
                },
                'data_back': {
                    'step': 'step_end',
                },
            });
        }

        return {
            'answer': 'true',
            'message': 'Done'
        };
    };

    /**
     * Some button clicks come here
     * @version 2024-05-19
     * @since   2024-05-19
     * @author  Peter Lembke
     */
    $functions.push('click_plugin_in_memory_button');
    const click_plugin_in_memory_button = function ($in = {}) {
        const $default = {
            'type': '', // button
            'event_type': '', // click
            'event_data': '', // plugin_server or plugin_client
            'box_id': '', // example string: 120202
            'step': '',
            'response': {
                'answer': 'false',
                'message': '',
                'batch_response_array': []
            },
        };
        $in = _Default($default, $in);

        if ($in.step === '') {
            $in.step = 'step_call_' + $in.event_data;
        }

        if ($in.step === 'step_call_plugin_client') {

            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_batch',
                    'function': 'send_batch_messages_in_memory'
                },
                'data': {
                    'batch_message_array': [
                        {
                            to: {node: 'client', plugin: 'infohub_checksum', function: 'calculate_checksum'},
                            data: {
                                type: 'md5',
                                value: 'Hello World 1 - Batch'
                            },
                            data_request: ['answer', 'message', 'value', 'checksum'],
                            data_back: {
                                'sort_order': 1,
                                'my_message': 'Batch message #1'
                            }
                        },
                        {
                            to: {node: 'client', plugin: 'infohub_checksum', function: 'calculate_checksum'},
                            data: {
                                type: 'md5',
                                value: 'Hello World 2 - Batch',
                            },
                            data_request: ['answer', 'message', 'value', 'checksum'],
                            data_back: {
                                'sort_order': 2,
                                'my_message': 'Batch message #2'
                            }
                        },
                        {
                            to: {node: 'client', plugin: 'infohub_checksum', function: 'calculate_checksum'},
                            data: {
                                type: 'md5',
                                value: 'Hello World 3 - Batch',
                            },
                            data_request: ['answer', 'message', 'value', 'checksum'],
                            data_back: {
                                'sort_order': 3,
                                'my_message': 'Batch message #3'
                            }
                        }
                    ]
                },
                'data_back': {
                    'box_id': $in.box_id,
                    'event_data': $in.event_data,
                    'step': 'step_call_response',
                }
            });
        }

        if ($in.step === 'step_call_plugin_server') {

            let $callServer = _SubCall({
                'to': {
                    'node': 'server',
                    'plugin': 'infohub_demo',
                    'function': 'send_batch_messages_with_plugin_in_memory'
                },
                'data': {},
                'data_back': {
                    'step': 'step_end',
                }
            });

            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_demo',
                    'function': 'call_server',
                },
                'data': {
                    'send_data': $callServer,
                },
                'data_back': {
                    'box_id': $in.box_id,
                    'event_data': $in.event_data,
                    'step': 'step_call_response',
                },
            });
        }

        if ($in.step === 'step_call_response') {

            const $batchResponseArray = $in.response.batch_response_array;

            let $dataArray = [];
            for (let $orderNumber in $batchResponseArray) {
                const $item = $batchResponseArray[$orderNumber];
                const $myTextString = $item.response.value + ' = ' + $item.response.checksum + ' (data_back: ' + $item.data_back.my_message + ' sort_order: '+$item.data_back.sort_order+')';
                $dataArray.push($myTextString);
            }

            let $text = $dataArray.join('<br>');

            if ($in.response.answer === 'false') {
                $text = $in.response.message;
            }

            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_view',
                    'function': 'set_text',
                },
                'data': {
                    'id': $in.box_id + '_response_box_' + $in.event_data + '_in_memory', // example: 120202_response_box_plugin_server_in_memory
                    'text': $text,
                },
                'data_back': {
                    'step': 'step_end',
                },
            });
        }

        return {
            'answer': 'true',
            'message': 'Done'
        };
    };

    /**
     * Show how to send messages in a batch
     *
     * @param   $in
     * @returns {{}|{}|{}|*|Object|{answer: string, hub_id_array: *[], message: string}}
     * @author  Peter Lembke
     * @version 2024-01-20
     * @since   2024-01-20
     */
    $functions.push('send_batch_messages');
    const send_batch_messages = function ($in = {}) {

        const $default = {
            from_plugin: {node: '', plugin: '', function: ''},
            data_back: {
                step: 'step_start',
                is_last_batch_message: 'false',
                batch_id: '',
                batch_message_id: '',
            },
            response: {
                answer: 'false',
                message: 'An error occurred',
                hub_id: '',
                items: [],
            },
            step: 'step_get_id'
        }
        $in = _Default($default, $in);

        let $hubIdArray = [];

        if ($in['step'] === 'step_get_id') {

            const $messages = [
                {
                    to: {node: 'client', plugin: 'infohub_demo_batch', function: 'get_id'},
                    data: {},
                    data_back: {step: 'step_get_id_response'}
                },
                {
                    to: {node: 'client', plugin: 'infohub_demo_batch', function: 'get_id'},
                    data: {},
                    data_back: {step: 'step_get_id_response'}
                },
                {
                    to: {node: 'client', plugin: 'infohub_demo_batch', function: 'get_id'},
                    data: {},
                    data_back: {step: 'step_get_id_response'}
                }
            ];

            return _BatchCall({
                messages: $messages
            });
        }

        if ($in.step === 'step_get_id_response') {
            $in.step = 'step_store_id';
            if ($in.response.answer === 'false') {
                $in.step = 'step_end';
            }
        }

        if ($in.step === 'step_store_id') {

            const $hubId = $in.response.hub_id;

            return _SubCall({
                to: {
                    node: 'client',
                    plugin: 'infohub_storage',
                    function: 'write'
                },
                data: {
                    path: 'infohub_demo_batch/batch/' + $in.data_back.batch_id + '/' + $in.data_back.batch_message_id,
                    data: {
                        hub_id: $hubId
                    }
                },
                data_back: {
                    step: 'step_store_id_response',
                    is_last_batch_message: $in.data_back.is_last_batch_message,
                    batch_id: $in.data_back.batch_id,
                },
            });
        }

        if ($in.step === 'step_store_id_response') {
            $in.step = 'step_end';
            let $isLastBatchMessage = _GetData({
                name: 'data_back/is_last_batch_message',
                default: 'false',
                data: $in
            });
            if ($isLastBatchMessage === 'true') {
                $in.step = 'step_is_last_batch_message';
            }
        }

        if ($in.step === 'step_is_last_batch_message') {
            let $batchId = _GetData({
                name: 'data_back/batch_id',
                default: '',
                data: $in
            });

            return _SubCall({
                to: {
                    node: 'client',
                    plugin: 'infohub_storage',
                    function: 'read_pattern'
                },
                data: {
                    path: 'infohub_demo_batch/batch/' + $batchId + '/*',
                    delete_after_reading: 'true' // Clean up the storage
                },
                data_back: {
                    step: 'step_is_last_batch_message_response',
                },
            });
        }

        if ($in.step === 'step_is_last_batch_message_response') {
            $in.step = 'step_end';
            let $itemLookup = _GetData({
                name: 'response/items',
                default: [],
                data: $in,
            });
            $hubIdArray = _ArrayColumn($itemLookup, 'hub_id');
        }

        let $response = {
            answer: 'true',
            message: 'Done with the demo',
            hub_id_array: $hubIdArray
        };
        return $response;
    }

    /**
     * Show how to send messages in a batch
     *
     * @param $in
     * @returns {{hub_id: {answer: string, data: string, message: string}, answer: string, message: string}}     * @author  Peter Lembke
     * @version 2024-01-20
     * @since   2024-01-20
     */
    $functions.push('get_id');
   const get_id = function ($in = {})
    {
        const $default = {
            from_plugin: {node: '', plugin: '', function: ''},
            data: {},
            data_back: {},
            step: 'step_get_id',
        };
        $in = _Default($default, $in);

        let $hubId = _HubId();

        let $response = {
            answer: 'true',
            message: 'Here is the answer',
            hub_id: $hubId
        };
        return $response;
    }

}

//# sourceURL=infohub_demo_batch.js