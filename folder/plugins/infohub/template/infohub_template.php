<?php
/**
 * One liner comment what this plugin is about
 *
 * More information on up to three rows
 *
 * @package     Infohub
 * @subpackage  infohub_template
 */

declare(strict_types=1);
if (basename(__FILE__) == basename($_SERVER['SCRIPT_FILENAME'])) {
    exit; // This file must be included, not called directly
}

/**
 * One liner comment what this plugin is about
 *
 * More information on up to three rows
 *
 * @author      Your Name <your@email.com>
 * @version     2020-11-25
 * @since       2020-11-25
 * @copyright   Copyright (c) 2020, Your Name, Your Company
 * @license     https://opensource.org/licenses/gpl-license.php GPL-3.0-or-later
 * @see         https://github.com/peterlembke/infohub/blob/master/folder/plugins/infohub/template/infohub_template.md Documentation
 * @link        https://infohub.se/ InfoHub main page
 */
class infohub_template extends infohub_base
{
    // Change name of the class: infohub_template to whatever you want, and remove this comment

    /**
     * Version information for this plugin
     * @return  string[]
     * @since   2020-11-25
     * @author  Peter Lembke
     * @version 2020-11-25
     */
    protected function _Version(): array
    {
        return [
            'date' => '2020-11-25',
            'since' => '2020-11-25',
            'version' => '1.0.0',
            'class_name' => 'infohub_template',
            'checksum' => '{{checksum}}',
            'note' => 'One line with the plugin purpose',
            'status' => 'emerging',
            'SPDX-License-Identifier' => 'GPL-3.0-or-later',
            'user_role' => 'developer' // Select one of user,admin,developer
        ];
    }

    /**
     * Public functions in this plugin
     *
     * @return array
     * @author  Peter Lembke
     * @version 2020-11-25
     * @since   2020-11-25
     */
    protected function _GetCmdFunctions(): array
    {
        $list = [
            'my_function' => 'emerging'
        ];

        return parent::_GetCmdFunctionsBase($list);
    }

    // ***********************************************************
    // * your class functions below, only use protected functions
    // ***********************************************************

    /**
     * Example of class public function, always lower_case_names
     * Second row, more detailed description
     * @param array $in
     * @return array
     * @author  Your name
     * @version 2020-07-25
     * @since   2012-01-01
     */
    protected function my_function(array $in = []): array
    {
        $default = [];
        $in = $this->_Default($default, $in);

        $response = $this->internal_Cmd(
            [
                'func' => 'MyFunction',
                'some_data' => 'Hello World!'
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
     * @param array $in
     * @return array
     * @author  Your name
     * @version 2020-07-25
     * @since   2012-01-01
     */
    protected function internal_MyFunction(array $in = []): array
    {
        $default = [
            'some_data' => 'Hello'
        ];
        $in = $this->_Default($default, $in);

        $data = 'I say: ' . $in['some_data'];

        return [
            'answer' => 'true',
            'message' => 'Here are the data',
            'data' => $data
        ];
    }
}

