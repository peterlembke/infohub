<?php
/**
 * callback.php take care of all other urls that do not go to index.php or infohub.php
 * You can add parameters like this /node/plugin/function/param1/value1/param2/value2
 * You can add ordinary parameters like ?param3=3&param4=4
 * And you can add POST-data.
 * The file .htaccess reference this file.
 * @category InfoHub
 * @package Infohub
 * @copyright Copyright (c) 2010-, Peter Lembke, CharZam soft
 * @author Peter Lembke <peter.lembke@infohub.se>
 * @link https://infohub.se/ InfoHub main page
 * @license InfoHub is distributed under the terms of the GNU General Public License
 * InfoHub is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * InfoHub is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 * You should have received a copy of the GNU General Public License
 * along with InfoHub.    If not, see <https://www.gnu.org/licenses/>.
 */
if (basename(__FILE__) !== basename($_SERVER["SCRIPT_FILENAME"])) {
    exit('This file must be executed, not included.');
}

if (isset($_SERVER["REDIRECT_URL"]) === false) {
    exit('You can not call callback.php directly, always use any other url');
}

include_once 'define_folders.php';
include_once INCLUDES . DS . 'settings_and_errors.php';

spl_autoload_register(function ($class) {
    $file = PLUGINS . DS . str_replace('_', DS, $class) . DS . $class . '.php';
    if (file_exists($file)) {
        include $file;
    }
});

$callback = new infohub_callback();
$response = $callback->main(array());

$data = $response['data'];
if (is_array($data)) {
    $data = json_encode($data, JSON_PRETTY_PRINT & JSON_PRESERVE_ZERO_FRACTION);
}
echo $data;
