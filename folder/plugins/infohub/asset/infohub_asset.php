<?php
/**
 * infohub_asset support the client side infohub_asset with assets for a plugin.
 *
 * Support class for the javascript plugin with the same name that launch plugins in the client workbench
 * Purpose is to as quickly as possible provide data about plugins that can be launched.
 *
 * @package     Infohub
 * @subpackage  infohub_asset
 */

declare(strict_types=1);
if (basename(__FILE__) == basename($_SERVER["SCRIPT_FILENAME"])) {
    exit; // This file must be included, not called directly
}

/**
 * infohub_asset support the client side infohub_asset with assets for a plugin.
 *
 * Support class for the javascript plugin with the same name that launch plugins in the client workbench
 * Purpose is to as quickly as possible provide data about plugins that can be launched.
 *
 * @author      Peter Lembke <info@infohub.se>
 * @version     2018-01-22
 * @since       2017-12-03
 * @copyright   Copyright (c) 2017, Peter Lembke
 * @license     https://opensource.org/licenses/gpl-license.php GPL-3.0-or-later
 * @see         https://github.com/peterlembke/infohub/blob/master/folder/plugins/infohub/asset/infohub_asset.md Documentation
 * @link        https://infohub.se/ InfoHub main page
 */
class infohub_asset extends infohub_base
{
    /**
     * Version information for this plugin
     * @version 2018-01-22
     * @since   2017-12-03
     * @author  Peter Lembke
     * @return  string[]
     */
    protected function _Version(): array
    {
        return array(
            'date' => '2018-01-22',
            'since' => '2017-12-03',
            'version' => '1.1.0',
            'class_name' => 'infohub_asset',
            'checksum' => '{{checksum}}',
            'note' => 'Download client side plugin assets to the client',
            'status' => 'normal',
            'SPDX-License-Identifier' => 'GPL-3.0-or-later',
            'user_role' => 'user'
        );
    }

    /**
     * Public functions in this plugin
     * @version 2018-01-22
     * @since   2017-12-03
     * @author  Peter Lembke
     * @return mixed
     */
    protected function _GetCmdFunctions(): array
    {
        $list = array(
            'update_all_plugin_assets' => 'normal',
            'update_specific_assets' => 'normal'
        );

        return parent::_GetCmdFunctionsBase($list);
    }

    /**
     * You give an array with asset names and checksums of the data you have for one plugin.
     * You get an array with all asset names and data you are missing.
     * Asset names that have its checksum mean that your data is accurate.
     * Asset names that have no checksum mean that your data should be deleted.
     * Asset names that have something in content should be updated/added on the client.
     * @version 2018-11-14
     * @since   2017-12-23
     * @author  Peter Lembke
     * @param array $in
     * @return array
     */
    protected function update_all_plugin_assets(array $in = []): array
    {
        $default = array(
            'plugin_name' => '', // Provided by caller
            'asset_checksum_array' => [], // provided by caller (optional). asset name and its checksum
            'max_asset_size_kb' => 0, // 0 = any size is ok
            'allowed_asset_types' => [], // Leave empty for all asset types
            'step' => 'step_get_all_assets',
            'from_plugin' => array('node' => '', 'plugin' => '', 'function' => ''),
            'response' => array(
                'answer' => '',
                'message' => '',
                'data' => []
            ),
            'data_back' => []
        );
        $in = $this->_Default($default, $in);

        $answer = 'false';
        $message = 'Nothing to report';
        $data = $in['asset_checksum_array'];
        $pluginName = $in['plugin_name'];

        if ($in['from_plugin']['node'] !== 'client') {
            $message = 'I only accept messages from the client node';
            goto leave;
        }

        if ($in['from_plugin']['plugin'] !== 'infohub_asset') {
            $message = 'I only accept messages from client infohub_asset';
            goto leave;
        }

        if (empty($pluginName)) {
            $message = 'The plugin name is empty';
            goto leave;
        }

        if (count(explode('_', $pluginName)) <> 2) {
            $message = 'Only level 1 plugins can have assets';
            goto leave;
        }

        if ($in['step'] === 'step_get_all_assets')
        {
            return $this->_Subcall(array(
                'to' => array(
                    'node' => 'server',
                    'plugin' => 'infohub_file',
                    'function' => 'asset_get_all_assets_for_one_plugin'
                ),
                'data' => array(
                    'plugin_name' => $in['plugin_name']
                ),
                'data_back' => array(
                    'plugin_name' => $in['plugin_name'],
                    'asset_checksum_array' => $in['asset_checksum_array'],
                    'max_asset_size_kb' => $in['max_asset_size_kb'],
                    'allowed_asset_types' => $in['allowed_asset_types'],
                    'step' => 'step_get_all_assets_response'
                )
            ));
        }

        if ($in['step'] === 'step_get_all_assets_response')
        {
            $in['step'] = 'step_compare_asset_checksums';
            if ($in['response']['answer'] === 'false') {
                $in['step'] = 'step_end';
            }
        }

        if ($in['step'] === 'step_compare_asset_checksums')
        {
            $collectedArray = $in['response']['data'];

            $response = $this->internal_Cmd(array(
                'func' => 'ComparePluginData',
                'asset_checksum_array' => $in['asset_checksum_array'],
                'collected_array' => $collectedArray
            ));

            $sizeIndex = [];
            $assetList = [];
            foreach ($response['data'] as $assetName => $assetData) {

                if (empty($assetData) === true) {
                    continue;
                }

                if (empty($in['allowed_asset_types']) === false) {
                    if (isset($in['allowed_asset_types'][$assetData['extension']]) === false) {
                        continue;
                    }
                }

                if ($in['max_asset_size_kb'] > 0) {
                    if ($assetData['file_size'] > $in['max_asset_size_kb'] * 1024) {
                        continue;
                    }
                }

                if ($assetData['extension'] !== 'json' && $assetData['extension'] !== 'svg') {
                    $name = $assetData['asset_name_no_extension'];
                    $size = $assetData['file_size'];

                    if (isset($sizeIndex[$name]) === true) {
                        if ($size > $sizeIndex[$name]) {
                            continue;
                        }
                    }

                    $sizeIndex[$name] = $size;
                }

                $assetList[$assetName] = $assetData;
            }

            $newAssetList = [];
            foreach ($assetList as $assetName => $assetData) {

                if ($assetData['extension'] === 'json' || $assetData['extension'] === 'svg') {
                    $newAssetList[$assetName] = $assetData;
                    continue;
                }

                $name = $assetData['asset_name_no_extension'];
                $size = $assetData['file_size'];

                if (isset($sizeIndex[$name]) === false) {
                    continue;
                }

                if ($size <= $sizeIndex[$name]) {
                    $newAssetList[$name] = $assetData; // Store bitmap image without extension
                }
            }

            $index = [];
            foreach ($newAssetList as $assetName => $assetData) {
                $index[$assetName] = $assetData['checksum'];
            }

            $newAssetList[$pluginName . '/index'] = array(
                'micro_time' => $this->_MicroTime(),
                'time_stamp' => $this->_TimeStamp(),
                'checksums' => $index,
                'full_sync_done' => 'true'
            );

            unset($index);
            $in['response']['data'] = $newAssetList;
        }

        $answer = $in['response']['answer'];
        $message = $in['response']['message'];
        $data = $in['response']['data'];

        leave:
        $response = array(
            'answer' => $answer,
            'message' => $message,
            'data' => $data,
            'plugin_name' => $in['plugin_name']
        );
        return $response;
    }

    /**
     * Compare the asset list we got from the client with the assets we have collected on the server
     * Some are new to the client, some are OK on the client, some should be updated on the client.
     * @version 2017-12-03
     * @since   2017-12-03
     * @author  Peter Lembke
     * @param array $in
     * @return array
     */
    protected function internal_ComparePluginData(array $in = []): array
    {
        $default = array(
            'asset_checksum_array' => [],
            'collected_array' => [],
            'step' => 'step_start'
        );
        $in = $this->_Default($default, $in);

        foreach ($in['asset_checksum_array'] as $assetName => $assetChecksum)
        {
            if (isset($in['collected_array'][$assetName]) === false) {
                $in['asset_checksum_array'][$assetName] = [];
                continue; // New asset
            }

            if ($in['asset_checksum_array'][$assetName] === $in['collected_array'][$assetName]['checksum']) {
                unset($in['asset_checksum_array'][$assetName]);
                unset($in['collected_array'][$assetName]);
                continue; // The existing asset on the client is OK.
            }

            // Asset below should be updated on the client
            $in['asset_checksum_array'][$assetName] = $in['collected_array'][$assetName];

            $contents = $in['asset_checksum_array'][$assetName]['contents'];
            if ($in['asset_checksum_array'][$assetName]['extension'] === 'json') {
                $contents = $this->_JsonDecode($contents);
            }
            $in['asset_checksum_array'][$assetName]['contents'] = $contents;

            unset($in['collected_array'][$assetName]);
        }

        // Get data for new assets
        foreach ($in['collected_array'] as $assetName => $assetData)
        {
            if (isset($in['asset_checksum_array'][$assetName]) === false) {
                if ($assetData['extension'] === 'json') {
                    $assetData['contents'] = $this->_JsonDecode($assetData['contents']);
                }
                $in['asset_checksum_array'][$assetName] = $assetData;
            }
        }

        leave:
        $response = array(
            'answer' => 'true',
            'message' => 'Done comparing plugin data',
            'data' => $in['asset_checksum_array']
        );
        return $response;
    }

    /**
     * Get a list from infohub_asset with plugin names and sub list with asset names.
     * All assets on the list should be updated. No need to verify checksums.
     * @version 2018-12-22
     * @since   2018-12-02
     * @author  Peter Lembke
     * @param array $in
     * @return array
     */
    protected function update_specific_assets(array $in = []): array
    {
        $default = array(
            'assets_requested' => [],
            'max_asset_size_kb' => 0, // 0 = all sizes are ok
            'allowed_asset_types' => [], // Leave empty for all asset types
            'step' => 'step_get_assets_requested',
            'from_plugin' => array('node' => '', 'plugin' => '', 'function' => ''),
            'response' => array(
                'answer' => '',
                'message' => '',
                'data' => []
            ),
            'data_back' => []
        );
        $in = $this->_Default($default, $in);

        $answer = 'false';
        $message = 'server->infohub_asset->update_specific_assets has nothing to report. Perhaps the step names are wrong in this function';
        $assetsFound = [];

        if ($in['from_plugin']['node'] !== 'client') {
            $message = 'I only accept messages from the client node';
            goto leave;
        }

        if ($in['from_plugin']['plugin'] !== 'infohub_asset') {
            $message = 'I only accept messages from client infohub_asset';
            goto leave;
        }

        if (empty($in['assets_requested']) === true) {
            $message = 'Please provide assets_requested';
            goto leave;
        }

        if ($in['step'] === 'step_get_assets_requested')
        {
            return $this->_Subcall(array(
                'to' => array(
                    'node' => 'server',
                    'plugin' => 'infohub_file',
                    'function' => 'asset_get_assets_requested'
                ),
                'data' => array(
                    'assets_requested' => $in['assets_requested']
                ),
                'data_back' => array(
                    'assets_requested' => $in['assets_requested'],
                    'max_asset_size_kb' => $in['max_asset_size_kb'],
                    'allowed_asset_types' => $in['allowed_asset_types'],
                    'step' => 'step_get_assets_requested_response'
                )
            ));
        }
        
        if ($in['step'] === 'step_get_assets_requested_response')
        {
            $answer = $in['response']['answer'];
            $message = $in['response']['message'];
            $assetsFound = $in['response']['data'];
            $assetsRequested = $in['data_back']['assets_requested'];

            foreach ($assetsRequested as $path => $alreadyHaveChecksum) {

                if (isset($assetsFound[$path]['checksum']) === false) {
                    continue; // The requested asset was not found
                }

                if ($assetsFound[$path]['checksum'] === $alreadyHaveChecksum) {
                    // We already have this asset. Remove it from the response
                    unset($assetsFound[$path]);
                    continue;
                }

                if ($in['max_asset_size_kb'] > 0) {
                    $fileSize = $assetsFound[$path]['file_size'];
                    if ($fileSize > $in['max_asset_size_kb'] * 1024) {
                        unset($assetsFound[$path]);
                        continue;
                    }
                }

                if (empty($in['allowed_asset_types']) === false) {
                    $extension = $assetsFound[$path]['extension'];
                    if (isset($in['allowed_asset_types'][$extension]) === false) {
                        unset($assetsFound[$path]);
                        continue;
                    }
                }

                // This is a new asset. Let us keep that in the response
                $extension = $assetsFound[$path]['extension'];
                if ($extension === 'json') {
                    $assetsFound[$path]['contents'] = $this->_JsonDecode($assetsFound[$path]['contents']);
                }
            }
        }
        
        leave:
        $response = array(
            'answer' => $answer,
            'message' => $message,
            'data' => $assetsFound
        );
        return $response;
    }

}
