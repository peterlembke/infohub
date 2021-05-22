<?php
/**
 * This file preload.php are run once when the web server is started.
 * Compiles all php files into byte code and stores in opcache.
 * Then the opcache do not need to compile on run time
 *
 * @package     Infohub
 * @subpackage  infohub_exchange
 * @author      Peter Lembke <info@infohub.se>
 * @version     2021-04-11
 * @since       2021-04-11
 * @copyright   Copyright (c) 2021, Peter Lembke
 * @license     https://opensource.org/licenses/gpl-license.php GPL-3.0-or-later
 * @see         https://www.php.net/manual/en/opcache.preloading.php
 * @link        https://infohub.se/ InfoHub main page
 */

class preload {

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
     * Determine if we can compile or not
     * @return bool
     */
    protected function canCompile(): bool {
        return function_exists('opcache_compile_file');
    }

    /**
     * Give a path and pattern. Get an array with all paths and file names recursively.
     * https://thephpeffect.com/recursive-glob-vs-recursive-directory-iterator/
     * @param string $pattern
     * @param int $flags
     * @return array
     * @version 2017-11-05
     * @since   2017-11-05
     * @author  Peter Lembke
     */
    protected function _RecursiveSearch(string $pattern = '', int $flags = 0): array
    {
        $files = glob($pattern, $flags);
        foreach (glob(dirname($pattern) . '/*', GLOB_ONLYDIR | GLOB_NOSORT) as $dir) {
            $files = array_merge($files, $this->_RecursiveSearch($dir . '/' . basename($pattern), $flags));
        }
        return $files;
    }

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
