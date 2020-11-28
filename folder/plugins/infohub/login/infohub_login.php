<?php
/**
 * Handle the login procedure
 *
 * Handle incoming login request and challenge. Send login request to another node.
 *
 * @package     Infohub
 * @subpackage  infohub_login
 */

declare(strict_types=1);
if (basename(__FILE__) == basename($_SERVER["SCRIPT_FILENAME"])) {
    exit; // This file must be included, not called directly
}

/**
 * Handle the login procedure
 *
 * Handle incoming login request and challenge. Send login request to another node.
 *
 * @author      Peter Lembke <info@infohub.se>
 * @version     2020-01-12
 * @since       2019-09-21
 * @copyright   Copyright (c) 2019, Peter Lembke
 * @license     https://opensource.org/licenses/gpl-license.php GPL-3.0-or-later
 * @see         https://github.com/peterlembke/infohub/blob/master/folder/plugins/infohub/login/infohub_login.md Documentation
 * @link        https://infohub.se/ InfoHub main page
 */
class infohub_login extends infohub_base
{
    /**
     * Version information for this plugin
     * @version 2020-01-12
     * @since   2019-09-21
     * @author  Peter Lembke
     * @return  string[]
     */
    protected function _Version(): array
    {
        return array(
            'date' => '2020-01-12',
            'since' => '2019-09-21',
            'version' => '1.0.0',
            'class_name' => 'infohub_login',
            'checksum' => '{{checksum}}',
            'note' => 'Handle incoming login request and challenge. Send login request to another node.',
            'status' => 'normal',
            'SPDX-License-Identifier' => 'GPL-3.0-or-later',
            'user_role' => 'user'
        );
    }

    /**
     * Public functions in this plugin
     * @version 2020-01-12
     * @since   2019-09-21
     * @author  Peter Lembke
     * @return mixed
     */
    protected function _GetCmdFunctions(): array
    {
        $list = array(
            'login_request' => 'normal', // Incoming login_request
            'login_challenge' => 'normal', // Incoming login_challenge
            'login' => 'normal', // Login to another node,
            'read_login_file' => 'normal',
            'get_doc_file' => 'normal'
        );

        return parent::_GetCmdFunctionsBase($list);
    }

    // ***********************************************************
    // * your class functions below, only use protected functions
    // ***********************************************************

    /**
     * Get a login_request from another node, send back a login_request_response
     * @version 2019-09-21
     * @since   2019-09-21
     * @author  Peter Lembke
     * @param array $in
     * @return array
     */
    protected function login_request(array $in = []): array
    {
        $default = array(
            'initiator_user_name' => '', // Your Hub-UUID username
            'initiator_random_code' => '', // BASE64 string with 256 bytes of random binary data
            'initiator_seconds_since_epoc' => 0.0,
            'step' => 'step_verify_initiator_seconds_since_epoc',
            'response' => array(
                'answer' => 'false',
                'message' => '',
                'node_data' => array(
                    'node' => '',
                    'note' => '',
                    'domain_address' => '',
                    'user_name' => '',
                    'shared_secret' => '',
                    'role_list' => []
                ),
                'post_exist' => 'false'
            ),
            'data_back' => array(
                'answer' => 'false',
                'message' => 'Nothing to report',
                'login_request_valid' => 'false',
                'responder_random_code' => '',
                'responder_seconds_since_epoc' => 0.0
            ),
            'from_plugin' => array(
                'node' => ''
            )
        );
        $in = $this->_Default($default, $in);

        if ($in['from_plugin']['node'] === 'server') {
            $out['message'] = 'Any node except the server are allowed to use function login_request';
            $in['step'] = 'step_end';
        }

        if ($in['step'] === 'step_verify_initiator_seconds_since_epoc') {
            // Check that the time mentioned is max 2.0 seconds old
            $response = $this->internal_Cmd(array(
                'func' => 'VerifySecondsSinceEpoc',
                'seconds_since_epoc' => $in['initiator_seconds_since_epoc'],
                'max_seconds_old' => 2.0
            ));

            $in['step'] = 'step_verify_random_code';

            if ($response['valid'] === 'false') {
                $in['data_back']['message'] = $response['message'];
                $in['step'] = 'step_end';
            }
        }

        if ($in['step'] === 'step_verify_random_code') {
            // Check that the random code is plausible
            $response = $this->internal_Cmd(array(
                'func' => 'VerifyRandomCode',
                'random_code' => $in['initiator_random_code'],
                'length' => 256
            ));

            $in['step'] = 'step_verify_initiator_user_name';

            if ($response['valid'] === 'false') {
                $in['data_back']['message'] = $response['message'];
                $in['step'] = 'step_end';
            }
        }

        if ($in['step'] === 'step_verify_initiator_user_name') {
            // Check that the user name is plausible
            $response = $this->internal_Cmd(array(
                'func' => 'VerifyHubId',
                'hub_id' => $in['initiator_user_name']
            ));

            $in['step'] = 'step_find_initiator_user_name';

            if ($response['valid'] === 'false') {
                $in['data_back']['message'] = $response['message'];
                $in['step'] = 'step_end';
            }
        }

        if ($in['step'] === 'step_find_initiator_user_name') {
            return $this->_SubCall(array(
                'to' => array(
                    'node'=> 'server',
                    'plugin'=> 'infohub_contact',
                    'function'=> 'load_node_data'
                ),
                'data'=> array(
                    'user_name'=> $in['initiator_user_name'],
                    'type'=> 'client'
                ),
                'data_back'=> array(
                    'initiator_user_name' => $in['initiator_user_name'], // Your Hub-UUID username
                    'initiator_random_code' => $in['initiator_random_code'], // BASE64 string with 256 bytes of random binary data
                    'initiator_seconds_since_epoc' => $in['initiator_seconds_since_epoc'],
                    'step'=> 'step_find_initiator_user_name_response'
                )
            ));
        }

        if ($in['step'] === 'step_find_initiator_user_name_response') {

            $in['step'] = 'step_save_login_request_data';

            $answer = $in['response']['answer'];
            $exist = $in['response']['post_exist'];

            if ($answer === 'true' && $exist === 'false') {
                $in['data_back']['message'] = 'Your login_request contain a user name that do not exist';
                $in['step'] = 'step_end';
            }

            if ($answer === 'false') {
                $in['data_back']['message'] = $in['response']['message'];
                $in['step'] = 'step_end';
            }

        }

        if ($in['step'] === 'step_save_login_request_data') {
            $response = $this->internal_Cmd(array(
                'func' => 'CreateRandomCode',
                'length' => 256
            ));

            $data = array(
                'initiator_user_name' => $in['initiator_user_name'], // Your Hub-UUID username
                'initiator_random_code' => $in['initiator_random_code'], // BASE64 string with 256 bytes of random binary data
                'initiator_seconds_since_epoc' => $in['initiator_seconds_since_epoc'],
                'login_request_valid' => 'true',
                'responder_random_code' => $response['random_code'],
                'responder_seconds_since_epoc' => round($this->_MicroTime(), 3) // PHP has 5 decimals. Javascript handle 3 decimals
            );

            $dataBack = array_merge($data, array(
                'step'=> 'step_save_login_request_data_response'
            ));

            return $this->_SubCall(array(
                'to' => array(
                    'node'=> 'server',
                    'plugin'=> 'infohub_storage',
                    'function'=> 'write'
                ),
                'data'=> array(
                    'path'=> 'infohub_login/login_request/' . $in['initiator_user_name'],
                    'data'=> $data
                ),
                'data_back'=> $dataBack
            ));
        }

        if ($in['step'] === 'step_save_login_request_data_response')
        {
            $in['step'] = 'step_end';

            $in['data_back']['answer'] = $in['response']['answer'];
            $in['data_back']['message'] = $in['response']['message'];

            if ($in['response']['answer'] === 'true') {
                $in['data_back']['message'] = 'Login request is valid. Please proceed with the login_challenge.';
            }
        }

        return array(
            'answer' => $in['data_back']['answer'],
            'message' => $in['data_back']['message'],
            'data' => array(
                'login_request_valid' => $in['data_back']['login_request_valid'],
                'responder_random_code' => $in['data_back']['responder_random_code'],
                'responder_seconds_since_epoc' => $in['data_back']['responder_seconds_since_epoc']
            )
        );
    }

    /**
     * Get a login_challenge from another node, send back a login_challenge_response
     * The other node must give a correct initiator_calculated_id_code
     * @version 2020-01-07
     * @since   2019-09-21
     * @author  Peter Lembke
     * @param array $in
     * @return array
     */
    protected function login_challenge(array $in = []): array
    {
        $default = array(
            'step' => 'step_find_login_request',
            'initiator_user_name' => '', // Your Hub-UUID username
            'initiator_random_code' => '', // Same as in the login_request
            'initiator_seconds_since_epoc' => 0.0, // Same as in the login_request
            'initiator_calculated_id_code' => '', // The code you have calculated. (New)
            'response' => array(
                'answer' => 'false',
                'message' => '',
                'path' => '',
                'data' => [],
                'post_exist' => 'false',
                'node_data' => array(
                    'node' => '',
                    'note' => '',
                    'domain_address' => '',
                    'user_name' => '',
                    'shared_secret' => '',
                    'role_list' => []
                ),
                'session_id' => '', // session_{hub_id}
                'session_created_at' => '', // micro time with 3 decimals
                'logged_in' => 'false'
            ),
            'data_back' => array(
                'step' => 'step_find_login_request',
                'contact' => [],
                'initiator_user_name' => '', // Your Hub-UUID username
                'initiator_random_code' => '', // Same as in the login_request
                'initiator_seconds_since_epoc' => 0.0, // Same as in the login_request
                'initiator_calculated_id_code' => '', // The calculated code
                'login_request_valid' => 'true',
                'responder_random_code' => '',
                'responder_seconds_since_epoc' => 0.0,
                'responder_calculated_id_code' => '', // The code we will answer with if initiator_calculated_id_code is ok
            ),
            'from_plugin' => array(
                'node' => ''
            )
        );
        $in = $this->_Default($default, $in);

        $leftOvers = '';
        $messages = [];

        if ($in['from_plugin']['node'] === 'server') {
            $out['message'] = 'Any node except the server are allowed to use function login_challenge';
            $in['step'] = 'step_end';
        }

        if ($in['step'] === 'step_find_login_request') {
            return $this->_SubCall(array(
                'to' => array(
                    'node'=> 'server',
                    'plugin'=> 'infohub_storage',
                    'function'=> 'read'
                ),
                'data'=> array(
                    'path'=> 'infohub_login/login_request/' . $in['initiator_user_name']
                ),
                'data_back'=> array(
                    'step' => 'step_find_login_request_response',
                    'initiator_user_name' => $in['initiator_user_name'], // Your Hub-UUID username
                    'initiator_random_code' => $in['initiator_random_code'], // Same as in the login_request
                    'initiator_seconds_since_epoc' => $in['initiator_seconds_since_epoc'], // Same as in the login_request
                    'initiator_calculated_id_code' => $in['initiator_calculated_id_code'], // The code you have calculated. (New)
                )
            ));
        }

        // Verify that it is the same initiator_random_code and initiator_seconds_since_epoc
        if ($in['step'] === 'step_find_login_request_response')
        {
            $in['step'] = 'step_end';

            if ($in['response']['answer'] === 'true' && $in['response']['post_exist'] === 'true') {
                if ($in['initiator_random_code'] === $in['response']['data']['initiator_random_code']) {
                    if ($in['initiator_seconds_since_epoc'] === $in['response']['data']['initiator_seconds_since_epoc']) {
                        $in['data_back'] = $in['response']['data'];
                        $in['data_back']['initiator_calculated_id_code'] = $in['initiator_calculated_id_code'];
                        $in['step'] = 'step_find_initiator_user_name';
                    }
                }
            }
        }

        if ($in['step'] === 'step_find_initiator_user_name') {
            return $this->_SubCall(array(
                'to' => array(
                    'node'=> 'server',
                    'plugin'=> 'infohub_contact',
                    'function'=> 'load_node_data'
                ),
                'data'=> array(
                    'user_name'=> $in['initiator_user_name'],
                    'type'=> 'client'
                ),
                'data_back'=> array(
                    'step'=> 'step_find_initiator_user_name_response',
                    'initiator_user_name' => $in['initiator_user_name'], // Your Hub-UUID username
                    'initiator_random_code' => $in['initiator_random_code'], // BASE64 string with 256 bytes of random binary data
                    'initiator_seconds_since_epoc' => $in['initiator_seconds_since_epoc'],
                    'initiator_calculated_id_code' => $in['initiator_calculated_id_code'],
                    'responder_random_code' => $in['data_back']['responder_random_code'],
                    'responder_seconds_since_epoc' => $in['data_back']['responder_seconds_since_epoc']
                )
            ));
        }

        if ($in['step'] === 'step_find_initiator_user_name_response')
        {
            $exist = $in['response']['post_exist'];

            if ($exist === 'false') {
                $in['data_back']['message'] = 'Your login_request contain a hub_id that do not exist';
                $in['step'] = 'step_end';
            } else {
                $in['data_back']['contact'] = $in['response']['node_data'];
                $in['step'] = 'step_verify_initiator_calculated_id_code';
            }
        }

        // Verify that initiator_calculated_id_code is correct.
        if ($in['step'] === 'step_verify_initiator_calculated_id_code') {

            // Merge the both random codes into one random_code
            $randomCode = $this->_MergeBase64Strings($in['data_back']['initiator_random_code'], $in['data_back']['responder_random_code']);

            // Subtract the shared_secret from the random_code and get the diff.
            $diff = $this->_DeductBase64Strings($randomCode, $in['data_back']['contact']['shared_secret']);

            // Rotate the diff 128 steps
            $steps = 128;
            $rotatedDiff = $this->_RotateBase64String($diff, $steps);

            // Merge rotated diff and shared_secret
            $rotatedResult = $this->_MergeBase64Strings($rotatedDiff, $in['data_back']['contact']['shared_secret']);

            // Do an md5 of the rotatedResult. That is the initiator_calculated_id_code
            $toMd5Checksum = $in['data_back']['initiator_seconds_since_epoc'] . $rotatedResult . $in['data_back']['responder_seconds_since_epoc'];

            $md5Checksum = md5($toMd5Checksum);

            $in['step'] = 'step_end';
            $in['response']['message'] = 'The initiator_calculated_id_code is invalid.';

            if ($in['data_back']['initiator_calculated_id_code'] === $md5Checksum) {

                // Rotate the diff 64 steps
                $steps = 64;
                $rotatedDiff = $this->_RotateBase64String($diff, $steps);

                // Merge rotated diff and shared_secret
                $leftOversValue = $this->_MergeBase64Strings($rotatedDiff, $in['data_back']['contact']['shared_secret']);
                $leftOvers = md5($leftOversValue);

                $in['step'] = 'step_register_session';
            }

        }

        // Register a session with infohub_session
        if ($in['step'] === 'step_register_session') {

            $roleList = $this->_GetData(array(
                'name' => 'data_back/contact/role_list',
                'default' => [],
                'data' => $in
            ));

            return $this->_SubCall(array(
                'to' => array(
                    'node'=> 'server',
                    'plugin'=> 'infohub_session',
                    'function'=> 'responder_start_session'
                ),
                'data'=> array(
                    'initiator_user_name' => $in['data_back']['initiator_user_name'], // user_{hub_id}
                    'left_overs' => $leftOvers, // Left overs from the login. Never exposed outside this node
                    'role_list' => $roleList
                ),
                'data_back'=> array(
                    'step'=> 'step_register_session_response',
                    'initiator_user_name' => $in['data_back']['initiator_user_name'] // user_{hub_id}
                )
            ));
        }

        if ($in['step'] === 'step_register_session_response')
        {
            $in['step'] = 'step_end';

            if ($in['response']['logged_in'] === 'true') {
                $in['response']['message'] = 'Your initiator_calculated_id_code is valid. Here is the session_id we will use in all communication';
            }
        }

        if ($in['step'] === 'step_end') // Remove the login_request
        {
            $messages[] = $this->_SubCall(array(
                'to' => array(
                    'node'=> 'server',
                    'plugin'=> 'infohub_storage',
                    'function'=> 'write'
                ),
                'data'=> array(
                    'path'=> 'infohub_login/login_request/' . $in['initiator_user_name'],
                    'data'=> []
                ),
                'data_back'=> array(
                    'step' => 'step_end_response'
                )
            ));
        }

        $out = array(
            'answer' => $in['response']['answer'],
            'message' => $in['response']['message'],
            'messages' => $messages,
            'initiator_user_name' => $in['initiator_user_name'], // user_{hub_id}
            'session_id' => $in['response']['session_id'], // session_{hub_id}
            'session_created_at' => $in['response']['session_created_at'], // micro time with 3 decimals
            'logged_in' => $in['response']['logged_in']
        );

        return $out;
    }

    /**
     * Let this node login to another node
     * @todo See how the client does this in infohub_login_login.js
     * @version 2019-09-21
     * @since   2019-09-21
     * @author  Peter Lembke
     * @param array $in
     * @return array
     */
    protected function login(array $in = []): array
    {
        $default = array(
            'node' => '',
            'step' => 'step_get_contact_data',
            'from_plugin' => array(
                'node' => ''
            )
        );
        $in = $this->_Default($default, $in);

        if ($in['from_plugin']['node'] !== 'server') {
            $out['message'] = 'Only the server are allowed to use function login';
            $in['step'] = 'step_end';
        }

        if ($in['step'] === 'step_get_contact_data')
        {
        }

        if ($in['step'] === 'step_login_request')
        {
        }

        if ($in['step'] === 'step_login_request_response')
        {
        }

        if ($in['step'] === 'step_login_challenge')
        {
        }

        if ($in['step'] === 'step_login_challenge_response')
        {
        }

        $answer = 'false';
        $message = 'Failed';

        return array(
            'answer' => 'true',
            'message' => 'Your initiator_calculated_id_code is valid. Here is the session_id we will use in all communication and the first package_password',
            'session_id' => '',
            'package_password' => ''
        );
    }

    /**
     * Read a user login file from file/infohub_login/
     * @version 2020-07-07
     * @since   2020-07-07
     * @author  Peter Lembke
     * @param array $in
     * @return array
     */
    protected function read_login_file(array $in = []): array
    {
        $default = array(
            'step' => 'step_get_login_file_name',
            'from_plugin' => array(
                'node' => '',
                'plugin' => ''
            ),
            'config' => array(
                'download_account' => [],
                'user_name' => ''
            ),
            'response' => []
        );
        $in = $this->_Default($default, $in);

        if ($in['from_plugin']['node'] !== 'client') {
            $out['message'] = 'Only the client are allowed to use function read_login_file';
            $in['step'] = 'step_end';
        }

        if ($in['from_plugin']['plugin'] !== 'infohub_login') {
            $out['message'] = 'Only the client->infohub_login are allowed to use function read_login_file';
            $in['step'] = 'step_end';
        }

        if ($in['config']['user_name'] !== 'guest') {
            $out['message'] = 'Only guests are allowed to use function read_login_file';
            $in['step'] = 'step_end';
        }

        $out = array(
            'answer' => '',
            'message' => '',
            'contents' => '',
            'file_name' => ''
        );

        if ($in['step'] === 'step_get_login_file_name')
        {
            $url = $_SERVER['HTTP_HOST'];
            $fileName = $this->_GetData(array(
                'name' => 'config/download_account/' . $url,
                'default' => '',
                'data' => $in,
            ));

            if ($this->_Empty($fileName) === 'false') {
                $in['step'] = 'step_read_login_file';
            }
        }

        if ($in['step'] === 'step_read_login_file')
        {
            return $this->_SubCall(array(
                'to' => array(
                    'node'=> 'server',
                    'plugin'=> 'infohub_file',
                    'function'=> 'read'
                ),
                'data'=> array(
                    'path' => $fileName
                ),
                'data_back'=> array(
                    'step'=> 'step_read_login_file_response'
                )
            ));
        }

        if ($in['step'] === 'step_read_login_file_response') {
            $default = array(
                'answer' => 'false',
                'message' => '',
                'contents' => '',
                'path_info' => array(
                    'basename' => ''
                )
            );
            $in['response'] = $this->_Default($default, $in['response']);

            $out = array(
                'answer' => $in['response']['answer'],
                'message' => $in['response']['message'],
                'contents' => $in['response']['contents'],
                'file_name' => $in['response']['path_info']['basename']
            );
        }

        return array(
            'answer' => $out['answer'],
            'message' => $out['message'],
            'contents' => $out['contents'],
            'file_name' => $out['file_name']
        );
    }

    /**
     * Create a 256 byte random code and encode it with base64
     * Used in login_request for responder_random_code
     * Used in login for initiator_random_code
     * @version 2019-09-22
     * @since   2019-09-22
     * @author  Peter Lembke
     * @param array $in
     * @return array
     */
    protected function internal_CreateRandomCode(array $in = []): array
    {
        $default = array(
            'length' => 256
        );
        $in = $this->_Default($default, $in);

        $valid = 'false';
        $randomCodeBase64Encoded = '';

        $triesLeft = 4;

        while ($valid === 'false' && $triesLeft > 0)
        {
            $randomCodeString = '';
            for ($i = 0; $i < $in['length']; $i++) {
                $randomNumber = $this->_Random(0,255);
                $randomCodeString = $randomCodeString . chr($randomNumber);
            }

            $randomCodeBase64Encoded = base64_encode($randomCodeString);

            $response = $this->internal_Cmd(array(
                'func' => 'VerifyRandomCode',
                'length' => 256,
                'random_code' => $randomCodeBase64Encoded
            ));

            if ($response['valid'] === 'true') {
                $valid = 'true';
            }

            $triesLeft--;
        }

        return array(
            'answer' => 'true',
            'message' => 'Here are the random_code',
            'random_code' => $randomCodeBase64Encoded,
            'valid' => $valid
        );
    }

    /**
     * Gives you the best random number that your version of PHP can offer
     * @param int $min
     * @param int $max
     * @return int
     */
    protected function _Random($min = 0, $max = 0): int
    {
        $randomNumber = 0;
        try {
            if (function_exists('random_int')) { // Requires PHP 7
                $randomNumber = random_int($min, $max);
            } else {
                $randomNumber = mt_rand($min,$max); // PHP 5 and later
            }
        } catch (Exception $e) {
            $randomNumber = 0; // Not ideal
        }

        return $randomNumber;
    }

    /**
     * Verify random code that it is the right length and has some spread
     * Used in login_request for initiator_random_code
     * Used in login for responder_random_code
     * For advanced tests: https://www.random.org/analysis/
     * @version 2019-09-22
     * @since   2019-09-22
     * @author  Peter Lembke
     * @param array $in
     * @return array
     */
    protected function internal_VerifyRandomCode(array $in = []): array
    {
        $default = array(
            'random_code' => '',
            'length' => 256
        );
        $in = $this->_Default($default, $in);

        $valid = 'false';
        $message = 'Nothing to report';

        $binary = base64_decode($in['random_code']);
        $length = strlen($binary);
        if ($length !== $in['length']) {
            $message = 'The random code do not have the correct length';
            goto leave;
        }

        $average = [];
        $spread = array(2,3,5,7,11,13);

        for ($i=0; $i < $length;$i++)
        {
            foreach ($spread as $position => $number)
            {
                if (isset($average[$position]) === false) {
                    $average[$position] = ord($binary[$i]);
                    continue;
                }

                if ($i % $number === 0) {
                    $average[$position] = $average[$position] + ord($binary[$i]) / 2;
                }
            }
        }

        $totalAverage = array_sum($average) / count($spread);
        if ($totalAverage === round($totalAverage)) {
            $message = 'Unlikely that the total average has no decimals';
            goto leave;
        }

        foreach ($spread as $position => $number)
        {
            if ($average[$position] === $totalAverage) {
                $message = 'Unlikely that the average is equal to the total average';
                goto leave;
            }

            /*
            if ($average[$position] === round($average[$position])) {
                $message = 'Unlikely that the average has no decimals';
                goto leave;
            }
            */
        }

        $valid = 'true';
        $message = 'These simple tests show that the random_code at least is not a flatline of numbers.';

        leave:
        return array(
            'answer' => 'true', // No exceptions occurred
            'message' => $message,
            'valid' => $valid
        );
    }

    /**
     * Get the current seconds since epoc
     * Used in login_request for responder_seconds_since_epoc
     * Used in login for initiator_seconds_since_epoc
     * @version 2019-09-22
     * @since   2019-09-22
     * @author  Peter Lembke
     * @param array $in
     * @return array
     */
    protected function internal_GetSecondsSinceEpoc(array $in = []): array
    {
        $secondsSinceEpoc = $this->_MicroTime(); // example 34567.456

        return array(
            'answer' => 'true',
            'message' => 'Here are the current seconds since EPOC with fraction of seconds',
            'seconds_since_epoc' => $secondsSinceEpoc
        );
    }

    /**
     * Verify seconds since epoc that it is maximum x seconds old
     * Used in login_request for initiator_seconds_since_epoc
     * Used in login for responder_seconds_since_epoc
     * @version 2019-09-22
     * @since   2019-09-22
     * @author  Peter Lembke
     * @param array $in
     * @return array
     */
    protected function internal_VerifySecondsSinceEpoc(array $in = []): array
    {
        $default = array(
            'seconds_since_epoc' => 0.0,
            'max_seconds_old' => 2.0
        );
        $in = $this->_Default($default, $in);

        $message = 'The seconds_since_epoc is too old';

        $currentTime = $this->_MicroTime();
        $diff = $currentTime - $in['seconds_since_epoc'];

        $valid = 'false';
        if ($diff < 0.0) {
            $message = 'The seconds_since_epoc is not valid because it is set in the future';
            goto leave;
        }

        if ($diff <= $in['max_seconds_old']) {
            $valid = 'true';
            $message = 'The seconds_since_epoc is valid';
        }

        leave:
        return array(
            'answer' => 'true',
            'message' => $message,
            'valid' => $valid,
            'diff' => $diff
        );
    }

    /**
     * Verify the hub_id that it is plausible
     * @version 2019-12-07
     * @since   2019-12-07
     * @author  Peter Lembke
     * @param array $in
     * @return array
     */
    protected function internal_VerifyHubId(array $in = []): array
    {
        $default = array(
            'hub_id' => ''
        );
        $in = $this->_Default($default, $in);

        $message = 'The hub_id you provided can not be a real hub_id';
        $valid = 'false';

        $parts = explode(':', $in['hub_id']);
        if (count($parts) !== 2) {
            $message = 'Too many : in the string';
            goto leave;
        }

        $leftParts = explode('_', $parts[0]);
        $prefix = '';
        $time = $leftParts[0];

        if (count($leftParts) === 2) {
            $prefix = $leftParts[0];
            $time = $leftParts[1];
        }

        $randomNumber = $parts[1];

        $timeParts = explode('.', $time);
        if (count($timeParts) !== 2) {
            $message = 'Expect the time to have decimals';
            goto leave;
        }

        $timeFloat = (float) $time;
        if ($timeFloat < 1514764800.0) {
            $message = 'No hub_id were issued before 2018-01-01';
            goto leave;
        }

        if ($timeFloat > $this->_MicroTime()) {
            $message = 'This hub_id is in the future';
            goto leave;
        }

        if (is_numeric($randomNumber) === false) {
            $message = 'The random number in the hub_id must contain only numbers';
            goto leave;
        }

        $message = 'The hub_id seem to be valid';
        $valid = 'true';

        leave:
        return array(
            'answer' => 'true',
            'message' => $message,
            'valid' => $valid
        );
    }

    /**
     * Merge byte arrays
     * @version 2020-01-08
     * @since   2020-01-04
     * @author  Peter Lembke
     * @param $string1
     * @param $string2
     * @return string
     */
    protected function _MergeBase64Strings($string1, $string2)
    {
        $data1 = base64_decode($string1);
        $data2 = base64_decode($string2);
        $result = '';

        for ($position = 0; $position < strlen($data1); $position++) {

            $value1 = ord(substr($data1, $position));
            $value2 = ord(substr($data2, $position));
            $value = ($value1 + $value2) % 256;

            $result = $result . chr($value);
        }

        $base64Result = base64_encode($result);

        return $base64Result;
    }

    /**
     * Deduct one byte array from the other
     * @version 2020-01-08
     * @since   2020-01-04
     * @author  Peter Lembke
     * @param $string1
     * @param $string2
     * @return string
     */
    protected function _DeductBase64Strings($string1, $string2)
    {
        $data1 = base64_decode($string1);
        $data2 = base64_decode($string2);
        $result = '';

        for ($position = 0; $position < strlen($data1); $position++) {

            $value1 = ord(substr($data1, $position));
            $value2 = ord(substr($data2, $position));
            $value = $value1 - $value2;
            if ($value < 0) {
                $value = $value + 256;
            }

            $result = $result . chr($value);
        }

        $base64Result = base64_encode($result);

        return $base64Result;
    }

    /**
     * Rotate a base64 encoded string with byte array
     * @version 2020-01-08
     * @since   2020-01-04
     * @author  Peter Lembke
     * @param $string1
     * @param $steps
     * @return string
     */
    protected function _RotateBase64String($string1, $steps)
    {
        $data1 = base64_decode($string1);
        $result = substr($data1, $steps +1 ) . substr($data1,0,$steps);

        $base64Result = base64_encode($result);

        return $base64Result;
    }

    /**
     * Get a doc file
     * @version 2019-03-14
     * @since   2019-03-14
     * @author  Peter Lembke
     * @param array $in
     * @return array
     */
    protected function get_doc_file(array $in = []): array
    {
        $default = array(
            'language' => 'en',
            'folder' => 'plugin', // plugin or file
            'path' => 'start_page_text',
            'step' => 'step_read_doc_file',
            'response' => array(
                'answer' => 'false',
                'message' => 'Nothing to report from get_doc_file',
                'contents' => '',
                'checksum' => ''
            ),
            'data_back' => [],
            'from_plugin' => array(
                'node' => ''
            ),
            'config' => array(
                'information' => array(
                    'available_languages' => []
                )
            )
        );
        $in = $this->_Default($default, $in);

        if ($in['from_plugin']['node'] !== 'client') {
            $in['response']['message'] = 'Only node client are allowed to use function get_doc_file';
            $in['step'] = 'step_end';
        }

        $language = $in['language'];
        if (in_array($language, $in['config']['information']['available_languages']) === false) {
            $language = 'en';
        }

        $path = $in['path'] . '/' . $language . '.md';

        if ($in['step'] === 'step_read_doc_file') {
            return $this->_SubCall(array(
                'to' => array(
                    'node' => 'server',
                    'plugin' => 'infohub_file',
                    'function' => 'read'
                ),
                'data' => array(
                    'path' => $path,
                    'folder' => $in['folder']
                ),
                'data_back' => array(
                    'step' => 'step_end'
                )
            ));
        }

        return array(
            'answer' => $in['response']['answer'],
            'message' => $in['response']['message'],
            'contents' => $in['response']['contents'],
            'checksum' => $in['response']['checksum']
        );
    }
}
