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
function infohub_democall_sibling() {

// include "infohub_base.js"

    // ***********************************************************
    // * jshint.com options to suppress some warnings
    // ***********************************************************

    /*jshint evil:true */
    /*jshint devel:true */
    /*jslint browser: true, evil: true, plusplus: true, todo: true */

    // ***********************************************************
    // * your private class variables below, only declare with var
    // ***********************************************************

    var _Version = function() {
        return {
            'date': '2019-03-07',
            'version': '2.0.0',
            'checksum': '{{checksum}}',
            'class_name': 'infohub_democall_sibling',
            'note': 'Example plugin for testing calling rules',
            'status': 'normal',
            'license_name': 'GNU GPL 3 or later'
        };
    };

    var _GetCmdFunctions = function() {
        return {
            'sibling_func': 'normal',
            'invalid_call_to_sibling_grandchild': 'normal',
            'answer_child': 'normal'
        };
    };

    /**
     * Child function you can call from a parent or a sibling
     * You can not call this function from a child or from any other level1 plugin
     * @version 2019-03-07
     * @since   2019-03-07
     * @author  Peter Lembke
     */
    $functions.push('sibling_func');
    var sibling_func = function ($in)
    {
        "use strict";
        var $default = {
            'alert': '',
        };
        $in = _Default($default, $in);

        alert($in.alert);

        return {
            'answer': 'true',
            'message': 'done'
        };
    };

    /**
     * Make an invalid call to a sibling child
     * @version 2019-03-08
     * @since   2019-03-08
     * @author  Peter Lembke
     */
    $functions.push('invalid_call_to_sibling_grandchild');
    var invalid_call_to_sibling_grandchild = function ($in)
    {
        "use strict";
        var $default = {
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
                    'plugin': 'infohub_democall_child_grandchild',
                    'function': 'grandchild_func'
                },
                'data': {
                    'alert': 'infohub_democall_sibling calling infohub_democall_child_grandchild'
                },
                'data_back': {
                    'step': 'step_end'
                }
            });
        }
        
        if ($in.step === 'step_end') {
            alert('infohub_democall_sibling is back from the call');
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
    var answer_child = function ($in)
    {
        "use strict";
        var $default = {};
        $in = _Default($default, $in);

        alert('Welcome to infohub_democall_sibling -> answer_child');

        return {
            'answer': 'true',
            'message': 'Done'
        };
    };


}
//# sourceURL=infohub_democall_sibling.js