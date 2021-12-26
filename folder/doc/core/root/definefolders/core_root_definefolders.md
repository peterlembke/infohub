# define folders.php
The file define_folders.php is a central place where file paths are defined.  

# Constants
- <b>DS</b> = \ on Windows machines, / on *nix machines. This is a PHP feature.
- <b>ROOT</b> = the root folder where all files are in.
- <b>MAIN</b> = the folder, there is only one folder in the root.
- <b>INCLUDES</b> = Files that are inserted in index.php or part of infohub.php.
- <b>PLUGINS</b> = Here are the plugn files and plugin support files. On a production server this path is empty and all your plugins are in the database.
- <b>LOG</b> = Path to where log files are stored. Log files can be automatically truncated and deleted by InfoHub.
- <b>DB</b> = Place where SQLite databases are stored. They are file based. On a production server you usually do not use SQLite.
- <b>DB</b> = SQLite databases are found here.
- <b>DOC</b> = The documentation are found here.
- <b>CONFIG</b> = The config files are found here.

# Folders
Each of these folders are created if they do not exist.
Each of these folders get full read/write rights if they do not have that.

# License
This documentation is copyright (C) 2016 Peter Lembke.  
Permission is granted to copy, distribute and/or modify this document under the terms of the GNU Free Documentation License, Version 1.3 or any later version published by the Free Software Foundation; with no Invariant Sections, no Front-Cover Texts, and no Back-Cover Texts.  
You should have received a copy of the GNU Free Documentation License along with this documentation. If not, see [https://www.gnu.org/licenses/](https://www.gnu.org/licenses/).  SPDX-License-Identifier: GFDL-1.3-or-later  

Created 2016-02-13 by Peter Lembke  
Updated 2020-05-17 by Peter Lembke  
