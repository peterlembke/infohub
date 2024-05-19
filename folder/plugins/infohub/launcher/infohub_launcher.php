<?php
/**
 * Start plugins
 *
 * Support class for the javascript plugin with the same name that launch plugins in the client workbench
 * Purpose is to as quickly as possible provide data about plugins that can be launched.
 *
 * @package     Infohub
 * @subpackage  infohub_launcher
 */

declare(strict_types=1);
if (basename(__FILE__) == basename($_SERVER['SCRIPT_FILENAME'])) {
    exit; // This file must be included, not called directly
}

/**
 * Calculates your checksum
 *
 * Calculates checksum for MD5, CRC32, Soundex, Metaphone, Double methaphone, Luhn, Personnummer
 * You also get an option list with them all
 *
 * @author      Peter Lembke <info@infohub.se>
 * @version     2018-11-18
 * @since       2017-12-03
 * @copyright   Copyright (c) 2017, Peter Lembke
 * @license     https://opensource.org/licenses/gpl-license.php GPL-3.0-or-later
 * @see         https://github.com/peterlembke/infohub/blob/master/folder/plugins/infohub/launcher/infohub_launcher.md Documentation
 * @link        https://infohub.se/ InfoHub main page
 */
class infohub_launcher extends infohub_base
{
    /**
     * Version information for this plugin
     * @return  string[]
     * @since   2017-12-03
     * @author  Peter Lembke
     * @version 2018-11-18
     */
    protected function _Version(): array
    {
        return [
            'date' => '2018-11-18',
            'since' => '2017-12-03',
            'version' => '1.0.0',
            'class_name' => 'infohub_launcher',
            'checksum' => '{{checksum}}',
            'note' => 'Download client side data that the launcher need to work',
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
     * @version 2018-11-18
     * @since   2017-12-03
     */
    protected function _GetCmdFunctions(): array
    {
        $list = [
            'get_full_list' => 'normal'
        ];

        return parent::_GetCmdFunctionsBase($list);
    }

    /**
     * Get a new updated full_list of all plugins that have a launcher.json file.
     * The list key is plugin name, the data is the checksums of files launcher.json, icon/icon.svg, icon/icon.json
     *
     * @param  array  $in
     * @return array
     * @since   2018-11-14
     * @author  Peter Lembke
     * @version 2018-11-18
     */
    protected function get_full_list(array $in = []): array
    {
        $default = [
            'list_checksum' => '',
            'with_assets' => 'false',
            'language_codes' => [],
            'allowed_asset_types' => [],
            'max_asset_size_kb' => 0,
            'step' => 'step_get_full_list',
            'from_plugin' => [
                'node' => '',
                'plugin' => '',
                'function' => ''
            ],
            'config' => [
                'client_plugin_names' => []
            ],
            'response' => [
                'answer' => 'false',
                'message' => 'Nothing to report from server -> infohub_launcher -> get_full_list',
                'data' => []
            ],
            'data_back' => [

            ]
        ];
        $in = $this->_Default($default, $in);

        $answer = 'false';
        $message = 'Nothing to report';
        $fullList = [
            'list' => []
        ];
        $assets = [];

        if ($in['step'] === 'step_get_full_list') {
            return $this->_Subcall([
                'to' => [
                    'node' => 'server',
                    'plugin' => 'infohub_file',
                    'function' => 'launcher_get_full_list'
                ],
                'data' => [],
                'data_back' => [
                    'list_checksum' => $in['list_checksum'],
                    'config' => [
                        'client_plugin_names' => $in['config']['client_plugin_names']
                    ],
                    'with_assets' => $in['with_assets'],
                    'language_codes' => $in['language_codes'],
                    'allowed_asset_types' => $in['allowed_asset_types'],
                    'max_asset_size_kb' => $in['max_asset_size_kb'],
                    'step' => 'step_get_full_list_response'
                ]
            ]);
        }

        if ($in['step'] === 'step_get_full_list_response') {
            $answer = $in['response']['answer'];
            $message = $in['response']['message'];
            $in['step'] = 'step_end';

            if ($answer === 'true') {
                $in['step'] = 'step_prepare_full_list';
            }
        }

        if ($in['step'] === 'step_prepare_full_list') {
            $list = $in['response']['data'];
            ksort($list);

            // Remove the plugins you do not have rights to use on the client
            $removedSomePluginsBecauseNoRights = 'false';
            foreach ($list as $pluginName => $dummy) {
                if (isset($in['config']['client_plugin_names'][$pluginName]) === false) {
                    unset($list[$pluginName]);
                    $removedSomePluginsBecauseNoRights = 'true';
                }
            }

            $listChecksum = md5($this->_JsonEncode($list));

            $do = 'update';
            if ($listChecksum === $in['list_checksum']) {
                $do = 'keep';
                $list = [];
            }

            $fullList = [
                'name' => 'full_list',
                'do' => $do,
                'micro_time' => $this->_MicroTime(),
                'time_stamp' => $this->_TimeStamp(),
                'list_checksum' => $listChecksum,
                'list' => $list,
                'removed_some_plugins_because_no_rights' => $removedSomePluginsBecauseNoRights
            ];

            $answer = 'true';
            $message = 'Here are the full_list';

            if ($removedSomePluginsBecauseNoRights === 'true') {
                $message = $message . '. I had to remove some plugins from the list because you do not have all rights.';
            }

            if (empty($in['config']['client_plugin_names']) === true) {
                $message = 'You do not have rights to ANY client plugin. An account in the database overrule infohub_contact.json.';
                $answer = 'false';
            }

            $in['step'] = 'step_end';
            if ($answer === 'true' && $in['list_checksum'] === '' && $in['with_assets'] === 'true') {
                $in['step'] = 'step_with_assets';
            }
        }

        if ($in['step'] === 'step_with_assets') {
            $wantedAssets = [];
            foreach ($fullList['list'] as $pluginName => $assetLookup) {
                foreach ($assetLookup as $assetName => $assetChecksum) {
                    $assetPath = "infohub_asset/asset/$pluginName/$assetName";
                    $wantedAssets[$assetPath] = '';
                }
                foreach ($in['language_codes'] as $languageCode) {
                    $assetPath = "infohub_asset/asset/$pluginName/translate/$languageCode.json";
                    $wantedAssets[$assetPath] = '';
                }
            }
            return $this->_SubCall([
                'to' => [
                    'node' => 'server',
                    'plugin' => 'infohub_asset',
                    'function' => 'update_specific_assets'
                ],
                'data' => [
                    'assets_requested' => $wantedAssets,
                    'allowed_asset_types' => $in['allowed_asset_types'],
                    'max_asset_size_kb' => $in['max_asset_size_kb'],
                ],
                'data_back' => [
                    'list_checksum' => $in['list_checksum'],
                    'language_codes' => $in['language_codes'],
                    'with_assets' => $in['with_assets'],
                    'allowed_asset_types' => $in['allowed_asset_types'],
                    'max_asset_size_kb' => $in['max_asset_size_kb'],
                    'step' => 'step_with_assets_response',
                    'message' => $message,
                    'full_list' => $fullList
                ]
            ]);
        }

        if ($in['step'] === 'step_with_assets_response') {
            if ($in['response']['answer'] === 'true') {
                $answer = 'true';
                $message = $in['data_back']['message'] ?? '';
                $message = $message . ' Also added assets on your request';
                $assets = $in['response']['data'];
                $fullList = $in['data_back']['full_list'];
            }
        }

        return [
            'answer' => $answer,
            'message' => $message,
            'data' => $fullList,
            'assets' => $assets
        ];
    }
}
