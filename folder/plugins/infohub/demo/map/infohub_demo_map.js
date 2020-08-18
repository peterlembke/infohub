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
function infohub_demo_map() {

    "use strict";

// include "infohub_base.js"

    const _Version = function() {
        return {
            'date': '2019-03-28',
            'since': '2018-04-15',
            'version': '2.0.0',
            'checksum': '{{checksum}}',
            'class_name': 'infohub_demo_map',
            'note': 'Render a map demo for infohub_demo',
            'status': 'normal',
            'SPDX-License-Identifier': 'GPL-3.0-or-later'
        };
    };

    const _GetCmdFunctions = function() {
        const $list = {
            'create': 'normal'
        };

        return _GetCmdFunctionsBase($list);
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
        const $default = {
            'parent_box_id': '',
            'translations': {},
            'step': 'step_start',
            'response': {
                'answer': 'false',
                'message': 'Nothing to report from infohub_demo_map'
            }
        };
        $in = _Default($default, $in);

        if ($in.step === 'step_start') 
        {
            $classTranslations = $in.translations;
            
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_render',
                    'function': 'create'
                },
                'data': {
                    'what': {
                        'my_text': {
                            'type': 'text',
                            'text': "[h1][titel][/h1]\n [i][ingress][/i]\n[openstreetmap_major][googlemaps_major][bing_major]\n"
                        },
                        'titel': {
                            'type': 'common',
                            'subtype': 'value',
                            'data': _Translate('Welcome to InfoHub Demo Map')
                        },
                        'ingress': {
                            'type': 'common',
                            'subtype': 'join',
                            'data0': _Translate('Here are some demos to show you what Infohub can do with maps.'),
                            'data1': _Translate('Infohub Client do not use 3rd party services. All data must come from the server')
                        },
                        'openstreetmap_major': {
                            'plugin': 'infohub_rendermajor',
                            'type': 'presentation_box',
                            'head_label': _SprintF(_Translate('This is a %s'), ['Openstreet map']),
                            'foot_text': _SprintF(_Translate('%s is a 3rd party map streaming service.'), ['Openstreetmap']),
                            'content_data': '[openstreetmap_icon]',
                            'content_embed': '[openstreetmap_map]',
                            'content_embed_new_tab': '[openstreetmap_map_link]'
                        },
                        'openstreetmap_icon': {
                            'type': 'common',
                            'subtype': 'svg',
                            'data': '[openstreetmap_asset]'
                        },
                        'openstreetmap_asset': {
                            'plugin': 'infohub_asset',
                            'type': 'icon',
                            'asset_name': 'map/openstreetmap',
                            'plugin_name': 'infohub_demo'
                        },
                        'openstreetmap_map': {
                            'type': 'map',
                            'subtype': 'openstreetmap',
                            'point_latitude': '59.294597',
                            'point_longitude': '18.156281',
                            'label': _Translate('In new tab')
                        },
                        'openstreetmap_map_link': {
                            'type': 'map',
                            'subtype': 'openstreetmaplink',
                            'point_latitude': '59.294597',
                            'point_longitude': '18.156281',
                            'label': _Translate('In new tab')
                        },
                        'googlemaps_major': {
                            'plugin': 'infohub_rendermajor',
                            'type': 'presentation_box',
                            'head_label': _SprintF(_Translate('This is a %s'), ['Googlemaps']),
                            'foot_text': _SprintF(_Translate('%s is a 3rd party map streaming service.'), ['Googlemaps']),
                            'content_data': '[googlemaps_icon]',
                            'content_embed': '[googlemaps_map]',
                            'content_embed_new_tab': '[googlemaps_map_link]'
                        },
                        'googlemaps_icon': {
                            'type': 'common',
                            'subtype': 'svg',
                            'data': '[googlemaps_asset]'
                        },
                        'googlemaps_asset': {
                            'plugin': 'infohub_asset',
                            'type': 'icon',
                            'asset_name': 'map/icons8-google-maps',
                            'plugin_name': 'infohub_demo'
                        },
                        'googlemaps_map': {
                            'type': 'map',
                            'subtype': 'googlemaps',
                            'point_latitude': '59.294597',
                            'point_longitude': '18.156281',
                            'label': _Translate('In new tab')
                        },
                        'googlemaps_map_link': {
                            'type': 'map',
                            'subtype': 'googlemapslink',
                            'point_latitude': '59.294597',
                            'point_longitude': '18.156281',
                            'label': _Translate('In new tab')
                        },
                        'bing_major': {
                            'plugin': 'infohub_rendermajor',
                            'type': 'presentation_box',
                            'head_label': _SprintF(_Translate('This is a %s'), ['Bing map']),
                            'foot_text': _SprintF(_Translate('%s is a 3rd party map streaming service.'), ['Bing map']),
                            'content_data': '[bing_icon]',
                            'content_embed': '[bing_map]',
                            'content_embed_new_tab': '[bing_map_link]'
                        },
                        'bing_icon': {
                            'type': 'common',
                            'subtype': 'svg',
                            'data': '[bing_asset]'
                        },
                        'bing_asset': {
                            'plugin': 'infohub_asset',
                            'type': 'icon',
                            'asset_name': 'map/icons8-bing',
                            'plugin_name': 'infohub_demo'
                        },
                        'bing_map': {
                            'type': 'map',
                            'subtype': 'bingmaps',
                            'point_latitude': '59.294597',
                            'point_longitude': '18.156281',
                            'height': '500',
                            'width': '500',
                            'label': _Translate('In new tab')
                        },
                        'bing_map_link': {
                            'type': 'map',
                            'subtype': 'bingmapslink',
                            'point_latitude': '59.294597',
                            'point_longitude': '18.156281',
                            'label': _Translate('In new tab')
                        }
                    },
                    'how': {
                        'mode': 'one box',
                        'text': '[my_text]'
                    },
                    'where': {
                        'box_id': $in.parent_box_id + '.demo',
                        'max_width': 320,
                        'scroll_to_box_id': 'true'
                    },
                    'cache_key': 'map'
                },
                'data_back': {'step': 'step_end'}
            });
        }

        return {
            'answer': $in.response.answer,
            'message': $in.response.message,
            'data': $in.response.data
        };
    };
}
//# sourceURL=infohub_demo_map.js