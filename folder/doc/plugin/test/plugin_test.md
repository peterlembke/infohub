# Function test
How to test a plugin in Infohub.  

# Introduction
Test driven programming produces testst that can be run automatically to detect if an expected outcome have changed.

Infohub has another approach. The data in and out from a plugin are recorded and stored. If the expected outcome change then you will be notified.

This is possible because infohub uses one array in and one array out. The message structure with steps and return sub calls makes it easy to test the functions.

# Activate testing
Each plugin can have a configuration file in JSON format. The file are read if exist by both PHP and JS and the server och client section are passed to the cmd() function.

* infohub_checksum.js
* infohub_checksum.php
* infohub_checksum.json

In the config file you can add a test section.
```JSON
{
    "server": {
        "log": {
            "calculate_checksum": "The function name you want to log as key. This data string can be left empty",
            "internal_CalculateCrc32": "internal functions can only be logged if they are called with internal_Cmd."
        },
        "test": {
            "calculate_checksum": "" 
        }   
    }
}
```
Now server -> infohub_checksum -> calculate_checksum will have its in and out data compared with stored data.

# Compare data
If in data is missing in storage then in and out are stored.
If out data is missing but in data exist then out are stored.
If in and out data exist in storage then out data are compared.
If out data are different then you are notified.

You just delete data that is not accurate any more.  

# Store data
When a function have run then cmd() has both in and out data. 
cmd() has the config and know if you want to test the function.
If you want to test the function then in and out are sent in a message without a tail to infohub_test.

Infohub_test will check if there are data to compare with. If no data then store the data. If data exist then compare.

# Notify
If data is different from expected then that is written to the log.

# License
This documentation is copyright (C) 2020 Peter Lembke.  
Permission is granted to copy, distribute and/or modify this document under the terms of the GNU Free Documentation License, Version 1.3 or any later version published by the Free Software Foundation; with no Invariant Sections, no Front-Cover Texts, and no Back-Cover Texts.  
You should have received a copy of the GNU Free Documentation License along with this documentation. If not, see [https://www.gnu.org/licenses/](https://www.gnu.org/licenses/).  SPDX-License-Identifier: GFDL-1.3-or-later  

Created 2020-04-15 by Peter Lembke  
Updated 2020-04-15 by Peter Lembke  
