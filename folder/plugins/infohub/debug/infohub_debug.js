/**
 * Render debug buttons. Can clean out plugins, databases, caches.
 *
 * Subscribes to the debug buttons and react on pressing them.
 * SHIFT + CTRL + ALT +
 * 1 - reload_page
 * 2 - refresh_plugins_and_reload_page
 * 3 - clear_storage_and_reload_page
 * 4 - set_cold_start_and_reload_page
 * 9 - delete_render_cache_for_user_name
 * 0 - logout
 *
 * @author      Peter Lembke <info@infohub.se>
 * @version     2018-09-09
 * @since       2018-09-09
 * @copyright   Copyright (c) 2018, Peter Lembke
 * @license     https://opensource.org/licenses/gpl-license.php GPL-3.0-or-later
 * @see         https://github.com/peterlembke/infohub/blob/master/folder/plugins/infohub/debug/infohub_debug.md Documentation
 * @link        https://infohub.se/ InfoHub main page
 */
function infohub_debug() {

    "use strict";

// include "infohub_base.js"

    const _Version = function() {
        return {
            'date': '2018-09-09',
            'since': '2018-09-09',
            'version': '1.0.0',
            'checksum': '{{checksum}}',
            'class_name': 'infohub_debug',
            'note': 'Tool for clearing caches and refresh the page when the ban time says ok',
            'status': 'normal',
            'SPDX-License-Identifier': 'GPL-3.0-or-later',
            'user_role': 'developer',
            'web_worker': 'true',
            'core_plugin': 'false'
        };
    };

    const _GetCmdFunctions = function() {
        const $list = {
            'setup_gui': 'normal',
            'create': 'normal',
            'clear_plugins': 'normal',
            'refresh_plugins': 'normal',
            'reload_page': 'normal',
            'clear_storage_and_reload_page': 'normal',
            'refresh_plugins_and_reload_page': 'normal',
            'set_cold_start_and_reload_page': 'normal',
            'event_message': 'normal'
        };

        return _GetCmdFunctionsBase($list);
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
    const _GetFuncName = function($text)
    {
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

    let $classTranslations = {};

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
    const setup_gui = function ($in)
    {
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
                            'type': 'debug_buttons',
                            'alias': '1202_debug_buttons-1202'
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
                    },
                    'cache_key': 'debugbuttons'
                },
                'data_back': {
                    'box_id': $in.box_id,
                    'step': 'step_end'
                }
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
    const create = function ($in)
    {
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
                    'alias': $in.alias,
                    'original_alias': $in.original_alias,
                    'step': 'step_final'
                }
            });
        }

        if ($in.step === 'step_final') {
            if (_Empty($in.alias) === 'false') {
                // All IDs become unique by inserting the parent alias in each ID.
                const $boxId = '{box_id}';
                const $find = "'" + $boxId;
                const $replace = "'" + $boxId + '_' + $in.alias + '-' + $boxId;
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
    const clear_plugins = function ($in)
    {
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
    const clear_database = function ($in)
    {
        const $default = {
            'step': 'step_start'
        };
        $in = _Default($default, $in);

        if ($in.step === 'step_start') {
            // This code should logically be placed in storage_data_localforage
            // but we use this code when we have a problem with Infohub.
            // Nothing says we have a working infohub that can reach that plugin.
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
    const refresh_plugins = function ($in)
    {
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
    const reload_page = function ($in)
    {
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
    const refresh_plugins_and_reload_page = function ($in)
    {
        const $default = {
            'step': 'step_update_plugins',
            'response': {},
            'data_back': {
                'plugins_old': []
            }
        };
        $in = _Default($default, $in);

        if ($in.step === 'step_update_plugins') {
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_plugin',
                    'function': 'plugin_list'
                },
                'data': {},
                'data_back': {
                    'step': 'step_update_plugins_response'
                }
            });
        }

        if ($in.step === 'step_update_plugins_response')
        {
            const $default = {
                'answer': 'false',
                'message': '',
                'plugins_old': []
            };
            $in.response = _Default($default, $in.response);

            $in.step = 'step_end';
            if ($in.response.plugins_old.length > 0) {
                $in.step = 'step_delete_render_cache';
            }
        }

        if ($in.step === 'step_delete_render_cache') {
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_render',
                    'function': 'delete_render_cache_for_user_name_specific_plugins'
                },
                'data': {
                    'plugins': $in.response.plugins_old
                },
                'data_back': {
                    'plugins_old': $in.response.plugins_old,
                    'step': 'step_delete_plugins'
                }
            });
        }

        if ($in.step === 'step_delete_plugins')
        {
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_cache',
                    'function': 'remove_data_from_cache_by_prefix_and_keys'
                },
                'data': {
                    'prefix': 'plugin',
                    'keys': $in.data_back.plugins_old,
                },
                'data_back': {
                    'plugins_old': $in.data_back.plugins_old,
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
    const clear_storage_and_reload_page = function ($in)
    {
        const $default = {
            'step': 'step_delete_cache'
        };
        $in = _Default($default, $in);

        if ($in.step === 'step_delete_cache') {
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_render',
                    'function': 'delete_render_cache_for_user_name'
                },
                'data': {},
                'data_back': {
                    'step': 'step_clear_storage'
                }
            });
        }

        if ($in.step === 'step_clear_storage') {
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
    const set_cold_start_and_reload_page = function ($in)
    {
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
    const keyboard_subscribe = function ($in)
    {
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
                        },
                        'shift_alt_ctrl_57': { // 57 = "9"
                            'client|infohub_login': {
                                'to': {
                                    'node': 'client',
                                    'plugin': 'infohub_render',
                                    'function': 'delete_render_cache_for_user_name'
                                }
                            }
                        },
                        'shift_alt_ctrl_48': { // 48 = "0"
                            'client|infohub_login': {
                                'to': {
                                    'node': 'client',
                                    'plugin': 'infohub_login',
                                    'function': 'logout'
                                }
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
    const internal_DebugButtons = function ($in)
    {
        const $default = {};
        $in = _Default($default, $in);

        const $cssLink = 'color: rgba(68, 69, 166, 0.89); padding:4px; display:inline-flex; border-width:1 px;';
        const $cssSvg = 'width: 80px; padding: 4px;';

        // Divide the creation in smaller parts
        const $parts = {
            'buttons_icon': {
                'type': 'common',
                'subtype': 'svg',
                'data': '[buttons_asset]',
                'class': 'svg',
                'css_data': {
                    '.svg': 'max-width: 220px; padding: 4px;'
                }
            },
            'buttons_asset': {
                'plugin': 'infohub_asset',
                'type': 'icon',
                'asset_name': 'buttons',
                'plugin_name': 'infohub_debug'
            },
            'reload_page_link': {
                'type': 'link',
                'subtype': 'link',
                'data': 'reload_page',
                'show': '[reload_page_icon][reload_page_text]',
                'event_data': 'reload_page',
                'to_plugin': 'infohub_debug',
                'to_function': 'reload_page',
                'class': 'my-link',
                'css_data': {
                    '.my-link': $cssLink
                }
            },
            'reload_page_icon': {
                'type': 'common',
                'subtype': 'svg',
                'data': '[reload_page_asset]',
                'class': 'svg',
                'css_data': {
                    '.svg': $cssSvg
                }
            },
            'reload_page_asset': {
                'plugin': 'infohub_asset',
                'type': 'icon',
                'asset_name': '1',
                'plugin_name': 'infohub_debug'
            },
            'reload_page_text': {
                'type': 'text',
                'text': _Translate('Reload page. shift alt ctrl 1')
            },
            'refresh_page_link': {
                'type': 'link',
                'subtype': 'link',
                'data': 'refresh_page',
                'show': '[refresh_page_icon][refresh_page_text]',
                'event_data': 'refresh_plugins_and_reload_page',
                'to_plugin': 'infohub_debug',
                'to_function': 'refresh_plugins_and_reload_page',
                'class': 'my-link',
                'css_data': {
                    '.my-link': $cssLink
                }
            },
            'refresh_page_icon': {
                'type': 'common',
                'subtype': 'svg',
                'data': '[refresh_page_asset]',
                'class': 'svg',
                'css_data': {
                    '.svg': $cssSvg
                }
            },
            'refresh_page_asset': {
                'plugin': 'infohub_asset',
                'type': 'icon',
                'asset_name': '2',
                'plugin_name': 'infohub_debug'
            },
            'refresh_page_text': {
                'type': 'text',
                'text': _Translate('Clean out old plugins marked by the server. reload page. shift alt ctrl 2')
            },
            'clear_plugins_link': {
                'type': 'link',
                'subtype': 'link',
                'data': 'refresh_page',
                'show': '[clear_plugins_icon][clear_plugins_text]',
                'event_data': 'clear_storage_and_reload_page',
                'to_plugin': 'infohub_debug',
                'to_function': 'clear_storage_and_reload_page',
                'class': 'my-link',
                'css_data': {
                    '.my-link': $cssLink
                }
            },
            'clear_plugins_icon': {
                'type': 'common',
                'subtype': 'svg',
                'data': '[clear_plugins_asset]',
                'class': 'svg',
                'css_data': {
                    '.svg': $cssSvg
                }
            },
            'clear_plugins_asset': {
                'plugin': 'infohub_asset',
                'type': 'icon',
                'asset_name': '3',
                'plugin_name': 'infohub_debug'
            },
            'clear_plugins_text': {
                'type': 'text',
                'text': _Translate('Clean out all local plugins, reload page. shift alt ctrl 3')
            },
            'cold_start_link': {
                'type': 'link',
                'subtype': 'link',
                'data': 'cold_start',
                'show': '[cold_start_icon][cold_start_text]',
                'event_data': 'set_cold_start_and_reload_page',
                'to_plugin': 'infohub_debug',
                'to_function': 'set_cold_start_and_reload_page',
                'class': 'my-link',
                'css_data': {
                    '.my-link': $cssLink
                }
            },
            'cold_start_icon': {
                'type': 'common',
                'subtype': 'svg',
                'data': '[cold_start_asset]',
                'class': 'svg',
                'css_data': {
                    '.svg': $cssSvg
                }
            },
            'cold_start_asset': {
                'plugin': 'infohub_asset',
                'type': 'icon',
                'asset_name': '4',
                'plugin_name': 'infohub_debug'
            },
            'cold_start_text': {
                'type': 'text',
                'text': _Translate('Clean out all local data, reload page. shift alt ctrl 4')
            },
            'instructions_text': {
                'type': 'text',
                'text': '[h1]' + _Translate('Instructions') + '[/h1][instructions_text_body]'
            },
            'instructions_text_body': {
                'type': 'text',
                'text': _Translate('Click on an option or use the keyboard. These keys always works wherever you are in Infohub.')
            },
            'information_text': {
                'type': 'text',
                'text': '[h1]' + _Translate('Information') + '[/h1][information_text_3][information_text_4]'
            },
            'information_text_3': {
                'type': 'text',
                'text': _Translate('[b]#3[/b] is also at the bottom of the Launcher screen as a button in case you can not start Debug and have no keyboard on your device.')
            },
            'information_text_4': {
                'type': 'text',
                'text': _Translate('[b]#4[/b] is the only option that also remove icons and translations and settings from the local storage.')
            },
            'clear_render_cache_link': {
                'type': 'link',
                'subtype': 'link',
                'data': 'clear_render_cache',
                'show': '[clear_render_cache_icon][clear_render_cache_text]',
                'event_data': '',
                'to_plugin': 'infohub_render',
                'to_function': 'delete_render_cache_for_user_name',
                'class': 'my-link',
                'css_data': {
                    '.my-link': $cssLink
                }
            },
            'clear_render_cache_text': {
                'type': 'text',
                'text': _Translate('Silently delete the render cache for the logged in user')
            },
            'clear_render_cache_icon': {
                'type': 'common',
                'subtype': 'svg',
                'data': '[clear_render_cache_asset]',
                'class': 'svg',
                'css_data': {
                    '.svg': $cssSvg
                }
            },
            'clear_render_cache_asset': {
                'plugin': 'infohub_asset',
                'type': 'icon',
                'asset_name': '9',
                'plugin_name': 'infohub_debug'
            },
            'logout_link': {
                'type': 'link',
                'subtype': 'link',
                'data': 'clear_render_cache',
                'show': '[logout_icon][logout_text]',
                'event_data': '',
                'to_plugin': 'infohub_login',
                'to_function': 'logout',
                'class': 'my-link',
                'css_data': {
                    '.my-link': $cssLink
                }
            },
            'logout_text': {
                'type': 'text',
                'text': _Translate('Logs you out and refresh the page')
            },
            'logout_icon': {
                'type': 'common',
                'subtype': 'svg',
                'data': '[logout_asset]',
                'class': 'svg',
                'css_data': {
                    '.svg': $cssSvg
                }
            },
            'logout_asset': {
                'plugin': 'infohub_asset',
                'type': 'icon',
                'asset_name': '0',
                'plugin_name': 'infohub_debug'
            },
        };

        return {
            'answer': 'true',
            'message': 'Here are the parts to build the presentation box',
            'data': $parts,
            'how': {
                'mode': 'one box',
                'text': '[buttons_icon][reload_page_link][refresh_page_link][clear_plugins_link][cold_start_link][clear_render_cache_link][logout_link][instructions_text][information_text]'
            },
            'where': {
                'mode': 'html'
            }
        };

    };

    /**
     * Event message comes from links
     * @version 2020-03-07
     * @since   2020-03-07
     * @author  Peter Lembke
     */
    $functions.push("event_message");
    const event_message = function ($in)
    {
        const $default = {
            'event_data': '',
            'step': 'step_start'
        };
        $in = _Default($default, $in);

        if ($in.step === 'step_start')
        {
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_debug',
                    'function': $in.event_data
                },
                'data': {},
                'data_back': {
                    'step': 'step_end'
                }
            });
        }

        return {
            'answer': 'true',
            'message': 'Handled the event_message'
        };
    };

}
//# sourceURL=infohub_debug.js