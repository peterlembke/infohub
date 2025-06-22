/**
 * infohub_translate
 * Handle the translation of startable plugins
 *
 * @package     Infohub
 * @subpackage  infohub_translate
 * @since       2019-09-28
 * @author      Peter Lembke <info@infohub.se>
 * @license     GPL-3.0-or-later
 * @copyright   Copyright (C) 2010- Peter Lembke
 */
function infohub_translate() {

    'use strict';

// include "infohub_base.js"

    const _Version = function() {
        return {
            'date': '2019-09-28',
            'since': '2019-09-28',
            'version': '1.0.0',
            'checksum': '{{checksum}}',
            'class_name': 'infohub_translate',
            'note': 'Handle the translation of startable plugins',
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
            'get_translate_data': 'normal',
            'get_option_list': 'normal',
            'translate': 'normal',
            'translate_plugin': 'normal',
        };

        return _GetCmdFunctionsBase($list);
    };

    let $languageCodesDone = 'false';
    let $languageCodes = [];
    let $languageCodesListAsset = {};
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

    const _GetPluginName = function($data) {
        let $pluginType = 'welcome';
        const $tmp = $data.split('_');

        if (_IsSet($tmp[0]) === 'true') {
            $pluginType = $tmp[0];
        }

        return 'infohub_translate_' + $pluginType;
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
     * Set up the Workbench Graphical User Interface
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
                    'plugin': 'infohub_translate_menu',
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
                        'box_id': 'main.body.infohub_translate.form',
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
                    'plugin': 'infohub_translate_' + $childName,
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
     * When you need data from other nodes then any level1 plugin must help to get that.
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

            if ($in.from_plugin.plugin.indexOf('infohub_translate_') !== 0) {
                return {
                    'answer': 'false',
                    'message': 'Only children to this plugin can call this function',
                };
            }

            return _SubCall({
                'to': {
                    'node': 'server',
                    'plugin': 'infohub_translate',
                    'function': $in.to.function,
                },
                'data': $in.data,
                'data_back': {
                    'step': 'step_end',
                },
                'wait': 0.2
            });
        }

        return $in.response;
    };

    /**
     * Gives you the translated data. The data is merged together from all the languages you prefer.
     * This function is called from each plugin that want its translation data.
     * @version 2019-03-18
     * @since   2016-03-18
     * @author  Peter Lembke
     */
    $functions.push('get_translate_data');
    const get_translate_data = function($in = {}) {
        let $parts, $key, $assetKey, $data = {}, $pluginName;

        const $default = {
            'step': 'step_get_language_codes',
            'from_plugin': {'node': '', 'plugin': ''},
            'response': {
                'answer': 'false',
                'message': '',
                'data': {},
                'assets': {},
            },
            'data_back': {
                'plugin_name': '',
            },
        };
        $in = _Default($default, $in);

        if ($in.from_plugin.node !== 'client') {
            $in.response.message = 'I only accept calls from client plugins';
            $in.step = 'step_end';
        }

        if ($in.step === 'step_get_language_codes') {
            $in.step = 'step_get_translations';

            if ($languageCodesDone === 'false') {
                return _SubCall({
                    'to': {
                        'node': 'client',
                        'plugin': 'infohub_configlocal',
                        'function': 'get_config',
                    },
                    'data': {
                        'section_name': 'language',
                    },
                    'data_back': {
                        'step': 'step_get_language_codes_response',
                    },
                });
            }
        }

        if ($in.step === 'step_get_language_codes_response') {
            const $languageCodesString = _GetData({
                'name': 'response|data|language',
                'default': '',
                'data': $in,
                'split': '|',
            });

            $languageCodes = []; // Array with language codes
            $languageCodesListAsset = {}; // Class global object with language codes as keys

            if (_Empty($languageCodesString) === 'false') {
                $parts = $languageCodesString.split(',');
                for (let $i = 0; $i < $parts.length; $i = $i + 1) {
                    $key = $parts[$i].trim().toLowerCase();
                    $languageCodes.push($key); // Preserves the order

                    $assetKey = 'translate/' + $key + '.json';
                    $languageCodesListAsset[$assetKey] = ''; // Used by Infohub_Asset to get the right assets
                }
            }

            $languageCodesDone = 'true';
            $in.step = 'step_get_translations';
        }

        if ($in.step === 'step_get_translations') {
            $in.step = 'step_get_translations_call';
            $pluginName = _GetGrandPluginName($in.from_plugin.plugin);
            $in.data_back.plugin_name = $pluginName;
            if (_IsSet($pluginTranslationsMerged[$pluginName]) === 'true') {
                $in.step = 'step_return_data';
            }
        }

        if ($in.step === 'step_get_translations_call') {
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_asset',
                    'function': 'get_plugin_assets',
                },
                'data': {
                    'plugin_name': $pluginName,
                    'list': $languageCodesListAsset,
                },
                'data_back': {
                    'step': 'step_get_translations_response',
                    'plugin_name': $pluginName,
                },
            });
        }

        if ($in.step === 'step_get_translations_response') {
            // Now fill object $translations with language code as key and asset contents data as data.
            let $translations = {};
            for (let $key in $in.response.assets) {
                if ($in.response.assets.hasOwnProperty($key) === false) {
                    continue;
                }

                // You have "translate/sv_se.json", remove "translate/" and ".json". Left is "sv_se"
                const $languageCode = $key.slice('translate/'.length).
                    slice(0, -'.json'.length);

                $translations[$languageCode] = _GetData({
                    'name': $key + '|contents|data',
                    'default': {},
                    'data': $in.response.assets,
                    'split': '|',
                });
            }

            // Merge together your preferred translations with the least preferred first and your most preferred on top.
            let $merged = {};
            for (let $i = $languageCodes.length - 1; $i >= 0; $i = $i - 1) {
                const $languageCode = $languageCodes[$i];
                if (_IsSet($translations[$languageCode]) === 'true') {
                    $merged = _MergeData($merged, $translations[$languageCode]);
                }
            }

            // Store the merged translations with pluginName as key
            $pluginName = $in.data_back.plugin_name;
            $pluginTranslationsMerged[$pluginName] = _ByVal($merged);
            $in.step = 'step_return_data';
        }

        if ($in.step === 'step_return_data') {
            $data = $pluginTranslationsMerged[$pluginName];
            $in.response.answer = 'true';
            $in.response.message = 'Here are the translations for the plugin';
        }

        return {
            'answer': $in.response.answer,
            'message': $in.response.message,
            'data': $data,
        };
    };

    /**
     * Get the list with languages that libre translate can handle
     *
     * @version 2024-06-14
     * @since   2021-09-09
     * @author  Peter Lembke
     */
    $functions.push('get_option_list');
    const get_option_list = function($in = {}) {
        const $default = {
            'type': 'language', // language or plugin
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
            },
            'data_back': {}
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
                    'path': 'infohub_translate/'+$in.type+'_list',
                },
                'data_back': {
                    'step': 'step_use_cache_response',
                    'type': $in.type, // 'language' or 'plugin'
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
                    'plugin': 'infohub_translate',
                    'function': 'get_'+$in.type+'_option_list',
                },
                'data': {
                    'selected': $in.selected
                },
                'data_back': {
                    'step': 'step_ask_server_response',
                    'type': $in.type, // 'language' or 'plugin'
                    'selected': $in.selected,
                    'use_cache': $in.use_cache
                },
                'wait': 0.2
            });
        }

        if ($in.step === 'step_ask_server_response') {
            $in.step = 'step_store_in_cache';
            if ($in.response.answer === 'false') {
                $in.step = 'step_end';
            }
        }

        if ($in.step === 'step_store_in_cache') {
            let $messageOut = _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_storage',
                    'function': 'write',
                },
                'data': {
                    'path': 'infohub_translate/'+$in.type+'_list',
                    'data': {
                        'options': $in.response.options
                    }
                },
                'data_back': {
                    'step': 'step_void' // Do not inform me how it went
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
     *
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

            if (_Empty($in.from_language) === 'true') {
                return {
                    'answer': 'false',
                    'message': 'From language is missing',
                    'ok': 'false',
                    'to_text': ''
                };
            }

            if (_Empty($in.to_language) === 'true') {
                return {
                    'answer': 'false',
                    'message': 'To language is missing',
                    'ok': 'false',
                    'to_text': ''
                };
            }

            if (_Empty($in.from_text) === 'true') {
                return {
                    'answer': 'false',
                    'message': 'Please give me a text to translate',
                    'ok': 'false',
                    'to_text': ''
                };
            }

            return _SubCall({
                'to': {
                    'node': 'server',
                    'plugin': 'infohub_translate',
                    'function': 'translate',
                },
                'data': {
                    'from_language': $in.from_language,
                    'to_language': $in.to_language,
                    'from_text': $in.from_text
                },
                'data_back': {
                    'step': 'step_end'
                },
                'wait': 0.2
            });
        }

        return {
            'answer': $in.response.answer,
            'message': $in.response.message,
            'ok': $in.response.answer,
            'to_text': $in.response.to_text
        };
    }

    /**
     * Ask the server to translate listed plugins to all the listed languages
     *
     * @version 2024-11-10
     * @since   2024-11-10
     * @author  Peter Lembke
     */
    $functions.push('translate_plugin');
    const translate_plugin = function($in = {}) {
        const $default = {
            'plugin_list': [],
            'language_list': [],
            'step': 'step_start',
            'response': {
                'answer': 'false',
                'message': 'Nothing to report',
                'to_text': ''
            }
        };
        $in = _Default($default, $in);

        if ($in.step === 'step_start') {
            return _SubCall({
                'to': {
                    'node': 'server',
                    'plugin': 'infohub_translate',
                    'function': 'translate_all_plugin_names',
                },
                'data': {
                    'plugin_list': $in.plugin_list,
                    'language_list': $in.language_list,
                },
                'data_back': {
                    'step': 'step_end'
                },
                'wait': 0.2
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

//# sourceURL=infohub_translate.js