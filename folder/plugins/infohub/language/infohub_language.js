/**
 Copyright (C) 2018- Peter Lembke, CharZam soft
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
function infohub_language() {

    "use strict";

// include "infohub_base.js"

    $functions.push('_Version');
    const _Version = function() {
        return {
            'date': '2019-10-27',
            'since': '2019-04-02',
            'version': '1.1.0',
            'class_name': 'infohub_language',
            'checksum': '{{checksum}}',
            'note': 'Helps you with language codes',
            'SPDX-License-Identifier': 'GPL-3.0-or-later',
            'user_role': 'user',
            'web_worker': 'true',
            'core_plugin': 'false'
        };
    };

    $functions.push('_GetCmdFunctions');
    const _GetCmdFunctions = function() {
        const $list = {
            'create': 'normal',
            'option_list_main_languages': 'normal',
            'option_list_all_languages': 'normal',
            'get_translations': 'normal'
        };

        return _GetCmdFunctionsBase($list);
    };
    
    let $classTranslations = {};

    /**
     * Get instructions and create the message to InfoHub View
     * @version 2019-03-13
     * @since   2016-10-16
     * @author  Peter Lembke
     */
    $functions.push('create');
    const create = function ($in)
    {
        const $default = {
            'item_index': {},
            'config': {},
            'data_back': {
                'item_name': '',
                'item_index_done': {}
            },
            'response': {},
            'step': 'step_create'
        };
        $in = _Default($default, $in);

        if ($in.step === 'step_create_response')
        {
            const $defaultResponse = {
                'answer': 'false',
                'message': '',
                'html': '',
                'css_data': {},
                'display': ''
            };
            $in.response = _Default($defaultResponse, $in.response);
            const $itemName = $in.data_back.item_name;
            $in.data_back.item_index_done[$itemName] = $in.response;
            $in.step = 'step_create';
        }

        if ($in.step === 'step_create')
        {
            if (_Count($in.item_index) > 0) {
                const $itemData = _Pop($in.item_index);
                const $itemName = $itemData.key;
                let $data = $itemData.data;
                $in.item_index = $itemData.object;

                const $defaultItem = {
                    'alias': '',
                    'original_alias': '',
                    'css_data': {},
                    'label': 'Select a language',
                    'description': '',
                    'languages': 'main', // main or all
                    'type': 'select'
                };
                $data = _Default($defaultItem, $data);

                let $sourceFunction = 'option_list_main_languages';
                if ($data.languages === 'all') {
                    $sourceFunction = 'option_list_all_languages';
                }

                if (_Empty($data.css_data) === 'true') {
                    $data.css_data = {
                        '.select': 'max-width: 200px;'
                    };
                }

                return _SubCall({
                    'to': {
                        'node': 'client',
                        'plugin': 'infohub_render',
                        'function': 'create'
                    },
                    'data': {
                        'what': {
                            'select_language_code': {
                                'plugin': 'infohub_renderform',
                                'type': $data.type,
                                "label": $data.label,
                                "description": $data.description,
                                "size": "6",
                                "multiple": "false",
                                "options": [],
                                'source_node': 'client',
                                'source_plugin': 'infohub_language',
                                'source_function': $sourceFunction,
                                'css_data': $data.css_data
                            }
                        },
                        'how': {
                            'mode': 'one box',
                            'text': '[select_language_code]'
                        },
                        'where': {
                            'mode': 'html'
                        },
                        'alias': $data.alias,
                        'css_data': $data.css_data
                    },
                    'data_back': {
                        'item_index': $in.item_index,
                        'item_name': $itemName,
                        'item_index_done': $in.data_back.item_index_done,
                        'step': 'step_create_response'
                    }
                });
            }
            $in.step = 'step_end';
        }

        return {
            'answer': $in.response.answer,
            'message': $in.response.message,
            'item_index': $in.data_back.item_index_done
        };
    };

    /**
     * Create an options list with only the two letter languages
     * @version 2019-04-02
     * @since   2019-04-02
     * @author  Peter Lembke
     */
    $functions.push('option_list_main_languages');
    const option_list_main_languages = function ($in)
    {
        const $default = {
            'step': 'step_update_plugin_assets'
        };
        $in = _Default($default, $in);

        const $answer = 'true',
            $message = 'Here are the option values';

        let $options = [],
            $ok = 'false';

        if ($in.step === 'step_update_plugin_assets')
        {
            if (_Empty($classTranslations) === 'true') {
                return _SubCall({
                    'to': {
                        'node': 'client',
                        'plugin': 'infohub_language',
                        'function': 'get_translations'
                    },
                    'data': {},
                    'data_back': {
                        'step': 'step_create_options_list'
                    }
                });
            }

            $in.step = 'step_create_options_list';
        }

        if ($in.step === 'step_create_options_list')
        {
            let $rawData = _RawData();
            $rawData = _SortObject($rawData);

            for (let $key in $rawData)
            {
                if ($rawData.hasOwnProperty($key) === false) {
                    continue;
                }

                if ($key.length > 2) {
                    continue;
                }

                $options.push({
                    "type": "option",
                    "value": $key,
                    "label": $rawData[$key]
                });
            }
            $ok = 'true';
        }

        return {
            'answer': $answer,
            'message': $message,
            'options': $options,
            'ok': $ok
        };
    };

    /**
     * Create an option list with all language codes inclusive variants
     * @version 2019-04-02
     * @since   2019-04-02
     * @author  Peter Lembke
     * @param $in
     * @returns {{answer: string, message: string}}
     */
    $functions.push('option_list_all_languages');
    const option_list_all_languages = function ($in)
    {
        const $answer = 'true',
            $message = 'Here are the option values';

        let $options = [], $ok = 'false';

        const $default = {
            'step': 'step_update_plugin_assets'
        };
        $in = _Default($default, $in);

        if ($in.step === 'step_update_plugin_assets')
        {
            if (_Empty($classTranslations) === 'true') {
                return _SubCall({
                    'to': {
                        'node': 'client',
                        'plugin': 'infohub_language',
                        'function': 'get_translations'
                    },
                    'data': {},
                    'data_back': {
                        'step': 'step_create_options_list'
                    }
                });
            }

            $in.step = 'step_create_options_list';
        }

        if ($in.step === 'step_create_options_list')
        {
            let $rawData = _RawData();
            $rawData = _SortObject($rawData);

            for (let $key in $rawData)
            {
                $options.push({
                    "type": "option",
                    "value": $key,
                    "label": $rawData[$key]
                });
            }

            $ok = 'true';
        }

        return {
            'answer': $answer,
            'message': $message,
            'options': $options,
            'ok': $ok
        };
    };

    /**
     * Download the plugin assets and read the wanted translation data so we can translate the language names.
     * @version 2019-10-27
     * @since   2019-10-27
     * @author  Peter Lembke
     * @param $in
     * @returns {{answer: string, message: string}}
     */
    $functions.push('get_translations');
    const get_translations = function ($in)
    {
        const $default = {
            'step': 'step_update_plugin_assets',
            'response': {
                'answer': 'false',
                'message': '',
                'data': {}
            }
        };
        $in = _Default($default, $in);

        if ($in.step === 'step_update_plugin_assets')
        {
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_asset',
                    'function': 'update_all_plugin_assets'
                },
                'data': {
                    'plugin_name': _GetClassName()
                },
                'data_back': {
                    'step': 'step_get_translations'
                }
            });
        }

        if ($in.step === 'step_get_translations')
        {
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_translate',
                    'function': 'get_translate_data'
                },
                'data': {},
                'data_back': {
                    'step': 'step_get_translations_response'
                }
            });
        }

        if ($in.step === 'step_get_translations_response') {
            $classTranslations = _ByVal($in.response.data);
            $in.step = 'step_end';
        }

        return {
            'answer': 'true',
            'message': 'Now the translations have been read'
        };
    };

    /**
     * An object that has key-value can be sorted alphabetically on the value string by this function
     * @param $data
     * @private
     */
    $functions.push('_SortObject');
    const _SortObject = function ($data)
    {
        const $values = Object.values($data).sort(function(a,b){
            return a.localeCompare(b);
        });

        let $index = {};
        for (let $key in $data) {
            if ($data.hasOwnProperty($key) === false) {
                continue;
            }
            const $value = $data[$key];
            $index[$value] = $key;
        }

        let $out = {};
        for (let $valueNumber in $values) {
            const $value = $values[$valueNumber];
            const $key = $index[$value];
            $out[$key] = $value;
        }

        return $out;
    };

    /**
     * Language data comes from http://www.lingoes.net/en/translator/langcode.htm
     * @returns {infohub_language._RawData.infohub_languageAnonym$7}
     */
    $functions.push('_RawData');
    const _RawData = function ()
    {
        return {
            "af": _Translate("Afrikaans"),
            "af-ZA": _Translate("Afrikaans (South Africa)"),
            "ar": _Translate("Arabic"),
            "ar-AE": _Translate("Arabic (U.A.E.)"),
            "ar-BH": _Translate("Arabic (Bahrain)"),
            "ar-DZ": _Translate("Arabic (Algeria)"),
            "ar-EG": _Translate("Arabic (Egypt)"),
            "ar-IQ": _Translate("Arabic (Iraq)"),
            "ar-JO": _Translate("Arabic (Jordan)"),
            "ar-KW": _Translate("Arabic (Kuwait)"),
            "ar-LB": _Translate("Arabic (Lebanon)"),
            "ar-LY": _Translate("Arabic (Libya)"),
            "ar-MA": _Translate("Arabic (Morocco)"),
            "ar-OM": _Translate("Arabic (Oman)"),
            "ar-QA": _Translate("Arabic (Qatar)"),
            "ar-SA": _Translate("Arabic (Saudi Arabia)"),
            "ar-SY": _Translate("Arabic (Syria)"),
            "ar-TN": _Translate("Arabic (Tunisia)"),
            "ar-YE": _Translate("Arabic (Yemen)"),
            "az": _Translate("Azeri (Latin)"),
            "az-AZ": _Translate("Azeri (Latin) (Azerbaijan)"),
            "az-AZ": _Translate("Azeri (Cyrillic) (Azerbaijan)"),
            "be": _Translate("Belarusian"),
            "be-BY": _Translate("Belarusian (Belarus)"),
            "bg": _Translate("Bulgarian"),
            "bg-BG": _Translate("Bulgarian (Bulgaria)"),
            "bs-BA": _Translate("Bosnian (Bosnia and Herzegovina)"),
            "ca": _Translate("Catalan"),
            "ca-ES": _Translate("Catalan (Spain)"),
            "cs": _Translate("Czech"),
            "cs-CZ": _Translate("Czech (Czech Republic)"),
            "cy": _Translate("Welsh"),
            "cy-GB": _Translate("Welsh (United Kingdom)"),
            "da": _Translate("Danish"),
            "da-DK": _Translate("Danish (Denmark)"),
            "de": _Translate("German"),
            "de-AT": _Translate("German (Austria)"),
            "de-CH": _Translate("German (Switzerland)"),
            "de-DE": _Translate("German (Germany)"),
            "de-LI": _Translate("German (Liechtenstein)"),
            "de-LU": _Translate("German (Luxembourg)"),
            "dv": _Translate("Divehi"),
            "dv-MV": _Translate("Divehi (Maldives)"),
            "el": _Translate("Greek"),
            "el-GR": _Translate("Greek (Greece)"),
            "en": _Translate("English"),
            "en-AU": _Translate("English (Australia)"),
            "en-BZ": _Translate("English (Belize)"),
            "en-CA": _Translate("English (Canada)"),
            "en-CB": _Translate("English (Caribbean)"),
            "en-GB": _Translate("English (United Kingdom)"),
            "en-IE": _Translate("English (Ireland)"),
            "en-JM": _Translate("English (Jamaica)"),
            "en-NZ": _Translate("English (New Zealand)"),
            "en-PH": _Translate("English (Republic of the Philippines)"),
            "en-TT": _Translate("English (Trinidad and Tobago)"),
            "en-US": _Translate("English (United States)"),
            "en-ZA": _Translate("English (South Africa)"),
            "en-ZW": _Translate("English (Zimbabwe)"),
            "eo": _Translate("Esperanto"),
            "es": _Translate("Spanish"),
            "es-AR": _Translate("Spanish (Argentina)"),
            "es-BO": _Translate("Spanish (Bolivia)"),
            "es-CL": _Translate("Spanish (Chile)"),
            "es-CO": _Translate("Spanish (Colombia)"),
            "es-CR": _Translate("Spanish (Costa Rica)"),
            "es-DO": _Translate("Spanish (Dominican Republic)"),
            "es-EC": _Translate("Spanish (Ecuador)"),
            "es-ES": _Translate("Spanish (Castilian)"),
            "es-ES": _Translate("Spanish (Spain)"),
            "es-GT": _Translate("Spanish (Guatemala)"),
            "es-HN": _Translate("Spanish (Honduras)"),
            "es-MX": _Translate("Spanish (Mexico)"),
            "es-NI": _Translate("Spanish (Nicaragua)"),
            "es-PA": _Translate("Spanish (Panama)"),
            "es-PE": _Translate("Spanish (Peru)"),
            "es-PR": _Translate("Spanish (Puerto Rico)"),
            "es-PY": _Translate("Spanish (Paraguay)"),
            "es-SV": _Translate("Spanish (El Salvador)"),
            "es-UY": _Translate("Spanish (Uruguay)"),
            "es-VE": _Translate("Spanish (Venezuela)"),
            "et": _Translate("Estonian"),
            "et-EE": _Translate("Estonian (Estonia)"),
            "eu": _Translate("Basque"),
            "eu-ES": _Translate("Basque (Spain)"),
            "fa": _Translate("Farsi"),
            "fa-IR": _Translate("Farsi (Iran)"),
            "fi": _Translate("Finnish"),
            "fi-FI": _Translate("Finnish (Finland)"),
            "fo": _Translate("Faroese"),
            "fo-FO": _Translate("Faroese (Faroe Islands)"),
            "fr": _Translate("French"),
            "fr-BE": _Translate("French (Belgium)"),
            "fr-CA": _Translate("French (Canada)"),
            "fr-CH": _Translate("French (Switzerland)"),
            "fr-FR": _Translate("French (France)"),
            "fr-LU": _Translate("French (Luxembourg)"),
            "fr-MC": _Translate("French (Principality of Monaco)"),
            "gl": _Translate("Galician"),
            "gl-ES": _Translate("Galician (Spain)"),
            "gu": _Translate("Gujarati"),
            "gu-IN": _Translate("Gujarati (India)"),
            "he": _Translate("Hebrew"),
            "he-IL": _Translate("Hebrew (Israel)"),
            "hi": _Translate("Hindi"),
            "hi-IN": _Translate("Hindi (India)"),
            "hr": _Translate("Croatian"),
            "hr-BA": _Translate("Croatian (Bosnia and Herzegovina)"),
            "hr-HR": _Translate("Croatian (Croatia)"),
            "hu": _Translate("Hungarian"),
            "hu-HU": _Translate("Hungarian (Hungary)"),
            "hy": _Translate("Armenian"),
            "hy-AM": _Translate("Armenian (Armenia)"),
            "id": _Translate("Indonesian"),
            "id-ID": _Translate("Indonesian (Indonesia)"),
            "is": _Translate("Icelandic"),
            "is-IS": _Translate("Icelandic (Iceland)"),
            "it": _Translate("Italian"),
            "it-CH": _Translate("Italian (Switzerland)"),
            "it-IT": _Translate("Italian (Italy)"),
            "ja": _Translate("Japanese"),
            "ja-JP": _Translate("Japanese (Japan)"),
            "ka": _Translate("Georgian"),
            "ka-GE": _Translate("Georgian (Georgia)"),
            "kk": _Translate("Kazakh"),
            "kk-KZ": _Translate("Kazakh (Kazakhstan)"),
            "kn": _Translate("Kannada"),
            "kn-IN": _Translate("Kannada (India)"),
            "ko": _Translate("Korean"),
            "ko-KR": _Translate("Korean (Korea)"),
            "kok": _Translate("Konkani"),
            "kok-IN": _Translate("Konkani (India)"),
            "ky": _Translate("Kyrgyz"),
            "ky-KG": _Translate("Kyrgyz (Kyrgyzstan)"),
            "lt": _Translate("Lithuanian"),
            "lt-LT": _Translate("Lithuanian (Lithuania)"),
            "lv": _Translate("Latvian"),
            "lv-LV": _Translate("Latvian (Latvia)"),
            "mi": _Translate("Maori"),
            "mi-NZ": _Translate("Maori (New Zealand)"),
            "mk": _Translate("FYRO Macedonian"),
            "mk-MK": _Translate("FYRO Macedonian (Former Yugoslav Republic of Macedonia)"),
            "mn": _Translate("Mongolian"),
            "mn-MN": _Translate("Mongolian (Mongolia)"),
            "mr": _Translate("Marathi"),
            "mr-IN": _Translate("Marathi (India)"),
            "ms": _Translate("Malay"),
            "ms-BN": _Translate("Malay (Brunei Darussalam)"),
            "ms-MY": _Translate("Malay (Malaysia)"),
            "mt": _Translate("Maltese"),
            "mt-MT": _Translate("Maltese (Malta)"),
            "nb": _Translate("Norwegian (Bokm?l)"),
            "nb-NO": _Translate("Norwegian (Bokm?l) (Norway)"),
            "nl": _Translate("Dutch"),
            "nl-BE": _Translate("Dutch (Belgium)"),
            "nl-NL": _Translate("Dutch (Netherlands)"),
            "nn-NO": _Translate("Norwegian (Nynorsk) (Norway)"),
            "ns": _Translate("Northern Sotho"),
            "ns-ZA": _Translate("Northern Sotho (South Africa)"),
            "pa": _Translate("Punjabi"),
            "pa-IN": _Translate("Punjabi (India)"),
            "pl": _Translate("Polish"),
            "pl-PL": _Translate("Polish (Poland)"),
            "ps": _Translate("Pashto"),
            "ps-AR": _Translate("Pashto (Afghanistan)"),
            "pt": _Translate("Portuguese"),
            "pt-BR": _Translate("Portuguese (Brazil)"),
            "pt-PT": _Translate("Portuguese (Portugal)"),
            "qu": _Translate("Quechua"),
            "qu-BO": _Translate("Quechua (Bolivia)"),
            "qu-EC": _Translate("Quechua (Ecuador)"),
            "qu-PE": _Translate("Quechua (Peru)"),
            "ro": _Translate("Romanian"),
            "ro-RO": _Translate("Romanian (Romania)"),
            "ru": _Translate("Russian"),
            "ru-RU": _Translate("Russian (Russia)"),
            "sa": _Translate("Sanskrit"),
            "sa-IN": _Translate("Sanskrit (India)"),
            "se": _Translate("Sami (Northern)"),
            "se-FI": _Translate("Sami (Northern) (Finland)"),
            "se-FI": _Translate("Sami (Skolt) (Finland)"),
            "se-FI": _Translate("Sami (Inari) (Finland)"),
            "se-NO": _Translate("Sami (Northern) (Norway)"),
            "se-NO": _Translate("Sami (Lule) (Norway)"),
            "se-NO": _Translate("Sami (Southern) (Norway)"),
            "se-SE": _Translate("Sami (Northern) (Sweden)"),
            "se-SE": _Translate("Sami (Lule) (Sweden)"),
            "se-SE": _Translate("Sami (Southern) (Sweden)"),
            "sk": _Translate("Slovak"),
            "sk-SK": _Translate("Slovak (Slovakia)"),
            "sl": _Translate("Slovenian"),
            "sl-SI": _Translate("Slovenian (Slovenia)"),
            "sq": _Translate("Albanian"),
            "sq-AL": _Translate("Albanian (Albania)"),
            "sr-BA": _Translate("Serbian (Latin) (Bosnia and Herzegovina)"),
            "sr-BA": _Translate("Serbian (Cyrillic) (Bosnia and Herzegovina)"),
            "sr-SP": _Translate("Serbian (Latin) (Serbia and Montenegro)"),
            "sr-SP": _Translate("Serbian (Cyrillic) (Serbia and Montenegro)"),
            "sv": _Translate("Swedish"),
            "sv-FI": _Translate("Swedish (Finland)"),
            "sv-SE": _Translate("Swedish (Sweden)"),
            "sw": _Translate("Swahili"),
            "sw-KE": _Translate("Swahili (Kenya)"),
            "syr": _Translate("Syriac"),
            "syr-SY": _Translate("Syriac (Syria)"),
            "ta": _Translate("Tamil"),
            "ta-IN": _Translate("Tamil (India)"),
            "te": _Translate("Telugu"),
            "te-IN": _Translate("Telugu (India)"),
            "th": _Translate("Thai"),
            "th-TH": _Translate("Thai (Thailand)"),
            "tl": _Translate("Tagalog"),
            "tl-PH": _Translate("Tagalog (Philippines)"),
            "tn": _Translate("Tswana"),
            "tn-ZA": _Translate("Tswana (South Africa)"),
            "tr": _Translate("Turkish"),
            "tr-TR": _Translate("Turkish (Turkey)"),
            "tt": _Translate("Tatar"),
            "tt-RU": _Translate("Tatar (Russia)"),
            "ts": _Translate("Tsonga"),
            "uk": _Translate("Ukrainian"),
            "uk-UA": _Translate("Ukrainian (Ukraine)"),
            "ur": _Translate("Urdu"),
            "ur-PK": _Translate("Urdu (Islamic Republic of Pakistan)"),
            "uz": _Translate("Uzbek (Latin)"),
            "uz-UZ": _Translate("Uzbek (Latin) (Uzbekistan)"),
            "uz-UZ": _Translate("Uzbek (Cyrillic) (Uzbekistan)"),
            "vi": _Translate("Vietnamese"),
            "vi-VN": _Translate("Vietnamese (Viet Nam)"),
            "xh": _Translate("Xhosa"),
            "xh-ZA": _Translate("Xhosa (South Africa)"),
            "zh": _Translate("Chinese"),
            "zh-CN": _Translate("Chinese (S)"),
            "zh-HK": _Translate("Chinese (Hong Kong)"),
            "zh-MO": _Translate("Chinese (Macau)"),
            "zh-SG": _Translate("Chinese (Singapore)"),
            "zh-TW": _Translate("Chinese (Taiwan)"),
            "zu": _Translate("Zulu"),
            "zu-ZA": _Translate("Zulu (South Africa)")
        };
    };
}

//# sourceURL=infohub_language.js
