<?php
if (basename(__FILE__) == basename($_SERVER["SCRIPT_FILENAME"])) {
    exit; // This file must be included, not called directly
}

/**
 * infohub_storage store data in databases and is part of InfoHub.
 * Started writing code 2010-04-15 Peter Lembke - Team Fakta CharZam soft
 * Support for SQLite3, MySQL, PostgreSQL, Future support:Oracle, MS SQL
 * @category infohub
 * @package storage_file
 * @copyright Copyright (c) 2010, Peter Lembke, CharZam soft
 * @since 2014-12-06
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
class infohub_storage_data_file extends infohub_base
{
    final protected function _Version(): array
    {
        return array(
            'date' => '2017-02-04',
            'version' => '1.0.0',
            'version_structure' => '2011-10-12',
            'class_name' => 'infohub_storage_data_file',
            'checksum' => '{{checksum}}',
            'note' => 'Support for storage in files and folders',
            'status' => 'normal'
        );
    }

    protected function _GetCmdFunctions(): array
    {
        return array(
            'read' => 'normal',
            'write' => 'normal'
        );
    }

    /**
     * You give an active db connection and a path,
     * you get the data stored on that path.
     * @param array $in
     * @return array
     */
    final protected function read(array $in = array()): array
    {
        $default = array(
            'connect' => null,
            'path' => ''
        );
        $in = $this->_Default($default, $in);

        $data = array();
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
        $out = array(
            'answer' => $response['answer'],
            'message' => $response['message'],
            'path' => $in['path'],
            'data' => $data,
            'post_exist' => $postExist
        );
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
    final protected function write(array $in = array()): array
    {
        $default = array(
            'connect' => array(),
            'path' => '',
            'data' => array()
        );
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

        if (empty($in['data']) === false)
        {
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
            $response = array(
                'answer' => 'true',
                'message' => 'Did not have to delete the post, it does not exist'
            );
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
        $out = array(
            'answer' => $response['answer'],
            'message' => $response['message'],
            'path' => $in['path'],
            'data' => $in['data'],
            'post_exist' => $postExist
        );
        return $out;
    }

    /**
     * Parses a path into server, database, table, post
     * The parts can then be used to find the right server database, table, post
     * The full path will be used in the post as an identifier of the post
     * @param array $in
     * @return array
     */
    final protected function internal_GetNames(array $in = array()): array
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

        $out = array(
            'server_name' => array_shift($parts),
            'database_name' => array_shift($parts),
            'table_name' => array_shift($parts),
            'post_name' => implode('/', $parts)
        );

        $outDefault = array(
            'server_name' => 'main',
            'database_name' => 'main',
            'table_name' => 'main',
            'post_name' => 'main',
            'answer' => 'true',
            'message' => $message
        );
        $out = $this->_Default($outDefault, $out);

        $in = array_merge($in, $out);
        return $in;
    }

    /**
     * Returns a db connection with the help of the connect-variables.
     * @param array $in
     * @return array
     */
    final protected function internal_ConnectionOpen(array $in = array()): array
    {
        $default = array(
            'where' => __CLASS__ . '.' . __FUNCTION__,
            'connect' => array(
                'plugin_name_handler' => '',
                'plugin_name_owner' => 'main',
                'db_name' => '',
                'db_type' => 'file',
                'db_port' => '',
                'db_host' => '127.0.0.1',
                'db_user' => 'infohubuser',
                'db_password' => ''
            )
        );
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
            $connectionOptions = array(
                PDO::MYSQL_ATTR_INIT_COMMAND => 'SET NAMES utf8',
                PDO::ATTR_PERSISTENT => false // If set to true you can get "[Errno 104] Connection reset by peer"
            );
            $connection = new PDO($connectionString, $userName, $password, $connectionOptions);
            $connection->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        } catch (PDOException $e) {
            $message = 'Could not connect to SQL server - ' . $e->getMessage();
            goto leave;
        }

        $answer = 'true';
        $message = 'Here are the SQL server connection';

        leave:
        $out = array(
            'answer' => $answer,
            'message' => $message,
            'connection' => $connection
        );
        return $out;
    }

    /**
     * Creates a database if needed.
     * Sets the database as current for the connection.
     * @param array $in
     * @return array
     */
    final protected function internal_DatabaseCreate(array $in = array()): array
    {
        $default = array(
            'where' => __CLASS__ . '.' . __FUNCTION__,
            'connection' => null,
            'database_name' => '',
        );
        $in = $this->_Default($default, $in);

        $answer = 'false';

        $response = $this->internal_Execute(array(
            'connection' => $in['connection'],
            'database_name' => $in['database_name'],
            'sql' => 'CREATE DATABASE IF NOT EXISTS {database_name}',
            'query' => 'false'
        ));
        if ($response['answer'] === 'false') {
            $message = 'Could not create database: ' . $in['database_name'] . ' - ' . $response['message'];
            goto leave;
        }

        $answer = 'true';
        $message ='Have created the database if it did not exist';

        leave:
        $out = array(
            'answer' => $answer,
            'message' => $message
        );
        return $out;
    }

    /**
     * Creates a table if needed. Complete with indexes.
     * Called every time data is written.
     * @param array $in
     * @return array
     */
    final protected function internal_TableCreate(array $in = array()): array
    {
        $default = array(
            'where' => __CLASS__ . '.' . __FUNCTION__,
            'connection' => null,
            'database_name' => '',
            'table_name' => '',
        );
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
        $message ='Have created the table if it did not exist';

        leave:
        $out = array(
            'answer' => $answer,
            'message' => $message
        );
        return $out;
    }

    /**
     * Gives you the data on that path
     * @param array $in
     * @return array
     */
    final protected function internal_PostRead(array $in = array()): array
    {
        $default = array(
            'where' => __CLASS__ . '.' . __FUNCTION__,
            'connection' => null,
            'database_name' => '',
            'table_name' => '',
            'path' => ''
        );
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
            $response['message'] ='Here are the data string';
            $response['data'] = $response['data'][0]['bubble'];
            $postExist = 'true';
        } else {
            $response['message'] ='Did not find any data string on that path';
            $response['data'] = array();
            $postExist = 'false';
        }

        leave:
        $out = array(
            'answer' => $response['answer'],
            'message' => 'Post read: ' . $response['message'],
            'data' => $response['data'],
            'post_exist' => $postExist
        );
        return $out;
    }

    /**
     * Insert data into a table
     * @param array $in
     * @return array
     */
    final protected function internal_PostInsert(array $in = array()): array
    {
        $default = array(
            'where' => __CLASS__ . '.' . __FUNCTION__,
            'connection' => null,
            'database_name' => '',
            'table_name' => '',
            'path' => '',
            'bubble' => ''
        );
        $in = $this->_Default($default, $in);

        $in['sql'] = 'insert into {database_name}.{table_name} (path, bubble) values (:path, :bubble)';
        $response = $this->internal_Execute($in);

        if ($response['answer'] === 'true') {
            $response['message'] ='Have inserted the post';
        }

        $out = array(
            'answer' => $response['answer'],
            'message' => 'Post insert: ' . $response['message']
        );
        return $out;
    }

    /**
     * Update existing data in a table
     * @param array $in
     * @return array
     */
    final protected function internal_PostUpdate(array $in = array()): array
    {
        $default = array(
            'where' => __CLASS__ . '.' . __FUNCTION__,
            'connection' => null,
            'database_name' => '',
            'table_name' => '',
            'path' => '',
            'bubble' => ''
        );
        $in = $this->_Default($default, $in);

        $in['sql'] = 'update {database_name}.{table_name} set bubble = :bubble where path = :path';
        $response = $this->internal_Execute($in);

        if ($response['answer'] === 'true') {
            $response['message'] ='Have updated the post';
        }

        return array(
            'answer' => $response['answer'],
            'message' => 'Post update: ' . $response['message']
        );
    }

    /**
     * Delete a row from a table
     * @param array $in
     * @return array
     */
    final protected function internal_PostDelete(array $in = array()): array
    {
        $default = array(
            'where' => __CLASS__ . '.' . __FUNCTION__,
            'connection' => null,
            'database_name' => '',
            'table_name' => '',
            'path' => ''
        );
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
            $response['message'] ='Have deleted the post';
        }

        leave:
        $out = array(
            'answer' => $response['answer'],
            'message' => 'Post delete: ' . $response['message'],
        );
        return $out;
    }

    /**
     * @param array $response
     * @return array
     */
    final protected function _HandleSQLError(array $response = array()): array
    {
        $findArray = array(
            'Base table or view not found'
        );

        foreach ($findArray as $find) {
            $found = strpos($response['message'], $find);
            if ($found >= 0) {
                $response['answer'] = 'true';
                $response['message'] = 'Got an SQL error but handled it';
                $response['data'] = array();
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
    final protected function internal_Execute(array $in = array()): array
    {
        $default = array(
            'where' => __CLASS__ . '.' . __FUNCTION__,
            'connection' => null,
            'sql' => '',
            'query' => 'false'
        );
        $in = $this->_Merge($default, $in);

        $response = array();
        $message = 'Success running SQL';
        $answer = 'true';

        $query = $in['query'];
        if (strtolower(substr($in['sql'], 0,6)) === 'select') {
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
            $message = 'Error executing SQL - ' . $e->getMessage() . '. SQL:' . substr($in['sql'],0,100);
            $answer = 'false';
        }

        leave:
        return array(
            'answer' => $answer,
            'message' => $in['where'] . ' - ' . $message,
            'data' => $response,
            'query' => $query
        );
    }

    /**
     * @param array $in
     * @return string
     */
    final protected function _SubstituteData(array $in = array()): string
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
     * @param array $in
     * @return mixed
     */
    final protected function _BindData(array $in = array())
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
     * @param bool $value
     * @return string
     */
    final protected function _Boolean(bool $value): string
    {
        return $value ? 'true' : 'false';
    }

}
