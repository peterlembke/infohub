/**
 * infohub_debug.js contact the renderers to get HTML and then send it to infohub_view
 * infohub_debug and infohub_view are the only plugions that handle the DOM
 * @category InfoHub
 * @package infohub_debug
 * @copyright Copyright (c) 2010-, Peter Lembke, CharZam soft
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
function infohub_debug() {

    // include "infohub_base.js"

    // ***********************************************************
    // * your private class variables below, only declare with var
    // ***********************************************************

    var _Version = function() {
        return {
            'date': '2018-09-09',
            'since': '2018-09-09',
            'version': '1.0.0',
            'checksum': '{{checksum}}',
            'class_name': 'infohub_debug',
            'note': 'Tool for clearing caches and refresh the page when the ban time says ok',
            'status': 'normal',
            'license_name': 'GNU GPL 3 or later'
        };
    };

    var _GetCmdFunctions = function() {
        return {
            'setup_gui': 'normal',
            'create': 'normal',
            'clear_plugins': 'normal',
            'refresh_plugins': 'normal',
            'reload_page': 'normal',
            'clear_storage_and_reload_page': 'normal',
            'refresh_plugins_and_reload_page': 'normal',
            'set_cold_start_and_reload_page': 'normal'
        };
    };

    // ***********************************************************
    // * The private functions, add your own in your plugin
    // * These functions can be used directly in your functions.
    // * Name: _CamelCaseData
    // ***********************************************************

    /**
     * Internal functions must start with a capital letter
     * Used by renderers to get a proper function name
     * @version 2016-10-16
     * @since   2016-10-16
     * @author  Peter Lembke
     * @param $text
     * @return string
     */
    var _GetFuncName = function($text)
    {
        "use strict";

        let $response = '';
        const $parts = $text.split('_');

        for (let $key in $parts) {
            if ($parts.hasOwnProperty($key) === false) {
                continue;
            }
            $response = $response + $parts[$key].charAt(0).toUpperCase() + $parts[$key].substr(1);
        }

        return $response;
    };

    var $classTranslations = {};

    /**
     * Translate - Substitute a string for another string using a class local object
     * @param {type} $string
     * @returns string
     */
    $functions.push('_Translate');
    var _Translate = function ($string)
    {
        if (typeof $classTranslations !== 'object') {
            return $string;
        }

        const $translatedString = _GetData({
            'name': _GetClassName() + '|' + $string,
            'default': $string,
            'data': $classTranslations,
            'split': '|'
        });

        return $translatedString;
    };

    // *****************************************************************************
    // * Functions you only can reach with CMD()
    // * Observe function names are lower_case
    // *****************************************************************************

    /**
     * Setup the Config Graphical User Interface
     * @version 2018-09-09
     * @since   2018-09-09
     * @author  Peter Lembke
     */
    $functions.push('setup_gui');
    var setup_gui = function ($in)
    {
        "use strict";

        const $default = {
            'box_id': '',
            'step': 'step_get_translations'
        };
        $in = _Merge($default, $in);

        if ($in.step === 'step_get_translations')
        {
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_translate',
                    'function': 'get_translate_data'
                },
                'data': {},
                'data_back': {
                    'box_id': $in.box_id,
                    'step': 'step_get_translations_response'
                }
            });
        }

        if ($in.step === 'step_get_translations_response')
        {
            $classTranslations = _ByVal($in.response.data);
            $in.step = 'step_start';
        }

        if ($in.step === 'step_start')
        {
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_render',
                    'function': 'create'
                },
                'data': {
                    'what': {
                        'debug_buttons': {
                            'plugin': 'infohub_debug',
                            'type': 'debug_buttons'
                        }
                    },
                    'how': {
                        'mode': 'one box',
                        'text': '[debug_buttons]'
                    },
                    'where': {
                        'box_id': $in.box_id,
                        'max_width': 320,
                        'scroll_to_box_id': 'true'
                    }
                },
                'data_back': {'step': 'step_end'}
            });
        }

        return {
            'answer': 'true',
            'message': 'plugin GUI is done'
        };

    };

    /**
     * Get instructions and create the message to InfoHub View
     * @version 2013-04-15
     * @since   2013-04-15
     * @author  Peter Lembke
     */
    $functions.push("create"); // Enable this function
    var create = function ($in)
    {
        "use strict";

        const $default = {
            'type': '',
            'alias': '',
            'original_alias': '',
            'step': 'step_start',
            'html': '',
            'css_data': {}
        };
        $in = _Merge($default, $in);

        if ($in.step === 'step_start')
        {
            $in.func = _GetFuncName($in.type);
            let $response = internal_Cmd($in);

            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_render',
                    'function': 'create'
                },
                'data': {
                    'what': $response.data,
                    'how': $response.how,
                    'where': $response.where
                },
                'data_back': {
                    'step': 'step_end'
                }
            });
        }

        if ($in.step === 'step_final') {
            if (_Empty($in.alias) === 'false') {
                // All IDs become unique by inserting the parent alias in each ID.
                const $find = '{box_id}';
                const $replace = $find + '_' + $in.alias;
                $in.html = $in.html.replace(new RegExp($find, 'g'), $replace);
            }
        }

        return {
            'answer': $in.answer,
            'message': $in.message,
            'html': $in.html,
            'css_data': $in.css_data
        };
    };

    /**
     * Remove all plugins from the local storage
     * @version 2018-09-09
     * @since   2018-09-09
     * @author  Peter Lembke
     */
    $functions.push("clear_plugins"); // Enable this function
    var clear_plugins = function ($in)
    {
        "use strict";

        const $default = {
            'step': 'step_start'
        };
        $in = _Default($default, $in);

        if ($in.step === 'step_start') {
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_cache',
                    'function': 'remove_data_from_cache_by_prefix'
                },
                'data': {
                    'prefix': 'plugin'
                },
                'data_back': {
                    'step': 'step_end'
                }
            });
        }

        return {
            'answer': $in.answer,
            'message': $in.message
        };
    };

    /**
     * Remove all local databases
     * @version 2018-09-09
     * @since   2018-09-09
     * @author  Peter Lembke
     */
    $functions.push("clear_database"); // Enable this function
    var clear_database = function ($in)
    {
        "use strict";

        const $default = {
            'step': 'step_start'
        };
        $in = _Default($default, $in);

        if ($in.step === 'step_start') {
            // @todo place this in storage_data_localforage
            indexedDB.deleteDatabase("localforage");
            indexedDB.deleteDatabase("keyval-store"); // idbkeyval
        }

        return {
            'answer': 'true',
            'message': 'Deleted database: localforage'
        };
    };

    /**
     * Our plugin_list will be sent to the server and the server will compare checksum with what it has.
     * Plugins with the same checksum will get the current timestamp.
     * Plugins with a different checksum is locally old and will get a week old timestamp.
     * The updated list are then saved. Then validate_cache will clean out the old plugins. Next time the plugin will
     * be used it must be requested from the server.
     * @version 2018-09-09
     * @since   2018-09-09
     * @author  Peter Lembke
     */
    $functions.push("refresh_plugins"); // Enable this function
    var refresh_plugins = function ($in)
    {
        "use strict";

        const $default = {
            'step': 'step_update_plugin_list'
        };
        $in = _Default($default, $in);

        if ($in.step === 'step_update_plugin_list') {
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_plugin',
                    'function': 'plugin_list'
                },
                'data': {},
                'data_back': {
                    'step': 'step_validate'
                }
            });
        }

        if ($in.step === 'step_validate') {
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_cache',
                    'function': 'validate_cache'
                },
                'data': {
                    'prefix': 'plugin'
                },
                'data_back': {
                    'step': 'step_end'
                }
            });
        }

        return {
            'answer': 'true',
            'message': 'Done updating plugins locally'
        };
    };

    /**
     * Reload the page when the ban time have expired
     * @version 2018-09-09
     * @since   2018-09-09
     * @author  Peter Lembke
     */
    $functions.push("reload_page"); // Enable this function
    var reload_page = function ($in)
    {
        "use strict";

        const $default = {
            'step': 'step_start'
        };
        $in = _Default($default, $in);

        if ($in.step === 'step_start') {
            return _SubCall({
                'to': {
                    'node': 'server',
                    'plugin': 'infohub_dummy',
                    'function': 'reload_page'
                },
                'data': {},
                'data_back': {
                    'step': 'step_end'
                }
            });
        }

        return {
            'answer': 'true',
            'message': 'When the ban time is over, then infohub_transfer will reload the page'
        };
    };

    /**
     * Refresh all plugins in cache and reload the page
     * @version 2018-09-09
     * @since   2018-09-09
     * @author  Peter Lembke
     */
    $functions.push("refresh_plugins_and_reload_page"); // Enable this function
    var refresh_plugins_and_reload_page = function ($in)
    {
        "use strict";

        const $default = {
            'step': 'step_start'
        };
        $in = _Default($default, $in);

        if ($in.step === 'step_start') {
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_plugin',
                    'function': 'plugin_list'
                },
                'data': {},
                'data_back': {
                    'step': 'step_update_plugins'
                }
            });
        }

        if ($in.step === 'step_update_plugins') {
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_plugin',
                    'function': 'plugin_list'
                },
                'data': {},
                'data_back': {
                    'step': 'step_reload_page'
                }
            });
        }

        if ($in.step === 'step_reload_page') {
            return _SubCall({
                'to': {
                    'node': 'server',
                    'plugin': 'infohub_dummy',
                    'function': 'reload_page'
                },
                'data': {},
                'data_back': {
                    'step': 'step_end'
                }
            });
        }

        return {
            'answer': 'true',
            'message': 'When the ban time is over, then infohub_transfer will clear local storage and reload the page'
        };
    };

    /**
     * Reload the page when the ban time have expired
     * @version 2018-09-09
     * @since   2018-09-09
     * @author  Peter Lembke
     */
    $functions.push("clear_storage_and_reload_page"); // Enable this function
    var clear_storage_and_reload_page = function ($in)
    {
        "use strict";

        const $default = {
            'step': 'step_start'
        };
        $in = _Default($default, $in);

        if ($in.step === 'step_start')
        {
            return _SubCall({
                'to': {
                    'node': 'server',
                    'plugin': 'infohub_dummy',
                    'function': 'clear_storage_and_reload_page'
                },
                'data': {},
                'data_back': {
                    'step': 'step_end'
                }
            });
        }

        return {
            'answer': 'true',
            'message': 'When the ban time is over, then infohub_transfer will clear local storage and reload the page'
        };
    };

    /**
     *
     * @version 2018-09-09
     * @since   2018-09-09
     * @author  Peter Lembke
     */
    $functions.push("set_cold_start_and_reload_page"); // Enable this function
    var set_cold_start_and_reload_page = function ($in)
    {
        "use strict";

        const $default = {
            'step': 'step_start'
        };
        $in = _Default($default, $in);

        if ($in.step === 'step_start')
        {
            return _SubCall({
                'to': {
                    'node': 'server',
                    'plugin': 'infohub_dummy',
                    'function': 'set_cold_start_and_reload_page'
                },
                'data': {},
                'data_back': {
                    'step': 'step_end'
                }
            });
        }

        return {
            'answer': 'true',
            'message': 'Have set cold_start = 2 in localStorage. When the ban time is over then infohub_transfer will reload the page'
        };
    };

    /**
     * Subscribe to keyboard combinations
     * @version 2018-10-14
     * @since   2018-10-14
     * @author  Peter Lembke
     */
    $functions.push("keyboard_subscribe"); // Enable this function
    var keyboard_subscribe = function ($in)
    {
        "use strict";

        const $default = {
            'step': 'step_start'
        };
        $in = _Default($default, $in);

        if ($in.step === 'step_start')
        {
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_keyboard',
                    'function': 'subscribe'
                },
                'data': {
                    'subscriptions': {
                        'shift_alt_ctrl_49': { // 49 = "1"
                            'to': {
                                'node': 'client',
                                'plugin': 'infohub_debug',
                                'function': 'reload_page'
                            }
                        },
                        'shift_alt_ctrl_50': { // 50 = "2"
                            'to': {
                                'node': 'client',
                                'plugin': 'infohub_debug',
                                'function': 'refresh_plugins_and_reload_page'
                            }
                        },
                        'shift_alt_ctrl_51': { // 51 = "3"
                            'to': {
                                'node': 'client',
                                'plugin': 'infohub_debug',
                                'function': 'clear_storage_and_reload_page'
                            }
                        },
                        'shift_alt_ctrl_52': { // 52 = "4"
                            'to': {
                                'node': 'client',
                                'plugin': 'infohub_debug',
                                'function': 'set_cold_start_and_reload_page'
                            }
                        }
                    }
                },
                'data_back': {
                    'step': 'step_end'
                }
            });
        }

        return {
            'answer': 'true',
            'message': 'When the ban time is over, then infohub_transfer will clear local storage and reload the page'
        };
    };

    /**
     * Render the debug buttons. The events go to this plugin
     * @version 2018-09-09
     * @since   2018-09-09
     * @author  Peter Lembke
     */
    var internal_DebugButtons = function ($in)
    {
        "use strict";

        const $default = {};
        $in = _Default($default, $in);

        // Divide the creation in smaller parts
        const $parts = {
            'reload_page': {
                'plugin': 'infohub_renderform',
                'type': 'button',
                'mode': 'button',
                'button_label': _Translate('Reload page. shift alt ctrl 1'),
                'event_data': 'reload_page',
                'to_plugin': 'infohub_debug',
                'to_function': 'reload_page'
            },
            'refresh_plugins': {
                'plugin': 'infohub_renderform',
                'type': 'button',
                'mode': 'button',
                'button_label': _Translate('Clean out old plugins marked by the server. reload page. shift alt ctrl 2'),
                'event_data': 'refresh_plugins_and_reload_page',
                'to_plugin': 'infohub_debug',
                'to_function': 'refresh_plugins_and_reload_page'
            },
            'clear_plugins': {
                'plugin': 'infohub_renderform',
                'type': 'button',
                'mode': 'button',
                'button_label': _Translate('Clean out all local plugins, reload page. shift alt ctrl 3'),
                'event_data': 'clear_storage_and_reload_page',
                'to_plugin': 'infohub_debug',
                'to_function': 'clear_storage_and_reload_page'
            },
            'cold_start': {
                'plugin': 'infohub_renderform',
                'type': 'button',
                'mode': 'button',
                'button_label': _Translate('Clean out all local data, reload page. shift alt ctrl 4'),
                'event_data': 'set_cold_start_and_reload_page',
                'to_plugin': 'infohub_debug',
                'to_function': 'set_cold_start_and_reload_page'
            }
        };

        return {
            'answer': 'true',
            'message': 'Here are the parts to build the presentation box',
            'data': $parts,
            'how': {
                'mode': 'one box',
                'text': '[reload_page][refresh_plugins][clear_plugins][cold_start]'
            },
            'where': {
                'mode': 'html'
            }
        };

    };

}
//# sourceURL=infohub_debug.js