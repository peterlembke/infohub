<?php
declare(strict_types=1);
if (basename(__FILE__) == basename($_SERVER["SCRIPT_FILENAME"])) {
    exit; // This file must be included, not called directly
}

/*	mydomain_mypluginname.js
Copyright (C) 2020 Peter Lembke , Charzam soft
the program is distributed under the terms of the GNU General Public License

mydomain_mypluginname is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

mydomain_mypluginname is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with mydomain_mypluginname.	If not, see <https://www.gnu.org/licenses/>.
*/
class mydemo_myplugin extends infohub_base
{
    protected final function _Version(): array
    {
        return array(
            'date' => '2020-07-31',
            'since' => '2020-07-31',
            'version' => '1.0.0',
            'class_name' => 'mydemo_myplugin',
            'checksum' => '{{checksum}}',
            'note' => 'This is my first plugin',
            'status' => 'emerging',
            'SPDX-License-Identifier' => 'GPL-3.0-or-later',
            'user_role' => 'developer'
        );
    }

    protected function _GetCmdFunctions(): array
    {
        $list = array(
            'my_function' => 'emerging'
        );

        return parent::_GetCmdFunctionsBase($list);
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
    final protected function my_function(array $in = array()): array
    {
        $default = array(
            'some_data' => 'World'
        );
        $in = $this->_Default($default, $in);

        $response = $this->internal_Cmd([
            'func' => 'MyFunction',
            'some_data' => 'Hello ' . $in['some_data'],
            'say' => 'I say'
        ]);

        $data = $response['data'];

        return array(
            'answer' => 'true',
            'message' => 'Got the data',
            'data' => $data
        );
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
    final protected function internal_MyFunction(array $in = array()): array
    {
        $default = array(
            'some_data' => 'Hello',
            'say' => ''
        );
        $in = $this->_Default($default, $in);

        $data = $in['say'] . ': ' . $in['some_data'] . '!';

        return array(
            'answer' => 'true',
            'message' => 'Here are the data',
            'data' => $data
        );
    }
}

