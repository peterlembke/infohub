/**
 * infohub_tree_restore
 * Restore data to the browser/server from your backup files
 *
 * @package     Infohub
 * @subpackage  infohub_tree_restore
 * @since       2020-07-25
 * @author      Peter Lembke <info@infohub.se>
 * @license     GPL-3.0-or-later
 * @copyright   Copyright (C) 2010- Peter Lembke
 */
function infohub_tree_restore() {

    'use strict';

// include "infohub_base.js"

    const _Version = function() {
        return {
            'date': '2020-08-25',
            'since': '2020-07-25',
            'version': '1.0.0',
            'checksum': '{{checksum}}',
            'class_name': 'infohub_tree_restore',
            'note': 'Restore data to the browser/server from your backup files',
            'status': 'normal',
            'SPDX-License-Identifier': 'GPL-3.0-or-later',
        };
    };

    const _GetCmdFunctions = function() {
        const $list = {
            'create': 'normal',
            'click_import_files': 'normal',
            'click_clear_list': 'normal',
            'click_save_data': 'normal',
        };

        return _GetCmdFunctionsBase($list);
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
                        'container_list': {
                            'type': 'common',
                            'subtype': 'container',
                            'tag': 'div',
                            'data': '[button_import][button_clear][list_backup_files][button_restore]',
                            'class': 'container-small',
                        },
                        'container_information': {
                            'type': 'common',
                            'subtype': 'container',
                            'tag': 'div',
                            'data': '[information][log]',
                            'class': 'container-small',
                        },
                        'container_conflict': {
                            'plugin': 'infohub_rendermajor',
                            'type': 'presentation_box',
                            'head_label': _Translate('CONFLICTS'),
                            'content_data': '[container_conflict_list][container_local_version][container_server_version]',
                            'foot_text': 'Here you can solve conflicts in the restore data',
                        },
                        'button_import': {
                            'plugin': 'infohub_renderform',
                            'type': 'file',
                            'button_label': _Translate('SELECT_BACKUP_FILES'),
                            'button_left_icon': '[import_icon]',
                            'accept': 'application/json,.json', // https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/file#Unique_file_type_specifiers
                            'event_data': 'restore|import_files',
                            'to_node': 'client',
                            'to_plugin': 'infohub_tree',
                            'to_function': 'click',
                        },
                        'import_icon': {
                            'type': 'common',
                            'subtype': 'svg',
                            'data': '[import_asset]',
                        },
                        'import_asset': {
                            'plugin': 'infohub_asset',
                            'type': 'icon',
                            'asset_name': 'restore/import',
                            'plugin_name': 'infohub_tree',
                        },
                        'button_clear': {
                            'plugin': 'infohub_renderform',
                            'type': 'button',
                            'mode': 'button',
                            'button_label': _Translate('CLEAR_LIST'),
                            'button_left_icon': '[clear_icon]',
                            'event_data': 'restore|clear_list',
                            'to_plugin': 'infohub_tree',
                            'to_function': 'click',
                        },
                        'clear_icon': {
                            'type': 'common',
                            'subtype': 'svg',
                            'data': '[clear_asset]',
                        },
                        'clear_asset': {
                            'plugin': 'infohub_asset',
                            'type': 'icon',
                            'asset_name': 'restore/clear',
                            'plugin_name': 'infohub_tree',
                        },
                        'button_restore': {
                            'plugin': 'infohub_renderform',
                            'type': 'button',
                            'mode': 'button',
                            'button_label': _Translate('RESTORE_DATA_TO_BROWSER_STORAGE'),
                            'button_left_icon': '[restore_icon]',
                            'event_data': 'restore|save_data',
                            'to_plugin': 'infohub_tree',
                            'to_function': 'click',
                        },
                        'restore_icon': {
                            'type': 'common',
                            'subtype': 'svg',
                            'data': '[restore_asset]',
                        },
                        'restore_asset': {
                            'plugin': 'infohub_asset',
                            'type': 'icon',
                            'asset_name': 'storage/save_data',
                            'plugin_name': 'infohub_tree',
                        },
                        'list_backup_files': {
                            'plugin': 'infohub_renderform',
                            'type': 'select',
                            "label": _Translate("BACKUP_FILES"),
                            "description": _Translate("HERE_IS_A_LIST_WITH_ALL_BACKUP_FILES_YOU_HAVE_SELECTED_IN_THE_FILE_SELECTOR"),
                            "size": "20",
                            "multiple": "true",
                            'event_data': 'server|list',
                            'to_plugin': 'infohub_tree',
                            'to_function': 'click',
                            'options': [],
                            'css_data': {
                                '.select': 'max-width: 200px;',
                            },
                        },
                        'information': {
                            'plugin': 'infohub_rendermajor',
                            'type': 'presentation_box',
                            'head_label': _Translate('INFORMATION'),
                            'content_data': '',
                            'foot_text': 'Here you see information about the latest backup file you click on in the list',
                        },
                        'log': {
                            'plugin': 'infohub_rendermajor',
                            'type': 'presentation_box',
                            'head_label': _Translate('RESTORE_LOG'),
                            'content_data': '',
                            'foot_text': 'You see the progress of the restore here',
                        },
                        'container_conflict_list': {
                            'type': 'common',
                            'subtype': 'container',
                            'tag': 'div',
                            'data': '[button_refresh_conflict_list][select_conflict_list]',
                            'class': 'container-small',
                        },
                        'container_local_version': {
                            'type': 'common',
                            'subtype': 'container',
                            'tag': 'div',
                            'data': '[form_local_version][button_keep_local_version]',
                            'class': 'container-medium',
                        },
                        'container_server_version': {
                            'type': 'common',
                            'subtype': 'container',
                            'tag': 'div',
                            'data': '[form_server_version][button_keep_server_version]',
                            'class': 'container-medium',
                        },
                        'form_server_version': {
                            'type': 'common',
                            'subtype': 'container',
                            'tag': 'div',
                            'data': _Translate('CLICK_ON_THE_LIST'),
                            'class': 'container-medium',
                        },
                        'form_local_version': {
                            'type': 'common',
                            'subtype': 'container',
                            'tag': 'div',
                            'data': _Translate('CLICK_ON_THE_LIST'),
                            'class': 'container-medium',
                        },
                        'button_refresh_conflict_list': {
                            'plugin': 'infohub_renderform',
                            'type': 'button',
                            'mode': 'button',
                            'button_label': _Translate('REFRESH_CONFLICT_LIST'),
                            'button_left_icon': '[refresh_icon]',
                            'event_data': 'sync|refresh_conflict_list',
                            'to_plugin': 'infohub_tree',
                            'to_function': 'click',
                        },
                        'button_keep_local_version': {
                            'plugin': 'infohub_renderform',
                            'type': 'button',
                            'mode': 'button',
                            'button_label': _Translate('KEEP_LOCAL_VERSION'),
                            'button_left_icon': '[keep_icon]',
                            'event_data': 'sync|keep_local_version',
                            'to_plugin': 'infohub_tree',
                            'to_function': 'click',
                        },
                        'button_keep_server_version': {
                            'plugin': 'infohub_renderform',
                            'type': 'button',
                            'mode': 'button',
                            'button_label': _Translate('KEEP_SERVER_VERSION'),
                            'button_left_icon': '[keep_icon]',
                            'event_data': 'sync|keep_server_version',
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
                        'keep_icon': {
                            'type': 'common',
                            'subtype': 'svg',
                            'data': '[keep_asset]',
                        },
                        'keep_asset': {
                            'plugin': 'infohub_asset',
                            'type': 'icon',
                            'asset_name': 'sync/keep',
                            'plugin_name': 'infohub_tree',
                        },
                        'select_conflict_list': {
                            'plugin': 'infohub_renderform',
                            'type': 'select',
                            'label': _Translate('CONFLICT_LIST'),
                            'description': _Translate(
                                'You can help me decide what version to keep'),
                            'size': '20',
                            'multiple': 'false',
                            'event_data': 'sync|conflict_list',
                            'to_plugin': 'infohub_tree',
                            'to_function': 'click',
                            'options': [],
                            'css_data': {
                                '.select': 'max-width: 200px;',
                            },
                        },
                    },
                    'how': {
                        'mode': 'one box',
                        'text': '[container_list][container_information][container_conflict]',
                    },
                    'where': {
                        'box_id': 'main.body.infohub_tree.form', // 'box_id': $in.parent_box_id + '.form',
                        'max_width': 100,
                        'scroll_to_box_id': 'true',
                    },
                    'cache_key': 'restore',
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
     * File selector comes here. The file names will be put in the list.
     * @version 2020-08-30
     * @since 2020-08-30
     * @author Peter Lembke
     */
    $functions.push('click_import_files');
    const click_import_files = function($in = {}) {
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
                ' -> click_import_files',
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
     * Clear the list with files you have selected previously
     * @version 2020-08-30
     * @since 2020-08-30
     * @author Peter Lembke
     */
    $functions.push('click_clear_list');
    const click_clear_list = function($in = {}) {
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
                ' -> click_clear_list',
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
     * Import the selected files to the browser Storage
     * The data wil later be synced with the server by infohub_restore_storage
     * @version 2020-08-30
     * @since 2020-08-30
     * @author Peter Lembke
     */
    $functions.push('click_save_data');
    const click_save_data = function($in = {}) {
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
                ' -> click_save_data',
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

//# sourceURL=infohub_tree_restore.js