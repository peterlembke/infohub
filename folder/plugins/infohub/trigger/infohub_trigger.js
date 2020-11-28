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
function infohub_trigger() {

    "use strict";

// include "infohub_base.js"

    const _Version = function() {
        return {
            'date': '2020-08-17',
            'since': '2020-08-12',
            'version': '1.0.0',
            'checksum': '{{checksum}}',
            'class_name': 'infohub_trigger',
            'note': 'Helps developers to send messages to the cmd functions in their emerging plugins',
            'status': 'normal',
            'SPDX-License-Identifier': 'GPL-3.0-or-later',
            'title': 'Trigger',
            'user_role': 'developer'
        };
    };
    
    const _GetCmdFunctions = function() {
        const $list = {
            'setup_gui': 'normal',
            'click_node': 'normal',
            'click_plugin': 'normal',
            'click_get_default_message': 'normal',
            'click_send': 'normal',
            'click_refresh_plugin_list': 'normal',
            'get_plugin_list': 'normal',
            'update_plugin_list': 'normal'
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
            'default': $string,
            'data': $classTranslations,
            'split': '|'
        });
    };

    // ***********************************************************
    // * your class functions below, only declare with var
    // * Can only be reached trough cmd()
    // ***********************************************************

    /**
     * Setup the Workbench Graphical User Interface
     * @version 2019-03-13
     * @since   2017-10-03
     * @author  Peter Lembke
     */
    $functions.push('setup_gui');
    const setup_gui = function ($in)
    {
        const $default = {
            'box_id': '',
            'step': 'step_get_translations',
            'response': {
                'answer': '',
                'message': '',
                'data': {}
            }
        };
        $in = _Merge($default, $in);

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
            $in.step = 'step_render_gui';
        }

        if ($in.step === 'step_render_gui') {
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_render',
                    'function': 'create'
                },
                'data': {
                    'what': {
                        'my_form': {
                            'plugin': 'infohub_renderform',
                            'type': 'form',
                            'content': '[button_refresh_plugin_list][select_node][select_plugin][select_function][button_get_default][textarea_message][select_filter][button_send][textarea_response]',
                            'label': _Translate('Trigger'),
                            'description': _Translate('You as a developer can send a message to your emerging plugin.')
                        },
                        'button_refresh_plugin_list': {
                            'plugin': 'infohub_renderform',
                            'type': 'button',
                            'mode': 'button',
                            'button_label': _Translate('Refresh data'),
                            'button_left_icon': '[refresh_icon]',
                            'event_data': 'refresh',
                            'to_plugin': 'infohub_trigger',
                            'to_function': 'click_refresh_plugin_list'
                        },
                        'refresh_icon': {
                            'type': 'common',
                            'subtype': 'svg',
                            'data': '[refresh_asset]'
                        },
                        'refresh_asset': {
                            'plugin': 'infohub_asset',
                            'type': 'icon',
                            'asset_name': 'refresh',
                            'plugin_name': 'infohub_trigger'
                        },
                        'select_node': {
                            'plugin': 'infohub_renderform',
                            'type': 'select',
                            "label": _Translate("Node"),
                            "description": _Translate("Select the node you want to send the message to"),
                            "size": "1",
                            "multiple": "false",
                            'to_plugin': 'infohub_trigger',
                            'to_function': 'click_node',
                            "options": [
                                { "type": "option", "value": "", "label": "" },
                                { "type": "option", "value": "client", "label": _Translate("Client") },
                                { "type": "option", "value": "server", "label": _Translate("Server") }
                            ]
                        },
                        'select_plugin': {
                            'plugin': 'infohub_renderform',
                            'type': 'select',
                            "label": _Translate("Plugin"),
                            "description": _Translate("Select the plugin you want to send the message to"),
                            "size": "1",
                            "multiple": "false",
                            'to_plugin': 'infohub_trigger',
                            'to_function': 'click_plugin',
                            "options": []
                        },
                        'select_function': {
                            'plugin': 'infohub_renderform',
                            'type': 'select',
                            "label": _Translate("Function"),
                            "description": _Translate("Select the function you want to send the message to"),
                            "size": "1",
                            "multiple": "false",
                            "options": []
                        },
                        'select_filter': {
                            'plugin': 'infohub_renderform',
                            'type': 'select',
                            "label": _Translate("Filter"),
                            "description": _Translate("Select the filter you want to run on the response"),
                            "size": "1",
                            "multiple": "false",
                            "options": [
                                { "type": "option", "value": "get_all", "label": _Translate("Get all") },
                                { "type": "option", "value": "no_config", "label": _Translate("No config") },
                                { "type": "option", "value": "bare_bone", "label": _Translate("Bare bone") }
                            ]
                        },
                        'textarea_message': {
                            'plugin': 'infohub_renderform',
                            'type': 'textarea',
                            'placeholder': _Translate('Default message for the selected function'),
                            "label": _Translate("Message"),
                            "description": _Translate("This is the message you can send to the selected plugin. The message you see is the default values the function have set."),
                            'resize': 'both',
                            'rows': 8,
                            'cols': 80
                        },
                        'button_get_default': {
                            'plugin': 'infohub_renderform',
                            'type': 'button',
                            'mode': 'button',
                            'button_label': _Translate('Get default message'),
                            'button_left_icon': '[refresh_icon]',
                            'event_data': 'refresh',
                            'to_plugin': 'infohub_trigger',
                            'to_function': 'click_get_default_message'
                        },
                        'button_send': {
                            'plugin': 'infohub_renderform',
                            'type': 'button',
                            'mode': 'button',
                            'button_label': _Translate('Send message'),
                            'button_left_icon': '[ping_icon]',
                            'event_data': 'send',
                            'to_plugin': 'infohub_trigger',
                            'to_function': 'click_send'
                        },
                        'ping_icon': {
                            'type': 'common',
                            'subtype': 'svg',
                            'data': '[ping_asset]'
                        },
                        'ping_asset': {
                            'plugin': 'infohub_asset',
                            'type': 'icon',
                            'asset_name': 'ping',
                            'plugin_name': 'infohub_trigger'
                        },
                        'textarea_response': {
                            'plugin': 'infohub_renderform',
                            'type': 'textarea',
                            'placeholder': _Translate('Response from the function'),
                            "label": _Translate("Response"),
                            "description": _Translate("Here you will see the response from the function."),
                            'resize': 'both',
                            'rows': 12,
                            'cols': 80
                        },
                    },
                    'how': {
                        'mode': 'one box',
                        'text': '[my_form]'
                    },
                    'where': {
                        'box_id': 'main.body.infohub_trigger',
                        'max_width': 640,
                        'scroll_to_box_id': 'false'
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
     * When selecting a node
     * Will update the plugins list
     * @version 2020-08-12
     * @since 2020-08-12
     * @author Peter Lembke
     */
    $functions.push("click_node");
    const click_node = function ($in)
    {
        const $default = {
            'value': '', // Selected option in select lists
            'box_id': '', // The box we are in
            'step': 'step_get_plugin_list',
            'response': {
                'answer': 'false',
                'message': 'There was an error',
                'data': {}
            }
        };
        $in = _Default($default, $in);

        let $out = {
            'answer': 'false',
            'message': 'Nothing to report from click_node',
            'ok': 'false'
        };

        if ($in.step === 'step_get_plugin_list') {
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_trigger',
                    'function': 'get_plugin_list'
                },
                'data': {},
                'data_back': {
                    'value': $in.value, // Selected option in select lists
                    'box_id': $in.box_id, // The box we are in
                    'step': 'step_get_plugin_list_response'
                }
            });
        }

        if ($in.step === 'step_get_plugin_list_response') {
            $in.step = 'step_populate_plugin_name_dropdown';
            if ($in.response.answer === 'false') {
                $out.message = $in.response.message;
                $in.step = 'step_end';
            }
        }

        if ($in.step === 'step_populate_plugin_name_dropdown') {
            const $data = $in.response.data;
            const $list = $data[$in.value];

            let $pluginNameArray = [];
            $pluginNameArray.push('');
            for (let $pluginName in $list) {
                if ($list.hasOwnProperty($pluginName) === false) {
                    continue;
                }
                $pluginNameArray.push($pluginName);
            }

            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_view',
                    'function': 'form_write'
                },
                'data': {
                    'id': $in.box_id + '_my_form_form',
                    'form_data': {
                        'select_plugin': {'value': $pluginNameArray, 'mode': 'clean_and_add' }
                    }
                },
                'data_back': {
                    'step': 'step_populate_plugin_name_dropdown_response'
                }
            });
        }

        if ($in.step === 'step_populate_plugin_name_dropdown_response') {
            $out = $in.response;
            $out.ok = $out.answer;
        }

        return {
            'answer': $out.answer,
            'message': $out.message,
            'ok': $out.ok
        };
    };

    /**
     * Give data and get an option list
     * @param $data
     * @private
     */
    const _CreateOptionList = function($data)
    {
        let $list = [];
        for (let $key in $data) {
            if ($data.hasOwnProperty($key) === false) {
                continue;
            }

            $list.push({
                "type": "option",
                "value": $key,
                "label": $key
            });
        }

        return $list;
    };

    /**
     * When selecting a plugin
     * Will update the plugin functions list
     * @version 2020-08-12
     * @since 2020-08-12
     * @author Peter Lembke
     */
    $functions.push("click_plugin");
    const click_plugin = function ($in)
    {
        const $default = {
            'value': '', // Selected option in select lists
            'box_id': '', // The box we are in
            'step': 'step_get_selected_node',
            'response': {},
            'data_back': {
                'node': ''
            }
        };
        $in = _Default($default, $in);

        let $out = {
            'answer': 'false',
            'message': 'Nothing to report from ' + _GetClassName() + ' -> click_plugin',
            'ok': 'false'
        };

        if ($in.step === 'step_get_selected_node') {
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_view',
                    'function': 'form_read'
                },
                'data': {
                    'id': $in.box_id + '_my_form_form'
                },
                'data_back': {
                    'value': $in.value, // Selected option in select lists
                    'box_id': $in.box_id, // The box we are in
                    'step': 'step_get_selected_node_response'
                }
            });
        }

        if ($in.step === 'step_get_selected_node_response') {
            const $default = {
                'answer': 'false',
                'message': 'There was an error',
                'form_data': {},
                'node': ''
            };
            $in.response = _Default($default, $in.response);

            $in.data_back.node = _GetData({
                'name': 'response/form_data/select_node/value/0',
                'default': '',
                'data': $in
            });

            $in.step = 'step_get_function_list';
        }

        if ($in.step === 'step_get_function_list') {
            return _SubCall({
                'to': {
                    'node': $in.data_back.node,
                    'plugin': $in.value,
                    'function': 'function_names'
                },
                'data': {
                    'include_cmd_functions': 'true',
                    'include_internal_functions': 'false',
                    'include_direct_functions': 'false'
                },
                'data_back': {
                    'value': $in.value, // Selected option in select lists
                    'box_id': $in.box_id, // The box we are in
                    'node': $in.data_back.node,
                    'step': 'step_get_function_list_response'
                }
            });
        }

        if ($in.step === 'step_get_function_list_response') {
            $in.step = 'step_populate_function_name_dropdown';
            if ($in.response.answer === 'false') {
                $out.message = $in.response.message;
                $in.step = 'step_end';
            }
        }

        if ($in.step === 'step_populate_function_name_dropdown') {
            const $pluginNameArray = $in.response.data;

            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_view',
                    'function': 'form_write'
                },
                'data': {
                    'id': $in.box_id + '_my_form_form',
                    'form_data': {
                        'select_function': {'value': $pluginNameArray, 'mode': 'clean_and_add' }
                    }
                },
                'data_back': {
                    'step': 'step_populate_function_name_dropdown_response'
                }
            });
        }

        if ($in.step === 'step_populate_function_name_dropdown_response') {
            $out = $in.response;
            $out.ok = $out.answer;
        }

        return {
            'answer': $out.answer,
            'message': $out.message,
            'ok': $out.ok
        };
    };

    /**
     * Send an empty message to the plugin function and get the default in parameters
     * Show them in the message box as pretty JSON
     * @version 2020-08-13
     * @since 2020-08-13
     * @author Peter Lembke
     */
    $functions.push("click_get_default_message");
    const click_get_default_message = function ($in)
    {
        const $default = {
            'box_id': '',
            'step': 'step_get_form_data',
            'response': {
                'answer': 'false',
                'message': 'There was an error',
                'ok': 'false',
                'form_data': {}
            },
            'data_back': {
                'node': '',
                'plugin': '',
                'function': ''
            },
            'first_default': {}
        };
        $in = _Default($default, $in);

        if ($in.step === 'step_get_form_data') {
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_view',
                    'function': 'form_read'
                },
                'data': {
                    'id': $in.box_id + '_my_form_form'
                },
                'data_back': {
                    'value': $in.value, // Selected option in select lists
                    'box_id': $in.box_id, // The box we are in
                    'step': 'step_get_form_data_response'
                }
            });
        }

        if ($in.step === 'step_get_form_data_response') {
            const $default = {
                'answer': 'false',
                'message': 'There was an error',
                'form_data': {},
                'node': ''
            };
            $in.response = _Default($default, $in.response);

            $in.data_back.node = _GetData({
                'name': 'response/form_data/select_node/value/0',
                'default': '',
                'data': $in
            });

            $in.data_back.plugin = _GetData({
                'name': 'response/form_data/select_plugin/value/0',
                'default': '',
                'data': $in
            });

            $in.data_back.function = _GetData({
                'name': 'response/form_data/select_function/value/0',
                'default': '',
                'data': $in
            });

            $in.step = 'step_get_default_message';
        }

        if ($in.step === 'step_get_default_message') {
            return _SubCall({
                'to': {
                    'node': $in.data_back.node,
                    'plugin': $in.data_back.plugin,
                    'function': $in.data_back.function
                },
                'data': {

                },
                'data_back': {
                    'value': $in.value, // Selected option in select lists
                    'box_id': $in.box_id, // The box we are in
                    'step': 'step_get_default_message_response'
                }
            });
        }

        if ($in.step === 'step_get_default_message_response') {
            $in.step = 'step_show_default_message';
            if ($in.response.answer === 'false') {
                $in.step = 'step_end';
            }
        }

        if ($in.step === 'step_show_default_message') {
            const $firstDefault = _JsonEncode($in.first_default);

            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_view',
                    'function': 'form_write'
                },
                'data': {
                    'id': $in.box_id + '_my_form_form',
                    'form_data': {
                        'textarea_message': {'value': $firstDefault }
                    }
                },
                'data_back': {
                    'step': 'step_show_default_message_response'
                }
            });
        }

        if ($in.step === 'step_show_default_message_response') {

        }

        return {
            'answer': $in.response.answer,
            'message': $in.response.message,
            'ok': $in.response.answer
        };
    };

    /**
     * Send the message to the node plugin function
     * Filter the response and show as pretty JSON in the response textarea
     * @version 2020-08-13
     * @since 2020-08-13
     * @author Peter Lembke
     */
    $functions.push("click_send");
    const click_send = function ($in)
    {
        const $default = {
            'box_id': '',
            'step': 'step_get_form_data',
            'response': {},
            'data_back': {
                'node': '',
                'plugin': '',
                'function': '',
                'message_data': {},
                'filter': '',
                'filtered_response': {}
            },
            'first_default': {}
        };
        $in = _Default($default, $in);

        if ($in.step === 'step_get_form_data') {
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_view',
                    'function': 'form_read'
                },
                'data': {
                    'id': $in.box_id + '_my_form_form'
                },
                'data_back': {
                    'value': $in.value, // Selected option in select lists
                    'box_id': $in.box_id, // The box we are in
                    'step': 'step_get_form_data_response'
                }
            });
        }

        if ($in.step === 'step_get_form_data_response') {
            const $default = {
                'answer': 'false',
                'message': 'There was an error',
                'form_data': {}
            };
            $in.response = _Default($default, $in.response);

            $in.data_back.node = _GetData({
                'name': 'response/form_data/select_node/value/0',
                'default': '',
                'data': $in
            });

            $in.data_back.plugin = _GetData({
                'name': 'response/form_data/select_plugin/value/0',
                'default': '',
                'data': $in
            });

            $in.data_back.function = _GetData({
                'name': 'response/form_data/select_function/value/0',
                'default': '',
                'data': $in
            });

            $in.data_back.message_data = _JsonDecode(_GetData({
                'name': 'response/form_data/textarea_message/value',
                'default': '{}',
                'data': $in
            }));

            $in.data_back.filter = _GetData({
                'name': 'response/form_data/select_filter/value/0',
                'default': '',
                'data': $in
            });

            $in.step = 'step_send_message';
        }

        if ($in.step === 'step_send_message') {
            return _SubCall({
                'to': {
                    'node': $in.data_back.node,
                    'plugin': $in.data_back.plugin,
                    'function': $in.data_back.function
                },
                'data': $in.data_back.message_data,
                'data_back': {
                    'value': $in.value, // Selected option in select lists
                    'box_id': $in.box_id, // The box we are in
                    'filter': $in.data_back.filter,
                    'step': 'step_send_message_response'
                }
            });
        }

        if ($in.step === 'step_send_message_response') {
            const $default = {
                'answer': 'false',
                'message': 'There was an error'
            };
            $in.response = _Merge($default, $in.response);

            $in.step = 'step_filter_response';

            if ($in.response.answer === 'false') {
                $in.step = 'step_end';
            }
        }

        if ($in.step === 'step_filter_response') {

            let $response = $in.response;
            const $filter = $in.data_back.filter;

            if ($filter === 'bare_bone') {
                delete($response.first_default);
                delete($response.config);
            }

            if ($filter === 'no_config') {
                delete($response.config);
            }

            $in.data_back.filtered_response = _ByVal($response);
            $in.step = 'step_show_response';
        }

        if ($in.step === 'step_show_response') {

            const $filteredResponseJson = _JsonEncode($in.data_back.filtered_response);

            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_view',
                    'function': 'form_write'
                },
                'data': {
                    'id': $in.box_id + '_my_form_form',
                    'form_data': {
                        'textarea_response': {'value': $filteredResponseJson }
                    }
                },
                'data_back': {
                    'step': 'step_show_default_message_response'
                }
            });
        }

        if ($in.step === 'step_show_default_message_response') {

        }

        return {
            'answer': $in.response.answer,
            'message': $in.response.message,
            'ok': $in.response.answer
        };
    };

    /**
     * Click refresh to get new data from the server about the plugins for both nodes
     * @version 2020-08-13
     * @since 2020-08-13
     * @author Peter Lembke
     */
    $functions.push("click_refresh_plugin_list");
    const click_refresh_plugin_list = function ($in)
    {
        const $default = {
            'box_id': '',
            'step': 'step_start',
            'response': {
                'answer': 'false',
                'message': 'There was an error',
                'ok': 'false'
            }
        };
        $in = _Default($default, $in);

        if ($in.step === 'step_start') {
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_trigger',
                    'function': 'update_plugin_list'
                },
                'data': {},
                'data_back': {
                    'box_id': $in.box_id,
                    'step': 'step_end'
                }
            });
        }

        return {
            'answer': $in.response.answer,
            'message': $in.response.message,
            'ok': $in.response.answer
        };
    };

    /**
     * Get the function list from local Storage.
     * If not there then update from the server and try again.
     * @version 2020-08-17
     * @since 2020-08-17
     * @author Peter Lembke
     */
    $functions.push("get_plugin_list");
    const get_plugin_list = function ($in)
    {
        const $default = {
            'use_local_version_if_available': 'true',
            'step': 'step_start',
            'response': {
                'answer': 'false',
                'message': '',
                'data': {},
                'post_exist': 'false'
            }
        };
        $in = _Default($default, $in);

        let $out = {
            'answer': 'false',
            'message': 'Nothing to report from ' + _GetClassName() + ' -> get_plugin_list',
            'data': {}
        };

        if ($in.step === 'step_start') {
            $in.step = 'step_read_from_storage';
            if ($in.use_local_version_if_available === false) {
                $in.step = 'step_update_plugin_list';
            }
        }

        if ($in.step === 'step_update_plugin_list_response') {

            $in.step = 'step_end';
            $out = $in.response;

            if ($in.response.answer === 'true') {
                $in.step = 'step_read_from_storage';
            }
        }

        if ($in.step === 'step_read_from_storage') {
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_storage',
                    'function': 'read'
                },
                'data': {
                    'path': 'infohub_trigger/plugin_list'
                },
                'data_back': {
                    'use_local_version_if_available': $in.use_local_version_if_available,
                    'step': 'step_read_from_storage_response'
                }
            });
        }

        if ($in.step === 'step_read_from_storage_response') {

            $in.step = 'step_update_plugin_list';

            if ($in.response.answer === 'false') {
                $out = $in.response;
                $in.step = 'step_end';
            }

            if ($in.response.post_exist === 'true') {
                $out = $in.response;
                $in.step = 'step_end';
            }
        }

        if ($in.step === 'step_update_plugin_list') {
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_trigger',
                    'function': 'update_plugin_list'
                },
                'data': {},
                'data_back': {
                    'use_local_version_if_available': $in.use_local_version_if_available,
                    'step': 'step_update_plugin_list_response'
                }
            });
        }

        return {
            'answer': $out.answer,
            'message': $out.message,
            'data': $out.data
        };
    };

    /**
     * Makes sure we have the latest list with all nodes, plugins and functions
     * @version 2020-08-16
     * @since 2020-08-16
     * @author Peter Lembke
     */
    $functions.push("update_plugin_list");
    const update_plugin_list = function ($in)
    {
        const $default = {
            'step': 'step_call_server',
            'response': {
                'answer': 'false',
                'message': '',
                'data': {}
            }
        };
        $in = _Default($default, $in);

        let $out = {
            'answer': 'false',
            'message': 'Nothing to report from ' + _GetClassName() + ' -> update_plugin_list',
        };

        if ($in.step === 'step_call_server') {
            return _SubCall({
                'to': {
                    'node': 'server',
                    'plugin': 'infohub_trigger',
                    'function': 'get_plugin_list'
                },
                'data': {},
                'data_back': {
                    'step': 'step_call_server_response'
                }
            });
        }

        if ($in.step === 'step_call_server_response') {

            $out.message = $in.response.message;
            $in.step = 'step_end';

            if ($in.response.answer === 'true') {
                $in.step = 'step_save_to_storage';
            }
        }

        if ($in.step === 'step_save_to_storage') {
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_storage',
                    'function': 'write'
                },
                'data': {
                    'path': 'infohub_trigger/plugin_list',
                    'data': $in.response.data
                },
                'data_back': {
                    'step': 'step_save_to_storage_response'
                }
            });
        }

        if ($in.step === 'step_save_to_storage_response') {
            $out.answer = $in.response.answer;
            $out.message = $in.response.message;
            if ($out.answer === 'true') {
                $out.message = 'Plugin list updated';
            }
        }

        return {
            'answer': $out.answer,
            'message': $out.message
        };
    };
}
//# sourceURL=infohub_trigger.js