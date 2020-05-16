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
function infohub_view() {

    "use strict";

// webworker=false
// include "infohub_base.js"

    $functions.push('_Version');
    const _Version = function () {
        return {
            'date': '2018-04-15',
            'version': '1.0.3',
            'checksum': '{{checksum}}',
            'class_name': 'infohub_view',
            'note': 'The screen handler. Handles boxes on the screen. You can ask for a box and send HTML to that box.',
            'status': 'normal',
            'SPDX-License-Identifier': 'GPL-3.0-or-later',
            'recommended_security_group': 'guest'
        };
    };

    $functions.push('_GetCmdFunctions');
    const _GetCmdFunctions = function ()
    {
        return {
            'init': 'normal',
            'get_box_id': 'normal',
            'scroll_to_box_id': 'normal',
            'box_mode': 'normal',
            'box_delete': 'normal',
            'box_clear': 'normal',
            'box_insert': 'normal',
            'boxes_insert': 'normal',
            'boxes_insert_detailed': 'normal',
            'box_view': 'normal',
            'siblings_box_view': 'normal',
            'box_list': 'normal',
            'box_data': 'normal',
            'box_copy': 'normal',
            'modify_class': 'normal',
            'set_favicon': 'normal',
            'set_text': 'normal',
            'get_text': 'normal',
            'get_html': 'normal',
            'zoom_level': 'normal',
            'style': 'normal',
            'is_visible': 'normal',
            'set_visible': 'normal',
            'is_enabled': 'normal',
            'set_enabled': 'normal',
            'toggle': 'normal',
            'mass_update': 'normal',
            'id_exist': 'normal',
            'mark_object': 'normal',
            'form_select_read': 'normal',
            'form_read': 'normal',
            'form_write': 'normal',
            'file_read': 'normal',
            'file_write': 'normal',
            'set_style': 'normal',
            'event_message': 'normal'
        };
    };

    // *****************************************************************************
    // * The private functions, add your own in your plugin
    // * These functions can be used directly in your functions.
    // * Name: _CamelCaseData
    // *****************************************************************************

    /**
     * Add text to the log div-box that is on the end of the page
     * @version 2013-12-01
     * @since 2013-12-01
     * @author Peter Lembke
     * @param $name
     */
    $functions.push('_Log');
    const _Log = function ($in)
    {
        const $default = {
            'func': '_Log',
            'message': ''
        };
        $in = _Default($default, $in);

        internal_Log({
            'level': 'error',
            'message': $in.message, 'function_name': '_Log'
        });

        let $element = _GetNode('log');

        if (!$element) {
            return;
        }

        const $timeStamp = new Date().toISOString();
        $element.innerHTML = $timeStamp + ' : ' + $in.func + ':' + $in.message + '<br>' + $element.innerHTML;
    };

    /**
     * Exchange all {variable} with the corresponding variable data in box_data
     * @version 2017-10-06
     * @since 2013-12-01
     * @author Peter Lembke
     * @param $in
     * @private
     */
    $functions.push('_BoxData');
    const _BoxData = function ($in)
    {
        const $default = {
            'box_data': '',
            'variables': {}
        };
        $in = _Default($default, $in);

        for (let $variableName in $in.variables)
        {
            if ($in.variables.hasOwnProperty($variableName) === true) {
                if ($variableName !== 'box_data') {
                    let $variableData = $in.variables[$variableName];
                    $in.box_data = $in.box_data.replace(new RegExp('{' + $variableName + '}', 'gi'), $variableData);
                    // gi = Global (all occurrences in the string), Ignore case.
                }
            }
        }

        return $in.box_data;
    };

    /**
     * Give a box_id. If the id is a number then we just return it.
     * If the box_id contain a dot then we explode the string and treat each part as an alias.
     * Example: main.body.infohub_doc.doc
     * Example: 1204.doc (Mix of id and aliases)
     * Example: 1204.parent.parent.body.doc (Use of parent as a way to get the parentNode)
     * Example: main.body.infohub_launcher.my_list.[my_list_box_content] , this will give 12011_my_list_box_content
     * @version 2017-12-04
     * @since 2013-12-01
     * @author Peter Lembke
     * @param $in
     * @returns {{answer: string, data: number}}
     * @private
     */
    $functions.push('_GetBoxId');
    const _GetBoxId = function ($id)
    {
        let $box = document;

        if ($id === '1101_menutitle') {
            const $a=1; // For debug purposes
        }

        if (Number($id) == $id) {
            return $id;
        }

        let $parts = $id.split('.');

        for (let $partNumber in $parts)
        {
            if ($parts.hasOwnProperty($partNumber) === false) {
                continue;
            }

            const $boxAlias = $parts[$partNumber];

            if ($boxAlias.substr(0,1) === '[') {
                continue;
            }

            if ($boxAlias === 'parent')
            {
                $box = $box.parentNode;

                // If we have 123_my_textbox.parent, then we want 123.
                if ($partNumber === '1') { // Yes string
                    const $tmpBoxId1 = $parts[0].split('_');
                    if ($tmpBoxId1.length > 1) {
                        if (Number($tmpBoxId1[0]) == $tmpBoxId1[0]) {
                            $box = document.getElementById($tmpBoxId1[0]);
                        }
                    }
                }

                continue;
            }

            let $selector = '';

            if (Number($boxAlias) == $boxAlias) {
                $selector = '[id=\'' + $boxAlias + '\']';
                $box = $box.querySelector($selector);
                continue;
            }

            $selector = '[box_alias=\'' + $boxAlias + '\']';
            const $boxList = $box.querySelectorAll($selector);

            if ($boxList.length === 0) {
                if ($parts.length === 1) {
                    $selector = '[id=\'' + $boxAlias + '\']';
                    $box = $box.querySelector($selector);
                    continue;
                }
                $box = null;
                break;
            }

            if ($boxList.length === 1) {
                $box = $boxList[0];
                continue;
            }

            let $selected = null;
            for (let $listItemNumber in $boxList)
            {
                if ($boxList.hasOwnProperty($listItemNumber) === false) {
                    continue;
                }

                if ($selected === null) {
                    $selected = $boxList[$listItemNumber];
                    continue;
                }

                const $tmpBoxId1 = $selected.getAttribute('id');
                const $tmpBoxId2 = $boxList[$listItemNumber].getAttribute('id');

                if ($tmpBoxId1.length < $tmpBoxId2.length) {
                    continue; // The one we already have is closer to mother
                }

                if ($tmpBoxId1.length > $tmpBoxId2.length) {
                    $selected = $boxList[$listItemNumber]; // One from list is closer to mother
                    continue;
                }

                if ($tmpBoxId1 > $tmpBoxId2) { // Children on same level left, pick the oldest one
                    $selected = $boxList[$listItemNumber];
                }
            }
            $box = $selected;
        }

        if ($box) {
            $id = $box.getAttribute('id');
        }

        const $partNumber = $parts.length -1;
        if ($parts[$partNumber].substr(0,1) === '[') {
            let $innerId = $parts[$partNumber];
            $innerId = $innerId.replace('[', '');
            $innerId = $innerId.replace(']', '');
            $id = $id + '_' + $innerId;
        }

        return $id;
    };

    /**
     * Start with a box_id that you already have evaluated trough _GetBoxId
     * If the id contain a dot then we explode the string and treat each part as a tag name.
     * Example: 12011_my_list_box_content.svg.circle.0
     * In the box 12011_my_list_box_content we find the svg tag and the circle tag, that is a list and we want the first one.
     * @version 2020-03-01
     * @since 2020-03-01
     * @author Peter Lembke
     * @param $in
     * @returns {{answer: string, data: number}}
     * @private
     */
    $functions.push('_GetElement');
    const _GetElement = function ($id)
    {
        let $parts = $id.split('.');

        if ($parts.length === 0) {
            return '';
        }

        if ($parts.length === 1) {
            return document.getElementById($id);
        }

        let $element = document.getElementById($parts[0]);

        if (!$element) {
            return '';
        }

        for (let $partNumber in $parts)
        {
            if ($parts.hasOwnProperty($partNumber) === false) {
                continue;
            }

            if ($partNumber === '0') {
                continue;
            }

            const $tag = $parts[$partNumber];

            if (Number($tag) == $tag) {
                $element = $element[$tag];
            } else {
                $element = $element.getElementsByTagName($tag);
                if ($element && $element.length === 1) {
                    $element = $element[0];
                }
            }

            if (!$element) {
                return '';
            }
        }

        return $element;
    };

    /**
     * Trying to find the before_box_id if you give the parent_box_id and box_position
     * @version 2017-10-06
     * @since 2013-12-01
     * @author Peter Lembke
     */
    $functions.push('_GetBeforeBoxId');
    const _GetBeforeBoxId = function ($in)
    {
        const $default = {
            'func': '_GetBeforeBoxId',
            'parent_box_id': '',
            'box_position': 'first' // first, last, middle
        };
        $in = _Merge($default, $in);

        let $box, $children, $list = [], $nr, $message = '', $answer = 'false', $beforeBoxId;

        leave: {
            $box = _GetNode($in.parent_box_id);

            if (!$box) {
                $message = 'Can not find the box';
                break leave;
            }

            if ($box.hasAttribute('box_mode') === false) {
                $message = 'Missing before_box_id, trying to find it. Box do not have attribute: box_mode';
                break leave;
            }

            if ($box.getAttribute('box_mode') === 'data') {
                $message = 'Missing before_box_id, trying to find it. Box must have box_mode= side or under, this one have box_mode=data';
                break leave;
            }

            $children = $box.childNodes;
            for (let $i = 0; $i < $children.length; $i = $i + 1) {
                if ($children[$i].tagName === 'DIV') {
                    $list.push($children[$i].id);
                }
            }

            if ($list.length === 0) {
                $message = 'This box do not even have the end-box, this is wrong';
                break leave;
            }

            $nr = 0;
            if ($list.length > 1) {
                if ($in.box_position === 'first') {
                    $nr = 0;
                }
                if ($in.box_position === 'middle') {
                    $nr = Math.floor($list.length / 2);
                }
                if ($in.box_position === 'last') {
                    $nr = $list.length - 1; // the end-box must remain last.
                }
            }

            $beforeBoxId = $list[$nr].id;
            $answer = 'true';
            $message = 'Here are the box id';

        }

        if ($answer === 'false') {
            _Log({'func': '_GetBeforeBoxId', 'message': $message});
        }

        return {
            'answer': $answer,
            'message': $message,
            'before_box_id': $beforeBoxId
        };
    };

    /**
     * Calculate the max-width property on a box
     * You can only set 0 = Do not set any width. 100 = set full width
     * All other values will be rounded down to even parts of 160.
     * @param $maxWidth
     * @returns {string}
     * @private
     */
    $functions.push('_GetMaxWidth');
    const _GetMaxWidth = function ($maxWidth)
    {
        let $answer = 'none';

        leave:
        {
            if ($maxWidth === 0) {
                break leave;
            }

            if ($maxWidth === 100) {
                $answer = '100%';
                break leave;
            }

            if ($maxWidth < 160) {
                $answer = 160;
                break leave;
            }

            const $modulus = $maxWidth % 160;

            $answer = ($maxWidth - $modulus) + 'px';
        }

        return $answer;
    };

    /**
     * Get a reference to a DOM node.
     * @param $id
     * @param $supressLogging
     * @returns {HTMLElement|boolean}
     * @private
     */
    $functions.push('_GetNode');
    const _GetNode = function ($id)
    {
        const $convertedId = _GetBoxId($id);

        const $node = document.getElementById($convertedId);

        return $node;
    };

    // ***********************************************************
    // * your class functions below, only declare with var
    // ***********************************************************

    /**
     * Get box id from a series of aliases.
     * Example: main.body.infohub_doc.index
     * @version 2017-12-02
     * @since 2017-12-02
     * @author Peter Lembke
     * @param box_id
     * @param digits
     * @param box_mode
     * @return bool
     */
    $functions.push('init');
    const init = function ($in)
    {
        const $default = {};
        $in = _Default($default, $in);

        // Set the infohub_view CSS if needed
        internal_Cmd({
            'func': 'Css',
            'id': 'infohub_view',
            'css_data': _CssData()
        });

        return {
            'answer': 'true',
            'message': 'Here are the box_id'
        };
    };

    /**
     * Get box id from a series of aliases.
     * Example: main.body.infohub_doc.index
     * @version 2017-10-28
     * @since 2017-10-28
     * @author Peter Lembke
     * @param box_id
     * @param digits
     * @param box_mode
     * @return bool
     */
    $functions.push('get_box_id');
    const get_box_id = function ($in)
    {
        const $default = {
            'box_id': '1'
        };
        $in = _Default($default, $in);

        $in.box_id = _GetBoxId($in.box_id);

        return {
            'answer': 'true',
            'message': 'Here are the box_id',
            'box_id': $in.box_id
        };
    };

    /**
     * Scroll the page to the id you provide
     * @version 2018-08-14
     * @since 2018-08-14
     * @author Peter Lembke
     * @param id
     * @return bool
     */
    $functions.push('scroll_to_box_id');
    const scroll_to_box_id = function ($in)
    {
        const $default = {
            'box_id': '1'
        };
        $in = _Default($default, $in);

        $in.box_id = _GetBoxId($in.box_id);

        const $currentScrollY = window.scrollY;
        // const $currentPageYOffset = window.pageYOffset;

        window.location.hash = '1';
        window.location.hash = $in.box_id;

        const $newScrollY = window.scrollY;
        // const $newPageYOffset = window.pageYOffset;

        if ($currentScrollY !== $newScrollY) {
            window.location.hash = '1';
            window.pageYOffset = $currentScrollY;

            window.scroll({
                top: $newScrollY,
                left: 0,
                behavior: 'smooth'
            });

            // document.location.hash = ''; // Leaves a # in the url. Instead use:
            history.replaceState('', document.title, window.location.pathname);
        }

        return {
            'answer': 'true',
            'message': 'Scrolled to this box_id',
            'id': $in.box_id
        };
    };


    /**
     * Changes the div “box_mode”. You can change to “data”, “side”, “under”.
     * @version 2012-07-08
     * @since 2012-07-08
     * @author Peter Lembke
     * @param box_id
     * @param digits
     * @param box_mode
     * @return bool
     */
    $functions.push('box_mode');
    const box_mode = function ($in)
    {
        const $default = {
            'box_id': '1',
            'box_mode': 'under', // 'under', 'side'
            'digits': '1'
        };
        $in = _Default($default, $in);

        return internal_Cmd({
            'func': 'BoxMode',
            'box_id': $in.box_id,
            'box_mode': $in.box_mode,
            'digits': $in.digits
        });
    };

    $functions.push('internal_BoxMode');
    const internal_BoxMode = function ($in)
    {
        let $message = '';
        let $done = 'false';

        const $default = {
            'func': 'BoxMode',
            'box_id': '1',
            'box_mode': 'under', // 'under', 'side'
            'digits': '1',
            'max_width': 0
        };
        $in = _Default($default, $in);

        leave: {
            let $box = _GetNode($in.box_id);
            if (!$box) {
                $message = 'Can not find the box';
                break leave;
            }

            const $oldMode = $box.getAttribute('box_mode');

            if ($oldMode === $in.box_mode) {
                $message = 'You can not change box_mode to the same value. box_id:' + $in.box_id + ' mode:' + $in.box_mode;
                break leave;
            }

            if ($in.box_mode === 'data')
            {
                $box.setAttribute('box_mode', 'data');
                $box.innerHTML = '';

                if ($in.max_width > 0) {
                    $box.style.maxWidth = _GetMaxWidth($in.max_width);
                }

                $message = 'Changed box mode to: data';
                $done = 'true';
                break leave;
            } else {
                $box.style.maxWidth = '';
            }

            let $digits = parseInt($in.digits, 10);
            if ($digits > 3) {
                $digits = 3;
            }
            if ($digits < 1) {
                $digits = 1;
            }

            if ($oldMode === 'data') {
                // We switch from a data box and then we need an 'end' box, creating one.
                const $id = $box.id.toString();
                const $topId = $id + '000'.substr(0, $digits);
                const $maxId = $id + '999'.substr(0, $digits);
                $box.setAttribute('box_mode', $in.box_mode);
                // $box.className = $in.box_mode;
                $box.setAttribute('top_id', $topId);
                $box.setAttribute('max_id', $maxId);
                const $row = '<div id="' + $topId + '" class="end">end</div>';
                $box.innerHTML = $row;
                $message = 'Changed box mode from "data" to "' + $in.box_mode + '"';
                $done = 'true';
                break leave;
            }

            $box.setAttribute('box_mode', $in.box_mode);

            // All children get their class name set to the parent box mode name.
            let $children = $box.childNodes;
            const $childCount = $children.length;
            for (let $i = 0; $i < $childCount; $i = $i + 1) {
                if ($children[$i].tagName === 'DIV') {
                    if ($children[$i].className !== 'end') {
                        $children[$i].className = $in.box_mode;
                    }
                }
            }

            $message = 'Changed box mode from "' + $oldMode + '" to "' + $in.box_mode + '"';
            $done = 'true';
        }

        if ($done === 'false') {
            // _Log($in.func, $message);
        }

        return {
            'answer': 'true',
            'message': $message,
            'done': $done,
            'box_id': $in.box_id,
            'box_mode': $in.box_mode,
            'digits': $in.digits
        };
    };

    /**
     * You can delete a box if it is not an “end”-box.
     * @version 2017-10-05
     * @since 2012-07-08
     * @author Peter Lembke
     * @param box_id
     */
    $functions.push('box_delete');
    const box_delete = function ($in)
    {
        const $default = {
            'box_id': '1'
        };
        $in = _Default($default, $in);

        return internal_Cmd({
            'func': 'BoxDelete',
            'box_id': $in.box_id
        });
    };

    /**
     * You can delete a box if it is not an “end”-box.
     * @version 2012-07-08
     * @since 2012-07-08
     * @author Peter Lembke
     * @param $in
     * @returns {*}
     */
    $functions.push('internal_BoxDelete');
    const internal_BoxDelete = function ($in)
    {
        let $message,
            $done = 'false';

        const $default = {
            'func': 'BoxDelete',
            'box_id': '1'
        };
        $in = _Default($default, $in);

        leave: {
            const $box = _GetNode($in.box_id);
            if (!$box) {
                $message = 'Can not find the box';
                break leave;
            }

            if ($box.className === 'end') {
                $message = 'will not delete end div';
                _Log({'func': $in.func, 'message': $message});
                break leave;
            }

            const $list = $box.parentNode;
            $list.removeChild($box);

            $message = 'Successfully deleted the box with id:' + $in.box_id;
            $done = 'true';
        }

        return {
            'answer': 'true',
            'message': $message,
            'done': $done
        };
    };

    /**
     * You can clear  a box if it is not an “end”-box.
     * @version 2017-10-05
     * @since 2012-07-08
     * @author Peter Lembke
     * @param box_id
     */
    $functions.push('box_clear');
    const box_clear = function ($in)
    {
        const $default = {
            'box_id': ''
        };
        $in = _Default($default, $in);

        return internal_Cmd({
            'func': 'BoxClear',
            'box_id': $in.box_id
        });
    };

    const _CssData = function() {
        return '{infohub_view.css}';
    };

    /**
     * Clear the contents of a data box, removes all except the end-box in side/under-boxes.
     * @version 2017-10-05
     * @since 2015-02-17
     * @author Peter Lembke
     * @param $in
     * @returns {*}
     */
    $functions.push('internal_BoxClear');
    const internal_BoxClear = function ($in)
    {
        let $message = '',
            $answer = 'false';

        const $default = {
            'box_id': ''
        };
        $in = _Default($default, $in);

        leave: {
            let $box = _GetNode($in.box_id);

            if (!$box) {
                $message = 'Was not able to get box_id:' + $in.box_id;
                break leave;
            }

            $in.box_alias = '';
            if ($box.hasAttribute('box_alias') === true) {
                $in.box_alias = $box.getAttribute('box_alias');
            }

            $in.box_mode = '';
            if ($box.hasAttribute('box_mode') === true) {
                $in.box_mode = $box.getAttribute('box_mode');
            }

            if ($in.box_mode === 'data') {
                $box.innerHTML = '';
                $answer = 'true';
                $message = 'Successfully cleared the data box with id:' + $in.box_id + ', box_alias:' + $in.box_alias;
                break leave;
            }

            if ($in.box_mode !== 'side' && $in.box_mode !== 'under') {
                $message = 'This box_id:' + $in.box_id + ', box_alias:' + $in.box_alias + ', are missing box_mode. Can not continue.';
                break leave;
            }

            // Remove all child boxes and leave when we find the end-box.
            while ($box.firstChild) {
                if ($box.firstChild.getAttribute('class') === 'end') {
                    break;
                }
                $box.removeChild($box.firstChild);
            }

            $answer = 'true';
            $message = 'Removed all child boxes from box_id:' + $in.box_id + ', box_alias:' + $in.box_alias;
        }

        return {
            'answer': $answer,
            'message': $message
        };
    };

    /**
     * Insert a new box before another box.
     * @version 2017-10-05
     * @since 2012-07-08
     * @author Peter Lembke
     */
    $functions.push('box_insert');
    const box_insert = function ($in)
    {
        const $default = {
            'parent_box_id': '', // Parent box id.
            'before_box_id': '', // Where to place your new box (optional)
            'box_position': 'last', // If before_box_id='' then we use box_position to find it.
            'box_mode': 'data',
            'box_data': '', // The data you want in your box
            'box_alias': 'a_new_box', // The alias you want on your new box
            'max_width': 0, // The maximum width on a box with mode=data
            'css_all': {} // 'plugin_name': 'css-data'
        };
        $in = _Default($default, $in);

        if (_Empty($in.css_all) === 'false') {
            internal_Cmd({
                'func': 'CssAll',
                'css_all': $in.css_all
            });
        }

        return internal_Cmd({
            'func': 'BoxInsert',
            'parent_box_id': $in.parent_box_id,
            'before_box_id': $in.before_box_id,
            'box_position': $in.box_position,
            'box_mode': $in.box_mode,
            'box_data': $in.box_data,
            'box_alias': $in.box_alias,
            'max_width': $in.max_width
        });
    };

    /**
     * Insert new boxes before another box and fill each box with data.
     * @version 2012-07-08
     * @since 2012-07-08
     * @author Peter Lembke
     * @param before_box_id
     * @param box_data
     */
    $functions.push('boxes_insert');
    const boxes_insert = function ($in)
    {
        const $default = {
            'parent_box_id': '', // Parent box id.
            'before_box_id': '', // Where to place your new box (optional)
            'box_position': 'last', // If before_box_id='' then we use box_position to find it.
            'box_mode': 'data',
            'boxes_data': {}, // An object with data for each box
            'max_width': 0, // The maximum width on a box with mode=data
            'css_all': {}
        };
        $in = _Default($default, $in);

        $in.func = 'BoxesInsert';

        let $response = internal_Cmd($in);

        return $response;
    };

    /**
     * Insert new boxes before another box and fill each box with data.
     * @version 2017-10-05
     * @since 2015-02-17
     * @author Peter Lembke
     * @param $in
     * @returns {*}
     */
    $functions.push('internal_BoxesInsert');
    const internal_BoxesInsert = function ($in)
    {
        const $default = {
            'parent_box_id': '', // Parent box id.
            'before_box_id': '', // Where to place your new box (optional)
            'box_position': 'last', // If before_box_id='' then we use box_position to find it.
            'box_mode': 'data',
            'boxes_data': {}, // An object with data for each box
            'max_width': 0, // The maximum width on a box with mode=data
            'css_all': {}
        };
        $in = _Default($default, $in);

        internal_Cmd({
            'func': 'CssAll',
            'css_all': $in.css_all
        });
        $in.css_all = {};

        let $response = {};

        for (let $key in $in.boxes_data)
        {
            if ($in.boxes_data.hasOwnProperty($key) === false) {
                continue;
            }

            $in.box_data = $in.boxes_data[$key];

            $response = internal_Cmd({
                'func': 'BoxInsert',
                'parent_box_id': $in.parent_box_id,
                'before_box_id': $in.before_box_id,
                'box_position': $in.box_position,
                'box_mode': $in.box_mode,
                'box_data': $in.box_data,
                'box_alias': $key,
                'max_width': $in.max_width
            });

            if ($response.answer === 'false') {
                _Log({'func': 'boxes_insert', 'message': $response.message});
            }
        }

        return $response;
    };


    /**
     * Insert new boxes, fully detailed boxes
     * @version 2018-04-15
     * @since 2018-04-15
     * @author Peter Lembke
     * @param $in
     */
    $functions.push('boxes_insert_detailed');
    const boxes_insert_detailed = function ($in)
    {
        const $default = {
            'items': [],
            'css_all': {}
        };
        $in = _Default($default, $in);

        internal_Cmd({
            'func': 'CssAll',
            'css_all': $in.css_all
        });
        $in.css_all = {};

        const $itemDefault = {
            'parent_box_id': '',
            'before_box_id': '', // Where to place your new box (optional)
            'box_position': 'last', // If before_box_id='' then we use box_position to find it.
            'box_mode': 'data',
            'box_data': '',
            'box_alias': '',
            'max_width': 0
        };

        const $itemsCount = $in.items.length;

        let $response;

        for (let $i=0; $i < $itemsCount; $i = $i + 1)
        {
            const $item = _Default($itemDefault, $in.items[$i]);

            $response = internal_Cmd({
                'func': 'BoxInsert',
                'parent_box_id': $item.parent_box_id,
                'before_box_id': $item.before_box_id,
                'box_position': $item.box_position,
                'box_mode': $item.box_mode,
                'box_data': $item.box_data,
                'box_alias': $item.box_alias,
                'max_width': $item.max_width
            });

            if ($response.answer === 'false') {
                _Log({'func': 'boxes_insert', 'message': $response.message});
            }
        }

        return $response;
    };

    /**
     * Creates link-tags, one for each plugin,
     * the link tag contain all CSS data for that plugin.
     * Used by: boxes_insert, box_insert
     * @param $in
     * @returns {{answer: string, message: string}}
     */
    $functions.push('internal_CssAll');
    const internal_CssAll = function ($in)
    {
        const $default = {
            'css_all': {}
        };
        $in = _Default($default, $in);

        for (let $key in $in.css_all)
        {
            if ($in.css_all.hasOwnProperty($key) === false) {
                continue;
            }

            internal_Cmd({
                'func': 'Css',
                'id': $key,
                'css_data': $in.css_all[$key]
            });

        }
        return {
            'answer': 'true',
            'message': 'Added all CSS data'
        };
    };

    /**
     * Create a new box
     * @param $in
     * @returns {*}
     */
    $functions.push('internal_BoxInsert');
    const internal_BoxInsert = function ($in)
    {
        let $default = {
            'func': 'BoxInsert',
            'parent_box_id': '', // Parent box id.
            'before_box_id': '', // Where to place your new box (optional)
            'box_position': 'last', // If before_box_id='' then we use box_position to find it.
            'box_mode': 'data',
            'box_data': '', // The data you want in your box
            'box_alias': 'a_new_box', // The alias you want on your new box
            'max_width': 0, // The maximum width on a box with mode=data
            'digits': '2',
            'variables': {} // Variables to insert into box_data
        };
        $in = _Default($default, $in);

        // Set all in parameters in the variables-parameter.
        $default = $in;
        $default.variables = {};
        $in.variables = _Merge($default, $in.variables);

        let $response = {},
            $answer = 'false',
            $message = '',
            $parentBoxMode = 'data';

        leave: {
            // Do we have the before box id ?
            if ($in.before_box_id === '')
            {
                $response = internal_Cmd({
                    'func': 'GetBeforeBoxId',
                    'parent_box_id': $in.parent_box_id,
                    'box_position': $in.box_position
                });
                if ($response.answer === 'false') {
                    $message = $response.message;
                    break leave;
                }
                $in.before_box_id = $response.before_box_id;
            }

            let $parent = _GetNode($in.parent_box_id);
            if (!$parent) {
                $message = 'parent_box_id="' + $in.parent_box_id + '" was not found in DOM';
                break leave;
            }

            if ($parent.hasAttribute('box_mode') === true) {
                $parentBoxMode = $parent.getAttribute('box_mode');
            }

            if ($parentBoxMode !== 'under' && $parentBoxMode !== 'side') {
                $message = 'Parent box must be in mode "side" or "under"';
                break leave;
            }

            if ($parent.hasAttribute('top_id') === false) {
                $message = 'Parent box lack attribute top_id';
                break leave;
            }

            if ($parent.hasAttribute('max_id') === false) {
                $message = 'Parent box lack attribute max_id';
                break leave;
            }

            const $parentTopId = parseInt($parent.getAttribute('top_id'), 10) + 1;
            const $parentMaxId = parseInt($parent.getAttribute('max_id'), 10);
            if ($parentTopId > $parentMaxId) {
                $message = 'Parent box do not accept more child boxes';
                break leave;
            }

            // Create the new div box
            let $newItem = document.createElement('DIV');
            $newItem.id = $parentTopId;

            let $list = _GetNode($parent.id);
            if (!$list) {
                $message = 'Could not find parent with ID:' + $parent.id;
                break leave;
            }

            const $beforeBox = _GetNode($in.before_box_id);
            if (!$beforeBox) {
                $message = 'Could not find beforeBox with ID:' + $in.before_box_id;
                break leave;
            }
            $list.insertBefore($newItem, $beforeBox);

            $newItem.className = $parentBoxMode;
            $newItem.setAttribute('box_mode', 'data');
            $newItem.setAttribute('box_alias', $in.box_alias);
            $newItem.setAttribute('name', $in.box_alias);

            // Perhaps we should change mode
            if ($in.box_mode === 'side' || $in.box_mode === 'under') {
                internal_Cmd({
                    'func': 'BoxMode',
                    'box_id': $parentTopId.toString(),
                    'box_mode': $in.box_mode,
                    'digits': $in.digits
                });
            }

            if ($in.box_mode === 'data')
            {
                if ($in.max_width > 0) {
                    $newItem.style.maxWidth = _GetMaxWidth($in.max_width);
                }

                if ($in.box_data !== '')
                {
                    let $anchor = '';

                    // If this is a data box and we have data then store the data in the new box
                    if ($in.box_alias !== '') {
                        $anchor = '<a name="' + $in.box_alias + '"></a>';
                    }

                    $in.variables.parent_box_id = $parent.id;
                    $in.variables.box_id = $parentTopId.toString();

                    $newItem.innerHTML = $anchor + _BoxData({
                        'box_data': $in.box_data,
                        'variables': $in.variables
                    });
                }
            }


            // Store the new box_id back to the parent and return it
            $parent.setAttribute('top_id', $parentTopId.toString());
            $in.box_id = $parentTopId.toString();

            $answer = 'true';
            $message = 'Box have been inserted';
        }

        if ($answer === 'false') {
            _Log({'func': $in.func, 'message': $message});
        }

        return {
            'answer': $answer,
            'message': $message,
            'box_id': $in.box_id
        };
    };

    /**
     * Show “1” or hide “0” a box and its contents.
     * You can not change the view on an “end”-div. They will remain hidden.
     * @version 2012-07-08
     * @since 2012-07-08
     * @author Peter Lembke
     * @param box_id
     * @param box_view
     */
    $functions.push('box_view');
    const box_view = function ($in)
    {
        const $default = {
            'box_id': '1',
            'box_view': '1'
        };
        $in = _Default($default, $in);

        return internal_Cmd({
            'func': 'BoxView',
            'box_id': $in.box_id,
            'box_view': $in.box_view
        });
    };

    /**
     * Show “1” or hide “0” a box and its contents.
     * You can not change the view on an “end”-div. They will remain hidden.
     * @version 2017-10-05
     * @since 2012-07-08
     * @author Peter Lembke
     * @param box_id
     * @param box_view
     */
    $functions.push('internal_BoxView');
    const internal_BoxView = function ($in)
    {
        const $default = {
            'box_id': '0',
            'box_view': '1'
        };
        $in = _Default($default, $in);

        let $answer = 'false',
            $message;

        leave: {

            let $style = '', // Leave blank
                $styleText = 'show';

            if ($in.box_view === '0') {
                $style = 'none';
                $styleText = 'hide';
            }

            let $box = _GetNode($in.box_id);
            if (!$box) {
                $message = 'Could not find the box with id:' + $in.box_id;
                break leave;
            }

            if ($box.className === 'end') {
                $message = 'will not change view on end div';
                break leave;
            }

            $box.style.display = $style;
            $message = 'Box_id:' + $in.box_id + ' was set to ' + $styleText;
            $answer = 'true';
        }

        return {
            'answer': $answer,
            'message': $message,
            'box_id': $in.box_id,
            'box_view': $in.box_view
        };
    };

    /**
     * You can set a lot of boxes to hide/show.
     * Show “1” or hide “0” a box and its contents.
     * @version 2017-10-05
     * @since 2017-10-05
     * @author Peter Lembke
     * @param box_id
     * @param box_view "1"=visible or "0"=hidden
     * @param siblings_box_view "1"=visible or "0"=hidden, Nothing = opposite to box_view
     */
    $functions.push('siblings_box_view');
    const siblings_box_view = function ($in)
    {
        const $default = {
            'box_id': '1', // Can be the box_id or the full friendly name box id
            'box_view': '1', // 0 = hide, 1= show
            'siblings_box_view': '' // All the siblings to box_id can be set to 0 or 1 or nothing.
        };
        $in = _Default($default, $in);

        return internal_Cmd({
            'func': 'SiblingsBoxView',
            'box_id': $in.box_id,
            'box_view': $in.box_view,
            'siblings_box_view': $in.siblings_box_view
        });

    };

    /**
     * Give you an array with all child Ids to that box_id.
     * Including the last Id that is always the “end”-box.
     * You can only get a list from boxes that have box_mode = “side” or “under”.
     * @param $in
     * @version 2017-10-05
     * @since 2017-10-05
     * @author Peter Lembke
     */
    $functions.push('internal_SiblingsBoxView');
    const internal_SiblingsBoxView = function ($in)
    {
        const $default = {
            'func': 'SiblingsBoxView',
            'box_id': '1',
            'box_view': '1',
            'siblings_box_view': ''
        };
        $in = _Default($default, $in);

        $in.box_id = _GetBoxId($in.box_id);

        let $answer = 'false', $message,
            $response, $box, $boxId, $boxView, $alias;

        if ($in.box_view !== '0') {
            $in.box_view = '1';
        }

        if ($in.siblings_box_view === '') {
            $in.siblings_box_view = '1';
            if ($in.box_view === '1') {
                $in.siblings_box_view = '0';
            }
        }

        if ($in.siblings_box_view !== '0') {
            $in.siblings_box_view = '1';
        }

        leave: {
            $box = _GetNode($in.box_id);
            if (!$box) {
                $message = 'Can not find the box';
                break leave;
            }
            $in.parent_box_id = $box.parentNode.id;

            $response = internal_Cmd({
                'func': 'BoxList',
                'box_id': $in.parent_box_id
            });
            if ($response.answer === 'false') {
                $message = $response.message;
                break leave;
            }

            for ($alias in $response.index)
            {
                if ($response.index.hasOwnProperty($alias) === false) {
                    continue;
                }

                $boxId = $response.index[$alias];
                $boxView = $in.siblings_box_view;
                if ($boxId === $in.box_id) {
                    $boxView = $in.box_view;
                }

                internal_Cmd({
                    'func': 'BoxView',
                    'box_id': $boxId,
                    'box_view': $boxView
                });
            }

            $answer = 'true';
            $message = 'Done. Handled all siblings';
        }

        return {
            'answer': $answer,
            'message': $message,
            'box_view': $in.box_view,
            'siblings_box_view': $in.siblings_box_view,
            'parent_box_id': $in.parent_box_id
        };
    };

    /**
     * Give you an array with all child Ids to that box.
     * Including the last Id that is always the “end”-box.
     * You can only get a list from boxes that have box_mode = “side” or “under”.
     * @param $in
     * @version 2017-10-05
     * @since 2012-07-08
     * @author Peter Lembke
     */
    $functions.push('box_list');
    const box_list = function ($in)
    {
        const $default = {
            'box_id': '0'
        };
        $in = _Default($default, $in);

        return internal_Cmd({
            'func': 'BoxList',
            'box_id': $in.box_id
        });
    };

    /**
     * Give you an array with all child Ids to that box_id.
     * Including the last Id that is always the “end”-box.
     * You can only get a list from boxes that have box_mode = “side” or “under”.
     * @param $in
     * @version 2014-01-05
     * @since 2012-07-08
     * @author Peter Lembke
     */
    $functions.push('internal_BoxList');
    const internal_BoxList = function ($in)
    {
        const $default = {
            'func': 'BoxList',
            'box_id': '0'
        };
        $in = _Default($default, $in);

        let $answer = 'false', $message = '', $boxMode, $box, $alias, $index = {};

        leave: {

            $box = _GetNode($in.box_id);
            if (!$box) {
                $message = 'Can not find box with id:' + $in.box_id;
                break leave;
            }

            if ($box.hasAttribute('box_mode') !== true) {
                $message = 'Can not get list from box without attribute "box_mode"';
                break leave;
            }

            $boxMode = $box.getAttribute('box_mode');
            if ($boxMode !== 'side' && $boxMode !== 'under') {
                $message = 'Only box_mode "side" or "under" can have a list of sub boxes';
                break leave;
            }

            let $children = $box.childNodes;
            for (let $i = 0; $i < $children.length; $i = $i + 1) {
                if ($children[$i].tagName === 'DIV') {
                    $alias = $children[$i].getAttribute('box_alias');
                    if (_Empty($alias) === 'false') {
                        $index[$alias] = $children[$i].id;
                    }
                }
            }

            $answer = 'true';
            $message = 'Here is an index with all child aliases and their IDs';
        }

        if ($answer === 'false') {
            _Log({'func': $in.func, 'message': $message});
        }

        return {
            'answer': $answer,
            'message': $message,
            'box_id': $in.box_id,
            'index': $index
        };
    };

    /**
     * Store data in a data box.
     * You can only save data in boxes that have box_mode=”data”.
     * @version 2014-01-05
     * @since 2012-07-08
     * @author Peter Lembke
     * @param box_id
     * @param box_data
     */
    $functions.push('box_data');
    const box_data = function ($in)
    {
        const $default = {
            'box_id': '0',
            'box_data': '',
            'max_width': 0,
            'variables': {},
            'mode': 'substitute', // add_first / add_last / substitute
            'throw_error_if_box_is_missing': 'true'
        };
        $in = _Default($default, $in);

        return internal_Cmd({
            'func': 'BoxData',
            'box_id': $in.box_id,
            'box_data': $in.box_data,
            'max_width': $in.max_width,
            'variables': $in.variables,
            'mode': $in.mode,
            'throw_error_if_box_is_missing': $in.throw_error_if_box_is_missing
        });
    };

    /**
     * Save data in a box.
     * You can only save data in boxes that have box_mode=”data”.
     * @version 2012-07-08
     * @since 2012-07-08
     * @author Peter Lembke
     * @param box_id
     * @param box_data
     */
    $functions.push('internal_BoxData');
    const internal_BoxData = function ($in)
    {
        const $default = {
            'box_id': '0',
            'box_data': '',
            'max_width': 0,
            'variables': {},
            'mode': 'substitute', // add_first / add_last / substitute
            'throw_error_if_box_is_missing': 'true'
        };
        $in = _Default($default, $in);

        $in.box_id = _GetBoxId($in.box_id);

        let $answer = 'false',
            $message,
            $boxAlias = '',
            $anchor = '',
            $box,
            $boxData = '',
            $boxMode = '',
            $boxFound = 'false';

        leave: {
            $box = _GetNode($in.box_id);
            if (!$box) {
                $message = 'Can not find box with id:' + $in.box_id;

                if ($in.throw_error_if_box_is_missing === 'false') {
                    $answer = 'true';
                }

                break leave;
            }
            $boxFound = 'true';

            $boxMode = $box.getAttribute('box_mode');
            if (_Empty($boxMode) === 'false' && $boxMode !== 'data') {

                internal_Cmd({
                    'func': 'BoxMode',
                    'box_id': $in.box_id,
                    'box_mode': 'data'
                });

                // $message = 'Only div box in box_mode="data" can store data';
                // break leave;
            }

            if ($box.innerHTML === '') {
                $boxAlias = $box.getAttribute('box_alias');
                if ($boxAlias !== '') {
                    $anchor = '<a name="' + $boxAlias + '"></a>';
                    $box.innerHTML = $anchor;
                }
            }

            if (_IsSet($in.variables.parent_box_id) === 'false') {
                $in.variables.parent_box_id = $box.parentNode.id;
            }
            if (_IsSet($in.variables.box_id) === 'false') {
                $in.variables.box_id = $in.box_id;
            }

            $boxData = _BoxData({
                'box_data': $in.box_data,
                'variables': $in.variables
            });

            if ($in.mode === 'substitute') {
                $box.innerHTML = $anchor + $boxData;
            }

            if ($in.mode === 'add_last') {
                $box.innerHTML = $box.innerHTML + $boxData;
            }

            if ($in.mode === 'add_first') {
                $box.innerHTML = $box.innerHTML.replace($anchor, '');
                $box.innerHTML = $anchor + $boxData + $box.innerHTML;
            }

            if ($in.max_width > 0) {
                $box.style.maxWidth = _GetMaxWidth($in.max_width);
            }

            $answer = 'true';
            $message = 'Saved data to box with id:' + $in.box_id;
        }

        return {
            'answer': $answer,
            'message': $message,
            'box_found': $boxFound
        };
    };

    /**
     * Copy content from one box to another.
     * You can only copy data between boxes that have box_mode = “data”
     * @version 2012-07-08
     * @since 2012-07-08
     * @author Peter Lembke
     * @param from_box_id
     * @param to_box_id
     */
    $functions.push('box_copy');
    const box_copy = function ($in)
    {
        const $default = {
            'from_box_id': '1',
            'to_box_id': '2'
        };
        $in = _Default($default, $in);

        return internal_Cmd({
            'func': 'BoxCopy',
            'from_box_id': $in.from_box_id,
            'to_box_id': $in.to_box_id
        });
    };

    /**
     * Copy content from one box to another.
     * You can only copy data between boxes that have box_mode = “data”
     * @version 2012-07-08
     * @since 2012-07-08
     * @author Peter Lembke
     * @param from_box_id
     * @param to_box_id
     */
    $functions.push('internal_BoxCopy');
    const internal_BoxCopy = function ($in)
    {
        const $default = {
            'func': 'BoxCopy',
            'from_box_id': '1',
            'to_box_id': '2'
        };
        $in = _Default($default, $in);

        let $answer = 'false',
            $boxFrom,
            $boxTo,
            $message = '';

        leave: {
            $boxFrom = _GetNode($in.from_box_id);
            if (!$boxFrom) {
                $message = 'Can not find box with from_box_id=' + $in.from_box_id;
                break leave;
            }

            $boxTo = _GetNode($in.to_box_id);
            if (!$boxTo) {
                $message = 'Can not find box with to_box_id=' + $in.to_box_id;
                break leave;
            }

            if ($boxFrom.getAttribute('box_mode') !== 'data') {
                $message = 'Only copy from box with box_mode=data';
                break leave;
            }

            if ($boxTo.getAttribute('box_mode') !== 'data') {
                $message = 'Only copy to box with box_mode=data';
                break leave;
            }

            $boxTo.innerHTML = $boxFrom.innerHTML;

            $answer = 'true';
            $message = 'Copied from box_id:' + $in.from_box_id + ' to box_id:' + $in.to_box_id;
        }

        if ($answer === 'false') {
            _Log({'func': $in.func, 'message': $message});
        }

        return {
            'answer': $answer,
            'message': $message
        };
    };

    /**
     * Give parent_box_id and where among the children you want your box
     * first, middle, last
     * The hidden stop-box must always be last in list. That is why you only can place a box before.
     * You will get a before_box_id
     * @version 2017-10-05
     * @since 2013-12-03
     * @author Peter Lembke
     * @param $in
     */
    $functions.push('internal_GetBeforeBoxId');
    const internal_GetBeforeBoxId = function ($in)
    {
        const $default = {
            'func': 'GetBeforeBoxId',
            'parent_box_id': '',
            'box_position': 'first'
        };
        $in = _Default($default, $in);

        let $answer = 'false', $message = '',
            $children, $lastNr, $beforeBoxId = 0, $nr = 0, $parentBox;

        leave: {
            $parentBox = _GetNode($in.parent_box_id);
            if (!$parentBox) {
                $message = 'Can not find parent box: ' + $in.parent_box_id;
                break leave;
            }

            $children = $parentBox.childNodes;
            $lastNr = $children.length - 1;

            switch ($in.box_position) {
                case 'first':
                    $beforeBoxId = $children[0].id;
                    break;
                case 'middle':
                    $nr = Math.floor($lastNr / 2); // 0=0,1=0, 2=1, 3=1, 4=2, 5=2, 6=3, 7=3, 8=4
                    $beforeBoxId = $children[$nr].id;
                    break;
                case 'last':
                    $beforeBoxId = $children[$lastNr].id;
                    break;
                default:
                    break;
            }
            if ($beforeBoxId === 0) {
                $message = 'You must tell where you want your box: first, middle, last';
                break leave;
            }

            $answer = 'true';
            $message = 'Place your box   before box id:' + $beforeBoxId;
        }

        return {
            'answer': $answer,
            'message': $message,
            'before_box_id': $beforeBoxId
        };
    };

    /**
     * Creates structure boxes in main
     * @version 2017-10-05
     * @since 2014-04-16
     * @author Peter Lembke
     */
    $functions.push('modify_class');
    const modify_class = function ($in)
    {
        const $default = {
            'id': '', // ID of the box
            'class': 'yes', // The class name
            'cmd': 'add' // 'add' or 'remove' or 'switch' between add/remove
        };
        $in = _Default($default, $in);

        return internal_Cmd({
            'func': 'ModifyClass',
            'id': $in.id,
            'class': $in.class,
            'cmd': $in.cmd
        });
    };

    /**
     * Add or remove or switch one class name from one DOM object
     * @version 2013-12-13
     * @since 2013-12-13
     * @author Peter Lembke
     * @param $in
     */
    $functions.push('internal_ModifyClass');
    const internal_ModifyClass = function ($in)
    {
        const $default = {
            'id': '', // ID of the object to modify
            'class': 'yes', // The class name
            'cmd': 'add' // 'add' or 'remove' or 'switch'
        };
        $in = _Default($default, $in);

        let $answer = 'false',
            $message = '';

        leave: {
            let $boxNode = _GetNode($in.id);
            if ($boxNode === false) {
                $message = 'Box id:"' + $in.id + '" was not found';
                break leave;
            }

            let $names = $boxNode.className.split(' ');
            let $index = $names.indexOf($in.class);
            if ($in.cmd === 'add') {
                $message = 'added';
                if ($index > -1) {
                    $answer = 'true';
                    $message = 'Class "' + $in.class + '" was already ' + $message;
                    break leave;
                }
                $names.push($in.class);
            }

            if ($in.cmd === 'remove') {
                $message = 'removed';
                if ($index === -1) {
                    $answer = 'true';
                    $message = 'Class "' + $in.class + '" was already ' + $message;
                    break leave;
                }
                $names.splice($index, 1);
            }

            if ($in.cmd === 'switch') {
                if ($index > -1) {
                    $names.splice($index, 1); // Remove class
                    $message = 'switched to removed';
                } else {
                    $names.push($in.class); // Add class
                    $message = 'switched to added';
                }
            }

            $boxNode.className = $names.join(' ');
            $answer = 'true';
            $message = 'Class "' + $in.class + '" was ' + $message;
        }

        return {
            'answer': $answer,
            'message': $message,
            'id': $in.id,
            'class': $in.class,
            'cmd': $in.cmd
        };
    };

    /**
     * Adds a link tag in the page head,
     * The link contain all CSS needed for the plugin mentioned in 'id'
     * Used by: CssAll
     * @since 2017-10-05
     * @param $in
     */
    $functions.push('internal_Css');
    const internal_Css = function ($in)
    {
        const $default = {
            'id': '', // plugin name: example infohub_render_video
            'css_data': '' // The css data encoded as base64 text
        };
        $in = _Default($default, $in);

        let $message,
            $addedLink = 'false';

        leave: {
            let $linkElements = document.getElementsByTagName("link");
            let $link = $linkElements.namedItem($in.id);

            if ($link !== null) {
                $message = 'There already exist a link with that id';
                break leave;
            }

            if ($in.css_data === '') {
                $message = 'You have not provided any CSS data to insert';
                break leave;
            }

            if ($in.css_data[0] === '{') {
                $message = 'We only have the placeholder, no real css data';
                break leave;
            }

            $link = document.createElement('link');
            $link.rel = 'stylesheet';
            $link.type = 'text/css';
            $link.id = $in.id;
            $link.href = 'data:text/css;base64,' + $in.css_data;
            document.getElementsByTagName( 'head' )[0].appendChild($link);

            $message = 'Link is added';
            $addedLink = 'true';
        }

        return {
            'answer': 'true',
            'message': $message,
            'added_link': $addedLink
        };
    };

    /**
     * Adds or updates the favicon that you see on the browser tab for this page
     * The image data must be a PNG image encoded as BASE64 text
     * @version 2017-10-07
     * @since 2017-10-07
     * @author Peter Lembke
     */
    $functions.push('set_favicon');
    const set_favicon = function ($in)
    {
        const $default = {
            'image_data': '' // The PNG image data encoded as base64 text
        };
        $in = _Default($default, $in);

        return internal_Cmd({
            'func': 'SetFavicon',
            'image_data': $in.image_data
        });
    };

    /**
     * Sets the favicon
     * @since 2017-10-05
     * @param $in
     */
    $functions.push('internal_SetFavicon');
    const internal_SetFavicon = function ($in)
    {
        const $default = {
            'image_data': '' // The image data encoded as base64 text
        };
        $in = _Default($default, $in);

        let $message,
            $linkInserted = 'false',
            $faviconSet = 'false';

        leave: {
            if ($in.image_data === '') {
                $message = 'No image data to use as favicon';
                break leave;
            }

            let $linkElements = document.getElementsByTagName("link");
            let $link = $linkElements.namedItem('favicon');
            if ($link === null) {
                $link = document.createElement('link');
                $linkInserted = 'true';
            }

            $link.rel = 'icon';
            $link.type = 'image/png';
            $link.id = 'favicon';
            $link.href = 'data:image/png;base64,' + $in.image_data;

            $message = 'favicon was updated';

            if ($linkInserted === 'true') {
                document.getElementsByTagName( 'head' )[0].appendChild($link);
                $message = 'favicon was added';
            }

            $faviconSet = 'true';
        }

        return {
            'answer': 'true',
            'message': $message,
            'link_inserted': $linkInserted,
            'favicon_set': $faviconSet
        };
    };

    /**
     * Set value or innerHTML on an object
     * @version 2017-10-07
     * @since 2017-10-07
     * @author Peter Lembke
     */
    $functions.push('set_text');
    const set_text = function ($in)
    {
        const $default = {
            'id': '', // Id for an object
            'text': '' // Text you want to insert into the object
        };
        $in = _Default($default, $in);

        return internal_Cmd({
            'func': 'SetText',
            'id': $in.id,
            'text': $in.text
        });
    };

    /**
     * Set value or innerHTML on an object
     * @since 2017-10-05
     * @param $in
     * @returns {string}
     */
    $functions.push('internal_SetText');
    const internal_SetText = function ($in)
    {
        const $default = {
            'id': '', // Id for an object
            'text': '' // Text you want to insert into the object
        };
        $in = _Default($default, $in);

        let $updated = 'false',
            $message,
            $type = '';

        leave: {
            let $element = _GetNode($in.id);
            if (!$element) {
                $message = 'Can not find the id:' + $in.id;
                break leave;
            }

            const $nodeName = $element.nodeName.toLowerCase();

            if ($nodeName === 'select') {
                $element.innerHTML = $in.text;
                $message = 'Updated the inner HTML on this object';
                $updated = 'true';
                break leave;
            }

            if ($nodeName === 'textarea') {
                $element.value = $in.text;
                $message = 'Updated the value on this textarea';
                $updated = 'true';
                break leave;
            }

            if ($nodeName !== 'input' || typeof $element.type === 'undefined') {
                $element.innerText = $in.text;
                $message = 'Updated the inner text on this object';
                $updated = 'true';
                break leave;
            }

            $type = $element.type; // Only input tags have a type

            const $useValue = ['text', 'textarea', 'button', 'submit', 'reset'];
            if ($useValue.indexOf($type) >= 0) {
                $element.value = $in.text;
                $message = 'Updated the value on this input object';
                $updated = 'true';
                break leave;
            }

            $message = 'This input type have no visible text to update. If this object has a label then update that instead';

        }

        return {
            'answer': 'true',
            'message': $message,
            'type': $type,
            'updated': $updated
        };
    };

    /**
     * Get value or innerHTML from an object
     * @version 2017-10-07
     * @since 2017-10-07
     * @author Peter Lembke
     */
    $functions.push('get_text');
    const get_text = function ($in)
    {
        const $default = {
            'id': '' // Id for an object
        };
        $in = _Default($default, $in);

        return internal_Cmd({
            'func': 'GetText',
            'id': $in.id
        });
    };

    /**
     * Get the content of object id
     * @param $in
     * @returns {string}
     */
    $functions.push('internal_GetText');
    const internal_GetText = function ($in)
    {
        const $default = {
            'id': '' // Id for an object
        };
        $in = _Default($default, $in);

        let $text = '',
            $message,
            $type = '';

        leave: {
            let $element = _GetNode($in.id);
            if (!$element) {
                $message = 'Can not find the id:' + $in.id;
                break leave;
            }

            const $nodeName = $element.nodeName.toLowerCase();

            if (($nodeName !== 'input' && $nodeName !== 'textarea') || typeof $element.type === 'undefined') {
                $text = $element.innerText;
                $message = 'Got the HTML from this object';
                break leave;
            }

            $type = $element.type; // Only input tags have a type

            let $useValue = ['text', 'button', 'submit', 'reset'];
            if ($useValue.indexOf($type) >= 0) {
                $text = $element.value;
                $message = 'Got the value from this input object';
                break leave;
            }

            $useValue = ['textarea'];
            if ($useValue.indexOf($type) >= 0) {
                $text = $element.innerHTML;
                $text = _Replace('<br>', "\n", $text);
                $message = 'Got the value from this input object';
                break leave;
            }

            $message = 'This input type have no visible text to get. If this object has a label then the text from there instead';

        }

        return {
            'answer': 'true',
            'message': $message,
            'type': $type,
            'text': $text
        };
    };

    /**
     * Get html from an object
     * @version 2019-06-08
     * @since 2019-06-08
     * @author Peter Lembke
     */
    $functions.push('get_html');
    const get_html = function ($in)
    {
        const $default = {
            'id': '' // Id for an object
        };
        $in = _Default($default, $in);

        return internal_Cmd({
            'func': 'GetHtml',
            'id': $in.id
        });
    };

    /**
     * Get the content of object id
     * @param $in
     * @returns {string}
     */
    $functions.push('internal_GetHtml');
    const internal_GetHtml = function ($in)
    {
        const $default = {
            'id': '' // Id for an object
        };

        $in = _Default($default, $in);

        let $html = '',
            $message;

        leave: {

            const $element = _GetNode($in.id);

            if (!$element) {
                $message = 'Can not find the id:' + $in.id;
                break leave;
            }

            $html = $element.innerHTML;
            $message = 'Got the HTML from this object';
        }

        return {
            'answer': 'true',
            'message': $message,
            'html': $html
        };
    };

    /**
     * Set the font size for the whole document
     * @version 2018-08-23
     * @since 2018-08-23
     * @author Peter Lembke
     */
    $functions.push('zoom_level');
    const zoom_level = function ($in)
    {
        const $default = {
            'current_zoom_level': 0,
            'zoom_level': 0,
            'multiplier': 0.0
        };
        $in = _Default($default, $in);

        return internal_Cmd({
            'func': 'ZoomLevel',
            'current_zoom_level': $in.current_zoom_level,
            'zoom_level': $in.zoom_level,
            'multiplier': $in.multiplier
        });
    };

    /**
     * Set the zoom level for the whole page. Content will wrap nicely.
     * @version 2019-10-19
     * @since 2018-08-23
     * @author Peter Lembke
     * @param $in
     * @returns {string}
     */
    $functions.push('internal_ZoomLevel');
    const internal_ZoomLevel = function ($in)
    {
        let $zoomLevel = 100, // Percent
            $currentZoomLevel = 100;

        const $default = {
            'current_zoom_level': 0, // Use when you know the current zoom level
            'zoom_level': 0, // Use when you want to set a pre defined zoom level
            'multiplier': 0.0 // Use when you want to increase (1.1) or decrease (0.9) the current zoom level
        };
        $in = _Default($default, $in);

        if ($in.current_zoom_level > 0) {
            $currentZoomLevel = $in.current_zoom_level;
        }

        const $currentBodyZoomLevel = parseInt(document.body.style.zoom);
        if ($currentBodyZoomLevel > 0) {
            $currentZoomLevel = $currentBodyZoomLevel;
        }

        if (_Empty($in.multiplier) === 'false') { // Increase / Decrease zoom for the whole document
            $zoomLevel = $currentZoomLevel * $in.multiplier;
        }

        if ($in.zoom_level > 0 ) {
            $zoomLevel = $in.zoom_level;
        }

        $zoomLevel = Math.round($zoomLevel);

        if ($zoomLevel < 50) { $zoomLevel = 50; } // 100% is normal
        if ($zoomLevel > 300) { $zoomLevel = 300; } // 300% is big

        document.body.style.zoom = $zoomLevel + '%'; // Set zoom level in percent

        return {
            'answer': 'true',
            'message': 'Document zoom level is set',
            'new_zoom_level': $zoomLevel
        };
    };

    /**
     * Set the font properties for the whole document
     * @version 2019-02-22
     * @since 2019-02-22
     * @author Peter Lembke
     */
    $functions.push('style');
    const style = function ($in)
    {
        const $default = {
            'entity': 'body',
            'data': '',
            'value': '',
            'suffix': ''
        };
        $in = _Default($default, $in);

        return internal_Cmd({
            'func': 'Style',
            'entity': $in.entity,
            'data': $in.data,
            'value': $in.value,
            'suffix': $in.suffix
        });
    };

    /**
     * Set the font properties for the whole page.
     * @version 2019-02-22
     * @since 2019-02-22
     * @author Peter Lembke
     * @param $in
     * @returns {string}
     */
    $functions.push('internal_Style');
    const internal_Style = function ($in)
    {
        const $default = {
            'entity': '',
            'data': '',
            'value': '',
            'suffix': ''
        };
        $in = _Default($default, $in);

        document[$in.entity].style[$in.data] = $in.value + $in.suffix;

        return {
            'answer': 'true',
            'message': 'Entity style set'
        };
    };

    /**
     * Get 'true' or 'false' if object with id is visible.
     * @version 2017-10-07
     * @since 2017-10-07
     * @author Peter Lembke
     */
    $functions.push('is_visible');
    const is_visible = function ($in)
    {
        const $default = {
            'id': '' // Id for an object
        };
        $in = _Default($default, $in);

        return internal_Cmd({
            'func': 'IsVisible',
            'id': $in.id
        });
    };

    /**
     * Get 'true' or 'false' if object with id is visible.
     * If you want to show/hide a box then use box_view instead.
     * @param $in
     * @returns {string}
     */
    $functions.push('internal_IsVisible');
    const internal_IsVisible = function ($in)
    {
        const $default = {
            'id': ''
        };
        $in = _Default($default, $in);

        let $message = 'Object is found to be hidden',
            $visible = 'false';

        leave: {
            let $element = _GetNode($in.id);
            if (!$element) {
                $message = 'Can not find object with id:' + $in.id;
                break leave;
            }

            const $data = $element.style.display.toLowerCase();

            if ($data !== 'none') {
                $message = 'Object is found to be visible';
                $visible = 'true';
            }

        }

        return {
            'answer': 'true',
            'message': $message,
            'id': $in.id,
            'visible': $visible
        };
    };

    /**
     * Set visibility on an object with 'true' or 'false' or 'switch'
     * @version 2017-10-07
     * @since 2017-10-07
     * @author Peter Lembke
     */
    $functions.push('set_visible');
    const set_visible = function ($in)
    {
        const $default = {
            'id': '', // Id for an object
            'set_visible': '' // 'true', 'false', 'switch', empty string
        };
        $in = _Default($default, $in);

        return internal_Cmd({
            'func': 'SetVisible',
            'id': $in.id,
            'set_visible': $in.set_visible
        });
    };

    /**
     * Show or hide any object
     * If you want to show/hide a box then use box_view instead.
     * switch = switch between visible and invisible
     * @param $in
     * @returns {string}
     */
    $functions.push('internal_SetVisible');
    const internal_SetVisible = function ($in)
    {
        const $default = {
            'id': '',
            'set_visible': '', // 'true', 'false', 'switch'
            'block_type_visible': 'block' // block, inline-block, flex, inline-flex or leave blank
        };
        $in = _Default($default, $in);

        let $message, $data, $isVisible = 'unknown';

        leave: {
            let $element = _GetNode($in.id);
            if (!$element) {
                $message = 'Can not find object with id:' + $in.id;
                break leave;
            }

            if ($element.className === 'side') {
                $in.block_type_visible = 'inline-block'; // See infohub_view.css
            }

            if ($in.set_visible === 'switch')
            {
                $data = 'none';
                $message = 'Object is now hidden';
                $isVisible = 'false';

                const $currentValue = $element.style.display;

                if ($currentValue === 'none') {
                    $data = $in.block_type_visible;
                    $message = 'Object is now visible';
                    $isVisible = 'true';
                }

                $element.style.display = $data;
                break leave;
            }

            if ($in.set_visible === 'false') {
                $data = 'none';
                $message = 'Object is now hidden';
                $isVisible = 'false';
                $element.style.display = $data;
                break leave;
            }

            if ($in.set_visible === 'true') {
                $data = $in.block_type_visible;
                $message = 'Object is now visible';
                $isVisible = 'true';
                $element.style.display = $data;
                break leave;
            }

            if ($in.set_visible === '') {
                $message = 'Object will have no specific style display set.';
                $isVisible = 'unknown';
                break leave;
            }

            $message = 'Please set_visible to either true, false or switch';
        }

        return {
            'answer': 'true',
            'message': $message,
            'id': $in.id,
            'is_visible': $isVisible
        };
    };

    /**
     * Get 'true' or 'false' if object with id is enabled.
     * @version 2017-10-07
     * @since 2017-10-07
     * @author Peter Lembke
     */
    $functions.push('is_enabled');
    const is_enabled = function ($in)
    {
        const $default = {
            'id': '' // Id for an object
        };
        $in = _Default($default, $in);

        return internal_Cmd({
            'func': 'IsEnabled',
            'id': $in.id
        });
    };

    /**
     * Check if an object is enabled or disabled
     * @param $in
     * @returns {*}
     */
    $functions.push('internal_IsEnabled');
    const internal_IsEnabled = function ($in)
    {
        const $default = {
            'id': ''
        };
        $in = _Default($default, $in);

        let $message = '',
            $enabled = 'true';

        leave: {
            let $element = _GetNode($in.id);
            if (!$element) {
                $message = 'Can not find object with id:' + $in.id;
                break leave;
            }

            $message = 'Object is enabled';

            if ($element.disabled === true) {
                $enabled = 'false';
                $message = 'Object is disabled';
            }
        }

        return {
            'answer': 'true',
            'message': $message,
            'id': $in.id,
            'is_enabled': $enabled
        };
    };

    /**
     * Set if an object should be enabled with 'true' or 'false' or 'switch'
     * @version 2017-10-07
     * @since 2017-10-07
     * @author Peter Lembke
     */
    $functions.push('set_enabled');
    const set_enabled = function ($in)
    {
        const $default = {
            'id': '', // Id for an object
            'set_enabled': 'true' // 'true', 'false', 'switch'
        };
        $in = _Default($default, $in);

        return internal_Cmd({
            'func': 'SetEnabled',
            'id': $in.id,
            'set_enabled': $in.set_enabled
        });
    };

    /**
     * Set object as enabled or disabled
     * If a button is disabled then it is still visible but can not be used.
     * switch = switch between enabled and disabled.
     * @param $in
     * @returns {boolean}
     */
    $functions.push('internal_SetEnabled');
    const internal_SetEnabled = function ($in)
    {
        const $default = {
            'id': '',
            'set_enabled': 'true' // 'true', 'false', 'switch'
        };
        $in = _Default($default, $in);

        let $message,
            $isEnabled = 'unknown';

        leave: {
            let $element = _GetNode($in.id);
            if (!$element) {
                $message = 'Can not find object with id:' + $in.id;
                break leave;
            }

            if ($in.set_enabled === 'switch')
            {
                let $setDisabled = true;
                $message = 'Object is now disabled';
                $isEnabled = 'false';

                const $currentlyDisabled = $element.disabled;
                if ($currentlyDisabled === true) {
                    $setDisabled = false;
                    $message = 'Object is now enabled';
                    $isEnabled = 'true';
                }

                $element.disabled = $setDisabled;
                break leave;
            }

            if ($in.set_enabled === 'false') {
                $message = 'Object is now disabled';
                $isEnabled = 'false';
                $element.disabled = true;
                break leave;
            }

            if ($in.set_enabled === 'true') {
                $message = 'Object is now enabled';
                $isEnabled = 'true';
                $element.disabled = false;
                break leave;
            }

            $message = 'Please set_visible to either "true", "false" or "switch"';

        }

        return {
            'answer': 'true',
            'message': $message,
            'id': $in.id,
            'is_enabled': $isEnabled
        };
    };

    $functions.push('toggle');
    /**
     * Switch visibility for an object
     * Use "set_visible" instead if you can. It can do the same thing.
     * Used by infohub_render_link when creating toggle links.
     * @param $in
     * @returns {{answer: string, message: string}}
     */
    const toggle = function ($in)
    {
        const $default = {
            'id': ''
        };
        $in = _Default($default, $in);

        return internal_Cmd({
            'func': 'SetVisible',
            'id': $in.id,
            'set_visible': 'switch'
        });

    };

    /**
     * mass_update by giving an array with instructions.
     * @param $in
     */
    $functions.push('mass_update');
    const mass_update = function ($in)
    {
        const $default = {
            'do': []
        };
        $in = _Default($default, $in);

        let $responses = [];

        for (let $key=0; $key < $in.do.length; $key = $key + 1) {
            $responses[$key] = internal_Cmd($in.do[$key]);
        }

        return {
            'answer': 'true',
            'message': 'Done with mass update',
            'responses': $responses
        };

    };

    /**
     * Check if ID exist in the DOM
     * @version 2017-12-08
     * @since 2017-12-08
     * @author Peter Lembke
     */
    $functions.push('id_exist');
    const id_exist = function ($in)
    {
        const $default = {
            'id': '' // Id for an object
        };
        $in = _Default($default, $in);

        return internal_Cmd({
            'func': 'IdExist',
            'id': $in.id
        });
    };

    /**
     * Check if ID exist in the DOM
     * @param $in
     * @returns {string}
     */
    $functions.push('internal_IdExist');
    const internal_IdExist = function ($in)
    {
        const $default = {
            'id': '' // Id for an object
        };
        $in = _Default($default, $in);

        let $exist = 'false',
            $message = '';

        const $element = _GetNode($in.id);

        if (!$element) {
            $message = 'Id do not exist in the DOM';
            $exist = 'false';
        }

        if ($element) {
            $message = 'Id exist in the DOM';
            $exist = 'true';
        }

        return {
            'answer': 'true',
            'message': $message,
            'exist': $exist
        };
    };

    /**
     * Mark an object with 'true' or 'false' or 'switch'
     * @version 2017-10-07
     * @since 2017-10-07
     * @author Peter Lembke
     */
    $functions.push('mark_object');
    const mark_object = function ($in)
    {
        const $default = {
            'id': '', // Id for an object
            'mark': 'true' // 'true', 'false', 'switch'
        };
        $in = _Default($default, $in);

        return internal_Cmd({
            'func': 'MarkObject',
            'id': $in.id,
            'mark': $in.mark
        });
    };

    /**
     * Mark an object
     * @param $in
     * @returns {string}
     */
    $functions.push('internal_MarkObject');
    const internal_MarkObject = function ($in)
    {
        const $default = {
            'id': '',
            'mark': 'true', // 'true', 'false', 'switch'
            'mark_true': {
                'box_shadow': '0px 0px 0px 5px rgba(255,0,0,1)'
            },
            'mark_false': {
                'box_shadow': '0px 0px 0px 2px rgba(0,255,0,1)'
            }
        };
        $in = _Default($default, $in);

        let $element,
            $message,
            $isMarked = 'unknown';

        leave: {
            $element = _GetNode($in.id);
            if (!$element) {
                $message = 'Can not find object with id:' + $in.id;
                break leave;
            }

            if ($element.type === 'checkbox') {
                // Checkbox can not get box shadow on IOS. -webkit-appearance: none; removes the checkbox.
                $element = $element.parentNode;
            }

            if ($in.mark === 'switch') {
                $in.mark = 'true';
                if ($element.style.borderStyle === 'solid') {
                    $in.mark = 'false';
                }
            }

            if ($in.mark === 'false') {
                $message = 'Object is now not marked';
                $isMarked = 'false';
                break leave;
            }

            if ($in.mark === 'true') {
                $message = 'Object is now marked';
                $isMarked = 'true';
                break leave;
            }

            $message = 'Please set mark to either true, false or switch';
        }

        if ($isMarked !== 'unknown') {
            const $key = 'mark_' + $isMarked;
            $element.style.boxShadow = $in[$key].box_shadow;
        }

        return {
            'answer': 'true',
            'message': $message,
            'id': $in.id,
            'is_marked': $isMarked
        };
    };

    /**
     * Read a form select element
     * @version 2019-02-24
     * @since 2019-02-24
     * @author Peter Lembke
     */
    $functions.push('form_select_read');
    const form_select_read = function ($in)
    {
        const $default = {
            'id': ''
        };
        $in = _Default($default, $in);

        let $answer = 'false',
            $message,
            $exist,
            $value = [];

        leave:
        {
            const $element = _GetNode($in.id);

            if (!$element) {
                $message = 'Id do not exist in the DOM';
                $exist = 'false';
                break leave;
            }

            $exist = 'true';

            if ($element.tagName !== 'SELECT') {
                $message = 'You can only read select elements with this function';
                break leave;
            }

            for (let $i = 0; $i < $element.options.length; $i = $i + 1)
            {
                if ($element.options[$i].selected) {
                    $value.push($element.options[$i].value);
                }
            }

            $message = 'Here are the values';
            $answer = 'true';
        }

        return {
            'answer': $answer,
            'message': $message,
            'exist': $exist,
            'value': $value,
            'id': $in.id
        };
    };

    /**
     * Read a form, get data from all form elements
     * @version 2018-06-14
     * @since 2018-06-14
     * @author Peter Lembke
     */
    $functions.push('form_read');
    const form_read = function ($in)
    {
        const $default = {
            'id': ''
        };
        $in = _Default($default, $in);

        return internal_Cmd({
            'func': 'FormRead',
            'id': $in.id
        });
    };

    /**
     * Give ID to a form, Get all form data
     * @param $in
     * @returns {string}
     */
    $functions.push('internal_FormRead');
    const internal_FormRead = function ($in)
    {
        let $answer = 'true',
            $exist = 'true',
            $message = '',
            $formData = {};

        const $default = {
            'id': ''
        };
        $in = _Default($default, $in);

        leave:
        {
            let $element = _GetNode($in.id);
            if (!$element) {
                $message = 'Id do not exist in the DOM';
                $exist = 'false';
                break leave;
            }

            const $selector = '[renderer=\'infohub_render_form\']';
            let $elementList = $element.querySelectorAll($selector);

            for (let $listItemNumber in $elementList)
            {
                if ($elementList.hasOwnProperty($listItemNumber) === false ) {
                    continue;
                }

                let $box = $elementList[$listItemNumber];

                if ($box.tagName === 'FORM' || $box.tagName === 'BUTTON' || $box.tagName === 'DATALIST') {
                    continue;
                }

                let $data = {};

                Array.prototype.slice.call($box.attributes).forEach(function(item) {
                    let $itemName = item.name;
                    if ($itemName === 'step') { $itemName = 'step_value'; }
                    $data[$itemName] = item.value;
                });

                $data = _ReadProperty($box, 'value', $data);
                $data = _ReadProperty($box, 'innerHTML', $data);

                if (_GetData({'name': 'form_alias', 'default': '', 'data': $data}) === '') {
                    continue;
                }

                let $alias = $data.form_alias;
                let $type = $data.type;

                if ($type === 'radio' || $type === 'checkbox')
                {
                    const $value = $data.value;
                    let $checkBoxData = 'false';
                    if ($box.checked === true) {
                        $checkBoxData = 'true';
                    }
                    $data.value = $checkBoxData;

                    $formData[$alias + '.' + $value] = _ByVal($data);
                    continue;
                }

                if ($type === 'select') {
                    $answer = [];
                    for (let $i = 0; $i < $box.options.length; $i = $i + 1) {
                        if ($box.options[$i].selected) {
                            $answer.push($box.options[$i].value);
                        }
                    }
                    $data.value = _ByVal($answer);
                    $data.innerHTML = '';
                    $formData[$alias] = _ByVal($data);
                    continue;
                }

                $formData[$alias] = _ByVal($data);
            }

            $answer = 'true';
            $message = 'Here are the data from the form elements that I could find';
            $exist = 'true';
        }

        return {
            'answer': $answer,
            'message': $message,
            'exist': $exist,
            'form_data': $formData
        };
    };

    const _ReadProperty = function ($box, $method, $data)
    {
        if (typeof $box[$method] === 'undefined') {
            return $data;
        }

        let $value = $box[$method];

        if (typeof $value === 'boolean') {
            if ($value === true) {
                $value = 'true';
            } else {
                $value = 'false';
            }
        }

        $data[$method] = $value;

        return $data;
    };

    /**
     * Write to a form, puts data in the form elements you have
     * @version 2018-06-30
     * @since 2018-06-30
     * @author Peter Lembke
     */
    $functions.push('form_write');
    const form_write = function ($in)
    {
        const $default = {
            'id': '',
            'form_data': {}
        };
        $in = _Default($default, $in);

        return internal_Cmd({
            'func': 'FormWrite',
            'id': $in.id,
            'form_data': $in.form_data
        });
    };

    /**
     * Give ID and form data. Function will write the data to the form elements in the provided box id.
     * @param $in
     * @returns {string}
     */
    $functions.push('internal_FormWrite');
    const internal_FormWrite = function ($in)
    {
        const $default = {
            'id': '',
            'form_data': {}
        };
        $in = _Default($default, $in);

        const $response = internal_Cmd({
            'func': 'FormRead',
            'id': $in.id
        });

        const $currentFormData = _ByVal($response.form_data);
        const $newFormData = _ByVal($in.form_data);

        // Create a new object with all data in one level to be updated in DOM.
        const $formDataToUpdate = _GetFormDataToUpdate($currentFormData, $newFormData);

        for (let $keyName in $formDataToUpdate)
        {
            if ($formDataToUpdate.hasOwnProperty($keyName) === false) {
                continue;
            }

            let $box = _GetNode($formDataToUpdate[$keyName].id);
            if (!$box) {
                continue; // There is no element with that id
            }

            const $type = $formDataToUpdate[$keyName].type;
            let $value = $formDataToUpdate[$keyName].value;
            const $mode = $formDataToUpdate[$keyName].mode;

            if ($type === 'color') {
                if (_Empty($value) === 'true') {
                    $value = "#000000";
                }
            }

            if ($type === 'text' || $type === 'color' || $type === 'range')
            {
                if ($type === 'text' && $mode === 'add_right') {
                    $value = $box.value + ' ' + $value.toString();
                }
                if ($type === 'text' && $mode === 'add_left') {
                    $value = $value.toString() + ' ' + $box.value;
                }

                $box.value = $value.toString();
                _Go($box, 'onkeyup');
                _Go($box, 'onchange');
                continue;
            }

            if ($type === 'textarea')
            {
                if ($mode === 'add_right') {
                    $value = $box.value + ' ' + $value.toString();
                }
                if ($mode === 'add_left') {
                    $value = $value.toString() + ' ' + $box.value;
                }

                $box.value = $value.toString();
                _Go($box, 'onkeyup');
                continue;
            }

            if ($type === 'radio' || $type === 'checkbox')
            {
                if ($value === 'true') {
                    $box.checked = true;
                    _Go($box, 'onchange');
                    continue;
                }
                $box.checked = false;
                _Go($box, 'onchange');
                continue;
            }

            if ($type === 'select')
            {
                if ($mode === 'clean_and_add')
                {
                    $box.options.length = 0;

                    for (let $i=0; $i < $value.length; $i = $i + 1)
                    {
                        let $option = document.createElement("option");
                        $option.text = $value[$i];
                        $option.value = $value[$i];
                        $box.add($option, null);
                        $box.options[$box.options.length-1].selected = true;
                    }

                    continue;
                }

                let $selectIndex = {};
                for (let $i=0; $i < $value.length; $i = $i + 1) {
                    $selectIndex[$value[$i]] = 1;
                }

                for (let $i = 0; $i < $box.options.length; $i = $i + 1) {
                    $box.options[$i].selected = false;
                }

                for (let $i = 0; $i < $box.options.length; $i = $i + 1) {
                    if (_IsSet($selectIndex[$box.options[$i].value]) === 'true') {
                        $box.options[$i].selected = true;
                    }
                }

                _Go($box, 'onchange');
            }
        }

        const $answer = 'true';
        const $message = 'The data have been written to the form';

        return {
            'answer': $answer,
            'message': $message
        };
    };

    $functions.push('_Go');
    /**
     * Trigger an event message
     * @param $box
     * @param $property
     * @private
     */
    const _Go = function ($box, $property)
    {
        if (_IsSet($box[$property]) === 'false') {
            return;
        }

        if ($property === 'onkeyup') {
            $box.onkeyup();
        }

        if ($property === 'onchange') {
            $box.onchange();
        }

        if ($property === 'onclick') {
            $box.onclick();
        }
    };

    $functions.push('_GetFormDataToUpdate');
    /**
     * Purpose is to return a useful simple object for later use when updating the DOM with form values
     * @param $currentFormData | Object How the form looks like in DOM right now
     * @param $newFormData | Object The new values. The structure matches $currentFormData
     * @private
     */
    const _GetFormDataToUpdate = function ($currentFormData, $newFormData)
    {
        let $formDataToUpdate = {},
            $current;

        const $default = {
            'id': '',
            'type': '',
            'form_alias': '',
            'mode': 'update'
        };

        for (let $key in $newFormData) {

            if ($newFormData.hasOwnProperty($key) === false) {
                continue;
            }

            if (_IsSet($currentFormData[$key]) === 'false') {
                continue;
            }

            $current = _Default($default, $currentFormData[$key]);

            if ($current.type !== '' && _IsSet($newFormData[$key].value) === 'true') {
                $formDataToUpdate[$key] = {
                    'id': $current.id,
                    'type': $current.type,
                    'value': $newFormData[$key].value,
                    'form_alias': $current.form_alias,
                    'mode': $newFormData[$key].mode
                };
                continue;
            }

            // We have covered everything now except the case with radio buttons and checkboxes

            $current = _ByVal($currentFormData[$key]);

            for (let $checkBoxKey in $current) {

                if ($current.hasOwnProperty($checkBoxKey) === false) {
                    continue;
                }

                if (_GetData({'name': $key+'/'+$checkBoxKey+'/value', 'default': '', 'data': $newFormData }) === '') {
                    continue;
                }

                $current[$checkBoxKey] = _Default($default, $current[$checkBoxKey]);

                $formDataToUpdate[$key + '.' + $checkBoxKey] = {
                    'id': $current[$checkBoxKey].id,
                    'type': $current[$checkBoxKey].type,
                    'value': $newFormData[$key][$checkBoxKey].value,
                    'form_alias': $current[$checkBoxKey].form_alias,
                    'mode': $newFormData[$key][$checkBoxKey].mode
                };
            }
        }

        return $formDataToUpdate;
    };


    const _WriteProperty = function ($box, $method, $data)
    {
        if (typeof $box[$method] === 'undefined') {
            return $data;
        }

        if (typeof $data[$method] === 'undefined') {
            return $data;
        }

        let $value = $data[$method];

        if (typeof $value === 'boolean') {
            if ($value === true) {
                $value = 'true';
            } else {
                $value = 'false';
            }
        }

        $box[$method] = $value;

        return $data;
    };

    const _JsonToObject = function ($in)
    {
        if ($in === '') {
            return {};
        }

        if ($in[0] === '{') {
            return JSON.parse($in);
        }

        return $in;
    };

    const _SetBoxIdInString = function ($id, $data)
    {
        const $boxId = _GetBoxId($id);
        $data = $data.replace(new RegExp('{box_id}', 'gi'), $boxId);
        // gi = Global (all occurrences in the string), Ignore case.

        return $data;
    };

    /**
     * Read the file data from a file selector
     * @version 2019-01-12
     * @since 2019-01-12
     * @author Peter Lembke
     */
    $functions.push('file_read');
    const file_read = function ($in)
    {
        const $default = {
            'id': '',
            'read_binary': 'false',
            'callback_function': null
        };
        $in = _Default($default, $in);

        let $filesData = [],
            $timer;

        const $box = _GetNode($in.id);

        for (let $i = 0; $i < $box.files.length; $i = $i + 1) {
            $filesData[$i] = {
                'name': $box.files[$i].name,
                'size': $box.files[$i].size,
                'type': $box.files[$i].type,
                'last_modified_seconds_since_epoc': $box.files[$i].lastModified / 1000.0,
                'last_modified_date': $box.files[$i].lastModifiedDate,
                'content': ''
            };
        }

        let $filesLeft = $box.files.length;
        let $reader = new FileReader();

        $reader.onload = function(event)
        {
            $filesData[$filesLeft-1].content = event.target.result;
            $filesLeft = $filesLeft - 1;

            if ($filesLeft === 0) {
                clearInterval($timer);
                $in.callback_function({
                    'answer': 'true',
                    'message': 'Here are the files data',
                    'files_data': $filesData
                });
            }
        };

        $timer = setInterval(readNextBlob, 200);
        function readNextBlob() {
            if ($reader.readyState !== $reader.LOADING && $filesLeft > 0) {
                const $blob = $box.files[$filesLeft-1];
                if ($in.read_as_binary === 'true') {
                    $reader.readAsBinaryString($blob);
                } else {
                    $reader.readAsDataURL($blob);
                }
            }
            if ($filesLeft === 0) {
                clearInterval($timer);
            }
        }

        return {};
    };

    /**
     * Many functions use this code.
     * Code comes from https://ourcodeworld.com/articles/read/189/how-to-create-a-file-and-generate-a-download-with-javascript-in-the-browser-without-a-server
     * https://ourcodeworld.com/about
     * @version 2019-01-13
     * @since 2019-01-13
     * @author Carlos Delgado
     */
    $functions.push('_ATag');
    const _ATag = function ($in)
    {
        let element = document.createElement('a');

        for (let $attributeName in $in) {
            if ($in.hasOwnProperty($attributeName) === false) {
                continue;
            }
            element.setAttribute($attributeName, $in[$attributeName]);
        }

        element.style.display = 'none';
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);

        return {
            'answer': 'true',
            'message': 'Done adding the a tag and clicking on it'
        };
    };

    /**
     * Write data to a file and let the browser download the file
     * Code comes from https://ourcodeworld.com/articles/read/189/how-to-create-a-file-and-generate-a-download-with-javascript-in-the-browser-without-a-server
     * https://ourcodeworld.com/about
     * @version 2019-01-13
     * @since 2019-01-13
     * @author Carlos Delgado
     */
    $functions.push('file_write');
    const file_write = function ($in)
    {
        const $default = {
            'file_name': '',
            'content': ''
        };
        $in = _Default($default, $in);

        _ATag({
            'href': 'data:text/plain;charset=utf-8,' + encodeURIComponent($in.content),
            'download': $in.file_name
        });

        return {
            'answer': 'true',
            'message': 'Hope that you got the file downloaded now'
        };
    };

    /**
     * Let your phone send an SMS
     * Code comes from http://www.webondevices.com/9-javascript-apis-accessing-device-sensors/
     * @version 2019-01-29
     * @since 2019-01-29
     */
    $functions.push('sms_send');
    const sms_send = function ($in)
    {
        const $default = {
            'number': '',
            'content': ''
        };
        $in = _Default($default, $in);

        _ATag({
            'hreg': 'sms:' + $in.number + '?body=' + encodeURIComponent($in.content)
        });

        return {
            'answer': 'true',
            'message': 'Hope that your telephone have sent the SMS now'
        };
    };

    /**
     * Call a number on your phone
     * Code comed from http://www.webondevices.com/9-javascript-apis-accessing-device-sensors/
     * @version 2019-01-29
     * @since 2019-01-29
     */
    $functions.push('call_number');
    const call_number = function ($in)
    {
        const $default = {
            'number': ''
        };
        $in = _Default($default, $in);

        _ATag({
            'hreg': 'tel:' + $in.number
        });

        return {
            'answer': 'true',
            'message': 'Hope that your telephone have called the number now'
        };
    };

    /**
     * Set a style on any element
     * @version 2020-03-01
     * @since 2020-03-01
     */
    $functions.push('set_style');
    const set_style = function ($in)
    {
        const $default = {
            'box_id': '', // Normal box_id
            'element_path': '', // Optional. example: 1233_some_box_id.svg.circle.0
            'style_name': '',
            'style_value': ''
        };
        $in = _Default($default, $in);

        return internal_Cmd({
            'func': 'SetStyle',
            'box_id': $in.box_id,
            'element_path': $in.element_path,
            'style_name': $in.style_name,
            'style_value': $in.style_value
        });
    };

    $functions.push('internal_SetStyle');
    const internal_SetStyle = function ($in)
    {
        const $default = {
            'box_id': '', // Normal box_id
            'element_path': '', // example: 1233_some_box_id.svg.circle.0
            'style_name': '',
            'style_value': ''
        };
        $in = _Default($default, $in);

        let $boxId = _GetBoxId($in.box_id);
        let $id = $boxId + '.' + $in.element_path;
        if (_Empty($in.element_path) === 'true') {
            $id = $boxId;
        }

        let $element = _GetElement($id);

        let $message = 'have not set the style. Did not find the element';
        if ($element) {
            $element.style[$in.style_name] = $in.style_value;
            $message = 'Have set the style';
        }

        return {
            'answer': 'true',
            'message': $message
        };
    };

    /**
     * Used by various events where we can have a generic response to the event.
     * For example expanding embedded data. Change font size. Toggle visibility.
     * If you set send = 'true' in your data that trigger the event,
     * then this event will also be forwarded to your plugin.
     * @version 2019-08-03
     * @since   2013-12-25
     * @author  Peter Lembke
     */
    $functions.push("event_message"); // Enable this function
    const event_message = function ($in)
    {
        const $default = {
            'parent_id': 0,
            'box_id': '',
            'step': 'start',
            'data': ''
        };
        $in = _Merge($default, $in);

        let $answer, $response;

        let $data = atob($in.data);
        $data = _SetBoxIdInString($in.box_id, $data);
        $data = _JsonToObject($data);

        if ($in.step === 'step_end') {
            return {
                'answer': 'true',
                'message': 'Got a return message'
            };
        }

        if ($in.type === 'link') {
            if ($in.event_type === 'click') {
                $answer = {
                    'answer': 'true',
                    'send': 'true'
                };
            }
        }

        if ($in.event_type === 'embed') {
            const $node = _GetNode($in.id);
            if ($node) {
                let $parentNode = $node.parentNode;
                const $boxId = $in.box_id.substr(0, $in.box_id.indexOf('_'));
                $data = $data.replace(new RegExp('{box_id}', 'gi'), $boxId); // gi = Global (all occurrences in the string), Ignore case.
                $parentNode.innerHTML = $data;
            }
        }

        if ($in.event_type === 'toggle' || $in.event_type === 'switch')
        {
            $response = internal_Cmd({
                'func': 'SetVisible',
                'id': $in.toggle_id,
                'set_visible': 'switch'
            });

            if (_IsSet($in.other_id) === 'true') {
                if (_Empty($in.other_id) === 'false') {

                    let $blockTypeVisible = '';
                    if (_IsSet($in.block_type_visible) === 'true') {
                        if (_Empty($in.block_type_visible) === 'false') {
                            $blockTypeVisible = $in.block_type_visible;
                        }
                    }

                    internal_Cmd({
                        'func': 'SetVisible',
                        'id': $in.other_id,
                        'set_visible': 'switch',
                        'block_type_visible': $blockTypeVisible
                    });

                    internal_Cmd({
                        'func': 'SetVisible',
                        'id': $in.id,
                        'set_visible': 'switch',
                        'block_type_visible': $blockTypeVisible
                    });

                }
            }
        }

        if (typeof $answer === 'object') {
            if ($answer.answer === 'true' && typeof $answer.send === 'string' && $answer.send === 'true') {
                return _SubCall({
                    'to': {
                        'node': $in.to_node,
                        'plugin': $in.to_plugin,
                        'function': $in.to_function
                    },
                    'data': {
                        'parent_id': $in.parent_id,
                        'box_id': $in.box_id,
                        'step': 'event_message',
                        'data': $in.data,
                        'renderer': $in.renderer ,
                        'alias': $in.alias
                    },
                    'data_back': {
                        'step': 'step_end'
                    }
                });
            }
        }

        return {
            'answer': 'false',
            'message': 'Did not send any event message'
        };
    };
}
//# sourceURL=infohub_view.js