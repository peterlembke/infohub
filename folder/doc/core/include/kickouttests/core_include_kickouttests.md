# Kick out tests.php
The "kick out tests" are tests that can kick you out and give you ban time if you fail any of them.  
These tests are run after file [settings_and_errors.php](main,core_include_settingsanderrors) on both [index.php](main,core_root_index) and [infohub.php](main,core_root_infohub).  

# Tests
- Cookies, checks that PHPSESSID are set.
- Ban time, sets it if missing.
- Who started the file and is that ok.
- Query string must be empty
- That you use the right request method.
    - [index.php](main,core_root_index) require GET
    - [infohub.php](main,core_root_infohub) require POST
- On [infohub.php](main,core_root_infohub) checks the POST parameter
    - That it is "package"
    - Right contents and size. Not logged in max 1K. Logged in max 1M.
- If you run on localhost then accept xdebug cookies too.
- Deletes all unwanted cookies.
- Deletes files and folders that are not on the accepted list.
- Every request give 1 sec ban
- If you fail one test when you requested:
    - index.php, then you get a big HTML error message
    - infohub.php, then you get an error package

# License
This documentation is copyright (C) 2016 Peter Lembke.  
Permission is granted to copy, distribute and/or modify this document under the terms of the GNU Free Documentation License, Version 1.3 or any later version published by the Free Software Foundation; with no Invariant Sections, no Front-Cover Texts, and no Back-Cover Texts.  
You should have received a copy of the GNU Free Documentation License along with this documentation. If not, see [https://www.gnu.org/licenses/](https://www.gnu.org/licenses/).  SPDX-License-Identifier: GFDL-1.3-or-later  

Created 2016-02-13 by Peter Lembke on wiki.infohub.se  
Updated 2017-07-12 by Peter Lembke  


