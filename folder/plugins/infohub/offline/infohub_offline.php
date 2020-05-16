<?php
declare(strict_types=1);
if (basename(__FILE__) == basename($_SERVER["SCRIPT_FILENAME"])) {
    exit; // This file must be included, not called directly
}

/**
 * infohub_demo show what the core can do
 * @category InfoHub
 * @package offline
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
class infohub_offline extends infohub_base
{
    protected final function _Version(): array
    {
        return array(
            'date' => '2019-11-13',
            'version' => '1.0.0',
            'class_name' => 'infohub_offline',
            'checksum' => '{{checksum}}',
            'note' => 'Answers with the current checksum for index.php, then the client know if index.php need to be updated',
            'status' => 'normal',
            'SPDX-License-Identifier' => 'GPL-3.0-or-later',
            'recommended_security_group' => 'user'
        );
    }

    protected function _GetCmdFunctions(): array
    {
        return array(
            'index_checksum' => 'normal'
        );
    }

    // Documentation: http://127.0.0.1/infohub/doc/plugin/name/infohub_demo

    /**
     * Get current checksum for the files in index.php
     * @version 2019-11-13
     * @since   2019-11-13
     * @author  Peter Lembke
     * @param array $in
     * @return array
     */
    final protected function index_checksum(array $in = array()): array
    {
        $default = array(
            'rendered_checksum' => '',
            'step' => 'step_start',
            'response' => array(
                'answer' => 'true',
                'message' => '',
                'checksum' => ''
            )
        );
        $in = $this->_Default($default, $in);

        if ($in['step'] === 'step_start')
        {
            return $this->_SubCall(array(
                'to' => array(
                    'node' => 'server',
                    'plugin' => 'infohub_file',
                    'function' => 'index_checksum'
                ),
                'data' => array(),
                'data_back' => array(
                    'step' => 'step_response',
                    'rendered_checksum' => $in['rendered_checksum']
                )
            ));
        }

        $valid = 'false';
        $message = 'Please update your cache';

        if ($in['step'] === 'step_response')
        {
            if ($in['rendered_checksum'] ===  $in['response']['checksum'])
            {
                $valid = 'true';
                $message = 'Your cache is still valid';
            }
        }

        return array(
            'answer' => 'true',
            'message' => $message,
            'checksum' => $in['response']['checksum'],
            'valid' => $valid
        );
    }
}
