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
function infohub_translate_doc() {

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
            'date': '2019-09-28',
            'since': '2019-09-28',
            'version': '1.0.0',
            'checksum': '{{checksum}}',
            'class_name': 'infohub_translate_doc',
            'note': 'Show the documentation for this plugin',
            'status': 'normal',
            'license_name': 'GNU GPL 3 or later'
        };
    };

    var _GetCmdFunctions = function() {
        return {
            'create': 'normal',
            'click_main': 'normal',
            'click_createfiles': 'normal',
            'click_mergefiles': 'normal',
            'click_updatefiles': 'normal'
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
                        'container_buttons': {
                            'type': 'common',
                            'subtype': 'container',
                            'tag': 'div',
                            'data': '[button_main][button_createfiles][button_mergefiles][button_updatefiles]',
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
                            'to_plugin': 'infohub_translate',
                            'to_function': 'click'
                        },
                        'button_createfiles': {
                            'plugin': 'infohub_renderform',
                            'type': 'button',
                            'mode': 'button',
                            'button_label': _Translate('Create files Doc'),
                            'event_data': 'doc|createfiles',
                            'to_plugin': 'infohub_translate',
                            'to_function': 'click'
                        },
                        'button_mergefiles': {
                            'plugin': 'infohub_renderform',
                            'type': 'button',
                            'mode': 'button',
                            'button_label': _Translate('Merge files Doc'),
                            'event_data': 'doc|mergefiles',
                            'to_plugin': 'infohub_translate',
                            'to_function': 'click'
                        },
                        'button_updatefiles': {
                            'plugin': 'infohub_renderform',
                            'type': 'button',
                            'mode': 'button',
                            'button_label': _Translate('Update files Doc'),
                            'event_data': 'doc|updatefiles',
                            'to_plugin': 'infohub_translate',
                            'to_function': 'click'
                        }
                    },
                    'how': {
                        'mode': 'one box',
                        'text': '[container_buttons][container_doc]'
                    },
                    'where': {
                        'box_id': 'main.body.infohub_translate.form', // 'box_id': $in.parent_box_id + '.form',
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
     * Show the documentation
     * @version 2019-03-13
     * @since   2019-03-13
     * @author  Peter Lembke
     */
    $functions.push('click_main');
    var click_main = function ($in)
    {
        "use strict";
        var $default = {
            'step': 'step_render',
            'response': {
                'html': ''
            }
        };
        $in = _Default($default, $in);

        if ($in.step === 'step_render') {
            return _GetCall('infohub_translate');
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
    $functions.push('click_createfiles');
    var click_createfiles = function ($in)
    {
        "use strict";
        var $default = {
            'step': 'step_render',
            'response': {
                'html': ''
            }
        };
        $in = _Default($default, $in);

        if ($in.step === 'step_render') {
            return _GetCall('createfiles/infohub_translate_createfiles');
        }

        return {
            'answer': 'true',
            'message': 'Showed the Create files doc',
            'ok': 'true'
        };
    };

    /**
     * Show the documentation
     * @version 2019-03-13
     * @since   2019-03-13
     * @author  Peter Lembke
     */
    $functions.push('click_mergefiles');
    var click_mergefiles = function ($in)
    {
        "use strict";
        var $default = {
            'step': 'step_render',
            'response': {
                'html': ''
            }
        };
        $in = _Default($default, $in);

        if ($in.step === 'step_render') {
            return _GetCall('mergefiles/infohub_translate_mergefiles');
        }

        return {
            'answer': 'true',
            'message': 'Showed the Merge files doc',
            'ok': 'true'
        };
    };

    /**
     * Show the documentation
     * @version 2019-03-13
     * @since   2019-03-13
     * @author  Peter Lembke
     */
    $functions.push('click_updatefiles');
    var click_updatefiles = function ($in)
    {
        "use strict";
        var $default = {
            'step': 'step_render',
            'response': {
                'html': ''
            }
        };
        $in = _Default($default, $in);

        if ($in.step === 'step_render') {
            return _GetCall('updatefiles/infohub_translate_updatefiles');
        }

        return {
            'answer': 'true',
            'message': 'Showed the Update files doc',
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
    var _GetCall = function ($fileName)
    {
        "use strict";

        return _SubCall({
            'to': {
                'node': 'client',
                'plugin': 'infohub_render',
                'function': 'create'
            },
            'data': {
                'what': {
                    'my_doc': {
                        'plugin': 'infohub_translate',
                        'type': $fileName
                    }
                },
                'how': {
                    'mode': 'one box',
                    'text': '[my_doc]'
                },
                'where': {
                    'box_id': 'main.body.infohub_translate.form.[container_doc]', // 'box_id': $in.parent_box_id + '.form',
                    'max_width': 960,
                    'scroll_to_box_id': 'true'
                }
            },
            'data_back': {
                'step': 'step_end'
            }
        });
    };

}
//# sourceURL=infohub_translate_doc.js