<?php
/**
 * Uses Libre Translate. You can manually translate things or send a message to be translated.
 *
 * @package     Infohub
 * @subpackage  infohub_libretranslate
 */

declare(strict_types=1);
if (basename(__FILE__) == basename($_SERVER["SCRIPT_FILENAME"])) {
    exit; // This file must be included, not called directly
}

/**
 * Uses Libre Translate. You can manually translate things or send a message to be translated.
 *
 * @author      Peter Lembke <info@infohub.se>
 * @version     2021-09-16
 * @since       2021-09-16
 * @copyright   Copyright (c) 2021, Peter Lembke
 * @license     https://opensource.org/licenses/gpl-license.php GPL-3.0-or-later
 * @see         https://github.com/peterlembke/infohub/blob/master/folder/plugins/infohub/libretranslate/infohub_libretranslate.md Documentation
 * @link        https://infohub.se/ InfoHub main page
 */
class infohub_libretranslate extends infohub_base
{
    /**
     * Version information for this plugin
     * @return  string[]
     * @since   2021-09-16
     * @author  Peter Lembke
     * @version 2021-09-16
     */
    protected function _Version(): array
    {
        return [
            'date' => '2021-09-16',
            'since' => '2021-09-16',
            'version' => '1.0.0',
            'class_name' => 'infohub_libretranslate',
            'checksum' => '{{checksum}}',
            'note' => 'Uses Libre Translate. You can manually translate things or send a message to be translated.',
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
     * @version 2021-09-16
     * @since   2021-09-16
     */
    protected function _GetCmdFunctions(): array
    {
        $list = [
            'translate' => 'normal',
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
     * Call libre translate to get this translated
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
     * Get the list with languages that libre translate can handle
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
}