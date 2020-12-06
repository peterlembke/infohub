/**	infohub_template.js
Copyright (C) 2015 __your name__ , __your organisation__
the program is distributed under the terms of the GNU General Public License

__your program name__ is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

__your program name__ is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with __your program name__.	If not, see <https://www.gnu.org/licenses/>.
*/
function infohub_template() {

    "use strict";

// include "infohub_base.js"

    const _Version = function() {
        return {
            'date': '2015-02-12',
            'version': '1.0.0',
            'checksum': '{{checksum}}',
            'class_name': 'infohub_template',
            'note': 'One line with plugin description',
            'status': 'emerging',
            'SPDX-License-Identifier': 'GPL-3.0-or-later',
            'user_role': 'developer',
            'web_worker': 'true',
            'core_plugin': 'false'
        };
    };

    const _GetCmdFunctions = function()
    {
        const $list = {
            'my_function': 'normal'
        };

        return _GetCmdFunctionsBase($list);
    };

    // ***********************************************************
    // * The private functions,
    // * These functions can be used directly in your functions.
    // * Name: _CamelCaseData
    // ***********************************************************

    $functions.push("_GetText");
    const _GetText = function ($in)
    {
        return 'Text from _GetText';
    };

	/**
	 * One row description of this function.
	 * Second row (optional), more detailed description.
	 * @version 2012-01-01
	 * @since 2012-01-01
	 * @author Your name
	 */
	$functions.push("startup");
	const startup = function ($in)
    {
        const $default = {
            'step': 'start',
            'data': 'default data'
        };
        $in = _Default($default,$in);

		// Start your code here
        if ($in.step === 'start') {
            internal_Log({'level': 'info', 'message': 'This demo show how you can call functions that are private, internal, public.', 'function_name': 'startup' });
            internal_Log({'level': 'info', 'message': 'Make sure you have enabled logging in file folder/config/global_config.json', 'function_name': 'startup' });
            internal_Log({'level': 'info', 'message': 'Right click this page and check the console', 'function_name': 'startup' });
            // We start by making a sub call to a cmd function. This one happens to be in this plugin.
            // We can do contact any node (client/server), any plugin, any public function like this:

            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_template',
                    'function': 'my_function'
                },
                'data': {
                    'data': 'Text from startup to my_function'
                },
                'data_back': {
                    'step': 'step_end'
                }
            });
        }

        if ($in.step === 'end') {
            // We have returned from the sub call and have the data
            const $from_my_function = $in.data;

            // Now we call a private function
            const $fromGetText = _GetText();

            // Now we call an internal function
            let $fromMyFunction = '';
            const $response = internal_Cmd({'func': 'MyFunction'});
            if ($response.answer === 'true') {
                $fromMyFunction = $response.data;
            }

            // Display the answer in the console
            internal_Log({'level': 'info', 'message': $fromGetText, 'function_name': 'startup' });
            internal_Log({'level': 'info', 'message': $fromMyFunction, 'function_name': 'startup' });
            internal_Log({'level': 'info', 'message': $from_my_function, 'function_name': 'startup' });
        }

        return {
            'answer': 'true',
            'message': 'Have run startup step=' + $in.step
        };
	};

	/**
	 * One row description of this function.
	 * Second row (optional), more detailed description.
	 * @version 2012-01-01
	 * @since 2012-01-01
	 * @author Your name
	 */
	$functions.push("my_function");
	const my_function = function($in)
    {
        const $default = {
            'step': 'start',
            'data': ' Default text from my_function '
        };
        $in = _Default($default,$in);

        // Start your code here
        $in.data = 'Text from my_function';

        return {
            'answer': 'true' ,
            'data': $in.data,
            'message': 'Have run my_function'
        };
	};

    // *****************************************************************************
    // * Internal function that you only can reach from internal_Cmd
    // * Function name are in internal_CamelCase
    // * An internal function get all its data from the $in object
    // * An internal function give its answer as an object
    // *****************************************************************************

	/**
	 * One row description of this function.
	 * Second row (optional), more detailed description.
	 * @version 2012-01-01
	 * @since 2012-01-01
	 * @author Your name
	 */
	const internal_MyFunction = function($in)
    {
        const $default = {
            'step': 'start',
            'data': ' Default text from MyFunction '
        };
        $in = _Default($default,$in);

        // Start your code here
        $in.data = 'Text from MyFunction';

		return {
		    'answer': 'true' ,
            'data': $in.data,
            'message': 'Have run MyFunction'
		};
	};
}
//# sourceURL=infohub_template.js