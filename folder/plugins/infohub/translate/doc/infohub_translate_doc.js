/**
 * infohub_translate_doc
 * Show the documentation for this plugin
 *
 * @package     Infohub
 * @subpackage  infohub_translate_doc
 * @since       2019-09-28
 * @author      Peter Lembke <info@infohub.se>
 * @license     GPL-3.0-or-later
 * @copyright   Copyright (C) 2010- Peter Lembke
 * @see         https://github.com/peterlembke/infohub/blob/main/folder/plugins/infohub/translate/doc/infohub_translate_doc.md Documentation
 * @link        https://infohub.se/ InfoHub main page
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
            'click_manual': 'normal',
            'click_plugin': 'normal'
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
                            'data': '[button_main][button_manual][button_plugin]',
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
                        'button_manual': {
                            'plugin': 'infohub_renderform',
                            'type': 'button',
                            'mode': 'button',
                            'button_label': _Translate('MANUAL_TRANSLATION'),
                            'event_data': 'doc|manual',
                            'to_plugin': 'infohub_translate',
                            'to_function': 'click',
                        },
                        'button_plugin': {
                            'plugin': 'infohub_renderform',
                            'type': 'button',
                            'mode': 'button',
                            'button_label': _Translate('PLUGIN_TRANSLATION'),
                            'event_data': 'doc|plugin',
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
    $functions.push('click_manual');
    const click_manual = function($in = {}) {
        const $default = {
            'step': 'step_render',
            'response': {
                'answer': 'false',
                'message': ''
            },
        };
        $in = _Default($default, $in);

        if ($in.step === 'step_render') {
            return _GetCall('infohub_translate_manual');
        }

        return {
            'answer': $in.response.answer,
            'message': $in.response.message,
            'ok': $in.response.answer
        };
    };

    /**
     * Show the documentation
     * @version 2024-11-18
     * @since   2024-11-18
     * @author  Peter Lembke
     */
    $functions.push('click_plugin');
    const click_plugin = function($in = {}) {
        const $default = {
            'step': 'step_render',
            'response': {
                'answer': 'false',
                'message': ''
            },
        };
        $in = _Default($default, $in);

        if ($in.step === 'step_render') {
            return _GetCall('infohub_translate_plugin');
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