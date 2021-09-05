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
 * Class infohub_storage_data
 * Handles connections to databases.
 * Reads and then passes the connection data and the request to the right child plugin
 * that then connects to the database and does the request.
 */
function infohub_storage_data() {

    'use strict';

// include "infohub_base.js"

    $functions.push('_Version');
    const _Version = function() {
        return {
            'date': '2018-03-28',
            'version': '1.3.2',
            'checksum': '{{checksum}}',
            'class_name': 'infohub_storage_data',
            'note': 'Handles the connection information to each storage (database server)',
            'status': 'normal',
            'SPDX-License-Identifier': 'GPL-3.0-or-later',
        };
    };

    $functions.push('_GetCmdFunctions');
    const _GetCmdFunctions = function() {
        const $list = {
            'read': 'normal',
            'read_paths': 'normal',
            'write': 'normal',
            'write_overwrite': 'normal', // Used by write
            'write_merge': 'normal', // Used by write
        };

        return _GetCmdFunctionsBase($list);
    };

    // *****************************************************************************
    // * Functions you only can reach with CMD(), add more in your class
    // * Observe function names are lower_case
    // *****************************************************************************

    /**
     * General function for reading a bubble
     * @version 2018-03-17
     * @since   2016-01-30
     * @author  Peter Lembke
     * @param $in
     * @return array
     */
    $functions.push('read');
    const read = function($in = {}) {
        const $default = {
            'path': '',
            'step': 'step_start',
            'calling_plugin': {
                'node': '',
                'plugin': '',
            },
            'config': {
                'plugin_name_handler': 'infohub_storage_data_indexeddb', // Name of the storage child plugin that can handle this connection
                'plugin_name_owner': '', // Level 1 Plugin name that own the data
                'db_type': 'indexeddb', // One of the supported strings: psql, mysql, sqlite, redis, file, couchdb
                'db_name': 'infohub', // name of the database / name of the sqlite file
            },
            'response': {
                'answer': 'false',
                'message': 'Nothing to report',
                'data': {},
                'post_exist': 'false',
            },
        };
        $in = _Default($default, $in);

        let $answer = 'false';
        let $message = 'Nothing to report';
        let $postExist = 'false';

        let $connect = _SetConnectionDefault($in.config);

        leave:
        {
            if (_Empty($connect.plugin_name_owner) === 'true') {
                $connect.plugin_name_owner = $in.calling_plugin.plugin;
            }

            if ($in.path === 'infohub_storagemanager/config') {
                $answer = 'true';
                $message = 'Here are the main connection';
                $in.response.data = _ByVal($in.config);
                if (_Empty($in.config) === 'false') {
                    $postExist = 'true';
                }
                break leave;
            }

            if ($in.step === 'step_start') {
                $in.step = 'step_get_final_connection';
                if ($in.path.indexOf($connect.plugin_name_owner + '/') === 0) {
                    $in.step = 'step_read';
                }
                if ($in.step === 'step_get_final_connection') {
                    if ($connect.used_for === 'all') {
                        if ($connect.not_used_for === '') {
                            $in.step = 'step_read';
                        }
                    }
                }
            }

            if ($in.step === 'step_get_final_connection') {
                const $path = 'infohub_storagemanager/connection/' +
                    $in.calling_plugin.plugin;

                return _SubCall({
                    'to': {
                        'node': 'client',
                        'plugin': $connect.plugin_name_handler,
                        'function': 'read',
                    },
                    'data': {
                        'connect': $connect,
                        'path': $path,
                    },
                    'data_back': {
                        'step': 'step_get_final_connection_response',
                        'path': $in.path,
                        'calling_plugin': $in.calling_plugin,
                    },
                });
            }

            if ($in.step === 'step_get_final_connection_response') {
                $connect = _Default($connect, $in.response.data);
                $in.step = 'step_read';
            }

            if ($in.step === 'step_read') {
                return _SubCall({
                    'to': {
                        'node': 'client',
                        'plugin': $connect.plugin_name_handler,
                        'function': 'read',
                    },
                    'data': {
                        'connect': $connect,
                        'path': $in.path,
                    },
                    'data_back': {
                        'path': $in.path,
                        'calling_plugin': $in.calling_plugin,
                        'step': 'step_final',
                    },
                });
            }

        }

        if ($in.step === 'step_final') {
            $answer = $in.response.answer;
            $message = $in.response.message;
            $postExist = $in.response.post_exist;
        }

        const $response = {
            'answer': $answer,
            'message': $message,
            'path': $in.path,
            'data': $in.response.data,
            'post_exist': $postExist,
        };
        return $response;
    };

    /**
     * Take a path that ends with * and get all existing paths with no data
     * @param array $in
     * @return array
     */
    $functions.push('read_paths');
    const read_paths = function($in = {}) {
        const $default = {
            'connect': {},
            'path': '', // Path that ends with a *
            'step': 'step_start',
            'calling_plugin': {
                'node': '',
                'plugin': '',
            },
            'config': {},
            'response': {},
        };
        $in = _Default($default, $in);

        let $out = {
            'answer': 'false',
            'message': 'Came to step ' + $in.step,
            'path': $in.path,
            'data': {},
        };

        let $connect = _SetConnectionDefault($in.config);

        if (_Empty($connect.plugin_name_owner) === 'true') {
            $connect.plugin_name_owner = $in.calling_plugin.plugin;
        }

        if ($in.step === 'step_start') {
            $in.step = 'step_get_final_connection';
            if ($in.path.indexOf($connect.plugin_name_owner + '/') === 0) {
                $in.step = 'step_read_paths';
            }
            if ($in.step === 'step_get_final_connection') {
                if ($connect.used_for === 'all') {
                    if ($connect.not_used_for === '') {
                        $in.step = 'step_read_paths';
                    }
                }
            }
        }

        if ($in.step === 'step_get_final_connection') {
            const $path = 'infohub_storagemanager/connection/' +
                $in.calling_plugin.plugin;

            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': $connect.plugin_name_handler,
                    'function': 'read',
                },
                'data': {
                    'connect': $connect,
                    'path': $path,
                },
                'data_back': {
                    'step': 'step_get_final_connection_response',
                    'path': $in.path,
                    'calling_plugin': $in.calling_plugin,
                },
            });
        }

        if ($in.step === 'step_get_final_connection_response') {
            const $default = {
                'answer': 'false',
                'message': '',
                'path': '',
                'data': {},
            };
            $in.response = _Default($default, $in.response);

            $connect = _Default($connect, $in.response.data);
            $in.step = 'step_read_paths';
        }

        if ($in.step === 'step_read_paths') {
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': $connect.plugin_name_handler,
                    'function': 'read_paths',
                },
                'data': {
                    'connect': $connect,
                    'path': $in.path,
                },
                'data_back': {
                    'connect': $connect,
                    'path': $in.path,
                    'step': 'step_read_paths_response',
                },
            });
        }

        if ($in.step === 'step_read_paths_response') {
            const $default = {
                'answer': 'false',
                'message': '',
                'path': '',
                'data': {},
            };
            $out = _Default($default, $in.response);
            $in.step = 'step_end';
        }

        return {
            'answer': $out.answer,
            'message': $out.message,
            'path': $out.path,
            'data': $out.data,
        };
    };

    /**
     * General function for writing to a path
     * @version 2018-03-28
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
            'mode': '',
            'step': 'step_start',
            'calling_plugin': {
                'node': '',
                'plugin': '',
            },
            'config': {},
            'response': {
                'answer': 'false',
                'message': 'Nothing to report',
                'path': '',
                'data': {},
                'post_exist': 'false',
            },
        };
        $in = _Default($default, $in);

        let $answer = 'false';
        let $message = 'Nothing to report';
        let $postExist = 'false';

        leave:
        {
            if ($in.path === 'infohub_storagemanager/config') {
                $message = 'You have to manually change the config file on the server';
                break leave;
            }

            let $connect = _SetConnectionDefault($in.config);

            if ($in.step === 'step_start') {
                if (_Empty($connect.plugin_name_owner) === 'true') {
                    $connect.plugin_name_owner = $in.calling_plugin.plugin;
                }

                $in.step = 'step_get_final_connection';

                const $startWith = $connect.plugin_name_owner + '/';
                if ($in.path.indexOf($startWith) === 0) {
                    $in.step = 'step_write';
                }

                if ($in.step === 'step_get_final_connection') {
                    if ($connect.used_for === 'all') {
                        if ($connect.not_used_for === '') {
                            $in.step = 'step_write';
                        }
                    }
                }
            }

            if ($in.step === 'step_get_final_connection') {
                const $path = 'infohub_storagemanager/connection/' +
                    $in.calling_plugin.plugin;

                return _SubCall({
                    'to': {
                        'node': 'client',
                        'plugin': $connect.plugin_name_handler,
                        'function': 'read',
                    },
                    'data': {
                        'connect': $connect,
                        'path': $path,
                    },
                    'data_back': {
                        'step': 'step_get_final_connection_response',
                        'path': $in.path,
                        'data': $in.data,
                        'mode': $in.mode,
                        'calling_plugin': $in.calling_plugin,
                    },
                });
            }

            if ($in.step === 'step_get_final_connection_response') {
                $connect = _Default($connect, $in.response.data);
                $in.step = 'step_write';
            }

            if ($in.step === 'step_write') {
                return _SubCall({
                    'to': {
                        'node': 'client',
                        'plugin': 'infohub_storage_data',
                        'function': 'write_' + $in.mode,
                    },
                    'data': {
                        'connect': $connect,
                        'path': $in.path,
                        'data': $in.data,
                        'mode': $in.mode,
                    },
                    'data_back': {
                        'path': $in.path,
                        'data': $in.data,
                        'mode': $in.mode,
                        'calling_plugin': $in.calling_plugin,
                        'step': 'step_final',
                    },
                });
            }

            if ($in.step === 'step_final') {
                $answer = $in.response.answer;
                $message = $in.response.message;
                $postExist = $in.response.post_exist;
            }
        }

        const $response = {
            'answer': $answer,
            'message': $message,
            'path': $in.path,
            'data': $in.data,
            'post_exist': $postExist,
        };
        return $response;
    };

    $functions.push('write_overwrite');
    /**
     * Overwrite the data in the path
     * @version 2020-06-24
     * @since   2020-06-24
     * @author  Peter Lembke
     * @param $in
     * @return array
     */
    const write_overwrite = function($in = {}) {
        const $default = {
            'connect': {},
            'path': '',
            'data': {},
            'step': 'step_write_data',
            'calling_plugin': {
                'node': '',
                'plugin': '',
            },
            'response': {},
            'data_back': {},
        };
        $in = _Default($default, $in);

        let $answer = 'false',
            $message = 'Nothing to report',
            $postExist = 'false';

        if ($in.step === 'step_write_data') {
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': $in.connect.plugin_name_handler,
                    'function': 'write',
                },
                'data': {
                    'connect': $in.connect,
                    'path': $in.path,
                    'data': $in.data,
                },
                'data_back': {
                    'path': $in.path,
                    'data': $in.data,
                    'calling_plugin': $in.calling_plugin,
                    'step': 'step_final',
                },
            });
        }

        if ($in.step === 'step_final') {
            const $default = {
                'answer': 'false',
                'message': 'An error occurred',
                'path': '',
                'data': {},
                'post_exist': 'false',
            };
            $in.response = _Default($default, $in.response);

            $answer = $in.response.answer;
            $message = $in.response.message;
            $postExist = $in.response.post_exist;
        }

        const $response = {
            'answer': $answer,
            'message': $message,
            'path': $in.path,
            'data': $in.data,
            'post_exist': $postExist,
        };
        return $response;
    };

    $functions.push('write_merge');
    /**
     * Merge with the data in the path
     * @version 2020-06-24
     * @since   2020-06-24
     * @author  Peter Lembke
     * @param $in
     * @return array
     */
    const write_merge = function($in = {}) {
        const $default = {
            'connect': {},
            'path': '',
            'data': {},
            'step': 'step_read_data',
            'calling_plugin': {
                'node': '',
                'plugin': '',
            },
            'response': {},
            'data_back': {
                'new_data': {},
            },
        };
        $in = _Default($default, $in);

        let $answer = 'false',
            $message = 'Nothing to report',
            $postExist = 'false';

        if ($in.step === 'step_read_data') {
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': $in.connect.plugin_name_handler,
                    'function': 'read',
                },
                'data': {
                    'connect': $in.connect,
                    'path': $in.path,
                },
                'data_back': {
                    'path': $in.path,
                    'new_data': $in.data,
                    'connect': $in.connect,
                    'step': 'step_read_data_response',
                },
            });
        }

        if ($in.step === 'step_read_data_response') {
            const $default = {
                'answer': '',
                'message': '',
                'path': '',
                'data': {},
                'post_exist': 'false',
            };
            $in.response = _Default($default, $in.response);

            if ($in.response.post_exist === 'true') {
                $in.data = _Merge($in.response.data, $in.data_back.new_data);
            }

            $in.step = 'step_write_data';
        }

        if ($in.step === 'step_write_data') {
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': $in.connect.plugin_name_handler,
                    'function': 'write',
                },
                'data': {
                    'connect': $in.connect,
                    'path': $in.path,
                    'data': $in.data,
                },
                'data_back': {
                    'path': $in.path,
                    'data': $in.data,
                    'calling_plugin': $in.calling_plugin,
                    'connect': $in.connect,
                    'step': 'step_final',
                },
            });
        }

        if ($in.step === 'step_final') {
            const $default = {
                'answer': 'false',
                'message': 'An error occurred',
                'path': '',
                'data': {},
                'post_exist': 'false',
            };
            $in.response = _Default($default, $in.response);

            $answer = $in.response.answer;
            $message = $in.response.message;
            $postExist = $in.response.post_exist;
        }

        const $response = {
            'answer': $answer,
            'message': $message,
            'path': $in.path,
            'data': $in.data,
            'post_exist': $postExist,
        };
        return $response;
    };

    /**
     * Default data for a connection. Reused in many places
     * @version 2017-07-20
     * @since   2016-01-30
     * @author  Peter Lembke
     * @param $in
     * @return array
     */
    $functions.push('_SetConnectionDefault');
    const _SetConnectionDefault = function($in = {}) {
        const $default = {
            'plugin_name_handler': 'infohub_storage_data_indexeddb', // Name of the storage child plugin that can handle this connection
            'plugin_name_owner': '', // Level 1 Plugin name that own the data
            'used_for': 'all', // all or a comma separated list with plugin names
            'not_used_for': '', // If used_for = all then not_used_for list all plugins that are exceptions.
            'db_type': 'indexeddb', // One of the supported strings: psql, mysql, sqlite, redis, file, couchdb
            'db_host': '', // If required, IP number or domain name to sql server. Empty for sqlite
            'db_port': '', // The IP port to the sql server, or empty for sqlite
            'db_user': '', // If required, username on sql server or empty for sqlite
            'db_password': '', // password for username, or empty for sqlite
            'db_name': 'infohub', // name of the database / name of the sqlite file
            'path': '', // the path where this connection will be stored
        };
        $in = _Default($default, $in);

        return $in;
    };

}

//# sourceURL=infohub_storage_data.js