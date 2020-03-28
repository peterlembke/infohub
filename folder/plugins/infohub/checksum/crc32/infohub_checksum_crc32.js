/*	infohub_checksum_crc32

 Copyright (C) 2017 Peter Lembke , CharZam soft
 the program is distributed under the terms of the GNU General Public License

 Infohub_Checksum_crc32 is free software: you can redistribute it and/or modify
 it under the terms of the GNU General Public License as published by
 the Free Software Foundation, either version 3 of the License, or
 (at your option) any later version.

 Infohub_Checksum_crc32 is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 GNU General Public License for more details.

 You should have received a copy of the GNU General Public License
 along with Infohub_Checksum.	If not, see <https://www.gnu.org/licenses/>.
 */
function infohub_checksum_crc32() {

    "use strict";

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
            'license_name': 'GNU GPL 3 or later'
        };
    };

    // https://en.wikipedia.org/wiki/Cyclic_redundancy_check

    const _GetCmdFunctions = function() {
        return {
            'calculate_checksum': 'emerging',
            'verify_checksum': 'emerging'
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
    const calculate_checksum = function($in)
    {
        const $default = {'value': '' };
        $in = _Default($default, $in);

        const $result = _Crc32($in.value);

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
            'verified': $verified
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
     * @version 2017-02-25
     * @since   2017-02-25
     * @author  http://stackoverflow.com/users/1775178/alex
     * @param $value
     * @private
     */
    const _Crc32 = function($value)
    {
        const makeCRCTable = function(){
            var c;
            var crcTable = [];
            for(let n =0; n < 256; n++){
                c = n;
                for(let k =0; k < 8; k++){
                    c = ((c&1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1));
                }
                crcTable[n] = c;
            }
            return crcTable;
        };

        const crc32 = function(str) {
            var crcTable = makeCRCTable();
            var crc = 0 ^ (-1);

            for (var i = 0; i < str.length; i++ ) {
                crc = (crc >>> 8) ^ crcTable[(crc ^ str.charCodeAt(i)) & 0xFF];
            }

            return (crc ^ (-1)) >>> 0;
        };

        return crc32($value);
    };

}
//# sourceURL=infohub_checksum_crc32.js
