<?php
declare(strict_types=1);
if (basename(__FILE__) == basename($_SERVER["SCRIPT_FILENAME"])) {
    exit; // This file must be included, not called directly
}

/**
 * infohub_translate show what the core can do
 * @category InfoHub
 * @package translate
 * @copyright Copyright (c) 2019, Peter Lembke, CharZam soft
 * @author Peter Lembke <peter.lembke@infohub.se>
 * @link https://infohub.se/ InfoHub main page
 * @license InfoHub is distributed under the terms of the GNU General Public License
 * InfoHub is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * InfoHub is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 * You should have received a copy of the GNU General Public License
 * along with InfoHub.    If not, see <https://www.gnu.org/licenses/>.
 */
class infohub_translate extends infohub_base
{
    protected final function _Version(): array
    {
        return array(
            'date' => '2019-03-23',
            'since' => '2019-03-23',
            'version' => '1.0.0',
            'class_name' => 'infohub_translate',
            'checksum' => '{{checksum}}',
            'note' => 'Creates template translation files you can copy to a new name and translate',
            'status' => 'normal',
            'SPDX-License-Identifier' => 'GPL-3.0-or-later',
            'user_role' => 'developer'
        );
    }

    protected function _GetCmdFunctions(): array
    {
        $list = array(
            'create_template_file' => 'normal',
            'import_translated_file' => 'normal',
            'update_existing_files_with_additional_data' => 'normal',
            'get_doc_file' => 'normal'
        );

        return parent::_GetCmdFunctionsBase($list);
    }

    /**
     * Give a plugin name, example infohub_contact_menu
     * you get the main parent plugin name back, infohub_contact
     * @param type $pluginName
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
     * Give a plugin name. Function examine the plugin and all children.
     * Builds a translate/template1.json with all phrases on the left side and a number on the right side
     * and another file translate/template2.json with numbers on the left side and the phrases on the right side.
     * You can then copy the template2 data and translate it in Google Translate. Save the result in a new file import.json
     * Then run import_translated_file
     * @version 2019-03-24
     * @since   2019-03-23
     * @author  Peter Lembke
     * @param array $in
     * @return array
     */
    final protected function create_template_file(array $in = array()): array
    {
        $default = array(
            'plugin_name' => '',
            'step' => 'step_get_plugin_js_files_content',
            'response' => array(
                'answer' => 'false',
                'message' => 'Nothing',
                'data' => array()
            ),
            'data_back' => array(
                'out1' => array(),
                'out2' => array()
            )
        );
        $in = $this->_Default($default, $in);

        if ($in['step'] === 'step_get_plugin_js_files_content') {
            $in['plugin_name'] = $this->_GetGrandPluginName($in['plugin_name']);
            return $this->_SubCall(array(
                'to' => array(
                    'node' => 'server',
                    'plugin' => 'infohub_file',
                    'function' => 'get_plugin_js_files_content'
                ),
                'data' => array(
                    'plugin_name' => $in['plugin_name']
                ),
                'data_back' => array(
                    'plugin_name' => $in['plugin_name'],
                    'step' => 'step_get_plugin_js_files_content_response'
                )
            ));
        }

        if ($in['step'] === 'step_get_plugin_js_files_content_response')
        {
            $in['step'] = 'step_pull_out_text_strings';
            if ($in['response']['answer'] === 'false') {
                goto leave;
            }
        }

        if ($in['step'] === 'step_pull_out_text_strings')
        {
            $find = '_Translate(';
            $findLength = strlen($find);

            $out1 = array();
            $out2 = array();

            $number = 0;

            foreach ($in['response']['data'] as $pluginName => $code)
            {
                $out[$pluginName] = array();
                $offset = 0;
                $done = false;
                $codeLength = strlen($code);

                while ($done === false)
                {
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

                    $textStart = $position + $findLength +1;

                    $findEnd = $blip . ')';
                    $textEnd = strpos($code, $findEnd, $textStart);

                    if ($textEnd === false) {
                        $done = true;
                        continue;
                    }

                    $textLength = $textEnd - $textStart;
                    $text = substr($code, $textStart, $textLength);

                    if (empty($text) === false) {

                        if (isset($out1[$pluginName]) === false) {
                            $out1[$pluginName] = array();
                        }
                        if (isset($out2[$pluginName]) === false) {
                            $out2[$pluginName] = array();
                        }

                        $numberString = 'A' . (string) $number;

                        $out1[$pluginName][$text] = $numberString;
                        $out2[$pluginName][$numberString] = $text;

                        $number++;
                    }

                    $offset = $textEnd + 2;
                }
            }

            $in['step'] = 'step_end';

            if (empty($out1) === false && empty($out2) === false) {
                $in['data_back']['out1'] = $out1;
                $in['data_back']['out2'] = $out2;

                $in['step'] = 'step_create_header';
            }

        }

        if ($in['step'] === 'step_create_header')
        {
            $foundContent = $this->_JsonEncode($in['data_back']['out1']);

            $header = array(
                'version' => array(
                    "date" => $this->_TimeStamp(),
                    "plugin" => $in['plugin_name'],
                    "data_checksum" => md5($foundContent),
                    'language' => '',
                    'country' => '',
                    'file_type' => 'key_file'
                ),
                'data' => array()
            );

            $header['data'] = $in['data_back']['out1'];
            $in['data_back']['out1'] = $header;

            $header['data'] = $in['data_back']['out2'];
            $header['version']['file_type'] = 'translate_file';
            $in['data_back']['out2'] = $header;

            $in['response']['message'] = 'Here are the two files';

            $in['step'] = 'step_end';
        }

        /*
        if ($in['step'] === 'step_save_template1')
        {
            $path = $in['plugin_name'] . DS . 'template1.json';
            $contents = $this->_JsonEncode($in['data_back']['out1']);
            return $this->_SubCall(array(
                'to' => array(
                    'node' => 'server',
                    'plugin' => 'infohub_file',
                    'function' => 'write'
                ),
                'data' => array(
                    'path' => $path,
                    'contents' => $contents,
                    'allow_overwrite' => 'true'
                ),
                'data_back' => array(
                    'plugin_name' => $in['plugin_name'],
                    'out2' => $in['data_back']['out2'],
                    'step' => 'step_save_template1_response'
                )
            ));
        }

        if ($in['step'] === 'step_save_template1_response') {
            $in['step'] = 'step_save_template2';
            if ($in['response']['answer'] === 'false') {
                goto leave;
            }
        }

        if ($in['step'] === 'step_save_template2') {
            $path = $in['plugin_name'] . DS . 'template2.json';
            $contents = $this->_JsonEncode($in['data_back']['out2']);
            return $this->_SubCall(array(
                'to' => array(
                    'node' => 'server',
                    'plugin' => 'infohub_file',
                    'function' => 'write'
                ),
                'data' => array(
                    'path' => $path,
                    'contents' => $contents,
                    'allow_overwrite' => 'true'
                ),
                'data_back' => array(
                    'step' => 'step_save_template2_response'
                )
            ));
        }

        if ($in['step'] === 'step_save_template2_response') {
            $in['step'] = 'step_end';
        }
        */

        leave:
        return array(
            'answer' => $in['response']['answer'],
            'message' => $in['response']['message'],
            'file1' => $in['data_back']['out1'],
            'file2' => $in['data_back']['out2'],
        );
    }

    /**
     * Load plugin list from infohub_file
     * @version 2019-02-23
     * @since   2019-02-23
     * @author  Peter Lembke
     * @param array $in
     * @return array
     */
    final protected function load_plugin_list(array $in = array()): array
    {
        $default = array(
            'step' => 'step_load_plugin_list',
            'response' => array(),
            'data_back' => array()
        );
        $in = $this->_Default($default, $in);

        $answer = 'false';
        $message = 'Nothing to report from load_plugin_data';
        $ok = 'false';
        $pluginList = array();
        $options = array();

        if ($in['step'] === 'step_load_plugin_list') {
            return $this->_SubCall(array(
                'to' => array(
                    'node' => 'server',
                    'plugin' => 'infohub_file',
                    'function' => 'get_all_level1_plugin_names'
                ),
                'data' => array(),
                'data_back' => array(
                    'step' => 'step_load_plugin_list_response'
                )
            ));
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
                $options[] = array("type" => "option", "value" => $name, "label" => $name);
            }
            $ok = 'true';

        }

        return array(
            'answer' => $answer,
            'message' => $message,
            'plugin_list' => $pluginList,
            'options' => $options,
            'ok' => $ok
        );
    }

    /**
     * Get a doc file
     * @version 2019-03-14
     * @since   2019-03-14
     * @author  Peter Lembke
     * @param array $in
     * @return array
     */
    final protected function get_doc_file(array $in = array()): array
    {
        $default = array(
            'file' => 'infohub_translate',
            'step' => 'step_read_doc_file',
            'response' => array(
                'answer' => 'false',
                'message' => 'Nothing to report from get_doc_file',
                'contents' => '',
                'checksum' => ''
            ),
            'data_back' => array()
        );
        $in = $this->_Default($default, $in);

        if ($in['step'] === 'step_read_doc_file') {
            return $this->_SubCall(array(
                'to' => array(
                    'node' => 'server',
                    'plugin' => 'infohub_file',
                    'function' => 'read'
                ),
                'data' => array(
                    'path' => $in['file'] . '.md',
                    'folder' => 'plugin'
                ),
                'data_back' => array(
                    'step' => 'step_end'
                )
            ));
        }

        return array(
            'answer' => $in['response']['answer'],
            'message' => $in['response']['message'],
            'contents' => $in['response']['contents'],
            'checksum' => $in['response']['checksum']
        );
    }

}