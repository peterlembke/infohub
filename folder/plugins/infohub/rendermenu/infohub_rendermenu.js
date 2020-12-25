/**
 * @category InfoHub
 * @package infohub_rendermenu
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
function infohub_rendermenu() {

    "use strict";

    // include "infohub_base.js"

    const _Version = function() {
        return {
            'date': '2018-09-05',
            'since': '2018-09-05',
            'version': '1.0.0',
            'checksum': '{{checksum}}',
            'class_name': 'infohub_rendermenu',
            'note': 'Render a list with buttons. That is easier to use than a list with links',
            'status': 'normal',
            'SPDX-License-Identifier': 'GPL-3.0-or-later',
            'user_role': 'user',
            'web_worker': 'true',
            'core_plugin': 'false'
        };
    };

    const _GetCmdFunctions = function()
    {
        const $list = {
            'create': 'normal',
            'event_message': 'normal'
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
    const _GetFuncName = function($text)
    {
        let $response = '';
        const $parts = $text.split('_');

        for (let $key in $parts) {
            if ($parts.hasOwnProperty($key) === false) {
                continue;
            }
            $response = $response + $parts[$key].charAt(0).toUpperCase() + $parts[$key].substr(1);
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
    const create = function ($in)
    {
        const $default = {
            'item_index': {},
            'config': {
                "focus_shadow_colour": "",
                "hover_shadow_colour": ""
            },
            'data_back': {
                'item_name': '',
                'item_index_done': {}
            },
            'response': {},
            'step': 'step_create'
        };
        $in = _Default($default, $in);

        if ($in.step === 'step_create_response') {
            const $defaultResponse = {
                'answer': 'false',
                'message': '',
                'html': '',
                'css_data': {},
                'display': ''
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
                    'css_data': {},
                    'config': {
                        'focus_shadow_colour': 'red'
                    }
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
                        'function': 'create'
                    },
                    'data': {
                        'what': $response.data,
                        'how': $response.how,
                        'where': $response.where,
                        'alias': $data.alias,
                        'css_data': $response.css_data
                    },
                    'data_back': {
                        'item_index': $in.item_index,
                        'item_name': $itemName,
                        'item_index_done': $in.data_back.item_index_done,
                        'step': 'step_create_response'
                    }
                });
            }
            $in.step = 'step_end';
        }

        return {
            'answer': 'true',
            'message': 'Here is what I rendered',
            'item_index': $in.data_back.item_index_done
        };
    };

    /**
     * Basic form
     * @version 2018-06-06
     * @since   2018-06-06
     * @author  Peter Lembke
     */
    const internal_Menu = function ($in)
    {
        const $default = {
            'head_label': '',
            'head_text': '',
            'foot_text': '',
            'original_alias': '',
            'options': {},
            'config': {
                'focus_shadow_colour': 'red',
                'hover_shadow_colour': 'grey'
            }
        };
        $in = _Default($default, $in);

        let $parts = {
            'presentation_box': {
                'plugin': 'infohub_rendermajor',
                'type': 'presentation_box',
                'head_label': $in.head_label,
                'foot_text': $in.foot_text,
                'content_data': '',
                'original_alias': $in.original_alias
            }
        };

        const $defaultOption = {
            'plugin': 'infohub_renderform',
            'type': 'button',
            'enabled': 'true',
            'alias': '',
            'class': '',
            'button_left_icon': '',
            'button_label': 'Submit',
            'mode': 'button', // submit, button
            'event_data': 'menu button', // Your data
            'event_handler': 'infohub_renderform', // Normally leave as it is
            'to_node': 'client',
            'to_plugin': 'infohub_rendermenu',
            'to_function': 'event_message',
            'custom_variables': {}, // You can add more custom variables like the data variable above
            'css_data': {
                '.button':
                    'font-size: 1.0em;'+
                    'width: 100%;'+
                    'box-sizing:border-box;'+
                    'border-radius: 16px;'+
                    'margin: 4px 0px 0px 0px;'+
                    'padding: 2px 10px 2px 16px;'+
                    'text-align: left;'+
                    'border: 0px;',
                '.button-width':
                    'width: 100%;',

            } // Leave empty to get the default css
        };

        let $names = [];

        for (let $name in $in.options)
        {
            if ($in.options.hasOwnProperty($name) === false) {
                continue;
            }

            const $option = $in.options[$name];

            $option.type = 'button'; // Hard coded so this renderer stay true to its purpose

            $parts[$name] = _Default($defaultOption, $option);
            $names.push($name);
        }

        $parts.presentation_box.content_data = '[' + $names.join('][') + ']';

        if (_Empty($in.head_text) === 'false') {
            $parts.presentation_box.content_data = $in.head_text + $parts.presentation_box.content_data;
        }

        return {
            'answer': 'true',
            'message': 'Here are the parts to build the menu in a presentation box',
            'data': $parts,
            'how': {
                'mode': 'one box',
                'text': '[presentation_box]'
            },
            'where': {
                'mode': 'html'
            }
        };
    };

    /**
     * @version 2018-09-07
     * @since   2018-09-07
     * @author  Peter Lembke
     */
    $functions.push('event_message');
    const event_message = function ($in)
    {
        const $default = {
            'parent_id': 0,
            'box_id': '',
            'step': 'start',
            'event_data': ''
        };
        $in = _Merge($default, $in);

        let $messageArray = [];

        if ($in.step === 'step_end') {
            return {
                'answer': 'true',
                'message': 'Got a return message'
            };
        }

        if ($in.type === 'button') {
            if ($in.event_type === 'click') {

                const $text = 'This button works but goes to infohub_rendermenu, set your own destination instead.';

                const $messageOut = _SubCall({
                    'to': {
                        'node': 'client',
                        'plugin': 'infohub_view',
                        'function': 'alert'
                    },
                    'data': {
                        'text': $text
                    },
                    'data_back': {
                        'step': 'step_end'
                    }
                });

                $messageArray.push($messageOut);
            }
        }

        return {
            'answer': 'true',
            'message': 'Done handling events in RenderMenu',
            'messages': $messageArray
        };
    };
}
//# sourceURL=infohub_rendermenu.js