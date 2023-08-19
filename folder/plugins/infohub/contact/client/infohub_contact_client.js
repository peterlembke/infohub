/**
 * Render form for managing client contacts
 *
 * @author      Peter Lembke <info@infohub.se>
 * @version     2020-08-02
 * @since       2019-02-16
 * @copyright   Copyright (c) 2019, Peter Lembke
 * @license     https://opensource.org/licenses/gpl-license.php GPL-3.0-or-later
 * @see         https://github.com/peterlembke/infohub/blob/master/folder/plugins/infohub/contact/client/infohub_contact_client.md Documentation
 * @link        https://infohub.se/ InfoHub main page
 */
function infohub_contact_client() {

    'use strict';

// include "infohub_base.js"

    $functions.push('_Version');
    /**
     * Version information, used by the version function
     * @returns {{date: string, note: string, 'SPDX-License-Identifier': string, checksum: string, version: string, class_name: string, since: string, status: string}}
     * @private
     */
    const _Version = function() {
        return {
            'date': '2020-08-02',
            'since': '2019-02-16',
            'version': '1.0.0',
            'checksum': '{{checksum}}',
            'class_name': 'infohub_contact_client',
            'note': 'Render form for managing client contacts',
            'status': 'normal',
            'SPDX-License-Identifier': 'GPL-3.0-or-later',
        };
    };

    $functions.push('_GetCmdFunctions');
    /**
     * List with all public functions you can call
     * @returns {*}
     * @private
     */
    const _GetCmdFunctions = function() {
        const $list = {
            'create': 'normal',
            'click_refresh': 'normal',
            'click_new': 'normal',
            'click_save': 'normal',
            'click_delete': 'normal',
            'click_list': 'normal',
            'click_import': 'normal',
            'click_export': 'normal',
        };

        return _GetCmdFunctionsBase($list);
    };

    /**
     * Internal functions must start with a capital letter
     * Used by renderers to get a proper function name
     * @version 2016-10-16
     * @since   2016-10-16
     * @author  Peter Lembke
     * @param $text
     * @return string
     */
    const _GetFuncName = function($text) {
        let $response = '';
        const $parts = $text.split('_');

        for (let $key in $parts) {
            if ($parts.hasOwnProperty($key) === false) {
                continue;
            }
            $response = $response + $parts[$key].charAt(0).toUpperCase() +
                $parts[$key].substring(1);
        }
        return $response;
    };

    let $classTranslations = {};

    // ***********************************************************
    // * your class functions below, only declare with var
    // * Can only be reached through cmd()
    // ***********************************************************

    /**
     * Get instructions and create the message to InfoHub View
     * @version 2019-03-13
     * @since   2016-10-16
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
                        'container_contacts': {
                            'type': 'common',
                            'subtype': 'container',
                            'tag': 'div',
                            'data': '[button_refresh][list_contacts]',
                            'class': 'container-small',
                        },
                        'container_buttons': {
                            'type': 'common',
                            'subtype': 'container',
                            'tag': 'div',
                            'data': '[button_new][button_save][button_delete][button_import][button_export][client_icon]',
                            'class': 'container-small',
                        },
                        'container_form': {
                            'type': 'common',
                            'subtype': 'container',
                            'tag': 'div',
                            'data': '[form_contact]',
                            'class': 'container-medium',
                        },
                        'button_refresh': {
                            'plugin': 'infohub_renderform',
                            'type': 'button',
                            'mode': 'button',
                            'button_label': _Translate('REFRESH_CLIENTS'),
                            'button_left_icon': '[refresh_icon]',
                            'event_data': 'client|refresh',
                            'to_plugin': 'infohub_contact',
                            'to_function': 'click',
                        },
                        'refresh_icon': {
                            'type': 'common',
                            'subtype': 'svg',
                            'data': '[refresh_asset]',
                        },
                        'refresh_asset': {
                            'plugin': 'infohub_asset',
                            'type': 'icon',
                            'asset_name': 'refresh',
                            'plugin_name': 'infohub_contact',
                        },
                        'list_contacts': {
                            'plugin': 'infohub_renderform',
                            'type': 'select',
                            "label": _Translate("CLIENT_CONTACTS"),
                            "description": _Translate("LIST_ALL_CLIENT_CONTACTS"),
                            "size": "20",
                            "multiple": "false",
                            'validator_plugin': 'infohub_validate',
                            'validator_function': 'validate_has_data',
                            'event_data': 'client|list',
                            'to_plugin': 'infohub_contact',
                            'to_function': 'click',
                            'options': [],
                        },
                        'button_new': {
                            'plugin': 'infohub_renderform',
                            'type': 'button',
                            'mode': 'button',
                            'button_label': _Translate('NEW'),
                            'button_left_icon': '[new_icon]',
                            'event_data': 'client|new',
                            'to_plugin': 'infohub_contact',
                            'to_function': 'click',
                        },
                        'new_icon': {
                            'type': 'common',
                            'subtype': 'svg',
                            'data': '[new_asset]',
                        },
                        'new_asset': {
                            'plugin': 'infohub_asset',
                            'type': 'icon',
                            'asset_name': 'add_client',
                            'plugin_name': 'infohub_contact',
                        },
                        'button_save': {
                            'plugin': 'infohub_renderform',
                            'type': 'button',
                            'mode': 'button',
                            'button_label': _Translate('SAVE'),
                            'button_left_icon': '[save_icon]',
                            'event_data': 'client|save',
                            'to_plugin': 'infohub_contact',
                            'to_function': 'click',
                        },
                        'save_icon': {
                            'type': 'common',
                            'subtype': 'svg',
                            'data': '[save_asset]',
                        },
                        'save_asset': {
                            'plugin': 'infohub_asset',
                            'type': 'icon',
                            'asset_name': 'save_data',
                            'plugin_name': 'infohub_contact',
                        },
                        'button_delete': {
                            'plugin': 'infohub_renderform',
                            'type': 'button',
                            'mode': 'button',
                            'button_label': _Translate('DELETE'),
                            'button_left_icon': '[delete_icon]',
                            'event_data': 'client|delete',
                            'to_plugin': 'infohub_contact',
                            'to_function': 'click',
                        },
                        'delete_icon': {
                            'type': 'common',
                            'subtype': 'svg',
                            'data': '[delete_asset]',
                        },
                        'delete_asset': {
                            'plugin': 'infohub_asset',
                            'type': 'icon',
                            'asset_name': 'delete',
                            'plugin_name': 'infohub_contact',
                        },
                        'button_import': {
                            'plugin': 'infohub_renderform',
                            'type': 'file',
                            'button_label': _Translate('IMPORT'),
                            'button_left_icon': '[import_icon]',
                            'accept': 'application/json,.json', // https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/file#Unique_file_type_specifiers
                            'event_data': 'client|import',
                            'to_node': 'client',
                            'to_plugin': 'infohub_contact',
                            'to_function': 'click',
                        },
                        'import_icon': {
                            'type': 'common',
                            'subtype': 'svg',
                            'data': '[import_asset]',
                        },
                        'import_asset': {
                            'plugin': 'infohub_asset',
                            'type': 'icon',
                            'asset_name': 'import',
                            'plugin_name': 'infohub_contact',
                        },
                        'button_export': {
                            'plugin': 'infohub_renderform',
                            'type': 'button',
                            'mode': 'button',
                            'button_label': _Translate('EXPORT'),
                            'button_left_icon': '[export_icon]',
                            'event_data': 'client|export',
                            'to_node': 'client',
                            'to_plugin': 'infohub_contact',
                            'to_function': 'click',
                        },
                        'export_icon': {
                            'type': 'common',
                            'subtype': 'svg',
                            'data': '[export_asset]',
                        },
                        'export_asset': {
                            'plugin': 'infohub_asset',
                            'type': 'icon',
                            'asset_name': 'export',
                            'plugin_name': 'infohub_contact',
                        },
                        'form_contact': {
                            'plugin': 'infohub_renderform',
                            'type': 'form',
                            'content': '[text_node][text_note][text_domain_address][text_user_name][text_shared_secret][list_role_list]',
                            'label': _Translate('ONE_CONTACT'),
                            'description': _Translate('THIS_IS_THE_DATA_FORM_FOR_ONE_CONTACT')
                        },
                        'text_node': {
                            'plugin': 'infohub_renderform',
                            'type': 'text',
                            'label': _Translate('NODE'),
                            'description': _Translate('YOUR_UNIQUE_NAME_OF_THE_CLIENT'),
                            'maxlength': '30',
                            'validator_plugin': 'infohub_validate',
                            'validator_function': 'validate_has_data',
                            'show_characters_left': 'false',
                        },
                        'text_note': {
                            'plugin': 'infohub_renderform',
                            'type': 'textarea',
                            'label': _Translate('NOTE'),
                            'description': _Translate('ANY_TEXT_YOU_WANT'),
                            'validator_plugin': 'infohub_validate',
                            'validator_function': 'validate_has_data',
                            'show_characters': 'false',
                            'show_words': 'false',
                            'show_rows': 'false',
                            'show_paragraphs': 'false',
                        },
                        'text_domain_address': {
                            'plugin': 'infohub_renderform',
                            'type': 'text',
                            'label': _Translate('DOMAIN_ADDRESS'),
                            'description': _Translate('THE_DOMAIN_ADDRESS_TO_YOUR_SERVER'),
                            'maxlength': '50',
                            'show_characters_left': 'false',
                            'enabled': 'true',
                        },
                        'text_user_name': {
                            'plugin': 'infohub_renderform',
                            'type': 'text',
                            'label': _Translate('USER_NAME'),
                            'description': _Translate('YOU_GET_A_HUB-UUID_WHEN_YOU_SAVE_(LEAVE_BLANK)'),
                            'maxlength': '50',
                            'show_characters_left': 'false',
                            'enabled': 'false',
                        },
                        'text_shared_secret': {
                            'plugin': 'infohub_renderform',
                            'type': 'textarea',
                            'label': _Translate('SHARED_SECRET'),
                            'description': _Translate('YOU_WILL_GET_A_2K_RANDOM_STRING_WHEN_YOU_SAVE_(LEAVE_BLANK)'),
                            'show_characters': 'false',
                            'show_words': 'false',
                            'show_rows': 'false',
                            'show_paragraphs': 'false',
                            'enabled': 'false',
                        },
                        'list_role_list': {
                            'plugin': 'infohub_renderform',
                            'type': 'select',
                            "label": _Translate("ALLOWED_ROLES"),
                            "description": _Translate("LIST_WITH_ALL_USER_ROLES_YOU_HAVE"),
                            'event_data': 'client',
                            "size": "6",
                            "multiple": "true",
                            "options": [
                                { "type": "option", "value": "user", "label": _Translate("USER") },
                                { "type": "option", "value": "developer", "label": _Translate("DEVELOPER") },
                                { "type": "option", "value": "admin", "label": _Translate("ADMIN") }
                            ],
                        },
                        'client_icon': {
                            'type': 'common',
                            'subtype': 'svg',
                            'data': '[client_asset]',
                            'css_data': {
                                '.svg': 'width:64px; height:64px; padding:1px; max-width:64px;',
                            },
                        },
                        'client_asset': {
                            'plugin': 'infohub_asset',
                            'type': 'icon',
                            'asset_name': 'client/client',
                            'plugin_name': 'infohub_contact',
                        },
                    },
                    'how': {
                        'mode': 'one box',
                        'text': '[container_contacts][container_buttons][container_form]',
                    },
                    'where': {
                        'box_id': 'main.body.infohub_contact.form', // 'box_id': $in.parent_box_id + '.form',
                        'max_width': 100,
                        'scroll_to_box_id': 'true',
                    },
                    'cache_key': 'client',
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
     * Refresh the list with contacts
     * @version 2019-01-24
     * @since 2019-01-24
     * @author Peter Lembke
     */
    $functions.push('click_refresh');
    const click_refresh = function($in = {}) {
        const $default = {
            'box_id': '',
            'step': 'step_render_options',
            'response': {
                'answer': 'false',
                'message': '',
                'node_list': [],
                'ok': 'false',
            },
        };
        $in = _Default($default, $in);

        let $messageArray = [];

        if ($in.step === 'step_render_options') {
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_render',
                    'function': 'render_options',
                },
                'data': {
                    'id': $in.box_id + '_list_contacts_form_element',
                    'source_node': 'server',
                    'source_plugin': 'infohub_contact',
                    'source_function': 'load_node_list',
                    'source_data': {
                        'type': 'client',
                    },
                },
                'data_back': {
                    'step': 'step_end',
                },
            });
        }

        return {
            'answer': 'true',
            'message': $in.response.message,
            'ok': $in.response.ok,
        };
    };

    /**
     * Clear the form data
     * @version 2019-02-07
     * @since 2019-01-16
     * @author Peter Lembke
     */
    $functions.push('click_new');
    const click_new = function($in = {}) {
        let $ok = 'false';

        const $default = {
            'step': 'step_empty_form',
            'box_id': '',
            'answer': '',
            'message': '',
        };
        $in = _Default($default, $in);

        if ($in.step === 'step_empty_form') {
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_view',
                    'function': 'form_write',
                },
                'data': {
                    'id': $in.box_id + '_form_contact_form',
                    'form_data': {
                        'text_node': {'value': ''},
                        'text_note': {'value': ''},
                        'text_domain_address': {'value': ''},
                        'text_user_name': {'value': ''},
                        'text_shared_secret': {'value': ''},
                        'list_role_list': {'value': {}},
                    },
                },
                'data_back': {
                    'step': 'step_empty_form_response',
                },
            });
        }

        if ($in.step === 'step_empty_form_response') {
            $in.message = 'Form emptied';
            $ok = 'true';
        }

        return {
            'answer': $in.answer,
            'message': $in.message,
            'ok': $ok,
        };
    };

    /**
     * When you press button "Save" you come here. Data will be saved on the server.
     * @version 2019-01-16
     * @since 2019-01-16
     * @author Peter Lembke
     */
    $functions.push('click_save');
    const click_save = function($in = {}) {
        let $ok = 'false',
            $nodeData = {};

        const $default = {
            'box_id': '',
            'step': 'step_form_read',
            'answer': '',
            'message': '',
            'response': {
                'form_data': {},
            },
        };
        $in = _Default($default, $in);

        if ($in.step === 'step_form_read') {
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_view',
                    'function': 'form_read',
                },
                'data': {
                    'id': $in.box_id + '_form_contact_form',
                },
                'data_back': {
                    'box_id': $in.box_id,
                    'step': 'step_form_read_response',
                },
            });
        }

        if ($in.step === 'step_form_read_response') {
            if ($in.answer === 'true') {
                $nodeData = {
                    'node': $in.response.form_data.text_node.value,
                    'note': $in.response.form_data.text_note.value,
                    'domain_address': $in.response.form_data.text_domain_address.value,
                    'user_name': $in.response.form_data.text_user_name.value,
                    'shared_secret': $in.response.form_data.text_shared_secret.value,
                    'role_list': $in.response.form_data.list_role_list.value,
                };
                $in.step = 'step_save_node_data';
            }

            if ($in.answer === 'false') {
                $in.step = 'step_end';
            }
        }

        if ($in.step === 'step_save_node_data') {
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_contact',
                    'function': 'call_server',
                },
                'data': {
                    'to': {
                        'node': 'server',
                        'plugin': 'infohub_contact',
                        'function': 'save_node_data',
                    },
                    'data': {
                        'node_data': $nodeData,
                        'type': 'client',
                    },
                },
                'data_back': {
                    'box_id': $in.box_id,
                    'step': 'step_save_node_data_response',
                },
            });
        }

        if ($in.step === 'step_save_node_data_response') {
            $ok = 'true';
            if ($in.answer === 'false') {
                $in.step = 'step_end';
                $ok = 'false';
            }
        }

        return {
            'answer': $in.answer,
            'message': $in.message,
            'ok': $ok,
        };
    };

    /**
     * Buton event "click_delete" will delete the node data from the server.
     * @version 2019-01-16
     * @since 2019-01-16
     * @author Peter Lembke
     */
    $functions.push('click_delete');
    const click_delete = function($in = {}) {
        let $ok = 'false',
            $userName = '';

        const $default = {
            'box_id': '',
            'step': 'step_form_read',
            'answer': '',
            'message': '',
            'response': {
                'form_data': {},
            },
        };
        $in = _Default($default, $in);

        if ($in.step === 'step_form_read') {
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_view',
                    'function': 'form_read',
                },
                'data': {
                    'id': $in.box_id + '_form_contact_form',
                },
                'data_back': {
                    'box_id': $in.box_id,
                    'step': 'step_form_read_response',
                },
            });
        }

        if ($in.step === 'step_form_read_response') {
            if ($in.answer === 'true') {
                $userName = $in.response.form_data.text_user_name.value;
                $in.step = 'step_delete_node_data';
                if (_Empty($userName) === 'true') {
                    $in.step = 'step_end';
                    $in.message = 'User name is empty';
                }
            }
            if ($in.answer === 'false') {
                $in.step = 'step_end';
            }
        }

        if ($in.step === 'step_delete_node_data') {
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_contact',
                    'function': 'call_server',
                },
                'data': {
                    'to': {
                        'node': 'server',
                        'plugin': 'infohub_contact',
                        'function': 'delete_node_data',
                    },
                    'data': {
                        'user_name': $userName,
                        'type': 'client',
                    },
                },
                'data_back': {
                    'box_id': $in.box_id,
                    'step': 'step_delete_node_data_response',
                },
            });
        }

        if ($in.step === 'step_delete_node_data_response') {
            $ok = 'true';
            if ($in.answer === 'false') {
                $in.step = 'step_end';
                $ok = 'false';
            }
        }

        return {
            'answer': $in.answer,
            'message': $in.message,
            'ok': $ok,
        };
    };

    /**
     * Get node data from the server and show it on screen
     * @version 2019-01-16
     * @since 2019-01-16
     * @author Peter Lembke
     */
    $functions.push('click_list');
    const click_list = function($in = {}) {
        const $default = {
            'value': '',
            'box_id': '',
            'step': 'step_load_node_data',
            'ok': 'false',
            'response': {
                'answer': '',
                'message': '',
                'node_data': {},
                'ok': 'false',
            },
        };
        $in = _Default($default, $in);

        if ($in.step === 'step_load_node_data') {
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_contact',
                    'function': 'call_server',
                },
                'data': {
                    'to': {
                        'node': 'server',
                        'plugin': 'infohub_contact',
                        'function': 'load_node_data',
                    },
                    'data': {
                        'user_name': $in.value,
                        'type': 'client',
                    },
                },
                'data_back': {
                    'value': $in.value,
                    'box_id': $in.box_id,
                    'step': 'step_load_node_data_response',
                },
            });
        }

        if ($in.step === 'step_load_node_data_response') {
            $in.step = 'step_show_node_data';
        }

        if ($in.step === 'step_show_node_data') {
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_view',
                    'function': 'form_write',
                },
                'data': {
                    'id': $in.box_id + '_form_contact_form',
                    'form_data': {
                        'text_node': {'value': $in.response.node_data.node},
                        'text_note': {'value': $in.response.node_data.note},
                        'text_domain_address': {'value': $in.response.node_data.domain_address},
                        'text_user_name': {'value': $in.response.node_data.user_name},
                        'text_shared_secret': {'value': $in.response.node_data.shared_secret},
                        'list_role_list': {'value': $in.response.node_data.role_list},
                    },
                },
                'data_back': {
                    'step': 'step_show_node_data_response',
                },
            });
        }

        if ($in.step === 'step_show_node_data_response') {
            $in.step = 'step_end';
        }

        return {
            'answer': 'true',
            'message': 'Node data shown',
            'ok': $in.ok,
        };
    };

    /**
     * Button event "click_import" when you have selected a file for import
     * @version 2019-02-10
     * @since 2019-01-16
     * @author Peter Lembke
     */
    $functions.push('click_import');
    const click_import = function($in = {}) {
        let $nodeData = {},
            $ok = 'false';

        const $default = {
            'box_id': '',
            'step': 'step_file_read_response',
            'answer': '',
            'message': '',
            'files_data': [],
        };
        $in = _Default($default, $in);

        if ($in.step === 'step_file_read_response') {
            $in.step = 'step_check_if_json';
            if ($in.files_data.length !== 1) {
                $in.message = 'One file must be selected';
                $in.step = 'step_end';
            }
        }

        if ($in.step === 'step_check_if_json') {
            $nodeData = $in.files_data[0].content;
            $in.step = 'step_form_write';
            if (typeof $nodeData !== 'object') {
                $in.message = 'This is not a json file';
                $in.step = 'step_end';
            }
        }

        if ($in.step === 'step_form_write') {
            const $defaultNodeData = {
                'node': '',
                'note': '',
                'domain_address': '',
                'user_name': '',
                'shared_secret': '',
                'role_list': [],
            };
            $nodeData = _Default($defaultNodeData, $nodeData);

            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_view',
                    'function': 'form_write',
                },
                'data': {
                    'id': $in.box_id + '_form_contact_form',
                    'form_data': {
                        'text_node': {'value': $nodeData.node},
                        'text_note': {'value': $nodeData.note},
                        'text_domain_address': {'value': $nodeData.domain_address},
                        'text_user_name': {'value': $nodeData.user_name},
                        'text_shared_secret': {'value': $nodeData.shared_secret},
                        'list_role_list': {
                            'value': $nodeData.role_list,
                            'mode': '',
                        },
                    },
                },
                'data_back': {
                    'box_id': $in.box_id,
                    'step': 'step_form_write_response',
                },
            });
        }

        if ($in.step === 'step_form_write_response') {
            $in.step = 'step_end';
            if ($in.answer === 'true') {
                $in.message = 'File imported';
                $ok = 'true';
            }
        }

        return {
            'answer': $in.answer,
            'message': $in.message,
            'ok': $ok,
        };
    };

    /**
     * Export the contact data you see in the boxes
     * @version 2019-02-10
     * @since   2019-02-10
     * @author  Peter Lembke
     */
    $functions.push('click_export');
    const click_export = function($in = {}) {
        let $nodeData = {},
            $ok = 'false',
            $content = '';

        const $default = {
            'box_id': '',
            'step': 'step_form_read',
            'answer': 'false',
            'message': 'Nothing',
            'response': {
                'form_data': {},
            },
        };
        $in = _Merge($default, $in);

        if ($in.step === 'step_form_read') {
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_view',
                    'function': 'form_read',
                },
                'data': {
                    'id': $in.box_id + '_form_contact_form',
                },
                'data_back': {
                    'box_id': $in.box_id,
                    'step': 'step_form_read_response',
                },
            });
        }

        if ($in.step === 'step_form_read_response') {
            $in.step = 'step_end';
            if ($in.answer === 'true') {
                $nodeData = {
                    'node': $in.response.form_data.text_node.value,
                    'note': $in.response.form_data.text_note.value,
                    'domain_address': $in.response.form_data.text_domain_address.value,
                    'user_name': $in.response.form_data.text_user_name.value,
                    'shared_secret': $in.response.form_data.text_shared_secret.value,
                    'role_list': $in.response.form_data.list_role_list.value,
                };
                $content = _JsonEncode($nodeData);
                $in.step = 'step_file_write';
            }
        }

        if ($in.step === 'step_file_write') {
            const $fileName = $nodeData.node + '.json';
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_view',
                    'function': 'file_write',
                },
                'data': {
                    'file_name': $fileName,
                    'content': $content,
                },
                'data_back': {
                    'step': 'step_file_write_response',
                },
            });
        }

        if ($in.step === 'step_file_write_response') {
            $in.step = 'step_end';
            if ($in.answer === 'true') {
                $in.message = 'File exported';
                $ok = 'true';
            }
        }

        return {
            'answer': $in.answer,
            'message': $in.message,
            'ok': $ok,
        };
    };
}

//# sourceURL=infohub_contact_client.js