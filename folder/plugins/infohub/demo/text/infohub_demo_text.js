/**
 * infohub_demo_text
 * Render a text demo for infohub_demo
 *
 * @package     Infohub
 * @subpackage  infohub_demo_text
 * @since       2018-05-13
 * @author      Peter Lembke <info@infohub.se>
 * @license     GPL-3.0-or-later
 * @copyright   Copyright (C) 2010- Peter Lembke
 */
function infohub_demo_text() {

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
            'date': '2019-03-28',
            'since': '2018-05-13',
            'version': '2.0.0',
            'checksum': '{{checksum}}',
            'class_name': 'infohub_demo_text',
            'note': 'Render a text demo for infohub_demo',
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
            'parent_box_id': '',
            'translations': {},
            'step': 'step_start',
            'response': {
                'answer': 'false',
                'message': 'Nothing to report from infohub_demo_map',
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
                            'text': '[h1][titel][/h1]\n [i][ingress][/i]\n[full_text]',
                            'css_data': {
                                'p:first-letter': 'color: #FFFFFF; font-size: 2em;',
                            },
                        },
                        'titel': {
                            'type': 'common',
                            'subtype': 'value',
                            'data': _Translate('WELCOME_TO_INFOHUB_DEMO_TEXT')
                        },
                        'ingress': {
                            'type': 'common',
                            'subtype': 'value',
                            'data': _Translate('PLUGIN_INFOHUB_RENDER_TEXT_IS_USED_IN_THIS_DEMO._YOU_CAN_USE_TEXT_TO_BIND_TOGETHER_RENDERED_OBJECTS.')
                        },
                        'full_text': {
                            'type': 'common',
                            'subtype': 'join',
                            'data0': '[columns]',
                            'data1': _Translate('THE_TEXT_RENDERER_IS_THE_MOST_IMPORTANT_RENDERER_OF_THEM_ALL.'),
                            'data2': _Translate('IT_ACTS_AS_THE_GLUE_THAT_COMBINE_TOGETHER_ALL_THE_OTHER_RENDERED_PIECES.'),
                            'data3': '[h2]' + _Translate('BUILT_IN_COMMANDS') + '[/h2] ',
                            'data4': _Translate('YOU_CAN_DO_THIS') + ' [:-)][:-(][(c)][(r)][tel][eur], ',
                            'data5': _Translate('YOU_CAN_ALSO_USE') + ' [b]Bold[/b], [i]Italic[/i], [u]Underline[/u], ',
                            'data6': _Translate('OR_A_LINE_LIKE_THIS') + ' [line][br]',
                            'data7': '[h2]' + _Translate('COLUMNS') + '[/h2]',
                            'data8': _Translate('YOU_CAN_ACTIVATE_COLUMNS.'),
                            'data9': _Translate('THEN_YOU_AUTOMATICALLY_GET_COLUMNS_THAT_YOUR_TEXT_CAN_FLOW_IN.'),
                            'data10': _Translate('YOU_CAN') + ' [light]' + _Translate('HIGHLIGHT_PORTIONS_OF_THE_TEXT_LIKE_THIS') + '[/light] ',
                            'data11': _Translate('AND_YOU_CAN_INCLUDE_OTHER_ELEMENTS_IN_YOUR_TEXT,_FOR_EXAMPLE:') + ' [my_external_link].',
                            'data12': '[h2]' + _Translate('ZOOM_LEVEL') + '[/h2]',
                            'data13': _Translate('YOU_CAN_ZOOM_THE_VIEW_IN_YOUR_BROWSER.'),
                            'data14': _Translate('WHEN_YOU_DO_THAT_AND_THE_SPACE_IS_TO_NARROW_FOR_THE_COLUMN,_THEN_IT_REDUCES_THE_NUMBER_OF_COLUMNS.'),
                            'data15': _Translate('YOU_ALWAYS_GET_A_READABLE_VIEW_IN_ALL_ZOOM_LEVELS.'),
                            'data16': '[h2]' + _Translate('SECTIONS') + '[/h2]',
                            'data17': _Translate('YOU_SEE_THAT_THE_H2_SECTIONS_DO_NOT_WRAP_NICE_IN_THE_COLUMNS.'),
                            'data18': _Translate('THERE_ARE_CSS_COMMANDS_TO_FIX_THAT_IN_MOST_BROWSERS._I_HAVE_THAT_ON_MY_TODO_LIST.'),
                            'data19': '[/columns]'
                        },
                        'my_external_link': {
                            'type': 'link',
                            'subtype': 'external',
                            'alias': 'my_external_link',
                            'data': 'my_external_link',
                            'show': _Translate('MY_EXTERNAL_LINK_TO_THE_ABC_CLUB'),
                            'url': 'https://www.abc.se'
                        },
                        'light': {
                            'type': 'common',
                            'subtype': 'containerStart',
                            'class': 'light',
                            'tag': 'span',
                        },
                        '/light': {
                            'type': 'common',
                            'subtype': 'containerStop',
                            'tag': 'span',
                        },
                    },
                    'how': {
                        'mode': 'one box',
                        'text': '[my_text]',
                    },
                    'where': {
                        'box_id': $in.parent_box_id + '.demo',
                        'max_width': 100, // means 100% so that the columns show properly
                        'scroll_to_box_id': 'true',
                    },
                    'cache_key': 'text',
                },
                'data_back': {'step': 'step_end'},
            });
        }

        return {
            'answer': $in.response.answer,
            'message': $in.response.message,
        };
    };
}

//# sourceURL=infohub_demo_text.js