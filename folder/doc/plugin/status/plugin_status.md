# Function Status
The status on each function in your plugin  

# Introduction
All cmd() functions in your plugin have a status that you set in the function _GetCmdFunctions().  
The cmd function will call `_GetCmdFunctions()` and get information about your cmd-functions. It can look like this:  

```
protected function _GetCmdFunctions() {
    return array(
        'demo1' => 'normal',
        'demo2' => 'normal',
        'demo3' => 'normal',
        'demo4' => 'normal',
        'demo5' => 'normal',
        'demo6' => 'normal',
        'demo_storage' => 'normal',
        'demo_file' => 'normal',
        'demo_test' => 'normal'
    );
}
```

If you call a function that exist but are not registered in `_GetCmdFunctions` then cmd() will not call the function.  

# Statuses
Here is a list with all the statuses that you can use.  

```
$statuses = array(
    'never_existed' => array(
        'status' => 'never_existed',
        'information' => 'Function "{this function}" have never existed in plugin {this plugin}',
        'value' => 0
    ),
    'emerging' => array(
        'status' => 'emerging',
        'information' => 'New feature in {this plugin} that probably will be changed between versions. In the next major version, function "{this function}" will either be normal or removed',
        'value' => 1
    ),
    'normal' => array(
        'status' => 'normal',
        'information' => 'You can use function "{this function}" in plugin {this plugin}. It will work in this major version. It will get bug fixes but will work as normal',
        'value' => 2
    ),
    'deprecated' => array(
        'status' => 'deprecated',
        'information' => 'You can use function "{this function}" in plugin {this plugin} but it will be removed in the next major version',
        'value' => 1
    ),
    'removed' => array(
        'status' => 'removed',
        'information' => 'Function "{this function}" have existed in plugin {this plugin} but became deprecated and have now been removed in this major version',
        'value' => 0
    )
);
```

If you call a function that have "never_existed" then you get this status. It is not a status you set yourself.  
Before you change status on functions you need to read about version numbers here: [version numbers](main,plugin_version).  
See an example about `_GetCmdFunctions` in [infohub_template](plugin,infohub_template)  

# License
This documentation is copyright (C) 2016 Peter Lembke.  
Permission is granted to copy, distribute and/or modify this document under the terms of the GNU Free Documentation License, Version 1.3 or any later version published by the Free Software Foundation; with no Invariant Sections, no Front-Cover Texts, and no Back-Cover Texts.  
You should have received a copy of the GNU Free Documentation License along with this documentation. If not, see [https://www.gnu.org/licenses/](https://www.gnu.org/licenses/).  SPDX-License-Identifier: GFDL-1.3-or-later  

Created 2017-07-10 by Peter Lembke  
Updated 2018-04-07 by Peter Lembke  
