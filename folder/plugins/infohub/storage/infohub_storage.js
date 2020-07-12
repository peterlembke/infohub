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
            'SPDX-License-Identifier': 'GPL-3.0-or-later',
            'recommended_security_group': 'guest'
        };
    };

    const _GetCmdFunctions = function () {
        return {
            'read': 'normal',
            'write': 'normal',
            'read_many': 'normal',
            'write_many': 'normal',
            'read_pattern': 'normal',
            'write_pattern': 'normal'
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
            'wanted_data': {},
            'step': 'step_start',
            'from_plugin': {
                'node': '',
                'plugin': ''
            },
            'calling_plugin': {
                'node': '',
                'plugin': ''
            },
            'response': {}
        };
        $in = _Default($default, $in);

        let $out = {
            'answer': 'false',
            'message': '',
            'path': $in.path,
            'data': {},
            'wanted_data': $in.wanted_data,
            'post_exist': 'false'
        };

        leave: {
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

            if ($in.step === 'step_start')
            {
                $in.path = $in.path.toLowerCase().trim();

                return _SubCall({
                    'to': {
                        'node': 'client',
                        'plugin': 'infohub_storage_data',
                        'function': 'read'
                    },
                    'data': {
                        'path': $in.path,
                        'calling_plugin': $in.from_plugin
                    },
                    'data_back': {
                        'path': $in.path,
                        'wanted_data': $in.wanted_data,
                        'calling_plugin': $in.from_plugin,
                        'step': 'step_end'
                    }
                });
            }

            if ($in.step === 'step_end') {
                const $default = {
                    'answer': 'false',
                    'message': 'There was an error',
                    'data': {},
                    'post_exist': 'false'
                };
                $in.response = _Default($default, $in.response);

                if (_Empty($in.wanted_data) === 'false') {
                    $in.response.data = _Default($in.wanted_data, $in.response.data);
                }

                $out.answer = $in.response.answer;
                $out.message = $in.response.message;
                $out.data = $in.response.data;
                $out.post_exist = $in.response.post_exist;
            }
        }

        return {
            'answer': $out.answer,
            'message': $out.message,
            'path': $out.path,
            'data': $out.data,
            'wanted_data': $out.wanted_data,
            'post_exist': $out.post_exist
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
    const write = function ($in)
    {
        const $default = {
            'path': '',
            'data': {},
            'mode': 'overwrite', // Overwrite or merge
            'step': 'step_write',
            'from_plugin': {
                'node': '',
                'plugin': ''
            },
            'calling_plugin': {
                'node': '',
                'plugin': ''
            },
            'response': {},
            'data_back': {}
        };
        $in = _Default($default, $in);

        let $out = {
            'answer': 'false',
            'message': '',
            'path': $in.path,
            'mode': $in.mode,
            'post_exist': 'false'
        };

        leave: {
            if ($in.from_plugin.node !== 'client') {
                $in.response.message = 'I only accept messages that origin from this client node';
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
                    $in.response.message = 'I only accept messages from this client node';
                    break leave;
                }
                $in.from_plugin.plugin = $in.calling_plugin.plugin;
            }

            if ($in.path.indexOf($in.from_plugin.plugin + '/') !== 0) {
                const $row = 'Your plugin: %s, is not allowed to write to this path: %s';
                $out.message = _SprintF($row, [$in.from_plugin.plugin, $in.path]);
                break leave;
            }

            if ($in.step === 'step_write')
            {
                $in.path = $in.path.trim();
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
                        'mode': $in.mode,
                        'calling_plugin': _ByVal($in.from_plugin)
                    },
                    'data_back': {
                        'path': $in.path,
                        'mode': $in.mode,
                        'calling_plugin': _ByVal($in.from_plugin),
                        'step': 'step_write_response'
                    }
                });

            }

            if ($in.step === 'step_write_response') {
                const $default = {
                    'answer': 'false',
                    'message': 'There was an error',
                    'post_exist': 'false'
                };
                $in.response = _Default($default, $in.response);

                $out.answer = $in.response.answer;
                $out.message = $in.response.message;
                $out.post_exist = $in.response.post_exist;
            }
        }

        return {
            'answer': $out.answer,
            'message': $out.message,
            'path': $out.path,
            'data': $out.data,
            'post_exist': $out.post_exist
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
    const read_many = function ($in)
    {
        const $default = {
            'paths': {},
            'step': 'step_start',
            'from_plugin': {
                'node': '',
                'plugin': ''
            },
            'calling_plugin': {
                'node': '',
                'plugin': ''
            },
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

            if ($in.step === 'step_start')
            {
                if ($in.from_plugin.plugin !== 'infohub_storage') {
                    $in.calling_plugin = $in.from_plugin;
                }

                $in.step = 'step_read';
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
                            'wanted_data': $pop.data,
                            'calling_plugin': $in.calling_plugin
                        },
                        'data_back': {
                            'paths': $pop.object,
                            'items': $in.data_back.items,
                            'calling_plugin': $in.calling_plugin,
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
            'paths': {}, // object with path and data object
            'mode': 'overwrite', // overwrite or merge
            'step': 'step_start',
            'from_plugin': {
                'node': '',
                'plugin': ''
            },
            'calling_plugin': {
                'node': '',
                'plugin': ''
            },
            'response': {},
            'data_back': {
                'items': {}
            }
        };
        $in = _Default($default, $in);

        let $out = {
            'answer': 'false',
            'message': 'message',
            'items': {}
        };

        leave: {
            if ($in.from_plugin.node !== 'client') {
                $in.message = 'I only accept messages that origin from this client node';
                break leave;
            }

            if ($in.step === 'step_start')
            {
                if ($in.from_plugin.plugin !== 'infohub_storage') {
                    $in.calling_plugin = $in.from_plugin;
                }

                $in.step = 'step_write_many';
            }


            if ($in.step === 'step_write_many_response')
            {
                const $default = {
                    'answer': 'false',
                    'message': 'There was an error',
                    'path': '',
                    'data': {},
                    'post_exist': 'false'
                };
                $in.response = _Default($default, $in.response);

                const $path = $in.response.path;
                $in.data_back.items[$path] = $in.response;
                $in.step = 'step_write_many';
            }

            if ($in.step === 'step_write_many') {
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
                            'mode': $in.mode,
                            'calling_plugin': $in.calling_plugin
                        },
                        'data_back': {
                            'paths': $pop.object,
                            'items': $in.data_back.items,
                            'mode': $in.mode,
                            'calling_plugin': $in.calling_plugin,
                            'step': 'step_write_many_response'
                        }
                    });
                }

                $out = {
                    'answer': $in.response.answer,
                    'message': $in.response.message,
                    'items': $in.data_back.items
                };
            }
        }

        return {
            'answer': $out.answer,
            'message': $out.message,
            'items': $out.items
        };
    };

    /**
     * General function for reading data from a path that end with *
     * @version 2020-06-27
     * @since   2020-06-27
     * @author  Peter Lembke
     * @param array $in
     * @return array|bool
     */
    $functions.push('read_pattern');
    const read_pattern = function ($in)
    {
        const $default = {
            'path': '',
            'wanted_data': {},
            'step': 'step_start',
            'from_plugin': {
                'node': '',
                'plugin': ''
            },
            'calling_plugin': {
                'node': '',
                'plugin': ''
            },
            'response': {}
        };
        $in = _Default($default, $in);

        let $out = {
            'answer': 'false',
            'message': 'Nothing to report from client storage read_pattern',
            'items': {}
        };

        leave: {
            if ($in.from_plugin.node !== 'client') {
                $in.response.message = 'I only accept messages that origin from this client node';
                break leave;
            }

            if ($in.step === 'step_start')
            {
                if ($in.from_plugin.plugin !== 'infohub_storage') {
                    $in.calling_plugin = $in.from_plugin;
                }

                $in.step = 'step_read_paths';
            }

            if ($in.step === 'step_read_paths') {
                return _SubCall({
                    'to': {
                        'node': 'client',
                        'plugin': 'infohub_storage_data',
                        'function': 'read_paths'
                    },
                    'data': {
                        'path': $in.path,
                        'calling_plugin': $in.calling_plugin
                    },
                    'data_back': {
                        'path': $in.path,
                        'wanted_data': $in.wanted_data,
                        'calling_plugin': $in.calling_plugin,
                        'step': 'step_read_paths_response'
                    }
                });
            }

            if ($in.step === 'step_read_paths_response')
            {
                const $default = {
                    'answer': 'false',
                    'message': 'There was an error',
                    'path': '',
                    'data': {}
                };
                $in.response = _Default($default, $in.response);

                $in.step = 'step_read_many';

                if (_Empty($in.response.data) === 'true') {
                    $out = {
                        'answer': 'true',
                        'message': 'There were no matching paths. Work done.',
                        'items': {}
                    };
                    $in.step = 'step_end';
                }
            }

            if ($in.step === 'step_read_many')
            {
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
                        'function': 'read_many'
                    },
                    'data': {
                        'paths': $in.response.data,
                        'calling_plugin': $in.calling_plugin
                    },
                    'data_back': {
                        'step': 'step_read_many_response'
                    }
                });
            }
        }

        if ($in.step === 'step_read_many_response') {
            const $default = {
                'answer': 'false',
                'message': 'There was an error',
                'items': {}
            };
            $out = _Default($default, $in.response);
        }

        return {
            'answer': $out.answer,
            'message': $out.message,
            'items': $out.items
        };
    };

    /**
     * General function for writing the same data to a path that ends with *
     * @version 2020-06-27
     * @since   2020-06-27
     * @author  Peter Lembke
     * @param array $in
     * @return array|bool
     */
    $functions.push('write_pattern');
    const write_pattern = function ($in)
    {
        const $default = {
            'path': '',
            'data': {},
            'mode': 'overwrite', // overwrite or merge
            'step': 'step_start',
            'from_plugin': {
                'node': '',
                'plugin': ''
            },
            'calling_plugin': { // A way to preserve the original from_plugin
                'node': '',
                'plugin': ''
            },
            'response': {}
        };
        $in = _Default($default, $in);

        let $out = {
            'answer': 'false',
            'message': 'Nothing to report from client storage write_pattern',
            'items': {}
        };

        leave: {
            if ($in.from_plugin.node !== 'client') {
                $out.message = 'I only accept messages that origin from this client node';
                break leave;
            }

            if ($in.step === 'step_start')
            {
                if ($in.from_plugin.plugin !== 'infohub_storage') {
                    $in.calling_plugin = $in.from_plugin;
                }

                $in.step = 'step_read_paths';
            }

            if ($in.step === 'step_read_paths') {
                return _SubCall({
                    'to': {
                        'node': 'client',
                        'plugin': 'infohub_storage_data',
                        'function': 'read_paths'
                    },
                    'data': {
                        'path': $in.path,
                        'calling_plugin': $in.calling_plugin
                    },
                    'data_back': {
                        'path': $in.path,
                        'data': $in.data,
                        'mode': $in.mode,
                        'calling_plugin': $in.calling_plugin,
                        'step': 'step_read_paths_response'
                    }
                });
            }

            if ($in.step === 'step_read_paths_response')
            {
                const $default = {
                    'answer': 'false',
                    'message': 'There was an error',
                    'path': '',
                    'data': {}
                };
                $in.response = _Default($default, $in.response);

                $in.step = 'step_write_many';

                if (_Empty($in.response.data) === 'true') {
                    $out = {
                        'answer': 'true',
                        'message': 'There were no matching paths. Work done.',
                        'items': {}
                    };
                    $in.step = 'step_end';
                }
            }

            if ($in.step === 'step_write_many')
            {
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
                        'function': 'write_many'
                    },
                    'data': {
                        'paths': $in.response.data,
                        'mode': $in.mode,
                        'calling_plugin': $in.calling_plugin
                    },
                    'data_back': {
                        'calling_plugin': $in.calling_plugin,
                        'step': 'step_write_many_response'
                    }
                });
            }

            if ($in.step === 'step_write_many_response')
            {
                const $default = {
                    'answer': 'false',
                    'message': 'There was an error',
                    'items': {}
                };
                $out = _Default($default, $in.response);
            }
        }

        return {
            'answer': $out.answer,
            'message': $out.message,
            'items': $out.items
        };
    };
}
//# sourceURL=infohub_storage.js