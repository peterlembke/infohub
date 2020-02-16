/**
 * infohub_render_link.js render a link you can touch
 * @category InfoHub
 * @package infohub_render_link
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
function infohub_render_link() {

    "use strict";

    // include "infohub_base.js"

    const _Version = function() {
        return {
            'date': '2017-02-22',
            'since': '2015-02-14',
            'version': '1.0.0',
            'checksum': '{{checksum}}',
            'class_name': 'infohub_render_link',
            'note': 'Render HTML for a link',
            'status': 'normal',
            'license_name': 'GNU GPL 3 or later'
        };
    };

    const _GetCmdFunctions = function() {
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
     * Internal functions must start with a capital letter
     * Used by renderers to get a proper function name
     * @version 2016-10-16
     * @since   2016-10-16
     * @author  Peter Lembke
     * @param $text
     * @return string
     */
    const _GetFuncName = function($text)
    {
        let $response = '';

        const $parts = $text.split('_');

        for (let $key in $parts) {
            if ($parts.hasOwnProperty($key) === false) {
                continue;
            }
            $response = $response + $parts[$key].charAt(0).toUpperCase() + $parts[$key].substr(1);
        }

        return $response;
    };

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

    /**
     * Get the rest of the html parameters
     * @version 2018-05-31
     * @since 2018-05-31
     * @param $in
     * @param $fields
     * @returns {string}
     * @private
     */
    const _GetParameters = function ($in, $fields)
    {
        let $useFields = [];

        if (_IsSet($in.custom_variables) === 'true')
        {
            $in = _Merge($in, $in.custom_variables);

            for (let $keyOut in $in.custom_variables) {
                if ($keyOut === 'custom_variables') { continue; }
                if (_IsSet($fields[$keyOut]) === 'true') { continue; }
                $fields[$keyOut] = $keyOut;
            }
            delete $in.custom_variables;
        }

        for (let $keyOut in $fields) {
            if ($fields.hasOwnProperty($keyOut)) {
                let $keyIn = $fields[$keyOut];
                let $data = $in[$keyIn];
                if (_Empty($data) === 'false') {
                    const $field = $keyOut + '="' + $data + '"';
                    $useFields.push($field);
                }
            }
        }

        let $disabled = '';
        if (_IsSet($in.enabled) === 'true' && $in.enabled === 'false') {
            $disabled = ' disabled';
        }

        return  ' ' +  $useFields.join(' ') + $disabled;
    };

    /**
     * Gives CSS for how to display
     * "block", "inline", "none" or leave it empty
     * @since 2017-02-20
     * @param $in
     * @returns {string}
     * @private
     */
    const _Display = function ($in)
    {
        const $default = {
            'display': ''
        };
        $in = _Default($default, $in);

        if ($in.display !== '') {
            return 'style="display:' + $in.display + '"';
        }

        return '';

    };

    // *****************************************************************************
    // * Functions you only can reach with CMD()
    // * Observe function names are lower_case
    // *****************************************************************************

    /**
     * Get instructions and create the message to InfoHub View
     * @version 2014-11-01
     * @since   2013-04-15
     * @author  Peter Lembke
     */
    $functions.push("create");
    const create = function ($in)
    {
        let $default = {
            'type': 'link',
            'subtype': 'link', // link, toggle, external, embed
            'alias': '', // Your name on this link. Full name will be {box_id}_{alias}_{subtype}
            'show': '', // What to show in the link.
            'legend': 'false', // If you want a frame around the link
            'event_data': '', // Data to send in the message
            'toggle_alias': '', // For toggle links
            'other_alias': '', // You can hide this link and show another link
            'url': '', // For external links
            'embed': '', // What content to show when you have a link with embedded content.
            'display': '',
            'block_type_visible': '', // nothing defaults to "block". You can also have "inline-block"
            'from_plugin': {'node':'', 'plugin': '', 'function': '' },
            'to_node': 'client',
            'to_plugin': 'infohub_render',
            'to_function': 'event_message',
            'final_node': 'client', // Can be used by your code to do something
            'final_plugin': '', // For example infohub_tabs use this with long click to first show the tab and then send the message further to a renderer that show the long click gui
            'final_function': 'event_message',
            'class': '',
            'css_data': {}
        };
        $in = _Default($default, $in);

        $in.func = _GetFuncName($in.subtype);
        let $response = internal_Cmd($in);

        $default = {
            'answer': 'false',
            'message': '',
            'html': '',
            'css_data': {},
            'display': ''
        };
        $response = _Default($default, $response);

        return {
            'answer': $response.answer,
            'message': $response.message,
            'html': $response.html,
            'css_data': $response.css_data,
            'display': $response.display
        };
    };

// *****************************************************************************
// * Internal function that you only can reach from internal_Cmd
// *****************************************************************************

    /**
     * Create HTML for an eventlink
     * @version 2017-02-12
     * @since   2014-02-22
     * @author  Peter Lembke
     */
    const internal_Link = function ($in)
    {
        const $default = {
            'alias': '',
            'show': '', // Text to show on screen
            'legend': 'false',
            'event_data': '', // Any string you like to send to to_plugin, to_function
            'to_node': 'client',
            'to_plugin': 'infohub_render',
            'to_function': 'event_message',
            'final_node': 'client',
            'final_plugin': '',
            'final_function': 'event_message',
            'display': 'inline', // nothing, block or inline
            'custom_variables': {},
            'css_data': {},
            'class': 'link'
        };
        $in = _Default($default, $in);

        if (_Empty($in.css_data) === 'true') {
            $in.css_data = {'.link': 'color: rgba(68, 69, 166, 0.89);'};
        }

        const $constants = {
            'renderer': 'infohub_render_link',
            'type': 'link',
            'subtype': 'link',
            'event_type': 'click'
        };
        $in = _Merge($in, $constants);

        const $fields = {
            'type': 'subtype',
            'renderer': 'renderer',
            'event_data': 'event_data',
            'alias': 'alias'
        };

        const $idString = ['{box_id}', $in.alias].join('_');
        const $event = " onClick=\"go('" + $in.to_plugin + "','" + $in.event_type + "','" + $idString + "')\"";

        let $id = _GetId({'id': $in.alias, 'name': $in.alias, 'class': $in.class });
        if ($in.legend === 'true') {
            $id = _GetId({'id': $in.alias, 'name': $in.alias, 'class': 'legend' });
            $in.show = '<p ' + $id + '>' + $in.show + '</p>';
        }

        const $destination = ' to_node="' + $in.to_node + '" to_plugin="' + $in.to_plugin + '" to_function="' + $in.to_function + '"';

        let $finalDestination = '';
        if ($in.final_plugin !== '') {
            $finalDestination = ' final_node="' + $in.final_node + '" final_plugin="' + $in.final_plugin + '" final_function="' + $in.final_function + '"';
        }

        $in.html = '<a ' + $id + _GetParameters($in, $fields) + $destination + $finalDestination + $event + '>' + $in.show + '</a>';

        return {
            'answer': 'true',
            'message': 'Rendered html for a link',
            'html': $in.html,
            'css_data': $in.css_data,
            'display': $in.display
        };
    };

    /**
     * Create HTML for a toggle link
     * Toggle visibility for the item alias you set in 'data'.
     * The item alias must exist in the same box as the link.
     * @version 2016-10-29
     * @since   2016-10-29
     * @author  Peter Lembke
     */
    const internal_Toggle = function ($in)
    {
        const $default = {
            'alias': '',
            'show': '', // Text to show on screen
            'legend': 'false',
            'toggle_alias': '', // Alias to the item you want to toggle. Must be within the same box as the link.
            'other_alias': '', // You can also hide this link and show the other link alias
            'to_plugin': 'infohub_render',
            'to_function': 'event_message',
            'display': '',
            'block_type_visible': '' // nothing defaults to "block". You can also have "inline-block"
        };
        $in = _Default($default, $in);

        const $constants = {
            'renderer': 'infohub_render_link',
            'type': 'link',
            'subtype': 'toggle',
            'event_type': 'toggle',
            'class': 'link'
        };
        $in = _Merge($in, $constants);

        const $idString = ['{box_id}', $in.alias].join('_');
        const $toggleIdString = ' toggle_id="' + ['{box_id}', $in.toggle_alias].join('_') + '"';

        let $otherIdString = '';
        if (_Empty($in.other_alias) === 'false') {
            $otherIdString = ' other_id="' + ['{box_id}', $in.other_alias].join('_') + '"';
        }

        let $blockType = '';
        if (_Empty($in.block_type_visible) === 'false') {
            $blockType = ' block_type="' + $in.block_type_visible + '"';
        }

        let $id = _GetId({'id': $in.alias, 'name': $in.alias, 'class': $in.class });
        const $display = ' ' + _Display($in);
        const $renderer = ' ' + $id + ' renderer="' + $in.renderer + '" type="' + $in.subtype + '" alias="' + $in.alias + '"' + $toggleIdString + $otherIdString + $display + $blockType;

        const $destination = ' to_node="client" to_plugin="infohub_view" to_function="toggle"';

        const $event = " onClick=\"go('infohub_view', 'toggle', '" + $idString + "')\"";

        if ($in.legend === 'true') {
            $id = _GetId({'id': $in.alias, 'name': $in.alias, 'class': 'link_legend' });
            $in.show = '<p ' + $id + '>' + $in.show + '</p>';
        }

        $in.html = '<a ' + $renderer + $destination + $event + '>' + $in.show + '</a>';

        return {
            'answer': 'true',
            'message': 'Rendered html for a link',
            'html': $in.html,
            'css_data': {
                '.link': 'color: rgba(68, 69, 166, 0.89);'
            }
        };
    };

    /**
     * Create HTML for an external link that will open in a new tab
     * @version 2016-10-29
     * @since   2016-10-29
     * @author  Peter Lembke
     */
    const internal_External = function ($in)
    {
        const $default = {
            'alias': '',
            'show': '', // Text to show on screen
            'legend': 'false',
            'url': '',
            'to_plugin': 'infohub_render',
            'to_function': 'event_message',
            'display': 'inline'
        };
        $in = _Default($default, $in);

        const $constants = {
            'renderer': 'infohub_render_link',
            'type': 'link',
            'subtype': 'external',
            'event_type': 'external',
            'class': 'link'
        };
        $in = _Merge($in, $constants);

        let $id = _GetId({'id': $in.alias, 'name': $in.alias, 'class': $in.class });
        const $data = btoa($in.url);

        const $renderer = ' ' + $id + ' renderer="' + $in.renderer + '" type="' + $in.subtype + '" data="' + $data + '" alias="' + $in.alias + '"';

        const $destination = '';

        const $idString = ['{box_id}', $in.alias].join('_');
        const $event = " onClick=\"go('" + $in.to_plugin + "','" + $in.event_type + "','" + $idString + "')\"";

        if ($in.legend === 'true') {
            $id = _GetId({'id': $in.alias, 'name': $in.alias, 'class': 'link_legend' });
            $in.show = '<p ' + $id + '>' + $in.show + '</p>';
        }

        $in.html = '<a ' + $renderer + $destination + $event + '>' + $in.show + '</a>';

        return {
            'answer': 'true',
            'message': 'Rendered html for a link',
            'html': $in.html,
            'css_data': {
                '.link': 'color: rgba(68, 69, 166, 0.89);'
            },
            'display': $in.display
        };
    };

    /**
     * Create HTML for an embedded link that will activate embedded html
     * @version 2016-10-29
     * @since   2016-10-29
     * @author  Peter Lembke
     */
    const internal_Embed = function ($in)
    {
        const $default = {
            'alias': '',
            'show': '', // Text to show on screen
            'legend': 'false',
            'embed': '' // JSON data that later will be BASE64 encoded
        };
        $in = _Default($default, $in);

        const $constants = {
            'renderer': 'infohub_render_link',
            'type': 'link',
            'subtype': 'embed',
            'event_type': 'embed',
            'class': 'link'
        };
        $in = _Merge($in, $constants);

        let $id = _GetId({'id': $in.alias, 'name': $in.alias, 'class': $in.class });
        const $data = '{{*' + $in.embed + '*}}';

        const $renderer = ' ' + $id + ' renderer="' + $in.renderer + '" type="' + $in.subtype + '" data="' + $data + '" alias="' + $in.alias + '"';

        const $destination = '';

        const $idString = ['{box_id}', $in.alias].join('_');
        const $event = " onClick=\"go('infohub_view','" + $in.event_type + "','" + $idString + "')\"";

        if ($in.legend === 'true') {
            $id = _GetId({'id': $in.alias, 'name': $in.alias, 'class': 'legend' });
            $in.show = '<p ' + $id + '>' + $in.show + '</p>';
        }

        $in.html = '<a ' + $renderer + $destination + $event + '>' + $in.show + '</a>';

        return {
            'answer': 'true',
            'message': 'Rendered html for a link',
            'html': $in.html,
            'css_data': {
                '.link': 'color: rgba(68, 69, 166, 0.89);'
            }
        };
    };
}
//# sourceURL=infohub_render_link.js