<?php
/**
 * Calculates your checksum with Double metaphone
 *
 * The Double Metaphone phonetic encoding algorithm is the second generation of this algorithm.
 *
 * @package     Infohub
 * @subpackage  infohub_checksum_doublemetaphone
 */

declare(strict_types=1);
if (basename(__FILE__) == basename($_SERVER["SCRIPT_FILENAME"])) {
    exit; // This file must be included, not called directly
}
include_once('DoubleMetaphone.php'); // This is not compatible with the autoloader

/**
 * Calculates your checksum with Double metaphone
 *
 * The Double Metaphone phonetic encoding algorithm is the second generation of this algorithm.
 *
 * @author      Peter Lembke <info@infohub.se>
 * @version     2018-11-09
 * @since       2018-03-03
 * @copyright   Copyright (c) 2018, Peter Lembke
 * @license     https://opensource.org/licenses/gpl-license.php GPL-3.0-or-later
 * @see         https://github.com/peterlembke/infohub/blob/master/folder/plugins/infohub/checksum/doublemetaphone/infohub_checksum_doublemetaphone.md Documentation
 * @link        https://infohub.se/ InfoHub main page
 */
class infohub_checksum_doublemetaphone extends infohub_base
{
    /**
     * Version information for this plugin
     * @version 2018-03-03
     * @since   2018-03-03
     * @author  Peter Lembke
     * @return string[]
     */
    protected function _Version(): array
    {
        return array(
            'date' => '2018-11-09',
            'since' => '2018-03-03',
            'version' => '1.0.0',
            'class_name' => 'infohub_checksum_doublemetaphone',
            'checksum' => '{{checksum}}',
            'note' => 'The Double Metaphone phonetic encoding algorithm is the second generation of this algorithm.',
            'status' => 'normal',
            'SPDX-License-Identifier' => 'GPL-3.0-or-later'
        );
    }

    /**
     * Public functions in this plugin
     * @version 2018-03-03
     * @since   2018-03-03
     * @author  Peter Lembke
     * @return mixed
     */
    protected function _GetCmdFunctions(): array
    {
        $list = array(
            'calculate_checksum' => 'emerging',
            'verify_checksum' => 'emerging'
        );

        return parent::_GetCmdFunctionsBase($list);
    }

    // ***********************************************************
    // * your class functions below, only use protected functions
    // ***********************************************************

    /**
     * Main checksum calculation
     * 
     * @version 2018-03-03
     * @since   2018-03-03
     * @author  Peter Lembke
     * @param array $in
     * @return array
     */
    protected function calculate_checksum(array $in = []): array
    {
        $default = array(
            'value' => '',
            'checksum' => '',
        );
        $in = $this->_Default($default, $in);

        $back = new DoubleMetaphone($in['value']);
        $result = $back->primary . ' ' . $back->secondary;

        return array(
            'answer' => 'true',
            'message' => 'Here are the checksum',
            'value' => $in['value'],
            'checksum' => $result,
            'verified' => 'false'
        );

    }

    /**
     * Main checksum verification
     * 
     * @version 2018-03-03
     * @since   2018-03-03
     * @author  Peter Lembke
     * @param array $in
     * @return array
     */
    protected function verify_checksum(array $in = []): array
    {
        $default = array(
            'value' => '',
            'checksum' => '',
        );
        $in = $this->_Default($default, $in);

        $back = new DoubleMetaphone($in['value']);
        $result = $back->primary . ' ' . $back->secondary;

        $verified = 'false';
        if ($result === $in['checksum']) {
            $verified = 'true';
        }

        return array(
            'answer' => 'true',
            'message' => 'Here are the result of the checksum verification',
            'value' => $in['value'],
            'checksum' => $in['checksum'],
            'verified' => $verified
        );
    }
}
