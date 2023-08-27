# InfoHub Storage Data

Sends the data to the right storage engine. Keeps track of database connection credentials.

# Introduction

InfoHub Storage call this child plugin. The purpose is to get the connection credentials to the destination Storage.

## Javascript browser core

The browser only support IndexedDb and that does not need any credentials. The plugin just forward the request to the
child.

## PHP Core

infohub_storage_data read the config file in the same folder to get the connection to the table:
infohub_storagemanager.  
The path "infohub_storagemanager/connection/{plugin_name}" contain the connection to the plugin_name we want to
read/write to.  
Plugin: [InfoHub_Storagemanager](plugin,infohub_storagemanager) can delete/write to the configuration file by saving
data to path: "infohub_storagemanager/config".  
If a connection to the plugin_name is not found, then we create a table in the same database as infohub_storagemanager
reference in the config file and name it "{plugin_name}".

# Config

In file infohub_storage_data.json you have the database connections to the main database for the client and for the server.

``` 
"plugin_name_handler": "infohub_storage_data_sqlite", // Name of the storage child plugin that can handle this connection
"plugin_name_owner": "", // Level 1 Plugin name that own the data
"used_for": "all", // Plugin names this main connection is used for
"not_used_for": "", // Plugin names this main connection is not used for
"db_type": "sqlite", // One of the supported strings: psql, mysql, sqlite, redis, file, couchdb
"db_host": "127.0.0.1", // If required, IP number or domain name to sql server. Empty for sqlite
"db_port": "3306", // The IP port to the SQL server, or empty for sqlite
"db_user": "infohubuser", // If required, username on sql server or empty for sqlite
"db_password": "infohubpassword", // password for username, or empty for sqlite
"db_name": "main", // name of the database / name of the sqlite file
"path": "infohub_storagemanager\/config" // the path where this connection will be stored
```

## plugin_name_handler
The plugin that manage this specific db_type of database

## plugin_name_owner
The name of the plugin that own this database connection.
The main connection leave this empty, and it will be populated with the calling plugin name.
A test is done that the path starts with the plugin_name_owner.

## used_for and not_used_for
Useful in main connection to avoid an extra call to see if there is a special config for your plugin.

        if ($connect['used_for'] === 'all') {
            if ($connect['not_used_for'] === '') {
                $in['step'] = 'step_read';
            }
        } 

TODO: This logic need to be improved and documented better.

# Path

The path is where you write/read/delete data. Path example: "{plugin_name}/what/ever/you/like"  
The plugin name in the path and the plugin that request the data from the path must be identical.  
Then path is converted to a checksum before it is used as a key in the database

# Write data

Give a path and the data you want to write. The data will be overwritten on the path.

## Write data example

In this example we will create or overwrite data in the database.

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

## Update data example

In this example we update existing data or create a new post if none exist.

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
            ),
            'mode' => 'merge',
        ),
        'data_back' => array(
            'step' => 'response_step'
        )
    );

# Delete data

Give the path to the data you want to delete. Send empty data. It will delete the post. It will not touch any child
posts.

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

You can not search in the data. You have hopefully encrypted the data before you stored it. Encryption is a separate
process and is not part of the Storage plugins. Then you are totally free to use any encryption method you like for your
data.

# Low level storage

The storage engine get a path and a data string to save. Then it must figure out if something need to be created, like
database or table.  
The index engine get a path and a flat array with keys-checksums to store in the index. Then it updates the index.

# License

This documentation is copyright (C) 2016 Peter Lembke.  
Permission is granted to copy, distribute and/or modify this document under the terms of the GNU Free Documentation
License, Version 1.3 or any later version published by the Free Software Foundation; with no Invariant Sections, no
Front-Cover Texts, and no Back-Cover Texts.  
You should have received a copy of the GNU Free Documentation License along with this documentation. If not,
see [https://www.gnu.org/licenses/](https://www.gnu.org/licenses/). SPDX-License-Identifier: GFDL-1.3-or-later

Created 2016-08-14 by Peter Lembke  
Updated 2020-06-19 by Peter Lembke  
