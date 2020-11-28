/**	infohub_password

 Copyright (C) 2017 Peter Lembke , CharZam soft
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
function infohub_password() {

    "use strict";

// include "infohub_base.js"

    const _Version = function() {
        return {
            'date': '2017-04-02',
            'since': '2016-12-27',
            'version': '1.0.0',
            'checksum': '{{checksum}}',
            'class_name': 'infohub_password',
            'note': 'Generate passwords',
            'status': 'normal',
            'SPDX-License-Identifier': 'GPL-3.0-or-later',
            'source_code': 'https://github.com/peterlembke/charzam-password-generator',
            'homepage': 'http://www.charzam.com/2016/12/27/battre-losenord/',
            'user_role': 'user'
        };
    };

    const _GetCmdFunctions = function() {
        const $list = {
            'generate': 'normal'
        };

        return _GetCmdFunctionsBase($list);
    };

    // ***********************************************************
    // * your class functions below, only use protected functions
    // ***********************************************************

    /**
     * Generate an array with new passwords
     * @version 2017-04-02
     * @since   2016-12-27
     * @author  Peter Lembke
     * @param $in
     * @returns {*}
     */
    $functions.push("generate");
    const generate = function($in)
    {
        const $default = {
            'number_of_passwords': 30, // Number of passwords you want to select from
            'password_length': 0, // wanted password length, give 0 for a random length 16-64 characters
            'max_group_number': 4 // Gives a mix from 5 groups 0-4. Some sites accept only group 0-2.
        };
        $in = _Default($default, $in);

        let $lengthText = '16-64';

        if ($in.password_length > 0) {
            $lengthText = $in.password_length.toString();
        }

        const $message = 'Password generator '  + $lengthText + " characters from group 0-" + $in.max_group_number + '.';
        let $passwordArray = [];

        for (let $passwordNumber = $in.number_of_passwords; $passwordNumber > 0; $passwordNumber = $passwordNumber - 1) {
            $passwordArray.push(_Generate($in.password_length, $in.max_group_number));
        }

        return {
            'answer': 'true',
            'message': $message,
            'passwords': $passwordArray
        };
    };

    /**
     * Generates a password
     * @param $length | wanted password length, give 0 for a random length 16-64 characters
     * @param $maxGroupNumber | Gives a mix from 5 groups 0-4. Some sites accept only group 0-2.
     * @return string
     */
    const _Generate = function($length, $maxGroupNumber)
    {
        if ($length < 0) { $length = 0; }
        if ($maxGroupNumber < 0) { $maxGroupNumber = 0; }
        if ($maxGroupNumber > 4) { $maxGroupNumber = 4; }

        if ($length === 0) {
            $length = _GetRandomLength();
        }
        const $groupString = _GetGroupString($length);
        const $groupStringArray = $groupString.split('');
        let $result = '';
        for (let $key in $groupStringArray) {
            if ($groupStringArray.hasOwnProperty($key)) {
                const $groupNumber = $groupStringArray[$key];
                $result = $result + _GetRandomGroupCharacter($groupNumber, $maxGroupNumber);
            }
        }

        $result = $result.trim();

        return $result;
    };

    /**
     * A 16 character password is shamelessly small but some like it short.
     * @return mixed
     */
    const _GetRandomLength = function()
    {
        return _Random(16,64);
    };

    /**
     * A string with group numbers.
     * This string makes it more likely that we later get a good mix of characters from different character groups.
     * Constructs a string with at least enough group numbers to cover the wanted password length.
     * Then shuffle the group numbers.
     * Then cut the string into the right length. (This can be an issue but then just try another password)
     * @param $length
     * @return string
     */
    const _GetGroupString = function($length)
    {
        if ($length < 0) { $length = 64; }

        const $start = '0000011111222333344';
        const $copies = Math.ceil($length / $start.length);
        let $result = $start.repeat($copies);
        $result = _Shuffle($result);
        $result = $result.substring(0, $length);

        return $result;
    };

    const _Shuffle = function($string)
    {
        const $characterArray = $string.split(""),
            $characterCount = $characterArray.length;

        for (let $characterNumber = $characterCount - 1; $characterNumber > 0; $characterNumber = $characterNumber - 1)
        {
            const $characterNewNumber = Math.floor(Math.random() * ($characterNumber + 1));
            const $copyCharacter = $characterArray[$characterNumber];
            $characterArray[$characterNumber] = $characterArray[$characterNewNumber];
            $characterArray[$characterNewNumber] = $copyCharacter;
        }

        return $characterArray.join("");
    };

    /**
     * Get a random character from the group of characters
     * @param $groupNumber
     * @param $maxGroupNumber
     * @return string
     */
    const _GetRandomGroupCharacter = function($groupNumber, $maxGroupNumber)
    {
        const $group = _GetGroupData($groupNumber, $maxGroupNumber);
        const $length = $group.length;
        if ($length <= 0) {
            return '';
        }

        const $position = _Random(0, $length-1);
        const $character = $group.substring($position, $position + 1);

        return $character;
    };

    const _Random = function($min, $max)
    {
        if ($min < 0) { $min = 0; }
        if ($max < 0) { $max = 0; }

        return Math.floor(Math.random() * ($max - $min + 1)) + $min;
    };

    /**
     * Often passwords require characters from different groups,
     * a CAPITAL letter, a number, a special character etc.
     * @param $groupNumber | Get one of the lines
     * @param $maxGroupNumber | In some cases special characters are not allowed
     * @return mixed
     */
    const _GetGroupData = function($groupNumber, $maxGroupNumber)
    {
        if ($groupNumber < 0) {
            $groupNumber = 0;
        }

        if ($maxGroupNumber < 0) {
            $maxGroupNumber = 0;
        }

        if ($maxGroupNumber > 4) {
            $maxGroupNumber = 4;
        }

        if ($groupNumber > $maxGroupNumber) {
            $groupNumber = $maxGroupNumber;
        }

        const $data = {
            0: 'abcdefghijklmnopqrstuvwxyz',
            1: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
            2: '0123456789',
            3: '!#%&()=?+-*:;,._',
            4: ' '
        };

        return $data[$groupNumber];
    };
}
//# sourceURL=infohub_password.js
