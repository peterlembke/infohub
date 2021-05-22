/**
 * infohub_render_form.js renders the formly used html
 * @category InfoHub
 * @package infohub_render_form
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
function infohub_render_form() {

    'use strict';

// include "infohub_base.js"

    const _Version = function() {
        return {
            'date': '2019-03-12',
            'since': '2018-05-27',
            'version': '1.1.0',
            'checksum': '{{checksum}}',
            'class_name': 'infohub_render_form',
            'note': 'Render HTML for form elements like buttons, text, checkbox, radio button, select',
            'status': 'normal',
            'SPDX-License-Identifier': 'GPL-3.0-or-later',
        };
    };

    const _GetCmdFunctions = function() {
        const $list = {
            'create': 'normal',
            'event_message': 'normal',
            'render_options': 'normal',
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

        let $parts = $text.split('_');
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
    const _GetId = function($in) {
        const $default = {
            'id': '',
            'name': '',
            'class': '',
        };
        $in = _Default($default, $in);

        let $parameter = [];

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
            $class = 'class="' + $class + '"';
            $parameter.push($class);
        }

        return ' ' + $parameter.join(' ');
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
    const _Display = function($in) {
        const $default = {
            'display': '',
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

    /**
     * Get the rest of the html parameters
     * @version 2018-05-31
     * @since 2018-05-31
     * @param $in
     * @param $fields
     * @returns {string}
     * @private
     */
    const _GetParameters = function($in, $fields) {
        let $useFields = [];

        if (_IsSet($in.custom_variables) === 'true') {
            $in = _Merge($in, $in.custom_variables);

            for (let $keyOut in $in.custom_variables) {
                if ($keyOut === 'custom_variables') { continue; }
                if (_IsSet($fields[$keyOut]) === 'true') { continue; }
                $fields[$keyOut] = $keyOut;
            }
            delete $in.custom_variables;
        }

        for (let $keyOut in $fields) {
            if ($keyOut === 'enabled' || $keyOut === 'multiple') {
                continue;
            }
            if ($fields.hasOwnProperty($keyOut)) {
                const $keyIn = $fields[$keyOut];
                const $data = $in[$keyIn];
                if (_Empty($data) === 'false') {
                    const $field = $keyOut + '="' + $data + '"';
                    $useFields.push($field);
                }
            }
        }

        let $disabled = '';
        if (_IsSet($fields.enabled) === 'true' && _IsSet($in.enabled) ===
            'true' && $in.enabled === 'false') {
            $disabled = ' disabled';
        }

        let $multiple = '';
        if (_IsSet($fields.multiple) === 'true' && _IsSet($in.multiple) ===
            'true' && $in.multiple === 'false') {
            $multiple = ' multiple';
        }

        return ' ' + $useFields.join(' ') + $disabled + $multiple;
    };

    /**
     * Get the options rendered to HTML
     * @version 2018-05-31
     * @since 2018-05-31
     * @param $in
     * @returns {string}
     * @private
     */
    const _GetOptions = function($in) {
        let $options = '', $selected;

        const $default = {
            'options': [],
        };
        $in = _Default($default, $in);

        for (let $optionCountNumber = 0; $optionCountNumber <
        $in.options.length; $optionCountNumber = $optionCountNumber + 1) {
            if (_IsSet($in.options[$optionCountNumber]) === 'false') {
                continue;
            }

            const $default = {
                'type': '',
                'label': '',
                'value': '',
                'selected': 'false',
            };
            let $data = _Default($default, $in.options[$optionCountNumber]);

            $selected = '';
            if ($data.selected === 'true') {
                $selected = ' selected="selected"';
            }

            if ($data.label.length > 22) {
                $data.label = $data.label.substr(0, 20) + '..'; // Cutting off so it looks ok on mobile
            }

            if ($data.type === 'option') {
                $options = $options + '<option' + $selected + ' value="' +
                    $data.value + '">' + $data.label + '</option>';
                continue;
            }

            if ($data.type === 'optgroup') {
                $options = $options + '<optgroup label="' + $data.label + '">';
                continue;
            }

            if ($data.type === '/optgroup') {
                $options = $options + '</optgroup>';
            }

        }

        return $options;
    };

    /**
     * Get the options rendered to HTML
     * @version 2018-06-24
     * @since 2018-06-24
     * @param $in
     * @returns {string}
     * @private
     */
    const _GetDataListOptions = function($in) {
        let $options = '';

        const $default = {
            'label': '',
        };

        for (let $i = 0; $i < $in.options.length; $i = $i + 1) {
            if (_IsSet($in.options[$i]) === 'false') {
                continue;
            }

            const $data = _Default($default, $in.options[$i]);
            $options = $options + '<option>' + $data.label + '</option>';
        }

        return $options;
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
    const create = function($in) {
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
     * Render options to HTML. Can be used to update an existing select box
     * @version 2018-08-09
     * @since   2018-08-09
     * @author  Peter Lembke
     * @param $in
     * @returns {{answer: string, message: string, html: string}}
     */
    $functions.push('render_options');
    const render_options = function($in) {
        const $default = {
            'options': [],
        };
        $in = _Default($default, $in);

        const $optionsHTML = _GetOptions($in);

        return {
            'answer': 'true',
            'message': 'Here are the HTML for the options',
            'html': $optionsHTML,
        };
    };

    // *****************************************************************************
    // * Internal function that you only can reach from internal_Cmd
    // *****************************************************************************

    /**
     * Create HTML for a button
     * https://www.w3schools.com/tags/tag_button.asp
     * @version 2018-05-26
     * @since   2018-05-25
     * @author  Peter Lembke
     */
    const internal_Button = function($in) {
        const $default = {
            'enabled': 'true',
            'alias': '',
            'class': '',
            'button_label': 'Submit',
            'mode': 'submit', // submit, button
            'event_data': 'submit',
            'event_handler': 'infohub_render',
            'to_node': 'client',
            'to_plugin': '', // plugin that should have the data after the event_handler have processed the event,
            'to_function': 'event_message',
            'custom_variables': {},
            'css_data': {},
            'config': {},
            'display': '', // leave empty, "block" or "inline" or "none".
        };
        $in = _Default($default, $in);

        const $constants = {
            'type': 'form',
            'subtype': 'button',
            'renderer': 'infohub_render_form',
        };
        $in = _Merge($constants, $in);

        const $fields = {
            'type': 'subtype',
            'renderer': 'renderer',
            'event_data': 'event_data',
            'alias': 'alias',
            'mode': 'mode',
            'enabled': 'enabled',
        };

        let $event = '';
        let $destination = '';

        let $cssData = $in.css_data;

        if ($in.class === '') {
            $in.class = 'button button-width button-colour button-text-colour';
        }

        if ($in.event_handler !== '') {
            const $idString = ['{box_id}', $in.alias].join('_');
            $event = ' onClick="go(\'' + $in.event_handler + '\',\'click\',\'' +
                $idString + '\')"';
            $destination = ' to_node="' + $in.to_node + '" to_function="' +
                $in.to_function + '" to_plugin="' + $in.to_plugin + '"';
        }

        if ($in.to_plugin !== '') {
            $destination = ' to_node="' + $in.to_node + '" to_function="' +
                $in.to_function + '" to_plugin="' + $in.to_plugin + '"';
        }

        const $id = _GetId(
            {'id': $in.alias, 'name': $in.alias, 'class': $in.class});
        const $display = _Display($in);

        $in.html = '<button' + $id + $display + _GetParameters($in, $fields) +
            $destination + $event + '>' + $in.button_label + '</button>';

        if ($in.class ===
            'button button-width button-colour button-text-colour') {
            $cssData = {
                '.button':
                    'font-size: 1.0em;' +
                    'border-radius: 20px;' +
                    'border: 0px;' +
                    'margin: 10px 0px 0px 0px;' +
                    'padding: 4px 10px;',
                '.button-width':
                    'width: 100%;' +
                    'box-sizing:border-box;' +
                    'max-width: 320px;',
                '.button-text-colour':
                    'color: #0b1f00;',
                '.button-text-colour:hover':
                    'color: #1b350a;',
                '.button-colour':
                    'background-color: #7df76d;' +
                    // 'background: linear-gradient(#7df76d, #6d8df7);' +
                    'box-shadow: 0 4px 6px rgba(0, 0, 0, 0.25) inset;',
                '.button-colour:focus':
                    'box-shadow: 0 0 0 2pt #6d8df7;',
                '.button-colour:hover':
                    'box-shadow: 0 0 0 2pt #6d8df7;',
            };
            $cssData = _MergeStringData($cssData, $in.css_data);
        }

        return {
            'answer': 'true',
            'message': 'Rendered html for a form button',
            'html': $in.html,
            'css_data': $cssData,
        };
    };

    /**
     * Create HTML for a file selector button
     * Note that type = form, subtype = ---, and input_type = file
     * @version 2019-01-12
     * @since   2019-01-12
     * @author  Peter Lembke
     */
    const internal_File = function($in) {
        const $default = {
            'button_label': 'Submit',
            'enabled': 'true',
            'multiple': 'false',
            'accept': '', // Unique file type specifiers, https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/file#Unique_file_type_specifiers
            'capture': '', // Read the camera as an image. 'user'=front camera, 'environment'=back camera. https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/file#capture
            'alias': '',
            'event_data': '',
            'class': 'file',
            'event_handler': 'infohub_render',
            'to_node': 'client',
            'to_plugin': '', // plugin that should have the data after the event_handler have processed the event
            'to_function': 'event_message',
            'css_data': {},
            'original_alias': '',
            'custom_variables': {},
            'config': {},
            'display': '', // leave empty, "block" or "inline" or "none".
        };
        $in = _Default($default, $in);

        const $constants = {
            'type': 'form',
            'subtype': 'file',
            'input_type': 'file',
            'renderer': 'infohub_render_form',
        };
        $in = _Merge($constants, $in);

        const $fields = {
            'type': 'input_type',
            'alias': 'alias',
            'renderer': 'renderer',
            'form_alias': 'original_alias',
            'enabled': 'enabled',
            'multiple': 'multiple',
            'accept': 'accept',
            'capture': 'capture',
            'event_data': 'event_data',
        };

        if ($in.to_plugin !== '') {
            $fields.to_node = 'to_node';
            $fields.to_plugin = 'to_plugin';
            $fields.to_function = 'to_function';
        }

        let $event = '';

        if ($in.event_handler !== '') {
            const $idString = ['{box_id}', $in.alias].join('_');
            $event = ' onChange="go(\'' + $in.event_handler +
                '\',\'change\',\'' +
                $idString + '\')"';
        }

        $in.html = '<div class="file"><label for="{box_id}_' + $in.alias +
            '" class="center">' + $in.button_label + '</label></div>';

        const $id = _GetId(
            {'id': $in.alias, 'name': $in.alias, 'class': 'hidden'});
        const $display = _Display($in);

        $in.html = $in.html + '<input' + $id + $display +
            _GetParameters($in, $fields) + $event + '>';

        let $cssData = $in.css_data;

        if ($in.class === 'file') {
            $cssData = {
                '.file':
                    'font-size: 1.0em;' +
                    'width: 100%;' +
                    'box-sizing:border-box;' +
                    'border-radius: 20px;' +
                    'background-color: #7df76d;' +
                    // 'background: linear-gradient(#7df76d, #6d8df7);'+
                    'border: 0px;' +
                    'margin: 10px 0px 0px 0px;' +
                    'padding: 4px 10px;' +
                    'display: inline-block;' +
                    'max-width: 320px;' +
                    'box-shadow: 0 4px 6px rgba(0, 0, 0, 0.25) inset;',
                '.hidden':
                    'display: none;',
                '.center':
                    'display: block;' +
                    'text-align: center;',
                '.file:focus':
                    'box-shadow: 0 0 0 2pt #6d8df7;',
                '.file:hover':
                    'box-shadow: 0 0 0 2pt #6d8df7;',
            };
            $cssData = _MergeStringData($cssData, $in.css_data);
        }

        return {
            'answer': 'true',
            'message': 'Rendered html for a form ' + $in.input_type,
            'html': $in.html,
            'css_data': $cssData,
        };
    };

    /**
     * Create HTML for a text element.
     * Note that type = form, subtype = text, and input_type can be a lot of different HTML5 form elements that all
     * gracefully fall back to text if they are not supported by the browser.
     * @version 2018-05-28
     * @since   2018-05-25
     * @author  Peter Lembke
     */
    const internal_Text = function($in) {
        const $default = {
            'input_type': 'text', // text, color, date, datetime-local, email, month, number, range, search, tel, time, url, week, password
            'enabled': 'true',
            'placeholder': '',
            'min_value': '',
            'step_value': '',
            'max_value': '',
            'maxlength': '',
            'pattern': '',
            'value': '',
            'alias': '',
            'class': 'text',
            'datalist_id': '', // Datalist id, if you have one of those
            'event_handler': 'infohub_render',
            'to_node': 'client',
            'to_plugin': '', // plugin that should have the data after the event_handler have processed the event
            'to_function': 'event_message',
            'validator_plugin': '', // plugin that validate the input and return 'valid' = 'true' or 'false'
            'validator_function': '',
            'css_data': {},
            'original_alias': '',
            'event_data': '',
            'custom_variables': {},
            'config': {},
            'display': '', // leave empty, "block" or "inline" or "none".
        };
        $in = _Default($default, $in);

        const $constants = {
            'type': 'form',
            'subtype': 'text',
            'renderer': 'infohub_render_form',
        };
        $in = _Merge($constants, $in);

        if (_Empty($in.datalist_id) === 'false') {
            $in.datalist_id = '{box_id}_' + $in.datalist_id;
        }

        const $fields = {
            'type': 'input_type',
            'min': 'min_value',
            'step': 'step_value',
            'max': 'max_value',
            'maxlength': 'maxlength',
            'pattern': 'pattern',
            'value': 'value',
            'alias': 'alias',
            'renderer': 'renderer',
            'list': 'datalist_id',
            'placeholder': 'placeholder',
            'form_alias': 'original_alias',
            'validator_plugin': 'validator_plugin',
            'validator_function': 'validator_function',
            'enabled': 'enabled',
            'event_data': 'event_data',
        };

        let $event = '';

        if ($in.event_handler !== '') {
            const $idString = ['{box_id}', $in.alias].join('_');

            $event = ' onChange="go(\'' + $in.event_handler +
                '\',\'change\',\'' +
                $idString + '\')"';
            if ($in.input_type === 'text') {
                $event = ' onKeyup="go(\'' + $in.event_handler +
                    '\',\'keyup\',\'' +
                    $idString + '\')"';
            }
        }

        let $destination = '';
        if ($in.to_plugin !== '') {
            $destination = ' to_node="' + $in.to_node + '" to_function="' +
                $in.to_function + '" to_plugin="' + $in.to_plugin + '"';
        }

        const $id = _GetId(
            {'id': $in.alias, 'name': $in.alias, 'class': $in.class});
        const $display = _Display($in);

        $in.html = '<input' + $id + $display + _GetParameters($in, $fields) +
            $destination + $event + '>';

        let $cssData = $in.css_data;

        if ($in.class === 'text') {
            $cssData = {
                '.text':
                    'width: 100%;' +
                    'box-sizing:border-box;' +
                    'margin: 10px 0px 0px 0px;' +
                    'padding: 4px 4px 4px 10px;' +
                    'border-radius: 20px;' +
                    'background-color: #f76d6d;' +
                    'border: 1px solid #7df76d;' +
                    'font-size: 16px;' +
                    'color: #0b1f00;' +
                    '-webkit-appearance: none;',
                '.text:focus':
                    'box-shadow: 0 0 0 2pt #6d8df7;',
                '.text:hover':
                    'box-shadow: 0 0 0 2pt #6d8df7;',
            };
            $cssData = _MergeStringData($cssData, $in.css_data);
        }

        return {
            'answer': 'true',
            'message': 'Rendered html for a form ' + $in.input_type,
            'html': $in.html,
            'css_data': $cssData,
        };
    };

    /**
     * Create HTML for a range element.
     * Note that type = form, subtype = text, and input_type = range
     * gracefully fall back to text if range are not supported by the browser.
     * @version 2018-09-02
     * @since   2018-09-02
     * @author  Peter Lembke
     */
    const internal_Range = function($in) {
        const $default = {
            'enabled': 'true',
            'min_value': '',
            'step_value': '',
            'max_value': '',
            'value': '',
            'alias': '',
            'class': 'range',
            'event_handler': 'infohub_render',
            'to_node': 'client',
            'to_plugin': '', // plugin that should have the data after the event_handler have processed the event
            'to_function': 'event_message',
            'validator_node': 'client',
            'validator_plugin': '', // plugin that validate the input and return 'valid' = 'true' or 'false'
            'validator_function': '',
            'css_data': {},
            'original_alias': '',
            'event_data': '',
            'custom_variables': {},
            'config': {},
            'display': '', // leave empty, "block" or "inline" or "none".
        };
        $in = _Default($default, $in);

        const $constants = {
            'type': 'form',
            'subtype': 'text',
            'input_type': 'range',
            'renderer': 'infohub_render_form',
        };
        $in = _Merge($constants, $in);

        const $fields = {
            'type': 'input_type',
            'min': 'min_value',
            'step': 'step_value',
            'max': 'max_value',
            'value': 'value',
            'alias': 'alias',
            'renderer': 'renderer',
            'form_alias': 'original_alias',
            'validator_node': 'validator_node',
            'validator_plugin': 'validator_plugin',
            'validator_function': 'validator_function',
            'enabled': 'enabled',
            'event_data': 'event_data',
        };

        if ($in.to_plugin !== '') {
            $fields.to_node = 'to_node';
            $fields.to_plugin = 'to_plugin';
            $fields.to_function = 'to_function';
        }

        let $event = '';

        if ($in.event_handler !== '') {
            const $idString = ['{box_id}', $in.alias].join('_');
            $event = ' onChange="go(\'' + $in.event_handler +
                '\',\'change\',\'' +
                $idString + '\')"';
            $event = $event + ' onInput="go(\'' + $in.event_handler +
                '\',\'input\',\'' + $idString + '\')"';
        }

        const $id = _GetId(
            {'id': $in.alias, 'name': $in.alias, 'class': $in.class});
        const $display = _Display($in);

        $in.html = '<input' + $id + $display + _GetParameters($in, $fields) +
            $event + '>';

        let $cssData = $in.css_data;

        if ($in.class === 'range') {
            $cssData = {
                '.range':
                    'background-color: #f76d6d;' +
                    'width: 100%;' +
                    'margin: 10px 0px 0px 0px;' +
                    'padding: 0px 0px 0px 0px;',
                '.range:focus':
                    'box-shadow: 0 0 0 2pt #6d8df7;',
                '.range:hover':
                    'box-shadow: 0 0 0 2pt #6d8df7;',
                // input Range, https://css-tricks.com/styling-cross-browser-compatible-range-inputs-css/
                'input[type=range]::-webkit-slider-thumb':
                    '-webkit-appearance: none; border: 0px; height: 36px; width: 16px; border-radius: 10px;' +
                    'background: #ff0000; cursor: pointer;' +
                    'margin-top: -4px;' + /* You need to specify a margin in Chrome, but in Firefox and IE it is automatic */
                    'box-shadow: 0 4px 8px rgba(0, 0, 0, 0.5) inset;',
                'input[type=range]::-moz-range-thumb': // All the same stuff for Firefox
                    '-moz-appearance: none;' +
                    'border: 0px; height: 16px; width: 16px; border-radius: 10px;' +
                    'background: #ff0000; cursor: pointer;' +
                    'box-shadow: 0 4px 8px rgba(0, 0, 0, 0.5) inset;',
                'input[type=range]::-webkit-slider-runnable-track':
                    'width: 100%; height: 10px; cursor: pointer;' +
                    'box-shadow: 0 4px 8px rgba(0, 0, 0, 0.5) inset;' +
                    'background: #7df76d; border-radius: 4px; border: 0px;',
                'input[type=range]::-moz-range-track':
                    'width: 100%; height: 10px; cursor: pointer;' +
                    'box-shadow: 0 4px 8px rgba(0, 0, 0, 0.5) inset;' +
                    'background: #7df76d; border-radius: 4px; border: 0px;',
            };
            $cssData = _MergeStringData($cssData, $in.css_data);
        }

        return {
            'answer': 'true',
            'message': 'Rendered html for a form ' + $in.input_type,
            'html': $in.html,
            'css_data': $cssData,
        };
    };

    /**
     * Create HTML for a textarea element.
     * @version 2018-05-29
     * @since   2018-05-29
     * @author  Peter Lembke
     */
    const internal_Textarea = function($in) {
        const $default = {
            'enabled': 'true',
            'placeholder': '',
            'maxlength': '',
            'alias': '',
            'event_handler': 'infohub_render',
            'to_node': 'client',
            'to_plugin': '', // plugin that should have the data after the event_handler have processed the event
            'to_function': 'event_message',
            'validator_plugin': '', // plugin that validate the input and return 'valid' = 'true' or 'false'
            'validator_function': '',
            'class': 'textarea',
            'css_data': {},
            'original_alias': '',
            'event_data': '',
            'resize': 'vertical',
            'custom_variables': {},
            'rows': 4,
            'cols': 0,
            'value': '',
            'config': {},
            'display': '', // leave empty, "block" or "inline" or "none".
        };
        $in = _Default($default, $in);

        const $constants = {
            'type': 'form',
            'subtype': 'textarea',
            'renderer': 'infohub_render_form',
        };
        $in = _Merge($constants, $in);

        $in.rows = $in.rows.toString();
        $in.cols = $in.cols.toString();

        const $fields = {
            'type': 'subtype',
            'maxlength': 'maxlength',
            'alias': 'alias',
            'renderer': 'renderer',
            'placeholder': 'placeholder',
            'form_alias': 'original_alias',
            'validator_plugin': 'validator_plugin',
            'validator_function': 'validator_function',
            'enabled': 'enabled',
            'event_data': 'event_data',
            'rows': 'rows',
            'cols': 'cols',
        };

        let $event = '';
        let $destination = '';

        if ($in.event_handler !== '') {
            const $idString = ['{box_id}', $in.alias].join('_');
            $event = ' onKeyup="go(\'' + $in.event_handler + '\',\'keyup\',\'' +
                $idString + '\')"';
            $destination = ' to_node="' + $in.to_node + '" to_function="' +
                $in.to_function + '" to_plugin="' + $in.to_plugin + '"';
        }

        if ($in.to_plugin !== '') {
            $destination = ' to_node="' + $in.to_node + '" to_function="' +
                $in.to_function + '" to_plugin="' + $in.to_plugin + '"';
        }

        const $id = _GetId(
            {'id': $in.alias, 'name': $in.alias, 'class': $in.class});
        const $display = _Display($in);

        $in.html = '<textarea' + $id + $display + _GetParameters($in, $fields) +
            $destination + $event + '>' + $in.value + '</textarea>';

        let $cssData = $in.css_data;

        if ($in.class === 'textarea') {
            $cssData = {
                '.textarea':
                    'width: 100%;' +
                    'box-sizing:border-box;' +
                    'margin: 10px 0px 0px 0px;' +
                    'padding: 4px 4px 4px 10px;' +
                    'border-radius: 20px;' +
                    'background-color: #f76d6d;' +
                    'border: 1px solid #7df76d;' +
                    'resize: ' + $in.resize + ';' +
                    'font-size: 16px;' +
                    'color: #0b1f00;' +
                    '-webkit-appearance: none;',
                '.textarea:focus':
                    'box-shadow: 0 0 0 2pt #6d8df7;',
                '.textarea:hover':
                    'box-shadow: 0 0 0 2pt #6d8df7;',
            };
            $cssData = _MergeStringData($cssData, $in.css_data);
        }

        return {
            'answer': 'true',
            'message': 'Rendered html for a form ' + $in.input_type,
            'html': $in.html,
            'css_data': $cssData,
        };
    };

    /**
     * Create HTML for a select element.
     * The select element can be a dropdown or a list. It can be a single select or a multi select.
     * https://www.w3schools.com/html/html_form_elements.asp
     * @version 2018-05-29
     * @since   2018-05-29
     * @author  Peter Lembke
     */
    const internal_Select = function($in) {
        const $default = {
            'enabled': 'true',
            'size': '1',
            'multiple': 'false',
            'options': [],
            'alias': '',
            'event_handler': 'infohub_render',
            'source_node': '',
            'source_plugin': '', // Plugin that has the options. Called only if the options are empty.
            'source_function': '',
            'to_node': 'client',
            'to_plugin': '', // plugin that should have the data after the event_handler have processed the event
            'to_function': 'event_message',
            'validator_plugin': '', // plugin that validate the input and return 'valid' = 'true' or 'false'
            'validator_function': '',
            'class': 'select',
            'css_data': {},
            'original_alias': '',
            'custom_variables': {},
            'event_data': '',
            'config': {},
            'display': '', // leave empty, "block" or "inline" or "none".
        };
        $in = _Default($default, $in);

        const $constants = {
            'type': 'form',
            'subtype': 'select',
            'renderer': 'infohub_render_form',
        };
        $in = _Merge($constants, $in);

        let $options = _GetOptions($in);

        $in = _Merge($in, $in.data);

        const $fields = {
            'type': 'subtype',
            'size': 'size',
            'alias': 'alias',
            'renderer': 'renderer',
            'form_alias': 'original_alias',
            'validator_plugin': 'validator_plugin',
            'validator_function': 'validator_function',
            'enabled': 'enabled',
            'event_data': 'event_data',
        };

        let $event = '';

        if ($in.event_handler !== '') {
            const $idString = ['{box_id}', $in.alias].join('_');
            $event = ' onChange="go(\'' + $in.event_handler +
                '\',\'change\',\'' +
                $idString + '\')"';
        }

        let $destination = '';
        if ($in.to_plugin !== '') {
            $destination = ' to_node="' + $in.to_node + '" to_function="' +
                $in.to_function + '" to_plugin="' + $in.to_plugin + '"';
        }

        let $multiple = '';
        if ($in.multiple === 'true') {
            $multiple = ' multiple';
        }

        const $id = _GetId(
            {'id': $in.alias, 'name': $in.alias, 'class': $in.class});
        const $display = _Display($in);

        $in.html = '<select' + $id + $display + _GetParameters($in, $fields) +
            $destination + $multiple + $event + '>' + $options + '</select>';

        let $cssData = $in.css_data;

        if ($in.class === 'select') {
            $cssData = {
                'parent': 'overflow-x:auto;',
                '.select':
                    'width: 100%;' +
                    'box-sizing: border-box;' +
                    'vertical-align: top;' +
                    'margin: 4px 0px 4px 0px;' +
                    'padding: 6px 4px 0px 4px;' +
                    'border-radius: 20px 0px 0px 20px;' +
                    'border: 1px solid #7df76d;' +
                    'font-size: 16px;' +
                    'color: #0b1f00;' +
                    'background: #f76d6d;',
                // 'background-image: linear-gradient(to right, white , rgb(202, 239, 202));',
                '.select option':
                    'margin: 0px 0px 0px 4px;' +
                    'padding: 1px 0px 1px 0px;',
                '.select optgroup':
                    'margin: 0px 0px 0px 4px;' +
                    'padding: 1px 0px 1px 0px;',
                '.select:focus':
                    'box-shadow: 0 0 0 2pt #6d8df7;',
                '.select:hover':
                    'box-shadow: 0 0 0 2pt #6d8df7;',
                '.select option:hover':
                // 'background: linear-gradient(#6d8df7, #6d8df7);'+
                    'background-color: #6d8df7 !important;', /* for IE */
                '.select option:focus, .select option:active, .select option:checked':
                // 'background: linear-gradient(#7df76d, #7df76d);'+
                    'background-color: #7df76d !important;', /* for IE */
            };
            $cssData = _MergeStringData($cssData, $in.css_data);
        }

        return {
            'answer': 'true',
            'message': 'Rendered html for a form select',
            'html': $in.html,
            'css_data': $cssData,
        };
    };

    /**
     * Create HTML for a datalist element.
     * datalist renders very strange, it is useless. DO NOT USE THIS.
     * https://www.w3schools.com/html/html_form_elements.asp
     * The value and label are displayed, the selected value are written to the text box.
     * It should only show the label, and the label should be copied to the textbox.
     * @version 2018-05-31
     * @since   2018-05-31
     * @author  Peter Lembke
     */
    const internal_Datalist = function($in) {
        const $default = {
            'options': [],
            'alias': '',
        };
        $in = _Default($default, $in);

        const $constants = {
            'type': 'form',
            'subtype': 'datalist',
            'renderer': 'infohub_render_form',
        };
        $in = _Merge($constants, $in);

        let $options = _GetOptions($in);

        const $fields = {
            'type': 'subtype',
            'alias': 'alias',
            'renderer': 'renderer',
        };

        const $id = _GetId({'id': $in.alias, 'name': $in.alias, 'class': ''});

        $in.html = '<datalist' + $id + _GetParameters($in, $fields) + '>' +
            $options + '</datalist>';

        return {
            'answer': 'true',
            'message': 'Rendered html for a datalist that you can use with a text box',
            'html': $in.html,
        };
    };

    /**
     * Create HTML for one radio button.
     * https://www.w3schools.com/html/html_form_elements.asp
     * @version 2018-05-31
     * @since   2018-05-31
     * @author  Peter Lembke
     */
    const internal_Radio = function($in) {
        const $default = {
            'enabled': 'true',
            'group_name': '',
            'alias': '',
            'label': '',
            'value': '',
            'event_handler': 'infohub_render',
            'to_node': 'client',
            'to_plugin': '', // plugin that should have the data after the event_handler have processed the event
            'to_function': 'event_message',
            'class': 'radio',
            'css_data': {},
            'original_alias': '',
            'selected': 'false',
            'event_data': '',
            'custom_variables': {},
        };
        $in = _Default($default, $in);

        const $constants = {
            'type': 'form',
            'subtype': 'radio',
            'renderer': 'infohub_render_form',
        };
        $in = _Merge($constants, $in);

        const $fields = {
            'type': 'subtype',
            'alias': 'alias',
            'option_alias': 'value',
            'renderer': 'renderer',
            'value': 'value',
            'form_alias': 'original_alias',
            'enabled': 'enabled',
            'event_data': 'event_data',
        };

        let $event = '';
        if ($in.event_handler !== '') {
            const $idString = ['{box_id}', $in.alias].join('_');
            $event = ' onChange="go(\'' + $in.event_handler +
                '\',\'change\',\'' +
                $idString + '\')"';
        }

        let $destination = '';
        if ($in.to_plugin !== '') {
            $destination = ' to_node="' + $in.to_node + '" to_function="' +
                $in.to_function + '" to_plugin="' + $in.to_plugin + '"';
        }

        let $checked = '';
        if ($in.selected === 'true') {
            $checked = ' checked';
        }

        const $id = _GetId(
            {'id': $in.alias, 'name': $in.group_name, 'class': $in.class});

        $in.html = '<span><input' + $id + _GetParameters($in, $fields) +
            $destination + $event + $checked + '><label for="{box_id}_' +
            $in.alias + '">' + $in.label + '</label></span>';

        let $cssData = $in.css_data;

        if ($in.class === 'radio') {
            $cssData = {};
            $cssData = _MergeStringData($cssData, $in.css_data);
        }

        return {
            'answer': 'true',
            'message': 'Rendered html for one radio element',
            'html': $in.html,
            'css_data': $cssData,
        };
    };

    /**
     * Create HTML for a range of radio buttons
     * https://www.w3schools.com/html/html_form_elements.asp
     * @version 2018-05-31
     * @since   2018-05-31
     * @author  Peter Lembke
     */
    const internal_Radios = function($in) {
        const $default = {
            'enabled': 'true',
            'group_name': '',
            'alias': '',
            'options': [],
            'event_handler': 'infohub_render',
            'to_node': 'client',
            'to_plugin': '', // plugin that should have the data after the event_handler have processed the event
            'to_function': 'event_message',
            'class': 'radio',
            'css_data': {},
            'original_alias': '',
            'event_data': '',
            'custom_variables': {},
            'config': {},
        };
        $in = _Default($default, $in);

        const $constants = {
            'type': 'form',
            'subtype': 'radio',
            'renderer': 'infohub_render_form',
        };
        $in = _Merge($constants, $in);

        let $html = '';

        for (let $i = 0; $i < $in.options.length; $i = $i + 1) {
            if ($in.options.hasOwnProperty($i) === false) {
                continue;
            }

            let $data = $in.options[$i];

            const $default = {
                'enabled': $in.enabled,
                'type': '',
                'group_name': $in.group_name,
                'alias': $in.alias,
                'label': '',
                'value': '',
                'event_handler': $in.event_handler,
                'to_node': $in.to_node,
                'to_plugin': $in.to_plugin,
                'to_function': $in.to_function,
                'class': $in.class,
                'css_data': {},
                'original_alias': $in.original_alias,
                'selected': 'false',
                'event_data': $in.event_data,
            };
            $data = _Default($default, $data);

            if (_Empty($data.value) === 'false') {
                $data.alias = $data.alias + '_' + $data.value;
            }

            const $response = internal_Radio($data);

            if ($response.answer === 'true') {
                $html = $html + $response.html;
            }

        }

        let $cssData = $in.css_data;

        if ($in.class === 'radio') {
            $cssData = {
                '.radio': 'display: inline-block;',
                '.radio:hover':
                    'box-shadow: 0 0 0 2pt #6d8df7;',
                'label': 'display: inline-block;',
                'label:hover':
                    'background: #6d8df7;',
                'span': 'display:inline-block;', // inline-block = ordered in a row. block = ordered in column
            };
            $cssData = _MergeStringData($cssData, $in.css_data);
        }

        return {
            'answer': 'true',
            'message': 'Rendered html for a group of radio element',
            'html': $html,
            'css_data': $cssData,
        };
    };

    /**
     * Create HTML for one checkbox
     * https://www.w3schools.com/html/html_form_elements.asp
     * @version 2018-05-31
     * @since   2018-05-31
     * @author  Peter Lembke
     */
    const internal_Checkbox = function($in) {
        const $default = {
            'enabled': 'true',
            'alias': '',
            'label': '',
            'value': '',
            'event_handler': 'infohub_render',
            'to_node': 'client',
            'to_plugin': '', // plugin that should have the data after the event_handler have processed the event
            'to_function': 'event_message',
            'validator_plugin': '', // plugin that validate the input and return 'valid' = 'true' or 'false'
            'validator_function': '',
            'class': 'checkbox',
            'css_data': {},
            'original_alias': '',
            'selected': 'false',
            'event_data': '',
            'custom_variables': {},
        };
        $in = _Default($default, $in);

        const $constants = {
            'type': 'form',
            'subtype': 'checkbox',
            'renderer': 'infohub_render_form',
        };
        $in = _Merge($constants, $in);

        const $fields = {
            'type': 'subtype',
            'alias': 'alias',
            'option_alias': 'value',
            'renderer': 'renderer',
            'value': 'value',
            'form_alias': 'original_alias',
            'validator_plugin': 'validator_plugin',
            'validator_function': 'validator_function',
            'enabled': 'enabled',
            'event_data': 'event_data',
        };

        let $event = '';
        if ($in.event_handler !== '') {
            const $idString = ['{box_id}', $in.alias].join('_');
            $event = ' onChange="go(\'' + $in.event_handler +
                '\',\'change\',\'' +
                $idString + '\')"';
        }

        let $destination = '';
        if ($in.to_plugin !== '') {
            $destination = ' to_node="' + $in.to_node + '" to_function="' +
                $in.to_function + '" to_plugin="' + $in.to_plugin + '"';
        }

        let $checked = '';
        if ($in.selected === 'true') {
            $checked = ' checked';
        }

        const $id = _GetId(
            {'id': $in.alias, 'name': $in.alias, 'class': $in.class});

        $in.html = '<span><input' + $id + _GetParameters($in, $fields) +
            $destination + $event + $checked + '><label for="{box_id}_' +
            $in.alias + '">' + $in.label + '</label></span>';

        let $cssData = $in.css_data;

        if ($in.class === 'checkbox') {
            $cssData = {};
            $cssData = _MergeStringData($cssData, $in.css_data);
        }

        return {
            'answer': 'true',
            'message': 'Rendered html for one checkbox',
            'html': $in.html,
            'css_data': $cssData,
        };
    };

    /**
     * Create HTML for a range of checkboxes
     * https://www.w3schools.com/html/html_form_elements.asp
     * @version 2018-05-31
     * @since   2018-05-31
     * @author  Peter Lembke
     */
    const internal_Checkboxes = function($in) {
        const $default = {
            'enabled': 'true',
            'alias': '',
            'options': [],
            'event_handler': 'infohub_render',
            'to_node': 'client',
            'to_plugin': '', // plugin that should have the data after the event_handler have processed the event
            'to_function': 'event_message',
            'class': 'checkbox',
            'css_data': {},
            'original_alias': '',
            'event_data': '',
            'custom_variables': {},
            'config': {},
        };
        $in = _Default($default, $in);

        const $constants = {
            'type': 'form',
            'subtype': 'checkbox',
            'renderer': 'infohub_render_form',
        };
        $in = _Merge($constants, $in);

        let $html = '';

        for (let $i = 0; $i < $in.options.length; $i = $i + 1) {
            if ($in.options.hasOwnProperty($i) === false) {
                continue;
            }

            let $data = $in.options[$i];

            const $default = {
                'enabled': $in.enabled,
                'type': '',
                'alias': $in.alias,
                'label': '',
                'value': '',
                'class': $in.class,
                'css_data': {},
                'event_handler': $in.event_handler,
                'to_node': $in.to_node,
                'to_plugin': $in.to_plugin,
                'to_function': $in.to_function,
                'validator_plugin': '',
                'validator_function': '',
                'original_alias': $in.original_alias,
                'selected': 'false',
                'event_data': $in.event_data,
            };
            $data = _Default($default, $data);

            if (_Empty($data.value) === 'false') {
                $data.alias = $data.alias + '_' + $data.value;
            }

            const $response = internal_Checkbox($data);

            if ($response.answer === 'true') {
                $html = $html + $response.html;
            }

        }

        let $cssData = $in.css_data;

        if ($in.class === 'checkbox') {
            $cssData = {
                '.checkbox': 'display: inline-block;',
                '.checkbox:hover':
                    'box-shadow: 0 0 0 2pt #6d8df7;',
                'label':
                    'display: inline-block;',
                'label:hover':
                    'background: #6d8df7;',
                'span': 'display:inline-block;', // inline-block = ordered in a row. block = ordered in column
            };
            $cssData = _MergeStringData($cssData, $in.css_data);
        }

        return {
            'answer': 'true',
            'message': 'Rendered html for a group of checkboxes',
            'html': $html,
            'css_data': $cssData,
        };
    };

    /**
     * Create HTML for a form
     * https://www.w3schools.com/html/html_form_elements.asp
     * @version 2018-05-31
     * @since   2018-05-31
     * @author  Peter Lembke
     */
    const internal_Form = function($in) {
        const $default = {
            'enabled': 'true',
            'alias': '',
            'content': '',
            'event_handler': 'infohub_render',
            'to_node': 'client',
            'to_plugin': '', // plugin that should have the data after the event_handler have processed the event
            'to_function': 'event_message',
            'class': 'form',
            'css_data': {},
            'event_data': '',
            'custom_variables': {},
        };
        $in = _Default($default, $in);

        const $constants = {
            'type': 'form',
            'subtype': 'form',
            'renderer': 'infohub_render_form',
        };
        $in = _Merge($constants, $in);

        const $fields = {
            'type': 'subtype',
            'alias': 'alias',
            'renderer': 'renderer',
            'value': 'value',
            'enabled': 'enabled',
            'event_data': 'event_data',
        };

        let $event = '';
        if ($in.event_handler !== '') {
            const $idString = ['{box_id}', $in.alias].join('_');
            $event = ' onSubmit="go(\'' + $in.event_handler +
                '\',\'submit\',\'' +
                $idString + '\')"';
        }

        let $destination = '';
        if ($in.to_plugin !== '') {
            $destination = ' to_node="' + $in.to_node + '" to_function="' +
                $in.to_function + '" to_plugin="' + $in.to_plugin + '"';
        }

        const $id = _GetId(
            {'id': $in.alias, 'name': $in.alias, 'class': $in.class});
        const $encoding = ' accept-charset="UTF-8"';

        $in.html = '<form' + $id + $encoding + _GetParameters($in, $fields) +
            $destination + $event + '>' + $in.content + '</form>';

        let $cssData = $in.css_data;

        if ($in.class === 'form') {
            $cssData = {
                '.form': '',
            };
            $cssData = _MergeStringData($cssData, $in.css_data);
        }

        return {
            'answer': 'true',
            'message': 'Rendered html for a form',
            'html': $in.html,
            'css_data': $cssData,
        };
    };

    /**
     * Create HTML for fieldset
     * This is a frame with a label on top. You can put content in here
     * https://www.w3schools.com/html/html_form_elements.asp
     * @version 2018-05-31
     * @since   2018-05-31
     * @author  Peter Lembke
     */
    const internal_Fieldset = function($in) {
        const $default = {
            'alias': '',
            'label': '',
            'content': '',
            'class': 'fieldset',
            'css_data': {},
            'event_data': '',
            'custom_variables': {},
        };
        $in = _Default($default, $in);

        const $constants = {
            'type': 'form',
            'subtype': 'fieldset',
            'renderer': 'infohub_render_form',
        };
        $in = _Merge($constants, $in);

        const $fields = {
            'type': 'subtype',
            'alias': 'alias',
            'renderer': 'renderer',
            'value': 'value',
            'event_data': 'event_data',
        };

        const $id = _GetId(
            {'id': $in.alias, 'name': $in.alias, 'class': $in.class});

        $in.html = '<fieldset' + $id + _GetParameters($in, $fields) +
            '><legend>' + $in.label + '</legend>' + $in.content + '</fieldset>';

        let $cssData = $in.css_data;

        if ($in.class === 'fieldset') {
            $cssData = {
                '.fieldset': '',
            };
            $cssData = _MergeStringData($cssData, $in.css_data);
        }

        return {
            'answer': 'true',
            'message': 'Rendered html for a fieldset',
            'html': $in.html,
            'css_data': $cssData,
        };
    };
}

//# sourceURL=infohub_render_form.js