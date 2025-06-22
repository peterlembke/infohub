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
 * @version     2025-06-13
 * @since       2015-11-15
 * @copyright   Copyright (c) 2015, Peter Lembke
 * @license     https://opensource.org/licenses/gpl-license.php GPL-3.0-or-later
 * @see         https://github.com/peterlembke/infohub/blob/master/folder/doc/core/root/definefolders/core_root_definefolders.md Documentation
 * @link        https://infohub.se/ InfoHub main page
 */
const DS = DIRECTORY_SEPARATOR;

$currentWorkingDirectory = getcwd();
define('WORKING_DIRECTORY', $currentWorkingDirectory);

const PUBLIC_HTML = WORKING_DIRECTORY; // Public files that are available for the web server
setRights(path: PUBLIC_HTML);

$rootDirectory = str_replace('/public_html', '', $currentWorkingDirectory);

$isFolderInfoHubExisting = is_dir($rootDirectory . DS . 'infohub') === true;
if ($isFolderInfoHubExisting === true) {
    $rootDirectory = $rootDirectory . DS . 'infohub';
}

define('ROOT', $rootDirectory);
const MAIN = ROOT.DS.'folder';
setRights(path: MAIN);

const INCLUDES = MAIN . DS . 'include'; // Files required by infohub.php or index.php
setRights(path: INCLUDES);

const PLUGINS = MAIN . DS . 'plugins'; // All plugins are here
setRights(path: PLUGINS);

const LOG = ROOT . DS . 'log'; // PHP logs and plugin logging
setRights(path: LOG);

const DB = MAIN . DS . 'db'; // SQLite database files are stored here
setRights(path: DB);

const DOC = MAIN . DS . 'doc'; // All Infohub documentation
setRights(path: DOC);

const CONFIG = MAIN . DS . 'config'; // Config file that override the one in the plugin folder
setRights(path: CONFIG);

const FILE = MAIN . DS . 'file'; // Files for import/export. Used in the future for backup/restore of data
setRights(path: FILE);

function setRights(string $path): void {
    if (is_dir($path) === false) {
        @mkdir($path, 0777, true);
    }
    if (is_writable($path) === false) {
        @chmod($path, 0777);
    }
}