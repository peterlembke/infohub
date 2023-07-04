<?php
/**
 * Get the right icon data to be used in index.php and in manifest.php
 *
 * @package     Infohub
 * @subpackage  icon
 */

declare(strict_types=1);

include_once 'define_folders.php';
include_once PLUGINS . DS . 'infohub' . DS . 'base' . DS . 'infohub_base.php';

/**
 * Get the right icon data to be used in index.php and in manifest.php
 *
 * @author      Peter Lembke <info@infohub.se>
 * @version     2021-04-30
 * @since       2021-04-30
 * @copyright   Copyright (c) 2021, Peter Lembke
 * @license     https://opensource.org/licenses/gpl-license.php GPL-3.0-or-later
 * @link        https://infohub.se/ InfoHub main page
 */
class application_data extends infohub_base
{
    /** @var string  */
    protected string $mainPath = '';

    /** @var string  */
    protected string $pluginPath = '';

    /** @var string  */
    protected string $configPath = '';

    /** @var string  */
    protected string $title = '';

    /** @var string  */
    protected string $description = '';

    /** @var string  */
    protected string $keyWords = '';

    /**
     * Constructor
     * @param  string  $mainPath
     * @param  string  $pluginPath
     * @param  string  $configPath
     */
    public function __construct(
        string $mainPath = '',
        string $pluginPath = '',
        string $configPath = ''
    ) {
        $this->mainPath = $mainPath;
        $this->pluginPath = $pluginPath;
        $this->configPath = $configPath;
    }

    /**
     * Get the icon data as BASE64 encoded string with the data:image type
     *
     * @param string $iconType
     * @return string
     */
    public function getIconData(
        string $iconType = 'svg'
    ): string
    {
        $path = $this->getPath($iconType);
        $dataType = "data:image/$iconType;base64,";
        $fileContents = $this->_GetFileContent($path);

        $base64EncodedData = base64_encode($fileContents);

        $iconData = $dataType . $base64EncodedData;

        return $iconData;
    }

    /**
     * Return the application title we will use in index.php and in manifest.php
     * @return string
     */
    public function getTitle(): string {
        if ($this->title === '') {
            $this->getTitleAndDescription();
        }
        return $this->title;
    }

    /**
     * Return the application description we will use in index.php and in manifest.php
     * @return string
     */
    public function getDescription(): string {
        if ($this->description === '') {
            $this->getTitleAndDescription();
        }
        return $this->description;
    }

    /**
     * Return the application description we will use in index.php and in manifest.php
     * @return string
     */
    public function getKeyWords(): string {
        if ($this->keyWords === '') {
            $this->getTitleAndDescription();
        }
        return $this->keyWords;
    }

    /**
     * Return the application description we will use in index.php and in manifest.php
     *
     * @return array
     */
    public function getKeyWordsAsArray(): array {
        if ($this->keyWords === '') {
            $this->getTitleAndDescription();
        }
        $keyWordsArray = explode(',', $this->keyWords);

        return $keyWordsArray;
    }

    /**
     * Get the title, description and keywords
     * @return array
     */
    protected function getTitleAndDescription(): array
    {
        $default = [
            'title' => 'Infohub',
            'description' => 'Run InfoHub on your server or your friends server so you can store your private data and keep them away from every one else. Away from social networks and away from sharing.',
            'keywords' => 'lifestyle", "personalization", "security'
        ];
        $this->title = $default['title'];
        $this->description = $default['description'];
        $this->keyWords = $default['keywords'];

        $pluginName = $this->getPluginNameFromUrl();
        if ($pluginName === '') {
            $pluginName = $this->getPluginNameFromConfig();
            if ($pluginName === '') {
                return $default;
            }
        }

        $launcherPath = $this->getLauncherPath($pluginName);
        if ($launcherPath === '') {
            return $default;
        }

        $contentString = $this->_GetFileContent($launcherPath);

        $launcherArray = $this->_JsonDecode($contentString);
        if (empty($launcherArray) === true) {
            return $default;
        }

        $this->title = $launcherArray['title'];
        $this->description = $launcherArray['description'];
        $this->keyWords = $launcherArray['keywords'];

        return [
            'title' => $launcherArray['title'],
            'description' => $launcherArray['description'],
            'keywords' => $launcherArray['keywords']
        ];
    }

    /**
     * Get full path to the existing icon file
     * @param string $iconType
     * @return string
     */
    protected function getPath(
        string $iconType = 'svg'
    ): string
    {
        $fileName = 'icon.' . $iconType;
        $defaultPath = $this->mainPath . DS . $fileName;

        $pluginName = $this->getPluginNameFromUrl();
        if ($pluginName === '') {
            return $defaultPath;
        }

        $path = $this->pluginPath . DS . strtr($pluginName, ['_' => DS]) . DS . 'asset' . DS . 'icon' . DS . $fileName;
        if (file_exists($path) === true) {
            return $path;
        }

        return $defaultPath;
    }

    /**
     * Get full path to the existing icon file
     * @param string $pluginName
     * @return string
     */
    protected function getLauncherPath(
        string $pluginName = ''
    ): string
    {
        $path = $this->pluginPath . DS . strtr($pluginName, ['_' => DS]) . DS . 'asset' . DS . 'launcher.json';
        if (file_exists($path) === true) {
            return $path;
        }

        return '';
    }

    /**
     * Pull out the get parameter plugin_name if it exists
     * @return string
     */
    public function getPluginNameFromUrl(): string
    {
        $pluginName = $_GET['plugin_name'] ?? '';

        return $pluginName;
    }

    /**
     * Pull out the plugin_name if it exists
     * @return string
     */
    public function getPluginNameFromConfig(): string
    {
        $pluginName = 'infohub_exchange';
        $fileNameConfig = $this->configPath . DS . $pluginName . '.json';
        $fileNamePlugin = $this->pluginPath . DS . strtr($pluginName, ['_' => DS]) . DS . $pluginName . '.json';

        $fileName = $fileNameConfig;
        if (file_exists($fileName) === false) {
            $fileName = $fileNamePlugin;
            if (file_exists($fileName) === false) {
                return '';
            }
        }

        $fileContents = $this->_GetFileContent($fileName);
        $configData = $this->_JsonDecode($fileContents);

        $domain = $_SERVER['HTTP_HOST'];
        if (isset($configData['client']['domain'][$domain]) === false) {
            return '';
        }

        $default = [
            'node' => '', // 'client',
            'plugin' => '', // 'infohub_standalone',
            'function' => '', //'startup',
            'data' => [
                'plugin_name' => '' // 'infohub_demo'
            ]
        ];

        $domainConfigData = $this->_Default($default, $configData['client']['domain'][$domain]);

        if ($domainConfigData['node'] !== 'client') {
            return '';
        }
        if ($domainConfigData['plugin'] !== 'infohub_standalone') {
            return '';
        }
        if ($domainConfigData['function'] !== 'startup') {
            return '';
        }
        if ($domainConfigData['data']['plugin_name'] === '') {
            return '';
        }

        $pluginName = $domainConfigData['data']['plugin_name'];

        return $pluginName;
    }

    /**
     * Read a file, return the data
     * If anything goes wrong you get an empty string back.
     *
     * @param  string  $path
     * @return string
     */
    protected function _GetFileContent(
        string $path = ''
    ): string {

        if (file_exists($path) === false) {
            return '';
        }
        
        $fileContents = file_get_contents($path);
        if ($fileContents === false) {
            return '';
        }

        return $fileContents;
    }
}

$appData = new application_data(
    mainPath: MAIN,
    pluginPath: PLUGINS,
    configPath:CONFIG
);
