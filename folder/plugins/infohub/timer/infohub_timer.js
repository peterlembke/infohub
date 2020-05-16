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
            'SPDX-License-Identifier': 'GPL-3.0-or-later',
            'recommended_security_group': 'user'
        };
    };

    const _GetCmdFunctions = function() {
        return {
            'start_timer': 'normal',
            'start_timer_advanced': 'normal',
            'stop_timer': 'normal'
        };
    };

    let $timer = {};

    $functions.push("start_timer");
    /**
     * Send a message to here and state how many seconds you want to wait for a response
     * @version 2020-03-08
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
            'ok': 'false'
        };

        if ($in.from_plugin.node !== 'client') {
            $out.message = 'Only the client node can set a timer';
            return $out;
        }

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

    $functions.push("start_timer_advanced");
    /**
     * Send a message to here and state when you want a response
     * @version 2020-03-08
     * @since 2020-03-08
     * @author  Peter Lembke
     * @param $in
     * @returns {{milliseconds: number, answer: string, name: *, message: string, ok: boolean}|{}}
     */
    const start_timer_advanced = function($in)
    {
        const $default = {
            'name': 'default',
            'when': 0, // When do you want a response
            'earliest': 0, // Set an earliest timestamp when I'll give a response
            'latest': 0, // Set a latest timestamp when I'll give a response
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
            'ok': 'false'
        };

        if ($in.from_plugin.node !== 'client') {
            $out.message = 'Only the client node can set a timer';
            return $out;
        }

        if (_IsSet($timer[$in.from_plugin.plugin]) === 'false') {
            $timer[$in.from_plugin.plugin] = {};
        }

        if (_IsSet($timer[$in.from_plugin.plugin][$in.name]) === 'false') {
            $timer[$in.from_plugin.plugin][$in.name] = {};
        }

        const $done = _GetData({
            'name': $in.from_plugin.plugin + '/' + $in.name + '/done',
            'default': 'true',
            'data': $timer,
        });

        if ($in.update === 'no' && $done === 'false') {
            $out.message = 'We already have an active timer and you have set update=no';
            return $out;
        }

        if ($done === 'true') {
            $timer[$in.from_plugin.plugin][$in.name].earliest = 0.0;
            $timer[$in.from_plugin.plugin][$in.name].latest = 0.0;
            $timer[$in.from_plugin.plugin][$in.name].when = 0.0;
        }

        let $now = _MicroTime();
        if ($in.when <= $now) {
            $out.message = 'The wanted time has already passed';
            return $out;
        }
        $timer[$in.from_plugin.plugin][$in.name].now = $now;

        let $earliest = _GetData({
            'name': $in.from_plugin.plugin + '/' + $in.name + '/earliest',
            'default': 0.0,
            'data': $timer
        });

        if ($earliest === 0.0 && $in.earliest > 0.0) {
            $earliest = $in.earliest;
        }

        $timer[$in.from_plugin.plugin][$in.name].earliest = $earliest;

        let $latest = _GetData({
            'name': $in.from_plugin.plugin + '/' + $in.name + '/latest',
            'default': 0.0,
            'data': $timer,
        });

        if ($latest === 0.0 && $in.latest > 0.0) {
            $latest = $in.latest;
        }

        $timer[$in.from_plugin.plugin][$in.name].latest = $latest;

        let $newTime = $in.when;

        let $currentTime = _GetData({
            'name': $in.from_plugin.plugin + '/' + $in.name + '/when',
            'default': $in.when,
            'data': $timer,
        });

        if ($newTime < $now) {
            $newTime = $now;
        }

        if ($earliest > 0.0 && $newTime < $earliest) {
            $newTime = $earliest;
        }

        if ($latest > 0.0 && $newTime > $latest) {
            $newTime = $latest;
        }

        $timer[$in.from_plugin.plugin][$in.name].when = $newTime;

        $in.milliseconds = ($newTime - $now) * 1000.0;

        if (_TimerExist($in) === 'false') {
            _StartTimer($in);
            return {};
        }

        if ($in.update === 'yes') {
            _StopTimer($in);
            _StartTimer($in);
            return {};
        }

        let $newTimeIs = '';
        if ($newTime < $currentTime) {
            $newTimeIs = 'lower';
        }
        if ($newTime > $currentTime) {
            $newTimeIs = 'higher';
        }

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
     * @version 2020-03-08
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

        if ($in.from_plugin.node !== 'client') {
            return {
                'answer': 'false',
                'message': 'Only the client node can stop a timer'
            };
        }

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

        const $name = $in.from_plugin.plugin + '/' + $in.name + '/done';

        const $done = _GetData({
            'name': $name,
            'default': 'true',
            'data': $timer // Class global
        });

        if ($done === 'true') {
            return 'false';
        }

        return 'true';
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

        if (_IsSet($timer[$in.from_plugin.plugin]) === 'false') {
            $timer[$in.from_plugin.plugin] = {};
        }

        if (_IsSet($timer[$in.from_plugin.plugin][$in.name]) === 'false') {
            $timer[$in.from_plugin.plugin][$in.name] = {};
        }

        const $myTimer = setTimeout(function()
        {
            $timer[$in.from_plugin.plugin][$in.name].done = 'true';
            $timer[$in.from_plugin.plugin][$in.name].done_now = _MicroTime();

            $in.callback_function({
                'answer': 'true',
                'message': 'I answer you now',
                'name': $in.name,
                'milliseconds': $in.milliseconds,
                'ok': 'true'
            });
        }, $in.milliseconds);

        $timer[$in.from_plugin.plugin][$in.name].when = _MicroTime() + $in.milliseconds / 1000.0;
        $timer[$in.from_plugin.plugin][$in.name].timer = $myTimer;
        $timer[$in.from_plugin.plugin][$in.name].done = 'false';
        $timer[$in.from_plugin.plugin][$in.name].done_now = 0.0;

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
        $timer[$in.from_plugin.plugin][$in.name].done = 'true';

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
        const $currentTime = $timer[$in.from_plugin.plugin][$in.name].when;

        let $response = 'lower';
        if ($newTime > $currentTime) {
            $response = 'higher';
        }

        return $response;
    };

}
//# sourceURL=infohub_timer.js
