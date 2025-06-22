/**
 * infohub_encrypt_none
 * This method does nothing with the data. Useful if you want to introduce encryption but see the result
 *
 * @package     Infohub
 * @subpackage  infohub_encrypt_none
 * @since       2019-11-19
 * @author      Peter Lembke <info@infohub.se>
 * @license     GPL-3.0-or-later
 * @copyright   Copyright (C) 2010- Peter Lembke
 * @see         https://github.com/peterlembke/infohub/blob/main/folder/plugins/infohub/encrypt/none/infohub_encrypt_none.md Documentation
 * @link        https://infohub.se/ InfoHub main page
 */
function infohub_encrypt_none() {

    'use strict';

// include "infohub_base.js"

    $functions.push('_Version');
    const _Version = function() {
        return {
            'date': '2019-11-19',
            'since': '2019-11-19',
            'version': '1.0.0',
            'checksum': '{{checksum}}',
            'class_name': 'infohub_encrypt_none',
            'note': 'This method does nothing with the data. Useful if you want to introduce encryption but see the result',
            'status': 'normal',
            'SPDX-License-Identifier': 'GPL-3.0-or-later',
        };
    };

    $functions.push('_GetCmdFunctions');
    const _GetCmdFunctions = function() {
        const $list = {
            'encrypt': 'normal',
            'decrypt': 'normal',
        };

        return _GetCmdFunctionsBase($list);
    };

    // *****************************************************************************
    // * Functions you only can reach with CMD()
    // * Observe! function names are lower_case
    // *****************************************************************************

    /**
     * This encryption does nothing with the text.
     * Used for getting encryption into your flow
     * @version 2019-11-19
     * @since 2019-11-19
     * @author Peter Lembke
     * @param array $in
     * @return array
     */
    $functions.push('encrypt');
    const encrypt = function($in = {}) {
        const $default = {
            'text': '',
            'password': '',
        };
        $in = _Default($default, $in);

        let $answer = 'false',
            $message = 'Nothing to report';

        leave: {

            if (_Empty($in.text) === 'true') {
                $message = 'Text is empty';
                break leave;
            }

            if (_Empty($in.password) === 'true') {
                $message = 'Password is empty';
                break leave;
            }

            $answer = 'true';
            $message = 'Here are the data';
        }

        return {
            'answer': $answer,
            'message': $message,
            'data': $in.text,
        };
    };

    /**
     * This decryption does nothing with the text.
     * Used for getting decryption into your flow
     * @version 2019-11-19
     * @since 2019-11-19
     * @author Peter Lembke
     * @param array $in
     * @return array
     */
    $functions.push('decrypt');
    const decrypt = function($in = {}) {
        const $default = {
            'encrypted_text': '',
            'password': '',
        };
        $in = _Default($default, $in);

        let $answer = 'false';
        let $message = 'Nothing to report';

        leave: {

            if (_Empty($in.encrypted_text) === 'true') {
                $message = 'The encrypted text is empty';
                break leave;
            }

            if (_Empty($in.password) === 'true') {
                $message = 'The password is empty';
                break leave;
            }

            $answer = 'true';
            $message = 'Here are the text';
        }

        return {
            'answer': $answer,
            'message': $message,
            'data': $in.encrypted_text,
        };
    };

}

//# sourceURL=infohub_encrypt_none.js
