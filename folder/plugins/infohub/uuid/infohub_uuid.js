/**
 * infohub_uuid
 * Universally Unique IDentifier (UUID)
 *
 * @package     Infohub
 * @subpackage  infohub_uuid
 * @since       2018-05-19
 * @author      Peter Lembke <info@infohub.se>
 * @license     GPL-3.0-or-later
 * @copyright   Copyright (C) 2010- Peter Lembke
 * @see         https://github.com/peterlembke/infohub/blob/main/folder/plugins/infohub/uuid/infohub_uuid.md Documentation
 * @link        https://infohub.se/ InfoHub main page
 */
function infohub_uuid() {

    'use strict';

// include "infohub_base.js"

    const _Version = function() {
        return {
            'date': '2018-05-19',
            'since': '2018-05-19',
            'version': '1.0.0',
            'checksum': '{{checksum}}',
            'class_name': 'infohub_uuid',
            'note': 'Universally Unique IDentifier (UUID)',
            'webpage': 'https://en.wikipedia.org/wiki/Universally_unique_identifier',
            'status': 'normal',
            'SPDX-License-Identifier': 'GPL-3.0-or-later',
            'user_role': 'user',
            'web_worker': 'true',
            'core_plugin': 'false',
        };
    };

    const _GetCmdFunctions = function() {
        const $list = {
            'uuid': 'normal',
            'get_available_options': 'normal',
            'guidv0': 'normal',
            'guidv4': 'normal',
            'hub_id': 'normal',
        };

        return _GetCmdFunctionsBase($list);
    };

    /**
     * @version 2018-07-28
     * @since 2018-05-19
     * @author Your name
     */
    $functions.push('uuid');
    const uuid = function($in = {}) {
        const $default = {
            'version': '100',
            'count': 1,
        };
        $in = _Default($default, $in);

        let $answer = 'true';
        let $message = 'Here are the UUIDs you wanted';

        let $UuidIndex = {},
            $response = {},
            $data = '', $out = [];

        for (let $i = $in.count; $i > 0; $i = $i - 1) {
            switch ($in.version) {
                case '0':
                    return guidv0();
                case '4':
                    return guidv4b();
                case '100':
                    return hub_id();
                default:
            }

            if ($response.answer === 'true') {
                $data = $response.data;
                $UuidIndex[$data] = 1;
            } else {
                $answer = $response.answer;
                $message = $response.message;
                break;
            }

        }

        // Convert the indexed object to an array. Also copy the first uuid

        let $first = '';
        for (let $key in $UuidIndex) {
            if ($UuidIndex.hasOwnProperty($key) === true) {
                $out.push($key);
                if ($first === '') {
                    $first = $key;
                }
            }
        }

        return {
            'answer': $answer,
            'message': $message,
            'data': $first,
            'array': $out,
            'version': $in.version,
            'count': $in.count,
        };
    };

    /**
     * Get a list with all options
     * @version 2018-08-09
     * @since   2018-08-09
     * @author  Peter Lembke
     */
    $functions.push('get_available_options');
    const get_available_options = function($in = {}) {
        return {
            'answer': 'true',
            'message': 'All UUID versions',
            'options': [
                {'type': 'option', 'value': '0', 'label': 'Client UUID v0'},
                {'type': 'option', 'value': '4', 'label': 'Client UUID v4'},
                {
                    'type': 'option',
                    'value': '100',
                    'label': 'Client Hub Id',
                    'selected': 'true',
                },
            ],
        };
    };

    /**
     * Nil UUID
     * @version 2018-05-19
     * @since 2018-05-19
     */
    $functions.push('guidv0');
    const guidv0 = function($in = {}) {
        return {
            'answer': 'true',
            'message': 'Here are the guidv0',
            'data': '00000000-0000-0000-0000-000000000000',
        };
    };

    /**
     * @version 2018-05-19
     * @since 2018-05-19
     * @author https://www.w3resource.com/javascript-exercises/javascript-math-exercise-23.php
     */
    $functions.push('guidv4');
    const guidv4 = function($in = {}) {
        let $timeStamp = new Date().getTime();
        let $uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx';

        $uuid.replace(/[xy]/g, function(c) {
            let $random = ($timeStamp + Math.random() * 16) % 16 | 0;
            $timeStamp = Math.floor($timeStamp / 16);
            return (c == 'x' ? $random : ($random & 0x3 | 0x8)).toString(16);
        });

        return {
            'answer': 'true',
            'message': 'Here are the guidv4',
            'data': $uuid,
        };
    };

    /**
     * Fast UUID generator, RFC4122 version 4 compliant.
     * @author Jeff Ward (jcward.com).
     * @license MIT license
     * Modified 2018-07-28 by Peter Lembke to fit in Infohub
     **/
    $functions.push('guidv4b');
    const guidv4b = function($in = {}) {
        var $lut = [], $result, $d0, $d1, $d2, $d3;

        for (let $i = 0; $i < 256; $i = $i + 1) {
            $lut[$i] = ($i < 16 ? '0' : '') + ($i).toString(16);
        }

        $d0 = Math.random() * 0xffffffff | 0;
        $d1 = Math.random() * 0xffffffff | 0;
        $d2 = Math.random() * 0xffffffff | 0;
        $d3 = Math.random() * 0xffffffff | 0;

        $result = $lut[$d0 & 0xff] + $lut[$d0 >> 8 & 0xff] +
            $lut[$d0 >> 16 & 0xff] + $lut[$d0 >> 24 & 0xff] + '-' +
            $lut[$d1 & 0xff] + $lut[$d1 >> 8 & 0xff] + '-' +
            $lut[$d1 >> 16 & 0x0f | 0x40] + $lut[$d1 >> 24 & 0xff] + '-' +
            $lut[$d2 & 0x3f | 0x80] + $lut[$d2 >> 8 & 0xff] + '-' +
            $lut[$d2 >> 16 & 0xff] + $lut[$d2 >> 24 & 0xff] +
            $lut[$d3 & 0xff] + $lut[$d3 >> 8 & 0xff] + $lut[$d3 >> 16 & 0xff] +
            $lut[$d3 >> 24 & 0xff];

        return {
            'answer': 'true',
            'message': 'Here are the guidv4',
            'data': $result,
        };
    };

    /**
     * The default InfoHub universal ID method that produce a unique identifier string
     * Example: 1575709656.3529:4518025819754968159
     * First the time since EPOC with decimals.
     * Then a colon. Then a random number between 0 and the maximum number an integer can hold on this system.
     * Benefits are the simplicity. Also gives information when the id was created.
     *
     * @version 2018-07-28
     * @since 2018-07-28
     * @author Peter Lembke
     * @param array $in
     * @return string
     */
    $functions.push('hub_id');
    const hub_id = function($in = {}) {
        const $result = _MicroTime() + ':' +
            Math.random().toString().substring(2);
        // math.random produce a float between 0 and 1, example 0.4568548654
        // substring(2) remove the 0. and leave 4568548654

        return {
            'answer': 'true',
            'message': 'Here are the infohub_uid',
            'data': $result,
        };
    };
}

//# sourceURL=infohub_uuid.js