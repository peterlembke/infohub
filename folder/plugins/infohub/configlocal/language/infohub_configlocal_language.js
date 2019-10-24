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
function infohub_configlocal_language() {

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

    var _Version = function() {
        return {
            'date': '2019-03-12',
            'version': '2.0.0',
            'checksum': '{{checksum}}',
            'class_name': 'infohub_configlocal_language',
            'note': 'Here you can set your preferred languages',
            'status': 'normal',
            'license_name': 'GNU GPL 3 or later'
        };
    };

    var _GetCmdFunctions = function() {
        return {
            'create': 'normal',
            'click_transfer': 'normal',
            'apply_config': 'normal'
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
    var create = function ($in)
    {
        "use strict";
        const $default = {
            'parent_box_id': '',
            'translations': {},
            'step': 'step_render_form',
            'response': {
                'answer': '',
                'message': ''
            }
        };
        $in = _Default($default, $in);

        if ($in.step === 'step_render_form')
        {
            $classTranslations = _ByVal($in.translations);

            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_render',
                    'function': 'create'
                },
                'data': {
                    'what': {
                        'my_form': {
                            'plugin': 'infohub_renderform',
                            'type': 'form',
                            'content': '[select_language][button_transfer][language][button_save]',
                            'label': _Translate('Language'),
                            'description': _Translate( 'Here you can select your preferred languages. This is used to translate the texts in all plugins to what you prefer.')
                        },
                        'select_language': {
                            'plugin': 'infohub_language',
                            'type': 'select',
                            'label': _Translate('Select a language'),
                            'description': _Translate('Select a language you can speak and click on Transfer')
                        },
                        'button_transfer': {
                            'plugin': 'infohub_renderform',
                            'type': 'button',
                            'mode': 'click',
                            'button_label': _Translate('Transfer'),
                            'event_data': 'language|transfer', // infohub_config_local_language | click_transfer
                            'to_plugin': 'infohub_configlocal',
                            'to_function': 'click'
                        },
                        'language': {
                            'plugin': 'infohub_renderform',
                            'type': 'text',
                            'label': _Translate('Language codes'),
                            'description': _Translate('Language codes you prefer. Comma separate them. I prefer: sv,en'),
                            'maxlength': '30',
                            'placeholder': '',
                            'show_characters_left': 'false'
                        },
                        'button_save': {
                            'plugin': 'infohub_renderform',
                            'type': 'button',
                            'mode': 'submit',
                            'button_label': _Translate('Save'),
                            'event_data': 'language',
                            'to_plugin': 'infohub_configlocal',
                            'to_function': 'submit'
                        }
                    },
                    'how': {
                        'mode': 'one box',
                        'text': '[my_form]'
                    },
                    'where': {
                        'box_id': $in.parent_box_id + '.form',
                        'max_width': 100,
                        'scroll_to_box_id': 'true'
                    }
                },
                'data_back': {
                    'parent_box_id': $in.parent_box_id,
                    'form_data': $in.form_data,
                    'step': 'step_render_form_response'
                }
            });
        }

        if ($in.step === 'step_render_form_response') {
            $in.step = 'step_end';
        }

        return {
            'answer': $in.response.answer,
            'message': $in.response.message
        };
    };

    /**
     * Transfer the selected language code to the text string
     * @version 2019-10-12
     * @since 2019-10-12
     * @author Peter Lembke
     */
    $functions.push("click_transfer");
    var click_transfer = function ($in)
    {
        "use strict";

        let $ok = 'false';

        const $default = {
            'box_id': '',
            'step': 'step_form_read',
            'answer': '',
            'message': '',
            'response': {
                'form_data': {}
            }
        };
        $in = _Default($default, $in);

        if ($in.step === 'step_form_read')
        {
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_view',
                    'function': 'form_read'
                },
                'data': {
                    'id': $in.box_id + '.[my_form]'
                },
                'data_back': {
                    'box_id': $in.box_id,
                    'step': 'step_form_read_response'
                }
            });
        }

        if ($in.step === 'step_form_read_response')
        {
            window.alert('hello');
            let $a = 1;
        }

        if ($in.step === 'step_update_text')
        {
        }

        if ($in.step === 'step_update_text_response')
        {
        }

        return {
            'answer': $in.answer,
            'message': $in.message,
            'ok': $ok
        };
    };

    /**
     * Apply the language config
     * @version 2019-10-19
     * @since 2019-10-19
     * @author Peter Lembke
     */
    $functions.push("apply_config");
    var apply_config = function ($in)
    {
        "use strict";

        const $default = {
            'local_config': {
                'language': {
                    'value': ''
                }
            },
            'step': 'step_apply_config',
            'response': {
                'answer': 'true',
                'message': 'Nothing to report'
            }
        };
        $in = _Default($default, $in);

        if ($in.step === 'step_apply_config')
        {
            if ($in.local_config.language.value === '') {
                const $languageCountry = navigator.language || navigator.userLanguage;
                let $parts = $languageCountry.split('-');
                const $language = $parts[0].toLowerCase();

                if (_Empty($language) === 'false') {
                    return _SubCall({
                        'to': {
                            'node': 'client',
                            'plugin': 'infohub_configlocal',
                            'function': 'submit'
                        },
                        'data': {
                            'event_data': 'language',
                            'form_data': {
                                'language': {
                                    'value': $language
                                }
                            }
                        },
                        'data_back': {
                            'step': 'step_save_config_response'
                        }
                    });
                }
            }
        }

        return {
            'answer': $in.response.answer,
            'message': $in.response.message
        };

    };

}
//# sourceURL=infohub_configlocal_language.js