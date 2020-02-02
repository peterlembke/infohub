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
function infohub_configlocal_colour() {

// include "infohub_base.js"

    // ***********************************************************
    // * jshint.com options to suppress some warnings
    // ***********************************************************

    /*jshint evil:true */
    /*jshint devel:true */
    /*jslint browser: true, evil: true, plusplus: true, todo: true */

    const _Version = function() {
        return {
            'date': '2019-10-19',
            'since': '2019-10-19',
            'version': '1.0.0',
            'checksum': '{{checksum}}',
            'class_name': 'infohub_configlocal_colour',
            'note': 'Here you can set the colour schema',
            'status': 'normal',
            'license_name': 'GNU GPL 3 or later'
        };
    };

    const _GetCmdFunctions = function() {
        return {
            'create': 'normal'
        };
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
     * Get instructions and create the message to InfoHub View
     * @version 2019-10-19
     * @since   2019-10-19
     * @author  Peter Lembke
     */
    $functions.push('create');
    const create = function ($in)
    {
        "use strict";

        const $default = {
            'subtype': 'menu',
            'parent_box_id': '',
            'translations': {},
            'step': 'step_render_form',
            'response': {
                'answer': '',
                'message': '',
                'data': {}
            }
        };
        $in = _Default($default, $in);

        if ($in.step === 'step_render_form')
        {
            $classTranslations = _ByVal($in.translations);

            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_render',
                    'function': 'create'
                },
                'data': {
                    'what': {
                        'titel': {
                            'type': 'text',
                            'text': '[h1]' + _Translate('Colours') + '[/h1]'
                        },
                        'my_form': {
                            'plugin': 'infohub_renderform',
                            'type': 'form',
                            'content': '[background][text][button_text][button_background_upper][button_background_lower][borders][schema_name][submit][delete]',
                            'label': _Translate('Colour schema'),
                            'description': _Translate('Here you can modify the colour schema.')
                        },
                        'background': {
                            'plugin': 'infohub_renderform',
                            'type': 'color',
                            'label': _Translate('Background'),
                            'description': _Translate('Background colour.')
                        },
                        'text': {
                            'plugin': 'infohub_renderform',
                            'type': 'color',
                            'label': _Translate('Text'),
                            'description': _Translate('Text colour.')
                        },
                        'button_text': {
                            'plugin': 'infohub_renderform',
                            'type': 'color',
                            'label': _Translate('Button text'),
                            'description': _Translate('Button text colour.')
                        },
                        'button_background_upper': {
                            'plugin': 'infohub_renderform',
                            'type': 'color',
                            'label': _Translate('Button background 1'),
                            'description': _Translate('Button background gradient upper.')
                        },
                        'button_background_lower': {
                            'plugin': 'infohub_renderform',
                            'type': 'color',
                            'label': _Translate('Button background 2'),
                            'description': _Translate('Button background gradient lower.')
                        },
                        'borders': {
                            'plugin': 'infohub_renderform',
                            'type': 'color',
                            'label': _Translate('Borders'),
                            'description': _Translate('Borders')
                        },
                        'schema_name': {
                            'plugin': 'infohub_renderform',
                            'type': 'text',
                            'label': _Translate('Name'),
                            'description': _Translate( 'Name of this colour schema'),
                            'maxlength': '60',
                            'validator_plugin': 'infohub_validate',
                            'validator_function': 'validate_has_data',
                            'placeholder': _Translate('Write a name')
                        },
                        'submit': {
                            'plugin': 'infohub_renderform',
                            'type': 'button',
                            'mode': 'submit',
                            'button_label': _Translate('Save colour schema'),
                            'event_data': 'colour|submit',
                            'to_plugin': 'infohub_configlocal',
                            'to_function': 'click'
                        },
                        'delete': {
                            'plugin': 'infohub_renderform',
                            'type': 'button',
                            'mode': 'submit',
                            'button_label': _Translate('Delete colour schema'),
                            'event_data': 'colour|delete',
                            'to_plugin': 'infohub_configlocal',
                            'to_function': 'click'
                        }
                    },
                    'how': {
                        'mode': 'one box',
                        'text': '[titel][my_form]'
                    },
                    'where': {
                        'box_id': $in.parent_box_id + '.form',
                        'max_width': 100,
                        'scroll_to_box_id': 'true'
                    }
                },
                'data_back': {'step': 'step_end'}
            });
        }

        return {
            'answer': 'true',
            'message': 'Here are the render data'
        };
    };

}
//# sourceURL=infohub_configlocal_colour.js