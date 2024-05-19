/*jshint esversion: 11 */
/*jshint forin: false */
/*jshint eqeqeq: true */

let $functions = [], // Array with all function names
    $firstDefault = null, // Used by cmd() to get the default values for a cmd function
    $warnOnce = {}, // Warn about no return statement once in each plugin.function
    $batch = {}; // Used ONLY by cmd() to keep track of batch messages

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
/**
 * Adds the Base class public function names to the array
 * It is called from each plugin function: _GetCmdFunctions
 *
 * @param $childList
 * @returns {{}|{}|*}
 * @private
 */
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

    const $isFirstDefaultSet = $firstDefault !== null;
    if ($isFirstDefaultSet === false) {
        $firstDefault = $default;
    }

    const $isInAnIndexArray = Array.isArray($in) === true;
    if ($isInAnIndexArray === true) {
        $in = {};
    }

    const $defaultType = typeof ($default);
    const $inType = typeof ($in);

    const $isBothNoObject = $defaultType !== 'object' && $inType !== 'object';
    if ($isBothNoObject === true) {
        return {};
    }

    const $isDefaultNoObject = $defaultType !== 'object' && $inType === 'object';
    if ($isDefaultNoObject === true) {
        return _ByVal($in);
    }

    const $isInNoObject = $defaultType === 'object' && $inType !== 'object';
    if ($isInNoObject === true) {
        return _ByVal($default);
    }

    let $callbackFunction = '';
    if (typeof ($in.callback_function) === 'function') {
        $callbackFunction = $in.callback_function;
    }

    let Constructor = $default.constructor,
        $answer = new Constructor();

    // Set all missing keys from the default object
    for (let $key in $default)
    {
        if ($default.hasOwnProperty($key) === false) {
            continue;
        }

        const $defaultData = $default[$key];

        const $isBothNull = $defaultData === null && $in[$key] === null;
        if ($isBothNull === true) {
            $answer[$key] = '';
            continue;
        }

        if ($defaultData === null) { // Default accept whatever value you have
            $answer[$key] = $in[$key];
            continue;
        }

        const $inKeyType = typeof ($in[$key]);
        if ($inKeyType === 'undefined') { // No value in required property, you get the default value
            $answer[$key] = $defaultData;
            continue;
        }

        const $defaultKeyType = typeof ($defaultData);
        if ($defaultKeyType !== $inKeyType) { // Different data types. You get the default value
            $answer[$key] = $defaultData;
            internal_Log({
                'level': 'error',
                'message': 'key:"' + $key + '", have wrong data type: ' +
                    $inKeyType + ', expected data type: ' +
                    $defaultKeyType,
                'function_name': '_Default',
                'get_backtrace': 'true',
                'object': {'in': $in, 'default': $default},
            });
            continue;
        }

        $answer[$key] = $in[$key];

        if ($defaultKeyType !== 'object') {
            continue;
        }

        if (_Count($defaultData) === 0) { // We do not investigate in depth
            continue;
        }

        $answer[$key] = _Default($defaultData, $in[$key]);
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
            if ($object1.hasOwnProperty($key) === true) {
                $newObject[$key] = $object1[$key];
            }
        }
    }

    if (typeof $object2 === 'object') {
        for (let $key in $object2) {
            if ($object2.hasOwnProperty($key) === true) {
                $newObject[$key] = $object2[$key];
            }
        }
    }

    return _ByVal($newObject);
};

$functions.push('_MergeStringData');
/**
 * Merge two objects strings, everything new from object2 or object1 are added to new object.
 * Every string that exist in both objects are glued together with object 1 first and object 2 second.
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
            if ($object1.hasOwnProperty($key) === true) {
                $newObject[$key] = $object1[$key];
            }
        }
    }

    if (typeof $object2 === 'object') {
        for (let $key in $object2) {
            if ($object2.hasOwnProperty($key) === true) {
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
        $objectClone = new Constructor();

    for (let $property in $objectToBeCloned) {
        if ($objectToBeCloned.hasOwnProperty($property) === false) {
            continue;
        }
        if (typeof $objectToBeCloned[$property] !== 'object') {
            $objectClone[$property] = $objectToBeCloned[$property];
            continue;
        }
        $objectClone[$property] = _MiniClone($objectToBeCloned[$property]);
    }

    return $objectClone;
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
 * Return current local time stamp as a string in the format "yyyy-mm-dd hh:mm:ss"
 * Example: 2023-08-31 05:51:40
 *
 * Give 'c' to also get the time zone offset.
 * Example: 2023-08-31T05:51:40+02:00
 *
 * Set timeZone to 'gmt' to get the Greenwich mean time
 * Example: 2023-08-31T03:51:40+00:00
 *
 * @param {string} $typeOfTimeStamp - Give a 'c' to get the time stamp with time zone
 * @return {string} Return current time stamp as a string in the format "yyyy-mm-dd hh:mm:ss"
 */
$functions.push('_TimeStamp');
const _TimeStamp = function($typeOfTimeStamp = '', $timeZone = '') {

    let $date = new Date();
    let offsetTotal = $date.getTimezoneOffset();

    if ($timeZone === 'gmt') {
        $typeOfTimeStamp = 'c';
        $date.setMinutes($date.getMinutes() + offsetTotal);
        offsetTotal = 0;
    }

    let yyyy = $date.getFullYear().toString(),
        mm = ('0' + ($date.getMonth() + 1).toString()).slice(-2), // getMonth() is zero-based
        dd = ('0' + $date.getDate().toString()).slice(-2),
        hh = ('0' + $date.getHours().toString()).slice(-2),
        min = ('0' + $date.getMinutes().toString()).slice(-2),
        sec = ('0' + $date.getSeconds().toString()).slice(-2);

    let $dateString = yyyy + '-' + mm + '-' + dd + ' ' + hh + ':' + min + ':' + sec;

    if ($typeOfTimeStamp === 'c') { // ISO 8601 date
        let offsetSign = '-';
        if (offsetTotal < 0) {
            offsetSign = '+'; // Yes, -60 will become +01:00
            offsetTotal = Math.abs(offsetTotal);
        }
        const offsetHours = Math.floor(offsetTotal / 60);
        const offsetMinutes = offsetTotal - (offsetHours * 60);

        const offsetResult = offsetSign + ('00' + offsetHours).slice(-2) + ':' + ('00' + offsetMinutes).slice(-2);
        $dateString = yyyy + '-' + mm + '-' + dd + 'T' + hh + ':' + min + ':' + sec + offsetResult;
    }

    return $dateString;
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
    let $answer = $in.data;

    for (let $nameIndex = 0; $nameIndex < $nameCount; $nameIndex++) {
        if (typeof $answer[$nameArray[$nameIndex]] !== 'undefined') {
            $answer = $answer[$nameArray[$nameIndex]];
        } else {
            return $in.default;
        }
    }

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

    const $pattern = /^([a-z\u00E0-\u00FC])|\s+([a-z\u00E0-\u00FC])/g;

    const $replacer = function($1) {
        return $1.toUpperCase();
    };

    $string = ($string + '').replace($pattern, $replacer);

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

$functions.push('_SubString');
/**
 * Same as .substr but not using deprecated commands
 *
 * @since 2022-03-22
 * @param $string
 * @param $startInt
 * @param $lengthInt
 * @returns {string}
 * @private
 */
const _SubString = function(
    $string = '',
    $startInt = 0,
    $lengthInt = 0
) {

    const $stringLength = $string.length;

    if ($startInt < 0) {
        $startInt = $stringLength + $startInt;
    }

    let $endInt = $startInt + $lengthInt;

    let $resultString = $string.substring($startInt, $endInt);

    return $resultString;
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
        'data_request': [],
        'data_back': {},
        'messages': [],
        'track': 'false',
        'wait': 1.0,
    };

    const $out = _Default($default, $in);

    return $out;
};

/**
 * Create the batchCall array to return to cmd.
 * @param $in
 * @returns {function(*): {}|{}|{}|*}
 * @private
 */
$functions.push('_BatchCall');
const _BatchCall = function ($in = {}) {
    const $default = {
        'func': 'BatchCall',
        'data': [],
        'messages': [],
        'track': 'false',
        'wait': 0.2,
    };

    let $out = _Default($default, $in);

    let $batchId = _HubId();
    $out.data.batch_id = $batchId;

    $batch[$batchId] = {
        'callstack': [], // Used to send back the callstack to the last message in the batch
        'messages' : {}
    };

    for (let $key in $out.messages) {
        let $message = $out.messages[$key];

        const $callType = $message.func ?? '';
        if ($callType === ''){
            $message = _SubCall($message); // In case you did not use _SubCall
        }

        $message.data.i_want_a_short_tail ='true';
        $message.data_back.batch_id  = $batchId;

        let $batchMessageId = _HubId();
        $message.data_back.batch_message_id = $batchMessageId;

        $batch[$batchId].messages[$batchMessageId] = 'true';

        $out.messages[$key] = $message;
    }

    return $out;
}

/**
 * Count number of items in an array or an object
 * @param $object
 * @returns {*}
 * @private
 */
$functions.push('_Count');
const _Count = function($object) {
    if (Array.isArray($object) === true) {
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

    let $key = $string;
    const $isEndingWithKey = _SubString($key, -4,4) === '_KEY';
    if ($isEndingWithKey === false) {
        $key = $key + '_KEY';
    }

    let $translatedString = '';
    const $haveAnyTranslations = typeof $classTranslations === 'object';
    if ($haveAnyTranslations === true) {
        $translatedString = _GetData({
            'name': _GetClassName() + '|' + $key,
            'default': '',
            'data': $classTranslations,
            'split': '|',
        });
    }

    const $haveTranslatedString = _Full($translatedString) === 'true';
    if ($haveTranslatedString === true) {
        return $translatedString.toString();
    }

    // Remove the _KEY at the end.
    // Yes I know. If there are no translations and the string is like THE_LOGIN_KEY then it will be wrong.
    let $convertedString = $key.substring(0, $key.length - 4);

    $convertedString = _Replace('_', ' ', $convertedString.toLowerCase());
    $convertedString = $convertedString.charAt(0).toUpperCase() + $convertedString.substring(1);
    // This is a compromise where most texts start with a capital letter.
    // If you do not want the first letter to be capital then provide proper translation files.

    return $convertedString;
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
        $response.information = 'Node: client, ' + $response.information;
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
        if (Array.isArray($dataArray) === true) {
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
    const $extension = $fileName.substring($extensionStart);
    return $extension;
};

/**
 * The default InfoHub universal ID method that produce a unique identifier string
 * Example: 1575709656.3529:4518025819754968159
 * First the time since EPOC with decimals.
 * Then a colon. Then a random number between 0 and the maximum number an integer can hold on this system.
 * Benefits are the simplicity. Also gives information when the id was created.
 *
 * Copied from infohub_uuid.js at 2024-01-28 to be available for batch messages
 *
 * @version 2018-07-28
 * @since 2018-07-28
 * @author Peter Lembke
 * @param array $in
 * @return string
 */
$functions.push('_HubId');
const _HubId = function($in = {}) {
    const $result = _MicroTime() + ':' +
        Math.random().toString().substring(2);
    // math.random produce a float between 0 and 1, example 0.4568548654
    // substring(2) remove the 0. and leave 4568548654

    return $result;
};

/**
 * Get data from one column in the array
 *
 * @version 2024-05-03
 * @since 2024-05-03
 * @param $array
 * @param $columnName
 * @returns {*}
 * @private
 */
$functions.push('_ArrayColumn');
const _ArrayColumn = function ($array, $columnName) {
    let $dataArray = [];

    for (let $key in $array) {
        let $value = $array[$key][$columnName] ?? null;
        if ($value === null) {
            continue;
        }
        $dataArray.push($value);
    }

    return $dataArray;
}

// *****************************************************************************
// * The only public functions, do not add your own, not even in your plugin
// *****************************************************************************

/**
 * Execute one private function in this class
 * Used by: Infohub Exchange or if you use the class outside InfoHub.
 * Will only call function names that DO NOT start with internal_ or _
 *
 * Returns the outgoing message
 *
 * @param $in
 * @version 2024-01-01
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
        'from': {
            'node': '',
            'plugin': '',
            'function': '',
        },
        'callstack': [],
        'data': {},
        'data_request': [],
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
        'level': 'info'
    });

    $status = _GetCmdFunctionStatus($functionName);

    const callbackFunction = function($callResponse) {
        const $callResponseType = typeof $callResponse;
        if ($callResponseType !== 'object') {
            $message = 'Function: ' + $functionName + ' did not return an object as it should. (' + $callResponseType + ')';
            $callResponse = {};
        }

        internal_Log({
            'message': 'Back from: ' + $functionName,
            'function_name': $functionName,
            'object': $callResponse,
            'level': 'debug'
        });

        $out.execution_time = _MicroTime() - $startTime;
        $callResponse.func = $callResponse.func ?? 'ReturnCall';
        $callResponse.execution_time = $callResponse.execution_time ?? $out.execution_time;

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
                'level': 'log'
            });
        }

        internal_Log({
            'message': 'Leaving cmd()',
            'function_name': $functionName,
            'start_time': $startTime,
            'depth': -1,
            'execution_time': $out.data.execution_time,
            'level': 'info'
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

        $out.from = $in.to; // Add the message origin

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
        const $canBeCalled = $functionName !== 'cmd' && // Do not call cmd() from cmd()
            $functionName.indexOf('_') !== 0 && // Do not call functions that start with _
            $functionName.indexOf('internal_') !== 0; // Do not call internal_ functions

        if ($canBeCalled === false) {
            $message = 'function name: ' + $functionName + ', are not allowed to be called';
            $callResponse.message = $message;
            internal_Log({'level': 'error', 'message': $message});
            break leave;
        }

        const $isFunctionAvailable = $status.value > 0;
        if ($isFunctionAvailable === false) {
            $message = '(' + $status.status + ') ' + $status.information;
            $callResponse.message = $message;
            internal_Log({'level': 'error', 'message': $message});
            break leave;
        }

        $response = _GetCallerPluginName($in);
        $in.data.from_plugin = $response.from_plugin;

        const $doesFunctionExist = _MethodExists($functionName) === 'true';
        if ($doesFunctionExist === false) {
            $message = 'function name: ' + $functionName + ', does not exist or are not allowed to be called';
            $callResponse.message = $message;
            internal_Log({'level': 'error', 'message': $message});
            break leave;
        }

        $in.data.data_back = _Merge({'batch_id': '', 'batch_message_id': ''}, $in.data.data_back);
        const $batchId = $in.data.data_back.batch_id;
        const $batchMessageId = $in.data.data_back.batch_message_id;
        const $isPartOfBatch = $batchId !== '' && $batchMessageId !== '';

        if ($isPartOfBatch === true) {
            const $doesBatchMessageExist = _IsSet($batch[$batchId]['messages'][$batchMessageId]) === 'true';
            if ($doesBatchMessageExist === false) {
                $message = 'Batch message does not exist in memory';
                $callResponse['message'] = $message;
                break leave;
            }

            delete($batch[$batchId]['messages'][$batchMessageId]);

            const $isLast = _Count($batch[$batchId]['messages']) === 0;
            $in.data.data_back.is_last_batch_message = 'false';
            if ($isLast === true) {
                $in.data.data_back.is_last_batch_message = 'true';
                $in['callstack'] = $batch[$batchId]['callstack'];
                delete($batch[$batchId]);
            }
        }

        $in.data.callback_function = callbackFunction;

        internal_Log({
            'message': 'Calling: ' + $functionName,
            'function_name': $functionName,
            'level': 'debug'
        });

        try {
            $firstDefault = null;
            $runThisRow = '$callResponse = ' + $functionName + '($in.data)';
            eval($runThisRow);
        } catch ($err) {
            $message = 'Can not call: ' + $functionName + ', error:' + $err.message;
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

    const $haveCallResponse = _Empty($callResponse) === 'false';

    if ($haveCallResponse === false) {
        if (typeof $callResponse === 'undefined') {
            // If you use the callback then you must return an empty object {}
            // window.alert('Function do not return anything. ' + $in.to.plugin + '.' + $functionName);

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
        return {};
    }

    const $func = $callResponse['func'] ?? '';
    const $isBatchCall = $func === 'BatchCall';
    if ($isBatchCall === true) {
        // Save the callstack for the last message that returns in the batch call
        $batch[$callResponse.data.batch_id]['callstack'] = $in.callstack;
    }

    let $outgoingMessageArray = _GetData({
        'name': 'messages',
        'default': [],
        'data': $callResponse,
    });

    if ($outgoingMessageArray.length > 0) {
        while ($outgoingMessageArray.length > 0) {
            $oneCallResponse = $outgoingMessageArray.pop();
            $oneCallResponse.data = $oneCallResponse.data ?? {};
            $oneCallResponse.data.i_want_a_short_tail = 'true';
            callbackFunction($oneCallResponse); // Put each outgoing short tail message on the stack
        }
        delete $callResponse.messages;
    }

    if ($isBatchCall === true) {
        return []; // We have no main message to send back
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

    const $outgoingMessage = callbackFunction($callResponse);

    return $outgoingMessage;
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
            if ($method.substring(0, 'internal_'.length) === 'internal_') {
                if ($in.include_internal_functions === 'true') {
                    $classMethods.push($method);
                }
                continue;
            }
            if ($method.substring(0, '_'.length) === '_') {
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
 * Execute a private internal_ function in this class
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

    const $void = $functionName === 'internal_MessageCheck';

    tests:
    {
        internal_Log({
            'message': 'Will call: ' + $functionName,
            'function_name': $functionName,
            'object': $in,
            'depth': 1,
            'start_time': $startTime,
            'level': 'info',
            'void': $void
        });

        if (_MethodExists($functionName) === 'false') {
            $message = 'function name: ' + $functionName + ', does not exist or are not allowed to be called';
            break tests;
        }

        internal_Log({
            'message': 'Calling: ' + $functionName,
            'function_name': $functionName,
            'object': $in,
            'level': 'debug',
            'void': $void
        });

        try {
            const $runThisRow = '$callResponse = ' + $functionName + '($in)';
            eval($runThisRow);
        } catch ($err) {
            $errorStack = $err.stack.split('\n');
            $message = 'Can not call: ' + $functionName + ', error: ' + $err.message;
            internal_Log({
                'level': 'error',
                'message': $message,
                'function_name': $functionName,
                'object': $errorStack,
                'void': $void
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
            'level': 'log',
            'void': $void
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
            'object': {'in': $in, 'out': $callResponse},
            'void': $void
        });
    }

    $callResponse.execution_time = _MicroTime() - $startTime;

    internal_Log({
        'message': 'Leaving internal_Cmd()',
        'function_name': $functionName,
        'start_time': $startTime,
        'execution_time': $callResponse.execution_time,
        'depth': -1,
        'level': 'info',
        'void': $void
    });

    return $callResponse;
};

/**
 * Write message to console
 * used by: you
 * Moved from infohub_base and renamed at 2020-12-05 to prepare for web workers
 * @example: internal_Log({'message': 'I want to log this'});
 * @see https://console.spec.whatwg.org/
 * @version 2016-09-01
 * @since 2013-04-25
 * @author Peter Lembke
 * @param {object} $in
 * @return object
 */
$functions.push('internal_Log');
const internal_Log = function($in = {}) {

    const $void  = $in.void ?? false;
    if ($void === true) {
        return {
            'answer': 'true',
            'message': 'Did NOT write the log message to the console because void was set to true'
        };
    }

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

    const $allowedLevels = ['debug', 'log', 'info', 'warn', 'error'];

    const $minimumLogLevel = $allowedLevels.indexOf($GLOBALS.infohub_minimum_error_level);

    if ($minimumLogLevel === -1) {
        return {
            'answer': 'true',
            'message': 'Can not handle infohub_minimum_error_level = ' + $GLOBALS.infohub_minimum_error_level,
        };
    }

    const $default = {
        'time_stamp': _TimeStamp(),
        'node_name': 'client',
        'plugin_name': _GetClassName(),
        'function_name': '',
        'message': '', // Text row to show in the console
        'level': 'log', // debug, log, info, warn, error
        'object': {}, // if you want to show this object in the console
        'depth': 0, // 1=create group, 0=log, -1=close group
        'get_backtrace': 'false',
        'execution_time': 0.0
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
        $boxError;

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

    const $plugin = $in.node_name + '.' + $in.plugin_name + '.' + $in.function_name;
    $message = window.errorIndicator + ' ' + $in.time_stamp + ', ' + $plugin + ', ' + $in.message;

    if ($in.depth === 1) {
        window.console.groupCollapsed($message);
    }

    if ($in.depth === 0 || $in.depth === -1) {
        if ($in.level === 'debug') { // Any small thing that could be interesting
            window.console.debug($message);
        }
        if ($in.level === 'log') { // Only in-data and out-data
            window.console.log($message);
        }
        if ($in.level === 'info') { // What function is called. Changes in depth: 1, -1
            window.console.info($message);
        }
        if ($in.level === 'warn') { // Everything works, but we got into a state that could be something to look into
            window.console.warn($message);
        }
        if ($in.level === 'error') { // Something is wrong
            window.console.error($message);
        }
    }

    if ($in.level === 'error') { // Something is wrong
        $toScreen = $message;
    }

    if (Object.getOwnPropertyNames($in.object).length > 0) {
        window.console.dir($in.object);
        if ($in.level === 'error') {
            $toScreen = $toScreen + '<br><pre>' + JSON.stringify($in.object, null, '\t') + '</pre>';
        }
    }

    if ($toScreen !== '') {
        $boxError = window.document.getElementById('error');
        if ($boxError !== null) {
            let $currentContents = $boxError.innerHTML;
            if (_Empty($currentContents) === 'true') {
                const $link1 = '<a href="" onclick="localStorage.setItem(\'cold_start\', \'1\');location.reload();">(== Restart light update plugins ==)</a>';
                const $link2 = '<a href="" onclick="localStorage.setItem(\'cold_start\', \'3\');location.reload();">(== Restart hard keep data ==)</a>';
                const $link3 = '<a href="" onclick="localStorage.setItem(\'cold_start\', \'5\');location.reload();">(== Full clean out ==)</a>';
                const $link4 = '<a href="" onclick="window.document.getElementById(\'error\').innerHTML=\'\'">(== Clear log window==)</a>';
                $currentContents = $link1 + $link2 + $link3 + $link4 + '<br><br>';
            }

            $boxError.innerHTML = $toScreen + '<br>' + $currentContents;
            $boxError.style.display = 'block';
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
        'track': 'false', // 'true' lets Cmd add an array of where this message has been.
        'original_message': {}, // Original message that came into cmd().
    };
    $in = _Default($default, $in);

    let $out = {
        'to': $in.to,
        'data': $in.data,
        'data_request': $in.data_request,
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
            'data_request': $in.data_request,
            'data_back': $in.data_back
        };
        $out.callstack.push($callStackAdd);
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

    $messageFromCallStack = _Default($defaultMessageFromCallStack, $messageFromCallStack);

    let $dataSend = {};

    const $length = $messageFromCallStack.data_request.length;
    if ($length > 0) {
        // We only want specific variables in the response
        for (let $dataRequestIndex = 0; $dataRequestIndex < $length; $dataRequestIndex++) {
            const $variableName = $messageFromCallStack.data_request[$dataRequestIndex];
            if ($in.variables.hasOwnProperty($variableName) === false) {
                continue;
            }
            $dataSend[$variableName] = $in.variables[$variableName];
        }
    } else {
        $dataSend = $in.variables;
    }

    // 'data_back' will give you the data_back untouched. Just as we also do with the 'response' below.
    // This is for being able to reduce the $default parameters to just the required ones.
    $messageFromCallStack.data_back.data_back = _ByVal($messageFromCallStack.data_back);

    // 'response' are for more advanced responses that can not be handled well with the normal array_merge below.
    // Example: Response from two sub calls where the variable name is the same but have different data type.
    // You validate the 'response' in the step that handle the sub call response.
    $messageFromCallStack.data_back.response = $dataSend;

    const $out = {
        'to': $messageFromCallStack.to, // To Node
        'from': $in.original_message.to,
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