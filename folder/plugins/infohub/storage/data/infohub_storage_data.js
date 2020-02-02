/*
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

// include "infohub_base.js"



    $functions.push('_Version');
    const _Version = function () {
        return {
            'date': '2018-03-28',
            'version': '1.3.2',
            'checksum': '{{checksum}}',
            'class_name': 'infohub_storage_data',
            'note': 'Handles the connection information to each storage (database server)',
            'status': 'normal',
            'license_name': 'GNU GPL 3 or later'
        };
    };

    $functions.push('_GetCmdFunctions');
    const _GetCmdFunctions = function () {
        return {
            'read': 'normal',
            'write': 'normal',
            'write_paths': 'normal'
        };
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
    const read = function ($in)
    {
        "use strict";

        const $default = {
            'calling_plugin': {
                'node': '',
                'plugin': ''
            },
            'step': 'step_start',
            'path': '',
            'config': {
                'plugin_name_handler': 'infohub_storage_data_indexeddb', // Name of the storage child plugin that can handle this connection
                'plugin_name_owner': '', // Level 1 Plugin name that own the data
                'db_type': 'indexeddb', // One of the supported strings: psql, mysql, sqlite, redis, file, couchdb
                'db_name': 'infohub' // name of the database / name of the sqlite file
            },
            'response': {
                'answer': 'false',
                'message': 'Nothing to report',
                'data': {},
                'post_exist': 'false'
            }
        };
        $in = _Default($default, $in);

        let $answer = 'false';
        let $message = 'Nothing to report';
        let $postExist = 'false';

        let $connect = _SetConnectionDefault($in['config']);

        leave:
        {
            if (_Empty($connect.plugin_name_owner) === 'true') {
                $connect.plugin_name_owner = $in.calling_plugin.plugin;
            }

            if ($in.path === 'infohub_storagemanager/config') {
                $answer = 'true';
                $message = 'Here are the main connection';
                $in.response.data = _ByVal($in.config);
                if (_Empty($in.config) === false) {
                    $postExist = 'true';
                }
                break leave;
            }

            if ($in.step === 'step_start')
            {
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

            if ($in.step === 'step_get_final_connection')
            {
                const $path = 'infohub_storagemanager/connection/' + $in.calling_plugin.plugin;

                return _SubCall({
                    'to': {
                        'node': 'client',
                        'plugin': $connect.plugin_name_handler,
                        'function': 'read'
                    },
                    'data': {
                        'connect': $connect,
                        'path': $path
                    },
                    'data_back': {
                        'step': 'step_get_final_connection_response',
                        'path': $in.path,
                        'calling_plugin': $in.calling_plugin
                    }
                });
            }

            if ($in.step === 'step_get_final_connection_response')
            {
                $connect = _Default($connect, $in.response.data);
                $in.step = 'step_read';
            }

            if ($in.step === 'step_read')
            {
                $in.step = 'step_read_paths';
                if ($in.path.indexOf('*') === -1) {
                    $in.step = 'step_read_data';
                }
            }

            if ($in.step === 'step_read_paths')
            {
                return _SubCall({
                    'to': {
                        'node': 'client',
                        'plugin': $connect.plugin_name_handler,
                        'function': 'read_paths'
                    },
                    'data': {
                        'connect': $connect,
                        'path': $in.path
                    },
                    'data_back': {
                        'step': 'step_final',
                        'path': $in.path,
                        'calling_plugin': $in.calling_plugin
                    }
                });
            }

            if ($in.step === 'step_read_data')
            {
                return _SubCall({
                    'to': {
                        'node': 'client',
                        'plugin': $connect.plugin_name_handler,
                        'function': 'read'
                    },
                    'data': {
                        'connect': $connect,
                        'path': $in.path
                    },
                    'data_back': {
                        'step': 'step_final',
                        'path': $in.path,
                        'calling_plugin': $in.calling_plugin
                    }
                });
            }

        }

        if ($in.step === 'step_final')
        {
            $answer =  $in.response.answer;
            $message = $in.response.message;
            $postExist = $in.response.post_exist;
        }

        const $response = {
            'answer': $answer,
            'message': $message,
            'path': $in.path,
            'data': $in.response.data,
            'post_exist': $postExist
        };
        return $response;
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
    const write = function ($in)
    {
        "use strict";

        const $default = {
            'path': '',
            'data': {},
            'calling_plugin': {
                'node': '',
                'plugin': ''
            },
            'step': 'step_start',
            'config': {
                'plugin_name_handler': 'infohub_storage_data_indexeddb', // Name of the storage child plugin that can handle this connection
                'plugin_name_owner': '', // Level 1 Plugin name that own the data
                'db_type': 'indexeddb' // One of the supported strings: psql, mysql, sqlite, redis, file, couchdb
            },
            'response': {
                'answer': 'false',
                'message': 'Nothing to report',
                'path': '',
                'data': {},
                'post_exist': 'false'
            }
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

            if ($in.step === 'step_start')
            {
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

            if ($in.step === 'step_get_final_connection')
            {
                const $path = 'infohub_storagemanager/connection/' + $in.calling_plugin.plugin;

                return _SubCall({
                    'to': {
                        'node': 'client',
                        'plugin': $connect.plugin_name_handler,
                        'function': 'read'
                    },
                    'data': {
                        'connect': $connect,
                        'path': $path
                    },
                    'data_back': {
                        'step': 'step_get_final_connection_response',
                        'path': $in.path,
                        'data': $in.data,
                        'calling_plugin': $in.calling_plugin
                    }
                });
            }

            if ($in.step === 'step_get_final_connection_response') {
                $connect = _Default($connect, $in.response.data);
                $in.step = 'step_write';
            }

            if ($in.step === 'step_write')
            {
                $in.step = 'step_write_paths';
                if ($in.path.indexOf('*') === -1) {
                    $in.step = 'step_write_data';
                }
            }

            if ($in.step === 'step_write_paths')
            {
                return _SubCall({
                    'to': {
                        'node': 'client',
                        'plugin': 'infohub_storage_data',
                        'function': 'write_paths'
                    },
                    'data': {
                        'connect': $connect,
                        'path': $in.path,
                        'data': $in.data
                    },
                    'data_back': {
                        'step': 'step_final',
                        'path': $in.path,
                        'data': $in.data,
                        'connect': $connect,
                        'calling_plugin': $in.calling_plugin
                    }
                });
            }

            if ($in.step === 'step_write_data')
            {
                return _SubCall({
                    'to': {
                        'node': 'client',
                        'plugin': $connect.plugin_name_handler,
                        'function': 'write'
                    },
                    'data': {
                        'connect': $connect,
                        'path': $in.path,
                        'data': $in.data
                    },
                    'data_back': {
                        'step': 'step_final',
                        'path': $in.path,
                        'data': $in.data,
                        'connect': $connect,
                        'calling_plugin': $in.calling_plugin
                    }
                });
            }

        }

        if ($in.step === 'step_final') {
            $answer =  $in.response.answer;
            $message = $in.response.message;
            $postExist = $in.response.post_exist;
        }

        const $response = {
            'answer': $answer,
            'message': $message,
            'path': $in.path,
            'data': $in.data,
            'post_exist': $postExist
        };
        return $response;
    };

    /**
     * You can write to all matching paths
     * Used for mass update of data or deletion of posts.
     * @param array $in
     * @return array
     */
    $functions.push('write_paths');
    const write_paths = function ($in)
    {
        "use strict";

        const $default = {
            'connect': {},
            'path': '',
            'data': {},
            'step': 'step_read_paths',
            'response': {},
            'data_back': {
                'paths': {}
            }
        };
        $in = _Default($default, $in);

        let $answer = 'false';
        let $message = 'Came to step ' + $in.step;

        if ($in.step === 'step_read_paths')
        {
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': $in.connect.plugin_name_handler,
                    'function': 'read_paths'
                },
                'data': {
                    'connect': $in.connect,
                    'path': $in.path,
                    'with_data': 'false'
                },
                'data_back': {
                    'connect': $in.connect,
                    'path': $in.path,
                    'data': $in.data,
                    'step': 'step_read_paths_response'
                }
            });
        }

        if ($in.step === 'step_read_paths_response')
        {
            $in.step = 'step_write_data';

            let $pathArray = {};
            for (let $key in $in.response.data) {
                if ($in.response.data.hasOwnProperty($key)) {
                    $pathArray.push($key);
                }
            }

            $in.data_back.paths = $pathArray;
            if (_Empty($in.data_back.paths) === true)
            {
                $answer = 'true';
                $message = 'There were no matching paths to write to. I am done';
                $in.step = 'step_end';
            }
        }

        if ($in.step === 'step_write_data_response')
        {
            $in.step = 'step_write_data';

            if (_Empty($in.data_back.paths) === true)
            {
                $answer = 'true';
                $message = 'I have written to all the paths I found';
                $in.step = 'step_end';
            }
        }

        if ($in.step === 'step_write_data')
        {
            const $oneFullPath = $in.data_back.paths.pop();
            return _SubCall({
                'to': {
                    'node': 'server',
                    'plugin': $in.connect.plugin_name_handler,
                    'function': 'write'
                },
                'data': {
                    'connect': $in.connect,
                    'path': $oneFullPath,
                    'data': $in.data
                },
                'data_back': {
                    'connect': $in.connect,
                    'path': $in.path,
                    'data': $in.data,
                    'step': 'step_write_data_response',
                    'paths': $in.data_back.paths
                }
            });
        }

        const $out = {
            'answer': $answer,
            'message': $message,
            'path': $in.path
        };
        return $out;
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
    const _SetConnectionDefault = function($in)
    {
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
            'path': '' // the path where this connection will be stored
        };
        $in = _Default($default, $in);

        return $in;
    };

}
//# sourceURL=infohub_storage_data.js