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
 * Class infohub_storage
 * The storage is a table in a database. A bubble is a post with child posts.
 * The first bubbles name is main and come from the main database, main storage.
 */
class infohub_storage extends infohub_base
{
    protected function _Version(): array
    {
        return array(
            'date' => '2017-07-20',
            'version' => '1.3.0',
            'class_name' => 'infohub_storage',
            'checksum' => '{{checksum}}',
            'note' => 'Store your data. Simple, Stand alone',
            'status' => 'normal',
            'license_name' => 'GNU GPL 3 or later'
        );
    }

    protected function _GetCmdFunctions(): array
    {
        return array(
            'read' => 'normal',
            'write' => 'normal',
            'read_many' => 'normal',
            'write_many' => 'normal'
        );
    }

    protected function _TrimPath($path = ''): string
    {
        $newPath = strtolower(trim($path));
        $newPath = str_replace(' ', '_', $newPath);
        return $newPath;
    }

    /**
     * General function for reading data from a path
     * @version 2017-07-20
     * @since   2016-01-30
     * @author  Peter Lembke
     * @param array $in
     * @return array
     */
    final protected function read(array $in = array()): array
    {
        $default = array(
            'step' => 'step_start',
            'path' => '',
            'from_plugin' => array('node' => '', 'plugin' => ''),
            'calling_plugin' => array('node' => '', 'plugin' => ''),
            'response' => array(
                'answer' => 'false',
                'message' => 'There was an error',
                'data' => array(),
                'post_exist' => 'false',
            )
        );
        $in = $this->_Default($default, $in);

        if ($in['from_plugin']['node'] !== 'server') {
            $in['response']['message'] = 'I only accept messages that origin from this server node';
            goto leave;
        }
        
        if ($this->_Empty($in['calling_plugin']['node']) === 'false') {
            if ($in['calling_plugin']['node'] !== 'server') {
                $in['response']['message'] = 'I only accept messages from this client node';
                goto leave;
            }
            if ($this->_Empty($in['calling_plugin']['plugin']) === 'false') {
                if ($in['from_plugin']['plugin'] === 'infohub_storage') {
                    $in['from_plugin']['plugin'] = $in['calling_plugin']['plugin'];
                }
            }
        }

        if ($in['from_plugin']['plugin'] !== 'infohub_storage') {
            if (strpos($in['path'], $in['from_plugin']['plugin'] . '/') !== 0) {
                $in['response']['message'] = 'I only accept paths that start with the calling plugin name';
                goto leave;
            }
        }

        if ($in['step'] === 'step_start')
        {
            $in['path'] = $this->_TrimPath($in['path']);
            if (strpos($in['path'], $in['from_plugin']['plugin'] . '/') !== 0) {
                $in['response']['answer'] = 'false';
                $row = 'Your plugin: %s, is not allowed to read this path: %s';
                $in['response']['message'] = sprintf($row, $in['from_plugin']['plugin'], $in['path']);
                $in['response']['data'] = array();
                goto leave;
            }

            return $this->_SubCall(array(
                'to' => array(
                    'node' => 'server',
                    'plugin' => 'infohub_storage_data',
                    'function' => 'read'
                ),
                'data' => array(
                    'path' => $in['path'],
                    'calling_plugin' => $in['from_plugin']
                ),
                'data_back' => array(
                    'step' => 'step_end'
                )
            ));
        }

        if ($in['step'] === 'step_end') {
            $a=1;
        }

        leave:
        $response = array(
            'answer' => $in['response']['answer'],
            'message' => $in['response']['message'],
            'function' => 'read',
            'path' => $in['path'],
            'data' => $in['response']['data'],
            'post_exist' => $in['response']['post_exist']
        );
        return $response;
    }

    /**
     * General function for writing to a path
     * @version 2017-07-20
     * @since   2016-01-30
     * @author  Peter Lembke
     * @param array $in
     * @return array
     */
    final protected function write(array $in = array()): array
    {
        $default = array(
            'from_plugin' => array('node' => '', 'plugin' => ''),
            'calling_plugin' => array('node' => '', 'plugin' => ''),
            'step' => 'step_start',
            'path' => '',
            'data' => array(),
            'response' => array(
                'answer' => 'false',
                'message' => 'There was an error',
                'saved_data' => array(),
                'post_exist' => 'false',
            )
        );
        $in = $this->_Default($default, $in);
        
        if ($in['from_plugin']['node'] !== 'server') {
            $in['response']['message'] = 'I only accept messages that origin from this server node';
            goto leave;
        }

        if ($this->_Empty($in['calling_plugin']['node']) === 'false') {
            if ($in['calling_plugin']['node'] !== 'server') {
                $in['response']['message'] = 'I only accept messages from this client node';
                goto leave;
            }
            if ($this->_Empty($in['calling_plugin']['plugin']) === 'false') {
                if ($in['from_plugin']['plugin'] === 'infohub_storage') {
                    $in['from_plugin']['plugin'] = $in['calling_plugin']['plugin'];
                }
            }
        }
        
        if ($in['from_plugin']['plugin'] !== 'infohub_storage') {
            if (strpos($in['path'], $in['from_plugin']['plugin'] . '/') !== 0) {
                $in['response']['message'] = 'I only accept paths that start with the calling plugin name';
                goto leave;
            }
        }

        if ($in['step'] === 'step_start')
        {
            $in['path'] = $this->_TrimPath($in['path']);
            ksort($in['data']);
            return $this->_SubCall(array(
                'to' => array(
                    'node' => 'server',
                    'plugin' => 'infohub_storage_data',
                    'function' => 'write'
                ),
                'data' => array(
                    'path' => $in['path'],
                    'data' => $in['data'],
                    'calling_plugin' => $in['from_plugin']
                ),
                'data_back' => array(
                    'step' => 'step_end',
                    'path' => $in['path']
                )
            ));
        }

        if ($in['step'] === 'step_end') {
            $a=1;
        }

        leave:
        $response = array(
            'answer' => $in['response']['answer'],
            'message' => $in['response']['message'],
            'function' => 'write',
            'path' => $in['path'],
            'data' => $in['data'],
            'post_exist' => $in['response']['post_exist']
        );
        return $response;
    }

    /**
     * General function for reading data from a path
     * @version 2018-03-14
     * @since   2018-03-14
     * @author  Peter Lembke
     * @param array $in
     * @return array
     */
    final protected function read_many(array $in = array()): array
    {
        $default = array(
            'from_plugin' => array('node' => '', 'plugin' => ''),
            'step' => 'step_read',
            'paths' => array(),
            'response' => array(
                'answer' => 'false',
                'message' => 'There was an error',
                'path' => '',
                'data' => array(),
                'post_exist' => 'false'
            ),
            'data_back' => array(
                'items' => array()
            )
        );
        $in = $this->_Default($default, $in);
        
        if ($in['from_plugin']['node'] !== 'server') {
            $in['response']['message'] = 'I only accept messages that origin from this server node';
            goto leave;
        }

        if ($in['step'] === 'step_read_response') 
        {
            $path = $in['response']['path'];
            $in['data_back']['items'][$path] = $in['response']['data'];
            $in['step'] = 'step_read';
        }

        if ($in['step'] === 'step_read')
        {
            if (count($in['paths']) > 0)
            {
                $pop = $this->_Pop($in['paths']);
                $pop['key'] = $this->_TrimPath($pop['key']);
                
                return $this->_SubCall(array(
                    'to' => array(
                        'node' => 'server', 
                        'plugin' => 'infohub_storage', 
                        'function' => 'read'
                        ),
                    'data' => array(
                        'path' => $pop['key'],
                        'calling_plugin' => $in['from_plugin']
                    ),
                    'data_back' => array(
                        'paths' => $pop['object'], 
                        'items' => $in['data_back']['items'], 
                        'step' => 'step_read_response'
                    )
                ));
            }
        }

        leave:
        return array(
            'answer' => $in['response']['answer'],
            'message' => $in['response']['message'],
            'items' => $in['data_back']['items'],
        );
    }

    /**
     * General function for writing to a path
     * @version 2018-03-14
     * @since   2018-03-14
     * @author  Peter Lembke
     * @param array $in
     * @return array
     */
    final protected function write_many(array $in = array()): array
    {
        $default = array(
            'from_plugin' => array('node' => '', 'plugin' => ''),
            'step' => 'step_read',
            'paths' => array(),
            'response' => array(
                'answer' => 'false',
                'message' => 'There was an error',
                'path' => '',
                'data' => array(),
                'post_exist' => 'false',
            ),
            'data_back' => array(
                'items' => array()
            )
        );
        $in = $this->_Default($default, $in);

        if ($in['from_plugin']['node'] !== 'server') {
            $in['response']['message'] = 'I only accept messages that origin from this server node';
            goto leave;
        }

        if ($in['step'] === 'step_write_response')
        {
            $path = $in['response']['path'];
            $in['data_back']['items'][$path] = $in['response']['data'];
            $in['step'] = 'step_write';
        }

        if ($in['step'] === 'step_write')
        {
            if (count($in['paths']) > 0)
            {
                $pop = $this->_Pop($in['paths']);
                $pop['key'] = $this->_TrimPath($pop['key']);
                
                return $this->_SubCall(array(
                    'to' => array(
                        'node' => 'server', 
                        'plugin' => 'infohub_storage', 
                        'function' => 'write'
                    ),
                    'data' => array(
                        'path' => $pop['key'], 
                        'data' => $pop['data'],
                        'calling_plugin' => $in['from_plugin']
                    ),
                    'data_back' => array(
                        'paths' => $pop['object'], 
                        'items' => $in['data_back']['items'], 
                        'step' => 'step_read_response'
                    )
                ));
            }
        }

        leave:
        return array(
            'answer' => $in['response']['answer'],
            'message' => $in['response']['message'],
            'items' => $in['data_back']['items'],
        );
    }

}
