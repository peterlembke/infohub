/**
 * infohub_tree_backup
 * Backup your personal data to files
 *
 * @package     Infohub
 * @subpackage  infohub_tree_backup
 * @since       2020-07-25
 * @author      Peter Lembke <info@infohub.se>
 * @license     GPL-3.0-or-later
 * @copyright   Copyright (C) 2010- Peter Lembke
 * @see         https://github.com/peterlembke/infohub/blob/main/folder/plugins/infohub/tree/backup/infohub_tree_backup.md Documentation
 * @link        https://infohub.se/ InfoHub main page
 */
function infohub_tree_backup() {

    'use strict';

// include "infohub_base.js"

    const _Version = function() {
        return {
            'date': '2020-07-25',
            'since': '2020-07-25',
            'version': '1.0.0',
            'checksum': '{{checksum}}',
            'class_name': 'infohub_tree_backup',
            'note': 'Backup your personal data to files',
            'status': 'normal',
            'SPDX-License-Identifier': 'GPL-3.0-or-later',
        };
    };

    const _GetCmdFunctions = function() {
        const $list = {
            'create': 'normal',
            'click_button_backup_all': 'normal',
            'click_refresh_plugin_list_full': 'normal',
            'click_button_backup_full': 'normal',
            'click_refresh_plugin_list_partial': 'normal',
            'click_refresh_key_list_partial': 'normal',
            'click_button_backup_partial': 'normal',
        };

        return _GetCmdFunctionsBase($list);
    };

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

    // ***********************************************************
    // * your class functions below, only declare with var
    // * Can only be reached through cmd()
    // ***********************************************************

    /**
     * Get instructions and create the message to InfoHub View
     * @version 2019-03-13
     * @since   2016-10-16
     * @author  Peter Lembke
     */
    $functions.push('create');
    const create = function($in = {}) {
        const $default = {
            'subtype': 'menu',
            'parent_box_id': '',
            'translations': {},
            'step': 'step_render',
            'response': {
                'answer': 'false',
                'message': '',
            },
        };
        $in = _Default($default, $in);

        if ($in.step === 'step_render') {
            $classTranslations = $in.translations;
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_render',
                    'function': 'create',
                },
                'data': {
                    'what': {
                        'container_all': {
                            'type': 'common',
                            'subtype': 'container',
                            'tag': 'div',
                            'data': '[form_backup_all]',
                            'class': 'container-small',
                        },
                        'form_backup_all': {
                            'plugin': 'infohub_renderform',
                            'type': 'form',
                            'content': '[button_backup_all]',
                            'label': _Translate('BACKUP_ALL'),
                            'description': _Translate('FULL_BACKUP_OF_ALL_YOUR_DATA_YOU_HAVE_ON_THE_SERVER.') + ' ' + _Translate('YOU_GET_ONE_FILE_WITH_EVERYTHING.')
                        },
                        'button_backup_all': {
                            'plugin': 'infohub_renderform',
                            'type': 'button',
                            'mode': 'button',
                            'button_label': _Translate('BACKUP_EVERYTHING'),
                            'button_left_icon': '[backup_icon]',
                            'event_data': 'backup|button_backup_all',
                            'to_plugin': 'infohub_tree',
                            'to_function': 'click',
                        },
                        'container_full': {
                            'type': 'common',
                            'subtype': 'container',
                            'tag': 'div',
                            'data': '[form_backup_full]',
                            'class': 'container-small',
                        },
                        'form_backup_full': {
                            'plugin': 'infohub_renderform',
                            'type': 'form',
                            'content': '[button_refresh_plugin_list_full][plugin_list_full][button_backup_full]',
                            'label': _Translate('BACKUP_PLUGINS'),
                            'description': _Translate('BACKUP_OF_EACH_PLUGIN_SEPARATELY.') + ' ' + _Translate('YOU_GET_ONE_BACKUP_FILE_FOR_EACH_PLUGIN.')
                        },
                        'button_refresh_plugin_list_full': {
                            'plugin': 'infohub_renderform',
                            'type': 'button',
                            'mode': 'button',
                            'button_label': _Translate('REFRESH_PLUGIN_LIST'),
                            'button_left_icon': '[refresh_icon]',
                            'event_data': 'backup|refresh_plugin_list_full',
                            'to_plugin': 'infohub_tree',
                            'to_function': 'click',
                        },
                        'refresh_icon': {
                            'type': 'common',
                            'subtype': 'svg',
                            'data': '[refresh_asset]',
                        },
                        'refresh_asset': {
                            'plugin': 'infohub_asset',
                            'type': 'icon',
                            'asset_name': 'refresh',
                            'plugin_name': 'infohub_tree',
                        },
                        'plugin_list_full': {
                            'plugin': 'infohub_renderform',
                            'type': 'select',
                            "label": _Translate("PLUGIN_LIST"),
                            "description": _Translate("LIST_WITH_ALL_TREE_PLUGINS"),
                            "size": "22",
                            "multiple": "true",
                            'event_data': 'backup|plugin_list_full',
                            'to_plugin': 'infohub_tree',
                            'to_function': 'click',
                            'options': [],
                            'css_data': {
                                '.select': 'max-width: 200px;',
                            },
                        },
                        'button_backup_full': {
                            'plugin': 'infohub_renderform',
                            'type': 'button',
                            'mode': 'button',
                            'button_label': _Translate('BACKUP_SELECTED_PLUGINS'),
                            'button_left_icon': '[backup_icon]',
                            'event_data': 'backup|button_backup_full',
                            'to_plugin': 'infohub_tree',
                            'to_function': 'click',
                        },
                        'container_partial': {
                            'type': 'common',
                            'subtype': 'container',
                            'tag': 'div',
                            'data': '[form_backup_partial]',
                            'class': 'container-small',
                        },
                        'form_backup_partial': {
                            'plugin': 'infohub_renderform',
                            'type': 'form',
                            'content': '[container_plugins_partial][container_keys_partial]',
                            'label': _Translate('PARTIAL_BACKUP'),
                            'description': _Translate('PARTIAL_BACKUP.') + ' ' +
                                _Translate('SELECT_ONE_PLUGIN_AND_SELECT_KEYS_TO_BACKUP.') + ' ' +
                                _Translate('YOU_GET_ONE_BACKUP_FILE.')
                        },
                        'container_plugins_partial': {
                            'type': 'common',
                            'subtype': 'container',
                            'tag': 'div',
                            'data': '[button_refresh_plugin_list_partial][plugin_list_partial]',
                            'class': 'container-small',
                        },
                        'container_keys_partial': {
                            'type': 'common',
                            'subtype': 'container',
                            'tag': 'div',
                            'data': '[button_refresh_key_list_partial][key_list_partial][button_backup_partial]',
                            'class': 'container-small',
                        },
                        'button_refresh_plugin_list_partial': {
                            'plugin': 'infohub_renderform',
                            'type': 'button',
                            'mode': 'button',
                            'button_label': _Translate('REFRESH_PLUGIN_LIST'),
                            'button_left_icon': '[refresh_icon]',
                            'event_data': 'backup|refresh_plugin_list_partial',
                            'to_plugin': 'infohub_tree',
                            'to_function': 'click',
                        },
                        'plugin_list_partial': {
                            'plugin': 'infohub_renderform',
                            'type': 'select',
                            "label": _Translate("PLUGIN_LIST"),
                            "description": _Translate('LIST_WITH_ALL_TREE_PLUGINS.') + ' ' +
                                _Translate('SELECT_ONE'),
                            "size": "1",
                            "multiple": "false",
                            'event_data': 'backup|plugin_list_partial',
                            'to_plugin': 'infohub_tree',
                            'to_function': 'click',
                            'options': [],
                            'css_data': {
                                '.select': 'max-width: 200px;',
                            },
                        },
                        'button_refresh_key_list_partial': {
                            'plugin': 'infohub_renderform',
                            'type': 'button',
                            'mode': 'button',
                            'button_label': _Translate('REFRESH_KEY_LIST'),
                            'button_left_icon': '[refresh_icon]',
                            'event_data': 'backup|refresh_key_list_partial',
                            'to_plugin': 'infohub_tree',
                            'to_function': 'click',
                        },
                        'key_list_partial': {
                            'plugin': 'infohub_renderform',
                            'type': 'select',
                            "label": _Translate("KEYS"),
                            "description": _Translate('ALL_KEYS_FOR_THE_SELECTED_PLUGIN.') + ' ' +
                                _Translate('SELECT_THE_ONES_YOU_WANT_TO_BACKUP'),
                            "size": "20",
                            "multiple": "true",
                            'event_data': 'backup|key_list_partial',
                            'to_plugin': 'infohub_tree',
                            'to_function': 'click',
                            'options': [],
                            'css_data': {
                                '.select': 'max-width: 200px;',
                            },
                        },
                        'button_backup_partial': {
                            'plugin': 'infohub_renderform',
                            'type': 'button',
                            'mode': 'button',
                            'button_label': _Translate('BACKUP_SELECTED_KEYS'),
                            'button_left_icon': '[backup_icon]',
                            'event_data': 'backup|button_backup_partial',
                            'to_plugin': 'infohub_tree',
                            'to_function': 'click',
                        },
                        'backup_icon': {
                            'type': 'common',
                            'subtype': 'svg',
                            'data': '[backup_asset]',
                        },
                        'backup_asset': {
                            'plugin': 'infohub_asset',
                            'type': 'icon',
                            'asset_name': 'backup/export',
                            'plugin_name': 'infohub_tree',
                        },
                    },
                    'how': {
                        'mode': 'one box',
                        'text': '[container_all][container_full][container_partial]',
                    },
                    'where': {
                        'box_id': 'main.body.infohub_tree.form', // 'box_id': $in.parent_box_id + '.form',
                        'max_width': 100,
                        'scroll_to_box_id': 'true',
                    },
                    'cache_key': 'backup',
                },
                'data_back': {
                    'step': 'step_end',
                },
            });
        }

        return {
            'answer': $in.response.answer,
            'message': $in.response.message,
        };
    };

    /**
     * Backup all data to one file
     * We ask the server. The server put together the backup with data it has.
     * We get a gzip file with json data in it.
     * @version 2020-08-29
     * @since 2020-08-29
     * @author Peter Lembke
     */
    $functions.push('click_button_backup_all');
    const click_button_backup_all = function($in = {}) {
        const $default = {
            'step': 'step_call_server',
            'box_id': '',
            'response': {},
            'data_back': {},
        };
        $in = _Default($default, $in);

        let $out = {
            'answer': 'false',
            'message': 'Nothing to report from ' + _GetClassName() +
                ' -> click_button_backup_all',
        };

        if ($in.step === 'step_call_server') {
        }

        if ($in.step === 'step_call_server_response') {
        }

        return {
            'answer': $out.answer,
            'message': $out.message,
            'ok': $out.answer,
        };
    };

    /**
     * Refresh the plugin list with all Tree plugins
     * Displays the list we have locally and updates the list in the background
     * @version 2020-08-29
     * @since 2020-08-29
     * @author Peter Lembke
     */
    $functions.push('click_refresh_plugin_list_full');
    const click_refresh_plugin_list_full = function($in = {}) {
        const $default = {
            'step': 'step_call_server',
            'box_id': '',
            'response': {},
            'data_back': {},
        };
        $in = _Default($default, $in);

        let $out = {
            'answer': 'false',
            'message': 'Nothing to report from ' + _GetClassName() +
                ' -> click_button_backup_all',
        };

        if ($in.step === 'step_call_server') {
        }

        if ($in.step === 'step_call_server_response') {
        }

        return {
            'answer': $out.answer,
            'message': $out.message,
            'ok': $out.answer,
        };
    };

    /**
     * Backup each selected plugin to one file each.
     * We ask the server. The server put together the backup files with data it has.
     * We get zero or more gzip files with json data in them.
     * @version 2020-08-29
     * @since 2020-08-29
     * @author Peter Lembke
     */
    $functions.push('click_button_backup_full');
    const click_button_backup_full = function($in = {}) {
        const $default = {
            'step': 'step_call_server',
            'box_id': '',
            'response': {},
            'data_back': {},
        };
        $in = _Default($default, $in);

        let $out = {
            'answer': 'false',
            'message': 'Nothing to report from ' + _GetClassName() +
                ' -> click_button_backup_all',
        };

        if ($in.step === 'step_call_server') {
        }

        if ($in.step === 'step_call_server_response') {
        }

        return {
            'answer': $out.answer,
            'message': $out.message,
            'ok': $out.answer,
        };
    };

    /**
     * Refresh the plugin list with all Tree plugins
     * Displays the list we have locally and updates the list in the background
     * This is the same function as click_refresh_plugin_list_full but the destination
     * is different.
     * @version 2020-08-29
     * @since 2020-08-29
     * @author Peter Lembke
     */
    $functions.push('click_refresh_plugin_list_partial');
    const click_refresh_plugin_list_partial = function($in = {}) {
        const $default = {
            'step': 'step_call_server',
            'box_id': '',
            'response': {},
            'data_back': {},
        };
        $in = _Default($default, $in);

        let $out = {
            'answer': 'false',
            'message': 'Nothing to report from ' + _GetClassName() +
                ' -> click_button_backup_all',
        };

        if ($in.step === 'step_call_server') {
        }

        if ($in.step === 'step_call_server_response') {
        }

        return {
            'answer': $out.answer,
            'message': $out.message,
            'ok': $out.answer,
        };
    };

    /**
     * When you click on a plugin then this list will be updated.
     * Displays the list we have locally and updates the list in the background
     * @version 2020-08-29
     * @since 2020-08-29
     * @author Peter Lembke
     */
    $functions.push('click_refresh_key_list_partial');
    const click_refresh_key_list_partial = function($in = {}) {
        const $default = {
            'step': 'step_call_server',
            'box_id': '',
            'response': {},
            'data_back': {},
        };
        $in = _Default($default, $in);

        let $out = {
            'answer': 'false',
            'message': 'Nothing to report from ' + _GetClassName() +
                ' -> click_button_backup_all',
        };

        if ($in.step === 'step_call_server') {
        }

        if ($in.step === 'step_call_server_response') {
        }

        return {
            'answer': $out.answer,
            'message': $out.message,
            'ok': $out.answer,
        };
    };

    /**
     * Backup selected keys for a specific plugin. You get one file.
     * We ask the server. The server put together the backup file with data it has.
     * We get zero or one gzip file with json data.
     * @version 2020-08-29
     * @since 2020-08-29
     * @author Peter Lembke
     */
    $functions.push('click_button_backup_partial');
    const click_button_backup_partial = function($in = {}) {
        const $default = {
            'step': 'step_call_server',
            'box_id': '',
            'response': {},
            'data_back': {},
        };
        $in = _Default($default, $in);

        let $out = {
            'answer': 'false',
            'message': 'Nothing to report from ' + _GetClassName() +
                ' -> click_button_backup_all',
        };

        if ($in.step === 'step_call_server') {
        }

        if ($in.step === 'step_call_server_response') {
        }

        return {
            'answer': $out.answer,
            'message': $out.message,
            'ok': $out.answer,
        };
    };
}
//# sourceURL=infohub_tree_backup.js