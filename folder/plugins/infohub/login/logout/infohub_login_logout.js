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
function infohub_login_logout() {

    "use strict";

// include "infohub_base.js"

    const _Version = function() {
        return {
            'date': '2019-09-03',
            'since': '2019-09-03',
            'version': '1.0.0',
            'checksum': '{{checksum}}',
            'class_name': 'infohub_login_logout',
            'note': 'Logout from the server',
            'status': 'normal',
            'SPDX-License-Identifier': 'GPL-3.0-or-later'
        };
    };

    const _GetCmdFunctions = function() {
        return {
            'create': 'normal',
            'click_logout': 'normal'
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
     * @version 2019-09-03
     * @since   2019-09-03
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
                        'container_logout': {
                            'plugin': 'infohub_rendermajor',
                            'type': 'presentation_box',
                            'head_label': _Translate('Logout'),
                            'content_data': '[button_logout][status_message][button_refresh]',
                            'foot_text': _Translate('Here you can logout from the server')
                        },
                        'button_logout': {
                            'plugin': 'infohub_renderform',
                            'type': 'button',
                            'mode': 'button',
                            'button_label': _Translate('Logout'),
                            'event_data': 'logout|logout',
                            'to_plugin': 'infohub_login',
                            'to_function': 'click'
                        },
                        'status_message': {
                            'type': 'common',
                            'subtype': 'container',
                            'tag': 'span',
                            'data': 'logout result:',
                            'class': 'container-pretty',
                            'display': 'inline-block'
                        },
                        'button_refresh': {
                            'plugin': 'infohub_renderform',
                            'type': 'button',
                            'mode': 'button',
                            'button_label': _Translate('Reload after logout'),
                            'event_data': 'logout|reload',
                            'to_plugin': 'infohub_debug',
                            'to_function': 'refresh_plugins_and_reload_page'
                        }
                    },
                    'how': {
                        'mode': 'one box',
                        'text': '[container_logout]'
                    },
                    'where': {
                        'box_id': 'main.body.infohub_login.form', // 'box_id': $in.parent_box_id + '.form',
                        'max_width': 100,
                        'scroll_to_box_id': 'true'
                    }
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
     * You clicked the button to logout from the server
     * @version 2020-01-20
     * @since 2019-09-03
     * @author Peter Lembke
     */
    $functions.push("click_logout");
    const click_logout = function ($in)
    {
        const $default = {
            'box_id': '',
            'step': 'step_logout',
            'response': {
                'answer': 'true',
                'message': 'Done',
                'ok': 'true'
            },
            'data_back': {
                'answer': 'true',
                'message': 'Done',
                'ok': 'true'
            }
        };
        $in = _Default($default, $in);

        let $messages = [];

        if ($in.step === 'step_logout')
        {
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_session',
                    'function': 'initiator_end_session'
                },
                'data': {
                    'node': 'server'
                },
                'data_back': {
                    'step': 'step_logout_response',
                    'box_id': $in.box_id
                }
            });
        }

        if ($in.step === 'step_logout_response')
        {
            $in.response.message = _Translate('Failed to logout') + ': ' + $in.response.message;

            if ($in.response.answer === 'true') {
                $in.response.ok = 'true';
                $in.response.message = _Translate('Success logging out');
            }

            let $subCall = _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_view',
                    'function': 'set_text'
                },
                'data': {
                    'id': $in.box_id + '.[status_message]',
                    'text': $in.response.message
                },
                'data_back': {
                    'step': 'step_end'
                }
            });
            $messages.push($subCall);
        }

        return {
            'answer': $in.response.answer,
            'message': $in.response.message,
            'messages': $messages,
            'ok': $in.response.ok
        };

    };

}
//# sourceURL=infohub_login_logout.js