/**
 Copyright (C) 2020 Peter Lembke, CharZam soft
 the program is distributed under the terms of the GNU General Public License

 Labs/Svg is free software: you can redistribute it and/or modify
 it under the terms of the GNU General Public License as published by
 the Free Software Foundation, either version 3 of the License, or
 (at your option) any later version.

 Labs/Svg is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 GNU General Public License for more details.

 You should have received a copy of the GNU General Public License
 along with Labs/Svg.  If not, see <https://www.gnu.org/licenses/>.'

 * @constructor
 */
function infohub_color() {

    "use strict";

// include "infohub_base.js"

    const _Version = function() {
        return {
            'date': '2020-10-31',
            'since': '2020-10-18',
            'version': '1.0.0',
            'checksum': '{{checksum}}',
            'class_name': 'infohub_color',
            'note': 'Handles the infohub color schema',
            'status': 'normal',
            'SPDX-License-Identifier': 'GPL-3.0-or-later',
            'user_role': 'user'
        };
    };

    const _GetCmdFunctions = function() {
        const $list = {
            'create': 'normal',
            'event_message': 'normal',
            'click_color_selector': 'normal',
            'click_color_reader': 'normal',
            'click_light_bar_selector': 'normal',
            'calculate_color_schema': 'normal',
            'get_color_schema': 'normal'
        };

        return _GetCmdFunctionsBase($list);
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
    const _GetFuncName = function($text)
    {
        let $response = '';

        const $parts = $text.split('_');

        for (let $key in $parts)
        {
            if ($parts.hasOwnProperty($key) === false) {
                continue;
            }

            $response = $response + $parts[$key].charAt(0).toUpperCase() + $parts[$key].substr(1);
        }

        return $response;
    };

    /**
     * Get instructions and create the message to InfoHub View
     * @version 2013-04-15
     * @since   2013-04-15
     * @author  Peter Lembke
     */
    $functions.push("create"); // Enable this function
    const create = function ($in)
    {
        const $default = {
            'type': 'color_bar',
            'alias': '',
            'original_alias': '',
            'step': 'step_start',
            'html': '',
            'css_data': {},
            'data_back': {},
            'response': {}
        };
        $in = _Merge($default, $in);

        if ($in.step === 'step_start')
        {
            $in.func = _GetFuncName($in.type);
            $in.type = '';
            const $response = internal_Cmd($in);

            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_render',
                    'function': 'create'
                },
                'data': {
                    'what': $response.what,
                    'how': $response.how,
                    'where': $response.where
                },
                'data_back': {
                    'step': 'step_final',
                    'alias': $in.alias
                }
            });
        }

        if ($in.step === 'step_final') {
            if (_Empty($in.alias) === 'false') {
                // All IDs become unique by inserting the parent alias in each ID.
                const $find = '{box_id}';
                const $replace = $find + '_' + $in.alias;
                $in.html = $in.html.replace(new RegExp($find, 'g'), $replace);
            }
        }

        return {
            'answer': $in.answer,
            'message': $in.message,
            'html': $in.html,
            'css_data': $in.css_data
        };
    };

    /**
     * Event links end up here
     * @version 2019-08-17
     * @since   2013-08-17
     * @author  Peter Lembke
     */
    $functions.push("event_message"); // Enable this function
    const event_message = function ($in)
    {
        const $default = {
            'final_node': 'client',
            'final_plugin': '',
            'final_function': '',
            'alias': '',
            'event_data': '',
            'event_type': '',
            'box_id': '',
            'id': '',
            'innerHTML': '',
            'parent_box_id': '',
            'parent_id': '',
            'type': '',
            'data': '',
            'step': 'step_start',
            'response': {
                'answer': 'false',
                'message': 'Nothing to report from infohub_color -> event_message'
            }
        };
        $in = _Merge($default, $in);

        if ($in.step === 'step_start')
        {
            return _SubCall({
                'to': {
                    'node': $in.final_node,
                    'plugin': $in.final_plugin,
                    'function': $in.final_function
                },
                'data': {
                    'event_type': $in.event_type,
                    'event_data': $in.event_data,
                    'innerHTML': $in.innerHTML,
                    'box_id': $in.box_id
                },
                'data_back': {
                    'step': 'step_final'
                }
            });
        }

        return {
            'answer': $in.answer,
            'message': $in.message
        };
    };

    /**
     * Create a color selector with a color bar. Click on a color to get a light bar for that color.
     * You can read the color hex code.
     * @version 2020-10-24
     * @since   2020-10-20
     * @author  Peter Lembke
     */
    $functions.push('internal_ColorSelector');
    const internal_ColorSelector = function ($in) {
        const $default = {
            'head_label': 'Pick a color',
            'width': 30,
            'height': 30,
            'colors': {},
            'final_node': 'client',
            'final_plugin': 'infohub_color',
            'final_function': 'click_color_selector',
            'original_alias': ''
        };

        $in = _Default($default, $in);

        return {
            'answer': 'true',
            'message': 'Here are the definition',
            'what': {
                'pick_color': {
                    'plugin': 'infohub_rendermajor',
                    'type': 'presentation_box',
                    'head_label': $in.head_label,
                    'content_data': '[hue_bar_container][light_bar_container][color_container][hue_degree_container]'
                },
                'hue_bar_container': {
                    'type': 'common',
                    'subtype': 'container',
                    'data': '[hue_bar]',
                    'alias': 'hue_bar_container',
                    'visible': 'true'
                },
                'hue_bar': {
                    'plugin': 'infohub_color',
                    'type': 'hue_bar',
                    'width': 16,
                    'start': 0,
                    'stop': 360,
                    'jump': 10,
                    'final_node': $in.final_node,
                    'final_plugin': $in.final_plugin,
                    'final_function': $in.final_function,
                    'event_data': $in.original_alias
                },
                'light_bar_container': {
                    'type': 'common',
                    'subtype': 'container',
                    'data': '',
                    'alias': 'light_bar_container',
                    'display': 'block'
                },
                'color_container': {
                    'type': 'form',
                    'subtype': 'text',
                    'input_type': 'text',
                    'display': 'none',
                    'original_alias': $in.original_alias + '_color'
                },
                'hue_degree_container': {
                    'type': 'form',
                    'subtype': 'text',
                    'input_type': 'text',
                    'display': 'none',
                    'original_alias': $in.original_alias + '_hue_degree'
                }
            },
            'how': {
                'mode': 'one box',
                'text': '[pick_color]'
            },
            'where': {
                'mode': 'html'
            }
        };
    };

    /**
     * Creates a color reader that reads the ColorSelector data.
     * A button that starts the read, a light_bar, hue_degree, color_hex
     * @version 2020-10-31
     * @since   2020-10-30
     * @author  Peter Lembke
     */
    $functions.push('internal_ColorReader');
    const internal_ColorReader = function ($in) {
        const $default = {
            'original_alias': '',
            'button_label': 'Use',
            'color_selector_name': '',
            'custom_variables': {}
        };

        $in = _Default($default, $in);

        return {
            'answer': 'true',
            'message': 'Here are the definition',
            'what': {
                'container_all': {
                    'type': 'common',
                    'subtype': 'container',
                    'alias': 'container_all',
                    'tag': 'div', // span, p, div, pre
                    'data': '[container_button_read][light_bar_container][hue_degree_container]',
                    'display': 'block' // leave empty, "block" or "inline" or "none".
                },
                'container_button_read': {
                    'type': 'common',
                    'subtype': 'container',
                    'alias': 'container_button_read',
                    'tag': 'div', // span, p, div, pre
                    'data': '[button_read]',
                    'display': 'inline' // leave empty, "block" or "inline" or "none".
                },
                'button_read': {
                    'plugin': 'infohub_renderform',
                    'type': 'button',
                    'mode': 'button',
                    'button_label': $in.button_label,
                    'event_data': $in.color_selector_name,
                    'to_plugin': 'infohub_color',
                    'to_function': 'click_color_reader',
                    'css_data': {
                        '.button-width':
                            'width: 100%;'+
                            'box-sizing:border-box;'+
                            'max-width: 160px;'
                    },
                    'custom_variables': $in.custom_variables
                },
                'light_bar_container': {
                    'type': 'common',
                    'subtype': 'container',
                    'data': '',
                    'alias': 'light_bar_container',
                    'display': 'inline'
                },
                'hue_degree_container': {
                    'type': 'form',
                    'subtype': 'text',
                    'input_type': 'text',
                    'display': 'none',
                    'original_alias': $in.original_alias
                }
            },
            'how': {
                'mode': 'one box',
                'text': '[container_all]'
            },
            'where': {
                'mode': 'html'
            }
        };
    };

    /**
     * Renders a light bar that you can click and see your selection
     * Also renders a hidden textbox for the light percent
     * @version 2020-11-03
     * @since   2020-11-01
     * @author  Peter Lembke
     */
    $functions.push('internal_LightBarSelector');
    const internal_LightBarSelector = function ($in) {
        const $default = {
            'original_alias': '',
            'label': '',
            'description': '',
            'width': 30,
            'height': 30,
            'hue_degree': 0,
            'saturation_percent': 0,
            'start': 10,
            'stop': 90,
            'jump': 8
        };

        $in = _Default($default, $in);

        return {
            'answer': 'true',
            'message': 'Here are the definition',
            'what': {
                'major_container': {
                    'plugin': 'infohub_rendermajor',
                    'type': 'presentation_box',
                    'head_label': $in.label,
                    'content_data': '[light_bar_container][light_box_container][light_value_container]',
                    'foot_text': $in.description
                },
                'light_bar_container': {
                    'type': 'common',
                    'subtype': 'container',
                    'data': '[light_bar]',
                    'alias': 'light_bar_container',
                    'display': 'inline'
                },
                'light_bar': {
                    'plugin': 'infohub_color',
                    'type': 'light_bar',
                    'width': $in.width,
                    'height': $in.height,
                    'hue_degree': $in.hue_degree,
                    'saturation_percent': $in.saturation_percent,
                    'start': $in.start,
                    'stop': $in.stop,
                    'jump': $in.jump,
                    'final_node': 'client',
                    'final_plugin': 'infohub_color',
                    'final_function': 'click_light_bar_selector',
                    'event_data': $in.original_alias
                },
                'light_box_container': {
                    'type': 'common',
                    'subtype': 'container',
                    'data': '',
                    'display': 'inline'
                },
                'light_value_container': {
                    'type': 'form',
                    'subtype': 'text',
                    'input_type': 'text',
                    'display': 'none',
                    'original_alias': $in.original_alias
                }
            },
            'how': {
                'mode': 'one box',
                'text': '[major_container]'
            },
            'where': {
                'mode': 'html'
            }
        };
    };

    /**
     * Create a color bar with base colors. You can click any color and get the hex code
     * @version 2020-10-21
     * @since   2020-10-20
     * @author  Peter Lembke
     */
    $functions.push('internal_ColorBar');
    const internal_ColorBar = function ($in)
    {
        const $default = {
            'width': 30,
            'height': 30,
            'colors': {},
            'final_node': 'client',
            'final_plugin': 'infohub_color',
            'final_function': 'click_color_selector',
            'event_data': ''
        };

        $in = _Default($default, $in);

        const $colors = {
            'white': '#ffffff',
            'red': '#ff0000',
            'green': '#00ff00',
            'blue': '#0000ff',
            'yellow': '#ffff00',
            'cyan': '#00ffff',
            'magenta': '#ff00ff',
            'black': '#000000',
        };

        if (_Empty($in.colors) === 'true') {
            $in.colors = $colors;
        }

        // @todo Too many containers in this colors bar. I need to handle it here to speed it up

        let $oneColor = {
            'type': 'common',
            'subtype': 'container',
            'class': 'container',
            'tag': 'div', // span, p, div
            'display': 'inline-block',
            'visible': 'true',
            'css_data': {
                '.container': ''
            }
        };

        // @todo Too many links in this colors bar. I need to handle it here to speed it up

        let $oneEvent = {
            'type': 'link',
            'subtype': 'link',
            'alias': 'color_link',
            'event_data': '',
            'show': '',
            'to_plugin': 'infohub_color',
            'class': 'link',
            'final_node': $in.final_node,
            'final_plugin': $in.final_plugin,
            'final_function': $in.final_function
        };

        const $css = 'box-sizing: border-box; padding: 1px; border: 0px; vertical-align: middle; min-width: ' + $in.width + 'px; min-height: ' + $in.height + 'px; background-color: ';
        let $parts = {};
        let $allNames = [];

        for (let $colorName in $in.colors) {
            if ($in.colors.hasOwnProperty($colorName) === false) {
                continue;
            }

            $oneColor.css_data['.container'] = $css + $in.colors[$colorName] + ';';
            $parts[$colorName] = _ByVal($oneColor);

            if ($in.event_data === '') {
                $allNames.push('['+$colorName+']');
                continue; // This bar use no links
            }

            $oneEvent.event_data = $in.event_data + '|' + $colorName + '|' + $in.colors[$colorName];
            $oneEvent.show = '['+$colorName+']';
            $parts[$colorName + '_link'] = _ByVal($oneEvent);

            $allNames.push('['+$colorName+'_link]');
        }

        return {
            'answer': 'true',
            'message': 'Here are the parts to build the color bar',
            'what': $parts,
            'how': {
                'mode': 'one box',
                'text': $allNames.join('')
            },
            'where': {
                'mode': 'html' // mode HTML is cached where it is used.
            }
        };
    };

    /**
     * Create a color bar with a hue range of colors.
     * @version 2020-10-22
     * @since   2020-10-22
     * @author  Peter Lembke
     */
    $functions.push('internal_HueBar');
    const internal_HueBar = function ($in)
    {
        const $default = {
            'width': 30,
            'height': 30,
            'start': 0,
            'stop': 360,
            'jump': 16,
            'saturation': 100,
            'light': 50,
            'final_node': 'client',
            'final_plugin': 'infohub_color',
            'final_function': 'click_color_selector',
            'event_data': ''
        };

        $in = _Default($default, $in);

        let $colors = {};

        const $saturation = $in.saturation / 100.0; // percent. 0 = no color. 1.0 = maximum color
        const $light = $in.light / 100.0; // percent. 0.0 = black, 0.5 = full color. 1.0 = white

        for (let $hueValue = $in.start; $hueValue < $in.stop; $hueValue = $hueValue + $in.jump) {
            const $colorRgb = _HslToRgb($hueValue, $saturation, $light);
            const $colorHex = _RgbToHex($colorRgb);
            const $name = 'hue_' + $hueValue;
            $colors[$name] = $colorHex;
        }

        const $response = internal_ColorBar({
            'width': $in.width,
            'height': $in.height,
            'colors': $colors,
            'final_node': $in.final_node,
            'final_plugin': $in.final_plugin,
            'final_function': $in.final_function,
            'event_data': $in.event_data
        });

        return $response;
    };

    /**
     * Create a color bar with a base color in different light
     * @version 2020-10-22
     * @since   2020-10-22
     * @author  Peter Lembke
     */
    $functions.push('internal_LightBar');
    const internal_LightBar = function ($in)
    {
        const $default = {
            'width': 30,
            'height': 30,
            'hue_degree': 270,
            'saturation_percent': 100,
            'start': 10,
            'stop': 90,
            'jump': 8,
            'final_node': 'client',
            'final_plugin': 'infohub_color',
            'final_function': '',
            'event_data': '' // Add some data here if you want a clickable light bar
        };

        $in = _Default($default, $in);

        let $colors = {};

        const $saturation = $in.saturation_percent / 100.0; // percent. 0 = no color. 1.0 = maximum color

        for (let $lightValue = $in.start; $lightValue <= $in.stop; $lightValue = $lightValue + $in.jump) {
            const $colorRgb = _HslToRgb($in.hue_degree, $saturation, $lightValue / 100.0);
            const $colorHex = _RgbToHex($colorRgb);
            const $name = 'light_' + $lightValue;
            $colors[$name] = $colorHex;
        }

        const $response = internal_ColorBar({
            'width': $in.width,
            'height': $in.height,
            'colors': $colors,
            'final_node': $in.final_node,
            'final_plugin': $in.final_plugin,
            'final_function': $in.final_function,
            'event_data': $in.event_data
        });

        return $response;
    };

    /**
     * Create a color box
     * @version 2020-10-22
     * @since   2020-10-22
     * @author  Peter Lembke
     */
    $functions.push('internal_ColorBox');
    const internal_ColorBox = function ($in)
    {
        const $default = {
            'width': 30,
            'height': 30,
            'color_name': 'background',
            'color': '',
            'final_node': 'client',
            'final_plugin': 'infohub_color',
            'final_function': '',
            'event_data': ''
        };

        $in = _Default($default, $in);

        let $colors = {};

        $color[ $in.color_name ] = $color;

        const $response = internal_ColorBar({
            'width': $in.width,
            'height': $in.height,
            'colors': $colors,
            'final_node': $in.final_node,
            'final_plugin': $in.final_plugin,
            'final_function': $in.final_function,
            'event_data': $in.event_data
        });

        return $response;
    };

    $functions.push('click_color_selector');
    /**
     * You first end up in event_message and then you get here
     * Pull out the selected hex color and pull out the hueDegree
     * Render a light bar
     * @param $in
     * @returns {{answer: string, message: string}|*}
     */
    const click_color_selector = function ($in) {
        const $default = {
            'event_data': '',
            'box_id': '',
            'config': {
            },
            'step': 'step_start',
            'data_back': {
            },
            'response': {
                'answer': 'false',
                'message': 'An error occurred in click_color_selector'
            }
        };
        $in = _Default($default, $in);

        let $messagesArray = [];
        let $message = {};

        if ($in.step === 'step_start') {

            const $eventDataArray = $in.event_data.split('|');
            const $elementId = $in.box_id + '_' + $eventDataArray[0] + '_';
            const $hueDegree = parseInt($eventDataArray[1].substr(4));
            const $colorHex = $eventDataArray[2];

            $message = _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_render',
                    'function': 'create'
                },
                'data': {
                    'what': {
                        'light_bar': {
                            'plugin': 'infohub_color',
                            'type': 'light_bar',
                            'hue_degree': $hueDegree,
                            'start': 10,
                            'stop': 90,
                            'jump': 8,
                            'width': 16
                        }
                    },
                    'how': {
                        'mode': 'one box',
                        'text': '[light_bar]'
                    },
                    'where': {
                        'box_id': $elementId + 'light_bar_container',
                        'max_width': 100,
                        'scroll_to_box_id': 'false'
                    },
                    'cache_key': 'color_light_bar_' + $hueDegree
                },
                'data_back': {
                    'step': 'step_end'
                }
            });

            $messagesArray.push($message);

            $message = _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_view',
                    'function': 'set_text'
                },
                'data': {
                    'id': $elementId + 'hue_degree_container',
                    'text': $hueDegree.toString()
                },
                'data_back': {
                    'step': 'step_end'
                }
            });

            $messagesArray.push($message);

            $message = _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_view',
                    'function': 'set_text'
                },
                'data': {
                    'id': $elementId + 'color_container',
                    'text': $colorHex
                },
                'data_back': {
                    'step': 'step_end'
                }
            });

            $messagesArray.push($message);
        }

        return  {
            'answer': $in.response.answer,
            'message': $in.response.message,
            'messages': $messagesArray
        };
    };

    $functions.push('click_color_reader');
    /**
     * You pressed the color reader button.
     * I will pull out the selected color data from the selector
     * and show the data here
     * @param $in
     * @returns {{answer: string, message: string}|*}
     */
    const click_color_reader = function ($in) {
        const $default = {
            'event_data': '',
            'box_id': '',
            'id': '',
            'config': {
            },
            'step': 'step_start',
            'data_back': {
            },
            'response': {
                'answer': 'false',
                'message': 'An error occurred in click_color_selector'
            }
        };
        $in = _Default($default, $in);

        let $messagesArray = [];
        let $message = {};

        if ($in.step === 'step_start') {

            const $fromElementId = $in.box_id + '_' + $in.event_data + '_';
            const $lengthToSaveOnParent = $in.id.length - 'button_read_button'.length;
            const $parentId = $in.id.substr(0,$lengthToSaveOnParent);

            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_view',
                    'function': 'mass_update'
                },
                'data': {
                    'do': [
                        {
                            'func': 'DataCopy',
                            'from_box_id': $fromElementId + 'hue_degree_container',
                            'to_box_id': $parentId + 'hue_degree_container'
                        },
                        {
                            'func': 'DataCopy',
                            'from_box_id': $fromElementId + 'light_bar_container',
                            'to_box_id': $parentId + 'light_bar_container'
                        }
                    ]
                },
                'data_back': {
                    'step': 'step_end'
                }
            });
        }

        return  {
            'answer': $in.response.answer,
            'message': $in.response.message,
            'messages': $messagesArray
        };
    };

    $functions.push('click_light_bar_selector');
    /**
     * Click a light_bar_selector to get here
     * I will get the hex color. Convert to HSL and save light percent in the hidden box.
     * Render one box with the hex color.
     * @param $in
     * @returns {{answer: string, message: string}|*}
     */
    const click_light_bar_selector = function ($in) {
        const $default = {
            'event_data': '',
            'box_id': '',
            'config': {
            },
            'step': 'step_start',
            'data_back': {
            },
            'response': {
                'answer': 'false',
                'message': 'An error occurred in click_color_selector'
            }
        };
        $in = _Default($default, $in);

        let $messagesArray = [];
        let $message = {};

        if ($in.step === 'step_start') {

            const $eventDataArray = $in.event_data.split('|');
            const $parentId = $in.box_id + '_' + $eventDataArray[0];
            const $lightPercent = parseInt($eventDataArray[1].substr('light_'.length));
            const $hexColor = $eventDataArray[2];
            const $lightBoxContainer = $parentId + '_light_box_container';
            const $lightValueContainer = $parentId + '_light_value_container';

            $message = _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_render',
                    'function': 'create'
                },
                'data': {
                    'what': {
                        'color_bar': {
                            'plugin': 'infohub_color',
                            'type': 'color_bar',
                            'colors': [$hexColor],
                            'width': 30,
                            'height': 30
                        }
                    },
                    'how': {
                        'mode': 'one box',
                        'text': '[color_bar]'
                    },
                    'where': {
                        'box_id': $lightBoxContainer,
                        'max_width': 100,
                        'scroll_to_box_id': 'false'
                    }
                },
                'data_back': {
                    'step': 'step_end'
                }
            });

            $messagesArray.push($message);

            $message = _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_view',
                    'function': 'set_text'
                },
                'data': {
                    'id': $lightValueContainer,
                    'text': $lightPercent.toString()
                },
                'data_back': {
                    'step': 'step_end'
                }
            });

            $messagesArray.push($message);
        }

        return  {
            'answer': $in.response.answer,
            'message': $in.response.message,
            'messages': $messagesArray
        };
    };

    $functions.push('calculate_color_schema');
    const calculate_color_schema = function ($in) {
        const $default = {
            'config': {
                'group_number': 'true',
                'primary_colors_array': []
            },
            'step': 'step_start',
            'data_back': {
                'color_schema': {}
            }
        };
        $in = _Default($default, $in);

        let $out = {
            'answer': 'false',
            'message': 'An error occurred in calculate_color_schema',
            'color_schema': {}
        };


        if ($in.step === 'step_start') {
            const $baseShade = _GetBaseShade($in.config.group_number);
            let $oneGroup = _CalculateOneGroup($baseShade);
            const $allColorSeries = _CalculateAllColorSeries($in.config.primary_colors_array);
            const $finalColorArray = _BuildFinalColorArray($oneGroup, $allColorSeries);
        }

        return {
            'answer': $out.answer,
            'message': $out.message,
            'color_schema': $out.color_schema
        };
    };

    $functions.push("_GetBaseShade");
    /**
     * g0 = 1, g1 = 3, g2 = 5, g3 = 7, g4 = 9
     * @param $groupNumber
     * @returns {number}
     * @private
     */
    const _GetBaseShade = function($groupNumber = 0)
    {
        const $baseShade = 1 + 2 * $groupNumber;
        return $baseShade;
    };

    $functions.push("_CalculateOneGroup");
    /**
     * Calculate what colours should be
     * @version 2020-10-18
     * @since   2020-10-18
     * @author  Peter Lembke
     * @private
     */
    const _CalculateOneGroup = function($baseShade = 5)
    {
        // c0 = dark colour but not black
        // c5 = base colour
        // c10 = light colour but not white

        const $background = $baseShade;
        const $back = $background + 4;
        const $front = $back + 4;

        let $oneGroup = {
            'background': $background,
            'back': $back,
            'front': $front,
            'back-hover': $back + 1,
            'front-hover': $front + 1,
            'back-focus': $back + 2,
            'front-focus': $front + 2,
            'back-disabled': $back + 3,
            'front-disabled': $front + 3,
            'border': $back + 2,
            'shadow': $back + 3
        };

        for (let $itemName in $oneGroup) {
            if ($oneGroup.hasOwnProperty($itemName) === false) {
                continue;
            }

            let $value = $oneGroup[$itemName];
            if ($value <= 10) {
                continue;
            }

            $value = $value % 10; // % = the modulus operator
            $oneGroup[$itemName] = $value;
        }

        return $oneGroup;
    };

    $functions.push("_CalculateAllSeries");
    /**
     * Give an array with all baseColors and you get shade series for each base color
     * @param $primaryColorsArray
     * @returns {[]}
     * @private
     */
    const _CalculateAllColorSeries = function($primaryColorsArray = [])
    {
        let $allColorSeries = [];
        for (let $number = 0; $number < $primaryColorsArray.length; $number = $number + 1) {
            $allColorSeries[$number] = _CalculateOneSeries($primaryColorsArray[$number]);
        }

        return $allColorSeries;
    };

    $functions.push("_CalculateOneSeries");
    /**
     * You give a base color and get an object back with shades c0 - c10.
     * c5 is the base color, c0-c4 are darker, c6-c10 are lighter.
     * c0 is dark but not black
     * c10 is light but not white
     * Example: #A0B321
     * @returns {string}
     * @private
     */
    const _CalculateOneSeries = function($baseColor = '')
    {
        const $rgbArray = _HexToRgb($baseColor);
        const $hslArray = _RgbToHsl($rgbArray);

        let $oneSeries = {};
        const $step = 90/10;

        for (let $number = 0; $number < 11; $number = $number + 1) {
            let $value = $hslArray;
            $value[2] = 5 + $number * $step; // Luminance from 5 to 95
            const $newRgbArray = _HslToRgb($value);
            const $newColor = _RgbToHex($rgbArray);
            const $key = 'c' + $number.toString();
            $oneSeries[$key] = $newColor;
        }

        return $oneSeries;
    };

    $functions.push("_BuildFinalColorArray");
    /**
     * You get an object with s0 to s3 (if you have four base colors).
     * Each key has an object identical with oneGroup where each key
     * got the shade number swapped to a hex color from allColorSeries
     * @param $oneGroup | all group items and what color shade they should have
     * @param $allColorSeries | color shaded for each base color
     * @private
     */
    const _BuildFinalColorArray = function($oneGroup = {}, $allColorSeries = [])
    {
        let $finalColorObject = {};

        for (let $seriesNumber = 0; $seriesNumber < $allColorSeries.length; $seriesNumber = $seriesNumber + 1) {

            let $colorGroup = {};
            for (let $itemName in $oneGroup) {
                if ($oneGroup.hasOwnProperty($itemName) === false) {
                    continue;
                }
                const $shadeNumber = $oneGroup[$itemName];
                const $colorCode = $allColorSeries[$seriesNumber][$shadeNumber];
                $colorGroup[$itemName] = $colorCode;
            }

            const $seriesName = 's' + $seriesNumber.toString();
            $finalColorObject[$seriesName] = $colorGroup;
        }

        return $finalColorObject;
    };


    $functions.push("_RgbToHex");
    /**
     * Convert an array with three values to a string
     * Example: 160, 179, 33 to #A0B321
     * @returns {string}
     * @private
     */
    const _RgbToHex = function($rgbArray = [])
    {
        let $result = '#';
        let $hexNumber = '';
        for (let $number = 0; $number < 3; $number = $number + 1) {
            $hexNumber = $rgbArray[$number].toString(16);
            if ($hexNumber.length === 1) {
                $hexNumber = '0' + $hexNumber;
            }
            $result = $result + $hexNumber;
        }

        return $result;
    };

    $functions.push("_HexToRgb");
    /**
     * Convert a color code to an rgbArray with three values
     * Example: #A0B321 to 160, 179, 33
     * @param $colorCode
     * @returns {[number, number, number]}
     * @private
     */
    const _HexToRgb = function($colorCode = '')
    {
        const $red = parseInt('0x' + $colorCode.substr(1,2));
        const $green = parseInt('0x' + $colorCode.substr(3,2));
        const $blue = parseInt('0x' + $colorCode.substr(5,2));
        const $rgbArray = [$red, $green, $blue];

        return $rgbArray;
    };

    /**
     * Construct a random color with 6 hex numbers.
     * Example: #A0B321
     * @returns {string}
     * @private
     */
    const _RandomColour = function()
    {
        const $chars = '0123456789ABCDEF';
        let $color = '';

        for (let $position = 0; $position < 6; $position = $position +1) {
            const $number = Math.floor(Math.random() * 16);
            $color = $color + $chars[$number];
        }

        return '#' + $color;
    };

    /**
     * Convert RGB values to HSL values
     * Hue, Saturation, Lightness
     * This code is based on https://en.wikipedia.org/wiki/HSL_and_HSV
     * Free to use for any purpose. No attribution needed.
     * @param $rgbArray
     * @returns {number[]}
     * @private
     */
    const _RgbToHsl = function ($rgbArray = []) {
        const $redPercent = $rgbArray[0] / 255;
        const $greenPercent = $rgbArray[1] / 255;
        const $bluePercent = $rgbArray[2] / 255;

        let $maxPercent = Math.max($redPercent, $greenPercent, $bluePercent);
        let $minPercent = Math.min($redPercent, $greenPercent, $bluePercent);
        let $deltaPercent = $maxPercent - $minPercent;

        let $hueDegree = _CalculateHue($deltaPercent, $maxPercent, $redPercent, $greenPercent, $bluePercent);
        let $lightnessPercent = ($minPercent + $maxPercent) / 2;

        let $saturationPercent = 0;
        if ($deltaPercent !== 0) {
            $saturationPercent = $deltaPercent / (1 - Math.abs(2 * $lightnessPercent - 1));
        }

        return [$hueDegree, $saturationPercent, $lightnessPercent];
    };

    /**
     * Calculate HueDegree
     * Used by function _RgbToHsl
     * @param $deltaPercent | maxPercent - minPercent
     * @param $maxPercent | Largest of red, green blue percent
     * @param $redPercent
     * @param $greenPercent
     * @param $bluePercent
     * @returns {number} | Degree of Hue. Between 0 and 360
     * @private
     */
    const _CalculateHue = function($deltaPercent, $maxPercent, $redPercent, $greenPercent, $bluePercent) {

        let $hue = 0;

        leave: {
            if ($deltaPercent === 0) {
                break leave;
            }

            if ($maxPercent === $redPercent) {
                $hue = ($greenPercent - $bluePercent) / $deltaPercent % 6;
                break leave;
            }

            if ($maxPercent === $greenPercent) {
                $hue = ($bluePercent - $redPercent) / $deltaPercent + 2;
                break leave;
            }

            if ($maxPercent === $bluePercent) {
                $hue = ($redPercent - $greenPercent) / $deltaPercent + 4;
                break leave;
            }
        }

        const $hueDegree = $hue * 60;

        return $hueDegree;
    };

    /**
     * HSL to RGB
     * This code is based on https://en.wikipedia.org/wiki/HSL_and_HSV
     * Free to use for any purpose. No attribution needed.
     * @param $hueDegree | between 0 and 360
     * @param $saturation | between 0.0 and 1.0
     * @param $lightness | between 0.0 and 1.0
     * @returns {[number, number, number]}
     * @private
     */
    const _HslToRgb = function ($hueDegree, $saturation, $lightness) {
        let $c = (1 - Math.abs(2 * $lightness - 1)) * $saturation;
        let $hp = $hueDegree / 60.0;
        let $x = $c * (1 - Math.abs(($hp % 2) - 1));
        let $rgbArray = _GetRGBArray($hueDegree, $hp, $x, $c);

        let $m = $lightness - $c * 0.5;
        const $red = Math.round(255 * ($rgbArray[0] + $m));
        const $green = Math.round(255 * ($rgbArray[1] + $m));
        const $blue = Math.round(255 * ($rgbArray[2] + $m));

        return [$red,$green,$blue];
    };

    /**
     * Used by _HslToRgb
     * @param $hueDegree
     * @param $hp
     * @param $x
     * @param $c
     * @returns {(number|*)[]|(*|number)[]|number[]}
     * @private
     */
    const _GetRGBArray = function($hueDegree, $hp, $x, $c) {
        let $rgbArray = [0, 0, 0];
        if (isNaN($hueDegree)) {
            return $rgbArray;
        }

        if ($hp <= 1) {
            $rgbArray = [$c, $x, 0];
            return $rgbArray;
        }

        if ($hp <= 2) {
            $rgbArray = [$x, $c, 0];
            return $rgbArray;
        }

        if ($hp <= 3) {
            $rgbArray = [0, $c, $x];
            return $rgbArray;
        }

        if ($hp <= 4) {
            $rgbArray = [0, $x, $c];
            return $rgbArray;
        }

        if ($hp <= 5) {
            $rgbArray = [$x, 0, $c];
            return $rgbArray;
        }

        if ($hp <= 6) {
            $rgbArray = [$c, 0, $x];
            return $rgbArray;
        }

        return $rgbArray;
    };

}
//# sourceURL=infohub_color.js
