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
function infohub_demo_text() {

    "use strict";

// include "infohub_base.js"

    const _Version = function() {
        return {
            'date': '2019-03-28',
            'since': '2018-05-13',
            'version': '2.0.0',
            'checksum': '{{checksum}}',
            'class_name': 'infohub_demo_text',
            'note': 'Render a text demo for infohub_demo',
            'status': 'normal',
            'SPDX-License-Identifier': 'GPL-3.0-or-later'
        };
    };

    const _GetCmdFunctions = function() {
        const $list = {
            'create': 'normal'
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
     * @version 2016-10-16
     * @since   2016-10-16
     * @author  Peter Lembke
     */
    $functions.push('create');
    const create = function ($in)
    {
        const $default = {
            'parent_box_id': '',
            'translations': {},
            'step': 'step_start',
            'response': {
                'answer': 'false',
                'message': 'Nothing to report from infohub_demo_map'
            }
        };
        $in = _Default($default, $in);

        if ($in.step === 'step_start') 
        {
            $classTranslations = $in.translations;

            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_render',
                    'function': 'create'
                },
                'data': {
                    'what': {
                        'my_text': {
                            'type': 'text',
                            'text': "[h1][titel][/h1]\n [i][ingress][/i]\n[full_text]"
                        },
                        'titel': {
                            'type': 'common',
                            'subtype': 'value',
                            'data': _Translate('Welcome to InfoHub Demo Text')
                        },
                        'ingress': {
                            'type': 'common',
                            'subtype': 'value',
                            'data': _Translate('Plugin infohub_render_text is used in this demo. You can use text to bind together rendered objects.')
                        },
                        'full_text': {
                            'type': 'common',
                            'subtype': 'join',
                            'data0': '[columns]',
                            'data1': _Translate('The text renderer is the most important renderer of them all. It acts as the glue that combine together all the other rendered pieces.'),
                            'data2': _Translate('[h2]Built in commands[/h2] You can do this [:-)][:-(][(c)][(r)][tel][eur], you can also use [b]bold[/b], [i]italic[/i], [u]underline[/u], or a line like this [line][br]'),
                            'data3': _Translate('[h2]Columns[/h2]You can activate columns. Then you automatically get columns that your text can flow in. You can [light]highlight portions of the text like this[/light] '),
                            'data4': _Translate('and you can include other elements in your text, for example: [my_external_link].'),
                            'data5': _Translate('[h2]Zoom level[/h2]You can zoom the view in your browser. When you do that and the space is to narrow for the column, then it reduces the number of columns. You always get a readable view in all zoom levels.'),
                            'data6': _Translate('[h2]Sections[/h2]You see that the h2 sections do not wrap nice in the columns. There are css commands to fix that in most browsers. I have that on my todo list.'),
                            'data7': '[/columns]'
                        },
                        'my_external_link': {
                            'type': 'link',
                            'subtype': 'external',
                            'alias': 'my_external_link',
                            'data': 'my_external_link',
                            'show': _Translate('My external link to the ABC club'),
                            'url': 'https://www.abc.se'
                        },
                        'light': {
                            'type': 'common',
                            'subtype': 'containerStart',
                            'class': 'light',
                            'tag': 'span'
                        },
                        '/light': {
                            'type': 'common',
                            'subtype': 'containerStop',
                            'tag': 'span'
                        }
                    },
                    'how': {
                        'mode': 'one box',
                        'text': '[my_text]',
                        'css_data': {
                            '.light': 'background-color: yellow; display: inline-block;'
                        }
                    },
                    'where': {
                        'box_id': $in.parent_box_id + '.demo',
                        'max_width': 100, // means 100% so that the columns show properly
                        'scroll_to_box_id': 'true'
                    },
                    'cache_key': 'text'
                },
                'data_back': {'step': 'step_end'}
            });
        }

        return {
            'answer': $in.response.answer,
            'message': $in.response.message
        };
    };
}
//# sourceURL=infohub_demo_text.js