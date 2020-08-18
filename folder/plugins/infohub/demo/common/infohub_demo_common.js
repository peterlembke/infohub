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
function infohub_demo_common() {

    "use strict";

// include "infohub_base.js"

    const _Version = function() {
        return {
            'date': '2019-03-28',
            'since': '2017-02-11',
            'version': '1.0.0',
            'checksum': '{{checksum}}',
            'class_name': 'infohub_demo_common',
            'note': 'Collection of demos to demonstrate InfoHub Client Render and View',
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
            'parent_box_id': '',
            'translations': {},
            'step': 'step_start',
            'response': {
                'answer': 'false',
                'message': 'Nothing to report from infohub_demo_common'
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
                        'my_container': {
                            'type': 'common',
                            'subtype': 'container',
                            'alias': 'duckduckgo_container',
                            'class': 'container',
                            'tag': 'div', // span, p, div
                            'data': _Translate('Time') + ':[light][time][/light][a_legend]',
                            'visible': 'true',
                            'css_data': {
                                '.container': 'background-color: #b2de98; padding: 4px 4px 4px 4px; border: 4px solid #bdbdbd;'
                            }
                        },
                        'a_legend': {
                            'type': 'common',
                            'subtype': 'legend',
                            'alias': 'a_legend',
                            'label': _Translate('This is a legend'),
                            'data': '[my_iframe][my_icon][my_list]',
                            'class': 'fieldset'
                        },
                        'my_iframe': {
                            'type': 'common',
                            'subtype': 'iframe',
                            'alias': 'duckduckgo',
                            'height': '40px',
                            'class': 'iframe',
                            'data': 'https://duckduckgo.com/search.html?site=abc.se&prefill=Search ABC.se&kn=1',
                            'css_data': {
                                '.iframe': 'border: 2px solid #444444;'
                            }
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
                        },
                        'my_list': {
                            'type': 'common',
                            'subtype': 'list',
                            'class': 'list',
                            'option': [
                                {'label': _Translate('Does not track you') },
                                {'label': _Translate('Does not [u]sell[/u] you anything') },
                                {'label': _Translate('That is why I [:-)] like them') }
                            ],
                            'css_data': {
                                '.list': 'background-color: green; list-style-type: square;list-style-position: inside;list-style-image: none;'
                            }
                        },
                        'my_icon': {
                            'type': 'common',
                            'subtype': 'svg',
                            'data': '[my_icon_asset]',
                            'alias': 'my_icon',
                            'class': 'svg',
                            'css_data': {
                                '.svg': 'width:60px;height:60px;float:left;padding: 4px;'
                            }
                        },
                        'my_icon_asset': {
                            'plugin': 'infohub_asset',
                            'type': 'icon',
                            'asset_name': 'common/duckduckgo-v107',
                            'plugin_name': 'infohub_demo'
                        },
                        'time': {
                            'type': 'common',
                            'subtype': 'value',
                            'data': _TimeStamp()
                        },
                        'image_example': {
                            'type': 'common',
                            'subtype': 'image',
                            'data': '[image_example_asset]',
                            'class': 'image'
                        },
                        'image_example_asset': {
                            'plugin': 'infohub_asset',
                            'type': 'image',
                            'subtype': 'jpeg',
                            'asset_name': 'common/con00004',
                            'plugin_name': 'infohub_demo'
                        },
                        'image_example2': {
                            'type': 'common',
                            'subtype': 'image',
                            'data': '[image_example_asset2]',
                            'class': 'image'
                        },
                        'image_example_asset2': {
                            'plugin': 'infohub_asset',
                            'type': 'image',
                            'subtype': 'png',
                            'asset_name': 'common/con00004',
                            'plugin_name': 'infohub_demo'
                        },
                        'svg_example': {
                            'type': 'common',
                            'subtype': 'svg',
                            'data': '[svg_example_asset]'
                        },
                        'svg_example_asset': {
                            'plugin': 'infohub_asset',
                            'type': 'icon',
                            'subtype': 'svg',
                            'asset_name': 'common/duckduckgo-v107',
                            'plugin_name': 'infohub_demo'
                        },
                        'my_intro_text': {
                            'type': 'text',
                            'text': "[my_h1]\n [my_ingress]\n[my_intro_list][my_image_text][about_images_list]"
                        },
                        'my_h1': {
                            'type': 'text',
                            'text': _Translate("[h1]Common demo[/h1]")
                        },
                        'my_ingress': {
                            'type': 'text',
                            'text': _Translate("[i]Plugin infohub_render_common are used in this demo. You see a combination of what render_common can do. Here is a list what parts you see in the example:[/i]")
                        },
                        'my_image_text': {
                            'type': 'text',
                            'text': _Translate("The first image is in JPEG format 700 pixels wide 30Kb. The second image is in PNG format black&white, 240 pixels wide and 17Kb and then upscaled to 640 pixels wide. You can see several things here:")
                        },
                        'my_intro_list': {
                            'type': 'common',
                            'subtype': 'list',
                            'class': 'list',
                            'option': [
                                {'label': _Translate('list - Bullet list like this one') },
                                {'label': _Translate('value - Any value, used here for the time stamp') },
                                {'label': _Translate('image - The photo is an image, the duck too') },
                                {'label': _Translate('legend - a frame with a label. You can put things in it') },
                                {'label': _Translate('iframe - a box with 3rd party contents. Use with caution') },
                                {'label': _Translate('container - a span, div or p tag that you can put things in') }
                            ]
                        },
                        'about_images_list': {
                            'type': 'common',
                            'subtype': 'list',
                            'class': 'list',
                            'option': [
                                {'label': _Translate('Use JPEG for photographs') },
                                {'label': _Translate('Use PNG for small detailed images where you can not use SVG or JPEG') },
                                {'label': _Translate('Use a resolution close to the viewed resolution. Do not upscale. Avoid downscaling too much.') }
                            ]
                        }
                    },
                    'how': {
                        'mode': 'one box',
                        'text': '[my_intro_text][my_container][image_example][image_example2][svg_example]',
                        'css_data': {
                            '.light': 'background-color: green; display: inline-block;'
                        }
                    },
                    'where': {
                        'box_id': $in.parent_box_id + '.demo',
                        'max_width': 640,
                        'scroll_to_box_id': 'true'
                    },
                    'cache_key': 'common'
                },
                'data_back': {'step': 'step_end'}
            });
        }

        return {
            'answer': $in.response.answer,
            'message': $in.response.message,
            'data': $in.response.data
        };
    };
}
//# sourceURL=infohub_demo_common.js