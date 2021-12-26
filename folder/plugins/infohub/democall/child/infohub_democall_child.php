<?php
/**
 * Examples that show who can send messages to who
 *
 * @package     Infohub
 * @subpackage  infohub_democall_child
 */

declare(strict_types=1);
if (basename(__FILE__) == basename($_SERVER["SCRIPT_FILENAME"])) {
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
class infohub_democall_child extends infohub_base
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
            'since' => '2019-03-09',
            'version' => '1.0.0',
            'class_name' => 'infohub_democall_child',
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
            'call_self' => 'normal', // OK
            'call_child' => 'normal', // OK
            'call_level1_on_same_node' => 'normal', // OK
            'call_level1_on_other_node' => 'normal', // FAIL
            'call_child_that_call_self' => 'normal', // OK
            'call_child_that_call_level1_on_same_node' => 'normal', // OK
            'call_child_that_call_level1_on_other_node' => 'normal', // FAIL
            'call_child_that_call_parent' => 'normal', // FAIL
            'call_sibling' => 'normal', // OK
            'call_siblings_child' => 'normal', // FAIL
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
     * Call a cmd function in this plugin
     * This call is OK
     * @param array $in
     * @return array
     */
    protected function call_self(array $in = []): array
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
                        'plugin' => 'infohub_democall_child',
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
                        'plugin' => 'infohub_democall_child_grandchild',
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

    /**
     * Call a level 1 plugin in this node
     * This call is OK
     * @param array $in
     * @return array
     */
    protected function call_level1_on_same_node(array $in = []): array
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
                        'plugin' => 'infohub_checksum',
                        'function' => 'calculate_checksum'
                    ],
                    'data' => [
                        'value' => 'hello'
                    ],
                    'data_back' => [
                        'step' => 'step_end'
                    ]
                ]
            );
        }

        return [
            'answer' => $in['response']['answer'],
            'message' => $in['response']['message']
        ];
    }

    /**
     * Call a level 1 plugin in this node
     * This call is OK
     * @param array $in
     * @return array
     */
    protected function call_level1_on_other_node(array $in = []): array
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
                        'node' => 'client',
                        'plugin' => 'infohub_checksum',
                        'function' => 'calculate_checksum'
                    ],
                    'data' => [
                        'value' => 'hello'
                    ],
                    'data_back' => [
                        'step' => 'step_end',
                    ]
                ]
            );
        }

        return [
            'answer' => $in['response']['answer'],
            'message' => $in['response']['message']
        ];
    }

    /**
     * Call a child that then call itself
     * This call is OK
     * @param array $in
     * @return array
     */
    protected function call_child_that_call_self(array $in = []): array
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
                        'plugin' => 'infohub_democall_child',
                        'function' => 'call_self'
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

    /**
     * Call a child that then call a level1 plugin on the same node
     * This call is OK
     * @param array $in
     * @return array
     */
    protected function call_child_that_call_level1_on_same_node(array $in = []): array
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
                        'plugin' => 'infohub_democall_child_grandchild',
                        'function' => 'call_level1_on_same_node'
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

    /**
     * Call a child that then call a level1 plugin in another node
     * This call will FAIL. This is not allowed.
     * @param array $in
     * @return array
     */
    protected function call_child_that_call_level1_on_other_node(array $in = []): array
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
                        'node' => 'client',
                        'plugin' => 'infohub_democall_child_grandchild',
                        'function' => 'call_level1_on_other_node'
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

    /**
     * Call a child that then call its parent
     * This call is OK
     * @param array $in
     * @return array
     */
    protected function call_child_that_call_parent(array $in = []): array
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
                        'plugin' => 'infohub_democall_child_grandchild',
                        'function' => 'call_parent'
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

    /**
     * Call a sibling
     * This call is OK
     * @param array $in
     * @return array
     */
    protected function call_sibling(array $in = []): array
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
                        'plugin' => 'infohub_democall_sibling',
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

    /**
     * Call a siblings' child
     * This call will FAIL. This is not allowed.
     * @param array $in
     * @return array
     */
    protected function call_siblings_child(array $in = []): array
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
