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
function infohub_translate() {

// include "infohub_base.js"

    /*jshint evil:true */
    /*jshint devel:true */
    /*jslint browser: true, evil: true, plusplus: true, todo: true */

    const _Version = function() {
        return {
            'date': '2019-09-28',
            'since': '2019-09-28',
            'version': '1.0.0',
            'checksum': '{{checksum}}',
            'class_name': 'infohub_translate',
            'note': 'Handle the translation of startable plugins',
            'status': 'normal',
            'license_name': 'GNU GPL 3 or later'
        };
    };

    const _GetCmdFunctions = function() {
        return {
            'create': 'normal',
            'setup_gui': 'normal',
            'click_menu': 'normal',
            'click': 'normal',
            'call_server': 'normal',
            'get_translate_data': 'normal'
        };
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
    $functions.push("_GetGrandPluginName");
    const _GetGrandPluginName = function($pluginName)
    {
        const $parts = $pluginName.split('_');
        if (_Count($parts) > 2) {
            return $parts[0] + '_' + $parts[1];
        }

        return $pluginName;
    };

    const _GetPluginName = function($data)
    {
        let $pluginType = 'welcome';
        const $tmp = $data.split("_");

        if (_IsSet($tmp[0]) === 'true') {
            $pluginType = $tmp[0];
        }

        return 'infohub_translate_' + $pluginType;
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

    /**
     * Merge only when there are data in a key
     * @param {type} $string
     * @returns string
     */
    $functions.push('_MergeData');
    const _MergeData = function ($object1, $object2)
    {
        "use strict";

        if (typeof $object1 === 'object') {
            if (typeof $object2 === 'object') {
                $object1 = _ByVal(_MergeKeys($object1, $object2));
            }
        }

        return _ByVal($object1);
    };

    $functions.push('_MergeKeys');
    const _MergeKeys = function ($object1, $object2)
    {
        "use strict";

        for (let $key in $object2)
        {
            if ($object2.hasOwnProperty($key) === false) {
                continue;
            }

            if (typeof $object2[$key] === 'string') {
                if ($object2[$key] !== '') {
                    $object1[$key] = $object2[$key];
                }
            }

            if (typeof $object2[$key] === 'object')
            {
                if (_Count($object2[$key]) > 0)
                {
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
    // * Can only be reached trough cmd()
    // ***********************************************************

    /**
     * Get the raw data for the markdown doc file.
     * Used by infohub_translate_doc to render the documentation
     * @version 2019-03-14
     * @since   2019-03-14
     * @author  Peter Lembke
     */
    $functions.push("create"); // Enable this function
    const create = function ($in) {
        "use strict";

        const $default = {
            'type': '',
            'alias': '',
            'original_alias': '',
            'step': 'step_get_doc_file',
            'html': '',
            'css_data': {},
            'response': {
                'answer': 'false',
                'message': 'nothing to report from infohub_translate->create',
                'data': {},
                'contents': '',
                'checksum': '',
                'html': ''
            }
        };
        $in = _Merge($default, $in);

        if ($in.step === 'step_get_doc_file')
        {
            return _SubCall({
                'to': {
                    'node': 'server',
                    'plugin': 'infohub_translate',
                    'function': 'get_doc_file'
                },
                'data': {
                    'file': $in.type
                },
                'data_back': {
                    'step': 'step_get_doc_file_response',
                    'alias': $in.alias,
                    'type': $in.type
                }
            });
        }

        if ($in.step === 'step_get_doc_file_response')
        {
            $in.step = 'step_end';
            if ($in.response.answer === 'true') {
                $in.step = 'step_render_markdown';
            }
        }

        if ($in.step === 'step_render_markdown') {
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_markdown',
                    'function': 'create'
                },
                'data': {
                    'text': atob($in.response.contents)
                },
                'data_back': {
                    'step': 'step_render_markdown_response',
                    'alias': $in.alias,
                    'type': $in.type
                }
            });
        }

        if ($in.step === 'step_render_markdown_response') {
            $in.step = 'step_end';
            if ($in.response.answer === 'true') {
                $in.step = 'step_final';
            }
        }

        if ($in.step === 'step_final') {
            if (_Empty($in.alias) === 'false') {
                // All IDs become unique by inserting the parent alias in each ID.
                const $find = '{box_id}';
                const $replace = $find + '_' + $in.alias;
                $in.html = $in.html.replace(new RegExp($find, 'g'), $replace);
            }
        }

        return {
            'answer': $in.response.answer,
            'message': $in.response.message,
            'html': $in.html,
            'css_data': $in.css_data
        };
    };

    /**
     * Setup the Workbench Graphical User Interface
     * @version 2019-03-13
     * @since   2017-10-03
     * @author  Peter Lembke
     */
    $functions.push('setup_gui');
    const setup_gui = function ($in)
    {
        "use strict";

        const $default = {
            'box_id': '',
            'step': 'step_start',
            'response': {
                'answer': '',
                'message': '',
                'data': {}
            }
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
                            'box_data': 'The menu will render here'
                        },
                        {
                            'parent_box_id': $in.box_id,
                            'box_position': 'last',
                            'box_mode': 'data',
                            'box_alias': 'form',
                            'max_width': 100, // 100 will be translated to 100%
                            'box_data': 'Use the menu'
                        }
                    ]
                },
                'data_back': {
                    'box_id': $in.box_id,
                    'step': 'step_get_translations'
                }
            });
        }

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
            $in.step = 'step_menu';
        }

        if ($in.step === 'step_menu')
        {
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_translate_menu',
                    'function': 'create'
                },
                'data': {
                    'subtype': 'menu',
                    'parent_box_id': $in.box_id,
                    'translations': $classTranslations
                },
                'data_back': {
                    'box_id': $in.box_id,
                    'step': 'step_render_instructions'
                }
            });
        }

        if ($in.step === 'step_render_instructions') {
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
                        'box_id': 'main.body.infohub_translate.form',
                        'max_width': 640,
                        'scroll_to_box_id': 'true'
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
     * Handle the menu clicks
     * @version 2019-03-13
     * @since 2018-09-26
     * @author Peter Lembke
     */
    $functions.push("click_menu");
    const click_menu = function ($in)
    {
        "use strict";

        const $default = {
            'step': 'step_start',
            'event_data': '',
            'parent_box_id': ''
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
                    'translations': $classTranslations
                },
                'data_back': {
                    'step': 'step_end'
                }
            });
        }

        return {
            'answer': 'true',
            'message': 'Menu click done'
        };
    };

    /**
     * All clicks except the menu goes here and are distributed
     * to the right child and the right click function.
     * @version 2019-03-13
     * @since 2019-03-13
     * @author Peter Lembke
     */
    $functions.push("click");
    const click = function ($in)
    {
        "use strict";

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
                'files_data': [] // For the import button
            }
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
                    'function': 'click_' + $clickName
                },
                'data': {
                    'event_data': $in.event_data,
                    'value': $in.value,
                    'values': $in.response.value,
                    'files_data': $in.response.files_data,
                    'box_id': $in.box_id
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
     * @version 2019-03-13
     * @since 2019-03-13
     * @author Peter Lembke
     */
    $functions.push("call_server");
    const call_server = function ($in)
    {
        "use strict";

        const $default = {
            'step': 'step_start',
            'to': {'function': ''},
            'data': {},
            'response': {},
            'from_plugin': {
                'node': '',
                'plugin': ''
            }
        };
        $in = _Default($default, $in);

        if ($in.step === 'step_start') {

            if ($in.from_plugin.node !== 'client') {
                return {
                    'answer': 'false',
                    'message': 'Only plugins from the client node can call this function'
                };
            }

            if ($in.from_plugin.plugin.indexOf('infohub_translate_') !== 0) {
                return {
                    'answer': 'false',
                    'message': 'Only children to this plugin can call this function'
                };
            }

            return _SubCall({
                'to': {
                    'node': 'server',
                    'plugin': 'infohub_translate',
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

    /**
     * Give you the translate data. It is merged together from all the languages you prefer
     * @todo This function is not started
     * @version 2019-03-18
     * @since   2016-03-18
     * @author  Peter Lembke
     */
    $functions.push('get_translate_data');
    const get_translate_data = function ($in)
    {
        "use strict";

        let $parts, $key, $assetKey, $data = {}, $pluginName;

        const $default = {
            'step': 'step_get_language_codes',
            'from_plugin': {'node': '', 'plugin': ''},
            'response': {
                'answer': 'false',
                'message': '',
                'data': {},
                'assets': {}
            },
            'data_back': {
                'plugin_name': ''
            }
        };
        $in = _Default($default, $in);

        if ($in.from_plugin.node !== 'client') {
            $in.response.message = 'I only accept calls from client plugins';
            $in.step = 'step_end';
        }

        if ($in.step === 'step_get_language_codes')
        {
            $in.step = 'step_get_translations';

            if ($languageCodesDone === 'false') {
                return _SubCall({
                    'to': {
                        'node': 'client',
                        'plugin': 'infohub_configlocal',
                        'function': 'get_config'
                    },
                    'data': {
                        'section_name': 'language'
                    },
                    'data_back': {
                        'step': 'step_get_language_codes_response'
                    }
                });
            }
        }

        if ($in.step === 'step_get_language_codes_response')
        {
            const $languageCodesString = _GetData({
                'name': 'response|data|language',
                'default': '',
                'data': $in,
                'split': '|'
            });

            $languageCodes = []; // Array with language codes
            $languageCodesListAsset = {}; // Class global object with language codes as keys

            if (_Empty($languageCodesString) === 'false')
            {
                $parts = $languageCodesString.split(',');
                for (let $i=0; $i < $parts.length; $i++)
                {
                    $key = $parts[$i].trim().toLowerCase();
                    $languageCodes.push($key); // Preserves the order

                    $assetKey = 'translate/' + $key + '.json';
                    $languageCodesListAsset[$assetKey] = ''; // Used by Infohub_Asset to get the right assets
                }
            }

            $languageCodesDone = 'true';
            $in.step = 'step_get_translations';
        }

        if ($in.step === 'step_get_translations')
        {
            $in.step = 'step_get_translations_call';
            $pluginName = _GetGrandPluginName($in.from_plugin.plugin);
            $in.data_back.plugin_name = $pluginName;
            if (_IsSet($pluginTranslationsMerged[$pluginName]) === 'true') {
                $in.step = 'step_return_data';
            }
        }

        if ($in.step === 'step_get_translations_call')
        {
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_asset',
                    'function': 'get_plugin_assets'
                },
                'data': {
                    'plugin_name': $pluginName,
                    'list': $languageCodesListAsset
                },
                'data_back': {
                    'step': 'step_get_translations_response',
                    'plugin_name': $pluginName
                }
            });
        }

        if ($in.step === 'step_get_translations_response')
        {
            // Now fill object $translations with language code as key and asset contents data as data.
            let $translations = {};
            for (let $key in $in.response.assets)
            {
                if ($in.response.assets.hasOwnProperty($key) === false) {
                    continue;
                }

                // You have "translate/sv_se.json", remove "translate/" and ".json". Left is "sv_se"
                const $languageCode = $key.slice('translate/'.length).slice(0,-'.json'.length);

                $translations[$languageCode] = _GetData({
                    'name': $key + '|contents|data',
                    'default': {},
                    'data': $in.response.assets,
                    'split': '|'
                });
            }

            // Merge together your preferred translations with the least preferred first and your most preferred on top.
            let $merged = {};
            for (let $i=$languageCodes.length-1; $i >= 0; $i--)
            {
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
            'data': $data
        };
    };
}
//# sourceURL=infohub_translate.js