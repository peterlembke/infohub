# Plan for one plugin

Storage is today three levels of plugins. I want it to be snappy with one level.
The only storage code used is IndexedDB-KeyVal.

If I have IndexedDB-KeyVal and infohub_storage_data built into infohub_storage then less subCalls are needed. Means less _ByVal needed.
That would make the Storage faster.

## Keep the existing
I will keep the existing working code and just rename infohub_storage.js to infohub_storage-original.js
The new code will be in infohub_storage.js

## Functions
Functions and what sub functions they use

### read

WORKS NOW

read -> infohub_storage_data read -> infohub_storage_data_indexeddb read (twice)
Also uses _SetConnectionDefault.

I will focus on read only.

* OK, Move idb-KeyVal to infohub_storage and see if it still works.
* OK, Focus on read and get that working

Now read works and uses no sub calls.

### write

WORKS NOW

Write has two modes, overwrite and merge.
I will copy `write` from idbkeyval and rename to `write_data`. 
The `write` function will call `read` and `write_data` when needed.

* Focus on write_data and get that working as a sub call

### read_many

Uses read to read one path at the time. I want one return message with all data.
I have not built Darkhold yet.

### write_many

WORKS NOW

Today it writes one and waits for the response in a loop.
I want to change that.
Write the data to the memory cache,
Then send a bunch of tail less messages to the write-function,
as I am doing a return call saying all is being saved.

### read_pattern

Today I have a path and call infohub_storage_data -> read_paths,
that calls infohub_storage_data_idbkeyval -> read_paths
and then call read_many

I want to move read_paths to level 1 as a function and use it from read_pattern.

### write_pattern

Today I have a path and call infohub_storage_data -> read_paths,
that calls infohub_storage_data_idbkeyval -> read_paths
and then call write_many

I want to move read_paths to level 1 as a function and use it from write_pattern.
