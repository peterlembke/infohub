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

    // include "infohub_base.js"

    // ***********************************************************
    // * your private class variables below, only declare with var
    // ***********************************************************

    var _Version = function() {
        return {
            'date': '2019-03-12',
            'since': '2018-05-27',
            'version': '1.1.0',
            'checksum': '{{checksum}}',
            'class_name': 'infohub_render_form',
            'note': 'Render HTML for form elements like buttons, text, checkbox, radio button, select',
            'status': 'normal',
            'license_name': 'GNU GPL 3 or later'
        };
    };

    var _GetCmdFunctions = function() {
        return {
            'create': 'normal',
            'event_message': 'normal',
            'render_options': 'normal'
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
    var _GetFuncName = function($text)
    {
        "use strict";

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

    /**
     * Get the html parameters: id, name, class
     * @version 2017-02-24
     * @since 2017-02-22
     * @param $in
     * @returns {string}
     * @private
     */
    var _GetId = function ($in)
    {
        "use strict";

        var $parameter = [];

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
            $class = 'class="' + $class + '"';
            $parameter.push($class);
        }

        return ' ' + $parameter.join(' ');
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
    var _GetParameters = function ($in, $fields)
    {
        "use strict";

        var $useFields = [];

        if (_IsSet($in.custom_variables) === 'true')
        {
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
        if (_IsSet($fields.enabled) === 'true' && _IsSet($in.enabled) === 'true' && $in.enabled === 'false') {
            $disabled = ' disabled';
        }

        let $multiple = '';
        if (_IsSet($fields.multiple) === 'true' && _IsSet($in.multiple) === 'true' && $in.multiple === 'false') {
            $multiple = ' multiple';
        }

        return  ' ' +  $useFields.join(' ') + $disabled + $multiple;
    };


    /**
     * Get the options rendered to HTML
     * @version 2018-05-31
     * @since 2018-05-31
     * @param $in
     * @returns {string}
     * @private
     */
    var _GetOptions = function ($in)
    {
        "use strict";

        let $options = '', $selected;

        const $default = {
            'options': []
        };
        $in = _Default($default, $in);

        for (let $i=0; $i < $in.options.length; $i++)
        {
            if (_IsSet($in.options[$i]) === 'false') {
                continue;
            }

            const $default = {'type': '', 'label': '', 'value': '', 'selected': 'false' };
            let $data = _Default($default, $in.options[$i]);

            $selected = '';
            if ($data.selected === 'true') {
                $selected = ' selected="selected"';
            }

            if ($data.label.length > 22) {
                $data.label = $data.label.substr(0,20) + '..'; // Cutting off so it looks ok on mobile
            }

            if ($data.type === 'option') {
                $options = $options + '<option' + $selected + ' value="' + $data.value + '">' + $data.label + '</option>';
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
    var _GetDataListOptions = function ($in)
    {
        "use strict";

        let $options = '';

        const $default = {
            'label': ''
        };

        for (let $i=0; $i < $in.options.length; $i++)
        {
            if (_IsSet($in.options[$i]) === 'false') {
                continue;
            }

            const $data = _Default($default, $in.options[$i]);
            $options = $options + '<option>'+$data.label+'</option>';
        }

        return $options;
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
    var create = function ($in)
    {
        "use strict";

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

    /**
     * Render options to HTML. Can be used to update an existing select box
     * @version 2018-08-09
     * @since   2018-08-09
     * @author  Peter Lembke
     * @param $in
     * @returns {{answer: string, message: string, html: string}}
     */
    $functions.push('render_options');
    var render_options = function ($in)
    {
        "use strict";

        const $default = {
            'options': []
        };
        $in = _Default($default, $in);

        const $optionsHTML = _GetOptions($in);

        return {
            'answer': 'true',
            'message': 'Here are the HTML for the options',
            'html': $optionsHTML
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
    var internal_Button = function ($in)
    {
        "use strict";

        const  $default = {
            'enabled': 'true',
            'alias': '',
            'class': 'button',
            'button_label': 'Submit',
            'mode': 'submit', // submit, button
            'event_data': 'submit',
            'event_handler': 'infohub_render',
            'to_node': 'client',
            'to_plugin': '', // plugin that should have the data after the event_handler have processed the event,
            'to_function': 'event_message',
            'custom_variables': {},
            'css_data': {}
        };
        $in = _Default($default, $in);

        if (_Empty($in.css_data) === 'true') {
            $in.css_data = {
                '.button':
                    'font-size: 20px;'+
                    'width: 100%;'+
                    'box-sizing:border-box;'+
                    'border-radius: 20px;'+
                    'background-color: #bcdebc;'+
                    'background: linear-gradient(#caefca, #ffffff);'+
                    'border: 1px solid #a6c8a6;'+
                    'margin: 10px 0px 0px 0px;'+
                    'padding: 4px 10px;'
            };
        }
        
        const $constants = {
            'type': 'form',
            'subtype': 'button',
            'renderer': 'infohub_render_form'
        };
        $in = _Merge($constants, $in);

        const $fields = {
            'type': 'subtype',
            'renderer': 'renderer',
            'event_data': 'event_data',
            'alias': 'alias',
            'mode': 'mode',
            'enabled': 'enabled'
        };

        let $event = '';
        let $destination = '';

        if ($in.event_handler !== '') {
            const $idString = ['{box_id}', $in.alias].join('_');
            $event = " onClick=\"go('" + $in.event_handler + "','click','" + $idString + "')\"";
            $destination = ' to_node="' + $in.to_node + '" to_function="' + $in.to_function + '" to_plugin="' + $in.to_plugin + '"';
        }

        if ($in.to_plugin !== '') {
            $destination = ' to_node="' + $in.to_node + '" to_function="' + $in.to_function + '" to_plugin="' + $in.to_plugin + '"';
        }

        const $id = _GetId({'id': $in.alias, 'name': $in.alias, 'class': $in.class });

        $in.html = '<button' + $id + _GetParameters($in, $fields) + $destination + $event + '>' + $in.button_label + '</button>';

        return {
            'answer': 'true',
            'message': 'Rendered html for a form button',
            'html': $in.html,
            'css_data': $in.css_data
        };
    };

    /**
     * Create HTML for a file selector button
     * Note that type = form, subtype = ---, and input_type = file
     * @version 2019-01-12
     * @since   2019-01-12
     * @author  Peter Lembke
     */
    var internal_File = function ($in)
    {
        "use strict";

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
            'custom_variables': {}
        };
        $in = _Default($default, $in);

        if (_Empty($in.css_data) === 'true') {
            $in.css_data = {
                '.file':
                    'font-size: 20px;'+
                    'width: 100%;'+
                    'box-sizing:border-box;'+
                    'border-radius: 20px;'+
                    'background-color: #bcdebc;'+
                    'background: linear-gradient(#caefca, #ffffff);'+
                    'border: 1px solid #a6c8a6;'+
                    'margin: 10px 0px 0px 0px;'+
                    'padding: 4px 10px;'+
                    'display: inline-block;',
                '.hidden':
                    'display: none;'
            };
        }

        const $constants = {
            'type': 'form',
            'subtype': 'file',
            'input_type': 'file',
            'renderer': 'infohub_render_form'
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
            'event_data': 'event_data'
        };

        if ($in.to_plugin !== '') {
            $fields['to_node'] = 'to_node';
            $fields['to_plugin'] = 'to_plugin';
            $fields['to_function'] = 'to_function';
        }

        let $event = '';

        if ($in.event_handler !== '') {
            const $idString = ['{box_id}', $in.alias].join('_');
            $event = " onChange=\"go('" + $in.event_handler + "','change','" + $idString + "')\"";
        }


        $in.html = '<label for="{box_id}_' + $in.alias + '" class="file">' + $in.button_label + '</label>';

        const $id = _GetId({'id': $in.alias, 'name': $in.alias, 'class': 'hidden' });
        $in.html = $in.html + '<input' + $id + _GetParameters($in, $fields) + $event + '>';

        return {
            'answer': 'true',
            'message': 'Rendered html for a form ' + $in.input_type,
            'html': $in.html,
            'css_data': $in.css_data
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
    var internal_Text = function ($in)
    {
        "use strict";

        const $default = {
            'input_type': 'text', // text, color, date, datetime-local, email, month, number, range, search, tel, time, url, week
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
            'custom_variables': {}
        };
        $in = _Default($default, $in);

        if (_Empty($in.css_data) === 'true') {
            $in.css_data = {
                '.text':
                    'width: 100%;'+
                    'box-sizing:border-box;'+
                    'margin: 10px 0px 0px 0px;'+
                    'padding: 4px 4px 4px 10px;'+
                    'border-radius: 20px;'+
                    'background-color: rgba(32, 250, 10, 0.04);'+
                    'border: 1px solid #bdbdbd;'+
                    'font-size: 16px;'+
                    '-webkit-appearance: none;'
            };
        }

        const $constants = {
            'type': 'form',
            'subtype': 'text',
            'renderer': 'infohub_render_form'
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
            'event_data': 'event_data'
        };

        let $event = '';

        if ($in.event_handler !== '')
        {
            const $idString = ['{box_id}', $in.alias].join('_');

            $event = " onChange=\"go('" + $in.event_handler + "','change','" + $idString + "')\"";
            if ($in.input_type === 'text') {
                $event = " onKeyup=\"go('" + $in.event_handler + "','keyup','" + $idString + "')\"";
            }
        }

        let $destination = '';
        if ($in.to_plugin !== '') {
            $destination = ' to_node="' + $in.to_node + '" to_function="' + $in.to_function + '" to_plugin="' + $in.to_plugin + '"';
        }

        const $id = _GetId({'id': $in.alias, 'name': $in.alias, 'class': $in.class });

        $in.html = '<input' + $id + _GetParameters($in, $fields) + $destination + $event + '>';

        return {
            'answer': 'true',
            'message': 'Rendered html for a form ' + $in.input_type,
            'html': $in.html,
            'css_data': $in.css_data
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
    var internal_Range = function ($in)
    {
        "use strict";

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
            'custom_variables': {}
        };
        $in = _Default($default, $in);

        if (_Empty($in.css_data) === 'true') {
            $in.css_data = {
                '.range':
                    'width: 100%;'+
                    'margin: 10px 0px 0px 0px;'+
                    'padding: 0px 0px 0px 0px;'
            };
        }

        const $constants = {
            'type': 'form',
            'subtype': 'text',
            'input_type': 'range',
            'renderer': 'infohub_render_form'
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
            'event_data': 'event_data'
        };

        if ($in.to_plugin !== '') {
            $fields['to_node'] = 'to_node';
            $fields['to_plugin'] = 'to_plugin';
            $fields['to_function'] = 'to_function';
        }

        let $event = '';

        if ($in.event_handler !== '') {
            const $idString = ['{box_id}', $in.alias].join('_');
            $event = " onChange=\"go('" + $in.event_handler + "','change','" + $idString + "')\"";
            $event = $event + " onInput=\"go('" + $in.event_handler + "','input','" + $idString + "')\"";
        }

        const $id = _GetId({'id': $in.alias, 'name': $in.alias, 'class': $in.class });

        $in.html = '<input' + $id + _GetParameters($in, $fields) + $event + '>';

        return {
            'answer': 'true',
            'message': 'Rendered html for a form ' + $in.input_type,
            'html': $in.html,
            'css_data': $in.css_data
        };
    };

    /**
     * Create HTML for a textarea element.
     * @version 2018-05-29
     * @since   2018-05-29
     * @author  Peter Lembke
     */
    var internal_Textarea = function ($in)
    {
        "use strict";

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
            'custom_variables': {},
            'rows': 4,
            'cols': 0
        };
        $in = _Default($default, $in);

        if (_Empty($in.css_data) === 'true') {
            $in.css_data = {
                '.textarea':
                    'width: 100%;'+
                    'box-sizing:border-box;'+
                    'margin: 10px 0px 0px 0px;'+
                    'padding: 4px 4px 4px 10px;'+
                    'border-radius: 20px;'+
                    'background-color: rgba(32, 250, 10, 0.04);'+
                    'border: 1px solid #bdbdbd;'+
                    'resize: vertical;'+
                    'font-size: 16px;'+
                    '-webkit-appearance: none;'
            };
        }

        const $constants = {
            'type': 'form',
            'subtype': 'textarea',
            'renderer': 'infohub_render_form'
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
            'cols': 'cols'
        };

        let $event = '';
        let $destination = '';

        if ($in.event_handler !== '') {
            const $idString = ['{box_id}', $in.alias].join('_');
            $event = " onKeyup=\"go('" + $in.event_handler + "','keyup','" + $idString + "')\"";
            $destination = ' to_node="' + $in.to_node + '" to_function="' + $in.to_function + '" to_plugin="' + $in.to_plugin + '"';
        }

        if ($in.to_plugin !== '') {
            $destination = ' to_node="' + $in.to_node + '" to_function="' + $in.to_function + '" to_plugin="' + $in.to_plugin + '"';
        }

        const $id = _GetId({'id': $in.alias, 'name': $in.alias, 'class': $in.class });

        $in.html = '<textarea' + $id + _GetParameters($in, $fields) + $destination + $event + '></textarea>';

        return {
            'answer': 'true',
            'message': 'Rendered html for a form ' + $in.input_type,
            'html': $in.html,
            'css_data': $in.css_data
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
    var internal_Select = function ($in)
    {
        "use strict";

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
            'event_data': ''
        };
        $in = _Default($default, $in);

        if (_Empty($in.css_data) === 'true') {
            $in.css_data = {
                'parent': 'overflow-x:auto;',
                '.select':
                    'width: 100%;'+
                    'box-sizing: border-box;'+
                    'vertical-align: top;'+
                    'margin: 4px 0px 4px 0px;'+
                    'padding: 6px 4px 0px 4px;'+
                    'border-radius: 20px 0px 0px 20px;'+
                    'border: 1px solid #0F0F0F;'+
                    'font-size: 16px;'+
                    'background-image: linear-gradient(to right, white , rgb(202, 239, 202));',
                '.select option':
                    'margin: 0px 0px 0px 4px;'+
                    'padding: 1px 0px 1px 0px;',
               '.select optgroup':
                    'margin: 0px 0px 0px 4px;'+
                    'padding: 1px 0px 1px 0px;'
            };
        }

        const $constants = {
            'type': 'form',
            'subtype': 'select',
            'renderer': 'infohub_render_form'
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
            'event_data': 'event_data'
        };

        let $event = '';
        if ($in.event_handler !== '') {
            const $idString = ['{box_id}', $in.alias].join('_');
            $event = " onChange=\"go('" + $in.event_handler + "','change','" + $idString + "')\"";
        }

        let $destination ='';
        if ($in.to_plugin !== '') {
            $destination = ' to_node="' + $in.to_node + '" to_function="' + $in.to_function + '" to_plugin="' + $in.to_plugin + '"';
        }
        
        let $multiple = '';
        if ($in.multiple === 'true') {
            $multiple = ' multiple';
        }

        const $id = _GetId({'id': $in.alias, 'name': $in.alias, 'class': $in.class });

        $in.html = '<select' + $id + _GetParameters($in, $fields) + $destination + $multiple + $event + '>' + $options + '</select>';

        return {
            'answer': 'true',
            'message': 'Rendered html for a form select',
            'html': $in.html,
            'css_data': $in.css_data
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
    var internal_Datalist = function ($in)
    {
        "use strict";

        const $default = {
            'options': [],
            'alias': ''
        };
        $in = _Default($default, $in);

        const $constants = {
            'type': 'form',
            'subtype': 'datalist',
            'renderer': 'infohub_render_form'
        };
        $in = _Merge($constants, $in);

        let $options = _GetOptions($in);

        const $fields = {
            'type': 'subtype',
            'alias': 'alias',
            'renderer': 'renderer'
        };

        const $id = _GetId({'id': $in.alias, 'name': $in.alias, 'class': '' });

        $in.html = '<datalist' + $id + _GetParameters($in, $fields) + '>' + $options + '</datalist>';

        return {
            'answer': 'true',
            'message': 'Rendered html for a datalist that you can use with a text box',
            'html': $in.html
        };
    };

    /**
     * Create HTML for one radio button.
     * https://www.w3schools.com/html/html_form_elements.asp
     * @version 2018-05-31
     * @since   2018-05-31
     * @author  Peter Lembke
     */
    var internal_Radio = function ($in)
    {
        "use strict";

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
            'custom_variables': {}
        };
        $in = _Default($default, $in);

        const $constants = {
            'type': 'form',
            'subtype': 'radio',
            'renderer': 'infohub_render_form'
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
            'event_data': 'event_data'
        };

        let $event = '';
        if ($in.event_handler !== '') {
            const $idString = ['{box_id}', $in.alias].join('_');
            $event = " onChange=\"go('" + $in.event_handler + "','change','" + $idString + "')\"";
        }

        let $destination = '';
        if ($in.to_plugin !== '') {
            $destination = ' to_node="' + $in.to_node + '" to_function="' + $in.to_function + '" to_plugin="' + $in.to_plugin + '"';
        }

        let $checked = '';
        if ($in.selected === 'true') {
            $checked = ' checked';
        }

        const $id = _GetId({'id': $in.alias, 'name': $in.group_name, 'class': $in.class});

        $in.html =  '<span><input' + $id + _GetParameters($in, $fields) + $destination + $event + $checked + '><label for="{box_id}_' + $in.alias + '">' + $in.label + '</label></span>';

        return {
            'answer': 'true',
            'message': 'Rendered html for one radio element',
            'html': $in.html,
            'css_data': $in.css_data
        };
    };

    /**
     * Create HTML for a range of radio buttons
     * https://www.w3schools.com/html/html_form_elements.asp
     * @version 2018-05-31
     * @since   2018-05-31
     * @author  Peter Lembke
     */
    var internal_Radios = function ($in)
    {
        "use strict";

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
            'custom_variables': {}
        };
        $in = _Default($default, $in);

        if (_Empty($in.css_data) === 'true') {
            $in.css_data = {
                '.radio': '',
                'label': '',
                'span': 'display:inline-block;' // inline-block = ordered in a row. block = ordered in column
            };
        }

        const $constants = {
            'type': 'form',
            'subtype': 'radio',
            'renderer': 'infohub_render_form'
        };
        $in = _Merge($constants, $in);

        let $html = '';

        for (let $i = 0; $i < $in.options.length; $i++)
        {
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
                'event_data': $in.event_data
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

        return {
            'answer': 'true',
            'message': 'Rendered html for a group of radio element',
            'html': $html,
            'css_data': $in.css_data
        };
    };

    /**
     * Create HTML for one checkbox
     * https://www.w3schools.com/html/html_form_elements.asp
     * @version 2018-05-31
     * @since   2018-05-31
     * @author  Peter Lembke
     */
    var internal_Checkbox = function ($in)
    {
        "use strict";

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
            'custom_variables': {}
        };
        $in = _Default($default, $in);

        const $constants = {
            'type': 'form',
            'subtype': 'checkbox',
            'renderer': 'infohub_render_form'
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
            'event_data': 'event_data'
        };

        let $event = '';
        if ($in.event_handler !== '') {
            const $idString = ['{box_id}', $in.alias].join('_');
            $event = " onChange=\"go('" + $in.event_handler + "','change','" + $idString + "')\"";
        }

        let $destination = '';
        if ($in.to_plugin !== '') {
            $destination = ' to_node="' + $in.to_node + '" to_function="' + $in.to_function + '" to_plugin="' + $in.to_plugin + '"';
        }

        let $checked = '';
        if ($in.selected === 'true') {
            $checked = ' checked';
        }

        const $id = _GetId({'id': $in.alias, 'name': $in.alias, 'class': $in.class});

        $in.html =  '<span><input' + $id + _GetParameters($in, $fields) + $destination + $event + $checked + '><label for="{box_id}_' + $in.alias + '">' + $in.label + '</label></span>';

        return {
            'answer': 'true',
            'message': 'Rendered html for one checkbox',
            'html': $in.html,
            'css_data': $in.css_data
        };
    };

    /**
     * Create HTML for a range of checkboxes
     * https://www.w3schools.com/html/html_form_elements.asp
     * @version 2018-05-31
     * @since   2018-05-31
     * @author  Peter Lembke
     */
    var internal_Checkboxes = function ($in)
    {
        "use strict";

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
            'custom_variables': {}
        };
        $in = _Default($default, $in);

        if (_Empty($in.css_data) === 'true') {
            $in.css_data = {
                '.checkbox': '',
                'label': '',
                'span': 'display:inline-block;' // inline-block = ordered in a row. block = ordered in column
            };
        }

        const $constants = {
            'type': 'form',
            'subtype': 'checkbox',
            'renderer': 'infohub_render_form'
        };
        $in = _Merge($constants, $in);

        let $html = '';

        for (let $i = 0; $i < $in.options.length; $i++)
        {
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
                'event_data': $in.event_data
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

        return {
            'answer': 'true',
            'message': 'Rendered html for a group of checkboxes',
            'html': $html,
            'css_data': $in.css_data
        };
    };

    /**
     * Create HTML for a form
     * https://www.w3schools.com/html/html_form_elements.asp
     * @version 2018-05-31
     * @since   2018-05-31
     * @author  Peter Lembke
     */
    var internal_Form = function ($in)
    {
        "use strict";

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
            'custom_variables': {}
        };
        $in = _Default($default, $in);

        if (_Empty($in.css_data) === 'true') {
            $in.css_data = {
                '.form': ''
            };
        }

        const $constants = {
            'type': 'form',
            'subtype': 'form',
            'renderer': 'infohub_render_form'
        };
        $in = _Merge($constants, $in);


        const $fields = {
            'type': 'subtype',
            'alias': 'alias',
            'renderer': 'renderer',
            'value': 'value',
            'enabled': 'enabled',
            'event_data': 'event_data'
        };

        let $event = '';
        if ($in.event_handler !== '') {
            const $idString = ['{box_id}', $in.alias].join('_');
            $event = " onSubmit=\"go('" + $in.event_handler + "','submit','" + $idString + "')\"";
        }

        let $destination = '';
        if ($in.to_plugin !== '') {
            $destination = ' to_node="' + $in.to_node + '" to_function="' + $in.to_function + '" to_plugin="' + $in.to_plugin + '"';
        }

        const $id = _GetId({'id': $in.alias, 'name': $in.alias, 'class': $in.class});

        $in.html =  '<form' + $id + _GetParameters($in, $fields) + $destination + $event + '>' + $in.content + '</form>';

        return {
            'answer': 'true',
            'message': 'Rendered html for a form',
            'html': $in.html,
            'css_data': $in.css_data
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
    var internal_Fieldset = function ($in)
    {
        "use strict";

        const $default = {
            'alias': '',
            'label': '',
            'content': '',
            'class': 'fieldset',
            'css_data': {},
            'event_data': '',
            'custom_variables': {}
        };
        $in = _Default($default, $in);

        if (_Empty($in.css_data) === 'true') {
            $in.css_data = {
                '.fieldset': ''
            };
        }

        const $constants = {
            'type': 'form',
            'subtype': 'fieldset',
            'renderer': 'infohub_render_form'
        };
        $in = _Merge($constants, $in);


        const $fields = {
            'type': 'subtype',
            'alias': 'alias',
            'renderer': 'renderer',
            'value': 'value',
            'event_data': 'event_data'
        };

        const $id = _GetId({'id': $in.alias, 'name': $in.alias, 'class': $in.class});

        $in.html =  '<fieldset' + $id + _GetParameters($in, $fields) + '><legend>' + $in.label + '</legend>' + $in.content + '</fieldset>';

        return {
            'answer': 'true',
            'message': 'Rendered html for a fieldset',
            'html': $in.html,
            'css_data': $in.css_data
        };
    };

}
//# sourceURL=infohub_render_form.js