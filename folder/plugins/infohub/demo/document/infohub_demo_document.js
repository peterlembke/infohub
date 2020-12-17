/**
 * Render a document demo for infohub_demo
 *
 * @author      Peter Lembke <info@infohub.se>
 * @version     2019-03-28
 * @since       2018-04-15
 * @copyright   Copyright (c) 2018, Peter Lembke
 * @license     https://opensource.org/licenses/gpl-license.php GPL-3.0-or-later
 * @see         https://github.com/peterlembke/infohub/blob/master/folder/plugins/infohub/demo/document/infohub_demo_document.md Documentation
 * @link        https://infohub.se/ InfoHub main page
 */
function infohub_demo_document() {

    "use strict";

// include "infohub_base.js"

    $functions.push('_Version');
    /**
     * Version information, used by the version function
     * @returns {{date: string, note: string, 'SPDX-License-Identifier': string, checksum: string, version: string, class_name: string, since: string, status: string}}
     * @private
     */
    const _Version = function() {
        return {
            'date': '2019-03-28',
            'since': '2018-04-15',
            'version': '2.0.0',
            'checksum': '{{checksum}}',
            'class_name': 'infohub_demo_document',
            'note': 'Render a document demo for infohub_demo',
            'status': 'normal',
            'SPDX-License-Identifier': 'GPL-3.0-or-later'
        };
    };

    $functions.push('_GetCmdFunctions');
    /**
     * List with all public functions you can call
     * @returns {*}
     * @private
     */
    const _GetCmdFunctions = function() {
        const $list = {
            'create': 'normal',
            'click_file_read': 'normal',
            'click_load_example': 'normal',
            'click_markdown_to_html': 'normal'
        };

        return _GetCmdFunctionsBase($list);
    };

    let $classTranslations = {};

    // ***********************************************************
    // * your class functions below, only declare with const
    // * Can only be reached trough cmd()
    // ***********************************************************

    /**
     * Get instructions and create the message to InfoHub View
     * @version 2019-03-28
     * @since   2016-10-16
     * @author  Peter Lembke
     */
    $functions.push('create');
    const create = function ($in)
    {
        const $default = {
            'parent_box_id': '',
            'translations': {},
            'step': 'step_start',
            'response': {
                'answer': 'false',
                'message': 'Nothing to report from infohub_demo_document'
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
                            'plugin': 'infohub_renderform',
                            'type': 'file',
                            'button_label': _Translate('Select file'),
                            'accept': 'application/text,.md', // https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/file#Unique_file_type_specifiers
                            'event_data': 'document|file_read',
                            'to_node': 'client',
                            'to_plugin': 'infohub_demo',
                            'to_function': 'click'
                        },
                        'example_button': {
                            'plugin': 'infohub_renderform',
                            'type': 'button',
                            'mode': 'submit',
                            'button_label': _Translate('Load example'),
                            'event_data': 'document|load_example',
                            'to_plugin': 'infohub_demo',
                            'to_function': 'click'
                        },
                        'my_textarea': {
                            'type': 'form',
                            'subtype': 'textarea',
                            'placeholder': _Translate('Write your markdown text here or press the button above to select a local text file.')
                        },
                        'my_button': {
                            'plugin': 'infohub_renderform',
                            'type': 'button',
                            'mode': 'submit',
                            'button_label': _Translate('Markdown to HTML'),
                            'event_data': 'document|markdown_to_html',
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
                        'text': '[my_file_selector][example_button][my_textarea][my_button][my_result_box]'
                    },
                    'where': {
                        'box_id': $in.parent_box_id + '.demo',
                        'max_width': 100,
                        'scroll_to_box_id': 'true'
                    },
                    'cache_key': 'document'
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
     * @version 2019-02-03
     * @since 2019-02-03
     * @author Peter Lembke
     */
    $functions.push("click_file_read");
    const click_file_read = function ($in)
    {
        const $default = {
            'answer': 'false',
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

                const $findMarkdown = 'data:text/markdown;base64,';
                if ($findMarkdown === $content.substr(0,$findMarkdown.length)) {
                    $content = $content.substr($findMarkdown.length);
                    $content = atob($content);
                    $content = decodeURIComponent(escape($content));
                    $in.response.files_data[$fileNumber].content = $content;
                }

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
            }

            $in.message = 'You have not selected a file';
        }
        
        if ($in.step === 'step_box_data_response') {
            if ($in.answer === 'true') {
                $in.ok = 'true';
                $in.message = 'Have loaded the file content into the text box';
            }
        }

        return {
            'answer': $in.answer,
            'message': $in.message,
            'ok': $in.ok
        };
    };

    /**
     * File read markdown. The text file format used on Githib for the README.md files.
     * @version 2019-02-03
     * @since 2019-02-03
     * @author Peter Lembke
     */
    $functions.push("click_load_example");
    const click_load_example = function ($in)
    {
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
            const $content = ` 
# Main title
Small example how Markdown can be used.

## Style
Text in //italic// and **bold** and __underline__ and ~~strike trough~~ and ^^highlighted^^.  

## Link
- External [link](https://www.teamfakta.se).
- Internal [link](infohub_demo|click_link|my_message)

## Image
- Jpeg image ![Alternative text](infohub_demo/asset/image/common/con00004.jpeg)
- SVG image ![My alternative text](infohub_demo/asset/icon/common/duckduckgo-v107.svg)
- My provided icon [my_icon]

## Render anything
- Current time: [time]
`;

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
        }

        if ($in.step === 'step_box_data_response') {
            if ($in.answer === 'true') {
                $in.ok = 'true';
                $in.message = 'The example is loaded into the text box';
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
     * @version 2019-02-03
     * @since 2019-02-03
     * @author Peter Lembke
     */
    $functions.push("click_markdown_to_html");
    const click_markdown_to_html = function ($in)
    {
        const $default = {
            'form_data': {
                'my_textarea': {
                    'value': ''
                }
            },
            'answer': 'true',
            'message': 'Nothing to report',
            'ok': 'false',
            'step': 'step_render_html',
            'box_id': '',
            'type': '',
            'text': '',
            'response': {
                'value': []
            }
        };
        $in = _Default($default, $in);

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
                        'my_document': {
                            'plugin': 'infohub_renderdocument',
                            'type': 'document',
                            'text': $in.form_data.my_textarea.value,
                            'what': {
                                'my_icon': {
                                    'type': 'common',
                                    'subtype': 'svg',
                                    'alias': 'my_icon',
                                    'data': '[my_icon_asset]'
                                },
                                'my_icon_asset': {
                                    'plugin': 'infohub_asset',
                                    'type': 'icon',
                                    'subtype': 'svg',
                                    'asset_name': 'link/infohub-logo-mini-done',
                                    'plugin_name': 'infohub_demo'
                                },
                                'time': {
                                    'type': 'common',
                                    'subtype': 'value',
                                    'data': _TimeStamp()
                                }
                            }
                        }
                    },
                    'how': {
                        'mode': 'one box',
                        'text': '[my_document]'
                    },
                    'where': {
                        'box_id': $in.box_id + '_my_result_box',
                        'max_width': 100,
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
//# sourceURL=infohub_demo_document.js