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
function infohub_tree_doc() {

    "use strict";

// include "infohub_base.js"

    const _Version = function() {
        return {
            'date': '2020-07-26',
            'since': '2020-07-25',
            'version': '1.0.0',
            'checksum': '{{checksum}}',
            'class_name': 'infohub_tree_doc',
            'note': 'Render the documentation for this plugin',
            'status': 'normal',
            'SPDX-License-Identifier': 'GPL-3.0-or-later'
        };
    };

    const _GetCmdFunctions = function() {
        const $list = {
            'create': 'normal',
            'click_main': 'normal',
            'click_version': 'normal',
            'click_encrypt': 'normal',
            'click_backup': 'normal',
            'click_restore': 'normal',
            'click_storage': 'normal',
            'click_sync': 'normal'
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
     * @version 2020-07-26
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
                            'data': '[button_main][button_version][button_encrypt][button_backup][button_restore][button_storage][button_sync]',
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
                            'button_left_icon': '[yellow_icon]',
                            'button_label': _Translate('Main Doc'),
                            'event_data': 'doc|main',
                            'to_plugin': 'infohub_tree',
                            'to_function': 'click'
                        },
                        'button_version': {
                            'plugin': 'infohub_renderform',
                            'type': 'button',
                            'mode': 'button',
                            'button_left_icon': '[yellow_icon]',
                            'button_label': _Translate('Version Doc'),
                            'event_data': 'doc|version',
                            'to_plugin': 'infohub_tree',
                            'to_function': 'click'
                        },
                        'button_encrypt': {
                            'plugin': 'infohub_renderform',
                            'type': 'button',
                            'mode': 'button',
                            'button_left_icon': '[grey_icon]',
                            'button_label': _Translate('Encryption Doc'),
                            'event_data': 'doc|encrypt',
                            'to_plugin': 'infohub_tree',
                            'to_function': 'click'
                        },
                        'button_backup': {
                            'plugin': 'infohub_renderform',
                            'type': 'button',
                            'mode': 'button',
                            'button_left_icon': '[blue_icon]',
                            'button_label': _Translate('Backup Doc'),
                            'event_data': 'doc|backup',
                            'to_plugin': 'infohub_tree',
                            'to_function': 'click'
                        },
                        'button_restore': {
                            'plugin': 'infohub_renderform',
                            'type': 'button',
                            'mode': 'button',
                            'button_left_icon': '[blue_icon]',
                            'button_label': _Translate('Restore Doc'),
                            'event_data': 'doc|restore',
                            'to_plugin': 'infohub_tree',
                            'to_function': 'click'
                        },
                       'button_storage': {
                            'plugin': 'infohub_renderform',
                            'type': 'button',
                            'mode': 'button',
                            'button_left_icon': '[grey_icon]',
                            'button_label': _Translate('Storage Doc'),
                            'event_data': 'doc|storage',
                            'to_plugin': 'infohub_tree',
                            'to_function': 'click'
                        },
                        'button_sync': {
                            'plugin': 'infohub_renderform',
                            'type': 'button',
                            'mode': 'button',
                            'button_left_icon': '[blue_icon]',
                            'button_label': _Translate('Sync Doc'),
                            'event_data': 'doc|sync',
                            'to_plugin': 'infohub_tree',
                            'to_function': 'click'
                        },
                        'yellow_icon': {
                            'type': 'common',
                            'subtype': 'svg',
                            'data': '[yellow_asset]'
                        },
                        'yellow_asset': {
                            'plugin': 'infohub_asset',
                            'type': 'icon',
                            'asset_name': 'doc/doc-yellow',
                            'plugin_name': 'infohub_tree'
                        },
                        'blue_icon': {
                            'type': 'common',
                            'subtype': 'svg',
                            'data': '[blue_asset]'
                        },
                        'blue_asset': {
                            'plugin': 'infohub_asset',
                            'type': 'icon',
                            'asset_name': 'doc/doc-blue',
                            'plugin_name': 'infohub_tree'
                        },
                        'grey_icon': {
                            'type': 'common',
                            'subtype': 'svg',
                            'data': '[grey_asset]'
                        },
                        'grey_asset': {
                            'plugin': 'infohub_asset',
                            'type': 'icon',
                            'asset_name': 'doc/doc-grey',
                            'plugin_name': 'infohub_tree'
                        }
                    },
                    'how': {
                        'mode': 'one box',
                        'text': '[container_buttons][container_doc]'
                    },
                    'where': {
                        'box_id': 'main.body.infohub_tree.form', // 'box_id': $in.parent_box_id + '.form',
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
     * @version 2020-07-26
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
            return _GetCall('infohub_tree');
        }

        return {
            'answer': 'true',
            'message': 'Showed the main doc',
            'ok': 'true'
        };
    };

    /**
     * Show the documentation
     * @version 2020-07-26
     * @since   2019-03-13
     * @author  Peter Lembke
     */
    $functions.push('click_version');
    const click_version = function ($in)
    {
        const $default = {
            'step': 'step_render',
            'response': {
                'html': ''
            }
        };
        $in = _Default($default, $in);

        if ($in.step === 'step_render') {
            return _GetCall('version/infohub_tree_version');
        }

        return {
            'answer': 'true',
            'message': 'Showed the version doc',
            'ok': 'true'
        };
    };

    /**
     * Show the documentation
     * @version 2020-07-26
     * @since   2019-03-13
     * @author  Peter Lembke
     */
    $functions.push('click_encrypt');
    const click_encrypt = function ($in)
    {
        const $default = {
            'step': 'step_render',
            'response': {
                'html': ''
            }
        };
        $in = _Default($default, $in);

        if ($in.step === 'step_render') {
            return _GetCall('encrypt/infohub_tree_encrypt');
        }

        return {
            'answer': 'true',
            'message': 'Showed the encrypt doc',
            'ok': 'true'
        };
    };

    /**
     * Show the documentation
     * @version 2020-07-26
     * @since   2019-03-13
     * @author  Peter Lembke
     */
    $functions.push('click_backup');
    const click_backup = function ($in)
    {
        const $default = {
            'step': 'step_render',
            'response': {
                'html': ''
            }
        };
        $in = _Default($default, $in);

        if ($in.step === 'step_render') {
            return _GetCall('backup/infohub_tree_backup');
        }

        return {
            'answer': 'true',
            'message': 'Showed the backup doc',
            'ok': 'true'
        };
    };

    /**
     * Show the documentation
     * @version 2020-07-26
     * @since   2019-03-13
     * @author  Peter Lembke
     */
    $functions.push('click_restore');
    const click_restore = function ($in)
    {
        const $default = {
            'step': 'step_render',
            'response': {
                'html': ''
            }
        };
        $in = _Default($default, $in);

        if ($in.step === 'step_render') {
            return _GetCall('restore/infohub_tree_restore');
        }

        return {
            'answer': 'true',
            'message': 'Showed the restore doc',
            'ok': 'true'
        };
    };

    /**
     * Show the documentation
     * @version 2020-07-26
     * @since   2019-03-13
     * @author  Peter Lembke
     */
    $functions.push('click_storage');
    const click_storage = function ($in)
    {
        const $default = {
            'step': 'step_render',
            'response': {
                'html': ''
            }
        };
        $in = _Default($default, $in);

        if ($in.step === 'step_render') {
            return _GetCall('storage/infohub_tree_storage');
        }

        return {
            'answer': 'true',
            'message': 'Showed the storage doc',
            'ok': 'true'
        };
    };

    /**
     * Show the documentation
     * @version 2020-08-30
     * @since   2020-08-30
     * @author  Peter Lembke
     */
    $functions.push('click_sync');
    const click_sync = function ($in)
    {
        const $default = {
            'step': 'step_render',
            'response': {
                'html': ''
            }
        };
        $in = _Default($default, $in);

        if ($in.step === 'step_render') {
            return _GetCall('sync/infohub_tree_sync');
        }

        return {
            'answer': 'true',
            'message': 'Showed the sync doc',
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
                        'plugin': 'infohub_tree',
                        'type': $fileName
                    }
                },
                'how': {
                    'mode': 'one box',
                    'text': '[my_doc]'
                },
                'where': {
                    'box_id': 'main.body.infohub_tree.form.[container_doc]', // 'box_id': $in.parent_box_id + '.form',
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
//# sourceURL=infohub_tree_doc.js