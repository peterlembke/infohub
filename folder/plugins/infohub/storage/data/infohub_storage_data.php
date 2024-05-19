<?php
/**
 * Handles connections to databases.
 *
 * Reads and then passes the connection data and the request to the right child plugin
 * that then connects to the database and does the request.
 * infohub_storage store data in databases and is part of InfoHub.
 * Started writing code 2010-04-15 Peter Lembke - Team Fakta CharZam soft
 * Support for SQLite3, MySQL, PostgreSQL, Future support: MongoDb
 *
 * @package     Infohub
 * @subpackage  infohub_storage_data
 */

declare(strict_types=1);
if (basename(__FILE__) == basename($_SERVER['SCRIPT_FILENAME'])) {
    exit; // This file must be included, not called directly
}

/**
 * Handles connections to databases.
 *
 * Reads and then passes the connection data and the request to the right child plugin
 * that then connects to the database and does the request.
 * infohub_storage store data in databases and is part of InfoHub.
 * Started writing code 2010-04-15 Peter Lembke - Team Fakta CharZam soft
 * Support for SQLite3, MySQL, PostgreSQL, Future support:Oracle, MS SQL
 *
 * @author      Peter Lembke <info@infohub.se>
 * @version     2018-03-25
 * @since       2010-04-15
 * @copyright   Copyright (c) 2010, Peter Lembke
 * @license     https://opensource.org/licenses/gpl-license.php GPL-3.0-or-later
 * @see         https://github.com/peterlembke/infohub/blob/master/folder/plugins/infohub/storage/data/infohub_storage_data.md Documentation
 * @link        https://infohub.se/ InfoHub main page
 */
class infohub_storage_data extends infohub_base
{
    /**
     * Version information for this plugin
     * @return  string[]
     * @since   2010-04-15
     * @author  Peter Lembke
     * @version 2018-03-25
     */
    protected function _Version(): array
    {
        return [
            'date' => '2018-03-25',
            'since' => '2010-04-15',
            'version' => '1.3.3',
            'class_name' => 'infohub_storage_data',
            'checksum' => '{{checksum}}',
            'note' => 'Handles the connection information to each storage (database server)',
            'status' => 'normal',
            'SPDX-License-Identifier' => 'GPL-3.0-or-later'
        ];
    }

    /**
     * Public functions in this plugin
     *
     * @return array
     * @author  Peter Lembke
     * @version 2018-03-25
     * @since   2010-04-15
     */
    protected function _GetCmdFunctions(): array
    {
        $list = [
            'read' => 'normal',
            'read_paths' => 'normal',
            'write' => 'normal',
            'write_overwrite' => 'normal', // Used by write
            'write_merge' => 'normal' // Used by write
        ];

        return parent::_GetCmdFunctionsBase($list);
    }

    // *****************************************************************************
    // * Functions you only can reach with CMD(), add more in your class
    // * Observe function names are lower_case
    // *****************************************************************************

    /**
     * General function for reading a bubble.
     * Uses the main db connection unless a specific connector have been defined for the calling plugin.
     *
     * @param array $in
     * @return array
     * @author  Peter Lembke
     * @version 2016-02-27
     * @since   2016-01-30
     */
    protected function read(array $in = []): array
    {
        $default = [
            'path' => '',
            'delete_after_reading' => 'false',
            'step' => 'step_start',
            'calling_plugin' => [
                'node' => '',
                'plugin' => ''
            ],
            'config' => [],
            'response' => [
                'answer' => 'false',
                'message' => 'Nothing to report',
                'data' => [],
                'post_exist' => 'false'
            ],
            'data_back' => []
        ];
        $in = $this->_Default($default, $in);

        $answer = 'false';
        $message = 'Nothing to report';
        $postExist = 'false';
        $responseData = [];

        $connect = $this->_SetConnectionDefault($in['config']);

        if (empty($connect['plugin_name_owner']) === true) {
            $connect['plugin_name_owner'] = $in['calling_plugin']['plugin'];
        }

        if ($in['path'] === 'infohub_storagemanager/config') {
            $answer = 'true';
            $message = 'Here are the main connection';
            $in['response']['data'] = $in['config'];
            if (empty($in['config']) === false) {
                $postExist = 'true';
            }
            goto leave;
        }

        if ($in['step'] === 'step_start') {
            $in['step'] = 'step_get_final_connection';
            if (str_starts_with($in['path'], $connect['plugin_name_owner'].'/') === true) {
                $in['step'] = 'step_read';
            }
            if ($in['step'] === 'step_get_final_connection') {
                if ($connect['used_for'] === 'all') {
                    if ($connect['not_used_for'] === '') {
                        $in['step'] = 'step_read';
                    }
                }
            }
        }

        if ($in['step'] === 'step_get_final_connection') {
            $path = 'infohub_storagemanager/connection/' . $in['calling_plugin']['plugin'];

            return $this->_SubCall(
                [
                    'to' => [
                        'node' => 'server',
                        'plugin' => $connect['plugin_name_handler'],
                        'function' => 'read'
                    ],
                    'data' => [
                        'connect' => $connect,
                        'path' => $path
                    ],
                    'data_back' => [
                        'step' => 'step_get_final_connection_response',
                        'path' => $in['path'],
                        'delete_after_reading' => $in['delete_after_reading'],
                        'calling_plugin' => $in['calling_plugin']
                    ]
                ]
            );
        }

        if ($in['step'] === 'step_get_final_connection_response') {
            $connect = $this->_Default($connect, $in['response']['data']);
            $in['step'] = 'step_read';
        }

        if ($in['step'] === 'step_read') {
            return $this->_SubCall(
                [
                    'to' => [
                        'node' => 'server',
                        'plugin' => $connect['plugin_name_handler'],
                        'function' => 'read'
                    ],
                    'data' => [
                        'connect' => $connect,
                        'path' => $in['path']
                    ],
                    'data_back' => [
                        'path' => $in['path'],
                        'delete_after_reading' => $in['delete_after_reading'],
                        'calling_plugin' => $in['calling_plugin'],
                        'step' => 'step_read_response'
                    ]
                ]
            );
        }

        if ($in['step'] === 'step_read_response') {
            $answer = $in['response']['answer'];
            $message = $in['response']['message'];
            $postExist = $in['response']['post_exist'];
            $responseData = $in['response']['data'];

            $in['step'] = 'step_end';

            $shouldDelete = $in['delete_after_reading'] === 'true';
            if ($shouldDelete === true) {
                $in['step'] = 'step_delete';
            }
        }

        if ($in['step'] === 'step_delete') {
            return $this->_SubCall(
                [
                    'to' => [
                        'node' => 'server',
                        'plugin' => $connect['plugin_name_handler'],
                        'function' => 'write'
                    ],
                    'data' => [
                        'connect' => $connect,
                        'path' => $in['path'],
                        'data' => []
                    ],
                    'data_back' => [
                        'path' => $in['path'],
                        'delete_after_reading' => $in['delete_after_reading'],
                        'calling_plugin' => $in['calling_plugin'],
                        'step' => 'step_delete_response',
                        'final_answer' => [
                            'answer' => $answer,
                            'message' => $message,
                            'post_exist' => $postExist,
                            'response_data' => $responseData
                        ]
                    ]
                ]
            );
        }

        if ($in['step'] === 'step_delete_response') {
            $answer = $in['data_back']['final_answer']['answer'];
            $message = $in['data_back']['final_answer']['message'];
            $postExist = $in['data_back']['final_answer']['post_exist'];
            $responseData = $in['data_back']['final_answer']['response_data'];

            $in['step'] = 'step_end';
        }

        leave:
        $response = [
            'answer' => $answer,
            'message' => $message,
            'path' => $in['path'],
            'data' => $responseData,
            'post_exist' => $postExist
        ];
        return $response;
    }

    /**
     * Take a path that ends with * and get all existing paths with no data
     * @param array $in
     * @return array
     */
    protected function read_paths(array $in = []): array
    {
        $default = [
            'connect' => [],
            'path' => '', // Path that ends with a *
            'step' => 'step_start',
            'calling_plugin' => [
                'node' => '',
                'plugin' => ''
            ],
            'config' => [],
            'response' => []
        ];
        $in = $this->_Default($default, $in);

        $out = [
            'answer' => 'false',
            'message' => 'Came to step ' . $in['step'],
            'path' => $in['path'],
            'data' => []
        ];

        $connect = $this->_SetConnectionDefault($in['config']);

        if ($this->_Empty($connect['plugin_name_owner']) === 'true') {
            $connect['plugin_name_owner'] = $in['calling_plugin']['plugin'];
        }

        if ($in['step'] === 'step_start') {
            $in['step'] = 'step_get_final_connection';
            if (str_starts_with($in['path'], $connect['plugin_name_owner'].'/') === true) {
                $in['step'] = 'step_read_paths';
            }
            if ($in['step'] === 'step_get_final_connection') {
                if ($connect['used_for'] === 'all') {
                    if ($connect['not_used_for'] === '') {
                        $in['step'] = 'step_read_paths';
                    }
                }
            }
        }

        if ($in['step'] === 'step_get_final_connection') {
            $path = 'infohub_storagemanager/connection/' . $in['calling_plugin']['plugin'];

            return $this->_SubCall(
                [
                    'to' => [
                        'node' => 'server',
                        'plugin' => $connect['plugin_name_handler'],
                        'function' => 'read'
                    ],
                    'data' => [
                        'connect' => $connect,
                        'path' => $path
                    ],
                    'data_back' => [
                        'step' => 'step_get_final_connection_response',
                        'path' => $in['path'],
                        'calling_plugin' => $in['calling_plugin']
                    ]
                ]
            );
        }

        if ($in['step'] === 'step_get_final_connection_response') {
            $default = [
                'answer' => 'false',
                'message' => '',
                'path' => '',
                'data' => []
            ];
            $in['response'] = $this->_Default($default, $in['response']);

            $connect = $this->_Default($connect, $in['response']['data']);
            $in['step'] = 'step_read_paths';
        }

        if ($in['step'] === 'step_read_paths') {
            return $this->_SubCall(
                [
                    'to' => [
                        'node' => 'server',
                        'plugin' => $connect['plugin_name_handler'],
                        'function' => 'read_paths'
                    ],
                    'data' => [
                        'connect' => $connect,
                        'path' => $in['path'],
                        'with_data' => 'false' // We only want the paths, not the data they contain
                    ],
                    'data_back' => [
                        'connect' => $connect,
                        'path' => $in['path'],
                        'step' => 'step_read_paths_response'
                    ]
                ]
            );
        }

        if ($in['step'] === 'step_read_paths_response') {
            $default = [
                'answer' => 'false',
                'message' => '',
                'path' => '',
                'data' => []
            ];
            $out = $this->_Default($default, $in['response']);
        }

        leave:
        return [
            'answer' => $out['answer'],
            'message' => $out['message'],
            'path' => $out['path'],
            'data' => $out['data']
        ];
    }

    /**
     * General function for writing to one path
     * Be aware that a * can be in the end of the path
     * @param array $in
     * @return array
     * @author  Peter Lembke
     * @version 2016-02-27
     * @since   2016-01-30
     */
    protected function write(array $in = []): array
    {
        $default = [
            'path' => '',
            'data' => [],
            'mode' => '',
            'step' => 'step_start',
            'from_plugin' => [
                'node' => '',
                'plugin' => ''
            ],
            'calling_plugin' => [
                'node' => '',
                'plugin' => ''
            ],
            'config' => [],
            'response' => [
                'answer' => 'false',
                'message' => 'Nothing to report',
                'path' => '',
                'data' => [],
                'post_exist' => 'false'
            ]
        ];
        $in = $this->_Default($default, $in);

        $answer = 'false';
        $message = 'Nothing to report';
        $postExist = 'false';

        if ($in['path'] === 'infohub_storagemanager/config') {
            $message = 'You have to manually change the config file on the server';
            goto leave;
        }

        $connect = $this->_SetConnectionDefault($in['config']);

        if ($in['step'] === 'step_start') {
            if ($this->_Empty($connect['plugin_name_owner']) === 'true') {
                $connect['plugin_name_owner'] = $in['calling_plugin']['plugin'];
            }

            $in['step'] = 'step_get_final_connection';
            $startWith = $connect['plugin_name_owner'] . '/';
            if (str_starts_with($in['path'], $startWith) === true) {
                $in['step'] = 'step_write';
            }
            if ($in['step'] === 'step_get_final_connection') {
                if ($connect['used_for'] === 'all') {
                    if ($connect['not_used_for'] === '') {
                        $in['step'] = 'step_write';
                    }
                }
            }
        }

        if ($in['step'] === 'step_get_final_connection') {
            $path = 'infohub_storagemanager/connection/' . $in['calling_plugin']['plugin'];

            return $this->_SubCall(
                [
                    'to' => [
                        'node' => 'server',
                        'plugin' => $connect['plugin_name_handler'],
                        'function' => 'read'
                    ],
                    'data' => [
                        'connect' => $connect,
                        'path' => $path
                    ],
                    'data_back' => [
                        'step' => 'step_get_final_connection_response',
                        'path' => $in['path'],
                        'data' => $in['data'],
                        'mode' => $in['mode'],
                        'calling_plugin' => $in['calling_plugin']
                    ]
                ]
            );
        }

        if ($in['step'] === 'step_get_final_connection_response') {
            $connect = $this->_Default($connect, $in['response']['data']);
            $in['step'] = 'step_write';
        }

        if ($in['step'] === 'step_write') {
            return $this->_SubCall(
                [
                    'to' => [
                        'node' => 'server',
                        'plugin' => 'infohub_storage_data',
                        'function' => 'write_' . $in['mode']
                    ],
                    'data' => [
                        'connect' => $connect,
                        'path' => $in['path'],
                        'data' => $in['data'],
                        'mode' => $in['mode']
                    ],
                    'data_back' => [
                        'path' => $in['path'],
                        'data' => $in['data'],
                        'mode' => $in['mode'],
                        'calling_plugin' => $in['calling_plugin'],
                        'step' => 'step_final'
                    ]
                ]
            );
        }

        if ($in['step'] === 'step_final') {
            $answer = $in['response']['answer'];
            $message = $in['response']['message'];
            $postExist = $in['response']['post_exist'];
        }

        leave:
        $response = [
            'answer' => $answer,
            'message' => $message,
            'path' => $in['path'],
            'data' => $in['data'],
            'post_exist' => $postExist
        ];
        return $response;
    }

    /**
     * Overwrite the data in the path
     * @param array $in
     * @return array
     * @author  Peter Lembke
     * @version 2020-06-24
     * @since   2020-06-24
     */
    protected function write_overwrite(array $in = []): array
    {
        $default = [
            'connect' => [],
            'path' => '',
            'data' => [],
            'step' => 'step_write_data',
            'calling_plugin' => [
                'node' => '',
                'plugin' => ''
            ],
            'response' => [],
            'data_back' => []
        ];
        $in = $this->_Default($default, $in);

        $answer = 'false';
        $message = 'Nothing to report';
        $postExist = 'false';

        if ($in['step'] === 'step_write_data') {
            return $this->_SubCall(
                [
                    'to' => [
                        'node' => 'server',
                        'plugin' => $in['connect']['plugin_name_handler'],
                        'function' => 'write'
                    ],
                    'data' => [
                        'connect' => $in['connect'],
                        'path' => $in['path'],
                        'data' => $in['data']
                    ],
                    'data_back' => [
                        'path' => $in['path'],
                        'data' => $in['data'],
                        'calling_plugin' => $in['calling_plugin'],
                        'step' => 'step_final'
                    ]
                ]
            );
        }

        if ($in['step'] === 'step_final') {
            $default = [
                'answer' => 'false',
                'message' => 'An error occurred',
                'path' => '',
                'data' => [],
                'post_exist' => 'false'
            ];
            $in['response'] = $this->_Default($default, $in['response']);

            $answer = $in['response']['answer'];
            $message = $in['response']['message'];
            $postExist = $in['response']['post_exist'];
        }

        leave:
        $response = [
            'answer' => $answer,
            'message' => $message,
            'path' => $in['path'],
            'data' => $in['data'],
            'post_exist' => $postExist
        ];
        return $response;
    }

    /**
     * Merge with the data in the path
     * @param array $in
     * @return array
     * @author  Peter Lembke
     * @version 2020-06-24
     * @since   2020-06-24
     */
    protected function write_merge(array $in = []): array
    {
        $default = [
            'connect' => [],
            'path' => '',
            'data' => [],
            'step' => 'step_read_data',
            'calling_plugin' => [
                'node' => '',
                'plugin' => ''
            ],
            'response' => [],
            'data_back' => [
                'new_data' => []
            ]
        ];
        $in = $this->_Default($default, $in);

        $answer = 'false';
        $message = 'Nothing to report';
        $postExist = 'false';

        if ($in['step'] === 'step_read_data') {
            return $this->_SubCall(
                [
                    'to' => [
                        'node' => 'server',
                        'plugin' => $in['connect']['plugin_name_handler'],
                        'function' => 'read'
                    ],
                    'data' => [
                        'connect' => $in['connect'],
                        'path' => $in['path']
                    ],
                    'data_back' => [
                        'path' => $in['path'],
                        'new_data' => $in['data'],
                        'connect' => $in['connect'],
                        'step' => 'step_read_data_response'
                    ]
                ]
            );
        }

        if ($in['step'] === 'step_read_data_response') {
            $default = [
                'answer' => '',
                'message' => '',
                'path' => '',
                'data' => [],
                'post_exist' => 'false'
            ];
            $in['response'] = $this->_Default($default, $in['response']);

            if ($in['response']['post_exist'] === 'true') {
                $in['data'] = $this->_Merge($in['response']['data'], $in['data_back']['new_data']);
            }

            $in['step'] = 'step_write_data';
        }

        if ($in['step'] === 'step_write_data') {
            return $this->_SubCall(
                [
                    'to' => [
                        'node' => 'server',
                        'plugin' => $in['connect']['plugin_name_handler'],
                        'function' => 'write'
                    ],
                    'data' => [
                        'connect' => $in['connect'],
                        'path' => $in['path'],
                        'data' => $in['data']
                    ],
                    'data_back' => [
                        'path' => $in['path'],
                        'data' => $in['data'],
                        'calling_plugin' => $in['calling_plugin'],
                        'connect' => $in['connect'],
                        'step' => 'step_final'
                    ]
                ]
            );
        }

        if ($in['step'] === 'step_final') {
            $default = [
                'answer' => 'false',
                'message' => 'An error occurred',
                'path' => '',
                'data' => [],
                'post_exist' => 'false'
            ];
            $in['response'] = $this->_Default($default, $in['response']);

            $answer = $in['response']['answer'];
            $message = $in['response']['message'];
            $postExist = $in['response']['post_exist'];
        }

        leave:
        $response = [
            'answer' => $answer,
            'message' => $message,
            'path' => $in['path'],
            'data' => $in['data'],
            'post_exist' => $postExist
        ];
        return $response;
    }

    // *********************************************************************************
    // * The private functions, These functions can be used directly in your functions.
    // * Name: _CamelCaseData
    // *********************************************************************************

    /**
     * Default data for a connection. Reused in many places
     * @param array $in
     * @return array
     * @author  Peter Lembke
     * @version 2017-07-20
     * @since   2016-01-30
     */
    protected function _SetConnectionDefault(array $in = []): array
    {
        $default = [
            'plugin_name_handler' => '', // Name of the storage child plugin that can handle this connection
            'plugin_name_owner' => '', // Level 1 Plugin name that own the data
            'used_for' => 'all', // Plugin names this main connection is used for
            'not_used_for' => '', // Plugin names this main connection is not used for
            'db_type' => '', // One of the supported strings: psql, mysql, sqlite, redis, file, couchdb
            'db_host' => '', // If required, IP number or domain name to sql server. Empty for sqlite
            'db_port' => '', // The IP port to the sql server, or empty for sqlite
            'db_user' => '', // If required, username on sql server or empty for sqlite
            'db_password' => '', // password for username, or empty for sqlite
            'db_name' => '', // name of the database / name of the sqlite file
            'path' => '', // the path where this connection will be stored
        ];
        $in = $this->_Default($default, $in);
        return $in;
    }
}
