<?PHP
if (file_exists('fullstop.flag') == true) {
    exit('The site have gone into a full stop.');
}

define('DS', DIRECTORY_SEPARATOR);

$currentWorkingDirectory = getcwd();
$lastPosition = strrpos($currentWorkingDirectory, DS);
// remove public_html to get the root directory
$rootDirectory = substr($currentWorkingDirectory, $start = 0, $length = $lastPosition);

define('ROOT', $rootDirectory);
define('MAIN', ROOT . DS . 'folder');

$folders = array(
    'INCLUDES' => MAIN . DS . 'include', // Files required by infohub.php or index.php
    'PLUGINS' => MAIN . DS . 'plugins', // All plugins are here
    'LOG' => ROOT . DS . 'log', // PHP logs and plugin logging
    'DB' => MAIN . DS . 'db', // SQLite databases are stored here
    'DOC' => MAIN . DS . 'doc', // All Infohub documentation
    'CONFIG' => MAIN . DS . 'config', // Config file that override the one in the plugin folder
    'FILE' => MAIN . DS . 'file' // Files for import/export. Used in the future for backup/restore of data
);

foreach ($folders as $name => $path) {
    define($name, $path);
    if (is_dir($path) === false) {
        @mkdir($path,0777,true);
    }
    if (is_writable($path) === false) {
        @chmod($path, 0777);
    }
}
