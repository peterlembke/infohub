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
function infohub_welcome() {

    "use strict";

// include "infohub_base.js"

    const _Version = function() {
        return {
            'date': '2018-09-09',
            'since': '2018-09-09',
            'version': '1.0.0',
            'checksum': '{{checksum}}',
            'class_name': 'infohub_welcome',
            'note': 'Configuration editor for your local browser configuration',
            'status': 'normal',
            'SPDX-License-Identifier': 'GPL-3.0-or-later',
            'title': 'Config',
            'user_role': 'user'
        };
    };

    const _GetCmdFunctions = function() {
        const $list = {
            'startup': 'normal',
            'setup_gui': 'normal',
            'click_menu': 'normal'
        };

        return _GetCmdFunctionsBase($list);
    };

    const _GetPluginName = function($data)
    {
        let $pluginType = 'welcome';
        const $tmp = $data.split("_");

        if (_IsSet($tmp[0]) === 'true') {
            $pluginType = $tmp[0];
        }

        return 'infohub_welcome_' + $pluginType;
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
     * Setup the Config Graphical User Interface
     * @version 2018-09-09
     * @since   2018-09-09
     * @author  Peter Lembke
     */
    $functions.push('setup_gui');
    const setup_gui = function ($in)
    {
        const $default = {
            'box_id': '',
            'step': 'step_start'
        };
        $in = _Merge($default, $in);

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
                    'step': 'step_get_translations'
                }
            });
        }
        
        if ($in.step === 'step_get_translations')
        {
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

        if ($in.step === 'step_get_translations_response') {            
            $classTranslations = _ByVal($in.response.data);
            $in.step = 'step_boxes_insert';
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
                            'box_alias': 'menu',
                            'max_width': 320,
                            'box_data': 'The menu will render here'
                        },
                        {
                            'parent_box_id': $in.box_id,
                            'box_position': 'last',
                            'box_mode': 'data',
                            'box_alias': 'form',
                            'max_width': 100, // 100 will be translated to 100%
                            'box_data': 'Use the menu'
                        }
                    ]
                },
                'data_back': {
                    'box_id': $in.box_id,
                    'step': 'step_menu'
                }
            });
        }

        if ($in.step === 'step_menu')
        {
            const $messageOut = _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_welcome_welcome',
                    'function': 'create'
                },
                'data': {
                    'parent_box_id': $in.box_id,
                    'translations': $classTranslations
                },
                'data_back': {
                    'step': 'step_end'
                }
            });

            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_welcome_menu',
                    'function': 'create'
                },
                'data': {
                    'parent_box_id': $in.box_id,
                    'translations': $classTranslations
                },
                'data_back': {
                    'box_id': $in.box_id,
                    'step': 'step_end'
                },
                'messages': [$messageOut]
            });
        }

        return {
            'answer': 'true',
            'message': 'plugin GUI is done'
        };

    };

    /**
     * Handle the menu clicks
     * @version 2019-03-13
     * @since 2018-09-26
     * @author Peter Lembke
     */
    $functions.push("click_menu");
    const click_menu = function ($in)
    {
        const $default = {
            'step': 'step_start',
            'event_data': '',
            'parent_box_id': ''
        };
        $in = _Default($default, $in);

        if ($in.step === 'step_start')
        {
            const $pluginName = _GetPluginName($in.event_data);
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': $pluginName,
                    'function': 'create'
                },
                'data': {
                    'subtype': $in.event_data,
                    'parent_box_id': $in.parent_box_id,
                    'translations': $classTranslations
                },
                'data_back': {
                    'step': 'step_end'
                }
            });
        }

        return {
            'answer': 'true',
            'message': 'Menu click done'
        };
    };
}
//# sourceURL=infohub_welcome.js