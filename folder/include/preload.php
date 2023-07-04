<?php
/**
 * This file preload.php are run once when the web server is started.
 * Compiles all php files into byte code and stores them in opcache.
 * Then the opcache do not need to compile on run time and execution is faster
 *
 * @package     Infohub
 * @subpackage  infohub_exchange
 * @author      Peter Lembke <info@infohub.se>
 * @version     2021-12-23
 * @since       2021-04-11
 * @copyright   Copyright (c) 2021, Peter Lembke
 * @license     https://opensource.org/licenses/gpl-license.php GPL-3.0-or-later
 * @see         https://www.php.net/manual/en/opcache.preloading.php
 * @link        https://infohub.se/ InfoHub main page
 */
class preload {

    /**
     * Start the preloading of all php files into the opcache
     *
     * @return void
     */
    public function run(): void {

        $canCompile = $this->canCompile();
        if ($canCompile === false) {
            return;
        }

        $pathPatternArray = [
            '../*.php',
        ];

        $allFileArray = [];
        foreach ($pathPatternArray as $pattern) {
            $fileNameArray = $this->_RecursiveSearch($pattern);
            $allFileArray = array_merge($allFileArray, $fileNameArray);
        }

        $allFileArray = array_unique($allFileArray);

        foreach ($allFileArray as $pathAndFileNameString) {
            if ($this->okToCompile($pathAndFileNameString) === false) {
                continue;
            }
            $result = opcache_compile_file($pathAndFileNameString);
        }
    }

    /**
     * Determine if we can compile a php file into the opcache or not
     *
     * @return bool
     */
    protected function canCompile(): bool
    {
        $functionExists = function_exists(
            function: 'opcache_compile_file'
        );

        return $functionExists;
    }

    /**
     * Give a path and pattern. Get an array with all paths and file names recursively.
     *
     * @see https://thephpeffect.com/recursive-glob-vs-recursive-directory-iterator/
     * @param  string  $pattern
     * @param  int  $flags
     * @return array
     * @version 2021-12-23
     * @since   2017-11-05
     * @author  Peter Lembke
     */
    protected function _RecursiveSearch(
        string $pattern = '',
        int $flags = 0
    ): array
    {
        $fileArray = glob($pattern, $flags);
        if ($fileArray === false) {
            $fileArray = [];
        }

        $fullPattern = dirname($pattern) . '/*';

        $directoryArray = glob($fullPattern, GLOB_ONLYDIR | GLOB_NOSORT);
        if ($directoryArray === false) {
            $directoryArray = [];
        }

        foreach ($directoryArray as $directoryName) {
            $subPattern = $directoryName . '/' . basename($pattern);
            $subFileArray = $this->_RecursiveSearch($subPattern, $flags);
            $fileArray = array_merge($fileArray, $subFileArray);
        }

        return $fileArray;
    }

    /**
     * Check the file paths you provide if they can be preloaded into the opcache
     *
     * @param  string  $pathAndFileNameString
     * @return bool
     */
    protected function okToCompile(
        string $pathAndFileNameString = ''
    ): bool {
        $fileName = pathinfo($pathAndFileNameString, PATHINFO_FILENAME);
        if ($fileName === 'preload') {
            return false;
        }
        return true;
    }

}

$preload = new preload();
$preload->run();
