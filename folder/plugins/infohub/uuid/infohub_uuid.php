<?php
declare(strict_types=1);
if (basename(__FILE__) == basename($_SERVER["SCRIPT_FILENAME"])) {
    exit; // This file must be included, not called directly
}

/**
 * @category InfoHub
 * @package InfoHub UUID
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
class infohub_uuid extends infohub_base {

    protected final function _Version(): array
    {
        return array(
            'date' => '2019-12-07',
            'since' => '2017-06-17',
            'version' => '1.1.1',
            'class_name' => 'infohub_random',
            'checksum' => '{{checksum}}',
            'note' => 'Universally unique identifier',
            'webpage' => 'https://en.wikipedia.org/wiki/Universally_unique_identifier',
            'status' => 'normal',
            'license_name' => 'GNU GPL 3 or later'
        );
    }

    protected function _GetCmdFunctions(): array
    {
        return array(
            'uuid' => 'normal',
            'get_available_options' => 'normal',
            'guidv0' => 'normal',
            'guidv4' => 'normal',
            'hub_id' => 'normal',
        );
    }

    /**
     * @version 2017-06-17
     * @since 2018-07-29
     * @author Peter Lembke
     * @param array $in
     * @return array
     */
    final protected function uuid(array $in = array()): array
    {
        $default = array(
            'version' => '100',
            'count' => 1
        );
        $in = $this->_Default($default, $in);

        $answer = 'true';
        $message = 'Here are the UUIDs you wanted';
        $UuidIndex = array();
        $response = array();
        $data = '';
        $out = [];

        for ($i = $in['count']; $i > 0; $i--)
        {
            switch ($in['version']) {
                case '0':
                    $response = $this->guidv0();
                    break;
                case '4':
                    $response = $this->guidv4();
                    break;
                case '100':
                    $response = $this->hub_id();
                    break;
                default:
            }

            if ($response['answer'] === 'true') {
                $data = $response['data'];
                $UuidIndex[$data] = 1;
            } else {
                $answer = $response['answer'];
                $message = $response['message'];
                break;
            }

        }

        // Convert the indexed array to a simple array. Also copy the first uuid

        $first = '';
        foreach ($UuidIndex as $key => $data) {
            $out[] = $key;
            if ($first === '') {
                $first = $key;
            }
        }

        return array(
            'answer' => $answer,
            'message' => $message,
            'data' => $first,
            'array' => $out,
            'version' => $in['version'],
            'count' => $in['count']
        );
    }

    /**
     * Get a list with all options
     * @version 2018-08-09
     * @since   2018-08-09
     * @author  Peter Lembke
     * @param array $in
     * @return array
     */
    final protected function get_available_options(array $in = array()): array
    {
        return array(
            'answer' => 'true',
            'message' => 'All UUID versions',
            'options' => array(
                [ "type" => "option", "value" => "0", "label" => "Server UUID v0" ],
                [ "type" => "option", "value" => "4", "label" => "Server UUID v4" ],
                [ "type" => "option", "value" => "100", "label" => "Server Hub Id", 'selected' => 'true' ]
            )
        );
    }

    /**
     * Nil UUID
     * @param array $in
     * @return array
     */
    final protected function guidv0(array $in = array()): array
    {
        return array(
            'answer' => 'true',
            'message' => 'Here are the guidv0',
            'data' => '00000000-0000-0000-0000-000000000000'
        );
    }

    /**
     * UUID version 4
     * guidv4 is a standardized way of getting a uinque identifier string.
     * @version 2019-12-07
     * @since 2017-06-17
     * @author https://stackoverflow.com/questions/2040240/php-function-to-generate-v4-uuid
     * @param array $in
     * @return array
     */
    final protected function guidv4(array $in = array()): array
    {
        $answer = 'false';
        $message = 'Can not create a guidv4';
        $result = '';

        try {
            if (function_exists('com_create_guid') === true)
            {
                $result = trim(com_create_guid(), '{}'); // Remove surrounding brackets
                $answer = 'true';
                $message = 'Here are the guidv4, created with com_create_guid';
                goto leave;
            }

            $data = '';

            if (function_exists('random_bytes')) {
                $data = random_bytes(16); // PHP >= 7
            } else if (function_exists('openssl_random_pseudo_bytes')) {
                $data = openssl_random_pseudo_bytes(16); // PHP < 7
            } else {
                goto leave;
            }

            if (strlen($data) !== 16) {
                goto leave;
            }

            $data[6] = chr(ord($data[6]) & 0x0f | 0x40); // set version to 0100
            $data[8] = chr(ord($data[8]) & 0x3f | 0x80); // set bits 6-7 to 10
            $result = vsprintf('%s%s-%s-%s-%s-%s%s%s', str_split(bin2hex($data), 4));

            $answer = 'true';
            $message = 'Here are the guidv4';
        } catch (Exception $e) {

        }

        leave:
        return array(
            'answer' => $answer,
            'message' => $message,
            'data' => $result
        );
    }

    /**
     * The default InfoHub universal ID method that produce an unique identifier string
     * Example: 1575709656.3529:4518025819754968159
     * First the time since EPOC with decimals.
     * Then a colon. Then a random number between 0 and the maximum number an integer can hold on this system.
     * Benefits are the simplicity. Also gives information when the id was created.
     * @version 2019-12-07
     * @since 2018-07-28
     * @author Peter Lembke
     * @param array $in
     * @return array
     */
    final protected function hub_id(array $in = array()): array
    {
        $answer = 'false';
        $message = 'Can not create an infohub_uuid';
        $result = '';

        try {
            $randomNumber = '';
            if (function_exists('random_int')) {
                $randomNumber = random_int(0, PHP_INT_MAX); // PHP >= 7
            } else if (function_exists('mt_rand')) {
                $randomNumber = mt_rand(0, PHP_INT_MAX); // PHP < 7
            } else {
                goto leave;
            }

            $result = $this->_MicroTime() . ':' . $randomNumber;

            $answer = 'true';
            $message = 'Here are the hub_id';
        } catch (Exception $e) {

        }

        leave:
        return array(
            'answer' => $answer,
            'message' => $message,
            'data' => $result
        );
    }
}
