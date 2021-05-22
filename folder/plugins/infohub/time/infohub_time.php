<?php
/**
 * Get current time in different formats
 *
 * @package     Infohub
 * @subpackage  infohub_time
 */

declare(strict_types=1);
if (basename(__FILE__) == basename($_SERVER["SCRIPT_FILENAME"])) {
    exit; // This file must be included, not called directly
}

/**
 * Get current time in different formats
 *
 * @author      Peter Lembke <info@infohub.se>
 * @version     2020-08-17
 * @since       2017-06-17
 * @copyright   Copyright (c) 2010, Peter Lembke
 * @license     https://opensource.org/licenses/gpl-license.php GPL-3.0-or-later
 * @see         https://github.com/peterlembke/infohub/blob/master/folder/plugins/infohub/time/infohub_time.md Documentation
 * @link        https://infohub.se/ InfoHub main page
 */
class infohub_time extends infohub_base
{
    /**
     * Version information for this plugin
     * @return  string[]
     * @since   2017-06-17
     * @author  Peter Lembke
     * @version 2020-08-17
     */
    protected function _Version(): array
    {
        return [
            'date' => '2020-08-17',
            'since' => '2017-06-17',
            'version' => '1.0.0',
            'class_name' => 'infohub_random',
            'checksum' => '{{checksum}}',
            'note' => 'Functions that give you an unpredictable answer',
            'status' => 'normal',
            'SPDX-License-Identifier' => 'GPL-3.0-or-later',
            'user_role' => 'user'
        ];
    }

    /**
     * Public functions in this plugin
     * @return mixed
     * @since   2017-06-17
     * @author  Peter Lembke
     * @version 2020-08-17
     */
    protected function _GetCmdFunctions(): array
    {
        $list = [
            'time' => 'normal',
            'get_available_options' => 'normal'
        ];

        return parent::_GetCmdFunctionsBase($list);
    }

    /**
     * Gives you the current time in different time formats that are used in InfoHub.
     *
     * The functions used are available trough the base class.
     * If you want a true testable plugin then you need to avid fetching unpredictable values directly,
     * instead you can call this function and get a value back to your function.
     *
     * @param array $in
     * @return array
     * @version     2020-08-17
     * @since       2017-06-17
     */
    protected function time(array $in = []): array
    {
        $default = [
            'type' => 'timestamp'
        ];
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
        return [
            'answer' => $answer,
            'message' => $message,
            'type' => $in['type'],
            'data' => $result
        ];
    }

    /**
     * Get list with time methods you can use
     *
     * @param array $in
     * @return array
     * @author  Peter Lembke
     * @version 2018-08-11
     * @since   2018-08-11
     */
    protected function get_available_options(array $in = []): array
    {
        $options = [
            ["type" => "option", "value" => 'timestamp', "label" => 'Normal timestamp', 'selected' => 'true'],
            ["type" => "option", "value" => 'timestamp_c', "label" => 'Timestamp with offset'],
            ["type" => "option", "value" => 'timestampmicro', "label" => 'timestamp with fractions'],
            ["type" => "option", "value" => 'microtime', "label" => 'EPOC and fractions'],
            ["type" => "option", "value" => 'time', "label" => 'Seconds since EPOC']
        ];

        return [
            'answer' => 'true',
            'message' => 'List of valid checksum methods.',
            'options' => $options
        ];
    }

}
