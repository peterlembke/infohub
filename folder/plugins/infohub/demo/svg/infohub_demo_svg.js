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
function infohub_demo_svg() {

    "use strict";

// include "infohub_base.js"

    const _Version = function() {
        return {
            'date': '2020-04-19',
            'since': '2020-04-19',
            'version': '1.0.0',
            'checksum': '{{checksum}}',
            'class_name': 'infohub_demo_svg',
            'note': 'Render a SVG demo for infohub_demo',
            'status': 'normal',
            'SPDX-License-Identifier': 'GPL-3.0-or-later'
        };
    };

    const _GetCmdFunctions = function() {
        return {
            'create': 'normal'
        };
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
        if (typeof $classTranslations !== 'object') { return $string; }
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
     * @version 2020-04-19
     * @since   2020-04-19
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
                'message': 'Nothing to report from infohub_demo_svg'
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
                        'my_text': {
                            'type': 'text',
                            'text': "[h1][titel][/h1]\n [i][ingress][/i]\n[demo1][demo2][demo3]\n"
                        },
                        'titel': {
                            'type': 'common',
                            'subtype': 'value',
                            'data': _Translate('Welcome to InfoHub Demo SVG')
                        },
                        'ingress': {
                            'type': 'common',
                            'subtype': 'value',
                            'data': _Translate('Here are some demos to show you what Infohub can do with Infohub SVG. If you instead want to use existing SVG files then have a look at infohub render common.')
                        },
                        'demo1': {
                            'plugin': 'infohub_rendermajor',
                            'type': 'presentation_box',
                            'head_label': _Translate('Rectange'),
                            'foot_text': _Translate('A simple rectangle'),
                            'content_data': '[demo1_svg_start][demo1_svg_rectangle][demo1_svg_stop]'
                        },
                        'demo1_svg_start': {
                            'type': 'svg',
                            'subtype': 'svg_start',
                            'width': 140.0,
                            'height': 140.0
                        },
                        'demo1_svg_rectangle': {
                            'type': 'svg',
                            'subtype': 'svg_single_tag',
                            'tag': 'rect',
                            'parameters': {
                                'x': "20", 'y': "20", 'rx': "20", 'ry': "20", 'width': "100", 'height': "100",
                                'style': "fill:red;stroke:black;stroke-width:5;opacity:0.5"
                            }
                        },
                        'demo1_svg_stop': {
                            'type': 'svg',
                            'subtype': 'svg_stop'
                        },
                        'demo2': {
                            'plugin': 'infohub_rendermajor',
                            'type': 'presentation_box',
                            'head_label': _Translate('Circle'),
                            'foot_text': _Translate('A simple circle'),
                            'content_data': '[demo1_svg_start][demo2_svg_circle][demo1_svg_stop]'
                        },
                        'demo2_svg_circle': {
                            'type': 'svg',
                            'subtype': 'svg_single_tag',
                            'tag': 'circle',
                            'parameters': {
                                'cx': "70.0",
                                'cy': "70.0",
                                'r': "30.0",
                                'style': "display:inline;fill:#ff00ff;fill-opacity:0.5;stroke:#00ffff;stroke-width:10.0;"
                            }
                        },
                        'demo3': {
                            'plugin': 'infohub_rendermajor',
                            'type': 'presentation_box',
                            'head_label': _Translate('Shadow'),
                            'foot_text': _Translate('How to do shadows'),
                            'content_data': '[demo1_svg_start][demo3_svg_shadow_defs][demo3_svg_shadow_rectangle][demo1_svg_stop]'
                        },
                        'demo3_svg_shadow_defs': {
                            'type': 'svg',
                            'subtype': 'svg_content_tag',
                            'tag': 'defs',
                            'content': '[demo3_svg_defs_filter]'
                        },
                        'demo3_svg_defs_filter': {
                            'type': 'svg',
                            'subtype': 'svg_content_tag',
                            'tag': 'filter',
                            'content': '[demo3_svg_offset][demo3_svg_gaussian][demo3_svg_blend]',
                            'parameters': {
                                'x': "0", 'y': "0", 'width': "200%", 'height': "200%"
                            }
                        },
                        'demo3_svg_offset': {
                            'type': 'svg',
                            'subtype': 'svg_single_tag',
                            'tag': 'feOffset',
                            'parameters': {
                                'result': "offOut", 'in': "SourceAlpha", 'dx': "20", 'dy': "20"
                            }
                        },
                        'demo3_svg_gaussian': {
                            'type': 'svg',
                            'subtype': 'svg_single_tag',
                            'tag': 'feGaussianBlur',
                            'parameters': {
                                'result': "blurOut", 'in': "offOut", 'stdDeviation': "10"
                            }
                        },
                        'demo3_svg_blend': {
                            'type': 'svg',
                            'subtype': 'svg_single_tag',
                            'tag': 'feBlend',
                            'parameters': {
                                'in': "SourceGraphic", 'in2': "blurOut", 'mode': "normal"
                            }
                        },
                        'demo3_svg_shadow_rectangle': {
                            'type': 'svg',
                            'subtype': 'svg_single_tag',
                            'tag': 'rect',
                            'parameters': {
                                'width': "90.0",
                                'height': "90.0",
                                'stroke': "green",
                                'stroke-width': '3',
                                'fill': 'yellow',
                                'filter': 'url(#{box_id}_demo3_svg_defs_filter)'
                            }
                        }
                    },
                    'how': {
                        'mode': 'one box',
                        'text': '[my_text]'
                    },
                    'where': {
                        'box_id': $in.parent_box_id + '.demo',
                        'max_width': 640,
                        'scroll_to_box_id': 'true'
                    },
                    'cache_key': 'svg'
                },
                'data_back': {'step': 'step_end'}
            });
        }

        return {
            'answer': $in.response.answer,
            'message': $in.response.message,
            'data': $in.response.data
        };
    };
}
//# sourceURL=infohub_demo_svg.js