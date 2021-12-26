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
function infohub_translate_updateplugin() {

    "use strict";

// include "infohub_base.js"

    const _Version = function () {
        return {
            'date': '2021-08-15',
            'since': '2021-08-15',
            'version': '1.0.0',
            'checksum': '{{checksum}}',
            'class_name': 'infohub_translate_updateplugin',
            'note': 'Updates the plugin translation keys if needed. Creates a copy of the plugin',
            'status': 'normal',
            'SPDX-License-Identifier': 'GPL-3.0-or-later'
        };
    };

    const _GetCmdFunctions = function () {
        const $list = {
            'create': 'normal',
            'click_refresh': 'normal',
            'click_update_plugin_array': 'normal'
        };

        return _GetCmdFunctionsBase($list);
    };

    let $classTranslations = {};

    // ***********************************************************
    // * your class functions below, only declare with var
    // * Can only be reached through cmd()
    // ***********************************************************

    /**
     * Get instructions and create the message to InfoHub View
     * @version 2019-03-13
     * @since   2016-10-16
     * @author  Peter Lembke
     */
    $functions.push('create');
    const create = function ($in = {}) {
        const $default = {
            'subtype': 'menu',
            'parent_box_id': '',
            'translations': {},
            'step': 'step_render',
            'response': {
                'answer': 'false',
                'message': ''
            }
        };
        $in = _Default($default, $in);

        if ($in.step === 'step_render') {
            $classTranslations = $in.translations;

            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_render',
                    'function': 'create'
                },
                'data': {
                    'what': {
                        'my_presentation_box': {
                            'plugin': 'infohub_rendermajor',
                            'type': 'presentation_box',
                            'head_label': _Translate('UPDATE_PLUGIN'),
                            'content_data': '[my_form]',
                            'foot_text': '[text_instructions]'
                        },
                        'my_form': {
                            'type': 'form',
                            'subtype': 'form',
                            'content': '[button_refresh][select_plugin][missing_plugin_name][button_update_plugin][my_container]'
                        },
                        'button_refresh': {
                            'plugin': 'infohub_renderform',
                            'type': 'button',
                            'mode': 'button',
                            'button_label': _Translate('REFRESH_PLUGIN_LIST'),
                            'event_data': 'updateplugin|refresh',
                            'to_node': 'client',
                            'to_plugin': 'infohub_translate',
                            'to_function': 'click'
                        },
                        'select_plugin': {
                            'plugin': 'infohub_renderform',
                            'type': 'select',
                            "label": _Translate("SELECT_PLUGIN"),
                            "description": _Translate('LISTS_ALL_CLIENT_PLUGINS_THAT_CAN_HAVE_TRANSLATION_FILES.') + ' ' + _Translate('SELECT_A_PLUGIN_AND_CLICK_UPDATE_PLUGIN.'),
                            "size": "6",
                            "multiple": "true",
                            "options": [],
                            'source_node': 'client',
                            'source_plugin': 'infohub_launcher',
                            'source_function': 'get_option_list',
                            'css_data': {
                                '.select': 'max-width: 200px;'
                            }
                        },
                        'missing_plugin_name': {
                            'plugin': 'infohub_renderform',
                            'type': 'text',
                            'label': _Translate('PLUGIN_NAME'),
                            'description': _Translate('YOU_CAN_WRITE_THE_PLUGIN_NAME_HERE_IF_IT_IS_MISSING_FROM_THE_LIST.') + ' ' + _Translate('ONLY_STARTABLE_PLUGINS_ARE_IN_THE_LIST.')
                        },
                        'button_update_plugin': {
                            'plugin': 'infohub_renderform',
                            'type': 'button',
                            'mode': 'button',
                            'button_label': _Translate('UPDATE_PLUGIN'),
                            'event_data': 'updateplugin|update_plugin_array',
                            'to_node': 'client',
                            'to_plugin': 'infohub_translate',
                            'to_function': 'click'
                        },
                        'my_container': {
                            'type': 'common',
                            'subtype': 'container',
                            'tag': 'div',
                            'data': '-',
                            'class': 'container-small'
                        },
                        'text_instructions': {
                            'type': 'text',
                            'text': _Translate('THE_PLUGIN_YOU_SELECT_WILL_HAVE_ITS_TRANSLATE_TEXT_CONVERTED_TO_A_KEY_STRING.')
                        }
                    },
                    'how': {
                        'mode': 'one box',
                        'text': '[my_presentation_box]'
                    },
                    'where': {
                        'box_id': 'main.body.infohub_translate.form', // 'box_id': $in.parent_box_id + '.form',
                        'max_width': 960,
                        'scroll_to_box_id': 'true'
                    },
                    'cache_key': 'updateplugin'
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
     * Refresh the list with plugins
     * @version 2019-04-01
     * @since 2019-04-01
     * @author Peter Lembke
     */
    $functions.push("click_refresh");
    const click_refresh = function ($in = {}) {
        const $default = {
            'box_id': '',
            'step': 'step_render_plugin_options',
            'response': {
                'answer': 'true',
                'message': 'Render the options',
                'ok': 'true'
            }
        };
        $in = _Default($default, $in);

        if ($in.step === 'step_render_plugin_options') {
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_render',
                    'function': 'render_options'
                },
                'data': {
                    'id': $in.box_id + '_select_plugin_form_element',
                    'source_node': 'client',
                    'source_plugin': 'infohub_launcher',
                    'source_function': 'get_option_list',
                    'source_data': {}
                },
                'data_back': {
                    'box_id': $in.box_id,
                    'step': 'step_render_language_options'
                }
            });

        }

        if ($in.step === 'step_render_language_options') {
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_render',
                    'function': 'render_options'
                },
                'data': {
                    'id': $in.box_id + '_select_language_code_form_element',
                    'source_node': 'client',
                    'source_plugin': 'infohub_language',
                    'source_function': 'option_list_main_languages',
                    'source_data': {}
                },
                'data_back': {
                    'box_id': $in.box_id,
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
     * Update the selected plugin by changing all translation phrases into keys
     * @version 2020-12-15
     * @since   2020-12-15
     * @author  Peter Lembke
     */
    $functions.push('click_update_plugin_array');
    const click_update_plugin_array = function ($in = {}) {
        const $default = {
            'box_id': '',
            'step': 'step_form_read',
            'response': {
                'answer': 'false',
                'message': 'Nothing to report',
                'data': {},
                'form_data': {}
            },
            'data_back': {
                'answer': 'false',
                'message': 'Nothing to report',
                'ok': 'false',
                'plugin_name_array': []
            }
        };
        $in = _Default($default, $in);

        let $pluginNameArray = [];

        if ($in.step === 'step_form_read') {
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_view',
                    'function': 'form_read'
                },
                'data': {
                    'id': $in.box_id + '_my_form'
                },
                'data_back': {
                    'box_id': $in.box_id,
                    'step': 'step_form_read_response'
                }
            });
        }

        if ($in.step === 'step_form_read_response') {
            $in.step = 'step_end';

            if ($in.response.answer === 'true') {
                const $pluginNameArraySelected = _GetData({
                    'name': 'response/form_data/select_plugin/value',
                    'default': [],
                    'data': $in
                });

                const $pluginNameText = _GetData({
                    'name': 'response/form_data/missing_plugin_name/value',
                    'default': '',
                    'data': $in
                });

                $pluginNameArray = $pluginNameArraySelected;
                if (_Empty($pluginNameText) === 'false') {
                    $pluginNameArray.push($pluginNameText);
                }

                $in.step = 'step_ask_server';
            }
        }

        if ($in.step === 'step_ask_server') {
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_translate',
                    'function': 'call_server'
                },
                'data': {
                    'to': {
                        'node': 'server',
                        'plugin': 'infohub_translate',
                        'function': 'update_plugins'
                    },
                    'data': {
                        'plugin_name_array': $pluginNameArray
                    }
                },
                'data_back': {
                    'step': 'step_ask_server_response',
                    'plugin_name_array': $pluginNameArray
                }
            });
        }

        if ($in.step === 'step_ask_server_response') {
            $in.data_back.answer = $in.response.answer;
            $in.data_back.message = $in.response.message;
            let $showMessage = $in.data_back.message;

            if ($in.response.answer === 'true') {
                $in.data_back.ok = 'true';
                $showMessage = _Translate('PLUGIN_AND_CHILDREN_UPDATED._SEE_FOLDER:') + ' file/infohub_translate';
            }

            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_view',
                    'function': 'set_text'
                },
                'data': {
                    'id': 'main.body.infohub_translate.form.[my_container]',
                    'text': $showMessage
                },
                'data_back': {
                    'answer': $in.data_back.answer,
                    'message': $in.data_back.message,
                    'ok': $in.data_back.ok,
                    'plugin_name': $in.data_back.plugin_name,
                    'step': 'step_show_message_response'
                }
            });
        }

        if ($in.step === 'step_show_message_response') {
        }

        return {
            'answer': $in.data_back.answer,
            'message': $in.data_back.message,
            'ok': $in.data_back.ok
        };
    };
}

//# sourceURL=infohub_translate_updateplugin.js