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
function infohub_welcome_youcan() {

    'use strict';

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
            'SPDX-License-Identifier': 'GPL-3.0-or-later',
            'web_worker': 'true',
            'core_plugin': 'false',
        };
    };

    const _GetCmdFunctions = function() {
        const $list = {
            'create': 'normal',
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

    /**
     * Get instructions and create the message to InfoHub View
     * @version 2016-10-16
     * @since   2016-10-16
     * @author  Peter Lembke
     */
    $functions.push('create');
    const create = function($in) {
        const $default = {
            'subtype': 'menu',
            'parent_box_id': '',
            'translations': {},
            'step': 'step_start',
            'response': {
                'answer': 'false',
                'message': 'Nothing to report from welcome_welcome',
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
                        'welcome_text': {
                            'type': 'text',
                            'text': '[h1][title][/h1][i][ingress][/i][columns][calendar][tree][body][story][thing][usage][planning][diary][media][contact][budget][expence][review][place][event][/columns]',
                        },
                        'title': {
                            'type': 'common',
                            'subtype': 'value',
                            'data': _Translate('YOU_CAN,_-WITH_INFOHUB')
                        },
                        'ingress': {
                            'type': 'common',
                            'subtype': 'value',
                            'data': '',
                        },
                        'calendar': {
                            'type': 'common',
                            'subtype': 'join',
                            'title': _Translate('CALENDAR'),
                            'data0': '[calendar_image_data]',
                            'data1': _Translate('WRITE_AND_FIND_DATA_IN_YOUR_CALENDAR._HISTORY_AND_FUTURE_IS_JUST_AS_IMPORTANT._DO_NOT_MISS_NAME_DAYS,_BIRTHDAYS,_ANNIVERSARIES,_HOLIDAYS,_EVENTS._YOU_CAN_SEE_TIMES_FOR_THE_SUN_AND_MOON._LINKS_TO_WIKIPEDIA_FOR_NAMES_AND_HOLIDAYS_SO_YOU_CAN_READ_MORE.')
                        },
                        'calendar_image_data': {
                            'type': 'common',
                            'subtype': 'image',
                            'data': '[calendar_image_data_asset]',
                        },
                        'calendar_image_data_asset': {
                            'plugin': 'infohub_asset',
                            'type': 'image',
                            'subtype': 'jpeg',
                            'asset_name': 'youcan/calendar',
                            'plugin_name': 'infohub_welcome',
                        },
                        'tree': {
                            'type': 'common',
                            'subtype': 'join',
                            'title': _Translate('TREE'),
                            'data0': '[tree_image_data]',
                            'data1': _Translate('WITH_TREE_YOU_START_WITH_YOURSELF_AND_MAKE_BUBBLES_ON_SUBJECTS_AROUND_YOU._YOU_COULD_CREATE_A_BUBBLE_FOR_YOUR_CARS._DURING_YOUR_LIFETIME_YOU_MIGHT_OWN_MORE_THAN_ONE_CAR_AND_CREATE_A_BUBBLE_FOR_EACH_CAR._PERHAPS_ATTACH_A_PHOTO_AND_FILL_WITH_ANY_DATA_YOU_LIKE._PERHAPS_YOU_WANT_A_SERVICE_BUBBLE_IN_YOUR_CAR_TO_REGISTER_ALL_SERVICE_YOU_HAVE_DONE._WHEN_DID_YOU_GO_TO_THE_DENTIST?_YOU_CAN_CREATE_ANY_BUBBLE_AND_FILL_THE_BUBBLE_WITH_DATA_AND_LINK_TO_OTHER_BUBBLES._YOU_CAN_CREATE_A_WEB_WITH_BUBBLES_AND_CONNECTIONS_-_YOUR_LIFE_EXPERIENCES.')
                        },
                        'tree_image_data': {
                            'type': 'common',
                            'subtype': 'image',
                            'data': '[tree_image_data_asset]',
                        },
                        'tree_image_data_asset': {
                            'plugin': 'infohub_asset',
                            'type': 'image',
                            'subtype': 'jpeg',
                            'asset_name': 'youcan/tree',
                            'plugin_name': 'infohub_welcome',
                        },
                        'body': {
                            'type': 'common',
                            'subtype': 'join',
                            'title': _Translate('BODY'),
                            'data0': '[body_image_data]',
                            'data1': _Translate('YOU_ARE_IMPORTANT!_YOU_CAN_NOT_EXIST_WITHOUT_YOUR_BODY._THAT_MAKES_ALSO_YOUR_BODY_IMPORTANT!_WITH_BODY_YOU_GET_PRACTICAL_TIPS_HOW_YOU_CAN_IMPROVE_YOUR_HEALTH._YOU_CAN_TRACK_YOUR_IMPROVEMENTS._IT_IS_THE_SMALL_DECISIONS_YOU_DO_EVERY_DAY_THAT_MAKE_A_DIFFERENCE_IN_YOUR_LIFE.')
                        },
                        'body_image_data': {
                            'type': 'common',
                            'subtype': 'image',
                            'data': '[body_image_data_asset]',
                        },
                        'body_image_data_asset': {
                            'plugin': 'infohub_asset',
                            'type': 'image',
                            'subtype': 'jpeg',
                            'asset_name': 'youcan/body',
                            'plugin_name': 'infohub_welcome',
                        },
                        'story': {
                            'type': 'common',
                            'subtype': 'join',
                            'title': _Translate('STORY_EDITOR'),
                            'data0': '[story_image_data]',
                            'data1': _Translate('PUT_TOGETHER_AN_ARTICLE_WITH_TEXT,_IMAGES,_IMAGE_TEXTS,_LINKS,_TITLES,_INGRESS,_BULLET_LISTS,_CODE_EXAMPLES._YOU_CAN_THEN_EXPORT_YOUR_STORY_AND_USE_IT_OUTSIDE_OF_INFOHUB_OR_STORE_IT_IN_YOUR_TREE.')
                        },
                        'story_image_data': {
                            'type': 'common',
                            'subtype': 'image',
                            'data': '[story_image_data_asset]',
                        },
                        'story_image_data_asset': {
                            'plugin': 'infohub_asset',
                            'type': 'image',
                            'subtype': 'jpeg',
                            'asset_name': 'youcan/story',
                            'plugin_name': 'infohub_welcome',
                        },
                        'thing': {
                            'type': 'common',
                            'subtype': 'join',
                            'title': _Translate('THINGS'),
                            'data0': '[things_image_data]',
                            'data1': _Translate('REGISTER_YOUR_LARGER_THINGS:_WHAT_IT_IS,_WHEN_AND_WHERE_YOU_BOUGHT_IT,_THE_SERIAL_NUMBER,_WARRANTY_AND_SO_ON.'),
                            'data2': _Translate('REGISTER_YOU_CARS_HERE_AND_ALL_SERVICE_YOU_HAVE_DONE_TO_THE_CARS._OR_YOUR_SNEEKERS_COLLECTION.')
                        },
                        'things_image_data': {
                            'type': 'common',
                            'subtype': 'image',
                            'data': '[things_image_data_asset]',
                        },
                        'things_image_data_asset': {
                            'plugin': 'infohub_asset',
                            'type': 'image',
                            'subtype': 'jpeg',
                            'asset_name': 'youcan/things',
                            'plugin_name': 'infohub_welcome',
                        },
                        'usage': {
                            'type': 'common',
                            'subtype': 'join',
                            'title': _Translate('USAGE'),
                            'data0': '[usage_image_data]',
                            'data1': _Translate('HERE_YOU_CAN_REGISTER_WHEN_YOU_USE_ONE_OF_YOUR_REGISTERED_THINGS._IT_COULD_FOR_EXAMPLE_BE_ONE_OF_YOUR_SNEEKERS_WHILE_TRAINING.')
                        },
                        'usage_image_data': {
                            'type': 'common',
                            'subtype': 'image',
                            'data': '[usage_image_data_asset]',
                        },
                        'usage_image_data_asset': {
                            'plugin': 'infohub_asset',
                            'type': 'image',
                            'subtype': 'jpeg',
                            'asset_name': 'youcan/usage',
                            'plugin_name': 'infohub_welcome',
                        },
                        'planning': {
                            'type': 'common',
                            'subtype': 'join',
                            'title': _Translate('PLANNING'),
                            'data0': '[planning_image_data]',
                            'data1': _Translate('YOUR_PROJECTS._YOU_CAN_SET_UP_TASKS_IN_PROJECTS_HERE._DATE_WHEN_THINGS_MUST_BE_DONE_AND_WHEN_THEY_WERE_DONE.')
                        },
                        'planning_image_data': {
                            'type': 'common',
                            'subtype': 'image',
                            'data': '[planning_image_data_asset]',
                        },
                        'planning_image_data_asset': {
                            'plugin': 'infohub_asset',
                            'type': 'image',
                            'subtype': 'jpeg',
                            'asset_name': 'youcan/planning',
                            'plugin_name': 'infohub_welcome',
                        },
                        'diary': {
                            'type': 'common',
                            'subtype': 'join',
                            'title': _Translate('DIARY'),
                            'data0': '[diary_image_data]',
                            'data1': _Translate('HOW_WAS_YOUR_DAY._WRITE_THE_TEXT_VERSION_OF_YOUR_DAY_AND_USE_LINKS_TO_YOUR_DATA.')
                        },
                        'diary_image_data': {
                            'type': 'common',
                            'subtype': 'image',
                            'data': '[diary_image_data_asset]',
                        },
                        'diary_image_data_asset': {
                            'plugin': 'infohub_asset',
                            'type': 'image',
                            'subtype': 'jpeg',
                            'asset_name': 'youcan/diary',
                            'plugin_name': 'infohub_welcome',
                        },
                        'media': {
                            'type': 'common',
                            'subtype': 'join',
                            'title': _Translate('MEDIA'),
                            'data0': '[media_image_data]',
                            'data1': _Translate('MEDIA_IS_IMAGES/VIDEO/AUDIO_-_YOUR_CATALOG_WITH_MEDIA_AND_ITS_META_DATA.'),
                            'data2': _Translate('YOU_CAN_SEE_SMALL_VERSIONS_OF_YOUR_IMAGES_AND_MARK_THE_PERSONS_FACES_AND_CONNECT_THEM_TO_CONTACTS,_PLACES,_TRAVELS,_DATES.')
                        },
                        'media_image_data': {
                            'type': 'common',
                            'subtype': 'image',
                            'data': '[media_image_data_asset]',
                        },
                        'media_image_data_asset': {
                            'plugin': 'infohub_asset',
                            'type': 'image',
                            'subtype': 'jpeg',
                            'asset_name': 'youcan/media',
                            'plugin_name': 'infohub_welcome',
                        },
                        'contact': {
                            'type': 'common',
                            'subtype': 'join',
                            'title': _Translate('CONTACT'),
                            'data0': '[contact_image_data]',
                            'data1': _Translate('THE_CONTACT_INFORMATION_TO_YOUR_FRIENDS._TELEPHONE_NUMBER,_EMAIL,_SKYPE,_ADDRESS,_BIRTHDAY,_SHOE_SIZE_OR_WHATEVER_YOU_LIKE_TO_REGISTER_ABOUT_YOUR_CONTACTS.')
                        },
                        'contact_image_data': {
                            'type': 'common',
                            'subtype': 'image',
                            'data': '[contact_image_data_asset]',
                        },
                        'contact_image_data_asset': {
                            'plugin': 'infohub_asset',
                            'type': 'image',
                            'subtype': 'jpeg',
                            'asset_name': 'youcan/contact',
                            'plugin_name': 'infohub_welcome',
                        },
                        'budget': {
                            'type': 'common',
                            'subtype': 'join',
                            'title': _Translate('BUDGET'),
                            'data0': '[budget_image_data]',
                            'data1': _Translate('CALCULATE_YOUR_INCOME_AND_EXPECTED_EXPENSES_IN_THIS_PLUGIN._YOU_CAN_THEN_SEE_WHAT_IS_REASONABLE_TO_INVEST_IN.')
                        },
                        'budget_image_data': {
                            'type': 'common',
                            'subtype': 'image',
                            'data': '[budget_image_data_asset]',
                        },
                        'budget_image_data_asset': {
                            'plugin': 'infohub_asset',
                            'type': 'image',
                            'subtype': 'jpeg',
                            'asset_name': 'youcan/budget',
                            'plugin_name': 'infohub_welcome',
                        },
                        'expence': {
                            'type': 'common',
                            'subtype': 'join',
                            'title': _Translate('EXPENSE'),
                            'data0': '[expence_image_data]',
                            'data1': _Translate('REGISTER_YOUR_PURCHASES_TO_KEEP_TRACK_WHERE_THE_MONEY_GOES._PUT_EXPENCES_IN_GROUPS_SO_YOU_SEE_HOW_MUCH_YOUR_CAR_COST,_YOUR_HOBBY,_FOOD_ETC.'),
                            'data2': _Translate('PERHAPS_YOU_CAN_CUT_COSTS_WITHOUT_CUTTING_DOWN_ON_COMFORT._YOU_NEED_A_CLEAR_PICTURE_OF_YOUR_EXPENCES_TO_TAKE_THE_RIGHT_DECISIONS.')
                        },
                        'expence_image_data': {
                            'type': 'common',
                            'subtype': 'image',
                            'data': '[expence_image_data_asset]',
                        },
                        'expence_image_data_asset': {
                            'plugin': 'infohub_asset',
                            'type': 'image',
                            'subtype': 'jpeg',
                            'asset_name': 'youcan/expence',
                            'plugin_name': 'infohub_welcome',
                        },
                        'review': {
                            'type': 'common',
                            'subtype': 'join',
                            'title': _Translate('REVIEW'),
                            'data0': '[review_image_data]',
                            'data1': _Translate('WRITE_YOUR_REVIEWS_OF_FILMS,_BOOKS,_RECORDS,_TV_SERIES,_GAMES,_SUBSCRIPTIONS,_MAGAZINES._THEN_YOU_CAN_SEE_WHAT_MOVIES_YOU_HAVE_SEEN_AND_WHEN_YOU_SAW_THEM.')
                        },
                        'review_image_data': {
                            'type': 'common',
                            'subtype': 'image',
                            'data': '[review_image_data_asset]',
                        },
                        'review_image_data_asset': {
                            'plugin': 'infohub_asset',
                            'type': 'image',
                            'subtype': 'jpeg',
                            'asset_name': 'youcan/review',
                            'plugin_name': 'infohub_welcome',
                        },
                        'place': {
                            'type': 'common',
                            'subtype': 'join',
                            'title': _Translate('PLACE'),
                            'data0': '[place_image_data]',
                            'data1': _Translate('YOU_CAN_REGISTER_PLACES_YOU_HAVE_VISITED_AND_GET_A_MAP_WITH_DOTS._YOU_CAN_ALSO_LINK_A_PLACE_TO_A_STORY,_IMAGE,_TRAINING_AND_SO_ON.')
                        },
                        'place_image_data': {
                            'type': 'common',
                            'subtype': 'image',
                            'data': '[place_image_data_asset]',
                        },
                        'place_image_data_asset': {
                            'plugin': 'infohub_asset',
                            'type': 'image',
                            'subtype': 'jpeg',
                            'asset_name': 'youcan/place',
                            'plugin_name': 'infohub_welcome',
                        },
                        'event': {
                            'type': 'common',
                            'subtype': 'join',
                            'title': _Translate('EVENT'),
                            'data0': '[event_image_data]',
                            'data1': _Translate('REGISTER_EVENTS_YOU_WANT_TO_PARTICIPATE_IN_OR_HAVE_PARTICIPATED_IN._YOU_CAN_LINK_A_PLACE,_A_REVIEW_ETC.')
                        },
                        'event_image_data': {
                            'type': 'common',
                            'subtype': 'image',
                            'data': '[event_image_data_asset]',
                        },
                        'event_image_data_asset': {
                            'plugin': 'infohub_asset',
                            'type': 'image',
                            'subtype': 'jpeg',
                            'asset_name': 'youcan/event',
                            'plugin_name': 'infohub_welcome',
                        },
                    },
                    'how': {
                        'mode': 'one box',
                        'text': '[welcome_text]',
                    },
                    'where': {
                        'box_id': $in.parent_box_id + '.form',
                        'max_width': 100,
                        'scroll_to_box_id': 'true',
                    },
                    // 'cache_key': 'youcan' // With all images this is too much to cache
                },
                'data_back': {
                    'step': 'step_end',
                },
            });
        }

        return {
            'answer': $in.response.answer,
            'message': $in.response.message,
        };
    };
}

//# sourceURL=infohub_welcome_youcan.js