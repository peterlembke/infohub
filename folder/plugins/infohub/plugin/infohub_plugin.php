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
if (basename(__FILE__) == basename($_SERVER['SCRIPT_FILENAME'])) {
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
     * @version 2022-03-24
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
            'get_all_plugin_names' => 'normal',
            'get_call_schema' => 'normal'
        ];

        return parent::_GetCmdFunctionsBase($list);
    }

    // ***********************************************************
    // * your class functions below, only use protected functions
    // ***********************************************************

    /**
     * Request all missing_plugin_names
     * You get minified JS plugins up to a limit, so the answer do not get too large.
     * You need to call again to get the rest of the missing plugins
     * It is done like this to reduce the memory consumption on the server
     *
     * @todo Remove plugins_request2
     * @todo Return list with still missing plugins
     * @todo Plugin names that do not exist as file should be put in a list and returned
     * @todo If all missing plugins do not exist as files then read them all from storage instead
     * @todo Return list with plugins that do not exist as file and not in storage
     *
     * @param array $in
     * @return array
     */
    protected function plugins_request(array $in = []): array
    {
        $default = [
            'missing_plugin_names' => [],
            'do_not_minify_these_plugin_names' => [],
            'step' => 'step_plugin_request',
            'config' => [
                'minify_js' => 'true',
                'plugins_request_max_size' => 1024 * 1024,
                'do_not_minify_these_plugin_names' => []
            ]
        ];
        $in = $this->_Default($default, $in);

        $pluginDefault = [
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
        ];

        $pluginLookup = [];

        if ($in['step'] === 'step_plugin_request') {

            $wrongPluginLookup = [];
            $totalSize = 0;
            $doNotMinifyThesePluginNames = array_merge(
                $in['do_not_minify_these_plugin_names'],
                $in['config']['do_not_minify_these_plugin_names']
            );
            $doNotMinifyThesePluginNamesLookup = array_flip($doNotMinifyThesePluginNames);

            foreach ($in['missing_plugin_names'] as $pluginName) { //  => $pluginChecksum) {
                $plugin = $this->internal_Cmd([
                    'func' => 'PluginRequestFromFile',
                    'plugin_name' => $pluginName,
                    'plugin_node' => 'client'
                ]);

                if ($plugin['answer'] === 'false') {
                    $wrongPluginLookup[$pluginName] = [
                        'message' => $plugin['message']
                    ];
                    continue;
                }

                $haveSPDXLicence = $this->_HaveSPDXLicence($plugin['plugin_code']);
                if ($haveSPDXLicence === 'false') {
                    $wrongPluginLookup[$pluginName] = [
                        'message' => 'You must have an SPDX license identifier in your code. ' . $plugin['plugin_name'] . ' do not have that'
                    ];
                    continue;
                }

                if ($in['config']['minify_js'] === 'true') {
                    $shouldMinify = isset($doNotMinifyThesePluginNamesLookup[$pluginName]) === false;
                    if ($shouldMinify === true) {
                        $plugin['plugin_code'] = $this->_MinifyJsCode($plugin['plugin_code']);
                    }
                    if ($shouldMinify === false) {
                        $a=1; // Debug trap
                    }
                }

                $pluginCodeSize = strlen($plugin['plugin_code']);
                $plugin['plugin_code_size'] = $pluginCodeSize;
                $totalSize = $totalSize + $pluginCodeSize;

                if ($totalSize > $in['config']['plugins_request_max_size']) {
                    break;
                }

                $pluginLookup[$pluginName] = $this->_Default($pluginDefault, $plugin);
            }
        }

        return [
            'answer' => 'true',
            'message' => 'Here are the plugins',
            'plugins' => $pluginLookup
        ];
    }

    /**
     * Request all missing_plugin_names
     * @param array $in
     * @return array
     */
    protected function plugins_request2(array $in = []): array
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
                $pluginName = (string) array_pop($in['missing_plugin_names']);

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
            'step' => 'step_check_parameters',
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

        if ($in['step'] === 'step_check_parameters') {
            if ($in['plugin_node'] === '') {
                $out['message'] = 'plugin_node is empty. It is required';
                goto leave;
            }
            if ($in['plugin_name'] === '') {
                $out['message'] = 'plugin_name is empty. It is required';
                goto leave;
            }

            $response = $this->internal_Cmd([
                'func' => 'PluginRequestFromFile',
                'plugin_name' => $in['plugin_name'],
                'plugin_node' => $in['plugin_node']
            ]);
            $in = array_merge($in, $response);

            $in['step'] = 'step_plugin_request_from_storage';
            if ($response['answer'] === 'true') {
                $in['step'] = 'step_handle_plugin';
            }
        }

        if ($in['step'] === 'step_plugin_request_from_storage') {
            return $this->_SubCall([
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
            ]);
        }

        if ($in['step'] === 'step_plugin_request_from_storage_response') {
            $in['step'] = 'step_handle_plugin';
        }

        if ($in['step'] === 'step_handle_plugin') {
            $haveSPDXLicence = $this->_HaveSPDXLicence($in['plugin_code']);
            if ($haveSPDXLicence === 'false') {
                $out['message'] = 'You must have an SPDX license identifier in your code. ' . $in['plugin_name'] . ' do not have that';
                goto leave;
            }

            if ($in['plugin_node'] === 'client' && $in['config']['minify_js'] === 'true') {
                $in['plugin_code'] = $this->_MinifyJsCode($in['plugin_code']);
            }

            $in['plugin_code_size'] = strlen($in['plugin_code']);

            $in['step'] = 'step_send_plugin_to_node';
            if ($in['plugin_node'] === 'server') {
                $in['step'] = 'step_plugin_start';
            }
        }

        if ($in['step'] === 'step_plugin_start') {
            return $this->_SubCall([
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
            ]);
        }

        if ($in['step'] === 'step_plugin_start_response') {
            return $this->_SubCall([
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
            ]);
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
     * Check if the code have an SPDX license string.
     *
     * @param  string  $pluginCode
     * @return string
     */
    protected function _HaveSPDXLicence(string &$pluginCode): string {
        $requiredText = [
            "'SPDX-License-Identifier' => '",
            "'SPDX-License-Identifier': '"
        ];

        foreach ($requiredText as $licenseIdentifier) {
            $haveSPDXLicense = strpos($pluginCode, $licenseIdentifier) > 0;
            if ($haveSPDXLicense === true) {
                return 'true';
            }
        }

        return 'false';
    }

    /**
     * Remove all none essential data from a Javascript file to make it smaller
     * @param string $code
     * @return string
     */
    protected function _MinifyJsCode(string $code = ''): string
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
                if ($deleteMode === true && str_contains($rowString, '*/') === true) {
                    $deleteMode = false;
                }
                continue;
            }
            if ($part === '//') {
                if (str_starts_with($rowString, $okRow1) === true) {
                    continue;
                }
                if (str_starts_with($rowString, $okRow2) === true) {
                    continue;
                }
                unset($rowArray[$rowNumber]);
                continue;
            }

            $startOfComment = strpos($rowString, '//');
            if ($startOfComment !== false) {
                $possibleComment = substr($rowString, $startOfComment + 2);

                $isComment = true;
                $needleArray = ["'", '"', '/', '}', ';'];
                foreach ($needleArray as $needleString) {
                    $isComment = str_contains($possibleComment, $needleString) === false;
                    if ($isComment === false) {
                        break 1;
                    }
                }

                if ($isComment === true) {
                    $rowString = trim(substr($rowString, 0, $startOfComment));
                    $rowArray[$rowNumber] = $rowString;
                }
            }
        }

        $separator = "\n"; // No need for "\r\n", The "\n" is enough.

        $resultString = implode($separator, $rowArray);

        return $resultString;
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

        $response = [
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
            $response['message'] = 'Only node: server can call this function';
            goto leave;
        }

        if ($in['from_plugin']['plugin'] !== 'infohub_plugin') {
            $response['message'] = 'Only plugin: infohub_plugin can call this function';
            goto leave;
        }

        $response = $this->internal_Cmd([
            'func' => 'PluginRequestFromFile',
            'plugin_name' => $in['plugin_name'],
            'plugin_node' => $in['plugin_node']
        ]);

        leave:
        return $response;
    }


    /**
     * Get the plugin code from file if exist
     * @param array $in
     * @return array
     * @author Peter Lembke
     * @version 2020-04-25
     * @since 2013-08-18
     */
    protected function internal_PluginRequestFromFile(array $in = []): array
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

        $response = $this->internal_Cmd([
            'func' => 'GetPluginPath',
            'plugin_name' => $in['plugin_name'],
            'plugin_node' => $in['plugin_node']
        ]);
        $out['plugin_path'] = $response['plugin_path'];

        if (file_exists($out['plugin_path']) === false) {
            $out['message'] = 'Plugin file do not exist';
            goto leave;
        }

        $pluginCode = file_get_contents($out['plugin_path']);
        if (empty($pluginCode) === true) {
            $out['message'] = 'Plugin file exist but could not be read';
            goto leave;
        }

        $out['plugin_from'] = 'file';

        $response = $this->internal_Cmd([
            'func' => 'ModifyPluginCode',
            'plugin_node' => $in['plugin_node'],
            'plugin_code' => $pluginCode
        ]);
        $out['plugin_code'] = $response['plugin_code'];
        $out['plugin_checksum'] = $response['plugin_checksum'];

        if (empty($out['plugin_code']) === false) {
            $configResponse = $this->internal_Cmd([
                'func' => 'GetConfigFromFile',
                'plugin_name' => $in['plugin_name'],
                'node' => $in['plugin_node']
            ]);

            if ($configResponse['answer'] === 'true') {
                $out['plugin_config'] = $configResponse['config'];
            }

            $search = '{' . $in['plugin_name'] . '.css}';
            $found = strpos($out['plugin_code'], $search);
            if ($found !== false) {
                $replaceWith = '';
                $cssResponse = $this->internal_Cmd([
                    'func' => 'GetCssData',
                    'plugin_name' => $in['plugin_name']
                ]);

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
     *
     * @param array $in
     * @return array
     * @author  Peter Lembke
     * @version 2023-07-03
     * @since   2018-01-21
     */
    protected function internal_GetConfigFromFile(array $in = []): array
    {
        $default = [
            'plugin_name' => '',
            'node' => 'client'
        ];
        $in = $this->_Default($default, $in);

        $answer = 'true'; // We do not fail over some bad config
        $foundConfig = 'false';
        $message = '';
        $nodeConfigLookup = [];
        $configFileName = '';

        $isValidNode = $in['node'] === 'client' || $in['node'] === 'server';
        if ($isValidNode === false) {
            $message = 'The node you want is not allowed in the config file';
            goto leave;
        }

        $pluginName = trim(strtolower($in['plugin_name']));

        $configFileName = CONFIG . DS . $pluginName . '.json'; // The config override path
        $isConfigFileExisting = file_exists($configFileName) === true;
        if ($isConfigFileExisting === false) {
            // The config plugin path
            $configFileName = PLUGINS . DS . str_replace('_', DS, $pluginName) . DS . $pluginName . '.json';
            $isConfigFileExisting = file_exists($configFileName) === true;
            if ($isConfigFileExisting === false) {
                $message = 'Config file does not exist';
                goto leave;
            }
        }

        $configFileJson = file_get_contents($configFileName);
        if ($configFileJson === false) {
            $message = 'Failed reading the Config file';
            goto leave;
        }

        $isFileHavingContent = empty($configFileJson) === false;
        if ($isFileHavingContent === false) {
            $message = 'Config file exist but are empty';
            goto leave;
        }

        $fullConfigLookup = json_decode(
            json: (string) $configFileJson,
            associative: true
        );

        if (is_array($fullConfigLookup) === false) {
            $message = 'Config file data could not be decoded from JSON';
            goto leave;
        }

        $default = [
            'server' => [],
            'client' => []
        ];
        $fullConfigLookup = $this->_Default($default, (array) $fullConfigLookup);

        $nodeName = $in['node'];
        $nodeConfigLookup = $fullConfigLookup[$nodeName];
        $message = 'Here is the config for your node';
        $foundConfig = 'true';

        leave:
        return [
            'answer' => $answer,
            'message' => $message,
            'found_config' => $foundConfig,
            'config' => $nodeConfigLookup,
            'plugin_name' => $in['plugin_name'],
            'node' => $in['node'],
            'file_name' => $configFileName
        ];
    }

    /**
     * Get the data from the css file if it exists
     * The use of css files is discouraged
     *
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

        $cssData = '';
        $answer = 'false';
        $message = '';

        $pluginName = trim(strtolower($in['plugin_name']));
        $cssFileName = PLUGINS . DS . str_replace('_', DS, $pluginName) . DS . $pluginName . '.css';

        if (file_exists($cssFileName) === false) {
            $message = 'CSS File does not exist';
            goto leave;
        }

        $cssFileContents = file_get_contents($cssFileName);
        if ($cssFileContents === false) {
            $message = 'CSS File could not be opened';
            goto leave;
        }
        if (empty($cssFileContents) === true) {
            $message = 'CSS File exist but are empty';
            goto leave;
        }

        $cssData = base64_encode((string) $cssFileContents);
        $answer = 'true';
        $message = 'Here are the CSS data, BASE64 encoded';

        leave:

        return [
            'answer' => $answer,
            'message' => $message,
            'plugin_name' => $in['plugin_name'],
            'file_name' => $cssFileName,
            'css_data' => $cssData
        ];
    }

    /**
     * Get the plugin code from Storage if Storage exist and the plugin exist in the Storage
     *
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

        $isAllowedNode = $in['from_plugin']['node'] === 'server';
        if ($isAllowedNode === false) {
            $out['message'] = 'Only node: server can call this function';
            goto leave;
        }

        $isAllowedPlugin = $in['from_plugin']['plugin'] === 'infohub_plugin';
        if ($isAllowedPlugin === false) {
            $out['message'] = 'Only plugin: infohub_plugin can call this function';
            goto leave;
        }

        if ($in['step'] === 'step_ask_storage') {
            $pluginNode = $in['plugin_node'];
            $pluginName = $in['plugin_name'];
            return $this->_SubCall([
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
            ]);
        }

        if ($in['step'] === 'step_ask_storage_response') {
            $response = $this->internal_Cmd([
                'func' => 'ModifyPluginCode',
                'plugin_node' => $in['plugin_node'],
                'plugin_code' => $in['plugin_code']
            ]);
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
     *
     * @param array $in
     * @return array
     * @author Peter Lembke
     * @version 2016-01-30
     * @since 2013-11-21
     * @uses
     */
    protected function plugin_start(array $in = []): array
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

        $isAllowedNode = $in['from_plugin']['node'] === 'server';
        if ($isAllowedNode === false) {
            $out['message'] = 'Only node: server can call this function';
            goto leave;
        }

        $isAllowedPlugin = $in['from_plugin']['plugin'] === 'infohub_plugin';
        if ($isAllowedPlugin === false) {
            $out['message'] = 'Only plugin: infohub_plugin can call this function';
            goto leave;
        }

        $isServerPlugin = $in['plugin_node'] === 'server';
        if ($isServerPlugin === false) {
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
                $errorMessage = 'Can not evaluate the plugin class: %s, error:"%s"';
                $message = sprintf($errorMessage, $in['plugin_name'], $err->getMessage());
                goto leave;
            }
        }

        $isClassLoaded = class_exists($in['plugin_name'], false) === true;
        if ($isClassLoaded === false) {
            $message = sprintf('Could not start plugin:%s', $in['plugin_name']);
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
    protected function plugin_list(array $in = []): array
    {
        $default = [
            'plugin_list' => []
        ];
        $in = $this->_Default($default, $in);

        $response = $this->internal_Cmd([
            'func' => 'PluginList',
            'plugin_list' => $in['plugin_list']
        ]);

        return $response;
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
    protected function internal_PluginList(array $in = []): array
    {
        $default = [
            'plugin_list' => []
        ];
        $in = $this->_Default($default, $in);

        $week = 7 * 24 * 60 * 60; // Seconds
        $valid = $this->_MicroTime(); // Current timestamp since EPOC
        $invalid = $valid - $week;

        foreach ($in['plugin_list'] as $pluginName => $data) {

            if (empty($pluginName) === true) {
                continue;
            }

            $response = $this->internal_Cmd([
                'func' => 'GetPluginPath',
                'plugin_name' => $pluginName,
                'plugin_node' => 'client'
            ]);

            $pluginPath = $response['plugin_path'];

            if (file_exists($pluginPath) === true) {
                $contentString = file_get_contents($pluginPath);
                if ($contentString === false) {
                    $contentString = '';
                }

                $checksum = $this->_Hash(trim($contentString));
                if ($checksum === $data['checksum']) {
                    // Plugins that still have the same checksum as locally will get their
                    // timestamp set to now, so they last a bit longer in the local cache
                    $in['plugin_list'][$pluginName]['timestamp_added'] = $valid;
                    continue;
                }
            }

            // Plugins that do no longer exist or has a new checksum will be set as one-week-old in the local cache.
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
     * @version 2023-07-03
     */
    protected function internal_GetPluginPath(array $in = []): array
    {
        $default = [
            'plugin_name' => '',
            'plugin_node' => ''
        ];
        $in = $this->_Default($default, $in);

        if ($in['plugin_name'] === '' || $in['plugin_node'] === '' ) {
            return [
                'answer' => 'false',
                'message' => 'plugin_node or plugin_name is empty',
                'plugin_path' => ''
            ];
        }

        $folders = explode('_', $in['plugin_name']);
        $pluginPath = PLUGINS . DS . implode(DS, $folders);

        $extensionLookup = [
            'server' => '.php',
            'client' => '.js'
        ];

        $haveExtension = isset($extensionLookup[$in['plugin_node']]) === true;
        if ($haveExtension === false) {
            return [
                'answer' => 'false',
                'message' => 'Can not find find the plugin extension because of unknown node: ' . $in['plugin_node'],
                'plugin_path' => ''
            ];
        }

        $pluginFileName = $in['plugin_name'] . $extensionLookup[$in['plugin_node']];
        $pluginFullPath = strtolower($pluginPath . DS . $pluginFileName);

        return [
            'answer' => 'true',
            'message' => 'Here are the full path to the plugin',
            'plugin_path' => $pluginFullPath
        ];
    }

    /**
     * Trim the plugin code and add checksum to the code
     *
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
            if (str_starts_with($pluginCode, '<?php') === true) {
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
                    'data' => [
                        'type' => 'js'
                    ],
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

    /**
     * Gives you a schema with all server plugins that you can call.
     * You get a lookup with node, plugin, function. Only level 1 plugins and cmd functions.
     * You get version information for each plugin and function.
     * You get the default in-array and the default out-array for each function.
     *
     * @param array $in
     * @return array
     * @author Peter Lembke
     * @version 2022-03-24
     * @since 2022-03-24
     */
    protected function get_call_schema(array $in = []): array
    {
        $default = [
            'step' => 'step_get_plugin_names',
            'answer' => 'false',
            'message' => '',
            'data' => [],
            'config' => [
                'server_plugin_names' => []
            ],
            'response' => [],
            'data_back' => [
                'plugin_array' => [],
                'plugin_name' => '',
                'result' => [
                    'node' => 'server',
                    'date' => '',
                    'plugins' => []
                ]
            ]
        ];
        $in = $this->_Default($default, $in);

        if ($in['step'] === 'step_get_plugin_names') {
            return $this->_SubCall([
                'to' => [
                    'node' => 'server',
                    'plugin' => 'infohub_file',
                    'function' => 'plugin_get_all_plugin_names'
                ],
                'data' => [
                    'type' => 'php',
                    'levels' => 1
                ],
                'data_back' => [
                    'step' => 'step_get_plugin_names_response'
                ]
            ]);
        }

        if ($in['step'] === 'step_get_plugin_names_response') {
            $pluginLookup = $in['data'];
            $allowedPluginLookup = $in['config']['server_plugin_names'];
            $pluginArray= [];
            foreach ($allowedPluginLookup as $pluginName => $dummy) {
                if (isset($pluginLookup[$pluginName]) === true) {
                    $pluginArray[] = $pluginName;
                }
            }
            sort($pluginArray);
            $in['data_back']['plugin_array'] = $pluginArray;
            $in['data_back']['result']['date'] = $this->_TimeStamp();
            $in['step'] = 'step_get_next_plugin';
            if ($in['answer'] === 'false') {
                goto leave;
            }
        }

        if ($in['step'] === 'step_get_plugin_data_response') {
            if ($in['answer'] === 'false') {
                goto leave;
            }
            $pluginName = $in['data_back']['plugin_name'];
            $userRole = $in['response']['plugin']['user_role'];

            if ($userRole !== '') {
                $in['data_back']['result']['plugins'][$pluginName] = $in['response']['plugin'];
                $in['data_back']['result']['plugins'][$pluginName]['functions'] = $in['response']['functions'];
            }

            $in['step'] = 'step_get_next_plugin';
        }

        if ($in['step'] === 'step_get_next_plugin') {
            $in['step'] = 'step_get_plugin_data';
            if (count($in['data_back']['plugin_array']) === 0) {
                $in['step'] = 'step_build_result';
            }
        }

        if ($in['step'] === 'step_get_plugin_data') {

            $pluginName = array_shift($in['data_back']['plugin_array']);

            return $this->_SubCall([
                'to' => [
                    'node' => 'server',
                    'plugin' => $pluginName,
                    'function' => 'version'
                ],
                'data' => [],
                'data_back' => [
                    'plugin_array' => $in['data_back']['plugin_array'],
                    'plugin_name' => $pluginName,
                    'result' => $in['data_back']['result'],
                    'step' => 'step_get_plugin_data_response'
                ]
            ]);
        }

        if ($in['step'] === 'step_build_result') {
            // @todo Now we should call all the cmd functions and get their default in and out data.
            $a=1;
        }

        leave:
        return [
            'answer' => $in['answer'],
            'message' => $in['message'],
            'data' => $in['data_back']['result']
        ];
    }
}
