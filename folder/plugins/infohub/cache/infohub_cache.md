# Infohub Cache
Your browser plugin storage  

# Introduction
All major browsers have a feature called localStorage. It is a persistent key-value storage. Infohub_cache use this storage to store plugins.  
When the infohub core in your browser require a plugin then infohub_cache can either give the plugin or conclude that it does not have it.  

# Caching in Infohub
Infohub avoid caching of data. It is better to rethink the solution again or optimize the code rather than using a cache.  

Caches add extra complexity and speeds up bad solutions. Avoid them as much as you can.
  
On the server side there are no infohub_cache (for now at least). On the client infohub_cache are the only plugin that handle the localStorage.
  
infohub_cache only (for now) store plugins in the localStorage. The plugins have been requested from the server and are stored locally for one purpose - offline apps.  

# The browser core
The browser core request plugins from the server. The core are made of plugins. How can it request itself? It can't, instead folder/include/start.js is a mini core that request all core plugins and store them in localStorage.  
This mini core and infohub_cache are the only two that can interact with the localStorage.  

# Usage
First of all, do not use this plugin. Leave the caching to the infohub core. Now, if you want to use this plugin anyhow then this is how you do it:  

* _save_data_to_cache_ : you give `{'prefix': '', 'key': '', 'data': {}, 'checksum': ''}`. The prefix for plugins are "plugin", you use another prefix for your data. If you provide a checksum then your data is only stored if the already stored checksum differs from your provided checksum.  
* _load_data_from_cache_ : you give `{'prefix': '', 'key': ''}` and get a 'data'-string and a 'found' that is 'true' or 'false'.  
* _remove_data_from_cache_ : you give `{'prefix': '', 'key': ''}` and get a message back.  
* _validate_cache_ : Deletes old data. You must give a prefix, you can give a checksums object. `{'prefix': '', 'checksums': {} };` If you give 'checksums' then give all the key and checksum. They will then be used to find old items regardless of cache lifetime.  

# Offline app
There are two benefits with the browser plugin cache. You reduce the number of requests done to the server. 

When you have all the plugins you do not have to ask the server at all, and you can then run the app without a network connection.

# Browser cache life time
The browser cache is handled by [infohub_cache](plugin,infohub_cache).

The cache is updated when it gets old. See `infohub_cache.json`:
```
{
    "client": {
        "client_cache_lifetime": 604740
    },
    "server": {}
}
```   
If you need to change anything in this file then copy the file to `folder/config/infohub_cache.json` and do your changes. Your file will be used instead of the original file.

The default cache lifetime is 604740 seconds. It is 7 days - 60 seconds. (7 * 24 * 60 * 60 - 60).

# License
This documentation is copyright (C) 2016 Peter Lembke.  
Permission is granted to copy, distribute and/or modify this document under the terms of the GNU Free Documentation License, Version 1.3 or any later version published by the Free Software Foundation; with no Invariant Sections, no Front-Cover Texts, and no Back-Cover Texts.  
You should have received a copy of the GNU Free Documentation License along with this documentation. If not, see [https://www.gnu.org/licenses/](https://www.gnu.org/licenses/).  

Created 2016-11-02 by Peter Lembke  
Updated 2020-01-02 by Peter Lembke  