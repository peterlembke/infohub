/**
 * infohub_storage_data_indexeddb
 * Uses the local storage enginge IndexedDb
 *
 * @package     Infohub
 * @subpackage  infohub_storage_data_indexeddb
 * @since       
 * @author      Peter Lembke <info@infohub.se>
 * @license     GPL-3.0-or-later
 * @copyright   Copyright (C) 2010- Peter Lembke
 */
function infohub_storage_data_indexeddb() {

    'use strict';

// include "infohub_base.js"

    $functions.push('_Version');
    const _Version = function() {
        return {
            'date': '2017-08-26',
            'version': '1.0.0',
            'class_name': 'infohub_storage_data_indexeddb',
            'checksum': '{{checksum}}',
            'note': 'Uses the local storage enginge IndexedDb',
            'status': 'normal',
            'SPDX-License-Identifier': 'GPL-3.0-or-later',
        };
    };

    $functions.push('_GetCmdFunctions');
    const _GetCmdFunctions = function() {
        const $list = {
            'read': 'normal',
            'write': 'normal',
        };

        return _GetCmdFunctionsBase($list);
    };

    /**
     * You give connection credentials and a path,
     * you get the data stored on that path.
     * @param array $in
     * @return array
     */
    $functions.push('read');
    const read = function($in = {}) {
        const $default = {
            'connect': {
                'plugin_name_handler': 'infohub_storage_data_indexeddb',
                'plugin_name_owner': '',
                'db_type': 'indexeddb',
                'db_name': 'infohub',
            },
            'path': '',
            'callback_function': null,
        };
        $in = _Default($default, $in);

        const $storeName = $in.connect.plugin_name_owner;

        if (!window.indexedDB) {
            $in.callback_function({
                'answer': 'false',
                'message': 'Indexed Db is not installed',
            });
        }

        let $request = window.indexedDB.open($in.connect.db_name);

        $request.onerror = function(event) {
            // General error handler that take all bubbled errors
            $in.callback_function({
                'answer': 'false',
                'message': 'Error: ' + event.target.errorCode,
            });
        };

        $request.onblocked = function(event) {
            $in.callback_function({
                'answer': 'false',
                'message': 'Previous database connection was not closed',
            });
        };

        $request.onupgradeneeded = function(event) {
            $in.callback_function({
                'answer': 'false',
                'message': 'Database do not exist',
            });
        };

        $request.onsuccess = function(event) {
            let $database = event.target.result;
            const $storeExist = $database.objectStoreNames.contains($storeName);
            if ($storeExist === false) {
                $in.callback_function({
                    'answer': 'false',
                    'message': 'The table you want to read do not exist',
                });
                return {};
            }

            let $transaction = $database.transaction($storeName, 'readwrite');
            let $store = $transaction.objectStore($storeName);
            let $get = $store.get($in.path);
            $get.onsuccess = function(event) {
                $in.callback_function({
                    'answer': 'true',
                    'message': 'Here are the data',
                    'path': $in.path,
                    'data': event.target.result,
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
    const write = function($in = {}) {
        const $default = {
            'connect': {
                'plugin_name_handler': 'infohub_storage_data_indexeddb',
                'plugin_name_owner': '',
                'db_type': 'indexeddb',
                'db_name': 'infohub',
            },
            'path': '',
            'data': {},
            'callback_function': null,
        };
        $in = _Default($default, $in);

        const $storeName = $in.connect.plugin_name_owner;
        const $indexName = $storeName + '-index';

        if (!window.indexedDB) {
            $in.callback_function({
                'answer': 'false',
                'message': 'Indexed Db is not installed',
            });
            return {};
        }

        let $request = window.indexedDB.open($in.connect.db_name);

        $request.onerror = function(event) {
            // General error handler that take all bubbled errors
            $in.callback_function({
                'answer': 'false',
                'message': 'Error: ' + event.target.errorCode,
            });
            return {};
        };

        $request.onblocked = function(event) {
            $in.callback_function({
                'answer': 'false',
                'message': 'Previous database connection was not closed',
            });
            return {};
        };

        $request.onupgradeneeded = function(event) {
            let $database = event.target.result;
            let $store = $database.createObjectStore($storeName,
                {keyPath: 'bubble_path'});
            let $index = $store.createIndex($indexName, ['bubble_path'],
                {unique: true});
        };

        $request.onsuccess = function(event) {
            let $database = event.target.result;
            let $storeExist = $database.objectStoreNames.contains($storeName);
            if ($storeExist === false) {
                const $newVersion = $database.version + 1;
                $database.close();

                let $dbUpdate = window.indexedDB.open($in.connect.db_name,
                    $newVersion);

                $dbUpdate.onupgradeneeded = function(event) {
                    let $database = event.target.result;
                    let $store = $database.createObjectStore($storeName,
                        {keyPath: 'bubble_path'});
                    let $index = $store.createIndex($indexName, ['bubble_path'],
                        {unique: true});

                    $store.transaction.oncomplete = function(event) {
                        let $transaction = $database.transaction($storeName,
                            'readwrite');
                        $store = $transaction.objectStore($storeName);

                        if (_Empty($in.data) === 'true') {
                            let $delete = $store.delete($in.path);
                            $delete.onsuccess = function(event) {
                                $in.callback_function({
                                    'answer': 'true',
                                    'message': 'Data was deleted',
                                    'path': $in.path,
                                    'data': $in.data,
                                });
                                return {};
                            };
                        } else {
                            $in.data.bubble_path = $in.path;
                            let $put = $store.put($in.data);
                            $put.onsuccess = function(event) {
                                $in.callback_function({
                                    'answer': 'true',
                                    'message': 'Data was written',
                                    'path': $in.path,
                                    'data': $in.data,
                                });
                                return {};
                            };
                        }
                    };
                };
            } else {
                let $transaction = $database.transaction($storeName,
                    'readwrite');
                let $store = $transaction.objectStore($storeName);

                if (_Empty($in.data) === 'true') {
                    let $delete = $store.delete($in.path);
                    $delete.onsuccess = function(event) {
                        $in.callback_function({
                            'answer': 'true',
                            'message': 'Data was deleted',
                            'path': $in.path,
                            'data': $in.data,
                        });

                        return {};
                    };
                } else {
                    $in.data.bubble_path = $in.path;
                    let $put = $store.put($in.data);
                    $put.onsuccess = function(event) {
                        $in.callback_function({
                            'answer': 'true',
                            'message': 'Data was written',
                            'path': $in.path,
                            'data': $in.data,
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