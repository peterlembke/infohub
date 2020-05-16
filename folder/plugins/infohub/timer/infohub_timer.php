<?php
declare(strict_types=1);
if (basename(__FILE__) == basename($_SERVER["SCRIPT_FILENAME"])) {
    exit; // This file must be included, not called directly
}

/**
 * @category InfoHub
 * @package InfoHub Timer
 * @copyright Copyright (c) 2010-, Peter Lembke, CharZam soft (CharZam.com / InfoHub.se)
 * @since 2020-02-27
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
class infohub_timer extends infohub_base {

    protected final function _Version(): array
    {
        return array(
            'date' => '2020-02-27',
            'version' => '1.0.0',
            'class_name' => 'infohub_timer',
            'checksum' => '{{checksum}}',
            'note' => 'Function that respond after some time',
            'status' => 'normal',
            'SPDX-License-Identifier' => 'GPL-3.0-or-later',
            'recommended_security_group' => 'core'
        );
    }

    protected function _GetCmdFunctions(): array
    {
        return array(
            'timer' => 'normal'
        );
    }

    /**
     * Send a message to here and state how many seconds you want to wait for a response
     * @version 2020-02-27
     * @since 2020-02-27
     * @author  Peter Lembke
     * @param array $in
     * @return array
     */
    protected function timer(array $in = array()): array
    {
        $default = array(
            'milliseconds' => 6000,
            'callback_function' => null
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

}
