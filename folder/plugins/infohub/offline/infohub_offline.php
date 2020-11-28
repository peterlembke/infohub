<?php
/**
 * Handle offline
 *
 * Answers with the current checksum for index.php, then the client know if index.php need to be updated
 *
 * @package     Infohub
 * @subpackage  infohub_offline
 */

declare(strict_types=1);
if (basename(__FILE__) == basename($_SERVER["SCRIPT_FILENAME"])) {
    exit; // This file must be included, not called directly
}

/**
 * Handle offline
 *
 * Answers with the current checksum for index.php, then the client know if index.php need to be updated
 *
 * @author      Peter Lembke <info@infohub.se>
 * @version     2019-11-13
 * @since       2019-11-13
 * @copyright   Copyright (c) 2019, Peter Lembke
 * @license     https://opensource.org/licenses/gpl-license.php GPL-3.0-or-later
 * @see         https://github.com/peterlembke/infohub/blob/master/folder/plugins/infohub/offline/infohub_offline.md Documentation
 * @link        https://infohub.se/ InfoHub main page
 */
class infohub_offline extends infohub_base
{
    /**
     * Version information for this plugin
     * @version 2019-11-13
     * @since 2019-11-13
     * @author  Peter Lembke
     * @return  string[]
     */
    protected function _Version(): array
    {
        return array(
            'date' => '2019-11-13',
            'since' => '2019-11-13',
            'version' => '1.0.0',
            'class_name' => 'infohub_offline',
            'checksum' => '{{checksum}}',
            'note' => 'Answers with the current checksum for index.php, then the client know if index.php need to be updated',
            'status' => 'normal',
            'SPDX-License-Identifier' => 'GPL-3.0-or-later',
            'user_role' => 'user'
        );
    }

    /**
     * Public functions in this plugin
     * @version 2019-11-13
     * @since 2019-11-13
     * @author  Peter Lembke
     * @return mixed
     */
    protected function _GetCmdFunctions(): array
    {
        $list = array(
            'index_checksum' => 'normal'
        );

        return parent::_GetCmdFunctionsBase($list);
    }

    // Documentation: http://127.0.0.1/infohub/doc/plugin/name/infohub_demo

    /**
     * Get current checksum for the files in index.php
     * @version 2019-11-13
     * @since   2019-11-13
     * @author  Peter Lembke
     * @param array $in
     * @return array
     */
    protected function index_checksum(array $in = []): array
    {
        $default = array(
            'rendered_checksum' => '',
            'step' => 'step_start',
            'response' => array(
                'answer' => 'true',
                'message' => '',
                'checksum' => ''
            )
        );
        $in = $this->_Default($default, $in);

        if ($in['step'] === 'step_start')
        {
            return $this->_SubCall(array(
                'to' => array(
                    'node' => 'server',
                    'plugin' => 'infohub_file',
                    'function' => 'index_checksum'
                ),
                'data' => [],
                'data_back' => array(
                    'step' => 'step_response',
                    'rendered_checksum' => $in['rendered_checksum']
                )
            ));
        }

        $valid = 'false';
        $message = 'Please update your cache';

        if ($in['step'] === 'step_response')
        {
            if ($in['rendered_checksum'] ===  $in['response']['checksum'])
            {
                $valid = 'true';
                $message = 'Your cache is still valid';
            }
        }

        return array(
            'answer' => 'true',
            'message' => $message,
            'checksum' => $in['response']['checksum'],
            'valid' => $valid
        );
    }
}
