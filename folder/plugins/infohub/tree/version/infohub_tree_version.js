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
function infohub_tree_version() {

    'use strict';

// include "infohub_base.js"

    const _Version = function() {
        return {
            'date': '2020-07-25',
            'since': '2020-07-25',
            'version': '1.0.0',
            'checksum': '{{checksum}}',
            'class_name': 'infohub_tree_version',
            'note': 'Show version information for all child plugins and parent plugin',
            'status': 'normal',
            'SPDX-License-Identifier': 'GPL-3.0-or-later',
        };
    };

    const _GetCmdFunctions = function() {
        const $list = {
            'create': 'normal',
            'click_refresh': 'normal',
        };

        return _GetCmdFunctionsBase($list);
    };

    const $classVariablePluginNamesObject = {
        'infohub_tree': 'Tree',
        'infohub_tree_doc': 'Doc',
        'infohub_tree_version': 'Version',
        'infohub_tree_encrypt': 'Encrypt',
        'infohub_tree_backup': 'Backup',
        'infohub_tree_restore': 'Restore',
        'infohub_tree_storage': 'Storage',
        'infohub_tree_sync': 'Sync',
    };

    /**
     * Internal functions must start with a capital letter
     * Used by renderers to get a proper function name
     * @version 2016-10-16
     * @since   2016-10-16
     * @author  Peter Lembke
     * @param $text
     * @return string
     */
    const _GetFuncName = function($text = '') {
        let $response = '';
        const $parts = $text.split('_');

        for (let $key in $parts) {
            if ($parts.hasOwnProperty($key) === false) {
                continue;
            }
            $response = $response + $parts[$key].charAt(0).toUpperCase() +
                $parts[$key].substring(1);
        }
        return $response;
    };

    let $classTranslations = {};

    // ***********************************************************
    // * your class functions below, only declare with var
    // * Can only be reached through cmd()
    // ***********************************************************

    $functions.push('create');
    /**
     * Get instructions and create the message to InfoHub View
     * @version 2019-03-13
     * @since   2016-10-16
     * @author  Peter Lembke
     */
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

            let $out = _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_render',
                    'function': 'create',
                },
                'data': {
                    'what': {
                        'container_version': {
                            'type': 'common',
                            'subtype': 'container',
                            'tag': 'div',
                            'data': '[button_refresh]',
                            'class': 'container-small',
                        },
                        'button_refresh': {
                            'plugin': 'infohub_renderform',
                            'type': 'button',
                            'mode': 'button',
                            'button_label': _Translate('REFRESH_VERSION_DATA'),
                            'button_left_icon': '[refresh_icon]',
                            'event_data': 'version|refresh',
                            'to_plugin': 'infohub_tree',
                            'to_function': 'click',
                        },
                        'refresh_icon': {
                            'type': 'common',
                            'subtype': 'svg',
                            'data': '[refresh_asset]',
                        },
                        'refresh_asset': {
                            'plugin': 'infohub_asset',
                            'type': 'icon',
                            'asset_name': 'refresh',
                            'plugin_name': 'infohub_tree',
                        },
                    },
                    'how': {
                        'mode': 'one box',
                        'text': '[container_version]',
                    },
                    'where': {
                        'box_id': 'main.body.infohub_tree.form', // 'box_id': $in.parent_box_id + '.form',
                        'max_width': 100,
                        'scroll_to_box_id': 'true',
                    },
                    'cache_key': 'version',
                },
                'data_back': {
                    'step': 'step_end',
                },
            });

            let $items = '[button_refresh]';

            for (const $pluginName in $classVariablePluginNamesObject) {
                if ($classVariablePluginNamesObject.hasOwnProperty(
                    $pluginName) === false) {
                    continue;
                }

                const $label = $classVariablePluginNamesObject[$pluginName];

                $out.data.what[$pluginName] = {
                    'plugin': 'infohub_renderform',
                    'type': 'text',
                    'label': _Translate($label + ' version'),
                    'enabled': 'false',
                    'maxlength': '30',
                    'placeholder': '-',
                    'show_characters_left': 'false',
                };

                $items = $items + '[' + $pluginName + ']';
            }

            $out.data.what.container_version.data = $items;

            return $out;
        }

        return {
            'answer': $in.response.answer,
            'message': $in.response.message,
        };
    };

    $functions.push('click_refresh');
    /**
     * Refresh the list with versions
     * @version 2020-07-26
     * @since 2020-07-25
     * @author Peter Lembke
     * @param $in
     * @returns {{answer: string, message, ok}|{}|{}|{}|*|{answer: string, messages: *[], message: string, ok: string}}
     */
    const click_refresh = function($in = {}) {
        const $default = {
            'step': 'step_get_version',
            'response': {},
            'data_back': {
                'box_id': '',
                'plugin_name': '',
            },
        };
        $in = _Default($default, $in);

        let $messageArray = [];

        if ($in.step === 'step_get_version') {
            for (const $pluginName in $classVariablePluginNamesObject) {
                if ($classVariablePluginNamesObject.hasOwnProperty(
                    $pluginName) === false) {
                    continue;
                }

                let $messageOut = _SubCall({
                    'to': {
                        'node': 'client',
                        'plugin': $pluginName,
                        'function': 'version',
                    },
                    'data': {},
                    'data_back': {
                        'plugin_name': $pluginName,
                        'box_id': 'main.body.infohub_tree.form.[' + $pluginName + '_form_element]',
                        'step': 'step_get_version_response',
                    },
                });
                $messageArray.push($messageOut);
            }

            return {
                'answer': 'true',
                'message': 'getting versions from all plugins',
                'ok': 'true',
                'messages': $messageArray,
            };
        }

        if ($in.step === 'step_get_version_response') {
            const $default = {
                'answer': 'false',
                'message': 'Got no answer',
                'plugin': {},
                'base': {},
                'client_info': {},
                'version_code': 'no combined checksum',
            };
            $in.response = _Default($default, $in.response);

            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_view',
                    'function': 'set_text',
                },
                'data': {
                    'id': $in.data_back.box_id,
                    'text': $in.response.plugin.version + ' - ' +
                        $in.response.plugin.date,
                },
                'data_back': {
                    'step': 'step_end',
                },
            });
        }

        if ($in.step === 'step_end') {
            const $default = {
                'answer': 'false',
                'message': 'Got no answer',
            };
            $in.response = _Default($default, $in.response);
        }

        return {
            'answer': 'true',
            'message': $in.response.message,
            'ok': $in.response.ok,
        };
    };
}

//# sourceURL=infohub_tree_version.js