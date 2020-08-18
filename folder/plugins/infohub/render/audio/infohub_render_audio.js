/**
 * infohub_render_audio.js render audio html
 * @category InfoHub
 * @package render
 * @copyright Copyright (c) 2010-, Peter Lembke, CharZam soft
 * @author Peter Lembke <peter.lembke@infohub.se>
 * @link https://infohub.se/ InfoHub main page
 * @license InfoHub is distributed under the terms of the GNU General Public License
 * InfoHub is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * InfoHub is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 * You should have received a copy of the GNU General Public License
 * along with InfoHub.    If not, see <https://www.gnu.org/licenses/>.
 */
function infohub_render_audio() {

    "use strict";

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
            'SPDX-License-Identifier': 'GPL-3.0-or-later'
        };
    };

    const _GetCmdFunctions = function() {
        const $list = {
            'create': 'normal'
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
    const _GetFuncName = function($text)
    {
        let $response = '';
        let $parts = $text.split('_');

        for (let $key in $parts)
        {
            if ($parts.hasOwnProperty($key) === false) {
                continue;
            }

            $response = $response + $parts[$key].charAt(0).toUpperCase() + $parts[$key].substr(1);
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
    const _GetId = function ($in)
    {
        let $parameter = [];

        const $default = {
            'id': '',
            'name': '',
            'class': ''
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
    
    const _GetSandbox = function ()
    {
        const $row = 'sandbox="allow-same-origin allow-scripts"';

        return $row;
    };

    // *****************************************************************************
    // * Functions you only can reach with CMD()
    // * Observe function names are lower_case
    // *****************************************************************************

    /**
     * Get instructions and create the message to InfoHub View
     * @version 2013-04-15
     * @since   2013-04-15
     * @author  Peter Lembke
     */
    $functions.push('create'); // Enable this function
    const create = function ($in)
    {
        if (_IsSet($in.subtype) === 'false') {
            $in.subtype = 'soundcloud';
        }

        // iframes are deprecated as a security breach. Will show a link instead.
        if ($in.subtype.substr($in.subtype.length-4,4) !== 'link') {
            $in.subtype = $in.subtype + 'link';
        }

        $in.func = _GetFuncName($in.subtype);
        let $response = internal_Cmd($in);

        const $default = {
            'answer': 'false',
            'message': '',
            'html': '',
            'css_data': {}
        };
        $response = _Default($default, $response);

        return {
            'answer': $response.answer,
            'message': $response.message,
            'html': $response.html,
            'css_data': $response.css_data
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
    const internal_Jamendo = function ($in)
    {
        const $default = {
            'type': 'audio',
            'subtype': 'jamendo',
            'alias': '',
            'class': 'audio',
            'data': 'album/152029' // You can have a track or an album. track/1273394
        };
        $in = _Default($default, $in);

        const $id = _GetId({'id': $in.alias, 'name': $in.alias, 'class': $in.class });
        const $sandbox = _GetSandbox();
        const $html = '<iframe ' + $id + ' width="100%" height="370" scrolling="no" frameborder="no" src="https://widgets.jamendo.com/v3/'+ $in.data + '" '+$sandbox+'></iframe>';

        return {
            'answer': 'true',
            'message': 'Rendered html for a Jamendo audio',
            'html': $html,
            'css_data': {
                '.audio': 'width: 100%; clear: both; display: inline-block; box-sizing: border-box; border-radius: 15px 15px 15px 15px;'
            }
        };
    };

    /**
     * Create HTML for a Jamendo link
     * @version 2018-04-14
     * @since   2018-04-14
     * @author  Peter Lembke
     */
    const internal_Jamendolink = function ($in)
    {
        const $default = {
            'type': 'audio',
            'subtype': 'jamendolink',
            'alias': '',
            'class': 'right',
            'data': 'album/152029', // You can have a track or an album. track/1273394
            'label': 'New tab'
        };
        $in = _Default($default, $in);

        const $id = _GetId({'id': $in.alias, 'name': $in.alias, 'class': $in.class });
        const $html = '<div ' + $id + '><a href="https://www.jamendo.com/' + $in.data + '" target="_blank">' + $in.label + '</a></div>';

        let $cssData = {};

        if ($in.class === 'right') {
            $cssData = {
                '.right': 'position: relative; float: right; margin: 3px 3px 0px 3px;'
            };
        }

        return {
            'answer': 'true',
            'message': 'Rendered html for a Jamendo link to a new tab',
            'html': $html,
            'css_data': $cssData
        };
    };

    /**
     * Create HTML for Soundcloud
     * @version 2014-03-08
     * @since   2014-03-08
     * @author  Peter Lembke
     */
    const internal_Soundcloud = function ($in)
    {
        const $default = {
            'type': 'audio',
            'subtype': 'soundcloud',
            'alias': '',
            'class': 'audio',
            'data': 'tracks/fNDXaRQlaOE' // playlists/192596153
        };
        $in = _Default($default, $in);

        const $id = _GetId({'id': $in.alias, 'name': $in.alias, 'class': $in.class });
        const $sandbox = _GetSandbox();
        const $html = '<iframe ' + $id + ' width="100%" height="166" scrolling="no" frameborder="no" src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/'+ $in.data + '&amp;color=0066cc&amp;auto_play=false&amp;hide_related=false&amp;show_artwork=true&amp;show_user=true&amp;visual=true" '+$sandbox+'></iframe>';

        return {
            'answer': 'true',
            'message': 'Rendered html for a Soundcloud audio',
            'html': $html,
            'css_data': {
                '.audio': 'width: 100%; clear: both; display: inline-block; box-sizing: border-box; border-radius: 15px 15px 15px 15px;'
            }
        };
    };

    /**
     * Create HTML for Soundcloud link
     * Note that the data for the embed and the link is different for the same song
     * @version 2016-11-03
     * @since   2016-11-03
     * @author  Peter Lembke
     */
    const internal_Soundcloudlink = function ($in)
    {
        let $cssData = {};

        const $default = {
            'type': 'audio',
            'subtype': 'soundcloudlink',
            'alias': '',
            'class': 'right',
            'data': 'chloehowl/paper-heart-clip', // Note that data is different from the embedded content
            'label': 'New tab'
        };
        $in = _Default($default, $in);

        const $id = _GetId({'id': $in.alias, 'name': $in.alias, 'class': $in.class });
        const $html = '<div ' + $id + '><a href="https://soundcloud.com/' + $in.data + '" target="_blank">' + $in.label + '</a></div>';

        if ($in.class === 'right') {
            $cssData = {
                '.right': 'position: relative; float: right; margin: 3px 3px 0px 3px;'
            };
        }

        return {
            'answer': 'true',
            'message': 'Rendered html for a Soundcloud link to a new tab',
            'html': $html,
            'css_data': $cssData
        };
    };

    /**
     * Create HTML for Spotify
     * @version 2014-03-08
     * @since   2014-03-08
     * @author  Peter Lembke
     */
    const internal_Spotify = function ($in)
    {
        const $default = {
            'type': 'audio',
            'subtype': 'spotify',
            'alias': '',
            'class': 'audio',
            'data': 'track/6o56JEMxnUMPmO4qjWnjc9'
        };
        $in = _Default($default, $in);

        const $id = _GetId({'id': $in.alias, 'name': $in.alias, 'class': $in.class });
        const $sandbox = _GetSandbox();
        const $html = '<iframe ' + $id + ' src="https://open.spotify.com/embed/' + $in.data + '" height="80" frameborder="0" allowtransparency="true" '+$sandbox+'></iframe>';

        // <iframe src="https://open.spotify.com/embed/track/6o56JEMxnUMPmO4qjWnjc9" width="300" height="380" frameborder="0" allowtransparency="true"></iframe>
        // <iframe src="https://open.spotify.com/embed/album/1CuFf5IslmlCno7DAFjrt9" width="300" height="380" frameborder="0" allowtransparency="true"></iframe>

        return {
            'answer': 'true',
            'message': 'Rendered html for a Spotify audio',
            'html': $html,
            'css_data': {
                '.audio': 'width: 100%; clear: both; display: inline-block; box-sizing: border-box; border-radius: 15px 15px 15px 15px;',
            }
        };
    };

    /**
     * Create HTML for Spotify link
     * @version 2016-11-03
     * @since   2016-11-03
     * @author  Peter Lembke
     */
    const internal_Spotifylink = function ($in)
    {
        let $cssData = {};

        const $default = {
            'type': 'audio',
            'subtype': 'spotifylink',
            'alias': '',
            'class': 'right',
            'data': '88296877',
            'label': 'New tab'
        };
        $in = _Default($default, $in);

        const $id = _GetId({'id': $in.alias, 'name': $in.alias, 'class': $in.class });
        const $html = '<div ' + $id + '><a href="https://open.spotify.com/track/' + $in.data + '" target="_blank">' + $in.label + '</a></div>';

        if ($in.class === 'right') {
            $cssData = {
                '.right': 'position: relative; float: right; margin: 3px 3px 0px 3px;'
            };
        }

        return {
            'answer': 'true',
            'message': 'Rendered html for a Spotify link to a new tab',
            'html': $html,
            'css_data': $cssData
        };
    };
}
//# sourceURL=infohub_render_audio.js