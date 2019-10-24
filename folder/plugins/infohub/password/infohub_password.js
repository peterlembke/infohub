/*	infohub_password

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

// include "infohub_base.js"

    var _Version = function() {
        return {
            'date': '2017-04-02',
            'since': '2016-12-27',
            'version': '1.0.0',
            'checksum': '{{checksum}}',
            'class_name': 'infohub_password',
            'note': 'Generate passwords',
            'status': 'normal',
            'license_name': 'GNU GPL 3 or later',
            'source_code': 'https://github.com/peterlembke/charzam-password-generator',
            'homepage': 'http://www.charzam.com/2016/12/27/battre-losenord/'
        };
    };

    var _GetCmdFunctions = function() {
        return {
            'generate': 'normal'
        };
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
    var generate = function($in) {
        "use strict";

        var $lengthText, $message, $passwordArray, $i,
            $default = {
                'number_of_passwords': 30, // Number of passwords you want to select from
                'password_length': 0, // wanted password length, give 0 for a random length 16-64 characters
                'max_group_number': 4 // Gives a mix from 5 groups 0-4. Some sites accept only group 0-2.
            };
        $in = _Default($default, $in);

        $lengthText = '16-64';

        if ($in.password_length > 0) {
            $lengthText = $in.password_length.toString();
        }

        $message = 'Password generator '  + $lengthText + " characters from group 0-" + $in.max_group_number + '.';
        $passwordArray = [];

        for ($i = $in.number_of_passwords; $i > 0; $i--) {
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
    var _Generate = function($length, $maxGroupNumber) {
        "use strict";
        var $groupString, $groupStringArray, $result, $groupNumber, $key;

        if ($length < 0) { $length = 0; }
        if ($maxGroupNumber < 0) { $maxGroupNumber = 0; }
        if ($maxGroupNumber > 4) { $maxGroupNumber = 4; }

        if ($length === 0) {
            $length = _GetRandomLength();
        }
        $groupString = _GetGroupString($length);
        $groupStringArray = $groupString.split('');
        $result = '';
        for ($key in $groupStringArray) {
            if ($groupStringArray.hasOwnProperty($key)) {
                $groupNumber = $groupStringArray[$key];
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
    var _GetRandomLength = function() {
        "use strict";
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
    var _GetGroupString = function($length) {
        "use strict";

        if ($length < 0) { $length = 64; }

        var $start, $copies, $result;

        $start = '0000011111222333344';
        $copies = Math.ceil($length / $start.length);
        $result = $start.repeat($copies);
        $result = _Shuffle($result);
        $result = $result.substring(0, $length);
        return $result;
    };

    var _Shuffle = function($string) {
        var a = $string.split(""),
            n = a.length;

        for(var i = n - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var tmp = a[i];
            a[i] = a[j];
            a[j] = tmp;
        }
        return a.join("");
    };

    /**
     * Get a random character from the group of characters
     * @param $groupNumber
     * @param $maxGroupNumber
     * @return string
     */
    var _GetRandomGroupCharacter = function($groupNumber, $maxGroupNumber) {
        "use strict";

        var $group, $length, $position, $character;

        $group = _GetGroupData($groupNumber, $maxGroupNumber);
        $length = $group.length;
        if ($length <= 0) {
            return '';
        }

        $position = _Random(0, $length-1);
        $character = $group.substring($position, $position + 1);
        return $character;
    };

    var _Random = function($min, $max) {
        "use strict";

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
    var _GetGroupData = function($groupNumber, $maxGroupNumber) {
        "use strict";

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

        var $data = {
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
