/**
 * infohub_render_table
 * Render HTML for a table
 *
 * @package     Infohub
 * @subpackage  infohub_render_table
 * @since       2019-12-28
 * @author      Peter Lembke <info@infohub.se>
 * @license     GPL-3.0-or-later
 * @copyright   Copyright (C) 2010- Peter Lembke
 * @see         https://github.com/peterlembke/infohub/blob/main/folder/plugins/infohub/render/table/infohub_render_table.md Documentation
 * @link        https://infohub.se/ InfoHub main page
 */
function infohub_render_table() {

    'use strict';

    // include "infohub_base.js"

    const _Version = function() {
        return {
            'date': '2019-12-31',
            'since': '2019-12-28',
            'version': '1.0.0',
            'checksum': '{{checksum}}',
            'class_name': 'infohub_render_table',
            'note': 'Render HTML for a table',
            'status': 'normal',
            'SPDX-License-Identifier': 'GPL-3.0-or-later',
        };
    };

    const _GetCmdFunctions = function() {
        const $list = {
            'create': 'normal',
        };

        return _GetCmdFunctionsBase($list);
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
    const _GetId = function($in = {}) {
        let $parameter = [];

        const $default = {
            'id': '',
            'name': '',
            'class': '',
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
    const _GetParameters = function($in = {}, $fields = {}) {
        let $useFields = [];

        if (_IsSet($in.custom_variables) === 'true') {
            $in = _Merge($in, $in.custom_variables);

            for (let $keyOut in $in.custom_variables) {
                if ($in.custom_variables.hasOwnProperty($keyOut) === false) {
                    continue;
                }

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

        return ' ' + $useFields.join(' ') + $disabled;
    };

    // *****************************************************************************
    // * Functions you only can reach with CMD()
    // * Observe function names are lower_case
    // *****************************************************************************

    $functions.push('create');
    /**
     * Get instructions and create the html
     * @version 2020-12-19
     * @since   2019-12-28
     * @author  Peter Lembke
     * @param $in
     * @returns {{item_index: {}, answer: string, message: string}}
     */
    const create = function($in = {}) {
        const $default = {
            'item_index': {},
            'config': {},
        };
        $in = _Default($default, $in);

        let $itemIndex = {};
        for (const $itemName in $in.item_index) {
            if ($in.item_index.hasOwnProperty($itemName) === false) {
                continue;
            }

            let $data = $in.item_index[$itemName];

            $data = _SetDefaultInValues($data);
            $data.config = $in.config;

            const $constants = {
                'renderer': 'infohub_render_table',
                'type': 'table',
                'event_type': 'click',
            };
            $data = _Merge($data, $constants);

            const $fields = {
                'type': 'subtype',
                'renderer': 'renderer',
                'event_data': 'event_data',
                'alias': 'alias',
                'height': 'height',
            };

            const $id = _GetId(
                {'id': $data.alias, 'name': $data.alias, 'class': $data.class});
            const $headHtml = _RenderHead($data);
            const $allRowsHTML = _AllRowsHtml($data);
            const $footHtml = '<tfoot></tfoot>';
            let $html = '<table ' + $id + _GetParameters($data, $fields) + '>' +
                $headHtml + $allRowsHTML + $footHtml + '</table>';

            $html = '<div style="overflow-x:auto;">' + $html + '</div>';

            let $cssData = $data.css_data;

            if ($in.class === 'table') {
                $cssData = {};
                $cssData = _MergeStringData($cssData, $data.css_data);
            }

            $itemIndex[$itemName] = {
                'answer': 'true',
                'message': 'Here are the table with data',
                'html': $html,
                'css_data': $cssData,
                'display': $data.display,
            };
        }

        return {
            'answer': 'true',
            'message': 'Here is what I rendered',
            'item_index': $itemIndex,
        };
    };

    /**
     * Make sure we have the right data and data types in $in
     * @param $in
     * @returns {{}|{answer: string, data: [], message: string}}
     * @private
     */
    const _SetDefaultInValues = function($in = {}) {
        let $default = {
            'type': 'table',
            'alias': '', // Your name on this table. Full name will be {box_id}_{alias}
            'from_plugin': {'node': '', 'plugin': '', 'function': ''},
            'event_handler': 'infohub_render',
            'event_data': '',
            'to_node': 'client',
            'to_plugin': 'infohub_render',
            'to_function': 'event_message',
            'class': 'table', // Define your css classes in css_data. See example below here
            'css_data': {},
            'height': 0, // Limit the height of the table body in px
            'id_field_name': '', // Name of the field that has the ID number
            'definition': {}, // Define each column here
            'data': {}, // The rows with data that will be in the table
            'display': '', // none, inline, block, inline-block
        };
        $in = _Default($default, $in);

        if (_Empty($in.css_data) === 'true') {
            $in.css_data = {
                'table': 'text-align: left; border: 1px solid #7df76d;',
                'th':
                // 'background-image: linear-gradient(to bottom, #7df76d , #6d8df7);'+
                    'color: #1b350a;',
                'th, td': 'padding: 4px; border: 1px solid #7df76d;',
                'td': 'color: #0b1f00;',
                '.left': 'text-align: left;',
                '.center': 'text-align: center;',
                '.right': 'text-align: right;',
                '.negative': 'color: #ff0000;',
                // 'tr:nth-child(even)': 'background-color: #c2c2c2;',
                'tr:hover':
                    'background-color: #6d8df7;',
            };
        }

        let $defaultDefinition = {
            'name': '', // HTML name of the element
            'label': '', // Column label
            'class': '', // left, right, center
            'min_width': 0,
            'max_width': 0,
            'default': null, // Any type of value
            'show': 'true', // Show this column
            'mark_negative': 'false', // Add class 'negative' to negative numbers
            'view_button': 'false', // Render a view button that send a message what id you clicked.
        };

        // definition - set default values
        let $defaultData = {};
        for (let $key in $in.definition) {
            if ($in.definition.hasOwnProperty($key) === false) {
                continue;
            }

            $in.definition[$key] = _Default($defaultDefinition,
                $in.definition[$key]);
            const $name = $in.definition[$key].name;
            $defaultData[$name] = $in.definition[$key].default;
        }

        // data - set default values
        for (let $i = 0; $i < $in.data.length; $i = $i + 1) {
            $in.data[$i] = _Default($defaultData, $in.data[$i]);
        }

        return $in;
    };

    /**
     * Render a html grid with fields defined in definition
     * and rows from $itemsData
     * @param $in
     * @returns {string}
     * @private
     */
    const _AllRowsHtml = function($in = {}) {
        const $idFieldName = $in.id_field_name;
        const $destination = ' to_node="' + $in.to_node + '" to_plugin="' +
            $in.to_plugin + '" to_function="' + $in.to_function + '"';

        let $rowArray = [];

        for (let $i = 0; $i < $in.data.length; $i = $i + 1) {
            const $item = $in.data[$i];

            let $id = '';
            if (_IsSet($item[$idFieldName])) {
                $id = $item[$idFieldName];
            }

            const $rowId = ['{box_id}', $in.alias, $id].join('_');
            const $rowIdString = ' id="' + $rowId + '"';

            let $valueArray = [];

            for (let $fieldName in $in.definition) {

                if ($in.definition.hasOwnProperty($fieldName) === false) {
                    continue;
                }

                const $show = $in.definition[$fieldName].show;
                if ($show === 'false') {
                    continue;
                }

                let $value = '';
                if (_IsSet($item[$fieldName])) {
                    $value = $item[$fieldName];
                }

                let $classArray = [];

                if (_Empty($in.definition[$fieldName].class) === 'false') {
                    $classArray.push($in.definition[$fieldName].class);
                }
                if ($in.definition[$fieldName].mark_negative === 'true') {
                    const $dataType = _GetDataType($value);
                    if ($dataType === 'number' && $value < 0) {
                        $classArray.push('negative');
                    }
                }

                let $class = '';
                if (_Empty($classArray) === 'false') {
                    $class = ' class="' + $classArray.join(' ') + '"';
                }

                let $name = '';
                if (_Empty($in.definition[$fieldName].name) === 'false') {
                    $name = ' name="' + $in.definition[$fieldName].name + '"';
                }

                if ($in.definition[$fieldName].view_button === 'true') {
                    const $event = ' onClick="go(\'' + $in.event_handler + '\',\'click\',\'' + $rowId + '\')"';
                    $value = '<button type="button"' + $event + '>View</button>';
                }

                const $cellName = $in.definition[$fieldName].name;
                const $cellId = ['{box_id}', $in.alias, $id, $cellName].join('_');
                const $cellIdString = ' id="' + $cellId + '"';
                const $html = '<td' + $cellIdString + $class + $name + '>' + $value + '</td>';
                $valueArray.push($html);
            }

            const $fieldsHTML = $valueArray.join('');

            let $eventData = '';
            if (_Empty($in.event_data) === 'false' && $id !== '') {
                $eventData = ' event_data="' + $in.event_data + '|' + $id + '"';
            }

            const $rowHtml = '<tr' + $rowIdString + $destination + $eventData +
                '>' + $fieldsHTML + '</tr>';

            $rowArray.push($rowHtml);
        }

        return '<tbody>' + $rowArray.join('') + '</tbody>';
    };

    /**
     * Render the table head
     * @param $in
     * @returns {string}
     * @private
     */
    const _RenderHead = function($in = {}) {
        let $labelArray = [];
        for (let $fieldName in $in.definition) {
            if ($in.definition.hasOwnProperty($fieldName) === false) {
                continue;
            }

            const $show = $in.definition[$fieldName].show;
            if ($show === 'false') {
                continue;
            }

            const $label = $in.definition[$fieldName].label;

            let $class = '';
            if (_Empty($in.definition[$fieldName].class) === 'false') {
                $class = ' class="' + $in.definition[$fieldName].class + '"';
            }

            let $name = '';
            if (_Empty($in.definition[$fieldName].name) === 'false') {
                $name = ' name="' + $in.definition[$fieldName].name + '"';
            }

            let $style = '';
            let $styleArray = [];
            if ($in.definition[$fieldName].min_width > 0) {
                const $data = 'min-width:' +
                    $in.definition[$fieldName].min_width + 'px;';
                $styleArray.push($data);
            }
            if ($in.definition[$fieldName].max_width > 0) {
                const $data = 'max-width:' +
                    $in.definition[$fieldName].max_width + 'px;';
                $styleArray.push($data);
            }
            if ($styleArray.length > 0) {
                $style = ' style="' + $styleArray.join('') + '"';
            }

            const $html = '<th' + $class + $name + $style + '>' + $label +
                '</th>';
            $labelArray.push($html);
        }

        return '<thead><tr>' + $labelArray.join('') + '</tr></thead>';
    };
}

//# sourceURL=infohub_render_table.js