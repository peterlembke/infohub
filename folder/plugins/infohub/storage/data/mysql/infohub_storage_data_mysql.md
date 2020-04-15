# Infohub Storage Data Mysql
Stores data in a MySQL server  

# Introduction
<a href="https://www.mysql.com/" target="_blank">MySQL</a> is one of the supported database engines that Storage can use.  
MySQL is a server, manages many concurrent connections and heavy load, open source.  

# Installation
 _In Ubuntu_ `sudo apt-get install mysql-server` and then `sudo apt-get install mysql-client`  
 _In MacOS_ `brew install mysql`  
 _In Windows_ See the [MySQL](https://www.mysql.com/) home page`  
 _Docker_ You can run MySQL from a docker container. Read more here [Docker MySQL](https://hub.docker.com/_/mysql/). You can start several containers on the same computer. Each have its own port.  

# MariaDb
MariaDB is a community-developed fork of MySQL intended to remain free under the GNU GPL. MariaDb is a drop in replacement for MySQL. Being led by the original developers of MySQL, who forked it due to concerns over its acquisition by Oracle.  
 _Docker_ You can run MariaDb from a docker container. Read more here [Docker MariaDb](https://hub.docker.com/_/mariadb/). You can start several containers on the same computer. Each have its own port.  

# Setup
You have to set up a user that InfoHub will use to access the database(s)  
Instructions in Swedish: [MySQL för MacOS](https://www.charzam.com/2016/08/02/osx-mysql-databas/).  

# Manage the database
For MySQL you have many options.  
[SequelPro for MacOS](https://www.sequelpro.com/) is free to use.  
[MySQL Workbench](https://www.mysql.com/products/workbench/) for MacOS, Linux, Windows is free to use.  
[Dbeaver](https://dbeaver.jkiss.org/) for MacOS, Linux, Windows is open source (Apache) and support many database engines.  
[phpMyAdmin](https://www.phpmyadmin.net/) runs in the browser. Open source GPL2 license.  
There are many many other database managers out there if the ones above is not sufficient for you.  

# Database structure
You must create the database and set up a user that are allowed to create tables. Then the plugin create the tables.
Each level 1 plugin in Infohub can store data in Infohub Storage and if needed a table is created for each plugin name.  
This means that plugins can not reach each others data.  

# How to use the plugin
There are two public function in this plugin. The plugin itself is intended to be used by infohub_storage_data but you can use it stand alone outside of Infohub.  
infohub_storage_data send this kind of messages and you can do the same. First you need a connection.  

## Connection and path
MySQL require that you have connection credentials so you can reach the database. Use the ones you created when you setup MySQL.  
You also need to know where you want to read/write, to what path.  

```
$pluginName = 'some_plugin';
$path = $pluginName . '/my/data'
$connect = array(
    'plugin_name_handler' => 'infohub_storage_data_mysql', // (Not used) Name of the storage child plugin that can handle this connection
    'plugin_name_owner' => $pluginName, // Level 1 Plugin name that own the data. Also the table name.
    'db_type' => 'mysql', // One of the supported data types
    'db_host' => '127.0.0.1', // IP number or domain name to sql server.
    'db_port' => '3306', // The IP port to the sql server. Leave empty for default 3306
    'db_user' => 'infohubuser', // username on sql server
    'db_password' => 'infohubpassword', // password for username
    'db_name' => 'infohub', // name of the database
);
```

## read
In this PHP example we use the connection credentials from above and send a message to Infohub Storage that we want to read a path.  

```
return $this->_SubCall(array(
        'to' => array(
        'node' => 'server',
        'plugin' => 'infohub_storage',
        'function' => 'read'
    ),
    'data' => array(
        'connect' => $connect,
        'path' => $path
    ),
    'data_back' => array(
        'step' => 'step_end',
    )
));
```

## write
You can write any data you like as long as it fits in the data array. It must be an array.  

```
return $this->_SubCall(array(
    'to' => array(
        'node' => 'server',
        'plugin' => 'infohub_storage',
        'function' => 'write'
    ),
    'data' => array(
        'connect' => $connect,
        'path' => $path,
        'data' => $myDataArray
    ),
    'data_back' => array(
        'step' => 'step_end',
    )
));
```

# How MySQL became NoSQL
The basic parts is that you need a connection, a path and you get/set an array. That is the description of a key/value NoSQL database,
but MySQL is a SQL server, that is not how MySQL works. It has servers, databases, tables, posts, fields, indexes.
Here is how MySQL was turned into a NoSQL document database.  

## Database and user
You need to manually create a database on a MySQL database server and prepare for connection credentials.
The user you set up in the MySQL server must be allowed to handle the database, be allowed to create tables.  

## Tables
The table name equals to the plugin name. The name is always in lower case and it is only level 1 plugins that can store data in the database.
Example names: infohub_exchange, some_name, charzam_cart.  
You can write to a table that does not exist, then it will be created. Tables will never be deleted. If you want to delete a table you have to do that manually.  
The table structure is pre set and will not change. The structure is created for saving json data strings together with a path  
### path
(varchar 127 characters) - The full path. 127 characters seems to be both much and little depending on the user case.
When this plugin is used with Infohub Storage then the path will be a unique checksum that take up less than 127 characters. The reason is that if/when the database is stolen the data will not be useful.  

### Bubble
bubble - the medium size text (max 16 Mb) where the json data will be stored. If you use the plugin with Infohub Storage then this information will be encrypted. The reason is that if/when the database is stolen then the data will not be useful.  
The name "bubble" comes from an earlier more advanced database engine. I took the sad but logical decision to scrap the engine because it was too complicated. I kept this illogical name as a memory.  

# Low level functions
You only see two plugins, read/write. There are other support functions in the plugin.
  
- internal_ConnectionOpen - Opens a connection to an existing MySQL database server with an existing login account.  
- internal_DatabaseCreate - Not used. You need to manually create the database. Exist here for completeness  
- internal_TableCreate - Creates the table if it does not exist  
- internal_PostRead - Gives you the stored text or empty text if the post do not exist. You also get a post_exist 'true'/'false'.  
- internal_PostInsert - When writing data we first read to see if the post exist, if not then PostInsert is used.  
- internal_PostUpdate - When writing data we first read to see if the post exist, if it does then PostUpdate is used.  
- internal_PostDelete - When writing empty data then PostDelete is used.  
- `_HandleSQLError` - See if it is possible to recover from an sql error  
- internal_Execute - This is where the action is. The execution of the query/sql statement.  
- `_SubstituteData` - Values can be substituted in the sql query or bound (see below).  
- `_BindData` - All parameters that are not substituted in the sql query are instead bound to a value.  
- `_Boolean` - Turn a boolean true/false into a string "true" or "false".  

# License
This documentation is copyright (C) 2017 Peter Lembke.  
Permission is granted to copy, distribute and/or modify this document under the terms of the GNU Free Documentation License, Version 1.3 or any later version published by the Free Software Foundation; with no Invariant Sections, no Front-Cover Texts, and no Back-Cover Texts.  
You should have received a copy of the GNU Free Documentation License along with this documentation. If not, see [https://www.gnu.org/licenses/](https://www.gnu.org/licenses/).  SPDX-License-Identifier: GFDL-1.3-or-later  

Since 2017-09-12 by Peter Lembke  
