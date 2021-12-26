# Configuration file
How to configure Infohub

## Introduction
A plugin can have a configuration file in the same folder as the plugin.  
The plugin can have one configuration file, and it is also used for all its children.

The configuration file is in json and have two sections: "client" and "server".

The configuration in "client" are available to the client plugin in the $in variable to each function.
The configuration in "server" are available to the server plugin in the $in variable to each function.

Only the developer should change this configuration file.

You can copy the configuration file to `folder/config` and edit it there.  
The copy you have in `folder/config` will completely override the original configuration file.

## Example

### Basic set up


### Selective logging
You can easily configure selective logging on function level. Read more at [plugin debug](doc,plugin_debug).
See example in `folder/plugins/infohub/checksum/infohub_checksum.json`.

# License
This documentation is copyright (C) 2020 Peter Lembke.  
Permission is granted to copy, distribute and/or modify this document under the terms of the GNU Free Documentation License, Version 1.3 or any later version published by the Free Software Foundation; with no Invariant Sections, no Front-Cover Texts, and no Back-Cover Texts.  
You should have received a copy of the GNU Free Documentation License along with this documentation. If not, see [https://www.gnu.org/licenses/](https://www.gnu.org/licenses/).  SPDX-License-Identifier: GFDL-1.3-or-later  

Created 2020-05-17 by Peter Lembke  
Updated 2021-08-28 by Peter Lembke  
