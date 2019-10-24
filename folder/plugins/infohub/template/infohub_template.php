<?php
declare(strict_types=1);
if (basename(__FILE__) == basename($_SERVER["SCRIPT_FILENAME"])) {
    exit; // This file must be included, not called directly
}

/*	mydomain_mypluginname.js

		Copyright (C) 2015 __your name__ , __your organisation__
		the program is distributed under the terms of the GNU General Public License

		__your program name__ is free software: you can redistribute it and/or modify
		it under the terms of the GNU General Public License as published by
		the Free Software Foundation, either version 3 of the License, or
		(at your option) any later version.

		__your program name__ is distributed in the hope that it will be useful,
		but WITHOUT ANY WARRANTY; without even the implied warranty of
		MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
		GNU General Public License for more details.

		You should have received a copy of the GNU General Public License
		along with __your program name__.	If not, see <https://www.gnu.org/licenses/>.
*/
class infohub_template extends infohub_base
{
    // Change name of the class: infohub_template to whatever you want, and remove this comment

    protected final function _Version(): array
    {
        return array(
            'date' => '2016-04-16',
            'version' => '1.0.0',
            'class_name' => 'infohub_template',
            'checksum' => '{{checksum}}',
            'note' => 'Oneliner with the plugin purpose',
            'status' => 'emerging',
            'license_name' => 'GNU GPL 3 or later'
        );
    }

    protected function _GetCmdFunctions(): array
    {
        return array(
            'my_function' => 'emerging'
        );
    }

    // ***********************************************************
    // * your class functions below, only use protected functions
    // ***********************************************************

    /**
     * Example of class public function, always lower_case_names
     * Second row, more detailed description
     * @version 2016-04-16
     * @since   2012-01-01
     * @author  Your name
     * @param array $in
     * @return array
     */
    final protected function my_function(array $in = array()): array
    {
        $default = array();
        $in = $this->_Default($default, $in);

        return array(
            'answer' => 'true',
            'message' => '',
            'data' => ''
        );
    }

    /**
     * Example of class internal function, always internal_CamelCase names
     * Second row, more detailed description
     * @version 2016-04-16
     * @since   2012-01-01
     * @author  Your name
     * @param array $in
     * @return array
     */
    final protected function internal_MyFunction(array $in = array()): array
    {
        $default = array();
        $in = $this->_Default($default, $in);

        return array(
            'answer' => 'true',
            'message' => '',
            'data' => ''
        );
    }

}

