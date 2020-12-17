<?php
/**
 * Calculates your checksum
 *
 * Calculates checksum for MD5, CRC32, Soundex, Metaphone, Double methaphone, Luhn, Personnummer
 * You also get an option list with them all
 *
 * @package     Infohub
 * @subpackage  infohub_checksum
 */

declare(strict_types=1);
if (basename(__FILE__) == basename($_SERVER["SCRIPT_FILENAME"])) {
    exit; // This file must be included, not called directly
}

/**
 * Calculates your checksum
 *
 * Calculates checksum for MD5, CRC32, Soundex, Metaphone, Double methaphone, Luhn, Personnummer
 * You also get an option list with them all
 *
 * @author      Peter Lembke <info@infohub.se>
 * @version     2018-03-03
 * @since       2018-03-03
 * @copyright   Copyright (c) 2018, Peter Lembke
 * @license     https://opensource.org/licenses/gpl-license.php GPL-3.0-or-later
 * @see         https://github.com/peterlembke/infohub/blob/master/folder/plugins/infohub/checksum/infohub_checksum.md Documentation
 * @link        https://infohub.se/ InfoHub main page
 */
class infohub_checksum extends infohub_base
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
            'date' => '2018-03-03',
            'since' => '2018-03-03',
            'version' => '1.0.1',
            'class_name' => 'infohub_checksum',
            'checksum' => '{{checksum}}',
            'note' => 'Here you can get checksums in many different formats',
            'status' => 'normal',
            'SPDX-License-Identifier' => 'GPL-3.0-or-later',
            'user_role' => 'user'
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
            'calculate_checksum' => 'normal',
            'verify_checksum' => 'normal',
            'get_available_options' => 'normal'
        );

        return parent::_GetCmdFunctionsBase($list);
    }

    // ***********************************************************
    // * your class functions below, only use protected functions
    // ***********************************************************

    /**
     * Main checksum calculation
     * @version 2016-04-16
     * @since   2016-04-16
     * @author  Peter Lembke
     * @param array $in
     * @return array
     */
    protected function calculate_checksum(array $in = []): array
    {
        $default = array(
            'type' => 'md5',
            'value' => '',
            'checksum' => '',
            'step' => 'start_step',
            'answer' => 'false',
            'message' => 'Could not get a checksum',
            'verified' => 'false'
        );
        $in = $this->_Default($default, $in);

        if ($in['step'] === 'start_step') {

            $functionName = 'Calculate' . ucwords($in['type']);
            if (method_exists($this, 'internal_' . $functionName) === true) {
                return $this->internal_Cmd(array(
                    'func' => $functionName,
                    'value' => $in['value']
                ));
            }

            $pluginName = 'infohub_checksum_' . $in['type'];
            return $this->_SubCall(array(
                'to' => array('node' => 'server', 'plugin' => $pluginName, 'function' => 'calculate_checksum'),
                'data' => array('value' => $in['value'], 'checksum' => $in['checksum']),
                'data_back' => array('step' => 'response'),
            ));

        }

        return array(
            'answer' => $in['answer'],
            'message' => $in['message'],
            'value' => $in['value'],
            'checksum' => $in['checksum'],
            'verified' => 'false'
        );
    }

    /**
     * Main checksum calculation
     * @version 2016-04-16
     * @since   2016-04-16
     * @author  Peter Lembke
     * @param array $in
     * @return array
     */
    protected function verify_checksum(array $in = []): array
    {
        $default = array(
            'type' => 'md5',
            'value' => '',
            'checksum' => '',
            'step' => 'start_step',
            'answer' => 'false',
            'message' => 'Could not get a checksum',
            'verified' => 'false'
        );
        $in = $this->_Default($default, $in);

        if ($in['step'] === 'start_step') {

            $functionName = 'Verify' . ucwords($in['type']);
            if (method_exists($this, 'internal_' . $functionName) === true) {
                return $this->internal_Cmd(array(
                    'func' => $functionName,
                    'value' => $in['value'],
                    'checksum' => $in['checksum']
                ));
            }

            $pluginName = 'infohub_checksum_' . $in['type'];
            return $this->_SubCall(array(
                'to' => array('node' => 'server', 'plugin' => $pluginName, 'function' => 'verify_checksum'),
                'data' => array('value' => $in['value'], 'checksum' => $in['checksum']),
                'data_back' => array('step' => 'response'),
            ));

        }

        return array(
            'answer' => $in['answer'],
            'message' => $in['message'],
            'value' => $in['value'],
            'checksum' => $in['checksum'],
            'verified' => 'false'
        );

    }

    /**
     * md5 checksum calculation
     * 
     * @version 2016-04-16
     * @since   2016-04-16
     * @author  Peter Lembke
     * @param array $in
     * @return array
     */
    protected function internal_CalculateMd5(array $in = []): array
    {
        $default = array(
            'value' => ''
        );
        $in = $this->_Default($default, $in);

        return array(
            'answer' => 'true',
            'message' => 'Here are the md5 checksum',
            'value' => $in['value'],
            'checksum' => md5($in['value']),
            'verified' => 'false'
        );
    }

    /**
     * md5 verify calculation
     *
     * @version 2016-04-16
     * @since   2016-04-16
     * @author  Peter Lembke
     * @param array $in
     * @return array
     */
    protected function internal_VerifyMd5(array $in = []): array
    {
        $default = array(
            'value' => '',
            'checksum' => ''
        );
        $in = $this->_Default($default, $in);

        $verified = 'false';
        if (md5($in['value']) === $in['checksum']) {
            $verified = 'true';
        }

        return array(
            'answer' => 'true',
            'message' => 'Here are the md5 checksum verified',
            'value' => $in['value'],
            'checksum' => $in['checksum'],
            'verified' => $verified
        );
    }

    /**
     * crc32 checksum calculation
     * @version 2016-04-16
     * @since   2016-04-16
     * @author  Peter Lembke
     * @param array $in
     * @return array
     */
    protected function internal_CalculateCrc32(array $in = []): array
    {
        $default = array(
            'value' => ''
        );
        $in = $this->_Default($default, $in);

        $checksum = (string) crc32($in['value']);

        return array(
            'answer' => 'true',
            'message' => 'Here are the crc32 checksum',
            'value' => $in['value'],
            'checksum' => $checksum,
            'verified' => 'false'
        );
    }

    /**
     * crc32 verify calculation
     * @version 2016-04-16
     * @since   2016-04-16
     * @author  Peter Lembke
     * @param array $in
     * @return array
     */
    protected function internal_VerifyCrc32(array $in = []): array
    {
        $default = array(
            'value' => '',
            'checksum' => ''
        );
        $in = $this->_Default($default, $in);

        $verified = 'false';
        if (crc32($in['value']) === $in['checksum']) {
            $verified = 'true';
        }

        return array(
            'answer' => 'true',
            'message' => 'Here are the crc32 checksum verified',
            'value' => $in['value'],
            'checksum' => $in['checksum'],
            'verified' => $verified
        );
    }

    /**
     * soundex checksum calculation
     * https://en.wikipedia.org/wiki/Soundex
     * @version 2018-03-03
     * @since   2018-03-03
     * @author  Peter Lembke
     * @param array $in
     * @return array
     */
    protected function internal_CalculateSoundex(array $in = []): array
    {
        $default = array(
            'value' => ''
        );
        $in = $this->_Default($default, $in);

        return array(
            'answer' => 'true',
            'message' => 'Here are the soundex checksum',
            'value' => $in['value'],
            'checksum' => soundex($in['value']),
            'verified' => 'false'
        );
    }

    /**
     * soundex verify calculation
     * @version 2018-03-03
     * @since   2018-03-03
     * @author  Peter Lembke
     * @param array $in
     * @return array
     */
    protected function internal_VerifySoundex(array $in = []): array
    {
        $default = array(
            'value' => '',
            'checksum' => ''
        );
        $in = $this->_Default($default, $in);

        $verified = 'false';
        if (soundex($in['value']) === $in['checksum']) {
            $verified = 'true';
        }

        return array(
            'answer' => 'true',
            'message' => 'Here are the soundex checksum verified',
            'value' => $in['value'],
            'checksum' => $in['checksum'],
            'verified' => $verified
        );
    }

    /**
     * metaphone checksum calculation
     * https://en.wikipedia.org/wiki/Metaphone
     * @version 2018-03-03
     * @since   2018-03-03
     * @author  Peter Lembke
     * @param array $in
     * @return array
     */
    protected function internal_CalculateMetaphone(array $in = []): array
    {
        $default = array(
            'value' => ''
        );
        $in = $this->_Default($default, $in);

        return array(
            'answer' => 'true',
            'message' => 'Here are the metaphone checksum',
            'value' => $in['value'],
            'checksum' => metaphone($in['value']),
            'verified' => 'false'
        );
    }

    /**
     * metaphone verify calculation
     * @version 2018-03-03
     * @since   2018-03-03
     * @author  Peter Lembke
     * @param array $in
     * @return array
     */
    protected function internal_VerifyMetaphone(array $in = []): array
    {
        $default = array(
            'value' => '',
            'checksum' => ''
        );
        $in = $this->_Default($default, $in);

        $verified = 'false';
        if (metaphone($in['value']) === $in['checksum']) {
            $verified = 'true';
        }

        return array(
            'answer' => 'true',
            'message' => 'Here are the metaphone checksum verified',
            'value' => $in['value'],
            'checksum' => $in['checksum'],
            'verified' => $verified
        );
    }

    /**
     * Get list with checksum methods you can use
     * @version 2018-08-10
     * @since   2018-08-10
     * @author  Peter Lembke
     * @param array $in
     * @return array|bool
     */
    protected function  get_available_options(array $in = []): array
    {
        $options = array(
            array("type" => "option", "value" => 'crc32', "label" => 'CRC32'),
            array("type" => "option", "value" => 'soundex', "label" => 'Soundex'),
            array("type" => "option", "value" => 'metaphone', "label" => 'Metaphone'),
            array("type" => "option", "value" => 'doublemetaphone', "label" => 'Double metaphone'),
            array("type" => "option", "value" => 'luhn', "label" => 'Luhn'),
            array("type" => "option", "value" => 'md5', "label" => 'MD5', 'selected' => 'true'),
            array("type" => "option", "value" => 'personnummer', "label" => 'Personnummer')
        );

        return array(
            'answer' => 'true',
            'message' => 'List of valid checksum methods.',
            'options' => $options
        );
    }

}
