/**
 Copyright (C) 2018 Peter Lembke , CharZam soft
 the program is distributed under the terms of the GNU General Public License

 Infohub_Time is free software: you can redistribute it and/or modify
 it under the terms of the GNU General Public License as published by
 the Free Software Foundation, either version 3 of the License, or
 (at your option) any later version.

 Infohub_Time is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 GNU General Public License for more details.

 You should have received a copy of the GNU General Public License
 along with Infohub_Time.    If not, see <https://www.gnu.org/licenses/>.
 */
function infohub_time() {

    'use strict';

// include "infohub_base.js"

    const _Version = function() {
        return {
            'date': '2018-08-11',
            'since': '2018-08-11',
            'version': '1.0.0',
            'checksum': '{{checksum}}',
            'class_name': 'infohub_time',
            'note': 'Functions that give you an unpredictable answer',
            'status': 'normal',
            'SPDX-License-Identifier': 'GPL-3.0-or-later',
            'user_role': 'user',
            'web_worker': 'true',
            'core_plugin': 'false',
        };
    };

    const _GetCmdFunctions = function() {
        const $list = {
            'time': 'normal',
            'get_available_options': 'normal',
        };

        return _GetCmdFunctionsBase($list);
    };

    /**
     * Main time calculation
     * @version 2018-08-11
     * @since   2018-08-11
     * @author  Peter Lembke
     * @param $in
     * @returns {*}
     */
    $functions.push('time');
    const time = function($in = {}) {
        const $default = {
            'type': 'timestamp',
        };
        $in = _Default($default, $in);

        let $answer = 'true';
        let $message = 'Here are the time data';
        let $result = '';

        switch ($in['type']) {
            case 'timestamp':
                $result = _TimeStamp();
                break;
            case 'timestamp_c':
                $result = _TimeStamp('c');
                break;
            case 'microtime':
                $result = _MicroTime();
                break;
            case 'time':
                $result = _Time();
                break;
            default:
                $answer = 'false';
                $message = 'Not a valid type';
                break;
        }

        return {
            'answer': $answer,
            'message': $message,
            'type': $in.type,
            'data': $result,
        };
    };

    /**
     * Get seconds since epoc
     * @version 2018-08-31
     * @since   2018-08-31
     * @author  Peter Lembke
     * @return array|bool
     */
    const _Time = function() {
        let $time = _MicroTime();
        $time = $time.toString().split('.');

        return $time[0];
    };

    /**
     * Get list with time methods you can use
     * @version 2018-08-10
     * @since   2018-08-10
     * @author  Peter Lembke
     * @param array $in
     * @return array|bool
     */
    $functions.push('get_available_options');
    const get_available_options = function($in = {}) {
        const $options = [
            {
                'type': 'option',
                'value': 'timestamp',
                'label': 'Normal timestamp',
                'selected': 'true',
            },
            {
                'type': 'option',
                'value': 'timestamp_c',
                'label': 'Timestamp with offset',
            },
            {
                'type': 'option',
                'value': 'microtime',
                'label': 'EPOC with fractions',
            },
            {'type': 'option', 'value': 'time', 'label': 'Seconds since EPOC'},
        ];

        return {
            'answer': 'true',
            'message': 'List of valid time methods.',
            'options': $options,
        };
    };
}

//# sourceURL=infohub_time.js
