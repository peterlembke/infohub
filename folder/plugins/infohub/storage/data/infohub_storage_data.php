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
            'license_name' => 'GNU GPL 3 or later'
        );
    }

    protected function _GetCmdFunctions(): array
    {
        return array(
            'read' => 'normal',
            'write' => 'normal',
            'write_paths' => 'normal',
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
            'calling_plugin' => array(
                'node' => '',
                'plugin' => ''
            ),
            'step' => 'step_start',
            'path' => '',
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
            $in['step'] = 'step_read_paths';
            if (strpos($in['path'], '*') === false) {
                $in['step'] = 'step_read_data';
            }
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
                    'path' => $in['path']
                ),
                'data_back' => array(
                    'step' => 'step_final',
                    'path' => $in['path'],
                    'calling_plugin' => $in['calling_plugin']
                )
            ));
        }

        if ($in['step'] === 'step_read_data')
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
                    'step' => 'step_final',
                    'path' => $in['path'],
                    'calling_plugin' => $in['calling_plugin']
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
     * General function for writing to a path
     * @version 2016-02-27
     * @since   2016-01-30
     * @author  Peter Lembke
     * @param array $in
     * @return array
     */
    final protected function write(array $in = array()): array
    {
        $default = array(
            'calling_plugin' => array(
                'node' => '',
                'plugin' => ''
            ),
            'step' => 'step_start',
            'path' => '',
            'data' => array(),
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
            $in['step'] = 'step_write_paths';
            if (strpos($in['path'], '*') === false) {
                $in['step'] = 'step_write_data';
            }
        }

        if ($in['step'] === 'step_write_paths')
        {
            return $this->_SubCall(array(
                'to' => array(
                    'node' => 'server',
                    'plugin' => 'infohub_storage_data',
                    'function' => 'write_paths'
                ),
                'data' => array(
                    'connect' => $connect,
                    'path' => $in['path'],
                    'data' => $in['data']
                ),
                'data_back' => array(
                    'step' => 'step_final',
                    'path' => $in['path'],
                    'data' => $in['data'],
                    'calling_plugin' => $in['calling_plugin']
                )
            ));
        }

        if ($in['step'] === 'step_write_data')
        {
            return $this->_SubCall(array(
                'to' => array(
                    'node' => 'server',
                    'plugin' => $connect['plugin_name_handler'],
                    'function' => 'write'
                ),
                'data' => array(
                    'connect' => $connect,
                    'path' => $in['path'],
                    'data' => $in['data']
                ),
                'data_back' => array(
                    'step' => 'step_final',
                    'path' => $in['path'],
                    'data' => $in['data'],
                    'calling_plugin' => $in['calling_plugin']
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
     * You can write to all matching paths
     * Used for mass update of data or deletion of posts.
     * @param array $in
     * @return array
     */
    final protected function write_paths(array $in = array()): array
    {
        $default = array(
            'connect' => array(),
            'path' => '',
            'data' => array(),
            'step' => 'step_read_paths',
            'response' => array(),
            'data_back' => array(
                'paths' => array()
            )
        );
        $in = $this->_Default($default, $in);

        $answer = 'false';
        $message = 'Came to step ' . $in['step'];

        if ($in['step'] === 'step_read_paths')
        {
            return $this->_SubCall(array(
                'to' => array(
                    'node' => 'server',
                    'plugin' => $in['connect']['plugin_name_handler'],
                    'function' => 'read_paths'
                ),
                'data' => array(
                    'connect' => $in['connect'],
                    'path' => $in['path'],
                    'with_data' => 'false'
                ),
                'data_back' => array(
                    'connect' => $in['connect'],
                    'path' => $in['path'],
                    'data' => $in['data'],
                    'step' => 'step_read_paths_response'
                )
            ));
        }

        if ($in['step'] === 'step_read_paths_response')
        {
            $in['step'] = 'step_write_data';

            $pathArray = array();
            foreach ($in['response']['data'] as $path => $data) {
                $pathArray[] = $path;
            }

            $in['data_back']['paths'] = $pathArray;
            if (empty($in['data_back']['paths']) === true)
            {
                $answer = 'true';
                $message = 'There were no matching paths to write to. I am done';
                $in['step'] = 'step_end';
            }
        }

        if ($in['step'] === 'step_write_data_response')
        {
            $in['step'] = 'step_write_data';

            if (empty($in['data_back']['paths']) === true)
            {
                $answer = 'true';
                $message = 'I have written to all the paths I found';
                $in['step'] = 'step_end';
            }
        }

        if ($in['step'] === 'step_write_data')
        {
            $oneFullPath = array_pop($in['data_back']['paths']);
            return $this->_SubCall(array(
                'to' => array(
                    'node' => 'server',
                    'plugin' => $in['connect']['plugin_name_handler'],
                    'function' => 'write'
                ),
                'data' => array(
                    'connect' => $in['connect'],
                    'path' => $oneFullPath,
                    'data' => $in['data']
                ),
                'data_back' => array(
                    'connect' => $in['connect'],
                    'path' => $in['path'],
                    'data' => $in['data'],
                    'step' => 'step_write_data_response',
                    'paths' => $in['data_back']['paths']
                )
            ));
        }

        leave:
        $out = array(
            'answer' => $answer,
            'message' => $message,
            'path' => $in['path']
        );
        return $out;
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
