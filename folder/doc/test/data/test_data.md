# Test-data
The test data is always close to the plugin. The plugin can be stored in a database and then the test data is also stored in the database. During development you usually have the plugin stored as a file, and you also have the test data stored as a file. This document describe the test-data and the test-data file.  

# File name
If the plugin is called infohub_demo.php then the test file is called infohub_demo.php-test.json   

# Structure of the test data
The file contain JSON in a readable pretty format with lines and indention at the right places to make it easier to read.  

- plugin
    - type (php or js)
    - name (Plugin class name = plugin name)
    - version (Example 1.0.0 , from the code)
    - date (Version date, from the code)
    - checksum = md5(plugin_code)
- base
    - type (Always the same type as the plugin)
    - name (Always infohub_base)
    - version (From the code)
    - date (From the code)
    - checksum = md5(plugin_code)
- function_list
    - List with all function names
    - List with all test names for this function, in_checksum is used as a temporary name
        - in (array)
        - in_checksum (again, but here for unity)
        - out (array)
        - out_checksum
- test_data_checksum (Without the result)
- checksum = md5(plugin.checksum + base.checksum + testdata_checksum)

# License
This documentation is copyright (C) 2017 Peter Lembke.  
Permission is granted to copy, distribute and/or modify this document under the terms of the GNU Free Documentation License, Version 1.3 or any later version published by the Free Software Foundation; with no Invariant Sections, no Front-Cover Texts, and no Back-Cover Texts.  
You should have received a copy of the GNU Free Documentation License along with this documentation. If not, see [https://www.gnu.org/licenses/](https://www.gnu.org/licenses/).  

Created 2016-02-13 by Peter Lembke on wiki.infohub.se  
Updated 2017-07-12 by Peter Lembke  
