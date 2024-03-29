<?php
/**
 * Collection of demos to demonstrate InfoHub Server
 *
 * @package     Infohub
 * @subpackage  infohub_demo
 */

declare(strict_types=1);
if (basename(__FILE__) == basename($_SERVER["SCRIPT_FILENAME"])) {
    exit; // This file must be included, not called directly
}

/**
 * Collection of demos to demonstrate InfoHub Server
 *
 * @author      Peter Lembke <info@infohub.se>
 * @version     2016-04-17
 * @since       2016-04-17
 * @copyright   Copyright (c) 2016, Peter Lembke
 * @license     https://opensource.org/licenses/gpl-license.php GPL-3.0-or-later
 * @see         https://github.com/peterlembke/infohub/blob/master/folder/plugins/infohub/checksum/infohub_checksum.md Documentation
 * @link        https://infohub.se/ InfoHub main page
 */
class infohub_demo extends infohub_base
{
    /**
     * Version information for this plugin
     *
     * @return string[]
     * @since   2016-04-17
     * @author  Peter Lembke
     * @version 2016-04-17
     */
    protected function _Version(): array
    {
        return [
            'date' => '2016-04-17',
            'since' => '2016-04-17',
            'version' => '1.7.5',
            'class_name' => 'infohub_demo',
            'checksum' => '{{checksum}}',
            'note' => 'Collection of demos to demonstrate InfoHub Server',
            'status' => 'normal',
            'SPDX-License-Identifier' => 'GPL-3.0-or-later',
            'user_role' => 'user'
        ];
    }

    /**
     * Public functions in this plugin
     *
     * @return array
     * @author  Peter Lembke
     * @version 2016-04-17
     * @since   2016-04-17
     */
    protected function _GetCmdFunctions(): array
    {
        $list = [
            'storage' => 'normal',
            'demo1' => 'normal',
            'demo2' => 'normal',
            'demo3' => 'normal',
            'demo4' => 'normal',
            'demo5' => 'normal',
            'demo6' => 'normal',
            'demo_storage' => 'normal',
            'demo_file' => 'normal',
            'demo_test' => 'normal'
        ];

        return parent::_GetCmdFunctionsBase($list);
    }

    /**
     * Calls the child plugin: Storage
     *
     * @param array $in
     * @return array
     * @author  Peter Lembke
     * @version 2016-02-12
     * @since   2016-01-30
     */
    protected function storage(array $in = []): array
    {
        $default = [
            'path' => '', // path to read/write
            'paths' => [], // paths to read_many/write_many
            'data' => [], // Data to write to the storage
            'mode' => '', // overwrite, merge
            'wanted_data' => [],
            'command' => '', // See below
            'response' => [],
            'step' => 'step_call_child'
        ];
        $in = $this->_Default($default, $in);

        $out = [
            'answer' => 'false',
            'message' => 'Could not call child plugin',
            'items' => [],
            'path' => $in['path'],
            'data' => [],
            'mode' => $in['mode'],
            'wanted_data' => $in['wanted_data'],
            'post_exist' => 'false'
        ];

        if ($in['step'] === 'step_call_child') {
            $validCommands = ['read', 'read_many', 'write', 'write_many', 'read_pattern', 'write_pattern'];

            if (in_array($in['command'], $validCommands) === true) {
                return $this->_Subcall(
                    [
                        'to' => [
                            'node' => 'server',
                            'plugin' => 'infohub_demo_storage',
                            'function' => $in['command']
                        ],
                        'data' => [
                            'path' => $in['path'],
                            'paths' => $in['paths'],
                            'data' => $in['data'],
                            'mode' => $in['mode'],
                            'wanted_data' => $in['wanted_data'],
                        ],
                        'data_back' => [
                            'step' => 'step_call_child_response'
                        ]
                    ]
                );
            }
        }

        if ($in['step'] === 'step_call_child_response') {
            $out = $this->_Merge($out, $in['response']);
        }

        return $out;
    }

    // Documentation: http://127.0.0.1/infohub/doc/plugin/name/infohub_demo

    /**
     * Demo 1 - Return a Camel Case String
     *
     * @param array $in
     * @return array
     * @author  Peter Lembke
     * @see http://127.0.0.1/infohub/demo/1 Demo 1
     * @version 2016-02-12
     * @since   2016-01-30
     */
    protected function demo1(array $in = []): array
    {
        $default = ['my_variable' => ''];
        $in = $this->_Default($default, $in);

        $data = ucwords($in['my_variable']);

        return [
            'answer' => 'true',
            'message' => 'Finished doing camel case',
            'data' => $data
        ];
    }

    /**
     * Demo 2 - Return an UPPER CASE STRING
     *
     * @param array $in
     * @return array
     * @author  Peter Lembke
     * @version 2016-01-30
     * @since   2016-01-30
     */
    protected function demo2(array $in = []): array
    {
        $default = ['my_variable' => ''];
        $in = $this->_Default($default, $in);

        $data = strtoupper($in['my_variable']);

        return [
            'answer' => 'true',
            'message' => 'Finished doing UPPER case',
            'data' => $data
        ];
    }

    /**
     * Demo 3 - Calling functions
     *
     * Gets version data from plugin "infohub_transfer",
     * Calls internal function "GetOneString" to get a version string,
     * Calls cmd function "demo2" to get the string in upper case.
     *
     * @param array $in
     * @return array
     * @author  Peter Lembke
     * @version 2016-01-30
     * @since   2016-01-30
     */
    protected function demo3(array $in = []): array
    {
        $default = [
            'my_variable' => '',
            'plugin' => [],
            'base' => [],
            'server_info' => [],
            'version_code' => '',
            'data' => '',
            'step' => 'start'
        ];
        $in = $this->_Default($default, $in);

        $data = '';

        if ($in['step'] === 'start') {
            return $this->_SubCall(
                [
                    'to' => [
                        'node' => 'server',
                        'plugin' => 'infohub_transfer',
                        'function' => 'version'
                    ],
                    'data' => [],
                    'data_back' => [
                        'step' => 'version_back',
                        'my_variable' => $in['my_variable']
                    ],
                ]
            );
        }

        if ($in['step'] === 'version_back') {
            $response = $this->internal_Cmd(
                [
                    'func' => 'GetOneString',
                    'plugin' => $in['plugin']
                ]
            );
            $data = $in['my_variable'] . ': ' . $response['data'];

            return $this->_SubCall(
                [
                    'to' => [
                        'node' => 'server',
                        'plugin' => 'infohub_demo',
                        'function' => 'demo2'
                    ],
                    'data' => [
                        'my_variable' => $data
                    ],
                    'data_back' => [
                        'step' => 'upper_back'
                    ],
                ]
            );
        }

        if ($in['step'] === 'upper_back') {
            $data = $in['data'];
        }

        return [
            'answer' => 'true',
            'message' => 'Finished doing a plugin version string in UPPER CASE',
            'data' => $data
        ];
    }

    /**
     * Converts the plugin version data into a specially formatted string
     *
     * @param array $in
     * @return array
     */
    protected function internal_GetOneString(array $in = []): array
    {
        $default = [
            'plugin' => [
                'date' => '',
                'version' => '',
                'class_name' => ''
            ]
        ];
        $in = $this->_Default($default, $in);

        $response = [];
        foreach ($in['plugin'] as $name => $data) {
            $response[] = $this->_Reverse($data);
        }
        $data = implode(' {abc} ', $response);

        return [
            'answer' => 'true',
            'message' => 'Here are the plugin string',
            'data' => $data
        ];
    }

    /**
     * Trims the string and reverses the characters
     *
     * @param  string  $row
     * @return string
     */
    protected function _Reverse(
        string $row = ''
    ): string
    {
        $row = trim($row);
        $row = strrev($row);

        return $row;
    }

    /**
     * Demo 4 - Get version data from several plugins
     *
     * @param array $in
     * @return array
     * @author  Peter Lembke
     * @version 2016-04-06
     * @since   2016-04-06
     */
    protected function demo4(array $in = []): array
    {
        $default = [
            'plugin' => [
                'date' => '',
                'version' => '',
                'class_name' => ''
            ],
            'plugin_name' => '',
            'all_data' => []
        ];
        $in = $this->_Default($default, $in);

        if (empty($in['plugin']['class_name']) === false) {
            $in['all_data'][$in['plugin_name']] = $in['plugin'];
        }

        $nextPlugin = $this->_GetNextPlugin($in['plugin_name']);
        if ($nextPlugin !== '') {
            return $this->_SubCall(
                [
                    'to' => [
                        'node' => 'server',
                        'plugin' => $nextPlugin,
                        'function' => 'version'
                    ],
                    'data_back' => [
                        'all_data' => $in['all_data'],
                        'plugin_name' => $nextPlugin
                    ],
                ]
            );
        }

        return [
            'answer' => 'true',
            'message' => 'Finished getting all version data from selected plugins',
            'data' => $in['all_data']
        ];
    }

    /**
     * Iterate over a list with plugin names
     *
     * @param string $pluginName
     * @return string
     * @author  Peter Lembke
     * @version 2016-04-06
     * @since   2016-04-06
     */
    protected function _GetNextPlugin(string $pluginName = ''): string
    {
        if ($pluginName === '') {
            return 'infohub_exchange';
        }
        $plugins = [
            'infohub_exchange' => 'infohub_transfer',
            'infohub_transfer' => 'infohub_doc',
            'infohub_doc' => ''
        ];
        if (isset($plugins[$pluginName])) {
            return $plugins[$pluginName];
        }

        return '';
    }

    /**
     * Demo 5 - Call a child plugin
     *
     * @param array $in
     * @return array
     * @author  Peter Lembke
     * @version 2016-04-06
     * @since   2016-04-06
     */
    protected function demo5(array $in = []): array
    {
        $default = [
            'step' => 'start_step',
            'url_my_name' => '',
            'data' => ''
        ];
        $in = $this->_Default($default, $in);

        if ($in['step'] === 'start_step') {
            return $this->_SubCall(
                [
                    'to' => [
                        'node' => 'server',
                        'plugin' => 'infohub_demo_child',
                        'function' => 'hello_you'
                    ],
                    'data' => [
                        'my_name' => $in['url_my_name']
                    ],
                    'data_back' => [
                        'step' => 'response_step'
                    ],
                ]
            );
        }

        return [
            'answer' => 'true',
            'message' => 'Finished calling a child function',
            'data' => $in['data']
        ];
    }

    /**
     * Demo 6 - How to use child plugins
     *
     * @param array $in
     * @return array
     * @author  Peter Lembke
     * @see http://127.0.0.1/infohub/demo/6/type/luhn/value/123 Luhn
     * @see http://127.0.0.1/infohub/demo/6/type/md5/value/123 MD5
     * @see http://127.0.0.1/infohub/demo/6/type/personnummer/value/640823323 Personnummer
     * @version 2016-04-16
     * @since   2016-04-16
     */
    protected function demo6(array $in = []): array
    {
        $default = [
            'step' => 'start_step',
            'url_type' => 'md5',
            'url_value' => '123',
            'answer' => 'false',
            'message' => 'Nothing to report',
            'value' => '',
            'checksum' => '',
            'verified' => 'false'
        ];
        $in = $this->_Default($default, $in);

        if ($in['step'] === 'start_step') {
            return $this->_SubCall(
                [
                    'to' => [
                        'node' => 'server',
                        'plugin' => 'infohub_checksum',
                        'function' => 'calculate_checksum'
                    ],
                    'data' => [
                        'type' => $in['url_type'],
                        'value' => $in['url_value']
                    ],
                    'data_back' => [
                        'step' => 'response_step'
                    ],
                ]
            );
        }

        return [
            'answer' => 'true',
            'message' => 'Finished calling checksum',
            'value' => $in['value'],
            'checksum' => $in['checksum'],
            'verified' => $in['verified']
        ];
    }

    /**
     * Demo storage - How to use child plugins
     *
     * @param array $in
     * @return array
     * @author  Peter Lembke
     * @see http://127.0.0.1/infohub/demo/storage Storage
     * @version 2016-06-15
     * @since   2016-06-15
     */
    protected function demo_storage(array $in = []): array
    {
        $default = [
            'step' => 'step_parent_call_child',
            'child_step' => '',
            'url_function' => 'html', // read, write, html, setup
            'url_path' => '',
            'url_post_alias' => 'a', // a-g
            'response' => [
                'answer' => 'false',
                'message' => 'An error occurred',
                'data' => []
            ]
        ];
        $in = $this->_Default($default, $in);

        $in['url_path'] = strtr($in['url_path'], ['.' => '/']);

        if ($in['step'] === 'step_parent_call_child') {
            return $this->_SubCall(
                [
                    'to' => [
                        'node' => 'server',
                        'plugin' => 'infohub_demo_storage',
                        'function' => $in['url_function']
                    ],
                    'data' => [
                        'path' => $in['url_path'],
                        'post_alias' => $in['url_post_alias'],
                        'connections' => [],
                        'step' => $in
                    ],
                    'data_back' => [
                        'step' => 'step_parent_call_storage',
                        'url_function' => $in['url_function'],
                        'url_path' => $in['url_path'],
                        'url_post_alias' => $in['url_post_alias']
                    ]
                ]
            );
        }

        if ($in['step'] === 'step_parent_call_storage') {
            return $this->_SubCall($in['response']['data']);
        }

        if ($in['step'] === 'step_parent_end') {
            $a = 1;
        }

        return [
            'answer' => $in['answer'],
            'message' => $in['message'],
            'function' => $in['function'],
            'path' => $in['path'],
            'data' => $in['data']
        ];
    }

    /**
     * Ask Infohub_StorageManager to import some files into the database
     *
     * @param array $in
     * @return array
     * @author  Peter Lembke
     * @see http://127.0.0.1/infohub/demo/file File
     * @version 2016-11-27
     * @since   2016-11-27
     */
    protected function demo_file(array $in = []): array
    {
        $default = [
            'step' => 'start_step',
            'answer' => 'false',
            'message' => 'An error occurred'
        ];
        $in = $this->_Default($default, $in);

        if ($in['step'] === 'start_step') {
            return $this->_SubCall(
                [
                    'to' => [
                        'node' => 'server',
                        'plugin' => 'infohub_storagemanager',
                        'function' => 'files_read'
                    ],
                    'data' => [],
                    'data_back' => [
                        'step' => 'response_step'
                    ]
                ]
            );
        }

        if ($in['step'] === 'response_step') {
            $a = 1;
        }

        return [
            'answer' => $in['answer'],
            'message' => $in['message']
        ];
    }

    /**
     * Demo Test - Test any function
     *
     * @param array $in
     * @return array
     * @author  Peter Lembke
     * @see http://127.0.0.1/infohub/demo/test/plugin/infohub_transfer/function/version Version
     * @version 2016-04-17
     * @since   2016-04-17
     */
    protected function demo_test(array $in = []): array
    {
        $default = [
            'step' => 'start_step',
            'url_plugin' => '',
            'url_function' => ''
        ];
        $in = array_merge($default, $in);

        if ($in['step'] === 'start_step') {
            return $this->_SubCall(
                [
                    'to' => [
                        'node' => 'server',
                        'plugin' => $in['url_plugin'],
                        'function' => $in['url_function']
                    ],
                    'data' => $in,
                    'data_back' => [
                        'step' => 'response_step'
                    ]
                ]
            );
        }

        if ($in['step'] === 'response_step') {
        }

        return $in;
    }
}
