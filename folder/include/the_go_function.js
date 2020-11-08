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
// the_go_function , DOM events go here.
function go($pluginName, $eventType, $containerId)
{
    "use strict";

    let $boxId = '';

    if ($containerId) {
        $boxId =  $containerId.split('_');
        $boxId = $boxId.shift();
    }

    let $data = {'box_id': $boxId, 'event_type': $eventType };

    // Get all attributes from the box
    const $container = readMoreData($containerId, $data);
    if ($container) {
        // Get the parent node ID. Useful for button submit etc.
        $data.parent_id = $container.parentNode.id;
    }

    if ($boxId) {
        const $box = document.getElementById($boxId);
        $data.parent_box_id = $box.parentNode.id;

        // let $id;

        // Get all attributes from the details div, in this box
        // $id = $boxId + '_details';
        // readMoreData($id, $data);

        // Get all attributes from the main object, in this box
        // $id = $boxId + '_object';
        // readMoreData($id, $data);
    }

    return sendMessage($pluginName, $data);
}

function readMoreData($id, $data)
{
    "use strict";

    if ($id === '') {
        return false;
    }

    const $box = document.getElementById($id);
    if ($box !== null)
    {
        Array.prototype.slice.call($box.attributes).forEach(function(item)
        {
            let $itemName = item.name;
            let $itemValue = item.value;

            if ($itemName === 'step') {
                $itemName = 'step_value';
            }
            if ($itemName === 'multiple') {
                $itemValue = 'true';
            }
            if ($itemName === 'selected') {
                $itemValue = 'true';
            }
            $data[$itemName] = $itemValue;
        });

        $data = readProperty($box, 'value', $data);
        $data = readProperty($box, 'innerHTML', $data);

        return $box;

    }
    else {
        window.alert('Box does not exist:' + $id);
    }

    return false;
}

function readProperty($box, $method, $data)
{
    "use strict";

    if (typeof $box[$method] === 'undefined') {
        return $data;
    }

    let $value = $box[$method];

    if (typeof $data.type !== 'undefined' && $data.type === 'checkbox' && $method === 'value') {
        $value = $box.checked;
    }

    if (typeof $value === 'boolean') {
        if ($value === true) {
            $value = 'true';
        } else {
            $value = 'false';
        }
    }

    $data[$method] = $value;

    return $data;
}

function sendMessage($pluginName, $data)
{
    "use strict";

    const $message1 = {
        'to': {'node': 'client', 'plugin': $pluginName, 'function': 'event_message'},
        'callstack': [],
        'data': $data
    };

    const $package = {
        'to_node': 'client',
        'messages': [$message1]
    };

    const $event = new CustomEvent('infohub_call_main',
        { detail: {'plugin': null, 'package': $package}, bubbles: true, cancelable: true }
    );

    document.dispatchEvent($event);
}

//# sourceURL=the_go_function.js
