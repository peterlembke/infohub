/**
 * infohub_batch
 * Park the space ship and send out a swarm of smaller ships with messages. When the last small ship returns then the space ship can continue
 *
 * @package     Infohub
 * @subpackage  infohub_batch
 * @since       2024-01-20
 * @author      Peter Lembke <info@infohub.se>
 * @license     GPL-3.0-or-later
 * @copyright   Copyright (C) 2010- Peter Lembke
 * @see         https://github.com/peterlembke/infohub/blob/main/folder/plugins/infohub/batch/infohub_batch.md Documentation
 * @link        https://infohub.se/ InfoHub main page
 */
function infohub_batch() {

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
            'class_name': 'infohub_batch',
            'note': 'Park the space ship and send out a swarm of smaller ships with messages. When the last small ship returns then the space ship can continue',
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
            'send_batch_messages_in_storage': 'normal',
            'send_batch_messages_in_memory': 'normal',
        };

        return _GetCmdFunctionsBase($list);
    };

    // ***********************************************************
    // * your class functions below, only declare with var
    // * Can only be reached through cmd()
    // ***********************************************************

    /**
     * Show how to send messages in a batch
     *
     * @param   $in
     * @returns {{}|{}|{}|*|Object|{answer: string, hub_id_array: *[], message: string}}
     * @author  Peter Lembke
     * @version 2024-01-20
     * @since   2024-01-20
     */
    $functions.push('send_batch_messages_in_storage');
    const send_batch_messages_in_storage = function ($in = {}) {

        const $default = {
            batch_message_array: [],
            from_plugin: {
                node: '',
                plugin: '',
                function: ''
            },
            data_back: {},
            response: {},
            step: 'step_batch_call'
        }
        $in = _Default($default, $in);

        const $defaultDataBack = {
            step: 'step_start',
            is_last_batch_message: 'false',
            batch_id: '',
            batch_message_id: '',
        };
        $in.data_back = _Merge($defaultDataBack, $in.data_back);

        let $batchResponseArray = [];

        if ($in['step'] === 'step_batch_call') {

            if ($in.from_plugin.node !== 'client') {
                return {
                    'answer': 'false',
                    'message': 'Only client node is allowed'
                }
            }

            let $batchMessageArray = $in.batch_message_array;

            for (let $orderNumber in $batchMessageArray) {
                let $batchMessageItem = $batchMessageArray[$orderNumber];

                const $nodeName = $batchMessageItem.to.node;
                if ($nodeName !== 'client') {
                    return {
                        'answer': 'false',
                        'message': 'Only client node is allowed. One batch message had another node'
                    }
                }

                const $pluginName = $batchMessageItem.to.plugin;
                const $partCount = _Count($pluginName.split('_'));
                if ($partCount !== 2) {
                    return {
                        'answer': 'false',
                        'message': 'Only level 1 plugins is allowed to be called. One batch message had another level'
                    }
                }

                $batchMessageItem.data_back = $batchMessageItem.data_back ?? {};
                $batchMessageItem.data_back.step = 'step_batch_call_response';

                $batchMessageArray[$orderNumber] = $batchMessageItem;
            }

            return _BatchCall({
                messages: $batchMessageArray
            });
        }

        if ($in.step === 'step_batch_call_response') {
            $in.step = 'step_store';
        }

        if ($in.step === 'step_store') {

            let $dataBack = _ByVal($in.data_back);
            delete $dataBack.step;
            delete $dataBack.batch_id;
            delete $dataBack.batch_message_id;
            delete $dataBack.is_last_batch_message;

            const $batchCallResponse = {
                response: $in.response,
                data_back: $dataBack
            };

            return _SubCall({
                to: {
                    node: 'client',
                    plugin: 'infohub_storage',
                    function: 'write'
                },
                data: {
                    path: 'infohub_batch/batch/' + $in.data_back.batch_id + '/' + $in.data_back.batch_message_id,
                    data: $batchCallResponse
                },
                data_back: {
                    step: 'step_store_response',
                    is_last_batch_message: $in.data_back.is_last_batch_message,
                    batch_id: $in.data_back.batch_id,
                },
            });
        }

        if ($in.step === 'step_store_response') {
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
                    path: 'infohub_batch/batch/' + $batchId + '/*',
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
            $batchResponseArray = Object.values($itemLookup);

            $batchResponseArray.sort((item1, item2) => {
                const $item1 = item1.data_back.sort_order ?? 0;
                const $item2 = item2.data_back.sort_order ?? 0;
                const $diff = $item1 - $item2;
                return $diff
            });
        }

        const $response = {
            answer: 'true',
            message: 'Done with the batch call',
            batch_response_array: $batchResponseArray
        };
        return $response;
    }

    /**
     * Show how to send messages in a batch
     *
     * @param   $in
     * @returns {{}|{}|{}|*|Object|{answer: string, hub_id_array: *[], message: string}}
     * @author  Peter Lembke
     * @version 2024-01-20
     * @since   2024-01-20
     */
    $functions.push('send_batch_messages_in_memory');
    const send_batch_messages_in_memory = function ($in = {}) {

        const $default = {
            batch_message_array: [],
            from_plugin: {
                node: '',
                plugin: '',
                function: ''
            },
            data_back: {},
            response: {},
            step: 'step_batch_call'
        }
        $in = _Default($default, $in);

        const $defaultDataBack = {
            step: 'step_start',
            is_last_batch_message: 'false',
            batch_id: '',
            batch_message_id: '',
        };
        $in.data_back = _Merge($defaultDataBack, $in.data_back);

        let $batchResponseArray = [];

        if ($in['step'] === 'step_batch_call') {

            if ($in.from_plugin.node !== 'client') {
                return {
                    'answer': 'false',
                    'message': 'Only client node is allowed'
                }
            }

            let $batchMessageArray = $in.batch_message_array;

            for (let $orderNumber in $batchMessageArray) {
                let $batchMessageItem = $batchMessageArray[$orderNumber];

                const $nodeName = $batchMessageItem.to.node;
                if ($nodeName !== 'client') {
                    return {
                        'answer': 'false',
                        'message': 'Only client node is allowed. One batch message had another node'
                    }
                }

                const $pluginName = $batchMessageItem.to.plugin;
                const $partCount = _Count($pluginName.split('_'));
                if ($partCount !== 2) {
                    return {
                        'answer': 'false',
                        'message': 'Only level 1 plugins is allowed to be called. One batch message had another level'
                    }
                }

                $batchMessageItem.data_back = $batchMessageItem.data_back ?? {};
                $batchMessageItem.data_back.step = 'step_batch_call_response';

                $batchMessageArray[$orderNumber] = $batchMessageItem;
            }

            return _BatchCall({
                messages: $batchMessageArray
            });
        }

        if ($in.step === 'step_batch_call_response') {
            $in.step = 'step_store';
        }

        if ($in.step === 'step_store') {

            let $dataBack = _ByVal($in.data_back);
            delete $dataBack.step;
            delete $dataBack.batch_id;
            delete $dataBack.batch_message_id;
            delete $dataBack.is_last_batch_message;

            const $batchCallResponse = {
                response: $in.response,
                data_back: $dataBack
            };

            return _SubCall({
                to: {
                    node: 'client',
                    plugin: 'infohub_storage',
                    function: 'write'
                },
                data: {
                    path: 'infohub_batch/batch/' + $in.data_back.batch_id + '/' + $in.data_back.batch_message_id,
                    data: $batchCallResponse
                },
                data_back: {
                    step: 'step_store_response',
                    is_last_batch_message: $in.data_back.is_last_batch_message,
                    batch_id: $in.data_back.batch_id,
                },
            });
        }

        if ($in.step === 'step_store_response') {
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
                    path: 'infohub_batch/batch/' + $batchId + '/*',
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
            $batchResponseArray = Object.values($itemLookup);

            $batchResponseArray.sort((item1, item2) => {
                const $item1 = item1.data_back.sort_order ?? 0;
                const $item2 = item2.data_back.sort_order ?? 0;
                const $diff = $item1 - $item2;
                return $diff
            });
        }

        const $response = {
            answer: 'true',
            message: 'Done with the batch call',
            batch_response_array: $batchResponseArray
        };
        return $response;
    }
}
//# sourceURL=infohub_batch.js