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
function infohub_libretranslate() {

    'use strict';

// include "infohub_base.js"

    const _Version = function() {
        return {
            'date': '2021-09-16',
            'since': '2021-09-16',
            'version': '1.0.0',
            'checksum': '{{checksum}}',
            'class_name': 'infohub_libretranslate',
            'note': 'Manual translations and function to call LibreTranslate',
            'status': 'normal',
            'SPDX-License-Identifier': 'GPL-3.0-or-later',
            'user_role': 'developer',
            'web_worker': 'true',
            'core_plugin': 'false',
        };
    };

    const _GetCmdFunctions = function() {
        const $list = {
            'setup_gui': 'normal',
            'click_menu': 'normal',
            'click': 'normal',
            'call_server': 'normal',
            'get_language_option_list': 'normal',
            'translate': 'normal'
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

    const _GetPluginName = function($data) {
        let $pluginType = 'welcome';
        const $tmp = $data.split('_');

        if (_IsSet($tmp[0]) === 'true') {
            $pluginType = $tmp[0];
        }

        return 'infohub_libretranslate_' + $pluginType;
    };

    let $classTranslations = {};

    // ***********************************************************
    // * your class functions below, only declare with var
    // * Can only be reached through cmd()
    // ***********************************************************

    /**
     * Setup the Workbench Graphical User Interface
     * @version 2019-03-13
     * @since   2017-10-03
     * @author  Peter Lembke
     */
    $functions.push('setup_gui');
    const setup_gui = function($in = {}) {
        const $default = {
            'box_id': '',
            'step': 'step_start',
            'response': {
                'answer': '',
                'message': '',
                'data': {},
            },
        };
        $in = _Merge($default, $in);

        if ($in.step === 'step_start') {
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_view',
                    'function': 'box_mode',
                },
                'data': {
                    'box_id': $in.box_id,
                    'box_mode': 'side',
                    'digits': '2',
                },
                'data_back': {
                    'box_id': $in.box_id,
                    'step': 'step_boxes_insert',
                },
            });
        }

        if ($in.step === 'step_boxes_insert') {
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_view',
                    'function': 'boxes_insert_detailed',
                },
                'data': {
                    'items': [
                        {
                            'parent_box_id': $in.box_id,
                            'box_position': 'last',
                            'box_mode': 'data',
                            'box_alias': 'menu',
                            'max_width': 640,
                            'box_data': 'The menu will render here',
                        },
                        {
                            'parent_box_id': $in.box_id,
                            'box_position': 'last',
                            'box_mode': 'data',
                            'box_alias': 'form',
                            'max_width': 100, // 100 will be translated to 100%
                            'box_data': 'Use the menu',
                        },
                    ],
                },
                'data_back': {
                    'box_id': $in.box_id,
                    'step': 'step_get_translations',
                },
            });
        }

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
            $in.step = 'step_menu';
        }

        if ($in.step === 'step_menu') {
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_libretranslate_menu',
                    'function': 'create',
                },
                'data': {
                    'subtype': 'menu',
                    'parent_box_id': $in.box_id,
                    'translations': $classTranslations,
                },
                'data_back': {
                    'box_id': $in.box_id,
                    'step': 'step_render_instructions',
                },
            });
        }

        if ($in.step === 'step_render_instructions') {
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_render',
                    'function': 'create',
                },
                'data': {
                    'what': {
                        'presentation_box': {
                            'plugin': 'infohub_rendermajor',
                            'type': 'presentation_box',
                            'head_label': _Translate('INSTRUCTIONS'),
                            'head_text': '',
                            'content_data': '[description]',
                        },
                        'description': {
                            'type': 'common',
                            'subtype': 'value',
                            'data': _Translate('USE_THE_MENU.')
                        }
                    },
                    'how': {
                        'mode': 'one box',
                        'text': '[presentation_box]',
                    },
                    'where': {
                        'box_id': 'main.body.infohub_libretranslate.form',
                        'max_width': 640,
                        'scroll_to_box_id': 'true',
                    },
                    'cache_key': 'instructions',
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

    /**
     * Handle the menu clicks
     * @version 2019-03-13
     * @since 2018-09-26
     * @author Peter Lembke
     */
    $functions.push('click_menu');
    const click_menu = function($in = {}) {
        const $default = {
            'step': 'step_start',
            'event_data': '',
            'parent_box_id': '',
        };
        $in = _Default($default, $in);

        if ($in.step === 'step_start') {
            const $pluginName = _GetPluginName($in.event_data);

            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': $pluginName,
                    'function': 'create',
                },
                'data': {
                    'subtype': $in.event_data,
                    'parent_box_id': $in.parent_box_id,
                    'translations': $classTranslations,
                },
                'data_back': {
                    'step': 'step_end',
                },
            });
        }

        return {
            'answer': 'true',
            'message': 'Menu click done',
        };
    };

    /**
     * All clicks except the menu goes here and are distributed
     * to the right child and the right click function.
     * @version 2019-03-13
     * @since 2019-03-13
     * @author Peter Lembke
     */
    $functions.push('click');
    const click = function($in = {}) {
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
                'files_data': [], // For the import button
            },
        };
        $in = _Default($default, $in);

        if (_Empty($in.event_data) === 'true') {
            $in.step = 'step_end';
            $in.response.message = 'Event_data is empty. I can not continue.';
        }

        if ($in.step === 'step_start') {

            const $parts = $in.event_data.split('|');
            const $childName = $parts[0];
            const $clickName = $parts[1];

            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_libretranslate_' + $childName,
                    'function': 'click_' + $clickName,
                },
                'data': {
                    'event_data': $in.event_data,
                    'value': $in.value,
                    'values': $in.response.value,
                    'files_data': $in.response.files_data,
                    'box_id': $in.box_id,
                },
                'data_back': {
                    'event_data': $in.event_data,
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
     * Children can talk to level1 plugins on the same node.
     * When you need data from other nodes then any level1 plugin must help getting that.
     * @version 2019-03-13
     * @since 2019-03-13
     * @author Peter Lembke
     */
    $functions.push('call_server');
    const call_server = function($in = {}) {
        const $default = {
            'step': 'step_start',
            'to': {'function': ''},
            'data': {},
            'response': {},
            'from_plugin': {
                'node': '',
                'plugin': '',
            },
        };
        $in = _Default($default, $in);

        if ($in.step === 'step_start') {

            if ($in.from_plugin.node !== 'client') {
                return {
                    'answer': 'false',
                    'message': 'Only plugins from the client node can call this function',
                };
            }

            if ($in.from_plugin.plugin.indexOf('infohub_libretranslate_') !== 0) {
                return {
                    'answer': 'false',
                    'message': 'Only children to this plugin can call this function',
                };
            }

            return _SubCall({
                'to': {
                    'node': 'server',
                    'plugin': 'infohub_libretranslate',
                    'function': $in.to.function,
                },
                'data': $in.data,
                'data_back': {
                    'step': 'step_end',
                },
            });
        }

        return $in.response;
    };

    /**
     * Get the list with languages that libre translate can handle
     * @version 2021-09-09
     * @since   2021-09-09
     * @author  Peter Lembke
     */
    $functions.push('get_language_option_list');
    const get_language_option_list = function($in = {}) {
        const $default = {
            'selected': '',
            'use_cache': 'false',
            'step': 'step_start',
            'response': {
                'answer': 'false',
                'message': 'Nothing to report',
                'options': [],
                'data': {
                    'options': [] // When reading from storage
                }
            }
        };
        $in = _Default($default, $in);

        let $messageArray = [];

        if ($in.step === 'step_start') {
            $in.step = 'step_ask_server';
            if ($in.use_cache === 'true') {
                $in.step = 'step_use_cache'
            }
        }

        if ($in.step === 'step_use_cache') {
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_storage',
                    'function': 'read',
                },
                'data': {
                    'path': 'infohub_libretranslate/language_list',
                },
                'data_back': {
                    'step': 'step_use_cache_response',
                    'selected': $in.selected,
                    'use_cache': $in.use_cache
                }
            });
        }

        if ($in.step === 'step_use_cache_response') {
            $in.step = 'step_ask_server';
            if (_Count($in.response.data.options) > 0) {
                $in.response.options = $in.response.data.options;
                $in.step = 'step_set_selected';
            }
        }

        if ($in.step === 'step_set_selected') {

            let $optionLength = $in.response.options.length;

            for (let $number = 0; $number < $optionLength; $number++) {

                const $languageCode = $in.response.options[$number].value;
                if ($languageCode === $in.selected) {
                    $in.response.options[$number].selected = 'true';
                    continue;
                }

                if (_IsSet($in.response.options[$number].selected) === 'true') {
                    delete($in.response.options[$number].selected);
                }
            }

            $in.step = 'step_end';
        }

        if ($in.step === 'step_ask_server') {
            return _SubCall({
                'to': {
                    'node': 'server',
                    'plugin': 'infohub_libretranslate',
                    'function': 'get_language_option_list',
                },
                'data': {
                    'selected': $in.selected
                },
                'data_back': {
                    'step': 'step_store_in_cache',
                    'selected': $in.selected,
                    'use_cache': $in.use_cache
                }
            });
        }

        if ($in.step === 'step_store_in_cache') {
            let $messageOut = _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_storage',
                    'function': 'write',
                },
                'data': {
                    'path': 'infohub_libretranslate/language_list',
                    'data': {
                        'options': $in.response.options
                    }
                },
                'data_back': {
                    'step': 'step_end'
                }
            });
            $messageArray.push($messageOut);
        }

        return {
            'answer': $in.response.answer,
            'message': $in.response.message,
            'ok': $in.response.answer,
            'options': $in.response.options,
            'messages': $messageArray
        };
    }

    /**
     * Ask the server to do a translation.
     * @version 2021-09-20
     * @since   2021-09-20
     * @author  Peter Lembke
     */
    $functions.push('translate');
    const translate = function($in = {}) {
        const $default = {
            'from_language': '',
            'to_language': '',
            'from_text': '',
            'step': 'step_start',
            'response': {
                'answer': 'false',
                'message': 'Nothing to report',
                'to_text': ''
            }
        };
        $in = _Default($default, $in);

        if ($in.step === 'step_start') {
            if ($in.from_language !== '' && $in.to_language !== '' && $in.from_text !== '') {
                $in.step = 'step_call_server';
            }
        }

        if ($in.step === 'step_call_server') {
            return _SubCall({
                'to': {
                    'node': 'server',
                    'plugin': 'infohub_libretranslate',
                    'function': 'translate',
                },
                'data': {
                    'from_language': $in.from_language,
                    'to_language': $in.to_language,
                    'from_text': $in.from_text
                },
                'data_back': {
                    'step': 'step_end'
                }
            });
        }

        return {
            'answer': $in.response.answer,
            'message': $in.response.message,
            'ok': $in.response.answer,
            'to_text': $in.response.to_text
        };
    }
}
//# sourceURL=infohub_libretranslate.js