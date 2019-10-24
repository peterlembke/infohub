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
function infohub_welcome() {

// include "infohub_base.js"

    // ***********************************************************
    // * jshint.com options to suppress some warnings
    // ***********************************************************

    /*jshint evil:true */
    /*jshint devel:true */
    /*jslint browser: true, evil: true, plusplus: true, todo: true */

    // ***********************************************************
    // * your private class variables below, only declare with var
    // ***********************************************************

    var _Version = function() {
        return {
            'date': '2018-09-09',
            'since': '2018-09-09',
            'version': '1.0.0',
            'checksum': '{{checksum}}',
            'class_name': 'infohub_welcome',
            'note': 'Configuration editor for your local browser configuration',
            'status': 'normal',
            'license_name': 'GNU GPL 3 or later',
            'title': 'Config'
        };
    };

    var _GetCmdFunctions = function() {
        return {
            'startup': 'normal',
            'setup_gui': 'normal',
            'event_message': 'normal',
            'zoom': 'normal'
        };
    };

    var _GetPluginName = function($data)
    {
        let $pluginType = 'welcome',
            $tmp = $data.split("_");

        if (_IsSet($tmp[0]) === 'true') {
            $pluginType = $tmp[0];
        }

        return 'infohub_welcome_' + $pluginType;
    };

    var $classTranslations = {};

    /**
     * Translate - Substitute a string for another string using a class local object
     * @param {type} $string
     * @returns string
     */
    $functions.push('_Translate');
    var _Translate = function ($string) 
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
     * Setup the Config Graphical User Interface
     * @version 2018-09-09
     * @since   2018-09-09
     * @author  Peter Lembke
     */
    $functions.push('setup_gui');
    var setup_gui = function ($in)
    {
        "use strict";

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
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_welcome',
                    'function': 'startup'
                },
                'data': {
                    'parent_box_id': $in.box_id
                },
                'data_back': {
                    'box_id': $in.box_id,
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
     * First function to start
     * Used by: index.php
     * @version 2014-08-02
     * @since 2013-04-12
     * @author Peter Lembke
     */
    $functions.push("startup");
    var startup = function ($in)
    {
        "use strict";

        const $pluginName = 'infohub_welcome', $loadOption = 'welcome';

        const $default = {
            'step': 'step_get_menu',
            'parent_box_id': '1',
            'callback_function': null,
            'data': {}
        };
        $in = _Default($default, $in);

        if ($in.step === "step_get_menu")
        {
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': $pluginName + '_menu',
                    'function': 'create'
                },
                'data': {
                    'subtype': 'menu',
                    'parent_box_id': $in.parent_box_id,
                    'translations': $classTranslations
                },
                'data_back': {
                    'subtype': 'menu',
                    'parent_box_id': $in.parent_box_id,
                    'step': 'step_get_menu_response'
                }
            });
        }

        if ($in.step === "step_get_menu_response")
        {
            if (_Empty($loadOption) === 'false') {
                $in.data.data_back.step = 'step_get_' + $loadOption;
            }
            return _SubCall($in.data);
        }

        if ($in.step === ("step_get_" + $loadOption))
        {
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': $pluginName + '_' + $loadOption,
                    'function': 'create'
                },
                'data': {
                    'subtype': $loadOption,
                    'parent_box_id': $in.parent_box_id
                },
                'data_back': {
                    'subtype': $loadOption,
                    'parent_box_id': $in.parent_box_id,
                    'step': 'step_get_' + $loadOption + '_response'
                }
            });
        }

        if ($in.step === ('step_get_' + $loadOption + '_response')) {
            return _SubCall($in.data);
        }

        return {
            'answer': 'true',
            'message': 'startup is done'
        };

    };

    /**
     * The menu send all messages to here.
     * The forms will have their own event functions in this plugin
     * @version 2018-09-09
     * @since   2018-09-09
     * @author  Peter Lembke
     */
    $functions.push('event_message');
    var event_message = function ($in)
    {
        "use strict";

        const $default = {
            'parent_id': '',
            'box_id': '',
            'step': 'step_start',
            'event_data': '',
            'data': null,
            'type': '',
            'event_type': '',
            'parent_box_id': ''
        };
        $in = _Merge($default, $in);

        if ($in.step === 'step_start') {

            if ($in.type === 'button') {
                if ($in.event_type === 'click') {

                    const $pluginName = _GetPluginName($in.event_data);

                    return _SubCall({
                        'to': {
                            'node': 'client',
                            'plugin': $pluginName,
                            'function': 'create'
                        },
                        'data': {
                            'subtype': $in.event_data,
                            'parent_box_id': $in.parent_box_id
                        },
                        'data_back': {
                            'step': 'step_start_response'
                        }
                    });
                }
            }

            if ($in.type === 'submit') {
                window.alert('This submit button works and goes to infohub_demo. This only happens if all data is valid.');
            }

        }

        if ($in.step === 'step_start_response')
        {
            // @todo Is this really used?
            if (Array.isArray($in.data)) {
                // We have a multi message from the child plugin
                return  {
                    'answer': 'true',
                    'message': 'Here comes a multi message',
                    'messages': $in.data
                }
            } else {
                // We have a normal message from the child plugin
                return _SubCall($in.data);
            }
        }

        if ($in.step === 'step_end') {
            return {'answer': 'true', 'message': 'Done handling the event message' };
        }

        return {
            'answer': 'false',
            'message': 'Did not handle the event message'
        };

    };

}
//# sourceURL=infohub_welcome.js