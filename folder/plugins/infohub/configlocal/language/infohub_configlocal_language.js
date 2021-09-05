/**
 * Here you can set your preferred languages
 *
 * @author      Peter Lembke <info@infohub.se>
 * @version     2019-03-12
 * @since       2019-03-12
 * @copyright   Copyright (c) 2019, Peter Lembke
 * @license     https://opensource.org/licenses/gpl-license.php GPL-3.0-or-later
 * @see         https://github.com/peterlembke/infohub/blob/master/folder/plugins/infohub/configlocal/language/infohub_configlocal_language.md Documentation
 * @link        https://infohub.se/ InfoHub main page
 */
function infohub_configlocal_language() {

    'use strict';

// include "infohub_base.js"

    $functions.push('_Version');
    const _Version = function() {
        return {
            'date': '2019-03-12',
            'since': '2019-03-12',
            'version': '2.0.0',
            'checksum': '{{checksum}}',
            'class_name': 'infohub_configlocal_language',
            'note': 'Here you can set your preferred languages',
            'status': 'normal',
            'SPDX-License-Identifier': 'GPL-3.0-or-later',
        };
    };

    $functions.push('_GetCmdFunctions');
    const _GetCmdFunctions = function() {
        const $list = {
            'create': 'normal',
            'click_transfer': 'normal',
            'click_submit': 'normal',
            'apply_config': 'normal',
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
            'step': 'step_render_form',
            'response': {
                'answer': '',
                'message': '',
            },
        };
        $in = _Default($default, $in);

        if ($in.step === 'step_render_form') {
            $classTranslations = _ByVal($in.translations);

            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_render',
                    'function': 'create',
                },
                'data': {
                    'what': {
                        'my_form': {
                            'plugin': 'infohub_renderform',
                            'type': 'form',
                            'content': '[select_language][button_transfer][language][button_save][button_clear_render_cache]',
                            'label': _Translate('LANGUAGE'),
                            'description': '[language_icon]' +
                                _Translate('HERE_YOU_CAN_SELECT_YOUR_PREFERRED_LANGUAGES.') + ' ' +
                                _Translate('THIS_IS_USED_TO_TRANSLATE_THE_TEXTS_IN_ALL_PLUGINS_TO_WHAT_YOU_PREFER.')
                        },
                        'select_language': {
                            'plugin': 'infohub_language',
                            'type': 'select',
                            'label': _Translate('SELECT_A_LANGUAGE'),
                            'description': _Translate('SELECT_A_LANGUAGE_YOU_CAN_SPEAK_AND_CLICK_ON_TRANSFER')
                        },
                        'button_transfer': {
                            'plugin': 'infohub_renderform',
                            'type': 'button',
                            'mode': 'click',
                            'button_label': _Translate('TRANSFER'),
                            'event_data': 'language|transfer', // infohub_config_local_language | click_transfer
                            'to_plugin': 'infohub_configlocal',
                            'to_function': 'click',
                        },
                        'language': {
                            'plugin': 'infohub_renderform',
                            'type': 'text',
                            'label': _Translate('LANGUAGE_CODES'),
                            'description': _Translate('LANGUAGE_CODES_YOU_PREFER._COMMA_SEPARATE_THEM._I_PREFER:_SV,EN'),
                            'maxlength': '30',
                            'placeholder': '',
                            'show_characters_left': 'false',
                        },
                        'button_save': {
                            'plugin': 'infohub_renderform',
                            'type': 'button',
                            'mode': 'submit',
                            'button_label': _Translate('SAVE'),
                            'event_data': 'language|submit',
                            'to_plugin': 'infohub_configlocal',
                            'to_function': 'click',
                        },
                        'language_icon': {
                            'type': 'common',
                            'subtype': 'svg',
                            'data': '[language_asset]',
                            'css_data': {
                                '.svg': 'width:64px; height:64px; padding:1px; max-width:64px;',
                            },
                        },
                        'language_asset': {
                            'plugin': 'infohub_asset',
                            'type': 'icon',
                            'asset_name': 'language/language',
                            'plugin_name': 'infohub_configlocal',
                        },
                        'button_clear_render_cache': {
                            'plugin': 'infohub_renderform',
                            'type': 'button',
                            'mode': 'button',
                            'button_label': _Translate('CLEAR_RENDER_CACHE'),
                            'event_data': '',
                            'to_plugin': 'infohub_render',
                            'to_function': 'delete_render_cache_for_user_name',
                        },
                    },
                    'how': {
                        'mode': 'one box',
                        'text': '[my_form]',
                    },
                    'where': {
                        'box_id': $in.parent_box_id + '.form',
                        'max_width': 640,
                        'scroll_to_box_id': 'true',
                    },
                    'cache_key': 'language',
                },
                'data_back': {
                    'parent_box_id': $in.parent_box_id,
                    'form_data': $in.form_data,
                    'step': 'step_render_form_response',
                },
            });
        }

        if ($in.step === 'step_render_form_response') {
            $in.step = 'step_end';
        }

        return {
            'answer': $in.response.answer,
            'message': $in.response.message,
        };
    };

    /**
     * Transfer the selected language code to the text string
     * @version 2019-10-12
     * @since 2019-10-12
     * @author Peter Lembke
     */
    $functions.push('click_transfer');
    const click_transfer = function($in = {}) {
        const $default = {
            'box_id': '',
            'step': 'step_form_read',
            'answer': '',
            'message': '',
            'response': {
                'form_data': {},
            },
        };
        $in = _Default($default, $in);

        let $ok = 'false';
        let $newTextWithLanguageCodes = '';

        if ($in.step === 'step_form_read') {
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_view',
                    'function': 'form_read',
                },
                'data': {
                    'id': $in.box_id + '.[my_form_form]',
                },
                'data_back': {
                    'box_id': $in.box_id,
                    'step': 'step_form_read_response',
                },
            });
        }

        if ($in.step === 'step_form_read_response') {
            const $newLanguageCode = _GetData({
                'name': 'response/form_data/select_language_code/value/0',
                'default': '',
                'data': $in,
            });

            const $languagesText = _GetData({
                'name': 'response/form_data/language/value',
                'default': '',
                'data': $in,
            });

            let $languageArray = $languagesText.split(',');
            let $lookup = {};

            for (let $key in $languageArray) {
                if ($languageArray.hasOwnProperty($key) === false) {
                    continue;
                }
                const $languageCode = $languageArray[$key];
                $lookup[$languageCode] = 1;
            }

            $in.step = 'step_end';
            $ok = 'true'; // It is ok if we already have the language code

            if (_IsSet($lookup[$newLanguageCode]) === 'false') {
                $lookup[$newLanguageCode] = 1;

                let $newCodesArray = [];
                for (let $key in $lookup) {
                    if (_Empty($key) === 'true') {
                        continue;
                    }
                    $newCodesArray.push($key);
                }
                $newTextWithLanguageCodes = $newCodesArray.join(',');
                $in.step = 'step_update_text';
            }
        }

        if ($in.step === 'step_update_text') {
            const $formData = {
                'language': {
                    'value': $newTextWithLanguageCodes,
                },
            };

            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_view',
                    'function': 'form_write',
                },
                'data': {
                    'id': $in.box_id + '.[my_form_form]',
                    'form_data': $formData,
                },
                'data_back': {
                    'step': 'step_update_text_response',
                },
            });
        }

        if ($in.step === 'step_update_text_response') {
            if ($in.answer === 'true') {
                $ok = 'true';
            }
        }

        return {
            'answer': $in.answer,
            'message': $in.message,
            'ok': $ok,
        };
    };

    /**
     * Save the config
     * I can not let the button directly call "submit" in the parent because the event would
     * have come from infohub_render and the function should only accept calls from the children.
     * @version 2019-10-28
     * @since 2019-10-28
     * @author Peter Lembke
     */
    $functions.push('click_submit');
    const click_submit = function($in = {}) {
        const $default = {
            'box_id': '',
            'step': 'step_form_read',
            'answer': '',
            'message': '',
            'response': {
                'form_data': {
                    'language': {
                        'value': '',
                    },
                },
            },
        };
        $in = _Default($default, $in);

        let $ok = 'false';

        if ($in.step === 'step_form_read') {
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_view',
                    'function': 'form_read',
                },
                'data': {
                    'id': $in.box_id + '.[my_form_form]',
                },
                'data_back': {
                    'box_id': $in.box_id,
                    'step': 'step_form_read_response',
                },
            });
        }

        if ($in.step === 'step_form_read_response') {
            $in.step = 'step_end';
            if ($in.answer === 'true') {
                $in.step = 'step_save_config';
            }
        }

        if ($in.step === 'step_save_config') {
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_configlocal',
                    'function': 'submit',
                },
                'data': {
                    'event_data': 'language',
                    'form_data': {
                        'language': {
                            'value': $in.response.form_data.language.value,
                        },
                    },
                },
                'data_back': {
                    'step': 'step_save_config_response',
                },
            });
        }

        if ($in.step === 'step_save_config_response') {
            $in.step = 'step_end';
            if ($in.answer === 'true') {
                $ok = 'true';
            }
        }

        return {
            'answer': $in.answer,
            'message': $in.message,
            'ok': $ok,
        };
    };

    /**
     * Ran by the parent "apply_config". All child plugins have this function and all are run.
     * In this function we see that you have at least one language set. If you do not then the language
     * you have set in your browser will be set as your preferred language in InfoHub. Then at least you have something
     * that might be of relevance to you.
     * @version 2019-10-19
     * @since 2019-10-19
     * @author Peter Lembke
     */
    $functions.push('apply_config');
    const apply_config = function($in = {}) {
        const $default = {
            'local_config': {
                'language': {
                    'value': '',
                },
            },
            'step': 'step_apply_config',
            'response': {
                'answer': 'true',
                'message': 'Nothing to report',
            },
            'config': {
                'user_name': ''
            },
        };
        $in = _Default($default, $in);

        if ($in.step === 'step_apply_config') {
            if ($in.local_config.language.value === '' || $in.config.user_name === 'guest') {

                let $language = _GetDefaultLanguageString();

                if (_Empty($language) === 'false') {
                    return _SubCall({
                        'to': {
                            'node': 'client',
                            'plugin': 'infohub_configlocal',
                            'function': 'submit',
                        },
                        'data': {
                            'event_data': 'language',
                            'form_data': {
                                'language': {
                                    'value': $language,
                                },
                            },
                        },
                        'data_back': {
                            'step': 'step_save_config_response',
                        },
                    });
                }
            }
        }

        return {
            'answer': $in.response.answer,
            'message': $in.response.message,
        };
    };

    $functions.push('_GetBrowserLanguage');
    /**
     * Pull out the language you have set in your browser
     * We will use that language as the default config if there is no config
     * @private
     * @version 2021-08-19
     * @since 2021-08-19
     * @author Peter Lembke
     */
    const _GetDefaultLanguageString = function() {

        const $fallbackLanguage = 'en';
        const $languageCountry = navigator.language || navigator.userLanguage;
        let $parts = $languageCountry.split('-');
        const $language = $parts[0].toLowerCase();

        let $languageArray = [];

        if ($parts.length === 2) {
            $languageArray.push($languageCountry);
        }

        if ($languageCountry !== $language) {
            $languageArray.push($language);
        }

        if ($fallbackLanguage !== '') {
            if ($language !== $fallbackLanguage) {
                $languageArray.push($fallbackLanguage);
            }
        }

        const $finalString = $languageArray.join(',');

        return $finalString;
    };

}

//# sourceURL=infohub_configlocal_language.js