/*	infohub_checksum_doublemetaphone

 Copyright (C) 2017 Peter Lembke , CharZam soft
 the program is distributed under the terms of the GNU General Public License

 Infohub_Checksum_Doublemetaphone is free software: you can redistribute it and/or modify
 it under the terms of the GNU General Public License as published by
 the Free Software Foundation, either version 3 of the License, or
 (at your option) any later version.

 Infohub_Checksum_Doublemetaphone is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 GNU General Public License for more details.

 You should have received a copy of the GNU General Public License
 along with Infohub_Checksum_Doublemetaphone.	If not, see <https://www.gnu.org/licenses/>.
 */
function infohub_checksum_doublemetaphone() {

// include "infohub_base.js"

    var _Version = function() {
        return {
            'date': '2018-07-29',
            'since': '2017-03-01',
            'version': '1.0.0',
            'checksum': '{{checksum}}',
            'class_name': 'infohub_checksum_doublemetaphone',
            'note': 'The Double Metaphone phonetic encoding algorithm is the second generation of this algorithm.',
            'status': 'normal',
            'license_name': 'GNU GPL 3 or later'
        };
    };

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
    var calculate_checksum = function($in) 
    {
        "use strict";
        var $default = {
            'value': '' 
        };
        $in = _Default($default, $in);

        return {
            'answer': 'true',
            'message': 'Here are the checksum',
            'value': $in.value,
            'checksum': 'Double Metaphone is not implemented on the client node',
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
    var verify_checksum = function($in) 
    {
        "use strict";
        var $verified,
            $default = {
                'value': '',
                'checksum': ''
            };
        $in = _Default($default, $in);

        $verified = 'false';

        return {
            'answer': 'true',
            'message': 'Here are the result of the checksum verification',
            'value': $in.value,
            'checksum': $in.checksum,
            'verified': $verified
        };
    };

}
//# sourceURL=infohub_checksum_doublemetaphone.js
