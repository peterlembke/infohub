# InfoHub Translate Update plugin

Here you can make sure your plugins have proper translation keys.  
You select a plugin name and let this feature review the plugin. If a faulty key is found then a copy of the plugin is created in `file/infohub_translate/{plugin_name.js}` and the translation key is changed.

Reason we have keys like this is that we can read them, and at the same time we realise that we should not change them.  
The en.json file provide translation to english.

## GUI

* Button "Refresh list" refreshes the plugin list we have locally.
* Select one of the plugins.
* Button "Update plugin" will check the plugin and respond if a copy of the plugin had to be created

## Key rules

* Upper case
* Underscore instead of spaces
* Does not end with _KEY
* Does not have \ or ' in them

Example:

* WHAT_IS_THIS?
* CHECKSUM_OF_DOMAIN_ADDRESS_+_USER_NAME_+_SHARED_SECRET.
* THIS_IS_YOU_ON_THE_SERVER
* THESE_SIMPLE_TESTS_SHOW_THAT_THE_RANDOM_CODE_AT_LEAST_IS_NOT_A_FLATLINE_OF_NUMBERS.

## License

This documentation is copyright (C) 2021 Peter Lembke.  
Permission is granted to copy, distribute and/or modify this document under the terms of the GNU Free Documentation
License, Version 1.3 or any later version published by the Free Software Foundation; with no Invariant Sections, no
Front-Cover Links, and no Back-Cover Links.  
You should have received a copy of the GNU Free Documentation License along with this documentation. If not,
see [https://www.gnu.org/licenses/](https://www.gnu.org/licenses/).

## footer

Since 2021-08-15 by Peter Lembke  
Updated 2021-08-15 by Peter Lembke
