# Requirements
InfoHub only require a web server that run PHP 8 and some database connection.
The requirements for InfoHub are similar to other platforms like [Grav](https://learn.getgrav.org/17/basics/requirements), [WordPress](https://wordpress.org/about/requirements/), [Joomla! 4](https://downloads.joomla.org/technical-requirements) 

## Browsers supported
Minimum browsers that InfoHub (JavaScript) aim to support are the [latest version](https://browsehappy.com/) of:  
- Desktop Windows: Brave, FireFox
- Desktop Ubuntu: Brave, Firefox
- Desktop macOS: Safari, Brave, Firefox
- Apple Phone/Tablet (IOS): Safari
- Android Phone/Tablet: Chrome
- Chrome OS: Chrome
That is many combinations of browser and operating system.

Note that on IOS you have Safari. All other browsers on IOS is based on Safari.

Note that on Android you have Chrome. All other browsers on Android is based on Chrome.

Browsers like Chrome, Opera, Brave and Edge are based on Chromium so those browsers are likely to work.

You can read more about [browser engines here](https://en.wikipedia.org/wiki/Comparison_of_browser_engines).

## Web browser add-ons supported
Some web pages just stop working when you use security software.  
InfoHub is built, with and recommends that you have security software turned on.

* DuckDuckGo Privacy Essentials
* Privacy Badger
* Mullvad Privacy Companion
* HTTPS Everywhere
* uBlock Origin
* Cookie AutoDelete

This is possible because InfoHub do not depend on 3rd party services on the client. All data goes only to the server. 
  
## Web servers supported
Web servers that InfoHub (PHP) aim to run on. Latest or most used version of:  
- Apache (Developed on latest Ubuntu) because it is commonly used and good.
- Nginx (Tested on latest Ubuntu) because it is the main competitor and fast.

## Databases supported
If you use log in then you need a supported database server like MariaDb / MySQL / SQlite3 / Redis / PostgreSQL.

## PHP extension requirements
See [composer.json](/composer.json) for a list of additions required to run InfoHub.  

## Varnish
Cache solutions / web accelerators have no effect on web services like InfoHub. 
There is no point or even harmful to install Varnish.  

## Hardware that host InfoHub
Since you can run a LAMP on Windows, macOS, Linux then you can also host InfoHub on these systems.

## Hardware that consume InfoHub
You can use InfoHub on any supported browser. My reference platform is an iPhone SE 2016 with a 4" screen. InfoHub works well on my old Chromebook, modern Linux, macOS, and Windows. I have tested InfoHub OK on older Android.
I have tested with 4" screens (iPhone), iPad, Android 10" pads. In portrait mode and landscape mode. 
HD screen 1920*1080 up to UHD screens (Linux) and it scales good.

Created 2020-07-22 by Peter Lembke  
Changed 2021-12-30 by Peter Lembke  
