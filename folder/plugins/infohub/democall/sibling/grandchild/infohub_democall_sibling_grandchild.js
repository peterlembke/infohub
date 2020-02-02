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
function infohub_democall_sibling_grandchild() {

// include "infohub_base.js"

    /*jshint evil:true */
    /*jshint devel:true */
    /*jslint browser: true, evil: true, plusplus: true, todo: true */

    const _Version = function() {
        return {
            'date': '2019-03-07',
            'version': '2.0.0',
            'checksum': '{{checksum}}',
            'class_name': 'infohub_democall_sibling_grandchild',
            'note': 'Example plugin for testing calling rules',
            'status': 'normal',
            'license_name': 'GNU GPL 3 or later'
        };
    };

    const _GetCmdFunctions = function() {
        return {
            'grandchild_func': 'normal',
            'call_level1': 'normal',
            'call_parent': 'normal'
        };
    };

    /**
     * Grandchild function you can call from a parent or a sibling
     * an aunt can not send data to here. Forbidden.
     * @version 2019-03-07
     * @since   2019-03-07
     * @author  Peter Lembke
     */
    $functions.push('grandchild_func');
    const grandchild_func = function ($in)
    {
        "use strict";

        const $default = {
            'alert': ''
        };
        $in = _Default($default, $in);

        alert($in.alert);

        return {
            'answer': 'true',
            'message': 'Done'
        };
    };

    /**
     * Calls a level1 plugin. This is allowed
     * @version 2019-03-08
     * @since   2019-03-08
     * @author  Peter Lembke
     */
    $functions.push('call_level1');
    const sibling_func = function ($in)
    {
        "use strict";

        const $default = {
            'step': 'step_call_level1',
            'response': {
                'answer': 'false',
                'message': '',
                'value': '',
                'checksum': '',
                'verified': 'false'
            }
        };
        $in = _Default($default, $in);

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
            alert('infohub_democall_sibling_grandchild sent hello to infohub_checksum and got checksum:' + $in.response.checksum);
        }

        return {
            'answer': 'true',
            'message': 'done'
        };
    };

    /**
     * Calls the parent. This is not allowed and should fail
     * @version 2019-03-08
     * @since   2019-03-08
     * @author  Peter Lembke
     */
    $functions.push('call_parent');
    const call_parent = function ($in)
    {
        "use strict";

        const $default = {
            'step': 'step_call_parent',
            'response': {}
        };
        $in = _Default($default, $in);

        if ($in.step === 'step_call_parent') {
            alert('infohub_democall_sibling_grandchild will try to call the parent');
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_democall_sibling',
                    'function': 'answer_child'
                },
                'data': {},
                'data_back': {
                    'step': 'step_end'
                }
            });
        }

        if ($in.step === 'step_end') {
            alert('infohub_democall_sibling_grandchild got response from a call to a parent. This should be forbidden');
        }

        return {
            'answer': 'true',
            'message': 'done'
        };
    };
}
//# sourceURL=infohub_democall_sibling_grandchild.js