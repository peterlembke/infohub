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
            'apply_config': 'normal'
        };

        return _GetCmdFunctionsBase($list);
    };

    let $classTranslations = {};

    /**
     * Translate - Substitute a string for another string using a class local object
     * @param {type} $string
     * @returns string
     */
    $functions.push('_Translate');
    const _Translate = function ($string)
    {
        if (typeof $classTranslations !== 'object') {
            return $string;
        }

        return _GetData({
            'name': _GetClassName() + '|' + $string,
            'default': $string, 'data': $classTranslations, 'split': '|'
        });
    };

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
    const create = function ($in)
    {
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

        if ($in.step === 'step_render_form')
        {
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
                            'content': '[color_selector][base_color_0][base_color_1][base_color_2][base_color_3][base_color_4][dark_mode][submit]',
                            'label': _Translate('Colour schema'),
                            'description': _Translate('Here you can modify the colour schema.')
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
                            'button_label': _Translate('Layer 2: Button text'),
                            'color_selector_name': 'color_selector'
                        },
                        'dark_mode': {
                            'plugin': 'infohub_color',
                            'type': 'light_bar_selector',
                            'label': 'Dark mode',
                            'description': 'Pick how dark background you want'
                        },
                        'submit': {
                            'plugin': 'infohub_renderform',
                            'type': 'button',
                            'mode': 'submit',
                            'button_label': _Translate('Save your settings'),
                            'event_data': 'colour|submit',
                            'to_plugin': 'infohub_configlocal',
                            'to_function': 'click'
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
    const render_done = function ($in)
    {
        const $default = {
            'subtype': 'menu',
            'box_id': '',
            'parent_box_id': '',
            'translations': {},
            'form_data': {},
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

        if ($in.step === 'step_render_light_bars')
        {
            for (let $number = 0; $number <= 4; $number++) {

                const $hueDegree = _GetData({
                    'name': 'form_data/base_color_' + $number.toString() + '/value',
                    'default': '?',
                    'data': $in,
                })

                if ($hueDegree === '?') {
                    continue;
                }

                const $hueDegreeNumber = parseInt($hueDegree);
                const $where = 'main.body.infohub_configlocal.form.[base_color_' + $number + '_light_bar_container]';

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
                            'text': '[light_bar]'
                        },
                        'where': {
                            'box_id': $where,
                            'max_width': 100,
                            'scroll_to_box_id': 'false'
                        },
                        'cache_key': 'light_bar_' + $hueDegree
                    },
                    'data_back': {'step': 'step_end'}
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
     * @todo Write the logic in this function. It is taken from the image plugin
     * @version 2019-10-28
     * @since 2019-10-28
     * @author Peter Lembke
     */
    $functions.push("click_submit");
    const click_submit = function ($in)
    {
        const $default = {
            'box_id': '',
            'step': 'step_form_read',
            'answer': '',
            'message': '',
            'response': {
                'form_data': {
                    'base_color_0': {
                        'value': ''
                    },
                    'base_color_1': {
                        'value': ''
                    },
                    'base_color_2': {
                        'value': ''
                    },
                    'base_color_3': {
                        'value': ''
                    },
                    'base_color_4': {
                        'value': ''
                    },
                    'dark_mode': {
                        'value': ''
                    }
                }
            }
        };
        $in = _Default($default, $in);

        let $ok = 'false';

        if ($in.step === 'step_form_read')
        {
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

        if ($in.step === 'step_form_read_response')
        {
            $in.step = 'step_end';
            if ($in.answer === 'true') {
                $in.step = 'step_save_config';
            }
        }

        if ($in.step === 'step_save_config')
        {
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_configlocal',
                    'function': 'submit'
                },
                'data': {
                    'event_data': 'colour',
                    'form_data': {
                        'base_color_0': {
                            'value': $in.response.form_data.base_color_0.value
                        },
                        'base_color_1': {
                            'value': $in.response.form_data.base_color_1.value
                        },
                        'base_color_2': {
                            'value': $in.response.form_data.base_color_2.value
                        },
                        'base_color_3': {
                            'value': $in.response.form_data.base_color_3.value
                        },
                        'base_color_4': {
                            'value': $in.response.form_data.base_color_4.value
                        },
                        'dark_mode': {
                            'value': $in.response.form_data.dark_mode.value
                        }
                    }
                },
                'data_back': {
                    'step': 'step_save_config_response'
                }
            });
        }

        if ($in.step === 'step_save_config_response')
        {
            $in.step = 'step_end';
            if ($in.answer === 'true') {
                $ok = 'true';
            }
        }

        return {
            'answer': $in.answer,
            'message': $in.message,
            'ok': $ok
        };
    };

    /**
     * Apply the image config on the stored plugin
     * Will get local_config. Now we will ask for help to store that config on the plugin config in localStorage.
     * @todo Write the logic in this function. It is taken from the image plugin
     * @version 2020-09-24
     * @since 2019-10-19
     * @author Peter Lembke
     */
    $functions.push("apply_config");
    const apply_config = function ($in)
    {
        const $default = {
            'local_config': {
                'download_assets.download_assets': {
                    'value': 'false'
                },
                'max_asset_size_kb': {
                    'value': ''
                },
                'index_cache_days': {
                    'value': ''
                },
                'allowed_asset_types.avif': {
                    'value': 'false'
                },
                'allowed_asset_types.gif': {
                    'value': 'false'
                },
                'allowed_asset_types.json': {
                    'value': 'false'
                },
                'allowed_asset_types.png': {
                    'value': 'false'
                },
                'allowed_asset_types.svg': {
                    'value': 'false'
                },
                'allowed_asset_types.webp': {
                    'value': 'false'
                }
            },
            'step': 'step_check_config',
            'response': {
                'answer': 'false',
                'message': 'Nothing to report'
            }
        };
        $in = _Default($default, $in);

        let $out = {
            'answer': 'false',
            'message': 'Nothing to report'
        };

        if ($in.step === 'step_check_config')
        {
            $in.step = 'step_apply_config';

            if (_Empty($in.local_config.max_asset_size_kb.value) === 'true') {
                $in.step = 'step_end';
                $out.message = 'We have no config to apply. Exiting';
            }
        }

        if ($in.step === 'step_apply_config')
        {
            const $secondsInADay = 24*60*60;
            const $newPluginConfig = {
                'allowed_asset_types': {
                    'avif': $in.local_config['allowed_asset_types.avif'].value,
                    'gif': $in.local_config['allowed_asset_types.gif'].value,
                    'json': $in.local_config['allowed_asset_types.json'].value,
                    'png': $in.local_config['allowed_asset_types.png'].value,
                    'svg': $in.local_config['allowed_asset_types.svg'].value,
                    'webp': $in.local_config['allowed_asset_types.webp'].value
                },
                'download_assets': $in.local_config['download_assets.download_assets'].value,
                'index_cache_seconds': parseInt($in.local_config.index_cache_days.value) * $secondsInADay,
                'max_asset_size_kb': parseInt($in.local_config.max_asset_size_kb.value)
            };

            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_plugin',
                    'function': 'set_plugin_config'
                },
                'data': {
                    'plugin_name': 'infohub_asset',
                    'plugin_config': $newPluginConfig
                },
                'data_back': {
                    'step': 'step_apply_config_response'
                }
            });
        }

        if ($in.step === 'step_apply_config_response') {
            $out.answer = $in.response.answer;
            $out.message = $in.response.message;
        }

        return {
            'answer': $out.answer,
            'message': $out.message
        };

    };

}
//# sourceURL=infohub_configlocal_colour.js