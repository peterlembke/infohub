/**
 * Collection of demos to demonstrate InfoHub Client Render and View
 *
 * @author      Peter Lembke <info@infohub.se>
 * @version     2019-03-28
 * @since       2017-02-11
 * @copyright   Copyright (c) 2017, Peter Lembke
 * @license     https://opensource.org/licenses/gpl-license.php GPL-3.0-or-later
 * @see         https://github.com/peterlembke/infohub/blob/master/folder/plugins/infohub/demo/major/infohub_demo_major.md Documentation
 * @link        https://infohub.se/ InfoHub main page
 */
function infohub_demo_major() {

    "use strict";

// include "infohub_base.js"

    $functions.push('_Version');
    /**
     * Version information, used by the version function
     * @returns {{date: string, note: string, 'SPDX-License-Identifier': string, checksum: string, version: string, class_name: string, since: string, status: string}}
     * @private
     */
    const _Version = function () {
        return {
            'date': '2019-03-28',
            'since': '2017-02-11',
            'version': '1.0.0',
            'checksum': '{{checksum}}',
            'class_name': 'infohub_demo_major',
            'note': 'Collection of demos to demonstrate InfoHub Client Render and View',
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
    const _GetCmdFunctions = function () {
        const $list = {
            'create': 'normal'
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
                'message': 'Nothing to report from infohub_demo_link'
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
                        'my_presentation_box1': {
                            'plugin': 'infohub_rendermajor',
                            'type': 'presentation_box',
                            'head_label': _Translate('Put a title on it'),
                            'content_data': _Translate('My content, click to see the embedded content'),
                            'content_embed': _Translate('My embedded data'),
                            'content_embed_new_tab': '[my_external_link]'
                        },
                        'my_presentation_box2': {
                            'plugin': 'infohub_rendermajor',
                            'type': 'presentation_box',
                            'head_label': _Translate('Embeds another image'),
                            'foot_text': _Translate('Click on the image to see the embedded image'),
                            'content_data': '[image_example]',
                            'content_embed': '[image_example2]',
                            'content_embed_new_tab': '[my_external_link]'
                        },
                        'my_presentation_box3': {
                            'plugin': 'infohub_rendermajor',
                            'type': 'presentation_box',
                            'head_label': _Translate('No links, just displays an image'),
                            'content_data': '[image_example]'
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
                        'my_external_link': {
                            'type': 'link',
                            'subtype': 'external',
                            'alias': 'my_external_link',
                            'data': 'my_external_link',
                            'show': _Translate('My external link to the ABC club'),
                            'url': 'https://www.abc.se'
                        }
                    },
                    'how': {
                        'mode': 'one box',
                        'text': '[my_presentation_box1][my_presentation_box2][my_presentation_box3]'
                    },
                    'where': {
                        'box_id': $in.parent_box_id + '.demo',
                        'max_width': 100,
                        'scroll_to_box_id': 'true'
                    },
                    'cache_key': 'major'
                },
                'data_back': {
                    'step': 'step_end'
                }                
            });
        }

        return {
            'answer': $in.response.answer,
            'message': $in.response.message,
            'data': $in.response.data
        };
    };
}
//# sourceURL=infohub_demo_major.js