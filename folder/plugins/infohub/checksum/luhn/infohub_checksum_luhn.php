<?php
/**
 * Calculates your checksum with Luhn
 *
 * The Luhn algorithm from 1954 are used in US and Canadian social security numbers 
 *
 * @package     Infohub
 * @subpackage  infohub_checksum_luhn
 */

declare(strict_types=1);
if (basename(__FILE__) == basename($_SERVER["SCRIPT_FILENAME"])) {
    exit; // This file must be included, not called directly
}

/**
 * Calculates your checksum with Luhn
 *
 * The Luhn algorithm from 1954 are used in US and Canadian social security numbers
 *
 * @author      Peter Lembke <info@infohub.se>
 * @version     2018-11-09
 * @since       2016-04-16
 * @copyright   Copyright (c) 2016, Peter Lembke
 * @license     https://opensource.org/licenses/gpl-license.php GPL-3.0-or-later
 * @see         https://github.com/peterlembke/infohub/blob/master/folder/plugins/infohub/checksum/doublemetaphone/infohub_checksum_doublemetaphone.md Documentation
 * @link        https://infohub.se/ InfoHub main page
 */
class infohub_checksum_luhn extends infohub_base
{
    /**
     * Version information for this plugin
     * @version 2018-03-03
     * @since   2016-04-16
     * @author  Peter Lembke
     * @return string[]
     */
    protected function _Version(): array
    {
        return array(
            'date' => '2018-03-03',
            'since' => '2016-04-16',
            'version' => '1.0.0',
            'class_name' => 'infohub_checksum_luhn',
            'checksum' => '{{checksum}}',
            'note' => 'The Luhn algorithm from 1954 are used in US and Canadian social security numbers',
            'status' => 'normal',
            'SPDX-License-Identifier' => 'GPL-3.0-or-later'
        );
    }

    /**
     * Public functions in this plugin
     * @version 2018-03-03
     * @since   2016-04-16
     * @author  Peter Lembke
     * @return mixed
     */
    protected function _GetCmdFunctions(): array
    {
        $list = array(
            'calculate_checksum' => 'normal',
            'verify_checksum' => 'normal'
        );

        return parent::_GetCmdFunctionsBase($list);
    }

    // ***********************************************************
    // * your class functions below, only use protected functions
    // ***********************************************************

    /**
     * Main checksum calculation
     * @version 2016-04-16
     * @since   2016-04-16
     * @author  Peter Lembke
     * @param array $in
     * @return array
     */
    protected function calculate_checksum(array $in = []): array
    {
        $default = array(
            'value' => '',
            'checksum' => '',
        );
        $in = $this->_Default($default, $in);

        $in['value'] = $this->_RemoveAllButNumbers($in['value']);

        $result = $this->_LuhnCalculateChecksum($in['value']);

        return array(
            'answer' => 'true',
            'message' => 'Here are the checksum',
            'value' => $in['value'],
            'checksum' => $result,
            'verified' => 'false'
        );
    }

    /**
     * Main checksum verification
     * @version 2016-04-16
     * @since   2016-04-16
     * @author  Peter Lembke
     * @param array $in
     * @return array
     */
    protected function verify_checksum(array $in = []): array
    {
        $default = array(
            'value' => '',
            'checksum' => '',
        );
        $in = $this->_Default($default, $in);

        $in['value'] = $this->_RemoveAllButNumbers($in['value']);
        
        $verified = 'false';
        $result = $this->_LuhnVerifyChecksum($in['value']);
        if ($result === true) {
            $verified = 'true';
        }

        return array(
            'answer' => 'true',
            'message' => 'Here are the result of the checksum verification',
            'value' => $in['value'],
            'checksum' => $in['checksum'],
            'verified' => $verified
        );
    }

    /**
     * https://en.wikipedia.org/wiki/Luhn_algorithm
     * http://rosettacode.org/wiki/Luhn_test_of_credit_card_numbers
     * @param string $valueString
     * @return int
     */
    protected function _LuhnCalculateChecksum($valueString = ''): string
    {
        $sum = 0;
        if ($valueString !== '') {
            $numbers = str_split($valueString, 1);
            foreach ($numbers as $index => $number) {
                if ($index % 2 === 1) {
                    $number = (string) (2 * $number);
                    $number = $this->_LuhnSum($number);
                }
                $sum = $sum + (int) $number;
            }
        }

        $checksumDigit = (string) ($sum * 9);
        $checksumDigit = substr($checksumDigit, -1);
        $result = $valueString . $checksumDigit;

        return $result;
    }

    /**
     * Give a string with digits. The sum of the digits will be returned.
     * @param string $valueString
     * @return int
     */
    protected function _LuhnSum($valueString = ''): int
    {
        $numbers = str_split($valueString, 1);
        $sum = 0;
        foreach ($numbers as $number) {
            $sum = $sum + $number;
        }
        return $sum;
    }

    /**
     * Give the value. The last digit will be checked if it is valid
     * @param string $valueString
     * @return bool
     */
    protected function _LuhnVerifyChecksum($valueString = ''): bool
    {
        $checksum = substr($valueString, -1);
        $valueString = substr($valueString, 0 , -1);
        $result = $this->_LuhnCalculateChecksum($valueString);
        $resultChecksum = substr($result, -1);
        if ($checksum === $resultChecksum) {
            return true;
        }

        return false;
    }

    /**
     * Remove all characters from the string that is not 0-9
     * @param string $valueString
     * @return bool
     */
    protected function _RemoveAllButNumbers($valueString = ''): string
    {
        $output = preg_replace('/\D/', '', $valueString);

        return $output;
    }
    
}
