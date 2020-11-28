<?php
/**
 * Data so server can login to other nodes
 *
 * @package     Infohub
 * @subpackage  infohub_contact
 */

declare(strict_types=1);
if (basename(__FILE__) == basename($_SERVER["SCRIPT_FILENAME"])) {
    exit; // This file must be included, not called directly
}

/**
 * Data so server can login to other nodes
 *
 * @author      Peter Lembke <info@infohub.se>
 * @version     2019-02-23
 * @since       2019-01-16
 * @copyright   Copyright (c) 2019, Peter Lembke
 * @license     https://opensource.org/licenses/gpl-license.php GPL-3.0-or-later
 * @see         https://github.com/peterlembke/infohub/blob/master/folder/plugins/infohub/checksum/infohub_checksum.md Documentation
 * @link        https://infohub.se/ InfoHub main page
 */
class infohub_contact extends infohub_base
{
    const PREFIX = 'user';

    /**
     * Version information for this plugin
     * @version 2018-03-03
     * @since   2018-03-03
     * @author  Peter Lembke
     * @return string[]
     */
    protected function _Version(): array
    {
        return array(
            'date' => '2019-02-23',
            'since' => '2019-01-16',
            'version' => '1.0.0',
            'class_name' => 'infohub_contact',
            'checksum' => '{{checksum}}',
            'note' => 'Data so server can login to other nodes',
            'status' => 'normal',
            'SPDX-License-Identifier' => 'GPL-3.0-or-later',
            'user_role' => 'admin'
        );
    }

    /**
     * Public functions in this plugin
     * @version 2018-03-03
     * @since   2018-03-03
     * @author  Peter Lembke
     * @return mixed
     */
    protected function _GetCmdFunctions(): array
    {
        $list = array(
            'save_node_data' => 'normal',
            'delete_node_data' => 'normal',
            'load_node_data' => 'normal', // Also used by infohub_login.php
            'load_node_list' => 'normal',
            'load_role_list' => 'normal',
            'get_doc_file' => 'normal'
        );

        return parent::_GetCmdFunctionsBase($list);
    }

    /**
     * Save node data to Storage
     * @version 2019-01-16
     * @since   2019-01-16
     * @author  Peter Lembke
     * @param array $in
     * @return array
     */
    protected function save_node_data(array $in = []): array
    {
        $default = array(
            'type' => 'server', // server or client
            'node_data' => array(
                'node' => '', // Name of this connection. This is also a node name in messages.
                'note' => '',
                'domain_address' => '', // We login to this destination domain
                'user_name' => '', // Your identity
                'shared_secret' => '', // 2Kb random bytes base64 encoded
                'role_list' => []
            ),
            'from_plugin' => array(
                'node' => ''
            ),
            'response' => [],
            'step' => 'step_check_user_name'
        );
        $in = $this->_Default($default, $in);

        $out = array(
            'answer' => 'false',
            'message' => 'Nothing to report from save_node_data',
            'ok' => 'false'
        );

        if ($in['from_plugin']['node'] !== 'client') {
            $out['message'] = 'Only node client are allowed to use function save_node_data';
            $in['step'] = 'step_end';
        }

        if ($in['step'] === 'step_check_user_name') {
            $in['step'] = 'step_check_shared_secret';

            if (empty($in['node_data']['user_name']) === true) {
                return $this->_SubCall(array(
                    'to' => array(
                        'node' => 'server',
                        'plugin' => 'infohub_uuid',
                        'function' => 'hub_id'
                    ),
                    'data' => [],
                    'data_back' => array(
                        'step' => 'step_check_user_name_response',
                        'type' => $in['type'],
                        'node_data' => $in['node_data']
                    )
                ));
            }
        }

        if ($in['step'] === 'step_check_user_name_response') {
            $default = array(
                'answer' => 'false',
                'message' => 'Nothing',
                'post_exist' => 'false',
                'data' => ''
            );
            $in['response'] = $this->_Default($default, $in['response']);

            $in['node_data']['user_name'] = self::PREFIX . '_' . $in['response']['data'];
            $in['step'] = 'step_check_shared_secret';
        }

        if ($in['step'] === 'step_check_shared_secret') {
            if (empty($in['node_data']['shared_secret']) === true) {
                $response = $this->internal_CreateSharedSecret();
                $in['node_data']['shared_secret'] = $response['shared_secret'];
            }
            $in['step'] = 'step_save_node_data';
        }
        
        if ($in['step'] === 'step_save_node_data') {
            return $this->_SubCall(array(
                'to' => array(
                    'node' => 'server',
                    'plugin' => 'infohub_storage',
                    'function' => 'write'
                ),
                'data' => array(
                    'path' => 'infohub_contact/node_data/' . $in['type'] . '/' . $in['node_data']['user_name'],
                    'data' => $in['node_data']
                ),
                'data_back' => array(
                    'step' => 'step_save_node_data_response'
                )
            ));
        }
        
        if ($in['step'] === 'step_save_node_data_response') {

            $default = array(
                'answer' => 'false',
                'message' => 'Nothing'
            );
            $in['response'] = $this->_Default($default, $in['response']);

            $out['answer'] = $in['response']['answer'];
            $out['message'] = $in['response']['message'];
            if ($out['answer'] === 'true') {
                $out['message'] = 'Finished saving node data';
                $out['ok'] = 'true';
            }
        }

        return array(
            'answer' => $out['answer'],
            'message' => $out['message'],
            'ok' => $out['ok']
        );
    }

    /**
     * Delete node data from Storage
     * @version 2019-01-16
     * @since   2019-01-16
     * @author  Peter Lembke
     * @param array $in
     * @return array
     */
    protected function delete_node_data(array $in = []): array
    {
        $default = array(
            'type' => 'server', // server or client
            'user_name' => '',
            'step' => 'step_delete_node_data',
            'response' => array(
                'answer' => 'false',
                'message' => 'Nothing'
            ),
            'from_plugin' => array(
                'node' => ''
            )
        );
        $in = $this->_Default($default, $in);

        $out = array(
            'answer' => 'false',
            'message' => 'Nothing to report from delete_node_data',
            'ok' => 'false'
        );

        if ($in['from_plugin']['node'] !== 'client') {
            $out['message'] = 'Only node client are allowed to use function delete_node_data';
            $in['step'] = 'step_end';
        }

        if ($in['step'] === 'step_delete_node_data') {
            return $this->_SubCall(array(
                'to' => array(
                    'node' => 'server',
                    'plugin' => 'infohub_storage',
                    'function' => 'write'
                ),
                'data' => array(
                    'path' => 'infohub_contact/node_data/' . $in['type'] . '/' . $in['user_name'],
                    'data' => ''
                ),
                'data_back' => array(
                    'step' => 'step_delete_node_data_response'
                )
            ));
        }
        
        if ($in['step'] === 'step_delete_node_data_response') {
            $out['answer'] = $in['response']['answer'];
            $out['message'] = $in['response']['message'];
            if ($out['answer'] === 'true') {
                $out['message'] = 'Finished deleting node data';
                $out['ok'] = 'true';
            }
        }

        return array(
            'answer' => $out['answer'],
            'message' => $out['message'],
            'ok' => $out['ok']
        );
    }

    /**
     * Load node data from Storage
     * Also used by server->infohub_login
     * @version 2020-07-07
     * @since   2019-01-16
     * @author  Peter Lembke
     * @param array $in
     * @return array
     */
    protected function load_node_data(array $in = []): array
    {
        $default = array(
            'type' => 'server', // server or client
            'user_name' => '',
            'step' => 'step_load_node_data',
            'response' => array(
                'answer' => 'false',
                'message' => '',
                'data' => [],
                'post_exist' => 'false'
            ),
            'config' => array(
                'contact' => array(
                    'node' => '',
                    'note' => '',
                    'domain_address' => '',
                    'user_name' => '',
                    'shared_secret' => '',
                    'role_list' => []
                )
            ),
            'from_plugin' => array(
                'node' => '',
                'plugin' => ''
            )
        );
        $in = $this->_Default($default, $in);

        $out = array(
            'answer' => 'false',
            'message' => 'Nothing to report from load_node_data',
            'node_data' => [],
            'ok' => 'false',
            'post_exist' => 'false'
        );

        $node = $in['from_plugin']['node'];
        $plugin = $in['from_plugin']['plugin'];

        if ($node !== 'client' && $node !== 'server') {
            $out['message'] = 'Only node client or node server are allowed to use function load_node_data';
            $in['step'] = 'step_end';
        }

        if ($node === 'server' && $plugin !== 'infohub_login') {
            $out['message'] = 'Only server->infohub_session are allowed to use function load_node_data';
            $in['step'] = 'step_end';
        }

        if ($in['step'] === 'step_load_node_data') {
            return $this->_SubCall(array(
                'to' => array(
                    'node' => 'server',
                    'plugin' => 'infohub_storage',
                    'function' => 'read'
                ),
                'data' => array(
                    'path' => 'infohub_contact/node_data/' . $in['type'] . '/' . $in['user_name']
                ),
                'data_back' => array(
                    'type' => $in['type'],
                    'user_name' => $in['user_name'],
                    'config' => [],
                    'step' => 'step_load_node_data_response'
                )
            ));
        }
        
        if ($in['step'] === 'step_load_node_data_response')
        {
            $out['answer'] = $in['response']['answer'];
            $out['message'] = $in['response']['message'];

            if ($out['answer'] === 'true') {
                if ($in['response']['post_exist'] === 'true') {
                    $out['message'] = 'Finished loading node data';
                    $out['ok'] = 'true';
                    $out['node_data'] = $in['response']['data'];
                    $out['post_exist'] = 'true';
                } else {
                    if ($in['config']['contact']['user_name'] === $in['user_name']) {
                        $out['message'] = 'Finished loading node data from config';
                        $out['ok'] = 'true';
                        $out['node_data'] = $in['config']['contact'];
                        $out['post_exist'] = 'true'; // Well we found the post in the config file
                    }
                }
            }
        }

        $default = array(
            'node' => '',
            'note' => '',
            'domain_address' => '',
            'user_name' => '',
            'shared_secret' => '',
            'role_list' => []
        );
        $out['node_data'] = $this->_Default($default, $out['node_data']);
        
        return array(
            'answer' => $out['answer'],
            'message' => $out['message'],
            'node_data' => $out['node_data'],
            'ok' => $out['ok'],
            'post_exist' => $out['post_exist']
        );
    }

    /**
     * Load node list from Storage
     * @version 2019-01-16
     * @since   2019-01-16
     * @author  Peter Lembke
     * @param array $in
     * @return array
     */
    protected function load_node_list(array $in = []): array
    {
        $default = array(
            'type' => 'server', // server or client
            'step' => 'step_load_node_list',
            'response' => [],
            'data_back' => [],
            'from_plugin' => array(
                'node' => ''
            )
        );
        $in = $this->_Default($default, $in);

        $out = array(
            'answer' => 'false',
            'message' => 'Nothing to report from load_node_list',
            'ok' => 'false',
            'node_list' => [],
            'options' => [],
            'post_exist' => 'false'
        );

        if ($in['from_plugin']['node'] !== 'client') {
            $out['message'] = 'Only node client are allowed to use function load_node_list';
            $in['step'] = 'step_end';
        }

        if ($in['step'] === 'step_load_node_list') {
            return $this->_SubCall(array(
                'to' => array(
                    'node' => 'server',
                    'plugin' => 'infohub_storage',
                    'function' => 'read_pattern'
                ),
                'data' => array(
                    'path' => 'infohub_contact/node_data/' . $in['type'] . '/*'
                ),
                'data_back' => array(
                    'type' => $in['type'],
                    'step' => 'step_load_node_list_response'
                )
            ));
        }
        
        if ($in['step'] === 'step_load_node_list_response') {

            $default = array(
                'answer' => 'false',
                'message' => '',
                'items' => []
            );
            $in['response'] = $this->_Default($default, $in['response']);

            $out['answer'] = $in['response']['answer'];
            $out['message'] = $in['response']['message'];
            if ($out['answer'] === 'true') {
                $out['message'] = 'Finished loading node list';
                $out['node_list'] = $in['response']['items'];
                $in['step'] = 'step_clean_list';
            }
        }
        
        if ($in['step'] === 'step_clean_list') {
            $default = array(
                'node' => '',
                'note' => '',
                'domain_address' => '',
                'user_name' => '',
                'role_list' => []
            );

            foreach ($out['node_list'] as $node => $data) {
                $out['node_list'][$node] = $this->_Default($default, $data);
                $nodeName = $out['node_list'][$node]['node'];
                $userName = $out['node_list'][$node]['user_name'];
                $out['options'][] = array(
                    "type" => "option",
                    "value" => $userName,
                    "label" => $nodeName
                );
            }
            $out['ok'] = 'true';

        }

        return array(
            'answer' => $out['answer'],
            'message' => $out['message'],
            'node_list' => $out['node_list'],
            'options' => $out['options'],
            'ok' => $out['ok']
        );
    }
    
    /**
     * Create a shared secret string
     * @version 2019-08-31
     * @since   2019-01-16
     * @author  Peter Lembke
     * @param array $in
     * @return array
     */
    protected function internal_CreateSharedSecret(array $in = []): array
    {
        $default = array(
            'length' => 2048
        );
        $in = $this->_Default($default, $in);

        try {
            $sharedSecret = random_bytes($in['length']);
        } catch (\Exception $e) {
            $sharedSecret = '';
        }

        $sharedSecretBase64 = base64_encode($sharedSecret);

        return array(
            'answer' => 'true',
            'message' => 'Here are the shared secret',
            'shared_secret' => $sharedSecretBase64
        );
    }

    /**
     * Load user role list from infohub_file
     * You get a list with role (user,developer,admin) and their associated plugins.
     * Each plugin name point to the role name.
     * @version 2020-08-02
     * @since   2019-02-23
     * @author  Peter Lembke
     * @param array $in
     * @return array
     */
    protected function load_role_list(array $in = []): array
    {
        $default = array(
            'node' => 'server',
            'step' => 'step_load_role_list',
            'response' => [],
            'data_back' => [],
            'from_plugin' => array(
                'node' => ''
            )
        );
        $in = $this->_Default($default, $in);

        $answer = 'false';
        $message = 'Nothing to report from load_role_list';
        $ok = 'false';
        $roleList = [];

        if ($in['from_plugin']['node'] !== 'client') {
            $message = 'Only node client are allowed to use function load_role_list';
            $in['step'] = 'step_end';
        }

        if ($in['step'] === 'step_load_role_list') {
            return $this->_SubCall(array(
                'to' => array(
                    'node' => 'server',
                    'plugin' => 'infohub_file',
                    'function' => 'load_role_list'
                ),
                'data' => array(
                    'node' => $in['node']
                ),
                'data_back' => array(
                    'step' => 'step_load_role_list_response'
                )
            ));
        }
        
        if ($in['step'] === 'step_load_role_list_response') {

            $default = array(
                'answer' => 'false',
                'message' => '',
                'role_list' => []
            );
            $in['response'] = $this->_Default($default, $in['response']);

            $answer = $in['response']['answer'];
            $message = $in['response']['message'];            
            if ($answer === 'true') {
                $message = 'Finished loading role list';
                $roleList = $in['response']['role_list'];
                $in['step'] = 'step_option_list';
            }
        }
        
        if ($in['step'] === 'step_option_list') {
            foreach ($roleList as $name => $data) {
                $options[] = array("type" => "option", "value" => $name, "label" => $name);
            }
            $ok = 'true';
        }

        return array(
            'answer' => $answer,
            'message' => $message,
            'role_list' => $roleList,
            'options' => $options,
            'ok' => $ok
        );
    }

    /**
     * Get a doc file
     * @version 2019-03-14
     * @since   2019-03-14
     * @author  Peter Lembke
     * @param array $in
     * @return array
     */
    protected function get_doc_file(array $in = []): array
    {
        $default = array(
            'file' => 'infohub_contact',
            'step' => 'step_read_doc_file',
            'response' => array(
                'answer' => 'false',
                'message' => 'Nothing to report from get_doc_file',
                'contents' => '',
                'checksum' => ''
            ),
            'data_back' => [],
            'from_plugin' => array(
                'node' => ''
            )
        );
        $in = $this->_Default($default, $in);

        if ($in['from_plugin']['node'] !== 'client') {
            $in['response']['message'] = 'Only node client are allowed to use function get_doc_file';
            $in['step'] = 'step_end';
        }

        if ($in['step'] === 'step_read_doc_file') {
            return $this->_SubCall(array(
                'to' => array(
                    'node' => 'server',
                    'plugin' => 'infohub_file',
                    'function' => 'read'
                ),
                'data' => array(
                    'path' => $in['file'] . '.md',
                    'folder' => 'plugin'
                ),
                'data_back' => array(
                    'step' => 'step_end'
                )
            ));
        }

        return array(
            'answer' => $in['response']['answer'],
            'message' => $in['response']['message'],
            'contents' => $in['response']['contents'],
            'checksum' => $in['response']['checksum']
        );
    }
}