/*
 Copyright (C) 2019- Peter Lembke, CharZam soft
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
function infohub_markdown_own() {

// include "infohub_base.js"

    $functions.push('_Version');
    var _Version = function() {
        return {
            'date': '2019-02-01',
            'version': '1.0.0',
            'class_name': 'infohub_markdown',
            'checksum': '{{checksum}}',
            'note': 'This plugin is a renderer. Markdown is a text format suitable for humans to read as it is. This plugin parse the text and create HTML to increase the readability in a browser.',
            'license_name': 'GNU GPL 3 or later'
        };
    };

    $functions.push('_GetCmdFunctions');
    var _GetCmdFunctions = function() {
        return {
            'create': 'normal'
        };
    };

    // *****************************************************************************
    // * The private functions, add your own in your plugin
    // * These functions can be used directly in your functions.
    // * Name: _CamelCaseData
    // *****************************************************************************

    /**
     * Internal functions must start with a capital letter
     * Used by renderers to get a proper function name
     * @version 2016-10-16
     * @since   2016-10-16
     * @author  Peter Lembke
     * @param $text
     * @return string
     */
    var _GetFuncName = function($text) {
        "use strict";
        var $parts = [], $key, $response = '';
        $parts = $text.split('_');
        for ($key in $parts) {
            if ($parts.hasOwnProperty($key) === false) {
                continue;
            }
            $response = $response + $parts[$key].charAt(0).toUpperCase() + $parts[$key].substr(1);
        }
        return $response;
    };

    // *****************************************************************************
    // * Functions you only can reach with CMD()
    // * Observe! function names are lower_case
    // *****************************************************************************

    /**
     * Get instructions and create the message to InfoHub View
     * @version 2013-04-15
     * @since   2013-04-15
     * @author  Peter Lembke
     */
    $functions.push("create"); // Enable this function
    var create = function ($in) {
        "use strict";
        var $find, $replace,
            $default = {
                'text': '',
                'alias': '',
                'original_alias': '',
                'step': 'step_start',
                'html': '',
                'css_data': {
                    '.bold': 'font-weight: bold;',
                    '.italic': 'font-style: italic;',
                    '.strike': 'text-decoration: line-through'
                }
            };
        $in = _Merge($default, $in);

        if ($in.step === 'step_start') {
            var $response = internal_Cmd({
                'func': 'Markdown',
                'text': $in.text
            });

            return _SubCall({
                'to': {
                    'node': 'client',
                    'plugin': 'infohub_render',
                    'function': 'create'
                },
                'data': {
                    'what': $response.data,
                    'how': $response.how,
                    'where': $response.where
                },
                'data_back': {
                    'step': 'step_final',
                    'alias': $in.alias,
                    'css_data': $in.css_data
                }
            });
        }

        if ($in.step === 'step_final') {
            if (_Empty($in.alias) === 'false') {
                // All IDs become unique by inserting the parent alias in each ID.
                $find = '{box_id}';
                $replace = $find + '_' + $in.alias;
                $in.html = $in.html.replace(new RegExp($find, 'g'), $replace);
            }
        }
        
        return {
            'answer': $in.answer,
            'message': $in.message,
            'html': $in.html,
            'css_data': $in.css_data
        };
    };

    /**
     * The Markdown parser
     * Aim is to divide the text into parts that can be rendered with infohub_render
     * https://guides.github.com/features/mastering-markdown/
     * @version 2019-02-01
     * @since   2019-02-01
     * @author  Peter Lembke
     */
    var internal_Markdown = function ($in) {
        "use strict";
        var $parts, $parseFunctions, $text, $response, $func, $i,
            $default = {
                'text': '',
                'class': 'markdown',
                'css_data': {},
                'original_alias': ''
            };
        $in = _Default($default, $in);
        
        $text = _Replace('[*', '[', $in.text);
        $parts = {};
        
        $parseFunctions = ['CodeFencing', 'CodeIndent', 'CodeInline', 'Emoji',
            'EmphasisStrikeTrough', 'Images', 'Links', 
            'ListsUnordered', 'ListsOrdered' ,'Blockquotes', 'TaskList', 
            'Tables', 'Headers'];

        for ($i = 0; $i < $parseFunctions.length; $i++) 
        {
            $func = 'Parse' + $parseFunctions[$i];
            $response = internal_Cmd({
                'func': $func,
                'text': $text
            });
            $parts = _Merge($parts, $response.parts);
            $text = $response.text;
        }

        return {
            'answer': 'true',
            'message': 'Here are the parts to build the markdown text',
            'data': $parts,
            'how': {
                'mode': 'one box',
                'text': $text
            },
            'where': {
                'mode': 'html'
            }
        };

    };

    /**
     * Code block that start with a line ```whatever(newline) 
     * then the code. 
     * end with a separate line: ```
     * We want this segment to be a code container
     * https://guides.github.com/features/mastering-markdown/
     * @version 2019-02-01
     * @since   2019-02-01
     * @author  Peter Lembke
     */
    var internal_ParseCodeFencing = function ($in) {
        "use strict";
        var $text, $parts = {}, $blocks = [], $nr = 0, $i, $blockName = '',
            $default = {
                'text': ''
            };
        $in = _Default($default, $in);
        
        $text = $in.text;
        
        $blocks = $text.split('```'); // Cut text in blocks
        
        for ($i=0; $i < $blocks.length; $i++) {
            if ($i % 2 === 0) {
                continue;
            }
            
            $blockName = 'codefencing' + $nr;
            $parts[$blockName] = {
                'type': 'common',
                'subtype': 'codecontainer',
                'data': $blocks[$i],
            };
            $blocks[$i] = '['+ $blockName +']';
            $nr++;
        }
        $text = $blocks.join('');
        
        return {
            'answer': 'true',
            'message': 'Here are the parts',
            'text': $text,
            'parts': $parts
        };
    };

    /**
     * Code indent block that are indented with four spaces and surrounded by newline
     * We want this segment to be a code container. Remove four spaces on each code row.
     * https://guides.github.com/features/mastering-markdown/
     * @version 2019-02-01
     * @since   2019-02-01
     * @author  Peter Lembke
     */
    var internal_ParseCodeIndent = function ($in) {
        "use strict";
        var $text, $parts = {}, $blocks = [], $nr = 0, $i, $blockName = '', $end,
            $startOfRest = 0,
            $findStart = "\n\n    ", $findEnd = "\n\n", $code, $findIndent = "\n    ",
            $default = {
                'text': ''
            };
        $in = _Default($default, $in);
        
        $text = $in.text;

        $blocks = $text.split($findStart); // Cut text in blocks
        
        if ($blocks.length >= 2) {
            for ($i=1; $i < $blocks.length;$i++) {
                $end = $blocks[$i].indexOf($findEnd);
                $startOfRest = $end + $findEnd.length -1;
                if ($end === -1) {
                    $end = $blocks[$i].length;
                    $startOfRest = $end;
                }
                $blockName = 'codeindent' + $nr;
                $code = $blocks[$i].substr(0,$end);
                $code = _Replace($findIndent, "\n", $code);
                $parts[$blockName] = {
                    'type': 'common',
                    'subtype': 'codecontainer',
                    'data': $code,
                };
                $blocks[$i] = '['+ $blockName +']' + $blocks[$i].substr($startOfRest);
                $nr++;
            }
            $text = $blocks.join();
        }
        
        return {
            'answer': 'true',
            'message': 'Here are the parts',
            'text': $text,
            'parts': $parts
        };
    };

    /**
     * Code inline `looks like this`
     * We want this segment to be a code container.
     * https://guides.github.com/features/mastering-markdown/
     * @version 2019-02-01
     * @since   2019-02-01
     * @author  Peter Lembke
     */
    var internal_ParseCodeInline = function ($in) {
        "use strict";
        var $text, $parts = {}, $blocks = [], $nr = 0, $blockName,
            $findStart = " `", $findEnd = "` ", $start, $end, $code,
            $default = {
                'text': ''
            };
        $in = _Default($default, $in);
        
        $text = $in.text;
        while (($start = $text.indexOf($findStart)) !== -1) {
            $end = $text.substr($start).indexOf($findEnd);
            $code = $text.substr($start+2,$end-2);
            $blockName = 'codeinline' + $nr;
            $parts[$blockName] = {
                'type': 'common',
                'subtype': 'codecontainer',
                'data': $code,
                'tag': '',
                'class': 'no-css-please'
            };
            $nr++;
            $text = $text.substr(0,$start+1) + '[' + $blockName + ']' + $text.substr($start + $end +1);
        }
        
        // @todo Even if the output seems corrent it still fails after being rendered. This needs more investigation
        
        return {
            'answer': 'true',
            'message': 'Here are the parts',
            'text': $text,
            'parts': $parts
        };

    };

    /**
     * Handle emoji images. They must be assets in infohub_markdown. Do NOT link to external resources.
     * Handle the five most common as proof of concept.
     * https://guides.github.com/features/mastering-markdown/
     * @version 2019-02-01
     * @since   2019-02-01
     * @author  Peter Lembke
     */
    var internal_ParseEmoji = function ($in) {
        "use strict";
        var $text, $parts = {}, $blocks = [], $nr = 0, $blockName,
            $findStart = " :", $findEnd = ": ", $start, $end, $code,
            $default = {
                'text': ''
            };
        $in = _Default($default, $in);
        
        $text = $in.text;
        while (($start = $text.indexOf($findStart)) !== -1) {
            $end = $text.substr($start).indexOf($findEnd);
            $code = $text.substr($start+2,$end-2);
            $blockName = 'emoji' + $nr;
            $parts[$blockName] = {
                'plugin': 'infohub_renderemoji',
                'type': 'unicode', // Unicode or image
                'data': $code
            };
            $nr++;
            $text = $text.substr(0,$start+1) + '[' + $blockName + ']' + $text.substr($start + $end +1);
        }
        
        // @todo Even if the output seems corrent it still fails after being rendered. This needs more investigation
        
        return {
            'answer': 'true',
            'message': 'Here are the parts',
            'text': $text,
            'parts': $parts
        };
    };

    /**
     * Handle italic, bold, strike trough. They can also be combined inside each other
     * We want span boxes on these and classes.
     * A row or word that start or end with:
     * Bold: "**" or "__" <span class="bold">My italic text</span>
     * Strike trough: "~~" <span class="strike-trough">My italic text</span>
     * Italic: "*" or "_" <span class="italic">My italic text</span>
     * https://guides.github.com/features/mastering-markdown/
     * @version 2019-02-01
     * @since   2019-02-01
     * @author  Peter Lembke
     */
    var internal_ParseEmphasisStrikeTrough = function ($in) {
        "use strict";
        var $text, $parts = {}, $find, $start, $lengthData, $findString,
            $leftPart, $middlePart, $lastPart, $i, $middlePartStart, $lastPartStart,
            $class,
            $default = {
                'text': ''
            };
        $in = _Default($default, $in);
        
        $text = $in.text;
        
        $find = ['**', '__', '*', '_', '~~'];
        $class = ['bold', 'bold', 'italic', 'italic', 'strike'];
        
        for ($i=0; $i < $find.length; $i++)
        {
            $findString = $find[$i];
            while (($start = $text.indexOf($findString)) !== -1)
            {
                $middlePartStart = $start + $findString.length;
                $lengthData = $text.substr($middlePartStart).indexOf($findString);
                
                $leftPart = $text.substr(0, $start);
                $middlePart = $text.substr($middlePartStart, $lengthData);
                
                $lastPartStart = $start + $findString.length + $lengthData + $findString.length;
                $lastPart = $text.substr($lastPartStart);
                
                $text = $leftPart + '<span class="' + $class[$i] + '">' + $middlePart + '</span>' + $lastPart; 
            }
        }

        return {
            'answer': 'true',
            'message': 'Here are the text',
            'text': $text,
            'parts': $parts
        };

    };

    /**
     * Handle images but only the first syntax with an asset name. 
     * Do not allow external links like in the second example.
     * ![GitHub Logo](/images/logo.png)
     * ![Image of Yaktocat](https://octodex.github.com/images/yaktocat.png)
     * https://guides.github.com/features/mastering-markdown/
     * @version 2019-02-01
     * @since   2019-02-01
     * @author  Peter Lembke
     */
    var internal_ParseImages = function ($in) {
        "use strict";
        var $text, $parts = {},
            $default = {
                'text': ''
            };
        $in = _Default($default, $in);
        
        $text = $in.text;
        
        return {
            'answer': 'true',
            'message': 'Here are the parts',
            'text': $text,
            'parts': $parts
        };

    };

    /**
     * Handle links. The links will open in a new tab/window.
     * https://guides.github.com/features/mastering-markdown/
     * @version 2019-02-01
     * @since   2019-02-01
     * @author  Peter Lembke
     */
    var internal_ParseLinks = function ($in) {
        "use strict";
        var $text, $parts = {},
            $default = {
                'text': ''
            };
        $in = _Default($default, $in);
        
        $text = $in.text;
        
        return {
            'answer': 'true',
            'message': 'Here are the parts',
            'text': $text,
            'parts': $parts
        };

    };

    /**
     * Handle Lists Unordered. These are also called bullet lists.
     * https://guides.github.com/features/mastering-markdown/
     * @version 2019-02-01
     * @since   2019-02-01
     * @author  Peter Lembke
     */
    var internal_ParseListsUnordered = function ($in) {
        "use strict";
        var $text, $parts = {},
            $default = {
                'text': ''
            };
        $in = _Default($default, $in);
        
        $text = $in.text;
        
        return {
            'answer': 'true',
            'message': 'Here are the parts',
            'text': $text,
            'parts': $parts
        };

    };

    /**
     * Handle Lists Ordered. These are also called numerical lists.
     * https://guides.github.com/features/mastering-markdown/
     * @version 2019-02-01
     * @since   2019-02-01
     * @author  Peter Lembke
     */
    var internal_ParseListsOrdered = function ($in) {
        "use strict";
        var $text, $parts = {},
            $default = {
                'text': ''
            };
        $in = _Default($default, $in);
        
        $text = $in.text;
        
        return {
            'answer': 'true',
            'message': 'Here are the parts',
            'text': $text,
            'parts': $parts
        };

    };

    /**
     * Handle Block quotes. You can quote text
     * https://guides.github.com/features/mastering-markdown/
     * @version 2019-02-01
     * @since   2019-02-01
     * @author  Peter Lembke
     */
    var internal_ParseBlockquotes = function ($in) {
        "use strict";
        var $text, $parts = {},
            $default = {
                'text': ''
            };
        $in = _Default($default, $in);
        
        $text = $in.text;
        
        return {
            'answer': 'true',
            'message': 'Here are the parts',
            'text': $text,
            'parts': $parts
        };

    };

    /**
     * Handle Task List. A read only list with check boxes. You set checked in the text
     * - [x] This is a complete item
     * https://guides.github.com/features/mastering-markdown/
     * @version 2019-02-01
     * @since   2019-02-01
     * @author  Peter Lembke
     */
    var internal_ParseTaskList = function ($in) {
        "use strict";
        var $text, $parts = {},
            $default = {
                'text': ''
            };
        $in = _Default($default, $in);
        
        $text = $in.text;
        
        return {
            'answer': 'true',
            'message': 'Here are the parts',
            'text': $text,
            'parts': $parts
        };

    };

    /**
     * Handle Tables
     * https://guides.github.com/features/mastering-markdown/
     * @version 2019-02-01
     * @since   2019-02-01
     * @author  Peter Lembke
     */
    var internal_ParseTables = function ($in) {
        "use strict";
        var $text, $parts = {},
            $default = {
                'text': ''
            };
        $in = _Default($default, $in);
        
        $text = $in.text;
        
        return {
            'answer': 'true',
            'message': 'Here are the parts',
            'text': $text,
            'parts': $parts
        };

    };

    /**
     * Handle Headers
     * https://guides.github.com/features/mastering-markdown/
     * @version 2019-02-01
     * @since   2019-02-01
     * @author  Peter Lembke
     */
    var internal_ParseHeaders = function ($in) {
        "use strict";
        var $text, $parts = {}, $rows = [], $nr, $i,
            $default = {
                'text': ''
            };
        $in = _Default($default, $in);
        
        $rows = $in.text.split(/\r|\r\n|\n/);
        for ($i=0;$i < $rows.length;$i++) {
            if ($rows[$i].substr(0,1) === '#') {
                $nr = $rows[$i].indexOf(' ');
                $rows[$i] = '<h'+$nr+'>' + $rows[$i].substr($nr+1) + '</h'+$nr+'>';
            } else {
                if ($rows[$i] !== '') {
                    $rows[$i] = '<p>' + $rows[$i] + '</p>';
                }
            }
        }
        $text = $rows.join('');
        
        return {
            'answer': 'true',
            'message': 'Here are the parts',
            'text': $text,
            'parts': $parts
        };

    };

}
//# sourceURL=infohub_markdown.js
