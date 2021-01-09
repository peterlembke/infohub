/**
 * Configuration editor for your local browser configuration
 *
 * @author      Peter Lembke <info@infohub.se>
 * @version     2019-10-12
 * @since       2018-09-09
 * @copyright   Copyright (c) 2018, Peter Lembke
 * @license     https://opensource.org/licenses/gpl-license.php GPL-3.0-or-later
 * @see         https://github.com/peterlembke/infohub/blob/master/folder/plugins/infohub/configlocal/infohub_configlocal.md Documentation
 * @link        https://infohub.se/ InfoHub main page
 */
function infohub_configlocal() {

    "use strict";

// include "infohub_base.js"

    $functions.push('_Version');
    const _Version = function() {
        return {
            'date': '2019-10-12',
            'since': '2018-09-09',
            'version': '1.0.0',
            'checksum': '{{checksum}}',
            'class_name': 'infohub_configlocal',
            'note': 'Configuration editor for your local browser configuration',
            'status': 'normal',
            'SPDX-License-Identifier': 'GPL-3.0-or-later',
            'title': 'Config',
            'user_role': 'user',
            'web_worker': 'true',
            'core_plugin': 'false'
        };
    };

    $functions.push('_GetCmdFunctions');
    const _GetCmdFunctions = function() {
        const $list = {
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

        return _GetCmdFunctionsBase($list);
    };

    $functions.push('_GetPluginName');
    const _GetPluginName = function($data)
    {
        let $pluginType = 'welcome',
            $tmp = $data.split("_");

        if (_IsSet($tmp[0]) === 'true') {
            $pluginType = $tmp[0];
        }

        return 'infohub_configlocal_' + $pluginType;
    };

    let $classTranslations = {};

    let $classGetConfig = {}; // Cache for reading config data

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
                        },
                        {
                            'parent_box_id': $in.box_id,
                            'box_position': 'last',
                            'box_mode': 'data',
                            'box_alias': 'preview',
                            'max_width': 100, // 100 will be translated to 100%
                            'box_data': ''
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
    const startup = function ($in)
    {
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
    const submit = function ($in)
    {
        const $default = {
            'step': 'step_save',
            'data': null,
            'event_data': '',
            'form_data': {},
            'from_plugin': {'node': '', 'plugin': '', 'function': '' },
            'response': {
                'answer': 'false',
                'message': 'Nothing to report'
            },
            'config': {
                'user_name': ''
            }
        };
        $in = _Default($default, $in);

        let $out = {
            'answer': 'false',
            'message': 'an error occurred'
        };

        leave: {
            if ($in.from_plugin.node !== 'client') {
                $out.message = 'I only allow client plugins to use this function';
                break leave;
            }

            const $pluginName = 'infohub_configlocal_';
            if ($in.from_plugin.plugin.substr(0, $pluginName.length) !== $pluginName) {
                $out.message = 'I only allow child plugins to use this function';
                break leave;
            }

            if ($in.step === 'step_save') {

                const $sectionName = $in.event_data;
                const $path = 'infohub_configlocal/' + $sectionName + '/' + $in.config.user_name;

                $classGetConfig[$path] = $in.form_data;

                return _SubCall({
                    'to': {
                        'node': 'client',
                        'plugin': 'infohub_storage',
                        'function': 'write'
                    },
                    'data': {
                        'path': $path,
                        'data': $in.form_data
                    },
                    'data_back': {
                        'step': 'step_save_response'
                    }
                });
            }

            if ($in.step === "step_save_response") {
            }
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
    const click_menu = function ($in)
    {
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
            'plugin_name': '',
            'call_render_done': 'false',
            'response': {
                'answer': 'false',
                'message': 'Nothing to report',
                'items': {}
            }
        };
        $in = _Default($default, $in);

        let $names = [];

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
                    'box_id': $in.box_id,
                    'parent_box_id': $in.parent_box_id,
                    'call_render_done': $in.call_render_done,
                    'step': 'step_load_items_response'
                }
            });
        }

        if ($in.step === 'step_load_items_response') {
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
                    'box_id': $in.box_id,
                    'parent_box_id': $in.parent_box_id,
                    'translations': $classTranslations,
                    'form_data': $formData
                },
                'data_back': {
                    'box_id': $in.box_id,
                    'parent_box_id': $in.parent_box_id,
                    'form_data': $formData,
                    'plugin_name': $pluginName,
                    'call_render_done': $in.call_render_done,
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
                    'box_id': $in.box_id,
                    'parent_box_id': $in.parent_box_id,
                    'form_data': $in.form_data,
                    'plugin_name': $in.plugin_name,
                    'call_render_done': $in.call_render_done,
                    'step': 'step_set_form_data_response'
                }
            });
        }

        if ($in.step === 'step_set_form_data_response') {
            if ($in.call_render_done === 'true') {
                $in.step = 'step_call_render_done'
            }
        }

        if ($in.step === 'step_call_render_done') {
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': $in.plugin_name,
                    'function': 'render_done'
                },
                'data': {
                    'box_id': $in.box_id,
                    'parent_box_id': $in.parent_box_id,
                    'form_data': $in.form_data
                },
                'data_back': {
                    'step': 'step_end'
                }
            });
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
    const click = function ($in)
    {
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
    const load_items = function ($in)
    {
        const $default = {
            'section_names_array': [],
            'step': 'step_load_data',
            'response': {
                'answer': 'false',
                'message': 'Nothing to report',
                'items': {}
            },
            'config': {
                'user_name': ''
            }
        };
        $in = _Default($default, $in);

        let $itemCollection = {};

        if ($in.step === 'step_load_data')
        {
            let $pathCollection = {};

            for (let $sectionNumber = 0; $sectionNumber < $in.section_names_array.length; $sectionNumber = $sectionNumber + 1) {
                const $sectionName = $in.section_names_array[$sectionNumber];
                const $path = 'infohub_configlocal/' + $sectionName + '/' +$in.config.user_name;

                if (_IsSet($classGetConfig[$path]) === 'true') {
                    continue;
                }

                $pathCollection[$path]= {}; // Empty object means you want all data
            }

            $in.step = 'step_load_data_response';

            if (_Count($pathCollection) > 0) {
                return _SubCall({
                    'to': {
                        'node': 'client',
                        'plugin': 'infohub_storage',
                        'function': 'read_many'
                    },
                    'data': {
                        'paths': $pathCollection,
                    },
                    'data_back': {
                        'parent_box_id': $in.parent_box_id,
                        'section_names_array': $in.section_names_array,
                        'step': 'step_load_data_response'
                    }
                });
            }
        }

        if ($in.step === 'step_load_data_response')
        {
            for (let $sectionNumber = 0; $sectionNumber < $in.section_names_array.length; $sectionNumber = $sectionNumber + 1)
            {
                const $sectionName = $in.section_names_array[$sectionNumber];
                const $path = 'infohub_configlocal/' + $sectionName + '/' + $in.config.user_name;

                if (_IsSet($in.response.items[$path]) === 'false') {
                    if (_IsSet($classGetConfig[$path]) === 'false') {
                        continue;
                    }
                    $in.response.items[$path] = $classGetConfig[$path];
                }

                const $item = _ByVal($in.response.items[$path]);
                // Do not try to convert the item value here
                const $newPath = 'infohub_configlocal/' + $in.section_names_array[$sectionNumber];
                $itemCollection[$newPath] = $item;

                $classGetConfig[$path] = $item;
            }

            $in.response.items = $itemCollection;
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
    const get_config = function ($in)
    {
        const $default = {
            'section_name': '',
            'step': 'step_start',
            'response': {
                'answer': 'false',
                'message': 'Nothing to report',
                'path': '',
                'data': {}
            },
            'config': {
                'user_name': ''
            }
        };
        $in = _Default($default, $in);

        leave: {

            const $path = 'infohub_configlocal/' + $in.section_name + '/' + $in.config.user_name;

            if ($in.step === 'step_start') {
                if (_IsSet($classGetConfig[$path]) === 'true') {
                    $in.response.data = $classGetConfig[$path];
                    $in.response.answer = 'true';
                    $in.response.message = 'Found the answer in the cache';
                    $in.step = 'step_convert';
                } else {
                    $in.step = 'step_load_data';
                }
            }

            if ($in.step === 'step_load_data') {

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
                        'section_name': $in.section_name,
                        'step': 'step_load_data_response'
                    }
                });
            }

            if ($in.step === 'step_load_data_response')
            {
                $classGetConfig[$path] = _ByVal($in.response.data);
                $in.step = 'step_convert';
            }

            if ($in.step === 'step_convert')
            {
                let $data = _ByVal($in.response.data);

                for (let $key in $data)
                {
                    if ($data.hasOwnProperty($key) === false) {
                        continue;
                    }

                    const $value = _GetData({
                        'name': $key + '/value',
                        'default': '',
                        'data': $data
                    });

                    $data[$key] = $value;
                }

                $in.response.data = _ByVal($data);
            }

        }

        return {
            'answer': $in.response.answer,
            'message': $in.response.message,
            'data': $in.response.data
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
    const apply_config = function ($in)
    {
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
            'language',
            'image',
            'colour'
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

            for (let $i = 0; $i < $children.length; $i = $i + 1)
            {
                $childName = $children[$i];

                $config = _GetData({
                    'name': 'response|items|infohub_configlocal/' + $childName,
                    'default': {},
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