/**
 * Render a menu for infohub_contact
 *
 * @author      Peter Lembke <info@infohub.se>
 * @version     2020-08-02
 * @since       2019-02-16
 * @copyright   Copyright (c) 2019, Peter Lembke
 * @license     https://opensource.org/licenses/gpl-license.php GPL-3.0-or-later
 * @see         https://github.com/peterlembke/infohub/blob/master/folder/plugins/infohub/contact/menu/infohub_contact_menu.md Documentation
 * @link        https://infohub.se/ InfoHub main page
 */
function infohub_contact_menu() {

    "use strict";

// include "infohub_base.js"

    $functions.push('_Version');
    /**
     * Version information, used by the version function
     * @returns {{date: string, note: string, 'SPDX-License-Identifier': string, checksum: string, version: string, class_name: string, since: string, status: string}}
     * @private
     */
    const _Version = function() {
        return {
            'date': '2020-08-02',
            'since': '2019-02-16',
            'version': '1.1.0',
            'checksum': '{{checksum}}',
            'class_name': 'infohub_contact_menu',
            'note': 'Render a menu for infohub_contact',
            'status': 'normal',
            'SPDX-License-Identifier': 'GPL-3.0-or-later'
        };
    };

    $functions.push('_GetCmdFunctions');
    /**
     * List with all public functions you can call
     * @returns {*}
     * @private
     */
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