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
function infohub_login_standalone() {

    'use strict';

// include "infohub_base.js"

    const _Version = function() {
        return {
            'date': '2021-08-10',
            'since': '2021-08-10',
            'version': '1.0.0',
            'checksum': '{{checksum}}',
            'class_name': 'infohub_login_standalone',
            'note': 'Login to the server with the imported contact data',
            'status': 'normal',
            'SPDX-License-Identifier': 'GPL-3.0-or-later',
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
    // * your class functions below, only declare with const
    // * Can only be reached through cmd()
    // ***********************************************************

    /**
     * Get instructions and create the message to InfoHub View
     * @version 2019-09-03
     * @since   2019-09-03
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
            'desktop_environment': '',
            'download_account': {},
        };
        $in = _Default($default, $in);

        if ($in.step === 'step_render') {
            $classTranslations = $in.translations;

            $in.step = 'step_end';
            if ($in.desktop_environment === 'standalone') {
                $in.step = 'step_render_for_standalone';
            }
        }

        if ($in.step === 'step_render_for_standalone') {
            let $render = _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_render',
                    'function': 'create',
                },
                'data': {
                    'what': {
                        'container_login': {
                            'type': 'common',
                            'subtype': 'container',
                            'tag': 'div',
                            'data': '[form_password]',
                            'class': 'container-small',
                        },
                        'form_password': {
                            'plugin': 'infohub_renderform',
                            'type': 'form',
                            'content': '[my_file_selector][text_password][button_login][status_message][button_export]',
                            'label': _Translate('LOGIN')
                        },
                        'my_file_selector': {
                            'plugin': 'infohub_renderform',
                            'type': 'file',
                            'button_label': _Translate('SELECT_FILE'),
                            'accept': '*.json',
                            'event_data': 'login|import',
                            'to_node': 'client',
                            'to_plugin': 'infohub_login',
                            'to_function': 'click',
                        },
                        'text_password': {
                            'type': 'form',
                            'subtype': 'text',
                            'input_type': 'password',
                            'placeholder': _Translate('PASSWORD')
                        },
                        'button_login': {
                            'plugin': 'infohub_renderform',
                            'type': 'button',
                            'mode': 'button',
                            'button_label': _Translate('LOGIN'),
                            'event_data': 'login|login',
                            'to_plugin': 'infohub_login',
                            'to_function': 'click',
                            'custom_variables': {
                                'desktop_environment': $in.desktop_environment,
                            },
                        },
                        'button_export': {
                            'plugin': 'infohub_renderform',
                            'type': 'button',
                            'mode': 'button',
                            'button_label': _Translate('DOWNLOAD_DEMO_ACCOUNT'),
                            'button_left_icon': '[export_icon]',
                            'event_data': 'login|export',
                            'to_node': 'client',
                            'to_plugin': 'infohub_login',
                            'to_function': 'click',
                            'custom_variables': {
                                'desktop_environment': $in.desktop_environment,
                            },
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
                        'status_message': {
                            'type': 'common',
                            'subtype': 'container',
                            'tag': 'span',
                            'data': _Translate('LOGIN_RESULT') + ':',
                            'class': 'container-pretty',
                            'display': 'inline-block',
                        },
                        'form_more': {
                            'plugin': 'infohub_renderform',
                            'type': 'form',
                            'content': '[current_url]<br>[button_refresh]',
                            'label': _Translate('MORE'),
                            'label_icon': '[down_icon]',
                            'description': '',
                            'open': 'false',
                        },
                        'down_icon': {
                            'type': 'common',
                            'subtype': 'svg',
                            'data': '[down_asset]',
                        },
                        'down_asset': {
                            'plugin': 'infohub_asset',
                            'type': 'icon',
                            'asset_name': 'down',
                            'plugin_name': 'infohub_login',
                        },
                        'current_url': {
                            'type': 'common',
                            'subtype': 'value',
                            'data': _Translate('CURRENT_URL') + ': ' + window.location.href,
                        },
                        'button_refresh': {
                            'plugin': 'infohub_renderform',
                            'type': 'button',
                            'subtype': 'button',
                            'mode': 'button',
                            'button_label': _Translate('REFRESH_PAGE'),
                            'button_left_icon': '[refresh_icon]',
                            'to_plugin': 'infohub_debug',
                            'to_function': 'refresh_plugins_and_reload_page',
                            'css_data': {},
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
                            'plugin_name': 'infohub_login',
                        },
                    },
                    'how': {
                        'mode': 'one box',
                        'text': '[container_login][form_more]',
                    },
                    'where': {
                        'box_id': 'main.body.infohub_login.form', // 'box_id': $in.parent_box_id + '.form',
                        'max_width': 100,
                        'scroll_to_box_id': 'true',
                    },
                },
                'data_back': {
                    'step': 'step_render_for_standalone_response',
                },
            });

            const $url = location.hostname;

            if (_IsSet($in.download_account[$url]) === 'false') {
                delete $render.data.what.button_export;
                delete $render.data.what.export_icon;
                delete $render.data.what.export_asset;
                $render.data.what.form_password.content = '[my_file_selector][text_password][button_login][status_message]';
            }

            return $render;
        }

        if ($in.step === 'step_render_for_standalone_response') {
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_login_login',
                    'function': 'set_boxes',
                },
                'data': {
                    'box_id': 'main.body.infohub_login.form',
                    'translations': $classTranslations
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

}

//# sourceURL=infohub_login_standalone.js