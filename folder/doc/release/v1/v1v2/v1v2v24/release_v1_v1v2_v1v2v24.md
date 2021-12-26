# [1.2.24] - 2020-11-28

This is a code update release with PHPDOC improvements. Added future flags for web_worker and code_plugin. Slimmer renderers to prepare for web workers. Improved PHP code to be more modern. Removed unnecessary files. Started removing the use of window in JS files to prepare for web workers. Bug fixes. Added on the fly minification of JS files + a config setting to disable it.  

* [Release notes](main,release_v1_v1v2_v1v2v24)
* [GitHub release notes](https://github.com/peterlembke/infohub/releases/tag/v1.2.24)

## Added
HUB-1053, added minify to JS files. Enabled in infohub_plugin.json by default.

## Changed
* HUB-1045, Renderers - slimmer "create" function. First step into parallel rendering with web workers.
* HUB-1045, infohub_render - Refactoring
* HUB-1050, PHPDOC, improved all PHP files with the real PHP Documentator as template
* DoubleMetaphone - Code reformatted and smaller changes for PHP7
* HUB-1055, Added web_worker true(default) /false, core_plugin true/false(default) in version data. Not used yet. I need to remove window from the base class before Web workers can be used. That is another task.

## Removed
* HUB-1050, Removed the word final from the function calls
* HUB-1050, Exchanged all array() to []
* I deleted opcache.php and its sample data because it was not as useful as I hoped, and it did not have proper PHPDOCs.   
* HUB-1057, Base JS: window in _MicroTime(). Removed code for "If in an iframe, mess up the time and get banned, we do not want to be in an iframe". I have a similar code elsewhere.
 
## Fixed
* HUB-1048, infohub_doc_document wrong data type + improved logging in infohub_base for these errors.
* infohub_exchange.php - internal_ToSort() had a bug with conflicting variable names. This bug is not in the JS version.

## Tested

## Investigated
* Investigated SVGZ since I save the assets in the browser Storage but svgz can not be opened directly in any browser. I will continue with SVG optimizations instead. 
* HUB-1056, Base JS: Create tasks to remove usage of window in plugins I want to run in web workers. Created HUB-1057, 1058, 1059, 1060, 1061, 1062.
