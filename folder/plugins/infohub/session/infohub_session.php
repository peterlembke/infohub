<?php
declare(strict_types=1);
if (basename(__FILE__) == basename($_SERVER["SCRIPT_FILENAME"])) {
    exit; // This file must be included, not called directly
}

/**
 * @category InfoHub
 * @package InfoHub Session
 * @copyright Copyright (c) 2020, Peter Lembke, CharZam soft (CharZam.com / InfoHub.se)
 * @since 2020-01-10
 * @author Peter Lembke <peter.lembke@infohub.se>
 * @link https://infohub.se/ InfoHub main page
 * @license InfoHub is distributed under the terms of the GNU General Public License
 * InfoHub is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * InfoHub is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 * You should have received a copy of the GNU General Public License
 * along with InfoHub.    If not, see <https://www.gnu.org/licenses/>.
 */
class infohub_session extends infohub_base
{

    const PREFIX = 'session';

    protected final function _Version(): array
    {
        return array(
            'date' => '2020-01-10',
            'since' => '2020-01-10',
            'version' => '1.0.0',
            'class_name' => 'infohub_session',
            'checksum' => '{{checksum}}',
            'note' => 'Handle sessions. Both incoming and outgoing.',
            'status' => 'normal',
            'license_name' => 'GNU GPL 3 or later'
        );
    }

    protected function _GetCmdFunctions(): array
    {
        return array(
            'responder_start_session' => 'normal',
            'initiator_store_session_data' => 'normal',
            'initiator_end_session' => 'normal',
            'responder_end_session' => 'normal',
            'initiator_calculate_sign_code' => 'normal',
            'responder_calculate_sign_code' => 'normal',
            'initiator_verify_sign_code' => 'normal',
            'responder_verify_sign_code' => 'normal',
            'responder_check_session_valid' => 'normal'
        );
    }

    /**
     * Create a new session and save it
     * Create a session_id. Crete a session_created_at. path = infohub_session/session/{session_id}
     * Store associated array with initiator_user_name, left_overs, session_id, session_created_at
     * @version 2020-01-10
     * @since 2020-01-10
     * @author Peter Lembke
     * @param array $in
     * @return array
     */
    final protected function responder_start_session(array $in = array()): array
    {
        $default = array(
            'initiator_user_name' => '', // user_{hub_id}
            'left_overs' => '', // Left overs from the login. Never exposed outside this plugin.
            'plugin_names' => array(),
            'step' => 'step_create_session_id',
            'from_plugin' => array('node' => '', 'plugin' => '', 'function' => ''),
            'response' => array(
                'answer' => 'false',
                'message' => '',
                'data' => '', // The uuid is returned as a string
                'post_exist' => 'false'
            ),
            'data_back' => array(
                'session_id' => '',
                'session_created_at' => 0.0
            )
        );
        $in = $this->_Default($default, $in);

        if ($in['step'] === 'step_create_session_id') {
            return $this->_SubCall(array(
                'to' => array(
                    'node' => 'server',
                    'plugin' => 'infohub_uuid',
                    'function' => 'uuid'
                ),
                'data' => array(),
                'data_back' => array(
                    'initiator_user_name' => $in['initiator_user_name'],
                    'left_overs' => $in['left_overs'],
                    'plugin_names' => $in['plugin_names'],
                    'step' => 'step_create_session_id_response'
                )
            ));
        }

        if ($in['step'] === 'step_create_session_id_response') {
            if ($in['response']['answer'] === 'true') {
                $in['step'] = 'step_store_session_data';
            }
        }

        if ($in['step'] === 'step_store_session_data') {
            $sessionId = self::PREFIX . '_' . $in['response']['data'];
            $sessionCreatedAt = $this->_CreatedAt();
            $path = 'infohub_session/session/' . $sessionId;

            return $this->_SubCall(array(
                'to' => array(
                    'node' => 'server',
                    'plugin' => 'infohub_storage',
                    'function' => 'write'
                ),
                'data' => array(
                    'path' => $path,
                    'data' => array(
                        'initiator_user_name' => $in['initiator_user_name'],
                        'left_overs' => $in['left_overs'],
                        'session_id' => $sessionId,
                        'session_created_at' => $sessionCreatedAt,
                        'plugin_names' => $in['plugin_names']
                    )
                ),
                'data_back' => array(
                    'initiator_user_name' => $in['initiator_user_name'],
                    'left_overs' => $in['left_overs'],
                    'session_id' => $sessionId,
                    'session_created_at' => $sessionCreatedAt,
                    'step' => 'step_store_session_data_response'
                )
            ));
        }

        if ($in['step'] === 'step_store_session_data_response') {
            if ($in['response']['post_exist'] === 'true') {
                $in['response']['message'] = 'Session created';
            }
        }

        return array(
            'answer' => $in['response']['answer'],
            'message' => $in['response']['message'],
            'initiator_user_name' => $in['initiator_user_name'], // user_{hub_id}
            'session_id' => $in['data_back']['session_id'], // session_{hub_id}
            'session_created_at' => $in['data_back']['session_created_at'], // micro time with 3 decimals
            'logged_in' => $in['response']['post_exist']
        );
    }

    /**
     * Get session data and store it
     * path = infohub_session/node/{node}
     * Store associated array with initiator_user_name, left_overs, session_id, session_created_at
     * @version 2020-01-10
     * @since 2020-01-10
     * @author Peter Lembke
     * @param array $in
     * @return array
     */
    final protected function initiator_store_session_data(array $in = array()): array
    {
        $default = array(
            'node' => '', // name of the node the initiator use to send data to the responder
            'initiator_user_name' => '', // user_{hub_id}
            'session_id' => '', //session_{hub_id}
            'session_created_at' => 0.0, // micro time with 3 decimals
            'left_overs' => '', // Left overs from the login. Never exposed outside this plugin
            'step' => 'step_store_session_data',
            'response' => array(
                'answer' => 'false',
                'message' => ''
            )
        );
        $in = $this->_Default($default, $in);

        if ($in['step'] === 'step_store_session_data') {
            $path = 'infohub_session/node/' . $in['node'];

            return $this->_SubCall(array(
                'to' => array(
                    'node' => 'server',
                    'plugin' => 'infohub_storage',
                    'function' => 'write'
                ),
                'data' => array(
                    'path' => $path,
                    'data' => array(
                        'initiator_user_name' => $in['initiator_user_name'],
                        'left_overs' => $in['left_overs'],
                        'session_id' => $in['session_id'],
                        'session_created_at' => $in['session_created_at'],
                    )
                ),
                'data_back' => array(
                    'initiator_user_name' => $in['initiator_user_name'],
                    'left_overs' => $in['left_overs'],
                    'session_id' => $in['session_id'],
                    'session_created_at' => $in['session_created_at'],
                    'step' => 'step_store_session_data_response'
                )
            ));

        }

        if ($in['step'] === 'step_store_session_data_response') {
            // Not needed
        }

        return array(
            'answer' => $in['response']['answer'],
            'message' => $in['response']['message'],
            'ok' => $in['response']['answer']
        );
    }

    /**
     * Remove the session data on the responder node and on the initiator node
     * Get the session data. Call the other node responder_end_session
     * If success then delete the data in path infohub_session/node/{node}
     * @version 2020-01-11
     * @since 2020-01-10
     * @author Peter Lembke
     * @param array $in
     * @return array
     */
    final protected function initiator_end_session(array $in = array()): array
    {
        $default = array(
            'node' => '', // name of the node to end the session on both sides.
            'response' => array(
                'data' => array(
                    'initiator_user_name' => '',
                    'left_overs' => '',
                    'session_id' => '',
                    'session_created_at' => '',
                ),
                'answer' => 'false',
                'message' => 'Nothing to report'
            ),
            'step' => 'step_get_session_data'
        );
        $in = $this->_Default($default, $in);

        $sessionId = '';

        if ($in['step'] === 'step_get_session_data') {

            return $this->_SubCall(array(
                'to' => array(
                    'node' => 'server',
                    'plugin' => 'infohub_storage',
                    'function' => 'read'
                ),
                'data' => array(
                    'path' => 'infohub_session/node/' . $in['node']
                ),
                'data_back' => array(
                    'node' => $in['node'],
                    'step' => 'step_get_session_data_response'
                )
            ));

        }

        if ($in['step'] === 'step_get_session_data_response') {
            $sessionId = $this->_GetData(array(
                'name' => 'response/data/session_id',
                'default' => '',
                'data' => $in,
            ));

            if ($this->_Empty($sessionId) === 'false') {
                $in['step'] = 'step_responder_end_session';
            }
        }

        if ($in['step'] === 'step_responder_end_session') {
            return $this->_SubCall(array(
                'to' => array(
                    'node' => $in['node'],
                    'plugin' => 'infohub_session',
                    'function' => 'responder_end_session'
                ),
                'data' => array(
                    'session_id' => $sessionId
                ),
                'data_back' => array(
                    'node' => $in['node'],
                    'step' => 'step_responder_end_session_response'
                )
            ));
        }

        if ($in['step'] === 'step_responder_end_session_response') {
            if ($in['response']['answer'] === 'true') {
                $in['step'] = 'step_delete_session_data';
            }
        }

        if ($in['step'] === 'step_delete_session_data') {
            return $this->_SubCall(array(
                'to' => array(
                    'node' => 'server',
                    'plugin' => 'infohub_storage',
                    'function' => 'write'
                ),
                'data' => array(
                    'path' => 'infohub_session/node/' . $in['node'],
                    'data' => array()
                ),
                'data_back' => array(
                    'node' => $in['node'],
                    'step' => 'step_delete_session_data_response'
                )
            ));
        }

        if ($in['step'] === 'step_delete_session_data_response') {
            // not used
        }

        return array(
            'answer' => $in['response']['answer'],
            'message' => $in['response']['message'],
            'ok' => $in['response']['answer']
        );
    }

    /**
     * Remove the session data on the responder node
     * Delete the data in path infohub_session/session/{session_id}
     * @version 2020-01-11
     * @since 2020-01-10
     * @author Peter Lembke
     * @param array $in
     * @return array
     */
    final protected function responder_end_session(array $in = array()): array
    {
        $default = array(
            'session_id' => '', // session id to end the session on this side.
            'step' => 'step_delete_session_data',
            'response' => array(
                'answer' => 'false',
                'message' => ''
            )
        );
        $in = $this->_Default($default, $in);

        if ($in['step'] === 'step_delete_session_data') {
            return $this->_SubCall(array(
                'to' => array(
                    'node' => 'server',
                    'plugin' => 'infohub_storage',
                    'function' => 'write'
                ),
                'data' => array(
                    'path' => 'infohub_session/session/' . $in['session_id'],
                    'data' => array()
                ),
                'data_back' => array(
                    'session_id' => $in['session_id'],
                    'step' => 'step_delete_session_data_response'
                )
            ));
        }

        if ($in['step'] === 'step_delete_session_data_response') {
            // not used
        }

        return array(
            'answer' => $in['response']['answer'],
            'message' => $in['response']['message'],
            'ok' => $in['response']['answer']
        );
    }

    /**
     * Each outgoing package must be signed to protect from data manipulation
     * @version 2020-01-11
     * @since 2020-01-10
     * @author Peter Lembke
     * @param array $in
     * @return array
     */
    final protected function initiator_calculate_sign_code(array $in = array()): array
    {
        $default = array(
            'node' => '', // node name
            'messages_checksum' => '', // md5 checksum of all messages in the package
            'step' => 'step_get_session_data',
            'response' => array(
                'data' => array(),
                'answer' => 'false',
                'message' => 'Nothing to report'
            )
        );
        $in = $this->_Default($default, $in);

        $signCode = '';
        $signCodeCreatedAt = 0.0;
        $ok = 'false';

        if ($in['step'] === 'step_get_session_data') {

            return $this->_SubCall(array(
                'to' => array(
                    'node' => 'server',
                    'plugin' => 'infohub_storage',
                    'function' => 'read'
                ),
                'data' => array(
                    'path' => 'infohub_session/node/' . $in['node']
                ),
                'data_back' => array(
                    'node' => $in['node'],
                    'messages_checksum' => $in['messages_checksum'], // md5 checksum of all messages in the package
                    'step' => 'step_get_session_data_response'
                )
            ));

        }

        if ($in['step'] === 'step_get_session_data_response') {
            if ($in['response']['answer'] === 'true') {
                $in['step'] = 'step_calculate';
            }
        }

        if ($in['step'] === 'step_calculate') {
            $data = $this->_GetData(array(
                'name' => 'response/data',
                'default' => array(),
                'data' => $in,
            ));

            if ($this->_Empty($data) === 'false')
            {
                $signCodeCreatedAt = $this->_CreatedAt();

                $string = $data['session_created_at'] . $signCodeCreatedAt .
                    $data['left_overs'] . $in['messages_checksum'] .
                    $data['session_id'] . $data['initiator_user_name'];

                $signCode = md5($string);

                $ok = 'true';
            }

        }

        return array(
            'answer' => $in['response']['answer'],
            'message' => $in['response']['message'],
            'ok' => $ok,
            'sign_code' => $signCode,
            'sign_code_created_at' => $signCodeCreatedAt // 3 decimals
        );
    }

    /**
     * Each outgoing package must be signed to protect from data manipulation
     * @version 2020-01-11
     * @since 2020-01-10
     * @author Peter Lembke
     * @param array $in
     * @return array
     */
    final protected function responder_calculate_sign_code(array $in = array()): array
    {
        $default = array(
            'session_id' => '',
            'messages_checksum' => '', // md5 checksum of all messages in the package
            'step' => 'step_get_session_data',
            'response' => array(
                'data' => array(),
                'answer' => 'false',
                'message' => 'Nothing to report'
            )
        );
        $in = $this->_Default($default, $in);

        $signCode = '';
        $signCodeCreatedAt = 0.0;
        $ok = 'false';

        if ($in['step'] === 'step_get_session_data') {

            return $this->_SubCall(array(
                'to' => array(
                    'node' => 'server',
                    'plugin' => 'infohub_storage',
                    'function' => 'read'
                ),
                'data' => array(
                    'path' => 'infohub_session/session/' . $in['session_id']
                ),
                'data_back' => array(
                    'node' => $in['node'],
                    'step' => 'step_get_session_data_response'
                )
            ));

        }

        if ($in['step'] === 'step_get_session_data_response') {
            if ($in['response']['answer'] === 'true') {
                $in['step'] = 'step_calculate';
            }
        }

        if ($in['step'] === 'step_calculate') {
            $data = $this->_GetData(array(
                'name' => 'response/data',
                'default' => array(),
                'data' => $in,
            ));

            if ($this->_Empty($data) === 'false')
            {
                $signCodeCreatedAt = $this->_CreatedAt();

                $string = $data['session_created_at'] . $signCodeCreatedAt .
                    $data['left_overs'] . $in['messages_checksum'] .
                    $data['session_id'] . $data['initiator_user_name'];

                $signCode = md5($string);

                $ok = 'true';
            }

        }

        return array(
            'answer' => $in['response']['answer'],
            'message' => $in['response']['message'],
            'ok' => $ok,
            'sign_code' => $signCode,
            'sign_code_created_at' => $signCodeCreatedAt // 3 decimals
        );
    }

    /**
     * Verify each incoming package by its sign_code
     * @version 2020-01-11
     * @since 2020-01-10
     * @author Peter Lembke
     * @param array $in
     * @return array
     */
    final protected function initiator_verify_sign_code(array $in = array()): array
    {
        $default = array(
            'node' => '', // node name
            'messages_checksum' => '', // md5 checksum of all messages in the package
            'sign_code' => '',
            'sign_code_created_at' => 0.0, // 3 decimals
            'step' => 'step_verify_sign_code_created_at',
            'response' => array(
                'data' => array(),
                'answer' => 'false',
                'message' => 'Nothing to report'
            )
        );
        $in = $this->_Default($default, $in);

        // Verify sign_code_created_at that it is max 2 seconds old
        // Read the data in path infohub_session/node/{node}
        // Calculate sign_code
        // Verify sign_code

        if ($in['step'] === 'step_verify_sign_code_created_at') {
            $data = $in['sign_code_created_at'];
            if ($data > 0.0 and $data < 2.0) {
                $in['step'] = 'step_get_session_data';
            }
        }

        if ($in['step'] === 'step_get_session_data') {

            return $this->_SubCall(array(
                'to' => array(
                    'node' => 'server',
                    'plugin' => 'infohub_storage',
                    'function' => 'read'
                ),
                'data' => array(
                    'path' => 'infohub_session/node/' . $in['node']
                ),
                'data_back' => array(
                    'node' => $in['node'],
                    'messages_checksum' => $in['messages_checksum'], // md5 checksum of all messages in the package
                    'sign_code' => $in['sign_code'],
                    'sign_code_created_at' => $in['sign_code_created_at'], // 3 decimals
                    'step' => 'step_get_session_data_response'
                )
            ));

        }

        if ($in['step'] === 'step_get_session_data_response') {
            if ($in['response']['answer'] === 'true') {
                $in['step'] = 'step_calculate';
            }
        }

        if ($in['step'] === 'step_calculate') {
            $data = $this->_GetData(array(
                'name' => 'response/data',
                'default' => array(),
                'data' => $in,
            ));

            if ($this->_Empty($data) === 'false')
            {
                $string = $data['session_created_at'] . $in['sign_code_created_at'] .
                    $data['left_overs'] . $in['messages_checksum'] .
                    $data['session_id'] . $data['initiator_user_name'];

                $signCode = md5($string);

                if ($in['sign_code'] === $signCode) {
                    $ok = 'true';
                }
            }

        }

        return array(
            'answer' => $in['response']['answer'],
            'message' => $in['response']['message'],
            'ok' => $ok
        );
    }

    /**
     * Verify each incoming package by its sign_code
     * @version 2020-01-11
     * @since 2020-01-10
     * @author Peter Lembke
     * @param array $in
     * @return array
     */
    final protected function responder_verify_sign_code(array $in = array()): array
    {
        $default = array(
            'session_id' => '',
            'messages_checksum' => '', // md5 checksum of all messages in the package
            'sign_code' => '',
            'sign_code_created_at' => 0.0, // 3 decimals
            'step' => 'step_verify_sign_code_created_at',
            'response' => array(
                'data' => array(),
                'answer' => 'false',
                'message' => 'Nothing to report'
            )
        );
        $in = $this->_Default($default, $in);

        // Verify sign_code_created_at that it is max 2 seconds old
        // Read the data in path infohub_session/node/{node}
        // Calculate sign_code
        // Verify sign_code

        if ($in['step'] === 'step_verify_sign_code_created_at') {
            $data = $in['sign_code_created_at'];
            if ($data > 0.0 and $data < 2.0) {
                $in['step'] = 'step_get_session_data';
            }
        }

        if ($in['step'] === 'step_get_session_data') {

            return $this->_SubCall(array(
                'to' => array(
                    'node' => 'server',
                    'plugin' => 'infohub_storage',
                    'function' => 'read'
                ),
                'data' => array(
                    'path' => 'infohub_session/session/' . $in['session_id']
                ),
                'data_back' => array(
                    'node' => $in['node'],
                    'messages_checksum' => $in['messages_checksum'], // md5 checksum of all messages in the package
                    'sign_code' => $in['sign_code'],
                    'sign_code_created_at' => $in['sign_code_created_at'], // 3 decimals
                    'step' => 'step_get_session_data_response'
                )
            ));

        }

        if ($in['step'] === 'step_get_session_data_response') {
            if ($in['response']['answer'] === 'true') {
                $in['step'] = 'step_calculate';
            }
        }

        if ($in['step'] === 'step_calculate') {
            $data = $this->_GetData(array(
                'name' => 'response/data',
                'default' => array(),
                'data' => $in,
            ));

            if ($this->_Empty($data) === 'false')
            {
                $string = $data['session_created_at'] . $in['sign_code_created_at'] .
                    $data['left_overs'] . $in['messages_checksum'] .
                    $data['session_id'] . $data['initiator_user_name'];

                $signCode = md5($string);

                if ($in['sign_code'] === $signCode) {
                    $ok = 'true';
                }
            }

        }

        return array(
            'answer' => $in['response']['answer'],
            'message' => $in['response']['message'],
            'ok' => $ok
        );
    }

    /**
     * Verify if a session_id is valid. That the user are logged in.
     * @version 2020-02-12
     * @since 2020-02-12
     * @author Peter Lembke
     * @param array $in
     * @return array
     */
    final protected function responder_check_session_valid(array $in = array()): array
    {
        $default = array(
            'session_id' => '',
            'step' => 'step_get_session_data',
            'response' => array(
                'data' => array(),
                'answer' => 'false',
                'message' => 'Nothing to report',
                'post_exist' => 'false'
            )
        );
        $in = $this->_Default($default, $in);

        $sessionValid = 'false';

        if ($in['step'] === 'step_get_session_data') {
            return $this->_SubCall(array(
                'to' => array(
                    'node' => 'server',
                    'plugin' => 'infohub_storage',
                    'function' => 'read'
                ),
                'data' => array(
                    'path' => 'infohub_session/session/' . $in['session_id']
                ),
                'data_back' => array(
                    'step' => 'step_get_session_data_response'
                )
            ));
        }

        if ($in['step'] === 'step_get_session_data_response') {
            if ($in['response']['post_exist'] === 'true') {
                $sessionValid = $in['response']['post_exist'];
            }
        }

        return array(
            'answer' => $in['response']['answer'],
            'message' => $in['response']['message'],
            'session_valid' => $sessionValid
        );
    }

    /**
     * Gives you a microtime with 3 decimals
     * @version 2020-01-10
     * @since 2020-01-10
     * @author Peter Lembke
     * @return float
     */
    final protected function _CreatedAt(): float
    {
        $time = $this->_MicroTime();
        $time = round($time, 3);
        return $time;
    }

}