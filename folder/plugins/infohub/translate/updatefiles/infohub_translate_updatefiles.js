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
function infohub_translate_updatefiles() {

    "use strict";

// include "infohub_base.js"

    const _Version = function() {
        return {
            'date': '2019-10-05',
            'since': '2019-09-28',
            'version': '1.0.0',
            'checksum': '{{checksum}}',
            'class_name': 'infohub_translate_updatefiles',
            'note': 'Upload an existing language file and you will get the latest phrases',
            'status': 'normal',
            'SPDX-License-Identifier': 'GPL-3.0-or-later'
        };
    };

    const _GetCmdFunctions = function() {
        const $list = {
            'create': 'normal',
            'click_upload': 'normal'
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
    $functions.push("_GetGrandPluginName");
    const _GetGrandPluginName = function($pluginName)
    {
        const $parts = $pluginName.split('_');

        if (_Count($parts) > 2) {
            return $parts[0] + '_' + $parts[1];
        }

        return $pluginName;
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
     * Get instructions and create the message to InfoHub View
     * @version 2019-10-05
     * @since   2019-10-05
     * @author  Peter Lembke
     */
    $functions.push('create');
    const create = function ($in)
    {
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

        if ($in.step === 'step_render')
        {
            $classTranslations = $in.translations;

            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_render',
                    'function': 'create'
                },
                'data': {
                    'what': {
                        'presentation_box_update_file': {
                            'plugin': 'infohub_rendermajor',
                            'type': 'presentation_box',
                            'head_label': _Translate('Update translation file'),
                            'content_data': '[my_file_selector]',
                            'foot_text': '[text_instructions]'
                        },
                        'my_file_selector': {
                            'plugin': 'infohub_renderform',
                            'type': 'file',
                            'button_label': _Translate('Select file'),
                            'accept': '*.json',
                            'event_data': 'updatefiles|upload',
                            'to_node': 'client',
                            'to_plugin': 'infohub_translate',
                            'to_function': 'click'
                        },
                        'text_instructions': {
                            'type': 'text',
                            'text': _Translate('If you already have a language file and want to add the latest phrases then use this feature. Upload the file. Get the new phrases and then download the updated file.')
                        }
                    },
                    'how': {
                        'mode': 'one box',
                        'text': '[presentation_box_update_file]'
                    },
                    'where': {
                        'box_id': 'main.body.infohub_translate.form', // 'box_id': $in.parent_box_id + '.form',
                        'max_width': 960,
                        'scroll_to_box_id': 'true'
                    },
                    'cache_key': 'updatefiles'
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
     * Click the button and select the file to use. Now we come here.
     * The file are read and we request the latest data from the server.
     * Then we create a new language file, remove deprecated phrases and add new ones.
     * The resulting file will be downloaded.
     * @version 2019-10-05
     * @since   2019-10-05
     * @author  Peter Lembke
     */
    $functions.push('click_upload');
    const click_upload = function ($in)
    {
        const $default = {
            'box_id': '',
            'step': 'step_start',
            'answer': 'false',
            'message': 'Nothing to report',
            'ok': 'false',
            'files_data': [],
            'response': {
                'answer': 'false',
                'message': 'Nothing to report',
                'file1': {}
            },
            'data_back': {
                'answer': 'false',
                'message': 'Nothing to report',
                'plugin_name': '',
                'language_file': {},
                'key_file': {}
            }
        };
        $in = _Default($default, $in);

        if ($in.step === 'step_start')
        {
            $in.step = 'step_get_file';
            if ($in.files_data.length !== 1) {
                $in.message = 'You need to select one json file';
                $in.step = 'step_end';
            }
        }

        if ($in.step === 'step_get_file')
        {
            const $fileData = _GetData({
                'name': 'files_data/0/content',
                'default': '',
                'data': $in
            });

            const $pluginName = _GetData({
                'name': 'version/plugin',
                'default': '',
                'data': $fileData
            });

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
                        'function': 'create_template_file'
                    },
                    'data': {
                        'plugin_name': $pluginName
                    }
                },
                'data_back': {
                    'step': 'step_ask_server_response',
                    'plugin_name': $pluginName,
                    'language_file': $fileData
                }
            });
        }

        if ($in.step === 'step_ask_server_response')
        {
            $in.data_back.answer = $in.response.answer;
            $in.data_back.message = $in.response.message;
            $in.data_back.key_file = $in.response.file1;

            if ($in.response.answer === 'true') {
                $in.data_back.ok = 'true';
            }

            $in.step = 'step_new_file';
        }

        if ($in.step === 'step_new_file')
        {
            let $newFile = {};

            for (let $pluginName in $in.data_back.key_file.data)
            {
                const $translationsArray = $in.data_back.key_file.data[$pluginName];

                for (let $text in $translationsArray)
                {
                    const $translation = _GetData({
                        'name': 'data|' + $pluginName + '|' + $text,
                        'default': $text,
                        'data': $in.data_back.language_file,
                        'split': '|'
                    });

                    if (_IsSet($newFile[$pluginName]) === 'false') {
                        $newFile[$pluginName] = {};
                    }
                    $newFile[$pluginName][$text] = $translation;
                }
            }

            let $withHeader = $in.data_back.language_file;
            $withHeader.data = $newFile;

            const $fileName = $withHeader.version.plugin + '_' + $withHeader.version.language;
            const $extension = '.json';

            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_view',
                    'function': 'file_write'
                },
                'data': {
                    'file_name': $fileName + $extension,
                    'content': _JsonEncode($withHeader)
                },
                'data_back': {
                    'step': 'step_download_response'
                }
            });
        }

        if ($in.step === 'step_download_response')
        {
            if ($in.answer === 'true') {
                $in.ok = 'true';
            }
        }

        return {
            'answer': $in.answer,
            'message': $in.message,
            'ok': $in.ok
        };
    };
}
//# sourceURL=infohub_translate_updatefiles.js