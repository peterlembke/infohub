# [1.3.1] - 2021-09-05

You can now render password boxes with generate passsword, show/hide password. You can render status boxes.
Improved translation tool that validate translation files.
Bug fixes. Performance improvements. All plugins can now have assets. 

Added password to the Tree private secret

* [Release notes](main,release_v1_v1v3_v1v3v1)
* [Github release notes](https://github.com/peterlembke/infohub/releases/tag/v1.3.1)

## Added
* HUB-1284, Validator for password added to infohub_password
* HUB-1280, added form password
* HUB-1286, Tree: Use password form element
* HUB-1285, renderform - added password box with generate icon and switch show password
* HUB-1290, View: Set/Switch Attribute. You can now set DOM element attributes and switch between two values
* HUB-1295, RenderMajor: Set custom CSS on the legend. Now possible to remove the border
* infohub_view -> get_attribute to get values from an element.
* HUB-1312, Render a status box with infohub_renderstatus + demo
* HUB-1279, Login: Add the current full URL to the standalone login page in a folded More-box
* HUB-1330, Infohub_doc: Function to render doc in box id
* HUB-1353, Translate: CreateFile - Add static country_code and country_name. Add language_name in the file
* HUB-1361, infohub_plugin: Add minify_js = false to default config. Makes it easier to debug javascript files in the browser but takes more space
* HUB-1358, Translate: GUI that validate translation files + backend
* HUB-1367, Translate: GUI radios to Download or Save the english translation file when generating translation files
* Added country_name and language_name to the en translation files
* HUB-1368, Translate: Create sv and es files same time as en

## Changed
* HUB-1288, JS Added default function parameter values to many places in the JS code
* HUB-1289, JS Improve _MiniClone. Now slightly faster. Top of my wishlist in JS to have an object clone
* HUB-1286, Tree: Use password form elements for importing and exporting the encryption key
* HUB-1294, Tree: Encryption - Group the export password + export button
* HUB-1293, Tree: Encryption - Group the import password + import button
* HUB-1297, Tree: Encryption: Separate import and export rendering in different boxes on same page
* infohub_renderform -> generate_password now update characters left
* infohub_tree -> Encrypt GUI boxes now render once
* infohub_tree -> Encrypt split GUI boxes in one Export and one Create
* HUB-1316, updated TERMS with regulations for advertisement, usage statistics, automatic bug reporting
* HUB-1317, infohub_plugin, has_assets, now downloads assets for plugins that do not start from workbench if you set the flag. And added documentation.
* HUB-1317, infohub_login, now show icons thanks to has_assets on infohub_renderform
* HUB-1281, infohub_login, separated the single page login and the login menu page. Now possible to expand the pages individually.
* HUB-1287, Login: Use renderForm Password for login and change password
* HUB-1326, Launcher: Bug, RenderMajor head title with icon is on two rows
* HUB-1327, Launcher: Show current URL in More-box
* HUB-1338, Asset: Change to keys and update translations for en, es, sv
* HUB-1337, Launcher: Fix some keys and all translation files
* HUB-1359, PHP: Change some str_replace to strtr. Better syntax and 9% faster according to my tests. Not 4x as in older PHP versions.
* HUB-1336, Translate: UpdatePlugin to use KEYS instead of normal message in _Translate() - created the server part that modify the plugin
* HUB-1362, Translate: Create the english translation file for each selected plugin name. Downloads the finished file.
* HUB-1363, ConfigLocal: Add language "en" as fallback if not already part of the wanted languages
* HUB-1366, Translate: Generate en file. Missing launcher property. Now populated in all new files
* HUB-1367, Translate: Shorten the texts in the plugins to get more but shorter translations
* HUB-1371, All parameters like `[B]`, `[H1]` must be `[b]`, `[h1]`. Change that.
* HUB-1374, Debug: Move SHIFT CTRL ALT out of the translated string

## Removed
* HUB-1335, Translate: Remove deprecated child plugins
* HUB-1372, Translate: Remove `[INFOHUB_LINK]` from Welcome
 
## Fixed
* HUB-1291, Password: Characters left did not update when writing
* HUB-1292, Password: Generate password did not update when password displayed as dots
* infohub_view -> SetVisible "switch" now works even if you have no style set
* HUB-1311, RenderMenu - improved documentation with example and default values
* HUB-1328, Translate: BUG: Documentation do not render
* HUB-1331, Tree: BUG: Documentation do not render
* HUB-1332, Contact: BUG: Documentation do not render
* HUB-1329, Translate: Translations wrong in Swedish, English, Spanish
* HUB-1333, Translate: BUG: Create file did not convert key to text
* HUB-1334, Translate: BUG: Could not load GUI for UpdatePlugin
* HUB-1360, Config: Missing options in default config. Now the "What is this?" page shows during login
* HUB-1352, Asset: BUG: Click asset, get wrong license info
* HUB-1365, Fixed spelling errors in the documentation and PHPDOC
* HUB-1376, Demo_frog: The mistakes does not render a frog. It was a regression in infohub_render from introduction of multi item rendering
* HUB-1375, Demo_text: Move [MY_EXTERNAL_LINK] away from the string. Fix LINE
* HUB-1373, Login_login: SUCCESS_LOGGING_IN does not show the existing translated string
* HUB-1379, Tools: Run test calls. The template_call dropdown list should not have session_id and user_id
* HUB-1380, Translate - Documentation. Missing two buttons.

## Tested
* HUB-1370, Test that all translation changes do not break any plugin. Found issues and registered HUB-1371 to 1380.
* Made a mistake when spelling "mistake". Fixed in all code.

## Investigated
* HUB-1315, Investigate: How and when are assets downloaded. In workbench only.
* HUB-1354, Translate: Investigate why + in keys get spaces. It was Google translate that mess them up. Bing Translate do not do this but only support 1000 characters. Google Translate support 5000 characters. I will need to create a validator for translation files.
* HUB-1378, DemoCall: Client - invalid call from child to parent should fail but works. There are no errors. The logic works.
* 