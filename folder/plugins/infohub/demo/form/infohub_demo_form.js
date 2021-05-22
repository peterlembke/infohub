/**
 * Render a form demo for infohub_demo
 *
 * @author      Peter Lembke <info@infohub.se>
 * @version     2019-03-28
 * @since       2018-05-25
 * @copyright   Copyright (c) 2018, Peter Lembke
 * @license     https://opensource.org/licenses/gpl-license.php GPL-3.0-or-later
 * @see         https://github.com/peterlembke/infohub/blob/master/folder/plugins/infohub/demo/form/infohub_demo_form.md Documentation
 * @link        https://infohub.se/ InfoHub main page
 */
function infohub_demo_form() {

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
            'class_name': 'infohub_demo_form',
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
            'click_file_read': 'normal',
            'click_file_write': 'normal',
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
                'message': 'Nothing to report from infohub_demo_form',
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
                            'data': _Translate('WELCOME_TO_INFOHUB_DEMO_FORM')
                        },
                        'ingress': {
                            'type': 'common',
                            'subtype': 'value',
                            'data': _Translate('HERE_ARE_SOME_DEMOS_TO_SHOW_YOU_WHAT_INFOHUB_CAN_DO_WITH_FORMS.')
                        },
                        'my_form': {
                            'type': 'form',
                            'subtype': 'form',
                            'content': '[my_fieldset]',
                        },
                        'my_fieldset': {
                            'type': 'form',
                            'subtype': 'fieldset',
                            'label': _Translate('A_FIELDSET_WITH_DEMO_FORM_ELEMENTS'),
                            'content': '[my_textbox][my_datalist][my_range][my_select][my_textarea][my_radio_bread_fieldset][my_radio_burger_fieldset][my_radio_extra_fieldset][my_button][button_download_file_information][button_download_file][my_file_selector_information][my_file_selector][my_file_box]'
                        },
                        'my_button': {
                            'type': 'form',
                            'subtype': 'button',
                            'mode': 'submit', // This is the submit button in the form
                            'button_label': _Translate('MY_BUTTON'),
                            'data': 'Some data',
                            'to_plugin': 'infohub_demo',
                        },
                        'my_textbox': {
                            'type': 'form',
                            'subtype': 'text',
                            'input_type': 'text',
                            'maxlength': '10',
                            'required': 'true',
                            'datalist_id': 'my_datalist',
                            'placeholder': _Translate('WRITE_SOMETHING_NICE_HERE')
                        },
                        'my_range': {
                            'type': 'form',
                            'subtype': 'range',
                            'input_type': 'range',
                            'min_value': '50',
                            'max_value': '250',
                            'step_value': '25',
                        },
                        'my_select': {
                            'type': 'form',
                            'subtype': 'select',
                            "label": _Translate("YOUR_MEAL"),
                            "description": _Translate("WHAT_DO_YOU_WANT_ON_YOUR_HAMBURGER"),
                            "size": "10",
                            "multiple": "true",
                            "options": [
                                { "type": "optgroup", "label": _Translate("BREAD") },
                                { "type": "option", "value": "bread_normal", "label": _Translate("NORMAL_BREAD") },
                                { "type": "option", "value": "bread_full", "label": _Translate("FIBER_BREAD") },
                                { "type": "/optgroup" },
                                { "type": "optgroup", "label": _Translate("BURGER") },
                                { "type": "option", "value": "green_burger", "label": _Translate("GREEN_BURGER") },
                                { "type": "option", "value": "boar_burger", "label": _Translate("BOAR_BURGER") },
                                { "type": "/optgroup" },
                                { "type": "optgroup", "label": _Translate("EXTRAS") },
                                { "type": "option", "value": "cheese", "label": _Translate("CHEESE") },
                                { "type": "option", "value": "salad", "label": _Translate("SALAD") },
                                { "type": "option", "value": "mustard", "label": _Translate("MUSTARD") },
                                { "type": "option", "value": "union", "label": _Translate("UNION") },
                                { "type": "/optgroup" }
                            ]
                        },
                        'my_textarea': {
                            'type': 'form',
                            'subtype': 'textarea',
                            'placeholder': _Translate('WRITE_SOMETHING_NICE_HERE'),
                            'validator_plugin': 'infohub_validate',
                            'validator_function': 'validate_has_data',
                        },
                        'my_datalist': {
                            'type': 'form',
                            'subtype': 'datalist',
                            "options": [
                                { "type": "option", "value": "bread_normal", "label": _Translate("NORMAL_BREAD") },
                                { "type": "option", "value": "bread_full", "label": _Translate("FIBER_BREAD") },
                                { "type": "option", "value": "green_burger", "label": _Translate("GREEN_BURGER") },
                                { "type": "option", "value": "boar_burger", "label": _Translate("BOAR_BURGER") },
                                { "type": "option", "value": "cheese", "label": _Translate("CHEESE") },
                                { "type": "option", "value": "salad", "label": _Translate("SALAD") },
                                { "type": "option", "value": "mustard", "label": _Translate("MUSTARD") },
                                { "type": "option", "value": "union", "label": _Translate("UNION") }
                            ]
                        },
                        'my_radio_bread_fieldset': {
                            'type': 'form',
                            'subtype': 'fieldset',
                            'label': _Translate('BREAD'),
                            'content': '[my_radios_bread]'
                        },
                        'my_radios_bread': {
                            'type': 'form',
                            'subtype': 'radios',
                            'group_name': 'bread',
                            "options": [
                                { "group_name": "bread", "value": "bread_normal", "label": _Translate("NORMAL_BREAD") },
                                { "group_name": "bread", "value": "bread_full", "label": _Translate("FIBER_BREAD") }
                            ]
                        },
                        'my_radio_burger_fieldset': {
                            'type': 'form',
                            'subtype': 'fieldset',
                            'label': _Translate('BURGER'),
                            'content': '[my_radios_burger]'
                        },
                        'my_radios_burger': {
                            'type': 'form',
                            'subtype': 'radios',
                            'group_name': 'burger',
                            "options": [
                                { "group_name": "burger", "value": "green_burger", "label": _Translate("GREEN_BURGER") },
                                { "group_name": "burger", "value": "boar_burger", "label": _Translate("BOAR_BURGER") }
                            ]
                        },
                        'my_radio_extra_fieldset': {
                            'type': 'form',
                            'subtype': 'fieldset',
                            'label': _Translate('EXTRA'),
                            'content': '[my_checkboxes]'
                        },
                        'my_checkboxes': {
                            'type': 'form',
                            'subtype': 'checkboxes',
                            "options": [
                                { "value": "cheese", "label": _Translate("CHEESE") },
                                { "value": "salad", "label": _Translate("SALAD") },
                                { "value": "mustard", "label": _Translate("MUSTARD") },
                                { "value": "union", "label": _Translate("UNION") }
                            ]
                        },
                        'button_download_file_information': {
                            'type': 'text',
                            'text': _Translate('BELOW_YOU_CAN_PRESS_THE_BUTTON_TO_DOWNLOAD_A_TEXT_FILE_WITH_A_GREETING._EXAMPLE_OF_DOWNLOADING_FILES.')
                        },
                        'button_download_file': {
                            'plugin': 'infohub_renderform',
                            'type': 'button',
                            'mode': 'button',
                            'button_label': _Translate('DOWNLOAD_FILE'),
                            'data': 'download_file',
                            'event_data': 'form|file_write',
                            'to_node': 'client',
                            'to_plugin': 'infohub_demo',
                            'to_function': 'click',
                        },
                        'my_file_selector_information': {
                            'type': 'text',
                            'text': _Translate('BELOW_YOU_CAN_PRESS_THE_BUTTON_TO_GET_A_FILE_SELECTOR._SELECT_ONE_OR_MORE_JPEG_IMAGES._THEY_WILL_BE_READ_AND_SHOWN_UNDER_THE_BUTTON.')
                        },
                        'my_file_selector': {
                            'type': 'form',
                            'subtype': 'file',
                            'accept': 'image/*.jpg',
                            'event_data': 'form|file_read',
                            'to_node': 'client',
                            'to_plugin': 'infohub_demo',
                            'to_function': 'click',
                            'button_label': _Translate('SELECT_IMAGES'),
                        },
                        'my_file_box': {
                            'type': 'common',
                            'subtype': 'container',
                            'tag': 'div',
                        },
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
                    'cache_key': 'form',
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
     * File read
     * @version 2019-01-12
     * @since 2019-01-12
     * @author Peter Lembke
     */
    $functions.push('click_file_read');
    const click_file_read = function($in) {
        const $default = {
            'answer': 'false',
            'message': 'Nothing to report',
            'step': 'step_start',
            'box_id': '',
            'files_data': [],
        };
        $in = _Default($default, $in);

        let $what = {};

        if ($in.step === 'step_start') {
            let $links = '';

            for (let $fileNumber = 0; $fileNumber <
            $in.files_data.length; $fileNumber = $fileNumber + 1) {
                const $name = 'my_image_' + $fileNumber;
                $links = $links + '[' + $name + ']';
                $what[$name] = {
                    'type': 'common',
                    'subtype': 'image',
                    'data': $in.files_data[$fileNumber].content,
                };
            }

            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_render',
                    'function': 'create',
                },
                'data': {
                    'what': $what,
                    'how': {
                        'mode': 'one box',
                        'text': $links,
                    },
                    'where': {
                        'box_id': $in.box_id + '_my_file_box',
                        'max_width': 640,
                        'scroll_to_box_id': 'true',
                    },
                },
                'data_back': {
                    'step': 'step_render_response',
                },
            });
        }

        return {
            'answer': 'true',
            'message': 'Done handling files data',
            'ok': 'true', // Gives an OK on the button you clicked
        };
    };

    /**
     * File write
     * @version 2019-01-13
     * @since 2019-01-13
     * @author Peter Lembke
     */
    $functions.push('click_file_write');
    const click_file_write = function($in) {
        const $default = {
            'step': 'step_start',
        };
        $in = _Default($default, $in);

        if ($in.step === 'step_start') {
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_view',
                    'function': 'file_write',
                },
                'data': {
                    'file_name': 'foobar.txt',
                    'content': 'This is the content of the file',
                },
                'data_back': {
                    'step': 'step_end',
                },
            });
        }

        return {
            'answer': 'true',
            'message': 'Done handling files data',
            'ok': 'true', // Gives an OK on the button you clicked
        };
    };
}

//# sourceURL=infohub_demo_form.js