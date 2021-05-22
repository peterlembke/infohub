/**
 * Render a form demo for infohub_demo
 *
 * @author      Peter Lembke <info@infohub.se>
 * @version     2019-03-28
 * @since       2018-05-25
 * @copyright   Copyright (c) 2018, Peter Lembke
 * @license     https://opensource.org/licenses/gpl-license.php GPL-3.0-or-later
 * @see         https://github.com/peterlembke/infohub/blob/master/folder/plugins/infohub/demo/form2/infohub_demo_form2.md Documentation
 * @link        https://infohub.se/ InfoHub main page
 */
function infohub_demo_form2() {

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
            'since': '2018-05-25',
            'version': '2.0.0',
            'checksum': '{{checksum}}',
            'class_name': 'infohub_demo_form2',
            'note': 'Render a form demo for infohub_demo',
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
            'click_form2_buttons': 'normal',
            'click_submit': 'normal',
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
     * @version 2019-03-28
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
                'message': 'Nothing to report from infohub_demo_form2',
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
                        'my_text': {
                            'type': 'text',
                            'text': '[h1][titel][/h1]\n [i][ingress][/i]\n',
                        },
                        'titel': {
                            'type': 'common',
                            'subtype': 'value',
                            'data': _Translate('WELCOME_TO_THE_INFOHUB_DEMO_FOR_MORE_ADVANCED_FORMS')
                        },
                        'ingress': {
                            'type': 'common',
                            'subtype': 'value',
                            'data': _Translate('IN_THIS_DEMO_YOU_CAN_ORDER_A_MEAL_AT_A_RESTAURANT._ALL_THE_FORM_ELEMENTS_ARE_USED_IN_THIS_DEMO.')
                        },
                        'my_form': {
                            'plugin': 'infohub_renderform',
                            'type': 'form',
                            'content': '[button_fill_data_quick_burger][button_fill_data_lunch_burger][button_fill_data_dinner_burger][of_age][my_textbox][my_datalist][my_select][my_radios_bread][my_radios_burger][my_range][my_checkboxes_extras][my_colour_select][my_textarea][my_button]',
                            'label': _Translate('YOUR_BURGER_MEAL'),
                            'description': _Translate('PLEASE_SELECT_THE_DETAILS_FOR_YOUR_BURGER_MEAL.')
                        },
                        'my_button': {
                            'plugin': 'infohub_renderform',
                            'type': 'button',
                            'mode': 'submit',
                            'button_label': _Translate('ORDER_YOUR_MEAL'),
                            'event_data': 'form2|submit',
                            'to_plugin': 'infohub_demo',
                            'to_function': 'click',
                        },
                        'button_fill_data_quick_burger': {
                            'plugin': 'infohub_renderform',
                            'type': 'button',
                            'mode': 'button',
                            'button_label': _Translate('QUICK_BURGER'),
                            'event_data': 'form2|form2_buttons|fill_form_quick_burger',
                            'to_plugin': 'infohub_demo',
                            'to_function': 'click',
                        },
                        'button_fill_data_lunch_burger': {
                            'plugin': 'infohub_renderform',
                            'type': 'button',
                            'mode': 'button',
                            'button_label': _Translate('LUNCH_BURGER'),
                            'event_data': 'form2|form2_buttons|fill_form_lunch_burger',
                            'to_plugin': 'infohub_demo',
                            'to_function': 'click',
                        },
                        'button_fill_data_dinner_burger': {
                            'plugin': 'infohub_renderform',
                            'type': 'button',
                            'mode': 'button',
                            'button_label': _Translate('DINNER_BURGER'),
                            'event_data': 'form2|form2_buttons|fill_form_dinner_burger',
                            'to_plugin': 'infohub_demo',
                            'to_function': 'click',
                        },
                        'my_textbox': {
                            'plugin': 'infohub_renderform',
                            'type': 'text',
                            'label': _Translate('ALIAS'),
                            'description': _Translate('YOUR_ALIAS_FOR_THIS_BURGER_ORDER,_SO_YOU_CAN_EASILY_REORDER_AT_A_LATER_TIME'),
                            'maxlength': '30',
                            'validator_plugin': 'infohub_validate',
                            'validator_function': 'validate_has_data',
                            'datalist_id': 'my_datalist',
                            'placeholder': 'Any alias',
                        },
                        'my_range': {
                            'plugin': 'infohub_renderform',
                            'type': 'range',
                            'min_value': '50',
                            'max_value': '250',
                            'step_value': '25',
                            'label': _Translate('FRYING_THE_BURGER'),
                            'description': _Translate('HOW_MUCH_DU_YOU_WANT_US_TO_FRY_THE_BURGER,_FROM_LIGHTLY_TOUCHING_THE_PAN_UP_TO_METEORITE')
                        },
                        'my_select': {
                            'plugin': 'infohub_renderform',
                            'type': 'select',
                            "label": _Translate("SIDE_DISH"),
                            "description": _Translate("WHAT_DO_YOU_WANT_TO_MAKE_YOUR_MEAL_EVEN_BETTER"),
                            "size": "10",
                            "multiple": "true",
                            'validator_plugin': 'infohub_validate',
                            'validator_function': 'validate_has_data',
                            "options": [
                                { "type": "option", "value": "nothing", "label": _Translate("NOTHING") },
                                { "type": "optgroup", "label": _Translate("CUTLERY") },
                                { "type": "option", "value": "cutlery_knife", "label": _Translate("KNIFE") },
                                { "type": "option", "value": "cutlery_fork", "label": _Translate("FORK") },
                                { "type": "/optgroup" },
                                { "type": "optgroup", "label": _Translate("PORCELAIN") },
                                { "type": "option", "value": "porcelain_plait", "label": _Translate("PLAIT") },
                                { "type": "option", "value": "porcelain_glass", "label": _Translate("GLASS") },
                                { "type": "/optgroup" },
                                { "type": "optgroup", "label": _Translate("FABRIC") },
                                { "type": "option", "value": "fabric_napkin", "label": _Translate("NAPKIN") },
                                { "type": "option", "value": "fabric_cloth", "label": _Translate("TABLE_CLOTH") },
                                { "type": "/optgroup" }
                            ]
                        },
                        'my_textarea': {
                            'plugin': 'infohub_renderform',
                            'type': 'textarea',
                            'placeholder': _Translate('YOUR_SPECIAL_REQUESTS'),
                            "label": _Translate("SPECIAL_REQUESTS"),
                            "description": _Translate("IF_YOU_HAVE_SOME_SPECIAL_REQUESTS_FOR_YOUR_MEAL_THEN_WRITE_THEM_HERE."),
                            'validator_plugin': 'infohub_validate',
                            'validator_function': 'validate_has_data',
                        },
                        'my_datalist': {
                            'type': 'form',
                            'subtype': 'datalist',
                            "options": [
                                { "type": "option", "value": "a_date_meal", "label": _Translate("A_DATE_MEAL") },
                                { "type": "option", "value": "an_after_movie_meal", "label": _Translate("AN_AFTER_MOVIE_MEAL") },
                                { "type": "option", "value": "a_before_movie_meal", "label": _Translate("A_BEFORE_MOVIE_MEAL") },
                                { "type": "option", "value": "ultra_running_meal", "label": _Translate("ULTRA_RUNNING_MEAL") },
                                { "type": "option", "value": "meal_during_shopping", "label": _Translate("MEAL_DURING_SHOPPING") }
                            ]
                        },
                        'my_radios_bread': {
                            'plugin': 'infohub_renderform',
                            'type': 'radios',
                            "label": _Translate("BREAD"),
                            "description": _Translate("WHAT_KIND_OF_BREAD_DO_YOU_WANT?"),
                            'group_name': 'testing',
                            "options": [
                                { "group_name": "bread", "value": "bread_plain", "label": _Translate("PLAIN_BREAD"), 'selected': 'true' },
                                { "group_name": "bread", "value": "bread_full", "label": _Translate("FIBER_BREAD") },
                                { "group_name": "bread", "value": "bread_sesam", "label": _Translate("SESAM_BREAD") }
                            ]
                        },
                        'my_radios_burger': {
                            'plugin': 'infohub_renderform',
                            'type': 'radios',
                            "label": _Translate("BURGER"),
                            "description": _Translate("WHAT_KIND_OF_BURGER_DO_YOU_WANT?"),
                            'group_name': 'testing',
                            "options": [
                                { "group_name": "burger", "value": "tofu_burger", "label": _Translate("TOFU_BURGER"), 'selected': 'true' },
                                { "group_name": "burger", "value": "halloumi_burger", "label": _Translate("HALLOUMI_BURGER") },
                                { "group_name": "burger", "value": "soy_burger", "label": _Translate("SOY_BURGER") },
                                { "group_name": "burger", "value": "carrot_burger", "label": _Translate("CARROT_BASED_BURGER") },
                                { "group_name": "burger", "value": "beetroot_burger", "label": _Translate("BEETROOT_BASED_BURGER") }
                            ]
                        },
                        'my_checkboxes_extras': {
                            'plugin': 'infohub_renderform',
                            'type': 'checkboxes',
                            "label": _Translate("BURGER_EXTRAS"),
                            "description": _Translate("EXTRAS_THAT_WE_CAN_ADD_TO_YOUR_BURGER"),
                            "options": [
                                { "value": "cheese", "label": _Translate("CHEESE") },
                                { "value": "salad", "label": _Translate("SALAD") },
                                { "value": "mustard", "label": _Translate("MUSTARD") },
                                { "value": "union", "label": _Translate("UNION") },
                                { "value": "pickles", "label": _Translate("PICKLES") }
                            ]
                        },
                        'of_age': {
                            'plugin': 'infohub_renderform',
                            'type': 'checkboxes',
                            "label": _Translate("OF_AGE"),
                            "description": _Translate("I_CAN_ONLY_SELL_TO_YOU_IF_YOU_ARE_OF_AGE"),
                            "options": [
                                { "value": "of_age", "label": _Translate("I_AM_18_YEARS_OR_OLDER"), 'validator_plugin': 'infohub_validate', 'validator_function': 'validate_is_true'}
                            ]
                        },
                        'my_colour_select': {
                            'plugin': 'infohub_renderform',
                            'type': 'color',
                            'label': _Translate('FLOWER'),
                            'description': _Translate('YOU_GET_A_FLOWER_ON_THE_TABLE._SELECT_A_COLOUR_AND_WE_WILL_DO_A_CLOSE_MATCH_WITH_THE_FLOWERS_WE_HAVE.')
                        }
                    },
                    'how': {
                        'mode': 'one box',
                        'text': '[my_text][my_form]',
                    },
                    'where': {
                        'box_id': $in.parent_box_id + '.demo',
                        'max_width': 100,
                        'scroll_to_box_id': 'true',
                    },
                    'cache_key': 'form2',
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
     * Handle the buttons in demo: form2
     * @version 2018-09-26
     * @since 2018-09-26
     * @author Peter Lembke
     */
    $functions.push('click_form2_buttons');
    const click_form2_buttons = function($in) {
        const $default = {
            'step': 'step_start',
            'type': '',
            'event_type': '',
            'event_data': '',
            'response': {
                'answer': 'false',
                'message': '',
            },
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
                            'my_textarea': {'value': _Translate('NOTHING_SPECIAL') },
                            'my_textbox': {'value': _Translate('QUICK_BURGER') },
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
                            'my_textarea': {'value': _Translate('ONLY_VEGETABLES_AND_SPICES') },
                            'my_textbox': {'value': _Translate('LUNCH_BURGER') },
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
                            'my_textarea': {'value': _Translate('I_WANT_TO_GO_ALL_IN_WITH_THIS_DINNER._DION_MUSTARD_AND_ROMANI_SALAD!!') },
                            'my_textbox': {'value': _Translate('DINNER_BURGER') },
                            'of_age.of_age': {'value': 'false'}
                        };
                    }

                    $message = 'I have no form data';

                    if (_Empty($formData) === 'false') {
                        return _SubCall({
                            'to': {
                                'node': 'client',
                                'plugin': 'infohub_view',
                                'function': 'form_write',
                            },
                            'data': {
                                'id': 'main.body.infohub_demo.demo',
                                'form_data': $formData,
                            },
                            'data_back': {
                                'step': 'step_end',
                            },
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
            'ok': $ok,
        };

    };

    /**
     * Handle the submit button in demo: form2
     * @version 2018-09-26
     * @since 2018-09-26
     * @author Peter Lembke
     */
    $functions.push('click_submit');
    const click_submit = function($in) {
        const $default = {
            'step': 'step_start',
            'form_data': {},
        };
        $in = _Default($default, $in);

        let $messageArray = [];

        if ($in.step === 'step_start') {
            const $text = _Translate('THIS_SUBMIT_BUTTON_WORKS_AND_GOES_TO_INFOHUB_DEMO._THIS_ONLY_HAPPENS_IF_ALL_DATA_IS_VALID.');
            const $messageOut = _Alert($text);
            $messageArray.push($messageOut);
        }

        return {
            'answer': 'true',
            'message': 'Submit done',
            'ok': 'true',
            'messages': $messageArray,
        };
    };

}

//# sourceURL=infohub_demo_form2.js