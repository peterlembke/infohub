/**
 * CRC32 Checksums are calculated and verified here
 *
 * @author      Peter Lembke <info@infohub.se>
 * @version     2017-02-25
 * @since       2017-02-25
 * @copyright   Copyright (c) 2017, Peter Lembke
 * @license     https://opensource.org/licenses/gpl-license.php GPL-3.0-or-later
 * @see         https://github.com/peterlembke/infohub/blob/master/folder/plugins/infohub/checksum/crc32/infohub_checksum_crc32.md Documentation
 * @link        https://infohub.se/ InfoHub main page
 */
function infohub_checksum_crc32() {

    'use strict';

// include "infohub_base.js"

    const _Version = function() {
        return {
            'date': '2017-02-25',
            'since': '2017-02-25',
            'version': '1.0.0',
            'checksum': '{{checksum}}',
            'class_name': 'infohub_checksum_crc32',
            'note': 'Cyclic redundancy check from 1961 are well suited for detecting burst errors',
            'status': 'normal',
            'SPDX-License-Identifier': 'GPL-3.0-or-later',
            'web_worker': 'true',
            'core_plugin': 'false',
        };
    };

    // https://en.wikipedia.org/wiki/Cyclic_redundancy_check

    const _GetCmdFunctions = function() {
        const $list = {
            'calculate_checksum': 'emerging',
            'verify_checksum': 'emerging',
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
    const calculate_checksum = function($in = {}) {
        const $default = {
            'value': '',
        };
        $in = _Default($default, $in);

        const $result = _Crc32($in.value);

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
    const verify_checksum = function($in = {}) {
        const $default = {
            'value': '',
            'checksum': '',
        };
        $in = _Default($default, $in);

        let $verified = 'false';
        const $response = _Crc32($in.value);
        if ($response === $in.checksum) {
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

    /**
     * crc32 checksum calculation
     *
     * This function was published on Stack Overflow by "Alex".
     * http://stackoverflow.com/questions/18638900/javascript-crc32
     * License on stackoverflow: http://stackoverflow.com/help/licensing
     * all user contributions are licensed under Creative Commons Attribution-Share Alike.
     *
     * I made a minor modification to remove the cache for the CTC table.
     * 2020-05-17 Refactored. Used let and const and added $ to variable names
     * @version 2020-05-17
     * @since   2017-02-25
     * @author  http://stackoverflow.com/users/1775178/alex
     * @param $value
     * @private
     */
    const _Crc32 = function($value) {
        const makeCRCTable = function() {
            let $c;
            let $crcTable = [];

            for (let $n = 0; $n < 256; $n++) {
                $c = $n;
                for (let k = 0; k < 8; k++) {
                    $c = (($c & 1) ? (0xEDB88320 ^ ($c >>> 1)) : ($c >>> 1));
                }
                $crcTable[$n] = $c;
            }

            return $crcTable;
        };

        const crc32 = function(str) {
            const $crcTable = makeCRCTable();
            let $crc = 0 ^ (-1);

            for (var $i = 0; $i < str.length; $i++) {
                $crc = ($crc >>> 8) ^
                    $crcTable[($crc ^ str.charCodeAt($i)) & 0xFF];
            }

            return ($crc ^ (-1)) >>> 0;
        };

        return crc32($value);
    };

}

//# sourceURL=infohub_checksum_crc32.js
