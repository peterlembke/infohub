/**
 * Render a status indicator
 *
 * @author      Peter Lembke <info@infohub.se>
 * @version     2021-07-25
 * @since       2021-07-25
 * @copyright   Copyright (c) 2021, Peter Lembke
 * @license     https://opensource.org/licenses/gpl-license.php GPL-3.0-or-later
 * @see         https://github.com/peterlembke/infohub/blob/master/folder/plugins/infohub/renderstatus/infohub_renderstatus.md Documentation
 * @link        https://infohub.se/ InfoHub main page
 */
function infohub_renderstatus() {

    'use strict';

    // include "infohub_base.js"

    const _Version = function() {
        return {
            'date': '2021-07-25',
            'since': '2021-07-25',
            'version': '1.0.0',
            'checksum': '{{checksum}}',
            'class_name': 'infohub_renderstatus',
            'note': 'Render a status indicator. You can switch between the statuses',
            'status': 'normal',
            'SPDX-License-Identifier': 'GPL-3.0-or-later',
            'user_role': 'user',
            'web_worker': 'true',
            'core_plugin': 'false',
            'has_assets': 'true'
        };
    };

    const _GetCmdFunctions = function() {
        const $list = {
            'create': 'normal',
            'event_message': 'normal',
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
                $parts[$key].substr(1);
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
                    'html': '',
                    // 'class': '', // Let the child handle the class
                    'css_data': {},
                    'config': {},
                };
                $data = _Merge($defaultItem, $data);

                $data.func = _GetFuncName($data.type);
                $data.type = '';
                $data.config = $in.config;

                const $response = internal_Cmd($data);

                return _SubCall({
                    'to': {
                        'node': 'client',
                        'plugin': 'infohub_render',
                        'function': 'create',
                    },
                    'data': {
                        'what': $response.data,
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
     * Basic form
     * @version 2018-06-06
     * @since   2018-06-06
     * @author  Peter Lembke
     */
    const internal_Status = function($in = {}) {
        const $default = {
            'head_label': '',
            'head_text': '',
            'foot_text': '',
            'original_alias': '',
            'show': '', // What options to show
            'options': {},
            'config': {},
            'class': 'menu',
        };
        $in = _Default($default, $in);

        let $parts = {
            'presentation_box': {
                'plugin': 'infohub_rendermajor',
                'type': 'presentation_box',
                'head_label': $in.head_label,
                'foot_text': $in.foot_text,
                'content_data': '',
                'original_alias': $in.original_alias,
            },
        };

        const $defaultOption = {
            'icon': '',
            'label': '',
            'description': ''
        };

        let $optionArray = [];

        for (let $name in $in.options) {
            if ($in.options.hasOwnProperty($name) === false) {
                continue;
            }

            let $option = $in.options[$name];
            $option = _Default($defaultOption, $option);

            $option.display = 'false';
            if ($name === $in.show) {
                $option.display = 'true';
            }

            const $fullName = 'options_' + $name;

            let $whatToDisplay = '';

            if ($option.icon !== '') {
                const $partName = $fullName + '_icon';
                $parts[$partName] = {
                    'type': 'common',
                    'subtype': 'container',
                    'tag': 'div',
                    'data': $option.icon,
                    'original_alias': $in.original_alias,
                    'css_data': {
                        '.container': 'width:16px; height:16px; display:inline-block; float:left;',
                    },
                };
                $whatToDisplay = $whatToDisplay + '[' + $partName + ']';
            }

            if ($option.label !== '') {
                const $partName = $fullName + '_label';
                $parts[$partName] = {
                    'type': 'common',
                    'subtype': 'container',
                    'tag': 'div',
                    'data': $option.label,
                    'original_alias': $in.original_alias,
                    'css_data': {
                        '.container': 'display:inline-flex; padding-left: 4px; padding-right: 4px;',
                    },
                };
                $whatToDisplay = $whatToDisplay + '[' + $partName + ']';
            }

            if ($option.description !== '') {
                const $partName = $fullName + '_description';
                $parts[$partName] = {
                    'type': 'common',
                    'subtype': 'container',
                    'tag': 'div',
                    'data': $option.description,
                    'original_alias': $in.original_alias,
                    'css_data': {
                        '.container': 'display:none; padding-left: 4px; padding-right: 4px;',
                    },
                };

                const $partNameLink = $fullName + '_link';
                $parts[$partNameLink] = {
                    'type': 'link',
                    'subtype': 'toggle',
                    'show': $whatToDisplay,
                    'toggle_alias': $partName,
                    'original_alias': $in.original_alias,
                };
                $whatToDisplay = '[' + $partNameLink + '][' + $partName + ']';
            }

            $optionArray.push({
                'label': $whatToDisplay,
                'display': $option.display,
                'id': $fullName
            });
        }

        $parts.list = {
            'type': 'common',
            'subtype': 'list',
            'class': 'my_list',
            'option': $optionArray,
            'css_data': {
                '.my_list': 'list-style-type: none; list-style-position: inside; list-style-image: none; padding: 0px; margin: 0px;',
            }
        }

        $parts.presentation_box.content_data = '[list]';

        if (_Empty($in.head_text) === 'false') {
            $parts.presentation_box.content_data = $in.head_text + $parts.presentation_box.content_data;
        }

        return {
            'answer': 'true',
            'message': 'Here are the parts to build the status in a presentation box',
            'data': $parts,
            'how': {
                'mode': 'one box',
                'text': '[presentation_box]',
            },
            'where': {
                'mode': 'html',
            },
        };
    };

    /**
     * @version 2018-09-07
     * @since   2018-09-07
     * @author  Peter Lembke
     */
    $functions.push('event_message');
    const event_message = function($in = {}) {
        const $default = {
            'box_id': '',
            'step': 'step_start'
        };
        $in = _Merge($default, $in);

        if ($in.step === 'step_start') {
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_view',
                    'function': 'siblings_view',
                },
                'data': {
                    'box_id': $in.box_id,
                },
                'data_back': {
                    'step': 'step_end',
                },
            });
        }

        return {
            'answer': 'true',
            'message': 'Done handling events in RenderStatus',
        };
    };
}

//# sourceURL=infohub_renderstatus.js