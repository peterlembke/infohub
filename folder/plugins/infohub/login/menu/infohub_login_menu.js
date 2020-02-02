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
function infohub_login_menu() {

// include "infohub_base.js"

    /*jshint evil:true */
    /*jshint devel:true */
    /*jslint browser: true, evil: true, plusplus: true, todo: true */

    const _Version = function() {
        return {
            'date': '2019-09-14',
            'since': '2019-09-02',
            'version': '1.0.0',
            'checksum': '{{checksum}}',
            'class_name': 'infohub_login_menu',
            'note': 'Render a menu for infohub_login',
            'status': 'normal',
            'license_name': 'GNU GPL 3 or later'
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
        if (typeof $classTranslations !== 'object') { return $string; }
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
        "use strict";

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
                            'data': _Translate('Menu')
                        },
                        'my_menu': {
                            'plugin': 'infohub_rendermenu',
                            'type': 'menu',
                            'head_label': '[titel]',
                            'options': {
                                'import': {
                                    'alias': 'import',
                                    'event_data': 'import', // child plugin
                                    'button_label': _Translate('Import contact data'),
                                    'to_plugin': 'infohub_login',
                                    'to_function': 'click_menu'
                                },
                                'login': {
                                    'alias': 'login',
                                    'event_data': 'login',
                                    'button_label': _Translate('Login'),
                                    'to_plugin': 'infohub_login',
                                    'to_function': 'click_menu'
                                },
                                'password': {
                                    'alias': 'password',
                                    'event_data': 'password',
                                    'button_label': _Translate('Set password'),
                                    'to_plugin': 'infohub_login',
                                    'to_function': 'click_menu'
                                },
                                'export': {
                                    'alias': 'export',
                                    'event_data': 'export',
                                    'button_label': _Translate('Export contact data'),
                                    'to_plugin': 'infohub_login',
                                    'to_function': 'click_menu'
                                },
                                'logout': {
                                    'alias': 'logout',
                                    'event_data': 'logout',
                                    'button_label': _Translate('Logout'),
                                    'to_plugin': 'infohub_login',
                                    'to_function': 'click_menu'
                                },
                                'forget': {
                                    'alias': 'forget',
                                    'event_data': 'forget',
                                    'button_label': _Translate('Forget contact'),
                                    'to_plugin': 'infohub_login',
                                    'to_function': 'click_menu'
                                }
                            }
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
                    }
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
//# sourceURL=infohub_login_menu.js