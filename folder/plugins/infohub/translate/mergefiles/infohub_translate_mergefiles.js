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
function infohub_translate_mergefiles() {

// include "infohub_base.js"

    /*jshint evil:true */
    /*jshint devel:true */
    /*jslint browser: true, evil: true, plusplus: true, todo: true */

    const _Version = function() {
        return {
            'date': '2019-10-04',
            'since': '2019-09-28',
            'version': '1.0.0',
            'checksum': '{{checksum}}',
            'class_name': 'infohub_translate_mergefiles',
            'note': 'Handle the merge of the two template files, the original phrases with the translated phrases',
            'status': 'normal',
            'license_name': 'GNU GPL 3 or later'
        };
    };

    const _GetCmdFunctions = function() {
        return {
            'create': 'normal',
            'click_merge_files': 'normal'
        };
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
     * Get instructions and create the message to InfoHub View
     * @version 2019-03-13
     * @since   2016-10-16
     * @author  Peter Lembke
     */
    $functions.push('create');
    const create = function ($in)
    {
        "use strict";

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
                        'presentation_box_merge_files': {
                            'plugin': 'infohub_rendermajor',
                            'type': 'presentation_box',
                            'head_label': _Translate('Merge files'),
                            'content_data': '[button_merge_files]',
                            'foot_text': '[text_import_instructions]'
                        },
                        'button_merge_files': {
                            'plugin': 'infohub_renderform',
                            'type': 'file',
                            'button_label': _Translate('Merge the two files'),
                            'accept': '*.json',
                            'event_data': 'mergefiles|merge_files',
                            'to_node': 'client',
                            'to_plugin': 'infohub_translate',
                            'to_function': 'click'
                        },
                        'text_import_instructions': {
                            'type': 'text',
                            'text': 'This tool merge the two files and download the complete language file.'
                        }
                    },
                    'how': {
                        'mode': 'one box',
                        'text': '[presentation_box_merge_files]'
                    },
                    'where': {
                        'box_id': 'main.body.infohub_translate.form', // 'box_id': $in.parent_box_id + '.form',
                        'max_width': 960,
                        'scroll_to_box_id': 'true'
                    }
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
     * Merge the two files into one file and download the file.
     * @version 2019-10-04
     * @since   2019-10-03
     * @author  Peter Lembke
     */
    $functions.push('click_merge_files');
    const click_merge_files = function ($in)
    {
        "use strict";

        const $default = {
            'box_id': '',
            'step': 'step_start',
            'answer': 'false',
            'message': 'Nothing to report',
            'ok': 'false',
            'files_data': [],
            'response': {
                'answer': 'false',
                'message': 'Nothing to report'
            }
        };
        $in = _Default($default, $in);

        let $file = {};

        if ($in.step === 'step_start')
        {
            $in.step = 'step_get_files';
            if ($in.files_data.length !== 2) {
                $in.message = 'You need to select two json files';
                $in.step = 'step_end'
            }
        }

        if ($in.step === 'step_get_files')
        {
            let $checksums = {};

            for (let $i=0; $i<2; $i++)
            {
                const $fileData = _GetData({
                    'name': 'files_data/'+$i+'/content',
                    'default': '',
                    'data': $in
                });

                const $type = _GetData({
                    'name': 'version/file_type',
                    'default': '',
                    'data': $fileData
                });

                if ($type === 'key_file' || $type === 'translate_file') {
                    $file[$type] = $fileData;
                }

                const $dataChecksum = _GetData({
                    'name': 'version/data_checksum',
                    'default': '',
                    'data': $fileData
                });

                $checksums[$dataChecksum] = 'true';
            }

            $in.step = 'step_end';
            $in.message = 'One of the files did not have a file_type. Make sure they are both valid files.';

            if (_Count($file) === 2 && _Count($checksums) === 1) {
                $in.message = 'I have the files. Now I will merge them.';
                $in.step = 'step_merge_files';
            }
        }

        if ($in.step === 'step_merge_files')
        {
            let $newFile = {};

            for (let $pluginName in $file.key_file.data)
            {
                const $translationsArray = $file.key_file.data[$pluginName];

                for (let $text in $translationsArray)
                {
                    const $code = $translationsArray[$text];

                    const $translation = _GetData({
                        'name': 'data|' + $pluginName + '|' + $code,
                        'default': '',
                        'data': $file.translate_file,
                        'split': '|'
                    });

                    if (_Empty($translation) === 'true') {
                        continue;
                    }

                    if (_IsSet($newFile[$pluginName]) === 'false') {
                        $newFile[$pluginName] = {};
                    }
                    $newFile[$pluginName][$text] = $translation;
                }
            }

            $file.key_file.version.file_type = 'finished_file';
            let $withHeader = $file.key_file;
            $withHeader['data'] = $newFile;

            const $fileName = $withHeader.version.plugin + '_' + $file.translate_file.version.language;
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
//# sourceURL=infohub_translate_mergefiles.js