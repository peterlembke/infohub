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
function infohub_demo_form2() {

    "use strict";

// include "infohub_base.js"

    const _Version = function() {
        return {
            'date': '2019-03-28',
            'since': '2018-05-25',
            'version': '2.0.0',
            'checksum': '{{checksum}}',
            'class_name': 'infohub_demo_form2',
            'note': 'Render a form demo for infohub_demo',
            'status': 'normal',
            'SPDX-License-Identifier': 'GPL-3.0-or-later'
        };
    };

    const _GetCmdFunctions = function() {
        const $list = {
            'create': 'normal',
            'click_form2_buttons': 'normal',
            'click_submit': 'normal'
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
     * @version 2019-03-28
     * @since   2016-10-16
     * @author  Peter Lembke
     */
    $functions.push('create');
    const create = function ($in)
    {
        const $default = {
            'parent_box_id': '',
            'translations': {},
            'step': 'step_start',
            'response': {
                'answer': 'false',
                'message': 'Nothing to report from infohub_demo_form2'
            }
        };
        $in = _Default($default, $in);

        if ($in.step === 'step_start') 
        {
            $classTranslations = $in.translations;
    
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_render',
                    'function': 'create'
                },
                'data': {
                    'what': {
                        'my_text': {
                            'type': 'text',
                            'text': "[h1][titel][/h1]\n [i][ingress][/i]\n"
                        },
                        'titel': {
                            'type': 'common',
                            'subtype': 'value',
                            'data': _Translate('Welcome to the InfoHub Demo for more advanced forms')
                        },
                        'ingress': {
                            'type': 'common',
                            'subtype': 'value',
                            'data': _Translate('In this demo you can order a meal at a restaurant. All the form elements are used in this demo.')
                        },
                        'my_form': {
                            'plugin': 'infohub_renderform',
                            'type': 'form',
                            'content': '[button_fill_data_quick_burger][button_fill_data_lunch_burger][button_fill_data_dinner_burger][of_age][my_textbox][my_datalist][my_select][my_radios_bread][my_radios_burger][my_range][my_checkboxes_extras][my_colour_select][my_textarea][my_button]',
                            'label': _Translate('Your burger meal'),
                            'description': _Translate('Please select the details for your burger meal.')
                        },
                        'my_button': {
                            'plugin': 'infohub_renderform',
                            'type': 'button',
                            'mode': 'submit',
                            'button_label': _Translate('Order your Meal'),
                            'event_data': 'form2|submit',
                            'to_plugin': 'infohub_demo',
                            'to_function': 'click'
                        },
                        'button_fill_data_quick_burger': {
                            'plugin': 'infohub_renderform',
                            'type': 'button',
                            'mode': 'button',
                            'button_label': _Translate('Quick burger'),
                            'event_data': 'form2|form2_buttons|fill_form_quick_burger',
                            'to_plugin': 'infohub_demo',
                            'to_function': 'click'
                        },
                        'button_fill_data_lunch_burger': {
                            'plugin': 'infohub_renderform',
                            'type': 'button',
                            'mode': 'button',
                            'button_label': _Translate('Lunch burger'),
                            'event_data': 'form2|form2_buttons|fill_form_lunch_burger',
                            'to_plugin': 'infohub_demo',
                            'to_function': 'click'
                        },
                        'button_fill_data_dinner_burger': {
                            'plugin': 'infohub_renderform',
                            'type': 'button',
                            'mode': 'button',
                            'button_label': _Translate('Dinner burger'),
                            'event_data': 'form2|form2_buttons|fill_form_dinner_burger',
                            'to_plugin': 'infohub_demo',
                            'to_function': 'click'
                        },
                        'my_textbox': {
                            'plugin': 'infohub_renderform',
                            'type': 'text',
                            'label': _Translate('Alias'),
                            'description': _Translate( 'Your alias for this burger order, so you can easily reorder at a later time'),
                            'maxlength': '30',
                            'validator_plugin': 'infohub_validate',
                            'validator_function': 'validate_has_data',
                            'datalist_id': 'my_datalist',
                            'placeholder': 'Any alias'
                        },
                        'my_range': {
                            'plugin': 'infohub_renderform',
                            'type': 'range',
                            'min_value': '50',
                            'max_value': '250',
                            'step_value': '25',
                            'label': _Translate('Frying the burger'),
                            'description': _Translate('How much du you want us to fry the burger, from lightly touching the pan up to meteorite')
                        },
                        'my_select': {
                            'plugin': 'infohub_renderform',
                            'type': 'select',
                            "label": _Translate("Side dish"),
                            "description": _Translate("What do you want to make your meal even better"),
                            "size": "10",
                            "multiple": "true",
                            'validator_plugin': 'infohub_validate',
                            'validator_function': 'validate_has_data',
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
                        'my_textarea': {
                            'plugin': 'infohub_renderform',
                            'type': 'textarea',
                            'placeholder': _Translate('Your special requests'),
                            "label": _Translate("Special requests"),
                            "description": _Translate("If you have some special requests for your meal then write them here."),
                            'validator_plugin': 'infohub_validate',
                            'validator_function': 'validate_has_data'
                        },
                        'my_datalist': {
                            'type': 'form',
                            'subtype': 'datalist',
                            "options": [
                                { "type": "option", "value": "a_date_meal", "label": _Translate("A date meal") },
                                { "type": "option", "value": "an_after_movie_meal", "label": _Translate("An after movie meal") },
                                { "type": "option", "value": "a_before_movie_meal", "label": _Translate("A before movie meal") },
                                { "type": "option", "value": "ultra_running_meal", "label": _Translate("Ultra running meal") },
                                { "type": "option", "value": "meal_during_shopping", "label": _Translate("Meal during shopping") }
                            ]
                        },
                        'my_radios_bread': {
                            'plugin': 'infohub_renderform',
                            'type': 'radios',
                            "label": _Translate("Bread"),
                            "description": _Translate("What kind of bread do you want?"),
                            'group_name': 'testing',
                            "options": [
                                { "group_name": "bread", "value": "bread_plain", "label": _Translate("Plain bread"), 'selected': 'true' },
                                { "group_name": "bread", "value": "bread_full", "label": _Translate("Fiber bread") },
                                { "group_name": "bread", "value": "bread_sesam", "label": _Translate("Sesam bread") }
                            ]
                        },
                        'my_radios_burger': {
                            'plugin': 'infohub_renderform',
                            'type': 'radios',
                            "label": _Translate("Burger"),
                            "description": _Translate("What kind of burger do you want?"),
                            'group_name': 'testing',
                            "options": [
                                { "group_name": "burger", "value": "tofu_burger", "label": _Translate("Tofu burger"), 'selected': 'true' },
                                { "group_name": "burger", "value": "halloumi_burger", "label": _Translate("Halloumi burger") },
                                { "group_name": "burger", "value": "soy_burger", "label": _Translate("Soy burger") },
                                { "group_name": "burger", "value": "carrot_burger", "label": _Translate("Carrot based burger") },
                                { "group_name": "burger", "value": "beetroot_burger", "label": _Translate("Beetroot based burger") }
                            ]
                        },
                        'my_checkboxes_extras': {
                            'plugin': 'infohub_renderform',
                            'type': 'checkboxes',
                            "label": _Translate("Burger extras"),
                            "description": _Translate("Extras that we can add to your burger"),
                            "options": [
                                { "value": "cheese", "label": _Translate("Cheese") },
                                { "value": "salad", "label": _Translate("Salad") },
                                { "value": "mustard", "label": _Translate("Mustard") },
                                { "value": "union", "label": _Translate("Union") },
                                { "value": "pickles", "label": _Translate("Pickles") }
                            ]
                        },
                        'of_age': {
                            'plugin': 'infohub_renderform',
                            'type': 'checkboxes',
                            "label": _Translate("Of age"),
                            "description": _Translate( "I can only sell to you if you are of age"),
                            "options": [
                                { "value": "of_age", "label": _Translate("I am 18 years or older"), 'validator_plugin': 'infohub_validate', 'validator_function': 'validate_is_true'}
                            ]
                        },
                        'my_colour_select': {
                            'plugin': 'infohub_renderform',
                            'type': 'color',
                            'label': _Translate('Flower'),
                            'description': _Translate('You get a flower on the table. Select a colour and we will do a close match with the flowers we have.')
                        }
                    },
                    'how': {
                        'mode': 'one box',
                        'text': '[my_text][my_form]'
                    },
                    'where': {
                        'box_id': $in.parent_box_id + '.demo',
                        'max_width': 100,
                        'scroll_to_box_id': 'true'
                    },
                    'cache_key': 'form2'
                },
                'data_back': {'step': 'step_end'}
            });
        }

        return {
            'answer': $in.response.answer,
            'message': $in.response.message,
            'data': $in.response.data
        };
    };

    /**
     * Handle the buttons in demo: form2
     * @version 2018-09-26
     * @since 2018-09-26
     * @author Peter Lembke
     */
    $functions.push("click_form2_buttons");
    const click_form2_buttons = function ($in)
    {
        const $default = {
            'step': 'step_start',
            'type': '',
            'event_type': '',
            'event_data': '',
            'response': {
                'answer': 'false',
                'message': ''
            }
        };
        $in = _Default($default, $in);

        let $formData = {},
            $answer = 'false',
            $message = 'Trying to get form data',
            $ok = 'false';

        if ($in.step === 'step_start') {
            if ($in.type === 'button') {
                if ($in.event_type === 'click') {

                    if ($in.event_data === 'fill_form_quick_burger') {
                        $formData = {
                            'my_checkboxes_extras.cheese': {'value': 'true'},
                            'my_checkboxes_extras.mustard': {'value': 'true'},
                            'my_checkboxes_extras.pickles': {'value': 'false'},
                            'my_checkboxes_extras.salad': {'value': 'false'},
                            'my_checkboxes_extras.union': {'value': 'false'},
                            'my_colour_select': {'value': ''},
                            'my_radios_bread.bread_plain': {'value': 'true'},
                            'my_radios_burger.tofu_burger': {'value': 'true'},
                            'my_range': {'value': '200'},
                            'my_select': {'value': ['nothing']},
                            'my_textarea': {'value': _Translate('nothing special') },
                            'my_textbox': {'value': _Translate('Quick burger') },
                            'of_age.of_age': {'value': 'false'}
                        };
                    }

                    if ($in.event_data === 'fill_form_lunch_burger') {
                        $formData = {
                            'my_checkboxes_extras.cheese': {'value': 'false'},
                            'my_checkboxes_extras.mustard': {'value': 'false'},
                            'my_checkboxes_extras.pickles': {'value': 'true'},
                            'my_checkboxes_extras.salad': {'value': 'true'},
                            'my_checkboxes_extras.union': {'value': 'true'},
                            'my_colour_select': {'value': ''},
                            'my_radios_bread.bread_full': {'value': 'true'},
                            'my_radios_burger.halloumi_burger': {'value': 'true'},
                            'my_range': {'value': '175'},
                            'my_select': {'value': ['cutlery_knife', 'cutlery_fork', 'porcelain_plait', 'porcelain_glass']},
                            'my_textarea': {'value': _Translate('Only vegetables and spices') },
                            'my_textbox': {'value': _Translate('Lunch burger') },
                            'of_age.of_age': {'value': 'false'}
                        };
                    }

                    if ($in.event_data === 'fill_form_dinner_burger') {
                        $formData = {
                            'my_checkboxes_extras.cheese': {'value': 'true'},
                            'my_checkboxes_extras.mustard': {'value': 'true'},
                            'my_checkboxes_extras.pickles': {'value': 'true'},
                            'my_checkboxes_extras.salad': {'value': 'true'},
                            'my_checkboxes_extras.union': {'value': 'true'},
                            'my_colour_select': {'value': '#fff600'},
                            'my_radios_bread.bread_sesam': {'value': 'true'},
                            'my_radios_burger.beetroot_burger': {'value': 'true'},
                            'my_range': {'value': '150'},
                            'my_select': {'value': ['cutlery_knife', 'cutlery_fork', 'porcelain_plait', 'porcelain_glass', 'fabric_napkin', 'fabric_cloth']},
                            'my_textarea': {'value': _Translate('I want to go all in with this dinner. Dion mustard and Romani salad!!') },
                            'my_textbox': {'value': _Translate('Dinner burger') },
                            'of_age.of_age': {'value': 'false'}
                        };
                    }

                    $message = 'I have no form data';

                    if (_Empty($formData) === 'false')
                    {
                        return _SubCall({
                            'to': {
                                'node': 'client',
                                'plugin': 'infohub_view',
                                'function': 'form_write'
                            },
                            'data': {
                                'id': 'main.body.infohub_demo.demo',
                                'form_data': $formData
                            },
                            'data_back': {
                                'step': 'step_end'
                            }
                        });
                    }
                }
            }
        }
        
        if ($in.step === 'step_end') {
            $answer = $in.response.answer;
            $message = $in.response.message;
            $ok = $answer;
        }

        return {
            'answer': $answer,
            'message': $message,
            'ok': $ok
        };

    };

    /**
     * Handle the submit button in demo: form2
     * @version 2018-09-26
     * @since 2018-09-26
     * @author Peter Lembke
     */
    $functions.push("click_submit");
    const click_submit = function ($in)
    {
        const $default = {
            'step': 'step_start',
            'form_data': {}
        };
        $in = _Default($default, $in);

        if ($in.step === 'step_start') {
            window.alert(_Translate('This submit button works and goes to infohub_demo. This only happens if all data is valid.'));
        }

        return {
            'answer': 'true',
            'message': 'Submit done',
            'ok': 'true'
        };
    };

}
//# sourceURL=infohub_demo_form2.js