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
function infohub_plugin() {

    "use strict";

// webworker=false
// include "infohub_base.js"

    $functions.push('_Version');
    const _Version = function() {
        return {
            'date': '2019-10-27',
            'since': '2015-02-12',
            'version': '1.0.1',
            'checksum': '{{checksum}}',
            'class_name': 'infohub_plugin',
            'note': 'Used by infohub_exchange to handle plugin requests. Finds the plugin in local storage or requests it from the server, then starts the plugin',
            'status': 'normal',
            'SPDX-License-Identifier': 'GPL-3.0-or-later',
            'user_role': 'user'
        };
    };

    $functions.push('_GetCmdFunctions');
    const _GetCmdFunctions = function()
    {
        const $list = {
            'plugin_request': 'normal',
            'plugin_start': 'normal',
            'plugin_list': 'normal',
            'download_all_plugins': 'normal',
            'set_plugin_config': 'normal'
        };

        return _GetCmdFunctionsBase($list);
    };

    // *****************************************************************************
    // * Functions you only can reach with CMD()
    // * Observe! function names are lower_case
    // *****************************************************************************

    /**
     * Request plugin from cache, then from server
     * Start plugin, move pending messages to Stack
     * Save plugin in local cache
     * @version 2014-10-07
     * @since 2014-10-07
     * @author Peter Lembke
     * @param $in
     */
    $functions.push('plugin_request');
    const plugin_request = function ($in)
    {
        const $default = {
            'plugin_name':'',
            'step': 'plugin_request_from_cache',
            'answer': 'false',
            'message': '',
            'data': {},
            'found': '',
            'old': '',
            'plugins': {},
            'start_plugin': 'true'
        };
        $in = _Default($default,$in);

        let $answer = 'false';
        let $message = 'There was an error';
        let $messageArray = [];
        let $messageOut = {};

        if ($in.step === 'plugin_request_from_cache')
        {
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_cache',
                    'function': 'load_data_from_cache'
                },
                'data': {
                    'prefix': 'plugin',
                    'key': $in.plugin_name
                },
                'data_back': {
                    'step': 'plugin_request_from_cache_response',
                    'plugin_name': $in.plugin_name,
                    'start_plugin': $in.start_plugin
                }
            });
        }

        if ($in.step === 'plugin_request_from_cache_response')
        {
            if ($in.found === 'false' || $in.old === 'true') {
                let $missingPluginNames = [];
                $missingPluginNames.push($in.plugin_name);

                $messageOut = _SubCall({
                    'to': {
                        'node': 'server',
                        'plugin': 'infohub_plugin',
                        'function': 'plugins_request'
                    },
                    'data': {
                        'plugin_node': 'client',
                        'plugin_name': $in.plugin_name,
                        'missing_plugin_names': $missingPluginNames
                    },
                    'data_back': {
                        'step': 'plugin_request_from_server_response',
                        'plugin_name': $in.plugin_name,
                        'start_plugin': $in.start_plugin
                    }
                });
            }

            if ($in.found === 'false') {
                return $messageOut;
            }

            if ($in.found === 'true') {

                if ($in.old === 'true') {
                    $messageArray.push($messageOut);
                }

                $in.data.plugin_from = 'local_cache';

                $in.step = 'step_start_plugin';
            }
        }

        if ($in.step === 'plugin_request_from_server_response') {
            if (_Count($in.plugins) > 0) {

                const $response = _Pop($in.plugins);
                const $plugin = $response.data;
                $in.plugins = $response.object;

                return _SubCall({
                    'to': {
                        'node': 'client',
                        'plugin': 'infohub_cache',
                        'function': 'save_data_to_cache'
                    },
                    'data': {
                        'prefix': 'plugin',
                        'key': $plugin.plugin_name,
                        'data': $plugin,
                        'checksum': $plugin.plugin_checksum
                    },
                    'data_back': {
                        'step': 'plugin_request_from_server_response',
                        'plugins': $in.plugins,
                        'plugin_name': $in.plugin_name,
                        'start_plugin': $in.start_plugin
                    }
                });

            }

            $in.step = 'step_start_plugin';
        }

        if ($in.step === 'step_start_plugin')
        {
            $in.step = 'step_start_plugin_response';

            if ($in.start_plugin !== 'false')
            {
                return _SubCall({
                    'to': {
                        'node': 'client',
                        'plugin': 'infohub_plugin',
                        'function': 'plugin_start'
                    },
                    'data': {
                        'plugin_name': $in.plugin_name
                    },
                    'data_back': {
                        'plugin_name': $in.plugin_name,
                        'step': 'step_start_plugin_response'
                    },
                    'messages': $messageArray
                });
            }
        }

        if ($in.step === 'step_start_plugin_response') {
            $answer = $in.answer;
            $message = $in.message;
        }

        return {
            'answer': $answer,
            'message': $message
        };
    };

    /**
     * Start a plugin that are stored in the local storage
     * Give just the plugin_name. Fetch plugin-class and base-class from infohub_cache
     * @param $in
     * @returns {{answer: string, message: string}}
     */
    $functions.push('plugin_start');
    const plugin_start = function ($in)
    {
        // "use strict"; // Do not use strict with eval()

        const $default = {
            'plugin_name':'',
            'step': 'step_get_plugin_from_cache',
            'answer': 'false',
            'message': '',
            'data': {},
            'found': '',
            'old': '',
            'plugins': {} // Used for storing infohub_base + the plugin you want to start
        };
        $in = _Default($default,$in);

        let $answer = 'false';
        let $message = 'An error occurred';
        let $worker;

        if ($in.step === 'step_get_plugin_from_cache')
        {
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_cache',
                    'function': 'load_data_from_cache'
                },
                'data': {
                    'prefix': 'plugin',
                    'key': $in.plugin_name
                },
                'data_back': {
                    'step': 'step_get_plugin_from_cache_response',
                    'plugins': $in.plugins,
                    'plugin_name': $in.plugin_name
                }
            });
        }

        if ($in.step === 'step_get_plugin_from_cache_response')
        {
            $in.step = 'step_error';
            $answer = 'false';
            $message = 'Plugin do not exist';

            if ($in.answer === 'true' && $in.found === 'true' && $in.data.plugin_code !== '') {
                $in.plugins[$in.plugin_name] = _ByVal($in.data);
                $in.step = 'step_get_base_class_from_cache';
            }
        }

        if ($in.step === 'step_get_base_class_from_cache')
        {
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_cache',
                    'function': 'load_data_from_cache'
                },
                'data': {
                    'prefix': 'plugin',
                    'key': 'infohub_base'
                },
                'data_back': {
                    'step': 'step_get_base_class_from_cache_response',
                    'plugins': $in.plugins,
                    'plugin_name': $in.plugin_name
                }
            });
        }

        if ($in.step === 'step_get_base_class_from_cache_response')
        {
            $in.step = 'step_error';
            $answer = 'false';
            $message = 'Plugin infohub_base do not exist';

            if ($in.answer === 'true' && $in.found === 'true' && $in.data.plugin_code !== '') {
                $in.plugins.infohub_base = _ByVal($in.data);
                $in.step = 'step_start_plugin';
            }
        }

        if ($in.step === 'step_start_plugin')
        {
            let $ok = 'true';
            const $basePlugin = $in.plugins.infohub_base;
            let $pluginCode = $in.plugins[$in.plugin_name].plugin_code;
            let $webWorkerFlag = 'true';

            block: {
                if (_Empty($pluginCode) === 'true') {
                    $message = 'Have no plugin code class:' + $in.plugin_name;
                    break block;
                }

                if (_Empty($basePlugin) === 'true') {
                    $message = 'Have no plugin code class: infohub_base';
                    break block;
                }

                $pluginCode = $pluginCode.replace('{{base_checksum}}', $basePlugin.plugin_checksum);
                $pluginCode = $pluginCode.replace('\// include \"infohub_base.js\"', $basePlugin.plugin_code);

                try {
                    eval.call(window,$pluginCode);
                } catch ($err) {
                    $message = 'Can not evaluate the plugin class:"' + $in.plugin_name + '", error:"' + $err.message + '"';
                    break block;
                }
                // Check that the plugin class are available
                try {
                    eval("if (typeof " + $in.plugin_name + " === 'undefined') { $ok = 'false'; }");
                } catch ($err) {
                    $message = 'Can not check if the class:"' + $in.plugin_name + '" exist. error:"' + $err.message + '"';
                    break block;
                }
                if ($ok === 'false') {
                    $message = 'Could not start plugin:' + $in.plugin_name;
                    break block;
                }

                // Default is to start plugin as a web worker, unless we explicitly turn that off in the plugin code.
                if ($pluginCode.indexOf('// webworker=false') >= 0) {
                    $webWorkerFlag = 'false';
                }

                $message = 'Have started the plugin';

                if ($webWorkerFlag === 'true') {
                    /*
                    const $blob = new Blob([$pluginCode], {type: 'application/javascript'});
                    $worker = new Worker(URL.createObjectURL($blob));
                    $worker.onmessage = function($in) { // Move this function to infohub_exchange
                        $message = JSON.parse($in);
                        let $package = {
                                'to_node' : 'server',
                                'messages' : []
                            };
                        $package.messages.push($message);
                        setTimeout(function(){
                            const $event = new CustomEvent('infohub_call_main',
                                { detail: {'plugin': this, 'package': $package}, bubbles: true, cancelable: true }
                            );
                            document.dispatchEvent($event);
                        }, 0.0);
                    };
                    */
                    $message = $message + ' as a web worker';
                }

                $answer = 'true';
                $message = $message + '. Now it is up to infohub_exchange to instantiate the plugin and move messages from Pending to Stack';

                return _SubCall({
                    'to': {
                        'node': 'client',
                        'plugin': 'infohub_exchange',
                        'function': 'plugin_started'
                    },
                    'data': {
                        'plugin_node': $in.plugin_node,
                        'plugin_name': $in.plugin_name,
                        'plugin_started': 'true',
                        'web_worker_flag': $webWorkerFlag,
                        'web_worker': $worker
                    },
                    'data_back': {
                        'step': 'step_plugin_started_response'
                    }
                });
            }
        }

        if ($in.step === 'step_plugin_started_response') {
            $answer = $in.answer;
            $message = $in.message;
        }

        if ($in.step === 'step_error')
        {
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_exchange',
                    'function': 'plugin_started'
                },
                'data': {
                    'plugin_node': $in.plugin_node,
                    'plugin_name': $in.plugin_name,
                    'plugin_started': 'false',
                    'web_worker_flag': 'false'
                },
                'data_back': {
                    'step': 'step_error_response'
                }
            });
        }

        if ($in.step === 'step_error_response')
        {
            $answer = $in.answer;
            $message = $in.message;
        }

        return {
            'answer': $answer,
            'message': $message
        };
    };

    /**
     * Purpose is to keep the client plugin list accurate.
     * Get the local plugin index and send it to the server
     * The response will be sent to infohub_cache so the plugin list can be updated.
     * @param $in
     * @returns {{answer: string, message: string}}
     */
    $functions.push('plugin_list');
    const plugin_list = function ($in)
    {
        const $default = {
            'answer': 'false',
            'message': '',
            'data': {},
            'step': 'step_get_list',
            'data_back': {
                'server_plugin_list': {}
            }
        };
        $in = _Default($default, $in);

        if ($in.step === 'step_get_list')
        {
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_cache',
                    'function': 'load_index_from_cache'
                },
                'data': {
                    'prefix': 'plugin'
                },
                'data_back': {
                    'step': 'step_get_list_response'
                }
            });
        }

        if ($in.step === 'step_get_list_response')
        {
            return _SubCall({
                'to': {
                    'node': 'server',
                    'plugin': 'infohub_plugin',
                    'function': 'plugin_list'
                },
                'data': {
                    'plugin_list': $in.data
                },
                'data_back': {
                    'step': 'step_server_response'
                }
            });
        }

        if ($in.step === 'step_server_response') {
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_cache',
                    'function': 'update_index_in_cache'
                },
                'data': {
                    'prefix': 'plugin',
                    'data': $in.data
                },
                'data_back': {
                    'server_plugin_list': $in.data,
                    'step': 'step_cache_response'
                }
            });
        }

        let $pluginsOld = [];

        if ($in.step === 'step_cache_response') {

            let $items = $in.data_back.server_plugin_list;

            const $hour = 60 * 60; // seconds
            const $timeOld = _MicroTime() - $hour;

            while (_Count($items) > 0) {
                const $response = _Pop($items);
                const $pluginName = $response.key;
                const $timestampAdded = $response.data.timestamp_added;
                $items = $response.object;
                if ($timestampAdded < $timeOld) {
                    $pluginsOld.push($pluginName);
                }
            }
        }

        return {
            'answer': 'true',
            'message': 'The plugin time stamps have now been updated',
            'plugins_old': $pluginsOld
        };
    };

    /**
     * Request all plugins from the server, create multiple save messages locally to save the plugins in local storage
     * @param $in
     * @returns {{answer: string, message: string}}
     */
    $functions.push('download_all_plugins');
    const download_all_plugins = function ($in)
    {
        const $default = {
            'answer': 'false',
            'message': '',
            'data': {},
            'plugin_names': {},
            'plugins': {},
            'step': 'step_get_all_plugin_names'
        };
        $in = _Default($default, $in);

        if ($in.step === 'step_get_all_plugin_names')
        {
            return _SubCall({
                'to': {
                    'node': 'server',
                    'plugin': 'infohub_plugin',
                    'function': 'get_all_plugin_names'
                },
                'data': {},
                'data_back': {
                    'step': 'step_get_all_plugin_names_response'
                }
            });
        }

        if ($in.step === 'step_get_all_plugin_names_response')
        {
            $in.plugin_names = _ByVal($in.data);
            $in.step = 'step_download_some_plugins';
        }

        if ($in.step === 'step_save_data_to_cache')
        {
            if (_Count($in.plugins) > 0)
            {
                const $response = _Pop($in.plugins);
                const $plugin = _ByVal($response.data);

                return _SubCall({
                    'to': {
                        'node': 'client',
                        'plugin': 'infohub_cache',
                        'function': 'save_data_to_cache'
                    },
                    'data': {
                        'prefix': 'plugin',
                        'key': $plugin.plugin_name,
                        'data': $plugin,
                        'checksum': $plugin.plugin_checksum
                    },
                    'data_back': {
                        'plugin_names': $in.plugin_names,
                        'plugins': $response.object,
                        'step': 'step_save_data_to_cache'
                    }
                });
            }

            $in.step = 'step_download_some_plugins';
        }

        if ($in.step === 'step_download_some_plugins')
        {
            let $count = 0;
            let $missingPluginNames = [];
            let $pluginName;

            // @todo When logged in I want to increase the limit from 20 to 100.
            while ($count < 20 && _Count($in.plugin_names) > 0 )
            {
                const $response = _Pop($in.plugin_names);
                $pluginName = $response.key;
                $in.plugin_names = _ByVal($response.object);
                $missingPluginNames.push($pluginName);
                $count = $count + 1;
            }

            if (_Count($missingPluginNames) > 0)
            {
                return _SubCall({
                    'to': {
                        'node': 'server',
                        'plugin': 'infohub_plugin',
                        'function': 'plugins_request'
                    },
                    'data': {
                        'missing_plugin_names': $missingPluginNames
                    },
                    'data_back': {
                        'plugin_names': $in.plugin_names,
                        'step': 'step_save_data_to_cache'
                    }
                });
            }

            $in.step = 'step_end';
        }

        return {
            'answer': 'true',
            'message': 'Done with storing all plugins'
        };
    };

    /**
     * Give a set of config data.
     * Function will load the plugin with its config data.
     * Merge in the new data into the existing keys only
     * If any existing key got new data then store the config with the plugin
     * @param $in
     * @returns {{answer: string, message: string}}
     */
    $functions.push('set_plugin_config');
    const set_plugin_config = function ($in)
    {
        const $default = {
            'answer': 'false',
            'message': '',
            'plugin_name': '',
            'plugin_config': {},
            'step': 'step_get_plugin_from_cache',
            'data_back': {},
            'response': {}
        };
        $in = _Default($default, $in);

        let $plugin = {};

        if ($in.step === 'step_get_plugin_from_cache')
        {
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_cache',
                    'function': 'load_data_from_cache'
                },
                'data': {
                    'prefix': 'plugin',
                    'key': $in.plugin_name
                },
                'data_back': {
                    'plugin_name': $in.plugin_name,
                    'plugin_config': $in.plugin_config,
                    'step': 'step_get_plugin_from_cache_response'
                }
            });
        }

        if ($in.step === 'step_get_plugin_from_cache_response') {
            const $default = {
                'answer': 'false',
                'message': '',
                'data': {
                    'plugin_checksum': '',
                    'plugin_code': '',
                    'plugin_code_size': 0,
                    'plugin_config': {},
                    'plugin_from': '',
                    'plugin_name': '',
                    'plugin_node': '',
                    'plugin_path': ''
                }
            };
            $in.response = _Default($default, $in.response);

            $in.step = 'step_end';
            $plugin = $in.response.data;

            if (_Full($plugin.plugin_checksum) === 'true') {
                $plugin.plugin_config = _Default($plugin.plugin_config, $in.plugin_config);
                $in.step = 'step_save_plugin_to_cache';
            }
        }

        if ($in.step === 'step_save_plugin_to_cache')
        {
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_cache',
                    'function': 'save_data_to_cache'
                },
                'data': {
                    'prefix': 'plugin',
                    'key': $plugin.plugin_name,
                    'data': $plugin,
                    'checksum': $plugin.plugin_checksum
                },
                'data_back': {
                    'step': 'step_save_plugin_to_cache_response'
                }
            });
        }

        if ($in.step === 'step_save_plugin_to_cache_response')
        {

        }

        return {
            'answer': 'true',
            'message': 'Done updating the plugin config for one plugin'
        };
    };
}
//# sourceURL=infohub_plugin.js
