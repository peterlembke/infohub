/*
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
function infohub_contact_menu() {

    "use strict";

// include "infohub_base.js"

    const _Version = function() {
        return {
            'date': '2019-09-28',
            'since': '2019-02-16',
            'version': '1.0.1',
            'checksum': '{{checksum}}',
            'class_name': 'infohub_contact_menu',
            'note': 'Render a menu for infohub_contact',
            'status': 'normal',
            'SPDX-License-Identifier': 'GPL-3.0-or-later'
        };
    };

    const _GetCmdFunctions = function() {
        return {
            'create': 'normal'
        };
    };

    let $classTranslations = {};

    /**
     * Translate - Substitute a string for another string using a class local object
     * @param {type} $string
     * @returns string
     */
    $functions.push('_Translate');
    const _Translate = function ($string)
    {
        if (typeof $classTranslations !== 'object') {
            return $string;
        }

        return _GetData({
            'name': _GetClassName() + '|' + $string, 
            'default': $string, 'data': $classTranslations, 'split': '|'
        });
    };

    // ***********************************************************
    // * your class functions below, only declare with var
    // * Can only be reached trough cmd()
    // ***********************************************************

    /**
     * Get instructions and create the message to InfoHub View
     * @version 2016-10-16
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
                            'data': _Translate('Contact manager')
                        },
                        'my_menu': {
                            'plugin': 'infohub_rendermenu',
                            'type': 'menu',
                            'head_label': '[titel]',
                            'options': {
                                'doc': {
                                    'alias': 'doc_contact',
                                    'event_data': 'doc_contact',
                                    'button_label': _Translate('Documentation'),
                                    'to_plugin': 'infohub_contact',
                                    'to_function': 'click_menu'
                                },
                                'group': {
                                    'alias': 'group_contact',
                                    'event_data': 'group_contact',
                                    'button_label': _Translate('Group rights'),
                                    'button_left_icon': '[group_icon]',
                                    'to_plugin': 'infohub_contact',
                                    'to_function': 'click_menu'
                                },
                                'client': {
                                    'alias': 'client_contact',
                                    'event_data': 'client_contact',
                                    'button_label': _Translate('Client contact'),
                                    'button_left_icon': '[client_icon]',
                                    'to_plugin': 'infohub_contact',
                                    'to_function': 'click_menu'
                                },
                                'server': {
                                    'alias': 'server_contact',
                                    'event_data': 'server_contact',
                                    'button_label': _Translate('Server contact'),
                                    'button_left_icon': '[server_icon]',
                                    'to_plugin': 'infohub_contact',
                                    'to_function': 'click_menu'
                                }
                            }
                        },
                        'group_icon': {
                            'type': 'common',
                            'subtype': 'svg',
                            'data': '[group_asset]'
                        },
                        'group_asset': {
                            'plugin': 'infohub_asset',
                            'type': 'icon',
                            'asset_name': 'group/group',
                            'plugin_name': 'infohub_contact'
                        },
                        'client_icon': {
                            'type': 'common',
                            'subtype': 'svg',
                            'data': '[client_asset]'
                        },
                        'client_asset': {
                            'plugin': 'infohub_asset',
                            'type': 'icon',
                            'asset_name': 'client/client',
                            'plugin_name': 'infohub_contact'
                        },
                        'server_icon': {
                            'type': 'common',
                            'subtype': 'svg',
                            'data': '[server_asset]'
                        },
                        'server_asset': {
                            'plugin': 'infohub_asset',
                            'type': 'icon',
                            'asset_name': 'server/db-blue',
                            'plugin_name': 'infohub_contact'
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
//# sourceURL=infohub_contact_menu.js