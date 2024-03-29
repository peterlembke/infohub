/**
 * GUI to manage login contacts between nodes
 *
 * @author      Peter Lembke <info@infohub.se>
 * @version     2019-03-13
 * @since       2019-01-16
 * @copyright   Copyright (c) 2019, Peter Lembke
 * @license     https://opensource.org/licenses/gpl-license.php GPL-3.0-or-later
 * @see         https://github.com/peterlembke/infohub/blob/master/folder/plugins/infohub/contact/infohub_contact.md Documentation
 * @link        https://infohub.se/ InfoHub main page
 */
function infohub_contact() {

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
            'date': '2019-03-13',
            'since': '2019-01-16',
            'version': '1.0.0',
            'checksum': '{{checksum}}',
            'class_name': 'infohub_contact',
            'note': 'GUI to manage login contacts between nodes',
            'status': 'normal',
            'SPDX-License-Identifier': 'GPL-3.0-or-later',
            'title': 'Node contacts',
            'user_role': 'admin',
            'web_worker': 'true',
            'core_plugin': 'false',
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
            'setup_gui': 'normal',
            'click_menu': 'normal',
            'click': 'normal',
            'call_server': 'normal',
        };

        return _GetCmdFunctionsBase($list);
    };

    $functions.push('_GetPluginName');
    /**
     * Give a child name and get the full plugin name for that child
     * @param $data
     * @returns {string}
     * @private
     */
    const _GetPluginName = function($data) {
        let $pluginType = 'welcome';
        const $tmp = $data.split('_');

        if (_IsSet($tmp[0]) === 'true') {
            $pluginType = $tmp[0];
        }

        return 'infohub_contact_' + $pluginType;
    };

    let $classTranslations = {};

    // ***********************************************************
    // * your class functions below, only declare with var
    // * Can only be reached through cmd()
    // ***********************************************************

    /**
     * Set up the Workbench Graphical User Interface
     * @version 2019-03-13
     * @since   2017-10-03
     * @author  Peter Lembke
     */
    $functions.push('setup_gui');
    const setup_gui = function($in = {}) {
        const $default = {
            'box_id': '',
            'step': 'step_start',
            'response': {
                'answer': '',
                'message': '',
                'data': {},
            },
        };
        $in = _Merge($default, $in);

        if ($in.step === 'step_start') {
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_view',
                    'function': 'box_mode',
                },
                'data': {
                    'box_id': $in.box_id,
                    'box_mode': 'side',
                    'digits': '2',
                },
                'data_back': {
                    'box_id': $in.box_id,
                    'step': 'step_boxes_insert',
                },
            });
        }

        if ($in.step === 'step_boxes_insert') {
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_view',
                    'function': 'boxes_insert_detailed',
                },
                'data': {
                    'items': [
                        {
                            'parent_box_id': $in.box_id,
                            'box_position': 'last',
                            'box_mode': 'data',
                            'box_alias': 'menu',
                            'max_width': 640,
                            'box_data': 'The menu will render here',
                        },
                        {
                            'parent_box_id': $in.box_id,
                            'box_position': 'last',
                            'box_mode': 'data',
                            'box_alias': 'form',
                            'max_width': 100, // 100 will be translated to 100%
                            'box_data': 'Use the menu',
                        },
                    ],
                },
                'data_back': {
                    'box_id': $in.box_id,
                    'step': 'step_get_translations',
                },
            });
        }

        if ($in.step === 'step_get_translations') {
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_translate',
                    'function': 'get_translate_data',
                },
                'data': {},
                'data_back': {
                    'box_id': $in.box_id,
                    'step': 'step_get_translations_response',
                },
            });
        }

        if ($in.step === 'step_get_translations_response') {
            $classTranslations = _ByVal($in.response.data);
            $in.step = 'step_menu';
        }

        if ($in.step === 'step_menu') {
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_contact_menu',
                    'function': 'create',
                },
                'data': {
                    'subtype': 'menu',
                    'parent_box_id': $in.box_id,
                    'translations': $classTranslations,
                },
                'data_back': {
                    'box_id': $in.box_id,
                    'step': 'step_render_instructions',
                },
            });
        }

        if ($in.step === 'step_render_instructions') {
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_render',
                    'function': 'create',
                },
                'data': {
                    'what': {
                        'presentation_box': {
                            'plugin': 'infohub_rendermajor',
                            'type': 'presentation_box',
                            'head_label': _Translate('INSTRUCTIONS'),
                            'head_text': '',
                            'content_data': '[description]',
                        },
                        'description': {
                            'type': 'common',
                            'subtype': 'value',
                            'data': _Translate('USE_THE_MENU.')
                        }
                    },
                    'how': {
                        'mode': 'one box',
                        'text': '[presentation_box]',
                    },
                    'where': {
                        'box_id': 'main.body.infohub_contact.form',
                        'max_width': 640,
                        'scroll_to_box_id': 'true',
                    },
                },
                'data_back': {
                    'step': 'step_end',
                },
            });
        }

        return {
            'answer': 'true',
            'message': 'plugin GUI is done',
        };

    };

    /**
     * Handle the menu clicks
     * @version 2019-03-13
     * @since 2018-09-26
     * @author Peter Lembke
     */
    $functions.push('click_menu');
    const click_menu = function($in = {}) {
        const $default = {
            'step': 'step_start',
            'event_data': '',
            'parent_box_id': '',
        };
        $in = _Default($default, $in);

        if ($in.step === 'step_start') {
            const $pluginName = _GetPluginName($in.event_data);
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': $pluginName,
                    'function': 'create',
                },
                'data': {
                    'subtype': $in.event_data,
                    'parent_box_id': $in.parent_box_id,
                    'translations': $classTranslations,
                },
                'data_back': {
                    'step': 'step_end',
                },
            });
        }

        return {
            'answer': 'true',
            'message': 'Menu click done',
        };
    };

    /**
     * All clicks except the menu goes here and are distributed
     * to the right child and the right click function.
     * @version 2019-03-13
     * @since 2019-03-13
     * @author Peter Lembke
     */
    $functions.push('click');
    const click = function($in = {}) {
        const $default = {
            'event_data': '', // childName|clickName
            'value': '', // Selected option in select lists
            'box_id': '',
            'step': 'step_start',
            'response': {
                'answer': 'false',
                'message': 'There was an error',
                'ok': 'false',
                'value': [], // All selected options in select lists
                'files_data': [], // For the import button
            },
        };
        $in = _Default($default, $in);

        if (_Empty($in.event_data) === 'true') {
            $in.step = 'step_end';
            $in.response.message = 'Event_data is empty. I can not continue.';
        }

        if ($in.step === 'step_start') {

            const $parts = $in.event_data.split('|');
            const $childName = $parts[0];
            const $clickName = $parts[1];

            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_contact_' + $childName,
                    'function': 'click_' + $clickName,
                },
                'data': {
                    'event_data': $in.event_data,
                    'value': $in.value,
                    'values': $in.response.value,
                    'files_data': $in.response.files_data,
                    'box_id': $in.box_id,
                },
                'data_back': {
                    'event_data': $in.event_data,
                    'step': 'step_end',
                },
            });
        }

        return {
            'answer': $in.response.answer,
            'message': $in.response.message,
            'ok': $in.response.ok,
        };
    };

    /**
     * Children can talk to level1 plugins on the same node.
     * When you need data from other nodes then any level1 plugin must help to get that.
     * @version 2019-03-13
     * @since 2019-03-13
     * @author Peter Lembke
     */
    $functions.push('call_server');
    const call_server = function($in = {}) {
        const $default = {
            'step': 'step_start',
            'to': {'function': ''},
            'data': {},
            'response': {},
            'from_plugin': {
                'node': '',
                'plugin': '',
            },
        };
        $in = _Default($default, $in);

        if ($in.step === 'step_start') {

            if ($in.from_plugin.node !== 'client') {
                return {
                    'answer': 'false',
                    'message': 'Only plugins from the client node can call this function',
                };
            }

            if ($in.from_plugin.plugin.indexOf('infohub_contact_') !== 0) {
                return {
                    'answer': 'false',
                    'message': 'Only children to this plugin can call this function',
                };
            }

            return _SubCall({
                'to': {
                    'node': 'server',
                    'plugin': 'infohub_contact',
                    'function': $in.to.function,
                },
                'data': $in.data,
                'data_back': {
                    'step': 'step_end',
                },
                'wait': 0.2
            });
        }

        return $in.response;
    };
}

//# sourceURL=infohub_contact.js