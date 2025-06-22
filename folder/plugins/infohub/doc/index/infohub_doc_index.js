/**
 * Index
 * Render index and handle click events on the list
 *
 * @package     Infohub
 * @subpackage  infohub_doc_index
 * @since       2019-04-13
 * @author      Peter Lembke <info@infohub.se>
 * @license     GPL-3.0-or-later
 * @copyright   Copyright (C) 2010- Peter Lembke
 * @see         https://github.com/peterlembke/infohub/blob/main/folder/plugins/infohub/doc/index/infohub_doc_index.md Documentation
 * @link        https://infohub.se/ InfoHub main page
 */
function infohub_doc_index() {

    'use strict';

// include "infohub_base.js"

    const _Version = function() {
        return {
            'date': '2019-04-13',
            'since': '2019-04-13',
            'version': '1.0.0',
            'checksum': '{{checksum}}',
            'class_name': 'infohub_doc_index',
            'note': 'Render index and handle click events on the list',
            'status': 'normal',
            'SPDX-License-Identifier': 'GPL-3.0-or-later',
            'title': 'Index',
        };
    };

    const _GetCmdFunctions = function() {
        const $list = {
            'setup_gui': 'normal',
            'click_refresh': 'normal',
            'click_item': 'normal',
        };

        return _GetCmdFunctionsBase($list);
    };

    let $classTranslations = {};

    // ***********************************************************
    // * your class functions below, only declare with var
    // * Can only be reached through cmd()
    // ***********************************************************

    $functions.push('_GetBoxId');
    /**
     *
     * @param $child
     * @returns {string}
     * @private
     */
    const _GetBoxId = function($child = '') {

        if (_Empty($child) === 'true') {
            $child = 'index';
        }

        return 'main.body.infohub_doc.' + $child;
    };

    /**
     * Set up the Graphical User Interface for this child
     * Shows a major box with a title and instructions
     * In the box there are the main menu with "General doc" and "Plugin doc"
     * @version 2019-04-14
     * @since   2019-04-14
     * @author  Peter Lembke
     */
    $functions.push('setup_gui');
    const setup_gui = function($in = {}) {
        const $default = {
            'box_id': '',
            'step': 'step_start',
            'translations': {},
            'response': {
                'answer': '',
                'message': '',
                'data': {},
            },
        };
        $in = _Default($default, $in);

        if ($in.step === 'step_start') {
            $classTranslations = $in.translations;

            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_render',
                    'function': 'create',
                },
                'data': {
                    'what': {
                        'button_refresh': {
                            'plugin': 'infohub_renderform',
                            'type': 'button',
                            'mode': 'button',
                            'button_label': _Translate('UPDATE_THE_TABLE_OF_CONTENTS'),
                            'button_left_icon': '[refresh_icon]',
                            'event_data': 'infohub_doc_index|click_refresh',
                            'to_plugin': 'infohub_doc',
                            'to_function': 'event_message',
                        },
                        'refresh_icon': {
                            'type': 'common',
                            'subtype': 'svg',
                            'data': '[refresh_asset]',
                        },
                        'refresh_asset': {
                            'plugin': 'infohub_asset',
                            'type': 'icon',
                            'asset_name': 'refresh',
                            'plugin_name': 'infohub_doc',
                        },
                        'list': {
                            'type': 'common',
                            'subtype': 'container',
                            'tag': 'div',
                        },
                    },
                    'how': {
                        'mode': 'one box',
                        'text': '[button_refresh][list]',
                    },
                    'where': {
                        'box_id': _GetBoxId('index'),
                        'max_width': 0,
                        'scroll_to_box_id': 'false',
                    },
                    'cache_key': 'index',
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
     * Creates the index
     * @version 2019-06-08
     * @since 2019-05-29
     * @author Peter Lembke
     */
    $functions.push('click_refresh');
    const click_refresh = function($in = {}) {
        const $default = {
            'box_id': '',
            'step': 'step_start',
            'response': {
                'answer': 'false',
                'message': 'There was an error',
                'document_html': '',
                'ok': 'false',
            },
        };

        $in = _Default($default, $in);

        if ($in.step === 'step_start') {
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_doc_document',
                    'function': 'get_document_html',
                },
                'data': {},
                'data_back': {
                    'step': 'step_pull_out_data',
                },
            });
        }

        if ($in.step === 'step_pull_out_data') {
            let $data = [];
            let $length = $in.response.document_html.length;
            let $startHere = 0;

            let $whatLookup = {};

            do {
                const $startTag = '<h';
                const $foundStart = $in.response.document_html.indexOf($startTag, $startHere);
                if ($foundStart < 0) {
                    break;
                }

                const $endTag = '</h';
                const $foundEnd = $in.response.document_html.indexOf($endTag, $foundStart + 1);
                if ($foundEnd < 0) {
                    break;
                }

                const $part = $in.response.document_html.substring($foundStart, $foundEnd);
                if ($part === '') {
                    continue;
                }

                const $indent = $part.substring(2, 3);
                const $startIdPosition = $part.indexOf('id="') + 4;
                const $endIdPosition = $part.indexOf('">');
                const $id = $part.substring($startIdPosition, $endIdPosition);
                const $show = $part.substring($endIdPosition + 2);

                const $linkAlias = 'link_' + $id;
                const $linkReference = '[' + $linkAlias + ']';

                $data.push({
                    'indent': $indent - 1,
                    'id': $id,
                    'label': $linkReference,
                });

                $whatLookup[$linkAlias] = {
                    'type': 'link',
                    'subtype': 'navigate',
                    'show': $show,
                    'navigate_to_id': $id
                };

                $startHere = $foundEnd;

            } while ($startHere < $length);

            // Create an array suitable for use with advanced list
            let $parentLevel = 0;
            let $previousItemId = '';
            let $parent = [];
            let $option = [];

            const $separator = '|';

            for (const $key in $data) {
                if ($data.hasOwnProperty($key) === false) {
                    continue;
                }

                const $item = $data[$key];
                const $currentLevel = $item.indent;

                if ($parentLevel < $currentLevel) {
                    $parent.push($previousItemId);
                }
                if ($parentLevel > $currentLevel) {
                    $parent.pop();
                }

                $parent.push($item.id);
                $option.push({
                    'label': $item.label,
                    'level': $parent.join($separator),
                });
                $parent.pop();

                $previousItemId = $item.id;
                $parentLevel = $currentLevel;
            }

            const $headLabel = _Translate('TABLE_OF_CONTENTS');
            const $boxId = _GetBoxId('index') + '.[list]';

            $whatLookup['my_presentation_box'] = {
                'plugin': 'infohub_rendermajor',
                'type': 'presentation_box',
                'head_label': $headLabel,
                'foot_text': '',
                'content_data': '[my_list]',
            };

            $whatLookup['my_list'] = {
                'plugin': 'infohub_renderadvancedlist',
                'type': 'advanced_list',
                'subtype': 'list',
                'option': $option,
                'separator': $separator,
            };

            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_render',
                    'function': 'create',
                },
                'data': {
                    'what': $whatLookup,
                    'how': {
                        'mode': 'one box',
                        'text': '[my_presentation_box]',
                    },
                    'where': {
                        'box_id': $boxId,
                        'max_width': 320, // pixels
                    },
                },
                'data_back': {
                    'step': 'step_end',
                },
            });
        }

        return {
            'answer': $in.response.answer,
            'message': $in.response.message,
            'ok': 'true',
        };
    };

    /**
     * When you click an item from the index list it will scroll the
     * already rendered document to that title in the document
     * @version 2019-04-14
     * @since 2019-04-14
     * @author Peter Lembke
     */
    $functions.push('click_item');
    const click_item = function($in = {}) {
        const $default = {
            'box_id': '',
            'step': 'step_start',
            'response': {
                'answer': 'false',
                'message': 'There was an error',
                'ok': 'false',
                'value': [], // All selected options in select lists
            },
        };
        $in = _Default($default, $in);

        if ($in.step === 'step_start') {
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_render',
                    'function': 'create',
                },
                'data': {
                    'what': {
                        'render_document': {
                            'plugin': 'infohub_doc',
                            'type': 'document',
                            'document': 'main', // @todo Get the real document name
                        },
                    },
                    'how': {
                        'mode': 'one box',
                        'text': '[render_document]',
                    },
                    'where': {
                        'box_id': _GetBoxId('document'),
                        'max_width': 100,
                        'scroll_to_box_id': 'true',
                    },
                },
                'data_back': {
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
}

//# sourceURL=infohub_doc_index.js