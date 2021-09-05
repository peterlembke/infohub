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
function infohub_welcome_welcome() {

    'use strict';

// include "infohub_base.js"

    const _Version = function() {
        return {
            'date': '2015-02-12',
            'version': '1.0.0',
            'checksum': '{{checksum}}',
            'class_name': 'infohub_welcome_welcome',
            'note': 'The welcome demo',
            'status': 'normal',
            'SPDX-License-Identifier': 'GPL-3.0-or-later',
            'web_worker': 'true',
            'core_plugin': 'false',
        };
    };

    const _GetCmdFunctions = function() {
        const $list = {
            'create': 'normal',
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
                $parts[$key].substr(1);
        }

        return $response;
    };

    let $classTranslations = {};

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
                'message': 'Nothing to report from welcome_welcome',
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
                        'welcome_text': {
                            'type': 'text',
                            'text': '[logo_icon][h1][title][/h1]\n [i][ingress][/i]\n[columns]\n' +
                                '' +
                                '[/columns]\n[i][my_link][/i]',
                        },
                        'logo_icon': {
                            'type': 'common',
                            'subtype': 'svg',
                            'data': '[logo_asset]',
                        },
                        'logo_asset': {
                            'plugin': 'infohub_asset',
                            'type': 'icon',
                            'asset_name': 'infohub-logo-done',
                            'plugin_name': 'infohub_welcome',
                        },
                        'title': {
                            'type': 'common',
                            'subtype': 'value',
                            'data': _Translate('WELCOME_TO_YOUR_INFOHUB')
                        },
                        'ingress': {
                            'type': 'common',
                            'subtype': 'value',
                            'data': _Translate('WE_ARE_GOING_TO_HAVE_SO_MUCH_FUN.')
                        },
                        'my_link': {
                            'type': 'link',
                            'subtype': 'link',
                            'text': 'Infohub',
                            'data': 'http://www.infohub.se',
                        },
                    },
                    'how': {
                        'mode': 'one box',
                        'text': '[welcome_text]',
                    },
                    'where': {
                        'box_id': $in.parent_box_id + '.form',
                        'max_width': 100,
                        'scroll_to_box_id': 'true',
                    },
                    // 'cache_key': 'welcome' // No need to cache this
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

//# sourceURL=infohub_welcome_welcome.js