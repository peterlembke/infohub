<?php
/**
 * Sends out short tail messages, wait for the last one to return,
 * put together all answers and return them
 *
 * @package     Infohub
 * @subpackage  infohub_darkhold
 */

declare(strict_types=1);
if (basename(__FILE__) == basename($_SERVER["SCRIPT_FILENAME"])) {
    exit; // This file must be included, not called directly
}

/**
 * Sends out short tail messages, wait for the last one to return,
 * put together all answers and return them
 *
 * @author      Peter Lembke <info@infohub.se>
 * @version     2021-10-10
 * @since       2021-10-10
 * @copyright   Copyright (c) 2021, Peter Lembke
 * @license     https://opensource.org/licenses/gpl-license.php GPL-3.0-or-later
 * @see         https://github.com/peterlembke/infohub/blob/master/folder/plugins/infohub/darkhold/infohub_darkhold.md Documentation
 * @link        https://infohub.se/ InfoHub main page
 */
class infohub_darkhold extends infohub_base
{
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
            'date' => '2021-10-10',
            'since' => '2021-10-10',
            'version' => '1.0.0',
            'class_name' => 'infohub_darkhold',
            'checksum' => '{{checksum}}',
            'note' => 'Park the space ship and send out a swarm of smaller ships with messages. When the last small ship returns then the space ship can continue',
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
     * @version 2021-10-10
     * @since   2021-10-10
     */
    protected function _GetCmdFunctions(): array
    {
        $list = [
            'darkhold' => 'normal',
        ];

        return parent::_GetCmdFunctionsBase($list);
    }

    /**
     * The Darkhold function
     * @param array $in
     * @return array
     * @author  Peter Lembke
     * @version 2021-10-10
     * @since   2021-10-10
     */
    protected function darkhold(array $in = []): array
    {
        $default = [
            'step' => 'step_start',
            'response' => [],
            'data_back' => []
        ];
        $in = $this->_Default($default, $in);

        if ($in['step'] === 'step_start') {
            $a=1;
        }

        if ($in['step'] === 'step_start_response') {
            $a=1;
        }

        return [
            'answer' => 'true',
            'message' => 'Not implemented',
            'data' => []
        ];
    }
}