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
function infohub_doc() {

    "use strict";

// include "infohub_base.js"

    const _Version = function () {
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
            'recommended_security_group': 'user'
        };
    };

    const _GetCmdFunctions = function () {
        return {
            'create': 'normal',
            'setup_gui': 'normal',
            'click_link': 'normal',
            'event_message': 'normal',
            'call_server': 'normal',
            'get_all_documents': 'normal'
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

    $functions.push("_GetBoxId");
    const _GetBoxId = function() {
        return 'main.body.' + _GetClassName();
    };

    /**
     * Used when you want to render a markdown document in any box.
     * Can also render an index list or navigation list or visited list.
     * @version 2019-03-14
     * @since   2019-03-14
     * @author  Peter Lembke
     */
    $functions.push("create");
    const create = function ($in)
    {
        const $default = {
            'type': 'document', // navigate, visited, index, document
            'area': 'main',
            'document_name': 'main',
            'alias': '',
            'original_alias': '',
            'step': 'step_call_child',
            'html': '',
            'css_data': {},
            'response': {
                'answer': 'false',
                'message': 'nothing to report from infohub_doc->create',
                'data': {},
                'html': ''
            }
        };
        $in = _Merge($default, $in);

        if ($in.step === 'step_call_child')
        {
            delete $in.step;
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_doc_' + $in.type,
                    'function': 'create'
                },
                'data': $in,
                'data_back': {
                    'step': 'step_final',
                    'alias': $in.alias,
                    'type': $in.type
                }
            });
        }

        if ($in.step === 'step_final') {
            if (_Empty($in.alias) === 'false') {
                // All IDs become unique by inserting the parent alias in each ID.
                const $find = '{box_id}';
                const $replace = $find + '_' + $in.alias;
                $in.html = $in.html.replace(new RegExp($find, 'g'), $replace);
            }
        }

        return {
            'answer': $in.response.answer,
            'message': $in.response.message,
            'html': $in.html,
            'css_data': $in.css_data
        };
    };

    /**
     * Setup the Workbench Graphical User Interface
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
            'response': {
                'answer': '',
                'message': '',
                'data': {}
            }
        };
        $in = _Merge($default, $in);

        let $messages = [];

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
                            'box_alias': 'navigate',
                            'max_width': 0,
                            'box_data': 'The document names list will render here'
                        },
                        {
                            'parent_box_id': $in.box_id,
                            'box_position': 'last',
                            'box_mode': 'data',
                            'box_alias': 'index',
                            'max_width': 0,
                            'box_data': 'The document index will render here'
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
                            'box_data': 'The document will render here'
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

        if ($in.step === 'step_get_translations_response')
        {
            $classTranslations = _ByVal($in.response.data);
            $in.step = 'step_render';
        }

        if ($in.step === 'step_render')
        {
            let $messageOut = _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_doc_navigate',
                    'function': 'setup_gui'
                },
                'data': {
                    'subtype': 'navigate',
                    'parent_box_id': $in.box_id,
                    'translations': $classTranslations
                },
                'data_back': {
                    'box_id': $in.box_id,
                    'step': 'step_end'
                }
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
                    'function': 'setup_gui'
                },
                'data': {
                    'subtype': 'index',
                    'parent_box_id': $in.box_id,
                    'translations': $classTranslations
                },
                'data_back': {
                    'box_id': $in.box_id,
                    'step': 'step_end'
                }
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
            'messages': $messages
        };

    };

    /**
     * When you click a navigation link in the markdown text you end up here.
     * We will now render the right document.
     * @version 2019-08-18
     * @since 2019-08-18
     * @author Peter Lembke
     */
    $functions.push("click_link");
    const click_link = function ($in)
    {
        const $default = {
            'event_data': '', // area,document_name
            'box_id': '',
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

        if (_Empty($in.event_data) === 'true') {
            $in.step = 'step_end';
            $in.response.message = 'Event_data is empty. I can not continue.';
        }

        if ($in.step === 'step_start')
        {
            const $parts = $in.event_data.split(',');
            const $area = $parts[0];
            const $docName = $parts[1];

            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_doc_document',
                    'function': 'view_document'
                },
                'data': {
                    'area': $area,
                    'document_name': $docName
                },
                'data_back': {
                    'event_data': $in.event_data,
                    'area': $area,
                    'document_name': $docName,
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
     * All events to infohub_doc comes here and are distributed
     * to the right child and the right click function.
     * @version 2019-06-08
     * @since 2019-03-13
     * @author Peter Lembke
     */
    $functions.push("event_message");
    const event_message = function ($in)
    {
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
                'ok': 'false'
            }
        };
        $in = _Default($default, $in);

        if (_Empty($in.event_data) === 'true') {
            $in.step = 'step_end';
            $in.response.message = 'Event_data is empty. I can not continue.';
        }

        if ($in.step === 'step_start')
        {
            const $parts = $in.event_data.split('|');
            const $childName = $parts[0];
            const $functionName = $parts[1];

            const $className = _GetClassName();

            if ($childName.indexOf($className + '_') !== 0) {
                return {
                    'answer': 'false',
                    'message': 'Only a child to ' + $className + ' can get events',
                    'ok': 'false'
                };
            }

            if ($functionName.indexOf('click_') !== 0) {
                return {
                    'answer': 'false',
                    'message': 'Function name ' + $functionName + ' is not valid it must start with click_',
                    'ok': 'false'
                };
            }

            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': $childName,
                    'function': $functionName
                },
                'data': {
                    'event_data': $in.event_data,
                    'value': $in.value,
                    'box_id': $in.box_id,
                    'id': $in.id,
                    'area': $in.area,
                    'document_name': $in.document_name,
                    'parent_id': $in.parent_id
                },
                'data_back': {
                    'event_data': $in.event_data,
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
     * Calls the server with the same plugin name as this plugin, and the function name you choose.
     * Children can talk to level1 plugins on the same node.
     * When you need data from other nodes then any level1 plugin must help getting that.
     * @version 2019-03-13
     * @since 2019-03-13
     * @author Peter Lembke
     */
    $functions.push("call_server");
    const call_server = function ($in)
    {
        const $default = {
            'step': 'step_start',
            'to': {'function': ''},
            'data': {},
            'response': {},
            'from_plugin': {
                'node': '',
                'plugin': ''
            }
        };
        $in = _Default($default, $in);

        const $className = _GetClassName();

        if ($in.step === 'step_start')
        {
            if ($in.from_plugin.node !== 'client') {
                return {
                    'answer': 'false',
                    'message': 'Only plugins from the client node can call this function'
                };
            }

            if ($in.from_plugin.plugin.indexOf($className + '_') !== 0) {
                return {
                    'answer': 'false',
                    'message': 'Only children to ' + $className + ' can call this function'
                };
            }

            return _SubCall({
                'to': {
                    'node': 'server',
                    'plugin': $className,
                    'function': $in.to.function
                },
                'data': $in.data,
                'data_back': {
                    'step': 'step_end'
                }
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
    $functions.push("get_all_documents");
    const get_all_documents = function ($in)
    {
        const $default = {
            'step': 'step_start',
            'response': {}
        };
        $in = _Default($default, $in);

        if ($in.step === 'step_start')
        {
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_doc_get',
                    'function': 'get_all_documents'
                },
                'data_back': {
                    'step': 'step_end'
                }
            });
        }

        return $in.response;
    };
}
//# sourceURL=infohub_doc.js