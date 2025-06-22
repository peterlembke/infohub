/**
 * infohub_welcome_tech
 * The welcome demo
 *
 * @package     Infohub
 * @subpackage  infohub_welcome_tech
 * @since       
 * @author      Peter Lembke <info@infohub.se>
 * @license     GPL-3.0-or-later
 * @copyright   Copyright (C) 2010- Peter Lembke
 * @see         https://github.com/peterlembke/infohub/blob/main/folder/plugins/infohub/welcome/tech/infohub_welcome_tech.md Documentation
 * @link        https://infohub.se/ InfoHub main page
 */
function infohub_welcome_tech() {

    'use strict';

// include "infohub_base.js"

    const _Version = function() {
        return {
            'date': '2015-02-12',
            'version': '1.0.0',
            'checksum': '{{checksum}}',
            'class_name': 'infohub_welcome_tech',
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
                $parts[$key].substring(1);
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
    const create = function($in = {}) {
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
                            'text': '[title][ingress][columns][quick_facts][generic_platform][getting_started][workbench]' +
                                '[write_plugins][lead_words][independent_plugins][message_flow][automatic_plugin_start]' +
                                '[web_workers][logging][caller_functions][inner_workings][subcall][strongly_typed]' +
                                '[what_about_html][renderers][kick_out_tests][automated_tests][multi_domain][history]' +
                                '[/columns]\n[i]Peter Lembke [(c)] 2019 [infohub_link][/i]',
                        },
                        'title': {
                            'type': 'common',
                            'subtype': 'value',
                            'data': '[h1]' + _Translate('INFOHUB') + '[/h1]'
                        },
                        'ingress': {
                            'type': 'common',
                            'subtype': 'value',
                            'data': '[i]' +
                                _Translate('THIS_IS_NOT_ABOUT_SHARING._INFOHUB_IS_ABOUT_YOUR_PRIVATE_DATA,_ENCRYPTED_ON_YOUR_OWN_TRUSTED_SERVER.') + ' ' +
                                _Translate('YOUR_OWN_PLACE_ON_THE_INTERNET_THAT_YOU_CAN_ACCESS_WHENEVER_YOU_WANT_TO.') +
                                '[/i]'
                        },
                        'quick_facts': {
                            'type': 'common',
                            'subtype': 'join',
                            'title': _Translate('QUICK_FACTS'),
                            'data0': '[quick_facts_list]'
                        },
                        'quick_facts_list': {
                            'type': 'common',
                            'subtype': 'list',
                            'option': [
                                {'label': _Translate('INFOHUB_IS_GPL3_LICENSED') },
                                {'label': _Translate('FULL_DOCUMENTATION_AT') + ' [infohub_link]' },
                                {'label': _Translate('PLUGINS_WORK_AND_LOOK_THE_SAME_ON_BOTH_CLIENT_AND_SERVER') },
                                {'label': _Translate('MESSAGES_FLOW_IN_THE_SYSTEM') },
                                {'label': _Translate('SUB-CALL_TO_ANY_PLUGIN_ON_ANY_NODE') },
                                {'label': _Translate('PLUGINS_AUTOSTART_WHEN_NEEDED') },
                                {'label': _Translate('CLIENT_RENDERERS_MANAGE_THE_HTML') },
                                {'label': _Translate('CLIENT_NEVER_REFRESH_THE_PAGE') },
                                {'label': _Translate('CLIENT_USE_LOCAL_STORAGE_FOR_OFFLINE_USE') },
                                {'label': _Translate('LOGGING_TO_FILE_AND_CONSOLE') },
                                {'label': _Translate('PLUGINS_IN_PHP_AND_JAVASCRIPT') },
                                {'label': _Translate('STRONGLY_TYPED_(YES_YOU_READ_RIGHT)') },
                                {'label': _Translate('AUTOMATIC_TESTS_WRITE_THEMSELF_(YES_YOU_READ_RIGHT)') },
                                {'label': _Translate('QUICK_KICK_OUT_TESTS_AT_THE_DOOR') },
                                {'label': _Translate('DOMAINS_CAN_GET_DIFFERENT_CONTENTS') },
                                {'label': _Translate('DID_I_MENTION_FULLY_RESPONSIVE?') }
                            ]
                        },
                        'generic_platform': {
                            'type': 'common',
                            'subtype': 'join',
                            'title': _Translate('THE_GENERIC_WEB_PLATFORM'),
                            'data0': _Translate('A_PLATFORM_TAKE_CARE_OF_ALL_THE_STUFF_THAT_YOU_KNOW_YOU_NEED_BUT_WOULD_TAKE_AGES_TO_WRITE.'),
                            'data1': _Translate('THERE_ARE_MANY_POPULAR_PLATFORMS,_HERE_ARE_A_FEW_POPULAR_ONES:') + ' Magento, Wordpress, Joomla, Drupal.',
                            'data2': _Translate('THEY_ARE_TARGETING_DIFFERENT_AREAS_AND_CAN_BE_EXPANDED_WITH_MODULES.'),
                            'data3': _Translate('INFOHUB_IS_A_GENERIC_PLATFORM._IT_DOES_NOTHING_UNTIL_IT_GETS_SOME_PLUGINS_THAT_TELL_IT_WHAT_TO_DO.'),
                            'data4': _Translate('THERE_ARE_SOME_DEMO_PLUGINS_INCLUDED') + '.'
                        },
                        'getting_started': {
                            'type': 'common',
                            'subtype': 'join',
                            'title': _Translate('GETTING_STARTED'),
                            'data0': _Translate('GPL_3_LICENSED.'),
                            'data1': _Translate('NO_COSTS_FOR_YOU_TO_GET_STARTED.'),
                            'data2': _Translate('JUST_DOWNLOAD_AND_INSTALL.'),
                            'data3': _Translate('INFOHUB_INSTALLATION_IS_SIMPLE,_COPY_VERY_FEW_FILES,_AND_YOU_ARE_ON.')
                        },
                        'workbench': {
                            'type': 'common',
                            'subtype': 'join',
                            'title': _Translate('WORKBENCH'),
                            'data0': _Translate('WITH_THE_OPTIONAL_WORKBENCH_YOU_CAN_START_PLUGINS_AND_SE_THE_GRAPHICAL_USER_INTERFACE.'),
                            'data1': _Translate('THIS_TURNS_INFOHUB_INTO_A_WEB_OPERATING_SYSTEM.')
                        },
                        'write_plugins': {
                            'type': 'common',
                            'subtype': 'join',
                            'title': _Translate('YOU_CAN_WRITE_PLUGINS'),
                            'data0': _Translate('PLUGINS_ARE_SIMPLE_TO_CREATE,_COPY_THE_INFOHUB_PLUGIN_TEMPLATE_TO_A_NEW_NAME_AND_START_CODING.'),
                            'data1': _Translate('YOU_CAN_WRITE_JAVASCRIPT_PLUGINS_FOR_THE_CLIENT_AND_PHP_PLUGINS_FOR_THE_SERVER.'),
                            'data2': _Translate('THE_WAY_YOU_DO_IT_IS_IDENTICAL_AND_WORKS_IDENTICAL.')
                        },
                        'lead_words': {
                            'type': 'common',
                            'subtype': 'join',
                            'title': _Translate('LEAD_WORDS_IN_BUILDING_INFOHUB'),
                            'data0': '[lead_words_list]'
                        },
                        'lead_words_list': {
                            'type': 'common',
                            'subtype': 'list',
                            'option': [
                                {'label': '[b]' + _Translate('NO_EXCEPTIONS') + '[/b] ' +
                                        _Translate('THAT_MEANS_ALL_DATA_ARE_STORED_IN_STORAGE.') + ' ' +
                                        _Translate('ALL_TRAFFIC_ARE_REDIRECTED_WITH_EXCHANGE.') + ' ' +
                                        _Translate('EVERYONE_HAVE_TO_LOGIN_TO_ACCESS_DATA.')
                                },
                                {'label': '[b]' + _Translate('MAKE_IT_SIMPLE') + '[/b] ' +
                                        _Translate('SIMPLE_MEANS_TO_WRITE_CODE_THAT_EVERYONE_CAN_READ.') + ' ' +
                                        _Translate('SIMPLE_CODE_OFTEN_MEAN_FAST_CODE.') + ' ' +
                                        _Translate('CHOOSE_SIMPLE_OVER_FAST_BUT_AVOID_SLOW_CODE.') + ' ' +
                                        _Translate('CHOOSE_SOLUTIONS_THAT_ARE_SIMPLE_TO_UNDERSTAND_AND_SIMPLE_TO_IMPLEMENT.') + ' ' +
                                        _Translate('LET_INFOHUB_STAY_SMALL,_SIMPLE_AND_FAST.') + ' ' +
                                        _Translate('PUT_NEW_ABILITIES_IN_PLUGINS.')
                                },
                                {'label': '[b]' + _Translate('SELF_CONTAINING') + '[/b] ' +
                                        _Translate('PLUGIN_HAVE_NO_DEPENDENCIES_ON_OTHER_PLUGINS.') + ' ' +
                                        _Translate('PLUGIN_CAN_BE_USED_IN_OTHER_PROJECTS_WITH_NO_CHANGES.')
                                }
                            ]
                        },
                        'independent_plugins': {
                            'type': 'common',
                            'subtype': 'join',
                            'title': _Translate('INDEPENDENT_PLUGINS'),
                            'data0': _Translate('EACH_PLUGIN_IS_JUST_ONE_FILE,_ONE_CLASS,_AND_THEY_ALL_EXTEND_THE_BASE_CLASS.'),
                            'data1': _Translate('EACH_PLUGIN_CAN_BE_USED_INDEPENDENTLY_IN_ANOTHER_ENVIRONMENT_IF_YOU_LIKE.'),
                            'data2': _Translate('GIVE_AN_ARRAY_TO_THE_PLUGIN,_THE_PLUGIN_HANDLE_THE_ARRAY_AND_GIVE_YOU_AN_ARRAY_WITH_THE_ANSWER.')
                        },
                        'message_flow': {
                            'type': 'common',
                            'subtype': 'join',
                            'title': _Translate('MESSAGE_FLOW'),
                            'data0': _Translate('INFOHUB_EXCHANGE_TAKE_CARE_OF_THE_MESSAGES_BETWEEN_THE_PLUGINS.'),
                            'data1': _Translate('MESSAGES_ARE_SENT_BETWEEN_THE_CLIENT_AND_SERVER_WITHOUT_ANY_EFFORT.'),
                            'data2': _Translate('YOU_CAN_DO_A_SUB_CALL_FROM_AND_TO_ANY_NODE._NODES_ARE_THE_CLIENT,_THE_SERVER_AND_OTHER_INFOHUB_SERVERS_THAT_GOT_NODE_NAMES.'),
                            'data3': _Translate('EACH_MESSAGE_CONTAIN_ITS_OWN_CALL_STACK_AND_CAN_FIND_ITS_OWN_WAY_BACK_TO_THE_CALLER.')
                        },
                        'automatic_plugin_start': {
                            'type': 'common',
                            'subtype': 'join',
                            'title': _Translate('AUTOMATIC_PLUGIN_START'),
                            'data0': _Translate('IF_A_MESSAGE_GOES_TO_A_PLUGIN_THAT_IS_NOT_STARTED_THEN_IT_IS_PUT_ASIDE_AND_THE_PLUGIN_IS_REQUESTED.'),
                            'data1': _Translate('WHEN_THE_PLUGIN_HAVE_STARTED_THEN_THE_MESSAGES_TO_THAT_PLUGIN_COME_BACK_IN_THE_FLOW.')
                        },
                        'web_workers': {
                            'type': 'common',
                            'subtype': 'join',
                            'title': _Translate('WEB_WORKERS'),
                            'data0': _Translate('(UNDER_DEVELOPMENT)_IN_THE_BROWSER_YOUR_PLUGINS_RUN_AS_WEB_WORKERS_TO_MAKE_SURE_THEY_ARE_ENCAPSULATED_AND_RESTRICTED_FROM_MUCH_OF_THE_BROWSER_FEATURES.')
                        },
                        'logging': {
                            'type': 'common',
                            'subtype': 'join',
                            'title': _Translate('LOGGING'),
                            'data0': _Translate('YOU_CAN_ENABLE_LOGGING_IN_THE_GENERAL_CONFIGURATION,_THEN_THE_SERVER_LOGS_TO_FILES_AND_THE_CLIENT_LOGS_TO_THE_CONSOLE.'),
                            'data1': _Translate('THE_CONSOLE_MESSAGES_ARE_A_GREAT_SOURCE_FOR_FINDING_ERRORS.'),
                            'data2': _Translate('YOU_DO_NOT_HAVE_TO_ADD_ANY_LOGGING_COMMANDS_TO_YOUR_CODE.'),
                            'data3': _Translate('THAT_IS_TAKEN_CARE_OF_BY_THE_CALLER_FUNCTIONS_CMD()_AND_INTERNAL_CMD().')
                        },
                        'caller_functions': {
                            'type': 'common',
                            'subtype': 'join',
                            'title': _Translate('CALLER_FUNCTIONS'),
                            'data0': _Translate('EACH_PLUGIN_HAVE_ONLY_ONE_PUBLIC_FUNCTION:_CMD().'),
                            'data1': _Translate('THE_MESSAGE_GOES_INTO_THAT_FUNCTION_AND_IT_CALLS_THE_RIGHT_CMD_FUNCTION.'),
                            'data2': _Translate('YOU_WILL_GET_AN_ARRAY_BACK_FROM_CMD_WITH_THE_ANSWER.'),
                            'data3': _Translate('THE_CMD_FUNCTION_TAKE_CARE_OF_LOGGING,_ERROR_HANDLING,_MEASURE_EXECUTION_TIME,_CHECK_THE_INCOMING_VARIABLES_IN_THE_ARRAY,_RETURNS_A_RETURN-MESSAGE_OR_A_SUB-CALL-MESSAGE.')
                        },
                        'inner_workings': {
                            'type': 'common',
                            'subtype': 'join',
                            'title': _Translate('INFOHUB_INNER_WORKINGS'),
                            'data0': '[inner_workings_svg]',
                            'data1': _Translate('EVERY_BOX_IS_A_PLUGIN._INFOHUB_STORAGE_USE_PLUGINS_THAT_SPECIALISE_ON_EACH_DATABASE_TYPE.'),
                            'data2': _Translate('INFOHUB_RENDER_GET_HTML_FROM_THE_RENDERERS_AND_SEND_TO_INFOHUB_VIEW._ALL_IS_JUST_PLUGINS_AND_YOU_CAN_WRITE_YOUR_OWN_TOO.')
                        },
                        'inner_workings_svg': {
                            'type': 'common',
                            'subtype': 'svg',
                            'data': '[inner_workings_svg_asset]',
                        },
                        'inner_workings_svg_asset': {
                            'plugin': 'infohub_asset',
                            'type': 'icon',
                            'asset_name': 'tech/inner-workings',
                            'plugin_name': 'infohub_welcome',
                        },
                        'subcall': {
                            'type': 'common',
                            'subtype': 'join',
                            'title': _Translate('SUB-CALL_OR_RETURN_MESSAGE'),
                            'data0': _Translate('A_PLUGIN_ALWAYS_RETURN_A_VALID_MESSAGE_THAT_CAN_BE_RELEASED_TO_THE_FLOW.'),
                            'data1': _Translate('THE_MESSAGE_IS_EITHER_A_RETURN_MESSAGE,_OR_A_SUB-CALL_MESSAGE.'),
                            'data2': _Translate('YOU_CAN_DO_A_SUB_CALL_IN_YOUR_FUNCTION_TO_ANYWHERE_AND_THEN_EXPECT_THE_VERY_SAME_FUNCTION_TO_GET_A_RETURN_MESSAGE_WITH_DATA.'),
                            'data3': _Translate('YOU_CAN_ATTACH_VARIABLES_IN_THE_SUB_CALL_THAT_WILL_RETURN_UNTOUCHED._SEE_THE_DEMOS_FOR_A_”STEP”_VARIABLE.')
                        },
                        'strongly_typed': {
                            'type': 'common',
                            'subtype': 'join',
                            'title': _Translate('STRONGLY_TYPED'),
                            'data0': _Translate('PHP_AND_JAVASCRIPT_CAN_DO_TYPE_JUGGLING_WITHOUT_SAYING_A_PIP._THAT_IS_GREAT.'),
                            'data1': _Translate('A_GREAT_SOURCE_OF_AGONY_WHEN_YOU_CAN_NOT_FIND_WHERE_IT_HAVE_TYPE_CASTED_AND_DESTROYED_YOUR_DATA.'),
                            'data2': _Translate('EACH_FUNCTION_IN_EVERY_PLUGIN_START_BY_SETTING_DEFAULT_VALUES.'),
                            'data3': _Translate('NOW_YOU_KNOW_THAT_THE_INCOMING_ARRAY_CONTAIN_WHAT_YOU_EXPECT_AND_NOTHING_MORE.')
                        },
                        'what_about_html': {
                            'type': 'common',
                            'subtype': 'join',
                            'title': _Translate('WHAT_ABOUT_HTML?'),
                            'data0': _Translate('THE_PLUGIN_INFOHUB_VIEW_TAKE_CARE_OF_THE_CONTENT_BOXES_ON_THE_SCREEN.'),
                            'data1': _Translate('YOU_CAN_SAY_THINGS_LIKE:_INSERT_THIS_HTML_IN_THE_LEFT_BOX,_IN_THE_MIDDLE_OF_THE_OTHER_BOXES.'),
                            'data2': _Translate('THEN_YOUR_BOX_WILL_BE_INSERTED_THERE_WITH_YOUR_HTML._THERE_ARE_PLUGINS_THAT_HANDLE_HTML,_THE_RENDERERS.'),
                            'data3': _Translate('NORMAL_PLUGINS,_YOU_GIVE_THEM_AN_ARRAY_AND_GET_AN_ARRAY_BACK_WITH_THE_HTML') + '.'
                        },
                        'renderers': {
                            'type': 'common',
                            'subtype': 'join',
                            'title': _Translate('RENDERERS'),
                            'data0': _Translate('READY_TO_USE_RENDERERS_FOR_TEXT,_MAPS,_IMAGES,_LISTS,_AUDIO,_VIDEO,_LINKS,_FORMS.'),
                            'data1': _Translate('YOU_CAN_WRITE_YOUR_OWN_RENDERERS,_IT_IS_JUST_NORMAL_PLUGINS.')
                        },
                        'kick_out_tests': {
                            'type': 'common',
                            'subtype': 'join',
                            'title': _Translate('KICK_OUT_TESTS'),
                            'data0': _Translate('INFOHUB_WOULD_JUST_LOVE_TO_KICK_YOU_OUT_IF_YOU_DO_NOT_BEHAVE_EXACTLY_AS_EXPECTED.'),
                            'data1': _Translate('EVERY_CALL_YOU_MAKE_MUST_PASS_THE_QUICK_TESTS.'),
                            'data2': _Translate('THERE_IS_A_BAN_SYSTEM_THAT_ALWAYS_GIVE_YOU_1_SECOND_BAN_TIME_FOR_A_VALID_CALL,_AND_MORE_FOR_AN_INVALID_CALL.')
                        },
                        'automated_tests': {
                            'type': 'common',
                            'subtype': 'join',
                            'title': _Translate('AUTOMATED_TESTS'),
                            'data0': _Translate('AN_INFOHUB_PLUGIN_EXPECT_AN_INCOMING_ARRAY_AND_GIVE_AN_YOU_AN_ARRAY_BACK.'),
                            'data1': _Translate('THERE_ARE_NO_OTHER_SOURCES_OF_INPUT_OR_OUTPUT,_NO_GLOBAL_VARIABLES_ETC.'),
                            'data2': _Translate('THE_TEST_SYSTEM_ASK_THE_PLUGIN_WHAT_FUNCTIONS_IT_HAS_AND_THEN_CALL_EACH_OF_THEM_WITH_DATA_FROM_THE_TEST_FILE,_OR_AN_EMPTY_ARRAY.'),
                            'data3': _Translate('THE_FUNCTION_GET_THE_DEFAULT_VALUES_AND_GIVE_THE_DEFAULT_ANSWER.'),
                            'data4': _Translate('THE_ARRAYS_ARE_SAVED_IN_A_TEST_FILE_FOR_EACH_PLUGIN.'),
                            'data5': _Translate('IN_A_FUTURE_RELEASE_I_WILL_ALSO_SAVE_LIVE_DATA_TO_THE_TEST_SYSTEM.'),
                            'data6': _Translate('THIS_MEANS_THAT_THE_TESTS_WRITE_THEM_SELF.')
                        },
                        'automated_inspections': {
                            'type': 'common',
                            'subtype': 'join',
                            'title': _Translate('AUTOMATED_INSPECTIONS'),
                            'data0': _Translate('THIRD_PARTY_INTERACTIONS_FROM_THE_CLIENT_IS_NOT_ALLOWED.'),
                            'data1': _Translate('THE_CLIENT_ONLY_SPEAK_WITH_THE_SERVER.'),
                            'data2': _Translate('AN_INSPECTOR_PATROL_THE_HTML_AND_GIVE_A_WARNING_FOR_ANY_EXTERNAL_LINK.')
                        },
                        'multi_domain': {
                            'type': 'common',
                            'subtype': 'join',
                            'title': _Translate('MULTI_DOMAIN'),
                            'data0': _Translate('ONE_WEBSITE_CAN_HAVE_MULTIPLE_DOMAINS_AND_SUB_DOMAINS.'),
                            'data1': _Translate('YOU_DEFINE_IN_THE_GLOBAL_CONFIGURATION_WHAT_START_MESSAGE_SHOULD_BE_SEND_FOR_EACH_DOMAIN.'),
                            'data2': _Translate('THERE_IS_A_DEFAULT_FALLBACK._YOU_CAN_THEN_GET_DIFFERENT_CONTENTS_FOR_EACH_DOMAIN.')
                        },
                        'multi_nodes': {
                            'type': 'common',
                            'subtype': 'join',
                            'title': _Translate('MULTI_NODES'),
                            'data0': _Translate('THE_CLIENT_CAN_ONLY_TALK_WITH_THE_SERVER.'),
                            'data1': _Translate('THE_SERVER_CAN_TALK_WITH_OTHER_INFOHUB_SERVERS_ON_THE_INTERNET.'),
                            'data2': _Translate('EACH_PARTY_IS_CALLED_A_NODE.'),
                            'data3': _Translate('YOU_NEED_LOGIN_CREDENTIALS_TO_A_NODE_TO_EXCHANGE_MESSAGES.')
                        },
                        'history': {
                            'type': 'common',
                            'subtype': 'join',
                            'title': _Translate('HISTORY'),
                            'data0': _Translate('THE_IDEA_ABOUT_A_MESSAGE_DRIVEN_SYSTEM_CAME_TO_ME_IN_1990_WHILE_I_WAS_DESIGNING_HARDWARE.'),
                            'data1': _Translate('WHAT_ABOUT_A_SYSTEM_WITH_INDEPENDENT_MODULES_THAT_CAN_SEND_MESSAGES_TO_EACH_OTHER.'),
                            'data2': _Translate('MY_THOUGHT_WAS_THAT_WE_BY_2010_WOULD_EXPAND_OUR_COMPUTERS_WITH_PROCESSOR_MODULES,_GRAPHICS_MODULES,_STORAGE_MODULES,_POWER_MODULES,_ETC_IN_INFINITY.'),
                            'data3': _Translate('BY_2000_I_DESIGNED_A_CMS_SYSTEM_FOR_MY_HOME_PAGE._WRITTEN_IN_ASP_AND_ACCESS_DATABASES.'),
                            'data4': _Translate('A_GREAT_LEARNING._SOME_OF_THE_IDEAS_ARE_NOW_IN_INFOHUB.'),
                            'data5': _Translate('2010-01-01_STARTED_DEVELOPMENT_OF_INFOHUB.'),
                            'data6': _Translate('I_COULD_WORK_SOME_HOURS_LOW_QUALITY_TIME_HERE_AND_THERE_BUT_I_NEVER_GAVE_UP.'),
                            'data7': _Translate('BY_LATE_2011_I_BECAME_A_PROGRAMMER_BY_PROFESSION,_AND_BY_NOW_I_AM_A_PROFESSIONAL_PROGRAMMER.'),
                            'data8': _Translate('WE_ARE_AT_2019_AND_I_AM_PROUD_TO_PRESENT_TO_YOU_INFOHUB_CORE.')
                        },
                        'infohub_link': {
                            'type': 'link',
                            'subtype': 'link',
                            'text': _Translate('INFOHUB'),
                            'data': 'http://www.infohub.se'
                        },
                        'light': {
                            'type': 'common',
                            'subtype': 'container_start',
                            'class': 'light',
                            'tag': 'span',
                        },
                        '/light': {
                            'type': 'common',
                            'subtype': 'container_stop',
                            'tag': 'span',
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
                    // 'cache_key': 'tech' // Seldom viewed. No need to cache
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

//# sourceURL=infohub_welcome_tech.js