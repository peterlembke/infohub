/*
 Copyright (C) 2010- Peter Lembke, CharZam soft
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
function infohub_tools_checksum() {

// include "infohub_base.js"

    /*jshint evil:true */
    /*jshint devel:true */
    /*jslint browser: true, evil: true, plusplus: true, todo: true */

    const _Version = function() {
        return {
            'date': '2019-03-31',
            'since': '2018-07-29',
            'version': '1.0.0',
            'checksum': '{{checksum}}',
            'class_name': 'infohub_tools_checksum',
            'note': 'Render a form for generating checksums',
            'status': 'normal',
            'license_name': 'GNU GPL 3 or later'
        };
    };

    const _GetCmdFunctions = function() {
        return {
            'create': 'normal',
            'click_handle_node_select': 'normal',
            'click_handle_checksum': 'normal'
        };
    };

    let $classTranslations = {};

    /**
     * Translate - Substitute a string for another string using a class local object
     * @param {type} $string
     * @returns string
     */
    $functions.push('_Translate');
    const _Translate = function ($string)
    {
        if (typeof $classTranslations !== 'object') {
            return $string;
        }

        return _GetData({
            'name': _GetClassName() + '|' + $string, 
            'default': $string, 'data': $classTranslations, 'split': '|'
        });
    };    

    // ***********************************************************
    // * your class functions below, only declare with var
    // * Can only be reached trough cmd()
    // ***********************************************************

    /**
     * Get instructions and create the message to InfoHub View
     * @version 2016-10-16
     * @since   2016-10-16
     * @author  Peter Lembke
     */
    $functions.push('create');
    const create = function ($in)
    {
        "use strict";

        const $default = {
            'subtype': 'menu',
            'parent_box_id': '',
            'translations': {},
            'step': 'step_start',
            'response': {
                'answer': 'false',
                'message': 'Nothing to report from tools_checksum'
            }
        };
        $in = _Default($default, $in);

        const $size = '1';
        let $text = [];

        if ($in.step === 'step_start') 
        {
            $classTranslations = $in.translations;

            $text[0] = _Translate('You can generate a checksum from the data you enter.');
            $text[1] = _Translate('You can select what node will generate the checksum.');
            $text[2] = _Translate('You can select what type of checksum you want.');
            $text[3] = _Translate('<a href="https://en.wikipedia.org/wiki/National_identification_number#Sweden" target="_blank">Personnummer</a> is used in Sweden as a personal identifier or a company identifier.');
            $text[4] = _Translate('You can enter a personnummer in this format: "YYMMDD-NNN".');
            $text[5] = _Translate('YY = Two digit year, MM = two digit month, DD = two digit day of month,');
            $text[6] = _Translate('NNN = any three digit number.');
            $text[7] = _Translate('The checksum will calculate the fourth (last) digit.');

            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_render',
                    'function': 'create'
                },
                'data': {
                    'what': {
                        'titel': {
                            'type': 'common',
                            'subtype': 'value',
                            'data': _Translate('Checksum')
                        },
                        'my_presentation_box': {
                            'plugin': 'infohub_rendermajor',
                            'type': 'presentation_box',
                            'head_label': _Translate('Click for instructions...'),
                            'content_data': '[i][ingress][/i]',
                            'open': 'false'
                        },
                        'ingress': {
                            'type': 'common',
                            'subtype': 'value',
                            'data': $text.join('<br>')
                        },
                        'my_form': {
                            'plugin': 'infohub_renderform',
                            'type': 'form',
                            'content': '[my_select_node][my_select_method]<br>[my_textbox_input]<br>[my_submit_button]<br>[my_textbox_output]',
                            'label': _Translate('Checksum'),
                            'description': _Translate('Select what checksum method you want to use')
                        },
                        'my_select_node': {
                            'type': 'form',
                            'subtype': 'select',
                            "label": _Translate("Node"),
                            "description": _Translate("What node plugin do you want to produce the checksum?"),
                            "size": $size,
                            "multiple": "false",
                            "options": [
                                { "type": "option", "value": "client", "label": _Translate("Client"), 'selected': 'true' },
                                { "type": "option", "value": "server", "label": _Translate("Server") }
                            ],
                            'to_plugin': 'infohub_tools',
                            'to_function': 'click',
                            'event_data': 'checksum|handle_node_select',
                            'custom_variables': {
                                'affect_alias': 'my_select_method',
                                'affect_plugin': 'infohub_checksum',
                                'affect_function': 'get_available_options'
                            }
                        },
                        'my_select_method': {
                            'type': 'form',
                            'subtype': 'select',
                            "label": _Translate("Checksum method"),
                            "description": _Translate("What type of checksum do you want to create?"),
                            "size": $size,
                            "multiple": "false",
                            'source_node': 'client',
                            'source_plugin': 'infohub_checksum',
                            'source_function': 'get_available_options',
                            "options": []
                        },
                        'my_textbox_input': {
                            'type': 'form',
                            'subtype': 'text',
                            'input_type': 'text',
                            'placeholder': _Translate('Your data you want a checksum for'),
                            'class': 'text',
                            'css_data': {},
                            'validator_plugin': 'infohub_validate',
                            'validator_function': 'validate_has_data'
                        },
                        'my_submit_button': {
                            'plugin': 'infohub_renderform',
                            'type': 'button',
                            'mode': 'submit',
                            'button_label': _Translate('Get Checksum'),
                            'event_data': 'checksum|handle_checksum',
                            'to_plugin': 'infohub_tools',
                            'to_function': 'click'
                        },
                        'my_textbox_output': {
                            'type': 'form',
                            'subtype': 'text',
                            'input_type': 'text',
                            'placeholder': _Translate('Will show the Checksum'),
                            'class': 'text',
                            'css_data': {}
                        }
                    },
                    'how': {
                        'mode': 'one box',
                        'text': '[h1][titel][/h1][my_presentation_box][my_form]'
                    },
                    'where': {
                        'box_id': $in.parent_box_id + '.tools',
                        'max_width': 100,
                        'scroll_to_box_id': 'true'
                    }
                },
                'data_back': {'step': 'step_end'}
            });
        }

        return {
            'answer': $in.response.answer,
            'message': $in.response.message
        };

    };
    
    /**
     * In Encrypt when you select a node then one of the select boxes should be hidden
     * @version 2018-08-08
     * @since   2018-08-08
     * @author  Peter Lembke
     */
    $functions.push('click_handle_node_select');
    const click_handle_node_select = function ($in)
    {
        "use strict";

        const $default = {
            'step': 'step_start',
            'value': '',
            'box_id': '',
            'affect_alias': '',
            'affect_plugin': '',
            'affect_function': ''
        };
        $in = _Default($default, $in);

        if ($in.step === 'step_start')
        {
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_render',
                    'function': 'render_options'
                },
                'data': {
                    'id': $in.box_id + '_' + $in.affect_alias,
                    'source_node': $in.value,
                    'source_plugin': $in.affect_plugin,
                    'source_function': $in.affect_function
                },
                'data_back': {
                    'step': 'step_end',
                    'value': $in.value
                }
            });
        }

        return {
            'answer': 'true',
            'message': 'Handled the node select',
            'ok': 'true'
        };
    };

    /**
     * Handle checksum
     * @version 2018-08-04
     * @since   2018-08-04
     * @author  Peter Lembke
     */
    $functions.push('click_handle_checksum');
    const click_handle_checksum = function ($in)
    {
        "use strict";

        let $formData = {};

        const $default = {
            'step': 'step_start',
            'form_data': {},
            'response': {}
        };
        $in = _Default($default, $in);

        if ($in.step === 'step_start') {
            const $node = _GetData({'name': 'form_data/my_select_node/value/0', 'default': 'client', 'data': $in });
            const $method = _GetData({'name': 'form_data/my_select_method/value/0', 'default': 'md5', 'data': $in });
            const $input = _GetData({'name': 'form_data/my_textbox_input/value', 'default': '', 'data': $in });

            const $callServer = {
                'to': {
                    'node': $node,
                    'plugin': 'infohub_checksum',
                    'function': 'calculate_checksum'
                },
                'data': {
                    'type': $method,
                    'value': $input
                },
                'data_back': {}
            };

            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_tools',
                    'function': 'call_server'
                },
                'data': {
                    'send_data': $callServer
                },
                'data_back': {
                    'step': 'step_response'
                }
            });

        }

        if ($in.step === 'step_response') {
            $formData =  {
                'my_textbox_output': { 'value': $in.response.checksum }
            };
            $in.step = 'step_display_data';
        }

        if ($in.step === 'step_display_data') {
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_view',
                    'function': 'form_write'
                },
                'data': {
                    'id': 'main.body.infohub_tools.tools',
                    'form_data': $formData
                },
                'data_back': {
                    'step': 'step_end'
                }
            });
        }

        return {
            'answer': 'true',
            'message': 'Finished handle_checksum',
            'ok': 'true'
        };
    };
}
//# sourceURL=infohub_tools_checksum.js