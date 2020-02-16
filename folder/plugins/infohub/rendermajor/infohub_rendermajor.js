/**
 * infohub_rendermajor.js contact the renderers to get HTML and then send it to infohub_view
 * infohub_rendermajor and infohub_view are the only plugions that handle the DOM
 * @category InfoHub
 * @package infohub_rendermajor
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
function infohub_rendermajor() {

    "use strict";

    // include "infohub_base.js"

    const _Version = function() {
        return {
            'date': '2017-02-18',
            'since': '2016-10-26',
            'version': '1.0.0',
            'checksum': '{{checksum}}',
            'class_name': 'infohub_rendermajor',
            'note': 'Renders a display box for content by assembling smaller standard parts',
            'status': 'normal',
            'license_name': 'GNU GPL 3 or later'
        };
    };

    const _GetCmdFunctions = function()
    {
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

        for (let $key in $parts)
        {
            if ($parts.hasOwnProperty($key) === false) {
                continue;
            }

            $response = $response + $parts[$key].charAt(0).toUpperCase() + $parts[$key].substr(1);
        }

        return $response;
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
    $functions.push("create"); // Enable this function
    const create = function ($in)
    {
        const $default = {
            'type': '',
            'alias': '',
            'original_alias': '',
            'step': 'step_start',
            'html': '',
            'css_data': {}
        };
        $in = _Merge($default, $in);

        if ($in.step === 'step_start')
        {
            $in.func = _GetFuncName($in.type);
            const $response = internal_Cmd($in);

            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_render',
                    'function': 'create'
                },
                'data': {
                    'what': $response.data,
                    'how': $response.how,
                    'where': $response.where
                },
                'data_back': {
                    'step': 'step_final',
                    'alias': $in.alias
                }
            });
        }

        if ($in.step === 'step_final') {
            if (_Empty($in.alias) === 'false') {
                // All IDs become unique by inserting the parent alias in each ID.
                const $find = '{box_id}';
                const $replace = $find + '_' + $in.alias;
                $in.html = $in.html.replace(new RegExp($find, 'g'), $replace);
            }
        }

        if (_IsSet($in.css_data['fieldset .head']) === 'false') {
            $in.css_data['fieldset .head'] = 'display: block;';
        }

        if (_IsSet($in.css_data['fieldset .content']) === 'false') {
            $in.css_data['fieldset .content'] = '';
        }

        if (_IsSet($in.css_data['fieldset .foot']) === 'false') {
            $in.css_data['fieldset .foot'] = 'display: block;';
        }

        return {
            'answer': $in.answer,
            'message': $in.message,
            'html': $in.html,
            'css_data': $in.css_data
        };
    };

    /**
     * The actual presentation box parts
     * @version 2016-10-26
     * @since   2016-10-26
     * @author  Peter Lembke
     */
    const internal_PresentationBox = function ($in)
    {
        const $default = {
            'head_label': '',
            'head_text': '',
            'foot_text': '',
            'content_data': '',
            'content_embed': '',
            'content_embed_new_tab': '',
            'open': 'true',
            'original_alias': ''
        };
        $in = _Default($default, $in);

        // Divide the creation in smaller parts
        let $parts = {};

        if ($in.head_label !== '')
        {
            $parts.head_label = {
                'type': 'link',
                'subtype': 'toggle',
                'show': '[head_label_data]',
                'toggle_alias': 'content',
                'original_alias': $in.original_alias
            };
            $parts.head_label_data = {
                'type': 'common',
                'subtype': 'container',
                'data': $in.head_label,
                'original_alias': $in.original_alias
            };
        }

        if (_Empty($in.content_embed_new_tab) === 'false') {
            $in.foot_text = $in.content_embed_new_tab + $in.foot_text;
        }

        if ($in.head_text !== '') {
            $parts.head = {
                'type': 'common',
                'subtype': 'container',
                'data': $in.head_text,
                'class': 'head',
                'original_alias': $in.original_alias
            };
        }

        if ($in.foot_text !== '') {
            $parts.foot = {
                'type': 'common',
                'subtype': 'container',
                'data': $in.foot_text,
                'class': 'foot',
                'original_alias': $in.original_alias
            };
        }

        if (_Empty($in.content_data) === 'false') {
            $parts.content = {
                'type': 'common',
                'subtype': 'container',
                'data': '[content_data]',
                'display': $in.open,
                'class': 'content',
                'original_alias': $in.original_alias
            };

            if (_Empty($in.content_embed) === 'true')
            {
                $parts.content_data = {
                    'type': 'common',
                    'subtype': 'value',
                    'data': $in.content_data,
                    'original_alias': $in.original_alias
                };
            }
            else {
                $parts.content_data = {
                    'type': 'common',
                    'subtype': 'value',
                    'data': '[content_data_link]',
                    'original_alias': $in.original_alias
                };

                $parts.content_data_link = {
                    'type': 'link',
                    'subtype': 'embed',
                    'show': $in.content_data,
                    'embed': $in.content_embed,
                    'original_alias': $in.original_alias
                };
            }
        }

        if (_Count($parts) > 0) {

            let $legendData = '';
            if (_IsSet($parts.head) === 'true') {
                $legendData = $legendData + '[head]';
            }
            if (_IsSet($parts.content) === 'true') {
                $legendData = $legendData + '[content]';
            }
            if (_IsSet($parts.foot) === 'true') {
                $legendData = $legendData + '[foot]';
            }

            let $label = '';
            if ($in.head_label !== '') {
                $label = '[head_label]';
            }

            $parts.legend = {
                'type': 'common',
                'subtype': 'legend',
                'label': $label,
                'data': $legendData,
                'original_alias': $in.original_alias
            };
        }

        return {
            'answer': 'true',
            'message': 'Here are the parts to build the presentation box',
            'data': $parts,
            'how': {
                'mode': 'one box',
                'text': '[legend]'
            },
            'where': {
                'mode': 'html'
            }
        };
    };
}
//# sourceURL=infohub_rendermajor.js