# Infohub Storage Data
Sends the data to the right storage engine. Keeps track of database connection credentials.  

# Introduction
Infohub Storage call this child plugin. The purpose is to get the connection credentials to the destination Storage.  

## Javascript browser core
The browser only support IndexedDb and that does not need any credentials. The plugin just forward the request to the child.  
    
## PHP Core
infohub_storage_data read the config file in the same folder to get the connection to the table: infohub_storagemanager.  
The path "infohub_storagemanager/connection/{plugin_name}" contain the connection to the plugin_name we want to read/write to.  
Plugin: [Infohub_Storagemanager](plugin,infohub_storagemanager) can delete/write to the configuration file by saving data to path: "infohub_storagemanager/config".  
If a connection to the plugin_name is not found, then we create a table in the same database as infohub_storagemanager reference in the config file and name it "{plugin_name}".  
    
# Path
The path is where you write/read/delete data. Path example: "{plugin_name}/what/ever/you/like"  
The plugin name in the path and the plugin that request the data from the path must be identical.  
Then path is converted to a checksum before it is used as a key in the database  

# Write data
infohub_storage_encrypt will encrypt your data and then the data will be written to the path. If you look at the written data in the database you see the path and a long encrypted string.  

## Write data example
In this example we assume there are no current data in the database. This is our first write to the path.  
    
    $out = array(
        'to' => array(
            'node' => 'server',
            'plugin' => 'infohub_storage',
            'function' => 'write'
        ),
        'data' => array(
            'path' => 'infohub_demo/mydata',
            'data' => array(
                'name' => 'Adam',
                'area' => 'Åre',
                'a_number' => 4,
                'another_string' => 'More data',
                'post_number' => 11110
            )
        ),
        'data_back' => array(
            'step' => 'response_step'
        )
    );

# Delete data
Give the path to the data you want to delete. Send empty data. It will delete the post. It will not touch any child posts.  

    $out = array(
        'to' => array(
            'node' => 'server',
            'plugin' => 'infohub_storage',
            'function' => 'write'
        ),
        'data' => array(
            'path' => 'teamfakta_training/exercise/2017-07-20',
            'data' => array()
        ),
        'data_back' => array(
            'step' => 'response_step'
        )
    );

# Read data
The path will be read and the data will be decrypted. The data array will be delivered to you.  

    $out = array(
        'to' => array(
            'node' => 'server',
            'plugin' => 'infohub_storage',
            'function' => 'read'
        ),
        'data' => array(
            'path' => 'teamfakta_training/exercise/2017-07-20'
        ),
        'data_back' => array(
            'step' => 'response_step'
        )
    );

The data you get back looks like this  

# Search data
See the separate document about [Storage Search](plugin,infohub_storage_search)  

# Low level storage
The storage engine get a path and a data string to save. Then it must figure out if something need to be created, like database or table.  
The index engine get a path and a flat array with keys-checksums to store in the index. Then it updates the index.  

# License
This documentation is copyright (C) 2016 Peter Lembke.  
Permission is granted to copy, distribute and/or modify this document under the terms of the GNU Free Documentation License, Version 1.3 or any later version published by the Free Software Foundation; with no Invariant Sections, no Front-Cover Texts, and no Back-Cover Texts.  
You should have received a copy of the GNU Free Documentation License along with this documentation. If not, see [https://www.gnu.org/licenses/](https://www.gnu.org/licenses/).  SPDX-License-Identifier: GFDL-1.3-or-later  

Created 2016-08-14 by Peter Lembke  
Updated 2017-07-24 by Peter Lembke  
