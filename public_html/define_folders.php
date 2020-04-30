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
    'INCLUDES' => MAIN . DS . 'include',
    'PLUGINS' => MAIN . DS . 'plugins',
    'LOG' => MAIN . DS . 'log',
    'DB' => MAIN . DS . 'db',
    'DOC' => MAIN . DS . 'doc',
    'CONFIG' => MAIN . DS . 'config'
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
