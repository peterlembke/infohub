# Install Infohub
If you have fulfilled all requirements then it is time to install Infohub.

If you use the vagrant setup then you are done here. Surf to `http://vagrant.infohub.local`

The below instructions cover installation on web hotel or own server.

## HTTPS
If you have HTTPS you will also be able to run the service worker in Infohub. That will make Infohub useful even if you temporarily do not have internet on your device.
We can manage without HTTPS.

## Public folder
Some web hotels have a public folder. Everything in public_html should be there. The rest of the files go outside of that folder. It does not matter what the public folder name is. Infohub will cope.

## Database
You also need to configure a main database in file folder/config/infohub_storage_data.json

@todo Vagrant need a database setup

## Domains
If you have one domain name then the default setting will make sure you will see the login page and then the Workbench. If you want something else or have many domains then copy infohub_exchange.json from the config-examples to config. Create folder/config if it does not exist.

## First login account
Copy infohub_contact.json to the folder/config and modify it to have your domain address.

You can now try to surf to your domain.

Use the login account in folder/config-examples/infohub_login/local.infohub.se.json
You need to modify the domain address.

If everything goes to plan you will then see the login page. Select the login account file and login. And you will then see the Workbench.

# License
This documentation is copyright (C) 2020 Peter Lembke.  
Permission is granted to copy, distribute and/or modify this document under the terms of the GNU Free Documentation License, Version 1.3 or any later version published by the Free Software Foundation; with no Invariant Sections, no Front-Cover Texts, and no Back-Cover Texts.  
You should have received a copy of the GNU Free Documentation License along with this documentation. If not, see [https://www.gnu.org/licenses/](https://www.gnu.org/licenses/).  SPDX-License-Identifier: GFDL-1.3-or-later  

Created 2020-07-22 by Peter Lembke  
Changed 2020-07-23 by Peter Lembke  
