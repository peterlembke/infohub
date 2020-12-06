/**
 * Luhn Checksums are calculated and verified here
 *
 * @author      Peter Lembke <info@infohub.se>
 * @version     2017-02-25
 * @since       2017-02-25
 * @copyright   Copyright (c) 2017, Peter Lembke
 * @license     https://opensource.org/licenses/gpl-license.php GPL-3.0-or-later
 * @see         https://github.com/peterlembke/infohub/blob/master/folder/plugins/infohub/checksum/luhn/infohub_checksum_luhn.md Documentation
 * @link        https://infohub.se/ InfoHub main page
 */
function infohub_checksum_luhn() {

    "use strict";

// include "infohub_base.js"

    const _Version = function() {
        return {
            'date': '2018-07-29',
            'since': '2017-03-01',
            'version': '1.0.0',
            'checksum': '{{checksum}}',
            'class_name': 'infohub_checksum_luhn',
            'note': 'The Luhn algorithm from 1954 are used in US and Canadian social security numbers',
            'status': 'normal',
            'SPDX-License-Identifier': 'GPL-3.0-or-later',
            'web_worker': 'true',
            'core_plugin': 'false'
        };
    };

    // https://en.wikipedia.org/wiki/Cyclic_redundancy_check

    const _GetCmdFunctions = function() {
        const $list = {
            'calculate_checksum': 'normal',
            'verify_checksum': 'normal'
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
    $functions.push("calculate_checksum");
    const calculate_checksum = function($in)
    {
        const $default = {'value': '' };
        $in = _Default($default, $in);

        $in.value = _RemoveAllButNumbers($in.value);

        const $result = _LuhnCalculateChecksum($in.value);

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
    const verify_checksum = function($in)
    {
        const $default = {
            'value': '',
            'checksum': ''
        };
        $in = _Default($default, $in);

        $in['value'] = _RemoveAllButNumbers($in['value']);

        let $verified = 'false';
        const $result = _LuhnVerifyChecksum($in.value);
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
    const _LuhnCalculateChecksum = function($valueString)
    {
        let $sum = 0;
        if ($valueString !== '') {
            const $numbers = $valueString;
            for (let $index in $numbers) {
                let $number = $numbers[$index];
                if ($index % 2 === 1) {
                    $number = (2 * $number).toString();
                    $number = _LuhnSum($number);
                }
                $sum = $sum + parseInt($number);
            }
        }

        let $checksumDigit = ($sum * 9).toString();
        $checksumDigit = $checksumDigit.slice(-1);
        const $result = $valueString + $checksumDigit;

        return $result;
    };

    const _LuhnSum = function($valueString)
    {
        const $numbers = $valueString;
        let $sum = 0;
        for (let $key in $numbers) {
            $sum = $sum + parseInt($numbers[$key]);
        }

        return $sum;
    };

    const _LuhnVerifyChecksum = function($valueString)
    {
        const $checksum = $valueString;
        $valueString = $valueString.splice(-1);
        const $result = _LuhnCalculateChecksum($valueString);
        const $resultChecksum = $result.splice(-1);

        if ($checksum === $resultChecksum) {
            return true;
        }

        return false;
    };

    const _RemoveAllButNumbers = function($valueString)
    {
        const $output = $valueString.replace(/[^0-9.]/g, "");

        return $output;
    };
}
//# sourceURL=infohub_checksum_luhn.js
