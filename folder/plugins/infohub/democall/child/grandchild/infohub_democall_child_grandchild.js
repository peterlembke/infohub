/**
 Copyright (C) 2010- Peter Lembke, CharZam soft
 the program is distributed under the terms of the GNU General Public License

 InfoHub is free software: you can redistribute it and/or modify
 it under the terms of the GNU General Public License as published by
 the Free Software Foundation, either version 3 of the License, or
 (at your option) any later version.

 InfoHub is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 GNU General Public License for more details.

 You should have received a copy of the GNU General Public License
 along with InfoHub.  If not, see <https://www.gnu.org/licenses/>.'
 */
function infohub_democall_child_grandchild() {

    'use strict';

// include "infohub_base.js"

    const _Version = function() {
        return {
            'date': '2019-03-07',
            'version': '2.0.0',
            'checksum': '{{checksum}}',
            'class_name': 'infohub_democall_child_grandchild',
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
     * Grandchild function you can call from a parent, sibling
     * @version 2019-03-07
     * @since   2019-03-07
     * @author  Peter Lembke
     */
    $functions.push('grandchild_func');
    const grandchild_func = function($in) {
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
    const sibling_func = function($in) {
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

        let $messageArray = [];

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
                    'step': 'step_end',
                },
            });
        }

        if ($in.step === 'step_end') {
            const $text = 'infohub_democall_sibling_grandchild sent hello to infohub_checksum and got checksum:' +
                $in.response.checksum;
            const $messageOut = _SubCall({
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

            $messageArray.push($messageOut);
        }

        return {
            'answer': 'true',
            'message': 'done',
            'messages': $messageArray,
        };
    };

    /**
     * Calls the parent. This is not allowed and should fail
     * @version 2019-03-08
     * @since   2019-03-08
     * @author  Peter Lembke
     */
    $functions.push('call_parent');
    const call_parent = function($in) {
        const $default = {
            'step': 'step_call_parent',
            'response': {},
        };
        $in = _Default($default, $in);

        let $messageArray = [];

        if ($in.step === 'step_call_parent') {

            const $text = 'infohub_democall_child_grandchild will try to call the parent';

            const $messageOut = _SubCall({
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

            $messageArray.push($messageOut);

            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_democall_child',
                    'function': 'answer_child',
                },
                'data': {},
                'data_back': {
                    'step': 'step_alert',
                },
                'messages': $messageArray,
            });
        }

        if ($in.step === 'step_alert') {

            const $text = 'infohub_democall_child_grandchild got response from a call to a parent. This should be forbidden';

            const $messageOut = _SubCall({
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
            'messages': $messageArray,
        };
    };
}

//# sourceURL=infohub_democall_child_grandchild.js