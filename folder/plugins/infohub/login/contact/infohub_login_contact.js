/*
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
function infohub_login_contact() {

    "use strict";

// include "infohub_base.js"

    const _Version = function() {
        return {
            'date': '2019-09-08',
            'since': '2019-09-08',
            'version': '1.0.0',
            'checksum': '{{checksum}}',
            'class_name': 'infohub_login_contact',
            'note': 'Store, View, Load the contact from Storage',
            'status': 'normal',
            'SPDX-License-Identifier': 'GPL-3.0-or-later'
        };
    };

    const _GetCmdFunctions = function() {
        const $list = {
            'create': 'normal',
            'view_contact': 'normal',
            'storage_read_contact_data': 'normal',
            'storage_write_contact_data': 'normal',
            'storage_forget_contact_data': 'normal',
            'click_save': 'normal'
        };

        return _GetCmdFunctionsBase($list);
    };

    let $classTranslations = {};

    /**
     * Translate - Substitute a string for another string using a class local object
     * @param {type} $string
     * @returns string
     */
    $functions.push('_Translate');
    const _Translate = function ($string)
    {
        if (typeof $classTranslations !== 'object') { return $string; }

        return _GetData({
            'name': _GetClassName() + '|' + $string,
            'default': $string, 'data': $classTranslations, 'split': '|'
        });
    };

    /**
     * These fields is what a contact need
     * @version 2019-09-04
     * @since 2019-09-04
     * @author Peter Lembke
     */
    $functions.push("_SetDefaultNodeData");
    const _SetDefaultNodeData = function ($nodeData)
    {
        const $default = {
            'node': '',
            'note': '',
            'domain_address': '',
            'user_name': '',
            'shared_secret': '',
            'role_list': [],
            'has_password': 'false'
        };
        $nodeData = _Default($default, $nodeData);

        return $nodeData;
    };

    // ***********************************************************
    // * your class functions below, only declare with var
    // * Can only be reached trough cmd()
    // ***********************************************************

    /**
     * Get instructions and create the message to InfoHub View
     * @version 2019-09-03
     * @since   2019-09-03
     * @author  Peter Lembke
     */
    $functions.push('create');
    const create = function ($in)
    {
        const $default = {
            'subtype': 'contact',
            'parent_box_id': '',
            'translations': {},
            'step': 'step_render',
            'response': {
                'answer': 'false',
                'message': '',
                'post_exist': 'false'
            }
        };
        $in = _Default($default, $in);

        if ($in.step === 'step_render') {
            $classTranslations = $in.translations;
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_render',
                    'function': 'create'
                },
                'data': {
                    'what': {
                        'container_contact': {
                            'type': 'common',
                            'subtype': 'container',
                            'tag': 'div',
                            'data': '[form_contact]',
                            'class': 'container-small'
                        },
                        'form_contact': {
                            'plugin': 'infohub_renderform',
                            'type': 'form',
                            'content': '[text_node][text_note][button_save][text_domain_address][text_user_name][text_shared_secret][text_checksum][list_role_list]',
                            'label': _Translate('One contact'),
                            'description': _Translate('This is the data form for one contact'),
                            'open': 'false'
                        },
                        'text_node': {
                            'plugin': 'infohub_renderform',
                            'type': 'text',
                            'label': _Translate('Node'),
                            'description': _Translate('Any text you want'),
                            'maxlength': '30',
                            'validator_plugin': 'infohub_validate',
                            'validator_function': 'validate_has_data',
                            'show_characters_left': 'false'
                        },
                        'text_note': {
                            'plugin': 'infohub_renderform',
                            'type': 'textarea',
                            'label': _Translate('Note'),
                            'description': _Translate('Any text you want'),
                            'validator_plugin': 'infohub_validate',
                            'validator_function': 'validate_has_data',
                            'show_characters': 'false',
                            'show_words': 'false',
                            'show_rows': 'false',
                            'show_paragraphs': 'false'
                        },
                        'button_save': {
                            'plugin': 'infohub_renderform',
                            'type': 'button',
                            'mode': 'button',
                            'button_label': _Translate('Save'),
                            'event_data': 'contact|save',
                            'to_plugin': 'infohub_login',
                            'to_function': 'click'
                        },
                        'text_domain_address': {
                            'plugin': 'infohub_renderform',
                            'type': 'text',
                            'label': _Translate('Domain address'),
                            'description': _Translate('The domain address to your server'),
                            'maxlength': '50',
                            'show_characters_left': 'false',
                            'enabled': 'true'
                        },
                        'text_user_name': {
                            'plugin': 'infohub_renderform',
                            'type': 'text',
                            'label': _Translate('User name'),
                            'description': _Translate('This is you on the server'),
                            'maxlength': '50',
                            'show_characters_left': 'false',
                            'enabled': 'false'
                        },
                        'text_shared_secret': {
                            'plugin': 'infohub_renderform',
                            'type': 'textarea',
                            'label': _Translate('Shared secret'),
                            'description': _Translate('You share this secret with the server'),
                            'show_characters': 'false',
                            'show_words': 'false',
                            'show_rows': 'false',
                            'show_paragraphs': 'false',
                            'enabled': 'false'
                        },
                        'text_checksum': {
                            'plugin': 'infohub_renderform',
                            'type': 'text',
                            'label': _Translate('Checksum'),
                            'description': _Translate('Checksum of domain address + user name + shared secret.'),
                            'show_characters_left': 'false',
                            'enabled': 'false'
                        },
                        'list_role_list': {
                            'plugin': 'infohub_renderform',
                            'type': 'textarea',
                            "label": _Translate("Allowed server plugins"),
                            "description": _Translate("List with all server plugin names you can send messages to on the remote node"),
                            'show_characters': 'false',
                            'show_words': 'false',
                            'show_rows': 'false',
                            'show_paragraphs': 'false',
                            'enabled': 'false'
                        }
                    },
                    'how': {
                        'mode': 'one box',
                        'text': '[container_contact]'
                    },
                    'where': {
                        'box_id': 'main.body.infohub_login.contact', // 'box_id': $in.parent_box_id + '.form',
                        'max_width': 100,
                        'scroll_to_box_id': 'true'
                    },
                    'cache_key': 'contact'
                },
                'data_back': {
                    'step': 'step_show_data'
                }
            });
        }

        if ($in.step === 'step_show_data') {
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_login_contact',
                    'function': 'view_contact'
                },
                'data': {},
                'data_back': {
                    'step': 'step_end'
                }
            });
        }

        return {
            'answer': $in.response.answer,
            'message': $in.response.message,
            'post_exist': $in.response.post_exist
        };
    };

    /**
     * Will load the contact and show it in the GUI
     * @version 2019-09-08
     * @since 2019-09-08
     * @author Peter Lembke
     */
    $functions.push("view_contact");
    const view_contact = function ($in)
    {
        const $default = {
            'step': 'step_read_data_from_storage',
            'response': {
                'answer': 'true',
                'message': 'Done',
                'ok': 'false',
                'data': {},
                'checksum': '',
                'post_exist': 'false'
            },
            'data_back': {
                'contact': {
                    'node': '',
                    'note': '',
                    'domain_address': '',
                    'user_name': '',
                    'shared_secret': '',
                    'checksum': '',
                    'has_password': 'false',
                    'role_list': []
                },
                'checksum': '-',
                'post_exist': 'false'
            }
        };
        $in = _Default($default, $in);

        if ($in.step === 'step_read_data_from_storage')
        {
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_login_contact',
                    'function': 'storage_read_contact_data'
                },
                'data': {},
                'data_back': {
                    'step': 'step_read_data_from_storage_response'
                }
            });
        }

        if ($in.step === 'step_read_data_from_storage_response')
        {
            $in.step = 'step_end';
            if ($in.response.answer === 'true') {
                $in.data_back.contact = $in.response.data;

                if ($in.response.post_exist === 'true') {
                    $in.data_back.post_exist = $in.response.post_exist;
                    $in.step = 'step_get_checksum';
                }

            }
        }

        if ($in.step === 'step_get_checksum')
        {
            const $value = $in.data_back.contact.domain_address + $in.data_back.contact.user_name + $in.data_back.contact.shared_secret;

            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_checksum',
                    'function': 'calculate_checksum'
                },
                'data': {
                    'type': 'crc32',
                    'value': $value,
                },
                'data_back': {
                    'step': 'step_get_checksum_response',
                    'contact': $in.data_back.contact,
                    'post_exist': $in.data_back.post_exist
                }
            });
        }

        if ($in.step === 'step_get_checksum_response')
        {
            // Even if the checksum would fail we still want to show the form data
            $in.step = 'step_show_node_data';
            if ($in.response.answer === 'true') {
                $in.data_back.checksum = $in.response.checksum;
            }
        }

        if ($in.step === 'step_show_node_data')
        {
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_view',
                    'function': 'form_write'
                },
                'data': {
                    'id': 'main.body.infohub_login.contact',
                    'form_data': {
                        'text_node': {'value': $in.data_back.contact.node },
                        'text_note': {'value': $in.data_back.contact.note },
                        'text_domain_address': {'value': $in.data_back.contact.domain_address },
                        'text_user_name': {'value': $in.data_back.contact.user_name },
                        'text_shared_secret': {'value': $in.data_back.contact.shared_secret },
                        'text_checksum': {'value': $in.data_back.checksum },
                        'list_role_list': {'value': $in.data_back.contact.role_list.join("\n") }
                    }
                },
                'data_back': {
                    'step': 'step_show_node_data_response',
                    'post_exist': $in.data_back.post_exist
                }
            });
        }

        if ($in.step === 'step_show_node_data_response')
        {
            $in.step = 'step_end';
            if ($in.response.answer === 'true') {
                $in.response.ok = 'true';
            }
        }

        return {
            'answer': $in.response.answer,
            'message': $in.response.message,
            'ok': $in.response.ok,
            'post_exist': $in.data_back.post_exist
        };
    };

    /**
     * Read the contact data from the local Storage
     * @version 2019-09-04
     * @since 2019-09-04
     * @author Peter Lembke
     */
    $functions.push("storage_read_contact_data");
    const storage_read_contact_data = function ($in)
    {
        const $default = {
            'step': 'step_read',
            'answer': 'true',
            'message': 'Done',
            'data': {},
            'post_exist': 'false'
        };
        $in = _Default($default, $in);

        let $nodeData = {};

        if ($in.step === 'step_read')
        {
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_storage',
                    'function': 'read'
                },
                'data': {
                    'path': 'infohub_login_contact/contact'
                },
                'data_back': {
                    'step': 'step_read_response'
                }
            });

        }

        if ($in.step === 'step_read_response')
        {
            $in.step = 'step_end';

            if ($in.answer === 'true') {
                $nodeData = _SetDefaultNodeData($in.data);
                $in.message = 'Here are the contact';
                if ($in.post_exist === 'false') {
                    $in.message = 'The post do not exist';
                }
            }
        }

        return {
            'answer': $in.answer,
            'message': $in.message,
            'data': $nodeData,
            'post_exist': $in.post_exist
        };

    };

    /**
     * Write the contact data to the local Storage
     * @version 2019-09-04
     * @since 2019-09-04
     * @author Peter Lembke
     */
    $functions.push("storage_write_contact_data");
    const storage_write_contact_data = function ($in)
    {
        const $default = {
            'step': 'step_write',
            'answer': 'true',
            'message': 'Done',
            'data': {}
        };
        $in = _Default($default, $in);

        if ($in.step === 'step_write')
        {
            const $nodeData = _SetDefaultNodeData($in.data);

            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_storage',
                    'function': 'write'
                },
                'data': {
                    'path': 'infohub_login_contact/contact',
                    'data': $nodeData
                },
                'data_back': {
                    'step': 'step_write_response'
                }
            });

        }

        if ($in.step === 'step_write_response')
        {
            $in.step = 'step_end';
        }

        return {
            'answer': $in.answer,
            'message': $in.message
        };

    };

    /**
     * Forget the contact data in the local Storage
     * @version 2020-01-04
     * @since 2020-01-04
     * @author Peter Lembke
     */
    $functions.push("storage_forget_contact_data");
    const storage_forget_contact_data = function ($in)
    {
        const $default = {
            'step': 'step_write',
            'answer': 'true',
            'message': 'Done'
        };
        $in = _Default($default, $in);

        if ($in.step === 'step_write')
        {
            const $nodeData = {};

            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_storage',
                    'function': 'write'
                },
                'data': {
                    'path': 'infohub_login_contact/contact',
                    'data': $nodeData
                },
                'data_back': {
                    'step': 'step_write_response'
                }
            });

        }

        if ($in.step === 'step_write_response')
        {
            $in.step = 'step_end';
        }

        return {
            'answer': $in.answer,
            'message': $in.message
        };

    };

    /**
     * Will load the contact and show it in the GUI
     * @version 2019-09-08
     * @since 2019-09-08
     * @author Peter Lembke
     */
    $functions.push("click_save");
    const click_save = function ($in)
    {
        const $default = {
            'step': 'step_read_form',
            'box_id': '',
            'response': {
                'answer': 'true',
                'message': 'Done',
                'data': {},
                'form_data': {
                    'text_node': {},
                    'text_note': {}
                },
                'ok': 'false'
            },
            'data_back': {
                'form_data': {},
                'contact':{}
            }
        };

        $in = _Default($default, $in);

        if ($in.step === 'step_read_form')
        {
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_view',
                    'function': 'form_read'
                },
                'data': {
                    'id': $in.box_id + '_form_contact_form'
                },
                'data_back': {
                    'step': 'step_read_form_response'
                }
            });
        }

        if ($in.step === 'step_read_form_response')
        {
            $in.step = 'step_end';
            if ($in.response.answer === 'true') {
                $in.data_back.form_data = $in.response.form_data;
                $in.step = 'step_read_contact_data';
            }
        }

        if ($in.step === 'step_read_contact_data')
        {
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_login_contact',
                    'function': 'storage_read_contact_data'
                },
                'data': {},
                'data_back': {
                    'step': 'step_read_contact_data_response',
                    'form_data': $in.data_back.form_data
                }
            });
        }

        if ($in.step === 'step_read_contact_data_response')
        {
            $in.step = 'step_end';
            if ($in.response.answer === 'true') {
                $in.data_back.contact = $in.response.data;
                $in.step = 'step_save_data';
            }
        }

        if ($in.step === 'step_save_data')
        {
            $in.data_back.contact.node = $in.data_back.form_data.text_node.value;
            $in.data_back.contact.note = $in.data_back.form_data.text_note.value;

            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_login_contact',
                    'function': 'storage_write_contact_data'
                },
                'data': {
                    'data': $in.data_back.contact
                },
                'data_back': {
                    'step': 'step_save_data_response',
                }
            });
        }

        if ($in.step === 'step_save_data_response')
        {
            $in.step = 'step_end';
            if ($in.response.answer === 'true') {
                $in.response.ok = 'true';
            }
        }

        return {
            'answer': $in.response.answer,
            'message': $in.response.message,
            'ok': $in.response.ok
        };
    };
}
//# sourceURL=infohub_login_contact.js