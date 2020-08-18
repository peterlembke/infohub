<?php
declare(strict_types=1);
if (basename(__FILE__) == basename($_SERVER["SCRIPT_FILENAME"])) {
    exit; // This file must be included, not called directly
}

/**
 * infohub_demo_storage help the client cersion of this plugin to store data
 * @category InfoHub
 * @package demo
 * @copyright Copyright (c) 2020, Peter Lembke, CharZam soft
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
class infohub_demo_storage extends infohub_base
{
    protected final function _Version(): array
    {
        return array(
            'date' => '2020-06-23',
            'version' => '1.0.0',
            'class_name' => 'infohub_demo_storage',
            'checksum' => '{{checksum}}',
            'note' => 'Show how to read/write from Storage',
            'status' => 'normal',
            'SPDX-License-Identifier' => 'GPL-3.0-or-later',
            'user_role' => 'user'
        );
    }

    protected function _GetCmdFunctions(): array
    {
        return array(
            'read' => 'normal',
            'write' => 'normal',
            'read_many' => 'normal',
            'write_many' => 'normal',
            'read_pattern' => 'normal',
            'write_pattern' => 'normal'
        );
    }

    /**
     * Read from Storage
     * @version 2020-06-27
     * @since   2020-06-26
     * @author  Peter Lembke
     * @param array $in
     * @return array
     */
    final protected function read(array $in = array()): array
    {
        $default = array(
            'path' => '',
            'wanted_data' => array(),
            'step' => 'step_call_storage',
            'response' => array()
        );
        $in = $this->_Default($default, $in);

        $out = array(
            'answer' => 'false',
            'message' => 'Could not read from Storage',
            'post_exist' => 'false',
            'path' => '',
            'data' => array()
        );

        if ($in['step'] === 'step_call_storage') {
            return $this->_Subcall(array(
                'to' => array(
                    'node' => 'server',
                    'plugin' => 'infohub_storage',
                    'function' => 'read'
                ),
                'data' => array(
                    'path' => $in['path'],
                    'wanted_data' => $in['wanted_data']
                ),
                'data_back' => array(
                    'step' => 'step_call_storage_response'
                )
            ));
        }

        if ($in['step'] === 'step_call_storage_response') {
            $default = array(
                'answer' => '',
                'message' => '',
                'post_exist' => 'false',
                'path' => '',
                'data' => array()
            );
            $out = $this->_Default($default, $in['response']);
        }

        return $out;
    }

    /**
     * Write to Storage
     * @version 2020-06-27
     * @since   2020-06-26
     * @author  Peter Lembke
     * @param array $in
     * @return array
     */
    final protected function write(array $in = array()): array
    {
        $default = array(
            'path' => '',
            'data' => array(),
            'mode' => '', // overwrite or merge
            'step' => 'step_call_storage',
            'response' => array()
        );
        $in = $this->_Default($default, $in);

        $out = array(
            'answer' => 'false',
            'message' => 'Could not write to Storage',
            'post_exist' => 'false',
            'path' => '',
            'data' => array()
        );

        if ($in['step'] === 'step_call_storage') {
            return $this->_Subcall(array(
                'to' => array(
                    'node' => 'server',
                    'plugin' => 'infohub_storage',
                    'function' => 'write'
                ),
                'data' => array(
                    'path' => $in['path'],
                    'data' => $in['data'],
                    'mode' => $in['mode']
                ),
                'data_back' => array(
                    'step' => 'step_call_storage_response'
                )
            ));
        }

        if ($in['step'] === 'step_call_storage_response') {
            $default = array(
                'answer' => '',
                'message' => '',
                'post_exist' => 'false',
                'path' => '',
                'data' => array()
            );
            $out = $this->_Default($default, $in['response']);
        }

        return $out;
    }

    /**
     * Read many paths from Storage
     * @version 2020-06-27
     * @since   2020-06-26
     * @author  Peter Lembke
     * @param array $in
     * @return array
     */
    final protected function read_many(array $in = array()): array
    {
        $default = array(
            'paths' => array(),
            'step' => 'step_call_storage',
            'response' => array()
        );
        $in = $this->_Default($default, $in);

        $out = array(
            'answer' => 'false',
            'message' => 'Could not read_many from Storage',
            'items' => array()
        );

        if ($in['step'] === 'step_call_storage') {
            return $this->_Subcall(array(
                'to' => array(
                    'node' => 'server',
                    'plugin' => 'infohub_storage',
                    'function' => 'read_many'
                ),
                'data' => array(
                    'paths' => $in['paths']
                ),
                'data_back' => array(
                    'step' => 'step_call_storage_response'
                )
            ));
        }

        if ($in['step'] === 'step_call_storage_response') {
            $default = array(
                'answer' => '',
                'message' => '',
                'items' => array()
            );
            $out = $this->_Default($default, $in['response']);
        }

        return $out;
    }

    /**
     * Write to many paths in Storage
     * @version 2020-06-27
     * @since   2020-06-26
     * @author  Peter Lembke
     * @param array $in
     * @return array
     */
    final protected function write_many(array $in = array()): array
    {
        $default = array(
            'paths' => array(),
            'mode' => '',
            'step' => 'step_call_storage',
            'response' => array()
        );
        $in = $this->_Default($default, $in);

        $out = array(
            'answer' => 'false',
            'message' => 'Could not write_many to Storage',
            'items' => array()
        );

        if ($in['step'] === 'step_call_storage') {
            return $this->_Subcall(array(
                'to' => array(
                    'node' => 'server',
                    'plugin' => 'infohub_storage',
                    'function' => 'write_many'
                ),
                'data' => array(
                    'paths' => $in['paths'],
                    'mode' => $in['mode']
                ),
                'data_back' => array(
                    'step' => 'step_call_storage_response'
                )
            ));
        }

        if ($in['step'] === 'step_call_storage_response') {
            $default = array(
                'answer' => '',
                'message' => '',
                'items' => array()
            );
            $out = $this->_Default($default, $in['response']);
        }

        return $out;
    }

    /**
     * Read from Storage with a pattern
     * @version 2020-06-27
     * @since   2020-06-26
     * @author  Peter Lembke
     * @param array $in
     * @return array
     */
    final protected function read_pattern(array $in = array()): array
    {
        $default = array(
            'path' => '',
            'wanted_data' => array(),
            'step' => 'step_call_storage',
            'response' => array()
        );
        $in = $this->_Default($default, $in);

        $out = array(
            'answer' => 'false',
            'message' => 'Could not read_pattern from Storage',
            'items' => array()
        );

        if ($in['step'] === 'step_call_storage') {
            return $this->_Subcall(array(
                'to' => array(
                    'node' => 'server',
                    'plugin' => 'infohub_storage',
                    'function' => 'read_pattern'
                ),
                'data' => array(
                    'path' => $in['path'],
                    'wanted_data' => $in['wanted_data']
                ),
                'data_back' => array(
                    'step' => 'step_call_storage_response'
                )
            ));
        }

        if ($in['step'] === 'step_call_storage_response') {
            $default = array(
                'answer' => '',
                'message' => '',
                'items' => array()
            );
            $out = $this->_Default($default, $in['response']);
        }

        return $out;
    }

    /**
     * Write to a pattern of paths
     * @version 2020-06-27
     * @since   2020-06-26
     * @author  Peter Lembke
     * @param array $in
     * @return array
     */
    final protected function write_pattern(array $in = array()): array
    {
        $default = array(
            'path' => '',
            'mode' => '',
            'data' => array(),
            'step' => 'step_call_storage',
            'response' => array()
        );
        $in = $this->_Default($default, $in);

        $out = array(
            'answer' => 'false',
            'message' => 'Could not write_pattern to Storage',
            'items' => array()
        );

        if ($in['step'] === 'step_call_storage') {
            return $this->_Subcall(array(
                'to' => array(
                    'node' => 'server',
                    'plugin' => 'infohub_storage',
                    'function' => 'write_pattern'
                ),
                'data' => array(
                    'path' => $in['path'],
                    'mode' => $in['mode'],
                    'data' => $in['data']
                ),
                'data_back' => array(
                    'step' => 'step_call_storage_response'
                )
            ));
        }

        if ($in['step'] === 'step_call_storage_response') {
            $default = array(
                'answer' => '',
                'message' => '',
                'items' => array()
            );
            $out = $this->_Default($default, $in['response']);
        }

        return $out;
    }
}
