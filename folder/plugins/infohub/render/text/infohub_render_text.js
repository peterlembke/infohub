/**
 * infohub_render_text
 * Renders a text with embedded commands
 *
 * @package     Infohub
 * @subpackage  infohub_render_text
 * @since       2016-10-08
 * @author      Peter Lembke <info@infohub.se>
 * @license     GPL-3.0-or-later
 * @copyright   Copyright (C) 2010- Peter Lembke
 * @see         https://github.com/peterlembke/infohub/blob/main/folder/plugins/infohub/render/text/infohub_render_text.md Documentation
 * @link        https://infohub.se/ InfoHub main page
 */
function infohub_render_text() {

    'use strict';

    // include "infohub_base.js"

    const _Version = function() {
        return {
            'date': '2021-06-06',
            'since': '2016-10-08',
            'version': '1.0.1',
            'checksum': '{{checksum}}',
            'class_name': 'infohub_render_text',
            'note': 'Renders a text with embedded commands',
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

        let $itemIndex = {};
        for (const $itemName in $in.item_index) {
            if ($in.item_index.hasOwnProperty($itemName) === false) {
                continue;
            }

            let $data = $in.item_index[$itemName];

            let $defaultItem = {
                'what_done': {}, // It is OK if there are nothing in what_done
                'alias': '',
                'text': '',
                'class': 'text_article',
                'css_data': {},
            };
            $data = _Default($defaultItem, $data);
            $data.config = $in.config;

            if (_Empty($data.text) === 'true') {
                $itemIndex[$itemName] = {
                    'answer': 'true',
                    'message': 'You must have something in "text"',
                    'html': '',
                    'css_data': {},
                };
                continue;
            }

            $data.func = 'Text';
            let $response = internal_Cmd($data); // internal_Text

            const $defaultResponse = {
                'answer': 'false',
                'message': 'Nothing to report',
                'html': '',
                'css_data': {},
            };
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
     * Create HTML for showing a text.
     * @version 2014-02-22
     * @since   2014-02-22
     * @author  Peter Lembke
     */
    const internal_Text = function($in = {}) {
        const $default = {
            'func': 'Text',
            'what_done': {},
            'alias': '',
            'text': '',
            'class': 'text_article',
            'css_data': {},
        };
        $in = _Default($default, $in);

        $in.text = _CheckParts($in);
        if ($in.text.indexOf('[') > -1) {
            $in.text = _CheckParts($in);
        }
        if ($in.text.indexOf('[') > -1) {
            $in.text = _CheckParts($in); // Three levels is enough, you do not get more
        }

        // And now we divide the text into rows
        $in.text = $in.text.split('\n');

        let $cssData = $in.css_data;

        let $pCssAdded = 'false';

        // Each row get a <p> and a </p>
        for (let $currentAliasDepth = 0, $aliasDepth = $in.text.length; $currentAliasDepth <
        $aliasDepth; $currentAliasDepth++) {
            if ($in.text[$currentAliasDepth].charAt(0) === ' ') {
                $in.text[$currentAliasDepth] = '<p>' +
                    $in.text[$currentAliasDepth].slice(1) + '</p>';

                if ($pCssAdded === 'false') {
                    const $baseCss = {
                        'p:first-letter': 'font-size: 1.0em;',
                    };
                    $cssData = _MergeStringData($baseCss, $cssData);
                    $pCssAdded = 'true';
                }
            }
        }

        // Put all rows together.
        $in.text = $in.text.join('');
        if ($in.class !== '') {
            const $id = _GetId(
                {'id': $in.alias, 'name': $in.alias, 'class': $in.class});
            $in.text = '<div ' + $id + '>' + $in.text + '</div>';
        }

        if ($in.class === 'text_article') {
            const $baseCss = {
                '.text_columns': 'column-width:280px; column-gap: 1em; font-size: 1em; padding: 0 0 1em;',
                '.text_article': 'font: 14px/24px Times; margin: 3px 3px 3px 3px;',
            };
            $cssData = _MergeStringData($baseCss, $cssData);
        }

        return {
            'answer': 'true',
            'message': 'Here are the rendered text',
            'html': $in.text,
            'css_data': $cssData,
        };
    };

    /**
     * Find all [part] and exchange them to the rendered HTMl for that part
     * @param $in
     * @returns {*}
     * @private
     */
    const _CheckParts = function($in = {}) {
        let $copy = $in.what_done,
            $next, $previous, $start, $stop, $part, $find, $html;

        // We find all [ and ]
        $next = 0;
        $previous = -1;

        while ($in.text.indexOf('[', $next) > $previous) {
            $start = $in.text.indexOf('[', $next);
            $stop = $in.text.indexOf(']', $start);
            $part = $in.text.substring($start + 1, $stop);
            $find = '[' + $part + ']';

            $previous = $start;
            $next = $start + 1;

            if (typeof $copy[$part] !== 'undefined') {
                const $textPart = _SvgIdsMoreUnique($part, $copy[$part]);
                $in.text = $in.text.replace($find, $textPart);
                continue;
            }

            // @todo HUB-1034 here we will insert colour information
            // [color/s0/background]

            $html = _Exchange($part);
            if ($html !== '') {
                $in.text = $in.text.replace($find, $html);
                continue;
            }
            // $in.text = $in.text.replace($find, ''); // If data can not be found for the part, then remove the part
        }

        return $in.text;
    };

    /**
     * Update SVG IDs to be more unique
     * @version 2021-06-04
     * @since   2020-03-27
     * @author  Peter Lembke
     */
    const _SvgIdsMoreUnique = function($alias, $asset) {

        const $svgStart = $asset.indexOf('<svg');
        if ($svgStart === -1) {
            return $asset;
        }

        let $svgStop = $asset.indexOf('</svg>', $svgStart);
        if ($svgStop === -1) {
            return $asset;
        }
        $svgStop = $svgStop + '</svg>'.length;

        let $svgPart = $asset.substring($svgStart, $svgStop);

        const $firstIdStart = $svgPart.indexOf('id="');
        if ($firstIdStart !== -1) {
            const $hasBoxId = $svgPart.substring($firstIdStart+4, $firstIdStart+5) === '{'; // {box_id}_
            if ($hasBoxId === true) {
                return $asset; // We already have added the box_id to this svg
            }
        }

        $svgPart = _Replace('\n', '', $svgPart);

        // SVG that use "(#" will interfere with each other. This will add unique aliases in the SVG.
        $svgPart = _Replace('(#', '(#{alias}', $svgPart);
        $svgPart = _Replace('id="', 'id="{alias}', $svgPart);
        $svgPart = _Replace('href="#', 'href="#{alias}', $svgPart);

        const $id = '{box_id}_' + $alias + '-';
        $svgPart = _Replace('{alias}', $id, $svgPart);

        const $beforeSvg = $asset.substring(0, $svgStart);
        const $afterSvg = $asset.substring($svgStop);

        if ($beforeSvg.length > 54 || $afterSvg.length > 0) {
            let $debugHere = 1;
        }

        $asset = $beforeSvg + $svgPart + $afterSvg;

        return $asset;
    };

    /**
     * Exchange [something]
     * https://en.wikipedia.org/wiki/Emoticons_%28Unicode_block%29
     * @version 2014-02-22
     * @since   2014-02-22
     * @author  Peter Lembke
     */
    const _Exchange = function($find) {
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
            'strike': '<del>',
            '/strike': '</del>',
        };

        let $html = '';
        if (typeof $data[$find] !== 'undefined') {
            $html = $data[$find];
        }

        return $html;
    };
}

//# sourceURL=infohub_render_text.js