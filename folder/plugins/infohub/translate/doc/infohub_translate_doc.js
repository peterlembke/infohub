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
function infohub_translate_doc() {

    'use strict';

// include "infohub_base.js"

    const _Version = function() {
        return {
            'date': '2021-09-05',
            'since': '2019-09-28',
            'version': '1.0.0',
            'checksum': '{{checksum}}',
            'class_name': 'infohub_translate_doc',
            'note': 'Show the documentation for this plugin',
            'status': 'normal',
            'SPDX-License-Identifier': 'GPL-3.0-or-later',
        };
    };

    const _GetCmdFunctions = function() {
        const $list = {
            'create': 'normal',
            'click_main': 'normal',
            'click_createfile': 'normal',
            'click_updateplugin': 'normal',
            'click_validate': 'normal',
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
     * @version 2016-10-16
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
                        'container_buttons': {
                            'type': 'common',
                            'subtype': 'container',
                            'tag': 'div',
                            'data': '[button_main][button_createfile][button_updateplugin][button_validate]',
                            'class': 'container-small',
                        },
                        'container_doc': {
                            'type': 'common',
                            'subtype': 'container',
                            'tag': 'div',
                            'data': _Translate('DOCUMENTATION_WILL_RENDER_HERE'),
                            'class': 'container-medium'
                        },
                        'button_main': {
                            'plugin': 'infohub_renderform',
                            'type': 'button',
                            'mode': 'button',
                            'button_label': _Translate('MAIN_DOC'),
                            'event_data': 'doc|main',
                            'to_plugin': 'infohub_translate',
                            'to_function': 'click',
                        },
                        'button_createfile': {
                            'plugin': 'infohub_renderform',
                            'type': 'button',
                            'mode': 'button',
                            'button_label': _Translate('CREATE_TRANSLATION_FILE'),
                            'event_data': 'doc|createfile',
                            'to_plugin': 'infohub_translate',
                            'to_function': 'click',
                        },
                        'button_updateplugin': {
                            'plugin': 'infohub_renderform',
                            'type': 'button',
                            'mode': 'button',
                            'button_label': _Translate('UPDATE_PLUGIN_KEYS'),
                            'event_data': 'doc|updateplugin',
                            'to_plugin': 'infohub_translate',
                            'to_function': 'click',
                        },
                        'button_validate': {
                            'plugin': 'infohub_renderform',
                            'type': 'button',
                            'mode': 'button',
                            'button_label': _Translate('VALIDATE_TRANSLATION_FILES'),
                            'event_data': 'doc|validate',
                            'to_plugin': 'infohub_translate',
                            'to_function': 'click',
                        },
                    },
                    'how': {
                        'mode': 'one box',
                        'text': '[container_buttons][container_doc]',
                    },
                    'where': {
                        'box_id': 'main.body.infohub_translate.form', // 'box_id': $in.parent_box_id + '.form',
                        'max_width': 100,
                        'scroll_to_box_id': 'true',
                    },
                    'cache_key': 'doc',
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

    /**
     * Show the documentation
     * @version 2019-03-13
     * @since   2019-03-13
     * @author  Peter Lembke
     */
    $functions.push('click_main');
    const click_main = function($in = {}) {
        const $default = {
            'step': 'step_render',
            'response': {
                'answer': 'false',
                'message': ''
            },
        };
        $in = _Default($default, $in);

        if ($in.step === 'step_render') {
            return _GetCall('infohub_translate');
        }

        return {
            'answer': $in.response.answer,
            'message': $in.response.message,
            'ok': $in.response.answer
        };
    };

    /**
     * Show the documentation
     * @version 2019-03-13
     * @since   2019-03-13
     * @author  Peter Lembke
     */
    $functions.push('click_createfile');
    const click_createfile = function($in = {}) {
        const $default = {
            'step': 'step_render',
            'response': {
                'answer': 'false',
                'message': ''
            },
        };
        $in = _Default($default, $in);

        if ($in.step === 'step_render') {
            return _GetCall('infohub_translate_createfile');
        }

        return {
            'answer': $in.response.answer,
            'message': $in.response.message,
            'ok': $in.response.answer
        };
    };

    /**
     * Show the documentation
     * @version 2019-03-13
     * @since   2019-03-13
     * @author  Peter Lembke
     */
    $functions.push('click_updateplugin');
    const click_updateplugin = function($in = {}) {
        const $default = {
            'step': 'step_render',
            'response': {
                'answer': 'false',
                'message': ''
            },
        };
        $in = _Default($default, $in);

        if ($in.step === 'step_render') {
            return _GetCall('infohub_translate_updateplugin');
        }

        return {
            'answer': $in.response.answer,
            'message': $in.response.message,
            'ok': $in.response.answer
        };
    };

    /**
     * Show the documentation
     * @version 2019-03-13
     * @since   2019-03-13
     * @author  Peter Lembke
     */
    $functions.push('button_validate');
    const click_validate = function($in = {}) {
        const $default = {
            'step': 'step_render',
            'response': {
                'answer': 'false',
                'message': ''
            },
        };
        $in = _Default($default, $in);

        if ($in.step === 'step_render') {
            return _GetCall('infohub_translate_validate');
        }

        return {
            'answer': $in.response.answer,
            'message': $in.response.message,
            'ok': $in.response.answer
        };
    };

    /**
     * Show the documentation
     * @version 2021-08-12
     * @since   2019-03-13
     * @author  Peter Lembke
     */
    $functions.push('_GetCall');
    const _GetCall = function($fileName) {

        const $pluginName = 'infohub_translate';

        return _SubCall({
            'to': {
                'node': 'client',
                'plugin': 'infohub_doc',
                'function': 'render_doc',
            },
            'data': {
                'file_name': $fileName,
                'box_id': 'main.body.' + $pluginName + '.form.[container_doc]'
            },
            'data_back': {
                'step': 'step_end'
            },
        });
    };
}

//# sourceURL=infohub_translate_doc.js