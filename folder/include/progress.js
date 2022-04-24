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

/**
 * Progress help the startup.js to show loading progress.
 * Normally the startup is so fast that you do not see the progress.
 * On a cold start it will be different with longer wait.
 */
function progress() {
    'use strict';

    let $objProgress = document.getElementById('progress'),
        $objText = document.getElementById('progress_text');

    const $areaCodeNumbers = {
        'start': 0,
        'missing_plugins': 1,
        'get_package': 2,
        'call_server': 3,
        'server_response': 4,
        'store_asset': 5,
        'store_plugin': 6,
        'start_core_plugin': 7,
        'send_first_message': 8,
    };

    /**
     * Modifies the progress bar.
     * @param $areaCode A name from the object above, example: 'missing_plugins'
     * @param $partPercent percent of this area 0-100
     * @param $text
     */
    this.whatArea = function($areaCode, $partPercent, $text) {
        if ($areaCode === 'clean_up') {
            document.getElementById('log').innerText = '';
            return;
        }

        const $numberOfAreas = _Count($areaCodeNumbers);

        let $areaPercent = $areaCodeNumbers[$areaCode] / $numberOfAreas * 100.0;
        let $areaPartPercent = 1 / $numberOfAreas * $partPercent;

        let $percent = $areaPercent + $areaPartPercent;
        if ($percent > 100.0) {
            $percent = 100.0;
        }

        $objProgress.value = $percent;

        if (typeof $text === 'string') {
            if ($text === '') {
                $text = $areaCode;
            }
        }
        // $objText.innerText = $text; // HUB-918
        const $fullText = $percent.toFixed(0) + ', ' + $areaCode + ', ' + $text;
        console.info($fullText);
    };

    /**
     * Count number of items in an array or an object
     * @param $object
     * @returns {*}
     * @private
     */
    const _Count = function($object) {
        if (Array.isArray($object) === true) {
            return $object.length;
        }

        if ($object) {
            return Object.getOwnPropertyNames($object).length;
        }

        return 0;
    };

}

const $progress = new progress();
//# sourceURL=progress.js
