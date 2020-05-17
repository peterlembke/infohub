# Installation
How to install Infohub on your server

# requirements
InfoHub require a web server that run a [supported PHP](https://www.php.net/supported-versions.php) and the [latest version](https://browsehappy.com/) of a modern web browser.
If you use login then you need a supported database server like MariaDb. 

# Installation

## Get the code
- Clone or download the files from Github
  - [Download](https://github.com/peterlembke/infohub/archive/master.zip) the installation package and unpack it into your www root
  - [Clone the files](https://github.com/peterlembke/infohub) from the repository.
  
## Folder rights  
Make sure your web server can read and write to all folders in "folder/"

## Config
In `folder/config` you put configuration files. Read details [here](doc,plugin_config). Create the folder if it does not exist.

In `folder/config-example` you find example configuration files that you can copy to `folder/config` and then modify them to suite your setup.

This config process is rather manual. I will improve it in later releases.

### Config domains
In `infohub_exchange.json` you find what domain sends what start message. You can delete all domains you do not use and add your domain instead. 

### Config first user
You can set up one user in config file `infohub_contact.json` that does not require any database setup.

You have a matching user login file in `infohubuser.json` that need the same information.

Modify the file to suite you. Node is the name you call yourself. Modify node, domain_address, user_name. It is easy to damage the shared_secret so let it be for now.

Once you have configured the database and are logged in you can run [Contact](plugin,infohub_contact) and create a new user with a completely random shared_secret and improve the first user data.

### Config database
In `infohub_storage_data.json` you can configure your main database. You can leave section "client" and focus on section "server". You can read details here: [Infohub Storage](plugin,infohub_storage).

# Done
Surf to your domain and [login](plugin,infohub_login) with the login file. 

# License
This documentation is copyright (C) 2016 Peter Lembke.  
Permission is granted to copy, distribute and/or modify this document under the terms of the GNU Free Documentation License, Version 1.3 or any later version published by the Free Software Foundation; with no Invariant Sections, no Front-Cover Texts, and no Back-Cover Texts.  
You should have received a copy of the GNU Free Documentation License along with this documentation. If not, see [https://www.gnu.org/licenses/](https://www.gnu.org/licenses/).  SPDX-License-Identifier: GFDL-1.3-or-later  

Created 2016-04-02 by Peter Lembke  
Changed 2020-05-17 by Peter Lembke  
