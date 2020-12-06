/**
 * Collection of demos to demonstrate InfoHub Client Render and View
 *
 * @author      Peter Lembke <info@infohub.se>
 * @version     2019-03-28
 * @since       2017-02-11
 * @copyright   Copyright (c) 2017, Peter Lembke
 * @license     https://opensource.org/licenses/gpl-license.php GPL-3.0-or-later
 * @see         https://github.com/peterlembke/infohub/blob/master/folder/plugins/infohub/demo/advancedlist/infohub_demo_advancedlist.md Documentation
 * @link        https://infohub.se/ InfoHub main page
 */
function infohub_demo_advancedlist() {

    "use strict";

// include "infohub_base.js"

    $functions.push('_Version');
    /**
     * Version information, used by the version function
     * @returns {{date: string, note: string, 'SPDX-License-Identifier': string, checksum: string, version: string, class_name: string, since: string, status: string}}
     * @private
     */
    const _Version = function () {
        return {
            'date': '2019-03-28',
            'since': '2017-02-11',
            'version': '1.0.0',
            'checksum': '{{checksum}}',
            'class_name': 'infohub_demo_advancedlist',
            'note': 'Collection of demos to demonstrate InfoHub Client Render and View',
            'status': 'normal',
            'SPDX-License-Identifier': 'GPL-3.0-or-later'
        };
    };

    $functions.push('_GetCmdFunctions');
    /**
     * List with all public functions you can call
     * @returns {*}
     * @private
     */
    const _GetCmdFunctions = function () {
        const $list = {
            'create': 'normal',
            'click_advanced_list': 'normal'
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
     * @version 2016-10-16
     * @since   2016-10-16
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
                'message': ''
            }
        };
        $in = _Default($default, $in);

        let $option = []; // This is an array that we will push objects to.

        if ($in.step === 'step_start') {

            $classTranslations = $in.translations;

            const $nodes = {
                'clothes': _Translate('Clothes'),
                'clothes_foot': _Translate('Foot'),
                'clothes_foot_socks': _Translate('Socks'),
                'clothes_leg': _Translate('Leg'),
                'clothes_leg_jeans': _Translate('Jeans'),
                'clothes_body': _Translate('Body'),
                'clothes_body_tshirt': _Translate('T-Shirt'),
                'clothes_body_jacket': _Translate('Jacket'),
                'clothes_hand': _Translate('Hand'),
                'clothes_hand_mittens': _Translate('Mittens'),
                'clothes_head': _Translate('Head'),
                'clothes_head_hat': _Translate('Hat'),
                'clothes_head_helmet': _Translate('Helmet'),
                'clothes_head_helmet_hockey': _Translate('Hockey'),
                'clothes_head_helmet_bicycle': _Translate('Bicycle')
            };

            for (let $level in $nodes)
            {
                if ($nodes.hasOwnProperty($level))
                {
                    const $label = $nodes[$level];
                    const $id = "{box_id}_" + $level + ".link";
                    const $idData = 'id="' + $id + '" event_data="advancedlist|advanced_list" level="' + $level + '"';

                    // You see that the click event goes to infohub_demo, and there it must be handled
                    const $to = ' to_node="client" to_plugin="infohub_demo" to_function="click"';
                    const $onClick = ' onclick="go(\'infohub_render\',\'click\',\'' + $id + '\')"';

                    // In this case the event_message function will check what renderer you use and act on that.
                    const $otherParams = ' href="#header" class="link" renderer="advancedlist" type="link"';
                    // You can put any parameters you like in the string above and they will show up in the event_message function.

                    const $html = '<a'+ $onClick + $idData + $to + $otherParams + '>' + $label + '</a>';

                    $option.push({
                        'label': $html,
                        'level': $level
                    });
                }
            }
            
            $in.step = 'step_render';
        }
        
        if ($in.step === 'step_render') 
        {
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_render',
                    'function': 'create'
                },
                'data': {
                    'what': {
                        'my_presentation_box': {
                            'plugin': 'infohub_rendermajor',
                            'type': 'presentation_box',
                            'head_label': _Translate('Navigation'),
                            'foot_text': _Translate('This is an example of an advanced list. You can expand the nodes and click on the labels.'),
                            'content_data': '[my_list]'
                        },
                        'my_list': {
                            'plugin': 'infohub_renderadvancedlist',
                            'type': 'advanced_list',
                            'subtype': 'list',
                            'option': $option,
                            'separator': '_'
                        },
                        'my_view_box': {
                            'plugin': 'infohub_rendermajor',
                            'type': 'presentation_box',
                            'head_label': _Translate('View'),
                            'foot_text': '',
                            'content_data': _Translate('Viewing area')
                        }
                    },
                    'how': {
                        'mode': 'one box',
                        'text': '[my_presentation_box][my_view_box]'
                    },
                    'where': {
                        'box_id': $in.parent_box_id + '.demo',
                        'max_width': 100,
                        'scroll_to_box_id': 'true'
                    },
                    'cache_key': 'advancedlist'
                },
                'data_back': {
                    'step': 'step_end'
                }
            });

        }

        return {
            'answer': $in.response.answer,
            'message': $in.response.message
        };
    };

    /**
     * Handle the demo: advanced list
     * @version 2019-03-28
     * @since 2018-09-26
     * @author Peter Lembke
     */
    $functions.push("click_advanced_list");
    const click_advanced_list = function ($in)
    {
        const $default = {
            'step': 'step_start',
            'level': '',
            'box_id': '',
            'renderer': ''
        };
        $in = _Default($default, $in);

        if ($in.step === 'step_start') {
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_view',
                    'function': 'box_data'
                },
                'data': {
                    'box_id': $in.box_id + '_my_view_box_content',
                    'box_data': $in.level
                },
                'data_back': {
                    'step': 'step_start_response'
                }
            });
        }

        return {
            'answer': 'true',
            'message': 'Advanced list click done'
        };

    };
}
//# sourceURL=infohub_demo_advancedlist.js