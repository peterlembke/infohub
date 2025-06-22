/**
 * infohub_demo_status
 * Render a status for infohub_demo
 *
 * @package     Infohub
 * @subpackage  infohub_demo_status
 * @since       2021-07-25
 * @author      Peter Lembke <info@infohub.se>
 * @license     GPL-3.0-or-later
 * @copyright   Copyright (C) 2010- Peter Lembke
 * @see         https://github.com/peterlembke/infohub/blob/main/folder/plugins/infohub/demo/status/infohub_demo_status.md Documentation
 * @link        https://infohub.se/ InfoHub main page
 */
function infohub_demo_status() {

    'use strict';

// include "infohub_base.js"

    $functions.push('_Version');
    /**
     * Version information, used by the version function
     * @returns {{date: string, note: string, 'SPDX-License-Identifier': string, checksum: string, version: string, class_name: string, since: string, status: string}}
     * @private
     */
    const _Version = function () {
        return {
            'date': '2021-07-25',
            'since': '2021-07-25',
            'version': '1.0.0',
            'checksum': '{{checksum}}',
            'class_name': 'infohub_demo_status',
            'note': 'Render a status for infohub_demo',
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
    const _GetCmdFunctions = function () {
        const $list = {
            'create': 'normal',
            'click_button': 'normal'
        };

        return _GetCmdFunctionsBase($list);
    };

    let $classTranslations = {};

    // ***********************************************************
    // * your class functions below, only declare with var
    // * Can only be reached through cmd()
    // ***********************************************************

    /**
     * Create a status indicator
     * @version 2021-07-25
     * @since   2021-07-25
     * @author  Peter Lembke
     */
    $functions.push('create');
    const create = function ($in = {}) {
        const $default = {
            'subtype': 'status',
            'parent_box_id': '',
            'translations': {},
            'step': 'step_start',
            'response': {
                'answer': 'false',
                'message': 'Nothing to report from infohub_demo_status',
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
                        'title': {
                            'type': 'common',
                            'subtype': 'value',
                            'data': _Translate('DEMO_STATUS')
                        },
                        'my_status': {
                            'plugin': 'infohub_renderstatus',
                            'type': 'status',
                            'head_label': '', //'[title]',
                            'show': 'file_loaded',
                            'options': {
                                'file_loaded': {
                                    'icon': '[yes_icon]',
                                    'label': _Translate('FILE_LOADED'),
                                    'description': _Translate('FILE_LOADED_DESCRIPTION'),
                                },
                                'file_not_loaded': {
                                    'icon': '[no_icon]',
                                    'label': _Translate('FILE_NOT_LOADED'),
                                    'description': _Translate('FILE_NOT_LOADED_DESCRIPTION'),
                                },
                                'unknown': {
                                    'icon': '[unknown_icon]',
                                    'label': _Translate('UNKNOWN'),
                                    'description': _Translate('UNKNOWN_DESCRIPTION'),
                                },
                            },
                        },
                        'button_yes': {
                            'plugin': 'infohub_renderform',
                            'type': 'button',
                            'mode': 'button',
                            'button_label': _Translate('SET_STATUS_FILE_LOADED'),
                            'event_data': 'status|button|file_loaded',
                            'to_plugin': 'infohub_demo',
                            'to_function': 'click',
                        },
                        'button_no': {
                            'plugin': 'infohub_renderform',
                            'type': 'button',
                            'mode': 'button',
                            'button_label': _Translate('SET_STATUS_FILE_NOT_LOADED'),
                            'event_data': 'status|button|file_not_loaded',
                            'to_plugin': 'infohub_demo',
                            'to_function': 'click',
                        },
                        'button_unknown': {
                            'plugin': 'infohub_renderform',
                            'type': 'button',
                            'mode': 'button',
                            'button_label': _Translate('SET_STATUS_UNKNOWN'),
                            'event_data': 'status|button|unknown',
                            'to_plugin': 'infohub_demo',
                            'to_function': 'click',
                        },
                        'yes_icon': {
                            'type': 'common',
                            'subtype': 'svg',
                            'data': '[yes_asset]',
                        },
                        'yes_asset': {
                            'plugin': 'infohub_asset',
                            'type': 'icon',
                            'asset_name': 'status/yes',
                            'plugin_name': 'infohub_demo',
                        },
                        'no_icon': {
                            'type': 'common',
                            'subtype': 'svg',
                            'data': '[no_asset]',
                        },
                        'no_asset': {
                            'plugin': 'infohub_asset',
                            'type': 'icon',
                            'asset_name': 'status/no',
                            'plugin_name': 'infohub_demo',
                        },
                        'unknown_icon': {
                            'type': 'common',
                            'subtype': 'svg',
                            'data': '[unknown_asset]',
                        },
                        'unknown_asset': {
                            'plugin': 'infohub_asset',
                            'type': 'icon',
                            'asset_name': 'status/unknown',
                            'plugin_name': 'infohub_demo',
                        },
                    },
                    'how': {
                        'mode': 'one box',
                        'text': '[my_status][button_yes][button_no][button_unknown]',
                    },
                    'where': {
                        'box_id': $in.parent_box_id + '.demo',
                        'max_width': 320,
                        'scroll_to_box_id': 'true',
                    },
                    'cache_key': 'status',
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
     * All button clicks come here
     * @version 2021-08-05
     * @since   2021-08-05
     * @author  Peter Lembke
     */
    $functions.push('click_button');
    const click_button = function ($in = {}) {
        const $default = {
            'type': '',
            'event_type': '',
            'event_data': '',
            'box_id': '',
            'step': 'step_start'
        };
        $in = _Default($default, $in);

        if ($in.step === 'step_start') {

            const $boxId = $in.box_id + '.[my_status_options_' + $in.event_data + ']';


            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_renderstatus',
                    'function': 'event_message'
                },
                'data': {
                    'box_id': $boxId,
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

//# sourceURL=infohub_demo_status.js