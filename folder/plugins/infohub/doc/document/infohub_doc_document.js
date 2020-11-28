/**
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
function infohub_doc_document() {

    "use strict";

// include "infohub_base.js"

    const _Version = function () {
        return {
            'date': '2019-04-16',
            'since': '2019-04-16',
            'version': '1.0.0',
            'checksum': '{{checksum}}',
            'class_name': 'infohub_doc_document',
            'note': 'Render a document',
            'status': 'normal',
            'SPDX-License-Identifier': 'GPL-3.0-or-later',
            'title': 'Document'
        };
    };

    const _GetCmdFunctions = function () {
        const $list = {
            'setup_gui': 'normal',
            'view_document': 'normal',
            'click_link': 'normal',
            'get_document_html': 'normal'
        };

        return _GetCmdFunctionsBase($list);
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
            $child = 'document';
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

            const $headLabel = _Translate('Document');
            const $headText = _Translate('Here you will see the document');
            const $boxId = _GetBoxId('document');

            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_render',
                    'function': 'create'
                },
                'data': {
                    'what': {
                        'major_box': {
                            'plugin': 'infohub_rendermajor',
                            'type': 'presentation_box',
                            'head_label': $headLabel,
                            'head_text': $headText,
                            'content_data': '',
                        }
                    },
                    'how': {
                        'mode': 'one box',
                        'text': '[major_box]'
                    },
                    'where': {
                        'box_id': $boxId,
                        'max_width': 100, // percent
                        'scroll_to_box_id': 'false'
                    },
                    'cache_key': 'document'
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
     * View a document by first requesting the document data from doc_get.
     * Then use the data in a rendering where the Markdown renderer do the rendering from Markdown to HTML.
     * The finished document is then displayed in main.body.infohub_doc.document
     * @version 2019-06-08
     * @since 2019-06-08
     * @author Peter Lembke
     */
    $functions.push("view_document");
    const view_document = function ($in)
    {
        const $boxId = _GetBoxId('document');

        const $default = {
            'area': '',
            'document_name': '',
            'box_id': $boxId,
            'step': 'step_get_document',
            'response': {
                'answer': 'false',
                'message': 'There was an error',
                'document_data': {
                    'document': ''
                },
                'what': {},
                'how': '',
                'ok': 'false'
            }
        };

        $in = _Default($default, $in);

        if ($in.step === 'step_get_document')
        {
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_doc_get',
                    'function': 'get_document'
                },
                'data': {
                    'area': $in.area,
                    'document_name': $in.document_name
                },
                'data_back': {
                    'step': 'step_view_document'
                }
            });
        }

        if ($in.step === 'step_view_document')
        {
            let $markdownText = $in.response.document_data.document;
            $markdownText = _UpdateNavigationLinks($markdownText);

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
                            'text': $markdownText,
                            'what': {} // See infohub_demo_document. You can insert any render object.
                        }
                    },
                    'how': {
                        'mode': 'one box',
                        'text': '[my_document]'
                    },
                    'where': {
                        'box_id': $in.box_id,
                        'max_width': 0, // pixels
                        'set_visible': 'true',
                        'scroll_to_box_id': 'true'
                    }
                },
                'data_back': {
                    'step': 'step_view_document_response'
                }
            });

        }

        if ($in.step === 'step_view_document_response') {
            if ($in.response.answer === 'true') {
                $in.response.ok = 'true';
                $in.response.message = 'The markdown text have been converted to HTML and placed in the box';
            }
        }

        return {
            'answer': $in.response.answer,
            'message': $in.response.message,
            'ok': $in.response.ok
        };

    };

    /**
     * The navigation links can be written in a short format
     * This: Read about [infohub_base](plugin,infohub_base)
     * Will be substituted with this: Read about [infohub_base](infohub_doc|click_link|plugin,infohub_base)
     * @version 2019-08-18
     * @since 2019-08-18
     * @author Peter Lembke
     * @param $text
     * @returns {*|void|string}
     * @private
     */
    const _UpdateNavigationLinks = function ($text)
    {
        const $notFound = -1;

        let $first = 0,
            $second = 0,
            $modifiedText = $text,
            $leave = 40;

        while ($text.indexOf('](', $second) !== $notFound && $leave > 0)
        {
            $leave = $leave - 1;

            $second = $text.indexOf('](', $second);
            $second = $second + 2;

            $first = $text.indexOf(')', $second);
            if ($first === $notFound) {
                continue;
            }

            const $url = $text.substr($second, $first - $second);

            if (_Empty($url) === 'true') {
                continue;
            }

            if ($url.indexOf("\n") !== $notFound) {
                continue;
            }

            if ($url.indexOf('[') !== $notFound) {
                continue;
            }

            if ($url.indexOf(':') !== $notFound) {
                continue;
            }

            if ($url.indexOf('/') !== $notFound) {
                continue;
            }

            if ($url.indexOf('|') !== $notFound) {
                continue;
            }

            const $fullToFind = '](' + $url + ')';
            const $replaceWith = '](infohub_doc|click_link|' + $url + ')';
            $modifiedText = $modifiedText.replace($fullToFind, $replaceWith);

            $second = $second + 2;
        }

        return $modifiedText;
    };

    /**
     * Happens when you click a link in the rendered document
     * @version 2019-06-08
     * @since 2019-04-14
     * @author Peter Lembke
     */
    $functions.push("click_link");
    const click_link = function ($in)
    {
        const $default = {
            'area': '',
            'document_name': '',
            'step': 'step_start',
            'response': {
                'answer': 'false',
                'message': 'There was an error',
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
                    'function': 'view_document'
                },
                'data': {
                    'area': $in.area,
                    'document_name': $in.document_name
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

    /**
     * Reads the currently displayed HTML.
     * Used by infohub_doc_index to create a clickable index from all the H1, H2 in the html.
     * @version 2019-06-08
     * @since 2019-06-08
     * @author Peter Lembke
     */
    $functions.push("get_document_html");
    const get_document_html = function ($in)
    {
        const $default = {
            'step': 'step_start',
            'response': {
                'answer': 'false',
                'message': 'There was an error',
                'html': '',
                'ok': 'false'
            }
        };

        $in = _Default($default, $in);

        if ($in.step === 'step_start')
        {
            const $boxId = _GetBoxId('document');

            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_view',
                    'function': 'get_html'
                },
                'data': {
                    'id': $boxId
                },
                'data_back': {
                    'step': 'step_end'
                }
            });
        }

        return {
            'answer': $in.response.answer,
            'message': $in.response.message,
            'document_html': $in.response.html,
            'ok': $in.response.ok
        };
    };
}
//# sourceURL=infohub_doc_document.js