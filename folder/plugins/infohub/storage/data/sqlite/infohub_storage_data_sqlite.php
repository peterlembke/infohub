<?php
/**
 * infohub_storage store data in databases and is part of InfoHub.
 * Started writing code 2010-04-15 Peter Lembke - Team Fakta CharZam soft
 * Support for SQLite3, MySQL, PostgreSQL, Future support:Oracle, MS SQL
 *
 * @package     Infohub
 * @subpackage  infohub_storage_data_sqlite
 */

declare(strict_types=1);
if (basename(__FILE__) == basename($_SERVER['SCRIPT_FILENAME'])) {
    exit; // This file must be included, not called directly
}

/**
 * infohub_storage store data in databases and is part of InfoHub.
 * Started writing code 2010-04-15 Peter Lembke - Team Fakta CharZam soft
 * Support for SQLite3, MySQL, PostgreSQL, Future support:Oracle, MS SQL
 *
 * @author      Peter Lembke <info@infohub.se>
 * @version     2018-03-10
 * @since       2014-12-06
 * @copyright   Copyright (c) 2014, Peter Lembke
 * @license     https://opensource.org/licenses/gpl-license.php GPL-3.0-or-later
 * @see         https://github.com/peterlembke/infohub/blob/master/folder/plugins/infohub/storage/data/sqlite/infohub_storage_data_sqlite.md Documentation
 * @link        https://infohub.se/ InfoHub main page
 */
class infohub_storage_data_sqlite extends infohub_base
{
    /**
     * Version information for this plugin
     * @return  string[]
     * @since   2014-12-06
     * @author  Peter Lembke
     * @version 2018-03-10
     */
    protected function _Version(): array
    {
        return [
            'date' => '2018-03-10',
            'since' => '2014-12-06',
            'version' => '1.0.1',
            'version_structure' => '2011-10-12',
            'class_name' => 'infohub_storage_data_sqlite',
            'checksum' => '{{checksum}}',
            'note' => 'Support for SQLite. Useful for copying data and transporting data on a USB memory',
            'status' => 'normal',
            'SPDX-License-Identifier' => 'GPL-3.0-or-later'
        ];
    }

    /**
     * Public functions in this plugin
     *
     * @return array
     * @author  Peter Lembke
     * @version 2018-03-10
     * @since   2014-12-06
     */
    protected function _GetCmdFunctions(): array
    {
        $list = [
            'read' => 'normal', // Read data from a path
            'write' => 'normal', // Write data to a path
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

        if (!extension_loaded('pdo_sqlite')) {
            $message = 'PDO SQLite is not installed';
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
     * If data exist and are different, then the post will be updated
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

        if (!extension_loaded('pdo_sqlite')) {
            $message = 'PDO SQLite is not installed';
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

        if (empty($in['data']) === false) {
            $response = $this->internal_Cmd(
                [
                    'func' => 'DatabaseCreate',
                    'connection' => $connection,
                    'database_name' => $in['connect']['db_name']
                ]
            );
            if ($response['answer'] === 'false') {
                $message = $response['message'];
                goto leave;
            }

            $response = $this->internal_Cmd(
                [
                    'func' => 'TableCreate',
                    'connection' => $connection,
                    'database_name' => $in['connect']['db_name'],
                    'table_name' => $in['connect']['plugin_name_owner'],
                ]
            );
            if ($response['answer'] === 'false') {
                $message = $response['message'];
                goto leave;
            }
        }

        $response = $this->internal_Cmd(
            [
                'func' => 'PostRead',
                'connection' => $connection,
                'database_name' => $in['connect']['db_name'],
                'table_name' => $in['connect']['plugin_name_owner'],
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
                        'database_name' => $in['connect']['db_name'],
                        'table_name' => $in['connect']['plugin_name_owner'],
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

        if ($postExist === 'false') {
            $response = $this->internal_Cmd(
                [
                    'func' => 'PostInsert',
                    'connection' => $connection,
                    'database_name' => $in['connect']['db_name'],
                    'table_name' => $in['connect']['plugin_name_owner'],
                    'path' => $in['path'],
                    'bubble' => $newDataString
                ]
            );
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

        $response = $this->internal_Cmd(
            [
                'func' => 'PostUpdate',
                'connection' => $connection,
                'database_name' => $in['connect']['db_name'],
                'table_name' => $in['connect']['plugin_name_owner'],
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

        if (!extension_loaded('pdo_sqlite')) {
            $message = 'PDO SQLite is not installed';
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
                'plugin_name_handler' => 'infohub_storage_data_sqlite',
                'plugin_name_owner' => '',
                'db_type' => 'sqlite',
                'db_port' => '',
                'db_host' => '',
                'db_user' => '',
                'db_password' => '',
                'db_name' => 'infohub'
            ]
        ];
        $in = $this->_Default($default, $in);

        $answer = 'false';
        $message = 'An error occurred';
        $connection = null;

        try {
            $databasePathName = DB . DS . $in['connect']['db_name'] . '.sqlite';
            $fileName = $in['connect']['db_type'] . ':' . $databasePathName;
            $connection = new PDO($fileName);
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
            'database_name' => ''
        ];
        $in = $this->_Default($default, $in);

        $answer = 'false';
        $currentPath = getcwd();

        $databasePathName = DB . DS . $in['database_name'] . '.sqlite';
        if (file_exists($databasePathName) === false) {
            $message = 'The database do not exist: ' . $databasePathName . ', it should have been created when the connection was opened';
            goto leave;
        }

        $chmod = false;
        if (is_writeable($databasePathName) === false) {
            $message = 'Can not write to the database: ' . $in['database_name'];
            $chmod = true;
        }
        if (is_readable($databasePathName) === false) {
            $message = 'Can not read from the database: ' . $in['database_name'];
            $chmod = true;
        }
        if ($chmod === true) {
            chmod($databasePathName, 0666);
            $message = 'Have changed the file rights to the database: ' . $in['database_name'];
        }
        if (is_readable($databasePathName) === false || is_writable($databasePathName) === false) {
            $message = 'Still can not read or write to the database: ' . $in['database_name'];
            goto leave;
        }

        $answer = 'true';
        $message = 'The database should now be accessible';

        leave:
        $out = [
            'answer' => $answer,
            'message' => $message,
            'file' => $databasePathName,
            'current_path' => $currentPath
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
CREATE TABLE IF NOT EXISTS "{table_name}" (
    "path" VARCHAR(127) PRIMARY KEY  NOT NULL  UNIQUE,
    "bubble" TEXT
)
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

        $in['sql'] = 'select bubble from {table_name} where path=:path';
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
            'database_name' => '',
            'table_name' => '',
            'path' => '',
            'with_data' => 'true'
        ];
        $in = $this->_Default($default, $in);

        $in['path'] = str_replace('*', '%', $in['path']);

        $answer = [];

        $in['sql'] = 'select * from {table_name} where path like :path';
        $in['query'] = 'true';
        $response = $this->internal_Execute($in);

        if ($response['answer'] === 'false') {
            $response = $this->_HandleSQLError($response);
            if ($response['answer'] === 'false') {
                goto leave;
            }
        }

        foreach ($response['data'] as $data) {
            $path = $data['path'];

            $dataBack = [];
            if ($in['with_data'] === 'true') {
                $dataBack = $this->_JsonDecode($data['bubble']);
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

        $in['sql'] = 'insert into {table_name} (path, bubble) values (:path, :bubble)';
        $response = $this->internal_Execute($in);

        if ($response['answer'] === 'true') {
            $response['message'] = 'Have inserted the post';
        }

        $out = [
            'answer' => $response['answer'],
            'message' => 'Post insert: ' . $response['message'],
            'post_exist' => $response['answer']
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

        $in['sql'] = 'update {table_name} set bubble = :bubble where path = :path';
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

        $in['sql'] = 'delete from {table_name} where path = :path';
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

            $inTransaction = $in['connection']->inTransaction();
            if ($inTransaction === true) {
                $in['connection']->commit(); // End transaction
            }

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
     * are bound to a value. This means that PHP decide if the value should be wrapped with quotation or not.
     * @param  array  $in
     * @return PDOStatement
     */
    protected function _BindData(array $in = []): PDOStatement
    {
        /** @var PDOStatement $stmt */
        $stmt = $in['connection']->prepare($in['sql']);

        foreach ($in as $name => $data) {
            if ($name === 'connection' or $name === 'sql' or $name === 'query') {
                continue;
            }
            $param = ':' . $name;
            if (str_contains($in['sql'], $param) === false) {
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
