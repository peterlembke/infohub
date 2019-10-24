<?php
declare(strict_types=1);
if (basename(__FILE__) == basename($_SERVER["SCRIPT_FILENAME"])) {
    exit; // This file must be included, not called directly
}

class infohub_base
{
    // ***********************************************************
    // * The only public variables, do not add your own
    // ***********************************************************

    protected $globalLogArray = array(); // Used ONLY by internal_Log() and cmd()
    protected $firstDefault = null; // Used ONLY by the test() function.
    protected $configLog = array(); // What functions to log even if answer = 'true';

    protected final function _VersionBase(): array
    {
        return array(
            'date' => '2016-01-26',
            'version' => '1.0.0',
            'checksum' => '{{base_checksum}}',
            'class_name' => 'infohub_base',
            'note' => 'Parent class in ALL plugins. Manages the traffic in the plugin',
            'status' => 'normal',
            'license_name' => 'GNU GPL 3 or later'
        );
    }

    protected final function _GetCmdFunctionsBase(): array
    {
        return array(
            'version' => 'normal',
            'function_names' => 'normal'
        );
    }

    /**
     * Version data. Implement this function in your plugin
     * @return array
     */
    protected function _Version(): array
    {
        return array(
            'date' => '1970-01-01',
            'version' => '0.0.0',
            'class_name' => get_class($this),
            'checksum' => '{{checksum}}',
            'note' => 'Please implement this function in your plugin',
            'status' => 'emerging'
        );
    }

    /**
     * All cmd functions in this plugin.
     * Implement in your plugin.
     * Example: 'function_name' => 'emerging', or 'normal', or 'deprecated', or 'removed'
     * @return array
     */
    protected function _GetCmdFunctions(): array
    {
        return array(
            'version' => 'normal',
            'function_names' => 'normal'
        );
    }

    // *****************************************************************************
    // * The private functions, add your own in your plugin
    // * These functions can be used directly in your functions.
    // * Name: _CamelCaseData
    // *****************************************************************************

    /**
     * Makes sure you get all default variables with at least default values, and the right data type.
     * Used by: EVERY function.
     * The $default variables, You can only use: array, string, integer, float, null
     * The $in variables, You can only use: array, string, integer, float
     * @example: $in = _Default($default,$in);
     * @version 2016-01-25
     * @since   2013-09-05
     * @author  Peter Lembke
     * @param $default
     * @param $in
     * @return array
     */
    final protected function _Default(array $default = array(), array $in = array()): array
    {
        if (is_null($this->firstDefault) === true) {
            $this->firstDefault = $default;
        }

        if (is_array($default) === false and is_array($in) === true) {
            return $in;
        }
        if (is_array($default) === true and is_array($in) === false) {
            return $default;
        }

        // On this level: Remove all variables that are not in default. Add all variables that are only in default.
        $answer = array_intersect_key(array_merge($default, $in), $default);

        // Check the data types
        foreach ($default as $key => $data) {
            if (gettype($answer[$key]) !== gettype($default[$key])) {
                if (is_null($default[$key]) === false) {
                    $this->internal_Log(array(
                        'level' => 'error',
                        'message' => 'key:"' . $key . '", have wrong data type (' . gettype($in[$key]) . '), instead got default value and data type (' . gettype($default[$key]) . ')',
                        'function_name' => '_Default',
                        'get_backtrace' => 'true'
                    ));
                    $answer[$key] = $default[$key];
                }
                continue;
            }
            if (is_null($default[$key]) === true and is_null($answer[$key]) === true) {
                $answer[$key] = '';
                continue;
            }
            if (is_array($default[$key]) === false) {
                continue;
            }
            if (count($default[$key]) === 0) {
                continue;
            }
            $answer[$key] = $this->_Default($default[$key], $answer[$key]);
        }

        return $answer;
    }

    /**
     * Merge two arrays together
     * @param array $default
     * @param array $in
     * @return array
     */
    final protected function _Merge(array $default = array(), array $in = array()): array
    {
        if (is_array($default) === false and is_array($in) === false) {
            return array();
        }
        if (is_array($default) === false and is_array($in) === true) {
            return $in;
        }
        if (is_array($default) === true and is_array($in) === false) {
            return $default;
        }

        $data = array_merge($default, $in);
        return $data;
    }

    /**
     * Return current time stamp as a string in the format "yyyy-mm-dd hh:mm:ss"
     * Give 'c' to also get the time zone offset.
     * @param string $in
     * @return bool|string
     */
    final protected function _TimeStamp(string $in = ''): string
    {
        if ($in === 'c') {
            return date('c');
        }
        return date('Y-m-d H:i:s');
    }

    /**
     * Return a datetime with microseconds.
     * Used for logging purpose where seconds is not enough.
     * From: https://stackoverflow.com/questions/169428/php-datetime-microseconds-always-returns-0
     * @return string
     */
    final protected function _TimeStampMicro(): string
    {
        $microTime = microtime(true);
        $microSeconds = sprintf("%06d",($microTime - floor($microTime)) * 1000000);
        $date = date('Y-m-d H:i:s', (int)$microTime) . '.' . $microSeconds;
        return $date;
    }

    /**
     * Return current time since EPOC (1970-01-01 00:00:00),
     * as seconds and fraction of seconds.
     * @return float
     */
    final protected function _MicroTime(): float
    {
        return microtime(true);
    }

    final protected function _Empty($object): string
    {
        if (empty($object) === false) {
            return 'false';
        }
        return 'true';
    }
    
    /**
     * Wrapper so it is easier to change the places where json is used.
     * @param $data
     * @return string
     */
    final protected function _JsonEncode(array $data = array()): string
    {
        $options = JSON_PRETTY_PRINT + JSON_PRESERVE_ZERO_FRACTION;
        $row = json_encode($data, $options);
        return $row;
    }

    /**
     * Wrapper so it is easier to change the places where json is used.
     * @param $row string
     * @return string
     */
    final protected function _JsonDecode(string $row = ''): array
    {
        if (substr($row, 0, 1) !== '{' && substr($row, 0, 1) !== '[') {
            return array();
        }
        $data = json_decode($row, $asArray = true);
        return $data;
    }

    /**
     * Read value from any data collection
     * Name can be 'just_a_name' or 'some/deep/level/data'
     * @param $in
     * @return mixed
     */
    final protected function _GetData(array $in = array())
    {
        $default = array(
            'name' => '',
            'default' => null,
            'data' => array(),
            'split' => '/'
        );
        $in = $this->_Default($default, $in);

        $names = explode($in['split'], $in['name']);
        $length = count($names);
        $answer = $in['data'];
        for ($i = 0; $i < $length; $i++) {
            if (isset($answer[$names[$i]]) === true) {
                $answer = $answer[$names[$i]];
            } else {
                return $in['default'];
            }
        }

        if (gettype($answer) !== gettype($in['default'])) {
            $answer = $in['default'];
        }

        return $answer;
    }

    /**
     * Takes the first found key data from the object and gives it to you, removing it from the object.
     * Used in loops when sending one item at the time in a subcall.
     * @param $in
     * @return array
     */
    final protected function _Pop(array $in = array()): array
    {
        foreach ($in as $key => $data) {
            unset($in[$key]);
            return array('key'=> $key, 'data'=> $data, 'object'=> $in );
        }
        return array('key'=> '', 'data'=> '', 'object'=> array() );
    }

    /**
     * Create the subCall array to return to cmd.
     * @param array $in
     * @return array
     */
    final protected function _SubCall(array $in = array()): array
    {
        $default = array(
            'func' => 'SubCall',
            'to' => array('node' => '', 'plugin' => '', 'function' => ''),
            'data' => array(),
            'data_back' => array(),
            'track' => 'false',
            'wait' => 0.2
        );
        $out = $this->_Default($default, $in);
        return $out;
    }

    /**
     * Status on Cmd functions: never_existed, emerging, normal, deprecated, retired
     * @param string $functionName
     * @return array
     */
    final function _GetCmdFunctionStatus(string $functionName = ''): array
    {
        $status = 'never_existed';
        $functionsBase = $this->_GetCmdFunctionsBase();
        $functions = $this->_GetCmdFunctions();
        $functions = array_merge($functionsBase, $functions);
        if (isset($functions[$functionName])) {
            $status = $functions[$functionName];
        }

        $statuses = array(
            'never_existed' => array(
                'status' => 'never_existed',
                'information' => 'Function "{this function}" have never existed in plugin {this plugin}. Or is it just missing in _GetCmdFunctions?',
                'value' => 0
            ),
            'emerging' => array(
                'status' => 'emerging',
                'information' => 'New feature in {this plugin} that probably will be changed during this major version. In the next major version, function "{this function}" will either be normal or removed',
                'value' => 1
            ),
            'normal' => array(
                'status' => 'normal',
                'information' => 'You can use function "{this function}" in plugin {this plugin}. It will work in this major version. It will get bug fixes but will work as normal',
                'value' => 2
            ),
            'deprecated' => array(
                'status' => 'deprecated',
                'information' => 'You can use function "{this function}" in plugin {this plugin} but it will be removed in the next major version',
                'value' => 1
            ),
            'removed' => array(
                'status' => 'removed',
                'information' => 'Function "{this function}" have existed in plugin {this plugin} but became deprecated and have now been removed in this major version',
                'value' => 0
            )
        );

        $response = array(
            'status' => $status,
            'information' => 'This is an unknown status. I will not try to call the function name',
            'value' => 0
        );

        if (isset($statuses[$status]))
        {
            $response = $statuses[$status];
            $response['information'] = str_replace('{this function}', $functionName, $response['information']);

            $pluginName = $this->_GetClassName();
            $response['information'] = str_replace('{this plugin}', $pluginName, $response['information']);
        }

        $response['function_name'] = $functionName;

        return $response;
    }

    /**
     * Get the class name in this plugin
     * @return string
     */
    final function _GetClassName(): string
    {
        return get_class($this);
    }

    /**
     * Get name of the plugin that sent the message
     * Used in cmd(). Useless for you to use. Will give you an empty answer.
     * @param array $in
     * @return array
     */
    final function _GetCallerPluginName(array $in = array()): array
    {
        $default = array(
            'callstack' => array()
        );
        $in = $this->_Default($default, $in);

        $fromPlugin = array();

        $lastInCallStack = end($in['callstack']);
        if (is_array($lastInCallStack) === true) {
            if (isset($lastInCallStack['to'])) {
                $fromPlugin = $lastInCallStack['to'];
            }
        }

        $default = array(
            'node' => '',
            'plugin' => '',
            'function' => ''
        );
        $fromPlugin = $this->_Default($default, $fromPlugin);

        return array(
            'answer' => 'true',
            'message' => 'Message come from this plugin',
            'from_plugin' => $fromPlugin
        );
    }

    // *****************************************************************************
    // * The only public functions, do not add your own, not even in your class
    // *****************************************************************************

    /**
     * Execute one private function in this class
     * Used by: Infohub Exchange or if you use the class outside of InfoHub.
     * Will only call function names that DO NOT start with internal_ or _
     * Will ONLY reveal
     * @version 2013-12-29
     * @since   2011-11-19
     * @author  Peter Lembke
     * @param array $in
     * @return array
     * @uses message_to_function | string | The name of the function we want to call
     */
    final public function cmd(array $in = array()): array
    {
        $startTime = $this->_MicroTime();
        $this->globalLogArray = array();

        $default = array(
            'to' => array('node' => 'server', 'plugin' => '', 'function' => ''),
            'callstack' => array(),
            'data' => array(),
            'data_back' => array(),
            'wait' => 0.2
        );
        $in = $this->_Default($default, $in);

        $answer = 'false';
        $message = '';

        $out = array(
            'data' => array()
        );
        $callResponse = array(
            'answer' => $answer,
            'message' => $message
        );

        if (isset($in['data']['config']['log']))
        {
            // See example in infohub_checksum.json

            $this->configLog = $this->_GetData(array(
                'name' => 'data/config/log',
                'default' => array(),
                'data' => $in
            ));
            unset($in['data']['config']['log']);
        }

        $functionName = strtolower($in['to']['function']);
        $this->internal_Log(array('message' => 'Will call: ' . $functionName, 'function_name' => 'cmd', 'object' => $in, 'depth' => 1));

        if ($functionName === 'cmd' or is_int(strpos($functionName, 'internal_')) == true or substr($functionName, 0, 1) === '_') {
            $message = 'function name: ' . $functionName . ', are not allowed to be called';
            $callResponse['message'] = $message;
            goto leave;
        }

        $status = $this->_GetCmdFunctionStatus($functionName);
        if ($status['value'] < 1) {
            $message = '(' . $status['status'] . ') ' . $status['information'];
            $callResponse['message'] = $message;
            goto leave;
        }

        $response = $this->_GetCallerPluginName($in);
        $in['data']['from_plugin'] = $response['from_plugin']; // For rights purposes. Do not do this with the callstack or other data. You get node, plugin function name.

        if (method_exists($this, $functionName) === false) {
            $message = 'function name: ' . $functionName . ', does not exist or are not allowed to be called';
            $callResponse['message'] = $message;
            goto leave;
        }

        $this->internal_Log(array('message' => 'Calling: ' . $functionName, 'function_name' => 'cmd', 'object' => $in));
        try {
            $this->firstDefault = null;
            $callResponse = $this->{$functionName}($in['data']);
        } catch (Exception $err) {
            $message = 'Can not call: ' . $functionName . ', error: ' . $err->getMessage();
            $errorStack = $err->getTrace();
            $this->internal_Log(array(
                'level' => 'error',
                'message' => $message,
                'function_name' => $functionName,
                'object' => $errorStack
            ));
            $callResponse['message'] = $message;
        }

        if (is_array($callResponse) === false) {
            $message = 'Function: ' . $functionName . ', did not return an object as it should. (' . gettype($callResponse) . ')';
            $callResponse = array();
        }

        $this->internal_Log(array(
            'message' => 'Back from: ' . $functionName,
            'function_name' => $functionName,
            'object' => $callResponse
        ));

        leave:

        // If we have no 'func' then we get a ReturnCall
        $callResponse = array_merge(array('func' => 'ReturnCall'), $callResponse);

        if ($callResponse['func'] === 'SubCall') {
            $subCall = $callResponse;
            $subCall['original_message'] = $in;
            $response = $this->internal_Cmd($subCall);
            if ($response['answer'] === 'false') {
                $message = $response['message'];
            }
            $out = $response['sub_call_data'];
        }

        if ($callResponse['func'] === 'ReturnCall') {
            $response = $this->internal_Cmd(array(
                'func' => 'ReturnCall',
                'variables' => $callResponse,
                'original_message' => $in
            ));
            if ($response['answer'] === 'false') {
                $message = $response['message'];
            }
            $out = $response['return_call_data'];
        }

        if ($message !== '') {
            $out['data']['message'] = $message;
            $callResponse['message'] = $message;
            $this->internal_Log(array(
                'message' => $message,
                'function_name' => $functionName,
                'object' => array(
                    'in' => $in,
                    'out' => $out
                )
            ));
        }

        $out['execution_time'] = $this->_MicroTime() - $startTime;
        $this->internal_Log(array(
            'message' => 'Leaving cmd()',
            'function_name' => $functionName,
            'depth' => -1,
            'execution_time' => $out['execution_time']
        ));

        if (isset($status)) {
            $out['function_status'] = $status;

            if ($status['value'] === 1) {
                $sleep = (int) ($out['execution_time'] * 1000);
                usleep($sleep); // There is a cost in using emerging and deprecated functions.
            }
        }

        if (isset($this->configLog[$functionName]))
        {
            // See example in infohub_checksum.json

            $this->internal_Log(array(
                'message' => 'Temporary debug logging',
                'level' => 'debug',
                'function_name' => $functionName,
                'execution_time' => $out['execution_time'],
                'object' => array(
                    'in' => $in,
                    'out' => $out
                )
            ));
        }
        $this->configLog = array();

        $out['log_array'] = $this->globalLogArray;

        return $out;
    }

    /**
     * Only used in the test program for testing purposes only
     * @version 2015-01-29
     * @since 2014-09-06
     * @author Peter Lembke
     * @param string $functionName | Name of the plugin to call
     * @param array $in
     * @return array
     */
    final public function test(string $functionName = '', array $in = array()): array
    {
        $callResponse = array();
        $errorMessage = '';

        if (is_string($functionName) === false) {
            goto leave;
        }
        if ($in === 'file') {
            $in = array();
        }

        $this->firstDefault = null;
        $GLOBALS['infohub_error_message'] = '';

        try {
            $callResponse = $this->{$functionName}($in);
        } catch (Exception $e) {
            $errorMessage = $e->getMessage();
        }

        if (empty($errorMessage) === true) {
            if (empty($GLOBALS['infohub_error_message']) === false) {
                $errorMessage = $GLOBALS['infohub_error_message'];
            }
        }

        leave:

        $answer = array(
            'in' => $in,
            'default' => $this->firstDefault,
            'out' => $callResponse,
            'error_message' => $errorMessage
        );
        return $answer;
    }

    // *****************************************************************************
    // * Functions you only can reach with CMD(), add more in your class
    // * Observe function names are lower_case
    // *****************************************************************************

    /**
     * Return version date of plugin class, base class, php version, server version
     * @version 2015-09-20
     * @since   2011-09-10
     * @author  Peter Lembke
     * @param array $in
     * @return array
     */
    final protected function version(array $in = array()): array
    {
        $default = array(
            'date' => '',
            'version' => '',
            'checksum' => '',
            'class_name' => '',
            'note' => '',
            'status' => ''
        );

        $versionPlugin = $this->_Default($default, $this->_Version());
        $versionBase = $this->_Default($default, $this->_VersionBase());

        $serverInfo = array(
            'php_version' => PHP_VERSION,
            'server_version' => $_SERVER["SERVER_SOFTWARE"]
        );

        return array(
            'answer' => 'true',
            'message' => 'Here are the data',
            'plugin' => $versionPlugin,
            'base' => $versionBase,
            'server_info' => $serverInfo,
            'version_code' => md5($versionPlugin['checksum'] . $versionBase['checksum'])
        );
    }

    /**
     * Return names of all methods in this class
     * @version 2013-05-05
     * @since   2012-04-01
     * @author  Peter Lembke
     * @param array $in
     * @return array
     */
    final protected function function_names(array $in = array()): array
    {
        $answer = array(
            'answer' => 'true',
            'message' => 'All function names in this plugin',
            'data' => get_class_methods($this)
        );
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
     * Exectute a private internal_ function in this class
     * Will only call function names that start with internal_
     * @version 2015-01-27
     * @since   2013-04-12
     * @author  Peter Lembke
     * @param $in | all incoming variables
     * @return array
     */
    final protected function internal_Cmd(array $in = array()): array
    {
        $startTime = $this->_MicroTime();
        $default = array('func' => '');
        $in = array_merge($default, $in);

        $message = '';
        $callResponse = array();
        $functionName = 'internal_' . $in['func'];

        $this->internal_Log(array(
            'message' => 'Will call: ' . $functionName,
            'function_name' => 'Cmd',
            'object' => $in,
            'depth' => 1,
            'start_time' => $startTime
        ));

        if (count(debug_backtrace()) > 19) {
            $message = 'You have called a sub function down to the 20th level. This is way to deep. Change your code.';
            goto leave;
        }

        if (method_exists($this, $functionName) === false) {
            $message = 'function name: ' . $functionName . ', does not exist or are not allowed to be called';
            goto leave;
        }

        $this->internal_Log(array(
            'message' => 'Calling: ' . $functionName,
            'function_name' => 'internal_Cmd',
            'object' => $in
        ));

        try
        {
            $this->firstDefault = null;
            $callResponse = $this->{$functionName}($in);
        }
        catch (Exception $err)
        {
            $errorStack = $err->getTrace();
            $message = 'Can not call: ' . $functionName . ', error: ' . $err->getMessage();

            $this->internal_Log(array(
                'level' => 'error',
                'message' => $message,
                'function_name' => 'internal_Cmd',
                'object' => $errorStack
            ));

            $callResponse = array(
                'answer'=> 'false',
                'message'=> $message
            );
        }

        $this->internal_Log(array(
            'message' => 'Back from: ' . $functionName,
            'function_name' => 'internal_Cmd',
            'object' => $callResponse
        ));

        if (is_array($callResponse) === false) {
            $message = 'Function ' . $functionName . ' did not return an array as it should (' . gettype($callResponse) . ')';
            goto leave;
        }

        if ($callResponse['answer'] === 'false') {
            $message = $callResponse['message'];
            goto leave;
        }

        leave:

        if ($message !== '')
        {
            $callResponse['answer'] = 'false';
            $callResponse['message'] = $message;

            $this->internal_Log(array(
                'level' => 'error',
                'message' => 'Got error from: ' . $functionName . ',error: ' . $message,
                'function_name' => 'internal_Cmd',
                'object' => array(
                    'in' => $in,
                    'out' => $callResponse
                )
            ));
        }

        $callResponse['execution_time'] = $this->_MicroTime() - $startTime;

        $this->internal_Log(array(
            'message' => 'Leaving internal_Cmd()',
            'function_name' => 'Cmd',
            'start_time' => $startTime,
            'execution_time' => $callResponse['execution_time'],
            'depth' => -1
        ));

        if (isset($this->configLog[$functionName]))
        {
            // See example in infohub_checksum.json

            $this->internal_Log(array(
                'message' => 'Temporary debug logging',
                'level' => 'debug',
                'function_name' => $functionName,
                'execution_time' => $callResponse['execution_time'],
                'object' => array(
                    'in' => $in,
                    'out' => $callResponse
                )
            ));
        }

        return $callResponse;
    }

    /**
     * Writes to the log array
     * @version 2015-09-16
     * @since   2013-05-25
     * @author  Peter Lembke
     * @param array $in
     * @return array
     */
    final protected function internal_Log(array $in = array()): array
    {
        $default = array(
            'time_stamp' => $this->_TimeStampMicro(),
            'node_name' => 'server',
            'plugin_name' => $this->_GetClassName(),
            'function_name' => '',
            'message' => '',
            'level' => 'log',
            'object' => array(),
            'depth' => 0,
            'get_backtrace' => 'false',
            'execution_time' => 0.0
        );
        $in = $this->_Default($default, $in);

        if (count($in['object']) === 0) {
            unset($in['object']);
        }

        if ($in['level'] === 'error') {
            if ($in['get_backtrace'] === 'true') {
                $in['backtrace'] = array();
                $backtrace = debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 5);
                foreach ($backtrace as $one)
                {
                    $default = array('file' => '', 'class' => '', 'function' => '', 'line' => 0);
                    $one = $this->_Default($default, $one);
                    if (empty($one['class'])) {
                        $one['class'] = $one['file'];
                    }
                    $in['backtrace'][] = $one['class'] . '.' . $one['function'] . ' (' . $one['line'] . ")";
                }
            }
        }
        unset($in['get_backtrace']);

        if ($in['execution_time'] === 0.0) {
            unset($in['execution_time']);
        }

        $this->globalLogArray[] = $in;

        return array(
            'answer' => 'true',
            'message' => 'Stored the data in the log array'
        );
    }

    /**
     * Returns a sub call message. Used by cmd(), useless for you.
     * @version 2015-01-25
     * @since   2013-11-21
     * @author  Peter Lembke
     * @param array $in
     * @return array
     */
    final protected function internal_SubCall(array $in = array()): array
    {
        $default = array(
            'func' => 'SubCall',
            'to' => array('node' => 'server', 'plugin' => 'exchange', 'function' => 'default'), // Where to send this message
            'data' => array(), // The data you want to be available to the sub-function you call.
            'data_request' => array(), // Array with variable names you want from the sub-function. Leave blank to get everything.
            'data_back' => array(), // Return these variables untouched in the returning message. (OPTIONAL)
            'wait' => 10.0, // Seconds you can wait before this message really need to be sent.
            'track' => 'false', // 'true' lets Cmd add an array of where this message have been.
            'original_message' => array() // Original message that came into cmd().
        );
        $in = $this->_Default($default, $in);

        $out = array(
            'to' => $in['to'],
            'data' => $in['data'],
            'data_back' => $in['data_back'],
            'wait' => abs($in['wait']),
            'callstack' => array()
        );

        if ($in['track'] === 'true') {
            $out['track'] = array();
        }

        if (isset($in['original_message']['callstack']) === true) {
            $out['callstack'] = $in['original_message']['callstack'];
            $callStackAdd = array(
                'to' => $in['original_message']['to'],
                'data_back' => $in['data_back'],
                'data_request' => $in['data_request']
            );
            $out['callstack'][] = $callStackAdd;
        }
        return array(
            'answer' => 'true',
            'message' => 'Here are a sub call message',
            'sub_call_data' => $out
        );
    }

    /**
     * Give you a return call message. Used by cmd(), useless for you.
     * @version 2013-11-22
     * @since   2013-11-22
     * @author  Peter Lembke
     * @param array $in
     * @return array
     */
    final protected function internal_ReturnCall(array $in = array()): array
    {
        $default = array(
            'func' => 'ReturnCall',
            'variables' => array(), // Outgoing response variables
            'original_message' => array() // Incoming variables
        );
        $in = $this->_Default($default, $in);

        $defaultMessageFromCallStack = array(
            'to' => array(), // Node the return message will be sent to
            'data_back' => array(), // Data we want back untouched
            'data_request' => array() // Names of specific response variables. If empty then you get the full response.
        );
        $messageFromCallStack = array();
        $dataSend = array();

        if (count($in['original_message']['callstack']) > 0) {
            // array_pop() moves the last value of the array to your variable.
            $messageFromCallStack = array_pop($in['original_message']['callstack']);
        }
        $messageFromCallStack = $this->_Default($defaultMessageFromCallStack, $messageFromCallStack);

        $length = count($messageFromCallStack['data_request']);
        if ($length > 0) {
            // We only want specific variables in the response
            for ($i = 0; $i < $length; $i++) {
                $variableName = $messageFromCallStack['data_request'][$i];
                if (isset($in['variables'][$variableName]) === true) {
                    $dataSend[$variableName] = $in['variables'][$variableName];
                }
            }
        } else {
            $dataSend = $in['variables']; // We want the full response.
        }

        // 'data_back' will give you the data_back untouched. Just as we also do with the 'response' below.
        // This is for being able to reduce the $default parameters to just the required ones.
        $messageFromCallStack['data_back']['data_back'] = $messageFromCallStack['data_back'];

        // 'response' are for more advanced responses that can not be handled well with the normal array_merge below.
        // Example: Response from two subcalls where the variable name is the same but have different data type.
        // You validate the 'response' in the step that handle the subcall response.
        $messageFromCallStack['data_back']['response'] = $dataSend;

        $out = array(
            'to' => $messageFromCallStack['to'], // To node
            'callstack' => $in['original_message']['callstack'], // Rest of the callstack
            'data' => array_merge($dataSend, $messageFromCallStack['data_back']) // Kept for legacy and for simplicity
        );

        return array(
            'answer' => 'true',
            'message' => 'Here you get a return message',
            'return_call_data' => $out
        );
    }
}
