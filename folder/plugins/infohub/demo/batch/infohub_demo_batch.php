<?php
/**
 * infohub_demo_batch show how to send batch messages and get the call stack on the last returning message
 *
 * @package     Infohub
 * @subpackage  infohub_asset
 */

declare(strict_types = 1);

if (basename(__FILE__) == basename($_SERVER['SCRIPT_FILENAME'])) {
    exit; // This file must be included, not called directly
}

/**
 * infohub_demo_batch show how to send batch messages and get the call stack on the last returning message
 *
 * @author      Peter Lembke <info@infohub.se>
 * @version     2024-01-20
 * @since       2024-01-20
 * @copyright   Copyright (c) 2024, Peter Lembke
 * @license     https://opensource.org/licenses/gpl-license.php GPL-3.0-or-later
 * @see         https://github.com/peterlembke/infohub/blob/master/folder/plugins/infohub/demo/batch/infohub_demo_batch.md
 *     Documentation
 * @link        https://infohub.se/ InfoHub main page
 */
class infohub_demo_batch extends infohub_base
{
    /**
     * Version information for this plugin
     *
     * @return  string[]
     * @since   2017-12-03
     * @author  Peter Lembke
     * @version 2018-01-22
     */
    protected function _Version(): array
    {
        return [
            'date' => '2024-01-20',
            'since' => '2024-01-20',
            'version' => '1.0.0',
            'class_name' => 'infohub_demo_batch',
            'checksum' => '{{checksum}}',
            'note' => 'Shows how to send batch messages',
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
     * @version 2024-01-20
     * @since   2024-01-20
     */
    protected function _GetCmdFunctions(): array
    {
        $list = [
            'get_id' => 'normal',
        ];

        return parent::_GetCmdFunctionsBase($list);
    }

    /**
     * Show how to send messages in a batch
     *
     * @param  array  $in
     * @return array
     * @author  Peter Lembke
     * @version 2024-01-20
     * @since   2024-01-20
     */
    protected function get_id(array $in = []): array
    {
        $default = [
            'from_plugin' => ['node' => '', 'plugin' => '', 'function' => ''],
            'data' => [],
            'data_back' => [],
            'step' => 'step_get_id',
        ];
        $in = $this->_Default($default, $in);

        $hubId = $this->_HubId();

        $response = [
            'answer' => 'true',
            'message' => 'Here is the answer',
            'hub_id' => $hubId
        ];
        return $response;
    }
}
