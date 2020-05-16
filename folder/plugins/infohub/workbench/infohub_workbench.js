/*
 Copyright (C) 2017 Peter Lembke, CharZam soft
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
function infohub_workbench() {

    "use strict";

// include "infohub_base.js"

    $functions.push("_Version");
    const _Version = function() {
        return {
            'date': '2017-03-08',
            'since': '2017-03-08',
            'version': '1.0.0',
            'checksum': '{{checksum}}',
            'class_name': 'infohub_workbench',
            'note': 'Handles what you see on screen with an app menu and a separate box for each started app, there the app can show its things.',
            'status': 'normal',
            'SPDX-License-Identifier': 'GPL-3.0-or-later',
            'title': 'Workbench',
            'recommended_security_group': 'user'
        };
    };

    $functions.push("_GetCmdFunctions");
    const _GetCmdFunctions = function() {
        return {
            'startup': 'normal',
            'setup_gui': 'normal',
            'setup_plugin': 'normal'
        };
    };

    $functions.push("_GetBoxId");
    const _GetBoxId = function() {
        return 'main.body.' + _GetClassName();
    };

    /**
     * First function to start. Sets up the basic boxes "head" and "body" if not already exist
     *
     * @version 2017-03-08
     * @since 2017-03-08
     * @author Peter Lembke
     */
    $functions.push("startup");
    const startup = function ($in)
    {
        const $default = {
            'step': 'step_start'
        };
        $in = _Default($default, $in);

        if ($in.step === 'step_start') {
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_view',
                    'function': 'init'
                },
                'data': {},
                'data_back': {
                    'step': 'step_tabs'
                }
            });
        }

        if ($in.step === 'step_tabs') {
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_tabs',
                    'function': 'init'
                },
                'data': {
                    'parent_box_id': 'main'
                },
                'data_back': {
                    'step': 'step_setup_plugin_launcher'
                }
            });
        }

        if ($in.step === 'step_setup_plugin_launcher') {
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_workbench',
                    'function': 'setup_plugin'
                },
                'data': {
                    'plugin_name': 'infohub_launcher'
                },
                'data_back': {
                    'step': 'step_apply_config'
                }
            });
        }

        if ($in.step === 'step_apply_config') {
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_configlocal',
                    'function': 'apply_config'
                },
                'data': {},
                'data_back': {
                    'step': 'step_end'
                }
            });
        }

        return {
            'answer': 'true',
            'message': 'Done with setting up the workbench'
        };

    };

    /**
     * Setup a plugin to work in the Workbench
     * @version 2017-10-03
     * @since   2017-10-03
     * @author  Peter Lembke
     */
    $functions.push('setup_plugin');
    const setup_plugin = function ($in)
    {
        const $default = {
            'plugin_name': '',
            'step': 'step_is_plugin_started',
            'response': {},
            'data_back': {}
        };
        $in = _Default($default, $in);

        let $answer = 'false';
        let $message = 'Nothing to report from infohub_workbench -> setup_plugin';

        // Check if plugin is already started. If it is then just switch to the plugin and quit.
        // Call the plugin and get the version data. In here you find title, note, icon (svg)
        // If this is an OK plugin then continue, else give a message.
        // Call Tabs and add tab boxes, box_alias = plugin_name
        // Render the info box and place it in the head_tab_box_id
        // Call node=client, plugin=$in.plugin_name, function=setup_gui, box_id={{body_tab_box_id}}

        if ($in.step === 'step_is_plugin_started')
        {
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_view',
                    'function': 'id_exist'
                },
                'data': {
                    'id': 'main.head.' + $in.plugin_name
                },
                'data_back': {
                    'plugin_name': $in.plugin_name,
                    'step': 'step_is_plugin_started_response'
                }
            });
        }

        if ($in.step === 'step_is_plugin_started_response')
        {
            if ($in.response.exist === 'true') {
                $in.data_back.already_started = 'true';
                $in.step = 'step_highlight_tab';
            } else {
                $in.data_back.already_started = 'false';
                $in.step = 'step_get_launch_information';
            }
        }

        if ($in.step === 'step_get_launch_information')
        {
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_launcher',
                    'function': 'get_launch_information'
                },
                'data': {
                    'plugin_name': $in.plugin_name
                },
                'data_back': {
                    'plugin_name': $in.plugin_name,
                    'already_started': $in.data_back.already_started,
                    'step': 'step_get_launch_information_response'
                }
            });
        }

        if ($in.step === 'step_get_launch_information_response') {
            $in.step = 'step_ping_plugins';
            if ($in.response.answer === 'false') {
                $message = $in.response.data.message;
                $in.step = 'step_end';
            }
        }

        if ($in.step === 'step_ping_plugins')
        {
            // Read launcher.json field "uses" array for plugin names our plugin uses
            let $uses = _GetData({
                'name': 'response/data/uses',
                'default': [],
                'data': $in,
                'split': '/'
            });

            // Add the plugin we want to start to the array
            $uses.push($in.plugin_name);

            // Now we will ping them all. That will produce plugin requests
            // that come in the same package in one request

            let $messagesArray = [];
            let $messageOut = {};

            for (let $nr = 0; $nr < $uses.length; $nr = $nr + 1)
            {
                $messageOut = _SubCall({
                    'to': {
                        'node': 'client',
                        'plugin': $uses[$nr],
                        'function': 'version'
                    },
                    'data': {},
                    'data_back': {
                        'step': 'step_end'
                    }
                });
                $messagesArray.push($messageOut);
            }

            $messageOut = _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_asset',
                    'function': 'update_all_plugin_assets'
                },
                'data': {
                    'plugin_name': $in.plugin_name
                },
                'data_back': {
                    'plugin_name': $in.plugin_name,
                    'already_started': $in.data_back.already_started,
                    'step': 'step_get_launch_information_again'
                }
            });
            $messagesArray.push($messageOut);

            return {
                'answer': 'true',
                'message': 'Sending a message to each plugin that are used by the plugin we want to start. That will do a plugin request from the server if the plugin is missing',
                'messages': $messagesArray
            };
        }

        if ($in.step === 'step_get_launch_information_again')
        {
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_launcher',
                    'function': 'get_launch_information'
                },
                'data': {
                    'plugin_name': $in.plugin_name
                },
                'data_back': {
                    'plugin_name': $in.plugin_name,
                    'already_started': $in.data_back.already_started,
                    'step': 'step_get_launch_information_again_response'
                }
            });
        }

        if ($in.step === 'step_get_launch_information_again_response')
        {
            $in.step = 'step_add_tab';

            if ($in.response.answer === 'false') {
                $message = $in.response.data.message;
                $in.step = 'step_end';
            }

            if ($in.response.answer === 'true') {
                $in.data_back = {
                    'title': $in.response.data.title,
                    'icon': $in.response.data.icon,
                    'icon_license': $in.response.data.icon_license,
                    'note': $in.response.data.note,
                    'plugin_name': $in.plugin_name,
                    'already_started': $in.data_back.already_started,
                    'step': 'step_add_tab'
                };
            }
        }

        if ($in.step === 'step_add_tab')
        {
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_tabs',
                    'function': 'add'
                },
                'data': {
                    'parent_box_id': 'main',
                    'tab_alias': $in.plugin_name
                },
                'data_back': {
                    'title': $in.data_back.title,
                    'icon': $in.data_back.icon,
                    'icon_license': $in.data_back.icon_license,
                    'note': $in.data_back.note,
                    'plugin_name': $in.plugin_name,
                    'already_started': $in.data_back.already_started,
                    'step': 'step_add_icon'
                }
            });
        }

        if ($in.step === 'step_add_icon')
        {
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_render',
                    'function': 'create'
                },
                'data': {
                    'what': {
                        'menuicon': {
                            'type': 'common',
                            'subtype': 'svg',
                            'data': '[menuiconasset]',
                            'alias': 'menuimage',
                            'class': 'svg noselect',
                            'css_data': {
                                '.svg': 'width:64px; height:64px; padding:2px; max-width:80px;'
                            }
                        },
                        'menuiconasset': {
                            'plugin': 'infohub_asset',
                            'type': 'icon',
                            'asset_name': 'icon',
                            'plugin_name': $in.plugin_name
                        },
                        'menutitle': {
                            'type': 'common',
                            'subtype': 'container',
                            'alias': 'menutitle',
                            'class': 'menutitle noselect',
                            'data': $in.data_back.title,
                            'tag': 'div',
                            'css_data': {
                                '.menutitle': 'max-width:78px; padding:1px; font-size:0.9em; text-align:center; height:32px;'
                            }
                        },
                        'menulink': {
                            'type': 'link',
                            'subtype': 'link',
                            'alias': 'menulink',
                            'show': '[menuicon][menutitle]',
                            'legend': 'false',
                            'event_data': $in.plugin_name, // Any string you like to send to the event_message function
                            'to_plugin': 'infohub_tabs',
                            'final_node': 'client',
                            'final_plugin': 'infohub_workbench',
                            'final_function': 'render_long_click_gui',
                            'long_click_event': 'true',
                            'css_data': {
                                '.yes': 'background-color: #b2de98;'
                            }
                        }
                    },
                    'how': {
                        'mode': 'one box',
                        'text': '[menulink]'
                    },
                    'where': {
                        'box_id': 'main.head.' + $in.plugin_name
                    }
                },
                'data_back': {
                    'plugin_name': $in.plugin_name,
                    'already_started': $in.data_back.already_started,
                    'step': 'step_highlight_tab'
                }
            });
        }

        if ($in.step === 'step_highlight_tab')
        {
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_tabs',
                    'function': 'highlight_tab'
                },
                'data': {
                    'parent_box_id': 'main.head',
                    'tab_alias': $in.plugin_name
                },
                'data_back': {
                    'plugin_name': $in.plugin_name,
                    'already_started': $in.data_back.already_started,
                    'step': 'step_hide_siblings'
                }
            });
        }

        if ($in.step === 'step_hide_siblings')
        {
            let $step = 'step_hide_siblings_to_gui';

            if ($in.data_back.already_started === 'true') {
                $answer = 'true';
                $message = 'Plugin is already started';
                $step = 'step_end';
            }

            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_tabs',
                    'function': 'siblings_box_view'
                },
                'data': {
                    'box_id': 'main.body.' + $in.plugin_name
                },
                'data_back': {
                    'plugin_name': $in.plugin_name,
                    'already_started': $in.data_back.already_started,
                    'step': $step
                }
            });
        }

        if ($in.step === 'step_hide_siblings_to_gui')
        {
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_tabs',
                    'function': 'siblings_box_view'
                },
                'data': {
                    'box_id': 'main.body.' + $in.plugin_name
                },
                'data_back': {
                    'plugin_name': $in.plugin_name,
                    'already_started': $in.data_back.already_started,
                    'step': 'step_setup_gui'
                }
            });
        }

        if ($in.step === 'step_setup_gui')
        {
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': $in.plugin_name,
                    'function': 'setup_gui'
                },
                'data': {
                    'box_id': 'main.body.' + $in.plugin_name,
                    'desktop_environment': 'workbench'
                },
                'data_back': {
                    'plugin_name': $in.plugin_name,
                    'step': 'step_scroll_to_box_id'
                }
            });
        }

        if ($in.step === 'step_scroll_to_box_id')
        {
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_view',
                    'function': 'scroll_to_box_id'
                },
                'data': {
                    'box_id': 'main.body.' + $in.plugin_name
                },
                'data_back': {
                    'plugin_name': $in.plugin_name,
                    'step': 'step_end'
                }
            });
        }

        if ($in.step === 'step_scroll_to_box_id_response')
        {
            $answer = 'true';
            $message = 'Plugin is now set up';
        }

        return {
            'answer': $answer,
            'message': $message
        };
    };
}
//# sourceURL=infohub_workbench.js