<?php
/**
 * infohub_demo_storage help the client version of this plugin to store data
 *
 * @package     Infohub
 * @subpackage  infohub_demo_storage
 */

declare(strict_types=1);
if (basename(__FILE__) == basename($_SERVER["SCRIPT_FILENAME"])) {
    exit; // This file must be included, not called directly
}

/**
 * infohub_demo_storage help the client version of this plugin to store data
 *
 * @author      Peter Lembke <info@infohub.se>
 * @version     2020-06-23
 * @since       2020-06-23
 * @copyright   Copyright (c) 2020, Peter Lembke
 * @license     https://opensource.org/licenses/gpl-license.php GPL-3.0-or-later
 * @see         https://github.com/peterlembke/infohub/blob/master/folder/plugins/infohub/storage/data/infohub_storage_data.md Documentation
 * @link        https://infohub.se/ InfoHub main page
 */
class infohub_demo_storage extends infohub_base
{
    /**
     * Version information for this plugin
     *
     * @version 2020-06-23
     * @since   2020-06-23
     * @author  Peter Lembke
     * @return string[]
     */
    protected function _Version(): array
    {
        return array(
            'date' => '2020-06-23',
            'since' => '2020-06-23',
            'version' => '1.0.0',
            'class_name' => 'infohub_demo_storage',
            'checksum' => '{{checksum}}',
            'note' => 'Show how to read/write from Storage',
            'status' => 'normal',
            'SPDX-License-Identifier' => 'GPL-3.0-or-later',
            'user_role' => 'user'
        );
    }

    /**
     * Public functions in this plugin
     *
     * @version 2020-06-23
     * @since   2020-06-23
     * @author  Peter Lembke
     * @return mixed
     */
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
    protected function read(array $in = []): array
    {
        $default = array(
            'path' => '',
            'wanted_data' => [],
            'step' => 'step_call_storage',
            'response' => []
        );
        $in = $this->_Default($default, $in);

        $out = array(
            'answer' => 'false',
            'message' => 'Could not read from Storage',
            'post_exist' => 'false',
            'path' => '',
            'data' => []
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
                'data' => []
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
    protected function write(array $in = []): array
    {
        $default = array(
            'path' => '',
            'data' => [],
            'mode' => '', // overwrite or merge
            'step' => 'step_call_storage',
            'response' => []
        );
        $in = $this->_Default($default, $in);

        $out = array(
            'answer' => 'false',
            'message' => 'Could not write to Storage',
            'post_exist' => 'false',
            'path' => '',
            'data' => []
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
                'data' => []
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
    protected function read_many(array $in = []): array
    {
        $default = array(
            'paths' => [],
            'step' => 'step_call_storage',
            'response' => []
        );
        $in = $this->_Default($default, $in);

        $out = array(
            'answer' => 'false',
            'message' => 'Could not read_many from Storage',
            'items' => []
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
                'items' => []
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
    protected function write_many(array $in = []): array
    {
        $default = array(
            'paths' => [],
            'mode' => '',
            'step' => 'step_call_storage',
            'response' => []
        );
        $in = $this->_Default($default, $in);

        $out = array(
            'answer' => 'false',
            'message' => 'Could not write_many to Storage',
            'items' => []
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
                'items' => []
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
    protected function read_pattern(array $in = []): array
    {
        $default = array(
            'path' => '',
            'wanted_data' => [],
            'step' => 'step_call_storage',
            'response' => []
        );
        $in = $this->_Default($default, $in);

        $out = array(
            'answer' => 'false',
            'message' => 'Could not read_pattern from Storage',
            'items' => []
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
                'items' => []
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
    protected function write_pattern(array $in = []): array
    {
        $default = array(
            'path' => '',
            'mode' => '',
            'data' => [],
            'step' => 'step_call_storage',
            'response' => []
        );
        $in = $this->_Default($default, $in);

        $out = array(
            'answer' => 'false',
            'message' => 'Could not write_pattern to Storage',
            'items' => []
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
                'items' => []
            );
            $out = $this->_Default($default, $in['response']);
        }

        return $out;
    }
}
