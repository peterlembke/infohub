/**
 * infohub_random
 * Functions that give you an unpredictable answer
 *
 * @package     Infohub
 * @subpackage  infohub_random
 * @since       2018-07-29
 * @author      Peter Lembke <info@infohub.se>
 * @license     GPL-3.0-or-later
 * @copyright   Copyright (C) 2010- Peter Lembke
 */
function infohub_random() {

    'use strict';

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
            'SPDX-License-Identifier': 'GPL-3.0-or-later',
            'user_role': 'user',
            'web_worker': 'true',
            'core_plugin': 'false',
        };
    };

    const _GetCmdFunctions = function() {
        const $list = {
            'random_number': 'normal',
            'random_numbers': 'normal',
            'random_byte_string': 'normal',
        };

        return _GetCmdFunctionsBase($list);
    };

    /**
     * Main checksum calculation
     * @version 2018-07-29
     * @since 2018-07-29
     * @author Peter Lembke
     * @param $in
     * @returns {*}
     */
    $functions.push('random_number');
    const random_number = function($in = {}) {
        const $default = {
            'min': 0,
            'max': 0,
        };
        $in = _Default($default, $in);

        return internal_Cmd({
            'func': 'RandomNumber',
            'min': $in.min,
            'max': $in.max,
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
    $functions.push('internal_RandomNumber');
    const internal_RandomNumber = function($in = {}) {
        const $default = {
            'min': 0,
            'max': 0,
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

            if ($in.max > Number.MAX_SAFE_INTEGER || $in.min >
                Number.MAX_SAFE_INTEGER) {
                $message = 'max can not be larger than Number.MAX_SAFE_INTEGER, it is ' +
                    Number.MAX_SAFE_INTEGER;
                break leave;
            }

            try {
                $result = $in.min + Math.random() * ($in.max - $in.min);
                $result = parseInt($result);
            } catch (err) {
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
            'data': $result,
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
    $functions.push('random_numbers');
    const random_numbers = function($in = {}) {
        const $default = {
            'min': 0,
            'max': 0,
            'count': 10,
        };
        $in = _Default($default, $in);

        let $answer = 'true',
            $message = 'Could not generate your random numbers',
            $result = [],
            $ok = 'false';

        leave: {

            for (let $randomCountNumber = $in.count;
                $randomCountNumber > 0;
                $randomCountNumber = $randomCountNumber - 1
            ) {
                let $response = internal_Cmd({
                    'func': 'RandomNumber',
                    'min': $in.min,
                    'max': $in.max,
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
            'data': $result,
        };
    };

    /**
     * Gives you a base64 encoded string made of random bytes
     * @version 2021-04-03
     * @since 2021-04-03
     * @author Peter Lembke
     * @param array $in
     * @return array
     * @uses
     */
    $functions.push('random_byte_string');
    const random_byte_string = function($in = {}) {
        const $default = {
            'count': 10,
        };
        $in = _Default($default, $in);

        let $answer = 'true',
            $message = 'Could not generate your byte string',
            $result = '',
            $resultBase64 = '';

        leave: {

            for (let $randomCountNumber = $in.count;
                $randomCountNumber > 0;
                $randomCountNumber = $randomCountNumber - 1
            ) {
                let $response = internal_Cmd({
                    'func': 'RandomNumber',
                    'min': 0,
                    'max': 255,
                });

                if ($response.answer === 'false' || $response.ok === 'false') {
                    $message = $response.message;
                    break leave;
                }

                $result = $result + String.fromCharCode($response.data);
            }

            $resultBase64 = btoa($result);

            $answer = 'true';
            $message = 'Here are your random byte string in base64 encoded format';
        }

        return {
            'answer': $answer,
            'message': $message,
            'data': $resultBase64,
        };
    };

}

//# sourceURL=infohub_random.js
