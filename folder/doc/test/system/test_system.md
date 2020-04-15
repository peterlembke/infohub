# System test
NOT PART OF THE AUTOMATED TESTS This is just an idea.  
By adding system information to the tst result then we know what system specifications the tests were run on.  
This is useful when we need to find incompatibilities between systems.  

# What system data to fetch
- system_checksum (Javascript plugin that runs in the browser)
    - browser_name
    - browser_version
    - browser_language
    - languages_preferred
    - language_preferred
    - user_agent
    - timestamp_added
    - timestamp_obsolete (Timestamp + 2 years)
    - checksum = md5(browser_name + browser_version)
- system_checksum (PHP plugin that runs on the server)
    - os_name
    - os_version
    - webserver_name
    - webserver_version
    - php_version
    - timestamp_added
    - timestamp_obsolete (Timestamp + 2 years)
    - checksum = md5(webserver_version + php_version)

# License
This documentation is copyright (C) 2016 Peter Lembke.  
Permission is granted to copy, distribute and/or modify this document under the terms of the GNU Free Documentation License, Version 1.3 or any later version published by the Free Software Foundation; with no Invariant Sections, no Front-Cover Texts, and no Back-Cover Texts.  
You should have received a copy of the GNU Free Documentation License along with this documentation. If not, see [https://www.gnu.org/licenses/](https://www.gnu.org/licenses/).  SPDX-License-Identifier: GFDL-1.3-or-later  

Created 2016-02-13 by Peter Lembke in wiki.infohub.se  
Updated 2017-07-12 by Peter Lembke  
