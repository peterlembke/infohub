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
function infohub_configlocal() {

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
            'date': '2019-10-12',
            'since': '2018-09-09',
            'version': '1.0.0',
            'checksum': '{{checksum}}',
            'class_name': 'infohub_configlocal',
            'note': 'Configuration editor for your local browser configuration',
            'status': 'normal',
            'license_name': 'GNU GPL 3 or later',
            'title': 'Config'
        };
    };

    var _GetCmdFunctions = function() {
        return {
            'setup_gui': 'normal',
            'startup': 'normal',
            'submit': 'normal',
            'click_menu': 'normal',
            'click': 'normal',
            'click_test': 'normal',
            'load_items': 'normal',
            'get_config': 'normal',
            'apply_config': 'normal'
        };
    };

    var _GetPluginName = function($data)
    {
        let $pluginType = 'welcome',
            $tmp = $data.split("_");

        if (_IsSet($tmp[0]) === 'true') {
            $pluginType = $tmp[0];
        }

        return 'infohub_configlocal_' + $pluginType;
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
     * Setup the Config Graphical User Interface
     * Used by Workbench
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
                            'max_width': 320,
                            'box_data': _Translate('The menu will render here')
                        },
                        {
                            'parent_box_id': $in.box_id,
                            'box_position': 'last',
                            'box_mode': 'data',
                            'box_alias': 'form',
                            'max_width': 100, // 100 will be translated to 100%
                            'box_data': _Translate('Use the menu')
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

        if ($in.step === 'step_get_translations_response')
        {
            $classTranslations = _ByVal($in.response.data);
            $in.step = 'step_menu';
        }

        if ($in.step === 'step_menu')
        {
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_configlocal',
                    'function': 'startup'
                },
                'data': {
                    'parent_box_id': $in.box_id,
                    'translations': $classTranslations
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
     * First function to start after the GUI is set up.
     * This function will load the menu
     * Used by: setup_gui in this plugin
     * @version 2014-08-02
     * @since 2013-04-12
     * @author Peter Lembke
     */
    $functions.push("startup");
    var startup = function ($in)
    {
        "use strict";

        const $pluginName = 'infohub_configlocal';

        const $default = {
            'step': 'step_get_menu',
            'parent_box_id': '1',
            'callback_function': null,
            'event_data': 'zoom',
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
                    'event_data': $in.event_data,
                    'parent_box_id': $in.parent_box_id,
                    'step': 'step_get_menu_response'
                }
            });
        }

        if ($in.step === "step_get_menu_response")
        {
            if (_Empty($in.event_data) === 'false') {
                $in.step = 'step_get_option';
            }
        }

        if ($in.step === "step_get_option")
        {
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_configlocal',
                    'function': 'click_menu'
                },
                'data': {
                    'event_data': $in.event_data,
                    'parent_box_id': $in.parent_box_id
                },
                'data_back': {
                    'event_data': $in.event_data,
                    'parent_box_id': $in.parent_box_id,
                    'step': 'step_end'
                }
            });
        }

        return {
            'answer': 'true',
            'message': 'startup is done'
        };

    };

    /**
     * Saves your form data to a section name
     * Only the child plugins can use this function
     * @version 2019-10-19
     * @since 2019-03-11
     * @author Peter Lembke
     */
    $functions.push("submit");
    var submit = function ($in)
    {
        "use strict";

        const $default = {
            'step': 'step_save',
            'data': null,
            'event_data': '',
            'form_data': {},
            'from_plugin': {'node': '', 'plugin': '', 'function': '' },
            'response': {
                'answer': 'false',
                'message': 'Nothing to report'
            }
        };
        $in = _Default($default, $in);

        if ($in.step === 'step_save') {
            if ($in.from_plugin.node === 'client') {
                const $pluginName = 'infohub_configlocal_';
                if ($in.from_plugin.plugin.substr(0, $pluginName.length) === $pluginName)
                {
                    return _SubCall({
                        'to': {
                            'node': 'client',
                            'plugin': 'infohub_storage',
                            'function': 'write'
                        },
                        'data': {
                            'path': 'infohub_configlocal/' + $in.event_data,
                            'data': $in.form_data
                        },
                        'data_back': {
                            'step': 'step_save_response'
                        }
                    });
                }
            }

            return {
                'answer': 'false',
                'message': 'The call do not come from a child. I will do nothing.'
            }
        }

        if ($in.step === "step_save_response")
        {
        }

        return {
            'answer': $in.response.answer,
            'message': $in.response.message
        };
    };

    /**
     * Menu click
     * @version 2019-03-11
     * @since   2019-03-11
     * @author  Peter Lembke
     */
    $functions.push('click_menu');
    var click_menu = function ($in)
    {
        "use strict";

        let $names = [];

        const $default = {
            'parent_id': '',
            'box_id': '',
            'step': 'step_load_items',
            'event_data': '',
            'data': null,
            'type': '',
            'event_type': '',
            'parent_box_id': '',
            'form_data': {},
            'response': {
                'answer': 'false',
                'message': 'Nothing to report',
                'items': {}
            }
        };
        $in = _Default($default, $in);

        if ($in.step === 'step_load_items')
        {
            $names.push($in.event_data);

            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_configlocal',
                    'function': 'load_items'
                },
                'data': {
                    'section_names_array': $names
                },
                'data_back': {
                    'event_data': $in.event_data,
                    'parent_box_id': $in.parent_box_id,
                    'step': 'step_load_data_response'
                }
            });
        }

        if ($in.step === 'step_load_data_response') {
            $in.step = 'step_render';
        }

        if ($in.step === 'step_render')
        {
            const $pluginName = _GetPluginName($in.event_data);

            const $formData = _GetData({
                'name': 'response|items|infohub_configlocal/' + $in.event_data,
                'default': {},
                'data': $in,
                'split': '|'
            });

            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': $pluginName,
                    'function': 'create'
                },
                'data': {
                    'parent_box_id': $in.parent_box_id,
                    'translations': $classTranslations
                },
                'data_back': {
                    'form_data': $formData,
                    'step': 'step_set_form_data'
                }
            });
        }

        if ($in.step === 'step_set_form_data')
        {
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_view',
                    'function': 'form_write'
                },
                'data': {
                    'id': 'main.body.infohub_configlocal.form',
                    'form_data': $in.form_data
                },
                'data_back': {
                    'parent_box_id': $in.parent_box_id,
                    'step': 'step_set_form_data_response'
                }
            });
        }

        if ($in.step === 'step_set_form_data_response') {
        }

        return {
            'answer': 'true',
            'message': 'Done handling the event message'
        };
    };

    /**
     * All clicks except the menu goes here and are distributed
     * to the right child and the right click function.
     * @version 2019-10-12
     * @since 2019-10-12
     * @author Peter Lembke
     */
    $functions.push("click");
    var click = function ($in)
    {
        "use strict";

        const $default = {
            'event_data': '', // childName|clickName
            'value': '', // Selected option in select lists
            'box_id': '',
            'step': 'step_start',
            'response': {
                'answer': 'false',
                'message': 'There was an error',
                'ok': 'false',
                'value': [], // All selected options in select lists
                'files_data': [] // For the import button
            }
        };
        $in = _Default($default, $in);

        if (_Empty($in.event_data) === 'true')
        {
            $in.step = 'step_end';
            $in.response.message = 'Event_data is empty. I can not continue.';
        }

        if ($in.step === 'step_start')
        {
            const $parts = $in.event_data.split('|');
            const $childName = $parts[0];
            const $clickName = $parts[1];

            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_configlocal_' + $childName,
                    'function': 'click_' + $clickName
                },
                'data': {
                    'event_data': $in.event_data,
                    'value': $in.value,
                    'values': $in.response.value,
                    'files_data': $in.response.files_data,
                    'box_id': $in.box_id
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
     * Load config data sections
     * @version 2019-03-11
     * @since   2019-03-11
     * @author  Peter Lembke
     */
    $functions.push('load_items');
    var load_items = function ($in)
    {
        "use strict";

        const $default = {
            'section_names_array': [],
            'step': 'step_load_data',
            'response': {
                'answer': 'false',
                'message': 'Nothing to report',
                'items': {}
            }
        };
        $in = _Default($default, $in);

        if ($in.step === 'step_load_data')
        {
            let $paths = {};

            for (let $i=0; $i < $in.section_names_array.length; $i++) {
                const $path = 'infohub_configlocal/' + $in.section_names_array[$i];
                $paths[$path]= 1;
            }

            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_storage',
                    'function': 'read_many'
                },
                'data': {
                    'paths': $paths,
                },
                'data_back': {
                    'parent_box_id': $in.parent_box_id,
                    'step': 'step_load_data_response'
                }
            });
        }

        if ($in.step === 'step_load_data_response') {
        }

        return {
            'answer': $in.response.answer,
            'message': $in.response.message,
            'items': $in.response.items
        };
    };

    /**
     * Get one configuration section.
     * Used by you to read the configuration so you can use it in your plugin
     * @version 2019-03-19
     * @since   2019-03-19
     * @author  Peter Lembke
     */
    $functions.push('get_config');
    var get_config = function ($in)
    {
        "use strict";

        let $out = {};

        const $default = {
            'section_name': '',
            'step': 'step_load_data',
            'response': {
                'answer': 'false',
                'message': 'Nothing to report',
                'path': '',
                'data': {}
            }
        };
        $in = _Default($default, $in);

        if ($in.step === 'step_load_data') {

            const $path = 'infohub_configlocal/' + $in.section_name;

            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_storage',
                    'function': 'read'
                },
                'data': {
                    'path': $path,
                },
                'data_back': {
                    'step': 'step_load_data_response'
                }
            });
        }

        if ($in.step === 'step_load_data_response')
        {
            const $data = _ByVal($in.response.data);

            for (let $key in $data)
            {
                const $value = _GetData({
                    'name': $key + '/value',
                    'default': '',
                    'data': $data
                });

                $out[$key] = $value;
            }
        }

        return {
            'answer': $in.response.answer,
            'message': $in.response.message,
            'data': $out
        };
    };

    /**
     * Apply all config that can be applied by calling each child
     * each child then have the function apply_config
     * @version 2019-10-19
     * @since   2019-10-19
     * @author  Peter Lembke
     */
    $functions.push('apply_config');
    var apply_config = function ($in)
    {
        "use strict";

        const $default = {
            'step': 'step_get_config',
            'response': {
                'answer': 'false',
                'message': 'Nothing to report',
                'items': {}
            }
        };
        $in = _Default($default, $in);

        const $children = [
            'zoom',
            'language'
        ];

        if ($in.step === 'step_get_config')
        {
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_configlocal',
                    'function': 'load_items'
                },
                'data': {
                    'section_names_array': $children
                },
                'data_back': {
                    'step': 'step_get_config_response'
                }
            });
        }

        if ($in.step === 'step_get_config_response')
        {
            $in.step = 'step_end';
            if ($in.response.answer === 'true') {
                $in.step = 'step_apply_config';
            }
        }

        if ($in.step === 'step_apply_config')
        {
            let $subCall = {},
                $messages = [],
                $childName = '',
                $config = {};

            for (let $i = 0; $i < $children.length; $i++)
            {
                $childName = $children[$i];

                $config = _GetData({
                    'name': 'response|items|infohub_configlocal/' + $childName,
                    'default': '',
                    'data': $in,
                    'split': '|'
                });

                $subCall = _SubCall({
                    'to': {
                        'node': 'client',
                        'plugin': 'infohub_configlocal_' + $childName,
                        'function': 'apply_config'
                    },
                    'data': {
                        'local_config': $config
                    },
                    'data_back': {
                        'step': 'step_end'
                    }
                });
                $messages.push($subCall);
            }

            return {
                'answer': 'true',
                'message': 'have sent the trigger messages to the children',
                'messages': $messages
            };
        }

        return {
            'answer': 'true',
            'message': 'Done'
        };
    };

}
//# sourceURL=infohub_configlocal.js