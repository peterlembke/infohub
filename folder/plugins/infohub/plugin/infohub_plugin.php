<?php
declare(strict_types=1);
if (basename(__FILE__) == basename($_SERVER["SCRIPT_FILENAME"])) {
    exit; // This file must be included, not called directly
}

/*
    @license
		Copyright (C) 2010 Peter Lembke , CharZam soft
		the program is distributed under the terms of the GNU General Public License

		InfoHub is free software: you can redistribute it and/or modify
		it under the terms of the GNU General Public License as published by
		the Free Software Foundation, either version 3 of the License, or
		(at your option) any later version.

		InfoHub is distributed in the hope that it will be useful,
		but WITHOUT ANY WARRANTY; without even the implied warranty of
		MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
		GNU General Public License for more details.

		You should have received a copy of the GNU General Public License
		along with InfoHub.	If not, see <https://www.gnu.org/licenses/>.

    @category InfoHub
    @package Plugin
    @copyright Copyright (c) 2010-, Peter Lembke, CharZam soft
    @author Peter Lembke <peter.lembke@infohub.se>
    @link https://infohub.se/ InfoHub main page
*/
class infohub_plugin extends infohub_base
{

    Protected final function _Version(): array
    {
        return array(
            'date' => '2016-01-25',
            'version' => '1.0.0',
            'class_name' => 'infohub_plugin',
            'checksum' => '{{checksum}}',
            'note'=> 'Used by infohub_exchange to handle plugin request. Finds the plugin as file or in Storage. Starts PHP plugins. Delivers JS plugins',
            'status' => 'normal',
            'SPDX-License-Identifier' => 'GPL-3.0-or-later',
            'recommended_security_group' => 'core'
        );
    }

    protected function _GetCmdFunctions(): array
    {
        return array(
            'plugins_request' => 'normal',
            'plugin_request' => 'normal',
            'plugin_request_from_file' => 'normal',
            'plugin_request_from_storage' => 'normal',
            'plugin_start' => 'normal',
            'plugin_list' => 'normal',
            'get_all_plugin_names' => 'normal'
        );
    }

    // ***********************************************************
    // * your class functions below, only use protected functions
    // ***********************************************************

    /**
     * Request all missing_plugin_names
     * @param array $in
     * @return array
     */
    final protected function plugins_request(array $in = array()) {
        $default = array(
            'missing_plugin_names' => array(),
            'answer' => 'false',
            'message' => '',
            'step' => 'step_plugin_request',
            'plugins' => array(),
            'response' => array(
                'answer' => '',
                'message' => '',
                'plugin_node' => '',
                'plugin_name' => '',
                'plugin_from' => '',
                'plugin_path' => '',
                'plugin_code' => '',
                'plugin_code_size' => 0,
                'plugin_checksum' => '',
                'plugin_config' => array(),
                'plugin_started' => 'false'
            ),
            'data_back' => array(
                'plugin_node' => '',
                'plugin_name' => '',
            )
        );
        $in = $this->_Default($default, $in);

        if ($in['step'] === 'step_plugin_request_response') {

            if ($in['response']['answer'] === 'true')
            {
                $pluginName = $in['response']['plugin_name'];
                $in['plugins'][$pluginName] = array(
                    'plugin_node' => $in['response']['plugin_node'],
                    'plugin_name' => $in['response']['plugin_name'],
                    'plugin_from' => $in['response']['plugin_from'],
                    'plugin_path' => $in['response']['plugin_path'],
                    'plugin_code' => $in['response']['plugin_code'],
                    'plugin_code_size' => $in['response']['plugin_code_size'],
                    'plugin_checksum' => $in['response']['plugin_checksum'],
                    'plugin_config' => $in['response']['plugin_config']
                );
            }

            $in['step'] = 'step_plugin_request';
        }

        if ($in['step'] === 'step_plugin_request') {
            if (count($in['missing_plugin_names']) > 0)
            {
                $pluginName = (string) array_pop($in['missing_plugin_names']);

                return $this->_SubCall(array(
                    'to' => array(
                        'node' => 'server',
                        'plugin' => 'infohub_plugin',
                        'function' => 'plugin_request'
                    ),
                    'data' => array(
                        'plugin_node' => 'client',
                        'plugin_name' => $pluginName
                    ),
                    'data_back' => array(
                        'step' => 'step_plugin_request_response',
                        'plugins' => $in['plugins'],
                        'plugin_node' => 'client',
                        'plugin_name' => $pluginName,
                        'missing_plugin_names' => $in['missing_plugin_names']
                    ),
                ));
            }
        }

        return array(
            'answer' => $in['answer'],
            'message' => $in['message'],
            'plugins' => $in['plugins']
        );

    }

    /**
     * Request plugin from file, then from storage (database)
     * Client plugins - code are returned
     * Server plugins - are started, no code are returned
     * Used by: client infohub_exchange
     * @version 2016-01-30
     * @since 2013-11-22
     * @author Peter Lembke
     * @param array $in
     * @return array
     */
    final protected function plugin_request(array $in = array()): array
    {
        $default = array(
            'answer' => 'false',
            'message' => '',
            'step' => 'step_plugin_request_from_file',
            'plugin_node' => '', // Required. Example: client, server
            'plugin_name' => '', // Required. Example: infohub_demo
            'plugin_from' => '',
            'plugin_path' => '',
            'plugin_code' => '',
            'plugin_code_size' => 0,
            'plugin_checksum' => '',
            'plugin_config' => array(),
            'plugin_started' => 'false'
        );
        $in = $this->_Default($default, $in);

        $out = array(
            'answer' => 'false',
            'message' => 'Nothing to report from plugin_request',
            'plugin_node' => '', // Required. Example: client, server
            'plugin_name' => '', // Required. Example: infohub_demo
            'plugin_from' => '',
            'plugin_path' => '',
            'plugin_code' => '',
            'plugin_code_size' => 0,
            'plugin_checksum' => '',
            'plugin_config' => array(),
            'plugin_started' => 'false',
        );

        if ($in['step'] === 'step_plugin_request_from_file') {
            return $this->_SubCall(array(
                'to' => array(
                    'node' => 'server',
                    'plugin' => 'infohub_plugin',
                    'function' => 'plugin_request_from_file'
                ),
                'data' => array(
                    'plugin_node' => $in['plugin_node'],
                    'plugin_name' => $in['plugin_name']
                ),
                'data_back' => array(
                    'plugin_node' => $in['plugin_node'],
                    'plugin_name' => $in['plugin_name'],
                    'step' => 'step_plugin_request_from_file_response'
                ),
            ));
        }

        if ($in['step'] === 'step_plugin_request_from_file_response') {
            $in['step'] = 'step_plugin_request_from_storage';
            if ($in['answer'] === 'true') {
                $in['step'] = 'step_handle_plugin';
            }
        }

        if ($in['step'] === 'step_plugin_request_from_storage') {
            return $this->_SubCall(array(
                'to' => array(
                    'node' => 'server',
                    'plugin' => 'infohub_plugin',
                    'function' => 'plugin_request_from_storage'
                ),
                'data' => array(
                    'plugin_node' => $in['plugin_node'],
                    'plugin_name' => $in['plugin_name']
                ),
                'data_back' => array(
                    'plugin_node' => $in['plugin_node'],
                    'plugin_name' => $in['plugin_name'],
                    'step' => 'step_plugin_request_from_storage_response'
                ),
            ));
        }

        if ($in['step'] === 'step_plugin_request_from_storage_response') {
            $in['step'] = 'step_handle_plugin';
        }

        if ($in['step'] === 'step_handle_plugin') {

            if ($in['plugin_code'] !== '') {
                $ok = 'false';
                $requiredText = array(
                    "'SPDX-License-Identifier' => '",
                    "'SPDX-License-Identifier': '"
                );

                foreach ($requiredText as $licenseIdentifier) {
                    if (strpos($in['plugin_code'], $licenseIdentifier) > 0) {
                        $ok = 'true';
                        break;
                    }
                }

                if ($ok === 'false') {
                    $out['message'] = 'You must have an SPDX license identifier in your code. ' . $in['plugin_name']. ' do not have that';
                    goto leave;
                }
            }

            $in['plugin_code_size'] = strlen($in['plugin_code']);

            $in['step'] = 'step_send_plugin_to_node';
            if ($in['plugin_node'] === 'server') {
                $in['step'] = 'step_plugin_start';
            }
        }

        if ($in['step'] === 'step_plugin_start') {
            return $this->_SubCall(array(
                'to' => array(
                    'node' => 'server',
                    'plugin' => 'infohub_plugin',
                    'function' => 'plugin_start'
                ),
                'data' => array(
                    'plugin_node' => $in['plugin_node'],
                    'plugin_name' => $in['plugin_name'],
                    'plugin_code' => $in['plugin_code'],
                    'plugin_from' => $in['plugin_from'],
                    'plugin_path' => $in['plugin_path'],
                    'plugin_checksum' => $in['plugin_checksum'],
                    'plugin_config' => $in['plugin_config']
                ),
                'data_back' => array(
                    'plugin_node' => $in['plugin_node'],
                    'plugin_name' => $in['plugin_name'],
                    'step' => 'step_plugin_start_response'
                ),
            ));
        }

        if ($in['step'] === 'step_plugin_start_response') {
            return $this->_SubCall(array(
                'to' => array(
                    'node' => 'server',
                    'plugin' => 'infohub_exchange',
                    'function' => 'plugin_started'
                ),
                'data' => array(
                    'plugin_node' => $in['plugin_node'],
                    'plugin_name' => $in['plugin_name'],
                    'plugin_started' => $in['plugin_started']
                ),
                'data_back' => array(
                    'plugin_node' => $in['plugin_node'],
                    'plugin_name' => $in['plugin_name'],
                    'step' => 'step_plugin_started_response'
                ),
            ));
        }

        if ($in['step'] === 'step_plugin_started_response') {
            $out = $this->_Default($out, $in);
            goto leave;
        }

        if ($in['step'] === 'step_send_plugin_to_node') {
            $out = $this->_Default($out, $in);
        }

        leave:
        return $out;
    }

    /**}
     * Get the plugin code from file if exist
     * @version 2020-04-25
     * @since 2013-08-18
     * @author Peter Lembke
     * @param array $in
     * @return array
     * @uses string | plugin_node | Node name, alias for a node: server, client, myexternalnode
     * @uses string | plugin_name | Name of the plugin, example: mynamespacename_mypluginname
     */
    final protected function plugin_request_from_file(array $in = array()): array
    {
        $default = array(
            'plugin_node' => 'server',
            'plugin_name' => 'infohub_login',
            'from_plugin' => array(
                'node' => '',
                'plugin' => '',
                'function' => ''
            )
        );
        $in = $this->_Default($default, $in);

        $out = array(
            'answer' => 'false',
            'message' => '',
            'plugin_node' => $in['plugin_node'],
            'plugin_name' => $in['plugin_name'],
            'plugin_path' => '',
            'plugin_from' => '',
            'plugin_code' => '',
            'plugin_checksum' => '',
            'plugin_config' => array()
        );

        if ($in['from_plugin']['node'] !== 'server') {
            $out['message'] = 'Only node: server can call this function';
            goto leave;
        }

        if ($in['from_plugin']['plugin'] !== 'infohub_plugin') {
            $out['message'] = 'Only plugin: infohub_plugin can call this function';
            goto leave;
        }

        $response = $this->internal_Cmd(array(
            'func' => 'GetPluginPath',
            'plugin_name' => $in['plugin_name'],
            'plugin_node' => $in['plugin_node']
        ));
        $out['plugin_path'] = $response['plugin_path'];

        if (file_exists($out['plugin_path']) === false) {
            $out['message'] = 'Plugin file do not exist';
            goto leave;
        }

        $pluginCode = file_get_contents($out['plugin_path']);
        if ($pluginCode == false) {
            $out['message'] = 'Plugin file exist but could not be read';
            goto leave;
        }

        $out['plugin_from'] = 'file';

        $response = $this->internal_Cmd(array(
            'func' => 'ModifyPluginCode',
            'plugin_node' => $in['plugin_node'],
            'plugin_code' => $pluginCode
        ));
        $out['plugin_code'] = $response['plugin_code'];
        $out['plugin_checksum'] = $response['plugin_checksum'];

        if (empty($out['plugin_code']) === false) {

            $configResponse = $this->internal_Cmd(array(
                'func' => 'GetConfigFromFile',
                'plugin_name' => $in['plugin_name'],
                'node' => $in['plugin_node']
            ));
            
            if ($configResponse['answer'] === 'true') {
                $out['plugin_config'] = $configResponse['config'];
            }

            $search = '{' . $in['plugin_name'] . '.css}';
            $found = strpos($out['plugin_code'], $search);
            if ($found !== false) {
                $replaceWith = '';
                $cssResponse = $this->internal_Cmd(array(
                    'func' => 'GetCssData',
                    'plugin_name' => $in['plugin_name']
                ));
            
                if ($cssResponse['answer'] === 'true') {
                    $replaceWith = $cssResponse['css_data'];
                }               
                
                $out['plugin_code'] = str_replace($search, $replaceWith, $out['plugin_code']);
            }

            $out['answer'] = 'true';
            $out['message'] = 'Got plugin code from file';
        }

        leave:
        return $out;
    }

    /**
     * Get the data from the config file
     * The use of configuration files is very mush discouraged. Always place all data in the database.
     * @version 2018-12-26
     * @since   2018-01-21
     * @author  Peter Lembke
     * @param array $in
     * @return array
     */
    final protected function internal_GetConfigFromFile(array $in = array()): array {
        
        $default = array(
            'plugin_name' => '',
            'node' => 'client'
        );
        $in = $this->_Default($default, $in);

        $answer = 'true';
        $foundConfig = 'false';
        $message = '';
        $config = array();
        
        if ($in['node'] !== 'client' && $in['node'] !== 'server') {
            $message = 'The node you want is not allowed in the config file';
            goto leave;
        }
        
        $pluginName = trim(strtolower($in['plugin_name']));

        $fileName = CONFIG . DS . $pluginName . '.json';
        if (file_exists($fileName) === false) {
            $fileName = PLUGINS . DS . str_replace('_', DS, $pluginName) . DS . $pluginName . '.json';
            if (file_exists($fileName) === false) {
                $message = 'File does not exist';
                goto leave;
            }
        }

        $data = file_get_contents($fileName);
        if (empty($data) === true) {
            $message = 'File exist but are empty';
            goto leave;
        }

        $data = json_decode($data, true);
        if (is_array($data) === false) {
            $message = 'File data could not be decoded';
            goto leave;
        }

        $default = array(
            'server' => array(),
            'client' => array()
        );
        $data = $this->_Default($default, $data);
        
        $node = $in['node'];
        $config = $data[$node];
        $answer = 'true';
        $message = 'Here are the config for your node';
        $foundConfig = 'true';

        leave:
        return array(
            'answer' => $answer,
            'message' => $message,
            'found_config' => $foundConfig,
            'config' => $config,
            'plugin_name' => $in['plugin_name'],
            'node' => $in['node'],
            'file_name' => $fileName
        );
    }

    /**
     * Get the data from the css file if it exist
     * The use of css files is discouraged
     * @version 2018-12-26
     * @since   2018-12-26
     * @author  Peter Lembke
     * @param array $in
     * @return array
     */
    final protected function internal_GetCssData(array $in = array()): array {
        
        $default = array(
            'plugin_name' => ''
        );
        $in = $this->_Default($default, $in);

        $data = '';
        $answer = 'false';
        $message = '';
        
        $pluginName = trim(strtolower($in['plugin_name']));
        $fileName = PLUGINS . DS . str_replace('_', DS, $pluginName) . DS . $pluginName . '.css';

        if (file_exists($fileName) === false) {
            $message = 'File does not exist';
            goto leave;
        }

        $data = file_get_contents($fileName);
        if (empty($data) === true) {
            $message = 'File exist but are empty';
            goto leave;
        }

        $data = base64_encode($data);
        $answer = 'true';
        $message = 'Here are the css data';

        leave:
        return array(
            'answer' => $answer,
            'message' => $message,
            'plugin_name' => $in['plugin_name'],
            'file_name' => $fileName,
            'css_data' => $data
        );
    }
    
    /**
     * @param string $pathFile
     * @param string $extension
     * @return string
     */
    final protected function _ChangeExtensionOnFileName(string $pathFile = '', string $extension = 'json'): string
    {
        $newPathFile = substr($pathFile, 0, strpos($pathFile, '.')) . '.' . $extension;
        return $newPathFile;
    }

    /**
     * Get the plugin code from Storage if Storage exist and the plugin exist in the Storage
     * @version 2020-04-25
     * @since 2013-08-18
     * @author Peter Lembke
     * @param array $in
     * @return array
     */
    final protected function plugin_request_from_storage(array $in = array()): array
    {
        $default = array(
            'plugin_node' => 'server',
            'plugin_name' => 'infohub_login',
            'step' => 'step_ask_storage',
            'plugin_from' => 'storage',
            'plugin_code' => '',
            'plugin_checksum' => '',
            'plugin_config' => array(),
            'from_plugin' => array(
                'node' => '',
                'plugin' => '',
                'function' => ''
            )
        );
        $in = $this->_Default($default, $in);

        $out = array_merge($in, array(
            'answer' => 'false',
            'message' => 'Did not find the plugin in Storage'
        ));

        if ($in['from_plugin']['node'] !== 'server') {
            $out['message'] = 'Only node: server can call this function';
            goto leave;
        }

        if ($in['from_plugin']['plugin'] !== 'infohub_plugin') {
            $out['message'] = 'Only plugin: infohub_plugin can call this function';
            goto leave;
        }

        if ($in['step'] === 'step_ask_storage') {
            $pluginNode = $in['plugin_node'];
            $pluginName = $in['plugin_name'];
            return $this->_SubCall(array(
                'to' => array(
                    'node' => 'server',
                    'plugin' => 'infohub_storage',
                    'function' => 'read'
                ),
                'data' => array(
                    'path' => "infohub_plugin/$pluginNode/$pluginName"
                ),
                'data_back' => array(
                    'step' => 'step_ask_storage_response'
                )
            ));
        }

        if ($in['step'] === 'step_ask_storage_response') {
            $response = $this->internal_Cmd(array(
                'func' => 'ModifyPluginCode',
                'plugin_node' => $in['plugin_node'],
                'plugin_code' => $in['plugin_code']
            ));
            $out['plugin_code'] = $response['plugin_code'];
            $out['plugin_checksum'] = $response['plugin_checksum'];
            if (empty($out['plugin_code']) === false) {
                $out['answer'] = 'true';
                $out['message'] = 'Got plugin code from Storage';
            }
        }

        leave:
        return $out;
    }

    /**
     * Start a server plugin
     * @version 2016-01-30
     * @since 2013-11-21
     * @author Peter Lembke
     * @param array $in
     * @return array
     * @uses
     */
    final protected function plugin_start(array $in = array())
    {
        $default = array(
            'plugin_node' => 'server',
            'plugin_name' => 'infohub_login',
            'plugin_from' => '',
            'plugin_path' => '',
            'plugin_code' => '',
            'step' => 'plugin_start',
            'from_plugin' => array(
                'node' => '',
                'plugin' => '',
                'function' => ''
            )
        );
        $in = $this->_Default($default, $in);

        $answer = 'false';
        $message = 'An error occurred';
        $pluginStarted = 'false';

        if ($in['from_plugin']['node'] !== 'server') {
            $message = 'Only node: server can call this function';
            goto leave;
        }

        if ($in['from_plugin']['plugin'] !== 'infohub_plugin') {
            $message = 'Only plugin: infohub_plugin can call this function';
            goto leave;
        }

        if ($in['plugin_node'] !== 'server') {
            $message = 'I can not start plugins for this node on the server';
            goto leave;
        }

        if ($in['plugin_code'] === '') {
            $message = 'The plugin code is empty';
            goto leave;
        }

        // If we run xdebug and develop plugins then we would prefer a file to be included instead of code being evaluated
        // If the code come from the Storage as data then we must evaluate it.
        if ($in['plugin_from'] === 'file') {
            include_once $in['plugin_path'];
        } else {
            try {
                eval($in['plugin_code']);
            } catch (Exception $err) {
                $message = 'Can not evaluate the plugin class:' . $in['plugin_name'] . ', error:"' . $err->getMessage() . '"';
                goto leave;
            }
        }

        if (class_exists($in['plugin_name'], false) === false) {
            $message = 'Could not start plugin:' . $in['plugin_name'];
            goto leave;
        }

        $answer = 'true';
        $message = 'Started plugin:' . $in['plugin_name'];
        $pluginStarted = 'true';

        leave:
        return array(
            'answer' => $answer,
            'message' => $message,
            'plugin_node' => $in['plugin_node'],
            'plugin_name' => $in['plugin_name'],
            'plugin_from' => $in['plugin_from'],
            'plugin_path' => $in['plugin_path'],
            'plugin_code' => $in['plugin_code'],
            'plugin_started' => $pluginStarted
        );

    }

    /**
     * Purpose is to keep the client plugin list accurate.
     * You give a list with plugin names and checksums
     * This function update all timestamp_added
     * All plugins that are valid will get the current timestamp
     * All plugins that are invalid will get current timestamp - 1 week.
     * and then send back the list to the client
     * @version 2017-02-28
     * @since 2017-02-25
     * @author Peter Lembke
     * @param array $in
     * @return array
     * @uses
     */
    final protected function plugin_list(array $in = array())
    {
        $default = array(
            'plugin_list' => array()
        );
        $in = $this->_Default($default, $in);

        $week = 7 * 24 * 60 * 60; // Seconds
        $valid = $this->_MicroTime(); // Current timestamp since EPOC
        $invalid = $valid - $week;

        foreach ($in['plugin_list'] as $pluginName => $data)
        {
            $response = $this->internal_Cmd(array(
                'func' => 'GetPluginPath',
                'plugin_name' => $pluginName,
                'plugin_node' => 'client'
            ));
            $pluginPath = $response['plugin_path'];

            if (file_exists($pluginPath) === true) {
                $checksum = $this->_Hash(trim(file_get_contents($pluginPath)));
                if ($checksum === $data['checksum']) {
                    // Plugins that still have the same checksum as locally will get their
                    // timestamp set to now so they last a bit longer in the local cache
                    $in['plugin_list'][$pluginName]['timestamp_added'] = $valid;
                    continue;
                }
            }

            // Plugins that do no longer exist or has a new checksum will be set as one week old in the local cache.
            $in['plugin_list'][$pluginName]['timestamp_added'] = $invalid;
        }

        leave:
        return array(
            'answer' => 'true',
            'message' => 'Here are the list of plugins that you should delete',
            'data' => $in['plugin_list']
        );

    }

    // *****************************************************************************
    // * Internal function that you only can reach from internal_Cmd
    // * Function name are in internal_CamelCase
    // * An internal function get all its data from the $in-array
    // * An internal function give its answer as an array, success or error
    // *****************************************************************************

    /**
     * Give a plugin name and a node, get the full path to the plugin file
     * @example "infohub_base" & "client" gives you "{web root}/infohub/folder/plugins/infohub/base/infohub_base.js"
     * @version 2016-01-30
     * @since 2016-01-25
     * @author Peter Lembke
     * @param array $in
     * @return array
     */
    protected final function internal_GetPluginPath(array $in = array()): array
    {
        $default = array(
            'plugin_name' => '',
            'plugin_node' => ''
        );
        $in = $this->_Default($default, $in);

        $folders = explode('_', $in['plugin_name']);
        $pluginPath = PLUGINS . DS . implode(DS, $folders);

        $extension = array(
            'server' => '.php',
            'client' => '.js'
        );

        $fileName = $in['plugin_name'] . $extension[ $in['plugin_node'] ];
        $fullPath = strtolower($pluginPath . DS . $fileName);

        return array(
            'answer' => 'true',
            'message' => 'Here are the full path to the plugin',
            'plugin_path' => $fullPath
        );
    }

    /**
     * Trim the plugin code and add checksum to the code
     * @version 2016-01-30
     * @since 2016-01-30
     * @author Peter Lembke
     * @param array $in
     * @return array
     */
    protected final function internal_ModifyPluginCode(array $in = array()): array
    {
        $default = array(
            'plugin_node' => '',
            'plugin_code' => ''
        );
        $in = $this->_Default($default, $in);

        $pluginCode = trim($in['plugin_code']);
        $pluginChecksum = $this->_Hash($pluginCode);
        $pluginCode = str_replace('{{checksum}}', $pluginChecksum, $pluginCode);

        if ($in['plugin_node'] === 'server') {
            if (strpos($pluginCode, '<?php') === 0) {
                $pluginCode = substr($pluginCode, 5);
            }
            if (strrpos($pluginCode, '?>') == (strlen($pluginCode) - 2)) {
                $pluginCode = substr($pluginCode, 0, -2);
            }
        }

        return array(
            'answer' => 'true',
            'message' => 'Here are the trimmed plugin code',
            'plugin_code' => $pluginCode,
            'plugin_checksum' => $pluginChecksum,
            'plugin_node' => $in['plugin_node']
        );
    }

    /**
     * Get a crc32 hash for the string you provide
     * @param string $dataString
     * @return string
     */
    final protected function _Hash(string $dataString = ''): string
    {
        return (string) crc32($dataString);
    }

    /**
     * Download all plugin names
     * Used by the client version of infohub_plugin when downloading all plugins
     * @version 2018-10-26
     * @since 2018-10-26
     * @author Peter Lembke
     * @param array $in
     * @return array
     */
    protected final function get_all_plugin_names(array $in = array()): array
    {
        $default = array(
            'step' => 'step_start',
            'answer' => '',
            'message' => '',
            'data' => array()
        );
        $in = $this->_Default($default, $in);

        if ($in['step'] === 'step_start') {
            return $this->_SubCall(array(
                'to' => array(
                    'node' => 'server',
                    'plugin' => 'infohub_file',
                    'function' => 'plugin_get_all_plugin_names'
                ),
                'data' => array(),
                'data_back' => array(
                    'step' => 'step_start_response'
                )
            ));
        }

        return array(
            'answer' => $in['answer'],
            'message' => $in['message'],
            'data' => $in['data']
        );
    }
}
