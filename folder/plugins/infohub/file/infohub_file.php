<?php
declare(strict_types=1);
if (basename(__FILE__) == basename($_SERVER["SCRIPT_FILENAME"])) {
    exit; // This file must be included, not called directly
}

/*
    @license
        Copyright (C) 2017 Peter Lembke , CharZam soft
        the program is distributed under the terms of the GNU General Public License

        InfoHub is free software: you can redistribute it and/or modify
        it under the terms of the GNU General Public License as published by
        the Free Software Foundation, either version 3 of the License, or
        (at your option) any later version.

        InfoHub is distributed in the hope that it will be useful,
        but WITHOUT ANY WARRANTY; without even the implied warranty of
        MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
        GNU General Public License for more details.

        You should have received a copy of the GNU General Public License
        along with InfoHub.	If not, see <https://www.gnu.org/licenses/>.

    @category InfoHub
    @package Plugin
    @copyright Copyright (c) 2017, Peter Lembke, CharZam soft
    @author Peter Lembke <peter.lembke@infohub.se>
    @link https://infohub.se/ InfoHub main page
*/
class infohub_file extends infohub_base
{

    Protected final function _Version(): array
    {
        return array(
            'date' => '2019-02-23',
            'since' => '2017-11-01',
            'version' => '1.0.1',
            'class_name' => 'infohub_file',
            'checksum' => '{{checksum}}',
            'note'=> 'Used by plugins that want to read/write files. Custom usage have custom functions for specific plugins.',
            'status' => 'normal',
            'license_name' => 'GNU GPL 3 or later'
        );
    }

    protected function _GetCmdFunctions(): array
    {
        return array(
            'read' => 'normal',
            'write' => 'normal',
            'get_folder_structure' => 'normal',
            'launcher_get_full_list' => 'normal', // infohub_launcher
            'asset_get_all_assets_for_one_plugin' => 'normal', // infohub_asset
            'asset_get_assets_requested' => 'normal', // infohub_asset
            'plugin_get_all_plugin_names' => 'normal', // infohub_plugin
            'get_all_level1_server_plugin_names' => 'normal', // infohub_contact
            'get_plugin_js_files_content' => 'normal' // infohub_translate
        );
    }

    // ***********************************************************
    // * your class functions below, only use protected functions
    // ***********************************************************

    /**
     * Read meta data and content from a file
     * You can limit the response data, Use data_request in your subcall.
     * @version 2017-11-05
     * @since   2017-11-05
     * @author  Peter Lembke
     * @param array $in
     * @return array
     */
    final protected function read(array $in = array()): array
    {
        $default = array(
            'path' => '',
            'from_plugin' => array('node' => '', 'plugin' => '', 'function' => ''),
            'folder' => 'file'
        );
        $in = $this->_Default($default, $in);

        $in['func'] = 'Read';
        
        if ($in['folder'] === 'file') {
            $in['path'] = MAIN . DS . 'file' . DS . $in['from_plugin']['plugin'] . DS . $in['path'];
        }
        
        if ($in['folder'] === 'plugin') {
            $in['path'] = PLUGINS . DS . str_replace('_', DS, $in['from_plugin']['plugin']) . DS . $in['path'];
        }

        $response = $this->internal_Cmd($in);
        return $response;
    }

    /**
     * Read meta data and content from a file
     * @version 2017-12-07
     * @since   2017-11-05
     * @author  Peter Lembke
     * @param array $in
     * @return array
     */
    final protected function internal_Read(array $in = array()): array
    {
        $default = array(
            'path' => '',
        );
        $in = $this->_Default($default, $in);

        $answer = 'false';
        $message = 'Nothing to report';
        $contents = '';
        $checksum = '';
        $isBinary = 'unknown';

        $response = array(
            'path' => '',
            'path_info' => array(),
            'file_info' => array(),
            'file_size' => 0
        );

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

        $checksum = $this->_Hash($contents);

        $answer = 'true';
        $message = 'Here are the file contents';

        leave:
        return array(
            'answer' => $answer,
            'message' => $message,
            'path' => $response['path'],
            'path_info' => $response['path_info'],
            'file_info' => $response['file_info'],
            'is_binary' => $isBinary,
            'contents' => $contents,
            'checksum' => $checksum,
            'file_size' => $response['file_size']
        );

    }

    /**
     * Write data to a file
     * @version 2018-05-12
     * @since   2017-11-05
     * @author  Peter Lembke
     * @param array $in
     * @return array
     */
    final protected function write(array $in = array()): array
    {
        $default = array(
            'path' => '',
            'contents' => '',
            'allow_overwrite' => 'false',
            'from_plugin' => array('node' => '', 'plugin' => '', 'function' => '')
        );
        $in = $this->_Default($default, $in);

        $in['func'] = 'Write';
        $in['path'] = MAIN . DS . 'file' . DS . $in['from_plugin']['plugin'] . DS . $in['path'];

        return $this->internal_Cmd($in);
    }

    /**
     * Write data to a file
     * @version 2017-12-07
     * @since   2017-11-05
     * @author  Peter Lembke
     * @param array $in
     * @return array
     */
    final protected function internal_Write(array $in = array()): array
    {
        $default = array(
            'path' => '',
            'contents' => '',
            'allow_overwrite' => 'false',
        );
        $in = $this->_Default($default, $in);

        $answer = 'false';
        $message = 'Nothing to report';
        $checksum = '';
        $createdPath = 'false';
        $response = array(
            'path' => '',
            'path_info' => array(),
            'file_info' => array(),
            'file_size' => 0
        );
        $contentsLength = strlen($in['contents']);

        $response = $this->_FileInformation($in);
        /*
        if ($response['answer'] === 'false') {
            $message = $response['message'];
            goto leave;
        }
        */

        $pathParts = pathinfo($in['path']);
        if ($this->_IsBinaryFileExtension($pathParts['extension']) === 'true') {
            $in['contents'] = base64_decode($in['contents']);
        }

        $checksum = $this->_Hash($in['contents']);

        if ($response['file_info']['folder_exist'] === 'false') {
            $response = mkdir($response['path'], $mode = 0777, $recursive = true);
            if ($response === false) {
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
        return array(
            'answer' => $answer,
            'message' => $message,
            'path' => $response['path'],
            'created_path' => $createdPath,
            'path_info' => $response['path_info'],
            'file_info' => $response['file_info'],
            'checksum' => $checksum,
            'file_size' => $response['file_size']
        );

    }

    /**
     * Determine if an extension indicate a binary file ("true"), or a text file ("false")
     * @version 2018-05-12
     * @since   2018-05-12
     * @author  Peter Lembke
     * @param string $extension
     * @return string | boolean string "true" or "false"
     */
    final protected function _IsBinaryFileExtension(string $extension = ''): string
    {
        $validNonBinaryExtensions = array('txt','csv','xml','json','svg');
        $isBinaryFileExtension = 'true';
        if (in_array($extension, $validNonBinaryExtensions) === true) {
            $isBinaryFileExtension = 'false';
        }
        return $isBinaryFileExtension;
    }

    /**
     * Get an array with all file paths and file names that match the pattern, also recursively.
     * @version 2017-12-10
     * @since   2017-12-10
     * @author  Peter Lembke
     * @param array $in
     * @return array
     */
    final protected function get_folder_structure(array $in = array()): array
    {
        $default = array(
            'path' => '',
            'from_plugin' => array('node' => '', 'plugin' => '', 'function' => '')
        );
        $in = $this->_Default($default, $in);

        $in['func'] = 'GetFolderStructure';
        $in['path'] = MAIN . DS . 'file' . DS . $in['from_plugin']['plugin'] . DS . $in['path'];

        return $this->internal_Cmd($in);
    }

    /**
     * Get an array with all file paths and file names that match the pattern, also recursively.
     * @version 2017-12-07
     * @since   2017-11-05
     * @author  Peter Lembke
     * @param array $in
     * @return array
     */
    final protected  function  internal_GetFolderStructure(array $in = array()): array
    {
        $default = array(
            'path' => '',
            'pattern' => '',
        );
        $in = $this->_Default($default, $in);

        $answer = 'false';
        $message = 'Nothing to report';
        $data = array();

        $in['path'] = $this->_CleanString($in['path'], 'path');
        if ($this->_CheckPath($in['path']) === 'false') {
            $message = 'Path is not valid';
            goto leave;
        }
        $in['pattern'] = $this->_CleanString($in['pattern'], 'pattern');

        $pattern = $in['path'] . '/' . $in['pattern'];

        $data = $this->_RecursiveSearch($pattern);

        $answer = 'true';
        $message = 'Here are the data';

        leave:
        return array(
            'answer' => $answer,
            'message' => $message,
            'path' => $in['path'],
            'pattern' => $in['pattern'],
            'data' => $data
        );
    }

    /**
     * Get information about a file
     * @version 2017-11-05
     * @since   2017-11-05
     * @author  Peter Lembke
     * @param array $in
     * @return array
     */
    final protected function _FileInformation(array $in = array()): array
    {
        $default = array(
            'path' => '',
            'from_plugin' => array('node' => '', 'plugin' => '')
        );
        $in = $this->_Default($default, $in);

        $answer = 'false';
        $message = 'Nothing to report';
        $fileSize = 0;

        $pathInfoDefault = array(
            'dirname' => '',
            'basename' => '',
            'filename' => '',
            'extension' => ''
        );
        $pathInfo = $pathInfoDefault;

        $fileInfoDefault = array(
            'folder_exist' => '',
            'is_dir' => '',
            'is_file' => '',
            'is_link' => '',
            'file_exist' => '',
            'is_readable' => ''
        );
        $fileInfo = $fileInfoDefault;

        $in['path'] = $this->_CleanString($in['path'], 'path');
        if ($this->_CheckPath($in['path']) === 'false') {
            $message = 'The path is not valid. Clean it up. Check the manual.';
            goto leave;
        }

        $pathInfo = pathinfo($in['path']);

        $fileInfo = array(
            'folder_exist' => is_dir($pathInfo['dirname']) ? 'true': 'false',
            'is_dir' => is_dir($in['path']) ? 'true': 'false',
            'is_file' => is_file($in['path']) ? 'true': 'false',
            'is_link' => is_link($in['path']) ? 'true': 'false',
            'file_exist' => file_exists($in['path']) ? 'true': 'false',
            'is_readable' => is_readable($in['path']) ? 'true': 'false'
        );

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

        return array(
            'answer' => $answer,
            'message' => $message,
            'path' => $in['path'],
            'path_info' => $pathInfo,
            'file_info' => $fileInfo,
            'file_size' => $fileSize
        );
    }

    /**
     * Check the path that it is correct
     * @version 2017-11-05
     * @since   2017-11-05
     * @author  Peter Lembke
     * @param string $path
     * @return string
     */
    final protected function _CheckPath(string $path = ''): string
    {
        if (strpos($path, MAIN) !== 0) {
            return 'false'; // Path must be somewhere in "folder"
        }

        $parts = explode('/', $path);

        foreach ($parts as $nr => $data)
        {
            if ($data === '..') {
                return 'false';
            }
        }

        return 'true';
    }

    /**
     * Keep allowed characters in the string
     * @version 2017-12-07
     * @since   2017-11-05
     * @author  Peter Lembke
     * @param string $string
     * @param string $type
     * @return string
     */
    final protected function _CleanString(string $string = '', string $type = 'path'): string
    {
        $allowed = array(
            'path' => 'abcdefghijklmnopqrstuvwxyz0123456789_-./',
            'pattern' => 'abcdefghijklmnopqrstuvwxyz0123456789_-.*'
        );
        if (isset($allowed[$type]) === false) {
            return '';
        }

        $string = strtolower(trim($string));
        $out = '';

        for ($i=0; $i < strlen($string); $i++) {
            $character = substr($string, $i, 1);
            if (strpos($allowed[$type], $character) !== false) {
                $out = $out . $character;
            }
        }
        $out = str_replace('..', '', $out);

        return $out;
    }

    /**
     * Give a data string, get a checksum value as a string
     * @version 2017-11-05
     * @since   2017-11-05
     * @author  Peter Lembke
     * @param string $dataString
     * @return string
     */
    final protected function _Hash(string $dataString = ''): string
    {
        return (string) md5($dataString);
    }

    /**
     * Give a path and pattern. Get an array with all paths and file names recursively.
     * https://thephpeffect.com/recursive-glob-vs-recursive-directory-iterator/
     * @version 2017-11-05
     * @since   2017-11-05
     * @author  Peter Lembke
     * @param string $pattern
     * @param int $flags
     * @return array
     */
    final protected function _RecursiveSearch(string $pattern = '', int $flags = 0): array
    {
        $files = glob($pattern, $flags);
        foreach (glob(dirname($pattern).'/*', GLOB_ONLYDIR|GLOB_NOSORT) as $dir) {
            $files = array_merge($files, $this->_RecursiveSearch($dir.'/'.basename($pattern), $flags));
        }
        return $files;
    }

    /**
     * Get a list with plugin names that has a file called asset/launcher.json
     * The list key is plugin name, the data is the assets launcher.json, icon/icon.svg, icon/icon.json
     * Used only by infohub_launcher
     * @version 2018-12-07
     * @since   2017-12-07
     * @author  Peter Lembke
     * @param array $in
     * @return array
     */
    final protected function launcher_get_full_list(array $in = array()): array
    {
        $default = array(
            'from_plugin' => array('node' => '', 'plugin' => '')
        );
        $in = $this->_Default($default, $in);

        $answer = 'false';
        $message = 'Nothing to report';
        $data = array();

        if ($in['from_plugin']['node'] !== 'server') {
            $message = 'I only accept messages that origin from this server node';
            goto leave;
        }

        if ($in['from_plugin']['plugin'] !== 'infohub_launcher') {
            $message = 'I only accept messages that origin from plugin infohub_launcher';
            goto leave;
        }

        $response = $this->internal_Cmd(array(
            'func' => 'GetFolderStructure',
            'path' => PLUGINS,
            'pattern' => 'launcher.json',
        ));

        if ($response['answer'] === 'false') {
            $message = $response['message'];
        }
        
        $wantedAssets = array('launcher.json', 'icon/icon.json', 'icon/icon.svg');

        foreach ($response['data'] as $path)
        {
            $pathInfo = pathinfo($path);
            $pathCopy = $pathInfo['dirname'];
            $pathCopy = substr($pathCopy, strlen(PLUGINS)+1);
            $parts = explode('/', $pathCopy);

            if (count($parts) <> 3) {
                continue;
            }

            // We have 0: domain name (like "infohub"), 1: plugin name (like "doc") and 2: something more.
            if ($parts[2] !== 'asset') {
                continue;
            }

            $pluginName = $parts[0] . '_' . $parts[1];

            $avoid = array(
                'infohub_workbench' => '',
                'infohub_launcher' => ''
            );

            if (isset($avoid[$pluginName])) {
                continue;
            }

            $dirName = $pathInfo['dirname'];

            foreach ($wantedAssets as $assetName)
            {
                $response = $this->internal_Cmd(array(
                    'func' => 'Read',
                    'path' => $dirName . '/' . $assetName
                ));

                if ($response['answer'] === 'true') {
                    $data[$pluginName][$assetName] = $response['checksum'];
                }
            }

        }
        
        $answer = 'true';
        $message = 'Here are the list of plugin names that can be started in Workbench';

        leave:
        return array(
            'answer' => $answer,
            'message' => $message,
            'data' => $data
        );
    }

    /**
     * Get ALL assets for ONE plugin
     * Used by infohub_asset
     * @version 2017-12-23
     * @since   2017-12-23
     * @author  Peter Lembke
     * @param array $in
     * @return array
     */
    final protected function asset_get_all_assets_for_one_plugin(array $in = array()): array
    {
        $default = array(
            'plugin_name' => '',
            'from_plugin' => array('node' => '', 'plugin' => '')
        );
        $in = $this->_Default($default, $in);

        $answer = 'false';
        $message = 'Nothing to report';
        $data = array();

        if ($in['from_plugin']['node'] !== 'server') {
            $message = 'I only accept messages that origin from this server node';
            goto leave;
        }

        if ($in['from_plugin']['plugin'] !== 'infohub_asset') {
            $message = 'I only accept messages that origin from plugin infohub_asset';
            goto leave;
        }

        $assetPath = PLUGINS . '/' . str_replace('_', '/', $in['plugin_name']) . '/asset';

        $response = $this->internal_Cmd(array(
            'func' => 'GetFolderStructure',
            'path' => $assetPath,
            'pattern' => '*',
        ));

        foreach ($response['data'] as $path)
        {
            if (strpos($path, '.') === false) {
                continue; // Path did not have a . in the name, meaning it is not a file and therefore not interesting.
            }

            $fileData = $this->internal_Cmd(array(
                'func' => 'Read',
                'path' => $path
            ));

            $storedPath = $in['plugin_name'] . '/' . str_replace($assetPath . '/', '', $path);

            $data[$storedPath] = array(
                'plugin_name' => $in['plugin_name'],
                'asset_name' => $storedPath,
                'extension' => $fileData['path_info']['extension'],
                'contents' => $fileData['contents'],
                'checksum' => $fileData['checksum'],
                'is_binary' => $fileData['is_binary']
            );

            $answer = 'true';
            $message = 'Here are the assets you requested';
        }

        leave:
        return array(
            'answer' => $answer,
            'message' => $message,
            'data' => $data
        );
    }

    /**
     * You can request specific assets
     * Used by infohub_asset
     * @version 2018-11-14
     * @since   2018-11-14
     * @author  Peter Lembke
     * @param array $in
     * @return array
     */
    final protected function asset_get_assets_requested(array $in = array()): array
    {
        $default = array(
            'assets_requested' => array(),
            'from_plugin' => array('node' => '', 'plugin' => '')
        );
        $in = $this->_Default($default, $in);

        $answer = 'false';
        $message = 'Nothing to report';
        $data = array();

        if ($in['from_plugin']['node'] !== 'server') {
            $message = 'I only accept messages that origin from this server node';
            goto leave;
        }

        if ($in['from_plugin']['plugin'] !== 'infohub_asset') {
            $message = 'I only accept messages that origin from plugin infohub_asset';
            goto leave;
        }

        foreach ($in['assets_requested'] as $path => $dummy)
        {
            $prefix = 'infohub_asset/asset/';
            $path = substr($path, strlen($prefix));
            
            $pluginEnd = strpos($path, '/');
            $pluginName = substr($path, 0, $pluginEnd);
            
            $remove = $pluginName . '/';
            $path = substr($path, strlen($remove));
            
            $assetName = $path;
            
            $assetPath = PLUGINS . DS . str_replace('_', DS, $pluginName) . DS . 'asset';

            $filePath = $assetPath . DS . $assetName;

            $fileData = $this->internal_Cmd(array(
                'func' => 'Read',
                'path' => $filePath
            ));

            $storedPath = $prefix . $pluginName . '/' . $assetName;

            $data[$storedPath] = array(
                'plugin_name' => $pluginName,
                'asset_name' => $assetName,
                'extension' => $fileData['path_info']['extension'],
                'contents' => $fileData['contents'],
                'checksum' => $fileData['checksum'],
                'is_binary' => $fileData['is_binary']
            );
        }

        $answer = 'true';
        $message = 'Here are the assets you requested';

        leave:
        return array(
            'answer' => $answer,
            'message' => $message,
            'data' => $data
        );
    }

    /**
     * Get a list with all javascript plugin names
     * Used by infohub_plugin
     * @version 2018-10-26
     * @since   2018-10-26
     * @author  Peter Lembke
     * @param array $in
     * @return array
     */
    final protected function plugin_get_all_plugin_names(array $in = array()): array
    {
        $default = array(
            'from_plugin' => array('node' => '', 'plugin' => '')
        );
        $in = $this->_Default($default, $in);

        $answer = 'false';
        $message = 'Nothing to report';
        $data = array();

        if ($in['from_plugin']['node'] !== 'server') {
            $message = 'I only accept messages that origin from the server node';
            goto leave;
        }

        if ($in['from_plugin']['plugin'] !== 'infohub_plugin') {
            $message = 'I only accept messages that origin from plugin infohub_plugin';
            goto leave;
        }

        $response = $this->internal_Cmd(array(
            'func' => 'GetFolderStructure',
            'path' => PLUGINS,
            'pattern' => '*.js',
        ));

        foreach ($response['data'] as $path)
        {
            $pathInfo = pathinfo($path);
            $pluginName = $pathInfo['filename'];

            if (strpos($pluginName, '_') === false) {
                continue; // Skip js files without _ in the name
            }

            if (strtolower($pluginName) !== $pluginName) {
                continue; // Skip js files that contain upper case letters
            }

            $avoid = array(
                'infohub_test_plugin_js' => '',
            );

            if (isset($avoid[$pluginName])) {
                continue;
            }

            $data[$pluginName] = '';
        }

        $answer = 'true';
        $message = 'Here are the list with all plugin names';

        leave:
        return array(
            'answer' => $answer,
            'message' => $message,
            'data' => $data
        );
    }
    
    /**
     * Get a list with all level 1 server plugin names
     * Also get some information like the plugin sensitivity. (core, harmless, sensitive, protect)
     * Used by Infohub_Contact among others
     * @version 2019-02-23
     * @since   2019-02-23
     * @author  Peter Lembke
     * @param array $in
     * @return array
     */
    final protected function get_all_level1_server_plugin_names(array $in = array()): array
    {
        $default = array(
            'from_plugin' => array('node' => '', 'plugin' => '')
        );
        $in = $this->_Default($default, $in);

        $answer = 'false';
        $message = 'Nothing to report';
        $data = array();

        $response = $this->internal_Cmd(array(
            'func' => 'GetFolderStructure',
            'path' => PLUGINS,
            'pattern' => '*.php',
        ));

        foreach ($response['data'] as $path)
        {
            $pluginName = substr($path, strlen(PLUGINS)+1);
            $parts = explode('/', $pluginName);
            $pluginName = end($parts);
            
            if (strtolower($pluginName) !== $pluginName) {
                continue; // Skip names that contain upper case letters
            }

            $parts = explode('_', $pluginName);
            if (count($parts) !== 2) {
                continue; // We only care about level 1 plugins
            }
            
            $pluginName = substr($pluginName, 0, -4);
            $data[$pluginName] = array();
        }
        
        ksort($data);

        $answer = 'true';
        $message = 'Here are the list with all plugin names';

        leave:
        return array(
            'answer' => $answer,
            'message' => $message,
            'data' => $data
        );
    }
    
    /**
     * Give a plugin name and you get the source code for all js files indexed on each plugin name.
     * Used ONLY by infohub_translate.php
     * @version 2019-03-24
     * @since   2019-03-24
     * @author  Peter Lembke
     * @param array $in
     * @return array
     */
    final protected function get_plugin_js_files_content(array $in = array()): array
    {
        $default = array(
            'plugin_name' => '',
            'from_plugin' => array('node' => '', 'plugin' => '')
        );
        $in = $this->_Default($default, $in);

        $answer = 'false';
        $message = 'Nothing to report';
        $data = array();

        if ($in['from_plugin']['node'] !== 'server') {
            $message = 'I only accept messages that origin from this server node';
            goto leave;
        }

        if ($in['from_plugin']['plugin'] !== 'infohub_translate') {
            $message = 'I only accept messages that origin from plugin infohub_translate';
            goto leave;
        }
        
        $in['path'] = PLUGINS . DS . str_replace('_', DS, $in['plugin_name']);
        
        /*
        $folder = $in['path'] . DS . 'asset' . DS . 'translate';
        if (is_dir($folder) === false) {
            $message = 'You should at least have prepared with an asset/translate folder';
            goto leave;
        }
        */
        
        $response = $this->internal_Cmd(array(
            'func' => 'GetFolderStructure',
            'path' => $in['path'],
            'pattern' => '*.js',
        ));

        foreach ($response['data'] as $path)
        {
            $pathInfo = pathinfo($path);
            $pluginName = $pathInfo['filename'];

            if (strpos($pluginName, '_') === false) {
                continue; // Skip js files without _ in the name
            }

            if (strtolower($pluginName) !== $pluginName) {
                continue; // Skip names that contain upper case letters
            }

            $avoid = array(
                'infohub_test_plugin_js' => '',
            );

            if (isset($avoid[$pluginName])) {
                continue;
            }
            
            $data[$pluginName] = file_get_contents($path);
            
            if (strpos($data[$pluginName], '_Translate(') === false) {
                unset($data[$pluginName]); // This file do not contain anything to translate, skip it.
            }
        }
        
        ksort($data);

        $answer = 'true';
        $message = 'Here are all javascript code for one plugin name';

        leave:
        return array(
            'answer' => $answer,
            'message' => $message,
            'data' => $data
        );
    }
}
