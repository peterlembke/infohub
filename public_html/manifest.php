<?php
declare(strict_types=1);
include_once 'define_folders.php';
include_once INCLUDES . DS .'application_data.php';

$appData = new application_data(
    mainPath: MAIN,
    pluginPath: PLUGINS,
    configPath:CONFIG
);

$manifestData = [
    'short_name' => $appData->getTitle(),
    'name' => $appData->getTitle(),
    'description' => $appData->getDescription(),
    'categories' => $appData->getKeyWordsAsArray(),
    'icons' => [
        [
            'src' => $appData->getIconData('png'),
            'type' => 'image/png',
            'sizes' => '192x192'
        ]
    ],
    'start_url' => '/',
    'background_color' => '#FFFFFF',
    'display' => 'fullscreen',
    'scope' => '/',
    'theme_color' => '#FFFFFF'
];

header('Content-Type: application/json');
echo json_encode($manifestData);