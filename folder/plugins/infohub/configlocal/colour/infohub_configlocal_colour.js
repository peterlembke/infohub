/**
 * Here you can set the colour schema
 *
 * @author      Peter Lembke <info@infohub.se>
 * @version     2019-10-19
 * @since       2019-10-19
 * @copyright   Copyright (c) 2019, Peter Lembke
 * @license     https://opensource.org/licenses/gpl-license.php GPL-3.0-or-later
 * @see         https://github.com/peterlembke/infohub/blob/master/folder/plugins/infohub/configlocal/colour/infohub_configlocal_colour.md Documentation
 * @link        https://infohub.se/ InfoHub main page
 */
function infohub_configlocal_colour() {

    "use strict";

// include "infohub_base.js"

    const _Version = function() {
        return {
            'date': '2019-10-19',
            'since': '2019-10-19',
            'version': '1.0.0',
            'checksum': '{{checksum}}',
            'class_name': 'infohub_configlocal_colour',
            'note': 'Here you can set the colour schema',
            'status': 'normal',
            'SPDX-License-Identifier': 'GPL-3.0-or-later'
        };
    };

    const _GetCmdFunctions = function() {
        const $list = {
            'create': 'normal',
            'render_done': 'normal',
            'get_form_data': 'normal',
            'click_preview': 'normal',
            'click_submit': 'normal',
            'click_apply_config': 'normal',
            'click_file_download': 'normal',
            'click_file_upload': 'normal',
            'apply_config': 'normal'
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
     * @version 2020-10-19
     * @since   2019-10-19
     * @author  Peter Lembke
     */
    $functions.push('create');
    const create = function($in) {
        const $default = {
            'subtype': 'menu',
            'parent_box_id': '',
            'translations': {},
            'step': 'step_render_form',
            'response': {
                'answer': '',
                'message': '',
                'data': {}
            }
        };
        $in = _Default($default, $in);

        if ($in.step === 'step_render_form') {
            $classTranslations = _ByVal($in.translations);

            const $buttonMaxWidth = 'width: 210px;';

            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_render',
                    'function': 'create'
                },
                'data': {
                    'what': {
                        'title': {
                            'type': 'text',
                            'text': '[h1]' + _Translate('Colours') + '[/h1]'
                        },
                        'my_form': {
                            'plugin': 'infohub_renderform',
                            'type': 'form',
                            'content': '[color_selector][base_color_0][base_color_1][base_color_2][base_color_3][base_color_4][base_color_5][light_picker][layer_0][layer_1][layer_2][name][button_preview][submit][apply_config][button_download][button_upload]',
                            'label': _Translate('Colour schema'),
                            'description': '[colour_icon]' + _Translate('Here you can modify the colour schema.')
                        },
                        'colour_icon': {
                            'type': 'common',
                            'subtype': 'svg',
                            'data': '[colour_asset]',
                            'css_data': {
                                '.svg': 'width:64px; height:64px; padding:1px; max-width:64px;'
                            }
                        },
                        'colour_asset': {
                            'plugin': 'infohub_asset',
                            'type': 'icon',
                            'asset_name': 'colour/colour-star',
                            'plugin_name': 'infohub_configlocal'
                        },
                        'color_selector': {
                            'plugin': 'infohub_color',
                            'type': 'color_selector'
                        },
                        'base_color_0': {
                            'plugin': 'infohub_color',
                            'type': 'color_reader',
                            'button_label': _Translate('Layer 0: Background'),
                            'color_selector_name': 'color_selector'
                        },
                        'base_color_1': {
                            'plugin': 'infohub_color',
                            'type': 'color_reader',
                            'button_label': _Translate('Layer 1: Normal'),
                            'color_selector_name': 'color_selector'
                        },
                        'base_color_2': {
                            'plugin': 'infohub_color',
                            'type': 'color_reader',
                            'button_label': _Translate('Layer 1: Highlight'),
                            'color_selector_name': 'color_selector'
                        },
                        'base_color_3': {
                            'plugin': 'infohub_color',
                            'type': 'color_reader',
                            'button_label': _Translate('Layer 1: Warning'),
                            'color_selector_name': 'color_selector'
                        },
                        'base_color_4': {
                            'plugin': 'infohub_color',
                            'type': 'color_reader',
                            'button_label': _Translate('Layer 2: Normal text'),
                            'color_selector_name': 'color_selector'
                        },
                        'base_color_5': {
                            'plugin': 'infohub_color',
                            'type': 'color_reader',
                            'button_label': _Translate('Layer 2: Title text'),
                            'color_selector_name': 'color_selector'
                        },
                        'light_picker': {
                            'plugin': 'infohub_color',
                            'type': 'light_bar_selector',
                            'label': 'How dark layer',
                            'description': 'Pick how dark layer you want',
                            // 'start': 0,
                            // 'stop': 100,
                            // 'jump': 9
                        },
                        'layer_0': {
                            'plugin': 'infohub_color',
                            'type': 'light_bar_reader',
                            'button_label': _Translate('Layer 0'),
                            'light_bar_selector_name': 'light_picker'
                        },
                        'layer_1': {
                            'plugin': 'infohub_color',
                            'type': 'light_bar_reader',
                            'button_label': _Translate('Layer 1'),
                            'light_bar_selector_name': 'light_picker'
                        },
                        'layer_2': {
                            'plugin': 'infohub_color',
                            'type': 'light_bar_reader',
                            'button_label': _Translate('Layer 2'),
                            'light_bar_selector_name': 'light_picker'
                        },
                        'name': {
                            'plugin': 'infohub_renderform',
                            'type': 'text',
                            'label': _Translate('Schema name'), // The clickable text at the top
                            'description': _Translate('Give your schema a name so you can download the schema to a file'), // Optional descriptive text
                            'placeholder': _Translate('Give your schema a name'), // Optional text that show when the text box is empty

                        },
                        'button_preview': {
                            'plugin': 'infohub_renderform',
                            'type': 'button',
                            'mode': 'button',
                            'button_label': _Translate('Preview'),
                            'event_data': 'colour|preview',
                            'to_node': 'client',
                            'to_plugin': 'infohub_configlocal',
                            'to_function': 'click',
                            'css_data': {
                                '.button-width': $buttonMaxWidth
                            }
                        },
                        'submit': {
                            'plugin': 'infohub_renderform',
                            'type': 'button',
                            'mode': 'submit',
                            'button_label': _Translate('Save your settings'),
                            'event_data': 'colour|submit',
                            'to_plugin': 'infohub_configlocal',
                            'to_function': 'click',
                            'show_success_text': 'true',
                            'css_data': {
                                '.button-width': $buttonMaxWidth
                            }
                        },
                        'apply_config': {
                            'plugin': 'infohub_renderform',
                            'type': 'button',
                            'mode': 'button',
                            'button_label': _Translate('Apply'),
                            'event_data': 'colour|apply_config',
                            'to_plugin': 'infohub_configlocal',
                            'to_function': 'click',
                            'show_success_text': 'true',
                            'css_data': {
                                '.button-width': $buttonMaxWidth
                            }
                        },
                        'button_download': {
                            'plugin': 'infohub_renderform',
                            'type': 'button',
                            'mode': 'button',
                            'button_label': _Translate('Download schema file'),
                            'data': 'download_file',
                            'event_data': 'colour|file_download',
                            'to_node': 'client',
                            'to_plugin': 'infohub_configlocal',
                            'to_function': 'click',
                            'css_data': {
                                '.button-width': $buttonMaxWidth
                            }
                        },
                        'button_upload': {
                            'type': 'form',
                            'subtype': 'file',
                            'accept': 'image/*.jpg',
                            'event_data': 'colour|file_upload',
                            'to_node': 'client',
                            'to_plugin': 'infohub_configlocal',
                            'to_function': 'click',
                            'button_label': _Translate('Upload schema file'),
                            'css_data': {
                                '.button-width': $buttonMaxWidth
                            }
                        },
                        'preview': {
                            'type': 'common',
                            'subtype': 'container',
                            'tag': 'div',
                            'data': '',
                            'class': 'container-medium'
                        },
                    },
                    'how': {
                        'mode': 'one box',
                        'text': '[title][my_form][preview]'
                    },
                    'where': {
                        'box_id': $in.parent_box_id + '.form',
                        'max_width': 640,
                        'scroll_to_box_id': 'true'
                    },
                    'cache_key': 'color'
                },
                'data_back': {
                    'form_data': $in.form_data,
                    'step': 'step_end'
                }
            });
        }

        return {
            'answer': 'true',
            'message': 'Here are the render data'
        };
    };

    /**
     * Called when the GUI is rendered and the form data is populated
     * Now I can render the light bars for color 0, 1, 2, 3
     * @version 2020-11-01
     * @since   2020-11-01
     * @author  Peter Lembke
     */
    $functions.push('render_done');
    const render_done = function($in) {
        const $default = {
            'form_data': {
                'form_data': {},
                'color_schema': {},
                'color_lookup': {}
            },
            'step': 'step_render_light_bars',
            'response': {
                'answer': '',
                'message': '',
                'data': {}
            }
        };
        $in = _Default($default, $in);

        let $messageArray = [];
        let $messageOut = {};

        if ($in.step === 'step_render_light_bars') {

            $in.form_data = _Default(_GetDefaultColorData(), $in.form_data);

            let $massUpdate = [];

            for (let $number = 0; $number <= 5; $number++) {

                const $hueDegree = _GetData({
                    'name': 'form_data/base_color_' + $number.toString() + '/value',
                    'default': '?',
                    'data': $in.form_data,
                });

                if ($hueDegree === '?') {
                    continue;
                }

                const $hueDegreeNumber = parseInt($hueDegree);
                let $where = 'main.body.infohub_configlocal.form.[base_color_' + $number + '_light_bar_container]';

                $messageOut = _SubCall({
                    'to': {
                        'node': 'client',
                        'plugin': 'infohub_render',
                        'function': 'create'
                    },
                    'data': {
                        'what': {
                            'light_bar': {
                                'plugin': 'infohub_color',
                                'type': 'light_bar',
                                'hue_degree': $hueDegreeNumber,
                                'start': 10,
                                'stop': 90,
                                'jump': 8,
                                'width': 16
                            }
                        },
                        'how': {
                            'mode': 'one box',
                            'text': '[light_bar]',
                            'css_data': {
                                ' ': 'display: inline-block; max-width: 100%; border: 5px ridge; margin-left: 16px;'
                            }
                        },
                        'where': {
                            'box_id': $where,
                            'max_width': 100,
                            'scroll_to_box_id': 'false'
                        },
                        'cache_key': 'light_bar_' + $hueDegree
                    },
                    'data_back': {
                        'step': 'step_end'
                    }
                });

                $messageArray.push($messageOut);

                $where = 'main.body.infohub_configlocal.form.[base_color_' +
                    $number + '_hue_degree_container]';

                $massUpdate.push({
                    'func': 'SetText',
                    'id': $where,
                    'text': $hueDegree
                });
            }

            for (let $number = 0; $number <= 2; $number++) {

                const $numberString = $number.toString();

                const $lightPercent = _GetData({
                    'name': 'form_data/layer_' + $numberString + '/value',
                    'default': '?',
                    'data': $in.form_data,
                });

                if ($lightPercent === '?') {
                    continue;
                }
                const $lightPercentNumber = parseInt($lightPercent);

                let $where = 'main.body.infohub_configlocal.form.[layer_' + $numberString + '_light_box_container]';

                $messageOut = _SubCall({
                    'to': {
                        'node': 'client',
                        'plugin': 'infohub_render',
                        'function': 'create'
                    },
                    'data': {
                        'what': {
                            'light_bar': {
                                'plugin': 'infohub_color',
                                'type': 'color_box',
                                'hue_degree': 0,
                                'saturation_percent': 0,
                                'light_percent': $lightPercentNumber,
                                'width': 30,
                                'height': 30,
                                'css_data': {
                                    '.container': 'border: 5px ridge; margin-left: 16px;'
                                }
                            }
                        },
                        'how': {
                            'mode': 'one box',
                            'text': '[light_bar]'
                        },
                        'where': {
                            'box_id': $where,
                            'max_width': 100,
                            'scroll_to_box_id': 'false'
                        },
                        'cache_key': 'render_done-layer_' + $lightPercent
                    },
                    'data_back': {
                        'step': 'step_end'
                    }
                });

                $messageArray.push($messageOut);

                $where = 'main.body.infohub_configlocal.form.[layer_' + $number + '_light_value_container]';

                $massUpdate.push({
                    'func': 'SetText',
                    'id': $where,
                    'text': $lightPercent
                });
            }

            const $name = _GetData({
                'name': 'form_data/name/value',
                'default': '?',
                'data': $in.form_data,
            });

            const $where = 'main.body.infohub_configlocal.form.[name_form_element]';

            $massUpdate.push({
                'func': 'SetText',
                'id': $where,
                'text': $name
            });

            if (_Count($massUpdate) > 0) {
                $messageOut = _SubCall({
                    'to': {
                        'node': 'client',
                        'plugin': 'infohub_view',
                        'function': 'mass_update'
                    },
                    'data': {
                        'do': $massUpdate
                    },
                    'data_back': {
                        'step': 'step_end'
                    }
                });

                $messageArray.push($messageOut);
            }
        }

        return {
            'answer': 'true',
            'message': 'Here are the render data',
            'messages': $messageArray
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
    $functions.push("get_form_data");
    const get_form_data = function($in) {
        const $default = {
            'step': 'step_form_read',
            'answer': '',
            'message': '',
            'response': {},
            'data_back': {
                'form_data': {},
                'color_schema': {},
                'color_lookup': {}
            }
        };
        $in = _Default($default, $in);

        if ($in.step === 'step_form_read') {

            let $where = 'main.body.infohub_configlocal.form.[my_form_form]';

            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_view',
                    'function': 'form_read'
                },
                'data': {
                    'id': $where
                },
                'data_back': {
                    'step': 'step_form_read_response'
                }
            });
        }

        if ($in.step === 'step_form_read_response') {

            $in.step = 'step_end';

            if ($in.answer === 'true') {

                $in.data_back = _Default(_GetDefaultColorData(), $in.response);

                $in.step = 'step_calculate_color_lookup';
            }
        }

        if ($in.step === 'step_calculate_color_lookup') {

            const $saturation = 0.5;

            let $colorData = {
                '#f76d6d': {
                    'hue_degree': parseFloat($in.data_back.form_data.base_color_0.value),
                    'saturation': $saturation,
                    'lightness': parseFloat($in.data_back.form_data.layer_0.value)
                },
                '#7df76d': {
                    'hue_degree': parseFloat($in.data_back.form_data.base_color_1.value),
                    'saturation': $saturation,
                    'lightness': parseFloat($in.data_back.form_data.layer_1.value)
                },
                '#6d8df7': {
                    'hue_degree': parseFloat($in.data_back.form_data.base_color_2.value),
                    'saturation': $saturation,
                    'lightness': parseFloat($in.data_back.form_data.layer_1.value)
                },
                '#ff0000': {
                    'hue_degree': parseFloat($in.data_back.form_data.base_color_3.value),
                    'saturation': $saturation,
                    'lightness': parseFloat($in.data_back.form_data.layer_1.value)
                },
                '#0b1f00': {
                    'hue_degree': parseFloat($in.data_back.form_data.base_color_4.value),
                    'saturation': $saturation,
                    'lightness': parseFloat($in.data_back.form_data.layer_2.value)
                },
                '#1b350a': {
                    'hue_degree': parseFloat($in.data_back.form_data.base_color_5.value),
                    'saturation': $saturation,
                    'lightness': parseFloat($in.data_back.form_data.layer_2.value)
                }
            };

            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_color',
                    'function': 'calculate_color_lookup'
                },
                'data': {
                    'color_data': $colorData
                },
                'data_back': {
                    'form_data': $in.data_back.form_data,
                    'color_schema': $in.data_back.color_schema,
                    'step': 'step_calculate_color_lookup_response'
                }
            });
        }

        if ($in.step === 'step_calculate_color_lookup_response') {
            const $default = {
                'answer': 'false',
                'message': '',
                'color_lookup': {}
            }

            $in.response = _Default($default, $in.response);

            $in.data_back.color_lookup = $in.response.color_lookup;
        }

        return {
            'answer': $in.answer,
            'message': $in.message,
            'data': {
                'form_data': $in.data_back.form_data,
                'color_schema': $in.data_back.color_schema,
                'color_lookup': $in.data_back.color_lookup
            }
        };
    };

    /**
     * Preview how he colour schema will look like on real buttons etc.
     * Will use the data from the form
     * @version 2021-01-04
     * @since 2021-01-04
     * @author Peter Lembke
     */
    $functions.push("click_preview");
    const click_preview = function($in) {
        const $default = {
            'step': 'step_form_read',
            'answer': '',
            'message': '',
            'response': {},
            'data_back': {
                'selected_config': {},
                'active_config': {}
            }
        };
        $in = _Default($default, $in);

        const $where = 'main.body.infohub_configlocal.preview';

        let $ok = 'false';

        if ($in.step === 'step_form_read') {
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_configlocal_colour',
                    'function': 'get_form_data'
                },
                'data': {},
                'data_back': {
                    'step': 'step_form_read_response'
                }
            });
        }

        if ($in.step === 'step_form_read_response') {

            const $default = {
                'answer': 'false',
                'message': '',
                'data': {
                    'form_data': {},
                    'color_schema': {},
                    'color_lookup': {}
                }
            };
            $in.response = _Default($default, $in.response);
            $in.data_back.selected_config = _Default(_GetDefaultColorData(), $in.response.data);

            $in.step = 'step_get_current_color_lookup';
        }

        if ($in.step === 'step_get_current_color_lookup') {
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_render',
                    'function': 'get_color_schema'
                },
                'data': {},
                'data_back': {
                    'selected_config': $in.data_back.selected_config,
                    'active_config': $in.data_back.active_config,
                    'step': 'step_get_current_color_lookup_response'
                }
            });
        }

        if ($in.step === 'step_get_current_color_lookup_response') {

            const $default = {
                'answer': 'false',
                'message': '',
                'data': {
                    'color_schema': {},
                    'color_lookup': {}
                }
            };
            $in.response = _Default($default, $in.response);
            $in.data_back.active_config = _Default(_GetDefaultColorData(), $in.response.data);

            $in.step = 'step_render_example';
        }

        if ($in.step === 'step_render_example') {

            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_render',
                    'function': 'create'
                },
                'data': {
                    'what': {
                        'form': {
                            'plugin': 'infohub_renderform',
                            'type': 'form',
                            'content': '[full_text]',
                            'label': _Translate('Preview'),
                            'description': _Translate('Here you see how the colours will look like on real form elements.')
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
                            'data5': '[my_button][my_select]',
                            'data6': '[/columns]'
                        },
                        'my_button': {
                            'plugin': 'infohub_renderform',
                            'type': 'button',
                            'mode': 'submit',
                            'button_label': _Translate('Test button'),
                            'event_data': 'colour|preview',
                            'to_plugin': 'infohub_configlocal',
                            'to_function': 'click'
                        },
                        'my_select': {
                            'plugin': 'infohub_renderform',
                            'type': 'select',
                            "label": _Translate("Test select"),
                            "description": _Translate("Here you see a selector"),
                            "size": "10",
                            "multiple": "true",
                            "options": [
                                { "type": "option", "value": "nothing", "label": _Translate("Nothing") },
                                { "type": "optgroup", "label": _Translate("Cutlery") },
                                { "type": "option", "value": "cutlery_knife", "label": _Translate("Knife") },
                                { "type": "option", "value": "cutlery_fork", "label": _Translate("Fork") },
                                { "type": "/optgroup" },
                                { "type": "optgroup", "label": _Translate("Porcelain") },
                                { "type": "option", "value": "porcelain_plait", "label": _Translate("Plait") },
                                { "type": "option", "value": "porcelain_glass", "label": _Translate("Glass") },
                                { "type": "/optgroup" },
                                { "type": "optgroup", "label": _Translate("Fabric") },
                                { "type": "option", "value": "fabric_napkin", "label": _Translate("Napkin") },
                                { "type": "option", "value": "fabric_cloth", "label": _Translate("Table Cloth") },
                                { "type": "/optgroup" }
                            ]
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
                        'text': '[form]',
                        'css_data': {
                            '.light': 'background-color: #6d8df7;',
                            ' ': 'color: #0b1f00;',
                            'h1, h2, h3, h4, h5, h6, ul': 'color: #1b350a;'
                        }
                    },
                    'where': {
                        'box_id': $where,
                        'max_width': 320,
                        'scroll_to_box_id': 'true'
                    }
                },
                'data_back': {
                    'selected_config': $in.data_back.selected_config,
                    'active_config': $in.data_back.active_config,
                    'step': 'step_calculate_new_colors'
                }
            });
        }

        if ($in.step === 'step_calculate_new_colors') {
            const $selectedColorLookup = $in.data_back.selected_config.color_lookup;
            const $activeColorLookup = $in.data_back.active_config.color_lookup
            let $newColorLookup = {};

            for (let $lookupColor in $activeColorLookup) {
                if ($activeColorLookup.hasOwnProperty($lookupColor) === false) {
                    continue;
                }

                const $activeColor = $activeColorLookup[$lookupColor];
                const $selectedColor = $selectedColorLookup[$lookupColor];

                $newColorLookup[$activeColor] = $selectedColor;
            }

            const $backgroundColorLookup = '#f76d6d';
            const $backgroundColor = $selectedColorLookup[$backgroundColorLookup];

            const $messageOut = _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_view',
                    'function': 'set_style'
                },
                'data': {
                    'box_id': $where,
                    'style_name': 'background-color',
                    'style_value': $backgroundColor
                },
                'data_back': {
                    'step': 'step_end'
                }
            });

            let $messages = [];
            $messages.push($messageOut);

            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_view',
                    'function': 'replace_in_html'
                },
                'data': {
                    'id': $where,
                    'replace': $newColorLookup
                },
                'data_back': {
                    'step': 'step_calculate_new_colors_response'
                },
                'messages': $messages
            });

        }

        if ($in.step === 'step_calculate_new_colors_response') {
            $ok = 'true';
        }

        return {
            'answer': $in.answer,
            'message': $in.message,
            'ok': $ok
        };
    };

    /**
     * Save the config
     * I can not let the button directly call "submit" in the parent because the event would
     * have come from infohub_render and the function should only accept calls from the children.
     * @version 2021-01-04
     * @since 2019-10-28
     * @author Peter Lembke
     */
    $functions.push("click_submit");
    const click_submit = function($in) {
        const $default = {
            'step': 'step_form_read',
            'answer': '',
            'message': '',
            'response': {},
            'data_back': {}
        };
        $in = _Default($default, $in);

        let $ok = 'false';

        if ($in.step === 'step_form_read') {
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_configlocal_colour',
                    'function': 'get_form_data'
                },
                'data': {},
                'data_back': {
                    'step': 'step_form_read_response'
                }
            });
        }

        if ($in.step === 'step_form_read_response') {

            const $default = {
                'answer': 'false',
                'message': '',
                'data': {}
            };
            $in.response = _Default($default, $in.response);
            $in.data_back = _Default(_GetDefaultColorData(), $in.response.data);

            $in.step = 'step_save_config';
        }

        if ($in.step === 'step_save_config') {
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_configlocal',
                    'function': 'submit'
                },
                'data': {
                    'event_data': 'colour',
                    'form_data': {
                        'form_data': $in.data_back.form_data,
                        'color_schema': $in.data_back.color_schema,
                        'color_lookup': $in.data_back.color_lookup
                    }
                },
                'data_back': {
                    'step': 'step_save_config_response'
                }
            });
        }

        if ($in.step === 'step_save_config_response') {
            if ($in.answer === 'true') {
                $ok = 'true';
                $in.message = _Translate('I saved your selections. I now recommend that you clear the render cache');
            }
        }

        return {
            'answer': $in.answer,
            'message': $in.message,
            'ok': $ok
        };
    };

    $functions.push("click_apply_config");
    /**
     * Click to clear the render cache and ask infohub_render to forget the
     * current list with colours.
     * @version 2020-12-27
     * @since 2020-12-27
     * @author Peter Lembke
     */
    const click_apply_config = function($in) {
        const $default = {
            'step': 'step_start',
            'response': {
                'answer': 'false',
                'message': 'Nothing to report from click_apply_config'
            }
        };
        $in = _Default($default, $in);

        let $ok = 'false';

        if ($in.step === 'step_start') {
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_configlocal_colour',
                    'function': 'click_submit'
                },
                'data': {},
                'data_back': {
                    'step': 'step_delete_render_cache_for_user_name_and_reload_page'
                }
            });
        }

        if ($in.step === 'step_delete_render_cache_for_user_name_and_reload_page') {
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_debug',
                    'function': 'delete_render_cache_for_user_name_and_reload_page'
                },
                'data': {},
                'data_back': {
                    'step': 'step_response'
                }
            });
        }

        if ($in.step === 'step_response') {
            if ($in.response.answer === 'true') {
                $ok = 'true';
                $in.response.message = _Translate('Done clearing cache and refreshing page');
            }
        }

        return {
            'answer': $in.response.answer,
            'message': $in.response.message,
            'ok': $ok
        };
    };

    /**
     * File read
     * @version 2019-01-12
     * @since 2019-01-12
     * @author Peter Lembke
     */
    $functions.push("click_file_upload");
    const click_file_upload = function ($in)
    {
        const $default = {
            'step': 'step_start',
            'files_data': []
        };
        $in = _Default($default, $in);

        if ($in.step === 'step_start')
        {
            if ($in.files_data.length > 0) {
                return _SubCall({
                    'to': {
                        'node': 'client',
                        'plugin': 'infohub_configlocal_colour',
                        'function': 'render_done'
                    },
                    'data': {
                        'form_data': $in.files_data[0].content
                    },
                    'data_back': {
                        'step': 'step_end'
                    }
                });
            }
        }

        return {
            'answer': 'true',
            'message': 'Done handling files data',
            'ok': 'true' // Gives an OK on the button you clicked
        };
    };

    /**
     * Download a file
     * @version 2019-01-13
     * @since 2019-01-13
     * @author Peter Lembke
     */
    $functions.push("click_file_download");
    const click_file_download = function ($in)
    {
        const $default = {
            'response': {
                'answer': 'false',
                'message': '',
                'data': {
                    'form_data': {},
                    'color_schema': {},
                    'color_lookup': {}
                },
                'ok': 'false'
            },
            'step': 'step_get_data'
        };
        $in = _Default($default, $in);

        if ($in.step === 'step_get_data')
        {
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_configlocal_colour',
                    'function': 'get_form_data'
                },
                'data': {},
                'data_back': {
                    'step': 'step_file_download'
                }
            });
        }

        if ($in.step === 'step_file_download')
        {
            const $name = _GetData({
                'name': 'response/data/form_data/name/value', // example: "response/data/checksum"
                'default': '', // example: ""
                'data': $in // an object with data where you want to pull out a part of it
            });

            const $dataObject = _GetData({
                'name': 'response/data', // example: "response/data/checksum"
                'default': {}, // example: ""
                'data': $in // an object with data where you want to pull out a part of it
            });

            const $dataJson = _JsonEncode($dataObject);

            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_view',
                    'function': 'file_write'
                },
                'data': {
                    'file_name': $name + '.json',
                    'content': $dataJson
                },
                'data_back': {
                    'step': 'step_end'
                }
            });
        }

        return {
            'answer': 'true',
            'message': 'Done handling files data',
            'ok': 'true' // Gives an OK on the button you clicked
        };
    };

    $functions.push("apply_config");
    /**
     * Read the config and then send it to infohub_render -> set_color_schema
     * @version 2020-12-27
     * @since 2020-12-27
     * @author Peter Lembke
     */
    const apply_config = function($in) {
        const $default = {
            'local_config': _GetDefaultColorData(),
            'step': 'step_check_color_schema',
            'response': {
                'answer': 'false',
                'message': 'Nothing to report from configlocal_colour -> apply_config'
            }
        };
        $in = _Default($default, $in);

        if ($in.step === 'step_check_color_schema') {



            $in.step = 'step_set_color_schema';
        }

        if ($in.step === 'step_set_color_schema') {
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_render',
                    'function': 'set_color_schema'
                },
                'data': $in.local_config,
                'data_back': {
                    'step': 'step_set_color_schema_response'
                }
            });
        }

        if ($in.step === 'step_set_color_schema_response') {
        }

        return {
            'answer': $in.response.answer,
            'message': $in.response.message
        };
    };

    /**
     * Return the default data that we save on submit
     * @returns {}
     * @private
     */
    const _GetDefaultColorData = function() {

        const $dark = {
            'color_schema': {
                'layer-0-background': '#f76d6d',
                'layer-1-normal': '#7df76d',
                'layer-1-highlight': '#6d8df7',
                'layer-1-warning': '#ff0000',
                'layer-2-normal-text': '#0b1f00',
                'layer-2-title-text': '#1b350a',
            },
            'color_lookup': {
                "#f76d6d":"#260d0d", // RGB: 38,13,13       HSL: 0 49.0% 10.0%
                "#7df76d":"#82482b", // RGB: 130,72,43      HSL: 20 50.3% 33.9%
                "#6d8df7":"#82572b", // RGB: 130,87,43      HSL: 30 50.3% 33.9%
                "#ff0000":"#822b3a", // RGB: 130,43,58      HSL: 350 50.3% 33.9%
                "#0b1f00":"#deb29c", // RGB: 222,178,156    HSL: 20 50.0% 74.1%
                "#1b350a":"#dec89c"  // RGB: 222,200,156    HSL: 40 50.0% 74.1%
            },
            'form_data': {
                'base_color_0': {'value': '0'},
                'base_color_1': {'value': '20'},
                'base_color_2': {'value': '30'},
                'base_color_3': {'value': '350'},
                'base_color_4': {'value': '20'},
                'base_color_5': {'value': '40'},
                'layer_0': {'value': '10'},
                'layer_1': {'value': '33.9'},
                'layer_2': {'value': '74.1'},
                'name': {'value': 'Mocha Chocolate'},
            }
        };

        const $light = {
            "color_schema": {
                "layer-0-background": "#f76d6d",
                "layer-1-normal": "#7df76d",
                "layer-1-highlight": "#6d8df7",
                "layer-1-warning": "#ff0000",
                "layer-2-normal-text": "#0b1f00",
                "layer-2-title-text": "#1b350a"
            },
            "color_lookup": {
                "#f76d6d": "#d9f2f2",
                "#7df76d": "#bae8e8",
                "#6d8df7": "#babae8",
                "#ff0000": "#e8baba",
                "#0b1f00": "#11260d",
                "#1b350a": "#1a260d"
            },
            "form_data": {
                "base_color_0": {"value": "180"},
                "base_color_1": {"value": "180"},
                "base_color_2": {"value": "240"},
                "base_color_3": {"value": "0"},
                "base_color_4": {"value": "110"},
                "base_color_5": {"value": "90"},
                "layer_0": {"value": "90"                },
                "layer_1": {"value": "82"},
                "layer_2": {"value": "10"},
                "name": {"value": "Winter"}
            }
        };

        if (_IsDarkModeEnabled() === true) {
            return $dark;
        }

        return $light;
    };

    /**
     * Detects if dark mode is enabled or not
     * I will just test. This must be moved to infohub_view later
     * @returns {boolean}
     * @private
     */
    const _IsDarkModeEnabled = function() {
        const $result = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

        return $result;
    }
}
//# sourceURL=infohub_configlocal_colour.js
