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
function infohub_contact_client() {

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
            'class_name': 'infohub_contact_client',
            'note': 'Render form for manageing client contacts',
            'status': 'normal',
            'license_name': 'GNU GPL 3 or later'
        };
    };

    var _GetCmdFunctions = function() {
        return {
            'create': 'normal',
            'click_refresh': 'normal',
            'click_new': 'normal',
            'click_save': 'normal',
            'click_delete': 'normal',
            'click_list': 'normal',
            'click_refresh_group': 'normal',
            'click_list_group_client': 'normal',
            'click_import': 'normal',
            'click_export': 'normal'
        };
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
    var _GetFuncName = function($text) {
        "use strict";
        var $parts, $key, $response = '';
        $parts = $text.split('_');
        for ($key in $parts) {
            if ($parts.hasOwnProperty($key) === false) {
                continue;
            }
            $response = $response + $parts[$key].charAt(0).toUpperCase() + $parts[$key].substr(1);
        }
        return $response;
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
     * @version 2019-03-13
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
                        'container_contacts': {
                            'type': 'common',
                            'subtype': 'container',
                            'tag': 'div',
                            'data': '[button_refresh][list_contacts]',
                            'class': 'container-small'
                        },
                        'container_buttons': {
                            'type': 'common',
                            'subtype': 'container',
                            'tag': 'div',
                            'data': '[button_new][button_save][button_delete][button_import][button_export][list_group]',
                            'class': 'container-small'
                        },
                        'container_form': {
                            'type': 'common',
                            'subtype': 'container',
                            'tag': 'div',
                            'data': '[form_contact]',
                            'class': 'container-medium'
                        },
                        'button_refresh': {
                            'plugin': 'infohub_renderform',
                            'type': 'button',
                            'mode': 'button',
                            'button_label': _Translate('Refresh Clients'),
                            'event_data': 'client|refresh',
                            'to_plugin': 'infohub_contact',
                            'to_function': 'click'
                        },
                        'list_contacts': {
                            'plugin': 'infohub_renderform',
                            'type': 'select',
                            "label": _Translate("Client Contacts"),
                            "description": _Translate("List all client contacts"),
                            "size": "20",
                            "multiple": "false",
                            'validator_plugin': 'infohub_validate',
                            'validator_function': 'validate_has_data',
                            'event_data': 'client|list',
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
                            'event_data': 'client|new',
                            'to_plugin': 'infohub_contact',
                            'to_function': 'click'
                        },
                        'button_save': {
                            'plugin': 'infohub_renderform',
                            'type': 'button',
                            'mode': 'button',
                            'button_label': _Translate('Save'),
                            'event_data': 'client|save',
                            'to_plugin': 'infohub_contact',
                            'to_function': 'click'
                        },
                        'button_delete': {
                            'plugin': 'infohub_renderform',
                            'type': 'button',
                            'mode': 'button',
                            'button_label': _Translate('Delete'),
                            'event_data': 'client|delete',
                            'to_plugin': 'infohub_contact',
                            'to_function': 'click'
                        },
                        'button_import': {
                            'plugin': 'infohub_renderform',
                            'type': 'file',
                            'button_label': _Translate('Import'),
                            'accept': 'application/json,.json', // https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/file#Unique_file_type_specifiers
                            'event_data': 'client|import',
                            'to_node': 'client',
                            'to_plugin': 'infohub_contact',
                            'to_function': 'click'
                        },
                        'button_export': {
                            'plugin': 'infohub_renderform',
                            'type': 'button',
                            'mode': 'button',
                            'button_label': _Translate('Export'),
                            'event_data': 'client|export',
                            'to_node': 'client',
                            'to_plugin': 'infohub_contact',
                            'to_function': 'click'
                        },
                        'list_group': {
                            'plugin': 'infohub_renderform',
                            'type': 'select',
                            "label": _Translate("Groups"),
                            "description": _Translate("Pick groups for this client"),
                            "size": "6",
                            "multiple": "true",
                            'event_data': 'client|list_group_client',
                            'to_plugin': 'infohub_contact',
                            'to_function': 'click',
                            "options": [],
                            'css_data': {
                                '.select': 'max-width: 200px;'
                            }
                        },
                        'form_contact': {
                            'plugin': 'infohub_renderform',
                            'type': 'form',
                            'content': '[text_node][text_note][text_domain_address][text_user_name][text_shared_secret][list_plugin]',
                            'label': _Translate('One contact'),
                            'description': _Translate('This is the data form for one contact')
                        },
                        'text_node': {
                            'plugin': 'infohub_renderform',
                            'type': 'text',
                            'label': _Translate('Node'),
                            'description': _Translate('Your unique name of the client'),
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
                            'description': _Translate('You get a Hub-UUID when you save (Leave blank)'),
                            'maxlength': '50',
                            'show_characters_left': 'false',
                            'enabled': 'false'
                        },
                        'text_shared_secret': {
                            'plugin': 'infohub_renderform',
                            'type': 'textarea',
                            'label': _Translate('Shared secret'),
                            'description': _Translate('You will get a 2K random string when you save (Leave blank)'),
                            'show_characters': 'false',
                            'show_words': 'false',
                            'show_rows': 'false',
                            'show_paragraphs': 'false',
                            'enabled': 'false'
                        },
                        'list_plugin': {
                            'plugin': 'infohub_renderform',
                            'type': 'select',
                            "label": _Translate("Allowed plugins"),
                            "description": _Translate("List with all plugin names you can send messages to on this node"),
                            'event_data': 'client',
                            "size": "6",
                            "multiple": "true",
                            "options": [],
                            'css_data': {
                                '.select': 'max-width: 200px;'
                            }
                        }
                    },
                    'how': {
                        'mode': 'one box',
                        'text': '[container_contacts][container_buttons][container_form]'
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
     * Refresh the list with contacts
     * @version 2019-01-24
     * @since 2019-01-24
     * @author Peter Lembke
     */
    $functions.push("click_refresh");
    var click_refresh = function ($in) {
        "use strict";
        var $data = {}, $messageArray = [], $messageOut = {},
            $default = {
                'box_id': '',
                'step': 'step_render_options',
                'response': {
                    'answer': 'false',
                    'message': '',
                    'node_list': [],
                    'ok': 'false'
                }
            };
        $in = _Default($default, $in);

        if ($in.step === 'step_render_options') {
            $messageOut = _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_render',
                    'function': 'render_options'
                },
                'data': {
                    'id': $in.box_id + '_list_contacts_form_element',
                    'source_node': 'server',
                    'source_plugin': 'infohub_contact',
                    'source_function': 'load_node_list',
                    'source_data': {
                        'type': 'client'
                    }
                },
                'data_back': {
                    'step': 'step_end'
                }
            });
            $messageArray.push($messageOut);

            $messageOut = _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_contact_client',
                    'function': 'click_refresh_group'
                },
                'data': {
                    'box_id': $in.box_id
                },
                'data_back': {
                    'step': 'step_end'
                }
            });
            $messageArray.push($messageOut);
        }
        
        return {
            'answer': 'true',
            'message': 'Rendered the option list',
            'messages': $messageArray,
            'ok': 'true'
        };

    };

    /**
     * Clear the form data
     * @version 2019-02-07
     * @since 2019-01-16
     * @author Peter Lembke
     */
    $functions.push("click_new");
    var click_new = function ($in) {
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
                    'id': $in.box_id + '_form_contact_form',
                    'form_data': {
                        'text_node': {'value': ''},
                        'text_note': {'value': ''},
                        'text_domain_address': {'value': ''},
                        'text_user_name': {'value': ''},
                        'text_shared_secret': {'value': ''},
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
     * @version 2019-01-16
     * @since 2019-01-16
     * @author Peter Lembke
     */
    $functions.push("click_save");
    var click_save = function ($in) 
    {
        "use strict";
        var $ok = 'false', $nodeData = {},
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
                    'id': $in.box_id + '_form_contact_form'
                },
                'data_back': {
                    'box_id': $in.box_id,
                    'step': 'step_form_read_response'
                }
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
                    'plugin_names': $in.response.form_data.list_plugin.value
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
                    'function': 'call_server'
                },
                'data': {
                    'to': {
                        'node': 'server',
                        'plugin': 'infohub_contact',
                        'function': 'save_node_data'
                    },
                    'data': {
                        'node_data': $nodeData,
                        'type': 'client'
                    }
                },
                'data_back': {
                    'box_id': $in.box_id,
                    'step': 'step_save_node_data_response'
                }
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
            'ok': $ok
        };
    };

    /**
     * Buton event "click_delete" will delete the node data from the server.
     * @version 2019-01-16
     * @since 2019-01-16
     * @author Peter Lembke
     */
    $functions.push("click_delete");
    var click_delete = function ($in) {
        "use strict";
        var $ok = 'false', $node = '',
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
                    'id': $in.box_id + '_form_contact_form'
                },
                'data_back': {
                    'box_id': $in.box_id,
                    'step': 'step_form_read_response'
                }
            });
        }

        if ($in.step === 'step_form_read_response') {
            if ($in.answer === 'true') {
                $node = $in.response.form_data.text_node.value;
                $in.step = 'step_delete_node_data';
                if (_Empty($node) === 'true') {
                    $in.step = 'step_end';
                    $in.message = 'Node name is empty';
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
                    'function': 'call_server'
                },
                'data': {
                    'to': {
                        'node': 'server',
                        'plugin': 'infohub_contact',
                        'function': 'delete_node_data'
                    },
                    'data': {
                        'node': $node,
                        'type': 'client'
                    }                
                },
                'data_back': {
                    'box_id': $in.box_id,
                    'step': 'step_delete_node_data_response'
                }
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
            'ok': $ok
        };
    };

    /**
     * Get node data from the server and show it on screen
     * @version 2019-01-16
     * @since 2019-01-16
     * @author Peter Lembke
     */
    $functions.push("click_list");
    var click_list = function ($in) {
        "use strict";
        var $default = {
                'value': '',
                'box_id': '',
                'step': 'step_load_node_data',
                'ok': 'false',
                'response': {
                    'answer': '',
                    'message': '',
                    'node_data': {},
                    'ok': 'false'
                }
            };
        $in = _Default($default, $in);

        if ($in.step === 'step_load_node_data') {
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
                        'function': 'load_node_data'
                    },
                    'data': {
                        'node': $in.value,
                        'type': 'client'
                    }
                },
                'data_back': {
                    'value': $in.value,
                    'box_id': $in.box_id,
                    'step': 'step_load_node_data_response'
                }
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
                    'function': 'form_write'
                },
                'data': {
                    'id': $in.box_id + '_form_contact_form',
                    'form_data': {
                        'text_node': {'value': $in.response.node_data.node },
                        'text_note': {'value': $in.response.node_data.note },
                        'text_domain_address': {'value': $in.response.node_data.domain_address },
                        'text_user_name': {'value': $in.response.node_data.user_name },
                        'text_shared_secret': {'value': $in.response.node_data.shared_secret },
                        'list_plugin': {'value': $in.response.node_data.plugin_names }
                    }
                },
                'data_back': {
                    'step': 'step_show_node_data_response'
                }
            });
        }

        if ($in.step === 'step_show_node_data_response') {
            $in.step = 'step_end';
        }

        return {
            'answer': 'true',
            'message': 'Node data shown',
            'ok': $in.ok
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
     * Client has a group list. When you click it you come here.
     * You can select multiple groups.
     * The associated groups plugins will be set in the plugin list.
     * @version 2019-03-02
     * @since 2019-02-24
     * @author Peter Lembke
     */
    $functions.push("click_list_group_client");
    var click_list_group_client = function ($in) {
        "use strict";
        var $default = {
                'values': [],
                'box_id': '',
                'step': 'step_load_group_data',
                'ok': 'false',
                'response': {
                    'answer': '',
                    'message': '',
                    'group_data': {}, // list with group names and their data
                    'groups_merged': [], // plugin names from all groups in group_data
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
                    'to': {
                        'node': 'server',
                        'plugin': 'infohub_contact',
                        'function': 'load_groups_data'
                    },
                    'data': {
                        'names': $in.values
                    }
                },
                'data_back': {
                    'values': $in.values,
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
                    'id': $in.box_id + '_form_contact_form',
                    'form_data': {
                        'list_plugin': {'value': $in.response.groups_merged }
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
     * Button event "click_import" when you have selected a file for import
     * @version 2019-02-10
     * @since 2019-01-16
     * @author Peter Lembke
     */
    $functions.push("click_import");
    var click_import = function ($in) {
        "use strict";
        var $nodeData = {}, $ok = 'false',
            $default = {
                'box_id': '',
                'step': 'step_file_read_response',
                'answer': '',
                'message': '',
                'files_data': []
            };
        $in = _Default($default, $in);

        if ($in.step === 'step_file_read_response') 
        {
            $in.step = 'step_check_if_json';
            if ($in.files_data.length !== 1) {
                $in.message = 'One file must be selected';
                $in.step = 'step_end';
            }
        }
        
        if ($in.step === 'step_check_if_json') 
        {
            $nodeData = $in.files_data[0].content;
            $in.step = 'step_form_write'
            if (typeof $nodeData !== 'object') {
                $in.message = 'This is not a json file';
                $in.step = 'step_end';
            }
        }
            
        if ($in.step === 'step_form_write') {
            $default = {
                'node': '',
                'note': '',
                'domain_address': '',
                'user_name': '',
                'shared_secret': '',
                'plugin_names': []
            };
            $nodeData = _Default($default, $nodeData);
            
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_view',
                    'function': 'form_write'
                },
                'data': {
                    'id': $in.box_id + '_form_contact_form',
                    'form_data': {
                        'text_node': {'value': $nodeData.node },
                        'text_note': {'value': $nodeData.note },
                        'text_domain_address': {'value': $nodeData.domain_address },
                        'text_user_name': {'value': $nodeData.user_name },
                        'text_shared_secret': {'value': $nodeData.shared_secret },
                        'list_plugin': {'value': $nodeData.plugin_names, 'mode': '' }
                    }
                },
                'data_back': {
                    'box_id': $in.box_id,
                    'step': 'step_form_write_response'
                }
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
            'ok': $ok
        };
    };

    /**
     * Export the contact data you see in the boxes
     * @version 2019-02-10
     * @since   2019-02-10
     * @author  Peter Lembke
     */
    $functions.push('click_export');
    var click_export = function ($in) {
        "use strict";
        var $nodeData = {}, $ok = 'false', $content = '', $fileName = '',
            $default = {
                'box_id': '',
                'step': 'step_form_read',
                'answer': 'false',
                'message': 'Nothing',
                'response': {
                    'form_data': {}
                }
            };
        $in = _Merge($default, $in);

        if ($in.step === 'step_form_read') {
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
                    'box_id': $in.box_id,
                    'step': 'step_form_read_response'
                }
            });
        }

        if ($in.step === 'step_form_read_response') 
        {
            $in.step = 'step_end';
            if ($in.answer === 'true') {
                $nodeData = {
                    'node': $in.response.form_data.text_node.value,
                    'note': $in.response.form_data.text_note.value,
                    'domain_address': $in.response.form_data.text_domain_address.value,
                    'user_name': $in.response.form_data.text_user_name.value,
                    'shared_secret': $in.response.form_data.text_shared_secret.value,
                    'plugin_names': $in.response.form_data.list_plugin.value
                };
                $content = _JsonEncode($nodeData);
                $in.step = 'step_file_write';
            }
        }

        if ($in.step === 'step_file_write') 
        {
            $fileName = $nodeData['node'] + '.json';
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_view',
                    'function': 'file_write'
                },
                'data': {
                    'file_name': $fileName,
                    'content': $content
                },
                'data_back': {
                    'step': 'step_file_write_response'
                }
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
            'ok': $ok
        };

    };


}
//# sourceURL=infohub_contact_client.js