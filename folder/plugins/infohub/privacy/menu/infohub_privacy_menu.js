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
function infohub_privacy_menu() {

    'use strict';

// include "infohub_base.js"

    const _Version = function() {
        return {
            'date': '2020-05-01',
            'since': '2018-04-15',
            'version': '2.0.0',
            'checksum': '{{checksum}}',
            'class_name': 'infohub_privacy_menu',
            'note': 'Render a menu for infohub_privacy',
            'status': 'normal',
            'SPDX-License-Identifier': 'GPL-3.0-or-later',
        };
    };

    const _GetCmdFunctions = function() {
        return {
            'create': 'normal',
        };
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
            'step': 'step_start',
            'response': {
                'answer': 'false',
                'message': 'Nothing to report from tools_encrypt',
            },
        };
        $in = _Default($default, $in);

        if ($in.step === 'step_start') {
            $classTranslations = $in.translations;
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
                            'data': 'privacy tool and tips',
                        },
                        'my_menu': {
                            'plugin': 'infohub_rendermenu',
                            'type': 'menu',
                            'head_label': '[titel]',
                            'options': {
                                'browser': {
                                    'alias': 'browser_link',
                                    'event_data': 'browser',
                                    'button_label': _Translate(
                                        'Browser privacy'),
                                    'to_plugin': 'infohub_privacy',
                                    'to_function': 'click_menu',
                                },
                                'traffic': {
                                    'alias': 'traffic_link',
                                    'event_data': 'traffic',
                                    'button_label': _Translate(
                                        'Traffic privacy'),
                                    'to_plugin': 'infohub_privacy',
                                    'to_function': 'click_menu',
                                },
                                'server': {
                                    'alias': 'server_link',
                                    'event_data': 'server',
                                    'button_label': _Translate(
                                        'Server privacy'),
                                    'to_plugin': 'infohub_privacy',
                                    'to_function': 'click_menu',
                                },
                                'tips': {
                                    'alias': 'tips_link',
                                    'event_data': 'tips',
                                    'button_label': _Translate(
                                        'Tips for privacy'),
                                    'to_plugin': 'infohub_privacy',
                                    'to_function': 'click_menu',
                                },
                            },
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

//# sourceURL=infohub_privacy_menu.js