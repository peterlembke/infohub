<?PHP
if (file_exists('fullstop.flag') == true) {
    exit('The site have gone into a full stop.');
}

define('DS', DIRECTORY_SEPARATOR);

$currentWorkingDirectory = getcwd();
$lastPosition = strrpos($currentWorkingDirectory, DS);
$currentWorkingDirectory = substr($currentWorkingDirectory, $start=0, $length=$lastPosition) . DS .'folder';
define('MAIN', $currentWorkingDirectory);

$folders = array(
    'INCLUDES' => MAIN . DS . 'include',
    'PLUGINS' => MAIN . DS . 'plugins',
    'LOG' => MAIN . DS . 'log',
    'DB' => MAIN . DS . 'db',
    'TEST' => MAIN . DS . 'test',
    'DOC' => MAIN . DS . 'doc',
    'SESSION' => MAIN . DS . 'session',
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
