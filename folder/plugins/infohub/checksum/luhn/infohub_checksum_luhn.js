/*	infohub_checksum_luhn

 Copyright (C) 2017 Peter Lembke , CharZam soft
 the program is distributed under the terms of the GNU General Public License

 Infohub_Checksum_Personnummer is free software: you can redistribute it and/or modify
 it under the terms of the GNU General Public License as published by
 the Free Software Foundation, either version 3 of the License, or
 (at your option) any later version.

 Infohub_Checksum_Personnummer is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 GNU General Public License for more details.

 You should have received a copy of the GNU General Public License
 along with Infohub_Checksum_Personnummer.	If not, see <https://www.gnu.org/licenses/>.
 */
function infohub_checksum_luhn() {

// include "infohub_base.js"

    var _Version = function() {
        return {
            'date': '2018-07-29',
            'since': '2017-03-01',
            'version': '1.0.0',
            'checksum': '{{checksum}}',
            'class_name': 'infohub_checksum_luhn',
            'note': 'The Luhn algorithm from 1954 are used in US and Canadian social security numbers',
            'status': 'normal',
            'license_name': 'GNU GPL 3 or later'
        };
    };

    // https://en.wikipedia.org/wiki/Cyclic_redundancy_check

    var _GetCmdFunctions = function() {
        return {
            'calculate_checksum': 'normal',
            'verify_checksum': 'normal'
        };
    };

    // ***********************************************************
    // * your class functions below, only use protected functions
    // ***********************************************************

    /**
     * Main checksum calculation
     * @version 2016-04-16
     * @since   2016-04-16
     * @author  Peter Lembke
     * @param array $in
     * @return array|bool
     */
    $functions.push("calculate_checksum");
    var calculate_checksum = function($in) {
        "use strict";
        var $result,
            $default = {'value': '' };
        $in = _Default($default, $in);

        $in['value'] = _RemoveAllButNumbers($in['value']);

        $result = _LuhnCalculateChecksum($in.value);

        return {
            'answer': 'true',
            'message': 'Here are the checksum',
            'value': $in.value,
            'checksum': $result.toString(),
            'verified': 'false'
        };
    };

    /**
     * Main checksum calculation
     * @version 2016-04-16
     * @since   2016-04-16
     * @author  Peter Lembke
     * @param array $in
     * @return array|bool
     */
    $functions.push("verify_checksum");
    var verify_checksum = function($in) {
        "use strict";
        var $verified, $result,
            $default = {
                'value': '',
                'checksum': ''
            };
        $in = _Default($default, $in);

        $in['value'] = _RemoveAllButNumbers($in['value']);

        $verified = 'false';
        $result = _LuhnVerifyChecksum($in.value);
        if ($result === true) {
            $verified = 'true';
        }

        return {
            'answer': 'true',
            'message': 'Here are the result of the checksum verification',
            'value': $in.value,
            'checksum': $in.checksum,
            'verified': $verified
        };
    };

    /**
     * https://en.wikipedia.org/wiki/Luhn_algorithm
     * http://rosettacode.org/wiki/Luhn_test_of_credit_card_numbers
     * @param $valueString
     * @returns {string}
     * @private
     */
    var _LuhnCalculateChecksum = function($valueString) {
        "use strict";
        var $numbers, $number, $sum, $index, $checksumDigit, $result;

        $sum = 0;
        if ($valueString !== '') {
            $numbers = $valueString;
            for ($index in $numbers) {
                $number = $numbers[$index];
                if ($index % 2 === 1) {
                    $number = (2 * $number).toString();
                    $number = _LuhnSum($number);
                }
                $sum = $sum + parseInt($number);
            }
        }

        $checksumDigit = ($sum * 9).toString();
        $checksumDigit = $checksumDigit.slice(-1);
        $result = $valueString + $checksumDigit;

        return $result;
    };

    var _LuhnSum = function($valueString) {
        "use strict";
        var $numbers, $sum, $key;

        $numbers = $valueString;
        $sum = 0;
        for ($key in $numbers) {
            $sum = $sum + parseInt($numbers[$key]);
        }
        return $sum;
    };

    var _LuhnVerifyChecksum = function($valueString) {
        "use strict";
        var $checksum, $result, $resultChecksum;

        $checksum = $valueString;
        $valueString = $valueString.splice(-1);
        $result = _LuhnCalculateChecksum($valueString);
        $resultChecksum = $result.splice(-1);
        if ($checksum === $resultChecksum) {
            return true;
        }
        return false;
    };

    var _RemoveAllButNumbers = function($valueString) {
        "use strict";
        var $output = $valueString.replace(/[^0-9.]/g, "");
        return $output;
    };
}
//# sourceURL=infohub_checksum_luhn.js
