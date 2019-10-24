/**
 * infohub_storage store data in databases and is part of InfoHub.
 * Started writing code 2010-04-15 Peter Lembke - Team Fakta CharZam soft
 * Support for SQLite3, MySQL, PostgreSQL, indexedDb, Future support:Oracle, MS SQL, localForage
 * @category infohub
 * @package storage
 * @copyright Copyright (c) 2010, Peter Lembke, CharZam soft
 * @since 2018-03-17
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
function infohub_storage_data_idbkeyval() {

// include "infohub_base.js"

    // ***********************************************************
    // * your private class variables below, only declare with var
    // ***********************************************************

    $functions.push('_Version');
    var _Version = function () {
        return {
            'date': '2019-03-09',
            'version': '1.0.0',
            'class_name': 'infohub_storage_data_idbkeyval',
            'checksum': '{{checksum}}',
            'note': 'Uses the local storage engine indexedDb trough the library idbkeyval to store key value',
            'status': 'normal',
            'license_name': 'GNU GPL 3 or later'
        };
    };

    $functions.push('_GetCmdFunctions');
    var _GetCmdFunctions = function () {
        return {
            'read': 'normal',
            'write': 'normal',
            'read_paths': 'normal' // Get a list of matching paths
        };
    };

    var $WriteCache = {};

    /**
     * You give connection credentials and a path,
     * you get the data stored on that path.
     * @param array $in
     * @return array
     */
    $functions.push('read');
    var read = function ($in)
    {
        "use strict";

        let $postExist;

        const $default = {
            'connect': {
                'plugin_name_handler': 'infohub_storage_data_idbkeyval',
                'plugin_name_owner': '',
                'db_type': 'idbkeyval',
                'db_name': 'infohub'
            },
            'path': '',
            'callback_function': null
        };
        $in = _Default($default, $in);

        if (!window.idbKeyval) {
            $in.callback_function({
                'answer': 'false',
                'message': 'idbkeyval is not installed'
            });
        }

        idbKeyval.get($in.path).then(function(value)
        {
            $postExist = 'true';

            if (_Empty(value) === 'true')
            {
                $postExist = 'false';
                value = '{}';
                if (_Empty($WriteCache[$in.path]) === 'false') {
                    value = $WriteCache[$in.path];
                }
            }

            value = JSON.parse(value);

            $in.callback_function({
                'answer': 'true',
                'message': 'Here are the data I found in IndexedDb',
                'path': $in.path,
                'data': value,
                'post_exist': $postExist
            });
        }).catch(function (err) {
            $in.callback_function({
                'answer': 'false',
                'message': 'Error' + err,
                'path': $in.path,
                'data': {},
                'post_exist': 'false'
            });
        });

        return {};
    };

    /**
     * Write data to the database
     * Give connection credentials, a path and the data.
     * If data is empty then the post is deleted.
     * @param array $in
     * @return array
     */
    $functions.push('write');
    var write = function ($in)
    {
        "use strict";

        var $default = {
            'connect': {
                'plugin_name_handler': 'infohub_storage_data_idbkeyval',
                'plugin_name_owner': '',
                'db_type': 'idbkeyval',
                'db_name': 'infohub'
            },
            'path': '',
            'data': {},
            'callback_function': null
        };
        $in = _Default($default, $in);

        if (!window.idbKeyval) {
            $in.callback_function({
                'answer': 'false',
                'message': 'idbkeyval is not installed'
            });
            return {};
        }

        var $dataString = JSON.stringify($in.data);

        $WriteCache[$in.path] = $dataString;

        idbKeyval.set($in.path, $dataString).then(function ()
        {
            delete $WriteCache[$in.path];
            $in.callback_function({
                'answer': 'true',
                'message': 'Here are the data I wrote to indexedDb',
                'path': $in.path,
                'data': $in.data,
                'post_exist': 'true'
            });
        }).catch(function (err) {
            $in.callback_function({
                'answer': 'false',
                'message': 'Error' + err,
                'path': $in.path,
                'data': $in.data,
                'post_exist': 'false'
            });
        });

        return {};
    };

    /**
     * You give an active db connection and a path with % in it,
     * you get a list with all matching paths
     * @param array $in
     * @return array
     */
    $functions.push('read_paths');
    var read_paths = function ($in)
    {
        "use strict";

        var $data = {}, $key, $path,
            $default = {
                'path': '',
                'callback_function': null
            };
        $in = _Default($default, $in);

        if (!window.idbKeyval)
        {
            $in.callback_function({
                'answer': 'false',
                'message': 'idbkeyval is not installed',
                'path': $in.path,
                'data': $data
            });
            return {};
        }

        window.idbKeyval.keys().then(function(keys)
        {
            $in.path = $in.path.substr(0, $in.path.indexOf('*'));

            for ($key in keys) {
                if (keys.hasOwnProperty($key)) {
                    $path = keys[$key];
                    if ($path.indexOf($in.path) === 0) {
                        $data[$path] = {};
                    }
                }
            }

            $in.callback_function({
                'answer': 'true',
                'message': 'Here are the paths',
                'path': $in.path,
                'data': $data
            });

        }).catch(function(err) {
            $in.callback_function({
                'answer': 'false',
                'message': err,
                'path': $in.path,
                'data': $data
            });
        });

        return {};
    };
}

/**
 * idb-Keyval
 * https://github.com/jakearchibald/idb-keyval/blob/master/dist/idb-keyval-iife.js
 * @type undefined
 */
var idbKeyval = (function (exports) {
'use strict';

class Store {
    constructor(dbName = 'keyval-store', storeName = 'keyval') {
        this.storeName = storeName;
        this._dbp = new Promise((resolve, reject) => {
            const openreq = indexedDB.open(dbName, 1);
            openreq.onerror = () => reject(openreq.error);
            openreq.onsuccess = () => resolve(openreq.result);
            // First time setup: create an empty object store
            openreq.onupgradeneeded = () => {
                openreq.result.createObjectStore(storeName);
            };
        });
    }
    _withIDBStore(type, callback) {
        return this._dbp.then(db => new Promise((resolve, reject) => {
            const transaction = db.transaction(this.storeName, type);
            transaction.oncomplete = () => resolve();
            transaction.onabort = transaction.onerror = () => reject(transaction.error);
            callback(transaction.objectStore(this.storeName));
        }));
    }
}
let store;
function getDefaultStore() {
    if (!store)
        store = new Store();
    return store;
}
function get(key, store = getDefaultStore()) {
    let req;
    return store._withIDBStore('readonly', store => {
        req = store.get(key);
    }).then(() => req.result);
}
function set(key, value, store = getDefaultStore()) {
    return store._withIDBStore('readwrite', store => {
        store.put(value, key);
    });
}
function del(key, store = getDefaultStore()) {
    return store._withIDBStore('readwrite', store => {
        store.delete(key);
    });
}
function clear(store = getDefaultStore()) {
    return store._withIDBStore('readwrite', store => {
        store.clear();
    });
}
function keys(store = getDefaultStore()) {
    const keys = [];
    return store._withIDBStore('readonly', store => {
        // This would be store.getAllKeys(), but it isn't supported by Edge or Safari.
        // And openKeyCursor isn't supported by Safari.
        (store.openKeyCursor || store.openCursor).call(store).onsuccess = function () {
            if (!this.result)
                return;
            keys.push(this.result.key);
            this.result.continue();
        };
    }).then(() => keys);
}

exports.Store = Store;
exports.get = get;
exports.set = set;
exports.del = del;
exports.clear = clear;
exports.keys = keys;

return exports;

}({}));
//# sourceURL=infohub_storage_data_idbkeyval.js
