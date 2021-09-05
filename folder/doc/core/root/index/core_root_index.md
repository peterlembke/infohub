# Index.php
index.php are the first file you reach when you surf to the site.  

# Features
- <b>Web crawlers</b>, are instructed that this site is pointless to index.
- <b>no JavaScript</b>, shows a message if you disabled javascript.

# Meta tags
The meta tags are used for different things. They are found in index.php at the top.
```
<meta charset="UTF-8">
<meta name="robots" content="noindex,nofollow,noarchive,nocache,nosnippet,notranslate" />
<meta name="viewport" content="initial-scale=1.0, width=device-width" />
<meta name="description" content="InfoHub - Transform your web-server to store generic data." />
<meta name="keywords" content="InfoHub" />
<meta name="apple-mobile-web-app-capable" content="yes" />
<meta name="apple-mobile-web-app-status-bar-style" content="black">
<meta name="apple-mobile-web-app-title" content="Infohub">
<meta name="allowed-outgoing-urls" content="origin">
```
## charset
UTF-8 is the standard character set.
Read more about [UTF-8](https://en.wikipedia.org/wiki/UTF-8)

## robots
I do not want any robots to crawl the site. These commands are recommendation that the crawler might follow.
Read more here about [robots](https://yoast.com/robots-meta-tags/)
 
The robots meta tag is here **instead of** a robots.txt file. Remember that we want as few public files as possible,

## viewport
The content adapt to the device you view the page on.
initial-scale=1.0 
width=device-width
Read more about [viewport](https://www.w3schools.com/css/css_rwd_viewport.asp)

## description and keywords
No one will read this but it is here anyhow. It is good for the indexers (crawlers) and we do not want them.

## apple-mobile-web-app
The three meta tags help showing the app better on Apple IOS.

## allowed-outgoing-urls
This meta tag do not exist. I just wish it did. The thought would be to limit all outgoing requests to the urls mentioned in this tag.
The "origin" mean that the browser can contact the same origin.

Then comma separate more urls if you need. For Infohub I only want to communicate with the server.

The closest thing to a limit I have found is [this](https://developer.mozilla.org/en-US/docs/Mozilla/Tech/XPCOM/Setting_HTTP_request_headers) and [this](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Intercept_HTTP_requests) but that is for Firefox only and for browser apps only.

# Links
The links have content and that is embedded into the index.php file so we do not have more requests to the server.
```
<link rel="stylesheet" type="text/css" id="infohub_global" href="data:text/css;base64,<?php echo base64_encode(file_get_contents(INCLUDES . '/infohub_global.css')); ?>">
<link rel="shortcut icon" id="favicon" href="data:image/png;base64,<?php echo base64_encode(file_get_contents(MAIN . '/favicon.png')); ?>" />
<link rel="apple-touch-icon" href="data:image/png;base64,<?php echo base64_encode(file_get_contents(MAIN . '/infohub.png')); ?>">
<link rel="manifest" href="manifest.json">
```

## Stylesheet
This is the only global css file. The work is to decrease this file until it does not exist any more.
I will add nothing more to this file.

## Shortcut icon (Favicon)
The favicon

## apple-touch-icon
A larger icon for Infohub

## manifest
With the manifest you can put Infohub as a start icon to your Android/Apple phone/pad.

# PHP files included
These files are included and run on the server before you even get the page.  

- [define_folders.php](main,core_root_definefolders)
- [settings_and_errors.php](main,core_include_settingsanderrors)
- [kick_out_tests.php](main,core_include_kickouttests)


# JavaScripts embedded in page
The Javascripts used in index.php are embedded into the page with PHP to avoid requests to the server.  

- [error_handler_and_frame_breakout.js](main,core_include_errorhandler) - Shows a popup on errors. Breaks out of iFrames.
- [the_go_function.js](main,core_include_thegofunction) - incoming event use this function to send a package to [Exchange](plugin,infohub_exchange) through an event that Exchange listen on.
- [sanity_check.js](main,core_include_sanitycheck) - Every 5 second it checks if the DOM have references to external content and then warns.
- [start.js](main,core_include_start) - starts up the core plugins and sends the first message.

# Changes
index.php are cached locally with the help of the Cache.manifest. If you do any change to index.php or any of the embedded javascript files, then you need to update the version comment in the Cache.manifest or else the client will continue to use the old cached index.php.  
I will NOT create a system that changes the Cache.manifest if the files changes. You have to change the file yourself, then you have the best control of what is happening.  

# Viewport

old setting
```
<meta name="viewport" content="maximum-scale=1 minimum-scale=1.0, initial-scale=1.0, width=device-width, user-scalable=no" />
```
new setting
```
<meta name="viewport" content="initial-scale=1.0, width=device-width" />
```

https://stackoverflow.com/questions/22946264/setting-a-minimum-width-to-fit-on-responsive-website

# License
This documentation is copyright (C) 2016 Peter Lembke.  
Permission is granted to copy, distribute and/or modify this document under the terms of the GNU Free Documentation License, Version 1.3 or any later version published by the Free Software Foundation; with no Invariant Sections, no Front-Cover Texts, and no Back-Cover Texts.  
You should have received a copy of the GNU Free Documentation License along with this documentation. If not, see [https://www.gnu.org/licenses/](https://www.gnu.org/licenses/).  SPDX-License-Identifier: GFDL-1.3-or-later  

Created 2016-02-13 by Peter Lembke on wiki.infohub.se  
Updated 2017-07-12 by Peter Lembke  
