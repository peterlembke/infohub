<?php
/**
 * Sends out short tail messages, wait for the last one to return,
 * put together all answers and return them
 *
 * @package     Infohub
 * @subpackage  infohub_batch
 */

declare(strict_types=1);
if (basename(__FILE__) == basename($_SERVER['SCRIPT_FILENAME'])) {
    exit; // This file must be included, not called directly
}

/**
 * Sends out short tail messages, wait for the last one to return,
 * put together all answers and return them
 *
 * This plugin is a part of the InfoHub system.
 * Working on the batch system since 2021. Working name was Darkhold.
 *
 * @author      Peter Lembke <info@infohub.se>
 * @version     2024-05-05
 * @since       2021-10-10
 * @copyright   Copyright (c) 2021, Peter Lembke
 * @license     https://opensource.org/licenses/gpl-license.php GPL-3.0-or-later
 * @see         https://github.com/peterlembke/infohub/blob/master/folder/plugins/infohub/batch/infohub_batch.md Documentation
 * @link        https://infohub.se/ InfoHub main page
 */
class infohub_batch extends infohub_base
{

    /**
     * Array to store the batch messages in memory
     * Never ever do things like this in your own plugins. They must be stateless.
     * Only the system plugins are allowed to do this.
     *
     * @var array
     */
    protected array $sendBatchMessagesInMemory = [];

    /**
     * Version information for this plugin
     * @return  string[]
     * @since   2021-10-10
     * @author  Peter Lembke
     * @version 2021-10-10
     */
    protected function _Version(): array
    {
        return [
            'date' => '2024-05-19',
            'since' => '2021-10-10',
            'version' => '1.0.0',
            'class_name' => 'infohub_batch',
            'checksum' => '{{checksum}}',
            'note' => 'Park the space ship and send out a swarm of smaller ships with messages. When the last small ship returns then the space ship can continue',
            'status' => 'normal',
            'SPDX-License-Identifier' => 'GPL-3.0-or-later',
            'user_role' => 'user'
        ];
    }

    /**
     * Public functions in this plugin
     *
     * @return array
     * @author  Peter Lembke
     * @version 2021-10-10
     * @since   2021-10-10
     */
    protected function _GetCmdFunctions(): array
    {
        $list = [
            'send_batch_messages_in_storage' => 'normal',
            'send_batch_messages_in_memory' => 'normal',
        ];

        return parent::_GetCmdFunctionsBase($list);
    }

    /**
     * Send messages in a batch and get all results back
     *
     * Uses the Storage to store the batch messages and the responses
     * Useful if you have a lot of messages to send, and it does not matter if it takes some time
     *
     * @param  array  $in
     * @return array
     * @author  Peter Lembke
     * @version 2024-05-05
     * @since   2024-01-20
     */
    protected function send_batch_messages_in_storage(array $in = []): array
    {
        $default = [
            'batch_message_array' => [],
            'from_plugin' => [
                'node' => '',
                'plugin' => '',
                'function' => ''
            ],
            'data_back' => [], // See $defaultDataBack below
            'response' => [],
            'step' => 'step_batch_call',
        ];
        $in = $this->_Default($default, $in);

        $defaultDataBack = [
            'step' => 'step_end',
            'is_last_batch_message' => 'false',
            'batch_id' => '',
            'batch_message_id' => '',
        ];

        $in['data_back'] = $this->_Merge($defaultDataBack, $in['data_back']);

        $batchResponseArray = [];

        if ($in['step'] === 'step_batch_call') {

            if ($in['from_plugin']['node'] !== 'server') {
                return [
                    'answer' => 'false',
                    'message' => 'Only server node is allowed',
                ];
            }

            $batchMessageArray = $in['batch_message_array'];

            foreach ($batchMessageArray as $orderNumber => $batchMessageItem) {
                $nodeName = $batchMessageItem['to']['node'];
                if ($nodeName !== 'server') {
                    return [
                        'answer' => 'false',
                        'message' => 'Only server node is allowed. One batch message had another node',
                    ];
                }

                $pluginName = $batchMessageItem['to']['plugin'];
                $partCount = count(explode('_', $pluginName));
                if ($partCount !== 2) {
                    return [
                        'answer' => 'false',
                        'message' => 'Only level 1 plugins is allowed to be called. One batch message had another level',
                    ];
                }

                $batchMessageItem['data_back']['step'] = 'step_batch_call_response';

                $batchMessageArray[$orderNumber] = $batchMessageItem;
            }

            return $this->_BatchCall([
                'messages' => $batchMessageArray
            ]);
        }

        if ($in['step'] === 'step_batch_call_response') {
            $in['step'] = 'step_store';
            if ($in['response']['answer'] === 'false') {
                $in['step'] = 'step_end';
            }
        }

        if ($in['step'] === 'step_store') {

            $dataBack = $in['data_back'];
            unset($dataBack['step']);
            unset($dataBack['batch_id']);
            unset($dataBack['batch_message_id']);
            unset($dataBack['is_last_batch_message']);

            $batchCallResponse = [
                'response' => $in['response'],
                'data_back' => $dataBack,
            ];

            return $this->_SubCall([
                'to' => [
                    'node' => 'server',
                    'plugin' => 'infohub_storage',
                    'function' => 'write'
                ],
                'data' => [
                    'path' => 'infohub_batch/batch/' . $in['data_back']['batch_id'] . '/' . $in['data_back']['batch_message_id'],
                    'data' => $batchCallResponse
                ],
                'data_back' => [
                    'step' => 'step_store_response',
                    'is_last_batch_message' => $in['data_back']['is_last_batch_message'],
                    'batch_id' => $in['data_back']['batch_id'],
                ],
            ]);
        }

        if ($in['step'] === 'step_store_response') {
            $in['step'] = 'step_end';
            $isLastBatchMessage = $this->_GetData([
                'name' => 'data_back/is_last_batch_message',
                'default' => 'false',
                'data' => $in,
            ]);
            if ($isLastBatchMessage === 'true') {
                $in['step'] = 'step_is_last_batch_message';
            }
        }

        if ($in['step'] === 'step_is_last_batch_message') {
            $batchId = $this->_GetData([
                'name' => 'data_back/batch_id',
                'default' => '',
                'data' => $in,
            ]);

            return $this->_SubCall([
                'to' => [
                    'node' => 'server',
                    'plugin' => 'infohub_storage',
                    'function' => 'read_pattern'
                ],
                'data' => [
                    'path' => 'infohub_batch/batch/' . $batchId . '/*',
                    'delete_after_reading' => 'true' // Clean up the storage
                ],
                'data_back' => [
                    'step' => 'step_is_last_batch_message_response',
                ],
            ]);
        }

        if ($in['step'] === 'step_is_last_batch_message_response') {
            $in['step'] = 'step_end';
            $itemLookup = (array) $this->_GetData([
                'name' => 'response/items',
                'default' => [],
                'data' => $in,
            ]);
            $batchResponseArray = array_values($itemLookup);

            usort($batchResponseArray, function ($item1, $item2) {
                $item1 = $item1['data_back']['sort_order'] ?? 0;
                $item2 = $item2['data_back']['sort_order'] ?? 0;
                $diff = $item1 <=> $item2;
                return  $diff;
            });
        }

        $response = [
            'answer' => 'true',
            'message' => 'Done with the batch call',
            'batch_response_array' => $batchResponseArray
        ];
        return $response;
    }

    /**
     * Send messages in a batch and get all results back
     *
     * Uses a class variable in this class to store the batch messages and the responses
     * Useful if you have few messages and speed is critical
     *
     * @param  array  $in
     * @return array
     * @author  Peter Lembke
     * @version 2024-05-05
     * @since   2024-01-20
     */
    protected function send_batch_messages_in_memory(array $in = []): array
    {
        $default = [
            'batch_message_array' => [],
            'from_plugin' => [
                'node' => '',
                'plugin' => '',
                'function' => ''
            ],
            'data_back' => [], // See $defaultDataBack below
            'response' => [],
            'step' => 'step_batch_call',
        ];
        $in = $this->_Default($default, $in);

        $defaultDataBack = [
            'step' => 'step_end',
            'is_last_batch_message' => 'false',
            'batch_id' => '',
            'batch_message_id' => '',
        ];

        $in['data_back'] = $this->_Merge($defaultDataBack, $in['data_back']);

        $batchResponseArray = [];

        if ($in['step'] === 'step_batch_call') {

            if ($in['from_plugin']['node'] !== 'server') {
                return [
                    'answer' => 'false',
                    'message' => 'Only server node is allowed',
                ];
            }

            $batchMessageArray = $in['batch_message_array'];

            foreach ($batchMessageArray as $orderNumber => $batchMessageItem) {
                $nodeName = $batchMessageItem['to']['node'];
                if ($nodeName !== 'server') {
                    return [
                        'answer' => 'false',
                        'message' => 'Only server node is allowed. One batch message had another node',
                    ];
                }

                $pluginName = $batchMessageItem['to']['plugin'];
                $partCount = count(explode('_', $pluginName));
                if ($partCount !== 2) {
                    return [
                        'answer' => 'false',
                        'message' => 'Only level 1 plugins is allowed to be called. One batch message had another level',
                    ];
                }

                $batchMessageItem['data_back']['step'] = 'step_batch_call_response';

                $batchMessageArray[$orderNumber] = $batchMessageItem;
            }

            return $this->_BatchCall([
                'messages' => $batchMessageArray
            ]);
        }

        if ($in['step'] === 'step_batch_call_response') {
            $in['step'] = 'step_store';
            if ($in['response']['answer'] === 'false') {
                $in['step'] = 'step_end';
            }
        }

        if ($in['step'] === 'step_store') {

            $dataBack = $in['data_back'];
            unset($dataBack['step']);
            unset($dataBack['batch_id']);
            unset($dataBack['batch_message_id']);
            unset($dataBack['is_last_batch_message']);

            $batchCallResponse = [
                'response' => $in['response'],
                'data_back' => $dataBack,
            ];

            $batchId = $in['data_back']['batch_id'];
            $batchMessageId = $in['data_back']['batch_message_id'];
            $this->sendBatchMessagesInMemory[$batchId][$batchMessageId] = $batchCallResponse;

            $isLastBatchMessage = $this->_GetData([
                'name' => 'data_back/is_last_batch_message',
                'default' => 'false',
                'data' => $in,
            ]);

            if ($isLastBatchMessage === 'true') {
                $in['step'] = 'step_is_last_batch_message';
            }
        }

        if ($in['step'] === 'step_is_last_batch_message') {
            $batchId = $in['data_back']['batch_id'];
            $itemLookup = $this->sendBatchMessagesInMemory[$batchId];
            $batchResponseArray = array_values($itemLookup);

            usort($batchResponseArray, function ($item1, $item2) {
                $item1 = $item1['data_back']['sort_order'] ?? 0;
                $item2 = $item2['data_back']['sort_order'] ?? 0;
                $diff = $item1 <=> $item2;
                return  $diff;
            });
        }

        $response = [
            'answer' => 'true',
            'message' => 'Done with the batch call',
            'batch_response_array' => $batchResponseArray
        ];
        return $response;
    }
}
