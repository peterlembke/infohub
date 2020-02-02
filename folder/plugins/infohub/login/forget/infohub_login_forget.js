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
function infohub_login_forget() {

// include "infohub_base.js"

    /*jshint evil:true */
    /*jshint devel:true */
    /*jslint browser: true, evil: true, plusplus: true, todo: true */

    const _Version = function() {
        return {
            'date': '2019-09-14',
            'since': '2019-09-14',
            'version': '1.0.0',
            'checksum': '{{checksum}}',
            'class_name': 'infohub_login_forget',
            'note': 'Forget the contact data that might exist in the storage',
            'status': 'normal',
            'license_name': 'GNU GPL 3 or later'
        };
    };

    const _GetCmdFunctions = function() {
        return {
            'create': 'normal',
            'click_forget': 'normal'
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

    /**
     * These fields is what a contact need
     * @version 2019-09-04
     * @since 2019-09-04
     * @author Peter Lembke
     */
    $functions.push("_SetDefaultNodeData");
    const _SetDefaultNodeData = function ($nodeData)
    {
        "use strict";

        const $default = {
            'node': '',
            'note': '',
            'domain_address': '',
            'user_name': '',
            'shared_secret': '',
            'plugin_names': []
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
        "use strict";

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
                        'container_forget': {
                            'plugin': 'infohub_rendermajor',
                            'type': 'presentation_box',
                            'head_label': _Translate('Forget contact'),
                            'foot_text': _Translate('Here you can let the browser forget the contact data. You can always import your file again.'),
                            'content_data': '[button_forget]'
                        },
                        'button_forget': {
                            'plugin': 'infohub_renderform',
                            'type': 'button',
                            'mode': 'button',
                            'button_label': _Translate('Forget'),
                            'event_data': 'forget|forget',
                            'to_plugin': 'infohub_login',
                            'to_function': 'click'
                        }
                    },
                    'how': {
                        'mode': 'one box',
                        'text': '[container_forget]'
                    },
                    'where': {
                        'box_id': 'main.body.infohub_login.form', // 'box_id': $in.parent_box_id + '.form',
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
            'message': $in.response.message
        };
    };

    /**
     * You clicked the button to import contact data
     * @version 2019-09-03
     * @since 2019-09-03
     * @author Peter Lembke
     */
    $functions.push("click_forget");
    const click_forget = function ($in)
    {
        "use strict";

        const $default = {
            'box_id': '',
            'step': 'step_save_data_in_storage',
            'answer': 'true',
            'message': 'Done',
            'ok': 'false'
        };
        $in = _Default($default, $in);

        let $nodeData = {};

        if ($in.step === 'step_save_data_in_storage')
        {
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_login_contact',
                    'function': 'storage_forget_contact_data'
                },
                'data': {},
                'data_back': {
                    'step': 'step_save_data_in_storage_response',
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
//# sourceURL=infohub_login_forget.js