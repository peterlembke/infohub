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
function infohub_demo_tabs() {

    "use strict";

// include "infohub_base.js"

    const _Version = function () {
        return {
            'date': '2019-03-28',
            'since': '2018-05-15',
            'version': '1.0.0',
            'checksum': '{{checksum}}',
            'class_name': 'infohub_demo_tabs',
            'note': 'Collection of demos to demonstrate InfoHub Client Render and View',
            'status': 'normal',
            'SPDX-License-Identifier': 'GPL-3.0-or-later'
        };
    };

    const _GetCmdFunctions = function () {
        const $list = {
            'create': 'normal'
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

    // ***********************************************************
    // * your class functions below, only declare with var
    // * Can only be reached trough cmd()
    // ***********************************************************

    /**
     * Get instructions and create the message to InfoHub View
     * @version 2016-10-16
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
                'message': 'Nothing to report'
            },
            'data_back': {
                'box_id': ''
            }
        };
        $in = _Default($default, $in);

        if ($in.step === 'step_start')
        {
            $classTranslations = $in.translations;
            
            const $exampleContent = {
                'what': {
                    'image_example': {
                        'type': 'common',
                        'subtype': 'image',
                        'data': '[image_example_asset]',
                        'class': 'image'
                    },
                    'image_example_asset': {
                        'plugin': 'infohub_asset',
                        'type': 'image',
                        'subtype': 'jpeg',
                        'asset_name': 'common/con00004',
                        'plugin_name': 'infohub_demo'
                    }
                },
                'how': {
                    'text': '[image_example]'
                },
                'cache_key': 'tab7'
            };

            const $tabs = [
                {'alias': 'gui', 'label': 'Tab 1' }, // alias must be a single word here.
                {'alias': 'doc', 'label': 'Tab 2' },
                {'alias': 'config', 'label': 'Tab 3' },
                {'alias': 'version', 'label': 'Tab 4' },
                {'alias': 'license', 'label': 'Tab 5' },
                {'alias': 'test', 'label': 'Tab 6' },
                {'alias': 'stat', 'label': 'Tab 7', 'content': $exampleContent },
                {'alias': 'translation', 'label': 'Tab 8' },
                {'alias': 'close', 'label': 'Tab 9' }
            ];

            const $boxId = $in.parent_box_id + '.demo';

            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_tabs',
                    'function': 'setup_full_tab_system'
                },
                'data': {
                    'parent_box_id': $boxId,
                    'tabs': $tabs,
                    'highlight_tab_alias': 'stat'
                },
                'data_back': {
                    'step': 'step_scroll',
                    'box_id': $boxId,
                }
            });
        }
        
        if ($in.step === 'step_scroll') {
            
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_view',
                    'function': 'scroll_to_box_id'
                },
                'data': {
                    'box_id': $in.data_back.box_id
                },
                'data_back': {
                    'step': 'step_end'
                }
            });
        }

        return {
            'answer': $in.response.answer,
            'message': $in.response.message,
        };
    };
}
//# sourceURL=infohub_demo_tabs.js