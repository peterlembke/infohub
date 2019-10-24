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
function infohub_contact_group() {

// include "infohub_base.js"

    // ***********************************************************
    // * jshint.com options to suppress some warnings
    // ***********************************************************

    /*jshint evil:true */
    /*jshint devel:true */
    /*jslint browser: true, evil: true, plusplus: true, todo: true */

    // ***********************************************************
    // * your private class variables below, only declare with var
    // ***********************************************************

    var _Version = function() {
        return {
            'date': '2019-03-13',
            'since': '2019-02-16',
            'version': '1.0.0',
            'checksum': '{{checksum}}',
            'class_name': 'infohub_contact_group',
            'note': 'Render form for manageing groups with rights to level 1 plugins',
            'status': 'normal',
            'license_name': 'GNU GPL 3 or later'
        };
    };

    var _GetCmdFunctions = function() {
        return {
            'create': 'normal',
            'click_refresh_group': 'normal',
            'click_list_group': 'normal',
            'click_new_group': 'normal',
            'click_save_group': 'normal',
            'click_delete_group': 'normal'
        };
    };

    var $classTranslations = {};

    /**
     * Translate - Substitute a string for another string using a class local object
     * @param {type} $string
     * @returns string
     */
    $functions.push('_Translate');
    var _Translate = function ($string) 
    {
        if (typeof $classTranslations !== 'object') { return $string; }
        return _GetData({
            'name': _GetClassName() + '|' + $string, 
            'default': $string, 'data': $classTranslations, 'split': '|'
        });
    };

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
    var create = function ($in)
    {
        "use strict";
        var $default = {
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
                            'data': '[button_new][button_save][button_delete]',
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
                            'event_data': 'group|refresh_group',
                            'to_plugin': 'infohub_contact',
                            'to_function': 'click'
                        },
                        'list_group': {
                            'plugin': 'infohub_renderform',
                            'type': 'select',
                            "label": _Translate("Group names"),
                            "description": "",
                            "size": "20",
                            "multiple": "false",
                            'event_data': 'group|list_group',
                            'to_plugin': 'infohub_contact',
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
                            'event_data': 'group|new_group',
                            'to_plugin': 'infohub_contact',
                            'to_function': 'click'
                        },
                        'button_save': {
                            'plugin': 'infohub_renderform',
                            'type': 'button',
                            'mode': 'button',
                            'button_label': _Translate('Save'),
                            'event_data': 'group|save_group',
                            'to_plugin': 'infohub_contact',
                            'to_function': 'click'
                        },
                        'button_delete': {
                            'plugin': 'infohub_renderform',
                            'type': 'button',
                            'mode': 'button',
                            'button_label': _Translate('Delete'),
                            'event_data': 'group|delete_group',
                            'to_plugin': 'infohub_contact',
                            'to_function': 'click'
                        },
                        'form_group': {
                            'plugin': 'infohub_renderform',
                            'type': 'form',
                            'content': '[text_group_name][text_note][list_plugin]',
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
                        'list_plugin': {
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
                    },
                    'how': {
                        'mode': 'one box',
                        'text': '[container_group][container_buttons][container_form]'
                    },
                    'where': {
                        'box_id': 'main.body.infohub_contact.form', // 'box_id': $in.parent_box_id + '.form',
                        'max_width': 100,
                        'scroll_to_box_id': 'true'
                    }
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
    var click_refresh_group = function ($in) {
        "use strict";
        var $data = {}, $messageArray = [], $messageOut = {},
            $default = {
                'box_id': '',
                'step': 'step_render_options',
                'response': {
                    'answer': 'true',
                    'message': 'Render the options',
                    'ok': 'true'
                }
            };
        $in = _Default($default, $in);

        if ($in.step === 'step_render_options') 
        {
            $messageOut = _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_render',
                    'function': 'render_options'
                },
                'data': {
                    'id': $in.box_id + '_list_group_form_element',
                    'source_node': 'server',
                    'source_plugin': 'infohub_contact',
                    'source_function': 'load_group_list',
                    'source_data': {}
                },
                'data_back': {
                    'box_id': $in.box_id,
                    'step': 'step_end'
                }
            });
            
            $messageArray.push($messageOut);

            $messageOut = _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_render',
                    'function': 'render_options'
                },
                'data': {
                    'id': $in.box_id + '_list_plugin_form_element',
                    'source_node': 'server',
                    'source_plugin': 'infohub_contact',
                    'source_function': 'load_plugin_list',
                    'source_data': {}
                },
                'data_back': {
                    'box_id': $in.box_id,
                    'step': 'step_end'
                }
            });

            $messageArray.push($messageOut);
        }

        return {
            'answer': $in.response.answer,
            'message': $in.response.message,
            'messages': $messageArray,
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
    var click_list_group = function ($in) {
        "use strict";
        var $default = {
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
                    'plugin': 'infohub_contact',
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
                        'list_plugin': {'value': $in.response.group_data.plugin_names },
                    }
                },
                'data_back': {
                    'step': 'step_show_group_data_response'
                }
            });
        }

        if ($in.step === 'step_show_group_data_response') {
            $in.step = 'step_end';
        }

        return {
            'answer': 'true',
            'message': 'group data shown',
            'ok': $in.ok
        };
    };

    /**
     * Clear the form data
     * @version 2019-02-23
     * @since 2019-02-23
     * @author Peter Lembke
     */
    $functions.push("click_new_group");
    var click_new_group = function ($in) {
        "use strict";
        var $pluginName, $ok = 'false',
            $default = {
                'step': 'step_empty_form',
                'box_id': '',
                'answer': '',
                'message': ''
            };
        $in = _Default($default, $in);

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
                        'list_plugin': {'value': {} }
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
    var click_save_group = function ($in) 
    {
        "use strict";
        var $ok = 'false', $groupData = {},
            $default = {
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
                    'plugin_names': $in.response.form_data.list_plugin.value
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
                    'plugin': 'infohub_contact',
                    'function': 'call_server'
                },
                'data': {
                    'to': {
                        'node': 'server',
                        'plugin': 'infohub_contact',
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
    var click_delete_group = function ($in) {
        "use strict";
        var $ok = 'false', $groupName = '',
            $default = {
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
                    'plugin': 'infohub_contact',
                    'function': 'call_server'
                },
                'data': {
                    'to': {
                        'node': 'server',
                        'plugin': 'infohub_contact',
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
//# sourceURL=infohub_contact_group.js