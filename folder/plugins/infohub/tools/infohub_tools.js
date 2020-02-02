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
function infohub_tools() {

// include "infohub_base.js"

    /*jshint evil:true */
    /*jshint devel:true */
    /*jslint browser: true, evil: true, plusplus: true, todo: true */

    const _Version = function () {
        return {
            'date': '2018-08-04',
            'since': '2018-07-26',
            'version': '1.0.0',
            'checksum': '{{checksum}}',
            'class_name': 'infohub_tools',
            'note': 'Collection of tools that show you what Infohub can do',
            'status': 'normal',
            'license_name': 'GNU GPL 3 or later',
            'title': 'Tools collection'
        };
    };

    const _GetCmdFunctions = function ()
    {
        return {
            'setup_gui': 'normal',
            'click_menu': 'normal',
            'click': 'normal',
            'call_server': 'normal',
            'get_available_options': 'normal'
        };
    };

    const _GetPluginName = function ($data)
    {
        let $pluginType = 'welcome';

        let $tmp = $data.split("_");

        if (_IsSet($tmp[0]) === 'true') {
            $pluginType = $tmp[0];
        }

        return 'infohub_tools_' + $pluginType;
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
        "use strict";

        const $default = {
            'box_id': '',
            'step': 'step_start'
        };
        $in = _Merge($default, $in);

        if ($in.step === 'step_start') {
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

        if ($in.step === 'step_boxes_insert') {
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
                            'box_alias': 'tools',
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

        if ($in.step === 'step_get_translations_response') {            
            $classTranslations = _ByVal($in.response.data);
            $in.step = 'step_menu';
        }
        
        if ($in.step === 'step_menu')
        {
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_tools_menu',
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

        if ($in.step === 'step_render_instructions') {
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
                        'box_id': 'main.body.infohub_tools.tools',
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
        "use strict";

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
        "use strict";

        const $default = {
            'event_data': '', // childName|clickName|RestOfEventData
            'level': '', // For the advanced list
            'value': '', // Selected option in select lists
            'box_id': '',
            'step': 'step_start',
            'type': '',
            'event_type': '',
            'affect_alias': '',
            'affect_plugin': '',
            'affect_function': '',
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
                    'plugin': 'infohub_tools_' + $childName,
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
                    'affect_alias': $in.affect_alias,
                    'affect_plugin': $in.affect_plugin,
                    'affect_function': $in.affect_function,
                    'form_data': $in.form_data
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
     * Function so the children can call the server
     * @version 2019-03-31
     * @since 2019-03-31
     * @author Peter Lembke
     */
    $functions.push("call_server");
    const call_server = function ($in)
    {
        "use strict";

        const $default = {
            'step': 'step_start',
            'from_plugin': {'node': '', 'plugin': '', 'function': '' },
            'send_data': {},
            'response': {}
        };
        $in = _Default($default, $in);
        
        if ($in.step === 'step_start') 
        {
            if ($in.from_plugin.node === 'client') {
                if ($in.from_plugin.plugin.substr(0,'infohub_tools_'.length) === 'infohub_tools_') {
                    $in.send_data.data_back.step = 'step_response';
                    return _SubCall($in.send_data);
                }
            }

            return {
                'answer': 'false',
                'message': 'The call do not come from a child. I will do nothing.'
            }
        }
       
        return $in.response;
    };

    /**
     * Function so the children can call the server
     * @version 2019-07-11
     * @since 2019-07-11
     * @author Peter Lembke
     */
    $functions.push("get_available_options");
    const get_available_options = function ($in)
    {
        "use strict";

        const $default = {
            'step': 'step_start',
            'from_plugin': {
                'node': '',
                'plugin': '',
                'function': ''
            },
            'response': {},
            'config': {}
        };
        $in = _Default($default, $in);

        if ($in.step === 'step_start')
        {
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_tools_testcall',
                    'function': 'get_available_options'
                },
                'data': {
                    'config': $in.config
                },
                'data_back': {
                    'step': 'step_end'
                }
            });
        }

        return $in.response;
    };
}
//# sourceURL=infohub_tools.js