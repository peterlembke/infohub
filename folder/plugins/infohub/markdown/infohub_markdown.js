/*
 Copyright (C) 2019- Peter Lembke, CharZam soft
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
function infohub_markdown() {

    "use strict";

// include "infohub_base.js"

    $functions.push('_Version');
    const _Version = function()
    {
        return {
            'date': '2019-03-13',
            'since': '2019-03-13',
            'version': '1.0.0',
            'class_name': 'infohub_markdown',
            'checksum': '{{checksum}}',
            'note': 'This plugin is a renderer. Markdown is a text format suitable for humans to read as it is. This plugin parse the text and create HTML to increase the readability in a browser.',
            'license_name': 'GNU GPL 3 or later'
        };
    };

    $functions.push('_GetCmdFunctions');
    var _GetCmdFunctions = function()
    {
        return {
            'create': 'normal',
            'get_render_list': 'normal',
            'get_render_option_list': 'normal'
        };
    };

    // *****************************************************************************
    // * The private functions, add your own in your plugin
    // * These functions can be used directly in your functions.
    // * Name: _CamelCaseData
    // *****************************************************************************

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

        for (let $key in $parts) {
            if ($parts.hasOwnProperty($key) === false) {
                continue;
            }
            $response = $response + $parts[$key].charAt(0).toUpperCase() + $parts[$key].substr(1);
        }

        return $response;
    };

    // *****************************************************************************
    // * Functions you only can reach with CMD()
    // * Observe! function names are lower_case
    // *****************************************************************************

    /**
     * Get instructions and create the message to InfoHub View
     * @version 2019-06-08
     * @since   2013-04-15
     * @author  Peter Lembke
     */
    $functions.push("create"); // Enable this function
    const create = function ($in)
    {
        const $default = {
            'text': '',
            'type': 'showdown', // The child renderer. marked, remarkable, showdown
            'subtype': '',
            'alias': '',
            'original_alias': '',
            'step': 'step_render_markdown',
            'html': '',
            'css_data': {
                'table': 'border: 1px solid #444444; background-color: #99cc99;',
                'thead': 'background-color: #bbeebb;',
                'tbody': 'background-color: #eeedee;',
                'blockquote': 'background: #ededff; border-left: 10px solid #dcdcff; margin: 1.5em 10px; padding: 0.5em 10px;',
                'img': 'border-radius: 15px 15px 15px 15px; width: 100%; clear: both; display: block; box-sizing: border-box;',
                'code': 'background-color: rgba(220, 220, 220, 0.9);'
            }
        };
        $in = _Merge($default, $in);

        if ($in.type === 'frog') {
            $in.type = 'showdown';
        }

        if ($in.step === 'step_render_markdown') 
        {
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_markdown_' + $in.type,
                    'function': 'convert'
                },
                'data': {
                    'type': $in.type,
                    'subtype': $in.subtype,
                    'text': $in.text
                },
                'data_back': {
                    'step': 'step_render_markdown_response',
                    'alias': $in.alias,
                    'css_data': $in.css_data
                }
            });
        }

        if ($in.step === 'step_render_markdown_response') {
            $in.step = 'step_final';
        }

        if ($in.step === 'step_final') {
            if (_Empty($in.alias) === 'false') {
                // All IDs become unique by inserting the parent alias in each ID.
                const $find = '{box_id}';
                const $replace = $find + '_' + $in.alias;
                $in.html = $in.html.replace(new RegExp($find, 'g'), $replace);
            }
        }
        
        return {
            'answer': $in.answer,
            'message': $in.message,
            'html': $in.html,
            'css_data': $in.css_data
        };
    };

    /**
     * Get list with names of all child renderers
     * @version 2019-04-07
     * @since   2019-04-07
     * @author  Peter Lembke
     */
    $functions.push("get_render_list"); // Enable this function
    const get_render_list = function ($in)
    {
       return {
           'answer': 'true',
           'message': 'Here are the list with all Markdown renderers',
           'data': _RenderList()
       };
    };

    /**
     * Get option list with names of all child renderers
     * @version 2019-04-07
     * @since   2019-04-07
     * @author  Peter Lembke
     */
    $functions.push("get_render_option_list"); // Enable this function
    const get_render_option_list = function ($in)
    {
        let $options = [],
            $list = _RenderList();
    
        for (let $key in $list) {
            if ($list.hasOwnProperty($key) === true) {
                const $option = {"type": "option", "value": $key, "label": $list[$key] };
                $options.push($option);
            }
        }

       return {
           'answer': 'true',
           'message': 'Here are the option list with all Markdown renderers',
           'options': $options,
           'ok': 'true'
       };
    };

    /**
     * List of supported Markdown converters
     * @param $in
     * @returns {{marked: string, remarkable: string, showdown: string}}
     * @private
     */
    const _RenderList = function ($in)
    {
       return {
            'marked': 'Marked',
            'remarkable': 'Remarkable',
            'showdown': 'Showdown'
       };
    };
}
//# sourceURL=infohub_markdown.js
