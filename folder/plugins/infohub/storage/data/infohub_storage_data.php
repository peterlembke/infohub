<?php
declare(strict_types=1);
if (basename(__FILE__) == basename($_SERVER["SCRIPT_FILENAME"])) {
    exit; // This file must be included, not called directly
}

/**
 * infohub_storage store data in databases and is part of InfoHub.
 * Started writing code 2010-04-15 Peter Lembke - Team Fakta CharZam soft
 * Support for SQLite3, MySQL, PostgreSQL, Future support:Oracle, MS SQL
 * @category InfoHub
 * @package Storage
 * @copyright Copyright (c) 2010, Peter Lembke, CharZam soft
 * @since 2010-04-15
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

/**
 * Class infohub_storage_data
 * Handles connections to databases.
 * Reads and then passes the connection data and the request to the right child plugin
 * that then connects to the database and does the request.
 */
class infohub_storage_data extends infohub_base
{
    Protected final function _Version(): array
    {
        return array(
            'date' => '2018-03-25',
            'version' => '1.3.3',
            'class_name' => 'infohub_storage_data',
            'checksum' => '{{checksum}}',
            'note' => 'Handles the connection information to each storage (database server)',
            'status' => 'normal',
            'SPDX-License-Identifier' => 'GPL-3.0-or-later'
        );
    }

    protected function _GetCmdFunctions(): array
    {
        return array(
            'read' => 'normal',
            'read_paths' => 'normal',
            'write' => 'normal',
            'write_overwrite' => 'normal', // Used by write
            'write_merge' => 'normal' // Used by write
        );
    }

    // *****************************************************************************
    // * Functions you only can reach with CMD(), add more in your class
    // * Observe function names are lower_case
    // *****************************************************************************

    /**
     * General function for reading a bubble
     * @version 2016-02-27
     * @since   2016-01-30
     * @author  Peter Lembke
     * @param array $in
     * @return array
     */
    final protected function read(array $in = array()): array
    {
        $default = array(
            'path' => '',
            'step' => 'step_start',
            'calling_plugin' => array(
                'node' => '',
                'plugin' => ''
            ),
            'config' => array(),
            'response' => array(
                'answer' => 'false',
                'message' => 'Nothing to report',
                'data' => array(),
                'post_exist' => 'false'
            )
        );
        $in = $this->_Default($default, $in);

        $answer = 'false';
        $message = 'Nothing to report';
        $postExist = 'false';

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

        if ($in['step'] === 'step_start')
        {
            $in['step'] = 'step_get_final_connection';
            if (strpos($in['path'], $connect['plugin_name_owner'] . '/') === 0) {
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

        if ($in['step'] === 'step_get_final_connection')
        {
            $path = 'infohub_storagemanager/connection/' . $in['calling_plugin']['plugin'];

            return $this->_SubCall(array(
                'to' => array(
                    'node' => 'server',
                    'plugin' => $connect['plugin_name_handler'],
                    'function' => 'read'
                ),
                'data' => array(
                    'connect' => $connect,
                    'path' => $path
                ),
                'data_back' => array(
                    'step' => 'step_get_final_connection_response',
                    'path' => $in['path'],
                    'calling_plugin' => $in['calling_plugin']
                )
            ));
        }

        if ($in['step'] === 'step_get_final_connection_response')
        {
            $connect = $this->_Default($connect, $in['response']['data']);
            $in['step'] = 'step_read';
        }

        if ($in['step'] === 'step_read')
        {
            return $this->_SubCall(array(
                'to' => array(
                    'node' => 'server',
                    'plugin' => $connect['plugin_name_handler'],
                    'function' => 'read'
                ),
                'data' => array(
                    'connect' => $connect,
                    'path' => $in['path']
                ),
                'data_back' => array(
                    'path' => $in['path'],
                    'calling_plugin' => $in['calling_plugin'],
                    'step' => 'step_final'
                )
            ));
        }

        if ($in['step'] === 'step_final')
        {
            $answer =  $in['response']['answer'];
            $message = $in['response']['message'];
            $postExist = $in['response']['post_exist'];
        }

        leave:
        $response = array(
            'answer' => $answer,
            'message' => $message,
            'path' => $in['path'],
            'data' => $in['response']['data'],
            'post_exist' => $postExist
        );
        return $response;
    }

    /**
     * Take a path that ends with * and get all existing paths with no data
     * @param array $in
     * @return array
     */
    final protected function read_paths(array $in = array()): array
    {
        $default = array(
            'connect' => array(),
            'path' => '', // Path that ends with a *
            'step' => 'step_start',
            'calling_plugin' => array(
                'node' => '',
                'plugin' => ''
            ),
            'config' => array(),
            'response' => array()
        );
        $in = $this->_Default($default, $in);

        $out = array(
            'answer' => 'false',
            'message' => 'Came to step ' . $in['step'],
            'path' => $in['path'],
            'data' => array()
        );

        $connect = $this->_SetConnectionDefault($in['config']);

        if ($this->_Empty($connect['plugin_name_owner']) === 'true') {
            $connect['plugin_name_owner'] = $in['calling_plugin']['plugin'];
        }

        if ($in['step'] === 'step_start')
        {
            $in['step'] = 'step_get_final_connection';
            if (strpos($in['path'], $connect['plugin_name_owner'] . '/') === 0) {
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

        if ($in['step'] === 'step_get_final_connection')
        {
            $path = 'infohub_storagemanager/connection/' . $in['calling_plugin']['plugin'];

            return $this->_SubCall(array(
                'to' => array(
                    'node' => 'server',
                    'plugin' => $connect['plugin_name_handler'],
                    'function' => 'read'
                ),
                'data' => array(
                    'connect' => $connect,
                    'path' => $path
                ),
                'data_back' => array(
                    'step' => 'step_get_final_connection_response',
                    'path' => $in['path'],
                    'calling_plugin' => $in['calling_plugin']
                )
            ));
        }

        if ($in['step'] === 'step_get_final_connection_response')
        {
            $default = array(
                'answer' => 'false',
                'message' => '',
                'path' => '',
                'data' => array()
            );
            $in['response'] = $this->_Default($default, $in['response']);

            $connect = $this->_Default($connect, $in['response']['data']);
            $in['step'] = 'step_read_paths';
        }

        if ($in['step'] === 'step_read_paths')
        {
            return $this->_SubCall(array(
                'to' => array(
                    'node' => 'server',
                    'plugin' => $connect['plugin_name_handler'],
                    'function' => 'read_paths'
                ),
                'data' => array(
                    'connect' => $connect,
                    'path' => $in['path'],
                    'with_data' => 'false' // We only want the paths, not the data they contain
                ),
                'data_back' => array(
                    'connect' => $connect,
                    'path' => $in['path'],
                    'step' => 'step_read_paths_response'
                )
            ));
        }

        if ($in['step'] === 'step_read_paths_response')
        {
            $default = array(
                'answer' => 'false',
                'message' => '',
                'path' => '',
                'data' => array()
            );
            $out = $this->_Default($default, $in['response']);
            $in['step'] = 'step_end';
        }

        leave:
        return array(
            'answer' => $out['answer'],
            'message' => $out['message'],
            'path' => $out['path'],
            'data' => $out['data']
        );
    }

    /**
     * General function for writing to one path
     * Be aware that a * can be in the end of the path
     * @version 2016-02-27
     * @since   2016-01-30
     * @author  Peter Lembke
     * @param array $in
     * @return array
     */
    final protected function write(array $in = array()): array
    {
        $default = array(
            'path' => '',
            'data' => array(),
            'mode' => '',
            'step' => 'step_start',
            'from_plugin' => array(
                'node' => '',
                'plugin' => ''
            ),
            'calling_plugin' => array(
                'node' => '',
                'plugin' => ''
            ),
            'config' => array(),
            'response' => array(
                'answer' => 'false',
                'message' => 'Nothing to report',
                'path' => '',
                'data' => array(),
                'post_exist' => 'false'
            )
        );
        $in = $this->_Default($default, $in);

        $answer = 'false';
        $message = 'Nothing to report';
        $postExist = 'false';

        if ($in['path'] === 'infohub_storagemanager/config') {
            $message = 'You have to manually change the config file on the server';
            goto leave;
        }

        $connect = $this->_SetConnectionDefault($in['config']);

        if ($in['step'] === 'step_start')
        {
            if ($this->_Empty($connect['plugin_name_owner']) === 'true') {
                $connect['plugin_name_owner'] = $in['calling_plugin']['plugin'];
            }

            $in['step'] = 'step_get_final_connection';
            $startWith = $connect['plugin_name_owner'] . '/';
            if (strpos($in['path'], $startWith) === 0) {
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

        if ($in['step'] === 'step_get_final_connection')
        {
            $path = 'infohub_storagemanager/connection/' . $in['calling_plugin']['plugin'];

            return $this->_SubCall(array(
                'to' => array(
                    'node' => 'server',
                    'plugin' => $connect['plugin_name_handler'],
                    'function' => 'read'
                ),
                'data' => array(
                    'connect' => $connect,
                    'path' => $path
                ),
                'data_back' => array(
                    'step' => 'step_get_final_connection_response',
                    'path' => $in['path'],
                    'data' => $in['data'],
                    'mode' => $in['mode'],
                    'calling_plugin' => $in['calling_plugin']
                )
            ));
        }

        if ($in['step'] === 'step_get_final_connection_response')
        {
            $connect = $this->_Default($connect, $in['response']['data']);
            $in['step'] = 'step_write';
        }

        if ($in['step'] === 'step_write')
        {
            return $this->_SubCall(array(
                'to' => array(
                    'node' => 'server',
                    'plugin' => 'infohub_storage_data',
                    'function' => 'write_' . $in['mode']
                ),
                'data' => array(
                    'connect' => $connect,
                    'path' => $in['path'],
                    'data' => $in['data'],
                    'mode' => $in['mode']
                ),
                'data_back' => array(
                    'path' => $in['path'],
                    'data' => $in['data'],
                    'mode' => $in['mode'],
                    'calling_plugin' => $in['calling_plugin'],
                    'step' => 'step_final'
                )
            ));
        }

        if ($in['step'] === 'step_final')
        {
            $answer =  $in['response']['answer'];
            $message = $in['response']['message'];
            $postExist = $in['response']['post_exist'];
        }

        leave:
        $response = array(
            'answer' => $answer,
            'message' => $message,
            'path' => $in['path'],
            'data' => $in['data'],
            'post_exist' => $postExist
        );
        return $response;
    }

    /**
     * Overwrite the data in the path
     * @version 2020-06-24
     * @since   2020-06-24
     * @author  Peter Lembke
     * @param array $in
     * @return array
     */
    final protected function write_overwrite(array $in = array()): array
    {
        $default = array(
            'connect' => array(),
            'path' => '',
            'data' => array(),
            'step' => 'step_write_data',
            'calling_plugin' => array(
                'node' => '',
                'plugin' => ''
            ),
            'response' => array(),
            'data_back' => array()
        );
        $in = $this->_Default($default, $in);

        $answer = 'false';
        $message = 'Nothing to report';
        $postExist = 'false';

        if ($in['step'] === 'step_write_data') {
            return $this->_SubCall(array(
                'to' => array(
                    'node' => 'server',
                    'plugin' => $in['connect']['plugin_name_handler'],
                    'function' => 'write'
                ),
                'data' => array(
                    'connect' => $in['connect'],
                    'path' => $in['path'],
                    'data' => $in['data']
                ),
                'data_back' => array(
                    'path' => $in['path'],
                    'data' => $in['data'],
                    'calling_plugin' => $in['calling_plugin'],
                    'step' => 'step_final'
                )
            ));
        }

        if ($in['step'] === 'step_final') {
            $default = array(
                'answer' => 'false',
                'message' => 'An error occurred',
                'path' => '',
                'data' => array(),
                'post_exist' => 'false'
            );
            $in['response'] = $this->_Default($default, $in['response']);

            $answer =  $in['response']['answer'];
            $message = $in['response']['message'];
            $postExist = $in['response']['post_exist'];
        }

        leave:
        $response = array(
            'answer' => $answer,
            'message' => $message,
            'path' => $in['path'],
            'data' => $in['data'],
            'post_exist' => $postExist
        );
        return $response;
    }

    /**
     * Merge with the data in the path
     * @version 2020-06-24
     * @since   2020-06-24
     * @author  Peter Lembke
     * @param array $in
     * @return array
     */
    final protected function write_merge(array $in = array()): array
    {
        $default = array(
            'connect' => array(),
            'path' => '',
            'data' => array(),
            'step' => 'step_read_data',
            'calling_plugin' => array(
                'node' => '',
                'plugin' => ''
            ),
            'response' => array(),
            'data_back' => array(
                'new_data' => array()
            )
        );
        $in = $this->_Default($default, $in);

        $answer = 'false';
        $message = 'Nothing to report';
        $postExist = 'false';

        if ($in['step'] === 'step_read_data') {
            return $this->_SubCall(array(
                'to' => array(
                    'node' => 'server',
                    'plugin' => $in['connect']['plugin_name_handler'],
                    'function' => 'read'
                ),
                'data' => array(
                    'connect' => $in['connect'],
                    'path' => $in['path']
                ),
                'data_back' => array(
                    'path' => $in['path'],
                    'new_data' => $in['data'],
                    'connect' => $in['connect'],
                    'step' => 'step_read_data_response'
                )
            ));
        }

        if ($in['step'] === 'step_read_data_response')
        {
            $default = array(
                'answer' => '',
                'message' => '',
                'path' => '',
                'data' => array(),
                'post_exist' => 'false'
            );
            $in['response'] = $this->_Default($default, $in['response']);

            if ($in['response']['post_exist'] === 'true') {
                $in['data'] = $this->_Merge($in['response']['data'], $in['data_back']['new_data']);
            }

            $in['step'] = 'step_write_data';
        }

        if ($in['step'] === 'step_write_data') {
            return $this->_SubCall(array(
                'to' => array(
                    'node' => 'server',
                    'plugin' => $in['connect']['plugin_name_handler'],
                    'function' => 'write'
                ),
                'data' => array(
                    'connect' => $in['connect'],
                    'path' => $in['path'],
                    'data' => $in['data']
                ),
                'data_back' => array(
                    'path' => $in['path'],
                    'data' => $in['data'],
                    'calling_plugin' => $in['calling_plugin'],
                    'connect' => $in['connect'],
                    'step' => 'step_final'
                )
            ));
        }

        if ($in['step'] === 'step_final') {
            $default = array(
                'answer' => 'false',
                'message' => 'An error occurred',
                'path' => '',
                'data' => array(),
                'post_exist' => 'false'
            );
            $in['response'] = $this->_Default($default, $in['response']);

            $answer =  $in['response']['answer'];
            $message = $in['response']['message'];
            $postExist = $in['response']['post_exist'];
        }

        leave:
        $response = array(
            'answer' => $answer,
            'message' => $message,
            'path' => $in['path'],
            'data' => $in['data'],
            'post_exist' => $postExist
        );
        return $response;
    }

    // *********************************************************************************
    // * The private functions, These functions can be used directly in your functions.
    // * Name: _CamelCaseData
    // *********************************************************************************

    /**
     * Default data for a connection. Reused in many places
     * @version 2017-07-20
     * @since   2016-01-30
     * @author  Peter Lembke
     * @param array $in
     * @return array
     */
    final protected function _SetConnectionDefault(array $in = array()): array
    {
        $default = array(
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
        );
        $in = $this->_Default($default, $in);
        return $in;
    }
}
