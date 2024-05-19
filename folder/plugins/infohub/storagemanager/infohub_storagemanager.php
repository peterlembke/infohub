<?php
/**
 * Administrators can modify database connections, set encryption keys, take backups, move tables and data
 *
 * @package     Infohub
 * @subpackage  infohub_storagemanager
 */

declare(strict_types=1);
if (basename(__FILE__) == basename($_SERVER['SCRIPT_FILENAME'])) {
    exit; // This file must be included, not called directly
}

/**
 * Administrators can modify database connections, set encryption keys, take backups, move tables and data
 *
 * @author      Peter Lembke <info@infohub.se>
 * @version     2017-07-23
 * @since       2010-04-15
 * @copyright   Copyright (c) 2010, Peter Lembke, CharZam soft
 * @license     https://opensource.org/licenses/gpl-license.php GPL-3.0-or-later
 * @see         https://github.com/peterlembke/infohub/blob/master/folder/plugins/infohub/storagemanager/infohub_storagemanager.md Documentation
 * @link        https://infohub.se/ InfoHub main page
 */
class infohub_storagemanager extends infohub_base
{
    /**
     * Version information for this plugin
     * @return  string[]
     * @since   2010-04-15
     * @author  Peter Lembke
     * @version 2017-07-23
     */
    protected function _Version(): array
    {
        return [
            'date' => '2017-07-23',
            'since' => '2010-04-15',
            'version' => '1.3.0',
            'class_name' => 'infohub_storagemanager',
            'checksum' => '{{checksum}}',
            'note' => 'Handle sensitive data about updating storage connections.',
            'status' => 'normal',
            'SPDX-License-Identifier' => 'GPL-3.0-or-later'
        ];
    }

    /**
     * Public functions in this plugin
     *
     * @return string[]
     * @author  Peter Lembke
     * @version 2017-07-23
     * @since   2010-04-15
     */
    protected function _GetCmdFunctions(): array
    {
        return [
            'read_connection' => 'normal',
            'write_connection' => 'normal',
        ];
    }

    /**
     * Get data for a database connection
     * @param array $in
     * @return array
     * @author  Peter Lembke
     * @version 2017-07-26
     * @since   2016-07-17
     */
    protected function read_connection(array $in = []): array
    {
        $default = [
            'plugin_name' => '',
            'step' => 'step_start',
            'response' => [
                'answer' => 'false',
                'message' => 'Nothing to do',
                'data' => [],
                'post_exist' => 'false',
            ]
        ];
        $in = $this->_Default($default, $in);

        if ($in['step'] === 'step_start') {
            if (empty($in['plugin_name'])) {
                $in['response']['message'] = 'Plugin name can not be empty';
                goto leave;
            }

            $path = 'infohub_storagemanager/connection/' . $in['plugin_name'];

            return $this->_SubCall(
                [
                    'to' => [
                        'node' => 'server',
                        'plugin' => 'infohub_storage',
                        'function' => 'read'
                    ],
                    'data' => [
                        'path' => $path
                    ],
                    'data_back' => [
                        'step' => 'step_end',
                        'plugin_name' => $in['plugin_name']
                    ]
                ]
            );
        }

        if ($in['step'] === 'step_end') {
            $a = 1;
        }

        leave:
        $response = [
            'answer' => $in['response']['answer'],
            'message' => $in['response']['message'],
            'post_exist' => $in['response']['post_exist'],
            'data' => $in['response']['data']
        ];
        return $response;
    }

    /**
     * Write data for a database connection
     * @author  Peter Lembke
     * @version 2017-07-26
     * @since   2016-07-17
     * @param  array  $in
     * @return array
     */
    protected function write_connection(array $in = []): array
    {
        $default = [
            'data' => [
                'plugin_name_owner' => '', // Level 1 Plugin name that own the data
                'plugin_name_handler' => '', // Name of the storage child plugin that can handle this connection
                'db_type' => '', // One of the supported strings: psql, mysql, sqlite, redis, file, couchdb
                'db_host' => '', // If required, IP number or domain name to sql server. Empty for sqlite
                'db_port' => '', // The IP port to the sql server, or empty for sqlite
                'db_user' => '', // If required, username on sql server or empty for sqlite
                'db_password' => '', // password for username, or empty for sqlite
                'db_name' => '', // name of the database / name of the sqlite file
            ],
            'step' => 'step_start',
            'response' => [
                'answer' => 'false',
                'message' => 'Nothing to report'
            ]
        ];
        $in = $this->_Default($default, $in);

        if ($in['step'] === 'step_start') {
            if (empty($in['data']['plugin_name_owner'])) {
                $in['response']['message'] = 'plugin_name_owner can not be empty';
                goto leave;
            }

            $path = 'infohub_storagemanager/connection/' . $in['data']['plugin_name_owner'];

            return $this->_SubCall(
                [
                    'to' => [
                        'node' => 'server',
                        'plugin' => 'infohub_storage',
                        'function' => 'write'
                    ],
                    'data' => [
                        'path' => $path,
                        'data' => $in['data']
                    ],
                    'data_back' => [
                        'step' => 'step_end',
                        'data' => $in['data']
                    ]
                ]
            );
        }

        if ($in['step'] === 'step_end') {
            $a = 1;
        }

        leave:
        $response = [
            'answer' => $in['response']['answer'],
            'message' => $in['response']['message']
        ];
        return $response;
    }

}
