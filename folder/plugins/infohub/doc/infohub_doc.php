<?php
/**
 * Documentation system. Simple. Self sufficient.
 *
 * @package     Infohub
 * @subpackage  infohub_doc
 */

declare(strict_types=1);
if (basename(__FILE__) == basename($_SERVER["SCRIPT_FILENAME"])) {
    exit; // This file must be included, not called directly
}

/**
 * Documentation system. Simple. Self sufficient.
 *
 * @author      Peter Lembke <info@infohub.se>
 * @version     2019-05-30
 * @since       2016-04-02
 * @copyright   Copyright (c) 2018, Peter Lembke
 * @license     https://opensource.org/licenses/gpl-license.php GPL-3.0-or-later
 * @see         https://github.com/peterlembke/infohub/blob/master/folder/plugins/infohub/checksum/infohub_checksum.md Documentation
 * @link        https://infohub.se/ InfoHub main page
 */
class infohub_doc extends infohub_base
{
    /**
     * Version information for this plugin
     *
     * @return string[]
     * @since   2016-04-02
     * @author  Peter Lembke
     * @version 2019-05-30
     */
    protected function _Version(): array
    {
        return [
            'date' => '2019-05-30',
            'since' => '2016-04-02',
            'version' => '1.2.0',
            'class_name' => 'infohub_doc',
            'checksum' => '{{checksum}}',
            'note' => 'Documentation system. Simple. Self sufficient.',
            'status' => 'normal',
            'SPDX-License-Identifier' => 'GPL-3.0-or-later',
            'user_role' => 'user'
        ];
    }

    /**
     * Public functions in this plugin
     *
     * @return array
     * @author  Peter Lembke
     * @version 2019-05-30
     * @since   2016-04-02
     */
    protected function _GetCmdFunctions(): array
    {
        $list = [
            'get_document' => 'normal',
            'get_all_documents' => 'normal',
            'get_documents_list' => 'normal'
        ];

        return parent::_GetCmdFunctionsBase($list);
    }

    /**
     * Used by the cmd functions to get the file extension.
     * All other functions must be general and not assume we want to use this extension
     * @return string
     * @since   2016-04-02
     * @author  Peter Lembke
     * @version 2019-05-30
     */
    protected function _GetFileExtension(): string
    {
        return 'md';
    }

    /**
     * Returns the document with embedded images
     *
     * @param array $in
     * @return array
     * @author  Peter Lembke
     * @version 2017-07-14
     * @since   2017-07-14
     */
    protected function get_document(array $in = []): array
    {
        $default = [
            'area' => 'main', // main or plugin
            'document_name' => 'main',
            'checksum' => ''
        ];
        $in = $this->_Default($default, $in);

        $fileExtension = $this->_GetFileExtension();

        $response = $this->internal_Cmd([
            'func' => 'GetDocument',
            'area' => $in['area'],
            'document_name' => $in['document_name'],
            'checksum' => $in['checksum'],
            'file_extension' => $fileExtension
        ]);

        return $response;
    }

    /**
     * Returns the Markdown documentation text
     *
     * @param array $in
     * @return array
     * @author  Peter Lembke
     * @version 2017-07-14
     * @since   2017-07-14
     */
    protected function internal_GetDocument(array $in = []): array
    {
        $default = [
            'area' => 'main', // main or plugin
            'document_name' => 'main',
            'checksum' => '',
            'file_extension' => 'md'
        ];
        $in = $this->_Default($default, $in);

        $area = $in['area'];
        $documentName = $this->_CleanName($area, $in['document_name']);

        $basePath = $this->_GetBasePath($area);
        $docFileName = $this->_GetFileName($area, $documentName, $in['file_extension'], $basePath);
        $docContents = $this->_GetFileContents($docFileName);

        if ($in['file_extension'] === 'md') {
            $docContents = strip_tags($docContents);
        }

        $docContents = $this->_HandleImages($docContents, $documentName, $area);

        $isChecksumSame = 'false';
        $message = 'Here are the markdown document with embedded images';

        $checksum = md5($docContents);
        if ($in['checksum'] === $checksum) {
            $docContents = '';
            $isChecksumSame = 'true';
            $message = 'The data you already have is valid. Keep using it';
        }

        $documentSize = strlen($docContents);

        return [
            'answer' => 'true',
            'message' => $message,
            'data' => [
                'document' => $docContents,
                'document_size' => $documentSize,
                'area' => $in['area'],
                'document_name' => $in['document_name'],
                'time_stamp' => $this->_TimeStamp(),
                'micro_time' => $this->_MicroTime(),
                'provided_checksum' => $in['checksum'],
                'checksum' => $checksum,
                'is_checksum_same' => $isChecksumSame
            ]
        ];
    }

    /**
     * Get a list with all available documents
     * You get the list from Storage.
     * If the list is old then it is updated in Storage.
     *
     * @param array $in
     * @return array
     * @author  Peter Lembke
     * @version 2017-09-28
     * @since   2017-09-28
     */
    protected function get_documents_list(array $in = []): array
    {
        $default = [
            'checksum' => '',
            'config' => [
                'document_list_cache_seconds' => 0
            ],
            'response' => [
                'post_exist' => 'false',
                'micro_time' => 0,
                'data' => []
            ],
            'step' => 'step_read_storage'
        ];
        $in = $this->_Default($default, $in);

        if ($in['step'] === 'step_read_storage') {
            return $this->_SubCall([
                'to' => [
                    'node' => 'server',
                    'plugin' => 'infohub_storage',
                    'function' => 'read'
                ],
                'data' => [
                    'path' => 'infohub_doc/documents_list'
                ],
                'data_back' => [
                    'checksum' => $in['checksum'],
                    'step' => 'step_read_storage_response'
                ]
            ]);

        }

        if ($in['step'] === 'step_read_storage_response') {
            if ($in['response']['post_exist'] === 'true') {
                $cacheLimit = $in['config']['document_list_cache_seconds'];
                $oldWhen = $this->_MicroTime() + $cacheLimit;
                $data = $in['response']['data'];
                $dataStored = $data['micro_time'];
                $isOld = $dataStored > $oldWhen;
                if ($isOld === false) {
                    return [
                        'answer' => 'true',
                        'message' => 'Have read the documents list from storage',
                        'data' => $data
                    ];
                }
            }
            $in['step'] = 'step_get_documents_list';
        }

        if ($in['step'] === 'step_get_documents_list') {
            $isChecksumSame = 'false';
            $message = 'Here are the navigation data';

            $dataOut = $this->_GetDocumentsList();

            $jsonDataOut = json_encode($dataOut);
            if ($jsonDataOut === false) {
                return [
                    'answer' => 'false',
                    'message' => 'Could not json encode the data in infohub_doc',
                    'data' => []
                ];
            }

            $size = strlen($jsonDataOut);

            $currentChecksum = md5($jsonDataOut);
            if ($in['checksum'] === $currentChecksum) {
                $dataOut = [];
                $isChecksumSame = 'true';
                $message = 'The data you already have is valid. Keep using it';
            }

            $messages = [];

            $data = [
                'data' => $dataOut,
                'time_stamp' => $this->_TimeStamp(),
                'micro_time' => $this->_MicroTime(),
                'provided_checksum' => $in['checksum'],
                'checksum' => $currentChecksum,
                'is_checksum_same' => $isChecksumSame,
                'size' => $size
            ];

            $messages[] = $this->_SubCall([
                'to' => [
                    'node' => 'server',
                    'plugin' => 'infohub_storage',
                    'function' => 'write'
                ],
                'data' => [
                    'path' => 'infohub_doc/documents_list',
                    'data' => $data
                ],
                'data_back' => [
                    'step' => 'step_void'
                ]
            ]);

            return [
                'answer' => 'true',
                'message' => $message,
                'data' => $data,
                'messages' => $messages
            ];
        }

        return [
            'answer' => 'true',
            'message' => 'Task done'
        ];
    }

    /**
     * The actual logic that create the documents list
     * @return array
     */
    protected function _GetDocumentsList(): array {

        $fileExtension = $this->_GetFileExtension();

        $data = [
            'main' => $this->_GetAlldocumentNamesByArea('main', $fileExtension),
            'plugin' => $this->_GetAlldocumentNamesByArea('plugin', $fileExtension),
            'root' => $this->_GetAlldocumentNamesByArea('root', $fileExtension),
        ];

        $findFirst = '# ';
        $findLast = "\n";

        $dataOut = [];
        foreach ($data as $area => $documentNames) {
            $dataOut[$area] = [];
            $basePath = $this->_GetBasePath($area);

            foreach ($documentNames as $documentName) {
                $documentFileName = $this->_GetFileName($area, $documentName, $fileExtension, $basePath);
                $documentContents = $this->_GetFileContents($documentFileName);
                $label = $this->_GetPartOfString($documentContents, $findFirst, $findLast);
                if ($label === '') {
                    $label = $documentName;
                }

                $checksum = md5($documentContents);
                $size = strlen($documentContents);

                $label = strtr($label, ['_' => ' ']);

                $dataOut[$area][$documentName] = [
                    'document_name' => $documentName,
                    'label' => $label,
                    'area' => $area,
                    'checksum' => $checksum,
                    'size' => $size
                ];
            }
        }

        return $dataOut;
    }

    /**
     * Returns all wanted documents in one big array
     *
     * Provide a list with documents you want. The list format is the same as get_documents_list provide.
     * You have asked get_documents_list, got the list and figured out what documents you have that you can
     * keep (same checksum), delete (not in list). Left are the ones that are new and changed ( different checksum).
     *
     * You can now send the wanted_documents_list to get_all_documents and get the documents.
     * If the size of the documents is more than he config allows then you only get just below the limit.
     * The rest of the wanted_documents_list are returned to you, and you can try again.
     *
     * @param array $in
     * @return array
     * @author  Peter Lembke
     * @version 2022-06-05
     * @since   2018-10-23
     */
    protected function get_all_documents(array $in = []): array
    {
        $default = [
            'wanted_documents_list' => [],
            'config' => [
                'get_all_documents_max_size_kb' => 0
            ]
        ];
        $in = $this->_Default($default, $in);

        $maxSize = $in['config']['get_all_documents_max_size_kb'] * 1024;
        $totalSize = 0;
        $fileExtension = $this->_GetFileExtension();
        $dataOut = [];
        $askAgainDocumentsList = [];
        $failedToLoadDocumentsList = [];

        foreach ($in['wanted_documents_list'] as $area => $documentNamesArray) {
            foreach ($documentNamesArray as $documentName) {

                $response = $this->internal_Cmd([
                    'func' => 'GetDocument',
                    'area' => $area,
                    'document_name' => $documentName,
                    'file_extension' => $fileExtension
                ]);

                if ($response['answer'] === 'false') {
                    $failedToLoadDocumentsList[$area] = $failedToLoadDocumentsList[$area] ?? [];
                    $failedToLoadDocumentsList[$area][] = $documentName;
                    continue;
                }

                $size = $response['data']['document_size'];
                if ($totalSize + $size > $maxSize) {
                    $askAgainDocumentsList[$area] = $askAgainDocumentsList[$area] ?? [];
                    $askAgainDocumentsList[$area][] = $documentName;
                    continue;
                }

                $path = 'infohub_doc/document/' . $area . '/' . $documentName;
                $dataOut[$path] = $response['data'];
            }
        }

        return [
            'answer' => 'true',
            'message' => 'Here are all doc files. Ready to be saved locally',
            'data' => $dataOut,
            'ask_again_documents_list' => $askAgainDocumentsList,
            'failed_to_load_documents_list' => $failedToLoadDocumentsList
        ];
    }

    /**
     * Doc file names follow some rules. Here we make sure the name fulfill those rules
     *
     * Converts string to lower case, removes all characters except a-z and 0-9 and underscore.
     * Checks that there are at least one underscore or else returns an empty string
     *
     * @param string $area
     * @param string $name
     * @return string
     * @version 2019-05-30
     * @since   2016-04-02
     * @author  Peter Lembke
     */
    protected function _CleanName(
        string $area = '',
        string $name = ''
    ): string
    {
        if ($area === 'root') {
            return $name;
        }

        $name = strtolower($name);

        // Replace all characters with empty string except a-z 0-9 and underscore _
        $pattern = '/[^a-z0-9_]/';
        $replacement = '';
        $value = preg_replace($pattern, $replacement, $name);
        if (is_null($value) === false) {
            $name = $value;
        }

        // Proper doc names have at least one underscore that divide the string. Example: infohub_doc
        $parts = explode($find = '_', $name);

        foreach ($parts as $part) {
            if (strlen($part) === 0) {
                $name = '';
                break;
            }
        }

        return $name;
    }

    /**
     * Constructs a path to a file and returns that path to you.
     *
     * @param string $area
     * @param string $name | Name of the document or any other related document file: example: mydomain_myplugin
     * @param string $extension | md or markdown
     * @param string $basePath | any path. example: /var/www/infohub/folder/plugin
     * @return string
     * @author  Peter Lembke
     * @version 2019-05-30
     * @since   2016-04-02
     */
    protected function _GetFileName(
        string $area = '',
        string $name = '',
        string $extension = 'md',
        string $basePath = ''
    ): string
    {
        $okExtensions = ['md', 'markdown', 'css'];
        if (in_array($extension, $okExtensions) === false) {
            return '';
        }

        $fileNamePath = str_replace('_', DS, $name);
        $path = $basePath . DS . $fileNamePath;

        if ($area === 'root') {
            $path = $basePath;
        }

        $fullFilePath = $path . DS . $name . '.' . $extension;

        return $fullFilePath;
    }

    /**
     * I will construct a path and return that path to you.
     *
     * @param string $documentName | Name of the document or any other related document file: example: mydomain_myplugin
     * @param string $imageName
     * @param string $basePath | any path. example: /var/www/infohub/folder/plugin
     * @return string
     * @since   2016-04-02
     * @author  Peter Lembke
     * @version 2019-05-30
     */
    protected function _GetImageFileName(
        string $documentName = '',
        string $imageName = '',
        string $basePath = ''
    ): string
    {
        $isFullPath = strpos($imageName, 'folder/') === 0;
        if ($isFullPath === true) {
            $path = $basePath . DS . $imageName;
        } else {
            $docPath = str_replace('_', DS, $documentName);
            $path = $basePath . DS . $docPath . DS . 'images' . DS . $imageName;
        }

        return $path;
    }

    /**
     * Get the file path to an area.
     *
     * Right now two areas are supported: plugin and main.
     *
     * @param string $area | main or plugin
     * @return string
     * @author  Peter Lembke
     * @version 2019-05-30
     * @since   2016-04-02
     */
    protected function _GetBasePath(
        string $area = 'main'
    ): string
    {
        $basePath = '';

        $validPaths = [
            'plugin' => PLUGINS,
            'main' => DOC,
            'root' => ROOT,
        ];

        if (isset($validPaths[$area]) === true) {
            $basePath = $validPaths[$area];
        }

        return $basePath;
    }

    /**
     * Returns the file contents or an empty string.
     *
     * @param string $file
     * @return string
     * @author  Peter Lembke
     * @version 2019-05-30
     * @since   2016-04-02
     */
    protected function _GetFileContents(
        string $file = ''
    ): string
    {
        if (file_exists($file) === false) {
            return '';
        }

        $fileContents = file_get_contents($file);
        if ($fileContents === false) {
            return '';
        }

        return $fileContents;
    }

    /**
     * Parses the ![My image](rendermajor-1.png) directives in the doc text.
     *
     * When the url do not have any / in it then we embed an image.
     *
     * @param string $text
     * @param string $documentName
     * @param string $area
     * @return string
     * @version 2019-05-30
     * @since   2016-04-02
     * @author  Peter Lembke
     * @uses _ImageHtml
     */
    protected function _HandleImages(
        string $text = '',
        string $documentName = '',
        string $area = ''
    ): string
    {
        $imageNamesArray = $this->_GetAllImageNamesByPath($text, $area);
        $text = $this->_EmbedImages($text, $documentName, $area, $imageNamesArray);
        $imageNamesArray = $this->_GetAllImageNamesByAreaAnddocumentName($area, $documentName);
        $text = $this->_EmbedImages($text, $documentName, $area, $imageNamesArray);

        return $text;
    }

    /**
     * Parses the ![My image](rendermajor-1.png) directives in the doc text.
     *
     * When the url do not have any / in it then we embed an image.
     *
     * @param string $text
     * @param string $documentName
     * @param string $area
     * @param array $imageNamesArray
     * @return string
     * @version 2019-05-30
     * @since   2016-04-02
     * @author  Peter Lembke
     * @uses _ImageHtml
     */
    protected function _EmbedImages(
        string $text = '',
        string $documentName = '',
        string $area = '',
        array $imageNamesArray = []
    ): string
    {
        foreach ($imageNamesArray as $imageName) {
            $find = '(' . $imageName . ')';

            if (str_contains($text, $find) === false) {
                continue;
            }

            $imageBase64Data = $this->_ImageBase64Data([
                'area' => $area,
                'document_name' => $documentName,
                'image_name' => $imageName
            ]);

            $replaceWith = '(' . $imageBase64Data . ')';

            $text = str_replace($find, $replaceWith, $text);
        }

        return $text;
    }

    /**
     * Show an image from the images sub folder.
     *
     * {{command=image|image_name=my_image.png|label=My text under the image|document_name=optional_document_name|area=optional area name}}
     * document_name and area are optional parameters. If omitted then the document document_name and area are used.
     *
     * @param array $in
     * @return string
     * @author  Peter Lembke
     * @version 2019-05-30
     * @since   2016-04-02
     */
    protected function _ImageBase64Data(
        array $in = []
    ): string
    {
        $default = [
            'area' => '',
            'document_name' => '',
            'image_name' => ''
        ];
        $in = $this->_Default($default, $in);

        $basePath = $this->_GetBasePath($in['area']);
        $imageFileName = $this->_GetImageFileName($in['document_name'], $in['image_name'], $basePath);
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
     *
     * @param string $area
     * @param string $fileExtension
     * @return array
     * @version 2019-05-30
     * @since   2016-04-02
     * @author  Peter Lembke
     */
    protected function _GetAlldocumentNamesByArea(
        string $area = 'main',
        string $fileExtension = 'md'
    ): array
    {
        if ($area === 'root') {
            return ['root', 'CHANGELOG', 'LICENSE', 'README', 'TERMS'];
        }

        $basePath = $this->_GetBasePath($area);

        $searchPath = $basePath . DS . '*.' . $fileExtension;
        $filesArray = $this->_RecursiveSearch($searchPath);
        sort($filesArray);

        $documentNamesArray = $this->_GetAlldocumentNames($filesArray, $basePath);

        return $documentNamesArray;
    }

    /**
     * Get array with all image names for a document in an area
     *
     * @param string $area
     * @param string $documentName
     * @return array
     * @version 2019-05-30
     * @since   2016-04-02
     * @author  Peter Lembke
     */
    protected function _GetAllImageNamesByAreaAnddocumentName(
        string $area = 'main',
        string $documentName = ''
    ): array
    {
        $basePath = $this->_GetBasePath($area);
        $pluginPath = str_replace('_', DS, $documentName);

        $searchPath = $basePath . DS . $pluginPath . DS . 'images' . DS . '*';

        $filesArray = $this->_RecursiveSearch($searchPath);
        sort($filesArray);

        $baseNames = [];
        foreach ($filesArray as $filePath) {
            $fileName = pathinfo($filePath, PATHINFO_BASENAME);
            $baseNames[] = $fileName;
        }

        return $baseNames;
    }

    /**
     * Get array with all image paths mentioned in the document
     *
     * @version 2022-06-04
     * @since   2022-06-04
     * @author  Peter Lembke
     * @param string $text
     * @param string $area
     * @return array
     */
    protected function _GetAllImageNamesByPath(
        string $text = '',
        string $area = ''
    ): array
    {
        $findFirst = '![';
        $findSecond = '](';
        $findLast = ')';

        $position = 0;
        $length = strlen($text);

        $baseNames = [];
        while ($position <= $length) {

            $nextPosition = strpos($text, $findFirst, $position);
            if ($nextPosition === false) {
                break;
            }
            $position = $nextPosition + 2;

            $nextPosition = strpos($text, $findSecond, $position);
            if ($nextPosition === false) {
                break;
            }
            $position = $nextPosition + 2;

            $stopPosition = strpos($text, $findLast, $position);
            if ($stopPosition === false) {
                break;
            }
            $path = substr($text, $position, $stopPosition-$position);
            $position = $stopPosition + 1;

            $isURL = strpos($path, '://') !== false;
            if ($isURL === true) {
                continue;
            }
            $baseNames[] = $path;
        }

        return $baseNames;
    }

    /**
     * Find part of a string between the start and stop strings
     *
     * @param string $string
     * @param string $findFirst
     * @param string $findLast
     * @return string
     * @since   2016-04-02
     * @author  Peter Lembke
     * @version 2019-05-30
     */
    protected function _GetPartOfString(
        string $string = '',
        string $findFirst = '',
        string $findLast = ''
    ): string {

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
     *
     * @param array $fileNamesArray
     * @param string $basePath
     * @return array
     * @version 2019-05-30
     * @since   2016-04-02
     * @author  Peter Lembke
     */
    protected function _GetAlldocumentNames(
        array $fileNamesArray = [],
        string $basePath = ''
    ): array {

        $documentNamesArray = [];

        foreach ($fileNamesArray as $fullFileNameWithPath) {
            $fileNameParts = pathinfo($fullFileNameWithPath);

            $fileName = $fileNameParts['filename'];

            if (strtolower($fileName) !== $fileName) {
                continue; // I only accept lower case file names
            }

            $directory = substr($fileNameParts['dirname'], strlen($basePath) + 1);
            $directory = str_replace('/', '_', $directory);

            if ($directory !== $fileName) {
                continue; // The file name must be in a path with the same name
            }

            $documentNamesArray[] = $fileName;
        }

        return $documentNamesArray;
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
}