# Infohub.php
The Client calls infohub.php on the server and deliver a POST package.  
The difference between index.php and Infohub .php is that index.php is there to initialize the browser Javascript core. infohub.php is there to respond to POST messages.  
index.php have to start a session with the browser. infohub.php expect the session to already be there.  
Both files include the kick out tests where you are expected to fulfill a long list of requirements.  
infohub.php first include some files:   

- [define_folders.php](main,core_root_definefolders)
- [settings_and_errors.php](main,core_include_settingsanderrors)
- [kick_out_tests.php](main,core_include_kickouttests)
- [All core plugins](main,core)

Instantiates [Exchange](plugin,infohub_exchange) and sends the package in a message to function "main".  
If function "main" return an error then it calls GetOut.  

# License
This documentation is copyright (C) 2016 Peter Lembke.  
Permission is granted to copy, distribute and/or modify this document under the terms of the GNU Free Documentation License, Version 1.3 or any later version published by the Free Software Foundation; with no Invariant Sections, no Front-Cover Texts, and no Back-Cover Texts.  
You should have received a copy of the GNU Free Documentation License along with this documentation. If not, see [https://www.gnu.org/licenses/](https://www.gnu.org/licenses/).  SPDX-License-Identifier: GFDL-1.3-or-later  

Created 2016-02-13 by Peter Lembke on wiki.infohub.se  
Updated 2017-07-12 by Peter Lembke  
