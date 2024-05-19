<?php
/**
 * Collect strings to translate
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
 * Collect strings to translate
 *
 * The server part of translate collects strings that should be translated
 *
 * @author      Peter Lembke <info@infohub.se>
 * @version     2019-03-23
 * @since       2019-03-23
 * @copyright   Copyright (c) 2019, Peter Lembke
 * @license     https://opensource.org/licenses/gpl-license.php GPL-3.0-or-later
 * @see         https://github.com/peterlembke/infohub/blob/master/folder/plugins/infohub/translate/infohub_translate.md Documentation
 * @link        https://infohub.se/ InfoHub main page
 */
class infohub_translate extends infohub_base
{
    /**
     * Version information for this plugin
     * @return  string[]
     * @since   2019-03-23
     * @author  Peter Lembke
     * @version 2019-03-23
     */
    protected function _Version(): array
    {
        return [
            'date' => '2019-03-23',
            'since' => '2019-03-23',
            'version' => '1.0.0',
            'class_name' => 'infohub_translate',
            'checksum' => '{{checksum}}',
            'note' => 'Creates template translation files you can copy to a new name and translate',
            'status' => 'normal',
            'SPDX-License-Identifier' => 'GPL-3.0-or-later',
            'user_role' => 'developer'
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
            'load_plugin_list' => 'normal',
            'create_translation_files' => 'normal',
            'translate_and_save' => 'normal',
            'update_plugins' => 'normal',
            'validate_translation_files' => 'normal',
            'get_language_option_list' => 'normal'
        ];

        return parent::_GetCmdFunctionsBase($list);
    }

    /**
     * Give a plugin name, example infohub_contact_menu
     * you get the main parent plugin name back, infohub_contact
     * @param string $pluginName
     * @return string
     */
    protected function _GetGrandPluginName(string $pluginName = ''): string
    {
        $grandPluginName = $pluginName;
        $parts = explode('_', $pluginName);
        if (count($parts) > 2) {
            $grandPluginName = $parts[0] . '_' . $parts[1];
        }

        return $grandPluginName;
    }

    /**
     * Load plugin list from infohub_file
     * @param array $in
     * @return array
     * @author  Peter Lembke
     * @version 2019-02-23
     * @since   2019-02-23
     */
    protected function load_plugin_list(array $in = []): array
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
            return $this->_SubCall(
                [
                    'to' => [
                        'node' => 'server',
                        'plugin' => 'infohub_file',
                        'function' => 'get_all_level1_plugin_names'
                    ],
                    'data' => [],
                    'data_back' => [
                        'step' => 'step_load_plugin_list_response'
                    ]
                ]
            );
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
     * Give a plugin name. Function examine the plugin and all children.
     * Builds a translation json file with all phrases from the plugin and its children.
     * @param array $in
     * @return array
     * @author  Peter Lembke
     * @version 2020-12-15
     * @since   2020-12-15
     */
    protected function create_translation_files(array $in = []): array
    {
        $default = [
            'plugin_name_array' => [],
            'file_download' => 'false',
            'file_save' => 'false',
            'step' => 'step_get_plugin_js_files_content',
            'response' => [
                'answer' => 'false',
                'message' => 'Nothing',
                'data' => [],
                'launcher' => [],
                'options' => [] // we get all available languages
            ],
            'data_back' => [
                'out' => []
            ]
        ];
        $in = $this->_Default($default, $in);

        $messageArray = [];

        if ($in['step'] === 'step_get_plugin_js_files_content') {
            return $this->_SubCall([
                'to' => [
                    'node' => 'server',
                    'plugin' => 'infohub_file',
                    'function' => 'get_plugin_js_files_content'
                ],
                'data' => [
                    'plugin_name_array' => $in['plugin_name_array']
                ],
                'data_back' => [
                    'file_save' => $in['file_save'],
                    'file_download' => $in['file_download'],
                    'step' => 'step_get_plugin_js_files_content_response'
                ]
            ]);
        }

        if ($in['step'] === 'step_get_plugin_js_files_content_response') {
            $in['step'] = 'step_pull_out_text_strings';
            if ($in['response']['answer'] === 'false') {
                goto leave;
            }
        }

        if ($in['step'] === 'step_pull_out_text_strings') {
            $find = '_Translate(';
            $findLength = strlen($find);

            $out = [];

            foreach ($in['response']['data'] as $pluginName => $code) {
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

                    if (isset($out[$parentPluginName]) === false) {
                        $out[$parentPluginName] = [];
                    }
                    if (isset($out[$parentPluginName][$pluginName]) === false) {
                        $out[$parentPluginName][$pluginName] = [];
                    }

                    $key = $this->textToKey($text);
                    $finalText = $this->keyToText($text);

                    $out[$parentPluginName][$pluginName][$key] = $finalText;
                }
            }

            $in['step'] = 'step_end';

            if (empty($out) === false) {
                $in['data_back']['out'] = $out;

                $in['step'] = 'step_create_header';
            }
        }

        if ($in['step'] === 'step_create_header') {

            foreach($in['data_back']['out'] as $parentPluginName => $contentArray) {
                $contentJson = $this->_JsonEncode($contentArray);

                $launcher = $this->_JsonDecode($in['response']['launcher'][$parentPluginName]);
                $default = [
                    'title' => '',
                    'description' => ''
                ];
                $launcher = $this->_Default($default, $launcher);

                $header = [
                    'version' => [
                        'date' => $this->_TimeStamp(),
                        'plugin' => $parentPluginName,
                        'data_checksum' => md5($contentJson),
                        'language' => 'en',
                        'language_name' => 'english',
                        'country' => 'GB',
                        'country_name' => 'Great Britain',
                        'file_type' => 'translate_file'
                    ],
                    'launcher' => [
                        'title' => $launcher['title'],
                        'description' => $launcher['description']
                    ],
                    'data' => $contentArray
                ];

                $in['data_back']['out'][$parentPluginName] = $header;
            }

            $in['response']['message'] = 'Here are the translation file';

            $in['step'] = 'step_file_save_or_download';
        }

        if ($in['step'] === 'step_file_save_or_download') {
            $in['step'] = 'step_file_download';
            if ($in['file_save'] === 'true') {
                $in['step'] = 'step_get_language_option_list';
            }
        }

        if ($in['step'] === 'step_get_language_option_list') {
            return $this->_SubCall([
                'to' => [
                    'node' => 'server',
                    'plugin' => 'infohub_libretranslate',
                    'function' => 'get_language_option_list'
                ],
                'data' => [
                ],
                'data_back' => [
                    'step' => 'step_get_language_option_list_response',
                    'out' => $in['data_back']['out']
                ]
            ]);
        }

        if ($in['step'] === 'step_get_language_option_list_response') {
            $optionArray = $in['response']['options'];
        }

        if ($in['step'] === 'step_translate_and_save') {

            // https://en.wikipedia.org/wiki/List_of_languages_by_total_number_of_speakers

            $headerData = [
                'en' => [
                    'language' => 'en',
                    'language_name' => 'english',
                    'country' => 'GB',
                    'country_name' => 'Great Britain',
                ],
                'zh' => [
                    'language' => 'zh',
                    'language_name' => 'chinese',
                    'country' => 'CN',
                    'country_name' => 'China'
                ],
                'hi' => [
                    'language' => 'hi',
                    'language_name' => 'hindi',
                    'country' => 'IN',
                    'country_name' => 'India',
                ],
                'es' => [
                    'language' => 'es',
                    'language_name' => 'spanish',
                    'country' => 'ES',
                    'country_name' => 'Spain',
                ],
                'sv' => [
                    'language' => 'sv',
                    'language_name' => 'swedish', // My language
                    'country' => 'SE',
                    'country_name' => 'Sweden',
                ],
            ];

            foreach($in['data_back']['out'] as $parentPluginName => $contentArray) {

                if (empty($contentArray) === true) {
                    continue;
                }

                foreach ($headerData as $languageCode => $localizedHeaderData) {

                    $path = 'translate' . DS . str_replace('_', '/', $parentPluginName) . DS . "$languageCode.json";

                    $contentArray['version'] = array_merge($contentArray['version'], $localizedHeaderData);

                    $messageOut = $this->_SubCall([
                        'to' => [
                            'node' => 'server',
                            'plugin' => 'infohub_translate',
                            'function' => 'translate_and_save'
                        ],
                        'data' => [
                            'path' => $path,
                            'from_language' => 'en',
                            'to_language' => $languageCode,
                            'translation_lookup' => $contentArray,
                            'allow_overwrite' => 'true',
                        ],
                        'data_back' => [
                            'step' => 'step_end'
                        ]
                    ]);
                    $messageArray[] = $messageOut;
                }
            }

            $in['step'] = 'step_file_download';
        }

        if ($in['step'] === 'step_file_download') {
            if ($in['file_download'] === 'false') {
                $in['data_back']['out'] = [];
            }
        }

        leave:
        return [
            'answer' => $in['response']['answer'],
            'message' => $in['response']['message'],
            'file_lookup' => $in['data_back']['out'],
            'messages' => $messageArray
        ];
    }

    /**
     * Get the english translation file.
     * Get the localised header data
     * Pull out the destination language
     * Translate the data by calling libretranslate in a lot of tail less messages
     * Save the translated file
     * @param  array  $in
     * @return string[]
     */
    public function translate_and_save(
        array $in = []
    ): array {
        $default = [
            'step' => 'step_file_save',
            'path' => '',
            'from_language' => '',
            'to_language' => '',
            'translation_lookup' => [],
            'allow_overwrite' => 'true',
            'response' => [
                'answer' => 'false',
                'message' => 'Nothing to report'
            ],
            'from_plugin' => [
                'node' => '',
                'plugin' => ''
            ]
        ];
        $in = $this->_Default($default, $in);

        if ($in['from_plugin']['node'] !== 'server') {
            return [
                'answer' => 'false',
                'message' => 'I only accept messages from the server node'
            ];
        }

        if ($in['from_plugin']['plugin'] !== 'infohub_translate') {
            return [
                'answer' => 'false',
                'message' => 'I only accept messages from the translate plugin'
            ];
        }

        if ($in['step'] === 'step_translate') {

            // TODO: Loop through the data and create a message that Darkhold can process

            return $this->_SubCall([
                'to' => [
                    'node' => 'server',
                    'plugin' => 'infohub_libretranslate',
                    'function' => 'translate'
                ],
                'data' => [
                    'from_language' => $in['from_language'],
                    'to_language' => $in['to_language'],
                    'translation_lookup' => $in['translation_lookup']
                ],
                'data_back' => [
                    'path' => $in['path'],
                    'translation_lookup' => $in['translation_lookup'],
                    'allow_overwrite' => $in['allow_overwrite'],
                    'step' => 'step_file_save'
                ]
            ]);
        }

        if ($in['step'] === 'step_file_save') {

            $contentsJson = $this->_JsonEncode($in['translation_lookup']);

            return $this->_SubCall([
                'to' => [
                    'node' => 'server',
                    'plugin' => 'infohub_file',
                    'function' => 'write'
                ],
                'data' => [
                    'path' => $in['path'],
                    'contents' => $contentsJson,
                    'allow_overwrite' => $in['allow_overwrite']
                ],
                'data_back' => [
                    'step' => 'step_end'
                ]
            ]);
        }

        return [
            'answer' => 'true',
            'message' => 'Sent file to be saved'
        ];
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

    /**
     * Give a list with plugin names.
     * Function adds the child plugin names to the list.
     * Then walk through each plugin. Read the contents with the help of infohub_file.
     * Paste the contents to a sub function.
     * If changes was made then save the new plugin to the File folder with the help of infohub_file.
     *
     * @param array $in
     * @return array
     * @author  Peter Lembke
     * @version 2021-08-15
     * @since   2021-08-15
     */
    protected function update_plugins(array $in = []): array
    {
        $default = [
            'plugin_name_array' => [],
            'step' => 'step_get_plugin_js_files_content',
            'response' => [
                'answer' => 'false',
                'message' => 'Nothing',
                'data' => []
            ],
            'data_back' => [
                'out' => []
            ]
        ];
        $in = $this->_Default($default, $in);

        $messageArray = [];

        if ($in['step'] === 'step_get_plugin_js_files_content') {
            return $this->_SubCall(
                [
                    'to' => [
                        'node' => 'server',
                        'plugin' => 'infohub_file',
                        'function' => 'get_plugin_js_files_content'
                    ],
                    'data' => [
                        'plugin_name_array' => $in['plugin_name_array']
                    ],
                    'data_back' => [
                        'step' => 'step_get_plugin_js_files_content_response'
                    ]
                ]
            );
        }

        if ($in['step'] === 'step_get_plugin_js_files_content_response') {
            $in['step'] = 'step_pull_out_text_strings';
            if ($in['response']['answer'] === 'false') {
                goto leave;
            }
        }

        if ($in['step'] === 'step_pull_out_text_strings') {

            $find = '_Translate(';
            $findLength = strlen($find);

            $out = [];

            foreach ($in['response']['data'] as $pluginName => $code) {
                $offset = 0;
                $done = false;
                $codeLength = strlen($code);
                $changed = false;

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

                    $keyValid = $this->_KeyValid($text);
                    if ($keyValid === true) {
                        continue;
                    }

                    $key = strtoupper($text);
                    $key = str_replace($search = ' ', $replace = '_', $key);

                    $code = substr($code, 0, $textStart) . $key . substr($code, $textEnd);
                    $changed = true;
                }

                if ($changed === true) {
                    $out[$pluginName] = $code;
                }
            }

            $in['step'] = 'step_end';

            if (empty($out) === false) {
                $in['data_back']['out'] = $out;
                $in['step'] = 'step_create_plugins';
            }
        }

        if ($in['step'] === 'step_create_plugins') {

            foreach ($in['data_back']['out'] as $pluginName => $contents) {

                if (empty($contents) === true) {
                    continue;
                }

                $path = 'plugins' . DS . $pluginName . '.js';

                $messageOut = $this->_SubCall([
                    'to' => [
                        'node' => 'server',
                        'plugin' => 'infohub_file',
                        'function' => 'write'
                    ],
                    'data' => [
                        'path' => $path,
                        'contents' => $contents,
                        'allow_overwrite' => 'true'
                    ],
                    'data_back' => []
                ]);
                $messageArray[] = $messageOut;
            }
        }

        leave:
        return [
            'answer' => $in['response']['answer'],
            'message' => $in['response']['message'],
            'plugins_created' => array_keys($in['data_back']['out']),
            'messages' => $messageArray
        ];
    }

    /**
     * Check if the key is valid
     * @param  string  $key
     * @return bool
     */
    protected function _KeyValid(string $key = ''): bool {

        if (strtoupper($key) !== $key) {
            return false; // There are lower case characters in the key
        }

        if (str_contains($key, ' ') === true) {
            return false; // There are spaces in the key
        }

        if (str_contains($key, '\\') === true) {
            return false; // There are backslash in the key
        }

        return true;
    }

    /**
     * Give a plugin name. Pulls out all translation files and validate each of them.
     * Then compare each translation file with en.json to find differences in the properties
     * Returns an array with strings that describe what has been found
     *
     * @param array $in
     * @return array
     * @author  Peter Lembke
     * @version 2021-08-15
     * @since   2021-08-15
     */
    protected function validate_translation_files(array $in = []): array
    {
        $default = [
            'plugin_name_array' => [],
            'step' => 'step_get_translation_files',
            'response' => [
                'answer' => 'false',
                'message' => 'Nothing',
                'data' => []
            ],
            'data_back' => [
                'log' => [],
                'latest_plugin_name' => ''
            ]
        ];
        $in = $this->_Default($default, $in);

        if ($in['step'] === 'step_get_translation_files_response') {

            $pluginName = $in['data_back']['latest_plugin_name'];

            if ($in['response']['answer'] === 'false') {
                $message = $in['response']['message'];
                $in['data_back']['log'][] = "$pluginName: $message";
                $in['step'] = 'step_end';
            }

            if ($in['response']['answer'] === 'true') {
                $response = $this->internal_Cmd([
                    'func' => 'ValidateLanguageFiles',
                    'translation_file_array' => $in['response']['data'],
                    'plugin_name' => $in['data_back']['latest_plugin_name']
                ]);
                $in['data_back']['log'][$pluginName] = $response['log'];
                $in['step'] = 'step_get_translation_files';
            }
        }

        if ($in['step'] === 'step_get_translation_files') {
            if (count($in['plugin_name_array']) > 0) {
                $pluginName = array_pop($in['plugin_name_array']);
                return $this->_SubCall(
                    [
                        'to' => [
                            'node' => 'server',
                            'plugin' => 'infohub_file',
                            'function' => 'get_translation_files'
                        ],
                        'data' => [
                            'plugin_name' => $pluginName
                        ],
                        'data_back' => [
                            'plugin_name_array' => $in['plugin_name_array'],
                            'log' => $in['data_back']['log'],
                            'latest_plugin_name' => $pluginName,
                            'step' => 'step_get_translation_files_response'
                        ]
                    ]
                );
            }
        }

        return [
            'answer' => $in['response']['answer'],
            'message' => $in['response']['message'],
            'data' => $in['data_back']['log']
        ];
    }

    /**
     * Uses the array from infohub_file->get_translation_files
     * and does the tests on them
     * @param  array  $in
     * @return array
     */
    protected function internal_ValidateLanguageFiles(array $in = []): array {
        $default = [
            'translation_file_array' => []
        ];
        $in = $this->_Default($default, $in);

        $mainLanguage = 'en';
        $log = [];

        $default = [
            'version' => [
                'date' => '',
                'plugin' => '',
                'data_checksum' => '',
                'language' => '',
                'country' => '',
                'file_type' => ''
            ],
            'launcher' => [
                'title' => '',
                'description' => ''
            ],
            'data' => []
        ];

        $translationFileArray = $in['translation_file_array'];
        if (empty($translationFileArray) === true) {
            goto leave;
        }
        
        foreach ($translationFileArray as $languageCode => $contentString) {

            $contentArray = $this->_JsonDecode($contentString);

            if (empty($contentArray) === true) {
                unset($translationFileArray[$languageCode]);

                $row = 'File could not be JSON decoded. Use an online validator like https://jsonlint.com/ to find the json issue';
                $log = $this->_ToLog($log, $languageCode, $row);
                continue;
            }

            $log = $this->_CheckKeyHasData($default, $contentArray, $languageCode, $log, $prefix = '', $suffix = 'missing');
            $translationFileArray[$languageCode] = $contentArray;
        }

        if (isset($translationFileArray[$mainLanguage]) === false) {
            $row = 'English language file missing';
            $log = $this->_ToLog($log, $mainLanguage, $row);
            goto leave;
        }

        $mainData = $translationFileArray[$mainLanguage];

        $prefix = '';
        foreach ($translationFileArray as $languageCode => $contentArray) {
            $log = $this->_CheckKeyHasData($mainData['data'], $contentArray['data'], $languageCode, $log, $prefix, $suffix = 'missing');
            $log = $this->_CheckKeyHasData($contentArray['data'], $mainData['data'], $languageCode, $log, $prefix, $suffix = 'deprecated');
        }

        leave:
        return [
            'answer' => 'true',
            'message' => 'Done validating the file. See the log',
            'log' => $log
        ];
    }

    /**
     * Recursive function that logs if a key is missing in data2
     * @param  array  $data1
     * @param  array  $data2
     * @param  string  $languageCode
     * @param  array  $log
     * @param  string  $prefix
     * @param  string  $suffix
     * @return array
     */
    protected function _CheckKeyHasData(
        array $data1 = [],
        array $data2 = [],
        string $languageCode = '',
        array $log = [],
        string $prefix = '',
        string $suffix = ''
    ): array {
        foreach ($data1 as $key => $value) {
            $nextPrefix = $this->_GetNextPrefix($prefix, $key);
            if (isset($data2[$key]) === false) {
                $row = "Key `$nextPrefix` $suffix";
                $log = $this->_ToLog($log, $languageCode, $row);
                continue;
            }
            if (empty($data2[$key]) === true) {
                $row = "Key `$nextPrefix` has no data";
                $log = $this->_ToLog($log, $languageCode, $row);
                continue;
            }
            if (is_array($value) === true && is_array($data2[$key]) === false) {
                $row = "Key `$nextPrefix` should be an array";
                $log = $this->_ToLog($log, $languageCode, $row);
                continue;
            }
            if (is_array($value) === true && is_array($data2[$key]) === true) {
                $log = $this->_CheckKeyHasData($value, $data2[$key], $languageCode, $log, $nextPrefix, $suffix);
            }
        }
        return $log;
    }

    /**
     * Gives you the next prefix
     * @param  string  $prefix
     * @param  string  $key
     * @return string
     */
    protected function _GetNextPrefix(
        string $prefix = '',
        string $key = ''
    ): string {
        $nextPrefix = $prefix;
        if ($nextPrefix !== '' && $key !== '') {
            $nextPrefix = $nextPrefix . '->';
        }
        $nextPrefix = $nextPrefix . $key;

        return $nextPrefix;
    }

    /**
     * Put a string into the log
     * @param  array  $log
     * @param  string  $languageCode
     * @param  string  $row
     * @return array
     */
    protected function _ToLog(
        array $log = [],
        string $languageCode = '',
        string $row = ''
    ): array {

        if ($row === '' || $languageCode === '') {
            return $log;
        }

        if (isset($log[$languageCode]) === false) {
            $log[$languageCode] = [];
        }

        $log[$languageCode][] = $row;

        return $log;
    }

    /**
     * Get all available languages that LibreTranslate can translate to
     * @param  array  $in
     * @return array
     */
    protected function get_language_option_list(
        array $in = []
    ): array {

        $default = [
            'config' => [
                'libre_translate' => [
                    'url' => '',
                    'port' => 0
                ]
            ],
            'step' => 'step_start',
            'response' => [],
            'data_back' => []
        ];
        $in = $this->_Default($default, $in);

        if ($in['step'] === 'step_start') {
            return $this->_SubCall([
                'to' => [
                    'node' => 'server',
                    'plugin' => 'infohub_call',
                    'function' => 'call'
                ],
                'data' => [
                    'url' => $in['config']['libre_translate']['url'] . '/languages',
                    'port' => $in['config']['libre_translate']['port'],
                    'curl_logging' => 'true'
                ],
                'data_back' => [
                    'step' => 'step_start_response'
                ]
            ]);
        }

        if ($in['step'] === 'step_start_response') {
            $default = [
                'answer' => 'true',
                'message' => 'Got response',
                'error' => '',
                'request_array' => [],
                'response_string' => '',
                'curl_info' => [],
                'code' => 0,
                'curl_log' => []
            ];
            $in['response'] = $this->_Default($default, $in['response']);

        }

        return [];
    }
}