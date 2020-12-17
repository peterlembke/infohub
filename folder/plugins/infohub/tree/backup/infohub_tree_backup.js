/**
 Copyright (C) 2010- Peter Lembke, CharZam soft
 the program is distributed under the terms of the GNU General Public License

 InfoHub is free software: you can redistribute it and/or modify
 it under the terms of the GNU General Public License as published by
 the Free Software Foundation, either version 3 of the License, or
 (at your option) any later version.

 InfoHub is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 GNU General Public License for more details.

 You should have received a copy of the GNU General Public License
 along with InfoHub.  If not, see <https://www.gnu.org/licenses/>.'
 */
function infohub_tree_backup() {

    "use strict";

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
            'SPDX-License-Identifier': 'GPL-3.0-or-later'
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
            'click_button_backup_partial': 'normal'
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

    // ***********************************************************
    // * your class functions below, only declare with var
    // * Can only be reached trough cmd()
    // ***********************************************************

    /**
     * Get instructions and create the message to InfoHub View
     * @version 2019-03-13
     * @since   2016-10-16
     * @author  Peter Lembke
     */
    $functions.push('create');
    const create = function ($in)
    {
        const $default = {
            'subtype': 'menu',
            'parent_box_id': '',
            'translations': {},
            'step': 'step_render',
            'response': {
                'answer': 'false',
                'message': ''
            }
        };
        $in = _Default($default, $in);

        if ($in.step === 'step_render') {
            $classTranslations = $in.translations;
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_render',
                    'function': 'create'
                },
                'data': {
                    'what': {
                        'container_all': {
                            'type': 'common',
                            'subtype': 'container',
                            'tag': 'div',
                            'data': '[form_backup_all]',
                            'class': 'container-small'
                        },
                        'form_backup_all': {
                            'plugin': 'infohub_renderform',
                            'type': 'form',
                            'content': '[button_backup_all]',
                            'label': _Translate('Backup all'),
                            'description': _Translate('Full backup of all your data you have on the server. You get one file with everything.')
                        },
                        'button_backup_all': {
                            'plugin': 'infohub_renderform',
                            'type': 'button',
                            'mode': 'button',
                            'button_label': _Translate('Backup everything'),
                            'button_left_icon': '[backup_icon]',
                            'event_data': 'backup|button_backup_all',
                            'to_plugin': 'infohub_tree',
                            'to_function': 'click'
                        },
                        'container_full': {
                            'type': 'common',
                            'subtype': 'container',
                            'tag': 'div',
                            'data': '[form_backup_full]',
                            'class': 'container-small'
                        },
                        'form_backup_full': {
                            'plugin': 'infohub_renderform',
                            'type': 'form',
                            'content': '[button_refresh_plugin_list_full][plugin_list_full][button_backup_full]',
                            'label': _Translate('Backup plugins'),
                            'description': _Translate('Backup of each plugin separately. You get one backup file for each plugin.')
                        },
                        'button_refresh_plugin_list_full': {
                            'plugin': 'infohub_renderform',
                            'type': 'button',
                            'mode': 'button',
                            'button_label': _Translate('Refresh plugin list'),
                            'button_left_icon': '[refresh_icon]',
                            'event_data': 'backup|refresh_plugin_list_full',
                            'to_plugin': 'infohub_tree',
                            'to_function': 'click'
                        },
                        'refresh_icon': {
                            'type': 'common',
                            'subtype': 'svg',
                            'data': '[refresh_asset]'
                        },
                        'refresh_asset': {
                            'plugin': 'infohub_asset',
                            'type': 'icon',
                            'asset_name': 'refresh',
                            'plugin_name': 'infohub_tree'
                        },
                        'plugin_list_full': {
                            'plugin': 'infohub_renderform',
                            'type': 'select',
                            "label": _Translate("Plugin list"),
                            "description": _Translate("List with all Tree plugins"),
                            "size": "22",
                            "multiple": "true",
                            'event_data': 'backup|plugin_list_full',
                            'to_plugin': 'infohub_tree',
                            'to_function': 'click',
                            "options": [],
                            'css_data': {
                                '.select': 'max-width: 200px;'
                            }
                        },
                        'button_backup_full': {
                            'plugin': 'infohub_renderform',
                            'type': 'button',
                            'mode': 'button',
                            'button_label': _Translate('Backup selected plugins'),
                            'button_left_icon': '[backup_icon]',
                            'event_data': 'backup|button_backup_full',
                            'to_plugin': 'infohub_tree',
                            'to_function': 'click'
                        },
                        'container_partial': {
                            'type': 'common',
                            'subtype': 'container',
                            'tag': 'div',
                            'data': '[form_backup_partial]',
                            'class': 'container-small'
                        },
                        'form_backup_partial': {
                            'plugin': 'infohub_renderform',
                            'type': 'form',
                            'content': '[container_plugins_partial][container_keys_partial]',
                            'label': _Translate('Partial backup'),
                            'description': _Translate('Partial backup. Select one plugin and select keys to backup. You get one backup file.')
                        },
                        'container_plugins_partial': {
                            'type': 'common',
                            'subtype': 'container',
                            'tag': 'div',
                            'data': '[button_refresh_plugin_list_partial][plugin_list_partial]',
                            'class': 'container-small'
                        },
                        'container_keys_partial': {
                            'type': 'common',
                            'subtype': 'container',
                            'tag': 'div',
                            'data': '[button_refresh_key_list_partial][key_list_partial][button_backup_partial]',
                            'class': 'container-small'
                        },
                        'button_refresh_plugin_list_partial': {
                            'plugin': 'infohub_renderform',
                            'type': 'button',
                            'mode': 'button',
                            'button_label': _Translate('Refresh plugin list'),
                            'button_left_icon': '[refresh_icon]',
                            'event_data': 'backup|refresh_plugin_list_partial',
                            'to_plugin': 'infohub_tree',
                            'to_function': 'click'
                        },
                        'plugin_list_partial': {
                            'plugin': 'infohub_renderform',
                            'type': 'select',
                            "label": _Translate("Plugin list"),
                            "description": _Translate("List with all Tree plugins. Select one"),
                            "size": "1",
                            "multiple": "false",
                            'event_data': 'backup|plugin_list_partial',
                            'to_plugin': 'infohub_tree',
                            'to_function': 'click',
                            "options": [],
                            'css_data': {
                                '.select': 'max-width: 200px;'
                            }
                        },
                        'button_refresh_key_list_partial': {
                            'plugin': 'infohub_renderform',
                            'type': 'button',
                            'mode': 'button',
                            'button_label': _Translate('Refresh key list'),
                            'button_left_icon': '[refresh_icon]',
                            'event_data': 'backup|refresh_key_list_partial',
                            'to_plugin': 'infohub_tree',
                            'to_function': 'click'
                        },
                        'key_list_partial': {
                            'plugin': 'infohub_renderform',
                            'type': 'select',
                            "label": _Translate("Keys"),
                            "description": _Translate("All keys for the selected plugin. Select the ones you want to backup"),
                            "size": "20",
                            "multiple": "true",
                            'event_data': 'backup|key_list_partial',
                            'to_plugin': 'infohub_tree',
                            'to_function': 'click',
                            "options": [],
                            'css_data': {
                                '.select': 'max-width: 200px;'
                            }
                        },
                        'button_backup_partial': {
                            'plugin': 'infohub_renderform',
                            'type': 'button',
                            'mode': 'button',
                            'button_label': _Translate('Backup selected keys'),
                            'button_left_icon': '[backup_icon]',
                            'event_data': 'backup|button_backup_partial',
                            'to_plugin': 'infohub_tree',
                            'to_function': 'click'
                        },
                        'backup_icon': {
                            'type': 'common',
                            'subtype': 'svg',
                            'data': '[backup_asset]'
                        },
                        'backup_asset': {
                            'plugin': 'infohub_asset',
                            'type': 'icon',
                            'asset_name': 'backup/export',
                            'plugin_name': 'infohub_tree'
                        },
                    },
                    'how': {
                        'mode': 'one box',
                        'text': '[container_all][container_full][container_partial]'
                    },
                    'where': {
                        'box_id': 'main.body.infohub_tree.form', // 'box_id': $in.parent_box_id + '.form',
                        'max_width': 100,
                        'scroll_to_box_id': 'true'
                    },
                    'cache_key': 'backup'
                },
                'data_back': {
                    'step': 'step_end'
                }
            });
        }

        return {
            'answer': $in.response.answer,
            'message': $in.response.message
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
    $functions.push("click_button_backup_all");
    const click_button_backup_all = function ($in)
    {
        const $default = {
            'step': 'step_call_server',
            'box_id': '',
            'response': {},
            'data_back': {}
        };
        $in = _Default($default, $in);

        let $out = {
            'answer': 'false',
            'message': 'Nothing to report from ' + _GetClassName() + ' -> click_button_backup_all'
        };

        if ($in.step === 'step_call_server') {
        }

        if ($in.step === 'step_call_server_response') {
        }

        return {
            'answer': $out.answer,
            'message': $out.message,
            'ok': $out.answer
        };
    };

    /**
     * Refresh the plugin list with all Tree plugins
     * Displays the list we have locally and updates the list in the background
     * @version 2020-08-29
     * @since 2020-08-29
     * @author Peter Lembke
     */
    $functions.push("click_refresh_plugin_list_full");
    const click_refresh_plugin_list_full = function ($in)
    {
        const $default = {
            'step': 'step_call_server',
            'box_id': '',
            'response': {},
            'data_back': {}
        };
        $in = _Default($default, $in);

        let $out = {
            'answer': 'false',
            'message': 'Nothing to report from ' + _GetClassName() + ' -> click_button_backup_all'
        };

        if ($in.step === 'step_call_server') {
        }

        if ($in.step === 'step_call_server_response') {
        }

        return {
            'answer': $out.answer,
            'message': $out.message,
            'ok': $out.answer
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
    $functions.push("click_button_backup_full");
    const click_button_backup_full = function ($in)
    {
        const $default = {
            'step': 'step_call_server',
            'box_id': '',
            'response': {},
            'data_back': {}
        };
        $in = _Default($default, $in);

        let $out = {
            'answer': 'false',
            'message': 'Nothing to report from ' + _GetClassName() + ' -> click_button_backup_all'
        };

        if ($in.step === 'step_call_server') {
        }

        if ($in.step === 'step_call_server_response') {
        }

        return {
            'answer': $out.answer,
            'message': $out.message,
            'ok': $out.answer
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
    $functions.push("click_refresh_plugin_list_partial");
    const click_refresh_plugin_list_partial = function ($in)
    {
        const $default = {
            'step': 'step_call_server',
            'box_id': '',
            'response': {},
            'data_back': {}
        };
        $in = _Default($default, $in);

        let $out = {
            'answer': 'false',
            'message': 'Nothing to report from ' + _GetClassName() + ' -> click_button_backup_all'
        };

        if ($in.step === 'step_call_server') {
        }

        if ($in.step === 'step_call_server_response') {
        }

        return {
            'answer': $out.answer,
            'message': $out.message,
            'ok': $out.answer
        };
    };

    /**
     * When you click on a plugin then this list will be updated.
     * Displays the list we have locally and updates the list in the background
     * @version 2020-08-29
     * @since 2020-08-29
     * @author Peter Lembke
     */
    $functions.push("click_refresh_key_list_partial");
    const click_refresh_key_list_partial = function ($in)
    {
        const $default = {
            'step': 'step_call_server',
            'box_id': '',
            'response': {},
            'data_back': {}
        };
        $in = _Default($default, $in);

        let $out = {
            'answer': 'false',
            'message': 'Nothing to report from ' + _GetClassName() + ' -> click_button_backup_all'
        };

        if ($in.step === 'step_call_server') {
        }

        if ($in.step === 'step_call_server_response') {
        }

        return {
            'answer': $out.answer,
            'message': $out.message,
            'ok': $out.answer
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
    $functions.push("click_button_backup_partial");
    const click_button_backup_partial = function ($in)
    {
        const $default = {
            'step': 'step_call_server',
            'box_id': '',
            'response': {},
            'data_back': {}
        };
        $in = _Default($default, $in);

        let $out = {
            'answer': 'false',
            'message': 'Nothing to report from ' + _GetClassName() + ' -> click_button_backup_all'
        };

        if ($in.step === 'step_call_server') {
        }

        if ($in.step === 'step_call_server_response') {
        }

        return {
            'answer': $out.answer,
            'message': $out.message,
            'ok': $out.answer
        };
    };

}
//# sourceURL=infohub_tree_backup.js