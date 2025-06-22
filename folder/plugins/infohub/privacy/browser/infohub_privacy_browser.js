/**
 * infohub_privacy_browser
 * Browser tests to show you what information you reveal
 *
 * @package     Infohub
 * @subpackage  infohub_privacy_browser
 * @since       2020-05-01
 * @author      Peter Lembke <info@infohub.se>
 * @license     GPL-3.0-or-later
 * @copyright   Copyright (C) 2010- Peter Lembke
 * @see         https://github.com/peterlembke/infohub/blob/main/folder/plugins/infohub/privacy/browser/infohub_privacy_browser.md Documentation
 * @link        https://infohub.se/ InfoHub main page
 */
function infohub_privacy_browser() {

    'use strict';

// include "infohub_base.js"

    const _Version = function() {
        return {
            'date': '2020-05-02',
            'since': '2020-05-01',
            'version': '1.0.0',
            'checksum': '{{checksum}}',
            'class_name': 'infohub_privacy_browser',
            'note': 'Browser tests to show you what information you reveal',
            'status': 'normal',
            'SPDX-License-Identifier': 'GPL-3.0-or-later',
        };
    };

    const _GetCmdFunctions = function() {
        return {
            'create': 'normal',
            'click_geolocation': 'normal',
            'click_deviceorientation': 'normal',
            'click_devicemotion': 'normal',
            'click_battery': 'normal',
            'click_devicelight': 'normal',
            'click_deviceproximity': 'normal',
            'click_navigator': 'normal',
        };
    };

    let $classTranslations = {};

    // ***********************************************************
    // * your class functions below, only declare with var
    // * Can only be reached through cmd()
    // ***********************************************************

    $functions.push('create');
    /**
     * Get instructions and create the message to InfoHub View
     * @version 2016-10-16
     * @since   2016-10-16
     * @author  Peter Lembke
     */
    const create = function($in = {}) {
        const $default = {
            'subtype': 'menu',
            'parent_box_id': '',
            'translations': {},
            'step': 'step_start',
            'response': {
                'answer': 'false',
                'message': 'Nothing to report from privacy_browser',
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
                        'my_form': {
                            'plugin': 'infohub_renderform',
                            'type': 'form',
                            'content': '[button_geolocation][button_deviceorientation]' +
                                '[button_devicemotion][button_battery][button_devicelight]' +
                                '[button_deviceproximity][button_navigator][textbox_navigator_output]',
                            'label': _Translate('Browser tests'),
                            'description': _Translate(
                                'Run a test to see what you reveal'),
                        },
                        'button_geolocation': {
                            'plugin': 'infohub_renderform',
                            'type': 'button',
                            'mode': 'button',
                            'button_label': _Translate('Geo Location'),
                            'event_data': 'browser|geolocation',
                            'to_plugin': 'infohub_privacy',
                            'to_function': 'click',
                            'show_error_text': 'true',
                            'show_success_text': 'true',
                        },
                        'button_deviceorientation': {
                            'plugin': 'infohub_renderform',
                            'type': 'button',
                            'mode': 'button',
                            'button_label': _Translate('Device orientation'),
                            'event_data': 'browser|deviceorientation',
                            'to_plugin': 'infohub_privacy',
                            'to_function': 'click',
                            'show_error_text': 'true',
                            'show_success_text': 'true',
                        },
                        'button_devicemotion': {
                            'plugin': 'infohub_renderform',
                            'type': 'button',
                            'mode': 'button',
                            'button_label': _Translate('Device motion'),
                            'event_data': 'browser|devicemotion',
                            'to_plugin': 'infohub_privacy',
                            'to_function': 'click',
                            'show_error_text': 'true',
                            'show_success_text': 'true',
                        },
                        'button_battery': {
                            'plugin': 'infohub_renderform',
                            'type': 'button',
                            'mode': 'button',
                            'button_label': _Translate('Device battery'),
                            'event_data': 'browser|battery',
                            'to_plugin': 'infohub_privacy',
                            'to_function': 'click',
                            'show_error_text': 'true',
                            'show_success_text': 'true',
                        },
                        'button_devicelight': {
                            'plugin': 'infohub_renderform',
                            'type': 'button',
                            'mode': 'button',
                            'button_label': _Translate('Device light'),
                            'event_data': 'browser|devicelight',
                            'to_plugin': 'infohub_privacy',
                            'to_function': 'click',
                            'show_error_text': 'true',
                            'show_success_text': 'true',
                        },
                        'button_deviceproximity': {
                            'plugin': 'infohub_renderform',
                            'type': 'button',
                            'mode': 'button',
                            'button_label': _Translate('Device proximity'),
                            'event_data': 'browser|deviceproximity',
                            'to_plugin': 'infohub_privacy',
                            'to_function': 'click',
                            'show_error_text': 'true',
                            'show_success_text': 'true',
                        },
                        'button_navigator': {
                            'plugin': 'infohub_renderform',
                            'type': 'button',
                            'mode': 'button',
                            'button_label': _Translate('Navigator'),
                            'event_data': 'browser|navigator',
                            'to_plugin': 'infohub_privacy',
                            'to_function': 'click',
                            'show_error_text': 'true',
                            'show_success_text': 'false',
                        },
                        'textbox_navigator_output': {
                            'type': 'common',
                            'subtype': 'container',
                        },
                    },
                    'how': {
                        'mode': 'one box',
                        'text': '[my_form]',
                    },
                    'where': {
                        'box_id': $in.parent_box_id + '.tools',
                        'max_width': 100,
                        'scroll_to_box_id': 'true',
                    },
                },
                'data_back': {'step': 'step_end'},
            });
        }

        return {
            'answer': $in.response.answer,
            'message': $in.response.message,
        };

    };

    $functions.push('click_geolocation');
    /**
     * Can we see where you are?
     * @version 2020-05-02
     * @since   2020-05-02
     * @author  Peter Lembke
     * @param $in
     * @returns {{answer: *, message: *, ok: *}}
     */
    const click_geolocation = function($in = {}) {
        const $default = {
            'step': 'step_start',
            'callback_function': null,
        };
        $in = _Default($default, $in);

        if ($in.step === 'step_start') {
            if (_IsSet(navigator.geolocation) === 'false') {
                return {
                    'answer': 'true',
                    'message': 'Geo location not supported. That is good.',
                    'ok': 'true',
                };
            }

            let options = {
                enableHighAccuracy: true,
                timeout: 5000,
                maximumAge: 0,
            };

            const success = function($position) {
                const $cordinates = $position.coords;

                let $message = _Translate('Your current position is') + ': ' +
                    ' Lat: ' + $cordinates.latitude +
                    ', Long: ' + $cordinates.longitude +
                    ', Accuracy: ' + $cordinates.accuracy + ' meters';

                $in.callback_function({
                    'answer': 'false',
                    'message': $message,
                    'ok': 'false',
                });
                return {};
            };

            const error = function($error) {

                const PERMISSION_DENIED = 1;

                if ($error.code === PERMISSION_DENIED) {
                    $in.callback_function({
                        'answer': 'true',
                        'message': 'You have Geo Location but have prevented that in the browser. Good. ' +
                            $error.message,
                        'ok': 'true',
                    });
                    return {};
                }

                $in.callback_function({
                    'answer': 'false',
                    'message': 'You have allowed geo location. Just luck that the position could not be determined. ' +
                        $error.message,
                    'ok': 'false',
                });
            };

            navigator.geolocation.getCurrentPosition(success, error, options);
        }

        return {};
    };

    $functions.push('click_deviceorientation');
    /**
     * Can we detect how you hold your device?
     * @version 2020-05-02
     * @since   2020-05-02
     * @author  Peter Lembke
     * @param $in
     * @returns {{answer: *, message: *, ok: *}}
     */
    const click_deviceorientation = function($in = {}) {
        const $default = {
            'step': 'step_start',
        };
        $in = _Default($default, $in);

        if ($in.step === 'step_start') {

            if (_IsSet(window.DeviceOrientationEvent) === 'false') {
                return {
                    'answer': 'true',
                    'message': 'Device orientation not supported. That is good.',
                    'ok': 'true',
                };
            }

            alert('Rotate your device');

            window.addEventListener('deviceorientation', function($eventData) {
                // gamma is the left-to-right tilt in degrees
                // console.log($eventData.gamma);

                // beta is the front-to-back tilt in degrees
                // console.log($eventData.beta);

                // alpha is the compass direction the device is facing in degrees
                // console.log($eventData.alpha);

                let $message = 'Left to right: ' + $eventData.gamma +
                    ', Front to back: ' + $eventData.beta +
                    ', Compass: ' + $eventData.alpha;

                $in.callback_function({
                    'answer': 'false',
                    'message': 'You have allowed device orientation. ' +
                        $message,
                    'ok': 'false',
                });
            }, false);
        }

        return {};
    };

    $functions.push('click_devicemotion');
    /**
     * Can we detect how you move your device?
     * @version 2020-05-02
     * @since   2020-05-02
     * @author  Peter Lembke
        * @param $in
     * @returns {{answer: *, message: *, ok: *}}
     */
    const click_devicemotion = function($in = {}) {
        const $default = {
            'step': 'step_start',
        };
        $in = _Default($default, $in);

        if ($in.step === 'step_start') {
            if (_IsSet(window.DeviceMotionEvent) === 'false') {
                return {
                    'answer': 'true',
                    'message': 'Device orientation not supported. That is good.',
                    'ok': 'true',
                };
            }

            alert('Move your device');

            window.addEventListener('devicemotion', function($eventData) {

                const $x = $eventData.accelerationIncludingGravity.x;
                const $y = $eventData.accelerationIncludingGravity.y;
                const $z = $eventData.accelerationIncludingGravity.z;

                let $message = 'x: ' + $x + ', y: ' + $y + ', z: ' + $z;

                $in.callback_function({
                    'answer': 'false',
                    'message': 'You have allowed device motion. ' + $message,
                    'ok': 'false',
                });
            }, false);
        }

        return {};
    };

    $functions.push('click_battery');
    /**
     * Can we detect if you have a battery and if it is connected to an outlet?
     * @version 2020-05-02
     * @since   2020-05-02
     * @author  Peter Lembke
     * @param $in
     * @returns {{answer: *, message: *, ok: *}}
     */
    const click_battery = function($in = {}) {
        const $default = {
            'step': 'step_start',
        };
        $in = _Default($default, $in);

        if ($in.step === 'step_start') {

            const $logBattery = function($battery) {
                return {
                    'answer': 'false',
                    'message': 'Battery indication enabled. ' + $battery.level,
                    'ok': 'false',
                };
            };

            if (navigator.getBattery) {
                navigator.getBattery().then($logBattery);
                return {};
            }

            const $battery = navigator.battery || navigator.webkitBattery ||
                navigator.mozBattery;

            if ($battery) {
                $logBattery($battery);
                return {};
            }

            return {
                'answer': 'true',
                'message': 'Battery indication not supported. That is good.',
                'ok': 'true',
            };
        }

        return {
            'answer': $in.response.answer,
            'message': $in.response.message,
            'ok': $in.response.answer,
        };
    };

    $functions.push('click_devicelight');
    /**
     * Can we detect if you have your phone in a bag/pocket or if you are indoors or outdoors?
     * @version 2020-05-02
     * @since   2020-05-02
     * @author  Peter Lembke
     * @param $in
     * @returns {{answer: *, message: *, ok: *}}
     */
    const click_devicelight = function($in = {}) {
        const $default = {
            'step': 'step_start',
        };
        $in = _Default($default, $in);

        if ($in.step === 'step_start') {
            alert('click_devicelight');

            if (_IsSet(window.ondevicelight) === 'false') {
                return {
                    'answer': 'true',
                    'message': 'Device light not supported. That is good.',
                    'ok': 'true',
                };
            }

            window.addEventListener('devicelight', function($event) {
                //light level is returned in lux units
                return {
                    'answer': 'false',
                    'message': 'Light level in Lux: ' + $event.value,
                    'ok': 'false',
                };
            });
        }

        return {};
    };

    $functions.push('click_deviceproximity');
    /**
     * Can we detect if you have your face in front of the phone?
     * @version 2020-05-02
     * @since   2020-05-02
     * @author  Peter Lembke
     * @param $in
     * @returns {{answer: *, message: *, ok: *}}
     */
    const click_deviceproximity = function($in = {}) {
        const $default = {
            'step': 'step_start',
        };
        $in = _Default($default, $in);

        if ($in.step === 'step_start') {
            alert('click_deviceproximity');

            if (_IsSet(window.ondeviceproximity) === 'false') {
                return {
                    'answer': 'true',
                    'message': 'Device proximity not supported. That is good.',
                    'ok': 'true',
                };
            }

            window.addEventListener('deviceproximity', function($event) {
                return {
                    'answer': 'false',
                    'message': 'You close to the device in centimeters: ' +
                        $event.value,
                    'ok': 'false',
                };
            });
        }

        return {};
    };

    $functions.push('click_navigator');
    /**
     * Can we determine the device type, operating system and other data?
     * @version 2020-05-02
     * @since   2020-05-02
     * @author  Peter Lembke
     * @param $in
     * @returns {{answer: *, message: *, ok: *}}
     */
    const click_navigator = function($in = {}) {
        const $default = {
            'box_id': '',
            'step': 'step_set_text',
            'answer': '',
            'message': '',
        };
        $in = _Default($default, $in);

        let $answer = 'false';
        let $message = '';

        if ($in.step === 'step_set_text') {
            let $messageArray = [];
            $messageArray.push('This is what you reveal abut your device and operating system etc.');
            $messageArray.push('Browser CodeName: ' + navigator.appCodeName);
            $messageArray.push('Browser Name: ' + navigator.appName);
            $messageArray.push('Browser Version: ' + navigator.appVersion);
            $messageArray.push('Cookies Enabled: ' + navigator.cookieEnabled);
            $messageArray.push('Browser Language: ' + navigator.language);
            $messageArray.push('Browser Online: ' + navigator.onLine);
            $messageArray.push('Platform: ' + navigator.platform);
            $messageArray.push('User-agent header: ' + navigator.userAgent);

            $message = '<p>' + $messageArray.join('</p><p>') + '</p>';

            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_view',
                    'function': 'set_text',
                },
                'data': {
                    'id': $in.box_id + '.[textbox_navigator_output]',
                    'text': $message,
                },
                'data_back': {
                    'step': 'step_set_text_response',
                },
            });
        }

        if ($in.step === 'step_set_text_response') {
            $in.message = 'You could turn off cookies for Infohub sites.';

            if (navigator.cookieEnabled === false) {
                $answer = 'true';
                $in.message = 'Cookes disabled for this site. Good';
            }
        }

        return {
            'answer': $answer,
            'message': $in.message,
            'ok': $answer,
        };
    };
}

//# sourceURL=infohub_privacy_browser.js