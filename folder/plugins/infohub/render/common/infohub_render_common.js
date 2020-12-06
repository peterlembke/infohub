/**
 * infohub_render_common.js renders the commonly used html
  * @category InfoHub
 * @package infohub_render_common
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
function infohub_render_common() {

    "use strict";

// include "infohub_base.js"

    const _Version = function() {
        return {
            'date': '2020-08-30',
            'since': '2015-02-15',
            'version': '1.1.1',
            'checksum': '{{checksum}}',
            'class_name': 'infohub_render_common',
            'note': 'Render HTML for features like images, iframes, containers, legends, lists, progress etc',
            'status': 'normal',
            'SPDX-License-Identifier': 'GPL-3.0-or-later'
        };
    };

    const _GetCmdFunctions = function() {
        const $list = {
            'create': 'normal', // ContainerStart, ContainerStop, Container, Codecontainer, Iframe, Legend, Image, Value, List, LabelData
            'event_message': 'normal'
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
        if (_Empty($text) === 'true') {
            return '';
        }

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
        const $default = {
            'id': '',
            'name': '',
            'class': ''
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
     * Gives CSS for how to display
     * Display = "block", "inline", "none" or leave it empty
     * You can also set display = true, that equals to "block"
     * You can also set display = false, that equals to "none"
     * @since 2017-02-20
     * @param $in
     * @returns {string}
     * @private
     */
    const _Display = function ($in)
    {
        const $default = {
            'display': ''
        };
        $in = _Default($default, $in);

        let $style = '';

        if ($in.display !== '') {

            if ($in.display === 'false') {
                $in.display = 'none';
            }

            if ($in.display === 'true') {
                $in.display = 'block';
            }

            $style = 'style="display:' + $in.display + '"';
        }

        return $style;
    };

    // *****************************************************************************
    // * Functions you only can reach with CMD()
    // * Observe function names are lower_case
    // *****************************************************************************

    /**
     * Get instructions and create the message to InfoHub View
     * @version 2016-10-16
     * @since   2016-10-16
     * @author  Peter Lembke
     */
    $functions.push('create');
    const create = function ($in)
    {
        $in = _ByVal($in);

        $in.func = _GetFuncName($in.subtype);
        let $response = internal_Cmd($in);

        const $default = {
            'answer': 'false',
            'message': '',
            'html': '',
            'css_data': {},
            'display': ''
        };
        $response = _Default($default, $response);

        return {
            'answer': $response.answer,
            'message': $response.message,
            'html': $response.html,
            'css_data': $response.css_data,
            'display': $response.display
        };
    };

    // *****************************************************************************
    // * Internal function that you only can reach from internal_Cmd
    // *****************************************************************************

    /**
     * Create a start tag with a span, p or div
     * @version 2016-10-16
     * @since   2015-02-15
     * @author  Peter Lembke
     */
    const internal_ContainerStart = function ($in)
    {
        const $default = {
            'alias': '',
            'class': 'container',
            'tag': 'div' // span, p, div
            // 'css_data': {}
            // You can not use css_data because it wraps around the html,
            // and this is only a start tag without an end tag.
            // Set the css on an outer container instead.
        };
        $in = _Default($default, $in);

        // Make sure only the valid tags are used
        let $tag = {
            'span': 'span',
            'p': 'p',
            'div': 'div'
        };

        if (typeof $tag[$in.tag] === 'undefined') {
            $in.tag = 'div';
        }

        const $id = _GetId({'id': $in.alias, 'name': $in.alias, 'class': $in.class });
        const $html = '<' + $in.tag + ' ' + $id + '>';

        return {
            'answer': 'true',
            'message': 'Container html',
            'html': $html
        };
    };

    /**
     * Create an end tag with a span, p or div
     * @version 2016-10-16
     * @since   2015-02-15
     * @author  Peter Lembke
     */
    const internal_ContainerStop = function ($in)
    {
        const $default = {
                'tag': 'div' // span, p, div
            };
        $in = _Default($default, $in);

        // Make sure only the valid tags are used
        let $tag = {
            'span': 'span',
            'p': 'p',
            'div': 'div'
        };

        if (typeof $tag[$in.tag] === 'undefined') {
            $in.tag = 'div';
        }

        const $html = '</' + $in.tag + '>';

        return {
            'answer': 'true',
            'message': 'Container html',
            'html': $html
        };
    };

    /**
     * Create a container with: span, p or div
     * @version 2016-10-23
     * @since   2015-02-15
     * @author  Peter Lembke
     */
    const internal_Container = function ($in)
    {
        const $default = {
            'alias': '',
            'class': 'container',
            'tag': 'span', // span, p, div, pre
            'data': '',
            'css_data': {},
            'display': '' // leave empty, "block" or "inline" or "none".
        };
        $in = _Default($default, $in);

        // Make sure only the valid tags are used
        let $tag = {
            'span': 'span',
            'p': 'p',
            'div': 'div'
        };
        if (typeof $tag[$in.tag] === 'undefined') {
            $in.tag = 'span';
        }

        const $display = _Display($in);
        const $id = _GetId({'id': $in.alias, 'name': $in.alias, 'class': $in.class });
        const $html = '<' + $in.tag + ' ' + $id + ' ' + $display +'>' + $in.data + '</' + $in.tag + '>';

        if (_Empty($in.css_data) === 'true') {
            if ($in.class === 'container-pretty') {
                $in.css_data = {
                    '.container-pretty' : 'border:1px solid #bcdebc; margin: 8px 4px 8px 4px; padding: 4px 4px 4px 4px; border-radius:10px;'
                };
            }
            if ($in.class === 'container-small') {
                $in.css_data = {
                    '.container-small': 'display:inline-block;vertical-align:top;max-width:320px;'
                };
            }
            if ($in.class === 'container-medium') {
                $in.css_data = {
                    '.container-medium': 'display:inline-block;vertical-align:top;max-width:640px;'
                };
            }
            if ($in.class === 'container-large') {
                $in.css_data = {
                    '.container-large': 'display:inline-block;vertical-align:top;max-width:960px;'
                };
            }
        }

        return {
            'answer': 'true',
            'message': 'Container html',
            'html': $html,
            'css_data': $in.css_data,
            'display': $in.display
        };
    };

    /**
     * Create a code container
     * @version 2018-10-22
     * @since   2018-10-22
     * @author  Peter Lembke
     */
    const internal_Codecontainer = function ($in)
    {
        const $default = {
            'alias': '',
            'class': 'code-example',
            'language': 'json',
            'data': '',
            'tag': 'div', // div, span or nothing
            'css_data': {}
        };
        $in = _Default($default, $in);

        const $id = _GetId({'id': $in.alias, 'name': $in.alias, 'class': '' });

        const $data = _Replace("\n", '&#13;&#10;', $in.data);

        let $inline = '';
        if ($in.tag === '') {
            $inline = ' style="display:inline-block;"';
        }

        let $html = '<pre'+$inline+'><code class="language-' + $in.language + '" '+ $id +'>' + $data + '</code></pre>';

        if ($in.tag === 'div' || $in.tag === 'span') {
            $html = '<'+$in.tag+' class="'+ $in.class +'">' + $html + '</'+$in.tag+'>';
        }

        if (_Empty($in.css_data) === 'true' && $in.class === 'code-example') {
            $in.css_data = {
                '.code-example' : 'display: inline-grid;',
                'pre': 'background-color: rgba(220, 220, 220, 0.9);border:1px solid rgba(0, 0, 0, 0.5);padding: 3px;margin: 1px;margin-top: 3px;overflow-x:scroll;font-family: monospace;box-sizing:border-box'
            };
        }

        if (_Empty($in.css_data) === 'true' && $in.class === 'code-inline') {
            $in.css_data = {
                '.code-inline' : 'display: inline-grid;',
                'pre': 'background-color: rgba(220, 220, 220, 0.9);border:1px solid rgba(0, 0, 0, 0.5);padding: 0px;margin: 0 2px 0 2px; padding: 0 2px 0 2px; font-family: monospace;box-sizing:border-box'
            };
        }

        return {
            'answer': 'true',
            'message': 'Code container html',
            'html': $html,
            'css_data': $in.css_data
        };
    };

    /**
     * Get iframe html
     * iframes allow other web pages to run on your page. Sandbox is not secure enough.
     * You should NOT use iframes but if you need to then use this function.
     * The sanity scripts will nag you when they see an iframe.
     * @version 2016-10-16
     * @since   2015-02-15
     * @author  Peter Lembke
     * @deprecated
     */
    const internal_Iframe = function ($in)
    {
        const $default = {
            'alias': '',
            'height': '350px',
            'class': 'container',
            'data': '', // Url to the external data
            'css_data': {}
        };
        $in = _Default($default, $in);

        const $id = _GetId({'id': $in.alias, 'name': $in.alias, 'class': $in.class });

        const $parameters = [
            'sandbox="allow-scripts allow-same-origin allow-forms allow-popups"',
            'frameborder="0"',
            'scrolling="no"',
            'marginwidth="0"',
            'width="100%"',
            'style="overflow:hidden;margin:0px;padding:0px;"',
            'height="' + $in.height + '"',
            'src="' + $in.data + '"',
            $id
        ];
        const $html = '<iframe ' + $parameters.join(' ') + '></iframe>';

        return {
            'answer': 'true',
            'message': 'iframe html',
            'html': $html,
            'css_data': $in.css_data
        };
    };

    /**
     * Legend
     * Get a legend frame
     * @version 2015-03-31
     * @since   2015-03-31
     * @author  Peter Lembke
     */
    const internal_Legend = function ($in)
    {
        const $default = {
            'alias': '',
            'label': '',
            'data': '',
            'class': 'fieldset',
            'css_data': {}
        };
        $in = _Default($default, $in);

        let $id = '';
        let $html = '';

        if ($in.label !== '') {
            $id = _GetId({'class': 'legend' });
            $html = '<legend ' + $id + '>' + $in.label + '</legend>';
        }

        $html = $html + $in.data;

        $id = _GetId({'class': $in.class });
        $html = '<fieldset ' + $id + '>' + $html + '</fieldset>';

        if (_Empty($in.css_data) === 'true' && $in.class === 'fieldset') {
            $in.css_data = {
                'parent' : 'break-inside: avoid;',
                'fieldset' : 'border: 1px solid #bcdebc; margin: 8px 4px 8px 4px; padding: 4px 4px 4px 4px; border-radius:10px;',
                'fieldset .legend': 'color: #000; border: 1px solid #a6c8a6; padding: 2px 13px; font-size: 1.0em; font-weight: bold; box-shadow: 0 0 0 0px #ddd; margin-left: 20px; border-radius: 20px;'
            };
        }

        return {
            'answer': 'true',
            'message': 'Legend HTML',
            'html': $html,
            'css_data': $in.css_data
        };
    };

    /**
     * Get an image
     * @version 2017-02-22
     * @since   2015-03-31
     * @author  Peter Lembke
     */
    const internal_Image = function ($in)
    {
        const $default = {
            'alias': '',
            'data': '',
            'class': 'image',
            'css_data': {}
        };
        $in = _Default($default, $in);

        let $html = '';

        if ($in.data !== '') {
            if ($in.data.substr(0, 10) !== 'data:image' && $in.data.substr(0, 1) !== '[') {
                $in.data = 'data:image/png;base64,' + $in.data;
            }

            const $id = _GetId({'id': $in.alias, 'name': $in.alias, 'class': $in.class });
            $html = '<img ' + $id + ' src="' + $in.data + '">';
        }

        if (_Empty($in.css_data) === 'true' && $in.class === 'image') {
            $in.css_data = {
                '.image': 'border-radius: 15px 15px 15px 15px; width: 100%; clear: both; display: block; box-sizing: border-box;'
            };
        }

        return {
            'answer': 'true',
            'message': 'Legend HTML',
            'html': $html,
            'css_data': $in.css_data
        };
    };

    /**
     * Display an SVG image
     * Make sure your svg sets width="100%" and height="100%" and have a viewBox parameter.
     * SVG that use (# will interfere with each other. In infohub_render_text.js -> _SvgIdsMoreUnique
     * we have a solution that make IDs unique.
     * @version 2018-12-30
     * @since   2018-12-30
     * @author  Peter Lembke
     * @param {type} $in
     * @returns {infohub_render_common.internal_Svg.infohub_render_commonAnonym$18}
     */
    const internal_Svg = function ($in)
    {
        const $default = {
            'alias': '',
            'data': '',
            'class': 'svg',
            'css_data': {}
        };
        $in = _Default($default, $in);

        let $html = '';

        if ($in.data !== '')
        {
            const $parameters = _GetId({
                'id': $in.alias,
                'name': $in.alias,
                'class': $in.class
            });

            $html = '<div ' + $parameters + '>' + $in.data + '</div>';
        }

        if (_Empty($in.css_data) === 'true' && $in.class === 'svg') {
            $in.css_data = {
                '.svg': 'width:100%; height:100%; clear:both; display:block; box-sizing:border-box; margin-top: 1px;'
            };
        }

        return {
            'answer': 'true',
            'message': 'Legend HTML',
            'html': $html,
            'css_data': $in.css_data
        };
    };

    /**
     * Returns the value untouched.
     * @version 2016-10-16
     * @since   2016-10-16
     * @author  Peter Lembke
     */
    const internal_Value = function ($in)
    {
        const $default = {
            'data': ''
        };
        $in = _Default($default, $in);

        return {
            'answer': 'true',
            'message': 'value HTML',
            'html': $in.data
        };
    };

    /**
     * Join all these strings to one string
     * Used when you have longer texts in a column view and want to use the translation system.
     * @version 2019-10-06
     * @since   2019-10-06
     * @author  Peter Lembke
     */
    const internal_Join = function ($in)
    {
        const $default = {
            'title': '',
            'data0': '',
            'data1': '',
            'data2': '',
            'data3': '',
            'data4': '',
            'data5': '',
            'data6': '',
            'data7': '',
            'data8': '',
            'data9': ''
        };
        $in = _Default($default, $in);

        let $htmlArray = [];

        for (let $i = 0; $i < 10; $i = $i + 1)
        {
            const $key = 'data' + $i;
            const $data = $in[$key];
            if ($data !== '') {
                $htmlArray.push($data);
            }
        }

        let $html = $htmlArray.join('');

        if ($in.title !== '') {
            $html = '[h2]' + $in.title + '[/h2]' + $html;
        }

        return {
            'answer': 'true',
            'message': 'value HTML',
            'html': $html
        };
    };

    /**
     * Create HTML for a list
     * @version 2018-06-25
     * @since   2014-02-22
     * @author  Peter Lembke
     */
    const internal_List = function ($in)
    {
        const $default = {
            'alias': '',
            'class': 'list',
            'option': [],
            'css_data': {},
            'display': '' // leave empty or use "block" or "inline" or "none".
        };
        $in = _Default($default, $in);

        $in.html = '';

        const $optionDefault = {
            'label': '',
            'id': ''
        };

        let $id;

        for (let $rowNumber = 0; $rowNumber < $in.option.length; $rowNumber = $rowNumber + 1)
        {
            let $row = $in.option[$rowNumber];
            $row = _Default($optionDefault, $row);

            let $startTag = '<li>';
            if (_Empty($row.id) === 'false') {
                $id = 'id="{box_id}_' + $row.id + '"';
                $startTag = '<li ' + $id + '>';
            }

            $in.html = $in.html + $startTag + $row.label + '</li>';
        }

        $id = _GetId({'id': $in.alias, 'name': $in.alias, 'class': $in.class });
        const $display = _Display($in);
        $in.html = '<ul ' + $id + ' ' + $display + '>' + $in.html + '</ul>';

        return {
            'answer': 'true',
            'message': 'Rendered html for a list',
            'html': $in.html,
            'css_data': $in.css_data
        };
    };

    /**
     * Get a label and a data box
     * The label will be displayed first and the data to the right.
     * If there is not enough space, then the data will appear under the label.
     * @version 2018-06-30
     * @since   2018-06-30
     * @author  Peter Lembke
     */
    const internal_LabelData = function ($in)
    {
        const $default = {
            'alias': '',
            'label': '',
            'data': '',
            'class': 'labeldata',
            'css_data': {}
        };
        $in = _Default($default, $in);

        const $id = _GetId({'id': $in.alias, 'name': $in.alias, 'class': $in.class });
        const $idLabel = _GetId({'id': $in.alias + '_label', 'name': $in.alias + '_label', 'class': 'label' });
        const $idData = _GetId({'id': $in.alias + '_data', 'name': $in.alias + '_data', 'class': 'data' });
        const $html = '<div ' + $id + '><span ' + $idLabel + '>' + $in.label + '</span><span ' + $idData + '>' + $in.data + '</span></div>';

        if (_Empty($in.css_data) === 'true' && $in.class === 'labeldata') {
            $in.css_data = {
                'parent': 'display: inline-block',
                '.labeldata': 'width: 100%; display: inline; box-sizing: border-box; padding: 2px 2px 2px 2px;', //  border: 1px solid #4CAF50;
                '.label': 'font-weight: bold; padding: 2px 2px 2px 2px;',
                '.data': 'padding: 2px 2px 2px 2px;'
            };
        }

        return {
            'answer': 'true',
            'message': 'Label and data',
            'html': $html,
            'css_data': $in.css_data
        };
    };

    /**
     * Create HTML for a progress bar
     * Use infohub_view -> progress to modify the value and max parameters.
     * @version 2020-08-30
     * @since   2020-08-30
     * @author  Peter Lembke
     */
    const internal_Progress = function ($in)
    {
        const $default = {
            'alias': '',
            'class': 'progress',
            'max': 100,
            'value': 0,
            'css_data': {},
            'display': '' // leave empty or use "block" or "inline" or "none".
        };
        $in = _Default($default, $in);

        const $display = _Display($in);
        const $id = _GetId({'id': $in.alias, 'name': $in.alias, 'class': $in.class });
        const $html = '<progress ' + $id + ' max="'+$in.max+'" value="'+$in.value+'" ' + $display +'></progress>';

        return {
            'answer': 'true',
            'message': 'Rendered html for a progress bar',
            'html': $html,
            'css_data': $in.css_data
        };
    };
}
//# sourceURL=infohub_render_common.js