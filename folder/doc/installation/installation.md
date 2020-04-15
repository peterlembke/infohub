# Installation
How to install Infohub on your server

# requirements
InfoHub only require a web server that run PHP 7.1 or later, and one of the new browsers.

## Browsers supported
Minimum browsers that InfoHub (JavaScript) aim to support are latest version of:  
- Desktop (MacOS, Ubuntu, Windows), FireFox, Chrome
- Apple Phone/Tablet (IOS): Safari
- Android Phone/Tablet: Chrome
- Chrome OS: Chrome
That is 12 combinations of browser and operating system.

Note that on IOS you have Safari. All other browsers on IOS is based on Safari.
Note that on Android you have Chrome. All other browsers on Android is based on Chrome.
Browsers like Opera, Brave and Edge are based on Chromium so those browsers are likely to work.

You can read more about [browser engines here](https://en.wikipedia.org/wiki/Comparison_of_browser_engines).
  
  
## Web servers supported
Web servers that InfoHub (PHP) aim to run on. Latest or most used version of:  
- Apache (Developed on latest Ubuntu) because it is commonly used and good.
- Nginx (Tested on latest Ubuntu) because it is the main competitor and fast.

# Installation
- Get the files
  - Download the installation package and unpack it into your www root
  - Or clone the files from the repository.
- Make sure your web server can read and write to folder "folder/"

# Development
When you develop for Infohub you can try the docker setup in folder /dox  
See the README for details.

# Extras
Later when you need a storage solution you can have a look at [Infohub Storage](plugin,infohub_storage)  
Cache solutions / web accelerators have no effect on web services like Infohub. There is no point or even harmful to install Varnish.  

# License
This documentation is copyright (C) 2016 Peter Lembke.  
Permission is granted to copy, distribute and/or modify this document under the terms of the GNU Free Documentation License, Version 1.3 or any later version published by the Free Software Foundation; with no Invariant Sections, no Front-Cover Texts, and no Back-Cover Texts.  
You should have received a copy of the GNU Free Documentation License along with this documentation. If not, see [https://www.gnu.org/licenses/](https://www.gnu.org/licenses/).  SPDX-License-Identifier: GFDL-1.3-or-later  

Created 2016-04-02 by Peter Lembke  
Changed 2019-07-12 by Peter Lembke  
