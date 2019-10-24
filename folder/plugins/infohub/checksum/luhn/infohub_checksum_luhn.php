<?php
declare(strict_types=1);
if (basename(__FILE__) == basename($_SERVER["SCRIPT_FILENAME"])) {
    exit; // This file must be included, not called directly
}

/**
infohub_checksum_luhn

    Copyright (C) 2016 Peter Lembke , CharZam soft
    the program is distributed under the terms of the GNU General Public License

    infohub_checksum_luhn is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    infohub_checksum_luhn is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with infohub_checksum_luhn.	If not, see <https://www.gnu.org/licenses/>.
*/
class infohub_checksum_luhn extends infohub_base
{

    protected final function _Version(): array
    {
        return array(
            'date' => '2018-03-03',
            'since' => '2016-04-16',
            'version' => '1.0.0',
            'class_name' => 'infohub_checksum_luhn',
            'checksum' => '{{checksum}}',
            'note' => 'The Luhn algorithm from 1954 are used in US and Canadian social security numbers',
            'status' => 'normal',
            'license_name' => 'GNU GPL 3 or later'
        );
    }

    protected function _GetCmdFunctions(): array
    {
        return array(
            'calculate_checksum' => 'normal',
            'verify_checksum' => 'normal'
        );
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
    final protected function calculate_checksum(array $in = array()): array
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
    final protected function verify_checksum(array $in = array()): array
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
    final protected function _LuhnCalculateChecksum($valueString = ''): string
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
     * @param string $valueString
     * @return int
     */
    final protected function _LuhnSum($valueString = ''): int
    {
        $numbers = str_split($valueString, 1);
        $sum = 0;
        foreach ($numbers as $number) {
            $sum = $sum + $number;
        }
        return $sum;
    }

    /**
     * @param string $valueString
     * @return bool
     */
    final protected function _LuhnVerifyChecksum($valueString = ''): bool
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
    final protected function _RemoveAllButNumbers($valueString = ''): string
    {
        $output = preg_replace('/\D/', '', $valueString);
        return $output;
    }
    
}
