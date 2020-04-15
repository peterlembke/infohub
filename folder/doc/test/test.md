# Automated tests
An InfoHub plugin get data from an array and give an array back. There are no other sources of input or output. The test system ask the plugin what functions it has and then call each of them. The function use the default values and give back the default answer. The arrays are saved in a test file for each plugin. In a future release I will also save live data to the test system.  
An OK on a test means that the input and the output match the test data. You got the expected result for that test case. The test program do not test the interaction between the plugin & the core & other plugins.   
  
- [Test-data](main,test_data)
- [The test service](main,test_service)
- [Test PHP plugins](main,test_php)
- [Test Javascript plugins](main,test_javascript)
- [Test menu](main,test_menu)
- [System](main,test_system)

# License
This documentation is copyright (C) 2016 Peter Lembke.  
Permission is granted to copy, distribute and/or modify this document under the terms of the GNU Free Documentation License, Version 1.3 or any later version published by the Free Software Foundation; with no Invariant Sections, no Front-Cover Texts, and no Back-Cover Texts.  
You should have received a copy of the GNU Free Documentation License along with this documentation. If not, see [https://www.gnu.org/licenses/](https://www.gnu.org/licenses/).  SPDX-License-Identifier: GFDL-1.3-or-later  

Updated 2016-03-31 by Peter Lembke  
