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
 * @version     2016-04-17
 * @since       2014-12-06
 * @copyright   Copyright (c) 2014, Peter Lembke
 * @license     https://opensource.org/licenses/gpl-license.php GPL-3.0-or-later
 * @see         https://github.com/peterlembke/infohub/blob/master/folder/plugins/infohub/storage/data/file/infohub_storage_data_file.md Documentation
 * @link        https://infohub.se/ InfoHub main page
 */
class infohub_storage_data_file extends infohub_base
{
    /**
     * Version information for this plugin
     * @return  string[]
     * @since   2014-12-06
     * @author  Peter Lembke
     * @version 2017-02-04
     */
    protected function _Version(): array
    {
        return [
            'date' => '2017-02-04',
            'since' => '2014-12-06',
            'version' => '1.0.0',
            'version_structure' => '2011-10-12',
            'class_name' => 'infohub_storage_data_file',
            'checksum' => '{{checksum}}',
            'note' => 'Support for storage in files and folders',
            'status' => 'normal',
            'SPDX-License-Identifier' => 'GPL-3.0-or-later'
        ];
    }

    /**
     * Public functions in this plugin
     * @return mixed
     * @since   2014-12-06
     * @author  Peter Lembke
     * @version 2017-02-04
     */
    protected function _GetCmdFunctions(): array
    {
        return [
            'read' => 'normal',
            'write' => 'normal'
        ];
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

        $data = [];
        $postExist = 'false';

        $in = $this->internal_GetNames($in);

        $response = $this->internal_ConnectionOpen($in);
        if ($response['answer'] === 'false') {
            goto leave;
        }
        $in['connection'] = $response['connection'];

        $response = $this->internal_PostRead($in);
        if ($response['answer'] === 'false') {
            goto leave;
        }
        $postExist = $response['post_exist'];

        $response['message'] = 'Post was not found';
        if ($postExist === 'true') {
            $data = json_decode($response['data'], true);
            $response['message'] = 'Here are the data';
        }

        leave:
        $out = [
            'answer' => $response['answer'],
            'message' => $response['message'],
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

        $in['func'] = 'GetNames';
        $in = $this->internal_Cmd($in);

        $in['func'] = 'ConnectionOpen';
        $response = $this->internal_Cmd($in);
        if ($response['answer'] === 'false') {
            goto leave;
        }

        $in['connection'] = $response['connection'];

        if (empty($in['data']) === false) {
            $in['func'] = 'DatabaseCreate';
            $response = $this->internal_Cmd($in);
            if ($response['answer'] === 'false') {
                goto leave;
            }

            $in['func'] = 'TableCreate';
            $response = $this->internal_Cmd($in);
            if ($response['answer'] === 'false') {
                goto leave;
            }
        }

        $in['func'] = 'PostRead';
        $response = $this->internal_Cmd($in);
        if ($response['answer'] === 'false') {
            goto leave;
        }
        $currentlyStoredDataString = $response['data'];
        $postExist = $response['post_exist'];

        if (empty($in['data']) === true) {
            if ($postExist === 'true') {
                $in['func'] = 'PostDelete';
                $response = $this->internal_Cmd($in);
                goto leave;
            }
            $response = [
                'answer' => 'true',
                'message' => 'Did not have to delete the post, it does not exist'
            ];
            goto leave;
        }

        $newDataString = $this->_JsonEncode($in['data']);
        $in['bubble'] = $newDataString;

        if ($postExist === 'false') {
            $in['func'] = 'PostInsert';
            $response = $this->internal_Cmd($in);
            goto leave;
        }

        if ($currentlyStoredDataString === $newDataString) {
            $response['message'] = 'No need to save the same data again';
            goto leave;
        }

        $in['func'] = 'PostUpdate';
        $response = $this->internal_Cmd($in);

        leave:
        $out = [
            'answer' => $response['answer'],
            'message' => $response['message'],
            'path' => $in['path'],
            'data' => $in['data'],
            'post_exist' => $postExist
        ];
        return $out;
    }

    /**
     * Parses a path into server, database, table, post
     * The parts can then be used to find the right server database, table, post
     * The full path will be used in the post as an identifier of the post
     * @param array $in
     * @return array
     */
    protected function internal_GetNames(array $in = []): array
    {
        $message = 'Here are the names';
        $neededCount = 4;

        $parts = explode('/', $in['path']);
        $partsCount = count($parts);
        if ($partsCount < $neededCount) {
            for ($i = $partsCount; $i < $neededCount; $i++) {
                $parts[] = 'main';
            }
            $message = 'Here are the names. Had to add extra default names to get ' . $neededCount;
        }

        $out = [
            'server_name' => array_shift($parts),
            'database_name' => array_shift($parts),
            'table_name' => array_shift($parts),
            'post_name' => implode('/', $parts)
        ];

        $outDefault = [
            'server_name' => 'main',
            'database_name' => 'main',
            'table_name' => 'main',
            'post_name' => 'main',
            'answer' => 'true',
            'message' => $message
        ];
        $out = $this->_Default($outDefault, $out);

        $in = array_merge($in, $out);
        return $in;
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
                'plugin_name_handler' => '',
                'plugin_name_owner' => 'main',
                'db_name' => '',
                'db_type' => 'file',
                'db_port' => '',
                'db_host' => '127.0.0.1',
                'db_user' => 'infohubuser',
                'db_password' => ''
            ]
        ];
        $in = $this->_Default($default, $in);

        $answer = 'false';
        $connection = null;

        $type = $in['connect']['db_type'] . ':';
        $host = 'host=' . $in['connect']['db_host'] . ';';
        $port = '';
        if ($in['connect']['db_port'] > 0) {
            $port = "port=" . $in['connect']['db_port'] . ';';
        }
        $connectionString = $type . $host . $port;

        $userName = $in['connect']['db_user'];
        $password = $in['connect']['db_password'];

        try {
            $connectionOptions = [
                PDO::MYSQL_ATTR_INIT_COMMAND => 'SET NAMES utf8',
                PDO::ATTR_PERSISTENT => false // If set to true you can get "[Errno 104] Connection reset by peer"
            ];
            $connection = new PDO($connectionString, $userName, $password, $connectionOptions);
            $connection->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        } catch (PDOException $e) {
            $message = 'Could not connect to SQL server - ' . $e->getMessage();
            goto leave;
        }

        $answer = 'true';
        $message = 'Here are the SQL server connection';

        leave:
        $out = [
            'answer' => $answer,
            'message' => $message,
            'connection' => $connection
        ];
        return $out;
    }

    /**
     * Creates a database if needed.
     * Sets the database as current for the connection.
     * @param array $in
     * @return array
     */
    protected function internal_DatabaseCreate(array $in = []): array
    {
        $default = [
            'where' => __CLASS__ . '.' . __FUNCTION__,
            'connection' => null,
            'database_name' => '',
        ];
        $in = $this->_Default($default, $in);

        $answer = 'false';

        $response = $this->internal_Execute(
            [
                'connection' => $in['connection'],
                'database_name' => $in['database_name'],
                'sql' => 'CREATE DATABASE IF NOT EXISTS {database_name}',
                'query' => 'false'
            ]
        );
        if ($response['answer'] === 'false') {
            $message = 'Could not create database: ' . $in['database_name'] . ' - ' . $response['message'];
            goto leave;
        }

        $answer = 'true';
        $message = 'Have created the database if it did not exist';

        leave:
        $out = [
            'answer' => $answer,
            'message' => $message
        ];
        return $out;
    }

    /**
     * Creates a table if needed. Complete with indexes.
     * Called every time data is written.
     * @param array $in
     * @return array
     */
    protected function internal_TableCreate(array $in = []): array
    {
        $default = [
            'where' => __CLASS__ . '.' . __FUNCTION__,
            'connection' => null,
            'database_name' => '',
            'table_name' => '',
        ];
        $in = $this->_Default($default, $in);

        $answer = 'false';

        $in['sql'] = <<<'EOD'
CREATE TABLE IF NOT EXISTS {database_name}.`{table_name}` (
    `path` varchar(127) COLLATE utf8_unicode_ci NOT NULL PRIMARY KEY COMMENT 'Name you choose for the post',
    `bubble` mediumtext COLLATE utf8_unicode_ci NOT NULL COMMENT 'Your textdata up to 16Mb'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci COMMENT='Infohub Storage';
EOD;

        $response = $this->internal_Execute($in);
        if ($response['answer'] === 'false') {
            $message = $response['message'];
            goto leave;
        }

        $answer = 'true';
        $message = 'Have created the table if it did not exist';

        leave:
        $out = [
            'answer' => $answer,
            'message' => $message
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
            'database_name' => '',
            'table_name' => '',
            'path' => ''
        ];
        $in = $this->_Default($default, $in);

        $postExist = 'false';

        $in['sql'] = 'select bubble from {database_name}.{table_name} where path=:path';
        $in['query'] = 'true';
        $response = $this->internal_Execute($in);

        if ($response['answer'] === 'false') {
            $response = $this->_HandleSQLError($response);
            if ($response['answer'] === 'false') {
                goto leave;
            }
        }

        if (isset($response['data'][0]['bubble'])) {
            $response['message'] = 'Here are the data string';
            $response['data'] = $response['data'][0]['bubble'];
            $postExist = 'true';
        } else {
            $response['message'] = 'Did not find any data string on that path';
            $response['data'] = [];
            $postExist = 'false';
        }

        leave:
        $out = [
            'answer' => $response['answer'],
            'message' => 'Post read: ' . $response['message'],
            'data' => $response['data'],
            'post_exist' => $postExist
        ];
        return $out;
    }

    /**
     * Insert data into a table
     * @param array $in
     * @return array
     */
    protected function internal_PostInsert(array $in = []): array
    {
        $default = [
            'where' => __CLASS__ . '.' . __FUNCTION__,
            'connection' => null,
            'database_name' => '',
            'table_name' => '',
            'path' => '',
            'bubble' => ''
        ];
        $in = $this->_Default($default, $in);

        $in['sql'] = 'insert into {database_name}.{table_name} (path, bubble) values (:path, :bubble)';
        $response = $this->internal_Execute($in);

        if ($response['answer'] === 'true') {
            $response['message'] = 'Have inserted the post';
        }

        $out = [
            'answer' => $response['answer'],
            'message' => 'Post insert: ' . $response['message']
        ];
        return $out;
    }

    /**
     * Update existing data in a table
     * @param array $in
     * @return array
     */
    protected function internal_PostUpdate(array $in = []): array
    {
        $default = [
            'where' => __CLASS__ . '.' . __FUNCTION__,
            'connection' => null,
            'database_name' => '',
            'table_name' => '',
            'path' => '',
            'bubble' => ''
        ];
        $in = $this->_Default($default, $in);

        $in['sql'] = 'update {database_name}.{table_name} set bubble = :bubble where path = :path';
        $response = $this->internal_Execute($in);

        if ($response['answer'] === 'true') {
            $response['message'] = 'Have updated the post';
        }

        return [
            'answer' => $response['answer'],
            'message' => 'Post update: ' . $response['message']
        ];
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
            'database_name' => '',
            'table_name' => '',
            'path' => ''
        ];
        $in = $this->_Default($default, $in);

        $in['sql'] = 'delete from {database_name}.{table_name} where path = :path';
        $response = $this->internal_Execute($in);

        if ($response['answer'] === 'false') {
            $response = $this->_HandleSQLError($response);
            if ($response['answer'] === 'false') {
                goto leave;
            }
        }

        if ($response['answer'] === 'true') {
            $response['message'] = 'Have deleted the post';
        }

        leave:
        $out = [
            'answer' => $response['answer'],
            'message' => 'Post delete: ' . $response['message'],
        ];
        return $out;
    }

    /**
     * You end up here if a SQL query/execution went wrong.
     * Now we determine how wrong, if we can recover or not.
     * @param array $response
     * @return array
     */
    protected function _HandleSQLError(array $response = []): array
    {
        $findArray = [
            'Base table or view not found'
        ];

        foreach ($findArray as $find) {
            $found = strpos($response['message'], $find);
            if ($found !== false) {
                $response['answer'] = 'true';
                $response['message'] = 'Got an SQL error but handled it';
                $response['data'] = [];
                goto leave;
            }
        }

        leave:
        return $response;
    }

    // *****************************************************************************
    // * Internal function that you reach from internal_Cmd
    // * Function name: internal_CamelCase
    // *****************************************************************************

    /**
     * Run a query against the database
     * Also connects the variables in the SQL statement.
     * @param array $in
     * @return array
     */
    protected function internal_Execute(array $in = []): array
    {
        $default = [
            'where' => __CLASS__ . '.' . __FUNCTION__,
            'connection' => null,
            'sql' => '',
            'query' => 'false'
        ];
        $in = $this->_Merge($default, $in);

        $response = [];
        $message = 'Success running SQL';
        $answer = 'true';

        $query = $in['query'];
        if (strtolower(substr($in['sql'], 0, 6)) === 'select') {
            $query = 'true';
        }

        try {
            $in['connection']->beginTransaction(); // Begin transaction
            $in['sql'] = $this->_SubstituteData($in);
            $stmt = $this->_BindData($in);
            $response = $stmt->execute();

            if ($response === false) {
                $in['connection']->rollback();
                $message = 'Failed running SQL';
                $answer = 'false';
                goto leave;
            }

            if ($query === 'true') {
                $response = $stmt->fetchAll(PDO::FETCH_ASSOC);
            } else {
                $response = $this->_Boolean($response);
            }

            $in['connection']->commit(); // End transaction

        } catch (PDOException $e) {
            $in['connection']->rollback();
            $message = 'Error executing SQL - ' . $e->getMessage() . '. SQL:' . substr($in['sql'], 0, 100);
            $answer = 'false';
        }

        leave:
        return [
            'answer' => $answer,
            'message' => $in['where'] . ' - ' . $message,
            'data' => $response,
            'query' => $query
        ];
    }

    /**
     * Looks through the array and pull out all parameters that could be used in the SQL query.
     * Then we substitute the parameters in the SQL query.
     * In the example all parameters with {parameter_name} will be substituted.
     * The :path is another binding that will be handled by _BindData() separately.
     * @param array $in
     * @return string
     * @example delete from {database_name}.{schema_name}.{table_name} where path = :path
     */
    protected function _SubstituteData(array $in = []): string
    {
        foreach ($in as $name => $newData) {
            if ($name === 'connection' or $name === 'sql' or $name === 'query') {
                continue;
            }
            if (is_array($newData)) {
                continue;
            }
            $replaceThis = '{' . $name . '}';
            $in['sql'] = str_replace($replaceThis, $newData, $in['sql']);
        }
        return $in['sql'];
    }

    /**
     * Does a real data field binding in the sql query
     * All parameters in the sql query that looks like this :myparamname
     * are bound to a value. This means that PHP decide if the value should be wrapped with " or not.
     * @param array $in
     * @return mixed
     */
    protected function _BindData(array $in = [])
    {
        $stmt = $in['connection']->prepare($in['sql']);
        foreach ($in as $name => $data) {
            if ($name === 'connection' or $name === 'sql' or $name === 'query') {
                continue;
            }
            $param = ':' . $name . '';
            if (strpos($in['sql'], $param) === false) {
                continue;
            }
            $stmt->bindValue($name, $data);
        }
        return $stmt;
    }

    /**
     * Turn a boolean true/false into a string "true" or "false".
     * Useful when substituting boolean values in sql strings.
     * @param bool $value
     * @return string
     */
    protected function _Boolean(bool $value): string
    {
        return $value ? 'true' : 'false';
    }

}
