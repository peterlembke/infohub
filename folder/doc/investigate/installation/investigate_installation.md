# Investigate installation
How can we install Infohub in an easy way?

## Background
Installing systems like Magento2, WordPress, Joomla!, Laravel is not that hard but not easy.
I remember that restoring a backup on Joomla! was very easy with uploading a php file that expanded the backup. 

I want Infohub to be easy to install locally in the development environment.  
Be easy to install on a hosted server where you do not have shell-access.

## What Infohub need today

* Clone the Infohub repository
* Copy the `folder/config_example` to `folder/config`.
* If this is a production server then:
  * Change settings to the database `config/infohub_storage_data`
  * Change settings for the domain names `config/infohub_exchange`
  * Change settings for `config/infohub_transfer`
  * Change settings for `config/infohub_contact`
  * Change settings for `config/infohub_login`
  * Change settings for `config/infohub_plugin`

## How Infohub request plugins

Today if frontend need a plugin it checks the Storage.   
If the plugin is not there then it asks the server.  

The server check if there is a file and return it.   
If there is no file it checks the Storage and return it.
If there is still no plugin the return message will inform of that.

The frontend store the plugin in Storage, 
or store that no plugin exist so no requests are done for this plugin.  

## Vision for Infohub

I want the server to ask in more places for the plugin.  
Login to an Infohub server that either give the plugin or know where it is.  
Download a zip of the latest version and unzip it.  
Download SQLite database and use that.  

## Insights

I need some way to configure Infohub. I could have two sets of config files to copy.
* development
* production

I still need custom configuration in infohub_storage_data.
The StorageManager was the plugin that should help with that. 

## Conclusion

I will need to help the user with the configuration.  
I hope I do not have to assist with installations of plugins.

## Actions

* [ ] Investigate how the installation help should work
 
# License
This documentation is copyright (C) 2021 Peter Lembke.  
Permission is granted to copy, distribute and/or modify this document under the terms of the GNU Free Documentation License, Version 1.3 or any later version published by the Free Software Foundation; with no Invariant Sections, no Front-Cover Texts, and no Back-Cover Texts.  
You should have received a copy of the GNU Free Documentation License along with this documentation. If not, see [https://www.gnu.org/licenses/](https://www.gnu.org/licenses/).  SPDX-License-Identifier: GFDL-1.3-or-later  

Created 2021-12-31 by Peter Lembke  
Updated 2022-01-01 by Peter Lembke  
