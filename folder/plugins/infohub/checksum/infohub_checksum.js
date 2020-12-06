/**
 * Checksums are calculated and verified here
 *
 * Support a lot of different checksums
 *
 * @author      Peter Lembke <info@infohub.se>
 * @version     2017-02-25
 * @since       2017-02-25
 * @copyright   Copyright (c) 2017, Peter Lembke
 * @license     https://opensource.org/licenses/gpl-license.php GPL-3.0-or-later
 * @see         https://github.com/peterlembke/infohub/blob/master/folder/plugins/infohub/checksum/infohub_checksum.md Documentation
 * @link        https://infohub.se/ InfoHub main page
 */
function infohub_checksum() {

    "use strict";

// include "infohub_base.js"

    const _Version = function() {
        return {
            'date': '2017-02-25',
            'since': '2017-02-25',
            'version': '1.0.0',
            'checksum': '{{checksum}}',
            'class_name': 'infohub_checksum',
            'note': 'Here you can get checksums in many different formats',
            'status': 'normal',
            'SPDX-License-Identifier': 'GPL-3.0-or-later',
            'user_role': 'user',
            'web_worker': 'true',
            'core_plugin': 'true'
        };
    };

    const _GetCmdFunctions = function() {
        const $list = {
            'calculate_checksum': 'normal',
            'verify_checksum': 'normal',
            'get_available_options': 'normal'
        };

        return _GetCmdFunctionsBase($list);
    };

    // ***********************************************************
    // * your class functions below, only use protected functions
    // ***********************************************************

    /**
     * Main checksum calculation
     * @version 2017-02-25
     * @since   2017-02-25
     * @author  Peter Lembke
     * @param $in
     * @returns {*}
     */
    $functions.push("calculate_checksum");
    const calculate_checksum = function($in)
    {
        const $default = {
            'type': 'md5',
            'value': '',
            'checksum': '',
            'step': 'start_step',
            'answer': 'false',
            'message': 'Could not get a checksum',
            'verified': 'false'
        };
        $in = _Default($default, $in);

        if ($in.step === 'start_step') {

            const $functionName = 'Calculate' + _UcWords($in.type);
            if (_MethodExists('internal_' + $functionName) === 'true') {
                return internal_Cmd({
                    'func': $functionName,
                    'value': $in.value
                });
            }

            const $pluginName = 'infohub_checksum_' + $in.type;
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': $pluginName,
                    'function': 'calculate_checksum'
                },
                'data': {
                    'value': $in.value,
                    'checksum': $in.checksum
                },
                'data_back': {
                    'step': 'response'
                }
            });

        }

        return {
            'answer': $in.answer,
            'message': $in.message,
            'value': $in.value,
            'checksum': $in.checksum,
            'verified': 'false'
        };
    };

    /**
     * Main checksum calculation
     * @version 2017-02-25
     * @since   2017-02-25
     * @author  Peter Lembke
     * @param $in
     * @returns {*}
     */
    $functions.push("verify_checksum");
    const verify_checksum = function($in)
    {
        const $default = {
            'type': 'md5',
            'value': '',
            'checksum': '',
            'step': 'start_step',
            'answer': 'false',
            'message': 'Could not get a checksum',
            'verified': 'false'
        };
        $in = _Default($default, $in);

        if ($in.step === 'start_step') {

            const $functionName = 'Verify' + _UcWords($in.type);
            if (_MethodExists('internal_' + $functionName) === 'true') {
                return internal_Cmd({
                    'func': $functionName,
                    'value': $in.value,
                    'checksum': $in.checksum
                });
            }

            const $pluginName = 'infohub_checksum_' + $in.type;
            return _SubCall({
                'to': {'node': 'client', 'plugin': $pluginName, 'function': 'verify_checksum'},
                'data': {'value': $in.value, 'checksum': $in.checksum },
                'data_back': {'step': 'response'}
            });

        }

        return {
            'answer': $in.answer,
            'message': $in.message,
            'value': $in.value,
            'checksum': $in.checksum,
            'verified': $in.verified
        };
    };

    // *****************************************************************************
    // * Internal function that you only can reach from internal_Cmd
    // * Function name are in internal_CamelCase
    // * An internal function get all its data from the $in object
    // * An internal function give its answer as an object
    // *****************************************************************************

    /**
     * Get list with checksum methods you can use
     * @version 2018-08-10
     * @since   2018-08-10
     * @author  Peter Lembke
     * @param array $in
     * @return array|bool
     */
    $functions.push('get_available_options');
    const get_available_options = function ($in)
    {
        const $options = [
            {"type": "option", "value": 'crc32', "label": 'CRC32' },
            {"type": "option", "value": 'luhn', "label": 'Luhn' },
            {"type": "option", "value": 'md5', "label": 'MD5', 'selected': 'true'  },
            {"type": "option", "value": 'personnummer', "label": 'Personnummer' },
            {"type": "option", "value": 'doublemetaphone', "label": 'Double metaphone' }
        ];

        return {
            'answer': 'true',
            'message': 'List of valid checksum methods.',
            'options': $options
        };
    };

}
//# sourceURL=infohub_checksum.js
