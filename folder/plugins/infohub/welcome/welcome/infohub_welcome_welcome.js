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
function infohub_welcome_welcome() {

// include "infohub_base.js"

    /*jshint evil:true */
    /*jshint devel:true */
    /*jslint browser: true, evil: true, plusplus: true, todo: true */

    const _Version = function() {
        return {
            'date': '2015-02-12',
            'version': '1.0.0',
            'checksum': '{{checksum}}',
            'class_name': 'infohub_welcome_welcome',
            'note': 'The welcome demo',
            'status': 'normal',
            'license_name': 'GNU GPL 3 or later'
        };
    };

    const _GetCmdFunctions = function() {
        return {
            'create': 'normal'
        };
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
    const _GetFuncName = function($text)
    {
        "use strict";

        let $response = '';
        const $parts = $text.split('_');

        for (let $key in $parts)
        {
            if ($parts.hasOwnProperty($key) === false) {
                continue;
            }
            $response = $response + $parts[$key].charAt(0).toUpperCase() + $parts[$key].substr(1);
        }

        return $response;
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

        $in = _ByVal($in);

        $classTranslations = $in.translations;

        $in.func = _GetFuncName($in.subtype);
        let $response = internal_Cmd($in);

        return {
            'answer': $response.answer,
            'message': $response.message,
            'data': $response.data
        };
    };

    $functions.push("internal_Welcome");
    const internal_Welcome = function ($in)
    {
        "use strict";

        const $default = {
            'subtype': 'menu',
            'parent_box_id': ''
        };
        $in = _Default($default, $in);

        const $data = {
            'to': {
                'node': 'client',
                'plugin': 'infohub_render',
                'function': 'create'
            },
            'data': {
                'what': {
                    'welcome_text': {
                        'type': 'text',
                        'text': "[logo_icon][h1][title][/h1]\n [i][ingress][/i]\n[columns]\n" +
                        "" +
                        "[/columns]\n[i][my_link][/i]"
                    },
                    'logo_icon': {
                        'type': 'common',
                        'subtype': 'svg',
                        'data': '[logo_asset]'
                    },
                    'logo_asset': {
                        'plugin': 'infohub_asset',
                        'type': 'icon',
                        'asset_name': 'infohub-logo-done',
                        'plugin_name': 'infohub_welcome'
                    },
                    'title': {
                        'type': 'common',
                        'subtype': 'value',
                        'data': _Translate('Welcome to your Infohub')
                    },
                    'ingress': {
                        'type': 'common',
                        'subtype': 'value',
                        'data': _Translate('We are going to have so much fun.')
                    },
                    'my_link': {
                        'type': 'link',
                        'subtype': 'link',
                        'text': 'Infohub',
                        'data': 'http://www.infohub.se'
                    }
                },
                'how': {
                    'mode': 'one box',
                    'text': '[welcome_text]'
                },
                'where': {
                    'box_id': $in.parent_box_id + '.form',
                    'max_width': 100,
                    'scroll_to_box_id': 'true'
                }
            },
            'data_back': {
                'step': 'step_end'
            }
        };

        return {
            'answer': 'true',
            'message': 'Here are the render data that will create a welcome text',
            'data': $data
        };

    };
}
//# sourceURL=infohub_welcome_welcome.js