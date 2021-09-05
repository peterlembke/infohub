/**
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
function infohub_session() {

    'use strict';

// include "infohub_base.js"

    const _Version = function() {
        return {
            'date': '2020-01-12',
            'since': '2020-01-10',
            'version': '1.0.0',
            'checksum': '{{checksum}}',
            'class_name': 'infohub_session',
            'note': 'Handle the session with the server',
            'status': 'normal',
            'SPDX-License-Identifier': 'GPL-3.0-or-later',
            'title': 'Session',
            'user_role': 'user',
            'web_worker': 'false',
            'core_plugin': 'true',
        };
    };

    const _GetCmdFunctions = function() {
        const $list = {
            'initiator_store_session_data': 'normal',
            'initiator_end_session': 'normal',
            'initiator_calculate_sign_code': 'normal',
            'initiator_verify_sign_code': 'normal',
            'initiator_check_session_valid': 'normal',
            'initiator_get_session_data': 'normal',
            'delete_session_data': 'normal',
        };

        return _GetCmdFunctionsBase($list);
    };

    /**
     * Get session data and store it
     * path = infohub_session/node/{node}
     * Store associated array with initiator_user_name, left_overs, session_id, session_created_at
     * @version 2020-01-12
     * @since 2020-01-12
     * @author Peter Lembke
     */
    $functions.push('initiator_store_session_data');
    const initiator_store_session_data = function($in = {}) {
        const $default = {
            'node': '', // name of the node the initiator use to send data to the responder
            'initiator_user_name': '', // user_{hub_id}
            'session_id': '', //session_{hub_id}
            'session_created_at': '', // micro time with 3 decimals
            'role_list': [], // Allowed roles
            'left_overs': '', // Left overs from the login. Never exposed outside this plugin
            'step': 'step_store_session_data',
            'response': {
                'answer': 'false',
                'message': '',
                'ok': 'false',
            },
        };
        $in = _Default($default, $in);

        if ($in.step === 'step_store_session_data') {
            let $path = 'infohub_session/node/' + $in.node;

            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_storage',
                    'function': 'write',
                },
                'data': {
                    'path': $path,
                    'data': {
                        'initiator_user_name': $in.initiator_user_name,
                        'left_overs': $in.left_overs,
                        'session_id': $in.session_id,
                        'session_created_at': $in.session_created_at,
                        'role_list': $in.role_list,
                    },
                },
                'data_back': {
                    'step': 'step_store_session_data_response',
                },
            });
        }

        if ($in.step === 'step_store_session_data_response') {
            if ($in.response.answer === 'true') {
                $in.response.ok = 'true';
                $in.response.message = 'Session data written to storage';
            }
        }

        return {
            'answer': $in.response.answer,
            'message': $in.response.message,
            'ok': $in.response.answer,
        };
    };

    /**
     * Remove the session data on the responder node and on the initiator node
     * Get the session data. Call the other node responder_end_session
     * If success then delete the data in path infohub_session/node/{node}
     * @version 2020-01-12
     * @since 2020-01-12
     * @author Peter Lembke
     */
    $functions.push('initiator_end_session');
    const initiator_end_session = function($in = {}) {
        const $default = {
            'node': '', // name of the node to end the session on both sides.
            'response': {
                'data': {
                    'initiator_user_name': '',
                    'left_overs': '',
                    'session_id': '',
                    'session_created_at': '',
                },
                'answer': 'false',
                'message': 'Nothing to report',
            },
            'step': 'step_get_session_data',
        };
        $in = _Default($default, $in);

        let $sessionId = '';

        if ($in.step === 'step_get_session_data') {
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_storage',
                    'function': 'read',
                },
                'data': {
                    'path': 'infohub_session/node/' + $in.node,
                },
                'data_back': {
                    'node': $in.node,
                    'step': 'step_get_session_data_response',
                },
            });
        }

        if ($in.step === 'step_get_session_data_response') {
            $sessionId = _GetData({
                'name': 'response/data/session_id',
                'default': '',
                'data': $in,
            });

            if (_Empty($sessionId) === 'false') {
                $in.step = 'step_responder_end_session';
            }
        }

        if ($in.step === 'step_responder_end_session') {
            return _SubCall({
                'to': {
                    'node': $in.node,
                    'plugin': 'infohub_session',
                    'function': 'responder_end_session',
                },
                'data': {
                    'session_id': $sessionId,
                },
                'data_back': {
                    'node': $in.node,
                    'step': 'step_responder_end_session_response',
                },
            });
        }

        if ($in.step === 'step_responder_end_session_response') {
            if ($in.response.answer === 'true') {
                $in.step = 'step_delete_session_data';
            }
        }

        if ($in.step === 'step_delete_session_data') {
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_storage',
                    'function': 'write',
                },
                'data': {
                    'path': 'infohub_session/node/' + $in.node,
                    'data': {},
                },
                'data_back': {
                    'node': $in.node,
                    'step': 'step_delete_session_data_response',
                },
            });
        }

        if ($in.step === 'step_delete_session_data_response') {
            // not used
        }

        return {
            'answer': $in.response.answer,
            'message': $in.response.message,
            'ok': $in.response.answer,
        };
    };

    /**
     * Each outgoing package must be signed to protect from data manipulation
     * @version 2020-01-12
     * @since 2020-01-12
     * @author Peter Lembke
     */
    $functions.push('initiator_calculate_sign_code');
    const initiator_calculate_sign_code = function($in = {}) {
        const $default = {
            'node': '', // node name
            'messages_checksum': '', // md5 checksum of all messages in the package
            'step': 'step_get_session_data',
            'response': {
                'data': {},
                'answer': 'false',
                'message': 'Nothing to report',
                'checksum': '',
            },
            'data_back': {
                'sign_code': '',
                'sign_code_created_at': '',
                'session_id': '',
                'user_name': '',
            },
        };
        $in = _Default($default, $in);

        let $signCodeCreatedAt = '';
        let $ok = 'false';

        if ($in.step === 'step_get_session_data') {
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_storage',
                    'function': 'read',
                },
                'data': {
                    'path': 'infohub_session/node/' + $in.node,
                },
                'data_back': {
                    'node': $in.node,
                    'messages_checksum': $in.messages_checksum, // md5 checksum of all messages in the package
                    'step': 'step_get_session_data_response',
                },
            });
        }

        if ($in.step === 'step_get_session_data_response') {
            if ($in.response.answer === 'true') {
                $in.step = 'step_calculate';
            }
        }

        if ($in.step === 'step_calculate') {
            let $data = _GetData({
                'name': 'response/data',
                'default': {},
                'data': $in,
            });

            if (_Empty($data) === 'false') {
                $signCodeCreatedAt = _CreatedAt();

                let $string = $data.session_created_at + $signCodeCreatedAt +
                    $data.left_overs + $in.messages_checksum +
                    $data.session_id + $data.initiator_user_name;

                return _SubCall({
                    'to': {
                        'node': 'client',
                        'plugin': 'infohub_checksum',
                        'function': 'calculate_checksum',
                    },
                    'data': {
                        'value': $string,
                    },
                    'data_back': {
                        'sign_code': $in.data_back.sign_code,
                        'sign_code_created_at': $signCodeCreatedAt,
                        'session_id': $data.session_id,
                        'user_name': $data.initiator_user_name,
                        'step': 'step_calculate_response',
                    },
                });
            }
        }

        if ($in.step === 'step_calculate_response') {
            $in.data_back.sign_code = $in.response.checksum;
            $ok = 'true';
        }

        if (_Empty($in.data_back.sign_code_created_at) === 'true') {
            $in.data_back.sign_code_created_at = _CreatedAt();
        }

        return {
            'answer': $in.response.answer,
            'message': $in.response.message,
            'ok': $ok,
            'sign_code': $in.data_back.sign_code,
            'sign_code_created_at': $in.data_back.sign_code_created_at,
            'session_id': $in.data_back.session_id,
            'user_name': $in.data_back.user_name,
        };
    };

    /**
     * Verify each incoming package by its sign_code
     * @version 2020-05-16
     * @since 2020-01-12
     * @author Peter Lembke
     */
    $functions.push('initiator_verify_sign_code');
    const initiator_verify_sign_code = function($in = {}) {
        const $default = {
            'node': '', // node name
            'messages_checksum': '', // md5 checksum of all messages in the package
            'sign_code': '',
            'sign_code_created_at': '', // 3 decimals
            'step': 'step_verify_sign_code_created_at',
            'response': {
                'data': {},
                'answer': 'false',
                'message': 'Nothing to report',
                'checksum': '',
            },
        };
        $in = _Default($default, $in);

        let $out = {
            'answer': 'false',
            'message': '',
            'ok': 'false',
        };

        // Verify sign_code_created_at that it is max 2 seconds old
        // Read the data in path infohub_session/node/{node}
        // Calculate sign_code
        // Verify sign_code

        if ($in.step === 'step_verify_sign_code_created_at') {
            const $data = _MicroTime() - parseFloat($in.sign_code_created_at);

            if ($data > 0.0 && $data < 2.0) {
                $in.step = 'step_get_session_data';
            } else {
                $out.message = 'sign_code_created_at is too old';
            }
        }

        if ($in.step === 'step_get_session_data') {
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_storage',
                    'function': 'read',
                },
                'data': {
                    'path': 'infohub_session/node/' + $in.node,
                },
                'data_back': {
                    'node': $in.node,
                    'messages_checksum': $in.messages_checksum, // md5 checksum of all messages in the package
                    'sign_code': $in.sign_code,
                    'sign_code_created_at': $in.sign_code_created_at, // 3 decimals
                    'step': 'step_get_session_data_response',
                },
            });
        }

        if ($in.step === 'step_get_session_data_response') {

            $out.message = $in.response.message;

            if ($in.response.answer === 'true') {
                $in.step = 'step_calculate';
            }
        }

        if ($in.step === 'step_calculate') {
            let $data = _GetData({
                'name': 'response/data',
                'default': {},
                'data': $in,
            });

            $out.message = 'Data is empty. Can not calculate any sign_code';

            if (_Empty($data) === 'false') {
                let $string = $data.session_created_at +
                    $in.sign_code_created_at +
                    $data.left_overs + $in.messages_checksum +
                    $data.session_id + $data.initiator_user_name;

                return _SubCall({
                    'to': {
                        'node': 'client',
                        'plugin': 'infohub_checksum',
                        'function': 'calculate_checksum',
                    },
                    'data': {
                        'value': $string,
                    },
                    'data_back': {
                        'sign_code': $in.sign_code,
                        'step': 'step_calculate_response',
                    },
                });
            }
        }

        if ($in.step === 'step_calculate_response') {

            const $signCode = $in.response.checksum;

            $out.message = 'sign_code invalid. Was not the same as my calculated sign_code';

            if ($in.sign_code === $signCode) {
                $out.ok = 'true';
                $out.answer = 'true';
                $out.message = 'sign_code is valid';
            }
        }

        return {
            'answer': $out.answer,
            'message': $out.message,
            'ok': $out.ok,
        };
    };

    /**
     * Check if the session is valid
     * If not valid it will be deleted from the storage
     * Also return user_name and allowed plugin names
     * @version 2020-05-10
     * @since 2020-01-18
     * @author Peter Lembke
     */
    $functions.push('initiator_check_session_valid');
    const initiator_check_session_valid = function($in = {}) {
        const $default = {
            'node': 'client', // node name
            'step': 'step_get_session_data',
            'response': {},
            'data_back': {
                'user_name': '',
                'session_valid': 'false',
                'session_id': '',
                'role_list': [],
            },
        };
        $in = _Default($default, $in);

        let $out = {
            'answer': 'false',
            'message': '',
            'session_id': '',
            'session_valid': 'false',
            'user_name': '',
            'role_list': [],
        };

        if ($in.step === 'step_get_session_data') {
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_storage',
                    'function': 'read',
                },
                'data': {
                    'path': 'infohub_session/node/' + $in.node,
                },
                'data_back': {
                    'node': $in.node,
                    'step': 'step_get_session_data_response',
                },
            });
        }

        if ($in.step === 'step_get_session_data_response') {

            const $default = {
                'answer': '',
                'message': '',
                'data': {
                    'initiator_user_name': '',
                    'left_overs': '',
                    'session_created_at': '',
                    'session_id': '',
                    'role_list': [],
                },
                'post_exist': 'false',
            };
            $in.response = _Default($default, $in.response);

            $out = {
                'answer': $in.response.answer,
                'message': $in.response.message,
                'session_id': $in.response.data.session_id,
                'session_valid': 'false',
                'user_name': $in.response.data.initiator_user_name,
                'role_list': $in.response.data.role_list,
            };

            $in.step = 'step_end';

            if ($in.response.post_exist === 'true') {
                $in.step = 'step_ask_server_if_session_is_valid';
            }
        }

        if ($in.step === 'step_ask_server_if_session_is_valid') {
            return _SubCall({
                'to': {
                    'node': 'server',
                    'plugin': 'infohub_session',
                    'function': 'responder_check_session_valid',
                },
                'data': {
                    'session_id': $out.session_id,
                },
                'data_back': {
                    'node': $in.node,
                    'user_name': $out.user_name,
                    'session_valid': $out.session_valid,
                    'session_id': $out.session_id,
                    'role_list': $out.role_list,
                    'step': 'step_ask_server_if_session_is_valid_response',
                },
            });
        }

        if ($in.step === 'step_ask_server_if_session_is_valid_response') {

            const $default = {
                'answer': '',
                'message': '',
                'session_valid': 'false',
            };
            $in.response = _Default($default, $in.response);

            $out = {
                'answer': $in.response.answer,
                'message': $in.response.message,
                'session_id': $in.data_back.session_id,
                'session_valid': $in.response.session_valid,
                'user_name': $in.data_back.user_name,
                'role_list': $in.data_back.role_list,
            };
        }

        return {
            'answer': $out.answer,
            'message': $out.message,
            'session_valid': $out.session_valid,
            'user_name': $out.user_name,
            'role_list': $out.role_list,
        };
    };

    /**
     * Get session data
     * You only get the public data.
     * Used by infohub_exchange.js to populate the config with session_id and user_name
     * @version 2020-05-16
     * @since 2020-05-16
     * @author Peter Lembke
     */
    $functions.push('initiator_get_session_data');
    const initiator_get_session_data = function($in = {}) {
        const $default = {
            'node': 'client', // node name
            'step': 'step_get_session_data',
            'response': {
                'data': {
                    'initiator_user_name': '',
                    'session_created_at': '',
                    'session_id': '',
                    'role_list': [],
                },
                'answer': 'false',
                'message': 'Nothing to report',
                'post_exist': 'false',
            },
        };
        $in = _Default($default, $in);

        if ($in.step === 'step_get_session_data') {
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_storage',
                    'function': 'read',
                },
                'data': {
                    'path': 'infohub_session/node/' + $in.node,
                },
                'data_back': {
                    'node': $in.node,
                    'step': 'step_get_session_data_response',
                },
            });
        }

        if ($in.step === 'step_get_session_data_response') {
        }

        return {
            'answer': $in.response.answer,
            'message': $in.response.message,
            'post_exist': $in.response.post_exist,
            'user_name': $in.response.data.initiator_user_name,
            'session_id': $in.response.data.session_id,
            'role_list': $in.response.data.role_list,
        };
    };

    const _CreatedAt = function() {
        const $time = _MicroTime();
        return $time.toString();
    };

    /**
     * Delete session data
     * Used by infohub_exchange.js to delete the session data
     * @version 2020-07-07
     * @since 2020-07-07
     * @author Peter Lembke
     */
    $functions.push('delete_session_data');
    const delete_session_data = function($in = {}) {
        const $default = {
            'step': 'step_delete_session_data',
            'response': {
                'answer': 'false',
                'message': 'Nothing to report',
            },
            'from_plugin': {
                'node': '',
                'plugin': '',
            },
        };
        $in = _Default($default, $in);

        let $answer = 'false';
        let $message = '';

        if ($in.from_plugin.node !== 'client' || $in.from_plugin.plugin !==
            'infohub_exchange') {
            $message = 'You are not allowed to call this function';
            $in.step = 'step_end';
        }

        if ($in.step === 'step_delete_session_data') {
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_storage',
                    'function': 'write',
                },
                'data': {
                    'path': 'infohub_session/node/server',
                    'data': {},
                },
                'data_back': {
                    'step': 'step_delete_session_data_response',
                },
            });
        }

        if ($in.step === 'step_delete_session_data_response') {
            $answer = $in.response.answer;
            $message = $in.response.message;
        }

        return {
            'answer': $answer,
            'message': $message,
        };
    };
}

//# sourceURL=infohub_session.js