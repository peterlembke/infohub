/**
 * infohub_demo_link
 * Render a link demo for infohub_demo
 *
 * @package     Infohub
 * @subpackage  infohub_demo_link
 * @since       2018-04-23
 * @author      Peter Lembke <info@infohub.se>
 * @license     GPL-3.0-or-later
 * @copyright   Copyright (C) 2010- Peter Lembke
 * @see         https://github.com/peterlembke/infohub/blob/main/folder/plugins/infohub/demo/link/infohub_demo_link.md Documentation
 * @link        https://infohub.se/ InfoHub main page
 */
function infohub_demo_link() {

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
            'since': '2018-04-23',
            'version': '2.0.0',
            'checksum': '{{checksum}}',
            'class_name': 'infohub_demo_link',
            'note': 'Render a link demo for infohub_demo',
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
                'message': 'Nothing to report from infohub_demo_link',
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
                            'text': '[h1][titel][/h1]\n [i][ingress][/i]\n [my_list][my_toggle_box]',
                        },
                        'titel': {
                            'type': 'common',
                            'subtype': 'value',
                            'data': _Translate('WELCOME_TO_INFOHUB_DEMO_LINK')
                        },
                        'ingress': {
                            'type': 'common',
                            'subtype': 'value',
                            'data': _Translate('HERE_ARE_SOME_DEMOS_TO_SHOW_YOU_WHAT_INFOHUB_CAN_DO_WITH_LINKS.')
                        },
                        'my_list': {
                            'type': 'common',
                            'subtype': 'list',
                            'option': [
                                {'label': '[my_event_link]'},
                                {'label': '[my_toggle_link]'},
                                {'label': '[my_external_link]'},
                                {'label': '[my_embed_link]'},
                            ],
                        },
                        'my_event_link': {
                            'type': 'link',
                            'subtype': 'link',
                            'alias': 'demo_link',
                            'data': 'link_my_event',
                            'show': _Translate('A_NORMAL_EVENT_LINK'),
                            'to_plugin': 'infohub_demo',
                            'class': 'link',
                        },
                        'my_toggle_link': {
                            'type': 'link',
                            'subtype': 'toggle',
                            'show': _Translate('TOGGLE_THE_IMAGE_SHOW/HIDE'),
                            'toggle_alias': 'my_toggle_box'
                        },
                        'my_toggle_box': {
                            'type': 'common',
                            'subtype': 'container',
                            'alias': 'my_toggle_box',
                            'data': '[my_icon]',
                        },
                        'my_external_link': {
                            'type': 'link',
                            'subtype': 'external',
                            'alias': 'my_external_link',
                            'data': 'my_external_link',
                            'show': _Translate('MY_EXTERNAL_LINK_TO_THE_ABC_CLUB'),
                            'url': 'https://www.abc.se'
                        },
                        'my_embed_link': {
                            'type': 'link',
                            'subtype': 'embed',
                            'show': _Translate('EMBEDDED_CONTENT_-_CLICK_TO_SUBSTITUTE_THIS_TEXT'),
                            'embed': '[my_icon]'
                        },
                        'my_icon': {
                            'type': 'common',
                            'subtype': 'svg',
                            'alias': 'my_icon',
                            'data': '[my_icon_asset]',
                        },
                        'my_icon_asset': {
                            'plugin': 'infohub_asset',
                            'type': 'icon',
                            'asset_name': 'link/infohub-logo-mini-done',
                            'plugin_name': 'infohub_demo',
                        },
                    },
                    'how': {
                        'mode': 'one box',
                        'text': '[my_text]',
                    },
                    'where': {
                        'box_id': $in.parent_box_id + '.demo',
                        'max_width': 100,
                        'scroll_to_box_id': 'true',
                    },
                    'cache_key': 'link',
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

    /**
     * Gives you a demo that show when you press link_my_event
     * @param $in
     * @returns {*}
     */
    $functions.push('internal_LinkMyEvent');
    const internal_LinkMyEvent = function($in = {}) {
        const $default = {
            'parent_box_id': '',
        };
        $in = _Default($default, $in);

        const $data = {
            'to': {
                'node': 'client',
                'plugin': 'infohub_render',
                'function': 'create',
            },
            'data': {
                'what': {
                    'my_text': {
                        'type': 'text',
                        'text': '[h1][titel][/h1]\n [i][ingress][/i]\n',
                    },
                    'titel': {
                        'type': 'common',
                        'subtype': 'value',
                        'data': _Translate('THE_EVENT_LINK')
                    },
                    'ingress': {
                        'type': 'common',
                        'subtype': 'value',
                        'data': _Translate('THIS_IS_WHAT_IS_RENDERED_WHEN_YOU_PRESS_THE_EVENT_LINK.') + ' ' +
                            _Translate('EVENT_LINKS_ALWAYS_COME_TO_THE_LEVEL_1_PLUGIN_IN_FUNCTION_EVENT_MESSAGE.') + ' ' +
                            _Translate('FROM_THERE_YOU_CAN_DO_WHATEVER_YOU_WANT.') + ' ' +
                            _Translate('I_WANTED_TO_RENDER_THIS.')
                    }
                },
                'how': {
                    'mode': 'one box',
                    'text': '[my_text]',
                },
                'where': {
                    'box_id': $in.parent_box_id + '.demo',
                    'max_width': 320,
                },
            },
            'data_back': {'step': 'step_end'},
        };

        return {
            'answer': 'true',
            'message': 'Here are the render data',
            'data': $data,
        };
    };
}

//# sourceURL=infohub_demo_link.js