/**
 * Collection of demos to demonstrate InfoHub Client Render and View
 *
 * @author      Peter Lembke <info@infohub.se>
 * @version     2023-07-09
 * @since       2023-07-09
 * @copyright   Copyright (c) 2023, Peter Lembke
 * @license     https://opensource.org/licenses/gpl-license.php GPL-3.0-or-later
 * @see         https://github.com/peterlembke/infohub/blob/master/folder/plugins/infohub/demo/progress/infohub_demo_progress.md Documentation
 * @link        https://infohub.se/ InfoHub main page
 */
function infohub_demo_progress() {

    'use strict';

// include "infohub_base.js"

    $functions.push('_Version');
    /**
     * Version information, used by the version function
     * @returns {{date: string, note: string, 'SPDX-License-Identifier': string, checksum: string, version: string, class_name: string, since: string, status: string}}
     * @private
     */
    const _Version = function() {
        return {
            'date': '2023-07-09',
            'since': '2023-07-09',
            'version': '1.0.0',
            'checksum': '{{checksum}}',
            'class_name': 'infohub_demo_progress',
            'note': 'Collection of demos to demonstrate InfoHub Client Render and View',
            'status': 'normal',
            'SPDX-License-Identifier': 'GPL-3.0-or-later',
        };
    };

    $functions.push('_GetCmdFunctions');
    /**
     * List with all public functions you can call
     * @returns {*}
     * @private
     */
    const _GetCmdFunctions = function() {
        const $list = {
            'create': 'normal',
            'click_button_start': 'normal',
            'click_button_progress': 'normal'
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
            'parent_box_id': '',
            'translations': {},
            'step': 'step_start',
            'response': {
                'answer': 'false',
                'message': 'Nothing to report from infohub_demo_progress',
            },
        };
        $in = _Default($default, $in);

        if ($in.step === 'step_start') {
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
                            'head_label': _Translate('PROGRESS_BAR_DEMO'),
                            'content_data': '[my_start_button][my_progress_button][my_progress_bar]'
                        },
                        'my_progress_bar': {
                            'plugin': 'infohub_renderprogress',
                            'type': 'progress',
                            'value_of_max_text': ' ' + _Translate('OF') + ' '
                        },
                        'my_start_button': {
                            'plugin': 'infohub_renderform',
                            'type': 'button',
                            'mode': 'button',
                            'button_label': _Translate('PRESS_TO_START'),
                            'event_data': 'progress|button_start|100',
                            'to_node': 'client',
                            'to_plugin': 'infohub_demo',
                            'to_function': 'click',
                        },
                        'my_progress_button': {
                            'plugin': 'infohub_renderform',
                            'type': 'button',
                            'mode': 'button',
                            'button_label': _Translate('PRESS_TO_PROGRESS'),
                            'event_data': 'progress|button_progress|20',
                            'to_node': 'client',
                            'to_plugin': 'infohub_demo',
                            'to_function': 'click',
                        }
                    },
                    'how': {
                        'mode': 'one box',
                        'text': '[my_presentation_box]',
                    },
                    'where': {
                        'box_id': $in.parent_box_id + '.demo',
                        'max_width': 100,
                        'scroll_to_box_id': 'true',
                    },
                    'cache_key': 'progress',
                },
                'data_back': {
                    'step': 'step_end',
                },
            });
        }

        return {
            'answer': $in.response.answer,
            'message': $in.response.message,
            'data': $in.response.data,
        };
    };

    $functions.push('click_button_start');
    /**
     * Start the progress bar
     * @version 2023-08-10
     * @since   2023-08-10
     * @author  Peter Lembke
     */
    const click_button_start = function ($in = {}) {
        const $default = {
            'type': '',
            'event_type': '',
            'event_data': '',
            'box_id': '',
            'step': 'step_start'
        };
        $in = _Default($default, $in);

        if ($in.step === 'step_start') {

            const $boxId = $in.box_id + '_my_progress_bar';
            const $maxValue = parseInt($in.event_data); // Example: 100

            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_renderprogress',
                    'function': 'start_progress'
                },
                'data': {
                    'box_id': $boxId,
                    'max_value': $maxValue
                },
                'data_back': {
                    'step': 'step_end'
                }
            });
        }

        return {
            'answer': 'true',
            'message': 'Done'
        };
    };

    $functions.push('click_button_progress');
    /**
     * Progress the bar
     *
     * @version 2023-08-10
     * @since   2023-08-10
     * @author  Peter Lembke
     */
    const click_button_progress = function ($in = {}) {
        const $default = {
            'type': '',
            'event_type': '',
            'event_data': '',
            'box_id': '',
            'step': 'step_start'
        };
        $in = _Default($default, $in);

        if ($in.step === 'step_start') {

            const $boxId = $in.box_id + '.[my_progress_bar]';
            const $parts = $in.event_data.split('|');
            const $addToValueInt = parseInt($parts[0]);

            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_renderprogress',
                    'function': 'add_value'
                },
                'data': {
                    'box_id': $boxId,
                    'add_to_value': $addToValueInt
                },
                'data_back': {
                    'step': 'step_end'
                }
            });
        }

        return {
            'answer': 'true',
            'message': 'Done'
        };
    };

}

//# sourceURL=infohub_demo_progress.js