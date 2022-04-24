/**    charzam_blog

 Copyright (C) 2021 Peter Lembke , CharZam soft
 the program is distributed under the terms of the GNU General Public License

 charzam_blog is free software: you can redistribute it and/or modify
 it under the terms of the GNU General Public License as published by
 the Free Software Foundation, either version 3 of the License, or
 (at your option) any later version.

 charzam_blog is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 GNU General Public License for more details.

 You should have received a copy of the GNU General Public License
 along with charzam_blog.    If not, see <https://www.gnu.org/licenses/>.
 */
function charzam_blog() {

    'use strict';

// include "infohub_base.js"

    const _Version = function() {
        return {
            'date': '2021-11-25',
            'since': '2021-11-25',
            'version': '1.0.0',
            'checksum': '{{checksum}}',
            'class_name': 'charzam_blog',
            'note': 'Blog - guests read blog posts',
            'status': 'normal',
            'SPDX-License-Identifier': 'GPL-3.0-or-later',
            'user_role': 'guest',
        };
    };

    const _GetCmdFunctions = function() {
        const $list = {
            'setup_gui': 'normal'
        };

        return _GetCmdFunctionsBase($list);
    };

    let $classTranslations = {};

    // ***********************************************************
    // * your class functions below, only use protected functions
    // ***********************************************************

    /**
     * Set up the Blog Graphical User Interface
     * One header and one box under. The box under will have tabs
     * Each tab is a feature provided by other plugins, can be child plugins.
     *
     * Tabs
     * -------
     * Latest - Display one blog post
     * Chronological - list with the latest condensed blog posts
     * Category list - List with categories. Click one to see a list with condensed blog posts
     * Tags list - Click tags - Updates a list with condensed blog posts, best matches on top
     * Search - Shows a list with condensed blog posts
     * About - Information page about this blog
     *
     * @version 2021-11-25
     * @since   2021-11-25
     * @author  Peter Lembke
     */
    $functions.push('setup_gui');
    const setup_gui = function($in = {}) {
        const $default = {
            'box_id': '',
            'step': 'step_start',
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
                    'box_mode': 'under',
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
                            'box_alias': 'header',
                            'max_width': 100,
                            'box_data': 'The header will render here',
                        },
                        {
                            'parent_box_id': $in.box_id,
                            'box_position': 'last',
                            'box_mode': 'data',
                            'box_alias': 'tabs',
                            'max_width': 100, // 100 will be translated to 100%
                            'box_data': 'The tabs will render here',
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
            $in.step = 'step_render_tabs';
        }

        if ($in.step === 'step_header') {
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'charzam_blog_header',
                    'function': 'create',
                },
                'data': {
                    'parent_box_id': $in.box_id,
                    'translations': $classTranslations,
                },
                'data_back': {
                    'box_id': $in.box_id,
                    'step': 'step_render_tabs',
                },
            });
        }

        if ($in.step === 'step_render_tabs') {

            const $tagsContent = {
                'what': {
                    'image_example': {
                        'type': 'common',
                        'subtype': 'image',
                        'data': '[image_example_asset]',
                        'class': 'image',
                    },
                    'image_example_asset': {
                        'plugin': 'infohub_asset',
                        'type': 'image',
                        'subtype': 'jpeg',
                        'asset_name': 'common/con00004',
                        'plugin_name': 'infohub_demo',
                    },
                },
                'how': {
                    'text': '[image_example]',
                },
                'cache_key': 'tags',
            };

            const $tabs = [
                {'alias': 'hot', 'label': 'Hot'}, // alias must be a single word here.
                {'alias': 'chronological', 'label': 'chronological'},
                {'alias': 'category', 'label': 'Category'},
                {'alias': 'tags', 'label': 'Tags', 'content': $tagsContent},
                {'alias': 'search', 'label': 'Search'},
                {'alias': 'about', 'label': 'About'},
            ];

            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_tabs',
                    'function': 'setup_full_tab_system',
                },
                'data': {
                    'parent_box_id': 'main.body.infohub_blog.tabs',
                    'tabs': $tabs,
                    'highlight_tab_alias': 'stat',
                },
                'data_back': {
                    'step': 'step_scroll',
                    'box_id': $boxId,
                },
            });
        }

        return {
            'answer': 'true',
            'message': 'plugin GUI is done',
        };
    };

}
//# sourceURL=charzam_blog.js
