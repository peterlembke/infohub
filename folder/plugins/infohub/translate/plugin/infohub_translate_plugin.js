/**
 * infohub_translate_plugin
 * Automatically translate all selected plugins to all selected languages
 *
 * @package     Infohub
 * @subpackage  infohub_translate_plugin
 * @since       2024-06-14
 * @author      Peter Lembke <info@infohub.se>
 * @license     GPL-3.0-or-later
 * @copyright   Copyright (C) 2010- Peter Lembke
 */
function infohub_translate_plugin() {

    "use strict";

// include "infohub_base.js"

    const _Version = function () {
        return {
            'date': '2024-11-10',
            'since': '2024-06-14',
            'version': '1.0.1',
            'checksum': '{{checksum}}',
            'class_name': 'infohub_translate_plugin',
            'note': 'Automatically translate all selected plugins to all selected languages',
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
                'language_list': 'en',
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
                        'container_head': {
                            'type': 'common',
                            'subtype': 'container',
                            'tag': 'div',
                            'data': '[text_title][text_instructions][button_refresh][button_translate][container_show_message]',
                            'class': 'container-small',
                        },
                        'container_form': {
                            'type': 'common',
                            'subtype': 'container',
                            'tag': 'div',
                            'data': '[my_form]',
                            'class': 'container-small',
                        },
                        'container_log': {
                            'type': 'common',
                            'subtype': 'container',
                            'tag': 'div',
                            'data': '',
                            'class': 'container-medium',
                        },
                        'my_form': {
                            'type': 'form',
                            'subtype': 'form',
                            'content': '[plugin_list][language_list]'
                        },
                        'button_refresh': {
                            'plugin': 'infohub_renderform',
                            'type': 'button',
                            'mode': 'button',
                            'button_label': _Translate('REFRESH_LISTS'),
                            'event_data': 'plugin|refresh',
                            'to_node': 'client',
                            'to_plugin': 'infohub_translate',
                            'to_function': 'click'
                        },
                        'plugin_list': {
                            'plugin': 'infohub_renderform',
                            'type': 'select',
                            "label": _Translate("SELECT_PLUGIN"),
                            "description": _Translate('LISTS_ALL_CLIENT_PLUGINS_THAT_CAN_HAVE_TRANSLATION_FILES.'),
                            "size": "6",
                            "multiple": "true",
                            "options": [],
                            'source_node': 'client',
                            'source_plugin': 'infohub_launcher',
                            'source_function': 'get_option_list',
                            'css_data': {
                                '.select': 'max-width: 200px;'
                            }
                        },
                        'language_list': {
                            'plugin': 'infohub_renderform',
                            'type': 'select',
                            "label": _Translate("SELECT_LANGUAGES"),
                            "description": _Translate('SELECT_LANGUAGES'),
                            "size": "12",
                            "multiple": "true",
                            "options": [],
                            'source_node': 'client',
                            'source_plugin': 'infohub_translate',
                            'source_function': 'get_option_list',
                            'source_data': {
                                'type': 'language',
                                'selected': '',
                                'use_cache': 'true'
                            },
                            'css_data': {
                                '.select': 'max-width: 200px;'
                            }
                        },
                        'button_translate': {
                            'plugin': 'infohub_renderform',
                            'type': 'button',
                            'mode': 'button',
                            'button_label': _Translate('TRANSLATE'),
                            'event_data': 'plugin|translate',
                            'to_node': 'client',
                            'to_plugin': 'infohub_translate',
                            'to_function': 'click',
                            'show_success_text': 'true'
                        },
                        'container_show_message': {
                            'type': 'common',
                            'subtype': 'container',
                            'tag': 'div',
                            'data': '',
                            'class': 'container-small'
                        },
                        'text_title': {
                            'type': 'text',
                            'text': _Translate('PLUGIN_TRANSLATION')
                        },
                        'text_instructions': {
                            'type': 'text',
                            'text': _Translate('SELECT_PLUGINS_AND_LANGUAGES') + '. ' + _Translate('CLICK_TRANSLATE')
                        },
                    },
                    'how': {
                        'mode': 'one box',
                        'text': '[container_head][container_form][container_log]'
                    },
                    'where': {
                        'box_id': 'main.body.infohub_translate.form', // 'box_id': $in.parent_box_id + '.form',
                        'max_width': 100,
                        'scroll_to_box_id': 'true'
                    },
                    'cache_key': 'plugin'
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
                'language_list': '',
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

        let $selectedPluginNameArray = [],
            $selectedLanguageCodeArray = [];

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

                $selectedPluginNameArray = _GetData({
                    'name': 'response/form_data/plugin_list/value/0',
                    'default': '',
                    'data': $in
                });

                $selectedLanguageCodeArray = _GetData({
                    'name': 'response/form_data/language_list/value/0',
                    'default': '',
                    'data': $in
                });
            }

            $in.step = 'step_get_option_lists';
        }

        if ($in.step === 'step_get_option_lists') {

            let $messages = [];

            let $messageOut = {
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_render',
                    'function': 'render_options'
                },
                'data': {
                    'id': $in.box_id + '_plugin_list_plugin_list',
                    'source_node': 'client',
                    'source_plugin': 'infohub_translate',
                    'source_function': 'get_option_list',
                    'source_data': {
                        'type': 'plugin', // 'plugin' or 'language'
                        'selected': $selectedPluginNameArray,
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
                    'id': $in.box_id + '_language_list_language_list',
                    'source_node': 'client',
                    'source_plugin': 'infohub_translate',
                    'source_function': 'get_option_list',
                    'source_data': {
                        'type': 'language', // 'plugin' or 'language'
                        'selected': $selectedLanguageCodeArray,
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
        let $message = _Translate('REFRESH_OF_THE_LISTS_IS_DONE');

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
                'to_textarea_id': '',
                'start_time': 0.0
            }
        };
        $in = _Default($default, $in);

        let $selectedPluginNameArray = [],
            $selectedLanguageCodeArray = [];

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

                $selectedPluginNameArray = _GetData({
                    'name': 'response/form_data/plugin_list/value',
                    'default': '',
                    'data': $in
                });

                $selectedLanguageCodeArray = _GetData({
                    'name': 'response/form_data/language_list/value',
                    'default': '',
                    'data': $in
                });

                $in.step = 'step_ask_server';

                if (_Empty($selectedPluginNameArray) === 'true') {
                    $in.data_back.message = _Translate('PICK_ONE_OR_MORE_PLUGINS_TO_TRANSLATE');
                    $in.step = 'step_end';
                }

                if (_Empty($selectedLanguageCodeArray) === 'true') {
                    $in.data_back.message = _Translate('PICK_ONE_OR_MORE_LANGUAGES_TO_TRANSLATE_TO');
                    $in.step = 'step_end';
                }
            }
        }

        if ($in.step === 'step_ask_server') {

            let $logMessage = _TimeStamp() + ' ' + _Translate('ASKING_SERVER_TO_TRANSLATE') +
                ' plugins: ' + $selectedPluginNameArray.join(', ') + ' ' +
                _Translate('TO_LANGUAGES') + ': ' + $selectedLanguageCodeArray.join(', ');

            let $messageItem = _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_view',
                    'function': 'mass_update',
                },
                'data': {
                    'do': [
                        {
                            'func': 'AddHtml',
                            'id': $in.box_id + '.[container_log]',
                            'text': $logMessage
                        },
                    ],
                },
                'data_back': {
                    'step': 'step_void'
                },
            });

            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_translate',
                    'function': 'translate_plugin'
                },
                'data': {
                    'plugin_list': $selectedPluginNameArray,
                    'language_list': $selectedLanguageCodeArray,
                },
                'data_back': {
                    'box_id': $in.box_id,
                    'step': 'step_ask_server_response',
                    'start_time': _MicroTime()
                },
                'messages': [$messageItem]
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

            const $executionTime = _MicroTime() - $in.data_back.start_time;

            const $logMessage = _TimeStamp() + ' ' + $in.data_back.message + ' ' + _Translate('EXECUTION_TIME') + ': ' + $executionTime.toFixed(2) + ' ' + _Translate('SECONDS');

            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_view',
                    'function': 'mass_update',
                },
                'data': {
                    'do': [
                        {
                            'func': 'AddHtml',
                            'id': $in.box_id + '.[container_log]',
                            'text': $logMessage
                        },
                        {
                            'func': 'SetText',
                            'id': $in.box_id + '.[container_show_message]',
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

//# sourceURL=infohub_translate_plugin.js