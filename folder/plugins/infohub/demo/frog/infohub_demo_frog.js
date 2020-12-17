/**
 * Render a frog demo for infohub_demo
 *
 * @author      Peter Lembke <info@infohub.se>
 * @version     2019-03-28
 * @since       2018-04-21
 * @copyright   Copyright (c) 2018, Peter Lembke
 * @license     https://opensource.org/licenses/gpl-license.php GPL-3.0-or-later
 * @see         https://github.com/peterlembke/infohub/blob/master/folder/plugins/infohub/demo/frog/infohub_demo_frog.md Documentation
 * @link        https://infohub.se/ InfoHub main page
 */
function infohub_demo_frog() {

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
            'since': '2018-04-21',
            'version': '2.0.0',
            'checksum': '{{checksum}}',
            'class_name': 'infohub_demo_frog',
            'note': 'Render a frog demo for infohub_demo',
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
            'create': 'normal',
            'click_frog': 'normal'
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
                'message': 'Nothing to report from infohub_demo_form2'
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
                        'instructions_box': {
                            'plugin': 'infohub_rendermajor',
                            'type': 'presentation_box',
                            'head_label': _Translate('Instructions'),
                            'content_data': '[my_foot_text]',
                            'content_embed_new_tab': '[my_external_link]'
                        },
                        'result_box': {
                            'plugin': 'infohub_rendermajor',
                            'type': 'presentation_box',
                            'head_label': _Translate('Result'),
                            'foot_text': _Translate('When you do a misstake in your rendering code then the frog shows up as a placeholder.'),
                            'content_data': _Translate('Have you seen any frogs?'),
                        },
                        'my_foot_text': {
                            'type': 'text',
                            'text': _Translate('I made a frog is a Swedish expression for making a mistake. Jag gjorde en groda. If you render an object with an unknown type or subtype then a frog appear instead.')
                        },
                        'my_external_link': {
                            'type': 'link',
                            'subtype': 'external',
                            'alias': 'my_external_link',
                            'data': 'my_external_link',
                            'show': 'Wiktionary',
                            'url': 'https://sv.wiktionary.org/wiki/g%C3%B6ra_en_groda'
                        },
                        'my_menu': {
                            'plugin': 'infohub_rendermenu',
                            'type': 'menu',
                            'head_label': _Translate('Make a frog'),
                            'options': {
                                'correct': {
                                    'alias': 'correct_link',
                                    'event_data': 'frog|frog|frog_correct', // demo_frog | click_frog
                                    'button_label': _Translate('Correct way'),
                                    'to_plugin': 'infohub_demo',
                                    'to_function': 'click'
                                },
                                'misstake1': {
                                    'alias': 'misstake1_link',
                                    'event_data': 'frog|frog|frog_misstake1',
                                    'button_label': _Translate('Misstake #1 - Wrong type'),
                                    'to_plugin': 'infohub_demo',
                                    'to_function': 'click'
                                },
                                'misstake2': {
                                    'alias': 'misstake2_link',
                                    'event_data': 'frog|frog|frog_misstake2',
                                    'button_label': _Translate('Misstake #2 - Wrong subtype'),
                                    'to_plugin': 'infohub_demo',
                                    'to_function': 'click'
                                }
                            }
                        }
                    },
                    'how': {
                        'mode': 'one box',
                        'text': '[my_menu][instructions_box][result_box]'
                    },
                    'where': {
                        'box_id': $in.parent_box_id + '.demo',
                        'max_width': 320,
                        'scroll_to_box_id': 'true'
                    },
                    'cache_key': 'frog'
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
     * Handle the events from the frog buttons
     * @version 2019-03-28
     * @since 2019-01-09
     * @author Peter Lembke
     */
    $functions.push("click_frog");
    const click_frog = function ($in)
    {
        const $default = {
            'step': 'step_start',
            'event_data': '',
            'box_id': '',
            'data_back': {}
        };
        $in = _Default($default, $in);

        let $data;

        if ($in.step === 'step_start')
        {
            $data = {
                'frog_correct': {
                    'type': 'frog',
                    'subtype': '',
                    'text': _Translate('Correct, The frog is rendered by calling the render_frog plugin.'),
                    'ok': 'true',
                },
                'frog_misstake1': {
                    'type': 'common',
                    'subtype': 'fizbaz',
                    'text': _Translate('Mistake #1, The frog were rendered by calling render_common with the none existing subtype fizbaz. That gives a frog and an error message on top.'),
                    'ok': 'false',
                },
                'frog_misstake2': {
                    'type': 'foobar',
                    'subtype': '',
                    'text': _Translate('Mistake #2, The frog were rendered by calling the none existing plugin foobar. That gives a frog and an error message on top.'),
                    'ok': 'false',
                },
            };

            if (_IsSet($data[$in.event_data]) === 'true') {
                $in.step = 'step_make_frog';
            }
        }
        
        if ($in.step === 'step_make_frog')
        {
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_render',
                    'function': 'create'
                },
                'data': {
                    'what': {
                        'my_frog': {
                            'type': $data[$in.event_data].type,
                            'subtype': $data[$in.event_data].subtype,
                        }
                    },
                    'how': {
                        'mode': 'one box',
                        'text': '[my_frog]'
                    },
                    'where': {
                        'box_id': $in.box_id + '_result_box_content',
                        'max_width': 640,
                        'scroll_to_box_id': 'true'
                    }
                },
                'data_back': {
                    'box_id': $in.box_id,
                    'text': $data[$in.event_data].text,
                    'ok': $data[$in.event_data].ok,
                    'step': 'step_write_text'
                }
            });
        }

        if ($in.step === 'step_write_text') {
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_view',
                    'function': 'set_text'
                },
                'data': {
                    'id': $in.data_back.box_id + '_result_box_foot',
                    'text': $in.data_back.text
                },
                'data_back': {
                    'ok': $in.data_back.ok,
                    'step': 'step_end'
                }
            });
        }

        return {
            'answer': 'true',
            'message': 'Frog is made',
            'ok': $in.data_back.ok
        };
    };
}
//# sourceURL=infohub_demo_frog.js