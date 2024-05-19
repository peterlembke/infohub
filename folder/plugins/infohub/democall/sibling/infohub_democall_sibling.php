<?php
/**
 * Examples that show who can send messages to who
 *
 * @package     Infohub
 * @subpackage  infohub_democall_sibling
 */

declare(strict_types=1);
if (basename(__FILE__) == basename($_SERVER['SCRIPT_FILENAME'])) {
    exit; // This file must be included, not called directly
}

/**
 * Examples that show who can send messages to who
 *
 * @author      Peter Lembke <info@infohub.se>
 * @version     2019-03-09
 * @since       2019-03-09
 * @copyright   Copyright (c) 2019, Peter Lembke
 * @license     https://opensource.org/licenses/gpl-license.php GPL-3.0-or-later
 * @see         https://github.com/peterlembke/infohub/blob/master/folder/plugins/infohub/checksum/infohub_checksum.md Documentation
 * @link        https://infohub.se/ InfoHub main page
 */
class infohub_democall_sibling extends infohub_base
{
    /**
     * Version information for this plugin
     *
     * @return string[]
     * @since   2019-03-09
     * @author  Peter Lembke
     * @version 2019-03-09
     */
    protected function _Version(): array
    {
        return [
            'date' => '2019-03-09',
            'version' => '1.0.0',
            'class_name' => 'infohub_democall_sibling',
            'checksum' => '{{checksum}}',
            'note' => 'Examples that show who can send messages to who',
            'status' => 'normal',
            'SPDX-License-Identifier' => 'GPL-3.0-or-later'
        ];
    }

    /**
     * Public functions in this plugin
     *
     * @return array
     * @author  Peter Lembke
     * @version 2019-03-09
     * @since   2019-03-09
     */
    protected function _GetCmdFunctions(): array
    {
        $list = [
            'my_test' => 'normal',
            'call_child' => 'normal' // OK
        ];

        return parent::_GetCmdFunctionsBase($list);
    }

    /**
     * A beacon function that report back to the visitor
     * @param array $in
     * @return array
     */
    protected function my_test(array $in = []): array
    {
        $default = [];
        $in = $this->_Default($default, $in);

        return [
            'answer' => 'true',
            'message' => 'You reached my_test in plugin ' . $this->_GetClassName()
        ];
    }

    /**
     * Call a cmd function in the child plugin
     * This call is OK
     * @param array $in
     * @return array
     */
    protected function call_child(array $in = []): array
    {
        $default = [
            'step' => 'step_start',
            'response' => [
                'answer' => 'false',
                'message' => ''
            ]
        ];
        $in = $this->_Default($default, $in);

        if ($in['step'] === 'step_start') {
            return $this->_SubCall(
                [
                    'to' => [
                        'node' => 'server',
                        'plugin' => 'infohub_democall_sibling_grandchild',
                        'function' => 'my_test'
                    ],
                    'data' => [
                    ],
                    'data_back' => [
                        'step' => 'step_end',
                    ],
                ]
            );
        }

        return [
            'answer' => $in['response']['answer'],
            'message' => $in['response']['message']
        ];
    }

}
