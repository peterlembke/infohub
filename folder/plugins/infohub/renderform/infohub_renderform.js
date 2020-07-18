/**
 * infohub_renderform.js contact the renderers to get HTML and then send it to infohub_view
 * infohub_renderform and infohub_view are the only plugions that handle the DOM
 * @category InfoHub
 * @package infohub_renderform
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
function infohub_renderform() {

    "use strict";

    // include "infohub_base.js"

    const _Version = function() {
        return {
            'date': '2019-03-12',
            'since': '2018-05-30',
            'version': '1.0.0',
            'checksum': '{{checksum}}',
            'class_name': 'infohub_renderform',
            'note': 'Adds more features to the basic render form elements',
            'status': 'normal',
            'SPDX-License-Identifier': 'GPL-3.0-or-later',
            'recommended_security_group': 'user'
        };
    };

    const _GetCmdFunctions = function() {
        return {
            'create': 'normal', // Form, Text, Range, Color, Select, Textarea, Radios, Checkboxes
            'event_message': 'normal',
            'set_button_icon': 'normal'
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
        const $parts = $text.split('_');

        let $response = '';

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
            'css_data': {},
            'answer': '',
            'message': ''
        };
        $in = _Merge($default, $in);

        if ($in.step === 'step_start')
        {
            $in.func = _GetFuncName($in.type);
            $in.type = '';
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

        return {
            'answer': $in.answer,
            'message': $in.message,
            'html': $in.html,
            'css_data': $in.css_data
        };
    };

    /**
     * Basic form
     * @version 2018-06-06
     * @since   2018-06-06
     * @author  Peter Lembke
     */
    const internal_Form = function ($in)
    {
        const $default = {
            'content': '',
            'to_node': 'client',
            'to_plugin': 'infohub_renderform',
            'to_function': 'event_message',
            'class': 'form',
            'css_data': {},
            'label': '',
            'label_icon': '',
            'description': '',
            'original_alias': '',
            'event_data': '',
            'custom_variables': {},
            'open': 'true'
        };
        $in = _Default($default, $in);

        const $parts = {
            'presentation_box': {
                'plugin': 'infohub_rendermajor',
                'type': 'presentation_box',
                'head_label': $in.label,
                'head_label_icon': $in.label_icon,
                'content_data': $in.description + '[form]',
                'original_alias': $in.original_alias,
                'open': $in.open,
                'css_data': $in.css_data
            },
            'form': {
                'type': 'form',
                'subtype': 'form',
                'content': $in.content,
                'to_node': $in.to_node,
                'to_plugin': $in.to_plugin,
                'to_function': $in.to_function,
                'original_alias': $in.original_alias,
                'event_data': $in.event_data,
                'custom_variables': $in.custom_variables,
                'css_data': $in.css_data
            }
        };

        return {
            'answer': 'true',
            'message': 'Here are the parts to build the presentation box',
            'data': $parts,
            'how': {
                'mode': 'one box',
                'text': '[presentation_box]'
            },
            'where': {
                'mode': 'html'
            }
        };
    };
    
    /**
     * Create HTML for a button
     * https://www.w3schools.com/tags/tag_button.asp
     * @version 2019-01-01
     * @since   2019-01-01
     * @author  Peter Lembke
     */
    const internal_Button = function ($in)
    {
        const $default = {
            'enabled': 'true',
            'alias': '',
            'class': 'button',
            'button_label': 'Submit',
            'mode': 'submit', // submit, button
            'event_data': 'submit',
            'event_handler': 'infohub_renderform',
            'to_node': 'client',
            'to_plugin': '', // plugin that should have the data after the event_handler have processed the event,
            'to_function': 'event_message',
            'custom_variables': {},
            'css_data': {},
            'button_icon': '',
            'button_left_icon': '',
            'show_error_text': 'true',
            'show_success_text': 'false'
        };
        $in = _Default($default, $in);

        $in.custom_variables = _Merge($in.custom_variables, {
            'show_error_text': $in.show_error_text,
            'show_success_text': $in.show_success_text
        });

        let $parts = {
            'button': {
                'type': 'form',
                'subtype': 'button',
                'enabled': $in.enabled,
                'alias': $in.alias,
                'class': $in.class,
                'button_label': '[button_icon][button_label]',
                'mode': $in.mode,
                'event_data': $in.event_data,
                'event_handler': $in.event_handler,
                'to_plugin': $in.to_plugin,
                'to_function': $in.to_function,
                'custom_variables': $in.custom_variables,
                'css_data': $in.css_data
            },
            'button_left_icon': {
                'type': 'common',
                'subtype': 'container',
                'tag': 'span',
                'data': $in.button_left_icon,
                'css_data': {
                    '.container': 'width:16px; height:16px; display:inline; float:left;'
                },
            },
            'button_label': {
                'type': 'common',
                'subtype': 'container',
                'tag': 'span',
                'data': $in.button_label,
                'css_data': {
                    '.container': 'display:inline; padding-left: 4px; padding-right: 4px;'
                },
            },
            'button_icon': {
                'type': 'common',
                'subtype': 'container',
                'tag': 'span',
                'data': $in.button_icon,
                'css_data': {
                    '.container': 'width:16px; height:16px; display:inline; float:right;'
                },
            },
            'button_result': {
                'type': 'common',
                'subtype': 'container',
                'tag': 'span',
                'data': '',
                'css_data': {
                    '.container': 'border-style: dotted;border-color: green; display:none;'
                },
            }
        };

        if ($in.button_left_icon === '') {
            delete $parts.button_left_icon;
        } else {
            $parts.button.button_label = '[button_left_icon]' + $parts.button.button_label;
        }

        return {
            'answer': 'true',
            'message': 'Here are the parts to build the button',
            'data': $parts,
            'how': {
                'mode': 'one box',
                'text': '[button][button_result]'
            },
            'where': {
                'mode': 'html'
            }
        };
    };

    /**
     * Create HTML for a File selector button
     * https://www.w3schools.com/tags/tag_button.asp
     * @version 2019-09-07
     * @since   2019-09-07
     * @author  Peter Lembke
     */
    const internal_File = function ($in)
    {
        const $default = {
            'enabled': 'true',
            'alias': '',
            'class': 'file',
            'button_label': 'Select',
            'event_data': 'submit',
            'event_handler': 'infohub_renderform',
            'to_node': 'client',
            'to_plugin': '', // plugin that should have the data after the event_handler have processed the event,
            'to_function': 'event_message',
            'custom_variables': {},
            'css_data': {},
            'button_icon': '',
            'button_left_icon': '',
            'multiple': 'false',
            'accept': '', // Unique file type specifiers, https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/file#Unique_file_type_specifiers
            'capture': '', // Read the camera as an image. 'user'=front camera, 'environment'=back camera. https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/file#capture
            'show_error_text': 'true',
            'show_success_text': 'false'
        };
        $in = _Default($default, $in);

        $in.custom_variables = _Merge($in.custom_variables, {
            'show_error_text': $in.show_error_text,
            'show_success_text': $in.show_success_text
        });

        let $parts = {
            'button': {
                'type': 'form',
                'subtype': 'file',
                'enabled': $in.enabled,
                'alias': $in.alias,
                'class': $in.class,
                'button_label': '[button_icon][button_label]',
                'event_data': $in.event_data,
                'event_handler': 'infohub_renderform',
                'to_node': $in.to_node,
                'to_plugin': $in.to_plugin,
                'to_function': $in.to_function,
                'custom_variables': $in.custom_variables,
                'css_data': $in.css_data,
                'multiple': $in.multiple,
                'accept': $in.accept,
                'capture': $in.capture
            },
            'button_left_icon': {
                'type': 'common',
                'subtype': 'container',
                'tag': 'span',
                'data': $in.button_left_icon,
                'css_data': {
                    '.container': 'width:16px; height:16px; display:inline; float:left;'
                },
            },
            'button_label': {
                'type': 'common',
                'subtype': 'container',
                'tag': 'span',
                'data': $in.button_label,
                'css_data': {
                    '.container': 'display:inline; padding-left: 4px; padding-right: 4px;'
                },
            },
            'button_icon': {
                'type': 'common',
                'subtype': 'container',
                'tag': 'span',
                'data': $in.button_icon,
                'css_data': {
                    '.container': 'width:16px; height:16px; display:inline; float:right;'
                },
            },
            'button_result': {
                'type': 'common',
                'subtype': 'container',
                'tag': 'span',
                'data': '',
                'css_data': {
                    '.container': 'border-style: dotted;border-color: green; display:none;'
                },
            }
        };

        if ($in.button_left_icon === '') {
            delete $parts.button_left_icon;
        } else {
            $parts.button.button_label = '[button_left_icon]' + $parts.button.button_label;
        }

        return {
            'answer': 'true',
            'message': 'Here are the parts to build the button',
            'data': $parts,
            'how': {
                'mode': 'one box',
                'text': '[button][button_result]'
            },
            'where': {
                'mode': 'html'
            }
        };
    };

    /**
     * Basic form
     * @version 2018-06-06
     * @since   2018-06-06
     * @author  Peter Lembke
     */
    const internal_Text = function ($in)
    {
        const $default = {
            'enabled': 'true',
            'label': '', // The clickable text at the top
            'description': '', // Optional descriptive text
            'maxlength': '', // Optional number of characters until the text are cut off
            'datalist_id': '', // Optional dropdown list. Rendered separately
            'placeholder': '', // Optional text that show when the text box is empty
            'to_node': 'client', // node, plugin, function that will get the change event after validation
            'to_plugin': 'infohub_renderform',
            'to_function': 'event_message',
            'validator_plugin': '', // Validator plugin, function. Node is always client
            'validator_function': '',
            'class': 'text', // Optional class name
            'css_data': {}, // Optional CSS data
            'original_alias': '', // The alias you used for this object. for example "my_text". Will be used as a container when you read/write data to the form
            'show_characters_left': 'true',
            'event_data': '',
            'custom_variables': {}
        };
        $in = _Default($default, $in);

        let $parts = {
            'form_element': {
                'type': 'form',
                'subtype': 'text',
                'input_type': 'text',
                'maxlength': $in.maxlength,
                'placeholder': $in.placeholder,
                'datalist_id': $in.datalist_id,
                'to_node': $in.to_node,
                'to_plugin': $in.to_plugin,
                'to_function': $in.to_function,
                'validator_plugin': $in.validator_plugin,
                'validator_function': $in.validator_function,
                'class': $in.class,
                'css_data': $in.css_data,
                'original_alias': $in.original_alias,
                'event_data': $in.event_data,
                'enabled': $in.enabled,
                'custom_variables': $in.custom_variables
            },
            'presentation_box': {
                'plugin': 'infohub_rendermajor',
                'type': 'presentation_box',
                'head_label': $in.label,
                'head_text': $in.description,
                'content_data': '[form_element]',
                'original_alias': $in.original_alias
            }
        };

        if ($in.maxlength > 0 && $in.show_characters_left === 'true')
        {
            $parts.characters_left = {
                'type': 'common',
                'subtype': 'label_data',
                'label': 'Left',
                'data': '-'
            };
            $parts.presentation_box.content_data = $parts.presentation_box.content_data + '[characters_left]';
        }

        return {
            'answer': 'true',
            'message': 'Here are the parts to build the presentation box',
            'data': $parts,
            'how': {
                'mode': 'one box',
                'text': '[presentation_box]'
            },
            'where': {
                'mode': 'html'
            }
        };

    };

    /**
     * Basic form
     * @version 2018-06-25
     * @since   2018-06-22
     * @author  Peter Lembke
     */
    const internal_Range = function ($in)
    {
        const $default = {
                'enabled': 'true',
                'label': '',
                'description': '',
                'min_value': '', // Left side value
                'max_value': '', // Right side value
                'step_value': '',
                'to_node': 'client',
                'to_plugin': 'infohub_renderform',
                'to_function': 'event_message',
                'class': 'range',
                'css_data': {},
                'original_alias': '',
                'show_min': 'true',
                'show_value': 'true',
                'show_max': 'true',
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

        let $parts = {
            'presentation_box': {
                'plugin': 'infohub_rendermajor',
                'type': 'presentation_box',
                'head_label': $in.label,
                'head_text': $in.description,
                'content_data': '[form_element]',
                'original_alias': $in.original_alias
            },
            'form_element': {
                'type': 'form',
                'subtype': 'range',
                'input_type': 'range',
                'min_value': $in.min_value,
                'max_value': $in.max_value,
                'step_value': $in.step_value,
                'to_node': $in.to_node,
                'to_plugin': $in.to_plugin,
                'to_function': $in.to_function,
                'class': $in.class,
                'css_data': $in.css_data,
                'original_alias': $in.original_alias,
                'event_data': $in.event_data,
                'enabled': $in.enabled,
                'custom_variables': $in.custom_variables
            }
        };

        if ($in.show_max === 'true') {
            $parts.range_max = {
                'type': 'common',
                'subtype': 'label_data',
                'label': 'Max',
                'data': '-'
            };
            $parts.presentation_box.content_data = '[range_max]' + $parts.presentation_box.content_data;
        }

        if ($in.show_value === 'true') {
            $parts.range_value = {
                'type': 'common',
                'subtype': 'label_data',
                'label': 'Value',
                'data': '-'
            };
            $parts.presentation_box.content_data = '[range_value]' + $parts.presentation_box.content_data;
        }

        if ($in.show_min === 'true') {
            $parts.range_min = {
                'type': 'common',
                'subtype': 'label_data',
                'label': 'Min',
                'data': '-'
            };
            $parts.presentation_box.content_data = '[range_min]' + $parts.presentation_box.content_data;
        }

        return {
            'answer': 'true',
            'message': 'Here are the parts to build the presentation box',
            'data': $parts,
            'how': {
                'mode': 'one box',
                'text': '[presentation_box]'
            },
            'where': {
                'mode': 'html'
            }
        };

    };

    /**
     * Basic form
     * @version 2018-06-22
     * @since   2018-06-22
     * @author  Peter Lembke
     */
    const internal_Color = function ($in)
    {
        const $default = {
            'enabled': 'true',
            'label': '',
            'description': '',
            'to_node': 'client', // Where to send the changed value
            'to_plugin': 'infohub_renderform',
            'to_function': 'event_message',
            'class': 'color',
            'css_data': {},
            'original_alias': '',
            'event_data': '',
            'custom_variables': {}
        };
        $in = _Default($default, $in);

        let $parts = {
            'presentation_box': {
                'plugin': 'infohub_rendermajor',
                'type': 'presentation_box',
                'head_label': $in.label,
                'head_text': $in.description,
                'content_data': '[form_element][color_code]',
                'original_alias': $in.original_alias
            },
            'form_element': {
                'type': 'form',
                'subtype': 'text',
                'input_type': 'color',
                'to_node': $in.to_node,
                'to_plugin': $in.to_plugin,
                'to_function': $in.to_function,
                'class': $in.class,
                'css_data': $in.css_data,
                'original_alias': $in.original_alias,
                'event_data': $in.event_data,
                'enabled': $in.enabled,
                'custom_variables': $in.custom_variables
            },
            'color_code': {
                'type': 'common',
                'subtype': 'label_data',
                'label': 'Code',
                'data': '-'
            }
        };

        return {
            'answer': 'true',
            'message': 'Here are the parts to build the presentation box',
            'data': $parts,
            'how': {
                'mode': 'one box',
                'text': '[presentation_box]'
            },
            'where': {
                'mode': 'html'
            }
        };

    };

    /**
     * Basic form
     * @version 2018-06-06
     * @since   2018-06-06
     * @author  Peter Lembke
     */
    const internal_Select = function ($in)
    {
        const $default = {
            'enabled': 'true',
            'alias': '',
            "size": "10", // Number of rows to show
            "multiple": "true",
            "options": [], // See separate default structure
            'source_node': '',
            'source_plugin': '', // Plugin that has the options. Called only if the options are empty.
            'source_function': '',
            'to_node': 'client',
            'to_plugin': 'infohub_renderform',
            'to_function': 'event_message',
            'class': 'select',
            'css_data': {},
            'label': '',
            'description': '',
            'validator_plugin': '',
            'validator_function': '',
            'original_alias': '',
            'event_handler': 'infohub_renderform',
            'event_data': '',
            'show_error_text': 'true',
            'show_success_text': 'false',
            'custom_variables': {}
        };
        $in = _Default($default, $in);

        $in.custom_variables = _Merge($in.custom_variables, {
            'show_error_text': $in.show_error_text,
            'show_success_text': $in.show_success_text
        });

        let $parts = {
            'presentation_box': {
                'plugin': 'infohub_rendermajor',
                'type': 'presentation_box',
                'head_label': $in.label,
                'head_text': $in.description,
                'content_data': '[form_element][select_result]',
                'original_alias': $in.original_alias
            },
            'form_element': {
                'type': 'form',
                'subtype': 'select',
                'alias': $in.alias,
                "size": $in.size,
                "multiple": $in.multiple,
                "options": $in.options,
                'source_node': $in.source_node,
                'source_plugin': $in.source_plugin, // Plugin that has the options. Called only if the options are empty.
                'source_function': $in.source_function,
                'to_node': $in.to_node,
                'to_plugin': $in.to_plugin,
                'to_function': $in.to_function,
                'validator_plugin': $in.validator_plugin,
                'validator_function': $in.validator_function,
                'class': $in.class,
                'css_data': $in.css_data,
                'original_alias': $in.original_alias,
                'event_handler': 'infohub_renderform',
                'event_data': $in.event_data,
                'enabled': $in.enabled,
                'custom_variables': $in.custom_variables
            },
            'select_result': {
                'type': 'common',
                'subtype': 'container',
                'tag': 'span',
                'data': '',
                'css_data': {
                    '.container': 'border-style: dotted;border-color: green; display:none;'
                },
            }
        };

        return {
            'answer': 'true',
            'message': 'Here are the parts to build the presentation box',
            'data': $parts,
            'how': {
                'mode': 'one box',
                'text': '[presentation_box]'
            },
            'where': {
                'mode': 'html'
            }
        };

    };

    /**
     * Basic form
     * @version 2018-06-06
     * @since   2018-06-06
     * @author  Peter Lembke
     */
    const internal_Textarea = function ($in)
    {
        const $default = {
            'enabled': 'true',
            'placeholder': '',
            'to_node': 'client',
            'to_plugin': 'infohub_renderform',
            'to_function': 'event_message',
            'class': 'textarea',
            'css_data': {},
            'label': '',
            'description': '',
            'validator_plugin': '',
            'validator_function': '',
            'original_alias': '',
            'show_characters': 'true',
            'show_words': 'true',
            'show_rows': 'true',
            'show_paragraphs': 'true',
            'event_data': '',
            'custom_variables': $in.custom_variables,
            'rows': 4,
            'cols': 0
        };
        $in = _Default($default, $in);

        let $parts = {
            'presentation_box': {
                'plugin': 'infohub_rendermajor',
                'type': 'presentation_box',
                'head_label': $in.label,
                'head_text': $in.description,
                'content_data': '[form_element]',
                'original_alias': $in.original_alias
            },
            'form_element': {
                'type': 'form',
                'subtype': 'textarea',
                'placeholder': $in.placeholder,
                'to_node': $in.to_node,
                'to_plugin': $in.to_plugin,
                'to_function': $in.to_function,
                'validator_plugin': $in.validator_plugin,
                'validator_function': $in.validator_function,
                'class': $in.class,
                'css_data': $in.css_data,
                'original_alias': $in.original_alias,
                'event_data': $in.event_data,
                'enabled': $in.enabled,
                'custom_variables': $in.custom_variables,
                'rows': $in.rows,
                'cols': $in.cols
            }
        };
        
        let $data = '[form_element]';
        
        if ($in.show_characters === 'true') {
            $parts.count_characters = {
                'type': 'common',
                'subtype': 'label_data',
                'label': 'Characters',
                'data': '-'
            };
            $data = $data + '[count_characters]';
        }

        if ($in.show_words === 'true') {
            $parts.count_words = {
                'type': 'common',
                'subtype': 'label_data',
                'label': 'Words',
                'data': '-'
            };
            $data = $data + '[count_words]';
        }

        if ($in.show_rows === 'true') {
            $parts.count_rows = {
                'type': 'common',
                'subtype': 'label_data',
                'label': 'Rows',
                'data': '-'
            };
            $data = $data + '[count_rows]';
        }

        if ($in.show_rows === 'true') {
            $parts.count_paragraphs = {
                'type': 'common',
                'subtype': 'label_data',
                'label': 'Paragraphs',
                'data': '-'
            };
            $data = $data + '[count_paragraphs]';
        }
        
        $parts.presentation_box.content_data = $data;

        return {
            'answer': 'true',
            'message': 'Here are the parts to build the presentation box',
            'data': $parts,
            'how': {
                'mode': 'one box',
                'text': '[presentation_box]'
            },
            'where': {
                'mode': 'html'
            }
        };

    };

    /**
     * Basic form
     * @version 2018-06-06
     * @since   2018-06-06
     * @author  Peter Lembke
     */
    const internal_Radios = function ($in)
    {
        const $default = {
            'enabled': 'true',
            'group_name': '',
            "options": [],
            'to_node': 'client',
            'to_plugin': 'infohub_renderform',
            'to_function': 'event_message',
            'class': 'radio',
            'css_data': {},
            'label': '',
            'description': '',
            'original_alias': '',
            'event_data': '',
            'custom_variables': {}
        };
        $in = _Default($default, $in);

        let $parts = {
            'presentation_box': {
                'plugin': 'infohub_rendermajor',
                'type': 'presentation_box',
                'head_label': $in.label,
                'head_text': $in.description,
                'content_data': '[form_element]',
                'original_alias': $in.original_alias
            },
            'form_element': {
                'type': 'form',
                'subtype': 'radios',
                'group_name': $in.group_name,
                "options": $in.options,
                'to_node': $in.to_node,
                'to_plugin': $in.to_plugin,
                'to_function': $in.to_function,
                'class': $in.class,
                'css_data': $in.css_data,
                'original_alias': $in.original_alias,
                'event_data': $in.event_data,
                'enabled': $in.enabled,
                'custom_variables': $in.custom_variables
            }
        };

        return {
            'answer': 'true',
            'message': 'Here are the parts to build the presentation box',
            'data': $parts,
            'how': {
                'mode': 'one box',
                'text': '[presentation_box]'
            },
            'where': {
                'mode': 'html'
            }
        };
    };

    /**
     * Checkboxes
     * @version 2018-06-06
     * @since   2018-06-06
     * @author  Peter Lembke
     */
    const internal_Checkboxes = function ($in)
    {
        const $default = {
            'enabled': 'true',
            "options": [],
            'to_node': 'client',
            'to_plugin': 'infohub_renderform',
            'to_function': 'event_message',
            'class': 'checkbox',
            'css_data': {},
            'label': '',
            'description': '',
            'original_alias': '',
            'event_data': '',
            'custom_variables': {}
        };
        $in = _Default($default, $in);

        let $parts = {
            'presentation_box': {
                'plugin': 'infohub_rendermajor',
                'type': 'presentation_box',
                'head_label': $in.label,
                'head_text': $in.description,
                'content_data': '[form_element]',
                'original_alias': $in.original_alias
            },
            'form_element': {
                'type': 'form',
                'subtype': 'checkboxes',
                'options': $in.options,
                'to_node': $in.to_node,
                'to_plugin': $in.to_plugin,
                'to_function': $in.to_function,
                'class': $in.class,
                'css_data': $in.css_data,
                'original_alias': $in.original_alias,
                'event_data': $in.event_data,
                'enabled': $in.enabled,
                'custom_variables': $in.custom_variables
            }
        };

        return {
            'answer': 'true',
            'message': 'Here are the parts to build the presentation box',
            'data': $parts,
            'how': {
                'mode': 'one box',
                'text': '[presentation_box]'
            },
            'where': {
                'mode': 'html'
            }
        };
    };

    const _Signs = function ($in)
    {
        const $default = {
            'validate': 'false',
            'require': 'false',
            'changed': 'true'
        };
        $in = _Default($default, $in);

        const $data = {
            'valid': {
                'sign': '&#x2714;&#xFE0E;', // &#xFE0E; forces the previous character to be text instead of an emoj (Firefox)
                'group': 'validate',
                'note': 'Checkmark',
                'color': 'green',
                'display': 'none'
            },
            'invalid': {
                'sign': '&#x274c;&#xFE0E;',
                'group': 'validate',
                'note': 'Cross',
                'color': 'red',
                'display': 'inline-block'
            },
            'required': {
                'sign': '&#x2757;&#xFE0E;',
                'group': 'require',
                'note': 'Exclamation mark',
                'color': 'yellow',
                'display': 'inline-block'
            },
            'unchanged': {
                'sign': '&#x1f4a1;&#xFE0E;',
                'group': 'changed',
                'note': 'Lightbulb',
                'color': 'grey',
                'display': 'inline-block'
            },
            'changed': {
                'sign': '&#x1f4a1;&#xFE0E;',
                'group': 'changed',
                'note': 'Lightbulb',
                'color': 'blue',
                'display': 'none'
            }
        };

        let $row = '';
        for (let $key in $data) {
            const $group = $data[$key].group;
            if ($in[$group] === 'true') {
                $row = $row + '<span id ="{box_id}_' + $key + '" style="color:'+ $data[$key].color + ';display:' + $data[$key].display + '">' + $data[$key].sign + '</span>';
            }
        }

        return $row;
    };

    const _CountText = function ($in)
    {
        const $default = {
            'text': ''
        };
        $in = _Default($default, $in);

        const $out = {
            'characters': $in.text.length,
            'words': _WordCount($in.text),
            'rows': $in.text.split(/\r|\r\n|\n/).length,
            'paragraphs': $in.text.split(/\r\r|\r\n\r\n|\n\n/).length
        };

        return $out;
    };

    const _WordCount = function ($text)
    {
        const $insert = " ";
        let $wordCount = 0;

        $text = $text.replace(/(\r\n|\n|\r)/gm, $insert);
        let $parts = $text.split(" ");

        for (let $i = 0; $i < $parts.length; $i = $i + 1)
        {
            if ($parts[$i].length > 0) {
                $wordCount = $wordCount + 1;
            }
        }

        return $wordCount;
    };

    /**
     * Event messages for the rendered items in this plugin end up here
     * @version 2018-06-21
     * @since   2017-02-11
     * @author  Peter Lembke
     */
    $functions.push('event_message');
    const event_message = function ($in)
    {
        const $default = {
            'step': 'step_start',
            'type': '',
            'event_type': '',
            'event_data': '',
            'id': '',
            'box_id': '',
            'form_alias': '',
            'value': '',
            'maxlength': 0,
            'data_back': {}
        };
        $in = _Merge($default, $in);
        
        if ($in.step === 'step_end') {
            return {
                'answer': 'true', 
                'message': 'Got a return message' 
            };
        }

        if ($in.type === 'button' || $in.type === 'file') {
            if ($in.event_type === 'click' || $in.event_type === 'change')
            {
                if ($in.step === 'step_start') {
                    $in = _Delete($in, {
                        'innerHTML': '', // A button do not need this. And it mess up messages to the server
                        'value': '',
                    });

                    let $messageArray = [];

                    let $messageOut = _SubCall({
                        'to': {
                            'node': 'client',
                            'plugin': 'infohub_view',
                            'function': 'set_enabled'
                        },
                        'data': {
                            'id': $in.id,
                            'set_enabled': 'true' // Normally false but you might want to set this to true when you debug so you can press the button again
                        },
                        'data_back': _Merge($in, {'step': 'step_end'})
                    });
                    $messageArray.push($messageOut);

                    $messageOut = _SubCall({
                        'to': {
                            'node': 'client',
                            'plugin': 'infohub_asset',
                            'function': 'update_all_plugin_assets'
                        },
                        'data': {
                            'plugin_name': 'infohub_renderform'
                        },
                        'data_back': _Merge($in, {'step': 'step_end'})
                    });
                    $messageArray.push($messageOut);

                    $messageOut = _SubCall({
                        'to': {
                            'node': 'client',
                            'plugin': 'infohub_render',
                            'function': 'create'
                        },
                        'data': {
                            'what': {
                                'svg_progress': {
                                    'type': 'common',
                                    'subtype': 'svg',
                                    'data': '[svg_progress_asset]'
                                },
                                'svg_progress_asset': {
                                    'plugin': 'infohub_asset',
                                    'type': 'icon',
                                    'subtype': 'svg',
                                    'asset_name': 'snake-ajax-loader',
                                    'plugin_name': 'infohub_renderform'
                                },
                            },
                            'how': {
                                'mode': 'one box',
                                'text': '[svg_progress]'
                            },
                            'where': {
                                'box_id': $in.id + '_icon',
                                'throw_error_if_box_is_missing': 'false'
                            }
                        },
                        'data_back': _Merge($in, {'step': 'step_button_event'})
                    });
                    $messageArray.push($messageOut);

                    return {
                        'answer': 'true',
                        'message': 'Sending some messages',
                        'messages': $messageArray
                    };
                }
                
                if ($in.step === 'step_button_event') 
                {
                    return _SubCall({
                        'to': {
                            'node': 'client', 
                            'plugin': 'infohub_render', 
                            'function': 'event_message' 
                        },
                        'data': _Delete($in, {'step':'' }), // Remove step from $in
                        'data_back': _Merge($in, {'step': 'step_button_result'})
                    });
                }
                
                if ($in.step === 'step_button_result') 
                {
                    let $assetName = 'icons8-ok';
                    const $ok = _GetData({
                        'name': 'response/ok',
                        'default': 'false',
                        'data': $in,
                    });

                    let $borderColor = 'red';
                    let $showButtonResult = 'false';
                    if ($in.response.answer === 'true' && $ok === 'true') {
                        if ($in.show_success_text === 'true') {
                            $showButtonResult = 'true';
                            $borderColor = 'green';
                        }
                    }

                    if ($in.response.answer === 'false' || $ok === 'false') {
                        $assetName = 'icons8-cancel';
                        if ($in.show_error_text === 'true') {
                            $showButtonResult = 'true';
                        }
                    }

                    let $messageArray = [];

                    let $messageOut = _SubCall({
                        'to': {
                            'node': 'client',
                            'plugin': 'infohub_view',
                            'function': 'set_enabled'
                        },
                        'data': {
                            'id': $in.id,
                            'set_enabled': 'true'
                        },
                        'data_back': _Merge($in, {'step': 'step_end'})
                    });
                    $messageArray.push($messageOut);

                    $messageOut = _SubCall({
                        'to': {
                            'node': 'client',
                            'plugin': 'infohub_view',
                            'function': 'set_visible'
                        },
                        'data': {
                            'id': $in.id + '_result',
                            'set_visible': $showButtonResult
                        },
                        'data_back': _Merge($in, {'step': 'step_end'})
                    });
                    $messageArray.push($messageOut);

                    $messageOut = _SubCall({
                        'to': {
                            'node': 'client',
                            'plugin': 'infohub_view',
                            'function': 'set_style'
                        },
                        'data': {
                            'box_id': $in.id + '_result',
                            'style_name': 'border-color',
                            'style_value': $borderColor
                        },
                        'data_back': _Merge($in, {'step': 'step_end'})
                    });
                    $messageArray.push($messageOut);

                    $messageOut = _SubCall({
                        'to': {
                            'node': 'client',
                            'plugin': 'infohub_view',
                            'function': 'set_text'
                        },
                        'data': {
                            'id': $in.id + '_result',
                            'text': $in.response.message
                        },
                        'data_back': {
                            'data_back': _Merge($in, {'step': 'step_end'})
                        }
                    });
                    $messageArray.push($messageOut);

                    $messageOut = _SubCall({
                        'to': {
                            'node': 'client',
                            'plugin': 'infohub_render',
                            'function': 'create'
                        },
                        'data': {
                            'what': {
                                'svg_result': {
                                    'type': 'common',
                                    'subtype': 'svg',
                                    'data': '[svg_result_asset]'
                                },
                                'svg_result_asset': {
                                    'plugin': 'infohub_asset',
                                    'type': 'icon',
                                    'subtype': 'svg',
                                    'asset_name': $assetName,
                                    'plugin_name': 'infohub_renderform'
                                },
                            },
                            'how': {
                                'mode': 'one box',
                                'text': '[svg_result]'
                            },
                            'where': {
                                'box_id': $in.id + '_icon',
                                'throw_error_if_box_is_missing': 'false'
                            }
                        },
                        'data_back': _Merge($in, {'step': 'step_end'})
                    });
                    $messageArray.push($messageOut);
                    
                    return {
                        'answer': 'true',
                        'message': 'Sending some messages',
                        'messages': $messageArray
                    };
                }
            }
        }

        if ($in.type === 'text' && $in.event_type === 'keyup' && $in.step === 'step_start')
        {
            $in = _Delete($in, { 'innerHTML': '' });

            if ($in.maxlength > 0)
            {
                const $id = $in.box_id + '_' + $in.form_alias + '_characters_left_data';
                const $valueInteger = $in.maxlength - $in.value.length;

                return _SubCall({
                    'to': {'node': 'client', 'plugin': 'infohub_view', 'function': 'set_text'},
                    'data': { 'id': $id, 'text': $valueInteger.toString() },
                    'data_back': _Merge($in, {'step': 'step_send_to_final_plugin'})
                });
            }
        }

        if ($in.type === 'textarea' && $in.event_type === 'keyup' && $in.step === 'step_start')
        {
            $in = _Delete($in, { 'innerHTML': '' });

            const $id = $in.box_id + '_' + $in.form_alias + '_count_';
            const $countText = _CountText({'text': $in.value });

            const $do = [
                {'func': 'SetText', 'id': $id + 'characters_data' , 'text': $countText.characters.toString() },
                {'func': 'SetText', 'id': $id + 'words_data', 'text': $countText.words.toString() },
                {'func': 'SetText', 'id': $id + 'rows_data', 'text': $countText.rows.toString() },
                {'func': 'SetText', 'id': $id + 'paragraphs_data', 'text': $countText.paragraphs.toString() }
            ];

            return _SubCall({
                'to': {'node': 'client', 'plugin': 'infohub_view', 'function': 'mass_update'},
                'data': { 'do': $do },
                'data_back': _Merge($in, {'step': 'step_send_to_final_plugin'})
            });
        }

        if ($in.type === 'select') {
            if ($in.event_type === 'change') {
                if ($in.step === 'step_start') {
                    if (_IsSet($in.multiple) === 'false') { // We only want to support single select
                        if (! ($in.to_node === 'client' && $in.to_plugin === 'infohub_renderform' && $in.to_function === 'event_message'))
                        {
                            let $data = _Delete($in, {'step':'' });
                            $data = _Delete($data, {'callback_function': ''});

                            let $dataBack = _Merge($in,{'step': 'step_select_result'});
                            $dataBack = _Delete($dataBack, {'callback_function': ''});

                            // Infohub_render calls to_node, to_plugin, to_function

                            return _SubCall({
                                'to': {
                                    'node': 'client',
                                    'plugin': 'infohub_render',
                                    'function': 'event_message'
                                },
                                'data': $data,
                                'data_back': $dataBack
                            });
                        }
                    }
                }

                if ($in.step === 'step_select_result') {

                    const $ok = _GetData({
                        'name': 'response/ok',
                        'default': 'false',
                        'data': $in,
                    });

                    let $borderColor = 'red';
                    let $showButtonResult = 'false';
                    if ($in.response.answer === 'true' && $ok === 'true') {
                        if ($in.show_success_text === 'true') {
                            $showButtonResult = 'true';
                            $borderColor = 'green';
                        }
                    }

                    if ($in.response.answer === 'false' || $ok === 'false') {
                        if ($in.show_error_text === 'true') {
                            $showButtonResult = 'true';
                        }
                    }

                    let $messageArray = [];

                    let $messageOut = _SubCall({
                        'to': {
                            'node': 'client',
                            'plugin': 'infohub_view',
                            'function': 'set_visible'
                        },
                        'data': {
                            'id': $in.box_id + '_' + $in.form_alias + '_select_result',
                            'set_visible': $showButtonResult
                        },
                        'data_back': _Merge($in, {'step': 'step_end'})
                    });
                    $messageArray.push($messageOut);

                    $messageOut = _SubCall({
                        'to': {
                            'node': 'client',
                            'plugin': 'infohub_view',
                            'function': 'set_style'
                        },
                        'data': {
                            'box_id': $in.box_id + '_' + $in.form_alias + '_select_result',
                            'style_name': 'border-color',
                            'style_value': $borderColor
                        },
                        'data_back': _Merge($in, {'step': 'step_end'})
                    });
                    $messageArray.push($messageOut);

                    $messageOut = _SubCall({
                        'to': {
                            'node': 'client',
                            'plugin': 'infohub_view',
                            'function': 'set_text'
                        },
                        'data': {
                            'id': $in.box_id + '_' + $in.form_alias + '_select_result',
                            'text': $in.response.message
                        },
                        'data_back': {
                            'data_back': _Merge($in, {'step': 'step_end'})
                        }
                    });
                    $messageArray.push($messageOut);

                    return {
                        'answer': 'true',
                        'message': 'Sending some messages',
                        'messages': $messageArray
                    };
                }
            }
        }

        if ($in.type === 'range') {
            if ($in.event_type === 'change' || $in.event_type === 'input') {
                if ($in.step === 'step_start')
                {
                    $in = _Delete($in, { 'innerHTML': '' });

                    const $id = $in.box_id + '_' + $in.form_alias + '_range_';

                    const $do = [
                        {'func': 'SetText', 'id': $id + 'min_data' , 'text': $in.min },
                        {'func': 'SetText', 'id': $id + 'value_data', 'text': $in.value },
                        {'func': 'SetText', 'id': $id + 'max_data', 'text': $in.max }
                    ];

                    return _SubCall({
                        'to': {
                            'node': 'client', 
                            'plugin': 'infohub_view', 
                            'function': 'mass_update'
                        },
                        'data': { 'do': $do },
                        'data_back': _Merge($in, {'step': 'step_send_to_final_plugin'})
                    });
                }
            }
        }

        if ($in.type === 'radio') {
            if ($in.event_type === 'change') {
                // window.alert('radio change');
            }
        }

        if ($in.type === 'checkbox') {
            if ($in.event_type === 'change') {
                // window.alert('checkbox change');
            }
        }

        if ($in.type === 'color') {
            if ($in.event_type === 'change') {
                if ($in.step === 'step_start')
                {
                    // window.alert('color change');
                    const $id = $in.box_id + '_' + $in.form_alias + '_color_code_data';

                    return _SubCall({
                        'to': {'node': 'client', 'plugin': 'infohub_view', 'function': 'set_text'},
                        'data': { 'id': $id, 'text': $in.value },
                        'data_back': _Merge($in, {'step': 'step_send_to_final_plugin'})
                    });
                }
            }
        }
        
        if ($in.step === 'step_send_to_final_plugin') 
        {
            leave:  {
                if (_Empty($in.final_node) ==='true') { break leave; }
                if (_Empty($in.final_plugin) ==='true') { break leave; }
                if (_Empty($in.final_function) ==='true') { break leave; }

                return _SubCall({
                    'to': {
                        'node': $in.final_node,
                        'plugin': $in.final_plugin,
                        'function': $in.final_function
                    },
                    'data': _Delete($in, {'step':'' }), // Remove step from $in. Do not do like this. Always define what you send.
                    'data_back': {
                        'id': $in.id,
                        'box_id': $in.box_id,
                        'step': 'step_end'
                    }
                });

            }

            $in.step = 'step_end';
        }

        return {
            'answer': 'true',
            'message': 'Done handling events in RenderForm'
        };
    };

    /**
     * Set the button icon to either ok or fail.
     * @param $in
     * @returns {{answer: string, messages: [], message: string}}
     */
    const set_button_icon = function($in)
    {
        const $default = {
            'box_id': '',
            'ok': 'false',
            'step': 'step_start'
        };
        $in = _Default($default, $in);

        if ($in.step === 'step_start')
        {
            let $assetName = 'icons8-cancel';
            if ($in.ok === 'true') {
                $assetName = 'icons8-ok';
            }

            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_render',
                    'function': 'create'
                },
                'data': {
                    'what': {
                        'svg_result': {
                            'type': 'common',
                            'subtype': 'svg',
                            'data': '[svg_result_asset]'
                        },
                        'svg_result_asset': {
                            'plugin': 'infohub_asset',
                            'type': 'icon',
                            'subtype': 'svg',
                            'asset_name': $assetName,
                            'plugin_name': 'infohub_renderform'
                        },
                    },
                    'how': {
                        'mode': 'one box',
                        'text': '[svg_result]'
                    },
                    'where': {
                        'box_id': $in.box_id,
                        'throw_error_if_box_is_missing': 'false'
                    }
                },
                'data_back': {
                    'step': 'step_end'
                }
            });
        }

        return {
            'answer': 'true',
            'message': 'Sending some messages'
        };
    };
}
//# sourceURL=infohub_renderform.js