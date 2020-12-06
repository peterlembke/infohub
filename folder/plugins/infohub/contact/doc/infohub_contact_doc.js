/**
 * Render the documentation
 *
 * @author      Peter Lembke <info@infohub.se>
 * @version     2019-03-14
 * @since       2019-02-16
 * @copyright   Copyright (c) 2019, Peter Lembke
 * @license     https://opensource.org/licenses/gpl-license.php GPL-3.0-or-later
 * @see         https://github.com/peterlembke/infohub/blob/master/folder/plugins/infohub/contact/doc/infohub_contact_doc.md Documentation
 * @link        https://infohub.se/ InfoHub main page
 */
function infohub_contact_doc() {

    "use strict";

// include "infohub_base.js"

    $functions.push('_Version');
    /**
     * Version information, used by the version function
     * @returns {{date: string, note: string, 'SPDX-License-Identifier': string, checksum: string, version: string, class_name: string, since: string, status: string}}
     * @private
     */
    const _Version = function() {
        return {
            'date': '2019-03-14',
            'since': '2019-02-16',
            'version': '1.0.0',
            'checksum': '{{checksum}}',
            'class_name': 'infohub_contact_doc',
            'note': 'Render the documentation',
            'status': 'normal',
            'SPDX-License-Identifier': 'GPL-3.0-or-later'
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
            'click_main': 'normal',
            'click_client': 'normal',
            'click_server': 'normal'
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
                        'container_buttons': {
                            'type': 'common',
                            'subtype': 'container',
                            'tag': 'div',
                            'data': '[button_main][button_client][button_server]',
                            'class': 'container-small'
                        },
                        'container_doc': {
                            'type': 'common',
                            'subtype': 'container',
                            'tag': 'div',
                            'data': _Translate('Documentation will render here'),
                            'class': 'container-medium'
                        },
                        'button_main': {
                            'plugin': 'infohub_renderform',
                            'type': 'button',
                            'mode': 'button',
                            'button_label': _Translate('Main Doc'),
                            'event_data': 'doc|main',
                            'to_plugin': 'infohub_contact',
                            'to_function': 'click'
                        },
                        'button_client': {
                            'plugin': 'infohub_renderform',
                            'type': 'button',
                            'mode': 'button',
                            'button_label': _Translate('Client Doc'),
                            'event_data': 'doc|client',
                            'to_plugin': 'infohub_contact',
                            'to_function': 'click'
                        },
                        'button_server': {
                            'plugin': 'infohub_renderform',
                            'type': 'button',
                            'mode': 'button',
                            'button_label': _Translate('Server Doc'),
                            'event_data': 'doc|server',
                            'to_plugin': 'infohub_contact',
                            'to_function': 'click'
                        }
                    },
                    'how': {
                        'mode': 'one box',
                        'text': '[container_buttons][container_doc]'
                    },
                    'where': {
                        'box_id': 'main.body.infohub_contact.form', // 'box_id': $in.parent_box_id + '.form',
                        'max_width': 100,
                        'scroll_to_box_id': 'true'
                    },
                    'cache_key': 'doc'
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
     * Show the documentation
     * @version 2019-03-13
     * @since   2019-03-13
     * @author  Peter Lembke
     */
    $functions.push('click_main');
    const click_main = function ($in)
    {
        const $default = {
            'step': 'step_render',
            'response': {
                'html': ''
            }
        };
        $in = _Default($default, $in);

        if ($in.step === 'step_render') {
            return _GetCall('infohub_contact');
        }

        return {
            'answer': 'true',
            'message': 'Showed the main doc',
            'ok': 'true'
        };
    };

    /**
     * Show the documentation
     * @version 2019-03-13
     * @since   2019-03-13
     * @author  Peter Lembke
     */
    $functions.push('click_client');
    const click_client = function ($in)
    {
        const $default = {
            'step': 'step_render',
            'response': {
                'html': ''
            }
        };
        $in = _Default($default, $in);

        if ($in.step === 'step_render') {
            return _GetCall('client/infohub_contact_client');
        }

        return {
            'answer': 'true',
            'message': 'Showed the client doc',
            'ok': 'true'
        };
    };

    /**
     * Show the documentation
     * @version 2019-03-13
     * @since   2019-03-13
     * @author  Peter Lembke
     */
    $functions.push('click_server');
    const click_server = function ($in)
    {
        const $default = {
            'step': 'step_render',
            'response': {
                'html': ''
            }
        };
        $in = _Default($default, $in);

        if ($in.step === 'step_render') {
            return _GetCall('server/infohub_contact_server');
        }

        return {
            'answer': 'true',
            'message': 'Showed the server doc',
            'ok': 'true'
        };
    };

    /**
     * Show the documentation
     * @version 2019-03-13
     * @since   2019-03-13
     * @author  Peter Lembke
     */
    $functions.push('_GetCall');
    const _GetCall = function ($fileName)
    {
        return _SubCall({
            'to': {
                'node': 'client',
                'plugin': 'infohub_render',
                'function': 'create'
            },
            'data': {
                'what': {
                    'my_doc': {
                        'plugin': 'infohub_contact',
                        'type': $fileName
                    }
                },
                'how': {
                    'mode': 'one box',
                    'text': '[my_doc]'
                },
                'where': {
                    'box_id': 'main.body.infohub_contact.form.[container_doc]', // 'box_id': $in.parent_box_id + '.form',
                    'max_width': 100,
                    'scroll_to_box_id': 'true'
                }
            },
            'data_back': {
                'step': 'step_end'
            }
        });
    };

}
//# sourceURL=infohub_contact_doc.js