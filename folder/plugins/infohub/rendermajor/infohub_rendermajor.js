/**
 * infohub_rendermajor.js contact the renderers to get HTML and then send it to infohub_view
 * infohub_rendermajor and infohub_view are the only plugions that handle the DOM
 * @category InfoHub
 * @package infohub_rendermajor
 * @copyright Copyright (c) 2010-, Peter Lembke, CharZam soft
 * @author Peter Lembke <peter.lembke@infohub.se>
 * @link https://infohub.se/ InfoHub main page
 * @license InfoHub is distributed under the terms of the GNU General Public License
 * InfoHub is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * InfoHub is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 * You should have received a copy of the GNU General Public License
 * along with InfoHub.    If not, see <https://www.gnu.org/licenses/>.
 */
function infohub_rendermajor() {

    'use strict';

    // include "infohub_base.js"

    const _Version = function() {
        return {
            'date': '2017-02-18',
            'since': '2016-10-26',
            'version': '1.0.0',
            'checksum': '{{checksum}}',
            'class_name': 'infohub_rendermajor',
            'note': 'Renders a display box for content by assembling smaller standard parts',
            'status': 'normal',
            'SPDX-License-Identifier': 'GPL-3.0-or-later',
            'user_role': 'user',
            'web_worker': 'true',
            'core_plugin': 'false',
        };
    };

    const _GetCmdFunctions = function() {
        const $list = {
            'create': 'normal',
        };

        return _GetCmdFunctionsBase($list);
    };

    // ***********************************************************
    // * The private functions, add your own in your plugin
    // * These functions can be used directly in your functions.
    // * Name: _CamelCaseData
    // ***********************************************************

    /**
     * Internal functions must start with a capital letter
     * Used by renderers to get a proper function name
     * @version 2016-10-16
     * @since   2016-10-16
     * @author  Peter Lembke
     * @param $text
     * @return string
     */
    const _GetFuncName = function($text) {
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

    // *****************************************************************************
    // * Functions you only can reach with CMD()
    // * Observe function names are lower_case
    // *****************************************************************************

    $functions.push('create');
    /**
     * Get instructions and create the html
     * @version 2020-12-19
     * @since   2013-04-15
     * @author  Peter Lembke
     * @param $in
     * @returns {{item_index: {}, answer: string, message: string}}
     */
    const create = function($in = {}) {
        const $default = {
            'item_index': {},
            'config': {},
            'data_back': {
                'item_name': '',
                'item_index_done': {},
            },
            'response': {},
            'step': 'step_create',
        };
        $in = _Default($default, $in);

        if ($in.step === 'step_create_response') {
            const $defaultResponse = {
                'answer': 'false',
                'message': '',
                'html': '',
                'css_data': {},
                'display': '',
            };
            $in.response = _Default($defaultResponse, $in.response);
            const $itemName = $in.data_back.item_name;
            $in.data_back.item_index_done[$itemName] = $in.response;
            $in.step = 'step_create';
        }

        if ($in.step === 'step_create') {
            if (_Count($in.item_index) > 0) {
                const $itemData = _Pop($in.item_index);
                const $itemName = $itemData.key;
                let $data = $itemData.data;
                $in.item_index = $itemData.object;

                const $defaultItem = {
                    'type': '',
                    'alias': '',
                    'original_alias': '',
                    // 'class': '', // Let the child handle the class
                    'css_data': {},
                };
                $data = _Merge($defaultItem, $data);

                $data.func = _GetFuncName($data.type);
                $data.config = $in.config;

                const $response = internal_Cmd($data);

                return _SubCall({
                    'to': {
                        'node': 'client',
                        'plugin': 'infohub_render',
                        'function': 'create',
                    },
                    'data': {
                        'what': $response.what,
                        'how': $response.how,
                        'where': $response.where,
                        'alias': $data.alias,
                        'css_data': $response.css_data,
                    },
                    'data_back': {
                        'item_index': $in.item_index,
                        'item_name': $itemName,
                        'item_index_done': $in.data_back.item_index_done,
                        'step': 'step_create_response',
                    },
                });
            }
            $in.step = 'step_end';
        }

        return {
            'answer': 'true',
            'message': 'Here is what I rendered',
            'item_index': $in.data_back.item_index_done,
        };
    };

    /**
     * The actual presentation box parts
     * @version 2016-10-26
     * @since   2016-10-26
     * @author  Peter Lembke
     */
    const internal_PresentationBox = function($in = {}) {
        const $default = {
            'head_label': '',
            'head_label_icon': '',
            'head_text': '',
            'foot_text': '',
            'content_data': '',
            'content_embed': '',
            'content_embed_new_tab': '',
            'open': 'true',
            'original_alias': '',
            'css_data': {},
        };
        $in = _Default($default, $in);

        // Divide the creation in smaller parts
        let $parts = {};

        if ($in.head_label !== '') {
            $parts.head_label = {
                'type': 'link',
                'subtype': 'toggle',
                'show': '[head_label_data]',
                'toggle_alias': 'content',
                'original_alias': $in.original_alias,
            };
            $parts.head_label_data = {
                'type': 'common',
                'subtype': 'container',
                'tag': 'div',
                'data': $in.head_label,
                'original_alias': $in.original_alias,
                'css_data': {
                    '.container': 'display:inline-flex;',
                },
            };
        }

        if ($in.head_label_icon !== '') {
            $parts.head_label_icon = {
                'type': 'common',
                'subtype': 'container',
                'tag': 'div',
                'data': $in.head_label_icon,
                'css_data': {
                    '.container': 'width:16px; height:16px; display:inline-flex; float:left; padding: 0px 4px 0px 0px;',
                },
            };
        }

        if (_Empty($in.content_embed_new_tab) === 'false') {
            $in.foot_text = $in.content_embed_new_tab + $in.foot_text;
        }

        if ($in.head_text !== '') {
            $parts.head = {
                'type': 'common',
                'subtype': 'container',
                'data': $in.head_text,
                'class': 'head',
                'original_alias': $in.original_alias,
            };
        }

        if ($in.foot_text !== '') {
            $parts.foot = {
                'type': 'common',
                'subtype': 'container',
                'data': $in.foot_text,
                'class': 'foot',
                'original_alias': $in.original_alias,
            };
        }

        if (_Empty($in.content_data) === 'false') {
            $parts.content = {
                'type': 'common',
                'subtype': 'container',
                'data': '[content_data]',
                'display': $in.open,
                'class': 'content',
                'original_alias': $in.original_alias,
            };

            if (_Empty($in.content_embed) === 'true') {
                $parts.content_data = {
                    'type': 'common',
                    'subtype': 'value',
                    'data': $in.content_data,
                    'original_alias': $in.original_alias,
                };
            } else {
                $parts.content_data = {
                    'type': 'common',
                    'subtype': 'value',
                    'data': '[content_data_link]',
                    'original_alias': $in.original_alias,
                };

                $parts.content_data_link = {
                    'type': 'link',
                    'subtype': 'embed',
                    'show': $in.content_data,
                    'embed': $in.content_embed,
                    'original_alias': $in.original_alias,
                };
            }
        }

        if (_Count($parts) > 0) {

            let $legendData = '';
            if (_IsSet($parts.head) === 'true') {
                $legendData = $legendData + '[head]';
            }
            if (_IsSet($parts.content) === 'true') {
                $legendData = $legendData + '[content]';
            }
            if (_IsSet($parts.foot) === 'true') {
                $legendData = $legendData + '[foot]';
            }

            let $label = '';
            if ($in.head_label !== '') {
                $label = '[head_label]';
            }
            if ($in.head_label_icon !== '') {
                $parts.head_label.show = '[head_label_icon]' + $parts.head_label.show;
            }

            const $defaultLegendCss = {'fieldset': '', 'fieldset .legend': ''};
            const $legendCss = _Default($defaultLegendCss, $in.css_data);

            $parts.legend = {
                'type': 'common',
                'subtype': 'legend',
                'label': $label,
                'data': $legendData,
                'original_alias': $in.original_alias,
                'css_data': $legendCss
            };
        }

        if (_IsSet($in.css_data['fieldset .head']) === 'false') {
            $in.css_data['fieldset .head'] = 'display: block;';
        }

        if (_IsSet($in.css_data['fieldset .content']) === 'false') {
            $in.css_data['fieldset .content'] = '';
        }

        if (_IsSet($in.css_data['fieldset .foot']) === 'false') {
            $in.css_data['fieldset .foot'] = 'display: block;';
        }

        return {
            'answer': 'true',
            'message': 'Here are the parts to build the presentation box',
            'what': $parts,
            'how': {
                'mode': 'one box',
                'text': '[legend]',
            },
            'where': {
                'mode': 'html',
            },
            'css_data': $in.css_data,
        };
    };
}

//# sourceURL=infohub_rendermajor.js