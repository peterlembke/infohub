/**
 * infohub_demo_advancedlist
 * Collection of demos to demonstrate InfoHub Client Render and View
 *
 * @package     Infohub
 * @subpackage  infohub_demo_advancedlist
 * @since       2017-02-11
 * @author      Peter Lembke <info@infohub.se>
 * @license     GPL-3.0-or-later
 * @copyright   Copyright (C) 2010- Peter Lembke
 * @see         https://github.com/peterlembke/infohub/blob/main/folder/plugins/infohub/demo/advancedlist/infohub_demo_advancedlist.md Documentation
 * @link        https://infohub.se/ InfoHub main page
 */
function infohub_demo_advancedlist() {

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
            'since': '2017-02-11',
            'version': '1.0.0',
            'checksum': '{{checksum}}',
            'class_name': 'infohub_demo_advancedlist',
            'note': 'Collection of demos to demonstrate InfoHub Client Render and View',
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
            'click_advanced_list': 'normal',
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
                'message': '',
            },
        };
        $in = _Default($default, $in);

        let $option = []; // This is an array that we will push objects to.

        if ($in.step === 'step_start') {

            $classTranslations = $in.translations;

            const $nodes = {
                'clothes': _Translate('CLOTHES'),
                'clothes_foot': _Translate('FOOT'),
                'clothes_foot_socks': _Translate('SOCKS'),
                'clothes_leg': _Translate('LEG'),
                'clothes_leg_jeans': _Translate('JEANS'),
                'clothes_body': _Translate('BODY'),
                'clothes_body_tshirt': _Translate('T-SHIRT'),
                'clothes_body_jacket': _Translate('JACKET'),
                'clothes_hand': _Translate('HAND'),
                'clothes_hand_mittens': _Translate('MITTENS'),
                'clothes_head': _Translate('HEAD'),
                'clothes_head_hat': _Translate('HAT'),
                'clothes_head_helmet': _Translate('HELMET'),
                'clothes_head_helmet_hockey': _Translate('HOCKEY'),
                'clothes_head_helmet_bicycle': _Translate('BICYCLE')
            };

            for (let $level in $nodes) {
                if ($nodes.hasOwnProperty($level)) {
                    const $label = $nodes[$level];
                    const $id = '{box_id}_' + $level + '.link';
                    const $idData = 'id="' + $id + '" event_data="advancedlist|advanced_list" level="' + $level + '"';

                    // You see that the click event goes to infohub_demo, and there it must be handled
                    const $to = ' to_node="client" to_plugin="infohub_demo" to_function="click"';
                    const $onClick = ' onclick="go(\'infohub_render\',\'click\',\'' + $id + '\')"';

                    // In this case the event_message function will check what renderer you use and act on that.
                    const $otherParams = ' href="#header" class="link" renderer="advancedlist" type="link"';
                    // You can put any parameters you like in the string above, and they will show up in the event_message function.

                    const $html = '<a' + $onClick + $idData + $to + $otherParams + '>' + $label + '</a>';

                    $option.push({
                        'label': $html,
                        'level': $level,
                    });
                }
            }

            $in.step = 'step_render';
        }

        if ($in.step === 'step_render') {
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_render',
                    'function': 'create',
                },
                'data': {
                    'what': {
                        'my_presentation_box': {
                            'plugin': 'infohub_rendermajor',
                            'type': 'presentation_box',
                            'head_label': _Translate('NAVIGATION'),
                            'foot_text': _Translate('THIS_IS_AN_EXAMPLE_OF_AN_ADVANCED_LIST.') + ' ' +
                                _Translate('YOU_CAN_EXPAND_THE_NODES_AND_CLICK_ON_THE_LABELS.'),
                            'content_data': '[my_list]'
                        },
                        'my_list': {
                            'plugin': 'infohub_renderadvancedlist',
                            'type': 'advanced_list',
                            'subtype': 'list',
                            'option': $option,
                            'separator': '_',
                        },
                        'my_view_box': {
                            'plugin': 'infohub_rendermajor',
                            'type': 'presentation_box',
                            'head_label': _Translate('VIEW'),
                            'foot_text': '',
                            'content_data': _Translate('VIEWING_AREA')
                        }
                    },
                    'how': {
                        'mode': 'one box',
                        'text': '[my_presentation_box][my_view_box]',
                    },
                    'where': {
                        'box_id': $in.parent_box_id + '.demo',
                        'max_width': 100,
                        'scroll_to_box_id': 'true',
                    },
                    'cache_key': 'advancedlist',
                },
                'data_back': {
                    'step': 'step_end',
                },
            });

        }

        return {
            'answer': $in.response.answer,
            'message': $in.response.message,
        };
    };

    /**
     * Handle the demo: advanced list
     * @version 2019-03-28
     * @since 2018-09-26
     * @author Peter Lembke
     */
    $functions.push('click_advanced_list');
    const click_advanced_list = function($in = {}) {
        const $default = {
            'step': 'step_start',
            'level': '',
            'box_id': '',
            'renderer': '',
        };
        $in = _Default($default, $in);

        if ($in.step === 'step_start') {
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_view',
                    'function': 'box_data',
                },
                'data': {
                    'box_id': $in.box_id + '_my_view_box_content',
                    'box_data': $in.level,
                },
                'data_back': {
                    'step': 'step_start_response',
                },
            });
        }

        return {
            'answer': 'true',
            'message': 'Advanced list click done',
        };

    };
}

//# sourceURL=infohub_demo_advancedlist.js