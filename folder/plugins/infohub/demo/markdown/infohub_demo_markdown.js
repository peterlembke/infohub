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
function infohub_demo_markdown() {

// include "infohub_base.js"

    /*jshint evil:true */
    /*jshint devel:true */
    /*jslint browser: true, evil: true, plusplus: true, todo: true */

    const _Version = function() {
        return {
            'date': '2020-01-21',
            'since': '2018-04-15',
            'version': '2.0.1',
            'checksum': '{{checksum}}',
            'class_name': 'infohub_demo_markdown',
            'note': 'Render a markdown demo for infohub_demo',
            'status': 'normal',
            'license_name': 'GNU GPL 3 or later'
        };
    };

    const _GetCmdFunctions = function() {
        return {
            'create': 'normal',
            'click_file_read': 'normal',
            'click_markdown_to_html': 'normal'
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
     * @version 2020-01-21
     * @since   2016-10-16
     * @author  Peter Lembke
     */
    $functions.push('create');
    const create = function ($in)
    {
        "use strict";

        const $default = {
            'parent_box_id': '',
            'translations': {},
            'step': 'step_start',
            'response': {
                'answer': 'false',
                'message': 'Nothing to report from infohub_demo_map'
            }
        };
        $in = _Default($default, $in);

        if ($in.step === 'step_start') 
        {
            $classTranslations = $in.translations;

            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_render',
                    'function': 'create'
                },
                'data': {
                    'what': {
                        'my_file_selector': {
                            'type': 'form',
                            'subtype': 'file',
                            'accept': '*',
                            'event_data': 'markdown|file_read',
                            'to_node': 'client',
                            'to_plugin': 'infohub_demo',
                            'to_function': 'click'
                        },
                        'my_textarea': {
                            'type': 'form',
                            'subtype': 'textarea',
                            'placeholder': _Translate('Write your markdown text here or press the button above to select a local text file.')
                        },
                        'my_selector': {
                            'plugin': 'infohub_renderform',
                            'type': 'select',
                            "label": _Translate("Markdown renderer"),
                            "description": _Translate("Select what markdown renderer you want to test"),
                            "size": "1", // Number of rows to show
                            "multiple": "false",
                            'source_node': 'client',
                            'source_plugin': 'infohub_markdown',
                            'source_function': 'get_render_option_list'
                        },
                        'my_button': {
                            'type': 'form',
                            'subtype': 'button',
                            'mode': 'submit',
                            'button_label': _Translate('Markdown to HTML'),
                            'event_data': 'markdown|markdown_to_html',
                            'to_plugin': 'infohub_demo',
                            'to_function': 'click'
                        },
                        'my_result_box': {
                            'type': 'common',
                            'subtype': 'container',
                            'tag': 'div'
                        },
                    },
                    'how': {
                        'mode': 'one box',
                        'text': '[my_file_selector][my_textarea][my_selector][my_button][my_result_box]'
                    },
                    'where': {
                        'box_id': $in.parent_box_id + '.demo',
                        'max_width': 480,
                        'scroll_to_box_id': 'true'
                    }
                },
                'data_back': {'step': 'step_end'}
            });

        }

        return {
            'answer': $in.response.answer,
            'message': $in.response.message,
            'data': $in.response.data
        };
    };

    /**
     * File read markdown. The text file format used on Githib for the README.md files.
     * @version 2020-01-21
     * @since 2019-02-03
     * @author Peter Lembke
     */
    $functions.push("click_file_read");
    const click_file_read = function ($in)
    {
        "use strict";

        const $default = {
            'answer': 'true',
            'message': 'Nothing to report',
            'ok': 'false',
            'step': 'step_start',
            'box_id': '',
            'files_data': []
        };
        $in = _Default($default, $in);

        if ($in.step === 'step_start') 
        {           
            if ($in.files_data.length >= 1) 
            {
                let $content = $in.files_data[0].content;
                $content = $content.substr('data:text/markdown;base64,'.length);
                $content = atob($content);
                $content = _Replace("\n", "\r\n", $content);
                
                return _SubCall({
                    'to': {
                        'node': 'client',
                        'plugin': 'infohub_view',
                        'function': 'set_text'
                    },
                    'data': {
                        'id': $in.box_id + '_my_textarea',
                        'text': $content
                    },
                    'data_back': {
                        'step': 'step_box_data_response'
                    }
                });
            } else {
                $in.message = 'You have not selected a file';
            }
        }
        
        if ($in.step === 'step_box_data_response') {
            if ($in.asnwer === 'true') {
                $in.ok = 'true';
                $in.message = 'Have displayed the file content in the box';
            }
        }

        return {
            'answer': $in.answer,
            'message': $in.message,
            'ok': $in.ok
        };
    };
    
    /**
     * Button click for Markdown to HTML
     * @version 2020-01-21
     * @since 2019-02-03
     * @author Peter Lembke
     */
    $functions.push("click_markdown_to_html");
    const click_markdown_to_html = function ($in)
    {
        "use strict";

        const $default = {
            'answer': 'true',
            'message': 'Nothing to report',
            'ok': 'false',
            'step': 'step_read_markdown_type',
            'box_id': '',
            'type': '',
            'text': '',
            'markdown_type': 'showdown',
            'response': {
                'value': []
            }
        };
        $in = _Default($default, $in);

        if ($in.step === 'step_read_markdown_type') 
        {           
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_view',
                    'function': 'form_select_read'
                },
                'data': {
                    'id': $in.box_id + '_my_selector_form_element'
                },
                'data_back': {
                    'step': 'step_read_markdown_type_response',
                    'box_id': $in.box_id
                }
            });
        }

        if ($in.step === 'step_read_markdown_type_response') 
        {
            if ($in.answer === 'true') {
                if (_IsSet($in.response.value[0]) === 'true') {
                    $in.markdown_type = $in.response.value[0];
                }

                $in.step = 'step_read_markdown_box';
            }
        }

        if ($in.step === 'step_read_markdown_box') 
        {           
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_view',
                    'function': 'get_text'
                },
                'data': {
                    'id': $in.box_id + '_my_textarea'
                },
                'data_back': {
                    'box_id': $in.box_id,
                    'markdown_type': $in.markdown_type,
                    'step': 'step_read_markdown_box_response',
                }
            });
        }

        if ($in.step === 'step_read_markdown_box_response') 
        {
            if ($in.answer === 'true') {
                $in.step = 'step_render_html';
            }
        }
        
        if ($in.step === 'step_render_html') 
        {
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_render',
                    'function': 'create'
                },
                'data': {
                    'what': {
                        'my_markdown': {
                            'plugin': 'infohub_markdown',
                            'type': $in.markdown_type,
                            'text': $in.text
                        }
                    },
                    'how': {
                        'mode': 'one box',
                        'text': '[my_markdown]'
                    },
                    'where': {
                        'box_id': $in.box_id + '_my_result_box',
                        'max_width': 960,
                        'scroll_to_box_id': 'true'
                    }
                },
                'data_back': {
                    'step': 'step_render_html_response'
                }
            });
        }
        
        if ($in.step === 'step_render_html_response') {
            if ($in.answer === 'true') {
                $in.ok = 'true';
                $in.message = 'The text have been converted to HTML and placed in the box';
            }
        }

        return {
            'answer': $in.answer,
            'message': $in.message,
            'ok': $in.ok
        };
    };
}
//# sourceURL=infohub_demo_markdown.js