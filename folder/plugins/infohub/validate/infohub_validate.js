/*	infohub_validate.js

		Copyright (C) 2018 Peter Lembke , Infohub.se
		the program is distributed under the terms of the GNU General Public License

		infohub_validate.js is free software: you can redistribute it and/or modify
		it under the terms of the GNU General Public License as published by
		the Free Software Foundation, either version 3 of the License, or
		(at your option) any later version.

		infohub_validate.js is distributed in the hope that it will be useful,
		but WITHOUT ANY WARRANTY; without even the implied warranty of
		MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
		GNU General Public License for more details.

		You should have received a copy of the GNU General Public License
		along with infohub_validate.js.	If not, see <https://www.gnu.org/licenses/>.
*/
function infohub_validate() {

// include "infohub_base.js"

    var _Version = function() {
        return {
            'date': '2018-08-13',
            'since': '2018-08-13',
            'version': '1.0.0',
            'checksum': '{{checksum}}',
            'class_name': 'infohub_validate',
            'note': 'Value validators. Used mostly in form validation.',
            'status': 'normal',
            'license_name': 'GNU GPL 3 or later'
        };
    };

    var _GetCmdFunctions = function() {
        return {
            'validate_has_data': 'normal',
            'validate_is_true': 'normal',
            'validate_is_false': 'normal',
            'validate_is_integer': 'normal'
        };
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
    var validate_has_data = function ($in)
    {
        "use strict";

        const $default = {
            'data': null
        };
        $in = _Default($default, $in);

        let $valid = 'true';

        if (_Empty($in.data) === 'true') {
            $valid = 'false';
        }

        return {
            'answer': 'true',
            'message': 'The data is now validated. Here is the answer',
            'valid': $valid
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
    var validate_is_true = function ($in)
    {
        "use strict";

        const $default = {
            'data': 'false'
        };
        $in = _Default($default, $in);

        let $valid = 'false';

        if ($in.data === 'true') {
            $valid = 'true';
        }

        return {
            'answer': 'true',
            'message': 'The data is now validated. Here is the answer',
            'valid': $valid
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
    var validate_is_false = function ($in)
    {
        "use strict";

        const $default = {
            'data': 'false'
        };
        $in = _Default($default, $in);

        let $valid = 'false';

        if ($in.data === 'false') {
            $valid = 'true';
        }

        return {
            'answer': 'true',
            'message': 'The data is now validated. Here is the answer',
            'valid': $valid
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
    var validate_is_integer = function ($in)
    {
        "use strict";

        const $default = {
            'data': null
        };
        $in = _Default($default, $in);

        let $valid = 'false';

        if ($in.data === parseInt($in.data).toString()) {
            $valid = 'true';
        }

        return {
            'answer': 'true',
            'message': 'The data is now validated. Here is the answer',
            'valid': $valid
        };
    };

}
//# sourceURL=infohub_validate.js