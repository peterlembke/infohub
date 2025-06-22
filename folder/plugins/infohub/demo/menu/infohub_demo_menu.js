/**
 * infohub_demo_menu
 * Render a menu for infohub_demo
 *
 * @package     Infohub
 * @subpackage  infohub_demo_menu
 * @since       2018-04-15
 * @author      Peter Lembke <info@infohub.se>
 * @license     GPL-3.0-or-later
 * @copyright   Copyright (C) 2010- Peter Lembke
 * @see         https://github.com/peterlembke/infohub/blob/main/folder/plugins/infohub/demo/menu/infohub_demo_menu.md Documentation
 * @link        https://infohub.se/ InfoHub main page
 */
function infohub_demo_menu() {

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
            'date': '2019-03-28',
            'since': '2018-04-15',
            'version': '2.0.0',
            'checksum': '{{checksum}}',
            'class_name': 'infohub_demo_menu',
            'note': 'Render a menu for infohub_demo',
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
        };

        return _GetCmdFunctionsBase($list);
    };

    let $classTranslations = {};

    // ***********************************************************
    // * your class functions below, only declare with var
    // * Can only be reached through cmd()
    // ***********************************************************

    /**
     * Create a menu
     * @version 2019-03-27
     * @since   2016-10-16
     * @author  Peter Lembke
     */
    $functions.push('create');
    const create = function($in = {}) {
        const $default = {
            'subtype': 'menu',
            'parent_box_id': '',
            'translations': {},
            'step': 'step_start',
            'response': {
                'answer': 'false',
                'message': 'Nothing to report',
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
                        'titel': {
                            'type': 'common',
                            'subtype': 'value',
                            'data': _Translate('DEMO_COLLECTION')
                        },
                        'my_menu': {
                            'plugin': 'infohub_rendermenu',
                            'type': 'menu',
                            'head_label': '[titel]',
                            'options': {
                                'text_demo': {
                                    'alias': 'text_demo_link',
                                    'event_data': 'text',
                                    'button_label': _Translate('TEXT_DEMO'),
                                    'to_plugin': 'infohub_demo',
                                    'to_function': 'click_menu',
                                },
                                'common_demo': {
                                    'alias': 'common_demo_link',
                                    'event_data': 'common',
                                    'button_label': _Translate('COMMON_OBJECTS_DEMO'),
                                    'to_plugin': 'infohub_demo',
                                    'to_function': 'click_menu',
                                },
                                'svg_demo': {
                                    'alias': 'svg_demo_link',
                                    'event_data': 'svg',
                                    'button_label': _Translate('SVG_RENDERING_DEMO'),
                                    'to_plugin': 'infohub_demo',
                                    'to_function': 'click_menu',
                                },
                                'frog_demo': {
                                    'alias': 'frog_demo_link',
                                    'event_data': 'frog',
                                    'button_label': _Translate('YOU_GET_A_FROG'),
                                    'to_plugin': 'infohub_demo',
                                    'to_function': 'click_menu',
                                },
                                'video_demo': {
                                    'alias': 'video_demo_link',
                                    'event_data': 'video',
                                    'button_label': _Translate('VIDEO_STREAM_SERVICES'),
                                    'to_plugin': 'infohub_demo',
                                    'to_function': 'click_menu',
                                },
                                'audio_demo': {
                                    'alias': 'audio_demo_link',
                                    'event_data': 'audio',
                                    'button_label': _Translate('AUDIO_STREAM_SERVICES'),
                                    'to_plugin': 'infohub_demo',
                                    'to_function': 'click_menu',
                                },
                                'map_demo': {
                                    'alias': 'map_demo_link',
                                    'event_data': 'map',
                                    'button_label': _Translate('MAP_SERVICES'),
                                    'to_plugin': 'infohub_demo',
                                    'to_function': 'click_menu',
                                },
                                'link_demo': {
                                    'alias': 'link_demo_link',
                                    'event_data': 'link',
                                    'button_label': _Translate('LINK_-_DIFFERENT_KINDS'),
                                    'to_plugin': 'infohub_demo',
                                    'to_function': 'click_menu',
                                },
                                'major_demo': {
                                    'alias': 'major_demo_link',
                                    'event_data': 'major',
                                    'button_label': _Translate('PRESENTATION_BOX'),
                                    'to_plugin': 'infohub_demo',
                                    'to_function': 'click_menu',
                                },
                                'progress_demo': {
                                    'alias': 'progress_demo_link',
                                    'event_data': 'progress',
                                    'button_label': _Translate('PROGRESS_BAR'),
                                    'to_plugin': 'infohub_demo',
                                    'to_function': 'click_menu',
                                },
                                'advancedlist_demo': {
                                    'alias': 'advancedlist_demo_link',
                                    'event_data': 'advancedlist',
                                    'button_label': _Translate('ADVANCED_LIST'),
                                    'to_plugin': 'infohub_demo',
                                    'to_function': 'click_menu',
                                },
                                'tabs_demo': {
                                    'alias': 'tabs_demo_link',
                                    'event_data': 'tabs',
                                    'button_label': _Translate('TABS_LIST'),
                                    'to_plugin': 'infohub_demo',
                                    'to_function': 'click_menu',
                                },
                                'form_demo': {
                                    'alias': 'form_demo_link',
                                    'event_data': 'form',
                                    'button_label': _Translate('FORM_-_SIMPLE'),
                                    'to_plugin': 'infohub_demo',
                                    'to_function': 'click_menu',
                                },
                                'form2_demo': {
                                    'alias': 'form2_demo_link',
                                    'event_data': 'form2',
                                    'button_label': _Translate('FORM_-_ADVANCED'),
                                    'to_plugin': 'infohub_demo',
                                    'to_function': 'click_menu',
                                },
                                'table_demo': {
                                    'alias': 'table_demo_link',
                                    'event_data': 'table',
                                    'button_label': _Translate('TABLE'),
                                    'to_plugin': 'infohub_demo',
                                    'to_function': 'click_menu',
                                },
                                'document_demo': {
                                    'alias': 'document_demo_link',
                                    'event_data': 'document',
                                    'button_label': _Translate('DOCUMENT_TEXT'),
                                    'to_plugin': 'infohub_demo',
                                    'to_function': 'click_menu',
                                },
                                'timer_demo': {
                                    'alias': 'timer_demo_link',
                                    'event_data': 'timer',
                                    'button_label': _Translate('TIMER'),
                                    'to_plugin': 'infohub_demo',
                                    'to_function': 'click_menu',
                                },
                                'storage_demo': {
                                    'alias': 'storage_demo_link',
                                    'event_data': 'storage',
                                    'button_label': _Translate('STORAGE'),
                                    'to_plugin': 'infohub_demo',
                                    'to_function': 'click_menu',
                                },
                                'status_demo': {
                                    'alias': 'status_demo_link',
                                    'event_data': 'status',
                                    'button_label': _Translate('STATUS'),
                                    'to_plugin': 'infohub_demo',
                                    'to_function': 'click_menu',
                                },
                                'batch_demo': {
                                    'alias': 'batch_demo_link',
                                    'event_data': 'batch',
                                    'button_label': _Translate('BATCH'),
                                    'to_plugin': 'infohub_demo',
                                    'to_function': 'click_menu',
                                },
                            },
                        },
                    },
                    'how': {
                        'mode': 'one box',
                        'text': '[my_menu]',
                    },
                    'where': {
                        'box_id': $in.parent_box_id + '.menu',
                        'max_width': 320,
                        'scroll_to_box_id': 'true',
                    },
                    'cache_key': 'menu',
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
}

//# sourceURL=infohub_demo_menu.js