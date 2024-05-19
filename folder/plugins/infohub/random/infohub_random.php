<?php
/**
 * Untestable functions that give a different answer on each run
 *
 * Functions that give you an unpredictable answer
 *
 * @package     Infohub
 * @subpackage  infohub_plugin
 */

declare(strict_types=1);
if (basename(__FILE__) == basename($_SERVER['SCRIPT_FILENAME'])) {
    exit; // This file must be included, not called directly
}

/**
 * Untestable functions that give a different answer on each run
 *
 * Functions that give you an unpredictable answer
 *
 * @author      Peter Lembke <info@infohub.se>
 * @version     2019-01-07
 * @since       2017-06-17
 * @copyright   Copyright (c) 2017, Peter Lembke
 * @license     https://opensource.org/licenses/gpl-license.php GPL-3.0-or-later
 * @see         https://github.com/peterlembke/infohub/blob/master/folder/plugins/infohub/plugin/infohub_plugin.md Documentation
 * @link        https://infohub.se/ InfoHub main page
 */
class infohub_random extends infohub_base
{
    /**
     * Version information for this plugin
     * @return  string[]
     * @since   2017-06-17
     * @author  Peter Lembke
     * @version 2019-01-07
     */
    protected function _Version(): array
    {
        return [
            'date' => '2019-01-07',
            'since' => '2017-06-17',
            'version' => '1.0.2',
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
     *
     * @return array
     * @author  Peter Lembke
     * @version 2019-01-07
     * @since   2017-06-17
     */
    protected function _GetCmdFunctions(): array
    {
        $list = [
            'random_number' => 'normal',
            'random_numbers' => 'normal'
        ];

        return parent::_GetCmdFunctionsBase($list);
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
     * @param array $in
     * @return array
     * @author Peter Lembke
     * @version 2017-06-17
     * @since 2017-06-17
     * @uses
     */
    protected function random_number(array $in = []): array
    {
        $default = [
            'min' => 0,
            'max' => 0
        ];
        $in = $this->_Default($default, $in);

        return $this->internal_Cmd(
            [
                'func' => 'RandomNumber',
                'min' => $in['min'],
                'max' => $in['max']
            ]
        );
    }

    /**
     * Gives you a random number
     * @param array $in
     * @return array
     * @author Peter Lembke
     * @version 2017-06-17
     * @since 2017-06-17
     * @uses
     */
    protected function internal_RandomNumber(array $in = []): array
    {
        $default = [
            'min' => 0,
            'max' => 0
        ];
        $in = $this->_Default($default, $in);

        $answer = 'false';
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
            $message = $e->getMessage();
            goto leave;
        }

        $answer = 'true';
        $message = 'Here are the random number';
        $ok = 'true';

        leave:
        return [
            'answer' => $answer,
            'message' => $message,
            'ok' => $ok,
            'min' => $in['min'],
            'max' => $in['max'],
            'data' => $result
        ];
    }

    /**
     * Gives you a list with random numbers
     * @param array $in
     * @return array
     * @author Peter Lembke
     * @version 2018-07-29
     * @since 2018-07-29
     * @uses
     */
    protected function random_numbers(array $in = []): array
    {
        $default = [
            'min' => 0,
            'max' => 0,
            'count' => 10
        ];
        $in = $this->_Default($default, $in);

        $answer = 'false';
        $message = 'Could not generate your random numbers';
        $result = [];
        $ok = 'false';

        for ($i = $in['count']; $i > 0; $i--) {

            $response = $this->internal_Cmd([
                'func' => 'RandomNumber',
                'min' => $in['min'],
                'max' => $in['max']
            ]);

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
        return [
            'answer' => $answer,
            'message' => $message,
            'ok' => $ok,
            'min' => $in['min'],
            'max' => $in['max'],
            'data' => $result
        ];
    }

    /**
     * Gives you the best random number that your version of PHP can offer
     * @param int $min
     * @param int $max
     * @return int
     */
    protected function _Random(
        int $min = 0,
        int $max = 0
    ): int
    {
        try {

            if (function_exists('random_int')) { // Requires PHP 7
                $randomNumber = random_int($min, $max);
                return $randomNumber;
            }

            $randomNumber = mt_rand($min, $max); // PHP 5 and later
            return $randomNumber;

        } catch (Exception $e) {
        }

        return $min;
    }

}