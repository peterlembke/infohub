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
function infohub_demo_audio() {

// include "infohub_base.js"

    /*jshint evil:true */
    /*jshint devel:true */
    /*jslint browser: true, evil: true, plusplus: true, todo: true */

    const _Version = function() {
        return {
            'date': '2019-03-28',
            'since': '2018-04-15',
            'version': '2.0.0',
            'checksum': '{{checksum}}',
            'class_name': 'infohub_demo_audio',
            'note': 'Render a audio demo for infohub_demo',
            'status': 'normal',
            'license_name': 'GNU GPL 3 or later'
        };
    };

    const _GetCmdFunctions = function() {
        return {
            'create': 'normal'
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
        if (typeof $classTranslations !== 'object') {
            return $string;
        }

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
        "use strict";

        const $default = {
            'parent_box_id': '',
            'translations': {},
            'step': 'step_start',
            'response': {
                'answer': 'false',
                'message': 'Nothing to report from infohub_demo_audio'
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
                            'text': "[h1][titel][/h1]\n [i][ingress][/i]\n[jamendo_album_major][jamendo_major][soundcloud_playlist_major][soundcloud_major][spotify_album_major][spotify_major]\n"
                        },
                        'titel': {
                            'type': 'common',
                            'subtype': 'value',
                            'data': _Translate('Welcome to InfoHub Demo Audio')
                        },
                        'ingress': {
                            'type': 'common',
                            'subtype': 'value',
                            'data': _Translate('Here are some demos to show you what Infohub can do with embedded Audio. You should ALWAYS use a presentation box for 3rd party material because you then give the user an option not to click.')
                        },
                        'jamendo_album_major': {
                            'plugin': 'infohub_rendermajor',
                            'type': 'presentation_box',
                            'head_label': _Translate('This is a Jamendo audio album'),
                            'foot_text': _Translate('Jamendo is a 3rd party audio streaming service. Use it in a presentation box.'),
                            'content_data': '[jamendo_icon]',
                            'content_embed': '[jamendo_album_audio]',
                            'content_embed_new_tab': '[jamendo_album_audio_link]'
                        },
                        'jamendo_icon': {
                            'type': 'common',
                            'subtype': 'svg',
                            'data': '[jamendo_asset]'
                        },
                        'jamendo_asset': {
                            'plugin': 'infohub_asset',
                            'type': 'icon',
                            'asset_name': 'audio/jamendo-music-logo',
                            'plugin_name': 'infohub_demo'
                        },
                        'jamendo_album_audio': {
                            'type': 'audio',
                            'subtype': 'jamendo',
                            'data': 'album/170617'
                        },
                        'jamendo_album_audio_link': {
                            'type': 'audio',
                            'subtype': 'jamendolink',
                            'data': 'album/170617',
                            'label': 'In new tab'
                        },
                        'jamendo_major': {
                            'plugin': 'infohub_rendermajor',
                            'type': 'presentation_box',
                            'head_label': _Translate('This is a Jamendo audio track'),
                            'foot_text': _Translate('Jamendo is a 3rd party audio streaming service. Use it in a presentation box.'),
                            'content_data': '[jamendo_icon]',
                            'content_embed': '[jamendo_audio]',
                            'content_embed_new_tab': '[jamendo_audio_link]'
                        },
                        'jamendo_audio': {
                            'type': 'audio',
                            'subtype': 'jamendo',
                            'data': 'track/798935'
                        },
                        'jamendo_audio_link': {
                            'type': 'audio',
                            'subtype': 'jamendolink',
                            'data': 'track/798935',
                            'label': 'In new tab'
                        },
                        'soundcloud_playlist_major': {
                            'plugin': 'infohub_rendermajor',
                            'type': 'presentation_box',
                            'head_label': _Translate('This is a Soundcloud audio playlist'),
                            'foot_text': _Translate('Soundcloud is a 3rd party audio streaming service. Use it in a presentation box.'),
                            'content_data': '[soundcloud_icon]',
                            'content_embed': '[soundcloud_playlist_audio]',
                            'content_embed_new_tab': '[soundcloud_playlist_audio_link]'
                        },
                        'soundcloud_icon': {
                            'type': 'common',
                            'subtype': 'svg',
                            'data': '[soundcloud_asset]'
                        },
                        'soundcloud_asset': {
                            'plugin': 'infohub_asset',
                            'type': 'icon',
                            'asset_name': 'audio/icons8-soundcloud',
                            'plugin_name': 'infohub_demo'
                        },
                        'soundcloud_playlist_audio': {
                            'type': 'audio',
                            'subtype': 'soundcloud',
                            'data': 'playlists/192596153'
                        },
                        'soundcloud_playlist_audio_link': {
                            'type': 'audio',
                            'subtype': 'soundcloudlink',
                            'data': 'playlists/192596153',
                            'label': 'In new tab'
                        },
                        'soundcloud_major': {
                            'plugin': 'infohub_rendermajor',
                            'type': 'presentation_box',
                            'head_label': _Translate('This is a Soundcloud audio track'),
                            'foot_text': _Translate('Soundcloud is a 3rd party audio streaming service. Use it in a presentation box.'),
                            'content_data': '[soundcloud_icon]',
                            'content_embed': '[soundcloud_audio]',
                            'content_embed_new_tab': '[soundcloud_audio_link]'
                        },
                        'soundcloud_audio': {
                            'type': 'audio',
                            'subtype': 'soundcloud',
                            'data': 'tracks/202060685'
                        },
                        'soundcloud_audio_link': {
                            'type': 'audio',
                            'subtype': 'soundcloudlink',
                            'data': 'tracks/202060685',
                            'label': 'In new tab'
                        },
                        'spotify_album_major': {
                            'plugin': 'infohub_rendermajor',
                            'type': 'presentation_box',
                            'head_label': _Translate('This is a Spotify audio album'),
                            'foot_text': _Translate('Spotify is a 3rd party audio streaming service. Use it in a presentation box.'),
                            'content_data': '[spotify_icon]',
                            'content_embed': '[spotify_album_audio]',
                            'content_embed_new_tab': '[spotify_album_audio_link]'
                        },
                        'spotify_album_audio': {
                            'type': 'audio',
                            'subtype': 'spotify',
                            'data': 'album/1CuFf5IslmlCno7DAFjrt9'
                        },
                        'spotify_album_audio_link': {
                            'type': 'audio',
                            'subtype': 'spotifylink',
                            'data': 'album/1CuFf5IslmlCno7DAFjrt9',
                            'label': 'In new tab'
                        },
                        'spotify_major': {
                            'plugin': 'infohub_rendermajor',
                            'type': 'presentation_box',
                            'head_label': _Translate('This is a Spotify audio track'),
                            'foot_text': _Translate('Spotify is a 3rd party audio streaming service. Use it in a presentation box.'),
                            'content_data': '[spotify_icon]',
                            'content_embed': '[spotify_audio]',
                            'content_embed_new_tab': '[spotify_audio_link]'
                        },
                        'spotify_icon': {
                            'type': 'common',
                            'subtype': 'svg',
                            'data': '[spotify_asset]'
                        },
                        'spotify_asset': {
                            'plugin': 'infohub_asset',
                            'type': 'icon',
                            'asset_name': 'audio/icons8-spotify',
                            'plugin_name': 'infohub_demo'
                        },
                        'spotify_audio': {
                            'type': 'audio',
                            'subtype': 'spotify',
                            'data': 'track/6o56JEMxnUMPmO4qjWnjc9'
                        },
                        'spotify_audio_link': {
                            'type': 'audio',
                            'subtype': 'spotifylink',
                            'data': 'track/6o56JEMxnUMPmO4qjWnjc9',
                            'label': 'In new tab'
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
//# sourceURL=infohub_demo_audio.js