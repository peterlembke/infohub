/**
 * infohub_democall_sibling_grandchild
 * Example plugin for testing calling rules
 *
 * @package     Infohub
 * @subpackage  infohub_democall_sibling_grandchild
 * @since       
 * @author      Peter Lembke <info@infohub.se>
 * @license     GPL-3.0-or-later
 * @copyright   Copyright (C) 2010- Peter Lembke
 * @see         https://github.com/peterlembke/infohub/blob/main/folder/plugins/infohub/democall/sibling/grandchild/infohub_democall_sibling_grandchild.md Documentation
 * @link        https://infohub.se/ InfoHub main page
 */
function infohub_democall_sibling_grandchild() {

    'use strict';

// include "infohub_base.js"

    const _Version = function() {
        return {
            'date': '2019-03-07',
            'version': '2.0.0',
            'checksum': '{{checksum}}',
            'class_name': 'infohub_democall_sibling_grandchild',
            'note': 'Example plugin for testing calling rules',
            'status': 'normal',
            'SPDX-License-Identifier': 'GPL-3.0-or-later',
        };
    };

    const _GetCmdFunctions = function() {
        const $list = {
            'grandchild_func': 'normal',
            'call_level1': 'normal',
            'call_parent': 'normal',
        };

        return _GetCmdFunctionsBase($list);
    };

    /**
     * Grandchild function you can call from a parent or a sibling
     * an aunt can not send data to here. Forbidden.
     * @version 2019-03-07
     * @since   2019-03-07
     * @author  Peter Lembke
     */
    $functions.push('grandchild_func');
    const grandchild_func = function($in = {}) {
        const $default = {
            'alert': '',
            'step': 'step_start',
        };
        $in = _Default($default, $in);

        let $messageArray = [];

        if ($in.step === 'step_start') {
            const $messageOut = _SubCall({
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

            $messageArray.push($messageOut);
        }

        return {
            'answer': 'true',
            'message': 'Done',
            'messages': $messageArray,
        };
    };

    /**
     * Calls a level1 plugin. This is allowed
     * @version 2019-03-08
     * @since   2019-03-08
     * @author  Peter Lembke
     */
    $functions.push('call_level1');
    const sibling_func = function($in = {}) {
        const $default = {
            'step': 'step_call_level1',
            'response': {
                'answer': 'false',
                'message': '',
                'value': '',
                'checksum': '',
                'verified': 'false',
            },
        };
        $in = _Default($default, $in);

        if ($in.step === 'step_call_level1') {
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_checksum',
                    'function': 'calculate_checksum',
                },
                'data': {
                    'value': 'hello',
                },
                'data_back': {
                    'step': 'step_alert',
                },
            });
        }

        if ($in.step === 'step_alert') {
            const $text = 'infohub_democall_sibling_grandchild sent hello to infohub_checksum and got checksum:' +
                $in.response.checksum;

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
            'message': 'done',
        };
    };

    /**
     * Calls the parent. This is not allowed and should fail
     * @version 2019-03-08
     * @since   2019-03-08
     * @author  Peter Lembke
     */
    $functions.push('call_parent');
    const call_parent = function($in = {}) {
        const $default = {
            'step': 'step_start',
            'response': {},
        };
        $in = _Default($default, $in);

        if ($in.step === 'step_start') {
            const $text = 'infohub_democall_sibling_grandchild will try to call the parent';

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
                    'step': 'step_call_parent',
                },
            });
        }

        if ($in.step === 'step_call_parent') {
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_democall_sibling',
                    'function': 'answer_child',
                },
                'data': {},
                'data_back': {
                    'step': 'step_alert',
                },
            });
        }

        if ($in.step === 'step_alert') {
            const $text = 'infohub_democall_sibling_grandchild got response from a call to a parent. This should be forbidden';

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
            'message': 'done',
        };
    };
}

//# sourceURL=infohub_democall_sibling_grandchild.js