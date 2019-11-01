<?php
declare(strict_types=1);
if (basename(__FILE__) == basename($_SERVER["SCRIPT_FILENAME"])) {
    exit; // This file must be included, not called directly
}

/**
 * infohub_asset support the client side infohub_asset with assets for a plugin.
 * @category InfoHub
 * @package Launcher
 * @copyright Copyright (c) 2017, Peter Lembke, CharZam soft
 * @since 2017-12-03
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

/**
 * Class infohub_launcher
 * Support class for the javascript plugin with the same name that launch plugins in the client workbench
 * Purpose is to as quickly as possible provide data about plugins that can be launched.
 */
class infohub_launcher extends infohub_base
{
    protected function _Version(): array
    {
        return array(
            'date' => '2018-11-18',
            'version' => '1.0.0',
            'class_name' => 'infohub_launcher',
            'checksum' => '{{checksum}}',
            'note' => 'Download client side data that the launcher need to work',
            'status' => 'normal',
            'license_name' => 'GNU GPL 3 or later'
        );
    }

    protected function _GetCmdFunctions(): array
    {
        return array(
            'get_full_list' => 'normal'
        );
    }

    /**
     * Get a new updated full_list
     * The list key is plugin name, the data is the checksums of files launcher.json, icon/icon.svg, icon/icon.json
     * @version 2018-11-18
     * @since   2018-11-14
     * @author  Peter Lembke
     * @param $in
     * @return array
     */
    final protected function get_full_list(array $in = array()): array
    {
        $default = array(
            'list_checksum' => '',
            'step' => 'step_get_full_list',
            'from_plugin' => array('node' => '', 'plugin' => '', 'function' => ''),
            'response' => array(
                'answer' => 'false',
                'message' => 'Nothing to report',
                'data' => array()
            ),
            'data_back' => array()
        );
        $in = $this->_Default($default, $in);

        $answer = 'false';
        $message = 'Nothing to report';
        $fullList = array();

        if ($in['step'] === 'step_get_full_list')
        {
            return $this->_Subcall(array(
                'to' => array(
                    'node' => 'server',
                    'plugin' => 'infohub_file',
                    'function' => 'launcher_get_full_list'
                ),
                'data' => array(),
                'data_back' => array(
                    'list_checksum' => $in['list_checksum'],
                    'step' => 'step_get_full_list_response'
                )
            ));
        }

        if ($in['step'] === 'step_get_full_list_response')
        {
            $answer = $in['response']['answer'];
            $message = $in['response']['message'];
            $in['step'] = 'step_end';

            if ($answer === 'true') {
                $in['step'] = 'step_prepare_full_list';
            }
        }

        if ($in['step'] === 'step_prepare_full_list')
        {
            $list = $in['response']['data'];
            ksort($list);
            $listChecksum = md5(json_encode($list));

            $do = 'update';
            if ($listChecksum === $in['list_checksum']) {
                $do = 'keep';
                $list = array();
            }

            $fullList = array(
                'name' => 'full_list',
                'do' => $do,
                'micro_time' => $this->_MicroTime(),
                'time_stamp' => $this->_TimeStamp(),
                'list_checksum' => $listChecksum,
                'list' => $list
            );

            $answer = 'true';
            $message = 'Here are the full_list';
        }

        return array(
            'answer' => $answer,
            'message' => $message,
            'data' => $fullList
        );

    }

}
