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
function infohub_doc_visited() {

    'use strict';

// include "infohub_base.js"

    const _Version = function() {
        return {
            'date': '2019-04-13',
            'since': '2019-04-13',
            'version': '1.0.0',
            'checksum': '{{checksum}}',
            'class_name': 'infohub_doc_visited',
            'note': 'Render list with the latest visited documents',
            'status': 'normal',
            'SPDX-License-Identifier': 'GPL-3.0-or-later',
            'title': 'Visited',
        };
    };

    const _GetCmdFunctions = function() {
        const $list = {
            'setup_gui': 'normal',
            'click_refresh': 'normal',
            'click_item': 'normal',
        };

        return _GetCmdFunctionsBase($list);
    };

    let $classTranslations = {};

    // ***********************************************************
    // * your class functions below, only declare with var
    // * Can only be reached through cmd()
    // ***********************************************************

    $functions.push('_GetBoxId');
    const _GetBoxId = function($child = '') {

        if (_Empty($child) === 'true') {
            $child = 'visited';
        }

        return 'main.body.infohub_doc.' + $child;
    };

    /**
     * Set up the Graphical User Interface for this child
     * Shows a major box with a title and instructions
     * In the box there are the main menu with "General doc" and "Plugin doc"
     * @version 2019-04-14
     * @since   2019-04-14
     * @author  Peter Lembke
     */
    $functions.push('setup_gui');
    const setup_gui = function($in = {}) {
        const $default = {
            'box_id': '',
            'step': 'step_start',
            'translations': {},
            'response': {
                'answer': '',
                'message': '',
                'data': {},
            },
        };
        $in = _Default($default, $in);

        if ($in.step === 'step_start') {
            $classTranslations = $in.translations;

            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_render',
                    'function': 'create',
                },
                'data': {
                    'what': {
                        'button_refresh': {
                            'plugin': 'infohub_renderform',
                            'type': 'button',
                            'mode': 'button',
                            'button_label': _Translate('REFRESH_VISITED'),
                            'event_data': 'infohub_doc_visited|click_refresh',
                            'to_plugin': 'infohub_doc',
                            'to_function': 'event_message',
                        },
                        'list': {
                            'type': 'common',
                            'subtype': 'container',
                            'tag': 'div',
                        },
                    },
                    'how': {
                        'mode': 'one box',
                        'text': '[button_refresh][list]',
                    },
                    'where': {
                        'box_id': _GetBoxId('visited'),
                        'max_width': 100,
                        'scroll_to_box_id': 'false',
                    },
                },
                'data_back': {
                    'step': 'step_end',
                },
            });
        }

        return {
            'answer': 'true',
            'message': 'plugin GUI is done',
        };

    };

    /**
     * When you click a document name from the visited list the document will show
     * @version 2019-04-14
     * @since 2019-04-14
     * @author Peter Lembke
     */
    $functions.push('click_item');
    const click_item = function($in = {}) {
        const $default = {
            'box_id': '',
            'step': 'step_start',
            'response': {
                'answer': 'false',
                'message': 'There was an error',
                'ok': 'false',
                'value': [], // All selected options in select lists
            },
        };
        $in = _Default($default, $in);

        if ($in.step === 'step_start') {
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_render',
                    'function': 'create',
                },
                'data': {
                    'what': {
                        'render_document': {
                            'plugin': 'infohub_doc',
                            'type': 'document',
                            'document': 'main', // @todo Get the real document name
                        },
                    },
                    'how': {
                        'mode': 'one box',
                        'text': '[render_document]',
                    },
                    'where': {
                        'box_id': _GetBoxId('document'),
                        'max_width': 100,
                        'scroll_to_box_id': 'true',
                    },
                },
                'data_back': {
                    'step': 'step_end',
                },
            });
        }

        return {
            'answer': $in.response.answer,
            'message': $in.response.message,
            'ok': $in.response.ok,
        };
    };

}

//# sourceURL=infohub_doc_visited.js