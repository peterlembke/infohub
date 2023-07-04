# Installation
How to install InfoHub on your server

# requirements
See [Requirements](requirements/installation_requirements.md)

# Installation

| System      | Docker | Vagrant | MAMP | XAMP | Native |
|-------------|:------:|:-------:|:----:|:----:|:------:|
| macOS Intel |   X    |    X    |  X   |  -   |   X    |
| macOS M1    |   X    |    -    |  X   |  -   |   X    |
| Windows     |   X    |    X    |  X   |  X   |   X    |
| Ubuntu      |   X    |    X    |  -   |  -   |   X    |

## Install a LAMP server
You find a [guide here for Ubuntu 20.04](https://websiteforstudents.com/how-to-install-the-lamp-stack-on-ubuntu-20-04-18-04/). The guide also works well on Raspberry Pi running Ubuntu. Do not install extra PPAs, just jump to install PHP 7.4.

You can also install these:
```
sudo apt-get install php7.4-sqlite3
sudo apt-get install php7.4-redis
sudo apt-get install redis-server
sudo apt-get install php7.4-gnupg
sudo systemctl restart apache2.service
```

## Set up the domain names
Your LAMP server need one or more nice domain names. It is called VHOST. 
If you can read Swedish then you can follow this guide: [Flera domännamn på samma webserver i Ubuntu](http://www.charzam.com/2017/06/02/1342/flera-domannamn-pa-samma-webserver/) or this one [VHOST på macOS](http://www.charzam.com/2016/08/07/1240/satta-upp-vhost-pa-osx-apache/)
Or you can search for vhost apache2 and your operating system.

## Get the code
- Clone or download the files from GitHub
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
You can set up one user in config file `infohub_contact.json` that does not require any database set up.

You have a matching user log in file in `infohubuser.json` that need the same information.

Modify the file to suite you. Node is the name you call yourself. Modify node, domain_address, user_name. It is easy to damage the shared_secret so let it be for now.

Once you have configured the database and are logged in you can run [Contact](plugin,infohub_contact) and create a new user with a completely random shared_secret and improve the first user data.

### Config database
In `infohub_storage_data.json` you can configure your main database. You can leave section "client" and focus on section "server". You can read details here: [InfoHub Storage](plugin,infohub_storage).

# Done
Surf to your domain and [log in](plugin,infohub_login) with the log in file. 

# License
This documentation is copyright (C) 2016 Peter Lembke.  
Permission is granted to copy, distribute and/or modify this document under the terms of the GNU Free Documentation License, Version 1.3 or any later version published by the Free Software Foundation; with no Invariant Sections, no Front-Cover Texts, and no Back-Cover Texts.  
You should have received a copy of the GNU Free Documentation License along with this documentation. If not, see [https://www.gnu.org/licenses/](https://www.gnu.org/licenses/).  SPDX-License-Identifier: GFDL-1.3-or-later  

Created 2016-04-02 by Peter Lembke  
Changed 2020-07-01 by Peter Lembke  
