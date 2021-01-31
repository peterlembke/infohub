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
function infohub_tree_menu() {

    "use strict";

// include "infohub_base.js"

    const _Version = function() {
        return {
            'date': '2020-07-26',
            'since': '2020-07-25',
            'version': '1.0.1',
            'checksum': '{{checksum}}',
            'class_name': 'infohub_tree_menu',
            'note': 'Render a menu for infohub_tree',
            'status': 'normal',
            'SPDX-License-Identifier': 'GPL-3.0-or-later'
        };
    };

    const _GetCmdFunctions = function() {
        const $list = {
            'create': 'normal'
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
     * @version 2020-07-25
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
            $classTranslations = _ByVal($in.translations);

            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_render',
                    'function': 'create'
                },
                'data': {
                    'what': {
                        'titel': {
                            'type': 'common',
                            'subtype': 'value',
                            'data': _Translate('Tree manager')
                        },
                        'my_menu': {
                            'plugin': 'infohub_rendermenu',
                            'type': 'menu',
                            'head_label': '[titel]',
                            'options': {
                                'doc': {
                                    'alias': 'doc_tree',
                                    'event_data': 'doc_tree',
                                    'button_label': _Translate('Documentation'),
                                    'button_left_icon': '[doc_icon]',
                                    'to_plugin': 'infohub_tree',
                                    'to_function': 'click_menu'
                                },
                                'version': {
                                    'alias': 'version_tree',
                                    'event_data': 'version_tree',
                                    'button_label': _Translate('Version'),
                                    'button_left_icon': '[version_icon]',
                                    'to_plugin': 'infohub_tree',
                                    'to_function': 'click_menu'
                                },
                                'encrypt': {
                                    'alias': 'encrypt_tree',
                                    'event_data': 'encrypt_tree',
                                    'button_label': _Translate('Encryption'),
                                    'button_left_icon': '[encrypt_icon]',
                                    'to_plugin': 'infohub_tree',
                                    'to_function': 'click_menu'
                                },
                                'backup': {
                                    'alias': 'backup_tree',
                                    'event_data': 'backup_tree',
                                    'button_label': _Translate('Backup'),
                                    'button_left_icon': '[backup_icon]',
                                    'to_plugin': 'infohub_tree',
                                    'to_function': 'click_menu'
                                },
                                'restore': {
                                    'alias': 'restore_tree',
                                    'event_data': 'restore_tree',
                                    'button_label': _Translate('Restore'),
                                    'button_left_icon': '[restore_icon]',
                                    'to_plugin': 'infohub_tree',
                                    'to_function': 'click_menu'
                                },
                                'sync': {
                                    'alias': 'sync_tree',
                                    'event_data': 'sync_tree',
                                    'button_label': _Translate('Sync'),
                                    'button_left_icon': '[sync_icon]',
                                    'to_plugin': 'infohub_tree',
                                    'to_function': 'click_menu'
                                }
                            }
                        },
                        'doc_icon': {
                            'type': 'common',
                            'subtype': 'svg',
                            'data': '[doc_asset]'
                        },
                        'doc_asset': {
                            'plugin': 'infohub_asset',
                            'type': 'icon',
                            'asset_name': 'doc/doc-yellow',
                            'plugin_name': 'infohub_tree'
                        },
                        'version_icon': {
                            'type': 'common',
                            'subtype': 'svg',
                            'data': '[version_asset]'
                        },
                        'version_asset': {
                            'plugin': 'infohub_asset',
                            'type': 'icon',
                            'asset_name': 'version/version',
                            'plugin_name': 'infohub_tree'
                        },
                        'encrypt_icon': {
                            'type': 'common',
                            'subtype': 'svg',
                            'data': '[encrypt_asset]'
                        },
                        'encrypt_asset': {
                            'plugin': 'infohub_asset',
                            'type': 'icon',
                            'asset_name': 'encrypt/encrypt',
                            'plugin_name': 'infohub_tree'
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
                        'restore_icon': {
                            'type': 'common',
                            'subtype': 'svg',
                            'data': '[restore_asset]'
                        },
                        'restore_asset': {
                            'plugin': 'infohub_asset',
                            'type': 'icon',
                            'asset_name': 'restore/import',
                            'plugin_name': 'infohub_tree'
                        },
                        'sync_icon': {
                            'type': 'common',
                            'subtype': 'svg',
                            'data': '[sync_asset]'
                        },
                        'sync_asset': {
                            'plugin': 'infohub_asset',
                            'type': 'icon',
                            'asset_name': 'sync/sync',
                            'plugin_name': 'infohub_tree'
                        }
                    },
                    'how': {
                        'mode': 'one box',
                        'text': '[my_menu]'
                    },
                    'where': {
                        'box_id': $in.parent_box_id + '.menu',
                        'max_width': 320,
                        'scroll_to_box_id': 'true'
                    },
                    'cache_key': 'menu'
                },
                'data_back': {'step': 'step_end'}
            });
        }

        return {
            'answer': $in.response.answer,
            'message': $in.response.message
        };
    };
}
//# sourceURL=infohub_tree_menu.js