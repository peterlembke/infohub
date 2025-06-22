/**
 * infohub_demo_frog
 * Render a frog demo for infohub_demo
 *
 * @package     Infohub
 * @subpackage  infohub_demo_frog
 * @since       2018-04-21
 * @author      Peter Lembke <info@infohub.se>
 * @license     GPL-3.0-or-later
 * @copyright   Copyright (C) 2010- Peter Lembke
 */
function infohub_demo_frog() {

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
            'since': '2018-04-21',
            'version': '2.0.0',
            'checksum': '{{checksum}}',
            'class_name': 'infohub_demo_frog',
            'note': 'Render a frog demo for infohub_demo',
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
            'click_frog': 'normal',
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
                'message': 'Nothing to report from infohub_demo_form2',
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
                        'instructions_box': {
                            'plugin': 'infohub_rendermajor',
                            'type': 'presentation_box',
                            'head_label': _Translate('INSTRUCTIONS'),
                            'content_data': '[my_foot_text]',
                            'content_embed_new_tab': '[my_external_link]',
                        },
                        'result_box': {
                            'plugin': 'infohub_rendermajor',
                            'type': 'presentation_box',
                            'head_label': _Translate('RESULT'),
                            'foot_text': _Translate('WHEN_YOU_DO_A_MISTAKE_IN_YOUR_RENDERING_CODE_THEN_THE_FROG_SHOWS_UP_AS_A_PLACEHOLDER.'),
                            'content_data': _Translate('HAVE_YOU_SEEN_ANY_FROGS?'),
                        },
                        'my_foot_text': {
                            'type': 'text',
                            'text': _Translate('I_MADE_A_FROG_IS_A_SWEDISH_EXPRESSION_FOR_MAKING_A_MISTAKE.') + ' ' +
                                _Translate('JAG_GJORDE_EN_GRODA.') + ' ' +
                                _Translate('IF_YOU_RENDER_AN_OBJECT_WITH_AN_UNKNOWN_TYPE_OR_SUBTYPE_THEN_A_FROG_APPEAR_INSTEAD.')
                        },
                        'my_external_link': {
                            'type': 'link',
                            'subtype': 'external',
                            'alias': 'my_external_link',
                            'data': 'my_external_link',
                            'show': 'Wiktionary',
                            'url': 'https://sv.wiktionary.org/wiki/g%C3%B6ra_en_groda',
                        },
                        'my_menu': {
                            'plugin': 'infohub_rendermenu',
                            'type': 'menu',
                            'head_label': _Translate('MAKE_A_FROG'),
                            'options': {
                                'correct': {
                                    'alias': 'correct_link',
                                    'event_data': 'frog|frog|frog_correct', // demo_frog | click_frog
                                    'button_label': _Translate('CORRECT_WAY'),
                                    'to_plugin': 'infohub_demo',
                                    'to_function': 'click',
                                },
                                'mistake1': {
                                    'alias': 'mistake1_link',
                                    'event_data': 'frog|frog|frog_mistake1',
                                    'button_label': _Translate('MISTAKE_#1_-_WRONG_SUBTYPE'),
                                    'to_plugin': 'infohub_demo',
                                    'to_function': 'click',
                                },
                                'mistake2': {
                                    'alias': 'mistake2_link',
                                    'event_data': 'frog|frog|frog_mistake2',
                                    'button_label': _Translate('MISTAKE_#2_-_WRONG_TYPE'),
                                    'to_plugin': 'infohub_demo',
                                    'to_function': 'click',
                                },
                            },
                        },
                    },
                    'how': {
                        'mode': 'one box',
                        'text': '[my_menu][instructions_box][result_box]',
                    },
                    'where': {
                        'box_id': $in.parent_box_id + '.demo',
                        'max_width': 320,
                        'scroll_to_box_id': 'true',
                    },
                    'cache_key': 'frog',
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
     * Handle the events from the frog buttons
     * @version 2019-03-28
     * @since 2019-01-09
     * @author Peter Lembke
     */
    $functions.push('click_frog');
    const click_frog = function($in = {}) {
        const $default = {
            'step': 'step_start',
            'event_data': '',
            'box_id': '',
            'data_back': {},
        };
        $in = _Default($default, $in);

        let $data;

        if ($in.step === 'step_start') {
            $data = {
                'frog_correct': {
                    'type': 'frog',
                    'subtype': '',
                    'text': _Translate('CORRECT,_THE_FROG_IS_RENDERED_BY_CALLING_THE_RENDER_FROG_PLUGIN.'),
                    'ok': 'true',
                },
                'frog_mistake1': {
                    'type': 'common',
                    'subtype': 'fizbaz',
                    'text': _Translate('MISTAKE_#1,_THE_FROG_WERE_RENDERED_BY_CALLING_RENDER_COMMON_WITH_THE_NONE_EXISTING_SUBTYPE_FIZBAZ.') + ' ' +
                        _Translate('THAT_GIVES_A_FROG_AND_AN_ERROR_MESSAGE_ON_TOP.'),
                    'ok': 'false',
                },
                'frog_mistake2': {
                    'type': 'foobar',
                    'subtype': '',
                    'text': _Translate('MISTAKE_#2,_THE_FROG_WERE_RENDERED_BY_CALLING_THE_NONE_EXISTING_PLUGIN_FOOBAR.') + ' ' +
                        _Translate('THAT_GIVES_A_FROG_AND_AN_ERROR_MESSAGE_ON_TOP.'),
                    'ok': 'false',
                },
            };

            if (_IsSet($data[$in.event_data]) === 'true') {
                $in.step = 'step_make_frog';
            }
        }

        if ($in.step === 'step_make_frog') {
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_render',
                    'function': 'create',
                },
                'data': {
                    'what': {
                        'my_frog': {
                            'type': $data[$in.event_data].type,
                            'subtype': $data[$in.event_data].subtype,
                        },
                    },
                    'how': {
                        'mode': 'one box',
                        'text': '[my_frog]',
                    },
                    'where': {
                        'box_id': $in.box_id + '_result_box_content',
                        'max_width': 640,
                        'scroll_to_box_id': 'true',
                    },
                },
                'data_back': {
                    'box_id': $in.box_id,
                    'text': $data[$in.event_data].text,
                    'ok': $data[$in.event_data].ok,
                    'step': 'step_write_text',
                },
            });
        }

        if ($in.step === 'step_write_text') {
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_view',
                    'function': 'set_text',
                },
                'data': {
                    'id': $in.data_back.box_id + '_result_box_foot',
                    'text': $in.data_back.text,
                },
                'data_back': {
                    'ok': $in.data_back.ok,
                    'step': 'step_end',
                },
            });
        }

        return {
            'answer': 'true',
            'message': 'Frog is made',
            'ok': $in.data_back.ok,
        };
    };
}

//# sourceURL=infohub_demo_frog.js