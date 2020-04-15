<?php
declare(strict_types=1);
if (basename(__FILE__) == basename($_SERVER["SCRIPT_FILENAME"])) {
    exit; // This file must be included, not called directly
}

/**
 * @category InfoHub
 * @package InfoHub Transfer
 * @copyright Copyright (c) 2010-2017, Peter Lembke, CharZam soft (CharZam.com / InfoHub.se)
 * @since 2017-06-17
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
class infohub_time extends infohub_base {

    protected final function _Version(): array
    {
        return array(
            'date' => '2017-06-17',
            'version' => '1.0.0',
            'class_name' => 'infohub_random',
            'checksum' => '{{checksum}}',
            'note' => 'Functions that give you an unpredictable answer',
            'status' => 'normal',
            'SPDX-License-Identifier' => 'GPL-3.0-or-later'
        );
    }

    protected function _GetCmdFunctions(): array
    {
        return array(
            'time' => 'normal',
            'get_available_options' => 'normal'
        );
    }

    /**
     * Gives you the current time in different time formats that are used in InfoHub.
     * The functions used are available trough the base class.
     * If you want a true testable plugin then you need to avid fetching unpredictable values directly,
     * instead you can call this function and get a value back to your function.
     * @param array $in
     * @return array
     */
    final protected function time(array $in = array()): array
    {
        $default = array(
            'type' => 'timestamp'
        );
        $in = $this->_Default($default, $in);

        $answer = 'true';
        $message = 'Here are the time data';
        $result = '';

        switch ($in['type']) {
            case 'timestamp':
                $result = $this->_TimeStamp(); // 2018-08-31 21:12:00
                break;
            case 'timestamp_c':
                $result = $this->_TimeStamp('c'); // 2018-08-31T21:12:26+02:00
                break;
            case 'timestampmicro':
                $result = $this->_TimeStampMicro(); // 2018-08-31 21:12:47.658932
                break;
            case 'microtime':
                $result = $this->_MicroTime(); // 1535742781.802549
                break;
            case 'time':
                $result = time(); // 1535743070
                break;
            default:
                $answer = 'false';
                $message = 'Not a valid type';
                break;
        }

        leave:
        return array(
            'answer' => $answer,
            'message' => $message,
            'type' => $in['type'],
            'data' => $result
        );
    }

    /**
     * Get list with time methods you can use
     * @version 2018-08-11
     * @since   2018-08-11
     * @author  Peter Lembke
     * @param array $in
     * @return array
     */
    final protected function  get_available_options(array $in = array()): array
    {
        $options = array(
            array("type" => "option", "value" => 'timestamp', "label" => 'Normal timestamp', 'selected' => 'true' ),
            array("type" => "option", "value" => 'timestamp_c', "label" => 'Timestamp with offset' ),
            array("type" => "option", "value" => 'timestampmicro', "label" => 'timestamp with fractions' ),
            array("type" => "option", "value" => 'microtime', "label" => 'EPOC and fractions' ),
            array("type" => "option", "value" => 'time', "label" => 'Seconds since EPOC' )
        );

        return array(
            'answer' => 'true',
            'message' => 'List of valid checksum methods.',
            'options' => $options
        );
    }

}
