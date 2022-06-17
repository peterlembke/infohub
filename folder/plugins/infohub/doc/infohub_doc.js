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
function infohub_doc() {

    'use strict';

// include "infohub_base.js"

    const _Version = function() {
        return {
            'date': '2019-04-13',
            'since': '2019-04-13',
            'version': '1.0.0',
            'checksum': '{{checksum}}',
            'class_name': 'infohub_doc',
            'note': 'Show markdown doc files from the plugins and the doc folder',
            'status': 'normal',
            'SPDX-License-Identifier': 'GPL-3.0-or-later',
            'title': 'Documentation',
            'user_role': 'user',
            'web_worker': 'true',
            'core_plugin': 'false',
        };
    };

    const _GetCmdFunctions = function() {
        const $list = {
            'create': 'normal',
            'setup_gui': 'normal',
            'click_link': 'normal',
            'event_message': 'normal',
            'call_server': 'normal',
            'get_all_documents': 'normal',
            'render_doc': 'normal'
        };

        return _GetCmdFunctionsBase($list);
    };

    let $classTranslations = {};

    // ***********************************************************
    // * your class functions below, only declare with var
    // * Can only be reached through cmd()
    // ***********************************************************

    $functions.push('_GetBoxId');
    const _GetBoxId = function() {
        return 'main.body.' + _GetClassName();
    };

    $functions.push('create');
    /**
     * Get the raw data for the Markdown doc file.
     * Used by infohub_tree_doc to render the documentation
     * @version 2021-03-14
     * @since   2019-03-14
     * @author  Peter Lembke
     * @param $in
     * @returns {{item_index: {}, answer: string, message: string}}
     */
    const create = function($in = {}) {
        const $default = {
            'item_index': {},
            'config': {},
            'data_back': {
                'item_name': '',
                'item_index_done': {},
                'item_index_contents': {},
            },
            'response': {},
            'step': 'step_get_doc_file',
        };
        $in = _Default($default, $in);

        if ($in.step === 'step_get_doc_file_response') {
            const $defaultResponse = {
                'answer': 'false',
                'message': '',
                'contents': '',
            };
            const $response = _Default($defaultResponse, $in.response);

            const $itemName = $in.data_back.item_name;
            $in.data_back.item_index_contents[$itemName] = {
                'type': 'document',
                'text': $response.contents,
            };
            $in.step = 'step_get_doc_file';
        }

        if ($in.step === 'step_get_doc_file') {
            if (_Count($in.item_index) > 0) {
                const $itemData = _Pop($in.item_index);
                const $itemName = $itemData.key;
                let $data = $itemData.data;
                $in.item_index = $itemData.object;

                const $defaultItem = {
                    'type': '',
                    'alias': '',
                };
                $data = _Merge($defaultItem, $data);

                return _SubCall({
                    'to': {
                        'node': 'server',
                        'plugin': 'infohub_tree',
                        'function': 'get_doc_file',
                    },
                    'data': {
                        'file': $data.type,
                    },
                    'data_back': {
                        'step': 'step_get_doc_file_response',
                        'item_index': $in.item_index,
                        'item_name': $itemName,
                        'item_index_done': $in.data_back.item_index_done,
                    },
                });
            }
            $in.step = 'step_render_files';
        }

        if ($in.step === 'step_render_files') {
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_renderdocument',
                    'function': 'create',
                },
                'data': {
                    'item_index': $in.data_back.item_index_contents,
                },
                'data_back': {
                    'step': 'step_render_files_response',
                },
            });
        }

        if ($in.step === 'step_render_files_response') {
            const $defaultResponse = {
                'answer': 'false',
                'message': '',
                'item_index': {},
            };
            const $response = _Default($defaultResponse, $in.response);
            $in.data_back.item_index_done = $response.item_index;
        }

        return {
            'answer': 'true',
            'message': 'Here is what I rendered',
            'item_index': $in.data_back.item_index_done,
        };
    };

    /**
     * Set up the Workbench Graphical User Interface
     * @version 2019-04-14
     * @since   2019-04-14
     * @author  Peter Lembke
     */
    $functions.push('setup_gui');
    const setup_gui = function($in = {}) {
        const $default = {
            'box_id': '',
            'step': 'step_start',
            'response': {
                'answer': '',
                'message': '',
                'data': {},
            },
        };
        $in = _Merge($default, $in);

        let $messages = [];

        if ($in.step === 'step_start') {
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_view',
                    'function': 'box_mode',
                },
                'data': {
                    'box_id': $in.box_id,
                    'box_mode': 'side',
                    'digits': '2',
                },
                'data_back': {
                    'box_id': $in.box_id,
                    'step': 'step_boxes_insert',
                },
            });
        }

        if ($in.step === 'step_boxes_insert') {
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_view',
                    'function': 'boxes_insert_detailed',
                },
                'data': {
                    'items': [
                        {
                            'parent_box_id': $in.box_id,
                            'box_position': 'last',
                            'box_mode': 'data',
                            'box_alias': 'navigate',
                            'max_width': 0,
                            'box_data': 'The document names list will render here',
                        },
                        {
                            'parent_box_id': $in.box_id,
                            'box_position': 'last',
                            'box_mode': 'data',
                            'box_alias': 'index',
                            'max_width': 0,
                            'box_data': 'The document index will render here',
                        },
                        /*
                        {
                            'parent_box_id': $in.box_id,
                            'box_position': 'last',
                            'box_mode': 'data',
                            'box_alias': 'visited',
                            'max_width': 0,
                            'box_data': 'The visited documents list will render here'
                        },
                        */
                        {
                            'parent_box_id': $in.box_id,
                            'box_position': 'last',
                            'box_mode': 'data',
                            'box_alias': 'document',
                            'max_width': 0,
                            'box_data': 'The document will render here',
                        },
                    ],
                },
                'data_back': {
                    'box_id': $in.box_id,
                    'step': 'step_get_translations',
                },
            });
        }

        if ($in.step === 'step_get_translations') {
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_translate',
                    'function': 'get_translate_data',
                },
                'data': {},
                'data_back': {
                    'box_id': $in.box_id,
                    'step': 'step_get_translations_response',
                },
            });
        }

        if ($in.step === 'step_get_translations_response') {
            $classTranslations = _ByVal($in.response.data);
            $in.step = 'step_render';
        }

        if ($in.step === 'step_render') {
            let $messageOut = _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_doc_navigate',
                    'function': 'setup_gui',
                },
                'data': {
                    'subtype': 'navigate',
                    'parent_box_id': $in.box_id,
                    'translations': $classTranslations,
                },
                'data_back': {
                    'box_id': $in.box_id,
                    'step': 'step_end',
                },
            });
            $messages.push($messageOut);

            /*
            $messageOut = _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_doc_document',
                    'function': 'setup_gui'
                },
                'data': {
                    'subtype': 'document',
                    'parent_box_id': $in.box_id,
                    'translations': $classTranslations
                },
                'data_back': {
                    'box_id': $in.box_id,
                    'step': 'step_end'
                }
            });
            $messages.push($messageOut);
            */

            $messageOut = _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_doc_index',
                    'function': 'setup_gui',
                },
                'data': {
                    'subtype': 'index',
                    'parent_box_id': $in.box_id,
                    'translations': $classTranslations,
                },
                'data_back': {
                    'box_id': $in.box_id,
                    'step': 'step_end',
                },
            });
            $messages.push($messageOut);

            /*
            $messageOut = _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_doc_visited',
                    'function': 'setup_gui'
                },
                'data': {
                    'subtype': 'visited',
                    'parent_box_id': $in.box_id,
                    'translations': $classTranslations
                },
                'data_back': {
                    'box_id': $in.box_id,
                    'step': 'step_end'
                }
            });
            $messages.push($messageOut);
            */

        }

        return {
            'answer': 'true',
            'message': 'plugin GUI is done',
            'messages': $messages,
        };

    };

    /**
     * When you click a navigation link in the Markdown text you end up here.
     * We will now render the right document.
     * @version 2019-08-18
     * @since 2019-08-18
     * @author Peter Lembke
     */
    $functions.push('click_link');
    const click_link = function($in = {}) {
        const $default = {
            'event_data': '', // area,document_name
            'box_id': '',
            'area': '',
            'document_name': '',
            'step': 'step_start',
            'response': {
                'answer': 'false',
                'message': 'There was an error',
                'ok': 'false',
            },
        };
        $in = _Default($default, $in);

        if (_Empty($in.event_data) === 'true') {
            $in.step = 'step_end';
            $in.response.message = 'Event_data is empty. I can not continue.';
        }

        if ($in.step === 'step_start') {
            const $parts = $in.event_data.split(',');
            const $area = $parts[0];
            const $documentName = $parts[1];

            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_doc_document',
                    'function': 'view_document',
                },
                'data': {
                    'area': $area,
                    'document_name': $documentName,
                },
                'data_back': {
                    'event_data': $in.event_data,
                    'area': $area,
                    'document_name': $documentName,
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
     * All events to infohub_doc comes here and are distributed
     * to the right child and the right click function.
     * @version 2019-06-08
     * @since 2019-03-13
     * @author Peter Lembke
     */
    $functions.push('event_message');
    const event_message = function($in = {}) {
        const $default = {
            'event_data': '', // full_child_name|full_child_function_name
            'value': '', // Selected option in select lists
            'box_id': '',
            'id': '',
            'area': '',
            'document_name': '',
            'parent_id': '',
            'step': 'step_start',
            'response': {
                'answer': 'false',
                'message': 'There was an error',
                'ok': 'false',
            },
        };
        $in = _Default($default, $in);

        if (_Empty($in.event_data) === 'true') {
            $in.step = 'step_end';
            $in.response.message = 'Event_data is empty. I can not continue.';
        }

        if ($in.step === 'step_start') {
            const $parts = $in.event_data.split('|');
            const $childName = $parts[0];
            const $functionName = $parts[1];

            const $className = _GetClassName();

            if ($childName.indexOf($className + '_') !== 0) {
                return {
                    'answer': 'false',
                    'message': 'Only a child to ' + $className + ' can get events',
                    'ok': 'false',
                };
            }

            if ($functionName.indexOf('click_') !== 0) {
                return {
                    'answer': 'false',
                    'message': 'Function name ' + $functionName + ' is not valid it must start with click_',
                    'ok': 'false',
                };
            }

            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': $childName,
                    'function': $functionName,
                },
                'data': {
                    'event_data': $in.event_data,
                    'value': $in.value,
                    'box_id': $in.box_id,
                    'id': $in.id,
                    'area': $in.area,
                    'document_name': $in.document_name,
                    'parent_id': $in.parent_id,
                },
                'data_back': {
                    'event_data': $in.event_data,
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
     * Calls the server with the same plugin name as this plugin, and the function name you choose.
     * Children can talk to level1 plugins on the same node.
     * When you need data from other nodes then any level1 plugin must help to get that.
     * @version 2019-03-13
     * @since 2019-03-13
     * @author Peter Lembke
     */
    $functions.push('call_server');
    const call_server = function($in = {}) {
        const $default = {
            'step': 'step_start',
            'to': {'function': ''},
            'data': {},
            'response': {},
            'from_plugin': {
                'node': '',
                'plugin': '',
            },
        };
        $in = _Default($default, $in);

        const $className = _GetClassName();

        if ($in.step === 'step_start') {
            if ($in.from_plugin.node !== 'client') {
                return {
                    'answer': 'false',
                    'message': 'Only plugins from the client node can call this function',
                };
            }

            if ($in.from_plugin.plugin.indexOf($className + '_') !== 0) {
                return {
                    'answer': 'false',
                    'message': 'Only children to ' + $className + ' can call this function',
                };
            }

            return _SubCall({
                'to': {
                    'node': 'server',
                    'plugin': $className,
                    'function': $in.to.function,
                },
                'data': $in.data,
                'data_back': {
                    'step': 'step_end',
                },
            });
        }

        return $in.response;
    };

    /**
     * Call the child "get" and let it download all documents.
     * This function is mainly used by infohub_offline to prepare you for going offline
     * @version 2019-10-17
     * @since 2019-10-17
     * @author Peter Lembke
     */
    $functions.push('get_all_documents');
    const get_all_documents = function($in = {}) {
        const $default = {
            'step': 'step_start',
            'response': {},
        };
        $in = _Default($default, $in);

        if ($in.step === 'step_start') {
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_doc_get',
                    'function': 'get_all_documents',
                },
                'data_back': {
                    'step': 'step_end',
                },
            });
        }

        return $in.response;
    };

    /**
     * Render a documentation in your box id.
     * Give the name of a plugin documentation file. Exclude the .md
     * Give a box_id where to render the documentation.
     *
     * @version 2021-08-12
     * @since   2019-03-14
     * @author  Peter Lembke
     */
    $functions.push('render_doc'); // Enable this function
    const render_doc = function($in = {}) {
        const $default = {
            'file_name': '', // Example: 'infohub_translate_updatefile'
            'box_id': '', // Example: 'main.body.infohub_translate.form.[container_doc]'
            'step': 'step_start',
            'response': {
                'answer': 'false',
                'message': 'Nothing to report from infohub_translate->render_doc',
                'document_data': {
                    'document': ''
                },
            }
        };
        $in = _Default($default, $in);

        if ($in.step === 'step_start') {
            $in.step = 'step_get_doc_file';
            if ($in.file_name === '') {
                $in.step = 'step_end';
            }
            if ($in.box_id === '') {
                $in.step = 'step_end';
            }
        }

        if ($in.step === 'step_get_doc_file') {
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_doc_get',
                    'function': 'get_document',
                },
                'data': {
                    'area': 'plugin', // main or plugin
                    'document_name': $in.file_name
                },
                'data_back': {
                    'step': 'step_get_doc_file_response',
                    'box_id': $in.box_id
                },
            });
        }

        if ($in.step === 'step_get_doc_file_response') {
            $in.step = 'step_end';
            if ($in.response.answer === 'true') {
                $in.step = 'step_render_markdown';
            }
        }

        if ($in.step === 'step_render_markdown') {
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_render',
                    'function': 'create',
                },
                'data': {
                    'what': {
                        'my_doc': {
                            'plugin': 'infohub_renderdocument',
                            'type': 'document',
                            'text': $in.response.document_data.document,
                        },
                    },
                    'how': {
                        'mode': 'one box',
                        'text': '[my_doc]',
                    },
                    'where': {
                        'box_id': $in.box_id,
                        'max_width': 960,
                        'scroll_to_box_id': 'true',
                    },
                },
                'data_back': {
                    'step': 'step_end'
                },
            });
        }

        return {
            'answer': $in.response.answer,
            'message': $in.response.message
        };
    };
}

//# sourceURL=infohub_doc.js