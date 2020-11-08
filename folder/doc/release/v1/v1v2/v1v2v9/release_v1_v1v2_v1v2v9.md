# [1.2.9] - 2020-03-10
Main focus in this release was to spice up the icons and to separate the timer from the advanced Transfer plugin. I have done that.

* [Release notes](main,release_v1_v1v2_v1v2v9)
* [Github release notes](https://github.com/peterlembke/infohub/releases/tag/v1.2.9)

## Added
- the_go_function.js - added use_strict
- infohub/configlocal - New icon
- infohub/contact - Several new icons and icons on buttons
- infohub/debug - Several new icons. Spiced up the GUI
- infohub/demo - New icon
- infohub/demo/markdown - Added icons 
- infohub/demo/form2 - Now returns the form_data
- infohub/demo/timer - Added test for advanced timer
- infohub/timer - Added advanced timer + doc
- infohub/doc - Added icons to index and navigate. Added author to icon.json
- infohub/keyboard - Added new icon. Renamed old one.
- infohub/launcher - A lot of new icons.
- infohub/login - New icons used on buttons.
- infohub/translate - New icon
- infohub/render - Added where/throw_error_if_box_is_missing = 'true'. You can set this to supress errors when a box is missing. Used in the "Help" button.
- infohub/renderform - Buttons can now have a left side static icon

## Changed
- infohub/democall - Updated the icon.json with author
- infohub/launcher - Improved translations.
- infohub/login - Improved translations.
- infohub/offline - Updated the icon meta data
- infohub/tools - New background with my tools on it
- infohub/welcome - New background with the i. on it
- infohub_render_common.js - Now SVG do not interfere with each others IDs.
- infohub_render_form.js - The file selector now has a proper label and is centered.
- infohub/view - box_data got support for throw_error_if_box_is_missing.
- infohub/view - box_data got support for box_found.
- infohub/view - internal_SetStyle - Added tests to avoid errors in the box is not found.

## Removed

## Fixed
- infohub/demo/markdown - Fixed bug with file selector 
- infohub/view - Setting textarea data in proper way now 
