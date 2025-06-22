/**
 * infohub_render_audio
 * Render HTML for embedding audio from Jamendo, Soundcloud, Spotify.
 *
 * @package     Infohub
 * @subpackage  infohub_render_audio
 * @since       2014-11-01
 * @author      Peter Lembke <info@infohub.se>
 * @license     GPL-3.0-or-later
 * @copyright   Copyright (C) 2010- Peter Lembke
 */
function infohub_render_audio() {

    'use strict';

    // include "infohub_base.js"

    const _Version = function() {
        return {
            'date': '2018-04-14',
            'since': '2014-11-01',
            'version': '1.0.1',
            'checksum': '{{checksum}}',
            'class_name': 'infohub_render_audio',
            'note': 'Render HTML for embedding audio from Jamendo, Soundcloud, Spotify.',
            'status': 'normal',
            'SPDX-License-Identifier': 'GPL-3.0-or-later',
        };
    };

    const _GetCmdFunctions = function() {
        const $list = {
            'create': 'normal',
        };

        return _GetCmdFunctionsBase($list);
    };

    // ***********************************************************
    // * The private functions, add your own in your plugin
    // * These functions can be used directly in your functions.
    // * Name: _CamelCaseData
    // ***********************************************************

    /**
     * Internal functions must start with a capital letter
     * Used by renderers to get a proper function name
     * @version 2016-10-16
     * @since   2016-10-16
     * @author  Peter Lembke
     * @param $text
     * @return string
     */
    const _GetFuncName = function($text = '') {
        let $response = '';
        let $parts = $text.split('_');

        for (let $key in $parts) {
            if ($parts.hasOwnProperty($key) === false) {
                continue;
            }

            $response = $response + $parts[$key].charAt(0).toUpperCase() +
                $parts[$key].substring(1);
        }

        return $response;
    };

    /**
     * Get the html parameters: id, name, class
     * @version 2017-02-24
     * @since 2017-02-22
     * @param $in
     * @returns {string}
     * @private
     */
    const _GetId = function($in = {}) {
        let $parameter = [];

        const $default = {
            'id': '',
            'name': '',
            'class': '',
        };
        $in = _Default($default, $in);

        if ($in.id !== '') {
            const $id = 'id="{box_id}_' + $in.id + '"';
            $parameter.push($id);
        }

        if ($in.name !== '') {
            const $name = 'name="' + $in.name + '"';
            $parameter.push($name);
        }

        if ($in.class !== '') {
            let $class = $in.class;
            if ($class.charAt(0) == parseInt($class.charAt(0))) {
                $class = 'a' + $class;
            }
            $class = 'class="' + $class + '" ';
            $parameter.push($class);
        }

        return $parameter.join(' ');
    };

    const _GetSandbox = function() {
        const $row = 'sandbox="allow-same-origin allow-scripts"';

        return $row;
    };

    // *****************************************************************************
    // * Functions you only can reach with CMD()
    // * Observe function names are lower_case
    // *****************************************************************************

    $functions.push('create');
    /**
     * Get instructions and create the html
     * @version 2020-12-19
     * @since   2013-04-15
     * @author  Peter Lembke
     * @param $in
     * @returns {{item_index: {}, answer: string, message: string}}
     */
    const create = function($in = {}) {
        const $default = {
            'item_index': {},
            'config': {},
        };
        $in = _Default($default, $in);

        const $defaultResponse = {
            'answer': 'false',
            'message': '',
            'html': '',
            'css_data': {},
        };

        let $itemIndex = {};
        for (const $itemName in $in.item_index) {
            if ($in.item_index.hasOwnProperty($itemName) === false) {
                continue;
            }

            let $data = $in.item_index[$itemName];

            if (_IsSet($data.subtype) === 'false') {
                $data.subtype = 'soundcloud';
            }

            // iframes are deprecated as a security breach. Will show a link instead.
            const $isLink = $data.subtype.substring($data.subtype.length - 4) === 'link';
            if ($isLink === false) {
                $data.subtype = $data.subtype + 'link';
            }

            $data.func = _GetFuncName($data.subtype);
            $data.config = $in.config;

            let $response = internal_Cmd($data);
            $response = _Default($defaultResponse, $response);

            $itemIndex[$itemName] = $response;
        }

        return {
            'answer': 'true',
            'message': 'Here is what I rendered',
            'item_index': $itemIndex,
        };
    };

// *****************************************************************************
// * Internal function that you only can reach from internal_Cmd
// *****************************************************************************

    /**
     * Create HTML for Jamendo
     * @version 2018-04-14
     * @since   2018-04-14
     * @author  Peter Lembke
     */
    const internal_Jamendo = function($in = {}) {
        const $default = {
            'type': 'audio',
            'subtype': 'jamendo',
            'alias': '',
            'class': 'audio',
            'data': 'album/152029', // You can have a track or an album. track/1273394
            'css_data': {},
        };
        $in = _Default($default, $in);

        const $id = _GetId({'id': $in.alias, 'name': $in.alias, 'class': $in.class});
        const $sandbox = _GetSandbox();
        const $html = '<iframe ' + $id + ' width="100%" height="370" src="https://widgets.jamendo.com/v3/' + $in.data + '" ' + $sandbox + '></iframe>';

        let $cssData = $in.css_data;

        if ($in.class === 'audio') {
            $cssData = {
                '.audio': 'width: 100%; clear: both; display: inline-block; box-sizing: border-box; border-radius: 15px 15px 15px 15px;',
            };
            $cssData = _MergeStringData($cssData, $in.css_data);
        }

        return {
            'answer': 'true',
            'message': 'Rendered html for a Jamendo audio',
            'html': $html,
            'css_data': $cssData,
        };
    };

    /**
     * Create HTML for a Jamendo link
     * @version 2018-04-14
     * @since   2018-04-14
     * @author  Peter Lembke
     */
    const internal_Jamendolink = function($in = {}) {
        const $default = {
            'type': 'audio',
            'subtype': 'jamendolink',
            'alias': '',
            'class': 'right',
            'data': 'album/152029', // You can have a track or an album. track/1273394
            'label': 'New tab',
            'css_data': {},
        };
        $in = _Default($default, $in);

        const $id = _GetId(
            {'id': $in.alias, 'name': $in.alias, 'class': $in.class});
        const $html = '<div ' + $id + '><a href="https://www.jamendo.com/' +
            $in.data + '" class="' + $in.class + '" target="_blank">' +
            $in.label + '</a></div>';

        let $cssData = $in.css_data;

        if ($in.class === 'right') {
            $cssData = {
                '.right': 'position: relative; float: right; margin: 3px 3px 0px 3px; color: #1b350a;',
                '.right:hover': 'background: #6d8df7;',
            };
            $cssData = _MergeStringData($cssData, $in.css_data);
        }

        if ($in.class === 'link') {
            $cssData = {
                '.link': 'color: #1b350a;',
                '.link:hover': 'background: #6d8df7;',
            };
            $cssData = _MergeStringData($cssData, $in.css_data);
        }

        return {
            'answer': 'true',
            'message': 'Rendered html for a Jamendo link to a new tab',
            'html': $html,
            'css_data': $cssData,
        };
    };

    /**
     * Create HTML for Soundcloud
     * @version 2014-03-08
     * @since   2014-03-08
     * @author  Peter Lembke
     */
    const internal_Soundcloud = function($in = {}) {
        const $default = {
            'type': 'audio',
            'subtype': 'soundcloud',
            'alias': '',
            'class': 'audio',
            'data': 'tracks/fNDXaRQlaOE', // playlists/192596153
            'css_data': {},
        };
        $in = _Default($default, $in);

        const $id = _GetId(
            {'id': $in.alias, 'name': $in.alias, 'class': $in.class});
        const $sandbox = _GetSandbox();
        const $html = '<iframe ' + $id +
            ' width="100%" height="166" src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/' +
            $in.data +
            '&amp;color=0066cc&amp;auto_play=false&amp;hide_related=false&amp;show_artwork=true&amp;show_user=true&amp;visual=true" ' +
            $sandbox + '></iframe>';

        let $cssData = $in.css_data;

        if ($in.class === 'audio') {
            $cssData = {
                '.audio': 'width: 100%; clear: both; display: inline-block; box-sizing: border-box; border-radius: 15px 15px 15px 15px;',
            };
            $cssData = _MergeStringData($cssData, $in.css_data);
        }

        return {
            'answer': 'true',
            'message': 'Rendered html for a Soundcloud audio',
            'html': $html,
            'css_data': $cssData,
        };
    };

    /**
     * Create HTML for Soundcloud link
     * Note that the data for the embed and the link are different for the same song
     * @version 2016-11-03
     * @since   2016-11-03
     * @author  Peter Lembke
     */
    const internal_Soundcloudlink = function($in = {}) {
        const $default = {
            'type': 'audio',
            'subtype': 'soundcloudlink',
            'alias': '',
            'class': 'right',
            'data': 'chloehowl/paper-heart-clip', // Note that data is different from the embedded content
            'label': 'New tab',
            'css_data': {},
        };
        $in = _Default($default, $in);

        const $id = _GetId(
            {'id': $in.alias, 'name': $in.alias, 'class': $in.class});
        const $html = '<div ' + $id + '><a href="https://soundcloud.com/' +
            $in.data + '" class="' + $in.class + '" target="_blank">' +
            $in.label + '</a></div>';

        let $cssData = $in.css_data;

        if ($in.class === 'right') {
            $cssData = {
                '.right': 'position: relative; float: right; margin: 3px 3px 0px 3px; color: #1b350a;',
                '.right:hover': 'background: #6d8df7;',
            };
            $cssData = _MergeStringData($cssData, $in.css_data);
        }

        if ($in.class === 'link') {
            $cssData = {
                '.link': 'color: #1b350a;',
                '.link:hover': 'background: #6d8df7;',
            };
            $cssData = _MergeStringData($cssData, $in.css_data);
        }

        return {
            'answer': 'true',
            'message': 'Rendered html for a Soundcloud link to a new tab',
            'html': $html,
            'css_data': $cssData,
        };
    };

    /**
     * Create HTML for Spotify
     * @version 2014-03-08
     * @since   2014-03-08
     * @author  Peter Lembke
     */
    const internal_Spotify = function($in = {}) {
        const $default = {
            'type': 'audio',
            'subtype': 'spotify',
            'alias': '',
            'class': 'audio',
            'data': 'track/6o56JEMxnUMPmO4qjWnjc9',
            'css_data': {},
        };
        $in = _Default($default, $in);

        const $id = _GetId({'id': $in.alias, 'name': $in.alias, 'class': $in.class});
        const $sandbox = _GetSandbox();
        const $html = '<iframe ' + $id +
            ' src="https://open.spotify.com/embed/' + $in.data +
            '" height="80" allowtransparency="true" style="border:0;"' +
            $sandbox + '></iframe>';

        // <iframe src="https://open.spotify.com/embed/track/6o56JEMxnUMPmO4qjWnjc9" width="300" height="380" frameborder="0" allowtransparency="true"></iframe>
        // <iframe src="https://open.spotify.com/embed/album/1CuFf5IslmlCno7DAFjrt9" width="300" height="380" frameborder="0" allowtransparency="true"></iframe>

        let $cssData = $in.css_data;

        if ($in.class === 'audio') {
            $cssData = {
                '.audio': 'width: 100%; clear: both; display: inline-block; box-sizing: border-box; border-radius: 15px 15px 15px 15px;',
            };
            $cssData = _MergeStringData($cssData, $in.css_data);
        }

        return {
            'answer': 'true',
            'message': 'Rendered html for a Spotify audio',
            'html': $html,
            'css_data': $cssData,
        };
    };

    /**
     * Create HTML for Spotify link
     * @version 2016-11-03
     * @since   2016-11-03
     * @author  Peter Lembke
     */
    const internal_Spotifylink = function($in = {}) {
        const $default = {
            'type': 'audio',
            'subtype': 'spotifylink',
            'alias': '',
            'class': 'right',
            'data': '88296877',
            'label': 'New tab',
            'css_data': {},
        };
        $in = _Default($default, $in);

        const $id = _GetId(
            {'id': $in.alias, 'name': $in.alias, 'class': $in.class});
        const $html = '<div ' + $id +
            '><a href="https://open.spotify.com/track/' + $in.data +
            '" class="' + $in.class + '" target="_blank">' + $in.label +
            '</a></div>';

        let $cssData = $in.css_data;

        if ($in.class === 'right') {
            $cssData = {
                '.right': 'position: relative; float: right; margin: 3px 3px 0px 3px; color: #1b350a;',
                '.right:hover': 'background: #6d8df7;',
            };
            $cssData = _MergeStringData($cssData, $in.css_data);
        }

        if ($in.class === 'link') {
            $cssData = {
                '.link': 'color: #1b350a;',
                '.link:hover': 'background: #6d8df7;',
            };
            $cssData = _MergeStringData($cssData, $in.css_data);
        }

        return {
            'answer': 'true',
            'message': 'Rendered html for a Spotify link to a new tab',
            'html': $html,
            'css_data': $cssData,
        };
    };
}

//# sourceURL=infohub_render_audio.js