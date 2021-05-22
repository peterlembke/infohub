/**
 * Collection of demos to demonstrate InfoHub Client Render and View
 *
 * @author      Peter Lembke <info@infohub.se>
 * @version     2019-03-28
 * @since       2017-02-11
 * @copyright   Copyright (c) 2017, Peter Lembke
 * @license     https://opensource.org/licenses/gpl-license.php GPL-3.0-or-later
 * @see         https://github.com/peterlembke/infohub/blob/master/folder/plugins/infohub/demo/common/infohub_demo_common.md Documentation
 * @link        https://infohub.se/ InfoHub main page
 */
function infohub_demo_common() {

    'use strict';

// include "infohub_base.js"

    $functions.push('_Version');
    /**
     * Version information, used by the version function
     * @returns {{date: string, note: string, 'SPDX-License-Identifier': string, checksum: string, version: string, class_name: string, since: string, status: string}}
     * @private
     */
    const _Version = function() {
        return {
            'date': '2019-03-28',
            'since': '2017-02-11',
            'version': '1.0.0',
            'checksum': '{{checksum}}',
            'class_name': 'infohub_demo_common',
            'note': 'Collection of demos to demonstrate InfoHub Client Render and View',
            'status': 'normal',
            'SPDX-License-Identifier': 'GPL-3.0-or-later',
        };
    };

    $functions.push('_GetCmdFunctions');
    /**
     * List with all public functions you can call
     * @returns {*}
     * @private
     */
    const _GetCmdFunctions = function() {
        const $list = {
            'create': 'normal',
            'click_progress': 'normal',
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
    const create = function($in) {
        const $default = {
            'parent_box_id': '',
            'translations': {},
            'step': 'step_start',
            'response': {
                'answer': 'false',
                'message': 'Nothing to report from infohub_demo_common',
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
                        'my_container': {
                            'type': 'common',
                            'subtype': 'container',
                            'alias': 'duckduckgo_container',
                            'class': 'container-pretty',
                            'tag': 'div', // span, p, div
                            'data': _Translate('TIME') + ':[light][time][/light][a_legend]',
                            'visible': 'true',
                        },
                        'a_legend': {
                            'type': 'common',
                            'subtype': 'legend',
                            'alias': 'a_legend',
                            'label': _Translate('THIS_IS_A_LEGEND'),
                            'data': '[my_iframe][my_icon][my_list]',
                            'class': 'fieldset',
                        },
                        'my_iframe': {
                            'type': 'common',
                            'subtype': 'iframe',
                            'alias': 'duckduckgo',
                            'height': '40px',
                            'data': 'https://duckduckgo.com/search.html?site=abc.se&prefill=Search ABC.se&kn=1',
                        },
                        'light': {
                            'type': 'common',
                            'subtype': 'containerStart',
                            'class': 'light',
                            'tag': 'span',
                        },
                        '/light': {
                            'type': 'common',
                            'subtype': 'containerStop',
                            'tag': 'span',
                        },
                        'my_list': {
                            'type': 'common',
                            'subtype': 'list',
                            'option': [
                                {'label': _Translate('DOES_NOT_TRACK_YOU') },
                                {'label': _Translate('DOES_NOT_[U]SELL[/U]_YOU_ANYTHING') },
                                {'label': _Translate('THAT_IS_WHY_I_[:-)]_LIKE_THEM') }
                            ],
                        },
                        'my_icon': {
                            'type': 'common',
                            'subtype': 'svg',
                            'data': '[my_icon_asset]',
                            'alias': 'my_icon',
                            'class': 'svg',
                            'css_data': {
                                '.svg': 'width:60px;height:60px;float:left;padding: 4px;',
                            },
                        },
                        'my_icon_asset': {
                            'plugin': 'infohub_asset',
                            'type': 'icon',
                            'asset_name': 'common/duckduckgo-v107',
                            'plugin_name': 'infohub_demo',
                        },
                        'time': {
                            'type': 'common',
                            'subtype': 'value',
                            'data': _TimeStamp(),
                        },
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
                        'image_example2': {
                            'type': 'common',
                            'subtype': 'image',
                            'data': '[image_example_asset2]',
                            'class': 'image',
                        },
                        'image_example_asset2': {
                            'plugin': 'infohub_asset',
                            'type': 'image',
                            'subtype': 'png',
                            'asset_name': 'common/con00004',
                            'plugin_name': 'infohub_demo',
                        },
                        'svg_example': {
                            'type': 'common',
                            'subtype': 'svg',
                            'data': '[svg_example_asset]',
                        },
                        'svg_example_asset': {
                            'plugin': 'infohub_asset',
                            'type': 'icon',
                            'subtype': 'svg',
                            'asset_name': 'common/duckduckgo-v107',
                            'plugin_name': 'infohub_demo',
                        },
                        'my_intro_text': {
                            'type': 'text',
                            'text': '[my_h1]\n [my_ingress]\n[my_intro_list][my_image_text][about_images_list][progress_bar1][progress_bar2][progress_bar3][my_button]',
                        },
                        'my_h1': {
                            'type': 'text',
                            'text': _Translate("[H1]COMMON_DEMO[/H1]")
                        },
                        'my_ingress': {
                            'type': 'text',
                            'text': _Translate("[I]PLUGIN_INFOHUB_RENDER_COMMON_ARE_USED_IN_THIS_DEMO._YOU_SEE_A_COMBINATION_OF_WHAT_RENDER_COMMON_CAN_DO._HERE_IS_A_LIST_WHAT_PARTS_YOU_SEE_IN_THE_EXAMPLE:[/I]")
                        },
                        'my_image_text': {
                            'type': 'text',
                            'text': _Translate("THE_FIRST_IMAGE_IS_IN_JPEG_FORMAT_700_PIXELS_WIDE_30KB._THE_SECOND_IMAGE_IS_IN_PNG_FORMAT_BLACK&WHITE,_240_PIXELS_WIDE_AND_17KB_AND_THEN_UPSCALED_TO_640_PIXELS_WIDE._YOU_CAN_SEE_SEVERAL_THINGS_HERE:")
                        },
                        'my_intro_list': {
                            'type': 'common',
                            'subtype': 'list',
                            'class': 'list',
                            'option': [
                                {'label': _Translate('LIST_-_BULLET_LIST_LIKE_THIS_ONE') },
                                {'label': _Translate('VALUE_-_ANY_VALUE,_USED_HERE_FOR_THE_TIME_STAMP') },
                                {'label': _Translate('IMAGE_-_THE_PHOTO_IS_AN_IMAGE,_THE_DUCK_TOO') },
                                {'label': _Translate('LEGEND_-_A_FRAME_WITH_A_LABEL._YOU_CAN_PUT_THINGS_IN_IT') },
                                {'label': _Translate('IFRAME_-_A_BOX_WITH_3RD_PARTY_CONTENTS._USE_WITH_CAUTION') },
                                {'label': _Translate('CONTAINER_-_A_SPAN,_DIV_OR_P_TAG_THAT_YOU_CAN_PUT_THINGS_IN') }
                            ]
                        },
                        'about_images_list': {
                            'type': 'common',
                            'subtype': 'list',
                            'class': 'list',
                            'option': [
                                {'label': _Translate('USE_JPEG_FOR_PHOTOGRAPHS') },
                                {'label': _Translate('USE_PNG_FOR_SMALL_DETAILED_IMAGES_WHERE_YOU_CAN_NOT_USE_SVG_OR_JPEG') },
                                {'label': _Translate('USE_A_RESOLUTION_CLOSE_TO_THE_VIEWED_RESOLUTION._DO_NOT_UPSCALE._AVOID_DOWNSCALING_TOO_MUCH.') }
                            ]
                        },
                        'progress_bar1': {
                            'type': 'common',
                            'subtype': 'progress',
                            'class': 'progress',
                            'max': 50,
                            'value': 12,
                        },
                        'progress_bar2': {
                            'type': 'common',
                            'subtype': 'progress',
                            'class': 'progress',
                            'max': 50,
                            'value': 25,
                        },
                        'progress_bar3': {
                            'type': 'common',
                            'subtype': 'progress',
                            'class': 'progress',
                            'max': 50,
                            'value': 50,
                        },
                        'my_button': {
                            'type': 'form',
                            'subtype': 'button',
                            'mode': 'submit', // This is the submit button in the form
                            'button_label': _Translate('AFFECT_PROGRESS_BAR'),
                            'event_data': 'common|progress|affect',
                            'to_plugin': 'infohub_demo',
                            'to_function': 'click',
                        },
                    },
                    'how': {
                        'mode': 'one box',
                        'text': '[my_intro_text][my_container][image_example][image_example2][svg_example]',
                    },
                    'where': {
                        'box_id': $in.parent_box_id + '.demo',
                        'max_width': 640,
                        'scroll_to_box_id': 'true',
                    },
                    'cache_key': 'common',
                },
                'data_back': {'step': 'step_end'},
            });
        }

        return {
            'answer': $in.response.answer,
            'message': $in.response.message,
            'data': $in.response.data,
        };
    };

    /**
     * Click button close to the progress bars to affect them
     * @version 2020-08-30
     * @since 2020-08-30
     * @author Peter Lembke
     */
    $functions.push('click_progress');
    const click_progress = function($in) {
        const $default = {
            'step': 'step_read_first',
            'box_id': '',
            'response': {
                'answer': 'false',
                'message': '',
                'max': -1,
                'value': -1,
                'max_before': -1,
                'value_before': -1,
            },
        };
        $in = _Default($default, $in);

        if ($in.step === 'step_read_first') {
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_view',
                    'function': 'progress',
                },
                'data': {
                    'box_id': $in.box_id + '_progress_bar1',
                },
                'data_back': {
                    'box_id': $in.box_id,
                    'step': 'step_set_second',
                },
            });
        }

        if ($in.step === 'step_set_second') {
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_view',
                    'function': 'progress',
                },
                'data': {
                    'box_id': $in.box_id + '_progress_bar2',
                    'value': $in.response.value,
                },
                'data_back': {
                    'box_id': $in.box_id,
                    'step': 'step_set_third',
                },
            });
        }

        if ($in.step === 'step_set_third') {
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_view',
                    'function': 'progress',
                },
                'data': {
                    'box_id': $in.box_id + '_progress_bar3',
                    'value': $in.response.value_before,
                },
                'data_back': {
                    'box_id': $in.box_id,
                    'step': 'step_set_first',
                },
            });
        }

        if ($in.step === 'step_set_first') {
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_view',
                    'function': 'progress',
                },
                'data': {
                    'box_id': $in.box_id + '_progress_bar1',
                    'value': $in.response.value_before,
                },
                'data_back': {
                    'box_id': $in.box_id,
                    'step': 'step_end',
                },
            });
        }

        return {
            'answer': 'true',
            'message': 'Done affectimg the progress bars',
            'ok': 'true', // Gives an OK on the button you clicked
        };
    };
}

//# sourceURL=infohub_demo_common.js