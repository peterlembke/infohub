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
function infohub_cache() {

    "use strict";

// include "infohub_base.js"

    $functions.push('_Version');
    const _Version = function() {
        return {
            'date': '2015-06-06',
            'version': '1.0.0',
            'class_name': 'infohub_cache',
            'checksum': '{{checksum}}',
            'note': 'Used by infohub_plugin to store plugins in local storage. Can be used for temporary data that will expire',
            'SPDX-License-Identifier': 'GPL-3.0-or-later'
        };
    };

    $functions.push('_GetCmdFunctions');
    const _GetCmdFunctions = function() {
        return {
            'save_data_to_cache': 'normal',
            'load_data_from_cache': 'normal',
            'remove_data_from_cache': 'normal',
            'remove_data_from_cache_by_prefix': 'normal',
            'load_index_from_cache': 'normal',
            'validate_cache': 'normal',
            'update_index_in_cache': 'normal'
        };
    };

    // *****************************************************************************
    // * The private functions, add your own in your plugin
    // * These functions can be used directly in your functions.
    // * Name: _CamelCaseData
    // *****************************************************************************

    /**
     * Check if local storage exist in the browser
     * @version 2015-09-20
     * @since   2015-04-24
     * @author  Peter Lembke
     */
    $functions.push('_LocalStorageExist');
    const _LocalStorageExist = function ()
    {
        let $exist = 'false';

        try {
            $exist = 'localStorage' in window && window.localStorage !== null;
        } catch ($err) {
            return 'false';
        }

        if ($exist === true) {
            return 'true';
        }

        return 'false';
    };

    // *****************************************************************************
    // * Functions you only can reach with CMD()
    // * Observe! function names are lower_case
    // *****************************************************************************

    /**
     * Save the data to the cache and update the index
     * @version 2015-06-06
     * @since   2015-05-18
     * @author  Peter Lembke
     * @param $in
     * @returns {{answer: string, message: string}}
     */
    $functions.push('save_data_to_cache');
    const save_data_to_cache = function ($in)
    {
        const $default = {
            'prefix': '',
            'key': '',
            'data': {},
            'checksum': ''
        };
        $in = _Default($default,$in);

        let $out = {
            'answer': 'false',
            'message': 'Did not save the data to cache because:'
        };

        block:
        {
            if ($in.key === '')
            {
                $out.message = $out.message + 'key name is empty. ';
                break block;
            }

            if ($in.checksum !== '')
            {
                const $response = internal_Cmd({'func': 'LoadDataFromIndex', 'prefix': $in.prefix, 'key': $in.key });
                if ($response.checksum === $in.checksum) {
                    internal_Cmd({'func': 'SaveDataToIndex', 'prefix': $in.prefix, 'key': $in.key, 'checksum': $in.checksum });
                    $out.message = $out.message + 'the checksum are same on the already stored data but I updated the timestamp_added in the index. ';
                    break block;
                }
            }

            internal_Cmd({
                'func': 'LocalStorageSave',
                'prefix': $in.prefix,
                'key': $in.key,
                'data': $in.data
            });

            internal_Cmd({
                'func': 'SaveDataToIndex',
                'prefix': $in.prefix,
                'key': $in.key,
                'checksum': $in.checksum
            });

            $out.answer = 'true';
            $out.message = 'Have saved the data and updated the index';
        }

        return {
            'answer': $out.answer,
            'message': $out.message
        };
    };

    /**
     * Load data from the cache
     * @version 2015-06-06
     * @since   2015-05-18
     * @author  Peter Lembke
     * @param $in
     * @returns {{answer: string, message: string}}
     */
    $functions.push('load_data_from_cache');
    const load_data_from_cache = function ($in)
    {
        const $default = {
            'prefix': '',
            'key': '',
            'config': {
                'client_cache_lifetime': 0
            }
        };
        $in = _Default($default,$in);

        const $defaultOut = {
            'answer' : 'true',
            'message': '-',
            'data': {},
            'found': 'false',
            'old': 'false'
        };
        let $out = _ByVal($defaultOut);

        let $response = internal_Cmd({
            'func': 'LoadDataFromIndex',
            'prefix': $in.prefix,
            'key': $in.key
        });

        block:
        {
            if ($response.answer === 'false') {
                $out.message = 'Key:"' + $in.key + '" not found in the "' + $in.prefix + '" index';
                break block;
            }

            let $indexData = $response.data;

            const $age = _MicroTime({}) - $indexData.timestamp_added;
            if ($age > $in.config.client_cache_lifetime) {
                $out.old = 'true';
            }

            $response = internal_Cmd({
                'func': 'LocalStorageLoad',
                'prefix': $in.prefix,
                'key': $in.key
            });

            if ($response.found === 'false') {
                internal_Cmd({'func': 'RemoveDataFromIndex', 'prefix': $in.prefix, 'key': $in.key });
                $out.message = 'Data was in the index but not in the cache. Have now removed the key from the index';
                break block;
            }

            $out.data = $response.data;
            $out.found = 'true';
            $out.message = 'Here are the data';
        }

        $out = _Default($defaultOut, $out);
        return $out;
    };

    /**
     * Load data from the cache
     * @version 2015-06-06
     * @since   2015-05-18
     * @author  Peter Lembke
     * @param $in
     * @returns {{answer: string, message: string}}
     */
    $functions.push('load_index_from_cache');
    const load_index_from_cache = function ($in)
    {
        const $default = {
            'prefix': ''
        };
        $in = _Default($default,$in);

        const $response = internal_Cmd({
            'func': 'LoadIndex',
            'prefix': $in.prefix
        });

        return {
            'answer' : 'true',
            'message': 'Here are the index',
            'data': $response.index
        };
    };

    /**
     * Purpose is to have an updated plugin index in the client. The plugin index show what plugins are stored locally.
     * You have previously sent the plugin_list to the server and got it updated by the server.
     * Plugins that are missing or new will have a week old "timestamp_added".
     * Plugins that still have the same checksum will have "timestamp_added" set to now.
     * @version 2015-06-06
     * @since   2015-05-18
     * @author  Peter Lembke
     * @param $in
     * @returns {{answer: string, message: string}}
     */
    $functions.push('update_index_in_cache');
    const update_index_in_cache = function ($in)
    {
        const $default = {
            'prefix': '',
            'data': {} // Complete list you want to compare the local list with
        };
        $in = _Default($default,$in);

        let $incomingIndex = $in.data;

        let $response = internal_Cmd({
            'func': 'LoadIndex',
            'prefix': $in.prefix
        });

        let $localIndex = $response.index;
        let $changed = 'false';

        for (let $key in $incomingIndex)
        {
            if ($localIndex.hasOwnProperty($key) === false) {
                continue;
            }

            if ($localIndex[$key].timestamp_added !== $incomingIndex[$key].timestamp_added)
            {
                // Same checksum server <--> locally will set the current time
                // Different checksum server <--> locally will set a week old time so the plugin will be invalidated.
                $localIndex[$key].timestamp_added = $incomingIndex[$key].timestamp_added;
                $changed = 'true';
            }
        }

        if ($changed === 'true')
        {
            internal_Cmd({
                'func': 'SaveIndex',
                'prefix': $in.prefix,
                'index': $localIndex
            });
        }

        return {
            'answer' : 'true',
            'message': 'Here are the updated local index',
            'data': $localIndex
        };
    };

    /**
     * Remove the key from the cache and update the index
     * @version 2015-06-06
     * @since   2015-05-18
     * @author  Peter Lembke
     * @param $in
     * @returns {{answer: string, message: string}}
     */
    $functions.push('remove_data_from_cache');
    const remove_data_from_cache = function ($in)
    {
        const $default = {
            'prefix': '',
            'key': ''
        };
        $in = _Default($default,$in);

        const $response = internal_Cmd({
            'func': 'RemoveDataFromCache',
            'prefix': $in.prefix,
            'key': $in.key
        });

        return $response;
    };

    /**
     * Remove the key from the cache and update the index
     * @version 2015-06-06
     * @since   2015-05-18
     * @author  Peter Lembke
     * @param $in
     * @returns {{answer: string, message: string}}
     */
    $functions.push('internal_RemoveDataFromCache');
    const internal_RemoveDataFromCache = function ($in)
    {
        const $default = {
            'prefix': '',
            'key': ''
        };
        $in = _Default($default,$in);

        let $out = {
            'answer': 'false',
            'message': ''
        };

        block:
        {
            if ($in.key === '') {
                $out.message = 'Please provide a key';
                break block;
            }

            let $response = internal_Cmd({
                'func': 'LocalStorageSave',
                'prefix': $in.prefix,
                'key': $in.key,
                'data': {}
            });

            if ($response.answer === 'false') {
                $out.message = $response.message;
                break block;
            }

            $response = internal_Cmd({
                'func': 'RemoveDataFromIndex',
                'prefix': $in.prefix,
                'key': $in.key
            });

            $out.answer = $response.answer;
            $out.message = $response.message;
        }

        return {
            'answer': $out.answer,
            'message': $out.message
        };
    };

    /**
     * Remove all keys that have the same prefix
     * @version 2018-09-09
     * @since   2018-09-09
     * @author  Peter Lembke
     * @param $in
     * @returns {{answer: string, message: string}}
     */
    $functions.push('remove_data_from_cache_by_prefix');
    const remove_data_from_cache_by_prefix = function ($in)
    {
        const $default = {
            'prefix': ''
        };
        $in = _Default($default,$in);

        let $out = {
            'answer': 'false',
            'message': ''
        };

        block:
        {
            if ($in.prefix === '') {
                $out.message = 'Please provide a prefix';
                break block;
            }

            let $response = internal_Cmd({
                'func': 'LoadIndex',
                'prefix': $in.prefix
            });

            if ($response.answer === 'false') {
                $out.message = $response.message;
                break block;
            }

            for (let $key in $response.index)
            {
                if ($response.index.hasOwnProperty($key))
                {
                    internal_Cmd({
                        'func': 'RemoveDataFromCache',
                        'prefix': $in.prefix,
                        'key': $key
                    });
                }
            }

            $out.answer = 'true';
            $out.message = 'Done removing items from local storage';
        }

        return {
            'answer': $out.answer,
            'message': $out.message,
            'prefix': $in.prefix
        };
    };

    /**
     * Validate the cache, remove old data.
     * If you provide an array with keys+checksums then they are also used to validate the cache
     * @version 2016-11-02
     * @since   2015-05-18
     * @author  Peter Lembke
     * @param $in
     * @returns {{answer: string, message: string}}
     */
    $functions.push('validate_cache');
    const validate_cache = function ($in)
    {
        const $default = {
            'prefix': '',
            'checksums': {}, // local storage key as key, checksum string as data
            'config': {
                'client_cache_lifetime': 0
            }
        };
        $in = _Default($default,$in);

        let $newIndex = {};

        let $out = {
            'answer': 'true',
            'message': ''
        };

        block:
        {
            let $response = internal_Cmd({
                'func': 'LocalStorageLoad',
                'prefix': $in.prefix,
                'key': 'index'
            });

            if ($response.answer === 'false') {
                $out.message = $response.message;
                break block;
            }

            let $index = $response.data;
            const $currentTimeStamp = _MicroTime({});
            const $cacheLifeTime = $in.config.client_cache_lifetime;

            for (let $key in $index)
            {
                if ($index.hasOwnProperty($key) === false) {
                    continue;
                }

                let $remove = 'false';

                const $timeStampWhenOld = $index[$key].timestamp_added + $cacheLifeTime;

                if ($currentTimeStamp > $timeStampWhenOld) {
                    $remove = 'true';
                }

                if (typeof $in.checksums[$key] !== 'undefined') {
                    if ($index[$key].checksum !== $in.checksums[$key]) {
                        $remove = 'true';
                    }
                }

                if ($remove === 'true') {
                    $response = internal_Cmd({
                        'func': 'LocalStorageSave',
                        'prefix': $in.prefix,
                        'key': $in.key,
                        'data': {} // Empty data means delete this key
                    });
                    continue;
                }

                $newIndex[$key] = $index[$key];
                $newIndex[$key].timestamp_added = $currentTimeStamp;
            }

            $out.message = 'Have validated the cache for the "' + $in.prefix + '" index';

            if (_Count($newIndex) > 0) {
                $response = internal_Cmd({
                    'func': 'LocalStorageSave',
                    'prefix': $in.prefix,
                    'key': 'index',
                    'data': $newIndex
                });
                $out.message = $response.message;
            }

        }

        return {
            'answer': $out.answer,
            'message': $out.message
        };
    };

    // *****************************************************************************
    // * Internal function that you only can reach from internal_Cmd
    // * Function name are in internal_CamelCase
    // * An internal function get all its data from the $in-array
    // * An internal function give its answer as an array, success or error
    // *****************************************************************************

    /**
     * Load data from index
     * @version 2015-06-06
     * @since   2015-05-18
     * @author  Peter Lembke
     * @param $in
     * @returns {{answer: string, message: string, plugin_index: {}}}
     */
    $functions.push('internal_LoadDataFromIndex');
    const internal_LoadDataFromIndex = function ($in)
    {
        const $default = {
            'prefix': '',
            'key': ''
        };
        $in = _Default($default,$in);

        const $defaultOut = {
            'answer': 'true',
            'message': 'Can not load key "' + $in.key + '" from the "' + $in.prefix + '" index',
            'found': 'false',
            'data': {}
        };
        let $out = _ByVal($defaultOut);

        block:
        {
            if ($in.key === '') {
                $out.message = 'Please provide a key to read from the index';
                break block;
            }

            const $response = internal_Cmd({
                'func': 'LocalStorageLoad',
                'prefix': $in.prefix,
                'key': 'index'
            });

            if ($response.answer === 'false') {
                $out.message = $response.message;
                break block;
            }

            if (typeof $response.data[$in.key] === 'undefined') {
                $out.message = 'Key "' + $in.key + '" was not found in the "' + $in.prefix + '" index';
                break block;
            }

            $out.data = $response.data[$in.key];
            $out.message = 'Here are the data in key "' + $in.key + '" from the "' + $in.prefix + '" index';
            $out.found = 'true';

        }
        $out = _Default($defaultOut, $out);
        return $out;
    };

    /**
     * Save data to index
     * @version 2015-06-06
     * @since   2015-05-18
     * @author  Peter Lembke
     * @param $in
     * @returns {{answer: string, message: string, plugin_index: {}}}
     */
    $functions.push('internal_SaveDataToIndex');
    const internal_SaveDataToIndex = function ($in)
    {
        const $default = {
            'prefix': '',
            'key': '',
            'checksum': ''
        };
        $in = _Default($default,$in);

        let $out = {
            'answer': 'false',
            'message': '',
            'same_checksum': 'false'
        };

        let $index;

        block: {
            if ($in.key === '') {
                $out.message = 'Please provide a key';
                break block;
            }
            if ($in.checksum === '') {
                $out.message = 'Please provide a checksum';
                break block;
            }

            let $response = internal_Cmd({
                'func': 'LocalStorageLoad',
                'prefix': $in.prefix,
                'key': 'index'
            } );

            if ($response.answer === 'false') {
                $out.message = $response.message;
                break block;
            }
            $index = $response.data;

            if (typeof $index[$in.key] !== 'undefined') {
                if ($index[$in.key].checksum === $in.checksum) {
                    $out.same_checksum = 'true';
                }
            }

            $index[$in.key] = {
                'checksum': $in.checksum,
                'timestamp_added': _MicroTime()
            };

            $response = internal_Cmd({
                'func': 'LocalStorageSave',
                'prefix': $in.prefix,
                'key': 'index',
                'data': $index
            } );

            if ($response.answer === 'false') {
                $out.message = $response.message;
                break block;
            }

            $out.answer = 'true';
            $out.message = 'Added key "' + $in.key + '" to the "' + $in.prefix + '" index';
        }

        return {
            'answer': $out.answer,
            'message': $out.message,
            'index': $index,
            'same_checksum': $out.same_checksum
        };
    };

    /**
     * Remove data from index
     * @version 2015-05-18
     * @since   2015-05-18
     * @author  Peter Lembke
     * @param $in
     * @returns {{answer: string, message: string, plugin_index: {}}}
     */
    $functions.push('internal_RemoveDataFromIndex');
    const internal_RemoveDataFromIndex = function ($in)
    {
        const $default = {
            'prefix': '',
            'key': ''
        };
        $in = _Default($default,$in);

        let $out = {
            'answer': 'false',
            'message': ''
        };

        let $index = {};

        block:
        {
            if ($in.key === '') {
                $out.message = 'Please provide a key';
                break block;
            }

            let $response = internal_Cmd({
                'func': 'LocalStorageLoad',
                'prefix': $in.prefix,
                'key': 'index'
            });

            if ($response.answer === 'false') {
                $out.message = 'Could not load the "' + $in.prefix + '" index';
                break block;
            }

            $index = $response.data;
            if (typeof $index[$in.key] === 'undefined') {
                $out.message = 'Key "' + $in.key + '" was not in the "' + $in.prefix + '" index';
                // break block;
            }
            delete $index[$in.key];

            $response = internal_Cmd({
                'func': 'LocalStorageSave',
                'prefix': $in.prefix,
                'key': 'index',
                'data': $index
            });

            if ($response.answer === 'false') {
                $out.message = 'Could not save the "' + $in.prefix + '" index';
                break block;
            }
            $out.message = 'Removed key "' + $in.key + '" from the "' + $in.prefix + '" index';
            $out.answer = 'true';
        }

        return {
            'answer': $out.answer,
            'message': $out.message,
            'index': $index,
            'prefix': $in.prefix,
            'key': $in.key
        };
    };

    /**
     * Get all index data
     * @version 2017-02-25
     * @since   2017-02-25
     * @author  Peter Lembke
     * @param $in
     * @returns {{answer: string, message: string, plugin_index: {}}}
     */
    $functions.push('internal_LoadIndex');
    const internal_LoadIndex = function ($in)
    {
        const $default = {
            'prefix': ''
        };
        $in = _Default($default,$in);

        let $response = internal_Cmd({
            'func': 'LocalStorageLoad',
            'prefix': $in.prefix,
            'key': 'index'
        });

        return {
            'answer': 'true',
            'message': 'This is what I found',
            'index': $response.data,
            'prefix': $in.prefix
        };
    };

    /**
     * Set all index data
     * @version 2017-02-29
     * @since   2017-02-29
     * @author  Peter Lembke
     * @param $in
     * @returns {{answer: string, message: string, plugin_index: {}}}
     */
    $functions.push('internal_SaveIndex');
    const internal_SaveIndex = function ($in)
    {
        const $default = {
            'prefix': '',
            'index': {}
        };
        $in = _Default($default,$in);

        const $response = internal_Cmd({
            'func': 'LocalStorageSave',
            'prefix': $in.prefix,
            'key': 'index',
            'data': $in.index
        });

        return {
            'answer': $response.answer,
            'message': $response.message,
            'index': $in.index,
            'prefix': $in.prefix
        };
    };

    /**
     * Load data from the local storage if it exist
     * @param $in
     * @returns {{answer: string, message: string}}
     */
    $functions.push('internal_LocalStorageLoad');
    const internal_LocalStorageLoad = function ($in)
    {
        const $default = {
            'prefix': '',
            'key': ''
        };
        $in = _Default($default,$in);

        let $out = {
            'answer': 'true',
            'message': 'Data was not found',
            'data': {},
            'found': 'false'
        };

        let $key;

        block:
        {
            if (_LocalStorageExist() === 'false') {
                $out.message = 'No support for local storage';
                break block;
            }

            let  $prefix = $in.prefix;
            if ($prefix !== '') {
                $prefix = $prefix + '_';
            }
            $key = $prefix + $in.key;

            if (typeof(Storage) !== "undefined") {
                try {
                    $out.data = localStorage.getItem($key);
                } catch (e) {
                    $out.message = 'Failed to load key "' + $key + '", got an exception: '. e.message;
                    break block;
                }
            }

            if ($out.data === null) {
                $out.data = {};
                $out.message = 'You get an empty object. Key "' + $key + '" was not found';
                break block;
            }

            $out.message = 'Data was found';
            $out.found = 'true';

            const $character = $out.data.substring(0,1);

            if ($character === '{' || $character === '[') {
                $out.data = JSON.parse($out.data);
                $out.message = $out.message + ' and parsed';
            }
        }

        return {
            'answer': $out.answer,
            'message': $out.message,
            'data': $out.data,
            'found': $out.found,
            'key': $key
        };
    };

    /**
     * Save data to the local storage if it exist
     * @param $in
     * @returns {{answer: string, message: string, key: *}}
     */
    $functions.push('internal_LocalStorageSave');
    const internal_LocalStorageSave = function ($in)
    {
        const $default = {
            'prefix': '',
            'key': '',
            'data': {}
        };

        const $out = {
            'answer': 'false',
            'message': ''
        };

        let $key = $in.key;

        block:
        {
            if (_LocalStorageExist() === 'false') {
                $out.message = 'No support for local storage';
                break block;
            }

            $in = _Default($default,$in);
            $out.answer = 'true';

            let $prefix = $in.prefix;
            if ($prefix !== '') {
                $prefix = $prefix + '_';
            }
            $key = $prefix + $in.key;

            if (_Empty($in.data) === 'true') {
                if (typeof(Storage) !== "undefined") {
                    try {
                        localStorage.removeItem($key);
                    } catch (e) {
                        $out.message = 'Data is empty. Failed to remove key "' + $key + '", got an exception: '. e.message;
                        break block;
                    }
                }
                $out.message = 'Data is empty. Removed key "' + $key + '" from local storage';
                break block;
            }

            $in.data = JSON.stringify($in.data);
            if (typeof(Storage) !== "undefined") {
                try {
                    localStorage.setItem($key, $in.data);
                } catch (e) {
                    $out.message = 'Failed to save key "' + $key + '", got an exception: '. e.message;
                    break block;
                }
            }
            $out.message = 'Stored data in key "' + $key + '"';
            $out.answer = 'true';

        }

        return {
            'answer': $out.answer,
            'message': $out.message,
            'key': $key
        };
    };

}
//# sourceURL=infohub_cache.js