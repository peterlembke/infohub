/**
 * infohub_tabs.js contact the renderers to get HTML and then send it to infohub_view
 * infohub_tabs and infohub_view are the only plugions that handle the DOM
 * @category InfoHub
 * @package infohub_tabs
 * @copyright Copyright (c) 2010-, Peter Lembke, CharZam soft
 * @author Peter Lembke <peter.lembke@infohub.se>
 * @link https://infohub.se/ InfoHub main page
 * @license InfoHub is distributed under the terms of the GNU General Public License
 * InfoHub is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * InfoHub is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 * You should have received a copy of the GNU General Public License
 * along with InfoHub.    If not, see <https://www.gnu.org/licenses/>.
 */
function infohub_tabs() {

    "use strict";

    // include "infohub_base.js"

    const _Version = function() {
        return {
            'date': '2018-02-02',
            'since': '2017-10-15',
            'version': '1.0.0',
            'checksum': '{{checksum}}',
            'class_name': 'infohub_tabs',
            'note': 'Handles windows so you can build tabs',
            'status': 'normal',
            'SPDX-License-Identifier': 'GPL-3.0-or-later',
            'user_role': 'user',
            'web_worker': 'true',
            'core_plugin': 'false'
        };
    };

    const _GetCmdFunctions = function() {
        const $list = {
            'init': 'normal',
            'add': 'normal',
            'remove': 'normal',
            'siblings_box_view': 'normal',
            'highlight_tab': 'normal',
            'setup_full_tab_system': 'normal',
            'event_message': 'normal'
        };

        return _GetCmdFunctionsBase($list);
    };

    /**
     * Set up the box system
     * You need to provide a parent box id
     * @version 2017-10-15
     * @since   2017-10-15
     * @author  Peter Lembke
     */
    $functions.push("init"); // Enable this function
    const init = function ($in)
    {
        const $default = {
            'parent_box_id': '', // The box where you want the tabs
            'step': 'step_start',
            'response': null,
            'data_back': null
        };
        $in = _Default($default, $in);

        /*
            Change mode on parent_box_id to box_mode: under.
            Create a box in parent_box_id and name it "head" with box_mode: side.
            Create a box in parent_box_id and name it "body" with box_mode: side.
        */

        let $boxesCreated = 'false';

        if ($in.step === 'step_start')
        {
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_view',
                    'function': 'box_mode'
                },
                'data': {
                    'box_id': $in.parent_box_id,
                    'box_mode': 'under',
                    'digits': '1'
                },
                'data_back': {
                    'parent_box_id': $in.parent_box_id,
                    'step': 'step_get_box_list'
                }
            });
        }

        if ($in.step === 'step_get_box_list')
        {
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_view',
                    'function': 'box_list'
                },
                'data': {
                    'box_id': $in.parent_box_id
                },
                'data_back': {
                    'parent_box_id': $in.parent_box_id,
                    'step': 'step_get_box_list_response'
                }
            });
        }

        if ($in.step === 'step_get_box_list_response')
        {
            $in.step = 'step_create_head';

            let $id = _GetData({'name': 'index/head', 'default': '', 'data': $in.response });
            if ($id !== '') {
                $in.data_back.head_id = $id;
                $in.step = 'step_end';
            }

            $id = _GetData({'name': 'index/body', 'default': '', 'data': $in.response });
            if ($id !== '') {
                $in.data_back.box_id = $id;
                $in.step = 'step_end';
            }
        }

        if ($in.step === 'step_create_head')
        {
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_view',
                    'function': 'box_insert'
                },
                'data': {
                    'parent_box_id': $in.parent_box_id,
                    'box_mode': 'side',
                    'digits': '2',
                    'box_alias': 'head'
                },
                'data_back': {
                    'parent_box_id': $in.parent_box_id,
                    'step': 'step_create_head_response'
                }
            });
        }

        if ($in.step === 'step_create_head_response') {
            $in.data_back.head_id = $in.response.box_id;
            $in.step = 'step_create_body';
        }

        if ($in.step === 'step_create_body')
        {
            const $default = {'box_id': '' };
            $in.response = _Default($default, $in.response);

            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_view',
                    'function': 'box_insert'
                },
                'data': {
                    'parent_box_id': $in.parent_box_id,
                    'box_mode': 'side',
                    'digits': '2',
                    'box_alias': 'body'
                },
                'data_back': {
                    'parent_box_id': $in.parent_box_id,
                    'step': 'step_create_body_response',
                    'head_id':  $in.data_back.head_id
                }
            });
        }

        if ($in.step === 'step_create_body_response') {
            $in.data_back.body_id = $in.response.box_id;
            $boxesCreated = 'true';
            $in.step = 'step_end';
        }

        return {
            'answer': 'true',
            'message': 'Done initializing the tab boxes',
            'parent_box_id': $in.parent_box_id,
            'head_id': $in.data_back.head_id,
            'body_id': $in.data_back.body_id,
            'boxes_created': $boxesCreated
        };
    };

    /**
     * Add one tab to the already set up boxes head and body
     * @version 2017-10-15
     * @since   2017-10-15
     * @author  Peter Lembke
     */
    $functions.push("add"); // Enable this function
    const add = function ($in)
    {
        const $default = {
            'parent_box_id': '',
            'tab_alias': '',
            'step': 'step_start',
            'response': {},
            'data_back': {}
        };
        $in = _Default($default, $in);

        if ($in.step === 'step_start')
        {
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_view',
                    'function': 'box_list'
                },
                'data': {
                    'box_id': $in.parent_box_id
                },
                'data_back': {
                    'parent_box_id': $in.parent_box_id,
                    'tab_alias': $in.tab_alias,
                    'step': 'step_box_list_response'
                }
            });
        }

        if ($in.step === 'step_box_list_response')
        {
            const $default = {
                'answer': '',
                'message': '',
                'box_id': '',
                'index': {}
            };
            $in.response = _Default($default, $in.response);

            $in.data_back.head_id = $in.response.index.head;
            $in.data_back.body_id = $in.response.index.body;
            $in.step = 'step_create_head_tab';
        }

        if ($in.step === 'step_create_head_tab')
        {
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_view',
                    'function': 'box_insert'
                },
                'data': {
                    'parent_box_id': $in.data_back.head_id,
                    'box_position': 'last',
                    'box_mode': 'data',
                    'box_alias': $in.tab_alias
                },
                'data_back': {
                    'parent_box_id': $in.parent_box_id,
                    'tab_alias': $in.tab_alias,
                    'step': 'step_create_head_tab_response',
                    'head_id': $in.data_back.head_id,
                    'body_id': $in.data_back.body_id,
                    'head_tab_id': $in.data_back.head_tab_id,
                    'body_tab_id': $in.data_back.body_tab_id
                }
            });
        }

        if ($in.step === 'step_create_head_tab_response')
        {
            const $default = {
                'answer': '',
                'message': '',
                'box_id': ''
            };
            $in.response = _Default($default, $in.response);
            $in.data_back.head_tab_id = $in.response.box_id;
            $in.data_back.body_tab_id = 0;
            $in.step = 'step_create_body_tab';
        }

        if ($in.step === 'step_create_body_tab')
        {
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_view',
                    'function': 'box_insert'
                },
                'data': {
                    'parent_box_id': $in.data_back.body_id,
                    'box_position': 'last',
                    'box_mode': 'data',
                    'box_alias': $in.tab_alias
                },
                'data_back': {
                    'parent_box_id': $in.parent_box_id,
                    'tab_alias': $in.tab_alias,
                    'step': 'step_create_body_tab_response',
                    'head_id': $in.data_back.head_id,
                    'body_id': $in.data_back.body_id,
                    'head_tab_id': $in.data_back.head_tab_id,
                    'body_tab_id': $in.data_back.body_tab_id
                }
            });
        }

        if ($in.step === 'step_create_body_tab_response')
        {
            const $default = {
                'answer': '',
                'message': '',
                'box_id': ''
            };
            $in.response = _Default($default, $in.response);

            $in.data_back.body_tab_id = $in.response.box_id;
            $in.step = 'step_end';
        }

        return {
            'answer': $in.response.answer,
            'message': $in.response.message,
            'head_id': $in.data_back.head_id,
            'body_id': $in.data_back.body_id,
            'head_tab_id': $in.data_back.head_tab_id,
            'body_tab_id': $in.data_back.body_tab_id
        };
    };

    /**
     * Remove a tab from the already set up boxes
     * @version 2017-10-15
     * @since   2017-10-15
     * @author  Peter Lembke
     */
    $functions.push("remove"); // Enable this function
    const remove = function ($in)
    {
        const $default = {
            'parent_box_id': '',
            'tab_alias': '',
            'step': 'step_start',
            'response': null,
            'data_back': null
        };
        $in = _Default($default, $in);

        if ($in.step === 'step_start')
        {
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_view',
                    'function': 'box_list'
                },
                'data': {
                    'box_id': $in.parent_box_id
                },
                'data_back': {
                    'parent_box_id': $in.parent_box_id,
                    'tab_alias': $in.tab_alias,
                    'step': 'step_box_list_response'
                }
            });
        }

        if ($in.step === 'step_box_list_response')
        {
            const $default = {
                'answer': '',
                'message': '',
                'box_id': '',
                'index': {}
            };
            $in.response = _Default($default, $in.response);

            $in.data_back.head_id = $in.response.index.head;
            $in.data_back.body_id = $in.response.index.body;
            $in.step = 'step_remove_tab_head';
        }

        if ($in.step === 'step_remove_tab_head')
        {
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_view',
                    'function': 'box_delete'
                },
                'data': {
                    'box_id': $in.data_back.head_id
                },
                'data_back': {
                    'parent_box_id': $in.parent_box_id,
                    'tab_alias': $in.tab_alias,
                    'step': 'step_remove_tab_body'
                }
            });
        }

        if ($in.step === 'step_remove_tab_body')
        {
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_view',
                    'function': 'box_delete'
                },
                'data': {
                    'box_id': $in.data_back.body_id
                },
                'data_back': {
                    'parent_box_id': $in.parent_box_id,
                    'tab_alias': $in.tab_alias,
                    'step': 'step_remove_tab_body'
                }
            });
        }

        return {
            'answer': 'true',
            'message': 'I have tried to delete the two boxes'
        };
    };

    /**
     * Show the box_id, hide the siblings
     * @version 2017-10-15
     * @since   2017-10-15
     * @author  Peter Lembke
     */
    $functions.push("siblings_box_view"); // Enable this function
    const siblings_box_view = function ($in)
    {
        const $default = {
            'box_id': '',
            'step': 'step_start',
            'response': {},
            'data_back': {}
        };
        $in = _Default($default, $in);

        if ($in.step === 'step_start')
        {
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_view',
                    'function': 'siblings_box_view'
                },
                'data': {
                    'box_id': $in.box_id
                },
                'data_back': {
                    'step': 'step_end'
                }
            });
        }

        return {
            'answer': $in.response.answer,
            'message': $in.response.message,
            'step': $in.step
        };
    };

    /**
     * Will highlight a tab
     * @version 2017-10-27
     * @since 2017-10-27
     * @author Peter Lembke
     * @param $in
     * @returns {*}
     */
    $functions.push('highlight_tab');
    const highlight_tab = function ($in)
    {
        const $default = {
            'parent_box_id': '',
            'tab_alias': '',
            'step': 'step_get_box_list',
            'data_back': {},
            'response': {}
        };
        $in = _Default($default, $in);

        if ($in.step === 'step_get_box_list') {
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_view',
                    'function': 'box_list'
                },
                'data': {
                    'box_id': $in.parent_box_id
                },
                'data_back': {
                    'parent_box_id': $in.parent_box_id,
                    'tab_alias': $in.tab_alias,
                    'step': 'step_mass_update'
                }
            });
        }

        if ($in.step === 'step_mass_update')
        {
            let $do = [], $doItem;

            for (let $tabAlias in $in.response.index)
            {
                $doItem = {
                    'func': 'ModifyClass',
                    'id': $in.response.index[$tabAlias] + '.[menutitle]',
                    'class': 'yes',
                    'cmd': 'remove'
                };

                if ($tabAlias === $in.tab_alias) {
                    $doItem = {
                        'func': 'ModifyClass',
                        'id': $in.response.index[$tabAlias] + '.[menutitle]',
                        'class': 'yes',
                        'cmd': 'add'
                    };
                }

                $do.push($doItem);
            }

            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_view',
                    'function': 'mass_update'
                },
                'data': {
                    'do': $do
                },
                'data_back': {
                    'parent_box_id': $in.parent_box_id,
                    'tab_alias': $in.tab_alias,
                    'step': 'step_end'
                }
            });
        }

        return {
            'answer': 'true',
            'message': 'Have highlighted the tab'
        };
    };

    /**
     * Normally you init the tab system and then add tabs and then add contents
     * In this function you give everything you want and the tabs are set up with contents.
     * @version 2018-02-02
     * @since   2018-02-02
     * @author  Peter Lembke
     */
    $functions.push("setup_full_tab_system"); // Enable this function
    const setup_full_tab_system = function ($in)
    {
        let $default = {
            'parent_box_id': '', // The box where you want the tabs
            'highlight_tab_alias': '',
            'tabs': [], // tabs have: tab_alias, head_content, body_content
            'step': 'step_init',
            'response': {
                'answer': '',
                'message': '',
                'head_tab_id': '',
                'body_tab_id': '',
                'body_id': '',
                'head_id': '',
                'boxes_created': ''
            },
            'data_back': {
                'tab_alias': '',
                'head_content': {},
                'body_content': {},
                'head_tab_id': '',
                'body_tab_id': ''
            }
        };
        $in = _Default($default, $in);

        if ($in.step === 'step_init')
        {
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_tabs',
                    'function': 'init'
                },
                'data': {
                    'parent_box_id': $in.parent_box_id
                },
                'data_back': {
                    'parent_box_id': $in.parent_box_id,
                    'tabs': $in.tabs,
                    'highlight_tab_alias': $in.highlight_tab_alias,
                    'step': 'step_init_response'
                }
            });
        }

        if ($in.step === 'step_init_response')
        {
            if (_GetData({'name': 'response/boxes_created', 'data': $in}) === 'false') {
                $in.tabs = [];
            }

            // If we have a simple list then the list will be converted
            if (_Count($in.tabs) > 0) {
                if (_IsSet($in.tabs[0]) === 'true') {
                    if (_IsSet($in.tabs[0].alias) === 'true') {
                        $in.tabs = _GetTabsRenderData($in.tabs);
                    }
                }

            }

            $in.step = 'step_add_tab_loop';
        }

        if ($in.step === 'step_add_tab_loop')
        {
            $in.step = 'step_highlight_tab';

            if (_Empty($in.highlight_tab_alias) === 'true') {
                $in.step = 'step_end';
            }

            if (_Count($in.tabs) > 0) {
                $in.step = 'step_add_tab';
            }
        }

        if ($in.step === 'step_add_tab')
        {
            let $tab = $in.tabs.shift();
            const $default = {
                'tab_alias': '',
                'head_content': {},
                'body_content': {}
            };
            $tab = _Default($default, $tab);

            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_tabs',
                    'function': 'add'
                },
                'data': {
                    'parent_box_id': $in.parent_box_id,
                    'tab_alias': $tab.tab_alias
                },
                'data_back': {
                    'parent_box_id': $in.parent_box_id,
                    'tabs': $in.tabs,
                    'highlight_tab_alias': $in.highlight_tab_alias,
                    'head_content': $tab.head_content,
                    'body_content': $tab.body_content,
                    'step': 'step_add_tab_response'
                }
            });

        }

        if ($in.step === 'step_add_tab_response')
        {
            $in.data_back.head_tab_id = $in.response.head_tab_id;
            $in.data_back.body_tab_id = $in.response.body_tab_id;
            $in.step = 'step_add_head_tab_content';
        }

        $default = {
            'what': {},
            'how': {
                'mode': 'one box',
                'text': ''
            },
            'where': {
                'box_id': ''
            }
        };

        if ($in.step === 'step_add_head_tab_content')
        {
            $in.data_back.head_content = _Default($default, $in.data_back.head_content);
            $in.data_back.head_content.where.box_id = $in.data_back.head_tab_id;

            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_render',
                    'function': 'create'
                },
                'data': $in.data_back.head_content,
                'data_back': {
                    'parent_box_id': $in.parent_box_id,
                    'tabs': $in.tabs,
                    'highlight_tab_alias': $in.highlight_tab_alias,
                    'body_content': $in.data_back.body_content,
                    'body_tab_id': $in.data_back.body_tab_id,
                    'step': 'step_add_body_tab_content'
                }
            });
        }

        if ($in.step === 'step_add_body_tab_content')
        {
            $in.data_back.body_content = _Default($default, $in.data_back.body_content);
            $in.data_back.body_content.where.box_id = $in.data_back.body_tab_id;

            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_render',
                    'function': 'create'
                },
                'data': $in.data_back.body_content,
                'data_back': {
                    'parent_box_id': $in.parent_box_id,
                    'tabs': $in.tabs,
                    'highlight_tab_alias': $in.highlight_tab_alias,
                    'step': 'step_add_tab_loop'
                }
            });
        }

        if ($in.step === 'step_highlight_tab')
        {
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_tabs',
                    'function': 'highlight_tab'
                },
                'data': {
                    'parent_box_id': $in.parent_box_id + '.head',
                    'tab_alias': $in.highlight_tab_alias
                },
                'data_back': {
                    'parent_box_id': $in.parent_box_id,
                    'plugin_name': $in.plugin_name,
                    'already_started': $in.data_back.already_started,
                    'highlight_tab_alias': $in.highlight_tab_alias,
                    'step': 'step_hide_siblings_to_tab'
                }
            });
        }

        if ($in.step === 'step_hide_siblings_to_tab')
        {
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_tabs',
                    'function': 'siblings_box_view'
                },
                'data': {
                    'box_id': $in.parent_box_id + '.body.' + $in.highlight_tab_alias
                },
                'data_back': {
                    'parent_box_id': $in.parent_box_id,
                    'plugin_name': $in.plugin_name,
                    'already_started': $in.data_back.already_started,
                    'highlight_tab_alias': $in.highlight_tab_alias,
                    'step': 'step_end'
                }
            });
        }

        return {
            'answer': $in.response.answer,
            'message': $in.response.message,
            'step': $in.step
        };
    };

    /**
     * Give an array with alias and label, get an array with data that can be rendered
     * @version 2018-05-16
     * @since   2018-05-16
     * @author  Peter Lembke
     */
    $functions.push('_GetTabsRenderData');
    const _GetTabsRenderData = function ($tabs)
    {
        const $default = {
            'alias': '', // alias must be a single word here.
            'label': '',
            'content': {}
        };

        let $result = [];
        for (let $key in $tabs)
        {
            if ($tabs.hasOwnProperty($key)) {
                let $oneTab = $tabs[$key];
                $oneTab = _Default($default, $oneTab);
                $result.push(_GetTabRenderData($oneTab.alias, $oneTab.label, $oneTab.content));
            }
        }

        return $result;
    };

    /**
     * Turn one alias and label into data that can be rendered
     * @version 2018-05-16
     * @since   2018-05-16
     * @author  Peter Lembke
     */
    $functions.push('_GetTabRenderData');
    const _GetTabRenderData = function ($alias, $label, $content)
    {
        const $class = '.' + $alias;

        let $data = {
            'tab_alias': $alias,
            'head_content': {
                'what': {
                    'menulink': {
                        'type': 'link',
                        'subtype': 'link',
                        'alias': 'menulink',
                        'show': '[menutitle]',
                        'legend': 'false',
                        'event_data': $alias, // Any string you like to send to the event_message function
                        'to_plugin': 'infohub_tabs',
                        'css_data': {
                            '.yes': 'background-color: #b2de98;'
                        }
                    },
                    'menutitle': {
                        'type': 'common',
                        'subtype': 'container',
                        'alias': $alias,
                        'class': $alias,
                        'data': $label,
                        'tag': 'div',
                        'css_data': {}
                    }
                },
                'how': {
                    'text': '[menulink]'
                }
            },
            'body_content': {
                'what': {
                },
                'how': {
                    'text': $alias
                }
            }
        };

        if (_IsSet($content.what) === 'true') {
            $data.body_content =  $content;
        }

        $data.head_content.what.menutitle.css_data[$class] =  'padding: 0px 8px 0px 0px;';

        return $data;
    };

    /**
     * Triggers when a user click on a plugin icon from the head of started plugins.
     * @version 2017-10-28
     * @since   2017-10-27
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
            'parent_box_id': '',
            'plugin_name': '',
            'final_node': 'client',
            'final_plugin': '',
            'final_function': 'event_message',
            'data_back': {},
            'response': {}
        };
        $in = _Merge($default, $in);

        if ($in.step === 'step_start') {
            if ($in.type === 'link') {
                return _SubCall({
                    'to': {
                        'node': 'client',
                        'plugin': 'infohub_tabs',
                        'function': 'siblings_box_view'
                    },
                    'data': {
                        'box_id': $in.box_id + '.parent.parent.body.' + $in.event_data // The tab box_id, parent = head, parent = main
                    },
                    'data_back': {
                        'parent_box_id': $in.parent_box_id,
                        'box_id': $in.box_id,
                        'plugin_name': $in.event_data,
                        'type': $in.type,
                        'event_type': $in.event_type,
                        'event_data': $in.event_data,
                        'final_node': $in.final_node,
                        'final_plugin': $in.final_plugin,
                        'final_function': $in.final_function,
                        'step': 'step_highlight_tab'
                    }
                });
            }
        }

        if ($in.step === 'step_highlight_tab') {      
            
            let $step = 'step_end';
            if ($in.event_type === 'long_click' && $in.final_plugin !== '') {
                $step = 'step_long_click';
            }
            
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_tabs',
                    'function': 'highlight_tab'
                },
                'data': {
                    'parent_box_id': $in.parent_box_id,
                    'tab_alias': $in.plugin_name
                },
                'data_back': {
                    'box_id': $in.box_id,
                    'parent_box_id': $in.parent_box_id,
                    'tab_alias': $in.plugin_name,
                    'type': $in.type,
                    'event_type': $in.event_type,
                    'event_data': $in.event_data,
                    'final_node': $in.final_node,
                    'final_plugin': $in.final_plugin,
                    'final_function': $in.final_function,
                    'step': $step
                }
            });
        }

        if ($in.step === 'step_long_click') {
            
            return _SubCall({
                'to': {
                    'node': $in.final_node,
                    'plugin': $in.final_plugin,
                    'function': $in.final_function
                },
                'data': {
                    'box_id': $in.box_id + '.parent.parent.body.' + $in.event_data, // The tab box_id, parent = head, parent = main
                    'parent_box_id': $in.parent_box_id,
                    'tab_alias': $in.plugin_name,
                    'type': $in.type,
                    'event_type': $in.event_type,
                    'event_data': $in.event_data
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
//# sourceURL=infohub_tabs.js