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
function infohub_configlocal_menu() {

    "use strict";

// include "infohub_base.js"

    const _Version = function() {
        return {
            'date': '2019-03-12',
            'since': '2018-09-09',
            'version': '1.0.0',
            'checksum': '{{checksum}}',
            'class_name': 'infohub_configlocal_menu',
            'note': 'Render a menu for infohub_configlocal',
            'status': 'normal',
            'SPDX-License-Identifier': 'GPL-3.0-or-later'
        };
    };

    const _GetCmdFunctions = function() {
        const $list = {
            'create': 'normal'
        };

        return _GetCmdFunctionsBase($list);
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
            'default': $string,
            'data': $classTranslations,
            'split': '|'
        });
    };

    // ***********************************************************
    // * your class functions below, only declare with var
    // * Can only be reached trough cmd()
    // ***********************************************************

    /**
     * Get instructions and create the message to InfoHub View
     * @version 2016-10-16
     * @since   2016-10-16
     * @author  Peter Lembke
     */
    $functions.push('create');
    const create = function ($in)
    {
        const $default = {
            'step': 'step_render',
            'subtype': 'menu',
            'parent_box_id': '',
            'translations': {},
            'response': {
                'answer': 'false',
                'message': 'Nothing to report'
            }
        };
        $in = _Default($default, $in);

        if($in.step === 'step_render')
        {
            $classTranslations = _ByVal($in.translations);

            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_render',
                    'function': 'create'
                },
                'data': {
                    'what': {
                        'titel': {
                            'type': 'common',
                            'subtype': 'value',
                            'data': _Translate('Configuration - Local on this device')
                        },
                        'my_menu': {
                            'plugin': 'infohub_rendermenu',
                            'type': 'menu',
                            'head_label': '[titel]',
                            'options': {
                                'zoom': {
                                    'alias': 'zoom_link',
                                    'event_data': 'zoom',
                                    'button_label': _Translate('Zoom level'),
                                    'button_left_icon': '[zoom_icon]',
                                    'to_plugin': 'infohub_configlocal',
                                    'to_function': 'click_menu'
                                },
                                'language': {
                                    'alias': 'language_link',
                                    'event_data': 'language',
                                    'button_label': _Translate('Language preferred'),
                                    'button_left_icon': '[language_icon]',
                                    'to_plugin': 'infohub_configlocal',
                                    'to_function': 'click_menu'
                                },
                                'image': {
                                    'alias': 'image_link',
                                    'event_data': 'image',
                                    'button_label': _Translate('Images you see'),
                                    'button_left_icon': '[image_icon]',
                                    'to_plugin': 'infohub_configlocal',
                                    'to_function': 'click_menu'
                                },
                                'colour': {
                                    'alias': 'colour_link',
                                    'event_data': 'colour',
                                    'button_label': _Translate('Colour schema'),
                                    'to_plugin': 'infohub_configlocal',
                                    'to_function': 'click_menu',
                                    'custom_variables': {
                                        'call_render_done': 'true'
                                    }
                                }
                                /*
                                'font': {
                                    'alias': 'font_link',
                                    'event_data': 'font',
                                    'button_label': _Translate('Font settings'),
                                    'to_plugin': 'infohub_configlocal',
                                    'to_function': 'click_menu'
                                },
                                'allow': {
                                    'alias': 'allow_link',
                                    'event_data': 'allow',
                                    'button_label': _Translate('Allow things'),
                                    'to_plugin': 'infohub_configlocal'
                                },
                                'debug': {
                                    'alias': 'debug_link',
                                    'event_data': 'debug',
                                    'button_label': _Translate('For developers'),
                                    'to_plugin': 'infohub_configlocal'
                                }
                                 */
                            }
                        },
                        'zoom_icon': {
                            'type': 'common',
                            'subtype': 'svg',
                            'data': '[zoom_asset]'
                        },
                        'zoom_asset': {
                            'plugin': 'infohub_asset',
                            'type': 'icon',
                            'asset_name': 'zoom/magnifyingglass',
                            'plugin_name': 'infohub_configlocal'
                        },
                        'language_icon': {
                            'type': 'common',
                            'subtype': 'svg',
                            'data': '[language_asset]'
                        },
                        'language_asset': {
                            'plugin': 'infohub_asset',
                            'type': 'icon',
                            'asset_name': 'language/language',
                            'plugin_name': 'infohub_configlocal'
                        },
                        'image_icon': {
                            'type': 'common',
                            'subtype': 'svg',
                            'data': '[image_asset]'
                        },
                        'image_asset': {
                            'plugin': 'infohub_asset',
                            'type': 'icon',
                            'asset_name': 'classic-config-icon',
                            'plugin_name': 'infohub_configlocal'
                        }
                    },
                    'how': {
                        'mode': 'one box',
                        'text': '[my_menu]'
                    },
                    'where': {
                        'box_id': $in.parent_box_id + '.menu',
                        'max_width': 320,
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

}
//# sourceURL=infohub_configlocal_menu.js