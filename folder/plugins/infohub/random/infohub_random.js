/**
 * @category InfoHub
 * @package InfoHub Random
 * @copyright Copyright (c) 2017, Peter Lembke, CharZam soft (CharZam.com / InfoHub.se)
 * @since 2017-06-17
 * @author Peter Lembke <peter.lembke@infohub.se>
 * @link https://infohub.se/ InfoHub main page
 * @license InfoHub is distributed under the terms of the GNU General Public License
 * InfoHub is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * InfoHub is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 * You should have received a copy of the GNU General Public License
 * along with InfoHub.    If not, see <https://www.gnu.org/licenses/>.
 */
function infohub_random() {

    "use strict";

// include "infohub_base.js"

    const _Version = function() {
        return {
            'date': '2019-01-07',
            'since': '2018-07-29',
            'version': '1.0.2',
            'checksum': '{{checksum}}',
            'class_name': 'infohub_random',
            'note': 'Functions that give you an unpredictable answer',
            'status': 'normal',
            'license_name': 'GNU GPL 3 or later'
        };
    };

    const _GetCmdFunctions = function() {
        return {
            'random_number': 'normal',
            'random_numbers': 'normal'
        };
    };

    /**
     * Main checksum calculation
     * @version 2018-07-29
     * @since 2018-07-29
     * @author Peter Lembke
     * @param $in
     * @returns {*}
     */
    $functions.push("random_number");
    const random_number = function($in)
    {
        const $default = {
            'min': 0,
            'max': 0
        };
        $in = _Default($default, $in);

        return internal_Cmd({
            'func': 'RandomNumber',
            'min': $in.min,
            'max': $in.max
        });
    };

    /**
     * Main checksum calculation
     * @version 2018-07-29
     * @since 2018-07-29
     * @author Peter Lembke
     * @param $in
     * @returns {*}
     */
    $functions.push("internal_RandomNumber");
    const internal_RandomNumber = function($in)
    {
        const $default = {
            'min': 0,
            'max': 0
        };
        $in = _Default($default, $in);

        let $answer = 'true';
        let $message = 'Could not generate a random number';
        let $ok = 'false';
        let $result = 0;

        leave: {
            if ($in.min < 0 || $in.max < 0) {
                $message = 'negative values is not allowed';
                break leave;
            }

            if ($in.min > $in.max) {
                $message = 'min can not be larger than max';
                break leave;
            }

            if ($in.max > Number.MAX_SAFE_INTEGER || $in.min > Number.MAX_SAFE_INTEGER) {
                $message = 'max can not be larger than Number.MAX_SAFE_INTEGER, it is ' + Number.MAX_SAFE_INTEGER;
                break leave;
            }

            try {
                $result = $in.min + Math.random() * ($in.max - $in.min);
                $result = parseInt($result);
            } catch(err) {
                $answer = 'false';
                $message = err.message;
                break leave;
            }

            $answer = 'true';
            $message = 'Here are the random number';
            $ok = 'true';
        }

        return {
            'answer': $answer,
            'message': $message,
            'ok': $ok,
            'min': $in.min,
            'max': $in.max,
            'data': $result
        };
    };

    /**
     * Gives you a list with random numbers
     * @version 2018-07-29
     * @since 2018-07-29
     * @author Peter Lembke
     * @param array $in
     * @return array
     * @uses
     */
    $functions.push("random_numbers");
    const random_numbers = function($in)
    {
        const $default = {
            'min': 0,
            'max': 0,
            'count': 10
        };
        $in = _Default($default, $in);

        let $answer = 'true',
            $message = 'Could not generate your random numbers',
            $result = [],
            $ok = 'false';

        leave: {

            for (let $randomCountNumber = $in.count; $randomCountNumber > 0; $randomCountNumber = $randomCountNumber - 1)
            {
                let $response = internal_Cmd({
                    'func': 'RandomNumber',
                    'min': $in.min,
                    'max': $in.max
                });

                if ($response.answer === 'false' || $response.ok === 'false') {
                    $message = $response.message;
                    break leave;
                }

                $result.push($response.data);
            }

            $answer = 'true';
            $message = 'Here are your random numbers';
            $ok = 'true';
        }

        return {
            'answer': $answer,
            'message': $message,
            'ok': $ok,
            'min': $in.min,
            'max': $in.max,
            'data': $result
        };
    };
}
//# sourceURL=infohub_random.js
