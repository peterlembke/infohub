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
     * @return string[]
     * @since   2020-06-23
     * @author  Peter Lembke
     * @version 2020-06-23
     */
    protected function _Version(): array
    {
        return [
            'date' => '2020-06-23',
            'since' => '2020-06-23',
            'version' => '1.0.0',
            'class_name' => 'infohub_demo_storage',
            'checksum' => '{{checksum}}',
            'note' => 'Show how to read/write from Storage',
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
     * @version 2020-06-23
     * @since   2020-06-23
     */
    protected function _GetCmdFunctions(): array
    {
        $list = [
            'read' => 'normal',
            'write' => 'normal',
            'read_many' => 'normal',
            'write_many' => 'normal',
            'read_pattern' => 'normal',
            'write_pattern' => 'normal'
        ];

        return parent::_GetCmdFunctionsBase($list);
    }

    /**
     * Read from Storage
     * @param array $in
     * @return array
     * @author  Peter Lembke
     * @version 2020-06-27
     * @since   2020-06-26
     */
    protected function read(array $in = []): array
    {
        $default = [
            'path' => '',
            'wanted_data' => [],
            'step' => 'step_call_storage',
            'response' => []
        ];
        $in = $this->_Default($default, $in);

        $out = [
            'answer' => 'false',
            'message' => 'Could not read from Storage',
            'post_exist' => 'false',
            'path' => '',
            'data' => []
        ];

        if ($in['step'] === 'step_call_storage') {
            return $this->_Subcall(
                [
                    'to' => [
                        'node' => 'server',
                        'plugin' => 'infohub_storage',
                        'function' => 'read'
                    ],
                    'data' => [
                        'path' => $in['path'],
                        'wanted_data' => $in['wanted_data']
                    ],
                    'data_back' => [
                        'step' => 'step_call_storage_response'
                    ]
                ]
            );
        }

        if ($in['step'] === 'step_call_storage_response') {
            $default = [
                'answer' => '',
                'message' => '',
                'post_exist' => 'false',
                'path' => '',
                'data' => []
            ];
            $out = $this->_Default($default, $in['response']);
        }

        return $out;
    }

    /**
     * Write to Storage
     * @param array $in
     * @return array
     * @author  Peter Lembke
     * @version 2020-06-27
     * @since   2020-06-26
     */
    protected function write(array $in = []): array
    {
        $default = [
            'path' => '',
            'data' => [],
            'mode' => '', // overwrite or merge
            'step' => 'step_call_storage',
            'response' => []
        ];
        $in = $this->_Default($default, $in);

        $out = [
            'answer' => 'false',
            'message' => 'Could not write to Storage',
            'post_exist' => 'false',
            'path' => '',
            'data' => []
        ];

        if ($in['step'] === 'step_call_storage') {
            return $this->_Subcall(
                [
                    'to' => [
                        'node' => 'server',
                        'plugin' => 'infohub_storage',
                        'function' => 'write'
                    ],
                    'data' => [
                        'path' => $in['path'],
                        'data' => $in['data'],
                        'mode' => $in['mode']
                    ],
                    'data_back' => [
                        'step' => 'step_call_storage_response'
                    ]
                ]
            );
        }

        if ($in['step'] === 'step_call_storage_response') {
            $default = [
                'answer' => '',
                'message' => '',
                'post_exist' => 'false',
                'path' => '',
                'data' => []
            ];
            $out = $this->_Default($default, $in['response']);
        }

        return $out;
    }

    /**
     * Read many paths from Storage
     * @param array $in
     * @return array
     * @author  Peter Lembke
     * @version 2020-06-27
     * @since   2020-06-26
     */
    protected function read_many(array $in = []): array
    {
        $default = [
            'paths' => [],
            'step' => 'step_call_storage',
            'response' => []
        ];
        $in = $this->_Default($default, $in);

        $out = [
            'answer' => 'false',
            'message' => 'Could not read_many from Storage',
            'items' => []
        ];

        if ($in['step'] === 'step_call_storage') {
            return $this->_Subcall(
                [
                    'to' => [
                        'node' => 'server',
                        'plugin' => 'infohub_storage',
                        'function' => 'read_many'
                    ],
                    'data' => [
                        'paths' => $in['paths']
                    ],
                    'data_back' => [
                        'step' => 'step_call_storage_response'
                    ]
                ]
            );
        }

        if ($in['step'] === 'step_call_storage_response') {
            $default = [
                'answer' => '',
                'message' => '',
                'items' => []
            ];
            $out = $this->_Default($default, $in['response']);
        }

        return $out;
    }

    /**
     * Write to many paths in Storage
     * @param array $in
     * @return array
     * @author  Peter Lembke
     * @version 2020-06-27
     * @since   2020-06-26
     */
    protected function write_many(array $in = []): array
    {
        $default = [
            'paths' => [],
            'mode' => '',
            'step' => 'step_call_storage',
            'response' => []
        ];
        $in = $this->_Default($default, $in);

        $out = [
            'answer' => 'false',
            'message' => 'Could not write_many to Storage',
            'items' => []
        ];

        if ($in['step'] === 'step_call_storage') {
            return $this->_Subcall(
                [
                    'to' => [
                        'node' => 'server',
                        'plugin' => 'infohub_storage',
                        'function' => 'write_many'
                    ],
                    'data' => [
                        'paths' => $in['paths'],
                        'mode' => $in['mode']
                    ],
                    'data_back' => [
                        'step' => 'step_call_storage_response'
                    ]
                ]
            );
        }

        if ($in['step'] === 'step_call_storage_response') {
            $default = [
                'answer' => '',
                'message' => '',
                'items' => []
            ];
            $out = $this->_Default($default, $in['response']);
        }

        return $out;
    }

    /**
     * Read from Storage with a pattern
     * @param array $in
     * @return array
     * @author  Peter Lembke
     * @version 2020-06-27
     * @since   2020-06-26
     */
    protected function read_pattern(array $in = []): array
    {
        $default = [
            'path' => '',
            'wanted_data' => [],
            'step' => 'step_call_storage',
            'response' => []
        ];
        $in = $this->_Default($default, $in);

        $out = [
            'answer' => 'false',
            'message' => 'Could not read_pattern from Storage',
            'items' => []
        ];

        if ($in['step'] === 'step_call_storage') {
            return $this->_Subcall(
                [
                    'to' => [
                        'node' => 'server',
                        'plugin' => 'infohub_storage',
                        'function' => 'read_pattern'
                    ],
                    'data' => [
                        'path' => $in['path'],
                        'wanted_data' => $in['wanted_data']
                    ],
                    'data_back' => [
                        'step' => 'step_call_storage_response'
                    ]
                ]
            );
        }

        if ($in['step'] === 'step_call_storage_response') {
            $default = [
                'answer' => '',
                'message' => '',
                'items' => []
            ];
            $out = $this->_Default($default, $in['response']);
        }

        return $out;
    }

    /**
     * Write to a pattern of paths
     * @param array $in
     * @return array
     * @author  Peter Lembke
     * @version 2020-06-27
     * @since   2020-06-26
     */
    protected function write_pattern(array $in = []): array
    {
        $default = [
            'path' => '',
            'mode' => '',
            'data' => [],
            'step' => 'step_call_storage',
            'response' => []
        ];
        $in = $this->_Default($default, $in);

        $out = [
            'answer' => 'false',
            'message' => 'Could not write_pattern to Storage',
            'items' => []
        ];

        if ($in['step'] === 'step_call_storage') {
            return $this->_Subcall(
                [
                    'to' => [
                        'node' => 'server',
                        'plugin' => 'infohub_storage',
                        'function' => 'write_pattern'
                    ],
                    'data' => [
                        'path' => $in['path'],
                        'mode' => $in['mode'],
                        'data' => $in['data']
                    ],
                    'data_back' => [
                        'step' => 'step_call_storage_response'
                    ]
                ]
            );
        }

        if ($in['step'] === 'step_call_storage_response') {
            $default = [
                'answer' => '',
                'message' => '',
                'items' => []
            ];
            $out = $this->_Default($default, $in['response']);
        }

        return $out;
    }
}
