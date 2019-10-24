<?php
declare(strict_types=1);
if (basename(__FILE__) == basename($_SERVER["SCRIPT_FILENAME"])) {
    exit; // This file must be included, not called directly
}

/**
 * @category InfoHub
 * @package InfoHub Random
 * @copyright Copyright (c) 2017, Peter Lembke, CharZam soft (CharZam.com / InfoHub.se)
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
class infohub_random extends infohub_base
{

    protected final function _Version(): array
    {
        return array(
            'date' => '2019-01-07',
            'since' => '2017-06-17',
            'version' => '1.0.2',
            'class_name' => 'infohub_random',
            'checksum' => '{{checksum}}',
            'note' => 'Functions that give you an unpredictable answer',
            'status' => 'normal',
            'license_name' => 'GNU GPL 3 or later'
        );
    }

    protected function _GetCmdFunctions(): array
    {
        return array(
            'random_number' => 'normal',
            'random_numbers' => 'normal'
        );
    }

    // *****************************************************************************
    // * The private functions, add your own in your plugin
    // * These functions can be used directly in your functions.
    // * Name: _CamelCaseData
    // *****************************************************************************

    // *****************************************************************************
    // * Functions you only can reach with CMD()
    // * Observe! function names are lower_case
    // *****************************************************************************

    /**
     * Gives you a random number
     * @version 2017-06-17
     * @since 2017-06-17
     * @author Peter Lembke
     * @param array $in
     * @return array
     * @uses
     */
    final protected function random_number(array $in = array()): array
    {
        $default = array(
            'min' => 0,
            'max' => 0
        );
        $in = $this->_Default($default, $in);

        return $this->internal_Cmd(array(
            'func' => 'RandomNumber',
            'min' => $in['min'],
            'max' => $in['max']
        ));
    }

    /**
     * Gives you a random number
     * @version 2017-06-17
     * @since 2017-06-17
     * @author Peter Lembke
     * @param array $in
     * @return array
     * @uses
     */
    final protected function internal_RandomNumber(array $in = array()): array
    {
        $default = array(
            'min' => 0,
            'max' => 0
        );
        $in = $this->_Default($default, $in);

        $answer = 'true';
        $message = 'Could not generate a random number';
        $ok = 'false';
        $result = 0;

        if ($in['min'] < 0 || $in['max'] < 0) {
            $message = 'negative values is not allowed';
            goto leave;
        }

        if ($in['min'] > $in['max']) {
            $message = 'min can not be larger than max';
            goto leave;
        }

        if ($in['max'] > PHP_INT_MAX || $in['min'] > PHP_INT_MAX) {
            $message = 'max can not be larger than PHP_INT_MAX, it is ' . PHP_INT_MAX;
            goto leave;
        }

        try {
            $result = $this->_Random($in['min'], $in['max']);
        } catch (Exception $e) {
            $answer = 'false';
            $message = $e->getMessage();
            goto leave;
        }

        $answer = 'true';
        $message = 'Here are the random number';
        $ok = 'true';

        leave:
        return array(
            'answer' => $answer,
            'message' => $message,
            'ok' => $ok,
            'min' => $in['min'],
            'max' => $in['max'],
            'data' => $result
        );
    }

    /**
     * Gives you a list with random numbers
     * @version 2018-07-29
     * @since 2018-07-29
     * @author Peter Lembke
     * @param array $in
     * @return array
     * @uses
     */
    final protected function random_numbers(array $in = array()): array
    {
        $default = array(
            'min' => 0,
            'max' => 0,
            'count' => 10
        );
        $in = $this->_Default($default, $in);

        $answer = 'true';
        $message = 'Could not generate your random numbers';
        $result = array();
        $ok = 'false';

        for ($i = $in['count']; $i > 0; $i--)
        {
            $response = $this->internal_Cmd(array(
                'func' => 'RandomNumber',
                'min' => $in['min'],
                'max' => $in['max']
            ));

            if ($response['answer'] === 'false' || $response['ok'] === 'false') {
                $message = $response['message'];
                goto leave;
            }

            $result[] = $response['data'];
        }

        $answer = 'true';
        $message = 'Here are your random numbers';
        $ok = 'true';

        leave:
        return array(
            'answer' => $answer,
            'message' => $message,
            'ok' => $ok,
            'min' => $in['min'],
            'max' => $in['max'],
            'data' => $result
        );
    }

    /**
     * Gives you the best random number that your version of PHP can offer
     * @param int $min
     * @param int $max
     * @return int
     */
    final protected function _Random($min = 0, $max = 0): int
    {
        $randomNumber = 0;
        try {
            if (function_exists('random_int')) { // Requires PHP 7
                $randomNumber = random_int($min, $max);
            } else {
                $randomNumber = mt_rand($min,$max); // PHP 5 and later
            }
        } catch (Exception $e) {
            $randomNumber = 0; // Not ideal
        }

        return $randomNumber;
    }

}