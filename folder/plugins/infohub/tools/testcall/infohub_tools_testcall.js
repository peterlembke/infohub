/*
 Copyright (C) 2019 Peter Lembke, CharZam soft
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
function infohub_tools_testcall() {

// include "infohub_base.js"

    // ***********************************************************
    // * jshint.com options to suppress some warnings
    // ***********************************************************

    /*jshint evil:true */
    /*jshint devel:true */
    /*jslint browser: true, evil: true, plusplus: true, todo: true */

    // ***********************************************************
    // * your private class variables below, only declare with var
    // ***********************************************************

    var _Version = function() {
        return {
            'date': '2019-07-11',
            'since': '2019-07-10',
            'version': '1.0.0',
            'checksum': '{{checksum}}',
            'class_name': 'infohub_tools_testcall',
            'note': 'Write calls to trigger functions',
            'status': 'normal',
            'license_name': 'GNU GPL 3 or later'
        };
    };

    var _GetCmdFunctions = function() {
        return {
            'create': 'normal',
            'click_select_template': 'normal',
            'click_button_send': 'normal',
            'get_available_options': 'normal',
            'click_select_demo': 'normal'
        };
    };

    var $classTranslations = {};

    /**
     * Translate - Substitute a string for another string using a class local object
     * @param {type} $string
     * @returns string
     */
    $functions.push('_Translate');
    var _Translate = function ($string) 
    {
        if (typeof $classTranslations !== 'object') { return $string; }
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
     * @version 2019-07-10
     * @since   2019-07-10
     * @author  Peter Lembke
     */
    $functions.push('create');
    var create = function ($in)
    {
        "use strict";

        const $default = {
                'subtype': 'menu',
                'parent_box_id': '',
                'translations': {},
                'step': 'step_start',
                'response': {
                    'answer': 'false',
                    'message': 'Nothing to report from tools_testcall'
                }
            };
        $in = _Default($default, $in);

        const $size = '1';
        let $text = [];

        if ($in.step === 'step_start')
        {
            $classTranslations = $in.translations;

            $text[0] = _Translate('With this tool you can write test calls and trigger functions.');
            $text[1] = _Translate('Practical if you want to debug a specific function.');

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
                            'data': _Translate('Test call')
                        },
                        'box_instructions': {
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
                        'form_testcall': {
                            'plugin': 'infohub_renderform',
                            'type': 'form',
                            'content': '[select_template]<br>[text_testcall]<br>[button_send]<br>[text_response]',
                            'label': _Translate('Test call'),
                            'description': _Translate('Write your test call and send it'),
                            'css_data': {
                                // '.form': 'min-width:640px;'
                            }
                        },
                        'select_template': {
                            'plugin': 'infohub_renderform',
                            'type': 'select',
                            "label": _Translate("Template call"),
                            "description": _Translate("Select a template for the call you want"),
                            "size": $size,
                            "multiple": "false",
                            'source_node': 'client',
                            'source_plugin': 'infohub_tools',
                            'source_function': 'get_available_options',
                            "options": [],
                            'to_plugin': 'infohub_tools',
                            'to_function': 'click',
                            'event_data': 'testcall|select_template',
                        },
                        'text_testcall': {
                            'type': 'form',
                            'subtype': 'textarea',
                            'input_type': 'text',
                            'placeholder': _Translate('The call you want to make'),
                            'class': 'textarea',
                            'css_data': {},
                            'rows': 12
                        },
                        'button_send': {
                            'plugin': 'infohub_renderform',
                            'type': 'button',
                            'mode': 'submit',
                            'button_label': _Translate('Send'),
                            'event_data': 'testcall|button_send',
                            'to_plugin': 'infohub_tools',
                            'to_function': 'click'
                        },
                        'text_response': {
                            'type': 'form',
                            'subtype': 'textarea',
                            'input_type': 'text',
                            'placeholder': _Translate('Response'),
                            'class': 'textarea',
                            'css_data': {},
                            'rows': 20
                        },
                        'demo': {
                            'type': 'common',
                            'subtype': 'container',
                            'tag': 'div',
                            'data': 'This is a place holder for the GUI demo'
                        },
                    },
                    'how': {
                        'mode': 'one box',
                        'text': '[h1][titel][/h1][box_instructions][form_testcall]<br>[demo]'
                    },
                    'where': {
                        'box_id': $in.parent_box_id + '.tools',
                        'max_width': 100,
                        'scroll_to_box_id': 'true'
                    }
                },
                'data_back': {
                    'step': 'step_end'
                }
            });
        }

        return {
            'answer': $in.response.answer,
            'message': $in.response.message
        };

    };

    /**
     * Select a template in the select box and end up here. The template will be shown in "text_testcall"
     * @version 2019-07-10
     * @since   2019-07-10
     * @author  Peter Lembke
     */
    $functions.push('click_select_template');
    var click_select_template = function ($in)
    {
        "use strict";

        const $default = {
            'step': 'step_start',
            'value': '',
            'box_id': '',
            'config': {}
        };
        $in = _Default($default, $in);

        if ($in.step === 'step_start')
        {
            const $call = _JsonEncode(_GetData({
                'name': $in.value,
                'default': $in.config.client_call,
                'data': $in.config
            }));

            const $formData =  {
                'text_testcall': { 'value': $call }
            };

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
            'message': 'Handled the template select',
            'ok': 'true'
        };
    };

    /**
     * Send the call
     * @version 2019-07-10
     * @since   2019-07-10
     * @author  Peter Lembke
     */
    $functions.push('click_button_send');
    var click_button_send = function ($in)
    {
        "use strict";

        const $default = {
            'step': 'step_start',
            'box_id': '',
            'form_data': {},
            'response': {},
            'config': {}
        };
        $in = _Default($default, $in);

        let $formData = {};

        if ($in.step === 'step_start')
        {
            const $out = _GetData({
                'name': 'form_data/text_testcall/value',
                'default': $in.config.client_call,
                'data': $in
            });

            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_tools',
                    'function': 'call_server'
                },
                'data': {
                    'send_data': _JsonDecode($out)
                },
                'data_back': {
                    'step': 'step_response'
                }
            });

        }

        if ($in.step === 'step_response') {

            const $value = _JsonEncode($in);

            $formData =  {
                'text_response': { 'value': $value }
            };

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

        let $ok = 'true';
        if ($in.step === 'step_end') {
            if ($in.response.answer === 'false') {
                $ok = 'false';
            }
        }

        return {
            'answer': 'true',
            'message': 'Finished click_button_compress',
            'ok': $ok
        };
    };

    /**
     * Get list with config examples you can use
     * @version 2019-07-11
     * @since   2019-07-11
     * @author  Peter Lembke
     * @param array $in
     * @return array
     */
    $functions.push('get_available_options');
    var get_available_options = function ($in)
    {
        const $default = {
            'config': {}
        };
        $in = _Default($default, $in);

        "use strict";
        let $options = [
            {"type": "option", "value": 'select', "label": 'Select...' }
        ];

        for (let $key in $in.config) {
            if ($in.config.hasOwnProperty($key)) {
                const $option = {"type": "option", "value": $key, "label": $key };
                $options.push($option);
            }
        }

        return {
            'answer': 'true',
            'message': 'List of valid compression methods.',
            'options': $options
        };
    };

    /**
     * Select a demo and get at text box updated
     * @version 2019-07-11
     * @since   2019-07-11
     * @author  Peter Lembke
     */
    $functions.push('click_select_demo');
    var click_select_demo = function ($in)
    {
        "use strict";

        const $default = {
            'step': 'step_start',
            'value': '',
            'box_id': '',
            'config': {}
        };
        $in = _Default($default, $in);

        if ($in.step === 'step_start')
        {
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_view',
                    'function': 'set_text'
                },
                'data': {
                    'id': 'main.body.infohub_tools.tools.[demo_text_demo]',
                    'text': $in.value
                },
                'data_back': {
                    'step': 'step_end'
                }
            });
        }

        return {
            'answer': 'true',
            'message': 'Handled the demo select',
            'ok': 'true'
        };
    };

}
//# sourceURL=infohub_tools_testcall.js