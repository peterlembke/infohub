<?php
/**
 * Base class for all plugins
 *
 * Used by ALL plugins. Handle the messages in and out from the plugin.
 *
 * @package     Infohub
 * @subpackage  infohub_base
 */

declare(strict_types=1);

if (basename(__FILE__) == basename($_SERVER['SCRIPT_FILENAME'])) {
    exit; // This file must be included, not called directly
}

/**
 * Base class for all plugins
 *
 * Used by ALL plugins. Handle the messages in and out from the plugin.
 *
 * @author      Peter Lembke <info@infohub.se>
 * @version     2016-01-26
 * @since       2016-01-26
 * @copyright   Copyright (c) 2016, Peter Lembke
 * @license     https://opensource.org/licenses/gpl-license.php GPL-3.0-or-later
 * @see         https://github.com/peterlembke/infohub/blob/master/folder/plugins/infohub/base/infohub_base.md Documentation
 * @link        https://infohub.se/ InfoHub main page
 */
class infohub_base
{
    // ***********************************************************
    // * The only public variables, do not add your own
    // ***********************************************************

    private array $globalLogArray = []; // Used ONLY by internal_Log() and cmd()
    private ?array $firstDefault = null; // Used ONLY by the test() function. Contain array or null
    private array $configLog = []; // What functions to log even if answer = 'true';

    private array $batch = []; // Used ONLY by cmd() to keep track of batch messages

    /**
     * Version information for this Base class
     * Is private because it should only be used by the version() function.
     *
     * @return array
     */
    private function _VersionBase(): array
    {
        return [
            'date' => '2016-01-26',
            'since' => '2016-01-26',
            'version' => '1.0.0',
            'checksum' => '{{base_checksum}}',
            'class_name' => get_class($this),
            'note' => 'Parent class in ALL plugins. Manages the traffic in the plugin',
            'status' => 'normal',
            'SPDX-License-Identifier' => 'GPL-3.0-or-later',
            'user_role' => ''
        ];
    }

    /**
     * Adds the Base class public function names to the array
     * Need to be protected, it is called from each plugin function: _GetCmdFunctions
     *
     * @param  array  $childList
     * @return array
     */
    protected function _GetCmdFunctionsBase(array $childList = []): array
    {
        $list = [
            'version' => 'normal',
            'function_names' => 'normal',
            'ping' => 'normal'
        ];

        $newList = array_merge($childList, $list);

        return $newList;
    }

    /**
     * Version data. Implement this function in your plugin
     * Need to be protected. It is overridden in other plugins
     *
     * @return array
     */
    protected function _Version(): array
    {
        return [
            'date' => '1970-01-01',
            'version' => '0.0.0',
            'class_name' => get_class($this),
            'checksum' => '{{checksum}}',
            'note' => 'Please implement this function in your plugin',
            'status' => 'emerging',
            'SPDX-License-Identifier' => 'GPL-3.0-or-later',
            'user_role' => ''
        ];
    }

    /**
     * All cmd functions in this plugin.
     * Implement in your plugin.
     *
     * @return array
     * @example: 'function_name' => 'emerging', or 'normal', or 'deprecated', or 'removed'
     *
     */
    protected function _GetCmdFunctions(): array
    {
        return $this->_GetCmdFunctionsBase();
    }

    // *****************************************************************************
    // * The private functions, add your own in your plugin
    // * These functions can be used directly in your functions.
    // * Name: _CamelCaseData
    // *****************************************************************************

    /**
     * Makes sure we only get keys from $default, and get the data type for each key data in $default.
     *
     * You get all keys in the associative array $default and its data.
     * If a key from $default exist in $in and the data type for that key is the same for both arrays,
     * then the data from $in is used.
     *
     * If a key in $default have NULL as data, then we copy the key data from $in.
     *
     * Used by: EVERY function.
     * The $default variables, You can only use: array, string, integer, float, null
     * The $in variables, You can only use: array, string, integer, float
     *
     * @param  array  $default
     * @param  array  $in
     * @return array
     * @author  Peter Lembke
     * @version 2024-01-06
     * @since   2013-09-05
     * @example: $in = _Default($default,$in);
     */
    protected function _Default(array $default = [], array $in = []): array
    {
        $isFirstDefaultSet = is_null($this->firstDefault) === false;
        if ($isFirstDefaultSet === false) {
            $this->firstDefault = $default;
        }

        $isInAnIndexedArray = array_is_list($in) === true;
        if ($isInAnIndexedArray === true) {
            $answer = $in;
        } else {
            // Add all keys that are only in default.
            $answer = array_merge($default, $in);

            // Remove all keys that are not in default.
            $answer = array_intersect_key($answer, $default);
        }

        $messageTemplate = 'key: %s, have wrong data type (%s), instead got default value and data type (%s)';

        foreach ($default as $key => $defaultData) {

            $isKeyInAnswer = isset($answer[$key]) === true;
            if ($isKeyInAnswer === false) {
                $answer[$key] = $defaultData;
                continue;
            }

            $isSameDataType = gettype($defaultData) === gettype($answer[$key]);
            if ($isSameDataType === false) {

                $isDefaultDataNull = is_null($defaultData) === true;
                if ($isDefaultDataNull === true) {
                    continue; // We keep the data in the $answer key
                }

                $message = sprintf($messageTemplate, $key, gettype($in[$key]), gettype($defaultData));
                $this->internal_Log([
                    'level' => 'error',
                    'message' => $message,
                    'function_name' => '_Default',
                    'get_backtrace' => 'true'
                ]);

                $answer[$key] = $defaultData;
                continue;
            }

            $isBothNull = is_null($defaultData) === true && is_null($answer[$key]) === true;
            if ($isBothNull === true) {
                $answer[$key] = '';
                continue;
            }

            if (is_array($defaultData) === false) {
                continue;
            }

            if (count($defaultData) === 0) {
                continue;
            }

            $answer[$key] = $this->_Default($defaultData, $answer[$key]);
        }

        return $answer;
    }

    /**
     * Merge two arrays together
     *
     * @param  array  $default
     * @param  array  $in
     * @return array
     */
    protected function _Merge(array $default = [], array $in = []): array
    {
        $data = array_merge($default, $in);

        return $data;
    }

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
     * @param  string  $typeOfTimeStamp
     * @param  string  $timeZone
     * @return string
     */
    protected function _TimeStamp(
        string $typeOfTimeStamp = '',
        string $timeZone = ''
    ): string {
        $format = 'Y-m-d H:i:s';
        if ($typeOfTimeStamp === 'c') {
            $format = 'c';
        }

        if ($timeZone === 'gmt') {
            $dateString = gmdate($format);
        } else {
            $dateString = date($format);
        }

        return $dateString;
    }

    /**
     * Return a datetime with microseconds.
     * Used for logging purpose where seconds are not enough.
     * From: https://stackoverflow.com/questions/169428/php-datetime-microseconds-always-returns-0
     *
     * @return string
     */
    protected function _TimeStampMicro(): string
    {
        $microTime = microtime(true);
        $microSecondsFloat = ($microTime - floor($microTime)) * 1000000;
        $microSecondsString = sprintf("%06d", $microSecondsFloat);
        $dateString = date('Y-m-d H:i:s', (int) $microTime).'.'.$microSecondsString;

        return $dateString;
    }

    /**
     * Return current time since EPOC (1970-01-01 00:00:00),
     * as seconds and fraction of seconds.
     *
     * @return float
     */
    protected function _MicroTime(): float
    {
        $microTime = microtime(as_float: true);

        return $microTime;
    }

    /**
     * Exist because we have a JS function with the same name
     * @param  mixed  $object
     * @return string
     */
    protected function _Empty(mixed $object): string
    {
        if (empty($object) === false) {
            return 'false';
        }

        return 'true';
    }

    /**
     * Exist because we have a JS function with the same name
     * @param  mixed  $object
     * @return string
     */
    protected function _IsSet(mixed $object): string
    {
        if (isset($object) === false) {
            return 'false';
        }

        return 'true';
    }

    /**
     * Wrapper so it is easier to change the places where JSON is used.
     *
     * @param  array  $dataArray
     * @param  bool  $usePrettyPrint
     * @param  bool  $usePreserveZeroFraction
     * @param  bool  $useUnescapedUnicode
     * @return string
     */
    protected function _JsonEncode(
        array $dataArray = [],
        bool $usePrettyPrint = false,
        bool $usePreserveZeroFraction = true,
        bool $useUnescapedUnicode = false
    ): string
    {
        $options = 0;
        if ($usePrettyPrint === true) {
            $options += JSON_PRETTY_PRINT;
        }
        if ($usePreserveZeroFraction === true) {
            $options += JSON_PRESERVE_ZERO_FRACTION;
        }
        if ($useUnescapedUnicode === true) {
            $options += JSON_UNESCAPED_UNICODE;
        }

        $jsonString = json_encode($dataArray, $options);

        if (empty($jsonString) === true) {
            $jsonString = '{}';
        }

        return $jsonString;
    }

    /**
     * Wrapper so it is easier to change the places where JSON is used.
     * @param  string  $jsonString
     * @return array
     */
    protected function _JsonDecode(string $jsonString = ''): array
    {
        $hasCorrectStartCharacter = str_starts_with($jsonString, needle: '{') === true ||
            str_starts_with($jsonString, needle: '[') === true;

        if ($hasCorrectStartCharacter === false) {
            return [];
        }

        $data = json_decode(
            json: $jsonString,
            associative: true
        );

        if (is_null($data) === true) {
            return [];
        }

        return (array) $data;
    }

    /**
     * Read a value from any level in an array without having to check if a level exist.
     * Returns default value if any level do not exist
     * Name can be 'just_a_name' or 'some/deep/level/data'
     *
     * @param  array  $in
     * @return mixed
     */
    protected function _GetData(array $in = []): mixed
    {
        $default = [
            'name' => '',
            'default' => null,
            'data' => [],
            'split' => '/'
        ];
        $in = $this->_Default($default, $in);

        $nameArray = (array) explode($in['split'], $in['name']);

        $length = count($nameArray);
        $answer = $in['data'];
        for ($position = 0; $position < $length; $position++) {

            $doesPositionHaveAName = isset($answer[$nameArray[$position]]) === true;
            if ($doesPositionHaveAName === true) {
                $answer = $answer[$nameArray[$position]];
                continue;
            }

            return $in['default'];
        }

        $isSameDataType = gettype($answer) === gettype($in['default']);
        if ($isSameDataType === false) {
            $answer = $in['default'];
        }

        $haveArrayFallbackValue = is_array($in['default']) === true && empty($in['default']) === false;
        if ($haveArrayFallbackValue === true) {
            $answer = $this->_Default($in['default'], $answer);
        }

        return $answer;
    }

    /**
     * Takes the first found key data from the object and gives it to you, removing it from the object.
     * Used in loops when sending one item at the time in a sub call.
     *
     * @param  array  $in
     * @return array
     */
    protected function _Pop(array $in = []): array
    {
        foreach ($in as $key => $data) {
            unset($in[$key]);

            return [
                'key' => $key,
                'data' => $data,
                'object' => $in
            ];
        }

        return [
            'key' => '',
            'data' => '',
            'object' => []
        ];
    }

    /**
     * Create the subCall array to return to cmd.
     * @param  array  $in
     * @return array
     */
    protected function _SubCall(array $in = []): array
    {
        $default = [
            'func' => 'SubCall',
            'to' => ['node' => '', 'plugin' => '', 'function' => ''],
            'data' => [],
            'data_request' => [],
            'data_back' => [],
            'messages' => [],
            'track' => 'false',
            'wait' => 0.2
        ];
        $out = $this->_Default($default, $in);

        return $out;
    }

    /**
     * Create the batchCall array to return to cmd.
     * @param  array  $in
     * @return array
     */
    protected function _BatchCall(array $in = []): array
    {
        $default = [
            'func' => 'BatchCall',
            'data' => [],
            'messages' => [],
            'track' => 'false',
            'wait' => 0.2
        ];
        $out = $this->_Default($default, $in);

        $batchId = $this->_HubId();
        $out['data']['batch_id'] = $batchId;

        $this->batch[$batchId] = [
            'callstack' => [], // Used to send back the callstack to the last message in the batch
            'messages' => []
        ];

        foreach ($out['messages'] as $key => $message) {

            $callType = $message['func'] ?? '';
            if ($callType === '') {
                $message = $this->_SubCall($message); // In case you did not use _SubCall
            }

            $message['data']['i_want_a_short_tail'] = 'true';
            $message['data_back']['batch_id'] = $batchId;

            $batchMessageId = $this->_HubId();
            $message['data_back']['batch_message_id'] = $batchMessageId;

            $this->batch[$batchId]['messages'][$batchMessageId] = 'true';

            $out['messages'][$key] = $message;
        }

        return $out;
    }

    /**
     * Status on Cmd functions: never_existed, emerging, normal, deprecated, retired
     * Is private because it should only be used by the cmd() function.
     *
     * @param  string  $functionName
     * @return array
     */
    private function _GetCmdFunctionStatus(string $functionName = ''): array
    {
        $statusType = 'never_existed';
        $functionsBase = $this->_GetCmdFunctionsBase();
        $functions = $this->_GetCmdFunctions();
        $functions = array_merge($functionsBase, $functions);
        if (isset($functions[$functionName]) === true) {
            $statusType = $functions[$functionName];
        }

        $statuses = [
            'never_existed' => [
                'status' => 'never_existed',
                'information' => 'Function "{this function}" have never existed in plugin {this plugin}.php. Or is it just missing in _GetCmdFunctions?',
                'value' => 0
            ],
            'emerging' => [
                'status' => 'emerging',
                'information' => 'New feature in {this plugin} that probably will be changed during this major version. In the next major version, function "{this function}" will either be normal or removed',
                'value' => 1
            ],
            'normal' => [
                'status' => 'normal',
                'information' => 'You can use function "{this function}" in plugin {this plugin}. It will work in this major version. It will get bug fixes and will work as normal',
                'value' => 2
            ],
            'deprecated' => [
                'status' => 'deprecated',
                'information' => 'You can use function "{this function}" in plugin {this plugin} but it will be removed in the next major version',
                'value' => 1
            ],
            'removed' => [
                'status' => 'removed',
                'information' => 'Function "{this function}" have existed in plugin {this plugin} but became deprecated and have now been removed in this major version',
                'value' => 0
            ]
        ];

        if (isset($statuses[$statusType]) === false) {
            return [
                'status' => $statusType,
                'information' => 'This is an unknown status. I will not try to call the function name',
                'value' => 0,
                'function_name' => $functionName
            ];
        }

        $response = $statuses[$statusType];
        $response['function_name'] = $functionName;

        $pluginName = $this->_GetClassName();
        $response['information'] = 'Node: server, ' . $response['information'];
        $response['information'] = str_replace('{this plugin}', $pluginName, $response['information']);
        $response['information'] = str_replace('{this function}', $functionName, $response['information']);

        return $response;
    }

    /**
     * Get the class name in this plugin
     * @return string
     */
    protected function _GetClassName(): string
    {
        return get_class($this);
    }

    /**
     * Get name of the plugin that sent the message
     * Used in cmd(). Useless for you to use. Will give you an empty answer.
     * @param  array  $in
     * @return array
     */
    private function _GetCallerPluginName(array $in = []): array
    {
        $default = [
            'callstack' => []
        ];
        $in = $this->_Default($default, $in);

        $fromPlugin = [];

        $lastInCallStack = end($in['callstack']);
        if (is_array($lastInCallStack) === true) {
            if (isset($lastInCallStack['to']) === true) {
                $fromPlugin = $lastInCallStack['to'];
            }
        }

        $default = [
            'node' => '',
            'plugin' => '',
            'function' => ''
        ];
        $fromPlugin = $this->_Default($default, $fromPlugin);

        return [
            'answer' => 'true',
            'message' => 'Message come from this plugin',
            'from_plugin' => $fromPlugin
        ];
    }

    /**
     * The default InfoHub universal ID method that produce a unique identifier string
     * Example: 1575709656.3529:4518025819754968159
     * First the time since EPOC with decimals.
     * Then a colon. Then a random number between 0 and the maximum number an integer can hold on this system.
     * Benefits are the simplicity. Also gives information when the id was created.
     *
     * Copied from infohub_uuid.php at 2024-01-20 to be available for batch messages
     *
     * @return string
     * @author Peter Lembke
     * @version 2024-01-20
     * @since 2024-01-20
     */
    protected function _HubId(): string
    {
        try {
            $randomNumber = random_int(0, PHP_INT_MAX); // PHP >= 7
        } catch (Exception $e) {
            return '';
        }

        $hubId = $this->_MicroTime() . ':' . $randomNumber;

        return $hubId;
    }

    // *****************************************************************************
    // * The only public functions, do not add your own, not even in your class
    // *****************************************************************************

    /**
     * Execute one protected function in this class
     * Used by: Infohub Exchange or if you use the class outside InfoHub.
     * Will only call function names that DO NOT start with internal_ or _
     *
     * Returns the outgoing message
     *
     * @param  array  $in
     * @return array
     * @example ping, version, function_names from this plugin, and some more from your plugin.
     *
     * @author  Peter Lembke
     * @version 2024-02-01
     * @since   2011-11-19
     * @uses message_to_function | string | The name of the function we want to call
     */
    final public function cmd(array $in = []): array
    {
        $startTime = $this->_MicroTime();
        $this->globalLogArray = [];

        $defaultMessage = [
            'to' => [
                'node' => 'server',
                'plugin' => '',
                'function' => ''
            ],
            'from' => [
                'node' => '',
                'plugin' => '',
                'function' => ''
            ],
            'callstack' => [],
            'data' => [],
            'data_request' => [],
            'data_back' => [],
            'wait' => 0.2,
            'callback_function' => null
        ];
        $in = $this->_Default($defaultMessage, $in);

        $answer = 'false';
        $message = '';

        $out = [
            'data' => []
        ];

        $callResponse = [
            'answer' => $answer,
            'message' => $message
        ];

        if (isset($in['data']['config']['log']) === true) {
            // See example in infohub_checksum.json

            $this->configLog = (array) $this->_GetData([
                'name' => 'data/config/log',
                'default' => [],
                'data' => $in
            ]);
            unset($in['data']['config']['log']);
        }

        $functionName = strtolower($in['to']['function']);
        $this->internal_Log([
            'message' => 'Will call: '.$functionName,
            'function_name' => 'cmd',
            'object' => $in,
            'depth' => 1
        ]);

        $status = $this->_GetCmdFunctionStatus($functionName);

        /**
         *
         * @param $callResponse
         * @return array|array[]
         */
        $callbackFunction = function ($callResponse) use ($functionName, $out, &$in, $startTime, &$status) {
            $message = '';

            if (is_array($callResponse) === false) {
                $type = gettype($callResponse);
                $message = "Function: $functionName, did not return an object as it should. Got $type instead";
                $callResponse = [];
            }

            $this->internal_Log([
                'message' => 'Back from: '.$functionName,
                'function_name' => $functionName,
                'object' => $callResponse
            ]);

            $callResponse = $this->_Merge(['func' => 'ReturnCall'], $callResponse);

            $out['execution_time'] = $this->_MicroTime() - $startTime;
            $callResponse = $this->_Merge($callResponse, ['execution_time' => $out['execution_time']]);

            if ($callResponse['func'] === 'SubCall') {
                $subCall = $callResponse;
                $subCall['original_message'] = $in;
                $response = $this->internal_Cmd($subCall);
                if ($response['answer'] === 'false') {
                    $message = $response['message'];
                }
                $out = array_merge($out, $response['sub_call_data']);
            }

            if ($callResponse['func'] === 'ReturnCall') {
                $response = $this->internal_Cmd([
                    'func' => 'ReturnCall',
                    'variables' => $callResponse,
                    'original_message' => $in
                ]);
                if ($response['answer'] === 'false') {
                    $message = $response['message'];
                }
                $out = array_merge($out, $response['return_call_data']);
            }

            if ($message !== '') {
                $out['data']['message'] = $message;
                $callResponse['message'] = $message;
                $this->internal_Log([
                    'message' => $message,
                    'function_name' => $functionName,
                    'object' => [
                        'in' => $in,
                        'out' => $out
                    ]
                ]);
            }

            if (isset($out['data']['execution_time']) === false) {
                $out['data']['execution_time'] = 0.0;
            }

            $this->internal_Log([
                'message' => 'Leaving cmd()',
                'function_name' => $functionName,
                'start_time' => $startTime,
                'depth' => 0, // @todo Should be -1 but multi message makes it go below 0
                'execution_time' => $out['data']['execution_time']
            ]);

            if (isset($status['value']) === true) {
                $out['function_status'] = $status;

                if ($status['value'] === 1) {
                    $sleep = (int) ($out['data']['execution_time'] * 1000);
                    usleep($sleep); // There is a cost in using emerging and deprecated functions.
                }
            }

            $out['from'] = $in['to']; // Add the message origin

            $iWantAShortTail = $this->_GetData([
                'name' => 'data/i_want_a_short_tail',
                'default' => 'false',
                'data' => $out
            ]);

            if ($iWantAShortTail === 'true') {
                unset($out['data']['i_want_a_short_tail']);
                // Remove all but the newest entry in the callstack
                while (count($out['callstack']) > 1) {
                    array_shift($out['callstack']);
                }
            }

            if (isset($this->configLog[$functionName]) === true) {
                // See example in infohub_checksum.json

                $this->internal_Log([
                    'message' => 'Temporary debug logging',
                    'level' => 'debug',
                    'function_name' => $functionName,
                    'execution_time' => $out['data']['execution_time'],
                    'object' => [
                        'in' => $in,
                        'out' => $out
                    ]
                ]);
            }

            $out['log_array'] = $this->globalLogArray;

            if (isset($in['callback_function']) === true) {
                if ($in['callback_function'] instanceof Closure) {
                    $in['callback_function']($out); // Call the callback function. Will put the message on the stack
                    return [];
                }
            }

            return $out;
        };

        $canBeCalled = $functionName !== 'cmd' && // Do not call cmd() from cmd()
            $functionName[0] !== '_' && // Do not call functions that start with _
            str_starts_with($functionName, 'internal_') === false; // Do not call internal_ functions

        if ($canBeCalled === false) {
            $message = 'function name: '.$functionName.', are not allowed to be called';
            $callResponse['message'] = $message;
            goto leave;
        }

        $isFunctionAvailable = $status['value'] > 0;
        if ($isFunctionAvailable === false) {
            $message = '('.$status['status'].') '.$status['information'];
            $callResponse['message'] = $message;
            goto leave;
        }

        $response = $this->_GetCallerPluginName($in);
        $in['data']['from_plugin'] = $response['from_plugin']; // For rights purposes. Do not do this with the callstack or other data. You get node, plugin function name.

        $doesFunctionExist = method_exists($this, $functionName) === true;
        if ($doesFunctionExist === false) {
            $message = 'function name: '.$functionName.', does not exist or are not allowed to be called';
            $callResponse['message'] = $message;
            goto leave;
        }

        $isPartOfBatch = isset($in['data']['data_back']['batch_id']) === true &&
            isset($in['data']['data_back']['batch_message_id']) === true;

        if ($isPartOfBatch === true) {
            $batchId = $in['data']['data_back']['batch_id'];
            $batchMessageId = $in['data']['data_back']['batch_message_id'];
            $doesBatchMessageExist = isset($this->batch[$batchId]['messages'][$batchMessageId]) === true;
            if ($doesBatchMessageExist === false) {
                $message = 'Batch message does not exist in memory';
                $callResponse['message'] = $message;
                goto leave;
            }

            unset($this->batch[$batchId]['messages'][$batchMessageId]);

            $isLast = count($this->batch[$batchId]['messages']) === 0;
            $in['data']['data_back']['is_last_batch_message'] = 'false';
            if ($isLast === true) {
                $in['data']['data_back']['is_last_batch_message'] = 'true';
                $in['callstack'] = $this->batch[$batchId]['callstack'];
                unset($this->batch[$batchId]);
            }
        }

        $in['data']['callback_function'] = $callbackFunction;

        $this->internal_Log([
            'message' => 'Calling: '.$functionName,
            'function_name' => 'cmd',
            'object' => $in
        ]);

        try {
            $this->firstDefault = null;
            $callResponse = $this->{$functionName}($in['data']);
        } catch (Exception $err) {
            $message = 'Can not call: '.$functionName.', error: '.$err->getMessage();
            $errorStack = $err->getTrace();
            $this->internal_Log([
                'level' => 'error',
                'message' => $message,
                'function_name' => $functionName,
                'object' => $errorStack
            ]);
            $callResponse['message'] = $message;
        }

        leave:

        $haveCallResponse = $this->_Empty($callResponse) === 'false';

        if ($haveCallResponse === false) {
            if (isset($callResponse) === false) {
                // If you use the callback then you must return an empty object {}
                // window.alert('Function do not return anything. ' + $in.to.plugin + '.' + $functionName);
            }
            return [];
        }

        $func = $callResponse['func'] ?? '';
        $isBatchCall = $func === 'BatchCall';
        if ($isBatchCall === true) {
            // Save the callstack for the last message that returns in the batch call
            $this->batch[$callResponse['data']['batch_id']]['callstack'] = $in['callstack'];
        }

        $outgoingMessageArray = (array) $this->_GetData([
            'name' => 'messages',
            'default' => [],
            'data' => $callResponse
        ]);

        if (count($outgoingMessageArray) > 0) {
            while (count($outgoingMessageArray) > 0) {
                $oneCallResponse = (array) array_pop($outgoingMessageArray);
                $oneCallResponse['data'] = (array) $oneCallResponse['data'] ?? [];
                $oneCallResponse['data']['i_want_a_short_tail'] = 'true';
                $callbackFunction($oneCallResponse); // Put each outgoing short tail message on the stack
            }
            unset($callResponse['messages']);
        }

        $this->configLog = [];

        if ($isBatchCall === true) {
            return []; // We have no main message to send back
        }

        $callResponse['from'] = $in['to']; // Add the message origin

        // Only messages[] are allowed to have a short tail ( = Have no call stack)
        $iWantAShortTail = $this->_GetData([
            'name' => 'data/i_want_a_short_tail',
            'default' => 'false',
            'data' => $callResponse
        ]);

        if ($iWantAShortTail === 'true') {
            // Not always we have 'data' so it must be done like this.
            $callResponse['data']['i_want_a_short_tail'] = 'false';
        }

        $callResponse['first_default'] = $this->firstDefault;

        $outgoingMessage = $callbackFunction($callResponse);

        return $outgoingMessage;
    }

    // *****************************************************************************
    // * Functions you only can reach with CMD(), add more in your class
    // * Observe function names are lower_case
    // *****************************************************************************

    /**
     * Return version date of plugin class, base class, php version, server version
     * Call the function with cmd()
     *
     * @param  array  $in
     * @return array
     * @author  Peter Lembke
     * @version 2015-09-20
     * @since   2011-09-10
     */
    private function version(array $in = []): array
    {
        $default = [
            'date' => '',
            'since' => '',
            'version' => '',
            'class_name' => '',
            'checksum' => '',
            'note' => '',
            'status' => '',
            'SPDX-License-Identifier' => '',
            'user_role' => ''
        ];

        $versionPlugin = $this->_Default($default, $this->_Version());
        $versionBase = $this->_Default($default, $this->_VersionBase());
        $functionArray = $this->_GetCmdFunctions();

        return [
            'answer' => 'true',
            'message' => 'Here are the data',
            'plugin' => $versionPlugin,
            'base' => $versionBase,
            'functions' => $functionArray,
            'version_code' => md5($versionPlugin['checksum'].$versionBase['checksum'])
        ];
    }

    /**
     * Return names of all methods in this class
     * Call the function with cmd()
     *
     * @param  array  $in
     * @return array
     * @since   2012-04-01
     *
     * @author  Peter Lembke
     * @version 2013-05-05
     */
    private function function_names(array $in = []): array
    {
        $default = [
            'include_cmd_functions' => 'true',
            'include_internal_functions' => 'true',
            'include_direct_functions' => 'true'
        ];
        $in = $this->_Default($default, $in);

        $allClassMethods = get_class_methods($this);
        $classMethods = $allClassMethods;

        $includeAll = 'true';
        if ($in['include_cmd_functions'] === 'false') {
            $includeAll = 'false';
        }
        if ($in['include_internal_functions'] === 'false') {
            $includeAll = 'false';
        }
        if ($in['include_direct_functions'] === 'false') {
            $includeAll = 'false';
        }

        if ($includeAll === 'false') {
            $classMethods = [];
            foreach ($allClassMethods as $method) {
                if (str_starts_with($method, 'internal_')) {
                    if ($in['include_internal_functions'] === 'true') {
                        $classMethods[] = $method;
                    }
                    continue;
                }
                if (str_starts_with($method, '_')) {
                    if ($in['include_direct_functions'] === 'true') {
                        $classMethods[] = $method;
                    }
                    continue;
                }
                if ($in['include_cmd_functions'] === 'true') {
                    $classMethods[] = $method;
                }
            }
        }

        $answer = [
            'answer' => 'true',
            'message' => 'All function names in this plugin',
            'data' => $classMethods
        ];

        return $answer;
    }

    /**
     * Dummy function ping that return a pong
     * Useful for getting a pong or for sending messages in a sub call.
     * Call the function with cmd()
     *
     * @param  array  $in
     * @return string[]
     * @author Peter Lembke
     * @version 2020-04-22
     * @since 2020-04-22
     */
    private function ping(array $in = []): array
    {
        $answer = [
            'answer' => 'true',
            'message' => 'pong'
        ];

        return $answer;
    }

    // *****************************************************************************
    // * Internal function that you only can reach from internal_Cmd
    // * Add more internal_ functions in your class.
    // * Function name are in internal_CamelCase
    // * An internal function get all its data from the $in-array
    // * An internal function give its answer as an array, success or error
    // *****************************************************************************

    /**
     * Execute a private internal_ function in this class
     * Will only call function names that start with internal_
     *
     * @param  array  $in  all incoming variables
     * @return array
     * @since   2013-04-12
     * @author  Peter Lembke
     * @version 2015-01-27
     */
    protected function internal_Cmd(array $in = []): array
    {
        $startTime = $this->_MicroTime();
        $default = ['func' => ''];
        $in = array_merge($default, $in);

        $message = '';
        $callResponse = [];
        $functionName = 'internal_'.$in['func'];

        $this->internal_Log([
            'message' => 'Will call: '.$functionName,
            'function_name' => 'Cmd',
            'object' => $in,
            'depth' => 1,
            'start_time' => $startTime
        ]);

        if (method_exists($this, $functionName) === false) {
            $message = 'function name: '.$functionName.', does not exist or are not allowed to be called';
            goto leave;
        }

        if (count(debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS)) > 19) {
            $message = 'You have called a sub function down to the 20th level. This is way to deep. Change your code.';
            goto leave;
        }

        $this->internal_Log([
            'message' => 'Calling: '.$functionName,
            'function_name' => 'internal_Cmd',
            'object' => $in
        ]);

        try {
            $callResponse = $this->{$functionName}($in);
        } catch (Exception $err) {
            $errorStack = $err->getTrace();
            $message = 'Can not call: '.$functionName.', error: '.$err->getMessage();

            $this->internal_Log([
                'level' => 'error',
                'message' => $message,
                'function_name' => 'internal_Cmd',
                'object' => $errorStack
            ]);

            $callResponse = [
                'answer' => 'false',
                'message' => $message
            ];
        }

        $this->internal_Log([
            'message' => 'Back from: '.$functionName,
            'function_name' => 'internal_Cmd',
            'object' => $callResponse
        ]);

        if (is_array($callResponse) === false) {
            $type = gettype($callResponse);
            $message = "Function $functionName did not return an array as it should ($type)";
            goto leave;
        }

        if ($callResponse['answer'] === 'false') {
            $message = $callResponse['message'];
            goto leave;
        }

        leave:

        if ($message !== '') {
            $callResponse['answer'] = 'false';
            $callResponse['message'] = $message;

            $this->internal_Log([
                'level' => 'error',
                'message' => 'Got error from: '.$functionName.',error: '.$message,
                'function_name' => 'internal_Cmd',
                'object' => [
                    'in' => $in,
                    'out' => $callResponse
                ]
            ]);
        }

        $callResponse['execution_time'] = $this->_MicroTime() - $startTime;

        $this->internal_Log([
            'message' => 'Leaving internal_Cmd()',
            'function_name' => 'Cmd',
            'start_time' => $startTime,
            'execution_time' => $callResponse['execution_time'],
            'depth' => -1
        ]);

        if (isset($this->configLog[$functionName]) === true) {
            // See example in infohub_checksum.json

            $this->internal_Log([
                'message' => 'Temporary debug logging',
                'level' => 'debug',
                'function_name' => $functionName,
                'execution_time' => $callResponse['execution_time'],
                'object' => [
                    'in' => $in,
                    'out' => $callResponse
                ]
            ]);
        }

        return $callResponse;
    }

    /**
     * Writes to the log array
     *
     * @param  array  $in
     * @return array
     * @todo Clean up the plugins to not call this function directly, instead use internal_Cmd(). Set this function as private
     *
     * @author  Peter Lembke
     * @version 2023-10-24
     * @since   2013-05-25
     */
    protected function internal_Log(array $in = []): array
    {
        $default = [
            'time_stamp' => $this->_TimeStampMicro(),
            'node_name' => 'server',
            'plugin_name' => $this->_GetClassName(),
            'function_name' => '',
            'message' => '',
            'level' => 'log',
            'object' => [],
            'depth' => 0,
            'get_backtrace' => 'false',
            'execution_time' => 0.0
        ];
        $in = $this->_Default($default, $in);

        $haveObjectData = count($in['object']) === 0;
        if ($haveObjectData === false) {
            unset($in['object']);
        }

        $isErrorWithBacktrace = $in['level'] === 'error' && $in['get_backtrace'] === 'true';
        if ($isErrorWithBacktrace === true) {
            $in['backtrace'] = [];
            $backtrace = debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 5);
            foreach ($backtrace as $one) {
                $default = ['file' => '', 'class' => '', 'function' => '', 'line' => 0];
                $one = $this->_Default($default, $one);
                if (empty($one['class']) === true) {
                    $one['class'] = $one['file'];
                }
                $in['backtrace'][] = $one['class'].'.'.$one['function'].' ('.$one['line'].')';
            }
        }
        unset($in['get_backtrace']);

        $haveExecutionTime = $in['execution_time'] > 0.0;
        if ($haveExecutionTime === false) {
            unset($in['execution_time']);
        }

        $this->globalLogArray[] = $in;

        return [
            'answer' => 'true',
            'message' => 'Stored the data in the log array'
        ];
    }

    /**
     * Returns a sub call message. Used by cmd(), useless for you.
     * Is private because it should only be used by the cmd() function.
     *
     * @param  array  $in
     * @return array
     * @author  Peter Lembke
     * @version 2015-01-25
     * @since   2013-11-21
     */
    private function internal_SubCall(array $in = []): array
    {
        $default = [
            'func' => 'SubCall',
            'to' => [
                'node' => 'server',
                'plugin' => 'exchange',
                'function' => 'default'
            ], // Where to send this message
            'data' => [], // The data you want to be available to the sub-function you call.
            'data_request' => [],
            // Array with variable names you want from the sub-function. Leave blank to get everything.
            'data_back' => [], // Return these variables untouched in the returning message. (OPTIONAL)
            'wait' => 10.0, // Seconds you can wait before this message really need to be sent.
            'track' => 'false', // 'true' lets Cmd add an array of where this message has been.
            'original_message' => [] // Original message that came into cmd().
        ];
        $in = $this->_Default($default, $in);

        $out = [
            'to' => $in['to'],
            'from' => $in['original_message']['to'],
            'data' => $in['data'],
            'data_request' => $in['data_request'],
            'data_back' => $in['data_back'],
            'wait' => abs($in['wait']),
            'callstack' => []
        ];

        if ($in['track'] === 'true') {
            $out['track'] = [];
        }

        if (isset($in['original_message']['callstack']) === true) {
            $out['callstack'] = $in['original_message']['callstack'];
            $callStackAdd = [
                'to' => $in['original_message']['to'],
                'data_request' => $in['data_request'],
                'data_back' => $in['data_back']
            ];
            $out['callstack'][] = $callStackAdd;
        }

        return [
            'answer' => 'true',
            'message' => 'Here are a sub call message',
            'sub_call_data' => $out
        ];
    }

    /**
     * Gives you a return call message. Only useful for the cmd() function. Useless to you.
     * Is private because it should only be used by the cmd() function.
     *
     * @param  array  $in
     * @return array
     * @author  Peter Lembke
     * @version 2013-11-22
     * @since   2013-11-22
     */
    private function internal_ReturnCall(array $in = []): array
    {
        $default = [
            'func' => 'ReturnCall',
            'variables' => [], // Outgoing response variables
            'original_message' => [] // Incoming variables
        ];
        $in = $this->_Default($default, $in);

        $messageFromCallStack = [];

        if (count($in['original_message']['callstack']) > 0) {
            // array_pop() moves the last value of the array to your variable.
            $messageFromCallStack = array_pop($in['original_message']['callstack']);
        }

        $defaultMessageFromCallStack = [
            'to' => [], // Node the return message will be sent to
            'data_back' => [], // Data we want back untouched
            'data_request' => [] // Names of specific response variables. If empty then you get the full response.
        ];

        $messageFromCallStack = $this->_Default($defaultMessageFromCallStack, $messageFromCallStack);

        $dataSend = [];

        $length = count($messageFromCallStack['data_request']);
        if ($length > 0) {
            // We only want specific variables in the response
            // @todo HUB-1646, Improve this feature
            for ($dataRequestIndex = 0; $dataRequestIndex < $length; $dataRequestIndex++) {
                $variableName = $messageFromCallStack['data_request'][$dataRequestIndex];
                if (isset($in['variables'][$variableName]) === false) {
                    continue;
                }
                $dataSend[$variableName] = $in['variables'][$variableName];
            }
        } else {
            $dataSend = $in['variables']; // We want the full response.
        }

        // 'data_back' will give you the data_back untouched. Just as we also do with the 'response' below.
        // This is for being able to reduce the $default parameters to just the required ones.
        $messageFromCallStack['data_back']['data_back'] = $messageFromCallStack['data_back'];

        // 'response' are for more advanced responses that can not be handled well with the normal array_merge below.
        // Example: Response from two sub calls where the variable name is the same but have different data type.
        // You validate the 'response' in the step that handle the sub call response.
        $messageFromCallStack['data_back']['response'] = $dataSend;

        $out = [
            'to' => $messageFromCallStack['to'], // To node
            'from' => $in['original_message']['to'],
            'callstack' => $in['original_message']['callstack'], // Rest of the callstack
            'data' => array_merge($dataSend, $messageFromCallStack['data_back']) // Kept for legacy and for simplicity
        ];

        return [
            'answer' => 'true',
            'message' => 'Here you get a return message',
            'return_call_data' => $out
        ];
    }
}