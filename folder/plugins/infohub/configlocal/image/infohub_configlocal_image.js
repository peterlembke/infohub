/**
 * Here you select what images you can see. Then we can provide the best images for you
 *
 * @author      Peter Lembke <info@infohub.se>
 * @version     2020-09-24
 * @since       2020-09-07
 * @copyright   Copyright (c) 2020, Peter Lembke
 * @license     https://opensource.org/licenses/gpl-license.php GPL-3.0-or-later
 * @see         https://github.com/peterlembke/infohub/blob/master/folder/plugins/infohub/configlocal/image/infohub_configlocal_image.md Documentation
 * @link        https://infohub.se/ InfoHub main page
 */
function infohub_configlocal_image() {

    'use strict';

// include "infohub_base.js"

    $functions.push('_Version');
    const _Version = function() {
        return {
            'date': '2020-09-24',
            'since': '2020-09-07',
            'version': '1.0.0',
            'checksum': '{{checksum}}',
            'class_name': 'infohub_configlocal_image',
            'note': 'Here you select what images you can see. Then we can provide the best images for you',
            'status': 'normal',
            'SPDX-License-Identifier': 'GPL-3.0-or-later',
        };
    };

    $functions.push('_GetCmdFunctions');
    const _GetCmdFunctions = function() {
        const $list = {
            'create': 'normal',
            'click_submit': 'normal',
            'apply_config': 'normal',
        };

        return _GetCmdFunctionsBase($list);
    };

    let $classTranslations = {};

    // ***********************************************************
    // * your class functions below, only declare with var
    // * Can only be reached through cmd()
    // ***********************************************************

    /**
     * Get instructions and create the message to InfoHub View
     * @version 2016-10-16
     * @since   2016-10-16
     * @author  Peter Lembke
     */
    $functions.push('create');
    const create = function($in = {}) {
        const $default = {
            'subtype': 'menu',
            'parent_box_id': '',
            'translations': {},
            'step': 'step_render_form',
            'response': {
                'answer': '',
                'message': '',
                'data': {},
            },
        };
        $in = _Default($default, $in);

        if ($in.step === 'step_render_form') {
            $classTranslations = _ByVal($in.translations);

            const $cssImageSize = 'width:64px; height:64px; padding:1px; max-width:64px;';

            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_render',
                    'function': 'create',
                },
                'data': {
                    'what': {
                        'image_form': {
                            'plugin': 'infohub_renderform',
                            'type': 'form',
                            'content': '[download_assets][max_asset_size_kb][index_cache_days][allowed_asset_types][button_save]',
                            'label': _Translate('WHAT_IMAGES_CAN_YOU_SEE?'),
                            'description': '[image_asset_license]' + _Translate('HERE_YOU_SET_ASSET_LIMITS_AND_INSTRUCT_INFOHUB_WHAT_IMAGES_YOU_CAN_SEE_ON_THIS_BROWSER')
                        },
                        'download_assets': {
                            'plugin': 'infohub_renderform',
                            'type': 'checkboxes',
                            "label": _Translate("DOWNLOAD_ASSETS"),
                            "description": _Translate("YOU_CAN_PREVENT_ALL_IMAGES_AND_SOUNDS_TO_BE_DOWNLOADED._SAVE_DOWNLOAD_TIME_AND_QUOTA"),
                            "options": [
                                { "value": "download_assets", "label": _Translate("DOWNLOAD_ASSETS") }
                            ]
                        },
                        'max_asset_size_kb': {
                            'plugin': 'infohub_renderform',
                            'type': 'range',
                            'min_value': '0',
                            'max_value': '1000',
                            'step_value': '100',
                            'label': _Translate('MAX_ASSET_SIZE'),
                            'description': _Translate('MAX_ASSET_SIZE_IN_KILOBYTES_YOU_ALLOW_TO_BE_DOWNLOADED.') + ' ' +
                                _Translate('YOU_CAN_LIMIT_TO_SAVE_DOWNLOAD_SPEED_AND_QUOTA')
                        },
                        'index_cache_days': {
                            'plugin': 'infohub_renderform',
                            'type': 'range',
                            'min_value': '1',
                            'max_value': '365',
                            'step_value': '3',
                            'label': _Translate('CACHE_TIME_FOR_ASSETS'),
                            'description': _Translate('ASSET_IS_CONSIDERED_FRESH_UNTIL_THIS_MANY_DAYS_HAVE_PASSED.') + ' ' +
                                _Translate('THEN_WE_WILL_CONTACT_THE_SERVER_AND_SEE_IF_IT_HAS_BEEN_UPDATED')
                        },
                        'allowed_asset_types': {
                            'plugin': 'infohub_renderform',
                            'type': 'checkboxes',
                            "label": _Translate("IMAGE_TYPES_YOU_CAN_SEE"),
                            "description": _Translate("DIFFERENT_BROWSERS_SUPPORT_DIFFERENT_IMAGE_FORMATS.") + ' ' +
                                _Translate("SELECT_THE_IMAGE_TYPES_YOU_CAN_SEE_AND_I_WILL_AVOID_DOWNLOADING_IMAGES_YOU_CAN_NOT_SEE_ON_THIS_BROWSER"),
                            "options": [
                                { "value": "svg", "label": "[image_svg]" },
                                { "value": "json", "label": "[image_jpeg]" },
                                { "value": "png", "label": "[image_png]" },
                                { "value": "gif", "label": "[image_gif]" },
                                { "value": "webp", "label": "[image_webp]" },
                                { "value": "avif", "label": "[image_avif]" }
                            ]
                        },
                        'image_svg': {
                            'type': 'common',
                            'subtype': 'svg',
                            'data': '[asset_svg]',
                            'class': 'icon',
                            'css_data': {
                                '.icon': $cssImageSize,
                            },
                        },
                        'asset_svg': {
                            'plugin': 'infohub_asset',
                            'type': 'icon',
                            'asset_name': 'image/svg-text',
                            'plugin_name': 'infohub_configlocal',
                        },
                        'image_jpeg': {
                            'type': 'common',
                            'subtype': 'image',
                            'data': '[asset_jpeg]',
                            'class': 'image',
                            'css_data': {
                                '.image': $cssImageSize,
                            },
                        },
                        'asset_jpeg': {
                            'plugin': 'infohub_asset',
                            'type': 'image',
                            'subtype': 'jpeg',
                            'asset_name': 'image/con00004-jpeg',
                            'plugin_name': 'infohub_configlocal',
                        },
                        'image_png': {
                            'type': 'common',
                            'subtype': 'image',
                            'data': '[asset_png]',
                            'class': 'image',
                            'css_data': {
                                '.image': $cssImageSize,
                            },
                        },
                        'asset_png': {
                            'plugin': 'infohub_asset',
                            'type': 'image',
                            'subtype': 'png',
                            'asset_name': 'image/con00004-png',
                            'plugin_name': 'infohub_configlocal',
                        },
                        'image_gif': {
                            'type': 'common',
                            'subtype': 'image',
                            'data': '[asset_gif]',
                            'class': 'image',
                            'css_data': {
                                '.image': $cssImageSize,
                            },
                        },
                        'asset_gif': {
                            'plugin': 'infohub_asset',
                            'type': 'image',
                            'subtype': 'gif',
                            'asset_name': 'image/con00004-gif',
                            'plugin_name': 'infohub_configlocal',
                        },
                        'image_webp': {
                            'type': 'common',
                            'subtype': 'image',
                            'data': '[asset_webp]',
                            'class': 'image',
                            'css_data': {
                                '.image': $cssImageSize,
                            },
                        },
                        'asset_webp': {
                            'plugin': 'infohub_asset',
                            'type': 'image',
                            'subtype': 'webp',
                            'asset_name': 'image/con00004-webp',
                            'plugin_name': 'infohub_configlocal',
                        },
                        'image_avif': {
                            'type': 'common',
                            'subtype': 'image',
                            'data': '[asset_avif]',
                            'class': 'image',
                            'css_data': {
                                '.image': $cssImageSize,
                            },
                        },
                        'asset_avif': {
                            'plugin': 'infohub_asset',
                            'type': 'image',
                            'subtype': 'avif',
                            'asset_name': 'image/con00004-avif',
                            'plugin_name': 'infohub_configlocal',
                        },
                        'image_asset_license': {
                            'type': 'common',
                            'subtype': 'svg',
                            'data': '[asset_license]',
                            'class': 'image',
                            'css_data': {
                                '.image': $cssImageSize,
                            },
                        },
                        'asset_license': {
                            'plugin': 'infohub_asset',
                            'type': 'icon',
                            'subtype': 'svg',
                            'asset_name': 'image/asset-license',
                            'plugin_name': 'infohub_configlocal',
                        },
                        'button_save': {
                            'plugin': 'infohub_renderform',
                            'type': 'button',
                            'mode': 'button',
                            'button_label': _Translate('SAVE'),
                            'event_data': 'image|submit|normal',
                            'to_plugin': 'infohub_configlocal',
                            'to_function': 'click',
                        },
                    },
                    'how': {
                        'mode': 'one box',
                        'text': '[image_form]',
                    },
                    'where': {
                        'box_id': $in.parent_box_id + '.form',
                        'max_width': 640,
                        'scroll_to_box_id': 'true',
                    },
                    'cache_key': 'image',
                },
                'data_back': {'step': 'step_end'},
            });
        }

        return {
            'answer': $in.response.answer,
            'message': $in.response.message,
            'data': {},
        };
    };

    /**
     * Save the config
     * I can not let the button directly call "submit" in the parent because the event would
     * have come from infohub_render and the function should only accept calls from the children.
     * @version 2019-10-28
     * @since 2019-10-28
     * @author Peter Lembke
     */
    $functions.push('click_submit');
    const click_submit = function($in = {}) {
        const $default = {
            'box_id': '',
            'step': 'step_form_read',
            'answer': '',
            'message': '',
            'response': {
                'form_data': {
                    'download_assets.download_assets': {
                        'value': 'false',
                    },
                    'max_asset_size_kb': {
                        'value': '0',
                    },
                    'index_cache_days': {
                        'value': '0',
                    },
                    'allowed_asset_types.avif': {
                        'value': 'false',
                    },
                    'allowed_asset_types.gif': {
                        'value': 'false',
                    },
                    'allowed_asset_types.json': {
                        'value': 'false',
                    },
                    'allowed_asset_types.png': {
                        'value': 'false',
                    },
                    'allowed_asset_types.svg': {
                        'value': 'false',
                    },
                    'allowed_asset_types.webp': {
                        'value': 'false',
                    },
                },
            },
        };
        $in = _Default($default, $in);

        let $ok = 'false';

        if ($in.step === 'step_form_read') {
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_view',
                    'function': 'form_read',
                },
                'data': {
                    'id': $in.box_id + '.[image_form_form]',
                },
                'data_back': {
                    'box_id': $in.box_id,
                    'step': 'step_form_read_response',
                },
            });
        }

        if ($in.step === 'step_form_read_response') {
            $in.step = 'step_end';
            if ($in.answer === 'true') {
                $in.step = 'step_save_config';
            }
        }

        if ($in.step === 'step_save_config') {
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_configlocal',
                    'function': 'submit',
                },
                'data': {
                    'event_data': 'image',
                    'form_data': {
                        'download_assets.download_assets': {
                            'value': $in.response.form_data['download_assets.download_assets'].value,
                        },
                        'max_asset_size_kb': {
                            'value': $in.response.form_data.max_asset_size_kb.value,
                        },
                        'index_cache_days': {
                            'value': $in.response.form_data.index_cache_days.value,
                        },
                        'allowed_asset_types.avif': {
                            'value': $in.response.form_data['allowed_asset_types.avif'].value,
                        },
                        'allowed_asset_types.gif': {
                            'value': $in.response.form_data['allowed_asset_types.gif'].value,
                        },
                        'allowed_asset_types.json': {
                            'value': $in.response.form_data['allowed_asset_types.json'].value,
                        },
                        'allowed_asset_types.png': {
                            'value': $in.response.form_data['allowed_asset_types.png'].value,
                        },
                        'allowed_asset_types.svg': {
                            'value': $in.response.form_data['allowed_asset_types.svg'].value,
                        },
                        'allowed_asset_types.webp': {
                            'value': $in.response.form_data['allowed_asset_types.webp'].value,
                        },
                    },
                },
                'data_back': {
                    'step': 'step_save_config_response',
                },
            });
        }

        if ($in.step === 'step_save_config_response') {
            $in.step = 'step_end';
            if ($in.answer === 'true') {
                $ok = 'true';
            }
        }

        return {
            'answer': $in.answer,
            'message': $in.message,
            'ok': $ok,
        };
    };

    /**
     * Apply the image config on the stored plugin
     * Will get local_config. Now we will ask for help to store that config on the plugin config in localStorage.
     * @version 2020-09-24
     * @since 2019-10-19
     * @author Peter Lembke
     */
    $functions.push('apply_config');
    const apply_config = function($in = {}) {
        const $default = {
            'local_config': {
                'download_assets.download_assets': {
                    'value': 'false',
                },
                'max_asset_size_kb': {
                    'value': '',
                },
                'index_cache_days': {
                    'value': '',
                },
                'allowed_asset_types.avif': {
                    'value': 'false',
                },
                'allowed_asset_types.gif': {
                    'value': 'false',
                },
                'allowed_asset_types.json': {
                    'value': 'false',
                },
                'allowed_asset_types.png': {
                    'value': 'false',
                },
                'allowed_asset_types.svg': {
                    'value': 'false',
                },
                'allowed_asset_types.webp': {
                    'value': 'false',
                },
            },
            'step': 'step_check_config',
            'response': {
                'answer': 'false',
                'message': 'Nothing to report',
            },
        };
        $in = _Default($default, $in);

        let $out = {
            'answer': 'false',
            'message': 'Nothing to report',
        };

        if ($in.step === 'step_check_config') {
            $in.step = 'step_apply_config';

            if (_Empty($in.local_config.max_asset_size_kb.value) === 'true') {
                $in.step = 'step_end';
                $out.message = 'We have no config to apply. Exiting';
            }
        }

        if ($in.step === 'step_apply_config') {
            const $secondsInADay = 24 * 60 * 60;
            const $newPluginConfig = {
                'allowed_asset_types': {
                    'avif': $in.local_config['allowed_asset_types.avif'].value,
                    'gif': $in.local_config['allowed_asset_types.gif'].value,
                    'json': $in.local_config['allowed_asset_types.json'].value,
                    'png': $in.local_config['allowed_asset_types.png'].value,
                    'svg': $in.local_config['allowed_asset_types.svg'].value,
                    'webp': $in.local_config['allowed_asset_types.webp'].value,
                },
                'download_assets': $in.local_config['download_assets.download_assets'].value,
                'index_cache_seconds': parseInt(
                    $in.local_config.index_cache_days.value) * $secondsInADay,
                'max_asset_size_kb': parseInt(
                    $in.local_config.max_asset_size_kb.value),
            };

            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_plugin',
                    'function': 'set_plugin_config',
                },
                'data': {
                    'plugin_name': 'infohub_asset',
                    'plugin_config': $newPluginConfig,
                },
                'data_back': {
                    'step': 'step_apply_config_response',
                },
            });
        }

        if ($in.step === 'step_apply_config_response') {
            $out.answer = $in.response.answer;
            $out.message = $in.response.message;
        }

        return {
            'answer': $out.answer,
            'message': $out.message,
        };

    };
}

//# sourceURL=infohub_configlocal_image.js