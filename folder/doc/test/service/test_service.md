# The test service
The test service is a REST service written in PHP that will test your InfoHub plugin with the help from test data from a JSON file. If tests are missing then the service will create the missing tests for you and stores them in the json test file.  

# Design rules
* Written in PHP
* REST interface that return JSON
* Self sufficient, (No dependencies)
* debug in PHP Storm
* Will test InfoHub PHP plugins
* JSON test data in one file for each plugin
* Crash secure

# Divide the service into classes
  
    
## infohub_test_gatekeeper</h2>
Handles the access to the service and returns the data   

* check_password - Loads the config if exist, checks the password, stores the default config if needed.
* internal_GetConfig - Loads the config file and sets default password if needed.
* get_arguments - Get all GET and POST arguments into an array and also store internally
* internal_SaveConfig - Save config to json file
* output - Get the pretty JSON output that later will be passed to the screen
    
## infohub_test_plugin</h2>
Give you a list of plugin names with data, grouped by node type (js, php)   

* get_type_list - You get the type_list with plugin tyupes and their node names
* get_plugin_list - You get the plugin_list with names of all the plugins and each name is an array with a lot of plugin data.
* get_plugin_data - Get details from the plugin_list for a specific plugin.
* internal_ReadCategory - You get the file_list with data about all files found in the plugin folder
* `_getFiles` - Recursive function (calls itself) until it gets all files in the plugin folder
    
## infohub_test_plugin_js</h2>
* get_plugin_code - Return the source code for a JS class
* internal_GetPluginPath -
    
## infohub_test_plugin_php</h2>
- run_tests
    - Starts the plugin you want to test, get its function names, updates the test data,
    - If test_name = * then loop trough all test_data functions and pull out each test collection
    - If you have a function name the pull out its test collection
    - Send the test collection to internal_TestOneFunction</ul>
- internal_UpdateTestData - Add bare bone test data for those functions that do not have
    - Next time the tests are run then default values will be used and default answer will be recorded.
- internal_GetDefaultTestData - 
- internal_SortFunctionList - Give you a plain list with test results that are sorted by type and name
- internal_TestOneFunction - Run the test collection on one function
- internal_RunOneTest - Run one test from the test collection on one function
    
## infohub_test_data</h2>
- get_test_data - Get the test data for the plugin
- internal_SortFunctionList - Give you a plain list with test results that are sorted by type and name
- get_test_report - Analyze the test result with the expected outcome and present a report
- internal_Compare - Compare the outcome from one test with the expected answer
- internal_BasicCompare - Makes a simple comparison between two values
    - @example internal_BasicCompare(10,array('&lt;', 15))
    - internal_SaveFile - Store the test data as a nice looking JSON file

# Test.php
This is the actual test service. Give it GET and POST parameters and you will get a result back as a json. This file will use the plugins above and will autoload them when needed.  
run() - Convenience function for calling plugin functions and returning the data wanted.  

# License
This documentation is copyright (C) 2016 Peter Lembke.  
Permission is granted to copy, distribute and/or modify this document under the terms of the GNU Free Documentation License, Version 1.3 or any later version published by the Free Software Foundation; with no Invariant Sections, no Front-Cover Texts, and no Back-Cover Texts.  
You should have received a copy of the GNU Free Documentation License along with this documentation. If not, see [https://www.gnu.org/licenses/](https://www.gnu.org/licenses/).  SPDX-License-Identifier: GFDL-1.3-or-later  

Created 2017-07-12 by Peter Lembke  
Updated 2017-07-12 by Peter Lembke  
