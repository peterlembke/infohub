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

// webworker=false
// include "infohub_base.js"

    // ***********************************************************
    // * jshint.com options to suppress some warnings
    // ***********************************************************

    /*jshint evil:true */
    /*jshint devel:true */
    /*jslint browser: true, evil: true, plusplus: true, todo: true */

    $functions.push('_Version');
    var _Version = function() {
        return {
            'date': '2015-02-12',
            'since': '2015-02-12',
            'version': '1.0.0',
            'checksum': '{{checksum}}',
            'class_name': 'infohub_plugin',
            'note': 'Used by infohub_exchange to handle plugin requests. Finds the plugin in local storage or requests it from the server, then starts the plugin',
            'status': 'normal',
            'license_name': 'GNU GPL 3 or later'
        };
    };

    $functions.push('_GetCmdFunctions');
    var _GetCmdFunctions = function() {
        return {
            'plugin_request': 'normal',
            'plugin_start': 'normal',
            'plugin_list': 'normal',
            'download_all_plugins': 'normal'
        };
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
    var plugin_request = function ($in) {
        "use strict";

        var $answer, $message,
            $default = {
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

        $answer = 'false';
        $message = 'There was an error';

        if ($in.step === 'plugin_request_from_cache') {
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

        if ($in.step === 'plugin_request_from_cache_response') {
            $in.step = 'plugin_request_from_server';
            if ($in.found === 'true' && $in.old === 'false') {
                $in = _ByVal($in.data);
                $in.plugin_from = 'local_cache';
                $in.step = 'step_start_plugin';
            }
        }

        if ($in.step === 'plugin_request_from_server') {
            var $missingPluginNames = [];

            $missingPluginNames.push($in.plugin_name);
            return _SubCall({
                'to': {'node': 'server', 'plugin': 'infohub_plugin', 'function': 'plugins_request'},
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

        if ($in.step === 'plugin_request_from_server_response') {
            if (_Count($in.plugins) > 0) {

                var $response, $plugin;
                $response = _Pop($in.plugins);
                $plugin = $response.data;
                $in.plugins = $response.object;

                return _SubCall({
                    'to': {'node': 'client', 'plugin': 'infohub_cache', 'function': 'save_data_to_cache'},
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

        if ($in.step === 'step_start_plugin') {
            $in.step = 'step_start_plugin_response';
            if ($in.start_plugin !== 'false') {
                return _SubCall({
                    'to': {'node': 'client', 'plugin': 'infohub_plugin', 'function': 'plugin_start'},
                    'data': {'plugin_name': $in.plugin_name},
                    'data_back': {
                        'plugin_name': $in.plugin_name,
                        'step': 'step_start_plugin_response'
                    }
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
    var plugin_start = function ($in) {
        // "use strict"; // Do not use strict with eval()
        var $answer, $message,
            $default = {
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

        $answer = 'false';
        $message = 'An error occurred';

        if ($in.step === 'step_get_plugin_from_cache')
        {
            return _SubCall({
                'to': {'node': 'client', 'plugin': 'infohub_cache', 'function': 'load_data_from_cache'},
                'data': {'prefix': 'plugin', 'key': $in.plugin_name},
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
                'to': {'node': 'client', 'plugin': 'infohub_cache', 'function': 'load_data_from_cache'},
                'data': {'prefix': 'plugin', 'key': 'infohub_base'},
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
            block: {

                var $ok = 'true',
                    $basePlugin = $in.plugins.infohub_base,
                    $pluginCode = $in.plugins[$in.plugin_name].plugin_code,
                    $webWorkerFlag = 'true', $blob, $worker, $message, $event;

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
                    $blob = new Blob([$pluginCode], {type: 'application/javascript'});
                    $worker = new Worker(URL.createObjectURL($blob));
                    $worker.onmessage = function($in) { // Move this function to infohub_exchange
                        $message = JSON.parse($in);
                        var $package = {
                                'to_node' : 'server',
                                'messages' : []
                            };
                        $package.messages.push($message);
                        setTimeout(function(){
                            $event = new CustomEvent('infohub_call_main',
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

        if ($in.step === 'step_error') {
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

        if ($in.step === 'step_error_response') {
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
    var plugin_list = function ($in)
    {
        "use strict";

        const $default = {
            'answer': 'false',
            'message': '',
            'data': {},
            'step': 'step_get_list'
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

        if ($in.step === 'step_server_response')
        {
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
                    'step': 'step_cache_response'
                }
            });
        }

        return {
            'answer': 'true',
            'message': 'The plugin time stamps have now been updated'
        };

    };

    /**
     * Request all plugins from the server, create multiple save messages locally to save the plugins in local storage
     * @param $in
     * @returns {{answer: string, message: string}}
     */
    $functions.push('download_all_plugins');
    var download_all_plugins = function ($in) {
        "use strict";
        var $missingPluginNames = [], $count = 0, $pluginName, $response, $plugin,
            $default = {
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
                'to': {'node': 'server', 'plugin': 'infohub_plugin', 'function': 'get_all_plugin_names'},
                'data': {},
                'data_back': {
                    'step': 'step_get_all_plugin_names_response'
                }
            });
        }

        if ($in.step === 'step_get_all_plugin_names_response')
        {
            $in.plugin_names = _ByVal($in.data);
            $in.step = 'step_download_some_plugins'
        }

        if ($in.step === 'step_save_data_to_cache')
        {
            if (_Count($in.plugins) > 0) {
                $response = _Pop($in.plugins);
                $plugin = _ByVal($response.data);

                return _SubCall({
                    'to': {'node': 'client', 'plugin': 'infohub_cache', 'function': 'save_data_to_cache'},
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
            $count = 0;
            $missingPluginNames = [];

            // @todo When logged in I want to increase the limit from 20 to 100.
            while ($count < 20 && _Count($in.plugin_names) > 0 ) {
                $response = _Pop($in.plugin_names);
                $pluginName = $response.key;
                $in.plugin_names = _ByVal($response.object);
                $missingPluginNames.push($pluginName);
                $count++;
            }

            if (_Count($missingPluginNames) > 0) {
                return _SubCall({
                    'to': {'node': 'server', 'plugin': 'infohub_plugin', 'function': 'plugins_request'},
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

}
//# sourceURL=infohub_plugin.js