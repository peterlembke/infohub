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
if (basename(__FILE__) == basename($_SERVER["SCRIPT_FILENAME"])) {
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
     * @return mixed
     * @since   2019-03-23
     * @author  Peter Lembke
     * @version 2019-03-23
     */
    protected function _GetCmdFunctions(): array
    {
        $list = [
            'load_plugin_list' => 'normal',
            'get_doc_file' => 'normal',
            'create_translation_file' => 'normal'
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
                $options[] = ["type" => "option", "value" => $name, "label" => $name];
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
     * Get a doc file
     * @param array $in
     * @return array
     * @author  Peter Lembke
     * @version 2019-03-14
     * @since   2019-03-14
     */
    protected function get_doc_file(array $in = []): array
    {
        $default = [
            'file' => 'infohub_translate',
            'step' => 'step_read_doc_file',
            'response' => [
                'answer' => 'false',
                'message' => 'Nothing to report from get_doc_file',
                'contents' => '',
                'checksum' => ''
            ],
            'data_back' => []
        ];
        $in = $this->_Default($default, $in);

        if ($in['step'] === 'step_read_doc_file') {
            return $this->_SubCall(
                [
                    'to' => [
                        'node' => 'server',
                        'plugin' => 'infohub_file',
                        'function' => 'read'
                    ],
                    'data' => [
                        'path' => $in['file'] . '.md',
                        'folder' => 'plugin'
                    ],
                    'data_back' => [
                        'step' => 'step_end'
                    ]
                ]
            );
        }

        return [
            'answer' => $in['response']['answer'],
            'message' => $in['response']['message'],
            'contents' => $in['response']['contents'],
            'checksum' => $in['response']['checksum']
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
    protected function create_translation_file(array $in = []): array
    {
        $default = [
            'plugin_name' => '',
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

        if ($in['step'] === 'step_get_plugin_js_files_content') {
            $in['plugin_name'] = $this->_GetGrandPluginName($in['plugin_name']);
            return $this->_SubCall(
                [
                    'to' => [
                        'node' => 'server',
                        'plugin' => 'infohub_file',
                        'function' => 'get_plugin_js_files_content'
                    ],
                    'data' => [
                        'plugin_name' => $in['plugin_name']
                    ],
                    'data_back' => [
                        'plugin_name' => $in['plugin_name'],
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
                $out[$pluginName] = [];
                $offset = 0;
                $done = false;
                $codeLength = strlen($code);

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

                    if (empty($text) === false) {
                        if (isset($out[$pluginName]) === false) {
                            $out[$pluginName] = [];
                        }
                        $key = $this->textToKey($text);
                        $out[$pluginName][$key] = $text;
                    }

                    $offset = $textEnd + 2;
                }
            }

            $in['step'] = 'step_end';

            if (empty($out) === false) {
                $in['data_back']['out'] = $out;

                $in['step'] = 'step_create_header';
            }
        }

        if ($in['step'] === 'step_create_header') {
            $foundContent = $this->_JsonEncode($in['data_back']['out']);

            $header = [
                'version' => [
                    "date" => $this->_TimeStamp(),
                    "plugin" => $in['plugin_name'],
                    "data_checksum" => md5($foundContent),
                    'language' => 'en',
                    'country' => '',
                    'file_type' => 'translate_file'
                ],
                'data' => []
            ];

            $header['data'] = $in['data_back']['out'];
            $in['data_back']['out'] = $header;

            $in['response']['message'] = 'Here are the translation file';

            $in['step'] = 'step_end';
        }

        leave:
        return [
            'answer' => $in['response']['answer'],
            'message' => $in['response']['message'],
            'file' => $in['data_back']['out']
        ];
    }

    /**
     * Convert a key to a text
     * @param string $key
     * @return string
     */
    protected function keyToText(string $key = ''): string
    {
        // Remove _KEY suffix if it exist
        if (substr($key, -4, 4) === '_KEY') {
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
        $key = str_replace(' ', '_', $key);

        $key = $key . '_KEY'; // This makes Google translate avoid translating the single word key

        return $key;
    }
}