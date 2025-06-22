/**
 * infohub_login_logout
 * Logout from the server
 *
 * @package     Infohub
 * @subpackage  infohub_login_logout
 * @since       2019-09-03
 * @author      Peter Lembke <info@infohub.se>
 * @license     GPL-3.0-or-later
 * @copyright   Copyright (C) 2010- Peter Lembke
 * @see         https://github.com/peterlembke/infohub/blob/main/folder/plugins/infohub/login/logout/infohub_login_logout.md Documentation
 * @link        https://infohub.se/ InfoHub main page
 */
function infohub_login_logout() {

    'use strict';

// include "infohub_base.js"

    const _Version = function() {
        return {
            'date': '2019-09-03',
            'since': '2019-09-03',
            'version': '1.0.0',
            'checksum': '{{checksum}}',
            'class_name': 'infohub_login_logout',
            'note': 'Logout from the server',
            'status': 'normal',
            'SPDX-License-Identifier': 'GPL-3.0-or-later',
        };
    };

    const _GetCmdFunctions = function() {
        const $list = {
            'create': 'normal',
            'click_logout': 'normal',
        };

        return _GetCmdFunctionsBase($list);
    };

    let $classTranslations = {};

    // ***********************************************************
    // * your class functions below, only declare with var
    // * Can only be reached through cmd()
    // ***********************************************************

    /**
     * Get instructions and create the message to InfoHub View
     * @version 2019-09-03
     * @since   2019-09-03
     * @author  Peter Lembke
     */
    $functions.push('create');
    const create = function($in = {}) {
        const $default = {
            'subtype': 'menu',
            'parent_box_id': '',
            'translations': {},
            'step': 'step_render',
            'response': {
                'answer': 'false',
                'message': '',
            },
        };
        $in = _Default($default, $in);

        if ($in.step === 'step_render') {
            $classTranslations = $in.translations;
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_render',
                    'function': 'create',
                },
                'data': {
                    'what': {
                        'container_logout': {
                            'plugin': 'infohub_rendermajor',
                            'type': 'presentation_box',
                            'head_label': _Translate('LOG_OUT'),
                            'content_data': '[button_logout][status_message]',
                            'head_text': _Translate('HERE_YOU_CAN_LOGOUT_FROM_THE_SERVER'),
                            'foot_text': _Translate('AFTER_YOU_HAVE_LOGGED_OUT_YOU_WILL_BE_REDIRECTED_TO_THE_LOGIN_PAGE') + '.',
                        },
                        'button_logout': {
                            'plugin': 'infohub_renderform',
                            'type': 'button',
                            'mode': 'button',
                            'button_label': _Translate('LOG_OUT'),
                            'event_data': 'logout|logout',
                            'to_plugin': 'infohub_login',
                            'to_function': 'click',
                        },
                        'status_message': {
                            'type': 'common',
                            'subtype': 'container',
                            'tag': 'span',
                            'data': _Translate('RESULT_OF_LOGGING_OUT') + ':',
                            'class': 'container-pretty',
                            'display': 'inline-block',
                        },
                    },
                    'how': {
                        'mode': 'one box',
                        'text': '[container_logout]',
                    },
                    'where': {
                        'box_id': 'main.body.infohub_login.form', // 'box_id': $in.parent_box_id + '.form',
                        'max_width': 100,
                        'scroll_to_box_id': 'true',
                    },
                    'cache_key': 'logout',
                },
                'data_back': {
                    'step': 'step_end',
                },
            });
        }

        return {
            'answer': $in.response.answer,
            'message': $in.response.message,
        };
    };

    /**
     * You clicked the button to logout from the server
     * @version 2020-01-20
     * @since 2019-09-03
     * @author Peter Lembke
     */
    $functions.push('click_logout');
    const click_logout = function($in = {}) {
        const $default = {
            'box_id': '',
            'step': 'step_logout',
            'response': {
                'answer': 'true',
                'message': 'Done',
                'ok': 'true',
            },
            'data_back': {
                'answer': 'true',
                'message': 'Done',
                'ok': 'true',
            },
        };
        $in = _Default($default, $in);

        let $messages = [];

        if ($in.step === 'step_logout') {
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_session',
                    'function': 'initiator_end_session',
                },
                'data': {
                    'node': 'server',
                },
                'data_back': {
                    'step': 'step_logout_response',
                    'box_id': $in.box_id,
                },
            });
        }

        if ($in.step === 'step_logout_response')
        {
            $in.response.message = _Translate('FAILED_TO_LOG_OUT') + ': ' + $in.response.message;
            $in.step = 'step_end';

            if ($in.response.answer === 'true') {
                $in.response.ok = 'true';
                $in.response.message = _Translate('SUCCESS_LOGGING_OUT');
                $in.step = 'step_refresh';
            }

            let $subCall = _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_view',
                    'function': 'set_text',
                },
                'data': {
                    'id': $in.box_id + '.[status_message]',
                    'text': $in.response.message,
                },
                'data_back': {
                    'step': 'step_void',
                },
            });
            $messages.push($subCall);
        }

        if ($in.step === 'step_refresh') {
            const $subCall = _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_login',
                    'function': 'call_server',
                },
                'data': {
                    'to': {
                        'node': 'server',
                        'plugin': 'infohub_dummy',
                        'function': 'reload_page',
                    },
                    'data': {},
                },
                'data_back': {
                    'step': 'step_void',
                },
            });
            $messages.push($subCall);
        }

        return {
            'answer': $in.response.answer,
            'message': $in.response.message,
            'messages': $messages,
            'ok': $in.response.ok,
        };

    };

}

//# sourceURL=infohub_login_logout.js