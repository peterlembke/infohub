<?php
declare(strict_types=1);
if (basename(__FILE__) == basename($_SERVER["SCRIPT_FILENAME"])) {
    exit; // This file must be included, not called directly
}

/**
 * infohub_demo show what the core can do
 * @category InfoHub
 * @package demo
 * @copyright Copyright (c) 2014, Peter Lembke, CharZam soft
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
class infohub_demo extends infohub_base
{
    protected final function _Version(): array
    {
        return array(
            'date' => '2016-04-17',
            'version' => '1.7.5',
            'class_name' => 'infohub_demo',
            'checksum' => '{{checksum}}',
            'note' => 'Collection of demos to demonstrate InfoHub Server',
            'status' => 'normal',
            'license_name' => 'GNU GPL 3 or later'
        );
    }

    protected function _GetCmdFunctions(): array
    {
        return array(
            'demo1' => 'normal',
            'demo2' => 'normal',
            'demo3' => 'normal',
            'demo4' => 'normal',
            'demo5' => 'normal',
            'demo6' => 'normal',
            'demo_storage' => 'normal',
            'demo_file' => 'normal',
            'demo_test' => 'normal'
        );
    }

    // Documentation: http://127.0.0.1/infohub/doc/plugin/name/infohub_demo

    /**
     * Demo 1 - Return a Camel Case String
     * http://127.0.0.1/infohub/demo/1
     * @version 2016-02-12
     * @since   2016-01-30
     * @author  Peter Lembke
     * @param array $in
     * @return array
     */
    final protected function demo1(array $in = array()): array
    {
        $default = array('my_variable' => '');
        $in = $this->_Default($default, $in);

        $data = ucwords($in['my_variable']);

        return array(
            'answer' => 'true',
            'message' => 'Finished doing camel case',
            'data' => $data
        );
    }

    /**
     * Demo 2 - Return an UPPER CASE STRING
     * @version 2016-01-30
     * @since   2016-01-30
     * @author  Peter Lembke
     * @param array $in
     * @return array
     */
    final protected function demo2(array $in = array()): array
    {
        $default = array('my_variable' => '');
        $in = $this->_Default($default, $in);

        $data = strtoupper($in['my_variable']);

        return array(
            'answer' => 'true',
            'message' => 'Finished doing UPPER case',
            'data' => $data
        );
    }

    /**
     * Demo 3 - Calling functions
     * Gets version data from plugin "infohub_transfer",
     * Calls internal function "GetOneString" to get a version string,
     * Calls cmd function "demo2" to get the string in upper case.
     * @version 2016-01-30
     * @since   2016-01-30
     * @author  Peter Lembke
     * @param array $in
     * @return array
     */
    final protected function demo3(array $in = array()): array
    {
        $default = array(
            'my_variable' => '',
            'plugin' => array(),
            'base' => array(),
            'server_info' => array(),
            'version_code' => '',
            'data' => '',
            'step' => 'start'
        );
        $in = $this->_Default($default, $in);

        $data = '';

        if ($in['step'] === 'start') {
            return $this->_SubCall(array(
                'to' => array('node' => 'server', 'plugin' => 'infohub_transfer', 'function' => 'version'),
                'data' => array(),
                'data_back' => array(
                    'step' => 'version_back',
                    'my_variable' => $in['my_variable']
                ),
            ));
        }

        if ($in['step'] === 'version_back') {
            $response = $this->internal_Cmd(array(
                'func' => 'GetOneString',
                'plugin' => $in['plugin']
            ));
            $data = $in['my_variable'] . ': ' . $response['data'];

            return $this->_SubCall(array(
                'to' => array('node' => 'server', 'plugin' => 'infohub_demo', 'function' => 'demo2'),
                'data' => array('my_variable' => $data),
                'data_back' => array('step' => 'upper_back'),
            ));
        }

        if ($in['step'] === 'upper_back') {
            $data = $in['data'];
        }

        return array(
            'answer' => 'true',
            'message' => 'Finished doing a plugin version string in UPPER CASE',
            'data' => $data
        );
    }

    /**
     * Converts the plugin version data into a specially formatted string
     * @param array $in
     * @return array
     */
    final protected function internal_GetOneString(array $in = array()): array
    {
        $default = array(
            'plugin' => array(
                'date' => '',
                'version' => '',
                'class_name' => ''
            )
        );
        $in = $this->_Default($default, $in);

        $response = array();
        foreach ($in['plugin'] as $name => $data) {
            $response[] = $this->_Reverse($data);
        }
        $data = implode(' {abc} ', $response);

        return array(
            'answer' => 'true',
            'message' => 'Here are the plugin string',
            'data' => $data
        );
    }

    /**
     * Trims the string and reverses the characters
     * @param $row
     * @return string
     */
    final protected function _Reverse($row): string
    {
        $row = trim($row);
        $row = strrev($row);
        return $row;
    }

    /**
     * Demo 4 - Get version data from several plugins
     * @version 2016-04-06
     * @since   2016-04-06
     * @author  Peter Lembke
     * @param array $in
     * @return array
     */
    final protected function demo4(array $in = array()): array
    {
        $default = array(
            'plugin' => array(
                'date' => '',
                'version' => '',
                'class_name' => ''
            ),
            'plugin_name' => '',
            'all_data' => array()
        );
        $in = $this->_Default($default, $in);

        if (empty($in['plugin']['class_name']) === false) {
            $in['all_data'][$in['plugin_name']] = $in['plugin'];
        }

        $nextPlugin = $this->_GetNextPlugin($in['plugin_name']);
        if ($nextPlugin !== '') {
            return $this->_SubCall(array(
                'to' => array('node' => 'server', 'plugin' => $nextPlugin, 'function' => 'version'),
                'data_back' => array(
                    'all_data' => $in['all_data'],
                    'plugin_name' => $nextPlugin
                ),
            ));
        }

        return array(
            'answer' => 'true',
            'message' => 'Finished getting all version data from selected plugins',
            'data' => $in['all_data']
        );
    }

    /**
     * @param $pluginName
     * @return string
     */
    final protected function _GetNextPlugin($pluginName): string
    {
        if ($pluginName === '') {
            return 'infohub_exchange';
        }
        $plugins = array(
            'infohub_exchange' => 'infohub_transfer',
            'infohub_transfer' => 'infohub_doc',
            'infohub_doc' => ''
        );
        if (isset($plugins[$pluginName])) {
            return $plugins[$pluginName];
        }
        return '';
    }

    /**
     * Demo 5 - Call a child plugin
     * @version 2016-04-06
     * @since   2016-04-06
     * @author  Peter Lembke
     * @param array $in
     * @return array
     */
    final protected function demo5(array $in = array()): array
    {
        $default = array(
            'step' => 'start_step',
            'url_my_name' => '',
            'data' => ''
        );
        $in = $this->_Default($default, $in);

        if ($in['step'] === 'start_step') {
            return $this->_SubCall(array(
                'to' => array('node' => 'server', 'plugin' => 'infohub_demo_child', 'function' => 'hello_you'),
                'data' => array('my_name' => $in['url_my_name']),
                'data_back' => array('step' => 'response_step'),
            ));
        }

        if ($in['step'] === 'response_step') {
        }

        return array(
            'answer' => 'true',
            'message' => 'Finished calling a child function',
            'data' => $in['data']
        );
    }

    /**
     * Demo 6 - How to use child plugins
     * http://127.0.0.1/infohub/demo/6/type/luhn/value/123
     * http://127.0.0.1/infohub/demo/6/type/md5/value/123
     * http://127.0.0.1/infohub/demo/6/type/personnummer/value/640823323
     * @version 2016-04-16
     * @since   2016-04-16
     * @author  Peter Lembke
     * @param array $in
     * @return array
     */
    final protected function demo6(array $in = array()): array
    {
        $default = array(
            'step' => 'start_step',
            'url_type' => 'md5',
            'url_value' => '123',
            'answer' => 'false',
            'message' => 'Nothing to report',
            'value' => '',
            'checksum' => '',
            'verified' => 'false'
        );
        $in = $this->_Default($default, $in);

        if ($in['step'] === 'start_step') {
            return $this->_SubCall(array(
                'to' => array('node' => 'server', 'plugin' => 'infohub_checksum', 'function' => 'calculate_checksum'),
                'data' => array('type' => $in['url_type'], 'value' => $in['url_value']),
                'data_back' => array('step' => 'response_step'),
            ));
        }

        if ($in['step'] === 'response_step') {
        }

        return array(
            'answer' => 'true',
            'message' => 'Finished calling checksum',
            'value' => $in['value'],
            'checksum' => $in['checksum'],
            'verified' => $in['verified']
        );
    }

    /**
     * Demo storage - How to use child plugins
     * http://127.0.0.1/infohub/demo/storage
     * @version 2016-06-15
     * @since   2016-06-15
     * @author  Peter Lembke
     * @param array $in
     * @return array
     */
    final protected function demo_storage(array $in = array()): array
    {
        $default = array(
            'step' => 'step_parent_call_child',
            'child_step' => '',
            'url_function' => 'html', // read, write, html, setup
            'url_path' => '',
            'url_post_alias' => 'a', // a-g
            'response' => array(
                'answer' => 'false',
                'message' => 'An error occurred',
                'data' => array()
            )
        );
        $in = $this->_Default($default, $in);

        $in['url_path'] = str_replace('.', '/', $in['url_path']);

        if ($in['step'] === 'step_parent_call_child')
        {
            return $this->_SubCall(array(
                'to' => array(
                    'node' => 'server',
                    'plugin' => 'infohub_demo_storage',
                    'function' => $in['url_function']
                ),
                'data' => array(
                    'path' => $in['url_path'],
                    'post_alias' => $in['url_post_alias'],
                    'connections' => array(),
                    'step' => $in
                ),
                'data_back' => array(
                    'step' => 'step_parent_call_storage',
                    'url_function' => $in['url_function'],
                    'url_path' => $in['url_path'],
                    'url_post_alias' => $in['url_post_alias']
                )
            ));
        }

        if ($in['step'] === 'step_parent_call_storage') {
            return $this->_SubCall($in['response']['data']);
        }

        if ($in['step'] === 'step_parent_end') {
            $a=1;
        }

        return array(
            'answer' => $in['answer'],
            'message' => $in['message'],
            'function' => $in['function'],
            'path' => $in['path'],
            'data' => $in['data']
        );
    }

    /**
     * Ask Infohub_StorageManager to import some files into the database
     * http://127.0.0.1/infohub/demo/file
     * @version 2016-11-27
     * @since   2016-11-27
     * @author  Peter Lembke
     * @param array $in
     * @return array
     */
    final protected function demo_file(array $in = array()): array
    {
        $default = array(
            'step' => 'start_step',
            'answer' => 'false',
            'message' => 'An error occurred'
        );
        $in = $this->_Default($default, $in);

        if ($in['step'] === 'start_step') {
            return $this->_SubCall(array(
                'to' => array(
                    'node' => 'server',
                    'plugin' => 'infohub_storagemanager',
                    'function' => 'files_read'
                ),
                'data' => array(),
                'data_back' => array(
                    'step' => 'response_step'
                )
            ));
        }

        if ($in['step'] === 'response_step') {
            $a=1;
        }

        return array(
            'answer' => $in['answer'],
            'message' => $in['message']
        );
    }

    /**
     * Demo Test - Test any function
     * http://127.0.0.1/infohub/demo/test/plugin/infohub_transfer/function/version
     * @version 2016-04-17
     * @since   2016-04-17
     * @author  Peter Lembke
     * @param array $in
     * @return array
     */
    final protected function demo_test(array $in = array()): array
    {
        $default = array(
            'step' => 'start_step',
            'url_plugin' => '',
            'url_function' => ''
        );
        $in = array_merge($default, $in);

        if ($in['step'] === 'start_step') {
            return $this->_SubCall(array(
                'to' => array('node' => 'server', 'plugin' => $in['url_plugin'], 'function' => $in['url_function']),
                'data' => $in,
                'data_back' => array('step' => 'response_step'),
            ));
        }

        if ($in['step'] === 'response_step') {
        }

        return $in;
    }
}
