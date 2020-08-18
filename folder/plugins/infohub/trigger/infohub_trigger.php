<?php
declare(strict_types=1);
if (basename(__FILE__) == basename($_SERVER["SCRIPT_FILENAME"])) {
    exit; // This file must be included, not called directly
}

/**
 * infohub_contact show what the core can do
 * @category InfoHub
 * @package contact
 * @copyright Copyright (c) 2019, Peter Lembke, CharZam soft
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
class infohub_trigger extends infohub_base
{
    const PREFIX = 'user';

    /**
     * Data about this plugin. Used by infohub_base
     * @return array
     */
    protected final function _Version(): array
    {
        return array(
            'date' => '2020-09-12',
            'since' => '2020-09-12',
            'version' => '1.0.0',
            'class_name' => 'infohub_trigger',
            'checksum' => '{{checksum}}',
            'note' => 'Used by developers to send messages to emerging plugins',
            'status' => 'normal',
            'SPDX-License-Identifier' => 'GPL-3.0-or-later',
            'user_role' => 'developer'
        );
    }

    /**
     * Get a list with cmd functions. Used by infohub_base
     * @return array
     */
    protected function _GetCmdFunctions(): array
    {
        $list = array(
            'get_plugin_list' => 'normal'
        );

        return parent::_GetCmdFunctionsBase($list);
    }

    /**
     * Get an array with nodes server/client and their emerging plugins and the php plugins functions list
     * You will not get functions list for the js plugins. That will happen if you select a plugin.
     * You will not get the default message for a plugin that will happen if you select a function
     * and press send with an empty message
     * @version 2020-08-17
     * @since   2020-08-12
     * @author  Peter Lembke
     * @param array $in
     * @return array
     */
    final protected function get_plugin_list(array $in = array()): array
    {
        $default = array(
            'from_plugin' => array(
                'node' => ''
            ),
            'response' => array(),
            'step' => 'step_ask_file'
        );
        $in = $this->_Default($default, $in);

        $out = array(
            'answer' => 'false',
            'message' => 'Nothing to report from ' . $this->_GetClassName() . ' -> ' . __FUNCTION__,
            'data' => array()
        );

        if ($in['step'] === 'step_ask_file') {
            return $this->_SubCall(array(
                'to' => array(
                    'node' => 'server',
                    'plugin' => 'infohub_file',
                    'function' => 'developer_get_all_plugin_data'
                ),
                'data' => array(
                    'plugin_status' => 'emerging'
                ),
                'data_back' => array(
                    'step' => 'step_ask_file_response'
                )
            ));
        }

        if ($in['step'] === 'step_ask_file_response') {
            $default = array(
                'answer' => 'false',
                'message' => 'Nothing',
                'data' => array()
            );
            $out = $this->_Default($default, $in['response']);
        }

        return array(
            'answer' => $out['answer'],
            'message' => $out['message'],
            'data' => $out['data']
        );
    }
}