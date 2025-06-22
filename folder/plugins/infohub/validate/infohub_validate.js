/**
 * infohub_validate
 * Value validators. Used mostly in form validation.
 *
 * @package     Infohub
 * @subpackage  infohub_validate
 * @since       2018-08-13
 * @author      Peter Lembke <info@infohub.se>
 * @license     GPL-3.0-or-later
 * @copyright   Copyright (C) 2010- Peter Lembke
 * @see         https://github.com/peterlembke/infohub/blob/main/folder/plugins/infohub/validate/infohub_validate.md Documentation
 * @link        https://infohub.se/ InfoHub main page
 */
function infohub_validate() {

    'use strict';

// include "infohub_base.js"

    const _Version = function() {
        return {
            'date': '2018-08-13',
            'since': '2018-08-13',
            'version': '1.0.0',
            'checksum': '{{checksum}}',
            'class_name': 'infohub_validate',
            'note': 'Value validators. Used mostly in form validation.',
            'status': 'normal',
            'SPDX-License-Identifier': 'GPL-3.0-or-later',
            'user_role': 'user',
            'web_worker': 'true',
            'core_plugin': 'false',
        };
    };

    const _GetCmdFunctions = function() {
        const $list = {
            'validate_has_data': 'normal',
            'validate_is_true': 'normal',
            'validate_is_false': 'normal',
            'validate_is_integer': 'normal',
        };

        return _GetCmdFunctionsBase($list);
    };

    /**
     * Check if data has content
     * This is a validator. A very simple one but still a validator.
     * It can be used in form elements to validate the data.
     * @version 2018-06-24
     * @since   2018-06-24
     * @author  Peter Lembke
     */
    $functions.push('validate_has_data');
    const validate_has_data = function($in = {}) {
        const $default = {
            'data': null,
        };
        $in = _Default($default, $in);

        let $valid = 'true';

        if (_Empty($in.data) === 'true') {
            $valid = 'false';
        }

        return {
            'answer': 'true',
            'message': 'The data is now validated. Here is the answer',
            'valid': $valid,
        };
    };

    /**
     * Check if data is 'true'
     * This is a validator. A very simple one but still a validator.
     * It can be used in form elements to validate the data from checkboxes.
     * @version 2018-06-24
     * @since   2018-06-24
     * @author  Peter Lembke
     */
    $functions.push('validate_is_true');
    const validate_is_true = function($in = {}) {
        const $default = {
            'data': 'false',
        };
        $in = _Default($default, $in);

        let $valid = 'false';

        if ($in.data === 'true') {
            $valid = 'true';
        }

        return {
            'answer': 'true',
            'message': 'The data is now validated. Here is the answer',
            'valid': $valid,
        };
    };

    /**
     * Check if data is 'false'
     * This is a validator. A very simple one but still a validator.
     * It can be used in form elements to validate the data from checkboxes.
     * @version 2018-06-24
     * @since   2018-06-24
     * @author  Peter Lembke
     */
    $functions.push('validate_is_false');
    const validate_is_false = function($in = {}) {
        const $default = {
            'data': 'false',
        };
        $in = _Default($default, $in);

        let $valid = 'false';

        if ($in.data === 'false') {
            $valid = 'true';
        }

        return {
            'answer': 'true',
            'message': 'The data is now validated. Here is the answer',
            'valid': $valid,
        };
    };

    /**
     * Check if data is an integer
     * This is a validator. A very simple one but still a validator.
     * It can be used in form elements to validate the data from checkboxes.
     * @version 2018-08-11
     * @since   2018-08-11
     * @author  Peter Lembke
     */
    $functions.push('validate_is_integer');
    const validate_is_integer = function($in = {}) {
        const $default = {
            'data': null,
        };
        $in = _Default($default, $in);

        let $valid = 'false';

        if ($in.data === parseInt($in.data).toString()) {
            $valid = 'true';
        }

        return {
            'answer': 'true',
            'message': 'The data is now validated. Here is the answer',
            'valid': $valid,
        };
    };
}

//# sourceURL=infohub_validate.js