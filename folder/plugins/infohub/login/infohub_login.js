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
function infohub_login() {

    "use strict";

// include "infohub_base.js"

    const _Version = function()
    {
        return {
            'date': '2020-01-03',
            'since': '2019-01-09',
            'version': '1.0.0',
            'checksum': '{{checksum}}',
            'class_name': 'infohub_login',
            'note': 'Login GUI',
            'status': 'normal',
            'SPDX-License-Identifier': 'GPL-3.0-or-later',
            'title': 'Login',
            'recommended_security_group': 'guest'
        };
    };

    const _GetCmdFunctions = function()
    {
        return {
            'setup_gui': 'normal',
            'click_menu': 'normal',
            'click': 'normal',
            'call_server': 'normal'
        };
    };

    const _GetPluginName = function($data)
    {
        let $pluginType = 'login',
            $tmp = $data.split("_");

        if (_IsSet($tmp[0]) === 'true') {
            $pluginType = $tmp[0];
        }

        return 'infohub_login_' + $pluginType;
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
     * @version 2019-09-03
     * @since   2019-09-03
     * @author  Peter Lembke
     */
    $functions.push('setup_gui');
    const setup_gui = function ($in)
    {
        const $default = {
            'box_id': '',
            'step': 'step_start',
            'response': {
                'answer': '',
                'message': '',
                'data': {},
                'post_exist': 'false'
            },
            'desktop_environment': ''
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
                    'desktop_environment': $in.desktop_environment,
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
                            'box_data': '' // The menu will render here
                        },
                        {
                            'parent_box_id': $in.box_id,
                            'box_position': 'last',
                            'box_mode': 'data',
                            'box_alias': 'form',
                            'max_width': 640, // 100 will be translated to 100%
                            'box_data': '' // Use the menu
                        },
                        {
                            'parent_box_id': $in.box_id,
                            'box_position': 'last',
                            'box_mode': 'data',
                            'box_alias': 'contact',
                            'max_width': 640, // 100 will be translated to 100%
                            'box_data': '' // Imported contact data
                        }
                    ]
                },
                'data_back': {
                    'box_id': $in.box_id,
                    'desktop_environment': $in.desktop_environment,
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
                    'desktop_environment': $in.desktop_environment,
                    'step': 'step_get_translations_response'
                }
            });
        }

        if ($in.step === 'step_get_translations_response')
        {
            $classTranslations = _ByVal($in.response.data);

            $in.step = 'step_menu';

            if ($in.desktop_environment === 'standalone') {
                $in.step = 'step_render_login';
            }
        }

        if ($in.step === 'step_menu')
        {
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_login_menu',
                    'function': 'create'
                },
                'data': {
                    'subtype': 'menu',
                    'parent_box_id': $in.box_id,
                    'translations': $classTranslations
                },
                'data_back': {
                    'box_id': $in.box_id,
                    'desktop_environment': $in.desktop_environment,
                    'step': 'step_render_contact'
                }
            });
        }

        if ($in.step === 'step_render_contact')
        {
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_login_contact',
                    'function': 'create'
                },
                'data': {
                    'subtype': 'client',
                    'parent_box_id': $in.box_id,
                    'translations': $classTranslations
                },
                'data_back': {
                    'box_id': $in.box_id,
                    'desktop_environment': $in.desktop_environment,
                    'step': 'step_render_contact_response'
                }
            });
        }

        if ($in.step === 'step_render_contact_response')
        {
            $in.step = 'step_render_instructions';
            if ($in.response.post_exist === 'true') {
                $in.step = 'step_render_login';
            }
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
                        'box_id': 'main.body.infohub_login.form',
                        'max_width': 640,
                        'scroll_to_box_id': 'true'
                    },
                    'cache_key': 'instructions'
                },
                'data_back': {
                    'desktop_environment': $in.desktop_environment,
                    'step': 'step_end'
                }
            });
        }

        if ($in.step === 'step_render_login')
        {
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_login',
                    'function': 'click_menu'
                },
                'data': {
                    'event_data': 'login',
                    'desktop_environment': $in.desktop_environment
                },
                'data_back': {
                    'desktop_environment': $in.desktop_environment,
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
     * @version 2019-09-03
     * @since 2018-09-26
     * @author Peter Lembke
     */
    $functions.push("click_menu");
    const click_menu = function ($in)
    {
        const $default = {
            'step': 'step_start',
            'event_data': '',
            'parent_box_id': '',
            'desktop_environment': '',
            'response': {
                'answer': 'false',
                'message': 'Nothing to report'
            }
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
                    'translations': $classTranslations,
                    'desktop_environment': $in.desktop_environment
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
     * All clicks except the menu goes here and are distributed
     * to the right child and the right click function.
     * @version 2019-09-03
     * @since 2019-03-13
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
            'desktop_environment': '',
            'response': {
                'answer': 'false',
                'message': 'There was an error',
                'ok': 'false',
                'value': [], // All selected options in select lists
                'files_data': [] // For the import button
            }
        };
        $in = _Default($default, $in);

        const $pluginName = 'infohub_login';

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
                    'plugin': $pluginName + '_' + $childName,
                    'function': 'click_' + $clickName
                },
                'data': {
                    'event_data': $in.event_data,
                    'value': $in.value,
                    'values': $in.response.value,
                    'files_data': $in.response.files_data,
                    'box_id': $in.box_id,
                    'desktop_environment': $in.desktop_environment
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
     * Children can talk to level1 plugins on the same node.
     * When you need data from other nodes then any level1 plugin must help getting that.
     * @version 2019-09-03
     * @since 2019-03-13
     * @author Peter Lembke
     */
    $functions.push("call_server");
    const call_server = function ($in)
    {
        const $default = {
            'step': 'step_start',
            'to': {
                'node': 'server',
                'plugin': 'infohub_login',
                'function': ''
            },
            'data': {},
            'response': {},
            'from_plugin': {
                'node': '',
                'plugin': ''
            }
        };
        $in = _Default($default, $in);

        if ($in.step === 'step_start')
        {
            if ($in.from_plugin.node !== 'client') {
                return {
                    'answer': 'false',
                    'message': 'Only plugins from the client node can call this function'
                };
            }

            if ($in.from_plugin.plugin.indexOf('infohub_login_') !== 0) {
                return {
                    'answer': 'false',
                    'message': 'Only children to this plugin can call this function'
                };
            }

            let $pluginName = 'infohub_login';
            if ($in.to.plugin === 'infohub_dummy') {
                $pluginName = 'infohub_dummy';
            }

            return _SubCall({
                'to': {
                    'node': 'server',
                    'plugin': $pluginName,
                    'function': $in.to.function
                },
                'data': $in.data,
                'data_back': {
                    'step': 'step_end'
                }
            });
        }

        return $in.response;
    };
}
//# sourceURL=infohub_login.js