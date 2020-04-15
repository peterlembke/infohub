# Test menu
The test menu is a stand alone html/javascript file that give you a graphical interface to the test service and also run tests on javascript plugins.  

# Start the test menu
The url must contain a password, like this: testmenu.php?password=password  
The default password is "password".   

# Dependencies
Today the test menu depend on jQuery mobile for the GUI. That will change and the GUI will in the end only have native JS code.  

# Graphical user interface (GUI)
You will see these options when you have started the test menu.  

- Plugin type - List with plugin types. Select JavaScript or PHP.
- Plugin name - List with Plugin names. Select one plugin.
- Plugin functions - A list with function names in the plugin
    - Select "All" - Will test all functions with all test data in the plugin. Updates all tests with OK/FAIL.
    - Select one function - Will take you to the Function tests.
- Function tests - List with tests available for the selected plugin and function.
    - Select "All" - Run all tests available for this function. Updates all tests with OK/FAIL.
    - Select one test - Run the selected test. Will take you to the test report.
- Test report - Show the details from one test for one function in one plugin.

# OK / FAIL
The status indicator on each row will be updated with OK / FAIL or the number of sub-items that exist.  

# Run JavaScript plugins
JavaScript plugins can not be run on the server. The test service can only return the js plugin code. Then the js plugin are started here in the browser. The tests are ran in the browser and the test result are sent to the service. The test service then compare the outcome and return a test report.  

# License
This documentation is copyright (C) 2016 Peter Lembke.  
Permission is granted to copy, distribute and/or modify this document under the terms of the GNU Free Documentation License, Version 1.3 or any later version published by the Free Software Foundation; with no Invariant Sections, no Front-Cover Texts, and no Back-Cover Texts.  
You should have received a copy of the GNU Free Documentation License along with this documentation. If not, see [https://www.gnu.org/licenses/](https://www.gnu.org/licenses/).  SPDX-License-Identifier: GFDL-1.3-or-later  

Created 2016-02-13 by Peter Lembke on wiki.infohub.se  
Updated 2017-07-12 by Peter Lembke  
