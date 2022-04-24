<?php
/**
 * Handle files
 *
 * Used by plugins that want to read/write files. Custom usage have custom functions for specific plugins
 *
 * @package     Infohub
 * @subpackage  infohub_file
 */

declare(strict_types = 1);
if (basename(__FILE__) == basename($_SERVER["SCRIPT_FILENAME"])) {
    exit; // This file must be included, not called directly
}

/**
 * Handle files
 *
 * Used by plugins that want to read/write files. Custom usage have custom functions for specific plugins
 *
 * @author      Peter Lembke <info@infohub.se>
 * @version     2019-02-23
 * @since       2017-11-01
 * @copyright   Copyright (c) 2017, Peter Lembke
 * @license     https://opensource.org/licenses/gpl-license.php GPL-3.0-or-later
 * @see         https://github.com/peterlembke/infohub/blob/master/folder/plugins/infohub/checksum/infohub_checksum.md
 *     Documentation
 * @link        https://infohub.se/ InfoHub main page
 */
class infohub_file extends infohub_base
{

    /**
     * Version information for this plugin
     *
     * @return string[]
     * @since   2017-11-01
     * @author  Peter Lembke
     * @version 2019-02-23
     */
    protected function _Version(): array
    {
        return [
            'date' => '2019-02-23',
            'since' => '2017-11-01',
            'version' => '1.0.1',
            'class_name' => 'infohub_file',
            'checksum' => '{{checksum}}',
            'note' => 'Used by plugins that want to read/write files. Custom usage have custom functions for specific plugins.',
            'status' => 'normal',
            'SPDX-License-Identifier' => 'GPL-3.0-or-later',
            'user_role' => '' // User can not send messages to this plugin directly
        ];
    }

    /**
     * Public functions in this plugin
     *
     * @return array
     * @author  Peter Lembke
     * @version 2019-02-23
     * @since   2017-11-01
     */
    protected function _GetCmdFunctions(): array
    {
        $list = [
            'read' => 'normal',
            'write' => 'normal',
            'get_folder_structure' => 'normal',
            'index_checksum' => 'normal', // infohub_offline
            'launcher_get_full_list' => 'normal', // infohub_launcher
            'asset_get_all_assets_for_one_plugin' => 'normal', // infohub_asset
            'asset_get_assets_requested' => 'normal', // infohub_asset
            'plugin_get_all_plugin_names' => 'normal', // infohub_plugin
            'developer_get_all_plugin_data' => 'normal', // Used by developer plugins like Infohub_Trigger
            'get_all_level1_plugin_names' => 'normal', // infohub_translate
            'load_node_role_plugin_name_role_list' => 'normal', // infohub_contact
            'get_plugin_js_files_content' => 'normal', // infohub_translate
            'get_translation_files' => 'normal', // infohub_translate
        ];

        return parent::_GetCmdFunctionsBase($list);
    }

    // ***********************************************************
    // * your class functions below, only use protected functions
    // ***********************************************************

    /**
     * Read meta data and content from a file
     * You can limit the response data, Use data_request in your subcall.
     *
     * @param  array  $in
     * @return array
     * @author  Peter Lembke
     * @version 2020-08-01
     * @since   2017-11-05
     */
    protected function read(array $in = []): array
    {
        $default = [
            'path' => '',
            'from_plugin' => [
                'node' => '',
                'plugin' => '',
                'function' => ''
            ],
            'folder' => 'file' // plugin or file
        ];
        $in = $this->_Default($default, $in);

        if ($in['from_plugin']['node'] !== 'server') {
            return [
                'answer' => 'false',
                'message' => 'I only accept messages that origin from this server node'
            ];
        }

        if ($in['folder'] !== 'file' && $in['folder'] !== 'plugin') {
            return ['answer' => 'false', 'message' => 'Folder must be file or plugin'];
        }

        if (str_contains($in['path'], '..') === true) {
            return ['answer' => 'false', 'message' => 'Path can not use ..'];
        }

        if (str_contains($in['path'], '~')) {
            return ['answer' => 'false', 'message' => 'Path can not use ~'];
        }

        if ($in['folder'] === 'file') {
            $in['path'] = MAIN . DS . 'file' . DS . $in['from_plugin']['plugin'] . DS . $in['path'];
        }

        if ($in['folder'] === 'plugin') {
            $in['path'] = PLUGINS . DS . str_replace('_', DS, $in['from_plugin']['plugin']) . DS . $in['path'];
        }

        $in['func'] = 'Read';
        $response = $this->internal_Cmd($in);

        return $response;
    }

    /**
     * Read meta data and content from a file
     *
     * @param  array  $in
     * @return array
     * @author  Peter Lembke
     * @version 2020-08-15
     * @since   2017-11-05
     */
    protected function internal_Read(array $in = []): array
    {
        $default = [
            'path' => '',
        ];
        $in = $this->_Default($default, $in);

        $answer = 'false';
        $message = 'Nothing to report from ' . $this->_GetClassName() . ' -> ' . __FUNCTION__;
        $contents = '';
        $checksum = '';
        $isBinary = 'unknown';
        $userRole = '';
        $pluginStatus = '';

        $response = [
            'path' => '',
            'path_info' => [],
            'file_info' => [],
            'file_size' => 0
        ];

        $response = $this->_FileInformation($in);
        if ($response['answer'] === 'false') {
            $message = $response['message'];
            goto leave;
        }

        $contents = file_get_contents($response['path']);
        if ($contents === false) {
            $contents = '';
            $message = 'Could not read the file';
            goto leave;
        }

        $extension = $response['path_info']['extension'];

        $isBinary = $this->_IsBinaryFileExtension($extension);
        if ($isBinary === 'true') {
            $contents = base64_encode($contents);
        }

        $node = $this->_GetNodeFromExtension($extension);
        $userRole = $this->_GetUserRole($node, $contents);
        $pluginStatus = $this->_GetPluginStatus($node, $contents);
        $checksum = $this->_Hash($contents);

        $answer = 'true';
        $message = 'Here are the file contents';

        leave:
        return [
            'answer' => $answer,
            'message' => $message,
            'path' => $response['path'],
            'path_info' => $response['path_info'],
            'file_info' => $response['file_info'],
            'is_binary' => $isBinary,
            'contents' => $contents,
            'plugin_status' => $pluginStatus,
            'checksum' => $checksum,
            'file_size' => $response['file_size'],
            'user_role' => $userRole,
        ];
    }

    /**
     * Write data to a file
     *
     * @param  array  $in
     * @return array
     * @author  Peter Lembke
     * @version 2021-12-23
     * @since   2017-11-05
     */
    protected function write(array $in = []): array
    {
        $default = [
            'path' => '',
            'contents' => '',
            'allow_overwrite' => 'false',
            'from_plugin' => [
                'node' => '',
                'plugin' => '',
                'function' => ''
            ]
        ];
        $in = $this->_Default($default, $in);

        if (str_contains($in['path'], '..') === true) {
            return ['answer' => 'false', 'message' => 'Path can not use ..'];
        }

        if (str_contains($in['path'], '~') === true) {
            return ['answer' => 'false', 'message' => 'Path can not use ~'];
        }

        if ($in['from_plugin']['node'] !== 'server') {
            return [
                'answer' => 'false',
                'message' => 'I only accept messages that origin from this server node'
            ];
        }

        $in['func'] = 'Write';
        $in['path'] = MAIN . DS . 'file' . DS . $in['from_plugin']['plugin'] . DS . $in['path'];

        $response = $this->internal_Cmd($in);
        return $response;
    }

    /**
     * Write data to a file
     *
     * @param  array  $in
     * @return array
     * @author  Peter Lembke
     * @version 2017-12-07
     * @since   2017-11-05
     */
    protected function internal_Write(array $in = []): array
    {
        $default = [
            'path' => '',
            'contents' => '',
            'allow_overwrite' => 'false',
        ];
        $in = $this->_Default($default, $in);

        $answer = 'false';
        $message = 'Nothing to report from ' . $this->_GetClassName() . ' -> ' . __FUNCTION__;
        $checksum = '';
        $createdPath = 'false';
        $response = [
            'path' => '',
            'path_info' => [],
            'file_info' => [],
            'file_size' => 0
        ];
        $contentsLength = strlen($in['contents']);

        $response = $this->_FileInformation($in);
        /*
        if ($response['answer'] === 'false') {
            $message = $response['message'];
            goto leave;
        }
        */

        $pathPartArray = pathinfo($in['path']);

        $extension = $pathPartArray['extension'] ?? '';

        if ($this->_IsBinaryFileExtensionWrite($extension) === 'true') {
            $result = base64_decode($in['contents']);
            $in['contents'] = $result;
        }

        $checksum = $this->_Hash($in['contents']);

        if ($response['file_info']['folder_exist'] === 'false') {
            $result = mkdir($pathPartArray['dirname'], $mode = 0777, $recursive = true);
            if ($result === false) {
                $message = 'Folder do not exist and I can not create it';
                goto leave;
            }
            $createdPath = 'true';
        }

        if ($response['file_info']['file_exist'] === 'true') {
            if ($in['allow_overwrite'] === 'false') {
                $message = 'File exist. You said I am not allowed to overwrite';
                goto leave;
            }
            unlink($in['path']); // Delete the file
        }

        $result = file_put_contents($in['path'], $in['contents']);
        if ($result === false) {
            $message = 'Could not write to file';
            goto leave;
        }
        $response['file_size'] = $result;

        $answer = 'true';
        $message = 'File is written';

        leave:
        return [
            'answer' => $answer,
            'message' => $message,
            'path' => $response['path'],
            'created_path' => $createdPath,
            'path_info' => $response['path_info'],
            'file_info' => $response['file_info'],
            'checksum' => $checksum,
            'file_size' => $response['file_size']
        ];
    }

    /**
     * Determine if an extension indicate a binary file ("true"), or a text file ("false")
     *
     * @param  string  $extension
     * @return string "true" or "false"
     * @author  Peter Lembke
     * @version 2018-05-12
     * @since   2018-05-12
     */
    protected function _IsBinaryFileExtension(string $extension = ''): string
    {
        // OBSERVE: Do NOT add PHP and JS files to this list even if they are text files
        $validNonBinaryExtensions = ['txt', 'csv', 'xml', 'json', 'svg', 'md'];
        $isBinaryFileExtension = 'true';
        if (in_array($extension, $validNonBinaryExtensions) === true) {
            $isBinaryFileExtension = 'false';
        }
        return $isBinaryFileExtension;
    }

    /**
     * Determine if an extension indicate a binary file ("true"), or a text file ("false")
     *
     * @param  string  $extension
     * @return string "true" or "false"
     * @author  Peter Lembke
     * @version 2018-05-12
     * @since   2018-05-12
     */
    protected function _IsBinaryFileExtensionWrite(string $extension = ''): string
    {
        $validNonBinaryExtensions = ['txt', 'csv', 'xml', 'json', 'svg', 'md', 'js', 'php'];
        $isBinaryFileExtension = 'true';
        if (in_array($extension, $validNonBinaryExtensions) === true) {
            $isBinaryFileExtension = 'false';
        }
        return $isBinaryFileExtension;
    }

    /**
     * Get an array with all file paths and file names that match the pattern, also recursively.
     *
     * @param  array  $in
     * @return array
     * @author  Peter Lembke
     * @version 2017-12-10
     * @since   2017-12-10
     */
    protected function get_folder_structure(array $in = []): array
    {
        $default = [
            'path' => '',
            'from_plugin' => [
                'node' => '',
                'plugin' => '',
                'function' => ''
            ]
        ];
        $in = $this->_Default($default, $in);

        if ($in['from_plugin']['node'] !== 'server') {
            return [
                'answer' => 'false',
                'message' => 'I only accept messages that origin from this server node'
            ];
        }

        $in['func'] = 'GetFolderStructure';
        $in['path'] = MAIN . DS . 'file' . DS . $in['from_plugin']['plugin'] . DS . $in['path'];

        return $this->internal_Cmd($in);
    }

    /**
     * Calculate the checksum the same way as in index.php
     *
     * @param  array  $in
     * @return array
     * @author  Peter Lembke
     * @version 2019-11-13
     * @since   2019-11-13
     */
    protected function index_checksum(array $in = []): array
    {
        $default = [
            'from_plugin' => ['node' => '', 'plugin' => '', 'function' => '']
        ];
        $in = $this->_Default($default, $in);

        if ($in['from_plugin']['node'] !== 'server') {
            return [
                'answer' => 'false',
                'message' => 'I only accept messages that origin from this server node',
                'checksum' => ''
            ];
        }

        $globalCss = $this->_GetFileContentBase64Data(INCLUDES . '/infohub_global.css');
        $faviconPng = $this->_GetFileContentBase64Data(MAIN . '/favicon.png');
        $infohubPng = $this->_GetFileContentBase64Data(MAIN . '/infohub.png');
        $infohubSvg = $this->_GetFileContent(PLUGINS . '/infohub/welcome/asset/icon/infohub-logo-done.svg');

        $checksum = md5($globalCss) . md5($faviconPng) . md5($infohubPng) . md5($infohubSvg);

        $files = [
            'progress.js',
            'error_handler_and_frame_breakout.js',
            'the_go_function.js',
            'sanity_check.js',
            'start.js',
            'install_service_worker.js'
        ];

        foreach ($files as $fileName) {
            $fileContents = $this->_GetFileContent(INCLUDES . DS . $fileName);
            $checksum = $checksum . md5($fileContents);
        }

        return [
            'answer' => 'true',
            'message' => 'Here are the checksum',
            'checksum' => md5($checksum)
        ];
    }

    /**
     * Read a file, convert the contents to base64 data and return it
     * If anything goes wrong you get an empty string back.
     *
     * @param  string  $path
     * @return string
     */
    protected function _GetFileContentBase64Data(
        string $path = ''
    ): string {
        $fileContents = $this->_GetFileContent($path);
        $base64Data = base64_encode($fileContents);

        return $base64Data;
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
        $fileContents = file_get_contents($path);
        if ($fileContents === false) {
            return '';
        }

        return $fileContents;
    }

    /**
     * Get an array with all file paths and file names that match the pattern, also recursively.
     *
     * @param  array  $in
     * @return array
     * @author  Peter Lembke
     * @version 2017-12-07
     * @since   2017-11-05
     */
    protected function internal_GetFolderStructure(array $in = []): array
    {
        $default = [
            'path' => '',
            'pattern' => '',
        ];
        $in = $this->_Default($default, $in);

        $answer = 'false';
        $message = 'Nothing to report from ' . $this->_GetClassName() . ' -> ' . __FUNCTION__;
        $data = [];
        $pattern = '';
        $fullPath = '';

        $path = $this->_CleanString($in['path'], $type = 'path');
        if ($in['path'] !== $path) {
            $message = 'The path have illegal characters';
            goto leave;
        }

        if ($this->_CheckPath($path) === 'false') {
            $message = 'Path is not valid';
            goto leave;
        }

        $pattern = $this->_CleanString($in['pattern'], 'pattern');
        if ($in['pattern'] !== $pattern) {
            $message = 'The pattern have illegal characters';
            goto leave;
        }

        $fullPath = $path . '/' . $pattern;

        $data = $this->_RecursiveSearch($fullPath);

        if ($this->_Empty($data) === 'true') {
            $message = 'It is not probable that I found nothing in the file system. This is probably a hidden error';
            goto leave;
        }

        $answer = 'true';
        $message = 'Here are the data';

        leave:
        return [
            'answer' => $answer,
            'message' => $message,
            'original_path' => $in['path'],
            'path' => $path,
            'original_pattern' => $in['pattern'],
            'pattern' => $pattern,
            'full_path' => $fullPath,
            'data' => $data
        ];
    }

    /**
     * Get information about a file
     *
     * @param  array  $in
     * @return array
     * @author  Peter Lembke
     * @version 2017-11-05
     * @since   2017-11-05
     */
    protected function _FileInformation(array $in = []): array
    {
        $default = [
            'path' => '',
            'from_plugin' => ['node' => '', 'plugin' => '']
        ];
        $in = $this->_Default($default, $in);

        $answer = 'false';
        $message = 'Nothing to report from ' . $this->_GetClassName() . ' -> ' . __FUNCTION__;
        $fileSize = 0;

        $pathInfoDefault = [
            'dirname' => '',
            'basename' => '',
            'filename' => '',
            'extension' => ''
        ];
        $pathInfo = $pathInfoDefault;

        $fileInfoDefault = [
            'folder_exist' => '',
            'is_dir' => '',
            'is_file' => '',
            'is_link' => '',
            'file_exist' => '',
            'is_readable' => ''
        ];
        $fileInfo = $fileInfoDefault;

        $in['path'] = $this->_CleanString($in['path'], $type = 'path');
        if ($this->_CheckPath($in['path']) === 'false') {
            $message = 'The path is not valid. Clean it up. Check the manual.';
            goto leave;
        }

        $pathInfo = pathinfo($in['path']);

        $fileInfo = [
            'folder_exist' => is_dir($pathInfo['dirname']) ? 'true' : 'false',
            'is_dir' => is_dir($in['path']) ? 'true' : 'false',
            'is_file' => is_file($in['path']) ? 'true' : 'false',
            'is_link' => is_link($in['path']) ? 'true' : 'false',
            'file_exist' => file_exists($in['path']) ? 'true' : 'false',
            'is_readable' => is_readable($in['path']) ? 'true' : 'false'
        ];

        if ($fileInfo['folder_exist'] === 'false') {
            $message = 'Folder do not exist';
            goto leave;
        }

        if ($fileInfo['is_dir'] === 'true') {
            $message = 'The path goes to a folder. I only read files';
            goto leave;
        }

        if ($fileInfo['is_file'] === 'false') {
            $message = 'The path does not go to a real file. I only read files';
            goto leave;
        }

        if ($fileInfo['is_link'] === 'true') {
            $message = 'The path goes to a link. I only read files';
            goto leave;
        }

        if ($fileInfo['file_exist'] === 'false') {
            $message = 'File do not exist';
            goto leave;
        }

        if ($fileInfo['is_readable'] === 'false') {
            $message = 'Folder or file is not readable. I do not have rights';
            goto leave;
        }

        $fileSize = filesize($in['path']);

        if ($fileSize === false) {
            $fileSize = 0;
            $message = 'Can not get the file size';
            goto leave;
        }

        $answer = 'true';
        $message = 'Here are the file information';

        leave:

        $pathInfo = $this->_Default($pathInfoDefault, $pathInfo);
        $fileInfo = $this->_Default($fileInfoDefault, $fileInfo);

        return [
            'answer' => $answer,
            'message' => $message,
            'path' => $in['path'],
            'path_info' => $pathInfo,
            'file_info' => $fileInfo,
            'file_size' => $fileSize
        ];
    }

    /**
     * Check the path that it is correct
     *
     * @param  string  $path
     * @return string
     * @author  Peter Lembke
     * @version 2017-11-05
     * @since   2017-11-05
     */
    protected function _CheckPath(string $path = ''): string
    {
        if (str_starts_with($path, MAIN) === false) {
            return 'false'; // Path must be somewhere in "folder"
        }

        $parts = explode('/', $path);

        foreach ($parts as $nr => $data) {
            if ($data === '..') {
                return 'false';
            }
        }

        return 'true';
    }

    /**
     * Keep allowed characters in the string
     *
     * @param  string  $string
     * @param  string  $type
     * @return string
     * @version 2017-12-07
     * @since   2017-11-05
     * @author  Peter Lembke
     */
    protected function _CleanString(string $string = '', string $type = 'path'): string
    {
        $allowed = [
            'path' => 'abcdefghijklmnopqrstuvwxyz0123456789_-./',
            'pattern' => 'abcdefghijklmnopqrstuvwxyz0123456789_-.*'
        ];
        if (isset($allowed[$type]) === false) {
            return '';
        }

        // Create lookup index with allowed characters as keys
        $allowedCharacters = array_flip(str_split($allowed[$type], $length = 1));

        $out = '';

        $string = strtolower(trim($string));
        $stringLength = strlen($string);

        for ($characterPosition = 0; $characterPosition < $stringLength; $characterPosition = $characterPosition + 1) {
            if (isset($allowedCharacters[$string[$characterPosition]]) === true) {
                $out = $out . $string[$characterPosition];
            }
        }

        $out = str_replace('..', '', $out);

        return $out;
    }

    /**
     * Give a data string, get a checksum value as a string
     *
     * @param  string  $dataString
     * @return string
     * @author  Peter Lembke
     * @version 2017-11-05
     * @since   2017-11-05
     */
    protected function _Hash(string $dataString = ''): string
    {
        return (string) md5($dataString);
    }

    /**
     * Give a search pattern. Get array with found files and paths.
     *
     * @param string $pattern | Example: $basePath . DS . '*.md';
     * @param int $flags
     * @return array
     * @see https://thephpeffect.com/recursive-glob-vs-recursive-directory-iterator/ Recursive
     * @version 2021-12-23
     * @since   2016-04-02
     * @author  Peter Lembke
     */
    protected function _RecursiveSearch(
        string $pattern = '',
        int $flags = 0
    ): array {

        $fileArray = glob($pattern, $flags);
        if ($fileArray === false) {
            $fileArray = [];
        }

        $directoryPattern = dirname($pattern) . '/*';
        $directoryArray = glob($directoryPattern, GLOB_ONLYDIR | GLOB_NOSORT);
        if ($directoryArray === false) {
            $directoryArray = [];
        }

        foreach ($directoryArray as $directoryName) {
            $subDirectoryPattern = $directoryName . '/' . basename($pattern);
            $subDirectoryFileArray = $this->_RecursiveSearch($subDirectoryPattern, $flags);
            $fileArray = array_merge($fileArray, $subDirectoryFileArray);
        }

        return $fileArray;
    }

    /**
     * I do not want a slash at the end of the path
     *
     * @param  string  $path
     * @return string
     */
    protected function _RemoveEndSlash(string $path = ''): string
    {
        if (str_ends_with($path, '/') === true) {
            $path = substr($path, 0, -1);
        }

        return $path;
    }

    /**
     * Get a list with plugin names that has a file called asset/launcher.json
     * The list key is plugin name, the data is the asset's launcher.json, icon/icon.svg, icon/icon.json
     * Used only by infohub_launcher
     *
     * @param  array  $in
     * @return array
     * @author  Peter Lembke
     * @version 2018-12-07
     * @since   2017-12-07
     */
    protected function launcher_get_full_list(array $in = []): array
    {
        $default = [
            'from_plugin' => ['node' => '', 'plugin' => '']
        ];
        $in = $this->_Default($default, $in);

        $answer = 'false';
        $message = 'Nothing to report from ' . $this->_GetClassName() . ' -> ' . __FUNCTION__;
        $data = [];

        if ($in['from_plugin']['node'] !== 'server') {
            $message = 'I only accept messages that origin from this server node';
            goto leave;
        }

        if ($in['from_plugin']['plugin'] !== 'infohub_launcher') {
            $message = 'I only accept messages that origin from plugin infohub_launcher';
            goto leave;
        }

        $response = $this->internal_Cmd([
            'func' => 'GetFolderStructure',
            'path' => PLUGINS,
            'pattern' => 'launcher.json',
        ]);

        if ($response['answer'] === 'false') {
            $message = $response['message'];
            goto leave;
        }

        $wantedAssets = ['launcher.json', 'icon/icon.json', 'icon/icon.svg'];

        foreach ($response['data'] as $path) {
            $pathInfo = pathinfo($path);
            $pathInfo['dirname'] = $this->_RemoveEndSlash($pathInfo['dirname']);

            $pathCopy = $pathInfo['dirname'];
            $pathAfterPlugins = substr($pathCopy, strlen(PLUGINS) + 1);
            $parts = explode('/', $pathAfterPlugins);

            if (count($parts) <> 3) {
                continue;
            }

            // We have 0: domain name (like "infohub"), 1: plugin name (like "doc") and 2: something more.
            if ($parts[2] !== 'asset') {
                continue;
            }

            $pluginName = $parts[0] . '_' . $parts[1];

            $avoid = [
                'infohub_workbench' => '',
                'infohub_launcher' => ''
            ];

            if (isset($avoid[$pluginName]) === true) {
                continue;
            }

            $dirName = $pathInfo['dirname'];

            foreach ($wantedAssets as $assetName) {
                $response = $this->internal_Cmd(
                    [
                        'func' => 'Read',
                        'path' => $dirName . DS . $assetName
                    ]
                );

                if ($response['answer'] === 'true') {
                    $data[$pluginName][$assetName] = $response['checksum'];
                }
            }
        }

        $answer = 'true';
        $message = 'Here are the list of plugin names that can be started in Workbench';

        leave:
        return [
            'answer' => $answer,
            'message' => $message,
            'data' => $data
        ];
    }

    /**
     * Get ALL assets for ONE plugin
     * Used by infohub_asset
     *
     * @param  array  $in
     * @return array
     * @author  Peter Lembke
     * @version 2020-05-23
     * @since   2017-12-23
     */
    protected function asset_get_all_assets_for_one_plugin(array $in = []): array
    {
        $default = [
            'plugin_name' => '',
            'from_plugin' => ['node' => '', 'plugin' => '']
        ];
        $in = $this->_Default($default, $in);

        $answer = 'false';
        $message = 'Nothing to report from ' . $this->_GetClassName() . ' -> ' . __FUNCTION__;
        $dataToDeliver = [];

        if ($in['from_plugin']['node'] !== 'server') {
            $message = 'I only accept messages that origin from this server node';
            goto leave;
        }

        if ($in['from_plugin']['plugin'] !== 'infohub_asset') {
            $message = 'I only accept messages that origin from plugin infohub_asset';
            goto leave;
        }

        $assetPath = PLUGINS . '/' . str_replace('_', '/', $in['plugin_name']) . '/asset';

        $response = $this->internal_Cmd(
            [
                'func' => 'GetFolderStructure',
                'path' => $assetPath,
                'pattern' => '*',
            ]
        );

        if ($response['answer'] === 'false') {
            $message = $response['message'];
            goto leave;
        }

        $data = [];
        $jsonIndex = [];

        foreach ($response['data'] as $path) {
            if (str_contains($path, '.') === false) {
                continue; // Path did not have a `.` in the name, meaning it is not a file and therefore not interesting.
            }

            $fileData = $this->internal_Cmd([
                'func' => 'Read',
                'path' => $path
            ]);

            $storedPath = $in['plugin_name'] . '/' . str_replace($assetPath . '/', '', $path);

            $lengthWithoutExtension = strlen($storedPath) - strlen($fileData['path_info']['extension']) - 1;
            $storedPathNoExtension = substr($storedPath, 0, $lengthWithoutExtension);

            $data[$storedPath] = [
                'plugin_name' => $in['plugin_name'],
                'asset_name' => $storedPath,
                'asset_name_no_extension' => $storedPathNoExtension,
                'extension' => $fileData['path_info']['extension'],
                'contents' => $fileData['contents'],
                'checksum' => $fileData['checksum'],
                'is_binary' => $fileData['is_binary'],
                'micro_time' => $this->_MicroTime(), // Now we know when this data was accurate. Seconds since EPOC
                'time_stamp' => $this->_TimeStamp(), // Now we know when this data was accurate. Human-readable
                'file_size' => $fileData['file_size']
            ];

            if ($fileData['path_info']['extension'] === 'json') {
                $jsonIndex[$storedPathNoExtension] = 1;
            }
        }

        foreach ($data as $assetPath => $assetData) {
            if (isset($jsonIndex[$assetData['asset_name_no_extension']]) === true) {
                // Only json files and assets with a json license file are accepted
                $dataToDeliver[$assetPath] = $assetData;
            }
        }

        $answer = 'true';
        $message = 'Here are the assets you requested';

        leave:
        return [
            'answer' => $answer,
            'message' => $message,
            'data' => $dataToDeliver
        ];
    }

    /**
     * You can request specific assets
     * Used by infohub_asset
     *
     * @param  array  $in
     * @return array
     * @author  Peter Lembke
     * @version 2020-05-23
     * @since   2018-11-14
     */
    protected function asset_get_assets_requested(array $in = []): array
    {
        $default = [
            'assets_requested' => [],
            'from_plugin' => ['node' => '', 'plugin' => '']
        ];
        $in = $this->_Default($default, $in);

        $answer = 'false';
        $message = 'Nothing to report from ' . $this->_GetClassName() . ' -> ' . __FUNCTION__;
        $data = [];

        if ($in['from_plugin']['node'] !== 'server') {
            $message = 'I only accept messages that origin from this server node';
            goto leave;
        }

        if ($in['from_plugin']['plugin'] !== 'infohub_asset') {
            $message = 'I only accept messages that origin from plugin infohub_asset';
            goto leave;
        }

        foreach ($in['assets_requested'] as $path => $dummy) {
            $prefix = 'infohub_asset/asset/';
            $path = substr($path, strlen($prefix));

            $pluginEnd = strpos($path, '/');
            if ($pluginEnd === false) {
                continue;
            }

            $pluginName = substr($path, 0, $pluginEnd);

            $remove = $pluginName . '/';
            $path = substr($path, strlen($remove));

            $assetName = $path;

            $assetPath = PLUGINS . DS . str_replace('_', DS, $pluginName) . DS . 'asset';

            $filePath = $assetPath . DS . $assetName;

            $fileData = $this->internal_Cmd([
                'func' => 'Read',
                'path' => $filePath
            ]);

            $storedPath = $prefix . $pluginName . '/' . $assetName;

            $data[$storedPath] = [
                'plugin_name' => $pluginName,
                'asset_name' => $assetName,
                'extension' => $fileData['path_info']['extension'],
                'contents' => $fileData['contents'],
                'checksum' => $fileData['checksum'],
                'is_binary' => $fileData['is_binary'],
                'micro_time' => $this->_MicroTime(), // Now we know when this data was accurate. Seconds since EPOC
                'time_stamp' => $this->_TimeStamp(), // Now we know when this data was accurate. Human-readable
                'file_size' => $fileData['file_size']
            ];
        }

        $answer = 'true';
        $message = 'Here are the assets you requested';

        leave:
        return [
            'answer' => $answer,
            'message' => $message,
            'data' => $data
        ];
    }

    /**
     * Get a list with all plugin names
     * Used by infohub_plugin
     *
     * @param  array  $in
     * @return array
     * @author  Peter Lembke
     * @version 2022-03-24
     * @since   2018-10-26
     */
    protected function plugin_get_all_plugin_names(array $in = []): array
    {
        $default = [
            'from_plugin' => ['node' => '', 'plugin' => ''],
            'type' => 'js', // js or php
            'levels' => 5 // How deep down we want plugin names
        ];
        $in = $this->_Default($default, $in);

        $answer = 'false';
        $message = 'Nothing to report from ' . $this->_GetClassName() . ' -> ' . __FUNCTION__;
        $data = [];

        if ($in['from_plugin']['node'] !== 'server') {
            $message = 'I only accept messages that origin from the server node';
            goto leave;
        }

        if ($in['from_plugin']['plugin'] !== 'infohub_plugin') {
            $message = 'I only accept messages that origin from plugin infohub_plugin';
            goto leave;
        }

        if ($in['type'] !== 'js' && $in['type'] !== 'php') {
            $message = 'The type must be js or php';
            goto leave;
        }

        $response = $this->internal_Cmd([
            'func' => 'GetFolderStructure',
            'path' => PLUGINS,
            'pattern' => '*.' . $in['type'],
        ]);

        if ($response['answer'] === 'false') {
            $message = $response['message'];
            goto leave;
        }

        foreach ($response['data'] as $path) {
            $pathInfo = pathinfo($path);
            $pluginName = $pathInfo['filename'];

            if (str_contains($pluginName, '_') === false) {
                continue; // Skip files without _ in the name
            }

            if (strtolower($pluginName) !== $pluginName) {
                continue; // Skip files that contain upper case letters
            }

            $avoid = [
                'infohub_test_plugin_js' => '',
            ];

            if (isset($avoid[$pluginName]) === true) {
                continue;
            }

            if ($in['levels'] < 5) {
                $parts = explode('_', $pluginName);
                $maxParts = $in['levels'] + 1;
                if (count($parts) > $maxParts) {
                    continue;
                }
            }

            $data[$pluginName] = '';
        }

        $answer = 'true';
        $message = 'Here are the list with all plugin names';

        leave:
        return [
            'answer' => $answer,
            'message' => $message,
            'type' => $in['type'],
            'data' => $data
        ];
    }

    /**
     * Get a list with all plugin names and each plugin details.
     * You get everything except the file contents.
     * Used in Infohub_Trigger to display a list with emerging plugins for a node.
     *
     * @param  array  $in
     * @return array
     * @author  Peter Lembke
     * @version 2020-08-15
     * @since   2020-08-15
     */
    protected function developer_get_all_plugin_data(array $in = []): array
    {
        $default = [
            'node' => 'all', // all, client, server
            'plugin_status' => 'all', // all, emerging, normal, deprecated, removed
            'user_role' => 'all', // all, user, developer, admin
            'level' => 'all', // all, 1, 2, 3
            'from_plugin' => ['node' => '', 'plugin' => ''],
            'config' => [
                'role_list_indexed' => []
            ]
        ];
        $in = $this->_Default($default, $in);

        $answer = 'false';
        $message = 'Nothing to report from ' . $this->_GetClassName() . ' -> ' . __FUNCTION__;
        $data = [
            'server' => [],
            'client' => []
        ];

        if ($in['from_plugin']['node'] !== 'server') {
            $message = 'I only accept messages that origin from the server node';
            goto leave;
        }

        if (isset($in['config']['role_list_indexed']['developer']) === false) {
            $message = 'I only allow developers to use this function because it strains the server';
            goto leave;
        }

        $extensions = ['js' => 'client', 'php' => 'server'];

        foreach ($extensions as $extension => $node) {
            if ($in['node'] !== 'all') {
                if ($in['node'] !== $node) {
                    continue;
                }
            }

            $response = $this->internal_Cmd([
                'func' => 'GetFolderStructure',
                'path' => PLUGINS,
                'pattern' => '*.' . $extension,
            ]);

            if ($response['answer'] === 'false') {
                $message = $response['message'];
                goto leave;
            }

            foreach ($response['data'] as $path) {
                $pathInfo = pathinfo($path);
                $pluginName = $pathInfo['filename'];

                if (str_contains($pluginName, '_') === false) {
                    continue; // Skip files without _ in the name
                }

                if (strtolower($pluginName) !== $pluginName) {
                    continue; // Skip files that contain upper case letters
                }

                $avoid = [
                    'infohub_test_plugin_js' => '',
                ];

                if (isset($avoid[$pluginName]) === true) {
                    continue;
                }

                if ($in['level'] !== 'all') {
                    $parts = explode($separator = '_', $pluginName);
                    if (count($parts) > (int) $in['level']) {
                        continue; // We skip this plugin since it is in a too deep level
                    }
                }

                $pluginInfo = $this->internal_Cmd([
                    'func' => 'Read',
                    'path' => $path
                ]);

                unset($pluginInfo['contents']);

                if ($in['plugin_status'] !== 'all') {
                    if ($in['plugin_status'] !== $pluginInfo['plugin_status']) {
                        continue; // Not the wanted status on this plugin. We skip it
                    }
                }

                if ($in['user_role'] !== 'all') {
                    if ($in['user_role'] !== $pluginInfo['user_role']) {
                        continue; // Not the wanted user_role on this plugin. We skip it
                    }
                }

                $data[$node][$pluginName] = $pluginInfo;
            }

            ksort($data[$node]); // Plugin names sorted
        }

        ksort($data); // Node names sorted

        $answer = 'true';
        $message = 'Here are the list with all plugin names and their info';

        leave:
        return [
            'answer' => $answer,
            'message' => $message,
            'data' => $data
        ];
    }

    /**
     * Get an array indexed on plugin name. Each item point to an empty array.
     * Used by Infohub_Contact among others
     *
     * @param  array  $in
     * @return array
     * @author  Peter Lembke
     * @version 2020-08-15
     * @since   2019-02-23
     */
    protected function get_all_level1_plugin_names(array $in = []): array
    {
        $default = [
            'from_plugin' => ['node' => '', 'plugin' => ''],
            'node' => 'server' // server or client
        ];
        $in = $this->_Default($default, $in);

        $answer = 'false';
        $message = 'Nothing to report from ' . $this->_GetClassName() . ' -> ' . __FUNCTION__;
        $data = [];

        if ($in['from_plugin']['node'] !== 'server') {
            $message = 'I only accept messages that origin from this server node';
            goto leave;
        }

        $suffix = '.php';
        if ($in['node'] === 'client') {
            $suffix = '.js';
        }
        $pattern = '*' . $suffix;

        $response = $this->internal_Cmd(
            [
                'func' => 'GetFolderStructure',
                'path' => PLUGINS,
                'pattern' => $pattern,
            ]
        );

        if ($response['answer'] === 'false') {
            $message = $response['message'];
            goto leave;
        }

        $suffixLength = strlen($suffix);

        foreach ($response['data'] as $path) {
            $pluginName = substr($path, strlen(PLUGINS) + 1);
            $parts = explode('/', $pluginName);
            $pluginName = end($parts);

            if (strtolower($pluginName) !== $pluginName) {
                continue; // Skip names that contain upper case letters
            }

            $parts = explode('_', $pluginName);
            if (count($parts) !== 2) {
                continue; // We only care about level 1 plugins
            }

            $pluginName = substr($pluginName, 0, -$suffixLength);
            $data[$pluginName] = [];
        }

        ksort($data);

        $answer = 'true';
        $message = 'Here are the list with all plugin names';

        leave:
        return [
            'answer' => $answer,
            'message' => $message,
            'data' => $data
        ];
    }

    /**
     * Get a list with all level 1 plugin names that has a role (user,developer,admin)
     * node array -> role name array -> plugin name array -> role name string
     * Used by infohub_exchange to know what rights a role has when reviewing messages in an incoming package
     *
     * @param  array  $in
     * @return array
     * @author  Peter Lembke
     * @version 2020-08-05
     * @since   2020-08-02
     */
    protected function load_node_role_plugin_name_role_list(array $in = []): array
    {
        $default = [
            'from_plugin' => ['node' => '', 'plugin' => '']
        ];
        $in = $this->_Default($default, $in);

        $answer = 'false';
        $message = 'Nothing to report from ' . $this->_GetClassName() . ' -> ' . __FUNCTION__;
        $nodeRolePluginNameRoleList = [];

        if ($in['from_plugin']['node'] !== 'server') {
            $message = 'I only accept messages that origin from this server node';
            goto leave;
        }

        $nodeArray = ['client', 'server'];
        foreach ($nodeArray as $node) {
            $nodeRolePluginNameRoleList[$node] = [];

            $suffix = '.php';
            if ($node === 'client') {
                $suffix = '.js';
            }

            $pattern = '*' . $suffix;

            $response = $this->internal_Cmd(
                [
                    'func' => 'GetFolderStructure',
                    'path' => PLUGINS,
                    'pattern' => $pattern,
                ]
            );

            if ($response['answer'] === 'false') {
                $message = $response['message'];
                goto leave;
            }

            $suffixLength = strlen($suffix);

            $pluginList = [];

            foreach ($response['data'] as $path) {
                $pluginName = substr($path, strlen(PLUGINS) + 1);
                $parts = explode('/', $pluginName);
                $pluginName = end($parts);

                if (strtolower($pluginName) !== $pluginName) {
                    continue; // Skip names that contain upper case letters
                }

                $parts = explode('_', $pluginName);
                if (count($parts) !== 2) {
                    continue; // We only care about level 1 plugins
                }

                $pluginName = substr($pluginName, 0, -$suffixLength);
                $pluginList[$pluginName] = $path;
            }

            foreach ($pluginList as $pluginName => $path) {
                $fileData = $this->internal_Cmd(
                    [
                        'func' => 'Read',
                        'path' => $path
                    ]
                );

                if (empty($fileData['contents']) === true) {
                    continue;
                }

                $role = $this->_GetUserRole($node, $fileData['contents']);
                if (empty($role) === true) {
                    continue;
                }

                if (isset($nodeRolePluginNameRoleList[$node][$role]) === false) {
                    $nodeRolePluginNameRoleList[$node][$role] = [];
                }

                $nodeRolePluginNameRoleList[$node][$role][$pluginName] = $role;
            }
        }

        $answer = 'true';
        $message = 'Here are the list with all user roles and their plugin names';

        leave:
        return [
            'answer' => $answer,
            'message' => $message,
            'data' => $nodeRolePluginNameRoleList
        ];
    }

    /**
     * Five a file extension and get a node name back
     *
     * @param  string  $extension
     * @return string
     */
    protected function _GetNodeFromExtension(string $extension = ''): string
    {
        if ($extension === 'js') {
            return 'client';
        }
        if ($extension === 'php') {
            return 'server';
        }

        return '';
    }

    /**
     * Pulls out the user_role from the source code
     *
     * @param  string  $node
     * @param  string  $contents
     * @return string
     */
    protected function _GetUserRole(string $node = '', string $contents = ''): string
    {
        $decodedContents = base64_decode($contents);

        $rolePattern = "'user_role' => '";
        if ($node === 'client') {
            $rolePattern = "'user_role': '";
        }

        $rolePatternLength = strlen($rolePattern);

        $findStart = strpos($decodedContents, $rolePattern);
        if ($findStart === false) {
            return '';
        }

        $findEnd = strpos($decodedContents, "'", $findStart + $rolePatternLength);
        if ($findEnd === false) {
            return '';
        }

        $roleLength = $findEnd - $findStart - $rolePatternLength;
        $role = substr($decodedContents, $findStart + $rolePatternLength, $roleLength);

        return $role;
    }

    /**
     * Pulls out the plugin status from the source code
     *
     * @param  string  $node
     * @param  string  $contents
     * @return string
     */
    protected function _GetPluginStatus(string $node = '', string $contents = ''): string
    {
        $decodedContents = base64_decode($contents);

        $pattern = "'status' => '";
        if ($node === 'client') {
            $pattern = "'status': '";
        }

        $patternLength = strlen($pattern);

        $findStart = strpos($decodedContents, $pattern);
        if ($findStart === false) {
            return '';
        }

        $findEnd = strpos($decodedContents, "'", $findStart + $patternLength);
        if ($findEnd === false) {
            return '';
        }

        $statusLength = $findEnd - $findStart - $patternLength;
        $status = substr($decodedContents, $findStart + $patternLength, $statusLength);

        return $status;
    }

    /**
     * Give a plugin name array, and you get the source code for all js files indexed on each plugin name.
     * Used ONLY by infohub_translate.php
     *
     * @param  array  $in
     * @return array
     * @author  Peter Lembke
     * @version 2019-03-24
     * @since   2019-03-24
     */
    protected function get_plugin_js_files_content(array $in = []): array
    {
        $default = [
            'plugin_name_array' => [],
            'from_plugin' => ['node' => '', 'plugin' => '']
        ];
        $in = $this->_Default($default, $in);

        $answer = 'false';
        $message = 'Nothing to report from ' . $this->_GetClassName() . ' -> ' . __FUNCTION__;
        $data = [];
        $launcher = [];

        if ($in['from_plugin']['node'] !== 'server') {
            $message = 'I only accept messages that origin from this server node';
            goto leave;
        }

        if ($in['from_plugin']['plugin'] !== 'infohub_translate') {
            $message = 'I only accept messages that origin from plugin infohub_translate';
            goto leave;
        }

        foreach ($in['plugin_name_array'] as $requestedPluginName) {

            $requestedPath = PLUGINS . DS . str_replace('_', DS, $requestedPluginName);

            $response = $this->internal_Cmd(
                [
                    'func' => 'GetFolderStructure',
                    'path' => $requestedPath,
                    'pattern' => '*.js',
                ]
            );

            if ($response['answer'] === 'false') {
                $message = $response['message'];
                goto leave;
            }

            foreach ($response['data'] as $path) {
                $pathInfo = pathinfo($path);
                $pluginName = $pathInfo['filename'];

                if (str_contains($pluginName, '_') === false) {
                    continue; // Skip js files without _ in the name
                }

                if (strtolower($pluginName) !== $pluginName) {
                    continue; // Skip names that contain upper case letters
                }

                $avoid = [
                    'infohub_test_plugin_js' => '',
                ];

                if (isset($avoid[$pluginName])) {
                    continue;
                }

                $data[$pluginName] = $this->_GetFileContent($path);

                if (str_contains($data[$pluginName], '_Translate(') === false) {
                    unset($data[$pluginName]); // This file does not contain anything to translate, skip it.
                }

                $pluginPath = str_replace('_', DS, $requestedPluginName);
                $requestedPath = PLUGINS . DS . $pluginPath . DS . 'asset' . DS . 'launcher.json';

                $contentString = $this->_GetFileContent($requestedPath);
                $launcher[$requestedPluginName] = $contentString;
            }
        }

        ksort($data);
        ksort($launcher);

        $answer = 'true';
        $message = 'Here are all javascript code for all requested plugin names and their children';

        leave:
        return [
            'answer' => $answer,
            'message' => $message,
            'data' => $data,
            'launcher' => $launcher
        ];
    }

    /**
     * Give a plugin name and get all translate files for that plugin in a lookup with language code => file contents
     *
     * @param  array  $in
     * @return array
     */
    protected function get_translation_files(
        array $in = []
    ): array {
        $default = [
            'from_plugin' => [
                'node' => '',
                'plugin' => '',
                'function' => ''
            ],
            'plugin_name' => '',
        ];
        $in = $this->_Default($default, $in);

        if ($in['from_plugin']['node'] !== 'server') {
            return [
                'answer' => 'false',
                'message' => 'I only accept messages that origin from this server node'
            ];
        }

        $path = PLUGINS . DS . str_replace('_', DS, $in['plugin_name']) . DS . 'asset' . DS . 'translate';

        $response = $this->internal_Cmd([
            'func' => 'GetFolderStructure',
            'path' => $path,
            'pattern' => '*.json'
        ]);

        $pathArray = $response['data'];

        $fileLookup = [];

        foreach ($pathArray as $path) {
            $response = $this->internal_Cmd([
                'func' => 'Read',
                'path' => $path
            ]);

            if ($response['answer'] === false) {
                return [
                    'answer' => $response['answer'],
                    'message' => $response['message']
                ];
            }

            $indexOnLanguageCode = $response['path_info']['filename'];
            $fileLookup[$indexOnLanguageCode] = $response['contents'];
        }

        return [
            'answer' => $response['answer'],
            'message' => $response['message'],
            'data' => $fileLookup
        ];
    }
}
