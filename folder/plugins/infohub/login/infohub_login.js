/**
 * Login
 * Login GUI
 *
 * @package     Infohub
 * @subpackage  infohub_login
 * @since       2019-01-09
 * @author      Peter Lembke <info@infohub.se>
 * @license     GPL-3.0-or-later
 * @copyright   Copyright (C) 2010- Peter Lembke
 */
function infohub_login() {

    'use strict';

// include "infohub_base.js"

    const _Version = function() {
        return {
            'date': '2020-01-03',
            'since': '2019-01-09',
            'version': '1.0.0',
            'checksum': '{{checksum}}',
            'class_name': 'infohub_login',
            'note': 'Login GUI',
            'status': 'normal',
            'SPDX-License-Identifier': 'GPL-3.0-or-later',
            'title': 'Login',
            'user_role': 'user',
            'web_worker': 'true',
            'core_plugin': 'true'
        };
    };

    const _GetCmdFunctions = function() {
        const $list = {
            'setup_gui': 'normal',
            'setup_information': 'normal',
            'click_menu': 'normal',
            'click': 'normal',
            'call_server': 'normal',
            'get_user_real_name': 'normal',
            'logout': 'normal',
        };

        return _GetCmdFunctionsBase($list);
    };

    const _GetPluginName = function($data = '') {
        let $pluginType = 'login',
            $tmp = $data.split('_');

        if (_IsSet($tmp[0]) === 'true') {
            $pluginType = $tmp[0];
        }

        return 'infohub_login_' + $pluginType;
    };

    let $classTranslations = {};

    // ***********************************************************
    // * your class functions below, only declare with var
    // * Can only be reached through cmd()
    // ***********************************************************

    /**
     * Set up the Workbench Graphical User Interface
     * @version 2019-09-03
     * @since   2019-09-03
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
                'post_exist': 'false',
            },
            'desktop_environment': '',
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
                    'desktop_environment': $in.desktop_environment,
                    'language': 'en',
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
                            'box_data': '', // The menu will render here
                        },
                        {
                            'parent_box_id': $in.box_id,
                            'box_position': 'last',
                            'box_mode': 'data',
                            'box_alias': 'form',
                            'max_width': 640, // 100 will be translated to 100%
                            'box_data': '', // Use the menu
                        },
                        {
                            'parent_box_id': $in.box_id,
                            'box_position': 'last',
                            'box_mode': 'data',
                            'box_alias': 'contact',
                            'max_width': 640, // 100 will be translated to 100%
                            'box_data': '', // Imported contact data
                        },
                        {
                            'parent_box_id': $in.box_id,
                            'box_position': 'last',
                            'box_mode': 'data',
                            'box_alias': 'information',
                            'max_width': 640, // 100 will be translated to 100%
                            'box_data': '', // Imported contact data
                        },
                    ],
                },
                'data_back': {
                    'box_id': $in.box_id,
                    'desktop_environment': $in.desktop_environment,
                    'step': 'step_boxes_insert_response',
                },
            });
        }

        if ($in.step === 'step_boxes_insert_response') {
            $in.step = 'step_get_translations';
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
                    'desktop_environment': $in.desktop_environment,
                    'step': 'step_get_translations_response',
                },
            });
        }

        if ($in.step === 'step_get_translations_response') {
            $classTranslations = _ByVal($in.response.data);

            $in.step = 'step_menu';

            if ($in.desktop_environment === 'standalone') {
                $in.step = 'step_render_standalone';
            }
        }

        if ($in.step === 'step_menu') {
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_login_menu',
                    'function': 'create',
                },
                'data': {
                    'subtype': 'menu',
                    'parent_box_id': $in.box_id,
                    'translations': $classTranslations,
                },
                'data_back': {
                    'box_id': $in.box_id,
                    'desktop_environment': $in.desktop_environment,
                    'step': 'step_render_contact',
                },
            });
        }

        if ($in.step === 'step_render_contact') {
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_login_contact',
                    'function': 'create',
                },
                'data': {
                    'subtype': 'client',
                    'parent_box_id': $in.box_id,
                    'translations': $classTranslations,
                },
                'data_back': {
                    'box_id': $in.box_id,
                    'desktop_environment': $in.desktop_environment,
                    'step': 'step_render_contact_response',
                },
            });
        }

        if ($in.step === 'step_render_contact_response') {
            $in.step = 'step_render_instructions';
            if ($in.response.post_exist === 'true') {
                $in.step = 'step_render_login';
            }
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
                        'box_id': 'main.body.infohub_login.form',
                        'max_width': 640,
                        'scroll_to_box_id': 'true',
                    },
                    'cache_key': 'instructions',
                },
                'data_back': {
                    'box_id': $in.box_id,
                    'desktop_environment': $in.desktop_environment,
                    'step': 'step_end',
                },
            });
        }

        if ($in.step === 'step_render_login') {
            const $messageOut = _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_login',
                    'function': 'setup_information',
                },
                'data': {},
                'data_back': {
                    'box_id': $in.box_id,
                    'desktop_environment': $in.desktop_environment,
                    'step': 'step_end',
                },
            });
            let $messageArray = [];
            $messageArray.push($messageOut);

            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_login',
                    'function': 'click_menu',
                },
                'data': {
                    'event_data': 'login',
                    'desktop_environment': $in.desktop_environment,
                },
                'data_back': {
                    'box_id': $in.box_id,
                    'desktop_environment': $in.desktop_environment,
                    'step': 'step_end',
                },
                'messages': $messageArray,
            });
        }

        if ($in.step === 'step_render_standalone') {
            const $messageOut = _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_login',
                    'function': 'setup_information',
                },
                'data': {},
                'data_back': {
                    'box_id': $in.box_id,
                    'desktop_environment': $in.desktop_environment,
                    'step': 'step_end',
                },
            });
            let $messageArray = [];
            $messageArray.push($messageOut);

            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_login',
                    'function': 'click_menu',
                },
                'data': {
                    'event_data': 'standalone',
                    'desktop_environment': $in.desktop_environment,
                },
                'data_back': {
                    'box_id': $in.box_id,
                    'desktop_environment': $in.desktop_environment,
                    'step': 'step_end',
                },
                'messages': $messageArray,
            });
        }

        return {
            'answer': 'true',
            'message': 'plugin GUI is done',
        };
    };

    /**
     * Set up the information page
     * @version 2020-08-20
     * @since   2020-08-20
     * @author  Peter Lembke
     */
    $functions.push('setup_information');
    const setup_information = function($in = {}) {
        const $default = {
            'step': 'step_start',
            'config': {
                'information': {
                    'enable': 'false',
                    'default_language': '',
                    'available_languages': [],
                    'folder': 'plugin',
                    'path': 'start_page_text',
                    'links': {},
                },
            },
            'response': {},
            'data_back': {},
        };
        $in = _Default($default, $in);

        if ($in.step === 'step_start') {
            $in.step = 'step_get_language';
            if ($in.config.information.enable !== 'true') {
                $in.step = 'step_end';
            }
        }

        if ($in.step === 'step_get_language') {
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_configlocal',
                    'function': 'get_config',
                },
                'data': {
                    'section_name': 'language',
                },
                'data_back': {
                    'step': 'step_get_language_response',
                },
            });
        }

        if ($in.step === 'step_get_language_response') {
            const $default = {
                'answer': '',
                'message': '',
                'data': {
                    'language': '',
                },
            };
            $in.response = _Default($default, $in.response);

            $in.step = 'step_end';

            if ($in.response.answer === 'true') {
                $in.step = 'step_get_doc_file';

                $in.data_back.language = $in.config.information.default_language;

                const $languageArray = $in.response.data.language.split(',');
                const $length = $languageArray.length;

                for (let $number = 0; $number < $length; $number = $number +
                    1) {

                    const $language = $languageArray[$number];
                    const $languageFound = $in.config.information.available_languages.indexOf(
                        $language) !== -1;

                    if ($languageFound === true) {
                        $in.data_back.language = $language;
                        break;
                    }
                }
            }
        }

        if ($in.step === 'step_get_doc_file') {
            return _SubCall({
                'to': {
                    'node': 'server',
                    'plugin': 'infohub_login',
                    'function': 'get_doc_file',
                },
                'data': {
                    'language': $in.data_back.language,
                    'path': $in.config.information.path,
                    'folder': $in.config.information.folder,
                },
                'data_back': {
                    'step': 'step_get_doc_file_response',
                },
                'wait': 0.2
            });
        }

        if ($in.step === 'step_get_doc_file_response') {
            const $default = {
                'answer': '',
                'message': '',
                'contents': '',
                'checksum': '',
            };
            $in.response = _Default($default, $in.response);

            $in.step = 'step_end';
            if ($in.response.answer === 'true') {
                $in.step = 'step_render_doc_file';
            }
        }

        if ($in.step === 'step_render_doc_file') {

            let $data = _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_render',
                    'function': 'create',
                },
                'data': {
                    'what': {
                        'my_view_box': {
                            'plugin': 'infohub_rendermajor',
                            'type': 'presentation_box',
                            'head_label': _Translate('WHAT_IS_THIS?'),
                            'foot_text': '',
                            'content_data': '[my_document]',
                            'open': 'false'
                        },
                        'my_document': {
                            'plugin': 'infohub_renderdocument',
                            'type': 'document',
                            'text': $in.response.contents,
                            'what': {},
                        },
                    },
                    'how': {
                        'mode': 'one box',
                        'text': '[my_view_box]',
                    },
                    'where': {
                        'box_id': 'main.body.infohub_login.information',
                        'max_width': 640,
                        'scroll_to_box_id': 'true',
                    },
                },
                'data_back': {
                    'step': 'step_end',
                },
            });

            let $what = {};
            let $options = [];

            for (let $label in $in.config.information.links) {
                let $name = $label.toLowerCase();
                $name = _Replace(' ', '_', $name);

                $what[$name] = {
                    'type': 'link',
                    'subtype': 'external',
                    'alias': $name,
                    'data': $name,
                    'show': _Translate($label),
                    'url': $in.config.information.links[$label],
                };

                $options.push({'label': '[' + $name + ']'});
            }

            if (_Count($options) > 0) {
                $what.links = {
                    'type': 'common',
                    'subtype': 'list',
                    'option': $options,
                };

                $data.data.what = _Merge($what, $data.data.what);
                $data.data.what.my_view_box.content_data = $data.data.what.my_view_box.content_data +
                    '[links]';
            }

            return $data;
        }

        return {
            'answer': 'true',
            'message': 'plugin GUI is done',
        };

    };

    /**
     * Handle the menu clicks
     * @version 2019-09-03
     * @since 2018-09-26
     * @author Peter Lembke
     */
    $functions.push('click_menu');
    const click_menu = function($in = {}) {
        const $default = {
            'step': 'step_start',
            'event_data': '',
            'parent_box_id': '',
            'desktop_environment': '',
            'response': {
                'answer': 'false',
                'message': 'Nothing to report',
            },
            'config': {
                'download_account': {},
            },
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
                    'desktop_environment': $in.desktop_environment,
                    'download_account': $in.config.download_account,
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
     * All clicks except the menu goes here and are distributed
     * to the right child and the right click function.
     * @version 2019-09-03
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
            'desktop_environment': '',
            'response': {
                'answer': 'false',
                'message': 'There was an error',
                'ok': 'false',
                'value': [], // All selected options in select lists
                'files_data': [], // For the import button
            },
            'config': {
                'download_account': {},
            },
        };
        $in = _Default($default, $in);

        const $pluginName = 'infohub_login';

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
                    'plugin': $pluginName + '_' + $childName,
                    'function': 'click_' + $clickName,
                },
                'data': {
                    'event_data': $in.event_data,
                    'value': $in.value,
                    'values': $in.response.value,
                    'files_data': $in.response.files_data,
                    'box_id': $in.box_id,
                    'desktop_environment': $in.desktop_environment,
                    'download_account': $in.config.download_account,
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
     * @version 2019-09-03
     * @since 2019-03-13
     * @author Peter Lembke
     */
    $functions.push('call_server');
    const call_server = function($in = {}) {
        const $default = {
            'step': 'step_start',
            'to': {
                'node': 'server',
                'plugin': 'infohub_login',
                'function': '',
            },
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

            if ($in.from_plugin.plugin.indexOf('infohub_login_') !== 0) {
                return {
                    'answer': 'false',
                    'message': 'Only children to this plugin can call this function',
                };
            }

            let $pluginName = 'infohub_login';
            if ($in.to.plugin === 'infohub_dummy') {
                $pluginName = 'infohub_dummy';
            }

            return _SubCall({
                'to': {
                    'node': 'server',
                    'plugin': $pluginName,
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

    /**
     * The node name on a client login file contain a friendly name.
     * This function return that name.
     * @version 2020-07-15
     * @since 2020-07-15
     * @author Peter Lembke
     */
    $functions.push('get_user_real_name');
    const get_user_real_name = function($in = {}) {
        const $default = {
            'step': 'step_start',
            'response': {},
            'from_plugin': {
                'node': '',
                'plugin': '',
            },
        };
        $in = _Default($default, $in);

        let $out = {
            'answer': 'false',
            'message': 'I could not get the user real name',
            'user_real_name': '',
        };

        if ($in.step === 'step_start') {
            if ($in.from_plugin.node !== 'client') {
                return {
                    'answer': 'false',
                    'message': 'Only plugins from the client node can call this function',
                };
            }

            if ($in.from_plugin.plugin !== 'infohub_launcher') {
                return {
                    'answer': 'false',
                    'message': 'Only infohub_launcher can call this function',
                };
            }

            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_login_contact',
                    'function': 'storage_read_contact_data',
                },
                'data': {},
                'data_back': {
                    'step': 'step_response',
                },
            });
        }

        if ($in.step === 'step_response') {
            const $default = {
                'answer': 'false',
                'message': '',
                'data': {
                    'node': '',
                },
                'post_exist': 'false',
            };

            $out.message = $in.response.message;

            if ($in.response.post_exist === 'true') {
                $out.answer = 'true';
                $out.message = 'Here are the user_real_name';
                $out.user_real_name = $in.response.data.node;
            }
        }

        return {
            'answer': $out.answer,
            'message': $out.message,
            'data': $out.user_real_name,
        };
    };

    /**
     * Logout that calls the click function
     * Used by SHIFT + CTRL + ALT + 0
     * @version 2020-07-16
     * @since 2020-07-16
     * @author Peter Lembke
     */
    $functions.push('logout');
    const logout = function($in = {}) {
        const $default = {
            'step': 'step_start',
            'response': {},
        };
        $in = _Default($default, $in);

        if ($in.step === 'step_start') {
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_login',
                    'function': 'click',
                },
                'data': {
                    'event_data': 'logout|logout',
                },
                'data_back': {
                    'step': 'step_end',
                },
            });
        }

        return $in.response;
    };
}

//# sourceURL=infohub_login.js