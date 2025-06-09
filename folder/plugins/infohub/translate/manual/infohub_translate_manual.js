/**
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
function infohub_translate_manual() {

    "use strict";

// include "infohub_base.js"

    const _Version = function () {
        return {
            'date': '2021-09-09',
            'since': '2021-09-09',
            'version': '1.0.0',
            'checksum': '{{checksum}}',
            'class_name': 'infohub_translate_manual',
            'note': 'Here you can manually send text to LibreTranslate and get an answer',
            'status': 'normal',
            'SPDX-License-Identifier': 'GPL-3.0-or-later'
        };
    };

    const _GetCmdFunctions = function () {
        const $list = {
            'create': 'normal',
            'click_refresh': 'normal',
            'click_translate': 'normal'
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
     * @version 2021-09-09
     * @since   2021-09-09
     * @author  Peter Lembke
     */
    $functions.push('create');
    const create = function ($in = {}) {
        const $default = {
            'subtype': 'menu',
            'parent_box_id': '',
            'translations': {},
            'step': 'step_render',
            'response': {
                'answer': 'false',
                'message': ''
            },
            'config': {
                'from_language': 'en',
                'to_language': 'sv'
            }
        };
        $in = _Default($default, $in);

        if ($in.step === 'step_render') {
            $classTranslations = $in.translations;

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
                            'head_label': _Translate('MANUAL_TRANSLATION'),
                            'content_data': '[my_form]',
                            'foot_text': '[text_instructions]'
                        },
                        'my_form': {
                            'type': 'form',
                            'subtype': 'form',
                            'content': '[button_refresh][from_language][to_language][from_textarea][button_translate][to_textarea][my_container]'
                        },
                        'button_refresh': {
                            'plugin': 'infohub_renderform',
                            'type': 'button',
                            'mode': 'button',
                            'button_label': _Translate('REFRESH_LANGUAGE_LIST'),
                            'event_data': 'manual|refresh',
                            'to_node': 'client',
                            'to_plugin': 'infohub_translate',
                            'to_function': 'click'
                        },
                        'from_language': {
                            'plugin': 'infohub_renderform',
                            'type': 'select',
                            "label": _Translate("SELECT_LANGUAGE"),
                            "description": _Translate('SELECT_SOURCE_LANGUAGE.'),
                            "size": "6",
                            "multiple": "false",
                            "options": [],
                            'source_node': 'client',
                            'source_plugin': 'infohub_translate',
                            'source_function': 'get_option_list',
                            'source_data': {
                                'type': 'language',
                                'selected': $in.config.from_language,
                                'use_cache': 'true'
                            },
                            'css_data': {
                                '.select': 'max-width: 200px;'
                            }
                        },
                        'to_language': {
                            'plugin': 'infohub_renderform',
                            'type': 'select',
                            "label": _Translate("SELECT_LANGUAGE"),
                            "description": _Translate('SELECT_DESTINATION_LANGUAGE.'),
                            "size": "6",
                            "multiple": "false",
                            "options": [],
                            'source_node': 'client',
                            'source_plugin': 'infohub_translate',
                            'source_function': 'get_option_list',
                            'source_data': {
                                'type': 'language',
                                'selected': $in.config.to_language,
                                'use_cache': 'true'
                            },
                            'css_data': {
                                '.select': 'max-width: 200px;'
                            }
                        },
                        'from_textarea': {
                            'plugin': 'infohub_renderform',
                            'type': 'textarea',
                            'placeholder': _Translate('YOUR_TEXT'),
                            "label": _Translate("YOUR_TEXT"),
                            "description": _Translate("THE_TEXT_YOU_WANT_TO_TRANSLATE."),
                            'validator_plugin': 'infohub_validate',
                            'validator_function': 'validate_has_data',
                        },
                        'button_translate': {
                            'plugin': 'infohub_renderform',
                            'type': 'button',
                            'mode': 'button',
                            'button_label': _Translate('TRANSLATE'),
                            'event_data': 'manual|translate',
                            'to_node': 'client',
                            'to_plugin': 'infohub_translate',
                            'to_function': 'click',
                            'show_success_text': 'true'
                        },
                        'to_textarea': {
                            'plugin': 'infohub_renderform',
                            'type': 'textarea',
                            'placeholder': _Translate('THE_TRANSLATED_TEXT'),
                            "label": _Translate("THE_TRANSLATED_TEXT"),
                            "description": _Translate("THE_TEXT_YOU_GET_AFTER_TRANSLATION.")
                        },
                        'my_container': {
                            'type': 'common',
                            'subtype': 'container',
                            'tag': 'div',
                            'data': '-',
                            'class': 'container-small'
                        },
                        'text_instructions': {
                            'type': 'text',
                            'text': _Translate('SELECT_DESTINATION_LANGUAGE._WRITE_TEXT._CLICK_TRANSLATE')
                        }
                    },
                    'how': {
                        'mode': 'one box',
                        'text': '[my_presentation_box]'
                    },
                    'where': {
                        'box_id': 'main.body.infohub_translate.form', // 'box_id': $in.parent_box_id + '.form',
                        'max_width': 960,
                        'scroll_to_box_id': 'true'
                    },
                    'cache_key': 'manual'
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
     * Refresh the list with languages
     * @version 2021-09-09
     * @since 2021-09-09
     * @author Peter Lembke
     */
    $functions.push("click_refresh");
    const click_refresh = function ($in = {}) {
        const $default = {
            'box_id': '',
            'step': 'step_form_read',
            'config': {
                'from_language': '',
                'to_language': ''
            },
            'response': {
                'answer': 'false',
                'message': '',
                'form_data': {},
                'batch_response_array': []
            }
        };
        $in = _Default($default, $in);

        let $fromLanguage = $in.config.from_language,
            $toLanguage = $in.config.to_language;

        if ($in.step === 'step_form_read') {
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_view',
                    'function': 'form_read'
                },
                'data': {
                    'id': $in.box_id + '_my_form'
                },
                'data_back': {
                    'box_id': $in.box_id,
                    'step': 'step_form_read_response'
                }
            });
        }

        if ($in.step === 'step_form_read_response') {
            if ($in.response.answer === 'true') {

                let $toLanguageCode = _GetData({
                    'name': 'response/form_data/to_language/value/0',
                    'default': '',
                    'data': $in
                });

                if ($toLanguageCode !== '') {
                    $toLanguage = $toLanguageCode;
                }

                let $fromLanguageCode = _GetData({
                    'name': 'response/form_data/from_language/value/0',
                    'default': '',
                    'data': $in
                });

                if ($fromLanguageCode !== '') {
                    $fromLanguage = $fromLanguageCode;
                }
            }

            $in.step = 'step_get_language_option_list';
        }

        if ($in.step === 'step_get_language_option_list') {

            let $messages = [];

            let $messageOut = {
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_render',
                    'function': 'render_options'
                },
                'data': {
                    'id': $in.box_id + '_to_language_to_language',
                    'source_node': 'client',
                    'source_plugin': 'infohub_translate',
                    'source_function': 'get_option_list',
                    'source_data': {
                        'type': 'language',
                        'selected': $toLanguage,
                        'use_cache': 'false' // We will ask the server directly and cache the answer if we got one
                    }
                },
                'data_back': {
                    'box_id': $in.box_id,
                    'step': 'step_void'
                }
            };
            $messages.push($messageOut);

            $messageOut = {
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_render',
                    'function': 'render_options'
                },
                'data': {
                    'id': $in.box_id + '_from_language_from_language',
                    'source_node': 'client',
                    'source_plugin': 'infohub_translate',
                    'source_function': 'get_option_list',
                    'source_data': {
                        'type': 'language',
                        'selected': $fromLanguage,
                        'use_cache': 'false'
                    }
                },
                'data_back': {
                    'box_id': $in.box_id,
                    'step': 'step_void'
                }
            };
            $messages.push($messageOut);

            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_batch',
                    'function': 'send_batch_messages_in_memory'
                },
                'data': {
                    'batch_message_array': $messages
                },
                'data_back': {
                    'box_id': $in.box_id,
                    'step': 'step_get_language_option_list_response'
                }
            });
        }

        let $isOK = 'true';
        let $message = 'Refresh of the language lists are done';

        if ($in.step === 'step_get_language_option_list_response') {
            for (let $key in $in.response.batch_response_array) {
                if ($in.response.batch_response_array[$key].response.answer === 'false') {
                    $isOK = 'false';
                    $message = $in.response.batch_response_array[$key].response.message;
                    break;
                }
            }
        }

        return {
            'answer': $isOK,
            'message': $message,
            'ok': $isOK
        };
    };

    /**
     * Translate the text to the selected language
     * @version 2021-09-09
     * @since   2021-09-09
     * @author  Peter Lembke
     */
    $functions.push('click_translate');
    const click_translate = function ($in = {}) {
        const $default = {
            'box_id': '',
            'step': 'step_form_read',
            'response': {
                'answer': 'false',
                'message': 'Nothing to report',
                'data': {},
                'form_data': {},
                'to_text': ''
            },
            'data_back': {
                'answer': 'false',
                'message': 'Nothing to report',
                'ok': 'false',
                'plugin_name_array': [],
                'to_text': '',
                'to_textarea_id': ''
            }
        };
        $in = _Default($default, $in);

        let $fromLanguage = '',
            $fromText = '',
            $toLanguage = '',
            $toTextAreaId = '';

        if ($in.step === 'step_form_read') {
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_view',
                    'function': 'form_read'
                },
                'data': {
                    'id': $in.box_id + '_my_form'
                },
                'data_back': {
                    'box_id': $in.box_id,
                    'step': 'step_form_read_response'
                }
            });
        }

        if ($in.step === 'step_form_read_response') {

            $in.data_back.answer = $in.response.answer;
            $in.data_back.message = $in.response.message;
            $in.step = 'step_end';

            if ($in.response.answer === 'true') {

                $fromLanguage = _GetData({
                    'name': 'response/form_data/from_language/value/0',
                    'default': '',
                    'data': $in
                });

                $fromText = _GetData({
                    'name': 'response/form_data/from_textarea/value',
                    'default': '',
                    'data': $in
                });

                $toLanguage = _GetData({
                    'name': 'response/form_data/to_language/value/0',
                    'default': '',
                    'data': $in
                });

                $toTextAreaId = _GetData({
                    'name': 'response/form_data/to_textarea/id',
                    'default': '',
                    'data': $in
                });

                $in.step = 'step_ask_server';

                if ($fromLanguage === '') {
                    $in.data_back.message = _Translate('PICK_A_LANGUAGE_TO_TRANSLATE_FROM');
                    $in.step = 'step_end';
                }

                if ($fromText === '') {
                    $in.data_back.message = _Translate('WRITE_SOMETHING_SO_I_CAN_TRANSLATE');
                    $in.step = 'step_end';
                }

                if ($toLanguage === '') {
                    $in.data_back.message = _Translate('PICK_A_LANGUAGE_TO_TRANSLATE_TO');
                    $in.step = 'step_end';
                }
            }
        }

        if ($in.step === 'step_ask_server') {
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_translate',
                    'function': 'translate'
                },
                'data': {
                    'from_language': $fromLanguage,
                    'to_language': $toLanguage,
                    'from_text': $fromText
                },
                'data_back': {
                    'to_textarea_id': $toTextAreaId,
                    'box_id': $in.box_id,
                    'step': 'step_ask_server_response'
                }
            });
        }

        if ($in.step === 'step_ask_server_response') {
            $in.data_back.answer = $in.response.answer;
            $in.data_back.message = $in.response.message;
            let $showMessage = $in.data_back.message;

            if ($in.response.answer === 'true') {
                $in.data_back.ok = 'true';
                $showMessage = _Translate('TRANSLATION_DONE');
                $in.data_back.message = $showMessage;
            }

            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_view',
                    'function': 'mass_update',
                },
                'data': {
                    'do': [
                        {
                            'func': 'SetText',
                            'id': $in.data_back.to_textarea_id,
                            'text': $in.response.to_text
                        },
                        {
                            'func': 'SetText',
                            'id': $in.box_id + '.[my_container]',
                            'text': $showMessage
                        }
                    ],
                },
                'data_back': {
                    'answer': $in.data_back.answer,
                    'message': $in.data_back.message,
                    'ok': $in.data_back.ok,
                    'plugin_name': $in.data_back.plugin_name,
                    'step': 'step_show_message_response'
                },
            });
        }

        return {
            'answer': $in.data_back.answer,
            'message': $in.data_back.message,
            'ok': $in.data_back.ok
        };
    };
}

//# sourceURL=infohub_translate_manual.js