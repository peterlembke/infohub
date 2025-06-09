# [1.3.40] - 2025-06-08

Translate your plugins with LibreTranslate. This version adds a new feature to the LibreTranslate plugin. You can now translate all elements in all selected plugins and its children to the selected languages.
Bug fixes.

* [Release notes](main,release_v1_v1v3_v1v3v40)
* [GitHub release notes](https://github.com/peterlembke/infohub/releases/tag/v1.3.40)

## Added - New features
* HUB-1753, Added more sizes on the app image to support more devices.
* HUB-1753, Added all new sizes to the manifest.json file + updated the description of the app.
* HUB-1398, Libre translate works. You can now translate text in the app.
* HUB-1756, Libre translate GUI for translating plugins
* HUB-1770, infohub_file - plugin_get_all_plugin_names - provide an optional level 1 plugin name to get its child plugin names
* HUB-1771, infohub_libretranslate - Create plugin translation files. All elements in all selected plugins and its children are now translated to the selected languages.
* HUB-1799, Contact has_password is now preserved when handling the client contact. The client user has always been able to scramble the shared_secret with a password.
* HUB-1802, Contact - client contact list refreshed when rendering page. It was not refreshed by design to save resources, but it is more practical to have it refreshed so that the user can see the list immediately.
* HUB-1803, translation - Override translation files in folder "folder/file/infohub_translate". This is the path where `infohub_translate` saves its new translation files.
* HUB-1803. plugin name changes to get better translations.

## Changed - Changes in existing functionality
* HUB-1753, Updated README with new text and GIF animations.
* HUB-1753, Moved "Applies to the InfoHub terms" away from the README -> license.md file
* HUB-1765, system, Moved public images to a subfolder
* HUB-1783, Translate, _JsonEncode now uses JSON_UNESCAPED_UNICODE to get åäö in the translation files.
* HUB-1789, system, The defined constants in define_folders.php are now declared as constants so that we can use them properly and see usage in PHP Storm.
* HUB-1789, boot, `$kick` and `$package` are now moved out of the class file and ran where they are used in index.php and in infohub.php. This makes referencing the object properties much easier.
* HUB-1790, Login, Now shows a better message when a demo login file is missing
* HUB-1791, Translate, Fixed the swedish åäö characters. It was a faulty json_encode parameter that caused the problem.
* HUB-1792, system, JS: _CheckMessageVoid - Check if it is a message that we can just toss away. Like empty messages or those marked as step_void.
* HUB-1794, Mode demo domains can download a login file. doc.infohub.local, demo.infohub.local, infohub.local
* HUB-1798, Node Contact, export gives pretty file name. Prefix "infohub-contact-". Renamed the demo account files.
* HUB-1800, Node Contact, save and delete now refresh the account list. Slightly slower but way more practical.
* HUB-1806, Translate, saves files in folder/file/infohub_translate/plugin_name/sv.json.
* HUB-1808, Translate, updated all plugins to have Enlish, Spanish, Swedish. All other languages will be in a separate GitHub repository.

## Deprecated - soon-to-be removed features

## Removed - Now removed features
* HUB-1779, removed Infohub LibreTranslate. All functions were transferred to InfoHub Translate.
* HUB-1792, Header document-domain=() removed. Had warning in the console that it was deprecated.

## Fixed - bug fixes
* HUB-1398, Batch messages that returned answer 'false' were not saved. Now they are saved.
* HUB-1398, Changed two places: It said 'step': 'void' but should be 'step': 'step_void'. 
* HUB-1398, system, Changed utf8_encode to mb_convert_encoding to get åäö work in packages.
* HUB-1398, Translate, Documentation in LibreTranslate and in Translate was not rendered in the GUI. Now it is.
* HUB-1398, doc, Images in the documentation were not shown in the GUI if you added a path. Now it works with and without a path.
* HUB-1792, system, JS: Added step_void when calling function: main. Meaning that the return message can be tossed away. That fixed a lot of console bugs.
* HUB-1792, boot, manifest.php did not find the $appData. Now it does.
* HUB-1795, Login, Download demo login file did not work. Now it does.
* HUB-1795, Login, Wrong demo login file selected for the local domains.
* HUB-1796, Login, Fixed the demo login file for the local domains. It was not working because it was not in the right folder.
* HUB-1796, Node Contact, refresh did not work because of wrong id on the contact list. Now it works.
* HUB-1784, Translate, Fixed issue when "." was used in the key.
* HUB-1784, Translate, Fixed the problem with åäö and other none-ascii characters in the translation files. Now they are untouched and not encoded.
* HUB-1805, Translate, Translations were not used inside the plugins.

## Security - in case of vulnerabilities

## Tested
* HUB-1760, Started adding a new feature: reminder. Cron triggers reminder that logs in and sends a trigger message to infohub_reminder
* HUB-1767, Removed all about reminder. I will not implement it. It was a bad idea because InfoHub is not a data processing platform.
* HUB-1801, Tested logout by keyboard http://demo.infohub.local. shift + alt + ctrl + 0. It works as expected. The user is logged out and redirected to the login page.

## Investigated
* HUB-1793, When web-server does not answer, we get a lot of errors. Need to update public_html/serviceworker.js, but I have no good setup for https locally. Web browser does not trust my local cert.