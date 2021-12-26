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
function infohub_renderdocument() {

    'use strict';

// include "infohub_base.js"

    const _Version = function() {
        return {
            'date': '2019-08-09',
            'since': '2019-08-09',
            'version': '1.0.0',
            'checksum': '{{checksum}}',
            'class_name': 'infohub_renderdocument',
            'note': 'Take a markdown, parse some of it and divide into renderable parts',
            'status': 'normal',
            'SPDX-License-Identifier': 'GPL-3.0-or-later',
            'title': 'Document',
            'user_role': 'user',
            'web_worker': 'true',
            'core_plugin': 'false',
        };
    };

    const _GetCmdFunctions = function() {
        const $list = {
            'create': 'normal',
            'event_message': 'normal',
        };

        return _GetCmdFunctionsBase($list);
    };

    /**
     * Internal functions must start with a capital letter
     * Used by renderers to get a proper function name
     * @version 2016-10-16
     * @since   2016-10-16
     * @author  Peter Lembke
     * @param $text
     * @return string
     */
    const _GetFuncName = function($text) {
        let $response = '';

        const $parts = $text.split('_');

        for (let $key in $parts) {
            if ($parts.hasOwnProperty($key) === false) {
                continue;
            }

            $response = $response + $parts[$key].charAt(0).toUpperCase() +
                $parts[$key].substr(1);
        }

        return $response;
    };

    $functions.push('create');
    /**
     * Get instructions and create the html
     * @version 2020-12-19
     * @since   2013-04-15
     * @author  Peter Lembke
     * @param $in
     * @returns {{item_index: {}, answer: string, message: string}}
     */
    const create = function($in = {}) {
        const $default = {
            'item_index': {},
            'config': {},
            'data_back': {
                'item_name': '',
                'item_index_done': {},
            },
            'response': {},
            'step': 'step_create',
        };
        $in = _Default($default, $in);

        if ($in.step === 'step_create_response') {
            const $defaultResponse = {
                'answer': 'false',
                'message': '',
                'html': '',
                'css_data': {},
            };
            $in.response = _Default($defaultResponse, $in.response);
            const $itemName = $in.data_back.item_name;
            $in.data_back.item_index_done[$itemName] = $in.response;
            $in.step = 'step_create';
        }

        if ($in.step === 'step_create') {
            if (_Count($in.item_index) > 0) {
                const $itemData = _Pop($in.item_index);
                const $itemName = $itemData.key;
                let $data = $itemData.data;
                $in.item_index = $itemData.object;

                const $defaultItem = {
                    'type': 'document',
                    'alias': '',
                    'original_alias': '',
                    'text': '',
                    'html': '',
                    // 'class': '', // Let the child handle the class
                    'css_data': {},
                };
                $data = _Merge($defaultItem, $data);

                $data.func = _GetFuncName($data.type);
                $data.type = '';
                $data.config = $in.config;

                const $response = internal_Cmd($data);

                return _SubCall({
                    'to': {
                        'node': 'client',
                        'plugin': 'infohub_render',
                        'function': 'create',
                    },
                    'data': {
                        'what': $response.what,
                        'how': $response.how,
                        'where': $response.where,
                        'alias': $data.alias,
                        'css_data': $response.css_data,
                    },
                    'data_back': {
                        'item_index': $in.item_index,
                        'item_name': $itemName,
                        'item_index_done': $in.data_back.item_index_done,
                        'step': 'step_create_response',
                    },
                });
            }
            $in.step = 'step_end';
        }

        return {
            'answer': 'true',
            'message': 'Here is what I rendered',
            'item_index': $in.data_back.item_index_done,
        };
    };

    /**
     * Event links end up here
     * @version 2019-08-17
     * @since   2013-08-17
     * @author  Peter Lembke
     */
    $functions.push('event_message'); // Enable this function
    const event_message = function($in = {}) {
        const $default = {
            'final_node': 'client',
            'final_plugin': '',
            'final_function': '',
            'alias': '',
            'event_data': '',
            'event_type': '',
            'id': '',
            'innerHTML': '',
            'parent_box_id': '',
            'parent_id': '',
            'type': '',
            'data': '',
            'step': 'step_start',
            'response': {
                'answer': 'false',
                'message': 'Nothing to report from infohub_renderdocument -> event_message',
            },
        };
        $in = _Merge($default, $in);

        if ($in.step === 'step_start') {
            return _SubCall({
                'to': {
                    'node': $in.final_node,
                    'plugin': $in.final_plugin,
                    'function': $in.final_function,
                },
                'data': {
                    'event_type': $in.event_type,
                    'event_data': $in.event_data,
                    'innerHTML': $in.innerHTML,
                },
                'data_back': {
                    'step': 'step_final',
                },
            });
        }

        return {
            'answer': $in.answer,
            'message': $in.message,
        };
    };

    /**
     * Parse the Markdown text and divide it into blocks that can be rendered separately
     * @version 2019-07-16
     * @since   2019-07-16
     * @author  Peter Lembke
     */
    $functions.push('internal_Document');
    const internal_Document = function($in = {}) {
        const $default = {
            'text': '',
            'class': 'document',
            'css_data': {},
            'what': {},
            'step': 'step_start',
            'response': {
                'answer': '',
                'message': '',
                'data': {},
            },
        };

        $in = _Default($default, $in);

        let $text = $in.text;
        let $what = $in.what;

        if ($in.step === 'step_start') {
            $text = _Replace('[*', '[', $text);

            let $response = internal_ParseCodeSegment({
                'text': $text,
                'what': $what,
            });

            $text = $response.text;
            $what = $response.what;

            $response = internal_ParseInlineCodeSegment({
                'text': $text,
                'what': $what,
            });

            $text = $response.text;
            $what = $response.what;

            $response = internal_HandleImages({
                'text': $text,
                'what': $what,
            });

            $text = $response.text;
            $what = $response.what;

            $response = internal_HandleLinks({
                'text': $text,
                'what': $what,
            });

            $text = $response.text;
            $what = $response.what;

            $response = internal_HandleHeaders({
                'text': $text,
                'what': $what,
            });

            $text = $response.text;
            $what = $response.what;

            $response = internal_HandleStyle({
                'text': $text,
                'what': $what,
            });

            $text = $response.text;
            $what = $response.what;

            $response = internal_HandleLists({
                'text': $text,
                'what': $what,
            });

            $text = $response.text;
            $what = $response.what;

            $response = internal_HandleNewline({
                'text': $text,
            });

            $text = $response.text;

            $what.document = {
                'type': 'text',
                'text': $text,
                'class': 'text_document',
            };

            $what.light = {
                'type': 'common',
                'subtype': 'containerStart',
                'class': 'light',
                'tag': 'span',
            };

            $what['/light'] = {
                'type': 'common',
                'subtype': 'containerStop',
                'tag': 'span',
            };

        }

        let $cssData = $in.css_data;

        if ($in.class === 'document') {
            $cssData = {
                '.text_columns': 'column-width:280px; column-gap: 1em; font-size: 1em; padding: 0 0 1em;',
                '.text_document': 'font: Times;',
                '.light': 'background-color: #6d8df7; display: inline-block;',
            };
            $cssData = _MergeStringData($cssData, $in.css_data);
        }

        return {
            'answer': 'true',
            'message': 'Here are the document divided into segments',
            'what': $what,
            'how': {
                'mode': 'one box',
                'text': '[document]',
                'css_data': $cssData,
            },
            'where': {
                'mode': 'html',
            },

        };

    };

    /**
     * Pulls out the code segments from the text and substitute them with code boxes that will be rendered
     * @version 2019-08-14
     * @since   2019-07-31
     * @author  Peter Lembke
     */
    $functions.push('internal_ParseCodeSegment');
    const internal_ParseCodeSegment = function($in = {}) {
        const $default = {
            'text': '',
            'what': {},
            'step': 'step_start',
        };
        $in = _Default($default, $in);

        let $text = '';

        if ($in.step === 'step_start') {
            // Code can start with ``` and end with ```
            let $segments = $in.text.split('```');
            let $segment = '';
            let $tag = '';

            for (let $i = 0; $i < $segments.length; $i = $i + 1) {
                $segment = $segments[$i];

                if (_Empty($segment) === 'true') {
                    continue;
                }

                if ($i % 2 === 0) { // % means modulus, the rest of a division with 2
                    $text = $text + $segment;
                    continue;
                }

                $tag = 'code_' + $i;

                $segment = _SetSafeCodeCharacters($segment.trim());

                $in.what[$tag] = {
                    'type': 'common',
                    'subtype': 'codecontainer',
                    'data': $segment,
                };

                $text = $text + '[' + $tag + ']';
            }

            // In Markdown code can start with newline + 4 spaces and end with two newline. I do not support that yet.

        }

        return {
            'answer': 'true',
            'message': 'All code segments are now rendered separately',
            'text': $text,
            'what': $in.what,
        };

    };

    /**
     * Pulls out the code segments from the text and substitute them with code boxes that will be rendered
     * @version 2019-08-14
     * @since   2019-07-31
     * @author  Peter Lembke
     */
    $functions.push('internal_ParseInlineCodeSegment');
    const internal_ParseInlineCodeSegment = function($in = {}) {
        const $default = {
            'text': '',
            'what': {},
            'step': 'step_start',
        };
        $in = _Default($default, $in);

        let $text = '';

        if ($in.step === 'step_start') {
            // Code can start with ` and end with `
            let $segments = $in.text.split('`');
            let $segment = '';
            let $tag = '';

            for (let $i = 0; $i < $segments.length; $i = $i + 1) {
                $segment = $segments[$i];

                if (_Empty($segment) === 'true') {
                    continue;
                }

                if ($i % 2 === 0) { // % means modulus, the rest of a division with 2
                    $text = $text + $segment;
                    continue;
                }

                $tag = 'inline_code_' + $i;

                $segment = _SetSafeCodeCharacters($segment.trim());

                $in.what[$tag] = {
                    'type': 'common',
                    'subtype': 'codecontainer',
                    'data': $segment,
                    'tag': '', // Makes it inline
                    'class': 'code-inline',
                };

                $text = $text + '[' + $tag + ']';
            }
        }

        return {
            'answer': 'true',
            'message': 'All inline code segments are now rendered separately',
            'text': $text,
            'what': $in.what,
        };

    };

    /**
     * Set safe code characters. I do not want them to render as HTML, so I substitute them.
     * https://unicode-table.com/en/
     * @version 2019-08-18
     * @since   2019-08-18
     * @author  Peter Lembke
     */
    const _SetSafeCodeCharacters = function($text) {
        $text = _Replace('<', '&#60;', $text);
        $text = _Replace('>', '&#62;', $text);
        $text = _Replace('[', '&#91;', $text);
        $text = _Replace(']', '&#93;', $text);
        $text = _Replace('/', '&#47;', $text);

        return $text;
    };

    /**
     * Extract all image commands
     * @version 2019-08-04
     * @since   2019-08-04
     * @author  Peter Lembke
     */
    $functions.push('internal_HandleImages');
    const internal_HandleImages = function($in = {}) {
        const $default = {
            'text': '',
            'what': {},
        };
        $in = _Default($default, $in);

        let $first = 0,
            $second = 0,
            $i = 0,
            $tag = '',
            $tagPrefix = 'image_',
            $modifiedText = $in.text,
            $what = $in.what,
            $leave = 40;

        const $notFound = -1;

        while ($in.text.indexOf('](', $second) !== $notFound && $leave > 0) {
            $leave = $leave - 1;

            $second = $in.text.indexOf('](', $second);
            $first = $in.text.lastIndexOf('![', $second);

            $second = $second + 2;

            if ($first === $notFound) {
                continue;
            }

            const $label = $in.text.substr($first + 2, $second - 2 - $first - 2);

            if (_Empty($label) === 'true') {
                continue;
            }

            if ($label.indexOf('\n') !== $notFound) {
                continue;
            }

            if ($label.indexOf(']') !== $notFound) {
                continue;
            }

            $first = $in.text.indexOf(')', $second);
            if ($first === $notFound) {
                continue;
            }

            const $url = $in.text.substr($second, $first - $second);

            if (_Empty($url) === 'true') {
                continue;
            }

            if ($url.indexOf('\n') !== $notFound) {
                continue;
            }

            if ($url.indexOf('[') !== $notFound) {
                continue;
            }

            if ($url.toLowerCase().substr(0, 4) === 'http') {
                const $fullToFind = '![' + $label + '](' + $url + ')';
                const $replaceWith = '';
                $modifiedText = $modifiedText.replace($fullToFind, $replaceWith);
                $second = $second + 2;
                continue;
            }

            $i = $i + 1;
            $tag = $tagPrefix + $i;

            leave: {

                let $css = 'max-width: 640px; max-height: 640px;';
                if ($label === 'right' || $label === 'left') {
                    $css = 'float: ' + $label + '; max-width: 180px; max-height: 180px;';
                }

                let $cssData = {'.image': $css };

                if ($url.substr(0, 11) === 'data:image/') {
                    let $subtype = 'image'; // Render an image (jpeg/png) or an svg
                    if ($url.substr(12, 3) === 'svg') {
                        $subtype = 'svg';
                        $cssData = {'.svg': $css };
                    }

                    $what[$tag] = {
                        'type': 'common',
                        'subtype': $subtype,
                        'data': $url,
                        'css_data': $cssData
                    };

                    break leave;
                }

                if ($url.indexOf('/') === $notFound) {
                    // ![label](my_image)
                    $tag = $url;
                    break leave;
                }

                if ($url.indexOf('/') !== $notFound) {
                    // example: infohub_demo/asset/icon/common/duckduckgo-v107.svg
                    const $urlParts = $url.split('/');

                    const $pluginName = $urlParts.shift(); // infohub_demo
                    const $asset = $urlParts.shift(); // asset
                    const $imageOrIcon = $urlParts.shift(); // icon
                    let $assetName = $urlParts.join('/');

                    const $assetParts = $assetName.split('.');
                    $assetName = $assetParts[0]; // common/duckduckgo-v107
                    const $assetExtension = $assetParts[1]; // svg

                    let $subtype = 'image'; // Render an image (jpeg/png) or an svg
                    if ($assetParts[1] === 'svg') {
                        $subtype = 'svg';
                        $cssData = {'.svg': $css};
                    }

                    $what[$tag] = {
                        'type': 'common',
                        'subtype': $subtype,
                        'data': '[' + $tag + '_asset]',
                        'css_data': $cssData
                    };

                    $what[$tag + '_asset'] = {
                        'plugin': 'infohub_asset',
                        'type': $imageOrIcon,
                        'subtype': $assetExtension,
                        'asset_name': $assetName,
                        'plugin_name': $pluginName,
                    };

                    break leave;
                }

            }

            const $fullToFind = '![' + $label + '](' + $url + ')';
            const $replaceWith = '[' + $tag + ']';
            $modifiedText = $modifiedText.replace($fullToFind, $replaceWith);

            $second = $second + 2;
        }

        return {
            'answer': 'true',
            'message': 'Handled all images',
            'text': $modifiedText,
            'what': $what,
        };

    };

    /**
     * Extract all link commands
     * @version 2019-08-04
     * @since   2019-08-04
     * @author  Peter Lembke
     */
    $functions.push('internal_HandleLinks');
    const internal_HandleLinks = function($in = {}) {
        const $default = {
            'text': '',
            'what': {},
        };
        $in = _Default($default, $in);

        const $notFound = -1;

        let $first = 0,
            $second = 0,
            $i = 0,
            $tag = '',
            $tagPrefix = 'link_',
            $modifiedText = $in.text,
            $what = $in.what,
            $leave = 40;

        while ($in.text.indexOf('](', $second) !== $notFound && $leave > 0) {
            $leave = $leave - 1;

            $second = $in.text.indexOf('](', $second);
            $first = $in.text.lastIndexOf('[', $second);

            $second = $second + 2;

            if ($first === $notFound) {
                continue;
            }

            const $label = $in.text.substr($first + 1,
                $second - 2 - $first - 1);

            if (_Empty($label) === 'true') {
                continue;
            }

            if ($label.indexOf('\n') !== $notFound) {
                continue;
            }

            if ($label.indexOf(']') !== $notFound) {
                continue;
            }

            $first = $in.text.indexOf(')', $second);
            if ($first === $notFound) {
                continue;
            }

            const $url = $in.text.substr($second, $first - $second);

            if (_Empty($url) === 'true') {
                continue;
            }

            if ($url.indexOf('\n') !== $notFound) {
                continue;
            }

            if ($url.indexOf('[') !== $notFound) {
                continue;
            }

            $i = $i + 1;
            $tag = $tagPrefix + $i;

            let $type = 'event';
            if ($url.toLowerCase().substr(0, 4) === 'http') {
                $type = 'external';
            }

            if ($type === 'event') {
                const $urlParts = $url.split('|');

                $what[$tag] = {
                    'type': 'link',
                    'subtype': 'link',
                    'alias': $tag,
                    'event_data': $urlParts[2],
                    'show': $label,
                    'to_node': 'client',
                    'to_plugin': 'infohub_renderdocument',
                    'to_function': 'event_message', // Hard coded in the go() function
                    'final_node': 'client',
                    'final_plugin': $urlParts[0],
                    'final_function': $urlParts[1],
                    'class': 'link',
                };
            }

            if ($type === 'external') {
                $what[$tag] = {
                    'type': 'link',
                    'subtype': 'external',
                    'alias': $tag,
                    'show': $label,
                    'url': $url,
                };
            }

            const $fullToFind = '[' + $label + '](' + $url + ')';
            const $replaceWith = '[' + $tag + ']';
            $modifiedText = $modifiedText.replace($fullToFind, $replaceWith);

            $second = $second + 2;
        }

        return {
            'answer': 'true',
            'message': 'Handled all links',
            'text': $modifiedText,
            'what': $what,
        };
    };

    /**
     * Convert all header codes to h1 h2 and so on
     * @version 2019-08-14
     * @since   2019-08-14
     * @author  Peter Lembke
     */
    $functions.push('internal_HandleHeaders');
    const internal_HandleHeaders = function($in = {}) {
        const $default = {
            'text': '',
            'what': {},
        };
        $in = _Default($default, $in);

        let $modifiedText = $in.text;

        const $notFound = -1;

        for (let $i = 4; $i > 0; $i = $i - 1) {
            const $find = '#'.repeat($i) + ' ';

            let $first = 0,
                $second = 0,
                $leave = 40;

            while ($in.text.indexOf($find, $second) !== $notFound && $leave >
            0) {
                $leave = $leave - 1;

                $first = $in.text.indexOf($find, $second);
                $first = $first + $find.length;

                $second = $in.text.indexOf('\n', $first);
                if ($second === $notFound) {
                    $second = $first + $find.length;
                    continue;
                }

                const $command = $in.text.substr($first, $second - $first);

                let $id = $command.toLowerCase();
                $id = _Replace(' ', '-', $id);
                $id = ' id="' + $id + '"';

                const $findThis = $find + $command + '\n'; // Yes we will find and remove the newline at the end of the line
                const $replaceWith = '<h' + $i + $id + '>' + $command + '</h' +
                    $i + '>';
                $modifiedText = $modifiedText.replace($findThis, $replaceWith);
            }

        }

        return {
            'answer': 'true',
            'message': 'Handled all headers',
            'text': $modifiedText,
            'what': $in.what,
        };
    };

    /**
     * Convert all **bold text** to [b]bold text[/b]
     * @version 2019-08-14
     * @since   2019-08-14
     * @author  Peter Lembke
     */
    $functions.push('internal_HandleStyle');
    const internal_HandleStyle = function($in = {}) {
        const $default = {
            'text': '',
            'what': {},
        };
        $in = _Default($default, $in);

        let $text = $in.text;

        $text = _FindStyle({
            'text': $text,
            'find': '**',
            'start_tag': '[b]',
            'end_tag': '[/b]',
        });

        $text = _FindStyle({
            'text': $text,
            'find': '__',
            'start_tag': '[u]',
            'end_tag': '[/u]',
        });

        $text = _FindStyle({
            'text': $text,
            'find': '//',
            'start_tag': '[i]',
            'end_tag': '[/i]',
        });

        $text = _FindStyle({
            'text': $text,
            'find': '~~',
            'start_tag': '[strike]',
            'end_tag': '[/strike]',
        });

        $text = _FindStyle({
            'text': $text,
            'find': '^^',
            'start_tag': '[light]',
            'end_tag': '[/light]',
        });

        return {
            'answer': 'true',
            'message': 'Handled all styles in the text',
            'text': $text,
            'what': $in.what,
        };
    };

    /**
     * Find the style and swap with start tag or end tag.
     * @param $in
     * @returns {string}
     * @private
     */
    const _FindStyle = function($in = {}) {
        const $default = {
            'text': '',
            'find': '**',
            'start_tag': '[b]',
            'end_tag': '[/b]',
        };
        $in = _Default($default, $in);

        let $modifiedText = '';
        let $parts = $in.text.split($in.find);
        let $length = $parts.length;

        for (let $i = 0; $i < $length; $i = $i + 1) {
            $modifiedText = $modifiedText + $parts[$i];

            if ($i === $length - 1) {
                continue; // We want no extra tag at the end of the text
            }

            let $tag = $in.start_tag;
            if ($i % 2 === 1) {
                $tag = $in.end_tag;
            }

            $modifiedText = $modifiedText + $tag;
        }

        return $modifiedText;
    };

    /**
     * Find all lists and render them separately
     * @version 2019-08-17
     * @since   2019-08-17
     * @author  Peter Lembke
     */
    $functions.push('internal_HandleLists');
    const internal_HandleLists = function($in = {}) {
        const $default = {
            'text': '',
            'what': {},
        };
        $in = _Default($default, $in);

        let $modifiedText = $in.text,
            $first = 0,
            $second = 0,
            $i = 0,
            $leave = 40;

        const $findFirst = '\n* ',
            $findLast = '\n\n',
            $tagPrefix = 'list_',
            $notFound = -1;

        while ($in.text.indexOf($findFirst, $second) !== $notFound && $leave >
        0) {
            $leave = $leave - 1;

            $first = $in.text.indexOf($findFirst, $second);
            $first = $first + $findFirst.length;

            $second = $in.text.indexOf($findLast, $first);
            if ($second === $notFound) {
                $second = $first + $findFirst.length;
                continue;
            }

            $i = $i + 1;
            const $tag = $tagPrefix + $i;

            const $command = $in.text.substr($first, $second - $first);
            const $findThis = '\n* ' + $command + '\n';
            const $replaceWith = '[' + $tag + ']';
            $modifiedText = $modifiedText.replace($findThis, $replaceWith); // Yes we remove the newlines surrounding the list

            const $listLabels = $command.split('\n* ');

            let $option = [];
            for (let $nr = 0; $nr < $listLabels.length; $nr = $nr + 1) {
                $option.push({
                    'label': $listLabels[$nr],
                });
            }

            $in.what[$tag] = {
                'type': 'common',
                'subtype': 'list',
                'class': 'list',
                'option': $option,
            };

        }

        return {
            'answer': 'true',
            'message': 'Handled all lists',
            'text': $modifiedText,
            'what': $in.what,
        };
    };

    /**
     * Convert all new lines to br tags or else they will vanish.
     * @version 2019-08-14
     * @since   2019-08-14
     * @author  Peter Lembke
     */
    $functions.push('internal_HandleNewline');
    const internal_HandleNewline = function($in = {}) {
        const $default = {
            'text': '',
            'what': {},
        };
        $in = _Default($default, $in);

        $in.text = _Replace('\n', '<br>', $in.text);

        return {
            'answer': 'true',
            'message': 'Handled all newline',
            'text': $in.text,
        };
    };
}

//# sourceURL=infohub_renderdocument.js