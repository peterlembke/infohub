# define folders.php
The file define_folders.php is a central place where file paths are defined.  

# File contents
```
< ?PHP
    if (file_exists('fullstop.flag') == true) {
    exit('The site have gone into a full stop.');
    }
    define('DS', DIRECTORY_SEPARATOR);
    define('MAIN', 'folder');
    define('INCLUDES', MAIN .DS. 'include');
    define('PLUGINS', MAIN .DS. 'plugins');
    define('LOG', MAIN .DS. 'log');
    define('DB', MAIN .DS. 'db');
    define('LOCALSTORAGE', MAIN .DS. 'localstorage');
    define('DB_FILE', LOCALSTORAGE . DS . 'infohub_storage.json');
    define('SESSION', MAIN . DS . 'session');
```

# Explanation
- <b>DS</b> = \ on windows machines, / on *nix machines. This is a PHP feature.
- <b>MAIN</b> = the folder, there is only one folder in the root.
- <b>PLUGINS</b> = Here are the plugn files and plugin support files. On a production server this path is empty and all your plugins are in the database.
- <b>LOG</b> = Path to where log files are stored. Log files can be automatically truncated and deleted by InfoHub.
- <b>DB</b> = Place where SQLite databases are stored. They are file based. On a production server you usually do not use SQLite.
- <b>LOCALSTORAGE</b> = Cache files are here. Used only on the server. THe client instead use the localStorage feature.
- <b>DB_FILE</b> = Full path and file name to the json where your data connection credentials are stored. All other config should be stored in the databases.
- <b>SESSION</b> = Where session files are stored.

# License
This documentation is copyright (C) 2016 Peter Lembke.  
Permission is granted to copy, distribute and/or modify this document under the terms of the GNU Free Documentation License, Version 1.3 or any later version published by the Free Software Foundation; with no Invariant Sections, no Front-Cover Texts, and no Back-Cover Texts.  
You should have received a copy of the GNU Free Documentation License along with this documentation. If not, see [https://www.gnu.org/licenses/](https://www.gnu.org/licenses/).  

Created 2016-02-13 by Peter Lembke on wiki.infohub.se  
Updated 2017-07-12 by Peter Lembke  
