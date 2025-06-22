/**
 * infohub_render
 * Render HTML. You give an array with instructions what to render and you get the HTML back. You can then send that to infohub_view for displaying
 *
 * @package     Infohub
 * @subpackage  infohub_render
 * @since       2014-11-01
 * @author      Peter Lembke <info@infohub.se>
 * @license     GPL-3.0-or-later
 * @copyright   Copyright (C) 2010- Peter Lembke
 * @see         https://github.com/peterlembke/infohub/blob/main/folder/plugins/infohub/render/infohub_render.md Documentation
 * @link        https://infohub.se/ InfoHub main page
 */
function infohub_render() {

    'use strict';

    // include "infohub_base.js"

    $functions.push('_Version');
    const _Version = function() {
        return {
            'date': '2017-02-12',
            'since': '2014-11-01',
            'version': '1.0.0',
            'checksum': '{{checksum}}',
            'class_name': 'infohub_render',
            'note': 'Render HTML. You give an array with instructions what to render and you get the HTML back. You can then send that to infohub_view for displaying',
            'status': 'normal',
            'SPDX-License-Identifier': 'GPL-3.0-or-later',
            'user_role': 'user',
            'web_worker': 'true',
            'core_plugin': 'false',
        };
    };

    $functions.push('_GetCmdFunctions');
    const _GetCmdFunctions = function() {
        const $list = {
            'create': 'normal',
            'load_render_cache': 'normal',
            'validate_has_data': 'removed',
            'validate_is_true': 'removed',
            'validate_is_integer': 'removed',
            'validate_form_data': 'normal',
            'get_test_options': 'normal',
            'render_options': 'normal',
            'submit': 'normal',
            'click_and_scroll': 'normal',
            'delete_render_cache_for_user_name': 'normal',
            'delete_render_cache_for_user_name_specific_plugins': 'normal',
            'set_color_schema': 'normal',
            'get_color_schema': 'normal',
            'event_message': 'normal',
        };

        return _GetCmdFunctionsBase($list);
    };

    let $renderCache = {};
    let $renderCacheLoaded = 'false';

    let $colorSchema = {};
    let $colorLookup = {};

    // ***********************************************************
    // * The private functions, add your own in your plugin
    // * These functions can be used directly in your functions.
    // * Name: _CamelCaseData
    // ***********************************************************

    /**
     * Get the html parameters: id, name, class
     * @version 2017-02-24
     * @since 2017-02-22
     * @param $in
     * @returns {string}
     * @private
     */
    $functions.push('_GetId');
    const _GetId = function($in = {}) {
        let $parameter = [];

        const $default = {
            'id': '',
            'name': '',
            'class': '',
        };
        $in = _Default($default, $in);

        if ($in.id !== '') {
            const $id = 'id="{box_id}_' + $in.id + '"';
            $parameter.push($id);
        }

        if ($in.name !== '') {
            const $name = 'name="' + $in.name + '"';
            $parameter.push($name);
        }

        if ($in.class !== '') {
            let $class = $in.class;
            if ($class.charAt(0) == parseInt($class.charAt(0))) {
                $class = 'a' + $class;
            }
            $class = 'class="' + $class + '" ';
            $parameter.push($class);
        }

        return $parameter.join(' ');
    };

    /**
     * How to display the div tag that surround the HTML contents
     * Nothing gives you a block. block gives you a block.
     * Inline is useful for HTML links and other stuff that should be inline in a text.
     * @param $in
     * @returns {string}
     * @private
     */
    $functions.push('_GetDisplay');
    const _GetDisplay = function($in = {}) {
        const $default = {
            'display': '',
        };
        $in = _Default($default, $in);

        if ($in.display === 'block') {
            return ' style="display: block;"';
        }

        if ($in.display === 'inline') {
            return ' style="display: inline;"';
        }

        return '';
    };

    $functions.push('_PopItem');
    /**
     * Pop out the first item in an object and shorten the object
     * @param $obj
     * @returns {*}
     * @private
     */
    const _PopItem = function($obj = {}) {
        let $first;

        for (let $key in $obj) {
            if ($obj.hasOwnProperty($key) && typeof ($key) !== 'function') {
                $first = $obj[$key];
                $first.alias = $key;
                delete $obj[$key];
                return $first;
            }
        }

        return {};
    };

    $functions.push('_AddStyle');
    /**
     * Add scoped style to this html
     * @param $in
     * @returns {string}
     * @private
     */
    const _AddStyle = function($in = {}) {
        const $default = {
            'html': '',
            'css_data': {},
            'alias': '',
            'display': '', // style="display: inline;" or or nothing
        };
        $in = _Default($default, $in);

        let $style = '';
        const $prefix = 'a{box_id}_' + $in.alias;

        for (let $key in $in.css_data) {
            if ($in.css_data.hasOwnProperty($key) === true) {
                let $keyCode = $key;
                if ($key === 'parent') {
                    $keyCode = '';
                }
                $style = $style + '.' + $prefix + ' ' + $keyCode + ' { ' + $in.css_data[$key] + ' } \n\r';
            }
        }
        $style = '<style scoped>' + $style + '</style>';

        let $id = _GetId({'name': $in.alias, 'class': $prefix});
        $id = $id + _GetDisplay({'display': $in.display});
        $in.html = '<span ' + $id + '>' + $style + $in.html + '</span>';

        return $in.html;
    };

    // *****************************************************************************
    // * Functions you only can reach with CMD()
    // * Observe function names are lower_case
    // *****************************************************************************

    /**
     * You give an array with what and where to view.
     * Contacts the renderers to get the html.
     * Sends the HTML to infohub_view.
     * This is for filling ONE div-box in View.
     * @version 2015-03-31
     * @since   2015-02-15
     * @author  Peter Lembke
     */
    $functions.push('create');
    const create = function($in = {}) {
        let $data, $key, $response, $plugin;

        const $default = {
            'what': {},
            'how': {
                'mode': 'one box', // Insert all rendered HTML in 'one box' or 'separate boxes'
                'text': '',
                'css_data': {},
            },
            'where': {
                'mode': 'view', // view = show on screen, html = return the html
                'box_id': '', // Will be parsed into a box_id. Original will be copied to where.original_box_id.
                'original_box_id': '',
                'parent_box_id': '',
                'box_position': 'last',
                'box_alias': 'rendered_data',
                'max_width': 0,
                'scroll_to_box_id': 'false', // Scroll to this box after render
                'scroll_to_bottom_box_id': 'false', // Put box lower edge to viewport lower edge after render
                'set_visible': '', // true, false, or empty string
                'throw_error_if_box_is_missing': 'true',
            },
            'cache_key': '',
            'alias': '', // Used by high level renderers where.mode = 'html' to make box_id unique
            'step': 'step_load_cache',
            'from_plugin': {
                'node': '',
                'plugin': '',
            },
            'config': {
                'use_render_cache': 'true',
                'store_render_cache': 'true',
                'user_name': '',
            },
            'data_back': {
                'original_in': {},
                'need_options': {},
                'mass_create': {},
                'latest_popped_item': {},
                'what_done': {}, // All rendered from 'what'
                'css_all': {},
                'display': '', // inline, block, none, or leave blank
                'css_data': {},
                'frog': 'false',
                'item_index': {},
                'step': '',
            },
            'response': {},
        };
        $in = _Default($default, $in);

        let $cacheKey = '';

        if ($in.cache_key !== '' && $in.config.use_render_cache === 'true') {
            $cacheKey = 'infohub_render/cache'
                + '/' + $in.config.user_name
                + '/' + $in.from_plugin.node
                + '/' + $in.from_plugin.plugin
                + '/' + $in.cache_key;
        }

        let $messages = [];

        if ($in.step === 'step_load_cache') {
            if ($renderCacheLoaded === 'false' &&
                $in.config.store_render_cache === 'true'
            ) {
                $renderCacheLoaded = 'true';
                let $originalIn = _ByVal($in);

                return _SubCall({
                    'to': {
                        'node': 'client',
                        'plugin': 'infohub_render',
                        'function': 'load_render_cache',
                    },
                    'data': {},
                    'data_back': {
                        'original_in': $originalIn,
                        'step': 'step_load_cache_response',
                    },
                });
            }

            $in.step = 'step_cache';
        }

        if ($in.step === 'step_load_cache_response') {
            $in = _ByVal($in.data_back.original_in);
            $in.step = 'step_cache';
        }

        if ($in.step === 'step_cache') {
            $in.step = 'step_parse_box_id';
            if ($cacheKey !== '' && $in.config.use_render_cache === 'true') {
                if (_IsSet($renderCache[$cacheKey]) === 'true') {
                    $data = $renderCache[$cacheKey];
                    $data.where = $in.where;
                    $in = $data;
                    // Step is now 'step_output' or 'step_return_html'
                }
            }
        }

        if ($in.step === 'step_parse_box_id') {

            $in.data_back.frog = 'false';

            if ($in.where.box_id !== '') {

                if (Number($in.where.box_id) != $in.where.box_id) {
                    // We have a box id that is not a number.
                    return _SubCall({
                        'to': {
                            'node': 'client',
                            'plugin': 'infohub_view',
                            'function': 'get_box_id',
                        },
                        'data': {
                            'box_id': $in.where.box_id,
                        },
                        'data_back': {
                            'what': $in.what,
                            'how': $in.how,
                            'where': $in.where,
                            'alias': $in.alias,
                            'cache_key': $in.cache_key,
                            'frog': $in.data_back.frog,
                            'step': 'step_parse_box_id_response',
                        },
                    });
                }
            }

            $in.step = 'step_prepare_items';
        }

        if ($in.step === 'step_parse_box_id_response') {
            $in.where.original_box_id = $in.where.box_id;
            $in.where.box_id = $in.response.box_id;
            $in.step = 'step_prepare_items';
        }

        if ($in.step === 'step_prepare_items') {

            let $massCreatePluginNameIndexed = {};
            let $needOptionsItemNameIndexed = {};

            for (const $itemName in $in.what) {
                if ($in.what.hasOwnProperty($itemName) === false) {
                    continue;
                }

                let $data = $in.what[$itemName];

                if (_IsSet($data.type) === 'false') {
                    $data.type = 'frog';
                    $in.data_back.frog = 'true';
                }

                if (_IsSet($data.alias) === 'false') {
                    $data.alias = $itemName;
                }

                if (_IsSet($data.original_alias) === 'false') {
                    $data.original_alias = $data.alias;
                }

                if (_IsSet($data.plugin_name) === 'false') {
                    $data.plugin_name = $in.from_plugin.plugin;
                }

                if (typeof $data.plugin !== 'undefined') {
                    // We have a high level renderer
                    // We will modify our tags to prevent naming interference before we call the high level renderer.
                    for (const $key in $data) {
                        if ($data.hasOwnProperty($key) === true) {
                            $data[$key] = _Replace('[', '[*', $data[$key]);
                        }
                    }
                } else {
                    // We have a low level renderer
                    $data.plugin = 'infohub_render_' + $data.type;
                }

                if (_IsSet($massCreatePluginNameIndexed[$data.plugin]) === 'false') {
                    $massCreatePluginNameIndexed[$data.plugin] = {};
                }

                $massCreatePluginNameIndexed[$data.plugin][$itemName] = $data;

                const $sourceIsSet = _IsSet($data.source_plugin) === 'true' && $data.source_plugin !== '';
                const $optionsAreEmpty = _IsSet($data.options) === 'true' && $data.options === [];

                if ($sourceIsSet || $optionsAreEmpty) {
                    const $default = {
                        'plugin': $data.plugin,
                        'item_name': $itemName,
                        'source_node': 'client',
                        'source_plugin': 'infohub_render',
                        'source_function': 'get_test_options',
                        'source_data': {}
                    };
                    $needOptionsItemNameIndexed[$itemName] = _Default($default, $data);
                }

            }

            // We are done with $in.what. We have mass_create instead
            $in.data_back.mass_create = $massCreatePluginNameIndexed;
            $in.data_back.need_options = $needOptionsItemNameIndexed;

            $in.step = 'step_call_source';
        }

        if ($in.step === 'step_call_source_response') {
            const $data = _ByVal($in.data_back.latest_popped_item);
            $in.data_back.mass_create[$data.plugin][$data.item_name].options = _ByVal($in.response.options);
            $in.step = 'step_call_source';
        }

        if ($in.step === 'step_call_source') {
            // We are here because the form element need options, but they are empty.
            // There is a source_plugin and source_function that can provide the missing options.
            if (_Count($in.data_back.need_options) > 0) {

                const $data = _PopItem($in.data_back.need_options);

                return _SubCall({
                    'to': {
                        'node': $data.source_node,
                        'plugin': $data.source_plugin,
                        'function': $data.source_function,
                    },
                    'data': $data.source_data,
                    'data_back': {
                        'how': $in.how,
                        'where': $in.where,
                        'alias': $in.alias,
                        'cache_key': $in.cache_key,
                        'need_options': $in.data_back.need_options,
                        'mass_create': $in.data_back.mass_create,
                        'step': 'step_call_source_response',
                        'css_all': $in.data_back.css_all,
                        'latest_popped_item': $data,
                        'frog': $in.data_back.frog,
                    },
                });
            }

            $in.step = 'step_mass_create';
        }

        if ($in.step === 'step_mass_create_response') {
            const $default = {
                'item_index': {},
                'answer': '-',
                'message': ''
            };
            $in.response = _Default($default, $in.response);

            if ($in.response.answer === 'false') {
                // The plugin did not exist. We will get $oneRenderedItem.answer = 'false',
                // and that will substitute all items into frogs
                $in.response.item_index = _ByVal($in.data_back.item_index);
            }

            for (const $itemName in $in.response.item_index) {
                if ($in.response.item_index.hasOwnProperty($itemName) === false) {
                    continue;
                }

                let $oneRenderedItem = $in.response.item_index[$itemName];
                const $default = {
                    'answer': 'false',
                    'message': '',
                    'html': '',
                    'css_data': {},
                    'display': '',
                };
                $oneRenderedItem = _Default($default, $oneRenderedItem);

                if ($oneRenderedItem.answer === 'true') {
                    if (_Empty($oneRenderedItem.css_data) === 'false') {
                        $oneRenderedItem.html = _AddStyle({
                            'html': $oneRenderedItem.html,
                            'css_data': $oneRenderedItem.css_data,
                            'alias': $itemName,
                            'display': $oneRenderedItem.display,
                        });
                    }

                    $in.data_back.what_done[$itemName] = $oneRenderedItem.html;

                } else {
                    $in.data_back.frog = 'true';
                    if (_IsSet($in.data_back.mass_create['infohub_render_frog']) === 'false') {
                        $in.data_back.mass_create['infohub_render_frog'] = {};
                    }
                    if (_IsSet($in.data_back.mass_create['infohub_render_frog'][$itemName]) === 'false') {
                        $in.data_back.mass_create['infohub_render_frog'][$itemName] = {
                            'type': 'frog'
                        };
                    }
                }
            }

            $in.step = 'step_mass_create';
        }

        if ($in.step === 'step_mass_create') {

            if (_Count($in.data_back.mass_create) > 0) {

                const $massCreateOnePlugin = _Pop($in.data_back.mass_create);
                const $pluginName = $massCreateOnePlugin.key;
                const $massCreateOnePluginItemIndex = $massCreateOnePlugin.data;
                $in.data_back.mass_create = $massCreateOnePlugin.object;

                return _SubCall({
                    'to': {
                        'node': 'client',
                        'plugin': $pluginName,
                        'function': 'create',
                    },
                    'data': {
                        'item_index': $massCreateOnePluginItemIndex,
                    },
                    'data_back': {
                        'how': $in.how,
                        'where': $in.where,
                        'alias': $in.alias,
                        'cache_key': $in.cache_key,
                        'what_done': $in.data_back.what_done,
                        'mass_create': $in.data_back.mass_create,
                        'css_all': $in.data_back.css_all,
                        'frog': $in.data_back.frog,
                        'item_index': $massCreateOnePluginItemIndex,
                        'step': 'step_mass_create_response',
                    },
                });
            }

            $in.step = 'step_how'; // We have no more items to render, let's continue with the next step.
        }

        if ($in.step === 'step_how') {
            if ($in.how.mode === 'one box') {
                // The how.text contain "[my_item_name]" and from there the final HTML will be rendered.
                return _SubCall({
                    'to': {
                        'node': 'client',
                        'plugin': 'infohub_render_text',
                        'function': 'create',
                    },
                    'data': {
                        'item_index': {
                            'text': {
                                'what_done': $in.data_back.what_done,
                                'alias': $in.alias,
                                'text': $in.how.text,
                                'class': '',
                            },
                        },
                    },
                    'data_back': {
                        'how': $in.how,
                        'where': $in.where,
                        'alias': $in.alias,
                        'cache_key': $in.cache_key,
                        'css_all': $in.data_back.css_all,
                        'frog': $in.data_back.frog,
                        'step': 'step_how_response',
                    },
                });
            }

            $in.step = 'step_where'; // No more rendering, we take what we have
        }

        if ($in.step === 'step_how_response') {
            let $itemDone = _GetData({
                'name': 'response/item_index/text', // example: "response/data/checksum"
                'default': '',
                'data': $in, // an object with data where you want to pull out a part of it
                'split': '/', // If name naturally contain / then use pipe | instead
            });

            const $default = {
                'answer': 'false',
                'message': '',
                'html': '',
                'css_data': {},
                'display': '',
            };
            $itemDone = _Default($default, $itemDone);
            $in.html = $itemDone.html;

            if (_Empty($in.how.css_data) === 'false') {
                $in.html = _AddStyle({
                    'html': $in.html,
                    'css_data': $in.how.css_data,
                    'alias': $in.alias,
                    'display': $itemDone.display,
                });
            }

            $in.step = 'step_where';
        }

        if ($in.step === 'step_where') {

            $in.step = 'step_output';

            $in.html = _SubstituteColours($in.html);

            if ($in.where.mode === 'html') {
                // We now restore our tags after calling the high-end renderer
                $in.html = _Replace('[*', '[', $in.html);

                if (_Empty($in.alias) === 'false') {
                    // All IDs become unique by inserting the parent alias in each ID.
                    const $find = '{box_id}';
                    const $replace = $find + '_' + $in.alias;
                    $in.html = $in.html.replace(new RegExp($find, 'g'), $replace);
                }

                $in.step = 'step_return_html'; // Just return the HTML to the caller
            }

            if ($cacheKey !== '' && $in.config.use_render_cache === 'true') {

                let $dataBack = _ByVal($in);
                $renderCache[$cacheKey] = $dataBack;

                if ($in.config.store_render_cache === 'true') {
                    const $messageOut = _SubCall({
                        'to': {
                            'node': 'client',
                            'plugin': 'infohub_storage',
                            'function': 'write',
                        },
                        'data': {
                            'path': $cacheKey,
                            'data': $dataBack,
                        },
                        'data_back': {
                            'step': 'step_end',
                        },
                    });
                    $messages.push($messageOut);
                }
            }
        }

        if ($in.step === 'step_output') {

            $in.step = 'step_boxes_insert'; // Insert all rendered HTML in 'separate boxes'

            if ($in.how.mode === 'one box') {
                $in.step = 'step_box_insert'; // Insert the rendered HTML in 'one box'
                if (_Empty($in.where.box_id) === 'false') {
                    $in.step = 'box_update';
                }
            }

        }

        if ($in.step === 'step_box_insert') {
            $response = internal_FixBase64Data({'html': $in.html});
            $in.html = $response.html;
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_view',
                    'function': 'box_insert',
                },
                'data': {
                    'parent_box_id': $in.where.parent_box_id,
                    'box_position': $in.where.box_position,
                    'box_alias': $in.where.box_alias,
                    'max_width': $in.where.max_width,
                    'box_data': $in.html,
                    'css_all': $in.data_back.css_all,
                },
                'data_back': {
                    'step': 'step_where_response',
                    'frog': $in.data_back.frog,
                    'alias': $in.alias,
                    'where': $in.where,
                },
                'messages': $messages,
            });
        }

        if ($in.step === 'step_boxes_insert') {
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_view',
                    'function': 'boxes_insert',
                },
                'data': {
                    'parent_box_id': $in.where.parent_box_id,
                    'box_position': $in.where.box_position,
                    'box_alias': $in.where.box_alias,
                    'max_width': $in.where.max_width,
                    'boxes_data': $in.data_back.what_done,
                    'css_all': $in.data_back.css_all,
                },
                'data_back': {
                    'step': 'step_where_response',
                    'frog': $in.data_back.frog,
                    'alias': $in.alias,
                    'where': $in.where,
                },
                'messages': $messages,
            });
        }

        if ($in.step === 'box_update') {
            $response = internal_FixBase64Data({'html': $in.html});
            $in.html = $response.html;
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_view',
                    'function': 'box_data',
                },
                'data': {
                    'box_id': $in.where.box_id,
                    'box_data': $in.html,
                    'max_width': $in.where.max_width,
                    'variables': {
                        'css_all': $in.data_back.css_all,
                    },
                    'throw_error_if_box_is_missing': $in.where.throw_error_if_box_is_missing,
                },
                'data_back': {
                    'step': 'step_where_response',
                    'frog': $in.data_back.frog,
                    'alias': $in.alias,
                    'where': $in.where,
                },
                'messages': $messages,
            });

        }

        if ($in.step === 'step_return_html') {
            return {
                'answer': $in.response.answer,
                'message': $in.response.message,
                'frog': $in.data_back.frog,
                'html': $in.html,
                'css_data': $in.data_back.css_all,
                'messages': $messages,
            };
        }

        if ($in.step === 'step_where_response') {
            $in.step = 'step_set_visible';

            if ($in.response.box_found === 'false') {
                $in.step = 'step_end';
            }

            if ($in.response.answer === 'false') {
                $in.step = 'step_end';
            }
        }

        if ($in.step === 'step_set_visible') {

            if ($in.where.scroll_to_box_id === 'true') {
                $in.where.set_visible = 'true'; // We can not scroll to a box that is hidden.
            }
            if ($in.where.scroll_to_bottom_box_id === 'true') {
                $in.where.set_visible = 'true'; // We can not scroll to a box that is hidden.
            }

            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_view',
                    'function': 'set_visible',
                },
                'data': {
                    'id': $in.where.box_id,
                    'set_visible': $in.where.set_visible,
                },
                'data_back': {
                    'step': 'step_set_visible_response',
                    'frog': $in.data_back.frog,
                    'alias': $in.alias,
                    'where': $in.where,
                },
            });
        }

        if ($in.step === 'step_set_visible_response') {
            $in.step = 'step_end';
            if ($in.where.scroll_to_box_id === 'true' &&
                $in.where.set_visible === 'true') {
                $in.step = 'step_scroll_to_box_id';
            }
            if ($in.where.scroll_to_bottom_box_id === 'true' &&
                $in.where.set_visible === 'true') {
                $in.step = 'step_scroll_to_bottom_box_id';
            }
        }

        if ($in.step === 'step_scroll_to_box_id') {
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_view',
                    'function': 'scroll_to_box_id',
                },
                'data': {
                    'box_id': $in.where.box_id,
                },
                'data_back': {
                    'frog': $in.data_back.frog,
                    'alias': $in.alias,
                    'step': 'step_end',
                },
            });
        }

        if ($in.step === 'step_scroll_to_bottom_box_id') {
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_view',
                    'function': 'scroll_to_bottom_box_id',
                },
                'data': {
                    'box_id': $in.where.box_id,
                },
                'data_back': {
                    'frog': $in.data_back.frog,
                    'alias': $in.alias,
                    'step': 'step_end',
                },
            });
        }

        return {
            'answer': 'true',
            'message': 'Done rendering',
            'frog': $in.data_back.frog,
        };

    };

    $functions.push('load_render_cache');
    /**
     * Load the rendering cache data from Storage
     * Loads in the background so other things can be processed
     * @version 2020-07-04
     * @since   2020-07-04
     * @author  Peter Lembke
     * @param $in
     * @returns {{answer: string, options: [{label: string, type: string, value: string}], message: string}}
     */
    const load_render_cache = function($in = {}) {
        const $default = {
            'step': 'step_load_render_cache',
            'data_back': {},
            'response': {},
            'config': {
                'user_name': '',
            },
        };
        $in = _Default($default, $in);

        let $messages = [];

        if ($in.step === 'step_load_render_cache') {

            const $messageOut = _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_storage',
                    'function': 'read_pattern',
                },
                'data': {
                    'path': 'infohub_render/cache/' + $in.config.user_name +
                        '/*',
                },
                'data_back': {
                    'step': 'step_load_render_cache_response',
                },
            });
            $messages.push($messageOut);

            return {
                'answer': 'true',
                'message': 'Will load the render cache',
                'messages': $messages,
            };
        }

        if ($in.step === 'step_load_render_cache_response') {
            const $default = {
                'answer': 'false',
                'message': '',
                'items': {},
            };
            $in.response = _Default($default, $in.response);

            $renderCache = _Merge($in.response.items, $renderCache);

            $in.step = 'step_end';
        }

        return {
            'answer': 'true',
            'message': 'Will load the render cache',
            'messages': $messages,
        };
    };

// *****************************************************************************
// * Internal function that you only can reach from internal_Cmd
// *****************************************************************************

    $functions.push('internal_FixBase64Data');
    /**
     * BASE64 encode HTML-code that are wrapped with {{* html-code *}}
     * @param $in
     * @returns {{answer: string, html: *, sections_count: *, message: string}}
     */
    const internal_FixBase64Data = function($in = {}) {
        const $default = {
            'html': '',
        };
        $in = _Default($default, $in);

        let $html = $in.html,
            $sectionsCount = 0;

        // Convert a section of the code to BASE64
        while ($html.indexOf('{{*') > -1) {
            const $start = $html.indexOf('{{*') + 3;
            const $stop = $html.indexOf('*}}', $start);
            const $part = $html.substring($start, $stop);
            const $findThis = '{{*' + $part + '*}}';
            const $htmlPart = btoa($part);
            $html = $html.split($findThis).join($htmlPart);
            $sectionsCount = $sectionsCount + 1;
        }

        return {
            'answer': 'true',
            'message': 'Finished fixing BASE64 coding on sections of the code',
            'html': $html,
            'sections_count': $sectionsCount,
        };
    };

    /**
     * A separate full check of the form data. If ANY field is invalid then valid = false is returned.
     * @param $in
     * @returns {*}
     */
    $functions.push('validate_form_data');
    const validate_form_data = function($in = {}) {
        const $default = {
            'step': 'step_loop',
            'form_data': {},
            'validated_item': {},
            'highlight_validated_form_element': 'false', // Mark the result in the HTML form
            'valid_form': 'true',
            'response': {
                'answer': 'false',
                'message': 'Nothing to report',
                'valid': 'false',
            },
        };
        $in = _Default($default, $in);

        if ($in.step === 'step_validator_response') {
            $in.step = 'step_loop';

            if ($in.response.valid === 'false') {
                $in.valid_form = 'false';
                $in.step = 'step_end';
            }

            if ($in.highlight_validated_form_element === 'true') {
                $in.step = 'step_mark';
            }

        }

        if ($in.step === 'step_mark') {
            $in.step = 'step_loop';
            const $isValid = $in.response.valid;

            if ($isValid === 'false') {
                return _SubCall({
                    'to': {
                        'node': 'client',
                        'plugin': 'infohub_view',
                        'function': 'mark_object',
                    },
                    'data': {
                        'id': $in.validated_item.id,
                        'mark': 'true',
                    },
                    'data_back': $in,
                });
            }

            if ($isValid === 'true') {
                return _SubCall({
                    'to': {
                        'node': 'client',
                        'plugin': 'infohub_view',
                        'function': 'mark_object',
                    },
                    'data': {
                        'id': $in.validated_item.id,
                        'mark': 'false',
                    },
                    'data_back': $in,
                });
            }
        }

        if ($in.step === 'step_loop') {
            while (_Count($in.form_data) > 0) {
                let $item = _PopItem($in.form_data);
                if (_Empty($item) === 'true') {
                    break;
                }

                $item = _Merge({
                    'validator_plugin': '',
                    'validator_function': '',
                }, $item);

                if ($item.validator_plugin !== '' &&
                    $item.validator_function !== '') {
                    return _SubCall({
                        'to': {
                            'node': 'client',
                            'plugin': $item.validator_plugin,
                            'function': $item.validator_function,
                        },
                        'data': {
                            'data': $item.value,
                        },
                        'data_back': {
                            'step': 'step_validator_response',
                            'validated_item': $item,
                            'form_data': $in.form_data,
                            'valid_form': $in.valid_form,
                            'highlight_validated_form_element': $in.highlight_validated_form_element,
                        },
                    });
                }
            }
        }

        return {
            'answer': 'true',
            'message': 'Finished validating the form data',
            'valid': $in.valid_form,
        };
    };

    $functions.push('get_test_options');
    /**
     * @version 2018-06-13
     * @since   2017-02-11
     * @author  Peter Lembke
     * @param $in
     * @returns {{answer: string, options: [{label: string, type: string, value: string}], message: string}}
     */
    const get_test_options = function($in = {}) {
        return {
            'answer': 'true',
            'message': 'You did not set your own source for the select so you ended up here',
            'options': [
                {
                    'type': 'option',
                    'value': 'test_option',
                    'label': 'Test option',
                },
            ],
        };
    };

    /**
     * Render options for an already existing select box
     * You give the select box id and the option source to use.
     * You get the options updated in the select box
     * The options you provide are in the normal format.
     * @version 2018-08-09
     * @since   2018-08-09
     * @author  Peter Lembke
     */
    $functions.push('render_options');
    const render_options = function($in = {}) {
        const $default = {
            'id': '',
            'source_node': '',
            'source_plugin': '',
            'source_function': '',
            'source_data': {},
            'step': 'step_start',
            'response': {
                'answer': 'false',
                'message': '',
                'options': [],
                'html': '',
                'updated': '', // true or false
            },
        };
        $in = _Default($default, $in);

        let $out = {
            'answer': 'false',
            'message': 'Nothing to report',
            'ok': 'false',
        };

        if ($in.step === 'step_start') { // Get the options from the source
            return _SubCall({
                'to': {
                    'node': $in.source_node,
                    'plugin': $in.source_plugin,
                    'function': $in.source_function,
                },
                'data': $in.source_data,
                'data_back': {
                    'step': 'step_start_response',
                    'id': $in.id,
                },
            });
        }

        if ($in.step === 'step_start_response') {
            $out.message = $in.response.message;
            $in.step = 'step_end';

            if ($in.response.answer === 'true') {
                $in.step = 'step_render_html';
            }
        }

        if ($in.step === 'step_render_html') { // Turn the options into HTML
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_render_form',
                    'function': 'render_options',
                },
                'data': {
                    'options': $in.response.options,
                },
                'data_back': {
                    'step': 'step_render_html_response',
                    'id': $in.id,
                },
            });
        }

        if ($in.step === 'step_render_html_response') {
            $out.message = $in.response.message;
            $in.step = 'step_end';

            if ($in.response.answer === 'true') {
                $in.step = 'step_view_html';
            }
        }

        if ($in.step === 'step_view_html') { // Update the select box
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_view',
                    'function': 'set_text',
                },
                'data': {
                    'id': $in.id,
                    'text': $in.response.html,
                },
                'data_back': {
                    'step': 'step_view_html_response',
                    'id': $in.id,
                },
            });
        }

        if ($in.step === 'step_view_html_response') {
            $out.message = $in.response.message;

            if ($in.response.updated === 'true') {
                $out.answer = 'true';
                $out.message = 'Done updating the select box with new options';
                $out.ok = 'true';
            }
        }

        return {
            'answer': $out.answer,
            'message': $out.message,
            'ok': $out.ok,
        };
    };

    $functions.push('submit');
    /**
     * @version 2018-06-13
     * @since   2017-02-11
     * @author  Peter Lembke
     * @param $in
     * @returns {{valid: *, answer: string, message: string, ok: *}|*}
     */
    const submit = function($in = {}) {
        const $default = {
            'parent_id': 0,
            'box_id': '',
            'step': 'step_start',
            'event_data': '',
            'to_node': '',
            'to_plugin': '',
            'to_function': '',
            'type': '',
            'event_type': '',
            'mode': '',
            'validator_plugin': '',
            'validator_function': '',
            'data_back': {},
            'response': {},
            'ok': 'true',
        };
        $in = _Merge($default, $in);

        let $answer = 'false';
        let $message = 'Nothing to report';
        let $valid = _GetData({
            'name': 'valid',
            'default': 'false',
            'data': $in.data_back,
        });

        if ($in.step === 'step_start') {
            if ($in.type === 'button' && $in.mode === 'submit') {
                $in.step = 'step_form_read';
            }
        }

        if ($in.step === 'step_form_read') {
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_view',
                    'function': 'form_read',
                },
                'data': {
                    'id': $in.box_id,
                },
                'data_back': {
                    'parent_id': $in.parent_id,
                    'box_id': $in.box_id,
                    'event_data': $in.event_data,
                    'type': $in.type,
                    'event_type': $in.event_type,
                    'mode': $in.mode,
                    'to_node': $in.to_node,
                    'to_plugin': $in.to_plugin,
                    'to_function': $in.to_function,
                    'step': 'step_form_read_response',
                },
            });
        }

        if ($in.step === 'step_form_read_response') {
            $in.step = 'step_validate_form_data';
        }

        if ($in.step === 'step_validate_form_data') {
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_render',
                    'function': 'validate_form_data',
                },
                'data': {
                    'form_data': $in.form_data,
                    'highlight_validated_form_element': 'true',
                },
                'data_back': {
                    'type': 'submit',
                    'parent_id': $in.parent_id,
                    'box_id': $in.box_id,
                    'event_data': $in.event_data,
                    'event_type': $in.event_type,
                    'mode': $in.mode,
                    'to_node': $in.to_node,
                    'to_plugin': $in.to_plugin,
                    'to_function': $in.to_function,
                    'form_data': $in.response.form_data,
                    'step': 'step_validate_form_data_response',
                },
            });
        }

        if ($in.step === 'step_validate_form_data_response') {
            $in.step = 'step_send_all_form_data_to_final_destination';
            $valid = $in.response.valid;
            if ($valid === 'false' || $in.response.answer === 'false') {
                // Some form data is invalid
                $in.step = 'step_final_response';
            }
        }

        if ($in.step === 'step_send_all_form_data_to_final_destination') {
            internal_event: {

                if ($in.to_plugin === 'infohub_render') {
                    $answer = 'true';
                    $message = 'Type: ' + $in.type + ', event: ' +
                        $in.event_type + '.';
                    const $standardMessage = ' Event works but to_plugin is set to infohub_render. Set your own to_plugin.';
                    $messageArray.push(_Alert($message + $standardMessage));
                    $in.step = 'step_end';
                    break internal_event;
                }

                if (_Empty($in.to_node) === 'true') {
                    $message = 'to_node is empty';
                    break internal_event;
                }
                if (_Empty($in.to_plugin) === 'true') {
                    $message = 'to_plugin is empty';
                    break internal_event;
                }
                if (_Empty($in.to_function) === 'true') {
                    $message = 'to_function is empty';
                    break internal_event;
                }

                delete $in.step; // Do not send our step variable in the subcall.
                return _SubCall({
                    'to': {
                        'node': $in.to_node,
                        'plugin': $in.to_plugin,
                        'function': $in.to_function,
                    },
                    'data': $in, // Always define exactly what to send, do not do like I have done here.
                    'data_back': {
                        'valid': $valid,
                        'step': 'step_final_response',
                    },
                });
            }
        }

        if ($in.step === 'step_final_response') {
            $answer = 'true';
            $message = 'Done handling events in Render -> submit';

            if ($valid === 'false') {
                $message = 'Form is not valid. I have not submitted';
            }
            if ($in.response.answer === 'false') {
                $answer = 'false';
                $message = $in.response.message;
            }
            if ($in.response.answer === 'true') {
                $answer = 'true';
                $message = $in.response.message;
            }
        }

        return {
            'answer': $answer,
            'message': $message,
            'valid': $valid,
            'ok': $in.ok,
        };

    };

    /**
     * Send your event to here. It will do a sub call and then scroll to the button you pressed.
     * Useful for when you do not want to leave the focus on the button you pressed.
     * @version 2018-10-01
     * @since   2018-10-01
     * @author  Peter Lembke
     */
    $functions.push('click_and_scroll');
    const click_and_scroll = function($in = {}) {
        const $default = {
            'id': '',
            'box_id': '',
            'final_node': 'client',
            'final_plugin': '',
            'final_function': '',
            'step': 'step_start',
            'response': {},
            'custom_variables': {},
        };
        $in = _Merge($default, $in);

        if ($in.step === 'step_start') {
            return _SubCall({
                'to': {
                    'node': $in.final_node,
                    'plugin': $in.final_plugin,
                    'function': $in.final_function,
                },
                'data': $in, // Always define exactly what to send, do not do like I have done here.
                'data_back': {
                    'id': $in.id,
                    'box_id': $in.box_id,
                    'step': 'step_scroll_to_box_id',
                },
            });
        }

        if ($in.step === 'step_scroll_to_box_id') {
            if (_Empty($in.id) === 'false') {
                return _SubCall({
                    'to': {
                        'node': 'client',
                        'plugin': 'infohub_view',
                        'function': 'scroll_to_box_id',
                    },
                    'data': {
                        'box_id': $in.id,
                    },
                    'data_back': {
                        'step': 'step_end',
                    },
                });
            }
        }

        return {
            'answer': 'true',
            'message': 'Done handling events in Render -> click_and_scroll',
        };
    };

    /**
     * Delete the render cache for a user_name
     * Useful when you change language and want the cached GUI to have the right language
     * @version 2020-07-17
     * @since   2020-07-17
     * @author  Peter Lembke
     */
    $functions.push('delete_render_cache_for_user_name');
    const delete_render_cache_for_user_name = function($in = {}) {
        const $default = {
            'step': 'step_start',
            'response': {
                'answer': 'false',
                'message': '',
                'items': {},
            },
            'config': {
                'user_name': '',
            },
        };
        $in = _Default($default, $in);

        let $out = {
            'answer': 'false',
            'message': 'Could not delete the render cache for the user_name',
            'items': {},
        };

        if ($in.step === 'step_start') {
            const $path = 'infohub_render/cache/' + $in.config.user_name + '/*';

            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_storage',
                    'function': 'write_pattern',
                },
                'data': {
                    'path': $path,
                },
                'data_back': {
                    'step': 'step_response',
                },
            });
        }

        if ($in.step === 'step_response') {
            if ($in.response.answer === 'true') {
                $out.answer = 'true';
                $out.message = 'Have deleted the render cache for the user_name';

                $renderCache = {};
                $renderCacheLoaded = 'false';
            }
        }

        return {
            'answer': $out.answer,
            'message': $out.message,
            'items': $out.items,
        };
    };

    /**
     * Delete the render cache for a user_name and specific plugin names
     * Useful when you develop a specific plugin.
     * @version 2020-08-01
     * @since   2020-08-01
     * @author  Peter Lembke
     */
    $functions.push('delete_render_cache_for_user_name_specific_plugins');
    const delete_render_cache_for_user_name_specific_plugins = function($in = {}) {
        const $default = {
            'plugins': [],
            'step': 'step_purge_render_cache',
            'response': {
                'answer': 'false',
                'message': '',
                'items': {},
            },
            'config': {
                'user_name': '',
            },
        };
        $in = _Default($default, $in);

        let $out = {
            'answer': 'false',
            'message': 'Could not delete the render cache for the user_name and plugins',
        };

        if ($in.step === 'step_purge_render_cache_response') {
            $in.step = 'step_purge_render_cache';

            if ($in.response.answer === 'false') {
                $out.message = $in.response.message;
                $in.step = 'step_end';
            }
        }

        if ($in.step === 'step_purge_render_cache') {
            if (_Count($in.plugins) > 0) {
                const $pluginName = $in.plugins.pop();
                const $path = 'infohub_render/cache/' + $in.config.user_name +
                    '/client/' + $pluginName;

                _RenderCachePurgePattern($path);

                // I can not use short tail messages here since I need to know that
                // the task is done before I reload the page

                return _SubCall({
                    'to': {
                        'node': 'client',
                        'plugin': 'infohub_storage',
                        'function': 'write_pattern',
                    },
                    'data': {
                        'path': $path + '/*',
                        'data': {},
                    },
                    'data_back': {
                        'plugins': $in.plugins,
                        'step': 'step_purge_render_cache_response',
                    },
                });
            }

            $in.step = 'step_response';
        }

        if ($in.step === 'step_response') {
            if ($in.response.answer === 'true') {
                $out.answer = 'true';
                $out.message = 'Have deleted the render cache for the user_name and plugins';
            }
        }

        return {
            'answer': $out.answer,
            'message': $out.message,
        };
    };

    /**
     * Remove render cache from class variable that match the pattern
     *
     * @param $pattern
     * @private
     */
    const _RenderCachePurgePattern = function($pattern = '') {
        let $newRenderCache = $renderCache;
        $pattern = $pattern + '/';

        for (let $path in $renderCache) {
            if ($path.indexOf($pattern) === 0) {
                delete ($newRenderCache[$path]);
            }
        }
        $renderCache = $newRenderCache;
    };

    $functions.push('set_color_schema');
    /**
     * Set the color schema that will be used to set all colors on the rendered HTML
     * @version 2020-12-27
     * @since   2020-12-27
     * @author  Peter Lembke
     * @param $in
     * @returns {{answer: string, message: string}}
     */
    const set_color_schema = function($in = {}) {
        const $default = {
            'color_schema': {},
            'color_lookup': {},
            'step': 'step_store_colour_data',
        };
        $in = _Default($default, $in);

        let $messageArray = [];

        if ($in.step === 'step_store_colour_data') {

            $colorSchema = _ByVal($in.color_schema);
            $colorLookup = _ByVal($in.color_lookup);

            if (_IsSet($colorSchema['layer-0-background']) === 'true') {
                $in.step = 'step_set_colour_schema';
            }
        }

        if ($in.step === 'step_set_colour_schema') {

            const $headersRule = _SubstituteColours('color: #1b350a;');
            const $lightRule = _SubstituteColours('background-color: #6d8df7;');
            const $sanityRule = _SubstituteColours('color: #0b1f00; border-color: #6d8df7; background-color: #ff0000;');

            const $messageOut = _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_view',
                    'function': 'mass_update',
                },
                'data': {
                    'do': [
                        {
                            'func': 'SetStyle',
                            'style_name': 'backgroundColor',
                            'style_value': _GetColour('layer-0-background'),
                        },
                        {
                            'func': 'SetStyle',
                            'style_name': 'color',
                            'style_value': _GetColour('layer-2-normal-text'),
                        },
                        {
                            'func': 'SetStyleRule',
                            'sheet_id': 'infohub_global',
                            'selector': 'h1, h2, h3, h4, h5, h6, ul',
                            'rule': $headersRule,
                        },
                        {
                            'func': 'SetStyleRule',
                            'sheet_id': 'infohub_global',
                            'selector': '.light',
                            'rule': $lightRule,
                        },
                        {
                            'func': 'SetStyleRule',
                            'sheet_id': 'infohub_global',
                            'selector': '.sanity',
                            'rule': $sanityRule,
                        },
                    ],
                },
                'data_back': {
                    'step': 'step_end',
                },
            });
            $messageArray.push($messageOut);
        }

        return {
            'answer': 'true',
            'message': 'Have set the color schema',
            'messages': $messageArray,
        };
    };

    $functions.push('get_color_schema');
    /**
     * Get the current color schema that render is using when rendering HTML
     * @version 2021-01-07
     * @since   2021-01-07
     * @author  Peter Lembke
     * @param $in
     * @returns {{answer: string, message: string}}
     */
    const get_color_schema = function($in = {}) {
        const $default = {};
        $in = _Default($default, $in);

        return {
            'answer': 'true',
            'message': 'Here are the color schema',
            'data': {
                'color_schema': $colorSchema,
                'color_lookup': $colorLookup,
            },
        };
    };

    $functions.push('_GetColour');
    /**
     * Get a colour from its name
     * @version 2020-12-30
     * @since   2020-12-30
     * @author  Peter Lembke
     * @param $name
     * @returns {string|*}
     * @private
     */
    const _GetColour = function($name = '') {
        if (_IsSet($colorSchema[$name]) === 'false') {
            return '#000000';
        }

        let $originalColour = $colorSchema[$name];
        if (_IsSet($colorLookup[$originalColour]) === 'false') {
            return '#000000';
        }

        const $newColour = $colorLookup[$originalColour];

        return $newColour;
    };

    $functions.push('_SubstituteColours');
    /**
     * Substitute the colours in the html to the schema colours
     * @version 2020-12-29
     * @since   2020-12-29
     * @author  Peter Lembke
     * @param $html
     * @returns {string}
     * @private
     */
    const _SubstituteColours = function($html = '') {
        if ($html.indexOf('#') === -1) {
            return $html;
        }

        for (let $findColour in $colorLookup) {
            if ($colorLookup.hasOwnProperty($findColour) === false) {
                continue;
            }
            const $newColour = $colorLookup[$findColour];

            $html = _Replace($findColour, $newColour, $html);
        }

        return $html;
    };

    /**
     * @version 2018-06-13
     * @since   2017-02-11
     * @author  Peter Lembke
     */
    $functions.push('event_message');
    const event_message = function($in = {}) {
        let $data, $isValid;

        const $default = {
            'parent_id': 0,
            'box_id': '',
            'step': 'step_start',
            'event_data': '',
            'to_node': '',
            'to_plugin': '',
            'to_function': '',
            'type': '',
            'event_type': '',
            'mode': '',
            'validator_plugin': '',
            'validator_function': '',
            'data_back': {},
            'response': {},
            'ok': 'true',
        };
        $in = _Merge($default, $in);

        let $answer = 'true';
        let $message = 'Done handling events in Render -> event_message';
        let $messageArray = [];

        if ($in.step === 'step_start') {
            $in.step = 'step_send_data_to_final_destination';

            $data = _ByVal($in);
            delete ($data.step);

            if ($in.validator_plugin !== '' && $in.validator_function !== '') {
                $in.step = 'step_validate';
            }

            if ($in.type === 'external') {
                $in.step = 'step_external_link';
            }

            if ($in.type === 'button' && $in.event_type === 'click' &&
                $in.mode === 'submit') {
                return _SubCall({
                    'to': {
                        'node': 'client',
                        'plugin': 'infohub_render',
                        'function': 'submit',
                    },
                    'data': $data,
                    'data_back': {
                        'step': 'step_submit_response',
                    },
                });
            }

            if ($in.type === 'file') {
                return _SubCall({
                    'to': {
                        'node': 'client',
                        'plugin': 'infohub_view',
                        'function': 'file_read',
                    },
                    'data': $data, // $in.id is the important data
                    'data_back': _Merge($data, {
                        'box_id': $in.box_id,
                        'to_node': $in.to_node,
                        'to_plugin': $in.to_plugin,
                        'to_function': $in.to_function,
                        'step': 'step_file_response',
                    }),
                });
            }

            if ($in.type === 'select' && _IsSet($in.multiple) === 'true') {

                let $dataBack = {
                    'box_id': $in.box_id,
                    'id': $in.id,
                    'event_data': $in.event_data,
                    'event_type': $in.event_type,
                    'to_node': $in.to_node,
                    'to_plugin': $in.to_plugin,
                    'to_function': $in.to_function,
                    'step': 'step_select_read_multiple_response',
                };
                $dataBack = _Merge($data, $dataBack);
                delete ($dataBack.response);
                delete ($dataBack.callback_function);
                delete ($dataBack.data_back);
                delete ($dataBack.innerHTML);
                delete ($dataBack.from_plugin);
                delete ($dataBack.config);

                return _SubCall({
                    'to': {
                        'node': 'client',
                        'plugin': 'infohub_view',
                        'function': 'form_select_read',
                    },
                    'data': {
                        'id': $in.id,
                    },
                    'data_back': $dataBack,
                });
            }

        }

        if ($in.step === 'step_select_read_multiple_response') {
            $in.step = 'step_send_data_to_final_destination';
        }

        if ($in.step === 'step_file_response') {
            const $findJson = 'data:application/json;base64,';

            // If .json is unknown to server it adds .txt to file name and encode to text/plain.
            const $findText = 'data:text/plain;base64,';

            const $findMarkdown = 'data:text/markdown;base64,';

            for (let $fileNumber = 0; $fileNumber <
            $in.response.files_data.length; $fileNumber = $fileNumber + 1) {
                let $content = $in.response.files_data[$fileNumber].content;
                if (typeof $content !== 'string') {
                    continue;
                }

                const $extension = _GetExtension(
                    $in.response.files_data[$fileNumber].name);

                if ($extension === 'txt') {
                    if ($findText === $content.substring(0, $findText.length)) {
                        // Remove the text mime type and insert json instead
                        $content = $findJson + $content.substring($findText.length);
                    }
                }

                if ($findMarkdown === $content.substring(0, $findMarkdown.length)) {
                    $content = $content.substring($findMarkdown.length);
                    $content = atob($content);
                    $content = decodeURIComponent(escape($content));
                    $in.response.files_data[$fileNumber].content = $content;
                }

                if ($findJson === $content.substring(0, $findJson.length)) {
                    $content = $content.substring($findJson.length);
                    $content = atob($content);
                    $content = decodeURIComponent(escape($content));
                    $in.response.files_data[$fileNumber].content = _JsonDecode(
                        $content);
                }
            }
            $in.step = 'step_send_data_to_final_destination';
        }

        if ($in.step === 'step_submit_response') {
            $message = $in.response.message;

            $isValid = _GetData(
                {'name': 'valid', 'default': 'false', 'data': $in.response});
            if ($isValid === 'false') {
                $answer = 'false';
            }

            $in.step = 'step_end';
        }

        if ($in.step === 'step_validate') {
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': $in.validator_plugin,
                    'function': $in.validator_function,
                },
                'data': {
                    'data': $in.value,
                },
                'data_back': _Merge($in, {'step': 'step_validate_response'}),
            });
        }

        if ($in.step === 'step_validate_response') {
            $in.step = 'step_send_data_to_final_destination';
            if ($in.response.answer === 'true') {

                $isValid = $in.response.valid;

                if ($isValid === 'false') {
                    return _SubCall({
                        'to': {
                            'node': 'client',
                            'plugin': 'infohub_view',
                            'function': 'mark_object',
                        },
                        'data': {
                            'id': $in.id,
                            'mark': 'true',
                        },
                        'data_back': $in,
                    });
                }

                if ($isValid === 'true') {
                    return _SubCall({
                        'to': {
                            'node': 'client',
                            'plugin': 'infohub_view',
                            'function': 'mark_object',
                        },
                        'data': {
                            'id': $in.id,
                            'mark': 'false',
                        },
                        'data_back': $in,
                    });
                }

            }
        }

        if ($in.step === 'step_send_data_to_final_destination') {
            internal_event: {

                if ($in.to_plugin === 'infohub_render' && $in.to_function ===
                    '') {
                    $message = 'Type: ' + $in.type + ', event: ' +
                        $in.event_type + '.';
                    const $standardMessage = ' Event works but to_plugin is set to infohub_render. Set your own to_plugin.';
                    $messageArray.push(_Alert($message + $standardMessage));
                    $in.step = 'step_end';
                    break internal_event;
                }

                delete $in.step; // Do not send our step variable in the subcall.
                return _SubCall({
                    'to': {
                        'node': $in.to_node,
                        'plugin': $in.to_plugin,
                        'function': $in.to_function,
                    },
                    'data': $in, // Always define exactly what to send, do not do like I have done here.
                    'data_back': {
                        'step': 'step_send_data_to_final_destination_response',
                    },
                });
            }
        }

        if ($in.step === 'step_send_data_to_final_destination_response') {
            $answer = _GetData({
                'name': 'response/answer',
                'default': $answer,
                'data': $in,
            });
            $message = _GetData({
                'name': 'response/message',
                'default': $message,
                'data': $in,
            });
            $in.ok = _GetData({
                'name': 'response/ok',
                'default': 'true',
                'data': $in,
            });
            $in.step = 'step_end';
        }

        if ($in.step === 'step_external_link') {
            external_link: {
                if ($in.type !== 'external') {
                    break external_link;
                }
                if ($in.event_type !== 'external') {
                    break external_link;
                }
                if (_Empty($in.data) === 'true') {
                    const $text = 'The link url is empty.';
                    $messageArray.push(_Alert($text));
                    break external_link;
                }
                $data = atob($in.data);
                if ($data.toLowerCase().substring(0, 5) !== 'https') {
                    const $text = 'Please add https to your link. Do not support an unencrypted web.';
                    $messageArray.push(_Alert($text));
                    break external_link;
                }
                // It depends on the browser settings if this opens a popup or a new tab.
                window.open($data, '_blank');
                $in.step = 'step_end';
            }
        }

        return {
            'answer': $answer,
            'message': $message,
            'messages': $messageArray,
            'ok': $in.ok,
        };
    };
}

//# sourceURL=infohub_render.js