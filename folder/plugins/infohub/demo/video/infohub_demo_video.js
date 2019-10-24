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
function infohub_demo_video() {

// include "infohub_base.js"

    // ***********************************************************
    // * jshint.com options to suppress some warnings
    // ***********************************************************

    /*jshint evil:true */
    /*jshint devel:true */
    /*jslint browser: true, evil: true, plusplus: true, todo: true */

    // ***********************************************************
    // * your private class variables below, only declare with var
    // ***********************************************************

    var _Version = function() {
        return {
            'date': '2019-03-28',
            'since': '2018-04-15',
            'version': '2.0.0',
            'checksum': '{{checksum}}',
            'class_name': 'infohub_demo_video',
            'note': 'Render a video demo for infohub_demo',
            'status': 'normal',
            'license_name': 'GNU GPL 3 or later'
        };
    };

    var _GetCmdFunctions = function() {
        return {
            'create': 'normal'
        };
    };

    var $classTranslations = {};

    /**
     * Translate - Substitute a string for another string using a class local object
     * @param {type} $string
     * @returns string
     */
    $functions.push('_Translate');
    var _Translate = function ($string) 
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
     * @version 2019-03-28
     * @since   2016-10-16
     * @author  Peter Lembke
     */
    $functions.push('create');
    var create = function ($in)
    {
        "use strict";
        var $default = {
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
                            'text': "[h1][titel][/h1]\n [i][ingress][/i]\n[my_text]\n"
                        },
                        'titel': {
                            'type': 'common',
                            'subtype': 'value',
                            'data': _Translate('Welcome to InfoHub Demo Video')
                        },
                        'ingress': {
                            'type': 'common',
                            'subtype': 'value',
                            'data': _Translate('Here are some demos to show you what Infohub can do with embedded Video. You should ALWAYS use a presentation box for 3rd party material because you then give the user an option not to click.')
                        },
                        'my_text': {
                            'type': 'common',
                            'subtype': 'value',
                            'data': _Translate('First we have a Youtube presentation box. [youtube_major] And then we have a Vimeo video [vimeo_major] And here we have a Daily motion video. [dailymotion_major]')
                        },
                        'youtube_major': {
                            'plugin': 'infohub_rendermajor',
                            'type': 'presentation_box',
                            'head_label': _Translate('This is a Youtube video'),
                            'foot_text': _Translate('Youtube is a 3rd party video streaming service. Use it in a presentation box.'),
                            'content_data': '[youtube_icon]',
                            'content_embed': '[youtube_video]',
                            'content_embed_new_tab': '[youtube_video_link]'
                        },
                        'youtube_icon': {
                            'type': 'common',
                            'subtype': 'svg',
                            'data': '[youtube_asset]'
                        },
                        'youtube_asset': {
                            'plugin': 'infohub_asset',
                            'type': 'icon',
                            'asset_name': 'video/icons8-youtube',
                            'plugin_name': 'infohub_demo'
                        },
                        'youtube_video': {
                            'type': 'video',
                            'subtype': 'youtube',
                            'data': 'uRFe0SkFcxo'
                        },
                        'youtube_video_link': {
                            'type': 'video',
                            'subtype': 'youtubelink',
                            'data': 'uRFe0SkFcxo',
                            'label': _Translate('In new tab')
                        },
                        'vimeo_major': {
                            'plugin': 'infohub_rendermajor',
                            'type': 'presentation_box',
                            'head_label': _Translate('This is a Vimeo video'),
                            'foot_text': _Translate('Vimeo is a 3rd party video streaming service. Use it in a presentation box.'),
                            'content_data': '[vimeo_icon]',
                            'content_embed': '[vimeo_video]',
                            'content_embed_new_tab': '[vimeo_video_link]'
                        },
                        'vimeo_icon': {
                            'type': 'common',
                            'subtype': 'svg',
                            'data': '[vimeo_asset]'
                        },
                        'vimeo_asset': {
                            'plugin': 'infohub_asset',
                            'type': 'icon',
                            'asset_name': 'video/icons8-vimeo',
                            'plugin_name': 'infohub_demo'
                        },
                        'vimeo_video': {
                            'type': 'video',
                            'subtype': 'vimeo',
                            'data': '77230649'
                        },
                        'vimeo_video_link': {
                            'type': 'video',
                            'subtype': 'vimeolink',
                            'data': '77230649',
                            'label': _Translate('In new tab')
                        },
                        'dailymotion_major': {
                            'plugin': 'infohub_rendermajor',
                            'type': 'presentation_box',
                            'head_label': _Translate('This is a Daily motion video'),
                            'foot_text': _Translate('Daily motion is a 3rd party video streaming service. Use it in a presentation box.'),
                            'content_data': '[dailymotion_icon]',
                            'content_embed': '[dailymotion_video]',
                            'content_embed_new_tab': '[dailymotion_video_link]'
                        },
                        'dailymotion_icon': {
                            'type': 'common',
                            'subtype': 'svg',
                            'data': '[dailymotion_asset]'
                        },
                        'dailymotion_asset': {
                            'plugin': 'infohub_asset',
                            'type': 'icon',
                            'asset_name': 'video/icons8-popcorn-time',
                            'plugin_name': 'infohub_demo'
                        },
                        'dailymotion_video': {
                            'type': 'video',
                            'subtype': 'dailymotion',
                            'data': 'x4iddyo'
                        },
                        'dailymotion_video_link': {
                            'type': 'video',
                            'subtype': 'dailymotionlink',
                            'data': 'x4iddyo',
                            'label': _Translate('In new tab')
                        }
                    },
                    'how': {
                        'mode': 'one box',
                        'text': '[my_text]'
                    },
                    'where': {
                        'box_id': $in.parent_box_id + '.demo',
                        'max_width': 480,
                        'scroll_to_box_id': 'true'
                    }
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
//# sourceURL=infohub_demo_video.js