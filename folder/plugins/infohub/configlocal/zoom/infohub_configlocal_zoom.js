/**
 * Here you can set the zoom level
 *
 * @author      Peter Lembke <info@infohub.se>
 * @version     2019-10-18
 * @since       2018-05-25
 * @copyright   Copyright (c) 2018, Peter Lembke
 * @license     https://opensource.org/licenses/gpl-license.php GPL-3.0-or-later
 * @see         https://github.com/peterlembke/infohub/blob/master/folder/plugins/infohub/configlocal/zoom/infohub_configlocal_zoom.md Documentation
 * @link        https://infohub.se/ InfoHub main page
 */
function infohub_configlocal_zoom() {

    'use strict';

// include "infohub_base.js"

    $functions.push('_Version');
    const _Version = function() {
        return {
            'date': '2019-10-18',
            'since': '2018-05-25',
            'version': '2.0.0',
            'checksum': '{{checksum}}',
            'class_name': 'infohub_configlocal_zoom',
            'note': 'Here you can set the zoom level',
            'status': 'normal',
            'SPDX-License-Identifier': 'GPL-3.0-or-later',
        };
    };

    $functions.push('_GetCmdFunctions');
    const _GetCmdFunctions = function() {
        const $list = {
            'create': 'normal',
            'click_change': 'normal',
            'apply_config': 'normal',
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
            'step': 'step_render_form',
            'response': {
                'answer': '',
                'message': '',
                'data': {},
            },
        };
        $in = _Default($default, $in);

        if ($in.step === 'step_render_form') {
            $classTranslations = _ByVal($in.translations);

            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_render',
                    'function': 'create',
                },
                'data': {
                    'what': {
                        'zoom_form': {
                            'plugin': 'infohub_renderform',
                            'type': 'form',
                            'content': '[zoom_level_plus][zoom_level_minus][zoom_level_normal]',
                            'label': _Translate('ZOOM_SETTINGS'),
                            'description': '[zoom_icon]' + _Translate('USE_THIS_ZOOM_IF_YOU_HAVE_NO_KEYBOARD') + '. CTRL+  CTRL-'
                        },
                        'zoom_level_plus': {
                            'plugin': 'infohub_renderform',
                            'type': 'button',
                            'mode': 'button',
                            'button_label': _Translate('+'),
                            'event_data': 'zoom|change|plus',
                            'to_plugin': 'infohub_configlocal',
                            'to_function': 'click',
                        },
                        'zoom_level_minus': {
                            'plugin': 'infohub_renderform',
                            'type': 'button',
                            'mode': 'button',
                            'button_label': _Translate('-'),
                            'event_data': 'zoom|change|minus',
                            'to_plugin': 'infohub_configlocal',
                            'to_function': 'click',
                        },
                        'zoom_level_normal': {
                            'plugin': 'infohub_renderform',
                            'type': 'button',
                            'mode': 'button',
                            'button_label': _Translate('NORMAL_100%'),
                            'event_data': 'zoom|change|normal',
                            'to_plugin': 'infohub_configlocal',
                            'to_function': 'click',
                        },
                        'zoom_icon': {
                            'type': 'common',
                            'subtype': 'svg',
                            'data': '[zoom_asset]',
                            'css_data': {
                                '.svg': 'width:64px; height:64px; padding:1px; max-width:64px;',
                            },
                        },
                        'zoom_asset': {
                            'plugin': 'infohub_asset',
                            'type': 'icon',
                            'asset_name': 'zoom/magnifyingglass',
                            'plugin_name': 'infohub_configlocal',
                        },
                    },
                    'how': {
                        'mode': 'one box',
                        'text': '[zoom_form]',
                    },
                    'where': {
                        'box_id': $in.parent_box_id + '.form',
                        'max_width': 640,
                        'scroll_to_box_id': 'true',
                    },
                    'cache_key': 'zoom',
                },
                'data_back': {'step': 'step_end'},
            });
        }

        return {
            'answer': $in.response.answer,
            'message': $in.response.message,
            'data': {},
        };
    };

    /**
     * Clicked the zoom level change
     * Now I will set the zoom level.
     * @version 2019-10-18
     * @since 2019-03-11
     * @author Peter Lembke
     */
    $functions.push('click_change');
    const click_change = function($in = {}) {
        const $default = {
            'step': 'step_set_zoom_level',
            'section': '',
            'event_data': '',
            'form_data': {},
            'response': {
                'answer': 'false',
                'message': 'Nothing to report',
                'new_zoom_level': 0,
            },
        };
        $in = _Default($default, $in);

        let $ok = 'false';

        if ($in.step === 'step_set_zoom_level') {
            let $multiplier = 1.0;
            if ($in.event_data === 'zoom|change|plus') {
                $multiplier = 1.1;
            }
            if ($in.event_data === 'zoom|change|minus') {
                $multiplier = 0.9;
            }

            let $zoomLevel = 0;
            if ($in.event_data === 'zoom|change|normal') {
                $multiplier = 0.0;
                $zoomLevel = 100;
            }

            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_view',
                    'function': 'zoom_level',
                },
                'data': {
                    'multiplier': $multiplier,
                    'zoom_level': $zoomLevel,
                },
                'data_back': {
                    'step': 'step_set_zoom_level_response',
                },
            });
        }

        if ($in.step === 'step_set_zoom_level_response') {
            $in.step = 'step_end';
            if ($in.response.answer === 'true') {
                if ($in.response.new_zoom_level >= 50 &&
                    $in.response.new_zoom_level <= 300) {
                    $in.step = 'step_save_config';
                }
            }
        }

        if ($in.step === 'step_save_config') {
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_configlocal',
                    'function': 'submit',
                },
                'data': {
                    'event_data': 'zoom',
                    'form_data': {
                        'zoom_level': {
                            'value': $in.response.new_zoom_level,
                        },
                    },
                },
                'data_back': {
                    'step': 'step_save_config_response',
                },
            });
        }

        if ($in.step === 'step_save_config_response') {
            if ($in.response.answer === 'true') {
                $in.response.message = 'New zoom config saved';
                $ok = 'true';
            }
        }

        return {
            'answer': $in.response.answer,
            'message': $in.response.message,
            'ok': $ok,
        };

    };

    /**
     * Apply the zoom config
     * @version 2019-10-19
     * @since 2019-10-19
     * @author Peter Lembke
     */
    $functions.push('apply_config');
    const apply_config = function($in = {}) {
        const $default = {
            'local_config': {
                'zoom_level': {
                    'value': 0,
                },
            },
            'step': 'step_apply_config',
            'response': {
                'answer': 'false',
                'message': 'Nothing to report',
            },
        };
        $in = _Default($default, $in);

        if ($in.step === 'step_apply_config') {
            if ($in.local_config.zoom_level.value > 0) {
                return _SubCall({
                    'to': {
                        'node': 'client',
                        'plugin': 'infohub_view',
                        'function': 'zoom_level',
                    },
                    'data': {
                        'zoom_level': $in.local_config.zoom_level.value,
                    },
                    'data_back': {
                        'step': 'step_end',
                    },
                });
            }
        }

        return {
            'answer': $in.response.answer,
            'message': $in.response.message,
        };

    };
}

//# sourceURL=infohub_configlocal_zoom.js