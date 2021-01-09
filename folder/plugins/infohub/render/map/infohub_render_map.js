/**
 * infohub_render_map.js render map html
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
function infohub_render_map() {

    "use strict";

    // include "infohub_base.js"

    const _Version = function() {
        return {
            'date': '2017-02-18',
            'since': '2014-11-01',
            'version': '1.0.0',
            'checksum': '{{checksum}}',
            'class_name': 'infohub_render_map',
            'note': 'Render HTML for a map from OpenStreetMap, Google Maps, GPSies',
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

        const $parts = $text.split('_');

        for (let $key in $parts) {
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

    /**
     * Adds an overlay over the iframe so you can scroll past the map and not zoom into it.
     * Click the padLock to zoom with the wheel.
     * @param $html
     * @param $alias
     * @returns {string}
     * @private
     */
    const _AddOverlay = function ($html, $alias)
    {
        const $id = '{box_id}_' + $alias,
            $command = 'document.getElementById(\''+ $id +'\').style.pointerEvents=',
            $on = "'auto'",
            $off = "''",
            $onclick = 'onclick="' + $command + $on + '"',
            $tab = 'tabindex="-1" ',
            $padlockCharacter = 'Lock', // "\uD83D\uDD12",
            $lock = '<a href="javascript:void(0)" '+ 'onclick="' + $command + $off +'">' + $padlockCharacter + '</a>';

        $html = '<div class="map_overlay" ' + $tab + $onclick + '>' + $html + '</div>' + $lock;

        return $html;
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
    const create = function ($in)
    {
        const $default = {
            'item_index': {},
            'config': {}
        };
        $in = _Default($default, $in);

        const $defaultResponse = {
            'answer': 'false',
            'message': '',
            'html': '',
            'css_data': {}
        };

        let $itemIndex = {};
        for (const $itemName in $in.item_index) {
            if ($in.item_index.hasOwnProperty($itemName) === false) {
                continue;
            }

            let $data = $in.item_index[$itemName];

            if (_IsSet($data.subtype) === 'false') {
                $data.subtype = 'openstreetmap';
            }

            // iframes are deprecated as a security breach. Will show a link instead.
            if ($data.subtype.substr($data.subtype.length-4,4) !== 'link') {
                $data.subtype = $data.subtype + 'link';
            }

            $data.func = _GetFuncName($data.subtype);
            let $response = internal_Cmd($data);
            $data.config = $in.config;

            $response = _Default($defaultResponse, $response);

            $itemIndex[$itemName] = $response;
        }

        return {
            'answer': 'true',
            'message': 'Here is what I rendered',
            'item_index': $itemIndex
        };
    };


    // *****************************************************************************
    // * Internal function that you only can reach from internal_Cmd
    // *****************************************************************************

    /**
     * Create HTML for Openstreetmap
     * @version 2014-03-08
     * @since   2014-03-08
     * @author  Peter Lembke
     */
    const internal_Openstreetmap = function ($in)
    {
        const $default = {
            'type': 'map',
            'subtype': 'openstreetmap',
            'alias': '',
            'class': 'map',
            'point_latitude': '59.294597',
            'point_longitude': '18.156281',
            'zoom': '12',
            'marker': 'true',
            'css_data': {}
        };
        $in = _Default($default, $in);

        let $marker = '';
        if ($in.marker === 'true') {
            $marker='&amp;marker=' + $in.point_latitude + '%2C' + $in.point_longitude;
        }

        const $zoomNumber = Math.pow(10, (2.0 - 5.0*parseFloat($in.zoom)/15.0)); // 100 = world, 10 = europa, 1 = Stockholm/Linköping, 0.1 = Stockholm+Surbubs, 0.01 = Part of town, 0.001 = Almost max

        let $p = {
            lat1: parseFloat($in.point_latitude) - $zoomNumber * 0.57,
            long1: parseFloat($in.point_longitude) - $zoomNumber * 2.2,
            lat2: parseFloat($in.point_latitude) + $zoomNumber * 0.57,
            long2: parseFloat($in.point_longitude) + $zoomNumber * 2.2
        };
        $p = $p.long1 + '%2C' + $p.lat1 + '%2C' + $p.long2 + '%2C' + $p.lat2;

        const $id = _GetId({'id': $in.alias, 'name': $in.alias, 'class': $in.class });
        let $html = '<iframe sandbox="allow-scripts" ' + $id + ' width="100%" height="350" frameborder="0" scrollig="no" marginheight="0" marginwidth="0" src="https://www.openstreetmap.org/export/embed.html?bbox=' + $p + '&amp;layer=mapnik' + $marker + '" style="border: 1px solid #ff0000"></iframe>';

        $html = _AddOverlay($html, $in.alias);

        let $cssData = $in.css_data;

        if ($in.class === 'map') {
            $cssData = {
                '.map_overlay iframe': 'pointer-events: none;'
            };
            $cssData = _MergeStringData($cssData, $in.css_data);
        }

        return {
            'answer': 'true',
            'message': 'Rendered html for an Openstreetmap map',
            'html': $html,
            'css_data': $cssData
        };
    };

    /**
     * Create HTML for Openstreetmaplink
     * @version 2016-11-03
     * @since   2016-11-03
     * @author  Peter Lembke
     */
    const internal_Openstreetmaplink = function ($in)
    {
        const $default = {
            'type': 'map',
            'subtype': 'openstreetmaplink',
            'alias': '',
            'class': 'right',
            'css_data': {},
            'point_latitude': '59.294597',
            'point_longitude': '18.156281',
            'label': 'New tab'
        };
        $in = _Default($default, $in);

        const $id = _GetId({'id': $in.alias, 'name': $in.alias, 'class': $in.class });

        const $html = '<div ' + $id + '><a href="https://www.openstreetmap.org/?mlat=' + $in.point_latitude + '&amp;mlon=' + $in.point_longitude + '#map=7/' + $in.point_latitude + '/' + $in.point_longitude + '" target="_blank">' + $in.label + '</a></div>';

        let $cssData = $in.css_data;

        if ($in.class === 'right') {
            $cssData = {
                '.right': 'position: relative; float: right; margin: 3px 3px 0px 3px; color: #1b350a;',
                '.right:hover': 'background: #6d8df7;'
            };
            $cssData = _MergeStringData($cssData, $in.css_data);
        }

        if ($in.class === 'link') {
            $cssData = {
                '.link': 'color: #1b350a;',
                '.link:hover': 'background: #6d8df7;'
            };
            $cssData = _MergeStringData($cssData, $in.css_data);
        }

        return {
            'answer': 'true',
            'message': 'Rendered html for an Openstreetmap link to a new tab',
            'html': $html,
            'css_data': $cssData
        };
    };

    /**
     * Create HTML for Googlemaps
     * @version 2014-03-08
     * @since   2014-03-08
     * @author  Peter Lembke
     */
    const internal_Googlemaps = function ($in)
    {
        let $html = '';

        const $default = {
            'type': 'map',
            'subtype': 'googlemaps',
            'alias': '',
            'class': 'map',
            'css_data': {},
            'data': '',
            'point_latitude': '59.294597',
            'point_longitude': '18.156281',
            'zoom': '12',
            'marker': 'true',
            'height': '350'
        };
        $in = _Default($default, $in);

        const $id = _GetId({'id': $in.alias, 'name': $in.alias, 'class': $in.class });
        const $parameters = ' sandbox="allow-scripts allow-same-origin" width="100%" height="'+$in.height+'" frameborder="0"  scrolling="no" marginwidth="0" marginheight="0"';

        if ($in.data === '') {
            $html = '<iframe ' + $id + $parameters + ' src="https://maps.google.se/?saddr=' + $in.point_latitude + ',' + $in.point_longitude + '&amp;ie=UTF8&amp;ll=' + $in.point_latitude + ',' + $in.point_longitude + '&amp;spn=0.009151,0.031629&amp;t=m&amp;z=' + $in.zoom + '&amp;output=embed&amp;iwloc=near"></iframe>';
        } else {
            $html = '<iframe ' + $id + $parameters + ' src="https://mapsengine.google.com/map/embed?mid=' + $in.data + '"></iframe>';
        }

        $html = _AddOverlay($html, $in.alias);

        let $cssData = $in.css_data;

        if ($in.class === 'map') {
            $cssData = {
                '.map_overlay iframe': 'pointer-events: none;'
            };
            $cssData = _MergeStringData($cssData, $in.css_data);
        }

        return {
            'answer': 'true',
            'message': 'Rendered html for a Google maps',
            'html': $html,
            'css_data': $cssData
        };
    };

    /**
     * Create HTML for Googlemapslink
     * @version 2016-11-03
     * @since   2016-11-03
     * @author  Peter Lembke
     */
    const internal_Googlemapslink = function ($in)
    {
        const $default = {
            'type': 'map',
            'subtype': 'googlemapslink',
            'alias': '',
            'class': 'right',
            'data': '',
            'point_latitude': '59.294597',
            'point_longitude': '18.156281',
            'label': 'New tab'
        };
        $in = _Default($default, $in);

        let $html = '';

        if ($in.data === '') {
            $html = '<a href="https://maps.google.se/?saddr=' + $in.point_latitude + ',' + $in.point_longitude + '&amp;ie=UTF8&amp;ll=' + $in.point_latitude + ',' + $in.point_longitude + '&amp;spn=0.009151,0.031629&amp;t=m&amp;z=' + $in.zoom + '&amp;source=embed" target="_blank">' + $in.label + '</a>';
        } else {
            $html = '<a href="https://mapsengine.google.com/map/embed?mid=' + $in.data + '" target="_blank">' + $in.label + '</a>';
        }

        const $id = _GetId({'id': $in.alias, 'name': $in.alias, 'class': $in.class });
        $html = '<div ' + $id + '>' + $html + '</div>';

        let $cssData = $in.css_data;

        if ($in.class === 'right') {
            $cssData = {
                '.right': 'position: relative; float: right; margin: 3px 3px 0px 3px; color: #1b350a;',
                '.right:hover': 'background: #6d8df7;'
            };
            $cssData = _MergeStringData($cssData, $in.css_data);
        }

        if ($in.class === 'link') {
            $cssData = {
                '.link': 'color: #1b350a;',
                '.link:hover': 'background: #6d8df7;'
            };
            $cssData = _MergeStringData($cssData, $in.css_data);
        }

        return {
            'answer': 'true',
            'message': 'Rendered html for a Googlemaps link to a new tab',
            'html': $html,
            'css_data': $cssData
        };
    };

    /**
     * Create HTML for Bingmaps
     * @version 2018-04-14
     * @since   2018-04-14
     * @author  Peter Lembke
     */
    const internal_Bingmaps = function ($in)
    {
        const $default = {
            'type': 'map',
            'subtype': 'bingmaps',
            'alias': '',
            'class': 'map',
            'point_latitude': '59.32652908731827',
            'point_longitude': '18.070166899475115',
            'zoom': '14', // 1 world, 2=half world, 5 country, 10 city, 16 street
            'height': '500',
            'width': '500',
            'static_map': 'false', // typ=s (static image) or typ=d (dynamic with pan and zoom)
            'map_style': 'street' // areal_labels, areal, street (always labels)
        };
        $in = _Default($default, $in);

        let $typ = 'd'; // Dynamic map with pan and zoom
        if ($in.static_map === 'true') {
            $typ = 's';
        }

        const $mapStyle = {
            'areal_labels': 'd',
            'areal': 'a',
            'street': 'r'
        };

        let $sty = $mapStyle.street;
        if (_IsSet($mapStyle[$in.map_style]) === 'true') {
            $sty = $mapStyle[$in.map_style];
        }

        const $id = _GetId({'id': $in.alias, 'name': $in.alias, 'class': $in.class });
        const $parameters = ' sandbox="allow-scripts" width="100%" height="' + $in.height + '" frameborder="0"  scrolling="no" marginwidth="0"';
        const $url = 'https://www.bing.com/maps/embed?';

        const $getParams = 'h=' + $in.height + '&w=' + $in.width + '&cp=' + $in.point_latitude + '~' + $in.point_longitude + '&lvl=' + $in.zoom + '&typ=' + $typ + '&sty=' + $sty;

        let $html = '<iframe ' + $id + $parameters + ' src="'+ $url + $getParams + '&src=SHELL&FORM=MBEDV8"></iframe>';

        $html = _AddOverlay($html, $in.alias);

        let $cssData = $in.css_data;

        if ($in.class === 'map') {
            $cssData = {
                '.map_overlay iframe': 'pointer-events: none;'
            };
            $cssData = _MergeStringData($cssData, $in.css_data);
        }

        return {
            'answer': 'true',
            'message': 'Rendered html for a Bing map',
            'html': $html,
            'css_data': $cssData
        };
    };

    /**
     * Create HTML for Bingmapslink
     * @version 2018-04-14
     * @since   2018-04-14
     * @author  Peter Lembke
     */
    const internal_Bingmapslink = function ($in)
    {
        const $default = {
            'type': 'map',
            'subtype': 'bingmapslink',
            'alias': '',
            'class': 'right',
            'data': '',
            'point_latitude': '59.294597',
            'point_longitude': '18.156281',
            'label': 'New tab'
        };
        $in = _Default($default, $in);

        let $html = '<a href="https://www.bing.com/maps?cp=' + $in.point_latitude + '~' + $in.point_longitude + '&sty=r&lvl=16&FORM=MBEDLD" target="_blank">' + $in.label + '</a>';

        const $id = _GetId({'id': $in.alias, 'name': $in.alias, 'class': $in.class });
        $html = '<div ' + $id + '>' + $html + '</div>';

        let $cssData = $in.css_data;

        if ($in.class === 'right') {
            $cssData = {
                '.right': 'position: relative; float: right; margin: 3px 3px 0px 3px; color: #1b350a;',
                '.right:hover': 'background: #6d8df7;'
            };
            $cssData = _MergeStringData($cssData, $in.css_data);
        }

        if ($in.class === 'link') {
            $cssData = {
                '.link': 'color: #1b350a;',
                '.link:hover': 'background: #6d8df7;'
            };
            $cssData = _MergeStringData($cssData, $in.css_data);
        }

        return {
            'answer': 'true',
            'message': 'Rendered html for a Bingmaps link to a new tab',
            'html': $html,
            'css_data': $cssData
        };
    };
}
//# sourceURL=infohub_render_map.js