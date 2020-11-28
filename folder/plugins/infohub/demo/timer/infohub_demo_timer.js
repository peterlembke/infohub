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
function infohub_demo_timer() {

    "use strict";

// include "infohub_base.js"

    const _Version = function () {
        return {
            'date': '2020-02-29',
            'since': '2020-02-29',
            'version': '1.0.0',
            'checksum': '{{checksum}}',
            'class_name': 'infohub_demo_timer',
            'note': 'Collection of demos to demonstrate InfoHub Timer',
            'status': 'normal',
            'SPDX-License-Identifier': 'GPL-3.0-or-later'
        };
    };

    const _GetCmdFunctions = function () {
        const $list = {
            'create': 'normal',
            'click_button': 'normal',
            'click_advanced': 'normal'
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
            'default': $string, 'data': $classTranslations, 'split': '|'
        });
    };

    // ***********************************************************
    // * your class functions below, only declare with var
    // * Can only be reached trough cmd()
    // ***********************************************************

    /**
     * Get instructions and create the message to InfoHub View
     * @version 2020_03-01
     * @since   2020_03-01
     * @author  Peter Lembke
     */
    $functions.push('create');
    const create = function ($in) 
    {
        const $default = {
            'parent_box_id': '',
            'translations': {},
            'step': 'step_start',
            'response': {
                'answer': 'false',
                'message': 'Nothing to report from infohub_demo_link'
            }
        };
        $in = _Default($default, $in);

        if ($in.step === 'step_start') 
        {
            $classTranslations = $in.translations;
            
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_render',
                    'function': 'create'
                },
                'data': {
                    'what': {
                        'my_presentation_box1': {
                            'plugin': 'infohub_rendermajor',
                            'type': 'presentation_box',
                            'head_label': _Translate('Timer demo'),
                            'head_text': _Translate('Press the buttons to change the colours'),
                            'content_data': '[svg_example]',
                            'foot_text': '[button_red][button_green][button_blue]'
                        },
                        'svg_example': {
                            'type': 'common',
                            'subtype': 'svg',
                            'data': '[svg_example_asset]'
                        },
                        'svg_example_asset': {
                            'plugin': 'infohub_asset',
                            'type': 'icon',
                            'subtype': 'svg',
                            'asset_name': 'timer/circle',
                            'plugin_name': 'infohub_demo'
                        },
                        'button_red': {
                            'plugin': 'infohub_renderform',
                            'type': 'button',
                            'mode': 'click',
                            'button_label': _Translate('Red'),
                            'event_data': 'timer|button|red',
                            'to_plugin': 'infohub_demo',
                            'to_function': 'click'
                        },
                        'button_green': {
                            'plugin': 'infohub_renderform',
                            'type': 'button',
                            'mode': 'click',
                            'button_label': _Translate('Green'),
                            'event_data': 'timer|button|green',
                            'to_plugin': 'infohub_demo',
                            'to_function': 'click'
                        },
                        'button_blue': {
                            'plugin': 'infohub_renderform',
                            'type': 'button',
                            'mode': 'click',
                            'button_label': _Translate('Blue'),
                            'event_data': 'timer|button|blue',
                            'to_plugin': 'infohub_demo',
                            'to_function': 'click'
                        },
                        'my_presentation_box2': {
                            'plugin': 'infohub_rendermajor',
                            'type': 'presentation_box',
                            'head_label': _Translate('Advanced Timer demo'),
                            'head_text': _Translate('Press the button to start the demo'),
                            'content_data': '[button_advanced_timer]',
                            'foot_text': '[advanced_text]'
                        },
                        'button_advanced_timer': {
                            'plugin': 'infohub_renderform',
                            'type': 'button',
                            'mode': 'click',
                            'button_label': _Translate('Advanced timer'),
                            'event_data': 'timer|advanced|grey',
                            'to_plugin': 'infohub_demo',
                            'to_function': 'click'
                        },
                        'advanced_text': {
                            'type': 'text',
                            'text': _Translate('The result') + ':'
                        }
                    },
                    'how': {
                        'mode': 'one box',
                        'text': '[my_presentation_box1][my_presentation_box2]',
                        'css_data': {
                            '.light': 'background-color: green; display: inline-block;'
                        }
                    },
                    'where': {
                        'box_id': $in.parent_box_id + '.demo',
                        'max_width': 100,
                        'scroll_to_box_id': 'true'
                    },
                    'cache_key': 'timer'
                },
                'data_back': {
                    'step': 'step_end'
                }                
            });
        }

        return {
            'answer': $in.response.answer,
            'message': $in.response.message,
            'data': $in.response.data
        };
    };

    /**
     * The buttons come here.
     * @version 2020-03-01
     * @since 2020-03-01
     * @author Peter Lembke
     */
    $functions.push("click_button");
    const click_button = function ($in)
    {
        const $default = {
            'event_data': '',
            'answer': 'false',
            'message': 'Nothing to report',
            'step': 'step_start',
            'box_id': '',
            'data_back': {
                'box_id': '',
                'element_path': '',
                'style_name': '',
                'style_value': ''
            }
        };
        $in = _Default($default, $in);

        if ($in.step === 'step_start')
        {
            const $colour = {
                'red': ['FF0000', 'DD0000', 'BB0000', '990000', '770000', '550000', '330000', '110000', '000000'],
                'green': ['00FF00', '00DD00', '00BB00', '009900', '007700', '005500', '003300', '001100', '000000'],
                'blue': ['0000FF', '0000DD', '0000BB', '000099', '000077', '000055', '000033', '000011', '000000'],
                'grey': ['FFFFFF', 'DDDDDD', 'BBBBBB', '999999', '777777', '555555', '333333', '111111', '000000']
            };

            let $messageArray = [];

            for (let $number = 0; $number < 9; $number = $number + 1)
            {
                const $name = $in.event_data + '-' + $number;

                let $messageOut = _SubCall({
                    'to': {
                        'node': 'client',
                        'plugin': 'infohub_timer',
                        'function': 'start_timer'
                    },
                    'data': {
                        'name': $name,
                        'milliseconds': $number * 400,
                        'update': 'yes', // no, yes, lower, higher
                    },
                    'data_back': {
                        'box_id':  $in.box_id + '.[svg_example]',
                        'element_path': 'svg.circle.' + $number,
                        'style_name': 'fill',
                        'style_value': '#' + $colour[$in.event_data][$number],
                        'step': 'step_set_style'
                    }
                });

                $messageArray.push($messageOut);
            }

            return {
                'answer': 'true',
                'message': 'Here are some messages to the timer',
                'messages': $messageArray
            };
        }

        if ($in.step === 'step_set_style')
        {
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_view',
                    'function': 'set_style'
                },
                'data': {
                    'box_id': $in.data_back.box_id,
                    'element_path': $in.data_back.element_path,
                    'style_name': $in.data_back.style_name,
                    'style_value': $in.data_back.style_value
                },
                'data_back': {
                    'step': 'step_end'
                }
            });
        }

        return {
            'answer': 'true',
            'message': 'Done handling files data',
            'ok': 'true' // Gives an OK on the button you clicked
        };
    };

    /**
     * The advanced button comes here.
     * Simulates 9 messages coming in with 400 ms delay each.
     * First message can wait 10 seconds, next can wait 8 seconds and so on down to zero.
     * Soon you have messages that can not wait and the timer will trigger.
     * All information will be displayed in a text box.
     * @version 2020-03-09
     * @since 2020-03-09
     * @author Peter Lembke
     */
    $functions.push("click_advanced");
    const click_advanced = function ($in)
    {
        const $default = {
            'event_data': '',
            'answer': 'false',
            'message': 'Nothing to report',
            'step': 'step_start',
            'box_id': '',
            'data_back': {
                'event_data': '',
                'box_id': '',
                'element_path': '',
                'style_name': '',
                'style_value': '',
                'number': 0
            }
        };
        $in = _Default($default, $in);

        if ($in.step === 'step_start')
        {
            const $colour = {
                'grey': ['FFFFFF', 'DDDDDD', 'BBBBBB', '999999', '777777', '555555', '333333', '111111', '000000'],
                'purple': ['FF00FF', 'DD00DD', 'BB00BB', '990099', '770077', '550055', '330033', '110011', '000000']
            };

            let $messageArray = [];

            let $messageOut = _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_view',
                    'function': 'box_data'
                },
                'data': {
                    'box_id': $in.box_id + '.[my_presentation_box2_foot]',
                    'box_data': 'Start: ' + _MicroTime() + '<br>',
                    'mode': 'substitute'
                },
                'data_back': {
                    'step': 'step_end'
                }
            });

            $messageArray.push($messageOut);

            for (let $number = 0; $number < 9; $number = $number + 1)
            {
                const $name = $in.event_data + '-' + $number;

                let $messageOut = _SubCall({
                    'to': {
                        'node': 'client',
                        'plugin': 'infohub_timer',
                        'function': 'start_timer'
                    },
                    'data': {
                        'name': $name,
                        'milliseconds': $number * 400,
                        'update': 'yes', // no, yes, lower, higher
                    },
                    'data_back': {
                        'event_data': $in.event_data,
                        'box_id': $in.box_id,
                        'element_path': 'svg.circle.' + $number,
                        'style_name': 'fill',
                        'style_value': '#' + $colour.grey[$number],
                        'number': $number,
                        'step': 'step_set_style'
                    }
                });

                $messageArray.push($messageOut);
            }

            return {
                'answer': 'true',
                'message': 'Here are some messages to the timer',
                'messages': $messageArray
            };
        }

        if ($in.step === 'step_set_style')
        {
            let $messageArray = [];

            let $messageOut = _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_view',
                    'function': 'set_style'
                },
                'data': {
                    'box_id': $in.data_back.box_id + '.[svg_example]',
                    'element_path': $in.data_back.element_path,
                    'style_name': $in.data_back.style_name,
                    'style_value': $in.data_back.style_value
                },
                'data_back': {
                    'step': 'step_end'
                }
            });

            $messageArray.push($messageOut);

            let $wait = 3.0 - $in.data_back.number * 0.7;
            if ($wait < 0.0) {
                $wait = $wait + 3.0;
            }

            const $now = _MicroTime();
            const $when = $now + $wait;

            $messageOut = _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_timer',
                    'function': 'start_timer_advanced'
                },
                'data': {
                    'name': 'simulate_send_message',
                    'when': $when, // When do you want a response
                    'earliest': $now + 1.0, // Set an earliest timestamp when I'll give a response
                    'latest': $now + 60.0, // Set a latest timestamp when I'll give a response
                    'update': 'lower' // no, yes, lower, higher
                },
                'data_back': {
                    'box_id': $in.box_id,
                    'number': $in.data_back.number,
                    'step': 'step_simulate_send_message'
                }
            });

            $messageArray.push($messageOut);

            const $text = _Translate('Number') + ': ' + $in.data_back.number + ', ' + _Translate('wait') + ': ' + $wait + '<br>';

            $messageOut = _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_view',
                    'function': 'box_data'
                },
                'data': {
                    'box_id': $in.data_back.box_id + '.[my_presentation_box2_foot]',
                    'box_data': $text,
                    'mode': 'add_last'
                },
                'data_back': {
                    'step': 'step_end'
                }
            });

            $messageArray.push($messageOut);

            return {
                'answer': 'true',
                'message': 'normal timer triggered and an advanced timer was updated',
                'messages': $messageArray
            };
        }

        if ($in.step === 'step_simulate_send_message')
        {
            const $now = _MicroTime();

            let $messageArray = [];

            let $messageOut = _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_view',
                    'function': 'box_data'
                },
                'data': {
                    'box_id': $in.data_back.box_id + '.[my_presentation_box2_foot]',
                    'box_data': _Translate('Simulate sending') + ': ' + $now + '<br>',
                    'mode': 'add_last'
                },
                'data_back': {
                    'step': 'step_end'
                }
            });

            $messageArray.push($messageOut);

            return {
                'answer': 'true',
                'message': 'Advanced timer triggered',
                'messages': $messageArray
            };
        }

        return {
            'answer': 'true',
            'message': 'Done handling files data',
            'ok': 'true' // Gives an OK on the button you clicked
        };
    };
}
//# sourceURL=infohub_demo_timer.js