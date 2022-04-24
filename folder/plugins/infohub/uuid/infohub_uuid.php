<?php
/**
 * Universally unique identifier
 *
 * You can get a UUID in different formats
 *
 * @package     Infohub
 * @subpackage  infohub_uuid
 */

declare(strict_types=1);
if (basename(__FILE__) == basename($_SERVER["SCRIPT_FILENAME"])) {
    exit; // This file must be included, not called directly
}

/**
 * Universally unique identifier
 *
 * You can get a UUID in different formats
 *
 * @author      Peter Lembke <info@infohub.se>
 * @version     2019-12-07
 * @since       2017-06-17
 * @copyright   Copyright (c) 2017, Peter Lembke
 * @license     https://opensource.org/licenses/gpl-license.php GPL-3.0-or-later
 * @see         https://github.com/peterlembke/infohub/blob/master/folder/plugins/infohub/uuid/infohub_uuid.md Documentation
 * @link        https://infohub.se/ InfoHub main page
 */
class infohub_uuid extends infohub_base
{
    /**
     * Version information for this plugin
     * @return  string[]
     * @since   2017-06-17
     * @author  Peter Lembke
     * @version 2019-12-07
     */
    protected function _Version(): array
    {
        return [
            'date' => '2019-12-07',
            'since' => '2017-06-17',
            'version' => '1.1.1',
            'class_name' => 'infohub_random',
            'checksum' => '{{checksum}}',
            'note' => 'Universally unique identifier UUID',
            'webpage' => 'https://en.wikipedia.org/wiki/Universally_unique_identifier',
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
     * @version 2019-12-07
     * @since   2017-06-17
     */
    protected function _GetCmdFunctions(): array
    {
        $list = [
            'uuid' => 'normal',
            'get_available_options' => 'normal',
            'guidv0' => 'normal',
            'guidv4' => 'normal',
            'hub_id' => 'normal',
        ];

        return parent::_GetCmdFunctionsBase($list);
    }

    /**
     * Gives you a UUID in wanted format
     *
     * @param array $in
     * @return array
     * @author Peter Lembke
     * @version 2018-08-09
     * @since   2018-08-09
     */
    protected function uuid(array $in = []): array
    {
        $default = [
            'version' => '100',
            'count' => 1
        ];
        $in = $this->_Default($default, $in);

        $answer = 'true';
        $message = 'Here are the UUIDs you wanted';
        $UuidIndex = [];
        $response = [];
        $data = '';
        $out = [];

        for ($i = $in['count']; $i > 0; $i--) {
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
        // @todo There are more effective PHP commands for this

        $first = '';
        foreach ($UuidIndex as $key => $data) {
            $out[] = $key;
            if ($first === '') {
                $first = $key;
            }
        }

        return [
            'answer' => $answer,
            'message' => $message,
            'data' => $first,
            'array' => $out,
            'version' => $in['version'],
            'count' => $in['count']
        ];
    }

    /**
     * Get a list with all options
     * @param array $in
     * @return array
     * @author  Peter Lembke
     * @version 2018-08-09
     * @since   2018-08-09
     */
    protected function get_available_options(array $in = []): array
    {
        return [
            'answer' => 'true',
            'message' => 'All UUID versions',
            'options' => [
                ["type" => "option", "value" => "0", "label" => "Server UUID v0"],
                ["type" => "option", "value" => "4", "label" => "Server UUID v4"],
                ["type" => "option", "value" => "100", "label" => "Server Hub Id", 'selected' => 'true']
            ]
        ];
    }

    /**
     * Nil UUID
     * @param array $in
     * @return array
     */
    protected function guidv0(array $in = []): array
    {
        return [
            'answer' => 'true',
            'message' => 'Here are the GUIDv0',
            'data' => '00000000-0000-0000-0000-000000000000'
        ];
    }

    /**
     * UUID version 4
     * guidv4 is a standardized way of getting a unique identifier string.
     * @param array $in
     * @return array
     * @author https://stackoverflow.com/questions/2040240/php-function-to-generate-v4-uuid
     * @version 2019-12-07
     * @since 2017-06-17
     */
    protected function guidv4(array $in = []): array
    {
        $answer = 'false';
        $message = 'Can not create a GUIDv4';
        $result = '';

        try {
            if (function_exists('com_create_guid') === true) {
                $guid = com_create_guid();
                if ($guid === false) {
                    $message = 'Can not create guid';
                    $guid = '';
                    goto leave;
                }

                $result = trim($guid, '{}'); // Remove surrounding brackets
                $answer = 'true';
                $message = 'Here are the GUIDv4, created with com_create_guid';
                goto leave;
            }

            $data = $this->_GetRandomBytes();

            if (strlen($data) !== 16) {
                goto leave;
            }

            $data[6] = chr(ord($data[6]) & 0x0f | 0x40); // set version to 0100
            $data[8] = chr(ord($data[8]) & 0x3f | 0x80); // set bits 6-7 to 10


            $dataHex = bin2hex($data);
            $dataHexArray = str_split($dataHex, 4);
            $result = vsprintf('%s%s-%s-%s-%s-%s%s%s', $dataHexArray);

            $answer = 'true';
            $message = 'Here are the GUIDv4, created with code';
        } catch (Exception $e) {
        }

        leave:
        return [
            'answer' => $answer,
            'message' => $message,
            'data' => $result
        ];
    }

    /**
     * Get a string with 16 bytes
     *
     * @param  int  $length
     * @return string
     * @throws Exception
     */
    protected function _GetRandomBytes(
        int $length = 16
    ): string {

        if (function_exists('random_bytes') === true) {
            $data = random_bytes(16); // PHP >= 7
            return $data;
        }

        if (function_exists('openssl_random_pseudo_bytes') === true) {
            $data = openssl_random_pseudo_bytes(16); // PHP < 7
            return $data;
        }

        return '';
    }

    /**
     * The default InfoHub universal ID method that produce a unique identifier string
     * Example: 1575709656.3529:4518025819754968159
     * First the time since EPOC with decimals.
     * Then a colon. Then a random number between 0 and the maximum number an integer can hold on this system.
     * Benefits are the simplicity. Also gives information when the id was created.
     * @param array $in
     * @return array
     * @author Peter Lembke
     * @version 2019-12-07
     * @since 2018-07-28
     */
    protected function hub_id(array $in = []): array
    {
        $answer = 'false';
        $message = 'Can not create an infohub_uuid';
        $result = '';

        try {
            $randomNumber = '';
            if (function_exists('random_int') === true) {
                $randomNumber = random_int(0, PHP_INT_MAX); // PHP >= 7
            } else {
                if (function_exists('mt_rand') === true) {
                    $randomNumber = mt_rand(0, PHP_INT_MAX); // PHP < 7
                } else {
                    goto leave;
                }
            }

            $result = $this->_MicroTime() . ':' . $randomNumber;

            $answer = 'true';
            $message = 'Here are the hub_id';
        } catch (Exception $e) {
        }

        leave:
        return [
            'answer' => $answer,
            'message' => $message,
            'data' => $result
        ];
    }
}
