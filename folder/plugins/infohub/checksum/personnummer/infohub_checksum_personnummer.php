<?php
declare(strict_types=1);
if (basename(__FILE__) == basename($_SERVER["SCRIPT_FILENAME"])) {
    exit; // This file must be included, not called directly
}

/*	infohub_checksum_personnummer

		Copyright (C) 2016 Peter Lembke , CharZam soft
		the program is distributed under the terms of the GNU General Public License

		infohub_checksum_personnummer is free software: you can redistribute it and/or modify
		it under the terms of the GNU General Public License as published by
		the Free Software Foundation, either version 3 of the License, or
		(at your option) any later version.

		infohub_checksum_personnummer is distributed in the hope that it will be useful,
		but WITHOUT ANY WARRANTY; without even the implied warranty of
		MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
		GNU General Public License for more details.

		You should have received a copy of the GNU General Public License
		along with infohub_checksum_personnummer.	If not, see <https://www.gnu.org/licenses/>.
*/
class infohub_checksum_personnummer extends infohub_base
{

    protected final function _Version(): array
    {
        return array(
            'date' => '2018-07-29',
            'since' => '2016-04-17',
            'version' => '1.0.0',
            'class_name' => 'infohub_checksum_personnummer',
            'checksum' => '{{checksum}}',
            'note' => 'Swedish personnummer (personal ID number) are using a modified Luth formula to calculate the last checksum digit',
            'status' => 'normal',
            'license_name' => 'GNU GPL 3 or later'
        );
    }

    protected function _GetCmdFunctions(): array
    {
        return array(
            'calculate_checksum' => 'emerging',
            'verify_checksum' => 'emerging'
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
            'value' => '' // Example: 640823–323
        );
        $in = $this->_Default($default, $in);

        $in['value'] = $this->_CleanUPPersonnummer($in['value']);
        $result = $this->_PersonnummerCalculateChecksum($in['value']);

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
            'value' => '' // Example: 640823–3231
        );
        $in = $this->_Default($default, $in);

        $in['value'] = $this->_CleanUPPersonnummer($in['value']);

        $verified = 'false';
        $result = $this->_PersonnummerVerifyChecksum($in['value']);
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
     * Clean up the personnummer
     * @param string $value
     * @return int
     */
    final protected function _CleanUPPersonnummer(string $value = ''): string
    {
        $output = $this->_RemoveAllButNumbers($value);
        return $output;
    }

    /**
     * Swedish personal number. Almost like the Luhn calculation,
     * except that they double the odd numbers instead of the even numbers.
     * http://www.skatteverket.se/privat/folkbokforing/personnummer/personnumretsuppbyggnad.4.18e1b10334ebe8bc80001502.html
     * Example from Skatteverket: 640823–323, remove the - and it calculates to 6408233234
     * @param string $valueString
     * @return string
     */
    final protected function _PersonnummerCalculateChecksum(string $valueString = ''): string
    {

        $numbers = str_split($valueString, 1);
        $sum = 0;
        foreach ($numbers as $index => $number) {
            if ($index % 2 === 0) {
                $number = (string) (2 * $number);
                $number = $this->_PersonnummerSum($number);
            }
            $sum = $sum + $number;
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
    final protected function _PersonnummerSum(string $valueString = ''): int
    {
        $numbers = str_split($valueString, 1);
        $sum = 0;
        foreach ($numbers as $number) {
            $sum = $sum + $number;
        }
        return $sum;
    }

    /**
     * Give a fill personnummer. The last digit will be checked if it is valid
     * @param string $valueString
     * @return bool
     */
    final protected function _PersonnummerVerifyChecksum(string $valueString = ''): bool
    {
        $checksum = substr($valueString, -1);
        $valueString = substr($valueString, 0 , -1);
        $result = $this->_PersonnummerCalculateChecksum($valueString);
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
