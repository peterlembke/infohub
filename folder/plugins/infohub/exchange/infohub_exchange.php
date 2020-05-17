<?php
declare(strict_types=1);
if (basename(__FILE__) == basename($_SERVER["SCRIPT_FILENAME"])) {
    exit; // This file must be included, not called directly
}

/**
 * infohub_exchange move messages to their destinations.
 * @category InfoHub
 * @package InfoHub Exchange
 * @copyright Copyright (c) 2010-, Peter Lembke, CharZam soft (CharZam.com / InfoHub.se)
 * @since 2012-01-01
 * @author Peter Lembke <peter.lembke@infohub.se>
 * @link https://infohub.se/ InfoHub main page
 * @license InfoHub is distributed under the terms of the GNU General Public License
 * InfoHub is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * InfoHub is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 * You should have received a copy of the GNU General Public License
 * along with InfoHub.    If not, see <https://www.gnu.org/licenses/>.
 */
class infohub_exchange extends infohub_base {

    protected $signCodeValid = 'false';
    public function getSignCodeValid(): string
    {
        return $this->signCodeValid;
    }

    protected $guestValid = 'false';
    public function getGuestValid(): string
    {
        return $this->guestValid;
    }

    protected $userName = '';
    protected function _GetUserName(): string
    {
        return $this->userName;
    }

    protected $sessionId = '';
    protected function _GetSessionId(): string
    {
        return $this->sessionId;
    }

    /** @var string Used by responder_verify_sign_code to prevent sending an answer with echo. See infohub.php */
    protected $sendAnswer = 'true';

    /** @var array Contain a lookup array with allowed plugin names for this user */
    protected $allowedServerPluginNamesLookupArray = array();
    protected function _GetAllowedServerPluginNames(): array
    {
        return $this->allowedServerPluginNamesLookupArray;
    }

    /** @var array Contain a lookup array with allowed client plugin names for this user */
    protected $allowedClientPluginNamesLookupArray = array();
    protected function _GetAllowedClientPluginNames(): array
    {
        return $this->allowedClientPluginNamesLookupArray;
    }

    final protected function _Version(): array
    {
        return array(
            'date' => '2016-01-28',
            'version' => '1.0.0',
            'checksum' => '{{checksum}}',
            'class_name' => 'infohub_exchange',
            'note' => 'Handle all messages so they come to the right plugin',
            'status' => 'normal',
            'SPDX-License-Identifier' => 'GPL-3.0-or-later',
            'recommended_security_group' => 'core'
        );
    }

    /**
     * Array with cmd functions that exist or have existed in any release
     * @return array
     */
    protected function _GetCmdFunctions(): array
    {
        return array(
            'main' => 'normal',
            'plugin_started' => 'normal',
            'responder_verify_sign_code' => 'normal'
        );
    }

    Protected $Sort = array(); // Array with all unsorted messages
    Protected $ToPending = array(); // Array with all messages going to Pending or will be discarded
    Protected $Pending = array(); // Messages waiting for a plugin to be loaded, $Pending["pluginname"]=array()
    Protected $Plugin = array('infohub_exchange' => array()); // Object with all started plugins. $Plugin["pluginname"]={}
    Protected $PluginMissing = array(); // Object with all missing plugins. $PluginMissing['pluginname']={}
    Protected $Stack = array(); // Array with commands waiting to be executed in a loaded plugin
    Protected $ToNode = array(); // Array with all messages going to the nodes

    /**
     * infohub_exchange constructor.
     * Create new instances of the core plugins I included in infohub.php
     * infohub_exchange already have an instance since we are in that plugin.
     */
    function __construct() {
        $funcNumArgs = func_num_args();
        if ($funcNumArgs == 0) {
            return;
        }
        $includedCorePlugins = func_get_args();
        foreach ($includedCorePlugins[0] as $pluginName) {
            if ($pluginName !== 'infohub_exchange') {
                $this->Plugin[$pluginName] = new $pluginName();
            }
        }
    }

    // *****************************************************************************
    // * Functions you only can reach with CMD()
    // * Observe! function names are lower_case
    // *****************************************************************************

    /**
     * Get the request from the client and parse it.
     * example: See infohub.php for the usage
     *
     * @version 2013-12-30
     * @since 2012-11-17
     * @author Peter Lembke
     * @param array $in
     * @return array
     */
    final protected function main(array $in = array())
    {
        $default = array(
            'package' => array(),
            'answer' => 'false',
            'message' => ''
        );
        $in = $this->_Default($default, $in);

        $this->sendAnswer = 'true';

        $this->internal_Cmd(array(
            'func' => 'ToSort',
            'package' => $in['package']
        ));
        unset($in['package']);
        $addedTransferMessage = 'false';

        $loopCount = 0;
        do {
            $moreToDo = 'false';
            if (count($this->Sort) > 0) {
                $moreToDo = 'true';
                $this->internal_Cmd(array('func' => 'Sort'));
            }
            if (count($this->ToPending) > 0) {
                $moreToDo = 'true';
                $this->internal_Cmd(array('func' => 'ToPending'));
            }
            if (count($this->Stack) > 0) {
                $moreToDo = 'true';
                $this->internal_Cmd(array('func' => 'Stack'));
            }
            if ($moreToDo === 'false' and $addedTransferMessage === 'false') {
                $moreToDo = 'true';
                if ($this->sendAnswer === 'true') {
                    $this->_AddTransferMessage();
                }
                $addedTransferMessage = 'true';
            }

            $loopCount++;
        } while ($moreToDo === 'true' and $loopCount < 150);

        $in['answer'] = 'true';
        $in['message'] = 'Have handled all messages in all queues';
        if ($moreToDo === 'true') {
            $in['answer'] = 'false';
            $in['message'] = 'There are more messages to handle but we have already ran 150 loops. Will continue later';
            $this->internal_Log(array(
                'func' => 'Log',
                'level' => 'error',
                'message' => $in['message'],
                'function_name' => 'main'
            ));
        }

        return array(
            'answer' => $in['answer'],
            'message' => $in['message']
        );
    }

    /**
     * This message are added when all othermessages have been processed.
     * Its purpose is to call infohub:_transfer -> send so that the processed
     * messages answers can be sent back to the querying node.
     * @version 2020-04-07
     * @since 2016-01-31
     * @author Peter Lembke
     * @return string
     */
    final protected function _AddTransferMessage(): string
    {
        if (count($this->ToNode) <= 0) {
            return 'true'; // Nothing to send. Mission accomplished
        }

        $subCall = $this->_SubCall(array(
            'to' => array(
                'node' => 'server',
                'plugin' => 'infohub_transfer',
                'function' => 'send'
            ),
            'data' => array(
                'to_node' => $this->ToNode
            )
        ));

        $subCall['from'] = array(
            'node' => 'server',
            'plugin' => 'infohub_exchange',
            'function' => 'main'
        );

        $subCall['callstack'] = array();

        $subCall['callstack'][0] = array(
            'to' => array(
                'node' => 'client',
                'plugin' => 'infohub_exchange',
                'function' => 'main'
            ),
            'data_back' => array()
        );

        $this->ToNode = array();
        $this->Sort[] = $subCall;

        return 'true';// Message added. Mission accomplished
    }

    /**
     * Handle the queue messages for the started plugin
     * @version 2016-01-30
     * @since 2016-01-30
     * @author Peter Lembke
     * @param array $in
     * @return array
     */
    final protected function plugin_started(array $in = array())
    {
        $default = array(
            'plugin_name' => '',
            'plugin_started' => 'false'
        );
        $in = $this->_Default($default, $in);

        $answer = 'false';
        $message = 'There was an error, could not start plugin:' . $in['plugin_name'];

        if (isset($this->Pending[$in['plugin_name']]) === false) {
            $message = 'We have not requested this plugin:' . $in['plugin_name'] . ', skip it';
            goto leave;
        }

        if (count($this->Pending[$in['plugin_name']]) === 0) {
            $message = 'We have no pending messages to this plugin:' . $in['plugin_name'] . ', skip it';
            goto leave;
        }

        if ($in['plugin_started'] !== 'true')
        {
            // The plugin could not be started. We have some pending messages to handle.
            $message = 'Could not find plugin on the server';

            $this->internal_Log(array(
                'function_name' => __FUNCTION__,
                'message' => $message,
                'level' => 'error',
                'object' => array('plugin' => $in['plugin_name'] )
            ));

            $PluginMissing[$in['plugin_name']] = array();

            foreach ($this->Pending[$in['plugin_name']] as $key => $dataMessage) {
                $this->_SendMessageBackPluginNotFound($dataMessage);
            }

            $this->Pending[$in['plugin_name']] = array();

            goto leave;
        }

        try {
            $this->Plugin[$in['plugin_name']] = new $in['plugin_name']();
        } catch (Exception $err) {
            $message = 'Can not not instantiate class:' . $in['plugin_name'] . ', error:' . $err->getMessage();
            goto leave;
        }

        // Move messages from Pending to Stack
        while (count($this->Pending[$in['plugin_name']]) > 0) {
            $dataMessage = array_pop($this->Pending[$in['plugin_name']]); // Remove from Pending
            $this->Stack[] = $dataMessage; // Add to Stack
        }
        unset($this->Pending[$in['plugin_name']]);

        $answer = 'true';
        $message = 'Plugin messages moved to stack';

        leave:
        return array(
            'answer' => $answer,
            'message' => $message
        );
    }

    /**
     * We get an incoming package and verify the sign_code
     * Then set a public class property
     * @version 2020-04-18
     * @since 2020-04-13
     * @author Peter Lembke
     * @param array $in
     * @return array
     */
    final protected function responder_verify_sign_code(array $in = array()): array
    {
        $default = array(
            'package' => array(
                'messages' => array(),
                'messages_checksum' => '',
                'session_id' => '',
                'sign_code' => '',
                'sign_code_created_at' => ''
            ),
            'answer' => 'false',
            'message' => '',
            'step' => 'step_simple_tests',
            'response' => array(
                'answer' => 'false',
                'message' => '',
                'sign_code_valid' => 'false',
                'initiator_user_name' => '',
                'server_plugin_names' => array(),
                'client_plugin_names' => array()
            )
        );
        $in = $this->_Default($default, $in);

        $out = array(
            'answer' => 'false',
            'message' => 'Nothing to report',
            'sign_code_valid' => 'false',
            'guest_valid' => 'false',
            'initiator_user_name' => ''
        );

        $allowedSteps = array('step_simple_tests', 'step_verify_sign_code_response');
        if (in_array($in['step'], $allowedSteps) === false) {
            $out['message'] = 'Step manipulation detected';
            $in['step'] = 'step_end';
        }

        if ($in['step'] === 'step_simple_tests') {

            $in['step'] = 'step_verify_sign_code';

            if ($this->_Empty($in['package']['session_id']) === 'true') {
                $out['message'] = 'session_id is empty';
                $in['step'] = 'step_guest';
            }

            if ($this->_Empty($in['package']['sign_code']) === 'true') {
                $out['message'] = 'sign_code is empty';
                $in['step'] = 'step_guest';
            }
        }

        if ($in['step'] === 'step_verify_sign_code') {
            return $this->_SubCall(array(
                'to' => array(
                    'node' => 'server',
                    'plugin' => 'infohub_session',
                    'function' => 'responder_verify_sign_code'
                ),
                'data' => array(
                    'session_id' => $in['package']['session_id'],
                    'messages_checksum' => $in['package']['messages_checksum'],
                    'sign_code' => $in['package']['sign_code'],
                    'sign_code_created_at' => $in['package']['sign_code_created_at']
                ),
                'data_back' => array(
                    'package' => $in['package'],
                    'step' => 'step_verify_sign_code_response'
                )
            ));
        }

        if ($in['step'] === 'step_verify_sign_code_response') {

            $in['step'] = 'step_valid_sign_code';

            if ($in['response']['sign_code_valid'] === 'false') {
                $out['message'] = $in['response']['message'];
                $in['step'] = 'step_guest';
            }
        }

        if ($in['step'] === 'step_valid_sign_code') {

            $allowedServerPlugins = array();
            if (isset($in['response']['server_plugin_names'])) {
                $allowedServerPlugins = array_fill_keys($in['response']['server_plugin_names'], $dummyValue = array());
            }
            $this->allowedServerPluginNamesLookupArray = $allowedServerPlugins;

            $allowedClientPlugins = array();
            if (isset($in['response']['client_plugin_names'])) {
                $allowedClientPlugins = array_fill_keys($in['response']['client_plugin_names'], $dummyValue = array());
            }
            $this->allowedClientPluginNamesLookupArray = $allowedClientPlugins;

            $out = array(
                'answer' => 'true',
                'message' => 'Sign code is valid',
                'sign_code_valid' => 'true',
                'guest_valid' => 'false',
                'initiator_user_name' => $in['response']['initiator_user_name']
            );

            $this->signCodeValid = 'true';
            $this->sendAnswer = 'false';
            $this->userName = $out['initiator_user_name'];
            $this->sessionId = $in['package']['session_id'];
        }

        if ($in['step'] === 'step_guest') {
            // sign_code is invalid. Perhaps messages are ok for a guest.

            $allowedServerPlugins = array(
                'infohub_plugin' => array('plugins_request' => 1),
                'infohub_login' => array('login_request' => 1, 'login_challenge' => 1),
                'infohub_session' => array('responder_end_session' => 1),
                'infohub_asset' => array('update_all_plugin_assets' => 1, 'update_specific_assets' => 1),
                'infohub_launcher' => array('get_full_list' => 1)
            );
            $this->allowedServerPluginNamesLookupArray = $allowedServerPlugins;

            $allowedClientPlugins = array(
                'infohub_asset' => 1,
                'infohub_base' => 1,
                'infohub_cache' => 1,
                'infohub_checksum' => 1,
                'infohub_checksum_md5' => 1,
                'infohub_compress' => 1,
                'infohub_configlocal' => 1,
                'infohub_debug' => 1,
                'infohub_exchange' => 1,
                'infohub_keyboard' => 1,
                'infohub_launcher' => 1,
                'infohub_login' => 1,
                'infohub_offline' => 1,
                'infohub_plugin' => 1,
                'infohub_render' => 1,
                'infohub_render_common' => 1,
                'infohub_render_form' => 1,
                'infohub_render_text' => 1,
                'infohub_renderform' => 1,
                'infohub_rendermajor' => 1,
                'infohub_session' => 1,
                'infohub_standalone' => 1,
                'infohub_storage' => 1,
                'infohub_storage_data' => 1,
                'infohub_storage_data_idbkeyval' => 1,
                'infohub_tabs' => 1,
                'infohub_timer' => 1,
                'infohub_transfer' => 1,
                'infohub_translate' => 1,
                'infohub_view' => 1,
                'infohub_workbench' => 1
            );
            $this->allowedClientPluginNamesLookupArray = $allowedClientPlugins;

            $out = array(
                'answer' => 'true',
                'message' => 'Guest is valid',
                'sign_code_valid' => 'false',
                'guest_valid' => 'true',
                'initiator_user_name' => 'guest'
            );

            $this->guestValid = 'true';
            $this->sendAnswer = 'false';
            $this->userName = $out['initiator_user_name'];
            $this->sessionId = '';
        }

        return $out;
    }

    // *****************************************************************************
    // * Internal function that you only can reach from internal_Cmd
    // * Function name are in internal_CamelCase
    // * An internal function get all its data from the $in-array
    // * An internal function give its answer as an array, success or error
    // *****************************************************************************

    /**
     * The incoming package have messages, test them and then place them in array ToSort.
     * @version 2016-01-28
     * @since 2013-11-21
     * @author Peter Lembke
     * @param array $in
     * @return array
     */
    final protected function internal_ToSort(array $in = array()) {
        $default = array(
            'package' => array(
                'messages' => array()
            )
        );
        $in = $this->_Default($default, $in);

        $sort = array();
        $messageCount = count($in['package']['messages']);
        $answer = 'false';
        $message = '';
        $fromNode = '';
        $rejectReason = array();

        if ($messageCount > 20) {
            $message = 'Come on, more than 20 messages in one package? Forget it, I will throw them all away';
            goto leave;
        }

        foreach ($in['package']['messages'] as $message) {
            $message['func'] = 'MessageCheck';
            $response = $this->internal_Cmd($message);

            if ($response['answer'] === 'false') {
                $rejectReason[ $response['message'] ] = 1;
                continue;
            }
            $message = $response['data_message'];

            if ($message['to']['node'] !== 'server') {
                $rejectReason['Messages that try to pass trough are thrown away'] = 1;
                continue;
            }

            $back = $message['callstack'][0];

            if ($back['to']['node'] === 'server') {
                $rejectReason['Messages that claim to come from here, they lie and are thrown away'] = 1;
                continue;
            }

            if ($fromNode === '') {
                $fromNode = $back['to']['node'];
            }
            if ($fromNode !== $back['to']['node']) {
                $sort = array(); //
                $message = 'All messages in a package should come from the same node. The rule is to not allow any pass-trough messages. I will throw away the complete package.';
                goto leave;
            }

            if (count($this->allowedServerPluginNamesLookupArray) > 0) {
                $pluginName = $message['to']['plugin'];
                if (isset($this->allowedServerPluginNamesLookupArray[$pluginName]) === false) {
                    $errorMessage = 'Plugin not allowed';
                    $rejectReason[$errorMessage] = 1;
                    $message['message'] = $errorMessage;
                    $this->_SendMessageBackMessageFailedTests($message);
                    continue;
                }

                if ($this->userName === 'guest') {
                    $functionName = $message['to']['function'];
                    if (isset($this->allowedServerPluginNamesLookupArray[$pluginName][$functionName]) === false) {
                        $errorMessage = 'Plugin function not allowed';
                        $rejectReason[$errorMessage] = 1;
                        $message['message'] = $errorMessage;
                        $this->_SendMessageBackMessageFailedTests($message);
                        continue;
                    }
                }
            }

            $sort[] = $message;
        }

        $this->Sort = array_merge($this->Sort, $sort);
        $answer = 'true';
        $message = 'Placed messages in array $Sort';

        leave:
        $sortCount = count($sort);

        return array(
            'answer' => $answer,
            'message' => $message,
            'total_messages' => $messageCount,
            'added_messages' => $sortCount,
            'refused_messages' => $messageCount - $sortCount,
            'rejected_reason' => $rejectReason
        );
    }

    /**
     * If the message passes the tests then it is added to queue Sort, else it is thrown away.
     * @param array $in
     */
    final protected function _SendMessageBackPluginNotFound(array $in = array()) {
        $default = array(
            'callstack' =>  array(),
            'data' => array(),
            'data_back' => array(),
            'to' => array(
                'node' => '', 'plugin' => '', 'function' => ''
            ),
            'wait' => 0.0
        );
        $in = $this->_Default($default, $in);

        $dataMessage = $this->internal_Cmd(array(
            'func' => 'ReturnCall',
            'variables' => array(
                'answer' => 'false',
                'message' => 'Plugin do not exist',
                'to' => $in['to']
            ),
            'original_message' => $in
        ));

        if ($dataMessage['answer'] === 'true') {
            $this->_SortAdd(array('message' => $dataMessage['return_call_data'] ));
        }
    }

    /**
     * Some messages could be answered with the error. Others have no sender.
     * This function send back answers to those messages that has a sender.
     * @param array $in
     */
    final protected function _SendMessageBackMessageFailedTests(array $in = array()) {
        $default = array(
            'callstack' =>  array(),
            'data' => array(),
            'data_back' => array(),
            'to' => array(
                'node' => '', 'plugin' => '', 'function' => ''
            ),
            'wait' => 0.0,
            'message' => ''
        );
        $in = $this->_Default($default, $in);

        $dataMessage = $this->internal_Cmd(array(
            'func' => 'ReturnCall',
            'variables' => array(
                'answer' => 'false',
                'message' => $in['message'],
                'ok' => 'false',
                'to' => $in['to']
            ),
            'original_message' => $in
        ));

        if ($dataMessage['answer'] === 'true') {
            $this->_SortAdd(array('message' => $dataMessage['return_call_data'] ));
        }
    }

    /**
     * If the message passes the tests then it is added to queue Sort, else it is thrown away.
     * @param array $in
     */
    final protected function _SortAdd(array $in = array()) {
        $default = array(
            'test' => 'true',
            'message' => array()
        );
        $in = $this->_Default($default, $in);
        $dataMessage = $in['message'];
        
        if ($in['test'] === 'true') 
        {
            $dataMessage['func'] = 'MessageCheck';
            $response = $this->internal_Cmd($dataMessage);

            if ($response['answer'] === 'false') {
                return; // Some messages do not even have a sender
            }
            
            $dataMessage = $response['data_message'];
        }
        
        $this->Sort[] = $dataMessage;
    }

    /**
     * Checks message structure, node, and that it follows the rules for calling other plugins.
     * @param array $in
     * @return array
     */
    final protected function internal_MessageCheck(array $in = array())
    {
        $default = array(
            'callstack' => array(),
            'data' => array(),
            'data_back' => array(),
            'to' => array('node' => '', 'plugin' => '', 'function' => '' ),
            'wait' => 0.0
        );
        $in = $this->_Default($default, $in);

        $dataMessage = $in;
        
        $response = $this->_CheckMessageStructure($dataMessage);
        if ($response['answer'] === 'false') {
            goto leave;
        }
        $dataMessage = $response['data_message'];

        $response = $this->_CheckMessageNode($dataMessage);
        if ($response['answer'] === 'false') {
            goto leave;
        }

        $response = $this->_CheckMessageCalling($dataMessage);
        if ($response['answer'] === 'false') {
            goto leave;
        }

        leave:
        return array(
            'answer' => $response['answer'],
            'message' => $response['message'],
            'data_message' => $response['data_message']
        );
    }

    /**
     * Makes sure the message have the right structure.
     * If wrong structure then the message are MODIFIED
     * @param array $in
     * @return array
     */
    final protected function _CheckMessageStructure(array $in = array())
    {
        $default = array(
            'to' => array('node' => '', 'plugin' => '', 'function' => ''),
            'callstack' => array(),
            'data' => array()
        );
        $in = $this->_Default($default, $in);

        $answer = 'false';
        $message = $this->_CheckMessageStructureTo($in);
        if ($message !== '') {
            goto leave;
        }

        if (count($in['callstack']) === 0) {
            $message = 'Callstack is empty. That happens at some point.';
            $answer = 'true';
            goto leave;
        }

        $defaultBack = array(
            'to' => array('node' => '', 'plugin' => '', 'function' => ''),
            'data_back' => array()
        );
        $in['callstack'][0] = $this->_Default($defaultBack, $in['callstack'][0]);
        $message = $this->_CheckMessageStructureTo($in['callstack'][0]);
        if ($message !== '') {
            goto leave;
        }

        $answer = 'true';
        $message = 'Message is valid';

        leave:
        return array(
            'answer' => $answer,
            'message' => $message,
            'data_message' => $in
        );
    }

    /**
     * Check that the 'to' array have the right structure and form on the data.
     * @param array $in
     * @return string
     */
    final protected function _CheckMessageStructureTo(array $in = array())
    {
        foreach ($in['to'] as $name => $data) {
            if (empty($data)) {
                return 'I want data in node, plugin and function';
            }
            if (strtolower($data) !== $data) {
                return 'I want lower case data in node, plugin and function';
            }
        }
        return '';
    }

    /**
     * Check that the message have a valid destination node.
     * @param array $in
     * @return array
     */
    final protected function _CheckMessageNode(array $in = array())
    {
        if (empty($in['callstack'])) {
            return array(
                'answer' => 'true',
                'message' => 'The message will soon reach its origin. I am OK with this',
                'data_message' => $in
            );
        }

        $validNodesArray = array('client', 'server', 'cron', 'callback');
        if (in_array($in['callstack'][0]['to']['node'], $validNodesArray) === false) {
            return array(
                'answer' => 'false',
                'message' => 'I only send back the answer to a node that I know',
                'data_message' => $in
            );
        }
        return array(
            'answer' => 'true',
            'message' => 'Node is known, I am OK with this',
            'data_message' => $in
        );
    }

    /**
     * Check that the message follow the rules for whom it is allowed to talk to / answer to.
     * @param array $in
     * @return array
     */
    final protected function _CheckMessageCalling(array $in = array())
    {
        $default = array(
            'to' => array('node' => '', 'plugin' => '', 'function' => ''),
            'callstack' => array(),
            'data' => array()
        );
        $in = $this->_Default($default, $in);

        $answer = 'true';
        $message = 'I am OK with how you communicate in this message';

        // If different from/to node then...
            // OK if plugins are level 1, to: foobar_hello, back: beebop_yesman
        // If same from/to node then...
            // OK if plugins are level 1, to: foobar_hello, back: beebop_yesman
            // OK if plugins are identical, to: infohub_storage_mysql, back: infohub_storage_mysql
            // OK if answer goes to parent, to: infohub_storage_mysql, back: infohub_storage
            // OK if query goes to a level 1 plugin. to: infohub_storage, back: infohub_contact_client
            // OK if you call a sibling. to: infohub_democall_sibling, back: infohub_democall_child

        $to = $in['to'];
        $toPart = explode('_', $to['plugin']);
        if (empty($in['callstack']) and count($toPart) === 2) {
            $message = $message . ' OK to arrive at a plugin at level 1 when the callstack is empty';
            goto leave;
        }

        $back = end($in['callstack']);
        $back = $back['to'];
        $backPart = explode('_', $back['plugin']);

        if ($to['node'] === 'client' && $back['node'] === 'server') {
            $answer = 'false';
            $message = ' FAIL, Server can not get an answer from the client. The connection will close once the server have sent the package. Perhaps this will be allowed in the future.';
            goto fail;
        }
        
        if ( count($toPart) === 2 && count($backPart) === 2) {
            $message = $message . ' OK, communication on level 1 is OK, even between nodes';
            goto leave;
        }

        if ($to['node'] !== $back['node']) { // Different nodes
            $answer = 'false';
            $message = 'You send a message to a different node. Then both the caller and the called plugin must be on level 1. Now they were not';
            goto leave;
        }

        if ($to['plugin'] === $back['plugin']) {
            $message = $message . ' OK, plugins are identical';
            goto leave;
        }

        if ( count($toPart) === 2 && count($backPart) > 2 ) {
            $message = $message . ' OK, the destination is a level 1 plugin on the same node';
            goto leave;
        }

        if (count($toPart) - count($backPart) === 1) {
            $toPartCopy = $toPart;
            array_pop($toPartCopy); // Remove the child name from the end of the array
            if ($toPartCopy === $backPart) {
                $message = $message . ' OK, the destination is a child';
                goto leave;
            }
        }
        
        if (count($toPart) === count($backPart)) {
            $toPartCopy = $toPart;
            array_pop($toPartCopy); // Remove the child name from the end of the array
            $backPartCopy = $backPart;
            array_pop($backPartCopy); // Remove the child name from the end of the array
            if ($toPartCopy === $backPartCopy) {
                $message = $message . ' OK, the destination is a sibling';
                goto leave;
            }
        }
        
        $answer = 'false';
        $message = 'I am not happy with how you communicate in this message. Check the documentation to see what I will let you pass';

        fail:
        $in['message'] = $message;
        $this->_SendMessageBackMessageFailedTests($in);
        
        leave:
        return array(
            'answer' => $answer,
            'message' => $message,
            'data_message' => $in
        );
    }

    /**
     * Sort all messages in Sort array => Stack, ToPending, ToNode
     * Used by: main
     * @version 2015-01-25
     * @since 2013-08-18
     * @author Peter Lembke
     * @param array $in
     * @return array
     * @uses
     */
    final protected function internal_Sort(array $in = array()) {
        $default = array();
        $in = $this->_Default($default, $in);

        while (count($this->Sort) > 0) {
            $dataMessage = array_pop($this->Sort); // Move the last message from the array Sort

            if (isset($dataMessage['to']['node']) === false) {
                continue;
            }

            $nodeName = $dataMessage['to']['node'];
            if ($nodeName !== 'server') {
                if (isset($this->ToNode[$nodeName]) === false) {
                    $this->ToNode[$nodeName] = array();
                }
                $this->ToNode[$nodeName][] = $dataMessage;
                continue;
            }

            $pluginName = $dataMessage['to']['plugin'];

            if (isset($this->PluginMissing[$pluginName]) === true) {
                $this->_SendMessageBackPluginNotFound($dataMessage);
                continue;
            }

            if (isset($this->Plugin[$pluginName]) === false) {
                $this->ToPending[] = $dataMessage;
                continue;
            }

            $this->Stack[] = $dataMessage;
        }

        return array(
            'answer' => 'true',
            'message' => 'Sorted the messages in Sort'
        );
    }

    /**
     * Messages in array ToPending either go to array Pending or are thrown away
     * Used by: main
     * @version 2016-01-28
     * @since 2013-08-18
     * @author Peter Lembke
     * @param array $in
     * @return array
     * @uses
     */
    final protected function internal_ToPending(array $in = array()) {
        $default = array();
        $in = $this->_Default($default, $in);

        while (count($this->ToPending) > 0) {
            $dataMessage = array_pop($this->ToPending);
            $pluginName = $dataMessage['to']['plugin'];

            if (isset($this->Pending[$pluginName]) === true && is_array($this->Pending[$pluginName]) === true) {
                // We have got messages to this pending plugin before
                if (count($this->Pending[$pluginName]) === 0) {
                    // We earlier got information that the plugin could not be found.

                    $message = 'Could not find plugin on the server';

                    $this->internal_Log(array(
                        'function_name' => __FUNCTION__,
                        'message' => $message,
                        'level' => 'error',
                        'object' => array('plugin' => $pluginName )
                    ));

                    $PluginMissing[$pluginName] = array();
                    $this->_SendMessageBackPluginNotFound($dataMessage);

                    continue;
                }
                // There are already messages here, add our message
                $this->Pending[$pluginName][] = $dataMessage;
                continue;
            }

            // This message are the first to come to this plugin name
            $this->Pending[$pluginName] = array();
            $this->Pending[$pluginName][] = $dataMessage;

            $subCall = $this->_SubCall(array(
                'to' => array(
                    'node' => 'server',
                    'plugin' => 'infohub_plugin',
                    'function' => 'plugin_request'
                ),
                'data' => array(
                    'plugin_name' => $pluginName,
                    'plugin_node' => $dataMessage['to']['node'],
                    'config' => array(
                        'user_name' => $this->_GetUserName(),
                        'server_plugin_names' => $this->_GetAllowedServerPluginNames(),
                        'client_plugin_names' => $this->_GetAllowedClientPluginNames()
                    )
                ),
            ));

            $response = $this->Plugin['infohub_plugin']->cmd($subCall);
            if ($response !== '') {
                $this->_SortAdd(array(
                    'message' => $response
                ));
            }
        }

        return array(
            'answer' => 'true',
            'message' => 'Sorted the messages in ToPending'
        );
    }

    /**
     * Execute all messages in the array:Stack, and move the answer to array:Sort
     * We know that the messages in Stack can be run and that the plugins needed are already started
     * @version 2015-09-20
     * @since 2013-11-21
     * @author Peter Lembke
     * @param array $in
     * @return array
     * @uses
     */
    final protected function internal_Stack(array $in = array()) {
        $default = array();
        $in = $this->_Default($default, $in);

        while (count($this->Stack) > 0) {
            $dataMessage = array_pop($this->Stack);
            $pluginName = $dataMessage['to']['plugin'];

            if (isset($this->Plugin[$pluginName]) === false) {
                $this->internal_Log(array(
                    'level'=> 'error',
                    'message'=> 'The plugin do not exist. Too late to do something about that now.',
                    'function_name'=> 'internal_Stack',
                    'object'=> array('plugin'=> $pluginName )
                ));
                $this->PluginMissing[$pluginName] = array();
                continue;
            }

            $run = $this->Plugin[$pluginName];
            if ($pluginName === 'infohub_exchange') {
                $run = $this;
            }

            $response = $this->internal_Cmd(array(
                'func' => 'GetConfigFromFile',
                'plugin_name' => $pluginName
            ));
            
            $dataMessage['data']['config'] = $response['config'];
            $dataMessage['data']['config']['user_name'] = $this->_GetUserName();
            $dataMessage['data']['config']['session_id'] = $this->_GetSessionId();
            $dataMessage['data']['config']['server_plugin_names'] = $this->_GetAllowedServerPluginNames();
            $dataMessage['data']['config']['client_plugin_names'] = $this->_GetAllowedClientPluginNames();

            $dataMessage['callback_function'] = function($response)
            {
                if ($response !== '') {
                    if (count($response['log_array']) > 0)
                    {
                        $this->internal_LogArrayToConsole(array(
                            'log_array' => $response['log_array']
                        ));

                        // Pull out the errors and attach them to the message
                        $answer = $this->internal_GetErrorArrayFromLogArray(array(
                            'log_array' => $response['log_array']
                        ));
                        $response['error_array'] = $answer['error_array'];
                    }
                    unset($response['log_array']);
                }

                $this->_SortAdd(array(
                    'message'=> $response
                ));
            };

            $response = $run->cmd($dataMessage); // // callback_function is always used by cmd(). see above.
        }

        return array(
            'answer' => 'true',
            'message' => 'Have run all messages in the Stack, have put the responses in Sort, written errors to screen and written log data to console'
        );
    }

    /**
     * Get the data from the config file
     * The use of configuration files is very mush discouraged. Always place all data in the database.
     * @version 2018-12-26
     * @since   2018-01-21
     * @author  Peter Lembke
     * @param array $in
     * @return array
     */
    final protected function internal_GetConfigFromFile(array $in = array()): array {
        
        $default = array(
            'plugin_name' => '',
            'node' => 'server'
        );
        $in = $this->_Default($default, $in);

        $answer = 'true';
        $foundConfig = 'false';
        $message = '';
        $config = array();
        
        if ($in['node'] !== 'client' && $in['node'] !== 'server') {
            $message = 'The node you want is not allowed in the config file';
            goto leave;
        }
        
        $pluginName = trim(strtolower($in['plugin_name']));
        
        $fileName = CONFIG . DS . $pluginName . '.json';
        if (file_exists($fileName) === false) {
            $fileName = PLUGINS . DS . str_replace('_', DS, $pluginName) . DS . $pluginName . '.json';
            if (file_exists($fileName) === false) {
                $message = 'File does not exist';
                goto leave;
            }
        }

        $data = file_get_contents($fileName);
        if (empty($data) === true) {
            $message = 'File exist but are empty';
            goto leave;
        }

        $data = json_decode($data, true);
        if (is_array($data) === false) {
            $message = 'File data could not be decoded';
            goto leave;
        }

        $default = array(
            'server' => array(),
            'client' => array()
        );
        $data = $this->_Default($default, $data);
        
        $node = $in['node'];
        $config = $data[$node];
        $answer = 'true';
        $message = 'Here are the config for your node';
        $foundConfig = 'true';

        leave:
        return array(
            'answer' => $answer,
            'message' => $message,
            'found_config' => $foundConfig,
            'config' => $config,
            'plugin_name' => $in['plugin_name'],
            'node' => $in['node'],
            'file_name' => $fileName
        );
    }

    final protected function internal_GetErrorArrayFromLogArray(array $in = array()) {
        $default = array(
            'log_array' => array()
        );
        $in = $this->_Default($default, $in);

        $errorArray = array();
        $length = count($in['log_array']);
        for ($x = 0; $x < $length; $x++) {
            $item = $in['log_array'][$x];
            if ($item['level'] === 'error') {
                $errorArray[] = $item['time_stamp'] . ', ' . $item['node_name'] . '.' . $item['plugin_name'] . '.' . $item['function_name'] . ', ' . $item['message'];
            }
        }

        return array(
            'answer' => 'true',
            'message' => 'Here are the error_array',
            'error_array' => $errorArray
        );
    }

    final protected function internal_LogArrayToConsole(array $in = array()) {
        $default = array(
            'log_array' => array()
        );
        $in = $this->_Default($default, $in);

        $depth = 0;
        while (count($in['log_array']) > 0) {
            $item = array_shift($in['log_array']);
            $depth = $depth + $item['depth'];
            $item['prefix'] = str_repeat('>', $depth);
            $this->internal_Console($item);
        }

        return array(
            'answer' => 'true',
            'message' => 'Have written the array with items to the console'
        );
    }

    final protected function internal_Console(array $in = array()) {
        $default = array(
            'time_stamp' => '',
            'node_name' => '',
            'plugin_name' => '',
            'function_name' => '',
            'message' => '',
            'level' => 'log',
            'object' => array(),
            'depth' => 0,
            'get_backtrace' => 'false',
            'backtrace' => array(),
            'execution_time' => 0.0,
            'prefix' => ''
        );
        $in = $this->_Default($default, $in);

        $message = $in['time_stamp'] . ', ' . $in['node_name'] . '.' . $in['plugin_name'] . '.' . $in['function_name'] . ', ' . $in['message'] . PHP_EOL;

        if ($in['level'] === 'error') {
            $fileName = LOG . DS . 'log-error.log';
            file_put_contents($fileName, '***** ' . $message, FILE_APPEND);
            file_put_contents($fileName, print_r($in, true), FILE_APPEND);
        }

        if ($in['level'] === 'debug') {
            $fileName = LOG . DS . $in['plugin_name'] .'.log';
            file_put_contents($fileName, '***** ' . $message, FILE_APPEND);
            file_put_contents($fileName, print_r($in, true), FILE_APPEND);
        }
        
        if (isset($GLOBALS['infohub_minimum_error_level']) === true) {
            if ($GLOBALS['infohub_minimum_error_level'] !== 'log') {
                goto leave;
            }
        }

        $fileName = LOG . DS . 'log-all.log';
        $message = $in['prefix'] . $message;

        if ($in['depth'] === 1) {
            file_put_contents($fileName, $message, FILE_APPEND);
        }

        if ($in['depth'] === 0) {
            file_put_contents($fileName, $message, FILE_APPEND);

            if (count($in['object']) > 0) {
                file_put_contents($fileName, print_r($in['object'], true), FILE_APPEND);
            }
        }

        if ($in['depth'] === -1) {
            if ($in['execution_time'] > 0.0) {
                $message = 'Execution time: ' . $in['execution_time'] . ' seconds';
                if ($in['execution_time'] > 0.2) {
                    $message = '** WARNING ' . $message;
                }
            }
            file_put_contents($fileName, $message, FILE_APPEND);
        }

        leave:
        return array(
            'answer' => 'true',
            'message' => 'Have written the item to the console'
        );
    }
}
