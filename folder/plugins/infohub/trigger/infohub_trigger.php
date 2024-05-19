<?php
/**
 * Dev tool
 *
 * Used by developers to send messages to emerging plugins
 *
 * @package     Infohub
 * @subpackage  infohub_trigger
 */

declare(strict_types=1);
if (basename(__FILE__) == basename($_SERVER['SCRIPT_FILENAME'])) {
    exit; // This file must be included, not called directly
}

/**
 * Dev tool
 *
 * Used by developers to send messages to emerging plugins
 *
 * @author      Peter Lembke <info@infohub.se>
 * @version     2020-09-12
 * @since       2020-08-12
 * @copyright   Copyright (c) 2020, Peter Lembke
 * @license     https://opensource.org/licenses/gpl-license.php GPL-3.0-or-later
 * @see         https://github.com/peterlembke/infohub/blob/master/folder/plugins/infohub/trigger/infohub_trigger.md Documentation
 * @link        https://infohub.se/ InfoHub main page
 */
class infohub_trigger extends infohub_base
{
    const PREFIX = 'user';

    /**
     * Version information for this plugin
     * @return  string[]
     * @since   2020-08-12
     * @author  Peter Lembke
     * @version 2020-09-12
     */
    protected function _Version(): array
    {
        return [
            'date' => '2020-09-12',
            'since' => '2020-08-12',
            'version' => '1.0.0',
            'class_name' => 'infohub_trigger',
            'checksum' => '{{checksum}}',
            'note' => 'Used by developers to send messages to emerging plugins',
            'status' => 'normal',
            'SPDX-License-Identifier' => 'GPL-3.0-or-later',
            'user_role' => 'developer'
        ];
    }

    /**
     * Public functions in this plugin
     *
     * @return array
     * @author  Peter Lembke
     * @version 2020-09-12
     * @since   2020-08-12
     */
    protected function _GetCmdFunctions(): array
    {
        $list = [
            'get_plugin_list' => 'normal'
        ];

        return parent::_GetCmdFunctionsBase($list);
    }

    /**
     * Get an array with nodes server/client and their emerging plugins and the php plugins functions list
     * You will not get functions list for the js plugins. That will happen if you select a plugin.
     * You will not get the default message for a plugin that will happen if you select a function
     * and press send with an empty message
     *
     * @param array $in
     * @return array
     * @author  Peter Lembke
     * @version 2022-03-26
     * @since   2020-08-12
     */
    protected function get_plugin_list(array $in = []): array
    {
        $default = [
            'plugin_status' => 'all', // all, emerging, normal, deprecated, removed
            'from_plugin' => [
                'node' => ''
            ],
            'response' => [],
            'step' => 'step_ask_file'
        ];
        $in = $this->_Default($default, $in);

        $out = [
            'answer' => 'false',
            'message' => 'Nothing to report from ' . $this->_GetClassName() . ' -> ' . __FUNCTION__,
            'data' => []
        ];

        if ($in['step'] === 'step_ask_file') {
            return $this->_SubCall(
                [
                    'to' => [
                        'node' => 'server',
                        'plugin' => 'infohub_file',
                        'function' => 'developer_get_all_plugin_data'
                    ],
                    'data' => [
                        'plugin_status' => $in['plugin_status']
                    ],
                    'data_back' => [
                        'step' => 'step_ask_file_response'
                    ]
                ]
            );
        }

        if ($in['step'] === 'step_ask_file_response') {
            $default = [
                'answer' => 'false',
                'message' => 'Nothing',
                'data' => []
            ];
            $out = $this->_Default($default, $in['response']);
        }

        return [
            'answer' => $out['answer'],
            'message' => $out['message'],
            'data' => $out['data']
        ];
    }
}