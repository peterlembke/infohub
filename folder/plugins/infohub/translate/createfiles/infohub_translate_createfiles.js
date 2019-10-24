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
function infohub_translate_createfiles() {

// include "infohub_base.js"

    // ***********************************************************
    // * jshint.com options to suppress some warnings
    // ***********************************************************

    /*jshint evil:true */
    /*jshint devel:true */
    /*jslint browser: true, evil: true, plusplus: true, todo: true */

    // ***********************************************************
    // * your private class variables below, only declare with var
    // ***********************************************************

    var _Version = function() {
        return {
            'date': '2019-10-01',
            'since': '2019-09-28',
            'version': '1.0.0',
            'checksum': '{{checksum}}',
            'class_name': 'infohub_translate_createfiles',
            'note': 'Handle the creation of template files that you can translate',
            'status': 'normal',
            'license_name': 'GNU GPL 3 or later'
        };
    };

    var _GetCmdFunctions = function() {
        return {
            'create': 'normal',
            'click_refresh': 'normal',
            'click_create_files': 'normal',
            'click_download': 'normal'
        };
    };

    var $pluginTranslationsMerged = {};

    /**
     * Get the level 1 plugin name from a plugin name
     * example: infohub_contact_menu gives you infohub_contact
     * @param {string} $pluginName
     * @returns {string}
     * @private
     */
    $functions.push("_GetGrandPluginName");
    var _GetGrandPluginName = function($pluginName) {
        var $parts = $pluginName.split('_');
        if (_Count($parts) > 2) {
            return $parts[0] + '_' + $parts[1];
        }
        return $pluginName;
    };

    var $classTranslations = {};

    /**
     * Translate
     * Substitute a string for another string using a class local object
     * @param {type} $string
     * @returns string
     */
    $functions.push('_Translate');
    var _Translate = function ($string)
    {
        if (typeof $pluginTranslationsMerged !== 'object') { return $string; }
        return _GetData({
                'name': $string, 'default': $string,
                'data': $pluginTranslationsMerged, 'split': '|'
        });
    };

    /**
     * Merge only when there are data in a key
     * @param {type} $string
     * @returns string
     */
    $functions.push('_MergeData');
    var _MergeData = function ($object1, $object2) {
        "use strict";
        if (typeof $object1 === 'object') {
            if (typeof $object2 === 'object') {
                $object1 = _ByVal(_MergeKeys($object1, $object2));
            }
        }
        return _ByVal($object1);
    };

    $functions.push('_MergeKeys');
    var _MergeKeys = function ($object1, $object2)
    {
        "use strict";
        var $key;

        for ($key in $object2)
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
    var create = function ($in)
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
                        'my_presentation_box': {
                            'plugin': 'infohub_rendermajor',
                            'type': 'presentation_box',
                            'head_label': _Translate('Create files'),
                            'content_data': '[my_form]',
                            'foot_text': '[text_instructions]'
                        },
                        'my_form': {
                            'type': 'form',
                            'subtype': 'form',
                            'content': '[button_refresh][select_plugin][button_create_files][my_container]'
                        },
                        'button_refresh': {
                            'plugin': 'infohub_renderform',
                            'type': 'button',
                            'mode': 'button',
                            'button_label': _Translate('Refresh lists'),
                            'event_data': 'createfiles|refresh',
                            'to_node': 'client',
                            'to_plugin': 'infohub_translate',
                            'to_function': 'click'
                        },
                        'select_plugin': {
                            'plugin': 'infohub_renderform',
                            'type': 'select',
                            "label": _Translate("Select plugin"),
                            "description": _Translate("Lists all client plugins that can have translation files. Select a plugin and click Create files."),
                            "size": "6",
                            "multiple": "false",
                            "options": [],
                            'source_node': 'client',
                            'source_plugin': 'infohub_launcher',
                            'source_function': 'get_option_list',
                            'css_data': {
                                '.select': 'max-width: 200px;'
                            }
                        },
                        'button_create_files': {
                            'plugin': 'infohub_renderform',
                            'type': 'button',
                            'mode': 'button',
                            'button_label': _Translate('Create files'),
                            'event_data': 'createfiles|create_files',
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
                            'text': 'You get two files. You can paste the second one to Google translate and then merge them together with the next tool.'
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
     * Refresh the list with plugins
     * @version 2019-04-01
     * @since 2019-04-01
     * @author Peter Lembke
     */
    $functions.push("click_refresh");
    var click_refresh = function ($in)
    {
        "use strict";

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

        if ($in.step === 'step_render_plugin_options')
        {
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

        if ($in.step === 'step_render_language_options')
        {
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
    var click_create_files = function ($in)
    {
        "use strict";

        const $default = {
            'box_id': '',
            'step': 'step_form_read',
            'response': {
                'answer': 'false',
                'message': 'Nothing to report',
                'data': {},
                'form_data': {},
                'file1': {},
                'file2': {}
            },
            'data_back': {
                'answer': 'false',
                'message': 'Nothing to report',
                'ok': 'false',
                'plugin_name': '',
                'file1': {},
                'file2': {}
            }

        };
        $in = _Default($default, $in);

        let $nodeData = {};

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

        if ($in.step === 'step_form_read_response')
        {
            $in.step = 'step_end';

            if ($in.response.answer === 'true')
            {
                $nodeData = {
                    'plugin_name': _GetData({
                        'name': 'response/form_data/select_plugin/value/0',
                        'default': '',
                        'data': $in
                    })
                };

                $in.step = 'step_ask_server';
            }
        }

        if ($in.step === 'step_ask_server')
        {
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
                        'plugin_name': $nodeData['plugin_name']
                    }
                },
                'data_back': {
                    'step': 'step_ask_server_response',
                    'plugin_name': $nodeData['plugin_name']
                }
            });
        }

        if ($in.step === 'step_ask_server_response')
        {
            $in.data_back.answer = $in.response.answer;
            $in.data_back.message = $in.response.message;
            $in.data_back.file1 = $in.response.file1;
            $in.data_back.file2 = $in.response.file2;

            if ($in.response.answer === 'true') {
                $in.data_back.ok = 'true';
            }

            $in.step = 'step_show_message';
        }

        if ($in.step === 'step_show_message')
        {
            const $pluginName = _GetData({
                'name': 'data_back/plugin_name',
                'default': '',
                'data': $in
            });

            let $showMessage = $in.data_back.message;
            if (_Empty($pluginName) === 'false') {
                $showMessage = $pluginName + ': ' + $showMessage;
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
                    'file1': $in.data_back.file1,
                    'file2': $in.data_back.file2,
                    'step': 'step_show_message_response'
                }
            });
        }

        if ($in.step === 'step_show_message_response')
        {
            $in.step = 'step_file1_write';
        }

        if ($in.step === 'step_file1_write')
        {
            const $fileName = _GetData({
                'name': 'data_back/plugin_name',
                'default': 'template',
                'data': $in
            });

            const $extension = '-keyfile.json';

            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_view',
                    'function': 'file_write'
                },
                'data': {
                    'file_name': $fileName + $extension,
                    'content': _JsonEncode($in.data_back.file1)
                },
                'data_back': {
                    'step': 'step_file1_write_response',
                    'plugin_name': $in.data_back.plugin_name,
                    'file2': $in.data_back.file2
                }
            });
        }

        if ($in.step === 'step_file1_write_response') {
            $in.step = 'step_end';
            if ($in.response.answer === 'true') {
                $in.response.message = 'File exported';
                $in.step = 'step_file2_write';
            }
        }

        if ($in.step === 'step_file2_write')
        {
            const $fileName = _GetData({
                'name': 'data_back/plugin_name',
                'default': 'template',
                'data': $in
            });

            const $extension = '-translate.json';

            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_view',
                    'function': 'file_write'
                },
                'data': {
                    'file_name': $fileName + $extension,
                    'content': _JsonEncode($in.data_back.file2)
                },
                'data_back': {
                    'step': 'step_file2_write_response'
                }
            });
        }

        if ($in.step === 'step_file2_write_response')
        {
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
            'ok': $in.data_back.ok
        };
    };

}
//# sourceURL=infohub_translate_createfiles.js