<?php
/**
 * Handle plugins
 *
 * Used by infohub_exchange to handle plugin request. Finds the plugin as file or in Storage. Starts PHP plugins. Delivers JS plugins
 *
 * @package     Infohub
 * @subpackage  infohub_plugin
 */

declare(strict_types=1);
if (basename(__FILE__) == basename($_SERVER["SCRIPT_FILENAME"])) {
    exit; // This file must be included, not called directly
}

/**
 * Handle plugins
 *
 * Used by infohub_exchange to handle plugin request. Finds the plugin as file or in Storage. Starts PHP plugins. Delivers JS plugins
 *
 * @author      Peter Lembke <info@infohub.se>
 * @version     2016-01-25
 * @since       2016-12-27
 * @copyright   Copyright (c) 2010, Peter Lembke
 * @license     https://opensource.org/licenses/gpl-license.php GPL-3.0-or-later
 * @see         https://github.com/peterlembke/infohub/blob/master/folder/plugins/infohub/plugin/infohub_plugin.md Documentation
 * @link        https://infohub.se/ InfoHub main page
 */
class infohub_plugin extends infohub_base
{
    /**
     * Version information for this plugin
     * @return  string[]
     * @since 2013-11-22
     * @author  Peter Lembke
     * @version 2016-01-25
     */
    protected function _Version(): array
    {
        return [
            'date' => '2016-01-25',
            'since' => '2013-11-22',
            'version' => '1.0.0',
            'class_name' => 'infohub_plugin',
            'checksum' => '{{checksum}}',
            'note' => 'Used by infohub_exchange to handle plugin request. Finds the plugin as file or in Storage. Starts PHP plugins. Delivers JS plugins',
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
     * @version 2016-01-25
     * @since   2013-11-22
     */
    protected function _GetCmdFunctions(): array
    {
        $list = [
            'plugins_request' => 'normal',
            'plugin_request' => 'normal',
            'plugin_request_from_file' => 'normal',
            'plugin_request_from_storage' => 'normal',
            'plugin_start' => 'normal',
            'plugin_list' => 'normal',
            'get_all_plugin_names' => 'normal'
        ];

        return parent::_GetCmdFunctionsBase($list);
    }

    // ***********************************************************
    // * your class functions below, only use protected functions
    // ***********************************************************

    /**
     * Request all missing_plugin_names
     * @param array $in
     * @return array
     */
    protected function plugins_request(array $in = [])
    {
        $default = [
            'missing_plugin_names' => [],
            'answer' => 'false',
            'message' => '',
            'step' => 'step_plugin_request',
            'plugins' => [],
            'response' => [
                'answer' => '',
                'message' => '',
                'plugin_node' => '',
                'plugin_name' => '',
                'plugin_from' => '',
                'plugin_path' => '',
                'plugin_code' => '',
                'plugin_code_size' => 0,
                'plugin_checksum' => '',
                'plugin_config' => [],
                'plugin_started' => 'false'
            ],
            'data_back' => [
                'plugin_node' => '',
                'plugin_name' => '',
            ]
        ];
        $in = $this->_Default($default, $in);

        if ($in['step'] === 'step_plugin_request_response') {
            if ($in['response']['answer'] === 'true') {
                $pluginName = $in['response']['plugin_name'];
                $in['plugins'][$pluginName] = [
                    'plugin_node' => $in['response']['plugin_node'],
                    'plugin_name' => $in['response']['plugin_name'],
                    'plugin_from' => $in['response']['plugin_from'],
                    'plugin_path' => $in['response']['plugin_path'],
                    'plugin_code' => $in['response']['plugin_code'],
                    'plugin_code_size' => $in['response']['plugin_code_size'],
                    'plugin_checksum' => $in['response']['plugin_checksum'],
                    'plugin_config' => $in['response']['plugin_config']
                ];
            }

            $in['step'] = 'step_plugin_request';
        }

        if ($in['step'] === 'step_plugin_request') {
            if (count($in['missing_plugin_names']) > 0) {
                $pluginName = (string)array_pop($in['missing_plugin_names']);

                return $this->_SubCall(
                    [
                        'to' => [
                            'node' => 'server',
                            'plugin' => 'infohub_plugin',
                            'function' => 'plugin_request'
                        ],
                        'data' => [
                            'plugin_node' => 'client',
                            'plugin_name' => $pluginName
                        ],
                        'data_back' => [
                            'step' => 'step_plugin_request_response',
                            'plugins' => $in['plugins'],
                            'plugin_node' => 'client',
                            'plugin_name' => $pluginName,
                            'missing_plugin_names' => $in['missing_plugin_names']
                        ],
                    ]
                );
            }
        }

        return [
            'answer' => $in['answer'],
            'message' => $in['message'],
            'plugins' => $in['plugins']
        ];
    }

    /**
     * Request plugin from file, then from storage (database)
     * Client plugins - code are returned
     * Server plugins - are started, no code are returned
     * Used by: client infohub_exchange
     * @param array $in
     * @return array
     * @author Peter Lembke
     * @version 2016-01-30
     * @since 2013-11-22
     */
    protected function plugin_request(array $in = []): array
    {
        $default = [
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
            'plugin_config' => [],
            'plugin_started' => 'false',
            'config' => [
                'minify_js' => 'false',
                'server_plugin_names' => [],
                'client_plugin_names' => []
            ]
        ];
        $in = $this->_Default($default, $in);

        $out = [
            'answer' => 'false',
            'message' => 'Nothing to report from plugin_request',
            'plugin_node' => '', // Required. Example: client, server
            'plugin_name' => '', // Required. Example: infohub_demo
            'plugin_from' => '',
            'plugin_path' => '',
            'plugin_code' => '',
            'plugin_code_size' => 0,
            'plugin_checksum' => '',
            'plugin_config' => [],
            'plugin_started' => 'false',
        ];

        if ($in['step'] === 'step_plugin_request_from_file') {
            return $this->_SubCall(
                [
                    'to' => [
                        'node' => 'server',
                        'plugin' => 'infohub_plugin',
                        'function' => 'plugin_request_from_file'
                    ],
                    'data' => [
                        'plugin_node' => $in['plugin_node'],
                        'plugin_name' => $in['plugin_name']
                    ],
                    'data_back' => [
                        'plugin_node' => $in['plugin_node'],
                        'plugin_name' => $in['plugin_name'],
                        'step' => 'step_plugin_request_from_file_response'
                    ],
                ]
            );
        }

        if ($in['step'] === 'step_plugin_request_from_file_response') {
            $in['step'] = 'step_plugin_request_from_storage';
            if ($in['answer'] === 'true') {
                $in['step'] = 'step_handle_plugin';
            }
        }

        if ($in['step'] === 'step_plugin_request_from_storage') {
            return $this->_SubCall(
                [
                    'to' => [
                        'node' => 'server',
                        'plugin' => 'infohub_plugin',
                        'function' => 'plugin_request_from_storage'
                    ],
                    'data' => [
                        'plugin_node' => $in['plugin_node'],
                        'plugin_name' => $in['plugin_name']
                    ],
                    'data_back' => [
                        'plugin_node' => $in['plugin_node'],
                        'plugin_name' => $in['plugin_name'],
                        'step' => 'step_plugin_request_from_storage_response'
                    ],
                ]
            );
        }

        if ($in['step'] === 'step_plugin_request_from_storage_response') {
            $in['step'] = 'step_handle_plugin';
        }

        if ($in['step'] === 'step_handle_plugin') {
            if ($in['plugin_code'] !== '') {
                $ok = 'false';
                $requiredText = [
                    "'SPDX-License-Identifier' => '",
                    "'SPDX-License-Identifier': '"
                ];

                foreach ($requiredText as $licenseIdentifier) {
                    if (strpos($in['plugin_code'], $licenseIdentifier) > 0) {
                        $ok = 'true';
                        break;
                    }
                }

                if ($ok === 'false') {
                    $out['message'] = 'You must have an SPDX license identifier in your code. ' . $in['plugin_name'] . ' do not have that';
                    goto leave;
                }
            }

            if ($in['plugin_node'] === 'client' && $in['config']['minify_js'] === 'true') {
                $in['plugin_code'] = $this->minifyJsCode($in['plugin_code']);
            }

            $in['plugin_code_size'] = strlen($in['plugin_code']);

            $in['step'] = 'step_send_plugin_to_node';
            if ($in['plugin_node'] === 'server') {
                $in['step'] = 'step_plugin_start';
            }
        }

        if ($in['step'] === 'step_plugin_start') {
            return $this->_SubCall(
                [
                    'to' => [
                        'node' => 'server',
                        'plugin' => 'infohub_plugin',
                        'function' => 'plugin_start'
                    ],
                    'data' => [
                        'plugin_node' => $in['plugin_node'],
                        'plugin_name' => $in['plugin_name'],
                        'plugin_code' => $in['plugin_code'],
                        'plugin_from' => $in['plugin_from'],
                        'plugin_path' => $in['plugin_path'],
                        'plugin_checksum' => $in['plugin_checksum'],
                        'plugin_config' => $in['plugin_config']
                    ],
                    'data_back' => [
                        'plugin_node' => $in['plugin_node'],
                        'plugin_name' => $in['plugin_name'],
                        'step' => 'step_plugin_start_response'
                    ],
                ]
            );
        }

        if ($in['step'] === 'step_plugin_start_response') {
            return $this->_SubCall(
                [
                    'to' => [
                        'node' => 'server',
                        'plugin' => 'infohub_exchange',
                        'function' => 'plugin_started'
                    ],
                    'data' => [
                        'plugin_node' => $in['plugin_node'],
                        'plugin_name' => $in['plugin_name'],
                        'plugin_started' => $in['plugin_started']
                    ],
                    'data_back' => [
                        'plugin_node' => $in['plugin_node'],
                        'plugin_name' => $in['plugin_name'],
                        'step' => 'step_plugin_started_response'
                    ],
                ]
            );
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

    /**
     * Remove all none essential data from a Javascript file to make it smaller
     * @param string $code
     * @return string
     */
    protected function minifyJsCode(string $code = ''): string
    {
        $okRow1 = '// include ';
        $okRow2 = '//# sourceURL=';
        $rowArray = explode("\r\n", $code);
        if (count($rowArray) <= 1) {
            $rowArray = explode("\n", $code);
        }

        $deleteMode = false;
        foreach ($rowArray as $rowNumber => $rowString) {
            $rowString = trim($rowString);

            if ($rowString === '') {
                unset($rowArray[$rowNumber]);
                continue;
            }

            $rowArray[$rowNumber] = $rowString;
            $part = substr($rowString, 0, 2);

            if ($part === '/*') {
                $deleteMode = true;
            }
            if ($part === '*/') {
                $deleteMode = false;
            }
            if ($part === '/*' || $part === '* ' || $part === '*/' || $deleteMode === true) {
                unset($rowArray[$rowNumber]);
                if ($deleteMode === true && strpos($rowString, '*/') !== false) {
                    $deleteMode = false;
                }
            }
            if ($part === '//') {
                if (substr($rowString, 0, strlen($okRow1)) === $okRow1) {
                    continue;
                }
                if (substr($rowString, 0, strlen($okRow2)) === $okRow2) {
                    continue;
                }
                unset($rowArray[$rowNumber]);
                continue;
            }
        }

        $result = implode("\r\n", $rowArray);

        return $result;
    }

    /**
     * Get the plugin code from file if exist
     * @param array $in
     * @return array
     * @author Peter Lembke
     * @version 2020-04-25
     * @since 2013-08-18
     */
    protected function plugin_request_from_file(array $in = []): array
    {
        $default = [
            'plugin_node' => 'server',
            'plugin_name' => 'infohub_login',
            'from_plugin' => [
                'node' => '',
                'plugin' => '',
                'function' => ''
            ]
        ];
        $in = $this->_Default($default, $in);

        $out = [
            'answer' => 'false',
            'message' => '',
            'plugin_node' => $in['plugin_node'],
            'plugin_name' => $in['plugin_name'],
            'plugin_path' => '',
            'plugin_from' => '',
            'plugin_code' => '',
            'plugin_checksum' => '',
            'plugin_config' => []
        ];

        if ($in['from_plugin']['node'] !== 'server') {
            $out['message'] = 'Only node: server can call this function';
            goto leave;
        }

        if ($in['from_plugin']['plugin'] !== 'infohub_plugin') {
            $out['message'] = 'Only plugin: infohub_plugin can call this function';
            goto leave;
        }

        $response = $this->internal_Cmd(
            [
                'func' => 'GetPluginPath',
                'plugin_name' => $in['plugin_name'],
                'plugin_node' => $in['plugin_node']
            ]
        );
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

        $response = $this->internal_Cmd(
            [
                'func' => 'ModifyPluginCode',
                'plugin_node' => $in['plugin_node'],
                'plugin_code' => $pluginCode
            ]
        );
        $out['plugin_code'] = $response['plugin_code'];
        $out['plugin_checksum'] = $response['plugin_checksum'];

        if (empty($out['plugin_code']) === false) {
            $configResponse = $this->internal_Cmd(
                [
                    'func' => 'GetConfigFromFile',
                    'plugin_name' => $in['plugin_name'],
                    'node' => $in['plugin_node']
                ]
            );

            if ($configResponse['answer'] === 'true') {
                $out['plugin_config'] = $configResponse['config'];
            }

            $search = '{' . $in['plugin_name'] . '.css}';
            $found = strpos($out['plugin_code'], $search);
            if ($found !== false) {
                $replaceWith = '';
                $cssResponse = $this->internal_Cmd(
                    [
                        'func' => 'GetCssData',
                        'plugin_name' => $in['plugin_name']
                    ]
                );

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
     * @param array $in
     * @return array
     * @author  Peter Lembke
     * @version 2018-12-26
     * @since   2018-01-21
     */
    protected function internal_GetConfigFromFile(array $in = []): array
    {
        $default = [
            'plugin_name' => '',
            'node' => 'client'
        ];
        $in = $this->_Default($default, $in);

        $answer = 'true';
        $foundConfig = 'false';
        $message = '';
        $config = [];

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
            $data = '';
            goto leave;
        }

        $data = json_decode($data, true);
        if (is_array($data) === false) {
            $message = 'File data could not be decoded';
            $data = [];
            goto leave;
        }

        $default = [
            'server' => [],
            'client' => []
        ];
        $data = $this->_Default($default, $data);

        $node = $in['node'];
        $config = $data[$node];
        $answer = 'true';
        $message = 'Here are the config for your node';
        $foundConfig = 'true';

        leave:
        return [
            'answer' => $answer,
            'message' => $message,
            'found_config' => $foundConfig,
            'config' => $config,
            'plugin_name' => $in['plugin_name'],
            'node' => $in['node'],
            'file_name' => $fileName
        ];
    }

    /**
     * Get the data from the css file if it exist
     * The use of css files is discouraged
     * @param array $in
     * @return array
     * @author  Peter Lembke
     * @version 2018-12-26
     * @since   2018-12-26
     */
    protected function internal_GetCssData(array $in = []): array
    {
        $default = [
            'plugin_name' => ''
        ];
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
            $data = '';
            goto leave;
        }

        $data = base64_encode($data);
        $answer = 'true';
        $message = 'Here are the css data';

        leave:
        return [
            'answer' => $answer,
            'message' => $message,
            'plugin_name' => $in['plugin_name'],
            'file_name' => $fileName,
            'css_data' => $data
        ];
    }

    /**
     * Get the plugin code from Storage if Storage exist and the plugin exist in the Storage
     * @param array $in
     * @return array
     * @author Peter Lembke
     * @version 2020-04-25
     * @since 2013-08-18
     */
    protected function plugin_request_from_storage(array $in = []): array
    {
        $default = [
            'plugin_node' => 'server',
            'plugin_name' => 'infohub_login',
            'step' => 'step_ask_storage',
            'plugin_from' => 'storage',
            'plugin_code' => '',
            'plugin_checksum' => '',
            'plugin_config' => [],
            'from_plugin' => [
                'node' => '',
                'plugin' => '',
                'function' => ''
            ]
        ];
        $in = $this->_Default($default, $in);

        $out = array_merge(
            $in,
            [
                'answer' => 'false',
                'message' => 'Did not find the plugin in Storage'
            ]
        );

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
            return $this->_SubCall(
                [
                    'to' => [
                        'node' => 'server',
                        'plugin' => 'infohub_storage',
                        'function' => 'read'
                    ],
                    'data' => [
                        'path' => "infohub_plugin/$pluginNode/$pluginName"
                    ],
                    'data_back' => [
                        'step' => 'step_ask_storage_response'
                    ]
                ]
            );
        }

        if ($in['step'] === 'step_ask_storage_response') {
            $response = $this->internal_Cmd(
                [
                    'func' => 'ModifyPluginCode',
                    'plugin_node' => $in['plugin_node'],
                    'plugin_code' => $in['plugin_code']
                ]
            );
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
     * @param array $in
     * @return array
     * @author Peter Lembke
     * @version 2016-01-30
     * @since 2013-11-21
     * @uses
     */
    protected function plugin_start(array $in = [])
    {
        $default = [
            'plugin_node' => 'server',
            'plugin_name' => 'infohub_login',
            'plugin_from' => '',
            'plugin_path' => '',
            'plugin_code' => '',
            'step' => 'plugin_start',
            'from_plugin' => [
                'node' => '',
                'plugin' => '',
                'function' => ''
            ]
        ];
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
                $message = 'Can not evaluate the plugin class:' . $in['plugin_name'] . ', error:"' . $err->getMessage(
                    ) . '"';
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
        return [
            'answer' => $answer,
            'message' => $message,
            'plugin_node' => $in['plugin_node'],
            'plugin_name' => $in['plugin_name'],
            'plugin_from' => $in['plugin_from'],
            'plugin_path' => $in['plugin_path'],
            'plugin_code' => $in['plugin_code'],
            'plugin_started' => $pluginStarted
        ];
    }

    /**
     * Purpose is to keep the client plugin list accurate.
     *
     * You give a list with plugin names and checksums
     * This function update all timestamp_added
     * All plugins that are valid will get the current timestamp
     * All plugins that are invalid will get current timestamp - 1 week.
     * and then send back the list to the client
     *
     * @param array $in
     * @return array
     * @author Peter Lembke
     * @version 2017-02-28
     * @since 2017-02-25
     * @uses
     */
    protected function plugin_list(array $in = [])
    {
        $default = [
            'plugin_list' => []
        ];
        $in = $this->_Default($default, $in);

        $week = 7 * 24 * 60 * 60; // Seconds
        $valid = $this->_MicroTime(); // Current timestamp since EPOC
        $invalid = $valid - $week;

        foreach ($in['plugin_list'] as $pluginName => $data) {
            $response = $this->internal_Cmd(
                [
                    'func' => 'GetPluginPath',
                    'plugin_name' => $pluginName,
                    'plugin_node' => 'client'
                ]
            );
            $pluginPath = $response['plugin_path'];

            if (file_exists($pluginPath) === true) {
                $contentString = file_get_contents($pluginPath);
                if ($contentString === false) {
                    $contentString = '';
                }

                $checksum = $this->_Hash(trim($contentString));
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
        return [
            'answer' => 'true',
            'message' => 'Here are the list of plugins. Those with an old timestamp_added should be deleted.',
            'data' => $in['plugin_list']
        ];
    }

    // *****************************************************************************
    // * Internal function that you only can reach from internal_Cmd
    // * Function name are in internal_CamelCase
    // * An internal function get all its data from the $in-array
    // * An internal function give its answer as an array, success or error
    // *****************************************************************************

    /**
     * Give a plugin name and a node, get the full path to the plugin file
     * @param array $in
     * @return array
     * @since 2016-01-25
     * @author Peter Lembke
     * @example "infohub_base" & "client" gives you "{web root}/infohub/folder/plugins/infohub/base/infohub_base.js"
     * @version 2016-01-30
     */
    protected function internal_GetPluginPath(array $in = []): array
    {
        $default = [
            'plugin_name' => '',
            'plugin_node' => ''
        ];
        $in = $this->_Default($default, $in);

        $folders = explode('_', $in['plugin_name']);
        $pluginPath = PLUGINS . DS . implode(DS, $folders);

        $extension = [
            'server' => '.php',
            'client' => '.js'
        ];

        $fileName = $in['plugin_name'] . $extension[$in['plugin_node']];
        $fullPath = strtolower($pluginPath . DS . $fileName);

        return [
            'answer' => 'true',
            'message' => 'Here are the full path to the plugin',
            'plugin_path' => $fullPath
        ];
    }

    /**
     * Trim the plugin code and add checksum to the code
     * @param array $in
     * @return array
     * @author Peter Lembke
     * @version 2016-01-30
     * @since 2016-01-30
     */
    protected function internal_ModifyPluginCode(array $in = []): array
    {
        $default = [
            'plugin_node' => '',
            'plugin_code' => ''
        ];
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

        return [
            'answer' => 'true',
            'message' => 'Here are the trimmed plugin code',
            'plugin_code' => $pluginCode,
            'plugin_checksum' => $pluginChecksum,
            'plugin_node' => $in['plugin_node']
        ];
    }

    /**
     * Get a crc32 hash for the string you provide
     * @param string $dataString
     * @return string
     */
    protected function _Hash(string $dataString = ''): string
    {
        return (string)crc32($dataString);
    }

    /**
     * Download all plugin names
     * Used by the client version of infohub_plugin when downloading all plugins
     * @param array $in
     * @return array
     * @author Peter Lembke
     * @version 2018-10-26
     * @since 2018-10-26
     */
    protected function get_all_plugin_names(array $in = []): array
    {
        $default = [
            'step' => 'step_start',
            'answer' => '',
            'message' => '',
            'data' => []
        ];
        $in = $this->_Default($default, $in);

        if ($in['step'] === 'step_start') {
            return $this->_SubCall(
                [
                    'to' => [
                        'node' => 'server',
                        'plugin' => 'infohub_file',
                        'function' => 'plugin_get_all_plugin_names'
                    ],
                    'data' => [],
                    'data_back' => [
                        'step' => 'step_start_response'
                    ]
                ]
            );
        }

        return [
            'answer' => $in['answer'],
            'message' => $in['message'],
            'data' => $in['data']
        ];
    }
}
