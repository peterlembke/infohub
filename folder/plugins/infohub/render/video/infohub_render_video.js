/**
 * infohub_render_video.js render video html
 * @category InfoHub
 * @package render_html5
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
function infohub_render_video() {

    'use strict';

    // include "infohub_base.js"

    const _Version = function() {
        return {
            'date': '2017-02-22',
            'since': '2014-11-01',
            'version': '1.0.0',
            'checksum': '{{checksum}}',
            'class_name': 'infohub_render_video',
            'note': 'Render HTML for a video from YouTube, Vimeo',
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

        const $parts = $text.split('_');

        for (let $key in $parts) {
            if ($parts.hasOwnProperty($key) === false) {
                continue;
            }
            $response = $response + $parts[$key].charAt(0).toUpperCase() + $parts[$key].substring(1);
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
                $data.subtype = 'youtube';
            }

            // iframes are deprecated as a security breach. Will show a link instead.
            if ($data.subtype.substr($data.subtype.length - 4, 4) !== 'link') {
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
     * Create HTML for YouTube
     * @version 2014-03-08
     * @since   2014-03-08
     * @author  Peter Lembke
     */
    const internal_Youtube = function($in = {}) {
        const $default = {
            'type': 'video',
            'subtype': 'youtube',
            'alias': '',
            'class': 'video',
            'css_data': {},
            'data': 'fNDXaRQlaOE',
        };
        $in = _Default($default, $in);

        const $id = _GetId(
            {'id': $in.alias, 'name': $in.alias, 'class': $in.class});
        const $html = '<iframe sandbox="allow-scripts allow-same-origin" ' +
            $id + ' src="https://www.youtube.com/embed/' + $in.data +
            '?html5=1" height="100%" allowfullscreen></iframe>';

        let $cssData = $in.css_data;

        if ($in.class === 'video') {
            $cssData = {
                '.video': 'width: 100%; clear: both; display: inline-block; box-sizing: border-box; border-radius: 15px 15px 15px 15px;',
            };
            $cssData = _MergeStringData($cssData, $in.css_data);
        }

        return {
            'answer': 'true',
            'message': 'Rendered html for a Youtube video',
            'html': $html,
            'css_data': $cssData,
        };
    };

    /**
     * Create HTML for YouTube
     * @version 2016-11-03
     * @since   2016-11-03
     * @author  Peter Lembke
     */
    const internal_Youtubelink = function($in = {}) {
        const $default = {
            'type': 'video',
            'subtype': 'youtube',
            'alias': '',
            'class': 'right',
            'data': 'fNDXaRQlaOE',
            'label': 'New tab',
        };
        $in = _Default($default, $in);

        const $id = _GetId(
            {'id': $in.alias, 'name': $in.alias, 'class': $in.class});
        const $html = '<div ' + $id +
            '><a href="https://www.youtube.com/watch?v=' + $in.data +
            '" target="_blank">' + $in.label + '</a></div>';

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
            'message': 'Rendered html for a Youtube link to a new tab',
            'html': $html,
            'css_data': $cssData,
        };
    };

    /**
     * Create HTML for Vimeo
     * @version 2014-03-08
     * @since   2014-03-08
     * @author  Peter Lembke
     */
    const internal_Vimeo = function($in = {}) {
        const $default = {
            'type': 'video',
            'subtype': 'vimeo',
            'alias': 'video',
            'class': 'video',
            'css_data': {},
            'data': '88296877',
        };
        $in = _Default($default, $in);

        const $id = _GetId(
            {'id': $in.alias, 'name': $in.alias, 'class': $in.class});
        const $html = '<iframe sandbox="allow-scripts allow-same-origin" ' +
            $id + ' src="https://player.vimeo.com/video/' + $in.data +
            '?title=0&amp;byline=0&amp;portrait=0&amp;badge=0&amp;color=d4cfcf" height="100%" allowfullscreen></iframe>';

        let $cssData = $in.css_data;

        if ($in.class === 'video') {
            $cssData = {
                '.video': 'width: 100%; clear: both; display: inline-block; box-sizing: border-box; border-radius: 15px 15px 15px 15px;',
            };
            $cssData = _MergeStringData($cssData, $in.css_data);
        }

        return {
            'answer': 'true',
            'message': 'Rendered html for a Vimeo video',
            'html': $html,
            'css_data': $cssData,
        };
    };

    /**
     * Create HTML for YouTube
     * @version 2016-11-03
     * @since   2016-11-03
     * @author  Peter Lembke
     */
    const internal_Vimeolink = function($in = {}) {
        const $default = {
            'type': 'video',
            'subtype': 'vimeolink',
            'alias': '',
            'class': 'right',
            'data': '88296877',
            'label': 'New tab',
        };
        $in = _Default($default, $in);

        const $id = _GetId(
            {'id': $in.alias, 'name': $in.alias, 'class': $in.class});
        const $html = '<div ' + $id + '><a href="https://vimeo.com/' +
            $in.data + '" target="_blank">' + $in.label + '</a></div>';

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
            'message': 'Rendered html for a Vimeo link to a new tab',
            'html': $html,
            'css_data': $cssData,
        };
    };

    /**
     * Create HTML for Daily motion
     * @version 2018-04-13
     * @since   2018-04-13
     * @author  Peter Lembke
     */
    const internal_Dailymotion = function($in = {}) {
        const $default = {
            'type': 'video',
            'subtype': 'dailymotion',
            'alias': 'video',
            'class': 'video',
            'css_data': {},
            'data': 'x6hpzzl',
        };
        $in = _Default($default, $in);

        const $id = _GetId(
            {'id': $in.alias, 'name': $in.alias, 'class': $in.class});
        const $html = '<iframe sandbox="allow-scripts allow-same-origin" ' +
            $id + ' src="https://www.dailymotion.com/embed/video/' + $in.data +
            '" height="100%" allowfullscreen></iframe>';

        let $cssData = $in.css_data;

        if ($in.class === 'video') {
            $cssData = {
                '.video': 'width: 100%; clear: both; display: inline-block; box-sizing: border-box;', // Border radius do not work with daily motion.
            };
            $cssData = _MergeStringData($cssData, $in.css_data);
        }

        return {
            'answer': 'true',
            'message': 'Rendered html for a Daily motion video',
            'html': $html,
            'css_data': $cssData,
        };
    };

    /**
     * Create HTML for Daily motion
     * @version 2018-04-13
     * @since   2018-04-13
     * @author  Peter Lembke
     */
    const internal_Dailymotionlink = function($in = {}) {
        const $default = {
            'type': 'video',
            'subtype': 'dailymotionlink',
            'alias': '',
            'class': 'right',
            'data': 'x6hpzzl',
            'label': 'New tab',
        };
        $in = _Default($default, $in);

        const $id = _GetId(
            {'id': $in.alias, 'name': $in.alias, 'class': $in.class});
        const $html = '<div ' + $id +
            '><a href="https://www.dailymotion.com/video/' + $in.data +
            '" target="_blank">' + $in.label + '</a></div>';

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
            'message': 'Rendered html for a Daily motion link to a new tab',
            'html': $html,
            'css_data': $cssData,
        };
    };

}

//# sourceURL=infohub_render_video.js
