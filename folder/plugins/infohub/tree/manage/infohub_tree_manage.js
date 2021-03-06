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
function infohub_tree_manage() {

    "use strict";

// include "infohub_base.js"

    const _Version = function() {
        return {
            'date': '2020-08-25',
            'since': '2020-07-25',
            'version': '1.0.0',
            'checksum': '{{checksum}}',
            'class_name': 'infohub_tree_manage',
            'note': 'View Edit and Delete among your personal data. You see the data as json',
            'status': 'normal',
            'SPDX-License-Identifier': 'GPL-3.0-or-later'
        };
    };

    const _GetCmdFunctions = function() {
        const $list = {
            'create': 'normal',
            'click_plugin_selected': 'normal',
            'click_path_selected': 'normal',
            'click_delete': 'normal',
            'click_write': 'normal'
        };

        return _GetCmdFunctionsBase($list);
    };

    let $classTranslations = {};

    // ***********************************************************
    // * your class functions below, only declare with var
    // * Can only be reached trough cmd()
    // ***********************************************************

    /**
     * Get instructions and create the message to InfoHub View
     * @version 2016-10-16
     * @since   2016-10-16
     * @author  Peter Lembke
     */
    $functions.push('create');
    const create = function ($in)
    {
        const $default = {
            'subtype': 'menu',
            'parent_box_id': '',
            'translations': {},
            'step': 'step_render',
            'response': {
                'answer': 'false',
                'message': ''
            }
        };
        $in = _Default($default, $in);

        if ($in.step === 'step_render')
        {
            $classTranslations = $in.translations;

            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_render',
                    'function': 'create'
                },
                'data': {
                    'what': {
                        'container_group': {
                            'type': 'common',
                            'subtype': 'container',
                            'tag': 'div',
                            'data': '[button_refresh_group][list_group]',
                            'class': 'container-small'
                        },
                        'container_buttons': {
                            'type': 'common',
                            'subtype': 'container',
                            'tag': 'div',
                            'data': '[button_new][button_save][button_delete][group_icon]',
                            'class': 'container-small'
                        },
                        'container_form': {
                            'type': 'common',
                            'subtype': 'container',
                            'tag': 'div',
                            'data': '[form_group]',
                            'class': 'container-medium'
                        },
                        'button_refresh_group': {
                            'plugin': 'infohub_renderform',
                            'type': 'button',
                            'mode': 'button',
                            'button_label': _Translate('Refresh groups'),
                            'button_left_icon': '[refresh_icon]',
                            'event_data': 'group|refresh_group',
                            'to_plugin': 'infohub_tree',
                            'to_function': 'click'
                        },
                        'refresh_icon': {
                            'type': 'common',
                            'subtype': 'svg',
                            'data': '[refresh_asset]'
                        },
                        'refresh_asset': {
                            'plugin': 'infohub_asset',
                            'type': 'icon',
                            'asset_name': 'refresh',
                            'plugin_name': 'infohub_tree'
                        },
                        'list_group': {
                            'plugin': 'infohub_renderform',
                            'type': 'select',
                            "label": _Translate("Group names"),
                            "description": "",
                            "size": "20",
                            "multiple": "false",
                            'event_data': 'group|list_group',
                            'to_plugin': 'infohub_tree',
                            'to_function': 'click',
                            "options": [],
                            'css_data': {
                                '.select': 'max-width: 200px;'
                            }
                        },
                        'button_new': {
                            'plugin': 'infohub_renderform',
                            'type': 'button',
                            'mode': 'button',
                            'button_label': _Translate('New'),
                            'button_left_icon': '[new_icon]',
                            'event_data': 'group|new_group',
                            'to_plugin': 'infohub_tree',
                            'to_function': 'click'
                        },
                        'new_icon': {
                            'type': 'common',
                            'subtype': 'svg',
                            'data': '[new_asset]'
                        },
                        'new_asset': {
                            'plugin': 'infohub_asset',
                            'type': 'icon',
                            'asset_name': 'add_client',
                            'plugin_name': 'infohub_tree'
                        },
                        'button_save': {
                            'plugin': 'infohub_renderform',
                            'type': 'button',
                            'mode': 'button',
                            'button_label': _Translate('Save'),
                            'button_left_icon': '[save_icon]',
                            'event_data': 'group|save_group',
                            'to_plugin': 'infohub_tree',
                            'to_function': 'click'
                        },
                        'save_icon': {
                            'type': 'common',
                            'subtype': 'svg',
                            'data': '[save_asset]'
                        },
                        'save_asset': {
                            'plugin': 'infohub_asset',
                            'type': 'icon',
                            'asset_name': 'save_data',
                            'plugin_name': 'infohub_tree'
                        },
                        'button_delete': {
                            'plugin': 'infohub_renderform',
                            'type': 'button',
                            'mode': 'button',
                            'button_label': _Translate('Delete'),
                            'button_left_icon': '[delete_icon]',
                            'event_data': 'group|delete_group',
                            'to_plugin': 'infohub_tree',
                            'to_function': 'click'
                        },
                        'delete_icon': {
                            'type': 'common',
                            'subtype': 'svg',
                            'data': '[delete_asset]'
                        },
                        'delete_asset': {
                            'plugin': 'infohub_asset',
                            'type': 'icon',
                            'asset_name': 'delete',
                            'plugin_name': 'infohub_tree'
                        },
                        'form_group': {
                            'plugin': 'infohub_renderform',
                            'type': 'form',
                            'content': '[text_group_name][text_note][list_server_plugin]',
                            'label': _Translate('Rights for one group'),
                            'description': ''
                        },
                        'text_group_name': {
                            'plugin': 'infohub_renderform',
                            'type': 'text',
                            'label': _Translate('Group name'),
                            'description': '',
                            'maxlength': '30',
                            'validator_plugin': 'infohub_validate',
                            'validator_function': 'validate_has_data',
                            'show_characters_left': 'false'
                        },
                        'text_note': {
                            'plugin': 'infohub_renderform',
                            'type': 'textarea',
                            'label': _Translate('Your note'),
                            'description': '',
                            'validator_plugin': 'infohub_validate',
                            'validator_function': 'validate_has_data',
                            'show_characters': 'false',
                            'show_words': 'false',
                            'show_rows': 'false',
                            'show_paragraphs': 'false'
                        },
                        'list_server_plugin': {
                            'plugin': 'infohub_renderform',
                            'type': 'select',
                            "label": _Translate("Select server plugins in this group"),
                            "description": "",
                            'event_data': 'client',
                            "size": "16",
                            "multiple": "true",
                            "options": [],
                            'css_data': {
                                '.select': 'max-width: 200px;'
                            }
                        },
                        'group_icon': {
                            'type': 'common',
                            'subtype': 'svg',
                            'data': '[group_asset]',
                            'css_data': {
                                '.svg': 'width:64px; height:64px; padding:1px; max-width:64px;'
                            }
                        },
                        'group_asset': {
                            'plugin': 'infohub_asset',
                            'type': 'icon',
                            'asset_name': 'group/group',
                            'plugin_name': 'infohub_tree'
                        }
                    },
                    'how': {
                        'mode': 'one box',
                        'text': '[container_group][container_buttons][container_form]'
                    },
                    'where': {
                        'box_id': 'main.body.infohub_tree.form', // 'box_id': $in.parent_box_id + '.form',
                        'max_width': 100,
                        'scroll_to_box_id': 'true'
                    },
                    'cache_key': 'manage'
                },
                'data_back': {
                    'step': 'step_end'
                }
            });
        }

        return {
            'answer': $in.response.answer,
            'message': $in.response.message
        };
    };

    /**
     * Refresh the list with group names
     * Used by both group and client to list group names + level 1 server plugin names
     * @version 2019-02-23
     * @since 2019-02-23
     * @author Peter Lembke
     */
    $functions.push("click_refresh_group");
    const click_refresh_group = function ($in)
    {
        const $default = {
            'box_id': '',
            'step': 'step_render_options',
            'response': {
                'answer': 'true',
                'message': 'Render the options',
                'ok': 'true'
            }
        };
        $in = _Default($default, $in);

        let $messageArray = [];

        if ($in.step === 'step_render_options')
        {
            let $messageOut = _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_render',
                    'function': 'render_options'
                },
                'data': {
                    'id': $in.box_id + '_list_server_plugin_form_element',
                    'source_node': 'server',
                    'source_plugin': 'infohub_tree',
                    'source_function': 'load_plugin_list',
                    'source_data': {}
                },
                'data_back': {
                    'box_id': $in.box_id,
                    'step': 'step_end'
                }
            });

            $messageArray.push($messageOut);

            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_render',
                    'function': 'render_options'
                },
                'data': {
                    'id': $in.box_id + '_list_group_form_element',
                    'source_node': 'server',
                    'source_plugin': 'infohub_tree',
                    'source_function': 'load_group_list',
                    'source_data': {}
                },
                'messages': $messageArray,
                'data_back': {
                    'box_id': $in.box_id,
                    'step': 'step_end'
                }
            });
        }

        return {
            'answer': $in.response.answer,
            'message': $in.response.message,
            'ok': $in.response.ok
        };
    };

    /**
     * Get group data from the server and show it on screen
     * @version 2019-02-23
     * @since 2019-02-23
     * @author Peter Lembke
     */
    $functions.push("click_list_group");
    const click_list_group = function ($in)
    {
        const $default = {
            'value': '',
            'box_id': '',
            'step': 'step_load_group_data',
            'ok': 'false',
            'response': {
                'answer': '',
                'message': '',
                'group_data': {},
                'ok': 'false'
            }
        };
        $in = _Default($default, $in);

        if ($in.step === 'step_load_group_data') {
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_tree',
                    'function': 'call_server'
                },
                'data': {
                    'to': { 'function': 'load_group_data' },
                    'data': {
                        'name': $in.value
                    }
                },
                'data_back': {
                    'value': $in.value,
                    'box_id': $in.box_id,
                    'step': 'step_load_group_data_response'
                }
            });           
        }

        if ($in.step === 'step_load_group_data_response') {
            $in.step = 'step_show_group_data';
        }

        if ($in.step === 'step_show_group_data') {
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_view',
                    'function': 'form_write'
                },
                'data': {
                    'id': $in.box_id + '_form_group_form',
                    'form_data': {
                        'text_group_name': {'value': $in.response.group_data.name },
                        'text_note': {'value': $in.response.group_data.note },
                        'list_server_plugin': {'value': $in.response.group_data.server_plugin_names },
                    }
                },
                'data_back': {
                    'step': 'step_show_group_data_response'
                }
            });
        }

        if ($in.step === 'step_show_group_data_response') {
            $in.step = 'step_end';
            if ($in.response.answer === 'true') {
                $in.response.ok = $in.response.answer;
            }
        }

        return {
            'answer': $in.response.answer,
            'message': $in.response.message,
            'ok': $in.response.ok
        };
    };

    /**
     * Clear the form data
     * @version 2019-02-23
     * @since 2019-02-23
     * @author Peter Lembke
     */
    $functions.push("click_new_group");
    const click_new_group = function ($in)
    {
        const $default = {
            'step': 'step_empty_form',
            'box_id': '',
            'answer': '',
            'message': ''
        };
        $in = _Default($default, $in);

        let $ok = 'false';

        if ($in.step === 'step_empty_form') {
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_view',
                    'function': 'form_write'
                },
                'data': {
                    'id': $in.box_id + '_form_group_form',
                    'form_data': {
                        'text_group_name': {'value': ''},
                        'text_note': {'value': ''},
                        'list_server_plugin': {'value': {} }
                    }
                },
                'data_back': {
                    'step': 'step_empty_form_response'
                }
            });
        }

        if ($in.step === 'step_empty_form_response') {
            $in.message = 'Form emptied';
            $ok = 'true';
        }

        return {
            'answer': $in.answer,
            'message': $in.message,
            'ok': $ok
        };
    };

    /**
     * When you press button "Save" you come here. Data will be saved on the server.
     * @version 2019-02-23
     * @since 2019-02-23
     * @author Peter Lembke
     */
    $functions.push("click_save_group");
    const click_save_group = function ($in)
    {
        let $ok = 'false',
            $groupData = {};

        const $default = {
            'box_id': '',
            'step': 'step_form_read',
            'answer': '',
            'message': '',
            'response': {
                'form_data': {}
            }
        };
        $in = _Default($default, $in);

        if ($in.step === 'step_form_read') {
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_view',
                    'function': 'form_read'
                },
                'data': {
                    'id': $in.box_id + '_form_group_form'
                },
                'data_back': {
                    'box_id': $in.box_id,
                    'step': 'step_form_read_response'
                }
            });
        }

        if ($in.step === 'step_form_read_response') {
            if ($in.answer === 'true') {
                $groupData = {
                    'name': $in.response.form_data.text_group_name.value,
                    'note': $in.response.form_data.text_note.value,
                    'server_plugin_names': $in.response.form_data.list_server_plugin.value
                };
                $in.step = 'step_save_group_data';
            }
            if ($in.answer === 'false') {
                $in.step = 'step_end';
            }
        }
        
        if ($in.step === 'step_save_group_data') {
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_tree',
                    'function': 'call_server'
                },
                'data': {
                    'to': {
                        'node': 'server',
                        'plugin': 'infohub_tree',
                        'function': 'save_group_data'
                    },
                    'data': {
                        'group_data': $groupData
                    }
                },
                'data_back': {
                    'box_id': $in.box_id,
                    'step': 'step_save_group_data_response'
                }
            });
        }

        if ($in.step === 'step_save_group_data_response') {
            $ok = 'true';
            if ($in.answer === 'false') {
                $in.step = 'step_end';
                $ok = 'false';
            }
        }

        return {
            'answer': $in.answer,
            'message': $in.message,
            'ok': $ok
        };
    };

    /**
     * Button event "click_delete_group" will delete the group data from the server.
     * @version 2019-02-23
     * @since 2019-02-23
     * @author Peter Lembke
     */
    $functions.push("click_delete_group");
    const click_delete_group = function ($in)
    {
        let $ok = 'false',
            $groupName = '';

        const $default = {
            'box_id': '',
            'step': 'step_form_read',
            'answer': '',
            'message': '',
            'response': {
                'form_data': {}
            }
        };
        $in = _Default($default, $in);

        if ($in.step === 'step_form_read') {
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_view',
                    'function': 'form_read'
                },
                'data': {
                    'id': $in.box_id + '_form_group_form'
                },
                'data_back': {
                    'box_id': $in.box_id,
                    'step': 'step_form_read_response'
                }
            });
        }

        if ($in.step === 'step_form_read_response') {
            if ($in.answer === 'true') {
                $groupName = $in.response.form_data.text_group_name.value;
                $in.step = 'step_delete_group_data';
                if (_Empty($groupName) === 'true') {
                    $in.step = 'step_end';
                    $in.message = 'Group name is empty';
                }
            }
            if ($in.answer === 'false') {
                $in.step = 'step_end';
            }
        }
        
        if ($in.step === 'step_delete_group_data') {
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_tree',
                    'function': 'call_server'
                },
                'data': {
                    'to': {
                        'node': 'server',
                        'plugin': 'infohub_tree',
                        'function': 'delete_group_data'
                    },
                    'data': {
                        'name': $groupName
                    }
                },
                'data_back': {
                    'box_id': $in.box_id,
                    'step': 'step_delete_group_data_response'
                }
            });
        }

        if ($in.step === 'step_delete_group_data_response') {
            $ok = 'true';
            if ($in.answer === 'false') {
                $in.step = 'step_end';
                $ok = 'false';
            }
        }

        return {
            'answer': $in.answer,
            'message': $in.message,
            'ok': $ok
        };
    };
}
//# sourceURL=infohub_tree_manage.js