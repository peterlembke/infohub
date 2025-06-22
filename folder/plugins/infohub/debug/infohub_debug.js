/**
 * infohub_debug
 * Tool for clearing caches and refresh the page when the ban time says ok
 *
 * @package     Infohub
 * @subpackage  infohub_debug
 * @since       2018-09-09
 * @author      Peter Lembke <info@infohub.se>
 * @license     GPL-3.0-or-later
 * @copyright   Copyright (C) 2010- Peter Lembke
 */
function infohub_debug() {

    'use strict';

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
            'core_plugin': 'false',
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
            'delete_render_cache_for_user_name_and_reload_page': 'normal',
            'event_message': 'normal',
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
    const _GetFuncName = function($text) {
        let $response = '';
        const $parts = $text.split('_');

        for (let $key in $parts) {
            if ($parts.hasOwnProperty($key) === false) {
                continue;
            }
            $response = $response + $parts[$key].charAt(0).toUpperCase() +
                $parts[$key].substring(1);
        }

        return $response;
    };

    let $classTranslations = {};

    // *****************************************************************************
    // * Functions you only can reach with CMD()
    // * Observe function names are lower_case
    // *****************************************************************************

    /**
     * Set up the Config Graphical User Interface
     * @version 2018-09-09
     * @since   2018-09-09
     * @author  Peter Lembke
     */
    $functions.push('setup_gui');
    const setup_gui = function($in = {}) {
        const $default = {
            'box_id': '',
            'step': 'step_get_translations',
        };
        $in = _Merge($default, $in);

        if ($in.step === 'step_get_translations') {
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_translate',
                    'function': 'get_translate_data',
                },
                'data': {},
                'data_back': {
                    'box_id': $in.box_id,
                    'step': 'step_get_translations_response',
                },
            });
        }

        if ($in.step === 'step_get_translations_response') {
            $classTranslations = _ByVal($in.response.data);
            $in.step = 'step_start';
        }

        if ($in.step === 'step_start') {
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_render',
                    'function': 'create',
                },
                'data': {
                    'what': {
                        'debug_buttons': {
                            'plugin': 'infohub_debug',
                            'type': 'debug_buttons',
                            'alias': '1202_debug_buttons-1202',
                        }
                    },
                    'how': {
                        'mode': 'one box',
                        'text': '[debug_buttons]',
                    },
                    'where': {
                        'box_id': $in.box_id,
                        'max_width': 320,
                        'scroll_to_box_id': 'true',
                    },
                    'cache_key': 'debugbuttons',
                },
                'data_back': {
                    'box_id': $in.box_id,
                    'step': 'step_end',
                },
            });
        }

        return {
            'answer': 'true',
            'message': 'plugin GUI is done',
        };

    };

    /**
     * Get instructions and create the message to InfoHub View
     * @version 2013-04-15
     * @since   2013-04-15
     * @author  Peter Lembke
     */
    $functions.push('create'); // Enable this function
    const create = function($in = {}) {
        const $default = {
            'item_index': {},
            'config': {},
            'data_back': {
                'item_name': '',
                'item_index_done': {},
            },
            'response': {},
            'step': 'step_create',
        };
        $in = _Default($default, $in);

        if ($in.step === 'step_create_response') {
            const $defaultResponse = {
                'answer': 'false',
                'message': '',
                'html': '',
                'css_data': {},
                'display': '',
            };
            $in.response = _Default($defaultResponse, $in.response);
            const $itemName = $in.data_back.item_name;
            $in.data_back.item_index_done[$itemName] = $in.response;
            $in.step = 'step_create';
        }

        if ($in.step === 'step_create') {
            if (_Count($in.item_index) > 0) {
                const $itemData = _Pop($in.item_index);
                const $itemName = $itemData.key;
                let $data = $itemData.data;
                $in.item_index = $itemData.object;

                const $defaultItem = {
                    'type': '',
                    'alias': '',
                    'original_alias': '',
                    'css_data': {},
                };
                $data = _Default($defaultItem, $data);

                $data.func = _GetFuncName($data.type);
                $data.config = $in.config;

                let $response = internal_Cmd($data);

                return _SubCall({
                    'to': {
                        'node': 'client',
                        'plugin': 'infohub_render',
                        'function': 'create',
                    },
                    'data': {
                        'what': $response.data,
                        'how': $response.how,
                        'where': $response.where,
                        'alias': $data.alias,
                        'css_data': $response.css_data,
                    },
                    'data_back': {
                        'item_index': $in.item_index,
                        'item_name': $itemName,
                        'item_index_done': $in.data_back.item_index_done,
                        'step': 'step_create_response',
                    },
                });
            }
            $in.step = 'step_end';
        }

        return {
            'answer': $in.answer,
            'message': $in.message,
            'item_index': $in.data_back.item_index_done,
        };
    };

    /**
     * Remove all plugins from the local storage
     * @version 2018-09-09
     * @since   2018-09-09
     * @author  Peter Lembke
     */
    $functions.push('clear_plugins'); // Enable this function
    const clear_plugins = function($in = {}) {
        const $default = {
            'step': 'step_start',
        };
        $in = _Default($default, $in);

        if ($in.step === 'step_start') {
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_cache',
                    'function': 'remove_data_from_cache_by_prefix',
                },
                'data': {
                    'prefix': 'plugin',
                },
                'data_back': {
                    'step': 'step_end',
                },
            });
        }

        return {
            'answer': $in.answer,
            'message': $in.message,
        };
    };

    /**
     * Remove all local databases
     * @version 2018-09-09
     * @since   2018-09-09
     * @author  Peter Lembke
     */
    $functions.push('clear_database'); // Enable this function
    const clear_database = function($in = {}) {
        const $default = {
            'step': 'step_start',
        };
        $in = _Default($default, $in);

        if ($in.step === 'step_start') {
            // This code should logically be placed in storage_data_localforage,
            // but we use this code when we have a problem with Infohub.
            // Nothing says we have a working infohub that can reach that plugin.
            indexedDB.deleteDatabase('localforage');
            indexedDB.deleteDatabase('keyval-store'); // idbkeyval
        }

        return {
            'answer': 'true',
            'message': 'Deleted database: localforage',
        };
    };

    /**
     * Our plugin_list will be sent to the server and the server will compare checksum with what it has.
     * Plugins with the same checksum will get the current timestamp.
     * Plugins with a different checksum is locally old and will get a week-old timestamp.
     * The updated list are then saved. Then validate_cache will clean out the old plugins. Next time the plugin will
     * be used it must be requested from the server.
     * @version 2018-09-09
     * @since   2018-09-09
     * @author  Peter Lembke
     */
    $functions.push('refresh_plugins'); // Enable this function
    const refresh_plugins = function($in = {}) {
        const $default = {
            'step': 'step_update_plugin_list',
        };
        $in = _Default($default, $in);

        if ($in.step === 'step_update_plugin_list') {
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_plugin',
                    'function': 'plugin_list',
                },
                'data': {},
                'data_back': {
                    'step': 'step_validate',
                },
            });
        }

        if ($in.step === 'step_validate') {
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_cache',
                    'function': 'validate_cache',
                },
                'data': {
                    'prefix': 'plugin',
                },
                'data_back': {
                    'step': 'step_end',
                },
            });
        }

        return {
            'answer': 'true',
            'message': 'Done updating plugins locally',
        };
    };

    /**
     * Reload the page when the ban time have expired
     * @version 2018-09-09
     * @since   2018-09-09
     * @author  Peter Lembke
     */
    $functions.push('reload_page'); // Enable this function
    const reload_page = function($in = {}) {
        const $default = {
            'step': 'step_start',
        };
        $in = _Default($default, $in);

        if ($in.step === 'step_start') {
            return _SubCall({
                'to': {
                    'node': 'server',
                    'plugin': 'infohub_dummy',
                    'function': 'reload_page',
                },
                'data': {},
                'data_back': {
                    'step': 'step_end',
                }
            });
        }

        return {
            'answer': 'true',
            'message': 'When the ban time is over, then infohub_transfer will reload the page',
        };
    };

    /**
     * Update local plugins and refresh the page.
     * Ask server for a plugin list with checksums.
     * Clear plugin cache and render cache for changed plugins.
     * Reload the page regardless of any changes.
     * @version 2020-12-25
     * @since   2018-09-09
     * @author  Peter Lembke
     */
    $functions.push('refresh_plugins_and_reload_page'); // Enable this function
    const refresh_plugins_and_reload_page = function($in = {}) {
        const $default = {
            'step': 'step_update_plugins',
            'response': {},
            'data_back': {
                'plugins_old': [],
            },
        };
        $in = _Default($default, $in);

        if ($in.step === 'step_update_plugins') {
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_plugin',
                    'function': 'plugin_list',
                },
                'data': {},
                'data_back': {
                    'step': 'step_update_plugins_response',
                },
            });
        }

        if ($in.step === 'step_update_plugins_response') {
            const $default = {
                'answer': 'false',
                'message': '',
                'plugins_old': [],
            };
            $in.response = _Default($default, $in.response);

            $in.step = 'step_reload_page';
            if ($in.response.plugins_old.length > 0) {
                $in.step = 'step_delete_render_cache';
            }
        }

        if ($in.step === 'step_delete_render_cache') {
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_render',
                    'function': 'delete_render_cache_for_user_name_specific_plugins',
                },
                'data': {
                    'plugins': $in.response.plugins_old,
                },
                'data_back': {
                    'plugins_old': $in.response.plugins_old,
                    'step': 'step_delete_plugins',
                },
            });
        }

        if ($in.step === 'step_delete_plugins') {
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_cache',
                    'function': 'remove_data_from_cache_by_prefix_and_keys',
                },
                'data': {
                    'prefix': 'plugin',
                    'keys': $in.data_back.plugins_old,
                },
                'data_back': {
                    'plugins_old': $in.data_back.plugins_old,
                    'step': 'step_reload_page',
                },
            });
        }

        if ($in.step === 'step_reload_page') {
            return _SubCall({
                'to': {
                    'node': 'server',
                    'plugin': 'infohub_dummy',
                    'function': 'reload_page',
                },
                'data': {},
                'data_back': {
                    'step': 'step_end',
                },
            });
        }

        return {
            'answer': 'true',
            'message': 'When the ban time is over, then infohub_transfer will clear local storage and reload the page',
        };
    };

    /**
     * Reload the page when the ban time have expired
     * @version 2018-09-09
     * @since   2018-09-09
     * @author  Peter Lembke
     */
    $functions.push('clear_storage_and_reload_page'); // Enable this function
    const clear_storage_and_reload_page = function($in = {}) {
        const $default = {
            'step': 'step_delete_cache',
        };
        $in = _Default($default, $in);

        if ($in.step === 'step_delete_cache') {
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_render',
                    'function': 'delete_render_cache_for_user_name',
                },
                'data': {},
                'data_back': {
                    'step': 'step_clear_storage',
                },
            });
        }

        if ($in.step === 'step_clear_storage') {
            return _SubCall({
                'to': {
                    'node': 'server',
                    'plugin': 'infohub_dummy',
                    'function': 'clear_storage_and_reload_page',
                },
                'data': {},
                'data_back': {
                    'step': 'step_end',
                },
            });
        }

        return {
            'answer': 'true',
            'message': 'When the ban time is over, then infohub_transfer will clear local storage and reload the page',
        };
    };

    /**
     *
     * @version 2018-09-09
     * @since   2018-09-09
     * @author  Peter Lembke
     */
    $functions.push('set_cold_start_and_reload_page'); // Enable this function
    const set_cold_start_and_reload_page = function($in = {}) {
        const $default = {
            'step': 'step_start',
        };
        $in = _Default($default, $in);

        if ($in.step === 'step_start') {
            return _SubCall({
                'to': {
                    'node': 'server',
                    'plugin': 'infohub_dummy',
                    'function': 'set_cold_start_and_reload_page',
                },
                'data': {},
                'data_back': {
                    'step': 'step_end',
                },
            });
        }

        return {
            'answer': 'true',
            'message': 'Have set cold_start = 2 in localStorage. When the ban time is over then infohub_transfer will reload the page',
        };
    };

    /**
     *
     * @version 2021-01-04
     * @since   2021-01-04
     * @author  Peter Lembke
     */
    $functions.push('delete_render_cache_for_user_name_and_reload_page'); // Enable this function
    const delete_render_cache_for_user_name_and_reload_page = function($in = {}) {
        const $default = {
            'response': {
                'answer': 'false',
                'message': '',
            },
            'step': 'step_delete_render_cache_for_user_name',
        };
        $in = _Default($default, $in);

        if ($in.step === 'step_delete_render_cache_for_user_name') {
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_render',
                    'function': 'delete_render_cache_for_user_name',
                },
                'data': {},
                'data_back': {
                    'step': 'step_delete_render_cache_for_user_name_response',
                },
            });
        }

        if ($in.step === 'step_delete_render_cache_for_user_name_response') {
            if ($in.response.answer === 'true') {
                $in.response.message = _Translate('DONE_CLEARING_CACHE');
                $in.step = 'step_reload_page';
            }
        }

        if ($in.step === 'step_reload_page') {
            return _SubCall({
                'to': {
                    'node': 'server',
                    'plugin': 'infohub_dummy',
                    'function': 'reload_page',
                },
                'data': {},
                'data_back': {
                    'step': 'step_reload_page_response',
                },
            });
        }

        if ($in.step === 'step_reload_page_response') {
            if ($in.response.answer === 'true') {
                $in.response.message = _Translate('DONE_REFRESHING_PAGE');
            }
        }

        return {
            'answer': $in.response.answer,
            'message': $in.response.message,
        };
    };

    /**
     * Subscribe to keyboard combinations
     * @version 2018-10-14
     * @since   2018-10-14
     * @author  Peter Lembke
     */
    $functions.push('keyboard_subscribe'); // Enable this function
    const keyboard_subscribe = function($in = {}) {
        const $default = {
            'step': 'step_start',
        };
        $in = _Default($default, $in);

        if ($in.step === 'step_start') {
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_keyboard',
                    'function': 'subscribe',
                },
                'data': {
                    'subscriptions': {
                        'shift_alt_ctrl_49': { // 49 = "1"
                            'to': {
                                'node': 'client',
                                'plugin': 'infohub_debug',
                                'function': 'reload_page',
                            },
                        },
                        'shift_alt_ctrl_50': { // 50 = "2"
                            'to': {
                                'node': 'client',
                                'plugin': 'infohub_debug',
                                'function': 'refresh_plugins_and_reload_page',
                            },
                        },
                        'shift_alt_ctrl_51': { // 51 = "3"
                            'to': {
                                'node': 'client',
                                'plugin': 'infohub_debug',
                                'function': 'clear_storage_and_reload_page',
                            },
                        },
                        'shift_alt_ctrl_52': { // 52 = "4"
                            'to': {
                                'node': 'client',
                                'plugin': 'infohub_debug',
                                'function': 'set_cold_start_and_reload_page',
                            },
                        },
                        'shift_alt_ctrl_57': { // 57 = "9"
                            'client|infohub_login': {
                                'to': {
                                    'node': 'client',
                                    'plugin': 'infohub_render',
                                    'function': 'delete_render_cache_for_user_name',
                                },
                            },
                        },
                        'shift_alt_ctrl_48': { // 48 = "0"
                            'client|infohub_login': {
                                'to': {
                                    'node': 'client',
                                    'plugin': 'infohub_login',
                                    'function': 'logout',
                                },
                            },
                        },
                    },
                },
                'data_back': {
                    'step': 'step_end',
                },
            });
        }

        return {
            'answer': 'true',
            'message': 'When the ban time is over, then infohub_transfer will clear local storage and reload the page',
        };
    };

    /**
     * Render the debug buttons. The events go to this plugin
     * @version 2018-09-09
     * @since   2018-09-09
     * @author  Peter Lembke
     */
    const internal_DebugButtons = function($in = {}) {

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
                    '.svg': 'max-width: 220px; padding: 4px;',
                },
            },
            'buttons_asset': {
                'plugin': 'infohub_asset',
                'type': 'icon',
                'asset_name': 'buttons',
                'plugin_name': 'infohub_debug',
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
                    '.my-link': $cssLink,
                },
            },
            'reload_page_icon': {
                'type': 'common',
                'subtype': 'svg',
                'data': '[reload_page_asset]',
                'class': 'svg',
                'css_data': {
                    '.svg': $cssSvg,
                },
            },
            'reload_page_asset': {
                'plugin': 'infohub_asset',
                'type': 'icon',
                'asset_name': '1',
                'plugin_name': 'infohub_debug',
            },
            'reload_page_text': {
                'type': 'text',
                'text': _Translate('RELOAD_PAGE.') + ' SHIFT ALT CTRL 1'
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
                    '.my-link': $cssLink,
                },
            },
            'refresh_page_icon': {
                'type': 'common',
                'subtype': 'svg',
                'data': '[refresh_page_asset]',
                'class': 'svg',
                'css_data': {
                    '.svg': $cssSvg,
                },
            },
            'refresh_page_asset': {
                'plugin': 'infohub_asset',
                'type': 'icon',
                'asset_name': '2',
                'plugin_name': 'infohub_debug',
            },
            'refresh_page_text': {
                'type': 'text',
                'text': _Translate('CLEAN_OUT_OLD_PLUGINS_MARKED_BY_THE_SERVER._RELOAD_PAGE.') + ' SHIFT ALT CTRL 2'
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
                    '.my-link': $cssLink,
                },
            },
            'clear_plugins_icon': {
                'type': 'common',
                'subtype': 'svg',
                'data': '[clear_plugins_asset]',
                'class': 'svg',
                'css_data': {
                    '.svg': $cssSvg,
                },
            },
            'clear_plugins_asset': {
                'plugin': 'infohub_asset',
                'type': 'icon',
                'asset_name': '3',
                'plugin_name': 'infohub_debug',
            },
            'clear_plugins_text': {
                'type': 'text',
                'text': _Translate('CLEAN_OUT_ALL_LOCAL_PLUGINS,_RELOAD_PAGE.') + 'SHIFT ALT CTRL 3'
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
                    '.my-link': $cssLink,
                },
            },
            'cold_start_icon': {
                'type': 'common',
                'subtype': 'svg',
                'data': '[cold_start_asset]',
                'class': 'svg',
                'css_data': {
                    '.svg': $cssSvg,
                },
            },
            'cold_start_asset': {
                'plugin': 'infohub_asset',
                'type': 'icon',
                'asset_name': '4',
                'plugin_name': 'infohub_debug',
            },
            'cold_start_text': {
                'type': 'text',
                'text': _Translate('CLEAN_OUT_ALL_LOCAL_DATA,_RELOAD_PAGE.') + ' SHIFT ALT CTRL 4'
            },
            'instructions_text': {
                'type': 'text',
                'text': '[h1]' + _Translate('INSTRUCTIONS') + '[/h1][instructions_text_body]'
            },
            'instructions_text_body': {
                'type': 'text',
                'text': _Translate('CLICK_ON_AN_OPTION_OR_USE_THE_KEYBOARD._THESE_KEYS_ALWAYS_WORKS_WHEREVER_YOU_ARE_IN_INFOHUB.')
            },
            'information_text': {
                'type': 'text',
                'text': '[h1]' + _Translate('INFORMATION') + '[/h1][information_text_3][information_text_4]'
            },
            'information_text_3': {
                'type': 'text',
                'text': '[b]#3[/b] ' + _Translate('IS_ALSO_AT_THE_BOTTOM_OF_THE_LAUNCHER_SCREEN_AS_A_BUTTON_IN_CASE_YOU_CAN_NOT_START_DEBUG_AND_HAVE_NO_KEYBOARD_ON_YOUR_DEVICE.')
            },
            'information_text_4': {
                'type': 'text',
                'text': '[b]#4[/b] ' + _Translate('IS_THE_ONLY_OPTION_THAT_ALSO_REMOVE_ICONS_AND_TRANSLATIONS_AND_SETTINGS_FROM_THE_LOCAL_STORAGE.')
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
                    '.my-link': $cssLink,
                },
            },
            'clear_render_cache_text': {
                'type': 'text',
                'text': _Translate('SILENTLY_DELETE_THE_RENDER_CACHE_FOR_THE_LOGGED_IN_USER')
            },
            'clear_render_cache_icon': {
                'type': 'common',
                'subtype': 'svg',
                'data': '[clear_render_cache_asset]',
                'class': 'svg',
                'css_data': {
                    '.svg': $cssSvg,
                },
            },
            'clear_render_cache_asset': {
                'plugin': 'infohub_asset',
                'type': 'icon',
                'asset_name': '9',
                'plugin_name': 'infohub_debug',
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
                    '.my-link': $cssLink,
                },
            },
            'logout_text': {
                'type': 'text',
                'text': _Translate('LOGS_YOU_OUT_AND_REFRESH_THE_PAGE')
            },
            'logout_icon': {
                'type': 'common',
                'subtype': 'svg',
                'data': '[logout_asset]',
                'class': 'svg',
                'css_data': {
                    '.svg': $cssSvg,
                },
            },
            'logout_asset': {
                'plugin': 'infohub_asset',
                'type': 'icon',
                'asset_name': '0',
                'plugin_name': 'infohub_debug',
            },
        };

        return {
            'answer': 'true',
            'message': 'Here are the parts to build the presentation box',
            'data': $parts,
            'how': {
                'mode': 'one box',
                'text': '[buttons_icon][reload_page_link][refresh_page_link][clear_plugins_link][cold_start_link][clear_render_cache_link][logout_link][instructions_text][information_text]',
            },
            'where': {
                'mode': 'html',
            },
        };

    };

    /**
     * Event message comes from links
     * @version 2020-03-07
     * @since   2020-03-07
     * @author  Peter Lembke
     */
    $functions.push('event_message');
    const event_message = function($in = {}) {
        const $default = {
            'event_data': '',
            'step': 'step_start',
        };
        $in = _Default($default, $in);

        if ($in.step === 'step_start') {
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_debug',
                    'function': $in.event_data,
                },
                'data': {},
                'data_back': {
                    'step': 'step_end',
                },
            });
        }

        return {
            'answer': 'true',
            'message': 'Handled the event_message',
        };
    };

}

//# sourceURL=infohub_debug.js