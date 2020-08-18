<?php
declare(strict_types=1);
if (basename(__FILE__) == basename($_SERVER["SCRIPT_FILENAME"])) {
    exit; // This file must be included, not called directly
}

/*	infohub_password

		Copyright (C) 2016 Peter Lembke , CharZam soft
		the program is distributed under the terms of the GNU General Public License

		infohub_password is free software: you can redistribute it and/or modify
		it under the terms of the GNU General Public License as published by
		the Free Software Foundation, either version 3 of the License, or
		(at your option) any later version.

		infohub_password is distributed in the hope that it will be useful,
		but WITHOUT ANY WARRANTY; without even the implied warranty of
		MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
		GNU General Public License for more details.

		You should have received a copy of the GNU General Public License
		along with infohub_password.	If not, see <https://www.gnu.org/licenses/>.
*/
class infohub_password extends infohub_base
{

    protected final function _Version(): array
    {
        return array(
            'date' => '2017-04-02',
            'since' => '2016-12-27',
            'version' => '1.0.0',
            'class_name' => 'infohub_password',
            'checksum' => '{{checksum}}',
            'note' => 'Generate passwords',
            'status' => 'normal',
            'SPDX-License-Identifier' => 'GPL-3.0-or-later',
            'source_code' => 'https://github.com/peterlembke/charzam-password-generator',
            'homepage' => 'http://www.charzam.com/2016/12/27/battre-losenord/',
            'user_role' => 'user'
        );
    }

    protected function _GetCmdFunctions(): array
    {
        $list = array(
            'generate' => 'normal'
        );

        return parent::_GetCmdFunctionsBase($list);
    }

    // ***********************************************************
    // * your class functions below, only use protected functions
    // ***********************************************************

    /**
     * Generate an array with new passwords
     * @version 2017-04-02
     * @since   2016-12-27
     * @author  Peter Lembke
     * @param array $in
     * @return array|bool
     */
    final protected function generate(array $in = array())
    {
        $default = array(
            'number_of_passwords' => 30, // Number of passwords you want to select from
            'password_length' => 0, // wanted password length, give 0 for a random length 16-64 characters
            'max_group_number' => 4 // Gives a mix from 5 groups 0-4. Some sites accept only group 0-2.
        );
        $in = $this->_Default($default, $in);

        $lengthText = '16-64';
        if ($in['password_length'] > 0) {
            $lengthText = (string) $in['password_length'];
        }

        $message = 'Password generator ' .$lengthText. " characters from group 0-" . $in['max_group_number'] . '.';
        $passwordArray = array();

        for ($i = $in['number_of_passwords']; $i > 0; $i--) {
            $passwordArray[] = $this->_Generate($in['password_length'], $in['max_group_number']);
        }

        return array(
            'answer' => 'true',
            'message' => $message,
            'passwords' => $passwordArray
        );
    }

    /**
     * Generates a password
     * @param int $length | wanted password length, give 0 for a random length 16-64 characters
     * @param int $maxGroupNumber | Gives a mix from 5 groups 0-4. Some sites accept only group 0-2.
     * @return string
     */
    final protected function _Generate(int $length = 0, int $maxGroupNumber = 4): string
    {
        if ($length === 0) {
            $length = $this->_GetRandomLength();
        }
        $groupString = $this->_GetGroupString($length);
        $groupStringArray = str_split($groupString);
        $result = '';
        foreach ($groupStringArray as $groupNumber) {
            $result = $result . $this->_GetRandomGroupCharacter($groupNumber, $maxGroupNumber);
        }

        $result = trim($result);

        return $result;
    }

    /**
     * A 16 character password is shamelessly small but some like it short.
     * @return mixed
     */
    final protected function _GetRandomLength() {
        $length = $this->_Random(16,64);
        return $length;
    }

    /**
     * A string with group numbers.
     * This string makes it more likely that we later get a good mix of characters from different character groups.
     * Constructs a string with at least enough group numbers to cover the wanted password length.
     * Then shuffle the group numbers.
     * Then cut the string into the right length. (This can be an issue but then just try another password)
     * @param int $length
     * @return string
     */
    final protected function _GetGroupString($length = 64) {
        $start = '0000011111222333344';
        $copies = (int) ceil($length / strlen($start));
        $result = str_repeat($start, $copies);
        $result = str_shuffle($result);
        $result = substr($result, 0, $length);
        return $result;
    }

    /**
     * Get a random character from the group of characters
     * @param $groupNumber
     * @param $maxGroupNumber
     * @return string
     */
    final protected function _GetRandomGroupCharacter($groupNumber, $maxGroupNumber) {
        $group = $this->_GetGroupData($groupNumber, $maxGroupNumber);
        $length = strlen($group);
        if ($length <= 0) {
            return '';
        }

        $position = $this->_Random(0, $length-1);
        $character = substr($group, $position, 1);
        return $character;
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

    /**
     * Often passwords require characters from different groups,
     * a CAPITAL letter, a number, a special character etc.
     * @param int $groupNumber | Get one of the lines
     * @param int $maxGroupNumber | In some cases special characters are not allowed
     * @return mixed
     */
    final protected function _GetGroupData($groupNumber = 0, $maxGroupNumber = 4) {

        if ($groupNumber < 0) {
            $groupNumber = 0;
        }

        if ($groupNumber > $maxGroupNumber) {
            $groupNumber = $maxGroupNumber;
        }

        $data = array(
            0 => 'abcdefghijklmnopqrstuvwxyz',
            1 => 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
            2 => '0123456789',
            3 => '!#%&()=?+-*:;,._',
            4 => ' ',
        );

        return $data[$groupNumber];
    }
}
