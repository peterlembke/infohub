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
if (basename(__FILE__) == basename($_SERVER['SCRIPT_FILENAME'])) {
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
     *
     * @return array
     * @author  Peter Lembke
     * @version 2017-02-04
     * @since   2014-12-06
     */
    protected function _GetCmdFunctions(): array
    {
        $list = [
            'read' => 'normal',
            'write' => 'normal'
        ];

        return parent::_GetCmdFunctionsBase($list);
    }

    /**
     * You get the data stored on that path
     *
     * @param array $in
     * @return array
     */
    protected function read(array $in = []): array
    {
        $default = [
            'connect' => null,
            'path' => '',
            'step' => 'step_call_file',
            'response' => [
                'answer' => '',
                'message' => '',
                'contents' => ''
            ]
        ];
        $in = $this->_Default($default, $in);

        if ($in['step'] === 'step_call_file') {
            return $this->_Subcall([
                'to' => [
                    'node' => 'server',
                    'plugin' => 'infohub_file',
                    'function' => 'read'
                ],
                'data' => [
                    'path' => $in['path'],
                ],
                'data_back' => [
                    'step' => 'step_call_file_response',
                    'path' => $in['path']
                ]
            ]);
        }

        $out = [
            'answer' => $in['response']['answer'],
            'message' => $in['response']['message'],
            'path' => $in['path'],
            'data' => $in['response']['contents'],
            'post_exist' => $in['response']['answer']
        ];

        return $out;
    }

    /**
     * Write the data array to the path
     *
     * @param array $in
     * @return array
     */
    protected function write(array $in = []): array
    {
        $default = [
            'connect' => [],
            'path' => '',
            'data' => [],
            'step' => 'step_start',
            'response' => [
                'answer' => '',
                'message' => '',
            ],
            'data_back' => [
                'contents' => ''
            ]
        ];
        $in = $this->_Default($default, $in);

        if ($in['step'] === 'step_call_file') {

            $contents = $this->_JsonEncode($in['data']);

            return $this->_Subcall([
                'to' => [
                    'node' => 'server',
                    'plugin' => 'infohub_file',
                    'function' => 'write'
                ],
                'data' => [
                    'path' => $in['path'],
                    'contents' => $contents,
                    'allow_overwrite' => 'true'
                ],
                'data_back' => [
                    'step' => 'step_call_file_response',
                    'path' => $in['path'],
                    'contents' => $contents
                ]
            ]);
        }

        $out = [
            'answer' => $in['response']['answer'],
            'message' => $in['response']['message'],
            'path' => $in['path'],
            'data' => $in['data_back']['contents'],
            'post_exist' => $in['response']['answer']
        ];

        return $out;
    }
}
