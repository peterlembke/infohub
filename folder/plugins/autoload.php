<?php

// This file is not used. The loading of classes are handled by infohub_plugin

include_once 'define_folders.php';
include_once INCLUDES . DS . 'settings_and_errors.php';
spl_autoload_register(function ($class) {
    $fileName = PLUGINS . DS . implode(DS, explode('_', $class)) . DS . $class . '.php';
    if (file_exists($fileName) === true) {
        include $fileName;
    }
});