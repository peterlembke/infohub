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
function infohub_demo() {

    "use strict";

// include "infohub_base.js"

    const _Version = function() {
        return {
            'date': '2019-03-28',
            'since': '2013-12-25',
            'version': '1.0.0',
            'checksum': '{{checksum}}',
            'class_name': 'infohub_demo',
            'note': 'Collection of demos to demonstrate InfoHub',
            'status': 'normal',
            'SPDX-License-Identifier': 'GPL-3.0-or-later',
            'title': 'Demo collection'
        };
    };

    const _GetCmdFunctions = function() {
        return {
            'setup_gui': 'normal',
            'click_menu': 'normal',
            'click': 'normal',
            'click_link': 'normal',
            'event_message': 'normal'
        };
    };

    const _GetPluginName = function($data)
    {
        let $pluginType = 'welcome',
            $tmp = $data.split("_");

        if (_IsSet($tmp[0]) === 'true') {
            $pluginType = $tmp[0];
        }

        return 'infohub_demo_' + $pluginType;
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
     * Setup the Workbench Graphical User Interface
     * @version 2017-10-03
     * @since   2017-10-03
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
                            'box_alias': 'menu',
                            'max_width': 640,
                            'box_data': 'The menu will render here'
                        },
                        {
                            'parent_box_id': $in.box_id,
                            'box_position': 'last',
                            'box_mode': 'data',
                            'box_alias': 'demo',
                            'max_width': 100, // 100 will be translated to 100%
                            'box_data': 'Use the menu'
                        }
                    ]
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
            $in.step = 'step_menu';
        }

        if ($in.step === 'step_menu')
        {
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_demo_menu',
                    'function': 'create'
                },
                'data': {
                    'parent_box_id': $in.box_id,
                    'translations': $classTranslations
                },
                'data_back': {
                    'box_id': $in.box_id,
                    'step': 'step_render_instructions'
                }
            });
        }

        if ($in.step === 'step_render_instructions')
        {
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_render',
                    'function': 'create'
                },
                'data': {
                    'what': {
                        'presentation_box': {
                            'plugin': 'infohub_rendermajor',
                            'type': 'presentation_box',
                            'head_label': _Translate('Instructions'),
                            'head_text': '',
                            'content_data': '[description]'
                        },
                        'description': {
                            'type': 'common',
                            'subtype': 'value',
                            'data': _Translate('Use the menu.')
                        }
                    },
                    'how': {
                        'mode': 'one box',
                        'text': '[presentation_box]'
                    },
                    'where': {
                        'box_id': 'main.body.infohub_demo.demo',
                        'max_width': 640,
                        'scroll_to_box_id': 'true'
                    }
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
    
    /**
     * All clicks except the menu goes here and are distributed 
     * to the right child and the right click function.
     * @version 2019-03-13
     * @since 2019-03-13
     * @author Peter Lembke
     */
    $functions.push("click");
    const click = function ($in)
    {
        const $default = {
            'event_data': '', // childName|clickName|RestOfEventData
            'level': '', // For the advanced list
            'value': '', // Selected option in select lists
            'box_id': '',
            'step': 'step_start',
            'type': '',
            'event_type': '',
            'form_data': {},
            'response': {
                'answer': 'false',
                'message': 'There was an error',
                'ok': 'false',
                'value': [], // All selected options in select lists
                'files_data': [] // For the import button
            }
        };
        $in = _Default($default, $in);
        
        if (_Empty($in.event_data) === 'true') {
            $in.step = 'step_end';
            $in.response.message = 'Event_data is empty. I can not continue.';
        }

        if ($in.step === 'step_start') {
            
            const $parts = $in.event_data.split('|');
            const $childName = $parts[0];
            const $clickName = $parts[1];
            
            let $eventData = '';
            if (_IsSet($parts[2]) === 'true') {
                $eventData = $parts[2];
            }
            
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_demo_' + $childName,
                    'function': 'click_' + $clickName
                },
                'data': {
                    'event_data': $eventData,
                    'value': $in.value,
                    'values': $in.response.value,
                    'level': $in.level,
                    'files_data': $in.response.files_data,
                    'box_id': $in.box_id,
                    'type': $in.type,
                    'event_type': $in.event_type,
                    'form_data': $in.form_data
                },
                'data_back': {
                    'event_data': $in.event_data,
                    'step': 'step_response'
                }
            });
        }

        if ($in.step === 'step_response') {
            if ($in.response.answer === 'true') {
                $in.response.ok = 'true';
            }
        }

        return {
            'answer': $in.response.answer,
            'message': $in.response.message,
            'ok': $in.response.ok
        };
    };

    /**
     * Simple demo how to use links in a Markdown document rendered by infohub_renderdocument
     * @version 2020-01-24
     * @since 2020-01-24
     * @author Peter Lembke
     */
    $functions.push("click_link");
    const click_link = function ($in)
    {
        const $default = {
            'event_data': '',
        };
        $in = _Default($default, $in);

        window.alert($in.event_data);

        return {
            'answer': 'true',
            'message': 'Done'
        };
    };

    /**
     * If you do not state a to_function in your rendered object
     * then you end up in the event_message function when there is an event.
     * @version 2019-03-31
     * @since   2013-12-25
     * @author  Peter Lembke
     */
    $functions.push('event_message');
    const event_message = function ($in)
    {
        const $default = {
            'parent_id': '',
            'box_id': '',
            'step': 'step_start',
            'event_data': '',
            'type': '',
            'event_type': '',
            'parent_box_id': ''
        };
        $in = _Merge($default, $in);

        if ($in.step === 'step_start')
        {
            if ($in.type === 'link') {
                if ($in.event_type === 'click') {
                    window.alert(_Translate('This link works and goes to infohub_demo -> event_message.'));
                }
            }

            if ($in.type === 'button') {
                window.alert(_Translate('This button works and goes to infohub_demo -> event_message.'));
            }

            if ($in.type === 'submit') {
                window.alert(_Translate('This submit button works and goes to infohub_demo -> event_message. This only happens if all data is valid.'));
            }
        }

        return {
            'answer': 'true',
            'message': 'Done handle the event'
        };
    };
}
//# sourceURL=infohub_demo.js