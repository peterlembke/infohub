<?php
/**
 * infohub_storage store data in databases and is part of InfoHub.
 * Started writing code 2010-04-15 Peter Lembke - Team Fakta CharZam soft
 * Support for SQLite3, MySQL, PostgreSQL, Future support:Oracle, MS SQL
 *
 * @package     Infohub
 * @subpackage  infohub_demo
 */

declare(strict_types=1);
if (basename(__FILE__) == basename($_SERVER["SCRIPT_FILENAME"])) {
    exit; // This file must be included, not called directly
}

/**
 * infohub_storage store data in databases and is part of InfoHub.
 * Started writing code 2010-04-15 Peter Lembke - Team Fakta CharZam soft
 * Support for SQLite3, MySQL, PostgreSQL, Future support:Oracle, MS SQL
 *
 * @author      Peter Lembke <info@infohub.se>
 * @version     2017-08-10
 * @since       2016-08-13
 * @copyright   Copyright (c) 2016, Peter Lembke
 * @license     https://opensource.org/licenses/gpl-license.php GPL-3.0-or-later
 * @see         https://github.com/peterlembke/infohub/blob/master/folder/plugins/infohub/storage/data/redis/infohub_storage_data_redis.md Documentation
 * @link        https://infohub.se/ InfoHub main page
 */
class infohub_storage_data_redis extends infohub_base
{
    /**
     * Version information for this plugin
     * @return  string[]
     * @since   2016-08-13
     * @author  Peter Lembke
     * @version 2017-08-10
     */
    protected function _Version(): array
    {
        return [
            'date' => '2017-08-10',
            'since' => '2016-08-13',
            'version' => '1.0.0',
            'version_structure' => '2017-08-10',
            'class_name' => 'infohub_storage_data_redis',
            'checksum' => '{{checksum}}',
            'note' => 'Support for Redis as a normal storage. Saves to persistent storage in time intervals. Simple to set up and use',
            'status' => 'normal',
            'SPDX-License-Identifier' => 'GPL-3.0-or-later'
        ];
    }

    /**
     * Public functions in this plugin
     *
     * @return array
     * @author  Peter Lembke
     * @version 2017-08-10
     * @since   2016-08-13
     */
    protected function _GetCmdFunctions(): array
    {
        $list = [
            'read' => 'normal',
            'write' => 'normal',
            'read_paths' => 'normal', // Get a list of matching paths
        ];

        return parent::_GetCmdFunctionsBase($list);
    }

    /**
     * You give an active db connection and a path,
     * you get the data stored on that path.
     * @param array $in
     * @return array
     */
    protected function read(array $in = []): array
    {
        $default = [
            'connect' => null,
            'path' => ''
        ];
        $in = $this->_Default($default, $in);

        $postExist = 'false';
        $data = [];
        $answer = 'false';
        $message = 'Nothing to report';

        if (!extension_loaded('redis')) {
            $message = 'redis is not installed';
            goto leave;
        }

        $response = $this->internal_Cmd(
            [
                'func' => 'ConnectionOpen',
                'connect' => $in['connect']
            ]
        );
        if ($response['answer'] === 'false') {
            $message = $response['message'];
            goto leave;
        }
        $in['connection'] = $response['connection'];

        $response = $this->internal_Cmd(
            [
                'func' => 'PostRead',
                'connection' => $in['connection'],
                'database_name' => $in['connect']['db_name'],
                'table_name' => $in['connect']['plugin_name_owner'],
                'path' => $in['path']
            ]
        );
        if ($response['answer'] === 'false') {
            $message = $response['message'];
            goto leave;
        }
        $postExist = $response['post_exist'];

        $answer = 'true';
        $message = 'Post was not found';
        if ($postExist === 'true') {
            $data = $this->_JsonDecode($response['data']);
            $message = 'Here are the data';
        }

        leave:
        $out = [
            'answer' => $answer,
            'message' => $message,
            'path' => $in['path'],
            'data' => $data,
            'post_exist' => $postExist
        ];
        return $out;
    }

    /**
     * Write data to the database
     * Give an active db connection, a path and the data
     * If data is empty then the post is deleted
     * If data do not exist in the database then it is inserted
     * If data exist in the database and is same as the one you want to save - then success without action
     * If data exist and are different then the post will be updated
     * @param array $in
     * @return array
     */
    protected function write(array $in = []): array
    {
        $default = [
            'connect' => [],
            'path' => '',
            'data' => []
        ];
        $in = $this->_Default($default, $in);

        $postExist = 'false';
        $answer = 'false';
        $message = 'Nothing to report';

        if (!extension_loaded('redis')) {
            $message = 'redis is not installed';
            goto leave;
        }

        $response = $this->internal_Cmd(
            [
                'func' => 'ConnectionOpen',
                'connect' => $in['connect']
            ]
        );
        if ($response['answer'] === 'false') {
            $message = $response['message'];
            goto leave;
        }
        $connection = $response['connection'];

        $response = $this->internal_Cmd(
            [
                'func' => 'PostRead',
                'connection' => $connection,
                'path' => $in['path']
            ]
        );
        if ($response['answer'] === 'false') {
            $message = $response['message'];
            goto leave;
        }
        $currentlyStoredDataString = $response['data'];
        $postExist = $response['post_exist'];

        if (empty($in['data']) === true) {
            if ($postExist === 'true') {
                $response = $this->internal_Cmd(
                    [
                        'func' => 'PostDelete',
                        'connection' => $connection,
                        'path' => $in['path']
                    ]
                );
                $answer = $response['answer'];
                $message = $response['message'];
                goto leave;
            }

            $answer = 'true';
            $message = 'Did not have to delete the post, it does not exist';
            goto leave;
        }

        $newDataString = $this->_JsonEncode($in['data']);

        if ($postExist === 'true') {
            if ($currentlyStoredDataString === $newDataString) {
                $answer = 'true';
                $message = 'No need to save the same data again';
                goto leave;
            }
        }

        $response = $this->internal_Cmd(
            [
                'func' => 'PostWrite',
                'connection' => $connection,
                'path' => $in['path'],
                'bubble' => $newDataString
            ]
        );
        $answer = $response['answer'];
        $message = $response['message'];

        leave:
        $out = [
            'answer' => $answer,
            'message' => $message,
            'path' => $in['path'],
            'data' => $in['data'],
            'post_exist' => $postExist
        ];
        return $out;
    }

    /**
     * You give an active db connection and a path with % in it,
     * you get a list with all matching paths
     * @param array $in
     * @return array
     */
    protected function read_paths(array $in = []): array
    {
        $default = [
            'connect' => null,
            'path' => '',
            'with_data' => 'true'
        ];
        $in = $this->_Default($default, $in);

        $data = [];
        $answer = 'false';
        $message = 'Nothing to report';

        if (!extension_loaded('redis')) {
            $message = 'redis is not installed';
            goto leave;
        }

        $response = $this->internal_Cmd(
            [
                'func' => 'ConnectionOpen',
                'connect' => $in['connect']
            ]
        );
        if ($response['answer'] === 'false') {
            $message = $response['message'];
            goto leave;
        }
        $in['connection'] = $response['connection'];

        $response = $this->internal_Cmd(
            [
                'func' => 'ReadPaths',
                'connection' => $in['connection'],
                'database_name' => $in['connect']['db_name'],
                'table_name' => $in['connect']['plugin_name_owner'],
                'path' => $in['path'],
                'with_data' => $in['with_data']
            ]
        );
        if ($response['answer'] === 'false') {
            $message = $response['message'];
            goto leave;
        }

        $data = $response['data'];
        $answer = 'true';
        $message = 'Here are the paths';

        leave:
        $out = [
            'answer' => $answer,
            'message' => $message,
            'path' => $in['path'],
            'data' => $data
        ];
        return $out;
    }

    /**
     * Returns a db connection with the help of the connect-variables.
     * @param array $in
     * @return array
     */
    protected function internal_ConnectionOpen(array $in = []): array
    {
        $default = [
            'where' => __CLASS__ . '.' . __FUNCTION__,
            'connect' => [
                'plugin_name_handler' => 'infohub_storage_data_redis',
                'plugin_name_owner' => '',
                'db_type' => 'redis',
                'db_port' => '6379',
                'db_host' => '127.0.0.1',
                'db_user' => '',
                'db_password' => '',
                'db_name' => ''
            ]
        ];
        $in = $this->_Default($default, $in);

        $answer = 'false';
        $connection = null;

        try {
            $connection = new Redis();
            $connection->connect($in['connect']['db_host'], $in['connect']['db_port']);
            $ping = $connection->ping();
            if ($ping !== '+PONG') {
                $message = 'Connected to Redis server but it does not answer to ping';
                goto leave;
            }
        } catch (PDOException $e) {
            $message = 'Could not connect to Redis server - ' . $e->getMessage();
            goto leave;
        }

        $answer = 'true';
        $message = 'Here are the Redis server connection';

        leave:
        $out = [
            'answer' => $answer,
            'message' => $message,
            'connection' => $connection
        ];
        return $out;
    }

    /**
     * Gives you the data on that path
     * @param array $in
     * @return array
     */
    protected function internal_PostRead(array $in = []): array
    {
        $default = [
            'where' => __CLASS__ . '.' . __FUNCTION__,
            'connection' => null,
            'path' => ''
        ];
        $in = $this->_Default($default, $in);

        $data = null;

        try {
            $data = $in['connection']->get($in['path']);
        } catch (Exception $e) {
            $out = [
                'answer' => 'false',
                'message' => 'Error reading Redis: ' . $e->getMessage(),
                'data' => null,
                'post_exist' => 'false'
            ];
            goto leave;
        }

        if (is_null($data) || empty($data)) {
            $out = [
                'answer' => 'true',
                'message' => 'Post read: Did not find any data string on that path',
                'data' => $this->_JsonEncode([]),
                'post_exist' => 'false'
            ];
            goto leave;
        }

        $out = [
            'answer' => 'true',
            'message' => 'Post read: Here are the data string',
            'data' => $data,
            'post_exist' => 'true'
        ];

        leave:
        return $out;
    }

    /**
     * Update existing data in a table
     * @param array $in
     * @return array
     */
    protected function internal_PostWrite(array $in = []): array
    {
        $default = [
            'where' => __CLASS__ . '.' . __FUNCTION__,
            'connection' => null,
            'path' => '',
            'bubble' => ''
        ];
        $in = $this->_Default($default, $in);

        $out = [
            'answer' => 'true',
            'message' => 'PostWrite, Wrote the data to Redis'
        ];

        try {
            $response = $in['connection']->set($in['path'], $in['bubble']);
            if ($response === false) {
                $out = [
                    'answer' => 'false',
                    'message' => 'PostWrite, Failed to write the data to Redis'
                ];
            }
        } catch (Exception $e) {
            $out = [
                'answer' => 'false',
                'message' => 'PostWrite, got exception: ' . $e->getMessage()
            ];
        }

        return $out;
    }

    /**
     * Delete a row from a table
     * @param array $in
     * @return array
     */
    protected function internal_PostDelete(array $in = []): array
    {
        $default = [
            'where' => __CLASS__ . '.' . __FUNCTION__,
            'connection' => null,
            'path' => ''
        ];
        $in = $this->_Default($default, $in);

        $out = [
            'answer' => 'true',
            'message' => 'Post delete: Deleted the post'
        ];

        try {
            $response = $in['connection']->del($in['path']);
            if ($response === false) {
                $out = [
                    'answer' => 'false',
                    'message' => 'PostDelete, Failed to delete the data in Redis'
                ];
            }
        } catch (Exception $e) {
            $out = [
                'answer' => 'false',
                'message' => 'Post delete: Could not delete the post'
            ];
        }

        return $out;
    }

    /**
     * Gives you the matching paths in a list
     * The path contains % signs that equals to anything. Then the matching paths are returned to you
     * @param array $in
     * @return array
     */
    protected function internal_ReadPaths(array $in = []): array
    {
        $default = [
            'where' => __CLASS__ . '.' . __FUNCTION__,
            'connection' => null,
            'path' => '',
            'with_data' => 'true'
        ];
        $in = $this->_Default($default, $in);

        $answer = [];

        $response = $in['connection']->keys($in['path']);

        if (!$response) {
            goto leave;
        }

        foreach ($response as $path) {
            $dataBack = [];
            if ($in['with_data'] === 'true') {
                $data = $in['connection']->get($path);
                if ($data) {
                    $dataBack = $this->_JsonDecode($data);
                }
            }

            $answer[$path] = $dataBack;
        }

        $response['answer'] = 'true';
        $response['message'] = 'Here are the paths that I found';

        leave:
        $out = [
            'answer' => $response['answer'],
            'message' => $response['message'],
            'data' => $answer
        ];
        return $out;
    }

}
