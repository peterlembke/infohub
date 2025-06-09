<?php
/**
 * Uses Libre Translate. You can manually translate things or translate plugins
 *
 * The server part of translate collects strings that should be translated
 *
 * @package     Infohub
 * @subpackage  infohub_plugin
 */

declare(strict_types=1);
if (basename(__FILE__) == basename($_SERVER['SCRIPT_FILENAME'])) {
    exit; // This file must be included, not called directly
}

/**
 * Uses Libre Translate. You can manually translate things or translate plugins
 *
 * @author      Peter Lembke <info@infohub.se>
 * @version     2021-09-16
 * @since       2021-09-16
 * @copyright   Copyright (c) 2021, Peter Lembke
 * @license     https://opensource.org/licenses/gpl-license.php GPL-3.0-or-later
 * @see         https://github.com/peterlembke/infohub/blob/master/folder/plugins/infohub/translate/infohub_translate.md Documentation
 * @link        https://infohub.se/ InfoHub main page
 */
class infohub_translate extends infohub_base
{
    /**
     * Version information for this plugin
     *
     * @return  string[]
     * @since   2021-09-16
     * @author  Peter Lembke
     * @version 2021-09-16
     */
    protected function _Version(): array
    {
        return [
            'date' => '2024-11-10',
            'since' => '2021-09-16',
            'version' => '1.1.0',
            'class_name' => 'infohub_translate',
            'checksum' => '{{checksum}}',
            'note' => 'Uses Libre Translate. Manual translate or translate plugins.',
            'status' => 'normal',
            'SPDX-License-Identifier' => 'GPL-3.0-or-later',
            'user_role' => 'user'
        ];
    }

    /**
     * Public functions in this plugin
     *
     * @return array
     * @author  Peter Lembke
     * @version 2019-03-23
     * @since   2019-03-23
     */
    protected function _GetCmdFunctions(): array
    {
        $list = [
            'translate' => 'normal',
            'get_plugin_option_list' => 'normal',
            'get_language_option_list' => 'normal',
            'translate_all_plugin_names' => 'normal',
            'translate_one_plugin_to_one_language' => 'normal'
        ];


        return parent::_GetCmdFunctionsBase($list);
    }

    /**
     * Call libre translate to get this translated
     *
     * @param array $in
     * @return array
     * @author  Peter Lembke
     * @version 2021-09-16
     * @since   2021-09-16
     */
    protected function translate(array $in = []): array
    {
        $default = [
            'from_text' => '',
            'from_language' => 'en',
            'to_language' => 'es',
            'step' => 'step_call_libre_translate',
            'response' => [],
            'data_back' => [],
            'config' => [
                'libre_translate' => [
                    'url' => 'https://libretranslate.com/languages',
                    'port' => 443,
                    'curl_logging' => 'false'
                ]
            ]
        ];
        $in = $this->_Default($default, $in);

        $answer = 'false';
        $message = 'Nothing to report from translate';
        $ok = 'false';
        $toText = '';

        if ($in['step'] === 'step_call_libre_translate') {

            $postData = $this->_JsonEncode([
                'q' => $in['from_text'],
                'source' => $in['from_language'],
                'target' => $in['to_language']
            ]);

            return $this->_SubCall([
                'to' => [
                    'node' => 'server',
                    'plugin' => 'infohub_call',
                    'function' => 'call'
                ],
                'data' => [
                    'url' => $in['config']['libre_translate']['url'] . '/translate',
                    'port' => $in['config']['libre_translate']['port'],
                    'post_data' => $postData,
                    'mode' => 'post',
                    'curl_logging' => $in['config']['libre_translate']['curl_logging'],
                ],
                'data_back' => [
                    'step' => 'step_call_libre_translate_response'
                ]
            ]);
        }

        if ($in['step'] === 'step_call_libre_translate_response') {
            $answer = $in['response']['answer'];
            $ok = $in['response']['answer'];
            $message = $in['response']['message'];
            $in['step'] = 'step_handle_response';
            if ($answer === 'false') {
                $in['step'] = 'step_end';
            }
        }

        if ($in['step'] === 'step_handle_response') {
            $responseLookup = $this->_JsonDecode($in['response']['response_string']);
            $toText = $responseLookup['translatedText'];
        }

        return [
            'answer' => $answer,
            'message' => $message,
            'to_text' => $toText,
            'ok' => $ok
        ];
    }

    /**
     * Load plugin list from infohub_file
     * You get all level 1 plugin names in an array.
     * You also get an option array, ready to be used in a form
     * This option list is used to select a plugin to create a translation file for
     *
     * @param array $in
     * @return array
     * @author  Peter Lembke
     * @version 2019-02-23
     * @since   2019-02-23
     */
    protected function get_plugin_option_list(array $in = []): array
    {
        $default = [
            'step' => 'step_load_plugin_list',
            'response' => [],
            'data_back' => []
        ];
        $in = $this->_Default($default, $in);

        $answer = 'false';
        $message = 'Nothing to report from load_plugin_data';
        $ok = 'false';
        $pluginList = [];
        $options = [];

        if ($in['step'] === 'step_load_plugin_list') {
            return $this->_SubCall([
                'to' => [
                    'node' => 'server',
                    'plugin' => 'infohub_file',
                    'function' => 'get_all_level1_plugin_names'
                ],
                'data' => [
                    'only_plugins_that_have_a_launcher' => 'true',
                    'node' => 'client', // We want to translate client plugins (JavaScript)
                ],
                'data_back' => [
                    'step' => 'step_load_plugin_list_response'
                ]
            ]);
        }

        if ($in['step'] === 'step_load_plugin_list_response') {
            $answer = $in['response']['answer'];
            $message = $in['response']['message'];
            if ($answer === 'true') {
                $message = 'Finished loading plugin list';
                $pluginList = $in['response']['data'];
                $in['step'] = 'step_option_list';
            }
        }

        if ($in['step'] === 'step_option_list') {
            foreach ($pluginList as $name => $data) {
                $options[] = ['type' => 'option', 'value' => $name, 'label' => $name];
            }
            $ok = 'true';
        }

        return [
            'answer' => $answer,
            'message' => $message,
            'plugin_list' => $pluginList,
            'options' => $options,
            'ok' => $ok
        ];
    }

    /**
     * Get the list with languages that libre translate can handle
     *
     * @author  Peter Lembke
     * @version 2021-09-17
     * @since   2021-09-17
     * @param  array  $in
     * @return array
     */
    protected function get_language_option_list(array $in = []): array
    {
        $default = [
            'selected' => '',
            'step' => 'step_call_libre_translate',
            'response' => [
                'answer' => 'false',
                'message' => '',
                'response_string' => ''
            ],
            'data_back' => [],
            'config' => [
                'libre_translate' => [
                    'url' => 'https://libretranslate.com/languages',
                    'port' => 443,
                    'curl_logging' => 'false'
                ]
            ]
        ];
        $in = $this->_Default($default, $in);

        $answer = 'false';
        $message = 'Nothing to report from get_language_option_list';
        $ok = 'false';
        $options = [];

        if ($in['step'] === 'step_call_libre_translate') {
            return $this->_SubCall(
                [
                    'to' => [
                        'node' => 'server',
                        'plugin' => 'infohub_call',
                        'function' => 'call'
                    ],
                    'data' => [
                        'url' => $in['config']['libre_translate']['url'] . '/languages',
                        'port' => $in['config']['libre_translate']['port'],
                        'post_data' => '',
                        'mode' => 'get',
                        'curl_logging' => $in['config']['libre_translate']['curl_logging'],
                    ],
                    'data_back' => [
                        'selected' => $in['selected'],
                        'step' => 'step_call_libre_translate_response'
                    ]
                ]
            );
        }

        if ($in['step'] === 'step_call_libre_translate_response') {
            $answer = $in['response']['answer'];
            $ok = $in['response']['answer'];
            $message = $in['response']['message'];
            $in['step'] = 'step_convert_to_options';
            if ($answer === 'false') {
                $message = 'Server got response from the LibreTranslate API: ' . $message;
                $in['step'] = 'step_end';
            }
        }

        if ($in['step'] === 'step_convert_to_options') {
            $languageArray = $this->_JsonDecode($in['response']['response_string']);
            foreach ($languageArray as $languageItem) {
                $item = [
                    "type" => "option",
                    "value" => $languageItem['code'],
                    "label" => $languageItem['name']
                ];
                if ($languageItem['code'] === $in['selected']) {
                    $item['selected'] = 'true';
                }
                $options[] = $item;
            }
        }

        return [
            'answer' => $answer,
            'message' => $message,
            'options' => $options,
            'ok' => $ok
        ];
    }

    /**
     * The data from the GUI arrive to this function: translate_all_plugin_names
     * Data is an array with all selected level1 plugin names, and one array with all selected language codes.
     * Combine one plugin name with all language codes. Send a short tail message to function translate_one_plugin_name. Use step_void
     *
     * @param array $in
     * @return array
     */
    protected function translate_all_plugin_names(array $in = []): array
    {
        ini_set('max_memory', '2048M');

        $default = [
            'plugin_list' => [],
            'language_list' => [],
            'step' => 'step_start',
            'response' => [],
            'data_back' => []
        ];
        $in = $this->_Default($default, $in);

        $messages = [];

        if ($in['step'] === 'step_start') {

            $isHavingValues = $this->_Empty($in['plugin_list']) === 'false' &&
                $this->_Empty($in['language_list']) === 'false';

            if ($isHavingValues === false) {
                return [
                    'answer' => 'false',
                    'message' => 'No values in plugin_list or language_list',
                    'ok' => 'false'
                ];
            }

            foreach ($in['plugin_list'] as $pluginName) {
                foreach($in['language_list'] as $languageCode) {
                    $messageOut = $this->_SubCall([
                        'to' => [
                            'node' => 'server',
                            'plugin' => 'infohub_translate',
                            'function' => 'translate_one_plugin_to_one_language'
                        ],
                        'data' => [
                            'plugin_name' => $pluginName,
                            'language_code' => $languageCode
                        ],
                        'data_back' => [
                            'step' => 'step_response'
                        ]
                    ]);
                    $messages[] = $messageOut;
                }
            }

            return [
                'answer' => 'true',
                'message' => 'Have sent one message for each combination of plugin and language',
                'messages' => $messages
            ];
        }

        if ($in['step'] === 'step_response') {
            if ($in['response']['answer'] === 'false') {
                return [
                    'answer' => 'false',
                    'message' => $in['response']['message'],
                    'ok' => 'false'
                ];
            }
            $isLast = $this->_GetData([
                'name' => 'data_back/is_last_batch_message',
                'default' => 'false',
                'data' => $in
            ]);
            if ($isLast === 'false') {
                return [];
            }
        }

        return [
            'answer' => 'true',
            'message' => 'All plugins were translated to all languages',
            'ok' => 'true',
        ];
    }

    /**
     * We get one level 1 plugin name and one language code.
     * We will now get all child plugin names and pull out all text strings,
     * and send them all in one call to the LibreTranslate API.
     *
     * @param array $in
     * @return array
     */
    protected function translate_one_plugin_to_one_language(array $in = []): array
    {
        $default = [
            'plugin_name' => '',
            'language_code' => '',
            'step' => 'step_start',
            'response' => [
                'answer' => 'false',
                'message' => '',
                'type' => '',
                'data' => [],
                'launcher' => [],
                'response_string' => '',
                'execution_time' => 0.0
            ],
            'data_back' => [
                'is_last_batch_message' => 'false',
                'plugin_names' => '',
                'language_code' => '',
                'key_array' => [],
                'translation_lookup' => [],
                'language_code_language_name_lookup' => [],
            ],
            'config' => [
                'libre_translate' => [
                    'url' => 'https://libretranslate.com/languages',
                    'port' => 443,
                    'curl_logging' => 'false'
                ]
            ]
        ];
        $in = $this->_Default($default, $in);

        $messageItemArray = [];

        if ($in['step'] === 'step_start') {

            $isHavingValues = $this->_Empty($in['plugin_name']) === 'false' &&
                $this->_Empty($in['language_code']) === 'false';

            if ($isHavingValues === false) {
                return [
                    'answer' => 'false',
                    'message' => 'No values in plugin_name or language_code',
                    'ok' => 'false'
                ];
            }

            $in['step'] = 'step_language';
        }

        if ($in['step'] === 'step_language') {
            return $this->_SubCall(
                [
                    'to' => [
                        'node' => 'server',
                        'plugin' => 'infohub_call',
                        'function' => 'call'
                    ],
                    'data' => [
                        'url' => $in['config']['libre_translate']['url'] . '/languages',
                        'port' => $in['config']['libre_translate']['port'],
                        'post_data' => '',
                        'mode' => 'get',
                        'curl_logging' => $in['config']['libre_translate']['curl_logging'],
                    ],
                    'data_back' => [
                        'plugin_name' => $in['plugin_name'],
                        'language_code' => $in['language_code'],
                        'step' => 'step_language_response'
                    ]
                ]
            );
        }

        if ($in['step'] === 'step_language_response') {
            if ($in['response']['answer'] === 'false') {
                return [
                    'answer' => 'false',
                    'message' => $in['response']['message'],
                    'ok' => 'false'
                ];
            }

            $languageArray = $this->_JsonDecode($in['response']['response_string']);
            $languageCodeLanguageNameLookup = array_column(array: $languageArray, column_key: 'name', index_key: 'code');

            $in['step'] = 'step_get_js_code';
        }

        if ($in['step'] === 'step_get_js_code') {

            $pluginName = $in['plugin_name'];

            return $this->_SubCall([
                'to' => [
                    'node' => 'server',
                    'plugin' => 'infohub_file',
                    'function' => 'get_plugin_js_files_content'
                ],
                'data' => [
                    'plugin_name_array' => [$pluginName]
                ],
                'data_back' => [
                    'plugin_name' => $in['plugin_name'],
                    'language_code' => $in['language_code'],
                    'language_code_language_name_lookup' => $languageCodeLanguageNameLookup,
                    'step' => 'step_get_js_code_response'
                ]
            ]);
        }

        if ($in['step'] === 'step_get_js_code_response') {
            if ($in['response']['answer'] === 'false') {
                return [
                    'answer' => 'false',
                    'message' => $in['response']['message'],
                    'ok' => 'false'
                ];
            }

            $pluginNameCodeLookup = $in['response']['data'];
            $launcherLookup = $in['response']['launcher'];
            $translationLookup = $this->_PluginCodePullOutTextStrings($pluginNameCodeLookup);
            $languageCode = $in['language_code'];
            $languageName = $in['data_back']['language_code_language_name_lookup'][$languageCode] ?? 'Unknown';
            $translationLookup = $this->_AddHeader($translationLookup, $launcherLookup, $languageCode, $languageName);
            $libreTranslateMessage = $this->_GetLibreTranslateMessage($translationLookup);
            $keyArray = $libreTranslateMessage['key_array'];
            $textArray = $libreTranslateMessage['text_array'];

            $postData = $this->_JsonEncode([
                'q' => $textArray,
                'source' => 'en',
                'target' => $in['language_code'],
                'alternatives' => 3
            ]);

            return $this->_SubCall(
                [
                    'to' => [
                        'node' => 'server',
                        'plugin' => 'infohub_call',
                        'function' => 'call'
                    ],
                    'data' => [
                        'url' => $in['config']['libre_translate']['url'] . '/translate',
                        'port' => $in['config']['libre_translate']['port'],
                        'post_data' => $postData,
                        'mode' => 'post',
                        'curl_logging' => $in['config']['libre_translate']['curl_logging'],
                    ],
                    'data_back' => [
                        'key_array' => $keyArray,
                        'translation_lookup' => $translationLookup,
                        'step' => 'step_call_libre_translate_response'
                    ]
                ]
            );
        }

        if ($in['step'] === 'step_call_libre_translate_response') {
            if ($in['response']['answer'] === 'false') {
                return [
                    'answer' => 'false',
                    'message' => $in['response']['message'],
                    'ok' => 'false'
                ];
            }

            $in['step'] = 'step_match_keys';
        }

        if ($in['step'] === 'step_match_keys') {
            $response = $this->_JsonDecode($in['response']['response_string']);
            $translatedValueArray = $response['translatedText'];
            $keyValueLookup = array_combine($in['data_back']['key_array'], $translatedValueArray);
            $translationLookup = $this->_UpdateTranslationLookupWithTranslatedStrings($in['data_back']['translation_lookup'], $keyValueLookup);

            foreach ($translationLookup as $parentPluginName => $contentArray) {

                $path = $parentPluginName . DS . $contentArray['version']['language'] . '.json';

                $messageOut = [
                    'to' => [
                        'node' => 'server',
                        'plugin' => 'infohub_file',
                        'function' => 'write'
                    ],
                    'data' => [
                        'path' => $path,
                        'contents' => $this->_JsonEncode(
                            dataArray: $contentArray,
                            usePrettyPrint: true, // Preserves åäö and other non-ASCII characters
                            useUnescapedUnicode: true // Makes it easier to read the file for humans
                        ),
                        'allow_overwrite' => 'true'
                    ],
                    'data_back' => [
                        'step' => 'step_write_to_file_response'
                    ]
                ];
                $messageItemArray[] = $messageOut;
            }

            return $this->_BatchCall([
                'messages' => $messageItemArray
            ]);
        }

        if ($in['step'] === 'step_write_to_file_response') {
            if ($in['response']['answer'] === 'false') {
                return [
                    'answer' => 'false',
                    'message' => $in['message'],
                    'ok' => 'false'
                ];
            }
            $isLast = $this->_GetData([
                'name' => 'data_back/is_last_batch_message',
                'default' => 'false',
                'data' => $in
            ]);
            if ($isLast === 'false') {
                return [];
            }
        }

        return [
            'answer' => 'true',
            'message' => 'The translation file was written',
            'ok' => 'true',
            'messages' => $messageItemArray
        ];
    }

    /**
     * Pull out all text strings from all the plugins code
     * We now have the key and the english text
     *
     * @param array $pluginNameCodeLookup
     * @return array
     */
    protected function _PluginCodePullOutTextStrings(
        array $pluginNameCodeLookup = []
    ): array {
        $find = '_Translate(';
        $findLength = strlen($find);

        $translationLookup = [];

        foreach ($pluginNameCodeLookup as $pluginName => $code) {
            $offset = 0;
            $done = false;
            $codeLength = strlen($code);
            $parentPluginName = $this->_GetParentPluginName($pluginName);

            while ($done === false) {
                if ($offset >= $codeLength) {
                    $done = 'true';
                    continue;
                }

                $position = strpos($code, $find, $offset);

                if ($position === false) {
                    $done = true;
                    continue;
                }

                $blipStart = $position + $findLength;
                $blip = substr($code, $blipStart, 1);
                if ($blip !== '"' && $blip !== "'") {
                    $offset = $position + $findLength + 1;
                    continue;
                }

                $textStart = $position + $findLength + 1;

                $findEnd = $blip . ')';
                $textEnd = strpos($code, $findEnd, $textStart);

                if ($textEnd === false) {
                    $done = true;
                    continue;
                }

                $textLength = $textEnd - $textStart;
                $text = substr($code, $textStart, $textLength);

                $offset = $textEnd + 2;

                if (empty($text) === true) {
                    continue;
                }

                if (isset($translationLookup[$parentPluginName]) === false) {
                    $translationLookup[$parentPluginName] = [];
                }
                if (isset($translationLookup[$parentPluginName][$pluginName]) === false) {
                    $translationLookup[$parentPluginName][$pluginName] = [];
                }

                $key = $this->textToKey($text);
                $finalText = $this->keyToText($text);

                $translationLookup[$parentPluginName][$pluginName][$key] = $finalText;
            }
        }

        return $translationLookup;
    }

    /**
     * Add the header to the translation lookup
     *
     * @param array $translationLookup
     * @param array $launcherLookup
     * @param string $languageCode
     * @param string $languageName
     * @return array
     */
    protected function _AddHeader(
        array $translationLookup,
        array $launcherLookup,
        string $languageCode,
        string $languageName
    ): array {
        foreach($translationLookup as $parentPluginName => $contentArray) {

            $launcherJson = $launcherLookup[$parentPluginName] ?? '';

            $launcher = $this->_JsonDecode($launcherJson);
            $default = [
                'title' => '',
                'description' => ''
            ];
            $launcher = $this->_Default($default, $launcher);

            $header = [
                'version' => $this->_GetHeaderVersion($parentPluginName, $contentArray, $languageCode, $languageName),
                'launcher' => [
                    'title' => $launcher['title'],
                    'description' => $launcher['description']
                ],
                'data' => $contentArray
            ];

            $translationLookup[$parentPluginName] = $header;
        }

        return $translationLookup;
    }

    /**
     * Get the version header
     *
     * @param string $parentPluginName
     * @param array $contentArray
     * @param string $languageCode
     * @param string $languageName
     * @return array
     */
    protected function _GetHeaderVersion(
        string $parentPluginName,
        array $contentArray,
        string $languageCode,
        string $languageName
    ): array {

        $contentJson = $this->_JsonEncode($contentArray);

        return [
            'date' => $this->_TimeStamp(),
            'plugin' => $parentPluginName,
            'data_checksum' => md5($contentJson),
            'language' => $languageCode, // en
            'language_name' => $languageName, // english
            'language_name_local' => $languageName, // english
            'country' => '', // GB
            'country_name' => '', // Great Britain
            'file_type' => 'translate_file',
            'has_manual_translations' => 'false',
        ];
    }

    /**
     * LibreTranslate can do batch translations in one call,
     * but it has to be an array with all the text strings.
     * Later we will get an array with all the translated text strings and need to match them with the keys.
     *
     * @param array $translationLookup
     * @return array[]
     */
    protected function _GetLibreTranslateMessage(
        array $translationLookup = []
    ): array
    {
        $keyArray = [];
        $textArray = [];

        foreach ($translationLookup as $parentPluginName => $pluginItem) {
            $keyArray[] =  $parentPluginName.'.launcher.title';
            $textArray[] = $pluginItem['launcher']['title'];
            $keyArray[] =  $parentPluginName.'.launcher.description';
            $textArray[] = $pluginItem['launcher']['description'];
            $keyArray[] =  $parentPluginName.'.version.language_name_local';
            $textArray[] = $pluginItem['version']['language_name_local'];

            foreach ($pluginItem['data'] as $pluginName => $keyTextLookup) {
                foreach ($keyTextLookup as $key => $text) {
                    $keyArray[] = $parentPluginName.'.data.'.$pluginName.'.'.$key;
                    $textArray[] = $text;
                }
            }
        }

        return [
            'key_array' => $keyArray,
            'text_array' => $textArray
        ];
    }

    /**
     * We have the key->translated string.
     * We want them to be written to the translation lookup in the right place
     *
     * @param array $translationLookup
     * @param array $keyValueLookup
     * @return array
     */
    protected function _UpdateTranslationLookupWithTranslatedStrings(
        array $translationLookup,
        array $keyValueLookup
    ): array {
        foreach ($keyValueLookup as $key => $value) {
            $keyParts = explode('.', $key);
            $parentPluginName = $keyParts[0] ?? '';
            $area = $keyParts[1] ?? '';
            $pluginName = $keyParts[2] ?? '';

            // implode all $keyParts from 3 and onwards. In case we have "USE_THE_MENU._KEY" as the key, then the "." have split the string.
            $keyArray = array_slice($keyParts, 3);
            $key = implode('.', $keyArray);

            if ($key === '') {
                $translationLookup[$parentPluginName][$area][$pluginName] = $value;
                continue;
            }

            $translationLookup[$parentPluginName][$area][$pluginName][$key] = $value;
        }

        return $translationLookup;
    }

    /**
     * Return the parent plugin name
     * Example: infohub_storage_data_mysql will be infohub_storage
     * @param  string  $pluginName
     * @return string
     */
    protected function _GetParentPluginName(string $pluginName = ''): string
    {
        $parts = explode('_', $pluginName);
        if (count($parts) < 2) {
            return '';
        }
        $parentPluginName = $parts[0] . '_' . $parts[1];

        return $parentPluginName;
    }

    /**
     * Convert a key to a text
     * @param string $key
     * @return string
     */
    protected function keyToText(string $key = ''): string
    {
        if (str_contains($key, '+') === true) {
            $a=1;
        }

        // Remove _KEY suffix if it exists
        if (str_ends_with($key, '_KEY') === true) {
            $key = substr($key, 0, -4);
        }

        $text = strtolower($key);
        $text = str_replace('_', ' ', $text);

        // All new sentences should start with a capital letter
        $separator = '. ';
        $partArray = explode($separator, $text);
        foreach ($partArray as $index => $part) {
            $part = strtoupper(substr($part, 0, 1)) . substr($part, 1);
            $partArray[$index] = $part;
        }
        $text = implode($separator, $partArray);

        return $text;
    }

    /**
     * Convert a text to a key
     * @param string $text
     * @return string
     */
    protected function textToKey(string $text = ''): string
    {
        $key = strtoupper($text);
        $key = strtr($key, [' ' => '_']);

        $key = $key . '_KEY'; // These makes Google Translate avoid translating the single word key

        return $key;
    }
}