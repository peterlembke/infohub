/**
 * infohub_demo_audio
 * Render a audio demo for infohub_demo
 *
 * @package     Infohub
 * @subpackage  infohub_demo_audio
 * @since       2018-04-15
 * @author      Peter Lembke <info@infohub.se>
 * @license     GPL-3.0-or-later
 * @copyright   Copyright (C) 2010- Peter Lembke
 * @see         https://github.com/peterlembke/infohub/blob/main/folder/plugins/infohub/demo/audio/infohub_demo_audio.md Documentation
 * @link        https://infohub.se/ InfoHub main page
 */
function infohub_demo_audio() {

    'use strict';

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
            'class_name': 'infohub_demo_audio',
            'note': 'Render a audio demo for infohub_demo',
            'status': 'normal',
            'SPDX-License-Identifier': 'GPL-3.0-or-later',
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
            'create': 'normal',
        };

        return _GetCmdFunctionsBase($list);
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
            'parent_box_id': '',
            'translations': {},
            'step': 'step_start',
            'response': {
                'answer': 'false',
                'message': 'Nothing to report from infohub_demo_audio',
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
                        'my_text': {
                            'type': 'text',
                            'text': '[h1][titel][/h1]\n [i][ingress][/i]\n[jamendo_album_major][jamendo_major][soundcloud_playlist_major][soundcloud_major][spotify_album_major][spotify_major]\n',
                        },
                        'titel': {
                            'type': 'common',
                            'subtype': 'value',
                            'data': _Translate('WELCOME_TO_INFOHUB_DEMO_AUDIO')
                        },
                        'ingress': {
                            'type': 'common',
                            'subtype': 'join',
                            'data0': _Translate('HERE_ARE_SOME_DEMOS_TO_SHOW_YOU_WHAT_INFOHUB_CAN_DO_WITH_AUDIO.'),
                            'data1': _Translate('INFOHUB_CLIENT_DO_NOT_USE_3RD_PARTY_SERVICES.') + ' ' +
                                _Translate('ALL_DATA_MUST_COME_FROM_THE_SERVER')
                        },
                        'jamendo_album_major': {
                            'plugin': 'infohub_rendermajor',
                            'type': 'presentation_box',
                            'head_label': _SprintF(_Translate('THIS_IS_A_%S'), ['Jamendo audio album']),
                            'foot_text': _SprintF(_Translate('%S_IS_A_3RD_PARTY_AUDIO_STREAMING_SERVICE.'), ['Jamendo']),
                            'content_data': '[jamendo_icon]',
                            'content_embed': '[jamendo_album_audio]',
                            'content_embed_new_tab': '[jamendo_album_audio_link]',
                        },
                        'jamendo_icon': {
                            'type': 'common',
                            'subtype': 'svg',
                            'data': '[jamendo_asset]',
                        },
                        'jamendo_asset': {
                            'plugin': 'infohub_asset',
                            'type': 'icon',
                            'asset_name': 'audio/jamendo-music-logo',
                            'plugin_name': 'infohub_demo',
                        },
                        'jamendo_album_audio': {
                            'type': 'audio',
                            'subtype': 'jamendo',
                            'data': 'album/170617',
                            'label': _Translate('IN_NEW_TAB'),
                            'css_data': {
                                '.right': 'font-size: 1.5em;', // You can add your own css to the default css
                            },
                        },
                        'jamendo_album_audio_link': {
                            'type': 'audio',
                            'subtype': 'jamendolink',
                            'data': 'album/170617',
                            'label': _Translate('IN_NEW_TAB')
                        },
                        'jamendo_major': {
                            'plugin': 'infohub_rendermajor',
                            'type': 'presentation_box',
                            'head_label': _SprintF(_Translate('THIS_IS_A_%S'), ['Jamendo audio track']),
                            'foot_text': _SprintF(_Translate('%S_IS_A_3RD_PARTY_AUDIO_STREAMING_SERVICE.'), ['Jamendo']),
                            'content_data': '[jamendo_icon]',
                            'content_embed': '[jamendo_audio]',
                            'content_embed_new_tab': '[jamendo_audio_link]',
                        },
                        'jamendo_audio': {
                            'type': 'audio',
                            'subtype': 'jamendo',
                            'data': 'track/798935',
                            'label': _Translate('IN_NEW_TAB')
                        },
                        'jamendo_audio_link': {
                            'type': 'audio',
                            'subtype': 'jamendolink',
                            'data': 'track/798935',
                            'label': _Translate('IN_NEW_TAB')
                        },
                        'soundcloud_playlist_major': {
                            'plugin': 'infohub_rendermajor',
                            'type': 'presentation_box',
                            'head_label': _SprintF(_Translate('THIS_IS_A_%S'), ['Soundcloud audio playlist']),
                            'foot_text': _SprintF(_Translate('%S_IS_A_3RD_PARTY_AUDIO_STREAMING_SERVICE.'), ['Soundcloud']),
                            'content_data': '[soundcloud_icon]',
                            'content_embed': '[soundcloud_playlist_audio]',
                            'content_embed_new_tab': '[soundcloud_playlist_audio_link]',
                        },
                        'soundcloud_icon': {
                            'type': 'common',
                            'subtype': 'svg',
                            'data': '[soundcloud_asset]',
                        },
                        'soundcloud_asset': {
                            'plugin': 'infohub_asset',
                            'type': 'icon',
                            'asset_name': 'audio/icons8-soundcloud',
                            'plugin_name': 'infohub_demo',
                        },
                        'soundcloud_playlist_audio': {
                            'type': 'audio',
                            'subtype': 'soundcloud',
                            'data': 'playlists/192596153',
                            'label': _Translate('IN_NEW_TAB')
                        },
                        'soundcloud_playlist_audio_link': {
                            'type': 'audio',
                            'subtype': 'soundcloudlink',
                            'data': 'playlists/192596153',
                            'label': _Translate('IN_NEW_TAB')
                        },
                        'soundcloud_major': {
                            'plugin': 'infohub_rendermajor',
                            'type': 'presentation_box',
                            'head_label': _SprintF(_Translate('THIS_IS_A_%S'), ['Soundcloud audio track']),
                            'foot_text': _SprintF(_Translate('%S_IS_A_3RD_PARTY_AUDIO_STREAMING_SERVICE.'), ['Soundcloud']),
                            'content_data': '[soundcloud_icon]',
                            'content_embed': '[soundcloud_audio]',
                            'content_embed_new_tab': '[soundcloud_audio_link]',
                        },
                        'soundcloud_audio': {
                            'type': 'audio',
                            'subtype': 'soundcloud',
                            'data': 'tracks/202060685',
                            'label': _Translate('IN_NEW_TAB')
                        },
                        'soundcloud_audio_link': {
                            'type': 'audio',
                            'subtype': 'soundcloudlink',
                            'data': 'tracks/202060685',
                            'label': _Translate('IN_NEW_TAB')
                        },
                        'spotify_album_major': {
                            'plugin': 'infohub_rendermajor',
                            'type': 'presentation_box',
                            'head_label': _SprintF(_Translate('THIS_IS_A_%S'), ['Spotify audio album']),
                            'foot_text': _SprintF(_Translate('%S_IS_A_3RD_PARTY_AUDIO_STREAMING_SERVICE.'), ['Spotify']),
                            'content_data': '[spotify_icon]',
                            'content_embed': '[spotify_album_audio]',
                            'content_embed_new_tab': '[spotify_album_audio_link]',
                        },
                        'spotify_album_audio': {
                            'type': 'audio',
                            'subtype': 'spotify',
                            'data': 'album/1CuFf5IslmlCno7DAFjrt9',
                            'label': _Translate('IN_NEW_TAB')
                        },
                        'spotify_album_audio_link': {
                            'type': 'audio',
                            'subtype': 'spotifylink',
                            'data': 'album/1CuFf5IslmlCno7DAFjrt9',
                            'label': _Translate('IN_NEW_TAB')
                        },
                        'spotify_major': {
                            'plugin': 'infohub_rendermajor',
                            'type': 'presentation_box',
                            'head_label': _SprintF(_Translate('THIS_IS_A_%S'), ['Spotify audio track']),
                            'foot_text': _SprintF(_Translate('%S_IS_A_3RD_PARTY_AUDIO_STREAMING_SERVICE.'), ['Spotify']),
                            'content_data': '[spotify_icon]',
                            'content_embed': '[spotify_audio]',
                            'content_embed_new_tab': '[spotify_audio_link]',
                        },
                        'spotify_icon': {
                            'type': 'common',
                            'subtype': 'svg',
                            'data': '[spotify_asset]',
                        },
                        'spotify_asset': {
                            'plugin': 'infohub_asset',
                            'type': 'icon',
                            'asset_name': 'audio/icons8-spotify',
                            'plugin_name': 'infohub_demo',
                        },
                        'spotify_audio': {
                            'type': 'audio',
                            'subtype': 'spotify',
                            'data': 'track/6o56JEMxnUMPmO4qjWnjc9',
                            'label': _Translate('IN_NEW_TAB')
                        },
                        'spotify_audio_link': {
                            'type': 'audio',
                            'subtype': 'spotifylink',
                            'data': 'track/6o56JEMxnUMPmO4qjWnjc9',
                            'label': _Translate('IN_NEW_TAB')
                        }
                    },
                    'how': {
                        'mode': 'one box',
                        'text': '[my_text]',
                    },
                    'where': {
                        'box_id': $in.parent_box_id + '.demo',
                        'max_width': 320,
                        'scroll_to_box_id': 'true',
                    },
                    'cache_key': 'audio',
                },
                'data_back': {'step': 'step_end'},
            });
        }

        return {
            'answer': $in.response.answer,
            'message': $in.response.message,
            'data': $in.response.data,
        };
    };
}

//# sourceURL=infohub_demo_audio.js