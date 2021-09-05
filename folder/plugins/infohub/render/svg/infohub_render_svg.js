/**
 * infohub_svg.js contact the renderers to get HTML and then send it to infohub_view
 * infohub_svg and infohub_view are the only plugions that handle the DOM
 * @category InfoHub
 * @package infohub_svg
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
function infohub_render_svg() {

    'use strict';

    // include "infohub_base.js"

    const _Version = function() {
        return {
            'date': '2020-04-18',
            'since': '2020-04-18',
            'version': '1.0.0',
            'checksum': '{{checksum}}',
            'class_name': 'infohub_render_svg',
            'note': 'Renders SVG tags',
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
    const _GetFuncName = function($text) {
        let $response = '';

        const $parts = $text.split('_');

        for (let $key in $parts) {
            if ($parts.hasOwnProperty($key) === false) {
                continue;
            }

            $response = $response + $parts[$key].charAt(0).toUpperCase() +
                $parts[$key].substr(1);
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
        const $default = {
            'id': '',
            'name': '',
            'class': '',
        };
        $in = _Default($default, $in);

        let $name, $class, $id, $parameter = [];

        if ($in.id !== '') {
            $id = 'id="{box_id}_' + $in.id + '"';
            $parameter.push($id);
        }

        if ($in.name !== '') {
            $name = 'name="' + $in.name + '"';
            $parameter.push($name);
        }

        if ($in.class !== '') {
            $class = $in.class;
            if ($class.charAt(0) == parseInt($class.charAt(0))) {
                $class = 'a' + $class;
            }
            $class = 'class="' + $class + '" ';
            $parameter.push($class);
        }

        return $parameter.join(' ');
    };

    /**
     * Get the html parameters in a string
     * Parameters must have a key with a-z, no < or > or space.
     * Data must not have "
     * @version 2020-04-19
     * @since 2020-04-19
     * @param $in
     * @returns {string}
     * @private
     */
    const _GetParameters = function($parameters) {
        let $parametersOK = [];

        for (let $parameterName in $parameters) {
            if ($parameters.hasOwnProperty($parameterName) === false) {
                continue;
            }
            if (typeof $parameterName !== 'string') {
                continue;
            }

            let $data = $parameters[$parameterName];
            if (typeof $data !== 'string') {
                continue;
            }

            $parameterName = $parameterName.trim().
                toLowerCase().
                replace('<', '').
                replace('>', '').
                replace(' ', '')
            ;

            $data = $data.trim().
                replace('<', '').
                replace('>', '').
                replace('\'', '').
                replace('"', '')
            ;

            const $parameter = $parameterName + '="' + $data + '"';
            $parametersOK.push($parameter);
        }

        return $parametersOK.join(' ');
    };

    /**
     * Check if tag is a valid svg tag
     * @version 2020-04-19
     * @since 2020-04-19
     * @param $tag
     * @returns {string}
     * @private
     */
    const _CheckTagValid = function($tag) {
        const $tagName = $tag.trim();

        const $validTags = {
            'svg': 1,
            'rect': 1,
            'circle': 1,
            'ellipse': 1,
            'line': 1,
            'polygon': 1,
            'polyline': 1,
            'path': 1,
            'text': 1,
            'feOffset': 1,
            'feGaussianBlur': 1,
            'feBlend': 1,
            'linearGradient': 1,
            'stop': 1,
        };

        let $valid = 'false';
        if (_IsSet($validTags[$tagName]) === 'true') {
            $valid = 'true';
        }

        return $valid;
    };

    /**
     * Check if tag is a valid svg content tag
     * @version 2020-04-19
     * @since 2020-04-19
     * @link
        * @param $tag
     * @returns {string}
     * @private
     */
    const _CheckContentTagValid = function($tag) {
        const $tagName = $tag.trim().toLowerCase();

        const $validTags = {
            'g': 1,
            'defs': 1,
            'filter': 1,
        };

        let $valid = 'false';
        if (_IsSet($validTags[$tagName]) === 'true') {
            $valid = 'true';
        }

        return $valid;
    };

    // *****************************************************************************
    // * Functions you only can reach with CMD()
    // * Observe function names are lower_case
    // *****************************************************************************

    $functions.push('create');
    /**
     * Get instructions and create the html
     * @version 2020-12-19
     * @since   2016-10-16
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
            'display': '',
        };

        let $itemIndex = {};
        for (const $itemName in $in.item_index) {
            if ($in.item_index.hasOwnProperty($itemName) === false) {
                continue;
            }

            let $data = $in.item_index[$itemName];
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

    /**
     * Create a start tag
     * @version 2020-04-19
     * @since   2020-04-19
     * @author  Peter Lembke
     * @param $in
     * @returns {{answer: string, html: string, message: string}}
     */
    const internal_SvgStart = function($in = {}) {
        const $default = {
            'tag': 'svg',
            'alias': '',
            'class': 'svg',
            'width': 100.0,
            'height': 100.0,
            // 'css_data': {}
            // You can not use css_data because it wraps around the html,
            // and this is only a start tag without an end tag.
            // Set the css on an outer container instead.
        };
        $in = _Default($default, $in);

        let $out = {
            'answer': 'false',
            'message': 'tag not valid',
            'html': '',
        };

        const $valid = _CheckTagValid($in.tag);
        if ($valid === 'true') {
            const $id = ' ' + _GetId(
                {'id': $in.alias, 'name': $in.alias, 'class': $in.class});
            const $parameters = ' width="100%" height="100%"' +
                ' viewBox="0 0 ' + $in.width + ' ' + $in.height + '"';
            $out = {
                'answer': 'true',
                'message': 'Here are the HTML',
                'html': '<' + $in.tag + $id + $parameters + '>',
            };
        }

        return {
            'answer': $out.answer,
            'message': $out.message,
            'html': $out.html,
        };
    };

    /**
     * Create an end tag
     * @version 2020-04-19
     * @since   2020-04-19
     * @author  Peter Lembke
     * @param $in
     * @returns {{answer: string, html: string, message: string}}
     */
    const internal_SvgStop = function($in = {}) {
        const $default = {
            'tag': 'svg',
        };
        $in = _Default($default, $in);

        let $out = {
            'answer': 'false',
            'message': 'tag not valid',
            'html': '',
        };

        const $valid = _CheckTagValid($in.tag);
        if ($valid === 'true') {
            $out = {
                'answer': 'true',
                'message': 'Here are the HTML',
                'html': '</' + $in.tag + '>',
            };
        }

        return {
            'answer': $out.answer,
            'message': $out.message,
            'html': $out.html,
        };
    };

    /**
     * Create a SVG tag
     * @version 2020-04-19
     * @since   2020-04-19
     * @author  Peter Lembke
     * @example <rect id="the-id" x="50" y="20" rx="20" ry="20" width="150" height="150" style="fill:red;stroke:black;stroke-width:5;opacity:0.5" />
     * @param $in
     * @returns {{answer: string, html: string, message: string}}
     */
    const internal_SvgSingleTag = function($in = {}) {
        const $default = {
            'alias': '',
            'tag': 'rect',
            'class': 'rectangle',
            'css_data': {},
            'parameters': {},
        };
        $in = _Default($default, $in);

        let $out = {
            'answer': 'false',
            'message': 'tag not valid',
            'html': '',
        };

        const $tagValid = _CheckTagValid($in.tag);
        if ($tagValid === 'true') {
            const $id = ' ' + _GetId(
                {'id': $in.alias, 'name': $in.alias, 'class': $in.class});
            const $parameters = ' ' + _GetParameters($in.parameters);
            $out = {
                'answer': 'true',
                'message': 'Here are the HTML',
                'html': '<' + $in.tag + $id + $parameters + ' />',
            };
        }

        return {
            'answer': $out.answer,
            'message': $out.message,
            'html': $out.html,
        };
    };

    /**
     * Create a SVG content tag with content
     * @version 2020-04-19
     * @since   2020-04-19
     * @author  Peter Lembke
     * @example <g id="the-id"><other tags></g>
     * @param $in
     * @returns {{answer: string, html: string, message: string}}
     */
    const internal_SvgContentTag = function($in = {}) {
        const $default = {
            'alias': '',
            'tag': 'g',
            'content': '',
            'class': 'rectangle',
            'css_data': {},
            'parameters': {},
        };
        $in = _Default($default, $in);

        let $out = {
            'answer': 'false',
            'message': 'tag not valid',
            'html': '',
        };

        const $tagValid = _CheckContentTagValid($in.tag);
        if ($tagValid === 'true') {
            const $id = ' ' + _GetId(
                {'id': $in.alias, 'name': $in.alias, 'class': $in.class});
            const $parameters = ' ' + _GetParameters($in.parameters);
            $out = {
                'answer': 'true',
                'message': 'Here are the HTML',
                'html': '<' + $in.tag + $id + $parameters + '>' + $in.content +
                    '</' + $in.tag + '>',
            };
        }

        return {
            'answer': $out.answer,
            'message': $out.message,
            'html': $out.html,
        };
    };
}

//# sourceURL=infohub_render_svg.js