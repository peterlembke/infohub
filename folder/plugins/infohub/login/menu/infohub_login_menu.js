/**
 * infohub_login_menu
 * Render a menu for infohub_login
 *
 * @package     Infohub
 * @subpackage  infohub_login_menu
 * @since       2019-09-02
 * @author      Peter Lembke <info@infohub.se>
 * @license     GPL-3.0-or-later
 * @copyright   Copyright (C) 2010- Peter Lembke
 * @see         https://github.com/peterlembke/infohub/blob/main/folder/plugins/infohub/login/menu/infohub_login_menu.md Documentation
 * @link        https://infohub.se/ InfoHub main page
 */
function infohub_login_menu() {

    'use strict';

// include "infohub_base.js"

    const _Version = function() {
        return {
            'date': '2019-09-14',
            'since': '2019-09-02',
            'version': '1.0.0',
            'checksum': '{{checksum}}',
            'class_name': 'infohub_login_menu',
            'note': 'Render a menu for infohub_login',
            'status': 'normal',
            'SPDX-License-Identifier': 'GPL-3.0-or-later',
        };
    };

    const _GetCmdFunctions = function() {
        const $list = {
            'create': 'normal',
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
     * @version 2016-10-16
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
            $classTranslations = _ByVal($in.translations);
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_render',
                    'function': 'create',
                },
                'data': {
                    'what': {
                        'titel': {
                            'type': 'common',
                            'subtype': 'value',
                            'data': _Translate('MENU')
                        },
                        'my_menu': {
                            'plugin': 'infohub_rendermenu',
                            'type': 'menu',
                            'head_label': '[titel]',
                            'options': {
                                'import': {
                                    'alias': 'import',
                                    'event_data': 'import', // child plugin
                                    'button_left_icon': '[import_icon]',
                                    'button_label': _Translate('IMPORT_YOUR_CONTACT_INFORMATION'),
                                    'to_plugin': 'infohub_login',
                                    'to_function': 'click_menu',
                                },
                                'login': {
                                    'alias': 'login',
                                    'event_data': 'login',
                                    'button_label': _Translate('LOG_IN'),
                                    'to_plugin': 'infohub_login',
                                    'to_function': 'click_menu',
                                },
                                'password': {
                                    'alias': 'password',
                                    'event_data': 'password',
                                    'button_label': _Translate('SET_A_PASSWORD'),
                                    'to_plugin': 'infohub_login',
                                    'to_function': 'click_menu',
                                },
                                'export': {
                                    'alias': 'export',
                                    'event_data': 'export',
                                    'button_left_icon': '[export_icon]',
                                    'button_label': _Translate('EXPORT_YOUR_CONTACT_INFORMATION'),
                                    'to_plugin': 'infohub_login',
                                    'to_function': 'click_menu',
                                },
                                'logout': {
                                    'alias': 'logout',
                                    'event_data': 'logout',
                                    'button_label': _Translate('LOG_OUT'),
                                    'to_plugin': 'infohub_login',
                                    'to_function': 'click_menu',
                                },
                                'forget': {
                                    'alias': 'forget',
                                    'event_data': 'forget',
                                    'button_label': _Translate('FORGET_YOUR_CONTACT_INFORMATION'),
                                    'to_plugin': 'infohub_login',
                                    'to_function': 'click_menu',
                                },
                            },
                        },
                        'import_icon': {
                            'type': 'common',
                            'subtype': 'svg',
                            'data': '[import_asset]',
                        },
                        'import_asset': {
                            'plugin': 'infohub_asset',
                            'type': 'icon',
                            'asset_name': 'import',
                            'plugin_name': 'infohub_login',
                        },
                        'export_icon': {
                            'type': 'common',
                            'subtype': 'svg',
                            'data': '[export_asset]',
                        },
                        'export_asset': {
                            'plugin': 'infohub_asset',
                            'type': 'icon',
                            'asset_name': 'export',
                            'plugin_name': 'infohub_login',
                        },
                    },
                    'how': {
                        'mode': 'one box',
                        'text': '[my_menu]',
                    },
                    'where': {
                        'box_id': $in.parent_box_id + '.menu',
                        'max_width': 320,
                        'scroll_to_box_id': 'true',
                    },
                    'cache_key': 'menu',
                },
                'data_back': {'step': 'step_end'},
            });
        }

        return {
            'answer': $in.response.answer,
            'message': $in.response.message,
        };
    };

}

//# sourceURL=infohub_login_menu.js