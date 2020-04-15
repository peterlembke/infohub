/*
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
function infohub_democall_child() {

    "use strict";

// include "infohub_base.js"

    const _Version = function() {
        return {
            'date': '2019-03-07',
            'version': '2.0.0',
            'checksum': '{{checksum}}',
            'class_name': 'infohub_democall_child',
            'note': 'Example plugin for testing calling rules',
            'status': 'normal',
            'SPDX-License-Identifier': 'GPL-3.0-or-later'
        };
    };

    const _GetCmdFunctions = function() {
        return {
            'child_func': 'normal',
            'invalid_call_to_sibling_grandchild': 'normal',
            'test_answer_child': 'normal',
            'answer_child': 'normal'
        };
    };

    /**
     * Child function you can call from a parent, sibling
     * @version 2019-03-07
     * @since   2019-03-07
     * @author  Peter Lembke
     */
    $functions.push('child_func');
    const child_func = function ($in)
    {
        const $default = {
            'step': 'step_start',
            'response': {
                'answer': 'false',
                'message': '',
                'value': '',
                'checksum': '',
                'verified': 'false'
            }
        };
        $in = _Default($default, $in);

        if ($in.step === 'step_start') {
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_democall_sibling',
                    'function': 'sibling_func'
                },
                'data': {
                    'alert': 'infohub_democall_child calling infohub_democall_sibling'
                },
                'data_back': {
                    'step': 'step_call_grandchild'
                }
            });
        }
        
        if ($in.step === 'step_call_grandchild') {
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_democall_child_grandchild',
                    'function': 'grandchild_func'
                },
                'data': {
                    'alert': 'infohub_democall_child calling infohub_democall_child_grandchild'
                },
                'data_back': {
                    'step': 'step_call_level1'
                }
            });
        }

        if ($in.step === 'step_call_level1') {
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_checksum',
                    'function': 'calculate_checksum'
                },
                'data': {
                    'value': 'hello'
                },
                'data_back': {
                    'step': 'step_end'
                }
            });
        }

        if ($in.step === 'step_end') {
            alert('infohub_democall_child sent hello to infohub_checksum and got checksum:' + $in.response.checksum);
        }

        return {
            'answer': 'true',
            'message': 'Done'
        };
    };
    
    /**
     * Make an invalid call to a sibling child
     * @version 2019-03-08
     * @since   2019-03-08
     * @author  Peter Lembke
     */
    $functions.push('invalid_call_to_sibling_grandchild');
    const invalid_call_to_sibling_grandchild = function ($in)
    {
        const $default = {
            'step': 'step_start',
            'response': {
                'answer': 'false',
                'message': '',
                'value': '',
                'checksum': '',
                'verified': 'false'
            }
        };
        $in = _Default($default, $in);

        if ($in.step === 'step_start') {
            alert('infohub_democall_child will try to call a sibling_grandchild');
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_democall_sibling_grandchild',
                    'function': 'grandchild_func'
                },
                'data': {
                    'alert': 'infohub_democall_child calling infohub_democall_sibling_grandchild'
                },
                'data_back': {
                    'step': 'step_end'
                }
            });
        }
        
        if ($in.step === 'step_end') {
            alert('infohub_democall_child is back from the call');
        }

        return {
            'answer': $in.response.answer,
            'message': $in.response.message
        };
    };

    /**
     * Call a child plugin that will call its parent -> answer_child
     * @version 2019-03-08
     * @since   2019-03-08
     * @author  Peter Lembke
     */
    $functions.push('test_answer_child');
    const test_answer_child = function ($in)
    {
        const $default = {
            'step': 'step_call_grandchild'
        };
        $in = _Default($default, $in);

        if ($in.step === 'step_call_grandchild') {
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_democall_child_grandchild',
                    'function': 'call_parent'
                },
                'data': {
                    'alert': 'infohub_democall_child calling infohub_democall_child_grandchild'
                },
                'data_back': {
                    'step': 'step_end'
                }
            });
        }

        return {
            'answer': 'true',
            'message': 'Done'
        };
    };


    /**
     * A child plugin will call this function
     * @version 2019-03-08
     * @since   2019-03-08
     * @author  Peter Lembke
     */
    $functions.push('answer_child');
    const answer_child = function ($in)
    {
        const $default = {};
        $in = _Default($default, $in);

        alert('Welcome to infohub_democall_child -> answer_child');

        return {
            'answer': 'true',
            'message': 'Done'
        };
    };
}
//# sourceURL=infohub_democall_child.js