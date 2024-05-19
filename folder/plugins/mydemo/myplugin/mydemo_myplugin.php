<?php
/**
 * Template plugin
 *
 * This is the text that describe what the plugin does
 *
 * @package     Mydemo
 * @subpackage  mydemo_myplugin
 */

declare(strict_types=1);
if (basename(__FILE__) == basename($_SERVER['SCRIPT_FILENAME'])) {
    exit; // This file must be included, not called directly
}

/**
 * Template plugin
 *
 * This is the text that describe what the plugin does
 *
 * @author      Peter Lembke <info@infohub.se>
 * @version     2020-07-31
 * @since       2020-07-31
 * @copyright   Copyright (c) 2020, Peter Lembke
 * @license     https://opensource.org/licenses/gpl-license.php GPL-3.0-or-later
 * @see         https://github.com/peterlembke/infohub/blob/master/folder/plugins/mydemo/myplugin/mydemo_myplugin.md Documentation
 * @link        https://infohub.se/ InfoHub main page
 */
class mydemo_myplugin extends infohub_base
{
    /**
     * Version information for this plugin
     * @version 2020-07-31
     * @since   2020-07-31
     * @author  Peter Lembke
     * @return string[]
     */
    protected final function _Version(): array
    {
        return [
            'date' => '2020-07-31',
            'since' => '2020-07-31',
            'version' => '1.0.0',
            'class_name' => 'mydemo_myplugin',
            'checksum' => '{{checksum}}',
            'note' => 'This is my first plugin',
            'status' => 'emerging',
            'SPDX-License-Identifier' => 'GPL-3.0-or-later',
            'user_role' => 'developer'
        ];
    }

    /**
     * Public functions in this plugin
     *
     * @return array
     * @since   2020-07-31
     * @author  Peter Lembke
     * @version 2020-07-31
     */
    protected function _GetCmdFunctions(): array
    {
        $list = [
            'my_function' => 'emerging'
        ];

        $response = parent::_GetCmdFunctionsBase($list);

        return $response;
    }

    // ***********************************************************
    // * your class functions below, only use protected functions
    // ***********************************************************

    /**
     * Example of class public function, always lower_case_names
     * Second row, more detailed description
     * @version 2020-07-31
     * @since   2020-07-31
     * @author  Your name
     * @param array $in
     * @return array
     */
    final protected function my_function(array $in = []): array
    {
        $default = [
            'some_data' => 'World'
        ];
        $in = $this->_Default($default, $in);

        $response = $this->internal_Cmd(
            [
                'func' => 'MyFunction',
                'some_data' => 'Hello ' . $in['some_data'],
                'say' => 'I say'
            ]
        );

        $data = $response['data'];

        return [
            'answer' => 'true',
            'message' => 'Got the data',
            'data' => $data
        ];
    }

    /**
     * Example of class internal function, always internal_CamelCase names
     * Second row, more detailed description
     * @version 2020-07-25
     * @since   2012-01-01
     * @author  Your name
     * @param array $in
     * @return array
     */
    final protected function internal_MyFunction(array $in = []): array
    {
        $default = [
            'some_data' => 'Hello',
            'say' => ''
        ];
        $in = $this->_Default($default, $in);

        $data = $in['say'] . ': ' . $in['some_data'] . '!';

        return [
            'answer' => 'true',
            'message' => 'Here are the data',
            'data' => $data
        ];
    }
}
