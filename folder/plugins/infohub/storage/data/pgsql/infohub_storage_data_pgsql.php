<?php
declare(strict_types=1);
if (basename(__FILE__) == basename($_SERVER["SCRIPT_FILENAME"])) {
    exit; // This file must be included, not called directly
}

/**
 * infohub_storage store data in databases and is part of InfoHub.
 * Started writing code 2010-04-15 Peter Lembke - Team Fakta CharZam soft
 * Support for SQLite3, MySQL, PostgreSQL, Future support:Oracle, MS SQL
 * @category infohub
 * @package storage_pgsql
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
class infohub_storage_data_pgsql extends infohub_base
{
    final protected function _Version(): array
    {
        return array(
            'date' => '2017-08-13',
            'version' => '1.0.0',
            'version_structure' => '2011-10-12',
            'class_name' => 'infohub_storage_data_pgsql',
            'checksum' => '{{checksum}}',
            'note' => 'Support for PostgreSQL',
            'status' => 'normal'
        );
    }

    protected function _GetCmdFunctions(): array
    {
        return array(
            'read' => 'normal',
            'write' => 'normal',
            'read_paths' => 'normal', // Get a list of matching paths
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

        $postExist = 'false';
        $data = array();
        $answer = 'false';
        $message = 'Nothing to report';

        if (!extension_loaded('pdo_pgsql')) {
            $message = 'PDO PostgreSQL is not installed';
            goto leave;
        }

        $response = $this->internal_Cmd(array(
            'func' => 'ConnectionOpen',
            'connect' => $in['connect']
        ));
        if ($response['answer'] === 'false') {
            $message = $response['message'];
            goto leave;
        }
        $in['connection'] = $response['connection'];

        $response = $this->internal_Cmd(array(
            'func' => 'PostRead',
            'connection' => $in['connection'],
            'database_name' => $in['connect']['db_name'],
            'table_name' => $in['connect']['plugin_name_owner'],
            'path' => $in['path']
        ));
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
        $out = array(
            'answer' => $answer,
            'message' => $message,
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
        $answer = 'false';
        $message = 'Nothing to report';

        if (!extension_loaded('pdo_pgsql')) {
            $message = 'PDO PostgreSQL is not installed';
            goto leave;
        }

        $response = $this->internal_Cmd(array(
            'func' => 'ConnectionOpen',
            'connect' => $in['connect']
        ));
        if ($response['answer'] === 'false') {
            $message = $response['message'];
            goto leave;
        }
        $connection = $response['connection'];

        if (empty($in['data']) === false)
        {
            /*
            $response = $this->internal_Cmd(array(
                'func' => 'DatabaseCreate',
                'connection' => $connection,
                'database_name' => $in['connect']['db_name']
            ));
            if ($response['answer'] === 'false') {
                $message = $response['message'];
                goto leave;
            }
            */

            $response = $this->internal_Cmd(array(
                'func' => 'TableCreate',
                'connection' => $connection,
                'database_name' => $in['connect']['db_name'],
                'table_name' => $in['connect']['plugin_name_owner'],
                'db_user' => $in['connect']['db_user']
            ));
            if ($response['answer'] === 'false') {
                $message = $response['message'];
                goto leave;
            }
        }

        $response = $this->internal_Cmd(array(
            'func' => 'PostRead',
            'connection' => $connection,
            'database_name' => $in['connect']['db_name'],
            'table_name' => $in['connect']['plugin_name_owner'],
            'path' => $in['path']
        ));
        if ($response['answer'] === 'false') {
            $message = $response['message'];
            goto leave;
        }
        $currentlyStoredDataString = $response['data'];
        $postExist = $response['post_exist'];

        if (empty($in['data']) === true)
        {
            if ($postExist === 'true')
            {
                $response = $this->internal_Cmd(array(
                    'func' => 'PostDelete',
                    'connection' => $connection,
                    'database_name' => $in['connect']['db_name'],
                    'table_name' => $in['connect']['plugin_name_owner'],
                    'path' => $in['path']
                ));
                $answer = $response['answer'];
                $message = $response['message'];
                goto leave;
            }

            $answer = 'true';
            $message = 'Did not have to delete the post, it does not exist';
            goto leave;
        }

        $newDataString = $this->_JsonEncode($in['data']);

        if ($postExist === 'false') {
            $response = $this->internal_Cmd(array(
                'func' => 'PostInsert',
                'connection' => $connection,
                'database_name' => $in['connect']['db_name'],
                'table_name' => $in['connect']['plugin_name_owner'],
                'path' => $in['path'],
                'bubble' => $newDataString
            ));
            $answer = $response['answer'];
            $message = $response['message'];
            $postExist = $response['post_exist'];
            goto leave;
        }

        if ($currentlyStoredDataString === $newDataString) {
            $answer = 'true';
            $message = 'No need to save the same data again';
            goto leave;
        }

        $response = $this->internal_Cmd(array(
            'func' => 'PostUpdate',
            'connection' => $connection,
            'database_name' => $in['connect']['db_name'],
            'table_name' => $in['connect']['plugin_name_owner'],
            'path' => $in['path'],
            'bubble' => $newDataString
        ));
        $answer = $response['answer'];
        $message = $response['message'];

        leave:
        $out = array(
            'answer' => $answer,
            'message' => $message,
            'path' => $in['path'],
            'data' => $in['data'],
            'post_exist' => $postExist
        );
        return $out;
    }

    /**
     * You give an active db connection and a path with % in it,
     * you get a list with all matching paths
     * @param array $in
     * @return array
     */
    final protected function read_paths(array $in = array()): array
    {
        $default = array(
            'connect' => null,
            'path' => '',
            'with_data' => 'true'
        );
        $in = $this->_Default($default, $in);

        $data = array();
        $answer = 'false';
        $message = 'Nothing to report';

        if (!extension_loaded('pdo_pgsql')) {
            $message = 'PDO PostgreSQL is not installed';
            goto leave;
        }

        $response = $this->internal_Cmd(array(
            'func' => 'ConnectionOpen',
            'connect' => $in['connect']
        ));
        if ($response['answer'] === 'false') {
            $message = $response['message'];
            goto leave;
        }
        $in['connection'] = $response['connection'];

        $response = $this->internal_Cmd(array(
            'func' => 'ReadPaths',
            'connection' => $in['connection'],
            'database_name' => $in['connect']['db_name'],
            'table_name' => $in['connect']['plugin_name_owner'],
            'path' => $in['path'],
            'with_data' => $in['with_data']
        ));
        if ($response['answer'] === 'false') {
            $message = $response['message'];
            goto leave;
        }

        $data = $response['data'];
        $answer = 'true';
        $message = 'Here are the paths';

        leave:
        $out = array(
            'answer' => $answer,
            'message' => $message,
            'path' => $in['path'],
            'data' => $data
        );
        return $out;
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
                'plugin_name_handler' => 'infohub_storage_data_pgsql',
                'plugin_name_owner' => '',
                'db_type' => 'pgsql',
                'db_port' => '5432',
                'db_host' => '127.0.0.1',
                'db_user' => 'infohubuser',
                'db_password' => 'infohubpassword',
                'db_name' => 'infohub'
            )
        );
        $in = $this->_Default($default, $in);

        $answer = 'false';
        $message = 'An error occurred';
        $connection = null;

        $type = $in['connect']['db_type'] . ':';
        $host = 'host=' . $in['connect']['db_host'] . ';';

        $port = '';
        if ($in['connect']['db_port'] > 0) {
            $port = "port=" . $in['connect']['db_port'] . ';';
        }

        $dbName = '';
        if (!empty($in['connect']['db_name'])) {
            $dbName = 'dbname=' . $in['connect']['db_name'] . ';';
        }

        $user = '';
        if (!empty($in['connect']['db_user'])) {
            $user = 'user=' . $in['connect']['db_user'] . ';';
        }

        $password = '';
        if (!empty($in['connect']['db_password'])) {
            $password = 'password=' . $in['connect']['db_password'] . ';';
        }

        $connectionString = $type . $host . $port . $dbName . $user . $password;

        try {
            $connection = new PDO($connectionString);
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
     * Creates a schema if needed.
     * @param array $in
     * @return array
     */
    final protected function internal_SchemaCreate(array $in = array()): array
    {
        $default = array(
            'where' => __CLASS__ . '.' . __FUNCTION__,
            'connection' => null,
            'database_name' => '',
            'schema_name' => '',
            'db_user' => ''
        );
        $in = $this->_Default($default, $in);

        $answer = 'false';
        $message = 'Could not create the schema';

        $in['sql'] = <<<'EOD'
CREATE SCHEMA IF NOT EXISTS {schema_name} AUTHORIZATION {db_user};
EOD;
        $response = $this->internal_Execute($in);
        if ($response['answer'] === 'false') {
            $message = $response['message'];
            goto leave;
        }

        $in['sql'] = <<<'EOD'
COMMENT ON SCHEMA {schema_name} IS 'Schema created by Infohub';
EOD;
        $response = $this->internal_Execute($in);
        if ($response['answer'] === 'false') {
            $message = $response['message'];
            goto leave;
        }

        $answer = 'true';
        $message ='Have created the schema if it did not exist';

        leave:
        $out = array(
            'answer' => $answer,
            'message' => $message
        );
        return $out;
    }

    /**
     * Creates a table if needed. Complete with indexes.
     * @param array $in
     * @return array
     */
    final protected function internal_TableCreate(array $in = array()): array
    {
        $default = array(
            'where' => __CLASS__ . '.' . __FUNCTION__,
            'connection' => null,
            'database_name' => '',
            'schema_name' => 'public',
            'table_name' => '',
            'db_user' => ''
        );
        $in = $this->_Default($default, $in);

        $answer = 'false';

        $sqlArray = array(
            'CREATE TABLE IF NOT EXISTS {database_name}.{schema_name}.{table_name} ( path VARCHAR(127) PRIMARY KEY,bubble text) WITH ( OIDS=FALSE);',
            'ALTER TABLE {database_name}.{schema_name}.{table_name} OWNER TO {db_user};',
            'CREATE UNIQUE INDEX IF NOT EXISTS path_index ON {schema_name}.{table_name} USING btree (path COLLATE pg_catalog."default");'
        );
        foreach ($sqlArray as $sql) {
            $in['sql'] = $sql;
            $response = $this->internal_Execute($in);
            if ($response['answer'] === 'false') {
                $message = $response['message'];
                goto leave;
            }
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
            'schema_name' => 'public',
            'table_name' => '',
            'path' => ''
        );
        $in = $this->_Default($default, $in);

        $postExist = 'false';

        $in['sql'] = 'select bubble from {database_name}.{schema_name}.{table_name} where path=:path';
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
     * Gives you the matching paths in a list
     * The path contains % signs that equals to anything. Then the matching paths are returned to you
     * @param array $in
     * @return array
     */
    final protected function internal_ReadPaths(array $in = array()): array
    {
        $default = array(
            'where' => __CLASS__ . '.' . __FUNCTION__,
            'connection' => null,
            'database_name' => '',
            'table_name' => '',
            'path' => '',
            'with_data' => 'true'
        );
        $in = $this->_Default($default, $in);

        $in['path'] = str_replace('*', '%', $in['path']);

        $answer = array();

        $in['sql'] = 'select * from {database_name}.{table_name} where path like :path';
        $in['query'] = 'true';
        $response = $this->internal_Execute($in);

        if ($response['answer'] === 'false') {
            $response = $this->_HandleSQLError($response);
            if ($response['answer'] === 'false') {
                goto leave;
            }
        }

        foreach ($response['data'] as $data)
        {
            $path = $data['path'];

            $dataBack = array();
            if ($in['with_data'] === 'true') {
                $dataBack = $this->_JsonDecode($data['bubble']);
            }

            $answer[$path] = $dataBack;
        }

        $response['answer'] = 'true';
        $response['message'] = 'Here are the paths that I found';

        leave:
        $out = array(
            'answer' => $response['answer'],
            'message' => $response['message'],
            'data' => $answer
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
            'schema_name' => 'public',
            'table_name' => '',
            'path' => '',
            'bubble' => ''
        );
        $in = $this->_Default($default, $in);

        $in['sql'] = 'insert into {database_name}.{schema_name}.{table_name} (path, bubble) values (:path, :bubble)';
        $response = $this->internal_Execute($in);

        if ($response['answer'] === 'true') {
            $response['message'] ='Have inserted the post';
        }

        $out = array(
            'answer' => $response['answer'],
            'message' => 'Post insert: ' . $response['message'],
            'post_exist' => $response['answer']
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
            'schema_name' => 'public',
            'table_name' => '',
            'path' => '',
            'bubble' => ''
        );
        $in = $this->_Default($default, $in);

        $in['sql'] = 'update {database_name}.{schema_name}.{table_name} set bubble=:bubble where path=:path';
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
            'schema_name' => 'public',
            'table_name' => '',
            'path' => ''
        );
        $in = $this->_Default($default, $in);

        $in['sql'] = 'delete from {database_name}.{schema_name}.{table_name} where path = :path';
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
            if ($found !== false) {
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
     * @param $value
     * @return string
     */
    final protected function _Boolean(bool $value): string
    {
        return $value ? 'true' : 'false';
    }

}
