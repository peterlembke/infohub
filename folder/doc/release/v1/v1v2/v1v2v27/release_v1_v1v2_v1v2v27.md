# [1.2.27] - 2020-12-25

Improved rendering speeds by grouping items that will go to the same renderer.
This change breaks compatability with custom renderers. But since no one is reading this note, no one is using Infohub and certainly no one create their own renderers for Infohub then it does not matter.  

* [Release notes](main,release_v1_v1v2_v1v2v27)
* [GitHub release notes](https://github.com/peterlembke/infohub/releases/tag/v1.2.27)

## Known issues
* infohub_configlocal -> color schema is not done. Will be handled in the next version.

## Added
* HUB-1103, Launcher: Refresh plugin list. On ajax error, show the message
* HUB-1116, infohub_debug, add support for item_index.

## Changed
* HUB-1109, Render: Refactor, simplify, prepare for mass_create
* HUB-1119, Launcher - Button: refresh page, does not work.
    It did work but only if there were any plugins changed on the server. I changed it to always refresh.
* HUB-1112, infohub_color, add support for item_index.
    The links work now. The slow rendering is gone, rendering is now instant. infohub_color GUI do not fully work yet.

## Removed

## Fixed
* HUB-1106, Launcher: Full list do not show
    Caused by a previous feature fix for language. Means that release v1.2.26 do not work.
* HUB-1111, Config CSS - not applied in JS. Config was removed in the renderers. Now I copy the information to the sub renderer. Caused by HUB-1110.
* HUB-1113, Some assets do not show in launcher. Caused by plugin_name that were lost, so the icon could not be found in the database.
* HUB-1114, Language dropdown select not populated with languages. It was the Render -> Create that did not detect a select.
    Also made the infohub_language dropdown renderer working with item_index. 
* HUB-1115, Button progress indicators not showing. Reason infohub_renderform -> button used `$in.alias` as alias. It should have set no alias and let Infohub Render handle the alias.
* HUB-1118, Manual, main, installation - gives error. It was an OK variable that was not set when saving the document to local Storage.
* HUB-1117, Demo - Lists with tabs, gives errors.
  I was using an alias for a part of the tab. Must always let render->create handle that alias. 
  Also fixed render_link, so it now merges css_data. 

## Tested
* HUB-1107, Translate: Check regressions in create english language file. Works as expected.

## Investigated
* Render: investigate mass_create, render many of the same type in one call. Prepare that in HUB-1109
