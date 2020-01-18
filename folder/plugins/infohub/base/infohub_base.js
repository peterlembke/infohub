    // ***********************************************************
    // * jshint.com options to suppress some warnings
    // ***********************************************************

    /*jshint evil:true */
    /*jshint devel:true */
    /*jslint browser, eval, devel, single */
    /*jshint esversion: 6 */

    // ***********************************************************
    // * The only public variables, do not add your own
    // ***********************************************************

    var $functions = [], // Array with all functions
        $firstDefault = null; // Used ONLY by the test() function.

    $functions.push('_VersionBase');
    var _VersionBase = function() {
        return {
            'date': '2016-01-06',
            'version': '1.0.0',
            'checksum': '{{base_checksum}}',
            'class_name': 'infohub_base',
            'note': 'Parent class in ALL plugins. Manages the traffic in the plugin',
            'license_name': 'GNU GPL 3 or later'
        };
    };

    $functions.push('_GetCmdFunctionsBase');
    var _GetCmdFunctionsBase = function () {
        return {
            'version': 'normal',
            'function_names': 'normal'
        };
    };

    // ***********************************************************
    // * The private functions, add your own in your plugin
    // * These functions can be used directly in your functions.
    // * Name: _CamelCaseData
    // ***********************************************************

    /**
     * Make sure you get all variables you expect, at least with default values, and the right datatype.
     * example: $in = _Default($default,$in);
     * Used by: EVERY function to let go of all references. We MUST be sure that we can modify the incoming data
     * without affecting the array on the outside of the function.
     * @version 2015-01-29
     * @since   2013-09-05
     * @author  Peter Lembke
     * @param $default
     * @param $in
     * @return new object
     */
    $functions.push('_Default');
    var _Default = function ($default, $in)
    {
        "use strict";

        if ($firstDefault === null) {
            $firstDefault = $default;
        }

        if (Array.isArray($in)) {
            $in = {};
        }

        if (typeof $default !== 'object' && typeof $in !== 'object') {
            return {};
        }

        if (typeof $default !== 'object' && typeof $in === 'object') {
            return _ByVal($in);
        }

        if (typeof $default === 'object' && typeof $in !== 'object') {
            return _ByVal($default);
        }

        var $callbackFunction = '';
        if (typeof $in.callback_function === 'function') {
            $callbackFunction = $in.callback_function;
        }

        let $answer = _ByVal($in);

        // Set all missing keys from the default object
        for (let $key in $default) {
            if ($default.hasOwnProperty($key) === false) {
                continue;
            }
            if (typeof $answer[$key] === 'undefined') {
                $answer[$key] = $default[$key];
            }
        }

        let $type;

        // Delete keys that are not in the default object
        // If wrong data type then copy the data key value from default
        for (let $key in $answer) {
            if ($answer.hasOwnProperty($key) === false) {
                continue;
            }
            if (typeof $default[$key] === 'undefined') {
                delete $answer[$key];
                continue;
            }
            if ($default[$key] === null && $answer[$key] === null) {
                $answer[$key] = '';
                continue;
            }
            if (typeof $answer[$key] !== typeof $default[$key])
            {
                if ($default[$key] === null) {
                    continue;
                }
                $answer[$key] = $default[$key];
                if ($default[$key] !== null) {
                    $type = typeof $answer[$key];
                    internal_Log({
                        'level': 'error',
                        'message': 'key:"' + $key + '", have wrong data type (' + _GetDataType($in[$key]) + '), instead got default value and data type (' + $type + ')',
                        'function_name': '_Default',
                        'get_backtrace': 'true'
                    });
                }
                continue;
            }
            if (typeof $default[$key] !== 'object') {
                continue;
            }
            if (_Count($default[$key]) === 0) {
                continue;
            }
            $answer[$key] = _Default($default[$key], $answer[$key]);
        }

        if (typeof $callbackFunction === 'function') {
            $answer.callback_function = $callbackFunction;
        }

        return $answer;
    };

    /**
     * Get variable data type name in lower case
     * Example:
     * @param obj
     * @returns {string}
     * @private
     */
    $functions.push('_GetDataType');
    var _GetDataType = function (obj) {
        return ({}).toString.call(obj).match(/\s([a-zA-Z]+)/)[1].toLowerCase();
    };

    /**
     * Merge two objects, everything from obj2 goes into obj1.
     * example: $in = _Merge($default,$in);
     * Starts with $default and adds all keys from $in.
     * Used by you
     * @version 2015-01-17
     * @since   2013-09-05
     * @author  Peter Lembke
     * @param $object1
     * @param $object2
     * @return new object
     */
    $functions.push('_Merge');
    var _Merge = function ($object1, $object2)
    {
        "use strict";
        var $newObject = {};

        if (typeof $object1 === 'object') {
            for (let $key in $object1) {
                if ($object1.hasOwnProperty($key)) {
                    $newObject[$key] = $object1[$key];
                }
            }
        }

        if (typeof $object2 === 'object') {
            for (let $key in $object2) {
                if ($object2.hasOwnProperty($key)) {
                    $newObject[$key] = $object2[$key];
                }
            }
        }

        return _ByVal($newObject);
    };

    /**
     * Delete properties from object1. Name them in object2.
     * example: $in = _Delete($in, {'step':'', 'my_variable':'' });
     * Deletes property 'step' and 'my_variable' from $in
     * Used mainly in renderers.
     * @version 2019-01-05
     * @since   2019-01-05
     * @author  Peter Lembke
     * @param $object1
     * @param $object2
     * @return new object
     */
    $functions.push('_Delete');
    var _Delete = function ($object1, $object2)
    {
        "use strict";
        var $newObject = _ByVal($object1);

        for (let $key in $object2) {
            if ($object1.hasOwnProperty($key) === true) {
                delete $newObject[$key];
            }
        }

        return $newObject;
    };

    /**
     * Let go of the references to the object or array
     * @version 2015-01-17
     * @since   2014-01-03
     * @author  Peter Lembke
     * @param $object
     * @return new object
     */
    $functions.push('_ByVal');
    var _ByVal = function ($object)
    {
        "use strict";

        if (!($object instanceof Object)) {
            return {};
        }

        return _MiniClone($object); // Evaluating if Clone is better/quicker than JSON conversion.

        // return JSON.parse(JSON.stringify($object));
    };

    /**
     * Object deep clone
     * https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Structured_clone_algorithm#Another_way_deep_copy%E2%80%8E
     * @param objectToBeCloned
     * @returns {*}
     * @private
     */
    $functions.push('_Clone');
    var _Clone = function (objectToBeCloned) {
        if (!(objectToBeCloned instanceof Object)) {
            return objectToBeCloned;
        }

        var objectClone;

        // Filter out special objects.
        var Constructor = objectToBeCloned.constructor;
        switch (Constructor) {
            // Implement other special objects here.
            case RegExp:
                objectClone = new Constructor(objectToBeCloned);
                break;
            case Date:
                objectClone = new Constructor(objectToBeCloned.getTime());
                break;
            default:
                objectClone = new Constructor();
        }

        // Clone each property.
        for (var prop in objectToBeCloned) {
            objectClone[prop] = _Clone(objectToBeCloned[prop]);
        }

        return objectClone;
    };

    /**
     * Object deep clone
     * https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Structured_clone_algorithm#Another_way_deep_copy%E2%80%8E
     * @param objectToBeCloned
     * @returns {*}
     * @private
     */
    $functions.push('_MiniClone');
    var _MiniClone = function (objectToBeCloned)
    {
        if (!(objectToBeCloned instanceof Object)) { return objectToBeCloned; }

        var $property,
            Constructor = objectToBeCloned.constructor,
            objectClone = new Constructor();

        for ($property in objectToBeCloned) {
            if (objectToBeCloned.hasOwnProperty($property)) {
                objectClone[$property] = _MiniClone(objectToBeCloned[$property]);
            }
        }

        return objectClone;
    };

    /**
     * Return true if the named method exist in this class
     * Used by cmd, internal_Cmd
     * @param $functionName
     * @returns {boolean}
     * @private
     */
    $functions.push('_MethodExists');
    var _MethodExists = function ($functionName)
    {
        "use strict";

        var _ValidName = function ($name) {
            var $myRegExp = /^([a-zA-Z0-9_]+)$/;
            return $myRegExp.test($name);
        };

        if (typeof $functionName !== 'string') {
            return false;
        }
        if ($functions.indexOf($functionName) > -1) {
            return true;
        }
        if (_ValidName($functionName) === false) {
            return false;
        }
        try {
            if (typeof eval($functionName) === 'function') {
                return true;
            }
        } catch ($err) {
            return false;
        }
        return false;
    };

    /**
     * Return current time stamp as a string in the format "yyyy-mm-dd hh:mm:ss"
     * Give 'c' to also get the time zone offset.
     * @param $date
     * @return string
     */
    $functions.push('_TimeStamp');
    var _TimeStamp = function ($in) {
        "use strict";
        var $date = new Date(),
            yyyy = $date.getFullYear().toString(),
            mm = ('0' + ($date.getMonth() + 1).toString() ).slice(-2), // getMonth() is zero-based
            dd = ('0' + $date.getDate().toString() ).slice(-2),
            hh = ('0' + $date.getHours().toString() ).slice(-2),
            min = ('0' + $date.getMinutes().toString() ).slice(-2),
            sec = ('0' + $date.getSeconds().toString() ).slice(-2),
            offsetTotal, offsetHours, offsetMinutes, offsetSign = '-', offsetResult = '+01:00',
            $result;
        if ($in === 'c') {
            offsetTotal = $date.getTimezoneOffset();
            if (offsetTotal < 0) {
                offsetSign = '+'; // Yes, -60 will become +01:00
                offsetTotal = Math.abs(offsetTotal);
            }
            offsetHours = Math.floor(offsetTotal / 60);
            offsetMinutes = offsetTotal - (offsetHours * 60);
            offsetResult = offsetSign + ('00' + offsetHours).slice(-2) + ':' + ('00' + offsetMinutes).slice(-2);
            $result = yyyy + '-' + mm + '-' + dd + 'T' + hh + ':' + min + ':' + sec + offsetResult;
        } else {
            $result = yyyy + '-' + mm + '-' + dd + ' ' + hh + ':' + min + ':' + sec;
        }
        return $result;
    };

    /**
     * Return current time since EPOC (1970-01-01 00:00:00),
     * as seconds and fraction of seconds.
     * Corresponds to PHP function microtime(true)
     * @param $date
     * @return string
     */
    $functions.push('_MicroTime');
    var _MicroTime = function ()
    {
        "use strict";
        let $timestamp = (new Date()).getTime() / 1000.0;

        if (window.top !== window.self) {
            $timestamp = $timestamp - 10.0;
        } // If in an iframe, mess up the time and get banned, we do not want to be in an iframe

        return $timestamp;
    };

    /**
     * Wrapper so it is easier to change the places where json is used.
     * @param $data
     * @return string
     */
    $functions.push('_JsonEncode');
    var _JsonEncode = function ($data)
    {
        "use strict";

        // const $space = '\t'; // Pretty print with tab
        const $space = '    '; // Pretty print with space
        const $replacer = null;

        const $row = JSON.stringify($data, $replacer, $space); // Pretty print

        return $row;
    };

    /**
     * Wrapper so it is easier to change the places where json is used.
     * @param $row string
     * @return string
     */
    $functions.push('_JsonDecode');
    var _JsonDecode = function ($row)
    {
        "use strict";

        if (_GetDataType($row) !== 'string') {
            return $row;
        }

        if ($row.substring(0, 1) !== '{') {
            return {};
        }

        const $data = JSON.parse($row);

        return $data;
    };

    /**
     * Convert from string to UTF8 string
     * @param $data
     * @return string
     */
    $functions.push('_EncodeUtf8');
    var _EncodeUtf8 = function ($data)
    {
        "use strict";

        const $row = unescape(encodeURIComponent($data));

        return $row;
    };

    /**
     * Convert from UTF8 string to string
     * @param $data
     * @return string
     */
    $functions.push('_DecodeUtf8');
    var _DecodeUtf8 = function ($data)
    {
        "use strict";

        const $row = decodeURIComponent(escape($data));

        return $row;
    };

    /**
     * Read value from any data collection
     * Name can be 'just_a_name' or 'some/deep/level/data'
     * @param $in
     * @returns {*}
     * @private
     */
    $functions.push('_GetData');
    var _GetData = function ($in)
    {
        "use strict";

        const $default = {
                'name': '',
                'default': null,
                'data': {},
                'split': '/'
            };
        $in = _Default($default, $in);

        const $names = $in.name.split($in.split);
        const $length = $names.length;
        let $answer = _ByVal($in.data);

        for (let $key = 0; $key < $length; $key++)
        {
            if (typeof $answer[$names[$key]] !== 'undefined') {
                $answer = $answer[$names[$key]];
            } else {
                return $in.default;
            }
        }

        return $answer;
    };

    /**
     * Return first letter in each word in upper case
     * From: http://locutus.io/php/ucwords/
     * @param $string
     * @returns {string}
     * @private
     */
    var _UcWords = function ($string)
    {
        "use strict";

        $string = $string.replace(/_/g, ' ');

        $string = ($string + '')
            .replace(/^([a-z\u00E0-\u00FC])|\s+([a-z\u00E0-\u00FC])/g, function ($1) {
                return $1.toUpperCase()
            });

        $string = $string.replace(/ /g, '');

        return $string;
    };

    /**
     * same as sprintf in PHP. Substitute %s with another string.
     * @param $row
     * @param $substituteArray
     * @returns {string}
     * @private
     */
    $functions.push('_SprintF');
    var _SprintF = function ($row, $substituteArray)
    {
        "use strict";

        let $answer = '';
        const $parts = $row.split('%s');
        const $numberOfParts = $parts.length;

        for (let $partNumber = 0; $partNumber < $numberOfParts; $partNumber++)
        {
            $answer = $answer + $parts[$partNumber];

            if (typeof $substituteArray[$partNumber] !== 'undefined')
            {
                $answer = $answer + $substituteArray[$partNumber];
            }
        }

        return $answer;
    };

    /**
     * Takes the first found key data from the object and gives it to you, removing it from the object.
     * Used in loops when sending one item at the time in a subcall.
     * @param $in
     * @returns {*}
     * @private
     */
    $functions.push('_Pop');
    var _Pop = function ($in)
    {
        $in = _ByVal($in);

        for (let $key in $in)
        {
            if ($in.hasOwnProperty($key) === true)
            {
                const $data = $in[$key];
                delete $in[$key];
                return {'key': $key, 'data': $data, 'object': $in };
            }
        }

        return {'key': '', 'data': '', 'object': {} };
    };

    /**
     * Create the subCall array to return to cmd.
     * @param $in
     * @returns {*}
     * @private
     */
    $functions.push('_SubCall');
    var _SubCall = function ($in)
    {
        "use strict";

        const $default = {
            'func': 'SubCall',
            'to': {'node': '', 'plugin': '', 'function': ''},
            'data': {},
            'data_back': {},
            'track': 'false',
            'wait': 0.2
        };
        const $out = _Default($default, $in);

        return $out;
    };

    /**
     * Count number of items in an array or an object
     * @param $object
     * @returns {*}
     * @private
     */
    $functions.push('_Count');
    var _Count = function ($object)
    {
        "use strict";

        if (Array.isArray($object)) {
            return $object.length;
        }

        if ($object) {
            return Object.getOwnPropertyNames($object).length;
        }

        return 0;
    };

    /**
     * My definition of an empty variable
     * @param $object
     * @returns {*}
     * @private
     */
    $functions.push('_Empty');
    var _Empty = function ($object)
    {
        "use strict";

        if (typeof $object === 'undefined' || $object === null) {
            return 'true';
        }
        if (typeof $object === 'object' && _Count($object) === 0) {
            return 'true';
        }
        if (typeof $object === 'string' && $object === '') {
            return 'true';
        }

        return 'false';
    };

    /**
     * Check if a variable is declared.
     * @returns {*}
     * @private
     */
    $functions.push('_IsSet');
    var _IsSet = function ()
    {
        "use strict";

        var $arguments = arguments,
            $undefined;

        if ($arguments.length === 0) {
            return 'false';
        }

        if ($arguments[0] === $undefined || $arguments[0] === null) {
            return 'false';
        }
        return 'true';
    };

    /**
     * Substitute all occurrences of a sub string to a substitute string
     * A JS version of PHP str_replace
     * Source: https://stackoverflow.com/questions/1144783/how-to-replace-all-occurrences-of-a-string-in-javascript#1144788
     * @param $string | The string you want to modify
     * @param $find | The sub string you want to substitute
     * @param $replace | The new string that will be inserted
     * @returns {*}
     * @private
     */
    $functions.push('_Replace');
    var _Replace = function ($find, $replace, $string)
    {
        "use strict";

        if (typeof $string === 'string' && typeof $find === 'string' && typeof $replace === 'string')
        {
            $find = $find.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
            var $regexp = new RegExp($find, 'g');
            $string = $string.replace($regexp, $replace);
        }

        return $string;
    };

    /**
     * Status on Cmd functions: never_existed, emerging, normal, deprecated, retired
     * @param string $functionName
     * @return string
     */
    $functions.push('_GetCmdFunctionStatus');
    var _GetCmdFunctionStatus = function ($functionName)
    {
        let $functions = _GetCmdFunctions();
        const $functionsBase = _GetCmdFunctionsBase();
        $functions = _Merge($functionsBase, $functions);

        let $status = 'never_existed';
        if (_IsSet($functions[$functionName]) === 'true') {
            $status = $functions[$functionName];
        }

        const $statuses = {
            'never_existed': {
                'status': 'never_existed',
                'information': 'Function "{this function}" have never existed in plugin {this plugin}. Or is it just missing in _GetCmdFunctions?',
                'value': 0
            },
            'emerging': {
                'status': 'emerging',
                'information': 'New feature in {this plugin} that probably will be changed during this major version. In the next major version, function "{this function}" will either be normal or removed',
                'value': 1
            },
            'normal': {
                'status': 'normal',
                'information': 'You can use function "{this function}" in plugin {this plugin}. It will work in this major version. It will get bug fixes but will work as normal',
                'value': 2
            },
            'deprecated': {
                'status': 'deprecated',
                'information': 'You can use function "{this function}" in plugin {this plugin} but it will be removed in the next major version',
                'value': 1
            },
            'removed': {
                'status': 'removed',
                'information': 'Function "{this function}" have existed in plugin {this plugin} but became deprecated and have now been removed in this major version',
                'value': 0
            }
        };

        let $response = {
            'status': $status,
            'information': 'This is an unknown status. I will not try to call the function name',
            'value': 0
        };

        if (_IsSet($statuses[$status]) === 'true') {
            $response = $statuses[$status];
            $response.information = $response.information.replace('{this function}', $functionName);

            const $pluginName = _GetClassName();
            $response.information = $response.information.replace('{this plugin}', $pluginName);
        }

        $response.function_name = $functionName;

        return $response;
    };

    /**
     * Get the class name in this plugin
     * @returns {*}
     * @private
     */
    $functions.push('_GetClassName');
    var _GetClassName = function ()
    {
        if (typeof _Version !== 'function') {
            return '';
        }

        const $version = _Version();
        if (typeof $version.class_name === 'undefined') {
            return '';
        }

        return $version.class_name;
    };

    /**
     * Get name of the plugin that sent the message
     * Used in cmd(). Useless for you to use. Will give you an empty answer.
     * @param $in
     * @returns {{answer: string, message: string, from_plugin: ({}|*)}}
     * @private
     */
    $functions.push('_GetCallerPluginName');
    var _GetCallerPluginName = function ($in)
    {
        var _GetLastInArray = function ($dataArray) {
            if (Array.isArray($dataArray)) {
                if ($dataArray.length > 0) {
                    return $dataArray[$dataArray.length - 1];
                }
            }
            return null;
        };

        var $fromPlugin = {}, $lastInCallStack,
            $default = {
                'callstack': []
            };
        $in = _Default($default, $in);

        $lastInCallStack = _GetLastInArray($in.callstack);
        if (_Empty($lastInCallStack) === 'false') {
            if (_IsSet($lastInCallStack.to) === 'true') {
                $fromPlugin = $lastInCallStack.to;
            }
        }

        $default = {
            'node': '',
            'plugin': '',
            'function': ''
        };
        $fromPlugin = _Default($default, $fromPlugin);

        return {
            'answer': 'true',
            'message': 'Message come from this plugin',
            'from_plugin': $fromPlugin
        };
    };

    // *****************************************************************************
    // * The only public functions, do not add your own, not even in your plugin
    // *****************************************************************************

    /**
     * Execute one private function in this class
     * Used by: Infohub Exchange or if you use the class outside of InfoHub.
     * Will only call function names that DO NOT start with internal_ or _
     * @version 2014-01-01
     * @since 2012-01-01
     * @author Peter Lembke
     * @return object
     */
    $functions.push('cmd');
    this.cmd = function ($in) {
        // "use strict";

        var $startTime = _MicroTime(),
            $runThisRow, $errorStack,
            $subCall, $response, $oneCallResponse,
            $status;

        const $default = {
            'to': {
                'node': 'client',
                'plugin': '',
                'function': ''
            },
            'callstack': [],
            'data': {},
            'data_back': {},
            'wait': 0.2,
            'callback_function': null
        };
        $in = _Default($default, $in);

        let $answer = 'false';
        let $message = '';

        let $out = {
            'data': {}
        };

        let $callResponse = {
            'answer': $answer,
            'message': $message
        };

        const $functionName = $in.to.function.toLowerCase();
        internal_Log({'message': 'Will call: ' + $functionName, 'function_name': 'cmd', 'object': $in, 'depth': 1});

        var callbackFunction = function($callResponse)
        {
            if (typeof $callResponse !== 'object') {
                $message = 'Function: ' + $functionName + ' did not return an object as it should. (' + typeof($callResponse) + ')';
                $callResponse = {};
            }

            internal_Log({
                'message': 'Back from: ' + $functionName,
                'function_name': $functionName,
                'object': $callResponse
            });

            $callResponse = _Merge({'func': 'ReturnCall'}, $callResponse);

            if ($callResponse.func === 'SubCall') {
                $subCall = _ByVal($callResponse);
                $subCall.original_message = $in;
                $response = internal_Cmd($subCall);
                if ($response.answer === 'false') {
                    $message = $response.message;
                }
                $out = $response.sub_call_data;
            }

            if ($callResponse.func === 'ReturnCall') {
                $response = internal_Cmd({
                    'func': 'ReturnCall',
                    'variables': $callResponse,
                    'original_message': $in
                });
                if ($response.answer === 'false') {
                    $message = $response.message;
                }
                $out = $response.return_call_data;
            }

            if ($message !== '') {
                $out.data.message = $message;
                $callResponse.message = $message;
                internal_Log({
                    'message': $message,
                    'function_name': $functionName,
                    'object': {
                        'in': $in,
                        'out': $out
                    }
                });
            }

            $out.execution_time = _MicroTime() - $startTime;
            internal_Log({
                'message': 'Leaving cmd()',
                'function_name': $functionName,
                'start_time': $startTime,
                'depth': -1,
                'execution_time': $out.execution_time
            });

            var sleep = function ($milliseconds) {
                $milliseconds += new Date().getTime();
                while (new Date() < $milliseconds) {
                }
            };

            if (_IsSet($status) === 'true') {
                $out.function_status = $status;

                if ($status.value === 1) {
                    sleep($out.execution_time); // There is a cost in using emerging and deprecated functions.
                }
            }

            $out.from = _ByVal($in.to); // Add the message origin

            const $iWantAShortTail = _GetData({
                'name': 'data/i_want_a_short_tail',
                'default': 'false',
                'data': $out
            });

            if ($iWantAShortTail === 'true')
            {
                delete $out.data.i_want_a_short_tail;
                while ($out.callstack.length > 1) {
                    $out.callstack.shift();
                }
            }

            if (typeof $in.callback_function === 'function') {
                $in.callback_function($out); // Call the callback function
                return {};
            }

            return $out;

        };

        leave:
        {
            if ($functionName === 'cmd' || $functionName.indexOf('internal_') === 0 || $functionName.indexOf('_') === 0) {
                $message = 'function name: ' + $functionName + ', are not allowed to be called';
                $callResponse.message = $message;
                internal_Log({'level': 'error', 'message': $message });
                break leave;
            }

            $status = _GetCmdFunctionStatus($functionName);
            if ($status.value < 1) {
                $message = '(' + $status.status + ') ' + $status.information;
                $callResponse.message = $message;
                internal_Log({'level': 'error', 'message': $message });
                break leave;
            }

            $response = _GetCallerPluginName($in);
            $in.data.from_plugin = $response.from_plugin;

            if (_MethodExists($functionName) === false) {
                $message = 'function name: ' + $functionName + ', does not exist or are not allowed to be called';
                $callResponse.message = $message;
                internal_Log({'level': 'error', 'message': $message });
                break leave;
            }

            $in.data.callback_function = callbackFunction;

            internal_Log({'message': 'Calling: ' + $functionName, 'function_name': $functionName});
            try {
                $firstDefault = null;
                $runThisRow = '$callResponse = ' + $functionName + "($in.data)";
                eval($runThisRow);
            } catch ($err) {
                $message = 'Can not call: ' + $functionName + ', error:' + $err.message;
                $errorStack = $err.stack.split("\n");
                internal_Log({
                    'level': 'error',
                    'message': $message,
                    'function_name': $functionName,
                    'object': $errorStack
                });
                $callResponse.message = $message;
            }

        }

        if (_Empty($callResponse) === 'false')
        {
            let $messages = _GetData({
                'name': 'messages',
                'default': [],
                'data': $callResponse
            });

            if ($messages.length > 0)
            {
                while ($messages.length > 0)
                {
                    $oneCallResponse = $messages.pop();
                    if (_IsSet($oneCallResponse.data) === 'true') {
                        $oneCallResponse.data.i_want_a_short_tail = 'true';
                        callbackFunction($oneCallResponse);
                    }
                }
                delete $callResponse.messages;
            }

            let $iWantAShortTail = _GetData({
                'name': 'data/i_want_a_short_tail',
                'default': 'false',
                'data': $callResponse
            });

            if ($iWantAShortTail === 'true') {
                $callResponse.data.i_want_a_short_tail = 'false';
            }

            return callbackFunction($callResponse);

        } else {
            if (typeof $callResponse === "undefined") {
                // If you use the callback then you must return an empty object {}
                window.alert('Function do not return anything. ' + $in.to.plugin + '.' + $functionName);
            }
        }

        return {};
    };

    /**
     * Only used in the test program for testing purposes only
     * @param $functionName | Name of the plugin to call
     * @param $in | IN data object to use in the called function
     * @returns {*}
     * @version 2015-01-29
     * @since 2014-09-06
     * @author Peter Lembke
     */
    this.test = function ($functionName, $in) {
        // "use strict";
        var $callResponse = {},
            $errorMessage = '', $runThisRow, $answer;

        leave:
        {
            if (typeof $functionName !== 'string') {
                break leave;
            }
            if ($in === 'file') {
                $in = {};
            }

            $firstDefault = null;
            $GLOBALS.infohub_error_message = '';


            try {
                if ($functionName === 'cmd') {
                    $callResponse = this.cmd($in);
                } else {
                    $runThisRow = '$callResponse =' + $functionName + "($in)";
                    eval($runThisRow);
                }
            } catch ($e) {
                $errorMessage = $e.message;
            }

            if (_Empty($errorMessage) === 'true') {
                if (_Empty($GLOBALS.infohub_error_message) === 'false') {
                    $errorMessage = $GLOBALS.infohub_error_message;
                }
            }

        }

        $answer = {
            'in': $in,
            'default': $firstDefault,
            'out': $callResponse,
            'error_message': $errorMessage
        };
        return $answer;
    };

    // ***********************************************************
    // * Functions you only can reach with cmd(), add more in your class
    // * Observe function names are lower_case
    // ***********************************************************

    /**
     * Return version date of plugin class and base class.
     * https://developer.mozilla.org/en-US/docs/Web/API/Navigator
     * @version 2015-05-10
     * @since 2011-09-10
     * @author Peter Lembke
     * @param $in
     * @returns {boolean}
     */
    $functions.push("version");
    var version = function ($in) {
        "use strict";
        var $default = {
                'date': '',
                'version': '',
                'checksum': '',
                'class_name': '',
                'note': '',
                'license_name': '',
                'title': '',
                'icon': '',
                'status': ''
            },

            $versionPlugin = _Default($default, _Version()),
            $versionBase = _Default($default, _VersionBase()),

            $navigator = window.navigator,
            $clientInfo = {
                'browser_name': $navigator.appName,
                'browser_version': $navigator.appVersion,
                'browser_language': $navigator.language,
                // 'languages_preferred': navigator.languages,
                // 'language_preferred': navigator.languages ? navigator.languages[0] : (navigator.language || navigator.userLanguage),
                'user_agent': $navigator.userAgent
            };

        return {
            'answer': 'true',
            'message': 'Here are the data',
            'plugin': $versionPlugin,
            'base': $versionBase,
            'client_info': $clientInfo,
            'version_code': $versionPlugin.checksum + $versionBase.checksum
        };
    };

    /**
     * Return names of all methods in this class that you can call from cmd()
     * @version 2014-01-01
     * @since 2012-04-01
     * @author Peter Lembke
     * @returns {boolean}
     */
    $functions.push("function_names");
    var function_names = function ($in) {
        "use strict";
        var $answer = {
            'answer': 'true',
            'message': 'All function_names in this plugin',
            'data': $functions
        };
        return $answer;
    };

    // ***********************************************************
    // * Internal function that you only can reach from internal_Cmd
    // * Add more internal_ functions in your class.
    // * Function name are in internal_CamelCase
    // * An internal function get all its data from $in
    // * An internal function give its answer as an object
    // ***********************************************************

    /**
     * Exectute a private internal_ function in this class
     * Will only call function names that start with internal_
     * @version 2013-09-15
     * @since   2013-09-15
     * @author  Peter Lembke
     * @param $in | all incoming variables
     * @return object
     */
    $functions.push("internal_Cmd");
    var internal_Cmd = function ($in) {
        // "use strict"; // Do not use strict with eval()

        var $startTime = _MicroTime(),
            $message, $functionName, $runThisRow, $callResponse, $errorStack,
            $default = {'func': ''};
        $in = _Merge($default, $in);

        tests:
        {
            $message = '';
            $callResponse = {};
            $functionName = 'internal_' + $in.func;
            internal_Log({
                'message': 'Will call: ' + $functionName,
                'function_name': $functionName,
                'object': $in,
                'depth': 1,
                'start_time': $startTime
            });

            if (_MethodExists($functionName) === false) {
                $message = 'function name: ' + $functionName + ', does not exist or are not allowed to be called';
                break tests;
            }

            internal_Log({
                'message': 'Calling: ' + $functionName,
                'function_name': $functionName,
                'object': $in
            });

            try {
                $runThisRow = '$callResponse = ' + $functionName + "($in)";
                $firstDefault = null;
                eval($runThisRow);
            } catch ($err) {
                $errorStack = $err.stack.split("\n");
                $message = 'Can not call: ' + $functionName + ', error: ' + $err.message;
                internal_Log({
                    'level': 'error',
                    'message': $message,
                    'function_name': $functionName,
                    'object': $errorStack
                });
                $callResponse = {
                    'answer': 'false',
                    'message': $message
                };
            }
            internal_Log({
                'message': 'Back from: ' + $functionName,
                'function_name': $functionName,
                'object': $callResponse
            });

            if (typeof $callResponse !== 'object') {
                $message = 'Function ' + $functionName + ' did not return an object as it should (' + typeof($callResponse) + ')';
                break tests;
            }

            if (typeof $callResponse.answer === 'undefined') {
                $message = 'Function ' + $functionName + ' did not return object.answer as it should.';
                break tests;
            }

            if (typeof $callResponse.message === 'undefined') {
                $message = 'Function ' + $functionName + ' did not return object.message as it should.';
                break tests;
            }

            if ($callResponse.answer === 'false') {
                $message = $callResponse.message;
                break tests;
            }

        } // tests

        if ($message !== '') {
            $callResponse.answer = 'false';
            $callResponse.message = $message;
            internal_Log({
                'level': 'error',
                'message': 'Got error from: ' + $functionName + ', error: ' + $message,
                'function_name': $functionName,
                'object': {'in': $in, 'out': $callResponse }
            });
        }

        $callResponse.execution_time = _MicroTime() - $startTime;
        internal_Log({
            'message': 'Leaving internal_Cmd()',
            'function_name': $functionName,
            'start_time': $startTime,
            'execution_time': $callResponse.execution_time,
            'depth': -1
        });
        return $callResponse;
    };

    /**
     * Write message to console
     * example: internal_Log({'message': 'I want to log this'});
     * used by: you
     * @version 2016-09-01
     * @since 2013-04-25
     * @author Peter Lembke
     * @param $in
     * @return object
     * @uses level | string | log, info, warn, error
     * @uses message | string | Text row to show in the console
     * @uses object | if you want to show this object in the console
     * @uses depth | integer | 1=create group, 0=log, -1=close group
     * @uses start_time | integer | important when you create a new group
     */
    $functions.push("internal_Log");
    var internal_Log = function ($in) {
        "use strict";

        if (!window.console) {
            return {
                'answer': 'false',
                'message': 'Have not written the item to the console because console do not exist'
            };
        }

        var $message, $toScreen = '', $errorBox,
            $default = {
                'time_stamp': _TimeStamp(),
                'node_name': 'client',
                'plugin_name': _GetClassName(),
                'function_name': '',
                'message': '',
                'level': 'log',
                'object': {},
                'depth': 0,
                'get_backtrace': 'false',
                'execution_time': 0.0
            };
        $in = _Default($default, $in);

        if (_IsSet($GLOBALS.infohub_minimum_error_level) === 'false') {
            return {'answer': 'true', 'message': 'Did NOT write the log message to the console because infohub_minimum_error_level is not set' };
        }

        if ($in.level !== 'error') {
            if ($GLOBALS.infohub_minimum_error_level === 'error') {
                return {'answer': 'true', 'message': 'Did NOT write the log message to the console because the infohub_minimum_error_level only logs errors' };
            }
        }

        if ($in.level === 'error' && $in.get_backtrace === 'true') {
            $in.backtrace = new Error().stack.split("\n");
        }
        delete $in.get_backtrace;

        if ($in.execution_time === 0.0) {
            delete $in.execution_time;
        }

        if (typeof window.errorIndicator === 'undefined') {
            window.errorIndicator = '';
        }

        if ($in.level === 'error') {
            window.errorIndicator = window.errorIndicator + '*';
        }

        $message = window.errorIndicator + " " + $in.time_stamp + ', ' + $in.node_name + '.' + $in.plugin_name + '.' + $in.function_name + ', ' + $in.message;

        if ($in.depth === 1) {
            window.console.groupCollapsed($message);
        }

        if ($in.depth === 0) {
            if ($in.level === 'log') {
                window.console.log($message);
            }
            if ($in.level === 'info') {
                window.console.info($message);
            }
            if ($in.level === 'warn') {
                window.console.warn($message);
            }
            if ($in.level === 'error') {
                window.console.error($message);
                $toScreen = $message;
            }
            if (Object.getOwnPropertyNames($in.object).length > 0) {
                window.console.dir($in.object);
                if ($in.level === 'error') {
                    $toScreen = $toScreen + '<br><pre>' + JSON.stringify($in.object, null, '\t') + '</pre>';
                }
            }

            if ($toScreen !== '') {
                $errorBox = window.document.getElementById('error');
                if ($errorBox !== null) {
                    $errorBox.innerHTML = $toScreen + '<br>' + $errorBox.innerHTML;
                }
            }

        }

        if ($in.depth === -1) {
            if ($in.execution_time > 0.0) {
                $message = 'Execution time: ' + $in.execution_time + ' seconds';
                if ($in.execution_time <= 0.2) {
                    window.console.info($message);
                } else {
                    window.console.warn($message);
                }
            }
            window.console.groupEnd();
        }

        return {
            'answer': 'true',
            'message': 'Wrote log message to the console'
        };
    };

    /**
     * Returns a sub call message. Used by cmd(), useless for you.
     * @version 2016-01-06
     * @since   2013-11-21
     * @author  Peter Lembke
     * @param $in
     * @uses data_back | object | Variables with data we want back untouched (OPTIONAL)
     * @uses data_request | array | Array with Data variables we want back (OPTIONAL) If omitted you get what the function give you
     * @return object
     */
    $functions.push("internal_SubCall");
    var internal_SubCall = function ($in) {
        "use strict";
        var $out, $callStackAdd,
            $default = {
                'func': 'SubCall',
                'to': {'node': 'client', 'plugin': 'exchange', 'function': 'default'}, // Where to send this message
                'data': {}, // The data you want to be available to the sub-function you call.
                'data_request': [], // Array with variable names you want from the sub-function. Leave blank to get everything.
                'data_back': {}, // Return these variables untouched in the returning message. (OPTIONAL)
                'wait': 10.0, // Seconds you can wait before this message really need to be sent.
                'track': 'false', // 'true' lets Cmd add an array of where this message have been.
                'original_message': {} // Original message that came into cmd().
            };
        $in = _Default($default, $in);

        $out = {
            'to': $in.to,
            'data': $in.data,
            'data_back': $in.data_back,
            'wait': Math.abs($in.wait),
            'callstack': []
        };

        if ($in.track === 'true') {
            $out.track = {};
        }

        if (_IsSet($in.original_message.callstack) === 'true') {
            $out.callstack = $in.original_message.callstack;
            $callStackAdd = {
                'to': $in.original_message.to,
                'data_back': $in.data_back,
                'data_request': $in.data_request
            };
            $out.callstack.push(_ByVal($callStackAdd));
        }
        return {
            'answer': 'true',
            'message': 'Here are a sub call message',
            'sub_call_data': _ByVal($out)
        };
    };

    /**
     * Give you a return call message. Used by cmd(), useless for you.
     * @version 2015-01-18
     * @since   2013-11-22
     * @author  Peter Lembke
     * @param $in
     * @return object
     * @uses data_back | object | Variables with data we want back untouched (OPTIONAL)
     * @uses data_request | array | Array with Data variables we want back (OPTIONAL) If omitted you get what the function give you
     */
    $functions.push("internal_ReturnCall");
    var internal_ReturnCall = function ($in) {
        "use strict";
        var $default = {
            'func': 'ReturnCall',
            'variables': {},
            'original_message': {}
        };
        $in = _Default($default, $in);

        var $defaultMessageFromCallStack = {
                'to': {},
                'data_back': {},
                'data_request': []
            },
            $messageFromCallStack = {},
            $dataSend = {},
            $variableName = '', $length, $i, $out;

        if ($in.original_message.callstack.length > 0) {
            // pop() moves the last value of the array to your variable
            $messageFromCallStack = $in.original_message.callstack.pop();
        }
        $messageFromCallStack = _Default($defaultMessageFromCallStack, $messageFromCallStack);

        $length = $messageFromCallStack.data_request.length;
        if ($length > 0) {
            for ($i = 0; $i < $length; $i++) {
                $variableName = $messageFromCallStack.data_request[$i];
                if ($in.variables.hasOwnProperty($variableName)) {
                    $dataSend[$variableName] = $in.variables[$variableName];
                }
            }
        } else {
            $dataSend = _ByVal($in.variables);
        }

        // 'data_back' will give you the data_back untouched. Just as we also do with the 'response' below.
        // This is for being able to reduce the $default parameters to just the required ones.
        $messageFromCallStack.data_back.data_back = _ByVal($messageFromCallStack.data_back);

        // 'response' are for more advanced responses that can not be handled well with the normal array_merge below.
        // Example: Response from two subcalls where the variable name is the same but have different data type.
        // You validate the 'response' in the step that handle the subcall response.
        $messageFromCallStack.data_back.response = _ByVal($dataSend);

        $out = {
            'to': $messageFromCallStack.to, // To Node
            'callstack': $in.original_message.callstack, // Rest of the callstack
            'data': _Merge($dataSend, $messageFromCallStack.data_back) // Kept for legacy and for simplicity
        };
        return {
            'answer': 'true',
            'message': 'Here you get a return message',
            'return_call_data': _ByVal($out)
        };
    };