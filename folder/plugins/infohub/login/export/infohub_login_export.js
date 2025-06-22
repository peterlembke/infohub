/**
 * infohub_login_export
 * Export the contact data you have in the local storage
 *
 * @package     Infohub
 * @subpackage  infohub_login_export
 * @since       2019-09-02
 * @author      Peter Lembke <info@infohub.se>
 * @license     GPL-3.0-or-later
 * @copyright   Copyright (C) 2010- Peter Lembke
 * @see         https://github.com/peterlembke/infohub/blob/main/folder/plugins/infohub/login/export/infohub_login_export.md Documentation
 * @link        https://infohub.se/ InfoHub main page
 */
function infohub_login_export() {

    'use strict';

// include "infohub_base.js"

    const _Version = function() {
        return {
            'date': '2019-09-03',
            'since': '2019-09-02',
            'version': '1.0.0',
            'checksum': '{{checksum}}',
            'class_name': 'infohub_login_export',
            'note': 'Export the contact data you have in the local storage',
            'status': 'normal',
            'SPDX-License-Identifier': 'GPL-3.0-or-later',
        };
    };

    const _GetCmdFunctions = function() {
        const $list = {
            'create': 'normal',
            'click_export': 'normal',
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
                        'container_export': {
                            'plugin': 'infohub_rendermajor',
                            'type': 'presentation_box',
                            'head_label': _Translate('EXPORT_YOUR_CONTACT_INFORMATION'),
                            'foot_text': _Translate('HERE_YOU_CAN_EXPORT_YOUR_CONTACT_INFORMATION_TO_A_NEW_FILE')  + '. ' + _Translate('USEFUL_IF_YOU_HAVE_SET_A_PASSWORD_ON_YOUR_CONTACT_INFORMATION_FILE') + '.',
                            'content_data': '[button_export]'
                        },
                        'button_export': {
                            'plugin': 'infohub_renderform',
                            'type': 'button',
                            'mode': 'button',
                            'button_label': _Translate('EXPORT_YOUR_CONTACT_INFORMATION'),
                            'event_data': 'export|export',
                            'to_plugin': 'infohub_login',
                            'to_function': 'click',
                        },
                    },
                    'how': {
                        'mode': 'one box',
                        'text': '[container_export]',
                    },
                    'where': {
                        'box_id': 'main.body.infohub_login.form', // 'box_id': $in.parent_box_id + '.form',
                        'max_width': 100,
                        'scroll_to_box_id': 'true',
                    },
                    'cache_key': 'export',
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
     * You clicked the button to export the contact data
     * @version 2019-09-08
     * @since 2019-09-08
     * @author Peter Lembke
     */
    $functions.push('click_export');
    const click_export = function($in = {}) {
        const $default = {
            'box_id': '',
            'step': 'step_read_contact',
            'response': {
                'answer': 'true',
                'message': 'Done',
                'data': {},
                'ok': 'true',
            },
        };
        $in = _Default($default, $in);

        if ($in.step === 'step_read_contact') {
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_login_contact',
                    'function': 'storage_read_contact_data',
                },
                'data': {},
                'data_back': {
                    'step': 'step_read_contact_response',
                },
            });
        }

        if ($in.step === 'step_read_contact_response') {
            $in.step = 'step_end';
            if ($in.response.answer === 'true') {
                $in.step = 'step_export_data_to_file';
            }
        }

        if ($in.step === 'step_export_data_to_file') {
            const $fileContentJson = _JsonEncode($in.response.data);
            const $fileName = 'contact.json';

            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_view',
                    'function': 'file_write',
                },
                'data': {
                    'file_name': $fileName,
                    'content': $fileContentJson,
                },
                'data_back': {
                    'step': 'step_export_data_to_file_response',
                },
            });
        }

        if ($in.step === 'step_export_data_to_file_response') {
            $in.step = 'step_end';
            if ($in.response.answer === 'true') {
                $in.response.message = 'File exported';
                $in.response.ok = 'true';
            }
        }

        return {
            'answer': $in.response.answer,
            'message': $in.response.message,
            'ok': $in.response.ok,
        };
    };
}

//# sourceURL=infohub_login_export.js