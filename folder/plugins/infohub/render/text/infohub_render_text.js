/**
 * infohub_render_text.js render a text with embedded commands.
 * @category InfoHub
 * @package infohub_render_text
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
function infohub_render_text() {

    "use strict";

    // include "infohub_base.js"

    const _Version = function() {
        return {
            'date': '2017-02-18',
            'since': '2016-10-08',
            'version': '1.0.0',
            'checksum': '{{checksum}}',
            'class_name': 'infohub_render_text',
            'note': 'Renders a text with embedded commands',
            'status': 'normal',
            'license_name': 'GNU GPL 3 or later'
        };
    };

    const _GetCmdFunctions = function() {
        return {
            'create': 'normal'
        };
    };

    // ***********************************************************
    // * The private functions, add your own in your plugin
    // * These functions can be used directly in your functions.
    // * Name: _CamelCaseData
    // ***********************************************************

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
    $functions.push('create');
    const create = function ($in)
    {
        let $default = {
            'what_done': {},
            'text': '',
            'step': 'start',
            'class': 'text_article'
        };
        $in = _Default($default, $in);

        let $response = {
            'answer': 'true',
            'message': 'Nothing to report',
            'html': '',
            'css_data': {}
        };

        leave: {
            if (_Empty($in.text) === 'true') {
                $response.message = 'You must have something in "text"';
                break leave;
            }

            if (Object.getOwnPropertyNames($in.what_done).length === 0) {
                $response.message = 'It is OK that there are nothing in what_done';
            }

            // Send the text and all data to the parser
            $in.func = 'Text';
            $response = internal_Cmd($in); // internal_Text
        }

        $default = {
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
     * Create HTML for showing a text.
     * @version 2014-02-22
     * @since   2014-02-22
     * @author  Peter Lembke
     */
    const internal_Text = function ($in)
    {
        const $default = {
            'func': 'Text',
            'what_done': {},
            'alias': '',
            'text': '',
            'class': 'text_article'
        };
        $in = _Default($default, $in);

        let $cssData = {};

        $in.text = _CheckParts($in);
        if ($in.text.indexOf('[') > -1) {
            $in.text = _CheckParts($in);
        }
        if ($in.text.indexOf('[') > -1) {
            $in.text = _CheckParts($in); // Three levels is enough, you do not get more
        }

        // And now we divide the text into rows
        $in.text = $in.text.split("\n");

        // Each row get a <p> and a </p>
        for (let $currentAliasDepth = 0, $aliasDepth = $in.text.length; $currentAliasDepth < $aliasDepth; $currentAliasDepth = $currentAliasDepth + 1)
        {
            if ($in.text[$currentAliasDepth].charAt(0) === ' ') {
                $in.text[$currentAliasDepth] = '<p>' + $in.text[$currentAliasDepth].slice(1) + '</p>';
                $cssData['p:first-letter'] = 'font-size: 1.5em;';
            }
        }

        // Put all rows together.
        $in.text = $in.text.join('');
        if ($in.class !== '') {
            const $id = _GetId({'id': $in.alias, 'name': $in.alias, 'class': $in.class });
            $in.text = '<div ' + $id + '>' + $in.text + '</div>';
        }

        if ($in.class === 'text_article') {
            $cssData['.text_columns'] = 'column-width:280px; column-gap: 1em; font-size: 1em; padding: 0 0 1em;';
            $cssData['.text_article'] = 'font: 14px/24px Times; margin: 3px 3px 3px 3px;';
        }

        return {
            'answer': 'true',
            'message': 'Here are the rendered text',
            'html': $in.text,
            'css_data': $cssData
        };
    };

    const _CheckParts = function ($in)
    {
        let $copy = $in.what_done,
            $next, $previous, $start, $stop, $part, $find, $html;

        // We find all [ and ]
        $next = 0; $previous = -1;

        while ($in.text.indexOf('[', $next) > $previous)
        {
            $start = $in.text.indexOf('[', $next);
            $stop = $in.text.indexOf(']', $start);
            $part = $in.text.substring($start+1, $stop);
            $find = '[' + $part + ']';

            $previous = $start;
            $next = $start +1;

            if (typeof $copy[$part] !== 'undefined') {
                $in.text = $in.text.replace($find, $copy[$part]);
                continue;
            }

            $html = _Exchange($part);
            if ($html !== '') {
                $in.text = $in.text.replace($find,$html);
                continue;
            }
            // $in.text = $in.text.replace($find, ''); // If data can not be found for the part, then remove the part
        }

        return $in.text;
    };

    /**
     * Exchange [something]
     * https://en.wikipedia.org/wiki/Emoticons_%28Unicode_block%29
     * @version 2014-02-22
     * @since   2014-02-22
     * @author  Peter Lembke
     */
    const _Exchange = function ($find)
    {
        const $data = {
            ':-)': '☺',
            ':-(': '☹',
            '(c)': '©',
            '(r)': '®',
            'tel': '☏',
            'eur': '€',
            'b': '<b>',
            '/b': '</b>',
            'i': '<i>',
            '/i': '</i>',
            'u': '<u>',
            '/u': '</u>',
            'line': '<hr>',
            'columns': '<div class="text_columns">',
            '/columns': '</div>',
            'h1': '<h1>',
            '/h1': '</h1>',
            'h2': '<h2>',
            '/h2': '</h2>',
            'h3': '<h3>',
            '/h3': '</h3>',
            'h4': '<h4>',
            '/h4': '</h4>',
            'h5': '<h5>',
            '/h5': '</h5>',
            'h6': '<h6>',
            '/h6': '</h6>',
            'br': '<br>',
            'strike': '<strike>',
            '/strike': '</strike>'
        };

        let $html = '';
        if (typeof $data[$find] !== 'undefined') {
            $html = $data[$find];
        }

        return $html;
    };
}
//# sourceURL=infohub_render_text.js