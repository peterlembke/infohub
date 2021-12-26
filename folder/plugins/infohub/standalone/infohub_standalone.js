/**
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
function infohub_standalone() {

    'use strict';

// include "infohub_base.js"

    $functions.push('_Version');
    const _Version = function() {
        return {
            'date': '2019-03-11',
            'version': '1.0.0',
            'checksum': '{{checksum}}',
            'class_name': 'infohub_standalone',
            'note': 'Start ONE workbench plugin so you can run it without Workbench. Use with a unique domain URL and set it up in folder/config/infohub_exchange.json',
            'status': 'normal',
            'SPDX-License-Identifier': 'GPL-3.0-or-later',
            'title': 'Stand alone',
            'user_role': 'user',
            'web_worker': 'true',
            'core_plugin': 'false',
        };
    };

    $functions.push('_GetCmdFunctions');
    const _GetCmdFunctions = function() {
        const $list = {
            'startup': 'normal',
            'setup_gui': 'normal',
            'setup_plugin': 'normal',
        };

        return _GetCmdFunctionsBase($list);
    };

    $functions.push('_GetBoxId');
    const _GetBoxId = function() {
        return 'main.body.' + _GetClassName();
    };

    // ***********************************************************
    // * your class functions below, only declare with var
    // * Can only be reached through cmd()
    // ***********************************************************

    /**
     * First function to start. Sets up the basic boxes "head" and "body" if not already exist
     *
     * @version 2019-03-11
     * @since 2019-03-11
     * @author Peter Lembke
     */
    $functions.push('startup');
    const startup = function($in = {}) {
        const $default = {
            'step': 'step_start',
            'plugin_name': '',
        };
        $in = _Default($default, $in);

        if ($in.step === 'step_start') {
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_view',
                    'function': 'init',
                },
                'data': {},
                'data_back': {
                    'plugin_name': $in.plugin_name,
                    'step': 'step_setup_boxes',
                },
            });
        }

        if ($in.step === 'step_setup_boxes') {
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_tabs',
                    'function': 'init',
                },
                'data': {
                    'parent_box_id': 'main',
                },
                'data_back': {
                    'plugin_name': $in.plugin_name,
                    'step': 'step_apply_config',
                },
            });
        }

        if ($in.step === 'step_apply_config') {
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_configlocal',
                    'function': 'apply_config',
                },
                'data': {},
                'data_back': {
                    'plugin_name': $in.plugin_name,
                    'step': 'step_setup_plugin',
                },
            });
        }

        if ($in.step === 'step_setup_plugin') {
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_standalone',
                    'function': 'setup_plugin',
                },
                'data': {
                    'plugin_name': $in.plugin_name,
                },
                'data_back': {
                    'step': 'step_end',
                },
            });
        }

        return {
            'answer': 'true',
            'message': 'Done with setting up the standalone',
        };

    };

    /**
     * Set up a plugin to work in StandAlone
     * @version 2019-03-11
     * @since   2019-03-11
     * @author  Peter Lembke
     */
    $functions.push('setup_plugin');
    const setup_plugin = function($in = {}) {
        const $default = {
            'plugin_name': '',
            'step': 'step_is_plugin_started',
            'response': {},
            'data_back': {},
        };
        $in = _Default($default, $in);

        let $answer = 'false';
        let $message = 'Nothing to report from infohub_standalone -> setup_plugin';

        // Check if plugin is already started. If it is then just switch to the plugin and quit.
        // Call the plugin and get the version data. In here you find title, note, icon (svg)
        // If this is an OK plugin then continue, else give a message.
        // Call Tabs and add tab boxes, box_alias = plugin_name
        // Render the info box and place it in the head_tab_box_id
        // Call node=client, plugin=$in.plugin_name, function=setup_gui, box_id={{body_tab_box_id}}

        if ($in.step === 'step_is_plugin_started') {
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_view',
                    'function': 'id_exist',
                },
                'data': {
                    'id': 'main.head.' + $in.plugin_name,
                },
                'data_back': {
                    'plugin_name': $in.plugin_name,
                    'step': 'step_is_plugin_started_response',
                },
            });
        }

        if ($in.step === 'step_is_plugin_started_response') {
            if ($in.response.exist === 'true') {
                $in.data_back.already_started = 'true';
                $in.step = 'step_update_plugin_assets';
            } else {
                $in.data_back.already_started = 'false';
                $in.step = 'step_update_plugin_assets';
            }
        }

        if ($in.step === 'step_update_plugin_assets') {
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_asset',
                    'function': 'update_all_plugin_assets',
                },
                'data': {
                    'plugin_name': $in.plugin_name,
                },
                'data_back': {
                    'plugin_name': $in.plugin_name,
                    'already_started': $in.data_back.already_started,
                    'step': 'step_add_tab',
                },
            });
        }

        if ($in.step === 'step_add_tab') {
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_tabs',
                    'function': 'add',
                },
                'data': {
                    'parent_box_id': 'main',
                    'tab_alias': $in.plugin_name,
                },
                'data_back': {
                    'title': '',
                    'icon': '',
                    'icon_license': '',
                    'note': '',
                    'plugin_name': $in.plugin_name,
                    'already_started': $in.data_back.already_started,
                    'step': 'step_setup_gui',
                },
            });
        }

        if ($in.step === 'step_setup_gui') {
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': $in.plugin_name,
                    'function': 'setup_gui',
                },
                'data': {
                    'box_id': 'main.body.' + $in.plugin_name,
                    'desktop_environment': 'standalone',
                },
                'data_back': {
                    'plugin_name': $in.plugin_name,
                    'step': 'step_scroll_to_box_id',
                },
            });
        }

        if ($in.step === 'step_scroll_to_box_id') {
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_view',
                    'function': 'scroll_to_box_id',
                },
                'data': {
                    'box_id': 'main.body.' + $in.plugin_name,
                },
                'data_back': {
                    'plugin_name': $in.plugin_name,
                    'step': 'step_end',
                },
            });
        }

        if ($in.step === 'step_scroll_to_box_id_response') {
            $answer = 'true';
            $message = 'Plugin is now set up';
        }

        return {
            'answer': $answer,
            'message': $message,
        };
    };
}

//# sourceURL=infohub_standalone.js