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
function infohub_democall() {

    "use strict";

// include "infohub_base.js"

    const _Version = function() {
        return {
            'date': '2018-05-19',
            'since': '2018-05-19',
            'version': '1.0.0',
            'checksum': '{{checksum}}',
            'class_name': 'infohub_democall',
            'note': 'Demonstrate what happens if a plugin or function do not exist',
            'status': 'normal',
            'SPDX-License-Identifier': 'GPL-3.0-or-later',
            'title': 'Demo call',
            'recommended_security_group': 'developer'
        };
    };

    const _GetCmdFunctions = function() {
        return {
            'startup': 'normal',
            'setup_gui': 'normal',
            'event_message': 'normal'
        };
    };

    const _GetPluginName = function($data)
    {
        let $pluginType = 'welcome',
            $tmp = $data.split("_");

        if (_IsSet($tmp[0]) === 'true') {
            $pluginType = $tmp[0];
        }

        return 'infohub_democall_' + $pluginType;
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
            'default': $string,
            'data': $classTranslations,
            'split': '|'
        });
    };

    // ***********************************************************
    // * your class functions below, only declare with var
    // * Can only be reached trough cmd()
    // ***********************************************************

    /**
     * Setup the Workbench Graphical User Interface
     * @version 2017-10-03
     * @since   2017-10-03
     * @author  Peter Lembke
     */
    $functions.push('setup_gui');
    const setup_gui = function ($in)
    {
        const $default = {
            'box_id': '',
            'step': 'step_start'
        };
        $in = _Merge($default, $in);

        if ($in.step === 'step_start')
        {
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_view',
                    'function': 'box_mode'
                },
                'data': {
                    'box_id': $in.box_id,
                    'box_mode': 'side',
                    'digits': '2'
                },
                'data_back': {
                    'box_id': $in.box_id,
                    'step': 'step_boxes_insert'
                }
            });
        }

        if ($in.step === 'step_boxes_insert')
        {
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_view',
                    'function': 'boxes_insert_detailed'
                },
                'data': {
                    'items': [
                        {
                            'parent_box_id': $in.box_id,
                            'box_position': 'last',
                            'box_mode': 'data',
                            'box_alias': 'menu',
                            'max_width': 640,
                            'box_data': 'The menu will render here'
                        },
                        {
                            'parent_box_id': $in.box_id,
                            'box_position': 'last',
                            'box_mode': 'data',
                            'box_alias': 'demo',
                            'max_width': 100, // 100 will be translated to 100%
                            'box_data': 'The demo will render here'
                        }
                    ]
                },
                'data_back': {
                    'box_id': $in.box_id,
                    'step': 'step_get_translations'
                }
            });
        }

        if ($in.step === 'step_get_translations') {
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_translate',
                    'function': 'get_translate_data'
                },
                'data': {},
                'data_back': {
                    'box_id': $in.box_id,
                    'step': 'step_get_translations_response'
                }
            });
        }

        if ($in.step === 'step_get_translations_response') {            
            $classTranslations = _ByVal($in.response.data);
            $in.step = 'step_menu';
        }

        if ($in.step === 'step_menu')
        {
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_democall',
                    'function': 'startup'
                },
                'data': {
                    'parent_box_id': $in.box_id
                },
                'data_back': {
                    'box_id': $in.box_id,
                    'step': 'step_render_instructions'
                }
            });
        }

        if ($in.step === 'step_render_instructions') {
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_render',
                    'function': 'create'
                },
                'data': {
                    'what': {
                        'presentation_box': {
                            'plugin': 'infohub_rendermajor',
                            'type': 'presentation_box',
                            'head_label': _Translate('Instructions'),
                            'head_text': '',
                            'content_data': '[description]'
                        },
                        'description': {
                            'type': 'common',
                            'subtype': 'value',
                            'data': _Translate('Use the menu.')
                        }
                    },
                    'how': {
                        'mode': 'one box',
                        'text': '[presentation_box]'
                    },
                    'where': {
                        'box_id': 'main.body.infohub_democall.demo',
                        'max_width': 640,
                        'scroll_to_box_id': 'true'
                    },
                    'cache_key': 'instructions'
                },
                'data_back': {
                    'step': 'step_end'
                }
            });
        }

        return {
            'answer': 'true',
            'message': 'plugin GUI is done'
        };

    };

    /**
     * First function to start
     * Used by: index.php
     * @version 2014-08-02
     * @since 2013-04-12
     * @author Peter Lembke
     */
    $functions.push("startup");
    const startup = function ($in)
    {
        const $default = {
            'step': 'step_democall_list',
            'parent_box_id': '1',
            'callback_function': null,
            'data': {}
        };
        $in = _Default($default, $in);

        if ($in.step === "step_democall_list")
        {
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_democall_menu',
                    'function': 'create'
                },
                'data': {
                    'subtype': 'menu',
                    'parent_box_id': $in.parent_box_id,
                    'translations': $classTranslations
                },
                'data_back': {
                    'subtype': 'menu',
                    'parent_box_id': $in.parent_box_id,
                    'step': 'step_democall_list_response'
                }
            });
        }

        if ($in.step === "step_democall_list_response") {
            return _SubCall($in.data);
        }

        return {
            'answer': 'true',
            'message': 'startup is done'
        };

    };

    /**
     * Handle incoming event messages that come from the graphical user interface
     * Gets a string in variable event_data and looks up what message to send.
     * The message we send get answered and we display the answer on the screen so you can
     * see the result. Some result are intentionally wrong so you can see what happens.
     * @version 2019-10-24
     * @since   2018-05-19
     * @author  Peter Lembke
     */
    $functions.push('event_message');
    const event_message = function ($in)
    {
        const $default = {
            'step': 'step_start',
            'event_data': '',
            'type': '',
            'event_type': '',
            'parent_box_id': '',
            'box_id': '',
            'answer': 'false',
            'message': '',
            'ok': 'false',
            'response': {}
        };
        $in = _Merge($default, $in);

        if ($in.step === 'step_start')
        {
            const $call = {
                'client_correct': {
                    'node': 'client',
                    'plugin': 'infohub_checksum',
                    'function': 'calculate_checksum'
                },
                'client_missing_cmd_function': {
                    'node': 'client',
                    'plugin': 'infohub_checksum',
                    'function': 'calculate_foobar'
                },
                'client_missing_plugin': {
                    'node': 'client',
                    'plugin': 'infohub_foobar',
                    'function': 'calculate_checksum'
                },
                'server_correct': {
                    'node': 'server',
                    'plugin': 'infohub_checksum',
                    'function': 'calculate_checksum'
                },
                'server_missing_cmd_function': {
                    'node': 'server',
                    'plugin': 'infohub_checksum',
                    'function': 'calculate_foobar'
                },
                'server_missing_plugin': {
                    'node': 'server',
                    'plugin': 'infohub_foobar',
                    'function': 'calculate_checksum'
                },
                'client_child_valid': {
                    'node': 'client',
                    'plugin': 'infohub_democall_child',
                    'function': 'child_func'
                },
                'client_invalid_call_to_sibling_grandchild': {
                    'node': 'client',
                    'plugin': 'infohub_democall_child',
                    'function': 'invalid_call_to_sibling_grandchild'
                },
                'client_invalid_call_from_sibling_grandchild_to_aunt': {
                    'node': 'client',
                    'plugin': 'infohub_democall_sibling',
                    'function': 'invalid_call_from_sibling_grandchild_to_aunt'
                },
                'client_invalid_call_from_child_to_parent': {
                    'node': 'client',
                    'plugin': 'infohub_democall_child',
                    'function': 'test_answer_child',
                },
                'server_run_all_tests': {
                    'node': 'server',
                    'plugin': 'infohub_democall',
                    'function': 'run_all_tests'
                }
            };

            if (_IsSet($call[$in.event_data]) === 'true')
            {
                return _SubCall({
                    'to': _ByVal($call[$in.event_data]),
                    'data': {},
                    'data_back': {
                        'box_id': $in.box_id,
                        'parent_box_id': $in.parent_box_id,
                        'step': 'step_start_response'
                    }
                });
            }

            $in.answer = 'false';
            $in.message = 'Can not find a matching call for data:' + $in.data;
            $in.ok = 'false';
        }

        if ($in.step === 'step_start_response') 
        {
            const $response = JSON.stringify($in.response, null, 2);
            
            $in.ok = $in.answer;
            
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_render',
                    'function': 'create'
                },
                'data': {
                    'what': {
                        'presentation_box': {
                            'plugin': 'infohub_rendermajor',
                            'type': 'presentation_box',
                            'head_label': _Translate('Result'),
                            'head_text': '',
                            'content_data': '[result]'
                        },
                        'result': {
                            'type': 'common',
                            'subtype': 'codecontainer',
                            'data': $response
                        }
                    },
                    'how': {
                        'mode': 'one box',
                        'text': '[presentation_box]'
                    },
                    'where': {
                        'box_id': $in.parent_box_id + '.demo',
                        'max_width': 640,
                        'scroll_to_box_id': 'true'
                    }
                },
                'data_back': {
                    'ok': $in.ok,
                    'message': $in.response.message, // I want that message for this demo
                    'step': 'step_end'
                }
            });
        }

        if ($in.step === 'step_end') {
        }

        return {
            'answer': $in.answer,
            'message': $in.message,
            'ok': $in.ok
        };
    };
}
//# sourceURL=infohub_democall.js