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
function infohub_configlocal_font() {

// include "infohub_base.js"

    // ***********************************************************
    // * jshint.com options to suppress some warnings
    // ***********************************************************

    /*jshint evil:true */
    /*jshint devel:true */
    /*jslint browser: true, evil: true, plusplus: true, todo: true */

    const _Version = function() {
        return {
            'date': '2019-03-12',
            'since': '2019-02-22',
            'version': '1.0.0',
            'checksum': '{{checksum}}',
            'class_name': 'infohub_configlocal_font',
            'note': 'Here you can set the global font parameters',
            'status': 'normal',
            'license_name': 'GNU GPL 3 or later'
        };
    };

    const _GetCmdFunctions = function() {
        return {
            'create': 'normal',
            'click_test': 'normal',
        };
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
    const create = function ($in)
    {
        "use strict";

        const $default = {
            'step': 'step_render',
            'subtype': 'menu',
            'translations': {},
            'parent_box_id': '',
            'response': {
                'answer': 'false',
                'message': 'Nothing to report'
            }
        };
        $in = _Default($default, $in);

        if ($in.step === 'step_render') {
            $classTranslations = _ByVal($in.translations);
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_render',
                    'function': 'create'
                },
                'data': {
                    'what': {
                        'font_form': {
                            'plugin': 'infohub_renderform',
                            'type': 'form',
                            'content': '[font_weight][font_size][letter_spacing][button_test][button_save]',
                            'label': _Translate('Global font settings'),
                            'description': _Translate('Here you can fine tune how all text should be displayed')
                        },
                        'font_weight': {
                            'plugin': 'infohub_renderform',
                            'type': 'range',
                            'min_value': '0',
                            'max_value': '1000',
                            'step_value': '100',
                            'label': _Translate('Font weight'),
                            'description': _Translate('How bold do you want the text. Default 400')
                        },
                        'font_size': {
                            'plugin': 'infohub_renderform',
                            'type': 'range',
                            'min_value': '8',
                            'max_value': '200',
                            'step_value': '1',
                            'label': _Translate('Font size'),
                            'description': _Translate('How large letters do you want. Default 16px')
                        },
                        'letter_spacing': {
                            'plugin': 'infohub_renderform',
                            'type': 'range',
                            'min_value': '-2',
                            'max_value': '10',
                            'step_value': '0.2',
                            'label': _Translate('Letter spacing'),
                            'description': _Translate('The space between the letters. Default 0px')
                        },
                        'button_test': {
                            'plugin': 'infohub_renderform',
                            'type': 'button',
                            'mode': 'submit',
                            'button_label': _Translate('Test'),
                            'event_data': 'font',
                            'to_plugin': 'infohub_configlocal',
                            'to_function': 'click_test'
                        },
                        'button_save': {
                            'plugin': 'infohub_renderform',
                            'type': 'button',
                            'mode': 'submit',
                            'button_label': _Translate('Save'),
                            'event_data': 'font',
                            'to_plugin': 'infohub_configlocal',
                            'to_function': 'submit'
                        }

                    },
                    'how': {
                        'mode': 'one box',
                        'text': '[font_form]'
                    },
                    'where': {
                        'box_id': $in.parent_box_id + '.form',
                        'max_width': 100,
                        'scroll_to_box_id': 'true'
                    }
                },
                'data_back': {'step': 'step_end'}
            });            
        }

        return {
            'answer': $in.response.answer,
            'message': $in.response.message
        };
    };

    /**
     * Click the test button for font.
     * Now I will take the form_data and set the font styles.
     * @version 2019-03-12
     * @since 2019-03-11
     * @author Peter Lembke
     */
    $functions.push("click_test");
    const click_test = function ($in)
    {
        "use strict";

        const $default = {
            'step': 'step_set_style',
            'form_data': {},
            'response': {
                'answer': 'false',
                'message': 'Nothing to report'
            }
        };
        $in = _Default($default, $in);

        if ($in.step === "step_set_style")
        {
            let $messageArray = [];

            const $fontWeight = _GetData({
                'name': 'form_data/font_weight/value',
                'default': '400',
                'data': $in
            });

            const $fontSize = _GetData({
                'name': 'form_data/font_size/value',
                'default': '16',
                'data': $in
            });

            const $letterSpacing = _GetData({
                'name': 'form_data/letter_spacing/value',
                'default': '0',
                'data': $in
            });
            
            let $messageOut = _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_view',
                    'function': 'style'
                },
                'data': {
                    'data': 'fontWeight',
                    'value': $fontWeight,
                    'suffix': ''
                },
                'data_back': {
                    'step': 'step_end'
                }
            });
            $messageArray.push($messageOut);

            $messageOut = _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_view',
                    'function': 'style'
                },
                'data': {
                    'data': 'fontSize',
                    'value': $fontSize,
                    'suffix': 'px'
                },
                'data_back': {
                    'step': 'step_end'
                }
            });
            $messageArray.push($messageOut);

            $messageOut = _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_view',
                    'function': 'style'
                },
                'data': {
                    'data': 'letterSpacing',
                    'value': $letterSpacing,
                    'suffix': 'px'
                },
                'data_back': {
                    'step': 'step_end'
                }
            });
            $messageArray.push($messageOut);

            return {
                'answer': 'true',
                'message': 'This is a multi message to set all styles',
                'messages': $messageArray
            }
        }

        return {
            'answer': $in.response.answer,
            'message': $in.response.message
        };

    };

}
//# sourceURL=infohub_configlocal_font.js