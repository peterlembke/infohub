# [1.2.8] - 2020-03-01
Main focus in this release was to finish the login and sessions but I got side tracked and fixed a lot of other things. Speed optimization, bug fixes and a timer + demo.

* [Release notes](main,release_v1_v1v2_v1v2v8)
* [Github release notes](https://github.com/peterlembke/infohub/releases/tag/v1.2.8)

## Added
- Infohub_Base.js got a new function _Full()
- Infohub_Timer.js - New plugin to handel timers
- Infohub_Demo_Timer.js - Plugin to show the new timer plugin.
- Infohub_Demo_Menu.js - Menu option added for Timer.
- infohub_view.js - New function "set_style" can set a style on any element.

## Changed
Tested xdebug profiler in PHP Storm. Got some valuable insights.

- Infohub_Base.php - Cmd(), quicker check if function can be called.
- Infohub_Base.php - Cmd(), Use of debug_backtrace() much faster now.
- infohub_file.php - Speed improvements.

## Removed

## Fixed
- infohub_launcher.js - A padding caused Sony Z3+ to display the icons hooked in each other.
- infohub_plugin.php - Check of valid licenses had a bug.
- infohub_storage_data_file/mysql/pgsql/sqlite.php - All got the same speed improvement.
