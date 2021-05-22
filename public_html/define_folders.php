<?PHP
/**
 * Folders created here
 *
 * @package     Infohub
 * @subpackage  root
 */

declare(strict_types=1);
if (file_exists('fullstop.flag') == true) {
    exit('The site have gone into a full stop.');
}

/**
 * Folders created here
 *
 * @author      Peter Lembke <info@infohub.se>
 * @version     2020-11-21
 * @since       2015-11-15
 * @copyright   Copyright (c) 2015, Peter Lembke
 * @license     https://opensource.org/licenses/gpl-license.php GPL-3.0-or-later
 * @see         https://github.com/peterlembke/infohub/blob/master/folder/doc/core/root/definefolders/core_root_definefolders.md Documentation
 * @link        https://infohub.se/ InfoHub main page
 */
define('DS', DIRECTORY_SEPARATOR);

$currentWorkingDirectory = getcwd();
$lastPosition = strrpos($currentWorkingDirectory, DS);
// remove public_html to get the root directory
$rootDirectory = substr($currentWorkingDirectory, $start = 0, $length = $lastPosition);

define('ROOT', $rootDirectory);
define('MAIN', ROOT . DS . 'folder');

$folders = [
    'INCLUDES' => MAIN . DS . 'include', // Files required by infohub.php or index.php
    'PLUGINS' => MAIN . DS . 'plugins', // All plugins are here
    'LOG' => ROOT . DS . 'log', // PHP logs and plugin logging
    'DB' => MAIN . DS . 'db', // SQLite databases are stored here
    'DOC' => MAIN . DS . 'doc', // All Infohub documentation
    'CONFIG' => MAIN . DS . 'config', // Config file that override the one in the plugin folder
    'FILE' => MAIN . DS . 'file' // Files for import/export. Used in the future for backup/restore of data
];

foreach ($folders as $name => $path) {
    define($name, $path);
    if (is_dir($path) === false) {
        @mkdir($path, 0777, true);
    }
    if (is_writable($path) === false) {
        @chmod($path, 0777);
    }
}
