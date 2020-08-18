/*
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
function infohub_welcome_youcan() {

    "use strict";

// include "infohub_base.js"

    const _Version = function() {
        return {
            'date': '2019-10-06',
            'since': '2015-02-12',
            'version': '1.0.0',
            'checksum': '{{checksum}}',
            'class_name': 'infohub_welcome_youcan',
            'note': 'The welcome demo',
            'status': 'normal',
            'SPDX-License-Identifier': 'GPL-3.0-or-later'
        };
    };

    const _GetCmdFunctions = function() {
        const $list = {
            'create': 'normal'
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
    const _GetFuncName = function($text)
    {
        let $response = '';
        const $parts = $text.split('_');

        for (let $key in $parts) {
            if ($parts.hasOwnProperty($key) === false) {
                continue;
            }
            $response = $response + $parts[$key].charAt(0).toUpperCase() + $parts[$key].substr(1);
        }

        return $response;
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

    /**
     * Get instructions and create the message to InfoHub View
     * @version 2016-10-16
     * @since   2016-10-16
     * @author  Peter Lembke
     */
    $functions.push('create');
    const create = function ($in)
    {
        const $default = {
            'subtype': 'menu',
            'parent_box_id': '',
            'translations': {},
            'step': 'step_start',
            'response': {
                'answer': 'false',
                'message': 'Nothing to report from welcome_welcome'
            }
        };
        $in = _Default($default, $in);

        if ($in.step === 'step_start') {
            $classTranslations = $in.translations;

            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_render',
                    'function': 'create'
                },
                'data': {
                    'what': {
                        'welcome_text': {
                            'type': 'text',
                            'text': "[h1][title][/h1][i][ingress][/i][columns][calendar][tree][body][story][thing][usage][planning][diary][media][contact][budget][expence][review][place][event][/columns]"
                        },
                        'title': {
                            'type': 'common',
                            'subtype': 'value',
                            'data': _Translate('You can, -with Infohub')
                        },
                        'ingress': {
                            'type': 'common',
                            'subtype': 'value',
                            'data': ''
                        },
                        'calendar': {
                            'type': 'common',
                            'subtype': 'join',
                            'title': _Translate('Calendar'),
                            'data0': '[calendar_image_data]',
                            'data1': _Translate('Write and find data in your calendar. History and future is just as important. Do not miss name days, birthdays, anniversaries, holidays, events. You can see times for the sun and moon. Links to Wikipedia for names and holidays so you can read more.')
                        },
                        'calendar_image_data': {
                            'type': 'common',
                            'subtype': 'image',
                            'data': '[calendar_image_data_asset]'
                        },
                        'calendar_image_data_asset': {
                            'plugin': 'infohub_asset',
                            'type': 'image',
                            'subtype': 'jpeg',
                            'asset_name': 'youcan/calendar',
                            'plugin_name': 'infohub_welcome'
                        },
                        'tree': {
                            'type': 'common',
                            'subtype': 'join',
                            'title': _Translate('Tree'),
                            'data0': '[tree_image_data]',
                            'data1': _Translate('With Tree you start with yourself and make bubbles on subjects around you. You could create a bubble for your cars. During your lifetime you might own more than one car and create a bubble for each car. Perhaps attach a photo and fill with any data you like. Perhaps you want a service bubble in your car to register all service you have done. When did you go to the dentist? You can create any bubble and fill the bubble with data and link to other bubbles. You can create a web with bubbles and connections - your life experiences.')
                        },
                        'tree_image_data': {
                            'type': 'common',
                            'subtype': 'image',
                            'data': '[tree_image_data_asset]'
                        },
                        'tree_image_data_asset': {
                            'plugin': 'infohub_asset',
                            'type': 'image',
                            'subtype': 'jpeg',
                            'asset_name': 'youcan/tree',
                            'plugin_name': 'infohub_welcome'
                        },
                        'body': {
                            'type': 'common',
                            'subtype': 'join',
                            'title': _Translate('Body'),
                            'data0': '[body_image_data]',
                            'data1': _Translate('You are important! You can not exist without your body. That makes also your body important! With Body you get practical tips how you can improve your health. You can track your improvements. It is the small decisions you do every day that make a difference in your life.')
                        },
                        'body_image_data': {
                            'type': 'common',
                            'subtype': 'image',
                            'data': '[body_image_data_asset]'
                        },
                        'body_image_data_asset': {
                            'plugin': 'infohub_asset',
                            'type': 'image',
                            'subtype': 'jpeg',
                            'asset_name': 'youcan/body',
                            'plugin_name': 'infohub_welcome'
                        },
                        'story': {
                            'type': 'common',
                            'subtype': 'join',
                            'title': _Translate('Story editor'),
                            'data0': '[story_image_data]',
                            'data1': _Translate('Put together an article with text, images, image texts, links, titles, ingress, bullet lists, code examples. You can then export your story and use it outside of InfoHub or store it in your Tree.')
                        },
                        'story_image_data': {
                            'type': 'common',
                            'subtype': 'image',
                            'data': '[story_image_data_asset]'
                        },
                        'story_image_data_asset': {
                            'plugin': 'infohub_asset',
                            'type': 'image',
                            'subtype': 'jpeg',
                            'asset_name': 'youcan/story',
                            'plugin_name': 'infohub_welcome'
                        },
                        'thing': {
                            'type': 'common',
                            'subtype': 'join',
                            'title': _Translate('Things'),
                            'data0': '[things_image_data]',
                            'data1': _Translate('Register your larger things: What it is, when and where you bought it, the serial number, warranty and so on.'),
                            'data2': _Translate('Register you cars here and all service you have done to the cars. Or your sneekers collection.')
                        },
                        'things_image_data': {
                            'type': 'common',
                            'subtype': 'image',
                            'data': '[things_image_data_asset]'
                        },
                        'things_image_data_asset': {
                            'plugin': 'infohub_asset',
                            'type': 'image',
                            'subtype': 'jpeg',
                            'asset_name': 'youcan/things',
                            'plugin_name': 'infohub_welcome'
                        },
                        'usage': {
                            'type': 'common',
                            'subtype': 'join',
                            'title': _Translate('Usage'),
                            'data0': '[usage_image_data]',
                            'data1': _Translate('Here you can register when you use one of your registered things. It could for example be one of your sneekers while training.')
                        },
                        'usage_image_data': {
                            'type': 'common',
                            'subtype': 'image',
                            'data': '[usage_image_data_asset]'
                        },
                        'usage_image_data_asset': {
                            'plugin': 'infohub_asset',
                            'type': 'image',
                            'subtype': 'jpeg',
                            'asset_name': 'youcan/usage',
                            'plugin_name': 'infohub_welcome'
                        },
                        'planning': {
                            'type': 'common',
                            'subtype': 'join',
                            'title': _Translate('Planning'),
                            'data0': '[planning_image_data]',
                            'data1': _Translate('Your projects. You can set up tasks in projects here. Date when things must be done and when they were done.')
                        },
                        'planning_image_data': {
                            'type': 'common',
                            'subtype': 'image',
                            'data': '[planning_image_data_asset]'
                        },
                        'planning_image_data_asset': {
                            'plugin': 'infohub_asset',
                            'type': 'image',
                            'subtype': 'jpeg',
                            'asset_name': 'youcan/planning',
                            'plugin_name': 'infohub_welcome'
                        },
                        'diary': {
                            'type': 'common',
                            'subtype': 'join',
                            'title': _Translate('Diary'),
                            'data0': '[diary_image_data]',
                            'data1': _Translate('How was your day. Write the text version of your day and use links to your data.')
                        },
                        'diary_image_data': {
                            'type': 'common',
                            'subtype': 'image',
                            'data': '[diary_image_data_asset]'
                        },
                        'diary_image_data_asset': {
                            'plugin': 'infohub_asset',
                            'type': 'image',
                            'subtype': 'jpeg',
                            'asset_name': 'youcan/diary',
                            'plugin_name': 'infohub_welcome'
                        },
                        'media': {
                            'type': 'common',
                            'subtype': 'join',
                            'title': _Translate('Media'),
                            'data0': '[media_image_data]',
                            'data1': _Translate('Media is images/video/audio - Your catalog with media and its meta data.'),
                            'data2': _Translate('You can see small versions of your images and mark the persons faces and connect them to contacts, places, travels, dates.')
                        },
                        'media_image_data': {
                            'type': 'common',
                            'subtype': 'image',
                            'data': '[media_image_data_asset]'
                        },
                        'media_image_data_asset': {
                            'plugin': 'infohub_asset',
                            'type': 'image',
                            'subtype': 'jpeg',
                            'asset_name': 'youcan/media',
                            'plugin_name': 'infohub_welcome'
                        },
                        'contact': {
                            'type': 'common',
                            'subtype': 'join',
                            'title': _Translate('Contact'),
                            'data0': '[contact_image_data]',
                            'data1': _Translate('The contact information to your friends. Telephone number, email, Skype, Address, birthday, shoe size or whatever you like to register about your contacts.')
                        },
                        'contact_image_data': {
                            'type': 'common',
                            'subtype': 'image',
                            'data': '[contact_image_data_asset]'
                        },
                        'contact_image_data_asset': {
                            'plugin': 'infohub_asset',
                            'type': 'image',
                            'subtype': 'jpeg',
                            'asset_name': 'youcan/contact',
                            'plugin_name': 'infohub_welcome'
                        },
                        'budget': {
                            'type': 'common',
                            'subtype': 'join',
                            'title': _Translate('Budget'),
                            'data0': '[budget_image_data]',
                            'data1': _Translate('Calculate your income and expected expenses in this plugin. You can then see what is reasonable to invest in.')
                        },
                        'budget_image_data': {
                            'type': 'common',
                            'subtype': 'image',
                            'data': '[budget_image_data_asset]'
                        },
                        'budget_image_data_asset': {
                            'plugin': 'infohub_asset',
                            'type': 'image',
                            'subtype': 'jpeg',
                            'asset_name': 'youcan/budget',
                            'plugin_name': 'infohub_welcome'
                        },
                        'expence': {
                            'type': 'common',
                            'subtype': 'join',
                            'title': _Translate('Expense'),
                            'data0': '[expence_image_data]',
                            'data1': _Translate('Register your purchases to keep track where the money goes. Put expences in groups so you see how much your car cost, your hobby, food etc.'),
                            'data2': _Translate('Perhaps you can cut costs without cutting down on comfort. You need a clear picture of your expences to take the right decisions.')
                        },
                        'expence_image_data': {
                            'type': 'common',
                            'subtype': 'image',
                            'data': '[expence_image_data_asset]'
                        },
                        'expence_image_data_asset': {
                            'plugin': 'infohub_asset',
                            'type': 'image',
                            'subtype': 'jpeg',
                            'asset_name': 'youcan/expence',
                            'plugin_name': 'infohub_welcome'
                        },
                        'review': {
                            'type': 'common',
                            'subtype': 'join',
                            'title': _Translate('Review'),
                            'data0': '[review_image_data]',
                            'data1': _Translate('Write your reviews of films, books, records, TV series, games, subscriptions, magazines. Then you can see what movies you have seen and when you saw them.')
                        },
                        'review_image_data': {
                            'type': 'common',
                            'subtype': 'image',
                            'data': '[review_image_data_asset]'
                        },
                        'review_image_data_asset': {
                            'plugin': 'infohub_asset',
                            'type': 'image',
                            'subtype': 'jpeg',
                            'asset_name': 'youcan/review',
                            'plugin_name': 'infohub_welcome'
                        },
                        'place': {
                            'type': 'common',
                            'subtype': 'join',
                            'title': _Translate('Place'),
                            'data0': '[place_image_data]',
                            'data1': _Translate('You can register places you have visited and get a map with dots. You can also link a place to a story, image, training and so on.')
                        },
                        'place_image_data': {
                            'type': 'common',
                            'subtype': 'image',
                            'data': '[place_image_data_asset]'
                        },
                        'place_image_data_asset': {
                            'plugin': 'infohub_asset',
                            'type': 'image',
                            'subtype': 'jpeg',
                            'asset_name': 'youcan/place',
                            'plugin_name': 'infohub_welcome'
                        },
                        'event': {
                            'type': 'common',
                            'subtype': 'join',
                            'title': _Translate('Event'),
                            'data0': '[event_image_data]',
                            'data1': _Translate('Register events you want to participate in or have participated in. You can link a place, a review etc.')
                        },
                        'event_image_data': {
                            'type': 'common',
                            'subtype': 'image',
                            'data': '[event_image_data_asset]'
                        },
                        'event_image_data_asset': {
                            'plugin': 'infohub_asset',
                            'type': 'image',
                            'subtype': 'jpeg',
                            'asset_name': 'youcan/event',
                            'plugin_name': 'infohub_welcome'
                        }
                    },
                    'how': {
                        'mode': 'one box',
                        'text': '[welcome_text]'
                    },
                    'where': {
                        'box_id': $in.parent_box_id + '.form',
                        'max_width': 100,
                        'scroll_to_box_id': 'true'
                    }
                    // 'cache_key': 'youcan' // With all images this is too much to cache
                },
                'data_back': {
                    'step': 'step_end'
                }
            });
        }

        return {
            'answer': $in.response.answer,
            'message': $in.response.message
        };
    };
}
//# sourceURL=infohub_welcome_youcan.js