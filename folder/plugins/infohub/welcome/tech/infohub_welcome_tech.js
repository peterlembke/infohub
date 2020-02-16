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
function infohub_welcome_tech() {

    "use strict";

// include "infohub_base.js"

    const _Version = function() {
        return {
            'date': '2015-02-12',
            'version': '1.0.0',
            'checksum': '{{checksum}}',
            'class_name': 'infohub_welcome_tech',
            'note': 'The welcome demo',
            'status': 'normal',
            'license_name': 'GNU GPL 3 or later'
        };
    };

    const _GetCmdFunctions = function() {
        return {
            'create': 'normal'
        };
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
        $in = _ByVal($in);

        $classTranslations = $in.translations;

        $in.func = _GetFuncName($in.subtype);
        let $response = internal_Cmd($in);

        return {
            'answer': $response.answer,
            'message': $response.message,
            'data': $response.data
        };
    };

    $functions.push("internal_Tech");
    const internal_Tech = function ($in)
    {
        const $default = {
            'subtype': 'menu',
            'parent_box_id': ''
        };
        $in = _Default($default, $in);

        const $data = {
            'to': {
                'node': 'client',
                'plugin': 'infohub_render',
                'function': 'create'
            },
            'data': {
                'what': {
                    'welcome_text': {
                        'type': 'text',
                        'text': "[title][ingress][columns][quick_facts][generic_platform][getting_started][workbench]" +
                        "[write_plugins][lead_words][independent_plugins][message_flow][automatic_plugin_start]" +
                        "[web_workers][logging][caller_functions][inner_workings][subcall][strongly_typed]" +
                        "[what_about_html][renderers][kick_out_tests][automated_tests][multi_domain][history]" +
                        "[/columns]\n[i]Peter Lembke [(c)] 2019 [infohub_link][/i]"
                    },
                    'title': {
                        'type': 'common',
                        'subtype': 'value',
                        'data': '[h1]' + _Translate('InfoHub') + '[/h1]'
                    },
                    'ingress': {
                        'type': 'common',
                        'subtype': 'value',
                        'data': '[i]' + _Translate('This is not about sharing. InfoHub is about your private data, encrypted on your own trusted server. Your own place on the internet that you can access whenever you want to.') + '[/i]'
                    },
                    'quick_facts': {
                        'type': 'common',
                        'subtype': 'join',
                        'title': _Translate('Quick facts'),
                        'data0': '[quick_facts_list]'
                    },
                    'quick_facts_list': {
                        'type': 'common',
                        'subtype': 'list',
                        'option': [
                            {'label': _Translate('InfoHub is GPL3 licensed') },
                            {'label': _Translate('Full documentation at [infohub_link]') },
                            {'label': _Translate('Plugins work and look the same on both client and server') },
                            {'label': _Translate('Messages flow in the system') },
                            {'label': _Translate('Subcall to any plugin on any node') },
                            {'label': _Translate('Plugins autostart when needed') },
                            {'label': _Translate('Client renderers manage the HTML') },
                            {'label': _Translate('Client never refresh the page') },
                            {'label': _Translate('Client use local storage for offline use') },
                            {'label': _Translate('Logging to file and console') },
                            {'label': _Translate('Plugins in PHP and Javascript') },
                            {'label': _Translate('Strongly typed (Yes you read right)') },
                            {'label': _Translate('Automatic tests write themselfs (yes you read right)') },
                            {'label': _Translate('Quick kick out tests at the door') },
                            {'label': _Translate('Domains can get different contents') },
                            {'label': _Translate('Did I mention fully responsive?') }
                        ]
                    },
                    'generic_platform': {
                        'type': 'common',
                        'subtype': 'join',
                        'title': _Translate('The generic web platform'),
                        'data0': _Translate('A platform take care of all the stuff that you know you need but would take ages to write. There are many popular platforms, here are a few popular ones: Magento, Wordpress, Joomla, Drupal. They are targeting different areas and can be expanded with modules. InfoHub is a generic platform. It does nothing until it gets some plugins that tell it what to do. There are some demo plugins included.')
                    },
                    'getting_started': {
                        'type': 'common',
                        'subtype': 'join',
                        'title': _Translate('Getting started'),
                        'data0': _Translate('GPL 3 licensed. No costs for you to get started. Just download and install. InfoHub installation is simple, copy very few files, and you are on.')
                    },
                    'workbench': {
                        'type': 'common',
                        'subtype': 'join',
                        'title': _Translate('Workbench'),
                        'data0': _Translate('With the optional Workbench you can start plugins and se the graphical user interface. This turns Infohub into a web operating system.')
                    },
                    'write_plugins': {
                        'type': 'common',
                        'subtype': 'join',
                        'title': _Translate('You can write plugins'),
                        'data0': _Translate('Plugins are simple to create, copy the infohub_plugin template to a new name and start coding.You can write javascript plugings for the client and php plugins for the server. The way you do it is identical and works identical.')
                    },
                    'lead_words': {
                        'type': 'common',
                        'subtype': 'join',
                        'title': _Translate('Lead words in building InfoHub'),
                        'data0': '[lead_words_list]'
                    },
                    'lead_words_list': {
                        'type': 'common',
                        'subtype': 'list',
                        'option': [
                            {'label': _Translate("[b]No exceptions[/b] That means all data are stored in Storage. All traffic are redirected with Exchange. Everyone have to login to access data.") },
                            {'label': _Translate("[b]Make it simple[/b] Simple means to write code that everyone can read. Simple code often mean fast code. Choose simple over fast but avoid slow code. Choose solutions that are simple to understand and simple to implement. Let InfoHub stay small, simple and fast. Put new abilities in plugins.") },
                            {'label': _Translate("[b]Self containing[/b] Plugin have no dependencies on other plugins. Plugin can be used in other projects with no changes.") }
                        ]
                    },
                    'independent_plugins': {
                        'type': 'common',
                        'subtype': 'join',
                        'title': _Translate('Independent plugins'),
                        'data0': _Translate('Each plugin is just one file, one class, and they all extend the base class. Each plugin can be used independently in another environment if you like. Give an array to the plugin, the plugin handle the array and give you an array with the answer.')
                    },
                    'message_flow': {
                        'type': 'common',
                        'subtype': 'join',
                        'title': _Translate('Message flow'),
                        'data0': _Translate('InfoHub Exchange take care of the messages between the plugins. Messages are sent between the client and server without any effort. You can do a sub call from and to any node. Nodes are the client, the server and other InfoHub servers that got node names. Each message contain its own call stack and can find its own way back to the caller.')
                    },
                    'automatic_plugin_start': {
                        'type': 'common',
                        'subtype': 'join',
                        'title': _Translate('Automatic plugin start'),
                        'data0': _Translate('If a message goes to a plugin that is not started then it is put aside and the plugin is requested. When the plugin have started then the messages to that plugin come back in the flow.')
                    },
                    'web_workers': {
                        'type': 'common',
                        'subtype': 'join',
                        'title': _Translate('Web workers'),
                        'data0': _Translate('(Under development) In the browser your plugins run as web workers to make sure they are encapsulated and restricted from much of the browser features.')
                    },
                    'logging': {
                        'type': 'common',
                        'subtype': 'join',
                        'title': _Translate('Logging'),
                        'data0': _Translate('You can enable logging in the general configuration, then the server logs to files and the client logs to the console. The console messages are a great source for finding errors. You do not have to add any logging commands to your code. That is taken care of by the caller functions Cmd() and internal_Cmd().')
                    },
                    'caller_functions': {
                        'type': 'common',
                        'subtype': 'join',
                        'title': _Translate('Caller functions'),
                        'data0': _Translate('Each plugin have only one public function: Cmd(). The message goes into that function and it calls the right cmd function. You will get an array back from Cmd with the answer. The Cmd function take care of logging, error handling, measure execution time, check the incoming variables in the array, returns a return-message or a subcall-message.')
                    },
                    'inner_workings': {
                        'type': 'common',
                        'subtype': 'join',
                        'title': _Translate('InfoHub inner workings'),
                        'data0': '[inner_workings_svg]',
                        'data1': _Translate('Every box is a plugin. Infohub Storage use plugins that specialise on each database type. Infohub Render get HTML from the renderers and send to InfoHub View. All is just plugins and you can write your own too.')
                    },
                    'inner_workings_svg': {
                        'type': 'common',
                        'subtype': 'svg',
                        'data': '[inner_workings_svg_asset]'
                    },
                    'inner_workings_svg_asset': {
                        'plugin': 'infohub_asset',
                        'type': 'icon',
                        'asset_name': 'tech/inner-workings',
                        'plugin_name': 'infohub_welcome'
                    },
                    'subcall': {
                        'type': 'common',
                        'subtype': 'join',
                        'title': _Translate('SubCall or Return message'),
                        'data0': _Translate('A plugin always return a valid message that can be released to the flow. The message is either a return message, or a subcall message. You can do a sub call in your function to anywhere and then expect the very same function to get a return message with data. You can attach variables in the sub call that will return untouched. See the demos for a ”step” variable.')
                    },
                    'strongly_typed': {
                        'type': 'common',
                        'subtype': 'join',
                        'title': _Translate('Strongly typed'),
                        'data0': _Translate('PHP and Javascript can do type juggeling without saying a pip. That is great. A great source of agony when you can\'t find where it have type casted and destroyed your data. Each function in every plugin start by setting default values. Now you know that the incoming array contain what you expect and nothing more.')
                    },
                    'what_about_html': {
                        'type': 'common',
                        'subtype': 'join',
                        'title': _Translate('what about HTML?'),
                        'data0': _Translate('The plugin infohub_view take care of the content boxes on the screen. You can say things like: Insert this HTML in the left box, in the middle of the other boxes. Then your box will be inserted there with your HTML. There are plugins that handle HTML, the renderers. Normal plugins, you give them an array and get an array back with the HTML.')
                    },
                    'renderers': {
                        'type': 'common',
                        'subtype': 'join',
                        'title': _Translate('Renderers'),
                        'data0': _Translate('Ready to use renderers for text, maps, images, lists, audio, video, links, forms. You can write your own renderers, it is just normal plugins.')
                    },
                    'kick_out_tests': {
                        'type': 'common',
                        'subtype': 'join',
                        'title': _Translate('Kick out tests'),
                        'data0': _Translate('InfoHub would just love to kick you out if you do not behave exactly as expected. Every call you make must pass the quick tests. There is a ban system that always give you 1 second ban time for a valid call, and more for an invalid call.')
                    },
                    'automated_tests': {
                        'type': 'common',
                        'subtype': 'join',
                        'title': _Translate('Automated tests'),
                        'data0': _Translate('An InfoHub plugin expect an incoming array and give an you an array back. There are no other sources of input or output, no global variables etc. The test system ask the plugin what functions it has and then call each of them with data from the test file, or an empty array. The function get the default values and give the default answer. The arrays are saved in a test file for each plugin. In a future release I will also save live data to the test system. This means that the tests write them self.')
                    },
                    'automated_inspections': {
                        'type': 'common',
                        'subtype': 'join',
                        'title': _Translate('Automated inspections'),
                        'data0': _Translate('Third party interactions from the client is not allowed. The client only speak with the server. An inspector patrol the HTML and give a warning for any external link.')
                    },
                    'multi_domain': {
                        'type': 'common',
                        'subtype': 'join',
                        'title': _Translate('Multi domain'),
                        'data0': _Translate('One website can have multiple domains and sub domains. You define in the global configuration what start message should be send for each domain. There is a default fallback. You can then get different contents for each domain.')
                    },
                    'multi_nodes': {
                        'type': 'common',
                        'subtype': 'join',
                        'title': _Translate('Multi nodes'),
                        'data0': _Translate('The client can only talk with the server. The server can talk with other Infohub servers on the internet. Each party is called a Node. You need login credentials to a node to exchange messages.')
                    },
                    'history': {
                        'type': 'common',
                        'subtype': 'join',
                        'title': _Translate('History'),
                        'data0': _Translate('The idea about a message driven system came to me in 1990 while I was designing hardware. What about a system with independent modules that can send messages to each other. My thought was that we by 2010 would expand our computers with processor modules, graphics modules, storage modules, power modules, etc in infinity. By 2000 I designed a CMS system for my home page. Written in ASP and Access databases. A great learning. Some of the ideas are now in InfoHub. 2010-01-01 started development of InfoHub. I could work some hours low quality time here and there but I never gave up. By late 2011 I became a programmer by profession, and by now I am a professional programmer. We are at 2019 and I am proud to present to you InfoHub core.')
                    },
                    'infohub_link': {
                        'type': 'link',
                        'subtype': 'link',
                        'text': _Translate('Infohub'),
                        'data': 'http://www.infohub.se'
                    },
                    'light': {
                        'type': 'common',
                        'subtype': 'container_start',
                        'class': 'light',
                        'tag': 'span'
                    },
                    '/light': {
                        'type': 'common',
                        'subtype': 'container_stop',
                        'tag': 'span'
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
            },
            'data_back': {
                'step': 'step_end'
            }
        };

        return {
            'answer': 'true',
            'message': 'Here are the render data that will create a welcome text',
            'data': $data
        };
    };
}
//# sourceURL=infohub_welcome_tech.js