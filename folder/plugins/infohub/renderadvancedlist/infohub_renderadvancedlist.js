/**
 * infohub_renderadvancedlist.js contact the renderers to get HTML and then send it to infohub_view
 * infohub_renderadvancedlist and infohub_view are the only plugions that handle the DOM
 * @category InfoHub
 * @package infohub_renderadvancedlist
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
function infohub_renderadvancedlist() {

    "use strict";

    // include "infohub_base.js"

    const _Version = function() {
        return {
            'date': '2017-10-29',
            'since': '2017-10-29',
            'version': '1.0.0',
            'checksum': '{{checksum}}',
            'class_name': 'infohub_renderadvancedlist',
            'note': 'Renders an advanced list with expandable levels',
            'status': 'normal',
            'SPDX-License-Identifier': 'GPL-3.0-or-later',
            'user_role': 'user'
        };
    };

    const _GetCmdFunctions = function() {
        const $list = {
            'create': 'normal',
            'expand': 'normal'
        };

        return _GetCmdFunctionsBase($list);
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

    // *****************************************************************************
    // * Functions you only can reach with CMD()
    // * Observe function names are lower_case
    // *****************************************************************************

    /**
     * Get instructions and create the message to InfoHub View
     * @version 2013-04-15
     * @since   2013-04-15
     * @author  Peter Lembke
     */
    $functions.push("create"); // Enable this function
    const create = function ($in)
    {
        const $default = {
            'type': '',
            'step': 'step_start'
        };
        $in = _Merge($default, $in);

        if ($in.step === 'step_start') {
            $in.func = _GetFuncName($in.type);
            let $response = internal_Cmd($in);

            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_render',
                    'function': 'create'
                },
                'data': {
                    'what': $response.what,
                    'how': $response.how,
                    'where': $response.where
                },
                'data_back': {
                    'step': 'step_end',
                    'alias': $in.alias
                }
            });
        }

        if ($in.step === 'step_end') {
            if (_Empty($in.alias) === 'false') {
                // All IDs become unique by inserting the parent alias in each ID.
                const $find = '{box_id}';
                const $replace = $find + '_' + $in.alias;
                $in.html = $in.html.replace(new RegExp($find, 'g'), $replace);
            }
        }

        return {
            'answer': $in.answer,
            'message': $in.message,
            'html': $in.html,
            'css_data': $in.css_data
        };
    };

    /**
     * Render an advanced list with expandable nodes
     * @version 2017-10-29
     * @since   2017-10-29
     * @author  Peter Lembke
     */
    const internal_AdvancedList = function ($in)
    {
        const $default = {
            'option': {},
            'label_expand': '⊕', // https://unicode-table.com/en/2295/
            'label_contract': '⊖', // https://unicode-table.com/en/2296/
            'css_data': {},
            'separator': '_'
        };
        $in = _Default($default, $in);

        if (_Empty($in.css_data) === 'true') {
            $in.css_data = {
                '.list': 'font-size: 1.0em; list-style-type: none; margin: 0px; padding: 4px 0px 4px 10px;'
            };
        }

        const $data = _StructureData($in.option, $in.separator);
        const $dataOut = _LabelData($data, $in.label_expand, $in.label_contract);
        const $what = _GetWhat($dataOut, $in.css_data, $in.label_expand, $in.label_contract);

        return {
            'answer': 'true',
            'message': 'Here are the parts to build the presentation box',
            'what': $what,
            'how': {
                'mode': 'one box',
                'text': '[childlist_rootlevel]'
            },
            'where': {
                'mode': 'html'
            }
        };
    };

    /**
     * Add children to each option
     * The list are converted to an object. On the first level you have ALL nodes that have ANY children.
     * In the second level you have the children and their labels. There are no third level.
     * @version 2018-05-15
     * @since   2017-10-29
     * @author  Peter Lembke
     */
    const _StructureData = function ($option, $separator)
    {
        let $dataOut = {};

        for (let $key in $option) {
            if ($option.hasOwnProperty($key))
            {
                let $level = $option[$key].level;
                let $parts = $level.split($separator);

                if ($parts.length >= 2) {
                    if ($parts[0] === $parts[1]) {
                        $parts.shift();
                        $level = $parts.join($separator);
                    }
                }

                $parts.pop();
                let $parent = $parts.join($separator);

                if ($parent === '') {
                    $parent = 'rootlevel';
                }

                if (typeof $dataOut[$parent] === "undefined") {
                    $dataOut[$parent] = {};
                }

                $dataOut[$parent][$level] = $option[$key].label;
            }
        }

        return $dataOut;

    };

    /**
     * All nodes that have a child will get some extra parameters to their label.
     * Those parameters are render instructions for expand/contract label and for the child list
     * Remember that your top level node is actually a child to "rootlevel", so yourtop level node will also
     * get the extra commands.
     * @version 2017-10-29
     * @since   2017-10-29
     * @author  Peter Lembke
     */
    const _LabelData = function ($dataIn, $labelExpand, $labelContract)
    {
        let $dataOut = _ByVal($dataIn);

        let $expand = true;
        if ($labelExpand === '') {
            $expand = false;
        }

        let $contract = true;
        if ($labelContract === '') {
            $contract = false;
        }

        for (let $parent in $dataOut) {
            for (let $level in $dataOut[$parent]) {
                if (_IsSet($dataOut[$level]) === 'true') {
                    if ($expand === true) {
                        $dataOut[$parent][$level] = $dataOut[$parent][$level] + '[toggle_' + $level + ']';
                    }
                    if ($contract === true) {
                        $dataOut[$parent][$level] = $dataOut[$parent][$level] + '[toggle2_' + $level + ']';
                    }
                    $dataOut[$parent][$level] = $dataOut[$parent][$level] + '[childlist_' + $level + ']';
                }
            }
        }

        return $dataOut;
    };

    /**
     * What to render.
     * All nodes on level 1 is parents to at least one child.
     * Now we add all objects that need to be rendered to get all this working.
     * There will be a lot of data to render but fortunately the rendering is quick.
     * @version 2017-10-29
     * @since   2017-10-29
     * @author  Peter Lembke
     */
    const _GetWhat = function ($dataIn, $cssData, $labelExpand, $labelContract)
    {
        let $dataOut = _ByVal($dataIn);
        let $what = {};

        for (let $level in $dataOut)
        {
            const $toggleId = 'toggle_' + $level;
            const $toggleId2 = 'toggle2_' + $level;
            const $childId = 'childlist_' + $level;

            if (_Empty($labelExpand) === 'false') {
                $what[$toggleId] = {
                    'type': 'link',
                    'subtype': 'toggle',
                    'show': $labelExpand,
                    'toggle_alias': $childId,
                    'other_alias': $toggleId2,
                    'block_type_visible': 'inline-block'
                };
            }

            if (_Empty($labelContract) === 'false') {
                $what[$toggleId2] = {
                    'type': 'link',
                    'subtype': 'toggle',
                    'show': $labelContract,
                    'toggle_alias': $childId,
                    'other_alias': $toggleId,
                    'display': 'none',
                    'block_type_visible': 'inline-block'
                };
            }

            let $display = 'none';
            if ($childId === 'childlist_rootlevel') {
                $display = 'block';
            }
            if (_Empty($labelExpand) === 'true') {
                $display = 'block';
            }

            // A list to show the children
            $what[$childId] = {
                'type': 'common',
                'subtype': 'list',
                'option': [],
                'css_data': $cssData,
                'display': $display
            };

            // This is the children being added to the childlist
            for (let $childItemKey in $dataOut[$level])
            {
                const $row = {
                    'label' : $dataOut[$level][$childItemKey],
                    'id': $childItemKey
                };

                $what[$childId].option.push($row);
            }
        }

        return $what;
    };

    /**
     * Expand all nodes for a node path
     * @version 2017-11-14
     * @since   2017-11-14
     * @author  Peter Lembke
     * @param $in
     * @returns {*}
     */
    $functions.push("expand"); // Enable this function
    const expand = function ($in)
    {
        const $default = {
            'box_id': '',
            'list_name': '',
            'list_path': '',
            'step': 'step_get_box_id',
            'data_back': {},
            'response': {}
        };
        $in = _Default($default, $in);

        if ($in.step === 'step_get_box_id') {
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_view',
                    'function': 'get_box_id'
                },
                'data': {
                    'box_id': $in.box_id
                },
                'data_back': {
                    'list_name': $in.list_name,
                    'list_path': $in.list_path,
                    'step': 'step_get_box_id_response'
                }
            });
        }

        if ($in.step === 'step_get_box_id_response')
        {
            let $parts = $in.list_path.split('_'),
                $ids = [],
                $id = '';

            while (_Count($parts) > 0)
            {
                $id = $in.box_id + '_' + $in.data_back.list_name + '_childlist_' + $parts.join('_');
                $ids.push({
                    'func': 'SetVisible',
                    'id': $id,
                    'set_visible': 'true'
                });

                $id = $in.box_id + '_' + $in.data_back.list_name + '_toggle_' + $parts.join('_');
                $ids.push({
                    'func': 'SetVisible',
                    'id': $id,
                    'set_visible': 'false',
                    'block_type_visible': 'inline-block'
                });

                $id = $in.box_id + '_' + $in.data_back.list_name + '_toggle2_' + $parts.join('_');
                $ids.push({
                    'func': 'SetVisible',
                    'id': $id,
                    'set_visible': 'true',
                    'block_type_visible': 'inline-block'
                });

                $parts.pop();
            }

            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_view',
                    'function': 'mass_update'
                },
                'data': {
                    'do': $ids
                },
                'data_back': {
                    'step': 'step_end'
                }
            });
        }

        return {
            'answer': 'true',
            'message': 'Done expanding nodes in the advanced list'
        };
    };
}
//# sourceURL=infohub_renderadvancedlist.js