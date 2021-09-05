/**
 * Here you can set the global font parameters
 *
 * @author      Peter Lembke <info@infohub.se>
 * @version     2019-03-12
 * @since       2019-02-22
 * @copyright   Copyright (c) 2019, Peter Lembke
 * @license     https://opensource.org/licenses/gpl-license.php GPL-3.0-or-later
 * @see         https://github.com/peterlembke/infohub/blob/master/folder/plugins/infohub/configlocal/font/infohub_configlocal_font.md Documentation
 * @link        https://infohub.se/ InfoHub main page
 */
function infohub_configlocal_font() {

    'use strict';

// include "infohub_base.js"

    $functions.push('_Version');
    const _Version = function() {
        return {
            'date': '2019-03-12',
            'since': '2019-02-22',
            'version': '1.0.0',
            'checksum': '{{checksum}}',
            'class_name': 'infohub_configlocal_font',
            'note': 'Here you can set the global font parameters',
            'status': 'normal',
            'SPDX-License-Identifier': 'GPL-3.0-or-later',
        };
    };

    $functions.push('_GetCmdFunctions');
    const _GetCmdFunctions = function() {
        const $list = {
            'create': 'normal',
            'click_test': 'normal',
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
            'step': 'step_render',
            'subtype': 'menu',
            'translations': {},
            'parent_box_id': '',
            'response': {
                'answer': 'false',
                'message': 'Nothing to report',
            },
        };
        $in = _Default($default, $in);

        if ($in.step === 'step_render') {
            $classTranslations = _ByVal($in.translations);
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_render',
                    'function': 'create',
                },
                'data': {
                    'what': {
                        'font_form': {
                            'plugin': 'infohub_renderform',
                            'type': 'form',
                            'content': '[font_weight][font_size][letter_spacing][button_test][button_save]',
                            'label': _Translate('GLOBAL_FONT_SETTINGS'),
                            'description': _Translate('HERE_YOU_CAN_FINE_TUNE_HOW_ALL_TEXT_SHOULD_BE_DISPLAYED')
                        },
                        'font_weight': {
                            'plugin': 'infohub_renderform',
                            'type': 'range',
                            'min_value': '0',
                            'max_value': '1000',
                            'step_value': '100',
                            'label': _Translate('FONT_WEIGHT'),
                            'description': _Translate('HOW_BOLD_DO_YOU_WANT_THE_TEXT._DEFAULT_400')
                        },
                        'font_size': {
                            'plugin': 'infohub_renderform',
                            'type': 'range',
                            'min_value': '8',
                            'max_value': '200',
                            'step_value': '1',
                            'label': _Translate('FONT_SIZE'),
                            'description': _Translate('HOW_LARGE_LETTERS_DO_YOU_WANT._DEFAULT_16PX')
                        },
                        'letter_spacing': {
                            'plugin': 'infohub_renderform',
                            'type': 'range',
                            'min_value': '-2',
                            'max_value': '10',
                            'step_value': '0.2',
                            'label': _Translate('LETTER_SPACING'),
                            'description': _Translate('THE_SPACE_BETWEEN_THE_LETTERS._DEFAULT_0PX')
                        },
                        'button_test': {
                            'plugin': 'infohub_renderform',
                            'type': 'button',
                            'mode': 'submit',
                            'button_label': _Translate('TEST'),
                            'event_data': 'font',
                            'to_plugin': 'infohub_configlocal',
                            'to_function': 'click_test',
                        },
                        'button_save': {
                            'plugin': 'infohub_renderform',
                            'type': 'button',
                            'mode': 'submit',
                            'button_label': _Translate('SAVE'),
                            'event_data': 'font',
                            'to_plugin': 'infohub_configlocal',
                            'to_function': 'submit',
                        },

                    },
                    'how': {
                        'mode': 'one box',
                        'text': '[font_form]',
                    },
                    'where': {
                        'box_id': $in.parent_box_id + '.form',
                        'max_width': 100,
                        'scroll_to_box_id': 'true',
                    },
                },
                'data_back': {'step': 'step_end'},
            });
        }

        return {
            'answer': $in.response.answer,
            'message': $in.response.message,
        };
    };

    /**
     * Click the test button for font.
     * Now I will take the form_data and set the font styles.
     * @version 2019-03-12
     * @since 2019-03-11
     * @author Peter Lembke
     */
    $functions.push('click_test');
    const click_test = function($in = {}) {
        const $default = {
            'step': 'step_set_style',
            'form_data': {},
            'response': {
                'answer': 'false',
                'message': 'Nothing to report',
            },
        };
        $in = _Default($default, $in);

        if ($in.step === 'step_set_style') {
            let $messageArray = [];

            const $fontWeight = _GetData({
                'name': 'form_data/font_weight/value',
                'default': '400',
                'data': $in,
            });

            const $fontSize = _GetData({
                'name': 'form_data/font_size/value',
                'default': '16',
                'data': $in,
            });

            const $letterSpacing = _GetData({
                'name': 'form_data/letter_spacing/value',
                'default': '0',
                'data': $in,
            });

            let $messageOut = _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_view',
                    'function': 'style',
                },
                'data': {
                    'data': 'fontWeight',
                    'value': $fontWeight,
                    'suffix': '',
                },
                'data_back': {
                    'step': 'step_end',
                },
            });
            $messageArray.push($messageOut);

            $messageOut = _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_view',
                    'function': 'style',
                },
                'data': {
                    'data': 'fontSize',
                    'value': $fontSize,
                    'suffix': 'px',
                },
                'data_back': {
                    'step': 'step_end',
                },
            });
            $messageArray.push($messageOut);

            $messageOut = _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_view',
                    'function': 'style',
                },
                'data': {
                    'data': 'letterSpacing',
                    'value': $letterSpacing,
                    'suffix': 'px',
                },
                'data_back': {
                    'step': 'step_end',
                },
            });
            $messageArray.push($messageOut);

            return {
                'answer': 'true',
                'message': 'This is a multi message to set all styles',
                'messages': $messageArray,
            };
        }

        return {
            'answer': $in.response.answer,
            'message': $in.response.message,
        };

    };

}

//# sourceURL=infohub_configlocal_font.js