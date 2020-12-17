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
function infohub_tree_restore() {

    "use strict";

// include "infohub_base.js"

    const _Version = function () {
        return {
            'date': '2020-08-25',
            'since': '2020-07-25',
            'version': '1.0.0',
            'checksum': '{{checksum}}',
            'class_name': 'infohub_tree_restore',
            'note': 'Restore data to the browser/server from your backup files',
            'status': 'normal',
            'SPDX-License-Identifier': 'GPL-3.0-or-later'
        };
    };

    const _GetCmdFunctions = function () {
        const $list = {
            'create': 'normal',
            'click_import_files': 'normal',
            'click_clear_list': 'normal',
            'click_save_data': 'normal'
        };

        return _GetCmdFunctionsBase($list);
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

        if ($in.step === 'step_render')
        {
            $classTranslations = $in.translations;

            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_render',
                    'function': 'create'
                },
                'data': {
                    'what': {
                        'container_buttons': {
                            'type': 'common',
                            'subtype': 'container',
                            'tag': 'div',
                            'data': '[button_import][button_clear][button_restore]',
                            'class': 'container-small'
                        },
                        'container_information': {
                            'type': 'common',
                            'subtype': 'container',
                            'tag': 'div',
                            'data': '[information]',
                            'class': 'container-small'
                        },
                        'container_restore_log': {
                            'type': 'common',
                            'subtype': 'container',
                            'tag': 'div',
                            'data': '[log]',
                            'class': 'container-small'
                        },
                        'container_list': {
                            'type': 'common',
                            'subtype': 'container',
                            'tag': 'div',
                            'data': '[list_backup_files]',
                            'class': 'container-medium'
                        },
                        'button_import': {
                            'plugin': 'infohub_renderform',
                            'type': 'file',
                            'button_label': _Translate('Import'),
                            'button_left_icon': '[import_icon]',
                            'accept': 'application/json,.json', // https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/file#Unique_file_type_specifiers
                            'event_data': 'restore|import_files',
                            'to_node': 'client',
                            'to_plugin': 'infohub_tree',
                            'to_function': 'click'
                        },
                        'import_icon': {
                            'type': 'common',
                            'subtype': 'svg',
                            'data': '[import_asset]'
                        },
                        'import_asset': {
                            'plugin': 'infohub_asset',
                            'type': 'icon',
                            'asset_name': 'restore/import',
                            'plugin_name': 'infohub_tree'
                        },
                        'button_clear': {
                            'plugin': 'infohub_renderform',
                            'type': 'button',
                            'mode': 'button',
                            'button_label': _Translate('Clear list'),
                            'button_left_icon': '[clear_icon]',
                            'event_data': 'restore|clear_list',
                            'to_plugin': 'infohub_tree',
                            'to_function': 'click'
                        },
                        'clear_icon': {
                            'type': 'common',
                            'subtype': 'svg',
                            'data': '[clear_asset]'
                        },
                        'clear_asset': {
                            'plugin': 'infohub_asset',
                            'type': 'icon',
                            'asset_name': 'restore/clear',
                            'plugin_name': 'infohub_tree'
                        },
                        'button_restore': {
                            'plugin': 'infohub_renderform',
                            'type': 'button',
                            'mode': 'button',
                            'button_label': _Translate('Save data to browser Storage'),
                            'button_left_icon': '[restore_icon]',
                            'event_data': 'restore|save_data',
                            'to_plugin': 'infohub_tree',
                            'to_function': 'click'
                        },
                        'restore_icon': {
                            'type': 'common',
                            'subtype': 'svg',
                            'data': '[restore_asset]'
                        },
                        'restore_asset': {
                            'plugin': 'infohub_asset',
                            'type': 'icon',
                            'asset_name': 'storage/save_data',
                            'plugin_name': 'infohub_tree'
                        },
                        'list_backup_files': {
                            'plugin': 'infohub_renderform',
                            'type': 'select',
                            "label": _Translate("Backup files"),
                            "description": _Translate("Here is a list with all backup files you have selected in the file selector"),
                            "size": "20",
                            "multiple": "true",
                            'event_data': 'server|list',
                            'to_plugin': 'infohub_tree',
                            'to_function': 'click',
                            "options": [],
                            'css_data': {
                                '.select': 'max-width: 200px;'
                            }
                        },
                        'information': {
                            'plugin': 'infohub_rendermajor',
                            'type': 'presentation_box',
                            'head_label': _Translate('Information'),
                            'content_data': '',
                            'foot_text': 'Here you see information about the latest backup file you click on in the list'
                        },
                        'log': {
                            'plugin': 'infohub_rendermajor',
                            'type': 'presentation_box',
                            'head_label': _Translate('Restore log'),
                            'content_data': '',
                            'foot_text': 'You see the progress of the restore here'
                        },
                    },
                    'how': {
                        'mode': 'one box',
                        'text': '[container_buttons][container_restore_log][container_list][container_information]'
                    },
                    'where': {
                        'box_id': 'main.body.infohub_tree.form', // 'box_id': $in.parent_box_id + '.form',
                        'max_width': 100,
                        'scroll_to_box_id': 'true'
                    },
                    'cache_key': 'restore'
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
     * File selector comes here. The file names will be put in the list.
     * @version 2020-08-30
     * @since 2020-08-30
     * @author Peter Lembke
     */
    $functions.push("click_import_files");
    const click_import_files = function ($in)
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
            'message': 'Nothing to report from ' + _GetClassName() + ' -> click_import_files'
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
     * Clear the list with files you have selected previously
     * @version 2020-08-30
     * @since 2020-08-30
     * @author Peter Lembke
     */
    $functions.push("click_clear_list");
    const click_clear_list = function ($in)
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
            'message': 'Nothing to report from ' + _GetClassName() + ' -> click_clear_list'
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
     * Import the selected files to the browser Storage
     * The data wil later be synced with the server by infohub_restore_storage
     * @version 2020-08-30
     * @since 2020-08-30
     * @author Peter Lembke
     */
    $functions.push("click_save_data");
    const click_save_data = function ($in)
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
            'message': 'Nothing to report from ' + _GetClassName() + ' -> click_save_data'
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
//# sourceURL=infohub_tree_restore.js