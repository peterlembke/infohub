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
function infohub_welcome_youcan() {

// include "infohub_base.js"

    /*jshint evil:true */
    /*jshint devel:true */
    /*jslint browser: true, evil: true, plusplus: true, todo: true */

    const _Version = function() {
        return {
            'date': '2019-10-06',
            'since': '2015-02-12',
            'version': '1.0.0',
            'checksum': '{{checksum}}',
            'class_name': 'infohub_welcome_youcan',
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
        const $response = internal_Cmd($in);

        return {
            'answer': $response.answer,
            'message': $response.message,
            'data': $response.data
        };
    };

    $functions.push("internal_Youcan");
    const internal_Youcan = function ($in)
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
                        'text': "[h1][title][/h1][i][ingress][/i][columns][calendar][tree][body][story][shop][/columns]"
                    },
                    'title': {
                        'type': 'common',
                        'subtype': 'value',
                        'data': _Translate('You can, -with Infohub')
                    },
                    'ingress': {
                        'type': 'common',
                        'subtype': 'value',
                        'data': ''
                    },
                    'calendar': {
                        'type': 'common',
                        'subtype': 'join',
                        'title': _Translate('Calendar'),
                        'data0': '[calendar_image_data]',
                        'data1': _Translate('Write and find data in your calendar. History and future is just as important. Do not miss name days, birthdays, anniversaries, holidays, events. You can see times for the sun and moon. Links to Wikipedia for names and holidays so you can read more.')
                    },
                    'calendar_image_data': {
                        'type': 'common',
                        'subtype': 'image',
                        'data': '[calendar_image_data_asset]'
                    },
                    'calendar_image_data_asset': {
                        'plugin': 'infohub_asset',
                        'type': 'image',
                        'subtype': 'jpeg',
                        'asset_name': 'youcan/calendar',
                        'plugin_name': 'infohub_welcome'
                    },
                    'tree': {
                        'type': 'common',
                        'subtype': 'join',
                        'title': _Translate('Tree'),
                        'data0': '[tree_image_data]',
                        'data1': _Translate('With Tree you start with yourself and make bubbles on subjects around you. You could create a bubble for your cars. During your lifetime you might own more than one car and create a bubble for each car. Perhaps attach a photo and fill with any data you like. Perhaps you want a service bubble in your car to register all service you have done. When did you go to the dentist? You can create any bubble and fill the bubble with data and link to other bubbles. You can create a web with bubbles and connections - your life experiences.')
                    },
                    'tree_image_data': {
                        'type': 'common',
                        'subtype': 'image',
                        'data': '[tree_image_data_asset]'
                    },
                    'tree_image_data_asset': {
                        'plugin': 'infohub_asset',
                        'type': 'image',
                        'subtype': 'jpeg',
                        'asset_name': 'youcan/tree',
                        'plugin_name': 'infohub_welcome'
                    },
                    'body': {
                        'type': 'common',
                        'subtype': 'join',
                        'title': _Translate('Body'),
                        'data0': '[body_image_data]',
                        'data1': _Translate('You are important! You can not exist without your body. That makes also your body important! With Body you get practical tips how you can improve your health. You can track your improvements. It is the small decisions you do every day that make a difference in your life.')
                    },
                    'body_image_data': {
                        'type': 'common',
                        'subtype': 'image',
                        'data': '[body_image_data_asset]'
                    },
                    'body_image_data_asset': {
                        'plugin': 'infohub_asset',
                        'type': 'image',
                        'subtype': 'jpeg',
                        'asset_name': 'youcan/body',
                        'plugin_name': 'infohub_welcome'
                    },
                    'story': {
                        'type': 'common',
                        'subtype': 'join',
                        'title': _Translate('Story editor'),
                        'data0': '[story_image_data]',
                        'data1': _Translate('Put together an article with text, images, image texts, links, titles, ingress, bullet lists, code examples. You can then export your story and use it outside of InfoHub or store it in your Tree.')
                    },
                    'story_image_data': {
                        'type': 'common',
                        'subtype': 'image',
                        'data': '[story_image_data_asset]'
                    },
                    'story_image_data_asset': {
                        'plugin': 'infohub_asset',
                        'type': 'image',
                        'subtype': 'jpeg',
                        'asset_name': 'youcan/story',
                        'plugin_name': 'infohub_welcome'
                    },
                    'shop': {
                        'type': 'common',
                        'subtype': 'join',
                        'title': _Translate('Shop'),
                        'data0': '[shop_image_data]',
                        'data1': _Translate('Shop trough Infohub is smooth and fast because it uses the full capacity of your computer/phone and is kid to your download quota. You have the same features on all shops and they all work the same. The shop benefit of this because more customers can shop att the same time before their server get strained.')
                    },
                    'shop_image_data': {
                        'type': 'common',
                        'subtype': 'image',
                        'data': '[shop_image_data_asset]'
                    },
                    'shop_image_data_asset': {
                        'plugin': 'infohub_asset',
                        'type': 'image',
                        'subtype': 'jpeg',
                        'asset_name': 'youcan/shop',
                        'plugin_name': 'infohub_welcome'
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
//# sourceURL=infohub_welcome_youcan.js