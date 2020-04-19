# .htaccess
A .htaccess file exist in each folder where we want to restrict access to files and folders. Note that .htaccess works on the Apache web server and it is read on EVERY request you make to the server.  
Apache also have a configuration file that is read once. If you are able to transfer the settings to that config file then do that.  
If you use the web server nginx then .htaccess do not work. Instead use the nginx config files. Guides for this will come in the future since nginx is a supported web server.  
The root file looks like this:  

```
RewriteEngine on
DirectoryIndex index.php
RewriteRule ^folder/test/include/testmenu($|/) - [L]
RewriteRule ^folder/ - [R=404,L,NC]
RewriteRule ^.idea/ - [R=404,L,NC]
RewriteRule ^.hg/ - [R=404,L,NC]
RewriteRule .hgignore - [R=404,L,NC]
# RewriteRule test.php - [R=404,L,NC]
# RewriteRule callback.php - [R=404,L,NC]

## Every existing file, folder and link should be accessible
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteCond %{REQUEST_FILENAME} !-l

### every other url go to callback.php
# RewriteRule .* callback.php [L]
# RewriteRule  ^(.*)$ callback.php?param=$1 [QSA,L]

AddType text/cache-manifest .manifest
```

# .htaccess in general
There are a lot of things you can do with   

# License
This documentation is copyright (C) 2016 Peter Lembke.  
Permission is granted to copy, distribute and/or modify this document under the terms of the GNU Free Documentation License, Version 1.3 or any later version published by the Free Software Foundation; with no Invariant Sections, no Front-Cover Texts, and no Back-Cover Texts.  
You should have received a copy of the GNU Free Documentation License along with this documentation. If not, see [https://www.gnu.org/licenses/](https://www.gnu.org/licenses/).  SPDX-License-Identifier: GFDL-1.3-or-later  

Created 2016-02-15 by Peter Lembke on wiki.infohub.se  
Updated 2017-07-12 by Peter Lembke  
