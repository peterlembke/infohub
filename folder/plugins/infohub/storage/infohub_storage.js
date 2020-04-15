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
 * Class infohub_storage
 * The storage is a table in a database. A bubble is a post with child posts.
 * The first bubbles name is main and come from the main database, main storage.
 */
function infohub_storage() {

    "use strict";

// include "infohub_base.js"

    const _Version = function () {
        return {
            'date': '2018-03-25',
            'version': '1.1.0',
            'checksum': '{{checksum}}',
            'class_name': 'infohub_storage',
            'note': 'Store your data. Simple, Stand alone',
            'status': 'normal',
            'SPDX-License-Identifier': 'GPL-3.0-or-later'
        };
    };

    const _GetCmdFunctions = function () {
        return {
            'read': 'normal',
            'write': 'normal',
            'read_many': 'normal',
            'write_many': 'normal'
        };
    };

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
    const read = function ($in)
    {
        const $default = {
            'path': '',
            'step': 'step_start',
            'from_plugin': {'node': '', 'plugin': ''},
            'calling_plugin': {'node': '', 'plugin': ''},
            'response': {
                'answer': 'false',
                'message': 'There was an error',
                'data': {},
                'post_exist': 'false'
            }
        };
        $in = _Default($default, $in);

        leave: {
            if ($in.from_plugin.node !== 'client') {
                $in.response.message = 'I only accept messages that origin from this client node';
                break leave;
            }

            if (_Empty($in.calling_plugin.node) === 'false') {
                if ($in.calling_plugin.node !== 'client') {
                    $in.response.message = 'I only accept messages from this client node';
                    break leave;
                }
                if (_Empty($in.calling_plugin.plugin) === 'false') {
                    if ($in.from_plugin.plugin === 'infohub_storage') {
                        $in.from_plugin.plugin = $in.calling_plugin.plugin;
                    }
                }
            }

            if ($in.from_plugin.plugin !== 'infohub_storage') {
                if ($in.path.indexOf($in.from_plugin.plugin + '/') !== 0) {
                    $in.response.message = 'I only accept paths that start with the calling plugin name';
                    break leave;
                }
            }

            if ($in.step === 'step_start')
            {
                $in.path = $in.path.toLowerCase().trim();
                if ($in.path.indexOf($in.from_plugin.plugin + '/') !== 0) {
                    $in.response.answer = 'false';
                    const $row = 'Your plugin: %s, is not allowed to read this path: %s';
                    $in.response.message = _SprintF($row, [$in.from_plugin.plugin, $in.path]);
                    $in.response.data = {};
                    break leave;
                }

                return _SubCall({
                    'to': {
                        'node': 'client',
                        'plugin': 'infohub_storage_data',
                        'function': 'read'
                    },
                    'data': {
                        'path': $in.path,
                        'calling_plugin': _ByVal($in.from_plugin)
                    },
                    'data_back': {
                        'calling_plugin': _ByVal($in.from_plugin),
                        'step': 'step_end'
                    }
                });
            }

            if ($in.step === 'step_end') {
                let $a = 1;
            }
        }

        const $response = {
            'answer': $in.response.answer,
            'message': $in.response.message,
            'function': 'read',
            'path': $in.path,
            'data': $in.response.data,
            'post_exist': $in.response.post_exist
        };
        return $response;
    };

    /**
     * General function for writing to a bubble
     * Used with the special structure for default,data
     * @version 2017-09-03
     * @since   2016-01-30
     * @author  Peter Lembke
     * @param $in
     * @returns {*}
     */
    $functions.push('write');
    const write = function ($in)
    {
        const $default = {
            'path': '',
            'data': {},
            'from_plugin': {'node': '', 'plugin': '' },
            'calling_plugin': {'node': '', 'plugin': ''},
            'step': 'step_start',
            'response': {
                'answer': 'false',
                'message': 'There was an error',
                'saved_data': {},
                'post_exist': 'false'
            }
        };
        $in = _Default($default, $in);

        leave: {
            if ($in.from_plugin.node !== 'client') {
                $in.response.message = 'I only accept messages from this client node';
                break leave;
            }

            if (_Empty($in.calling_plugin.node) === 'false') {
                if ($in.calling_plugin.node !== 'client') {
                    $in.response.message = 'I only accept messages from this client node';
                    break leave;
                }
                if (_Empty($in.calling_plugin.plugin) === 'false') {
                    if ($in.from_plugin.plugin === 'infohub_storage') {
                        $in.from_plugin.plugin = $in.calling_plugin.plugin;
                    }
                }
            }

            if ($in.path.indexOf($in.from_plugin.plugin + '/') !== 0) {
                $in.response.answer = 'false';
                $in.response.message = 'I only accept paths that start with the calling plugin name';
                break leave;
            }

            if ($in.step === 'step_start')
            {
                // ksort($in.data);
                return _SubCall({
                    'to': {
                        'node': 'client',
                        'plugin': 'infohub_storage_data',
                        'function': 'write'
                    },
                    'data': {
                        'path': $in.path,
                        'data': $in.data,
                        'calling_plugin': _ByVal($in.from_plugin)
                    },
                    'data_back': {
                        'path': $in.path,
                        'calling_plugin': _ByVal($in.from_plugin),
                        'step': 'step_end'
                    }
                });

            }

            if ($in.step === 'step_end') {
                const $a = 1;
            }

        }

        const $response = {
            'answer': $in.response.answer,
            'message': $in.response.message,
            'function': 'write',
            'path': $in.path,
            'data': $in.data,
            'post_exist': $in.response.post_exist
        };
        return $response;
    };

    /**
     * General function for reading data from a path
     * @version 2018-03-14
     * @since   2018-03-14
     * @author  Peter Lembke
     * @param array $in
     * @return array|bool
     */
    $functions.push('read_many');
    const read_many = function ($in)
    {
        const $default = {
            'from_plugin': {'node': '', 'plugin': ''},
            'step': 'step_read',
            'paths': {},
            'response': {
                'answer': 'false',
                'message': 'There was an error',
                'path': '',
                'data': {},
                'post_exist': 'false'
            },
            'data_back': {
                'items': {}
            }
        };
        $in = _Default($default, $in);

        leave: {
            if ($in.from_plugin.node !== 'client') {
                $in.response.message = 'I only accept messages that origin from this client node';
                break leave;
            }

            if ($in.step === 'step_read_response') 
            {
                const $path = $in.response.path;
                $in.data_back.items[$path] = $in.response.data;
                $in.step = 'step_read';
            }

            if ($in.step === 'step_read') 
            {
                if (_Count($in.paths) > 0) {
                    const $pop = _Pop($in.paths);

                    return _SubCall({
                        'to': {
                            'node': 'client',
                            'plugin': 'infohub_storage',
                            'function': 'read'
                        },
                        'data': {
                            'path': $pop.key,
                            'calling_plugin': $in.from_plugin
                        },
                        'data_back': {
                            'paths': $pop.object,
                            'items': $in.data_back.items,
                            'step': 'step_read_response'
                        }
                    });
                }
            }
        }

        return {
            'answer': $in.response.answer,
            'message': $in.response.message,
            'items': $in.data_back.items
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
    const write_many = function ($in)
    {
        const $default = {
            'from_plugin': {'node': '', 'plugin': ''},
            'step': 'step_write',
            'paths': {}, // object with path and data object
            'response': {
                'answer': 'false',
                'message': 'There was an error',
                'path': '',
                'data': {},
                'post_exist': 'false'
            },
            'data_back': {
                'items': {}
            }
        };
        $in = _Default($default, $in);

        leave: {
            if ($in.from_plugin.node !== 'client') {
                $in.response.message = 'I only accept messages that origin from this client node';
                break leave;
            }

            if ($in.step === 'step_write_response') {
                const $path = $in.response.path;
                $in.data_back.items[$path] = $in.response.data;
                $in.step = 'step_write';
            }

            if ($in.step === 'step_write') {
                if (_Count($in.paths) > 0) {
                    const $pop = _Pop($in.paths);

                    return _SubCall({
                        'to': {
                            'node': 'client',
                            'plugin': 'infohub_storage',
                            'function': 'write'
                        },
                        'data': {
                            'path': $pop.key,
                            'data': $pop.data,
                            'calling_plugin': $in.from_plugin
                        },
                        'data_back': {
                            'paths': $pop.object,
                            'items': $in.data_back.items,
                            'step': 'step_write_response'
                        }
                    });
                }
            }
        }

        return {
            'answer': $in.response.answer,
            'message': $in.response.message,
            'items': $in.data_back.items
        };
    };
}
//# sourceURL=infohub_storage.js