<?php
/**
 * infohub_storage store data in databases and is part of InfoHub.
 *
 * Support for SQLite3, MySQL, PostgreSQL, Future support:Oracle, MS SQL
 * All data are stored in tables that holds keys and values.
 * Started writing code 2010-04-15 Peter Lembke - Team Fakta CharZam soft
 *
 * @package     Infohub
 * @subpackage  infohub_storage
 */

declare(strict_types=1);
if (basename(__FILE__) == basename($_SERVER["SCRIPT_FILENAME"])) {
    exit; // This file must be included, not called directly
}

/**
 * infohub_storage store data in databases and is part of InfoHub.
 *
 * Support for SQLite3, MySQL, PostgreSQL, Future support:Oracle, MS SQL
 * All data are stored in tables that holds keys and values.
 * Started writing code 2010-04-15 Peter Lembke - Team Fakta CharZam soft
 *
 * @author      Peter Lembke <info@infohub.se>
 * @version     2020-09-12
 * @since       2010-04-15
 * @copyright   Copyright (c) 2020, Peter Lembke, CharZam soft
 * @license     https://opensource.org/licenses/gpl-license.php GPL-3.0-or-later
 * @see         https://github.com/peterlembke/infohub/blob/master/folder/plugins/infohub/storage/infohub_storage.md Documentation
 * @link        https://infohub.se/ InfoHub main page
 */
class infohub_storage extends infohub_base
{
    /**
     * Version information for this plugin
     * @return  string[]
     * @since   2010-04-15
     * @author  Peter Lembke
     * @version 2020-09-12
     */
    protected function _Version(): array
    {
        return [
            'date' => '2020-09-12',
            'since' => '2010-04-15',
            'version' => '1.3.0',
            'class_name' => 'infohub_storage',
            'checksum' => '{{checksum}}',
            'note' => 'Store your data. Simple, Stand alone',
            'status' => 'normal',
            'SPDX-License-Identifier' => 'GPL-3.0-or-later',
            'user_role' => ''
        ];
    }

    /**
     * Public functions in this plugin
     * @return mixed
     * @since   2010-04-15
     * @author  Peter Lembke
     * @version 2020-09-12
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
     * The Storage path is always lower case and has no spaces.
     * Example: plugin_name/what/ever_you/like
     * @param string $path
     * @return string
     */
    protected function _TrimPath($path = ''): string
    {
        $newPath = strtolower(trim($path));
        $newPath = str_replace(' ', '_', $newPath);
        return $newPath;
    }

    /**
     * General function for reading data from a path
     * @param array $in
     * @return array
     * @author  Peter Lembke
     * @version 2017-07-20
     * @since   2016-01-30
     */
    protected function read(array $in = []): array
    {
        $default = [
            'path' => '',
            'wanted_data' => [],
            'step' => 'step_start',
            'from_plugin' => [
                'node' => '',
                'plugin' => ''
            ],
            'calling_plugin' => [
                'node' => '',
                'plugin' => ''
            ],
            'response' => []
        ];
        $in = $this->_Default($default, $in);

        $out = [
            'answer' => 'false',
            'message' => '',
            'path' => $in['path'],
            'data' => [],
            'wanted_data' => $in['wanted_data'],
            'post_exist' => 'false'
        ];

        if ($in['from_plugin']['node'] !== 'server') {
            $out['message'] = 'I only accept messages that origin from this server node';
            goto leave;
        }

        if ($in['from_plugin']['plugin'] === 'infohub_storage') {
            if ($this->_Empty($in['calling_plugin']['plugin']) === 'true') {
                $out['message'] = 'Infohub Storage must set calling_plugin before calling read';
                goto leave;
            }
            if ($in['calling_plugin']['node'] !== 'server') {
                $out['message'] = 'I only accept messages from this server node';
                goto leave;
            }
            $in['from_plugin']['plugin'] = $in['calling_plugin']['plugin'];
        }

        if (strpos($in['path'], $in['from_plugin']['plugin'] . '/') !== 0) {
            $row = 'Your plugin: %s, is not allowed to read this path: %s';
            $out['message'] = sprintf($row, $in['from_plugin']['plugin'], $in['path']);
            goto leave;
        }

        if ($in['step'] === 'step_start') {
            $in['path'] = $this->_TrimPath($in['path']);

            return $this->_SubCall(
                [
                    'to' => [
                        'node' => 'server',
                        'plugin' => 'infohub_storage_data',
                        'function' => 'read'
                    ],
                    'data' => [
                        'path' => $in['path'],
                        'calling_plugin' => $in['from_plugin']
                    ],
                    'data_back' => [
                        'path' => $in['path'],
                        'wanted_data' => $in['wanted_data'],
                        'calling_plugin' => $in['from_plugin'],
                        'step' => 'step_end'
                    ]
                ]
            );
        }

        if ($in['step'] === 'step_end') {
            $default = [
                'answer' => 'false',
                'message' => 'There was an error',
                'data' => [],
                'post_exist' => 'false',
            ];
            $in['response'] = $this->_Default($default, $in['response']);

            if ($this->_Empty($in['wanted_data']) === 'false') {
                $in['response']['data'] = $this->_Default($in['wanted_data'], $in['response']['data']);
            }

            $out['answer'] = $in['response']['answer'];
            $out['message'] = $in['response']['message'];
            $out['data'] = $in['response']['data'];
            $out['post_exist'] = $in['response']['post_exist'];
        }

        leave:
        return [
            'answer' => $out['answer'],
            'message' => $out['message'],
            'path' => $out['path'],
            'data' => $out['data'],
            'wanted_data' => $out['wanted_data'],
            'post_exist' => $out['post_exist']
        ];
    }

    /**
     * General function for writing to a path
     * @param array $in
     * @return array
     * @author  Peter Lembke
     * @version 2017-07-20
     * @since   2016-01-30
     */
    protected function write(array $in = []): array
    {
        $default = [
            'path' => '',
            'data' => [],
            'mode' => 'overwrite', // Overwrite or merge
            'step' => 'step_write',
            'from_plugin' => [
                'node' => '',
                'plugin' => ''
            ],
            'calling_plugin' => [ // A way to preserve the original from_plugin
                'node' => '',
                'plugin' => ''
            ],
            'response' => [],
            'data_back' => []
        ];
        $in = $this->_Default($default, $in);

        $out = [
            'answer' => 'false',
            'message' => '',
            'path' => $in['path'],
            'mode' => $in['mode'],
            'post_exist' => 'false'
        ];

        if ($in['from_plugin']['node'] !== 'server') {
            $out['message'] = 'I only accept messages that origin from this server node';
            goto leave;
        }

        if ($in['mode'] !== 'overwrite' && $in['mode'] !== 'merge') {
            $out['message'] = 'I only accept mode overwrite (default) or merge';
            goto leave;
        }

        if ($in['from_plugin']['plugin'] === 'infohub_storage') {
            if ($this->_Empty($in['calling_plugin']['plugin']) === 'true') {
                $out['message'] = 'Infohub Storage must set calling_plugin before calling read';
                goto leave;
            }
            if ($in['calling_plugin']['node'] !== 'server') {
                $out['message'] = 'I only accept messages from this server node';
                goto leave;
            }
            $in['from_plugin']['plugin'] = $in['calling_plugin']['plugin'];
        }

        if (strpos($in['path'], $in['from_plugin']['plugin'] . '/') !== 0) {
            $row = 'Your plugin: %s, is not allowed to read this path: %s';
            $out['message'] = sprintf($row, $in['from_plugin']['plugin'], $in['path']);
            goto leave;
        }

        if ($in['step'] === 'step_write') {
            $in['path'] = $this->_TrimPath($in['path']);
            ksort($in['data']);

            return $this->_SubCall(
                [
                    'to' => [
                        'node' => 'server',
                        'plugin' => 'infohub_storage_data',
                        'function' => 'write'
                    ],
                    'data' => [
                        'path' => $in['path'],
                        'data' => $in['data'],
                        'mode' => $in['mode'],
                        'calling_plugin' => $in['from_plugin']
                    ],
                    'data_back' => [
                        'path' => $in['path'],
                        'mode' => $in['mode'],
                        'calling_plugin' => $in['from_plugin'],
                        'step' => 'step_write_response'
                    ]
                ]
            );
        }

        if ($in['step'] === 'step_write_response') {
            $default = [
                'answer' => 'false',
                'message' => 'There was an error',
                'post_exist' => 'false',
            ];
            $in['response'] = $this->_Default($default, $in['response']);

            $out['answer'] = $in['response']['answer'];
            $out['message'] = $in['response']['message'];
            $out['post_exist'] = $in['response']['post_exist'];
        }

        leave:
        return [
            'answer' => $out['answer'],
            'message' => $out['message'],
            'path' => $out['path'],
            'mode' => $out['mode'],
            'post_exist' => $out['post_exist']
        ];
    }

    /**
     * General function for reading data from multiple paths
     * @param array $in
     * @return array
     * @author  Peter Lembke
     * @version 2018-03-14
     * @since   2018-03-14
     */
    protected function read_many(array $in = []): array
    {
        $default = [
            'paths' => [], // key = path, data array = wanted_data (default is empty to get all)
            'step' => 'step_start',
            'from_plugin' => [
                'node' => '',
                'plugin' => ''
            ],
            'calling_plugin' => [
                'node' => '',
                'plugin' => ''
            ],
            'response' => [
                'answer' => 'false',
                'message' => 'There was an error',
                'path' => '',
                'data' => [],
                'post_exist' => 'false'
            ],
            'data_back' => [
                'items' => []
            ]
        ];
        $in = $this->_Default($default, $in);

        if ($in['from_plugin']['node'] !== 'server') {
            $in['response']['message'] = 'I only accept messages that origin from this server node';
            goto leave;
        }

        if ($in['step'] === 'step_start') {
            if ($in['from_plugin']['plugin'] !== 'infohub_storage') {
                $in['calling_plugin'] = $in['from_plugin'];
            }

            $in['step'] = 'step_read';
        }

        if ($in['step'] === 'step_read_response') {
            $path = $in['response']['path'];
            $in['data_back']['items'][$path] = $in['response']['data'];
            $in['step'] = 'step_read';
        }

        if ($in['step'] === 'step_read') {
            if (count($in['paths']) > 0) {
                $pop = $this->_Pop($in['paths']);
                $pop['key'] = $this->_TrimPath($pop['key']);

                return $this->_SubCall(
                    [
                        'to' => [
                            'node' => 'server',
                            'plugin' => 'infohub_storage',
                            'function' => 'read'
                        ],
                        'data' => [
                            'path' => $pop['key'],
                            'wanted_data' => $pop['data'],
                            'calling_plugin' => $in['calling_plugin']
                        ],
                        'data_back' => [
                            'paths' => $pop['object'],
                            'items' => $in['data_back']['items'],
                            'calling_plugin' => $in['calling_plugin'],
                            'step' => 'step_read_response'
                        ]
                    ]
                );
            }
        }

        leave:
        return [
            'answer' => $in['response']['answer'],
            'message' => $in['response']['message'],
            'items' => $in['data_back']['items'],
        ];
    }

    /**
     * General function for writing different data to many paths
     * @param array $in
     * @return array
     * @author  Peter Lembke
     * @version 2018-03-14
     * @since   2018-03-14
     */
    protected function write_many(array $in = []): array
    {
        $default = [
            'paths' => [], // full path is key, data is what you want to store on that path.
            'mode' => 'overwrite',
            'step' => 'step_start',
            'from_plugin' => [
                'node' => '',
                'plugin' => ''
            ],
            'calling_plugin' => [
                'node' => '',
                'plugin' => ''
            ],
            'response' => [],
            'data_back' => [
                'items' => []
            ]
        ];
        $in = $this->_Default($default, $in);

        $out = [
            'answer' => 'false',
            'message' => 'message',
            'items' => []
        ];

        if ($in['from_plugin']['node'] !== 'server') {
            $out['message'] = 'I only accept messages that origin from this server node';
            goto leave;
        }

        if ($in['step'] === 'step_start') {
            if ($in['from_plugin']['plugin'] !== 'infohub_storage') {
                $in['calling_plugin'] = $in['from_plugin'];
            }

            $in['step'] = 'step_write_many';
        }

        if ($in['step'] === 'step_write_many_response') {
            $default = [
                'answer' => 'false',
                'message' => 'There was an error',
                'path' => '',
                'mode' => '',
                'post_exist' => 'false',
            ];
            $in['response'] = $this->_Default($default, $in['response']);

            $path = $in['response']['path'];
            $in['data_back']['items'][$path] = $in['response'];
            $in['step'] = 'step_write_many';
        }

        if ($in['step'] === 'step_write_many') {
            if (count($in['paths']) > 0) {
                $pop = $this->_Pop($in['paths']);
                $pop['key'] = $this->_TrimPath($pop['key']);

                return $this->_SubCall(
                    [
                        'to' => [
                            'node' => 'server',
                            'plugin' => 'infohub_storage',
                            'function' => 'write'
                        ],
                        'data' => [
                            'path' => $pop['key'],
                            'data' => $pop['data'],
                            'mode' => $in['mode'],
                            'calling_plugin' => $in['calling_plugin']
                        ],
                        'data_back' => [
                            'paths' => $pop['object'],
                            'items' => $in['data_back']['items'],
                            'mode' => $in['mode'],
                            'calling_plugin' => $in['calling_plugin'],
                            'step' => 'step_write_many_response'
                        ]
                    ]
                );
            }

            $out = [
                'answer' => $in['response']['answer'],
                'message' => $in['response']['message'],
                'items' => $in['data_back']['items']
            ];
        }

        leave:
        return [
            'answer' => $out['answer'],
            'message' => $out['message'],
            'items' => $out['items']
        ];
    }

    /**
     * General function for reading data from a path that end with *
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
            'step' => 'step_start',
            'from_plugin' => [
                'node' => '',
                'plugin' => ''
            ],
            'calling_plugin' => [ // A way to preserve the original from_plugin
                'node' => '',
                'plugin' => ''
            ],
            'response' => []
        ];
        $in = $this->_Default($default, $in);

        $out = [
            'answer' => 'false',
            'message' => 'Nothing to report from server storage read_pattern',
            'items' => []
        ];

        if ($in['from_plugin']['node'] !== 'server') {
            $in['response']['message'] = 'I only accept messages that origin from this server node';
            goto leave;
        }

        if ($in['step'] === 'step_start') {
            if ($in['from_plugin']['plugin'] !== 'infohub_storage') {
                $in['calling_plugin'] = $in['from_plugin'];
            }

            $in['step'] = 'step_read_paths';
        }

        if ($in['step'] === 'step_read_paths') {
            return $this->_SubCall(
                [
                    'to' => [
                        'node' => 'server',
                        'plugin' => 'infohub_storage_data',
                        'function' => 'read_paths'
                    ],
                    'data' => [
                        'path' => $in['path'],
                        'calling_plugin' => $in['calling_plugin']
                    ],
                    'data_back' => [
                        'path' => $in['path'],
                        'wanted_data' => $in['wanted_data'],
                        'calling_plugin' => $in['calling_plugin'],
                        'step' => 'step_read_paths_response'
                    ]
                ]
            );
        }

        if ($in['step'] === 'step_read_paths_response') {
            $default = [
                'answer' => 'false',
                'message' => 'There was an error',
                'path' => '',
                'data' => []
            ];
            $in['response'] = $this->_Default($default, $in['response']);

            $in['step'] = 'step_read_many';

            if ($this->_Empty($in['response']['data']) === 'true') {
                $out = [
                    'answer' => 'true',
                    'message' => 'There were no matching paths. Work done.',
                    'items' => []
                ];
                $in['step'] = 'step_end';
            }
        }

        if ($in['step'] === 'step_read_many') {
            if ($this->_Empty($in['wanted_data']) === 'false') {
                foreach ($in['response']['data'] as $key => $value) {
                    $in['response']['data'][$key] = $in['wanted_data'];
                }
            }

            return $this->_SubCall(
                [
                    'to' => [
                        'node' => 'server',
                        'plugin' => 'infohub_storage',
                        'function' => 'read_many'
                    ],
                    'data' => [
                        'paths' => $in['response']['data'],
                        'calling_plugin' => $in['calling_plugin']
                    ],
                    'data_back' => [
                        'step' => 'step_read_many_response'
                    ]
                ]
            );
        }

        if ($in['step'] === 'step_read_many_response') {
            $default = [
                'answer' => 'false',
                'message' => 'There was an error',
                'items' => []
            ];
            $out = $this->_Default($default, $in['response']);
        }

        leave:
        return [
            'answer' => $out['answer'],
            'message' => $out['message'],
            'items' => $out['items']
        ];
    }

    /**
     * General function for writing the same data to a path that ends with *
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
            'data' => [],
            'mode' => 'overwrite', // overwrite or merge
            'step' => 'step_start',
            'from_plugin' => [
                'node' => '',
                'plugin' => ''
            ],
            'calling_plugin' => [ // A way to preserve the original from_plugin
                'node' => '',
                'plugin' => ''
            ],
            'response' => []
        ];
        $in = $this->_Default($default, $in);

        $out = [
            'answer' => 'false',
            'message' => 'Nothing to report from server storage write_pattern',
            'items' => []
        ];

        if ($in['from_plugin']['node'] !== 'server') {
            $out['message'] = 'I only accept messages that origin from this server node';
            goto leave;
        }

        if ($in['step'] === 'step_start') {
            if ($in['from_plugin']['plugin'] !== 'infohub_storage') {
                $in['calling_plugin'] = $in['from_plugin'];
            }

            $in['step'] = 'step_read_paths';
        }

        if ($in['step'] === 'step_read_paths') {
            return $this->_SubCall(
                [
                    'to' => [
                        'node' => 'server',
                        'plugin' => 'infohub_storage_data',
                        'function' => 'read_paths'
                    ],
                    'data' => [
                        'path' => $in['path'],
                        'calling_plugin' => $in['calling_plugin']
                    ],
                    'data_back' => [
                        'path' => $in['path'],
                        'data' => $in['data'],
                        'mode' => $in['mode'],
                        'calling_plugin' => $in['calling_plugin'],
                        'step' => 'step_read_paths_response'
                    ]
                ]
            );
        }

        if ($in['step'] === 'step_read_paths_response') {
            $default = [
                'answer' => 'false',
                'message' => 'There was an error',
                'path' => '',
                'data' => []
            ];
            $in['response'] = $this->_Default($default, $in['response']);

            $in['step'] = 'step_write_many';

            if ($this->_Empty($in['response']['data']) === 'true') {
                $out = [
                    'answer' => 'true',
                    'message' => 'There were no matching paths. Work done.',
                    'items' => []
                ];
                $in['step'] = 'step_end';
            }
        }

        if ($in['step'] === 'step_write_many') {
            foreach ($in['response']['data'] as $key => $value) {
                $in['response']['data'][$key] = $in['data'];
            }

            return $this->_SubCall(
                [
                    'to' => [
                        'node' => 'server',
                        'plugin' => 'infohub_storage',
                        'function' => 'write_many'
                    ],
                    'data' => [
                        'paths' => $in['response']['data'],
                        'mode' => $in['mode'],
                        'calling_plugin' => $in['calling_plugin']
                    ],
                    'data_back' => [
                        'calling_plugin' => $in['calling_plugin'],
                        'step' => 'step_write_many_response'
                    ]
                ]
            );
        }

        if ($in['step'] === 'step_write_many_response') {
            $default = [
                'answer' => 'false',
                'message' => 'There was an error',
                'items' => []
            ];
            $out = $this->_Default($default, $in['response']);
        }

        leave:
        return [
            'answer' => $out['answer'],
            'message' => $out['message'],
            'items' => $out['items']
        ];
    }
}
