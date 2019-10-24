/**
 * infohub_storage store data in databases and is part of InfoHub.
 * Started writing code 2010-04-15 Peter Lembke - Team Fakta CharZam soft
 * Support for SQLite3, MySQL, PostgreSQL, Future support:Oracle, MS SQL
 * @category infohub
 * @package storage_mysql
 * @copyright Copyright (c) 2010, Peter Lembke, CharZam soft
 * @since 2014-12-06
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
function infohub_storage_data_indexeddb() {

// include "infohub_base.js"

    // ***********************************************************
    // * your private class variables below, only declare with var
    // ***********************************************************

    $functions.push('_Version');
    var _Version = function () {
        return {
            'date': '2017-08-26',
            'version': '1.0.0',
            'class_name': 'infohub_storage_data_indexeddb',
            'checksum': '{{checksum}}',
            'note': 'Uses the local storage enginge IndexedDb',
            'status': 'normal',
            'license_name': 'GNU GPL 3 or later'
        };
    };

    $functions.push('_GetCmdFunctions');
    var _GetCmdFunctions = function () {
        return {
            'read': 'normal',
            'write': 'normal'
        };
    };

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

        const $default = {
            'connect': {
                'plugin_name_handler': 'infohub_storage_data_indexeddb',
                'plugin_name_owner': '',
                'db_type': 'indexeddb',
                'db_name': 'infohub'
            },
            'path': '',
            'callback_function': null
        };
        $in = _Default($default, $in);

        var $storeName = $in.connect.plugin_name_owner;

        if (!window.indexedDB) {
            $in.callback_function({
                'answer': 'false',
                'message': 'Indexed Db is not installed'
            });
        }

        var $request = window.indexedDB.open($in.connect.db_name);

        $request.onerror = function(event) {
            // General error handler that take all bubbled errors
            $in.callback_function({
                'answer': 'false',
                'message': 'Error: ' + event.target.errorCode
            });
        };

        $request.onblocked = function(event) {
            $in.callback_function({
                'answer': 'false',
                'message': 'Previous database connection was not closed'
            });
        };

        $request.onupgradeneeded = function(event) {
            $in.callback_function({
                'answer': 'false',
                'message': 'Database do not exist'
            });
        };

        $request.onsuccess = function(event) {
            var $database = event.target.result;
            var $storeExist = $database.objectStoreNames.contains($storeName);
            if ($storeExist === false) {
                $in.callback_function({
                    'answer': 'false',
                    'message': 'The table you want to read do not exist'
                });
                return {};
            }

            var $transaction = $database.transaction($storeName, "readwrite");
            var $store = $transaction.objectStore($storeName);
            var $get = $store.get($in.path);
            $get.onsuccess = function (event) {
                $in.callback_function({
                    'answer': 'true',
                    'message': 'Here are the data',
                    'path': $in.path,
                    'data': event.target.result
                });
            };
        };

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

        const $default = {
            'connect': {
                'plugin_name_handler': 'infohub_storage_data_indexeddb',
                'plugin_name_owner': '',
                'db_type': 'indexeddb',
                'db_name': 'infohub'
            },
            'path': '',
            'data': {},
            'callback_function': null
        };
        $in = _Default($default, $in);

        var $storeName = $in.connect.plugin_name_owner;
        var $indexName = $storeName + '-index';

        if (!window.indexedDB) {
            $in.callback_function({
                'answer': 'false',
                'message': 'Indexed Db is not installed'
            });
            return {};
        }

        var $request = window.indexedDB.open($in.connect.db_name);

        $request.onerror = function(event) {
            // General error handler that take all bubbled errors
            $in.callback_function({
                'answer': 'false',
                'message': 'Error: ' + event.target.errorCode
            });
            return {};
        };

        $request.onblocked = function(event) {
            $in.callback_function({
                'answer': 'false',
                'message': 'Previous database connection was not closed'
            });
            return {};
        };

        $request.onupgradeneeded = function(event) {
            var $database = event.target.result;
            var $store = $database.createObjectStore($storeName, {keyPath: "bubble_path"});
            var $index = $store.createIndex($indexName, ["bubble_path"], { unique: true });
        };

        $request.onsuccess = function(event) {
            var $database = event.target.result;
            var $storeExist = $database.objectStoreNames.contains($storeName);
            if ($storeExist === false) {
                var $newVersion = $database.version + 1;
                $database.close();

                var $dbUpdate = window.indexedDB.open($in.connect.db_name, $newVersion);

                $dbUpdate.onupgradeneeded = function(event) {
                    var $database = event.target.result;
                    var $store = $database.createObjectStore($storeName, {keyPath: "bubble_path"});
                    var $index = $store.createIndex($indexName, ["bubble_path"], { unique: true });

                    $store.transaction.oncomplete = function(event)
                    {
                        var $transaction = $database.transaction($storeName, "readwrite");
                        $store = $transaction.objectStore($storeName);

                        if (_Empty($in.data) === 'true') {
                            var $delete = $store.delete($in.path);
                            $delete.onsuccess = function (event) {
                                $in.callback_function({
                                    'answer': 'true',
                                    'message': 'Data was deleted',
                                    'path': $in.path,
                                    'data': $in.data
                                });
                                return {};
                            };
                        } else {
                            $in.data.bubble_path = $in.path;
                            var $put = $store.put($in.data);
                            $put.onsuccess = function (event) {
                                $in.callback_function({
                                    'answer': 'true',
                                    'message': 'Data was written',
                                    'path': $in.path,
                                    'data': $in.data
                                });
                                return {};
                            };
                        }
                    };

                };
            } else {
                var $transaction = $database.transaction($storeName, "readwrite");
                var $store = $transaction.objectStore($storeName);

                if (_Empty($in.data) === 'true') {
                    var $delete = $store.delete($in.path);
                    $delete.onsuccess = function (event) {
                        $in.callback_function({
                            'answer': 'true',
                            'message': 'Data was deleted',
                            'path': $in.path,
                            'data': $in.data
                        });
                        return {};
                    };
                } else {
                    $in.data.bubble_path = $in.path;
                    var $put = $store.put($in.data);
                    $put.onsuccess = function (event) {
                        $in.callback_function({
                            'answer': 'true',
                            'message': 'Data was written',
                            'path': $in.path,
                            'data': $in.data
                        });
                        return {};
                    };
                }

            }

        };

        return {};
    };

}
//# sourceURL=infohub_storage_data_indexeddb.js