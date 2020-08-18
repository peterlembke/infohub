<?php
declare(strict_types=1);
if (basename(__FILE__) == basename($_SERVER["SCRIPT_FILENAME"])) {
    exit; // This file must be included, not called directly
}

/*	infohub_checksum_doublemetaphone

		Copyright (C) 2016 Peter Lembke , CharZam soft
		the program is distributed under the terms of the GNU General Public License

		infohub_checksum_doublemetaphone is free software: you can redistribute it and/or modify
		it under the terms of the GNU General Public License as published by
		the Free Software Foundation, either version 3 of the License, or
		(at your option) any later version.

		infohub_checksum_doublemetaphone is distributed in the hope that it will be useful,
		but WITHOUT ANY WARRANTY; without even the implied warranty of
		MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
		GNU General Public License for more details.

		You should have received a copy of the GNU General Public License
		along with infohub_checksum_doublemetaphone.	If not, see <https://www.gnu.org/licenses/>.
*/

include_once('DoubleMetaphone.php'); // This is not compatible with the autoloader
class infohub_checksum_doublemetaphone extends infohub_base
{

    var $dmp;

    protected final function _Version(): array
    {
        return array(
            'date' => '2018-03-03',
            'since' => '2018-03-03',
            'version' => '1.0.0',
            'class_name' => 'infohub_checksum_doublemetaphone',
            'checksum' => '{{checksum}}',
            'note' => 'The Double Metaphone phonetic encoding algorithm is the second generation of this algorithm.',
            'status' => 'normal',
            'SPDX-License-Identifier' => 'GPL-3.0-or-later'
        );
    }

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
     * @version 2018-03-03
     * @since   2018-03-03
     * @author  Peter Lembke
     * @param array $in
     * @return array
     */
    final protected function calculate_checksum(array $in = array()): array
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
     * @version 2018-03-03
     * @since   2018-03-03
     * @author  Peter Lembke
     * @param array $in
     * @return array
     */
    final protected function verify_checksum(array $in = array()): array
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
