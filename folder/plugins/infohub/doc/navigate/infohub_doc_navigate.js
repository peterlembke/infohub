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
function infohub_doc_navigate() {

    'use strict';

// include "infohub_base.js"

    const _Version = function() {
        return {
            'date': '2019-06-08',
            'since': '2019-04-13',
            'version': '1.0.0',
            'checksum': '{{checksum}}',
            'class_name': 'infohub_doc_navigate',
            'note': 'Render navigation and handle click events on the list',
            'status': 'normal',
            'SPDX-License-Identifier': 'GPL-3.0-or-later',
            'title': 'Navigate',
        };
    };

    const _GetCmdFunctions = function() {
        const $list = {
            'setup_gui': 'normal',
            'click_refresh': 'normal',
            'click_document_name': 'normal',
            'view_navigation': 'normal',
        };

        return _GetCmdFunctionsBase($list);
    };

    let $classTranslations = {};

    // ***********************************************************
    // * your class functions below, only declare with var
    // * Can only be reached trough cmd()
    // ***********************************************************

    $functions.push('_GetBoxId');
    const _GetBoxId = function($child) {

        if (_Empty($child) === 'true') {
            $child = 'navigate';
        }

        const $boxPath = 'main.body.infohub_doc.' + $child;

        return $boxPath;
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
    const setup_gui = function($in) {
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

            const $buttonLabel = _Translate('REFRESH_NAVIGATE');
            const $boxId = _GetBoxId('navigate');

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
                            'button_left_icon': '[refresh_icon]',
                            'button_label': $buttonLabel,
                            'event_data': 'infohub_doc_navigate|click_refresh',
                            'to_plugin': 'infohub_doc',
                            'to_function': 'event_message',
                        },
                        'refresh_icon': {
                            'type': 'common',
                            'subtype': 'svg',
                            'data': '[refresh_asset]',
                        },
                        'refresh_asset': {
                            'plugin': 'infohub_asset',
                            'type': 'icon',
                            'asset_name': 'refresh',
                            'plugin_name': 'infohub_doc',
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
                        'box_id': $boxId,
                        'max_width': 0,
                        'scroll_to_box_id': 'false',
                    },
                    'cache_key': 'navigate',
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
     * When you click the refresh button it gets the document list and view the document names in the navigation tree
     * @version 2019-05-29
     * @since 2019-05-29
     * @author Peter Lembke
     */
    $functions.push('click_refresh');
    const click_refresh = function($in) {
        const $default = {
            'box_id': '',
            'step': 'step_start',
            'data_back': {
                'step': '',
            },
            'response': {
                'answer': 'false',
                'message': 'There was an error',
                'data': {},
                'ok': 'false',
                'value': [], // All selected options in select lists
            },
        };

        $in = _Default($default, $in);

        if ($in.step === 'step_start') {
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_doc_get',
                    'function': 'get_documents_list',
                },
                'data': {},
                'data_back': {
                    'step': 'step_start_response',
                },
            });
        }

        if ($in.step === 'step_start_response') {
            $in.step = 'step_end';

            if ($in.response.answer === 'true') {
                $in.step = 'step_handle_documents_list';
            }
        }

        if ($in.step === 'step_handle_documents_list') {
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_doc_navigate',
                    'function': 'view_navigation',
                },
                'data': {
                    'data': $in.response.data,
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

    /**
     * When you click a document name from the navigation list
     * The navigation list handle its own links
     * @version 2019-06-08
     * @since 2019-04-14
     * @author Peter Lembke
     */
    $functions.push('click_document_name');
    const click_document_name = function($in) {
        const $default = {
            'box_id': '',
            'area': '',
            'document_name': '',
            'step': 'step_view_document',
            'response': {
                'answer': 'false',
                'message': 'There was an error',
                'document_data': {
                    'document': '',
                },
                'ok': 'false',
                'value': [], // All selected options in select lists
            },
        };

        $in = _Default($default, $in);

        if ($in.step === 'step_view_document') {
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_doc_document',
                    'function': 'view_document',
                },
                'data': {
                    'area': $in.area,
                    'document_name': $in.document_name,
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

    /**
     * Give documents list. Get a rendered tree
     * @version 2019-06-08
     * @since   2017-10-27
     * @author  Peter Lembke
     */
    $functions.push('view_navigation');
    const view_navigation = function($in) {
        const $default = {
            'data': {},
            'step': 'step_view',
            'response': {},
            'data_back': {
                'data': {},
            },
        };

        $in = _Default($default, $in);

        if ($in.step === 'step_view') {
            // Create option array with data for the advanced list
            let $option = [];

            for (let $area in $in.data) {
                if ($in.data.hasOwnProperty($area) === false) {
                    continue;
                }

                for (let $docName in $in.data[$area]) {
                    if ($in.data[$area].hasOwnProperty($docName) === false) {
                        continue;
                    }

                    const $pluginName = 'infohub_doc';
                    const $eventType = 'click';
                    const $containerId = '{box_id}_' + $area + '_' + $docName +
                        '.link';

                    const $onClickParameters = '\'' + $pluginName + '\',' +
                        '\'' +
                        $eventType + '\',' + '\'' + $containerId + '\'';
                    const $onClick = 'onclick="go(' + $onClickParameters +
                        ')" ';

                    const $idData = 'id="' + $containerId + '" area="' + $area +
                        '" document_name="' + $docName + '" ';

                    const $eventData = 'event_data="infohub_doc_navigate|click_document_name" ';

                    // In this case the event_message function will check what renderer you use and act on that.
                    const $otherParams = 'href="#header" class="link" renderer="infohub_doc" type="link" ';
                    // You can put any parameters you like in the string above and they will show up in the event_message function.

                    const $label = $in.data[$area][$docName].label;
                    const $html = '<a ' + $onClick + $idData + $eventData +
                        $otherParams + '>' + _Translate($label) + '</a>';

                    $option.push({
                        'label': $html,
                        'level': $area + '_' + $docName,
                    });
                }
            }

            const $headLabel = _Translate('NAVIGATION');
            const $boxId = _GetBoxId('navigate') + '.[list]';

            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_render',
                    'function': 'create',
                },
                'data': {
                    'what': {
                        'my_presentation_box': {
                            'plugin': 'infohub_rendermajor',
                            'type': 'presentation_box',
                            'head_label': $headLabel,
                            'foot_text': '',
                            'content_data': '[my_list]',
                        },
                        'my_list': {
                            'plugin': 'infohub_renderadvancedlist',
                            'type': 'advanced_list',
                            'subtype': 'list',
                            'option': $option,
                            'separator': '_',
                        },
                    },
                    'how': {
                        'mode': 'one box',
                        'text': '[my_presentation_box]',
                    },
                    'where': {
                        'box_id': $boxId,
                        'max_width': 320, // pixels
                    },
                },
                'data_back': {
                    'data': $in.data_back.data,
                    'step': 'step_check_if_data_is_old',
                },
            });

        }

        return {
            'answer': 'true',
            'message': 'View navigation is done',
            'ok': 'true',
        };
    };
}

//# sourceURL=infohub_doc_navigate.js