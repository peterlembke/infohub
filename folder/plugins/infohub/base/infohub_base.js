/*jshint esversion: 6 */
/*jshint forin: false */

let $functions = [], // Array with all function names
    $firstDefault = null, // Used by cmd() to get the default values for a cmd function
    $warnOnce = {}; // Warn about no return statement once in each plugin.function

$functions.push('_VersionBase');
const _VersionBase = function() {
    return {
        'date': '2020-01-24',
        'since': '2016-01-06',
        'version': '1.0.0',
        'checksum': '{{base_checksum}}',
        'class_name': 'infohub_base',
        'note': 'Parent class in ALL plugins. Manages the traffic in the plugin',
        'SPDX-License-Identifier': 'GPL-3.0-or-later',
        'user_role': '',
    };
};

$functions.push('_GetCmdFunctionsBase');
const _GetCmdFunctionsBase = function($childList = {}) {
    const $list = {
        'version': 'normal',
        'function_names': 'normal',
        'ping': 'normal',
    };

    const $newList = _Merge($childList, $list);

    return $newList;
};

// ***********************************************************
// * The private functions, add your own in your plugin
// * These functions can be used directly in your functions.
// * Name: _CamelCaseData
// ***********************************************************

$functions.push('_Default');
/**
 * Make sure you get all variables you expect, at least with default values, and the right datatype.
 * example: $in = _Default($default,$in);
 * Used by: EVERY function to let go of all references. We MUST be sure that we can modify the incoming data
 * without affecting the array on the outside of the function.
 * @version 2015-01-29
 * @since   2013-09-05
 * @author  Peter Lembke
 * @param {object} $default - You want $in to have this structure and data types
 * @param {object} $in - This is the object we want to look like the $default
 * @return {object} New object
 */
const _Default = function($default = {}, $in = {}) {
    if ($firstDefault === null) {
        $firstDefault = $default;
    }

    if (Array.isArray($in)) {
        $in = {};
    }

    const $defaultType = typeof ($default);
    const $inType = typeof ($in);

    if ($defaultType !== 'object' && $inType !== 'object') {
        return {};
    }

    if ($defaultType !== 'object' && $inType === 'object') {
        return _ByVal($in);
    }

    if ($defaultType === 'object' && $inType !== 'object') {
        return _ByVal($default);
    }

    let $callbackFunction = '';
    if (typeof ($in.callback_function) === 'function') {
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

    // Delete keys that are not in the default object
    // If wrong data type then copy the data key value from default
    for (let $key in $answer) {
        if ($answer.hasOwnProperty($key) === false) {
            continue;
        }

        const $defaultKeyType = typeof ($default[$key]);
        if ($defaultKeyType === 'undefined') {
            delete $answer[$key];
            continue;
        }
        if ($default[$key] === null && $answer[$key] === null) {
            $answer[$key] = '';
            continue;
        }

        const $answerKeyType = typeof ($answer[$key]);
        if ($answerKeyType !== $defaultKeyType) {
            if ($default[$key] === null) {
                continue;
            }
            $answer[$key] = $default[$key];
            if ($default[$key] !== null) {
                internal_Log({
                    'level': 'error',
                    'message': 'key:"' + $key + '", have wrong data type: ' +
                        $answerKeyType + ', expected data type: ' +
                        $defaultKeyType,
                    'function_name': '_Default',
                    'get_backtrace': 'true',
                    'object': {'in': $in, 'default': $default},
                });
            }
            continue;
        }
        if ($defaultKeyType !== 'object') {
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

$functions.push('_GetDataType');
/**
 * Get variable data type name in lower case
 * @example
 * const $type = _GetDataType($myVariable);
 * @param {object} $object - The object you want to get the type name for
 * @returns {string} The data type name
 * @private
 */
const _GetDataType = function($object) {
    const $dataType = ({}).toString.call($object).
        match(/\s([a-zA-Z]+)/)[1].toLowerCase();

    return $dataType;
};

$functions.push('_Merge');
/**
 * Merge two objects, everything from object2 goes on top of object1.
 * example: $in = _Merge($object1,$object2);
 * Starts with $object1 and adds all keys from $object2.
 * Used by you
 * @version 2015-01-17
 * @since   2013-09-05
 * @author  Peter Lembke
 * @param {object} $object1 - First object
 * @param {object} $object2 - Second object
 * @return {object} A combined object
 */
const _Merge = function($object1 = {}, $object2 = {}) {
    let $newObject = {};

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

$functions.push('_MergeStringData');
/**
 * Merge two objects strings, everything new from object2 or object1 are added to new object.
 * Every string that exist in both objects are glued together with object 1 firsts and object 2 second.
 * Then the string are added to new object.
 * example: $in = _MergeStringData($object1,$object2);
 * Starts with $object1 and adds all keys from $object2.
 * Used by you
 * @version 2021-01-01
 * @since   2021-01-01
 * @author  Peter Lembke
 * @param {object} $object1 - First object
 * @param {object} $object2 - Second object
 * @return {object} A combined object
 */
const _MergeStringData = function($object1 = {}, $object2 = {}) {
    let $newObject = {};

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
                let $stringValue = $object2[$key];
                if (_IsSet($object1[$key]) === 'true') {
                    $stringValue = $object1[$key] + $object2[$key];
                }
                $newObject[$key] = $stringValue;
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
 * @param {object} $object1 - Object to delete keys from
 * @param {object} $object2 - What keys to delete in $object1
 * @return {object} New object
 */
$functions.push('_Delete');
const _Delete = function($object1 = {}, $object2 = {}) {
    let $newObject = _ByVal($object1);

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
 * @param {object } $object - The data object you want a copy of
 * @return {object} New object that is a true copy of the first data object
 */
$functions.push('_ByVal');
const _ByVal = function($object = {}) {
    if (!($object instanceof Object)) {
        return {};
    }

    return _MiniClone($object); // _MiniClone is better/quicker than _Clone and JSON.parse
};

/**
 * Object deep clone
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Structured_clone_algorithm#Another_way_deep_copy%E2%80%8E
 * @see https://github.com/whatwg/html/issues/793
 * @see https://www.digitalocean.com/community/tutorials/copying-objects-in-javascript
 * @param {object} $objectToBeCloned - A data object
 * @returns {*}
 * @private
 */
$functions.push('_MiniClone');
const _MiniClone = function($objectToBeCloned = {}) {
    if (($objectToBeCloned instanceof Object) === false) {
        return $objectToBeCloned;
    }

    let Constructor = $objectToBeCloned.constructor,
        objectClone = new Constructor();

    for (let $property in $objectToBeCloned) {
        if ($objectToBeCloned.hasOwnProperty($property) === false) {
            continue;
        }
        if (typeof $objectToBeCloned[$property] !== 'object') {
            objectClone[$property] = $objectToBeCloned[$property];
            continue;
        }
        objectClone[$property] = _MiniClone($objectToBeCloned[$property]);
    }

    return objectClone;
};

/**
 * Return 'true' if the named method exist in this class
 * Used by cmd, internal_Cmd
 * @param {string} $functionName - The name of the function
 * @returns {string} "true" or "false"
 * @private
 */
$functions.push('_MethodExists');
const _MethodExists = function($functionName = '') {
    const _ValidName = function($name) {
        const $myRegExp = /^([a-zA-Z0-9_]+)$/;
        return $myRegExp.test($name);
    };

    if (typeof $functionName !== 'string') {
        return 'false';
    }

    if ($functions.indexOf($functionName) > -1) {
        return 'true';
    }

    if (_ValidName($functionName) === false) {
        return 'false';
    }

    try {
        if (typeof eval($functionName) === 'function') {
            return 'true';
        }
    } catch ($err) {
        return 'false';
    }

    return 'false';
};

/**
 * Return current time stamp as a string in the format "yyyy-mm-dd hh:mm:ss"
 * Give 'c' to also get the time zone offset.
 * @param {string} $typeOfTimeStamp - Give a 'c' to get the time stamp with time zone
 * @return {string} Return current time stamp as a string in the format "yyyy-mm-dd hh:mm:ss"
 */
$functions.push('_TimeStamp');
const _TimeStamp = function($typeOfTimeStamp = '') {
    const $date = new Date(),
        yyyy = $date.getFullYear().toString(),
        mm = ('0' + ($date.getMonth() + 1).toString()).slice(-2), // getMonth() is zero-based
        dd = ('0' + $date.getDate().toString()).slice(-2),
        hh = ('0' + $date.getHours().toString()).slice(-2),
        min = ('0' + $date.getMinutes().toString()).slice(-2),
        sec = ('0' + $date.getSeconds().toString()).slice(-2);

    let offsetTotal, offsetHours, offsetMinutes, offsetSign = '-',
        offsetResult = '+01:00', $result;

    if ($typeOfTimeStamp === 'c') {
        offsetTotal = $date.getTimezoneOffset();
        if (offsetTotal < 0) {
            offsetSign = '+'; // Yes, -60 will become +01:00
            offsetTotal = Math.abs(offsetTotal);
        }
        offsetHours = Math.floor(offsetTotal / 60);
        offsetMinutes = offsetTotal - (offsetHours * 60);
        offsetResult = offsetSign + ('00' + offsetHours).slice(-2) + ':' +
            ('00' + offsetMinutes).slice(-2);
        $result = yyyy + '-' + mm + '-' + dd + 'T' + hh + ':' + min + ':' +
            sec + offsetResult;
    } else {
        $result = yyyy + '-' + mm + '-' + dd + ' ' + hh + ':' + min + ':' + sec;
    }

    return $result;
};

/**
 * Return current number of seconds since EPOC (1970-01-01 00:00:00)
 * Corresponds to the PHP function microtime(true)
 * @returns {number} as seconds and fraction of seconds
 * @private
 */
$functions.push('_MicroTime');
const _MicroTime = function() {
    let $timestamp = (new Date()).getTime() / 1000.0;

    return $timestamp;
};

/**
 * Wrapper so it is easier to change the places where json is used.
 * @param {object} $dataObject - The data object you want a JSON string for
 * @returns {string} The JSON string
 * @private
 */
$functions.push('_JsonEncode');
const _JsonEncode = function($dataObject = {}) {
    const $space = '    '; // Pretty print with space
    const $replacer = null;

    const $JSONString = JSON.stringify($dataObject, $replacer, $space); // Pretty print

    return $JSONString;
};

/**
 * Wrapper so it is easier to change the places where json is used.
 * @param {string} $JsonString - The JSON string
 * @returns {object} A data object
 * @private
 */
$functions.push('_JsonDecode');
const _JsonDecode = function($JsonString = '') {
    if (_GetDataType($JsonString) !== 'string') {
        return $JsonString; // Keep. Or else you get no icons in Launcher
    }

    if ($JsonString.substring(0, 1) !== '{') {
        return {};
    }

    const $dataObject = JSON.parse($JsonString);

    return $dataObject;
};

/**
 * Convert from escaped string to UTF8 string
 * @param {string} $escapedString - An escaped string
 * @returns {string} UTF8 string
 * @private
 */
$functions.push('_EncodeUtf8');
const _EncodeUtf8 = function($escapedString = '') {
    const $utf8DataString = unescape(encodeURIComponent($escapedString));

    return $utf8DataString;
};

/**
 * Convert from UTF8 string to escaped string
 * @param {string} $utf8DataString - UTF8 data string
 * @returns {string} Escaped string
 * @private
 */
$functions.push('_DecodeUtf8');
const _DecodeUtf8 = function($utf8DataString = '') {
    const $escapedString = decodeURIComponent(escape($utf8DataString));

    return $escapedString;
};

/**
 * Read value from any data collection and get a result.
 * If the data do not exist or are the wrong data type then you get the default value.
 * Name can be 'just_a_name' or 'some/deep/level/data'
 * @param $in
 * @returns {{}|*}
 * @private
 */
$functions.push('_GetData');
const _GetData = function($in = {}) {
    const $default = {
        'name': '', // example: "response/data/checksum"
        'default': null, // example: ""
        'data': {}, // an object with data where you want to pull out a part of it
        'split': '/', // If name naturally contain / then use pipe | instead
    };
    $in = _Default($default, $in);

    const $nameArray = $in.name.split($in.split);
    const $nameCount = $nameArray.length;
    let $answer = _ByVal($in.data);

    for (let $nameIndex = 0; $nameIndex < $nameCount; $nameIndex++) {
        if (typeof $answer[$nameArray[$nameIndex]] !== 'undefined') {
            $answer = $answer[$nameArray[$nameIndex]];
        } else {
            return $in.default;
        }
    }

    /* @todo Why have I left this? I have that on server infohub_base.php
    if (_GetDataType($answer) !== _GetDataType($in.default)) {
        $answer = $in['default'];
    }

    if (_GetDataType($answer) === 'object') {
        $answer = _Default($in.default, $answer);
    }
    */

    return $answer;
};

/**
 * Return first letter in each word in upper case
 * Note that this is NOT camelCase
 * From: http://locutus.io/php/ucwords/
 * @param $string
 * @returns {string}
 * @private
 */
$functions.push('_UcWords');
const _UcWords = function($string = '') {
    $string = $string.replace(/_/g, ' ');

    $string = ($string + '').replace(
        /^([a-z\u00E0-\u00FC])|\s+([a-z\u00E0-\u00FC])/g, function($1) {
            return $1.toUpperCase();
        });

    $string = $string.replace(/ /g, '');

    return $string;
};

/**
 * Return first letter in first word in upper case
 * @param $string
 * @returns {string}
 * @private
 */
$functions.push('_UcFirst');
const _UcFirst = function($string = '') {
    let $result = $string[0].toUpperCase() + $string.slice(1);

    return $result;
};

/**
 * same as sprintf in PHP. Substitute %s with another string.
 * @param {string} $rowString
 * @param {array} $substituteArray
 * @returns {string}
 * @private
 */
$functions.push('_SprintF');
const _SprintF = function($rowString = '', $substituteArray = []) {
    let $answer = '';
    const $parts = $rowString.split('%s');
    const $numberOfParts = $parts.length;

    for (let $partNumber = 0; $partNumber < $numberOfParts; $partNumber++) {
        $answer = $answer + $parts[$partNumber];

        if (typeof $substituteArray[$partNumber] !== 'undefined') {
            $answer = $answer + $substituteArray[$partNumber];
        }
    }

    return $answer;
};

/**
 * Takes the first found key data from the object and gives it to you, removing it from the object.
 * Used in loops when sending one item at the time in a subcall.
 * @param $myObject
 * @returns {{data: *, key: string, object: {}}|{data: string, key: string, object: {}}}
 * @private
 */
$functions.push('_Pop');
const _Pop = function($myObject = {}) {
    $myObject = _ByVal($myObject);

    for (let $key in $myObject) {
        if ($myObject.hasOwnProperty($key) === false) {
            continue;
        }

        const $data = $myObject[$key];
        delete $myObject[$key];
        return {
            'key': $key,
            'data': $data,
            'object': $myObject,
        };
    }

    return {
        'key': '',
        'data': '',
        'object': {},
    };
};

/**
 * Create the subCall array to return to cmd.
 * @param {object} $in
 * @returns {*}
 * @private
 */
$functions.push('_SubCall');
const _SubCall = function($in = {}) {
    const $default = {
        'func': 'SubCall',
        'to': {'node': '', 'plugin': '', 'function': ''},
        'data': {},
        'data_back': {},
        'messages': [],
        'track': 'false',
        'wait': 0.2,
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
const _Count = function($object) {
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
 * @returns {string} "true" or "false"
 * @private
 */
$functions.push('_Empty');
const _Empty = function($object) {
    if (typeof $object === 'undefined' || $object === null) {
        return 'true';
    }

    if (Array.isArray($object) === true && $object.length === 0) {
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
 * My definition of a variable that has a stored value
 * @param $object
 * @returns {string} "true" or "false"
 * @private
 */
$functions.push('_Full');
const _Full = function($object) {
    if (_Empty($object) === 'true') {
        return 'false';
    }

    return 'true';
};

/**
 * Check if a variable is declared.
 * @returns {string} "true" or "false"
 * @private
 */
$functions.push('_IsSet');
const _IsSet = function() {
    const $arguments = arguments;
    let $undefined;

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
 * @param {string} $string - The string you want to modify
 * @param {string} $find - The sub string you want to substitute
 * @param {string} $replace - The new string that will be inserted
 * @returns {string}
 * @private
 */
$functions.push('_Replace');
const _Replace = function($find = '', $replace = '', $string = '') {
    if (typeof $string === 'string' && typeof $find === 'string' &&
        typeof $replace === 'string') {
        $find = $find.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, '\\$1');
        const $regexp = new RegExp($find, 'g');
        $string = $string.replace($regexp, $replace);
    }

    return $string;
};

/**
 * Turns an array into a lookup table where the data becomes the key
 * and the data is set from $value.
 * @param {array} $array - The array data
 * @param {int} $value - Value we want as data
 * @returns {object}
 * @private
 */
$functions.push('_CreateLookupTable');
const _CreateLookupTable = function($array = [], $value = 1) {
    let $lookup = {};
    let $dataItem = '';
    for (let $arrayIndex in $array) {
        if ($array.hasOwnProperty($arrayIndex) === false) {
            continue;
        }
        $dataItem = $array[$arrayIndex];
        $lookup[$dataItem] = $value;
    }

    return $lookup;
};

$functions.push('_Translate');
/**
 * Translate - Find a translation in a class global object
 * If the object is not found then the string is returned
 * If the substitution string is not found then the string is returned
 * @param $string
 * @returns {string}
 * @private
 */
const _Translate = function($string) {
    if (typeof $classTranslations !== 'object') {
        return $string.toString();
    }

    let $key = $string;
    if ($key.substr(-4,4) !== '_KEY') {
        $key = $key + '_KEY';
    }

    let $result = _GetData({
        'name': _GetClassName() + '|' + $key,
        'default': '',
        'data': $classTranslations,
        'split': '|',
    });

    if (_Full($result) === 'true') {
        return $result.toString();
    }

    return $string;
};

/**
 * Status on Cmd functions: never_existed, emerging, normal, deprecated, retired
 * @param {string} $functionName - The function name to get status for
 * @returns {{information: string, value: number, status: string}}
 * @private
 */
$functions.push('_GetCmdFunctionStatus');
const _GetCmdFunctionStatus = function($functionName = '') {
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
            'value': 0,
        },
        'emerging': {
            'status': 'emerging',
            'information': 'New feature in {this plugin} that probably will be changed during this major version. In the next major version, function "{this function}" will either be normal or removed',
            'value': 1,
        },
        'normal': {
            'status': 'normal',
            'information': 'You can use function "{this function}" in plugin {this plugin}. It will work in this major version. It will get bug fixes but will work as normal',
            'value': 2,
        },
        'deprecated': {
            'status': 'deprecated',
            'information': 'You can use function "{this function}" in plugin {this plugin} but it will be removed in the next major version',
            'value': 1,
        },
        'removed': {
            'status': 'removed',
            'information': 'Function "{this function}" have existed in plugin {this plugin} but became deprecated and have now been removed in this major version',
            'value': 0,
        },
    };

    let $response = {
        'status': $status,
        'information': 'This is an unknown status. I will not try to call the function name',
        'value': 0,
    };

    if (_IsSet($statuses[$status]) === 'true') {
        $response = $statuses[$status];
        $response.information = $response.information.replace('{this function}',
            $functionName);

        const $pluginName = _GetClassName();
        $response.information = $response.information.replace('{this plugin}',
            $pluginName);
    }

    $response.function_name = $functionName;

    return $response;
};

/**
 * Get the class name for this plugin
 * @returns {string|*}
 * @private
 */
$functions.push('_GetClassName');
const _GetClassName = function() {
    if (typeof (_Version) !== 'function') {
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
const _GetCallerPluginName = function($in = {}) {
    const _GetLastInArray = function($dataArray) {
        if (Array.isArray($dataArray)) {
            if ($dataArray.length > 0) {
                return $dataArray[$dataArray.length - 1];
            }
        }
        return null;
    };

    let $default = {
        'callstack': [],
    };
    $in = _Default($default, $in);

    let $fromPlugin = {};
    let $lastInCallStack = _GetLastInArray($in.callstack);
    if (_Empty($lastInCallStack) === 'false') {
        if (_IsSet($lastInCallStack.to) === 'true') {
            $fromPlugin = $lastInCallStack.to;
        }
    }

    $default = {
        'node': '',
        'plugin': '',
        'function': '',
    };
    $fromPlugin = _Default($default, $fromPlugin);

    return {
        'answer': 'true',
        'message': 'Message come from this plugin',
        'from_plugin': $fromPlugin,
    };
};

/**
 * Creates an alert message
 * @param $text
 * @returns {*}
 * @private
 */
$functions.push('_Alert');
const _Alert = function($text = '') {
    return _SubCall({
        'to': {
            'node': 'client',
            'plugin': 'infohub_view',
            'function': 'alert',
        },
        'data': {
            'text': $text,
        },
        'data_back': {
            'step': 'step_void', // No return message at all
        },
    });
};

/**
 * Get the file extension
 * @param $fileName
 * @returns {string}
 * @private
 */
$functions.push('_GetExtension');
const _GetExtension = function($fileName = '') {
    const $extensionStart = $fileName.lastIndexOf('.') + 1;
    const $extension = $fileName.substr($extensionStart);
    return $extension;
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
this.cmd = function($in = {}) {
    // "use strict";

    const $startTime = _MicroTime();

    const $default = {
        'to': {
            'node': 'client',
            'plugin': '',
            'function': '',
        },
        'callstack': [],
        'data': {},
        'data_back': {},
        'wait': 0.2,
        'callback_function': null,
    };
    $in = _Default($default, $in);

    let $runThisRow, $errorStack,
        $subCall, $response, $oneCallResponse,
        $status;

    let $answer = 'false';
    let $message = '';

    let $out = {
        'data': {},
    };

    let $callResponse = {
        'answer': $answer,
        'message': $message,
    };

    const $functionName = $in.to.function.toLowerCase();
    internal_Log({
        'message': 'Will call: ' + $functionName,
        'function_name': 'cmd',
        'object': $in,
        'depth': 1,
    });

    const callbackFunction = function($callResponse) {
        if (typeof $callResponse !== 'object') {
            $message = 'Function: ' + $functionName +
                ' did not return an object as it should. (' +
                typeof ($callResponse) + ')';
            $callResponse = {};
        }

        internal_Log({
            'message': 'Back from: ' + $functionName,
            'function_name': $functionName,
            'object': $callResponse,
        });

        $callResponse = _Merge({'func': 'ReturnCall'}, $callResponse);

        $out.execution_time = _MicroTime() - $startTime;
        $callResponse = _Merge({'execution_time': $out.execution_time},
            $callResponse);

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
                'original_message': $in,
            });
            if ($response.answer === 'false') {
                $message = $response.message;
            }
            $out = $response.return_call_data;
        }

        if (_IsSet($out.data.execution_time) === 'false') {
            $out.data.execution_time = 0.0;
        }

        if ($message !== '') {
            $out.data.message = $message;
            $callResponse.message = $message;
            internal_Log({
                'message': $message,
                'function_name': $functionName,
                'object': {
                    'in': $in,
                    'out': $out,
                },
            });
        }

        internal_Log({
            'message': 'Leaving cmd()',
            'function_name': $functionName,
            'start_time': $startTime,
            'depth': -1,
            'execution_time': $out.data.execution_time,
        });

        const sleep = function($milliseconds) {
            $milliseconds += new Date().getTime();
            while (new Date() < $milliseconds) {
            }
        };

        if (_IsSet($status) === 'true') {
            $out.function_status = $status;

            if ($status.value === 1) {
                sleep($out.data.execution_time); // There is a cost in using emerging and deprecated functions.
            }
        }

        $out.from = _ByVal($in.to); // Add the message origin

        const $iWantAShortTail = _GetData({
            'name': 'data/i_want_a_short_tail',
            'default': 'false',
            'data': $out,
        });

        if ($iWantAShortTail === 'true') {
            delete $out.data.i_want_a_short_tail;
            while ($out.callstack.length > 1) {
                $out.callstack.shift();
            }
        }

        const $step = _GetData({
            'name': 'data/step',
            'default': '',
            'data': $out,
        });

        if ($step === 'step_void') {
            $out = {};
        }

        if (typeof $in.callback_function === 'function') {
            $in.callback_function($out); // Call the callback function
            return {};
        }

        return $out;
    };

    leave:
    {
        if ($functionName === 'cmd' || $functionName.indexOf('internal_') ===
            0 || $functionName.indexOf('_') === 0) {
            $message = 'function name: ' + $functionName +
                ', are not allowed to be called';
            $callResponse.message = $message;
            internal_Log({'level': 'error', 'message': $message});
            break leave;
        }

        $status = _GetCmdFunctionStatus($functionName);
        if ($status.value < 1) {
            $message = '(' + $status.status + ') ' + $status.information;
            $callResponse.message = $message;
            internal_Log({'level': 'error', 'message': $message});
            break leave;
        }

        $response = _GetCallerPluginName($in);
        $in.data.from_plugin = $response.from_plugin;

        if (_MethodExists($functionName) === 'false') {
            $message = 'function name: ' + $functionName +
                ', does not exist or are not allowed to be called';
            $callResponse.message = $message;
            internal_Log({'level': 'error', 'message': $message});
            break leave;
        }

        $in.data.callback_function = callbackFunction;

        internal_Log({
            'message': 'Calling: ' + $functionName,
            'function_name': $functionName,
        });
        try {
            $firstDefault = null;
            $runThisRow = '$callResponse = ' + $functionName + '($in.data)';
            eval($runThisRow);
        } catch ($err) {
            $message = 'Can not call: ' + $functionName + ', error:' +
                $err.message;
            $errorStack = $err.stack.split('\n');
            internal_Log({
                'level': 'error',
                'message': $message,
                'function_name': $functionName,
                'object': $errorStack,
            });
            $callResponse.message = $message;
        }

    }

    if (_Empty($callResponse) === 'false') {
        let $messages = _GetData({
            'name': 'messages',
            'default': [],
            'data': $callResponse,
        });

        if ($messages.length > 0) {
            while ($messages.length > 0) {
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
            'data': $callResponse,
        });

        if ($iWantAShortTail === 'true') {
            $callResponse.data.i_want_a_short_tail = 'false';
        }

        $callResponse.first_default = $firstDefault;

        return callbackFunction($callResponse);

    } else {
        if (typeof $callResponse === 'undefined') {
            // If you use the callback then you must return an empty object {}

            // Sends an alert and avoid sending again within 5 seconds.
            // Test by commenting out a return call in your function.
            const $where = $in.to.plugin + '.' + $functionName;

            if (_IsSet($warnOnce[$where]) === 'true') {
                const $diff = _MicroTime() - $warnOnce[$where];
                if ($diff > 5.0) {
                    delete $warnOnce[$where];
                }
            }

            if (_IsSet($warnOnce[$where]) === 'false') {
                $warnOnce[$where] = _MicroTime();
                const $text = 'Function do not return anything. ' + $where;
                $callResponse = _Alert($text);
                $callResponse.data.i_want_a_short_tail = 'true';
                $callResponse.first_default = $firstDefault;
                callbackFunction($callResponse);
            }
        }
    }

    return {};
};

// ***********************************************************
// * Functions you only can reach with cmd(), add more in your class
// * Observe function names are lower_case (snake_case)
// ***********************************************************

/**
 * Return version date of plugin class and base class.
 * https://developer.mozilla.org/en-US/docs/Web/API/Navigator
 * @version 2015-05-10
 * @since 2011-09-10
 * @author Peter Lembke
 * @returns {{client_info: {browser_name: string, browser_version: string, browser_language: string, user_agent: string}, answer: string, plugin: {}, version_code: *, message: string, base: {}}}
 */
$functions.push('version');
const version = function() {
    const $default = {
            'date': '',
            'version': '',
            'checksum': '',
            'class_name': '',
            'note': '',
            'SPDX-License-Identifier': '',
            'title': '',
            'icon': '',
            'status': '',
            'web_worker': 'true',
            'core_plugin': 'false',
        },

        $versionPlugin = _Default($default, _Version()),
        $versionBase = _Default($default, _VersionBase());

    return {
        'answer': 'true',
        'message': 'Here are the data',
        'plugin': $versionPlugin,
        'base': $versionBase,
        'version_code': $versionPlugin.checksum + $versionBase.checksum,
    };
};

/**
 * Return names of all methods in this class that you can call from cmd()
 * @version 2014-01-01
 * @since 2012-04-01
 * @author Peter Lembke
 * @param {object} $in
 * @returns {{answer: string, data: [], message: string}}
 */
$functions.push('function_names');
const function_names = function($in = {}) {
    const $default = {
        'include_cmd_functions': 'true',
        'include_internal_functions': 'true',
        'include_direct_functions': 'true',
    };
    $in = _Default($default, $in);

    const $allClassMethods = $functions;
    let $classMethods = $allClassMethods;

    let $includeAll = 'true';
    if ($in.include_cmd_functions === 'false') {
        $includeAll = 'false';
    }
    if ($in.include_internal_functions === 'false') {
        $includeAll = 'false';
    }
    if ($in.include_direct_functions === 'false') {
        $includeAll = 'false';
    }

    if ($includeAll === 'false') {
        $classMethods = [];
        for (let $key in $allClassMethods) {
            const $method = $allClassMethods[$key];
            if ($method.substr(0, 'internal_'.length) === 'internal_') {
                if ($in.include_internal_functions === 'true') {
                    $classMethods.push($method);
                }
                continue;
            }
            if ($method.substr(0, '_'.length) === '_') {
                if ($in.include_direct_functions === 'true') {
                    $classMethods.push($method);
                }
                continue;
            }
            if ($in.include_cmd_functions === 'true') {
                $classMethods.push($method);
            }
        }
    }

    const $answer = {
        'answer': 'true',
        'message': 'Function names in this plugin',
        'data': $classMethods,
    };

    return $answer;
};

/**
 * Dummy function ping that return a pong
 * Useful for getting a pong or for sending messages in a sub call.
 * @version 2020-04-22
 * @since 2020-04-22
 * @author Peter Lembke
 * @returns {{answer: string, message: string}}
 */
$functions.push('ping');
const ping = function() {
    return {
        'answer': 'true',
        'message': 'pong',
    };
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
 * @param {object} $in - all incoming variables
 * @return object
 */
$functions.push('internal_Cmd');
const internal_Cmd = function($in = {}) {
    // "use strict"; // Do not use strict with eval()

    const $startTime = _MicroTime();

    const $default = {'func': ''};
    $in = _Merge($default, $in);

    let $errorStack;
    let $message = '';
    let $callResponse = {};
    let $functionName = 'internal_' + $in.func;

    tests:
    {
        internal_Log({
            'message': 'Will call: ' + $functionName,
            'function_name': $functionName,
            'object': $in,
            'depth': 1,
            'start_time': $startTime,
        });

        if (_MethodExists($functionName) === 'false') {
            $message = 'function name: ' + $functionName +
                ', does not exist or are not allowed to be called';
            break tests;
        }

        internal_Log({
            'message': 'Calling: ' + $functionName,
            'function_name': $functionName,
            'object': $in,
        });

        try {
            const $runThisRow = '$callResponse = ' + $functionName + '($in)';
            eval($runThisRow);
        } catch ($err) {
            $errorStack = $err.stack.split('\n');
            $message = 'Can not call: ' + $functionName + ', error: ' +
                $err.message;
            internal_Log({
                'level': 'error',
                'message': $message,
                'function_name': $functionName,
                'object': $errorStack,
            });
            $callResponse = {
                'answer': 'false',
                'message': $message,
            };
        }
        internal_Log({
            'message': 'Back from: ' + $functionName,
            'function_name': $functionName,
            'object': $callResponse,
        });

        if (typeof $callResponse !== 'object') {
            $message = 'Function ' + $functionName +
                ' did not return an object as it should (' +
                typeof ($callResponse) + ')';
            break tests;
        }

        if (typeof $callResponse.answer === 'undefined') {
            $message = 'Function ' + $functionName +
                ' did not return object.answer as it should.';
            break tests;
        }

        if (typeof $callResponse.message === 'undefined') {
            $message = 'Function ' + $functionName +
                ' did not return object.message as it should.';
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
            'message': 'Got error from: ' + $functionName + ', error: ' +
                $message,
            'function_name': $functionName,
            'object': {'in': $in, 'out': $callResponse},
        });
    }

    $callResponse.execution_time = _MicroTime() - $startTime;

    internal_Log({
        'message': 'Leaving internal_Cmd()',
        'function_name': $functionName,
        'start_time': $startTime,
        'execution_time': $callResponse.execution_time,
        'depth': -1,
    });

    return $callResponse;
};

/**
 * Write message to console
 * used by: you
 * Moved from infohub_base and renamed at 2020-12-05 to prepare for web workers
 * @example: internal_Log({'message': 'I want to log this'});
 * @version 2016-09-01
 * @since 2013-04-25
 * @author Peter Lembke
 * @param {object} $in
 * @return object
 */
$functions.push('internal_Log');
const internal_Log = function($in = {}) {
    if (!window.console) { // @todo Window is not available in a web worker
        return {
            'answer': 'false',
            'message': 'Have not written the item to the console because console do not exist',
        };
    }

    if (_IsSet($GLOBALS.infohub_minimum_error_level) === 'false') {
        return {
            'answer': 'true',
            'message': 'Did NOT write the log message to the console because infohub_minimum_error_level is not set',
        };
    }

    const $allowedLevels = ['log', 'info', 'warn', 'error'];

    const $minimumLogLevel = $allowedLevels.indexOf($GLOBALS.infohub_minimum_error_level);

    if ($minimumLogLevel === -1) {
        return {
            'answer': 'true',
            'message': 'Can not handle infohub_minimum_error_level = ' +
                $GLOBALS.infohub_minimum_error_level,
        };
    }

    const $default = {
        'time_stamp': _TimeStamp(),
        'node_name': 'client',
        'plugin_name': _GetClassName(),
        'function_name': '',
        'message': '', // Text row to show in the console
        'level': 'log', // log, info, warn, error
        'object': {}, // if you want to show this object in the console
        'depth': 0, // 1=create group, 0=log, -1=close group
        'get_backtrace': 'false',
        'execution_time': 0.0,
    };
    $in = _Default($default, $in);

    const $logLevel = $allowedLevels.indexOf($in.level);
    if ($logLevel === -1) {
        return {
            'answer': 'true',
            'message': 'Can not handle level = ' + $in.level,
        };
    }

    if ($logLevel < $minimumLogLevel) {
        return {
            'answer': 'true',
            'message': 'Your log message has a too low level',
        };
    }

    let $message,
        $toScreen = '',
        $errorBox;

    if ($in.level === 'error' && $in.get_backtrace === 'true') {
        $in.backtrace = new Error().stack.split('\n');
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

    const $plugin = $in.node_name + '.' + $in.plugin_name + '.' +
        $in.function_name;
    $message = window.errorIndicator + ' ' + $in.time_stamp + ', ' + $plugin +
        ', ' + $in.message;

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
                $toScreen = $toScreen + '<br><pre>' +
                    JSON.stringify($in.object, null, '\t') + '</pre>';
            }
        }

        if ($toScreen !== '') {
            $errorBox = window.document.getElementById('error');
            if ($errorBox !== null) {
                let $currentContents = $errorBox.innerHTML;
                if (_Empty($currentContents) === 'true') {
                    const $link1 = '<a href="" onclick="localStorage.setItem(\'cold_start\', \'1\');location.reload();">(== Restart light update plugins ==)</a>';
                    const $link2 = '<a href="" onclick="localStorage.setItem(\'cold_start\', \'3\');location.reload();">(== Restart hard keep data ==)</a>';
                    const $link3 = '<a href="" onclick="localStorage.setItem(\'cold_start\', \'5\');location.reload();">(== Full clean out ==)</a>';
                    $currentContents = $link1 + $link2 + $link3 + '<br><br>';
                }

                $errorBox.innerHTML = $toScreen + '<br>' + $currentContents;
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
        'message': 'Wrote log message to the console',
    };
};

/**
 * Returns a sub call message. Used by cmd(), useless for you.
 * @version 2016-01-06
 * @since   2013-11-21
 * @author  Peter Lembke
 * @param {object} $in
 * @uses data_back | object | Variables with data we want back untouched (OPTIONAL)
 * @uses data_request | array | Array with Data variables we want back (OPTIONAL) If omitted you get what the function give you
 * @return object
 */
$functions.push('internal_SubCall');
const internal_SubCall = function($in = {}) {
    const $default = {
        'func': 'SubCall',
        'to': {'node': 'client', 'plugin': 'exchange', 'function': 'default'}, // Where to send this message
        'data': {}, // The data you want to be available to the sub-function you call.
        'data_request': [], // Array with variable names you want from the sub-function. Leave blank to get everything.
        'data_back': {}, // Return these variables untouched in the returning message. (OPTIONAL)
        'wait': 10.0, // Seconds you can wait before this message really need to be sent.
        'track': 'false', // 'true' lets Cmd add an array of where this message have been.
        'original_message': {}, // Original message that came into cmd().
    };
    $in = _Default($default, $in);

    let $out = {
        'to': $in.to,
        'data': $in.data,
        'data_back': $in.data_back,
        'wait': Math.abs($in.wait),
        'callstack': [],
    };

    if ($in.track === 'true') {
        $out.track = {};
    }

    if (_IsSet($in.original_message.callstack) === 'true') {
        $out.callstack = $in.original_message.callstack;
        const $callStackAdd = {
            'to': $in.original_message.to,
            'data_back': $in.data_back,
            'data_request': $in.data_request,
        };
        $out.callstack.push(_ByVal($callStackAdd));
    }

    return {
        'answer': 'true',
        'message': 'Here are a sub call message',
        'sub_call_data': _ByVal($out),
    };
};

/**
 * Give you a return call message. Used by cmd(), useless for you.
 * @version 2015-01-18
 * @since   2013-11-22
 * @author  Peter Lembke
 * @param {object} $in
 * @return object
 * @uses data_back | object | Variables with data we want back untouched (OPTIONAL)
 * @uses data_request | array | Array with Data variables we want back (OPTIONAL) If omitted you get what the function give you
 */
$functions.push('internal_ReturnCall');
const internal_ReturnCall = function($in = {}) {
    const $default = {
        'func': 'ReturnCall',
        'variables': {},
        'original_message': {},
    };
    $in = _Default($default, $in);

    let $messageFromCallStack = {};

    if ($in.original_message.callstack.length > 0) {
        // pop() moves the last value of the array to your variable
        $messageFromCallStack = $in.original_message.callstack.pop();
    }

    const $defaultMessageFromCallStack = {
        'to': {},
        'data_back': {},
        'data_request': [],
    };

    $messageFromCallStack = _Default($defaultMessageFromCallStack,
        $messageFromCallStack);

    let $dataSend = {};

    const $length = $messageFromCallStack.data_request.length;
    if ($length > 0) {
        for (let dataRequestIndex = 0; dataRequestIndex <
        $length; dataRequestIndex++) {
            const $variableName = $messageFromCallStack.data_request[dataRequestIndex];
            if ($in.variables.hasOwnProperty($variableName)) {
                $dataSend[$variableName] = $in.variables[$variableName];
            }
        }
    } else {
        $dataSend = _ByVal($in.variables);
    }

    // 'data_back' will give you the data_back untouched. Just as we also do with the 'response' below.
    // This is for being able to reduce the $default parameters to just the required ones.
    $messageFromCallStack.data_back.data_back = _ByVal(
        $messageFromCallStack.data_back);

    // 'response' are for more advanced responses that can not be handled well with the normal array_merge below.
    // Example: Response from two subcalls where the variable name is the same but have different data type.
    // You validate the 'response' in the step that handle the subcall response.
    $messageFromCallStack.data_back.response = _ByVal($dataSend);

    const $out = {
        'to': $messageFromCallStack.to, // To Node
        'callstack': $in.original_message.callstack, // Rest of the callstack
        'data': _Merge($dataSend, $messageFromCallStack.data_back), // Kept for legacy and for simplicity
    };

    return {
        'answer': 'true',
        'message': 'Here you get a return message',
        'return_call_data': _ByVal($out),
    };
};

// _*_ End of the JS base code