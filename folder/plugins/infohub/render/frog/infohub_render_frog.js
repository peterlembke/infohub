/**
 * infohub_render_frog.js render a frog when you have some error in your definitions, to make you notice the error.
 * @category InfoHub
 * @package render_frog
 * @copyright Copyright (c) 2010-, Peter Lembke, CharZam soft
 * @author Peter Lembke <peter.lembke@infohub.se>
 * @link https://infohub.se/ InfoHub main page
 * @license InfoHub is distributed under the terms of the GNU General Public License
 * InfoHub is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * InfoHub is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 * You should have received a copy of the GNU General Public License
 * along with InfoHub.    If not, see <https://www.gnu.org/licenses/>.
 */
function infohub_render_frog() {

    "use strict";

    // include "infohub_base.js"

    const _Version = function () {
        return {
            'date': '2016-10-08',
            'since': '2016-10-08',
            'version': '1.0.0',
            'checksum': '{{checksum}}',
            'class_name': 'infohub_render_frog',
            'note': 'Render HTML for a frog. If you give bad instructions to the renderer then you get a frog.',
            'status': 'normal',
            'license_name': 'GNU GPL 3 or later'
        };
    };

    const _GetCmdFunctions = function () {
        return {
            'create': 'normal'
        };
    };

    // ***********************************************************
    // * The private functions, add your own in your plugin
    // * These functions can be used directly in your functions.
    // * Name: _CamelCaseData
    // ***********************************************************

    /**
     * Get the html parameters: id, name, class
     * @version 2017-02-24
     * @since 2017-02-22
     * @param $in
     * @returns {string}
     * @private
     */
    const _GetId = function ($in)
    {
        let $parameter = [];

        const $default = {
            'id': '',
            'name': '',
            'class': ''
        };
        $in = _Default($default, $in);

        if ($in.id !== '') {
            const $id = 'id="{box_id}_' + $in.id + '"';
            $parameter.push($id);
        }

        if ($in.name !== '') {
            const $name = 'name="' + $in.name + '"';
            $parameter.push($name);
        }

        if ($in.class !== '') {
            let $class = $in.class;
            if ($class.charAt(0) == parseInt($class.charAt(0))) {
                $class = 'a' + $class;
            }
            $class = 'class="' + $class + '" ';
            $parameter.push($class);
        }

        return $parameter.join(' ');
    };

    // *****************************************************************************
    // * Functions you only can reach with CMD()
    // * Observe function names are lower_case
    // *****************************************************************************

    /**
     * Display a frog image
     * Making a frog is a swedish expression for making a mistake. "Jag gjorde en groda".
     * @version 2017-02-22
     * @since   2013-04-15
     * @author  Peter Lembke
     */
    $functions.push("create"); // Enable this function
    const create = function ($in)
    {
        const $default = {
            'alias': '',
            'class': 'frog_image'
        };
        $in = _Default($default, $in);

        const $imageData = 'data:image/png;base64,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';

        let $id = _GetId({'id': $in.alias, 'name': $in.alias, 'class': $in.class });
        let $html = '<img ' + $id + ' src="' + $imageData + '">';

        $id = _GetId({'id': $in.alias, 'name': $in.alias });
        $html = '<div ' + $id + '>' + $html + '</div>';

        return {
            'answer': 'true',
            'message': 'Rendered html for a frog. Have fun.',
            'html': $html,
            'css_data': {
                '.frog_image': 'border-style: solid; border-width: 5px; border-color: red;'
            }
        };
    };
}
//# sourceURL=infohub_render_frog.js