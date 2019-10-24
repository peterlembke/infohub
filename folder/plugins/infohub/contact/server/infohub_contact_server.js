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
function infohub_contact_server() {

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

    var _Version = function () {
        return {
            'date': '2019-02-16',
            'version': '1.0.0',
            'checksum': '{{checksum}}',
            'class_name': 'infohub_contact_server',
            'note': 'Render a form for manageing your incoming-outgoing connection to other servers',
            'status': 'normal',
            'license_name': 'GNU GPL 3 or later'
        };
    };

    var _GetCmdFunctions = function () {
        return {
            'create': 'normal',
            'click_refresh': 'normal',
            'click_save': 'normal',
            'click_delete': 'normal',
            'click_list': 'normal',
            'click_import': 'normal',
            'click_export': 'normal'
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
                            'data': '[button_save][button_delete][button_import][button_export][button_ping][container_ping]',
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
                            'button_label': _Translate('Refresh'),
                            'event_data': 'server|refresh',
                            'to_plugin': 'infohub_contact',
                            'to_function': 'click'
                        },
                        'list_contacts': {
                            'plugin': 'infohub_renderform',
                            'type': 'select',
                            "label": _Translate("Server Contacts"),
                            "description": _Translate("List all server contacts"),
                            "size": "20",
                            "multiple": "false",
                            'validator_plugin': 'infohub_validate',
                            'validator_function': 'validate_has_data',
                            'event_data': 'server|list',
                            'to_plugin': 'infohub_contact',
                            'to_function': 'click',
                            "options": [],
                            'css_data': {
                                '.select': 'max-width: 200px;'
                            }
                        },
                        'button_save': {
                            'plugin': 'infohub_renderform',
                            'type': 'button',
                            'mode': 'button',
                            'button_label': _Translate('Save'),
                            'event_data': 'server|save',
                            'to_plugin': 'infohub_contact',
                            'to_function': 'click'
                        },
                        'button_delete': {
                            'plugin': 'infohub_renderform',
                            'type': 'button',
                            'mode': 'button',
                            'button_label': _Translate('Delete'),
                            'event_data': 'server|delete',
                            'to_plugin': 'infohub_contact',
                            'to_function': 'click'
                        },
                        'button_import': {
                            'plugin': 'infohub_renderform',
                            'type': 'file',
                            'button_label': _Translate('Import'),
                            'accept': 'application/json,.json', // https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/file#Unique_file_type_specifiers
                            'event_data': 'server|import',
                            'to_node': 'client',
                            'to_plugin': 'infohub_contact',
                            'to_function': 'click'
                        },
                        'button_export': {
                            'plugin': 'infohub_renderform',
                            'type': 'button',
                            'mode': 'button',
                            'button_label': _Translate('Export'),
                            'event_data': 'server|export',
                            'to_node': 'client',
                            'to_plugin': 'infohub_contact',
                            'to_function': 'click'
                        },
                        'button_ping': {
                            'plugin': 'infohub_renderform',
                            'type': 'button',
                            'mode': 'button',
                            'button_label': _Translate('Ping server'),
                            'event_data': 'server|ping',
                            'to_plugin': 'infohub_contact',
                            'to_function': 'click'
                        },
                        'container_ping': {
                            'type': 'common',
                            'subtype': 'container',
                            'tag': 'div',
                            'data': '',
                            'class': 'container-small'
                        },
                        'form_contact': {
                            'plugin': 'infohub_renderform',
                            'type': 'form',
                            'content': '[text_node][text_note][text_domain_address][text_user_name][text_shared_secret][list_plugin]',
                            'label': _Translate('One contact'),
                            'description': _Translate('This is the data form for one contact.')
                        },
                        'text_node': {
                            'plugin': 'infohub_renderform',
                            'type': 'text',
                            'label': _Translate('Node'),
                            'description': _Translate('Your unique node name'),
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
                            'description': _Translate('The domain address to the remote server'),
                            'maxlength': '50',
                            'validator_plugin': 'infohub_validate',
                            'validator_function': 'validate_has_data',
                            'show_characters_left': 'false'
                        },
                        'text_user_name': {
                            'plugin': 'infohub_renderform',
                            'type': 'text',
                            'label': _Translate('User name'),
                            'description': _Translate('Hub-UUID you got from the remote server'),
                            'maxlength': '50',
                            'show_characters_left': 'false',
                            'enabled': 'false'
                        },
                        'text_shared_secret': {
                            'plugin': 'infohub_renderform',
                            'type': 'textarea',
                            'label': _Translate('Shared secret'),
                            'description': _Translate('2K random string you got from the remove server'),
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
                            'event_data': 'server',
                            "size": "6",
                            "options": [],
                            'enabled': 'false',
                            'css_data': {
                                '.select': 'max-width: 200px;'
                            }
                        },
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
     * @version 2019-03-13
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
                        'type': 'server'
                    }
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
                        'type': 'server'
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
                        'type': 'server'
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
                        'type': 'server'
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
     * Button event "click_import" when you have selected a file for import
     * @version 2019-02-10
     * @since 2019-01-16
     * @author Peter Lembke
     */
    $functions.push("click_import");
    var click_import = function ($in) {
        "use strict";
        var $nodeData = {}, $ok = 'false',
            $mode,
            $default = {
                'box_id': '',
                'step': 'step_file_read_response',
                'answer': '',
                'message': '',
                'event_data': '',
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
            
            $mode = 'clean_and_add';
            
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
                        'list_plugin': {'value': $nodeData.plugin_names, 'mode': $mode }
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
//# sourceURL=infohub_contact_server.js