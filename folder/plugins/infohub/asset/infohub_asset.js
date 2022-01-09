/**
 * Handle assets
 *
 * Plugins can ask for their assets here. All assets are synced from the server to the client
 *
 * @author      Peter Lembke <info@infohub.se>
 * @version     2019-10-27
 * @since       2017-12-23
 * @copyright   Copyright (c) 2017, Peter Lembke
 * @license     https://opensource.org/licenses/gpl-license.php GPL-3.0-or-later
 * @see         https://github.com/peterlembke/infohub/blob/master/folder/plugins/infohub/asset/infohub_asset.md Documentation
 * @link        https://infohub.se/ InfoHub main page
 */
function infohub_asset() {

    'use strict';

// include "infohub_base.js"

    $functions.push('_Version');
    /**
     * Mandatory version information
     * @returns {}
     * @private
     */
    const _Version = function() {
        return {
            'date': '2019-10-27',
            'since': '2017-12-23',
            'version': '1.1.1',
            'checksum': '{{checksum}}',
            'class_name': 'infohub_asset',
            'note': 'Plugins can ask for their assets here. All assets are synced from the server to the client',
            'status': 'normal',
            'SPDX-License-Identifier': 'GPL-3.0-or-later',
            'user_role': 'user',
            'web_worker': 'true',
            'core_plugin': 'false',
        };
    };

    $functions.push('_GetCmdFunctions');
    /**
     * Mandatory function list of public functions
     * If you do not add your public function here then it can not be used
     * @returns {object}
     * @private
     */
    const _GetCmdFunctions = function() {
        const $list = {
            'create': 'normal', // Used by infohub_render to render an asset
            'setup_gui': 'normal', // Render the graphical user interface
            'event_message': 'normal', // Will render asset meta data
            'update_all_assets': 'normal', // Use by infohub_offline and infohub_asset
            'update_all_plugin_assets': 'normal', // Use by asset owner and by infohub_asset
            'update_specific_assets': 'normal', // Use by infohub_launcher, infohub_asset. Update specific assets for several plugins
            'update_plugin_asset_index': 'normal', // Used by update_specific_assets to update each plugin asset index
            'get_plugin_assets': 'normal', // Used by asset owner and by infohub_asset. Get named assets for a plugin
            'get_asset_and_license': 'normal', // Use by asset owner and by function create to get an asset + license
        };

        return _GetCmdFunctionsBase($list);
    };

    let $loadedAsset = {};

    let $classTranslations = {};

    $functions.push('_GetGrandPluginName');
    /**
     * Get the level 1 plugin name from a plugin name
     * example: infohub_contact_menu gives you infohub_contact
     * @param {string} $pluginName
     * @returns {string}
     * @private
     */
    const _GetGrandPluginName = function($pluginName = '') {
        const $parts = $pluginName.split('_');

        if (_Count($parts) > 2) {
            return $parts[0] + '_' + $parts[1];
        }

        return $pluginName;
    };

    $functions.push('create');
    /**
     * Use this function when you want to render an asset.
     * Example: 'jamendo_asset': {'plugin': 'infohub_asset', 'type': 'icon', 'asset_name': 'audio/jamendo-music-logo', 'plugin_name': 'infohub_demo' },
     * @version 2020-12-19
     * @since   2013-04-15
     * @author  Peter Lembke
     * @param $in
     * @returns {}
     */
    const create = function($in = {}) {
        const $default = {
            'from_plugin': {
                'node': '',
                'plugin': ''
            },
            'plugin_name': '',
            'item_index': {},
            'config': {},
            'data_back': {
                'item_name': '',
                'item_data': {},
                'item_index_done': {},
            },
            'response': {
                'answer': 'false',
                'message': 'Nothing to report',
                'asset': '',
            },
            'step': 'step_create',
        };
        $in = _Default($default, $in);

        if ($in.from_plugin.node !== 'client') {
            $in.response.message = 'I only accept calls from client plugins';
            $in.step = 'step_end';
        }

        if ($in.from_plugin.plugin !== 'infohub_render') {
            $in.response.message = 'Only infohub_render is allowed to call this function.';
            $in.step = 'step_end';
        }

        if ($in.step === 'step_create_response') {
            const $defaultResponse = {
                'answer': 'false',
                'message': '',
                'asset': '',
            };
            $in.response = _Default($defaultResponse, $in.response);

            const $itemName = $in.data_back.item_name;
            $in.data_back.item_index_done[$itemName] = {
                'answer': $in.response.answer,
                'message': $in.response.message,
                'html': $in.response.asset,
                'css_data': $in.data_back.item_data.css_data,
            };
            $in.step = 'step_create';
        }

        if ($in.step === 'step_create') {
            $in.step = 'step_end';
            if (_Count($in.item_index) > 0) {
                $in.step = 'step_create_next';
            }
        }

        if ($in.step === 'step_create_next') {
            const $itemData = _Pop($in.item_index);
            const $itemName = $itemData.key;
            let $data = $itemData.data;
            $in.item_index = $itemData.object;

            if (_Empty($data.plugin_name) === 'true') {
                $data.plugin_name = _GetGrandPluginName($in.from_plugin.plugin);
            }

            const $defaultItem = {
                'plugin_name': '',
                'type': 'icon', // icon, image, audio, video.
                'subtype': 'svg',
                'asset_name': '',
                'alias': '',
                'box_id': '',
                'html': '',
                'css_data': {},
            };
            $data = _Default($defaultItem, $data);

            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_asset',
                    'function': 'get_asset_and_license',
                },
                'data': {
                    'plugin_name': $data.plugin_name,
                    'asset_name': $data.asset_name,
                    'asset_type': $data.type,
                    'extension': $data.subtype,
                },
                'data_back': {
                    'box_id': $in.box_id,
                    'item_index': $in.item_index,
                    'item_name': $itemName,
                    'item_data': $data,
                    'item_index_done': $in.data_back.item_index_done,
                    'step': 'step_create_response',
                },
            });
        }

        return {
            'answer': 'true',
            'message': 'Here is what I rendered',
            'item_index': $in.data_back.item_index_done,
        };
    };

    $functions.push('setup_gui');
    /**
     * Set up the Asset Graphical User Interface
     * One refresh button and a result container
     * @version 2020-03-22
     * @since   2020-03-22
     * @author  Peter Lembke
     * @param {object} $in
     * @returns {{}|{answer: string, messages: [], message: string}}
     */
    const setup_gui = function($in = {}) {
        const $default = {
            'box_id': '',
            'event_data': '',
            'step': 'step_start',
            'response': {},
            'data_back': {
                'to_render': {},
            },
        };
        $in = _Default($default, $in);

        if ($in.step === 'step_start') {
            let $anyRendered = 'false';
            let $toRender = {};

            for (let $pluginName in $loadedAsset) {
                if ($loadedAsset.hasOwnProperty($pluginName) === false) {
                    continue;
                }

                if ($loadedAsset[$pluginName].rendered === 'true') {
                    $anyRendered = 'true';
                }

                $toRender[$pluginName] = _ByVal($loadedAsset[$pluginName]);
            }

            $in.data_back.to_render = _ByVal($toRender);

            $in.step = 'step_box_mode';
            if ($anyRendered === 'true') {
                $in.step = 'step_render_all_major';
            }
        }

        if ($in.step === 'step_box_mode') {
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_view',
                    'function': 'box_mode',
                },
                'data': {
                    'box_id': $in.box_id,
                    'box_mode': 'side',
                    'digits': '2',
                },
                'data_back': {
                    'box_id': $in.box_id,
                    'to_render': $in.data_back.to_render,
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
                    'to_render': $in.data_back.to_render,
                    'step': 'step_get_translations_response',
                },
            });
        }

        if ($in.step === 'step_get_translations_response') {
            $classTranslations = _ByVal($in.response.data);
            $in.step = 'step_render_refresh_button';
        }

        if ($in.step === 'step_render_refresh_button') {
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_render',
                    'function': 'create',
                },
                'data': {
                    'what': {
                        'refresh': {
                            'plugin': 'infohub_renderform',
                            'type': 'button',
                            'mode': 'button',
                            'button_label': _Translate('REFRESH'),
                            'event_data': 'refresh',
                            'to_plugin': 'infohub_asset',
                            'to_function': 'setup_gui',
                        },
                    },
                    'how': {
                        'mode': 'separate boxes',
                        'text': '[refresh]',
                    },
                    'where': {
                        'parent_box_id': 'main.body.infohub_asset',
                        'max_width': 160,
                        'scroll_to_box_id': 'true',
                    },
                },
                'data_back': {
                    'box_id': $in.box_id,
                    'to_render': $in.data_back.to_render,
                    'step': 'step_render_all_major',
                },
            });
        }

        if ($in.step === 'step_render_all_major') {
            let $what = {},
                $oneMajor = {},
                $textArray = [];

            for (let $pluginName in $in.data_back.to_render) {
                if ($in.data_back.to_render.hasOwnProperty($pluginName) ===
                    false) {
                    continue;
                }

                if ($loadedAsset[$pluginName].rendered === 'true') {
                    continue; // We already have a major for this plugin
                }

                $oneMajor = {
                    'plugin': 'infohub_rendermajor',
                    'type': 'presentation_box',
                    'head_label': $pluginName,
                    'content_data': 'Assets',
                    'foot_text': '.',
                };

                $what[$pluginName] = $oneMajor;
                $textArray.push($pluginName);
                $loadedAsset[$pluginName].rendered = 'true';
            }

            if (_Count($textArray) > 0) {
                return _SubCall({
                    'to': {
                        'node': 'client',
                        'plugin': 'infohub_render',
                        'function': 'create',
                    },
                    'data': {
                        'what': $what,
                        'how': {
                            'mode': 'separate boxes',
                            'text': '[' + $textArray.join('][') + ']',
                        },
                        'where': {
                            'parent_box_id': 'main.body.infohub_asset',
                            'max_width': 640,
                            'scroll_to_box_id': 'false',
                        },
                    },
                    'data_back': {
                        'box_id': $in.box_id,
                        'to_render': $in.data_back.to_render,
                        'step': 'step_render_assets',
                    },
                });
            }

            $in.step = 'step_render_assets';
        }

        let $messageArray = [];

        if ($in.step === 'step_render_assets') {
            for (let $pluginName in $in.data_back.to_render) {
                if ($in.data_back.to_render.hasOwnProperty($pluginName) === false) {
                    continue;
                }

                let $textArray = [],
                    $what = {};

                for (let $assetPath in $in.data_back.to_render[$pluginName]) {
                    if ($in.data_back.to_render[$pluginName].hasOwnProperty($assetPath) === false) {
                        continue;
                    }

                    if ($assetPath === 'rendered') {
                        continue;
                    }

                    const $data = $in.data_back.to_render[$pluginName][$assetPath];
                    let $assetName = $data.asset_type + '-' + $data.asset_name;
                    $assetName = _Replace('/', '-', $assetName); // backslash do not work in IDs.

                    const $link = 'link_' + $assetName;
                    const $image = 'image_' + $assetName;
                    const $asset = 'asset_' + $assetName;
                    const $eventData = $pluginName + '|' + $assetPath;

                    $what[$link] = {
                        'type': 'link',
                        'subtype': 'link',
                        // 'alias': 'my_link',
                        'event_data': $eventData,
                        'show': '[' + $image + ']',
                        'to_plugin': 'infohub_asset',
                        'class': 'my_list_link',
                        'css_data': {
                            '.my_list_link': 'display: inline-block;',
                        },
                    };

                    const $imageTypes = {
                        'jpeg': 1,
                        'jpg': 1,
                        'gif': 1,
                        'png': 1,
                        'webp': 1,
                        'avif': 1,
                    };

                    let $subType = 'svg';
                    if (_IsSet($imageTypes[$data.extension]) === 'true') {
                        $subType = 'image';
                    }

                    $what[$image] = {
                        'type': 'common',
                        'subtype': $subType,
                        'alias': 'my_icon',
                        'data': '[' + $asset + ']',
                        'class': 'svg',
                        'css_data': {
                            '.svg': 'width:64px; height:64px; padding:1px; max-width:64px;',
                        },
                    };

                    $what[$asset] = {
                        'plugin': 'infohub_asset',
                        'type': $data.asset_type,
                        'subtype': $data.extension,
                        'asset_name': $data.asset_name,
                        'plugin_name': $pluginName,
                    };

                    $textArray.push($link);
                }

                const $text = '[' + $textArray.join('][') + ']';
                const $boxId = 'main.body.infohub_asset.' + $pluginName + '.[' + $pluginName + '_content]';

                const $messageOut = _SubCall({
                    'to': {
                        'node': 'client',
                        'plugin': 'infohub_render',
                        'function': 'create',
                    },
                    'data': {
                        'what': $what,
                        'how': {
                            'mode': 'one box',
                            'text': $text,
                        },
                        'where': {
                            'box_id': $boxId,
                            'max_width': 640,
                            'scroll_to_box_id': 'false',
                        },
                    },
                    'data_back': {
                        'box_id': $in.box_id,
                        'to_render': $in.data_back.to_render,
                        'step': 'step_end',
                    },
                });

                $messageArray.push($messageOut);
            }
        }

        return {
            'answer': 'true',
            'message': 'plugin GUI is done',
            'messages': $messageArray,
        };
    };

    $functions.push('event_message');
    /**
     * Render the asset meta data
     * @version 2020-03-24
     * @since   2020-03-24
     * @author  Peter Lembke
     * @param {object} $in
     * @returns {object|{answer: string, message: string}}
     */
    const event_message = function($in = {}) {
        const $default = {
            'box_id': '',
            'event_data': '',
            'step': 'step_start',
            'data_back': {
                'plugin_name': '',
                'asset_path': '',
                'asset_name': '',
                'asset_extension': '',
            },
            'response': {
                'answer': '',
                'message': '',
                'assets': {},
            },
        };
        $in = _Default($default, $in);

        if ($in.step === 'step_start') {
            let $data = $in.event_data.split('|');
            const $pluginName = $data[0];
            let $assetPath = $data[1];

            $data = $assetPath.split('.');
            const $assetName = $data[0];
            const $assetExtension = $data[1];
            const $assetLicense = $assetName + '.json';

            if ($assetExtension !== 'svg') {
                // Bitmap images are stored without extension
                $assetPath = $assetName;
            }

            let $assetList = {};
            $assetList[$assetPath] = '';
            $assetList[$assetLicense] = '';

            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_asset',
                    'function': 'get_plugin_assets',
                },
                'data': {
                    'plugin_name': $pluginName,
                    'list': $assetList,
                },
                'data_back': {
                    'step': 'step_get_assets_response',
                    'box_id': $in.box_id,
                    'event_data': $in.event_data,
                    'plugin_name': $pluginName,
                    'asset_path': $assetPath,
                    'asset_name': $assetName,
                    'asset_extension': $assetExtension,
                },
            });
        }

        if ($in.step === 'step_get_assets_response') {
            let $assetPath = $in.data_back.asset_name + '.json';

            let $data = _GetData({
                'name': 'response|assets|' + $assetPath + '|contents',
                'default': {},
                'data': $in,
                'split': '|',
            });

            const $default = {
                'publisher_name': '',
                'publisher_url': '',
                'publisher_note': '',
                'publisher_video_url': '',
                'collection_name': '',
                'collection_url': '',
                'collection_note': '',
                'license_name': '',
                'license_url': '',
                'license_note': '',
                'author_name': '',
                'author_url': '',
                'author_note': '',
                'icon_name': '',
                'icon_url': '',
                'icon_note': '',
                'derivative_work': '',
                'attribute': '{icon_name|icon_url} from {collection_name|collection_url} by {author_name|author_url} from {publisher_name|publisher_url}, License {license_name|license_url}. Derivative work: {derivative_work}',
            };

            $data = _Default($default, $data);

            const $boxId = $in.box_id + '.[' + $in.data_back.plugin_name +
                '_foot]';

            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_render',
                    'function': 'create',
                },
                'data': {
                    'what': {
                        'my_text': {
                            'type': 'text',
                            'text': '[icon_name_link] from [collection_name_link] by [author_name_link] from [publisher_name_link]. License: [license_name_link]. Derivative work: [derivative_work]',
                        },
                        'icon_name_link': {
                            'type': 'link',
                            'subtype': 'external',
                            'show': _Translate($data.icon_name),
                            'url': $data.icon_url,
                        },
                        'collection_name_link': {
                            'type': 'link',
                            'subtype': 'external',
                            'show': _Translate($data.collection_name),
                            'url': $data.collection_url,
                        },
                        'author_name_link': {
                            'type': 'link',
                            'subtype': 'external',
                            'show': _Translate($data.author_name),
                            'url': $data.author_url,
                        },
                        'publisher_name_link': {
                            'type': 'link',
                            'subtype': 'external',
                            'show': _Translate($data.publisher_name),
                            'url': $data.publisher_url,
                        },
                        'license_name_link': {
                            'type': 'link',
                            'subtype': 'external',
                            'show': _Translate($data.license_name),
                            'url': $data.license_url,
                        },
                        'derivative_work': {
                            'type': 'common',
                            'subtype': 'value',
                            'data': _Translate($data.derivative_work),
                        },
                    },
                    'how': {
                        'mode': 'one box',
                        'text': '[my_text]',
                    },
                    'where': {
                        'box_id': $boxId,
                        'max_width': 320,
                    },
                },
                'data_back': {
                    'step': 'step_end',
                },
            });
        }

        return {
            'answer': 'true',
            'message': 'Render asset data done',
        };
    };

    $functions.push('update_all_assets');
    /**
     * Requests a list of all plugins with assets. Then syncs all assets for each plugin.
     * @version 2018-10-26
     * @since 2018-10-26
     * @author Peter Lembke
     * @param {object} $in
     * @returns {{answer: string, messages: [], message: string}}
     */
    const update_all_assets = function($in = {}) {
        const $default = {
            'list': {}, // each key is a plugin name. Data is not used and can be anything.
            'step': 'step_multi_message',
            'from_plugin': {'node': '', 'plugin': ''},
            'response': {},
            'data_back': {},
            'config': { // See config file infohub_asset.json
                'download_assets': 'true',
            },
        };
        $in = _Default($default, $in);

        let $messageArray = [];
        let $answer = 'false';
        let $message = 'Nothing to report';

        if ($in.config.download_assets === 'false') {
            $message = 'Downloading assets are prevented in infohub_asset.json';
            $in.step = 'step_end';
        }

        if ($in.from_plugin.node !== 'client') {
            $message = 'I only accept calls from client plugins';
            $in.step = 'step_end';
        }

        if ($in.from_plugin.plugin !== 'infohub_asset' &&
            $in.from_plugin.plugin !== 'infohub_offline') {
            $message = 'Only infohub_asset, infohub_offline is allowed to call this function.';
            $in.step = 'step_end';
        }

        if ($in.step === 'step_multi_message') {
            $messageArray = [];
            for (let $key in $in.list) {
                if ($in.list.hasOwnProperty($key) === false) {
                    continue;
                }

                const $messageOut = _SubCall({
                    'to': {
                        'node': 'client',
                        'plugin': 'infohub_asset',
                        'function': 'update_all_plugin_assets',
                    },
                    'data': {
                        'plugin_name': $key,
                    },
                    'data_back': {
                        'step': 'step_end',
                    },
                });
                $messageArray.push($messageOut);
            }

            $answer = 'true';
            $message = 'Have sent mass message to update assets in the client storage';
            $in.step = 'step_end';
        }

        return {
            'answer': $answer,
            'message': $message,
            'messages': $messageArray,
        };
    };

    $functions.push('update_all_plugin_assets');
    /**
     * Syncs ALL assets from the server to the client for ONE plugin
     * Checksums make sure only new/changed assets are downloaded to the client
     * It is the client plugin that own the assets that can ask for a sync of its assets.
     * infohub_asset can call this function.
     *
     * @version 2017-12-23
     * @since 2017-12-23
     * @author Peter Lembke
     * @param {object} $in
     * @returns {{}|{answer: string, messages: [], message: string}}
     */
    const update_all_plugin_assets = function($in = {}) {
        const $default = {
            'plugin_name': '',
            'step': 'step_get_asset_index_from_storage',
            'from_plugin': {
                'node': '',
                'plugin': '',
            },
            'response': {
                'answer': '',
                'message': '',
                'data': {},
            },
            'data_back': {
                'plugin_name': '',
                'data': {},
            },
            'config': { // See config file infohub_asset.json
                'download_assets': 'true',
                'allowed_asset_types': {}, // empty = allow all. extension as key and some dummy data.
                'max_asset_size_kb': 0, // 0 = any size is ok
                'index_cache_seconds': 604800,
            },
        };
        $in = _Default($default, $in);

        let $index;
        let $messageArray = [];
        let $answer = 'false';
        let $message = 'Nothing to report';
        const $assetPath = 'infohub_asset/asset/';

        if ($in.config.download_assets === 'false') {
            $message = 'Downloading assets are prevented in infohub_asset.json';
            $in.step = 'step_end';
        }

        if ($in.from_plugin.node !== 'client') {
            $message = 'I only accept calls from client plugins';
            $in.step = 'step_end';
        }

        const $fromPlugin = $in.from_plugin.plugin;
        let $pluginName = _GetGrandPluginName($fromPlugin);
        if (
            $fromPlugin === 'infohub_asset' ||
            $fromPlugin === 'infohub_workbench' ||
            $fromPlugin === 'infohub_standalone' ||
            $fromPlugin === 'infohub_plugin'
        ) {
            if (_Empty($in.plugin_name) === 'false') {
                $pluginName = $in.plugin_name;
            }
        }

        if ($in.step === 'step_get_asset_index_from_storage') {
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_storage',
                    'function': 'read',
                },
                'data': {
                    'path': $assetPath + $pluginName + '/index',
                },
                'data_back': {
                    'plugin_name': $in.plugin_name,
                    'step': 'step_get_asset_index_from_storage_response',
                },
            });
        }

        if ($in.step === 'step_get_asset_index_from_storage_response') {
            $in.step = 'step_get_plugin_assets_from_server';

            const $default = {
                'micro_time': 0.0,
                'time_stamp': '',
                'checksums': {},
                'full_sync_done': 'false',
            };
            $index = _Default($default, $in.response.data);

            if ($in.response.answer === 'true') {
                const $timestampWhenOld = $index.micro_time +
                    $in.config.index_cache_seconds;

                if ($timestampWhenOld >= _MicroTime() &&
                    $index.full_sync_done === 'true') {
                    $message = 'The asset index for this plugin is quite fresh. I will not update it.';
                    $in.step = 'step_end';
                }
            }
        }

        if ($in.step === 'step_get_plugin_assets_from_server') {
            return _SubCall({
                'to': {
                    'node': 'server',
                    'plugin': 'infohub_asset',
                    'function': 'update_all_plugin_assets',
                },
                'data': {
                    'plugin_name': $pluginName,
                    'asset_checksum_array': $index.checksums,
                    'max_asset_size_kb': $in.config.max_asset_size_kb,
                    'allowed_asset_types': $in.config.allowed_asset_types,
                },
                'data_back': {
                    'plugin_name': $pluginName,
                    'step': 'step_get_plugin_assets_from_server_response',
                },
                'wait': 1.0,
            });
        }

        if ($in.step === 'step_get_plugin_assets_from_server_response') {
            $message = $in.response.message;
            $in.step = 'step_end';

            if ($in.response.answer === 'true') {
                $in.step = 'step_save_assets_in_storage';
                $in.data_back.data = $in.response.data; // Copy assets to data_back
            }
        }

        if ($in.step === 'step_save_assets_in_storage') {
            $messageArray = [];
            for (let $key in $in.data_back.data) {
                if ($in.data_back.data.hasOwnProperty($key)) {
                    const $messageOut = _SubCall({
                        'to': {
                            'node': 'client',
                            'plugin': 'infohub_storage',
                            'function': 'write',
                        },
                        'data': {
                            'path': $assetPath + $key,
                            'data': $in.data_back.data[$key],
                        },
                        'data_back': {
                            'step': 'step_end',
                        },
                    });
                    $messageArray.push($messageOut);
                }
            }
            $in.step = 'step_end';

            $answer = 'true';
            $message = 'Have sent mass messages to save all assets in the client storage';
        }

        return {
            'answer': $answer,
            'message': $message,
            'messages': $messageArray,
        };
    };

    $functions.push('update_specific_assets');
    /**
     * You give a list with assets you want to update. Can be for any plugins.
     * The checksum you provide for each asset is compared to the locally stored asset checksum.
     * Assets that do not exist will be updated by asking the server.
     * Assets that have another checksum than the one you provided will be updated.
     * This function can only be used by infohub_asset, infohub_launcher
     * @version 2020-06-03
     * @since 2018-12-02
     * @author Peter Lembke
     * @param {object} $in
     * @returns {}
     */
    const update_specific_assets = function($in = {}) {
        const $default = {
            'list': {}, // key=plugin name, data array with asset names as key and their checksum as data.
                        // Set checksum to 'local' to keep the locally stored asset.
            'step': 'step_get_assets_from_storage',
            'from_plugin': {'node': '', 'plugin': ''},
            'response': {},
            'data_back': {
                'wanted_assets': {},
            },
            'config': { // See config file infohub_asset.json
                'download_assets': 'true',
                'allowed_asset_types': {}, // empty = allow all. extension as key and some dummy data.
                'max_asset_size_kb': 0, // 0 = any size is ok
            },
        };
        $in = _Default($default, $in);

        let $answer = 'false';
        let $message = 'Nothing to report';

        if ($in.config.download_assets === 'false') {
            $message = 'Downloading assets are prevented in infohub_asset.json';
            $in.step = 'step_end';
        }

        if ($in.from_plugin.node !== 'client') {
            $message = 'I only accept calls from client plugins';
            $in.step = 'step_end';
        }

        if ($in.from_plugin.plugin !== 'infohub_asset' &&
            $in.from_plugin.plugin !== 'infohub_launcher') {
            $message = 'Only infohub_asset, infohub_launcher is allowed to call this function.';
            $in.step = 'step_end';
        }

        if ($in.step === 'step_get_assets_from_storage') {
            let $wantedAssets = {};
            let $paths = {};

            for (let $pluginName in $in.list) {
                if ($in.list.hasOwnProperty($pluginName) === false) {
                    continue;
                }

                for (let $assetName in $in.list[$pluginName]) {
                    if ($in.list[$pluginName].hasOwnProperty($assetName) ===
                        false) {
                        continue;
                    }

                    const $path = 'infohub_asset/asset/' + $pluginName + '/' + $assetName;
                    const $checksum = $in.list[$pluginName][$assetName];
                    $wantedAssets[$path] = $checksum;
                    $paths[$path] = {
                        asset_name: '',
                        checksum: '',
                        extension: '',
                        is_binary: 'false',
                        plugin_name: '',
                    };
                }
            }

            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_storage',
                    'function': 'read_many',
                },
                'data': {
                    'paths': $paths,
                },
                'data_back': {
                    'wanted_assets': $wantedAssets,
                    'config': $in.config,
                    'step': 'step_get_assets_from_storage_response',
                },
            });

        }

        if ($in.step === 'step_get_assets_from_storage_response') {
            const $default = {
                'answer': 'false',
                'message': 'Failure',
            };
            const $response = _Default($default, $in.response);

            const $localAssets = _ByVal($in.response.items);
            const $wantedAssets = _ByVal($in.data_back.wanted_assets);

            $in.step = 'step_end';

            if ($response.answer === 'true') {
                let $updateAssets = {};

                for (let $path in $wantedAssets) {
                    // If wanted asset do not exist in local storage then we add it to the list
                    if (_IsSet($localAssets[$path]) === 'false') {
                        $updateAssets[$path] = $wantedAssets[$path];
                        continue;
                    }

                    const $localChecksum = _GetData({
                        'name': 'checksum',
                        'default': '',
                        'data': $localAssets[$path],
                    });

                    if (_Empty($localChecksum) === 'false') {
                        if ($wantedAssets[$path] === 'local') {
                            // We want to keep the existing local version
                            $wantedAssets[$path] = $localChecksum;
                        }
                    }

                    if ($wantedAssets[$path] !== $localChecksum) {
                        $updateAssets[$path] = $localChecksum;
                    }
                }

                if (_Count($updateAssets) > 0) {
                    return _SubCall({
                        'to': {
                            'node': 'server',
                            'plugin': 'infohub_asset',
                            'function': 'update_specific_assets',
                        },
                        'data': {
                            'assets_requested': $updateAssets,
                            'allowed_asset_types': $in.config.allowed_asset_types,
                            'max_asset_size_kb': $in.config.max_asset_size_kb,
                        },
                        'data_back': {
                            'step': 'step_update_specific_assets_response',
                        },
                    });
                }

                $answer = 'true';
                $message = 'There were no assets to update';
            }
        }

        if ($in.step === 'step_update_specific_assets_response') {
            $in.step = 'step_save_to_storage';
            if ($in.response.answer === 'false') {
                $message = $in.response.message;
                $in.step = 'step_end';
            }
        }

        if ($in.step === 'step_save_to_storage') {
            const $data = _GetData({
                'name': 'response/data',
                'default': {},
                'data': $in,
            });

            let $pluginAssetIndex = {};
            for (let $key in $data) {
                if ($data.hasOwnProperty($key) === false) {
                    continue;
                }

                const $pluginName = $data[$key].plugin_name;

                if (_IsSet($pluginAssetIndex[$pluginName]) === 'false') {
                    $pluginAssetIndex[$pluginName] = {
                        'micro_time': $data[$key].micro_time,
                        'time_stamp': $data[$key].time_stamp,
                        'checksums': {},
                        'full_sync_done': 'false',
                    };
                }

                const $fullAssetName = $pluginName + '/' +
                    $data[$key].asset_name;
                $pluginAssetIndex[$pluginName].checksums[$fullAssetName] = $data[$key].checksum;
            }

            let $messageArrayUpdatePluginAssetIndex = [];

            for (let $pluginName in $pluginAssetIndex) {
                if ($pluginAssetIndex.hasOwnProperty($pluginName) === false) {
                    continue;
                }

                const $messageOut = _SubCall({
                    'to': {
                        'node': 'client',
                        'plugin': 'infohub_asset',
                        'function': 'update_plugin_asset_index',
                    },
                    'data': {
                        'plugin_name': $pluginName,
                        'path': 'infohub_asset/asset/' + $pluginName + '/index',
                        'index': $pluginAssetIndex[$pluginName],
                    },
                    'data_back': {
                        'step': 'step_end',
                    },
                });

                $messageArrayUpdatePluginAssetIndex.push($messageOut);
            }

            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_storage',
                    'function': 'write_many',
                },
                'data': {
                    'paths': $in.response.data,
                },
                'data_back': {
                    'step': 'step_save_to_storage_response',
                },
                'messages': $messageArrayUpdatePluginAssetIndex,
            });
        }

        if ($in.step === 'step_save_to_storage_response') {
            $answer = $in.response.answer;
            $message = $in.response.message;

            if ($answer === 'true') {
                $message = 'All requested assets are updated. The new/changed are saved to Storage';
            }
        }

        return {
            'answer': $answer,
            'message': $message,
        };
    };

    $functions.push('update_plugin_asset_index');
    /**
     * Used by update_specific_assets to update one plugin assets index
     * When we have the asset in the index it will not be downloaded again unless the server has a newer one
     * @version 2020-06-04
     * @since 2020-06-04
     * @author Peter Lembke
     * @param {object} $in
     * @returns {{answer: string, message: *, messages: Array}}
     */
    const update_plugin_asset_index = function($in = {}) {
        const $default = {
            'plugin_name': '',
            'path': '', // path to the index in the Storage
            'index': {}, // a full asset index we can store if there are no index in Storage
            'step': 'step_load_existing_index',
            'from_plugin': {'node': '', 'plugin': ''},
            'response': {},
            'data_back': {},
        };
        $in = _Default($default, $in);

        let $answer = 'false';
        let $message = 'Nothing to report';

        if ($in.from_plugin.node !== 'client') {
            $message = 'I only accept calls from client plugins';
            $in.step = 'step_end';
        }

        if ($in.from_plugin.plugin !== 'infohub_asset' &&
            $in.from_plugin.plugin !== 'infohub_launcher') {
            $message = 'Only infohub_asset, infohub_launcher is allowed to call this function.';
            $in.step = 'step_end';
        }

        if ($in.step === 'step_load_existing_index') {
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_storage',
                    'function': 'read',
                },
                'data': {
                    'path': $in.path,
                },
                'data_back': {
                    'plugin_name': $in.plugin_name,
                    'path': $in.path,
                    'index': $in.index,
                    'step': 'step_load_existing_index_response',
                },
            });
        }

        if ($in.step === 'step_load_existing_index_response') {
            let $default = {
                'answer': 'false',
                'message': '',
                'data': {
                    'micro_time': 0.0,
                    'time_stamp': '',
                    'checksums': {},
                    'full_sync_done': 'false',
                },
                'post_exist': 'false',
                'path': '',
            };
            $in.response = _Default($default, $in.response);

            $in.step = 'step_store_index';
            if ($in.response.post_exist === 'true') {
                $in.step = 'step_merge_index';
            }
        }

        if ($in.step === 'step_merge_index') {

            let $currentChecksums = _ByVal($in.response.data.checksums);
            let $newChecksums = _ByVal($in.index.checksums);
            let $indexChanged = 'false';

            for (let $assetName in $newChecksums) {
                if ($newChecksums.hasOwnProperty($assetName) === false) {
                    continue;
                }

                if (_IsSet($currentChecksums[$assetName]) === 'false') {
                    $currentChecksums[$assetName] = $newChecksums[$assetName];
                    $indexChanged = 'true';
                    continue;
                }

                if ($currentChecksums[$assetName] !==
                    $newChecksums[$assetName]) {
                    $currentChecksums[$assetName] = $newChecksums[$assetName];
                    $indexChanged = 'true';
                }
            }

            if ($indexChanged === 'true') {
                $in.index = _ByVal($in.response.data);
                $in.index.checksums = $currentChecksums;
                $in.step = 'step_store_index';
            }

            if ($indexChanged === 'false') {
                $answer = 'true';
                $message = 'Did not have to change the existing index';
                $in.step = 'step_end';
            }

        }

        if ($in.step === 'step_store_index') {
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_storage',
                    'function': 'write',
                },
                'data': {
                    'path': $in.path,
                    'data': $in.index,
                },
                'data_back': {
                    'plugin_name': $in.plugin_name,
                    'path': $in.path,
                    'index': $in.index,
                    'step': 'step_store_index_response',
                },
            });
        }

        if ($in.step === 'step_store_index_response') {
            let $default = {
                'answer': 'false',
                'message': '',
                'post_exist': 'false',
            };
            $in.response = _Default($default, $in.response);

            $message = 'Failed to update the plugin assets index';
            if ($in.response.post_exist === 'true') {
                $answer = 'true';
                $message = 'Success: Updated the plugin assets index';
            }
        }

        return {
            'answer': $answer,
            'message': $message,
        };
    };

    $functions.push('get_plugin_assets');
    /**
     * A client plugin can ask for its assets and have to already know what asset names it wants.
     * ONLY those assets that are named in 'list' will be returned.
     * list contain keys with empty data. The key is a complete path to the asset starting in the plugin asset folder.
     * Example { 'icon/export.json': '', 'icon/export.svg': '', 'translate/sv.json': ''}
     * @version 2018-11-10
     * @since 2017-12-23
     * @author Peter Lembke
     * @param {object} $in
     * @returns {{}|{assets: {}, answer: string, message: string}}
     */
    const get_plugin_assets = function($in = {}) {
        const $default = {
            'list': {},
            'plugin_name': '', // plugin_name can be used by Asset and Launcher
            'from_plugin': {'node': '', 'plugin': '', 'function': ''},
            'step': 'step_get_assets_from_storage',
            'response': {
                'answer': '',
                'message': '',
                'items': {},
            },
            'data_back': {
                'list': {},
                'assets': {},
                'plugin_name': '',
                'latest_key': '',
            },
        };
        $in = _Default($default, $in);

        let $answer = 'false';
        let $message = 'Nothing to report';

        if ($in.from_plugin.node !== 'client') {
            $message = 'I only accept calls from client plugins';
            $in.step = 'step_end';
        }

        let $pluginName = _GetGrandPluginName($in.from_plugin.plugin);
        const $fromPlugin = $in.from_plugin.plugin;
        if ($fromPlugin === 'infohub_asset' || $fromPlugin ===
            'infohub_launcher' || $fromPlugin === 'infohub_translate') {
            if (_Empty($in.plugin_name) === 'false') {
                $pluginName = $in.plugin_name;
            }
        }

        if ($in.step === 'step_get_assets_from_storage') {
            let $paths = {};
            for (let $key in $in.list) {
                const $path = 'infohub_asset/asset/' + $pluginName + '/' + $key;
                $paths[$path] = {};
            }

            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_storage',
                    'function': 'read_many',
                },
                'data': {
                    'paths': $paths,
                },
                'data_back': {
                    'plugin_name': $pluginName,
                    'step': 'step_get_assets_from_storage_response',
                },
            });

        }

        if ($in.step === 'step_get_assets_from_storage_response') {
            $answer = $in.response.answer;
            $message = $in.response.message;

            if ($in.response.answer === 'true') {
                const $remove = 'infohub_asset/asset/' + $pluginName + '/';
                const $removeLength = $remove.length;

                for (let $key in $in.response.items) {
                    if ($in.response.items.hasOwnProperty($key) === true) {
                        const $newKey = $key.substr($removeLength);
                        $in.data_back.assets[$newKey] = $in.response.items[$key];
                    }
                }

                $message = 'Here are the wanted assets';
            }
            $in.step = 'step_end';
        }

        return {
            'answer': $answer,
            'message': $message,
            'assets': $in.data_back.assets,
        };
    };

    $functions.push('get_asset_and_license');
    /**
     * A plugin can ask infohub_asset for one of its assets. It gets the asset data and the asset license.
     * With this function you get images (jpeg, png, gif, svg), audio (oga, mp3), video (ogv, mp4)
     * Used by function "create" to render an asset.
     * @version 2018-05-12
     * @since 2018-05-12
     * @author Peter Lembke
     * @param {object} $in
     * @returns {{}|{answer: string, asset_exist: string, asset_license: {}, messages: [], message: string, asset: string}}
     */
    const get_asset_and_license = function($in = {}) {
        const $default = {
            'plugin_name': '', // Use by infohub_asset and by infohub_render
            'asset_name': '',
            'asset_type': 'icon', // image, audio, video, icon
            'extension': 'svg', // jpeg, png, gif, svg, oga, mp3, ogv, mp4, json
            'from_plugin': {'node': '', 'plugin': ''},
            'step': 'step_get_plugin_assets',
            'response': {
                'answer': '',
                'message': '',
                'data': {},
                'assets': {},
            },
            'data_back': {
                'step': '',
            },
        };
        $in = _Default($default, $in);

        let $asset = '',
            $assetLicense = {},
            $keepAsset = 'false',
            $answer = 'false',
            $message = 'Nothing to report',
            $messageArray = [],
            $extension = '';

        if ($in.from_plugin.node !== 'client') {
            $message = 'I only accept calls from client plugins';
            $in.step = 'step_end';
        }

        let $pluginName = _GetGrandPluginName($in.from_plugin.plugin);
        if ($in.from_plugin.plugin === 'infohub_asset') {
            if (_Empty($in.plugin_name) === 'false') {
                $pluginName = $in.plugin_name;
            }
        }

        if ($in.step === 'step_get_plugin_assets') {
            let $list = {},
                $fileName = $in.asset_type + '/' + $in.asset_name + '.json';

            $list[$fileName] = {};

            $fileName = $in.asset_type + '/' + $in.asset_name;
            if ($in.extension === 'svg') {
                $fileName = $fileName + '.' + $in.extension;
            }

            $list[$fileName] = {};

            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_asset',
                    'function': 'get_plugin_assets',
                },
                'data': {
                    'plugin_name': $pluginName,
                    'list': $list,
                },
                'data_back': {
                    'plugin_name': $pluginName,
                    'asset_name': $in.asset_name,
                    'asset_type': $in.asset_type,
                    'extension': $in.extension,
                    'step': 'step_get_plugin_assets_response',
                },
            });
        }

        if ($in.step === 'step_get_plugin_assets_response') {
            $keepAsset = 'true';

            let $fileName = $in.asset_type + '/' + $in.asset_name;
            if ($in.extension === 'svg') {
                $fileName = $fileName + '.' + $in.extension;
            }

            $asset = _GetData({
                'name': 'response|assets|' + $fileName + '|contents',
                'default': '',
                'data': $in,
                'split': '|',
            });

            $extension = _GetData({
                'name': 'response|assets|' + $fileName + '|extension',
                'default': '',
                'data': $in,
                'split': '|',
            });

            $in.step = 'step_get_license';
            if (_Empty($asset) === 'true') {
                $message = 'The asset file is empty. You get the default asset instead.';
                $keepAsset = 'false';
                $in.step = 'step_default_license';
            }
        }

        if ($in.step === 'step_get_license') {
            const $fileName = $in.asset_type + '/' + $in.asset_name + '.json';

            $assetLicense = _GetData({
                'name': 'response|assets|' + $fileName + '|contents',
                'default': {},
                'data': $in,
                'split': '|',
            });

            $in.step = 'step_keep_assets';
            if (_Empty($assetLicense) === 'true') {
                $message = 'The license file is empty. You get the default asset instead.';
                $keepAsset = 'false';
                $in.step = 'step_default_license';
            }
        }

        if ($in.step === 'step_keep_assets') {
            if ($in.extension !== 'svg' && $in.extension !== 'json') {
                const $mimeType = _GetMimeType($extension);
                $asset = 'data:' + $mimeType + ';base64,' + $asset;
            }

            if ($in.extension === 'svg') {
                $asset = _Replace('\n', '', $asset);
            }

            $answer = 'true';
            $message = 'Here are the asset with type:' + $in.asset_type + ', extension:' + $in.extension;
            $in.step = 'step_end';
        }

        if ($in.step === 'step_default_license') {
            $assetLicense = {
                'publisher_name': 'InfoHub',
                'publisher_url': 'https://infohub.se',
                'publisher_note': 'The infohub.se project need assets',
                'publisher_video_url': '',
                'collection_name': 'Infohub Icons',
                'collection_url': '',
                'collection_note': 'Collection of assets that are created by infohub.se',
                'license_name': 'CC BY-ND 3.0',
                'license_url': 'https://creativecommons.org/licenses/by-nd/3.0/',
                'license_note': 'You are free to:Share — copy and redistribute the icon in any medium or format for any purpose, even commercially. The licensor cannot revoke these freedoms as long as you follow the license terms.',
                'file_name': 'default.svg',
                'creator_name': 'Peter Lembke',
                'creator_url': 'http://www.charzam.com/',
                'creator_note': 'I create assets out of necessity',
                'asset_name': 'Default Image',
                'asset_url': '',
                'asset_note': 'This is the default icon that are shown when an asset is missing icon data or license information.',
                'asset_date': '2018-01-21',
                'asset_location': 'Stockholm, Sweden',
            };

            $asset = '<?xml version="1.0" encoding="iso-8859-1"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"> <svg version="1.1" id="default" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="100%" height="100%" viewBox="0 0 50 50" style="enable-background:new 0 0 50 50;" xml:space="preserve"> <circle cx="25" cy="25" r="20" stroke="#9933ff" stroke-width="3" fill="white" /> </svg>';
            $answer = 'true';
            $message = 'Here are the default type:' + $in.asset_type + ', extension:' + $in.extension + '. I did not have all the required assets.';
            $in.step = 'step_default_' + $in.asset_type;

            if ($in.extension === 'json') {
                $asset = '{}';
                $in.step = 'step_end';
            }

            if ($in.extension === 'svg') {
                $in.step = 'step_end';
            }
        }

        if ($in.step === 'step_default_icon') {
            $in.step = 'step_end';
        }

        if ($in.step === 'step_default_image') {
            $asset = 'data:image/svg+xml;base64,' + btoa($asset);
            $in.step = 'step_end';
        }

        if ($in.step === 'step_default_audio') {
            $asset = 'data:audio/ogg;base64,T2dnUwACAAAAAAAAAAC5RnRHAAAAAO0ey7UBHgF2b3JiaXMAAAAAAUSsAAAAAAAAAHcBAAAAAAC4AU9nZ1MAAAAAAAAAAAAAuUZ0RwEAAAAKGlNWEM3//////////////////8kDdm9yYmlzKwAAAFhpcGguT3JnIGxpYlZvcmJpcyBJIDIwMTIwMjAzIChPbW5pcHJlc2VudCkFAAAAEwAAAFRJVExFPURlZmF1bHQgYXVkaW8PAAAAREFURT0yMDE4LTA1LTEzNQAAAENPTU1FTlRTPUkgY3JlYXRlIGFzc2V0cyBmb3IgSW5mb2h1YiBvdXQgb2YgbmVjZXNzaXR5FAAAAEdFTlJFPURlZmF1bHQgYXNzZXRzEwAAAEFSVElTVD1QZXRlciBMZW1ia2UBBXZvcmJpcylCQ1YBAAgAAAAxTCDFgNCQVQAAEAAAYCQpDpNmSSmllKEoeZiUSEkppZTFMImYlInFGGOMMcYYY4wxxhhjjCA0ZBUAAAQAgCgJjqPmSWrOOWcYJ45yoDlpTjinIAeKUeA5CcL1JmNuprSma27OKSUIDVkFAAACAEBIIYUUUkghhRRiiCGGGGKIIYcccsghp5xyCiqooIIKMsggg0wy6aSTTjrpqKOOOuootNBCCy200kpMMdVWY669Bl18c84555xzzjnnnHPOCUJDVgEAIAAABEIGGWQQQgghhRRSiCmmmHIKMsiA0JBVAAAgAIAAAAAAR5EUSbEUy7EczdEkT/IsURM10TNFU1RNVVVVVXVdV3Zl13Z113Z9WZiFW7h9WbiFW9iFXfeFYRiGYRiGYRiGYfh93/d93/d9IDRkFQAgAQCgIzmW4ymiIhqi4jmiA4SGrAIAZAAABAAgCZIiKZKjSaZmaq5pm7Zoq7Zty7Isy7IMhIasAgAAAQAEAAAAAACgaZqmaZqmaZqmaZqmaZqmaZqmaZpmWZZlWZZlWZZlWZZlWZZlWZZlWZZlWZZlWZZlWZZlWZZlWZZlWUBoyCoAQAIAQMdxHMdxJEVSJMdyLAcIDVkFAMgAAAgAQFIsxXI0R3M0x3M8x3M8R3REyZRMzfRMDwgNWQUAAAIACAAAAAAAQDEcxXEcydEkT1It03I1V3M913NN13VdV1VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVWB0JBVAAAEAAAhnWaWaoAIM5BhIDRkFQCAAAAAGKEIQwwIDVkFAAAEAACIoeQgmtCa8805DprloKkUm9PBiVSbJ7mpmJtzzjnnnGzOGeOcc84pypnFoJnQmnPOSQyapaCZ0JpzznkSmwetqdKac84Z55wOxhlhnHPOadKaB6nZWJtzzlnQmuaouRSbc86JlJsntblUm3POOeecc84555xzzqlenM7BOeGcc86J2ptruQldnHPO+WSc7s0J4ZxzzjnnnHPOOeecc84JQkNWAQBAAAAEYdgYxp2CIH2OBmIUIaYhkx50jw6ToDHIKaQejY5GSqmDUFIZJ6V0gtCQVQAAIAAAhBBSSCGFFFJIIYUUUkghhhhiiCGnnHIKKqikkooqyiizzDLLLLPMMsusw84667DDEEMMMbTSSiw11VZjjbXmnnOuOUhrpbXWWiullFJKKaUgNGQVAAACAEAgZJBBBhmFFFJIIYaYcsopp6CCCggNWQUAAAIACAAAAPAkzxEd0REd0REd0REd0REdz/EcURIlURIl0TItUzM9VVRVV3ZtWZd127eFXdh139d939eNXxeGZVmWZVmWZVmWZVmWZVmWZQlCQ1YBACAAAABCCCGEFFJIIYWUYowxx5yDTkIJgdCQVQAAIACAAAAAAEdxFMeRHMmRJEuyJE3SLM3yNE/zNNETRVE0TVMVXdEVddMWZVM2XdM1ZdNVZdV2Zdm2ZVu3fVm2fd/3fd/3fd/3fd/3fd/XdSA0ZBUAIAEAoCM5kiIpkiI5juNIkgSEhqwCAGQAAAQAoCiO4jiOI0mSJFmSJnmWZ4maqZme6amiCoSGrAIAAAEABAAAAAAAoGiKp5iKp4iK54iOKImWaYmaqrmibMqu67qu67qu67qu67qu67qu67qu67qu67qu67qu67qu67qu67pAaMgqAEACAEBHciRHciRFUiRFciQHCA1ZBQDIAAAIAMAxHENSJMeyLE3zNE/zNNETPdEzPVV0RRcIDVkFAAACAAgAAAAAAMCQDEuxHM3RJFFSLdVSNdVSLVVUPVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVdU0TdM0gdCQlQAAGQAAI0EGGYQQinKQQm49WAgx5iQFoTkGocQYhKcQMww5DSJ0kEEnPbiSOcMM8+BSKBVETIONJTeOIA3CplxJ5TgIQkNWBABRAACAMcgxxBhyzknJoETOMQmdlMg5J6WT0kkpLZYYMyklphJj45yj0knJpJQYS4qdpBJjia0AAIAABwCAAAuh0JAVAUAUAABiDFIKKYWUUs4p5pBSyjHlHFJKOaecU845CB2EyjEGnYMQKaUcU84pxxyEzEHlnIPQQSgAACDAAQAgwEIoNGRFABAnAOBwJM+TNEsUJUsTRc8UZdcTTdeVNM00NVFUVcsTVdVUVdsWTVW2JU0TTU30VFUTRVUVVdOWTVW1bc80ZdlUVd0WVdW2ZdsWfleWdd8zTVkWVdXWTVW1ddeWfV/WbV2YNM00NVFUVU0UVdVUVds2Vde2NVF0VVFVZVlUVVl2ZVn3VVfWfUsUVdVTTdkVVVW2Vdn1bVWWfeF0VV1XZdn3VVkWflvXheH2feEYVdXWTdfVdVWWfWHWZWG3dd8oaZppaqKoqpooqqqpqrZtqq6tW6LoqqKqyrJnqq6syrKvq65s65ooqq6oqrIsqqosq7Ks+6os67aoqrqtyrKwm66r67bvC8Ms67pwqq6uq7Ls+6os67qt68Zx67owfKYpy6ar6rqpurpu67pxzLZtHKOq6r4qy8KwyrLv67ovtHUhUVV13ZRd41dlWfdtX3eeW/eFsm07v637ynHrutL4Oc9vHLm2bRyzbhu/rfvG8ys/YTiOpWeatm2qqq2bqqvrsm4rw6zrQlFVfV2VZd83XVkXbt83jlvXjaKq6roqy76wyrIx3MZvHLswHF3bNo5b152yrQt9Y8j3Cc9r28Zx+zrj9nWjrwwJx48AAIABBwCAABPKQKEhKwKAOAEABiHnFFMQKsUgdBBS6iCkVDEGIXNOSsUclFBKaiGU1CrGIFSOScickxJKaCmU0lIHoaVQSmuhlNZSa7Gm1GLtIKQWSmktlNJaaqnG1FqMEWMQMuekZM5JCaW0FkppLXNOSuegpA5CSqWkFEtKLVbMScmgo9JBSKmkElNJqbVQSmulpBZLSjG2FFtuMdYcSmktpBJbSSnGFFNtLcaaI8YgZM5JyZyTEkppLZTSWuWYlA5CSpmDkkpKrZWSUsyck9JBSKmDjkpJKbaSSkyhlNZKSrGFUlpsMdacUmw1lNJaSSnGkkpsLcZaW0y1dRBaC6W0FkpprbVWa2qtxlBKayWlGEtKsbUWa24x5hpKaa2kEltJqcUWW44txppTazWm1mpuMeYaW2091ppzSq3W1FKNLcaaY2291Zp77yCkFkppLZTSYmotxtZiraGU1koqsZWSWmwx5tpajDmU0mJJqcWSUowtxppbbLmmlmpsMeaaUou15tpzbDX21FqsLcaaU0u11lpzj7n1VgAAwIADAECACWWg0JCVAEAUAABBiFLOSWkQcsw5KglCzDknqXJMQikpVcxBCCW1zjkpKcXWOQglpRZLKi3FVmspKbUWay0AAKDAAQAgwAZNicUBCg1ZCQBEAQAgxiDEGIQGGaUYg9AYpBRjECKlGHNOSqUUY85JyRhzDkIqGWPOQSgphFBKKimFEEpJJaUCAAAKHAAAAmzQlFgcoNCQFQFAFAAAYAxiDDGGIHRUMioRhExKJ6mBEFoLrXXWUmulxcxaaq202EAIrYXWMkslxtRaZq3EmForAADswAEA7MBCKDRkJQCQBwBAGKMUY845ZxBizDnoHDQIMeYchA4qxpyDDkIIFWPOQQghhMw5CCGEEELmHIQQQgihgxBCCKWU0kEIIYRSSukghBBCKaV0EEIIoZRSCgAAKnAAAAiwUWRzgpGgQkNWAgB5AACAMUo5B6GURinGIJSSUqMUYxBKSalyDEIpKcVWOQehlJRa7CCU0lpsNXYQSmktxlpDSq3FWGuuIaXWYqw119RajLXmmmtKLcZaa825AADcBQcAsAMbRTYnGAkqNGQlAJAHAIAgpBRjjDGGFGKKMeecQwgpxZhzzimmGHPOOeeUYow555xzjDHnnHPOOcaYc8455xxzzjnnnHOOOeecc84555xzzjnnnHPOOeecc84JAAAqcAAACLBRZHOCkaBCQ1YCAKkAAAARVmKMMcYYGwgxxhhjjDFGEmKMMcYYY2wxxhhjjDHGmGKMMcYYY4wxxhhjjDHGGGOMMcYYY4wxxhhjjDHGGGOMMcYYY4wxxhhjjDHGGGOMMcYYY4wxxhhba6211lprrbXWWmuttdZaa60AQL8KBwD/BxtWRzgpGgssNGQlABAOAAAYw5hzjjkGHYSGKeikhA5CCKFDSjkoJYRQSikpc05KSqWklFpKmXNSUiolpZZS6iCk1FpKLbXWWgclpdZSaq211joIpbTUWmuttdhBSCml1lqLLcZQSkqttdhijDWGUlJqrcXYYqwxpNJSbC3GGGOsoZTWWmsxxhhrLSm11mKMtcZaa0mptdZiizXWWgsA4G5wAIBIsHGGlaSzwtHgQkNWAgAhAQAEQow555xzEEIIIVKKMeeggxBCCCFESjHmHHQQQgghhIwx56CDEEIIIYSQMeYcdBBCCCGEEDrnHIQQQgihhFJK5xx0EEIIIZRQQukghBBCCKGEUkopHYQQQiihhFJKKSWEEEIJpZRSSimlhBBCCKGEEkoppZQQQgillFJKKaWUEkIIIZRSSimllFJCCKGUUEoppZRSSgghhFJKKaWUUkoJIYRQSimllFJKKSGEEkoppZRSSimlAACAAwcAgAAj6CSjyiJsNOHCA1BoyEoAgAwAAHHYausp1sggxZyElkuEkHIQYi4RUoo5R7FlSBnFGNWUMaUUU1Jr6JxijFFPnWNKMcOslFZKKJGC0nKstXbMAQAAIAgAMBAhM4FAARQYyACAA4QEKQCgsMDQMVwEBOQSMgoMCseEc9JpAwAQhMgMkYhYDBITqoGiYjoAWFxgyAeADI2NtIsL6DLABV3cdSCEIAQhiMUBFJCAgxNueOINT7jBCTpFpQ4CAAAAAAABAB4AAJINICIimjmODo8PkBCREZISkxOUAAAAAADgAYAPAIAkBYiIiGaOo8PjAyREZISkxOQEJQAAAAAAAAAAAAgICAAAAAAABAAAAAgIT2dnUwAEAGQAAAAAAAC5RnRHAgAAAJI8tREbIltZWldMRlRVVVhWUU9OUU1LS1JTUU9QWaGMLB11f4H9YBib7UFi8GGduS+hzNRV6i148uSJq23btm3bALplpP6PQIQE9PcxMn2eBz+fXzuuGdoyC4wpAAAAAMAiIbGtD5lfQRk1iT88sX75Oy/N4xTTqcnLdUZTMvYA29EBSzOcdac23jcYxjy9bT5R4ZCGlOGCKPhnHwA+ZcT4154vITaPvzO3AaOUOb0s+ok6GDMAAAAAAEAZX2b2T/5amn5zJN/nycHz4dN35gFqKpGaHIxCY+ONcaIAYBak4/tCC07O1sxauLi6x/OG3dgEHZudJH5lBHJzH6BTWI7lubcxHiOXo94201glUBkAAAAAAICD1jTWB8LkQFn+yb4l4fzg1HmmhlAaztxbk3FcTg93AKAOB6X6ussKoQjTWXc3S4VE4uroql6UypSBI/4W1e2Xb9AlPG7sJzvvR5Kd29gdeK12CkCXAAAAAAAVn87M/v/OHEP+JM7/myZ2FNTvpPSlzjASPoaYcv3rs9VlyyRGz9Ws1p+BzZqZmW3qlb3ssXEKAP53TdO3P9CI+zWwRZUP/YLnAQDMAZAAAAAAAN53+5ZPd6/c7l/dPpTEYBIAoJBCPiQLiJggX4jr7BuTJYRBEr3tZrDtzxvzf6fQBQA+mE3Lt/9BknlMnCUKxbADWuD6vwlAwwAAAAAAY/LwafCTgXTbe3s7++AJKZz+AbxzrCWwAAO+hgH0MRjmZXUL38culnQAPpg1849/UM6st+Bs+79GhX4h2C5AA2CDFQgAAAAAAK4OumicUucvPnQ1pH0O/zYAgDiCvxwcABTC9N1XVCHSMWFjAHqWsa1V9XPKVZtUXzVcvAMAHphl4x9/oErIb8lZd8O+D/1CK/4BAGxwDQsAAAAAoPuf95c0Kw7du/gxdvhwJgAADjH+vre5A80mNA3bwCGwoigSEkDOUuAMXu94VU2U4ns1779rAN5nxeWvCA7qUr1r7id/7hfDjjnpBYYvRgBWMEkAAAAAAOY9Lzw4OJX9Y9Ov/kyhIClj/MmAQBIq6g0A8P5l+rp7ga5PukkaK8HFoBfHS2qon/5O1AH+h1X6//gHtWsNeTt+plXQL0TIDgBgAZ4CAAAAAJCNL9/fTebyZ+yvt3IY3OwF4AAU3lYPHFPIE4XS5guajR9ZBNuHlmv8GB0zrhw+rO6mU8TlUUSFKQAA3ofl+n/+hl3SuJens/25hg475h9V0HcDoE0AAAAAAB/TWv/sH5r8ubRx4NYrV1kAzLe5nSNSL0sKCkYAmacjowVsudeWHcKRBDP6nES8/Soe9f3jrwBeuCUv//Q77C711z1tXwJ2/N3sl6DPBKA1AAAAAADreP1O/X72eyNlfvv8L5Mb19a1tc/nkloJIBQCMQTkG9q7GE6FnWnL201WhvN32zr0BgCeyOXP/+1vyC31130db/4NO7x1O2BfJj0BkgA8AAAAAIA6Yp05ctPI/jccHH4OBgwl9ev1+GOcgCp8/LlZQVEor2IAAOaF7nrEqIfjnwsA3vjVl1++h3M5+J+WjxgR6Bf+HQAAklQBBQAAAADAQb1J86XYXbr0t/VvgLECTKbvDOThjgCAmFSKixMqSyf50RkQArDuCaAM/5FxcQ8AfrjVx4+/YVX4m3a8ddfNG7Ojp582AfNLAmEhAAAAAIDSlw/bpU0+ST0Qrg2PXD+nFaFu2bSxqWU8xR3woLHqrw6tAThAWOe1TkR6SSHj9WETHoiV048IDhLCtzfc4uNvhXP4riMtiDAJAAAAAAB98fnZyZff+fe6aezOr596637w2OzNlz432QA0mKEq24c+ecLt4orKt0qkak4JAAA+mNXrp3/gbnV/g7f4t/0lx81hOABRAQAAAAA4+Z+8XZp+6L/clve3bYyr+fvMqKcl3yoz++za9gS9ESmGO9h5qP3oCeueQZhlVABeqDXH/XfpUc8/CT9yZ8LBjc0GWCRAAQAAAABgrK/bkPnk9yt/8vJd+jT/I5fwDZups8VSLjcXcgoAAK5g5GgCX1bGZxH2/mrlPwPed5X9+3ehWvdr6lOsKxwrrP0D+ncBAAkAAAAAQNzb9HTvX7sLuVeMx/DAcqfFXesStr2zhjA5mQ84icYCAADA9ikq1rRpFQnPeAfybUnsHxAAflel9fufwmr8pnvL9uCI4Y6BgHnjIYAUAAAAAKib+evH7TZtys2+Ys4E2wcGGQfWy8xVZk/WkQDYbqujAgCgFIziNAlDtFrpxWX1m7wrlyc3AACeZ2X9/UnldV7ovqJAMkKcG1zIfBIwxw6EAAAAAIAa/Pdy/yrNs8GWh1b5Wt6hl7/6fiXqTPL3hptGbONyPL8CAGBfHR7qyn0++AU9UDv2lwDeZ2XtLWFNrzEI/Y8okDwFjql1hgHmENAAAAAAACTXq/D77NBFy+HnlpmH0h8izanJL5tK6J6EkQZhmWsCAJDsOJIUA80V2gd1FIUTo1gBHhdF5esujlcApf8Rv/IxEM7KszscyHsAAAAAAIl/L2f83+8cn3944MVBS+rZswH+zZUlu98oj3e1wWckADzswNdvR2jGi579qXuHenRTVwB+ZeTAf2GXYj94xC/H9Cpn/htIUKCVhgYAAAAAwNSjkX374v0uxWZ9k58M2/19M3Hzb7iTy2Zaq4zqxmk03igBAHIBwft5DbSWTdcL1L+R5KI80kpZzU8LAR5mJNj/nOIo42V577AP0TYd5eRnkcGDFQMhXFFrCgAAws1r47YD135sMQ2/Zf06L99Q85tvNnJ77yyxUabHNjXZvG+xF6fU6MFZSHO68SlBtfsKxIqEdvLNLW9RKR4rWwIwrVPRZn+fnvKkmSDu/v8h6ClPmgni7v/thVNSe9Hf///o6dULf/8z0dPLBX//dfT0kvD9Z3S9CN9/oLigzq4AnmUs7fNtXPFL99wedBzZHONthh2AcSpHTQEAAHySnLz6wLvk1f0vj/+4n29y8MuvZ5Z//ruSHe8fTtZ8tjCv8P44NneuqprYInW3NaRkVdL8UO4xAJij1rH5/DDMqqoilKkp+X5+1orPVgFq+XerZ4vPVgpeLi6iydQUXs/PGKb8uJ81DFMy1jNgOAA=';
            $assetLicense = _Merge($assetLicense, {
                'file_name': 'default.oga',
                'asset_name': 'Default Audio',
                'asset_note': 'This is the default audio that are heard when an asset is missing license information or data.',
                'asset_date': '2018-05-13',
            });
            $in.step = 'step_end';
        }

        if ($in.step === 'step_default_video') {
            $asset = 'data:video/mp4;base64,AAAAIGZ0eXBpc29tAAACAGlzb21pc28yYXZjMW1wNDEAAAAIZnJlZQAAcRZtZGF0C3egP0xAQ+EG8IkMDAwhgYGH6xchVvSV30Km+nPdimjvVV7Ls9JXfQvnp8+fPnz58+fPjL+ucOHIAudBDJYM7cd2zIAWONLDQwwYXSphGuxxObrkCe149c+BBsn3gBCIsq6vGxGudBDJYM7cd2zIABmDCnlMsCQGbECvRhUF0P/yRLfaeex/Jdy7d933BF44rG8fpuvS56sPLLcTqtsumSQGbECvRhUF0P/wDMGEv1T4DejKHh23yCFpRvqBNIkHmNdhLTrD06MeU+KSEaBhD3jr/iWWkNDxUhDG9GUPDtvkELSjfQMwYS/RKwPfZGz4U7eyfb8LJhghuUI0St9o37qNnnXAX3uRCgqRGBYuMkhEu5o24Vta99kbPhTt7J9vwsBmDCX2auBuDANGUiXmWyFgJn7dEH5R1fH1KWVV6hPCf/8TYXlv00aodLixpKLWclINwYBoykS8y2QsBAaTBhMNLSAlAve3rH95qXeyyYED8+eYPF7FWiQ/5SQb6b3wM+D2kWwiJe2axSy1q1qqWlAve3rH95qXeyyBgAAAIn0AAAJ+BgX//3rcRem95tlIt5Ys2CDZI+7veDI2NCAtIGNvcmUgMTQyIHIyNDM4IGFmOGU3NjggLSBILjI2NC9NUEVHLTQgQVZDIGNvZGVjIC0gQ29weWxlZnQgMjAwMy0yMDE0IC0gaHR0cDovL3d3dy52aWRlb2xhbi5vcmcveDI2NC5odG1sIC0gb3B0aW9uczogY2FiYWM9MSByZWY9MyBkZWJsb2NrPTE6MDowIGFuYWx5c2U9MHgzOjB4MTEzIG1lPWhleCBzdWJtZT03IHBzeT0xIHBzeV9yZD0xLjAwOjAuMDAgbWl4ZWRfcmVmPTEgbWVfcmFuZ2U9MTYgY2hyb21hX21lPTEgdHJlbGxpcz0xIDh4OGRjdD0xIGNxbT0wIGRlYWR6b25lPTIxLDExIGZhc3RfcHNraXA9MSBjaHJvbWFfcXBfb2Zmc2V0PS0yIHRocmVhZHM9NCBsb29rYWhlYWRfdGhyZWFkcz0xIHNsaWNlZF90aHJlYWRzPTAgbnI9MCBkZWNpbWF0ZT0xIGludGVybGFjZWQ9MCBibHVyYXlfY29tcGF0PTAgY29uc3RyYWluZWRfaW50cmE9MCBiZnJhbWVzPTAgd2VpZ2h0cD0yIGtleWludD0xMiBrZXlpbnRfbWluPTEgc2NlbmVjdXQ9NDAgaW50cmFfcmVmcmVzaD0wIHJjX2xvb2thaGVhZD0xMiByYz1hYnIgbWJ0cmVlPTEgYml0cmF0ZT0zODQgcmF0ZXRvbD0xLjAgcWNvbXA9MC42MCBxcG1pbj0yIHFwbWF4PTMwIHFwc3RlcD00IGlwX3JhdGlvPTEuNDAgYXE9MToxLjAwAIAAAAunZYiEBf/+98dPwKbq3CLLOf/+lwG8zxQZaxpr/AukM+oG7cAM5yEiLQMznRXjnLlir0/UKLGL6gJ08W2q51L294FmK6MPBCTRVUX9Km0CHN4/DJpy+2WibbVyJh7x/sFHxNQ07wv6K/XP6t14Lhz2016P+m0zMAUpFjjJ0hB1CKj/M7B6MP3VHC+CppqB8P9Xj/N/QGIyyvIi5OknOhYw8ehJvqRh+loTJpZuB6mg3TSJpv4f2ITNNwigyOKI87mFZx2sVXZxj9qkZv4H604AUafXRjX15yFtTMOTyRQ1Foz+iRpnO9KbA8hrO92Eyr+h7jlr/Bv5Y14v6pnKBkD/hnGMUn2e4rGZ9bowhd9EyDUdjNiGevuiWwsOvoHBKLbkk7i5veU/2WgulGknU1GXzTbyJzZI4etWE46ZsROUXtAKsxjdgNRU8vqoKSwzrAxznuiRaIWkeFCkF2+ZS7q73VP+FoHs5qa5gmY+8s96Fs0PlTnwswlf5a9Nw7eOrV6X/Wf3M/MljUwL0A2kAOJPc6JhQc7R0KPyIfIzNxsE9q5bhpsGiXAWUiES62DsU+aPeYaHCC/X0hk7+pSHR6kLmyFxWP1bMm4nALbJ8WvNgYiMHfN15gTQ47X2rtn/Rr/VoV8zAQl1GYd4IphBzLj33p9DldeDOuLPNYMspNjfTrJ8TUFseYpnaak94fIA+hemy5PPyb8dddHMwfvfO3lCGS4tlF+gbCsbYyYrfAAMvQuZQvge8cheCf4pYw5JIRKa+Ri93qrZXnQo41Lxi3+rJfhX4MRbYLUJplYDRctwvhl7nWq7dSk1B/X0g0tMvdbe2pLPdAhG6BSEeEHdFeQ2IYELny81lG5YSeWd9wOX9laVaHr92saoT5mUyg3bCl+Tx1s+LP9n4n8Hrgai+Sb/y9ndLeLWB4h3h4DaoePaKIhtMUX2KOtFI9O6uGpYmRxhy3q0sPkvOu2vm3EPITmCaFA5dWLOXGzhVHeCv23OkwxBSMB89GQW1DN/uJ3jIcAtU+ftlLb5jhZerdOfTSjbxEfqmFf7prscCRpYTcrD9Vyt+Ka++KoT+Qk5x4KehMtzWGhpz4v/96PJbc/NVmIeNbCU9ayiaOXT42YpULdkiX2W0a13WI0Z4y7Wn9H8YvoSAsZDoxuQ4E9fDKL4Cfy5o+z+eEPFP3fCdSgLGY1z272PFNQwckxxYKtjZBy3mmkXtY1Vm8522yMvNnNFprpGEA8wWhj+XpmZysIiOKnym0aiYvGodnwGR08CVQU7ObRxmKCi+Wngq8eg3vvDWm4AcNRFIw53vvDuLltG6Dvl/rrSesWvsY+TFqU7lhrJExMar4LmXEURlCtHvj+6InKfKQDGhlZw/m1Fwkvw/u2wWhx06pVvIlQD0+km5hSZ9pRLfZXiIWQsq3kGBwRA3elPekH7MvkT/ULSEtjDIfXh0WKy0vcWsBHByyOeOxQQkCYxvHH9zNL4SBa7dqgqOaqtc9jwGj8RrEccMyNOJvpfG9Hf7VLuDTEWglA26pTSq/MRyu6QkaYGo0QRHuT/hemmxa/BwkB6dapkpdmNvmxq75AXb6UEHksIxWbNlvf+UXLfRQIzMHkP2K6VidqAKF19L+x5IjCkKMQvMRXzhf0rl09lwMIWnk/XPF16QjbwJCf76iTMuYfsoF8qrmJAXrRl8nyRziqsOxPlFaAFFpp9DhFzWw+qQUWy2o8VOYOrXAWXsLjyqaOjQXUMkrJ1dBBJuDgXbfbJ9+9L4B5lyPAQSj6/OqtRtSh5nItsHUDl/4xxXBsFO0SURqnf7AnLLAwXhE5Tr6r3JSWCVYkR060OXFUE01TrVyh8VCypfdqJXPWIGx/eFyhA2fI+JHSiiLmYOtlmnzZPsqH4iiK8pjN5aLhuqiwlcsXxoQFUyaTr8iumsExGnPrTP2acJiD66OfJY6SojSDq3FeDd4LCXBmd+6sv12sBLdfRbLBJ0Bh5lfq5aqR4YZYjTaTPQZcLD6cGbwLH/vppdJMqbyOSj3dTOqHnu+KX2VPAS54PYlyIvHv+BtMxG438OlE46acCOnRIYfNrUZyA9ic+YEf6i5CUIXe5MGxhuiXZb2uqrKfqQsH04EAvjI1iZO27EhzTaCrpePpT1DZzkcemaZ4/vXfpTq+P77ZTMXQPbAgTJG6WNxUnT+FJYK9eL2Dz1a50m+QqfKw3ccHyrxrRyGpD20kT3SOLTWgYoVsJKgxwvMV0FWjE+KxgC4CcpQ/rjkSAqD6sQaEmoJdG9pqEDZSbmp6sggd7/D2ngM2TScUquwFavNAutL2frmEsKvT1IgwsFffai4Hn1JnePe6enJPbqjJST1dIbduu5XmMHLDGb1T+xCvM4a78iv5PQ5qJ2m9bWSjyTK4QQuDvlJkvcdrEcSLkX7H/czczs0Yn3y54gTiMlCpH1UDnDA9FImNrsB7OaH1yWQheFzOWz3Wp9jaAXHyVD5M7dQdFLPDp5kpuYkY6T6inLlQdbVpYdWW8k1xfASwipMOxwESnMAyXaWW5hVuEI9NYvpj4SvM3zHmJQhWd8vBGpKNVD5xcQzKcrn7r/v9M6vJE8/A0LeHOkpKvP9UjjZWjysm/WqKYMIioibuU4c74xISA9+ngXnJb+9XKCpUaYvQXj4P9JoPP+yaCPl8S/PGEx7weXA1r3E6i6jJjpiSTUUH4ukjH+dKXfuaId47yzjRPtm52IEqGTYzbvkFzFX7MUlU0uLaS7jCEtAI0SZbwUF1cXj0BEM2IFoIPlq2IRQ9LZCLk4YAyofM1eaT4yjGewosNTciBnw6M2C7prE5SdEJDg8RnsEOx0nCK4Awy+4ZAL4+K7C1veQYd7e7omw+Ks0YEsML1AfRmCANjn43yZrK9lPv6s+k1/z3RPAtDAQxpN8/xUFoazdY9JgHUsvFW4nHzr8fXnZFkthCRnjtIsdDb2USXlfLibc1JfCXQLMgZ7tGwZ8P3uXXBF+lvhTaymGWT2jJnaCmLN5gR/xM+/EbdBcln5ZysgSfp/+nFuAA8raKU5fCOdP5bVUM8QV9T+a0iUKD29V9RD+6/xMwqzCyu9HItJFXpWokxeFl+W7cIMoPiPYMmqbzSM5JbALxT+rxztWc/v36LUZR1z1phuj9VpZ34vZ/RRxS77O386IMWhIsmsV+levLQAjvA9bypyfjjQcGrb9NSq52+L5DQeWUbYVgcmL+jd4pVG3Mxu+/SIQHzmWEH8ERkTrQgNqAtz0W8kLLnfyxN13wvMjiciqtbUPCBT7geIa2XHiERr9D1HYvOTSmB9MN4bkb7fQ6BQorqwMD2MIOs7eS5xSIYZl0XI29QD6+LfeQXGsW0bgG4N9sJf2u1EPao5vQ+LhKRVAVFvOs/HoL7BehVMvAfgDj8vNAr0go0s/ChLCGyUtm4COwqvWGY1001mndtJjxY4opYBddyrLVYItqYGCEgi5PLV/idLtp0s6V8iQpYEFOlM15ZY8ocVSh465q971qnPjN9O6lIv99yql2HwvjhLS5k/VoIO/kq/EK97dAWqHXWezEQhhsEgYlXzWZbPpZra/yoaAMPhvbW+WeN6niCuB44dn7Z/X+esurGPEYX+6d6r5O2floczeyTig2siK0QTKI35LH9p+UOPXPRaMzNPsnW7jR4tOvZY4j/5oLAsr+GXc7eCvhJEHEeWgwmCUj/i2fXeAsj8OZ8fyGoXSFry2Xr8+FGojlz6bI7g17xOi4vTEqZ62TFgoUQklvVl5PcRbaVZTlsfhBt4Yla9ab9NFr3rujAnvJFTy3SsUf9QiUBTKnozaifaGyu8vrF2FU3U0XkFbZOGWTG2dOdbzww+51FiVE6M4PQOmKOimumFC8egPXWIejJm/RxLHvzdhS8aEMRjb1+FwhAmsDCHmWyKaux/EQVzqdYhP0uXEZ0swCq15MkTSKXWFUgI75oSPX21PI91daiTlueYnMsawaKMtiAMngQqQt35bpNQEPhBvCJDAwMIYGBh+svq0L0qlvFjroVdUqcw6NeLbPSqW8X57fPnz58+fPnz4y/rRIkSASOLR+nNzz2f+/8D+QR/AUUoOOJdflg/Cv3wABRgQfnvvPn1G/y6YShmW7eLR+nNzz2f+/8D+t0mDCYNeuCQEYL2yDBgJ6YHB41/ju+6e+v/fIDz0D0YRCxkWF9tcco3zBLDSOm+MxDdgRgvbIMGAnpgcHjW5gwmtSpgqHsNfPcoD/f4Ln/9/+Cw5Qyzc2fo0CZ1kQgtegJQtOmeEvB8RtQSKGqp7DXz3KA/3+C5//W5gwmtTVAkJmDHCAxgFCWUIeNBXD+myU5L69+PxAiHRUCogdfwqGAUJdcxNjIQimYMcIDGAUJZQh41ukwYS9rwwMAc+y1w9gVEFFbIiAe+yR8pstNncEWpYwSBQeQwk835hovhN3WfDQtJZKxrAHPstcPYFRBRWyIjdJgwmtdDgSY3L2P+pP8mRUlLpV5tNxO5OmB4Yq8mWq0dSRt/qpD9HihhNsMhBrtjcvY/6k/yZFSUulukAAAsAALd6YbTUBD4QbwiQwMDCGBgYfrNN6+8/QCsO9dM/hVoc5cmscDz9AKw+fPb58+fPnz58+Mv6+TJkgD4MRDX4PpPkP1Pyvm/b9vvtc6nwng8kXrOQjGdO1cIkzw80IaUYyfBiIa/B9J8h+p+V837fsAYMJfva4MF5joX0vJ83998vdofz5+8ZlsPfSj6zkQbfHh8+9nQM60MWxcl7cF5joX0vJ83998vdofz5gJMGEx5z0Cq8gEn2//9ZfK81gOziByftNFBIVr1emU+Rmg77AwwpVaturKcjVXkAk+3//rL5XmsB2cQOAkwYTDe0gc27ruX3G86BAn4vL8MAwJMj7ae9u6EtJHnbMSBsjQ9txmq1bXr827ruX3G86BAn4vL8MAwASYMJjQ3wFFqgdczUkFKf/EhJyAMnAqbK6PFDlFU4ZfyE2Q4KGitIUpFzsNCazUWqB1zNSQUp/8SEnIAycAkwYTDecAWYIAAjiqpdyAWb6QKwJB8OzMjJv40O4toyKx8hwpUWgAloJlYSwdmCAAI4qqXcgFm+kCsCQQAAAAAFLWAAAAHkGaOxBf//7WjLBLVw0AHmQDfjvhfA5ybUC8ambd/At3CytNQEPhBvCJDAwMIYGBh+swq1v0DIKw+Z0VKvV1xGlOLEPQMgrD58+Pnz58+fPnz4y/sBAgSAeMFBcTnp8/TuB4UICNzsLfQ4LpnBwxkYt+OkY2zKQ6Dw1CTqR1vGCguJz0+fp3A8KEBG52FgHMGExEFgGtgMiBRywRlaRA1g++tM8XquQj9kZgZNt4arDQ0v4RUmIXiMbdbAZECjlgjK0iBrB99aZ4gHSYIJqKNox86AGjyBcWgrblKUPBLnaLXdJ4bQ0N6QHIUdAY4ywSMCa2OIJUpYQ0eQLi0FbcpSh4Jc7Ra7pAHMAAE7WKhswoahlVCXlIYjcNiwDiJ9XqQ45OxLTZIMitLIQJlShkInaxUNmFDUMqoS8pDEbhsWA5gwmGmfA6GoJ9OAxkt96GV8Rdb/V8+I4CeBbUkFOxBdGMI2QWi3OcBmkykD0NQT6cBjJb70Mr4i63+r4A5gwjC+dA1x+fuS1PnNfyB/g7iMSGPBEnjoWMUYkESwCSvsyNNTrTCGBZUMbNcfn7ktT5zX8gf4O4jEhjwHAAAAAA1RkLd8twTUBD4QbwiQwMDCGBgYfrMBBW8YaCsO+lt1iI5EN0mWXDxhoKw+fPj58+fPnz58+Mv65w4cgFjItgJ6d5PNt/zL7yul+wjrbAQgBPoK14QP8OeLzHIeVty4hDPzNjItgJ6d5PNt/zL7yul+wBJgwl+6nAlH5z7q/4zqBwhpuSFFwSGEZE8/u3+AYNB6lgOVIut4KlioTtBso/OfdX/GdQOENNyQouCQAwYTCfagW2m8U5qxNvAAs3B6Wo4R/1OBk84nLVZZWBuBZc6G21ClGLVMLRiEzbabxTmrE28ACzcHpajhHAMGEv1OcBJeUAXg7LgWCHycCadVifQqS4RaP0cRO+JhEVHZsengdOzAbCsCSXlAF4Oy4Fgh8nAmnVYnASYMJhVrQCxykAWBDr0w3iQ7fgif8mG3GL9+6SiKh0I+5TLWXgh3rtaFEsLHKQBYEOvTDeJDt+CJ/yAGDCYUQaDgxmD4Pw4s8E0l5wy8PG6XltUZjSoDONCteJVpJ541hRWhImy3L4MZg+D8OLPBNJecMvDxugJAAAAAAAADbhAAAAE0GaTwhkymEF//7WjLAZdSSHgr8Ld/dITUBD4QbwiQwMDCGBgYfrL6IR5A3PE8dpnitvn1d8+ieTkDc8T+fPj58+fPnz58+Mv64wYMgHfMUj/wEJ1mqhW64vQ4xCbQ2S+wlggPhANMK+9zYfTJI3NLGxhFZCN75ikf+AhOs1UK3XF6HGIQDBhNRKqAPa9EkI8y9qOovdqLdvWK4iJlE/l/f79/xUFQx2SuuYtS1DNTnQHteiSEeZe1HUXu1Fu3rFQDBhNKvCBjHipAYsrXlNw6Nstu5Nt9qIzuDPJPfhgXpYBvtbTmNMJlVuLX4x4qQGLK15TcOjbLbuTbYCTBhTSs+B+FJ0AUFwr9DlpuCCzVH8KhaXN/8z0oQi7VC18uPSQqs0wyIT8ubZ52fhSdAFBcK/Q5abggs1R/ABgwmlYIgUUIfoQUgWPFxkD/BS1s/KwFkQngpjAy4bZhfL64DkezuWq3dbiqUUIfoQUgWPFxkD/BS1s/AEmDCbBJCDAGiOcg8+KAHxjtNz+mgQSAstfbevK4ecW14BIhlOPJxkkzzmOaPAGiOcg8+KAHxjtNz+mgQAAJkCC3cczk1AQ+EG8IkMDAwhgYGH6y/VJvD0QInH5Nl7kN7TVtYsk8PRAifnz5XfPnz58+fPjL+uMGDIBXIGS/3vKr7UaoMs3vcLvbIKaKoKWb539JSPXesEvpktMxuc1emdcgZL/e8qvtRqgyze9wu8AAyMGE03SYDek/MQ6yPEmuktb9uixBeYBTgwVIXL3jxX6Odo/eTNyByY2GeT29J+Yh1keJNdJa37dFiC8ABkYMJsEKYNdQtkAEoqemhWEuC/YRc++9ONYlxxJHMRtFO2v50VHlxDuY7EtdQtkAEoqemhWEuC/YRc8ABkYMJdqnwBO9CjaBnlxSQg7UA2JKARNCz5j5h8aH8hPx9aiZoErE05OfvGCd6FG0DPLikhB2oBsSUAgABgwl29tgfnetLxlQS5ExZ/nlfi2YMkUm2QAsahiTpnEg8wbmcwGcVZ/VG/O9aXjKglyJiz/PK/FswAAGDCmlZ+Cxd104wFHqFZT3+y4IRNA+9H62+IQzY8tTBXQxbfCZJjxoWgVErLF3XTjAUeoVlPf7LghE0AABkAAACC8AAAABRBmnJ4Q8mUwIL//taMsBl1JIeCvgt3/pRNQEPhBvCJDAwMIYGBh+s11NzXL4Ac74nIzs+ewqaqLhNcvgBz58+cHz58+fPnz4y/rjBgyAEIEKN6AOKPKraTrTKd+N82DIeCRh0hIKMIpE2PXQr4+UwSo2EIEKN6AOKPKraTrTKd+N8AAMGEw36UF4F0OKddv15tY/e3P7WmZ4CfXtWliv53/a3J0DPNOprmQypeBdDinXb9ebWP3tz+1pmQABJgwmlXcgHsJCvbGuunt7TGD7TQPwfl3w7yp+1DCIdbViMteYUCGbELX2PUewkK9sa66e3tMYPtNA/BgACTBhMKtSBztsXwpsIBUAOXAxyerlWuGppEZ29tjhl5WtLf8mBX3AzXLKJVpGc7bF8KbCAVADlwMcnq5VoAAMGExq1YAM3n2Z4aSxHjiCcNgC6Qi6IQSMqWxKNWZJpjoQkfjAUrILS5jhWBm8+zPDSWI8cQThsAXSEQAAYMKaV3QBRPnOE+3O3r/tRCL8Ttn9vTDG8HqEJuBIsdm4Ro4QwyYyQxkKqFE+c4T7c7ev+1EIvxO2fwAAkAAAAAgdwLd5z7TUBD4QbwiQwMDCGBgYfrL6lY5BVCmvePeCk236Z2QlXDkFUKa+fPnp8+fPnz58+Mv66xYsgE7hQo3FX4aD/vrujCKPdv9NtC84fPL/xA/mRvi7KbnIgTaMA1U7hQo3FX4aD/vrujCKPdvgAAAYMJhqbYNyEgzSEIeTua8Rj+KTQ514nH/5s/7ym7rt48YF2osVvtVwPFQNyEgzSEIeTua8Rj+KTQ51AAAAwYTarpgBsBhuxWzjiizCPf5kPdrPytf3bV+8mzXQ8Sq8dw0WjVdNq5jA2Aw3YrZxxRZhHv8yHu1nAAAAwYU4hVwAvrVNF+gl+zzLyrx1udrqROEXbWrgezAonF5HkuWE1OGXDksCAvrVNF+gl+zzLyrx1udrqAAABgwmnTSAJuJBvi/eg+gQ/S0MXLcVJvjqhGzYrZQ3M46o5Gd02qzNQm4TcSDfF+9B9Ah+loYuW4qQAAAGDCYapaAPUSB3WOBcBx+RPygRoEktdXcJbj+xa52ETe60ZNWDJwFkIJrh6iQO6xwLgOPyJ+UCNAkkAAAAAAAMCbAAAAFEGaknhDyZTAgv/+1oywGXUkh4K/C3eJ9k1AQ+EG8IkMDAwhgYGH6zSfW+QVjQFje9GVlymuTKb1w5BWNAfnz51fPnz58+fPjL+usWLIAsY0OsKZH9ecaeomkp6MNk/Zv8/aTTPYNAUUtyd83mUbSMaRwZLGNDrCmR/XnGnqJpKejAAAAGRgwmGmTA8nopoTUPanu2UG805fdxw4WNgRtuy+28OYDbtM/Zx9EknEg6kvJ6KaE1D2p7tlBvNOX3cAAADIwYTWpuge+5CX3wEcfVjmJdgJtSTLf3JoXG7Q537r6WmFS0BkkrRpI2h77kJffARx9WOYl2Am1JAAAAZGDCX82uAQIZUls+56uiDW7Jhk6plngkwBK2/DvrmncxLnkbPUNYxPK9GCBDKktn3PV0Qa3ZMMnVMAAAGRgwmFTTA7rXCij5egAEbUvhHEnFHiKkgkftvv4BlRY1NaUyTp20UYRY14O61woo+XoABG1L4RxJxQAAADIwYTHnOQf1Mhe8MEg47ZVUDbpH+a3fGqOlU3nqCAmpZJNkoN0ureGWpmn9TIXvDBIOO2VVA26R/mAAABkAB3lQt3dShNQEPhBvCJDAwMIYGBh+tNKa7kRCWCQ4/aVCqiVqL+LdOREJYL58+V3z58+fPnz4y/rhAgSAbvALg1p0mwbXJsGVCKc3Y9UwJNR96cHZtVp8PQSng0Tu6yzYLgzd4BcGtOk2Da5NgyoRTmAADmDCYhCoD1mUaEc8FHVRqaAvzTU5qopSC3sv67hYJKB+v56N0Rnuabng+9mesyjQjngo6qNTQF+aanQAAcwYTTfjAflDeyEn+gCCB5gHPDw5NQvYCrwXPgcIdYv+6kyvtG/AoywLIEcz8ob2Qk/0AQQPMA54eHIAADmDCa6pMBY3+ZpkGV/D4/3/C8xCPygXT/yH3ljglaAH73WKKozaf+Qtm1yqrG/zNMgyv4fH+/4XmIRwAAcwYTXWvgdFvgkH38BpeTqD+/74RGAdo10APpWBFR3fzC/8fwAmBsKGzoxNa3Rb4JB9/AaXk6g/v++EQAAHMGEw3S8BBRHHkAuegP5gbCl/QTR0UY6nytDOtHA0zoYz2+7kRQAOWYp0SCiOPIBc9AfzA2FL+gmgAAOkAAGwEAAAJnQZqyeEPJlMCDH/5yqAwEviwB8SnhWiHT+ykT9Qj6XDV+wP//Af8Ol9XebW/eJNYarhU4avQqjvrX495VyrQIgGwQwuWfAbpCQrxjxGmoH29LqweRBCAd144x/OPJLzL3VKOd8TPo4i5jOBMSN3/NnhwnWyHZZOpvyU2uxBw0Q/Tybvh/71b5KvZINmya62299aO9BZq/FAWMZTF4pNtyIxKTbzObjhOW/NvZWGnaydIqkKVihal3M8aeqMWQHCi21G1/YEu4ZohBnx1squohMprdXPcwXFsLS1cf9CZOAm7KDiUrgum/awJXcENaRx1KBFaqeMXtfB46hzcOM9NnpkqkGuAcTszaIiwuDRjIERng863uS58UQvNzsWYdQ4d/hobG4MW59WznnwHiTzBEHEQSfKBUbhPrvOQDbOlDonR8H2WQAh4uAl0eSTK5Ima3LQLEq1jUGuxNkXcG7SYz4HbB4SCJLhatLFt+kdji563AS0xr/Sc2EXDT7Mq0wfAzTzQle72uxEVT1LvFtSRoms47WTX9t1Y4k2g+AiHvpQtVIf2KqH49TCDY0qvdlhnllzA7HuEqnp5PN6N/uY6FmF5pXInnWvx0aoNsEuFND1tIKrSBm7NdsRHkrSkdnDNOTaNEA6YL9iQlD00puh15lTIAslZU3ba6/73bgDFdCJBUwTQDyMRbATOOsfSC+6V9d2d/R0fi+jpAYDtDdATlUw70q+y1nHh79jBvWgJlwonpC2YfDRqWY8m+SoSHxSKxUj/Ld3/0sFEonRXdq8Yk9hAD3k45GMJ/MwoS/2+9vsarFiqKN0nXC3f8i01AQ+EG8IkMDAwhgYGH6zSpL/QFnpk1J7360NLcTPosc9AWemfnz2+fPnz58+fPjL+uMGDIAfd5hdlkh/2zcN5Ya/N04ZLRphjBSICgdBizcYajYIdWXIqQMWwW3Wfd5hdlkh/2zcN5Ya/NwABJgwmFTdAeJR793k7AHyC3jGGfi0rAUFzQNnPBdwNRzVAV337g0BDgcWupVKI8Sj37vJ2APkFvGMM/FgAAwYTSfUwQMlze6mahY8oBMD1z7OTxCLk3OHX5+3nVpKK7Er+SLXVuREGpylRURkDJc3upmoWPKATA9c+zAADBhMObCAWu5d48CLAgx7eWT+SBwzysS/bqfheCcZmPWRMCwiFSSC9Gxqk5ZeBa7l3jwIsCDHt5ZP5IHAAEmDCbdZsB9pLD37rSm5NHD4qcwKJLBqnr327W+/26DHMQqUqiU7V2q2tky2vtJYe/daU3Jo4fFTmBQAAMGEw10EC6sGQqB4Pv/lNznh3ZSMwCBF6q82FX3dmXiZNy5xAzOyMcCtMaurBkKgeD7/5Tc54d2UgABIBT7Qt3NSdNQEPhBvCJDAwMIYGBh+svtbzkkN6yPLMXWlCnQ06FZhOSQ3rL589Pnz58+fPnz4y/rxIkSAC5LjGkw2TwAioYO8xcz7j5yqtFNawtXhQPppX4kUdM/DHitVbVWsI4uS4xpMNk8AIqGDvMQAAYMJhZqQCJk9q7HO8yCpkC1l77MB8VThmKOBqAcQoEYNsswyIrPAjYFQcqT6pkpEye1djneZBUyBay94AAYMIuwyANeUCPWnFJfH2aLLCkr+l5erlr4u/+IrODx2MXCwGRdQTWLMUIV3xKGvKBHrTikvj7NFlhSQAAYMIwqaIEiLU7ggNwgAeKcI3pPS4+9k6IFgPxkEOzvisIg0oLtff4zzbQOgwdqPdSItTuCA3CAB4pwjekAADBhMNdSB9WtpDxlkMjDFo9K710ssf9EpusE9p5N+q0b0i3C6iXF5HFaZFfVraQ8ZZDIwxaPSu9AABgwl9WrASeTCdIiVJ+NYuN7B6EqJEJ4HQ8a6oe9bsbrPQwQIq09beOlB5CXsp+ZSeTCdIiVJ+NYuN7B6AAAAAAqkgAAARuQZrSeEPJlMCDH/2RHjVLPMDits4SKyOuJsJe766XkK2MsLAGUo1/FrJztKupVJTT9PF3s5hzaE5bBzF/1qOEuJ+JGNAkvUWw/DfftGkf9XI/prlJANmgRWYwke8guhc2Kc7A28QYQsfIBZ1Mv5WyqpawoB32eMHLrsTwsOw/s4WP3TjIDh5YBMcUTdPWRfkRS9IXbd/UDE9+Y4JZX/Np1wy74NDSm8jojtBbNI2zp0wW5e3SPp6Qh4xjflxPqObdprvrcJODz+90JVL1FczGtJeDRF/8Dzn8ApHhlw6g/R+RSetsIRdwCCF/ydkPQw0BkmxDXeYg8RkAUOb2z1SAl1QG4G4tLBQ7hWDX+cqoahFM9jjK4wtUm3jYB6tcEP79izK2gHYR3sYb6RwT0YBJ72CJUIBXAYL228pyMaBgwNZwYTFhF8ixbjyaRnAQVVookyIboWZbtELlyMHL/kvF+2Qz7Qg8dAVVammAebZf5rZIn0JhpCTZ04Xf0LE+teGab7Buaa2NaJKnzWY2HTkB3QTaA3nnExVvGtoNa6VLNNAw+TAM1AXc6Yr1U5qzyKALiB7oKKR1xCdvLFMq//l3Lzh+58KFhj1Mf5dAF4UELdwC8ud33826a/YKwqbKySwVnD4KC6vc6TzLgRkp1qY9a/kDI7NWlc5MI0BCaSqDLWOf5Tfs+FNJR5GJse+xp7JzlW1wn72LcUAY+1NumgSIPPIcz7MlIs9TwBCLp7YR6v+4my5DQWZCgyIW0jfgKj7eZPsUm62XJqJIF5uQtWl9hBaCH8jH6EZAoUnwdj1fEbKlhd9umbWXOPPGYqQkzVtZlr4FMGFmdk//6woaWV2KYR42YAoosz3xDqtK8fLPVljGHgFZ4DYREEF6cI1Ws3VUxXvN2MCLLwOLSkir7yTKCZ3mLegnFN+c9+DsoZdbVHLVk0vJ1NIrCmJ7oiNdCdEu8MsrfYN5NuCWYT0ea7uwSA598RSIhHdUZ4juBGs6JUmWr4TW8PcAYdtBDEyCL+gpkw4bILxGYuizThJxZ9/lKsW0yvidEEGjMSRgytAX/p/WIR5KzcCidWIWAwoA89zHDvW/4yS64JyyRnuxkYpzl0jZ45dxdFQ6G5NghX6iB+wh+8OR45ttNDuoPdgWK+f7ixDIovg22vIJnlXkFnQbItbXqTSA68lbm+r4A1uSQpbPV5R3ISZMa3V5f56qw/JLAN61CnROW1zfPbmo1xNWyBhlmoGOLdleFSPp6RXMbanReEG7YCifd0SrcALm0lGkHgTvLeIfo++4a1IqjEB+FOukyvZpTdFTDXBf2EclL8MBQlq+bUSIe7POnfglSjsejGXFM85S3MyQfBwAyVLa/+GJAOs6C1HaUB363u20EC7q3u/fODFNgtSID8u3kd5PE3Og0JHWnWRKPsSRYsOZpCZV4gZ0RNP8yPdkLLZFYOtUyKdTNiABjP0xK3jAfxvxAZn8KvYHXHzPd+QDpBQAJMQmOv7EeAWPrGzCE19LC3cQfU1AQ+EG8IkMDAwhgYGH6xcfQuQunTM2GxfKVKu6U1rvY5C6dM/nzg+fPnz58+fPjL+vEiRIBZAK6aR4eM1fN2Oi2Je7hp/h2XEJIBaRCBOyFRfZkacwaabZvdpGWVNnlsgFdNI8PGavm7HRbIAAzBhLt+mADDqDwAh1J/Q9tEwo4BBmiVDxC6KI9iZgzOeR4g2UwWHVBVQ1s6gYdQeAEOpP6HtomFIAAMwYS/cvwA810JLA+9Q8bmlICGMT/DQQyleQTdJhvYbWymYE6PIKxNWjgosn9YwPNdCSwPvUPG5pSAhAAGYMJnpa4CUY2E7hby11evYH6v5rt0cfEZPd1OVL/bUtMo3YDEpuLETjNYNsEo5koxsJ3C3lrq9ewP1cAAZgwmdWtg+L0DoIdn6/YVsc2I8An3esFJ7demLg5V/q1kZVRWbWakdJwkdGLh/F6B0EOz9fsK2ObEcAAZgwl7sXAH+31vJ1g5fxr8fx8XoX/fVhaBdB20626ng1kTdUpSUWbd6aStusbqcP9vreTrBy/jX4/j4gABgAAAAdlwt3iT9NQEPhBvCJDAwMIYGBh+s1ob7w9KukeGYve6MhVny672PD0q6T58rvnz58+fPnz4y/rhAgSAWbfIfsv/L4VpDx8Da7nP/aITdCu+LYeArMKmTpOShUPvo6X+e0422bfIfsv/L4VpDx8Da8AAMGEws74Eqgx/1xd3vL10n5F3ebndqamZ3/c+bIlBfJdkFlv68Vk+JGEkVUpqZVBj/ri7veXrpPyLu8gAJMGE1q60AihOkyTwfswwtd4y30Ph2cRhkoZUrfN3N9v9kVlcIgUr3XKIDuPWzBFCdJkng/Zhha7xlvoAAJMGE1q1cFfbPLzFCMWsZtl3w0Ane3iqvThZuEU7i6mGtkd0wD4W44s1LT2C5tfbPLzFCMWsZtl3w0AgADBhNbeuAvpYZTzHAlFFlA8YJd5swCkH5GG3mbJpr71aZRVIf22yPkh1VRENgvpYZTzHAlFFlA8YJd4AAwYTShugHrw+F3slTH/AsaxE/jeqIv2SAdLDzyNsPLFzJBJg0iQ0kBgl/WKCScxR68Phd7JUx/wLGsRP4wAAAA8ZIAAALwQZryeEPJlMCDH/0Wjf8+Y4CvTYrZivjHyeoO2QhXzsmkWJ/+UC6R8u2nn/b1j+tLIoagxvsbtvQidXXmXv4ZKHEaWA6wlbbEn17v6Qx2MgfJ74ChEsNEfTctBiRgwEDJdOFDomXtjtq/97BUrt90Btxm/2qxBnn/TOOzYWWaPeESI5rP4iZfWfN6jqHD/tw9dFeiBtazNbBTIz0eRh8ac5y02Tqh5sUs6uyO8kkTNFJAGyXaAGCB8jDQgjaPgLlvLbqe9v2IVUKmt0DLdB7b4lNLH8e8ClefRFGlsjMruLrDw7eImHiKyNxVG0LPHsquK/YKA5esysWk2Nl8eTNI0YlKPL4ZKhjjlpL5q7JjUdW4xT9pdM+rr18LfOol9kB7gLHV1oqJJtatZEzOwEuQKBGn/CI/RE3W2QynT5NaMu/l93UgBVlk++8rjiTBXJJ53shdTUrapj3ZDDp2dZPU2eeM1WmTeMv5wlYU1UQ6v6oeQ3cWwXWCs9nZjjXn6ozgOYKlEuMkkZfsuGzPPdMnfKjUVVFzQtqSuoLs6K2cH6gAqmZpVR3uPAx7TJB+4FFRm9Bhdi5kmIl8LF17nOn4t2uuuf6HIt2yPwc7lR42ihLJVloN043XdOnROD0XsxcXDm7cZJX0oWrixtMwhhvPezaC36gA5NzTqdRgKlo/DpMfMIVHOaqv92kYqDAQ1lFnCVRADlULTXgCT2yZObbogAaK5tJrz32au/Fgvd8dEbKoU466/H+L20yxpJDtZdg9MkHjX1okJFkNJIjVEkoPzSfXXv3mwf/X8V/2Ty2a9CFGlfuAIEN0/lZ6C4KrD0kgEqlv1G7q1R8zSlR3eEJwpqPAlLSvad94KV7vVM/bzbGDhLhtXjreEmsHl6d/S8Cha1MRE3He93GigUi4grUTE574bWmon3x/kdXUtVFaLqzDyweLa6Qsiwl+0+lIb9rqpmtiT11McROixZH9e0MJov1+Z+GYLX+imqeMcFwWJb8Ld5w4TUBD4QbwiQwMDCGBgYf1MHfS8ZVAMfdJr7PGVvnt8+fPjL+o8ePIA74rsYAZlBtTzD4M8gcE8Ay6FhhBXMXsZ3io0MPGhUDUR3xXYwAzKDanMfAA3MGEV37sDtzcyf7/IQH5Bphn+CLxYp+Kkv1F/RgOnoMbVYx6JuMtoOnV1Xbm5k/3+QgP0FMADdhg/Su+pUgCcX5SD589AHljq17aSZXBzWfo0EMqNxyAiiPEDCZrIEHTgsG1wSLrmQTs2WBsDT4xmVI9ngYyGcbFDae2PqiE88kSbfVPbkPpU8a/9HzEh5Y6te2kmVwc1n6MAAAAAAAA4AAHju8YYOpnvd+pzwCV7hQ8ZqdL89vnz58AwIfzkxPrStj0+MdA0Iw3D7mDnyBG0D8B4BxGnGWtqZY3Ah/OTE+tVspjcDMGEz3tYBPb6cZZ8J4EBcMAxgY24v/6vRoQVI/ggPAOMXFVyzWTbE9vpxlnwm4i7DgZgwl+prg/8YwOjMQNuIBAUOAn/YjAJpBwb4nD/8B4BxEVNyQay/8YwOjMQLcQhXA2AJh7C3cShk1AQ+EG8IkMDAwhgYGH6zWra+SP3zx4Zi99dJ9Sm25PU5I/fPPnyu+fPnz58+fPjL+vEiRIBfg+RXoUWx9AgxOWRdaGLQvv9R3qvSLzAi3NNUhgCAQGC804Ttk6w7vvwfIr0KLY+gQYnLIAAMwYTXfKgDvkgmvoWsrU0YM4K+0C3UoOcja+0jEzYLZ4TBq29/Febx9HziFim3HfJBNfQtZWpowZwVAAMwYTarvgf/Qb3njCGoYYKO/LKmvPP3rcjodAnX8FuBqL5IXCe+Ijj/TxRlqktmP/oN7zxhDUMMFHflgADMGFN+k8AgT28nAOprjEH0L7Ri9eU664a3XaSI+oCra06St3VlafcgA1FXxTYxAnt5OAdTXGIPoX2gADMGE1blIBSaSiVLB5yYr15/1gt1GM3wvQfYWzKFdG7hUoDIuxDAgNW8mJGTrblCkUmkolSwecmK9ef9YAAZgwl7sdAEq0DdcHCze4TE0v8Jn9gfiB6HCOwf73h2pcyU1ieEC1e50oAYgaqIsjZQbASrQN1wcLN7hMTS/wAAydCQAAA1dBmxJ4Q8mUwIMf/nch2zc+wvvGoZrssDCHU/BYwOCSr3r9W9hcCYq64y/lpx2MnS3PNC4HCPqTmvqjqf9Q6S5Hx/shNwujNrCxVKLfBbURtveVsugFDi7qYYbdrZLTst72A8KzgqP8kViY8p0eYKIUQeLF/H2NjTcIVetgVaAvBzilVxM3X5ybuwPhLn6A33IbQEYEW5BdzTOWniPSp7tAZrxyBaBhtrweDVVX+zPZFwAAiKRkHboKzY5Wspw8v/cDPpJjEmQ59NYXaZZl2JnZR4yzqrB+Y0xZQwmt/hDwJGOTZJ3kRMHpGu653/rltqpDjjBkR+nVczWPBjDEIBmzSsvue711vk4epSxRH/DXTAnIL9JdZq4b+lJ4Q+dh162CSSoWcOdrucIiZ1ZQIjEyc1gFRSx2xfBH3CbRgxMsybfgr+0orZRi8Rjc6czOHdEN79tinFJuxhKrHBfFoUBGcZ5/pfwxuB5gNy+mYlwcJTEvChNP3iuQCqiPaGoL3j1zvwTmUYOGa+NeBaFGmStXSLaVfWt9cJMYaLbhckA5No0eA3i6ONwMtJ4HXT8E8tThXoA+DQxDbJ3T7dLeSLs6XoUNZ67IYltF9ibH+doXyutduUhAQxAztFJwitjQGNrXQJbmeIVRIYvEzCzc+1odLrQZdKXI7Ba4AB8RoMhKK4ElkfzpGiFcgqqZxNkbhz6DzOQ4TkNLO7URc3EbvoP6uEZFnVqlUiHDtMTY23h/xTwFAcHE2JWDjD0zoCCR4EkLjWsNivhwul/kLWeEM7U9GCqbcdlPh0LrD3xHWksdi6p1gnQXOWIUSoub7mQ8Nhje34dDRPAeToHs/U20scM3yi4urDf6EV+gJFTC1CaSwgnbhGQOU6UfzbSohTYV4YxRwTWGMDZAPgm0BZOKev1n6VG/Z7gLPByI6N9B6MXC4KrcOHPz/isXV0Qf9ga3ACHu2HcgT/EhgE7qdHDe/dVL/D6bX6/nr+eagTHBwwIrEguVmmMmU+4i1iqxWmnjho3dRUwTwW1efrcN0kpX+QNM40nzqsWj/X9OUb/xNnOwBi9z4GqDb1FLf/GaJavrIkIgTWfRYy96xwddXzfs2hKTRydO0oaMfvJ6Sy6WJKTMgJzWg7dMbsALdxLbTUBD4QbwiQwMDCGBgYf/MHXT8KE+GDyHz2+Mv6YwYMgDb5zoBEQXyB4J9/m/3+AgQ89EBHlhOoP8APwGLuh6JWQ3jW3znQKIuR8lemgAADbbDB0rmu+mGgPSn8N7XJhoPnz0+fPgCaaTJwvOluW7UlXqmS1+u6IIejtqEqK7mNb69/Ghb3vege5iTkF7NZX22ta180xv4jJW173vc1aTDB7ebpppMnC86W5btSUADdk2GDBLqZyD4PZSdeQ3IT8+CeZ3UWtq6knQEP6vY3/4TR8UIumvB9iA/Hs2UYRg+sMvmZWy6MouyRxIhMFF03TdGfg9lJ15DchPz4JABuybDB1M6u94ZLAfPVKKYOGafnyu+fPgDD9/0BObcPAx77i0DB0Lxv8hAsQK4Ju752GpaWH7/oCc1x4Z52rQADuYMJe7FwGBm4JHa/4YH+oJ6gJ8oI9J/2j+Q8ADd3zy61ksDNwSO1/jD2oSqQAHcwYTajVgQV6DHd69OQQAfwC/iAv8FL7iKx9Ln1jvm5TUpgr0GO710yHwXgLAAO4AADM6C3cx0k1AQ+EG8IkMDAwhgYGH6zCza/GTnylAFWd+CWIhQV4vk8ZOfKfnx8+fPnz58+fPjL+uECBIBao5lsB75AyDNIV/GARPiVSoIMK6tcJLrDLb3ijeUNLFy7wYlqpqVMtUcy2A98gZBmkK/jAAHMGE2raoADep7OlBXFmOiA/vRvOfRsjToTL/51ETULVlaJd8c/27j5s4UlrDAb1PZ0oK4sx0QH96NgHMGE1q74FeXNwqxg9iYSqfTQArBh9ApYu51vQ2X+GsBkpqJmXt4vuggeILK8ubhVjB7EwlU+mgBQBzBhNXgrAoDhqEaoyVQ5EHiIHuHRLX386VvPhHgyGirjKinAGPk2xka5FbrspQHDUI1RkqhyIPEQPcAdJgwpncfAHSt/NZHPrS4opJU/OmN9Jg5u8fmB39HvTuy23kOYfQFh/Gn6uc62odK381kc+tLiiklT86AcwYS91vgPZzSov4E6rqeztgR9Ok9T2P/bxC6xaEPIdqqqOWev3c5gYB9hwYy02C2jbV7OaVF/AnVdT2dsCPoAcAAAAAAAA2jQAAAiRBmzJ4Q8mUwIMf/RaNwFdVEE7M3eeGQRpMzSK/vF7+BDM3w+GAGIxYizRog5RlX66ZsymlkUTxiopxb0a1yXUv1qEnbjY/iGYF9/dX2gnaQpqB5fltqRTlxT8gFBxnCW4aYJQsnS1zniqJYQ21c61JFPdjWbDgnPVtdzOR0lZe8DcpQLuf/nYbYmSQjogXNe9duq1krqST8M4ttFP7yYG2FyqhaBUvhGgo0iGchfN7y1y2jyNPsZmD19ffFZz3B4zy2V/AJbuM8W2sr/TPqyPTGXfRV6+CAXf8IzUD4f3pOHNwKg3QHqS0TgiFxs4DCsgJaMe9jB2HG6Y9Xf6hQgBe2yhyGjtNCOKFnyt+z2teEjsif6KUKm9+p2Tr4s9zkTeuItCumRNjr8Ptnk9DA2K7Sl/wIuP204lGvTNvcWkChHK30TSegAJ6nr/PRhiXj/IcOuh2Uj/VRCGqqXTvXV7yG2NvbUxyHCxJr77qsNw+i4iF99n4zSq1wKoD3CPK2U7BpPNNKJXmTcaTLLO4ffUJUXaOwXYVN+R8Q0xkg9c2k+luwFMPb5eXXdahGA1EU/oNcRgNcQFCi/22OiwuBT1yqb63YfXz1r/oqENBawdTfHvCtVpnFcxNPlyvrRHNdNEL5f/hZITlN4mUsIkrjO1QgeMtrnemR6FO9uCIWD4KMRiMFyAzudzTnvtyjqs2xBv4iTW9AIa0YfG86XsyYd9MMlGAUAt3KTxNQEPhBvCJDAwMIYGBh/8W30PwoT4sPI/PT4y/t5MmSAT1HP0llfv3kkAcQf8QBYvlkAhA2gID/2E/AMw1P2/7e8NeRAN/P+ff6X4iAOCfwhJ4wo8TP8EiXp+PUSIDxUykkJWhvKkMsV6EnGiYYFpm/bsJ6cZ3PUc/SWV79kkB0HxBYpZCEAAAAAAAAAcAAMm21rWtawwfs+rvsSHO1MxJ8+cAFVU7bNMSTyroU789LLUJ7zHoDbZwV6LXZC6ZTbwrj475cTvd2AowCvBwCzD1+E66eBybGW21DYoYcnSM9E6QroLR12+6KxvlQug7T3bZrtjYje1F+ZXGua48FrU/3s6UBtjQoeslVU7bNMSTyroU789LLUJ7zAAAAAAAAAAAAAAAAAAAAAAAAAA220yEBAQQgICCFcfPnz58+fPnz58+/51fPnz58+fPnz58+fPj/nV8+fPnz58+fPnz58+AAO8a1rWta0B2ta1rWGAAADvGta1rWtAdrWta1hgAAA7xrWta1rQHa1rWtYYAAAO8a1rWta0B2ta1rWAAwuoLdzlWTUBD4QbwiQgICCEBAQQrj58+fPnz58+fPn3/Or58+fPnz58+fPnz58f86vnz58+fPnz58+fPnxl/jCBAkAAAAAAO28ePHjx48d3d3dwAAAAAAAAAAAAAAAAAAAAAAdt48ePHjx3d3d3AAAAAAAAAAAAAAAAABgAAAAAAAdt48ePHjx47u7u7gAAAAAAAAAAAAAAAAAAAAAA7bx48ePHju7u7uAAAAAAAAAAAAAAAAADAAAAAAAA7bx48ePHjx3d3d3AAAAAAAAAAAAAAAAAAAAAAB23jx48ePHd3d3cAAAAAAAAAAAAAAAAAGAAAAAAAB23jx48ePHju7u7uAAAAAAAAAAAAAAAAAAAAAADtvHjx48eO7u7u4AAAAAAAAAAAAAAAAAMAAAAAAADtvHjx48ePHd3d3cAAAAAAAAAAAAAAAAAAAAAAHbePHjx48d3d3dwAAAAAAAAAAAAAAAAAYAAAAAAAHbePHjx48eO7u7u4AAAAAAAAAAAAAAAAAAAAAAO28ePHjx47u7u7gAAAAAAAAAAAAAAAAAAAAM8OAAABTkGbUnhDyZTAgx/+wSUf/oFgh36ePn2uxBcyw9pcWxqpXTmSs8+NMr38DwM4sKg9UwuhjAAD1tRwREPAkrX0W2QI/1X5aLCRblo4/cfqCG/XiKbGm8yi8C/fDazWLX+2PVRCJhRomXojef4WqITKZ6wVoPrMHvwyqNDkXWdMIX7voFYPAvOSUkAP+bRC1ZsqifaAeSixA+sFczD72gPpPhEdIGWLVWV36IRmwBzgvWfP009Ct3Do1MvnutvotAon4Bp/yEp4Lok/nlYpfemD6tBqYEvU/dUjN/hq0ivQ4c5y6atg8LB5ACNsvKtnr7nJT8AZ1ZtVfjniRItjQmvU6+dlfaaOdKmA3uv0RrbaAU735a086wyinc9CZGFyUONwtAwrHJjQ3jVTeWYBWN0IKY2Y261AZ6pldQVpQRgwdDcbm+vrnJpA5ToJ4skiu4ELdzlWTUBD4QbwiQgICCEBAQQrj58+fPnz58+fPn3/Or58+fPnz58+fPnz58f86vnz58+fPnz58+fPnxl/jCBAkAAAAAAO28ePHjx48d3d3dwAAAAAAAAAAAAAAAAAAAAAAdt48ePHjx3d3d3AAAAAAAAAAAAAAAAABgAAAAAAAdt48ePHjx47u7u7gAAAAAAAAAAAAAAAAAAAAAA7bx48ePHju7u7uAAAAAAAAAAAAAAAAADAAAAAAAA7bx48ePHjx3d3d3AAAAAAAAAAAAAAAAAAAAAAB23jx48ePHd3d3cAAAAAAAAAAAAAAAAAGAAAAAAAB23jx48ePHju7u7uAAAAAAAAAAAAAAAAAAAAAADtvHjx48eO7u7u4AAAAAAAAAAAAAAAAAMAAAAAAADtvHjx48ePHd3d3cAAAAAAAAAAAAAAAAAAAAAAHbePHjx48d3d3dwAAAAAAAAAAAAAAAAAYAAAAAAAHbePHjx48eO7u7u4AAAAAAAAAAAAAAAAAAAAAAO28ePHjx47u7u7gAAAAAAAAAAAAAAAAAAAAM8OAAABzUGbcnhDyZTAgx/+dwVf7h3FqgSDHS1OZ9hTryLdVco+swJOqkUYcqJgwyIgi3OW0EbRsp0YBctu+HW1C64tYxF8blH5mquPlti4+SmccUyo4Xx7B/tHmUWtOhaFHj3mWV0xq8wmrEFXRqTOj/Ou/p99Efu7AWRSM4MoX50XWqvuiO1S3ftZqRpfYKEb+2iyqj8zXn1KBEOxcn04T/JXswhdkpnWglALh+oPkZCnwqxUd5udHWihderRXzPFDWHwSQiPC10Gx2v1a7y28lwZRpVeHEheLITnQNSkNNShpZnr3t7JZt11A8VJUgehSeG58g46alhO3cmSQnqlMGwslDT2D1O9uM2qEkTQyiUaJpPMdSUO+CHpvvIEEPWJBlREy86RAIhNfTiCM5c8aAaH2iVRYRr+laG75bF7JMdygtHKVXZo4VdOZTvPg79j3zW0E0uutns4lyyJDC6Kz1q+xFi4WTRhBbKzA/BXcwgUyjAyHkZJ4HftsIjNuBf/okgplunbexoOvj+0PCHc1IqpeQb8jBP21P5Fz2bUlPP4cnm9hnygGE0SivFVHru3mh/CXfoHiTL8R6TDnruKsHTBM+dLl6NnA3j+XkC86NfhC3c5Vk1AQ+EG8IkICAghAQEEK4+fPnz58+fPnz59/zq+fPnz58+fPnz58+fH/Or58+fPnz58+fPnz58Zf4wgQJAAAAAADtvHjx48ePHd3d3cAAAAAAAAAAAAAAAAAAAAAAHbePHjx48d3d3dwAAAAAAAAAAAAAAAAAYAAAAAAAHbePHjx48eO7u7u4AAAAAAAAAAAAAAAAAAAAAAO28ePHjx47u7u7gAAAAAAAAAAAAAAAAAwAAAAAAAO28ePHjx48d3d3dwAAAAAAAAAAAAAAAAAAAAAAdt48ePHjx3d3d3AAAAAAAAAAAAAAAAABgAAAAAAAdt48ePHjx47u7u7gAAAAAAAAAAAAAAAAAAAAAA7bx48ePHju7u7uAAAAAAAAAAAAAAAAADAAAAAAAA7bx48ePHjx3d3d3AAAAAAAAAAAAAAAAAAAAAAB23jx48ePHd3d3cAAAAAAAAAAAAAAAAAGAAAAAAAB23jx48ePHju7u7uAAAAAAAAAAAAAAAAAAAAAADtvHjx48eO7u7u4AAAAAAAAAAAAAAAAAAAADPDgt3OVZNQEPhBvCJCAgIIQEBBCuPnz58+fPnz58+ff86vnz58+fPnz58+fPnx/zq+fPnz58+fPnz58+fGX+MIECQAAAAAA7bx48ePHjx3d3d3AAAAAAAAAAAAAAAAAAAAAAB23jx48ePHd3d3cAAAAAAAAAAAAAAAAAGAAAAAAAB23jx48ePHju7u7uAAAAAAAAAAAAAAAAAAAAAADtvHjx48eO7u7u4AAAAAAAAAAAAAAAAAMAAAAAAADtvHjx48ePHd3d3cAAAAAAAAAAAAAAAAAAAAAAHbePHjx48d3d3dwAAAAAAAAAAAAAAAAAYAAAAAAAHbePHjx48eO7u7u4AAAAAAAAAAAAAAAAAAAAAAO28ePHjx47u7u7gAAAAAAAAAAAAAAAAAwAAAAAAAO28ePHjx48d3d3dwAAAAAAAAAAAAAAAAAAAAAAdt48ePHjx3d3d3AAAAAAAAAAAAAAAAABgAAAAAAAdt48ePHjx47u7u7gAAAAAAAAAAAAAAAAAAAAAA7bx48ePHju7u7uAAAAAAAAAAAAAAAAAAAAAzw4AABI7ZYiCAY/+98nvwKbr2961qv//1ekcW98+EZiyPmiCtjAIdyhtAWYeR58cxDGzPY75nnFs2bMY4O181xZYZ9XzlzA7G90u/ocAEuhGQo1iq2OBw+2mWKwqYKi7uUqo8uahzIcWkKdaLqjf/qq1pP/vy9LbRuLS4plqJX+OW/JnXFWVexFyYWB/T/eWwjjhaHj1fQUE36AluJIkG+Atn94+XUVvqHWEHDIQj8JditzGQkBVEGz92yzH93BsYiA8p/95ib/0zqyhNlp1DB9RouXvwRQdm2J2woihGs9qssx44AhI0bQptXd/9kCXHzr6+cikpbqnYGKFsO/kfKLlwwJqE7hQ5+JiWP/yVMsH4C1InQ1noPfXsvxexOvApwc5D7ZN9JOX/AQHQ525ZzBKI9PUL2jRyQuiCMnp5naQ7AiSS1JrvieIBXLNYN+zG9fLIkRLv7mrN8Q5UTin091Gx5ZEG9wQ2fnclSaVlZyLA2u75HNB9XDoN30S0CgmTPuPYf3mQIxnMhYUb0iNmzU63hzzk2+tgpafBejm2gu1eIMcjRqvQlqbHppqI49M9vORxYoI+S4OZLYYmJZutlEufIIFGkwrYWKsiuhpYeUtqPsq9XfUyD3bXf33GkUEK3Noe1iROa7TgzUSgSCPhRtDSZvcpa7EbFZR9HyYKeJgmf64z13wxNy2MnB63PQZbWKV332sleMi/U/79qJg0u0M6q0EJPaq3P9UMQzf9mHtimqVCKU5CmvlmoSLGuHIzxaINvlg3mw69qX/KXJ9pk3fLc1w/pf5CGgXprQiyaCI0zhLixsqg0tbWv/GXrxaRLXOU3kms/fAoVsJR4CmEkUcIoSGfSeEAOU/eGp3RxyCiH/53exSOb6yOHDx53u0N2w03iqbsLBtW3hntbScYQUEZnVLZyPOWo/IKpc+q9LIM/EmR3WB2TKTIYRprPd+9FWSlhcPuZX6QeW9Z1iX7xTmUz2SWNtuqQSc+OvHdgAw82pQxoJIWCZwqEnh7JdkjfdTsZUGvlJz/UpCbu7LNgtkI6i1G08KruIUGfGyFv71udi7ANNLIILt8E0Z8l3dqE538tDM/pN7wDSB9oR//2MCz6ZK2+qYm1ES9awJ3tYP0Y9IHLEsGsrsySe+adaWUAEikDjBb4oQT/IxNZu+gag1DudP75DhV2YyFWhRJzmhq5Ag9Lrjwxn0qLwtjZYkaL/hFR1YuLwXG/VdaqOsEvQ1Z4htny7YS0WHt1LJWIkkIisgTvdparZVd9HWmUVXskfsoxtSJ3XGyWlXMVuyw+3qwGjn7KHjJxoRimCiIVv9V2ejsbQ7WbskIkwj2MrA8AZEYcPVQSvC+Ty/Jdru9uz7e4J5bW6NPkUrNdCqTlVOOXwKkgfLeqmknkxthaMZbBA1TWWuq7spodBbY481sMbA3T1y13nhb5LHfwlBpdXZFOtvMbwKqyAIjya9+09/tb4gDJvuoLOk9hbwHPr2URWup2ae+O3EfrI2dLYOOQ8R+ScuHWkUAvKv9JooMdWXhkQnKOPMi63Z7YmpaG8439M90u5hV/ywVjHmJGyEhHdFY5egdot1TttbmSf9GW3iJ5yAUCYLXXYj9wnPaToaa2WW7T4mthgmAqeo5jA0mgv9/qKCxqSFWCjGdqCZscYLMnjCDTv9sY9sNWDsnvihPSwZJ8lCia44M0FIGqBCe8A3VOaLCjxW48BlSPb+P6to0aotuRHCnHq0MxzuQezyijm5sYZOpwzbladsyiBDi+MR31AoKxUX72I9GYbvfQ3TJqUipL04s/pk6QkmyXEgWsqbS9Uk/yvX8uedsp2JA7+zxJeAU9eyoi/WWGUgW6+xLPCfTcPlthXi5thscHlfo9/U3CLJwSJaV2ElX1rjKxURvod3ax7qwkl49zu39El8Jd3eO0wda7IyYJ6cAhRBEZDP4TAWk7HPye+BzY+mVk4f6jQ/fTHx6GtT9sW98C6eJFN+pCp5H6DJpDnpmKMOmXUlLMDRGaslDZee64AcNnIzDSqPjS2hoffeV5VCK84Vhy14lEuqRClc0EMQNPip+dek9Xuo8EAPg2ZLX8vdlM3tvlqyqc4PCvOJR5YoRb7wCcEswOwLyZfdtYXpuHMKBkBnzCdUF/2QHnHNIf4b+uFUG9EsiYDtTq8ZtsvvTzVbep9t8QugAE5+U9csYQyy9DvmPc34UjQUVg1/9SODaSI6nz8P3jvTc0bn6UK6+DNou8WENUmqoT8e/p5ltHmkeEo1rSLNqinJQCtlDeTK9KjQO52gi958Ukt9ZNt2xfPf5mmIUEan+Q1sLp09moDT7QiqGFHJlxkVMHNwmMBbC3BL/6X1soFIEr+szrBiUTEOag4WnwcONeWPE2ZAC4+uX3Eu9DhfadG6Swo1JLf5BIW4yVUDE9h+gDvhNkUoVAWiXagaVnR9Iq3Et+G4eVQG/VdmXpVvhBPLtGg+MTPsH2oCAtYObIjKz+qHur+JgHg2enOZlnTFlSuW1kUZbLZb3Jun+wYwHo2ojyuEU5+1JCs2HS1BalxdFOmp2slJk1Vxilsfjfm07ShFyw+Ugd8B3BxTqeljX+iuV/bLDUbUQ5KKuMRSemtcS9r/WTf5mS5lxbdX/QkOBPajQ7vBtW4AAzHzeZNmbKjrg59iMKpqxDD/pTvG2SuAEvv00U1cH2lE31XNJ3wSYvT3oF21DnH8vHFP1su8mdNcvEpDVaykuuyWo0R2ffvuVnGX1O+PFBj9gAzwIRvuFClNIzcDpYt1EnIXjPk2RHf2Ywdx6+DpPzWmgkYsEyP/x4hXweLPpZbpRDSClAeYD4EUGrkM8Izvt8B5tZP1I0DKrJnrpHic3JcmHb+5Jisms2IPABVwpIY6neSPrAfHYlJOwSrV1TNovZnTshYQ+hPN5JTwHRG9HkrM+5D1yMLBMMbDWyNDgZxKJEDOjyaFUDjmMTbZAGxjcLcEAxkjzRPrgUkVgW6B7bSPtfGfKuq4bL8Ju+DLqrP6wTzQwCYgQ8c/WAl+5R+Zi7F+vQncBh1QyI7mrKyM8taJZpDac5the8edrCaSFnCGhnScl6AIqGPN+uAs9hNJIlKs4MiLWk2p1SqsSYfaDUfVF6Gyk8CHVVcETDwZGEshaLYIcDuTuWGQtcmyPng/HmjSimaB9dmaPWScsc08NLs5DS1vclvRYxPPca9O0PpbNgtrmE5GlJt5NE3WxxxYHgzlVekPQwiA5GbjH84J03yuWpqIHnDm5uZ8p5QTLx2T7OKM7EWC38HGKolWpN2Qjtak5lNrXx0KdP1QcQjscLVfpDZdKTzhfCQrWyri4N65Im8PwFERt9ssJJT44JAHdiHu0Phz85P5r1yhpItGRXxnc7ZKsLhfvHw6qeRZ05hO/DPYCKF/dUb7iA96LXCY1C8m9uWhPfl8ZshQigWA4jWjBePVXh1VBAdWXRub9lGobl24l+MkKlsxEl5KLYcmcKj3R2bOGCXFTnsoldSnacnVm2kwqY0sn0nS+EasxDOu8VSTTLQqcmy1pWkBVVsPgDMfPeAAk5R8bgeyJ+GMHgvtOd41OjwWnXn6Ct5WcCTPeSt6G19LiHx9hTii/vG68A5e62rT/G0d6yO7rOHgGjDBybtnBB2a2qTfm33bps8sFoln9hkkQqPPbGCIhJRJDw0woVDr+CX6rHdiJA+KtQF1l8952lEtjhN8XXGn8kEgXfmnkXlATWKomnH3kamCnbTY69JvlB8MNS42RVgLg06xtRnFdpEqo8QqOTJz/7zZZxJwuQHw6T8fpCMWkryuiUxTvuqnwfQ1LDHOCANelw25forEApocfJnC3zbnFl2Ozvhe6buWYjSGN+e1vmY2VQF4Rtx/+bn1GM6w8i8g1ms4zPUkO19y/MCi/X4tsfna+CtU2WDqfaudSgN+00jC0gZK1MLtSmpEpi3OkKbJ0JMDGKqc93LTV98MyzvP6J4luKFKuNFn00R3CANNa6WCwExAg4Q0KB1GVMXwsAmFgzTyI2/1AdmpUmo+uozEKUKhWWuPYOCCUOhwSc2ipx0hUvWrqrhmdLhVNIjrPYxKuKDPnkcAJLoKDwmPGXPxkxQ+1X7NJRnD4z3RTXno/Dve/kdjdSjIbzfFlPznhpMLpA+VVbJ925bcj69c8KfM+TiaULXrffrShZ00Xcng9v2xoMOFC+7LWaGo/LcMKOmXuDC79/vibHyp58EfhkrTd57AI/e63xrgr4QVagmjjaLQKuLFEa7VPTraxTHjW/6rs3XyqF8V3/deL2Kvmg4h40MURtuaN5bVerf+rDF0LqZSt1AmvP4YhbSOmmcsbqOEXl9Wkb/46ySgn8HEwusZS5g+KGgVZH7avhM1wIudAYfbbMw++CmP36Kg3jvGqjohBmO7zLkHcMtl9XxJWHyxHWyjs6C1Lu58SDdZ3uk2f+fzkVUN5aTv8mzB/3wQo5hLTmxKMFx0pBhJRVTrQbmEHmhVnI9BjZm4QlwLJUvz3i3unzSS8wV/Tii7ejRVOL/sqF9L1bVr45wwp5VB2etfvN7bOrSOjtEWwVb6YVj731WFkyIu6FvQfqEcBnwgafNuHZFGGx90iU58i9BWEwKi5IufSypEjU5tbBauB/0+V8m8ZgLXC+fztUdo2vKYsjHXuuAj7muYZsm9NC0QYVc6gfTqWkM4i7NDIRozsAvS4GxbKVCp4h1rVD36Rr+9zxfVYOYYEAsleIIoyTNX5fsQdahaO8cB7Kcc0BrkJDe7fctDPPSk1Kv24ZOmKLV7Pn9DWGO999LRzVgUaRds5V4Z545wD1/G7tL269eJJSkwE8mY78QvwEy2GU2vFsE74LgPYAlUurbKPN8PcYyp+KbQhl+NXmi1VT+pNIc6f8hZN6lKUpn0MGpGE+CWjZjWsn/oSh/cWKsajLjY2+7IsQfLkFhv9hm3KScZa4y6souDj7QCwEdX91HQY9PGrQsfuhjPC+SJfeNi4b1fRXG9n3aLz0GPJ7PDOfs2qbbi4Dxz9L0nxup0Bxpaw3fm9dax0CxX16PwWUqCjQMvdxyERjON+5h/SGdMAHsIOulYdLDZOpu2vtS5nuxtMOAIg/7EI2TBW33yEtTk5EaC8fl2s3JhEUCYs+vTMjna/rhxTGa0Pnpasy2hI6XgzPdplxMN9HrYUNFAEtVBcarAUic344eOajuT0csA699++n58lChMSr2JrJpOzKPU3MdUAqZrH58xYLUmSe9PHsQ2m84e5OWb08RCi49rz1Cn+F+kMTB7Fr/yCp3fCt5dY84lqNp/qtvus9YFyP3fDaIlRqLhu76CoSlzI1tguvusWRZHCbgEXSjyqD5Z0cO2kR0eI3f4KdslvjZE1ma7GiBWr7lxX7Ipu1mVlBJaAxSHthl4YYHoQ6ARBn0+iGvmbcW/mOJxp8np6+JfK3egO8qgNUiGARLHGuPdKurAGJ+pnPdbxduRkm7p8IetTra5KEpMgyZaCybVY3SNe4PWkw36D9WOrOUYg/E8Njo2vpjQPKeKumFiEoU3LFkFkQ4TWwr85wg+TzIcLG7f0l2zKyolvkM4AWdfJuFl5E3RES6M5N6c+CwriIAAMlsm3YgJ8MeCinsprvnVA1FCqNgobuq6DtTGG2XtJu1ALFgtnrSg7pQq6HE/KT5JOnKj8dAMNt7bPgWfzKyZ3uY6SKCF0SFhJ7Fpjg0mAWkBc6A6aHGefiTe8RDtRrEWY8hwgI+seKIjJXcV62s9I6IZGA0R611blSZnMavyOnq5HpDSaj0YIVTkVkKlxNvF8V372aNNjwaFexZX+un/wvJH7h5sNcdjfruQ2BNJnn637PyGKN3v3xgQSGT4BQ+MNQVeZpu6S7Mv81jC8y2A2uYm1LKZV4IJfWlVdwKx+akBqlYCMzkDZxNIxxOgG9F9VVPZvL9PJSOEzXfrD8yO2P+IvtcoT6v3EAjN3O4z1YcbOjF+Wzi92sHNe9YxB5DBJgUE/zehjb+9Ijhp4gempTlD/MMx7XaLZ/Rmi/1IgiBh3judrzFtfCyNUAIICTjPLOivBwZnYPCI1K/SBguFl7m1OUvfhnRzxdE+Mt43qCZhiPWj1QhNxz0i8VItYaUqGLBKDyGqyNNvBV5xTOf6Lhx7Hv6zEm0BjiIixCp/RlmcM6tE9V99KBKM/7EV+rjXRgLbfLmYzipHt6PYnH87V3Z0aG+2OrVUiM+iNpimuaoRYCdpmpxDgemwqntf5b1nx/wLdzlWTUBD4QbwiQgICCEBAQQrj58+fPnz58+fPn3/Or58+fPnz58+fPnz58f86vnz58+fPnz58+fPnxl/jCBAkAAAAAAO28ePHjx48d3d3dwAAAAAAAAAAAAAAAAAAAAAAdt48ePHjx3d3d3AAAAAAAAAAAAAAAAABgAAAAAAAdt48ePHjx47u7u7gAAAAAAAAAAAAAAAAAAAAAA7bx48ePHju7u7uAAAAAAAAAAAAAAAAADAAAAAAAA7bx48ePHjx3d3d3AAAAAAAAAAAAAAAAAAAAAAB23jx48ePHd3d3cAAAAAAAAAAAAAAAAAGAAAAAAAB23jx48ePHju7u7uAAAAAAAAAAAAAAAAAAAAAADtvHjx48eO7u7u4AAAAAAAAAAAAAAAAAMAAAAAAADtvHjx48ePHd3d3cAAAAAAAAAAAAAAAAAAAAAAHbePHjx48d3d3dwAAAAAAAAAAAAAAAAAYAAAAAAAHbePHjx48eO7u7u4AAAAAAAAAAAAAAAAAAAAAAO28ePHjx47u7u7gAAAAAAAAAAAAAAAAAAAAM8OC3c5Vk1AQ+EG8IkICAghAQEEK4+fPnz58+fPnz59/zq+fPnz58+fPnz58+fH/Or58+fPnz58+fPnz58Zf4wgQJAAAAAADtvHjx48ePHd3d3cAAAAAAAAAAAAAAAAAAAAAAHbePHjx48d3d3dwAAAAAAAAAAAAAAAAAYAAAAAAAHbePHjx48eO7u7u4AAAAAAAAAAAAAAAAAAAAAAO28ePHjx47u7u7gAAAAAAAAAAAAAAAAAwAAAAAAAO28ePHjx48d3d3dwAAAAAAAAAAAAAAAAAAAAAAdt48ePHjx3d3d3AAAAAAAAAAAAAAAAABgAAAAAAAdt48ePHjx47u7u7gAAAAAAAAAAAAAAAAAAAAAA7bx48ePHju7u7uAAAAAAAAAAAAAAAAADAAAAAAAA7bx48ePHjx3d3d3AAAAAAAAAAAAAAAAAAAAAAB23jx48ePHd3d3cAAAAAAAAAAAAAAAAAGAAAAAAAB23jx48ePHju7u7uAAAAAAAAAAAAAAAAAAAAAADtvHjx48eO7u7u4AAAAAAAAAAAAAAAAAAAADPDgAABjNBmjsQY//9FIRecvk8wZRhzUmtgE62LSia77RrQgEdEU9ZP4uvjygy4tJiQbaJfrXX9gG3mHlFS2c+G35TpAMWzG61nR/snKYamEFFJg0LtSINlDuWUkN7irx2c83EUUIKbzi8HYcD23pwpalDEVS1tlGBgHBEECAi9QCLl89ZH+ajuBdiHaywB0eI02SPXltRDNE07MenTeQ4O0ZJbe1KfRZT60oDgtIinsEhEtyb2lepUmKCZXrKxVcKWEXDrkyYTVhKR4c90kdRgfSZFJO4Dy5kmtOTmNtwh3mzfYL3GVqkaHXlpoJNfu5cvbHlb8VKhllfFneU0Vve9wuGsAuqWZL7iPML+FzN6gbV+oFSAFuUFBjOFdmV8qhyCFHjb0fY8Xq5s5C2aNv2AsTxu8T36qRkXeH46FIKQrbhtFQlQTjXCj03+4/jXfAgo3pJ7rwuwifa+xbYRsgRkKi9R5vjfRb0vEijQO/xq2R5nH4uauaCPMogsrubjFy3Tbh9bju8bf9QFYT68il685EJDGDKaUmdfZnNDQmouw8D/B+cnZwWHfBtZ5aWJqzLXqWigRcRvb3wRBrILmDYIc0WyVIkHY0lMNsfViFXeF+rBxo6+tQN8YtlPHo2crXQKmI76o/S5umtysnkQrbzApfZkMlLoVqSZCWb5BidoRwbnbRgxnGvhhjIkg7DQKdUkuMDe3n2fTPMLzaRsaAZGWleAJD6j7Tag0Bv1DY+xmLA/SYp+e2iWIjuXFvJbBBVMK/Ctks8o4rgCHtq+1Obl6oojdTM+MJKkBxg2UFHP4p4ppGtkPqAgDZIB+f8VUwoiUi82q0wdw/usyvO5WLqfbyQnvjThHdaUnwr7+ohrtYhNj/3q4mehRfktEA+cHfKmdPQC+bcylhXQLNLjKIo2K8OXuKgYLpkUjDPrk0JB3dZJkGAOivyAl68hq4QhTqEMbSIxFEcppMxVcic/8da74WjCyBzNcwDvHM4d/OUNW4g6NYsqk51K8j1FCqeNJAABoTAqF1XDNKGlZ88uEVyX3WYkd3xdskWFRQZXt19a0VFnx6y9i1Th0C0d7KBSOvz3VN7gmzUgBYsvl3tCXBdkApgkAmkzgGmsECfFTubN6GuolsRPtjKcfWr2Udi4wKu+ZYg5QW/U4F6HSCGJIymv0xL/2CJY7GSQuIcq+ioroh0jKQpFsjUbZQhk+bALlx36db+yr8cGRqrm4KyuQlj/ny70m/QYgAkBA3xWe1RfqhvD3mqswRs6cAFYpLNaC513Bl6g1vdXKDGDpJ1cvtIghB1DrAlsZPq4XiLcHOkx4NxexbdCNf8cgZY/uJ+46DcJmhKxxo8fLAX7yxEpa06eFid9be1IYmi2cBFfPE5kwBG8UgMtexPJWiAQ4vADHTRjw0abCmjG3HY380eQhDDniaDyJD4WoYWJHCWAAV/4MUcIJWTFVKLb7lyqvTC822OoiFg4RMn4pZd305DbsuDmLghZHGY0kCxgyTkdVZ8DOz++3W2zOmEZ7ba8trWk/5viJLwu/KwCXuNuXyn8eTreOzI1lT7KR5260lPA/fkji2kF8wkD50T489rX6UqyxUf7kBsf3VBRxXoQQo+zxTQsbcCY0nMbYI47vq4w/CHpTlQOqAI6VRgLh1BVLmWcZ3QGRxLRVuxl9xD59RfpfWURHxZnBojc7GKZ4gKoCU3h7OgqMUePQtf0xXB/DWDWXrnF+mJJGrccJBRFkP0p85d5AzgnuF2xkaGIReROgqHPcy79tBeCEV+Hrm6s1J0uSnXY/wxyc9ehl0XtaBqfQfrFZZEWiDiVOrRVkWF6y6I2C298jxHFFo40WGmDUPnEmzOVeHYHcTwwv9JnmgFJKF+fnOvgW5e9pqP05MYExwje81ImYLP/vxbSRDKp8HWu5v8JO2K9nhU+KsIs9VXDMwiS5JqiNPRd7yh5Fv3NyXQrlj6zA+FgLxEfvUrvDpFpByzn9CBjC7p5sdE8BvP/au3r983MmaORxSc5Js4aXiXds+8dBIU4ECMjrWD+NUIsdnqjOpaqzd9aDZYChTC3BHLCWEfRMBjScq1IPAiJmkKJwx0ut3yhYiklOS5eusncWH392nSH/rFg2ELdzlWTUBD4QbwiQgICCEBAQQrj58+fPnz58+fPn3/Or58+fPnz58+fPnz58f86vnz58+fPnz58+fPnxl/jCBAkAAAAAAO28ePHjx48d3d3dwAAAAAAAAAAAAAAAAAAAAAAdt48ePHjx3d3d3AAAAAAAAAAAAAAAAABgAAAAAAAdt48ePHjx47u7u7gAAAAAAAAAAAAAAAAAAAAAA7bx48ePHju7u7uAAAAAAAAAAAAAAAAADAAAAAAAA7bx48ePHjx3d3d3AAAAAAAAAAAAAAAAAAAAAAB23jx48ePHd3d3cAAAAAAAAAAAAAAAAAGAAAAAAAB23jx48ePHju7u7uAAAAAAAAAAAAAAAAAAAAAADtvHjx48eO7u7u4AAAAAAAAAAAAAAAAAMAAAAAAADtvHjx48ePHd3d3cAAAAAAAAAAAAAAAAAAAAAAHbePHjx48d3d3dwAAAAAAAAAAAAAAAAAYAAAAAAAHbePHjx48eO7u7u4AAAAAAAAAAAAAAAAAAAAAAO28ePHjx47u7u7gAAAAAAAAAAAAAAAAAAAAM8OC3c5Vk1AQ+EG8IkICAghAQEEK4+fPnz58+fPnz59/zq+fPnz58+fPnz58+fH/Or58+fPnz58+fPnz58Zf4wgQJAAAAAADtvHjx48ePHd3d3cAAAAAAAAAAAAAAAAAAAAAAHbePHjx48d3d3dwAAAAAAAAAAAAAAAAAYAAAAAAAHbePHjx48eO7u7u4AAAAAAAAAAAAAAAAAAAAAAO28ePHjx47u7u7gAAAAAAAAAAAAAAAAAwAAAAAAAO28ePHjx48d3d3dwAAAAAAAAAAAAAAAAAAAAAAdt48ePHjx3d3d3AAAAAAAAAAAAAAAAABgAAAAAAAdt48ePHjx47u7u7gAAAAAAAAAAAAAAAAAAAAAA7bx48ePHju7u7uAAAAAAAAAAAAAAAAADAAAAAAAA7bx48ePHjx3d3d3AAAAAAAAAAAAAAAAAAAAAAB23jx48ePHd3d3cAAAAAAAAAAAAAAAAAGAAAAAAAB23jx48ePHju7u7uAAAAAAAAAAAAAAAAAAAAAADtvHjx48eO7u7u4AAAAAAAAAAAAAAAAAAAADPDgAAAVNBmk8IZMphBj/+wSPwYvDPFc6D8DrqXQRD50XDKTRpl0rtgPpHChy8Zg6EiuaGulUZcoedi0c8DB8m8z0hh8fIqDV5HK1wvj0E/oYrCQskeU1z9Cvkw4w5wUNYlnXYr6ZjKbi5I25fcORKOTeJW0sVNg61KvheMp+TcHiA1v/NcpmdfvZAqMdlYR7cns9BuZ5ypZNLV7VPnsHibLlAuWNeB+FKHvMb7/2G32/KDycQc90RA8bhKZZ4R3TBF4OM6J9PnfiXr0xxYzapukfIk5tGaN3yPO23jotqaEBXeQ9tMpF6i4vxrQZV0Arbfwtr2L20t5yy2acZLQwxw+1wpfU2pQpso3F7QwcyWElvZE2xSKDGWEtbVT8TU0V+wTJvPDsGtzUkVW0nukA6wkr/Fff8W06FvVjNK3t2WGFnloOLAOuw/hKWsiIUac/WAU7u4BchHOELdzlWTUBD4QbwiQgICCEBAQQrj58+fPnz58+fPn3/Or58+fPnz58+fPnz58f86vnz58+fPnz58+fPnxl/jCBAkAAAAAAO28ePHjx48d3d3dwAAAAAAAAAAAAAAAAAAAAAAdt48ePHjx3d3d3AAAAAAAAAAAAAAAAABgAAAAAAAdt48ePHjx47u7u7gAAAAAAAAAAAAAAAAAAAAAA7bx48ePHju7u7uAAAAAAAAAAAAAAAAADAAAAAAAA7bx48ePHjx3d3d3AAAAAAAAAAAAAAAAAAAAAAB23jx48ePHd3d3cAAAAAAAAAAAAAAAAAGAAAAAAAB23jx48ePHju7u7uAAAAAAAAAAAAAAAAAAAAAADtvHjx48eO7u7u4AAAAAAAAAAAAAAAAAMAAAAAAADtvHjx48ePHd3d3cAAAAAAAAAAAAAAAAAAAAAAHbePHjx48d3d3dwAAAAAAAAAAAAAAAAAYAAAAAAAHbePHjx48eO7u7u4AAAAAAAAAAAAAAAAAAAAAAO28ePHjx47u7u7gAAAAAAAAAAAAAAAAAAAAM8OC3c5Vk1AQ+EG8IkICAghAQEEK4+fPnz58+fPnz59/zq+fPnz58+fPnz58+fH/Or58+fPnz58+fPnz58Zf4wgQJAAAAAADtvHjx48ePHd3d3cAAAAAAAAAAAAAAAAAAAAAAHbePHjx48d3d3dwAAAAAAAAAAAAAAAAAYAAAAAAAHbePHjx48eO7u7u4AAAAAAAAAAAAAAAAAAAAAAO28ePHjx47u7u7gAAAAAAAAAAAAAAAAAwAAAAAAAO28ePHjx48d3d3dwAAAAAAAAAAAAAAAAAAAAAAdt48ePHjx3d3d3AAAAAAAAAAAAAAAAABgAAAAAAAdt48ePHjx47u7u7gAAAAAAAAAAAAAAAAAAAAAA7bx48ePHju7u7uAAAAAAAAAAAAAAAAADAAAAAAAA7bx48ePHjx3d3d3AAAAAAAAAAAAAAAAAAAAAAB23jx48ePHd3d3cAAAAAAAAAAAAAAAAAGAAAAAAAB23jx48ePHju7u7uAAAAAAAAAAAAAAAAAAAAAADtvHjx48eO7u7u4AAAAAAAAAAAAAAAAAAAADPDgAAADxBmnJ4Q8mUwIMf/sElH9w+IepBAH76cblc3l9Rv3pSAEGWqQllqKXPDtMudzvW+2mjOXYnmCXtDofy9C8LdzlWTUBD4QbwiQgICCEBAQQrj58+fPnz58+fPn3/Or58+fPnz58+fPnz58f86vnz58+fPnz58+fPnxl/jCBAkAAAAAAO28ePHjx48d3d3dwAAAAAAAAAAAAAAAAAAAAAAdt48ePHjx3d3d3AAAAAAAAAAAAAAAAABgAAAAAAAdt48ePHjx47u7u7gAAAAAAAAAAAAAAAAAAAAAA7bx48ePHju7u7uAAAAAAAAAAAAAAAAADAAAAAAAA7bx48ePHjx3d3d3AAAAAAAAAAAAAAAAAAAAAAB23jx48ePHd3d3cAAAAAAAAAAAAAAAAAGAAAAAAAB23jx48ePHju7u7uAAAAAAAAAAAAAAAAAAAAAADtvHjx48eO7u7u4AAAAAAAAAAAAAAAAAMAAAAAAADtvHjx48ePHd3d3cAAAAAAAAAAAAAAAAAAAAAAHbePHjx48d3d3dwAAAAAAAAAAAAAAAAAYAAAAAAAHbePHjx48eO7u7u4AAAAAAAAAAAAAAAAAAAAAAO28ePHjx47u7u7gAAAAAAAAAAAAAAAAAAAAM8OC3c5Vk1AQ+EG8IkICAghAQEEK4+fPnz58+fPnz59/zq+fPnz58+fPnz58+fH/Or58+fPnz58+fPnz58Zf4wgQJAAAAAADtvHjx48ePHd3d3cAAAAAAAAAAAAAAAAAAAAAAHbePHjx48d3d3dwAAAAAAAAAAAAAAAAAYAAAAAAAHbePHjx48eO7u7u4AAAAAAAAAAAAAAAAAAAAAAO28ePHjx47u7u7gAAAAAAAAAAAAAAAAAwAAAAAAAO28ePHjx48d3d3dwAAAAAAAAAAAAAAAAAAAAAAdt48ePHjx3d3d3AAAAAAAAAAAAAAAAABgAAAAAAAdt48ePHjx47u7u7gAAAAAAAAAAAAAAAAAAAAAA7bx48ePHju7u7uAAAAAAAAAAAAAAAAADAAAAAAAA7bx48ePHjx3d3d3AAAAAAAAAAAAAAAAAAAAAAB23jx48ePHd3d3cAAAAAAAAAAAAAAAAAGAAAAAAAB23jx48ePHju7u7uAAAAAAAAAAAAAAAAAAAAAADtvHjx48eO7u7u4AAAAAAAAAAAAAAAAAAAADPDgAAABBBmpJ4Q8mUwIMf/talUAFDC3c5Vk1AQ+EG8IkICAghAQEEK4+fPnz58+fPnz59/zq+fPnz58+fPnz58+fH/Or58+fPnz58+fPnz58Zf4wgQJAAAAAADtvHjx48ePHd3d3cAAAAAAAAAAAAAAAAAAAAAAHbePHjx48d3d3dwAAAAAAAAAAAAAAAAAYAAAAAAAHbePHjx48eO7u7u4AAAAAAAAAAAAAAAAAAAAAAO28ePHjx47u7u7gAAAAAAAAAAAAAAAAAwAAAAAAAO28ePHjx48d3d3dwAAAAAAAAAAAAAAAAAAAAAAdt48ePHjx3d3d3AAAAAAAAAAAAAAAAABgAAAAAAAdt48ePHjx47u7u7gAAAAAAAAAAAAAAAAAAAAAA7bx48ePHju7u7uAAAAAAAAAAAAAAAAADAAAAAAAA7bx48ePHjx3d3d3AAAAAAAAAAAAAAAAAAAAAAB23jx48ePHd3d3cAAAAAAAAAAAAAAAAAGAAAAAAAB23jx48ePHju7u7uAAAAAAAAAAAAAAAAAAAAAADtvHjx48eO7u7u4AAAAAAAAAAAAAAAAAAAADPDgAABlNtb292AAAAbG12aGQAAAAAAAAAAAAAAAAAAAPoAAAEfgABAAABAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADAAACvXRyYWsAAABcdGtoZAAAAAMAAAAAAAAAAAAAAAEAAAAAAAAEbgAAAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAEAAAAAAsAAAAJAAAAAAADBlZHRzAAAAKGVsc3QAAAAAAAAAAgAAAEL/////AAEAAAAABG4AAAAAAAEAAAAAAiltZGlhAAAAIG1kaGQAAAAAAAAAAAAAAAAAADwAAABEAFXEAAAAAAAtaGRscgAAAAAAAAAAdmlkZQAAAAAAAAAAAAAAAFZpZGVvSGFuZGxlcgAAAAHUbWluZgAAABR2bWhkAAAAAQAAAAAAAAAAAAAAJGRpbmYAAAAcZHJlZgAAAAAAAAABAAAADHVybCAAAAABAAABlHN0YmwAAACUc3RzZAAAAAAAAAABAAAAhGF2YzEAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAsACQAEgAAABIAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAY//8AAAAuYXZjQwFkAA3/4QAWZ2QADayyBYnQgAAAAwCAAAAPB4oVJAEABWjrzLIsAAAAGHN0dHMAAAAAAAAAAQAAABEAAAQAAAAAGHN0c3MAAAAAAAAAAgAAAAEAAAANAAAAHHN0c2MAAAAAAAAAAQAAAAEAAAABAAAAAQAAAFhzdHN6AAAAAAAAAAAAAAARAAAOLQAAACIAAAAXAAAAGAAAABgAAAJrAAAEcgAAAvQAAANbAAACKAAAAVIAAAHRAAASPwAABjcAAAFXAAAAQAAAABQAAABUc3RjbwAAAAAAAAARAAAB0AAAE0EAABanAAAaAgAAHV4AACC6AAAmaQAALh8AADRXAAA69gAAQGIAAENWAABIawAAXe4AAGdpAABsBAAAb4gAAALAdHJhawAAAFx0a2hkAAAAAwAAAAAAAAAAAAAAAgAAAAAAAAR+AAAAAAAAAAAAAAABAQAAAAABAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAMGVkdHMAAAAoZWxzdAAAAAAAAAACAAAAIv////8AAQAAAAAEfgAAAAAAAQAAAAACLG1kaWEAAAAgbWRoZAAAAAAAAAAAAAAAAAAArEQAAMYAVcQAAAAAAC1oZGxyAAAAAAAAAABzb3VuAAAAAAAAAAAAAAAAU291bmRIYW5kbGVyAAAAAddtaW5mAAAAEHNtaGQAAAAAAAAAAAAAACRkaW5mAAAAHGRyZWYAAAAAAAAAAQAAAAx1cmwgAAAAAQAAAZtzdGJsAAAAP3N0c2QAAAAAAAAAAQAAAC9hYy0zAAAAAAAAAAEAAAAAAAAAAAACABAAAAAArEQAAAAAAAtkYWMzUBDAAAAAGHN0dHMAAAAAAAAAAQAAACEAAAYAAAAATHN0c2MAAAAAAAAABQAAAAEAAAABAAAAAQAAAAIAAAACAAAAAQAAAAwAAAABAAAAAQAAAA0AAAACAAAAAQAAABIAAAABAAAAAQAAAJhzdHN6AAAAAAAAAAAAAAAhAAABoAAAAaIAAAGiAAABogAAAaIAAAGiAAABogAAAaIAAAGiAAABogAAAaIAAAGiAAABogAAAaIAAAGiAAABogAAAaIAAAGiAAABogAAAaIAAAGiAAABogAAAaIAAAGiAAABogAAAaIAAAGiAAABogAAAaIAAAGiAAABogAAAaIAAAGiAAAAWHN0Y28AAAAAAAAAEgAAADAAAA/9AAATYwAAFr4AABoaAAAddgAAIyUAACrbAAAxEwAAN7IAAD0eAABBtAAARScAAFqqAABkJQAAaMAAAGxEAABvnAAAAGJ1ZHRhAAAAWm1ldGEAAAAAAAAAIWhkbHIAAAAAAAAAAG1kaXJhcHBsAAAAAAAAAAAAAAAALWlsc3QAAAAlqXRvbwAAAB1kYXRhAAAAAQAAAABMYXZmNTUuNDguMTAw';
            $assetLicense = _Merge($assetLicense, {
                'file_name': 'default.mp4',
                'asset_name': 'Default Video',
                'asset_note': 'This is the default video that are shown when an asset is missing license information or data.',
                'asset_date': '2018-05-13',
            });
            $in.step = 'step_end';
        }

        if ($in.step === 'step_end' && $keepAsset === 'true') {

            if ($in.extension !== 'json' && $in.extension !== 'xml') {

                if (_IsSet($loadedAsset[$in.plugin_name]) === 'false') {
                    $loadedAsset[$in.plugin_name] = {
                        'rendered': 'false',
                    };
                }

                const $key = $in.asset_type + '/' + $in.asset_name + '.' + $in.extension;

                $loadedAsset[$in.plugin_name][$key] = {
                    'plugin_name': $in.plugin_name,
                    'asset_type': $in.asset_type,
                    'asset_name': $in.asset_name,
                    'extension': $in.extension,
                };
            }
        }

        return {
            'answer': $answer,
            'message': $message,
            'asset': $asset,
            'asset_license': $assetLicense,
            'asset_exist': $keepAsset,
            'messages': $messageArray,
        };
    };

    /**
     * Give a file extension and get a mime type for that file type
     * @param {string} $extensionString
     * @returns {string}
     * @private
     */
    const _GetMimeType = function($extensionString = '') {
        const $mime = {
            'svg': 'image/svg+xml',
            'jpeg': 'image/jpeg',
            'jpg': 'image/jpeg',
            'png': 'image/png',
            'gif': 'image/gif',
            'webp': 'image/webp',
            'avif': 'image/avif',
            'oga': 'audio/ogg', // https://wiki.xiph.org/MIME_Types_and_File_Extensions
            'ogv': 'video/ogg',
            'mp3': 'audio/mpeg3',
            'mp4': 'video/mp4',
        };

        if (_IsSet($mime[$extensionString]) === 'true') {
            return $mime[$extensionString];
        }

        return '';
    };
}

//# sourceURL=infohub_asset.js