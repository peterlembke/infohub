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
function infohub_doc_index() {

    "use strict";

// include "infohub_base.js"

    const _Version = function () {
        return {
            'date': '2019-04-13',
            'since': '2019-04-13',
            'version': '1.0.0',
            'checksum': '{{checksum}}',
            'class_name': 'infohub_doc_index',
            'note': 'Render index and handle click events on the list',
            'status': 'normal',
            'license_name': 'GNU GPL 3 or later',
            'title': 'Index'
        };
    };

    const _GetCmdFunctions = function () {
        return {
            'setup_gui': 'normal',
            'click_refresh': 'normal',
            'click_item': 'normal'
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

    $functions.push("_GetBoxId");
    const _GetBoxId = function($child) {
        
        if (_Empty($child) === 'true') {
            $child = 'index';
        }
        
        return 'main.body.infohub_doc.' + $child;
    };

    /**
     * Setup the Graphical User Interface for this child
     * Shows a major box with a title and instructions
     * In the box there are the main menu with "General doc" and "Plugin doc"
     * @version 2019-04-14
     * @since   2019-04-14
     * @author  Peter Lembke
     */
    $functions.push('setup_gui');
    const setup_gui = function ($in)
    {
        const $default = {
                'box_id': '',
                'step': 'step_start',
                'translations': {},
                'response': {
                    'answer': '',
                    'message': '',
                    'data': {}
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
                        'button_refresh': {
                            'plugin': 'infohub_renderform',
                            'type': 'button',
                            'mode': 'button',
                            'button_label': _Translate('Refresh index'),
                            'button_left_icon': '[refresh_icon]',
                            'event_data': 'infohub_doc_index|click_refresh',
                            'to_plugin': 'infohub_doc',
                            'to_function': 'event_message'
                        },
                        'refresh_icon': {
                            'type': 'common',
                            'subtype': 'svg',
                            'data': '[refresh_asset]'
                        },
                        'refresh_asset': {
                            'plugin': 'infohub_asset',
                            'type': 'icon',
                            'asset_name': 'refresh',
                            'plugin_name': 'infohub_doc'
                        },
                        'list': {
                            'type': 'common',
                            'subtype': 'container',
                            'tag': 'div'
                        },
                    },
                    'how': {
                        'mode': 'one box',
                        'text': '[button_refresh][list]'
                    },
                    'where': {
                        'box_id': _GetBoxId('index'),
                        'max_width': 0,
                        'scroll_to_box_id': 'false'
                    }
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
     * Creates the index
     * @version 2019-06-08
     * @since 2019-05-29
     * @author Peter Lembke
     */
    $functions.push("click_refresh");
    const click_refresh = function ($in)
    {
        const $default = {
            'box_id': '',
            'step': 'step_start',
            'response': {
                'answer': 'false',
                'message': 'There was an error',
                'document_html': '',
                'ok': 'false'
            }
        };

        $in = _Default($default, $in);

        if ($in.step === 'step_start')
        {
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_doc_document',
                    'function': 'get_document_html'
                },
                'data': {},
                'data_back': {
                    'step': 'step_pull_out_data'
                }
            });
        }

        if ($in.step === 'step_pull_out_data')
        {
            let $data = [];
            let $length = $in.response.document_html.length;
            let $startHere = 0;

            do {
                const $startTag = '<h';
                const $foundStart = $in.response.document_html.indexOf($startTag, $startHere);
                if ($foundStart < 0) {
                    break;
                }

                const $endTag = '</h';
                const $foundEnd = $in.response.document_html.indexOf($endTag, $foundStart +1);
                if ($foundEnd < 0) {
                    break;
                }

                const $part =  $in.response.document_html.substring($foundStart, $foundEnd);
                if ($part === '') {
                    continue;
                }

                const $indent = $part.substr(2,1);
                const $startIdPosition = $part.indexOf('id="') +4;
                const $endIdPosition = $part.indexOf('">');
                const $id = $part.substring($startIdPosition, $endIdPosition);
                const $label = $part.substring($endIdPosition+2);
                const $html = '<a href="#' + $id + '">' + $label + '</a>';

                $data.push({
                    'indent': $indent -1,
                    'id': $id,
                    'label': $html
                });

                $startHere = $foundEnd;

            } while ($startHere < $length);

            // Create an array suitable for use with advancedlist
            let $parentLevel = 0;
            let $previousItemId = '';
            let $parent = [];
            let $option = [];

            const $separator = '|';

            for (const $key in $data)
            {
                if ($data.hasOwnProperty($key) === false) {
                    continue;
                }

                const $item = $data[$key];
                const $currentLevel = $item.indent;

                if ($parentLevel < $currentLevel) {
                    $parent.push($previousItemId);
                }
                if ($parentLevel > $currentLevel) {
                    $parent.pop();
                }

                $parent.push($item.id);
                $option.push({
                    'label': $item.label,
                    'level': $parent.join($separator)
                });
                $parent.pop();

                $previousItemId = $item.id;
                $parentLevel = $currentLevel;
            }

            const $headLabel = _Translate('Index');
            const $boxId = _GetBoxId('index') + '.[list]';

            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_render',
                    'function': 'create'
                },
                'data': {
                    'what': {
                        'my_presentation_box': {
                            'plugin': 'infohub_rendermajor',
                            'type': 'presentation_box',
                            'head_label': $headLabel,
                            'foot_text': '',
                            'content_data': '[my_list]'
                        },
                        'my_list': {
                            'plugin': 'infohub_renderadvancedlist',
                            'type': 'advanced_list',
                            'subtype': 'list',
                            'option': $option,
                            'separator': $separator
                        }
                    },
                    'how': {
                        'mode': 'one box',
                        'text': '[my_presentation_box]'
                    },
                    'where': {
                        'box_id': $boxId,
                        'max_width': 320 // pixels
                    }
                },
                'data_back': {
                    'step': 'step_end'
                }
            });
        }

        return {
            'answer': $in.response.answer,
            'message': $in.response.message,
            'ok': 'true'
        };
    };

    /**
     * When you click an item from the index list it will scroll the 
     * already rendered document to that title in the document
     * @version 2019-04-14
     * @since 2019-04-14
     * @author Peter Lembke
     */
    $functions.push("click_item");
    const click_item = function ($in)
    {
        const $default = {
            'box_id': '',
            'step': 'step_start',
            'response': {
                'answer': 'false',
                'message': 'There was an error',
                'ok': 'false',
                'value': [], // All selected options in select lists
            }
        };
        $in = _Default($default, $in);

        if ($in.step === 'step_start') 
        {
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_render',
                    'function': 'create'
                },
                'data': {
                    'what': {
                        'render_document': {
                            'plugin': 'infohub_doc',
                            'type': 'document',
                            'document': 'main' // @todo Get the real document name
                        }
                    },
                    'how': {
                        'mode': 'one box',
                        'text': '[render_document]'
                    },
                    'where': {
                        'box_id': _GetBoxId('document'),
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
            'message': $in.response.message,
            'ok': $in.response.ok
        };
    };
}
//# sourceURL=infohub_doc_index.js