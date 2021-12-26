# [1.3.2] - 2021-12-24

Infohub now require PHP 8. I have stared using PHP8 commands.  
PHPStan code check implemented. Code now pass the level 9 checks.  
Support for LibreTranslate implemented. Will be used for creating translation files.  
Bad ideas; the documentation is now listing a lot of ideas that seem good but do not fit the Infohub security rules.  
The good ideas will come later.

* [Release notes](main,release_v1_v1v3_v1v3v2)
* [GitHub release notes](https://github.com/peterlembke/infohub/releases/tag/v1.3.2)

## Added
* Added more start up logging. Changed minimum logging level from warn to info.
* HUB-1382, infohub_translate.php: Functions for calling LibreTranslate
* HUB-1381, infohub_translate: GUI just like LibreTranslate has
* HUB-1385, infohub_libretranslate - bare-bone plugin
* HUB-1387, infohub_libretranslate - icon and title
* HUB-1386, infohub_libretranslate - Get GUI working. Now it works. But the GUI is not translated yet
* HUB-1391, LibreTranslate: Pick source language
* HUB-1394, LibreTranslate: Remember the language list, so we do not have to query more than once
* HUB-1395, LibreTranslate: Refresh - Remember current selection and set it after refresh
* HUB-1398, Translate: Get all available languages
* HUB-1401, Created Markdown documents with bad ideas
* HUB-1403, PHPStan, added composer.json and added PHPStan for code quality

## Changed
* HUB-1384, Server: Update infohub_call
* HUB-1388, infohub.php: Start more core plugins to speed up execution
* HUB-1393, LibreTranslate: RenderForm now support option select by passing the source_data to the renderer
* HUB-1391, LibreTranslate_Manual: Now has a Configuration for the default from_language, to_language
  * Default setting gives you a conversion from "en" (English) to "sv" (Swedish)
* HUB-1396, Translate: Make it possible to call LibreTranslate before saving a file
* HUB-1405, PHPStan to level 4. Infohub is now valid for PHPStan level 4.
* HUB-1406, PHPStan level 5 OK
* HUB-1407, PHPStan level 6 OK
* HUB-1410, infohub_renderdocument, use the image label to set image left/right
* HUB-1415, PHP8 - Check if PDO transaction is active before trying a commit
* HUB-1408, PHPStan level 7,8,9 OK - fixed a lot of errors and stared using PHP8 commands

## Removed
* HUB-1414, PHPStan strict rules - removed them
 
## Fixed

## Tested

## Investigated
* HUB-1383, Investigate: Infohub server call LibreTranslate web service. I have infohub_call that can do curl requests.
* HUB-1404, Investigate: msgPack, wrote investigation documentation
* 