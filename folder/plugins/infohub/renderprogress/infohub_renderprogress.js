/**
 * infohub_renderprogress
 * Renders a progress bar, percent completed, value/maxValue
 *
 * @package     Infohub
 * @subpackage  infohub_renderprogress
 * @since       2023-07-09
 * @author      Peter Lembke <info@infohub.se>
 * @license     GPL-3.0-or-later
 * @copyright   Copyright (C) 2010- Peter Lembke
 */
function infohub_renderprogress() {

    'use strict';

    // include "infohub_base.js"

    const _Version = function() {
        return {
            'date': '2023-08-09',
            'since': '2023-07-09',
            'version': '1.0.0',
            'checksum': '{{checksum}}',
            'class_name': 'infohub_renderprogress',
            'note': 'Renders a progress bar, percent completed, value/maxValue',
            'status': 'normal',
            'SPDX-License-Identifier': 'GPL-3.0-or-later',
            'user_role': 'user',
            'web_worker': 'true',
            'core_plugin': 'false',
            'has_assets': 'true'
        };
    };

    const _GetCmdFunctions = function() {
        const $list = {
            'create': 'normal',
            'start_progress': 'normal',
            'stop_stop': 'normal',
            'add_value': 'normal',
            'update_progress': 'normal'
        };

        return _GetCmdFunctionsBase($list);
    };

    // ***********************************************************
    // * The private functions, add your own in your plugin
    // * These functions can be used directly in your functions.
    // * Name: _CamelCaseData
    // ***********************************************************

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

            $response = $response + $parts[$key].charAt(0).toUpperCase() + $parts[$key].substring(1);
        }

        return $response;
    };

    // *****************************************************************************
    // * Functions you only can reach with CMD()
    // * Observe function names are lower_case
    // *****************************************************************************

    $functions.push('create');
    /**
     * Get instructions and create the html
     * @version 2020-12-19
     * @since   2013-04-15
     * @author  Peter Lembke
     *
     * @param $in
     * @returns {{item_index, answer: string, message: string}|*}
     */
    const create = function($in = {}) {
        const $default = {
            'item_index': {},
            'config': {},
            'data_back': {
                'item_name': '',
                'item_index_done': {},
            },
            'response': {},
            'step': 'step_create',
        };
        $in = _Default($default, $in);

        if ($in.step === 'step_create_response') {
            const $defaultResponse = {
                'answer': 'false',
                'message': '',
                'html': '',
                'css_data': {},
                'display': '',
            };
            $in.response = _Default($defaultResponse, $in.response);
            const $itemName = $in.data_back.item_name;
            $in.data_back.item_index_done[$itemName] = $in.response;
            $in.step = 'step_create';
        }

        if ($in.step === 'step_create') {
            if (_Count($in.item_index) > 0) {
                const $itemData = _Pop($in.item_index);
                const $itemName = $itemData.key;
                let $data = $itemData.data;
                $in.item_index = $itemData.object;

                const $defaultItem = {
                    'type': '',
                    'alias': '',
                    'original_alias': '',
                    // 'class': '', // Let the child handle the class
                    'css_data': {},
                };
                $data = _Merge($defaultItem, $data);

                $data.func = _GetFuncName($data.type);
                $data.config = $in.config;

                const $response = internal_Cmd($data);

                return _SubCall({
                    'to': {
                        'node': 'client',
                        'plugin': 'infohub_render',
                        'function': 'create',
                    },
                    'data': {
                        'what': $response.what,
                        'how': $response.how,
                        'where': $response.where,
                        'alias': $data.alias,
                        'css_data': $response.css_data,
                    },
                    'data_back': {
                        'item_index': $in.item_index,
                        'item_name': $itemName,
                        'item_index_done': $in.data_back.item_index_done,
                        'step': 'step_create_response',
                    },
                });
            }
            $in.step = 'step_end';
        }

        return {
            'answer': 'true',
            'message': 'Here is what I rendered',
            'item_index': $in.data_back.item_index_done,
        };
    };

    $functions.push('start_progress');
    /**
     * Start the progress bar
     *
     * @version 2023-08-10
     * @since   2023-08-10
     * @author  Peter Lembke
     */
    const start_progress = function($in = {}) {
        const $default = {
            'box_id': '',
            'max_value': 0,
            'step': 'step_start'
        };
        $in = _Merge($default, $in);

        let $messageArray = [];
        let $messageItem = {};
        let $alias = $in.box_id + '_progress_container'

        if ($in.step === 'step_start') {

            let $startTime = _MicroTime();

            $messageItem = _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_view',
                    'function': 'set_attribute',
                },
                'data': {
                    'id': $alias,
                    'name': 'start_time',
                    'value1': $startTime.toString()
                },
                'data_back': {
                    'step': 'step_void', // step_void = will not return any response. Saves execution time
                },
            });
            $messageArray.push(_ByVal($messageItem));

            $messageItem.data.name = 'max_value';
            $messageItem.data.value1 = $in.max_value.toString();
            $messageArray.push(_ByVal($messageItem));

            $messageItem.data.name = 'value';
            $messageItem.data.value1 = '0';
            $messageArray.push(_ByVal($messageItem));

            $messageItem.data.name = 'end_time';
            $messageItem.data.value1 = '0';
            $messageArray.push(_ByVal($messageItem));

            $in.step = 'step_start_timer';
        }

        if ($in.step === 'step_timer_triggered') {
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_renderprogress',
                    'function': 'update_progress',
                },
                'data': {
                    'box_id': $in.box_id
                },
                'data_back': {
                    'box_id': $in.box_id,
                    'step': 'update_progress_response',
                },
            });
        }

        if ($in.step === 'update_progress_response') {
            $in.step = 'step_end';
            if ($in.response.should_start_timer === 'true') {
                $in.step = 'step_start_timer';
            }
        }

        if ($in.step === 'step_start_timer') {
            // The timer triggers ONCE. We want it to trigger again.
            $messageItem = _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_timer',
                    'function': 'start_timer',
                },
                'data': {
                    'name': $alias,
                    'milliseconds': 1000,
                    'update': 'yes', // no, yes, lower, higher
                },
                'data_back': {
                    'box_id': $in.box_id,
                    'step': 'step_timer_triggered',
                },
            });
            $messageArray.push(_ByVal($messageItem));
        }

        return {
            'answer': 'true',
            'message': 'Asked the timer to start the update of the progress bar',
            'messages': $messageArray
        };
    };

    $functions.push('stop_progress');
    /**
     * Start the progress bar
     *
     * @version 2023-08-10
     * @since   2023-08-10
     * @author  Peter Lembke
     */
    const stop_progress = function($in = {}) {
        const $default = {
            'box_id': '',
            'step': 'step_start'
        };
        $in = _Merge($default, $in);

        let $messageArray = [];
        let $messageItem = {};

        if ($in.step === 'step_start') {

            let $name = $in.box_id;

            $messageItem = _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_timer',
                    'function': 'stop_timer',
                },
                'data': {
                    'name': $name
                },
                'data_back': {
                    'step': 'step_end',
                },
            });
            $messageArray.push($messageItem);
        }

        return {
            'answer': 'true',
            'message': 'Asked the timer to stop the update of the progress bar',
            'messages': $messageArray
        };
    };

    $functions.push('add_value');
    /**
     * Add a number to the value attribute.
     * You can also add a value to the attribute max_value
     * The progress bar will not update until the timer triggers an update
     *
     * @version 2023-08-10
     * @since   2023-08-10
     * @author  Peter Lembke
     */
    const add_value = function($in = {}) {
        const $default = {
            'box_id': '',
            'add_to_value': 0,
            'add_to_max_value': 0,
            'step': 'step_read'
        };
        $in = _Merge($default, $in);

        let $messageArray = [];
        let $messageItem = {};

        if ($in.step === 'step_read') {
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_view',
                    'function': 'get_attribute',
                },
                'data': {
                    'id': $in.box_id + '_progress_container',
                    'name_array': ['value', 'max_value', 'start_time', 'end_time']
                },
                'data_back': {
                    'box_id': $in.box_id,
                    'add_to_value': $in.add_to_value,
                    'add_to_max_value': $in.add_to_max_value,
                    'step': $in.step + '_response',
                },
            });
        }

        if ($in.step === 'step_read_response') {
            $in.step = 'step_end';
            if ($in.response.answer === 'true') {
                $in.step = 'step_add'; // ADD
            }
        }

        if ($in.step === 'step_add') {

            let $valueInt = parseInt($in.data.value) + $in.data_back.add_to_value;
            const $maxValueInt = parseInt($in.data.max_value) + $in.data_back.add_to_max_value;

            if ($valueInt >= $maxValueInt) {
                $valueInt = $maxValueInt;
            }

            $messageItem = _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_view',
                    'function': 'set_attribute',
                },
                'data': {
                    'id': $in.box_id + '_progress_container',
                    'name': 'value',
                    'value1': $valueInt.toString()
                },
                'data_back': {
                    'box_id': $in.box_id,
                    'step': 'step_void',
                },
            });
            $messageArray.push(_ByVal($messageItem));

            $messageItem.data.name = 'max_value';
            $messageItem.data.value1 = $maxValueInt.toString();
            $messageArray.push(_ByVal($messageItem));

            // Below is calling document.getElementById('120202_my_progress_bar_heart_asset-heart-animation').beginElement();

            $messageItem = _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_view',
                    'function': 'start_animation',
                },
                'data': {
                    'box_id': $in.box_id + '_heart_asset-heart-animation',
                },
                'data_back': {
                    'box_id': $in.box_id,
                    'step': 'step_void',
                },
            });
            $messageArray.push(_ByVal($messageItem));
        }

        return {
            'answer': 'true',
            'message': 'Done handling events in RenderStatus',
            'messages': $messageArray
        };
    };

    /**
     * The timer send its event to here
     * Now we need to update the progress boxes from the attribute data already set in the common container
     *
     * @version 2023-08-10
     * @since   2023-08-10
     * @author  Peter Lembke
     */
    $functions.push('update_progress');
    const update_progress = function($in = {}) {
        const $default = {
            'box_id': '',
            'step': 'step_read'
        };
        $in = _Merge($default, $in);

        let $shouldStartTimer = 'false';
        let $messageArray = [];
        let $messageItem = {};

        if ($in.step === 'step_read') {
            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_view',
                    'function': 'get_attribute',
                },
                'data': {
                    'id': $in.box_id + '_progress_container',
                    'name_array': ['value', 'max_value', 'start_time', 'end_time', 'value_of_max_text','percent_text']
                },
                'data_back': {
                    'box_id': $in.box_id,
                    'step': $in.step + '_response',
                },
            });
        }

        if ($in.step === 'step_read_response') {
            $in.step = 'step_end';
            if ($in.response.answer === 'true') {
                $in.step = 'step_update_boxes';
            }
        }

        if ($in.step === 'step_update_boxes') {

            const $valueInt = parseInt($in.data.value);
            const $maxValueInt = parseInt($in.data.max_value);
            const $startTimeFloat = parseFloat($in.data.start_time);
            let $endTimeFloat = parseFloat($in.data.end_time);

            const $valueOfMaxString = $valueInt.toString() + $in.data.value_of_max_text + $maxValueInt.toString();
            $messageItem = _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_view',
                    'function': 'set_text',
                },
                'data': {
                    'id': $in.box_id + '_value_of_max',
                    'text': $valueOfMaxString
                },
                'data_back': {
                    'step': 'step_void', // step_void = will not return any response. Saves execution time
                },
            });
            $messageArray.push(_ByVal($messageItem));

            const $percentString = _GetPercentString($valueInt, $maxValueInt, $in.data.percent_text);
            $messageItem.data.id = $in.box_id + '_percent';
            $messageItem.data.text = $percentString;
            $messageArray.push(_ByVal($messageItem));

            const $elapsedTimeString = _GetElapsedTimeString($startTimeFloat);
            $messageItem.data.id = $in.box_id + '_elapsed_time';
            $messageItem.data.text = $elapsedTimeString;
            $messageArray.push(_ByVal($messageItem));

            const $timeLeftString = _GetTimeLeftString($valueInt, $maxValueInt, $startTimeFloat, $endTimeFloat);
            $messageItem.data.id = $in.box_id + '_time_left';
            $messageItem.data.text = $timeLeftString;
            $messageArray.push(_ByVal($messageItem));

            $messageItem = _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_view',
                    'function': 'progress',
                },
                'data': {
                    'box_id': $in.box_id + '_progress_bar',
                    'value': $valueInt,
                    'max': $maxValueInt
                },
                'data_back': {
                    'step': 'step_void', // step_void = will not return any response. Saves execution time
                },
            });
            $messageArray.push(_ByVal($messageItem));

            if ($endTimeFloat === 0.0) {
                $shouldStartTimer = 'true';
            }

            if ($valueInt >= $maxValueInt) {
                $endTimeFloat = _MicroTime();
                $messageItem = _SubCall({
                    'to': {
                        'node': 'client',
                        'plugin': 'infohub_view',
                        'function': 'set_attribute',
                    },
                    'data': {
                        'id': $in.box_id + '_progress_container',
                        'name': 'end_time',
                        'value1': $endTimeFloat.toString()
                    },
                    'data_back': {
                        'box_id': $in.box_id,
                        'step': 'step_void',
                    },
                });
                $messageArray.push(_ByVal($messageItem));
            }
        }

        return {
            'answer': 'true',
            'message': 'Done handling events in RenderStatus',
            'messages': $messageArray,
            'should_start_timer': $shouldStartTimer
        };
    };

    /**
     * The actual progress component
     * Read the documentation to get the icons to show
     *
     * @version 2023-09-01
     * @since   2023-07-09
     * @author  Peter Lembke
     */
    const internal_Progress = function($in = {}) {
        const $default = {
            'max_value': 0,
            'view_progress_bar': 'true',
            'view_value_of_max': 'true',
            'view_percent': 'true',
            'view_elapsed_time': 'true',
            'view_time_left': 'true',
            'view_heart': 'true',
            'original_alias': '',
            'class': '',
            'css_data': {},
            'value_of_max_text': ' / ',
            'percent_text': ' %'
        };
        $in = _Default($default, $in);

        let $class = ['padding-center', $in.class].join(' ');
        let $cssData = {
            '.padding-center': 'display:inline-block;vertical-align:top;max-width:320px;padding:0px 6px 0px 6px;text-align:center',
        };
        $cssData = _Merge($cssData, $in.css_data);

        let $whatLookup = {
            'progress_container': {
                'type': 'common',
                'subtype': 'container',
                'original_alias': $in.original_alias,
                'class': 'container-medium',
                'tag': 'div', // span, p, div
                'data': '[left_side_container][heart_icon]',
                'custom_variables': {
                    'value': 0,
                    'max_value': $in.max_value,
                    'start_time': 0,
                    'end_time': 0,
                    'value_of_max_text': $in.value_of_max_text,
                    'percent_text': $in.percent_text
                }
            },
            'left_side_container': {
                'type': 'common',
                'subtype': 'container',
                'original_alias': $in.original_alias,
                'class': 'container-medium',
                'tag': 'span', // span, p, div
                'data': '[progress_bar][value_of_max][percent][elapsed_time][time_left]',
                'custom_variables': {
                    'value': 0,
                    'max_value': $in.max_value,
                    'start_time': 0,
                    'end_time': 0,
                    'value_of_max_text': $in.value_of_max_text,
                    'percent_text': $in.percent_text
                }
            },
            'progress_bar': {
                'type': 'common',
                'subtype': 'progress',
                'alias': 'progress_bar',
                'original_alias': $in.original_alias,
                'value': 0,
                'max': 0,
                'visible': $in.view_progress_bar
            },
            'value_of_max': {
                'type': 'common',
                'subtype': 'container',
                'alias': 'value_of_max',
                'original_alias': $in.original_alias,
                'tag': 'span', // span, p, div
                'data': '',
                'visible': $in.view_value_of_max,
                'class': $class,
                'css_data': $cssData,
            },
            'percent': {
                'type': 'common',
                'subtype': 'container',
                'alias': 'percent',
                'original_alias': $in.original_alias,
                'tag': 'span', // span, p, div
                'data': '',
                'visible': $in.view_percent,
                'class': $class,
                'css_data': $cssData,
            },
            'elapsed_time': {
                'type': 'common',
                'subtype': 'container',
                'alias': 'elapsed_time',
                'original_alias': $in.original_alias,
                'tag': 'span', // span, p, div
                'data': '',
                'visible': $in.view_elapsed_time,
                'class': $class,
                'css_data': $cssData,
            },
            'time_left': {
                'type': 'common',
                'subtype': 'container',
                'alias': 'time_left',
                'original_alias': $in.original_alias,
                'tag': 'span', // span, p, div
                'data': '',
                'visible': $in.view_time_left,
                'class': $class,
                'css_data': $cssData,
            },
            'heart_icon': {
                'type': 'common',
                'subtype': 'svg',
                'data': '[heart_asset]',
                'class': 'svg',
                'visible': $in.view_heart,
                'css_data': {
                    '.svg': 'max-width:32px; max-height:32px; padding:0px; display: inline-block;',
                },
            },
            'heart_asset': { // Read the documentation for the icon to show
                'plugin': 'infohub_asset',
                'type': 'icon',
                'asset_name': 'heart',
                'plugin_name': 'infohub_renderprogress',
            }
        };

        return {
            'answer': 'true',
            'message': 'Here are the parts to build the advanced progress bar',
            'what': $whatLookup,
            'how': {
                'mode': 'one box',
                'text': '[progress_container]',
            },
            'where': {
                'mode': 'html',
            },
            'css_data': $in.css_data,
        };
    };


    $functions.push('_GetFractionDone');
    /**
     * Calculate the fraction done so far
     * Used by event_message only
     *
     * @param $value
     * @param $maxValue
     * @returns {*}
     * @private
     */
    const _GetFractionDone = function($value = 0, $maxValue = 0) {

        let $fractionDone = 0.00001;
        if ($maxValue > 0) {
            $fractionDone = $value / $maxValue;
        }

        return $fractionDone;
    };

    $functions.push('_GetElapsedTimeString');
    /**
     * Get elapsed time in s time string
     * Used by event_message only
     *
     * @param $startTimeFloat
     * @param $endTimeFloat
     * @returns {string}
     * @private
     */
    const _GetElapsedTimeString = function($startTimeFloat = 0.0) {

        let $elapsedTimeInSeconds = _GetElapsedTimeInSeconds($startTimeFloat);
        $elapsedTimeInSeconds = _SetMaxTime($elapsedTimeInSeconds);
        const $elapsedTimeString = _GetTimeString($elapsedTimeInSeconds);

        return $elapsedTimeString;
    };

    $functions.push('_GetTimeLeftString');
    /**
     * Calculate the time left and return a time string
     * Used by event_message only
     *
     * @param $valueInt
     * @param $maxValueInt
     * @param $startTimeFloat
     * @param $endTimeFloat
     * @returns {string}
     * @private
     */
    const _GetTimeLeftString = function($valueInt = 0, $maxValueInt = 0, $startTimeFloat = 0.0, $endTimeFloat = 0.0) {

        let $timeFloat = $startTimeFloat;
        if ($endTimeFloat > 0) {
            $timeFloat = $endTimeFloat;
        }

        const $elapsedTimeInSeconds = _GetElapsedTimeInSeconds($timeFloat);
        let $fractionDone = _GetFractionDone($valueInt, $maxValueInt);
        const $expectedTotalTimeInSeconds = $elapsedTimeInSeconds / $fractionDone;
        let $timeLeftInSeconds = $expectedTotalTimeInSeconds - $elapsedTimeInSeconds;
        $timeLeftInSeconds = _SetMaxTime($timeLeftInSeconds);
        const $timeLeftString = _GetTimeString($timeLeftInSeconds);

        return $timeLeftString;
    };

    $functions.push('_GetElapsedTimeInSeconds');
    /**
     * Calculate the time left and return a time string
     * Used by event_message only
     *
     * @param $startTimeFloat
     * @returns {number}
     * @private
     */
    const _GetElapsedTimeInSeconds = function($startTimeFloat = 0.0) {

        const $elapsedTimeInSecondsFloat = _MicroTime() - $startTimeFloat;
        const $elapsedTimeInSecondsInt = Math.trunc($elapsedTimeInSecondsFloat);

        return $elapsedTimeInSecondsInt;
    };

    $functions.push('_GetTimeString');
    /**
     * Calculate the time left and return a time string
     * Used by event_message only
     *
     * @param $seconds
     * @returns {string}
     * @private
     */
    const _GetTimeString = function($seconds = 0) {

        let $date = new Date(0);
        $date.setSeconds($seconds);
        const $timeISOString = $date.toISOString();
        const $timeString = $timeISOString.substring(11,19);

        return $timeString;
    };

    $functions.push('_SetMaxTime');
    /**
     * There is a max limit how big the time can be
     * Used by event_message only
     *
     * @param $seconds
     * @returns {string}
     * @private
     */
    const _SetMaxTime = function($seconds = 0) {

        const $maxTime = 24 * 60 * 60 - 1; // 24h - 1 second
        if ($seconds > $maxTime) {
            $seconds = $maxTime;
        }

        return $seconds;
    };

    $functions.push('_GetPercentString');
    /**
     * Calculate the percent and convert to a string
     * Used by event_message only
     *
     * @param $value
     * @param $maxValue
     * @param $percentText
     * @returns {string}
     * @private
     */
    const _GetPercentString = function($value = 0, $maxValue = 0, $percentText = '%') {

        let $percent = 0;

        if ($maxValue > 0) {
            $percent = Math.trunc($value / $maxValue * 100.0);
        }

        if ($percent > 100.0) {
            $percent = 100.0;
        }

        const $percentString = $percent.toFixed(0) + $percentText;

        return $percentString;
    };
}

//# sourceURL=infohub_renderprogress.js
