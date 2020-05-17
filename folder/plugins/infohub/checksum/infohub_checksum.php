<?php
declare(strict_types=1);
if (basename(__FILE__) == basename($_SERVER["SCRIPT_FILENAME"])) {
    exit; // This file must be included, not called directly
}

/*	infohub_checksum

		Copyright (C) 2016 Peter Lembke , CharZam soft
		the program is distributed under the terms of the GNU General Public License

		Infohub_Checksum is free software: you can redistribute it and/or modify
		it under the terms of the GNU General Public License as published by
		the Free Software Foundation, either version 3 of the License, or
		(at your option) any later version.

		Infohub_Checksum is distributed in the hope that it will be useful,
		but WITHOUT ANY WARRANTY; without even the implied warranty of
		MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
		GNU General Public License for more details.

		You should have received a copy of the GNU General Public License
		along with Infohub_Checksum.	If not, see <https://www.gnu.org/licenses/>.
*/
class infohub_checksum extends infohub_base
{

    protected final function _Version(): array
    {
        return array(
            'date' => '2018-03-03',
            'version' => '1.0.1',
            'class_name' => 'infohub_checksum',
            'checksum' => '{{checksum}}',
            'note' => 'Here you can get checksums in many different formats',
            'status' => 'normal',
            'SPDX-License-Identifier' => 'GPL-3.0-or-later',
            'recommended_security_group' => 'user'
        );
    }

    protected function _GetCmdFunctions(): array
    {
        return array(
            'calculate_checksum' => 'normal',
            'verify_checksum' => 'normal',
            'get_available_options' => 'normal'
        );
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
    final protected function calculate_checksum(array $in = array()): array
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
    final protected function verify_checksum(array $in = array()): array
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
     * @version 2016-04-16
     * @since   2016-04-16
     * @author  Peter Lembke
     * @param array $in
     * @return array
     */
    final protected function internal_CalculateMd5(array $in = array()): array
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
     * md5 checksum calculation
     * @version 2016-04-16
     * @since   2016-04-16
     * @author  Peter Lembke
     * @param array $in
     * @return array
     */
    final protected function internal_VerifyMd5(array $in = array()): array
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
     * md5 checksum calculation
     * @version 2016-04-16
     * @since   2016-04-16
     * @author  Peter Lembke
     * @param array $in
     * @return array
     */
    final protected function internal_CalculateCrc32(array $in = array()): array
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
     * md5 checksum calculation
     * @version 2016-04-16
     * @since   2016-04-16
     * @author  Peter Lembke
     * @param array $in
     * @return array
     */
    final protected function internal_VerifyCrc32(array $in = array()): array
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
    final protected function internal_CalculateSoundex(array $in = array()): array
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
     * md5 checksum calculation
     * @version 2018-03-03
     * @since   2018-03-03
     * @author  Peter Lembke
     * @param array $in
     * @return array
     */
    final protected function internal_VerifySoundex(array $in = array()): array
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
    final protected function internal_CalculateMetaphone(array $in = array()): array
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
     * metaphone checksum calculation
     * @version 2018-03-03
     * @since   2018-03-03
     * @author  Peter Lembke
     * @param array $in
     * @return array
     */
    final protected function internal_VerifyMetaphone(array $in = array()): array
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
    final protected function  get_available_options(array $in = array()): array
    {
        $options = array(
            array("type" => "option", "value" => 'crc32', "label" => 'CRC32' ),
            array("type" => "option", "value" => 'soundex', "label" => 'Soundex' ),
            array("type" => "option", "value" => 'metaphone', "label" => 'Metaphone' ),
            array("type" => "option", "value" => 'doublemetaphone', "label" => 'Double metaphone' ),
            array("type" => "option", "value" => 'luhn', "label" => 'Luhn' ),
            array("type" => "option", "value" => 'md5', "label" => 'MD5', 'selected' => 'true' ),
            array("type" => "option", "value" => 'personnummer', "label" => 'Personnummer' )
        );

        return array(
            'answer' => 'true',
            'message' => 'List of valid checksum methods.',
            'options' => $options
        );
    }

}
