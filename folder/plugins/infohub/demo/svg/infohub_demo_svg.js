/**
 * Render a SVG demo for infohub_demo
 *
 * @author      Peter Lembke <info@infohub.se>
 * @version     2020-04-19
 * @since       2020-04-19
 * @copyright   Copyright (c) 2020, Peter Lembke
 * @license     https://opensource.org/licenses/gpl-license.php GPL-3.0-or-later
 * @see         https://github.com/peterlembke/infohub/blob/master/folder/plugins/infohub/demo/svg/infohub_demo_svg.md Documentation
 * @link        https://infohub.se/ InfoHub main page
 */
function infohub_demo_svg() {

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
            'date': '2020-04-19',
            'since': '2020-04-19',
            'version': '1.0.0',
            'checksum': '{{checksum}}',
            'class_name': 'infohub_demo_svg',
            'note': 'Render a SVG demo for infohub_demo',
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
    // * Can only be reached trough cmd()
    // ***********************************************************

    /**
     * Get instructions and create the message to InfoHub View
     * @version 2020-04-19
     * @since   2020-04-19
     * @author  Peter Lembke
     */
    $functions.push('create');
    const create = function($in) {
        const $default = {
            'parent_box_id': '',
            'translations': {},
            'step': 'step_start',
            'response': {
                'answer': 'false',
                'message': 'Nothing to report from infohub_demo_svg',
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
                        'my_text': {
                            'type': 'text',
                            'text': '[h1][titel][/h1]\n [i][ingress][/i]\n[demo1][demo2][demo3]\n',
                        },
                        'titel': {
                            'type': 'common',
                            'subtype': 'value',
                            'data': _Translate('WELCOME_TO_INFOHUB_DEMO_SVG')
                        },
                        'ingress': {
                            'type': 'common',
                            'subtype': 'value',
                            'data': _Translate('HERE_ARE_SOME_DEMOS_TO_SHOW_YOU_WHAT_INFOHUB_CAN_DO_WITH_INFOHUB_SVG._IF_YOU_INSTEAD_WANT_TO_USE_EXISTING_SVG_FILES_THEN_HAVE_A_LOOK_AT_INFOHUB_RENDER_COMMON.')
                        },
                        'demo1': {
                            'plugin': 'infohub_rendermajor',
                            'type': 'presentation_box',
                            'head_label': _Translate('RECTANGE'),
                            'foot_text': _Translate('A_SIMPLE_RECTANGLE'),
                            'content_data': '[demo1_svg_start][demo1_svg_rectangle][demo1_svg_stop]'
                        },
                        'demo1_svg_start': {
                            'type': 'svg',
                            'subtype': 'svg_start',
                            'width': 140.0,
                            'height': 140.0,
                        },
                        'demo1_svg_rectangle': {
                            'type': 'svg',
                            'subtype': 'svg_single_tag',
                            'tag': 'rect',
                            'parameters': {
                                'x': '20',
                                'y': '20',
                                'rx': '20',
                                'ry': '20',
                                'width': '100',
                                'height': '100',
                                'style': 'fill:red;stroke:black;stroke-width:5;opacity:0.5',
                            },
                        },
                        'demo1_svg_stop': {
                            'type': 'svg',
                            'subtype': 'svg_stop',
                        },
                        'demo2': {
                            'plugin': 'infohub_rendermajor',
                            'type': 'presentation_box',
                            'head_label': _Translate('CIRCLE'),
                            'foot_text': _Translate('A_SIMPLE_CIRCLE'),
                            'content_data': '[demo1_svg_start][demo2_svg_circle][demo1_svg_stop]'
                        },
                        'demo2_svg_circle': {
                            'type': 'svg',
                            'subtype': 'svg_single_tag',
                            'tag': 'circle',
                            'parameters': {
                                'cx': '70.0',
                                'cy': '70.0',
                                'r': '30.0',
                                'style': 'display:inline;fill:#ff00ff;fill-opacity:0.5;stroke:#00ffff;stroke-width:10.0;',
                            },
                        },
                        'demo3': {
                            'plugin': 'infohub_rendermajor',
                            'type': 'presentation_box',
                            'head_label': _Translate('SHADOW'),
                            'foot_text': _Translate('HOW_TO_DO_SHADOWS'),
                            'content_data': '[demo1_svg_start][demo3_svg_shadow_defs][demo3_svg_shadow_rectangle][demo1_svg_stop]'
                        },
                        'demo3_svg_shadow_defs': {
                            'type': 'svg',
                            'subtype': 'svg_content_tag',
                            'tag': 'defs',
                            'content': '[demo3_svg_defs_filter]',
                        },
                        'demo3_svg_defs_filter': {
                            'type': 'svg',
                            'subtype': 'svg_content_tag',
                            'tag': 'filter',
                            'content': '[demo3_svg_offset][demo3_svg_gaussian][demo3_svg_blend]',
                            'parameters': {
                                'x': '0',
                                'y': '0',
                                'width': '200%',
                                'height': '200%',
                            },
                        },
                        'demo3_svg_offset': {
                            'type': 'svg',
                            'subtype': 'svg_single_tag',
                            'tag': 'feOffset',
                            'parameters': {
                                'result': 'offOut',
                                'in': 'SourceAlpha',
                                'dx': '20',
                                'dy': '20',
                            },
                        },
                        'demo3_svg_gaussian': {
                            'type': 'svg',
                            'subtype': 'svg_single_tag',
                            'tag': 'feGaussianBlur',
                            'parameters': {
                                'result': 'blurOut',
                                'in': 'offOut',
                                'stdDeviation': '10',
                            },
                        },
                        'demo3_svg_blend': {
                            'type': 'svg',
                            'subtype': 'svg_single_tag',
                            'tag': 'feBlend',
                            'parameters': {
                                'in': 'SourceGraphic',
                                'in2': 'blurOut',
                                'mode': 'normal',
                            },
                        },
                        'demo3_svg_shadow_rectangle': {
                            'type': 'svg',
                            'subtype': 'svg_single_tag',
                            'tag': 'rect',
                            'parameters': {
                                'width': '90.0',
                                'height': '90.0',
                                'stroke': 'green',
                                'stroke-width': '3',
                                'fill': 'yellow',
                                'filter': 'url(#{box_id}_demo3_svg_defs_filter)',
                            },
                        },
                    },
                    'how': {
                        'mode': 'one box',
                        'text': '[my_text]',
                    },
                    'where': {
                        'box_id': $in.parent_box_id + '.demo',
                        'max_width': 640,
                        'scroll_to_box_id': 'true',
                    },
                    'cache_key': 'svg',
                },
                'data_back': {'step': 'step_end'},
            });
        }

        return {
            'answer': $in.response.answer,
            'message': $in.response.message,
            'data': $in.response.data,
        };
    };
}

//# sourceURL=infohub_demo_svg.js