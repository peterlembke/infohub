# [1.2.25] - 2020-12-06

New feature: step_void removes return calls for short tail messages. Removed the use of window.alert and window.navigator in the Javascript plugins. Improved PHPDOC in some JS files. Added welcome message in more languages.

* [Release notes](main,release_v1_v1v2_v1v2v25)
* [Github release notes](https://github.com/peterlembke/infohub/releases/tag/v1.2.25)

## Added
* HUB-1061, JS: find solution to remove use of window.alert
    In infohub_View I added an Alert function.
* HUB-1080, Short tail messages can have step_void to void the return call
    When I send a short tail message I get a return call without a call stack. 
    If I don't want a return call I can now set step = 'step_void'.
* HUB-1081, start_page_text: Add more countries/languages.
    Added cn, de, dk, ee, es, fi, fr,gr, in, is, it, jp, nl, no, pl, pt, ru.
    Already had: es, en, sv.
    Failed to add Pakistan Urdu due to right to left problems when rendering the text.
    I will look into that in task HUB-1082

## Changed
* HUB-1078, Demo - Table - wrong data type
* HUB-1079, demo - dokumenttext åäö. Regression fixed
* HUB-1063, JS: set web worker false on view and similar plugins. 
    Default is web_worker = true and core_plugin = false.

## Removed
* HUB-1058, Base JS: remove use of window.navigator. Because what browser the user has is private.
* HUB-1058, version function in PHP and JS. Removed info about user browser and server versions. 
* HUB-1062, JS: Remove window.alert in infohub_democall plugins
  Now the democall plugin is read to be run in web workers.
* HUB-1069, JS: Remove window.alert in transfer
  Now I handle the Ajax errors correct. Transfer could now be run as a web service.
* HUB-1070, JS: Remove window.alert in launcher
  Solved the flow so that alerts are handled properly. Launcher could now be run as a web service.
* HUB-1068, JS: Remove window.alert in keyboard. Tested the subscription and the alert works.
* HUB-1071, JS: Remove window.alert in rendermenu
* HUB-1072, JS: Remove window.alert in renderform
* HUB-1067, JS: Remove window.alert in render
* HUB-1066, JS: Remove window.alert in the demo plugin
* HUB-1059, JS: Remove window.alert in base cmd()

## Fixed
* HUB-1073, JS: update plugins with PHPDOC: cache, checksum, color, compress, debug.
* HUB-1074, JS: update configLocal with PHPDOC
* HUB-1075, JS: update demo plugin with PHPDOC
* HUB-1064, JS: update contact plugin with PHPDOC

## Tested

## Investigated
* HUB-1077, move internal_Log to View. The thought was to prepare all plugins for web workers.
    But severe errors can not be postponed. I can't just put them on a stack and send then later.
    So I decided to keep the logging as it is. You can develop the plugin outside of web workers
    and when it is stable you can activate web worker (When available later).
    The logging checks if console is available.
    I will probably use postMessage instead when in a web worker.
* HUB-923, Client: Demo, Common objects - Remove iframe.
    Rethinking this. The demo show what will happen if you use an iframe. I kept the iframe code.
    iframe gives a warning on screen and that is normal. iframes should not be used at all, ever.
    Updated the documentation for that demo to describe this.
