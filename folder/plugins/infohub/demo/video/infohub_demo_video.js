/**
 * Render a video demo for infohub_demo
 *
 * @author      Peter Lembke <info@infohub.se>
 * @version     2020-07-05
 * @since       2018-04-15
 * @copyright   Copyright (c) 2018, Peter Lembke
 * @license     https://opensource.org/licenses/gpl-license.php GPL-3.0-or-later
 * @see         https://github.com/peterlembke/infohub/blob/master/folder/plugins/infohub/demo/video/infohub_demo_video.md Documentation
 * @link        https://infohub.se/ InfoHub main page
 */
function infohub_demo_video() {

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
            'date': '2020-07-05',
            'since': '2018-04-15',
            'version': '2.0.1',
            'checksum': '{{checksum}}',
            'class_name': 'infohub_demo_video',
            'note': 'Render a video demo for infohub_demo',
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
     * @version 2019-03-28
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
                        'all_text': {
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
                            'subtype': 'join',
                            'data0': _Translate('Here are some demos to show you what Infohub can do with video.'),
                            'data1': _Translate('Infohub Client do not use 3rd party services. All data must come from the server')
                        },
                        'my_text': {
                            'type': 'common',
                            'subtype': 'join',
                            'data0': _Translate('First we have a Youtube presentation box.'),
                            'data1': ' [youtube_major] ',
                            'data2': _Translate('And then we have a Vimeo video'),
                            'data3': ' [vimeo_major] ',
                            'data4': _Translate('And here we have a Daily motion video.'),
                            'data5': ' [dailymotion_major]'
                        },
                        'youtube_major': {
                            'plugin': 'infohub_rendermajor',
                            'type': 'presentation_box',
                            'head_label': _SprintF(_Translate('This is a %s'), ['Youtube video']),
                            'foot_text': _SprintF(_Translate('%s is a 3rd party video streaming service.'), ['Youtube']),
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
                            'data': 'uRFe0SkFcxo',
                            'label': _Translate('In new tab')
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
                            'head_label': _SprintF(_Translate('This is a %s'), ['Vimeo video']),
                            'foot_text': _SprintF(_Translate('%s is a 3rd party video streaming service.'), ['Vimeo']),
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
                            'data': '77230649',
                            'label': _Translate('In new tab')
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
                            'head_label': _SprintF(_Translate('This is a %s'), ['Daily motion video']),
                            'foot_text': _SprintF(_Translate('%s is a 3rd party video streaming service.'), ['Daily motion']),
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
                            'data': 'x4iddyo',
                            'label': _Translate('In new tab')
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
                        'text': '[all_text]'
                    },
                    'where': {
                        'box_id': $in.parent_box_id + '.demo',
                        'max_width': 480,
                        'scroll_to_box_id': 'true'
                    },
                    'cache_key': 'video'
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