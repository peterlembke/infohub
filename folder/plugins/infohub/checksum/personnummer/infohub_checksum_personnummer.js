/**
 * Swedish personnummer (personal number) Checksums are calculated and verified here
 *
 * @author      Peter Lembke <info@infohub.se>
 * @version     2017-02-25
 * @since       2017-02-25
 * @copyright   Copyright (c) 2017, Peter Lembke
 * @license     https://opensource.org/licenses/gpl-license.php GPL-3.0-or-later
 * @see         https://github.com/peterlembke/infohub/blob/master/folder/plugins/infohub/checksum/personnummer/infohub_checksum_personnummer.md Documentation
 * @link        https://infohub.se/ InfoHub main page
 */
function infohub_checksum_personnummer() {

    'use strict';

// include "infohub_base.js"

    const _Version = function() {
        return {
            'date': '2018-07-29',
            'since': '2017-03-01',
            'version': '1.0.0',
            'checksum': '{{checksum}}',
            'class_name': 'infohub_checksum_personnummer',
            'note': 'Swedish personnummer (personal ID number) are using a modified Luth formula to calculate the last checksum digit',
            'status': 'normal',
            'SPDX-License-Identifier': 'GPL-3.0-or-later',
            'web_worker': 'true',
            'core_plugin': 'false',
        };
    };

    // https://en.wikipedia.org/wiki/Cyclic_redundancy_check

    const _GetCmdFunctions = function() {
        const $list = {
            'calculate_checksum': 'normal',
            'verify_checksum': 'normal',
        };

        return _GetCmdFunctionsBase($list);
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
    $functions.push('calculate_checksum');
    const calculate_checksum = function($in) {
        const $default = {
            'value': '',
        };
        $in = _Default($default, $in);

        $in.value = _CleanUpPersonnummer($in.value);
        const $result = _PersonnummerCalculateChecksum($in.value);

        return {
            'answer': 'true',
            'message': 'Here are the checksum',
            'value': $in.value,
            'checksum': $result.toString(),
            'verified': 'false',
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
    $functions.push('verify_checksum');
    const verify_checksum = function($in) {
        const $default = {
            'value': '',
            'checksum': '',
        };
        $in = _Default($default, $in);

        $in.value = _CleanUpPersonnummer($in.value);

        const $result = _PersonnummerVerifyChecksum($in.value);

        let $verified = 'false';
        if ($result === $in.checksum) {
            $verified = 'true';
        }

        return {
            'answer': 'true',
            'message': 'Here are the result of the checksum verification',
            'value': $in.value,
            'checksum': $in.checksum,
            'verified': $verified,
        };
    };

    const _CleanUpPersonnummer = function($value) {
        return _RemoveAllButNumbers($value);
    };

    /**
     * Swedish personal number. Almost like the Luhn calculation,
     * except that they double the odd numbers instead of the even numbers.
     * http://www.skatteverket.se/privat/folkbokforing/personnummer/personnumretsuppbyggnad.4.18e1b10334ebe8bc80001502.html
     * Example from Skatteverket: 640823–323, remove the - and it calculates to 6408233234
     * @param string $valueString
     * @return string
     */
    const _PersonnummerCalculateChecksum = function($valueString) {
        const $numbers = $valueString;
        let $sum = 0;

        for (let $index in $numbers) {
            let $number = $numbers[$index];
            if ($index % 2 === 0) {
                $number = (2 * $number).toString();
                $number = _PersonnummerSum($number);
            }
            $sum = $sum + parseInt($number);
        }

        let $checksumDigit = ($sum * 9).toString();
        $checksumDigit = $checksumDigit.slice(-1);
        const $result = $valueString + $checksumDigit;

        return $result;
    };

    const _PersonnummerSum = function($valueString) {
        const $numbers = $valueString;
        let $sum = 0;
        for (let $key in $numbers) {
            if ($numbers.hasOwnProperty($key)) {
                $sum = $sum + parseInt($numbers[$key]);
            }
        }

        return $sum;
    };

    const _PersonnummerVerifyChecksum = function($valueString) {
        const $checksum = $valueString;
        $valueString = $valueString.splice(-1);
        const $result = _PersonnummerCalculateChecksum($valueString);
        const $resultChecksum = $result.splice(-1);

        if ($checksum === $resultChecksum) {
            return true;
        }

        return false;
    };

    const _RemoveAllButNumbers = function($valueString) {
        const $output = $valueString.replace(/[^0-9.]/g, '');

        return $output;
    };

}

//# sourceURL=infohub_checksum_personnummer.js
