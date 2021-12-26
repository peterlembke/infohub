<?php
/**
 * Examples that show who can send messages to who
 *
 * @package     Infohub
 * @subpackage  infohub_democall
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
class infohub_democall extends infohub_base
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
            'class_name' => 'infohub_democall',
            'checksum' => '{{checksum}}',
            'note' => 'Examples that show who can send messages to who',
            'status' => 'normal',
            'SPDX-License-Identifier' => 'GPL-3.0-or-later',
            'user_role' => 'developer'
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
            'run_all_tests' => 'normal',
            'my_test' => 'normal',
            'call_self' => 'normal', // OK
            'call_child' => 'normal', // OK
            'call_level1_on_same_node' => 'normal', // OK
            'call_grandchild' => 'normal', // FAIL
            'call_child_that_call_self' => 'normal', // OK
            'call_child_that_call_level1_on_same_node' => 'normal', // OK
            'call_child_that_call_level1_on_other_node' => 'normal', // FAIL
            'call_child_that_call_grandchild' => 'normal', // OK
            'call_child_that_call_grandchild_that_call_level1_on_same_node' => 'normal', // OK
            'call_child_that_call_grandchild_that_call_parent' => 'normal', // FAIL
            'call_child_that_call_sibling' => 'normal', // OK
            'call_child_that_call_siblings_child' => 'normal', // FAIL
        ];

        return parent::_GetCmdFunctionsBase($list);
    }

    /**
     * Will call all functions in this plugin and put together a result
     *
     * @param array $in
     * @return array
     * @version 2019-03-09
     * @since   2019-03-09
     */
    protected function run_all_tests(array $in = []): array
    {
        $default = [
            'step' => 'step_start',
            'response' => [
                'answer' => 'false',
                'expected_answer' => 'false',
                'message' => 'Nothing to report'
            ],
            'data_back' => [
                'function' => '',
                'functions_to_test' => [],
                'functions_tested' => []
            ]
        ];
        $in = $this->_Default($default, $in);

        if ($in['step'] === 'step_start') {
            $in['data_back']['functions_to_test'] = $this->_GetCmdFunctions();
            unset($in['data_back']['functions_to_test']['run_all_tests']);
            $in['step'] = 'step_do_we_have_more_functions_to_test';
        }

        if ($in['step'] === 'step_call_function_response') {
            $function = $in['data_back']['function'];
            $in['data_back']['functions_tested'][$function] = $in['response'];
            $in['step'] = 'step_do_we_have_more_functions_to_test';
        }

        if ($in['step'] === 'step_do_we_have_more_functions_to_test') {
            $in['step'] = 'step_end';
            if (count($in['data_back']['functions_to_test']) > 0) {
                $in['step'] = 'step_call_function';
            }
        }

        if ($in['step'] === 'step_call_function') {
            end($in['data_back']['functions_to_test']);
            $function = key($in['data_back']['functions_to_test']);
            array_pop($in['data_back']['functions_to_test']);
            return $this->_SubCall(
                [
                    'to' => [
                        'node' => 'server',
                        'plugin' => 'infohub_democall',
                        'function' => $function
                    ],
                    'data' => [
                    ],
                    'data_back' => [
                        'step' => 'step_call_function_response',
                        'function' => $function,
                        'functions_to_test' => $in['data_back']['functions_to_test'],
                        'functions_tested' => $in['data_back']['functions_tested']
                    ],
                ]
            );
        }

        return [
            'answer' => 'true',
            'message' => 'Done calling all test fuinctions',
            'data' => $in['data_back']['functions_tested']
        ];
    }

    /**
     * A beacon function that report back to the visitor
     *
     * @param array $in
     * @return array
     * @version 2019-03-09
     * @since   2019-03-09
     */
    protected function my_test(array $in = []): array
    {
        $default = [];
        $in = $this->_Default($default, $in);

        return [
            'answer' => 'true',
            'expected_answer' => 'true',
            'message' => 'You reached my_test in plugin ' . $this->_GetClassName()
        ];
    }

    /**
     * Call a cmd function in this plugin
     * This call is OK
     *
     * @param array $in
     * @return array
     * @version 2019-03-09
     * @since   2019-03-09
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
                        'plugin' => 'infohub_democall',
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
            'expected_answer' => 'true',
            'message' => $in['response']['message']
        ];
    }

    /**
     * Call a cmd function in the child plugin
     * This call is OK
     * @param array $in
     * @return array
     * @version 2019-03-09
     * @since   2019-03-09
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
            'expected_answer' => 'true',
            'message' => $in['response']['message']
        ];
    }

    /**
     * Call a level 1 plugin in this node
     * This call is OK
     * @param array $in
     * @return array
     * @version 2019-03-09
     * @since   2019-03-09
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
            'expected_answer' => 'true',
            'message' => $in['response']['message']
        ];
    }

    /**
     * Call a grandchild
     * This call will FAIL. This is not allowed.
     * @param array $in
     * @return array
     * @version 2019-03-09
     * @since   2019-03-09
     */
    protected function call_grandchild(array $in = []): array
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
            'expected_answer' => 'false',
            'message' => $in['response']['message']
        ];
    }

    /**
     * Call a child that then call itself
     * This call is OK
     * @param array $in
     * @return array
     * @version 2019-03-09
     * @since   2019-03-09
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
            'expected_answer' => 'true',
            'message' => $in['response']['message']
        ];
    }

    /**
     * Call a child that then call a level1 plugin on the same node
     * This call is OK
     *
     * @param array $in
     * @return array
     * @version 2019-03-09
     * @since   2019-03-09
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
                        'plugin' => 'infohub_democall_child',
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
            'expected_answer' => 'true',
            'message' => $in['response']['message']
        ];
    }

    /**
     * Call a child that then call a level1 plugin in another node
     * This call will FAIL. This is not allowed.
     *
     * @param array $in
     * @return array
     * @version 2019-03-09
     * @since   2019-03-09
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
                        'node' => 'server',
                        'plugin' => 'infohub_democall_child',
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
            'expected_answer' => 'false',
            'message' => $in['response']['message']
        ];
    }

    /**
     * Call a child that then call its child (our grandchild)
     * This call is OK
     *
     * @param array $in
     * @return array
     * @version 2019-03-09
     * @since   2019-03-09
     */
    protected function call_child_that_call_grandchild(array $in = []): array
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
                        'function' => 'call_child'
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
            'expected_answer' => 'true',
            'message' => $in['response']['message']
        ];
    }

    /**
     * Call a child that then call its child (our grandchild) that calls a level1 plugin
     * This call is OK
     *
     * @param array $in
     * @return array
     * @version 2019-03-09
     * @since   2019-03-09
     */
    protected function call_child_that_call_grandchild_that_call_level1_on_same_node(array $in = []): array
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
                        'function' => 'call_child_that_call_level1_on_same_node'
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
            'expected_answer' => 'true',
            'message' => $in['response']['message']
        ];
    }

    /**
     * Call a child that then call its child (our grandchild) that calls its parent
     * This call will FAIL. This is not allowed.
     *
     * @param array $in
     * @return array
     * @version 2019-03-09
     * @since   2019-03-09
     */
    protected function call_child_that_call_grandchild_that_call_parent(array $in = []): array
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
                        'function' => 'call_child_that_call_parent'
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
            'expected_answer' => 'false',
            'message' => $in['response']['message']
        ];
    }

    /**
     * Call a child that then call its sibling
     * This call is OK
     *
     * @param array $in
     * @return array
     * @version 2019-03-09
     * @since   2019-03-09
     */
    protected function call_child_that_call_sibling(array $in = []): array
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
                        'function' => 'call_sibling'
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
            'expected_answer' => 'true',
            'message' => $in['response']['message']
        ];
    }

    /**
     * Call a child that then call its siblings' child
     * This call will FAIL. This is not allowed.
     *
     * @param array $in
     * @return array
     * @version 2019-03-09
     * @since   2019-03-09
     */
    protected function call_child_that_call_siblings_child(array $in = []): array
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
                        'function' => 'call_siblings_child'
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
            'expected_answer' => 'false',
            'message' => $in['response']['message']
        ];
    }
}
