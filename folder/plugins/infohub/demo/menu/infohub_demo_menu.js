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
function infohub_demo_menu() {

    "use strict";

// include "infohub_base.js"

    const _Version = function() {
        return {
            'date': '2019-03-28',
            'since': '2018-04-15',
            'version': '2.0.0',
            'checksum': '{{checksum}}',
            'class_name': 'infohub_demo_menu',
            'note': 'Render a menu for infohub_demo',
            'status': 'normal',
            'SPDX-License-Identifier': 'GPL-3.0-or-later'
        };
    };

    const _GetCmdFunctions = function() {
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

    /**
     * Create a menu
     * @version 2019-03-27
     * @since   2016-10-16
     * @author  Peter Lembke
     */
    $functions.push('create');
    const create = function ($in)
    {
        const $default = {
            'subtype': 'menu',
            'parent_box_id': '',
            'translations': {},
            'step': 'step_start',
            'response': {
                'answer': 'false',
                'message': 'Nothing to report'
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
                        'titel': {
                            'type': 'common',
                            'subtype': 'value',
                            'data': _Translate('Demo Collection')
                        },
                        'my_menu': {
                            'plugin': 'infohub_rendermenu',
                            'type': 'menu',
                            'head_label': '[titel]',
                            'options': {
                                'text_demo': {
                                    'alias': 'text_demo_link',
                                    'event_data': 'text',
                                    'button_label': _Translate('Text demo'),
                                    'to_plugin': 'infohub_demo',
                                    'to_function': 'click_menu'
                                },
                                'common_demo': {
                                    'alias': 'common_demo_link',
                                    'event_data': 'common',
                                    'button_label': _Translate('Common objects demo'),
                                    'to_plugin': 'infohub_demo',
                                    'to_function': 'click_menu'
                                },
                                'svg_demo': {
                                    'alias': 'svg_demo_link',
                                    'event_data': 'svg',
                                    'button_label': _Translate('SVG rendering demo'),
                                    'to_plugin': 'infohub_demo',
                                    'to_function': 'click_menu'
                                },
                                'frog_demo': {
                                    'alias': 'frog_demo_link',
                                    'event_data': 'frog',
                                    'button_label': _Translate('You get a frog'),
                                    'to_plugin': 'infohub_demo',
                                    'to_function': 'click_menu'
                                },
                                'video_demo': {
                                    'alias': 'video_demo_link',
                                    'event_data': 'video',
                                    'button_label': _Translate('Video stream services'),
                                    'to_plugin': 'infohub_demo',
                                    'to_function': 'click_menu'
                                },
                                'audio_demo': {
                                    'alias': 'audio_demo_link',
                                    'event_data': 'audio',
                                    'button_label': _Translate('Audio stream services'),
                                    'to_plugin': 'infohub_demo',
                                    'to_function': 'click_menu'
                                },
                                'map_demo': {
                                    'alias': 'map_demo_link',
                                    'event_data': 'map',
                                    'button_label': _Translate('Map services'),
                                    'to_plugin': 'infohub_demo',
                                    'to_function': 'click_menu'
                                },
                                'link_demo': {
                                    'alias': 'link_demo_link',
                                    'event_data': 'link',
                                    'button_label': _Translate('Link - different kinds'),
                                    'to_plugin': 'infohub_demo',
                                    'to_function': 'click_menu'
                                },
                                'major_demo': {
                                    'alias': 'major_demo_link',
                                    'event_data': 'major',
                                    'button_label': _Translate('Presentation box'),
                                    'to_plugin': 'infohub_demo',
                                    'to_function': 'click_menu'
                                },
                                'advancedlist_demo': {
                                    'alias': 'advancedlist_demo_link',
                                    'event_data': 'advancedlist',
                                    'button_label': _Translate('Advanced list'),
                                    'to_plugin': 'infohub_demo',
                                    'to_function': 'click_menu'
                                },
                                'tabs_demo': {
                                    'alias': 'tabs_demo_link',
                                    'event_data': 'tabs',
                                    'button_label': _Translate('Tabs list'),
                                    'to_plugin': 'infohub_demo',
                                    'to_function': 'click_menu'
                                },
                                'form_demo': {
                                    'alias': 'form_demo_link',
                                    'event_data': 'form',
                                    'button_label': _Translate('Form - simple'),
                                    'to_plugin': 'infohub_demo',
                                    'to_function': 'click_menu'
                                },
                                'form2_demo': {
                                    'alias': 'form2_demo_link',
                                    'event_data': 'form2',
                                    'button_label': _Translate('Form - Advanced'),
                                    'to_plugin': 'infohub_demo',
                                    'to_function': 'click_menu'
                                },
                                'table_demo': {
                                    'alias': 'table_demo_link',
                                    'event_data': 'table',
                                    'button_label': _Translate('Table'),
                                    'to_plugin': 'infohub_demo',
                                    'to_function': 'click_menu'
                                },
                                'document_demo': {
                                    'alias': 'document_demo_link',
                                    'event_data': 'document',
                                    'button_label': _Translate('Document text'),
                                    'to_plugin': 'infohub_demo',
                                    'to_function': 'click_menu'
                                },
                                'timer_demo': {
                                    'alias': 'timer_demo_link',
                                    'event_data': 'timer',
                                    'button_label': _Translate('Timer'),
                                    'to_plugin': 'infohub_demo',
                                    'to_function': 'click_menu'
                                },
                                'storage_demo': {
                                    'alias': 'storage_demo_link',
                                    'event_data': 'storage',
                                    'button_label': _Translate('Storage'),
                                    'to_plugin': 'infohub_demo',
                                    'to_function': 'click_menu'
                                }
                            }
                        }
                    },
                    'how': {
                        'mode': 'one box',
                        'text': '[my_menu]'
                    },
                    'where': {
                        'box_id': $in.parent_box_id + '.menu',
                        'max_width': 320,
                        'scroll_to_box_id': 'true'
                    },
                    'cache_key': 'menu'
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
}
//# sourceURL=infohub_demo_menu.js