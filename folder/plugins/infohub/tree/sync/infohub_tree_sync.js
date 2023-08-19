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
function infohub_tree_sync() {

    'use strict';

// include "infohub_base.js"

    const _Version = function() {
        return {
            'date': '2021-02-19',
            'since': '2020-07-25',
            'version': '1.0.0',
            'checksum': '{{checksum}}',
            'class_name': 'infohub_tree_sync',
            'note': 'Sync the local data with the server data',
            'status': 'normal',
            'SPDX-License-Identifier': 'GPL-3.0-or-later',
        };
    };

    const _GetCmdFunctions = function() {
        const $list = {
            'create': 'normal',
            'click_sync': 'normal',
            'click_download': 'normal',
            'click_upload': 'normal',
            'click_refresh_conflict_list': 'normal',
            'click_conflict_list': 'normal',
            'click_keep_local_version': 'normal',
            'click_keep_server_version': 'normal',
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
                        'container_sync': {
                            'type': 'common',
                            'subtype': 'container',
                            'tag': 'div',
                            'data': '[major_sync]',
                            'class': 'container-small',
                        },
                        'major_sync': {
                            'plugin': 'infohub_rendermajor',
                            'type': 'presentation_box',
                            'head_label': _Translate('START_THE_SYNC_HERE'),
                            'content_data': '[button_sync][progress_sync][label_upload_count]<br>[label_download_count]<br>[label_conflict_count][button_upload][progress_upload][button_download][progress_download]',
                            'foot_text': _Translate('YOU_FIRST_SYNC,_THEN_HANDLE_THE_UPLOAD,_DOWNLOAD_AND_CONFLICT_LISTS')
                        },
                        'container_conflict_list': {
                            'type': 'common',
                            'subtype': 'container',
                            'tag': 'div',
                            'data': '[button_refresh_conflict_list][select_conflict_list]',
                            'class': 'container-medium',
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
                            'class': 'container-medium'
                        },
                        'form_local_version': {
                            'type': 'common',
                            'subtype': 'container',
                            'tag': 'div',
                            'data': _Translate('CLICK_ON_THE_LIST'),
                            'class': 'container-medium'
                        },
                        'button_sync': {
                            'plugin': 'infohub_renderform',
                            'type': 'button',
                            'mode': 'button',
                            'button_label': _Translate('SYNC'),
                            'button_left_icon': '[sync_icon]',
                            'event_data': 'sync|sync',
                            'to_plugin': 'infohub_tree',
                            'to_function': 'click',
                        },
                        'button_upload': {
                            'plugin': 'infohub_renderform',
                            'type': 'button',
                            'mode': 'button',
                            'button_label': _Translate('UPLOAD'),
                            'button_left_icon': '[upload_icon]',
                            'event_data': 'sync|upload',
                            'to_plugin': 'infohub_tree',
                            'to_function': 'click',
                        },
                        'button_download': {
                            'plugin': 'infohub_renderform',
                            'type': 'button',
                            'mode': 'button',
                            'button_label': _Translate('DOWNLOAD'),
                            'button_left_icon': '[download_icon]',
                            'event_data': 'sync|download',
                            'to_plugin': 'infohub_tree',
                            'to_function': 'click',
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
                        'select_conflict_list': {
                            'plugin': 'infohub_renderform',
                            'type': 'select',
                            "label": _Translate("CONFLICT_LIST"),
                            "description": _Translate("YOU_CAN_HELP_ME_DECIDE_WHAT_VERSION_TO_KEEP"),
                            "size": "20",
                            "multiple": "false",
                            'event_data': 'sync|conflict_list',
                            'to_plugin': 'infohub_tree',
                            'to_function': 'click',
                            'options': [],
                            'css_data': {
                                '.select': 'max-width: 200px;',
                            },
                        },
                        'progress_sync': {
                            'type': 'common',
                            'subtype': 'progress',
                            'class': 'progress',
                            'max': 50,
                            'value': 0,
                            'css_data': {
                                '.progress': 'min-width: 100px;',
                            },
                        },
                        'progress_upload': {
                            'type': 'common',
                            'subtype': 'progress',
                            'class': 'progress',
                            'max': 50,
                            'value': 0,
                            'css_data': {
                                '.progress': 'min-width: 100px;',
                            },
                        },
                        'progress_download': {
                            'type': 'common',
                            'subtype': 'progress',
                            'class': 'progress',
                            'max': 50,
                            'value': 0,
                            'css_data': {
                                '.progress': 'min-width: 100px;',
                            },
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
                        'sync_icon': {
                            'type': 'common',
                            'subtype': 'svg',
                            'data': '[sync_asset]',
                        },
                        'sync_asset': {
                            'plugin': 'infohub_asset',
                            'type': 'icon',
                            'asset_name': 'sync/sync',
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
                        'upload_icon': {
                            'type': 'common',
                            'subtype': 'svg',
                            'data': '[upload_asset]',
                        },
                        'upload_asset': {
                            'plugin': 'infohub_asset',
                            'type': 'icon',
                            'asset_name': 'sync/upload',
                            'plugin_name': 'infohub_tree',
                        },
                        'download_icon': {
                            'type': 'common',
                            'subtype': 'svg',
                            'data': '[download_asset]',
                        },
                        'download_asset': {
                            'plugin': 'infohub_asset',
                            'type': 'icon',
                            'asset_name': 'sync/download',
                            'plugin_name': 'infohub_tree',
                        },
                        'label_upload_count': {
                            'type': 'common',
                            'subtype': 'label_data',
                            'label': 'Upload count: ',
                            'data': '0',
                            'css_data': {
                                '.labeldata': 'margin: 6px;',
                                '.label': 'margin: 0px 6px 0px 0px',
                            },
                        },
                        'label_download_count': {
                            'type': 'common',
                            'subtype': 'label_data',
                            'label': 'Download count: ',
                            'data': '0',
                            'css_data': {
                                '.labeldata': 'margin: 6px;',
                                '.label': 'margin: 0px 6px 0px 0px',
                            },
                        },
                        'label_conflict_count': {
                            'type': 'common',
                            'subtype': 'label_data',
                            'label': 'Conflict count: ',
                            'data': '0',
                            'css_data': {
                                '.labeldata': 'margin: 6px;',
                                '.label': 'margin: 0px 6px 0px 0px',
                            },
                        },
                    },
                    'how': {
                        'mode': 'one box',
                        'text': '[container_sync][container_conflict_list][container_local_version][container_server_version]',
                    },
                    'where': {
                        'box_id': 'main.body.infohub_tree.form', // 'box_id': $in.parent_box_id + '.form',
                        'max_width': 100,
                        'scroll_to_box_id': 'true',
                    },
                    'cache_key': 'sync',
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
     * Starts the sync process  between the client and the server
     * @version 2020-08-30
     * @since 2020-08-30
     * @author Peter Lembke
     */
    $functions.push('click_sync');
    const click_sync = function($in = {}) {
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
     * Starts the download process with data from server to client
     * @version 2021-02-19
     * @since 2021-02-19
     * @author Peter Lembke
     */
    $functions.push('click_download');
    const click_download = function($in = {}) {
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
     * Starts the upload process with data from client to server
     * @version 2021-02-19
     * @since 2021-02-19
     * @author Peter Lembke
     */
    $functions.push('click_upload');
    const click_upload = function($in = {}) {
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
     * Reads the conflict list and displays it in a selector
     * Only the 20 first are in the list. You need to handle some of them.
     * @version 2020-08-30
     * @since 2020-08-30
     * @author Peter Lembke
     */
    $functions.push('click_refresh_conflict_list');
    const click_refresh_conflict_list = function($in = {}) {
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
     * When you click on an item in the conflict list it will load the local and server versions
     * and present them on screen in separate forms that are rendered by the plugin that handle that
     * type of data.
     * @version 2020-08-30
     * @since 2020-08-30
     * @author Peter Lembke
     */
    $functions.push('click_conflict_list');
    const click_conflict_list = function($in = {}) {
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
     * If you click to keep the local version you will upload that version to the server claiming that it is
     * based on the servers current version.
     * @version 2020-08-30
     * @since 2020-08-30
     * @author Peter Lembke
     */
    $functions.push('click_keep_local_version');
    const click_keep_local_version = function($in = {}) {
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
     * If you click to keep the server version you will download that version from the server and store it locally.
     * Overwriting any local version so the checksums are the same as the server.
     * @version 2020-08-30
     * @since 2020-08-30
     * @author Peter Lembke
     */
    $functions.push('click_keep_server_version');
    const click_keep_server_version = function($in = {}) {
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

}

//# sourceURL=infohub_tree_sync.js