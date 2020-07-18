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
function infohub_launcher() {

    "use strict";

// include "infohub_base.js"

    /**
     * Mandatory version information
     * @returns {{date: string, version: string, checksum: string, class_name: string, note: string, status: string, license_name: string, icon: string, title: string, icon_license: string}}
     * @private
     */
    $functions.push("_Version");
    const _Version = function() {
        return {
            'date': '2019-06-19',
            'since': '2017-06-02',
            'version': '1.1.0',
            'checksum': '{{checksum}}',
            'class_name': 'infohub_launcher',
            'note': 'Plugin with a GUI where you can start other plugins',
            'status': 'normal',
            'SPDX-License-Identifier': 'GPL-3.0-or-later',
            'title': 'Launcher',
            'recommended_security_group': 'core'
        };
    };

    /**
     * Mandatory function list of public functions
     * If you do not add your public function here then it can not be used
     * @returns {{setup_gui: string, render_list: string, refresh_list: string, update_local_list: string, my_list_add: string, event_message: string}}
     * @private
     */
    $functions.push("_GetCmdFunctions");
    const _GetCmdFunctions = function() {
        return {
            'setup_gui': 'normal', // Set up the launcher graphical user interface
            'first_contact': 'normal', // Step by step you are guided how to use infohub
            'switch_button': 'normal', // Switch between my_list and full_list
            'render_list': 'normal', // Render my_list or full_list
            'get_option_list': 'normal', // Use this as source for select boxes if you want the plugin names from my_list or full_list
            'refresh_list': 'normal', // Renders my_list or full_list with plugins including the refresh icon.
            'get_list': 'normal', // Give the list name my_list or full_list and you will get the list from infohub_launcher.
            'update_full_list': 'normal', // If the local full_list is missing or old then it asks the server for an update and stores the list locally.
            'my_list_add': 'normal', // Add plugin to my_list
            'my_list_remove': 'normal', // Remove plugin from my_list
            'plugin_information': 'normal', // Get plugin information from the plugin/asset/launcher.json
            'get_launch_information': 'normal', // Use by owner, infohub_asset, infohub_launcher. Get launch data, icon data, license data.
            'get_launch_list': 'normal', // Use by infoub_launcher, infohub_asset. Give plugin names, calls get_launch_information for each.
            'event_message': 'normal' // Events for all the buttons. Runs the animation when you click to refresh a list.
        };
    };

    $functions.push("_GetBoxId");
    const _GetBoxId = function() {
        return 'main.body.' + _GetClassName();
    };

    let $classTranslations = {};

    $functions.push('_Translate');
    /**
     * Translate - Substitute a string for another string using a class local object
     * @param {string} $string
     * @returns {string|{}}
     * @private
     */
    const _Translate = function ($string = '')
    {
        if (typeof $classTranslations !== 'object') {
            return $string;
        }

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
     * Setup the Launcher Graphical User Interface
     * @version 2017-10-03
     * @since   2017-10-03
     * @author  Peter Lembke
     */
    $functions.push('setup_gui');
    const setup_gui = function ($in)
    {
        const $default = {
            'box_id': '',
            'step': 'step_boxes',
            'response': {}
        };
        $in = _Merge($default, $in);

        let $userRealName = '';

        if ($in.step === 'step_boxes') {
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_view',
                    'function': 'mass_update'
                },
                'data': {
                    'do': [
                        {
                            'func': 'BoxMode',
                            'box_id': $in.box_id,
                            'box_mode': 'under',
                            'digits': '1'
                        },
                        {
                            'func': 'BoxesInsert',
                            'parent_box_id': $in.box_id,
                            'box_position': 'last',
                            'box_mode': 'data',
                            'box_alias': 'parts',
                            'boxes_data': {
                                'switch_button': 'Switch list',
                                'lists': 'My list and server list',
                                'information': 'Information about a plugin',
                                'more': '' // Name of logged in user and a logout button + refresh button for touch devices
                            }
                        },
                        {
                            'func': 'BoxMode',
                            'box_id': $in.box_id + '.lists',
                            'box_mode': 'under',
                            'digits': '1'
                        },
                        {
                            'func': 'BoxesInsert',
                            'parent_box_id': $in.box_id + '.lists',
                            'box_position': 'last',
                            'box_mode': 'data',
                            'box_alias': 'my_list',
                            'boxes_data': {
                                'my_list': 'My plugin list',
                                'full_list': 'All available plugins'
                            }
                        }
                    ]
                },
                'data_back': {
                    'box_id': $in.box_id,
                    'step': 'step_get_translations'
                }
            });
        }

        if ($in.step === 'step_get_translations') {
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_translate',
                    'function': 'get_translate_data'
                },
                'data': {},
                'data_back': {
                    'box_id': $in.box_id,
                    'step': 'step_get_translations_response'
                }
            });
        }

        if ($in.step === 'step_get_translations_response') {
            $classTranslations = _ByVal($in.response.data);
            $in.step = 'step_get_user_real_name';
        }

        if ($in.step === 'step_get_user_real_name') {
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_login',
                    'function': 'get_user_real_name'
                },
                'data': {},
                'data_back': {
                    'box_id': $in.box_id,
                    'step': 'step_get_user_real_name_response'
                }
            });
        }

        if ($in.step === 'step_get_user_real_name_response') {
            const $default = {
                'answer': 'false',
                'message': '',
                'data': ''
            };
            $in.response = _Default($default, $in.response);

            $userRealName = $in.response.data;

            $in.step = 'step_render';
        }

        if ($in.step === 'step_render') {

            let $messagesArray = [];

            let $messageOut = _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_render',
                    'function': 'create'
                },
                'data': {
                    'what': {
                        'my_button': {
                            'plugin': 'infohub_renderform',
                            'type': 'button',
                            'mode': 'button',
                            'button_label': _Translate('Switch list'),
                            'button_left_icon': '[switch_icon]',
                            'event_data': 'switch_button',
                            'to_plugin': 'infohub_launcher',
                            'to_function': 'switch_button',
                            'css_data': {
                                '.button':
                                    'font-size: 1.0em;'+
                                    'max-width: 320px;'+
                                    'box-sizing:border-box;'+
                                    'border-radius: 20px;'+
                                    'background-color: #bcdebc;'+
                                    'background: linear-gradient(#caefca, #e1ffcf);'+
                                    'border: 0px;'+
                                    'margin: 10px 0px 0px 0px;'+
                                    'padding: 4px 10px;'+
                                    'box-shadow: 0 4px 6px rgba(0, 0, 0, 0.25) inset;'
                            }
                        },
                        'switch_icon': {
                            'type': 'common',
                            'subtype': 'svg',
                            'data': '[switch_asset]'
                        },
                        'switch_asset': {
                            'plugin': 'infohub_asset',
                            'type': 'icon',
                            'asset_name': 'switch',
                            'plugin_name': 'infohub_launcher'
                        }
                    },
                    'how': {
                        'mode': 'one box',
                        'text': '[my_button]'
                    },
                    'where': {
                        'box_id': $in.box_id + '.switch_button'
                    },
                    'cache_key': 'gui'
                },
                'data_back': {
                    'box_id': $in.box_id,
                    'step': 'step_end'
                }
            });
            $messagesArray.push($messageOut);

            $messageOut = _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_render',
                    'function': 'create'
                },
                'data': {
                    'what': {
                        'my_list_box': {
                            'plugin': 'infohub_rendermajor',
                            'type': 'presentation_box',
                            'head_label': _Translate('My list'),
                            'foot_text': '',
                            'content_data': 'my_list'
                        }
                    },
                    'how': {
                        'mode': 'one box',
                        'text': '[my_list_box]'
                    },
                    'where': {
                        'box_id': $in.box_id + '.lists.my_list'
                    },
                    'cache_key': 'mylist'
                },
                'data_back': {
                    'box_id': $in.box_id,
                    'step': 'step_end'
                }
            });
            $messagesArray.push($messageOut);

            $messageOut = _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_render',
                    'function': 'create'
                },
                'data': {
                    'what': {
                        'full_list_box': {
                            'plugin': 'infohub_rendermajor',
                            'type': 'presentation_box',
                            'head_label': _Translate('All available plugins'),
                            'foot_text': '',
                            'content_data': 'full_list',
                            'open': 'true'
                        }
                    },
                    'how': {
                        'mode': 'one box',
                        'text': '[full_list_box]'
                    },
                    'where': {
                        'box_id': _GetBoxId() + '.lists.full_list',
                        'set_visible': 'false'
                    },
                    'cache_key': 'fulllist'
                },
                'data_back': {
                    'step': 'step_end'
                }
            });
            $messagesArray.push($messageOut);

            $messageOut = _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_launcher',
                    'function': 'render_list'
                },
                'data': {
                    'list_name': 'my_list'
                },
                'data_back': {
                    'step': 'step_end'
                }
            });
            $messagesArray.push($messageOut);

            $messageOut = _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_launcher',
                    'function': 'render_list'
                },
                'data': {
                    'list_name': 'full_list',
                    'render_icons': 'false'
                },
                'data_back': {
                    'step': 'step_end'
                }
            });
            $messagesArray.push($messageOut);

            $messageOut = _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_render',
                    'function': 'create'
                },
                'data': {
                    'what': {
                        'presentation_box': {
                            'plugin': 'infohub_rendermajor',
                            'type': 'presentation_box',
                            'head_label': _Translate('Instructions'),
                            'head_text': '[button_help]',
                            'content_data': '[description]'
                        },
                        'description': {
                            'type': 'common',
                            'subtype': 'value',
                            'data': _Translate('Switch list. Refresh. Click icon.')
                        },
                        'button_help': {
                            'plugin': 'infohub_renderform',
                            'type': 'button',
                            'mode': 'button',
                            'button_label': _Translate('Help'),
                            'button_left_icon': '[help_icon]',
                            'to_plugin': 'infohub_launcher',
                            'to_function': 'first_contact'
                        },
                        'help_icon': {
                            'type': 'common',
                            'subtype': 'svg',
                            'data': '[help_asset]'
                        },
                        'help_asset': {
                            'plugin': 'infohub_asset',
                            'type': 'icon',
                            'asset_name': 'help',
                            'plugin_name': 'infohub_launcher'
                        }
                    },
                    'how': {
                        'mode': 'one box',
                        'text': '[presentation_box]'
                    },
                    'where': {
                        'box_id': _GetBoxId() + '.information',
                        'set_visible': 'true',
                        'max_width': 320,
                        'scroll_to_box_id': 'true'
                    },
                    'cache_key': 'instructions'
                },
                'data_back': {
                    'step': 'step_end'
                }
            });
            $messagesArray.push($messageOut);

            $messageOut = _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_render',
                    'function': 'create'
                },
                'data': {
                    'what': {
                        'form_contact': {
                            'plugin': 'infohub_renderform',
                            'type': 'form',
                            'content': '[user_name]<br>[button_logout]<br>[button_refresh]',
                            'label': _Translate('More'),
                            'label_icon': '[down_icon]',
                            'description': '',
                            'open': 'false'
                        },
                        'down_icon': {
                            'type': 'common',
                            'subtype': 'svg',
                            'data': '[down_asset]'
                        },
                        'down_asset': {
                            'plugin': 'infohub_asset',
                            'type': 'icon',
                            'asset_name': 'down',
                            'plugin_name': 'infohub_launcher'
                        },
                        'user_name': {
                            'type': 'common',
                            'subtype': 'value',
                            'data':  _Translate('User name') + ': ' + $userRealName
                        },
                        'button_logout': {
                            'plugin': 'infohub_renderform',
                            'type': 'button',
                            'mode': 'button',
                            'button_label': _Translate('Logout'),
                            'event_data': 'logout|logout',
                            'to_plugin': 'infohub_login',
                            'to_function': 'click'
                        },
                        'button_refresh': {
                            'plugin': 'infohub_renderform',
                            'type': 'button',
                            'subtype': 'button',
                            'mode': 'button',
                            'button_label': _Translate('Refresh page'),
                            'button_left_icon': '[refresh_icon]',
                            'to_plugin': 'infohub_debug',
                            'to_function': 'refresh_plugins_and_reload_page',
                            'css_data': {
                                '.button':
                                    'font-size: 1.0em;'+
                                    'width: 100%;'+
                                    'box-sizing:border-box;'+
                                    'border-radius: 20px;'+
                                    'background-color: #bcdebc;'+
                                    'background: linear-gradient(#caefca, #e1ffcf);'+
                                    'border: 0px;'+
                                    'margin: 10px 0px 0px 0px;'+
                                    'padding: 4px 10px;'+
                                    'box-shadow: 0 4px 6px rgba(0, 0, 0, 0.25) inset;'
                            }
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
                            'plugin_name': 'infohub_launcher'
                        }
                    },
                    'how': {
                        'mode': 'one box',
                        'text': '[form_contact]'
                    },
                    'where': {
                        'box_id': _GetBoxId() + '.more',
                        'scroll_to_box_id': 'false',
                        'max_width': 320
                    },
                    'cache_key': 'more'
                },
                'data_back': {
                    'step': 'step_end'
                }
            });
            $messagesArray.push($messageOut);

            return {
                'answer': 'true',
                'message': 'Sending all rendering messages',
                'messages': $messagesArray
            };
        }

        return {
            'answer': 'true',
            'message': 'plugin GUI is done'
        };

    };

    /**
     * Switch between the two lists with icons
     * @version 2018-08-23
     * @since 2018-08-23
     * @author Peter Lembke
     */
    $functions.push("first_contact");
    const first_contact = function ($in)
    {
        const $default = {
            'step': 'step_is_my_list_empty',
            'response': {
                'list_name': '',
                'data': {}
            }
        };
        $in = _Default($default, $in);

        if ($in.step === 'step_is_my_list_empty') {
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_launcher',
                    'function': 'get_list'
                },
                'data': {
                    'list_name': 'my_list'
                },
                'data_back': {
                    'step': 'step_is_my_list_empty_response'
                }
            });
        }

        if ($in.step === 'step_is_my_list_empty_response') {
            const $list = _GetData({
                'name': 'response/data/list',
                'default': {},
                'data': $in,
                'split': '/'
            });

            $in.step = 'step_end';
            if (_Count($list) === 0) {
                $in.step = 'step_switch_list'; // Making first contact
            }
        }

        if ($in.step === 'step_switch_list') {
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_launcher',
                    'function': 'switch_button'
                },
                'data': {},
                'data_back': {
                    'step': 'step_refresh_full_list'
                }
            });
        }

        if ($in.step === 'step_refresh_full_list') {
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_launcher',
                    'function': 'event_message'
                },
                'data': {
                    'id': '120122_full_list_box_content_full_list_refresh_link',
                    'event_data': 'full_list|refresh|refresh'
                },
                'data_back': {
                    'step': 'step_click_welcome'
                }
            });
        }

        if ($in.step === 'step_click_welcome') {
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_launcher',
                    'function': 'event_message'
                },
                'data': {
                    'event_data': 'full_list|infohub_welcome|click'
                },
                'data_back': {
                    'step': 'step_click_add_to_my_list'
                }
            });
        }

        if ($in.step === 'step_click_add_to_my_list') {
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_launcher',
                    'function': 'event_message'
                },
                'data': {
                    'event_data': 'full_list|infohub_welcome|add'
                },
                'data_back': {
                    'step': 'step_click_run'
                }
            });
        }

        if ($in.step === 'step_click_run') {
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_launcher',
                    'function': 'event_message'
                },
                'data': {
                    'event_data': 'full_list|infohub_welcome|run'
                },
                'data_back': {
                    'step': 'step_end'
                }
            });
        }

        return {
            'answer': 'true',
            'message': 'First contact established'
        };
    };

    /**
     * Switch between the two lists with icons
     * @version 2018-08-23
     * @since 2018-08-23
     * @author Peter Lembke
     */
    $functions.push("switch_button");
    const switch_button = function ($in)
    {
        let $listName = 'my_list';

        const $default = {
            'step': 'step_my_list'
        };
        $in = _Default($default, $in);

        if ($in.step === 'step_my_list') {
            $listName = 'my_list';
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_view',
                    'function': 'set_visible'
                },
                'data': {
                    'id': _GetBoxId() + '.lists.' + $listName,
                    'set_visible': 'switch'
                },
                'data_back': {
                    'step': 'step_full_list'
                }
            });
        }

        if ($in.step === 'step_full_list') {
            $listName = 'full_list';
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_view',
                    'function': 'set_visible'
                },
                'data': {
                    'id': _GetBoxId() + '.lists.' + $listName,
                    'set_visible': 'switch'
                },
                'data_back': {
                    'step': 'step_end'
                }
            });
        }

        return {
            'answer': 'true',
            'message': 'Switched visibility on the lists'
        };
    };

    /**
     * Render a list. my_list or full_list.
     * @version 2017-12-04
     * @since 2017-12-04
     * @author Peter Lembke
     */
    $functions.push("render_list");
    const render_list = function ($in)
    {
        let $text = '',
            $what = {};

        const $default = {
            'list_name': '',
            'render_icons': 'true', // Used for server list in the initial startup to avoid render icons before all assets have been downloaded.
            'step': 'step_read_local_list',
            'data_back': {
                'list': {}
            },
            'response': {
                'answer': '',
                'message': '',
                'data': {},
                'asset': '',
                'asset_license': {}
            },
            'config': {
                'user_name': ''
            }
        };
        $in = _Default($default, $in);

        let $listName = $in.list_name;

        if ($listName !== 'my_list' && $listName !== 'full_list') {
            window.alert('infohub_launcher -> render_list() can not render the list: ' + $listName);
            $in.step = 'step_end';
        }

        if ($in.step === 'step_read_local_list') {
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_storage',
                    'function': 'read'
                },
                'data': {
                    'path': _GetListPath($listName, $in.config.user_name)
                },
                'data_back': {
                    'list_name': $listName,
                    'render_icons': $in.render_icons,
                    'step': 'step_read_local_list_response'
                }
            });
        }

        if ($in.step === 'step_read_local_list_response') {
            $in.step = 'step_populate_launch_list';
        }

        if ($in.step === 'step_populate_launch_list') {
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_launcher',
                    'function': 'get_launch_list'
                },
                'data': {
                    'list': $in.response.data
                },
                'data_back': {
                    'list_name': $listName,
                    'render_icons': $in.render_icons,
                    'step': 'step_populate_launch_list_response'
                }
            });
        }

        if ($in.step === 'step_populate_launch_list_response') {
            if (_IsSet($in.response.data.bubble_path) === 'true') {
                delete($in.response.data.bubble_path);
            }
            $in.step = 'step_get_refresh_icon';
        }

        if ($in.step === 'step_get_refresh_icon') {
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_asset',
                    'function': 'get_asset_and_license'
                },
                'data': {
                    'plugin_name': 'infohub_launcher',
                    'asset_name': 'refresh'
                },
                'data_back': {
                    'list_name': $listName,
                    'list': $in.response.data,
                    'render_icons': $in.render_icons,
                    'step': 'step_get_refresh_icon_response'
                }
            });
        }

        if ($in.step === 'step_get_refresh_icon_response') {
            $in.step = 'step_render_list';
        }

        if ($in.step === 'step_render_list') {

            let $item = {
                'plugin': 'refresh',
                'title': _Translate('Refresh'),
                'description': _Translate('Update this list'),
                'icon': $in.response.asset,
                'icon_license': $in.response.asset_license
            };

            $what = _AddIcon($what, $listName, $item);
            let $id =  '[' + $listName + '_' + $item.plugin + '_container]';
            $text = $text + $id;

            if ($in.render_icons === 'true') {
                for (let $key in $in.data_back.list.list)
                {
                    if ($in.data_back.list.list.hasOwnProperty($key) === true) {
                        $item = _ByVal($in.data_back.list.list[$key]);
                        $what = _AddIcon($what, $listName, $item);
                        $id =  '[' + $listName + '_' + $item.plugin + '_container]';
                        $text = $text + $id;
                    }
                }
            }

            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_render',
                    'function': 'create'
                },
                'data': {
                    'what': $what,
                    'how': {
                        'mode': 'one box',
                        'text': $text
                    },
                    'where': {
                        'box_id': _GetBoxId() + '.lists.' + $listName + '.['+$listName+'_box_content]'
                    }
                },
                'data_back': {
                    'list_name': $listName,
                    'render_icons': $in.render_icons,
                    'step': 'step_end'
                }
            });
        }

        return {
            'answer': 'true',
            'message': 'List rendered'
        };
    };

    /**
     * Use this as source for select boxes if you want the plugin names from my_list or full_list
     * @version 2017-12-04
     * @since 2017-12-04
     * @author Peter Lembke
     */
    $functions.push("get_option_list");
    const get_option_list = function ($in)
    {
        let $options = [];

        const $default = {
            'list_name': 'full_list',
            'step': 'step_read_local_list',
            'response': {
                'answer': '',
                'message': '',
                'data': {}
            },
            'config': {
                'user_name': ''
            }
        };
        $in = _Default($default, $in);

        const $listName = $in.list_name;
        if ($listName !== 'my_list' && $listName !== 'full_list') {
            window.alert('infohub_launcher -> get_option_list() can not give option values for the list: ' + $listName);
            $in.step = 'step_end';
        }

        if ($in.step === 'step_read_local_list') {
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_storage',
                    'function': 'read'
                },
                'data': {
                    'path': _GetListPath($listName, $in.config.user_name)
                },
                'data_back': {
                    'step': 'step_read_local_list_response'
                }
            });
        }

        if ($in.step === 'step_read_local_list_response') {
            $in.step = 'step_create_option_list';
        }

        if ($in.step === 'step_create_option_list') {
            for (let $key in $in.response.data.list) {
                if ($in.response.data.list.hasOwnProperty($key) === false) {
                    continue;
                }
                $options.push({"type": "option", "value": $key, "label": $key });
            }
        }

        return {
            'answer': 'true',
            'message': 'Option values created',
            'options': $options
        };
    };

    /**
     * Add one icon to the rendered list
     * @version 2017-12-04
     * @since 2017-12-04
     * @author Peter Lembke
     */
    $functions.push("_AddIcon");
    const _AddIcon = function ($what, $list, $item)
    {
        leave:
        {
            if (_Empty($what) === 'true') {
                $what = {};
            }

            if ($list !== 'my_list' && $list !== 'full_list') {
                window.alert(_Translate('_AddIcon got an invalid list') + ': ' + $list);
                break leave;
            }

            if (_Empty($item) === 'true') {
                window.alert(_Translate('_AddIcon got an empty item'));
                break leave;
            }

            const $pluginName = $item.plugin;
            const $id = $list + '_' + $pluginName + '_';

            $what[$id + 'container'] = {
                'type': 'common',
                'subtype': 'container',
                'data': '[' + $id + 'link' +']',
                'alias': $id + 'container',
                'class': 'side',
                'tag': 'span',
                'css_data': {
                    '.side': 'float: left;display: inline-block;resize: none;overflow: auto;box-sizing: border-box;'
                }
            };

            $what[$id + 'link'] = {
                'type': 'link',
                'subtype': 'link',
                'alias': 'icon_click',
                'event_data': $list +'|' + $pluginName +'|click',
                'show': '[' + $id + 'icon' + '][' + $id + 'title' + ']',
                'class': 'my_list_link',
                'to_plugin': 'infohub_launcher',
                'to_function': 'plugin_information',
                'css_data': {
                    '.my_list_link': 'display: inline-block;'
                }
            };

            $what[$id + 'icon'] = {
                'type': 'common',
                'subtype': 'svg',
                'data': $item.icon,
                'alias': $id + 'icon',
                'class': 'svg',
                'css_data': {
                    '.svg': 'width:64px; height:64px; padding:1px;'
                }
            };

            let $fontSize = '0.85em';
            const $title = _Replace('_', ' ', $item.title.toString());
            if ($title.length >= 9) {
                $fontSize = '0.7em';
            }
            if ($title.indexOf(' ') >= 0) {
                $fontSize = '0.7em';
            }

            $what[$id + 'title'] = {
                'type': 'common',
                'subtype': 'container',
                'data': $title,
                'alias': $id + 'title',
                'class': 'my_list_title',
                'tag': 'div',
                'css_data': {
                    '.my_list_title': 'max-width: 78px; height: 32px; font-size: '+$fontSize+'; text-align: center; padding: 1px; word-wrap:break-word; border-radius: 4px; box-sizing: border-box;'
                }
            };

            if ($item.plugin === 'refresh') {

                $what[$id + 'link'] = {
                    'type': 'link',
                    'subtype': 'link',
                    'alias': 'icon_click',
                    'event_data': $list +'|' + $pluginName +'|refresh',
                    'show': '[' + $id + 'icon' + '][' + $id + 'title' + ']',
                    'class': 'my_list_link',
                    'to_plugin': 'infohub_launcher',
                    'to_function': 'event_message',
                    'css_data': {
                        '.my_list_link': 'display: inline-block;'
                    }
                };

                $what[$id + 'title'].css_data = {
                    '.my_list_title': 'width: 64px; height: 32px; font-size: '+$fontSize+'; text-align: center; padding:1px; word-wrap:break-word; box-sizing: border-box;'
                };
            }
        }

        return $what;
    };

    /**
     * Renders a list with plugins including the refresh icon.
     * if list_name is full_list then it might get updated from the server before rendered.
     * @version 2017-12-04
     * @since 2017-12-04
     * @author Peter Lembke
     */
    $functions.push("refresh_list");
    const refresh_list = function ($in)
    {
        const $default = {
            'list_name': '',
            'step': 'step_start',
            'response': {
                'answer': '',
                'message': '',
                'list_name': '',
                'list': {},
                'updated': 'false',
                'data': {
                    'language': ''
                }
            },
            'data_back': {
                'list_name': '',
                'list': {},
                'language_codes': []
            }
        };
        $in = _Default($default, $in);

        let $answer = 'false';
        let $message = 'infohub_launcher -> refresh_list, has nothing to report. Perhaps the step names are wrong';

        if ($in.step === 'step_start')
        {
            $in.step = 'step_render_list';

            if ($in.list_name === 'full_list') {
                $in.step = 'step_update_full_list';
            }
        }

        if ($in.step === 'step_update_full_list') {
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_launcher',
                    'function': 'update_full_list'
                },
                'data': {
                    'list_name': $in.list_name
                },
                'data_back': {
                    'list_name': $in.list_name,
                    'step': 'step_update_full_list_response'
                }
            });
        }

        if ($in.step === 'step_update_full_list_response')
        {
            $in.step = 'step_get_selected_language';

            $in.data_back.list = $in.response.list;

            if ($in.response.updated === 'false') {
                $in.step = 'step_render_list';
            }

            if ($in.response.answer === 'false') {
                $message = $in.response.message; // Perhaps we are off line and can not get a full_list.
                $in.step = 'step_render_list'; // We render the empty list so the progress animation get removed
            }
        }

        if ($in.step === 'step_get_selected_language') {
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_configlocal',
                    'function': 'get_config'
                },
                'data': {
                    'section_name': 'language'
                },
                'data_back': {
                    'list_name': $in.data_back.list_name,
                    'list': $in.data_back.list,
                    'step': 'step_get_selected_language_response'
                }
            });
        }

        if ($in.step === 'step_get_selected_language_response')
        {
            $in.data_back.language_codes = $in.response.data.language.split(',');

            let $files = {}; // The translation files we want for each plugin
            for (let $number in $in.data_back.language_codes)
            {
                if ($in.data_back.language_codes.hasOwnProperty($number) === false) {
                    continue;
                }

                const $languageCode = $in.data_back.language_codes[$number];
                const $fileName = 'translate/' + $languageCode + '.json';
                $files[$fileName] = 'local'; // local = I am happy with a local version if exist
            }

            // Merge in the wanted translation files into each plugin
            for (let $key in $in.data_back.list)
            {
                if ($in.data_back.list.hasOwnProperty($key) === false) {
                    continue;
                }

                $in.data_back.list[$key] = _Merge($in.data_back.list[$key], $files);
            }

            $in.step = 'step_update_specific_assets';
        }

        if ($in.step === 'step_update_specific_assets') {
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_asset',
                    'function': 'update_specific_assets'
                },
                'data': {
                    'list': $in.data_back.list
                },
                'data_back': {
                    'list_name': $in.list_name,
                    'step': 'step_update_specific_assets_response'
                }
            });
        }

        if ($in.step === 'step_update_specific_assets_response') {
            $in.step = 'step_render_list';
        }

        if ($in.step === 'step_render_list') {
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_launcher',
                    'function': 'render_list'
                },
                'data': {
                    'list_name': $in.list_name
                },
                'data_back': {
                    'list_name': $in.list_name,
                    'step': 'step_render_list_response'
                }
            });
        }

        if ($in.step === 'step_render_list_response') {
            $answer = $in.response.answer;
            $message = $in.response.message;
            if ($answer === 'true') {
                $message = 'List have been refreshed';
            }
        }

        return {
            'answer': $answer,
            'message': $message,
            'list_name': $in.list_name
        };
    };

    /**
     * Give the list name and you will get the list from infohub_launcher.
     * Infohub_launcher owns the list and is the only one that is allowed to ask Storage for the list.
     * If you would try to read the Storage directly from your plugin you would get:
     * "I only accept paths that start with the calling plugin name".
     * @version 2018-10-26
     * @since 2018-10-26
     * @author Peter Lembke
     */
    $functions.push("get_list");
    const get_list = function ($in)
    {
        const $default = {
            'list_name': 'full_list',
            'step': 'step_start',
            'response': {
                'answer': 'false',
                'message': 'No response from the subcall',
                'data': {}
            },
            'config': {
                'user_name': ''
            }
        };
        $in = _Default($default, $in);

        if ($in.list_name !== 'my_list' && $in.list_name !== 'full_list') {
            $in.list_name = 'full_list';
        }

        if ($in.step === 'step_start') {
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_storage',
                    'function': 'read'
                },
                'data': {
                    'path': _GetListPath($in.list_name, $in.config.user_name)
                },
                'data_back': {
                    'list_name': $in.list_name,
                    'step': 'step_end'
                }
            });
        }

        return {
            'answer': $in.response.answer,
            'message': $in.response.message,
            'list_name': $in.list_name,
            'data': $in.response.data
        };
    };

    /**
     * Update the locally saved full_list
     * Reads the local full_list, check if it is old, if old then ask server for a new list from the server.
     * The list have plugin name as key. The data is an array with the three asset names and their checksums.
     * @version 2018-11-09
     * @since 2017-12-04
     * @author Peter Lembke
     */
    $functions.push("update_full_list");
    const update_full_list = function ($in)
    {
        const $default = {
            'step': 'step_get_full_list_from_client',
            'data_back': {
                'step': '',
                'full_list': {},
                'updated': 'false'
            },
            'response': {
                'answer': 'false',
                'message': '',
                'data': {}
            },
            'config': {
                'user_name': ''
            }
        };
        $in = _Default($default, $in);

        let $answer = 'false';
        let $message = 'infohub_launcher -> update_full_list has nothing to report. Might be something wrong with the steps in the function';
        let $updated = $in.data_back.updated;
        let $messagesArray = [];

        const $defaultFullList = {
            'name': '',
            'do': 'nothing',
            'micro_time': 0.0,
            'time_stamp': '',
            'list_checksum': '',
            'list': {}
        };

        let $fullList = $defaultFullList;

        if ($in.step === 'step_get_full_list_from_client')
        {
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_storage',
                    'function': 'read'
                },
                'data': {
                    'path': _GetListPath('full_list', $in.config.user_name)
                },
                'data_back': {
                    'step': 'step_get_full_list_from_client_response'
                }
            });
        }

        if ($in.step === 'step_get_full_list_from_client_response')
        {
            $fullList = _Default($defaultFullList, $in.response.data);

            let $localFullListExist = 'false';
            if ($fullList.list_checksum !== '') {
                $localFullListExist = 'true';
            }

            const $hour = 3600; // seconds
            const $timestampWhenOld = $fullList.micro_time + 24 * $hour;

            let $localFullListOld = 'false';
            const $currentTime = _MicroTime();
            if ($currentTime > $timestampWhenOld) {
                $localFullListOld = 'true';
            }

            $in.step = 'step_end';

            if ($localFullListOld === 'false') {
                $answer = 'true';
                $message = 'The local full_list is still quite fresh. I will not update it.';
                $updated = 'false';
            }

            if ($localFullListOld === 'true' && $localFullListExist === 'false') {
                // We do this in serial and goto the next step
                $in.step = 'step_get_full_list_from_server';
            }

            if ($localFullListOld === 'true' && $localFullListExist === 'true') {
                // We return the existing local list and ask the server for an updated list in the background

                $answer = 'true';
                $message = 'The local full_list is old but exist. I will update the list in the background.';
                $updated = 'true';

                const $messageOut = _SubCall({
                    'to': {
                        'node': 'server',
                        'plugin': 'infohub_launcher',
                        'function': 'get_full_list'
                    },
                    'data': {
                        'list_checksum': $fullList.list_checksum
                    },
                    'data_back': {
                        'step': 'step_get_full_list_from_server_response'
                    }
                });
                $messagesArray.push($messageOut);
            }
        }

        if ($in.step === 'step_get_full_list_from_server')
        {
            return _SubCall({
                'to': {
                    'node': 'server',
                    'plugin': 'infohub_launcher',
                    'function': 'get_full_list'
                },
                'data': {
                    'list_checksum': $fullList.list_checksum
                },
                'data_back': {
                    'step': 'step_get_full_list_from_server_response'
                }
            });
        }

        if ($in.step === 'step_get_full_list_from_server_response')
        {
            $in.step = 'step_handle_server_response';

            if ($in.response.answer === 'false') {
                $answer = $in.response.answer;
                $message = $in.response.message;
                $in.step = 'step_end';
            }
        }

        if ($in.step === 'step_handle_server_response')
        {
            $fullList = _Default($defaultFullList, $in.response.data);
            $updated = 'false';
            $in.step = 'step_end';

            if ($fullList.do === 'keep') {
                $updated = 'false';
                $in.step = 'step_keep_full_list';
            }

            if ($fullList.do === 'update') {
                $updated = 'true';
                $in.step = 'step_update_full_list';
            }
        }

        if ($in.step === 'step_keep_full_list')
        {
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_storage',
                    'function': 'read'
                },
                'data': {
                    'path': _GetListPath('full_list', $in.config.user_name)
                },
                'data_back': {
                    'step': 'step_keep_full_list_response',
                    'updated': $updated
                }
            });
        }

        if ($in.step === 'step_keep_full_list_response')
        {
            $fullList = _Default($defaultFullList, $in.response.data);
            $fullList.micro_time = _MicroTime();
            $fullList.time_stamp = _TimeStamp();
            $in.step = 'step_update_full_list';

            if ($in.response.answer === 'false') {
                $message = $in.response.message;
                $in.step = 'step_end';
            }
        }

        if ($in.step === 'step_update_full_list')
        {
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_storage',
                    'function': 'write'
                },
                'data': {
                    'path': _GetListPath('full_list', $in.config.user_name),
                    'data': $fullList
                },
                'data_back': {
                    'full_list': $fullList,
                    'updated': $updated,
                    'step': 'step_update_full_list_response'
                }
            });
        }

        if ($in.step === 'step_update_full_list_response')
        {
            $answer = $in.response.answer;
            $message = $in.response.message;
            $fullList = _Default($defaultFullList, $in.data_back.full_list);

            if ($answer === 'true') {
                $message = 'The full list is kept as it is locally';
                if ($updated === 'true') {
                    $message = 'The full list is updated locally';
                }
            }
        }

        return {
            'answer': $answer,
            'message': $message,
            'updated': $updated,
            'list': $fullList.list,
            'messages': $messagesArray
        };
    };

    $functions.push("_GetListPath");
    const _GetListPath = function ($type, $userName)
    {
        let $path = '';
        if ($type !== 'my_list' && $type !== 'full_list') {
            return $path;
        }

        $path = 'infohub_launcher/' + $type + '/' + $userName;

        return $path;
    };

    /**
     * Adds a plugin to my list
     * @version 2017-12-08
     * @since 2017-12-08
     * @author Peter Lembke
     */
    $functions.push("my_list_add");
    var my_list_add = function ($in)
    {
        const $default = {
            'plugin': '',
            'new_data': {},
            'step': 'step_does_plugin_already_exist_in_my_list',
            'data_back': {},
            'response': {
                'answer': '',
                'message': '',
                'exist': '',
                'data': {}
            },
            'config': {
                'user_name': ''
            }
        };
        $in = _Default($default, $in);

        let $data;
        let $myList;
        let $answer = 'false';
        let $message = 'Nothing to report';
        let $done = 'false';

        if ($in.step === 'step_does_plugin_already_exist_in_my_list')
        {
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_view',
                    'function': 'id_exist'
                },
                'data': {
                    'id': _GetBoxId() + '.my_list.[my_list_box_content_my_list_' + $in.plugin + '_container]'
                },
                'data_back': {
                    'plugin': $in.plugin,
                    'step': 'step_does_plugin_already_exist_in_my_list_response'
                }
            });

        }

        if ($in.step === 'step_does_plugin_already_exist_in_my_list_response')
        {
            if ($in.response.exist === 'true') {
                $message = 'The plugin already exist in my list on screen';
                $in.step = 'step_end';
            } else {
                $in.step = 'step_does_plugin_exist_in_full_list';
            }
        }

        if ($in.step === 'step_does_plugin_exist_in_full_list')
        {
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_view',
                    'function': 'id_exist'
                },
                'data': {
                    'id': _GetBoxId() + '.lists.full_list.[full_list_box_content_full_list_' + $in.plugin + '_container]'
                },
                'data_back': {
                    'plugin': $in.plugin,
                    'step': 'step_does_plugin_exist_in_full_list_response'
                }
            });
        }

        if ($in.step === 'step_does_plugin_exist_in_full_list_response')
        {
            if ($in.response.exist === 'false') {
                $message = 'The plugin do not exist in the server list on screen';
                $in.step = 'step_end';
            } else {
                $in.step = 'step_get_full_list_from_storage';
            }
        }

        if ($in.step === 'step_get_full_list_from_storage')
        {
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_storage',
                    'function': 'read'
                },
                'data': {
                    'path': _GetListPath('full_list', $in.config.user_name)
                },
                'data_back': {
                    'plugin': $in.plugin,
                    'step': 'step_pull_data_from_full_list'
                }
            });

        }

        if ($in.step === 'step_pull_data_from_full_list')
        {
            if (_IsSet($in.response.data.list[$in.plugin]) === 'false') {
                $message = 'I loaded the server list from Storage but the plugin data do not exist there';
                $in.step = 'step_end';
            } else {
                $data = _ByVal($in.response.data.list[$in.plugin]);
                $in.step = 'step_get_my_list_from_storage';
            }
        }

        if ($in.step === 'step_get_my_list_from_storage')
        {
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_storage',
                    'function': 'read'
                },
                'data': {
                    'path': _GetListPath('my_list', $in.config.user_name)
                },
                'data_back': {
                    'plugin': $in.plugin,
                    'new_data': $data,
                    'step': 'step_get_my_list_from_storage_response'
                }
            });
        }

        if ($in.step === 'step_get_my_list_from_storage_response')
        {
            if (_IsSet($in.response.data[$in.plugin]) === 'true') {
                $message = 'I loaded my list from Storage but the plugin is already in the list';
                $in.step = 'step_end';
            } else {
                const $defaultResponseData = {
                    'micro_time': 0.0,
                    'current_time': '',
                    'list': {},
                    'list_checksum': ''
                };
                $myList = _Default($defaultResponseData, $in.response.data);
                $in.step = 'step_add_data_to_my_list';
            }
        }

        if ($in.step === 'step_add_data_to_my_list')
        {
            $myList.list[$in.plugin] = _ByVal($in.new_data);
            $myList.micro_time = _MicroTime();
            $myList.current_time = _TimeStamp();
            $myList.list_checksum = ''; // Not used in my_list

            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_storage',
                    'function': 'write'
                },
                'data': {
                    'path': _GetListPath('my_list', $in.config.user_name),
                    'data': $myList
                },
                'data_back': {
                    'plugin': $in.plugin,
                    'step': 'step_refresh_my_list'
                }
            });
        }

        if ($in.step === 'step_refresh_my_list')
        {
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_launcher',
                    'function': 'refresh_list'
                },
                'data': {
                    'list_name': 'my_list'
                },
                'data_back': {
                    'plugin': $in.plugin,
                    'step': 'step_end'
                }
            });
        }

        return {
            'answer': $answer,
            'message': $message,
            'done': $done
        };
    };

    /**
     * Removes a plugin from my list
     * @version 2017-12-09
     * @since 2017-12-09
     * @author Peter Lembke
     */
    $functions.push("my_list_remove");
    const my_list_remove = function ($in)
    {
        let $myList;

        const $default = {
            'plugin': '',
            'new_data': {},
            'step': 'step_does_plugin_exist_in_my_list',
            'data_back': {},
            'response': {
                'answer': '',
                'message': '',
                'exist': '',
                'data': {}
            },
            'config': {
                'user_name': ''
            }
        };
        $in = _Default($default, $in);

        let $answer = 'false';
        let $message = 'Nothing to report';
        let $done = 'false';

        if ($in.step === 'step_does_plugin_exist_in_my_list')
        {
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_view',
                    'function': 'id_exist'
                },
                'data': {
                    'id': _GetBoxId() + '.my_list.[my_list_box_content_my_list_' + $in.plugin + '_container]'
                },
                'data_back': {
                    'plugin': $in.plugin,
                    'step': 'step_does_plugin_exist_in_my_list_response'
                }
            });

        }

        if ($in.step === 'step_does_plugin_exist_in_my_list_response')
        {
            if ($in.response.exist === 'false') {
                $message = 'The plugin is already gone from my list on screen';
                $in.step = 'step_end';
            } else {
                $in.step = 'step_get_my_list_from_storage';
            }
        }

        if ($in.step === 'step_get_my_list_from_storage')
        {
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_storage',
                    'function': 'read'
                },
                'data': {
                    'path': _GetListPath('my_list', $in.config.user_name)
                },
                'data_back': {
                    'plugin': $in.plugin,
                    'step': 'step_get_my_list_from_storage_response'
                }
            });
        }

        if ($in.step === 'step_get_my_list_from_storage_response')
        {
            if (_IsSet($in.response.data.list[$in.plugin]) === 'false') {
                $message = 'I loaded my list from Storage but the plugin is already gone from the list';
                $in.step = 'step_end';
            } else {
                $myList = _ByVal($in.response.data);
                delete($myList.list[$in.plugin]);
                $in.step = 'step_save_my_list_to_storage';
            }
        }

        if ($in.step === 'step_save_my_list_to_storage')
        {
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_storage',
                    'function': 'write'
                },
                'data': {
                    'path': _GetListPath('my_list', $in.config.user_name),
                    'data': $myList
                },
                'data_back': {
                    'plugin': $in.plugin,
                    'step': 'step_refresh_my_list'
                }
            });
        }

        if ($in.step === 'step_refresh_my_list')
        {
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_launcher',
                    'function': 'refresh_list'
                },
                'data': {
                    'list_name': 'my_list'
                },
                'data_back': {
                    'plugin': $in.plugin,
                    'step': 'step_end'
                }
            });
        }

        return {
            'answer': $answer,
            'message': $message,
            'done': $done
        };
    };

    /**
     * Show information about a plugin
     * @version 2018-08-19
     * @since 2018-08-19
     * @author Peter Lembke
     */
    $functions.push("plugin_information");
    const plugin_information = function ($in)
    {
        const $default = {
            'plugin_name': '',
            'list_name': '',
            'step': 'step_get_asset_information',
            'data_back': {},
            'response': {
                'data': {}
            }
        };
        $in = _Default($default, $in);

        let $answer = 'false';
        let $message = 'Nothing to report';

        if ($in.step === 'step_get_asset_information')
        {
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_launcher',
                    'function': 'get_launch_information'
                },
                'data': {
                    'plugin_name': $in.plugin_name
                },
                'data_back': {
                    'plugin_name': $in.plugin_name,
                    'step': 'step_get_asset_information_response'
                }
            });

        }

        if ($in.step === 'step_get_asset_information_response')
        {
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_render',
                    'function': 'create'
                },
                'data': {
                    'what': {
                        'my_form': {
                            'plugin': 'infohub_renderform',
                            'type': 'form',
                            'content': '[my_icon_data][i][description][/i]\n[button_add][button_remove][button_run]',
                            'label': _Translate(_GetData({'name': 'response/data/title', 'default': '', 'data': $in })),
                            'description': ''
                        },
                        'description': {
                            'type': 'common',
                            'subtype': 'value',
                            'data': _Translate(_GetData({'name': 'response/data/description', 'default': '', 'data': $in }))
                        },
                        'my_icon_data': {
                            'type': 'common',
                            'subtype': 'svg',
                            'data': _GetData({'name': 'response/data/icon', 'default': '', 'data': $in }),
                            'css_data': {
                                '.svg': 'width:80px;height:80px;float:left;padding: 4px;'
                            }
                        },
                        'button_add': {
                            'plugin': 'infohub_renderform',
                            'type': 'button',
                            'mode': 'button',
                            'button_label': _Translate('Add to my list'),
                            'button_left_icon': '[button_add_icon]',
                            'event_data':  $in.list_name + '|' + $in.plugin_name + '|add',
                            'to_plugin': 'infohub_launcher'
                        },
                        'button_remove': {
                            'plugin': 'infohub_renderform',
                            'type': 'button',
                            'mode': 'button',
                            'button_label': _Translate('Remove from my list'),
                            'button_left_icon': '[button_remove_icon]',
                            'event_data':  $in.list_name + '|' + $in.plugin_name + '|remove',
                            'to_plugin': 'infohub_launcher'
                        },
                        'button_run': {
                            'plugin': 'infohub_renderform',
                            'type': 'button',
                            'mode': 'button',
                            'button_label': _Translate('Run plugin'),
                            'button_left_icon': '[button_play_icon]',
                            'event_data':  $in.list_name + '|' + $in.plugin_name + '|run',
                            'to_plugin': 'infohub_launcher'
                        },
                        'button_add_icon': {
                            'type': 'common',
                            'subtype': 'svg',
                            'data': '[button_add_asset]'
                        },
                        'button_add_asset': {
                            'plugin': 'infohub_asset',
                            'type': 'icon',
                            'asset_name': 'plus-green',
                            'plugin_name': 'infohub_launcher'
                        },
                        'button_remove_icon': {
                            'type': 'common',
                            'subtype': 'svg',
                            'data': '[button_remove_asset]'
                        },
                        'button_remove_asset': {
                            'plugin': 'infohub_asset',
                            'type': 'icon',
                            'asset_name': 'minus-yellow',
                            'plugin_name': 'infohub_launcher'
                        },
                        'button_play_icon': {
                            'type': 'common',
                            'subtype': 'svg',
                            'data': '[button_play_asset]'
                        },
                        'button_play_asset': {
                            'plugin': 'infohub_asset',
                            'type': 'icon',
                            'asset_name': 'play-blue',
                            'plugin_name': 'infohub_launcher'
                        },
                    },
                    'how': {
                        'mode': 'one box',
                        'text': '[my_form]'
                    },
                    'where': {
                        'box_id': 'main.body.infohub_launcher.information',
                        'max_width': 320,
                        'scroll_to_box_id': 'true'
                    },
                    'cache_key': 'plugininfo_' + $in.plugin_name
                },
                'data_back': {
                    'plugin': $in.plugin,
                    'step': 'step_end'
                }
            });
        }

        return {
            'answer': $answer,
            'message': $message
        };
    };

    /**
     * Returns the plugin name, title, description, uses, icon data, icon license data.
     * @version 2018-12-22
     * @since 2018-01-14
     * @author Peter Lembke
     */
    $functions.push("get_launch_information");
    const get_launch_information = function($in)
    {
        const $default = {
            'plugin_name': '', // infohub_asset and infohub_launcher can use this.
            'from_plugin': {'node': '', 'plugin': '' },
            'step': 'step_get_selected_language',
            'response': {
                'answer': '',
                'message': '',
                'assets': {},
                'data': {
                    'language': ''
                }
            },
            'data_back': {
                'step': '',
                'plugin_name': '',
                'language_codes_array': []
            }
        };
        $in = _Default($default, $in);

        let $answer = 'false';
        let $message = 'Nothing to report from infohub_launcher -> get_launch_information. Check if the step names are OK';
        let $translationAssets = {}; // The translation assets we need. Based on user selected preferred languages
        let $launchData = {};

        if ($in.from_plugin.node !== 'client') {
            $message = 'I only accept calls from client plugins';
            $in.step = 'step_end';
        }

        let $pluginName = $in.from_plugin.plugin;
        if ($in.from_plugin.plugin === 'infohub_workbench' || $in.from_plugin.plugin === 'infohub_launcher') {
            if (_Empty($in.plugin_name) === 'false') {
                $pluginName = $in.plugin_name;
            }
        }

        if ($in.step === 'step_get_selected_language') {
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_configlocal',
                    'function': 'get_config'
                },
                'data': {
                    'section_name': 'language'
                },
                'data_back': {
                    'plugin_name': $pluginName,
                    'step': 'step_get_selected_language_response',
                }
            });
        }

        if ($in.step === 'step_get_selected_language_response') {
            $in.step = 'step_get_assets';
            if ($in.response.answer === 'true') {
                $in.step = 'step_create_paths_to_translation_assets';
            }
        }

        if ($in.step === 'step_create_paths_to_translation_assets')
        {
            let $languageCodesArray = $in.response.data.language.split(',');
            $in.data_back.language_codes_array = $languageCodesArray;

            for (let $number in $languageCodesArray)
            {
                const $languageCode = $languageCodesArray[$number];
                if (_Empty($languageCode) === 'true') {
                    continue;
                }

                const $fileName = 'translate/' + $languageCode + '.json';
                $translationAssets[$fileName] = 'local'; // local = I am happy with a local version if it exists
            }

            $in.step = 'step_get_assets';
        }


        if ($in.step === 'step_get_assets')
        {
            let $list = {
                'launcher.json': '',
                'icon/icon.svg': '',
                'icon/icon.json': ''
            };

            if (_Count($translationAssets) > 0) {
                $list = _Merge($translationAssets, $list);
            }

            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_asset',
                    'function': 'get_plugin_assets'
                },
                'data': {
                    'plugin_name': $pluginName,
                    'list': $list
                },
                'data_back': {
                    'step': 'step_get_assets_response',
                    'plugin_name': $pluginName,
                    'language_codes_array': $in.data_back.language_codes_array
                }
            });
        }

        if ($in.step === 'step_get_assets_response')
        {
            $launchData = _GetData({
                'name': 'response|assets|launcher.json|contents',
                'default': '',
                'data': $in,
                'split': '|'
            });

            $launchData = _JsonDecode($launchData);

            const $icon = _GetData({
                'name': 'response|assets|icon/icon.svg|contents',
                'default': '',
                'data': $in,
                'split': '|'
            });

            const $iconIsBinary = _GetData({
                'name': 'response|assets|icon/icon.svg|is_binary',
                'default': 'false',
                'data': $in,
                'split': '|'
            });

            let $iconLicense = _GetData({
                'name': 'response|assets|icon/icon.json|contents',
                'default': '',
                'data': $in,
                'split': '|'
            });

            $iconLicense = _JsonDecode($iconLicense);

            if (_Empty($launchData) === 'true') {
                const $title = _Replace('_', ' ', $pluginName.toString());
                $launchData = {
                    'plugin': $pluginName,
                    'title': $title,
                    'description': 'Unknown description for ' + $title
                };
            }

            // Merge the translation files and pick title and description if they are set
            const $codesArray = $in.data_back.language_codes_array;
            if (_Empty($codesArray) === 'false')
            {
                let $result = {};

                for (let $number = $codesArray.length -1; $number >= 0; $number = $number - 1)
                {
                    const $code = $codesArray[$number];
                    if (_Empty($code) === 'true') {
                        continue;
                    }

                    const $path = 'translate/' + $code + '.json';
                    const $translate = _GetData({
                        'name': 'response|assets|' + $path,
                        'default': {},
                        'data': $in,
                        'split': '|'
                    });
                    if (_IsSet($translate.contents) === 'true') {
                        const $contents = _JsonDecode($translate.contents);
                        $result = _Merge($result, $contents);
                    }
                }

                if (_Empty($result) === 'false') {
                    const $title = _GetData({
                        'name': 'launcher|title',
                        'default': '',
                        'data': $result,
                        'split': '|'
                    });
                    if (_Empty($title) === 'false') {
                        $launchData.title = $title;
                    }
                    const $description = _GetData({
                        'name': 'launcher|description',
                        'default': '',
                        'data': $result,
                        'split': '|'
                    });
                    if (_Empty($description) === 'false') {
                        $launchData.description = $description;
                    }
                }
            }

            $in.step = 'step_default_icon';

            if (_Empty($icon) === 'false' && _Empty($iconLicense) === 'false')
            {
                $launchData.icon = $icon;
                $launchData.icon_license = _ByVal($iconLicense);
                $answer = 'true';
                $message = 'Here are the launch data';
                $in.step = 'step_end';
            }
        }

        if ($in.step === 'step_default_icon')
        {
            $launchData.icon = '<?xml version="1.0" encoding="iso-8859-1"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"> <svg version="1.1" id="default" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="50px" height="50px" viewBox="0 0 50 50" style="enable-background:new 0 0 50 50;" xml:space="preserve"> <circle cx="25" cy="25" r="20" stroke="#9933ff" stroke-width="3" fill="white" /> </svg>';
            $launchData.icon_license = {
                "publisher_name": "InfoHub",
                "publisher_url": "https://infohub.se",
                "publisher_note": "",
                "publisher_video_url": "",
                "collection_name": "",
                "collection_url": "",
                "collection_note": "",
                "license_name": "CC BY-ND 3.0",
                "license_url": "https://creativecommons.org/licenses/by-nd/3.0/",
                "license_note": "You are free to:Share — copy and redistribute the icon in any medium or format for any purpose, even commercially. The licensor cannot revoke these freedoms as long as you follow the license terms.",
                "icon_name": "Generic",
                "icon_url": "",
                "icon_note": "A generic icon that InfoHub own and use."
            };
            $answer = 'true';
            $message = 'Here are the default launch data. I did not have all assets';
        }

        return {
            'answer': $answer,
            'message': $message,
            'data': $launchData
        };

    };

    /**
     * You give a list with plugin names that you want launch information for.
     * Each key in 'list.list' is a plugin name. The key data will be the launch information you want
     * @version 2018-12-22
     * @since 2018-01-21
     * @author Peter Lembke
     */
    $functions.push("get_launch_list");
    const get_launch_list = function($in)
    {
        const $default = {
            'from_plugin': {'node': '', 'plugin': '' },
            'step': 'step_get_launch_information',
            'list': {
                'micro_time': 0.0,
                'time_stamp': '',
                'list': {},
                'list_checksum': ''
            },
            'response': {
                'answer': '',
                'message': '',
                'data': {}
            },
            'data_back': {
                'step': '',
                'result_list': {
                    'micro_time': 0.0,
                    'time_stamp': '',
                    'list': {},
                    'list_checksum': ''
                },
                'list': {},
                'plugin_name': ''
            }
        };
        $in = _Default($default, $in);

        let $answer = 'false';
        let $message = 'Nothing to report';
        let $pluginName;

        if ($in.from_plugin.node !== 'client') {
            $message = 'I only accept calls from client plugins';
            $in.step = 'step_end';
        }

        if ($in.from_plugin.plugin !== 'infohub_asset' && $in.from_plugin.plugin !== 'infohub_launcher') {
            $message = 'Only infohub_asset, infohub_launcher is allowed to call this function.';
            $in.step = 'step_end';
        }

        if ($in.step === 'step_get_launch_information_response') {
            $pluginName = $in.data_back.plugin_name;
            $in.data_back.result_list.list[$pluginName] = _ByVal($in.response.data);
            $in.step = 'step_get_launch_information';
        }

        if ($in.step === 'step_get_launch_information') {
            if (_Count($in.list.list) > 0) {

                const $response = _Pop($in.list.list);
                $pluginName = $response.key;
                $in.list.list = _ByVal($response.object);

                return _SubCall({
                    'to': {
                        'node': 'client',
                        'plugin': 'infohub_launcher',
                        'function': 'get_launch_information'
                    },
                    'data': {
                        'plugin_name': $pluginName
                    },
                    'data_back': {
                        'plugin_name': $pluginName,
                        'result_list': $in.data_back.result_list,
                        'list': $in.list,
                        'step': 'step_get_launch_information_response'
                    }
                });

            }

            $answer = 'true';
            $message = 'This is what I have found for you';
        }

        return {
            'answer': $answer,
            'message': $message,
            'data': $in.data_back.result_list
        };

    };

    /**
     * Events for all the buttons
     * @version 2017-12-04
     * @since   2017-12-04
     * @author  Peter Lembke
     */
    $functions.push('event_message');
    const event_message = function ($in)
    {
        const $default = {
            'step': 'step_start',
            'event_data': '',
            'type': '',
            'event_type': '',
            'box_id': '',
            'id': '',
            'parent_box_id': '',
            'plugin_name': '',
            'data_back': {},
            'response': {}
        };
        $in = _Merge($default, $in);

        const $parts = $in.event_data.split('|');
        const $listName = $parts[0];
        const $pluginName = $parts[1];
        const $command = $parts[2];

        if ($in.step === 'step_start')
        {
            if ($command === 'refresh')
            {
                const $lastIndex = $in.id.lastIndexOf("_");
                const $id = $in.id.substr(0, $lastIndex);

                return _SubCall({
                    'to': {
                        'node': 'client',
                        'plugin': 'infohub_render',
                        'function': 'create'
                    },
                    'data': {
                        'what': {
                            'my_progress': {
                                'type': 'common',
                                'subtype': 'svg',
                                'data': '[my_progress_asset]',
                                'alias': 'progress',
                                'css_data': {
                                    '.svg': 'padding: 0px;'
                                }
                            },
                            'my_progress_asset': {
                                'plugin': 'infohub_asset',
                                'type': 'icon',
                                'asset_name': 'fadingfountain',
                                'plugin_name': 'infohub_launcher'
                            }
                        },
                        'how': {
                            'mode': 'one box',
                            'text': '[my_progress]'
                        },
                        'where': {
                            'box_id': $id + '_title',
                            'max_width': 64,
                            'scroll_to_box_id': 'false'
                        },
                        'cache_key': 'fadingfountain'
                    },
                    'data_back': {
                        'event_data': $in.event_data,
                        'step': 'step_progress_response'
                    }
                });

            }

            if ($command === 'add') {
                return _SubCall({
                    'to': {
                        'node': 'client',
                        'plugin': 'infohub_launcher',
                        'function': 'my_list_add'
                    },
                    'data': {
                        'plugin': $pluginName
                    },
                    'data_back': {
                        'step': 'step_end'
                    }
                });
            }

            if ($command === 'remove') {
                return _SubCall({
                    'to': {
                        'node': 'client',
                        'plugin': 'infohub_launcher',
                        'function': 'my_list_remove'
                    },
                    'data': {
                        'plugin': $pluginName
                    },
                    'data_back': {
                        'step': 'step_end'
                    }
                });
            }

            if ($command === 'run') {
                return _SubCall({
                    'to': {
                        'node': 'client',
                        'plugin': 'infohub_workbench',
                        'function': 'setup_plugin'
                    },
                    'data': {
                        'plugin_name': $pluginName
                    },
                    'data_back': {
                        'step': 'step_end'
                    }
                });
            }

            if ($command === 'click') {
                return _SubCall({
                    'to': {
                        'node': 'client',
                        'plugin': 'infohub_launcher',
                        'function': 'plugin_information'
                    },
                    'data': {
                        'plugin_name': $pluginName,
                        'list_name': $listName
                    },
                    'data_back': {
                        'step': 'step_end'
                    }
                });
            }
        }

        if ($in.step === 'step_progress_response') {
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_launcher',
                    'function': 'refresh_list'
                },
                'data': {
                    'list_name': $listName
                },
                'data_back': {
                    'step': 'step_end'
                }
            });
        }

        return {
            'answer': 'true',
            'message': 'event message done'
        };
    };
}
//# sourceURL=infohub_launcher.js