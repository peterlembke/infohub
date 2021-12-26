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
function infohub_translate_validate() {

    'use strict';

// include "infohub_base.js"

    const _Version = function() {
        return {
            'date': '2021-08-15',
            'since': '2021-08-15',
            'version': '1.0.0',
            'checksum': '{{checksum}}',
            'class_name': 'infohub_translate_validate',
            'note': 'Select plugins and then the server validate that they are OK and report back issues',
            'status': 'normal',
            'SPDX-License-Identifier': 'GPL-3.0-or-later',
        };
    };

    const _GetCmdFunctions = function() {
        const $list = {
            'create': 'normal',
            'click_refresh': 'normal',
            'click_validate_translation_files': 'normal'
        };

        return _GetCmdFunctionsBase($list);
    };

    /**
     * Get the level 1 plugin name from a plugin name
     * example: infohub_contact_menu gives you infohub_contact
     * @param {string} $pluginName
     * @returns {string}
     * @private
     */
    $functions.push('_GetGrandPluginName');
    const _GetGrandPluginName = function($pluginName) {
        const $parts = $pluginName.split('_');

        if (_Count($parts) > 2) {
            return $parts[0] + '_' + $parts[1];
        }

        return $pluginName;
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
    const create = function($in = {}) {
        const $default = {
            'subtype': 'menu',
            'parent_box_id': '',
            'translations': {},
            'step': 'step_render',
            'response': {
                'answer': 'false',
                'message': '',
            },
        };
        $in = _Default($default, $in);

        if ($in.step === 'step_render') {
            $classTranslations = $in.translations;

            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_render',
                    'function': 'create',
                },
                'data': {
                    'what': {
                        'my_presentation_box': {
                            'plugin': 'infohub_rendermajor',
                            'type': 'presentation_box',
                            'head_label': _Translate('VALIDATE_TRANSLATION_FILES'),
                            'content_data': '[my_form]',
                            'foot_text': '[text_instructions]',
                        },
                        'my_form': {
                            'type': 'form',
                            'subtype': 'form',
                            'content': '[button_refresh][select_plugin][missing_plugin_name][button_validate][my_container]',
                        },
                        'button_refresh': {
                            'plugin': 'infohub_renderform',
                            'type': 'button',
                            'mode': 'button',
                            'button_label': _Translate('REFRESH_PLUGIN_LIST'),
                            'event_data': 'validate|refresh',
                            'to_node': 'client',
                            'to_plugin': 'infohub_translate',
                            'to_function': 'click',
                        },
                        'select_plugin': {
                            'plugin': 'infohub_renderform',
                            'type': 'select',
                            "label": _Translate("SELECT_PLUGIN"),
                            "description": _Translate('LISTS_ALL_CLIENT_PLUGINS_THAT_CAN_HAVE_TRANSLATION_FILES.') + ' ' +
                                _Translate('SELECT_A_PLUGIN_AND_CLICK_VALIDATE.'),
                            "size": "6",
                            "multiple": "true",
                            "options": [],
                            'source_node': 'client',
                            'source_plugin': 'infohub_launcher',
                            'source_function': 'get_option_list',
                            'css_data': {
                                '.select': 'max-width: 200px;',
                            },
                        },
                        'missing_plugin_name': {
                            'plugin': 'infohub_renderform',
                            'type': 'text',
                            'label': _Translate('PLUGIN_NAME'),
                            'description':_Translate('YOU_CAN_WRITE_THE_PLUGIN_NAME_HERE_IF_IT_IS_MISSING_FROM_THE_LIST.') + ' ' +
                                _Translate('ONLY_STARTABLE_PLUGINS_ARE_IN_THE_LIST.')
                        },
                        'button_validate': {
                            'plugin': 'infohub_renderform',
                            'type': 'button',
                            'mode': 'button',
                            'button_label': _Translate('VALIDATE'),
                            'event_data': 'validate|validate_translation_files',
                            'to_node': 'client',
                            'to_plugin': 'infohub_translate',
                            'to_function': 'click',
                        },
                        'my_container': {
                            'type': 'common',
                            'subtype': 'container',
                            'tag': 'div',
                            'data': '-',
                            'class': 'container-small',
                        },
                        'text_instructions': {
                            'type': 'text',
                            'text': _Translate('VALIDATES_THE_TRANSLATION_FILES_FOR_THE_SELECTED_PLUGINS.'),
                        },
                    },
                    'how': {
                        'mode': 'one box',
                        'text': '[my_presentation_box]',
                    },
                    'where': {
                        'box_id': 'main.body.infohub_translate.form', // 'box_id': $in.parent_box_id + '.form',
                        'max_width': 960,
                        'scroll_to_box_id': 'true',
                    },
                    'cache_key': 'validate',
                },
                'data_back': {
                    'step': 'step_end',
                },
            });
        }

        return {
            'answer': $in.response.answer,
            'message': $in.response.message,
        };
    };

    $functions.push('click_refresh');
    /**
     * Refresh the list with plugins
     * @version 2019-04-01
     * @since 2019-04-01
     * @author Peter Lembke
     */
    const click_refresh = function($in = {}) {
        const $default = {
            'box_id': '',
            'step': 'step_render_plugin_options',
            'response': {
                'answer': 'true',
                'message': 'Render the options',
                'ok': 'true',
            },
        };
        $in = _Default($default, $in);

        if ($in.step === 'step_render_plugin_options') {
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_render',
                    'function': 'render_options',
                },
                'data': {
                    'id': $in.box_id + '_select_plugin_form_element',
                    'source_node': 'client',
                    'source_plugin': 'infohub_launcher',
                    'source_function': 'get_option_list',
                    'source_data': {},
                },
                'data_back': {
                    'box_id': $in.box_id,
                    'step': 'step_render_language_options',
                },
            });

        }

        if ($in.step === 'step_render_language_options') {
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_render',
                    'function': 'render_options',
                },
                'data': {
                    'id': $in.box_id + '_select_language_code_form_element',
                    'source_node': 'client',
                    'source_plugin': 'infohub_language',
                    'source_function': 'option_list_main_languages',
                    'source_data': {},
                },
                'data_back': {
                    'box_id': $in.box_id,
                    'step': 'step_end',
                },
            });

        }
        return {
            'answer': $in.response.answer,
            'message': $in.response.message,
            'ok': $in.response.ok,
        };
    };

    /**
     * Pull out what plugin names you want to validate. Send those names to the server.
     * The server validate the translation files and return a list with issues.
     *
     * @version 2021-08-19
     * @since   2021-08-19
     * @author  Peter Lembke
     */
    $functions.push('click_validate_translation_files');
    const click_validate_translation_files = function($in = {}) {
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
            },

        };
        $in = _Default($default, $in);

        let $pluginNameArray = [];

        if ($in.step === 'step_form_read') {
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_view',
                    'function': 'form_read',
                },
                'data': {
                    'id': $in.box_id + '_my_form',
                },
                'data_back': {
                    'box_id': $in.box_id,
                    'step': 'step_form_read_response',
                },
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
                    'data': $in,
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
                    'function': 'call_server',
                },
                'data': {
                    'to': {
                        'node': 'server',
                        'plugin': 'infohub_translate',
                        'function': 'validate_translation_files',
                    },
                    'data': {
                        'plugin_name_array': $pluginNameArray
                    },
                },
                'data_back': {
                    'step': 'step_ask_server_response',
                    'plugin_name_array': $pluginNameArray
                },
            });
        }

        if ($in.step === 'step_ask_server_response') {
            $in.data_back.answer = $in.response.answer;
            $in.data_back.message = $in.response.message;
            let $optionArray = _GetOptionArray($in['response']['data']);

            if ($in.response.answer === 'true') {
                $in.data_back.ok = 'true';
            }

            const $separator = '|';

            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_render',
                    'function': 'create',
                },
                'data': {
                    'what': {
                        'my_presentation_box': {
                            'plugin': 'infohub_rendermajor',
                            'type': 'presentation_box',
                            'head_label': _Translate('RESULT'),
                            'foot_text': '',
                            'content_data': '[my_list]',
                        },
                        'my_list': {
                            'plugin': 'infohub_renderadvancedlist',
                            'type': 'advanced_list',
                            'subtype': 'list',
                            'option': $optionArray,
                            'separator': $separator,
                        },
                    },
                    'how': {
                        'mode': 'one box',
                        'text': '[my_presentation_box]',
                    },
                    'where': {
                        'box_id': 'main.body.infohub_translate.form.[my_container]',
                        'max_width': 320, // pixels
                    },
                },
                'data_back': {
                    'answer': $in.data_back.answer,
                    'message': $in.data_back.message,
                    'ok': $in.data_back.ok,
                    'plugin_name': $in.data_back.plugin_name,
                    'step': 'step_show_message_response'
                },
            });
        }

        if ($in.step === 'step_show_message_response') {
        }

        return {
            'answer': $in.data_back.answer,
            'message': $in.data_back.message,
            'ok': $in.data_back.ok,
        };
    };

    /**
     * Give the data from validate_translation_files
     * get the option's data needed to render an advanced list
     * @param $in
     * @returns {*[]}
     * @private
     */
    const _GetOptionArray = function ($in = {}) {

        let $optionArray = [];
        const $separator = '|';

        for (let $pluginName in $in) {
            if ($in.hasOwnProperty($pluginName) === false) {
                continue;
            }

            let $pluginData = $in[$pluginName];
            if (_Count($pluginData) === 0) {
                continue;
            }

            $optionArray.push({
                'label': $pluginName,
                'level': $pluginName
            });

            for (let $languageCode in $pluginData) {
                if ($pluginData.hasOwnProperty($languageCode) === false) {
                    continue;
                }

                let $logArray = $pluginData[$languageCode];
                if ($logArray.length === 0) {
                    continue;
                }

                $optionArray.push({
                    'label': $languageCode,
                    'level': $pluginName + $separator + $languageCode
                });

                for (let $number = 0; $number < $logArray.length; $number++) {
                    $optionArray.push({
                        'label': $logArray[$number],
                        'level': $pluginName + $separator + $languageCode + $separator + $number
                    });
                }
            }
        }

        return $optionArray;
    }
}

//# sourceURL=infohub_translate_validate.js