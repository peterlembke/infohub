/*
    Copyright (C) 2020 Peter Lembke , CharZam soft
    the program is distributed under the terms of the GNU General Public License

    Infohub_Timer is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    Infohub_Timer is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with Infohub_Timer.	If not, see <https://www.gnu.org/licenses/>.
 */
function infohub_timer() {

    "use strict";

// include "infohub_base.js"

    const _Version = function() {
        return {
            'date': '2020-02-28',
            'since': '2020-02-27',
            'version': '1.0.0',
            'checksum': '{{checksum}}',
            'class_name': 'infohub_timer',
            'note': 'The timer respond after some time',
            'status': 'normal',
            'license_name': 'GNU GPL 3 or later'
        };
    };

    const _GetCmdFunctions = function() {
        return {
            'start_timer': 'normal',
            'stop_timer': 'normal'
        };
    };

    let $timer = {};

    $functions.push("start_timer");
    /**
     * Send a message to here and state how many seconds you want to wait for a response
     * @version 2020-02-27
     * @since 2020-02-27
     * @author  Peter Lembke
     * @param $in
     * @returns {{milliseconds: number, answer: string, name: *, message: string, ok: boolean}|{}}
     */
    const start_timer = function($in)
    {
        const $default = {
            'name': 'default',
            'milliseconds': 0,
            'update': 'no', // no, yes, lower, higher
            'callback_function': null,
            'from_plugin': {
                'node': '',
                'plugin': '',
                'function': ''
            }
        };
        $in = _Default($default, $in);

        let $out = {
            'answer': 'true',
            'message': '',
            'name': $in.name,
            'milliseconds': $in.milliseconds,
            'ok': false
        };

        if ($in.milliseconds <= 0) {
            $out.message = 'Please provide a positive amount of milliseconds';
            return $out;
        }

        if (_TimerExist($in) === 'false') {
            _StartTimer($in);
            return {};
        }

        if ($in.update === 'yes') {
            _StopTimer($in);
            _StartTimer($in);
            return {};
        }

        let $newTimeIs = _CompareTime($in); // higher or lower

        if ($in.update === $newTimeIs) {
            _StopTimer($in);
            _StartTimer($in);
            return {};
        }

        $out.message = 'Left the timer as it is';

        return $out;
    };

    $functions.push("stop_timer");
    /**
     * Stop a timer if it is started
     * @version 2020-02-27
     * @since 2020-02-27
     * @author  Peter Lembke
     * @param $in
     * @returns {{was_set: string, answer: string, message: string}}
     */
    const stop_timer = function($in)
    {
        const $default = {
            'name': 'default',
            'from_plugin': {
                'node': '',
                'plugin': '',
                'function': ''
            }
        };
        $in = _Default($default, $in);

        return _StopTimer($in);
    };

    /**
     * Check if timer already exist
     * @version 2020-02-28
     * @since 2020-02-28
     * @author  Peter Lembke
     * @param $in
     * @returns {string}
     * @private
     */
    const _TimerExist = function($in)
    {
        const $default = {
            'name': 'default',
            'from_plugin': {
                'node': '',
                'plugin': '',
                'function': ''
            }
        };
        $in = _Default($default, $in);

        let $isSet = 'false';

        if (_IsSet($timer[$in.from_plugin.plugin]) === 'false') {
            $timer[$in.from_plugin.plugin] = {};
            return $isSet;
        }

        if (_IsSet($timer[$in.from_plugin.plugin][$in.name]) === 'true') {
            if (_Full($timer[$in.from_plugin.plugin][$in.name]) === 'true') {
                $isSet = 'true';
            }
        }

        return $isSet;
    };

    /**
     * Start a timer if not already exist
     * @version 2020-02-28
     * @since 2020-02-28
     * @author  Peter Lembke
     * @param $in
     * @returns {{}|{was_set: string, answer: string, message: string}}
     * @private
     */
    const _StartTimer = function($in)
    {
        const $default = {
            'name': 'default',
            'milliseconds': 0,
            'update': 'no', // no, yes, lower, higher
            'callback_function': null,
            'from_plugin': {
                'node': '',
                'plugin': '',
                'function': ''
            }
        };
        $in = _Default($default, $in);

        let $out = {
            'answer': 'true',
            'message': 'Timer was already set',
            'was_set': 'true'
        };

        if (_TimerExist($in) === 'true') {
            return $out;
        }

        const $myTimer = setTimeout(function() {
            $in.callback_function({
                'answer': 'true',
                'message': 'I answer you now',
                'name': $in.name,
                'milliseconds': $in.milliseconds,
                'ok': 'true'
            });
        }, $in.milliseconds);

        $timer[$in.from_plugin.plugin][$in.name] = {
            'time': _MicroTime() + $in.milliseconds / 1000.0,
            'timer': $myTimer
        };

        return {};
    };

    /**
     * Stop timer if it exist
     * @version 2020-02-28
     * @since 2020-02-28
     * @author  Peter Lembke
     * @param $in
     * @returns {{was_set: string, answer: string, message: string}}
     * @private
     */
    const _StopTimer = function($in)
    {
        const $default = {
            'name': 'default',
            'from_plugin': {
                'node': '',
                'plugin': '',
                'function': ''
            }
        };
        $in = _Default($default, $in);

        let $out = {
            'answer': 'true',
            'message': 'Timer was not set',
            'was_set': 'false'
        };

        if (_TimerExist($in) === 'false') {
            return $out;
        }

        clearTimeout($timer[$in.from_plugin.plugin][$in.name].timer);
        $timer[$in.from_plugin.plugin][$in.name] = {};

        $out.message = 'Cleared the timer';
        $out.was_set = 'true';

        return $out;
    };

    /**
     * Check if wanted time is lower or higher than existing time
     * @version 2020-02-28
     * @since 2020-02-28
     * @author  Peter Lembke
     * @param $in
     * @returns {string}
     * @private
     */
    const _CompareTime = function($in)
    {
        const $default = {
            'milliseconds': 0,
            'name': 'default',
            'from_plugin': {
                'node': '',
                'plugin': '',
                'function': ''
            }
        };
        $in = _Default($default, $in);

        const $newTime = _MicroTime() + $in.milliseconds / 1000.0;
        const $currentTime = $timer[$in.from_plugin.plugin][$in.name].time;

        let $response = 'lower';
        if ($newTime > $currentTime) {
            $response = 'higher';
        }

        return $response;
    };

}
//# sourceURL=infohub_timer.js
