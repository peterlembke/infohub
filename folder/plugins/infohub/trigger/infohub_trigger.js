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

    'use strict';

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
            'user_role': 'developer',
            'web_worker': 'true',
            'core_plugin': 'false',
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
            'click_filter': 'normal',
            'get_plugin_list': 'normal',
            'update_plugin_list': 'normal',
            'populate_gui': 'normal'
        };

        return _GetCmdFunctionsBase($list);
    };

    let $classTranslations = {};

    // ***********************************************************
    // * your class functions below, only declare with var
    // * Can only be reached through cmd()
    // ***********************************************************

    $functions.push('setup_gui');
    /**
     * Set up the Workbench Graphical User Interface
     *
     * @version 2019-03-13
     * @since   2017-10-03
     * @author  Peter Lembke
     * @param $in
     * @returns {{answer: string, message: string}|*}
     */
    const setup_gui = function($in = {}) {
        const $default = {
            'box_id': '',
            'step': 'step_get_translations',
            'response': {
                'answer': '',
                'message': '',
                'data': {},
            },
        };
        $in = _Merge($default, $in);

        if ($in.step === 'step_get_translations') {
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_translate',
                    'function': 'get_translate_data',
                },
                'data': {},
                'data_back': {
                    'box_id': $in.box_id,
                    'step': 'step_get_translations_response',
                },
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
                    'function': 'create',
                },
                'data': {
                    'what': {
                        'my_form': {
                            'plugin': 'infohub_renderform',
                            'type': 'form',
                            'content': '[button_refresh_plugin_list][select_node][select_plugin][select_function][button_get_default][textarea_message_hidden][textarea_message][button_send][textarea_response_hidden][textarea_response]',
                            'label': _Translate('TRIGGER'),
                            'description': _Translate('YOU_AS_A_DEVELOPER_CAN_SEND_A_MESSAGE_TO_YOUR_EMERGING_PLUGIN.')
                        },
                        'button_refresh_plugin_list': {
                            'plugin': 'infohub_renderform',
                            'type': 'button',
                            'mode': 'button',
                            'button_label': _Translate('REFRESH_DATA'),
                            'button_left_icon': '[refresh_icon]',
                            'event_data': 'refresh',
                            'to_plugin': 'infohub_trigger',
                            'to_function': 'click_refresh_plugin_list',
                        },
                        'refresh_icon': {
                            'type': 'common',
                            'subtype': 'svg',
                            'data': '[refresh_asset]',
                        },
                        'refresh_asset': {
                            'plugin': 'infohub_asset',
                            'type': 'icon',
                            'asset_name': 'refresh',
                            'plugin_name': 'infohub_trigger',
                        },
                        'select_node': {
                            'plugin': 'infohub_renderform',
                            'type': 'select',
                            "label": _Translate("NODE"),
                            "description": _Translate("SELECT_THE_NODE_YOU_WANT_TO_SEND_THE_MESSAGE_TO"),
                            "size": "1",
                            "multiple": "false",
                            'to_plugin': 'infohub_trigger',
                            'to_function': 'click_node',
                            "options": [
                                { "type": "option", "value": "", "label": "" },
                                { "type": "option", "value": "client", "label": _Translate("CLIENT") },
                                { "type": "option", "value": "server", "label": _Translate("SERVER") }
                            ]
                        },
                        'select_plugin': {
                            'plugin': 'infohub_renderform',
                            'type': 'select',
                            "label": _Translate("PLUGIN"),
                            "description": _Translate("SELECT_THE_PLUGIN_YOU_WANT_TO_SEND_THE_MESSAGE_TO"),
                            "size": "1",
                            "multiple": "false",
                            'to_plugin': 'infohub_trigger',
                            'to_function': 'click_plugin',
                            'options': [],
                        },
                        'select_function': {
                            'plugin': 'infohub_renderform',
                            'type': 'select',
                            "label": _Translate("FUNCTION"),
                            "description": _Translate("SELECT_THE_FUNCTION_YOU_WANT_TO_SEND_THE_MESSAGE_TO"),
                            "size": "1",
                            "multiple": "false",
                            "options": []
                        },
                        'textarea_message_hidden': {
                            'type': 'form',
                            'subtype': 'textarea',
                            'display': 'none'
                        },
                        'textarea_message': {
                            'plugin': 'infohub_renderform',
                            'type': 'textarea',
                            'placeholder': _Translate('DEFAULT_MESSAGE_FOR_THE_SELECTED_FUNCTION'),
                            "label": _Translate("MESSAGE"),
                            "description": _Translate('THIS_IS_THE_MESSAGE_YOU_CAN_SEND_TO_THE_SELECTED_PLUGIN.') + ' ' + _Translate('THE_MESSAGE_YOU_SEE_IS_THE_DEFAULT_VALUES_THE_FUNCTION_HAVE_SET.') + '[filter_default_radios]',
                            'resize': 'both',
                            'rows': 8,
                            'cols': 80,
                        },
                        'filter_default_radios': {
                            'type': 'form',
                            'subtype': 'radios',
                            'group_name': 'filter_default',
                            'to_plugin': 'infohub_trigger',
                            'to_function': 'click_filter',
                            "options": [
                                { "group_name": "filter_default", "value": "get_all", "label": _Translate("GET_ALL") },
                                { "group_name": "filter_default", "value": "bare_bone", "label": _Translate("BARE_BONE"), 'selected': 'true' },
                            ]
                        },
                        'button_get_default': {
                            'plugin': 'infohub_renderform',
                            'type': 'button',
                            'mode': 'button',
                            'button_label': _Translate('GET_DEFAULT_MESSAGE'),
                            'button_left_icon': '[refresh_icon]',
                            'event_data': 'refresh',
                            'to_plugin': 'infohub_trigger',
                            'to_function': 'click_get_default_message',
                        },
                        'button_send': {
                            'plugin': 'infohub_renderform',
                            'type': 'button',
                            'mode': 'button',
                            'button_label': _Translate('SEND_MESSAGE'),
                            'button_left_icon': '[ping_icon]',
                            'event_data': 'send',
                            'to_plugin': 'infohub_trigger',
                            'to_function': 'click_send',
                        },
                        'ping_icon': {
                            'type': 'common',
                            'subtype': 'svg',
                            'data': '[ping_asset]',
                        },
                        'ping_asset': {
                            'plugin': 'infohub_asset',
                            'type': 'icon',
                            'asset_name': 'ping',
                            'plugin_name': 'infohub_trigger',
                        },
                        'textarea_response_hidden': {
                            'type': 'form',
                            'subtype': 'textarea',
                            'display': 'none'
                        },
                        'textarea_response': {
                            'plugin': 'infohub_renderform',
                            'type': 'textarea',
                            'placeholder': _Translate('RESPONSE_FROM_THE_FUNCTION'),
                            "label": _Translate("RESPONSE"),
                            "description": _Translate("HERE_YOU_WILL_SEE_THE_RESPONSE_FROM_THE_FUNCTION.") + '[filter_response_radios]',
                            'resize': 'both',
                            'rows': 12,
                            'cols': 80,
                        },
                        'filter_response_radios': {
                            'type': 'form',
                            'subtype': 'radios',
                            'group_name': 'filter_response',
                            'to_plugin': 'infohub_trigger',
                            'to_function': 'click_filter',
                            "options": [
                                { "group_name": "filter_response", "value": "get_all", "label": _Translate("GET_ALL") },
                                { "group_name": "filter_response", "value": "no_config", "label": _Translate("NO_CONFIG") },
                                { "group_name": "filter_response", "value": "bare_bone", "label": _Translate("BARE_BONE"), 'selected': 'true' },
                            ]
                        },
                    },
                    'how': {
                        'mode': 'one box',
                        'text': '[my_form]',
                    },
                    'where': {
                        'box_id': 'main.body.infohub_trigger',
                        'max_width': 640,
                        'scroll_to_box_id': 'false',
                    },
                },
                'data_back': {
                    'step': 'step_populate_gui',
                },
            });
        }

        if ($in['step'] === 'step_populate_gui') {
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_trigger',
                    'function': 'populate_gui',
                },
                'data': {
                    'box_id': 'main.body.infohub_trigger'
                },
                'data_back': {
                    'step': 'step_end',
                },
            });
        }

        return {
            'answer': 'true',
            'message': 'plugin GUI is done',
        };
    };

    $functions.push('click_node');
    /**
     * When selecting a node
     * Will update the plugins list
     *
     * @version 2020-08-12
     * @since 2020-08-12
     * @author Peter Lembke
     * @param $in
     * @returns {{answer: string, message: string, ok: string}|*}
     */
    const click_node = function($in = {}) {
        const $default = {
            'box_id': '', // The box we are in
            'value': '', // Selected node name
            'step': 'step_get_plugin_list',
            'response': {
                'answer': 'false',
                'message': 'There was an error',
                'data': {},
            },
        };
        $in = _Default($default, $in);

        let $out = {
            'answer': 'false',
            'message': 'Nothing to report from click_node',
            'ok': 'false',
        };

        if ($in.step === 'step_get_plugin_list') {
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_trigger',
                    'function': 'get_plugin_list',
                },
                'data': {},
                'data_back': {
                    'box_id': $in.box_id, // The box we are in
                    'value': $in.value, // Selected option in select lists
                    'step': 'step_get_plugin_list_response',
                },
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
            const $pluginListForNode = $data[$in.value];

            let $pluginNameArray = [];
            $pluginNameArray.push('');
            for (let $pluginName in $pluginListForNode) {
                if ($pluginListForNode.hasOwnProperty($pluginName) === false) {
                    continue;
                }
                $pluginNameArray.push($pluginName);
            }

            const $optionList = _CreateOptionList($pluginNameArray, '');

            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_view',
                    'function': 'form_write',
                },
                'data': {
                    'id': $in.box_id + '.[my_form_form]',
                    'form_data': {
                        'select_plugin': {
                            'value': $optionList,
                            'mode': 'clean_add_select',
                        },
                    },
                },
                'data_back': {
                    'box_id': $in.box_id, // The box we are in
                    'value': $in.value, // Selected option in select lists
                    'step': 'step_populate_plugin_name_dropdown_response',
                },
            });
        }

        if ($in.step === 'step_populate_plugin_name_dropdown_response') {
            $out = $in.response;
            $out.ok = $out.answer;
            if ($out.answer === 'true') {
                $out.message = 'Have handled the click_node event';
            }
        }

        return {
            'answer': $out.answer,
            'message': $out.message,
            'ok': $out.ok,
        };
    };

    $functions.push('_CreateOptionList');
    /**
     * Give data and get an option list
     *
     * @param $data
     * @param $selectedValue
     * @returns {[]}
     * @private
     */
    const _CreateOptionList = function(
        $data = {},
        $selectedValue = ''
    ) {
        let $list = [];
        for (let $key in $data) {
            if ($data.hasOwnProperty($key) === false) {
                continue;
            }

            const $label = $data[$key];
            const $selected = $key === $selectedValue

            $list.push({
                'type': 'option',
                'value': $label,
                'label': $label,
                'selected': $selected
            });
        }

        return $list;
    };

    $functions.push('click_plugin');
    /**
     * When selecting a plugin
     * Will update the plugin functions list
     *
     * @version 2020-08-12
     * @since 2020-08-12
     * @author Peter Lembke
     * @param $in
     * @returns {{answer: string, message: string, ok: string}|*}
     */
    const click_plugin = function($in = {}) {
        const $default = {
            'box_id': '', // The box we are in
            'value': '', // Selected option in select lists
            'step': 'step_get_selected_node',
            'response': {},
            'data_back': {
                'node': '',
            },
        };
        $in = _Default($default, $in);

        let $out = {
            'answer': 'false',
            'message': 'Nothing to report from ' + _GetClassName() + ' -> click_plugin',
            'ok': 'false',
        };

        if ($in.step === 'step_get_selected_node') {
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_view',
                    'function': 'form_read',
                },
                'data': {
                    'id': $in.box_id + '.[my_form_form]',
                },
                'data_back': {
                    'box_id': $in.box_id, // The box we are in
                    'value': $in.value, // Selected option in select lists
                    'step': 'step_get_selected_node_response',
                },
            });
        }

        if ($in.step === 'step_get_selected_node_response') {
            const $default = {
                'answer': 'false',
                'message': 'There was an error',
                'form_data': {},
                'node': '',
            };
            $in.response = _Default($default, $in.response);

            $in.data_back.node = _GetData({
                'name': 'response/form_data/select_node/value/0',
                'default': '',
                'data': $in,
            });

            $in.step = 'step_get_function_list';
        }

        if ($in.step === 'step_get_function_list') {
            return _SubCall({
                'to': {
                    'node': $in.data_back.node,
                    'plugin': $in.value,
                    'function': 'function_names',
                },
                'data': {
                    'include_cmd_functions': 'true',
                    'include_internal_functions': 'false',
                    'include_direct_functions': 'false',
                },
                'data_back': {
                    'box_id': $in.box_id, // The box we are in
                    'value': $in.value, // Selected option in select lists
                    'node': $in.data_back.node,
                    'step': 'step_get_function_list_response',
                },
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
            const $functionNameArray = $in.response.data;

            const $optionList = _CreateOptionList($functionNameArray, '');

            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_view',
                    'function': 'form_write',
                },
                'data': {
                    'id': $in.box_id + '.[my_form_form]',
                    'form_data': {
                        'select_function': {
                            'value': $optionList,
                            'mode': 'clean_add_select',
                        },
                    },
                },
                'data_back': {
                    'box_id': $in.box_id, // The box we are in
                    'value': $in.value, // Selected option in select lists
                    'node': $in.data_back.node,
                    'step': 'step_populate_function_name_dropdown_response',
                },
            });
        }

        if ($in.step === 'step_populate_function_name_dropdown_response') {
            $out = $in.response;
            $out.ok = $out.answer;
            if ($out.answer === 'true') {
                $out.message = 'Have handled the click_plugin event';
            }
        }

        return {
            'answer': $out.answer,
            'message': $out.message,
            'ok': $out.ok,
        };
    };

    $functions.push('click_get_default_message');
    /**
     * Send an empty message to the plugin function and get the default in parameters
     * Show them in the message box as pretty JSON
     *
     * @version 2020-08-13
     * @since 2020-08-13
     * @author Peter Lembke
     * @param $in
     * @returns {{answer, message, ok}|{}|{}|{}|*}
     */
    const click_get_default_message = function($in = {}) {
        const $default = {
            'box_id': '',
            'step': 'step_get_form_data',
            'response': {
                'answer': 'false',
                'message': 'There was an error',
                'ok': 'false',
                'form_data': {},
            },
            'data_back': {
                'node': '',
                'plugin': '',
                'function': '',
                'filter_default': ''
            },
            'first_default': {},
        };
        $in = _Default($default, $in);

        if ($in.step === 'step_get_form_data') {
            const $online = _GetData({
                'name': 'response/answer', // example: "response/data/checksum"
                'default': 'true',
                'data': $in
            });
            if ($online === 'false') {
                $in.step = 'step_end';
            }
        }

        if ($in.step === 'step_get_form_data') {
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_view',
                    'function': 'form_read',
                },
                'data': {
                    'id': $in.box_id + '_my_form_form',
                },
                'data_back': {
                    'value': $in.value, // Selected option in select lists
                    'box_id': $in.box_id, // The box we are in
                    'step': 'step_get_form_data_response',
                },
            });
        }

        if ($in.step === 'step_get_form_data_response') {
            const $default = {
                'answer': 'false',
                'message': 'There was an error',
                'form_data': {},
                'node': '',
            };
            $in.response = _Default($default, $in.response);

            $in.data_back.node = _GetData({
                'name': 'response/form_data/select_node/value/0',
                'default': '',
                'data': $in,
            });

            $in.data_back.plugin = _GetData({
                'name': 'response/form_data/select_plugin/value/0',
                'default': '',
                'data': $in,
            });

            $in.data_back.function = _GetData({
                'name': 'response/form_data/select_function/value/0',
                'default': '',
                'data': $in,
            });

            $in.data_back.filter_default = 'get_all';
            let $bareBone = _GetData({
                'name': 'response/form_data/filter_default_radios.bare_bone/value',
                'default': 'false',
                'data': $in,
            });
            if ($bareBone === 'true') {
                $in.data_back.filter_default = 'bare_bone';
            }

            $in.step = 'step_get_default_message';
        }

        if ($in.step === 'step_get_default_message') {
            return _SubCall({
                'to': {
                    'node': $in.data_back.node,
                    'plugin': $in.data_back.plugin,
                    'function': $in.data_back.function,
                },
                'data': {},
                'data_back': {
                    'filter_default': $in.data_back.filter_default,
                    'value': $in.value, // Selected option in select lists
                    'box_id': $in.box_id, // The box we are in
                    'step': 'step_get_default_message_response',
                },
            });
        }

        if ($in.step === 'step_get_default_message_response') {
            $in.step = 'step_show_default_message';
            if ($in.response.answer === 'false') {
                // $in.step = 'step_end'; // We want the response anyhow
            }
        }

        if ($in.step === 'step_show_default_message') {

            let $fullResponse = $in.first_default;
            let $filteredResponse = _ByVal($fullResponse);
            let $filter = $in.data_back.filter_default;
            if ($filter === 'bare_bone') {
                delete($filteredResponse.step);
                delete($filteredResponse.response);
                delete($filteredResponse.config);
                delete($filteredResponse.data_back);
                delete($filteredResponse.answer);
                delete($filteredResponse.message);
                delete($filteredResponse.data);
                delete($filteredResponse.callback_function);
                delete($filteredResponse.to);
                delete($filteredResponse.from);
            }

            const $fullResponseJson = _JsonEncode($fullResponse);
            const $filteredResponseJson = _JsonEncode($filteredResponse);

            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_view',
                    'function': 'form_write',
                },
                'data': {
                    'id': $in.box_id + '_my_form_form',
                    'form_data': {
                        'textarea_message_hidden': {'value': $fullResponseJson},
                        'textarea_message': {'value': $filteredResponseJson},
                    },
                },
                'data_back': {
                    'step': 'step_show_default_message_response',
                },
            });
        }

        if ($in.step === 'step_show_default_message_response') {

        }

        return {
            'answer': $in.response.answer,
            'message': $in.response.message,
            'ok': $in.response.answer,
        };
    };

    $functions.push('click_send');
    /**
     * Send the message to the node plugin function
     * Filter the response and show as pretty JSON in the response textarea
     *
     * @version 2020-08-13
     * @since 2020-08-13
     * @author Peter Lembke
     * @param $in
     * @returns {{answer, message, ok}|{}|{}|{}|*}
     */
    const click_send = function($in = {}) {
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
                'filtered_response': {},
            },
            'first_default': {},
        };
        $in = _Default($default, $in);

        if ($in.step === 'step_get_form_data') {
            const $online = _GetData({
                'name': 'response/answer', // example: "response/data/checksum"
                'default': 'true',
                'data': $in
            });
            if ($online === 'false') {
                $in.step = 'step_end';
            }
        }

        if ($in.step === 'step_get_form_data') {
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_view',
                    'function': 'form_read',
                },
                'data': {
                    'id': $in.box_id + '_my_form_form',
                },
                'data_back': {
                    'value': $in.value, // Selected option in select lists
                    'box_id': $in.box_id, // The box we are in
                    'step': 'step_get_form_data_response',
                },
            });
        }

        if ($in.step === 'step_get_form_data_response') {
            const $default = {
                'answer': 'false',
                'message': 'There was an error',
                'form_data': {},
            };
            $in.response = _Default($default, $in.response);

            $in.step = 'step_send_message';
            if ($in.response.answer === 'false') {
                $in.step = 'step_end';
            }
        }

        if ($in.step === 'step_send_message') {

            $in.data_back.node = _GetData({
                'name': 'response/form_data/select_node/value/0',
                'default': '',
                'data': $in,
            });

            $in.data_back.plugin = _GetData({
                'name': 'response/form_data/select_plugin/value/0',
                'default': '',
                'data': $in,
            });

            $in.data_back.function = _GetData({
                'name': 'response/form_data/select_function/value/0',
                'default': '',
                'data': $in,
            });

            $in.data_back.message_data = _JsonDecode(_GetData({
                'name': 'response/form_data/textarea_message/value',
                'default': '{}',
                'data': $in,
            }));

            $in.data_back.filter = 'bare_bone';
            const $filterArray = ['get_all', 'no_config', 'bare_bone'];
            for (let $filterNumber in $filterArray) {
                const $filter = $filterArray[$filterNumber];
                let $value = _GetData({
                    'name': "response/form_data/filter_default_radios." + $filter + "/value",
                    'default': 'false',
                    'data': $in,
                });
                if ($value === 'true') {
                    $in.data_back.filter = $filter;
                    break;
                }
            }

            return _SubCall({
                'to': {
                    'node': $in.data_back.node,
                    'plugin': $in.data_back.plugin,
                    'function': $in.data_back.function,
                },
                'data': $in.data_back.message_data,
                'data_back': {
                    'value': $in.value, // Selected option in select lists
                    'box_id': $in.box_id, // The box we are in
                    'filter': $in.data_back.filter,
                    'step': 'step_send_message_response',
                },
            });
        }

        if ($in.step === 'step_send_message_response') {
            const $default = {
                'answer': 'false',
                'message': 'There was an error',
            };
            $in.response = _Merge($default, $in.response);

            $in.step = 'step_filter_response';

            if ($in.response.answer === 'false') {
                // $in.step = 'step_end'; // We want the response anyhow
            }
        }

        if ($in.step === 'step_filter_response') {

            let $fullResponse = $in.response;
            let $filteredResponse = _ByVal($fullResponse);

            const $filter = $in.data_back.filter;

            if ($filter === 'no_config') {
                delete ($filteredResponse.config);
            }

            if ($filter === 'bare_bone') {
                delete ($filteredResponse.first_default);
                delete ($filteredResponse.config);
                delete ($filteredResponse.execution_time);
            }

            const $fullResponseJson = _JsonEncode($fullResponse);
            const $filteredResponseJson = _JsonEncode($filteredResponse);

            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_view',
                    'function': 'form_write',
                },
                'data': {
                    'id': $in.box_id + '_my_form_form',
                    'form_data': {
                        'textarea_response_hidden': {'value': $fullResponseJson},
                        'textarea_response': {'value': $filteredResponseJson},
                    },
                },
                'data_back': {
                    'box_id': $in.box_id, // The box we are in
                    'step': 'step_show_default_message_response',
                },
            });
        }

        if ($in.step === 'step_show_default_message_response') {
            $in.step = 'step_get_form_data_again';
            if ($in.response.answer === 'false') {
                $in.step = 'step_end';
            }
        }

        if ($in.step === 'step_get_form_data_again') {
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_view',
                    'function': 'form_read',
                },
                'data': {
                    'id': $in.box_id + '_my_form_form',
                },
                'data_back': {
                    'box_id': $in.box_id, // The box we are in
                    'step': 'step_get_form_data_again_response',
                },
            });
        }

        if ($in.step === 'step_get_form_data_again_response') {
            $in.step = 'step_save_form_data_to_storage';
            if ($in.response.answer === 'false') {
                $in.step = 'step_end';
            }
        }

        if ($in.step === 'step_save_form_data_to_storage') {

            let $formData = _GetData({
                'name': 'response/form_data',
                'default': {},
                'data': $in,
            });

            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_storage',
                    'function': 'write',
                },
                'data': {
                    'path': 'infohub_trigger/my_selection',
                    'data': $formData
                },
                'data_back': {
                    'step': 'step_save_to_storage_response',
                },
            });
        }

        if ($in.step === 'step_save_form_data_to_storage_response') {

        }

        return {
            'answer': $in.response.answer,
            'message': $in.response.message,
            'ok': $in.response.answer,
        };
    };

    $functions.push('click_refresh_plugin_list');
    /**
     * Click refresh to get new data from the server about the plugins for both nodes
     *
     * @version 2020-08-13
     * @since 2020-08-13
     * @author Peter Lembke
     * @param $in
     * @returns {{answer, message, ok}|{}|{}|{}|*}
     */
    const click_refresh_plugin_list = function($in = {}) {
        const $default = {
            'box_id': '',
            'step': 'step_start',
            'response': {
                'answer': 'false',
                'message': 'There was an error',
                'ok': 'false',
            },
        };
        $in = _Default($default, $in);

        if ($in.step === 'step_start') {
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_trigger',
                    'function': 'update_plugin_list',
                },
                'data': {},
                'data_back': {
                    'box_id': $in.box_id,
                    'step': 'step_end',
                },
            });
        }

        return {
            'answer': $in.response.answer,
            'message': $in.response.message,
            'ok': $in.response.answer,
        };
    };

    $functions.push('click_filter');
    /**
     * Reads the hidden full default json. Filters it and displays it.
     *
     * @version 2022-04-10
     * @since 2022-04-10
     * @author Peter Lembke
     * @param $in
     * @returns {{answer, message, ok}|{}|{}|{}|*}
     */
    const click_filter = function($in = {}) {
        const $default = {
            'box_id': '',
            'value': '', // the option value
            'name': '', // name of the option group
            'step': 'step_get_destination',
            'response': {
                'answer': 'false',
                'message': '',
                'text': '', // The hidden text box value
            },
            'data_back': {
                'destination_data': {}
            }
        };
        $in = _Default($default, $in);

        const $originalDefault = $in.box_id + '_textarea_message_hidden';
        const $destinationDefault = $in.box_id + '_textarea_message_form_element';
        const $originalResponse = $in.box_id + '_textarea_response_hidden';
        const $destinationResponse = $in.box_id + '_textarea_response_form_element';

        let $data = {};
        let $destinationData = {};
        let $original = $originalDefault;
        let $destination = $destinationDefault;

        if ($in.name === 'filter_response') {
            $original = $originalResponse;
            $destination = $destinationResponse;
        }

        if ($in.step === 'step_get_destination') {
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_view',
                    'function': 'get_text',
                },
                'data': {
                    'id': $destination,
                },
                'data_back': {
                    'box_id': $in.box_id,
                    'value': $in.value,
                    'name': $in.name,
                    'step': 'step_get_destination_response',
                },
            });
        }

        if ($in.step === 'step_get_destination_response') {
            $in.step = 'step_end';
            if ($in.response.answer === 'true') {
                $destinationData = _JsonDecode($in.response.text);
                $in.step = 'step_get_original';
            }
        }

        if ($in.step === 'step_get_original') {
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_view',
                    'function': 'get_text',
                },
                'data': {
                    'id': $original,
                },
                'data_back': {
                    'box_id': $in.box_id,
                    'value': $in.value,
                    'name': $in.name,
                    'destination_data': $destinationData,
                    'step': 'step_get_original_response',
                },
            });
        }

        if ($in.step === 'step_get_original_response') {
            $in.step = 'step_end';
            if ($in.response.answer === 'true') {
                $data = _JsonDecode($in.response.text);
                $in.step = 'step_filter_' + $in.value;
            }
        }

        if ($in.step === 'step_filter_get_all') {
            $in.step = 'step_store_destination';
        }

        if ($in.step === 'step_filter_no_config') {
            delete($data.config);
            $in.step = 'step_store_destination';
        }

        if ($in.step === 'step_filter_bare_bone') {
            delete($data.step);
            delete($data.answer);
            delete($data.message);
            delete($data.func);
            delete($data.config);
            delete($data.response);
            delete($data.data_back);
            delete($data.first_default);
            delete($data.execution_time);
            $in.step = 'step_store_destination';
        }

        if ($in.step === 'step_store_destination') {

            $data = _Default($data, $in.data_back.destination_data);

            let $dataJSON = _JsonEncode($data);

            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_view',
                    'function': 'set_text',
                },
                'data': {
                    'id': $destination,
                    'text': $dataJSON
                },
                'data_back': {
                    'step': 'step_store_destination_response',
                },
            });
        }

        if ($in.step === 'step_store_destination_response') {

        }

        return {
            'answer': $in.response.answer,
            'message': $in.response.message,
            'ok': $in.response.answer
        };
    };

    $functions.push('get_plugin_list');
    /**
     * Get the function list from local Storage.
     * If not there then update from the server and try again.
     *
     * @version 2020-08-17
     * @since 2020-08-17
     * @author Peter Lembke
     * @param $in
     * @returns {{answer: string, data: {}, message: string}|{}|{}|{}|*}
     */
    const get_plugin_list = function($in = {}) {
        const $default = {
            'use_local_version_if_available': 'true',
            'step': 'step_start',
            'response': {
                'answer': 'false',
                'message': '',
                'data': {},
                'post_exist': 'false',
            },
        };
        $in = _Default($default, $in);

        let $out = {
            'answer': 'false',
            'message': 'Nothing to report from ' + _GetClassName() + ' -> get_plugin_list',
            'data': {},
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
                    'function': 'read',
                },
                'data': {
                    'path': 'infohub_trigger/plugin_list',
                },
                'data_back': {
                    'use_local_version_if_available': $in.use_local_version_if_available,
                    'step': 'step_read_from_storage_response',
                },
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
                    'function': 'update_plugin_list',
                },
                'data': {},
                'data_back': {
                    'use_local_version_if_available': $in.use_local_version_if_available,
                    'step': 'step_update_plugin_list_response',
                },
            });
        }

        return {
            'answer': $out.answer,
            'message': $out.message,
            'data': $out.data,
        };
    };

    $functions.push('update_plugin_list');
    /**
     * Makes sure we have the latest list with all nodes, plugins and functions
     *
     * @version 2020-08-16
     * @since 2020-08-16
     * @author Peter Lembke
     * @param $in
     * @returns {{answer: string, message: string}|{}|{}|{}|*}
     */
    const update_plugin_list = function($in = {}) {
        const $default = {
            'step': 'step_call_server',
            'response': {
                'answer': 'false',
                'message': '',
                'data': {},
            },
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
                    'function': 'get_plugin_list',
                },
                'data': {},
                'data_back': {
                    'step': 'step_call_server_response',
                },
                'wait': 0.2
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
                    'function': 'write',
                },
                'data': {
                    'path': 'infohub_trigger/plugin_list',
                    'data': $in.response.data,
                },
                'data_back': {
                    'step': 'step_save_to_storage_response',
                },
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
            'message': $out.message,
        };
    };

    $functions.push('populate_gui');
    /**
     * Populate the GUI with the selections you have previously done.
     * If I can not find any previous selections then I will skip this.
     *
     * @version 2022-03-26
     * @since 2022-03-26
     * @author Peter Lembke
     * @param $in
     * @returns {{answer, message}|{}|{}|{}|*}
     */
    const populate_gui = function($in = {}) {
        const $default = {
            'box_id': '',
            'step': 'step_get_previous_selections',
            'response': {
                'answer': 'false',
                'message': 'Nothing to report from ' + _GetClassName() + ' -> populate_gui',
                'data': {},
            },
            'data_back': {
                'form_data': {}
            }
        };
        $in = _Default($default, $in);

        if ($in.step === 'step_get_previous_selections') {
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_storage',
                    'function': 'read',
                },
                'data': {
                    'path': 'infohub_trigger/my_selection',
                },
                'data_back': {
                    'box_id': $in.box_id,
                    'step': 'step_get_previous_selections_response',
                },
            });
        }

        if ($in.step === 'step_get_previous_selections_response') {
            $in.step = 'step_set_filters_and_textareas';
            if ($in.response.answer === 'false') {
                $in.step = 'step_end';
            }
        }

        if ($in.step === 'step_set_filters_and_textareas') {

            let $formData = _ByVal($in.response.data);

            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_view',
                    'function': 'form_write',
                },
                'data': {
                    'id': $in.box_id + '.[my_form_form]',
                    'form_data': $formData
                },
                'data_back': {
                    'box_id': $in.box_id,
                    'form_data': $in.response.data,
                    'step': 'step_set_plugin',
                },
            });
        }

        return {
            'answer': $in.response.answer,
            'message': $in.response.message,
        };
    };
}

//# sourceURL=infohub_trigger.js