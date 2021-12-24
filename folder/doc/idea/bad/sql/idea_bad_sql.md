# Traditional tables
In traditional tables I will be able to find a post by its id. This task go beyond that. This task is about searching in traditional tables.

&& sql,table,database

# Key value databases
Get collection is done today by adding a * at the end of the path. Then you get all matching paths in a key-value database.
There is no way to search the data because it is supposed to be encrypted. This task is not about key-value databases.

# Search matching data
Give the path to the table
my_plugin|table_name|*
The * means that we want to search this table.

infohub_storage_search handle the creation of the SQL.

The data is an array with conditions.

## OR condition
```
{
    condition: 'OR'
    value: [
        array with conditions that has OR between them
    ]
}
```

## AND condition
```
{
    condition: 'AND'
    value: [
        array with conditions that has AND between them
    ]
}
```

## Field Condition
```
{
    'field': 'name',
    'condition': '>',  // <, >, <=, >=, =, !=, like, in, not_in, null, not_null
    'value': '5' // string, int, float, boolean, array
}
```
* like - value can then start and/or end with a `*`.
* array - used with condition: in.
* null - need no value
* not_null - need no value

## JOIN condition
There are no JOIN conditions.
I might have dot notation on the fields instead but not in the first version.

## Comment 1
This is a BAD idea because:

* This is not simple - that violate the three ground rules where one is simplicity
* Infohub is about personal data. KeyValue is sufficient in most cases
* I have a task already that add some support for traditional tables

# License
This documentation is copyright (C) 2021 Peter Lembke.  
Permission is granted to copy, distribute and/or modify this document under the terms of the GNU Free Documentation License, Version 1.3 or any later version published by the Free Software Foundation; with no Invariant Sections, no Front-Cover Texts, and no Back-Cover Texts.  
You should have received a copy of the GNU Free Documentation License along with this documentation. If not, see [https://www.gnu.org/licenses/](https://www.gnu.org/licenses/).  SPDX-License-Identifier: GFDL-1.3-or-later

Created 2021-11-21 by Peter Lembke  
Changed 2021-11-21 by Peter Lembke  
