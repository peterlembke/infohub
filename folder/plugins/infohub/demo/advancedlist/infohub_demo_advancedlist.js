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
function infohub_demo_advancedlist() {

// include "infohub_base.js"

    // ***********************************************************
    // * jshint.com options to suppress some warnings
    // ***********************************************************

    /*jshint evil:true */
    /*jshint devel:true */
    /*jslint browser: true, evil: true, plusplus: true, todo: true */

    // ***********************************************************
    // * your private class variables below, only declare with var
    // ***********************************************************

    var _Version = function () {
        return {
            'date': '2019-03-28',
            'since': '2017-02-11',
            'version': '1.0.0',
            'checksum': '{{checksum}}',
            'class_name': 'infohub_demo_advancedlist',
            'note': 'Collection of demos to demonstrate InfoHub Client Render and View',
            'status': 'normal',
            'license_name': 'GNU GPL 3 or later'
        };
    };

    var _GetCmdFunctions = function () {
        return {
            'create': 'normal',
            'click_advanced_list': 'normal'
        };
    };

    var $classTranslations = {};

    /**
     * Translate - Substitute a string for another string using a class local object
     * @param {type} $string
     * @returns string
     */
    $functions.push('_Translate');
    var _Translate = function ($string) 
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
     * @version 2016-10-16
     * @since   2016-10-16
     * @author  Peter Lembke
     */
    $functions.push('create');
    var create = function ($in) {
        "use strict";
        var $default = {
            'parent_box_id': '',
            'translations': {},
            'step': 'step_start',
            'response': {
                'answer': 'false',
                'message': ''
            }
        };
        $in = _Default($default, $in);

        if ($in.step === 'step_start') {
            $classTranslations = $in.translations;

            var $data, $option, $html, $level, $nodes, $label, $id, $to, $parts, $otherParams, $onClick, $idData,

            $nodes = {
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

            $option = []; // This is an array that we will push objects to.

            for ($level in $nodes)
            {
                if ($nodes.hasOwnProperty($level))
                {
                    $label = $nodes[$level];
                    $id = "{box_id}_" + $level + ".link";
                    $idData = 'id="' + $id + '" event_data="advancedlist|advanced_list" level="' + $level + '"';

                    // You see that the click event goes to infohub_demo, and there it must be handled
                    $to = ' to_node="client" to_plugin="infohub_demo" to_function="click"';
                    $onClick = ' onclick="go(\'infohub_render\',\'click\',\'' + $id + '\')"';

                    // In this case the event_message function will check what renderer you use and act on that.
                    $otherParams = ' href="#header" class="link" renderer="advancedlist" type="link"';
                    // You can put any parameters you like in the string above and they will show up in the event_message function.

                    $html = '<a'+ $onClick + $idData + $to + $otherParams + '>' + $label + '</a>';

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
                    }
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
    var click_advanced_list = function ($in) {
        "use strict";
        var $default = {
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