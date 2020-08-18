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
function infohub_login_import() {

    "use strict";

// include "infohub_base.js"

    const _Version = function() {
        return {
            'date': '2019-09-03',
            'since': '2019-09-03',
            'version': '1.0.0',
            'checksum': '{{checksum}}',
            'class_name': 'infohub_login_import',
            'note': 'Import contact data to local storage',
            'status': 'normal',
            'SPDX-License-Identifier': 'GPL-3.0-or-later'
        };
    };

    const _GetCmdFunctions = function() {
        const $list = {
            'create': 'normal',
            'click_import': 'normal'
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
        if (typeof $classTranslations !== 'object') {
            return $string;
        }

        return _GetData({
            'name': _GetClassName() + '|' + $string,
            'default': $string, 'data': $classTranslations, 'split': '|'
        });
    };

    /**
     * These fields is what a contact need
     * @version 2019-09-04
     * @since 2019-09-04
     * @author Peter Lembke
     */
    $functions.push("_SetDefaultNodeData");
    const _SetDefaultNodeData = function ($nodeData)
    {
        const $default = {
            'node': '',
            'note': '',
            'domain_address': '',
            'user_name': '',
            'shared_secret': '',
            'role_list': [],
            'has_password': 'false'
        };
        $nodeData = _Default($default, $nodeData);

        return $nodeData;
    };

    // ***********************************************************
    // * your class functions below, only declare with var
    // * Can only be reached trough cmd()
    // ***********************************************************

    /**
     * Get instructions and create the message to InfoHub View
     * @version 2019-09-03
     * @since   2019-09-03
     * @author  Peter Lembke
     */
    $functions.push('create');
    const create = function ($in)
    {
        const $default = {
            'subtype': 'menu',
            'parent_box_id': '',
            'translations': {},
            'step': 'step_render',
            'response': {
                'answer': 'false',
                'message': ''
            }
        };
        $in = _Default($default, $in);

        if ($in.step === 'step_render') {
            $classTranslations = $in.translations;
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_render',
                    'function': 'create'
                },
                'data': {
                    'what': {
                        'container_import': {
                            'type': 'common',
                            'subtype': 'container',
                            'tag': 'div',
                            'data': '[form_password]',
                            'class': 'container-small'
                        },
                        'form_password': {
                            'plugin': 'infohub_renderform',
                            'type': 'form',
                            'content': '[my_file_selector]',
                            'label': _Translate('Import'),
                            'description': _Translate('Import the contact information from file')
                        },
                        'my_file_selector': {
                            'plugin': 'infohub_renderform',
                            'type': 'file',
                            'button_label': _Translate('Select file'),
                            'accept': '*.json',
                            'event_data': 'import|import',
                            'to_node': 'client',
                            'to_plugin': 'infohub_login',
                            'to_function': 'click'
                        },
                    },
                    'how': {
                        'mode': 'one box',
                        'text': '[container_import]'
                    },
                    'where': {
                        'box_id': 'main.body.infohub_login.form', // 'box_id': $in.parent_box_id + '.form',
                        'max_width': 100,
                        'scroll_to_box_id': 'true'
                    },
                    'cache_key': 'import'
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
     * You clicked the button to import contact data
     * @version 2019-09-03
     * @since 2019-09-03
     * @author Peter Lembke
     */
    $functions.push("click_import");
    const click_import = function ($in)
    {
        const $default = {
            'box_id': '',
            'step': 'step_file_read_response',
            'answer': 'true',
            'message': 'Done',
            'files_data': [],
            'ok': 'false',
            'node_data': {}
        };
        $in = _Default($default, $in);

        let $nodeData = {};

        if ($in.step === 'step_file_read_response')
        {
            $in.step = 'step_check_if_json';
            if ($in.files_data.length !== 1) {
                $in.message = 'One file must be selected';
                $in.step = 'step_end';
            }
        }

        if ($in.step === 'step_check_if_json')
        {
            $in.step = 'step_check_host';

            $nodeData = $in.files_data[0].content;

            if (typeof $nodeData !== 'object') {
                $in.message = 'This is not a json file';
                $in.step = 'step_end';
            }
        }

        if ($in.step === 'step_check_host')
        {
            $in.step = 'step_save_data_in_storage';

            const $fileHost = $nodeData.domain_address;
            const $browserHost = location.host;

            if ($fileHost !== $browserHost) {
                const $message = 'The file host "%s" is not the same as the browser host "%s"';
                $in.message = _SprintF($message, [$fileHost, $browserHost]);
                $in.step = 'step_end';
            }
        }

        if ($in.step === 'step_save_data_in_storage')
        {
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_login_contact',
                    'function': 'storage_write_contact_data'
                },
                'data': {
                    'data': $nodeData
                },
                'data_back': {
                    'step': 'step_save_data_in_storage_response',
                    'node_data': $nodeData
                }
            });

        }

        if ($in.step === 'step_save_data_in_storage_response')
        {
            $in.step = 'step_end';
            if ($in.answer === 'true') {
                $in.ok = 'true';
                $in.step = 'step_show_information';
            }
        }

        if ($in.step === 'step_show_information')
        {
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_login_contact',
                    'function': 'view_contact'
                },
                'data': {},
                'data_back': {
                    'step': 'step_show_information_response'
                }
            });
        }

        if ($in.step === 'step_show_information_response')
        {
            $in.step = 'step_end';
            if ($in.answer === 'true') {
                $in.ok = 'true';
            }
        }

        return {
            'answer': $in.answer,
            'message': $in.message,
            'ok': $in.ok
        };
    };
}
//# sourceURL=infohub_login_import.js