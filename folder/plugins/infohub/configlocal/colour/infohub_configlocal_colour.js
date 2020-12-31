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
            'click_submit': 'normal',
            'click_clear_render_cache': 'normal',
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
                            'content': '[color_selector][base_color_0][base_color_1][base_color_2][base_color_3][base_color_4][base_color_5][light_picker][layer_0][layer_1][layer_2][submit][clear_render_cache]',
                            'label': _Translate('Colour schema'),
                            'description': _Translate(
                                'Here you can modify the colour schema.')
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
                            'description': 'Pick how dark layer you want'
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
                        'submit': {
                            'plugin': 'infohub_renderform',
                            'type': 'button',
                            'mode': 'submit',
                            'button_label': _Translate('Save your settings'),
                            'event_data': 'colour|submit',
                            'to_plugin': 'infohub_configlocal',
                            'to_function': 'click',
                            'show_success_text': 'true'
                        },
                        'clear_render_cache': {
                            'plugin': 'infohub_renderform',
                            'type': 'button',
                            'mode': 'button',
                            'button_label': _Translate('Clear render cache'),
                            'event_data': 'colour|clear_render_cache',
                            'to_plugin': 'infohub_configlocal',
                            'to_function': 'click',
                            'show_success_text': 'true'
                        }
                    },
                    'how': {
                        'mode': 'one box',
                        'text': '[title][my_form]'
                    },
                    'where': {
                        'box_id': $in.parent_box_id + '.form',
                        'max_width': 100,
                        'scroll_to_box_id': 'true'
                    },
                    'cache_key': 'color'
                },
                'data_back': {'step': 'step_end'}
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
            'subtype': 'menu',
            'box_id': '',
            'parent_box_id': '',
            'translations': {},
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
                let $where = 'main.body.infohub_configlocal.form.[base_color_' +
                    $number + '_light_bar_container]';

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

                let $where = 'main.body.infohub_configlocal.form.[layer_' +
                    $numberString + '_light_box_container]';

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
                        'cache_key': 'render_done-layer_' + $numberString
                    },
                    'data_back': {
                        'step': 'step_end'
                    }
                });

                $messageArray.push($messageOut);

                $where = 'main.body.infohub_configlocal.form.[layer_' +
                    $number + '_light_value_container]';

                $massUpdate.push({
                    'func': 'SetText',
                    'id': $where,
                    'text': $lightPercent
                });
            }

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
    $functions.push("click_submit");
    const click_submit = function($in) {
        const $default = {
            'box_id': '',
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

        let $ok = 'false';

        if ($in.step === 'step_form_read') {
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_view',
                    'function': 'form_read'
                },
                'data': {
                    'id': $in.box_id + '.[my_form_form]'
                },
                'data_back': {
                    'box_id': $in.box_id,
                    'step': 'step_form_read_response'
                }
            });
        }

        if ($in.step === 'step_form_read_response') {
            $in.step = 'step_end';

            if ($in.answer === 'true') {

                $in.data_back = _Default(_GetDefaultColorData(), $in.response);

                let $hasAllData = 'true';
                for (let $key in $in.data_back.form_data) {
                    if ($in.data_back.form_data.hasOwnProperty($key) === false) {
                        continue;
                    }
                    if ($in.data_back.form_data[$key].value === '') {
                        $hasAllData = 'false';
                        break;
                    }
                }

                if ($hasAllData === 'true') {
                    $in.step = 'step_calculate_color_lookup';
                } else {
                    $in.message = _Translate('You need to do a selection with all buttons');
                }
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
            $in.step = 'step_end';
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

    $functions.push("click_clear_render_cache");
    /**
     * Click to clear the render cache and ask infohub_render to forget the
     * current list with colours.
     * @version 2020-12-27
     * @since 2020-12-27
     * @author Peter Lembke
     */
    const click_clear_render_cache = function($in) {
        const $default = {
            'step': 'step_send_messages',
            'response': {
                'answer': 'false',
                'message': 'Nothing to report from click_apply_config'
            }
        };
        $in = _Default($default, $in);

        if ($in.step === 'step_send_messages') {
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_render',
                    'function': 'delete_render_cache_for_user_name'
                },
                'data': {},
                'data_back': {
                    'step': 'step_send_messages_response'
                }
            });
        }

        let $ok = 'false';

        if ($in.step === 'step_send_messages_response') {
            if ($in.response.answer === 'true') {
                $ok = 'true';
                $in.response.message = _Translate('Done clearing cache');
            }
        }

        return {
            'answer': $in.response.answer,
            'message': $in.response.message,
            'ok': $ok
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
            'step': 'step_set_color_schema',
            'response': {
                'answer': 'false',
                'message': 'Nothing to report from configlocal_colour -> apply_config'
            }
        };
        $in = _Default($default, $in);

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
        return {
            'color_schema': {
                'layer-0-background': '#f76d6d',
                'layer-1-normal': '#7df76d',
                'layer-1-highlight': '#6d8df7',
                'layer-1-warning': '#ff0000',
                'layer-2-normal-text': '#0b1f00',
                'layer-2-title-text': '#1b350a',
            },
            'color_lookup': {
                "#f76d6d":"#260d0d",
                "#7df76d":"#82482b",
                "#6d8df7":"#82572b",
                "#ff0000":"#822b3a",
                "#0b1f00":"#deb29c",
                "#1b350a":"#dec89c"
            },
            'form_data': {
                'base_color_0': {'value': ''},
                'base_color_1': {'value': ''},
                'base_color_2': {'value': ''},
                'base_color_3': {'value': ''},
                'base_color_4': {'value': ''},
                'base_color_5': {'value': ''},
                'layer_0': {'value': ''},
                'layer_1': {'value': ''},
                'layer_2': {'value': ''}
            }
        };
    };
}
//# sourceURL=infohub_configlocal_colour.js
