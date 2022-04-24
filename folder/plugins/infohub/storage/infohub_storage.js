/**
 Copyright (C) 2017 Peter Lembke, CharZam soft
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
 * Class infohub_storage
 * The storage is a table in a database. A bubble is a post with child posts.
 * The first bubbles name is main and come from the main database, main storage.
 */
function infohub_storage() {

    'use strict';

// include "infohub_base.js"

    const _Version = function() {
        return {
            'date': '2018-03-25',
            'since': '2018-03-25',
            'version': '1.1.0',
            'checksum': '{{checksum}}',
            'class_name': 'infohub_storage',
            'note': 'Store your data. Simple, Stand alone',
            'status': 'normal',
            'SPDX-License-Identifier': 'GPL-3.0-or-later',
            'user_role': '',
            'web_worker': 'true',
            'core_plugin': 'false',
        };
    };

    const _GetCmdFunctions = function() {
        const $list = {
            'read': 'normal',
            'write': 'normal',
            'read_many': 'normal',
            'write_many': 'normal',
            'read_pattern': 'normal',
            'write_pattern': 'normal',
            'read_paths': 'normal'
        };

        return _GetCmdFunctionsBase($list);
    };

    let $MemoryCache = {},
        $NotInDb = {};

    // *****************************************************************************
    // * The private functions, add your own in your plugin
    // * These functions can be used directly in your functions.
    // * Name: _CamelCaseData
    // *****************************************************************************

    /**
     * General function for reading a bubble
     * @version 2017-09-03
     * @since   2016-01-30
     * @author  Peter Lembke
     * @param $in
     * @returns {*}
     */
    $functions.push('read');
    const read = function($in = {}) {
        const $default = {
            'path': '',
            'wanted_data': {},
            'step': 'step_start',
            'from_plugin': {
                'node': '',
                'plugin': '',
            },
            'calling_plugin': {
                'node': '',
                'plugin': '',
            },
            'callback_function': null,
        };
        $in = _Default($default, $in);

        $in.path = $in.path.toLowerCase().trim();

        let $out = {
            'answer': 'false',
            'message': '',
            'path': $in.path,
            'data': {},
            'wanted_data': $in.wanted_data,
            'post_exist': 'false',
        };

        leave: {
            if (!window.idbKeyval) {
                $out.message = 'idbkeyval is not installed';
                break leave;
            }

            if ($in.from_plugin.node !== 'client') {
                $out.message = 'I only accept messages that origin from this client node';
                break leave;
            }

            if ($in.from_plugin.plugin === 'infohub_storage') {
                if (_Empty($in.calling_plugin.plugin) === 'true') {
                    $out.message = 'Infohub Storage must set calling_plugin before calling read';
                    break leave;
                }
                if ($in.calling_plugin.node !== 'client') {
                    $in.response.message = 'I only accept messages from this client node';
                    break leave;
                }
                $in.from_plugin.plugin = $in.calling_plugin.plugin;
            }

            if ($in.path.indexOf($in.from_plugin.plugin + '/') !== 0) {
                const $row = 'Your plugin: %s, is not allowed to read this path: %s';
                $out.message = _SprintF($row, [$in.from_plugin.plugin, $in.path]);
                break leave;
            }

            if (_Empty($MemoryCache[$in.path]) === 'false') {
                const $value = $MemoryCache[$in.path];
                $out.data = JSON.parse($value);
                $out.answer = 'true';
                $out.message = 'Here are the data I found in the memory cache';
                $out.post_exist = 'true';
                break leave;
            }

            if (_Empty($NotInDb[$in.path]) === 'false') {
                $out.message = 'Error: You have asked for this path before. It is not in the database';
                break leave;
            }

            idbKeyval.get($in.path).then(function($value) {
                let $postExist = 'true';

                if (_Empty($value) === 'true') {
                    $postExist = 'false';
                    $value = '{}';
                    if (_Empty($MemoryCache[$in.path]) === 'false') {
                        $value = $MemoryCache[$in.path];
                    }
                }

                $value = JSON.parse($value);

                if (_Empty($in.wanted_data) === 'false') {
                    $value = _Default($in.wanted_data, $value);
                }

                $in.callback_function({
                    'answer': 'true',
                    'message': 'Here are the data I found in IndexedDb',
                    'path': $in.path,
                    'data': $value,
                    'wanted_data': $out.wanted_data,
                    'post_exist': $postExist,
                });
            }).catch(function(err) {
                $in.callback_function({
                    'answer': 'false',
                    'message': 'Error' + err,
                    'path': $in.path,
                    'data': {},
                    'wanted_data': $out.wanted_data,
                    'post_exist': 'false',
                });
            });

            return {};
        }

        return {
            'answer': $out.answer,
            'message': $out.message,
            'path': $out.path,
            'data': $out.data,
            'wanted_data': $out.wanted_data,
            'post_exist': $out.post_exist,
        };
    };

    /**
     * General function for writing to a path
     * @version 2017-09-03
     * @since   2016-01-30
     * @author  Peter Lembke
     * @param $in
     * @returns {*}
     */
    $functions.push('write');
    const write = function($in = {}) {
        const $default = {
            'path': '',
            'data': {},
            'mode': 'overwrite', // Overwrite or merge
            'step': 'step_start',
            'from_plugin': {
                'node': '',
                'plugin': '',
            },
            'calling_plugin': {
                'node': '',
                'plugin': '',
            },
            'response': {},
            'data_back': {},
            'callback_function': null
        };
        $in = _Default($default, $in);

        let $out = {
            'answer': 'false',
            'message': '',
            'path': $in.path,
            'mode': $in.mode,
            'data': $in.data,
            'post_exist': 'false',
        };

        leave: {
            if (!window.idbKeyval) {
                $out.message = 'idbkeyval is not installed';
                break leave;
            }

            if ($in.from_plugin.node !== 'client') {
                $out.message = 'I only accept messages that origin from this client node';
                break leave;
            }

            if ($in.mode !== 'overwrite' && $in.mode !== 'merge') {
                $out.message = 'I only accept mode overwrite (default) or merge';
                break leave;
            }

            if ($in.from_plugin.plugin === 'infohub_storage') {
                if (_Empty($in.calling_plugin.plugin) === 'true') {
                    $out.message = 'Infohub Storage must set calling_plugin before calling read';
                    break leave;
                }
                if ($in.calling_plugin.node !== 'client') {
                    $out.message = 'I only accept messages from this client node';
                    break leave;
                }
                $in.from_plugin.plugin = $in.calling_plugin.plugin;
            }

            if ($in.path.indexOf($in.from_plugin.plugin + '/') !== 0) {
                const $row = 'Your plugin: %s, is not allowed to write to this path: %s';
                $out.message = _SprintF($row, [$in.from_plugin.plugin, $in.path]);
                break leave;
            }

            if ($in.step === 'step_start') {
                $in.step = 'step_write';
                if ($in.mode === 'merge') {
                    $in.step = 'step_read';
                }
            }

            if ($in.step === 'step_read') {
                return _SubCall({
                    'to': {
                        'node': 'client',
                        'plugin': 'infohub_storage',
                        'function': 'read',
                    },
                    'data': {
                        'path': $in.path,
                        'calling_plugin': $in.calling_plugin,
                    },
                    'data_back': {
                        'calling_plugin': $in.calling_plugin,
                        'path': $in.path,
                        'data': $in.data,
                        'mode': $in.mode,
                        'step': 'step_read_response'
                    },
                });
            }

            if ($in.step === 'step_read_response') {
                $in.data = _Merge($in.data_back.data, $in.response.data);
                $in.step = 'step_write';
            }

            if ($in.step === 'step_write') {
                $in.path = $in.path.trim();

                if (_Empty($in.data) === 'true') {

                    delete $MemoryCache[$in.path];
                    $NotInDb[$in.path] = 'true';

                    idbKeyval.del($in.path).then(function() {
                        $in.callback_function({
                            'answer': 'true',
                            'message': 'Deleted the post in indexedDb',
                            'path': $in.path,
                            'data': $in.data,
                            'post_exist': 'false', // Successfully deleted the post
                        });
                    }).catch(function(err) {
                        delete $MemoryCache[$in.path];
                        delete $NotInDb[$in.path];
                        $in.callback_function({
                            'answer': 'false',
                            'message': 'Error' + err,
                            'path': $in.path,
                            'mode': $in.mode,
                            'data': $in.data,
                            'post_exist': 'true', // @todo Post still exist if it existed from the beginning
                        });
                    });

                } else {

                    let $dataString = JSON.stringify($in.data);
                    $MemoryCache[$in.path] = $dataString;
                    delete $NotInDb[$in.path];

                    idbKeyval.set($in.path, $dataString).then(function() {
                        $in.callback_function({
                            'answer': 'true',
                            'message': 'Here are the data I wrote to indexedDb',
                            'path': $in.path,
                            'mode': $in.mode,
                            'data': $in.data,
                            'post_exist': 'true',
                        });
                    }).catch(function(err) {
                        delete $MemoryCache[$in.path];
                        delete $NotInDb[$in.path];
                        $in.callback_function({
                            'answer': 'false',
                            'message': 'Error' + err,
                            'path': $in.path,
                            'mode': $in.mode,
                            'data': $in.data,
                            'post_exist': 'false', // @todo Might exist if it existed from the beginning
                        });
                    });

                }

                return {};
            }
        }

        return {
            'answer': $out.answer,
            'message': $out.message,
            'path': $out.path,
            'mode': $out.mode,
            'data': $out.data,
            'post_exist': $out.post_exist,
        };
    };

    /**
     * General function for reading data from multiple paths
     * @version 2018-03-14
     * @since   2018-03-14
     * @author  Peter Lembke
     * @param array $in
     * @return array|bool
     */
    $functions.push('read_many');
    const read_many = function($in = {}) {
        const $default = {
            'paths': {},
            'step': 'step_start',
            'from_plugin': {
                'node': '',
                'plugin': '',
            },
            'calling_plugin': {
                'node': '',
                'plugin': '',
            },
            'response': {
                'answer': 'false',
                'message': 'There was an error',
                'path': '',
                'data': {},
                'post_exist': 'false',
            },
            'data_back': {
                'items': {},
            },
        };
        $in = _Default($default, $in);

        leave: {
            if (!window.idbKeyval) {
                $in.response.message = 'idbkeyval is not installed';
                break leave;
            }

            if ($in.from_plugin.node !== 'client') {
                $in.response.message = 'I only accept messages that origin from this client node';
                break leave;
            }

            if ($in.step === 'step_start') {
                if ($in.from_plugin.plugin !== 'infohub_storage') {
                    $in.calling_plugin = $in.from_plugin;
                }

                $in.step = 'step_read';
            }

            if ($in.step === 'step_read_response') {
                const $path = $in.response.path;
                $in.data_back.items[$path] = $in.response.data;
                $in.step = 'step_read';
            }

            if ($in.step === 'step_read') {
                if (_Count($in.paths) > 0) {
                    const $pop = _Pop($in.paths);

                    return _SubCall({
                        'to': {
                            'node': 'client',
                            'plugin': 'infohub_storage',
                            'function': 'read',
                        },
                        'data': {
                            'path': $pop.key,
                            'wanted_data': $pop.data,
                            'calling_plugin': $in.calling_plugin,
                        },
                        'data_back': {
                            'paths': $pop.object,
                            'items': $in.data_back.items,
                            'calling_plugin': $in.calling_plugin,
                            'step': 'step_read_response',
                        },
                    });
                }
            }
        }

        return {
            'answer': $in.response.answer,
            'message': $in.response.message,
            'items': $in.data_back.items,
        };
    };

    /**
     * General function for writing to a path
     * @version 2018-03-14
     * @since   2018-03-14
     * @author  Peter Lembke
     * @param array $in
     * @return array|bool
     */
    $functions.push('write_many');
    const write_many = function($in = {}) {
        const $default = {
            'paths': {}, // object with path and data object
            'mode': 'overwrite', // overwrite or merge
            'step': 'step_start',
            'from_plugin': {
                'node': '',
                'plugin': '',
            },
            'calling_plugin': {
                'node': '',
                'plugin': '',
            },
            'response': {},
            'data_back': {
                'items': {},
            },
        };
        $in = _Default($default, $in);

        let $out = {
            'answer': 'false',
            'message': 'message',
            'items': {},
        };

        leave: {
            if (!window.idbKeyval) {
                $out.message = 'idbkeyval is not installed';
                break leave;
            }

            if ($in.from_plugin.node !== 'client') {
                $out.message = 'I only accept messages that origin from this client node';
                break leave;
            }

            if ($in.step === 'step_start') {
                if ($in.from_plugin.plugin !== 'infohub_storage') {
                    $in.calling_plugin = $in.from_plugin;
                }

                $in.step = 'step_write_many';
            }

            if ($in.step === 'step_write_many') {

                let $messages = [];

                let $messageOut = {};
                for (let $key in $in.paths) {
                    if ($in.paths.hasOwnProperty($key) === false) {
                        continue;
                    }

                    $messageOut = _SubCall({
                        'to': {
                            'node': 'client',
                            'plugin': 'infohub_storage',
                            'function': 'write',
                        },
                        'data': {
                            'path': $key,
                            'data': $in.paths[$key],
                            'mode': $in.mode,
                            'calling_plugin': $in.calling_plugin,
                        },
                        'data_back': {
                            'step': 'step_void',
                        },
                    });

                    $messages.push($messageOut);
                }

                return {
                    'answer': 'true',
                    'message': 'Data will be written',
                    'items': $in.paths,
                    'messages': $messages
                };

            }
        }

        return {
            'answer': 'true',
            'message': 'Data will be written',
            'items': $in.paths
        };
    };

    /**
     * General function for reading data from a path that end with *
     * Useful if you want for example all config data items
     * @version 2020-06-27
     * @since   2020-06-27
     * @author  Peter Lembke
     * @param array $in
     * @return array|bool
     */
    $functions.push('read_pattern');
    const read_pattern = function($in = {}) {
        const $default = {
            'path': '',
            'wanted_data': {},
            'step': 'step_start',
            'from_plugin': {
                'node': '',
                'plugin': '',
            },
            'calling_plugin': {
                'node': '',
                'plugin': '',
            },
            'response': {},
        };
        $in = _Default($default, $in);

        let $out = {
            'answer': 'false',
            'message': 'Nothing to report from client storage read_pattern',
            'items': {}
        };

        leave: {
            if (!window.idbKeyval) {
                $out.message = 'idbkeyval is not installed';
                break leave;
            }

            if ($in.from_plugin.node !== 'client') {
                $out.message = 'I only accept messages that origin from this client node';
                break leave;
            }

            if ($in.step === 'step_start') {
                if ($in.from_plugin.plugin !== 'infohub_storage') {
                    $in.calling_plugin = $in.from_plugin;
                }

                $in.step = 'step_read_paths';
            }

            if ($in.step === 'step_read_paths') {
                return _SubCall({
                    'to': {
                        'node': 'client',
                        'plugin': 'infohub_storage',
                        'function': 'read_paths',
                    },
                    'data': {
                        'path': $in.path,
                        'calling_plugin': $in.calling_plugin,
                    },
                    'data_back': {
                        'path': $in.path,
                        'wanted_data': $in.wanted_data,
                        'calling_plugin': $in.calling_plugin,
                        'step': 'step_read_paths_response',
                    },
                });
            }

            if ($in.step === 'step_read_paths_response') {
                const $default = {
                    'answer': 'false',
                    'message': 'There was an error',
                    'path': '',
                    'data': {},
                };
                $in.response = _Default($default, $in.response);

                $in.step = 'step_read_many';

                if (_Empty($in.response.data) === 'true') {
                    $out = {
                        'answer': 'true',
                        'message': 'There were no matching paths. Work done.',
                        'items': {},
                    };
                    $in.step = 'step_end';
                }
            }

            if ($in.step === 'step_read_many') {
                if (_Empty($in.wanted_data) === 'false') {
                    for (let $key in $in.response.data) {
                        if ($in.response.data.hasOwnProperty($key) === false) {
                            continue;
                        }
                        $in.response.data[$key] = $in.wanted_data;
                    }
                }

                return _SubCall({
                    'to': {
                        'node': 'client',
                        'plugin': 'infohub_storage',
                        'function': 'read_many',
                    },
                    'data': {
                        'paths': $in.response.data,
                        'calling_plugin': $in.calling_plugin,
                    },
                    'data_back': {
                        'step': 'step_read_many_response',
                    },
                });
            }
        }

        if ($in.step === 'step_read_many_response') {
            const $default = {
                'answer': 'false',
                'message': 'There was an error',
                'items': {},
            };
            $out = _Default($default, $in.response);
        }

        return {
            'answer': $out.answer,
            'message': $out.message,
            'items': $out.items,
        };
    };

    /**
     * General function for writing the same data to a path that ends with *
     * Useful if you want to merge in some properties to all mathing paths.
     * @version 2020-06-27
     * @since   2020-06-27
     * @author  Peter Lembke
     * @param array $in
     * @return array|bool
     */
    $functions.push('write_pattern');
    const write_pattern = function($in = {}) {
        const $default = {
            'path': '',
            'data': {},
            'mode': 'overwrite', // overwrite or merge
            'step': 'step_start',
            'from_plugin': {
                'node': '',
                'plugin': '',
            },
            'calling_plugin': { // A way to preserve the original from_plugin
                'node': '',
                'plugin': '',
            },
            'response': {},
        };
        $in = _Default($default, $in);

        let $out = {
            'answer': 'false',
            'message': 'Nothing to report from client storage write_pattern',
            'items': {},
        };

        leave: {
            if (!window.idbKeyval) {
                $out.message = 'idbkeyval is not installed';
                break leave;
            }

            if ($in.from_plugin.node !== 'client') {
                $out.message = 'I only accept messages that origin from this client node';
                break leave;
            }

            if ($in.step === 'step_start') {
                if ($in.from_plugin.plugin !== 'infohub_storage') {
                    $in.calling_plugin = $in.from_plugin;
                }

                $in.step = 'step_read_paths';
            }

            if ($in.step === 'step_read_paths') {
                return _SubCall({
                    'to': {
                        'node': 'client',
                        'plugin': 'infohub_storage',
                        'function': 'read_paths',
                    },
                    'data': {
                        'path': $in.path,
                        'calling_plugin': $in.calling_plugin,
                    },
                    'data_back': {
                        'path': $in.path,
                        'data': $in.data,
                        'mode': $in.mode,
                        'calling_plugin': $in.calling_plugin,
                        'step': 'step_read_paths_response',
                    },
                });
            }

            if ($in.step === 'step_read_paths_response') {
                const $default = {
                    'answer': 'false',
                    'message': 'There was an error',
                    'path': '',
                    'data': {},
                };
                $in.response = _Default($default, $in.response);

                $in.step = 'step_write_many';

                if (_Empty($in.response.data) === 'true') {
                    $out = {
                        'answer': 'true',
                        'message': 'There were no matching paths. Work done.',
                        'items': {},
                    };
                    $in.step = 'step_end';
                }
            }

            if ($in.step === 'step_write_many') {
                for (let $key in $in.response.data) {
                    if ($in.response.data.hasOwnProperty($key) === false) {
                        continue;
                    }
                    $in.response.data[$key] = $in.data;
                }

                return _SubCall({
                    'to': {
                        'node': 'client',
                        'plugin': 'infohub_storage',
                        'function': 'write_many',
                    },
                    'data': {
                        'paths': $in.response.data,
                        'mode': $in.mode,
                        'calling_plugin': $in.calling_plugin,
                    },
                    'data_back': {
                        'calling_plugin': $in.calling_plugin,
                        'step': 'step_write_many_response',
                    },
                });
            }

            if ($in.step === 'step_write_many_response') {
                const $default = {
                    'answer': 'false',
                    'message': 'There was an error',
                    'items': {},
                };
                $out = _Default($default, $in.response);
            }
        }

        return {
            'answer': $out.answer,
            'message': $out.message,
            'items': $out.items,
        };
    };

    /**
     * You give an active db connection and a path with % in it,
     * you get a list with all matching paths
     * @param array $in
     * @return array
     */
    $functions.push('read_paths');
    const read_paths = function($in = {}) {

        const $default = {
            'path': '',
            'callback_function': null,
        };
        $in = _Default($default, $in);

        if (!window.idbKeyval) {
            return {
                'answer': 'false',
                'message': 'idbkeyval is not installed',
                'path': $in.path,
                'data': {},
            };
        }

        let $data = {};

        window.idbKeyval.keys().then(function(keys) {
            $in.path = $in.path.substr(0, $in.path.indexOf('*'));

            for (let $key in keys) {
                if (keys.hasOwnProperty($key) === true) {
                    const $path = keys[$key];
                    if ($path.indexOf($in.path) === 0) {
                        $data[$path] = {};
                    }
                }
            }

            $in.callback_function({
                'answer': 'true',
                'message': 'Here are the paths',
                'path': $in.path,
                'data': $data,
            });

        }).catch(function(err) {
            $in.callback_function({
                'answer': 'false',
                'message': err,
                'path': $in.path,
                'data': $data,
            });
        });

        return {};
    };
}

/**
 * idb-KeyVal
 * Use `var` so that it become global
 * https://github.com/jakearchibald/idb-keyval/blob/master/dist/idb-keyval-iife.js
 * @type {{}}
 */
var idbKeyval = (function(exports) {
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
                transaction.onabort = transaction.onerror = () => reject(
                    transaction.error);
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
            (store.openKeyCursor || store.openCursor).call(
                store).onsuccess = function() {
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

//# sourceURL=infohub_storage.js