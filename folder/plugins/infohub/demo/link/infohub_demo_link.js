/**
 * Render a link demo for infohub_demo
 *
 * @author      Peter Lembke <info@infohub.se>
 * @version     2019-03-28
 * @since       2018-04-23
 * @copyright   Copyright (c) 2018, Peter Lembke
 * @license     https://opensource.org/licenses/gpl-license.php GPL-3.0-or-later
 * @see         https://github.com/peterlembke/infohub/blob/master/folder/plugins/infohub/demo/link/infohub_demo_link.md Documentation
 * @link        https://infohub.se/ InfoHub main page
 */
function infohub_demo_link() {

    "use strict";

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
            'since': '2018-04-23',
            'version': '2.0.0',
            'checksum': '{{checksum}}',
            'class_name': 'infohub_demo_link',
            'note': 'Render a link demo for infohub_demo',
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
    const _GetCmdFunctions = function() {
        const $list = {
            'create': 'normal'
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
                        'my_text': {
                            'type': 'text',
                            'text': "[h1][titel][/h1]\n [i][ingress][/i]\n [my_list][my_toggle_box]"
                        },
                        'titel': {
                            'type': 'common',
                            'subtype': 'value',
                            'data': _Translate('Welcome to InfoHub Demo Link')
                        },
                        'ingress': {
                            'type': 'common',
                            'subtype': 'value',
                            'data': _Translate('Here are some demos to show you what Infohub can do with links.')
                        },
                        'my_list': {
                            'type': 'common',
                            'subtype': 'list',
                            'class': 'list',
                            'option': [
                                {'label': '[my_event_link]' },
                                {'label': '[my_toggle_link]' },
                                {'label': '[my_external_link]' },
                                {'label': '[my_embed_link]' }
                            ],
                            'css_data': {
                                '.list': 'background-color: green; list-style-type: square;list-style-position: inside;list-style-image: none;'
                            }
                        },
                        'my_event_link': {
                            'type': 'link',
                            'subtype': 'link',
                            'alias': 'demo_link',
                            'data': 'link_my_event',
                            'show': _Translate('A normal event link'),
                            'to_plugin': 'infohub_demo',
                            'class': 'link'
                        },
                        'my_toggle_link': {
                            'type': 'link',
                            'subtype': 'toggle',
                            'show': _Translate('Toggle the image show/hide'),
                            'toggle_alias': 'my_toggle_box'
                        },
                        'my_toggle_box': {
                            'type': 'common',
                            'subtype': 'container',
                            'alias': 'my_toggle_box',
                            'data': '[my_icon]'
                        },
                        'my_external_link': {
                            'type': 'link',
                            'subtype': 'external',
                            'alias': 'my_external_link',
                            'data': 'my_external_link',
                            'show': _Translate('My external link to the ABC club'),
                            'url': 'https://www.abc.se'
                        },
                        'my_embed_link': {
                            'type': 'link',
                            'subtype': 'embed',
                            'show': _Translate('Embedded content - Click to substitute this text'),
                            'embed': '[my_icon]'
                        },
                        'my_icon': {
                            'type': 'common',
                            'subtype': 'svg',
                            'alias': 'my_icon',
                            'data': '[my_icon_asset]'
                        },
                        'my_icon_asset': {
                            'plugin': 'infohub_asset',
                            'type': 'icon',
                            'asset_name': 'link/infohub-logo-mini-done',
                            'plugin_name': 'infohub_demo'
                        }
                    },
                    'how': {
                        'mode': 'one box',
                        'text': '[my_text]'
                    },
                    'where': {
                        'box_id': $in.parent_box_id + '.demo',
                        'max_width': 100,
                        'scroll_to_box_id': 'true'
                    },
                    'cache_key': 'link'
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

    /**
     * Gives you a demo that show when you press link_my_event
     * @param $in
     * @returns {*}
     */
    $functions.push("internal_LinkMyEvent");
    const internal_LinkMyEvent = function ($in)
    {
        const $default = {
            'parent_box_id': ''
        };
        $in = _Default($default, $in);

        const $data = {
            'to': {
                'node': 'client',
                'plugin': 'infohub_render',
                'function': 'create'
            },
            'data': {
                'what': {
                    'my_text': {
                        'type': 'text',
                        'text': "[h1][titel][/h1]\n [i][ingress][/i]\n"
                    },
                    'titel': {
                        'type': 'common',
                        'subtype': 'value',
                        'data': _Translate('The event link')
                    },
                    'ingress': {
                        'type': 'common',
                        'subtype': 'value',
                        'data': _Translate('This is what is rendered when you press the event link. Event links always come to the level 1 plugin in function event_message. From there you can do whatever you want. I wanted to render this.')
                    }
                },
                'how': {
                    'mode': 'one box',
                    'text': '[my_text]'
                },
                'where': {
                    'box_id': $in.parent_box_id + '.demo',
                    'max_width': 320
                }
            },
            'data_back': {'step': 'step_end'}
        };

        return {
            'answer': 'true',
            'message': 'Here are the render data',
            'data': $data
        };
    };
}
//# sourceURL=infohub_demo_link.js