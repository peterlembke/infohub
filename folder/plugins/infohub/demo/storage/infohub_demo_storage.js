/**
 * Show all features in Storage on client and server
 *
 * @author      Peter Lembke <info@infohub.se>
 * @version     2020-06-19
 * @since       2020-06-19
 * @copyright   Copyright (c) 2020, Peter Lembke
 * @license     https://opensource.org/licenses/gpl-license.php GPL-3.0-or-later
 * @see         https://github.com/peterlembke/infohub/blob/master/folder/plugins/infohub/demo/storage/infohub_demo_storage.md Documentation
 * @link        https://infohub.se/ InfoHub main page
 */
function infohub_demo_storage() {

    "use strict";

// include "infohub_base.js"

    $functions.push('_Version');
    /**
     * Version information, used by the version function
     * @returns {{date: string, note: string, 'SPDX-License-Identifier': string, checksum: string, version: string, class_name: string, since: string, status: string}}
     * @private
     */
    const _Version = function() {
        return {
            'date': '2020-06-19',
            'since': '2020-06-19',
            'version': '1.0.0',
            'checksum': '{{checksum}}',
            'class_name': 'infohub_demo_storage',
            'note': 'Show all features in Storage on client and server',
            'status': 'normal',
            'SPDX-License-Identifier': 'GPL-3.0-or-later'
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
            'click_button': 'normal'
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

            const $size = '1';

            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_render',
                    'function': 'create'
                },
                'data': {
                    'what': {
                        'intro_text': {
                            'type': 'text',
                            'text': "[h1][titel][/h1]\n [i][ingress][/i]\n"
                        },
                        'titel': {
                            'type': 'common',
                            'subtype': 'value',
                            'data': _Translate('InfoHub Demo Storage')
                        },
                        'ingress': {
                            'type': 'common',
                            'subtype': 'value',
                            'data': _Translate('You can test the Storage on the client and server')
                        },
                        'write_form': {
                            'plugin': 'infohub_renderform',
                            'type': 'form',
                            'content': '[write_node][write_mode][write_path][write_data][write_button]',
                            'label': _Translate('Write'),
                            'description': _Translate('Select options and press button to write')
                        },
                        'write_node': {
                            'plugin': 'infohub_renderform',
                            'type': 'select',
                            "label": _Translate("Node"),
                            "size": $size,
                            "multiple": "false",
                            'validator_plugin': 'infohub_validate',
                            'validator_function': 'validate_has_data',
                            "options": [
                                { "type": "option", "value": "client", "label": _Translate("Client"), 'selected': 'true' },
                                { "type": "option", "value": "server", "label": _Translate("Server") }
                            ]
                        },
                        'write_mode': {
                            'plugin': 'infohub_renderform',
                            'type': 'select',
                            "label": _Translate("Mode"),
                            "size": $size,
                            "multiple": "false",
                            'validator_plugin': 'infohub_validate',
                            'validator_function': 'validate_has_data',
                            "options": [
                                { "type": "option", "value": "overwrite", "label": _Translate("overwrite"), 'selected': 'true' },
                                { "type": "option", "value": "merge", "label": _Translate("merge") }
                            ]
                        },
                        'write_path': {
                            'plugin': 'infohub_renderform',
                            'type': 'select',
                            "label": _Translate("Path"),
                            "size": $size,
                            "multiple": "false",
                            'validator_plugin': 'infohub_validate',
                            'validator_function': 'validate_has_data',
                            "options": [
                                { "type": "option", "value": "/a/test1", "label": _Translate("/a/test1"), 'selected': 'true' },
                                { "type": "option", "value": "/b/test2", "label": _Translate("/b/test2") },
                                { "type": "option", "value": "/b/test3", "label": _Translate("/b/test3") },
                                { "type": "option", "value": "/c/test4", "label": _Translate("/c/test4") },
                                { "type": "option", "value": "all_four", "label": _Translate("All four") },
                                { "type": "option", "value": "/b/*", "label": _Translate("/b/*") }
                            ]
                        },
                        'write_data': {
                            'plugin': 'infohub_renderform',
                            'type': 'select',
                            "label": _Translate("Data"),
                            "size": $size,
                            "multiple": "false",
                            'validator_plugin': 'infohub_validate',
                            'validator_function': 'validate_has_data',
                            "options": [
                                { "type": "option", "value": "adam", "label": _Translate("Adam"), 'selected': 'true' },
                                { "type": "option", "value": "bertil", "label": _Translate("Bertil") },
                                { "type": "option", "value": "cesar", "label": _Translate("Cesar") },
                                { "type": "option", "value": "flag_true", "label": _Translate("Flag true") },
                                { "type": "option", "value": "flag_false", "label": _Translate("Flag false") },
                                { "type": "option", "value": "empty", "label": _Translate("Empty") }
                            ]
                        },
                        'write_button': {
                            'plugin': 'infohub_renderform',
                            'type': 'button',
                            'mode': 'submit',
                            'button_label': _Translate('Write'),
                            'event_data': 'storage|button|write',
                            'to_plugin': 'infohub_demo',
                            'to_function': 'click'
                        },
                        'read_form': {
                            'plugin': 'infohub_renderform',
                            'type': 'form',
                            'content': '[read_node][read_path][read_wanted_data][read_button][read_data]',
                            'label': _Translate('Read'),
                            'description': _Translate('Select options and press button to read')
                        },
                        'read_node': {
                            'plugin': 'infohub_renderform',
                            'type': 'select',
                            "label": _Translate("Node"),
                            "size": $size,
                            "multiple": "false",
                            'validator_plugin': 'infohub_validate',
                            'validator_function': 'validate_has_data',
                            "options": [
                                { "type": "option", "value": "client", "label": _Translate("Client"), 'selected': 'true' },
                                { "type": "option", "value": "server", "label": _Translate("Server") }
                            ]
                        },
                        'read_path': {
                            'plugin': 'infohub_renderform',
                            'type': 'select',
                            "label": _Translate("Path"),
                            "size": $size,
                            "multiple": "false",
                            'validator_plugin': 'infohub_validate',
                            'validator_function': 'validate_has_data',
                            "options": [
                                { "type": "option", "value": "/a/test1", "label": _Translate("/a/test1"), 'selected': 'true' },
                                { "type": "option", "value": "/b/test2", "label": _Translate("/b/test2") },
                                { "type": "option", "value": "/b/test3", "label": _Translate("/b/test3") },
                                { "type": "option", "value": "/c/test4", "label": _Translate("/c/test4") },
                                { "type": "option", "value": "all_four", "label": _Translate("All four") },
                                { "type": "option", "value": "/b/*", "label": _Translate("/b/*") }
                            ]
                        },
                        'read_wanted_data': {
                            'plugin': 'infohub_renderform',
                            'type': 'select',
                            "label": _Translate("Wanted data"),
                            "size": $size,
                            "multiple": "false",
                            'validator_plugin': 'infohub_validate',
                            'validator_function': 'validate_has_data',
                            "options": [
                                { "type": "option", "value": "empty", "label": _Translate("Empty"), 'selected': 'true' },
                                { "type": "option", "value": "first_name", "label": _Translate("First name") },
                                { "type": "option", "value": "last_name", "label": _Translate("Last name") }
                            ]
                        },
                        'read_button': {
                            'plugin': 'infohub_renderform',
                            'type': 'button',
                            'mode': 'submit',
                            'button_label': _Translate('Read'),
                            'event_data': 'storage|button|read',
                            'to_plugin': 'infohub_demo',
                            'to_function': 'click'
                        },
                        'read_data': {
                            'plugin': 'infohub_renderform',
                            'type': 'textarea',
                            'placeholder': _Translate('Here you will see the data we read from Storage'),
                            "label": _Translate("Read data"),
                            "description": _Translate("The data read from Storage.")
                        },
                    },
                    'how': {
                        'mode': 'one box',
                        'text': '[intro_text][write_form][read_form]'
                    },
                    'where': {
                        'box_id': $in.parent_box_id + '.demo',
                        'max_width': 100,
                        'scroll_to_box_id': 'true'
                    },
                    'cache_key': 'storage'
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
     * Handle the buttons in demo: Storage
     * @version 2020-06-20
     * @since 2020-06-19
     * @author Peter Lembke
     */
    $functions.push("click_button");
    const click_button = function ($in)
    {
        const $default = {
            'box_id': '',
            'type': '',
            'event_type': '',
            'event_data': '',
            'form_data': {},
            'step': 'step_start',
            'response': {}
        };
        $in = _Default($default, $in);

        let $formData = {},
            $answer = 'false',
            $message = 'Trying to get form data',
            $ok = 'false',
            $formDataValue = {};

        if ($in.step === 'step_start') {

            const $path = {
                "/a/test1": "infohub_demo_storage/storage/a/test1",
                "/b/test2": "infohub_demo_storage/storage/b/test2",
                "/b/test3":"infohub_demo_storage/storage/b/test3",
                "/c/test4": "infohub_demo_storage/storage/c/test4",
                "all_four": "all_four",
                "/b/*": "infohub_demo_storage/storage/b/*"
            };

            const $data = {
                'adam': { 'first': 'Adam', 'last': 'Andersson' },
                'bertil': { 'first': 'Bertil', 'last': 'Bengtsson' },
                'cesar': { 'first': 'Cesar', 'last': 'Carlsson' },
                'flag_true': { 'flag': 'true' },
                'flag_false': { 'flag': 'false' },
                'empty': {}
            };

            const $allFour = {
                "infohub_demo_storage/storage/a/test1": {},
                "infohub_demo_storage/storage/b/test2": {},
                "infohub_demo_storage/storage/b/test3": {},
                "infohub_demo_storage/storage/c/test4": {}
            };

            const $wantedData = {
                "empty": {},
                "first_name": { 'first': '' },
                "last_name": { 'last': '' }
            };

            if ($in.event_data === 'write') {
                $formDataValue = {
                    'node': _GetData({'name': 'form_data/write_node/value/0', 'default': '', 'data': $in }),
                    'mode': _GetData({'name': 'form_data/write_mode/value/0', 'default': '', 'data': $in }),
                    'path': _GetData({'name': 'form_data/write_path/value/0', 'default': '', 'data': $in }),
                    'data': _GetData({'name': 'form_data/write_data/value/0', 'default': '', 'data': $in })
                };

                $formDataValue.path = $path[$formDataValue.path];
                $formDataValue.data = $data[$formDataValue.data];

                $in.step = 'step_write';

                if ($formDataValue.path.slice(-1) === '*') {
                    $in.step = 'step_write_pattern';
                }

                if ($formDataValue.path === 'all_four') {
                    let $myData = {};
                    for (let $key in $allFour) {
                        if ($allFour.hasOwnProperty($key) === false) {
                            continue;
                        }

                        $myData[$key] = $formDataValue.data;
                    }
                    $formDataValue.path = $myData;
                    $in.step = 'step_write_many';
                }

                $in.step = $in.step + '_' + $formDataValue.node;
            }

            if ($in.event_data === 'read') {
                $formDataValue = {
                    'node': _GetData({'name': 'form_data/read_node/value/0', 'default': '', 'data': $in }),
                    'path': _GetData({'name': 'form_data/read_path/value/0', 'default': '', 'data': $in }),
                    'wanted_data': _GetData({'name': 'form_data/read_wanted_data/value/0', 'default': '', 'data': $in })
                };

                $formDataValue.path = $path[$formDataValue.path];

                $formDataValue.wanted_data = $wantedData[$formDataValue.wanted_data];

                $in.step = 'step_read';

                if ($formDataValue.path.slice(-1) === '*') {
                    $in.step = 'step_read_pattern';
                }

                if ($formDataValue.path === 'all_four') {
                    let $myData = {};
                    for (let $key in $allFour) {
                        if ($allFour.hasOwnProperty($key) === false) {
                            continue;
                        }

                        $myData[$key] = $formDataValue.wanted_data;
                    }
                    $formDataValue.path = $myData;
                    $in.step = 'step_read_many';
                }

                $in.step = $in.step + '_' + $formDataValue.node;
            }
        }

        if ($in.step === 'step_write_server') {
            const $callServer = _SubCall({
                'to': {
                    'node': $formDataValue.node,
                    'plugin': 'infohub_demo',
                    'function': 'storage'
                },
                'data': {
                    'path': $formDataValue.path,
                    'data': $formDataValue.data,
                    'mode': $formDataValue.mode,
                    'command': 'write'
                },
                'data_back': {}
            });

            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_demo',
                    'function': 'call_server'
                },
                'data': {
                    'send_data': $callServer
                },
                'data_back': {
                    'step': 'step_write_response'
                }
            });
        }

        if ($in.step === 'step_write_client') {
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_storage',
                    'function': 'write'
                },
                'data': {
                    'path': $formDataValue.path,
                    'data': $formDataValue.data,
                    'mode': $formDataValue.mode
                },
                'data_back': {
                    'step': 'step_write_response'
                }
            });
        }

        if ($in.step === 'step_write_response') {
            const $myData = _JsonEncode($in.response);
            $formData = {
                'read_data': { 'value': $myData }
            };
            $in.step = 'step_form_write';
        }

        if ($in.step === 'step_write_many_server') {
            const $callServer = _SubCall({
                'to': {
                    'node': $formDataValue.node,
                    'plugin': 'infohub_demo',
                    'function': 'storage'
                },
                'data': {
                    'paths': $formDataValue.path,
                    'mode': $formDataValue.mode,
                    'command': 'write_many'
                },
                'data_back': {}
            });

            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_demo',
                    'function': 'call_server'
                },
                'data': {
                    'send_data': $callServer
                },
                'data_back': {
                    'step': 'step_write_many_response'
                }
            });
        }

        if ($in.step === 'step_write_many_client') {
            return _SubCall({
                'to': {
                    'node': $formDataValue.node,
                    'plugin': 'infohub_storage',
                    'function': 'write_many'
                },
                'data': {
                    'paths': $formDataValue.path,
                    'mode': $formDataValue.mode
                },
                'data_back': {
                    'step': 'step_write_many_response'
                }
            });
        }

        if ($in.step === 'step_write_many_response') {
            const $myData = _JsonEncode($in.response);
            $formData = {
                'read_data': { 'value': $myData }
            };
            $in.step = 'step_form_write';
        }

        if ($in.step === 'step_write_pattern_server') {
            const $callServer = _SubCall({
                'to': {
                    'node': 'server',
                    'plugin': 'infohub_demo',
                    'function': 'storage'
                },
                'data': {
                    'path': $formDataValue.path,
                    'mode': $formDataValue.mode,
                    'data': $formDataValue.data,
                    'command': 'write_pattern'
                },
                'data_back': {}
            });

            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_demo',
                    'function': 'call_server'
                },
                'data': {
                    'send_data': $callServer
                },
                'data_back': {
                    'step': 'step_read_many_response'
                }
            });
        }

        if ($in.step === 'step_write_pattern_client') {
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_storage',
                    'function': 'write_pattern'
                },
                'data': {
                    'path': $formDataValue.path,
                    'mode': $formDataValue.mode,
                    'data': $formDataValue.data
                },
                'data_back': {
                    'step': 'step_read_pattern_response'
                }
            });
        }

        if ($in.step === 'step_write_pattern_response') {
            const $myData = _JsonEncode($in.response);
            $formData = {
                'read_data': { 'value': $myData }
            };
            $in.step = 'step_form_write';
        }

        if ($in.step === 'step_read_server') {
            const $callServer = _SubCall({
                'to': {
                    'node': $formDataValue.node,
                    'plugin': 'infohub_demo',
                    'function': 'storage'
                },
                'data': {
                    'path': $formDataValue.path,
                    'wanted_data': $formDataValue.wanted_data,
                    'command': 'read'
                },
                'data_back': {}
            });

            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_demo',
                    'function': 'call_server'
                },
                'data': {
                    'send_data': $callServer
                },
                'data_back': {
                    'step': 'step_read_response'
                }
            });
        }

        if ($in.step === 'step_read_client') {
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_storage',
                    'function': 'read'
                },
                'data': {
                    'path': $formDataValue.path,
                    'wanted_data': $formDataValue.wanted_data
                },
                'data_back': {
                    'step': 'step_read_response'
                }
            });
        }

        if ($in.step === 'step_read_response') {
            const $myData = _JsonEncode($in.response);
            $formData = {
                'read_data': { 'value': $myData }
            };
            $in.step = 'step_form_write';
        }

        if ($in.step === 'step_read_many_server') {
            const $callServer = _SubCall({
                'to': {
                    'node': $formDataValue.node,
                    'plugin': 'infohub_demo',
                    'function': 'storage'
                },
                'data': {
                    'paths': $formDataValue.path,
                    'wanted_data': $formDataValue.wanted_data,
                    'command': 'read_many'
                },
                'data_back': {}
            });

            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_demo',
                    'function': 'call_server'
                },
                'data': {
                    'send_data': $callServer
                },
                'data_back': {
                    'step': 'step_read_many_response'
                }
            });
        }

        if ($in.step === 'step_read_many_client') {
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_storage',
                    'function': 'read_many'
                },
                'data': {
                    'paths': $formDataValue.path,
                    'wanted_data': $formDataValue.wanted_data
                },
                'data_back': {
                    'step': 'step_read_many_response'
                }
            });
        }

        if ($in.step === 'step_read_many_response') {
            const $myData = _JsonEncode($in.response);
            $formData = {
                'read_data': { 'value': $myData }
            };
            $in.step = 'step_form_write';
        }

        if ($in.step === 'step_read_pattern_server') {
            const $callServer = _SubCall({
                'to': {
                    'node': 'server',
                    'plugin': 'infohub_demo',
                    'function': 'storage'
                },
                'data': {
                    'path': $formDataValue.path,
                    'wanted_data': $formDataValue.wanted_data,
                    'command': 'read_pattern'
                },
                'data_back': {}
            });

            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_demo',
                    'function': 'call_server'
                },
                'data': {
                    'send_data': $callServer
                },
                'data_back': {
                    'step': 'step_read_many_response'
                }
            });
        }

        if ($in.step === 'step_read_pattern_client') {
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_storage',
                    'function': 'read_pattern'
                },
                'data': {
                    'path': $formDataValue.path,
                    'wanted_data': $formDataValue.wanted_data
                },
                'data_back': {
                    'step': 'step_read_pattern_response'
                }
            });
        }

        if ($in.step === 'step_read_pattern_response') {
            const $myData = _JsonEncode($in.response);
            $formData = {
                'read_data': { 'value': $myData }
            };
            $in.step = 'step_form_write';
        }

        if ($in.step === 'step_form_write') {
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

        if ($in.step === 'step_end') {
            const $default = {
                'answer': 'false',
                'message': ''
            };
            $in.response = _Default($default, $in.response);

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
}
//# sourceURL=infohub_demo_storage.js