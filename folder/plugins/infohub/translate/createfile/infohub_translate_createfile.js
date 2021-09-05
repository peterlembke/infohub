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
function infohub_translate_createfile() {

    'use strict';

// include "infohub_base.js"

    const _Version = function() {
        return {
            'date': '2020-12-15',
            'since': '2019-09-28',
            'version': '1.0.0',
            'checksum': '{{checksum}}',
            'class_name': 'infohub_translate_createfile',
            'note': 'Create translation file from the selected plugin name and its children',
            'status': 'normal',
            'SPDX-License-Identifier': 'GPL-3.0-or-later',
        };
    };

    const _GetCmdFunctions = function() {
        const $list = {
            'create': 'normal',
            'click_refresh': 'normal',
            'click_create_files': 'normal',
            'click_download': 'normal',
        };

        return _GetCmdFunctionsBase($list);
    };

    let $pluginTranslationsMerged = {};

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

    /**
     * Merge only when there are data in a key
     * @param {type} $string
     * @returns string
     */
    $functions.push('_MergeData');
    const _MergeData = function($object1, $object2) {
        if (typeof $object1 === 'object') {
            if (typeof $object2 === 'object') {
                $object1 = _ByVal(_MergeKeys($object1, $object2));
            }
        }

        return _ByVal($object1);
    };

    $functions.push('_MergeKeys');
    const _MergeKeys = function($object1, $object2) {
        for (let $key in $object2) {
            if ($object2.hasOwnProperty($key) === false) {
                continue;
            }

            if (typeof $object2[$key] === 'string') {
                if ($object2[$key] !== '') {
                    $object1[$key] = $object2[$key];
                }
            }

            if (typeof $object2[$key] === 'object') {
                if (_Count($object2[$key]) > 0) {
                    if (_IsSet($object1[$key]) === 'false') {
                        $object1[$key] = {};
                    }

                    $object1[$key] = _MergeKeys($object1[$key], $object2[$key]);
                }
            }
        }

        return _ByVal($object1);
    };

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
                            'head_label': _Translate('CREATE_TRANSLATION_FILE'),
                            'content_data': '[my_form]',
                            'foot_text': '[text_instructions]',
                        },
                        'my_form': {
                            'type': 'form',
                            'subtype': 'form',
                            'content': '[button_refresh][select_plugin][missing_plugin_name][download_file][button_create_file][my_container]',
                        },
                        'button_refresh': {
                            'plugin': 'infohub_renderform',
                            'type': 'button',
                            'mode': 'button',
                            'button_label': _Translate('REFRESH_PLUGIN_LIST'),
                            'event_data': 'createfile|refresh',
                            'to_node': 'client',
                            'to_plugin': 'infohub_translate',
                            'to_function': 'click',
                        },
                        'select_plugin': {
                            'plugin': 'infohub_renderform',
                            'type': 'select',
                            "label": _Translate("SELECT_PLUGIN"),
                            "description": _Translate("LISTS_ALL_CLIENT_PLUGINS_THAT_CAN_HAVE_TRANSLATION_FILES._SELECT_A_PLUGIN_AND_CLICK_CREATE_FILE."),
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
                            'description':_Translate('YOU_CAN_WRITE_THE_PLUGIN_NAME_HERE_IF_IT_IS_MISSING_FROM_THE_LIST._ONLY_STARTABLE_PLUGINS_ARE_IN_THE_LIST.')
                        },
                        'download_file': {
                            'type': 'form',
                            'subtype': 'radios',
                            'group_name': 'file',
                            "options": [
                                {
                                    "group_name": "file",
                                    "value": "file_download",
                                    "label": _Translate("DOWNLOAD_FILE")
                                },
                                {
                                    "group_name": "file",
                                    "value": "file_save",
                                    "label": _Translate("SAVE_FILE_ON_SERVER"),
                                    "selected": "true"
                                }
                            ]
                        },
                        'button_create_file': {
                            'plugin': 'infohub_renderform',
                            'type': 'button',
                            'mode': 'button',
                            'button_label': _Translate('CREATE_FILE'),
                            'event_data': 'createfile|create_files',
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
                            'text': _Translate('YOU_GET_THE_ENGLISH_TRANSLATION_FILE.') + ' ' +
                                _Translate('YOU_CAN_THEN_USE_THAT_FILE_ON_ONLINE_TRANSLATION_SERVICES_TO_TRANSLATE_IT_TO_OTHER_LANGUAGES.'),
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
                    'cache_key': 'createfile',
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
     * Create template file template1.json and template2.json
     * template1.json contain all original phrases on the left side and A0 A1... on the right side.
     * template2.json is opposite with A0 A1 on the left side and the phrases on the right side.
     * Now template2.json can be handled by Google Translate with manual upload.
     * When you have a translated template2.json you can put them togehter with the next button 'Import translated file'.
     * @version 2019-03-24
     * @since   2016-03-24
     * @author  Peter Lembke
     */
    $functions.push('click_create_files');
    const click_create_files = function($in = {}) {
        const $default = {
            'box_id': '',
            'step': 'step_form_read',
            'response': {
                'answer': 'false',
                'message': 'Nothing to report',
                'data': {},
                'form_data': {},
                'file_lookup': {},
            },
            'data_back': {
                'answer': 'false',
                'message': 'Nothing to report',
                'ok': 'false',
                'plugin_name_array': [],
                'file_lookup': {},
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
                $in.step = 'step_ask_server';
            }
        }

        if ($in.step === 'step_ask_server') {

            const $pluginNameArraySelected = _GetData({
                'name': 'response/form_data/select_plugin/value',
                'default': [],
                'data': $in,
            });

            const $pluginNameText = _GetData({
                'name': 'response/form_data/missing_plugin_name/value',
                'default': '',
                'data': $in,
            });

            const $fileDownload = _GetData({
                'name': 'response/form_data/download_file.file_download/value',
                'default': 'false',
                'data': $in,
            });

            const $fileSave = _GetData({
                'name': 'response/form_data/download_file.file_save/value',
                'default': 'false',
                'data': $in,
            });

            $pluginNameArray = $pluginNameArraySelected;
            if (_Empty($pluginNameText) === 'false') {
                $pluginNameArray.push($pluginNameText);
            }

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
                        'function': 'create_translation_files',
                    },
                    'data': {
                        'plugin_name_array': $pluginNameArray,
                        'file_download': $fileDownload,
                        'file_save': $fileSave
                    },
                },
                'data_back': {
                    'step': 'step_ask_server_response',
                    'plugin_name_array': $pluginNameArray,
                },
            });
        }

        if ($in.step === 'step_ask_server_response') {

            $in.data_back.answer = $in.response.answer;
            $in.data_back.message = $in.response.message;
            $in.data_back.file_lookup = $in.response.file_lookup;

            if ($in.response.answer === 'true') {
                $in.data_back.ok = 'true';
            }

            const $fileLookup = _GetData({
                'name': 'data_back/file_lookup',
                'default': 'template',
                'data': $in,
            });

            const $extension = '-en.json';

            let $messageArray = [];

            for (let $fileName in $fileLookup) {
                if ($fileLookup.hasOwnProperty($fileName) === false) {
                    continue;
                }

                const $contentArray = $fileLookup[$fileName];

                const $messageOut = _SubCall({
                    'to': {
                        'node': 'client',
                        'plugin': 'infohub_view',
                        'function': 'file_write',
                    },
                    'data': {
                        'file_name': $fileName + $extension,
                        'content': _JsonEncode($contentArray),
                    },
                    'data_back': {
                        'step': 'step_end',
                    },
                });

                $messageArray.push($messageOut);
            }

            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_view',
                    'function': 'set_text',
                },
                'data': {
                    'id': 'main.body.infohub_translate.form.[my_container]',
                    'text': $in.data_back.message,
                },
                'data_back': {
                    'answer': $in.data_back.answer,
                    'message': $in.data_back.message,
                    'ok': $in.data_back.ok,
                    'plugin_name_array': $in.data_back.plugin_name_array,
                    'file': $in.data_back.file,
                    'step': 'step_show_message_response',
                },
                'messages': $messageArray
            });
        }

        if ($in.step === 'step_show_message_response') {
            $in.step = 'step_end';

            if ($in.response.answer === 'true') {
                $in.data_back.answer = 'true';
                $in.data_back.message = 'File exported';
                $in.data_back.ok = 'true';
            }
        }

        return {
            'answer': $in.data_back.answer,
            'message': $in.data_back.message,
            'ok': $in.data_back.ok,
        };
    };
}

//# sourceURL=infohub_translate_createfile.js