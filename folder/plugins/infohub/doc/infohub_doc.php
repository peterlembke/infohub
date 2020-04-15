<?php
declare(strict_types=1);
if (basename(__FILE__) == basename($_SERVER["SCRIPT_FILENAME"])) {
    exit; // This file must be included, not called directly
}

/**
 * infohub_doc show what the core can do
 * @category InfoHub
 * @package demo
 * @copyright Copyright (c) 2016, Peter Lembke, CharZam soft
 * @author Peter Lembke <peter.lembke@infohub.se>
 * @link https://infohub.se/ InfoHub main page
 * @license InfoHub is distributed under the terms of the GNU General Public License
 * InfoHub is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * InfoHub is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 * You should have received a copy of the GNU General Public License
 * along with InfoHub.    If not, see <https://www.gnu.org/licenses/>.
 */
class infohub_doc extends infohub_base
{
    protected final function _Version(): array
    {
        return array(
            'date' => '2019-05-30',
            'since' => '2016-04-02',
            'version' => '1.2.0',
            'class_name' => 'infohub_doc',
            'checksum' => '{{checksum}}',
            'note' => 'Documentation system. Simple. Self sufficient.',
            'status' => 'normal',
            'SPDX-License-Identifier' => 'GPL-3.0-or-later'
        );
    }

    protected function _GetCmdFunctions(): array
    {
        return array(
            'get_document' => 'normal',
            'get_all_documents' => 'normal',
            'get_documents_list' => 'normal'
        );
    }

    /**
     * Used by the cmd functions to get the file extension.
     * All other functions must be general and not assume we want to use this extension
     * @return string
     */
    protected function _GetFileExtension(): string
    {
        return 'md';
    }

    /**
     * Returns the document with embedded images
     * @version 2017-07-14
     * @since   2017-07-14
     * @author  Peter Lembke
     * @param array $in
     * @return array
     */
    final protected function get_document(array $in = array()): array
    {
        $default = array(
            'area' => 'main', // main or plugin
            'document_name' => 'main',
            'checksum' => ''
        );
        $in = $this->_Default($default, $in);

        $fileExtension = $this->_GetFileExtension();

        $response = $this->internal_Cmd(array(
            'func' => 'GetDocument',
            'area' => $in['area'],
            'document_name' => $in['document_name'],
            'checksum' => $in['checksum'],
            'file_extension' => $fileExtension
        ));

        return $response;
    }

    /**
     * Returns the Markdown documentation text
     * @version 2017-07-14
     * @since   2017-07-14
     * @author  Peter Lembke
     * @param array $in
     * @return array
     */
    final protected function internal_GetDocument(array $in = array()): array
    {
        $default = array(
            'area' => 'main', // main or plugin
            'document_name' => 'main',
            'checksum' => '',
            'file_extension' => 'md'
        );
        $in = $this->_Default($default, $in);

        $docName = $this->_CleanName($in['document_name']);
        $area = $in['area'];
        $basePath = $this->_GetBasePath($area);

        $docFileName = $this->_GetFileName($docName, $in['file_extension'], $basePath);
        $docContents = $this->_GetFileContents($docFileName);

        $docContents = $this->_HandleImages($docContents, $docName, $area);

        $checksumSame = 'false';
        $message = 'Here are the markdown document with embedded images';

        $checksum = md5($docContents);
        if ($in['checksum'] === $checksum) {
            $docContents = '';
            $checksumSame = 'true';
            $message = 'The data you already have is valid. Keep using it';
        }

        return array(
            'answer' => 'true',
            'message' => $message,
            'data' => array(
                'document' => $docContents,
                'area' => $in['area'],
                'document_name' => $in['document_name'],
                'time_stamp' => $this->_TimeStamp(),
                'micro_time' => $this->_MicroTime(),
                'provided_checksum' => $in['checksum'],
                'checksum' => $checksum,
                'checksum_same' => $checksumSame
            )
        );
    }

    /**
     * Get a list with all available documents
     * @version 2017-09-28
     * @since   2017-09-28
     * @author  Peter Lembke
     * @param array $in
     * @return array
     */
    final protected function get_documents_list(array $in = array()): array
    {
        $default = array(
            'checksum' => ''
        );
        $in = $this->_Default($default, $in);

        $checksumSame = 'false';
        $message = 'Here are the navigation data';

        $fileExtension = $this->_GetFileExtension();

        $data = array(
            'main' => $this->_GetAllDocNamesByArea('main', $fileExtension),
            'plugin' => $this->_GetAllDocNamesByArea('plugin', $fileExtension),
        );

        $findFirst = '# ';
        $findLast = "\n";

        $dataOut = array();
        foreach ($data as $area => $docNames)
        {
            $dataOut[$area] = array();
            $basePath = $this->_GetBasePath($area);

            foreach ($docNames as $docName)
            {
                $docFileName = $this->_GetFileName($docName, $fileExtension, $basePath);
                $docContents = $this->_GetFileContents($docFileName);
                $label = $this->_GetPartOfString($docContents, $findFirst, $findLast);

                $label = str_replace('_', ' ', $label);

                $dataOut[$area][$docName] = array(
                    'doc_name' => $docName,
                    'label' => $label,
                    'area' => $area
                );
            }
        }

        $checksum = md5(json_encode($dataOut));
        if ($in['checksum'] === $checksum) {
            $dataOut = array();
            $checksumSame = 'true';
            $message = 'The data you already have is valid. Keep using it';
        }

        return array(
            'answer' => 'true',
            'message' => $message,
            'data' => array(
                'data' => $dataOut,
                'time_stamp' => $this->_TimeStamp(),
                'micro_time' => $this->_MicroTime(),
                'provided_checksum' => $in['checksum'],
                'checksum' => $checksum,
                'checksum_same' => $checksumSame
            )
        );
    }

    /**
     * Returns all documents in one big array
     * @version 2018-10-23
     * @since   2018-10-23
     * @author  Peter Lembke
     * @param array $in
     * @return array
     */
    final protected function get_all_documents(array $in = array()): array
    {
        $default = array();
        $in = $this->_Default($default, $in);

        $dataOut = array();

        $fileExtension = $this->_GetFileExtension();

        $data = array(
            'main' => $this->_GetAllDocNamesByArea('main', $fileExtension),
            'plugin' => $this->_GetAllDocNamesByArea('plugin', $fileExtension),
        );

        foreach ($data as $area => $docNamesArray)
        {
            foreach ($docNamesArray as $docName)
            {
                $response = $this->internal_Cmd(array(
                    'func' => 'GetDocument',
                    'area' => $area,
                    'document_name' => $docName,
                    'file_extension' => $fileExtension
                ));

                $path = 'infohub_doc/document/' . $area . '/' . $docName;
                $dataOut[$path] = $response['data'];
            }
        }

        return array(
            'answer' => 'true',
            'message' => 'Here are all doc files. Ready to be saved locally',
            'data' => $dataOut
        );
    }

    /**
     * Doc file names follow some rules. Here we make sure the name fulfill those rules
     * Converts string to lower case, removes all characters except a-z and 0-9 and underscore.
     * Checks that there are at least one underscore or else returns an empty string
     * @param $name
     * @return string
     */
    final protected function _CleanName(string $name = ''): string
    {
        $name = strtolower($name);

        // Replace all characters with empty string except a-z 0-9 and underscore _
        $name = preg_replace('/[^a-z0-9_]/', '', $name);

        // Proper doc names have at least one underscore that divide the string. Example: infohub_doc
        $parts = explode('_', $name);
        if (count($parts) < 1) {
            $name = '';
        }

        return $name;
    }

    /**
     * Constructs a path to a file and returns that path to you.
     * @param string $name | Name of the document or any other related document file: example: mydomain_myplugin
     * @param string $extension | md or markdown
     * @param string $basePath | any path. example: /var/www/infohub/folder/plugin
     * @return string
     */
    final protected function _GetFileName(string $name = '', string $extension = 'md', string $basePath = ''): string
    {
        $okExtensions = array('md', 'markdown', 'css');
        if (in_array($extension, $okExtensions) === false) {
            return '';
        }

        $fileNamePath = str_replace('_', DS, $name);
        $path = $basePath . DS . $fileNamePath;
        $fullFilePath = $path . DS . $name . '.' . $extension;

        return $fullFilePath;
    }

    /**
     * I will construct a path and return that path to you.
     * @param string $docName | Name of the document or any other related document file: example: mydomain_myplugin
     * @param string $imageName
     * @param string $basePath | any path. example: /var/www/infohub/folder/plugin
     * @return string
     */
    final protected function _GetImageFileName(string $docName = '', string $imageName = '', string $basePath = ''): string
    {
        $docPath = str_replace('_', DS, $docName);
        $path = $basePath . DS . $docPath . DS . 'images' . DS . $imageName;

        return $path;
    }

    /**
     * Get the file path to an area.
     * Right now two areas are supported: plugin and main.
     * @param string $area | main or plugin
     * @return string
     */
    final protected function _GetBasePath(string $area = 'main'): string
    {
        $basePath = '';

        $validPaths = array(
            'plugin' => PLUGINS,
            'main' => DOC
        );

        if (isset($validPaths[$area])) {
            $basePath = $validPaths[$area];
        }

        return $basePath;
    }

    /**
     * Returns the file contents or an empty string.
     * @param string $file
     * @return string
     */
    final protected function _GetFileContents(string $file = ''): string
    {
        $fileContents = '';
        if (file_exists($file)) {
            $fileContents = file_get_contents($file);
        }

        return $fileContents;
    }

    /**
     * Parses the ![My image](rendermajor-1.png) directives in the doc text.
     * When the url do not have any / in it then we embed an image.
     * uses: _ImageHtml
     * @param string $text
     * @param string $docName
     * @param string $area
     * @param string $mode
     * @return string
     */
    final protected function _HandleImages(string $text = '', string $docName = '', string $area = ''): string
    {
        $imageNamesArray = $this->_GetAllImageNamesByAreaAndDocName($area, $docName);

        foreach ($imageNamesArray as $imageName)
        {
            $find = '(' . $imageName . ')';

            if (strpos($text, $find) === false) {
                continue;
            }

            $imageBase64Data = $this->_ImageBase64Data(array(
                'area' => $area,
                'doc_name' => $docName,
                'image_name' => $imageName
            ));

            $replaceWith = '(' . $imageBase64Data . ')';

            $text = str_replace($find, $replaceWith, $text);
        }

        return $text;
    }

    /**
     * Show an image from the images sub folder.
     * {{command=image|image_name=my_image.png|label=My text under the image|doc_name=optional_doc_name|area=optional area name}}
     * doc_name and area are optional parameters. If omitted then the document doc_name and area are used.
     * @param array $in
     * @param string $docName | defaults to the current document
     * @param string $area | defaults to the current document area
     * @return string
     */
    final protected function _ImageBase64Data(array $in = array()): string
    {
        $default = array(
            'area' => '',
            'doc_name' => '',
            'image_name' => ''
        );
        $in = $this->_Default($default, $in);

        $basePath = $this->_GetBasePath($in['area']);
        $imageFileName = $this->_GetImageFileName($in['doc_name'], $in['image_name'], $basePath);
        $imageContents = $this->_GetFileContents($imageFileName);

        $extension = pathinfo($imageFileName, PATHINFO_EXTENSION);
        $prefix = 'data:image/png;base64,';
        if ($extension === 'jpeg') {
            $prefix = 'data:image/jpeg;base64,';
        }

        $imageBase64Data = $prefix . base64_encode($imageContents);

        return $imageBase64Data;
    }

    /**
     * Get array with all doc names for an area
     * @param string $area
     * @param string $fileExtension | The file ending. my_doc_file.md has extension 'md'
     * @return array
     */
    final protected function _GetAllDocNamesByArea(string $area = 'main', string $fileExtension = 'md'): array
    {
        $basePath = $this->_GetBasePath($area);

        $searchPath = $basePath . DS . '*.' . $fileExtension;
        $filesArray = $this->_RecursiveSearch($searchPath);
        sort($filesArray);

        $documentNamesArray = $this->_GetAllDocNames($filesArray, $basePath);

        return $documentNamesArray;
    }

    /**
     * Get array with all image names for a document in an area
     * @param string $area
     * @param string $docName
     * @return array
     */
    final protected function _GetAllImageNamesByAreaAndDocName(string $area = 'main', $docName = ''): array
    {
        $basePath = $this->_GetBasePath($area);
        $pluginPath = str_replace('_', DS, $docName);

        $searchPath = $basePath . DS . $pluginPath . DS . 'images' . DS . '*';

        $filesArray = $this->_RecursiveSearch($searchPath);
        sort($filesArray);

        $baseNames = array();
        foreach ($filesArray as $filePath) {
            $fileName = pathinfo($filePath, PATHINFO_BASENAME);
            $baseNames[] = $fileName;
        }

        return $baseNames;
    }

    /**
     * Find part of a string between the start and stop strings
     * @param $string
     * @param string $findFirst
     * @param string $findLast
     * @return string
     */
    final protected function _GetPartOfString(string $string = '', string $findFirst = '', string $findLast = ''): string
    {
        $subString = '';

        $foundFirst = strpos($string, $findFirst);
        if ($foundFirst === false) {
            goto leave;
        }
        $start = $foundFirst + strlen($findFirst);

        $foundLast = strpos($string, $findLast);
        if ($foundLast === false) {
            goto leave;
        }
        $length = $foundLast - $start;

        $subString = substr($string, $start, $length);

        leave:
        return $subString;
    }

    /**
     * Pull out the actual doc file name on each file path
     * @param array $fileNamesArray
     * @param string $basePath
     * @return array
     */
    final protected function _GetAllDocNames(array $fileNamesArray = array(), string $basePath = ''): array
    {
        $docNamesArray = array();

        foreach ($fileNamesArray as $fullFileNameWithPath)
        {
            $fileNameParts = pathinfo($fullFileNameWithPath);

            $fileName = $fileNameParts['filename'];

            if (strtolower($fileName) !== $fileName) {
                continue; // I only accept lower case file names
            }

            $directory = substr($fileNameParts['dirname'], strlen($basePath)+1);
            $directory = str_replace('/', '_', $directory);

            if ($directory !== $fileName) {
                continue; // The file name must be in a path with the same name
            }

            $docNamesArray[] = $fileName;
        }

        return $docNamesArray;
    }

    /**
     * Give a search pattern. Get array with found files and paths.
     * https://thephpeffect.com/recursive-glob-vs-recursive-directory-iterator/
     * @param string $pattern | Example: $basePath . DS . '*.md';
     * @param int $flags
     * @return array
     */
    final protected function _RecursiveSearch(string $pattern = '', int $flags = 0): array
    {
        $files = glob($pattern, $flags);

        $directoryPattern = dirname($pattern).'/*';
        $directoriesArray = glob($directoryPattern, GLOB_ONLYDIR|GLOB_NOSORT);

        foreach ($directoriesArray as $directory)
        {
            $subDirectoryPattern = $directory.'/'.basename($pattern);
            $subDirectoryFiles = $this->_RecursiveSearch($subDirectoryPattern, $flags);
            $files = array_merge($files, $subDirectoryFiles);
        }

        return $files;
    }

}