/**
 * infohub_democall_sibling
 * Example plugin for testing calling rules
 *
 * @package     Infohub
 * @subpackage  infohub_democall_sibling
 * @since       
 * @author      Peter Lembke <info@infohub.se>
 * @license     GPL-3.0-or-later
 * @copyright   Copyright (C) 2010- Peter Lembke
 * @see         https://github.com/peterlembke/infohub/blob/main/folder/plugins/infohub/democall/sibling/infohub_democall_sibling.md Documentation
 * @link        https://infohub.se/ InfoHub main page
 */
function infohub_democall_sibling() {

    'use strict';

// include "infohub_base.js"

    const _Version = function() {
        return {
            'date': '2019-03-07',
            'version': '2.0.0',
            'checksum': '{{checksum}}',
            'class_name': 'infohub_democall_sibling',
            'note': 'Example plugin for testing calling rules',
            'status': 'normal',
            'SPDX-License-Identifier': 'GPL-3.0-or-later',
        };
    };

    const _GetCmdFunctions = function() {
        const $list = {
            'sibling_func': 'normal',
            'invalid_call_to_sibling_grandchild': 'normal',
            'answer_child': 'normal',
        };

        return _GetCmdFunctionsBase($list);
    };

    /**
     * Child function you can call from a parent or a sibling
     * You can not call this function from a child or from any other level1 plugin
     * @version 2019-03-07
     * @since   2019-03-07
     * @author  Peter Lembke
     */
    $functions.push('sibling_func');
    const sibling_func = function($in = {}) {
        const $default = {
            'alert': '',
            'step': 'step_start',
        };
        $in = _Default($default, $in);

        if ($in.step === 'step_start') {
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_view',
                    'function': 'alert',
                },
                'data': {
                    'text': $in.alert,
                },
                'data_back': {
                    'step': 'step_end',
                },
            });
        }

        return {
            'answer': 'true',
            'message': 'done',
        };
    };

    /**
     * Make an invalid call to a sibling child
     * @version 2019-03-08
     * @since   2019-03-08
     * @author  Peter Lembke
     */
    $functions.push('invalid_call_to_sibling_grandchild');
    const invalid_call_to_sibling_grandchild = function($in = {}) {
        const $default = {
            'step': 'step_start',
            'response': {
                'answer': 'false',
                'message': '',
                'value': '',
                'checksum': '',
                'verified': 'false',
            },
        };
        $in = _Default($default, $in);

        if ($in.step === 'step_start') {
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_democall_child_grandchild',
                    'function': 'grandchild_func',
                },
                'data': {
                    'alert': 'infohub_democall_sibling calling infohub_democall_child_grandchild',
                },
                'data_back': {
                    'step': 'step_alert',
                },
            });
        }

        if ($in.step === 'step_alert') {
            const $text = 'infohub_democall_sibling is back from the call';
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_view',
                    'function': 'alert',
                },
                'data': {
                    'text': $text,
                },
                'data_back': {
                    'step': 'step_end',
                },
            });
        }

        return {
            'answer': 'true',
            'message': 'Done',
        };
    };

    /**
     * A child plugin will call this function
     * @version 2019-03-08
     * @since   2019-03-08
     * @author  Peter Lembke
     */
    $functions.push('answer_child');
    const answer_child = function($in = {}) {
        const $default = {
            'step': 'step_start',
        };
        $in = _Default($default, $in);

        if ($in.step === 'step_start') {
            const $text = 'Welcome to infohub_democall_sibling -> answer_child';
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_view',
                    'function': 'alert',
                },
                'data': {
                    'text': $text,
                },
                'data_back': {
                    'step': 'step_end',
                },
            });
        }

        return {
            'answer': 'true',
            'message': 'Done',
        };
    };
}

//# sourceURL=infohub_democall_sibling.js