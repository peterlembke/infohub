<?php
/**
 * Sessions
 *
 * Handle sessions. Both incoming and outgoing.
 *
 * @package     Infohub
 * @subpackage  infohub_plugin
 */

declare(strict_types=1);
if (basename(__FILE__) == basename($_SERVER["SCRIPT_FILENAME"])) {
    exit; // This file must be included, not called directly
}

/**
 * Sessions
 *
 * Handle sessions. Both incoming and outgoing.
 *
 * @author      Peter Lembke <info@infohub.se>
 * @version     2020-07-07
 * @since       2020-01-10
 * @copyright   Copyright (c) 2020, Peter Lembke
 * @license     https://opensource.org/licenses/gpl-license.php GPL-3.0-or-later
 * @see         https://github.com/peterlembke/infohub/blob/master/folder/plugins/infohub/session/infohub_session.md Documentation
 * @link        https://infohub.se/ InfoHub main page
 */
class infohub_session extends infohub_base
{

    const PREFIX = 'session';

    /**
     * Version information for this plugin
     * @return  string[]
     * @since   2020-01-10
     * @author  Peter Lembke
     * @version 2020-07-07
     */
    protected function _Version(): array
    {
        return [
            'date' => '2020-01-10',
            'since' => '2020-01-10',
            'version' => '1.0.0',
            'class_name' => 'infohub_session',
            'checksum' => '{{checksum}}',
            'note' => 'Handle sessions. Both incoming and outgoing.',
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
     * @version 2020-07-07
     * @since   2020-01-10
     */
    protected function _GetCmdFunctions(): array
    {
        $list = [
            'responder_start_session' => 'normal',
            'initiator_store_session_data' => 'normal',
            'initiator_end_session' => 'normal',
            'responder_end_session' => 'normal',
            'delete_session_data' => 'normal',
            'initiator_calculate_sign_code' => 'normal',
            'responder_calculate_sign_code' => 'normal',
            'initiator_verify_sign_code' => 'normal',
            'responder_verify_sign_code' => 'normal',
            'responder_check_session_valid' => 'normal',
            'get_banned_until' => 'normal',
            'set_banned_until' => 'normal',
            'check_banned_until' => 'normal'
        ];

        return parent::_GetCmdFunctionsBase($list);
    }

    /**
     * Create a new session and save it
     * Create a session_id. Crete a session_created_at. path = infohub_session/session/{session_id}
     * Store associated array with initiator_user_name, left_overs, session_id, session_created_at
     * @param array $in
     * @return array
     * @author Peter Lembke
     * @version 2020-01-10
     * @since 2020-01-10
     */
    protected function responder_start_session(array $in = []): array
    {
        $default = [
            'initiator_user_name' => '', // user_{hub_id}
            'left_overs' => '', // Left-overs from the login. Never exposed outside this plugin.
            'role_list' => [],
            'step' => 'step_create_session_id',
            'from_plugin' => [
                'node' => '',
                'plugin' => ''
            ],
            'response' => [],
            'data_back' => [
                'session_id' => '',
                'session_created_at' => '',
                'banned_until' => 0.0
            ],
            'config' => [
                'ban_time_seconds' => 0.0
            ]
        ];
        $in = $this->_Default($default, $in);

        if ($in['from_plugin']['plugin'] !== 'infohub_login') {
            $in['response']['message'] = 'I only accept messages from plugin: infohub_login';
            $in['step'] = 'step_end';
        }

        if ($in['from_plugin']['node'] !== 'server') {
            $in['response']['message'] = 'I only accept messages from node: server';
            $in['step'] = 'step_end';
        }

        if ($in['step'] === 'step_create_session_id') {
            return $this->_SubCall(
                [
                    'to' => [
                        'node' => 'server',
                        'plugin' => 'infohub_uuid',
                        'function' => 'uuid'
                    ],
                    'data' => [],
                    'data_back' => [
                        'initiator_user_name' => $in['initiator_user_name'],
                        'left_overs' => $in['left_overs'],
                        'role_list' => $in['role_list'],
                        'config' => $in['config'],
                        'banned_until' => 0.0,
                        'step' => 'step_create_session_id_response'
                    ]
                ]
            );
        }

        if ($in['step'] === 'step_create_session_id_response') {
            $default = [
                'answer' => 'false',
                'message' => '',
                'data' => '', // The uuid is returned as a string
                'post_exist' => 'false'
            ];
            $in['response'] = $this->_Default($default, $in['response']);

            if ($in['response']['answer'] === 'true') {
                $in['step'] = 'step_store_session_data';
            }
        }

        if ($in['step'] === 'step_store_session_data') {
            $sessionId = self::PREFIX . '_' . $in['response']['data'];
            $sessionCreatedAt = $this->_CreatedAt();
            $path = 'infohub_session/session/' . $sessionId;
            $bannedUntil = $this->_MicroTime() + $in['config']['ban_time_seconds'];

            return $this->_SubCall(
                [
                    'to' => [
                        'node' => 'server',
                        'plugin' => 'infohub_storage',
                        'function' => 'write'
                    ],
                    'data' => [
                        'path' => $path,
                        'data' => [
                            'initiator_user_name' => $in['initiator_user_name'],
                            'left_overs' => $in['left_overs'],
                            'session_id' => $sessionId,
                            'session_created_at' => $sessionCreatedAt,
                            'role_list' => $in['role_list'],
                            'banned_until' => $bannedUntil,
                            'pending_delete' => 'false'
                        ]
                    ],
                    'data_back' => [
                        'initiator_user_name' => $in['initiator_user_name'],
                        'left_overs' => $in['left_overs'],
                        'session_id' => $sessionId,
                        'session_created_at' => $sessionCreatedAt,
                        'banned_until' => $bannedUntil,
                        'step' => 'step_store_session_data_response'
                    ]
                ]
            );
        }

        if ($in['step'] === 'step_store_session_data_response') {
            $default = [
                'answer' => 'false',
                'message' => '',
                'data' => [],
                'post_exist' => 'false'
            ];
            $in['response'] = $this->_Default($default, $in['response']);

            if ($in['response']['post_exist'] === 'true') {
                $in['response']['message'] = 'Session created';
            }
        }

        return [
            'answer' => $in['response']['answer'],
            'message' => $in['response']['message'],
            'initiator_user_name' => $in['initiator_user_name'], // user_{hub_id}
            'session_id' => $in['data_back']['session_id'], // session_{hub_id}
            'session_created_at' => $in['data_back']['session_created_at'], // micro time with 3 decimals
            'logged_in' => $in['response']['post_exist'],
            'banned_until' => $in['data_back']['banned_until']
        ];
    }

    /**
     * Get session data and store it
     * path = infohub_session/node/{node}
     * Store associated array with initiator_user_name, left_overs, session_id, session_created_at
     * @param array $in
     * @return array
     * @author Peter Lembke
     * @version 2020-06-12
     * @since 2020-01-10
     */
    protected function initiator_store_session_data(array $in = []): array
    {
        $default = [
            'node' => '', // name of the node the initiator use to send data to the responder
            'initiator_user_name' => '', // user_{hub_id}
            'session_id' => '', //session_{hub_id}
            'session_created_at' => '', // micro time with 3 decimals
            'left_overs' => '', // Left-overs from the login. Never exposed outside this plugin
            'banned_until' => 0.0,
            'step' => 'step_store_session_data',
            'from_plugin' => [
                'node' => ''
            ],
            'response' => [
                'answer' => 'false',
                'message' => ''
            ]
        ];
        $in = $this->_Default($default, $in);

        if ($in['step'] === 'step_store_session_data') {
            $path = 'infohub_session/node/' . $in['node'];

            return $this->_SubCall(
                [
                    'to' => [
                        'node' => 'server',
                        'plugin' => 'infohub_storage',
                        'function' => 'write'
                    ],
                    'data' => [
                        'path' => $path,
                        'data' => [
                            'initiator_user_name' => $in['initiator_user_name'],
                            'left_overs' => $in['left_overs'],
                            'session_id' => $in['session_id'],
                            'session_created_at' => $in['session_created_at'],
                            'banned_until' => $in['banned_until']
                        ]
                    ],
                    'data_back' => [
                        'initiator_user_name' => $in['initiator_user_name'],
                        'left_overs' => $in['left_overs'],
                        'session_id' => $in['session_id'],
                        'session_created_at' => $in['session_created_at'],
                        'banned_until' => $in['banned_until'],
                        'step' => 'step_store_session_data_response'
                    ]
                ]
            );
        }

        if ($in['step'] === 'step_store_session_data_response') {
            // Not needed
        }

        return [
            'answer' => $in['response']['answer'],
            'message' => $in['response']['message'],
            'ok' => $in['response']['answer']
        ];
    }

    /**
     * Remove the session data on the responder node and on the initiator node
     * Get the session data. Call the other node responder_end_session
     * If success then delete the data in path infohub_session/node/{node}
     * @param array $in
     * @return array
     * @author Peter Lembke
     * @version 2020-01-11
     * @since 2020-01-10
     */
    protected function initiator_end_session(array $in = []): array
    {
        $default = [
            'node' => '', // name of the node to end the session on both sides.
            'step' => 'step_get_session_data',
            'response' => [
                'data' => [
                    'initiator_user_name' => '',
                    'left_overs' => '',
                    'session_id' => '',
                    'session_created_at' => '',
                ],
                'answer' => 'false',
                'message' => 'Nothing to report'
            ],
            'from_plugin' => [
                'node' => ''
            ]
        ];
        $in = $this->_Default($default, $in);

        $sessionId = '';

        if ($in['step'] === 'step_get_session_data') {
            return $this->_SubCall(
                [
                    'to' => [
                        'node' => 'server',
                        'plugin' => 'infohub_storage',
                        'function' => 'read'
                    ],
                    'data' => [
                        'path' => 'infohub_session/node/' . $in['node']
                    ],
                    'data_back' => [
                        'node' => $in['node'],
                        'step' => 'step_get_session_data_response'
                    ]
                ]
            );
        }

        if ($in['step'] === 'step_get_session_data_response') {
            $sessionId = $this->_GetData(
                [
                    'name' => 'response/data/session_id',
                    'default' => '',
                    'data' => $in,
                ]
            );

            if ($this->_Empty($sessionId) === 'false') {
                $in['step'] = 'step_responder_end_session';
            }
        }

        if ($in['step'] === 'step_responder_end_session') {
            return $this->_SubCall(
                [
                    'to' => [
                        'node' => $in['node'],
                        'plugin' => 'infohub_session',
                        'function' => 'responder_end_session'
                    ],
                    'data' => [
                        'session_id' => $sessionId
                    ],
                    'data_back' => [
                        'node' => $in['node'],
                        'step' => 'step_responder_end_session_response'
                    ]
                ]
            );
        }

        if ($in['step'] === 'step_responder_end_session_response') {
            if ($in['response']['answer'] === 'true') {
                $in['step'] = 'step_delete_session_data';
            }
        }

        if ($in['step'] === 'step_delete_session_data') {
            return $this->_SubCall(
                [
                    'to' => [
                        'node' => 'server',
                        'plugin' => 'infohub_storage',
                        'function' => 'write'
                    ],
                    'data' => [
                        'path' => 'infohub_session/node/' . $in['node'],
                        'data' => []
                    ],
                    'data_back' => [
                        'node' => $in['node'],
                        'step' => 'step_delete_session_data_response'
                    ]
                ]
            );
        }

        if ($in['step'] === 'step_delete_session_data_response') {
            // not used
        }

        return [
            'answer' => $in['response']['answer'],
            'message' => $in['response']['message'],
            'ok' => $in['response']['answer']
        ];
    }

    /**
     * Remove the session data on the responder node
     * Delete the data in path infohub_session/session/{session_id}
     * @param array $in
     * @return array
     * @author Peter Lembke
     * @version 2020-01-11
     * @since 2020-01-10
     */
    protected function responder_end_session(array $in = []): array
    {
        $default = [
            'session_id' => '', // session id to end the session on this side.
            'step' => 'step_set_pending_delete_in_session_data',
            'from_plugin' => [
                'node' => ''
            ],
            'response' => [
                'answer' => 'false',
                'message' => 'Nothing to report from responder_end_session'
            ]
        ];
        $in = $this->_Default($default, $in);

        if ($in['step'] === 'step_set_pending_delete_in_session_data') {
            return $this->_SubCall(
                [
                    'to' => [
                        'node' => 'server',
                        'plugin' => 'infohub_storage',
                        'function' => 'write'
                    ],
                    'data' => [
                        'path' => 'infohub_session/session/' . $in['session_id'],
                        'data' => [
                            'pending_delete' => 'true'
                        ],
                        'mode' => 'merge'
                    ],
                    'data_back' => [
                        'session_id' => $in['session_id'],
                        'step' => 'step_set_pending_delete_in_session_data_response'
                    ]
                ]
            );
        }

        if ($in['step'] === 'step_set_pending_delete_in_session_data_response') {
            // not used
        }

        return [
            'answer' => $in['response']['answer'],
            'message' => $in['response']['message'],
            'ok' => $in['response']['answer']
        ];
    }

    /**
     * Remove the session data on the responder node
     * Delete the data in path infohub_session/session/{session_id}
     * @param array $in
     * @return array
     * @author Peter Lembke
     * @version 2020-07-02
     * @since 2020-07-02
     */
    protected function delete_session_data(array $in = []): array
    {
        $default = [
            'session_id' => '', // session id to end the session on this side.
            'step' => 'step_delete_session_data',
            'from_plugin' => [
                'node' => '',
                'plugin' => ''
            ],
            'response' => [
                'answer' => 'false',
                'message' => ''
            ]
        ];
        $in = $this->_Default($default, $in);

        if ($in['from_plugin']['plugin'] !== 'infohub_session') {
            $in['response']['message'] = 'I only accept messages from plugin: infohub_session';
            $in['step'] = 'step_end';
        }

        if ($in['from_plugin']['node'] !== 'server') {
            $in['response']['message'] = 'I only accept messages from node: server';
            $in['step'] = 'step_end';
        }

        if ($in['step'] === 'step_delete_session_data') {
            return $this->_SubCall(
                [
                    'to' => [
                        'node' => 'server',
                        'plugin' => 'infohub_storage',
                        'function' => 'write'
                    ],
                    'data' => [
                        'path' => 'infohub_session/session/' . $in['session_id'],
                        'data' => []
                    ],
                    'data_back' => [
                        'session_id' => $in['session_id'],
                        'step' => 'step_delete_session_data_response'
                    ]
                ]
            );
        }

        if ($in['step'] === 'step_delete_session_data_response') {
            // not used
        }

        return [
            'answer' => $in['response']['answer'],
            'message' => $in['response']['message'],
            'ok' => $in['response']['answer']
        ];
    }

    /**
     * Each outgoing package must be signed to protect from data manipulation
     * @param array $in
     * @return array
     * @author Peter Lembke
     * @version 2020-01-11
     * @since 2020-01-10
     */
    protected function initiator_calculate_sign_code(array $in = []): array
    {
        $default = [
            'node' => '', // node name
            'messages_checksum' => '', // md5 checksum of all messages in the package
            'step' => 'step_get_session_data',
            'from_plugin' => [
                'node' => ''
            ],
            'response' => [
                'data' => [],
                'answer' => 'false',
                'message' => 'Nothing to report'
            ]
        ];
        $in = $this->_Default($default, $in);

        $signCode = '';
        $signCodeCreatedAt = '';
        $ok = 'false';

        if ($in['step'] === 'step_get_session_data') {
            return $this->_SubCall(
                [
                    'to' => [
                        'node' => 'server',
                        'plugin' => 'infohub_storage',
                        'function' => 'read'
                    ],
                    'data' => [
                        'path' => 'infohub_session/node/' . $in['node']
                    ],
                    'data_back' => [
                        'node' => $in['node'],
                        'messages_checksum' => $in['messages_checksum'], // md5 checksum of all messages in the package
                        'step' => 'step_get_session_data_response'
                    ]
                ]
            );
        }

        if ($in['step'] === 'step_get_session_data_response') {
            if ($in['response']['answer'] === 'true') {
                $in['step'] = 'step_calculate';
            }
        }

        if ($in['step'] === 'step_calculate') {
            $data = (array) $this->_GetData([
                'name' => 'response/data',
                'default' => [],
                'data' => $in,
            ]);

            if ($this->_Empty($data) === 'false') {
                $signCodeCreatedAt = $this->_CreatedAt();

                $string = $data['session_created_at'] . $signCodeCreatedAt .
                    $data['left_overs'] . $in['messages_checksum'] .
                    $data['session_id'] . $data['initiator_user_name'];

                $signCode = md5($string);

                $ok = 'true';
            }
        }

        return [
            'answer' => $in['response']['answer'],
            'message' => $in['response']['message'],
            'ok' => $ok,
            'sign_code' => $signCode,
            'sign_code_created_at' => $signCodeCreatedAt // 3 decimals
        ];
    }

    /**
     * Each outgoing package must be signed to protect from data manipulation
     * @param array $in
     * @return array
     * @author Peter Lembke
     * @version 2020-05-14
     * @since 2020-01-10
     */
    protected function responder_calculate_sign_code(array $in = []): array
    {
        $default = [
            'session_id' => '',
            'messages_checksum' => '', // md5 checksum of all messages in the package
            'step' => 'step_check_in_data',
            'from_plugin' => [
                'node' => '',
                'plugin' => ''
            ],
            'response' => [
                'data' => [],
                'answer' => 'false',
                'message' => 'Nothing to report'
            ]
        ];
        $in = $this->_Default($default, $in);

        $signCode = '';
        $signCodeCreatedAt = '';
        $ok = 'false';
        $sessionId = '';
        $messages = [];

        if ($in['from_plugin']['plugin'] !== 'infohub_transfer') {
            $in['response']['message'] = 'I only accept messages from plugin: infohub_transfer';
            $in['step'] = 'step_end';
        }

        if ($in['from_plugin']['node'] !== 'server') {
            $in['response']['message'] = 'I only accept messages from node: server';
            $in['step'] = 'step_end';
        }

        if ($in['step'] === 'step_check_in_data') {
            $in['step'] = 'step_get_session_data';
            if ($this->_Empty($in['session_id']) === 'true') {
                $in['response']['message'] = 'Empty session_id. I will not calculate a sign_code';
                $in['step'] = 'step_end';
            }
            if ($this->_Empty($in['messages_checksum']) === 'true') {
                $in['response']['message'] = 'Empty messages_checksum. I will not calculate a sign_code';
                $in['step'] = 'step_end';
            }
        }

        if ($in['step'] === 'step_get_session_data') {
            return $this->_SubCall(
                [
                    'to' => [
                        'node' => 'server',
                        'plugin' => 'infohub_storage',
                        'function' => 'read'
                    ],
                    'data' => [
                        'path' => 'infohub_session/session/' . $in['session_id']
                    ],
                    'data_back' => [
                        'session_id' => $in['session_id'],
                        'messages_checksum' => $in['messages_checksum'],
                        'step' => 'step_get_session_data_response'
                    ]
                ]
            );
        }

        if ($in['step'] === 'step_get_session_data_response') {
            if ($in['response']['answer'] === 'true') {
                $in['step'] = 'step_calculate';
            }
        }

        if ($in['step'] === 'step_calculate') {
            $default = [
                'banned_until' => 0.0,
                'initiator_user_name' => '',
                'left_overs' => '',
                'pending_delete' => 'false',
                'role_list' => [],
                'session_created_at' => '',
                'session_id' => '',
            ];
            $in['response']['data'] = $this->_Default($default, $in['response']['data']);
            $data = $in['response']['data'];

            if ($this->_Empty($data) === 'false') {
                $signCodeCreatedAt = $this->_CreatedAt();

                $string = $data['session_created_at'] . $signCodeCreatedAt .
                    $data['left_overs'] . $in['messages_checksum'] .
                    $data['session_id'] . $data['initiator_user_name'];

                $signCode = md5($string);

                $ok = 'true';

                $sessionId = $data['session_id'];
            }

            if ($data['pending_delete'] === 'true') {
                $in['step'] = 'step_delete_session';
            }
        }

        if ($in['step'] === 'step_delete_session') {
            $messageOut = $this->_SubCall(
                [
                    'to' => [
                        'node' => 'server',
                        'plugin' => 'infohub_session',
                        'function' => 'delete_session_data'
                    ],
                    'data' => [
                        'session_id' => $in['session_id']
                    ],
                    'data_back' => [
                        'step' => 'step_end'
                    ]
                ]
            );
            $messages[] = $messageOut;
        }

        return [
            'answer' => $in['response']['answer'],
            'message' => $in['response']['message'],
            'ok' => $ok,
            'sign_code' => $signCode,
            'sign_code_created_at' => $signCodeCreatedAt, // 3 decimals
            'session_id' => $sessionId,
            'messages' => $messages
        ];
    }

    /**
     * Verify each incoming package by its sign_code
     * @param array $in
     * @return array
     * @author Peter Lembke
     * @version 2020-01-11
     * @since 2020-01-10
     */
    protected function initiator_verify_sign_code(array $in = []): array
    {
        $default = [
            'node' => '', // node name
            'messages_checksum' => '', // md5 checksum of all messages in the package
            'sign_code' => '',
            'sign_code_created_at' => '', // 3 decimals
            'step' => 'step_verify_sign_code_created_at',
            'from_plugin' => [
                'node' => ''
            ],
            'response' => [
                'data' => [],
                'answer' => 'false',
                'message' => 'Nothing to report'
            ]
        ];
        $in = $this->_Default($default, $in);

        $ok = 'false';

        // Verify sign_code_created_at that it is max 2 seconds old
        // Read the data in path infohub_session/node/{node}
        // Calculate sign_code
        // Verify sign_code

        if ($in['step'] === 'step_verify_sign_code_created_at') {
            $diff = $this->_MicroTime() - (float)$in['sign_code_created_at'];
            if ($diff > 0.0 and $diff < 2.0) {
                $in['step'] = 'step_get_session_data';
            }
        }

        if ($in['step'] === 'step_get_session_data') {
            return $this->_SubCall(
                [
                    'to' => [
                        'node' => 'server',
                        'plugin' => 'infohub_storage',
                        'function' => 'read'
                    ],
                    'data' => [
                        'path' => 'infohub_session/node/' . $in['node']
                    ],
                    'data_back' => [
                        'node' => $in['node'],
                        'messages_checksum' => $in['messages_checksum'], // md5 checksum of all messages in the package
                        'sign_code' => $in['sign_code'],
                        'sign_code_created_at' => $in['sign_code_created_at'], // 3 decimals
                        'step' => 'step_get_session_data_response'
                    ]
                ]
            );
        }

        if ($in['step'] === 'step_get_session_data_response') {
            if ($in['response']['answer'] === 'true') {
                $in['step'] = 'step_calculate';
            }
        }

        if ($in['step'] === 'step_calculate') {
            $data = (array) $this->_GetData([
                'name' => 'response/data',
                'default' => [],
                'data' => $in,
            ]);

            if ($this->_Empty($data) === 'false') {
                $string = $data['session_created_at'] . $in['sign_code_created_at'] .
                    $data['left_overs'] . $in['messages_checksum'] .
                    $data['session_id'] . $data['initiator_user_name'];

                $signCode = md5($string);

                if ($in['sign_code'] === $signCode) {
                    $ok = 'true';
                }
            }
        }

        return [
            'answer' => $in['response']['answer'],
            'message' => $in['response']['message'],
            'ok' => $ok
        ];
    }

    /**
     * Verify each incoming package by its sign_code
     * @param array $in
     * @return array
     * @author Peter Lembke
     * @version 2020-04-18
     * @since 2020-01-10
     */
    protected function responder_verify_sign_code(array $in = []): array
    {
        $default = [
            'session_id' => '',
            'messages_checksum' => '', // md5 checksum of all messages in the package
            'sign_code' => '',
            'sign_code_created_at' => '', // 3 decimals. Checked in the kickout tests
            'step' => 'step_verify_sign_code_created_at',
            'from_plugin' => [
                'node' => '',
                'plugin' => ''
            ],
            'response' => [
                'data' => [],
                'answer' => 'false',
                'message' => 'Nothing to report'
            ]
        ];
        $in = $this->_Default($default, $in);

        $out = [
            'answer' => 'false',
            'message' => 'Nothing to report',
            'sign_code_valid' => 'false',
            'initiator_user_name' => '',
            'role_list' => []
        ];

        if ($in['from_plugin']['plugin'] !== 'infohub_exchange') {
            $out['message'] = 'I only accept messages from plugin: infohub_exchange';
            $in['step'] = 'step_end';
        }

        if ($in['from_plugin']['node'] !== 'server') {
            $out['message'] = 'I only accept messages from node: server';
            $in['step'] = 'step_end';
        }


        if ($in['step'] === 'step_verify_sign_code_created_at') {
            return $this->_SubCall(
                [
                    'to' => [
                        'node' => 'server',
                        'plugin' => 'infohub_storage',
                        'function' => 'read'
                    ],
                    'data' => [
                        'path' => 'infohub_session/session/' . $in['session_id']
                    ],
                    'data_back' => [
                        'messages_checksum' => $in['messages_checksum'], // md5 checksum of all messages in the package
                        'sign_code' => $in['sign_code'],
                        'sign_code_created_at' => $in['sign_code_created_at'], // 3 decimals
                        'step' => 'step_get_session_data_response'
                    ]
                ]
            );
        }

        if ($in['step'] === 'step_get_session_data_response') {
            if ($in['response']['answer'] === 'false') {
                $out['message'] = $in['response']['answer'];
                goto leave;
            }

            if ($this->_Empty($in['response']['data']) === 'true') {
                $out['message'] = 'Session data is empty';
                goto leave;
            }

            $default = [
                'initiator_user_name' => '',
                'left_overs' => '',
                'role_list' => [],
                'session_created_at' => '',
                'session_id' => '',
                'pending_delete' => 'false'
            ];
            $in['response']['data'] = $this->_Default($default, $in['response']['data']);

            if ($in['response']['data']['pending_delete'] === 'true') {
                return $this->_SubCall(
                    [
                        'to' => [
                            'node' => 'server',
                            'plugin' => 'infohub_session',
                            'function' => 'delete_session_data'
                        ],
                        'data' => [
                            'session_id' => $in['session_id']
                        ],
                        'data_back' => [
                            'step' => 'step_delete_session_data_response'
                        ]
                    ]
                );
            }

            $data = $in['response']['data'];

            $string = $data['session_created_at'] . $in['sign_code_created_at'] .
                $data['left_overs'] . $in['messages_checksum'] .
                $data['session_id'] . $data['initiator_user_name'];

            $signCode = md5($string);

            if ($in['sign_code'] === $signCode) {
                $out = [
                    'answer' => 'true',
                    'message' => 'Sign code is valid',
                    'sign_code_valid' => 'true',
                    'initiator_user_name' => $data['initiator_user_name'],
                    'role_list' => $data['role_list']
                ];
            }
        }

        if ($in['step'] === 'step_delete_session_data_response') {
            $out['answer'] = $in['response']['answer'];
            $out['message'] = $in['response']['message'];
            $out['sign_code_valid'] = 'false';
        }

        leave:
        return [
            'answer' => $out['answer'],
            'message' => $out['message'],
            'sign_code_valid' => $out['sign_code_valid'],
            'initiator_user_name' => $out['initiator_user_name'],
            'role_list' => $out['role_list']
        ];
    }

    /**
     * Verify if a session_id is valid. That the user are logged in.
     * @param array $in
     * @return array
     * @author Peter Lembke
     * @version 2020-02-12
     * @since 2020-02-12
     */
    protected function responder_check_session_valid(array $in = []): array
    {
        $default = [
            'session_id' => '',
            'step' => 'step_get_session_data',
            'from_plugin' => [
                'node' => ''
            ],
            'response' => [
                'data' => [],
                'answer' => 'false',
                'message' => 'Nothing to report',
                'post_exist' => 'false'
            ]
        ];
        $in = $this->_Default($default, $in);

        $sessionValid = 'false';

        if ($in['from_plugin']['node'] === 'server') {
            $in['response']['message'] = 'I only accept messages from other nodes';
            $in['step'] = 'step_end';
        }

        if ($in['step'] === 'step_get_session_data') {
            return $this->_SubCall(
                [
                    'to' => [
                        'node' => 'server',
                        'plugin' => 'infohub_storage',
                        'function' => 'read'
                    ],
                    'data' => [
                        'path' => 'infohub_session/session/' . $in['session_id']
                    ],
                    'data_back' => [
                        'step' => 'step_get_session_data_response'
                    ]
                ]
            );
        }

        if ($in['step'] === 'step_get_session_data_response') {
            $default = [
                'initiator_user_name' => '',
                'left_overs' => '',
                'role_list' => [],
                'session_created_at' => '',
                'session_id' => '',
                'pending_delete' => 'false'
            ];
            $in['response']['data'] = $this->_Default($default, $in['response']['data']);

            $data = $in['response']['data'];

            if ($in['response']['post_exist'] === 'true') {
                $sessionValid = 'true';
            }

            if ($data['pending_delete'] === 'true') {
                $sessionValid = 'false';
            }

            // @todo Check that the session has not timed out.
            // @todo Check that the user_name is right.

        }

        return [
            'answer' => $in['response']['answer'],
            'message' => $in['response']['message'],
            'session_valid' => $sessionValid
        ];
    }

    /**
     * Gives you a microtime with 3 decimals as a string
     * @return string
     * @since 2020-01-10
     * @author Peter Lembke
     * @version 2020-04-18
     */
    protected function _CreatedAt(): string
    {
        $time = $this->_MicroTime();
        $time = round($time, $precision = 3);

        return (string)$time;
    }

    /**
     * Load the user session and pull out banned_until
     * Then calculate banned_seconds and banned boolean
     * @param array $in
     * @return array
     * @author Peter Lembke
     * @version 2020-06-14
     * @since 2020-06-12
     */
    protected function get_banned_until(array $in = []): array
    {
        $default = [
            'step' => 'step_get_session_data',
            'from_plugin' => [
                'node' => ''
            ],
            'config' => [
                'session_id' => ''
            ],
            'response' => [
                'post_exist' => 'false',
                'data' => [
                    'banned_until' => 0.0
                ]
            ]
        ];
        $in = $this->_Default($default, $in);

        $out = [
            'answer' => 'false',
            'message' => 'There are no session',
            'current_time' => $this->_MicroTime(),
            'banned_until' => 0.0,
            'banned_seconds' => 0.0,
            'banned' => 'true'
        ];

        if ($in['from_plugin']['node'] !== 'server') {
            $out['message'] = 'I only accept messages from this node';
            $in['step'] = 'step_end';
        }

        if ($in['config']['session_id'] === '') {
            $out['message'] = 'There are no active session';
            $in['step'] = 'step_end';
        }

        if ($in['step'] === 'step_get_session_data') {
            return $this->_SubCall(
                [
                    'to' => [
                        'node' => 'server',
                        'plugin' => 'infohub_storage',
                        'function' => 'read'
                    ],
                    'data' => [
                        'path' => 'infohub_session/session/' . $in['config']['session_id']
                    ],
                    'data_back' => [
                        'step' => 'step_get_session_data_response'
                    ]
                ]
            );
        }

        if ($in['step'] === 'step_get_session_data_response') {
            if ($in['response']['post_exist'] === 'true') {
                $currentTime = $out['current_time'];

                $out['banned_until'] = $in['response']['data']['banned_until'];
                if (empty($out['banned_until']) === true) {
                    $out['banned_until'] = $currentTime;
                }

                $out['banned_seconds'] = $out['banned_until'] - $currentTime;
                if ($out['banned_seconds'] < 0.0) {
                    $out['banned_seconds'] = 0.0;
                }

                $out['banned'] = 'true';
                if ($out['banned_seconds'] === 0.0) {
                    $out['banned'] = 'false';
                }

                $out['answer'] = 'true';
                $out['message'] = 'Here are the banned data';
            }
        }

        if ($out['answer'] === 'true' && $out['banned'] === 'true') {
            $a = 1; // For debug purposes
        }

        return $out;
    }

    /**
     * Load the user session and pull out banned_until
     * Set banned_until by banned_until or by banned_seconds
     * @param array $in
     * @return array
     * @author Peter Lembke
     * @version 2020-06-14
     * @since 2020-06-12
     */
    protected function set_banned_until(array $in = []): array
    {
        $default = [
            'banned_until' => 0.0, // Set this
            'banned_seconds' => 0.0, // or this
            'step' => 'step_get_session_data',
            'from_plugin' => [
                'node' => ''
            ],
            'config' => [
                'session_id' => ''
            ],
            'data_back' => [
                'banned_until' => 0.0
            ],
            'response' => [
                'answer' => 'false',
                'message' => 'Nothing to report',
                'post_exist' => 'false',
                'data' => []
            ]
        ];
        $in = $this->_Default($default, $in);

        $out = [
            'answer' => 'false',
            'message' => 'Nothing to report',
            'current_time' => $this->_MicroTime(),
            'banned_until' => 0.0,
            'banned_seconds' => 0.0,
            'banned' => 'true'
        ];

        if ($in['from_plugin']['node'] !== 'server') {
            $out['message'] = 'I only accept messages from this node';
            $in['step'] = 'step_end';
        }

        if ($in['step'] === 'step_get_session_data') {
            return $this->_SubCall(
                [
                    'to' => [
                        'node' => 'server',
                        'plugin' => 'infohub_storage',
                        'function' => 'read'
                    ],
                    'data' => [
                        'path' => 'infohub_session/session/' . $in['config']['session_id']
                    ],
                    'data_back' => [
                        'banned_until' => $in['banned_until'],
                        'banned_seconds' => $in['banned_seconds'],
                        'step' => 'step_get_session_data_response'
                    ]
                ]
            );
        }

        if ($in['step'] === 'step_get_session_data_response') {
            if ($in['response']['post_exist'] === 'true') {
                $in['step'] = 'step_set_session_data';
            }
        }

        if ($in['step'] === 'step_set_session_data') {
            $data = $in['response']['data'];

            $now = $out['current_time'];
            $bannedUntil = $now;

            if ($in['banned_until'] > $now) {
                $bannedUntil = $in['banned_until'];
            }

            if ($in['banned_seconds'] > 0.0) {
                $bannedUntil = $now + $in['banned_seconds'];
            }

            $data['banned_until'] = $bannedUntil;

            return $this->_SubCall(
                [
                    'to' => [
                        'node' => 'server',
                        'plugin' => 'infohub_storage',
                        'function' => 'write'
                    ],
                    'data' => [
                        'path' => 'infohub_session/session/' . $in['config']['session_id'],
                        'data' => $data
                    ],
                    'data_back' => [
                        'banned_until' => $bannedUntil,
                        'step' => 'step_set_session_data_response'
                    ]
                ]
            );
        }

        if ($in['step'] === 'step_set_session_data_response') {
            $out['message'] = 'Failed saving the data to the session';
            if ($in['response']['answer'] === 'true') {
                $out['banned_until'] = $in['data_back']['banned_until'];

                if (empty($out['banned_until']) === true) {
                    $out['banned_until'] = $this->_MicroTime();
                }

                $out['banned_seconds'] = $out['banned_until'] - $this->_MicroTime();
                if ($out['banned_seconds'] < 0.0) {
                    $out['banned_seconds'] = 0.0;
                }

                $out['banned'] = 'true';
                if ($out['banned_seconds'] === 0.0) {
                    $out['banned'] = 'false';
                }

                $out['answer'] = 'true';
                $out['message'] = 'Here are the banned data';
            }
        }

        return $out;
    }

    /**
     * Check if we are currently banned. banned = false if banned_until < now
     * Always adds ban_time_seconds from the config.
     * Returns the data just like get_banned_until would
     * @param array $in
     * @return array
     * @author Peter Lembke
     * @version 2020-06-16
     * @since 2020-06-12
     */
    protected function check_banned_until(array $in = []): array
    {
        $default = [
            'step' => 'step_get_banned_until',
            'from_plugin' => [
                'node' => ''
            ],
            'config' => [
                'session_id' => '',
                'ban_time_seconds' => 0.0
            ],
            'response' => [],
            'data_back' => [
                'banned' => 'true'
            ]
        ];
        $in = $this->_Default($default, $in);

        $out = [
            'answer' => 'false',
            'message' => 'Nothing to report',
            'current_time' => $this->_MicroTime(),
            'banned_until' => 0.0,
            'banned_seconds' => 0.0,
            'banned' => 'true'
        ];

        if ($in['from_plugin']['node'] !== 'server') {
            $out['message'] = 'I only accept messages from this node';
            $in['step'] = 'step_end';
        }

        if ($in['step'] === 'step_get_banned_until') {
            return $this->_SubCall(
                [
                    'to' => [
                        'node' => 'server',
                        'plugin' => 'infohub_session',
                        'function' => 'get_banned_until'
                    ],
                    'data' => [],
                    'data_back' => [
                        'config' => $in['config'],
                        'step' => 'step_get_banned_until_response'
                    ]
                ]
            );
        }

        if ($in['step'] === 'step_get_banned_until_response') {
            $default = [
                'answer' => 'false',
                'message' => 'Nothing to report',
                'current_time' => 0.0,
                'banned_until' => 0.0,
                'banned_seconds' => 0.0,
                'banned' => 'true'
            ];
            $in['response'] = $this->_Default($default, $in['response']);

            $out = $in['response'];
            $in['step'] = 'step_end';

            if ($in['response']['answer'] === 'true') {
                $in['step'] = 'step_ban_more';
            }
        }

        if ($in['step'] === 'step_ban_more') {
            return $this->_SubCall(
                [
                    'to' => [
                        'node' => 'server',
                        'plugin' => 'infohub_session',
                        'function' => 'set_banned_until'
                    ],
                    'data' => [
                        'banned_seconds' => $in['config']['ban_time_seconds']
                    ],
                    'data_back' => [
                        'banned' => $in['response']['banned'],
                        'step' => 'step_ban_more_response'
                    ]
                ]
            );
        }

        if ($in['step'] === 'step_ban_more_response') {
            $default = [
                'answer' => 'false',
                'message' => 'Nothing to report',
                'current_time' => 0.0,
                'banned_until' => 0.0,
                'banned_seconds' => 0.0,
                'banned' => 'true' // Not used
            ];
            $in['response'] = $this->_Default($default, $in['response']);

            $banned = $in['data_back']['banned'];
            $out = $in['response'];
            $out['banned'] = $banned;
        }

        return $out;
    }
}
